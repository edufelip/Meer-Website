import assert from "node:assert/strict";
import test from "node:test";
import { selectApiBase } from "./apiBase";

const ORIGINAL_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const ORIGINAL_DEV_API_BASE = process.env.NEXT_PUBLIC_DEV_API_BASE_URL;
const ORIGINAL_SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST;

function restoreEnvironment() {
  process.env.NEXT_PUBLIC_API_BASE_URL = ORIGINAL_API_BASE;
  process.env.NEXT_PUBLIC_DEV_API_BASE_URL = ORIGINAL_DEV_API_BASE;
  process.env.NEXT_PUBLIC_SITE_HOST = ORIGINAL_SITE_HOST;
}

test("selectApiBase uses production env for production hosts", (t) => {
  t.after(restoreEnvironment);

  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
  process.env.NEXT_PUBLIC_DEV_API_BASE_URL = "https://api.dev.example.com";

  assert.equal(selectApiBase("guiabrecho.com.br"), "https://api.example.com");
});

test("selectApiBase uses dev env for development hosts", (t) => {
  t.after(restoreEnvironment);

  process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";
  process.env.NEXT_PUBLIC_DEV_API_BASE_URL = "https://api.dev.example.com";

  assert.equal(selectApiBase("dev.guiabrecho.com.br"), "https://api.dev.example.com");
  assert.equal(selectApiBase("localhost"), "https://api.dev.example.com");
});

test("selectApiBase infers api host when env vars are missing", (t) => {
  t.after(restoreEnvironment);

  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_DEV_API_BASE_URL;

  assert.equal(selectApiBase("example.com"), "https://api.example.com");
  assert.equal(selectApiBase("dev.example.com"), "https://api.dev.example.com");
});

test("selectApiBase falls back to localhost for local hosts without env vars", (t) => {
  t.after(restoreEnvironment);

  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_DEV_API_BASE_URL;

  assert.equal(selectApiBase("localhost"), "http://localhost:8080");
  assert.equal(selectApiBase("127.0.0.1"), "http://localhost:8080");
});
