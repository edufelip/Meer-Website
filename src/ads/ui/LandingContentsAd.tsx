"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  ADS_ENABLED,
  ADSENSE_CLIENT_ID,
  ADSENSE_HOME_CONTENTS_SLOT_ID
} from "../config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type LandingContentsAdProps = {
  className?: string;
};

type AdVisibilityState = "pending" | "visible" | "hidden";
type AdsConsentState = "unknown" | "granted" | "denied";

const ADS_CONSENT_STORAGE_KEY = "meer_ads_consent_v1";
const NO_FILL_TIMEOUT_MS = 7000;
const POLL_INTERVAL_MS = 250;

function readStoredConsent(): AdsConsentState {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const stored = window.localStorage.getItem(ADS_CONSENT_STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : "unknown";
}

function persistConsent(consent: Exclude<AdsConsentState, "unknown">): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADS_CONSENT_STORAGE_KEY, consent);
}

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

    setConsent(readStoredConsent());
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

  const handleConsent = (nextConsent: Exclude<AdsConsentState, "unknown">) => {
    persistConsent(nextConsent);
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
    return (
      <section className="rounded-2xl border border-amber-200/80 bg-white/85 p-4 text-sm text-neutral-700 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
        <p className="font-medium text-neutral-900">
          Apoie o Guia Brechó com anúncios opcionais.
        </p>
        <p className="mt-1 text-neutral-600">
          Só carregamos a rede de anúncios com a sua permissão.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-600"
            onClick={() => handleConsent("granted")}
          >
            Permitir anúncios
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 font-semibold text-neutral-700 transition hover:bg-neutral-50"
            onClick={() => handleConsent("denied")}
          >
            Agora não
          </button>
        </div>
      </section>
    );
  }

  const wrapperStyle = visibility === "pending"
    ? {
      position: "fixed" as const,
      left: "-9999px",
      top: "-9999px",
      width: "320px",
      height: "56px",
      opacity: 0,
      pointerEvents: "none" as const
    }
    : undefined;

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
      <div className={visibility === "visible" ? className : undefined} style={wrapperStyle}>
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
