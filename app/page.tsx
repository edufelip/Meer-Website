import Image from "next/image";
import { Suspense } from "react";
import { androidStoreUrl, iosStoreUrl } from "../src/urls";
import { listSiteGuideContents, SiteContentsApiError } from "../src/siteContents/api";
import { getSiteContentsServerToken } from "../src/siteContents/serverAuth";
import { listFeaturedStores } from "../src/featuredStores/api";
import FeaturedContentsSection, {
  type FeaturedContentState
} from "../src/siteContents/ui/FeaturedContentsSection";
import LandingContentsAd from "../src/ads/ui/LandingContentsAd";
import FeaturedStoresSection from "../src/featuredStores/ui/FeaturedStoresSection";
import HomeSectionIntentHandler from "../src/navigation/HomeSectionIntentHandler";
import PageShell from "../src/ui/PageShell";

const brandName = "Guia Brechó";

const features = [
  {
    title: "Mapa vivo de brechós",
    description:
      "Encontre brechós por perto com sugestões atualizadas e filtros inteligentes para cada estilo.",
  },
  {
    title: "Achados que valem a pena",
    description:
      "Salve favoritos, monte rotas e receba dicas de peças únicas sem perder tempo no feed.",
  },
  {
    title: "Comunidade que ajuda",
    description:
      "Veja avaliações reais e compartilhe experiências para fortalecer o consumo consciente.",
  },
];

const badgeLinkClasses =
  "inline-flex h-12 items-center justify-center transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-14";
const badgeImageClasses = "h-full w-[132px] object-contain sm:w-[150px]";

async function getFeaturedContents(): Promise<FeaturedContentState> {
  const token = getSiteContentsServerToken();

  try {
    const response = await listSiteGuideContents({
      page: 0,
      pageSize: 8,
      sort: "newest",
      token,
      revalidate: 300
    });

    return { items: response.items, blockedByAuth: false };
  } catch (error) {
    if (error instanceof SiteContentsApiError && error.status === 401) {
      return { items: [], blockedByAuth: true };
    }

    return { items: [], blockedByAuth: false };
  }
}

async function FeaturedContentsSectionContainer() {
  const featured = await getFeaturedContents();
  return <FeaturedContentsSection featured={featured} />;
}

async function getFeaturedStores() {
  try {
    return await listFeaturedStores();
  } catch {
    return [];
  }
}

async function FeaturedStoresSectionContainer() {
  const stores = await getFeaturedStores();
  return <FeaturedStoresSection stores={stores} />;
}

function FeaturedContentsSkeleton() {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
        Conteúdos
      </p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-neutral-900">
        Dicas fresquinhas para seu próximo garimpo.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
        Carregando publicações recentes...
      </p>
      <div className="mt-6 h-48 rounded-2xl border border-amber-100 bg-amber-50/70" />
    </section>
  );
}

function FeaturedStoresSkeleton() {
  return (
    <section className="surface-card p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink-muted)]">
        Brechós em destaque
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        Curadoria especial da semana
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]"
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PageShell
      backgroundVariant="home"
      contentClassName="section-shell relative z-10 flex flex-col gap-16 pb-16 pt-28 md:pt-32"
    >
      <HomeSectionIntentHandler />

      <section className="surface-card grid gap-10 p-8 md:p-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
            Guia Brechó
          </p>
          <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-semibold leading-[1.08] text-[var(--ink)] md:text-6xl">
            Ache brechós incríveis, crie rotas e garanta peças únicas sem esforço.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)] md:text-xl">
            {brandName} é o seu guia para garimpar com propósito. Descubra novidades,
            organize suas visitas e transforme cada busca em um encontro com o estilo certo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className={badgeLinkClasses}
              href={iosStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download ${brandName} on the App Store`}
            >
              <Image
                src="/badges/app-store.svg"
                alt="Download on the App Store"
                className={badgeImageClasses}
                width={120}
                height={40}
                priority
              />
            </a>
            <a
              className={badgeLinkClasses}
              href={androidStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get ${brandName} on Google Play`}
            >
              <Image
                src="/badges/google-play.png"
                alt="Get it on Google Play"
                className={badgeImageClasses}
                width={172}
                height={60}
                priority
              />
            </a>
          </div>
        </div>

        <aside className="surface-card p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
              <Image
                src="/assets/images/app-icon.png"
                alt={`${brandName} app icon`}
                width={40}
                height={40}
                priority
                className="rounded-xl"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">Guia Brechó</p>
              <p className="text-xs text-[var(--ink-soft)]">Seu radar de achados conscientes</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-[var(--ink-soft)]">
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              Cadastre seu brechó
            </li>
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              Ache os brechós mais pertinhos de você
            </li>
            <li className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              Curadoria de achados em alta
            </li>
          </ul>
        </aside>
      </section>

      <section id="explorar" className="grid gap-6 md:grid-cols-3">
        <h2 className="sr-only">Diferenciais do Guia Brechó</h2>
        {features.map((feature) => (
          <article
            key={feature.title}
            className="surface-card p-6 transition hover:-translate-y-0.5"
          >
            <h3 className="text-xl font-semibold text-[var(--ink)]">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <LandingContentsAd />

      <div id="conteudos" className="scroll-mt-[var(--site-header-offset)]">
        <Suspense fallback={<FeaturedContentsSkeleton />}>
          <FeaturedContentsSectionContainer />
        </Suspense>
      </div>

      <div id="destaques" className="scroll-mt-[var(--site-header-offset)]">
        <Suspense fallback={<FeaturedStoresSkeleton />}>
          <FeaturedStoresSectionContainer />
        </Suspense>
      </div>
    </PageShell>
  );
}
