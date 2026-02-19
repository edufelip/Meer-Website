import type { FeaturedStore } from "./types";

const DEFAULT_FEATURED_STORES_ENDPOINT = "https://api.guiabrecho.com.br/site/featured";
const FEATURED_STORES_REVALIDATE_SECONDS = 300;

type FeaturedStoresApiOptions = {
  revalidate?: number;
};

function resolveFeaturedStoresEndpoint(): string {
  const configured = process.env.SITE_FEATURED_STORES_ENDPOINT?.trim();
  return configured || DEFAULT_FEATURED_STORES_ENDPOINT;
}

function normalizeStore(item: unknown): FeaturedStore | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const coverImageUrl = typeof candidate.coverImageUrl === "string"
    ? candidate.coverImageUrl.trim()
    : "";

  if (!id || !name || !coverImageUrl) {
    return null;
  }

  return { id, name, coverImageUrl };
}

export async function listFeaturedStores(
  options?: FeaturedStoresApiOptions
): Promise<FeaturedStore[]> {
  const endpoint = resolveFeaturedStoresEndpoint();
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: options?.revalidate ?? FEATURED_STORES_REVALIDATE_SECONDS
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load featured stores. Status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeStore).filter((store): store is FeaturedStore => Boolean(store));
}
