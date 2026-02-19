"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "../theme/ThemeToggleButton";
import { androidStoreUrl } from "../urls";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/contents", label: "Explorar" },
  { href: "/#conteudos", label: "Conteúdos" },
  { href: "/#destaques", label: "Destaques" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="section-shell flex h-20 items-center justify-between gap-3">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xl text-[var(--accent)] shadow-[var(--shadow-soft)]">
            ✦
          </span>
          <span>
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--ink-muted)]">
              Guia Brechó
            </span>
            <span className="hidden text-sm font-semibold text-[var(--ink)] sm:block">
              Seu radar de achados conscientes
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}

            <a
              href={androidStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-2)]"
            >
              Baixar App
            </a>
          </nav>

          <ThemeToggleButton className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" />
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-lg text-[var(--ink)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
          >
            <span aria-hidden>{isMobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-[var(--border)] bg-[var(--surface)]/95 md:hidden">
          <nav className="section-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={androidStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-2)]"
            >
              Baixar App
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
