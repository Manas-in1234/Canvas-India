// ============================================================================
// ACRYLIC CUSTOMIZER DATA & CONFIGURATION CONSTANTS
// Strictly Acrylic-only options (No canvas wrap, wood, or metal customizer options)
// Image-first architecture: All options include local image examples
// ============================================================================

export type ToolbarTab = 
  | 'PRODUCTS' 
  | 'UPLOAD' 
  | 'SELECT SIZE' 
  | 'SHAPES'
  | 'SHAPE'
  | 'LAYOUTS & DESIGNS' 
  | 'WRAP & BORDER'
  | 'HARDWARE & FINISH' 
  | 'OPTIONS'
  | 'TEMPLATES';

export interface AcrylicProductType {
  id: string;
  name: string;
  price: number;
  startingPrice: number;
  image: string;
  iconType: 'block' | 'panel' | 'wall' | 'print' | 'collage' | 'split' | 'signage';
  defaultLayout: LayoutType;
  defaultLayoutId: string;
  defaultShape: string;
  supportedShapes: string[];
  imageSlots: number;
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
  defaultHardwareId: string;
  defaultThicknessId: string;
  supportedShapeIds: string[];
  supportedHardwareIds: string[];
}

export type AcrylicProduct = AcrylicProductType;

/**
 * Centralized Product -> Shape compatibility configuration.
 * Controls which shapes appear in the SHAPES panel for each Acrylic product.
 */
export const AcrylicProductShapeConfig: Record<string, string[]> = {
  'acrylic-photo-block': [
    'shape-square',
    'shape-rectangle',
    'shape-rounded-rect'
  ],
  'acrylic-photo-panel': [
    'shape-square',
    'shape-rectangle',
    'shape-landscape',
    'shape-portrait',
    'shape-circle',
    'shape-oval',
    'shape-rounded-rect',
    'shape-heart',
    'shape-hexagon'
  ],
  'acrylic-wall-art': [
    'shape-square',
    'shape-rectangle',
    'shape-landscape',
    'shape-portrait'
  ],
  'acrylic-print': [
    'shape-square',
    'shape-rectangle',
    'shape-landscape',
    'shape-portrait',
    'shape-circle',
    'shape-oval',
    'shape-rounded-rect'
  ],
  'acrylic-collage': [
    'shape-square',
    'shape-rectangle',
    'shape-landscape',
    'shape-portrait'
  ]
};

export const ALL_ACRYLIC_HARDWARE_IDS: string[] = [
  'hooks-hanging',
  'ready-to-hang',
  'no-hooks',
  'sawtooth-hanger',
  'easel-back',
  'nail-free-hook',
  'standoff-mounts'
];

/**
 * Centralized Product -> Hardware configuration.
 * Preserves all 7 hardware options from the full hardware implementation for every Acrylic product.
 */
export const AcrylicHardwareConfig: Record<string, string[]> = {
  'acrylic-photo-block': ALL_ACRYLIC_HARDWARE_IDS,
  'acrylic-photo-panel': ALL_ACRYLIC_HARDWARE_IDS,
  'acrylic-wall-art': ALL_ACRYLIC_HARDWARE_IDS,
  'acrylic-print': ALL_ACRYLIC_HARDWARE_IDS,
  'acrylic-collage': ALL_ACRYLIC_HARDWARE_IDS
};

export const ACRYLIC_PRODUCT_TYPES: AcrylicProductType[] = [
  {
    id: 'acrylic-photo-block',
    name: 'Acrylic Photo Block',
    price: 499.00,
    startingPrice: 499.00,
    image: '/images/acrylic/square/square-acrylic-print.svg',
    iconType: 'block',
    defaultLayout: 'single',
    defaultLayoutId: 'layout-1-single',
    defaultShape: 'shape-square',
    supportedShapes: AcrylicProductShapeConfig['acrylic-photo-block'],
    imageSlots: 1,
    panelsCount: 1,
    description: 'Freestanding, solid optical acrylic block with 3D crystal depth.',
    defaultSizeOptionId: 'shape-square-4x4',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: '8mm',
    supportedShapeIds: AcrylicProductShapeConfig['acrylic-photo-block'],
    supportedHardwareIds: AcrylicHardwareConfig['acrylic-photo-block']
  },
  {
    id: 'acrylic-photo-panel',
    name: 'Acrylic Photo Panel',
    price: 355.00,
    startingPrice: 355.00,
    image: '/images/acrylic/rectangle/rectangle-acrylic-print.svg',
    iconType: 'panel',
    defaultLayout: 'single',
    defaultLayoutId: 'layout-1-single',
    defaultShape: 'shape-rectangle',
    supportedShapes: AcrylicProductShapeConfig['acrylic-photo-panel'],
    imageSlots: 1,
    panelsCount: 1,
    description: 'Modern slim acrylic panel with diamond polished border.',
    defaultSizeOptionId: 'shape-rectangle-12x8',
    defaultHardwareId: 'standoff-mounts',
    defaultThicknessId: '3mm',
    supportedShapeIds: AcrylicProductShapeConfig['acrylic-photo-panel'],
    supportedHardwareIds: AcrylicHardwareConfig['acrylic-photo-panel']
  },
  {
    id: 'acrylic-wall-art',
    name: 'Acrylic Wall Art',
    price: 2338.90,
    startingPrice: 2338.90,
    image: '/images/acrylic/shapes/rectangle.svg',
    iconType: 'wall',
    defaultLayout: 'single',
    defaultLayoutId: 'layout-1-single',
    defaultShape: 'shape-rectangle',
    supportedShapes: AcrylicProductShapeConfig['acrylic-wall-art'],
    imageSlots: 1,
    panelsCount: 1,
    description: 'Gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'shape-rectangle-12x8',
    defaultHardwareId: 'ready-to-hang',
    defaultThicknessId: '5mm',
    supportedShapeIds: AcrylicProductShapeConfig['acrylic-wall-art'],
    supportedHardwareIds: AcrylicHardwareConfig['acrylic-wall-art']
  },
  {
    id: 'acrylic-print',
    name: 'Acrylic Print',
    price: 355.00,
    startingPrice: 355.00,
    image: '/images/acrylic/shapes/landscape.svg',
    iconType: 'print',
    defaultLayout: 'single',
    defaultLayoutId: 'layout-1-single',
    defaultShape: 'shape-landscape',
    supportedShapes: AcrylicProductShapeConfig['acrylic-print'],
    imageSlots: 1,
    panelsCount: 1,
    description: 'Vibrant direct UV sub-surface print on crystal acrylic.',
    defaultSizeOptionId: 'shape-landscape-12x8',
    defaultHardwareId: 'hooks-hanging',
    defaultThicknessId: '3mm',
    supportedShapeIds: AcrylicProductShapeConfig['acrylic-print'],
    supportedHardwareIds: AcrylicHardwareConfig['acrylic-print']
  },
  {
    id: 'acrylic-collage',
    name: 'Acrylic Collage',
    price: 426.00,
    startingPrice: 426.00,
    image: '/assets/customizer/acrylic/layouts/layout-4-grid.svg',
    iconType: 'collage',
    defaultLayout: 'fourGrid',
    defaultLayoutId: 'layout-4-grid',
    defaultShape: 'shape-square',
    supportedShapes: AcrylicProductShapeConfig['acrylic-collage'],
    imageSlots: 4,
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on acrylic.',
    defaultSizeOptionId: 'shape-square-4x4',
    defaultHardwareId: 'hooks-hanging',
    defaultThicknessId: '3mm',
    supportedShapeIds: AcrylicProductShapeConfig['acrylic-collage'],
    supportedHardwareIds: AcrylicHardwareConfig['acrylic-collage']
  }
];

export const ACRYLIC_PRODUCTS = ACRYLIC_PRODUCT_TYPES;

export type SizeCategory = 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL';

export interface SizeOption {
  id: string;
  productTypeId: string;
  category: SizeCategory;
  label: string;
  dimensionsSummary: string;
  widthInches: number;
  heightInches: number;
  price: number;
  aspectClass: string;
  image: string;
}

export const SIZE_OPTIONS: SizeOption[] = [
  // Recommended
  {
    id: 'rec-11x17',
    productTypeId: 'acrylic-photo-panel',
    category: 'RECOMMENDED',
    label: '11" × 17"',
    dimensionsSummary: '11" × 17"',
    widthInches: 17,
    heightInches: 11,
    price: 447.00,
    aspectClass: 'aspect-[17/11]',
    image: '/assets/customizer/acrylic/sizes/landscape.svg'
  },
  {
    id: 'rec-22x34',
    productTypeId: 'acrylic-photo-panel',
    category: 'RECOMMENDED',
    label: '22" × 34"',
    dimensionsSummary: '22" × 34"',
    widthInches: 34,
    heightInches: 22,
    price: 1624.00,
    aspectClass: 'aspect-[34/22]',
    image: '/assets/customizer/acrylic/sizes/landscape.svg'
  },
  {
    id: 'rec-33x51',
    productTypeId: 'acrylic-photo-panel',
    category: 'RECOMMENDED',
    label: '33" × 51"',
    dimensionsSummary: '33" × 51"',
    widthInches: 51,
    heightInches: 33,
    price: 3584.00,
    aspectClass: 'aspect-[51/33]',
    image: '/assets/customizer/acrylic/sizes/large.svg'
  },
  {
    id: 'rec-8x10',
    productTypeId: 'acrylic-photo-panel',
    category: 'RECOMMENDED',
    label: '8" × 10"',
    dimensionsSummary: '8" × 10"',
    widthInches: 10,
    heightInches: 8,
    price: 590.00,
    aspectClass: 'aspect-[10/8]',
    image: '/assets/customizer/acrylic/sizes/landscape.svg'
  },
  {
    id: 'rec-12x18',
    productTypeId: 'acrylic-photo-panel',
    category: 'RECOMMENDED',
    label: '12" × 18"',
    dimensionsSummary: '12" × 18"',
    widthInches: 18,
    heightInches: 12,
    price: 1250.00,
    aspectClass: 'aspect-[18/12]',
    image: '/assets/customizer/acrylic/sizes/landscape.svg'
  },

  // Square
  {
    id: 'sq-4x4',
    productTypeId: 'acrylic-photo-block',
    category: 'SQUARE',
    label: '4" × 4"',
    dimensionsSummary: '4" × 4"',
    widthInches: 4,
    heightInches: 4,
    price: 499.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-5x5',
    productTypeId: 'acrylic-photo-block',
    category: 'SQUARE',
    label: '5" × 5"',
    dimensionsSummary: '5" × 5"',
    widthInches: 5,
    heightInches: 5,
    price: 450.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-6x6',
    productTypeId: 'acrylic-photo-block',
    category: 'SQUARE',
    label: '6" × 6"',
    dimensionsSummary: '6" × 6"',
    widthInches: 6,
    heightInches: 6,
    price: 699.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-8x8',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '8" × 8"',
    dimensionsSummary: '8" × 8"',
    widthInches: 8,
    heightInches: 8,
    price: 355.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-10x10',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '10" × 10"',
    dimensionsSummary: '10" × 10"',
    widthInches: 10,
    heightInches: 10,
    price: 799.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-12x12',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '12" × 12"',
    dimensionsSummary: '12" × 12"',
    widthInches: 12,
    heightInches: 12,
    price: 999.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },

  {
    id: 'sq-16x16',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '16" × 16"',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    price: 1799.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-18x18',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '18" × 18"',
    dimensionsSummary: '18" × 18"',
    widthInches: 18,
    heightInches: 18,
    price: 2299.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },
  {
    id: 'sq-20x20',
    productTypeId: 'acrylic-photo-panel',
    category: 'SQUARE',
    label: '20" × 20"',
    dimensionsSummary: '20" × 20"',
    widthInches: 20,
    heightInches: 20,
    price: 2799.00,
    aspectClass: 'aspect-square',
    image: '/assets/customizer/acrylic/sizes/square.svg'
  },

  // Panoramic
  {
    id: 'pan-10x30',
    productTypeId: 'acrylic-photo-panel',
    category: 'PANORAMIC',
    label: '10" × 30"',
    dimensionsSummary: '10" × 30"',
    widthInches: 30,
    heightInches: 10,
    price: 1450.00,
    aspectClass: 'aspect-[30/10]',
    image: '/assets/customizer/acrylic/sizes/panoramic.svg'
  },
  {
    id: 'pan-12x36',
    productTypeId: 'acrylic-photo-panel',
    category: 'PANORAMIC',
    label: '12" × 36"',
    dimensionsSummary: '12" × 36"',
    widthInches: 36,
    heightInches: 12,
    price: 1850.00,
    aspectClass: 'aspect-[36/12]',
    image: '/assets/customizer/acrylic/sizes/panoramic.svg'
  },
  {
    id: 'pan-16x48',
    productTypeId: 'acrylic-photo-panel',
    category: 'PANORAMIC',
    label: '16" × 48"',
    dimensionsSummary: '16" × 48"',
    widthInches: 48,
    heightInches: 16,
    price: 2890.00,
    aspectClass: 'aspect-[48/16]',
    image: '/assets/customizer/acrylic/sizes/panoramic.svg'
  },

  // Large
  {
    id: 'lg-20x30',
    productTypeId: 'acrylic-photo-panel',
    category: 'LARGE',
    label: '20" × 30"',
    dimensionsSummary: '20" × 30"',
    widthInches: 30,
    heightInches: 20,
    price: 2490.00,
    aspectClass: 'aspect-[30/20]',
    image: '/assets/customizer/acrylic/sizes/large.svg'
  },
  {
    id: 'lg-24x36',
    productTypeId: 'acrylic-photo-panel',
    category: 'LARGE',
    label: '24" × 36"',
    dimensionsSummary: '24" × 36"',
    widthInches: 36,
    heightInches: 24,
    price: 3150.00,
    aspectClass: 'aspect-[36/24]',
    image: '/assets/customizer/acrylic/sizes/large.svg'
  },
  {
    id: 'lg-30x40',
    productTypeId: 'acrylic-photo-panel',
    category: 'LARGE',
    label: '30" × 40"',
    dimensionsSummary: '30" × 40"',
    widthInches: 40,
    heightInches: 30,
    price: 4200.00,
    aspectClass: 'aspect-[40/30]',
    image: '/assets/customizer/acrylic/sizes/large.svg'
  },

  // Small
  {
    id: 'sm-4x6',
    productTypeId: 'acrylic-photo-panel',
    category: 'SMALL',
    label: '4" × 6"',
    dimensionsSummary: '4" × 6"',
    widthInches: 6,
    heightInches: 4,
    price: 355.00,
    aspectClass: 'aspect-[6/4]',
    image: '/assets/customizer/acrylic/sizes/portrait.svg'
  },
  {
    id: 'sm-5x7',
    productTypeId: 'acrylic-photo-panel',
    category: 'SMALL',
    label: '5" × 7"',
    dimensionsSummary: '5" × 7"',
    widthInches: 7,
    heightInches: 5,
    price: 420.00,
    aspectClass: 'aspect-[7/5]',
    image: '/assets/customizer/acrylic/sizes/portrait.svg'
  },
  {
    id: 'sm-6x8',
    productTypeId: 'acrylic-photo-panel',
    category: 'SMALL',
    label: '6" × 8"',
    dimensionsSummary: '6" × 8"',
    widthInches: 8,
    heightInches: 6,
    price: 490.00,
    aspectClass: 'aspect-[8/6]',
    image: '/assets/customizer/acrylic/sizes/portrait.svg'
  }
];

export type LayoutType =
  | 'single'
  | 'twoSplit'
  | 'threeCollage'
  | 'fourGrid'
  | 'topBottom'
  | 'leftRight'
  | 'mainTwoSmall';

export interface LayoutSlotDefinition {
  id: string;
  slotIndex: number;
  label: string;
  x: number;      // Normalized 0..1
  y: number;      // Normalized 0..1
  width: number;  // Normalized 0..1
  height: number; // Normalized 0..1
}

export interface LayoutPreset {
  id: string;
  name: string;
  photoCount: number;
  description: string;
  image: string;
  layoutType: LayoutType;
  frames: Array<{
    id: string;
    label: string;
    dimension: string;
    aspectRatio: string;
  }>;
}

/**
 * Centralized normalized layout slot engine (coordinates 0..1 within the product bounding box).
 * Used by both the workspace canvas renderer and the sidebar layout card preview icons.
 */
export function getLayoutSlots(layoutType: LayoutType, aspectRatio = 1): LayoutSlotDefinition[] {
  switch (layoutType) {
    case 'single':
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 1, height: 1 }
      ];

    case 'twoSplit':
      // Adapt intelligently to product aspect ratio: portrait (< 1) stacks top/bottom; landscape/square (>= 1) splits left/right
      if (aspectRatio < 1) {
        return [
          { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 1, height: 0.5 },
          { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0, y: 0.5, width: 1, height: 0.5 }
        ];
      }
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 0.5, height: 1 },
        { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0.5, y: 0, width: 0.5, height: 1 }
      ];

    case 'threeCollage':
      // One large image on top (height 0.6), two smaller images below (width 0.5, height 0.4 each)
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 1, height: 0.6 },
        { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0, y: 0.6, width: 0.5, height: 0.4 },
        { id: 'image-3', slotIndex: 2, label: 'Image 3', x: 0.5, y: 0.6, width: 0.5, height: 0.4 }
      ];

    case 'fourGrid':
      // Symmetric 2 x 2 grid
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 0.5, height: 0.5 },
        { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0.5, y: 0, width: 0.5, height: 0.5 },
        { id: 'image-3', slotIndex: 2, label: 'Image 3', x: 0, y: 0.5, width: 0.5, height: 0.5 },
        { id: 'image-4', slotIndex: 3, label: 'Image 4', x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
      ];

    case 'topBottom':
      // Two horizontal regions stacked vertically
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 1, height: 0.5 },
        { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0, y: 0.5, width: 1, height: 0.5 }
      ];

    case 'leftRight':
      // Two vertical regions side-by-side
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 0.5, height: 1 },
        { id: 'image-2', slotIndex: 1, label: 'Image 2', x: 0.5, y: 0, width: 0.5, height: 1 }
      ];

    case 'mainTwoSmall':
      // Dominant main image on top (height 0.65) with two smaller images below (width 0.5, height 0.35 each)
      return [
        { id: 'image-1', slotIndex: 0, label: 'Main Image', x: 0, y: 0, width: 1, height: 0.65 },
        { id: 'image-2', slotIndex: 1, label: 'Small 1', x: 0, y: 0.65, width: 0.5, height: 0.35 },
        { id: 'image-3', slotIndex: 2, label: 'Small 2', x: 0.5, y: 0.65, width: 0.5, height: 0.35 }
      ];

    default:
      return [
        { id: 'image-1', slotIndex: 0, label: 'Image 1', x: 0, y: 0, width: 1, height: 1 }
      ];
  }
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  // 1. Single Image
  {
    id: 'layout-1-single',
    name: 'Single Image',
    photoCount: 1,
    description: 'Full edge-to-edge optical clarity acrylic single print.',
    image: '/assets/customizer/acrylic/layouts/layout-1-single.svg',
    layoutType: 'single',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Full Area', aspectRatio: 'w-full h-full' }
    ]
  },

  // 2. 2 Image Split
  {
    id: 'layout-2-split',
    name: '2 Image Split',
    photoCount: 2,
    description: 'Two equal sections adapting to product aspect ratio.',
    image: '/assets/customizer/acrylic/layouts/layout-2-split.svg',
    layoutType: 'twoSplit',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Section 1', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Section 2', aspectRatio: 'w-full h-full' }
    ]
  },

  // 3. 3 Image Collage
  {
    id: 'layout-3-collage',
    name: '3 Image Collage',
    photoCount: 3,
    description: 'One large top image with two smaller images below.',
    image: '/assets/customizer/acrylic/layouts/layout-3-collage.svg',
    layoutType: 'threeCollage',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Top Large', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Bottom Left', aspectRatio: 'w-full h-full' },
      { id: 'image-3', label: 'Image 3', dimension: 'Bottom Right', aspectRatio: 'w-full h-full' }
    ]
  },

  // 4. 4 Image Grid
  {
    id: 'layout-4-grid',
    name: '4 Image Grid',
    photoCount: 4,
    description: 'Symmetric 2×2 grid collage for 4 photos.',
    image: '/assets/customizer/acrylic/layouts/layout-4-grid.svg',
    layoutType: 'fourGrid',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Top Left', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Top Right', aspectRatio: 'w-full h-full' },
      { id: 'image-3', label: 'Image 3', dimension: 'Bottom Left', aspectRatio: 'w-full h-full' },
      { id: 'image-4', label: 'Image 4', dimension: 'Bottom Right', aspectRatio: 'w-full h-full' }
    ]
  },

  // 5. Top + Bottom
  {
    id: 'layout-top-bottom',
    name: 'Top + Bottom',
    photoCount: 2,
    description: 'Two horizontal regions stacked vertically.',
    image: '/assets/customizer/acrylic/layouts/layout-top-bottom.svg',
    layoutType: 'topBottom',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Top Region', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Bottom Region', aspectRatio: 'w-full h-full' }
    ]
  },

  // 6. Left + Right
  {
    id: 'layout-left-right',
    name: 'Left + Right',
    photoCount: 2,
    description: 'Two vertical regions side-by-side.',
    image: '/assets/customizer/acrylic/layouts/layout-left-right.svg',
    layoutType: 'leftRight',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Left Region', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Right Region', aspectRatio: 'w-full h-full' }
    ]
  },

  // 7. Main + 2 Small Images
  {
    id: 'layout-main-2small',
    name: 'Main + 2 Small Images',
    photoCount: 3,
    description: 'Large main hero image above two smaller images.',
    image: '/assets/customizer/acrylic/layouts/layout-main-2small.svg',
    layoutType: 'mainTwoSmall',
    frames: [
      { id: 'image-1', label: 'Main Image', dimension: 'Main Top', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Small 1', dimension: 'Small Left', aspectRatio: 'w-full h-full' },
      { id: 'image-3', label: 'Small 2', dimension: 'Small Right', aspectRatio: 'w-full h-full' }
    ]
  },

  // Legacy layout aliases for backward compatibility
  {
    id: 'layout-2-vertical',
    name: '2 Columns',
    photoCount: 2,
    description: 'Dual portrait panels side-by-side.',
    image: '/assets/customizer/acrylic/layouts/layout-2-split.svg',
    layoutType: 'leftRight',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Left Half', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Right Half', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-2-horizontal',
    name: '2 Rows',
    photoCount: 2,
    description: 'Dual horizontal panels stacked vertically.',
    image: '/assets/customizer/acrylic/layouts/layout-top-bottom.svg',
    layoutType: 'topBottom',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Top Half', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Bottom Half', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-3-wall',
    name: 'Wall Trio',
    photoCount: 3,
    description: 'Hero landscape panel above two complementary square panels.',
    image: '/assets/customizer/acrylic/layouts/layout-3-collage.svg',
    layoutType: 'threeCollage',
    frames: [
      { id: 'image-1', label: 'Image 1', dimension: 'Top Large', aspectRatio: 'w-full h-full' },
      { id: 'image-2', label: 'Image 2', dimension: 'Bottom Left', aspectRatio: 'w-full h-full' },
      { id: 'image-3', label: 'Image 3', dimension: 'Bottom Right', aspectRatio: 'w-full h-full' }
    ]
  }
];

export interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  layoutId: string;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  defaultText?: string;
  image: string;
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'tmpl-clean-gallery',
    name: 'Gallery Crystal Pure',
    description: 'Frameless optical acrylic with crystal clear edges.',
    layoutId: 'layout-1-single',
    borderWidth: 0,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    image: '/assets/customizer/acrylic/finishes/high-gloss.svg'
  },
  {
    id: 'tmpl-modern-gold',
    name: 'Modern Gold Bevel',
    description: 'Gold framed border with elegant contrast.',
    layoutId: 'layout-1-single',
    borderWidth: 6,
    borderColor: '#D4AF37',
    backgroundColor: '#000000',
    defaultText: 'Captured Moments',
    image: '/assets/customizer/acrylic/frames/gold-frame.svg'
  },
  {
    id: 'tmpl-duo-harmony',
    name: 'Duo Memory Harmony',
    description: 'Balanced dual portrait storytelling layout.',
    layoutId: 'layout-2-vertical',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    defaultText: 'Together Forever',
    image: '/assets/customizer/acrylic/frames/white-frame.svg'
  },
  {
    id: 'tmpl-family-trio',
    name: 'Family Heritage Trio',
    description: 'Centerpiece wall display layout for family memories.',
    layoutId: 'layout-3-wall',
    borderWidth: 0,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    defaultText: 'Our Family Story',
    image: '/assets/customizer/acrylic/products/acrylic-wall-art.jpg'
  },
  {
    id: 'tmpl-quad-story',
    name: 'Quadrant Collage Grid',
    description: 'Square 4-photo montage on luminous clear acrylic.',
    layoutId: 'layout-4-grid',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F8FAFC',
    image: '/assets/customizer/acrylic/products/acrylic-collage.jpg'
  }
];

export type AcrylicHardwareType =
  | 'hooks-hanging'
  | 'ready-to-hang'
  | 'no-hooks'
  | 'sawtooth-hanger'
  | 'easel-back'
  | 'nail-free-hook'
  | 'standoff-mounts';

export interface HardwareOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const HARDWARE_OPTIONS: HardwareOption[] = [
  {
    id: 'hooks-hanging',
    name: 'Hooks for Hanging',
    price: 0,
    description: 'Twin self-levelling hanging hooks included at no charge.',
    image: '/assets/customizer/acrylic/hardware/hooks-hanging.svg'
  },
  {
    id: 'ready-to-hang',
    name: 'Ready to Hang Cleat',
    price: 0,
    description: 'Pre-installed recessed French cleat wall hanger.',
    image: '/assets/customizer/acrylic/hardware/ready-to-hang.svg'
  },
  {
    id: 'no-hooks',
    name: 'Without Base / No Hooks',
    price: 0,
    description: 'Clean unmounted acrylic panel for custom installation.',
    image: '/assets/customizer/acrylic/hardware/no-hooks.svg'
  },
  {
    id: 'sawtooth-hanger',
    name: 'Sawtooth Hanger',
    price: 25.00,
    description: 'Heavy-duty brass sawtooth hanger attached to rear backing.',
    image: '/assets/customizer/acrylic/hardware/sawtooth-hanger.svg'
  },
  {
    id: 'easel-back',
    name: 'Easel Back / Stand',
    price: 49.00,
    description: 'Foldable tabletop stand for desk, shelf, and mantle display.',
    image: '/assets/customizer/acrylic/hardware/easel-back.svg'
  },
  {
    id: 'nail-free-hook',
    name: 'Nail Free Hook',
    price: 49.00,
    description: 'Damage-free adhesive wall hook with high weight capacity.',
    image: '/assets/customizer/acrylic/hardware/nail-free-hook.svg'
  },
  {
    id: 'standoff-mounts',
    name: 'Chrome Standoffs',
    price: 199.00,
    description: '4 architectural brushed chrome corner standoff bolts.',
    image: '/assets/customizer/acrylic/hardware/standoff-mounts.svg'
  }
];

const HARDWARE_ALIAS_MAP: Record<string, string> = {
  'no-hardware': 'no-hooks',
  'wall-mount': 'hooks-hanging',
  'standoff-mount': 'standoff-mounts',
  'floating-mount': 'ready-to-hang',
  'adhesive-mount': 'nail-free-hook',
  'stand-table-mount': 'easel-back',
  'hanging-hardware': 'sawtooth-hanger'
};

export function normalizeAcrylicHardwareId(hardwareId?: string | null): string {
  if (!hardwareId) return 'hooks-hanging';
  const mapped = HARDWARE_ALIAS_MAP[hardwareId] || hardwareId;
  if (HARDWARE_OPTIONS.some((h) => h.id === mapped)) {
    return mapped;
  }
  return 'hooks-hanging';
}

export const normalizeHardwareId = normalizeAcrylicHardwareId;

export function getCompatibleHardwareForProduct(productId: string): HardwareOption[] {
  const allowedIds =
    AcrylicHardwareConfig[productId] || ALL_ACRYLIC_HARDWARE_IDS;
  const resolved = allowedIds
    .map((id) => HARDWARE_OPTIONS.find((h) => h.id === id))
    .filter((h): h is HardwareOption => Boolean(h));
  return resolved.length > 0 ? resolved : HARDWARE_OPTIONS;
}

/**
 * Returns normalized (0..100) mounting coordinates that strictly stay inside
 * the safe boundary of the given Acrylic shape geometry.
 */
export function getHardwarePointsForShape(shapeId: string): Array<{ x: number; y: number }> {
  switch (shapeId) {
    case 'shape-circle':
      // 4 points along a circle of radius 38% at 45°, 135°, 225°, 315° (well inside r=50%)
      return [
        { x: 23, y: 23 },
        { x: 77, y: 23 },
        { x: 23, y: 77 },
        { x: 77, y: 77 }
      ];
    case 'shape-oval':
      // 4 points inside elliptical boundary
      return [
        { x: 22, y: 26 },
        { x: 78, y: 26 },
        { x: 22, y: 74 },
        { x: 78, y: 74 }
      ];
    case 'shape-heart':
      // 4 points strictly inside the upper lobes and mid-lower body of the heart contour
      return [
        { x: 26, y: 24 },
        { x: 74, y: 24 },
        { x: 36, y: 56 },
        { x: 64, y: 56 }
      ];
    case 'shape-hexagon':
      // 4 points inset along the top and bottom horizontal vertices of the hexagon
      return [
        { x: 29, y: 12 },
        { x: 71, y: 12 },
        { x: 29, y: 88 },
        { x: 71, y: 88 }
      ];
    case 'shape-rounded-rect':
      return [
        { x: 10, y: 10 },
        { x: 90, y: 10 },
        { x: 10, y: 90 },
        { x: 90, y: 90 }
      ];
    case 'shape-square':
    case 'shape-rectangle':
    case 'shape-landscape':
    case 'shape-portrait':
    default:
      return [
        { x: 8, y: 8 },
        { x: 92, y: 8 },
        { x: 8, y: 92 },
        { x: 92, y: 92 }
      ];
  }
}

export interface DisplayOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  {
    id: 'display-tabletop',
    name: 'Tabletop Display',
    price: 0,
    description: 'Optimized for desk, shelf, or mantle display.',
    image: '/assets/customizer/acrylic/hardware/no-hooks.svg'
  },
  {
    id: 'display-wall-cleat',
    name: 'Floating Wall Cleat',
    price: 149.00,
    description: 'Suspends acrylic 0.75" away from the wall with soft ambient shadow.',
    image: '/assets/customizer/acrylic/hardware/ready-to-hang.svg'
  },
  {
    id: 'display-standoff',
    name: 'Standoff Corner Bolts',
    price: 199.00,
    description: 'Four pre-drilled corner holes with premium metal chrome spacers.',
    image: '/assets/customizer/acrylic/hardware/standoff-mounts.svg'
  }
];

export interface FinishOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'high-gloss',
    name: 'High Gloss Clear',
    price: 0,
    description: 'Direct optical crystal finish with unmatched vibrancy & 3D depth.',
    image: '/assets/customizer/acrylic/finishes/high-gloss.svg'
  },
  {
    id: 'anti-glare',
    name: 'Anti-Glare Matte',
    price: 180.00,
    description: 'Velvet soft matte surface reducing reflection from bright lights & windows.',
    image: '/assets/customizer/acrylic/finishes/anti-glare.svg'
  },
  {
    id: 'frosted-backing',
    name: 'Frosted Backing',
    price: 150.00,
    description: 'Soft diffused translucency for gentle light transmission.',
    image: '/assets/customizer/acrylic/finishes/frosted-backing.svg'
  },
  {
    id: 'diamond-bevel',
    name: 'Diamond Beveled Edge',
    price: 220.00,
    description: 'Hand-polished 45-degree prism beveled luxury perimeter edge.',
    image: '/assets/customizer/acrylic/finishes/diamond-bevel.svg'
  }
];

export interface FrameOption {
  id: string;
  name: string;
  price: number;
  image: string;
  borderCss: string;
  color: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'no-frame',
    name: 'No Frame (Frameless)',
    price: 0,
    image: '/assets/customizer/acrylic/frames/no-frame.svg',
    borderCss: 'none',
    color: 'transparent'
  },
  {
    id: 'black-frame',
    name: 'Modern Black Frame',
    price: 350.00,
    image: '/assets/customizer/acrylic/frames/black-frame.svg',
    borderCss: '12px solid #18181b',
    color: '#18181b'
  },
  {
    id: 'gold-frame',
    name: 'Brushed Gold Frame',
    price: 450.00,
    image: '/assets/customizer/acrylic/frames/gold-frame.svg',
    borderCss: '12px solid #d4af37',
    color: '#d4af37'
  },
  {
    id: 'white-frame',
    name: 'Gallery White Frame',
    price: 350.00,
    image: '/assets/customizer/acrylic/frames/white-frame.svg',
    borderCss: '12px solid #ffffff',
    color: '#ffffff'
  },
  {
    id: 'wood-frame',
    name: 'Natural Oak Frame',
    price: 490.00,
    image: '/assets/customizer/acrylic/frames/wood-frame.svg',
    borderCss: '12px solid #92400e',
    color: '#92400e'
  }
];

export type ColorFilterType = 'original' | 'sepia' | 'grayscale';

export interface ColorFinishOption {
  id: ColorFilterType;
  label: string;
  tag: string;
  cssFilter: string;
  defaultImg: string;
}

export const COLOR_FINISH_OPTIONS: ColorFinishOption[] = [
  {
    id: 'original',
    label: 'Original',
    tag: 'FREE!',
    cssFilter: 'none',
    defaultImg: '/assets/customizer/acrylic/products/acrylic-photo-panel.jpg'
  },
  {
    id: 'sepia',
    label: 'Sepia',
    tag: 'FREE!',
    cssFilter: 'sepia(0.85) contrast(1.1) brightness(0.95)',
    defaultImg: '/assets/customizer/acrylic/products/acrylic-photo-panel.jpg'
  },
  {
    id: 'grayscale',
    label: 'GrayScale',
    tag: 'FREE!',
    cssFilter: 'grayscale(100%) contrast(1.05)',
    defaultImg: '/assets/customizer/acrylic/products/acrylic-photo-panel.jpg'
  }
];

export interface TypographyOption {
  id: string;
  name: string;
  fontFamily: string;
  previewSample: string;
  category: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  {
    id: 'modern-sans',
    name: 'Modern Sans',
    fontFamily: 'Arial, sans-serif',
    previewSample: 'Aa',
    category: 'Sans-Serif'
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    fontFamily: 'Georgia, serif',
    previewSample: 'Aa',
    category: 'Serif'
  },
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    fontFamily: '"Times New Roman", Times, serif',
    previewSample: 'Aa',
    category: 'Serif'
  },
  {
    id: 'elegant-script',
    name: 'Elegant Display',
    fontFamily: '"Playfair Display", serif',
    previewSample: 'Aa',
    category: 'Display'
  },
  {
    id: 'clean-tech',
    name: 'Clean Tech',
    fontFamily: '"Trebuchet MS", sans-serif',
    previewSample: 'Aa',
    category: 'Clean'
  },
  {
    id: 'monospaced',
    name: 'Typewriter Mono',
    fontFamily: '"Courier New", Courier, monospace',
    previewSample: 'Aa',
    category: 'Monospace'
  }
];

export const ACRYLIC_BACKGROUNDS = [
  { id: 'transparent', label: 'Transparent (Clear Optical)', hex: 'transparent' },
  { id: 'white', label: 'Solid White Opaque Backing', hex: '#FFFFFF' },
  { id: 'black', label: 'Solid Black Opaque Backing', hex: '#000000' },
  { id: 'frosted', label: 'Frosted Translucent Backing', hex: 'rgba(255, 255, 255, 0.65)' }
];

export const ACRYLIC_BORDER_WIDTHS = [
  { id: 'none', label: 'No Border', widthPx: 0 },
  { id: 'thin', label: 'Thin (3mm)', widthPx: 3 },
  { id: 'medium', label: 'Medium (6mm)', widthPx: 6 },
  { id: 'thick', label: 'Thick (12mm)', widthPx: 12 }
];

export const ACRYLIC_BORDER_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Silver', hex: '#94A3B8' }
];

export const THICKNESS_OPTIONS = [
  { id: '3mm', label: '3mm Lightweight Cast Acrylic', price: 0 },
  { id: '5mm', label: '5mm Standard Studio Acrylic', price: 150.00 },
  { id: '8mm', label: '8mm Premium Optical Cast Acrylic', price: 250.00 },
  { id: '18mm', label: '18mm Heavy Block Acrylic', price: 450.00 }
];

export const PAPER_OPTIONS = [
  { id: 'white-luster', label: 'White Luster Photo Paper', price: 0 },
  { id: 'metallic-pearl', label: 'Metallic Pearl Paper', price: 180.00 }
];

export const FONT_OPTIONS = [
  { label: 'Playfair Display (Elegant Serif)', value: '"Playfair Display", Georgia, serif' },
  { label: 'Montserrat (Modern Geometric)', value: 'Montserrat, sans-serif' },
  { label: 'Great Vibes (Romantic Script)', value: '"Great Vibes", cursive' },
  { label: 'Cinzel (Classic Roman)', value: 'Cinzel, serif' },
  { label: 'Dancing Script (Casual Script)', value: '"Dancing Script", cursive' },
  { label: 'Oswald (Bold Headline)', value: 'Oswald, sans-serif' },
  { label: 'Inter (Clean UI Sans)', value: 'Inter, sans-serif' },
  { label: 'Georgia (Classic Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman (Editorial)', value: '"Times New Roman", Times, serif' },
  { label: 'Arial (Modern Sans)', value: 'Arial, sans-serif' },
  { label: 'Courier New (Typewriter)', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana (Clean Geometric)', value: 'Verdana, Geneva, sans-serif' }
];

export const TEXT_COLOR_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#0E4A93' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Orange', hex: '#E8752A' },
  { name: 'Green', hex: '#16A34A' }
];

export * from './acrylicClipartData';

export const CLIPART_CATEGORIES: Record<string, string[]> = {
  'Celebration': ['🎉', '🍾', '🥂', '🎂', '🎈', '🎆', '🎊', '🎇', '🍰', '🥳'],
  'Love & Wedding': ['❤️', '💖', '💍', '💐', '👰', '🤵', '💌', '🌹', '🕊️', '💞'],
  'Family & Kids': ['👨‍👩‍👧', '👶', '🧸', '👣', '🏡', '🐾', '🌸', '☀️', '🍼', '🐣'],
  'Decorative': ['⭐', '✨', '💎', '👑', '🌿', '🌙', '🦋', '🍀', '🕯️', '🪄'],
  'Business': ['🏆', '🎖️', '💼', '🏢', '🏷️', '🌟', '🛡️', '💯', '🔖', '📐']
};

// ============================================================================
// TEMPLATE SELECTION DATA (20 Curated Acrylic Templates)
// ============================================================================

export type TemplateCategory = 
  | 'All'
  | 'Wedding'
  | 'Love'
  | 'Family'
  | 'Music'
  | 'Quotes'
  | 'Baby'
  | 'Travel'
  | 'Minimal';

export interface AcrylicTemplateItem {
  id: string;
  name: string;
  category: 'Wedding' | 'Love' | 'Family' | 'Music' | 'Quotes' | 'Baby' | 'Travel' | 'Minimal';
  secondaryCategories?: ('Wedding' | 'Love' | 'Family' | 'Music' | 'Quotes' | 'Baby' | 'Travel' | 'Minimal')[];
  image: string;
  description: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultLyrics: string[];
  layoutId?: string;
  borderWidth?: number;
  borderColor?: string;
  compatibleProducts?: string[];
}

export const ACRYLIC_TEMPLATES: AcrylicTemplateItem[] = [
  // Wedding (1 - 6)
  {
    id: 'wedding-picture-lyrics',
    name: 'Personalized Wedding Picture Acrylic Prints With Song Lyrics',
    category: 'Wedding',
    secondaryCategories: ['Music', 'Love'],
    image: '/assets/customizer/acrylic/templates/wedding-picture-lyrics.svg',
    description: 'Cherish your wedding photograph side-by-side with your favorite song lyrics on optical acrylic.',
    defaultTitle: 'All of Me Loves All of You',
    defaultSubtitle: 'Emma & James • October 14, 2024',
    defaultLyrics: [
      "'Cause all of me loves all of you",
      "All your curves and all your edges",
      "All your perfect imperfections",
      "Give your all to me, I'll give my all to you"
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'wedding-first-dance',
    name: 'Wedding First Dance Song Lyrics',
    category: 'Wedding',
    secondaryCategories: ['Music', 'Love'],
    image: '/assets/customizer/acrylic/templates/wedding-first-dance.svg',
    description: 'Immortalize that unforgettable first dance moment with the song that brought you together.',
    defaultTitle: 'Our First Dance',
    defaultSubtitle: 'At Last • Etta James',
    defaultLyrics: [
      "At last, my love has come along",
      "My lonely days are over",
      "And life is like a song",
      "For you are mine at last"
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'wedding-vows-art',
    name: 'Turn Wedding Vows into Wall Art',
    category: 'Wedding',
    secondaryCategories: ['Love', 'Quotes'],
    image: '/assets/customizer/acrylic/templates/wedding-vows-art.svg',
    description: 'Your sacred promises etched with clarity on floating crystal acrylic wall art.',
    defaultTitle: 'Our Sacred Vows',
    defaultSubtitle: 'To Have and to Hold • Forever and Always',
    defaultLyrics: [
      "I promise to love you unconditionally,",
      "To support your wildest dreams, and",
      "To walk beside you through every season of life.",
      "Today, tomorrow, and for all eternity."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'first-anniversary-songs',
    name: 'First Marriage Anniversary Songs on Acrylic',
    category: 'Wedding',
    secondaryCategories: ['Music', 'Love'],
    image: '/assets/customizer/acrylic/templates/first-anniversary-songs.svg',
    description: 'Celebrate 365 days of marriage with your soundtrack commemorated in acrylic brilliance.',
    defaultTitle: '1st Marriage Anniversary',
    defaultSubtitle: '365 Days of Loving You • 2023 - 2024',
    defaultLyrics: [
      "Every single day with you is better than the day before.",
      "Here is to 365 days down and forever to go.",
      "Happy 1st Anniversary, my soulmate."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'personalized-wedding-gift',
    name: 'Personalized Wedding Gift Acrylic Prints',
    category: 'Wedding',
    secondaryCategories: ['Love'],
    image: '/assets/customizer/acrylic/templates/personalized-wedding-gift.svg',
    description: 'A timeless heirloom gift for newlyweds showcasing ceremony details and heartfelt blessings.',
    defaultTitle: 'Mr. & Mrs. Sharma',
    defaultSubtitle: 'Established November 24, 2024',
    defaultLyrics: [
      "Two lives, two hearts, joined together in friendship,",
      "United forever in love.",
      "May your love grow stronger with each passing day."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'wedding-vows-acrylic',
    name: 'Acrylic Wall Art - Wedding Vows Acrylic',
    category: 'Wedding',
    secondaryCategories: ['Love', 'Quotes'],
    image: '/assets/customizer/acrylic/templates/wedding-vows-acrylic.svg',
    description: 'Grand format acrylic wall display featuring vows inscribed beside your high-res wedding portrait.',
    defaultTitle: 'Wedding Vows on Acrylic',
    defaultSubtitle: 'Bound in Love & Faith',
    defaultLyrics: [
      "Where you go I will go, and where you stay I will stay.",
      "Your people shall be my people.",
      "Entreat me not to leave you, or to return from following after you."
    ],
    layoutId: 'layout-1-single'
  },

  // Music (7 - 9)
  {
    id: 'forever-young-lyrics',
    name: 'Forever Young Bob Dylan Lyrics on Acrylic',
    category: 'Music',
    secondaryCategories: ['Quotes', 'Minimal'],
    image: '/assets/customizer/acrylic/templates/forever-young-lyrics.svg',
    description: 'Bob Dylan’s poetic masterpiece printed over luminous acrylic with warm golden accents.',
    defaultTitle: 'Forever Young',
    defaultSubtitle: 'Bob Dylan • Planet Waves (1974)',
    defaultLyrics: [
      "May your hands always be busy",
      "May your feet always be swift",
      "May you have a strong foundation",
      "When the winds of changes shift"
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'sheet-music-art',
    name: 'Sheet Music Acrylic Print – Wall Art',
    category: 'Music',
    secondaryCategories: ['Minimal'],
    image: '/assets/customizer/acrylic/templates/sheet-music-art.svg',
    description: 'Authentic notation score combined with your chosen melody printed onto sleek acrylic.',
    defaultTitle: 'Canon in D Major',
    defaultSubtitle: 'Johann Pachelbel • Classical Repertoire',
    defaultLyrics: [
      "𝄞 ♩ ♪ ♫ ♬ ♭ ♮ ♯",
      "Allegro Moderato - In Three Parts",
      "Harmonic Counterpoint in Floating Crystal Glass"
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'lyrics-on-acrylic',
    name: 'Lyrics on Acrylic',
    category: 'Music',
    secondaryCategories: ['Love', 'Quotes'],
    image: '/assets/customizer/acrylic/templates/lyrics-on-acrylic.svg',
    description: 'Turn your favorite song into visual poetry on premium optical acrylic glass.',
    defaultTitle: 'Soundtrack of Our Lives',
    defaultSubtitle: 'Personalized Melody & Words',
    defaultLyrics: [
      "You're the melody in the quiet,",
      "The harmony in the rush,",
      "And the song I'll sing forever."
    ],
    layoutId: 'layout-1-single'
  },

  // Love (10 - 12)
  {
    id: 'love-quotes-acrylic',
    name: 'Love Quotes Acrylic Print',
    category: 'Love',
    secondaryCategories: ['Quotes', 'Minimal'],
    image: '/assets/customizer/acrylic/templates/love-quotes-acrylic.svg',
    description: 'Romantic declaration featuring classic script typography and crystal acrylic clarity.',
    defaultTitle: 'I Have Found the One',
    defaultSubtitle: 'Song of Solomon 3:4',
    defaultLyrics: [
      "In all the world, there is no heart for me like yours.",
      "In all the world, there is no love for you like mine.",
      "Forever grateful for every moment with you."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'anniversary-timeline',
    name: 'Anniversary Timeline Acrylic',
    category: 'Love',
    secondaryCategories: ['Wedding', 'Family'],
    image: '/assets/customizer/acrylic/templates/anniversary-timeline.svg',
    description: 'Milestone timeline marking your relationship journey from first date to forever.',
    defaultTitle: 'Our Love Story',
    defaultSubtitle: 'A Journey of Two Hearts',
    defaultLyrics: [
      "• First Date: July 18, 2018",
      "• She Said Yes: October 10, 2021",
      "• Best Day Ever: November 24, 2024",
      "The best is yet to come."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'romantic-quote-acrylic',
    name: 'Romantic Quote Acrylic',
    category: 'Love',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/romantic-quote-acrylic.svg',
    description: 'Elegant literary quote rendered in delicate serif typeface on sparkling acrylic.',
    defaultTitle: 'Soulmates',
    defaultSubtitle: 'Emily Brontë • Wuthering Heights',
    defaultLyrics: [
      "Whatever our souls are made of,",
      "His and mine are the same.",
      "You are my sun, my moon, and all of my stars."
    ],
    layoutId: 'layout-1-single'
  },

  // Family (13 - 15)
  {
    id: 'family-photo-collage',
    name: 'Family Photo Collage',
    category: 'Family',
    secondaryCategories: ['Love'],
    image: '/assets/customizer/acrylic/templates/family-photo-collage.svg',
    description: 'Curated photo arrangement celebrating generations of laughter and family bonds.',
    defaultTitle: 'The Sharma Family',
    defaultSubtitle: 'Together is our favorite place to be',
    defaultLyrics: [
      "Family: where life begins and love never ends.",
      "Bound by heartstrings that never break."
    ],
    layoutId: 'layout-4-grid'
  },
  {
    id: 'family-memories-acrylic',
    name: 'Family Memories Acrylic',
    category: 'Family',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/family-memories-acrylic.svg',
    description: 'Cherished memories preserved in pristine scratch-resistant sub-surface acrylic.',
    defaultTitle: 'Cherished Memories',
    defaultSubtitle: 'Generations of Love & Joy',
    defaultLyrics: [
      "Having somewhere to go is home.",
      "Having someone to love is family.",
      "Having both is a blessing."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'family-celebration-acrylic',
    name: 'Family Celebration Acrylic',
    category: 'Family',
    secondaryCategories: ['Love'],
    image: '/assets/customizer/acrylic/templates/family-celebration-acrylic.svg',
    description: 'Vibrant tribute to reunions, milestone birthdays, and festive family gatherings.',
    defaultTitle: 'Celebrate Everyday Moments',
    defaultSubtitle: 'Laughter • Joy • Togetherness',
    defaultLyrics: [
      "The love of a family is life's greatest blessing.",
      "Cherish every smile, hold every memory close."
    ],
    layoutId: 'layout-1-single'
  },

  // Baby (16)
  {
    id: 'baby-milestone-acrylic',
    name: 'Baby Milestone Acrylic Print',
    category: 'Baby',
    secondaryCategories: ['Family'],
    image: '/assets/customizer/acrylic/templates/baby-milestone-acrylic.svg',
    description: 'Nursery statement art capturing birth stats, footprints, and newborn serenity.',
    defaultTitle: 'Welcome Little One',
    defaultSubtitle: 'Aarav Sharma • Born Nov 12, 2024',
    defaultLyrics: [
      "Ten little fingers, ten little toes,",
      "With love and grace, our family grows.",
      "Weight: 7 lbs 4 oz • Length: 20 inches"
    ],
    layoutId: 'layout-1-single'
  },

  // Travel (17)
  {
    id: 'travel-memories-acrylic',
    name: 'Travel Memories Acrylic Print',
    category: 'Travel',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/travel-memories-acrylic.svg',
    description: 'High-gloss panoramic capture of bucket-list destinations, mountain peaks, and voyages.',
    defaultTitle: 'Wanderlust & Wild Air',
    defaultSubtitle: 'Kashmir • Leh Ladakh Expedition 2024',
    defaultLyrics: [
      "Not all those who wander are lost.",
      "The mountains are calling, and I must go.",
      "Adventure is the best way to learn."
    ],
    layoutId: 'layout-1-single'
  },

  // Minimal (18 - 20)
  {
    id: 'minimal-text-art',
    name: 'Minimal Text Art',
    category: 'Minimal',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/minimal-text-art.svg',
    description: 'Architectural Scandinavian typography with high optical transparency and clean lines.',
    defaultTitle: 'SIMPLICITY',
    defaultSubtitle: 'The Ultimate Sophistication',
    defaultLyrics: [
      "LESS IS MORE",
      "Purity in design, clarity in glass.",
      "Modern interior accent."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'custom-text-design',
    name: 'Custom Text Design',
    category: 'Minimal',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/custom-text-design.svg',
    description: 'Statement typography artwork on optical crystal acrylic tailored to your chosen mantra.',
    defaultTitle: 'CREATE YOUR STORY',
    defaultSubtitle: 'Custom Typography on Acrylic',
    defaultLyrics: [
      "Design your personal statement piece.",
      "Crisp UV cured typography floating in crystal."
    ],
    layoutId: 'layout-1-single'
  },
  {
    id: 'minimal-quote-acrylic',
    name: 'Minimal Quote Acrylic',
    category: 'Minimal',
    secondaryCategories: ['Quotes'],
    image: '/assets/customizer/acrylic/templates/minimal-quote-acrylic.svg',
    description: 'Contemporary minimalist typographic block delivering daily peace and mindful inspiration.',
    defaultTitle: 'Breathe. Trust. Let Go.',
    defaultSubtitle: 'Daily Mindful Inspiration',
    defaultLyrics: [
      "Be still, and know that you are right",
      "Where you need to be today.",
      "Peace begins within."
    ],
    layoutId: 'layout-1-single'
  }
];

// ============================================================================
// ACRYLIC EDGE WRAP / FINISH (WRAP & BORDER Tab)
// ============================================================================

export interface AcrylicEdgeWrap {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  borderWidth?: number;
  borderColor?: string;
  isClearEdge?: boolean;
}

export const ACRYLIC_EDGE_WRAPS: AcrylicEdgeWrap[] = [
  {
    id: 'full-bleed',
    name: 'Full Bleed',
    price: 0,
    description: 'Image reaches the complete printable area to the edge.',
    image: '/assets/customizer/acrylic/wraps/full-bleed.svg',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  {
    id: 'clear-edge',
    name: 'Clear Edge',
    price: 0,
    description: 'Full image with crystal-clear diamond-polished beveled refraction edge.',
    image: '/assets/customizer/acrylic/wraps/clear-edge.svg',
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    isClearEdge: true
  },
  {
    id: 'white-border',
    name: 'White Border',
    price: 120,
    description: '18px studio white border framing the photograph inside the shape.',
    image: '/assets/customizer/acrylic/wraps/white-border.svg',
    borderWidth: 16,
    borderColor: '#FFFFFF'
  },
  {
    id: 'black-border',
    name: 'Black Border',
    price: 120,
    description: '18px gallery black border following the shape contour.',
    image: '/assets/customizer/acrylic/wraps/black-border.svg',
    borderWidth: 16,
    borderColor: '#0F172A'
  },
  {
    id: 'no-wrap',
    name: 'No Wrap',
    price: 0,
    description: 'Standard laser-cut clean acrylic edge.',
    image: '/assets/customizer/acrylic/wraps/no-wrap.svg',
    borderWidth: 0,
    borderColor: 'transparent'
  }
];

export const ACRYLIC_WRAP_OPTIONS = ACRYLIC_EDGE_WRAPS;
export type AcrylicWrapOption = AcrylicEdgeWrap;

// ============================================================================
// ACRYLIC SHAPES (SHAPE Tab - Full 23 Shapes Suite)
// ============================================================================

export interface AcrylicShapeOption {
  id: string;
  shapeType:
    | 'square'
    | 'rectangle'
    | 'landscape'
    | 'portrait'
    | 'circle'
    | 'oval'
    | 'roundedRectangle'
    | 'heart'
    | 'hexagon';
  name: string;
  category: 'basic' | 'special' | 'decorative';
  description: string;
  aspectClass: string;
  aspectRatio: number;
  borderRadiusClass: string;
  clipPathStyle: string;
  svgClipId?: string;
  isSingleDimension: boolean;
  image: string;
  priceAddon: number;
}

export const ACRYLIC_SHAPES: AcrylicShapeOption[] = [
  {
    id: 'shape-square',
    shapeType: 'square',
    name: 'Square',
    category: 'basic',
    description: 'Classic symmetrical modern acrylic format.',
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-xl',
    clipPathStyle: 'inset(0 round 14px)',
    isSingleDimension: true,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-rectangle',
    shapeType: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    description: 'Timeless proportional display for all photography.',
    aspectClass: 'aspect-[4/3]',
    aspectRatio: 1.333,
    borderRadiusClass: 'rounded-xl',
    clipPathStyle: 'inset(0 round 14px)',
    isSingleDimension: false,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-landscape',
    shapeType: 'landscape',
    name: 'Landscape',
    category: 'basic',
    description: 'Panoramic horizontal presentation for vistas & groups.',
    aspectClass: 'aspect-[16/10]',
    aspectRatio: 1.6,
    borderRadiusClass: 'rounded-xl',
    clipPathStyle: 'inset(0 round 14px)',
    isSingleDimension: false,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-portrait',
    shapeType: 'portrait',
    name: 'Portrait',
    category: 'basic',
    description: 'Vertical focal format for individual & couple portraits.',
    aspectClass: 'aspect-[3/4]',
    aspectRatio: 0.75,
    borderRadiusClass: 'rounded-xl',
    clipPathStyle: 'inset(0 round 14px)',
    isSingleDimension: false,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-circle',
    shapeType: 'circle',
    name: 'Circle',
    category: 'basic',
    description: 'Curved circular optical acrylic with laser-cut perimeter.',
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-full',
    clipPathStyle: 'circle(50% at 50% 50%)',
    isSingleDimension: true,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-oval',
    shapeType: 'oval',
    name: 'Oval',
    category: 'basic',
    description: 'Graceful elliptical acrylic silhouette for classic wall art.',
    aspectClass: 'aspect-[4/3]',
    aspectRatio: 1.333,
    borderRadiusClass: 'rounded-[50%]',
    clipPathStyle: 'ellipse(50% 38% at 50% 50%)',
    isSingleDimension: false,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-rounded-rect',
    shapeType: 'roundedRectangle',
    name: 'Rounded Rectangle',
    category: 'basic',
    description: 'Smooth 28mm radius crystal corners for modern displays.',
    aspectClass: 'aspect-[4/3]',
    aspectRatio: 1.333,
    borderRadiusClass: 'rounded-3xl',
    clipPathStyle: 'inset(0 round 28px)',
    isSingleDimension: false,
    image: '',
    priceAddon: 0
  },
  {
    id: 'shape-heart',
    shapeType: 'heart',
    name: 'Heart',
    category: 'special',
    description: 'Romantic heart contour for weddings & anniversaries.',
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-none',
    svgClipId: 'acrylic-clip-shape-heart',
    clipPathStyle: 'url(#acrylic-clip-shape-heart)',
    isSingleDimension: true,
    image: '',
    priceAddon: 150
  },
  {
    id: 'shape-hexagon',
    shapeType: 'hexagon',
    name: 'Hexagon',
    category: 'special',
    description: 'Geometric 6-sided honeycomb block for modern clusters.',
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-none',
    clipPathStyle: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    isSingleDimension: true,
    image: '',
    priceAddon: 150
  }
];

export const ACRYLIC_9_SHAPES = ACRYLIC_SHAPES;

export function getCompatibleShapesForProduct(productId: string): AcrylicShapeOption[] {
  const allowedIds =
    AcrylicProductShapeConfig[productId] || AcrylicProductShapeConfig['acrylic-photo-panel'];
  return allowedIds
    .map((id) => ACRYLIC_SHAPES.find((s) => s.id === id))
    .filter((s): s is AcrylicShapeOption => Boolean(s));
}

// ============================================================================
// SHAPE-SPECIFIC SIZES & COMPATIBILITY HELPERS (Sections 8 & 9)
// ============================================================================

export function getSizesForShape(shapeId: string, productTypeId: string = 'acrylic-photo-panel'): SizeOption[] {
  const requiredSquareSizes: SizeOption[] = [
    {
      id: `${shapeId}-10x10`,
      productTypeId,
      category: 'SQUARE',
      label: '10" × 10"',
      dimensionsSummary: '10" × 10"',
      widthInches: 10,
      heightInches: 10,
      price: 799,
      aspectClass: 'aspect-square',
      image: '/assets/customizer/acrylic/sizes/square.svg'
    },
    {
      id: `${shapeId}-16x16`,
      productTypeId,
      category: 'SQUARE',
      label: '16" × 16"',
      dimensionsSummary: '16" × 16"',
      widthInches: 16,
      heightInches: 16,
      price: 1799,
      aspectClass: 'aspect-square',
      image: '/assets/customizer/acrylic/sizes/square.svg'
    },
    {
      id: `${shapeId}-18x18`,
      productTypeId,
      category: 'SQUARE',
      label: '18" × 18"',
      dimensionsSummary: '18" × 18"',
      widthInches: 18,
      heightInches: 18,
      price: 2299,
      aspectClass: 'aspect-square',
      image: '/assets/customizer/acrylic/sizes/square.svg'
    },
    {
      id: `${shapeId}-20x20`,
      productTypeId,
      category: 'SQUARE',
      label: '20" × 20"',
      dimensionsSummary: '20" × 20"',
      widthInches: 20,
      heightInches: 20,
      price: 2799,
      aspectClass: 'aspect-square',
      image: '/assets/customizer/acrylic/sizes/square.svg'
    }
  ];

  const ensureSquareSizes = (baseSizes: SizeOption[]): SizeOption[] => {
    const existingLabels = new Set(baseSizes.map((s) => s.label));
    const missing = requiredSquareSizes.filter((sq) => !existingLabels.has(sq.label));
    return [...baseSizes, ...missing];
  };

  // 1. Single dimension shapes (Circle, Heart, Star, Scalloped, Organic Blob)
  if (['shape-circle', 'shape-heart', 'shape-star', 'shape-scalloped', 'shape-organic-blob'].includes(shapeId)) {
    const isCircle = shapeId === 'shape-circle';
    const isHeart = shapeId === 'shape-heart';
    const prefix = isCircle ? 'Circle' : isHeart ? 'Heart' : 'Size';
    return ensureSquareSizes([
      {
        id: `${shapeId}-8x8`,
        productTypeId,
        category: 'SQUARE',
        label: '8" × 8"',
        dimensionsSummary: '8" × 8"',
        widthInches: 8,
        heightInches: 8,
        price: 799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-10x10`,
        productTypeId,
        category: 'SQUARE',
        label: '10" × 10"',
        dimensionsSummary: '10" × 10"',
        widthInches: 10,
        heightInches: 10,
        price: 799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-12x12`,
        productTypeId,
        category: 'SQUARE',
        label: '12" × 12"',
        dimensionsSummary: '12" × 12"',
        widthInches: 12,
        heightInches: 12,
        price: 999,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-16x16`,
        productTypeId,
        category: 'SQUARE',
        label: '16" × 16"',
        dimensionsSummary: '16" × 16"',
        widthInches: 16,
        heightInches: 16,
        price: 1799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-18x18`,
        productTypeId,
        category: 'SQUARE',
        label: '18" × 18"',
        dimensionsSummary: '18" × 18"',
        widthInches: 18,
        heightInches: 18,
        price: 2299,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-20x20`,
        productTypeId,
        category: 'SQUARE',
        label: '20" × 20"',
        dimensionsSummary: '20" × 20"',
        widthInches: 20,
        heightInches: 20,
        price: 2799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-4`,
        productTypeId,
        category: 'RECOMMENDED',
        label: `4" ${prefix}`,
        dimensionsSummary: '4" Dia',
        widthInches: 4,
        heightInches: 4,
        price: 399,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-6`,
        productTypeId,
        category: 'RECOMMENDED',
        label: `6" ${prefix}`,
        dimensionsSummary: '6" Dia',
        widthInches: 6,
        heightInches: 6,
        price: 549,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      }
    ]);
  }

  // 2. Square & symmetrical polygons (Square, Hexagon, Octagon, Diamond, Triangle)
  if (['shape-square', 'shape-hexagon', 'shape-octagon', 'shape-diamond', 'shape-triangle'].includes(shapeId)) {
    return [
      {
        id: `${shapeId}-4x4`,
        productTypeId,
        category: 'SQUARE',
        label: '4" × 4"',
        dimensionsSummary: '4" × 4"',
        widthInches: 4,
        heightInches: 4,
        price: 499,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-6x6`,
        productTypeId,
        category: 'SQUARE',
        label: '6" × 6"',
        dimensionsSummary: '6" × 6"',
        widthInches: 6,
        heightInches: 6,
        price: 649,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-8x8`,
        productTypeId,
        category: 'SQUARE',
        label: '8" × 8"',
        dimensionsSummary: '8" × 8"',
        widthInches: 8,
        heightInches: 8,
        price: 799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-10x10`,
        productTypeId,
        category: 'SQUARE',
        label: '10" × 10"',
        dimensionsSummary: '10" × 10"',
        widthInches: 10,
        heightInches: 10,
        price: 799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-12x12`,
        productTypeId,
        category: 'SQUARE',
        label: '12" × 12"',
        dimensionsSummary: '12" × 12"',
        widthInches: 12,
        heightInches: 12,
        price: 999,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-16x16`,
        productTypeId,
        category: 'SQUARE',
        label: '16" × 16"',
        dimensionsSummary: '16" × 16"',
        widthInches: 16,
        heightInches: 16,
        price: 1799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-18x18`,
        productTypeId,
        category: 'SQUARE',
        label: '18" × 18"',
        dimensionsSummary: '18" × 18"',
        widthInches: 18,
        heightInches: 18,
        price: 2299,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      },
      {
        id: `${shapeId}-20x20`,
        productTypeId,
        category: 'SQUARE',
        label: '20" × 20"',
        dimensionsSummary: '20" × 20"',
        widthInches: 20,
        heightInches: 20,
        price: 2799,
        aspectClass: 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      }
    ];
  }

  // 3. Landscape & horizontal rectangular shapes
  if (['shape-landscape', 'shape-rounded-rect', 'shape-cloud', 'shape-speech-bubble', 'shape-photo-frame'].includes(shapeId)) {
    return ensureSquareSizes([
      {
        id: `${shapeId}-12x8`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '12" × 8"',
        dimensionsSummary: '12" × 8"',
        widthInches: 12,
        heightInches: 8,
        price: 1099,
        aspectClass: 'aspect-[12/8]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: `${shapeId}-8x6`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '8" × 6"',
        dimensionsSummary: '8" × 6"',
        widthInches: 8,
        heightInches: 6,
        price: 699,
        aspectClass: 'aspect-[4/3]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: `${shapeId}-10x8`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '10" × 8"',
        dimensionsSummary: '10" × 8"',
        widthInches: 10,
        heightInches: 8,
        price: 899,
        aspectClass: 'aspect-[10/8]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: `${shapeId}-16x10`,
        productTypeId,
        category: 'LARGE',
        label: '16" × 10"',
        dimensionsSummary: '16" × 10"',
        widthInches: 16,
        heightInches: 10,
        price: 1799,
        aspectClass: 'aspect-[16/10]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      },
      {
        id: `${shapeId}-18x12`,
        productTypeId,
        category: 'LARGE',
        label: '18" × 12"',
        dimensionsSummary: '18" × 12"',
        widthInches: 18,
        heightInches: 12,
        price: 2199,
        aspectClass: 'aspect-[18/12]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      },
      {
        id: `${shapeId}-20x16`,
        productTypeId,
        category: 'LARGE',
        label: '20" × 16"',
        dimensionsSummary: '20" × 16"',
        widthInches: 20,
        heightInches: 16,
        price: 2499,
        aspectClass: 'aspect-[5/4]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      }
    ]);
  }

  // 4. Portrait & vertical shapes (Portrait, Arch, Tag, Polaroid)
  if (['shape-portrait', 'shape-arch', 'shape-tag', 'shape-polaroid'].includes(shapeId)) {
    return ensureSquareSizes([
      {
        id: `${shapeId}-8x10`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '8" × 10"',
        dimensionsSummary: '8" × 10"',
        widthInches: 8,
        heightInches: 10,
        price: 899,
        aspectClass: 'aspect-[4/5]',
        image: '/assets/customizer/acrylic/sizes/portrait.svg'
      },
      {
        id: `${shapeId}-6x8`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '6" × 8"',
        dimensionsSummary: '6" × 8"',
        widthInches: 6,
        heightInches: 8,
        price: 699,
        aspectClass: 'aspect-[3/4]',
        image: '/assets/customizer/acrylic/sizes/portrait.svg'
      },
      {
        id: `${shapeId}-10x12`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '10" × 12"',
        dimensionsSummary: '10" × 12"',
        widthInches: 10,
        heightInches: 12,
        price: 1199,
        aspectClass: 'aspect-[5/6]',
        image: '/assets/customizer/acrylic/sizes/portrait.svg'
      },
      {
        id: `${shapeId}-12x16`,
        productTypeId,
        category: 'LARGE',
        label: '12" × 16"',
        dimensionsSummary: '12" × 16"',
        widthInches: 12,
        heightInches: 16,
        price: 1799,
        aspectClass: 'aspect-[3/4]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      },
      {
        id: `${shapeId}-16x20`,
        productTypeId,
        category: 'LARGE',
        label: '16" × 20"',
        dimensionsSummary: '16" × 20"',
        widthInches: 16,
        heightInches: 20,
        price: 2499,
        aspectClass: 'aspect-[4/5]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      }
    ]);
  }

  // 5. Oval shapes
  if (shapeId === 'shape-oval') {
    return ensureSquareSizes([
      {
        id: 'oval-8x5',
        productTypeId,
        category: 'RECOMMENDED',
        label: '8" × 5"',
        dimensionsSummary: '8" × 5"',
        widthInches: 8,
        heightInches: 5,
        price: 799,
        aspectClass: 'aspect-[8/5]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: 'oval-6x4',
        productTypeId,
        category: 'RECOMMENDED',
        label: '6" × 4"',
        dimensionsSummary: '6" × 4"',
        widthInches: 6,
        heightInches: 4,
        price: 599,
        aspectClass: 'aspect-[3/2]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: 'oval-10x7',
        productTypeId,
        category: 'RECOMMENDED',
        label: '10" × 7"',
        dimensionsSummary: '10" × 7"',
        widthInches: 10,
        heightInches: 7,
        price: 1099,
        aspectClass: 'aspect-[10/7]',
        image: '/assets/customizer/acrylic/sizes/landscape.svg'
      },
      {
        id: 'oval-12x8',
        productTypeId,
        category: 'LARGE',
        label: '12" × 8"',
        dimensionsSummary: '12" × 8"',
        widthInches: 12,
        heightInches: 8,
        price: 1499,
        aspectClass: 'aspect-[12/8]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      },
      {
        id: 'oval-16x10',
        productTypeId,
        category: 'LARGE',
        label: '16" × 10"',
        dimensionsSummary: '16" × 10"',
        widthInches: 16,
        heightInches: 10,
        price: 2199,
        aspectClass: 'aspect-[16/10]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      }
    ]);
  }

  // 6. Capsule & Ticket elongated shapes (2:1)
  if (['shape-capsule', 'shape-ticket'].includes(shapeId)) {
    return ensureSquareSizes([
      {
        id: `${shapeId}-8x4`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '8" × 4"',
        dimensionsSummary: '8" × 4"',
        widthInches: 8,
        heightInches: 4,
        price: 649,
        aspectClass: 'aspect-[2/1]',
        image: '/assets/customizer/acrylic/sizes/panoramic.svg'
      },
      {
        id: `${shapeId}-10x5`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '10" × 5"',
        dimensionsSummary: '10" × 5"',
        widthInches: 10,
        heightInches: 5,
        price: 899,
        aspectClass: 'aspect-[2/1]',
        image: '/assets/customizer/acrylic/sizes/panoramic.svg'
      },
      {
        id: `${shapeId}-12x6`,
        productTypeId,
        category: 'RECOMMENDED',
        label: '12" × 6"',
        dimensionsSummary: '12" × 6"',
        widthInches: 12,
        heightInches: 6,
        price: 1249,
        aspectClass: 'aspect-[2/1]',
        image: '/assets/customizer/acrylic/sizes/panoramic.svg'
      },
      {
        id: `${shapeId}-16x8`,
        productTypeId,
        category: 'LARGE',
        label: '16" × 8"',
        dimensionsSummary: '16" × 8"',
        widthInches: 16,
        heightInches: 8,
        price: 1899,
        aspectClass: 'aspect-[2/1]',
        image: '/assets/customizer/acrylic/sizes/large.svg'
      }
    ]);
  }

  // 7. Default standard Rectangle (starts with 12" × 8" rectangle, includes all standard rectangular & square sizes)
  return ensureSquareSizes([
    {
      id: `${shapeId}-12x8`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '12" × 8"',
      dimensionsSummary: '12" × 8"',
      widthInches: 12,
      heightInches: 8,
      price: 899,
      aspectClass: 'aspect-[3/2]',
      image: '/assets/customizer/acrylic/sizes/landscape.svg'
    },
    {
      id: `${shapeId}-8x10`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '8" × 10"',
      dimensionsSummary: '8" × 10"',
      widthInches: 8,
      heightInches: 10,
      price: 799,
      aspectClass: 'aspect-[4/5]',
      image: '/assets/customizer/acrylic/sizes/portrait.svg'
    },
    {
      id: `${shapeId}-10x12`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '10" × 12"',
      dimensionsSummary: '10" × 12"',
      widthInches: 10,
      heightInches: 12,
      price: 1199,
      aspectClass: 'aspect-[5/6]',
      image: '/assets/customizer/acrylic/sizes/portrait.svg'
    },
    {
      id: `${shapeId}-12x18`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '12" × 18"',
      dimensionsSummary: '12" × 18"',
      widthInches: 12,
      heightInches: 18,
      price: 1699,
      aspectClass: 'aspect-[2/3]',
      image: '/assets/customizer/acrylic/sizes/portrait.svg'
    },
    {
      id: `${shapeId}-16x20`,
      productTypeId,
      category: 'LARGE',
      label: '16" × 20"',
      dimensionsSummary: '16" × 20"',
      widthInches: 16,
      heightInches: 20,
      price: 2499,
      aspectClass: 'aspect-[4/5]',
      image: '/assets/customizer/acrylic/sizes/large.svg'
    },
    {
      id: `${shapeId}-20x16`,
      productTypeId,
      category: 'LARGE',
      label: '20" × 16"',
      dimensionsSummary: '20" × 16"',
      widthInches: 20,
      heightInches: 16,
      price: 2499,
      aspectClass: 'aspect-[5/4]',
      image: '/assets/customizer/acrylic/sizes/landscape.svg'
    },
    {
      id: `${shapeId}-16x24`,
      productTypeId,
      category: 'LARGE',
      label: '16" × 24"',
      dimensionsSummary: '16" × 24"',
      widthInches: 16,
      heightInches: 24,
      price: 2799,
      aspectClass: 'aspect-[2/3]',
      image: '/assets/customizer/acrylic/sizes/large.svg'
    },
    {
      id: `${shapeId}-4x6`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '4" × 6"',
      dimensionsSummary: '4" × 6"',
      widthInches: 4,
      heightInches: 6,
      price: 449,
      aspectClass: 'aspect-[2/3]',
      image: '/assets/customizer/acrylic/sizes/portrait.svg'
    },
    {
      id: `${shapeId}-5x7`,
      productTypeId,
      category: 'RECOMMENDED',
      label: '5" × 7"',
      dimensionsSummary: '5" × 7"',
      widthInches: 5,
      heightInches: 7,
      price: 599,
      aspectClass: 'aspect-[5/7]',
      image: '/assets/customizer/acrylic/sizes/portrait.svg'
    }
  ]);
}


// ============================================================================
// 11 ACRYLIC DESIGN OVERLAYS (Section 10, 11, 12)
// ============================================================================

export type DesignCategory =
  | 'Minimal'
  | 'Wedding'
  | 'Love'
  | 'Birthday'
  | 'Family'
  | 'Baby'
  | 'Travel'
  | 'Festival'
  | 'Quotes'
  | 'Floral'
  | 'Modern';

export const DESIGN_CATEGORIES: DesignCategory[] = [
  'Minimal',
  'Wedding',
  'Love',
  'Birthday',
  'Family',
  'Baby',
  'Travel',
  'Festival',
  'Quotes',
  'Floral',
  'Modern'
];

export interface AcrylicDesignOverlay {
  id: string;
  name: string;
  category: DesignCategory;
  image: string;
  description: string;
  renderOverlaySvg: string;
}

export const ACRYLIC_DESIGN_OVERLAYS: AcrylicDesignOverlay[] = [
  // 1. Minimal
  {
    id: 'minimal-thin-frame',
    name: 'Thin Inset Frame',
    category: 'Minimal',
    image: '/assets/customizer/acrylic/designs/minimal-thin-frame.svg',
    description: 'Delicate geometric inset frame with diamond corner marks.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="#FFFFFF" stroke-width="0.8" opacity="0.85" />
      <polygon points="6,6 8,8 6,10 4,8" fill="#FFFFFF" opacity="0.9" />
      <polygon points="94,6 96,8 94,10 92,8" fill="#FFFFFF" opacity="0.9" />
      <polygon points="6,94 8,96 6,98 4,96" fill="#FFFFFF" opacity="0.9" />
      <polygon points="94,94 96,96 94,98 92,96" fill="#FFFFFF" opacity="0.9" />
    </svg>`
  },
  {
    id: 'minimal-monogram',
    name: 'Modern Monogram',
    category: 'Minimal',
    image: '/assets/customizer/acrylic/designs/minimal-monogram.svg',
    description: 'Clean architectural hairline with floating circular emblem.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <line x1="15" y1="88" x2="42" y2="88" stroke="#FFFFFF" stroke-width="0.8" opacity="0.8" />
      <circle cx="50" cy="88" r="5" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.9" />
      <text x="50" y="90" fill="#FFFFFF" font-family="Georgia, serif" font-size="5" font-weight="bold" text-anchor="middle">M</text>
      <line x1="58" y1="88" x2="85" y2="88" stroke="#FFFFFF" stroke-width="0.8" opacity="0.8" />
    </svg>`
  },

  // 2. Wedding
  {
    id: 'wedding-forever',
    name: 'Together Forever',
    category: 'Wedding',
    image: '/assets/customizer/acrylic/designs/wedding-forever.svg',
    description: 'Romantic calligraphy banner with laurel botanical flourish.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 25 78 Q 50 72 75 78" fill="none" stroke="#FDE047" stroke-width="1" opacity="0.85"/>
      <text x="50" y="86" fill="#FFFFFF" font-family="Georgia, serif" font-style="italic" font-size="5.5" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">Together Forever</text>
    </svg>`
  },
  {
    id: 'wedding-rings',
    name: 'Entwined Rings',
    category: 'Wedding',
    image: '/assets/customizer/acrylic/designs/wedding-rings.svg',
    description: 'Twin gold wedding rings with modern Mr & Mrs caption.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <circle cx="46" cy="18" r="6" fill="none" stroke="#FBBF24" stroke-width="1.2" opacity="0.9"/>
      <circle cx="54" cy="18" r="6" fill="none" stroke="#FDE047" stroke-width="1.2" opacity="0.9"/>
      <text x="50" y="32" fill="#FFFFFF" font-family="sans-serif" font-size="4.5" font-weight="bold" letter-spacing="1" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">MR &amp; MRS</text>
    </svg>`
  },

  // 3. Love
  {
    id: 'love-infinity',
    name: 'Forever & Always',
    category: 'Love',
    image: '/assets/customizer/acrylic/designs/love-infinity.svg',
    description: 'Infinity loop merging into heart with sweet cursive script.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 40 82 C 32 75, 28 89, 40 89 C 48 89, 52 75, 60 75 C 72 75, 68 89, 60 89 C 52 89, 48 75, 40 82 Z" fill="none" stroke="#FECDD3" stroke-width="1.5" opacity="0.9"/>
      <text x="50" y="95" fill="#FFFFFF" font-family="Georgia, serif" font-style="italic" font-size="4.5" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">Forever &amp; Always</text>
    </svg>`
  },
  {
    id: 'love-hearts-trail',
    name: 'Sweet Hearts',
    category: 'Love',
    image: '/assets/customizer/acrylic/designs/love-hearts-trail.svg',
    description: 'Floating twin heart constellation with delicate script.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 50 15 C 45 10, 40 14, 40 18 C 40 23, 50 28, 50 28 C 50 28, 60 23, 60 18 C 60 14, 55 10, 50 15 Z" fill="#F43F5E" opacity="0.85" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>
      <text x="50" y="36" fill="#FFFFFF" font-family="Georgia, serif" font-style="italic" font-size="5" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">You &amp; Me</text>
    </svg>`
  },

  // 4. Birthday
  {
    id: 'birthday-celebration',
    name: 'Happy Birthday',
    category: 'Birthday',
    image: '/assets/customizer/acrylic/designs/birthday-celebration.svg',
    description: 'Celebratory festive stars with bold birthday title.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <text x="50" y="82" fill="#FFFFFF" font-family="sans-serif" font-size="4.5" font-weight="900" letter-spacing="1" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">HAPPY</text>
      <text x="50" y="90" fill="#FDE047" font-family="Georgia, serif" font-style="italic" font-size="6.5" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">Birthday</text>
    </svg>`
  },

  // 5. Family
  {
    id: 'family-roots',
    name: 'Our Happy Place',
    category: 'Family',
    image: '/assets/customizer/acrylic/designs/family-roots.svg',
    description: 'Home emblem with warm family typography.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 50 14 L 40 22 L 44 22 L 44 32 L 56 32 L 56 22 L 60 22 Z" fill="#FDE68A" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"/>
      <text x="50" y="40" fill="#FFFFFF" font-family="sans-serif" font-size="4.2" font-weight="bold" letter-spacing="1" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">OUR HAPPY PLACE</text>
    </svg>`
  },

  // 6. Baby
  {
    id: 'baby-miracle',
    name: 'Welcome Little One',
    category: 'Baby',
    image: '/assets/customizer/acrylic/designs/baby-miracle.svg',
    description: 'Gentle crescent moon and nursery stars.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 50 12 C 43 12, 38 18, 38 25 C 38 32, 45 38, 52 38 C 47 34, 46 27, 49 21 C 51 15, 57 13, 50 12 Z" fill="#FDE047" opacity="0.9" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"/>
      <text x="50" y="46" fill="#BAE6FD" font-family="Georgia, serif" font-style="italic" font-size="4.8" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">Welcome Little One</text>
    </svg>`
  },

  // 7. Travel
  {
    id: 'travel-wanderlust',
    name: 'Wanderlust Compass',
    category: 'Travel',
    image: '/assets/customizer/acrylic/designs/travel-wanderlust.svg',
    description: 'Fine travel compass rose with coordinates typography.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <circle cx="50" cy="80" r="9" fill="none" stroke="#38BDF8" stroke-width="0.8" opacity="0.85"/>
      <polygon points="50,73 52,80 50,79 48,80" fill="#F43F5E"/>
      <polygon points="50,87 52,80 50,81 48,80" fill="#E2E8F0"/>
      <text x="50" y="95" fill="#FFFFFF" font-family="sans-serif" font-size="4.2" font-weight="bold" letter-spacing="1" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">WANDERLUST</text>
    </svg>`
  },

  // 8. Festival
  {
    id: 'festival-diwali',
    name: 'Radiant Mandala',
    category: 'Festival',
    image: '/assets/customizer/acrylic/designs/festival-diwali.svg',
    description: 'Festive corner mandala pattern in luminous golden accents.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <circle cx="50" cy="18" r="8" fill="none" stroke="#FDE047" stroke-width="0.7" stroke-dasharray="1 1" opacity="0.9"/>
      <circle cx="50" cy="18" r="4.5" fill="none" stroke="#F43F5E" stroke-width="0.8" opacity="0.9"/>
      <text x="50" y="32" fill="#FDE047" font-family="Georgia, serif" font-size="4.5" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">Festive Celebration</text>
    </svg>`
  },

  // 9. Quotes
  {
    id: 'quote-moments',
    name: 'Collect Moments',
    category: 'Quotes',
    image: '/assets/customizer/acrylic/designs/quote-moments.svg',
    description: 'Classic quote styling: Collect moments, not things.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <text x="50" y="82" fill="#FFFFFF" font-family="Georgia, serif" font-style="italic" font-size="4.8" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">“Collect moments,</text>
      <text x="50" y="89" fill="#FDE68A" font-family="Georgia, serif" font-style="italic" font-size="4.8" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">not things”</text>
    </svg>`
  },

  // 10. Floral
  {
    id: 'floral-botanical',
    name: 'Botanical Eucalyptus',
    category: 'Floral',
    image: '/assets/customizer/acrylic/designs/floral-botanical.svg',
    description: 'Handcrafted eucalyptus branch bordering the top edge.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <path d="M 15 12 Q 50 20 85 12" fill="none" stroke="#6EE7B7" stroke-width="0.8" opacity="0.85"/>
      <ellipse cx="30" cy="13" rx="2.5" ry="4.5" fill="#A7F3D0" opacity="0.75" transform="rotate(-30 30 13)"/>
      <ellipse cx="45" cy="16" rx="2.5" ry="4.5" fill="#A7F3D0" opacity="0.75" transform="rotate(30 45 16)"/>
      <ellipse cx="60" cy="15" rx="2.5" ry="4.5" fill="#A7F3D0" opacity="0.75" transform="rotate(-30 60 15)"/>
      <ellipse cx="75" cy="13" rx="2.5" ry="4.5" fill="#A7F3D0" opacity="0.75" transform="rotate(30 75 13)"/>
    </svg>`
  },

  // 11. Modern
  {
    id: 'modern-geometry',
    name: 'Dual Line Minimal',
    category: 'Modern',
    image: '/assets/customizer/acrylic/designs/modern-geometry.svg',
    description: 'Clean parallel geometric borders with sharp modern balance.',
    renderOverlaySvg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full">
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="#A1A1AA" stroke-width="0.6" opacity="0.7"/>
      <rect x="8" y="8" width="84" height="84" fill="none" stroke="#FFFFFF" stroke-width="0.9" opacity="0.85"/>
      <text x="50" y="95" fill="#FFFFFF" font-family="sans-serif" font-size="3.8" font-weight="900" letter-spacing="2" text-anchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))">CONTEMPORARY</text>
    </svg>`
  }
];
