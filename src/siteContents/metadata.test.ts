import assert from "node:assert/strict";
import test from "node:test";
import { buildContentDescription, buildContentsCanonicalPath, buildContentsMetadata } from "./metadata";

test("buildContentsCanonicalPath strips filtered query params", () => {
  const canonical = buildContentsCanonicalPath({
    page: 3,
    pageSize: 20,
    q: "camisa",
    sort: "newest",
    storeId: ""
  });

  assert.equal(canonical, "/contents");
});

test("buildContentsCanonicalPath keeps non-default pagination and sorting", () => {
  const canonical = buildContentsCanonicalPath({
    page: 2,
    pageSize: 40,
    q: "",
    sort: "oldest",
    storeId: ""
  });

  assert.equal(canonical, "/contents?page=2&sort=oldest&pageSize=40");
});

test("buildContentsMetadata sets noindex for filtered pages", () => {
  const metadata = buildContentsMetadata({
    page: 0,
    pageSize: 20,
    q: "vestido",
    sort: "newest",
    storeId: ""
  });

  assert.equal(metadata.robots?.index, false);
  assert.equal(metadata.alternates?.canonical, "/contents");
});

test("buildContentDescription normalizes and truncates", () => {
  const description = buildContentDescription("linha 1\n\nlinha 2 ".repeat(30));
  assert.ok(description.length <= 160);
  assert.ok(!description.includes("\n"));
});
