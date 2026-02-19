import type { Route } from "next";
import Link from "next/link";
import { formatDateTime } from "../format";
import type { GuideContentCommentDto, PageResponse } from "../types";

type CommentsSectionProps = {
  comments: PageResponse<GuideContentCommentDto> | null;
  commentsErrorMessage?: string | null;
  buildPageHref: (page: number) => Route;
};

export default function CommentsSection({
  comments,
  commentsErrorMessage,
  buildPageHref
}: CommentsSectionProps) {
  return (
    <section className="surface-card comments-section p-6">
      <h2>Comentários</h2>

      {commentsErrorMessage ? <p className="form-error">{commentsErrorMessage}</p> : null}

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
        <nav className="contents-pagination mt-6" aria-label="Paginação de comentários">
          {comments.page > 0 ? (
            <Link className="button secondary" href={buildPageHref(comments.page - 1)}>
              Comentários anteriores
            </Link>
          ) : (
            <span className="button secondary button-disabled" aria-disabled>
              Comentários anteriores
            </span>
          )}

          <p className="contents-pagination-label">Página {comments.page + 1}</p>

          {comments.hasNext ? (
            <Link className="button" href={buildPageHref(comments.page + 1)}>
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
  );
}
