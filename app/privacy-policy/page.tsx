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

function PrivacyContentPt() {
  return (
    <section className="space-y-6">
      <p>
        Esta Política de Privacidade explica como o Guia Brechó (&quot;o App&quot;) coleta, usa e
        protege suas informações. Ao utilizar o App, você concorda com as práticas descritas abaixo.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Informações que coletamos</h2>
        <p>
          O App pode solicitar acesso a permissões do dispositivo para fornecer funcionalidades
          essenciais.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Permissão de câmera</h2>
        <p>
          O App usa a câmera do dispositivo apenas para permitir que você capture fotos ou vídeos
          durante a experiência no aplicativo. O App não coleta, armazena, transmite ou compartilha
          dados da câmera sem ação direta sua. Imagens e vídeos permanecem no dispositivo, exceto
          quando você decidir compartilhar ou enviar esse conteúdo.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Como usamos suas informações</h2>
        <p>
          O App não coleta dados pessoais, a menos que sejam fornecidos explicitamente por você. As
          informações geradas em recursos como captura de foto ou vídeo são usadas somente para
          executar a funcionalidade pretendida.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>Não vendemos informações pessoais.</li>
          <li>Não compartilhamos informações pessoais com terceiros.</li>
          <li>Não usamos informações pessoais para publicidade ou rastreamento.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Armazenamento e segurança</h2>
        <p>
          Imagens e vídeos capturados permanecem armazenados localmente no dispositivo, a menos que
          você decida exportá-los. Aplicamos medidas razoáveis de segurança, mas nenhum sistema
          digital é totalmente imune a riscos.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Serviços de terceiros</h2>
        <p>
          O App não integra plataformas de anúncios ou processadores externos de dados, salvo quando
          explicitamente informado. A experiência web pode usar Firebase Analytics para métricas
          agregadas de uso e melhoria de performance, quando habilitado na configuração de deploy.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Privacidade de crianças</h2>
        <p>
          O App não é projetado para menores de 13 anos e não coleta intencionalmente dados pessoais
          de crianças.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Suas escolhas</h2>
        <p>
          Você pode revogar permissões, como câmera, a qualquer momento pelas configurações do
          dispositivo. Alguns recursos podem deixar de funcionar sem essas permissões.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Alterações desta política</h2>
        <p>
          Esta política pode ser atualizada quando necessário. As alterações serão refletidas no App
          ou na página de distribuição.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contato</h2>
        <p>
          Em caso de dúvidas sobre esta política, entre em contato pelo e-mail{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function PrivacyContentEn() {
  return (
    <section className="space-y-6">
      <p>
        This Privacy Policy explains how Guia Brechó (&quot;the App&quot;) collects, uses, and protects
        your information. By using the App, you agree to the practices described below.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p>
          The App may request access to certain device permissions in order to provide core
          functionality.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Camera Permission</h2>
        <p>
          The App uses the device camera only to allow users to capture photos or videos within the
          app experience. The App does not collect, store, transmit, or share camera data without
          your direct action. Any images or videos remain on your device unless you choose to share
          or upload them.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
        <p>
          The App does not collect personal data unless explicitly provided by the user. Any
          information generated through features such as photo or video capture is used only to
          operate the intended functionality.
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-3">
          <li>We do not sell personal information.</li>
          <li>We do not share personal information with third parties.</li>
          <li>We do not use personal information for advertising or tracking.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Data Storage and Security</h2>
        <p>
          Images or videos captured with the camera remain stored locally on your device unless you
          decide to export or share them. We implement reasonable security measures, but no digital
          system is completely secure.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
        <p>
          The App does not integrate advertising platforms or external data processors unless
          explicitly stated. The web experience may use Firebase Analytics to measure aggregated
          usage and improve performance when enabled in deployment configuration.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Children&apos;s Privacy</h2>
        <p>
          The App is not designed for children under 13 and does not knowingly collect personal
          information from children.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
        <p>
          You may revoke permissions, such as camera access, at any time through device settings.
          Some features may stop functioning without these permissions.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy as needed. Any updates will be reflected in the App or
          on the distribution page.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          If you have questions about this policy, contact{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
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
              {isPortuguese ? "Política de Privacidade" : "Privacy Policy"}
            </h1>
            <p className="text-sm text-neutral-500">
              {isPortuguese ? "Atualizado em: 30 de janeiro de 2026" : "Last updated: January 30, 2026"}
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
          {isPortuguese ? <PrivacyContentPt /> : <PrivacyContentEn />}
        </div>
      </div>
    </main>
  );
}
