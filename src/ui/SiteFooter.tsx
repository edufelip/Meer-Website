import Link from "next/link";
import type { Route } from "next";

const platformLinks = [
  { href: "/", label: "Sobre o Guia Brechó" },
  { href: "/contents", label: "Conteúdos" },
  { href: "/#destaques", label: "Brechós em destaque" }
];

const supportLinks = [
  { href: "/privacy-policy", label: "Política de Privacidade" },
  { href: "/terms-eula", label: "Terms & EULA" },
  { href: "/support", label: "Suporte" },
  { href: "/contents", label: "Central de Conteúdos" }
];

export default function SiteFooter() {
  return (
    <footer className="surface-card mt-8 p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <section>
          <h2 className="text-lg font-semibold text-[var(--ink)]">Guia Brechó</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            Conectando quem ama garimpo aos melhores achados da cidade.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Plataforma
          </h3>
          <ul className="mt-3 space-y-2">
            {platformLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Suporte
          </h3>
          <ul className="mt-3 space-y-2">
            {supportLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className="text-sm text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 border-t border-[var(--border)] pt-5 text-xs text-[var(--ink-muted)]">
        © {new Date().getFullYear()} Guia Brechó. Todos os direitos reservados.
      </div>
    </footer>
  );
}
