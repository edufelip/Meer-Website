import type { GuideContentDto } from "../types";
import ContentPreviewCard from "./ContentPreviewCard";

type RelatedContentsSectionProps = {
  items: GuideContentDto[];
};

export default function RelatedContentsSection({ items }: RelatedContentsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="surface-card related-contents-section p-6">
      <h2>Conteúdos relacionados</h2>
      <p>
        Continue explorando temas parecidos para aprofundar seu próximo garimpo.
      </p>

      <div className="contents-grid related-contents-grid" aria-label="Conteúdos relacionados">
        {items.map((item) => (
          <ContentPreviewCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
