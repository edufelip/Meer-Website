type QueryValue = string | string[] | undefined;

type LegacySearchParams = Record<string, QueryValue>;

export function safeDecodePathSegment(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function buildLegacyContentRedirectPath(
  idParam: string,
  searchParams?: LegacySearchParams
): string | null {
  const decodedId = safeDecodePathSegment(idParam);
  if (!decodedId) return null;

  const targetId = encodeURIComponent(decodedId);
  const query = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item != null) query.append(key, item);
        }
      } else if (value != null) {
        query.set(key, value);
      }
    }
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return `/content/${targetId}${suffix}`;
}
