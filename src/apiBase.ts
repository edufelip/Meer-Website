import urls from "../../constants/urls.json";

function isDevHost(hostname?: string | null): boolean {
  if (!hostname) return false;
  const host = hostname.toLowerCase();

  if (host === "localhost" || host === "127.0.0.1") return true;
  return host.startsWith("dev.") || host.includes(".dev");
}

function currentHostname(explicit?: string | null): string | undefined {
  if (explicit) return explicit;
  if (typeof window !== "undefined") return window.location.hostname;
  if (process.env.NEXT_PUBLIC_SITE_HOST) return process.env.NEXT_PUBLIC_SITE_HOST;
  return undefined;
}

export function selectApiBase(hostname?: string | null): string {
  const host = currentHostname(hostname);
  const preferDev = isDevHost(host);

  const base =
    (preferDev ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL) ||
    (preferDev ? urls.devApiBaseUrl : urls.prodApiBaseUrl) ||
    "http://localhost:8080";

  return base;
}
