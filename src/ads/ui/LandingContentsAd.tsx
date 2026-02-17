"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const adLabelClassName = "text-[11px] uppercase tracking-[0.24em] text-neutral-500";

export default function LandingContentsAd() {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_HOME_CONTENTS_SLOT_ID;
  const hasQueuedAd = useRef(false);

  useEffect(() => {
    if (!adClient || !adSlot || hasQueuedAd.current) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      hasQueuedAd.current = true;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("AdSense failed to enqueue ad", error);
      }
    }
  }, [adClient, adSlot]);

  if (!adClient || !adSlot) {
    if (process.env.NODE_ENV === "production") {
      return null;
    }

    return (
      <section className="rounded-3xl border border-dashed border-amber-300/80 bg-amber-50/60 p-6">
        <p className={adLabelClassName}>Publicidade</p>
        <p className="mt-2 text-sm text-amber-900">
          Configure `NEXT_PUBLIC_ADSENSE_CLIENT_ID` e
          `NEXT_PUBLIC_ADSENSE_HOME_CONTENTS_SLOT_ID` para ativar este anúncio.
        </p>
      </section>
    );
  }

  const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;

  return (
    <section className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)] backdrop-blur">
      <Script
        id="adsense-script"
        src={scriptSrc}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <p className={adLabelClassName}>Publicidade</p>
      <ins
        className="adsbygoogle mt-2 block w-full overflow-hidden rounded-xl bg-white"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
