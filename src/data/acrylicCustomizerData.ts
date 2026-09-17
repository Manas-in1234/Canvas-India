// ============================================================================
// ACRYLIC CUSTOMIZER DATA & CONFIGURATION CONSTANTS
// Strictly Acrylic-only options (No canvas wrap, wood, or metal customizer options)
// Image-first architecture: All options include local image examples
// ============================================================================

export type ToolbarTab = 
  | 'PRODUCTS' 
  | 'UPLOAD' 
  | 'SELECT SIZE' 
  | 'LAYOUTS & DESIGNS' 
  | 'SHAPE'
  | 'WRAP & BORDER'
  | 'HARDWARE & FINISH' 
  | 'OPTIONS'
  | 'TEMPLATES';

export interface AcrylicProductType {
  id: string;
  name: string;
  startingPrice: number;
  image: string;
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
    image: '/assets/customizer/acrylic/products/acrylic-photo-block.jpg',
    iconType: 'block',
    panelsCount: 1,
    description: 'Freestanding, solid optical acrylic block with 3D crystal depth.',
    defaultSizeOptionId: 'sq-4x4'
  },
  {
    id: 'acrylic-photo-panel',
    name: 'Acrylic Photo Panel',
    startingPrice: 355.00,
    image: '/assets/customizer/acrylic/products/acrylic-photo-panel.jpg',
    iconType: 'panel',
    panelsCount: 1,
    description: 'Modern slim acrylic panel with diamond polished border.',
    defaultSizeOptionId: 'sq-8x8'
  },
  {
    id: 'acrylic-wall-art',
    name: 'Acrylic Wall Art',
    startingPrice: 2338.90,
    image: '/assets/customizer/acrylic/products/acrylic-wall-art.jpg',
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'rec-12x18'
  },
  {
    id: 'acrylic-print',
    name: 'Acrylic Print',
    startingPrice: 355.00,
    image: '/assets/customizer/acrylic/products/acrylic-print.jpg',
    iconType: 'print',
    panelsCount: 1,
    description: 'Vibrant direct UV sub-surface print on crystal acrylic.',
    defaultSizeOptionId: 'sq-8x8'
  },
  {
    id: 'acrylic-collage',
    name: 'Acrylic Collage',
    startingPrice: 426.00,
    image: '/assets/customizer/acrylic/products/acrylic-collage.jpg',
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on acrylic.',
    defaultSizeOptionId: 'sq-12x12'
  },
  {
    id: 'acrylic-split',
    name: 'Acrylic Split Panel',
    startingPrice: 674.50,
    image: '/assets/customizer/acrylic/products/acrylic-split-panel.jpg',
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photograph split seamlessly across 3 triptych panels.',
    defaultSizeOptionId: 'pan-12x36'
  },
  {
    id: 'acrylic-signage',
    name: 'Acrylic Signage',
    startingPrice: 799.00,
    image: '/assets/customizer/acrylic/products/acrylic-signage.jpg',
    iconType: 'signage',
    panelsCount: 1,
    description: 'Professional architectural logo and nameplate display with standoff bolts.',
    defaultSizeOptionId: 'rec-12x18'
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
    name: '2 Columns',
    photoCount: 2,
    description: 'Dual portrait panels side-by-side.',
    layoutType: '2-vertical',
    frames: [
      { id: 'f0', label: 'Frame 1', dimension: 'Half Width', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2', dimension: 'Half Width', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-2-horizontal',
    name: '2 Rows',
    photoCount: 2,
    description: 'Dual horizontal panels stacked vertically.',
    layoutType: '2-horizontal',
    frames: [
      { id: 'f0', label: 'Frame 1', dimension: 'Half Height', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2', dimension: 'Half Height', aspectRatio: 'w-full h-full' }
    ]
  },
  {
    id: 'layout-2-offset',
    name: '2 Offset Panes',
    photoCount: 2,
    description: 'Staggered dual acrylic panels with dynamic spacing.',
    layoutType: '2-offset',
    frames: [
      { id: 'f0', label: 'Frame 1', dimension: 'Offset Left', aspectRatio: 'w-full h-full' },
      { id: 'f1', label: 'Frame 2', dimension: 'Offset Right', aspectRatio: 'w-full h-full' }
    ]
  },

  // 3 Photos
  {
    id: 'layout-3-wall',
    name: 'Wall Trio',
    photoCount: 3,
    description: 'Hero landscape panel above two complementary square panels.',
    layoutType: '3-wall',
    frames: [
      { id: 'f0', label: 'Hero Top', dimension: '12" × 18"', aspectRatio: 'aspect-[18/12]' },
      { id: 'f1', label: 'Bottom Left', dimension: '10" × 8"', aspectRatio: 'aspect-[8/10]' },
      { id: 'f2', label: 'Bottom Right', dimension: '10" × 8"', aspectRatio: 'aspect-[8/10]' }
    ]
  },
  {
    id: 'layout-3-triptych',
    name: '3-Piece Triptych',
    photoCount: 3,
    description: 'Panoramic composition split across 3 equal vertical panels.',
    layoutType: '3-triptych',
    frames: [
      { id: 'f0', label: 'Panel 1', dimension: '1/3 Width', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Panel 2', dimension: '1/3 Width', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Panel 3', dimension: '1/3 Width', aspectRatio: 'h-full w-full' }
    ]
  },
  {
    id: 'layout-3-split-left',
    name: '1 Left + 2 Right',
    photoCount: 3,
    description: 'Large portrait frame with two stacked frames on right.',
    layoutType: '3-split-left',
    frames: [
      { id: 'f0', label: 'Hero Left', dimension: 'Large Portrait', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Top Right', dimension: 'Small Landscape', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Bottom Right', dimension: 'Small Landscape', aspectRatio: 'h-full w-full' }
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
      { id: 'f0', label: 'Top Left', dimension: 'Quadrant 1', aspectRatio: 'aspect-square' },
      { id: 'f1', label: 'Top Right', dimension: 'Quadrant 2', aspectRatio: 'aspect-square' },
      { id: 'f2', label: 'Bottom Left', dimension: 'Quadrant 3', aspectRatio: 'aspect-square' },
      { id: 'f3', label: 'Bottom Right', dimension: 'Quadrant 4', aspectRatio: 'aspect-square' }
    ]
  },
  {
    id: 'layout-4-hero-right',
    name: '1 Hero + 3 Mini',
    photoCount: 4,
    description: 'Dominant hero portrait photo with 3 stacked mini moments.',
    layoutType: '4-hero-right',
    frames: [
      { id: 'f0', label: 'Hero Left', dimension: 'Main Feature', aspectRatio: 'h-full w-full' },
      { id: 'f1', label: 'Top Right', dimension: 'Mini 1', aspectRatio: 'h-full w-full' },
      { id: 'f2', label: 'Mid Right', dimension: 'Mini 2', aspectRatio: 'h-full w-full' },
      { id: 'f3', label: 'Bottom Right', dimension: 'Mini 3', aspectRatio: 'h-full w-full' }
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
    description: 'Pre-attached dual mounting hooks for balanced wall hanging.',
    image: '/assets/customizer/acrylic/hardware/hooks-hanging.svg'
  },
  {
    id: 'ready-to-hang',
    name: 'Ready to Hang Cleat',
    price: 0,
    description: 'Precision hidden French cleat bracket for flush, floating look.',
    image: '/assets/customizer/acrylic/hardware/ready-to-hang.svg'
  },
  {
    id: 'no-hooks',
    name: 'Without Base / No Hooks',
    price: 0,
    description: 'Clean unmounted acrylic for tabletop propping or custom frames.',
    image: '/assets/customizer/acrylic/hardware/no-hooks.svg'
  },
  {
    id: 'sawtooth-hanger',
    name: 'Sawtooth Hanger',
    price: 25.00,
    description: 'Heavy duty brass sawtooth bracket installed on reverse side.',
    image: '/assets/customizer/acrylic/hardware/sawtooth-hanger.svg'
  },
  {
    id: 'easel-back',
    name: 'Easel Back / Stand',
    price: 49.00,
    description: 'Foldable acrylic kickstand for desktop, shelf & mantle display.',
    image: '/assets/customizer/acrylic/hardware/easel-back.svg'
  },
  {
    id: 'nail-free-hook',
    name: 'Nail Free Hook',
    price: 49.00,
    description: 'No-drill wall adhesive tab system with clean removal capability.',
    image: '/assets/customizer/acrylic/hardware/nail-free-hook.svg'
  },
  {
    id: 'standoff-mounts',
    name: 'Chrome Standoffs',
    price: 199.00,
    description: '4 Stainless steel brushed chrome architectural corner bolts.',
    image: '/assets/customizer/acrylic/hardware/standoff-mounts.svg'
  }
];

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
  { label: 'Arial (Modern Sans)', value: 'Arial, sans-serif' },
  { label: 'Georgia (Classic Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman (Editorial)', value: '"Times New Roman", Times, serif' },
  { label: 'Playfair Display (Elegant)', value: '"Playfair Display", serif' },
  { label: 'Trebuchet MS (Clean Tech)', value: '"Trebuchet MS", sans-serif' },
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
}

export const ACRYLIC_EDGE_WRAPS: AcrylicEdgeWrap[] = [
  {
    id: 'polished-clear',
    name: 'Polished Clear Edge',
    price: 0,
    description: 'Crystal-clear flame polished edge providing 3D optical depth and transparency.',
    image: '/assets/customizer/acrylic/wraps/polished-clear-edge.svg'
  },
  {
    id: 'diamond-beveled',
    name: 'Diamond Beveled Edge',
    price: 150,
    description: 'Precision 45° chamfered facet catching and refracting room light.',
    image: '/assets/customizer/acrylic/wraps/diamond-beveled-edge.svg'
  },
  {
    id: 'frosted-satin',
    name: 'Frosted Satin Edge',
    price: 100,
    description: 'Subtle frosted matte border perimeter for contemporary architectural appeal.',
    image: '/assets/customizer/acrylic/wraps/frosted-satin-edge.svg'
  },
  {
    id: 'flame-black',
    name: 'Flame Black Edge',
    price: 190,
    description: 'High-contrast jet black edge framing your acrylic print with sharp definition.',
    image: '/assets/customizer/acrylic/wraps/flame-black-edge.svg'
  }
];

// ============================================================================
// ACRYLIC SHAPES (SHAPE Tab)
// ============================================================================

export interface AcrylicShapeOption {
  id: string;
  name: string;
  description: string;
  aspectClass: string;
  borderRadiusClass: string;
  image: string;
}

export const ACRYLIC_SHAPES: AcrylicShapeOption[] = [
  {
    id: 'shape-square',
    name: 'Square (1:1)',
    description: 'Classic symmetrical modern acrylic block or panel.',
    aspectClass: 'aspect-square',
    borderRadiusClass: 'rounded-xl',
    image: '/assets/customizer/acrylic/shapes/shape-square.svg'
  },
  {
    id: 'shape-landscape',
    name: 'Landscape (4:3)',
    description: 'Panoramic horizontal presentation for vistas and groups.',
    aspectClass: 'aspect-[4/3]',
    borderRadiusClass: 'rounded-xl',
    image: '/assets/customizer/acrylic/shapes/shape-landscape.svg'
  },
  {
    id: 'shape-portrait',
    name: 'Portrait (3:4)',
    description: 'Vertical focal format for individual and couple photography.',
    aspectClass: 'aspect-[3/4]',
    borderRadiusClass: 'rounded-xl',
    image: '/assets/customizer/acrylic/shapes/shape-portrait.svg'
  },
  {
    id: 'shape-circle',
    name: 'Circle',
    description: 'Curved circular optical acrylic with laser-cut perimeter.',
    aspectClass: 'aspect-square',
    borderRadiusClass: 'rounded-full',
    image: '/assets/customizer/acrylic/shapes/shape-circle.svg'
  },
  {
    id: 'shape-rounded-rect',
    name: 'Rounded Rectangle',
    description: 'Smooth 30mm radius crystal corners for a sleek display.',
    aspectClass: 'aspect-[4/3]',
    borderRadiusClass: 'rounded-3xl',
    image: '/assets/customizer/acrylic/shapes/shape-rounded-rect.svg'
  }
];
