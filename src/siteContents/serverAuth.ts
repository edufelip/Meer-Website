const SERVER_CONTENTS_TOKEN_ENV = "SITE_CONTENTS_API_TOKEN";

export function getSiteContentsServerToken(): string | undefined {
  const value = process.env[SERVER_CONTENTS_TOKEN_ENV];
  if (!value) return undefined;

  const normalized = value.trim();
  return normalized || undefined;
}
