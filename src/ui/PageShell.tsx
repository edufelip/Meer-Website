import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type PageShellProps = {
  children: ReactNode;
  contentClassName?: string;
  showFooter?: boolean;
};

export default function PageShell({
  children,
  contentClassName = "",
  showFooter = true
}: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main className={`gb-page-reveal ${contentClassName}`.trim()}>
        {children}
      </main>
      {showFooter ? <SiteFooter /> : null}
    </>
  );
}
