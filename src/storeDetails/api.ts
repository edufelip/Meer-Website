import { selectApiBase } from "../apiBase";
import { loggedFetch } from "../shared/http/loggedFetch";
import type { StoreDetails, StoreDetailsImage } from "./types";

type RequestOptions = {
  cache?: RequestCache;
  revalidate?: number;
};

type ApiErrorPayload = {
  message?: unknown;
};

const STORE_DETAILS_REVALIDATE_SECONDS = 180;

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
