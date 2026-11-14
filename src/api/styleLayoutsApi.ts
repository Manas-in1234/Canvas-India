import type { ProductLayoutDefinition } from '../data/productGeometry';
import { buildApiUrl } from './productsApi';

type Panel = { id: string; x: number; y: number; width: number; height: number; rotation: number };
type SavedLayout = { id: string; name: string; style: string; price: number; outline: string; shapeId: string; panels: Panel[] };

const dimension = (value: number) => Number(value.toFixed(2));
export function toStyleLayout(row: SavedLayout): ProductLayoutDefinition {
  const bounds = row.panels.map(panel => {
    const radians = panel.rotation * Math.PI / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const halfWidth = (panel.width * cos + panel.height * sin) / 2;
    const halfHeight = (panel.width * sin + panel.height * cos) / 2;
    const x = panel.x + panel.width / 2;
    const y = panel.y + panel.height / 2;
    return { left: x - halfWidth, right: x + halfWidth, top: y - halfHeight, bottom: y + halfHeight };
  });
  const left = Math.min(...bounds.map(b => b.left));
  const top = Math.min(...bounds.map(b => b.top));
  const width = Math.max(...bounds.map(b => b.right)) - left;
  const height = Math.max(...bounds.map(b => b.bottom)) - top;
  return {
    id: row.id, productTypeId: row.style, name: row.name, description: '',
    geometryType: 'wall-display', outline: row.outline, shapeId: row.shapeId,
    panelsCount: row.panels.length, photoCount: row.panels.length, aspectRatio: width / height,
    dimensionsSummary: `${dimension(width)}" × ${dimension(height)}"`,
    overallWidthInches: dimension(width), overallHeightInches: dimension(height), price: row.price, acrylicPrice: row.price,
    panels: row.panels.map((panel, index) => ({
      id: panel.id, label: `Panel ${index + 1}`,
      x: (panel.x - left) / width, y: (panel.y - top) / height,
      w: panel.width / width, h: panel.height / height,
      widthRatio: panel.width, heightRatio: panel.height, rotation: panel.rotation,
      dimension: `${dimension(panel.width)}" × ${dimension(panel.height)}"`,
    })),
  };
}

export async function fetchStyleLayouts(material: 'canvas' | 'acrylic', signal: AbortSignal) {
  const response = await fetch(buildApiUrl('/customizer-layouts?material=' + material.toUpperCase()), { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load layouts.');
  const rows: SavedLayout[] = await response.json();
  return rows.map(toStyleLayout);
}
