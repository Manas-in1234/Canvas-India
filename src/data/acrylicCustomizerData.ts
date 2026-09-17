// ============================================================================
// ACRYLIC CUSTOMIZER DATA & CONFIGURATION CONSTANTS
// Strictly Acrylic-only options (No canvas wrap, wood, or metal customizer options)
// ============================================================================

export type ToolbarTab = 
  | 'PRODUCTS' 
  | 'UPLOAD' 
  | 'SELECT SIZE' 
  | 'LAYOUTS & DESIGNS' 
  | 'HARDWARE & FINISH' 
  | 'OPTIONS';

export interface AcrylicProductType {
  id: string;
  name: string;
  startingPrice: number;
  iconType: 'block' | 'panel' | 'wall' | 'print' | 'collage' | 'split' | 'signage';
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
}

export const ACRYLIC_PRODUCT_TYPES: AcrylicProductType[] = [
  {
    id: 'acrylic-photo-block',
    name: 'Acrylic Photo Block',
    startingPrice: 499.00,
    iconType: 'block',
    panelsCount: 1,
    description: 'Freestanding, solid optical acrylic block with 3D crystal depth.',
    defaultSizeOptionId: 'block-6x4'
  },
  {
    id: 'acrylic-photo-panel',
    name: 'Acrylic Photo Panel',
    startingPrice: 355.00,
    iconType: 'panel',
    panelsCount: 1,
    description: 'Modern slim acrylic panel with diamond polished border.',
    defaultSizeOptionId: 'single-8x8'
  },
  {
    id: 'acrylic-wall-art',
    name: 'Acrylic Wall Art',
    startingPrice: 2338.90,
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'wd-3p-12x18-10x8'
  },
  {
    id: 'acrylic-print',
    name: 'Acrylic Print',
    startingPrice: 355.00,
    iconType: 'print',
    panelsCount: 1,
    description: 'Vibrant direct UV sub-surface print on crystal acrylic.',
    defaultSizeOptionId: 'single-8x8'
  },
  {
    id: 'acrylic-collage',
    name: 'Acrylic Collage',
    startingPrice: 426.00,
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on acrylic.',
    defaultSizeOptionId: 'col-4p-12x12'
  },
  {
    id: 'acrylic-split',
    name: 'Acrylic Split Panel',
    startingPrice: 674.50,
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photograph split seamlessly across 3 triptych panels.',
    defaultSizeOptionId: 'split-3p-36x24'
  },
  {
    id: 'acrylic-signage',
    name: 'Acrylic Signage',
    startingPrice: 799.00,
    iconType: 'signage',
    panelsCount: 1,
    description: 'Professional architectural logo and nameplate display with standoff bolts.',
    defaultSizeOptionId: 'signage-12x8'
  }
];

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
    aspectClass: 'aspect-[17/11]'
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
    aspectClass: 'aspect-[34/22]'
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
    aspectClass: 'aspect-[51/33]'
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
    aspectClass: 'aspect-[10/8]'
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
    aspectClass: 'aspect-[18/12]'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-square'
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
    aspectClass: 'aspect-[30/10]'
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
    aspectClass: 'aspect-[36/12]'
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
    aspectClass: 'aspect-[48/16]'
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
    aspectClass: 'aspect-[30/20]'
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
    aspectClass: 'aspect-[36/24]'
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
    aspectClass: 'aspect-[40/30]'
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
    aspectClass: 'aspect-[6/4]'
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
    aspectClass: 'aspect-[7/5]'
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
    aspectClass: 'aspect-[8/6]'
  }
];

export interface LayoutPreset {
  id: string;
  name: string;
  photoCount: number;
  description: string;
  layoutType: '1-single' | '2-vertical' | '2-horizontal' | '2-offset' | '3-wall' | '3-triptych' | '3-split-left' | '4-grid' | '4-hero-right' | '4-strips-h' | '4-strips-v';
  frames: Array<{
    id: string;
    label: string;
    dimension: string;
    aspectRatio: string;
  }>;
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  // 1 Photo
  {
    id: 'layout-1-single',
    name: 'Single Image',
    photoCount: 1,
    description: 'Full edge-to-edge optical clarity acrylic single print.',
    layoutType: '1-single',
    frames: [
      { id: 'f0', label: 'Main Frame', dimension: 'Edge to Edge', aspectRatio: 'w-full h-full' }
    ]
  },

  // 2 Photos
  {
    id: 'layout-2-vertical',
    name: '2 Columns Side-by-Side',
    photoCount: 2,
    description: 'Dual portrait panels side-by-side.',
    layoutType: '2-vertical',
    frames: [
      { id: 'f0', label: 'Frame 1 (Left)', dimension: 'Half Width', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2 (Right)', dimension: 'Half Width', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-2-horizontal',
    name: '2 Rows Stacked',
    photoCount: 2,
    description: 'Dual horizontal panels stacked vertically.',
    layoutType: '2-horizontal',
    frames: [
      { id: 'f0', label: 'Frame 1 (Top)', dimension: 'Half Height', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2 (Bottom)', dimension: 'Half Height', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-2-offset',
    name: '2 Offset Panes',
    photoCount: 2,
    description: 'Staggered dual acrylic panels with modern dynamic spacing.',
    layoutType: '2-offset',
    frames: [
      { id: 'f0', label: 'Frame 1 (Upper Left)', dimension: 'Offset Left', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2 (Lower Right)', dimension: 'Offset Right', aspectRatio: 'w-full h-full' }
    ]
  },

  // 3 Photos
  {
    id: 'layout-3-wall',
    name: 'Wall Art Trio (1 Top, 2 Bottom)',
    photoCount: 3,
    description: 'Hero landscape panel above two complementary square panels.',
    layoutType: '3-wall',
    frames: [
      { id: 'f0', label: 'Hero Top (1)', dimension: '12" × 18"', aspectRatio: 'aspect-[18/12]' },
      { id: 'f1', label: 'Bottom Left (2)', dimension: '10" × 8"', aspectRatio: 'aspect-[8/10]' },
      { id: 'f2', label: 'Bottom Right (3)', dimension: '10" × 8"', aspectRatio: 'aspect-[8/10]' }
    ]
  },
  {
    id: 'layout-3-triptych',
    name: '3-Piece Triptych Split',
    photoCount: 3,
    description: 'Panoramic composition split across 3 equal vertical panels.',
    layoutType: '3-triptych',
    frames: [
      { id: 'f0', label: 'Panel 1 (Left)', dimension: '1/3 Width', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Panel 2 (Center)', dimension: '1/3 Width', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Panel 3 (Right)', dimension: '1/3 Width', aspectRatio: 'h-full w-full' }
    ]
  },
  {
    id: 'layout-3-split-left',
    name: '1 Left + 2 Stacked Right',
    photoCount: 3,
    description: 'Large portrait frame on the left with two stacked frames on the right.',
    layoutType: '3-split-left',
    frames: [
      { id: 'f0', label: 'Frame 1 (Main Left)', dimension: 'Large Portrait', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Frame 2 (Top Right)', dimension: 'Small Landscape', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Frame 3 (Bottom Right)', dimension: 'Small Landscape', aspectRatio: 'h-full w-full' }
    ]
  },

  // 4 Photos
  {
    id: 'layout-4-grid',
    name: '4-Photo 2x2 Grid',
    photoCount: 4,
    description: 'Symmetric 4-quadrant square grid for story collages.',
    layoutType: '4-grid',
    frames: [
      { id: 'f0', label: 'Top Left (1)', dimension: 'Quadrant 1', aspectRatio: 'aspect-square' },
      { id: 'f1', label: 'Top Right (2)', dimension: 'Quadrant 2', aspectRatio: 'aspect-square' },
      { id: 'f2', label: 'Bottom Left (3)', dimension: 'Quadrant 3', aspectRatio: 'aspect-square' },
      { id: 'f3', label: 'Bottom Right (4)', dimension: 'Quadrant 4', aspectRatio: 'aspect-square' }
    ]
  },
  {
    id: 'layout-4-hero-right',
    name: '1 Large Hero + 3 Stacked Right',
    photoCount: 4,
    description: 'Dominant hero portrait photo accompanied by 3 stacked mini moments.',
    layoutType: '4-hero-right',
    frames: [
      { id: 'f0', label: 'Hero Left (1)', dimension: 'Main Feature', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Top Right (2)', dimension: 'Mini 1', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Mid Right (3)', dimension: 'Mini 2', aspectRatio: 'h-full w-full' },
      { id: 'f3', label: 'Bottom Right (4)', dimension: 'Mini 3', aspectRatio: 'h-full w-full' }
    ]
  },
  {
    id: 'layout-4-strips-h',
    name: '4 Horizontal Strips',
    photoCount: 4,
    description: 'Four wide panoramic cinematic strip slices.',
    layoutType: '4-strips-h',
    frames: [
      { id: 'f0', label: 'Strip 1', dimension: 'Row 1', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Strip 2', dimension: 'Row 2', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Strip 3', dimension: 'Row 3', aspectRatio: 'h-full w-full' },
      { id: 'f3', label: 'Strip 4', dimension: 'Row 4', aspectRatio: 'h-full w-full' }
    ]
  },
  {
    id: 'layout-4-strips-v',
    name: '4 Vertical Columns',
    photoCount: 4,
    description: 'Four slender vertical panels side-by-side.',
    layoutType: '4-strips-v',
    frames: [
      { id: 'f0', label: 'Col 1', dimension: 'Column 1', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Col 2', dimension: 'Column 2', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Col 3', dimension: 'Column 3', aspectRatio: 'h-full w-full' },
      { id: 'f3', label: 'Col 4', dimension: 'Column 4', aspectRatio: 'h-full w-full' }
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
  previewColor: string;
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
    previewColor: 'from-blue-500/20 to-sky-200/20'
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
    previewColor: 'from-amber-500/20 to-yellow-200/20'
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
    previewColor: 'from-rose-500/20 to-pink-200/20'
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
    previewColor: 'from-emerald-500/20 to-teal-200/20'
  },
  {
    id: 'tmpl-quad-story',
    name: 'Quadrant Collage Grid',
    description: 'Square 4-photo montage on luminous clear acrylic.',
    layoutId: 'layout-4-grid',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F8FAFC',
    previewColor: 'from-indigo-500/20 to-purple-200/20'
  }
];

export interface HardwareOption {
  id: string;
  name: string;
  price: number;
  description: string;
  iconName: 'hooks' | 'wall-cleat' | 'no-hooks' | 'sawtooth' | 'easel' | 'nail-free' | 'standoff';
}

export const HARDWARE_OPTIONS: HardwareOption[] = [
  {
    id: 'hooks-hanging',
    name: 'Hooks for Hanging',
    price: 0,
    description: 'Pre-attached dual mounting hooks for balanced wall hanging.',
    iconName: 'hooks'
  },
  {
    id: 'ready-to-hang',
    name: 'Ready to Hang Wall Bracket',
    price: 0,
    description: 'Precision hidden French cleat bracket for flush, floating look.',
    iconName: 'wall-cleat'
  },
  {
    id: 'no-hooks',
    name: 'Without Base / No Hooks',
    price: 0,
    description: 'Clean unmounted acrylic for tabletop propping or custom frames.',
    iconName: 'no-hooks'
  },
  {
    id: 'sawtooth-hanger',
    name: 'Sawtooth Hanger',
    price: 25.00,
    description: 'Heavy duty brass sawtooth bracket installed on reverse side.',
    iconName: 'sawtooth'
  },
  {
    id: 'easel-back',
    name: 'Easel Back / Desktop Stand',
    price: 49.00,
    description: 'Foldable acrylic kickstand for desktop, shelf & mantle display.',
    iconName: 'easel'
  },
  {
    id: 'nail-free-hook',
    name: 'Nail Free Adhesive Hook',
    price: 49.00,
    description: 'No-drill wall adhesive tab system with clean removal capability.',
    iconName: 'nail-free'
  },
  {
    id: 'standoff-mounts',
    name: 'Chrome Floating Standoffs',
    price: 199.00,
    description: '4 Stainless steel brushed chrome architectural corner bolts.',
    iconName: 'standoff'
  }
];

export interface DisplayOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const DISPLAY_OPTIONS: DisplayOption[] = [
  {
    id: 'display-tabletop',
    name: 'Tabletop Freestanding Display',
    price: 0,
    description: 'Optimized for desk, shelf, or mantle display.'
  },
  {
    id: 'display-wall-cleat',
    name: 'Floating Wall Cleat System',
    price: 149.00,
    description: 'Suspends acrylic 0.75" away from the wall with soft ambient shadow.'
  },
  {
    id: 'display-standoff',
    name: 'Architectural Standoff Bolts',
    price: 199.00,
    description: 'Four pre-drilled corner holes with premium metal chrome spacers.'
  }
];

export interface FinishOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'high-gloss',
    name: 'High Gloss Clear',
    price: 0,
    description: 'Direct optical crystal finish with unmatched vibrancy & 3D depth.'
  },
  {
    id: 'anti-glare',
    name: 'Anti-Glare Matte',
    price: 180.00,
    description: 'Velvet soft matte surface reducing reflection from bright lights & windows.'
  },
  {
    id: 'frosted-backing',
    name: 'Frosted Backing',
    price: 150.00,
    description: 'Soft diffused translucency for gentle light transmission.'
  },
  {
    id: 'diamond-bevel',
    name: 'Diamond Beveled Edge',
    price: 220.00,
    description: 'Hand-polished 45-degree prism beveled luxury perimeter edge.'
  }
];

export type ColorFilterType = 'original' | 'sepia' | 'grayscale';

export interface ColorFinishOption {
  id: ColorFilterType;
  label: string;
  tag: string;
  cssFilter: string;
  sampleImg: string;
}

export const COLOR_FINISH_OPTIONS: ColorFinishOption[] = [
  {
    id: 'original',
    label: 'Original',
    tag: 'FREE!',
    cssFilter: 'none',
    sampleImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'sepia',
    label: 'Sepia',
    tag: 'FREE!',
    cssFilter: 'sepia(0.85) contrast(1.1) brightness(0.95)',
    sampleImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80'
  },
  {
    id: 'grayscale',
    label: 'GrayScale',
    tag: 'FREE!',
    cssFilter: 'grayscale(100%) contrast(1.05)',
    sampleImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80'
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
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' }
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

export const CLIPART_CATEGORIES: Record<string, string[]> = {
  'Celebration': ['🎉', '🍾', '🥂', '🎂', '🎈', '🎆', '🎊', '🎇', '🍰', '🥳'],
  'Love & Wedding': ['❤️', '💖', '💍', '💐', '👰', '🤵', '💌', '🌹', '🕊️', '💞'],
  'Family & Kids': ['👨‍👩‍👧', '👶', '🧸', '👣', '🏡', '🐾', '🌸', '☀️', '🍼', '🐣'],
  'Decorative': ['⭐', '✨', '💎', '👑', '🌿', '🌙', '🦋', '🍀', '🕯️', '🪄'],
  'Business': ['🏆', '🎖️', '💼', '🏢', '🏷️', '🌟', '🛡️', '💯', '🔖', '📐']
};
