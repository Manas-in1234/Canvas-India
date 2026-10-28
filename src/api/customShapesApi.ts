import { buildApiUrl } from './productsApi';
import type { AcrylicShapeOption } from '../data/acrylicCustomizerData';

export type ShapeOrigin = 'BUILT_IN' | 'ADMIN_UPLOADED';
export type ShapeClipPathType = 'SVG_PATH' | 'CSS_FUNCTION';

export interface CustomShapeDto {
  id: string;
  name: string;
  origin: ShapeOrigin;
  clipPathType: ShapeClipPathType;
  clipPathValue: string;
  shapeType: string | null;
  category: string;
  aspectRatio: string;
  isSingleDimension: boolean;
  priceMode: 'FLAT' | 'AREA_RATE';
  flatPrice: string;
  areaRatePerSqIn: string | null;
}

/**
 * Approved shapes from the backend's unified shape catalog (see backend
 * ShapesModule) — both admin-uploaded auto-traced shapes AND the original
 * built-in shapes (square, heart, hexagon, ...), now that the latter are
 * seeded into the same table so they're admin-manageable too.
 *
 * The hardcoded CANVAS_SHAPES/ACRYLIC_SHAPES list stays the primary source
 * for every shape it already knows about — this fetch only contributes
 * shapes with an id the hardcoded list doesn't have (admin-uploaded ones,
 * or future built-ins added only through the admin screen), so existing
 * shape rendering/pricing is unaffected. See mergeWithKnownShapeIds.
 */
export async function fetchApprovedCustomShapes(): Promise<CustomShapeDto[]> {
  try {
    const response = await fetch(buildApiUrl('/shapes'));
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Custom shapes are an enhancement on top of the built-in shape list;
    // never let a network hiccup break the customizer's shape picker.
    return [];
  }
}

/** Only shapes whose id isn't already in the hardcoded list — see fetchApprovedCustomShapes. */
export function filterToUnknownShapes(shapes: CustomShapeDto[], knownIds: Set<string>): CustomShapeDto[] {
  return shapes.filter((shape) => !knownIds.has(shape.id));
}

const clipPathIdFor = (shapeId: string) => `custom-clip-${shapeId}`;

/** Maps a backend CustomShape (not already known to the hardcoded list) into the same option shape the built-in shapes use. */
export function toShapeOption(shape: CustomShapeDto): AcrylicShapeOption {
  const clipId = clipPathIdFor(shape.id);
  const price = shape.priceMode === 'FLAT' ? Number(shape.flatPrice) : 150; // area-rate shapes are priced dynamically elsewhere; this addon is only a display fallback
  return {
    id: `custom-${shape.id}`,
    shapeType: 'custom',
    name: shape.name,
    category: 'special',
    description: `Custom traced outline: ${shape.name}.`,
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-none',
    svgClipId: clipId,
    clipPathStyle: `url(#${clipId})`,
    isSingleDimension: true,
    image: '',
    priceAddon: price,
  };
}
