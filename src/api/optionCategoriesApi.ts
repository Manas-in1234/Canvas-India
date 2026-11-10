import { buildApiUrl } from './productsApi';

export type OptionPriceMode = 'FLAT' | 'AREA_RATE';

export interface OptionCategoryItemDto {
  id: string;
  label: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  priceMode: OptionPriceMode;
  flatPrice: string;
  areaRatePerSqIn: string | null;
  extras: Record<string, unknown> | null;
}

export interface OptionCategoryDto {
  id: string;
  baseKey: string;
  materialScope: 'ACRYLIC' | 'CANVAS' | 'BOTH';
  items: OptionCategoryItemDto[];
}

/**
 * Admin-managed customizer option content (see backend
 * OptionCategoriesModule) — fetches the active items for one category
 * (e.g. "border_width"), optionally scoped to the current material. Fails
 * open to an empty list so a network hiccup degrades the picker rather than
 * breaking the page; callers should merge with a small built-in fallback
 * list where the category has one.
 */
export async function fetchOptionCategoryItems(
  baseKey: string,
  material?: 'ACRYLIC' | 'CANVAS',
  strict = false,
): Promise<OptionCategoryItemDto[]> {
  try {
    const params = new URLSearchParams({ baseKey });
    if (material) params.set('material', material);
    const response = await fetch(buildApiUrl(`/option-categories?${params.toString()}`));
    if (!response.ok) throw new Error('Unable to load catalog');
    const categories = (await response.json()) as OptionCategoryDto[];
    if (!Array.isArray(categories) || categories.length === 0) return [];
    // material-scoped categories: prefer the exact material match over BOTH
    const exact = categories.find((c) => c.materialScope === material);
    const chosen = exact ?? categories[0];
    return [...chosen.items].sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    if (strict) throw error;
    return [];
  }
}
