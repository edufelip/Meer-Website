import Link from "next/link";
import type { Metadata } from "next";
import JsonLdScript from "../../src/seo/JsonLdScript";
import { isContentsListingAdEligible } from "../../src/ads/eligibility";
import LandingContentsAd from "../../src/ads/ui/LandingContentsAd";
import { listSiteGuideContents, SiteContentsApiError } from "../../src/siteContents/api";
import { buildContentsMetadata } from "../../src/siteContents/metadata";
import { buildContentsHref, parseContentsQuery } from "../../src/siteContents/query";
import { getSiteContentsServerToken } from "../../src/siteContents/serverAuth";
import { buildContentsBreadcrumbJsonLd, buildContentsItemListJsonLd } from "../../src/siteContents/structuredData";
import type { GuideContentDto, PageResponse } from "../../src/siteContents/types";
import ContentPreviewCard from "../../src/siteContents/ui/ContentPreviewCard";
import PageShell from "../../src/ui/PageShell";

type ContentsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ searchParams }: ContentsPageProps): Metadata {
  const query = parseContentsQuery(searchParams);
  return buildContentsMetadata(query);
}

function listErrorMessage(error: SiteContentsApiError): string {
  if (error.status === 400) {
    return "Os filtros informados são inválidos. Revise página, busca e paginação.";
  }

  if (error.status === 401) {
    return "A API de conteúdos ainda está protegida (401). O backend precisa liberar leitura pública para o site.";
  }

  return error.message || "Ocorreu um erro ao carregar os conteúdos.";
}

export default async function ContentsPage({ searchParams }: ContentsPageProps) {
  const query = parseContentsQuery(searchParams);
  const token = getSiteContentsServerToken();

  let response: PageResponse<GuideContentDto> | null = null;
  let error: SiteContentsApiError | null = null;

  try {
    response = await listSiteGuideContents({
      page: query.page,
      pageSize: query.pageSize,
      q: query.q,
      sort: query.sort,
      storeId: query.storeId,
      token,
      revalidate: 120
    });
  } catch (err) {
    if (err instanceof SiteContentsApiError) {
      error = err;
    } else {
      error = new SiteContentsApiError(500, "Falha ao carregar os conteúdos.");
    }
  }

  const shouldRenderListingAd = isContentsListingAdEligible({
    hasError: Boolean(error),
    itemCount: response?.items.length ?? 0
  });

  return (
    <PageShell>
      <JsonLdScript
        id="contents-breadcrumb-jsonld"
        data={buildContentsBreadcrumbJsonLd()}
      />
      {response && response.items.length > 0 ? (
        <JsonLdScript
          id="contents-item-list-jsonld"
          data={buildContentsItemListJsonLd(response, query)}
        />
      ) : null}

      <section className="surface-card p-7 md:p-9">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Conteúdos
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
          Explore dicas e achados da comunidade.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
          Use busca, ordenação e filtro por loja para encontrar o conteúdo certo.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button secondary" href="/">
            Voltar para o início
          </Link>
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
        <form method="GET" action="/contents" className="contents-filter-form">
          <label className="form-field" htmlFor="q">
            <span className="label">Buscar conteúdo</span>
            <input
              id="q"
              className="input"
              type="text"
              name="q"
              placeholder="Título ou descrição"
              defaultValue={query.q}
            />
          </label>

          <label className="form-field" htmlFor="sort">
            <span className="label">Ordenação</span>
            <select id="sort" className="input" name="sort" defaultValue={query.sort}>
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>
          </label>

          <input type="hidden" name="pageSize" value={String(query.pageSize)} />
          {query.storeId ? (
            <input type="hidden" name="storeId" value={query.storeId} />
          ) : null}

          <div className="contents-filter-actions">
            <button className="button" type="submit">
              Pesquisar
            </button>
            <Link className="button secondary" href="/contents">
              Limpar
            </Link>
          </div>
        </form>
      </section>

      {error ? (
        <section className="surface-card contents-state p-6">
          <h2>Não foi possível carregar os conteúdos.</h2>
          <p>{listErrorMessage(error)}</p>
          <div className="hero-actions">
            <Link className="button" href={buildContentsHref(query)}>
              Tentar novamente
            </Link>
          </div>
        </section>
      ) : null}

      {response && response.items.length === 0 ? (
        <section className="surface-card contents-state p-6">
          <h2>Nenhum conteúdo encontrado.</h2>
          <p>Tente ajustar a busca ou limpar os filtros para ampliar os resultados.</p>
          <div className="hero-actions">
            <Link className="button secondary" href="/contents">
              Ver todos
            </Link>
          </div>
        </section>
      ) : null}

      {response && response.items.length > 0 ? (
        <>
          <section className="contents-grid" aria-label="Lista de conteúdos">
            {response.items.map((item) => (
              <ContentPreviewCard key={item.id} item={item} showLikeCount />
            ))}
          </section>
          {shouldRenderListingAd ? <LandingContentsAd className="mt-2" /> : null}
        </>
      ) : null}

      {response ? (
        <nav className="surface-card contents-pagination p-5" aria-label="Paginação de conteúdos">
          {query.page > 0 ? (
            <Link
              className="button secondary"
              rel="prev"
              href={buildContentsHref({
                ...query,
                page: query.page - 1
              })}
            >
              Página anterior
            </Link>
          ) : (
            <span className="button secondary button-disabled" aria-disabled>
              Página anterior
            </span>
          )}

          <p className="contents-pagination-label">Página {response.page + 1}</p>

          {response.hasNext ? (
            <Link
              className="button"
              rel="next"
              href={buildContentsHref({
                ...query,
                page: query.page + 1
              })}
            >
              Próxima página
            </Link>
          ) : (
            <span className="button button-disabled" aria-disabled>
              Próxima página
            </span>
          )}
        </nav>
      ) : null}
    </PageShell>
  );
}
