import Image from "next/image";
import Link from "next/link";
import { GuideContentDto } from "../types";
import LandingContentsAd from "../../ads/ui/LandingContentsAd";
import NewsletterSignupCard from "./NewsletterSignupCard";

type ContentAuthorSidebarProps = {
  content: GuideContentDto;
  shouldRenderContentAd: boolean;
};

export function ContentAuthorSidebar({ content, shouldRenderContentAd }: ContentAuthorSidebarProps) {
  const isGuideContent = content.thriftStoreId === null;
  const storeCardImageUrl = content.thriftStoreId
    ? content.thriftStoreCoverImageUrl || "/assets/images/app-icon.png"
    : "/assets/images/app-icon.png";

  return (
    <aside className="lg:col-span-4 space-y-8 mt-12 lg:mt-0">
      <div className="bg-off-white dark:bg-stone-800/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
        <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white mb-4 uppercase tracking-wider text-xs">Sobre o(a) Autor(a)</h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
          {isGuideContent
            ? "Este conteúdo foi compartilhado por um membro da equibe GuiaBrechó. Feito com muito carinho para nosso querido público"
            : "Este conteúdo foi compartilhado por um membro da nossa comunidade de garimpeiros. Participe e ajude a fortalecer a moda circular."}
        </p>
        <Link href="/contents" className="text-primary text-sm font-bold hover:underline">Ver todos os posts →</Link>
      </div>

      {content.thriftStoreId && content.thriftStoreName && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
          <h3 className="font-display font-bold text-xl text-stone-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-primary">store</span>
            Brechó Citado
          </h3>
          <Link 
            href={content.thriftStoreId ? `/store/${content.thriftStoreId}` : "#"} 
            className="group block"
          >
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-200 dark:bg-stone-800">
                <Image 
                  alt={content.thriftStoreName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={storeCardImageUrl}
                  width={64}
                  height={64}
                />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white group-hover:text-primary transition-colors">{content.thriftStoreName}</h4>
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wide border border-secondary/30 px-1.5 py-0.5 rounded mt-2 inline-block">Ver Detalhes</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {shouldRenderContentAd ? <LandingContentsAd className="mt-2" /> : null}

      <NewsletterSignupCard />
    </aside>
  );
}
