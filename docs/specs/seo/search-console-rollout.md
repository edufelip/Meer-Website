# Search Console Rollout

## Objective

Roll out SEO changes safely and verify indexing/canonical behavior for:

- `/contents`
- `/content/[id]`

## Prerequisites

- Production deploy is live and serving app routes (not 404 on the primary domain).
- Google Search Console access to the domain property.
- Optional env var for meta verification:
  - `GOOGLE_SITE_VERIFICATION=<token>`
- If `/site/contents*` still requires auth in backend, set a server-only token:
  - `SITE_CONTENTS_API_TOKEN=<bearer-token>`

## Automated Pre-Check

Run the local rollout checker against production:

```bash
npm run seo:rollout-check -- --baseUrl https://www.guiabrecho.com.br
```

Expected:

- `robots.txt` returns `200` and references `sitemap.xml`.
- `sitemap.xml` returns `200` and includes `/content/{id}` URLs.
- `/contents` has canonical and JSON-LD (`ItemList`, `BreadcrumbList`).
- `/contents?q=...` has canonical to `/contents` and `noindex`.
- `/content/{id}` has canonical + JSON-LD (`Article`, `BreadcrumbList`).
- `/content/{id}?commentsPage=2` has canonical to `/content/{id}` and `noindex`.

## Search Console Steps

1. Verify ownership in GSC for `https://guiabrecho.com.br` (Domain property preferred).
2. Submit sitemap:
   - `https://www.guiabrecho.com.br/sitemap.xml`
3. Inspect and request indexing for:
   - `/`
   - `/contents`
   - 2 to 3 real `/content/{id}` URLs
4. Confirm indexing policy:
   - `/contents` indexable
   - `/contents?q=...` excluded (`noindex,follow`)
   - `/content/{id}` indexable
   - `/content/{id}?commentsPage=2` excluded (`noindex,follow`)

## Post-Release Monitoring (7 to 14 Days)

- Coverage:
  - Watch for unexpected spikes in "Duplicate without user-selected canonical".
  - Confirm filtered/query URLs are excluded as expected.
- Performance:
  - Track impressions, clicks, CTR, and average position for `/contents` and `/content/`.
- Rich results:
  - Validate Article and Breadcrumb markup on live content URLs.

## Rollback Criteria

Rollback if any of these happen after release:

- `robots.txt` or `sitemap.xml` returns non-200.
- Canonical tags missing on `/contents` or `/content/{id}`.
- Indexable pages are marked `noindex` unexpectedly.
- Significant index coverage drop (>10% week-over-week) without expected cause.
