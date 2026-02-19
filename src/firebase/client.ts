import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

function readPublicEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

const firebaseConfig = {
  apiKey: readPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: readPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: readPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: readPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: readPublicEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID")
};

const FIREBASE_ANALYTICS_ENABLED =
  readPublicEnv("NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED") === "true";

let cachedApp: FirebaseApp | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

function hasRequiredFirebaseConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasRequiredFirebaseConfig()) {
    return null;
  }

  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export async function initializeFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !FIREBASE_ANALYTICS_ENABLED) {
    return null;
  }

  if (analyticsInitPromise) {
    return analyticsInitPromise;
  }

  analyticsInitPromise = (async () => {
    const app = getFirebaseApp();
    if (!app || !firebaseConfig.measurementId) {
      return null;
    }

    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return null;
    }

    return getAnalytics(app);
  })();

  return analyticsInitPromise;
}
