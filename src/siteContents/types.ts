export type ContentSort = "newest" | "oldest";

export type PageResponse<T> = {
  items: T[];
  page: number;
  hasNext: boolean;
};

export type GuideContentDto = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thriftStoreId: string | null;
  thriftStoreName: string;
  thriftStoreCoverImageUrl: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type GuideContentCommentDto = {
  id: number;
  body: string;
  userId: string | null;
  userDisplayName: string | null;
  userPhotoUrl: string | null;
  createdAt: string;
  edited: boolean;
};
