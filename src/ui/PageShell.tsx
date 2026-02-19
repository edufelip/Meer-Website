import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type PageShellBackgroundVariant = "default" | "home";

type PageShellProps = {
  children: ReactNode;
  backgroundVariant?: PageShellBackgroundVariant;
  contentClassName?: string;
  showFooter?: boolean;
};

const DEFAULT_CONTENT_CLASS_NAME =
  "section-shell relative z-10 flex flex-col gap-8 pb-16 pt-28 md:pt-32";

function renderBackground(variant: PageShellBackgroundVariant) {
  if (variant === "home") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.24),_rgba(245,158,11,0))] blur-3xl" />
        <div className="absolute bottom-[-14rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.16),_rgba(56,189,248,0))] blur-3xl" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 right-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.22),_rgba(245,158,11,0))] blur-3xl" />
    </div>
  );
}

export default function PageShell({
  children,
  backgroundVariant = "default",
  contentClassName = DEFAULT_CONTENT_CLASS_NAME,
  showFooter = true
}: PageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--ink)]">
      <SiteHeader />
      {renderBackground(backgroundVariant)}
      <div className={contentClassName}>
        {children}
        {showFooter ? <SiteFooter /> : null}
      </div>
    </main>
  );
}
