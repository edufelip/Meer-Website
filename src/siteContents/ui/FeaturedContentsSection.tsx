import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { formatDateShort } from "../format";
import type { GuideContentDto } from "../types";

export type FeaturedContentState =
  | { items: GuideContentDto[]; blockedByAuth: false }
  | { items: []; blockedByAuth: true };

type FeaturedContentsSectionProps = {
  featured: FeaturedContentState;
};

const MAX_DESCRIPTION_PREVIEW_LENGTH = 220;

function truncatePreview(text: string, maxLength = MAX_DESCRIPTION_PREVIEW_LENGTH): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export default function FeaturedContentsSection({ featured }: FeaturedContentsSectionProps) {
  const [primary, ...secondary] = featured.items;

  return (
    <section className="surface-card p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
        Conteúdos
      </p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-[var(--ink)] md:text-5xl">
        Dicas fresquinhas para seu próximo garimpo.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-base">
        Veja publicações recentes da comunidade e descubra novos brechós e tendências.
      </p>

      {featured.items.length > 0 ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {primary ? (
            <article className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)]">
              <Link href={`/content/${primary.id}` as Route} className="grid h-full gap-4 md:grid-cols-2">
                <div className="relative min-h-[260px] overflow-hidden bg-[var(--surface)]">
                  {primary.imageUrl ? (
                    <Image
                      src={primary.imageUrl}
                      alt={`Imagem de ${primary.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={70}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--accent-3)]">
                      Sem imagem
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-6">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent-3)]">
                    {primary.thriftStoreName || "Comunidade"}
                  </p>
                  <h3 className="text-2xl font-semibold leading-tight text-[var(--ink)]">
                    {primary.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                    {truncatePreview(primary.description, 260)}
                  </p>
                  <p className="mt-auto text-xs text-[var(--ink-muted)]">
                    {formatDateShort(primary.createdAt)} • {primary.commentCount} comentários
                  </p>
                </div>
              </Link>
            </article>
          ) : null}

          <div className="grid gap-4">
            {secondary.slice(0, 2).map((content) => (
              <article key={content.id} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <Link href={`/content/${content.id}` as Route} className="grid h-full gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="relative min-h-[120px] bg-[var(--surface-muted)]">
                    {content.imageUrl ? (
                      <Image
                        src={content.imageUrl}
                        alt={`Imagem de ${content.title}`}
                        fill
                        sizes="120px"
                        quality={65}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[var(--accent-3)]">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-[120px] flex-col gap-2 p-4">
                    <h3 className="text-base font-semibold leading-snug text-[var(--ink)]">
                      {content.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
                      {truncatePreview(content.description, 120)}
                    </p>
                    <p className="mt-auto text-xs text-[var(--ink-muted)]">
                      {formatDateShort(content.createdAt)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--ink-soft)]">
          {featured.blockedByAuth
            ? "A API de conteúdos ainda está protegida por autenticação (401). Assim que o backend liberar acesso público, esta seção será preenchida automaticamente."
            : "Não foi possível carregar os conteúdos agora. Acesse a listagem completa para tentar novamente."}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link
          href="/contents"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--accent-2)]"
        >
          Ver mais
        </Link>
      </div>
    </section>
  );
}
