import assert from "node:assert/strict";
import test from "node:test";
import {
  ADS_CONSENT_STORAGE_KEY,
  normalizeAdsConsent,
  readAdsConsent,
  writeAdsConsent
} from "./consent";

test("normalizeAdsConsent accepts only persisted states", () => {
  assert.equal(normalizeAdsConsent("granted"), "granted");
  assert.equal(normalizeAdsConsent("denied"), "denied");
  assert.equal(normalizeAdsConsent("unknown"), "unknown");
  assert.equal(normalizeAdsConsent(""), "unknown");
  assert.equal(normalizeAdsConsent(undefined), "unknown");
});

test("readAdsConsent returns unknown without storage", () => {
  assert.equal(readAdsConsent(undefined), "unknown");
  assert.equal(readAdsConsent(null), "unknown");
});

test("readAdsConsent reads and normalizes persisted value", () => {
  const storage = {
    getItem: (key: string) => (key === ADS_CONSENT_STORAGE_KEY ? "granted" : null)
  };

  assert.equal(readAdsConsent(storage), "granted");
});

test("writeAdsConsent stores consent value when storage is available", () => {
  let storedKey = "";
  let storedValue = "";

  const storage = {
    setItem: (key: string, value: string) => {
      storedKey = key;
      storedValue = value;
    }
  };

  writeAdsConsent(storage, "denied");

  assert.equal(storedKey, ADS_CONSENT_STORAGE_KEY);
  assert.equal(storedValue, "denied");
});
