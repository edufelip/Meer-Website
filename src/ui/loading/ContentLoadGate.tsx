"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import BrandSpinner from "./BrandSpinner";
import { DEFAULT_MIN_DELAY_MS, scheduleMinDelayReveal } from "./minDelay";

type ContentLoadGateProps = {
  children: ReactNode;
  minDelayMs?: number;
  loadingLabel?: string;
};

export default function ContentLoadGate({
  children,
  minDelayMs = DEFAULT_MIN_DELAY_MS,
  loadingLabel = "Carregando..."
}: ContentLoadGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleMinDelayReveal(() => setReady(true), minDelayMs, window.setTimeout, window.clearTimeout);
  }, [minDelayMs]);

  if (!ready) {
    return <BrandSpinner label={loadingLabel} />;
  }

  return (
    <div className="gb-content-reveal">
      {children}
    </div>
  );
}
