import assert from "node:assert/strict";
import test from "node:test";
import {
  isContentDetailAdEligible,
  isContentsListingAdEligible,
  MIN_CONTENT_DESCRIPTION_CHARS,
  MIN_CONTENT_TITLE_CHARS,
  MIN_LISTING_ITEMS_FOR_AD
} from "./eligibility";

test("isContentDetailAdEligible returns true for rich content", () => {
  const title = "x".repeat(MIN_CONTENT_TITLE_CHARS);
  const description = "y".repeat(MIN_CONTENT_DESCRIPTION_CHARS);
  assert.equal(isContentDetailAdEligible({ title, description }), true);
});

test("isContentDetailAdEligible returns false for short text", () => {
  const title = "x".repeat(MIN_CONTENT_TITLE_CHARS - 1);
  const description = "y".repeat(MIN_CONTENT_DESCRIPTION_CHARS - 1);
  assert.equal(isContentDetailAdEligible({ title, description }), false);
});

test("isContentsListingAdEligible requires enough items and no error", () => {
  assert.equal(
    isContentsListingAdEligible({
      hasError: false,
      itemCount: MIN_LISTING_ITEMS_FOR_AD
    }),
    true
  );
});

test("isContentsListingAdEligible blocks ad with error or low item count", () => {
  assert.equal(
    isContentsListingAdEligible({
      hasError: true,
      itemCount: MIN_LISTING_ITEMS_FOR_AD + 5
    }),
    false
  );
  assert.equal(
    isContentsListingAdEligible({
      hasError: false,
      itemCount: MIN_LISTING_ITEMS_FOR_AD - 1
    }),
    false
  );
});
