import type { Metadata } from "next";
import type { ContentsQuery } from "./query";

const DEFAULT_PAGE_SIZE = 20;
const CONTENTS_CANONICAL_PATH = "/contents";
const CONTENTS_DEFAULT_TITLE = "Conteúdos de Brechó | Guia Brechó";
const CONTENTS_DEFAULT_DESCRIPTION =
  "Encontre conteúdos sobre brechós, consumo consciente e dicas para garimpar melhor.";

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildContentsCanonicalPath(query: ContentsQuery): string {
  if (query.q || query.storeId) return CONTENTS_CANONICAL_PATH;

  const params = new URLSearchParams();

  if (query.page > 0) {
    params.set("page", String(query.page));
  }

  if (query.sort === "oldest") {
    params.set("sort", query.sort);
  }

  if (query.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(query.pageSize));
  }

  return params.toString() ? `${CONTENTS_CANONICAL_PATH}?${params.toString()}` : CONTENTS_CANONICAL_PATH;
}

export function buildContentsMetadata(query: ContentsQuery): Metadata {
  const hasSearchFilters = Boolean(query.q || query.storeId);
  const canonicalPath = buildContentsCanonicalPath(query);
  const robotsIndex = !hasSearchFilters;

  const title = query.q
    ? `Busca por "${truncate(normalizeWhitespace(query.q), 48)}" | Conteúdos Guia Brechó`
    : query.page > 0
      ? `Conteúdos - Página ${query.page + 1} | Guia Brechó`
      : CONTENTS_DEFAULT_TITLE;

  const description = query.q
    ? `Resultados de busca para "${truncate(normalizeWhitespace(query.q), 64)}" no Guia Brechó.`
    : CONTENTS_DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    robots: {
      index: robotsIndex,
      follow: true
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonicalPath,
      title,
      description,
      siteName: "Guia Brechó"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

export function buildContentDescription(description: string): string {
  const normalized = normalizeWhitespace(description);
  if (!normalized) return "Veja detalhes deste conteúdo no Guia Brechó.";
  return truncate(normalized, 160);
}

export function parseIsoDateOrUndefined(value: string): string | undefined {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function parseAbsoluteUrlOrUndefined(value: string): string | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;

  try {
    const parsed = new URL(normalized);
    return parsed.toString();
  } catch {
    return undefined;
  }
}
