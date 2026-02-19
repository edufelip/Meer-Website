import assert from "node:assert/strict";
import test from "node:test";
import {
  buildHomeSectionPath,
  parseHomeSection,
  removeHomeSectionIntentQueryParam,
  resolveHomeSectionIntent
} from "./homeSections";

test("parseHomeSection returns known section ids", () => {
  assert.equal(parseHomeSection("conteudos"), "conteudos");
  assert.equal(parseHomeSection(" Destaques "), "destaques");
});

test("parseHomeSection returns null for unknown values", () => {
  assert.equal(parseHomeSection("explorar"), null);
  assert.equal(parseHomeSection(""), null);
  assert.equal(parseHomeSection(null), null);
});

test("resolveHomeSectionIntent prioritizes query param over hash", () => {
  const section = resolveHomeSectionIntent("?section=conteudos", "#destaques");

  assert.equal(section, "conteudos");
});

test("resolveHomeSectionIntent falls back to hash when query is absent", () => {
  const section = resolveHomeSectionIntent("?utm=site", "#destaques");

  assert.equal(section, "destaques");
});

test("removeHomeSectionIntentQueryParam removes only section query param", () => {
  const nextSearch = removeHomeSectionIntentQueryParam("?section=conteudos&utm_source=google");

  assert.equal(nextSearch, "?utm_source=google");
});

test("buildHomeSectionPath creates home section path", () => {
  assert.equal(buildHomeSectionPath("conteudos"), "/?section=conteudos");
});
