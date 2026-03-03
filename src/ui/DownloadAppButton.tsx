"use client";

import { useEffect, useState } from "react";
import { androidStoreUrl, iosStoreUrl } from "../urls";

type DownloadAppButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function DownloadAppButton({ className, children }: DownloadAppButtonProps) {
  const [storeUrl, setStoreUrl] = useState(androidStoreUrl);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const isAppleDevice =
      /(iphone|ipad|ipod)/.test(userAgent) ||
      platform.includes("mac") ||
      userAgent.includes("macintosh");

    setStoreUrl(isAppleDevice ? iosStoreUrl : androidStoreUrl);
  }, []);

  return (
    <a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}