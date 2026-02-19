import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { FeaturedStore } from "../types";

type FeaturedStoresSectionProps = {
  stores: FeaturedStore[];
};

export default function FeaturedStoresSection({ stores }: FeaturedStoresSectionProps) {
  return (
    <section className="surface-card p-6 md:p-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-muted)]">
            Brechós em destaque
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
            Curadoria especial da semana
          </h2>
        </div>
        <Link
          href="/contents"
          className="hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface)] md:inline-flex"
        >
          Explorar conteúdos
        </Link>
      </div>

      {stores.length > 0 ? (
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
          {stores.map((store) => (
            <article
              key={store.id}
              className="group min-w-[260px] max-w-[260px] snap-start overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
            >
              <Link href={`/store/${store.id}` as Route} className="block">
                <div className="relative aspect-square overflow-hidden bg-[var(--surface-muted)]">
                  <Image
                    src={store.coverImageUrl}
                    alt={`Capa do brechó ${store.name}`}
                    fill
                    sizes="(max-width: 768px) 70vw, 260px"
                    quality={68}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{store.name}</h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-5 text-sm text-[var(--ink-soft)]">
          Não conseguimos carregar os brechós em destaque agora.
        </div>
      )}
    </section>
  );
}
