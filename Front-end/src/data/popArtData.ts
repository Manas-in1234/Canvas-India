// ============================================================================
// POP ART DATA & CONFIGURATION
// Centralized configuration for Pop Art styles, metadata, pricing & processing
// ============================================================================

export type PopArtStyleId =
  | 'andy-warhol'
  | 'caricatures'
  | 'pixel-painting'
  | 'lichtenstein'
  | 'glo-portrait'
  | 'coca-cola1'
  | 'coca-cola2'
  | 'che-all-in-1'
  | 'che-all-in-2'
  | 'coupe5'
  | 'coupe8'
  | 'che1'
  | 'marilyn1'
  | 'sachiko1'
  | 'dollar3'
  | 'mao5';

export type PopArtProcessingType =
  | 'multi-panel-warhol'
  | 'caricature'
  | 'pixel-mosaic'
  | 'halftone-comic'
  | 'neon-glow'
  | 'poster-duotone'
  | 'poster-tritone'
  | 'monochrome-high-contrast';

export interface PopArtStyleOption {
  id: PopArtStyleId;
  name: string;
  previewImage: string;
  price: number;
  priceAdjustment: number;
  description: string;
  processingType: PopArtProcessingType;
  processingNote: string;
  panelsCount: number;
  availability: 'available' | 'coming_soon';
  badge?: string;
}

export interface PopArtConfig {
  selectedStyleId: PopArtStyleId;
  processedImageUrl: string | null;
  isProcessing: boolean;
}

export const DEFAULT_POP_ART_CONFIG: PopArtConfig = {
  selectedStyleId: 'andy-warhol',
  processedImageUrl: null,
  isProcessing: false
};

// All 16 styles exactly matching the reference specification & uploaded screenshots
export const POP_ART_STYLES: PopArtStyleOption[] = [
  {
    id: 'andy-warhol',
    name: 'Andy-Warhol',
    previewImage: '/assets/pop-art/andy-warhol.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Iconic 4-quadrant screenprint Pop Art with contrasting vibrant pop palettes across four quadrants.',
    processingType: 'multi-panel-warhol',
    processingNote: '4-panel Pop Art composition with contrasting complementary background and subject color treatments.',
    panelsCount: 4,
    availability: 'available',
    badge: 'POPULAR'
  },
  {
    id: 'caricatures',
    name: 'Caricatures',
    previewImage: '/assets/pop-art/caricatures.svg',
    price: 599.0,
    priceAdjustment: 100,
    description: 'Playful cartoon caricature styling with bold hand-drawn contours, comic cel shading, and warm tones.',
    processingType: 'caricature',
    processingNote: 'Artistic caricature preview generated. Our digital artists hand-refine the exaggerated features and proportions for your final print.',
    panelsCount: 1,
    availability: 'available',
    badge: 'ARTIST PICK'
  },
  {
    id: 'pixel-painting',
    name: 'Pixel Painting',
    previewImage: '/assets/pop-art/pixel-painting.svg',
    price: 1750.0,
    priceAdjustment: 1251,
    description: 'Retro 8-bit digital pixel art mosaic transformation preserving facial likeness with sharp mosaic tiles.',
    processingType: 'pixel-mosaic',
    processingNote: 'Genuine digital pixel art mosaic transformation with calibrated block resolution and pixel grid geometry.',
    panelsCount: 1,
    availability: 'available',
    badge: 'PREMIUM'
  },
  {
    id: 'lichtenstein',
    name: 'Lichtenstein',
    previewImage: '/assets/pop-art/lichtenstein.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Roy Lichtenstein comic strip pop art featuring Ben-Day halftone dots, ink contours, and primary comic colors.',
    processingType: 'halftone-comic',
    processingNote: 'Comic-book Ben-Day halftone dot pattern rasterization with bold black inking and high-contrast color separation.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'glo-portrait',
    name: 'Glo-Portrait',
    previewImage: '/assets/pop-art/glo-portrait.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Vibrant neon glowing portrait with electric contours on a bright pop art textured backdrop.',
    processingType: 'neon-glow',
    processingNote: 'Electric neon edge luminescence with saturated pop duotone color mapping and pattern background.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'coca-cola1',
    name: 'Coca Cola1',
    previewImage: '/assets/pop-art/coca-cola1.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: '1960s advertising pop art screenprint in bold magenta, hot pink, and crisp cyan highlights.',
    processingType: 'poster-tritone',
    processingNote: 'High-contrast 60s vintage silkscreen tri-tone posterization in vibrant fuchsia and electric cyan.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'coca-cola2',
    name: 'Coca Cola2',
    previewImage: '/assets/pop-art/coca-cola2.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Rich vintage poster style featuring crimson red, antique off-white cream, and deep midnight navy.',
    processingType: 'poster-tritone',
    processingNote: 'Vintage high-contrast posterization in crimson red, warm parchment cream, and midnight navy.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'che-all-in-1',
    name: 'Che-all-in-1',
    previewImage: '/assets/pop-art/che-all-in-1.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Iconic 4-panel revolutionary pop art montage with rotating bold graphic screenprint colorways.',
    processingType: 'multi-panel-warhol',
    processingNote: '4-panel high-contrast screenprint arrangement featuring bold red, amber, cyan, and magenta duotones.',
    panelsCount: 4,
    availability: 'available'
  },
  {
    id: 'che-all-in-2',
    name: 'Che-all-in-2',
    previewImage: '/assets/pop-art/che-all-in-2.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Dynamic 6-panel high-impact pop art montage with rotating vibrant silkscreen duotone treatments.',
    processingType: 'multi-panel-warhol',
    processingNote: '6-panel screenprint montage cycling through red, gold, green, cyan, violet, and amber pop blocks.',
    panelsCount: 6,
    availability: 'available'
  },
  {
    id: 'coupe5',
    name: 'Coupe5',
    previewImage: '/assets/pop-art/coupe5.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'High-contrast silver gelatin black-and-white pop portrait with rich velvety blacks and bright highlights.',
    processingType: 'monochrome-high-contrast',
    processingNote: 'Classic fine-art black-and-white pop posterization with stark tonal separation and deep contrast.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'coupe8',
    name: 'Coupe8',
    previewImage: '/assets/pop-art/coupe8.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Warm monochrome sepia-tinted vintage screenprint with deep espresso shadows and cream highlights.',
    processingType: 'poster-duotone',
    processingNote: 'Warm sepia vintage duotone screenprint with filmic tonal gradation and rich midtone warmth.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'che1',
    name: 'Che1',
    previewImage: '/assets/pop-art/che1.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Fiery monochromatic amber, ochre, and deep crimson revolutionary pop screenprint.',
    processingType: 'poster-duotone',
    processingNote: 'Monochromatic warm amber and deep vermilion silkscreen posterization.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'marilyn1',
    name: 'Marilyn1',
    previewImage: '/assets/pop-art/marilyn1.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: "Warhol's legendary Marilyn Monroe palette: electric turquoise, hot fuchsia pink, and luminous highlights.",
    processingType: 'poster-tritone',
    processingNote: 'Electric turquoise and hot fuchsia duotone pop screenprint inspired by 1962 silk screen masterworks.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'sachiko1',
    name: 'Sachiko1',
    previewImage: '/assets/pop-art/sachiko1.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: '4-panel pastel pop quartet featuring soft bubblegum pink, seafoam cyan, peach, and lavender.',
    processingType: 'multi-panel-warhol',
    processingNote: '4-panel pastel pop screenprint quartet with balanced Japanese contemporary pastel colorways.',
    panelsCount: 4,
    availability: 'available'
  },
  {
    id: 'dollar3',
    name: 'Dollar3',
    previewImage: '/assets/pop-art/dollar3.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Pop art series aesthetic with electric cobalt blue shadows and bold mustard yellow highlights.',
    processingType: 'poster-duotone',
    processingNote: 'Cobalt blue and mustard yellow duotone screenprint inspired by vintage Pop Art currency series.',
    panelsCount: 1,
    availability: 'available'
  },
  {
    id: 'mao5',
    name: 'Mao5',
    previewImage: '/assets/pop-art/mao5.svg',
    price: 499.0,
    priceAdjustment: 0,
    description: 'Avant-garde 70s screenprint with stark crimson red, sage green, and charcoal graphic tones.',
    processingType: 'poster-tritone',
    processingNote: 'Silkscreen posterization in stark crimson, vintage olive-sage, and pitch black charcoal.',
    panelsCount: 1,
    availability: 'available'
  }
];

export function getPopArtStyle(id: string): PopArtStyleOption {
  return POP_ART_STYLES.find((s) => s.id === id) || POP_ART_STYLES[0];
}

export type PopArtSizeCategory = 'RECOMMENDED' | 'SQUARE' | 'PORTRAIT' | 'PANORAMIC' | 'LARGE' | 'SMALL';

// Dedicated Pop Art Size Options (supporting Recommended, Square, Panoramic, Large, and Small)
export interface PopArtSizeOption {
  id: string;
  productTypeId: 'canvas-pop-art';
  label: string;
  dimensionsSummary: string;
  widthInches: number;
  heightInches: number;
  price: number;
  categories: PopArtSizeCategory[];
  panelsCount: number;
  diagramType?: string;
  panels: Array<{
    id: string;
    label: string;
    dimension: string;
    widthRatio: number;
    heightRatio: number;
  }>;
}

export const POP_ART_SIZE_OPTIONS: PopArtSizeOption[] = [
  // SQUARE (Preferred for Andy-Warhol, Sachiko1, Che-all-in-1, etc.)
  {
    id: 'pop-sq-8x8',
    productTypeId: 'canvas-pop-art',
    label: '8" × 8"',
    dimensionsSummary: '8" × 8"',
    widthInches: 8,
    heightInches: 8,
    price: 399.0,
    categories: ['SQUARE', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'pop-sq-10x10',
    productTypeId: 'canvas-pop-art',
    label: '10" × 10"',
    dimensionsSummary: '10" × 10"',
    widthInches: 10,
    heightInches: 10,
    price: 449.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'pop-12x12',
    productTypeId: 'canvas-pop-art',
    label: '12" × 12"',
    dimensionsSummary: '12" × 12"',
    widthInches: 12,
    heightInches: 12,
    price: 499.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'pop-16x16',
    productTypeId: 'canvas-pop-art',
    label: '16" × 16"',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    price: 799.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'pop-sq-18x18',
    productTypeId: 'canvas-pop-art',
    label: '18" × 18"',
    dimensionsSummary: '18" × 18"',
    widthInches: 18,
    heightInches: 18,
    price: 999.0,
    categories: ['SQUARE', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'pop-sq-20x20',
    productTypeId: 'canvas-pop-art',
    label: '20" × 20"',
    dimensionsSummary: '20" × 20"',
    widthInches: 20,
    heightInches: 20,
    price: 1199.0,
    categories: ['RECOMMENDED', 'SQUARE', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },

  // PANORAMIC & RECTANGLE
  {
    id: 'pop-pan-12x8',
    productTypeId: 'canvas-pop-art',
    label: '12" × 8"',
    dimensionsSummary: '12" × 8"',
    widthInches: 12,
    heightInches: 8,
    price: 449.0,
    categories: ['PANORAMIC', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 8"', widthRatio: 12, heightRatio: 8 }]
  },
  {
    id: 'pop-pan-12x18',
    productTypeId: 'canvas-pop-art',
    label: '12" × 18"',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    price: 649.0,
    categories: ['RECOMMENDED', 'PANORAMIC', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'pop-pan-16x20',
    productTypeId: 'canvas-pop-art',
    label: '16" × 20"',
    dimensionsSummary: '16" × 20"',
    widthInches: 16,
    heightInches: 20,
    price: 899.0,
    categories: ['RECOMMENDED', 'PANORAMIC'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'pop-pan-16x24',
    productTypeId: 'canvas-pop-art',
    label: '16" × 24"',
    dimensionsSummary: '16" × 24"',
    widthInches: 16,
    heightInches: 24,
    price: 1099.0,
    categories: ['RECOMMENDED', 'PANORAMIC', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },
  {
    id: 'pop-pan-16x32',
    productTypeId: 'canvas-pop-art',
    label: '16" × 32"',
    dimensionsSummary: '16" × 32"',
    widthInches: 16,
    heightInches: 32,
    price: 1399.0,
    categories: ['PANORAMIC', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 }]
  },
  {
    id: 'pop-pan-18x24',
    productTypeId: 'canvas-pop-art',
    label: '18" × 24"',
    dimensionsSummary: '18" × 24"',
    widthInches: 18,
    heightInches: 24,
    price: 1299.0,
    categories: ['PANORAMIC', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },
  {
    id: 'pop-pan-20x30',
    productTypeId: 'canvas-pop-art',
    label: '20" × 30"',
    dimensionsSummary: '20" × 30"',
    widthInches: 20,
    heightInches: 30,
    price: 1699.0,
    categories: ['RECOMMENDED', 'PANORAMIC', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '20" × 30"', widthRatio: 20, heightRatio: 30 }]
  },
  {
    id: 'pop-pan-24x36',
    productTypeId: 'canvas-pop-art',
    label: '24" × 36"',
    dimensionsSummary: '24" × 36"',
    widthInches: 24,
    heightInches: 36,
    price: 1999.0,
    categories: ['PANORAMIC', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  },

  // PORTRAIT & RECTANGLE (Ideal for Caricatures, Lichtenstein, Single-panel portraits)
  {
    id: 'pop-pt-12x16',
    productTypeId: 'canvas-pop-art',
    label: '12" × 16"',
    dimensionsSummary: '12" × 16"',
    widthInches: 12,
    heightInches: 16,
    price: 649.0,
    categories: ['RECOMMENDED', 'PORTRAIT', 'SMALL'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 }]
  },
  {
    id: 'pop-pt-16x20',
    productTypeId: 'canvas-pop-art',
    label: '16" × 20"',
    dimensionsSummary: '16" × 20"',
    widthInches: 16,
    heightInches: 20,
    price: 899.0,
    categories: ['RECOMMENDED', 'PORTRAIT'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'pop-pt-18x24',
    productTypeId: 'canvas-pop-art',
    label: '18" × 24"',
    dimensionsSummary: '18" × 24"',
    widthInches: 18,
    heightInches: 24,
    price: 1299.0,
    categories: ['PORTRAIT', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },
  {
    id: 'pop-pt-24x36',
    productTypeId: 'canvas-pop-art',
    label: '24" × 36"',
    dimensionsSummary: '24" × 36"',
    widthInches: 24,
    heightInches: 36,
    price: 1999.0,
    categories: ['PORTRAIT', 'LARGE'],
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  }
];
