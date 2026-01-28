"use client";

import { openInApp } from "./openInApp";

type OpenInAppButtonProps = {
  deepLink: string;
  className?: string;
  children: React.ReactNode;
};

export default function OpenInAppButton({ deepLink, className, children }: OpenInAppButtonProps) {
  const handleOpenApp = () => {
    openInApp(deepLink);
  };

  return (
    <button className={className} onClick={handleOpenApp}>
      {children}
    </button>
  );
}
