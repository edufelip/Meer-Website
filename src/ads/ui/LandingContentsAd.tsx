"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  ADS_ENABLED,
  ADSENSE_CLIENT_ID,
  ADSENSE_HOME_CONTENTS_SLOT_ID
} from "../config";
import {
  readAdsConsent,
  writeAdsConsent,
  type AdsConsentState,
  type PersistedAdsConsent
} from "../consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type LandingContentsAdProps = {
  className?: string;
};

type AdVisibilityState = "pending" | "visible" | "hidden";
const NO_FILL_TIMEOUT_MS = 7000;
const POLL_INTERVAL_MS = 250;

export default function LandingContentsAd({ className }: LandingContentsAdProps) {
  const adClient = ADSENSE_CLIENT_ID;
  const adSlot = ADSENSE_HOME_CONTENTS_SLOT_ID;
  const adsEnabled = ADS_ENABLED && Boolean(adClient) && Boolean(adSlot);
  const adSenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
  const adRef = useRef<HTMLModElement | null>(null);
  const hasQueuedAd = useRef(false);
  const isResolvedRef = useRef(false);
  const [consent, setConsent] = useState<AdsConsentState>("unknown");
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [visibility, setVisibility] = useState<AdVisibilityState>("pending");

  useEffect(() => {
    if (!adsEnabled) {
      return;
    }

    setConsent(readAdsConsent(window.localStorage));
  }, [adsEnabled]);

  useEffect(() => {
    if (!adsEnabled || consent !== "granted" || !isScriptReady || hasQueuedAd.current) {
      return;
    }

    if (!window.adsbygoogle) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasQueuedAd.current = true;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("AdSense failed to enqueue ad", error);
      }

      setVisibility("hidden");
    }
  }, [adsEnabled, consent, isScriptReady]);

  useEffect(() => {
    if (!adsEnabled || consent !== "granted") {
      return;
    }

    const startedAt = Date.now();

    const resolveIfReady = () => {
      const adNode = adRef.current;
      if (!adNode || isResolvedRef.current) {
        return;
      }

      const adStatus = adNode.getAttribute("data-ad-status");
      if (adStatus === "unfilled") {
        isResolvedRef.current = true;
        setVisibility("hidden");
        return;
      }

      const iframe = adNode.querySelector("iframe");
      const iframeHeight = iframe ? iframe.getBoundingClientRect().height : 0;
      if (adStatus === "filled" && iframe && iframeHeight > 0) {
        isResolvedRef.current = true;
        setVisibility("visible");
      }
    };

    const intervalId = window.setInterval(() => {
      resolveIfReady();

      if (isResolvedRef.current) {
        window.clearInterval(intervalId);
        return;
      }

      if (Date.now() - startedAt >= NO_FILL_TIMEOUT_MS) {
        isResolvedRef.current = true;
        setVisibility("hidden");
        window.clearInterval(intervalId);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [adsEnabled, consent]);

  const handleConsent = (nextConsent: PersistedAdsConsent) => {
    writeAdsConsent(window.localStorage, nextConsent);
    setConsent(nextConsent);

    if (nextConsent === "denied") {
      setVisibility("hidden");
    }
  };

  if (!adsEnabled) {
    return null;
  }

  if (consent === "denied" || visibility === "hidden") {
    return null;
  }

  if (consent === "unknown") {
    const consentContainerClassName = [
      className,
      "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--ink-soft)] shadow-[var(--shadow-soft)]"
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section className={consentContainerClassName}>
        <p className="font-medium text-[var(--ink)]">
          Apoie o Guia Brechó com anúncios opcionais.
        </p>
        <p className="mt-1 text-[var(--ink-soft)]">
          Só carregamos a rede de anúncios com a sua permissão.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--accent-2)] bg-[var(--accent)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--accent-2)]"
            onClick={() => handleConsent("granted")}
          >
            Permitir anúncios
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-2 font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface)]"
            onClick={() => handleConsent("denied")}
          >
            Agora não
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script
        id="adsense-script"
        src={adSenseSrc}
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onReady={() => {
          setIsScriptReady(true);
        }}
        onError={() => {
          setVisibility("hidden");
        }}
      />
      <div className={className}>
        <ins
          ref={adRef}
          className="adsbygoogle block w-full overflow-hidden"
          style={{
            display: "block",
            height: "56px"
          }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </>
  );
}
