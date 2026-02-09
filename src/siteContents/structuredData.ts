import { webBaseUrl } from "../urls";
import {
  buildContentDescription,
  buildContentsCanonicalPath,
  parseAbsoluteUrlOrUndefined,
  parseIsoDateOrUndefined
} from "./metadata";
import type { ContentsQuery } from "./query";
import type { GuideContentDto, PageResponse } from "./types";

type JsonLdObject = Record<string, unknown>;

const SITE_NAME = "Guia Brechó";

function absoluteUrl(path: string): string {
  return new URL(path, webBaseUrl).toString();
}

function sitePublisher(): JsonLdObject {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/images/app-icon.png")
    }
  };
}

export function buildContentsBreadcrumbJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conteúdos",
        item: absoluteUrl("/contents")
      }
    ]
  };
}

export function buildContentsItemListJsonLd(
  response: PageResponse<GuideContentDto>,
  query: ContentsQuery
): JsonLdObject {
  const pageOffset = query.page * query.pageSize;
  const canonicalPath = buildContentsCanonicalPath(query);
  const listName = query.q
    ? `Resultados para "${query.q}"`
    : "Conteúdos do Guia Brechó";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: absoluteUrl(canonicalPath),
    numberOfItems: response.items.length,
    itemListElement: response.items.map((item, index) => ({
      "@type": "ListItem",
      position: pageOffset + index + 1,
      url: absoluteUrl(`/content/${item.id}`),
      name: item.title
    }))
  };
}

export function buildContentBreadcrumbJsonLd(content: GuideContentDto): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conteúdos",
        item: absoluteUrl("/contents")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content.title,
        item: absoluteUrl(`/content/${content.id}`)
      }
    ]
  };
}

export function buildContentArticleJsonLd(content: GuideContentDto): JsonLdObject {
  const publishedAt = parseIsoDateOrUndefined(content.createdAt);
  const imageUrl = parseAbsoluteUrlOrUndefined(content.imageUrl);
  const interactionStats = [
    {
      "@type": "InteractionCounter",
      interactionType: { "@type": "LikeAction" },
      userInteractionCount: content.likeCount
    },
    {
      "@type": "InteractionCounter",
      interactionType: { "@type": "CommentAction" },
      userInteractionCount: content.commentCount
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/content/${content.id}`)
    },
    headline: content.title,
    description: buildContentDescription(content.description),
    ...(publishedAt ? { datePublished: publishedAt, dateModified: publishedAt } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": "Organization",
      name: content.thriftStoreName || "Comunidade"
    },
    publisher: sitePublisher(),
    interactionStatistic: interactionStats
  };
}
