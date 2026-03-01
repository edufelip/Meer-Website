"use client";

import { openInApp } from "./openInApp";
import { trackEvent } from "./analytics/mixpanel";

type OpenInAppButtonProps = {
  deepLink: string;
  className?: string;
  children: React.ReactNode;
};

export default function OpenInAppButton({ deepLink, className, children }: OpenInAppButtonProps) {
  const handleOpenApp = () => {
    trackEvent("Open App Clicked", { deepLink });
    openInApp(deepLink);
  };

  return (
    <button className={className} onClick={handleOpenApp}>
      {children}
    </button>
  );
}
