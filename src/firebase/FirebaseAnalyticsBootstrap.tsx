"use client";

import { useEffect } from "react";
import { initializeFirebaseAnalytics } from "./client";

let hasBootstrappedAnalytics = false;

export default function FirebaseAnalyticsBootstrap() {
  useEffect(() => {
    if (hasBootstrappedAnalytics) {
      return;
    }

    hasBootstrappedAnalytics = true;
    void initializeFirebaseAnalytics();
  }, []);

  return null;
}
