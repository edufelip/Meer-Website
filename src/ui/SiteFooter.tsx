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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-icons-outlined text-sm">storefront</span>
              </div>
              <span className="font-display font-bold text-lg text-stone-900 dark:text-white">Guia Brechó</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm mb-6">
              Conectando quem ama garimpo aos melhores achados da cidade. Apoiamos a moda circular e o consumo consciente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-icons-outlined">facebook</span></a>
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-icons-outlined">camera_alt</span></a>
              <a href="#" className="text-stone-400 hover:text-primary transition-colors"><span className="material-icons-outlined">alternate_email</span></a>
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
        </div>
        <div className="border-t border-stone-200 dark:border-stone-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 dark:text-stone-500">
          <p>© {new Date().getFullYear()} Guia Brechó. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-stone-900 dark:hover:text-stone-300">Privacidade</Link>
            <Link href="/terms-eula" className="hover:text-stone-900 dark:hover:text-stone-300">Termos</Link>
            <Link href="/privacy-policy" className="hover:text-stone-900 dark:hover:text-stone-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
