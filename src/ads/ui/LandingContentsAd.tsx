"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_HOME_CONTENTS_SLOT_ID } from "../config";

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
  const adRef = useRef<HTMLModElement | null>(null);
  const hasQueuedAd = useRef(false);
  const isResolvedRef = useRef(false);
  const [visibility, setVisibility] = useState<AdVisibilityState>("pending");

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

  useEffect(() => {
    if (!adClient || !adSlot) {
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
  }, [adClient, adSlot]);

  if (!adClient || !adSlot) {
    return null;
  }

  if (visibility === "hidden") {
    return null;
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
  );
}
