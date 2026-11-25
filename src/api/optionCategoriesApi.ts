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
  isActive: boolean;
  items: OptionCategoryItemDto[];
}

/** An items array the admin has explicitly hidden (isActive: false on the
 * category) - as opposed to a plain empty array, which means nothing has
 * been configured for this category yet. Callers should show nothing for a
 * hidden category, not fall back to a built-in default list. */
export type OptionCategoryItems = OptionCategoryItemDto[] & { hidden?: boolean };

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
): Promise<OptionCategoryItems> {
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
    if (chosen.isActive === false) {
      const hiddenResult: OptionCategoryItems = [];
      hiddenResult.hidden = true;
      return hiddenResult;
    }
    return [...chosen.items].sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    if (strict) throw error;
    return [];
  }
}
