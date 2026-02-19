export const MIN_CONTENT_TITLE_CHARS = 20;
export const MIN_CONTENT_DESCRIPTION_CHARS = 140;
export const MIN_LISTING_ITEMS_FOR_AD = 3;

type ContentDetailEligibilityInput = {
  title?: string | null;
  description?: string | null;
};

type ContentsListingEligibilityInput = {
  hasError: boolean;
  itemCount: number;
};

function normalizedLength(value: string | null | undefined): number {
  return (value ?? "").replace(/\s+/g, " ").trim().length;
}

export function isContentDetailAdEligible({
  title,
  description
}: ContentDetailEligibilityInput): boolean {
  return (
    normalizedLength(title) >= MIN_CONTENT_TITLE_CHARS &&
    normalizedLength(description) >= MIN_CONTENT_DESCRIPTION_CHARS
  );
}

export function isContentsListingAdEligible({
  hasError,
  itemCount
}: ContentsListingEligibilityInput): boolean {
  if (hasError) {
    return false;
  }

  return Number.isFinite(itemCount) && itemCount >= MIN_LISTING_ITEMS_FOR_AD;
}
