import type { Metadata, Route } from "next";
import Link from "next/link";
import OpenInAppButton from "../../../src/OpenInAppButton";
import {
  getSiteGuideContentById,
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

type ContentPageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const COMMENTS_PAGE_SIZE = 10;
const CONTENTS_REVALIDATE_SECONDS = 120;

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

function contentErrorMessage(error: SiteContentsApiError): string {
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

function commentsErrorMessage(error: SiteContentsApiError): string {
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

export async function generateMetadata({ params, searchParams }: ContentPageProps): Promise<Metadata> {
  const contentId = parseContentId(params.id);
  const commentsPage = parseCommentsPage(searchParams);
  const indexPage = commentsPage === 0;

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
      title: apiError.status === 404
        ? "Conteúdo não encontrado | Guia Brechó"
        : "Conteúdo | Guia Brechó",
      description: apiError.status === 404
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

  if (!contentId) {
    return (
      <main className="page contents-page">
        <section className="hero">
          <span className="eyebrow">Conteúdo</span>
          <h1>Conteúdo inválido.</h1>
          <p>O identificador informado não é numérico.</p>
          <div className="hero-actions">
            <Link className="button" href="/contents">
              Voltar para conteúdos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const deepLink = `meer://content/${encodeURIComponent(String(contentId))}`;

  const [contentResult, commentsResult] = await Promise.allSettled([
    getSiteGuideContentById(contentId, { revalidate: CONTENTS_REVALIDATE_SECONDS }),
    listSiteGuideContentComments(contentId, {
      page: commentsPage,
      pageSize: COMMENTS_PAGE_SIZE,
      revalidate: CONTENTS_REVALIDATE_SECONDS
    })
  ]);

  const content = contentResult.status === "fulfilled" ? contentResult.value : null;
  const contentError = contentResult.status === "rejected"
    ? toApiError(contentResult.reason, "Falha ao carregar conteúdo.")
    : null;

  if (!content || contentError) {
    const message = contentError ? contentErrorMessage(contentError) : "Falha ao carregar conteúdo.";

    return (
      <main className="page contents-page">
        <section className="hero">
          <span className="eyebrow">Conteúdo</span>
          <h1>Não foi possível abrir este conteúdo.</h1>
          <p>{message}</p>
          <div className="hero-actions">
            <Link className="button" href="/contents">
              Voltar para conteúdos
            </Link>
            <OpenInAppButton className="button secondary" deepLink={deepLink}>
              Abrir no app
            </OpenInAppButton>
          </div>
        </section>
      </main>
    );
  }

  const comments = commentsResult.status === "fulfilled" ? commentsResult.value : null;
  const commentsError = commentsResult.status === "rejected"
    ? toApiError(commentsResult.reason, "Falha ao carregar comentários.")
    : null;

  return (
    <main className="page contents-page">
      <section className="hero content-detail-hero">
        <span className="eyebrow">Conteúdo</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className="hero-actions">
          <OpenInAppButton className="button" deepLink={deepLink}>
            Abrir no app
          </OpenInAppButton>
          <Link className="button secondary" href="/contents">
            Ver mais conteúdos
          </Link>
        </div>
      </section>

      <section className="card content-detail-card">
        {content.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.imageUrl}
            alt={`Imagem do conteúdo ${content.title}`}
            className="content-detail-image"
          />
        ) : null}

        <div className="content-detail-meta">
          <p>
            <strong>Loja:</strong> {content.thriftStoreName || "Comunidade"}
          </p>
          <p>
            <strong>Publicado em:</strong> {formatDateTime(content.createdAt)}
          </p>
          <p>
            <strong>Curtidas:</strong> {content.likeCount} • <strong>Comentários:</strong> {content.commentCount}
          </p>
        </div>
      </section>

      <section className="card comments-section">
        <h2>Comentários</h2>

        {commentsError ? <p className="form-error">{commentsErrorMessage(commentsError)}</p> : null}

        {comments && comments.items.length === 0 ? <p>Nenhum comentário ainda.</p> : null}

        {comments && comments.items.length > 0 ? (
          <div className="comments-list">
            {comments.items.map((comment) => (
              <article key={comment.id} className="comment-item">
                <header className="comment-header">
                  <strong>{comment.userDisplayName || "Usuário"}</strong>
                  <span>{formatDateTime(comment.createdAt)}</span>
                </header>
                <p>{comment.body}</p>
                {comment.edited ? <small>Comentário editado</small> : null}
              </article>
            ))}
          </div>
        ) : null}

        {comments ? (
          <nav className="contents-pagination" aria-label="Paginação de comentários">
            {comments.page > 0 ? (
              <Link className="button secondary" href={buildCommentsHref(content.id, comments.page - 1)}>
                Comentários anteriores
              </Link>
            ) : (
              <span className="button secondary button-disabled" aria-disabled>
                Comentários anteriores
              </span>
            )}

            <p className="contents-pagination-label">Página {comments.page + 1}</p>

            {comments.hasNext ? (
              <Link className="button" href={buildCommentsHref(content.id, comments.page + 1)}>
                Próximos comentários
              </Link>
            ) : (
              <span className="button button-disabled" aria-disabled>
                Próximos comentários
              </span>
            )}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
