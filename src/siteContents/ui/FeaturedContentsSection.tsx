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

export default function FeaturedContentsSection({ featured }: FeaturedContentsSectionProps) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
      <div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Conteúdos
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-neutral-900">
            Dicas fresquinhas para seu próximo garimpo.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
            Veja publicações recentes da comunidade e descubra novos brechós e tendências.
          </p>
        </div>
      </div>

      {featured.items.length > 0 ? (
        <div className="mt-6 pb-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.items.map((content) => (
              <article
                key={content.id}
                className="group rounded-2xl border border-amber-100 bg-white shadow-[0_14px_28px_rgba(148,96,20,0.12)]"
              >
                <Link href={`/content/${content.id}` as Route} className="block h-full">
                  <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-amber-50">
                    {content.imageUrl ? (
                      <Image
                        src={content.imageUrl}
                        alt={`Imagem de ${content.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-amber-700">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="flex min-h-[180px] flex-col gap-2 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-amber-700">
                      {content.thriftStoreName || "Comunidade"}
                    </p>
                    <h3 className="home-content-title text-neutral-900">
                      {content.title}
                    </h3>
                    <p className="home-content-description">
                      {content.description}
                    </p>
                    <p className="mt-auto text-xs text-neutral-500">
                      {formatDateShort(content.createdAt)} • {content.commentCount} comentários
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-900">
          {featured.blockedByAuth
            ? "A API de conteúdos ainda está protegida por autenticação (401). Assim que o backend liberar acesso público, esta seção será preenchida automaticamente."
            : "Não foi possível carregar os conteúdos agora. Acesse a listagem completa para tentar novamente."}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Link
          href="/contents"
          className="inline-flex w-fit items-center justify-center rounded-full border border-amber-300 bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-600"
        >
          Ver mais
        </Link>
      </div>
    </section>
  );
}
