import assert from "node:assert/strict";
import test from "node:test";
import { extractApiErrorMessage, listSiteGuideContents } from "./api";

const ORIGINAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ORIGINAL_DEV_API_BASE = process.env.NEXT_PUBLIC_DEV_API_BASE_URL;
const ORIGINAL_SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST;
const ORIGINAL_FETCH = global.fetch;

function restoreEnvironment() {
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_API_BASE;
  process.env.NEXT_PUBLIC_DEV_API_BASE_URL = ORIGINAL_DEV_API_BASE;
  process.env.NEXT_PUBLIC_SITE_HOST = ORIGINAL_SITE_HOST;
  global.fetch = ORIGINAL_FETCH;
}

test("extractApiErrorMessage returns payload message when available", () => {
  const message = extractApiErrorMessage({ message: "  backend message  " }, "fallback");
  assert.equal(message, "backend message");
});

test("extractApiErrorMessage falls back when payload is invalid", () => {
  assert.equal(extractApiErrorMessage({ message: "" }, "fallback"), "fallback");
  assert.equal(extractApiErrorMessage({ message: 123 as unknown as string }, "fallback"), "fallback");
  assert.equal(extractApiErrorMessage(undefined, "fallback"), "fallback");
});

test("listSiteGuideContents uses explicit hostname when env is not configured", async (t) => {
  t.after(restoreEnvironment);

  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_DEV_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_SITE_HOST;

  const calls: Array<{ input: string | URL | Request; init?: RequestInit }> = [];
  global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input, init });
    return new Response(
      JSON.stringify({
        items: [],
        page: 0,
        hasNext: false
      }),
      { status: 200 }
    );
  }) as typeof fetch;

  await listSiteGuideContents({
    page: 0,
    pageSize: 8,
    sort: "newest",
    hostname: "example.com"
  });

  assert.equal(
    String(calls[0]?.input),
    "https://api.example.com/site/contents?page=0&pageSize=8&sort=newest"
  );
});
