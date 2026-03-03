import Image from "next/image";
import { StoreDetails } from "../types";
import { normalizeWhatsappHref } from "../format";

type StoreFeaturedPiecesProps = {
  store: StoreDetails;
};

export function StoreFeaturedPieces({ store }: StoreFeaturedPiecesProps) {
  const primaryImage = store.images?.[0]?.url || store.coverImageUrl;
  const secondaryImage = store.images?.[1]?.url;
  const tertiaryImage = store.images?.[2]?.url;

  return (
    <div className="lg:col-span-7">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white">Peças em Destaque</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Acervo do brechó</p>
        </div>
      </div>

      {primaryImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {primaryImage && (
            <div className="group relative md:col-span-2 aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-stone-200 dark:bg-stone-800">
              <Image 
                alt="Destaque 1" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                src={primaryImage}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
              <div className="absolute top-4 right-4 z-10">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-primary transition-colors flex items-center justify-center">
                  <span className="material-icons-outlined">favorite</span>
                </button>
              </div>
            </div>
          )}
          {secondaryImage && (
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-stone-200 dark:bg-stone-800">
              <Image 
                alt="Destaque 2" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                src={secondaryImage}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          )}
          {tertiaryImage && (
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-stone-200 dark:bg-stone-800">
              <Image 
                alt="Destaque 3" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                src={tertiaryImage}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl text-center text-stone-500 dark:text-stone-400">
          Nenhuma foto do acervo disponível no momento.
        </div>
      )}

      {store.phone ? (
        <div className="mt-8 bg-secondary/5 border border-secondary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary dark:text-green-400">
              <span className="material-icons-outlined">chat</span>
            </div>
            <div>
              <h4 className="font-bold text-secondary dark:text-green-400">Contato Rápido</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">Tire suas dúvidas diretamente com a loja.</p>
            </div>
          </div>
          <a 
            href={normalizeWhatsappHref(store.phone)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-secondary hover:bg-green-800 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg border border-white/10"
          >
            Abrir WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}
