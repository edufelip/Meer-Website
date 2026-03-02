"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { FeaturedStore } from "../types";
import { trackEvent } from "../../analytics/mixpanel";

type FeaturedStoresSectionProps = {
  stores: FeaturedStore[];
};

export default function FeaturedStoresSection({ stores }: FeaturedStoresSectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-stone-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-primary font-bold tracking-wider text-xs uppercase mb-2 block">Brechós em Destaque</span>
            <h2 className="font-display text-4xl font-bold text-stone-900 dark:text-white">Curadoria especial da semana</h2>
          </div>
        </div>

        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stores.slice(0, 4).map((store) => (
              <div key={store.id} className="group cursor-pointer">
                <Link 
                  href={`/store/${store.id}` as Route} 
                  className="block"
                  onClick={() => trackEvent("Featured Store Clicked", { storeId: store.id, storeName: store.name })}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 bg-stone-200 dark:bg-stone-800">
                    {store.coverImageUrl && (
                      <Image
                        src={store.coverImageUrl}
                        alt={`Capa do brechó ${store.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        quality={75}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                      <span className="material-icons-outlined text-sm">favorite_border</span>
                    </button>
                  </div>
                  <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white group-hover:text-primary transition-colors">{store.name}</h3>
                  {/* Assuming location and niche might not be available, falling back to simple description */}
                  <p className="text-sm text-stone-500 dark:text-stone-400 truncate">Brechó Destaque</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 bg-surface-light dark:bg-surface-dark p-8 text-sm text-stone-600 dark:text-stone-400">
            Não conseguimos carregar os brechós em destaque agora.
          </div>
        )}
      </div>
    </section>
  );
}
