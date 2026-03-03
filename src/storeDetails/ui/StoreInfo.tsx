import { StoreDetails } from "../types";
import { getGoogleMapsEmbedUrl } from "../format";

type StoreInfoProps = {
  store: StoreDetails;
};

export function StoreInfo({ store }: StoreInfoProps) {
  const mapEmbedUrl = store.latitude && store.longitude 
    ? getGoogleMapsEmbedUrl(store.latitude, store.longitude)
    : null;

  return (
    <div className="lg:col-span-5 space-y-10">
      <section>
        <h3 className="font-display text-2xl font-bold text-stone-900 dark:text-white mb-4">Sobre o Brechó</h3>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
          {store.description || "Nenhuma descrição fornecida para este brechó."}
        </p>
        <div className="flex flex-wrap gap-2">
          {store.categories.map((category) => (
            <span key={category} className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full text-xs font-medium">
              {category}
            </span>
          ))}
        </div>
      </section>

      {store.openingHours && (
        <section className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <span className="material-icons-outlined">schedule</span>
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white">Horário de Funcionamento</h3>
          </div>
          <div className="text-stone-600 dark:text-stone-300 text-sm whitespace-pre-wrap leading-relaxed">
            {store.openingHours}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-display text-lg font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-icons-outlined text-primary">map</span>
          Localização
        </h3>
        <div className="w-full h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl overflow-hidden relative group cursor-pointer">
          {mapEmbedUrl ? (
            <iframe 
              className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              src={mapEmbedUrl} 
              style={{ border: 0 }}
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 p-6 text-center">
              <span className="material-icons-outlined text-4xl mb-2">location_off</span>
              <p className="text-sm">Mapa indisponível. Endereço: {store.addressLine || 'Não informado'}</p>
            </div>
          )}
          {mapEmbedUrl && store.latitude && store.longitude && (
            <div className="absolute bottom-4 right-4">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors inline-block"
              >
                Abrir no Maps
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
