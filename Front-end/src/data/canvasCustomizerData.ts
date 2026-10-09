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
  ACRYLIC_BORDER_COLORS as CANVAS_BORDER_COLORS,
  ACRYLIC_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS
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

export const CANVAS_SHAPES: CanvasShapeOption[] = [
  ...ACRYLIC_SHAPES.map((shape) => {
    let clip = shape.clipPathStyle;
    if (shape.id === 'shape-oval') {
      clip = 'ellipse(50% 50% at 50% 50%)';
    }
    return {
      ...shape,
      clipPathStyle: clip,
      description: swapMaterialWord(shape.description)
    };
  }),
  {
    id: 'shape-triangle',
    shapeType: 'triangle' as any,
    name: 'Triangle',
    category: 'special',
    description: 'Striking triangular format for dynamic and modern layouts.',
    aspectClass: 'aspect-square',
    aspectRatio: 1,
    borderRadiusClass: 'rounded-none',
    clipPathStyle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    isSingleDimension: true,
    image: '',
    priceAddon: 150
  }
];

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
// PRODUCT CATALOG (Canvas-specific - 16 Products from Reference Screenshot)
// ----------------------------------------------------------------------------
export type CanvasProductIconType =
  | 'block'
  | 'panel'
  | 'wall'
  | 'print'
  | 'collage'
  | 'split'
  | 'round'
  | 'triangle'
  | 'heart'
  | 'oval'
  | 'hexagon'
  | 'mosaic'
  | 'lyric'
  | 'painting'
  | 'quotes'
  | 'bus-roll'
  | 'banner'
  | 'pop-art'
  | 'word-art';

export interface CanvasProductCapabilities {
  products?: boolean;
  upload?: boolean;
  sizes?: boolean;
  shapes?: boolean;
  layouts?: boolean;
  wrap?: boolean;
  hardware?: boolean;
  options?: boolean;
  view3D?: boolean;
  view360?: boolean;
  roomView?: boolean;
}

export interface CanvasProductType {
  id: string;
  name: string;
  startingPrice: number;
  image: string;
  iconType: CanvasProductIconType;
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
  defaultShape: string;
  defaultLayoutId: string;
  defaultHardwareId: string;
  defaultThicknessId: string;
  supportedShapeIds?: string[];
  capabilities?: CanvasProductCapabilities;
  supportedLayoutIds?: string[];
}

const ALL_CANVAS_SHAPE_IDS = [
  'shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait',
  'shape-circle', 'shape-oval', 'shape-rounded-rect', 'shape-heart', 'shape-hexagon', 'shape-triangle'
];

export const CANVAS_PRODUCT_TYPES: CanvasProductType[] = [
  {
    id: 'canvas-single',
    name: 'Single Print',
    startingPrice: 99.0,
    image: '',
    iconType: 'print',
    panelsCount: 1,
    description: 'Classic single canvas print stretched over precision-milled wood frames.',
    defaultSizeOptionId: 'single-10x10',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: true,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: true,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-round',
    name: 'Round Canvas',
    startingPrice: 721.27,
    image: '',
    iconType: 'round',
    panelsCount: 1,
    description: 'Curved circular canvas stretched on precision round wood stretcher.',
    defaultSizeOptionId: 'shape-circle-10x10',
    defaultShape: 'shape-circle',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ['shape-circle'],
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-triangle',
    name: 'Triangle Canvas',
    startingPrice: 1250.79,
    image: '',
    iconType: 'triangle',
    panelsCount: 1,
    description: 'Geometric 3-sided triangle canvas for modern geometric wall galleries.',
    defaultSizeOptionId: 'shape-triangle-10x10',
    defaultShape: 'shape-triangle',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ['shape-triangle'],
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-heart',
    name: 'Heart Canvas',
    startingPrice: 1854.68,
    image: '',
    iconType: 'heart',
    panelsCount: 1,
    description: 'Romantic heart-shaped canvas for wedding, couple, and family portraits.',
    defaultSizeOptionId: 'shape-heart-10x10',
    defaultShape: 'shape-heart',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ['shape-heart'],
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-oval',
    name: 'Oval Canvas',
    startingPrice: 1380.67,
    image: '',
    iconType: 'oval',
    panelsCount: 1,
    description: 'Graceful elliptical canvas silhouette for timeless wall art.',
    defaultSizeOptionId: 'shape-oval-10x8',
    defaultShape: 'shape-oval',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ['shape-oval'],
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-wall-art',
    name: 'Wall Display',
    startingPrice: 856.90,
    image: '',
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'wall-display-3p-12x18',
    defaultShape: 'shape-rectangle',
    defaultLayoutId: 'layout-3-collage',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thick-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: false,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: false,
      roomView: true
    }
  },
  {
    id: 'canvas-collage',
    name: 'Photo Collage',
    startingPrice: 148.50,
    image: '',
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs arranged creatively on a single canvas.',
    defaultSizeOptionId: 'shape-square-10x10',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-4-grid',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: false,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-hexagon',
    name: 'Hexagon Prints',
    startingPrice: 449.0,
    image: '',
    iconType: 'hexagon',
    panelsCount: 1,
    description: 'Geometric 6-sided honeycomb canvas prints for modular wall clusters.',
    defaultSizeOptionId: 'hex-horizontal-single',
    defaultShape: 'shape-hexagon',
    defaultLayoutId: 'hex-horizontal-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ['shape-hexagon'],
    capabilities: {
      products: true,
      upload: true,
      sizes: false,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: false,
      roomView: true
    }
  },
  {
    id: 'canvas-split',
    name: 'Split Canvas',
    startingPrice: 188.10,
    image: '',
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photo split seamlessly across 3 triptych canvas panels.',
    defaultSizeOptionId: 'split-3p-36x24',
    defaultShape: 'shape-landscape',
    defaultLayoutId: 'layout-3-split',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thick-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: false,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: false,
      roomView: true
    }
  },
  {
    id: 'canvas-mosaic',
    name: 'Photo Mosaic',
    startingPrice: 148.50,
    image: '',
    iconType: 'mosaic',
    panelsCount: 16,
    description: 'Intricate mosaic grid pattern blending dozens of micro photos into one artwork.',
    defaultSizeOptionId: 'mosaic2-4x4',
    defaultShape: 'shape-square',
    defaultLayoutId: 'mosaic2-4x4',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: false,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-lyric',
    name: 'Lyric on Canvas',
    startingPrice: 1498.50,
    image: '',
    iconType: 'lyric',
    panelsCount: 1,
    description: 'Personalized song lyrics and cherished music quotes beautifully printed on gallery-wrapped canvas.',
    defaultSizeOptionId: 'lyric-8x8',
    defaultShape: 'shape-portrait',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: true,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-digital-painting',
    name: 'Digital Painting',
    startingPrice: 2598.00,
    image: '',
    iconType: 'painting',
    panelsCount: 1,
    description: 'Turn your favorite memories and portraits into artistic digital oil and watercolor paintings on canvas.',
    defaultSizeOptionId: 'painting-12x18',
    defaultShape: 'shape-portrait',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-quotes',
    name: 'Quotes on Canvas',
    startingPrice: 999.00,
    image: '',
    iconType: 'quotes',
    panelsCount: 1,
    description: 'Inspirational quotes, typography, and life mantras rendered on premium archival canvas.',
    defaultSizeOptionId: 'quotes-8x8',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: true,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-bus-roll',
    name: 'Bus Roll',
    startingPrice: 705.60,
    image: '',
    iconType: 'bus-roll',
    panelsCount: 1,
    description: 'Vintage vintage-transit and destination subway scroll canvas prints with custom places and memories.',
    defaultSizeOptionId: 'bus-12x36',
    defaultShape: 'shape-portrait',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-banner',
    name: 'Canvas Banner',
    startingPrice: 399.00,
    image: '',
    iconType: 'banner',
    panelsCount: 1,
    description: 'Hanging fabric canvas banner with solid wood rails and rustic twine cord for wall hanging.',
    defaultSizeOptionId: 'banner-12x18',
    defaultShape: 'shape-portrait',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: false,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-pop-art',
    name: 'Pop Art',
    startingPrice: 598.00,
    image: '',
    iconType: 'pop-art',
    panelsCount: 1,
    description: 'Vibrant Andy Warhol-inspired pop art portrait canvas featuring vivid colors and bold outlines.',
    defaultSizeOptionId: 'pop-12x12',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  },
  {
    id: 'canvas-word-art',
    name: 'Word Art',
    startingPrice: 198.00,
    image: '',
    iconType: 'word-art',
    panelsCount: 1,
    description: 'Expressive word cloud silhouette art created from your custom names, dates, and meaningful phrases.',
    defaultSizeOptionId: 'word-12x12',
    defaultShape: 'shape-square',
    defaultLayoutId: 'layout-1-single',
    defaultHardwareId: 'no-hooks',
    defaultThicknessId: 'thin-gallery',
    supportedShapeIds: ALL_CANVAS_SHAPE_IDS,
    capabilities: {
      products: true,
      upload: true,
      sizes: true,
      shapes: false,
      layouts: false,
      wrap: true,
      hardware: true,
      options: true,
      view3D: false,
      view360: true,
      roomView: true
    }
  }
];

export function getCanvasProductCapabilities(pt: CanvasProductType): CanvasProductCapabilities {
  if (pt.capabilities) {
    return {
      view3D: pt.id === 'canvas-single',
      view360: true,
      roomView: true,
      ...pt.capabilities
    };
  }
  const isSplit = pt.id === 'canvas-split';
  const isCollageOrMosaic = pt.id === 'canvas-collage' || pt.id === 'canvas-mosaic' || pt.id === 'canvas-wall-art';

  return {
    products: true,
    upload: true,
    sizes: true,
    shapes: !isSplit && !isCollageOrMosaic,
    layouts: isCollageOrMosaic && !isSplit,
    wrap: true,
    hardware: true,
    options: true,
    view3D: pt.id === 'canvas-single',
    view360: !['canvas-wall-art', 'canvas-split', 'canvas-hexagon'].includes(pt.id),
    roomView: true
  };
}

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
  label: string;
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
    label: 'Image Wrap',
    price: 0,
    description: 'Your photo continues seamlessly around the side edges of the stretcher frame.',
    image: '/assets/customizer/acrylic/wraps/full-bleed.svg',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  {
    id: 'clear-edge',
    name: 'Mirror Wrap',
    label: 'Mirror Wrap',
    price: 0,
    description: 'Edge pixels are mirrored around the sides so no part of your photo is lost.',
    image: '/assets/customizer/acrylic/wraps/clear-edge.svg',
    borderWidth: 10,
    borderColor: 'rgba(255, 255, 255, 0.75)'
  },
  {
    id: 'white-border',
    name: 'White Border Wrap',
    label: 'White Border Wrap',
    price: 120.0,
    description: '18px studio white border framing the photograph.',
    image: '/assets/customizer/acrylic/wraps/white-border.svg',
    borderWidth: 16,
    borderColor: '#FFFFFF'
  },
  {
    id: 'black-border',
    name: 'Black Border Wrap',
    label: 'Black Border Wrap',
    price: 120.0,
    description: '18px gallery black border framing the photograph.',
    image: '/assets/customizer/acrylic/wraps/black-border.svg',
    borderWidth: 16,
    borderColor: '#0F172A'
  },
  {
    id: 'no-wrap',
    name: 'Solid Color Wrap',
    label: 'Solid Color Wrap',
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
// (replaces acrylic "paper backing")
// ----------------------------------------------------------------------------
export interface CanvasThicknessOption {
  id: string;
  label: string;
  name?: string;
  price: number;
  depthPx: number;
  description?: string;
  badge?: string;
}

export const CANVAS_THICKNESS_OPTIONS: CanvasThicknessOption[] = [
  { id: 'canvas-lite', label: '0.5" Canvas Lite (Slim Stretcher)', name: '0.5" Canvas Lite', price: 0, depthPx: 16, description: 'Ultra slim & lightweight, economical mount', badge: 'Popular' },
  { id: 'thin-gallery', label: '0.75" Thin Gallery Wrap', name: '0.75" Thin Gallery Wrap', price: 130.0, depthPx: 26, description: 'Standard modern gallery profile' },
  { id: 'thick-gallery', label: '1.5" Thick Gallery Wrap (Museum Quality)', name: '1.5" Thick Gallery Wrap', price: 155.0, depthPx: 44, description: 'Museum-grade premium deep projection', badge: 'Museum Depth' },
  { id: 'hanging-canvas', label: 'Unframed Rolled Canvas', name: 'Unframed Rolled Canvas', price: 85.0, depthPx: 8, description: 'Flexible unmounted rolled canvas or hanging bar' }
];

export const CANVAS_PAPER_OPTIONS = [
  { id: 'standard-cotton', label: 'Standard 280 GSM Poly-Cotton Canvas', price: 0 },
  { id: 'premium-cotton', label: 'Premium 380 GSM Cotton Canvas', price: 250.0 },
  { id: 'archival-cotton', label: 'Archival Museum-Grade Canvas', price: 450.0 }
];
