export default function ContentDetailLoading() {
  return (
    <main className="page contents-page" aria-busy>
      <section className="hero content-detail-hero">
        <span className="eyebrow">Conteúdo</span>
        <h1>Carregando conteúdo...</h1>
        <p>Buscando detalhes e comentários.</p>
      </section>

      <section className="card content-detail-card animate-pulse">
        <div className="content-detail-image bg-neutral-200" />
        <div className="content-detail-meta">
          <div className="h-4 w-1/2 rounded bg-neutral-200" />
          <div className="h-4 w-2/5 rounded bg-neutral-200" />
          <div className="h-4 w-1/3 rounded bg-neutral-200" />
        </div>
      </section>

      <section className="card comments-section animate-pulse">
        <h2>Comentários</h2>
        <div className="comments-list">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="comment-item">
              <div className="h-4 w-1/3 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-full rounded bg-neutral-200" />
              <div className="mt-1 h-3 w-4/5 rounded bg-neutral-200" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
