// ============================================================================
// CANVAS CUSTOMIZER DATA & CONFIGURATION CONSTANTS
// Mirrors acrylicCustomizerData.ts exactly so the Canvas and Acrylic customizer
// pages share one UI/UX. Generic, material-agnostic building blocks (shape
// geometry + clip-paths, layout grids, typography, fonts, text colors, clipart,
// design overlays/templates, borders, backgrounds, frames) are re-exported
// as-is from the acrylic data module so both pages stay in perfect sync.
// Only the genuinely canvas-specific catalog (products, hardware, display,
// finish, wrap/border, wrap-depth, material grade) is defined here.
// ============================================================================

import {
  ACRYLIC_SHAPES,
  ACRYLIC_TEMPLATES,
  type AcrylicShapeOption,
  type AcrylicTemplateItem,
  type HardwareOption,
  type DisplayOption,
  type FinishOption
} from './acrylicCustomizerData';

export {
  // Toolbar / size / layout mechanics - fully generic
  SIZE_OPTIONS,
  getSizesForShape,
  getLayoutSlots,
  LAYOUT_PRESETS,
  DESIGN_TEMPLATES,
  // Frame, color-filter, typography, font, text-color, clipart - material-agnostic
  FRAME_OPTIONS,
  COLOR_FINISH_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  FONT_OPTIONS,
  TEXT_COLOR_PRESETS,
  CLIPART_CATEGORIES,
  // Design overlay gallery - fully generic
  DESIGN_CATEGORIES,
  ACRYLIC_DESIGN_OVERLAYS as CANVAS_DESIGN_OVERLAYS
} from './acrylicCustomizerData';

export type {
  ToolbarTab,
  SizeCategory,
  SizeOption,
  LayoutType,
  LayoutSlotDefinition,
  LayoutPreset,
  DesignTemplate,
  FrameOption,
  ColorFilterType,
  ColorFinishOption,
  TypographyOption,
  DesignCategory,
  AcrylicDesignOverlay as CanvasDesignOverlay,
  HardwareOption,
  DisplayOption,
  FinishOption
} from './acrylicCustomizerData';

export {
  ACRYLIC_BACKGROUNDS as CANVAS_BACKGROUNDS,
  ACRYLIC_BORDER_WIDTHS as CANVAS_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS as CANVAS_BORDER_COLORS
} from './acrylicCustomizerData';

export type { ClipartItem } from './acrylicClipartData';

// ----------------------------------------------------------------------------
// SHAPES: reuse the exact same shape geometry / SVG clip-path ids (they are
// referenced verbatim from <clipPath id="..."> defs in the customizer pages),
// only swapping the word "acrylic" out of the human-readable description text.
// ----------------------------------------------------------------------------
const swapMaterialWord = (text: string): string =>
  text.replace(/ACRYLIC/g, 'CANVAS').replace(/Acrylic/g, 'Canvas').replace(/acrylic/g, 'canvas');

export type CanvasShapeOption = AcrylicShapeOption;

export const CANVAS_SHAPES: CanvasShapeOption[] = ACRYLIC_SHAPES.map((shape) => ({
  ...shape,
  description: swapMaterialWord(shape.description)
}));

// ----------------------------------------------------------------------------
// DESIGN TEMPLATES GALLERY: reuse layout/border geometry, swap description text
// ----------------------------------------------------------------------------
export type CanvasTemplateItem = AcrylicTemplateItem;

export const CANVAS_TEMPLATES: CanvasTemplateItem[] = ACRYLIC_TEMPLATES.map((tmpl) => ({
  ...tmpl,
  name: swapMaterialWord(tmpl.name),
  description: swapMaterialWord(tmpl.description)
}));

// ----------------------------------------------------------------------------
// PRODUCT CATALOG (Canvas-specific)
// ----------------------------------------------------------------------------
export interface CanvasProductType {
  id: string;
  name: string;
  startingPrice: number;
  image: string;
  iconType: 'block' | 'panel' | 'wall' | 'print' | 'collage' | 'split' | 'signage';
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
  defaultShape: string;
  defaultLayoutId: string;
  defaultHardwareId: string;
  defaultThicknessId: string;
  supportedShapeIds?: string[];
}

const ALL_CANVAS_SHAPE_IDS = [
  'shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait',
  'shape-circle', 'shape-oval', 'shape-rounded-rect', 'shape-heart', 'shape-hexagon'
];

export const CANVAS_PRODUCT_TYPES: CanvasProductType[] = [
  {
    id: 'canvas-classic',
    name: 'Classic Canvas Print',
    startingPrice: 499.0,
    image: '',
    iconType: 'panel',
    panelsCount: 1,
    description: 'Stretched 380 GSM cotton canvas on a solid pine wood frame.',
    defaultSizeOptionId: 'sq-8x8',
    defaultShape: 'shape-rectangle',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'hooks-hanging',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS
  },
  {
    id: 'canvas-wall-art',
    name: 'Canvas Wall Art',
    startingPrice: 1999.0,
    image: '',
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'rec-12x18',
    defaultShape: 'shape-rectangle',
    defaultLayoutId: 'layout-3-collage',
    defaultHardwareId: 'sawtooth-hanger',
    defaultThicknessId: 'thick-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS
  },
  {
    id: 'canvas-collage',
    name: 'Canvas Collage',
    startingPrice: 850.0,
    image: '',
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on one canvas.',
    defaultSizeOptionId: 'sq-12x12',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-4-grid',
    defaultHardwareId: 'hooks-hanging',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS
  },
  {
    id: 'canvas-split',
    name: 'Canvas Split Panel',
    startingPrice: 1850.0,
    image: '',
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photograph split seamlessly across 3 triptych panels.',
    defaultSizeOptionId: 'pan-12x36',
    defaultShape: 'shape-landscape',
    defaultLayoutId: 'layout-3-collage',
    defaultHardwareId: 'sawtooth-hanger',
    defaultThicknessId: 'thick-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS
  },
  {
    id: 'canvas-panoramic',
    name: 'Panoramic Canvas Print',
    startingPrice: 1499.0,
    image: '',
    iconType: 'print',
    panelsCount: 1,
    description: 'Wide-format panoramic canvas for landscapes and skylines.',
    defaultSizeOptionId: 'pan-12x36',
    defaultShape: 'shape-landscape',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'hooks-hanging',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS
  }
];

// ----------------------------------------------------------------------------
// HARDWARE, DISPLAY, FINISH (Canvas-specific - mirrors HardwareOption/
// DisplayOption/FinishOption shape exactly so the page code is unchanged)
// ----------------------------------------------------------------------------
export const CANVAS_HARDWARE_OPTIONS: HardwareOption[] = [
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
    description: 'Hidden French cleat bracket on the rear stretcher for a flush, floating look.',
    image: '/assets/customizer/acrylic/hardware/ready-to-hang.svg'
  },
  {
    id: 'no-hooks',
    name: 'No Hooks',
    price: 0,
    description: 'Unmounted stretched canvas for custom framing or DIY hanging.',
    image: '/assets/customizer/acrylic/hardware/no-hooks.svg'
  },
  {
    id: 'sawtooth-hanger',
    name: 'Sawtooth Hanger',
    price: 25.0,
    description: 'Heavy duty sawtooth bracket installed on the rear stretcher bar.',
    image: '/assets/customizer/acrylic/hardware/sawtooth-hanger.svg'
  },
  {
    id: 'easel-back',
    name: 'Easel Back / Stand',
    price: 49.0,
    description: 'Foldable kickstand for desktop, shelf & mantle display.',
    image: '/assets/customizer/acrylic/hardware/easel-back.svg'
  },
  {
    id: 'nail-free-hook',
    name: 'Nail Free Hook',
    price: 49.0,
    description: 'No-drill wall adhesive tab system with clean removal capability.',
    image: '/assets/customizer/acrylic/hardware/nail-free-hook.svg'
  }
];

export const CANVAS_DISPLAY_OPTIONS: DisplayOption[] = [
  {
    id: 'display-open-back',
    name: 'Open Back',
    price: 0,
    description: 'Standard open stretcher-bar back, ready to hang.',
    image: '/assets/customizer/acrylic/hardware/no-hooks.svg'
  },
  {
    id: 'display-dust-cover',
    name: 'Dust Cover Back',
    price: 49.0,
    description: 'Black paper backing that seals the rear frame from dust.',
    image: '/assets/customizer/acrylic/hardware/ready-to-hang.svg'
  },
  {
    id: 'display-easel',
    name: 'Tabletop Easel',
    price: 49.0,
    description: 'Optimized for desk, shelf, or mantle display.',
    image: '/assets/customizer/acrylic/hardware/standoff-mounts.svg'
  }
];

export const CANVAS_FINISH_OPTIONS: FinishOption[] = [
  {
    id: 'satin-luster',
    name: 'Satin Luster',
    price: 0,
    description: 'Soft sheen finish that balances color vibrancy with reduced glare.',
    image: '/assets/customizer/acrylic/finishes/high-gloss.svg'
  },
  {
    id: 'matte',
    name: 'Matte Finish',
    price: 0,
    description: 'Non-reflective textured finish, ideal for bright rooms and galleries.',
    image: '/assets/customizer/acrylic/finishes/anti-glare.svg'
  },
  {
    id: 'gloss',
    name: 'High Gloss',
    price: 180.0,
    description: 'Vivid glossy coating with rich color saturation and depth.',
    image: '/assets/customizer/acrylic/finishes/frosted-backing.svg'
  },
  {
    id: 'canvas-weave',
    name: 'Textured Canvas Weave',
    price: 220.0,
    description: 'Emphasized fine-woven texture for an authentic hand-painted feel.',
    image: '/assets/customizer/acrylic/finishes/diamond-bevel.svg'
  }
];

// ----------------------------------------------------------------------------
// WRAP & BORDER (Canvas-specific gallery-wrap edge styles - mirrors
// AcrylicEdgeWrap's shape exactly for the WRAP & BORDER tab)
// ----------------------------------------------------------------------------
export interface CanvasEdgeWrap {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  borderWidth?: number;
  borderColor?: string;
  isClearEdge?: boolean;
}

export const CANVAS_EDGE_WRAPS: CanvasEdgeWrap[] = [
  {
    id: 'full-bleed',
    name: 'Image Wrap',
    price: 0,
    description: 'Your photo continues seamlessly around the side edges of the stretcher frame.',
    image: '/assets/customizer/acrylic/wraps/full-bleed.svg',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  {
    id: 'clear-edge',
    name: 'Mirror Wrap',
    price: 0,
    description: 'Edge pixels are mirrored around the sides so no part of your photo is lost.',
    image: '/assets/customizer/acrylic/wraps/clear-edge.svg',
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.75)'
  },
  {
    id: 'white-border',
    name: 'White Border Wrap',
    price: 120.0,
    description: '18px studio white border framing the photograph.',
    image: '/assets/customizer/acrylic/wraps/white-border.svg',
    borderWidth: 16,
    borderColor: '#FFFFFF'
  },
  {
    id: 'black-border',
    name: 'Black Border Wrap',
    price: 120.0,
    description: '18px gallery black border framing the photograph.',
    image: '/assets/customizer/acrylic/wraps/black-border.svg',
    borderWidth: 16,
    borderColor: '#0F172A'
  },
  {
    id: 'no-wrap',
    name: 'Solid Color Wrap',
    price: 0,
    description: 'Clean solid-color edges around the stretched canvas sides.',
    image: '/assets/customizer/acrylic/wraps/no-wrap.svg',
    borderWidth: 0,
    borderColor: 'transparent'
  }
];

export const CANVAS_WRAP_OPTIONS = CANVAS_EDGE_WRAPS;

// ----------------------------------------------------------------------------
// OPTIONS tab: wrap depth (replaces acrylic "thickness") and material grade
// (replaces acrylic "paper backing") - both kept as flat {id, label, price}
// so the page code that renders them is unchanged.
// ----------------------------------------------------------------------------
export const CANVAS_THICKNESS_OPTIONS = [
  { id: 'canvas-lite', label: '0.5" Canvas Lite (Slim Stretcher)', price: 0 },
  { id: 'thin-gallery', label: '0.75" Thin Gallery Wrap', price: 130.0 },
  { id: 'thick-gallery', label: '1.5" Thick Gallery Wrap (Museum Quality)', price: 155.0 },
  { id: 'hanging-canvas', label: 'Unframed Rolled Canvas', price: 85.0 }
];

export const CANVAS_PAPER_OPTIONS = [
  { id: 'standard-cotton', label: 'Standard 280 GSM Poly-Cotton Canvas', price: 0 },
  { id: 'premium-cotton', label: 'Premium 380 GSM Cotton Canvas', price: 250.0 },
  { id: 'archival-cotton', label: 'Archival Museum-Grade Canvas', price: 450.0 }
];
