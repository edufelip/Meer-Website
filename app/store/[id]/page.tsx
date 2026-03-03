import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteStoreById, SiteStoreDetailsApiError } from "../../../src/storeDetails/api";
import type { StoreDetails } from "../../../src/storeDetails/types";
import PageShell from "../../../src/ui/PageShell";

type StorePageProps = {
  params: { id: string };
};

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function parseStoreId(rawId: string): string | null {
  const decoded = safeDecode(rawId);
  if (!decoded) return null;

  const trimmed = decoded.trim();
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function toApiError(error: unknown): SiteStoreDetailsApiError {
  if (error instanceof SiteStoreDetailsApiError) {
    return error;
  }
  return new SiteStoreDetailsApiError(500, "Não foi possível carregar a loja.");
}

function buildStoreErrorMessage(error: SiteStoreDetailsApiError): string {
  if (error.status === 404) {
    return "Essa loja não foi encontrada. Ela pode ter sido removida.";
  }
  if (error.status === 400) {
    return "O identificador informado é inválido.";
  }
  return error.message || "Não foi possível carregar os detalhes da loja.";
}

import DownloadAppButton from "../../../src/ui/DownloadAppButton";

function normalizePhoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized || phone}`;
}

function normalizeWhatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/55${digits}` : "#"; // Assuming BR country code +55 as default for Guia Brecho
}

function StoreStateView({ title, message }: { title: string; message: string }) {
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 md:p-10 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Loja
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-stone-900 dark:text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base text-stone-600 dark:text-stone-400">{message}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white px-6 py-3 rounded-full font-medium transition-colors" href="/">
              Voltar para o início
            </Link>
            <Link className="bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white px-6 py-3 rounded-full font-medium transition-colors" href="/contents">
              Ver conteúdos
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function buildDescription(store: StoreDetails): string {
  const parts = [store.description, store.neighborhood, store.addressLine].filter(
    (part): part is string => Boolean(part)
  );

  if (parts.length > 0) {
    return parts.join(" • ");
  }

  return `Veja detalhes da loja ${store.name} no Guia Brechó.`;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const storeId = parseStoreId(params.id);

  if (!storeId) {
    return {
      title: "Loja inválida | Guia Brechó",
      description: "O identificador da loja informado é inválido.",
      alternates: {
        canonical: "/"
      },
      robots: {
        index: false,
        follow: true
      }
    };
  }

  try {
    const store = await getSiteStoreById(storeId);
    const title = `${store.name} | Guia Brechó`;
    const description = buildDescription(store);
    const canonicalPath = `/store/${storeId}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath
      },
      openGraph: {
        type: "website",
        locale: "pt_BR",
        title,
        description,
        url: canonicalPath,
        siteName: "Guia Brechó",
        images: store.coverImageUrl ? [{ url: store.coverImageUrl, alt: `Capa da loja ${store.name}` }] : undefined
      },
      twitter: {
        card: store.coverImageUrl ? "summary_large_image" : "summary",
        title,
        description,
        images: store.coverImageUrl ? [store.coverImageUrl] : undefined
      }
    };
  } catch {
    return {
      title: "Loja | Guia Brechó",
      description: "Veja detalhes de lojas no Guia Brechó.",
      alternates: {
        canonical: `/store/${storeId}`
      },
      robots: {
        index: false,
        follow: true
      }
    };
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const storeId = parseStoreId(params.id);

  if (!storeId) {
    return <StoreStateView title="Loja inválida." message="O identificador informado não é um UUID válido." />;
  }

  let store: StoreDetails | null = null;
  let error: SiteStoreDetailsApiError | null = null;

  try {
    store = await getSiteStoreById(storeId);
  } catch (requestError) {
    error = toApiError(requestError);
  }

  if (!store || error) {
    return (
      <StoreStateView
        title="Não foi possível abrir essa loja."
        message={error ? buildStoreErrorMessage(error) : "Falha ao carregar a loja."}
      />
    );
  }

  const primaryImage = store.images?.[0]?.url || store.coverImageUrl;
  const secondaryImage = store.images?.[1]?.url;
  const tertiaryImage = store.images?.[2]?.url;

  const mapEmbedUrl = store.latitude && store.longitude 
    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.953250860361!2d${store.longitude}!3d${store.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr`
    : null;

  return (
    <PageShell>
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
                {store.latitude && store.longitude ? (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-light hover:bg-white text-stone-900 px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="material-icons-outlined">directions</span>
                    Ver Rota
                  </a>
                ) : store.addressLine ? (
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.addressLine)}`}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
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
        </div>
      </div>

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
    </PageShell>
  );
}
