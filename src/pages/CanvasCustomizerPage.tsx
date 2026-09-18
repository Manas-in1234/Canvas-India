import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Type,
  Smile,
  Layers,
  LayoutGrid,
  SlidersHorizontal,
  Save,
  ShoppingCart,
  MessageSquare,
  Check,
  Trash2,
  Move,
  Phone,
  Grid,
  Crop,
  Eye,
  Box,
  Ban,
  Info,
  Monitor,
  Smartphone,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Shapes,
  FlipHorizontal2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  ACRYLIC_SHAPES,
  AcrylicShapeOption,
  FRAME_OPTIONS,
  ACRYLIC_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS
} from '../data/acrylicCustomizerData';

// ============================================================================
// 1. CONSTANTS & CANVAS-ONLY DATA DEFINITIONS
// ============================================================================

type ToolbarTab =
  | 'PRODUCTS'
  | 'UPLOAD'
  | 'SELECT SIZE'
  | 'LAYOUTS & DESIGNS'
  | 'SHAPE'
  | 'WRAP & BORDER'
  | 'HARDWARE & FINISH'
  | 'OPTIONS';

const TOOLBAR_ITEMS: { id: ToolbarTab; label: string; icon: React.ElementType }[] = [
  { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
  { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
  { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
  { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers },
  { id: 'SHAPE', label: 'SHAPE', icon: Shapes },
  { id: 'WRAP & BORDER', label: 'WRAP & BORDER', icon: Crop },
  { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal },
  { id: 'OPTIONS', label: 'OPTIONS', icon: SlidersHorizontal }
];

const SHAPE_FILTER_TABS: { id: 'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'BASIC', label: 'Basic' },
  { id: 'SPECIAL', label: 'Special' },
  { id: 'DECORATIVE', label: 'Decorative' }
];

const CANVAS_BORDER_WIDTH_PRICES: Record<string, number> = { none: 0, thin: 49, medium: 89, thick: 149 };

type ColorFilterType = 'original' | 'sepia' | 'grayscale';
type SizeCategory = 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL';

interface CanvasProductType {
  id: string;
  name: string;
  startingPrice: number;
  iconType: 'block' | 'panel' | 'wall' | 'print' | 'collage' | 'split' | 'signage';
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
}

// Strictly Canvas-only products (no acrylic, wood, or metal)
const CANVAS_PRODUCT_TYPES: CanvasProductType[] = [
  {
    id: 'canvas-classic',
    name: 'Classic Canvas Print',
    startingPrice: 499.0,
    iconType: 'panel',
    panelsCount: 1,
    description: 'Stretched 380 GSM cotton canvas on a solid pine frame.',
    defaultSizeOptionId: 'classic-8x10'
  },
  {
    id: 'canvas-wall-art',
    name: 'Canvas Wall Art',
    startingPrice: 1999.0,
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'wd-3p-12x18-10x8'
  },
  {
    id: 'canvas-split',
    name: 'Canvas Split Panel',
    startingPrice: 1850.0,
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photograph split seamlessly across 3 triptych panels.',
    defaultSizeOptionId: 'split-3p-36x24'
  },
  {
    id: 'canvas-collage',
    name: 'Canvas Collage',
    startingPrice: 850.0,
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on one canvas.',
    defaultSizeOptionId: 'col-4p-12x12'
  },
  {
    id: 'canvas-panoramic',
    name: 'Panoramic Canvas Print',
    startingPrice: 1499.0,
    iconType: 'print',
    panelsCount: 1,
    description: 'Wide-format panoramic canvas for landscapes and skylines.',
    defaultSizeOptionId: 'pano-30x12'
  }
];

interface SizeOption {
  id: string;
  productTypeId: string;
  label: string;
  dimensionsSummary: string;
  price: number;
  categories: SizeCategory[];
  panels: Array<{
    id: string;
    label: string;
    dimension: string;
    widthRatio: number;
    heightRatio: number;
  }>;
}

const SIZE_OPTIONS: SizeOption[] = [
  // Canvas Wall Art (3-Piece Layout)
  {
    id: 'wd-3p-12x18-10x8',
    productTypeId: 'canvas-wall-art',
    label: '3-piece (1) 12"x18", (2) 10"x8"',
    dimensionsSummary: '(1) 12"x18", (2) 10"x8"',
    price: 1999.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [
      { id: 'p0', label: 'Panel 1 (Top)', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 },
      { id: 'p1', label: 'Panel 2 (Left)', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wd-4p-12x12-8x8',
    productTypeId: 'canvas-wall-art',
    label: '4-piece (2) 12"x12", (2) 8"x8"',
    dimensionsSummary: '(2) 12"x12", (2) 8"x8"',
    price: 2490.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Panel 2', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Panel 3', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p3', label: 'Panel 4', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  // Classic Canvas Print
  {
    id: 'classic-8x10',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 8" × 10"',
    dimensionsSummary: '8" × 10"',
    price: 499.0,
    categories: ['RECOMMENDED', 'SMALL'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }]
  },
  {
    id: 'classic-12x18',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 899.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'classic-16x24',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 1499.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '16" × 24"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'classic-24x36',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 2299.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '24" × 36"', widthRatio: 36, heightRatio: 24 }]
  },
  // Panoramic Canvas Print
  {
    id: 'pano-30x12',
    productTypeId: 'canvas-panoramic',
    label: 'Panoramic: 30" × 12"',
    dimensionsSummary: '30" × 12"',
    price: 1499.0,
    categories: ['RECOMMENDED', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Panoramic Canvas', dimension: '30" × 12"', widthRatio: 30, heightRatio: 12 }]
  },
  {
    id: 'pano-40x16',
    productTypeId: 'canvas-panoramic',
    label: 'Panoramic: 40" × 16"',
    dimensionsSummary: '40" × 16"',
    price: 1999.0,
    categories: ['RECOMMENDED', 'PANORAMIC', 'LARGE'],
    panels: [{ id: 'p0', label: 'Panoramic Canvas', dimension: '40" × 16"', widthRatio: 40, heightRatio: 16 }]
  },
  // Canvas Split Panel
  {
    id: 'split-3p-36x24',
    productTypeId: 'canvas-split',
    label: '3-Panel Triptych: 36" × 24" total',
    dimensionsSummary: '(3) 12" × 24"',
    price: 1850.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [
      { id: 'p0', label: 'Panel 1 (Left)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p1', label: 'Panel 2 (Center)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
    ]
  },
  // Canvas Collage
  {
    id: 'col-2p-16x8',
    productTypeId: 'canvas-collage',
    label: '2-Photo Grid: 16" × 8"',
    dimensionsSummary: '2 Photos (8" × 8" ea)',
    price: 549.0,
    categories: ['RECOMMENDED'],
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p1', label: 'Slot 2', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'col-3p-18x12',
    productTypeId: 'canvas-collage',
    label: '3-Photo Grid: 18" × 12"',
    dimensionsSummary: '3 Photos (6" × 12" ea)',
    price: 699.0,
    categories: ['RECOMMENDED'],
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '6" × 12"', widthRatio: 6, heightRatio: 12 },
      { id: 'p1', label: 'Slot 2', dimension: '6" × 12"', widthRatio: 6, heightRatio: 12 },
      { id: 'p2', label: 'Slot 3', dimension: '6" × 12"', widthRatio: 6, heightRatio: 12 }
    ]
  },
  {
    id: 'col-4p-12x12',
    productTypeId: 'canvas-collage',
    label: '4-Photo Grid: 12" × 12"',
    dimensionsSummary: '4 Photos (6" × 6" ea)',
    price: 850.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p1', label: 'Slot 2', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p2', label: 'Slot 3', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p3', label: 'Slot 4', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 }
    ]
  }
];

const SIZE_CATEGORY_TABS: SizeCategory[] = ['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE', 'SMALL'];

type LayoutArrangement = 'single' | 'grid2' | 'grid3' | 'grid4' | 'split3' | 'wall3';

interface LayoutPreset {
  id: string;
  label: string;
  productTypeId: string;
  sizeId: string;
  arrangement: LayoutArrangement;
}

// Universal layout picker: always shown, works from any product — picking one
// switches to the matching product type + size so the panel count actually changes.
const LAYOUT_PRESETS: LayoutPreset[] = [
  { id: 'layout-1', label: '1 Photo', productTypeId: 'canvas-classic', sizeId: 'classic-12x18', arrangement: 'single' },
  { id: 'layout-2', label: '2 Photos', productTypeId: 'canvas-collage', sizeId: 'col-2p-16x8', arrangement: 'grid2' },
  { id: 'layout-3', label: '3 Photos', productTypeId: 'canvas-collage', sizeId: 'col-3p-18x12', arrangement: 'grid3' },
  { id: 'layout-4', label: '4 Photos', productTypeId: 'canvas-collage', sizeId: 'col-4p-12x12', arrangement: 'grid4' },
  { id: 'layout-split', label: '3-Panel Split', productTypeId: 'canvas-split', sizeId: 'split-3p-36x24', arrangement: 'split3' },
  { id: 'layout-wall', label: '3-Piece Wall Display', productTypeId: 'canvas-wall-art', sizeId: 'wd-3p-12x18-10x8', arrangement: 'wall3' }
];

interface DesignTemplate {
  id: string;
  category: string;
  name: string;
  textPreset: string;
  emoji?: string;
  swatchClass: string;
}

const DESIGN_TEMPLATE_CATEGORIES = ["Father's Day", 'Birthday', 'Wedding', 'Anniversary'];

const DESIGN_TEMPLATES: DesignTemplate[] = [
  { id: 'tpl-fd-1', category: "Father's Day", name: 'Love You Dad', textPreset: 'Love You Dad', swatchClass: 'bg-stone-900 text-white' },
  { id: 'tpl-fd-2', category: "Father's Day", name: "Happy Father's Day", textPreset: "Happy Father's Day", emoji: '🕶️', swatchClass: 'bg-sky-100 text-sky-900' },
  { id: 'tpl-fd-3', category: "Father's Day", name: 'Dad, The Hero', textPreset: 'Dad, The Hero', emoji: '🎩', swatchClass: 'bg-emerald-50 text-emerald-900' },
  { id: 'tpl-bd-1', category: 'Birthday', name: 'Happy Birthday', textPreset: 'Happy Birthday!', emoji: '🎂', swatchClass: 'bg-rose-100 text-rose-900' },
  { id: 'tpl-bd-2', category: 'Birthday', name: 'Another Year Wiser', textPreset: 'Another Year Wiser', emoji: '🎈', swatchClass: 'bg-amber-100 text-amber-900' },
  { id: 'tpl-wd-1', category: 'Wedding', name: 'Mr & Mrs', textPreset: 'Mr & Mrs', emoji: '💍', swatchClass: 'bg-rose-50 text-rose-900' },
  { id: 'tpl-wd-2', category: 'Wedding', name: 'Forever & Always', textPreset: 'Forever & Always', emoji: '💐', swatchClass: 'bg-white text-stone-900 border border-stone-200' },
  { id: 'tpl-an-1', category: 'Anniversary', name: 'Happy Anniversary', textPreset: 'Happy Anniversary', emoji: '❤️', swatchClass: 'bg-red-50 text-red-900' },
  { id: 'tpl-an-2', category: 'Anniversary', name: 'Together Forever', textPreset: 'Together Forever', emoji: '✨', swatchClass: 'bg-indigo-50 text-indigo-900' }
];

const WRAP_OPTIONS = [
  { id: 'canvas-lite', label: 'Canvas Lite', depth: '0.5"', depthPx: 6, price: 0 },
  { id: 'thin-gallery', label: 'Thin Gallery Wrap', depth: '0.75"', depthPx: 10, price: 130, badge: 'Recommended' },
  { id: 'thick-gallery', label: 'Thick Gallery Wrap', depth: '1.5"', depthPx: 18, price: 155, badge: 'Museum Quality' },
  { id: 'hanging-canvas', label: 'Hanging Canvas', depth: '', depthPx: 4, price: 85 }
];

const HARDWARE_OPTIONS = [
  { id: 'hooks-hanging', label: 'Hooks for Hanging', price: 0 },
  { id: 'ready-to-hang', label: 'Ready to Hang', price: 0 },
  { id: 'no-hooks', label: 'No Hooks', price: 0 },
  { id: 'sawtooth-hanger', label: 'Sawtooth Hanger', price: 25 },
  { id: 'easel-back', label: 'Easel Back', price: 49 },
  { id: 'nail-free-hook', label: 'Nail Free Hook', price: 49 }
];

const DISPLAY_OPTIONS = [
  { id: 'open-back', label: 'Open Back', price: 0 },
  { id: 'dust-cover', label: 'Dust Cover', price: 49 }
];

const COLOR_FINISH_OPTIONS: { id: ColorFilterType; label: string }[] = [
  { id: 'original', label: 'Original' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'grayscale', label: 'GrayScale' }
];

const LAMINATION_OPTIONS = [
  { id: 'none', label: 'No', price: 0 },
  { id: 'standard', label: 'Standard', price: 149 },
  { id: 'premium', label: 'Premium', price: 249 }
];

const RETOUCH_CHECKS = [
  { id: 'red-eye', label: 'Red Eye Removal' },
  { id: 'dust-scratch', label: 'Dust/Scratch Removal' },
  { id: 'enhance-color', label: 'Enhance Color' },
  { id: 'date-stamp', label: 'Date Stamp Removal' },
  { id: 'lighten-darken', label: 'Lighten/Darken Image' }
];

const MATERIAL_VARIANTS = [
  { id: 'standard-cotton', name: 'Standard 280 GSM Cotton Canvas', tag: 'Standard', desc: 'Durable poly-cotton blend canvas for everyday prints.' },
  { id: 'premium-cotton', name: 'Premium 380 GSM Cotton Canvas', tag: '+₹250', desc: '100% cotton museum-grade canvas with rich texture.' },
  { id: 'archival-cotton', name: 'Archival Museum Canvas', tag: '+₹450', desc: 'Acid-free archival canvas rated for 100+ years of fade resistance.' }
];

const CLIPART_ITEMS = ['❤️', '⭐', '🎉', '🎁', '✨', '🌸', '😊', '🌿', '💎', '🎂', '💍', '🏆'];

interface PanelImageState {
  imageUrl: string | null;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
  filter: ColorFilterType;
}

const createDefaultPanel = (): PanelImageState => ({
  imageUrl: null,
  panX: 0,
  panY: 0,
  scale: 1,
  rotation: 0,
  filter: 'original'
});

const getFilterCss = (filter: ColorFilterType): string => {
  if (filter === 'sepia') return 'sepia(0.85) contrast(1.1) brightness(0.95)';
  if (filter === 'grayscale') return 'grayscale(100%) contrast(1.05)';
  return 'none';
};

// ============================================================================
// 2. MAIN CANVAS CUSTOMIZER COMPONENT
// ============================================================================

export const CanvasCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Matched product from catalog
  const catalogProduct = useMemo(() => {
    return (
      allProducts.find((p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'canvas') ||
      allProducts.find((p) => p.categorySlug === 'canvas') ||
      allProducts[0]
    );
  }, [allProducts, productId]);

  // Active step in the left toolbar
  const [activeTab, setActiveTab] = useState<ToolbarTab>('PRODUCTS');
  const activeTabIndex = TOOLBAR_ITEMS.findIndex((t) => t.id === activeTab);
  const prevTab = TOOLBAR_ITEMS[Math.max(0, activeTabIndex - 1)];
  const nextTab = TOOLBAR_ITEMS[Math.min(TOOLBAR_ITEMS.length - 1, activeTabIndex + 1)];

  // Selected Canvas Product Type
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(() => {
    const key = (catalogProduct?.slug || catalogProduct?.id || catalogProduct?.name || '').toLowerCase();
    if (key.includes('wall') || key.includes('display')) return 'canvas-wall-art';
    if (key.includes('collage')) return 'canvas-collage';
    if (key.includes('split')) return 'canvas-split';
    if (key.includes('panoramic') || key.includes('landscape')) return 'canvas-panoramic';
    return 'canvas-classic';
  });

  const selectedProductType = useMemo(() => {
    return CANVAS_PRODUCT_TYPES.find((pt) => pt.id === selectedProductTypeId) || CANVAS_PRODUCT_TYPES[0];
  }, [selectedProductTypeId]);

  // Available size options for the current product type
  const availableSizeOptions = useMemo(() => {
    const list = SIZE_OPTIONS.filter((s) => s.productTypeId === selectedProductTypeId);
    if (list.length > 0) return list;
    return SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-classic');
  }, [selectedProductTypeId]);

  // SELECT SIZE tab: category filter
  const [sizeCategory, setSizeCategory] = useState<SizeCategory>('RECOMMENDED');
  const filteredSizeOptions = useMemo(() => {
    return availableSizeOptions.filter((s) => s.categories.includes(sizeCategory));
  }, [availableSizeOptions, sizeCategory]);

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => availableSizeOptions[0]?.id || 'classic-8x10');

  useEffect(() => {
    if (!availableSizeOptions.some((s) => s.id === selectedSizeId)) {
      setSelectedSizeId(availableSizeOptions[0]?.id || 'classic-8x10');
    }
  }, [availableSizeOptions, selectedSizeId]);

  const currentSizeOption = useMemo(() => {
    return availableSizeOptions.find((s) => s.id === selectedSizeId) || availableSizeOptions[0] || SIZE_OPTIONS[0];
  }, [availableSizeOptions, selectedSizeId]);

  // Custom Size (only meaningful for single-panel products)
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<number>(8);
  const [customHeight, setCustomHeight] = useState<number>(8);
  const customSizePrice = useMemo(() => Math.max(99, Math.round(customWidth * customHeight * 4.2)), [customWidth, customHeight]);

  const canUseCustomSize = currentSizeOption.panels.length === 1;

  // Panels for the current size layout
  const panels = currentSizeOption.panels;

  // Shapes, borders and outer frames only apply to single-panel canvases
  // (multi-panel collage / split / wall-art layouts stay rectangular slots).
  const shapeApplies = panels.length === 1;

  // Panel Images State
  const [panelImages, setPanelImages] = useState<Record<number, PanelImageState>>({
    0: createDefaultPanel(),
    1: createDefaultPanel(),
    2: createDefaultPanel(),
    3: createDefaultPanel()
  });

  // Currently Active Panel Slot for drag/transform/upload targeting
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  // Uploaded photo collection (all photos uploaded in this session)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // UPLOAD tab: source sub-tab (visual, only "Computer" is wired to the file picker)
  const [uploadSource, setUploadSource] = useState<'computer' | 'phone' | 'gallery' | 'ai'>('computer');

  // LAYOUTS & DESIGNS tab
  const [layoutSubTab, setLayoutSubTab] = useState<'DESIGNS' | 'LAYOUTS'>('LAYOUTS');
  const [designCategory, setDesignCategory] = useState<string>(DESIGN_TEMPLATE_CATEGORIES[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>('layout-1');

  // SHAPE tab
  const [selectedShapeId, setSelectedShapeId] = useState<string>('shape-square');
  const [shapeFilterCategory, setShapeFilterCategory] = useState<'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'>('ALL');

  const currentShape = useMemo<AcrylicShapeOption>(() => {
    return ACRYLIC_SHAPES.find((s) => s.id === selectedShapeId) || ACRYLIC_SHAPES[0];
  }, [selectedShapeId]);

  const filteredShapes = useMemo(() => {
    if (shapeFilterCategory === 'ALL') return ACRYLIC_SHAPES;
    return ACRYLIC_SHAPES.filter((s) => s.category.toUpperCase() === shapeFilterCategory);
  }, [shapeFilterCategory]);

  // WRAP & BORDER tab
  const [selectedWrapId, setSelectedWrapId] = useState<string>('canvas-lite');
  const [mirrorImage, setMirrorImage] = useState<boolean>(false);
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('no-frame');

  // HARDWARE & FINISH tab
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('hooks-hanging');
  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('open-back');

  // OPTIONS tab
  const [selectedLaminationId, setSelectedLaminationId] = useState<string>('standard');
  const [retouchChecks, setRetouchChecks] = useState<Record<string, boolean>>({});
  const [majorRetouchText, setMajorRetouchText] = useState<string>('');
  const [proofRequested, setProofRequested] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Material Variant (from Change Material modal)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('standard-cotton');
  const [materialModalOpen, setMaterialModalOpen] = useState<boolean>(false);

  // Creative Tools State
  const [customText, setCustomText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [textSize, setTextSize] = useState<number>(24);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [showTextPopover, setShowTextPopover] = useState<boolean>(false);

  const [activeClipart, setActiveClipart] = useState<string | null>(null);
  const [showClipartPopover, setShowClipartPopover] = useState<boolean>(false);

  // Modals & Drawers
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Dragging state for the active panel image
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Key
  const storageKey = `ci_customization_${catalogProduct.id || catalogProduct.slug || 'canvas-custom'}`;

  // Restore saved state on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedProductTypeId) setSelectedProductTypeId(data.selectedProductTypeId);
        if (data.selectedSizeId) setSelectedSizeId(data.selectedSizeId);
        if (data.selectedShapeId) setSelectedShapeId(data.selectedShapeId);
        if (data.selectedWrapId) setSelectedWrapId(data.selectedWrapId);
        if (data.selectedBorderWidthId) setSelectedBorderWidthId(data.selectedBorderWidthId);
        if (data.selectedBorderColor) setSelectedBorderColor(data.selectedBorderColor);
        if (data.selectedFrameId) setSelectedFrameId(data.selectedFrameId);
        if (typeof data.mirrorImage === 'boolean') setMirrorImage(data.mirrorImage);
        if (data.selectedHardwareId) setSelectedHardwareId(data.selectedHardwareId);
        if (data.selectedDisplayOptionId) setSelectedDisplayOptionId(data.selectedDisplayOptionId);
        if (data.selectedLaminationId) setSelectedLaminationId(data.selectedLaminationId);
        if (data.selectedMaterialId) setSelectedMaterialId(data.selectedMaterialId);
        if (data.quantity) setQuantity(data.quantity);
        if (data.customText) setCustomText(data.customText);
        if (data.activeClipart) setActiveClipart(data.activeClipart);
        if (data.panelImages) setPanelImages(data.panelImages);
        if (data.uploadedPhotos) setUploadedPhotos(data.uploadedPhotos);
      }
    } catch {
      // Ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Save current design state to localStorage
  const handleSaveDesign = () => {
    try {
      const stateToSave = {
        selectedProductTypeId,
        selectedSizeId,
        selectedShapeId,
        selectedWrapId,
        selectedBorderWidthId,
        selectedBorderColor,
        selectedFrameId,
        mirrorImage,
        selectedHardwareId,
        selectedDisplayOptionId,
        selectedLaminationId,
        selectedMaterialId,
        quantity,
        customText,
        activeClipart,
        panelImages,
        uploadedPhotos,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      setSaveToast('Design saved successfully! Your project is stored locally.');
      setTimeout(() => setSaveToast(null), 3500);
    } catch {
      setSaveToast('Notice: Could not save to localStorage.');
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  // Dynamic Price Calculation
  const sizePrice = isCustomSize && canUseCustomSize ? customSizePrice : currentSizeOption.price;

  const unitPrice = useMemo(() => {
    let price = sizePrice;

    if (shapeApplies && currentShape.priceAddon) price += currentShape.priceAddon;

    const wrap = WRAP_OPTIONS.find((w) => w.id === selectedWrapId);
    if (wrap) price += wrap.price;

    if (shapeApplies) {
      price += CANVAS_BORDER_WIDTH_PRICES[selectedBorderWidthId] || 0;
      const frame = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
      if (frame) price += frame.price;
    }

    const hardware = HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
    if (hardware) price += hardware.price;

    const display = DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId);
    if (display) price += display.price;

    const lamination = LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId);
    if (lamination) price += lamination.price;

    if (selectedMaterialId === 'premium-cotton') price += 250;
    else if (selectedMaterialId === 'archival-cotton') price += 450;

    return price;
  }, [
    sizePrice,
    shapeApplies,
    currentShape,
    selectedWrapId,
    selectedBorderWidthId,
    selectedFrameId,
    selectedHardwareId,
    selectedDisplayOptionId,
    selectedLaminationId,
    selectedMaterialId
  ]);

  const totalPrice = unitPrice * quantity;

  // Validation: at least one uploaded photo
  const filledPanelsCount = useMemo(() => {
    return panels.filter((_, idx) => Boolean(panelImages[idx]?.imageUrl)).length;
  }, [panels, panelImages]);

  const isComplete = filledPanelsCount >= 1;

  // File Upload Handler
  const handleFilesUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

    Array.from(files).forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 25MB limit.`);
        return;
      }
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
        alert(`File ${file.name} is not a supported format (JPG, PNG, WEBP, BMP).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedPhotos((prev) => [result, ...prev]);
          setPanelImages((prev) => ({
            ...prev,
            [activePanelIndex]: { ...createDefaultPanel(), imageUrl: result }
          }));
          setActiveTab('SELECT SIZE');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAssignPhotoToPanel = (photoUrl: string, panelIdx: number) => {
    setPanelImages((prev) => ({
      ...prev,
      [panelIdx]: { ...createDefaultPanel(), imageUrl: photoUrl }
    }));
  };

  const updateActivePanelTransform = (updater: (curr: PanelImageState) => Partial<PanelImageState>) => {
    setPanelImages((prev) => {
      const curr = prev[activePanelIndex] || createDefaultPanel();
      return { ...prev, [activePanelIndex]: { ...curr, ...updater(curr) } };
    });
  };

  const handleZoomIn = () => updateActivePanelTransform((curr) => ({ scale: Math.min(3, curr.scale + 0.15) }));
  const handleZoomOut = () => updateActivePanelTransform((curr) => ({ scale: Math.max(0.6, curr.scale - 0.15) }));
  const handleRotate90 = () => updateActivePanelTransform((curr) => ({ rotation: (curr.rotation + 90) % 360 }));
  const handleFit = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0 }));
  const handleReset = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, rotation: 0 }));
  const handleApplyFilter = (filter: ColorFilterType) => updateActivePanelTransform(() => ({ filter }));

  // Mouse/Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent, panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    const curr = panelImages[panelIdx];
    if (!curr?.imageUrl) return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialPanX: curr.panX, initialPanY: curr.panY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    updateActivePanelTransform(() => ({
      panX: Math.max(-120, Math.min(120, dragStartRef.current.initialPanX + deltaX)),
      panY: Math.max(-120, Math.min(120, dragStartRef.current.initialPanY + deltaY))
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Apply a design template: sets a canned caption + optional emoji
  const handleApplyTemplate = (tpl: DesignTemplate) => {
    setSelectedTemplateId(tpl.id);
    setCustomText(tpl.textPreset);
    setActiveClipart(tpl.emoji || null);
  };

  // Select a layout preset: switches product type + size so panel count actually changes
  const handleSelectLayoutPreset = (preset: LayoutPreset) => {
    setExpandedLayoutId(preset.id);
    setSelectedProductTypeId(preset.productTypeId);
    setSelectedSizeId(preset.sizeId);
    setIsCustomSize(false);
    setActivePanelIndex(0);
  };

  // Small mockup thumbnail matching each layout's real panel arrangement
  const renderLayoutThumbnail = (arrangement: LayoutArrangement) => {
    const cell = <div className="bg-stone-300 rounded" />;
    if (arrangement === 'single') return <div className="h-16 bg-stone-300 rounded" />;
    if (arrangement === 'grid2') return <div className="h-16 grid grid-cols-2 gap-1">{cell}{cell}</div>;
    if (arrangement === 'grid3') return <div className="h-16 grid grid-cols-3 gap-1">{cell}{cell}{cell}</div>;
    if (arrangement === 'grid4') return <div className="h-16 grid grid-cols-2 grid-rows-2 gap-1">{cell}{cell}{cell}{cell}</div>;
    if (arrangement === 'split3') return <div className="h-16 grid grid-cols-3 gap-0.5">{cell}{cell}{cell}</div>;
    // wall3: one wide panel on top, two smaller squares below
    return (
      <div className="h-16 flex flex-col gap-1">
        <div className="flex-[1.4] bg-stone-300 rounded" />
        <div className="flex-1 grid grid-cols-2 gap-1">{cell}{cell}</div>
      </div>
    );
  };

  // Add to Cart Action
  const handleAddToCart = () => {
    if (!isComplete) {
      alert('Please upload or select at least one photograph to customize your canvas print.');
      setActiveTab('UPLOAD');
      return;
    }

    const firstImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || catalogProduct.image;
    const retouchLabels = RETOUCH_CHECKS.filter((r) => retouchChecks[r.id]).map((r) => r.label);

    onAddToCartCustomized({
      product: {
        ...catalogProduct,
        price: unitPrice,
        name: `${selectedProductType.name} - ${isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.label}`
      },
      size: isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.dimensionsSummary,
      finish: WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.label || 'Canvas Lite',
      quantity,
      customText: customText || undefined,
      photoUrl: firstImage,
      calculatedPrice: totalPrice,
      material: MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Standard 280 GSM Cotton Canvas',
      style: selectedProductType.name,
      base: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label || 'Hooks for Hanging',
      customizationDetails: {
        productTypeId: selectedProductTypeId,
        sizeId: selectedSizeId,
        shape: shapeApplies ? currentShape.name : undefined,
        wrap: WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.label,
        borderWidth: shapeApplies ? ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.label : undefined,
        borderColor: shapeApplies && selectedBorderWidthId !== 'none' ? selectedBorderColor : undefined,
        frame: shapeApplies ? FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name : undefined,
        mirrorImage,
        display: DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId)?.label,
        lamination: LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.label,
        retouching: retouchLabels,
        majorRetouchText: majorRetouchText || undefined,
        proofRequested,
        template: selectedTemplateId ? DESIGN_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name : undefined,
        panels: panels.map((p, idx) => ({
          dimension: p.dimension,
          imageUrl: panelImages[idx]?.imageUrl || null,
          scale: panelImages[idx]?.scale || 1,
          rotation: panelImages[idx]?.rotation || 0,
          panX: panelImages[idx]?.panX || 0,
          panY: panelImages[idx]?.panY || 0,
          filter: panelImages[idx]?.filter || 'original'
        })),
        clipart: activeClipart,
        customText,
        textColor,
        unitPrice,
        totalPrice
      }
    });
  };

  // Renders a set of grid panels sharing a common column layout (used for split/collage)
  const renderGridPanels = (indices: number[], gridColsClass: string) => (
    <div className={`grid ${gridColsClass} gap-2.5 w-full max-w-lg`}>
      {indices.map((panelIdx) => {
        const panel = panelImages[panelIdx] || createDefaultPanel();
        return (
          <div
            key={panelIdx}
            onClick={() => setActivePanelIndex(panelIdx)}
            onPointerDown={(e) => handlePointerDown(e, panelIdx)}
            className={`relative w-full aspect-square bg-white rounded-lg overflow-hidden transition-all cursor-pointer border-2 ${
              activePanelIndex === panelIdx
                ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                : 'border-stone-300 shadow-md hover:border-stone-400'
            }`}
          >
            {panel.imageUrl ? (
              <img
                src={panel.imageUrl}
                alt={`Slot ${panelIdx + 1}`}
                style={{
                  transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg)`,
                  filter: getFilterCss(panel.filter),
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                <Upload className="w-4 h-4 text-[#E8752A] mb-1" />
                <span className="text-[10px] font-bold">Slot {panelIdx + 1}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-[#F8FAFC] text-stone-900 font-manrope overflow-hidden select-none">
      {/* SVG ClipPath Mask Definitions for non-rectangular canvas shapes */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <clipPath id="acrylic-clip-shape-heart" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.85 C 0.12,0.58 0.02,0.38 0.02,0.24 C 0.02,0.08 0.14,0.02 0.28,0.02 C 0.38,0.02 0.46,0.08 0.5,0.18 C 0.54,0.08 0.62,0.02 0.72,0.02 C 0.86,0.02 0.98,0.08 0.98,0.24 C 0.98,0.38 0.88,0.58 0.5,0.85 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-arch" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 L 0,0.4 C 0,0.15 0.22,0 0.5,0 C 0.78,0 1,0.15 1,0.4 L 1,1 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-cloud" clipPathUnits="objectBoundingBox">
            <path d="M 0.17,0.7 C 0.08,0.7 0.02,0.6 0.05,0.5 C 0.02,0.38 0.14,0.28 0.26,0.3 C 0.33,0.14 0.55,0.12 0.65,0.22 C 0.75,0.14 0.93,0.18 0.96,0.32 C 1.05,0.36 1.05,0.52 0.98,0.62 C 1.02,0.7 0.94,0.72 0.88,0.7 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-speech-bubble" clipPathUnits="objectBoundingBox">
            <path d="M 0.05,0.05 L 0.95,0.05 C 0.98,0.05 1,0.08 1,0.12 L 1,0.68 C 1,0.72 0.98,0.75 0.95,0.75 L 0.45,0.75 L 0.15,0.98 L 0.22,0.75 L 0.05,0.75 C 0.02,0.75 0,0.72 0,0.68 L 0,0.12 C 0,0.08 0.02,0.05 0.05,0.05 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-ticket" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,0.38 C 0.94,0.38 0.9,0.43 0.9,0.5 C 0.9,0.57 0.94,0.62 1,0.62 L 1,1 L 0,1 L 0,0.62 C 0.06,0.62 0.1,0.57 0.1,0.5 C 0.1,0.43 0.06,0.38 0,0.38 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-scalloped" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.02 C 0.56,0.02 0.62,0.06 0.65,0.12 C 0.71,0.08 0.78,0.09 0.82,0.15 C 0.88,0.14 0.93,0.19 0.94,0.25 C 1,0.28 1.01,0.36 0.98,0.41 C 1.02,0.47 1,0.54 0.95,0.59 C 0.98,0.65 0.94,0.73 0.88,0.76 C 0.88,0.83 0.82,0.88 0.75,0.88 C 0.71,0.94 0.64,0.96 0.58,0.94 C 0.52,0.99 0.45,0.98 0.4,0.94 C 0.35,0.97 0.27,0.94 0.24,0.88 C 0.17,0.87 0.12,0.81 0.12,0.74 C 0.06,0.71 0.03,0.63 0.05,0.57 C 0.01,0.51 0.01,0.43 0.05,0.38 C 0.03,0.31 0.06,0.24 0.13,0.22 C 0.14,0.15 0.21,0.11 0.28,0.12 C 0.33,0.06 0.41,0.05 0.47,0.1 C 0.5,0.04 0.45,0.02 0.5,0.02 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-organic-blob" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.02 C 0.78,0 0.98,0.18 0.98,0.45 C 0.98,0.75 0.8,0.98 0.52,0.96 C 0.25,0.94 0.02,0.78 0.02,0.5 C 0.02,0.22 0.22,0.04 0.5,0.02 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Hidden Global File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/bmp"
        multiple
        className="hidden"
        onChange={(e) => handleFilesUpload(e.target.files)}
      />

      {/* ===================================================================== */}
      {/* 1. TOP CANVAS INDIA HEADER (#0E4A93 Primary Blue)                     */}
      {/* ===================================================================== */}
      <header className="relative w-full bg-[#0E4A93] text-white h-14 shrink-0 flex items-center justify-between px-2.5 sm:px-4 lg:px-6 shadow-md z-30">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -ml-1 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors cursor-pointer text-white flex items-center justify-center min-w-[40px] min-h-[40px]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base text-white tracking-wide truncate max-w-[180px] lg:max-w-xs">
              {selectedProductType.name}
            </span>
            <span className="hidden lg:inline-block text-[11px] bg-white/15 px-2 py-0.5 rounded text-white font-medium border border-white/20">
              Canvas Studio
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity focus:outline-none" title="Canvas India">
            <img src="/canvas-india-official-logo.png" alt="Canvass India" className="h-7 sm:h-8 md:h-9 w-auto object-contain block select-none" />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setChatModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-full border border-white/20 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span>LIVE CHAT</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPricePopoverOpen(!pricePopoverOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[#0E4A93] font-black text-xs sm:text-sm rounded-lg shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E4A93]/80" />
            </button>

            {pricePopoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 p-4 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="font-extrabold pb-2 border-b border-stone-100 flex justify-between text-stone-900">
                  <span>Price Breakdown</span>
                  <button onClick={() => setPricePopoverOpen(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 py-2.5 text-stone-600">
                  <div className="flex justify-between">
                    <span>Base ({isCustomSize && canUseCustomSize ? `${customWidth}"×${customHeight}"` : currentSizeOption.dimensionsSummary}):</span>
                    <span className="font-bold text-stone-900">₹{sizePrice}</span>
                  </div>
                  {selectedWrapId !== 'canvas-lite' && (
                    <div className="flex justify-between">
                      <span>Wrap:</span>
                      <span className="font-bold text-stone-900">+₹{WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.price}</span>
                    </div>
                  )}
                  {selectedHardwareId !== 'hooks-hanging' && (
                    <div className="flex justify-between">
                      <span>Hardware:</span>
                      <span className="font-bold text-stone-900">+₹{HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.price}</span>
                    </div>
                  )}
                  {selectedDisplayOptionId === 'dust-cover' && (
                    <div className="flex justify-between">
                      <span>Dust Cover:</span>
                      <span className="font-bold text-stone-900">+₹49</span>
                    </div>
                  )}
                  {selectedLaminationId !== 'none' && (
                    <div className="flex justify-between">
                      <span>Lamination ({LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.label}):</span>
                      <span className="font-bold text-stone-900">+₹{LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.price}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-stone-100 text-stone-900 font-extrabold">
                    <span>Total (Qty {quantity}):</span>
                    <span className="text-[#0E4A93]">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isComplete}
            className={`px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm ${
              isComplete ? 'bg-[#E8752A] hover:bg-[#d6651d] text-white active:scale-[0.98]' : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            title={!isComplete ? 'Upload an image to continue' : 'Add customized canvas to cart'}
            aria-label="Add customized canvas to cart"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">ADD TO CART</span>
            <ChevronRight className="hidden sm:inline w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. BODY CONTAINER: 3-COLUMN LAYOUT                                    */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 1: LEFT VERTICAL TOOLBAR (7 Steps)                           */}
        {/* ------------------------------------------------------------------- */}
        <nav
          aria-label="Customizer Tools"
          className="bg-[#1E293B] text-stone-300 w-full md:w-20 md:min-w-[80px] shrink-0 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-3 z-20 border-r border-slate-700 overflow-x-auto md:overflow-visible"
        >
          {TOOLBAR_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full py-3.5 px-1 text-center transition-all cursor-pointer ${
                  isActive ? 'bg-white text-[#0E4A93] shadow-md font-extrabold' : 'text-slate-300 hover:text-white hover:bg-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#0E4A93]' : 'text-slate-300'}`} />
                <span className="text-[10px] leading-tight tracking-tight uppercase px-1">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 2: CONFIGURATION PANEL                                       */}
        {/* ------------------------------------------------------------------- */}
        <aside className="w-full md:w-[400px] lg:w-[440px] bg-white shrink-0 border-r border-stone-200 flex flex-col h-auto md:h-full overflow-y-auto shadow-sm z-10">
          {/* ---------------------------- PRODUCTS ---------------------------- */}
          {activeTab === 'PRODUCTS' && (
            <div className="flex flex-col h-full">
              {/* Material category strip (Canvas active, others link out) */}
              <div className="flex items-center border-b border-stone-200 text-[11px] font-black uppercase tracking-wide shrink-0">
                <div className="flex-1 text-center py-3 border-b-2 border-[#0E4A93] text-[#0E4A93]">Canvas</div>
                <Link to="/acrylic-customizer" className="flex-1 text-center py-3 text-stone-400 hover:text-stone-700 transition-colors">
                  Acrylic
                </Link>
                <div className="flex-1 text-center py-3 text-stone-300 cursor-not-allowed">Metal</div>
                <div className="flex-1 text-center py-3 text-stone-300 cursor-not-allowed">Wood</div>
                <div className="flex-1 text-center py-3 text-stone-300 cursor-not-allowed">Other</div>
              </div>

              <div className="p-4 space-y-2 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2.5">
                  {CANVAS_PRODUCT_TYPES.map((pt) => {
                    const isSelected = selectedProductTypeId === pt.id;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setSelectedProductTypeId(pt.id)}
                        className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[104px] ${
                          isSelected ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20' : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="w-8 h-8 flex items-center justify-center text-stone-500 my-1">
                          {pt.iconType === 'wall' && (
                            <div className="space-y-1">
                              <div className="w-6 h-2.5 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="flex gap-1">
                                <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
                                <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
                              </div>
                            </div>
                          )}
                          {pt.iconType === 'panel' && <div className="w-6 h-6 border-2 border-stone-400 rounded-xs" />}
                          {pt.iconType === 'print' && <div className="w-7 h-5 border-2 border-stone-400 rounded-xs" />}
                          {pt.iconType === 'collage' && (
                            <div className="grid grid-cols-2 gap-0.5">
                              <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
                            </div>
                          )}
                          {pt.iconType === 'split' && (
                            <div className="flex gap-1">
                              <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
                              <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-stone-900 leading-tight">{pt.name}</div>
                          <div className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-[#0E4A93]' : 'text-stone-500'}`}>
                            Starts at ₹{pt.startingPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------- UPLOAD ------------------------------ */}
          {activeTab === 'UPLOAD' && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'computer' as const, label: 'Computer', icon: Monitor },
                  { id: 'phone' as const, label: 'Upload from phone', icon: Smartphone },
                  { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon },
                  { id: 'ai' as const, label: 'AI Image Generator', icon: Sparkles }
                ].map((src) => {
                  const Icon = src.icon;
                  const isSelected = uploadSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setUploadSource(src.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected ? 'border-[#E8752A] bg-orange-50/50 text-[#E8752A]' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold leading-tight">{src.label}</span>
                    </button>
                  );
                })}
              </div>

              {panels.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Assigning Photo to Panel:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {panels.map((p, idx) => {
                      const isSelected = activePanelIndex === idx;
                      const hasPhoto = Boolean(panelImages[idx]?.imageUrl);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActivePanelIndex(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0E4A93] text-white shadow-xs'
                              : hasPhoto
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          <span>{p.label}</span>
                          {hasPhoto && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {uploadSource === 'computer' ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFilesUpload(e.dataTransfer.files);
                  }}
                  className="border border-stone-200 bg-stone-50 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start gap-2 text-xs text-stone-600">
                    <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>
                      File types accepted: <strong className="text-stone-800">PNG, JPG and BMP (Up to 25MB)</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-xs transition-colors cursor-pointer uppercase tracking-wide"
                  >
                    Upload
                  </button>
                  <p className="text-[11px] text-stone-400">Drag and drop files here, or click Upload to browse.</p>
                </div>
              ) : (
                <div className="border border-dashed border-stone-300 bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500">
                  {uploadSource === 'phone' && 'Scan the QR shown at checkout to send photos from your phone.'}
                  {uploadSource === 'gallery' && 'Browse free stock photography (coming soon).'}
                  {uploadSource === 'ai' && 'Generate an image with AI (coming soon).'}
                </div>
              )}

              {uploadedPhotos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">Uploaded Photos ({uploadedPhotos.length}):</span>
                    <span className="text-stone-400 text-[11px]">Click thumbnail to place</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {uploadedPhotos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => handleAssignPhotoToPanel(photo, activePanelIndex)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer shadow-xs hover:ring-2 hover:ring-[#0E4A93] transition-all"
                      >
                        <img src={photo} alt={`Upload ${pIdx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-[10px] text-white font-bold bg-[#0E4A93] px-1.5 py-0.5 rounded">Apply</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --------------------------- SELECT SIZE ---------------------------- */}
          {activeTab === 'SELECT SIZE' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center border-b border-stone-200 text-[10px] font-black uppercase tracking-wide shrink-0 overflow-x-auto">
                {SIZE_CATEGORY_TABS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSizeCategory(cat)}
                    className={`flex-1 text-center py-3 px-1.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      sizeCategory === cat ? 'border-[#0E4A93] text-[#0E4A93]' : 'border-transparent text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2.5">
                  {filteredSizeOptions.map((opt) => {
                    const isSelected = !isCustomSize && selectedSizeId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setIsCustomSize(false);
                          setSelectedSizeId(opt.id);
                        }}
                        className={`relative p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                          isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="w-full aspect-square bg-stone-200 rounded" />
                        <div className="text-[11px] font-bold text-stone-800 leading-tight">{opt.dimensionsSummary}</div>
                        <div className="text-[11px] font-semibold text-stone-500">₹{opt.price.toLocaleString('en-IN')}</div>
                      </div>
                    );
                  })}
                </div>

                {canUseCustomSize && (
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-stone-700 text-center">Custom Size (H x W inches)</div>
                    <div className="flex items-center justify-center gap-2">
                      <select
                        value={customHeight}
                        onChange={(e) => {
                          setIsCustomSize(true);
                          setCustomHeight(Number(e.target.value));
                        }}
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold bg-white"
                      >
                        {[6, 8, 10, 12, 16, 18, 20, 24, 30, 36].map((n) => (
                          <option key={n} value={n}>
                            {n}"
                          </option>
                        ))}
                      </select>
                      <span className="text-stone-400 text-xs font-bold">X</span>
                      <select
                        value={customWidth}
                        onChange={(e) => {
                          setIsCustomSize(true);
                          setCustomWidth(Number(e.target.value));
                        }}
                        className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold bg-white"
                      >
                        {[6, 8, 10, 12, 16, 18, 20, 24, 30, 36].map((n) => (
                          <option key={n} value={n}>
                            {n}"
                          </option>
                        ))}
                      </select>
                      <span className="text-xs font-black text-[#0E4A93] ml-1">₹{customSizePrice}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------ LAYOUTS & DESIGNS ------------------------- */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center border-b border-stone-200 text-xs font-black uppercase tracking-wide shrink-0">
                <button
                  type="button"
                  onClick={() => setLayoutSubTab('DESIGNS')}
                  className={`flex-1 text-center py-3 border-b-2 transition-colors cursor-pointer ${
                    layoutSubTab === 'DESIGNS' ? 'border-[#0E4A93] text-[#0E4A93]' : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  Designs
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutSubTab('LAYOUTS')}
                  className={`flex-1 text-center py-3 border-b-2 transition-colors cursor-pointer ${
                    layoutSubTab === 'LAYOUTS' ? 'border-[#0E4A93] text-[#0E4A93]' : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  Layouts
                </button>
              </div>

              {layoutSubTab === 'DESIGNS' && (
                <div className="p-4 space-y-3 overflow-y-auto">
                  <div className="relative">
                    <select
                      value={designCategory}
                      onChange={(e) => setDesignCategory(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] appearance-none"
                    >
                      {DESIGN_TEMPLATE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {DESIGN_TEMPLATES.filter((t) => t.category === designCategory).map((tpl) => {
                      const isSelected = selectedTemplateId === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => handleApplyTemplate(tpl)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-center p-3 shadow-xs ${tpl.swatchClass} ${
                            isSelected ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/30' : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {/* Mockup photo slot representing where the uploaded photo will sit */}
                          <div className="w-3/5 aspect-square rounded-md bg-black/10 border border-black/10 flex items-center justify-center">
                            {tpl.emoji && <span className="text-xl">{tpl.emoji}</span>}
                          </div>
                          <span className="text-[11px] font-bold leading-tight">{tpl.name}</span>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selectedTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(null);
                        setCustomText('');
                        setActiveClipart(null);
                      }}
                      className="w-full py-1 text-rose-600 hover:underline font-bold text-center text-[11px]"
                    >
                      Remove Design/Template
                    </button>
                  )}
                </div>
              )}

              {layoutSubTab === 'LAYOUTS' && (
                <div className="p-4 space-y-2 overflow-y-auto">
                  <p className="text-[11px] text-stone-500 pb-1">
                    Choose how many photos go on your canvas — this switches the product and size to match.
                  </p>
                  {LAYOUT_PRESETS.map((preset) => {
                    const isExpanded = expandedLayoutId === preset.id;
                    const isSelected = selectedProductTypeId === preset.productTypeId && selectedSizeId === preset.sizeId;
                    return (
                      <div
                        key={preset.id}
                        className={`border rounded-xl overflow-hidden ${isSelected ? 'border-[#0E4A93]' : 'border-stone-200'}`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedLayoutId(isExpanded ? null : preset.id)}
                          className={`w-full flex items-center justify-between px-3 py-3 text-xs font-bold transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/40 text-[#0E4A93]' : 'bg-white text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {preset.label}
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#0E4A93]" />}
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isExpanded && (
                          <div className="p-3 border-t border-stone-100 bg-stone-50">
                            <div
                              onClick={() => handleSelectLayoutPreset(preset)}
                              className={`cursor-pointer p-2.5 rounded-lg border-2 transition-all ${
                                isSelected ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20' : 'border-stone-200 hover:border-stone-300 bg-white'
                              }`}
                            >
                              {renderLayoutThumbnail(preset.arrangement)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------- SHAPE -------------------------------- */}
          {activeTab === 'SHAPE' && (
            <div className="flex flex-col h-full">
              {!shapeApplies ? (
                <div className="p-4 text-xs text-stone-500 space-y-3">
                  <p>
                    Laser-cut shapes are only available on single-panel canvases. Switch to <strong>Classic Canvas Print</strong> or{' '}
                    <strong>Panoramic Canvas Print</strong> under Products to choose a shape.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center border-b border-stone-200 text-[10px] font-black uppercase tracking-wide shrink-0">
                    {SHAPE_FILTER_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setShapeFilterCategory(tab.id)}
                        className={`flex-1 text-center py-3 border-b-2 transition-colors cursor-pointer ${
                          shapeFilterCategory === tab.id ? 'border-[#0E4A93] text-[#0E4A93]' : 'border-transparent text-stone-400 hover:text-stone-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 grid grid-cols-3 gap-2.5 overflow-y-auto">
                    {filteredShapes.map((shape) => {
                      const isSelected = selectedShapeId === shape.id;
                      return (
                        <div
                          key={shape.id}
                          onClick={() => setSelectedShapeId(shape.id)}
                          className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                            isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-400 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center z-10">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <div
                            className="w-full aspect-square bg-gradient-to-br from-[#0E4A93]/70 to-[#0E4A93]/30"
                            style={{ clipPath: shape.clipPathStyle, WebkitClipPath: shape.clipPathStyle }}
                          />
                          <div className="text-[10px] font-bold text-stone-800 leading-tight">{shape.name}</div>
                          <div className="text-[10px] font-semibold text-stone-500">{shape.priceAddon === 0 ? 'Included' : `+₹${shape.priceAddon}`}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* --------------------------- WRAP & BORDER --------------------------- */}
          {activeTab === 'WRAP & BORDER' && (
            <div className="flex flex-col">
              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Wrap</div>
              <div className="p-4 grid grid-cols-2 gap-2.5">
                {WRAP_OPTIONS.map((w) => {
                  const isSelected = selectedWrapId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWrapId(w.id)}
                      className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer text-center space-y-1 ${
                        isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {w.badge && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase bg-[#E8752A] text-white px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                          {w.badge}
                        </span>
                      )}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      {/* Mini side-profile mockup: photo face + visible wrap depth, scaled to the real inch depth */}
                      <div className="w-14 h-14 mx-auto flex items-end justify-center" style={{ perspective: '80px' }}>
                        <div className="relative w-10 h-10 bg-stone-100 border border-stone-300 rounded-sm shadow-xs overflow-hidden">
                          <div className="absolute inset-1 bg-gradient-to-br from-sky-200 to-emerald-200 rounded-xs" />
                        </div>
                        <div
                          className="bg-gradient-to-b from-amber-700 to-amber-950 rounded-r-xs shadow-inner"
                          style={{ width: `${w.depthPx}px`, height: '40px', marginLeft: '-2px' }}
                        />
                      </div>
                      <div className="text-[11px] font-bold text-stone-800 leading-tight">
                        {w.label} {w.depth && <span className="text-stone-400">({w.depth})</span>}
                      </div>
                      <div className="text-[11px] font-semibold text-stone-500">{w.price === 0 ? 'Included' : `+₹${w.price}`}</div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Mirror Image</div>
              <div className="p-4">
                <label
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                    mirrorImage ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <FlipHorizontal2 className="w-4 h-4 text-stone-500" />
                    Flip photo horizontally
                  </span>
                  <input type="checkbox" checked={mirrorImage} onChange={(e) => setMirrorImage(e.target.checked)} className="accent-[#0E4A93] w-4 h-4" />
                </label>
                {!shapeApplies && <p className="text-[11px] text-stone-400 mt-1.5">Applies to the active photo panel.</p>}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Border</div>
              {!shapeApplies ? (
                <div className="p-4 text-[11px] text-stone-500">
                  A print border is only available on single-panel canvases. Switch to Classic or Panoramic Canvas under Products.
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {ACRYLIC_BORDER_WIDTHS.map((bw) => {
                      const isSelected = selectedBorderWidthId === bw.id;
                      return (
                        <button
                          key={bw.id}
                          type="button"
                          onClick={() => setSelectedBorderWidthId(bw.id)}
                          className={`py-2.5 px-1 rounded-xl border-2 text-center transition-all cursor-pointer ${
                            isSelected ? 'border-[#0E4A93] bg-blue-50/30 text-[#0E4A93]' : 'border-stone-200 text-stone-600 hover:border-stone-300 bg-white'
                          }`}
                        >
                          {/* Mockup: photo swatch with a border ring sized to the real width */}
                          <div
                            className="w-9 h-9 mx-auto mb-1.5 rounded-xs"
                            style={{ backgroundColor: bw.widthPx === 0 ? 'transparent' : selectedBorderColor, padding: `${Math.min(bw.widthPx, 10)}px` }}
                          >
                            <div className="w-full h-full rounded-xs bg-gradient-to-br from-sky-200 to-emerald-200" />
                          </div>
                          <div className="text-[10px] font-black leading-tight">{bw.label.split(' ')[0]}</div>
                          <div className="text-[9px] text-stone-400 mt-0.5">
                            {CANVAS_BORDER_WIDTH_PRICES[bw.id] === 0 ? 'Free' : `+₹${CANVAS_BORDER_WIDTH_PRICES[bw.id]}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedBorderWidthId !== 'none' && (
                    <div className="flex items-center gap-2">
                      {ACRYLIC_BORDER_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setSelectedBorderColor(c.hex)}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            selectedBorderColor === c.hex ? 'ring-2 ring-[#0E4A93] ring-offset-2' : 'border-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Frames</div>
              {!shapeApplies ? (
                <div className="p-4 text-[11px] text-stone-500">
                  An outer frame is only available on single-panel canvases. Switch to Classic or Panoramic Canvas under Products.
                </div>
              ) : (
                <div className="p-4 grid grid-cols-3 gap-2.5">
                  {FRAME_OPTIONS.map((f) => {
                    const isSelected = selectedFrameId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFrameId(f.id)}
                        className={`relative p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center space-y-1 ${
                          isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        {/* Mockup: a small photo sitting inside this frame's actual border color */}
                        <div
                          className="w-11 h-11 rounded mx-auto p-1.5"
                          style={
                            f.id === 'no-frame'
                              ? {
                                  backgroundImage:
                                    'repeating-conic-gradient(#d6d3d1 0% 25%, #f5f5f4 0% 50%)',
                                  backgroundSize: '8px 8px',
                                  border: '1px solid #d6d3d1'
                                }
                              : { backgroundColor: f.color, border: f.color === '#ffffff' ? '1px solid #d6d3d1' : undefined }
                          }
                        >
                          <div className="w-full h-full rounded-xs bg-gradient-to-br from-sky-200 to-emerald-200" />
                        </div>
                        <div className="text-[10px] font-bold text-stone-800 leading-tight">{f.name}</div>
                        <div className="text-[10px] font-semibold text-stone-500">{f.price === 0 ? 'Free' : `+₹${f.price.toFixed(0)}`}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -------------------------- HARDWARE & FINISH ------------------------- */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="flex flex-col">
              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Hardware Option &amp; Style</div>
              <div className="p-4 grid grid-cols-3 gap-2.5">
                {HARDWARE_OPTIONS.map((hw) => {
                  const isSelected = selectedHardwareId === hw.id;
                  return (
                    <div
                      key={hw.id}
                      onClick={() => setSelectedHardwareId(hw.id)}
                      className={`relative p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center space-y-1 ${
                        isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-9 h-9 bg-stone-200 rounded mx-auto" />
                      <div className="text-[10px] font-bold text-stone-800 leading-tight">{hw.label}</div>
                      <div className="text-[10px] font-semibold text-stone-500">{hw.price === 0 ? 'Free' : `₹${hw.price}`}</div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Display Option</div>
              <div className="p-4 space-y-2">
                {DISPLAY_OPTIONS.map((opt) => {
                  const isSelected = selectedDisplayOptionId === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <input
                          type="radio"
                          name="display-option"
                          checked={isSelected}
                          onChange={() => setSelectedDisplayOptionId(opt.id)}
                          className="accent-[#0E4A93]"
                        />
                        {opt.label} ({opt.price === 0 ? '₹0.00' : `₹${opt.price.toFixed(2)}`})
                      </span>
                      <Info className="w-3.5 h-3.5 text-stone-400" />
                    </label>
                  );
                })}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Optional Color Finishing</div>
              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-stone-600">Basic</div>
                <div className="grid grid-cols-3 gap-2.5">
                  {COLOR_FINISH_OPTIONS.map((cf) => {
                    const activePanelFilter = panelImages[activePanelIndex]?.filter || 'original';
                    const isSelected = activePanelFilter === cf.id;
                    const previewImage = panelImages[activePanelIndex]?.imageUrl;
                    return (
                      <div
                        key={cf.id}
                        onClick={() => handleApplyFilter(cf.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-stone-100 ${
                          isSelected ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/30' : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {previewImage ? (
                          <img src={previewImage} alt={cf.label} style={{ filter: getFilterCss(cf.id) }} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] font-bold text-center py-0.5">
                          {cf.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] text-stone-400">Free — applies to the active photo panel.</div>
              </div>
            </div>
          )}

          {/* ------------------------------ OPTIONS ------------------------------ */}
          {activeTab === 'OPTIONS' && (
            <div className="flex flex-col">
              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Lamination Options</div>
              <div className="p-4 space-y-2">
                {LAMINATION_OPTIONS.map((lam) => {
                  const isSelected = selectedLaminationId === lam.id;
                  return (
                    <label
                      key={lam.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <input
                          type="radio"
                          name="lamination"
                          checked={isSelected}
                          onChange={() => setSelectedLaminationId(lam.id)}
                          className="accent-[#0E4A93]"
                        />
                        {lam.label}
                      </span>
                      <span className="text-xs font-black text-stone-700">{lam.price === 0 ? '' : `(₹${lam.price.toFixed(2)})`}</span>
                    </label>
                  );
                })}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Minor Photo Retouching</div>
              <div className="p-4 grid grid-cols-2 gap-2.5">
                {RETOUCH_CHECKS.map((rc) => (
                  <label key={rc.id} className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(retouchChecks[rc.id])}
                      onChange={(e) => setRetouchChecks((prev) => ({ ...prev, [rc.id]: e.target.checked }))}
                      className="accent-[#0E4A93] w-4 h-4"
                    />
                    {rc.label}
                  </label>
                ))}
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Major Retouching</div>
              <div className="p-4 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Requirements for retouching</label>
                <textarea
                  value={majorRetouchText}
                  onChange={(e) => setMajorRetouchText(e.target.value)}
                  rows={3}
                  placeholder="Describe any major retouching you'd like our team to do..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-[#0E4A93]"
                />
              </div>

              <div className="bg-stone-700 text-white text-xs font-black uppercase tracking-wide px-4 py-2.5">Proof Request</div>
              <div className="p-4 space-y-2">
                <label className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proofRequested}
                    onChange={(e) => setProofRequested(e.target.checked)}
                    className="accent-[#0E4A93] w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span>
                    Email with link to the design proof will be emailed within 24 hours and has to be approved online. Approve
                    your proof as quickly as possible to avoid delays in production and shipping times.
                  </span>
                </label>
                <p className="text-[11px] text-stone-400">
                  <strong>Note:</strong> All prints manufactured by Canvas India are handmade and might have a ± 1 inch
                  variation from the size ordered.
                </p>
              </div>

              <div className="p-4 space-y-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">Quantity:</label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-950 font-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-xs font-bold text-stone-900 min-w-[36px] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-950 font-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">
                    Total: <strong className="text-stone-900">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 3: MAIN RIGHT DESIGN WORKSPACE                               */}
        {/* ------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Yellow Instruction Banner */}
          <div className="w-full bg-[#FEF08A] text-stone-900 text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 border-b border-amber-300 shadow-xs z-10">
            <Move className="w-3.5 h-3.5 text-stone-900" />
            <span>Click and drag within the print lines to Adjust your Photo.</span>
          </div>

          {/* Top-Right Workspace Quick Tools */}
          <div className="absolute top-10 right-4 flex flex-wrap items-center justify-end gap-2 z-20 max-w-[70%]">
            <button
              type="button"
              onClick={handleSaveDesign}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 rounded-lg text-xs font-bold shadow-xs border border-stone-200 transition-all cursor-pointer"
              title="Save design to browser"
            >
              <Save className="w-3.5 h-3.5 text-stone-600" />
              <span>SAVE</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTextPopover(!showTextPopover)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-all cursor-pointer ${
                showTextPopover ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>ADD TEXT</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClipartPopover(!showClipartPopover)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-all cursor-pointer ${
                showClipartPopover ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>ADD CLIPART</span>
            </button>

            {[
              { label: 'ROOM VIEW', icon: Eye },
              { label: '3D VIEW', icon: Box },
              { label: '360° VIEW', icon: RotateCw }
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  type="button"
                  onClick={() => {
                    setSaveToast(`${tool.label.replace('°', '')} preview is coming soon.`);
                    setTimeout(() => setSaveToast(null), 2500);
                  }}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 rounded-lg text-xs font-bold shadow-xs border border-stone-200 transition-all cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-stone-600" />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Floating Tool Popover: ADD TEXT */}
          {showTextPopover && (
            <div className="absolute top-22 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>Add Custom Text</span>
                <button onClick={() => setShowTextPopover(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Happy Birthday, Our Family"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0E4A93]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600">Font Size: {textSize}px</span>
                <input
                  type="range"
                  min={14}
                  max={48}
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-28 accent-[#0E4A93]"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-600">Text Color:</span>
                <div className="flex gap-2">
                  {['#FFFFFF', '#000000', '#D4AF37', '#0E4A93', '#E8752A', '#059669'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setTextColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-6 h-6 rounded-full border-2 ${textColor === col ? 'ring-2 ring-[#0E4A93]' : 'border-stone-300'}`}
                    />
                  ))}
                </div>
              </div>
              {customText && (
                <button type="button" onClick={() => setCustomText('')} className="w-full py-1 text-rose-600 hover:underline font-bold text-center text-[11px]">
                  Remove Text
                </button>
              )}
            </div>
          )}

          {/* Quick Floating Tool Popover: ADD CLIPART */}
          {showClipartPopover && (
            <div className="absolute top-22 right-4 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>Select Clipart / Sticker</span>
                <button onClick={() => setShowClipartPopover(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-2xl text-center">
                {CLIPART_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setActiveClipart(item === activeClipart ? null : item);
                      setShowClipartPopover(false);
                    }}
                    className={`p-2 rounded-xl border hover:scale-110 transition-transform cursor-pointer ${
                      activeClipart === item ? 'border-[#0E4A93] bg-blue-50' : 'border-stone-200 bg-stone-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {activeClipart && (
                <button type="button" onClick={() => setActiveClipart(null)} className="w-full py-1 text-rose-600 hover:underline font-bold text-center text-[11px]">
                  Remove Clipart
                </button>
              )}
            </div>
          )}

          {/* Notification Toast for Save */}
          {saveToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-30 animate-in fade-in slide-in-from-top-2">
              {saveToast}
            </div>
          )}

          {/* Center Stage / Design Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
            {/* Left Chevron Button: Prev Step */}
            <button
              type="button"
              onClick={() => setActiveTab(prevTab.id)}
              disabled={activeTabIndex === 0}
              className={`hidden lg:flex flex-col items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all group z-20 ${
                activeTabIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5 max-w-[64px] leading-tight">{prevTab.label}</span>
            </button>

            {/* Right Chevron Button: Next Step */}
            <button
              type="button"
              onClick={() => setActiveTab(nextTab.id)}
              disabled={activeTabIndex === TOOLBAR_ITEMS.length - 1}
              className={`hidden lg:flex flex-col items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all group z-20 ${
                activeTabIndex === TOOLBAR_ITEMS.length - 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5 max-w-[64px] leading-tight">{nextTab.label}</span>
            </button>

            {/* CANVAS PANELS PREVIEW CONTAINER */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full">
              {/* Dimension rulers (single-panel products only) */}
              {panels.length === 1 && (
                <>
                  <div className="hidden sm:flex items-center gap-2 mb-2 text-[10px] font-bold text-stone-400">
                    <span className="w-24 border-t border-dashed border-stone-300" />
                    <span className="px-2.5 py-0.5 rounded-full border border-stone-300 bg-white shadow-xs">
                      {isCustomSize && canUseCustomSize ? `${customWidth} inch` : `${panels[0].widthRatio} inch`}
                    </span>
                    <span className="w-24 border-t border-dashed border-stone-300" />
                  </div>
                  <div className="hidden sm:flex items-center gap-1 self-start ml-2 mb-[-1.5rem]">
                    <Ban className="w-3.5 h-3.5 text-stone-300" />
                  </div>
                </>
              )}

              {/* WALL DISPLAY 3-PIECE LAYOUT */}
              {selectedProductTypeId === 'canvas-wall-art' && panels.length === 3 && (
                <div className="flex flex-col items-center gap-3.5 w-full max-w-lg">
                  <div
                    onClick={() => setActivePanelIndex(0)}
                    onPointerDown={(e) => handlePointerDown(e, 0)}
                    className={`relative w-full aspect-[18/12] bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
                      activePanelIndex === 0 ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30' : 'border-stone-300 shadow-md hover:border-stone-400'
                    }`}
                  >
                    {panelImages[0]?.imageUrl ? (
                      <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                        <img
                          src={panelImages[0].imageUrl}
                          alt="Panel 1"
                          style={{
                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg)`,
                            filter: getFilterCss(panelImages[0].filter),
                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                          }}
                          className="max-w-none w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-orange-50 text-[#E8752A] flex items-center justify-center mb-1 shadow-xs">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-stone-600">Panel 1 (12" × 18")</span>
                        <span className="text-[10px] text-stone-400">Click to upload photo</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">12" × 18"</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    {[1, 2].map((panelIdx) => (
                      <div
                        key={panelIdx}
                        onClick={() => setActivePanelIndex(panelIdx)}
                        onPointerDown={(e) => handlePointerDown(e, panelIdx)}
                        className={`relative w-full aspect-[8/10] bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
                          activePanelIndex === panelIdx ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30' : 'border-stone-300 shadow-md hover:border-stone-400'
                        }`}
                      >
                        {panelImages[panelIdx]?.imageUrl ? (
                          <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                            <img
                              src={panelImages[panelIdx].imageUrl!}
                              alt={`Panel ${panelIdx + 1}`}
                              style={{
                                transform: `translate(${panelImages[panelIdx].panX}px, ${panelImages[panelIdx].panY}px) scale(${panelImages[panelIdx].scale}) rotate(${panelImages[panelIdx].rotation}deg)`,
                                filter: getFilterCss(panelImages[panelIdx].filter),
                                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                              }}
                              className="max-w-none w-full h-full object-cover pointer-events-none"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#E8752A] flex items-center justify-center mb-1 shadow-xs">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-stone-600">Panel {panelIdx + 1} (10" × 8")</span>
                            <span className="text-[10px] text-stone-400">Click to upload</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">10" × 8"</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SINGLE PANEL LAYOUTS (Classic, Panoramic) — shape, border & frame aware */}
              {selectedProductTypeId !== 'canvas-wall-art' && panels.length === 1 && (() => {
                const frameOption = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
                const borderWidthPx = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0;
                const panelBox = (
                  <div
                    onClick={() => setActivePanelIndex(0)}
                    onPointerDown={(e) => handlePointerDown(e, 0)}
                    className={`relative w-full max-w-md ${currentShape.aspectClass} ${currentShape.borderRadiusClass} bg-white overflow-hidden transition-all cursor-pointer group border-2 ${
                      activePanelIndex === 0 ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30' : 'border-stone-300 shadow-md hover:border-stone-400'
                    }`}
                    style={{ clipPath: currentShape.clipPathStyle, WebkitClipPath: currentShape.clipPathStyle }}
                  >
                    {panelImages[0]?.imageUrl ? (
                      <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                        <img
                          src={panelImages[0].imageUrl}
                          alt="Canvas Print"
                          style={{
                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                            filter: getFilterCss(panelImages[0].filter),
                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                          }}
                          className="max-w-none w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 hover:text-stone-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-[#E8752A] flex items-center justify-center mb-1.5 shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#E8752A]">Upload an Image</span>
                        <span className="text-[11px] text-stone-400 mt-0.5">Maximum upload size: 25MB per file</span>
                      </div>
                    )}

                    {borderWidthPx > 0 && (
                      <div
                        className="absolute inset-0 pointer-events-none z-25"
                        style={{ border: `${borderWidthPx}px solid ${selectedBorderColor}`, borderRadius: currentShape.id === 'shape-circle' ? '9999px' : undefined }}
                      />
                    )}

                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
                      {isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.dimensionsSummary}
                    </div>
                  </div>
                );

                if (frameOption && frameOption.id !== 'no-frame') {
                  return (
                    <div className="p-3 rounded-2xl shadow-xl w-full max-w-md mx-auto" style={{ background: frameOption.color }}>
                      {panelBox}
                    </div>
                  );
                }
                return panelBox;
              })()}

              {/* SPLIT CANVAS (3-Panel Triptych Layout) */}
              {selectedProductTypeId === 'canvas-split' && panels.length === 3 && renderGridPanels([0, 1, 2], 'grid-cols-3')}

              {/* PHOTO COLLAGE (2 / 3 / 4-Grid Layouts) */}
              {selectedProductTypeId === 'canvas-collage' && panels.length === 2 && renderGridPanels([0, 1], 'grid-cols-2')}
              {selectedProductTypeId === 'canvas-collage' && panels.length === 3 && renderGridPanels([0, 1, 2], 'grid-cols-3')}
              {selectedProductTypeId === 'canvas-collage' && panels.length === 4 && renderGridPanels([0, 1, 2, 3], 'grid-cols-2')}

              {/* Creative Overlays: Custom Text */}
              {customText && (
                <div
                  className="absolute pointer-events-none select-none z-30 font-black tracking-wide drop-shadow-md px-4 text-center max-w-xs"
                  style={{ color: textColor, fontSize: `${textSize}px`, textAlign }}
                >
                  {customText}
                </div>
              )}

              {/* Creative Overlays: Clipart */}
              {activeClipart && (
                <div className="absolute top-1/4 right-1/4 text-4xl pointer-events-none drop-shadow-lg z-30 animate-bounce">{activeClipart}</div>
              )}

              {/* FLOATING TRANSFORM CONTROLS FOR ACTIVE PANEL */}
              {panelImages[activePanelIndex]?.imageUrl && (
                <div className="flex items-center gap-1.5 mt-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-stone-200 z-20">
                  <button type="button" onClick={handleZoomIn} className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer" title="Zoom In (+15%)">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={handleZoomOut} className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer" title="Zoom Out (-15%)">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-stone-200 mx-0.5" />
                  <button type="button" onClick={handleRotate90} className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer" title="Rotate 90°">
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={handleFit} className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-xs font-bold" title="Fit to bounds">
                    Fit
                  </button>
                  <button type="button" onClick={handleReset} className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer" title="Reset transformations">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-stone-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => {
                      setPanelImages((prev) => ({ ...prev, [activePanelIndex]: createDefaultPanel() }));
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Remove this photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Button: CHANGE MATERIAL (Canvas India Blue #0E4A93) */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(true)}
                  className="px-6 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs font-black rounded-lg shadow-md transition-all cursor-pointer tracking-wider uppercase"
                >
                  CHANGE MATERIAL
                </button>
              </div>
            </div>
          </div>

          {/* Validation Prompt Banner if Photos Missing */}
          {!isComplete && (
            <div className="bg-amber-50 border-t border-amber-200 py-2 px-4 text-center text-xs font-bold text-amber-900 z-10">
              Upload an image to continue with your personalized canvas order.
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* 3. POPUP MODALS                                                       */}
      {/* ===================================================================== */}

      {materialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">Select Canvas Material Variant</h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {MATERIAL_VARIANTS.map((mat) => {
                const isSelected = selectedMaterialId === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => {
                      setSelectedMaterialId(mat.id);
                      setMaterialModalOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? 'border-[#0E4A93] bg-blue-50/30' : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-900">{mat.name}</div>
                      <div className="text-[11px] text-stone-500">{mat.desc}</div>
                    </div>
                    <span className="text-xs font-black text-[#0E4A93]">{mat.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {chatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-stone-900">Need Customization Help?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Our canvas printing specialists in Hyderabad are available to help with high-res photos and dimensions.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs font-bold">
              <a
                href="https://wa.me/917893051555?text=Hello%20Canvas%20India,%20I%20need%20help%20with%20customizing%20my%20Canvas%20print."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>WhatsApp: 78930 51555</span>
              </a>
              <a href="tel:+917893051555" className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Phone className="w-4 h-4 text-stone-600" />
                <span>Call: 78930 51555</span>
              </a>
            </div>

            <button type="button" onClick={() => setChatModalOpen(false)} className="text-xs text-stone-400 hover:text-stone-700 font-bold">
              Close
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex z-50 animate-in fade-in">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <img src="/canvas-india-official-logo.png" alt="Canvas India" className="h-8 w-auto object-contain" />
                <button onClick={() => setMenuOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <Link to={`/products/${catalogProduct.slug || catalogProduct.id}`} className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg">
                  ← Return to Product Page
                </Link>
                <Link to="/canvas" className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg">
                  View All Canvas Products
                </Link>
                <Link to="/" className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg">
                  Homepage
                </Link>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="font-bold text-stone-900">Official Company Details</div>
                <div>H NO 4-9-197/8184, HMT Nagar Main Road, Nacharam, Hyderabad, Telangana – 500076</div>
                <div>Phone / WhatsApp: 78930 51555</div>
                <div>Email: info@canvassindia.com</div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 pt-4 border-t border-stone-100">Canvas India &copy; 2026. All rights reserved.</div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default CanvasCustomizerPage;
