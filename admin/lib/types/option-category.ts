export type MaterialScope = 'ACRYLIC' | 'CANVAS' | 'BOTH';
export type OptionPriceMode = 'FLAT' | 'AREA_RATE';

export interface OptionCategoryItem {
  id: string;
  categoryId: string;
  label: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  priceMode: OptionPriceMode;
  flatPrice: string;
  areaRatePerSqIn: string | null;
  extras: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface OptionCategoryListItem {
  id: string;
  baseKey: string;
  materialScope: MaterialScope;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  items: OptionCategoryItem[];
  createdAt: string;
  updatedAt: string;
}
