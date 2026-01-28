"use client";

import { useEffect, useRef } from "react";
import { getStoreUrl, openInApp } from "./openInApp";

type AutoOpenInAppProps = {
  deepLink: string;
};

export default function AutoOpenInApp({ deepLink }: AutoOpenInAppProps) {
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    const storeUrl = getStoreUrl();
    if (!storeUrl) return;

    didRunRef.current = true;
    openInApp(deepLink, storeUrl);
  }, [deepLink]);

  return null;
}
