// ============================================================================
// DIGITAL PAINTING DATA & CONFIGURATION
// Centralized configuration for Digital Painting effects, subjects, backgrounds
// ============================================================================

export type DigitalPaintingEffectId =
  | 'effect-oil'
  | 'effect-charcoal'
  | 'effect-knife'
  | 'effect-comic';

export type DigitalPaintingSubjectType = 'people_pets' | 'landscape';

export type DigitalPaintingBackgroundOption = 'original' | 'solid' | 'artist_choice';

export interface DigitalPaintingEffect {
  id: DigitalPaintingEffectId;
  name: string;
  priceAdjustment: number;
  description: string;
  previewImage: string;
  processingNote: string;
  availability: 'available' | 'coming_soon';
  badge?: string;
}

export interface DigitalPaintingBackgroundColor {
  id: string;
  label: string;
  hex: string;
}

export interface DigitalPaintingConfig {
  selectedEffectId: DigitalPaintingEffectId;
  subjectType: DigitalPaintingSubjectType;
  peopleCount: number;
  petsCount: number;
  backgroundOption: DigitalPaintingBackgroundOption;
  backgroundColor: string;
}

export const DIGITAL_PAINTING_EFFECTS: DigitalPaintingEffect[] = [
  {
    id: 'effect-oil',
    name: 'Oil Painting',
    priceAdjustment: 0,
    description: 'Rich, textured oil painting with dynamic brushwork and vibrant depth.',
    previewImage: '/assets/digital-painting/effect-oil.svg',
    processingNote: 'Hand-crafted digital oil impasto brush technique by senior portrait artists.',
    availability: 'available',
    badge: 'POPULAR'
  },
  {
    id: 'effect-charcoal',
    name: 'Charcoal Sketch',
    priceAdjustment: 0,
    description: 'Dramatic black & white charcoal sketch with expressive graphite shading and crosshatching.',
    previewImage: '/assets/digital-painting/effect-charcoal.svg',
    processingNote: 'Fine-art charcoal crosshatch and paper-grain texture transformation.',
    availability: 'available',
    badge: 'CLASSIC'
  },
  {
    id: 'effect-knife',
    name: 'Palette Knife',
    priceAdjustment: 0,
    description: 'Modern impasto style using heavy, faceted palette knife strokes and vivid color slabs.',
    previewImage: '/assets/digital-painting/effect-knife.svg',
    processingNote: 'Faceted palette-knife impasto technique ideal for landscapes & portraits.',
    availability: 'available',
    badge: 'TRENDING'
  },
  {
    id: 'effect-comic',
    name: 'Comic Pop Art',
    priceAdjustment: 0,
    description: 'Vibrant graphic-novel pop art with bold ink lines, halftone dots, and comic punch.',
    previewImage: '/assets/digital-painting/effect-comic.svg',
    processingNote: 'Stylized pop-art cel shading with authentic comic halftone dot pattern.',
    availability: 'available',
    badge: 'CREATIVE'
  }
];

export const DIGITAL_PAINTING_BACKGROUND_COLORS: DigitalPaintingBackgroundColor[] = [
  { id: 'cream', label: 'Cream White', hex: '#FAF8F5' },
  { id: 'warm-beige', label: 'Warm Beige', hex: '#EFE8DC' },
  { id: 'soft-taupe', label: 'Soft Taupe', hex: '#D9CFC1' },
  { id: 'dusty-rose', label: 'Dusty Rose', hex: '#E8D3CE' },
  { id: 'sage-mist', label: 'Sage Mist', hex: '#D5DDD3' },
  { id: 'slate-grey', label: 'Slate Grey', hex: '#708090' },
  { id: 'midnight-navy', label: 'Midnight Navy', hex: '#1B2A4A' },
  { id: 'charcoal-black', label: 'Charcoal Black', hex: '#222222' }
];

export const DEFAULT_DIGITAL_PAINTING_CONFIG: DigitalPaintingConfig = {
  selectedEffectId: 'effect-oil',
  subjectType: 'people_pets',
  peopleCount: 1,
  petsCount: 0,
  backgroundOption: 'original',
  backgroundColor: '#FAF8F5'
};

export const getDigitalPaintingEffect = (id?: string): DigitalPaintingEffect => {
  return (
    DIGITAL_PAINTING_EFFECTS.find((e) => e.id === id) ||
    DIGITAL_PAINTING_EFFECTS[0]
  );
};
