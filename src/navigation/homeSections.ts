const HOME_SECTION_IDS = ["conteudos", "destaques"] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export const HOME_SECTION_QUERY_PARAM = "section";

const HOME_SECTION_SET = new Set<string>(HOME_SECTION_IDS);
const DEFAULT_HEADER_HEIGHT_PX = 80;
const HEADER_EXTRA_OFFSET_PX = 12;
const HEADER_SELECTOR = "[data-site-header]";

export function parseHomeSection(value: string | null | undefined): HomeSectionId | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!HOME_SECTION_SET.has(normalized)) {
    return null;
  }

  return normalized as HomeSectionId;
}

export function buildHomeSectionPath(sectionId: HomeSectionId): string {
  return `/?${HOME_SECTION_QUERY_PARAM}=${sectionId}`;
}

export function resolveHomeSectionIntent(search: string, hash: string): HomeSectionId | null {
  const queryParams = new URLSearchParams(search);
  const fromQuery = parseHomeSection(queryParams.get(HOME_SECTION_QUERY_PARAM));

  if (fromQuery) {
    return fromQuery;
  }

  return parseHomeSection(hash.replace(/^#/, ""));
}

export function removeHomeSectionIntentQueryParam(search: string): string {
  const queryParams = new URLSearchParams(search);
  queryParams.delete(HOME_SECTION_QUERY_PARAM);
  const nextQuery = queryParams.toString();

  return nextQuery ? `?${nextQuery}` : "";
}

function getHeaderOffsetPx(): number {
  if (typeof document === "undefined") {
    return DEFAULT_HEADER_HEIGHT_PX + HEADER_EXTRA_OFFSET_PX;
  }

  const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
  const measuredHeight = header?.getBoundingClientRect().height ?? DEFAULT_HEADER_HEIGHT_PX;

  return Math.round(measuredHeight + HEADER_EXTRA_OFFSET_PX);
}

export function scrollToHomeSection(
  sectionId: HomeSectionId,
  behavior: ScrollBehavior = "smooth"
): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return false;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffsetPx();
  window.scrollTo({
    top: Math.max(top, 0),
    behavior
  });

  return true;
}
