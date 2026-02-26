"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "pt-BR" | "en-US";

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
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold">Suporte Guia Brechó</h1>
      <p>
        O Guia Brechó é um aplicativo React Native feito com Expo que ajuda as pessoas a
        descobrirem brechós. Esta página fornece informações de suporte e maneiras de obter
        ajuda com o aplicativo.
      </p>

      <div>
        <h2 className="text-xl font-semibold">Contato</h2>
        <p>
          Para suporte, envie um e-mail para{" "}
          <a
            href="mailto:guiabrechoapp@gmail.com"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Como obter ajuda</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Descreva o problema e os passos que você seguiu.</li>
          <li>Inclua o modelo do seu dispositivo e a versão do sistema operacional.</li>
          <li>Anexe capturas de tela se elas ajudarem a explicar o problema.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Tempo de resposta</h2>
        <p>Geralmente respondemos em até 3 dias úteis.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Última atualização</h2>
        <p>26 de janeiro de 2026</p>
      </div>
    </section>
  );
}

function SupportContentEn() {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold">Guia Brechó Support</h1>
      <p>
        Guia Brechó is a React Native app built with Expo that helps people discover thrift stores.
        This page provides support information and ways to get help with the app.
      </p>

      <div>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          For support, send an email to{" "}
          <a
            href="mailto:guiabrechoapp@gmail.com"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">How to get support</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Describe the issue and the steps you followed.</li>
          <li>Include your device model and operating system version.</li>
          <li>Attach screenshots if they help explain the problem.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Response time</h2>
        <p>We usually respond within 3 business days.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Last updated</h2>
        <p>January 26, 2026</p>
      </div>
    </section>
  );
}

export default function SupportPage() {
  const [language, setLanguage] = useState<Language>("pt-BR");

  useEffect(() => {
    setLanguage(detectLanguage());
  }, []);

  return (
    <main
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] p-8"
      lang={language === "pt-BR" ? "pt-BR" : "en-US"}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
          >
            {language === "pt-BR" ? "← Voltar para o início" : "← Back to home"}
          </Link>
        </div>

        <div className="flex items-center justify-end">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
            role="group"
            aria-label={language === "pt-BR" ? "Selecionar idioma" : "Select language"}
          >
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = language === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLanguage(option.id)}
                  aria-pressed={isActive}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isActive
                      ? "bg-[var(--ink)] text-[var(--surface)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
          {language === "pt-BR" ? <SupportContentPt /> : <SupportContentEn />}
        </section>
      </div>
    </main>
  );
}
