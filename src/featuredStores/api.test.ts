import assert from "node:assert/strict";
import test from "node:test";
import { listFeaturedStores } from "./api";

const ORIGINAL_ENDPOINT = process.env.SITE_FEATURED_STORES_ENDPOINT;
const ORIGINAL_FETCH = global.fetch;

function restoreEnvironment() {
  process.env.SITE_FEATURED_STORES_ENDPOINT = ORIGINAL_ENDPOINT;
  global.fetch = ORIGINAL_FETCH;
}

test("listFeaturedStores uses configured endpoint and revalidate value", async (t) => {
  t.after(restoreEnvironment);

  process.env.SITE_FEATURED_STORES_ENDPOINT = "https://example.com/site/featured";

  const calls: Array<{ input: string | URL | Request; init?: RequestInit }> = [];
  global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input, init });
    return new Response(
      JSON.stringify([
        {
          id: "store-1",
          name: "Brechó Central",
          coverImageUrl: "https://cdn.example.com/store-1.jpg"
        }
      ]),
      { status: 200 }
    );
  }) as typeof fetch;

  const stores = await listFeaturedStores({ revalidate: 180 });

  assert.equal(String(calls[0]?.input), "https://example.com/site/featured");
  assert.equal((calls[0]?.init as { next?: { revalidate?: number } })?.next?.revalidate, 180);
  assert.deepEqual(stores, [
    {
      id: "store-1",
      name: "Brechó Central",
      coverImageUrl: "https://cdn.example.com/store-1.jpg"
    }
  ]);
});

test("listFeaturedStores filters malformed entries", async (t) => {
  t.after(restoreEnvironment);

  global.fetch = (async () =>
    new Response(
      JSON.stringify([
        {
          id: "valid",
          name: "Loja Válida",
          coverImageUrl: "https://cdn.example.com/valid.jpg"
        },
        {
          id: "",
          name: "Sem id",
          coverImageUrl: "https://cdn.example.com/invalid.jpg"
        },
        {
          id: "missing-image",
          name: "Sem imagem"
        }
      ]),
      { status: 200 }
    )) as typeof fetch;

  const stores = await listFeaturedStores();

  assert.deepEqual(stores, [
    {
      id: "valid",
      name: "Loja Válida",
      coverImageUrl: "https://cdn.example.com/valid.jpg"
    }
  ]);
});

test("listFeaturedStores throws on non-ok response", async (t) => {
  t.after(restoreEnvironment);

  global.fetch = (async () => new Response("unauthorized", { status: 401 })) as typeof fetch;

  await assert.rejects(
    () => listFeaturedStores(),
    /Failed to load featured stores\. Status 401/
  );
});
