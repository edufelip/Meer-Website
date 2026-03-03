import Image from "next/image";
import { StoreDetails } from "../types";
import { normalizePhoneHref, getGoogleMapsDirectionsUrl } from "../format";

type StoreHeroProps = {
  store: StoreDetails;
};

export function StoreHero({ store }: StoreHeroProps) {
  const directionsUrl = store.latitude && store.longitude 
    ? getGoogleMapsDirectionsUrl({ latitude: store.latitude, longitude: store.longitude })
    : store.addressLine 
      ? getGoogleMapsDirectionsUrl(store.addressLine)
      : null;

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      {store.coverImageUrl ? (
        <Image 
          alt={`Interior da Loja ${store.name}`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" 
          src={store.coverImageUrl}
          fill
          priority
          sizes="100vw"
        />
      ) : (
        <div className="w-full h-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
          <span className="material-icons-outlined text-6xl text-stone-400">storefront</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-24 bg-gradient-to-t from-black/90 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-2 leading-tight">
                {store.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-icons-outlined text-lg">star</span>
                  <span className="font-bold text-white">{store.rating ? store.rating.toFixed(1) : "Novo"}</span>
                  {store.reviewCount !== null && store.reviewCount > 0 && (
                    <span className="text-white/60">({store.reviewCount} avaliações)</span>
                  )}
                </div>
                {store.addressLine && (
                  <>
                    <span className="hidden md:inline text-white/40">•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-icons-outlined text-lg">location_on</span>
                      <span>{store.addressLine}</span>
                    </div>
                  </>
                )}
                <span className="hidden md:inline text-white/40">•</span>
                <div className="flex items-center gap-1 text-green-400">
                  <span className="material-icons-outlined text-lg">{store.isOnlineStore ? 'language' : 'storefront'}</span>
                  <span>{store.isOnlineStore ? "Loja Online" : "Loja Física"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {directionsUrl ? (
                <a 
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface-light hover:bg-white text-stone-900 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="material-icons-outlined">directions</span>
                  Ver Rota
                </a>
              ) : (
                <button disabled className="opacity-50 cursor-not-allowed bg-surface-light text-stone-900 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg">
                  <span className="material-icons-outlined">directions</span>
                  Ver Rota
                </button>
              )}
              {store.phone ? (
                <a href={normalizePhoneHref(store.phone)} target="_blank" rel="noopener noreferrer" className="bg-secondary hover:bg-green-800 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/10">
                  <span className="material-icons-outlined">call</span>
                  Ligar
                </a>
              ) : (
                 <button disabled className="opacity-50 cursor-not-allowed bg-secondary text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg border border-white/10">
                  <span className="material-icons-outlined">call</span>
                  Sem Contato
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
