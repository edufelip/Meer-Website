import type { GuideContentDto } from "./types";

type SelectRelatedContentsParams = {
  currentContentId: number;
  preferred: GuideContentDto[];
  fallback: GuideContentDto[];
  limit?: number;
};

const DEFAULT_RELATED_LIMIT = 4;

export function selectRelatedContents({
  currentContentId,
  preferred,
  fallback,
  limit = DEFAULT_RELATED_LIMIT
}: SelectRelatedContentsParams): GuideContentDto[] {
  if (limit <= 0) return [];

  const selected: GuideContentDto[] = [];
  const seen = new Set<number>([currentContentId]);

  for (const item of [...preferred, ...fallback]) {
    if (seen.has(item.id)) continue;

    seen.add(item.id);
    selected.push(item);

    if (selected.length >= limit) break;
  }

  return selected;
}
