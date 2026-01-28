import { androidStoreUrl, iosStoreUrl } from "./urls";

export function getStoreUrl() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return androidStoreUrl;
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return iosStoreUrl;
  return null;
}

export function openInApp(deepLink: string, storeUrlOverride?: string | null) {
  if (typeof window === "undefined") return;

  const storeUrl = storeUrlOverride ?? getStoreUrl();

  window.location.href = deepLink;

  if (storeUrl) {
    window.setTimeout(() => {
      if (!document.hidden) {
        window.location.href = storeUrl;
      }
    }, 2500);
  }
}
