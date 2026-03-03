import assert from "node:assert/strict";
import test from "node:test";
import { resolveRequestHostname } from "./requestHost";

test("resolveRequestHostname prefers x-forwarded-host", () => {
  const headers = new Headers({
    host: "localhost:3000",
    "x-forwarded-host": "preview.example.com"
  });

  assert.equal(resolveRequestHostname(headers), "preview.example.com");
});

test("resolveRequestHostname normalizes ports and csv forwarded hosts", () => {
  const headers = new Headers({
    "x-forwarded-host": "preview.example.com:443, edge.example.net"
  });

  assert.equal(resolveRequestHostname(headers), "preview.example.com");
});

test("resolveRequestHostname falls back to host header", () => {
  const headers = new Headers({
    host: "www.example.com:3000"
  });

  assert.equal(resolveRequestHostname(headers), "www.example.com");
});
