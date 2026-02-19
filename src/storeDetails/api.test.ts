import assert from "node:assert/strict";
import test from "node:test";
import { extractApiErrorMessage, getSiteStoreById, listSiteStores, SiteStoreDetailsApiError } from "./api";

const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ORIGINAL_SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST;

function restoreEnvironment() {
  global.fetch = ORIGINAL_FETCH;
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_API_BASE;
  process.env.NEXT_PUBLIC_SITE_HOST = ORIGINAL_SITE_HOST;
}

test("extractApiErrorMessage returns payload message when available", () => {
  const message = extractApiErrorMessage({ message: "  Store not found  " }, "fallback");
  assert.equal(message, "Store not found");
});

test("getSiteStoreById uses /site/stores/{id} and normalizes payload", async (t) => {
  t.after(restoreEnvironment);

  process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";
  process.env.NEXT_PUBLIC_SITE_HOST = "guiabrecho.com.br";

  const calls: Array<{ input: string | URL | Request; init?: RequestInit }> = [];

  global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input, init });

    return new Response(
      JSON.stringify({
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Vintage Spot",
        coverImageUrl: "https://cdn.example.com/stores/cover.jpg",
        addressLine: "Rua Exemplo, 123",
        latitude: -23.55,
        longitude: -46.63,
        openingHours: "Mon-Sat 10:00-18:00",
        instagram: "https://instagram.com/vintagespot",
        categories: ["vintage", "streetwear", ""],
        rating: 4.7,
        reviewCount: 12,
        badgeLabel: "Top Rated",
        isFavorite: false,
        isOnlineStore: false,
        images: [
          { id: 2, url: "https://cdn.example.com/stores/img2.jpg", displayOrder: 1, isCover: false },
          { id: 1, url: "https://cdn.example.com/stores/img1.jpg", displayOrder: 0, isCover: true },
          { id: null, url: "invalid", displayOrder: 2, isCover: false }
        ],
        createdAt: "2024-01-01T00:00:00Z"
      }),
      { status: 200 }
    );
  }) as typeof fetch;

  const store = await getSiteStoreById("123e4567-e89b-12d3-a456-426614174000", { revalidate: 90 });

  assert.equal(String(calls[0]?.input), "https://example.com/site/stores/123e4567-e89b-12d3-a456-426614174000");
  assert.equal((calls[0]?.init as { next?: { revalidate?: number } })?.next?.revalidate, 90);
  assert.deepEqual(store.categories, ["vintage", "streetwear"]);
  assert.equal(store.images.length, 2);
  assert.equal(store.images[0]?.id, 1);
  assert.equal(store.images[1]?.id, 2);
});

test("getSiteStoreById maps backend errors", async (t) => {
  t.after(restoreEnvironment);

  process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";
  process.env.NEXT_PUBLIC_SITE_HOST = "guiabrecho.com.br";

  global.fetch = (async () =>
    new Response(JSON.stringify({ message: "Invalid request parameter" }), { status: 400 })) as typeof fetch;

  await assert.rejects(
    () => getSiteStoreById("invalid-id"),
    (error: unknown) => {
      assert.ok(error instanceof SiteStoreDetailsApiError);
      assert.equal(error.status, 400);
      assert.equal(error.message, "Invalid request parameter");
      return true;
    }
  );
});

test("listSiteStores uses paginated stores endpoint", async (t) => {
  t.after(restoreEnvironment);

  process.env.NEXT_PUBLIC_API_BASE_URL = "https://example.com";
  process.env.NEXT_PUBLIC_SITE_HOST = "guiabrecho.com.br";

  const calls: Array<{ input: string | URL | Request; init?: RequestInit }> = [];

  global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input, init });
    return new Response(
      JSON.stringify({
        items: [
          { id: "store-1", createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-02T00:00:00Z" },
          { id: "store-2", createdAt: "2024-01-01T00:00:00Z", updatedAt: null }
        ],
        page: 0,
        hasNext: true
      }),
      { status: 200 }
    );
  }) as typeof fetch;

  const response = await listSiteStores({ page: 0, pageSize: 100, revalidate: 120 });

  assert.equal(String(calls[0]?.input), "https://example.com/site/stores?page=0&pageSize=100");
  assert.equal((calls[0]?.init as { next?: { revalidate?: number } })?.next?.revalidate, 120);
  assert.equal(response.page, 0);
  assert.equal(response.hasNext, true);
  assert.equal(response.items.length, 2);
  assert.equal(response.items[0]?.id, "store-1");
});
