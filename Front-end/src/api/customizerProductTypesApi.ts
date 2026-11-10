import { buildApiUrl } from './productsApi';
import {
  CANVAS_PRODUCT_TYPES,
  type CanvasProductCapabilities,
  type CanvasProductIconType,
  type CanvasProductType,
} from '../data/canvasCustomizerData';
import { ACRYLIC_PRODUCT_TYPES, type AcrylicProductType } from '../data/acrylicCustomizerData';

/**
 * A customizer "style" card (Single Print, Wall Display, ...) as stored by the
 * admin dashboard. Only the fields the admin manages live in the database; the
 * rest (e.g. an acrylic style's default layout type) come from the matching
 * built-in entry, or from Single Print for a style added from scratch.
 */
export interface CustomizerProductTypeDto {
  id: string;
  material: 'ACRYLIC' | 'CANVAS';
  slug: string;
  name: string;
  startingPrice: string;
  image: string | null;
  iconType: string | null;
  panelsCount: number | null;
  description: string | null;
  defaultSizeOptionId: string | null;
  defaultShapeId: string | null;
  defaultLayoutId: string | null;
  defaultHardwareId: string | null;
  defaultThicknessId: string | null;
  supportedShapeIds: string[] | null;
  supportedHardwareIds: string[] | null;
  supportedLayoutIds: string[] | null;
  capabilities: Record<string, unknown> | null;
  sortOrder: number;
}

/**
 * Fetches the active styles for one material, in the admin's order. Fails open
 * to an empty list so a network problem leaves the built-in styles in place
 * instead of an empty picker.
 */
export async function fetchCustomizerProductTypes(
  material: 'ACRYLIC' | 'CANVAS',
): Promise<CustomizerProductTypeDto[]> {
  try {
    const url = buildApiUrl(`/customizer-product-types?material=${material}`);
    if (!url) return [];
    const response = await fetch(url);
    if (!response.ok) return [];
    const rows = (await response.json()) as CustomizerProductTypeDto[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function orUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null || value === undefined ? undefined : value;
}

export function toCanvasProductType(row: CustomizerProductTypeDto): CanvasProductType {
  const known = CANVAS_PRODUCT_TYPES.find((p) => p.id === row.slug);
  const base = known ?? CANVAS_PRODUCT_TYPES.find((p) => p.id === 'canvas-single')!;
  const capabilities = orUndefined(row.capabilities) as CanvasProductCapabilities | undefined;
  return {
    ...base,
    id: row.slug,
    name: row.name,
    startingPrice: Number(row.startingPrice),
    image: row.image ?? base.image,
    iconType: (row.iconType as CanvasProductIconType | null) ?? base.iconType,
    panelsCount: row.panelsCount ?? base.panelsCount,
    description: row.description ?? base.description,
    defaultSizeOptionId: row.defaultSizeOptionId ?? base.defaultSizeOptionId,
    defaultShape: row.defaultShapeId ?? base.defaultShape,
    defaultLayoutId: row.defaultLayoutId ?? base.defaultLayoutId,
    defaultHardwareId: row.defaultHardwareId ?? base.defaultHardwareId,
    defaultThicknessId: row.defaultThicknessId ?? base.defaultThicknessId,
    supportedShapeIds: orUndefined(row.supportedShapeIds) ?? base.supportedShapeIds,
    supportedLayoutIds: orUndefined(row.supportedLayoutIds) ?? base.supportedLayoutIds,
    capabilities: capabilities ?? base.capabilities,
    // The database stores canvas capabilities fully resolved, so use them as
    // they are instead of recomputing from hardcoded per-id checks.
    resolvedCapabilities: capabilities,
  };
}

export function toAcrylicProductType(row: CustomizerProductTypeDto): AcrylicProductType {
  const known = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === row.slug);
  const base = known ?? ACRYLIC_PRODUCT_TYPES.find((p) => p.id === 'acrylic-print')!;
  const startingPrice = Number(row.startingPrice);
  const shapeIds = orUndefined(row.supportedShapeIds) ?? base.supportedShapeIds;
  return {
    ...base,
    id: row.slug,
    name: row.name,
    price: startingPrice,
    startingPrice,
    image: row.image ?? base.image,
    iconType: (row.iconType as AcrylicProductType['iconType'] | null) ?? base.iconType,
    panelsCount: row.panelsCount ?? base.panelsCount,
    // Built-in styles keep their own value (Photo Mosaic has 16 panels but a
    // single image slot); only a style added from scratch derives it.
    imageSlots: known ? base.imageSlots : row.panelsCount ?? base.imageSlots,
    description: row.description ?? base.description,
    defaultSizeOptionId: row.defaultSizeOptionId ?? base.defaultSizeOptionId,
    defaultShape: row.defaultShapeId ?? base.defaultShape,
    defaultLayoutId: row.defaultLayoutId ?? base.defaultLayoutId,
    defaultHardwareId: row.defaultHardwareId ?? base.defaultHardwareId,
    defaultThicknessId: row.defaultThicknessId ?? base.defaultThicknessId,
    supportedShapeIds: shapeIds,
    supportedShapes: shapeIds,
    supportedHardwareIds: orUndefined(row.supportedHardwareIds) ?? base.supportedHardwareIds,
    supportedLayoutIds: orUndefined(row.supportedLayoutIds) ?? base.supportedLayoutIds,
    capabilities: (orUndefined(row.capabilities) as AcrylicProductType['capabilities'] | undefined) ?? base.capabilities,
  };
}
