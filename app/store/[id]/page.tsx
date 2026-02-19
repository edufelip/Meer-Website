import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteStoreById, SiteStoreDetailsApiError } from "../../../src/storeDetails/api";
import type { StoreDetails } from "../../../src/storeDetails/types";
import PageShell from "../../../src/ui/PageShell";

type StorePageProps = {
  params: { id: string };
};

const INSTAGRAM_BASE_URL = "https://instagram.com/";

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

  return new SiteStoreDetailsApiError(500, "Nao foi possivel carregar a loja.");
}

function buildStoreErrorMessage(error: SiteStoreDetailsApiError): string {
  if (error.status === 404) {
    return "Essa loja nao foi encontrada. Ela pode ter sido removida.";
  }

  if (error.status === 400) {
    return "O identificador informado e invalido.";
  }

  return error.message || "Nao foi possivel carregar os detalhes da loja.";
}

function formatRating(rating: number | null, reviewCount: number | null): string {
  if (rating === null && reviewCount === null) {
    return "Sem avaliacoes ainda";
  }

  if (rating !== null && reviewCount !== null) {
    return `${rating.toFixed(1)} (${reviewCount} avaliacoes)`;
  }

  if (rating !== null) {
    return `${rating.toFixed(1)} estrelas`;
  }

  return `${reviewCount} avaliacoes`;
}

function normalizePhoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized || phone}`;
}

function normalizeWhatsappHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
}

function normalizeInstagramHref(instagram: string): string {
  const trimmed = instagram.trim();
  if (!trimmed) return "#";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const username = trimmed.replace(/^@/, "").replace(/\s+/g, "");
  return username ? `${INSTAGRAM_BASE_URL}${username}` : "#";
}

function StoreStateView({ title, message }: { title: string; message: string }) {
  return (
    <PageShell>
      <section className="surface-card p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
          Loja
        </span>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--ink)] md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base text-[var(--ink-soft)]">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button" href="/">
            Voltar para o inicio
          </Link>
          <Link className="button secondary" href="/contents">
            Ver conteudos
          </Link>
        </div>
      </section>
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

  return `Veja detalhes da loja ${store.name} no Guia Brecho.`;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const storeId = parseStoreId(params.id);

  if (!storeId) {
    return {
      title: "Loja invalida | Guia Brecho",
      description: "O identificador da loja informado e invalido.",
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
    const title = `${store.name} | Guia Brecho`;
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
        siteName: "Guia Brecho",
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
      title: "Loja | Guia Brecho",
      description: "Veja detalhes de lojas no Guia Brecho.",
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
    return <StoreStateView title="Loja invalida." message="O identificador informado nao e um UUID valido." />;
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
        title="Nao foi possivel abrir essa loja."
        message={error ? buildStoreErrorMessage(error) : "Falha ao carregar a loja."}
      />
    );
  }

  return (
    <PageShell>
      <section className="surface-card p-8 md:p-10">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">Loja</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">{store.name}</h1>
        {store.description ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
            {store.description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {store.badgeLabel ? (
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-sm font-medium text-[var(--ink)]">
              {store.badgeLabel}
            </span>
          ) : null}
          {store.categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {store.images.length > 0 ? (
        <section className="surface-card p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">Fotos da loja</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {store.images.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                <Image
                  src={image.url}
                  alt={`Imagem da loja ${store.name}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="h-full w-full object-cover"
                  quality={68}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <article className="surface-card p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">Informacoes</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {store.neighborhood ? (
              <div>
                <dt className="font-semibold text-[var(--ink)]">Bairro</dt>
                <dd className="text-[var(--ink-soft)]">{store.neighborhood}</dd>
              </div>
            ) : null}
            {store.addressLine ? (
              <div>
                <dt className="font-semibold text-[var(--ink)]">Endereco</dt>
                <dd className="text-[var(--ink-soft)]">{store.addressLine}</dd>
              </div>
            ) : null}
            {store.openingHours ? (
              <div>
                <dt className="font-semibold text-[var(--ink)]">Horario</dt>
                <dd className="text-[var(--ink-soft)]">{store.openingHours}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-semibold text-[var(--ink)]">Avaliacao</dt>
              <dd className="text-[var(--ink-soft)]">{formatRating(store.rating, store.reviewCount)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--ink)]">Tipo</dt>
              <dd className="text-[var(--ink-soft)]">{store.isOnlineStore ? "Loja online" : "Loja fisica"}</dd>
            </div>
          </dl>
        </article>

        <article className="surface-card p-6 md:p-7">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">Contato e redes</h2>
          <div className="mt-4 grid gap-3">
            {store.website ? (
              <a className="button secondary" href={store.website} target="_blank" rel="noreferrer noopener">
                Site oficial
              </a>
            ) : null}
            {store.instagram ? (
              <a
                className="button secondary"
                href={normalizeInstagramHref(store.instagram)}
                target="_blank"
                rel="noreferrer noopener"
              >
                Instagram
              </a>
            ) : null}
            {store.facebook ? (
              <a className="button secondary" href={store.facebook} target="_blank" rel="noreferrer noopener">
                Facebook
              </a>
            ) : null}
            {store.phone ? (
              <a className="button secondary" href={normalizePhoneHref(store.phone)}>
                Ligar: {store.phone}
              </a>
            ) : null}
            {store.whatsapp ? (
              <a
                className="button secondary"
                href={normalizeWhatsappHref(store.whatsapp)}
                target="_blank"
                rel="noreferrer noopener"
              >
                WhatsApp: {store.whatsapp}
              </a>
            ) : null}
            {!store.website && !store.instagram && !store.facebook && !store.phone && !store.whatsapp ? (
              <p className="text-sm text-[var(--ink-soft)]">Nenhum canal de contato disponivel no momento.</p>
            ) : null}
          </div>
        </article>
      </section>
    </PageShell>
  );
}
