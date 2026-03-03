import type { Metadata } from "next";
import Link from "next/link";
import { getSiteStoreById, SiteStoreDetailsApiError } from "../../../src/storeDetails/api";
import type { StoreDetails } from "../../../src/storeDetails/types";
import PageShell from "../../../src/ui/PageShell";
import { StoreHero } from "../../../src/storeDetails/ui/StoreHero";
import { StoreInfo } from "../../../src/storeDetails/ui/StoreInfo";
import { StoreFeaturedPieces } from "../../../src/storeDetails/ui/StoreFeaturedPieces";
import { StoreReviewsCTA } from "../../../src/storeDetails/ui/StoreReviewsCTA";

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

  return (
    <PageShell>
      <StoreHero store={store} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          <StoreInfo store={store} />
          <StoreFeaturedPieces store={store} />
        </div>
      </div>

      <StoreReviewsCTA store={store} />
    </PageShell>
  );
}
