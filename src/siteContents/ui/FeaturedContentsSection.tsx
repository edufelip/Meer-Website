"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { formatDateShort } from "../format";
import type { GuideContentDto } from "../types";
import { trackEvent } from "../../analytics/mixpanel";

export type FeaturedContentState =
  | { items: GuideContentDto[]; blockedByAuth: false }
  | { items: []; blockedByAuth: true };

type FeaturedContentsSectionProps = {
  featured: FeaturedContentState;
};

const MAX_DESCRIPTION_PREVIEW_LENGTH = 180;

function truncatePreview(text: string, maxLength = MAX_DESCRIPTION_PREVIEW_LENGTH): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export default function FeaturedContentsSection({ featured }: FeaturedContentsSectionProps) {
  const displayItems = featured.items.slice(0, 2);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-primary font-bold tracking-wider text-xs uppercase mb-2 block">Conteúdos</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-900 dark:text-white mb-4">
            Dicas fresquinhas para seu <br className="hidden md:block" />próximo garimpo.
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl">
            Veja publicações recentes da comunidade e descubra novos brechós e tendências.
          </p>
        </div>

        {featured.items.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {displayItems.map((content, index) => (
              <article key={content.id} className="flex flex-col md:flex-row bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 h-full group">
                <Link 
                  href={`/content/${content.id}` as Route}
                  className="flex flex-col md:flex-row w-full h-full"
                  onClick={() => trackEvent("Featured Content Clicked", { contentId: content.id, title: content.title })}
                >
                  <div className="md:w-2/5 h-64 md:h-auto bg-stone-200 relative overflow-hidden">
                    {content.imageUrl ? (
                      <Image
                        src={content.imageUrl}
                        alt={`Imagem de ${content.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        quality={70}
                        className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-500">Sem imagem</div>
                    )}
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <span className={`text-xs font-bold mb-2 block uppercase tracking-wider ${index === 0 ? 'text-primary' : 'text-secondary dark:text-green-400'}`}>
                        {content.thriftStoreName || "Guia Brechó"}
                      </span>
                      {index === 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-icons-outlined text-primary text-sm">star</span>
                          <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white leading-tight">{content.title}</h3>
                        </div>
                      )}
                      {index !== 0 && (
                        <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white leading-tight mb-3">{content.title}</h3>
                      )}
                      <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-4 mb-4">
                        {truncatePreview(content.description)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-700 pt-4 mt-4">
                      <span className="text-xs text-stone-400">{formatDateShort(content.createdAt)}</span>
                      {index === 0 ? (
                        <span className="text-xs text-stone-400">{content.commentCount} comentários</span>
                      ) : (
                        <span className="text-xs font-bold text-primary hover:text-yellow-600 flex items-center">
                          Ler mais <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-surface-light dark:bg-surface-dark p-8 text-sm text-stone-600 dark:text-stone-400">
            {featured.blockedByAuth
              ? "A API de conteúdos ainda está protegida por autenticação (401). Assim que o backend liberar acesso público, esta seção será preenchida automaticamente."
              : "Não foi possível carregar os conteúdos agora. Acesse a listagem completa para tentar novamente."}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/contents"
            className="inline-block bg-primary hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-medium transition-transform transform hover:-translate-y-1 shadow-lg shadow-primary/30"
            onClick={() => trackEvent("View More Contents Clicked")}
          >
            Ver mais conteúdos
          </Link>
        </div>
      </div>
    </section>
  );
}
