import assert from "node:assert/strict";
import test from "node:test";
import { buildContentsHref, parseCommentsPage, parseContentsQuery } from "./query";

test("parseContentsQuery uses safe defaults", () => {
  const result = parseContentsQuery(undefined);

  assert.deepEqual(result, {
    page: 0,
    pageSize: 20,
    q: "",
    sort: "newest",
    storeId: ""
  });
});

test("parseContentsQuery sanitizes invalid values", () => {
  const result = parseContentsQuery({
    page: "-3",
    pageSize: "250",
    q: "  brecho  ",
    sort: "oldest",
    storeId: "  abc "
  });

  assert.deepEqual(result, {
    page: 0,
    pageSize: 100,
    q: "brecho",
    sort: "oldest",
    storeId: "abc"
  });
});

test("parseCommentsPage clamps invalid values to zero", () => {
  assert.equal(parseCommentsPage({ commentsPage: "-1" }), 0);
  assert.equal(parseCommentsPage({ commentsPage: "2" }), 2);
});

test("buildContentsHref preserves normalized query params", () => {
  const href = buildContentsHref({
    page: 1,
    pageSize: 500,
    q: " camisa ",
    sort: "oldest",
    storeId: " store-1 "
  });

  assert.equal(href, "/contents?page=1&pageSize=100&sort=oldest&q=camisa&storeId=store-1");
});
