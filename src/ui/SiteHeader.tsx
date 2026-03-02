"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import {
  buildHomeSectionPath,
  type HomeSectionId,
  scrollToHomeSection
} from "../navigation/homeSections";
import ThemeToggleButton from "../theme/ThemeToggleButton";
import { androidStoreUrl, iosStoreUrl } from "../urls";

type HeaderNavItem =
  | { kind: "route"; href: Route; label: string }
  | { kind: "section"; sectionId: HomeSectionId; label: string };

const navItems: HeaderNavItem[] = [
  { kind: "route", href: "/contents", label: "Explorar" },
  { kind: "section", sectionId: "conteudos", label: "Conteúdos" },
  { kind: "section", sectionId: "destaques", label: "Destaques" }
];

const desktopNavItemClasses = "text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors font-medium";
const mobileNavItemClasses = "block px-4 py-3 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors";

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState(androidStoreUrl);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    const isAppleDevice =
      /(iphone|ipad|ipod)/.test(userAgent) ||
      platform.includes("mac") ||
      userAgent.includes("macintosh");

    setStoreUrl(isAppleDevice ? iosStoreUrl : androidStoreUrl);
  }, []);

  const navigateToSection = (sectionId: HomeSectionId, closeMenu = false) => {
    if (closeMenu) {
      setIsMobileMenuOpen(false);
    }

    if (pathname === "/") {
      scrollToHomeSection(sectionId);
      return;
    }

    router.push(buildHomeSectionPath(sectionId) as Route);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-icons-outlined">storefront</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-stone-900 dark:text-white leading-tight">Guia Brechó</span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Radar de achados</span>
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) =>
              item.kind === "route" ? (
                <Link key={item.href} href={item.href} className={desktopNavItemClasses}>
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() => navigateToSection(item.sectionId)}
                  className={desktopNavItemClasses}
                >
                  {item.label}
                </button>
              )
            )}
            
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-yellow-600 text-white px-6 py-2.5 rounded-full font-medium transition-transform transform hover:-translate-y-0.5 shadow-lg shadow-primary/30"
            >
              Baixar App
            </a>
            
            <ThemeToggleButton />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggleButton className="p-2 mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300" />
            <button 
              className="text-stone-600 dark:text-stone-300 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <span className="material-icons-outlined text-3xl">{isMobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="md:hidden bg-surface-light dark:bg-surface-dark border-t border-stone-200 dark:border-stone-700 p-4 absolute w-full shadow-xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) =>
              item.kind === "route" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileNavItemClasses}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() => navigateToSection(item.sectionId, true)}
                  className={`text-left ${mobileNavItemClasses}`}
                >
                  {item.label}
                </button>
              )
            )}
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-4 text-center bg-primary hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Baixar App
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
