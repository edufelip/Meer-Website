import Image from "next/image";
import { androidStoreUrl, iosStoreUrl } from "../src/urls";

const brandName = "Guia Brechó"; // TODO: replace with final brand name.
const tagline = "Descubra brechós perto de você"; // TODO: replace with final tagline.

const badgeLinkClasses =
  "inline-flex h-12 items-center justify-center rounded-full transition duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-14";
const badgeImageClasses = "h-full w-[132px] object-contain sm:w-[144px]";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-neutral-900">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center font-sans sm:gap-7">
        <div className="flex flex-col items-center">
          <Image
            src="/assets/images/app-icon.png"
            alt={`${brandName} app icon`}
            className="mb-3 h-16 w-16"
            width={64}
            height={64}
            priority
          />
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl" style={{marginTop: '8px', marginBottom: '0px'}}>
            {brandName}
          </h1>
          <p className="text-sm text-neutral-500 sm:text-base sm:whitespace-nowrap m-0">
            {tagline}
          </p>
        </div>

        <div className="flex flex-row items-center gap-3">
          <a
            className={badgeLinkClasses}
            href={iosStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download ${brandName} on the App Store`}
          >
            <Image
              src="/badges/app-store.svg"
              alt=""
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
              alt=""
              className={badgeImageClasses}
              width={172}
              height={60}
              priority
            />
          </a>
        </div>
      </section>
    </main>
  );
}
