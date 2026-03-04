import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const platformLinks = [
  { href: "/", label: "Sobre o Guia Brechó" },
  { href: "/contents", label: "Conteúdos" },
  { href: "/#destaques", label: "Brechós em destaque" }
];

const supportLinks = [
  { href: "/privacy-policy", label: "Política de Privacidade" },
  { href: "/terms-eula", label: "Termos & EULA" },
  { href: "/support", label: "Central de Ajuda" },
  { href: "/contents", label: "Fale Conosco" }
];

export default function SiteFooter() {
  return (
    <footer className="bg-surface-light dark:bg-surface-dark pt-16 pb-8 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/assets/images/app-icon.png"
                  alt="Logo Guia Brechó"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg text-stone-900 dark:text-white">Guia Brechó</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm mb-6">
              Conectando quem ama garimpo aos melhores achados da cidade. Apoiamos a moda circular e o consumo consciente.
            </p>
            <div className="flex">
              <a
                href="https://www.instagram.com/guiabrecho"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do Guia Brechó"
                className="text-stone-400 hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-white text-sm uppercase tracking-wider mb-6">Plataforma</h4>
            <ul className="space-y-3">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href as Route}
                    className="text-stone-600 dark:text-stone-400 hover:text-primary dark:hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-white text-sm uppercase tracking-wider mb-6">Suporte</h4>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-stone-600 dark:text-stone-400 hover:text-primary dark:hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-200 dark:border-stone-700 pt-8 text-xs text-stone-500 dark:text-stone-500">
          <p>© {new Date().getFullYear()} Guia Brechó. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
