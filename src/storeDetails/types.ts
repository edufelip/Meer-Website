export type StoreDetailsImage = {
  id: number;
  url: string;
  displayOrder: number;
  isCover: boolean;
};

export type StoreDetails = {
  id: string;
  name: string;
  coverImageUrl: string | null;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
  openingHours: string | null;
  facebook: string | null;
  instagram: string | null;
  website: string | null;
  phone: string | null;
  whatsapp: string | null;
  categories: string[];
  rating: number | null;
  reviewCount: number | null;
  neighborhood: string | null;
  badgeLabel: string | null;
  isFavorite: boolean;
  isOnlineStore: boolean;
  description: string | null;
  images: StoreDetailsImage[];
  createdAt: string | null;
};

export type StoreListItem = {
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type StoreListPageResponse = {
  items: StoreListItem[];
  page: number;
  hasNext: boolean;
};
