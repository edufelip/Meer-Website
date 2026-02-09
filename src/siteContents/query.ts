import type { Route } from "next";
import type { ContentSort } from "./types";

type QueryValue = string | string[] | undefined;

type ContentsQuery = {
  page: number;
  pageSize: number;
  q: string;
  sort: ContentSort;
  storeId: string;
};

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function first(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNonNegativeInt(value: QueryValue, fallback: number): number {
  const raw = first(value);
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;

  return parsed;
}

function parsePageSize(value: QueryValue, fallback: number): number {
  const parsed = parseNonNegativeInt(value, fallback);
  const safeValue = parsed < 1 ? fallback : parsed;
  return Math.min(MAX_PAGE_SIZE, safeValue);
}

function parseSort(value: QueryValue): ContentSort {
  return first(value) === "oldest" ? "oldest" : "newest";
}

function parseText(value: QueryValue): string {
  return (first(value) ?? "").trim();
}

export function parseContentsQuery(
  searchParams: Record<string, QueryValue> | undefined
): ContentsQuery {
  return {
    page: parseNonNegativeInt(searchParams?.page, DEFAULT_PAGE),
    pageSize: parsePageSize(searchParams?.pageSize, DEFAULT_PAGE_SIZE),
    q: parseText(searchParams?.q),
    sort: parseSort(searchParams?.sort),
    storeId: parseText(searchParams?.storeId)
  };
}

export function parseCommentsPage(searchParams: Record<string, QueryValue> | undefined): number {
  return parseNonNegativeInt(searchParams?.commentsPage, DEFAULT_PAGE);
}

export function buildContentsHref(query: Partial<ContentsQuery>): Route {
  const params = new URLSearchParams();
  const page = query.page ?? DEFAULT_PAGE;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const sort = query.sort ?? "newest";

  params.set("page", String(Math.max(0, page)));
  params.set("pageSize", String(Math.min(MAX_PAGE_SIZE, Math.max(1, pageSize))));
  params.set("sort", sort === "oldest" ? "oldest" : "newest");

  const q = query.q?.trim();
  if (q) params.set("q", q);

  const storeId = query.storeId?.trim();
  if (storeId) params.set("storeId", storeId);

  return `/contents?${params.toString()}` as Route;
}
