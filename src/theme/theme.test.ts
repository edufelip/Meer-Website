import assert from "node:assert/strict";
import test from "node:test";
import { applyTheme, normalizeTheme } from "./theme";

test("normalizeTheme defaults to light unless dark is explicitly set", () => {
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme(""), "light");
  assert.equal(normalizeTheme(null), "light");
  assert.equal(normalizeTheme(undefined), "light");
});

test("applyTheme is a no-op when document is unavailable", () => {
  const originalDocument = (globalThis as { document?: unknown }).document;

  delete (globalThis as { document?: unknown }).document;
  assert.doesNotThrow(() => applyTheme("dark"));

  (globalThis as { document?: unknown }).document = originalDocument;
});

test("applyTheme updates class and color scheme on documentElement", () => {
  const originalDocument = (globalThis as { document?: unknown }).document;
  const toggleCalls: Array<{ className: string; enabled?: boolean }> = [];

  const fakeDocument = {
    documentElement: {
      classList: {
        toggle: (className: string, enabled?: boolean) => {
          toggleCalls.push({ className, enabled });
        }
      },
      style: {
        colorScheme: ""
      }
    }
  };

  (globalThis as { document?: unknown }).document = fakeDocument;
  applyTheme("dark");
  applyTheme("light");

  assert.deepEqual(toggleCalls, [
    { className: "dark", enabled: true },
    { className: "dark", enabled: false }
  ]);
  assert.equal(fakeDocument.documentElement.style.colorScheme, "light");

  (globalThis as { document?: unknown }).document = originalDocument;
});
