const DEFAULT_API_BASE_URL = "http://localhost:8080";

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

function normalizeUrl(value?: string | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function normalizeHost(host?: string | null): string | null {
  if (!host) return null;
  const normalized = host.trim().toLowerCase();
  if (!normalized) return null;
  return normalized.replace(/^www\./, "");
}

function inferApiBaseFromHost(hostname?: string | null): string {
  const host = normalizeHost(hostname);
  if (!host || host === "localhost" || host === "127.0.0.1") {
    return DEFAULT_API_BASE_URL;
  }

  const apiHost = host.startsWith("api.") ? host : `api.${host}`;
  return `https://${apiHost}`;
}

export function selectApiBase(hostname?: string | null): string | null {
  const host = currentHostname(hostname);
  const preferDev = isDevHost(host);
  const configured = normalizeUrl(
    preferDev
      ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL
  );

  if (configured) {
    return configured;
  }
  return inferApiBaseFromHost(host);
}
