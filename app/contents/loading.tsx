import PageShell from "../../src/ui/PageShell";

const CARD_SKELETON_COUNT = 9;

function ContentCardSkeleton({ index }: { index: number }) {
  return (
    <article className="surface-card content-card overflow-hidden" aria-hidden>
      <div className="content-card-image-wrap">
        <div className="skeleton-block skeleton-shimmer h-full w-full" />
      </div>
      <div className="content-card-body">
        <span className="skeleton-block skeleton-shimmer h-3 w-20 rounded-full" />
        <span className="skeleton-block skeleton-shimmer h-5 w-[80%]" />
        <span className="skeleton-block skeleton-shimmer h-4 w-full" />
        <span className="skeleton-block skeleton-shimmer h-4 w-[72%]" />
        <div className="content-card-meta">
          <span className="skeleton-block skeleton-shimmer h-3 w-20 rounded-full" />
          {index % 2 === 0 ? <span className="skeleton-block skeleton-shimmer h-3 w-24 rounded-full" /> : null}
          <span className="skeleton-block skeleton-shimmer h-3 w-24 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export default function ContentsLoading() {
  return (
    <PageShell>
      <section className="surface-card p-7 md:p-9" aria-busy>
        <span className="skeleton-block skeleton-shimmer h-3 w-24 rounded-full" />
        <h1 className="mt-3">
          <span className="skeleton-block skeleton-shimmer h-10 w-[min(32rem,100%)]" />
        </h1>
        <p className="mt-4 max-w-2xl">
          <span className="skeleton-block skeleton-shimmer h-5 w-full max-w-[36rem]" />
        </p>
        <div className="mt-6">
          <span className="skeleton-block skeleton-shimmer h-11 w-44 rounded-full" />
        </div>
      </section>

      <section className="surface-card p-6 md:p-7" aria-busy>
        <div className="contents-filter-form">
          <div className="form-field">
            <span className="label">Buscar conteúdo</span>
            <span className="skeleton-block skeleton-shimmer h-11 w-full rounded-[14px]" />
          </div>

          <div className="form-field">
            <span className="label">Ordenação</span>
            <span className="skeleton-block skeleton-shimmer h-11 w-full rounded-[14px]" />
          </div>

          <div className="contents-filter-actions">
            <span className="skeleton-block skeleton-shimmer h-11 w-32 rounded-full" />
            <span className="skeleton-block skeleton-shimmer h-11 w-28 rounded-full" />
          </div>
        </div>
      </section>

      <section className="contents-grid" aria-label="Carregando lista de conteúdos" aria-busy>
        {Array.from({ length: CARD_SKELETON_COUNT }).map((_, index) => (
          <ContentCardSkeleton key={`content-card-skeleton-${index}`} index={index} />
        ))}
      </section>

      <nav className="surface-card contents-pagination p-5" aria-label="Carregando paginação" aria-busy>
        <span className="skeleton-block skeleton-shimmer h-11 w-36 rounded-full" />
        <span className="skeleton-block skeleton-shimmer h-5 w-28" />
        <span className="skeleton-block skeleton-shimmer h-11 w-36 rounded-full" />
      </nav>
    </PageShell>
  );
}
