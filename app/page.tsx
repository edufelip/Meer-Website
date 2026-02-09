import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { androidStoreUrl, iosStoreUrl } from "../src/urls";
import { listSiteGuideContents, SiteContentsApiError } from "../src/siteContents/api";
import type { GuideContentDto } from "../src/siteContents/types";

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

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Data indisponível";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

type FeaturedContentState =
  | { items: GuideContentDto[]; blockedByAuth: false }
  | { items: []; blockedByAuth: true };

async function getFeaturedContents(): Promise<FeaturedContentState> {
  try {
    const response = await listSiteGuideContents({
      page: 0,
      pageSize: 8,
      sort: "newest",
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

export default async function HomePage() {
  const featured = await getFeaturedContents();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ef] text-neutral-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.35),_rgba(247,244,239,0))] blur-2xl" />
        <div className="absolute bottom-[-12rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.28),_rgba(247,244,239,0))] blur-2xl" />
        <div className="absolute left-[45%] top-1/4 h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),_rgba(247,244,239,0))] blur-2xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-16 md:px-12 md:pt-24">
        <header className="flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
              <Image
                src="/assets/images/app-icon.png"
                alt={`${brandName} app icon`}
                width={36}
                height={36}
                priority
                className="rounded-xl"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Guia Brechó
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                Seu radar de achados conscientes
              </p>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold leading-tight text-neutral-900 md:text-6xl">
              Ache brechós incríveis, crie rotas e garanta peças únicas sem esforço.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-neutral-600 md:text-xl">
              {brandName} é o seu guia para garimpar com propósito. Descubra novidades,
              organize suas visitas e transforme cada busca em um encontro com o estilo certo.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
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
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              <h3 className="text-xl font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Conteúdos
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-neutral-900">
                Dicas fresquinhas para seu próximo garimpo.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
                Veja publicações recentes da comunidade e descubra novos brechós e tendências.
              </p>
            </div>
            <Link
              href="/contents"
              className="inline-flex w-fit items-center justify-center rounded-full border border-amber-300 bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-600"
            >
              Load more
            </Link>
          </div>

          {featured.items.length > 0 ? (
            <div className="mt-6 pb-2">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featured.items.map((content) => (
                  <article
                    key={content.id}
                    className="group rounded-2xl border border-amber-100 bg-white shadow-[0_14px_28px_rgba(148,96,20,0.12)]"
                  >
                    <Link href={`/content/${content.id}` as Route} className="block h-full">
                      <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-amber-50">
                        {content.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={content.imageUrl}
                            alt={`Imagem de ${content.title}`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-amber-700">
                            Sem imagem
                          </div>
                        )}
                      </div>

                      <div className="flex min-h-[180px] flex-col gap-2 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-amber-700">
                          {content.thriftStoreName || "Comunidade"}
                        </p>
                        <h3 className="home-content-title text-neutral-900">
                          {content.title}
                        </h3>
                        <p className="home-content-description">
                          {content.description}
                        </p>
                        <p className="mt-auto text-xs text-neutral-500">
                          {formatDate(content.createdAt)} • {content.commentCount} comentários
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm text-amber-900">
              {featured.blockedByAuth
                ? "A API de conteúdos ainda está protegida por autenticação (401). Assim que o backend liberar acesso público, esta seção será preenchida automaticamente."
                : "Não foi possível carregar os conteúdos agora. Acesse a listagem completa para tentar novamente."}
            </div>
          )}
        </section>

        <footer className="flex flex-col items-center gap-2 text-sm text-neutral-500 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-neutral-700"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-eula"
              className="transition-colors hover:text-neutral-700"
            >
              Terms &amp; EULA
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
