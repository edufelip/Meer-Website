import assert from "node:assert/strict";
import test from "node:test";
import type { ContentsQuery } from "./query";
import type { GuideContentDto, PageResponse } from "./types";
import {
  buildContentArticleJsonLd,
  buildContentBreadcrumbJsonLd,
  buildContentsBreadcrumbJsonLd,
  buildContentsItemListJsonLd
} from "./structuredData";

function sampleContent(overrides: Partial<GuideContentDto> = {}): GuideContentDto {
  return {
    id: 42,
    title: "Como encontrar peças únicas em brechós",
    description: "Dicas para avaliar qualidade e estilo em cada visita.",
    imageUrl: "https://cdn.guiabrecho.com.br/content/42.jpg",
    thriftStoreId: "store-uuid",
    thriftStoreName: "Brechó Central",
    thriftStoreCoverImageUrl: null,
    createdAt: "2026-02-09T12:00:00.000Z",
    likeCount: 12,
    commentCount: 5,
    likedByMe: false,
    ...overrides
  };
}

function sampleQuery(overrides: Partial<ContentsQuery> = {}): ContentsQuery {
  return {
    page: 0,
    pageSize: 20,
    q: "",
    sort: "newest",
    storeId: "",
    ...overrides
  };
}

test("buildContentsBreadcrumbJsonLd returns expected breadcrumb levels", () => {
  const breadcrumb = buildContentsBreadcrumbJsonLd() as {
    "@type": string;
    itemListElement: Array<{ position: number }>;
  };

  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.equal(breadcrumb.itemListElement.length, 2);
  assert.equal(breadcrumb.itemListElement[1]?.position, 2);
});

test("buildContentsItemListJsonLd generates positions and urls", () => {
  const response: PageResponse<GuideContentDto> = {
    items: [sampleContent({ id: 10, title: "A" }), sampleContent({ id: 11, title: "B" })],
    page: 2,
    hasNext: true
  };
  const itemList = buildContentsItemListJsonLd(response, sampleQuery({ page: 2, pageSize: 20 })) as {
    "@type": string;
    itemListElement: Array<{ position: number; url: string; name: string }>;
  };

  assert.equal(itemList["@type"], "ItemList");
  assert.equal(itemList.itemListElement[0]?.position, 41);
  assert.equal(itemList.itemListElement[1]?.position, 42);
  assert.ok(itemList.itemListElement[0]?.url.endsWith("/content/10"));
});

test("buildContentBreadcrumbJsonLd includes content step", () => {
  const breadcrumb = buildContentBreadcrumbJsonLd(sampleContent()) as {
    itemListElement: Array<{ name: string }>;
  };

  assert.equal(breadcrumb.itemListElement.length, 3);
  assert.equal(
    breadcrumb.itemListElement[2]?.name,
    "Como encontrar peças únicas em brechós"
  );
});

test("buildContentArticleJsonLd returns article with interaction stats", () => {
  const article = buildContentArticleJsonLd(sampleContent()) as {
    "@type": string;
    headline: string;
    interactionStatistic: Array<{ userInteractionCount: number }>;
  };

  assert.equal(article["@type"], "Article");
  assert.equal(article.headline, "Como encontrar peças únicas em brechós");
  assert.equal(article.interactionStatistic[0]?.userInteractionCount, 12);
  assert.equal(article.interactionStatistic[1]?.userInteractionCount, 5);
});
