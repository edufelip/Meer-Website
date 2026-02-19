import type { MetadataRoute } from "next";
import { listSiteGuideContents } from "../src/siteContents/api";
import { getSiteContentsServerToken } from "../src/siteContents/serverAuth";
import { listSiteStores } from "../src/storeDetails/api";
import { webBaseUrl } from "../src/urls";

const SITEMAP_PAGE_SIZE = 100;
const STORE_SITEMAP_PAGE_SIZE = 100;
const MAX_CONTENT_URLS = 5000;
const MAX_STORE_URLS = 50000;

const sitemapRevalidateSeconds = 60 * 60;
export const revalidate = sitemapRevalidateSeconds;

function toAbsoluteUrl(path: string): string {
  return new URL(path, webBaseUrl).toString();
}

function toValidDateOrUndefined(iso: string): Date | undefined {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

async function getContentEntries(): Promise<MetadataRoute.Sitemap> {
  const token = getSiteContentsServerToken();
  const entries: MetadataRoute.Sitemap = [];
  let page = 0;
  let hasNext = true;

  while (hasNext && entries.length < MAX_CONTENT_URLS) {
    const response = await listSiteGuideContents({
      page,
      pageSize: SITEMAP_PAGE_SIZE,
      sort: "newest",
      token,
      revalidate: sitemapRevalidateSeconds
    });

    if (response.items.length === 0) break;

    for (const content of response.items) {
      entries.push({
        url: toAbsoluteUrl(`/content/${content.id}`),
        lastModified: toValidDateOrUndefined(content.createdAt),
        changeFrequency: "weekly",
        priority: 0.7
      });

      if (entries.length >= MAX_CONTENT_URLS) break;
    }

    hasNext = response.hasNext;
    page = response.page + 1;
  }

  return entries;
}

async function getStoreEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 0;
  let hasNext = true;

  while (hasNext && entries.length < MAX_STORE_URLS) {
    const response = await listSiteStores({
      page,
      pageSize: STORE_SITEMAP_PAGE_SIZE,
      revalidate: sitemapRevalidateSeconds
    });

    if (response.items.length === 0) break;

    for (const store of response.items) {
      entries.push({
        url: toAbsoluteUrl(`/store/${store.id}`),
        lastModified: toValidDateOrUndefined(store.updatedAt || store.createdAt || ""),
        changeFrequency: "weekly",
        priority: 0.8
      });

      if (entries.length >= MAX_STORE_URLS) break;
    }

    hasNext = response.hasNext;
    page = response.page + 1;
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: toAbsoluteUrl("/contents"),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: toAbsoluteUrl("/privacy-policy"),
      changeFrequency: "yearly",
      priority: 0.2
    },
    {
      url: toAbsoluteUrl("/terms-eula"),
      changeFrequency: "yearly",
      priority: 0.2
    }
  ];

  const [contentEntriesResult, storeEntriesResult] = await Promise.allSettled([
    getContentEntries(),
    getStoreEntries()
  ]);

  const contentEntries =
    contentEntriesResult.status === "fulfilled" ? contentEntriesResult.value : [];
  const storeEntries =
    storeEntriesResult.status === "fulfilled" ? storeEntriesResult.value : [];

  return [...staticEntries, ...storeEntries, ...contentEntries];
}
