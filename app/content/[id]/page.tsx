import type { Metadata } from "next";
import Link from "next/link";
import { isContentDetailAdEligible } from "../../../src/ads/eligibility";
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
import { ContentHero } from "../../../src/siteContents/ui/ContentHero";
import { ContentAuthorSidebar } from "../../../src/siteContents/ui/ContentAuthorSidebar";
import { ContentBody } from "../../../src/siteContents/ui/ContentBody";

type ContentPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

type ContentStateViewProps = {
  title: string;
  message: string;
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

      <ContentHero content={content} />

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
            <ContentBody content={content} />
            <ContentAuthorSidebar content={content} shouldRenderContentAd={shouldRenderContentAd} />
          </div>
        </div>
      </div>
      
      <RelatedContentsSection items={relatedContents} />
    </PageShell>
  );
}
