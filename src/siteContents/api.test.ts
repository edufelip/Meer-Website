import assert from "node:assert/strict";
import test from "node:test";
import { extractApiErrorMessage } from "./api";

test("extractApiErrorMessage returns payload message when available", () => {
  const message = extractApiErrorMessage({ message: "  backend message  " }, "fallback");
  assert.equal(message, "backend message");
});

test("extractApiErrorMessage falls back when payload is invalid", () => {
  assert.equal(extractApiErrorMessage({ message: "" }, "fallback"), "fallback");
  assert.equal(extractApiErrorMessage({ message: 123 as unknown as string }, "fallback"), "fallback");
  assert.equal(extractApiErrorMessage(undefined, "fallback"), "fallback");
});
