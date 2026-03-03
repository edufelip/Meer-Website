function stripPort(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("[")) {
    const closingBracketIndex = trimmed.indexOf("]");
    if (closingBracketIndex > 0) {
      return trimmed.slice(1, closingBracketIndex);
    }
  }

  const lastColonIndex = trimmed.lastIndexOf(":");
  if (lastColonIndex > -1 && trimmed.indexOf(":") === lastColonIndex) {
    return trimmed.slice(0, lastColonIndex);
  }

  return trimmed;
}

function normalizeHostHeader(value: string | null): string | undefined {
  if (!value) return undefined;

  const firstValue = value.split(",")[0]?.trim();
  if (!firstValue) return undefined;

  const host = stripPort(firstValue).trim().toLowerCase();
  return host || undefined;
}

type HeadersLike = {
  get(name: string): string | null;
};

export function resolveRequestHostname(headers: HeadersLike): string | undefined {
  const forwardedHost = normalizeHostHeader(headers.get("x-forwarded-host"));
  if (forwardedHost) {
    return forwardedHost;
  }

  return normalizeHostHeader(headers.get("host"));
}
