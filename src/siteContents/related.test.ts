import assert from "node:assert/strict";
import test from "node:test";
import { selectRelatedContents } from "./related";
import type { GuideContentDto } from "./types";

function content(id: number, title?: string): GuideContentDto {
  return {
    id,
    title: title ?? `Conteúdo ${id}`,
    description: `Descrição ${id}`,
    imageUrl: "",
    thriftStoreId: null,
    thriftStoreName: "Comunidade",
    thriftStoreCoverImageUrl: null,
    createdAt: "2026-02-09T12:00:00.000Z",
    likeCount: 0,
    commentCount: 0,
    likedByMe: false
  };
}

test("selectRelatedContents excludes current content and deduplicates", () => {
  const result = selectRelatedContents({
    currentContentId: 3,
    preferred: [content(3), content(10), content(11)],
    fallback: [content(11), content(12), content(13)]
  });

  assert.deepEqual(result.map((item) => item.id), [10, 11, 12, 13]);
});

test("selectRelatedContents keeps preferred order and honors limit", () => {
  const result = selectRelatedContents({
    currentContentId: 99,
    preferred: [content(1), content(2), content(3)],
    fallback: [content(4), content(5)],
    limit: 3
  });

  assert.deepEqual(result.map((item) => item.id), [1, 2, 3]);
});

test("selectRelatedContents returns empty when limit is non-positive", () => {
  const result = selectRelatedContents({
    currentContentId: 1,
    preferred: [content(2)],
    fallback: [content(3)],
    limit: 0
  });

  assert.deepEqual(result, []);
});
