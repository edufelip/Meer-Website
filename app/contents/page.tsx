import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";
import { listSiteGuideContents, SiteContentsApiError } from "../../src/siteContents/api";
import { buildContentsHref, parseContentsQuery } from "../../src/siteContents/query";

type ContentsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export const metadata: Metadata = {
  title: "Guia Brechó - Conteúdos",
  description: "Explore conteúdos, filtre por busca e navegue por páginas."
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Data indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
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

  let response:
    | {
        items: {
          id: number;
          title: string;
          description: string;
          imageUrl: string;
          thriftStoreName: string;
          createdAt: string;
          likeCount: number;
          commentCount: number;
        }[];
        page: number;
        hasNext: boolean;
      }
    | null = null;
  let error: SiteContentsApiError | null = null;

  try {
    response = await listSiteGuideContents({
      page: query.page,
      pageSize: query.pageSize,
      q: query.q,
      sort: query.sort,
      storeId: query.storeId,
      revalidate: 120
    });
  } catch (err) {
    if (err instanceof SiteContentsApiError) {
      error = err;
    } else {
      error = new SiteContentsApiError(500, "Falha ao carregar os conteúdos.");
    }
  }

  return (
    <main className="page contents-page">
      <section className="hero">
        <span className="eyebrow">Conteúdos</span>
        <h1>Explore dicas e achados da comunidade.</h1>
        <p>Use busca, ordenação e filtro por loja para encontrar o conteúdo certo.</p>
        <div className="hero-actions">
          <Link className="button secondary" href="/">
            Voltar para o início
          </Link>
        </div>
      </section>

      <section className="card contents-filters">
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
        <section className="card contents-state">
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
        <section className="card contents-state">
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
        <section className="contents-grid" aria-label="Lista de conteúdos">
          {response.items.map((item) => (
            <article key={item.id} className="card content-card">
              <Link className="content-card-link" href={`/content/${item.id}` as Route}>
                <div className="content-card-image-wrap">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={`Imagem do conteúdo ${item.title}`}
                      className="content-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="content-card-image content-card-image-fallback">Sem imagem</div>
                  )}
                </div>
                <div className="content-card-body">
                  <p className="content-card-store">{item.thriftStoreName || "Comunidade"}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="content-card-meta">
                    <span>{formatDate(item.createdAt)}</span>
                    <span>{item.likeCount} curtidas</span>
                    <span>{item.commentCount} comentários</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      ) : null}

      {response ? (
        <nav className="card contents-pagination" aria-label="Paginação de conteúdos">
          {query.page > 0 ? (
            <Link
              className="button secondary"
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
    </main>
  );
}
