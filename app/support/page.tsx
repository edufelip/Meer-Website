"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Language = "pt-BR" | "en-US";

const FADE_DURATION_MS = 200;
const LANGUAGE_OPTIONS: { id: Language; label: string }[] = [
  { id: "pt-BR", label: "pt-br" },
  { id: "en-US", label: "en-us" }
];

function detectLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "pt-BR";
  }

  const candidate = navigator.language?.toLowerCase() || "";
  return candidate.startsWith("en") ? "en-US" : "pt-BR";
}

function SupportContentPt() {
  return (
    <section className="space-y-6">
      <p>
        O Guia Brechó é um aplicativo React Native feito com Expo para ajudar pessoas a descobrirem
        brechós. Esta página reúne informações de suporte e formas de receber ajuda.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contato</h2>
        <p>
          Para suporte, envie um e-mail para{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Como obter ajuda</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Descreva o problema e os passos que você seguiu.</li>
          <li>Inclua modelo do dispositivo e versão do sistema operacional.</li>
          <li>Anexe capturas de tela quando ajudarem a explicar o cenário.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Tempo de resposta</h2>
        <p>Geralmente respondemos em até 3 dias úteis.</p>
      </div>
    </section>
  );
}

function SupportContentEn() {
  return (
    <section className="space-y-6">
      <p>
        Guia Brechó is a React Native app built with Expo to help people discover thrift stores.
        This page provides support information and ways to get help.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          For support, send an email to{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">How to get support</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Describe the issue and the steps you followed.</li>
          <li>Include your device model and operating system version.</li>
          <li>Attach screenshots if they help explain the scenario.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Response time</h2>
        <p>We usually respond within 3 business days.</p>
      </div>
    </section>
  );
}

export default function SupportPage() {
  const [language, setLanguage] = useState<Language>("pt-BR");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    setLanguage(detectLanguage());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    if (nextLanguage === language || isAnimating) {
      return;
    }

    if (prefersReducedMotion) {
      setLanguage(nextLanguage);
      setPhase("in");
      return;
    }

    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];

    setIsAnimating(true);
    setPhase("out");

    const fadeOutTimeout = window.setTimeout(() => {
      setLanguage(nextLanguage);
      setPhase("in");
      const fadeInTimeout = window.setTimeout(() => {
        setIsAnimating(false);
      }, FADE_DURATION_MS);
      timeoutsRef.current.push(fadeInTimeout);
    }, FADE_DURATION_MS);

    timeoutsRef.current.push(fadeOutTimeout);
  };

  const isPortuguese = language === "pt-BR";

  return (
    <main
      className="gb-page-reveal min-h-screen bg-white text-neutral-900 p-8"
      lang={isPortuguese ? "pt-BR" : "en-US"}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            {isPortuguese ? "← Voltar para o início" : "← Back to home"}
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              {isPortuguese ? "Suporte" : "Support"}
            </h1>
            <p className="text-sm text-neutral-500">
              {isPortuguese ? "Atualizado em: 26 de janeiro de 2026" : "Last updated: January 26, 2026"}
            </p>
          </div>

          <div className="inline-flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              {isPortuguese ? "Idioma" : "Language"}
            </span>
            <div
              className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1"
              role="group"
              aria-label={isPortuguese ? "Selecionar idioma" : "Select language"}
            >
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = language === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleLanguageChange(option.id)}
                    aria-pressed={isActive}
                    disabled={isAnimating}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`transition-opacity duration-200 ease-in-out ${
            phase === "out" ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite"
        >
          {isPortuguese ? <SupportContentPt /> : <SupportContentEn />}
        </div>
      </div>
    </main>
  );
}
