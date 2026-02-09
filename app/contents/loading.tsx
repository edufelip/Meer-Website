export default function ContentsLoading() {
  return (
    <main className="page contents-page" aria-busy>
      <section className="hero">
        <span className="eyebrow">Conteúdos</span>
        <h1>Carregando conteúdos...</h1>
        <p>Preparando busca, filtros e paginação.</p>
      </section>

      <section className="card contents-filters animate-pulse">
        <div className="contents-filter-form">
          <div className="form-field">
            <span className="label">Buscar conteúdo</span>
            <div className="input h-11" />
          </div>
          <div className="form-field">
            <span className="label">Ordenação</span>
            <div className="input h-11" />
          </div>
        </div>
      </section>

      <section className="contents-grid" aria-label="Carregando lista de conteúdos">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={index} className="card content-card animate-pulse">
            <div className="content-card-image-wrap" />
            <div className="content-card-body">
              <div className="h-3 w-24 rounded bg-amber-100" />
              <div className="h-5 w-4/5 rounded bg-neutral-200" />
              <div className="h-4 w-full rounded bg-neutral-200" />
              <div className="h-4 w-2/3 rounded bg-neutral-200" />
              <div className="h-3 w-1/2 rounded bg-neutral-200" />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
