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

const features = [
  {
    title: "Mapa vivo de brechós",
    description:
      "Encontre brechós por perto com sugestões atualizadas e filtros inteligentes para cada estilo.",
    icon: "map"
  },
  {
    title: "Achados que valem a pena",
    description:
      "Salve favoritos, monte rotas e receba dicas de peças únicas sem perder tempo no feed.",
    icon: "favorite_border"
  },
  {
    title: "Comunidade que ajuda",
    description:
      "Veja avaliações reais e compartilhe experiências para fortalecer o consumo consciente.",
    icon: "groups"
  },
];

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
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-pulse">
          <div className="h-4 w-24 bg-stone-200 dark:bg-stone-700 rounded mb-4"></div>
          <div className="h-12 w-3/4 bg-stone-200 dark:bg-stone-700 rounded mb-4"></div>
          <div className="h-6 w-1/2 bg-stone-200 dark:bg-stone-700 rounded"></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
          <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
}

function FeaturedStoresSkeleton() {
  return (
    <section className="py-24 bg-white dark:bg-stone-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-pulse">
          <div className="h-4 w-32 bg-stone-200 dark:bg-stone-700 rounded mb-4"></div>
          <div className="h-10 w-2/3 bg-stone-200 dark:bg-stone-700 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PageShell>
      <HomeSectionIntentHandler />

      <header className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none flex w-[200%] animate-slide-left">
          <div className="relative w-1/2 h-full">
            <Image src="/assets/images/world-map.jpg" alt="World Map" fill className="object-cover" priority />
          </div>
          <div className="relative w-1/2 h-full">
            <Image src="/assets/images/world-map.jpg" alt="World Map" fill className="object-cover" priority />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-semibold tracking-wide uppercase mb-6">
                Guia Brechó
              </span>
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-stone-900 dark:text-white leading-tight mb-6">
                Ache brechós <span className="text-primary italic">incríveis</span>, crie rotas e garanta peças únicas.
              </h1>
              <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed max-w-lg">
                Guia Brechó é o seu guia para garimpar com propósito. Descubra novidades, organize suas visitas e transforme cada busca em um encontro com o estilo certo.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href={iosStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black hover:bg-stone-800 text-white px-5 py-3 rounded-xl transition-all shadow-md"
                >
                  <span className="material-icons-outlined text-2xl mr-2">apple</span>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px]">Download on the</span>
                    <span className="font-bold text-sm">App Store</span>
                  </div>
                </a>
                <a
                  href={androidStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black hover:bg-stone-800 text-white px-5 py-3 rounded-xl transition-all shadow-md"
                >
                  <span className="material-icons-outlined text-2xl mr-2">android</span>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[10px]">GET IT ON</span>
                    <span className="font-bold text-sm">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="relative lg:h-full flex items-center justify-center lg:justify-end">
              <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-700 max-w-sm w-full relative transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-stone-100 dark:bg-stone-800 p-3 rounded-full">
                    <span className="material-icons-outlined text-primary text-2xl">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-stone-900 dark:text-white text-lg">Guia Brechó</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Seu radar de achados conscientes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-primary cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Cadastre seu brechó</span>
                      <span className="material-icons-outlined text-stone-400 group-hover:text-primary text-sm">arrow_forward</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-primary cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Ache os brechós mais pertinhos</span>
                      <span className="material-icons-outlined text-stone-400 group-hover:text-primary text-sm">near_me</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-primary cursor-pointer transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-200">Curadoria de achados em alta</span>
                      <span className="material-icons-outlined text-stone-400 group-hover:text-primary text-sm">trending_up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="explorar" className="py-16 bg-white dark:bg-stone-900/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-stone-100 dark:border-stone-800 hover:shadow-xl transition-shadow duration-300 group">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-icons-outlined text-stone-800 dark:text-stone-200 group-hover:text-primary">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-stone-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingContentsAd />

      <div id="conteudos" className="scroll-mt-20">
        <Suspense fallback={<FeaturedContentsSkeleton />}>
          <FeaturedContentsSectionContainer />
        </Suspense>
      </div>

      <div id="destaques" className="scroll-mt-20">
        <Suspense fallback={<FeaturedStoresSkeleton />}>
          <FeaturedStoresSectionContainer />
        </Suspense>
      </div>
    </PageShell>
  );
}
