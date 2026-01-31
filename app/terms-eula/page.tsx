"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Language = "pt-BR" | "en-US";

const FADE_DURATION_MS = 200;

const LANGUAGE_OPTIONS: { id: Language; label: string }[] = [
  { id: "pt-BR", label: "pt-br" },
  { id: "en-US", label: "en-us" },
];

function TermsContentEn() {
  return (
    <section className="space-y-6">
      <p>
        These Terms and the End-User License Agreement (EULA) govern your access to and use of the
        Guia Brechó application and related services provided by Eduardo Santos. By using the app,
        you agree to these terms.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">License</h2>
        <p>
          Guia Brechó is provided as-is for personal, non-commercial use. You may install and use
          the app on compatible devices you own or control. You may not copy, modify, distribute,
          sell, lease, reverse engineer, or create derivative works except where such restrictions
          are prohibited by law.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Acceptable Use</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Do not misuse the app, interfere with its operation, or bypass security.</li>
          <li>Do not post illegal, harmful, or abusive content.</li>
          <li>Do not impersonate others or misrepresent your identity or affiliations.</li>
          <li>Respect the privacy and rights of other users.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">User Content</h2>
        <p>
          You are responsible for the content you post. You retain ownership of your content while
          granting Guia Brechó a limited, non-exclusive license to host and display it as needed to
          operate the service.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Termination</h2>
        <p>
          We may suspend or terminate access to the app if you violate these terms or if the
          service is discontinued. You may stop using the app at any time.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Disclaimers and Limitation of Liability</h2>
        <p>
          The app is provided without warranties of any kind. To the maximum extent permitted by
          law, we are not liable for any indirect, incidental, or consequential damages arising
          from your use of the app.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Changes</h2>
        <p>
          These terms may be updated from time to time. Continued use of the app after changes
          means you accept the updated terms.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p>
          For questions about these terms, contact{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function TermsContentPt() {
  return (
    <section className="space-y-6">
      <p>
        Estes Termos e o Contrato de Licença de Usuário Final (EULA) regem o acesso e o uso do
        aplicativo Guia Brechó e dos serviços relacionados fornecidos por Eduardo Santos. Ao usar
        o app, você concorda com estes termos.
      </p>

      <div>
        <h2 className="text-xl font-semibold mb-2">Licença</h2>
        <p>
          O Guia Brechó é fornecido no estado em que se encontra para uso pessoal e não comercial.
          Você pode instalar e usar o app em dispositivos compatíveis que possui ou controla. Não é
          permitido copiar, modificar, distribuir, vender, alugar, realizar engenharia reversa ou
          criar obras derivadas, exceto quando tais restrições forem proibidas por lei.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Uso aceitável</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Não faça uso indevido do app, não interfira em seu funcionamento nem burle a segurança.</li>
          <li>Não publique conteúdo ilegal, prejudicial ou abusivo.</li>
          <li>Não se passe por outras pessoas nem deturpe sua identidade ou afiliações.</li>
          <li>Respeite a privacidade e os direitos de outros usuários.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Conteúdo do usuário</h2>
        <p>
          Você é responsável pelo conteúdo que publica. Você mantém a propriedade do seu conteúdo
          enquanto concede ao Guia Brechó uma licença limitada e não exclusiva para hospedá-lo e
          exibi-lo conforme necessário para operar o serviço.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Rescisão</h2>
        <p>
          Podemos suspender ou encerrar o acesso ao app se você violar estes termos ou se o serviço
          for descontinuado. Você pode deixar de usar o app a qualquer momento.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Isenções e limitação de responsabilidade</h2>
        <p>
          O app é fornecido sem garantias de qualquer tipo. Na máxima extensão permitida por lei,
          não nos responsabilizamos por danos indiretos, incidentais ou consequenciais decorrentes
          do seu uso do app.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Alterações</h2>
        <p>
          Estes termos podem ser atualizados periodicamente. O uso contínuo do app após alterações
          significa que você aceita os termos atualizados.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Contato</h2>
        <p>
          Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail{" "}
          <a href="mailto:guiabrechoapp@gmail.com" className="text-accent hover:underline">
            guiabrechoapp@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export default function TermsEulaPage() {
  const [language, setLanguage] = useState<Language>("pt-BR");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
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

    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
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
      className="min-h-screen bg-white text-neutral-900 p-8"
      lang={isPortuguese ? "pt-BR" : "en-US"}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {isPortuguese ? "← Voltar para o início" : "← Back to home"}
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              {isPortuguese ? "Termos e EULA" : "Terms and EULA"}
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
          {isPortuguese ? <TermsContentPt /> : <TermsContentEn />}
        </div>
      </div>
    </main>
  );
}
