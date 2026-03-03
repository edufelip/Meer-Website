import DownloadAppButton from "../../../src/ui/DownloadAppButton";
import { StoreDetails } from "../types";

type StoreReviewsCTAProps = {
  store: StoreDetails;
};

export function StoreReviewsCTA({ store }: StoreReviewsCTAProps) {
  return (
    <div className="bg-surface-light dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <span className="material-icons-outlined text-3xl">forum</span>
        </div>
        
        {store.reviewCount && store.reviewCount > 0 ? (
          <>
            <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-4">
              O que dizem os garimpeiros
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-8">
              Esta loja possui <strong>{store.reviewCount} avaliações</strong> com nota média de <strong>{store.rating?.toFixed(1)}</strong>. Baixe o app do Guia Brechó para ler os relatos completos e deixar sua própria experiência!
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-4">
              Seja o primeiro a avaliar!
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-8">
              Já visitou o <strong>{store.name}</strong>? Baixe o app do Guia Brechó para compartilhar sua experiência, dar dicas sobre o acervo e ajudar outros garimpeiros.
            </p>
          </>
        )}

        <DownloadAppButton 
          className="inline-flex items-center justify-center bg-primary hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform transform hover:-translate-y-1 shadow-lg shadow-primary/30 gap-2"
        >
          <span className="material-icons-outlined">smartphone</span>
          Abrir no App
        </DownloadAppButton>
      </div>
    </div>
  );
}
