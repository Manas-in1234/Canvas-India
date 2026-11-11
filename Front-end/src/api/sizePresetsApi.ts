import { buildApiUrl } from './productsApi';

export interface SizePresetDto {
  id: string;
  productTypeId: string;
  shapeId: string | null;
  label: string;
  dimensionsSummary: string;
  widthInches: string;
  heightInches: string;
  acrylicPrice: string;
  canvasPrice: string;
  category: string | null;
  panelsCount: number | null;
  panels: Array<{ id: string; label: string; dimension: string; widthRatio: number; heightRatio: number }> | null;
  arrangement: string | null;
  sortOrder: number;
}

/**
 * Admin-managed size presets (see backend SizePresetsModule) — replaces
 * what used to be five independent hardcoded systems in this file. Fails
 * open to an empty list so a network hiccup or an unmigrated product type
 * falls back to the existing hardcoded branch untouched, never a broken
 * size picker. shapeId narrows to the "standard shape size" scope; omit it
 * for multi-panel layout products, whose presets are self-contained.
 */
export async function fetchSizePresets(productTypeId: string, shapeId?: string): Promise<SizePresetDto[]> {
  try {
    const params = new URLSearchParams({ productTypeId });
    if (shapeId) params.set('shapeId', shapeId);
    const response = await fetch(buildApiUrl(`/size-presets?${params.toString()}`));
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return [...data].sort((a: SizePresetDto, b: SizePresetDto) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

/** Generic "standard shape size" scope — productTypeId doesn't matter for this lookup, only shapeId. */
export const SHAPE_GENERIC_PRODUCT_TYPE_ID = '__shape_generic__';

export function fetchStandardShapeSizes(shapeId: string): Promise<SizePresetDto[]> {
  return fetchSizePresets(SHAPE_GENERIC_PRODUCT_TYPE_ID, shapeId);
}
