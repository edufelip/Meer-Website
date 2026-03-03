import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { isContentDetailAdEligible } from "../../../src/ads/eligibility";
import LandingContentsAd from "../../../src/ads/ui/LandingContentsAd";
import JsonLdScript from "../../../src/seo/JsonLdScript";
import {
  getSiteGuideContentById,
  listSiteGuideContents,
  SiteContentsApiError
} from "../../../src/siteContents/api";
import { formatDateShort } from "../../../src/siteContents/format";
import {
  buildContentDescription,
  parseAbsoluteUrlOrUndefined,
  parseIsoDateOrUndefined
} from "../../../src/siteContents/metadata";
import { parseCommentsPage } from "../../../src/siteContents/query";
import { selectRelatedContents } from "../../../src/siteContents/related";
import { getSiteContentsServerToken } from "../../../src/siteContents/serverAuth";
import {
  buildContentArticleJsonLd,
  buildContentBreadcrumbJsonLd
} from "../../../src/siteContents/structuredData";
import type { GuideContentDto, PageResponse } from "../../../src/siteContents/types";
import RelatedContentsSection from "../../../src/siteContents/ui/RelatedContentsSection";
import PageShell from "../../../src/ui/PageShell";
import ReactMarkdown from "react-markdown";

type ContentPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

type ContentStateViewProps = {
  title: string;
  message: string;
  deepLink?: string;
};

const CONTENTS_REVALIDATE_SECONDS = 120;
const RELATED_CONTENTS_PAGE_SIZE = 4;

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function parseContentId(rawId: string): number | null {
  const decoded = safeDecode(rawId);
  if (!decoded) return null;

  const parsed = Number.parseInt(decoded, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function buildContentErrorMessage(error: SiteContentsApiError): string {
  if (error.status === 404) {
    return "Este conteúdo não foi encontrado. Ele pode ter sido removido.";
  }

  if (error.status === 400) {
    return "O identificador informado é inválido.";
  }

  if (error.status === 401) {
    return "A API deste conteúdo ainda está protegida (401). O backend precisa liberar leitura pública para o site.";
  }

  return error.message || "Não foi possível carregar o conteúdo.";
}

function toApiError(error: unknown, fallbackMessage: string): SiteContentsApiError {
  return error instanceof SiteContentsApiError
    ? error
    : new SiteContentsApiError(500, fallbackMessage);
}

function metadataRobots(index: boolean): NonNullable<Metadata["robots"]> {
  return {
    index,
    follow: true
  };
}

function ContentStateView({ title, message }: ContentStateViewProps) {
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 md:p-10 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Conteúdo
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-stone-900 dark:text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-stone-600 dark:text-stone-400">{message}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white px-6 py-3 rounded-full font-medium transition-colors" href="/contents">
              Voltar para conteúdos
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export async function generateMetadata({
  params,
  searchParams
}: ContentPageProps): Promise<Metadata> {
  const contentId = parseContentId(params.id);
  const commentsPage = parseCommentsPage(searchParams);
  const indexPage = commentsPage === 0;
  const token = getSiteContentsServerToken();

  if (!contentId) {
    return {
      title: "Conteúdo inválido | Guia Brechó",
      description: "O conteúdo solicitado não possui um identificador válido.",
      alternates: {
        canonical: "/contents"
      },
      robots: metadataRobots(false)
    };
  }

  const canonicalPath = `/content/${contentId}`;

  try {
    const content = await getSiteGuideContentById(contentId, {
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    });

    const title = `${content.title} | Guia Brechó`;
    const description = buildContentDescription(content.description);
    const publishedTime = parseIsoDateOrUndefined(content.createdAt);
    const imageUrl = parseAbsoluteUrlOrUndefined(content.imageUrl);

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath
      },
      robots: metadataRobots(indexPage),
      openGraph: {
        type: "article",
        locale: "pt_BR",
        url: canonicalPath,
        title,
        description,
        siteName: "Guia Brechó",
        publishedTime,
        images: imageUrl ? [{ url: imageUrl, alt: `Imagem do conteúdo ${content.title}` }] : undefined
      },
      twitter: {
        card: imageUrl ? "summary_large_image" : "summary",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined
      }
    };
  } catch (error) {
    const apiError = toApiError(error, "Não foi possível carregar este conteúdo.");

    return {
      title:
        apiError.status === 404
          ? "Conteúdo não encontrado | Guia Brechó"
          : "Conteúdo | Guia Brechó",
      description:
        apiError.status === 404
          ? "Este conteúdo não foi encontrado ou pode ter sido removido."
          : "Veja conteúdo da comunidade no Guia Brechó.",
      alternates: {
        canonical: canonicalPath
      },
      robots: metadataRobots(false)
    };
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const contentId = parseContentId(params.id);
  const token = getSiteContentsServerToken();

  if (!contentId) {
    return (
      <ContentStateView
        title="Conteúdo inválido."
        message="O identificador informado não é numérico."
      />
    );
  }

  let content: GuideContentDto | null = null;
  let contentError: SiteContentsApiError | null = null;

  try {
    content = await getSiteGuideContentById(contentId, {
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    });
  } catch (error) {
    contentError = toApiError(error, "Falha ao carregar conteúdo.");
  }

  if (!content || contentError) {
    return (
      <ContentStateView
        title="Não foi possível abrir este conteúdo."
        message={contentError ? buildContentErrorMessage(contentError) : "Falha ao carregar conteúdo."}
      />
    );
  }

  const storeRelatedPromise: Promise<PageResponse<GuideContentDto> | null> = content.thriftStoreId
    ? listSiteGuideContents({
      page: 0,
      pageSize: RELATED_CONTENTS_PAGE_SIZE,
      sort: "newest",
      storeId: content.thriftStoreId,
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    })
    : Promise.resolve(null);

  const [fallbackRelatedResult, storeRelatedResult] = await Promise.allSettled([
    listSiteGuideContents({
      page: 0,
      pageSize: RELATED_CONTENTS_PAGE_SIZE,
      sort: "newest",
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    }),
    storeRelatedPromise
  ]);

  const fallbackRelatedContents =
    fallbackRelatedResult.status === "fulfilled" ? fallbackRelatedResult.value.items : [];

  const preferredRelatedContents =
    storeRelatedResult.status === "fulfilled" && storeRelatedResult.value
      ? storeRelatedResult.value.items
      : fallbackRelatedContents;

  const relatedContents = selectRelatedContents({
    currentContentId: content.id,
    preferred: preferredRelatedContents,
    fallback: fallbackRelatedContents
  });

  const shouldRenderContentAd = isContentDetailAdEligible({
    title: content.title,
    description: content.description
  });

  const words = content.description.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200)); 

  return (
    <PageShell>
      <JsonLdScript
        id="content-breadcrumb-jsonld"
        data={buildContentBreadcrumbJsonLd(content)}
      />
      <JsonLdScript
        id="content-article-jsonld"
        data={buildContentArticleJsonLd(content)}
      />

      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        {content.imageUrl ? (
          <Image
            alt={`Imagem do conteúdo ${content.title}`}
            className="w-full h-full object-cover"
            src={content.imageUrl}
            fill
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-stone-800 flex items-center justify-center">
            <span className="material-icons-outlined text-6xl text-stone-500">article</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/90 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
              {content.thriftStoreName || "Comunidade"}
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              {content.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 mb-24">
        <div className="bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-xl border border-stone-200 dark:border-stone-800 p-6 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-8 mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-200 overflow-hidden ring-2 ring-primary/20 flex items-center justify-center text-stone-500">
                <span className="material-icons-outlined text-2xl">person</span>
              </div>
              <div>
                <p className="font-display font-bold text-stone-900 dark:text-white text-lg">Membro da Comunidade</p>
                <p className="text-stone-500 dark:text-stone-400 text-sm">Criador de Conteúdo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-2">
                <span className="material-icons-outlined text-lg">calendar_today</span>
                {formatDateShort(content.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-icons-outlined text-lg">schedule</span>
                {readingTime} min de leitura
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 font-body text-lg leading-relaxed text-text-body dark:text-text-body-dark">
              <div className="prose prose-stone dark:prose-invert max-w-none 
                  prose-p:mb-8 prose-p:leading-relaxed prose-p:text-lg 
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-white
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-6 prose-blockquote:my-10 prose-blockquote:italic prose-blockquote:font-display prose-blockquote:text-2xl prose-blockquote:text-secondary dark:prose-blockquote:text-green-400 prose-blockquote:bg-secondary/5 dark:prose-blockquote:bg-secondary/10 prose-blockquote:py-6 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl
                  prose-li:my-2
                  prose-strong:font-bold prose-strong:text-stone-900 dark:prose-strong:text-white">
                <ReactMarkdown>{content.description}</ReactMarkdown>
              </div>

              <hr className="border-stone-200 dark:border-stone-700 my-12" />
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#GuiaBrecho</span>
                  <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#Achados</span>
                  {content.thriftStoreName && (
                    <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300">#{content.thriftStoreName.replace(/\s+/g, '')}</span>
                  )}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">
              <div className="bg-off-white dark:bg-stone-800/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Sobre a Autora</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  Este conteúdo foi compartilhado por um membro da nossa comunidade de garimpeiros. Participe e ajude a fortalecer a moda circular.
                </p>
                <Link href="/contents" className="text-primary text-sm font-bold hover:underline">Ver todos os posts →</Link>
              </div>

              {content.thriftStoreName && (
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
                  <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined text-primary">store</span>
                    Brechó Citado
                  </h3>
                  <Link 
                    href={content.thriftStoreId ? `/store/${content.thriftStoreId}` : "#"} 
                    className="group block"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800">
                        {content.thriftStoreCoverImageUrl ? (
                          <Image 
                            alt={content.thriftStoreName} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            src={content.thriftStoreCoverImageUrl}
                            width={64}
                            height={64}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-icons-outlined text-stone-400">storefront</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-white group-hover:text-primary transition-colors">{content.thriftStoreName}</h4>
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wide border border-secondary/30 px-1.5 py-0.5 rounded mt-2 inline-block">Ver Detalhes</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {shouldRenderContentAd ? <LandingContentsAd className="mt-2" /> : null}

              <div className="bg-secondary text-white p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <h3 className="font-display font-bold text-2xl mb-2 relative z-10">Receba achados semanais</h3>
                <p className="text-stone-200 text-sm mb-6 relative z-10">Curadoria exclusiva direto no seu e-mail, toda sexta-feira.</p>
                <form className="relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <input className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent mb-3 text-sm" placeholder="Seu melhor e-mail" type="email" required />
                  <button type="submit" className="w-full bg-white text-secondary font-bold py-2.5 rounded-lg hover:bg-stone-100 transition-colors text-sm">
                    Inscrever-se
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      <RelatedContentsSection items={relatedContents} />

    </PageShell>
  );
}
