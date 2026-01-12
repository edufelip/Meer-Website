"use client";

import { androidStoreUrl, iosStoreUrl } from "./urls";

type OpenInAppButtonProps = {
  deepLink: string;
  className?: string;
  children: React.ReactNode;
};

function detectStoreUrl() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return androidStoreUrl;
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return iosStoreUrl;
  return null;
}

export default function OpenInAppButton({ deepLink, className, children }: OpenInAppButtonProps) {
  const handleOpenApp = () => {
    const storeUrl = detectStoreUrl();
    
    // Try to open the deep link
    window.location.href = deepLink;

    // Fallback to store after a short delay if the app didn't open
    if (storeUrl) {
      setTimeout(() => {
        // If the page is still visible, it's likely the app didn't open
        if (!document.hidden) {
          window.location.href = storeUrl;
        }
      }, 2500);
    }
  };

  return (
    <button className={className} onClick={handleOpenApp}>
      {children}
    </button>
  );
}
