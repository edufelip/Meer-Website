import Image from "next/image";
import { GuideContentDto } from "../types";

type ContentHeroProps = {
  content: GuideContentDto;
};

export function ContentHero({ content }: ContentHeroProps) {
  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      {content.imageUrl ? (
        <Image
          alt={`Imagem do conteúdo ${content.title}`}
          className="w-full h-full object-cover"
          src={content.imageUrl}
          fill
          priority
          sizes="100vw"
        />
      ) : (
        <div className="w-full h-full bg-stone-800 flex items-center justify-center">
          <span className="material-icons-outlined text-6xl text-stone-500">article</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/90 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            {content.thriftStoreName || "Comunidade"}
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            {content.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
