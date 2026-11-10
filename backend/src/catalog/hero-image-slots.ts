export const HERO_IMAGE_SLOTS = {
  home: {
    label: 'Home',
    path: '/',
    fallback: 'https://images.unsplash.com/photo-1577083753695-e010191bacb5?w=2200&auto=format&fit=crop&q=90',
    layout: 'fade',
  },
  canvas: {
    label: 'Canvas',
    path: '/canvas',
    fallback: '/assets/canvas/canvas-gold-teal-leaves.webp',
    layout: 'right',
  },
  acrylic: {
    label: 'Acrylic',
    path: '/acrylic',
    fallback: '/assets/acrylic/acrylic-butterfly-art.webp',
    layout: 'right',
  },
  cork: {
    label: 'Cork',
    path: '/cork',
    fallback: '/assets/cork/cork-coastal-scenery.webp',
    layout: 'right',
  },
  corporate: {
    label: 'Corporate Orders',
    path: '/bulk-orders',
    fallback: '/assets/canvas-india-branded-packaging.webp',
    layout: 'fade',
  },
} as const;

export type HeroImageSlot = keyof typeof HERO_IMAGE_SLOTS;
export const HERO_IMAGE_MAX_BYTES = 4 * 1024 * 1024;

export function isHeroImageSlot(value: string): value is HeroImageSlot {
  return Object.prototype.hasOwnProperty.call(HERO_IMAGE_SLOTS, value);
}
