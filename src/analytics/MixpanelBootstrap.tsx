"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackEvent } from "./mixpanel";

let hasBootstrappedAnalytics = false;

function MixpanelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize once
  useEffect(() => {
    if (hasBootstrappedAnalytics) {
      return;
    }

    hasBootstrappedAnalytics = true;
    initMixpanel();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      let url = pathname;
      if (searchParams && searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }

      trackEvent("Page View", {
        path: pathname,
        url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function MixpanelBootstrap() {
  return (
    <Suspense fallback={null}>
      <MixpanelTracker />
    </Suspense>
  );
}
