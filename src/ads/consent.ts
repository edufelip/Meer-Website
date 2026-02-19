export type AdsConsentState = "unknown" | "granted" | "denied";
export type PersistedAdsConsent = Exclude<AdsConsentState, "unknown">;

export const ADS_CONSENT_STORAGE_KEY = "meer_ads_consent_v1";

export function normalizeAdsConsent(value: string | null | undefined): AdsConsentState {
  return value === "granted" || value === "denied" ? value : "unknown";
}

export function readAdsConsent(
  storage: Pick<Storage, "getItem"> | null | undefined
): AdsConsentState {
  if (!storage) {
    return "unknown";
  }

  return normalizeAdsConsent(storage.getItem(ADS_CONSENT_STORAGE_KEY));
}

export function writeAdsConsent(
  storage: Pick<Storage, "setItem"> | null | undefined,
  consent: PersistedAdsConsent
): void {
  if (!storage) {
    return;
  }

  storage.setItem(ADS_CONSENT_STORAGE_KEY, consent);
}
