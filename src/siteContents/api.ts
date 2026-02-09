import { selectApiBase } from "../apiBase";
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

type SiteApiLogMeta = {
  path: string;
  url: string;
  status?: number;
  durationMs: number;
  errorMessage?: string;
  curl: string;
};

export class SiteContentsApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SiteContentsApiError";
    this.status = status;
  }
}

function logSiteApi(event: "request_ok" | "request_error", meta: SiteApiLogMeta) {
  const prefix = `[site-api] ${event}`;
  const base = `${prefix} path=${meta.path} status=${meta.status ?? "-"} durationMs=${meta.durationMs}`;

  if (event === "request_error") {
    console.error(`${base} url=${meta.url} message=${meta.errorMessage ?? "-"}`);
    console.error(`[site-api] curl ${meta.curl}`);
    return;
  }

  console.info(`${base} url=${meta.url}`);
  console.info(`[site-api] curl ${meta.curl}`);
}

function shellEscape(value: string): string {
  return `'${value.replace(/'/g, `'\"'\"'`)}'`;
}

function redactedHeaderValue(name: string, value: string): string {
  if (name.toLowerCase() === "authorization") {
    return "Bearer <redacted>";
  }
  return value;
}

function buildCurl(url: string, headers: HeadersInit): string {
  const parts = ["curl", "-X", "GET", shellEscape(url)];
  const entries = Object.entries(headers);

  for (const [key, rawValue] of entries) {
    const value = Array.isArray(rawValue) ? rawValue.join(",") : String(rawValue);
    parts.push("-H", shellEscape(`${key}: ${redactedHeaderValue(key, value)}`));
  }

  return parts.join(" ");
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
  let message = "Nao foi possivel carregar os conteudos.";

  try {
    const payload = (await response.json()) as ApiErrorPayload;
    if (typeof payload?.message === "string" && payload.message.trim()) {
      message = payload.message.trim();
    }
  } catch {
    // Keep generic fallback for malformed/non-JSON responses.
  }

  throw new SiteContentsApiError(response.status, message);
}

async function requestJson<T>(path: string, searchParams: URLSearchParams, options?: RequestOptions): Promise<T> {
  const baseUrl = selectApiBase().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);
  const startedAt = Date.now();

  if (searchParams.toString()) {
    url.search = searchParams.toString();
  }

  const headers = buildHeaders(options?.token);
  const curl = buildCurl(url.toString(), headers);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
    cache:
      typeof options?.revalidate === "number"
        ? options?.cache
        : (options?.cache ?? "no-store"),
    ...(typeof options?.revalidate === "number" ? { next: { revalidate: options.revalidate } } : {})
  });

  if (!response.ok) {
    let parsedError: SiteContentsApiError | null = null;

    try {
      await parseError(response);
    } catch (error) {
      parsedError = error instanceof SiteContentsApiError
        ? error
        : new SiteContentsApiError(response.status, "Falha ao carregar dados.");
    }

    const finalError = parsedError ?? new SiteContentsApiError(response.status, "Falha ao carregar dados.");

    logSiteApi("request_error", {
      path: normalizedPath,
      url: url.toString(),
      status: response.status,
      durationMs: Date.now() - startedAt,
      errorMessage: finalError.message,
      curl
    });

    throw finalError;
  }

  logSiteApi("request_ok", {
    path: normalizedPath,
    url: url.toString(),
    status: response.status,
    durationMs: Date.now() - startedAt,
    curl
  });

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
    token: options?.token
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
