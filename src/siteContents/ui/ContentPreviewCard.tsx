import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { formatDateShort } from "../format";
import type { GuideContentDto } from "../types";

type ContentPreviewCardProps = {
  item: GuideContentDto;
  showLikeCount?: boolean;
};

export default function ContentPreviewCard({
  item,
  showLikeCount = false
}: ContentPreviewCardProps) {
  return (
    <article className="surface-card content-card overflow-hidden">
      <Link className="content-card-link" href={`/content/${item.id}` as Route}>
        <div className="content-card-image-wrap relative">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={`Imagem do conteúdo ${item.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
              className="content-card-image"
              loading="lazy"
            />
          ) : (
            <div className="content-card-image content-card-image-fallback">Sem imagem</div>
          )}
        </div>
        <div className="content-card-body">
          <p className="content-card-store">{item.thriftStoreName || "Comunidade"}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="content-card-meta">
            <span>{formatDateShort(item.createdAt)}</span>
            {showLikeCount ? <span>{item.likeCount} curtidas</span> : null}
            <span>{item.commentCount} comentários</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
