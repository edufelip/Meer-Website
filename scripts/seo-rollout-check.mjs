#!/usr/bin/env node

const args = process.argv.slice(2);

function argValue(flag, fallback) {
  const index = args.indexOf(flag);
  if (index === -1) return fallback;
  return args[index + 1] ?? fallback;
}

function normalizeBaseUrl(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "https://www.guiabrecho.com.br";
  return trimmed.replace(/\/+$/, "");
}

const baseUrl = normalizeBaseUrl(argValue("--baseUrl", process.env.SEO_BASE_URL));

async function fetchPage(path) {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "seo-rollout-check/1.0"
    }
  });
  const body = await response.text();

  return {
    requestUrl: url,
    finalUrl: response.url,
    status: response.status,
    body,
    headers: response.headers
  };
}

function pass(label, detail = "") {
  console.log(`PASS ${label}${detail ? ` - ${detail}` : ""}`);
}

function fail(label, detail = "") {
  console.log(`FAIL ${label}${detail ? ` - ${detail}` : ""}`);
}

function warn(label, detail = "") {
  console.log(`WARN ${label}${detail ? ` - ${detail}` : ""}`);
}

function canonicalHref(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1];
}

function hasRobotsNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function hasRobotsIndex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*index/i.test(html);
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1] ?? "");
}

function hasJsonLdType(html, typeName) {
  return jsonLdBlocks(html).some((block) => new RegExp(`"@type"\\s*:\\s*"${typeName}"`, "i").test(block));
}

function extractFirstContentUrlFromSitemap(xml) {
  const allLocs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1] ?? "");
  return allLocs.find((loc) => /\/content\/\d+/.test(loc));
}

let failures = 0;

async function checkRobotsAndSitemap() {
  const robots = await fetchPage("/robots.txt");
  if (robots.status !== 200) {
    fail("robots status", `expected 200, got ${robots.status} (${robots.finalUrl})`);
    failures += 1;
  } else {
    pass("robots status", robots.finalUrl);
  }

  if (!/Sitemap:\s*https?:\/\/[^\s]+\/sitemap\.xml/i.test(robots.body)) {
    fail("robots sitemap reference", "missing Sitemap: .../sitemap.xml");
    failures += 1;
  } else {
    pass("robots sitemap reference");
  }

  const sitemap = await fetchPage("/sitemap.xml");
  if (sitemap.status !== 200) {
    fail("sitemap status", `expected 200, got ${sitemap.status} (${sitemap.finalUrl})`);
    failures += 1;
  } else {
    pass("sitemap status", sitemap.finalUrl);
  }

  if (!/<urlset[\s>]/i.test(sitemap.body)) {
    fail("sitemap xml format", "missing <urlset>");
    failures += 1;
  } else {
    pass("sitemap xml format");
  }

  const contentUrl = extractFirstContentUrlFromSitemap(sitemap.body);
  if (!contentUrl) {
    warn("sample content url", "no /content/{id} URL found in sitemap");
  } else {
    pass("sample content url", contentUrl);
  }

  return contentUrl;
}

async function checkContentsPage() {
  const page = await fetchPage("/contents");
  if (page.status !== 200) {
    fail("contents status", `expected 200, got ${page.status} (${page.finalUrl})`);
    failures += 1;
    return;
  }
  pass("contents status", page.finalUrl);

  const canonical = canonicalHref(page.body);
  if (!canonical || !canonical.endsWith("/contents")) {
    fail("contents canonical", `expected .../contents, got ${canonical ?? "missing"}`);
    failures += 1;
  } else {
    pass("contents canonical", canonical);
  }

  if (!hasRobotsIndex(page.body)) {
    warn("contents robots index", "index meta tag not found explicitly");
  } else {
    pass("contents robots index");
  }

  if (!hasJsonLdType(page.body, "ItemList")) {
    fail("contents ItemList schema", "missing ItemList JSON-LD");
    failures += 1;
  } else {
    pass("contents ItemList schema");
  }

  if (!hasJsonLdType(page.body, "BreadcrumbList")) {
    fail("contents BreadcrumbList schema", "missing BreadcrumbList JSON-LD");
    failures += 1;
  } else {
    pass("contents BreadcrumbList schema");
  }
}

async function checkFilteredContentsPage() {
  const page = await fetchPage("/contents?q=seo-check");
  if (page.status !== 200) {
    fail("filtered contents status", `expected 200, got ${page.status} (${page.finalUrl})`);
    failures += 1;
    return;
  }
  pass("filtered contents status", page.finalUrl);

  const canonical = canonicalHref(page.body);
  if (!canonical || !canonical.endsWith("/contents")) {
    fail("filtered contents canonical", `expected .../contents, got ${canonical ?? "missing"}`);
    failures += 1;
  } else {
    pass("filtered contents canonical", canonical);
  }

  if (!hasRobotsNoindex(page.body)) {
    fail("filtered contents robots", "expected noindex");
    failures += 1;
  } else {
    pass("filtered contents robots", "noindex");
  }
}

async function checkContentPage(sampleUrl) {
  const url = sampleUrl ?? `${baseUrl}/content/1`;
  const page = await fetchPage(url);

  if (page.status !== 200) {
    warn("content status", `expected 200 for sample content, got ${page.status} (${page.finalUrl})`);
    return;
  }
  pass("content status", page.finalUrl);

  const contentPathMatch = page.finalUrl.match(/\/content\/\d+/);
  const expectedPath = contentPathMatch?.[0];
  const canonical = canonicalHref(page.body);
  if (!canonical || (expectedPath && !canonical.includes(expectedPath))) {
    fail("content canonical", `expected canonical containing ${expectedPath ?? "/content/{id}"}, got ${canonical ?? "missing"}`);
    failures += 1;
  } else {
    pass("content canonical", canonical);
  }

  if (!hasJsonLdType(page.body, "Article")) {
    fail("content Article schema", "missing Article JSON-LD");
    failures += 1;
  } else {
    pass("content Article schema");
  }

  if (!hasJsonLdType(page.body, "BreadcrumbList")) {
    fail("content BreadcrumbList schema", "missing BreadcrumbList JSON-LD");
    failures += 1;
  } else {
    pass("content BreadcrumbList schema");
  }

  if (!expectedPath) return;
  const commentsPage = await fetchPage(`${expectedPath}?commentsPage=2`);
  if (commentsPage.status !== 200) {
    warn("content commentsPage status", `expected 200, got ${commentsPage.status} (${commentsPage.finalUrl})`);
    return;
  }
  pass("content commentsPage status", commentsPage.finalUrl);

  const commentsCanonical = canonicalHref(commentsPage.body);
  if (!commentsCanonical || !commentsCanonical.includes(expectedPath)) {
    fail("content commentsPage canonical", `expected canonical containing ${expectedPath}, got ${commentsCanonical ?? "missing"}`);
    failures += 1;
  } else {
    pass("content commentsPage canonical", commentsCanonical);
  }

  if (!hasRobotsNoindex(commentsPage.body)) {
    fail("content commentsPage robots", "expected noindex");
    failures += 1;
  } else {
    pass("content commentsPage robots", "noindex");
  }
}

async function main() {
  console.log(`SEO rollout check for: ${baseUrl}`);
  console.log("");

  const sampleContentUrl = await checkRobotsAndSitemap();
  await checkContentsPage();
  await checkFilteredContentsPage();
  await checkContentPage(sampleContentUrl);

  console.log("");
  if (failures > 0) {
    console.log(`Completed with ${failures} failing checks.`);
    process.exit(1);
  }

  console.log("Completed with no failing checks.");
}

main().catch((error) => {
  console.error("Unexpected error running SEO rollout check:", error);
  process.exit(1);
});
