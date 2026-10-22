import { buildApiUrl } from './productsApi';
import type { AcrylicShapeOption } from '../data/acrylicCustomizerData';

export interface CustomShapeDto {
  id: string;
  name: string;
  svgPathData: string;
}

/**
 * Approved admin-uploaded shapes (see backend ShapesModule): an admin uploads
 * a photo, the backend traces its silhouette into a normalized
 * objectBoundingBox SVG path, and once approved it's selectable here exactly
 * like a hand-authored shape (e.g. shape-heart).
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

const clipPathIdFor = (shapeId: string) => `custom-clip-${shapeId}`;

/** Maps a backend CustomShape into the same option shape the built-in shapes use. */
export function toShapeOption(shape: CustomShapeDto): AcrylicShapeOption {
  const clipId = clipPathIdFor(shape.id);
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
    priceAddon: 150,
  };
}
