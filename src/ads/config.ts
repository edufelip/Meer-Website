function readPublicEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export const ADS_ENABLED = readPublicEnv("NEXT_PUBLIC_ADS_ENABLED") !== "false";

export const ADSENSE_CLIENT_ID = readPublicEnv("NEXT_PUBLIC_ADSENSE_CLIENT_ID");

export const ADSENSE_HOME_CONTENTS_SLOT_ID = readPublicEnv(
  "NEXT_PUBLIC_ADSENSE_HOME_CONTENTS_SLOT_ID"
);
