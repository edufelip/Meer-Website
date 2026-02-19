import { selectApiBase } from "../apiBase";
import { loggedFetch } from "../shared/http/loggedFetch";
import type { StoreDetails, StoreDetailsImage, StoreListItem, StoreListPageResponse } from "./types";

type RequestOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

type ListStoresParams = RequestOptions & {
  page?: number;
  pageSize?: number;
};

type ApiErrorPayload = {
  message?: unknown;
};

const STORE_DETAILS_REVALIDATE_SECONDS = 180;
const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 200;

export class SiteStoreDetailsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SiteStoreDetailsApiError";
    this.status = status;
  }
}

export function extractApiErrorMessage(payload: ApiErrorPayload | null | undefined, fallback: string): string {
  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  return fallback;
}

function normalizeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeBoolean(value: unknown): boolean {
  return value === true;
}

function sanitizePage(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_PAGE;
  return Math.max(DEFAULT_PAGE, Math.trunc(value ?? DEFAULT_PAGE));
}

function sanitizePageSize(value: number | undefined): number {
  if (!Number.isFinite(value)) return DEFAULT_PAGE_SIZE;
  const parsed = Math.trunc(value ?? DEFAULT_PAGE_SIZE);
  return Math.min(MAX_PAGE_SIZE, Math.max(1, parsed));
}

function normalizeCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => Boolean(item));
}

function normalizeImage(item: unknown): StoreDetailsImage | null {
  if (!item || typeof item !== "object") return null;

  const candidate = item as Record<string, unknown>;
  const id = normalizeNumber(candidate.id);
  const url = normalizeString(candidate.url);
  const displayOrder = normalizeNumber(candidate.displayOrder);

  if (id === null || !url) return null;

  return {
    id,
    url,
    displayOrder: displayOrder ?? 0,
    isCover: normalizeBoolean(candidate.isCover)
  };
}

function normalizeStoreListItem(item: unknown): StoreListItem | null {
  if (!item || typeof item !== "object") return null;

  const candidate = item as Record<string, unknown>;
  const id = normalizeString(candidate.id);
  if (!id) return null;

  return {
    id,
    createdAt: normalizeString(candidate.createdAt),
    updatedAt: normalizeString(candidate.updatedAt)
  };
}

function normalizeStoreListResponse(
  payload: unknown,
  fallbackPage: number
): StoreListPageResponse {
  if (Array.isArray(payload)) {
    return {
      items: payload
        .map(normalizeStoreListItem)
        .filter((item): item is StoreListItem => Boolean(item)),
      page: fallbackPage,
      hasNext: false
    };
  }

  if (!payload || typeof payload !== "object") {
    throw new SiteStoreDetailsApiError(500, "Resposta invalida da API de lojas.");
  }

  const candidate = payload as Record<string, unknown>;
  const itemsRaw = Array.isArray(candidate.items) ? candidate.items : [];
  const page = typeof candidate.page === "number" && Number.isFinite(candidate.page)
    ? Math.max(0, Math.trunc(candidate.page))
    : fallbackPage;

  return {
    items: itemsRaw
      .map(normalizeStoreListItem)
      .filter((item): item is StoreListItem => Boolean(item)),
    page,
    hasNext: candidate.hasNext === true
  };
}

function normalizeImages(value: unknown): StoreDetailsImage[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(normalizeImage)
    .filter((image): image is StoreDetailsImage => Boolean(image))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function normalizeStore(payload: unknown): StoreDetails {
  if (!payload || typeof payload !== "object") {
    throw new SiteStoreDetailsApiError(500, "Resposta invalida da API de lojas.");
  }

  const candidate = payload as Record<string, unknown>;
  const id = normalizeString(candidate.id);
  const name = normalizeString(candidate.name);

  if (!id || !name) {
    throw new SiteStoreDetailsApiError(500, "Resposta invalida da API de lojas.");
  }

  return {
    id,
    name,
    coverImageUrl: normalizeString(candidate.coverImageUrl),
    addressLine: normalizeString(candidate.addressLine),
    latitude: normalizeNumber(candidate.latitude),
    longitude: normalizeNumber(candidate.longitude),
    openingHours: normalizeString(candidate.openingHours),
    facebook: normalizeString(candidate.facebook),
    instagram: normalizeString(candidate.instagram),
    website: normalizeString(candidate.website),
    phone: normalizeString(candidate.phone),
    whatsapp: normalizeString(candidate.whatsapp),
    categories: normalizeCategories(candidate.categories),
    rating: normalizeNumber(candidate.rating),
    reviewCount: normalizeNumber(candidate.reviewCount),
    neighborhood: normalizeString(candidate.neighborhood),
    badgeLabel: normalizeString(candidate.badgeLabel),
    isFavorite: normalizeBoolean(candidate.isFavorite),
    isOnlineStore: normalizeBoolean(candidate.isOnlineStore),
    description: normalizeString(candidate.description),
    images: normalizeImages(candidate.images),
    createdAt: normalizeString(candidate.createdAt)
  };
}

function buildStoreDetailsUrl(id: string): string {
  const selectedApiBase = selectApiBase();
  if (!selectedApiBase) {
    throw new SiteStoreDetailsApiError(503, "API base URL nao configurada.");
  }

  const baseUrl = selectedApiBase.replace(/\/+$/, "");
  const encoded = encodeURIComponent(id);
  return `${baseUrl}/site/stores/${encoded}`;
}

function buildStoresListUrl(searchParams: URLSearchParams): string {
  const selectedApiBase = selectApiBase();
  if (!selectedApiBase) {
    throw new SiteStoreDetailsApiError(503, "API base URL nao configurada.");
  }

  const baseUrl = selectedApiBase.replace(/\/+$/, "");
  const url = new URL(`${baseUrl}/site/stores`);
  url.search = searchParams.toString();
  return url.toString();
}

async function parseError(response: Response): Promise<never> {
  const fallback = "Nao foi possivel carregar a loja.";
  let message = fallback;

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    message = extractApiErrorMessage(payload, fallback);
  } catch {
    // Keep fallback when error payload is malformed.
  }

  throw new SiteStoreDetailsApiError(response.status, message);
}

export async function getSiteStoreById(id: string, options?: RequestOptions): Promise<StoreDetails> {
  const normalizedId = id.trim();
  if (!normalizedId) {
    throw new SiteStoreDetailsApiError(400, "Identificador de loja invalido.");
  }

  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: options?.revalidate ?? STORE_DETAILS_REVALIDATE_SECONDS
    }
  };

  if (options?.cache) {
    requestOptions.cache = options.cache;
  }

  const response = await loggedFetch(buildStoreDetailsUrl(normalizedId), requestOptions, {
    label: "store-details"
  });

  if (!response.ok) {
    await parseError(response);
  }

  const payload = (await response.json()) as unknown;
  return normalizeStore(payload);
}

export async function listSiteStores(params?: ListStoresParams): Promise<StoreListPageResponse> {
  const page = sanitizePage(params?.page);
  const pageSize = sanitizePageSize(params?.pageSize);
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));

  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: params?.revalidate ?? STORE_DETAILS_REVALIDATE_SECONDS
    }
  };

  if (params?.cache) {
    requestOptions.cache = params.cache;
  }

  const response = await loggedFetch(buildStoresListUrl(searchParams), requestOptions, {
    label: "store-list"
  });

  if (!response.ok) {
    await parseError(response);
  }

  const payload = (await response.json()) as unknown;
  return normalizeStoreListResponse(payload, page);
}
