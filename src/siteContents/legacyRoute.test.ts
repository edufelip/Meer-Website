import assert from "node:assert/strict";
import test from "node:test";
import { buildLegacyContentRedirectPath } from "./legacyRoute";

test("buildLegacyContentRedirectPath creates redirect path with query params", () => {
  const redirectPath = buildLegacyContentRedirectPath("12", {
    commentsPage: "2",
    q: "camisa"
  });

  assert.equal(redirectPath, "/content/12?commentsPage=2&q=camisa");
});

test("buildLegacyContentRedirectPath preserves repeated query params", () => {
  const redirectPath = buildLegacyContentRedirectPath("12", {
    tags: ["um", "dois"]
  });

  assert.equal(redirectPath, "/content/12?tags=um&tags=dois");
});

test("buildLegacyContentRedirectPath returns null for malformed id", () => {
  assert.equal(buildLegacyContentRedirectPath("%", { a: "1" }), null);
});
