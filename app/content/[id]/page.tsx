import Image from "next/image";
import type { Metadata, Route } from "next";
import Link from "next/link";
import OpenInAppButton from "../../../src/OpenInAppButton";
import { isContentDetailAdEligible } from "../../../src/ads/eligibility";
import LandingContentsAd from "../../../src/ads/ui/LandingContentsAd";
import JsonLdScript from "../../../src/seo/JsonLdScript";
import {
  getSiteGuideContentById,
  listSiteGuideContents,
  listSiteGuideContentComments,
  SiteContentsApiError
} from "../../../src/siteContents/api";
import { formatDateTime } from "../../../src/siteContents/format";
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
import CommentsSection from "../../../src/siteContents/ui/CommentsSection";
import RelatedContentsSection from "../../../src/siteContents/ui/RelatedContentsSection";
import PageShell from "../../../src/ui/PageShell";

type ContentPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

type ContentStateViewProps = {
  title: string;
  message: string;
  deepLink?: string;
};

const COMMENTS_PAGE_SIZE = 10;
const CONTENTS_REVALIDATE_SECONDS = 120;
const RELATED_CONTENTS_PAGE_SIZE = 8;

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

function buildCommentsErrorMessage(error: SiteContentsApiError): string {
  if (error.status === 400) {
    return "A paginação de comentários está inválida.";
  }

  if (error.status === 401) {
    return "A API de comentários ainda está protegida (401).";
  }

  return error.message || "Não foi possível carregar os comentários.";
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

function buildCommentsHref(contentId: number, commentsPage: number): Route {
  const params = new URLSearchParams();
  params.set("commentsPage", String(Math.max(0, commentsPage)));
  return `/content/${contentId}?${params.toString()}` as Route;
}

function ContentStateView({ title, message, deepLink }: ContentStateViewProps) {
  return (
    <PageShell>
      <section className="surface-card p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Conteúdo
        </span>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--ink)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base text-[var(--ink-soft)]">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button" href="/contents">
            Voltar para conteúdos
          </Link>
          {deepLink ? (
            <OpenInAppButton className="button secondary" deepLink={deepLink}>
              Abrir no app
            </OpenInAppButton>
          ) : null}
        </div>
      </section>
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

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const contentId = parseContentId(params.id);
  const commentsPage = parseCommentsPage(searchParams);
  const token = getSiteContentsServerToken();

  if (!contentId) {
    return (
      <ContentStateView
        title="Conteúdo inválido."
        message="O identificador informado não é numérico."
      />
    );
  }

  const deepLink = `meer://content/${encodeURIComponent(String(contentId))}`;

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
        deepLink={deepLink}
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

  const [commentsResult, fallbackRelatedResult, storeRelatedResult] = await Promise.allSettled([
    listSiteGuideContentComments(content.id, {
      page: commentsPage,
      pageSize: COMMENTS_PAGE_SIZE,
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    }),
    listSiteGuideContents({
      page: 0,
      pageSize: RELATED_CONTENTS_PAGE_SIZE,
      sort: "newest",
      token,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    }),
    storeRelatedPromise
  ]);

  const comments = commentsResult.status === "fulfilled" ? commentsResult.value : null;
  const commentsError =
    commentsResult.status === "rejected"
      ? toApiError(commentsResult.reason, "Falha ao carregar comentários.")
      : null;

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

      <section className="surface-card p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Conteúdo
        </span>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--ink)] md:text-5xl">
          {content.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
          {content.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <OpenInAppButton className="button" deepLink={deepLink}>
            Abrir no app
          </OpenInAppButton>
          <Link className="button secondary" href="/contents">
            Ver mais conteúdos
          </Link>
        </div>
      </section>

      <section className="surface-card content-detail-card p-6">
        {content.imageUrl ? (
          <div className="content-detail-image-wrap">
            <Image
              src={content.imageUrl}
              alt={`Imagem do conteúdo ${content.title}`}
              fill
              sizes="(max-width: 860px) 100vw, 860px"
              className="content-detail-image"
              priority
            />
          </div>
        ) : null}

        <div className="content-detail-meta">
          <p>
            <strong>Loja:</strong> {content.thriftStoreName || "Comunidade"}
          </p>
          <p>
            <strong>Publicado em:</strong> {formatDateTime(content.createdAt)}
          </p>
          <p>
            <strong>Curtidas:</strong> {content.likeCount} • <strong>Comentários:</strong>{" "}
            {content.commentCount}
          </p>
        </div>
      </section>

      {shouldRenderContentAd ? <LandingContentsAd className="mt-2" /> : null}

      <RelatedContentsSection items={relatedContents} />

      <CommentsSection
        comments={comments}
        commentsErrorMessage={commentsError ? buildCommentsErrorMessage(commentsError) : null}
        buildPageHref={(page) => buildCommentsHref(content.id, page)}
      />
    </PageShell>
  );
}
