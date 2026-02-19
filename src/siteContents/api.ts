import { selectApiBase } from "../apiBase";
import { loggedFetch } from "../shared/http/loggedFetch";
import type { ContentSort, GuideContentCommentDto, GuideContentDto, PageResponse } from "./types";

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

type ListGuideContentsParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  sort?: ContentSort;
  storeId?: string;
  token?: string | null;
  cache?: RequestCache;
  revalidate?: number;
};

type ListGuideContentCommentsParams = {
  page?: number;
  pageSize?: number;
  token?: string | null;
  cache?: RequestCache;
  revalidate?: number;
};

type RequestOptions = {
  token?: string | null;
  cache?: RequestCache;
  revalidate?: number;
};

type ApiErrorPayload = {
  message?: unknown;
};

export class SiteContentsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SiteContentsApiError";
    this.status = status;
  }
}

export function extractApiErrorMessage(payload: ApiErrorPayload | null | undefined, fallback: string): string {
  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  return fallback;
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

function sanitizeSort(value: ContentSort | undefined): ContentSort {
  return value === "oldest" ? "oldest" : "newest";
}

function buildHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json"
  };

  const normalized = token?.trim();
  if (normalized) {
    headers.Authorization = normalized.toLowerCase().startsWith("bearer ")
      ? normalized
      : `Bearer ${normalized}`;
  }

  return headers;
}

async function parseError(response: Response): Promise<never> {
  const fallbackMessage = "Nao foi possivel carregar os conteudos.";
  let message = fallbackMessage;

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    message = extractApiErrorMessage(payload, fallbackMessage);
  } catch {
    // Keep generic fallback for malformed/non-JSON responses.
  }

  throw new SiteContentsApiError(response.status, message);
}

async function requestJson<T>(path: string, searchParams: URLSearchParams, options?: RequestOptions): Promise<T> {
  const selectedApiBase = selectApiBase();
  if (!selectedApiBase) {
    throw new SiteContentsApiError(503, "API base URL nao configurada.");
  }

  const baseUrl = selectedApiBase.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (searchParams.toString()) {
    url.search = searchParams.toString();
  }

  const requestOptions: RequestInit & { next?: { revalidate: number } } = {
    method: "GET",
    headers: buildHeaders(options?.token)
  };

  if (options?.cache) {
    requestOptions.cache = options.cache;
  }

  if (typeof options?.revalidate === "number") {
    requestOptions.next = { revalidate: options.revalidate };
  }

  const response = await loggedFetch(url.toString(), requestOptions, {
    label: "site-contents"
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as T;
}

export async function listSiteGuideContents(
  params?: ListGuideContentsParams
): Promise<PageResponse<GuideContentDto>> {
  const searchParams = new URLSearchParams();
  const page = sanitizePage(params?.page);
  const pageSize = sanitizePageSize(params?.pageSize);

  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  searchParams.set("sort", sanitizeSort(params?.sort));

  const q = params?.q?.trim();
  if (q) searchParams.set("q", q);

  const storeId = params?.storeId?.trim();
  if (storeId) searchParams.set("storeId", storeId);

  return requestJson<PageResponse<GuideContentDto>>("/site/contents", searchParams, {
    token: params?.token,
    cache: params?.cache,
    revalidate: params?.revalidate
  });
}

export async function getSiteGuideContentById(
  id: number,
  options?: RequestOptions
): Promise<GuideContentDto> {
  return requestJson<GuideContentDto>(`/site/contents/${id}`, new URLSearchParams(), {
    token: options?.token,
    cache: options?.cache,
    revalidate: options?.revalidate
  });
}

export async function listSiteGuideContentComments(
  id: number,
  params?: ListGuideContentCommentsParams
): Promise<PageResponse<GuideContentCommentDto>> {
  const searchParams = new URLSearchParams();
  const page = sanitizePage(params?.page);
  const pageSize = sanitizePageSize(params?.pageSize);

  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));

  return requestJson<PageResponse<GuideContentCommentDto>>(
    `/site/contents/${id}/comments`,
    searchParams,
    {
      token: params?.token,
      cache: params?.cache,
      revalidate: params?.revalidate
    }
  );
}
