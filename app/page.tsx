import Image from "next/image";
import Link from "next/link";
import { androidStoreUrl, iosStoreUrl } from "../src/urls";

const brandName = "Guia Brechó";
const tagline = "Descubra brechós perto de você";

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

export default function HomePage() {
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

        <footer className="flex flex-col items-center gap-2 text-sm text-neutral-500 sm:flex-row sm:justify-between">
          <p>{tagline}</p>
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
