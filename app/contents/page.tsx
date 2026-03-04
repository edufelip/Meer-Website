import Image from "next/image";
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

function getReadingTimeLabel(content: GuideContentDto): string {
  const words = content.description.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return `${readingTime} min de leitura`;
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
  const featuredContent = response?.items[0] ?? null;
  const remainingContents = response ? response.items.slice(1) : [];

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

      <header className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <span className="font-display italic text-secondary dark:text-primary text-lg mb-2">Destaque do Mês</span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-white leading-tight">
              Conteúdos para seu <br /> <span className="italic font-light">próximo garimpo</span>
            </h1>
          </div>

          {featuredContent ? (
            <Link
              href={`/content/${featuredContent.id}`}
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] max-h-[600px] group block w-full max-w-5xl mx-auto"
            >
              <Image
                alt={`Imagem do conteúdo ${featuredContent.title}`}
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                src={featuredContent.imageUrl || "/assets/images/app-icon.png"}
                fill
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 text-white">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm backdrop-blur-sm">
                      {featuredContent.thriftStoreName || "Comunidade"}
                    </span>
                    <span className="text-sm font-light text-stone-200">
                      {getReadingTimeLabel(featuredContent)}
                    </span>
                  </div>
                  <p className="text-lg md:text-xl lg:text-2xl text-stone-100 font-serif leading-relaxed mb-8 border-l-4 border-primary pl-6">
                    {featuredContent.title}
                  </p>
                  <span className="inline-flex items-center text-white font-medium group-hover:translate-x-2 duration-300">
                    Ler artigo <span className="material-icons-outlined ml-2">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <section className="surface-card p-6 text-sm text-stone-600 dark:text-stone-400">
              Nenhum conteúdo em destaque disponível agora.
            </section>
          )}
        </div>
      </header>

      <div className="sticky top-20 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form method="GET" action="/contents" className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="sr-only" htmlFor="sort">Ordenação</label>
              <select
                id="sort"
                className="w-full md:w-52 bg-white dark:bg-stone-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-secondary dark:focus:ring-primary shadow-sm"
                name="sort"
                defaultValue={query.sort}
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
              <input type="hidden" name="pageSize" value={String(query.pageSize)} />
              {query.storeId ? (
                <input type="hidden" name="storeId" value={query.storeId} />
              ) : null}
            </div>
            <div className="relative w-full md:w-72">
              <label className="sr-only" htmlFor="q">Buscar conteúdo</label>
              <input
                id="q"
                className="w-full bg-white dark:bg-stone-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-secondary dark:focus:ring-primary shadow-sm placeholder-stone-400"
                type="text"
                name="q"
                placeholder="Buscar artigos..."
                defaultValue={query.q}
              />
              <span className="absolute right-3 top-2 text-stone-400">
                <span className="material-icons-outlined text-lg">search</span>
              </span>
            </div>
          </form>
        </div>
      </div>

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

      {response && response.items.length === 1 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="surface-card p-6 text-sm text-stone-600 dark:text-stone-400">
            Apenas um conteúdo disponível no momento. Explore o destaque acima.
          </div>
        </section>
      ) : null}

      {remainingContents.length > 0 ? (
        <>
          <section className="pb-24" aria-label="Lista de conteúdos">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {remainingContents.map((item) => (
                  <div key={item.id} className="break-inside-avoid">
                    <ContentPreviewCard item={item} showLikeCount />
                  </div>
                ))}
              </div>
            </div>
          </section>
          {shouldRenderListingAd ? <LandingContentsAd className="mt-2" /> : null}
        </>
      ) : null}

      {response && response.items.length > 1 ? (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-10 flex items-center justify-center gap-4" aria-label="Paginação de conteúdos">
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
