import urls from "../../constants/urls.json";

function isDevHost(hostname?: string | null): boolean {
  if (!hostname) return false;
  const host = hostname.toLowerCase();
  return host.includes(".dev") || host.includes("localhost");
}

function currentHostname(explicit?: string | null): string | undefined {
  if (explicit) return explicit;
  if (typeof window !== "undefined") return window.location.hostname;
  return undefined;
}

export function selectApiBase(hostname?: string | null): string {
  const host = currentHostname(hostname);
  const preferDev = isDevHost(host);
  return preferDev ? urls.devApiBaseUrl : urls.prodApiBaseUrl;
}
