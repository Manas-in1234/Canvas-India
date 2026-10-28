import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  RotateCcw,
  RotateCw,
  RefreshCw,
  Type,
  Smile,
  Layers,
  LayoutGrid,
  SlidersHorizontal,
  Save,
  ShoppingCart,
  Check,
  Trash2,
  Move,
  Grid,
  Crop,
  Eye,
  Box,
  Ban,
  Info,
  Monitor,
  Smartphone,
  Laptop,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Shapes,
  FlipHorizontal2,
  AlertCircle,
  Edit3,
  Quote,
  Palette,
  LayoutTemplate,
  Music,
  Pipette
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { QuotesTemplateSidebarPanel } from '../components/QuotesTemplateSidebarPanel';
import { SelectPreferenceModal } from '../components/SelectPreferenceModal';
import { QuotesCreateOwnPanel } from '../components/QuotesCreateOwnPanel';
import { getQuoteTemplate, QuoteTemplateItem, QUOTE_TEMPLATES } from '../data/quoteTemplatesData';
import { WordArtSizeRatioModal } from '../components/WordArtSizeRatioModal';
import { WordArtPersonalizeModal } from '../components/WordArtPersonalizeModal';
import { DigitalPaintingOptionsPanel } from '../components/DigitalPaintingOptionsPanel';
import {
  DEFAULT_DIGITAL_PAINTING_CONFIG,
  type DigitalPaintingConfig,
  type DigitalPaintingEffectId,
  getDigitalPaintingEffect
} from '../data/digitalPaintingData';
import { BusRollLineEditorPanel } from '../components/BusRollLineEditorPanel';
import { BusRollBackgroundPanel } from '../components/BusRollBackgroundPanel';
import { BusRollTemplatePanel } from '../components/BusRollTemplatePanel';
import { BusRollTopToolbar } from '../components/BusRollTopToolbar';
import {
  DEFAULT_BUS_ROLL_CONFIG,
  type BusRollConfig,
  generateBusRollSvgDataUrl
} from '../data/busRollData';
import {
  WORD_ART_SIZE_CATALOG,
  DEFAULT_WORD_ART_CONFIG,
  type WordArtSizeOption,
  type WordArtConfig,
  renderWordArtToCanvas
} from '../data/wordArtData';
import { CanvasBannerSizePanel } from '../components/CanvasBannerSizePanel';
import {
  type CanvasBannerConfig,
  type BannerSizeCategory,
  DEFAULT_CANVAS_BANNER_CONFIG,
  CANVAS_BANNER_SIZE_OPTIONS,
  CANVAS_BANNER_HARDWARE_OPTIONS,
  BANNER_BACKGROUND_PRESETS,
  calculateBannerPrice,
  formatDimension,
  convertToInches,
} from '../data/canvasBannerData';
import { PopArtStyleModal } from '../components/PopArtStyleModal';
import {
  type PopArtConfig,
  type PopArtStyleId,
  type PopArtStyleOption,
  POP_ART_STYLES,
  POP_ART_SIZE_OPTIONS,
  getPopArtStyle,
  DEFAULT_POP_ART_CONFIG
} from '../data/popArtData';
import { processPopArtImage } from '../utils/popArtProcessor';
import { SelectLyricTemplateModal } from '../components/SelectLyricTemplateModal';
import { LyricStudioPanel } from '../components/LyricStudioPanel';
import {
  type LyricCanvasConfig,
  type LyricCanvasTemplate,
  type LyricTemplateId,
  LYRIC_CANVAS_TEMPLATES,
  LYRIC_CANVAS_SIZE_OPTIONS,
  DEFAULT_LYRIC_CONFIG,
  getLyricTemplate
} from '../data/lyricCanvasData';
import { fetchApprovedCustomShapes, toShapeOption, type CustomShapeDto } from '../api/customShapesApi';
import {
  CANVAS_SHAPES,
  CanvasShapeOption,
  CANVAS_PRODUCT_TYPES,
  CanvasProductType,
  CANVAS_WRAP_OPTIONS,
  CANVAS_THICKNESS_OPTIONS,
  CANVAS_HARDWARE_OPTIONS,
  CANVAS_DISPLAY_OPTIONS,
  CANVAS_FINISH_OPTIONS,
  FRAME_OPTIONS,
  ACRYLIC_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS,
  getCanvasProductCapabilities,
  resolveCanvasProductTypeId,
  isCanvasEdge3DProduct,
  CANVAS_EDGE_3D_PRODUCT_IDS,
  ClipartItem
} from '../data/canvasCustomizerData';
import {
  getLayoutSlots,
  LayoutSlotDefinition,
  LAYOUT_PRESETS as STANDARD_LAYOUT_PRESETS,
  ACRYLIC_PRODUCT_TYPES,
  HARDWARE_OPTIONS as ACRYLIC_HARDWARE_OPTIONS,
  THICKNESS_OPTIONS as ACRYLIC_THICKNESS_OPTIONS
} from '../data/acrylicCustomizerData';
import { CustomizerProductSelector } from '../components/CustomizerProductSelector';
import { CustomizerPreloader, PRELOADER_MIN_MS } from '../components/CustomizerPreloader';
import { AcrylicShapePreview } from '../components/AcrylicShapePreview';
import { AcrylicRoomViewModal, RoomPlacementState } from '../components/AcrylicRoomViewModal';
import { SelectSizeShapeModal } from '../components/SelectSizeShapeModal';
import { SelectLayoutModal, LayoutModalOption } from '../components/SelectLayoutModal';
import { AcrylicLiveTextEditor, TextElement } from '../components/AcrylicLiveTextEditor';
import { AcrylicClipartModal, ClipartElement } from '../components/AcrylicClipartModal';
import { getProductSizeShapeOptions, getSizesForProductAndShape } from '../data/productSizeShapeConfig';
import { bulkUnitPriceFor, MIN_BULK_QTY } from './BulkOrdersPage';
import {
  getCanvasProductGeometry,
  getHexagonClusterLayout,
  HEXAGON_CLIP_PATH,
  HEXAGON_HORIZONTAL_CLIP_PATH,
  HEXAGON_VERTICAL_CLIP_PATH,
  getProductLayouts,
  getProductLayout,
  renderProductLayoutDiagram,
  ProductLayoutDefinition
} from '../data/productGeometry';
import {
  CustomizerHeader,
  CustomizerSidebar,
  CustomizerPanel,
  CustomizerOptionCard,
  CustomizerTopToolbar,
  CustomizerPreviewArea
} from '../components/CustomizerUiShell';

// ============================================================================
// 1. CONSTANTS & CANVAS-ONLY DATA DEFINITIONS
// ============================================================================

type ToolbarTab =
  | 'PRODUCTS'
  | 'POP ART STYLE'
  | 'LYRIC TEMPLATE'
  | 'UPLOAD'
  | 'SELECT SIZE'
  | 'EFFECTS & OPTIONS'
  | 'CREATE BUS ROLL'
  | 'BACKGROUND'
  | 'TEMPLATE'
  | 'LAYOUTS & DESIGNS'
  | 'WRAP & BORDER'
  | 'HARDWARE & FINISH'
  | 'OPTIONS';

const TOOLBAR_ITEMS: { id: ToolbarTab; label: string; icon: React.ElementType }[] = [
  { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
  { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
  { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
  { id: 'EFFECTS & OPTIONS', label: 'EFFECTS & OPTIONS', icon: Palette },
  { id: 'CREATE BUS ROLL', label: 'CREATE BUS ROLL', icon: Type },
  { id: 'BACKGROUND', label: 'BACKGROUND', icon: Palette },
  { id: 'TEMPLATE', label: 'TEMPLATE', icon: LayoutTemplate },
  { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers },
  { id: 'WRAP & BORDER', label: 'WRAP & BORDER', icon: Crop },
  { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal },
  { id: 'OPTIONS', label: 'OPTIONS', icon: Menu }
];

const SHAPE_FILTER_TABS: { id: 'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'BASIC', label: 'Basic' },
  { id: 'SPECIAL', label: 'Special' },
  { id: 'DECORATIVE', label: 'Decorative' }
];

const CANVAS_BORDER_WIDTH_PRICES: Record<string, number> = { none: 0, thin: 0, 'custom-color': 0, medium: 89, thick: 149 };

type ColorFilterType = 'original' | 'sepia' | 'grayscale';

const getFilterCss = (filter: ColorFilterType): string => {
  switch (filter) {
    case 'sepia':
      return 'sepia(0.85) contrast(1.1) brightness(0.95)';
    case 'grayscale':
      return 'grayscale(100%) contrast(1.05)';
    case 'original':
    default:
      return 'none';
  }
};

const getDigitalPaintingFilterCss = (effectId: DigitalPaintingEffectId): string => {
  switch (effectId) {
    case 'effect-charcoal':
      return 'grayscale(100%) contrast(1.6) brightness(1.05)';
    case 'effect-knife':
      return 'contrast(1.35) saturate(1.45) brightness(1.03)';
    case 'effect-comic':
      return 'contrast(1.4) saturate(1.8) brightness(1.02)';
    case 'effect-oil':
    default:
      return 'contrast(1.18) saturate(1.35) brightness(1.02)';
  }
};
type SizeCategory = 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL' | 'MULTI_PANEL' | 'RECTANGLE';

interface SizeOption {
  id: string;
  productTypeId: string;
  label: string;
  dimensionsSummary: string;
  price: number;
  categories: SizeCategory[];
  widthInches?: number;
  heightInches?: number;
  panelsCount?: number;
  arrangement?: string;
  diagramType?: string;
  panels: Array<{
    id: string;
    label: string;
    dimension: string;
    widthRatio: number;
    heightRatio: number;
  }>;
}

const SIZE_OPTIONS: SizeOption[] = [
  // 1. Single Print (canvas-single)
  // SQUARE (4 sizes: 10", 16", 18", 20" - default 10"x10")
  {
    id: 'single-10x10',
    productTypeId: 'canvas-single',
    label: '10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 250.0,
    categories: ['SQUARE', 'RECOMMENDED', 'SMALL'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'single-16x16',
    productTypeId: 'canvas-single',
    label: '16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 577.0,
    categories: ['SQUARE', 'RECOMMENDED', 'SMALL'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'single-18x18',
    productTypeId: 'canvas-single',
    label: '18" × 18"',
    dimensionsSummary: '18" × 18"',
    price: 749.0,
    categories: ['SQUARE', 'RECOMMENDED', 'LARGE'],
    widthInches: 18,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'single-20x20',
    productTypeId: 'canvas-single',
    label: '20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 999.0,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 20,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },

  // PANORAMIC (8 rectangle/panoramic sizes)
  {
    id: 'single-12x8',
    productTypeId: 'canvas-single',
    label: '12" × 8"',
    dimensionsSummary: '12" × 8"',
    price: 299.0,
    categories: ['PANORAMIC', 'SMALL'],
    widthInches: 12,
    heightInches: 8,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '12" × 8"', widthRatio: 12, heightRatio: 8 }]
  },
  {
    id: 'single-18x12',
    productTypeId: 'canvas-single',
    label: '18" × 12"',
    dimensionsSummary: '18" × 12"',
    price: 449.0,
    categories: ['PANORAMIC', 'RECOMMENDED', 'SMALL'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'single-20x16',
    productTypeId: 'canvas-single',
    label: '20" × 16"',
    dimensionsSummary: '20" × 16"',
    price: 599.0,
    categories: ['PANORAMIC'],
    widthInches: 20,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '20" × 16"', widthRatio: 20, heightRatio: 16 }]
  },
  {
    id: 'single-24x12',
    productTypeId: 'canvas-single',
    label: '24" × 12"',
    dimensionsSummary: '24" × 12"',
    price: 599.0,
    categories: ['PANORAMIC'],
    widthInches: 24,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '24" × 12"', widthRatio: 24, heightRatio: 12 }]
  },
  {
    id: 'single-24x16',
    productTypeId: 'canvas-single',
    label: '24" × 16"',
    dimensionsSummary: '24" × 16"',
    price: 799.0,
    categories: ['PANORAMIC', 'RECOMMENDED'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '24" × 16"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'single-32x16',
    productTypeId: 'canvas-single',
    label: '32" × 16"',
    dimensionsSummary: '32" × 16"',
    price: 999.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 32,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '32" × 16"', widthRatio: 32, heightRatio: 16 }]
  },
  {
    id: 'single-30x20',
    productTypeId: 'canvas-single',
    label: '30" × 20"',
    dimensionsSummary: '30" × 20"',
    price: 1199.0,
    categories: ['PANORAMIC', 'RECOMMENDED', 'LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '30" × 20"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'single-36x24',
    productTypeId: 'canvas-single',
    label: '36" × 24"',
    dimensionsSummary: '36" × 24"',
    price: 1599.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 36,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Canvas', dimension: '36" × 24"', widthRatio: 36, heightRatio: 24 }]
  },

  // Acrylic Single Print (acrylic-print)
  {
    id: 'rec-10x10',
    productTypeId: 'acrylic-print',
    label: '10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 799.00,
    categories: ['SQUARE', 'RECOMMENDED', 'SMALL'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'rec-16x16',
    productTypeId: 'acrylic-print',
    label: '16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 1799.00,
    categories: ['SQUARE', 'RECOMMENDED', 'SMALL'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'rec-18x18',
    productTypeId: 'acrylic-print',
    label: '18" × 18"',
    dimensionsSummary: '18" × 18"',
    price: 2299.00,
    categories: ['SQUARE', 'RECOMMENDED', 'LARGE'],
    widthInches: 18,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'rec-12x18',
    productTypeId: 'acrylic-print',
    label: '12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1250.00,
    categories: ['PANORAMIC', 'RECOMMENDED', 'SMALL'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'rec-16x24',
    productTypeId: 'acrylic-print',
    label: '16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 2190.00,
    categories: ['PANORAMIC', 'RECOMMENDED'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '16" × 24"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'rec-20x30',
    productTypeId: 'acrylic-print',
    label: '20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 3490.00,
    categories: ['PANORAMIC', 'RECOMMENDED', 'LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '20" × 30"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'sq-10x10',
    productTypeId: 'acrylic-print',
    label: '10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 799.00,
    categories: ['SQUARE', 'SMALL'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'sq-16x16',
    productTypeId: 'acrylic-print',
    label: '16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 1799.00,
    categories: ['SQUARE', 'SMALL'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'sq-18x18',
    productTypeId: 'acrylic-print',
    label: '18" × 18"',
    dimensionsSummary: '18" × 18"',
    price: 2299.00,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 18,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'sq-20x20',
    productTypeId: 'acrylic-print',
    label: '20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 2799.00,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 20,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'pan-12x18',
    productTypeId: 'acrylic-print',
    label: '12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1250.00,
    categories: ['PANORAMIC', 'SMALL'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'pan-12x24',
    productTypeId: 'acrylic-print',
    label: '12" × 24"',
    dimensionsSummary: '12" × 24"',
    price: 1699.00,
    categories: ['PANORAMIC'],
    widthInches: 24,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '12" × 24"', widthRatio: 24, heightRatio: 12 }]
  },
  {
    id: 'pan-16x24',
    productTypeId: 'acrylic-print',
    label: '16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 2190.00,
    categories: ['PANORAMIC'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '16" × 24"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'pan-16x32',
    productTypeId: 'acrylic-print',
    label: '16" × 32"',
    dimensionsSummary: '16" × 32"',
    price: 2890.00,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 32,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '16" × 32"', widthRatio: 32, heightRatio: 16 }]
  },
  {
    id: 'pan-20x30',
    productTypeId: 'acrylic-print',
    label: '20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 3490.00,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '20" × 30"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'pan-24x36',
    productTypeId: 'acrylic-print',
    label: '24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 4990.00,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 36,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '24" × 36"', widthRatio: 36, heightRatio: 24 }]
  },
  {
    id: 'lg-20x30',
    productTypeId: 'acrylic-print',
    label: '20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 2490.00,
    categories: ['LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '20" × 30"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'lg-24x36',
    productTypeId: 'acrylic-print',
    label: '24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 3150.00,
    categories: ['LARGE'],
    widthInches: 36,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '24" × 36"', widthRatio: 36, heightRatio: 24 }]
  },
  {
    id: 'lg-30x40',
    productTypeId: 'acrylic-print',
    label: '30" × 40"',
    dimensionsSummary: '30" × 40"',
    price: 4200.00,
    categories: ['LARGE'],
    widthInches: 40,
    heightInches: 30,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '30" × 40"', widthRatio: 40, heightRatio: 30 }]
  },
  {
    id: 'sm-4x6',
    productTypeId: 'acrylic-print',
    label: '4" × 6"',
    dimensionsSummary: '4" × 6"',
    price: 355.00,
    categories: ['SMALL'],
    widthInches: 6,
    heightInches: 4,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '4" × 6"', widthRatio: 6, heightRatio: 4 }]
  },
  {
    id: 'sm-5x7',
    productTypeId: 'acrylic-print',
    label: '5" × 7"',
    dimensionsSummary: '5" × 7"',
    price: 420.00,
    categories: ['SMALL'],
    widthInches: 7,
    heightInches: 5,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '5" × 7"', widthRatio: 7, heightRatio: 5 }]
  },
  {
    id: 'sm-6x8',
    productTypeId: 'acrylic-print',
    label: '6" × 8"',
    dimensionsSummary: '6" × 8"',
    price: 490.00,
    categories: ['SMALL'],
    widthInches: 8,
    heightInches: 6,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Acrylic', dimension: '6" × 8"', widthRatio: 8, heightRatio: 6 }]
  },

  // 2. Round Canvas (canvas-round) - Starts at ₹721.27
  {
    id: 'round-8x8',
    productTypeId: 'canvas-round',
    label: 'Round: 8" Diameter',
    dimensionsSummary: '8" Dia',
    price: 721.27,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Round Canvas', dimension: '8" Dia', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'round-12x12',
    productTypeId: 'canvas-round',
    label: 'Round: 12" Diameter',
    dimensionsSummary: '12" Dia',
    price: 1099.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Round Canvas', dimension: '12" Dia', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'round-16x16',
    productTypeId: 'canvas-round',
    label: 'Round: 16" Diameter',
    dimensionsSummary: '16" Dia',
    price: 1599.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Round Canvas', dimension: '16" Dia', widthRatio: 16, heightRatio: 16 }]
  },

  // 3. Triangle Canvas (canvas-triangle) - Starts at ₹1,250.79
  {
    id: 'triangle-8x8',
    productTypeId: 'canvas-triangle',
    label: 'Triangle: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 1250.79,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Triangle Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'triangle-12x12',
    productTypeId: 'canvas-triangle',
    label: 'Triangle: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 1699.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Triangle Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },

  // 4. Heart Canvas (canvas-heart) - Starts at ₹1,854.68
  {
    id: 'heart-8x8',
    productTypeId: 'canvas-heart',
    label: 'Heart: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 1854.68,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Heart Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'heart-12x12',
    productTypeId: 'canvas-heart',
    label: 'Heart: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 2299.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Heart Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },

  // 5. Oval Canvas (canvas-oval) - Starts at ₹1,380.67 (Requirement 3: Horizontal & Vertical)
  // Horizontal Oval (W > H)
  {
    id: 'oval-10x8-h',
    productTypeId: 'canvas-oval',
    label: 'Oval: 10" × 8" (Horizontal)',
    dimensionsSummary: '10" × 8"',
    price: 1380.67,
    categories: ['RECOMMENDED', 'SMALL'],
    widthInches: 10,
    heightInches: 8,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '10" × 8"', widthRatio: 10, heightRatio: 8 }]
  },
  {
    id: 'oval-14x10-h',
    productTypeId: 'canvas-oval',
    label: 'Oval: 14" × 10" (Horizontal)',
    dimensionsSummary: '14" × 10"',
    price: 1699.0,
    categories: ['RECOMMENDED'],
    widthInches: 14,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '14" × 10"', widthRatio: 14, heightRatio: 10 }]
  },
  {
    id: 'oval-16x12-h',
    productTypeId: 'canvas-oval',
    label: 'Oval: 16" × 12" (Horizontal)',
    dimensionsSummary: '16" × 12"',
    price: 1999.0,
    categories: ['RECOMMENDED'],
    widthInches: 16,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '16" × 12"', widthRatio: 16, heightRatio: 12 }]
  },
  {
    id: 'oval-20x16-h',
    productTypeId: 'canvas-oval',
    label: 'Oval: 20" × 16" (Horizontal)',
    dimensionsSummary: '20" × 16"',
    price: 2599.0,
    categories: ['LARGE'],
    widthInches: 20,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '20" × 16"', widthRatio: 20, heightRatio: 16 }]
  },
  {
    id: 'oval-24x18-h',
    productTypeId: 'canvas-oval',
    label: 'Oval: 24" × 18" (Horizontal)',
    dimensionsSummary: '24" × 18"',
    price: 3299.0,
    categories: ['LARGE'],
    widthInches: 24,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '24" × 18"', widthRatio: 24, heightRatio: 18 }]
  },
  // Vertical Oval (W < H)
  {
    id: 'oval-8x10',
    productTypeId: 'canvas-oval',
    label: 'Oval: 8" × 10" (Vertical)',
    dimensionsSummary: '8" × 10"',
    price: 1380.67,
    categories: ['RECOMMENDED', 'SMALL'],
    widthInches: 8,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }]
  },
  {
    id: 'oval-10x14-v',
    productTypeId: 'canvas-oval',
    label: 'Oval: 10" × 14" (Vertical)',
    dimensionsSummary: '10" × 14"',
    price: 1699.0,
    categories: ['RECOMMENDED'],
    widthInches: 10,
    heightInches: 14,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '10" × 14"', widthRatio: 10, heightRatio: 14 }]
  },
  {
    id: 'oval-12x16',
    productTypeId: 'canvas-oval',
    label: 'Oval: 12" × 16" (Vertical)',
    dimensionsSummary: '12" × 16"',
    price: 1899.0,
    categories: ['RECOMMENDED'],
    widthInches: 12,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 }]
  },
  {
    id: 'oval-16x20-v',
    productTypeId: 'canvas-oval',
    label: 'Oval: 16" × 20" (Vertical)',
    dimensionsSummary: '16" × 20"',
    price: 2599.0,
    categories: ['LARGE'],
    widthInches: 16,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'oval-18x24-v',
    productTypeId: 'canvas-oval',
    label: 'Oval: 18" × 24" (Vertical)',
    dimensionsSummary: '18" × 24"',
    price: 3299.0,
    categories: ['LARGE'],
    widthInches: 18,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },

  // 6. Wall Display (canvas-wall-art) - Starts at ₹856.90
  {
    id: 'wd-3p-12x18-10x8',
    productTypeId: 'canvas-wall-art',
    label: '3-piece (1) 12"x18", (2) 10"x8"',
    dimensionsSummary: '(1) 12"x18", (2) 10"x8"',
    price: 856.90,
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

  // 7. Photo Collage (canvas-collage) - Starts at ₹148.50
  {
    id: 'col-2p-16x8',
    productTypeId: 'canvas-collage',
    label: '2-Photo Grid: 16" × 8"',
    dimensionsSummary: '2 Photos (8" × 8" ea)',
    price: 148.50,
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
  },

  // 8. Hexagon Prints (canvas-hexagon) - Starts at ₹449.00
  {
    id: 'hexagon-1p-10x11',
    productTypeId: 'canvas-hexagon',
    label: 'Single Hexagonal Print',
    dimensionsSummary: '10" × 11.5"',
    price: 449.0,
    categories: ['RECOMMENDED', 'SMALL'],
    widthInches: 10,
    heightInches: 11.5,
    panelsCount: 1,
    diagramType: 'hexagon-1',
    panels: [{ id: 'p0', label: 'Hexagon', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 }]
  },
  {
    id: 'hexagon-2p-19x10',
    productTypeId: 'canvas-hexagon',
    label: 'Hexagonal Prints Bundle of 2',
    dimensionsSummary: '19" × 10" (2 Hexagons)',
    price: 899.0,
    categories: ['RECOMMENDED', 'MULTI_PANEL'],
    widthInches: 19,
    heightInches: 10,
    panelsCount: 2,
    diagramType: 'hexagon-2',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 }
    ]
  },
  {
    id: 'hexagon-3p-27x13.75',
    productTypeId: 'canvas-hexagon',
    label: 'Hexagonal Prints Bundle of 3',
    dimensionsSummary: '27" × 13.75" (3 Hexagons)',
    price: 1299.0,
    categories: ['RECOMMENDED', 'MULTI_PANEL'],
    widthInches: 27,
    heightInches: 13.75,
    panelsCount: 3,
    diagramType: 'hexagon-3',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 }
    ]
  },
  {
    id: 'hexagon-4p-27x19',
    productTypeId: 'canvas-hexagon',
    label: 'Hexagonal Prints Bundle of 4',
    dimensionsSummary: '27" × 19" (4 Hexagons)',
    price: 1699.0,
    categories: ['RECOMMENDED', 'MULTI_PANEL'],
    widthInches: 27,
    heightInches: 19,
    panelsCount: 4,
    diagramType: 'hexagon-4',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 }
    ]
  },

  // 9. Split Canvas (canvas-split) - Starts at ₹188.10
  {
    id: 'split-3p-36x24',
    productTypeId: 'canvas-split',
    label: '3-Panel Triptych: 36" × 24" total',
    dimensionsSummary: '(3) 12" × 24"',
    price: 188.10,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [
      { id: 'p0', label: 'Panel 1 (Left)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p1', label: 'Panel 2 (Center)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
    ]
  },
  {
    id: 'split-3p-48x32',
    productTypeId: 'canvas-split',
    label: '3-Panel Triptych: 48" × 32" total',
    dimensionsSummary: '(3) 16" × 32"',
    price: 2499.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [
      { id: 'p0', label: 'Panel 1 (Left)', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 },
      { id: 'p1', label: 'Panel 2 (Center)', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 }
    ]
  },

  // 10. Photo Mosaic (canvas-mosaic) - Starts at ₹148.50
  {
    id: 'mosaic-4p-12x12',
    productTypeId: 'canvas-mosaic',
    label: '4-Photo Mosaic Grid: 12" × 12"',
    dimensionsSummary: '4 Photos (6" × 6" ea)',
    price: 148.50,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [
      { id: 'p0', label: 'Mosaic Slot 1', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p1', label: 'Mosaic Slot 2', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p2', label: 'Mosaic Slot 3', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p3', label: 'Mosaic Slot 4', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 }
    ]
  },

  // 11. Lyric on Canvas (canvas-lyric) - Starts at ₹1,498.50
  {
    id: 'lyric-8x8',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 1498.50,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'lyric-10x10',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 1699.00,
    categories: ['SQUARE', 'SMALL'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'lyric-12x12',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 1899.00,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'lyric-16x16',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 2299.00,
    categories: ['SQUARE', 'SMALL'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'lyric-12x18',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1999.0,
    categories: ['RECOMMENDED', 'SMALL'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'lyric-16x20',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 16" × 20"',
    dimensionsSummary: '16" × 20"',
    price: 2499.00,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'lyric-18x24',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 18" × 24"',
    dimensionsSummary: '18" × 24"',
    price: 2999.00,
    categories: ['PANORAMIC', 'LARGE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },
  {
    id: 'lyric-20x20',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 2799.00,
    categories: ['SQUARE', 'LARGE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'lyric-20x30',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 3499.00,
    categories: ['PANORAMIC', 'LARGE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '20" × 30"', widthRatio: 20, heightRatio: 30 }]
  },
  {
    id: 'lyric-24x36',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 4299.00,
    categories: ['PANORAMIC', 'LARGE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  },

  // 12. Digital Painting (canvas-digital-painting) - Starts at ₹2,199.00
  {
    id: 'painting-10x10',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 2199.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'painting-12x18',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 2598.0,
    categories: ['RECOMMENDED', 'SMALL'],
    widthInches: 12,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'painting-18x12',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 18" × 12"',
    dimensionsSummary: '18" × 12"',
    price: 2598.0,
    categories: ['PANORAMIC', 'SMALL'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'painting-16x16',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 2899.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'painting-18x18',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 18" × 18"',
    dimensionsSummary: '18" × 18"',
    price: 3299.0,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 18,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'painting-20x20',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 3799.0,
    categories: ['RECOMMENDED', 'SQUARE', 'LARGE'],
    widthInches: 20,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'painting-16x24',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 3299.0,
    categories: ['RECOMMENDED', 'LARGE'],
    widthInches: 16,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },
  {
    id: 'painting-24x16',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 24" × 16"',
    dimensionsSummary: '24" × 16"',
    price: 3299.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '24" × 16"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'painting-20x30',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 4499.0,
    categories: ['RECOMMENDED', 'LARGE'],
    widthInches: 20,
    heightInches: 30,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '20" × 30"', widthRatio: 20, heightRatio: 30 }]
  },
  {
    id: 'painting-24x36',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 5499.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 24,
    heightInches: 36,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  },

  // 13. Quotes on Canvas (canvas-quotes) - Starts at ₹999.00
  {
    id: 'quotes-8x8',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 999.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 8,
    heightInches: 8,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'quotes-10x10',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 1199.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'quotes-12x12',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 1399.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 12,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'quotes-16x16',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 1799.0,
    categories: ['SQUARE', 'SMALL'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'quotes-12x18',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1499.0,
    categories: ['RECOMMENDED', 'SMALL'],
    widthInches: 12,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'quotes-18x12',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 18" × 12"',
    dimensionsSummary: '18" × 12"',
    price: 1499.0,
    categories: ['PANORAMIC', 'SMALL'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'quotes-18x18',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 18" × 18"',
    dimensionsSummary: '18" × 18"',
    price: 1799.0,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 18,
    heightInches: 18,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '18" × 18"', widthRatio: 18, heightRatio: 18 }]
  },
  {
    id: 'quotes-20x20',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 2199.0,
    categories: ['SQUARE', 'LARGE'],
    widthInches: 20,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'quotes-16x24',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 2199.0,
    categories: ['RECOMMENDED', 'LARGE'],
    widthInches: 16,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },
  {
    id: 'quotes-24x16',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 24" × 16"',
    dimensionsSummary: '24" × 16"',
    price: 2199.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '24" × 16"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'quotes-30x20',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 30" × 20"',
    dimensionsSummary: '30" × 20"',
    price: 2599.0,
    categories: ['PANORAMIC', 'RECOMMENDED', 'LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '30" × 20"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'quotes-36x24',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 36" × 24"',
    dimensionsSummary: '36" × 24"',
    price: 3199.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 36,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '36" × 24"', widthRatio: 36, heightRatio: 24 }]
  },

  // 14. Bus Roll (canvas-bus-roll) - Starts at ₹599.00
  {
    id: 'bus-21x32',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 21" × 32"',
    dimensionsSummary: '21" × 32"',
    price: 1499.0,
    widthInches: 21,
    heightInches: 32,
    categories: ['RECOMMENDED', 'RECTANGLE'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '21" × 32"', widthRatio: 21, heightRatio: 32 }]
  },
  {
    id: 'bus-12x36',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 12" × 36"',
    dimensionsSummary: '12" × 36"',
    price: 705.60,
    widthInches: 12,
    heightInches: 36,
    categories: ['RECOMMENDED', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '12" × 36"', widthRatio: 12, heightRatio: 36 }]
  },
  {
    id: 'bus-16x48',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 16" × 48"',
    dimensionsSummary: '16" × 48"',
    price: 1199.0,
    widthInches: 16,
    heightInches: 48,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '16" × 48"', widthRatio: 16, heightRatio: 48 }]
  },
  {
    id: 'bus-8x24',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 8" × 24"',
    dimensionsSummary: '8" × 24"',
    price: 599.0,
    widthInches: 8,
    heightInches: 24,
    categories: ['SMALL', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '8" × 24"', widthRatio: 8, heightRatio: 24 }]
  },
  {
    id: 'bus-10x30',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 10" × 30"',
    dimensionsSummary: '10" × 30"',
    price: 899.0,
    widthInches: 10,
    heightInches: 30,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '10" × 30"', widthRatio: 10, heightRatio: 30 }]
  },
  {
    id: 'bus-20x8',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 20" × 8"',
    dimensionsSummary: '20" × 8"',
    price: 699.0,
    widthInches: 20,
    heightInches: 8,
    categories: ['RECOMMENDED', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '20" × 8"', widthRatio: 20, heightRatio: 8 }]
  },
  {
    id: 'bus-24x12',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 24" × 12"',
    dimensionsSummary: '24" × 12"',
    price: 899.0,
    widthInches: 24,
    heightInches: 12,
    categories: ['RECTANGLE'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '24" × 12"', widthRatio: 24, heightRatio: 12 }]
  },
  {
    id: 'bus-36x12',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 36" × 12"',
    dimensionsSummary: '36" × 12"',
    price: 1199.0,
    widthInches: 36,
    heightInches: 12,
    categories: ['LARGE', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '36" × 12"', widthRatio: 36, heightRatio: 12 }]
  },

  // 15. Canvas Banner (canvas-banner) - Starts at ₹399.00
  {
    id: 'banner-12x18',
    productTypeId: 'canvas-banner',
    label: 'Hanging Banner: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 399.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Banner Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'banner-16x24',
    productTypeId: 'canvas-banner',
    label: 'Hanging Banner: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 699.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Banner Canvas', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },

  // 16. Pop Art (canvas-pop-art) - Starts at ₹399.00 (Requirement 5: Predefined sizes across all categories)
  // Small & Square
  {
    id: 'pop-8x8',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 399.0,
    categories: ['SMALL', 'SQUARE'],
    widthInches: 8,
    heightInches: 8,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'pop-8x10',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 8" × 10"',
    dimensionsSummary: '8" × 10"',
    price: 449.0,
    categories: ['SMALL', 'RECOMMENDED'],
    widthInches: 8,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }]
  },
  {
    id: 'pop-10x10',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 499.0,
    categories: ['SMALL', 'SQUARE'],
    widthInches: 10,
    heightInches: 10,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'pop-12x8',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 12" × 8"',
    dimensionsSummary: '12" × 8"',
    price: 499.0,
    categories: ['SMALL', 'PANORAMIC'],
    widthInches: 12,
    heightInches: 8,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 8"', widthRatio: 12, heightRatio: 8 }]
  },
  {
    id: 'pop-12x12',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 598.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    widthInches: 12,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'pop-14x11',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 14" × 11"',
    dimensionsSummary: '14" × 11"',
    price: 699.0,
    categories: ['SMALL'],
    widthInches: 14,
    heightInches: 11,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '14" × 11"', widthRatio: 14, heightRatio: 11 }]
  },
  // Panoramic
  {
    id: 'pop-18x12',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 18" × 12"',
    dimensionsSummary: '18" × 12"',
    price: 799.0,
    categories: ['PANORAMIC', 'RECOMMENDED'],
    widthInches: 18,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'pop-24x12',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 24" × 12"',
    dimensionsSummary: '24" × 12"',
    price: 999.0,
    categories: ['PANORAMIC'],
    widthInches: 24,
    heightInches: 12,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 12"', widthRatio: 24, heightRatio: 12 }]
  },
  {
    id: 'pop-24x16',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 24" × 16"',
    dimensionsSummary: '24" × 16"',
    price: 1299.0,
    categories: ['PANORAMIC', 'RECOMMENDED'],
    widthInches: 24,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 16"', widthRatio: 24, heightRatio: 16 }]
  },
  {
    id: 'pop-30x20',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 30" × 20"',
    dimensionsSummary: '30" × 20"',
    price: 1799.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 30,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '30" × 20"', widthRatio: 30, heightRatio: 20 }]
  },
  {
    id: 'pop-36x24',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 36" × 24"',
    dimensionsSummary: '36" × 24"',
    price: 2299.0,
    categories: ['PANORAMIC', 'LARGE'],
    widthInches: 36,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '36" × 24"', widthRatio: 36, heightRatio: 24 }]
  },
  // Square & Large
  {
    id: 'pop-16x16',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 999.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    widthInches: 16,
    heightInches: 16,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'pop-16x20',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 16" × 20"',
    dimensionsSummary: '16" × 20"',
    price: 1399.0,
    categories: ['LARGE'],
    widthInches: 16,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'pop-18x24',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 18" × 24"',
    dimensionsSummary: '18" × 24"',
    price: 1599.0,
    categories: ['LARGE'],
    widthInches: 18,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },
  {
    id: 'pop-20x20',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 1499.0,
    categories: ['LARGE', 'SQUARE'],
    widthInches: 20,
    heightInches: 20,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'pop-24x24',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 24" × 24"',
    dimensionsSummary: '24" × 24"',
    price: 1999.0,
    categories: ['LARGE', 'SQUARE'],
    widthInches: 24,
    heightInches: 24,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 24"', widthRatio: 24, heightRatio: 24 }]
  },
  {
    id: 'pop-24x30',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 24" × 30"',
    dimensionsSummary: '24" × 30"',
    price: 2199.0,
    categories: ['LARGE'],
    widthInches: 24,
    heightInches: 30,
    panelsCount: 1,
    diagramType: 'single-shape',
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '24" × 30"', widthRatio: 24, heightRatio: 30 }]
  },

  // 17. Word Art (canvas-word-art) - Starts at ₹198.00
  {
    id: 'word-12x12',
    productTypeId: 'canvas-word-art',
    label: 'Word Art: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 198.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Word Art Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'word-16x16',
    productTypeId: 'canvas-word-art',
    label: 'Word Art: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 399.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Word Art Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },

  // 18. Classic Canvas Print (canvas-classic) - Starts at ₹99.00
  {
    id: 'classic-8x8',
    productTypeId: 'canvas-classic',
    label: 'Classic: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 99.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'classic-10x10',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 699.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'classic-16x16',
    productTypeId: 'canvas-classic',
    label: 'Canvas: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 1299.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },

  // 18. Canvas Photo Block (canvas-photo-block) - Starts at ₹499.00
  {
    id: 'block-4x4',
    productTypeId: 'canvas-photo-block',
    label: 'Photo Block: 4" × 4"',
    dimensionsSummary: '4" × 4"',
    price: 499.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Block', dimension: '4" × 4"', widthRatio: 4, heightRatio: 4 }]
  },
  {
    id: 'block-6x6',
    productTypeId: 'canvas-photo-block',
    label: 'Photo Block: 6" × 6"',
    dimensionsSummary: '6" × 6"',
    price: 699.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Block', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 }]
  },

  // 19. Canvas Photo Panel (canvas-photo-panel) - Starts at ₹355.00
  {
    id: 'panel-8x8',
    productTypeId: 'canvas-photo-panel',
    label: 'Photo Panel: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 355.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Panel', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'panel-10x12',
    productTypeId: 'canvas-photo-panel',
    label: 'Photo Panel: 10" × 12"',
    dimensionsSummary: '10" × 12"',
    price: 599.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas Panel', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 }]
  },

  // 20. Panoramic Canvas Print (canvas-panoramic) - Starts at ₹1,499.00
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

  // 21. Canvas Signage (canvas-signage) - Starts at ₹799.00
  {
    id: 'sign-12x18',
    productTypeId: 'canvas-signage',
    label: 'Signage: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 799.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas Signage', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  }
];

const CUSTOM_SIZE_STEPS = [6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 40, 44];

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

type DecorType = 'confetti' | 'ribbon' | 'floral' | 'hearts' | 'necktie' | 'balloons';

interface DesignTemplate {
  id: string;
  category: string;
  name: string;
  textPreset: string;
  decor: DecorType;
  accent: string;
  swatchClass: string;
}

const DESIGN_TEMPLATE_CATEGORIES = [
  "Father's Day",
  "Mother's Day",
  "Summer Day",
  "Valentine's Day",
  'Birthday',
  'Wedding',
  'Anniversary'
];

const DESIGN_TEMPLATES: DesignTemplate[] = [
  // Father's Day
  { id: 'tpl-fd-1', category: "Father's Day", name: 'Love You Dad', textPreset: 'Love You Dad', decor: 'necktie', accent: '#0f172a', swatchClass: 'bg-stone-900 text-white' },
  { id: 'tpl-fd-2', category: "Father's Day", name: "Happy Father's Day", textPreset: "Happy Father's Day", decor: 'ribbon', accent: '#0284c7', swatchClass: 'bg-sky-100 text-sky-900' },
  { id: 'tpl-fd-3', category: "Father's Day", name: 'Dad, The Hero', textPreset: 'Dad, The Hero', decor: 'confetti', accent: '#f59e0b', swatchClass: 'bg-emerald-50 text-emerald-900' },

  // Mother's Day
  { id: 'tpl-md-1', category: "Mother's Day", name: 'Best Mom Ever', textPreset: 'Best Mom Ever', decor: 'floral', accent: '#ec4899', swatchClass: 'bg-pink-100 text-pink-900' },
  { id: 'tpl-md-2', category: "Mother's Day", name: "Love You Mom", textPreset: "Love You Mom", decor: 'hearts', accent: '#e11d48', swatchClass: 'bg-rose-50 text-rose-900' },

  // Summer Day
  { id: 'tpl-sd-1', category: 'Summer Day', name: 'Summer Vibes', textPreset: 'Summer Vibes', decor: 'confetti', accent: '#f59e0b', swatchClass: 'bg-amber-100 text-amber-900' },
  { id: 'tpl-sd-2', category: 'Summer Day', name: 'Hello Sunshine', textPreset: 'Hello Sunshine', decor: 'ribbon', accent: '#0284c7', swatchClass: 'bg-cyan-50 text-cyan-900' },

  // Valentine's Day
  { id: 'tpl-vd-1', category: "Valentine's Day", name: 'Be My Valentine', textPreset: 'Be My Valentine', decor: 'hearts', accent: '#e11d48', swatchClass: 'bg-red-100 text-red-900' },
  { id: 'tpl-vd-2', category: "Valentine's Day", name: 'With All My Love', textPreset: 'With All My Love', decor: 'hearts', accent: '#be123c', swatchClass: 'bg-rose-100 text-rose-900' },
  { id: 'tpl-vd-3', category: "Valentine's Day", name: 'Together Forever', textPreset: 'Together Forever', decor: 'hearts', accent: '#e11d48', swatchClass: 'bg-rose-50 text-rose-900' },

  // Birthday
  { id: 'tpl-bd-1', category: 'Birthday', name: 'Happy Birthday', textPreset: 'Happy Birthday!', decor: 'balloons', accent: '#e11d48', swatchClass: 'bg-rose-100 text-rose-900' },
  { id: 'tpl-bd-2', category: 'Birthday', name: 'Another Year Wiser', textPreset: 'Another Year Wiser', decor: 'confetti', accent: '#d97706', swatchClass: 'bg-amber-100 text-amber-900' },

  // Wedding
  { id: 'tpl-wd-1', category: 'Wedding', name: 'Mr & Mrs', textPreset: 'Mr & Mrs', decor: 'floral', accent: '#be123c', swatchClass: 'bg-rose-50 text-rose-900' },
  { id: 'tpl-wd-2', category: 'Wedding', name: 'Forever & Always', textPreset: 'Forever & Always', decor: 'floral', accent: '#78716c', swatchClass: 'bg-white text-stone-900 border border-stone-200' },

  // Anniversary
  { id: 'tpl-an-1', category: 'Anniversary', name: 'Happy Anniversary', textPreset: 'Happy Anniversary', decor: 'hearts', accent: '#dc2626', swatchClass: 'bg-red-50 text-red-900' },
  { id: 'tpl-an-2', category: 'Anniversary', name: 'Together Forever', textPreset: 'Together Forever', decor: 'hearts', accent: '#4338ca', swatchClass: 'bg-indigo-50 text-indigo-900' }
];

// Hand-drawn vector decorations used by design templates (no external images/emoji).
const renderDecorSvg = (decor: DecorType, accent: string, className = 'absolute inset-0 w-full h-full pointer-events-none') => {
  if (decor === 'confetti') {
    const bits = [
      [6, 8, 0], [15, 5, 30], [93, 6, 15], [86, 13, 60],
      [4, 88, 10], [11, 94, 50], [95, 90, 20], [88, 96, 80],
      [50, 5, 0], [50, 95, 0], [5, 50, 0], [95, 50, 0]
    ];
    const palette = [accent, '#f59e0b', '#38bdf8', '#f43f5e'];
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
        {bits.map(([x, y, r], i) => (
          <rect key={i} x={x - 2} y={y - 2} width={4} height={4} rx={0.5} fill={palette[i % palette.length]} opacity={0.85} transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </svg>
    );
  }
  if (decor === 'ribbon') {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
        <path
          d="M0,8 L100,8 L100,20 L91,14 L83,20 L75,14 L67,20 L59,14 L51,20 L43,14 L35,20 L27,14 L19,20 L11,14 L3,20 L0,14 Z"
          fill={accent}
          opacity={0.9}
        />
      </svg>
    );
  }
  if (decor === 'floral') {
    const leaf = (
      <g fill={accent}>
        <path d="M4,4 C16,4 22,12 22,20 C12,20 4,15 4,4 Z" opacity={0.45} />
        <path d="M4,4 C4,16 9,22 20,22 C20,12 15,4 4,4 Z" opacity={0.3} />
        <circle cx="9" cy="9" r="2.4" opacity={0.6} />
      </g>
    );
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
        {leaf}
        <g transform="translate(100,0) scale(-1,1)">{leaf}</g>
        <g transform="translate(0,100) scale(1,-1)">{leaf}</g>
        <g transform="translate(100,100) scale(-1,-1)">{leaf}</g>
      </svg>
    );
  }
  if (decor === 'hearts') {
    const heart = 'M0,3.4 C-1.6,0.6 -5,0.4 -5,3 C-5,5.6 -1.8,7.4 0,9.6 C1.8,7.4 5,5.6 5,3 C5,0.4 1.6,0.6 0,3.4 Z';
    const points = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      return { x: 50 + Math.cos(angle) * 44, y: 50 + Math.sin(angle) * 44 };
    });
    return (
      <svg viewBox="0 0 100 100" className={className}>
        {points.map((p, i) => (
          <path key={i} d={heart} fill={accent} opacity={0.55} transform={`translate(${p.x} ${p.y}) scale(1.3)`} />
        ))}
      </svg>
    );
  }
  if (decor === 'necktie') {
    const stripes = Array.from({ length: 6 }, (_, i) => i * 9 - 20);
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
        <polygon points="0,0 40,0 0,40" fill="#f8fafc" opacity={0.06} />
        {stripes.map((offset, i) => (
          <rect key={i} x={offset} y={-6} width={6} height={60} fill={accent} opacity={0.85} transform="rotate(45 0 0)" />
        ))}
      </svg>
    );
  }
  // balloons
  const colors = [accent, '#f59e0b', '#38bdf8'];
  const positions = [
    { cx: 28, cy: 14 },
    { cx: 50, cy: 9 },
    { cx: 72, cy: 14 }
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      {positions.map((p, i) => (
        <g key={i}>
          <ellipse cx={p.cx} cy={p.cy} rx={7} ry={9} fill={colors[i]} opacity={0.9} />
          <path d={`M${p.cx},${p.cy + 9} C${p.cx - 2},${p.cy + 16} ${p.cx + 2},${p.cy + 20} ${p.cx},${p.cy + 26}`} stroke={colors[i]} strokeWidth={0.6} fill="none" opacity={0.7} />
        </g>
      ))}
    </svg>
  );
};

const WRAP_OPTIONS = CANVAS_WRAP_OPTIONS;
const THICKNESS_OPTIONS = CANVAS_THICKNESS_OPTIONS;

const HARDWARE_OPTIONS = [
  { id: 'no-hooks', label: 'No Hooks', price: 0 },
  { id: 'hooks-hanging', label: 'Hooks for Hanging', price: 0 },
  { id: 'ready-to-hang', label: 'Ready to Hang', price: 0 },
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

const CLIPART_ITEMS = [
  '❤️', '⭐', '🎉', '🎁', '✨', '🌸', '😊', '🌿', '💎', '🎂', '💍', '🏆',
  '🌹', '🦋', '🌈', '☀️', '🌙', '🎈', '🕉️', '🪔', '🐾', '🎓', '🏡', '👑'
];

const FONT_OPTIONS = [
  { id: 'manrope', label: 'Modern', family: 'Manrope, sans-serif' },
  { id: 'playfair', label: 'Elegant', family: '"Playfair Display", serif' },
  { id: 'cormorant', label: 'Classic', family: '"Cormorant Garamond", serif' },
  { id: 'cinzel', label: 'Roman', family: 'Cinzel, serif' },
  { id: 'bodoni', label: 'Fashion', family: '"Bodoni Moda", serif' },
  { id: 'dancing', label: 'Script', family: '"Dancing Script", cursive' },
  { id: 'pacifico', label: 'Playful', family: 'Pacifico, cursive' },
  { id: 'bebas', label: 'Poster', family: '"Bebas Neue", Impact, sans-serif' },
  { id: 'mono', label: 'Typewriter', family: '"Courier New", monospace' }
];

const TEXT_COLORS = ['#FFFFFF', '#000000', '#D4AF37', '#0E4A93', '#E8752A', '#DC2626', '#059669', '#7C3AED'];

interface TextItem {
  id: string;
  text: string;
  fontId: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  x: number; // % of the print area (0-100)
  y: number;
}

interface ClipItem {
  id: string;
  emoji: string;
  size: number;
  x: number;
  y: number;
}

type SelectedItem = { type: 'text' | 'clipart'; id: string } | null;

// Gallery: sample photographs bundled with the site
const GALLERY_PHOTOS = [
  { url: '/assets/acrylic/acrylic-family-print.webp', label: 'Family' },
  { url: '/assets/acrylic/acrylic-abstract-art.webp', label: 'Abstract' },
  { url: '/assets/acrylic/acrylic-custom-wall-art.webp', label: 'Wall art' },
  { url: '/assets/acrylic/acrylic-inspirational-print.webp', label: 'Quote' },
  { url: '/assets/acrylic/acrylic-poster.webp', label: 'Poster' },
  { url: '/assets/acrylic/acrylic-gift.webp', label: 'Gift' },
  { url: '/assets/acrylic/acrylic-decorative-panel.webp', label: 'Decor' },
  { url: '/assets/acrylic/acrylic-photo-panel.webp', label: 'Portrait' }
];

// Procedural artwork from a text prompt (deterministic: same words -> same art). Not an AI model.
const generateArtwork = (prompt: string, variant: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  let h = 2166136261 + variant * 977;
  for (let i = 0; i < prompt.length; i++) {
    h ^= prompt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
  const hue = Math.floor(rand() * 360);
  const grad = ctx.createLinearGradient(0, 0, 1200, 900);
  grad.addColorStop(0, `hsl(${hue}, 70%, 22%)`);
  grad.addColorStop(0.55, `hsl(${(hue + 40) % 360}, 65%, 45%)`);
  grad.addColorStop(1, `hsl(${(hue + 90) % 360}, 75%, 68%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 900);
  for (let i = 0; i < 26; i++) {
    const x = rand() * 1200;
    const y = rand() * 900;
    const r = 40 + rand() * 260;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const hh = (hue + rand() * 140) % 360;
    g.addColorStop(0, `hsla(${hh}, 85%, 65%, ${0.25 + rand() * 0.35})`);
    g.addColorStop(1, `hsla(${hh}, 85%, 65%, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = `hsla(${(hue + i * 25) % 360}, 90%, 85%, 0.35)`;
    ctx.beginPath();
    ctx.moveTo(0, rand() * 900);
    ctx.bezierCurveTo(400, rand() * 900, 800, rand() * 900, 1200, rand() * 900);
    ctx.stroke();
  }
  return canvas.toDataURL('image/jpeg', 0.9);
};

interface PanelImageState {
  imageUrl: string | null;
  uploadedImage?: {
    originalSrc: string;
    width: number;
    height: number;
    aspectRatio: number;
    name?: string;
  } | null;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
  filter: ColorFilterType;
  fitMode: 'contain' | 'cover';
}

const createDefaultPanel = (): PanelImageState => ({
  imageUrl: null,
  uploadedImage: null,
  panX: 0,
  panY: 0,
  scale: 1,
  rotation: 0,
  filter: 'original',
  fitMode: 'cover'
});

// Helper renderers for 3D isometric wraps (CanvasChamp style) & hardware icons
const renderWrapPreview = (id: string) => {
  if (id === 'hanging-canvas') {
    return (
      <div className="w-16 h-14 mx-auto relative flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xs">
          <rect x="20" y="24" width="60" height="6" fill="#b45309" rx="1.5" />
          <path d="M50 12 L32 24 M50 12 L68 24" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="12" r="2.5" fill="#78350f" />
          <rect x="23" y="30" width="54" height="40" fill="#fde047" opacity="0.9" />
          <path d="M23 45 Q 50 35 77 50 L 77 70 L 23 70 Z" fill="#eab308" opacity="0.8" />
          <rect x="20" y="70" width="60" height="6" fill="#b45309" rx="1.5" />
        </svg>
      </div>
    );
  }

  // Acrylic Thickness Previews
  if (id === '3mm' || id === '5mm' || id === '8mm' || id === '18mm') {
    const mmVal = id === '3mm' ? '3mm' : id === '5mm' ? '5mm' : id === '8mm' ? '8mm' : '18mm';
    const sideW = id === '3mm' ? 8 : id === '5mm' ? 14 : id === '8mm' ? 22 : 32;
    return (
      <div className="w-20 h-16 mx-auto relative flex items-center justify-center">
        <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-xs">
          <rect x="4" y="4" width="112" height="82" fill="#f0f9ff" rx="6" stroke="#bae6fd" strokeWidth="1" />
          <g transform="translate(18, 10)">
            <polygon points="8,22 60,6 60,52 8,68" fill="#0284c7" opacity="0.85" />
            <polygon points={`60,6 ${60 + sideW},14 ${60 + sideW},60 60,52`} fill="#0369a1" />
            <polygon points={`8,22 60,6 ${60 + sideW},14 ${8 + sideW},30`} fill="#e0f2fe" opacity="0.9" />
            <line x1={60 + sideW / 2} y1="62" x2={60 + sideW / 2} y2="72" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x={60 + sideW / 2} y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">
              {mmVal}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  const depthValue = id === 'canvas-lite' ? '0.50"' : id === 'thin-gallery' ? '0.75"' : id === 'thick-gallery' ? '1.50"' : 'Custom';
  const sideWidth = id === 'canvas-lite' ? 12 : id === 'thin-gallery' ? 20 : id === 'thick-gallery' ? 30 : 24;

  return (
    <div className="w-20 h-16 mx-auto relative flex items-center justify-center">
      <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-xs">
        <rect x="4" y="4" width="112" height="82" fill="#f8fafc" rx="6" stroke="#e2e8f0" strokeWidth="1" />
        <g transform="translate(18, 10)">
          <polygon points="8,22 60,6 60,52 8,68" fill="#ea580c" />
          <polygon points="8,22 60,6 60,30 8,46" fill="#f97316" opacity="0.85" />
          <polygon points={`60,6 ${60 + sideWidth},14 ${60 + sideWidth},60 60,52`} fill="#9a3412" />
          <polygon points={`8,22 60,6 ${60 + sideWidth},14 ${8 + sideWidth},30`} fill="#ffedd5" opacity="0.9" />
          <line x1={60 + sideWidth / 2} y1="62" x2={60 + sideWidth / 2} y2="72" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x={60 + sideWidth / 2} y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">
            {depthValue}
          </text>
        </g>
      </svg>
    </div>
  );
};

// Helper renderer for realistic floating frame thumbnail cards in sidebar
const renderFloatingFrameThumbnail = (frameId: string) => {
  if (frameId === 'no-frame') {
    return (
      <div className="w-12 h-12 rounded border border-dashed border-stone-300 mx-auto flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 rounded-xs bg-white border border-stone-200 shadow-2xs" />
      </div>
    );
  }

  const isBrown = frameId === 'wood-frame' || frameId.includes('brown');
  const isBlack = frameId === 'black-frame' || frameId.includes('black');
  const isWhite = frameId === 'white-frame' || frameId.includes('white');

  const frameColor = isBrown
    ? '#7e481c'
    : isBlack
    ? '#18181b'
    : isWhite
    ? '#f8fafc'
    : '#bfa15f';

  const mouldingBorder = isBrown
    ? 'border-[#4a240c]'
    : isBlack
    ? 'border-[#09090b]'
    : isWhite
    ? 'border-[#cbd5e1]'
    : 'border-[#7a5e23]';

  return (
    <div
      className={`w-12 h-12 rounded mx-auto p-1.5 shadow-xs relative flex items-center justify-center border ${mouldingBorder}`}
      style={{ backgroundColor: frameColor }}
    >
      {/* Recessed Floater Gap */}
      <div className="w-full h-full bg-[#0c0d0e] p-1 rounded-xs flex items-center justify-center shadow-inner">
        {/* Canvas thumbnail */}
        <div className="w-full h-full bg-stone-100 rounded-2xs border border-stone-300/60 shadow-2xs" />
      </div>
    </div>
  );
};

// Realistic physical floating frame enclosure with deep recessed shadow gap
const renderFloatingFrameContainer = (
  content: React.ReactNode,
  opts: {
    frameId: string;
    displayWidthInches?: number;
    displayHeightInches?: number;
    aspectRatio?: number;
    isMultiPanel?: boolean;
    scale?: number;
  }
) => {
  const frame = FRAME_OPTIONS.find((f) => f.id === opts.frameId);
  if (!frame || frame.id === 'no-frame') {
    return content;
  }

  const isBrown = frame.id === 'wood-frame' || frame.id.includes('brown');
  const isBlack = frame.id === 'black-frame' || frame.id.includes('black');
  const isWhite = frame.id === 'white-frame' || frame.id.includes('white');

  // Hardwood texture/gradient for brown floating frame matching Screenshot 3
  const mouldingGradient = isBrown
    ? 'linear-gradient(135deg, #45220a 0%, #673514 15%, #8c4b1d 40%, #a45a25 50%, #763b17 75%, #4a2208 100%)'
    : isBlack
    ? 'linear-gradient(135deg, #141416 0%, #222225 35%, #2a2a2e 50%, #1c1c1f 75%, #101012 100%)'
    : isWhite
    ? 'linear-gradient(135deg, #edf2f7 0%, #ffffff 40%, #f8fafc 60%, #e2e8f0 100%)'
    : 'linear-gradient(135deg, #997833 0%, #c4a45a 30%, #f5e2a8 50%, #b89342 70%, #7d6024 100%)';

  const outerBorderColor = isBrown
    ? '#381a07'
    : isBlack
    ? '#09090b'
    : isWhite
    ? '#cbd5e1'
    : '#6b5119';

  const bevelShadow = isBrown
    ? 'inset 1.5px 1.5px 2px rgba(255,255,255,0.35), inset -1.5px -1.5px 3px rgba(0,0,0,0.65)'
    : isBlack
    ? 'inset 1px 1px 1.5px rgba(255,255,255,0.2), inset -1.5px -1.5px 3px rgba(0,0,0,0.85)'
    : isWhite
    ? 'inset 1.5px 1.5px 2px rgba(255,255,255,0.9), inset -1.5px -1.5px 3px rgba(0,0,0,0.18)'
    : 'inset 1.5px 1.5px 2px rgba(255,255,255,0.55), inset -1.5px -1.5px 3px rgba(0,0,0,0.5)';

  const mouldingPadding = opts.scale ? Math.max(8, Math.round(18 * opts.scale)) : 18;
  const gapPadding = opts.scale ? Math.max(3, Math.round(7 * opts.scale)) : 7;

  return (
    <div
      className="relative rounded-[3px] transition-all select-none"
      style={{
        padding: `${mouldingPadding}px`,
        background: mouldingGradient,
        border: `1px solid ${outerBorderColor}`,
        boxShadow: '0 20px 48px -4px rgba(0,0,0,0.5), 0 8px 18px -2px rgba(0,0,0,0.32)'
      }}
    >
      {/* Frame moulding bevel & mitred highlights */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[2px]"
        style={{ boxShadow: bevelShadow }}
      />

      {/* Recessed Floater Shadow Gap (Deep inset channel between frame moulding and canvas) */}
      <div
        className="relative bg-[#0b0c0e] rounded-[1px] overflow-hidden"
        style={{
          padding: `${gapPadding}px`,
          boxShadow: 'inset 0 3px 8px 1px rgba(0,0,0,0.88), inset 0 0 3px 1px rgba(0,0,0,0.95)'
        }}
      >
        {/* Elevated Canvas print inside the recessed tray */}
        <div
          className="relative transition-all"
          style={{
            boxShadow: '0 4px 14px 1px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)'
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

const renderHardwareIcon = (id: string) => {
  if (id === 'hooks-hanging') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="15" y="12" width="10" height="14" fill="#94a3b8" rx="2" />
        <circle cx="20" cy="17" r="2.5" fill="#334155" />
        <path d="M15 26 A 7 7 0 0 0 25 26" fill="none" stroke="#475569" strokeWidth="2.5" />
        <rect x="35" y="12" width="10" height="14" fill="#94a3b8" rx="2" />
        <circle cx="40" cy="17" r="2.5" fill="#334155" />
        <path d="M35 26 A 7 7 0 0 0 45 26" fill="none" stroke="#475569" strokeWidth="2.5" />
      </svg>
    );
  }
  if (id === 'ready-to-hang') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M12 28 Q 30 14 48 28" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="10" y="26" width="6" height="10" fill="#64748b" rx="1" />
        <rect x="44" y="26" width="6" height="10" fill="#64748b" rx="1" />
      </svg>
    );
  }
  if (id === 'sawtooth-hanger') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
        <path d="M12 20 L12 28 L16 28 L18 24 L20 28 L22 24 L24 28 L26 24 L28 28 L30 24 L32 28 L34 24 L36 28 L38 24 L40 28 L42 24 L44 28 L48 28 L48 20 Z" fill="#d97706" />
        <circle cx="15" cy="24" r="1.5" fill="#78350f" />
        <circle cx="45" cy="24" r="1.5" fill="#78350f" />
      </svg>
    );
  }
  if (id === 'easel-back') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
        <polygon points="22,10 38,10 44,42 16,42" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
        <polygon points="26,10 34,10 38,42 30,42" fill="#64748b" />
        <line x1="20" y1="32" x2="40" y2="32" stroke="#475569" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 'nail-free-hook') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="18" y="10" width="24" height="30" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" rx="3" />
        <path d="M30 18 L30 32 C30 37 37 37 37 32" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'banner-grommets') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="2" y="2" width="56" height="46" fill="#f8fafc" rx="4" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="12" cy="12" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill="#1e293b" />
        <circle cx="48" cy="12" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="48" cy="12" r="2" fill="#1e293b" />
        <circle cx="12" cy="38" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="12" cy="38" r="2" fill="#1e293b" />
        <circle cx="48" cy="38" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <circle cx="48" cy="38" r="2" fill="#1e293b" />
      </svg>
    );
  }
  if (id === 'banner-pole-pocket') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <rect x="6" y="2" width="48" height="46" fill="#f8fafc" rx="2" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="2" y="4" width="56" height="8" fill="#e2e8f0" rx="2" stroke="#94a3b8" strokeWidth="1" />
        <line x1="6" y1="12" x2="54" y2="12" stroke="#0E4A93" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="2" y="38" width="56" height="8" fill="#e2e8f0" rx="2" stroke="#94a3b8" strokeWidth="1" />
        <line x1="6" y1="38" x2="54" y2="38" stroke="#0E4A93" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    );
  }
  if (id === 'banner-hanging-rails') {
    return (
      <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
        <polyline points="30,3 10,14" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="30,3 50,14" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="30" cy="3" r="2" fill="#d97706" />
        <rect x="4" y="14" width="52" height="6" fill="#92400e" rx="1.5" stroke="#78350f" strokeWidth="0.5" />
        <rect x="8" y="20" width="44" height="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="4" y="42" width="52" height="6" fill="#92400e" rx="1.5" stroke="#78350f" strokeWidth="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
      <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="16" y="12" width="28" height="26" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 3" rx="4" />
      <line x1="22" y1="18" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
};

export type Preset3DAngleId = 'top-left' | 'top-right' | 'left-bottom' | 'right-bottom';

export interface Preset3DAngleOption {
  id: Preset3DAngleId;
  label: string;
  tiltX: number;
  rotY: number;
}

export const PRESET_3D_ANGLES: Preset3DAngleOption[] = [
  { id: 'top-left', label: 'Top Left', tiltX: -20, rotY: 35 },
  { id: 'top-right', label: 'Top Right', tiltX: -20, rotY: -35 },
  { id: 'left-bottom', label: 'Left Bottom', tiltX: 20, rotY: 35 },
  { id: 'right-bottom', label: 'Right Bottom', tiltX: 20, rotY: -35 },
];

// ============================================================================
// 2. MAIN UNIFIED CUSTOMIZER COMPONENT (CANVAS & ACRYLIC)
// ============================================================================

export function resolveAcrylicProductTypeId(
  rawId?: string,
  catProd?: { slug?: string; id?: string; name?: string } | null
): string {
  const directMatch = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === rawId);
  if (directMatch) return directMatch.id;
  const key = (rawId || catProd?.slug || catProd?.id || catProd?.name || '').toLowerCase();
  if (key.includes('wall') || key.includes('display')) return 'acrylic-wall-art';
  if (key.includes('collage')) return 'acrylic-collage';
  if (key.includes('split') || key.includes('triptych')) return 'acrylic-split';
  if (key.includes('mosaic')) return 'acrylic-mosaic';
  if (key.includes('lyric')) return 'acrylic-lyric';
  if (key.includes('digital') || key.includes('painting')) return 'acrylic-digital';
  if (key.includes('quote')) return 'acrylic-quotes';
  if (key.includes('bus')) return 'acrylic-bus-roll';
  if (key.includes('word')) return 'acrylic-word-art';
  if (key.includes('single') || key.includes('print') || key.includes('panel')) return 'acrylic-print';
  return 'acrylic-print';
}

export interface CanvasCustomizerPageProps {
  materialProp?: 'canvas' | 'acrylic';
}

export const CanvasCustomizerPage: React.FC<CanvasCustomizerPageProps> = ({ materialProp }) => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Arrived from a catalogue design's "Customize this Product" button — the
  // artwork is fixed, so there's nothing to upload: the Upload tab is
  // hidden entirely rather than just pre-filled and still reachable.
  const isPrefillMode = Boolean(searchParams.get('prefillImage'));

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const routeMaterial: 'canvas' | 'acrylic' = useMemo(() => {
    if (materialProp) return materialProp;
    const path = location.pathname.toLowerCase();
    if (path.includes('/customize/acrylic') || path.includes('/acrylic')) return 'acrylic';
    return 'canvas';
  }, [materialProp, location.pathname]);

  const [activeMaterial, setActiveMaterial] = useState<'canvas' | 'acrylic'>(routeMaterial);

  useEffect(() => {
    if (routeMaterial !== activeMaterial) {
      setActiveMaterial(routeMaterial);
    }
  }, [routeMaterial]);

  // Matched product from catalog with safe fallback so route never renders blank even if catalog is empty
  const catalogProduct = useMemo(() => {
    const safeList = Array.isArray(allProducts) ? allProducts : [];
    const targetCat = activeMaterial === 'acrylic' ? 'acrylic' : 'canvas';
    return (
      safeList.find((p) => (p.id === productId || p.slug === productId) && p.categorySlug === targetCat) ||
      safeList.find((p) => p.categorySlug === targetCat) ||
      safeList[0] || {
        id: productId || (activeMaterial === 'acrylic' ? 'acrylic-print' : 'canvas-classic'),
        slug: productId || (activeMaterial === 'acrylic' ? 'acrylic-print' : 'canvas-classic'),
        name: activeMaterial === 'acrylic' ? 'Single Print Acrylic' : 'Classic Canvas Print',
        categorySlug: targetCat as any,
        price: activeMaterial === 'acrylic' ? 355 : 499,
        originalPrice: activeMaterial === 'acrylic' ? 799 : 999,
        rating: 4.9,
        reviewsCount: 128,
        image: '/assets/acrylic/acrylic-family-print.webp',
        images: ['/assets/acrylic/acrylic-family-print.webp'],
        sizes: [],
        thicknesses: [],
        orientations: ['Landscape', 'Portrait', 'Square'],
        description: activeMaterial === 'acrylic' ? 'Premium 3mm optical crystal-clear acrylic print.' : 'Stretched 380 GSM cotton canvas on a solid pine frame.',
        highlights: [],
        inStock: true
      }
    );
  }, [allProducts, productId, activeMaterial]);

  const resolveCurrentProductId = (mat: 'canvas' | 'acrylic', id?: string) => {
    if (mat === 'acrylic') {
      return resolveAcrylicProductTypeId(id, catalogProduct);
    }
    return resolveCanvasProductTypeId(id, catalogProduct);
  };

  // Active step in the left toolbar
  const [activeTab, setActiveTab] = useState<ToolbarTab>(() => {
    const initialPt = resolveCurrentProductId(routeMaterial, productId);
    if (initialPt.includes('digital') || initialPt.includes('painting')) return 'EFFECTS & OPTIONS';
    if (initialPt.includes('bus')) return 'CREATE BUS ROLL';
    if (initialPt.includes('banner')) return 'UPLOAD';
    if (searchParams.get('prefillImage')) return 'SELECT SIZE';
    return 'UPLOAD';
  });

  // Preloader overlay: visible for real async work (image reads) for however
  // long that actually takes, plus a short minimum so the brief, instant
  // section switches still get a visible (but not artificially stretched) beat.
  const [preloaderActive, setPreloaderActive] = useState(false);
  const preloaderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloaderPendingRef = useRef(0);

  const beginPreloader = () => {
    preloaderPendingRef.current += 1;
    if (preloaderTimerRef.current) {
      clearTimeout(preloaderTimerRef.current);
      preloaderTimerRef.current = null;
    }
    setPreloaderActive(true);
  };
  const endPreloader = (minMs: number = 0) => {
    const release = () => {
      preloaderPendingRef.current = Math.max(0, preloaderPendingRef.current - 1);
      if (preloaderPendingRef.current === 0) setPreloaderActive(false);
    };
    if (minMs > 0) {
      preloaderTimerRef.current = setTimeout(release, minMs);
    } else {
      release();
    }
  };

  const handleSelectTab = (tabId: ToolbarTab) => {
    setActiveTab(tabId);
    if (tabId === 'POP ART STYLE') {
      setIsPopArtStyleModalOpen(true);
      return;
    }
    if (tabId === 'LYRIC TEMPLATE') {
      setIsLyricTemplateModalOpen(true);
      return;
    }
    if (tabId === 'LAYOUTS & DESIGNS') {
      if (isLayoutProduct) {
        setLayoutSubTab('LAYOUTS');
      }
    }
    beginPreloader();
    endPreloader(PRELOADER_MIN_MS);
  };

  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(() =>
    resolveCurrentProductId(routeMaterial, productId)
  );

  useEffect(() => {
    if (productId) {
      setSelectedProductTypeId(resolveCurrentProductId(activeMaterial, productId));
    }
  }, [productId, activeMaterial]);

  const isHexagonProduct = activeMaterial === 'canvas' && selectedProductTypeId.includes('hexagon');
  const isWallArtProduct = selectedProductTypeId.includes('wall') || selectedProductTypeId.includes('display');
  const isCollageProduct = selectedProductTypeId.includes('collage');
  const isSplitProduct = selectedProductTypeId.includes('split');
  const isMosaicProduct = selectedProductTypeId.includes('mosaic');
  const isLyricProduct = selectedProductTypeId.includes('lyric');
  const isDigitalPaintingProduct = selectedProductTypeId.includes('digital') || selectedProductTypeId.includes('painting');
  const isQuotesProduct = selectedProductTypeId.includes('quote');
  const isBusRollProduct = selectedProductTypeId.includes('bus');
  const isWordArtProduct = selectedProductTypeId.includes('word');
  const isPopArtProduct = selectedProductTypeId.includes('pop');
  const isBannerProduct = selectedProductTypeId.includes('banner');
  const isSinglePrintCanvas = (activeMaterial === 'canvas' && (selectedProductTypeId === 'canvas-single' || selectedProductTypeId === 'canvas-classic')) ||
    (activeMaterial === 'acrylic' && (selectedProductTypeId === 'acrylic-print' || selectedProductTypeId === 'acrylic-single' || selectedProductTypeId === 'acrylic-photo-panel'));
  const isLayoutProduct = isWallArtProduct || isCollageProduct || isHexagonProduct || isSplitProduct || isMosaicProduct;
  const isMultiFrameProduct = isWallArtProduct || isCollageProduct || isHexagonProduct || isSplitProduct || isMosaicProduct;

  const selectedProductType = useMemo(() => {
    const list = activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES;
    return list.find((pt) => pt.id === selectedProductTypeId) || list[0];
  }, [activeMaterial, selectedProductTypeId]);

  // Product capabilities for dynamic sidebar tabs
  const productCapabilities = useMemo(() => {
    if (activeMaterial === 'acrylic') {
      return {
        productId: selectedProductType.id,
        displayName: selectedProductType.name,
        defaultShape: selectedProductType.defaultShape,
        defaultSize: selectedProductType.defaultSizeOptionId,
        edgeColor: '#FFFFFF',
        products: true,
        upload: !isBusRollProduct,
        sizes: !isSplitProduct && !isCollageProduct && !isMosaicProduct && !isWallArtProduct && !isHexagonProduct && !isBusRollProduct,
        shapes: !isSplitProduct && !isCollageProduct && !isMosaicProduct && !isWallArtProduct && !isHexagonProduct && !isBusRollProduct && !isLyricProduct && !isQuotesProduct && !isWordArtProduct,
        layouts: (isSinglePrintCanvas || isLyricProduct) && !isMosaicProduct && !isWallArtProduct && !isCollageProduct && !isSplitProduct && !isHexagonProduct,
        effects: isDigitalPaintingProduct,
        busRoll: isBusRollProduct,
        wrap: true,
        hardware: true,
        options: true,
        roomView: true,
        showPhysicalEdges: false,
        supports3DView: false,
        supports360View: false,
        view3D: false,
        view360: false,
        physicalThickness: 3,
        edgeMode: 'none',
        imageFitMode: 'cover',
        supportsImagePositioning: true,
        ...(selectedProductType.capabilities || {})
      };
    }
    return getCanvasProductCapabilities(selectedProductType as CanvasProductType);
  }, [activeMaterial, selectedProductType, isBusRollProduct, isSplitProduct, isCollageProduct, isMosaicProduct, isWallArtProduct, isHexagonProduct, isLyricProduct, isQuotesProduct, isWordArtProduct, isDigitalPaintingProduct]);

  // Check if current product is single print, shaped canvas, or standard format canvas
  const isSingleOrShapedCanvas = [
    'canvas-single',
    'canvas-classic',
    'canvas-round',
    'canvas-triangle',
    'canvas-heart',
    'canvas-oval',
    'acrylic-print',
    'acrylic-single',
    'acrylic-photo-panel'
  ].includes(selectedProductTypeId) ||
  isLyricProduct ||
  isDigitalPaintingProduct ||
  isQuotesProduct ||
  isBusRollProduct ||
  isBannerProduct ||
  isPopArtProduct ||
  isWordArtProduct;

  // Primary Toolbar items: dynamically filtered by selected product capabilities
  // EXACT ORDER: 1. PRODUCTS, 2. UPLOAD, 3. SELECT SIZE, 4. LAYOUTS & DESIGNS, 5. WRAP & BORDER, 6. HARDWARE & FINISH, 7. OPTIONS
  const toolbarItems = useMemo<{ id: ToolbarTab; label: string; icon: React.ElementType }[]>(() => {
    if (isBusRollProduct) {
      return [
        { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
        { id: 'CREATE BUS ROLL', label: 'CREATE BUS ROLL', icon: Type },
        { id: 'BACKGROUND', label: 'BACKGROUND', icon: Palette },
        { id: 'TEMPLATE', label: 'TEMPLATE', icon: LayoutTemplate },
        { id: 'WRAP & BORDER' as ToolbarTab, label: 'WRAP & BORDER', icon: Crop },
        { id: 'HARDWARE & FINISH', label: 'HARDWARE OPTION & STYLE', icon: SlidersHorizontal },
        { id: 'OPTIONS', label: 'OPTIONS', icon: Menu }
      ];
    }
    if (isPopArtProduct) {
      return [
        { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
        { id: 'POP ART STYLE', label: 'POP ART STYLE', icon: Sparkles },
        { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
        { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
        { id: 'WRAP & BORDER' as ToolbarTab, label: 'WRAP & BORDER', icon: Crop },
        { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal },
        { id: 'OPTIONS', label: 'OPTIONS', icon: Menu }
      ];
    }
    if (isLyricProduct) {
      return [
        { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
        { id: 'LYRIC TEMPLATE', label: 'SELECT TEMPLATE', icon: Music },
        { id: 'UPLOAD', label: 'UPLOAD PHOTO', icon: UploadCloud },
        { id: 'LAYOUTS & DESIGNS', label: 'LYRIC STUDIO', icon: Type },
        { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
        { id: 'WRAP & BORDER' as ToolbarTab, label: 'WRAP & BORDER', icon: Crop },
        { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal },
        { id: 'OPTIONS', label: 'OPTIONS', icon: Menu }
      ];
    }
    const items: { id: ToolbarTab; label: string; icon: React.ElementType; enabled: boolean }[] = [
      { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid, enabled: productCapabilities.products !== false },
      {
        id: 'UPLOAD',
        label: isWordArtProduct
          ? 'WORD ART'
          : isQuotesProduct
          ? 'SELECT TEMPLATE'
          : 'UPLOAD',
        icon: isWordArtProduct
          ? Type
          : isQuotesProduct
          ? Quote
          : UploadCloud,
        enabled: productCapabilities.upload !== false && !isPrefillMode
      },
      // SELECT SIZE / LAYOUTS & DESIGNS sidebar shortcuts only show for
      // single-panel products — multi-panel products (Wall Display,
      // Collage, Split, Hexagon, Mosaic) already prompt for size/layout
      // the moment the product is picked, and "Change Size"/"Change
      // Layout" buttons elsewhere still open the same modals either way;
      // this only hides the redundant sidebar entry, not the feature.
      { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid, enabled: isSinglePrintCanvas || isQuotesProduct || isDigitalPaintingProduct || isPopArtProduct || isLyricProduct || isWordArtProduct },
      { id: 'EFFECTS & OPTIONS', label: 'EFFECTS & OPTIONS', icon: Palette, enabled: productCapabilities.effects === true },
      { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers, enabled: isSinglePrintCanvas || isQuotesProduct || isDigitalPaintingProduct || isPopArtProduct || isLyricProduct || isWordArtProduct },
      { id: 'WRAP & BORDER', label: 'WRAP & BORDER', icon: Crop, enabled: productCapabilities.wrap !== false },
      { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal, enabled: productCapabilities.hardware !== false },
      { id: 'OPTIONS', label: 'OPTIONS', icon: Menu, enabled: productCapabilities.options !== false }
    ];
    return items.filter((item) => item.enabled);
  }, [activeMaterial, productCapabilities, isSingleOrShapedCanvas, isBusRollProduct, isPopArtProduct, isLyricProduct, isWordArtProduct, isQuotesProduct, isPrefillMode, isSinglePrintCanvas, isDigitalPaintingProduct]);

  // Product tabs supported check

  // If the active tab is not supported by the currently selected product,
  // safely revert to the first available tab (UPLOAD is hidden entirely in
  // prefill mode, so it may not be a valid fallback there).
  useEffect(() => {
    const isCurrentTabSupported = toolbarItems.some((item) => item.id === activeTab);
    if (!isCurrentTabSupported && toolbarItems.length > 0) {
      setActiveTab(toolbarItems[0].id);
    }
  }, [toolbarItems, activeTab]);

  const activeTabIndex = Math.max(0, toolbarItems.findIndex((t) => t.id === activeTab));
  const prevTab = toolbarItems[Math.max(0, activeTabIndex - 1)] || toolbarItems[0];
  const nextTab = toolbarItems[Math.min(toolbarItems.length - 1, activeTabIndex + 1)] || toolbarItems[toolbarItems.length - 1];

  // SHAPE tab state
  const [customShapes, setCustomShapes] = useState<CustomShapeDto[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchApprovedCustomShapes().then((shapes) => {
      if (!cancelled) setCustomShapes(shapes);
    });
    return () => { cancelled = true; };
  }, []);
  const customShapeOptions = useMemo(() => customShapes.map(toShapeOption), [customShapes]);
  const [selectedShapeId, setSelectedShapeId] = useState<string>(() => {
    const initialPt = resolveCurrentProductId(routeMaterial, productId);
    if (initialPt === 'canvas-single' || initialPt === 'canvas-classic') {
      return 'shape-square';
    }
    const list = routeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES;
    const pt = list.find((p) => p.id === initialPt);
    return pt?.defaultShape || 'shape-square';
  });
  const [shapeFilterCategory, setShapeFilterCategory] = useState<'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'>('ALL');

  const currentShape = useMemo<CanvasShapeOption>(() => {
    const list = activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES;
    const pt = list.find((p) => p.id === selectedProductTypeId);
    const targetShapeId =
      !selectedShapeId.startsWith('custom-') && pt?.supportedShapeIds && pt.supportedShapeIds.length === 1
        ? pt.supportedShapeIds[0]
        : selectedShapeId;
    return customShapeOptions.find((s) => s.id === targetShapeId)
      || CANVAS_SHAPES.find((s) => s.id === targetShapeId) || CANVAS_SHAPES[0];
  }, [activeMaterial, selectedProductTypeId, selectedShapeId, customShapeOptions]);

  // Available size options for the current product type and active shape (from centralized productSizeShapeConfig)
  const availableSizeOptions = useMemo<SizeOption[]>(() => {
    if (isSinglePrintCanvas) {
      if (activeMaterial === 'acrylic') {
        return SIZE_OPTIONS.filter((s) => s.productTypeId === 'acrylic-print' || s.productTypeId === 'acrylic-photo-panel');
      }
      return SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-single' || s.productTypeId === 'canvas-classic');
    }

    if (isQuotesProduct) {
      const base = SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-quotes');
      if (activeMaterial === 'acrylic') {
        return base.map((s) => ({
          ...s,
          productTypeId: 'acrylic-quotes',
          price: s.id === 'quotes-8x8' ? 355.00 : Math.round(s.price * 0.355)
        }));
      }
      return base;
    }

    if (isDigitalPaintingProduct) {
      const base = SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-digital-painting');
      if (activeMaterial === 'acrylic') {
        return base.map((s) => ({
          ...s,
          productTypeId: 'acrylic-digital',
          price: s.id === 'painting-10x10' ? 2854.00 : Math.round(s.price * 1.298)
        }));
      }
      return base;
    }

    if (isBusRollProduct) {
      const base = SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-bus-roll');
      if (activeMaterial === 'acrylic') {
        return base.map((s) => ({
          ...s,
          productTypeId: 'acrylic-bus-roll',
          price: s.id === 'bus-21x32' ? 1256.40 : Math.round(s.price * 1.78)
        }));
      }
      return base;
    }

    if (isBannerProduct) {
      return CANVAS_BANNER_SIZE_OPTIONS as unknown as SizeOption[];
    }

    if (isPopArtProduct) {
      if (activeMaterial === 'acrylic') {
        return POP_ART_SIZE_OPTIONS.map((s) => ({
          ...s,
          productTypeId: 'acrylic-pop-art',
          price: Math.round(s.price * 1.5)
        })) as unknown as SizeOption[];
      }
      return POP_ART_SIZE_OPTIONS as unknown as SizeOption[];
    }

    if (isWordArtProduct) {
      const allWordArtSizes = [
        ...WORD_ART_SIZE_CATALOG.Square.map((s) => ({ ...s, cat: 'SQUARE' as SizeCategory })),
        ...WORD_ART_SIZE_CATALOG['3:2 Ratio'].map((s) => ({ ...s, cat: 'RECOMMENDED' as SizeCategory })),
        ...WORD_ART_SIZE_CATALOG['4:3 Ratio'].map((s) => ({ ...s, cat: 'RECOMMENDED' as SizeCategory })),
        ...WORD_ART_SIZE_CATALOG['16:9 Ratio'].map((s) => ({ ...s, cat: 'PANORAMIC' as SizeCategory }))
      ];
      return allWordArtSizes.map((opt) => ({
        id: opt.id,
        productTypeId: selectedProductTypeId,
        label: opt.label,
        dimensionsSummary: `${opt.widthInches}" × ${opt.heightInches}"`,
        price: opt.price,
        categories: [
          'RECOMMENDED' as SizeCategory,
          opt.cat,
          opt.widthInches >= 20 || opt.heightInches >= 20 ? ('LARGE' as SizeCategory) : ('SMALL' as SizeCategory)
        ],
        widthInches: opt.widthInches,
        heightInches: opt.heightInches,
        panelsCount: 1,
        arrangement: 'single',
        diagramType: 'single',
        panels: [{ id: 'p0', label: 'Canvas', dimension: `${opt.widthInches}" × ${opt.heightInches}"`, widthRatio: opt.widthInches, heightRatio: opt.heightInches }]
      }));
    }

    if (isLyricProduct) {
      const base = LYRIC_CANVAS_SIZE_OPTIONS as unknown as SizeOption[];
      if (activeMaterial === 'acrylic') {
        return base.map((s) => ({
          ...s,
          productTypeId: 'acrylic-lyric',
          price: s.id === 'lyric-8x8' ? 426.00 : Math.round(s.price * 0.285)
        }));
      }
      return base;
    }

    if (isLayoutProduct) {
      const layouts = getProductLayouts(selectedProductTypeId);
      return layouts.map((layout) => ({
        id: layout.id,
        productTypeId: selectedProductTypeId,
        label: layout.name,
        dimensionsSummary: layout.dimensionsSummary,
        price: activeMaterial === 'acrylic' ? (layout.acrylicPrice || layout.price) : layout.price,
        categories: ['RECOMMENDED' as SizeCategory],
        widthInches: layout.overallWidthInches,
        heightInches: layout.overallHeightInches,
        panelsCount: layout.panelsCount,
        arrangement: layout.arrangement,
        diagramType: layout.id as any,
        panels: layout.panels.map((p) => ({
          id: p.id,
          label: p.label,
          dimension: p.dimension || '',
          widthRatio: p.widthRatio || Math.round(p.w * 100),
          heightRatio: p.heightRatio || Math.round(p.h * 100)
        }))
      }));
    }

    const configOptions = getSizesForProductAndShape(selectedProductTypeId, selectedShapeId, activeMaterial).map((opt) => ({
      id: opt.id,
      productTypeId: selectedProductTypeId,
      label: opt.label,
      dimensionsSummary: opt.dimensionsSummary,
      price: opt.price,
      categories: [opt.category as SizeCategory],
      widthInches: opt.widthInches,
      heightInches: opt.heightInches,
      panelsCount: opt.panelsCount,
      arrangement: opt.arrangement,
      diagramType: opt.diagramType,
      panels: opt.panels || [{ id: 'p0', label: activeMaterial === 'acrylic' ? 'Acrylic' : 'Canvas', dimension: opt.dimensionsSummary, widthRatio: opt.widthInches, heightRatio: opt.heightInches }]
    }));
    const filteredOptions = isMosaicProduct
      ? configOptions.filter((opt) => !(opt.widthInches === 9 && opt.heightInches === 9) && !(opt.widthInches === 16 && opt.heightInches === 16))
      : configOptions;
    return filteredOptions.length > 0 ? filteredOptions : SIZE_OPTIONS.filter((s) => s.productTypeId === selectedProductTypeId);
  }, [activeMaterial, selectedProductTypeId, selectedShapeId, isSinglePrintCanvas, isQuotesProduct, isDigitalPaintingProduct, isBusRollProduct, isBannerProduct, isPopArtProduct, isWordArtProduct, isLyricProduct, isWallArtProduct, isCollageProduct, isHexagonProduct, isSplitProduct, isMosaicProduct]);

  // Category filter state for single prints: 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL' (Default: 'RECOMMENDED')
  // A '?category=PANORAMIC' URL param (used by the Panoramic Canvas Prints
  // landing page's "Customize" link) pre-selects that filter on load.
  const [sizeCategoryFilter, setSizeCategoryFilter] = useState<'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL'>(() => {
    const requestedCategory = (searchParams.get('category') || '').toUpperCase();
    if (['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE', 'SMALL'].includes(requestedCategory)) {
      return requestedCategory as 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL';
    }
    return 'RECOMMENDED';
  });

  // Selected Size Option - by default single-10x10, rec-10x10, painting-10x10, or quotes-8x8
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => {
    const initialPt = resolveCurrentProductId(routeMaterial, productId);
    if (initialPt === 'acrylic-print' || initialPt === 'acrylic-single') {
      return 'rec-10x10';
    }
    if (initialPt.includes('quote')) {
      return 'quotes-8x8';
    }
    if (initialPt.includes('digital') || initialPt.includes('painting')) {
      return 'painting-10x10';
    }
    if (initialPt.includes('bus')) {
      return 'bus-21x32';
    }
    if (initialPt.includes('banner')) {
      return 'banner-10x8';
    }
    if (initialPt.includes('pop')) {
      return 'pop-12x12';
    }
    if (initialPt.includes('lyric')) {
      return 'lyric-8x8';
    }
    if (initialPt === 'canvas-single' || initialPt === 'canvas-classic') {
      if ((searchParams.get('category') || '').toUpperCase() === 'PANORAMIC') {
        const panoramicOpt = availableSizeOptions.find((s) => s.categories.includes('PANORAMIC'));
        if (panoramicOpt) return panoramicOpt.id;
      }
      return 'single-10x10';
    }
    // A deep link like /customize/canvas/canvas-split?layout=split-3p-75x50-triptych
    // (used by the Canvas style landing pages' "Customize This Style" buttons) — for
    // layout products (collage/mosaic/hexagon/split/wall-art) the size option id is
    // the same as the layout id, so honor it here too instead of always defaulting
    // to the first option.
    const requestedLayoutId = searchParams.get('layout');
    if (requestedLayoutId && availableSizeOptions.some((s) => s.id === requestedLayoutId)) {
      return requestedLayoutId;
    }
    return availableSizeOptions[0]?.id || (routeMaterial === 'acrylic' ? 'rec-10x10' : 'single-10x10');
  });

  useEffect(() => {
    if (!availableSizeOptions.some((s) => s.id === selectedSizeId)) {
      if (isSinglePrintCanvas || isQuotesProduct || isDigitalPaintingProduct || isBusRollProduct || isBannerProduct || isPopArtProduct || isLyricProduct) {
        const matchingInCat = availableSizeOptions.filter((opt) => opt.categories.includes(sizeCategoryFilter));
        const defaultId = isQuotesProduct
          ? 'quotes-8x8'
          : isDigitalPaintingProduct
          ? 'painting-10x10'
          : isBusRollProduct
          ? 'bus-21x32'
          : isBannerProduct
          ? 'banner-10x8'
          : isPopArtProduct
          ? 'pop-12x12'
          : isLyricProduct
          ? 'lyric-8x8'
          : (activeMaterial === 'acrylic' ? 'rec-10x10' : 'single-10x10');
        setSelectedSizeId(matchingInCat[0]?.id || defaultId);
      } else {
        setSelectedSizeId(availableSizeOptions[0]?.id || (activeMaterial === 'acrylic' ? 'rec-10x10' : 'single-10x10'));
      }
    }
  }, [availableSizeOptions, selectedSizeId, isSinglePrintCanvas, isQuotesProduct, isDigitalPaintingProduct, isBusRollProduct, isBannerProduct, isPopArtProduct, isLyricProduct, sizeCategoryFilter, activeMaterial]);

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
  const shapeApplies = panels.length === 1 && selectedProductTypeId !== 'canvas-banner' && selectedProductTypeId !== 'canvas-bus-roll';

  // Panel Images State
  const [panelImages, setPanelImages] = useState<Record<number, PanelImageState>>({
    0: createDefaultPanel(),
    1: createDefaultPanel(),
    2: createDefaultPanel(),
    3: createDefaultPanel()
  });

  // When selected size or dimensions change: maintain 'cover' placement so the image covers edge-to-edge
  const prevSelectedSizeRef = useRef(`${selectedSizeId}-${customWidth}-${customHeight}`);
  useEffect(() => {
    const key = `${selectedSizeId}-${customWidth}-${customHeight}`;
    if (prevSelectedSizeRef.current === key) return;
    prevSelectedSizeRef.current = key;
    setPanelImages((prev) => {
      const next: Record<number, PanelImageState> = {};
      Object.keys(prev).forEach((k) => {
        const idx = Number(k);
        if (isMosaicProduct && idx === 0) {
          const cur = prev[0];
          if (cur) {
            const { maxPanX, maxPanY } = computePanBounds(cur.scale || 1, 0);
            const clampedX = maxPanX > 0.5 ? Math.max(-maxPanX, Math.min(maxPanX, cur.panX)) : 0;
            const clampedY = maxPanY > 0.5 ? Math.max(-maxPanY, Math.min(maxPanY, cur.panY)) : 0;
            next[0] = { ...cur, fitMode: 'cover', panX: clampedX, panY: clampedY };
            return;
          }
        }
        next[idx] = { ...prev[idx], fitMode: 'cover', scale: 1, panX: 0, panY: 0 };
      });
      return next;
    });
  }, [selectedSizeId, customWidth, customHeight, isSinglePrintCanvas, selectedProductTypeId, isMosaicProduct]);

  // Currently Active Panel Slot for drag/transform/upload targeting
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);
  // Hovered panel index for individual 3D physical edge preview on Wall Display & Split Canvas
  const [hoveredPanelIndex, setHoveredPanelIndex] = useState<number | null>(null);

  // Uploaded photo collection (all photos uploaded in this session)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Arriving from a catalogue design's "Customize this Product" button: the
  // design's own artwork is passed as ?prefillImage= and dropped straight
  // into panel 0, same as a real upload, so the user starts customizing it
  // immediately instead of an empty canvas. Runs once per page load only.
  const prefillAppliedRef = useRef(false);
  // The exact aspect-matched size computed below, so "Reset Size" can
  // return to it instead of the product's generic square default.
  const prefillSizeRef = useRef<{ width: number; height: number } | null>(null);
  useEffect(() => {
    if (prefillAppliedRef.current) return;
    const prefillImage = searchParams.get('prefillImage');
    if (!prefillImage) return;
    prefillAppliedRef.current = true;
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width || 1200;
      const height = img.naturalHeight || img.height || 1200;
      const aspectRatio = width / height;
      const meta = {
        originalSrc: prefillImage,
        width,
        height,
        aspectRatio,
        name: searchParams.get('prefillName') || 'Design'
      };
      // Switch to a custom canvas size that matches the artwork's own
      // aspect ratio exactly, instead of cropping (fit 'cover') or
      // letterboxing (fit 'contain') it into a generic square/rectangle.
      // Kept continuous (not snapped to the Custom Size dropdowns' coarse
      // CUSTOM_SIZE_STEPS list) so the canvas proportions are genuinely
      // accurate — the dropdown options are extended below to include
      // this exact value so it still renders as a real selection there.
      const longSide = 16;
      let w = aspectRatio >= 1 ? longSide : longSide * aspectRatio;
      let h = aspectRatio >= 1 ? longSide / aspectRatio : longSide;
      w = Math.max(4, Math.min(40, Math.round(w * 10) / 10));
      h = Math.max(4, Math.min(40, Math.round(h * 10) / 10));
      prefillSizeRef.current = { width: w, height: h };
      setCustomWidth(w);
      setCustomHeight(h);
      setIsCustomSize(true);
      setUploadedPhotos((prev) => (prev.includes(prefillImage) ? prev : [prefillImage, ...prev]));
      setPanelImages((prev) => ({
        ...prev,
        0: {
          ...createDefaultPanel(),
          imageUrl: prefillImage,
          uploadedImage: meta,
          scale: 1,
          rotation: 0,
          panX: 0,
          panY: 0,
          fitMode: 'cover'
        }
      }));
    };
    img.onerror = () => {
      setUploadedPhotos((prev) => (prev.includes(prefillImage) ? prev : [prefillImage, ...prev]));
      setPanelImages((prev) => ({
        ...prev,
        0: { ...createDefaultPanel(), imageUrl: prefillImage, fitMode: 'contain' }
      }));
    };
    img.src = prefillImage;
  }, [searchParams]);

  // Mobile Upload & QR Code Sync State (matches Acrylic Customizer)
  const [uploadMode, setUploadMode] = useState<'computer' | 'mobile'>('computer');
  const [uploadSessionId] = useState<string>(() => 'ca-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [serverLanIp, setServerLanIp] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const processedImagesRef = useRef<Set<string>>(new Set<string>());
  const [draggingPhotoIndex, setDraggingPhotoIndex] = useState<number | null>(null);

  // Discover server LAN IP for direct mobile connection over Wi-Fi
  useEffect(() => {
    fetch('/api/server-info')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.localIp) {
          setServerLanIp(data.localIp);
        }
      })
      .catch(() => {});
  }, []);

  // Compute mobile upload URL: dynamically use current window.location.origin in production
  const mobileUploadUrl = useMemo(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal && serverLanIp) {
      return `http://${serverLanIp}:${window.location.port || '3000'}/mobile-upload/${uploadSessionId}`;
    }
    // Production hosted origin (e.g. https://canvassindia.com)
    return `${window.location.origin}/mobile-upload/${uploadSessionId}`;
  }, [serverLanIp, uploadSessionId]);

  // Generate QR Code data URL dynamically
  useEffect(() => {
    QRCode.toDataURL(mobileUploadUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0E4A93',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [mobileUploadUrl]);

  // Handler to assign incoming photo from mobile into active slot or next empty slot
  const handleApplyIncomingPhoto = (imgSrc: string) => {
    if (processedImagesRef.current.has(imgSrc)) return;
    processedImagesRef.current.add(imgSrc);

    setUploadedPhotos((prev) => (prev.includes(imgSrc) ? prev : [imgSrc, ...prev]));

    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || 1200;
      const naturalHeight = img.naturalHeight || 800;
      const aspectRatio = naturalWidth / naturalHeight;

      let targetSlot = activePanelIndex;
      if (isSplitProduct || isMosaicProduct) {
        targetSlot = 0;
        setActivePanelIndex(0);
      } else if (panels.length > 1) {
        const emptyIdx = panels
          .map((_, idx) => idx)
          .find((idx) => !panelImages[idx]?.imageUrl);
        if (emptyIdx !== undefined) {
          targetSlot = emptyIdx;
          setActivePanelIndex(emptyIdx);
        }
      }

      setPanelImages((prev) => ({
        ...prev,
        [targetSlot]: {
          ...createDefaultPanel(),
          imageUrl: imgSrc,
          uploadedImage: {
            originalSrc: imgSrc,
            width: naturalWidth,
            height: naturalHeight,
            aspectRatio
          },
          panX: 0,
          panY: 0,
          scale: 1,
          rotation: 0,
          fitMode: 'cover'
        }
      }));

      setSaveToast('Photo uploaded from mobile successfully!');
      setTimeout(() => setSaveToast(null), 4000);
    };
    img.src = imgSrc;
  };

  // 0. Listen via Supabase Realtime Broadcast (cross-device over internet)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    try {
      const channel = supabase
        .channel(`upload-session-${uploadSessionId}`)
        .on('broadcast', { event: 'image-uploaded' }, (payload: any) => {
          if (payload?.payload?.image) {
            handleApplyIncomingPhoto(payload.payload.image);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('[CanvasCustomizer] Supabase Realtime subscription error:', err);
    }
  }, [uploadSessionId, activePanelIndex, panels.length, panelImages]);

  // 0b. Fail-safe Supabase Storage check (runs every 2.5s for hosted environments)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const interval = setInterval(async () => {
      try {
        for (const bucketName of ['mobile-uploads', 'uploads', 'public']) {
          const { data: files } = await supabase.storage.from(bucketName).list(`session_${uploadSessionId}`);
          if (files && files.length > 0) {
            for (const file of files) {
              if (file.name && !file.name.startsWith('.')) {
                const filePath = `session_${uploadSessionId}/${file.name}`;
                const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
                if (pubData?.publicUrl) {
                  handleApplyIncomingPhoto(pubData.publicUrl);
                }
              }
            }
          }
        }
      } catch (e) {}
    }, 2500);
    return () => clearInterval(interval);
  }, [uploadSessionId, activePanelIndex, panels.length, panelImages]);

  // 1. Listen via BroadcastChannel (same-origin / multi-tab)
  useEffect(() => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel1 = new BroadcastChannel(`upload-session-${uploadSessionId}`);
        const channel2 = new BroadcastChannel(`acrylic-upload-${uploadSessionId}`);
        const onMsg = (event: MessageEvent) => {
          if (event.data && event.data.image) {
            handleApplyIncomingPhoto(event.data.image);
          }
        };
        channel1.onmessage = onMsg;
        channel2.onmessage = onMsg;
        return () => {
          channel1.close();
          channel2.close();
        };
      }
    } catch (e) {
      console.warn(e);
    }
  }, [uploadSessionId, activePanelIndex, panels.length, panelImages]);

  // 2. Listen via localStorage (storage events)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if ((e.key === `upload_session_${uploadSessionId}` || e.key === `acrylic_upload_${uploadSessionId}`) && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data && data.image) {
            handleApplyIncomingPhoto(data.image);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [uploadSessionId, activePanelIndex, panels.length, panelImages]);

  // 3. Poll Connect API endpoint in local development mode
  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/upload-session/${uploadSessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            for (const img of data.images) {
              handleApplyIncomingPhoto(img);
            }
          }
        }
      } catch (err) {}
    }, 1500);
    return () => clearInterval(interval);
  }, [uploadSessionId, activePanelIndex, panels.length, panelImages]);

  // LAYOUTS & DESIGNS tab
  const [layoutSubTab, setLayoutSubTab] = useState<'DESIGNS' | 'LAYOUTS'>('LAYOUTS');
  const [designCategory, setDesignCategory] = useState<string>(DESIGN_TEMPLATE_CATEGORIES[0]);
  const [expandedDesignCategory, setExpandedDesignCategory] = useState<string | null>("Valentine's Day");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [expandedLayoutId, setExpandedLayoutId] = useState<string | null>('layout-1');
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(() => {
    const initialPt = resolveCurrentProductId(routeMaterial, productId);
    const layouts = getProductLayouts(initialPt);
    // A deep link like /customize/canvas/canvas-collage?layout=collage-land-9p-feature
    // (used by the Canvas style landing pages' "Customize This Style" buttons)
    // preselects that specific layout instead of always falling back to the first one.
    const requestedLayoutId = searchParams.get('layout');
    if (requestedLayoutId && layouts.some((l) => l.id === requestedLayoutId)) {
      return requestedLayoutId;
    }
    return layouts[0]?.id || 'layout-1-single';
  });

  // Active Photo Mosaic layout - single source of truth across workspace, 360 view, and room view
  const activeMosaicLayout = useMemo(() => {
    const targetId = (isLayoutProduct ? selectedSizeId : null) || selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id;
    return getProductLayout('canvas-mosaic', targetId);
  }, [isLayoutProduct, selectedSizeId, selectedLayoutId, currentSizeOption]);

  // Synchronize selectedSizeId and selectedLayoutId for layout products (Mosaic, Split, Wall Art, Collage, Hexagon)
  useEffect(() => {
    if (isLayoutProduct) {
      const layouts = getProductLayouts(selectedProductTypeId);
      const matchingLayout = layouts.find((l) => l.id === selectedSizeId);
      if (matchingLayout && selectedLayoutId !== matchingLayout.id) {
        setSelectedLayoutId(matchingLayout.id);
        setExpandedLayoutId(matchingLayout.id);
        const targetShape = matchingLayout.shapeId || (matchingLayout.aspectRatio === 1 ? 'shape-square' : (matchingLayout.aspectRatio > 1 ? 'shape-landscape' : 'shape-portrait'));
        setSelectedShapeId(targetShape);
      }
    }
  }, [isLayoutProduct, selectedProductTypeId, selectedSizeId, selectedLayoutId]);

  const filteredLayoutPresets = useMemo(() => {
    if (selectedProductType?.supportedLayoutIds && selectedProductType.supportedLayoutIds.length > 0) {
      return LAYOUT_PRESETS.filter((l) => selectedProductType.supportedLayoutIds!.includes(l.id));
    }
    return LAYOUT_PRESETS;
  }, [selectedProductType]);

  // Admin-uploaded, auto-traced shapes (approved only) layered on top of the
  // built-in shape list — see src/api/customShapesApi.ts.
  const filteredShapes = useMemo(() => {
    let list = CANVAS_SHAPES;
    if (selectedProductType?.supportedShapeIds && selectedProductType.supportedShapeIds.length > 0) {
      list = list.filter((s) => selectedProductType.supportedShapeIds!.includes(s.id));
    }
    // Admin-uploaded custom shapes aren't in any product's static
    // supportedShapeIds allowlist (it can't know about them ahead of time),
    // so they're appended after that filter rather than excluded by it.
    list = [...list, ...customShapeOptions];
    if (shapeFilterCategory === 'ALL') return list;
    return list.filter((s) => s.category.toUpperCase() === shapeFilterCategory);
  }, [shapeFilterCategory, selectedProductType, customShapeOptions]);

  // WRAP & BORDER tab
  const [selectedWrapId, setSelectedWrapId] = useState<string>('full-bleed');
  const [mirrorImage, setMirrorImage] = useState<boolean>(false);
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [borderHexInput, setBorderHexInput] = useState<string>('#FFFFFF');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('no-frame');
  const [expandedFrameCategory, setExpandedFrameCategory] = useState<'standard' | 'premium' | 'floating'>('floating');

  // Thickness & Physical Depth Options (Canvas Stretcher & Acrylic Cast Depth)
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('thin-gallery');
  const [customThicknessInches, setCustomThicknessInches] = useState<number>(1.0);
  const [customAcrylicThicknessMm, setCustomAcrylicThicknessMm] = useState<number>(6.0);

  const effectiveThicknessInches = useMemo(() => {
    if (selectedThicknessId === 'canvas-lite') return 0.5;
    if (selectedThicknessId === 'thin-gallery') return 0.75;
    if (selectedThicknessId === 'thick-gallery') return 1.5;
    if (selectedThicknessId === 'custom-thickness') return customThicknessInches;
    if (selectedThicknessId === 'hanging-canvas') return 0.25;
    return 0.75;
  }, [selectedThicknessId, customThicknessInches]);

  const effectiveAcrylicThicknessMm = useMemo(() => {
    if (selectedThicknessId === '3mm') return 3;
    if (selectedThicknessId === '5mm') return 5;
    if (selectedThicknessId === '8mm') return 8;
    if (selectedThicknessId === '18mm') return 18;
    if (selectedThicknessId === 'custom-thickness') return customAcrylicThicknessMm;
    return 5;
  }, [selectedThicknessId, customAcrylicThicknessMm]);
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('no-hooks');
  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('open-back');

  // Select Size & Shape Modal State
  const [isSizeShapeModalOpen, setIsSizeShapeModalOpen] = useState<boolean>(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState<boolean>(false);

  // The Select Layout modal only makes sense for products with real, distinct multi-panel
  // arrangements. Everything else falls back to a single generic layout internally, which
  // would just show up as a pointless 4-option "Single Full Image" picker — close it if open.
  useEffect(() => {
    const hasRealLayouts = isLayoutProduct;
    if (!hasRealLayouts) {
      setIsLayoutModalOpen(false);
    }
  }, [isLayoutProduct]);

  // Word Art Flow State (Size + Ratio -> Details / Personalization -> Product Workspace)
  const [isWordArtSizeModalOpen, setIsWordArtSizeModalOpen] = useState<boolean>(false);
  const [isWordArtPersonalizeModalOpen, setIsWordArtPersonalizeModalOpen] = useState<boolean>(false);
  const [wordArtSizeOption, setWordArtSizeOption] = useState<WordArtSizeOption>(
    WORD_ART_SIZE_CATALOG.Square[0]
  );
  const [wordArtConfig, setWordArtConfig] = useState<WordArtConfig>(DEFAULT_WORD_ART_CONFIG);
  const [activeWordArtDataUrl, setActiveWordArtDataUrl] = useState<string | null>(null);
  const savedWordArtDataUrlRef = useRef<string | null>(null);
  const savedWordArtConfigRef = useRef<WordArtConfig | null>(null);

  const isWordArtArtwork = useCallback((url: string | null | undefined): boolean => {
    if (!url) return false;
    return Boolean(
      (activeWordArtDataUrl && url === activeWordArtDataUrl) ||
      (savedWordArtDataUrlRef.current && url === savedWordArtDataUrlRef.current)
    );
  }, [activeWordArtDataUrl]);

  // Product change lifecycle: Detach Word Art when moving away; restore when returning to Word Art
  const prevWordArtProductTypeIdRef = useRef<string>(selectedProductTypeId);
  useEffect(() => {
    const prevType = prevWordArtProductTypeIdRef.current;
    const wasWordArt = prevType.includes('word');
    const isNowWordArt = selectedProductTypeId.includes('word');
    prevWordArtProductTypeIdRef.current = selectedProductTypeId;

    if (wasWordArt && !isNowWordArt) {
      // Switching away from Word Art to another product: detach completely
      if (activeWordArtDataUrl) {
        savedWordArtDataUrlRef.current = activeWordArtDataUrl;
      }
      if (wordArtConfig) {
        savedWordArtConfigRef.current = wordArtConfig;
      }
      const staleWordArtUrl = activeWordArtDataUrl || savedWordArtDataUrlRef.current;
      setActiveWordArtDataUrl(null);

      // Clean slot 0 so the next product does not inherit Word Art
      setPanelImages((prev) => {
        if (prev[0]?.imageUrl && (prev[0].imageUrl === staleWordArtUrl || (staleWordArtUrl && prev[0].imageUrl.startsWith('data:image')))) {
          const next = { ...prev };
          delete next[0];
          return next;
        }
        return prev;
      });

      // Detach from upload gallery tray
      if (staleWordArtUrl) {
        setUploadedPhotos((prev) => prev.filter((p) => p !== staleWordArtUrl));
      }
    } else if (!wasWordArt && isNowWordArt) {
      // Returning to Word Art: restore previous configuration and rendered artwork
      if (savedWordArtDataUrlRef.current) {
        const restoredUrl = savedWordArtDataUrlRef.current;
        setActiveWordArtDataUrl(restoredUrl);
        if (savedWordArtConfigRef.current) {
          setWordArtConfig(savedWordArtConfigRef.current);
        }
        setPanelImages((prev) => ({
          ...prev,
          0: {
            ...createDefaultPanel(),
            imageUrl: restoredUrl,
            fitMode: 'contain',
            scale: 1,
            rotation: 0,
            panX: 0,
            panY: 0
          }
        }));
      }
    }
  }, [selectedProductTypeId, activeWordArtDataUrl, wordArtConfig]);

  const handleSelectWordArtSize = (size: WordArtSizeOption) => {
    setWordArtSizeOption(size);
    setSelectedSizeId(size.id);
    setCustomWidth(size.widthInches);
    setCustomHeight(size.heightInches);
    if (activeWordArtDataUrl && wordArtConfig) {
      const offscreen = document.createElement('canvas');
      const exportWidth = 1400;
      const exportHeight = Math.round(exportWidth / (size.aspectRatio || 1));
      renderWordArtToCanvas(offscreen, wordArtConfig, exportWidth, exportHeight);
      const dataUrl = offscreen.toDataURL('image/png', 0.95);
      setActiveWordArtDataUrl(dataUrl);
      savedWordArtDataUrlRef.current = dataUrl;
      setPanelImages((prev) => ({
        ...prev,
        0: {
          ...prev[0],
          imageUrl: dataUrl
        }
      }));
    }
  };

  const handleCreateWordArtFromSize = (size: WordArtSizeOption) => {
    setWordArtSizeOption(size);
    setSelectedSizeId(size.id);
    setCustomWidth(size.widthInches);
    setCustomHeight(size.heightInches);
    setIsWordArtSizeModalOpen(false);
    setIsWordArtPersonalizeModalOpen(true);
  };

  const handleWordArtChangeSize = () => {
    setIsWordArtPersonalizeModalOpen(false);
    setIsWordArtSizeModalOpen(true);
  };

  const handleAddWordArtToProduct = (dataUrl: string, config: WordArtConfig) => {
    setActiveWordArtDataUrl(dataUrl);
    savedWordArtDataUrlRef.current = dataUrl;
    setWordArtConfig(config);
    savedWordArtConfigRef.current = config;

    // Apply high-res Word Art artwork directly into slot 0
    setPanelImages((prev) => ({
      ...prev,
      0: {
        ...createDefaultPanel(),
        imageUrl: dataUrl,
        fitMode: 'contain',
        scale: 1,
        rotation: 0,
        panX: 0,
        panY: 0
      }
    }));

    setUploadedPhotos((prev) => [dataUrl, ...prev.filter((p) => p !== dataUrl)]);

    if (selectedProductTypeId === 'canvas-word-art') {
      setIsCustomSize(true);
      setCustomWidth(wordArtSizeOption.widthInches);
      setCustomHeight(wordArtSizeOption.heightInches);
    }

    setIsWordArtPersonalizeModalOpen(false);
    setActiveTab('UPLOAD');
  };

  // Quotes on Canvas & Quotes on Acrylic Preference State (Requirement 1)
  const [quotesPreference, setQuotesPreference] = useState<'create-own' | 'collection' | null>(null);
  const [isQuotesPreferenceModalOpen, setIsQuotesPreferenceModalOpen] = useState<boolean>(false);
  const [quoteBgColor, setQuoteBgColor] = useState<string>('#FFFFFF');
  const [quoteBgImage, setQuoteBgImage] = useState<string | null>(null);
  const [quoteCustomText, setQuoteCustomText] = useState<string>('The future belongs to those who believe in the beauty of their dreams.');
  const [quoteAuthor, setQuoteAuthor] = useState<string>('Eleanor Roosevelt');
  const [quoteFontFamily, setQuoteFontFamily] = useState<string>('Playfair Display');
  const [quoteTextColor, setQuoteTextColor] = useState<string>('#1C1917');
  const [quoteAlignment, setQuoteAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [quoteFontSize, setQuoteFontSize] = useState<number>(28);
  const [hasQuoteContrast, setHasQuoteContrast] = useState<boolean>(false);

  // Open Quotes Preference Modal on initial visit to Quotes on Canvas or Quotes on Acrylic
  useEffect(() => {
    if (isQuotesProduct && quotesPreference === null) {
      setIsQuotesPreferenceModalOpen(true);
    }
  }, [isQuotesProduct, quotesPreference]);

  const handleSelectCollectionPreference = () => {
    setQuotesPreference('collection');
    setIsQuotesPreferenceModalOpen(false);
    const tmpl = getQuoteTemplate(selectedQuoteTemplateId) || getQuoteTemplate('quote-inspire-01');
    if (tmpl) {
      handleSelectQuoteTemplate(tmpl);
    }
  };

  const handleSelectCreateOwnPreference = () => {
    setQuotesPreference('create-own');
    setIsQuotesPreferenceModalOpen(false);
    // Ensure uploadedPhotos does not contain collection template images
    setUploadedPhotos((prev) => prev.filter((img) => !QUOTE_TEMPLATES.some((t) => t.image === img)));
    setPanelImages((prev) => {
      const cur = prev[0];
      const isTemplateImg = QUOTE_TEMPLATES.some((t) => t.image === cur?.imageUrl);
      if (isTemplateImg) {
        return {
          ...prev,
          0: {
            ...createDefaultPanel(),
            imageUrl: quoteBgImage || '',
            fitMode: 'cover'
          }
        };
      }
      return prev;
    });
  };

  const handleSelectQuoteBgColor = (color: string) => {
    setQuoteBgColor(color);
    if (quoteBgImage) {
      setQuoteBgImage(null);
      setPanelImages((prev) => ({
        ...prev,
        0: {
          ...createDefaultPanel(),
          imageUrl: '',
          fitMode: 'cover'
        }
      }));
    }
    // Auto-contrast text color against chosen background
    const cleanHex = color.replace('#', '');
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const textClean = quoteTextColor.replace('#', '');
      if (textClean.length === 6) {
        const tr = parseInt(textClean.substring(0, 2), 16) / 255;
        const tg = parseInt(textClean.substring(2, 4), 16) / 255;
        const tb = parseInt(textClean.substring(4, 6), 16) / 255;
        const textLum = 0.299 * tr + 0.587 * tg + 0.114 * tb;
        if (lum < 0.45 && textLum < 0.45) {
          setQuoteTextColor('#FFFFFF');
        } else if (lum > 0.65 && textLum > 0.65) {
          setQuoteTextColor('#1C1917');
        }
      }
    }
  };

  const handleSelectQuoteBgImage = (url: string) => {
    setQuoteBgImage(url);
    setPanelImages((prev) => ({
      ...prev,
      0: {
        ...createDefaultPanel(),
        imageUrl: url,
        fitMode: 'cover',
        scale: 1,
        rotation: 0,
        panX: 0,
        panY: 0
      }
    }));
  };

  const handleRemoveQuoteBgImage = () => {
    setQuoteBgImage(null);
    setPanelImages((prev) => ({
      ...prev,
      0: {
        ...createDefaultPanel(),
        imageUrl: '',
        fitMode: 'cover'
      }
    }));
  };

  // Reset Size to product default size option (Requirement 4)
  const handleResetSize = () => {
    // In prefill mode, the "default" size IS the artwork's own aspect-matched
    // custom size, not the product's generic square preset.
    if (isPrefillMode && prefillSizeRef.current) {
      setIsCustomSize(true);
      setCustomWidth(prefillSizeRef.current.width);
      setCustomHeight(prefillSizeRef.current.height);
      return;
    }
    const defaultSizeId = selectedProductType?.defaultSizeOptionId;
    const targetOpt = availableSizeOptions.find((opt) => opt.id === defaultSizeId) || availableSizeOptions[0];
    if (!targetOpt) return;

    setIsCustomSize(false);
    setSelectedSizeId(targetOpt.id);

    if (targetOpt.categories && targetOpt.categories.length > 0) {
      if (!targetOpt.categories.includes(sizeCategoryFilter)) {
        const validCat = targetOpt.categories.find(
          (c): c is 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL' =>
            ['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE', 'SMALL'].includes(c as any)
        );
        if (validCat) {
          setSizeCategoryFilter(validCat);
        }
      }
    }

    const width = targetOpt.widthInches || 10;
    const height = targetOpt.heightInches || 10;
    setCustomWidth(width);
    setCustomHeight(height);

    if (isWordArtProduct) {
      const matchingWordSize = Object.values(WORD_ART_SIZE_CATALOG).flat().find((w) => w.id === targetOpt.id);
      if (matchingWordSize) {
        setWordArtSizeOption(matchingWordSize);
      }
    }

    if (isSinglePrintCanvas) {
      if (width === height) {
        setSelectedShapeId('shape-square');
      } else if (width > height) {
        setSelectedShapeId('shape-landscape');
      } else {
        setSelectedShapeId('shape-portrait');
      }
    } else if (!['shape-circle', 'shape-oval', 'shape-heart', 'shape-triangle', 'shape-hexagon'].includes(selectedShapeId)) {
      setSelectedShapeId(width === height ? 'shape-square' : 'shape-rectangle');
    }
  };

  // Quotes on Canvas State (Selected Quote Template -> Auto-mounts into Slot 0)
  const [selectedQuoteTemplateId, setSelectedQuoteTemplateId] = useState<string>('quote-inspire-01');

  const handleSelectQuoteTemplate = (templateOrId: QuoteTemplateItem | string) => {
    const templateId = typeof templateOrId === 'string' ? templateOrId : templateOrId.id;
    setSelectedQuoteTemplateId(templateId);
    const tmpl = typeof templateOrId === 'string' ? getQuoteTemplate(templateId) : templateOrId;
    if (!tmpl) return;

    setPanelImages((prev) => ({
      ...prev,
      0: {
        ...createDefaultPanel(),
        imageUrl: tmpl.image,
        fitMode: 'contain',
        scale: 1,
        rotation: 0,
        panX: 0,
        panY: 0,
        uploadedImage: {
          originalSrc: tmpl.image,
          width: 800,
          height: 800,
          aspectRatio: 1
        }
      }
    }));
  };

  // Digital Painting State
  const [digitalPaintingConfig, setDigitalPaintingConfig] = useState<DigitalPaintingConfig>(DEFAULT_DIGITAL_PAINTING_CONFIG);

  const handleUpdateDigitalPaintingConfig = (updates: Partial<DigitalPaintingConfig>) => {
    setDigitalPaintingConfig((prev) => ({ ...prev, ...updates }));
  };

  // Bus Roll State
  const [busRollConfig, setBusRollConfig] = useState<BusRollConfig>(DEFAULT_BUS_ROLL_CONFIG);

  const handleUpdateBusRollConfig = (updates: Partial<BusRollConfig>) => {
    setBusRollConfig((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.widthInches && updates.widthInches !== prev.widthInches && !updates.heightInches) {
        const matchingSize = availableSizeOptions.find((s) => s.widthInches === updates.widthInches);
        if (matchingSize && matchingSize.heightInches) {
          updated.heightInches = matchingSize.heightInches;
          setSelectedSizeId(matchingSize.id);
        } else {
          updated.heightInches = Math.round(updates.widthInches * 1.52);
        }
      }
      return updated;
    });
  };

  const handleStartOverBusRoll = () => {
    setBusRollConfig(DEFAULT_BUS_ROLL_CONFIG);
  };

  // Canvas Banner State
  const [bannerConfig, setBannerConfig] = useState<CanvasBannerConfig>(() => ({
    ...DEFAULT_CANVAS_BANNER_CONFIG,
    selectedSizeId: 'banner-10x8'
  }));
  const [bannerCategory, setBannerCategory] = useState<BannerSizeCategory>('RECOMMENDED');

  const handleUpdateBannerConfig = (updates: Partial<CanvasBannerConfig>) => {
    setBannerConfig((prev) => {
      const next = { ...prev, ...updates };
      if (next.isCustom) {
        setIsCustomSize(true);
        setCustomWidth(next.widthInches);
        setCustomHeight(next.heightInches);
        setSelectedSizeId('custom');
      } else if (next.selectedSizeId) {
        setIsCustomSize(false);
        setSelectedSizeId(next.selectedSizeId);
      }
      return next;
    });
  };

  // Pop Art State & Live Processing Engine
  const [isPopArtStyleModalOpen, setIsPopArtStyleModalOpen] = useState<boolean>(() => {
    return resolveCanvasProductTypeId(productId, catalogProduct) === 'canvas-pop-art';
  });
  const [popArtConfig, setPopArtConfig] = useState<PopArtConfig>(DEFAULT_POP_ART_CONFIG);

  // Pop Art Live Image Processing Effect
  useEffect(() => {
    if (selectedProductTypeId !== 'canvas-pop-art') return;
    const sourceUrl = panelImages[0]?.uploadedImage?.originalSrc || panelImages[0]?.imageUrl;
    if (!sourceUrl) {
      setPopArtConfig((prev) => ({ ...prev, processedImageUrl: null, isProcessing: false }));
      return;
    }

    let isMounted = true;
    setPopArtConfig((prev) => ({ ...prev, isProcessing: true }));

    processPopArtImage(sourceUrl, popArtConfig.selectedStyleId)
      .then((processedUrl) => {
        if (isMounted) {
          setPopArtConfig((prev) => ({
            ...prev,
            processedImageUrl: processedUrl,
            isProcessing: false
          }));
        }
      })
      .catch((err) => {
        console.error('Error generating Pop Art preview:', err);
        if (isMounted) {
          setPopArtConfig((prev) => ({ ...prev, isProcessing: false }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProductTypeId, panelImages[0]?.imageUrl, panelImages[0]?.uploadedImage?.originalSrc, popArtConfig.selectedStyleId]);

  // Sync Bus Roll live SVG artwork onto slot 0
  useEffect(() => {
    if (isBusRollProduct) {
      const svgDataUrl = generateBusRollSvgDataUrl(busRollConfig);
      const imgWidth = Math.round(busRollConfig.widthInches * 40);
      const imgHeight = Math.round(busRollConfig.heightInches * 40);
      setPanelImages((prev) => ({
        ...prev,
        0: {
          ...createDefaultPanel(),
          imageUrl: svgDataUrl,
          fitMode: 'contain',
          scale: 1,
          rotation: 0,
          panX: 0,
          panY: 0,
          uploadedImage: {
            originalSrc: svgDataUrl,
            width: imgWidth,
            height: imgHeight,
            aspectRatio: busRollConfig.widthInches / Math.max(1, busRollConfig.heightInches)
          }
        }
      }));
    }
  }, [selectedProductTypeId, isBusRollProduct, busRollConfig]);

  // If initial product is Quotes on Canvas / Acrylic, initialize default quote template into slot 0 (only when collection preference is active)
  useEffect(() => {
    if (isQuotesProduct && quotesPreference === 'collection') {
      const tmpl = getQuoteTemplate(selectedQuoteTemplateId) || getQuoteTemplate('quote-inspire-01');
      if (tmpl && !panelImages[0]?.imageUrl) {
        setPanelImages((prev) => ({
          ...prev,
          0: {
            ...createDefaultPanel(),
            imageUrl: tmpl.image,
            fitMode: 'contain',
            scale: 1,
            rotation: 0,
            panX: 0,
            panY: 0,
            uploadedImage: {
              originalSrc: tmpl.image,
              width: 800,
              height: 800,
              aspectRatio: 1
            }
          }
        }));
      }
    }
  }, [selectedProductTypeId, isQuotesProduct, selectedQuoteTemplateId, quotesPreference]);

  const prevProductTypeIdRef = useRef(selectedProductTypeId);
  const prevMaterialRef = useRef(activeMaterial);
  // Automatically sync default shape, hardware, thickness, and layout when product selection changes
  useEffect(() => {
    const productChanged = prevProductTypeIdRef.current !== selectedProductTypeId;
    const materialChanged = prevMaterialRef.current !== activeMaterial;
    prevProductTypeIdRef.current = selectedProductTypeId;
    prevMaterialRef.current = activeMaterial;

    if (!productChanged && !materialChanged) return;

    const list = activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES;
    const pt = list.find((p) => p.id === selectedProductTypeId);
    if (pt) {
      if (pt.defaultShape) setSelectedShapeId(pt.defaultShape);
      if (pt.defaultHardwareId) setSelectedHardwareId(pt.defaultHardwareId);
      if (pt.defaultThicknessId) setSelectedThicknessId(pt.defaultThicknessId);
      if (pt.supportedShapeIds && !pt.supportedShapeIds.includes(selectedShapeId)) {
        setSelectedShapeId(pt.defaultShape || 'shape-rectangle');
      }
    }
    const layouts = getProductLayouts(selectedProductTypeId);
    if (!layouts.some((l) => l.id === selectedLayoutId)) {
      if (layouts[0]) {
        setSelectedLayoutId(layouts[0].id);
        setExpandedLayoutId(layouts[0].id);
      }
    }
  }, [activeMaterial, selectedProductTypeId]);

  // Master selection handler for all products across Canvas & Acrylic
  const selectProduct = (productId: string) => {
    const list = activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES;
    const pt = list.find((p) => p.id === productId);
    if (!pt) return;

    if (productId.includes('word')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(true);
      setCustomWidth(wordArtSizeOption.widthInches);
      setCustomHeight(wordArtSizeOption.heightInches);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedHardwareId('no-hooks');
      setSelectedThicknessId('thin-gallery');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setIsWordArtSizeModalOpen(true);
      setActiveTab('UPLOAD');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('quote')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedSizeId('quotes-8x8');
      setSizeCategoryFilter('SQUARE');
      setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
      setSelectedThicknessId(pt.defaultThicknessId || 'thin-gallery');
      const tmpl = getQuoteTemplate(selectedQuoteTemplateId) || getQuoteTemplate('quote-inspire-01');
      if (tmpl && quotesPreference === 'collection') {
        setPanelImages((prev) => ({
          ...prev,
          0: {
            ...createDefaultPanel(),
            imageUrl: tmpl.image,
            fitMode: 'contain',
            scale: 1,
            rotation: 0,
            panX: 0,
            panY: 0,
            uploadedImage: {
              originalSrc: tmpl.image,
              width: 800,
              height: 800,
              aspectRatio: 1
            }
          }
        }));
      }
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setActiveTab('UPLOAD');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('digital') || productId.includes('painting')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedSizeId('painting-10x10');
      setSizeCategoryFilter('SQUARE');
      setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
      setSelectedThicknessId(pt.defaultThicknessId || 'thin-gallery');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setActiveTab('EFFECTS & OPTIONS');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('bus')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedSizeId('bus-21x32');
      setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
      setSelectedThicknessId(pt.defaultThicknessId || 'thin-gallery');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setActiveTab('CREATE BUS ROLL');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('banner')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-rectangle');
      setSelectedSizeId('banner-10x8');
      setSelectedHardwareId('no-hooks');
      setSelectedThicknessId('canvas-lite');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setActiveTab('UPLOAD');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('pop')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedSizeId('pop-12x12');
      setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
      setSelectedThicknessId(pt.defaultThicknessId || 'thin-gallery');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setIsPopArtStyleModalOpen(true);
      setActiveTab('UPLOAD');
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    if (productId.includes('lyric')) {
      setSelectedProductTypeId(productId);
      setIsCustomSize(false);
      setActivePanelIndex(0);
      setSelectedShapeId('shape-square');
      setSelectedSizeId('lyric-8x8');
      setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
      setSelectedThicknessId(pt.defaultThicknessId || 'thin-gallery');
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      setIsLyricTemplateModalOpen(true);
      setActiveTab('UPLOAD');
      setPanelImages((prev) => ({
        ...prev,
        [0]: {
          ...(prev[0] || createDefaultPanel()),
          fitMode: 'cover'
        }
      }));
      navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
      return;
    }

    setSelectedProductTypeId(productId);
    setIsCustomSize(false);
    setActivePanelIndex(0);

    const isSingle = productId === 'canvas-single' || productId === 'canvas-classic' || productId === 'acrylic-print' || productId === 'acrylic-single' || productId === 'acrylic-photo-panel';
    const isSingleOrShaped = [
      'canvas-single',
      'canvas-classic',
      'canvas-round',
      'canvas-triangle',
      'canvas-heart',
      'canvas-oval',
      'acrylic-print',
      'acrylic-single',
      'acrylic-photo-panel'
    ].includes(productId);

    const isLayoutProduct =
      productId.includes('wall') ||
      productId.includes('collage') ||
      (activeMaterial === 'canvas' && productId.includes('hexagon')) ||
      productId.includes('split') ||
      productId.includes('mosaic');

    if (isSingle) {
      setSelectedShapeId('shape-square');
      setSizeCategoryFilter('RECOMMENDED');
      setSelectedSizeId(activeMaterial === 'acrylic' ? 'rec-10x10' : 'single-10x10');
    } else if (isLayoutProduct) {
      setSelectedFrameId('no-frame');
      const layouts = getProductLayouts(productId);
      const defaultLayout = layouts[0];
      if (defaultLayout) {
        setSelectedLayoutId(defaultLayout.id);
        setExpandedLayoutId(defaultLayout.id);
        setSelectedSizeId(defaultLayout.id);
      }
      if (pt.defaultShape) {
        setSelectedShapeId(pt.defaultShape);
      }
    } else {
      if (pt.defaultShape) {
        setSelectedShapeId(pt.defaultShape);
      }
      if (pt.defaultSizeOptionId) {
        setSelectedSizeId(pt.defaultSizeOptionId);
      } else {
        const matchingSizes = SIZE_OPTIONS.filter((s) => s.productTypeId === productId);
        if (matchingSizes.length > 0) {
          setSelectedSizeId(matchingSizes[0].id);
        }
      }
    }

    setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
    if (pt.defaultThicknessId) {
      setSelectedThicknessId(pt.defaultThicknessId);
    }

    if (pt.defaultLayoutId && !isLayoutProduct) {
      setExpandedLayoutId(pt.defaultLayoutId);
    }

    if (isSingleOrShaped) {
      setIsSizeShapeModalOpen(true);
      setIsLayoutModalOpen(false);
      setActiveTab('UPLOAD');
    } else if (isLayoutProduct) {
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(true);
      setLayoutSubTab('LAYOUTS');
      setActiveTab('UPLOAD');
    } else {
      setIsSizeShapeModalOpen(false);
      setIsLayoutModalOpen(false);
      if (productId.includes('digital') || productId.includes('painting')) {
        setActiveTab('EFFECTS & OPTIONS');
      } else if (productId.includes('bus')) {
        setActiveTab('CREATE BUS ROLL');
      } else {
        setActiveTab('UPLOAD');
      }
    }

    navigate(`/customize/${activeMaterial}/${productId}`, { replace: true });
  };

  const handleSwitchMaterial = () => {
    const nextMaterial = activeMaterial === 'canvas' ? 'acrylic' : 'canvas';
    setActiveMaterial(nextMaterial);
    let counterpartId = 'acrylic-print';
    if (nextMaterial === 'acrylic') {
      if (selectedProductTypeId === 'canvas-single' || selectedProductTypeId === 'canvas-classic') counterpartId = 'acrylic-print';
      else if (selectedProductTypeId.includes('wall') || selectedProductTypeId.includes('display')) counterpartId = 'acrylic-wall-art';
      else if (selectedProductTypeId.includes('collage')) counterpartId = 'acrylic-collage';
      else if (selectedProductTypeId.includes('split')) counterpartId = 'acrylic-split';
      else if (selectedProductTypeId.includes('mosaic')) counterpartId = 'acrylic-mosaic';
      else if (selectedProductTypeId.includes('lyric')) counterpartId = 'acrylic-lyric';
      else if (selectedProductTypeId.includes('digital') || selectedProductTypeId.includes('painting')) counterpartId = 'acrylic-digital';
      else if (selectedProductTypeId.includes('quote')) counterpartId = 'acrylic-quotes';
      else if (selectedProductTypeId.includes('bus')) counterpartId = 'acrylic-bus-roll';
      else if (selectedProductTypeId.includes('word')) counterpartId = 'acrylic-word-art';
      else counterpartId = 'acrylic-print';
      navigate(`/customize/acrylic/${counterpartId}`);
    } else {
      if (selectedProductTypeId === 'acrylic-print' || selectedProductTypeId === 'acrylic-single' || selectedProductTypeId === 'acrylic-photo-panel') counterpartId = 'canvas-single';
      else if (selectedProductTypeId.includes('wall') || selectedProductTypeId.includes('display')) counterpartId = 'canvas-wall-art';
      else if (selectedProductTypeId.includes('collage')) counterpartId = 'canvas-collage';
      else if (selectedProductTypeId.includes('split')) counterpartId = 'canvas-split';
      else if (selectedProductTypeId.includes('mosaic')) counterpartId = 'canvas-mosaic';
      else if (selectedProductTypeId.includes('lyric')) counterpartId = 'canvas-lyric';
      else if (selectedProductTypeId.includes('digital') || selectedProductTypeId.includes('painting')) counterpartId = 'canvas-digital-painting';
      else if (selectedProductTypeId.includes('quote')) counterpartId = 'canvas-quotes';
      else if (selectedProductTypeId.includes('bus')) counterpartId = 'canvas-bus-roll';
      else if (selectedProductTypeId.includes('word')) counterpartId = 'canvas-word-art';
      else counterpartId = 'canvas-single';
      navigate(`/customize/canvas/${counterpartId}`);
    }
  };

  // Handler for applied selection from SelectSizeShapeModal
  const handleApplySizeAndShape = (config: {
    shapeId: string;
    sizeId: string;
    widthInches: number;
    heightInches: number;
    price: number;
    label: string;
    isCustom?: boolean;
    arrangement?: string;
    panelsCount?: number;
    panels?: any[];
  }) => {
    if (config.isCustom) {
      setIsCustomSize(true);
      setCustomWidth(config.widthInches);
      setCustomHeight(config.heightInches);
      setSelectedShapeId(config.shapeId);
    } else {
      setIsCustomSize(false);
      setSelectedShapeId(config.shapeId);
      setSelectedSizeId(config.sizeId);

      if (isLayoutProduct) {
        const layouts = getProductLayouts(selectedProductTypeId);
        const matchingLayout = layouts.find((l) => l.id === config.sizeId);
        if (matchingLayout) {
          setSelectedLayoutId(matchingLayout.id);
          setExpandedLayoutId(matchingLayout.id);
          const targetShape = matchingLayout.shapeId || (matchingLayout.aspectRatio === 1 ? 'shape-square' : (matchingLayout.aspectRatio > 1 ? 'shape-landscape' : 'shape-portrait'));
          setSelectedShapeId(targetShape);
        }
      }

      // Keep sidebar size category filter aligned with selected size
      if (isSinglePrintCanvas || isPopArtProduct) {
        const pool = isPopArtProduct ? (POP_ART_SIZE_OPTIONS as unknown as SizeOption[]) : SIZE_OPTIONS;
        const matchingOpt = pool.find((s) => s.id === config.sizeId);
        if (matchingOpt && !matchingOpt.categories.includes(sizeCategoryFilter)) {
          if (matchingOpt.categories.includes('PANORAMIC')) {
            setSizeCategoryFilter('PANORAMIC');
          } else if (matchingOpt.categories.includes('SQUARE')) {
            setSizeCategoryFilter('SQUARE');
          } else if (matchingOpt.categories.includes('LARGE')) {
            setSizeCategoryFilter('LARGE');
          } else if (matchingOpt.categories.includes('SMALL')) {
            setSizeCategoryFilter('SMALL');
          } else if (matchingOpt.categories.includes('RECOMMENDED')) {
            setSizeCategoryFilter('RECOMMENDED');
          }
        }
      }

      if (config.arrangement) {
        if (config.arrangement === 'threeCollage' || config.arrangement === 'threeSplit') {
          setExpandedLayoutId('layout-3-collage');
        } else if (config.arrangement === 'fourGrid') {
          setExpandedLayoutId('layout-4-grid');
        }
      }
    }

    // Uploaded customer images remain attached and refitted cleanly (cover for single print)
    setPanelImages((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        const idx = Number(k);
        if (next[idx]?.imageUrl) {
          next[idx] = {
            ...next[idx],
            scale: 1,
            panX: 0,
            panY: 0,
            fitMode: 'cover'
          };
        }
      });
      return next;
    });

    // Automatically switch to UPLOAD section after size confirmation
    setActiveTab('UPLOAD');
  };

  // Handler for highlighted preview from SelectLayoutModal (live workspace updates)
  const handleHighlightLayoutFromModal = (layout: LayoutModalOption) => {
    setSelectedLayoutId(layout.id);
    setExpandedLayoutId(layout.id);
    if (!isSinglePrintCanvas) {
      setSelectedSizeId(layout.id);
      const targetShape = layout.shapeId || (layout.aspectRatio === 1 ? 'shape-square' : 'shape-rectangle');
      setSelectedShapeId(targetShape);
      if (activePanelIndex >= layout.panelsCount) {
        setActivePanelIndex(0);
      }
    }
  };

  // Handler for applied selection from SelectLayoutModal
  const handleApplyLayoutFromModal = (layout: LayoutModalOption) => {
    setSelectedLayoutId(layout.id);
    setExpandedLayoutId(layout.id);
    if (!isSinglePrintCanvas) {
      setSelectedSizeId(layout.id);
      const targetShape = layout.shapeId || (layout.aspectRatio === 1 ? 'shape-square' : 'shape-rectangle');
      setSelectedShapeId(targetShape);
      if (activePanelIndex >= layout.panelsCount) {
        setActivePanelIndex(0);
      }
    }
    setIsLayoutModalOpen(false);
    setActiveTab('UPLOAD');
  };

  // OPTIONS tab
  const [selectedLaminationId, setSelectedLaminationId] = useState<string>('standard');
  const [retouchChecks, setRetouchChecks] = useState<Record<string, boolean>>({});
  const [majorRetouchText, setMajorRetouchText] = useState<string>('');
  const [proofRequested, setProofRequested] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(() => {
    const requestedQty = Number(searchParams.get('qty'));
    return requestedQty > 0 ? requestedQty : 1;
  });

  // Material Variant (from Change Material modal)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('standard-cotton');
  const [materialModalOpen, setMaterialModalOpen] = useState<boolean>(false);

  // Dedicated Lyric Canvas State (for canvas-lyric & acrylic-lyric product customization)
  const [isLyricTemplateModalOpen, setIsLyricTemplateModalOpen] = useState<boolean>(() => {
    return resolveCurrentProductId(routeMaterial, productId).includes('lyric');
  });
  const [lyricConfig, setLyricConfig] = useState<LyricCanvasConfig>(() => {
    try {
      const storageKey = `ci_customization_${catalogProduct.id || catalogProduct.slug || 'canvas-custom'}`;
      const savedRaw = localStorage.getItem(storageKey);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved?.lyricConfig) {
          return { ...DEFAULT_LYRIC_CONFIG, ...saved.lyricConfig };
        }
      }
    } catch {
      // Ignore parse error
    }
    return DEFAULT_LYRIC_CONFIG;
  });

  const selectedLyricTemplate = useMemo(() => {
    return getLyricTemplate(lyricConfig.selectedTemplateId);
  }, [lyricConfig.selectedTemplateId]);

  const handleSelectLyricTemplate = (tpl: LyricCanvasTemplate) => {
    setLyricConfig({
      selectedTemplateId: tpl.id,
      layout: tpl.defaultLayout,
      title: tpl.defaultText.title,
      songTitle: tpl.defaultText.title,
      artistOrSubtitle: tpl.defaultText.artistOrSubtitle,
      artistOrNames: tpl.defaultText.artistOrSubtitle,
      lyrics: tpl.defaultText.lyrics,
      lyricsText: tpl.defaultText.lyrics,
      dateOrNames: tpl.defaultText.dateOrNames || '',
      dateOrInscription: tpl.defaultText.dateOrNames || '',
      fontFamily: tpl.defaultTypography.fontFamily,
      textColor: tpl.defaultTypography.textColor,
      alignment: tpl.defaultTypography.alignment,
      textAlign: tpl.defaultTypography.alignment,
      overlayDarkness: tpl.defaultBackground.overlayDarkness,
      compositeImageUrl: null
    });
  };

  // Creative Tools State
  // Free-form text + clipart: unified with Acrylic system
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [clipartElements, setClipartElements] = useState<ClipartElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<SelectedItem>(null);
  const [showTextModal, setShowTextModal] = useState<boolean>(false);
  const [showClipartModal, setShowClipartModal] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const workspaceCanvasBoxRef = useRef<HTMLDivElement>(null);
  const [workspaceBoxSize, setWorkspaceBoxSize] = useState<{ width: number; height: number }>({
    width: 420,
    height: 420
  });
  const itemDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; w: number; h: number } | null>(null);

  const activeTextElement = useMemo(() => {
    if (selectedElement?.type === 'text' && selectedElement.id) {
      return textElements.find((t) => t.id === selectedElement.id) || null;
    }
    return null;
  }, [selectedElement, textElements]);

  const activeClipartElement = useMemo(() => {
    if (selectedElement?.type === 'clipart' && selectedElement.id) {
      return clipartElements.find((c) => c.id === selectedElement.id) || null;
    }
    return null;
  }, [selectedElement, clipartElements]);

  const customText = textElements.map((t) => t.text).join(' | ');

  // Upload: which frame a picked/dropped file goes to, and which frame is being dragged over
  const uploadTargetRef = useRef<number>(0);
  const [dragOverPanel, setDragOverPanel] = useState<number | null>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResults, setAiResults] = useState<string[]>([]);

  // Modals & Drawers
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Room / 3D / 360 viewer
  const [viewerMode, setViewerMode] = useState<'room' | '3d' | '360' | null>(null);

  // Automatically close Room / 3D / 360 view if the selected product does not support it
  useEffect(() => {
    if (activeMaterial === 'acrylic' && (viewerMode === '3d' || viewerMode === '360')) {
      setViewerMode(null);
    }
    if (viewerMode === 'room' && !productCapabilities.roomView) {
      setViewerMode(null);
    }
    if (viewerMode === '3d' && !productCapabilities.view3D) {
      setViewerMode(null);
    }
    if (viewerMode === '360' && !productCapabilities.view360) {
      setViewerMode(null);
    }
  }, [activeMaterial, viewerMode, productCapabilities.roomView, productCapabilities.view3D, productCapabilities.view360]);

  const [roomViewState, setRoomViewState] = useState<RoomPlacementState>({
    roomPreset: 'office',
    customRoomUrl: null,
    productRoomX: 0.22,
    productRoomY: 0.33
  });

  const [viewerRotation, setViewerRotation] = useState<number>(-24);
  const [viewerTiltX, setViewerTiltX] = useState<number>(6);
  const [preset3DAngle, setPreset3DAngle] = useState<Preset3DAngleId>('top-left');
  const [viewerAutoRotate, setViewerAutoRotate] = useState<boolean>(false);
  const [isViewerDragging, setIsViewerDragging] = useState<boolean>(false);
  const viewerDragRef = useRef<{ x: number; y: number; startRotation: number; startTiltX: number } | null>(null);

  // Dragging state for the active panel image
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    initialPanX: number;
    initialPanY: number;
    containerWidth: number;
    containerHeight: number;
    hasMoved: boolean;
  }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
    containerWidth: 400,
    containerHeight: 300,
    hasMoved: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Key
  const storageKey = `ci_customization_${catalogProduct.id || catalogProduct.slug || 'canvas-custom'}`;

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
        textElements: textElements.filter((t) => Boolean(t.text && t.text.trim())),
        clipartElements,
        panelImages,
        uploadedPhotos,
        digitalPaintingConfig,
        busRollConfig,
        bannerConfig,
        popArtConfig: isPopArtProduct ? popArtConfig : undefined,
        lyricConfig: isLyricProduct ? lyricConfig : undefined,
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

  // Restore saved design from localStorage on initial mount
  const hasRestoredSavedDesignRef = useRef(false);
  useEffect(() => {
    if (hasRestoredSavedDesignRef.current) return;
    hasRestoredSavedDesignRef.current = true;
    try {
      const savedRaw = localStorage.getItem(storageKey);
      if (!savedRaw) return;
      const saved = JSON.parse(savedRaw);
      if (saved?.panelImages && typeof saved.panelImages === 'object') {
        setPanelImages(saved.panelImages);
      }
      if (saved?.uploadedPhotos && Array.isArray(saved.uploadedPhotos)) {
        setUploadedPhotos(saved.uploadedPhotos);
      }
      if (saved?.selectedWrapId) {
        setSelectedWrapId(saved.selectedWrapId);
      }
      if (saved?.selectedBorderWidthId) {
        setSelectedBorderWidthId(saved.selectedBorderWidthId);
      }
      if (saved?.selectedBorderColor) {
        setSelectedBorderColor(saved.selectedBorderColor);
      }
      if (saved?.mirrorImage !== undefined) {
        setMirrorImage(saved.mirrorImage);
      }
      if (saved?.selectedHardwareId) {
        setSelectedHardwareId(saved.selectedHardwareId);
      }
      if (saved?.selectedDisplayOptionId) {
        setSelectedDisplayOptionId(saved.selectedDisplayOptionId);
      }
      if (saved?.selectedThicknessId) {
        setSelectedThicknessId(saved.selectedThicknessId);
      }
      if (saved?.customThicknessInches !== undefined) {
        setCustomThicknessInches(saved.customThicknessInches);
      }
      if (saved?.customAcrylicThicknessMm !== undefined) {
        setCustomAcrylicThicknessMm(saved.customAcrylicThicknessMm);
      }
      if (saved?.borderHexInput) {
        setBorderHexInput(saved.borderHexInput);
      }
      if (saved?.textElements && Array.isArray(saved.textElements)) {
        setTextElements(saved.textElements);
      }
      if (saved?.clipartElements && Array.isArray(saved.clipartElements)) {
        setClipartElements(saved.clipartElements);
      }
      if (saved?.lyricConfig && typeof saved.lyricConfig === 'object') {
        setLyricConfig((prev) => ({ ...prev, ...saved.lyricConfig }));
      }
    } catch {
      // Safe ignore
    }
  }, [storageKey]);

  // Dynamic Price Calculation
  const selectedPopStyle = getPopArtStyle(popArtConfig.selectedStyleId);
  const popStyleAdjustment = isPopArtProduct ? (selectedPopStyle?.priceAdjustment || 0) : 0;
  const lyricPriceAdjustment = isLyricProduct ? (selectedLyricTemplate?.priceAdjustment || 0) : 0;
  const sizePrice = isWordArtProduct
    ? (isCustomSize && canUseCustomSize ? customSizePrice : (wordArtSizeOption.price || currentSizeOption?.price || 198))
    : isBannerProduct
    ? (bannerConfig.isCustom
        ? calculateBannerPrice(bannerConfig.widthInches, bannerConfig.heightInches)
        : (CANVAS_BANNER_SIZE_OPTIONS.find((s) => s.id === bannerConfig.selectedSizeId)?.price || calculateBannerPrice(bannerConfig.widthInches, bannerConfig.heightInches)))
    : isPopArtProduct
    ? ((isCustomSize && canUseCustomSize ? customSizePrice : currentSizeOption.price) + popStyleAdjustment)
    : isLyricProduct
    ? ((isCustomSize && canUseCustomSize ? customSizePrice : currentSizeOption.price) + lyricPriceAdjustment)
    : (isCustomSize && canUseCustomSize ? customSizePrice : currentSizeOption.price);

  const unitPrice = useMemo(() => {
    let price = sizePrice;

    if (shapeApplies && currentShape.priceAddon) price += currentShape.priceAddon;

    const wrap = WRAP_OPTIONS.find((w) => w.id === selectedWrapId);
    if (wrap) price += wrap.price;

    const thickness = (activeMaterial === 'acrylic' ? ACRYLIC_THICKNESS_OPTIONS : THICKNESS_OPTIONS).find((t: any) => t.id === selectedThicknessId);
    if (thickness && thickness.price) price += thickness.price;

    price += CANVAS_BORDER_WIDTH_PRICES[selectedBorderWidthId] || 0;
    const frame = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    if (frame && frame.price) price += frame.price;

    const hardwarePrice = selectedProductTypeId === 'canvas-banner'
      ? (CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.price || 0)
      : (HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.price || 0);
    price += hardwarePrice;

    const display = DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId);
    if (display) price += display.price;

    const lamination = LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId);
    if (lamination) price += lamination.price;

    if (selectedMaterialId === 'premium-cotton') price += 250;
    else if (selectedMaterialId === 'archival-cotton') price += 450;

    // Bulk quantities (reached via the Bulk Orders "Continue to Customize"
    // flow, or just typed into the quantity field directly) get the same
    // volume discount shown there — applied here, after every size, shape,
    // frame, hardware and material addon has already been summed, so the
    // discount scales the whole configured price rather than just the base.
    if (quantity >= MIN_BULK_QTY) price = bulkUnitPriceFor(price, quantity);

    return price;
  }, [
    sizePrice,
    shapeApplies,
    currentShape,
    selectedWrapId,
    selectedThicknessId,
    selectedBorderWidthId,
    selectedFrameId,
    selectedHardwareId,
    selectedDisplayOptionId,
    selectedLaminationId,
    selectedMaterialId,
    quantity
  ]);

  const totalPrice = unitPrice * quantity;

  // Single source of truth for whether at least ONE valid customer image is currently uploaded
  const hasUploadedImage = useMemo(() => {
    if (isBusRollProduct || isLyricProduct || isQuotesProduct) {
      return true;
    }
    const anySlotHasImage = Object.values(panelImages).some(
      (p) => Boolean(p?.imageUrl && p.imageUrl.trim().length > 0 && (isWordArtProduct || !isWordArtArtwork(p.imageUrl)))
    );
    const anyTrayHasImage = uploadedPhotos.some(
      (url) => Boolean(url && url.trim().length > 0 && (isWordArtProduct || !isWordArtArtwork(url)))
    );
    return anySlotHasImage || anyTrayHasImage;
  }, [panelImages, uploadedPhotos, selectedProductTypeId, selectedLyricTemplate, isWordArtProduct, isWordArtArtwork, lyricConfig.lyrics, lyricConfig.lyricsText]);

  // Validation: at least one uploaded photo
  const filledPanelsCount = useMemo(() => {
    return panels.filter((_, idx) => Boolean(panelImages[idx]?.imageUrl)).length;
  }, [panels, panelImages]);

  const isComplete = hasUploadedImage || filledPanelsCount >= 1;

  // If all uploaded images are removed, automatically close 3D / 360 / Room View
  useEffect(() => {
    if (!hasUploadedImage && viewerMode !== null) {
      setViewerMode(null);
      setViewerAutoRotate(false);
    }
  }, [hasUploadedImage, viewerMode]);

  // Remove a specific uploaded photo from the tray and clear any slots displaying it
  const handleRemoveUploadedPhoto = (photoUrl: string, photoIdx: number) => {
    const nextUploaded = uploadedPhotos.filter((_, idx) => idx !== photoIdx);
    const stillHasUrl = nextUploaded.includes(photoUrl);
    setUploadedPhotos(nextUploaded);

    if (!stillHasUrl) {
      const fallbackUrl = nextUploaded[0] || null;
      setPanelImages((prev) => {
        const next: Record<number, PanelImageState> = { ...prev };
        Object.keys(next).forEach((k) => {
          const slotIdx = Number(k);
          if (next[slotIdx]?.imageUrl === photoUrl) {
            next[slotIdx] = {
              ...createDefaultPanel(),
              imageUrl: slotIdx === 0 && nextUploaded.length === 1 ? fallbackUrl : null
            };
          }
        });
        return next;
      });
    }
  };

  // Remove image from a specific canvas slot (and from uploadedPhotos if no other slot uses it)
  const handleRemoveSlotPhoto = (panelIdx: number) => {
    const removedUrl = panelImages[panelIdx]?.imageUrl;
    setPanelImages((prev) => {
      const next: Record<number, PanelImageState> = {
        ...prev,
        [panelIdx]: createDefaultPanel()
      };
      const usedElsewhere = Object.keys(next).some(
        (k) => Number(k) !== panelIdx && next[Number(k)]?.imageUrl === removedUrl
      );
      if (removedUrl && !usedElsewhere) {
        setUploadedPhotos((curr) => curr.filter((u) => u !== removedUrl));
      }
      return next;
    });
  };

  // Clear all uploaded images from both the tray and all canvas slots
  const handleClearAllUploadedPhotos = () => {
    setUploadedPhotos([]);
    setPanelImages({
      0: createDefaultPanel(),
      1: createDefaultPanel(),
      2: createDefaultPanel(),
      3: createDefaultPanel()
    });
  };

  // Multi-layout canvas products where one uploaded photo spans the whole grid,
  // so the grid's own proportions should follow the photo instead of staying fixed.
  const LAYOUT_PRODUCT_TYPE_IDS = [
    'canvas-wall-art',
    'canvas-collage',
    'canvas-hexagon',
    'canvas-split',
    'canvas-mosaic',
    'acrylic-wall-art',
    'acrylic-collage',
    'acrylic-split',
    'acrylic-mosaic'
  ];

  // Among this product's available layouts, pick the one whose overall aspect ratio
  // is closest to the uploaded photo's own aspect ratio (log-scale so a 2:1 landscape
  // photo and a 1:2 portrait photo are equally "off" from a 1:1 square layout).
  const pickBestMatchingLayout = (productTypeId: string, photoAspectRatio: number) => {
    const layouts = getProductLayouts(productTypeId);
    if (!layouts.length) return null;
    return layouts.reduce((best, l) =>
      Math.abs(Math.log(l.aspectRatio) - Math.log(photoAspectRatio)) <
      Math.abs(Math.log(best.aspectRatio) - Math.log(photoAspectRatio))
        ? l
        : best
    , layouts[0]);
  };

  // File Upload Handler
  // Files go to the frame that asked for them; extra files fill the following frames, the rest just join the uploads tray.
  const handleFilesUpload = (files: FileList | File[] | null, explicitPanelIdx: number = uploadTargetRef.current) => {
    if (!files || files.length === 0) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 40 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 40MB limit.`);
        return false;
      }
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
        alert(`File ${file.name} is not a supported format (JPG, PNG, WEBP, BMP).`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const isContinuous = isSplitProduct || isMosaicProduct;
    const emptySlots = panels
      .map((_, idx) => idx)
      .filter((idx) => !panelImages[idx]?.imageUrl);

    validFiles.forEach((file, i) => {
      let target: number;
      if (isContinuous) {
        target = 0;
      } else if (explicitPanelIdx !== undefined && explicitPanelIdx >= 0 && explicitPanelIdx < panels.length) {
        target = (explicitPanelIdx + i) % panels.length;
      } else if (emptySlots.length > 0) {
        target = i < emptySlots.length ? emptySlots[i] : (emptySlots[0] + i) % panels.length;
      } else {
        target = (activePanelIndex + i) % panels.length;
      }

      const reader = new FileReader();
      // Preloader stays visible for exactly as long as this real read takes
      beginPreloader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const img = new Image();
          img.onload = () => {
            const width = img.naturalWidth || img.width || 1200;
            const height = img.naturalHeight || img.height || 1200;
            const meta = {
              originalSrc: result,
              width,
              height,
              aspectRatio: width / height,
              name: file.name
            };

            setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
            setPanelImages((prev) => ({
              ...prev,
              [target]: {
                ...createDefaultPanel(),
                imageUrl: result,
                uploadedImage: meta,
                scale: 1,
                rotation: 0,
                panX: 0,
                panY: 0,
                fitMode: 'contain'
              }
            }));
            if (isQuotesProduct && quotesPreference === 'create-own') {
              setQuoteBgImage(result);
            }
            setActivePanelIndex(target);
            setValidationWarning(null);
            endPreloader(PRELOADER_MIN_MS);
          };
          img.onerror = () => {
            setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
            setPanelImages((prev) => ({
              ...prev,
              [target]: {
                ...createDefaultPanel(),
                imageUrl: result,
                fitMode: 'contain'
              }
            }));
            if (isQuotesProduct && quotesPreference === 'create-own') {
              setQuoteBgImage(result);
            }
            setActivePanelIndex(target);
            setValidationWarning(null);
            endPreloader(PRELOADER_MIN_MS);
          };
          img.src = result;
        } else {
          endPreloader();
        }
      };
      reader.onerror = () => endPreloader();
      reader.readAsDataURL(file);
    });
  };

  const handleAssignPhotoToPanel = (photoUrl: string, panelIdx: number) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width || 1200;
      const height = img.naturalHeight || img.height || 1200;
      setPanelImages((prev) => ({
        ...prev,
        [panelIdx]: {
          ...createDefaultPanel(),
          imageUrl: photoUrl,
          uploadedImage: {
            originalSrc: photoUrl,
            width,
            height,
            aspectRatio: width / height
          },
          scale: 1,
          rotation: 0,
          panX: 0,
          panY: 0,
          fitMode: 'cover'
        }
      }));
    };
    img.onerror = () => {
      setPanelImages((prev) => ({
        ...prev,
        [panelIdx]: { ...createDefaultPanel(), imageUrl: photoUrl }
      }));
    };
    img.src = photoUrl;
    setUploadedPhotos((prev) => (prev.includes(photoUrl) ? prev : [photoUrl, ...prev]));
    setActivePanelIndex(panelIdx);
    setValidationWarning(null);
  };

  // Frame click: empty frame opens the file picker for that frame, filled frame just selects it
  const handlePanelClick = (panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    if (!panelImages[panelIdx]?.imageUrl) {
      if (isWordArtProduct) {
        setIsWordArtPersonalizeModalOpen(true);
        return;
      }
      uploadTargetRef.current = panelIdx;
      fileInputRef.current?.click();
    }
  };

  // Drag a thumbnail (upload tray / gallery) or a file from the desktop onto any frame
  const handlePanelDrop = (e: React.DragEvent, panelIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPanel(null);
    const trayIdx = e.dataTransfer.getData('application/x-ci-tray');
    if (trayIdx !== '') {
      const url = uploadedPhotos[Number(trayIdx)];
      if (url) handleAssignPhotoToPanel(url, panelIdx);
      return;
    }
    const galleryUrl = e.dataTransfer.getData('application/x-ci-url');
    if (galleryUrl) {
      handleAssignPhotoToPanel(galleryUrl, panelIdx);
      setUploadedPhotos((prev) => (prev.includes(galleryUrl) ? prev : [galleryUrl, ...prev]));
      return;
    }
    const plainUrl = e.dataTransfer.getData('text/plain');
    if (plainUrl && (plainUrl.startsWith('data:image') || plainUrl.startsWith('http://') || plainUrl.startsWith('https://') || plainUrl.startsWith('blob:'))) {
      handleAssignPhotoToPanel(plainUrl, panelIdx);
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files, panelIdx);
    }
  };

  // Spread onto any frame element: click, drag-image-to-pan, and drop targets
  const panelHandlers = (panelIdx: number) => ({
    onClick: () => handlePanelClick(panelIdx),
    onPointerDown: (e: React.PointerEvent) => handlePointerDown(e, panelIdx),
    onPointerCancel: (e: React.PointerEvent) => handlePointerUp(e),
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (dragOverPanel !== panelIdx) setDragOverPanel(panelIdx);
    },
    onDragLeave: () => setDragOverPanel((cur) => (cur === panelIdx ? null : cur)),
    onDrop: (e: React.DragEvent) => handlePanelDrop(e, panelIdx)
  });

  // AI-style art generator (procedural, runs in the browser)
  const handleGenerateArt = () => {
    const prompt = aiPrompt.trim() || 'abstract colour';
    const results = [0, 1, 2, 3].map((v) => generateArtwork(prompt, v)).filter(Boolean);
    setAiResults(results);
  };

  // --- Text & Clipart Items (Shared with Acrylic Customizer) ---
  const getSlotIndex = (t: TextElement): number => {
    if (typeof t.panelIndex === 'number') return t.panelIndex;
    if (typeof t.slotId === 'number') return t.slotId;
    if (typeof t.slotId === 'string') {
      const parsed = parseInt(t.slotId, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const handleAddText = (initialText = '', targetSlot?: number) => {
    const slot = targetSlot !== undefined ? targetSlot : (activePanelIndex || 0);
    // If there is already an empty text element in this slot, focus that instead of adding a second empty one
    const existingEmpty = textElements.find((t) => getSlotIndex(t) === slot && !t.text.trim());
    if (existingEmpty) {
      setSelectedElement({ type: 'text', id: existingEmpty.id });
      setShowTextModal(true);
      setShowClipartModal(false);
      return;
    }
    const id = `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newText: TextElement = {
      id,
      productId: selectedProductTypeId,
      slotId: slot,
      panelIndex: slot,
      text: initialText,
      fontFamily: 'Playfair Display',
      fontSize: 32,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#FFFFFF',
      alignment: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
      rotation: 0,
      x: 50,
      y: 50
    };
    setTextElements((prev) => [...prev, newText]);
    setSelectedElement({ type: 'text', id });
    setShowTextModal(true);
    setShowClipartModal(false);
  };

  const renderPanelTextItems = (slotIdx: number) => {
    const slotTexts = textElements.filter(
      (txt) => getSlotIndex(txt) === slotIdx && Boolean(txt.text && txt.text.trim().length > 0)
    );
    if (slotTexts.length === 0) return null;

    return (
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {slotTexts.map((txt) => {
          const isSel = selectedElement?.type === 'text' && selectedElement.id === txt.id;
          return (
            <div
              key={txt.id}
              onPointerDown={(e) => startItemDrag(e, 'text', txt.id, txt.x, txt.y)}
              onPointerMove={(e) => moveItemDrag(e, 'text', txt.id)}
              onPointerUp={endItemDrag}
              onPointerCancel={endItemDrag}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedElement({ type: 'text', id: txt.id });
                setActivePanelIndex(slotIdx);
                setShowTextModal(true);
              }}
              style={{
                position: 'absolute',
                left: `${txt.x}%`,
                top: `${txt.y}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: txt.fontFamily,
                fontSize: `${txt.fontSize}px`,
                fontWeight: txt.fontWeight === 'bold' ? 700 : 400,
                fontStyle: txt.fontStyle || 'normal',
                color: txt.color,
                textAlign: txt.alignment || 'center',
                whiteSpace: 'pre',
                lineHeight: 1.2,
                textShadow: txt.color.toUpperCase() === '#FFFFFF' ? '0 1px 4px rgba(0,0,0,0.55)' : 'none',
                pointerEvents: 'auto',
                touchAction: 'none'
              }}
              className={`cursor-move select-none px-2 py-0.5 rounded-lg transition-all ${
                isSel
                  ? 'ring-2 ring-[#0E4A93] bg-black/35 backdrop-blur-xs'
                  : 'hover:ring-1 hover:ring-white/80'
              }`}
            >
              {txt.text}
            </div>
          );
        })}
      </div>
    );
  };

  const handleUpdateActiveText = (updates: Partial<TextElement>) => {
    if (selectedElement?.type !== 'text' || !selectedElement.id) return;
    setTextElements((prev) => prev.map((t) => (t.id === selectedElement.id ? { ...t, ...updates } : t)));
  };

  const handleDuplicateActiveText = () => {
    if (selectedElement?.type !== 'text' || !selectedElement.id) return;
    const src = textElements.find((t) => t.id === selectedElement.id);
    if (!src) return;
    const newId = `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const currentSlot = getSlotIndex(src);
    const copy: TextElement = {
      ...src,
      id: newId,
      productId: src.productId || selectedProductTypeId,
      slotId: currentSlot,
      panelIndex: currentSlot,
      x: Math.min(85, src.x + 4),
      y: Math.min(85, src.y + 4)
    };
    setTextElements((prev) => [...prev, copy]);
    setSelectedElement({ type: 'text', id: newId });
  };

  const handleDeleteActiveText = () => {
    if (selectedElement?.type !== 'text' || !selectedElement.id) return;
    setTextElements((prev) => prev.filter((t) => t.id !== selectedElement.id));
    setSelectedElement(null);
    setShowTextModal(false);
  };

  const handleSelectClipart = (clip: ClipartItem) => {
    const newId = `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newClipObj: ClipartElement = {
      id: newId,
      clipartId: clip.id,
      name: clip.name,
      svgPath: clip.svgPath,
      viewBox: clip.viewBox,
      x: 50,
      y: 50,
      scale: 1.2,
      rotation: 0,
      color: '#D4AF37'
    };
    setClipartElements((prev) => [...prev, newClipObj]);
    setSelectedElement({ type: 'clipart', id: newId });
  };

  const handleUpdateActiveClipart = (updates: Partial<ClipartElement>) => {
    if (selectedElement?.type !== 'clipart' || !selectedElement.id) return;
    setClipartElements((prev) => prev.map((c) => (c.id === selectedElement.id ? { ...c, ...updates } : c)));
  };

  const handleDuplicateActiveClipart = () => {
    if (selectedElement?.type !== 'clipart' || !selectedElement.id) return;
    const src = clipartElements.find((c) => c.id === selectedElement.id);
    if (!src) return;
    const newId = `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const copy: ClipartElement = {
      ...src,
      id: newId,
      x: Math.min(85, src.x + 4),
      y: Math.min(85, src.y + 4)
    };
    setClipartElements((prev) => [...prev, copy]);
    setSelectedElement({ type: 'clipart', id: newId });
  };

  const handleDeleteActiveClipart = () => {
    if (selectedElement?.type !== 'clipart' || !selectedElement.id) return;
    setClipartElements((prev) => prev.filter((c) => c.id !== selectedElement.id));
    setSelectedElement(null);
  };

  const removeSelectedItem = () => {
    if (!selectedElement) return;
    if (selectedElement.type === 'text') handleDeleteActiveText();
    else handleDeleteActiveClipart();
  };

  const startItemDrag = (e: React.PointerEvent, type: 'text' | 'clipart', id: string, x: number, y: number) => {
    e.stopPropagation();
    setSelectedElement({ type, id });
    if (type === 'text') {
      setShowTextModal(true);
      setShowClipartModal(false);
    }
    const targetEl = e.currentTarget as HTMLElement;
    const parentContainer = targetEl.closest('.ci-slot-container') || stageRef.current;
    const rect = parentContainer?.getBoundingClientRect() || stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    itemDragRef.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, w: rect.width, h: rect.height };
    targetEl.setPointerCapture(e.pointerId);
  };

  const moveItemDrag = (e: React.PointerEvent, type: 'text' | 'clipart', id: string) => {
    const d = itemDragRef.current;
    if (!d) return;
    const nx = Math.max(5, Math.min(95, d.origX + ((e.clientX - d.startX) / d.w) * 100));
    const ny = Math.max(5, Math.min(95, d.origY + ((e.clientY - d.startY) / d.h) * 100));
    if (type === 'text') {
      handleUpdateActiveText({ x: nx, y: ny });
    } else {
      handleUpdateActiveClipart({ x: nx, y: ny });
    }
  };

  const endItemDrag = () => {
    itemDragRef.current = null;
  };

  const updateActivePanelTransform = (updater: (curr: PanelImageState) => Partial<PanelImageState>) => {
    const targetIdx = (isSplitProduct || isMosaicProduct) ? 0 : activePanelIndex;
    setPanelImages((prev) => {
      const curr = prev[targetIdx] || createDefaultPanel();
      return { ...prev, [targetIdx]: { ...curr, ...updater(curr) } };
    });
  };

  // Helper to compute exact rendered dimensions and pan bounds for cover scaling
  const computePanBounds = (
    scale: number,
    panelIdx: number = activePanelIndex,
    explicitWidth?: number,
    explicitHeight?: number
  ) => {
    const targetIdx = (isSplitProduct || isMosaicProduct) ? 0 : panelIdx;
    const curr = panelImages[targetIdx];
    const imgMeta = curr?.uploadedImage;
    const natWidth = imgMeta?.width || 1200;
    const natHeight = imgMeta?.height || 800;
    const imgAspect = natWidth / Math.max(1, natHeight);

    let containerWidth = explicitWidth;
    let containerHeight = explicitHeight;

    if (!containerWidth || !containerHeight) {
      if (workspaceCanvasBoxRef.current) {
        const rect = workspaceCanvasBoxRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          containerWidth = rect.width;
          containerHeight = rect.height;
        }
      }
    }

    if (!containerWidth || !containerHeight) {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const baseW = Math.min(480, rect.width * 0.75);
          containerWidth = printAspect >= 1 ? baseW : baseW * printAspect;
          containerHeight = printAspect >= 1 ? baseW / printAspect : baseW;
        }
      }
    }

    const cWidth = containerWidth && containerWidth > 0 ? containerWidth : (printAspect >= 1 ? 400 * printAspect : 400);
    const cHeight = containerHeight && containerHeight > 0 ? containerHeight : (printAspect >= 1 ? 400 : 400 / printAspect);
    const frameAspect = cWidth / cHeight;

    let baseWidth = cWidth;
    let baseHeight = cHeight;

    if (imgAspect > frameAspect) {
      baseHeight = cHeight;
      baseWidth = cHeight * imgAspect;
    } else {
      baseWidth = cWidth;
      baseHeight = cWidth / imgAspect;
    }

    const renderedWidth = baseWidth * scale;
    const renderedHeight = baseHeight * scale;

    const maxPanX = Math.max(0, (renderedWidth - cWidth) / 2);
    const maxPanY = Math.max(0, (renderedHeight - cHeight) / 2);

    return {
      maxPanX,
      maxPanY,
      renderedWidth,
      renderedHeight,
      containerWidth: cWidth,
      containerHeight: cHeight,
      isWiderThanFrame: imgAspect > frameAspect,
      isTallerThanFrame: imgAspect < frameAspect,
      isEqualAspect: Math.abs(imgAspect - frameAspect) < 0.01
    };
  };

  const handleZoomIn = () => {
    updateActivePanelTransform((curr) => {
      const newScale = Math.min(3, +(curr.scale + 0.15).toFixed(2));
      const { maxPanX, maxPanY } = computePanBounds(newScale, activePanelIndex);
      return {
        scale: newScale,
        panX: maxPanX > 0.5 ? Math.max(-maxPanX, Math.min(maxPanX, curr.panX)) : 0,
        panY: maxPanY > 0.5 ? Math.max(-maxPanY, Math.min(maxPanY, curr.panY)) : 0
      };
    });
  };

  const handleZoomOut = () => {
    updateActivePanelTransform((curr) => {
      const newScale = Math.max(1, +(curr.scale - 0.15).toFixed(2));
      const { maxPanX, maxPanY } = computePanBounds(newScale, activePanelIndex);
      return {
        scale: newScale,
        panX: maxPanX > 0.5 ? Math.max(-maxPanX, Math.min(maxPanX, curr.panX)) : 0,
        panY: maxPanY > 0.5 ? Math.max(-maxPanY, Math.min(maxPanY, curr.panY)) : 0
      };
    });
  };

  const handleRotateLeft = () => updateActivePanelTransform((curr) => ({ rotation: (curr.rotation - 90 + 360) % 360 }));
  const handleRotateRight = () => updateActivePanelTransform((curr) => ({ rotation: (curr.rotation + 90) % 360 }));
  const handleRotate90 = handleRotateRight;
  const handleFit = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, fitMode: 'contain' }));
  const handleReset = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, rotation: 0, fitMode: 'cover' }));

  // Directional nudge for predictable, intentional horizontal and vertical image positioning
  const handleNudge = (dx: number, dy: number) => {
    updateActivePanelTransform((curr) => {
      const targetIdx = (isSplitProduct || isMosaicProduct) ? 0 : activePanelIndex;
      const { maxPanX, maxPanY } = computePanBounds(curr.scale, targetIdx);
      const step = 20;
      const newPanX = maxPanX > 0.5 ? Math.max(-maxPanX, Math.min(maxPanX, (curr.panX || 0) + dx * step)) : 0;
      const newPanY = maxPanY > 0.5 ? Math.max(-maxPanY, Math.min(maxPanY, (curr.panY || 0) + dy * step)) : 0;
      return {
        panX: newPanX,
        panY: newPanY
      };
    });
  };

  const handleApplyFilter = (filter: ColorFilterType) => updateActivePanelTransform(() => ({ filter }));

  // Fill: makes the uploaded image completely cover the canvas area (cover crop), preserving original image intact
  const handleFill = (panelIdx = activePanelIndex) => {
    setPanelImages((prev) => {
      const curr = prev[panelIdx] || createDefaultPanel();
      return {
        ...prev,
        [panelIdx]: {
          ...curr,
          fitMode: 'cover',
          panX: 0,
          panY: 0,
          scale: 1
        }
      };
    });
  };

  // Fix: fits the complete uncropped original image inside the canvas area without clipping or distortion
  const handleFix = (panelIdx = activePanelIndex) => {
    setPanelImages((prev) => {
      const curr = prev[panelIdx] || createDefaultPanel();
      return {
        ...prev,
        [panelIdx]: {
          ...curr,
          fitMode: 'contain',
          panX: 0,
          panY: 0,
          scale: 1
        }
      };
    });
  };

  // Wheel listener ref callback: prevent page scroll over the canvas, but wheel zoom is strictly disabled
  const wheelBoundNodesRef = useRef<WeakSet<HTMLElement>>(new WeakSet());

  const registerWheelRef = (_panelIdx: number) => (el: HTMLElement | null) => {
    if (!el || wheelBoundNodesRef.current.has(el)) return;
    wheelBoundNodesRef.current.add(el);
    const onNodeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Zooming via mouse wheel is disabled per specification (zooming controlled solely by dedicated zoom buttons)
    };
    el.addEventListener('wheel', onNodeWheel, { passive: false });
  };

  // Mouse wheel zoom fallback - disabled per specification
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Smooth 60fps 360° auto-rotate loop using requestAnimationFrame
  useEffect(() => {
    if (!viewerAutoRotate || viewerMode !== '360' || isViewerDragging) return;
    let rafId = 0;
    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = Math.min(0.064, (now - lastTime) / 1000);
      lastTime = now;
      setViewerRotation((prev) => (prev + dt * 36) % 360);
      rafId = window.requestAnimationFrame(animate);
    };
    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [viewerAutoRotate, viewerMode, isViewerDragging]);

  // Drag-to-spin handlers for the 3D / 360 viewer (supports mouse & touch)
  const handleViewerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    setViewerAutoRotate(false);
    setIsViewerDragging(true);
    viewerDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotation: viewerRotation,
      startTiltX: viewerTiltX
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const handleViewerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!viewerDragRef.current) return;
    e.preventDefault();
    const deltaX = e.clientX - viewerDragRef.current.x;
    const deltaY = e.clientY - viewerDragRef.current.y;
    // Free accumulated continuous rotation: horizontal drag rotates Y-axis, vertical drag tilts/rotates X-axis, diagonal rotates both
    const sensitivity = 0.65;
    const nextRot = viewerDragRef.current.startRotation + deltaX * sensitivity;
    const nextTilt = viewerDragRef.current.startTiltX - deltaY * sensitivity;
    setViewerRotation(nextRot);
    setViewerTiltX(nextTilt);
  };
  const handleViewerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewerDragRef.current) {
      viewerDragRef.current = null;
      setIsViewerDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Mouse/Touch Drag Handlers with Multi-Touch Pinch-to-Zoom Support
  const handlePointerDown = (e: React.PointerEvent, panelIdx: number) => {
    const targetIdx = (isSplitProduct || isMosaicProduct) ? 0 : panelIdx;
    setActivePanelIndex(targetIdx);
    const curr = panelImages[targetIdx];
    if (!curr?.imageUrl) return;

    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cWidth = rect.width > 0 ? rect.width : 400;
    const cHeight = rect.height > 0 ? rect.height : 300;

    if (activePointersRef.current.size >= 2) {
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      initialPinchDistRef.current = dist > 0 ? dist : 1;
      initialPinchScaleRef.current = curr.scale || 1;
      setIsDragging(false);
    } else {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        initialPanX: curr.panX,
        initialPanY: curr.panY,
        containerWidth: cWidth,
        containerHeight: cHeight,
        hasMoved: false
      };
    }

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // 1. Multi-touch Pinch-to-Zoom
    if (activePointersRef.current.size >= 2 && initialPinchDistRef.current) {
      const pts = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = currentDist / initialPinchDistRef.current;
      const targetScale = Math.max(1, Math.min(3, Number((initialPinchScaleRef.current * ratio).toFixed(2))));
      updateActivePanelTransform(() => ({ scale: targetScale }));
      return;
    }

    // 2. Single-Pointer Touch / Mouse Panning
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Movement threshold (6px) to prevent accidental panning on clicks, taps, or tile interactions
    if (!dragStartRef.current.hasMoved) {
      if (Math.hypot(deltaX, deltaY) < 6) {
        return;
      }
      dragStartRef.current.hasMoved = true;
    }

    const { initialPanX, initialPanY, containerWidth, containerHeight } = dragStartRef.current;

    const targetIdx = (isSplitProduct || isMosaicProduct) ? 0 : activePanelIndex;
    const curr = panelImages[targetIdx];
    const scale = curr?.scale || 1;

    const { maxPanX, maxPanY } = computePanBounds(scale, targetIdx, containerWidth, containerHeight);

    const rawPanX = initialPanX + deltaX;
    const rawPanY = initialPanY + deltaY;

    // Constrain sliding strictly along the overflow direction(s)
    const clampedPanX = maxPanX > 0.5 ? Math.max(-maxPanX, Math.min(maxPanX, rawPanX)) : 0;
    const clampedPanY = maxPanY > 0.5 ? Math.max(-maxPanY, Math.min(maxPanY, rawPanY)) : 0;

    updateActivePanelTransform(() => ({
      panX: clampedPanX,
      panY: clampedPanY
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      initialPinchDistRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      setIsDragging(false);
    }
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Safe ignore
    }
  };

  // Apply a design template: sets a canned caption + the template's vector decoration
  const handleApplyTemplate = (tpl: DesignTemplate) => {
    setSelectedTemplateId(tpl.id);
    // The caption is a normal text item (id "tpl-text"): one per template, movable and editable like any other
    setTextElements((prev) => {
      const rest = prev.filter((t) => t.id !== 'tpl-text');
      return [
        ...rest,
        {
          id: 'tpl-text',
          text: tpl.textPreset,
          fontFamily: 'Playfair Display',
          fontSize: 34,
          fontWeight: 'bold',
          fontStyle: 'normal',
          color: '#FFFFFF',
          alignment: 'center',
          lineHeight: 1.2,
          letterSpacing: 0,
          rotation: 0,
          x: 50,
          y: 86
        }
      ];
    });
    setSelectedElement({ type: 'text', id: 'tpl-text' });
  };

  const handleRemoveTemplate = () => {
    setSelectedTemplateId(null);
    setTextElements((prev) => prev.filter((t) => t.id !== 'tpl-text'));
    setSelectedElement((prev) => (prev?.id === 'tpl-text' ? null : prev));
    setShowTextModal(false);
  };

  const activeTemplate = useMemo(() => DESIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) || null, [selectedTemplateId]);

  // Width / height ratio of the print: fixed for symmetric shapes (circle, heart...), otherwise follows the chosen size.
  const printAspect = useMemo(() => {
    if (isWordArtProduct) {
      return wordArtSizeOption.aspectRatio || (wordArtSizeOption.widthInches / Math.max(1, wordArtSizeOption.heightInches));
    }
    if (isBusRollProduct) {
      return busRollConfig.widthInches / Math.max(1, busRollConfig.heightInches);
    }
    if (isBannerProduct) {
      return bannerConfig.widthInches / Math.max(1, bannerConfig.heightInches);
    }
    // Single print canvas: Authoritative aspect ratio directly from selected size (or layout preset if explicit)
    if (isSinglePrintCanvas) {
      if (selectedLayoutId === 'single-layout-landscape') return 1.5;
      if (selectedLayoutId === 'single-layout-portrait') return 2 / 3;
      if (selectedLayoutId === 'single-layout-square') return 1;
      const w = isCustomSize && canUseCustomSize
        ? customWidth
        : (currentSizeOption?.widthInches || currentSizeOption?.panels?.[0]?.widthRatio || 10);
      const h = isCustomSize && canUseCustomSize
        ? customHeight
        : (currentSizeOption?.heightInches || currentSizeOption?.panels?.[0]?.heightRatio || 10);
      return w / Math.max(1, h);
    }
    if (isLayoutProduct) {
      const layout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
      return layout.aspectRatio || (layout.overallWidthInches / Math.max(1, layout.overallHeightInches)) || 1;
    }
    if (shapeApplies && currentShape.isSingleDimension) return 1;
    if (isCustomSize && canUseCustomSize) return customWidth / customHeight;
    const p = panels[0];
    return p ? p.widthRatio / p.heightRatio : 1;
  }, [
    selectedProductTypeId,
    isSinglePrintCanvas,
    isLayoutProduct,
    selectedLayoutId,
    currentSizeOption,
    wordArtSizeOption,
    busRollConfig.widthInches,
    busRollConfig.heightInches,
    bannerConfig.widthInches,
    bannerConfig.heightInches,
    shapeApplies,
    currentShape,
    isCustomSize,
    canUseCustomSize,
    customWidth,
    customHeight,
    panels
  ]);

  // Continuously track physical workspace canvas dimensions for pixel-perfect edge wrap synchronization
  useEffect(() => {
    const el = workspaceCanvasBoxRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setWorkspaceBoxSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [printAspect, selectedProductTypeId, selectedShapeId, selectedSizeId, selectedLayoutId]);

  const currentLayout = useMemo(() => {
    return STANDARD_LAYOUT_PRESETS.find((l) => l.id === selectedLayoutId) || STANDARD_LAYOUT_PRESETS[0];
  }, [selectedLayoutId]);

  const layoutSlots = useMemo(() => {
    return getLayoutSlots(currentLayout.layoutType, printAspect);
  }, [currentLayout.layoutType, printAspect]);

  // Select a layout preset: switches product type + size so panel count actually changes
  const handleSelectLayoutPreset = (preset: LayoutPreset) => {
    setExpandedLayoutId(preset.id);
    setSelectedProductTypeId(preset.productTypeId);
    setSelectedSizeId(preset.sizeId);
    setIsCustomSize(false);
    setActivePanelIndex(0);
  };

  // Small mockup thumbnail matching each layout's real panel arrangement (Acrylic card style)
  const renderLayoutThumbnail = (arrangement: LayoutArrangement, isSelected = false) => {
    const cellClass = `rounded-[2px] border-[1.5px] transition-colors ${
      isSelected
        ? 'border-[#0E4A93] bg-[#0E4A93]/20'
        : 'border-[#0E4A93]/75 bg-[#0E4A93]/12 group-hover:border-[#0E4A93]'
    }`;
    const cell = <div className={cellClass} />;
    if (arrangement === 'single') return <div className={`w-12 h-10 ${cellClass}`} />;
    if (arrangement === 'grid2') return <div className="w-12 h-10 grid grid-cols-2 gap-1">{cell}{cell}</div>;
    if (arrangement === 'grid3') return <div className="w-12 h-10 grid grid-cols-3 gap-1">{cell}{cell}{cell}</div>;
    if (arrangement === 'grid4') return <div className="w-11 h-11 grid grid-cols-2 grid-rows-2 gap-1">{cell}{cell}{cell}{cell}</div>;
    if (arrangement === 'split3') return <div className="w-12 h-10 grid grid-cols-3 gap-0.5">{cell}{cell}{cell}</div>;
    // wall3: one wide panel on top, two smaller squares below
    return (
      <div className="w-12 h-11 flex flex-col gap-1">
        <div className={`flex-[1.4] ${cellClass}`} />
        <div className="flex-1 grid grid-cols-2 gap-1">{cell}{cell}</div>
      </div>
    );
  };

  // Proportional visual preview for each Canvas SizeOption card (Acrylic size card style)
  const renderSizePreview = (opt: SizeOption, isSelected: boolean) => {
    const geom = getCanvasProductGeometry(opt.productTypeId, opt, currentShape.id);
    return geom.renderSvgPreview({
      isSelected,
      widthInches: opt.widthInches,
      heightInches: opt.heightInches,
      label: opt.label,
      diagramType: opt.diagramType
    });
  };

  // Back-of-frame hanging hardware, shown on the flipped-around 3D/360 back face
  // and as a wall bracket above the print in Room View.
  const renderHardwareGraphic = (hardwareId: string, forWall: boolean) => {
    if (hardwareId === 'no-hooks') return null;
    if (hardwareId === 'easel-back') {
      return forWall ? null : (
        <svg viewBox="0 0 100 60" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-8 pointer-events-none">
          <path d="M50,4 L20,56 M50,4 L80,56" stroke="#a8a29e" strokeWidth={4} strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    // Standard hanging bracket: brass plate with a sawtooth zigzag + two screw holes
    return (
      <svg viewBox="0 0 100 26" className={forWall ? 'w-16 h-4' : 'absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 pointer-events-none'}>
        <rect x={2} y={2} width={96} height={22} rx={3} fill="#c9a24b" stroke="#8a6d2f" strokeWidth={1} />
        <circle cx={10} cy={13} r={3} fill="#5c4a20" />
        <circle cx={90} cy={13} r={3} fill="#5c4a20" />
        <path d="M22,20 L30,6 L38,20 L46,6 L54,20 L62,6 L70,20 L78,6" fill="none" stroke="#5c4a20" strokeWidth={2} />
      </svg>
    );
  };

  // Add to Cart Action
  const handleAddToCart = () => {
    if (!isComplete) {
      setValidationWarning('Please upload or select at least one photograph to customize your canvas print.');
      setTimeout(() => setValidationWarning(null), 4000);
      setActiveTab('UPLOAD');
      return;
    }

    const firstImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || catalogProduct.image;
    const retouchLabels = RETOUCH_CHECKS.filter((r) => retouchChecks[r.id]).map((r) => r.label);

    onAddToCartCustomized({
      product: {
        ...catalogProduct,
        price: unitPrice,
        categorySlug: activeMaterial as any,
        name: isWordArtProduct
          ? `${selectedProductType.name} - ${wordArtSizeOption.label}`
          : isQuotesProduct
          ? `${selectedProductType.name} - ${getQuoteTemplate(selectedQuoteTemplateId)?.title || 'Custom Quote'} (${currentSizeOption.label})`
          : isDigitalPaintingProduct
          ? `${selectedProductType.name} (${getDigitalPaintingEffect(digitalPaintingConfig.selectedEffectId).name}) - ${isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.label}`
          : isBusRollProduct
          ? `${selectedProductType.name} - ${busRollConfig.widthInches}" × ${busRollConfig.heightInches}" (${busRollConfig.lines[0]?.text || 'Custom'})`
          : isBannerProduct
          ? `${selectedProductType.name} - ${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}${bannerConfig.isCustom ? ' (Custom)' : ''}`
          : isPopArtProduct
          ? `${selectedProductType.name} (${getPopArtStyle(popArtConfig.selectedStyleId).name}) - ${isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.label}`
          : isLyricProduct
          ? `${selectedProductType.name} (${selectedLyricTemplate.name}) - ${isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.label}`
          : `${selectedProductType.name} - ${isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.label}`
      },
      size: isWordArtProduct
        ? `${wordArtSizeOption.widthInches}" × ${wordArtSizeOption.heightInches}"`
        : isBusRollProduct
        ? `${busRollConfig.widthInches}" × ${busRollConfig.heightInches}"`
        : isBannerProduct
        ? `${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}`
        : isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.dimensionsSummary,
      finish: activeMaterial === 'acrylic'
        ? (ACRYLIC_THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || '3mm Acrylic')
        : (CANVAS_THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || 'Thin Gallery Wrap (0.75")'),
      quantity,
      customText: customText || undefined,
      photoUrl: (isPopArtProduct && popArtConfig.processedImageUrl)
        ? popArtConfig.processedImageUrl
        : (isLyricProduct && !panelImages[0]?.imageUrl)
        ? selectedLyricTemplate.previewImage
        : (isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage)
        ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="${encodeURIComponent(quoteBgColor)}"/><text x="50%" y="45%" text-anchor="middle" fill="${encodeURIComponent(quoteTextColor)}" font-family="Georgia, serif" font-size="28" font-weight="bold">${encodeURIComponent(quoteCustomText.slice(0, 60))}</text><text x="50%" y="60%" text-anchor="middle" fill="${encodeURIComponent(quoteTextColor)}" font-family="Georgia, serif" font-size="18" font-style="italic">— ${encodeURIComponent(quoteAuthor)}</text></svg>`
        : (isQuotesProduct && quotesPreference === 'collection')
        ? (getQuoteTemplate(selectedQuoteTemplateId)?.image || firstImage)
        : firstImage,
      calculatedPrice: totalPrice,
      material: activeMaterial === 'acrylic' ? 'Premium 3mm/5mm Optical Acrylic' : (MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Standard 280 GSM Cotton Canvas'),
      style: isPopArtProduct
        ? `Pop Art (${getPopArtStyle(popArtConfig.selectedStyleId).name})`
        : isLyricProduct
        ? (activeMaterial === 'acrylic' ? `Lyric on Acrylic (${selectedLyricTemplate.name})` : `Lyric on Canvas (${selectedLyricTemplate.name})`)
        : selectedProductType.name,
      base: isBannerProduct
        ? (CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name || 'No Hardware')
        : (HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label || 'No Hooks'),
      customizationDetails: {
        material: activeMaterial,
        productTypeId: selectedProductTypeId,
        sizeId: selectedSizeId,
        shape: shapeApplies ? currentShape.name : undefined,
        wrap: activeMaterial === 'canvas' ? (CANVAS_THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.label) : undefined,
        borderWidth: selectedBorderWidthId !== 'none' ? (selectedBorderWidthId === 'custom-color' ? 'Custom Border' : (ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.label || 'Thin Border')) : 'No Border',
        borderColor: selectedBorderWidthId !== 'none' ? selectedBorderColor : undefined,
        frame: selectedFrameId !== 'no-frame' ? FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name : undefined,
        mirrorImage,
        display: activeMaterial === 'canvas' ? DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId)?.label : undefined,
        lamination: activeMaterial === 'canvas' ? LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.label : undefined,
        retouching: retouchLabels,
        majorRetouchText: majorRetouchText || undefined,
        proofRequested,
        template: selectedTemplateId ? DESIGN_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name : undefined,
        quotePreference: isQuotesProduct ? (quotesPreference || 'collection') : undefined,
        quoteTemplate: isQuotesProduct ? (quotesPreference === 'create-own' ? 'Create Your Own' : getQuoteTemplate(selectedQuoteTemplateId)?.title) : undefined,
        quoteCustomText: isQuotesProduct && quotesPreference === 'create-own' ? quoteCustomText : undefined,
        quoteAuthor: isQuotesProduct && quotesPreference === 'create-own' ? quoteAuthor : undefined,
        quoteBgColor: isQuotesProduct && quotesPreference === 'create-own' ? quoteBgColor : undefined,
        quoteBgImage: isQuotesProduct && quotesPreference === 'create-own' ? (quoteBgImage || undefined) : undefined,
        quoteFontFamily: isQuotesProduct && quotesPreference === 'create-own' ? quoteFontFamily : undefined,
        quoteTextColor: isQuotesProduct && quotesPreference === 'create-own' ? quoteTextColor : undefined,
        digitalPaintingEffect: isDigitalPaintingProduct ? getDigitalPaintingEffect(digitalPaintingConfig.selectedEffectId).name : undefined,
        digitalPaintingSubject: isDigitalPaintingProduct ? digitalPaintingConfig.subjectType : undefined,
        digitalPaintingBackground: isDigitalPaintingProduct ? (
          digitalPaintingConfig.backgroundOption === 'solid'
            ? `Solid Background (${digitalPaintingConfig.backgroundColor})`
            : digitalPaintingConfig.backgroundOption === 'artist_choice'
            ? 'Let the Artist Choose'
            : 'Original Background'
        ) : undefined,
        peopleCount: isDigitalPaintingProduct && digitalPaintingConfig.subjectType === 'people_pets' ? digitalPaintingConfig.peopleCount : undefined,
        petsCount: isDigitalPaintingProduct && digitalPaintingConfig.subjectType === 'people_pets' ? digitalPaintingConfig.petsCount : undefined,
        busRollLines: isBusRollProduct ? busRollConfig.lines.map((l) => l.text).join(' / ') : undefined,
        busRollBackgroundColor: isBusRollProduct ? busRollConfig.backgroundColor : undefined,
        busRollPattern: isBusRollProduct ? busRollConfig.patternId : undefined,
        busRollFont: isBusRollProduct ? busRollConfig.fontFamily : undefined,
        bannerUnit: isBannerProduct ? bannerConfig.unit : undefined,
        bannerWidth: isBannerProduct ? bannerConfig.width : undefined,
        bannerHeight: isBannerProduct ? bannerConfig.height : undefined,
        bannerWidthInches: isBannerProduct ? bannerConfig.widthInches : undefined,
        bannerHeightInches: isBannerProduct ? bannerConfig.heightInches : undefined,
        bannerBackgroundColor: isBannerProduct ? bannerConfig.backgroundColor : undefined,
        bannerHardware: isBannerProduct ? (CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name || 'No Hardware') : undefined,
        popArtStyleId: isPopArtProduct ? popArtConfig.selectedStyleId : undefined,
        popArtStyleName: isPopArtProduct ? getPopArtStyle(popArtConfig.selectedStyleId).name : undefined,
        popArtPriceAdjustment: isPopArtProduct ? getPopArtStyle(popArtConfig.selectedStyleId).priceAdjustment : undefined,
        popArtProcessedArtwork: isPopArtProduct && popArtConfig.processedImageUrl ? popArtConfig.processedImageUrl : undefined,
        lyricTemplateId: isLyricProduct ? lyricConfig.selectedTemplateId : undefined,
        lyricTemplateName: isLyricProduct ? selectedLyricTemplate.name : undefined,
        lyricTitle: isLyricProduct ? (lyricConfig.title ?? lyricConfig.songTitle ?? '') : undefined,
        lyricArtist: isLyricProduct ? (lyricConfig.artistOrSubtitle ?? lyricConfig.artistOrNames ?? '') : undefined,
        lyricDateOrNames: isLyricProduct ? (lyricConfig.dateOrNames ?? lyricConfig.dateOrInscription ?? '') : undefined,
        lyricText: isLyricProduct ? (lyricConfig.lyrics ?? lyricConfig.lyricsText ?? '') : undefined,
        lyricFontFamily: isLyricProduct ? lyricConfig.fontFamily : undefined,
        lyricTextColor: isLyricProduct ? lyricConfig.textColor : undefined,
        lyricLayout: isLyricProduct ? (lyricConfig.layout || selectedLyricTemplate.defaultLayout) : undefined,
        lyricOverlayDarkness: isLyricProduct ? lyricConfig.overlayDarkness : undefined,
        panels: panels.map((p, idx) => ({
          dimension: p.dimension,
          imageUrl: panelImages[idx]?.imageUrl || null,
          scale: panelImages[idx]?.scale || 1,
          rotation: panelImages[idx]?.rotation || 0,
          panX: panelImages[idx]?.panX || 0,
          panY: panelImages[idx]?.panY || 0,
          filter: panelImages[idx]?.filter || 'original'
        })),
        clipart: clipartElements.map((c) => c.name),
        textItems: textElements.map((t) => ({
          id: t.id,
          slotId: getSlotIndex(t),
          panelIndex: getSlotIndex(t),
          text: t.text,
          font: t.fontFamily,
          color: t.color,
          size: t.fontSize,
          x: t.x,
          y: t.y
        })),
        unitPrice,
        totalPrice
      }
    });
  };

  // Renders a set of grid panels sharing a common column layout (used for split/collage/wall-art)
  const renderGridPanels = (indices: number[], gridColsClass: string) => (
    <div
      className={`grid ${gridColsClass} gap-2.5 w-full max-w-lg`}
      style={{
        filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.1))'
      }}
    >
      {indices.map((panelIdx) => {
        const panel = panelImages[panelIdx] || createDefaultPanel();
        const panelSpec = panels[panelIdx];
        const slotAspect =
          panelSpec && panelSpec.widthRatio && panelSpec.heightRatio
            ? `${panelSpec.widthRatio} / ${panelSpec.heightRatio}`
            : '1 / 1';
        return (
          <div
            key={panelIdx}
            {...panelHandlers(panelIdx)}
            style={{ aspectRatio: slotAspect }}
            className={`relative w-full bg-white rounded-xl overflow-hidden transition-all cursor-pointer group ${
              activePanelIndex === panelIdx
                ? 'ring-2 ring-inset ring-[#0E4A93] z-20'
                : 'border border-stone-300/80 hover:border-stone-400'
            }`}
          >
            {dragOverPanel === panelIdx && (
              <div className="absolute inset-0 z-30 bg-blue-500/20 border-4 border-dashed border-[#0E4A93] pointer-events-none" />
            )}
            {panel.imageUrl ? (
              <img
                src={panel.imageUrl}
                alt={`Slot ${panelIdx + 1}`}
                style={{
                  transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                  filter: getFilterCss(panel.filter),
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50/80 hover:bg-stone-100/90 transition-colors p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:border-[#0E4A93]/40 group-hover:scale-110 transition-all mb-1">
                  <Upload className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-bold text-stone-500 group-hover:text-[#0E4A93]">
                  Slot {panelIdx + 1}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Split Product: Single continuous physical canvas surface sliced internally across panels
  const renderContinuousSplitCanvas = () => {
    const layout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
    const splitPanels = layout.panels;
    const N = splitPanels.length;
    const rawPanel0 = panelImages[0]?.imageUrl;
    const validPanelImg = (!isWordArtProduct && isWordArtArtwork(rawPanel0)) ? null : rawPanel0;
    const validTrayImg = uploadedPhotos.find((p) => !isWordArtArtwork(p)) || null;
    const masterImage = validPanelImg || validTrayImg || null;
    const master = panelImages[0] || createDefaultPanel();

    const displayWidthInches = layout.overallWidthInches || 36;
    const displayHeightInches = layout.overallHeightInches || 24;

    const imgMeta = master?.uploadedImage;
    const natWidth = imgMeta?.width || 1200;
    const natHeight = imgMeta?.height || 800;
    const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
    const layoutAspect = layout.aspectRatio || (displayWidthInches / Math.max(1, displayHeightInches));
    const isWiderThanLayout = imgAspect >= layoutAspect;

    return (
      <div className="relative flex flex-col items-center select-none w-full my-auto">
        {/* Ruler Top */}
        <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[28rem] relative">
          <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
          <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
            {displayWidthInches} inch ({layout.name})
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full">
          {/* Ruler Left */}
          <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
            <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
            <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
              {displayHeightInches} inch
            </div>
          </div>

          {/* CONTINUOUS SPLIT PHYSICAL CANVAS SURFACE */}
          {renderFloatingFrameContainer(
            <div
              {...panelHandlers(0)}
              ref={(node) => {
                registerWheelRef(0)(node);
                (workspaceCanvasBoxRef as any).current = node;
              }}
              onClick={() => {
                if (!masterImage) fileInputRef.current?.click();
              }}
              className={`relative select-none ${
                masterImage ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
              }`}
              style={{
                aspectRatio: String(layout.aspectRatio),
                width: isMobile
                  ? `min(calc(100vw - 4rem), calc(28vh * ${layout.aspectRatio}))`
                  : `min(34rem, calc(54vh * ${layout.aspectRatio}))`,
                maxHeight: isMobile ? '30vh' : undefined,
                maxWidth: '100%'
              }}
            >
              {splitPanels.map((p, idx) => {
                const isSelectedSlot = activePanelIndex === idx;
                const isHovered = hoveredPanelIndex === idx;
                const showPanelEdges = isHovered && activeMaterial === 'canvas' && selectedFrameId === 'no-frame';
                const panelDepthPx =
                  selectedThicknessId === 'canvas-lite'
                    ? 10
                    : selectedThicknessId === 'thick-gallery'
                    ? 28
                    : selectedThicknessId === 'custom-thickness'
                    ? Math.max(8, Math.min(36, Math.round(customThicknessInches * 18)))
                    : 18;

                const isImageWrapped = (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (master.fitMode !== 'contain');
                const effectiveEdgeColor = selectedWrapId === 'black-border' ? '#0F172A' : '#FFFFFF';

                const totalW = workspaceBoxSize.width || 420;
                const totalH = workspaceBoxSize.height || 320;
                const panelW = p.w * totalW;
                const panelH = p.h * totalH;

                const splitPanelShadow = activeMaterial === 'acrylic'
                  ? (effectiveAcrylicThicknessMm >= 8
                      ? '0 18px 32px -4px rgba(15, 23, 42, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                      : effectiveAcrylicThicknessMm >= 5
                      ? '0 12px 24px -4px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
                      : '0 6px 14px -2px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.35) inset')
                  : (selectedThicknessId === 'thick-gallery'
                      ? '0 20px 36px -6px rgba(15, 23, 42, 0.38), 0 0 0 1px rgba(0,0,0,0.14)'
                      : selectedThicknessId === 'thin-gallery'
                      ? '0 12px 24px -4px rgba(15, 23, 42, 0.26), 0 0 0 1px rgba(0,0,0,0.1)'
                      : '0 6px 14px -2px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0,0,0,0.08)');

                return (
                <div
                  key={p.id || idx}
                  onPointerEnter={() => setHoveredPanelIndex(idx)}
                  onPointerLeave={() => setHoveredPanelIndex((prev) => (prev === idx ? null : prev))}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePanelIndex(idx);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${p.x * 100}%`,
                    top: `${p.y * 100}%`,
                    width: `${p.w * 100}%`,
                    height: `${p.h * 100}%`,
                    boxShadow: isHovered
                      ? (activeMaterial === 'acrylic'
                          ? '0 20px 32px -4px rgba(15, 23, 42, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.6) inset'
                          : '0 20px 32px -4px rgba(15, 23, 42, 0.32), 0 8px 16px -4px rgba(15, 23, 42, 0.2)')
                      : splitPanelShadow,
                    zIndex: isHovered ? 35 : isSelectedSlot ? 20 : 10,
                    transform: isHovered ? 'scale(1.018)' : 'none',
                    transformOrigin: 'center center',
                    transition: 'transform 0.18s ease-out, box-shadow 0.18s ease-out'
                  }}
                  className="ci-slot-container relative rounded-[2px] overflow-visible select-none group cursor-pointer"
                >
                  {/* Hover-based physical canvas edges (Canvas only) */}
                  {showPanelEdges && (
                    <>
                      {/* Top Physical Edge */}
                      <div
                        className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          bottom: '100%',
                          height: `${panelDepthPx}px`,
                          borderBottom: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {masterImage && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              top: '100%',
                              left: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'top center',
                              transform: 'scaleY(-1)'
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                width: `${(1 / p.w) * 100}%`,
                                height: `${(1 / p.h) * 100}%`,
                                left: `${-(p.x / p.w) * 100}%`,
                                top: `${-(p.y / p.h) * 100}%`
                              }}
                              className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                            >
                              <img
                                src={masterImage}
                                alt=""
                                style={{
                                  width: isWiderThanLayout ? 'auto' : '100%',
                                  height: isWiderThanLayout ? '100%' : 'auto',
                                  minWidth: '100%',
                                  minHeight: '100%',
                                  maxWidth: 'none',
                                  maxHeight: 'none',
                                  flexShrink: 0,
                                  aspectRatio: `${natWidth} / ${natHeight}`,
                                  objectFit: 'cover',
                                  objectPosition: 'center center',
                                  transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  transformOrigin: 'center center',
                                  filter: `${getFilterCss(master.filter)} brightness(0.96)`,
                                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                }}
                                className="pointer-events-none select-none max-w-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Left Physical Edge */}
                      <div
                        className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          right: '100%',
                          width: `${panelDepthPx}px`,
                          borderRight: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {masterImage && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              left: '100%',
                              top: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'left center',
                              transform: 'scaleX(-1)'
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                width: `${(1 / p.w) * 100}%`,
                                height: `${(1 / p.h) * 100}%`,
                                left: `${-(p.x / p.w) * 100}%`,
                                top: `${-(p.y / p.h) * 100}%`
                              }}
                              className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                            >
                              <img
                                src={masterImage}
                                alt=""
                                style={{
                                  width: isWiderThanLayout ? 'auto' : '100%',
                                  height: isWiderThanLayout ? '100%' : 'auto',
                                  minWidth: '100%',
                                  minHeight: '100%',
                                  maxWidth: 'none',
                                  maxHeight: 'none',
                                  flexShrink: 0,
                                  aspectRatio: `${natWidth} / ${natHeight}`,
                                  objectFit: 'cover',
                                  objectPosition: 'center center',
                                  transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  transformOrigin: 'center center',
                                  filter: `${getFilterCss(master.filter)} brightness(0.92)`,
                                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                }}
                                className="pointer-events-none select-none max-w-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Physical Edge */}
                      <div
                        className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          top: '100%',
                          height: `${panelDepthPx}px`,
                          borderTop: 'none',
                          backgroundColor: effectiveEdgeColor,
                          boxShadow: '0 10px 18px -4px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        {masterImage && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              bottom: '100%',
                              left: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'bottom center',
                              transform: 'scaleY(-1)'
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                width: `${(1 / p.w) * 100}%`,
                                height: `${(1 / p.h) * 100}%`,
                                left: `${-(p.x / p.w) * 100}%`,
                                top: `${-(p.y / p.h) * 100}%`
                              }}
                              className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                            >
                              <img
                                src={masterImage}
                                alt=""
                                style={{
                                  width: isWiderThanLayout ? 'auto' : '100%',
                                  height: isWiderThanLayout ? '100%' : 'auto',
                                  minWidth: '100%',
                                  minHeight: '100%',
                                  maxWidth: 'none',
                                  maxHeight: 'none',
                                  flexShrink: 0,
                                  aspectRatio: `${natWidth} / ${natHeight}`,
                                  objectFit: 'cover',
                                  objectPosition: 'center center',
                                  transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  transformOrigin: 'center center',
                                  filter: `${getFilterCss(master.filter)} brightness(0.84)`,
                                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                }}
                                className="pointer-events-none select-none max-w-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Physical Edge */}
                      <div
                        className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          left: '100%',
                          width: `${panelDepthPx}px`,
                          borderLeft: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {masterImage && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              right: '100%',
                              top: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'right center',
                              transform: 'scaleX(-1)'
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                width: `${(1 / p.w) * 100}%`,
                                height: `${(1 / p.h) * 100}%`,
                                left: `${-(p.x / p.w) * 100}%`,
                                top: `${-(p.y / p.h) * 100}%`
                              }}
                              className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                            >
                              <img
                                src={masterImage}
                                alt=""
                                style={{
                                  width: isWiderThanLayout ? 'auto' : '100%',
                                  height: isWiderThanLayout ? '100%' : 'auto',
                                  minWidth: '100%',
                                  minHeight: '100%',
                                  maxWidth: 'none',
                                  maxHeight: 'none',
                                  flexShrink: 0,
                                  aspectRatio: `${natWidth} / ${natHeight}`,
                                  objectFit: 'cover',
                                  objectPosition: 'center center',
                                  transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  transformOrigin: 'center center',
                                  filter: `${getFilterCss(master.filter)} brightness(0.88)`,
                                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                }}
                                className="pointer-events-none select-none max-w-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Front Face Panel Surface */}
                  <div
                    className={`w-full h-full relative rounded-[2px] overflow-hidden bg-white transition-all ${
                      isSelectedSlot
                        ? 'ring-2 ring-[#0E4A93] shadow-lg'
                        : activeMaterial === 'acrylic' ? 'border border-slate-200' : 'border border-stone-300/80'
                    }`}
                  >
                    {/* 3D Canvas Edge highlight / Acrylic Polished Edge */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        boxShadow: activeMaterial === 'acrylic'
                          ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                          : 'inset 0 0 0 1px rgba(255, 255, 255, 0.7), inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    />

                    {/* Crisp Front Print Line when physical edges are visible on hover */}
                    {showPanelEdges && (
                      <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{
                          boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(0, 0, 0, 0.35)'
                        }}
                      />
                    )}

                    {/* Border overlay for split panel */}
                    {selectedBorderWidthId !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-25 rounded-[2px]"
                        style={{
                          border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : 12}px solid ${selectedBorderColor}`
                        }}
                      />
                    )}

                    {masterImage ? (
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                        <div
                          style={{
                            position: 'absolute',
                            width: `${(1 / p.w) * 100}%`,
                            height: `${(1 / p.h) * 100}%`,
                            left: `${-(p.x / p.w) * 100}%`,
                            top: `${-(p.y / p.h) * 100}%`
                          }}
                          className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                        >
                          <img
                            src={masterImage}
                            alt={`Split Panel ${idx + 1}`}
                            draggable={false}
                            onLoad={(e) => {
                              const imgEl = e.currentTarget;
                              if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                                setPanelImages((prev) => {
                                  const cur = prev[0];
                                  if (!cur) return prev;
                                  return {
                                    ...prev,
                                    [0]: {
                                      ...cur,
                                      uploadedImage: {
                                        originalSrc: cur.imageUrl || '',
                                        width: imgEl.naturalWidth,
                                        height: imgEl.naturalHeight,
                                        aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                      }
                                    }
                                  };
                                });
                              }
                            }}
                            style={{
                              width: isWiderThanLayout ? 'auto' : '100%',
                              height: isWiderThanLayout ? '100%' : 'auto',
                              minWidth: '100%',
                              minHeight: '100%',
                              maxWidth: 'none',
                              maxHeight: 'none',
                              flexShrink: 0,
                              aspectRatio: `${natWidth} / ${natHeight}`,
                              objectFit: 'cover',
                              objectPosition: 'center center',
                              transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                              transformOrigin: 'center center',
                              filter: getFilterCss(master.filter),
                              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                            }}
                            className="pointer-events-none select-none max-w-none"
                          />
                          {/* Subtle canvas weave micro-texture for canvas only */}
                          {activeMaterial === 'canvas' && (
                            <div
                              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                              }}
                            />
                          )}
                          {/* Optical crystal depth reflection for acrylic */}
                          {activeMaterial === 'acrylic' && (
                            <div
                              className="absolute inset-0 pointer-events-none opacity-25"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Empty state panel */
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#dcdfe4] text-center p-2 relative">
                        <span className="text-[10px] font-bold text-stone-600">{p.label || `Panel ${idx + 1}`}</span>
                      </div>
                    )}
                    {renderPanelTextItems(idx)}
                  </div>
                </div>
              );
            })}

              {/* If empty, central single upload action overlay */}
              {!masterImage && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 hover:text-[#0E4A93] font-bold text-xs sm:text-sm rounded-xl shadow-md border border-stone-200 flex items-center gap-2 pointer-events-auto cursor-pointer transition-all hover:scale-105"
                  >
                    <Upload className="w-4 h-4 stroke-[2.4] text-[#0E4A93]" />
                    <span>Upload Image</span>
                  </button>
                </div>
              )}
            </div>,
            {
              frameId: selectedFrameId,
              displayWidthInches,
              displayHeightInches,
              aspectRatio: layout.aspectRatio,
              isMultiPanel: true
            }
          )}
        </div>
      </div>
    );
  };

  // Dedicated Lyric Canvas Typography Overlay (for canvas-lyric)
  const renderQuotesCreateOwnOverlay = (scaleFactor: number = 1) => {
    if (!isQuotesProduct || quotesPreference !== 'create-own') return null;
    const fontFamilies: Record<string, string> = {
      'Playfair Display': '"Playfair Display", Georgia, serif',
      'Cormorant Garamond': '"Cormorant Garamond", Garamond, serif',
      'Dancing Script': '"Dancing Script", cursive',
      'Montserrat': '"Montserrat", sans-serif',
      'Cinzel': '"Cinzel", serif',
      'Oswald': '"Oswald", sans-serif'
    };
    const font = fontFamilies[quoteFontFamily] || '"Playfair Display", serif';
    const hasPhoto = Boolean(quoteBgImage || panelImages[0]?.imageUrl);
    const textLen = (quoteCustomText || '').length;
    const lengthFactor = textLen > 160 ? 0.65 : textLen > 110 ? 0.75 : textLen > 60 ? 0.85 : 1;
    const effectiveQuoteFs = Math.max(7, Math.round(quoteFontSize * scaleFactor * lengthFactor));
    const effectiveAuthorFs = Math.max(6, Math.round(quoteFontSize * 0.5 * scaleFactor * lengthFactor));
    const scaledPad = Math.max(6, Math.round(20 * scaleFactor));

    return (
      <div
        className="absolute inset-0 z-25 flex flex-col pointer-events-none select-none overflow-hidden max-h-full"
        style={{
          fontFamily: font,
          color: quoteTextColor,
          textAlign: quoteAlignment,
          padding: `${scaledPad}px`,
          justifyContent: 'center',
          alignItems: quoteAlignment === 'left' ? 'flex-start' : quoteAlignment === 'right' ? 'flex-end' : 'center',
          textShadow: hasQuoteContrast || hasPhoto ? '0 1px 4px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.6)' : undefined
        }}
      >
        {hasQuoteContrast && hasPhoto && (
          <div className="absolute inset-0 bg-black/20 pointer-events-none -z-10" />
        )}
        {quoteCustomText && (
          <div
            className="leading-relaxed whitespace-pre-line font-bold max-w-[94%] overflow-hidden"
            style={{ fontSize: `${effectiveQuoteFs}px` }}
          >
            &ldquo;{quoteCustomText}&rdquo;
          </div>
        )}
        {quoteAuthor && (
          <div
            className="mt-2 opacity-90 italic tracking-wider font-medium overflow-hidden truncate max-w-[94%]"
            style={{ fontSize: `${effectiveAuthorFs}px` }}
          >
            {quoteAuthor}
          </div>
        )}
      </div>
    );
  };

  const renderLyricOverlay = (scaleFactor: number = 1) => {
    const fontFamilies: Record<string, string> = {
      'Playfair Display': '"Playfair Display", Georgia, "Times New Roman", serif',
      'Cormorant Garamond': '"Cormorant Garamond", Garamond, "Times New Roman", serif',
      'Dancing Script': '"Dancing Script", "Caveat", "Brush Script MT", cursive',
      'Montserrat': '"Montserrat", system-ui, -apple-system, sans-serif',
      'Cinzel': '"Cinzel", Georgia, serif'
    };
    const font = fontFamilies[lyricConfig.fontFamily] || fontFamilies['Playfair Display'];
    const s = (px: number) => Math.max(1, Math.round(px * scaleFactor));
    const fs = (px: number, min = 7) => `${Math.max(min, Math.round(px * scaleFactor))}px`;
    const scrimAlpha = Math.min(0.9, Math.max(0, (lyricConfig.overlayDarkness ?? 35) / 100));
    const hasPhoto = Boolean(panelImages[0]?.imageUrl && !isWordArtArtwork(panelImages[0]?.imageUrl));
    const isLightColor = (hex: string) => {
      const h = (hex || '').toLowerCase().trim();
      return h === '#ffffff' || h === '#fef08a' || h === '#fffbeb' || h === '#f4f4f5' || h === '#fde047' || h === '#f5ebe0';
    };
    const effectiveTextColor = hasPhoto
      ? (lyricConfig.textColor || selectedLyricTemplate.defaultTypography.textColor || '#FFFFFF')
      : (isLightColor(lyricConfig.textColor)
          ? (selectedLyricTemplate.defaultTypography.textColor && !isLightColor(selectedLyricTemplate.defaultTypography.textColor)
              ? selectedLyricTemplate.defaultTypography.textColor
              : '#1E293B')
          : (lyricConfig.textColor || selectedLyricTemplate.defaultTypography.textColor || '#1E293B'));
    const textAlign = lyricConfig.alignment || lyricConfig.textAlign || 'center';
    const layout = lyricConfig.layout || selectedLyricTemplate.defaultLayout || 'photo-lyrics-overlay';
    const title = lyricConfig.title !== undefined ? lyricConfig.title : (lyricConfig.songTitle ?? selectedLyricTemplate.name);
    const artist = lyricConfig.artistOrSubtitle !== undefined ? lyricConfig.artistOrSubtitle : (lyricConfig.artistOrNames ?? '');
    const date = lyricConfig.dateOrNames !== undefined ? lyricConfig.dateOrNames : (lyricConfig.dateOrInscription ?? '');
    const text = lyricConfig.lyrics !== undefined ? lyricConfig.lyrics : (lyricConfig.lyricsText ?? '');
    const textShadow = hasPhoto
      ? (scrimAlpha > 0.05
          ? '0 1px 3px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.6)'
          : '0 1px 3px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.7)')
      : undefined;

    // 1. First Dance Card (frosted glass badge in center/lower-center)
    if (layout === 'first-dance-card') {
      return (
        <div
          className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{
            padding: `${s(16)}px`,
            background: hasPhoto ? `rgba(0,0,0,${scrimAlpha * 0.45})` : undefined,
            color: hasPhoto ? (lyricConfig.textColor || '#FFFFFF') : effectiveTextColor,
            fontFamily: font
          }}
        >
          <div
            className={`w-full max-w-[88%] rounded-sm flex flex-col items-center text-center ${hasPhoto ? 'backdrop-blur-sm' : ''}`}
            style={{
              background: hasPhoto
                ? `rgba(15, 23, 42, ${Math.max(0.45, scrimAlpha * 0.9)})`
                : 'rgba(255, 255, 255, 0.94)',
              border: hasPhoto
                ? '1px solid rgba(255, 255, 255, 0.28)'
                : '1px solid rgba(15, 23, 42, 0.12)',
              boxShadow: hasPhoto
                ? '0 4px 14px rgba(0, 0, 0, 0.3)'
                : '0 1px 3px rgba(15, 23, 42, 0.08)',
              padding: `${s(14)}px ${s(16)}px`,
              gap: `${s(6)}px`,
              color: hasPhoto ? (lyricConfig.textColor || '#FFFFFF') : effectiveTextColor
            }}
          >
            {Boolean(title && title.trim().length > 0) && (
              <div className="flex items-center gap-1.5 opacity-90">
                <span style={{ fontSize: fs(14) }}>♪</span>
                <span className="font-extrabold uppercase tracking-widest" style={{ fontSize: fs(13) }}>
                  {title}
                </span>
                <span style={{ fontSize: fs(14) }}>♪</span>
              </div>
            )}
            {Boolean(artist && artist.trim().length > 0) && (
              <div className="italic opacity-85" style={{ fontSize: fs(10.5) }}>
                {artist}
              </div>
            )}
            {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && Boolean(text && text.trim().length > 0) && (
              <div className="w-16 h-px bg-current opacity-40 my-0.5" />
            )}
            {Boolean(text && text.trim().length > 0) && (
              <div
                className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden"
                style={{
                  fontSize: fs(10),
                  maxHeight: `${s(120)}px`,
                  textAlign
                }}
              >
                {text}
              </div>
            )}
            {Boolean(date && date.trim().length > 0) && (
              <div className="font-mono tracking-wider opacity-75 mt-1" style={{ fontSize: fs(9) }}>
                {date}
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. Wedding Vows Photo (framed vows with decorative flourish)
    if (layout === 'wedding-vows-photo') {
      return (
        <div
          className="absolute inset-0 z-25 flex flex-col justify-between pointer-events-none select-none"
          style={{
            padding: `${s(18)}px ${s(20)}px`,
            background: hasPhoto
              ? `linear-gradient(to bottom, rgba(0,0,0,${scrimAlpha * 0.85}) 0%, rgba(0,0,0,${scrimAlpha * 0.4}) 35%, rgba(0,0,0,${scrimAlpha * 0.4}) 65%, rgba(0,0,0,${scrimAlpha * 0.9}) 100%)`
              : undefined,
            color: effectiveTextColor,
            fontFamily: font,
            textShadow
          }}
        >
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && (
            <div className="text-center space-y-0.5">
              {Boolean(title && title.trim().length > 0) && (
                <div className="font-serif tracking-widest uppercase font-bold" style={{ fontSize: fs(15) }}>
                  {title}
                </div>
              )}
              {Boolean(artist && artist.trim().length > 0) && (
                <div className="italic opacity-90" style={{ fontSize: fs(11) }}>
                  {artist}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 opacity-50 my-1">
                <div className="w-10 h-px bg-current" />
                <span style={{ fontSize: fs(9) }}>✦ • ✦</span>
                <div className="w-10 h-px bg-current" />
              </div>
            </div>
          )}

          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden my-auto"
              style={{
                fontSize: fs(10.5),
                textAlign,
                maxHeight: `${s(150)}px`
              }}
            >
              {text}
            </div>
          )}

          {Boolean(date && date.trim().length > 0) && (
            <div className="text-center pt-1 border-t border-current/25">
              <span className="tracking-widest uppercase font-semibold" style={{ fontSize: fs(9.5) }}>
                {date}
              </span>
            </div>
          )}
        </div>
      );
    }

    // 3. Split Side-by-Side (right side backdrop with text)
    if (layout === 'split-side-by-side') {
      return (
        <div
          className="absolute inset-y-0 right-0 w-1/2 z-25 flex flex-col justify-center pointer-events-none select-none"
          style={{
            padding: `${s(14)}px`,
            background: hasPhoto
              ? `rgba(15, 23, 42, ${Math.max(0.6, scrimAlpha * 0.95)})`
              : 'rgba(248, 250, 252, 0.95)',
            backdropFilter: 'blur(4px)',
            color: hasPhoto ? (lyricConfig.textColor || '#FFFFFF') : effectiveTextColor,
            fontFamily: font,
            borderLeft: hasPhoto ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(15, 23, 42, 0.1)'
          }}
        >
          {Boolean(title && title.trim().length > 0) && (
            <div className="font-black uppercase tracking-wider mb-0.5" style={{ fontSize: fs(13) }}>
              {title}
            </div>
          )}
          {Boolean(artist && artist.trim().length > 0) && (
            <div className="italic opacity-85 mb-1.5" style={{ fontSize: fs(10) }}>
              {artist}
            </div>
          )}
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && Boolean(text && text.trim().length > 0) && (
            <div className="w-8 h-px bg-current opacity-50 mb-2" />
          )}
          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden"
              style={{
                fontSize: fs(9.5),
                textAlign,
                maxHeight: `${s(150)}px`
              }}
            >
              {text}
            </div>
          )}
          {Boolean(date && date.trim().length > 0) && (
            <div className="mt-2 pt-1 border-t border-current/20 font-mono tracking-wider opacity-80" style={{ fontSize: fs(8.5) }}>
              {date}
            </div>
          )}
        </div>
      );
    }

    // 4. Bottom Third Lyrics (lower banner with song details and flowing lines)
    if (layout === 'bottom-third-lyrics') {
      return (
        <div
          className="absolute inset-x-0 bottom-0 z-25 flex flex-col justify-end pointer-events-none select-none"
          style={{
            padding: `${s(14)}px ${s(16)}px`,
            background: hasPhoto
              ? `linear-gradient(to top, rgba(0,0,0,${Math.max(0.85, scrimAlpha)}) 0%, rgba(0,0,0,${scrimAlpha * 0.8}) 65%, transparent 100%)`
              : undefined,
            color: effectiveTextColor,
            fontFamily: font,
            textShadow
          }}
        >
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && (
            <div className="flex items-baseline justify-between gap-2 border-b border-current/30 pb-1 mb-1.5">
              {Boolean(title && title.trim().length > 0) && (
                <span className="font-black uppercase tracking-wider truncate" style={{ fontSize: fs(13) }}>
                  {title}
                </span>
              )}
              {Boolean(artist && artist.trim().length > 0) && (
                <span className="italic opacity-85 shrink-0" style={{ fontSize: fs(10) }}>
                  {artist}
                </span>
              )}
            </div>
          )}
          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-90 overflow-hidden"
              style={{
                fontSize: fs(10),
                textAlign,
                maxHeight: `${s(85)}px`
              }}
            >
              {text}
            </div>
          )}
          {Boolean(date && date.trim().length > 0) && (
            <div className="text-right mt-1 opacity-70 font-mono" style={{ fontSize: fs(8.5) }}>
              {date}
            </div>
          )}
        </div>
      );
    }

    // 5. Classic Centered Lyrics (timeless wedding / anniversary centered layout)
    if (layout === 'classic-centered-lyrics') {
      return (
        <div
          className="absolute inset-0 z-25 flex flex-col items-center justify-center text-center pointer-events-none select-none"
          style={{
            padding: `${s(20)}px`,
            background: hasPhoto ? `rgba(0,0,0,${scrimAlpha * 0.7})` : undefined,
            color: effectiveTextColor,
            fontFamily: font,
            textShadow
          }}
        >
          {Boolean(title && title.trim().length > 0) && (
            <div className="font-serif tracking-widest uppercase font-black mb-0.5" style={{ fontSize: fs(16) }}>
              {title}
            </div>
          )}
          {Boolean(artist && artist.trim().length > 0) && (
            <div className="italic opacity-90 tracking-wide mb-1" style={{ fontSize: fs(11) }}>
              {artist}
            </div>
          )}
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && Boolean(text && text.trim().length > 0) && (
            <div className="flex items-center gap-2 opacity-50 my-1.5">
              <div className="w-8 h-px bg-current" />
              <span style={{ fontSize: fs(10) }}>❦</span>
              <div className="w-8 h-px bg-current" />
            </div>
          )}
          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden my-1 max-w-[92%]"
              style={{
                fontSize: fs(10.5),
                textAlign,
                maxHeight: `${s(150)}px`
              }}
            >
              {text}
            </div>
          )}
          {Boolean(date && date.trim().length > 0) && (
            <div className="mt-2 font-mono tracking-widest opacity-80" style={{ fontSize: fs(9) }}>
              {date}
            </div>
          )}
        </div>
      );
    }

    // 6. Sheet Music Background (rendered with stylized musical staff and notes behind lyrics)
    if (layout === 'sheet-music-bg') {
      return (
        <div
          className="absolute inset-0 z-25 flex flex-col justify-between text-center pointer-events-none select-none relative overflow-hidden"
          style={{
            padding: `${s(18)}px`,
            background: hasPhoto ? `rgba(0,0,0,${scrimAlpha * 0.75})` : '#FAFAF9',
            color: effectiveTextColor,
            fontFamily: font,
            textShadow
          }}
        >
          {/* Subtle Musical Staff Lines Background SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="400" y2="40" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="48" x2="400" y2="48" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="56" x2="400" y2="56" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="64" x2="400" y2="64" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="72" x2="400" y2="72" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="220" x2="400" y2="220" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="228" x2="400" y2="228" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="236" x2="400" y2="236" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="244" x2="400" y2="244" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="252" x2="400" y2="252" stroke="currentColor" strokeWidth="1" />
          </svg>

          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && (
            <div className="relative z-10 space-y-0.5">
              {Boolean(title && title.trim().length > 0) && (
                <div className="font-serif tracking-widest uppercase font-bold" style={{ fontSize: fs(16) }}>
                  {title}
                </div>
              )}
              {Boolean(artist && artist.trim().length > 0) && (
                <div className="italic opacity-85" style={{ fontSize: fs(11) }}>
                  {artist}
                </div>
              )}
            </div>
          )}

          {Boolean(text && text.trim().length > 0) && (
            <div
              className="relative z-10 leading-relaxed whitespace-pre-line opacity-95 overflow-hidden my-auto"
              style={{
                fontSize: fs(11),
                textAlign,
                maxHeight: `${s(160)}px`
              }}
            >
              {text}
            </div>
          )}

          {Boolean(date && date.trim().length > 0) && (
            <div className="relative z-10 opacity-75 font-mono tracking-wider" style={{ fontSize: fs(9) }}>
              {date}
            </div>
          )}
        </div>
      );
    }

    // 7. Quote Solid Background (large decorative quotes)
    if (layout === 'quote-solid-bg') {
      return (
        <div
          className="absolute inset-0 z-25 flex flex-col justify-between items-center text-center pointer-events-none select-none relative"
          style={{
            padding: `${s(22)}px`,
            background: hasPhoto ? `rgba(0,0,0,${scrimAlpha * 0.75})` : '#FFFFFF',
            color: effectiveTextColor,
            fontFamily: font,
            textShadow
          }}
        >
          <div className="font-serif opacity-30 select-none" style={{ fontSize: fs(34), lineHeight: 1 }}>
            &ldquo;
          </div>
          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden my-auto max-w-[90%]"
              style={{
                fontSize: fs(11.5),
                textAlign,
                maxHeight: `${s(160)}px`
              }}
            >
              {text}
            </div>
          )}
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0) || Boolean(date && date.trim().length > 0)) && (
            <div className="space-y-0.5 pt-1 border-t border-current/20 w-3/4">
              {Boolean(title && title.trim().length > 0) && (
                <div className="font-bold tracking-widest uppercase" style={{ fontSize: fs(11) }}>
                  {title}
                </div>
              )}
              {Boolean(artist && artist.trim().length > 0) && (
                <div className="italic opacity-80" style={{ fontSize: fs(9.5) }}>
                  {artist}
                </div>
              )}
              {Boolean(date && date.trim().length > 0) && (
                <div className="font-mono opacity-70" style={{ fontSize: fs(8.5) }}>
                  {date}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Default: photo-lyrics-overlay (bottom gradient with elegant typography)
    return (
      <div
        className="absolute inset-0 z-25 flex flex-col justify-end pointer-events-none select-none overflow-hidden"
        style={{
          padding: `${s(16)}px ${s(18)}px`,
          background: hasPhoto
            ? `linear-gradient(to top, rgba(0,0,0,${scrimAlpha}) 0%, rgba(0,0,0,${scrimAlpha * 0.7}) 50%, rgba(0,0,0,${scrimAlpha * 0.15}) 80%, transparent 100%)`
            : undefined,
          color: effectiveTextColor,
          fontFamily: font,
          textShadow
        }}
      >
        {/* flex-col with a maxHeight cap so, on a small Room View box, only
            the lyrics line (flex-grow/shrink) gives up space — the title/
            date/artist/divider above it (all shrink-0) always render in
            full instead of being pushed off the top edge and clipped. */}
        <div className="space-y-1 drop-shadow-md flex flex-col min-h-0" style={{ maxHeight: '100%' }}>
          {(Boolean(title && title.trim().length > 0) || Boolean(date && date.trim().length > 0)) && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 shrink-0">
              {Boolean(title && title.trim().length > 0) && (
                <span className="font-black uppercase tracking-wider" style={{ fontSize: fs(14) }}>
                  {title}
                </span>
              )}
              {Boolean(date && date.trim().length > 0) && (
                <span className="font-mono opacity-75 shrink-0" style={{ fontSize: fs(9) }}>
                  {date}
                </span>
              )}
            </div>
          )}
          {Boolean(artist && artist.trim().length > 0) && (
            <div className="italic opacity-90 shrink-0" style={{ fontSize: fs(11) }}>
              {artist}
            </div>
          )}
          {(Boolean(title && title.trim().length > 0) || Boolean(artist && artist.trim().length > 0)) && Boolean(text && text.trim().length > 0) && (
            <div className="w-12 h-px bg-current opacity-40 my-1 shrink-0" />
          )}
          {Boolean(text && text.trim().length > 0) && (
            <div
              className="leading-relaxed whitespace-pre-line opacity-95 overflow-hidden min-h-0 grow"
              style={{
                fontSize: fs(10.5),
                textAlign
              }}
            >
              {text}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Photo Mosaic (canvas-mosaic): Single continuous physical rectangular product surface with internal mosaic grid divisions
  const renderMosaicCanvas = () => {
    const layout = activeMosaicLayout;
    const count = layout.panelsCount || layout.panels.length;
    const rawPanel0 = panelImages[0]?.imageUrl;
    const validPanelImg = (!isWordArtProduct && isWordArtArtwork(rawPanel0)) ? null : rawPanel0;
    const validTrayImg = uploadedPhotos.find((p) => !isWordArtArtwork(p)) || null;
    const masterImage = validPanelImg || validTrayImg || null;
    const master = panelImages[0] || createDefaultPanel();

    const totalCols = layout.cols || (count === 16 ? 4 : count === 25 ? 5 : count === 36 ? 6 : count === 20 ? 4 : count === 15 ? 3 : count === 12 && layout.aspectRatio > 1 ? 4 : 3);
    const totalRows = layout.rows || Math.ceil(count / totalCols);

    const displayWidthInches = layout.overallWidthInches || currentSizeOption?.widthInches || 16;
    const displayHeightInches = layout.overallHeightInches || currentSizeOption?.heightInches || 16;

    const imgMeta = master?.uploadedImage;

    return (
      <div className="relative flex flex-col items-center select-none w-full my-auto">
        {/* Ruler Top */}
        <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[28rem] relative">
          <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
          <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
            {displayWidthInches} inch ({layout.name})
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full">
          {/* Ruler Left */}
          <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
            <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
            <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
              {displayHeightInches} inch
            </div>
          </div>

          {/* UNIFIED MOSAIC PHYSICAL PRODUCT FRAME (With spaced internal tiles) */}
          <div
            {...panelHandlers(0)}
            ref={(node) => {
              registerWheelRef(0)(node);
              (workspaceCanvasBoxRef as any).current = node;
            }}
            onClick={() => {
              if (!masterImage) {
                uploadTargetRef.current = 0;
                fileInputRef.current?.click();
              }
            }}
            className={`relative bg-white rounded-[2px] overflow-hidden border border-stone-200/90 transition-all select-none ${
              masterImage ? 'shadow-2xl cursor-grab active:cursor-grabbing' : 'cursor-pointer hover:border-[#0E4A93] shadow-xl'
            }`}
            style={{
              aspectRatio: String(layout.aspectRatio),
              width: isMobile
                ? `min(calc(100vw - 4rem), calc(28vh * ${layout.aspectRatio}))`
                : `min(30rem, calc(52vh * ${layout.aspectRatio}))`,
              maxHeight: isMobile ? '30vh' : undefined,
              maxWidth: '100%',
              boxShadow: activeMaterial === 'acrylic'
                ? `0 ${Math.max(6, Math.round(effectiveAcrylicThicknessMm * 2.5))}px ${Math.max(12, Math.round(effectiveAcrylicThicknessMm * 4))}px -4px rgba(15, 23, 42, 0.32)`
                : `0 ${Math.max(8, Math.round(effectiveThicknessInches * 18))}px ${Math.max(16, Math.round(effectiveThicknessInches * 28))}px -6px rgba(15, 23, 42, 0.25)`
            }}
          >
            {masterImage ? (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none select-none">
                {/* Spaced mosaic tiles displaying continuous image */}
                {layout.panels.map((p, idx) => {
                  const natWidth = imgMeta?.width || 1200;
                  const natHeight = imgMeta?.height || 800;
                  const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                  const mosaicAspect = layout.aspectRatio || (displayWidthInches / Math.max(1, displayHeightInches)) || 1;
                  const isWiderThanMosaic = imgAspect >= mosaicAspect;

                  return (
                    <div
                      key={p.id || idx}
                      style={{
                        position: 'absolute',
                        left: `${p.x * 100}%`,
                        top: `${p.y * 100}%`,
                        width: `${p.w * 100}%`,
                        height: `${p.h * 100}%`
                      }}
                      className="relative overflow-hidden rounded-[1px] bg-stone-100 flex items-center justify-center border border-stone-200/50 shadow-2xs"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: `${(1 / p.w) * 100}%`,
                          height: `${(1 / p.h) * 100}%`,
                          left: `${-(p.x / p.w) * 100}%`,
                          top: `${-(p.y / p.h) * 100}%`
                        }}
                        className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                      >
                        <img
                          src={masterImage}
                          alt={`Tile ${idx + 1}`}
                          draggable={false}
                          onLoad={(e) => {
                            if (idx === 0) {
                              const imgEl = e.currentTarget;
                              if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                                setPanelImages((prev) => {
                                  const cur = prev[0];
                                  if (!cur) return prev;
                                  return {
                                    ...prev,
                                    [0]: {
                                      ...cur,
                                      uploadedImage: {
                                        originalSrc: cur.imageUrl || '',
                                        width: imgEl.naturalWidth,
                                        height: imgEl.naturalHeight,
                                        aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                      }
                                    }
                                  };
                                });
                              }
                            }
                          }}
                          style={{
                            width: isWiderThanMosaic ? 'auto' : '100%',
                            height: isWiderThanMosaic ? '100%' : 'auto',
                            minWidth: '100%',
                            minHeight: '100%',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            flexShrink: 0,
                            aspectRatio: `${natWidth} / ${natHeight}`,
                            objectFit: 'cover',
                            objectPosition: 'center center',
                            transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                            transformOrigin: 'center center',
                            filter: getFilterCss(master.filter),
                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                          }}
                          className="pointer-events-none select-none max-w-none"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Subtle physical cotton canvas weave micro-texture for Canvas only */}
                {activeMaterial === 'canvas' && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                    }}
                  />
                )}
                {/* Acrylic optical crystal surface gloss reflection & standoffs */}
                {activeMaterial === 'acrylic' && (
                  <>
                    <div
                      className="absolute inset-0 pointer-events-none z-15"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.18) 100%)'
                      }}
                    />
                    <div className="absolute inset-0 pointer-events-none z-15 rounded-[2px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.25)]" />
                    {(selectedHardwareId === 'standoff-mounts' || selectedHardwareId === 'display-standoff') && (
                      <>
                        <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                        <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                        <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                        <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              /* Empty state: Canvas India single central upload button + spaced internal divisions */
              <div className="w-full h-full relative flex items-center justify-center bg-white">
                {/* Internal tile divisions in unified frame */}
                {layout.panels.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    style={{
                      position: 'absolute',
                      left: `${p.x * 100}%`,
                      top: `${p.y * 100}%`,
                      width: `${p.w * 100}%`,
                      height: `${p.h * 100}%`
                    }}
                    className="rounded-[1px] bg-stone-100 border border-stone-200/60 flex items-center justify-center"
                  >
                    <span className="text-[10px] font-semibold text-stone-400">{idx + 1}</span>
                  </div>
                ))}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-lg mb-2 pointer-events-auto">
                    <Upload className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-bold text-stone-700">Upload Photo for Continuous Mosaic</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Click to choose image</span>
                </div>
              </div>
            )}

            {/* Border overlay for photo mosaic */}
            {selectedBorderWidthId !== 'none' && (
              <div
                className="absolute inset-0 pointer-events-none z-25 rounded-[2px]"
                style={{
                  border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : 12}px solid ${selectedBorderColor}`
                }}
              />
            )}

            {/* Interactive mosaic tile slots for text and slot selection */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {layout.panels.map((p, idx) => {
                const isSelectedSlot = activePanelIndex === idx;
                return (
                  <div
                    key={p.id || idx}
                    onClick={(e) => {
                      if (showTextModal) {
                        e.stopPropagation();
                        setActivePanelIndex(idx);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${p.x * 100}%`,
                      top: `${p.y * 100}%`,
                      width: `${p.w * 100}%`,
                      height: `${p.h * 100}%`
                    }}
                    className={`ci-slot-container overflow-hidden transition-all ${
                      showTextModal
                        ? `pointer-events-auto cursor-pointer ${isSelectedSlot ? 'ring-2 ring-inset ring-[#0E4A93] z-30' : ''}`
                        : 'pointer-events-none'
                    }`}
                  >
                    {renderPanelTextItems(idx)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-stone-500 mt-2.5 text-center">
          Photo Mosaic • {layout.name} ({count} Tiles Grid) • 1 continuous photo spanning seamless mosaic tiles
        </p>
      </div>
    );
  };

  // Hexagon Cluster (canvas-hexagon 1 or multi-piece bundles): N individually
  // uploadable hexagon panels, arranged according to the selected Hexagon layout definition
  const renderHexagonCluster = () => {
    const layout = getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
    const hexPanels = layout.panels;
    const count = hexPanels.length;

    return (
      <div className="relative flex flex-col items-center select-none w-full my-auto p-4">
        {/* Ruler Top */}
        <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[28rem] relative">
          <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
          <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
            {layout.overallWidthInches} inch ({layout.name})
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full">
          {/* Ruler Left */}
          <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
            <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
            <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
              {layout.overallHeightInches} inch
            </div>
          </div>

          <div
            ref={(node) => {
              (workspaceCanvasBoxRef as any).current = node;
            }}
            className="relative w-full max-w-2xl"
            style={{
              aspectRatio: String(layout.aspectRatio),
              width: isMobile
                ? `min(calc(100vw - 4rem), calc(28vh * ${layout.aspectRatio}))`
                : `min(34rem, calc(54vh * ${layout.aspectRatio}))`,
              maxHeight: isMobile ? '30vh' : '56vh'
            }}
          >
            {hexPanels.map((pSpec, idx) => {
              const panel = panelImages[idx] || createDefaultPanel();
              const isTarget = activePanelIndex === idx;
              const isVertical = pSpec.orientation === 'vertical' || layout.orientation === 'vertical';
              const hexClip = isVertical ? HEXAGON_VERTICAL_CLIP_PATH : HEXAGON_HORIZONTAL_CLIP_PATH;

              return (
                <div
                  key={pSpec.id || idx}
                  style={{
                    position: 'absolute',
                    left: `${pSpec.x * 100}%`,
                    top: `${pSpec.y * 100}%`,
                    width: `${pSpec.w * 100}%`,
                    height: `${pSpec.h * 100}%`,
                    clipPath: hexClip,
                    WebkitClipPath: hexClip,
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                  className={`ci-slot-container relative bg-white cursor-pointer group transition-all ${
                    isTarget ? 'z-20' : 'hover:brightness-95'
                  }`}
                  {...panelHandlers(idx)}
                  ref={registerWheelRef(idx)}
                >
                  {/* 3D Bevel inner edge */}
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      clipPath: hexClip,
                      WebkitClipPath: hexClip,
                      boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.7), inset 0 2px 6px rgba(0, 0, 0, 0.25)'
                    }}
                  />

                  {/* Border overlay for hexagon panel */}
                  {selectedBorderWidthId !== 'none' && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polygon
                        points={isVertical ? "50,0 100,25 100,75 50,100 0,75 0,25" : "25,0 75,0 100,50 75,100 25,100 0,50"}
                        fill="none"
                        stroke={selectedBorderColor}
                        strokeWidth={selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? "3" : selectedBorderWidthId === 'medium' ? "6" : "9"}
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}

                  {/* Active selection outline - true 6-sided hexagon SVG, never square */}
                  {isTarget && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polygon
                        points={isVertical ? "50,0 100,25 100,75 50,100 0,75 0,25" : "25,0 75,0 100,50 75,100 25,100 0,50"}
                        fill="none"
                        stroke="#0E4A93"
                        strokeWidth="4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}

                  {/* Drag-over indicator - true 6-sided hexagon SVG */}
                  {dragOverPanel === idx && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polygon
                        points={isVertical ? "50,0 100,25 100,75 50,100 0,75 0,25" : "25,0 75,0 100,50 75,100 25,100 0,50"}
                        fill="rgba(232, 117, 42, 0.25)"
                        stroke="#E8752A"
                        strokeWidth="4"
                        strokeDasharray="6 4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}

                  {(() => {
                    const imgMeta = panel.uploadedImage;
                    const natWidth = imgMeta?.width || 1200;
                    const natHeight = imgMeta?.height || 800;
                    const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                    const slotAspect = isVertical ? 8.5 / 10 : 10 / 8.5;
                    const isWiderThanSlot = imgAspect >= slotAspect;

                    return panel.imageUrl ? (
                      <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                        <img
                          src={panel.imageUrl}
                          alt={pSpec.label || `Hexagon ${idx + 1}`}
                          draggable={false}
                          onLoad={(e) => {
                            const imgEl = e.currentTarget;
                            if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                              setPanelImages((prev) => {
                                const cur = prev[idx];
                                if (!cur) return prev;
                                return {
                                  ...prev,
                                  [idx]: {
                                    ...cur,
                                    uploadedImage: {
                                      originalSrc: cur.imageUrl || '',
                                      width: imgEl.naturalWidth,
                                      height: imgEl.naturalHeight,
                                      aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                    }
                                  }
                                };
                              });
                            }
                          }}
                          style={{
                            width: isWiderThanSlot ? 'auto' : '100%',
                            height: isWiderThanSlot ? '100%' : 'auto',
                            minWidth: '100%',
                            minHeight: '100%',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            flexShrink: 0,
                            aspectRatio: `${natWidth} / ${natHeight}`,
                            objectFit: 'cover',
                            objectPosition: 'center center',
                            transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                            transformOrigin: 'center center',
                            filter: getFilterCss(panel.filter),
                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                          }}
                          className="pointer-events-none select-none max-w-none"
                        />
                        {/* Subtle canvas weave micro-texture for canvas only */}
                        {activeMaterial === 'canvas' && (
                          <div
                            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                            }}
                          />
                        )}
                        {/* Optical crystal depth reflection for acrylic */}
                        {activeMaterial === 'acrylic' && (
                          <div
                            className="absolute inset-0 pointer-events-none opacity-25"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)'
                            }}
                          />
                        )}
                      </div>
                    ) : (
                    <div
                      onClick={() => {
                        setActivePanelIndex(idx);
                        fileInputRef.current?.click();
                      }}
                      className="w-full h-full flex flex-col items-center justify-center bg-stone-50/90 hover:bg-stone-100 transition-colors p-2 text-center"
                    >
                      <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-105 transition-all mb-1">
                        <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold text-stone-600">{pSpec.label || `Hexagon ${idx + 1}`}</span>
                    </div>
                  );
                })()}

                  {renderPanelTextItems(idx)}
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] font-semibold text-stone-500 mt-2.5 text-center">
          Hexagon Cluster • {count} {count === 1 ? 'Hexagon' : 'Hexagons'} • Click each hexagon to upload its own photo
        </p>
      </div>
    );
  };

  // Wall Display (canvas-wall-art): Multi-panel gallery collection with physical 3D canvas bevels
  const renderWallDisplayCanvas = () => {
    const layout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
    const wallPanels = layout.panels;

    return (
      <div className="relative flex flex-col items-center select-none w-full my-auto">
        {/* Ruler Top */}
        <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[28rem] relative">
          <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
          <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
            {layout.overallWidthInches} inch ({layout.name})
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full">
          {/* Ruler Left */}
          <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
            <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
            <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
              {layout.overallHeightInches} inch
            </div>
          </div>

          <div
            ref={(node) => {
              (workspaceCanvasBoxRef as any).current = node;
            }}
            className="relative w-full max-w-2xl"
            style={{
              aspectRatio: String(layout.aspectRatio),
              width: isMobile
                ? `min(calc(100vw - 4rem), calc(28vh * ${layout.aspectRatio}))`
                : `min(34rem, calc(54vh * ${layout.aspectRatio}))`,
              maxHeight: isMobile ? '30vh' : '56vh'
            }}
          >
            {wallPanels.map((pSpec, idx) => {
              const panel = panelImages[idx] || createDefaultPanel();
              const isTarget = activePanelIndex === idx;
              const isHovered = hoveredPanelIndex === idx;
              const showPanelEdges = isHovered && activeMaterial === 'canvas' && selectedFrameId === 'no-frame';
              const panelDepthPx =
                selectedThicknessId === 'canvas-lite'
                  ? 10
                  : selectedThicknessId === 'thick-gallery'
                  ? 28
                  : selectedThicknessId === 'custom-thickness'
                  ? Math.max(8, Math.min(36, Math.round(customThicknessInches * 18)))
                  : 18;

              const isImageWrapped = (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (panel.fitMode !== 'contain');
              const effectiveEdgeColor = selectedWrapId === 'black-border' ? '#0F172A' : '#FFFFFF';

              const totalW = workspaceBoxSize.width || 420;
              const totalH = workspaceBoxSize.height || 320;
              const panelW = pSpec.w * totalW;
              const panelH = pSpec.h * totalH;

              const wallShadow = activeMaterial === 'acrylic'
                ? (effectiveAcrylicThicknessMm >= 8
                    ? '0 18px 32px -4px rgba(15, 23, 42, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                    : effectiveAcrylicThicknessMm >= 5
                    ? '0 12px 24px -4px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
                    : '0 6px 14px -2px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.35) inset')
                : (selectedThicknessId === 'thick-gallery'
                    ? '0 20px 36px -6px rgba(15, 23, 42, 0.38), 0 0 0 1px rgba(0,0,0,0.14)'
                    : selectedThicknessId === 'thin-gallery'
                    ? '0 12px 24px -4px rgba(15, 23, 42, 0.26), 0 0 0 1px rgba(0,0,0,0.1)'
                    : '0 6px 14px -2px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0,0,0,0.08)');

              const imgMeta = panel.uploadedImage;
              const natWidth = imgMeta?.width || 1200;
              const natHeight = imgMeta?.height || 800;
              const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
              const slotAspect = (pSpec.w * layout.aspectRatio) / Math.max(0.001, pSpec.h);
              const isWiderThanSlot = imgAspect >= slotAspect;

              return (
                <div
                  key={pSpec.id || idx}
                  onPointerEnter={() => setHoveredPanelIndex(idx)}
                  onPointerLeave={() => setHoveredPanelIndex((prev) => (prev === idx ? null : prev))}
                  style={{
                    position: 'absolute',
                    left: `${pSpec.x * 100}%`,
                    top: `${pSpec.y * 100}%`,
                    width: `${pSpec.w * 100}%`,
                    height: `${pSpec.h * 100}%`,
                    boxShadow: isHovered
                      ? (activeMaterial === 'acrylic'
                          ? '0 20px 32px -4px rgba(15, 23, 42, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.6) inset'
                          : '0 20px 32px -4px rgba(15, 23, 42, 0.32), 0 8px 16px -4px rgba(15, 23, 42, 0.2)')
                      : wallShadow,
                    zIndex: isHovered ? 35 : isTarget ? 20 : 10,
                    transform: isHovered ? 'scale(1.02)' : 'none',
                    transformOrigin: 'center center',
                    transition: 'transform 0.18s ease-out, box-shadow 0.18s ease-out'
                  }}
                  className="ci-slot-container relative rounded-[2px] overflow-visible transition-all cursor-pointer group"
                >
                  {/* Hover-based physical canvas edges (Canvas only) */}
                  {showPanelEdges && (
                    <>
                      {/* Top Physical Edge */}
                      <div
                        className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          bottom: '100%',
                          height: `${panelDepthPx}px`,
                          borderBottom: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {panel.imageUrl && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              top: '100%',
                              left: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'top center',
                              transform: 'scaleY(-1)'
                            }}
                          >
                            <img
                              src={panel.imageUrl}
                              alt=""
                              style={{
                                width: isWiderThanSlot ? 'auto' : '100%',
                                height: isWiderThanSlot ? '100%' : 'auto',
                                minWidth: '100%',
                                minHeight: '100%',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                flexShrink: 0,
                                aspectRatio: `${natWidth} / ${natHeight}`,
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                transformOrigin: 'center center',
                                filter: `${getFilterCss(panel.filter)} brightness(0.96)`,
                                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                              }}
                              className="pointer-events-none select-none max-w-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Left Physical Edge */}
                      <div
                        className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          right: '100%',
                          width: `${panelDepthPx}px`,
                          borderRight: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {panel.imageUrl && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              left: '100%',
                              top: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'left center',
                              transform: 'scaleX(-1)'
                            }}
                          >
                            <img
                              src={panel.imageUrl}
                              alt=""
                              style={{
                                width: isWiderThanSlot ? 'auto' : '100%',
                                height: isWiderThanSlot ? '100%' : 'auto',
                                minWidth: '100%',
                                minHeight: '100%',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                flexShrink: 0,
                                aspectRatio: `${natWidth} / ${natHeight}`,
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                transformOrigin: 'center center',
                                filter: `${getFilterCss(panel.filter)} brightness(0.92)`,
                                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                              }}
                              className="pointer-events-none select-none max-w-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Bottom Physical Edge */}
                      <div
                        className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          top: '100%',
                          height: `${panelDepthPx}px`,
                          borderTop: 'none',
                          backgroundColor: effectiveEdgeColor,
                          boxShadow: '0 10px 18px -4px rgba(15, 23, 42, 0.2)'
                        }}
                      >
                        {panel.imageUrl && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              bottom: '100%',
                              left: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'bottom center',
                              transform: 'scaleY(-1)'
                            }}
                          >
                            <img
                              src={panel.imageUrl}
                              alt=""
                              style={{
                                width: isWiderThanSlot ? 'auto' : '100%',
                                height: isWiderThanSlot ? '100%' : 'auto',
                                minWidth: '100%',
                                minHeight: '100%',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                flexShrink: 0,
                                aspectRatio: `${natWidth} / ${natHeight}`,
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                transformOrigin: 'center center',
                                filter: `${getFilterCss(panel.filter)} brightness(0.84)`,
                                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                              }}
                              className="pointer-events-none select-none max-w-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Physical Edge */}
                      <div
                        className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                        style={{
                          left: '100%',
                          width: `${panelDepthPx}px`,
                          borderLeft: 'none',
                          backgroundColor: effectiveEdgeColor
                        }}
                      >
                        {panel.imageUrl && isImageWrapped && (
                          <div
                            className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                            style={{
                              right: '100%',
                              top: 0,
                              width: `${panelW}px`,
                              height: `${panelH}px`,
                              transformOrigin: 'right center',
                              transform: 'scaleX(-1)'
                            }}
                          >
                            <img
                              src={panel.imageUrl}
                              alt=""
                              style={{
                                width: isWiderThanSlot ? 'auto' : '100%',
                                height: isWiderThanSlot ? '100%' : 'auto',
                                minWidth: '100%',
                                minHeight: '100%',
                                maxWidth: 'none',
                                maxHeight: 'none',
                                flexShrink: 0,
                                aspectRatio: `${natWidth} / ${natHeight}`,
                                objectFit: 'cover',
                                objectPosition: 'center center',
                                transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                transformOrigin: 'center center',
                                filter: `${getFilterCss(panel.filter)} brightness(0.88)`,
                                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                              }}
                              className="pointer-events-none select-none max-w-none"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Front Face Panel Surface */}
                  <div
                    className={`w-full h-full relative rounded-[2px] overflow-hidden bg-white border transition-all ${
                      isTarget
                        ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40 shadow-md'
                        : activeMaterial === 'acrylic' ? 'border-slate-200 shadow-xs' : 'border-stone-300/80 shadow-xs'
                    }`}
                    {...panelHandlers(idx)}
                    ref={registerWheelRef(idx)}
                  >
                    {/* 3D Canvas Chamfer Edge / White Edge */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        boxShadow: activeMaterial === 'acrylic'
                          ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.8)'
                          : 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.8), inset 0 2px 4px rgba(0, 0, 0, 0.12)'
                      }}
                    />

                    {/* Crisp Front Print Line when physical edges are visible on hover */}
                    {showPanelEdges && (
                      <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{
                          boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(0, 0, 0, 0.35)'
                        }}
                      />
                    )}

                    {/* Border overlay for wall panel */}
                    {selectedBorderWidthId !== 'none' && (
                      <div
                        className="absolute inset-0 pointer-events-none z-25 rounded-[2px]"
                        style={{
                          border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : 12}px solid ${selectedBorderColor}`
                        }}
                      />
                    )}

                    {/* 90° Rotate Button Handle for active panel */}
                    {panel.imageUrl && isTarget && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRotate90();
                        }}
                        className="absolute top-2 left-2 z-30 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md hover:scale-110 flex items-center justify-center text-stone-700 transition-transform cursor-pointer"
                        title="Rotate photo 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {dragOverPanel === idx && (
                      <div className="absolute inset-0 z-30 bg-[#E8752A]/25 border-4 border-dashed border-[#E8752A] pointer-events-none" />
                    )}

                    {panel.imageUrl ? (
                      <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                        <img
                          src={panel.imageUrl}
                          alt={pSpec.label || `Panel ${idx + 1}`}
                          draggable={false}
                          onLoad={(e) => {
                            const imgEl = e.currentTarget;
                            if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                              setPanelImages((prev) => {
                                const cur = prev[idx];
                                if (!cur) return prev;
                                return {
                                  ...prev,
                                  [idx]: {
                                    ...cur,
                                    uploadedImage: {
                                      originalSrc: cur.imageUrl || '',
                                      width: imgEl.naturalWidth,
                                      height: imgEl.naturalHeight,
                                      aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                    }
                                  }
                                };
                              });
                            }
                          }}
                          style={{
                            width: isWiderThanSlot ? 'auto' : '100%',
                            height: isWiderThanSlot ? '100%' : 'auto',
                            minWidth: '100%',
                            minHeight: '100%',
                            maxWidth: 'none',
                            maxHeight: 'none',
                            flexShrink: 0,
                            aspectRatio: `${natWidth} / ${natHeight}`,
                            objectFit: 'cover',
                            objectPosition: 'center center',
                            transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                            transformOrigin: 'center center',
                            filter: getFilterCss(panel.filter),
                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                          }}
                          className="pointer-events-none select-none max-w-none"
                        />
                        {/* Subtle canvas weave micro-texture for canvas only */}
                        {activeMaterial === 'canvas' && (
                          <div
                            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                            }}
                          />
                        )}
                        {/* Optical crystal depth reflection for acrylic */}
                        {activeMaterial === 'acrylic' && (
                          <div
                            className="absolute inset-0 pointer-events-none opacity-25"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)'
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setActivePanelIndex(idx);
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-stone-50/90 hover:bg-stone-100 transition-colors p-2 text-center"
                      >
                        <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-105 transition-all mb-1">
                          <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                        <span className="text-[10px] font-bold text-stone-600">{pSpec.label || `Panel ${idx + 1}`}</span>
                      </div>
                    )}

                    {renderPanelTextItems(idx)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Photo Collage (canvas-collage): Single canvas frame containing internal photo slots
  const renderCollageCanvas = () => {
    const layout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
    const collageSlots = layout.panels;

    const renderCollageSlot = (panelIdx: number, pSpec: any) => {
      const panel = panelImages[panelIdx] || createDefaultPanel();
      const isTarget = activePanelIndex === panelIdx;

      return (
        <div
          key={pSpec.id || panelIdx}
          style={{
            position: 'absolute',
            left: `${pSpec.x * 100}%`,
            top: `${pSpec.y * 100}%`,
            width: `${pSpec.w * 100}%`,
            height: `${pSpec.h * 100}%`,
            boxSizing: 'border-box',
            padding: isMobile ? '5px' : '7px'
          }}
        >
          <div
            {...panelHandlers(panelIdx)}
            ref={registerWheelRef(panelIdx)}
            onClick={() => {
              setActivePanelIndex(panelIdx);
              if (!panel.imageUrl) {
                uploadTargetRef.current = panelIdx;
                fileInputRef.current?.click();
              }
            }}
            className={`ci-slot-container relative w-full h-full min-h-[50px] bg-stone-100 rounded-lg overflow-hidden transition-all cursor-pointer group ${
              isTarget
                ? 'ring-2 ring-inset ring-[#0E4A93] z-20 shadow-md'
                : 'border border-stone-200 hover:border-stone-400'
            }`}
          >
            {dragOverPanel === panelIdx && (
              <div className="absolute inset-0 z-30 bg-blue-500/20 border-2 border-dashed border-[#0E4A93] flex items-center justify-center pointer-events-none">
                <span className="bg-[#0E4A93] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Drop Here
                </span>
              </div>
            )}
            {(() => {
              const imgMeta = panel.uploadedImage;
              const natWidth = imgMeta?.width || 1200;
              const natHeight = imgMeta?.height || 800;
              const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
              const slotAspect = (pSpec.w * layout.aspectRatio) / Math.max(0.001, pSpec.h);
              const isWiderThanSlot = imgAspect >= slotAspect;

              return panel.imageUrl ? (
                <>
                  <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                    <img
                      src={panel.imageUrl}
                      alt={`Slot ${panelIdx + 1}`}
                      draggable={false}
                      onLoad={(e) => {
                        const imgEl = e.currentTarget;
                        if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                          setPanelImages((prev) => {
                            const cur = prev[panelIdx];
                            if (!cur) return prev;
                            return {
                              ...prev,
                              [panelIdx]: {
                                ...cur,
                                uploadedImage: {
                                  originalSrc: cur.imageUrl || '',
                                  width: imgEl.naturalWidth,
                                  height: imgEl.naturalHeight,
                                  aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                }
                              }
                            };
                          });
                        }
                      }}
                      style={{
                        width: isWiderThanSlot ? 'auto' : '100%',
                        height: isWiderThanSlot ? '100%' : 'auto',
                        minWidth: '100%',
                        minHeight: '100%',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        flexShrink: 0,
                        aspectRatio: `${natWidth} / ${natHeight}`,
                        objectFit: 'cover',
                        objectPosition: 'center center',
                        transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                        transformOrigin: 'center center',
                        filter: getFilterCss(panel.filter),
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                      }}
                      className="pointer-events-none select-none max-w-none"
                    />
                  </div>
                  {/* Slot quick overlay buttons */}
                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-30">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        uploadTargetRef.current = panelIdx;
                        fileInputRef.current?.click();
                      }}
                      className="p-1 rounded bg-black/70 hover:bg-black text-white text-[9px] font-bold shadow-xs transition-colors"
                      title="Change Photo"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlotPhoto(panelIdx);
                      }}
                      className="p-1 rounded bg-rose-600/90 hover:bg-rose-700 text-white text-[9px] font-bold shadow-xs transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 hover:bg-stone-200/70 transition-colors p-2 text-center select-none">
                  <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-[#0E4A93] group-hover:bg-[#0E4A93] group-hover:text-white group-hover:scale-105 transition-all mb-1">
                    <Upload className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black text-stone-700 group-hover:text-[#0E4A93]">
                    {pSpec.label || `Slot ${panelIdx + 1}`}
                  </span>
                  <span className="text-[9px] text-stone-400 font-semibold">Upload Photo</span>
                </div>
              );
            })()}
            {renderPanelTextItems(panelIdx)}
          </div>
        </div>
      );
    };

    const collageContent = (
      <div
        ref={(node) => {
          (workspaceCanvasBoxRef as any).current = node;
        }}
        className="relative bg-[#d8dce2] rounded-[2px] overflow-hidden border border-stone-300/80 transition-all select-none shadow-xl mx-auto my-auto"
        style={{
          aspectRatio: String(layout.aspectRatio),
          width: isMobile
            ? `min(calc(100vw - 4rem), calc(28vh * ${layout.aspectRatio}))`
            : `min(30rem, calc(52vh * ${layout.aspectRatio}))`,
          maxHeight: isMobile ? '30vh' : undefined,
          maxWidth: '100%',
          boxShadow: selectedThicknessId === 'thick-gallery'
            ? '0 24px 44px -8px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(0,0,0,0.1)'
            : selectedThicknessId === 'thin-gallery'
            ? '0 18px 32px -6px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0,0,0,0.08)'
            : '0 10px 20px -4px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0,0,0,0.06)'
        }}
      >
        <div className="relative w-full h-full">
          {collageSlots.map((slot, idx) => renderCollageSlot(idx, slot))}
        </div>
        {/* Border overlay for collage canvas */}
        {selectedBorderWidthId !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none z-25 rounded-[2px]"
            style={{
              border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : 12}px solid ${selectedBorderColor}`
            }}
          />
        )}
      </div>
    );

    return renderFloatingFrameContainer(collageContent, {
      frameId: selectedFrameId,
      displayWidthInches: layout.overallWidthInches || currentSizeOption?.widthInches || 16,
      displayHeightInches: layout.overallHeightInches || currentSizeOption?.heightInches || 16,
      aspectRatio: layout.aspectRatio,
      isMultiPanel: true
    });
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#F1F5F9] text-stone-900 font-manrope overflow-hidden select-none">
      <CustomizerPreloader active={preloaderActive} />
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
          {/* Admin-uploaded custom shapes: unlike the hand-authored clipPaths
              above, these ids aren't known until the approved-shapes fetch
              resolves, so they're rendered dynamically here. */}
          {customShapes.map((shape) => (
            <clipPath key={shape.id} id={`custom-clip-${shape.id}`} clipPathUnits="objectBoundingBox">
              <path d={shape.svgPathData} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Hidden Global File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/bmp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFilesUpload(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={phoneInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFilesUpload(e.target.files);
          e.target.value = '';
        }}
      />

      {/* ===================================================================== */}
      {/* 1. TOP CANVAS INDIA HEADER (Shared with Acrylic Customizer)           */}
      {/* ===================================================================== */}
      <div className="relative z-30">
        <CustomizerHeader
          backLink={activeMaterial === 'acrylic' ? '/acrylic' : '/canvas'}
          backLabel={activeMaterial === 'acrylic' ? 'Back to Acrylic' : 'Back to Canvas'}
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
          onMenuClick={() => setMenuOpen(!menuOpen)}
          onPriceClick={() => setPricePopoverOpen(!pricePopoverOpen)}
        />

        {pricePopoverOpen && (
          <div className="absolute right-36 top-full mt-2 w-64 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 p-4 text-xs z-50 animate-in fade-in zoom-in-95">
            <div className="font-extrabold pb-2 border-b border-stone-100 flex justify-between text-stone-900">
              <span>Price Breakdown</span>
              <button onClick={() => setPricePopoverOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1.5 py-2.5 text-stone-600">
              <div className="flex justify-between">
                <span>Base ({selectedProductTypeId === 'canvas-banner' ? `${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}` : isCustomSize && canUseCustomSize ? `${customWidth}"×${customHeight}"` : currentSizeOption.dimensionsSummary}):</span>
                <span className="font-bold text-stone-900">₹{(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(sizePrice, quantity) : sizePrice).toFixed(0)}</span>
              </div>
              {selectedWrapId !== 'canvas-lite' && selectedProductTypeId !== 'canvas-banner' && (
                <div className="flex justify-between">
                  <span>Wrap:</span>
                  <span className="font-bold text-stone-900">+₹{(() => { const p = WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.price || 0; return (quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(p, quantity) : p).toFixed(0); })()}</span>
                </div>
              )}
              {selectedHardwareId !== 'no-hooks' && (
                <div className="flex justify-between">
                  <span>Hardware:</span>
                  <span className="font-bold text-stone-900">
                    +₹{(() => {
                      const p = selectedProductTypeId === 'canvas-banner'
                        ? (CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.price || 0)
                        : (HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.price || 0);
                      return (quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(p, quantity) : p).toFixed(0);
                    })()}
                  </span>
                </div>
              )}
              {selectedDisplayOptionId === 'dust-cover' && (
                <div className="flex justify-between">
                  <span>Dust Cover:</span>
                  <span className="font-bold text-stone-900">+₹{(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(49, quantity) : 49).toFixed(0)}</span>
                </div>
              )}
              {selectedLaminationId !== 'none' && (
                <div className="flex justify-between">
                  <span>Lamination ({LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.label}):</span>
                  <span className="font-bold text-stone-900">+₹{(() => { const p = LAMINATION_OPTIONS.find((l) => l.id === selectedLaminationId)?.price || 0; return (quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(p, quantity) : p).toFixed(0); })()}</span>
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

      {/* ===================================================================== */}
      {/* 2. BODY CONTAINER: 3-COLUMN LAYOUT (Shared with Acrylic Customizer)   */}
      {/* ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col md:flex-row overflow-hidden relative">
        {/* COLUMN 1: LEFT VERTICAL SIDEBAR */}
        <CustomizerSidebar
          items={toolbarItems}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* COLUMN 2: CONFIGURATION PANEL */}
        <CustomizerPanel
          title={
            activeTab === 'UPLOAD' && isWordArtProduct
              ? 'WORD ART'
              : activeTab === 'UPLOAD' && isQuotesProduct
              ? undefined
              : activeTab === 'CREATE BUS ROLL'
              ? 'Create Bus Roll'
              : activeTab === 'BACKGROUND'
              ? 'Background'
              : activeTab === 'TEMPLATE'
              ? 'Templates'
              : activeTab === 'HARDWARE & FINISH' && isBusRollProduct
              ? 'Hardware Option & Style'
              : activeTab === 'SELECT SIZE' && selectedProductTypeId === 'canvas-banner'
              ? 'Select Size'
              : activeTab === 'HARDWARE & FINISH' && selectedProductTypeId === 'canvas-banner'
              ? 'Hardware & Finish'
              : activeTab
          }
          metaText={
            activeTab === 'CREATE BUS ROLL'
              ? `${busRollConfig.lines.length} Lines`
              : activeTab === 'BACKGROUND'
              ? `${busRollConfig.backgroundColor}`
              : activeTab === 'TEMPLATE'
              ? 'Choose Preset'
              : isWordArtProduct && activeTab === 'UPLOAD'
              ? `${wordArtSizeOption.label} (${wordArtSizeOption.ratioTab})`
              : activeTab === 'PRODUCTS'
              ? `${activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES.length : CANVAS_PRODUCT_TYPES.length} Styles`
              : activeTab === 'UPLOAD'
              ? `${uploadedPhotos.length} Photos`
              : activeTab === 'SELECT SIZE' && isBannerProduct
              ? `${CANVAS_BANNER_SIZE_OPTIONS.length} Sizes + Custom`
              : activeTab === 'SELECT SIZE'
              ? `${availableSizeOptions.length + (canUseCustomSize ? 1 : 0)} Options`
              : activeTab === 'EFFECTS & OPTIONS'
              ? `${getDigitalPaintingEffect(digitalPaintingConfig.selectedEffectId).name}`
              : activeTab === 'LAYOUTS & DESIGNS'
              ? isLyricProduct
                ? 'Lyrics & Typography'
                : layoutSubTab === 'LAYOUTS'
                ? `${filteredLayoutPresets.length} Layouts`
                : `${DESIGN_TEMPLATE_CATEGORIES.length} Categories`
              : activeTab === 'WRAP & BORDER'
              ? `${WRAP_OPTIONS.length} Options`
              : activeTab === 'HARDWARE & FINISH' && isBannerProduct
              ? `${CANVAS_BANNER_HARDWARE_OPTIONS.length} Options`
              : activeTab === 'HARDWARE & FINISH'
              ? `${(activeMaterial === 'acrylic' ? ACRYLIC_HARDWARE_OPTIONS : HARDWARE_OPTIONS).length} Hardware`
              : 'Specifications'
          }
        >
          {/* ---------------------------- PRODUCTS ---------------------------- */}
          {activeTab === 'PRODUCTS' && (
            <CustomizerProductSelector
              activeMaterial={activeMaterial}
              products={activeMaterial === 'acrylic' ? ACRYLIC_PRODUCT_TYPES : CANVAS_PRODUCT_TYPES}
              selectedProductId={selectedProductTypeId}
              onSelectProduct={selectProduct}
              onSwitchMaterial={handleSwitchMaterial}
              bulkQuantity={quantity}
            />
          )}

          {/* ----------------------------- UPLOAD / WORD ART / QUOTES ------------------------------ */}
          {activeTab === 'UPLOAD' && (
            isWordArtProduct ? (
              <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                    Word Art Personalization
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Personalize your canvas with custom names, words, shapes, and color palettes.
                  </p>
                </div>

                {/* Primary CTA button matching reference screenshot */}
                <button
                  type="button"
                  onClick={() => setIsWordArtPersonalizeModalOpen(true)}
                  className="w-full py-3.5 px-4 bg-[#0E4A93] hover:bg-[#0b3c77] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Type className="w-4 h-4" />
                  <span>{activeWordArtDataUrl ? 'EDIT PERSONALIZED WORD ART' : 'CLICK HERE TO CREATE PERSONALIZED WORDART'}</span>
                </button>

                {/* Size & Ratio Summary Box */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-[11px] font-black uppercase text-stone-500 tracking-wider">{activeMaterial === 'acrylic' ? 'Acrylic Size' : 'Canvas Size'}</span>
                    <button
                      type="button"
                      onClick={() => setIsWordArtSizeModalOpen(true)}
                      className="text-xs font-black text-[#0E4A93] hover:underline cursor-pointer"
                    >
                      Change Size
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>{wordArtSizeOption.label}</span>
                    <span className="text-[#0E4A93] font-black">₹{(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(wordArtSizeOption.price, quantity) : wordArtSizeOption.price).toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    Ratio: <span className="font-bold text-stone-700">{wordArtSizeOption.ratioTab}</span> ({wordArtSizeOption.widthInches}" × {wordArtSizeOption.heightInches}")
                  </div>

                  {activeWordArtDataUrl && (
                    <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Primary Name:</span>
                        <span className="font-bold text-stone-900">{wordArtConfig.primaryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Font:</span>
                        <span className="font-bold text-stone-900">{wordArtConfig.fontFamily}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-medium">Shape:</span>
                        <span className="font-bold capitalize text-stone-900">{wordArtConfig.shape}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : isQuotesProduct ? (
              quotesPreference === 'create-own' ? (
                <QuotesCreateOwnPanel
                  quoteBgColor={quoteBgColor}
                  onChangeQuoteBgColor={handleSelectQuoteBgColor}
                  quoteBgImage={quoteBgImage}
                  onSelectQuoteBgImage={handleSelectQuoteBgImage}
                  onRemoveQuoteBgImage={handleRemoveQuoteBgImage}
                  uploadedPhotos={uploadedPhotos.filter((img) => !QUOTE_TEMPLATES.some((t) => t.image === img))}
                  onTriggerUpload={() => {
                    uploadTargetRef.current = 0;
                    fileInputRef.current?.click();
                  }}
                  quoteText={quoteCustomText}
                  onChangeQuoteText={setQuoteCustomText}
                  quoteAuthor={quoteAuthor}
                  onChangeQuoteAuthor={setQuoteAuthor}
                  fontFamily={quoteFontFamily}
                  onChangeFontFamily={setQuoteFontFamily}
                  textColor={quoteTextColor}
                  onChangeTextColor={setQuoteTextColor}
                  textAlignment={quoteAlignment}
                  onChangeTextAlignment={setQuoteAlignment}
                  fontSize={quoteFontSize}
                  onChangeFontSize={setQuoteFontSize}
                  hasTextContrast={hasQuoteContrast}
                  onToggleTextContrast={() => setHasQuoteContrast(!hasQuoteContrast)}
                  currentSizeLabel={currentSizeOption?.label || '8" × 8"'}
                  currentPrice={totalPrice}
                  onChangeSizeClick={() => setIsSizeShapeModalOpen(true)}
                  onChangePreferenceClick={() => setIsQuotesPreferenceModalOpen(true)}
                />
              ) : (
                <QuotesTemplateSidebarPanel
                  selectedTemplateId={selectedQuoteTemplateId}
                  onSelectTemplate={handleSelectQuoteTemplate}
                  onChangeSizeClick={() => setIsSizeShapeModalOpen(true)}
                  currentSizeLabel={currentSizeOption?.label || '8" × 8"'}
                  currentPrice={totalPrice}
                  onChangePreferenceClick={() => setIsQuotesPreferenceModalOpen(true)}
                  onOpenTextModal={() => {
                    if (textElements.length === 0) {
                      handleAddText();
                    }
                    setShowTextModal(true);
                  }}
                />
              )
            ) : (
            <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                  Upload Photos
                </h3>
                <p className="text-[11px] text-stone-500">
                  Add high-resolution photos from your PC or laptop or scan the QR code to upload directly from your mobile phone.
                </p>
              </div>

              {/* Active Word Art Card for Shape-based Products */}
              {activeWordArtDataUrl && (
                <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#0E4A93]">
                      <Type className="w-4 h-4" />
                      <span>ACTIVE WORD ART</span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                      {selectedProductType.name}
                    </span>
                  </div>
                  <div className="text-xs text-stone-700 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Primary Name:</span>
                      <span className="font-bold text-stone-900">{wordArtConfig.primaryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Design Silhouette:</span>
                      <span className="font-bold capitalize text-stone-900">{wordArtConfig.shape}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsWordArtPersonalizeModalOpen(true)}
                      className="flex-1 py-2 px-3 bg-[#0E4A93] hover:bg-[#0b3c77] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Word Art</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveSlotPhoto(0);
                        setActiveWordArtDataUrl(null);
                      }}
                      className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-stone-200 hover:border-rose-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Remove Word Art"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Pop Art Style Card in Sidebar */}
              {selectedProductTypeId === 'canvas-pop-art' && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0E4A93] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8752A]" />
                      <span>Selected Pop Art Style</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPopArtStyleModalOpen(true)}
                      className="text-[11px] font-extrabold text-[#0E4A93] hover:text-[#0b3c77] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Palette className="w-3 h-3 text-[#E8752A]" />
                      <span>Change Style</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-amber-100 shadow-2xs">
                    <img
                      src={selectedPopStyle.previewImage}
                      alt={selectedPopStyle.name}
                      className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-stone-900 truncate">
                          {selectedPopStyle.name}
                        </span>
                        {selectedPopStyle.priceAdjustment > 0 && (
                          <span className="text-[10px] font-extrabold text-[#E8752A] shrink-0">
                            +₹{selectedPopStyle.priceAdjustment.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 leading-tight mt-0.5">
                        {selectedPopStyle.description}
                      </p>
                    </div>
                  </div>

                  {popArtConfig.selectedStyleId === 'caricatures' && (
                    <div className="text-[10px] font-medium text-stone-600 bg-white/80 p-2 rounded-md border border-amber-100 leading-snug">
                      <strong className="text-stone-800">Artist Preparation Note:</strong> Your uploaded photo will be transformed into high-detail digital caricature artwork by our artists prior to final canvas printing.
                    </div>
                  )}

                  {popArtConfig.isProcessing && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0E4A93]">
                      <div className="w-3 h-3 border-2 border-[#0E4A93] border-t-transparent rounded-full animate-spin" />
                      <span>Applying {selectedPopStyle.name} filter...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Lyric on Canvas & Acrylic Template Card in Sidebar */}
              {isLyricProduct && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0E4A93] flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-[#E8752A]" />
                      <span>Lyric Template</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLyricTemplateModalOpen(true)}
                      className="text-[11px] font-extrabold text-[#0E4A93] hover:text-[#0b3c77] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Layers className="w-3 h-3 text-[#E8752A]" />
                      <span>Change Template</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                    <img
                      src={selectedLyricTemplate.previewImage}
                      alt={selectedLyricTemplate.name}
                      className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-stone-900 truncate">
                          {selectedLyricTemplate.name}
                        </span>
                        {selectedLyricTemplate.priceAdjustment > 0 && (
                          <span className="text-[10px] font-extrabold text-[#E8752A] shrink-0">
                            +₹{selectedLyricTemplate.priceAdjustment.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 line-clamp-1 leading-tight mt-0.5">
                        {lyricConfig.title || lyricConfig.songTitle} • {lyricConfig.artistOrSubtitle || lyricConfig.artistOrNames}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('LAYOUTS & DESIGNS')}
                      className="flex-1 py-1.5 px-3 bg-[#0E4A93] hover:bg-[#0b3c77] text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Customize Lyrics & Typography</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Create Word Art Option for Shape Products */}
              {!activeWordArtDataUrl && isSingleOrShapedCanvas && !isSinglePrintCanvas && !isQuotesProduct && !isDigitalPaintingProduct && !isBusRollProduct && !isBannerProduct && !isPopArtProduct && !isLyricProduct && (
                <button
                  type="button"
                  onClick={() => setIsWordArtPersonalizeModalOpen(true)}
                  className="w-full py-2.5 px-3.5 bg-blue-50 hover:bg-blue-100/80 active:scale-[0.99] text-[#0E4A93] border border-blue-200/80 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Type className="w-4 h-4 text-[#0E4A93]" />
                  <span>Personalize With Word Art</span>
                </button>
              )}

              {/* Segmented Control: Computer/Device vs Mobile QR */}
              <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100">
                <button
                  type="button"
                  onClick={() => setUploadMode('computer')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    uploadMode === 'computer'
                      ? 'bg-white text-[#0E4A93] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>{isMobile ? 'Upload from Device' : 'Upload from PC or Laptop'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('mobile')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    uploadMode === 'mobile'
                      ? 'bg-white text-[#0E4A93] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isMobile ? 'QR Code / Link' : 'Upload from Mobile'}</span>
                </button>
              </div>

              {/* Photo Mosaic single image notification */}
              {isMosaicProduct && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs font-semibold text-[#0E4A93]">
                  Upload 1 photo — it spans seamlessly across the entire mosaic product.
                </div>
              )}

              {uploadMode === 'computer' ? (
                /* COMPUTER / DEVICE UPLOAD ZONE */
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      uploadTargetRef.current = (isSplitProduct || isMosaicProduct) ? 0 : -1;
                      fileInputRef.current?.click();
                    }}
                    className="w-full py-3 px-4 bg-[#0E4A93] hover:bg-[#0B3A75] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    <span>{isMobile ? 'Select Photo from Device' : 'Browse Photos to Upload'}</span>
                  </button>

                  <div
                    onClick={() => {
                      uploadTargetRef.current = (isSplitProduct || isMosaicProduct) ? 0 : -1;
                      fileInputRef.current?.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFilesUpload(e.dataTransfer.files, (isSplitProduct || isMosaicProduct) ? 0 : -1);
                    }}
                    className="border-2 border-dashed border-[#0E4A93]/40 hover:border-[#0E4A93] bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#0E4A93] shadow-sm flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      {isMobile ? 'Or tap here to choose from Gallery / Camera' : 'Click to Browse or Drag Photos'}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">
                      Supports JPG, PNG, WEBP up to 40MB
                    </div>
                  </div>
                </div>
              ) : (
                /* MOBILE QR UPLOAD ZONE */
                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3.5 text-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold text-stone-700">Listening for mobile upload</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#0E4A93] px-2 py-0.5 rounded border border-blue-100">
                      #{uploadSessionId}
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="relative inline-block p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-sm mx-auto">
                    {qrDataUrl ? (
                      <img 
                        src={qrDataUrl} 
                        alt="Scan QR code with mobile phone" 
                        className="w-44 h-44 sm:w-48 sm:h-48 mx-auto block object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">
                        Generating QR Code...
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-stone-900">
                      Scan with your phone camera
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                      Point your smartphone camera at this QR code to upload photos directly from your phone into your Canvas print.
                    </p>
                  </div>

                  {/* Direct Link & Test Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(mobileUploadUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      }}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-[11px] font-bold text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mobileUploadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0E4A93] rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Upload Page</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Uploaded Photos Gallery with Drag-and-Drop, Click-to-Apply & Remove */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">Uploaded Photos ({uploadedPhotos.length}):</span>
                    <button
                      type="button"
                      onClick={handleClearAllUploadedPhotos}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      title="Remove all uploaded photos"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                    {uploadedPhotos.map((photo, pIdx) => {
                      const isDraggingThis = draggingPhotoIndex === pIdx;
                      return (
                        <div
                          key={pIdx}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/x-ci-tray', String(pIdx));
                            e.dataTransfer.setData('text/plain', photo);
                            e.dataTransfer.effectAllowed = 'copy';
                            setDraggingPhotoIndex(pIdx);
                          }}
                          onDragEnd={() => {
                            setDraggingPhotoIndex(null);
                          }}
                          onClick={() => {
                            if (isSplitProduct || isMosaicProduct) {
                              handleAssignPhotoToPanel(photo, 0);
                            } else if (panels.length > 1) {
                              const emptyIdx = panels.map((_, idx) => idx).find((idx) => !panelImages[idx]?.imageUrl);
                              const targetIdx = (!panelImages[activePanelIndex]?.imageUrl || emptyIdx === undefined)
                                ? activePanelIndex
                                : emptyIdx;
                              handleAssignPhotoToPanel(photo, targetIdx);
                            } else {
                              handleAssignPhotoToPanel(photo, 0);
                            }
                          }}
                          className={`aspect-square rounded-lg overflow-hidden border transition-all relative group bg-white shadow-2xs select-none ${
                            isDraggingThis
                              ? 'opacity-40 scale-95 ring-2 ring-[#0E4A93] cursor-grabbing'
                              : 'border-stone-200 hover:border-[#0E4A93] hover:shadow-xs cursor-grab active:cursor-grabbing'
                          }`}
                          title="Click to apply to active slot or drag directly onto any frame"
                        >
                          <img 
                            src={photo} 
                            alt={`Upload ${pIdx}`} 
                            className="w-full h-full object-cover pointer-events-none" 
                          />
                          {/* Move / Drag Indicator Icon */}
                          <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Move className="w-2.5 h-2.5" />
                          </div>
                          {/* Remove Photo Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUploadedPhoto(photo, pIdx);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                            title="Remove photo"
                            aria-label="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Canvas Banner Optional Background Selector (Reference Screenshot 2) */}
              {selectedProductTypeId === 'canvas-banner' && (
                <div className="pt-3 border-t border-stone-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-stone-200" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                      -- OR --
                    </span>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#0E4A93]" />
                        <span>Select Background</span>
                      </label>
                      <span className="text-[11px] font-mono font-bold text-stone-500 uppercase">
                        {bannerConfig.backgroundColor}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mb-2.5">
                      Choose a background color for your banner canvas. Photos will be centered on top.
                    </p>

                    {/* Swatches Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {BANNER_BACKGROUND_PRESETS.map((bg) => {
                        const isSelected = bannerConfig.backgroundColor.toLowerCase() === bg.hex.toLowerCase();
                        return (
                          <button
                            key={bg.hex}
                            type="button"
                            onClick={() => setBannerConfig((prev) => ({ ...prev, backgroundColor: bg.hex }))}
                            className={`p-1.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0E4A93] bg-blue-50/50 shadow-xs ring-1 ring-[#0E4A93]/20'
                                : 'border-stone-200 hover:border-stone-300 bg-white'
                            }`}
                            title={bg.name}
                          >
                            <div
                              className="w-full h-7 rounded-lg border border-stone-200/80 shadow-2xs relative flex items-center justify-center"
                              style={{ backgroundColor: bg.hex }}
                            >
                              {isSelected && (
                                <Check
                                  className={`w-3.5 h-3.5 stroke-[3] ${
                                    ['#ffffff', '#fffdf9', '#f1f5f9', '#faf8f5'].includes(bg.hex.toLowerCase())
                                      ? 'text-[#0E4A93]'
                                      : 'text-white'
                                  }`}
                                />
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-stone-700 truncate w-full text-center">
                              {bg.name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Color Input */}
                    <div className="mt-2.5 flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                      <input
                        type="color"
                        value={bannerConfig.backgroundColor}
                        onChange={(e) => setBannerConfig((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 p-0.5 bg-white"
                        id="custom-banner-bg"
                      />
                      <label htmlFor="custom-banner-bg" className="text-xs font-bold text-stone-700 cursor-pointer flex-1">
                        Custom Hex Color
                      </label>
                      <span className="text-xs font-mono font-bold text-stone-500 bg-white px-2 py-1 rounded border border-stone-200">
                        {bannerConfig.backgroundColor.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}

          {/* --------------------------- SELECT SIZE ---------------------------- */}
          {activeTab === 'SELECT SIZE' && (
            selectedProductTypeId === 'canvas-banner' ? (
              <CanvasBannerSizePanel
                config={bannerConfig}
                onChangeConfig={handleUpdateBannerConfig}
                activeCategory={bannerCategory}
                onChangeCategory={setBannerCategory}
                currentPrice={unitPrice}
              />
            ) : (
            <div className="p-4 space-y-4">
              {isSinglePrintCanvas || isQuotesProduct || isDigitalPaintingProduct || isPopArtProduct || isLyricProduct || isWordArtProduct ? (
                <>
                  {/* Selected Size Summary Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Active Size</span>
                      <div className="text-sm font-black text-stone-900 mt-0.5">
                        {isCustomSize ? `${customWidth}" × ${customHeight}" (Custom)` : currentSizeOption?.label || selectedSizeId}
                      </div>
                      <div className="text-xs font-black text-[#0E4A93]">
                        ₹{sizePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleResetSize}
                        className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-bold rounded-xl border border-stone-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-102"
                        title="Reset to default product size"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                        <span>Reset Size</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isWordArtProduct) {
                            setIsWordArtSizeModalOpen(true);
                          } else {
                            setIsSizeShapeModalOpen(true);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#0E4A93] hover:bg-[#0A366C] text-white text-xs font-bold rounded-xl shadow-xs transition-transform hover:scale-102 cursor-pointer"
                      >
                        Change Size
                      </button>
                    </div>
                  </div>

                  {/* 5 Size Categories matching Canvas India brand */}
                  <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-xl mb-3">
                    {([
                      { id: 'RECOMMENDED' as const, label: 'Recommended' },
                      { id: 'SQUARE' as const, label: 'Square' },
                      { id: 'PANORAMIC' as const, label: 'Panoramic' },
                      { id: 'LARGE' as const, label: 'Large' },
                      { id: 'SMALL' as const, label: 'Small' }
                    ]).map((cat) => {
                      const isActive = sizeCategoryFilter === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSizeCategoryFilter(cat.id);
                            const matchingInCat = availableSizeOptions.filter((opt) => opt.categories.includes(cat.id));
                            if (!matchingInCat.some((opt) => opt.id === selectedSizeId)) {
                              if (matchingInCat.length > 0) {
                                setSelectedSizeId(matchingInCat[0].id);
                                setIsCustomSize(false);
                                if (matchingInCat[0].widthInches && matchingInCat[0].heightInches) {
                                  setSelectedShapeId(
                                    matchingInCat[0].widthInches === matchingInCat[0].heightInches
                                      ? 'shape-square'
                                      : 'shape-rectangle'
                                  );
                                }
                              }
                            }
                          }}
                          className={`flex-1 min-w-[62px] py-1.5 px-1.5 text-center text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#0E4A93] text-white shadow-xs'
                              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* 3 Columns Size Cards Grid matching Canvas India brand */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSizeOptions
                      .filter((opt) => opt.categories.includes(sizeCategoryFilter))
                      .map((opt) => {
                        const isSelected = !isCustomSize && selectedSizeId === opt.id;
                        const width = opt.widthInches || 10;
                        const height = opt.heightInches || 10;
                        const ratio = width / height;

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setIsCustomSize(false);
                              setSelectedSizeId(opt.id);
                              if (isWordArtProduct) {
                                const matchingWordSize = Object.values(WORD_ART_SIZE_CATALOG).flat().find((w) => w.id === opt.id);
                                if (matchingWordSize) {
                                  setWordArtSizeOption(matchingWordSize);
                                  setCustomWidth(matchingWordSize.widthInches);
                                  setCustomHeight(matchingWordSize.heightInches);
                                  if (activeWordArtDataUrl && wordArtConfig) {
                                    const offscreen = document.createElement('canvas');
                                    const exportWidth = 1400;
                                    const exportHeight = Math.round(exportWidth / (matchingWordSize.aspectRatio || 1));
                                    renderWordArtToCanvas(offscreen, wordArtConfig, exportWidth, exportHeight);
                                    const dataUrl = offscreen.toDataURL('image/png', 0.95);
                                    setActiveWordArtDataUrl(dataUrl);
                                    setPanelImages((prev) => ({
                                      ...prev,
                                      0: {
                                        ...prev[0],
                                        imageUrl: dataUrl
                                      }
                                    }));
                                  }
                                }
                              }
                              if (isSinglePrintCanvas) {
                                if (width === height) {
                                  setSelectedShapeId('shape-square');
                                } else if (width > height) {
                                  setSelectedShapeId('shape-landscape');
                                } else {
                                  setSelectedShapeId('shape-portrait');
                                }
                              } else {
                                setSelectedShapeId(width === height ? 'shape-square' : 'shape-rectangle');
                              }
                            }}
                            className={`group relative bg-white p-2.5 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer min-h-[110px] ${
                              isSelected
                                ? 'border-2 border-[#0E4A93] bg-blue-50/20 shadow-xs ring-1 ring-[#0E4A93]/20'
                                : 'border border-stone-200 hover:border-stone-300 shadow-2xs'
                            }`}
                          >
                            {/* Blue checkmark badge */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}

                            {/* Preview shape */}
                            <div className="w-full h-12 flex items-center justify-center">
                              <div
                                className={`rounded-[3px] transition-all border ${
                                  isSelected
                                    ? 'bg-[#0E4A93]/15 border-[#0E4A93]'
                                    : 'bg-stone-100 border-stone-300 group-hover:border-stone-400'
                                }`}
                                style={{
                                  width: `${Math.round(38 * Math.min(1.45, Math.max(0.7, ratio)))}px`,
                                  height: `${Math.round(38 / Math.max(1, ratio > 1.3 ? 1.25 : 1))}px`
                                }}
                              />
                            </div>

                            {/* Dimensions text */}
                            <div className="text-[11px] font-black text-stone-900 text-center mt-1">
                              {opt.label.replace(/^Single:\s*/, '').replace(/^Quotes Canvas:\s*/, '').replace(/^Digital Painting:\s*/, '').replace(/^Pop Art:\s*/, '')}
                            </div>

                            {/* Price text */}
                            <div className="text-[11px] text-[#0E4A93] text-center font-extrabold">
                              ₹{(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(opt.price + popStyleAdjustment, quantity) : opt.price + popStyleAdjustment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Custom Size Box matching Canvas India styling */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-center text-[11px] font-bold text-stone-700 mb-2">
                      Custom Size (Height × Width inches)
                    </div>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <div className="relative">
                        <select
                          value={customHeight}
                          onChange={(e) => {
                            setIsCustomSize(true);
                            const val = Number(e.target.value);
                            setCustomHeight(val);
                            if (isWordArtProduct) {
                              setWordArtSizeOption((prev) => ({
                                ...prev,
                                heightInches: val,
                                label: `${prev.widthInches}" × ${val}"`,
                                aspectRatio: prev.widthInches / val
                              }));
                            }
                          }}
                          className="w-20 px-2 py-1.5 border border-stone-300 bg-white text-xs font-bold text-stone-800 rounded-lg focus:outline-none focus:border-[#0E4A93] appearance-none pr-6 cursor-pointer"
                        >
                          {/* Current value merged in — a prefilled aspect-matched
                              size (or any other exact value) renders as a real
                              selection even when it isn't one of the coarse steps. */}
                          {Array.from(new Set([...CUSTOM_SIZE_STEPS, customHeight])).sort((a, b) => a - b).map((n) => (
                            <option key={n} value={n}>{n}&quot;</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <span className="text-xs text-stone-400 font-bold px-1">×</span>

                      <div className="relative">
                        <select
                          value={customWidth}
                          onChange={(e) => {
                            setIsCustomSize(true);
                            const val = Number(e.target.value);
                            setCustomWidth(val);
                            if (isWordArtProduct) {
                              setWordArtSizeOption((prev) => ({
                                ...prev,
                                widthInches: val,
                                label: `${val}" × ${prev.heightInches}"`,
                                aspectRatio: val / prev.heightInches
                              }));
                            }
                          }}
                          className="w-20 px-2 py-1.5 border border-stone-300 bg-white text-xs font-bold text-stone-800 rounded-lg focus:outline-none focus:border-[#0E4A93] appearance-none pr-6 cursor-pointer"
                        >
                          {Array.from(new Set([...CUSTOM_SIZE_STEPS, customWidth])).sort((a, b) => a - b).map((n) => (
                            <option key={n} value={n}>{n}&quot;</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <div className="text-xs font-black text-[#0E4A93] ml-2">
                        ₹{(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(customSizePrice, quantity) : customSizePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (isWordArtProduct) {
                          setIsWordArtSizeModalOpen(true);
                        } else {
                          setIsSizeShapeModalOpen(true);
                        }
                      }}
                      className="text-xs font-bold text-[#0E4A93] hover:underline cursor-pointer"
                    >
                      Open Full Size & Shape Guide →
                    </button>
                  </div>
                </>
              ) : (
                /* Shaped canvas products (Round, Triangle, Heart, Oval) */
                <>
                  <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                    <div className="text-xs">
                      <span className="font-black text-[#0E4A93] uppercase tracking-wide">
                        {selectedProductType.name} Sizes
                      </span>
                      <p className="text-stone-600 text-[11px] mt-0.5">Select a diameter / physical dimensions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSizeShapeModalOpen(true)}
                      className="px-3 py-1 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Guide
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSizeOptions.map((opt) => {
                      const isSelected = !isCustomSize && selectedSizeId === opt.id;
                      return (
                        <CustomizerOptionCard
                          key={opt.id}
                          selected={isSelected}
                          onClick={() => {
                            setIsCustomSize(false);
                            setSelectedSizeId(opt.id);
                            if (isLayoutProduct) {
                              setSelectedLayoutId(opt.id);
                              setExpandedLayoutId(opt.id);
                              const layouts = getProductLayouts(selectedProductTypeId);
                              const layout = layouts.find((l) => l.id === opt.id);
                              if (layout) {
                                const targetShape = layout.shapeId || (layout.aspectRatio === 1 ? 'shape-square' : (layout.aspectRatio > 1 ? 'shape-landscape' : 'shape-portrait'));
                                setSelectedShapeId(targetShape);
                              }
                            }
                          }}
                          title={opt.label}
                          subtitle={opt.dimensionsSummary}
                          priceText={`₹${(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(opt.price, quantity) : opt.price).toLocaleString('en-IN')}`}
                          previewHeightClass="h-16 p-1.5"
                          preview={renderSizePreview(opt, isSelected)}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            )
          )}

          {/* ------------------------ EFFECTS & OPTIONS ------------------------- */}
          {activeTab === 'EFFECTS & OPTIONS' && (
            <DigitalPaintingOptionsPanel
              config={digitalPaintingConfig}
              onChangeConfig={handleUpdateDigitalPaintingConfig}
              currentSizeLabel={isCustomSize ? `${customWidth}" × ${customHeight}" (Custom)` : currentSizeOption?.label || selectedSizeId}
              currentPrice={totalPrice}
              onOpenSizeModal={() => setIsSizeShapeModalOpen(true)}
            />
          )}

          {/* ------------------------ CREATE BUS ROLL ------------------------- */}
          {activeTab === 'CREATE BUS ROLL' && (
            <BusRollLineEditorPanel
              config={busRollConfig}
              onChangeConfig={handleUpdateBusRollConfig}
            />
          )}

          {/* --------------------------- BACKGROUND --------------------------- */}
          {activeTab === 'BACKGROUND' && (
            <BusRollBackgroundPanel
              config={busRollConfig}
              onChangeConfig={handleUpdateBusRollConfig}
            />
          )}

          {/* ---------------------------- TEMPLATE ---------------------------- */}
          {activeTab === 'TEMPLATE' && (
            <BusRollTemplatePanel
              config={busRollConfig}
              onChangeConfig={(updates) => {
                handleUpdateBusRollConfig(updates);
                if (updates.widthInches && updates.heightInches) {
                  const matchingSize = availableSizeOptions.find(
                    (s) => s.widthInches === updates.widthInches && s.heightInches === updates.heightInches
                  );
                  if (matchingSize) {
                    setSelectedSizeId(matchingSize.id);
                  }
                }
              }}
            />
          )}

          {/* ------------------------ LAYOUTS & DESIGNS ------------------------- */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            isLyricProduct ? (
              <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
                <LyricStudioPanel
                  config={lyricConfig}
                  template={selectedLyricTemplate}
                  photoUrl={panelImages[0]?.imageUrl || null}
                  onTriggerUpload={() => {
                    uploadTargetRef.current = 0;
                    fileInputRef.current?.click();
                  }}
                  onRemovePhoto={() => handleRemoveSlotPhoto(0)}
                  onChangeConfig={setLyricConfig}
                  onOpenTemplateModal={() => setIsLyricTemplateModalOpen(true)}
                />
              </div>
            ) : (
              <div className="p-4 space-y-3.5">
                <>
                  {/* Remove Design/Template Header Action Tile (Requirement 2) */}
                  <div className="pb-2 border-b border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">
                        Design Template
                      </span>
                      {selectedTemplateId && (
                        <button
                          type="button"
                          onClick={handleRemoveTemplate}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Template</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleRemoveTemplate}
                        className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          !selectedTemplateId
                            ? 'border-[#0E4A93] bg-blue-50/30 ring-2 ring-[#0E4A93]/20 shadow-xs'
                            : 'border-stone-200 bg-stone-50 hover:border-stone-400'
                        }`}
                        title="Plain Print (No template)"
                      >
                        <div className="relative w-8 h-8 border border-stone-300 bg-white rounded flex items-center justify-center shadow-2xs">
                          <X className="w-4 h-4 text-stone-400 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-bold text-stone-600 mt-1">None</span>
                      </button>
                      {activeTemplate && (
                        <div className="flex-1 p-2 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] font-black uppercase text-[#0E4A93] block">Active:</span>
                            <span className="text-xs font-bold text-stone-900 truncate block">{activeTemplate.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveTemplate}
                            className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-stone-200 shadow-2xs transition-colors cursor-pointer shrink-0"
                            title="Remove this design"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESIGNS vs LAYOUTS Tabs (Matching Screenshot 1) */}
                  <div className="flex border border-stone-200 rounded-xl overflow-hidden bg-stone-100 p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setLayoutSubTab('DESIGNS')}
                      className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        layoutSubTab === 'DESIGNS'
                          ? 'bg-[#0E4A93] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      DESIGNS
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutSubTab('LAYOUTS')}
                      className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        layoutSubTab === 'LAYOUTS'
                          ? 'bg-[#0E4A93] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                      }`}
                    >
                      LAYOUTS
                    </button>
                  </div>

                  {/* ==================== DESIGNS TAB ==================== */}
                  {layoutSubTab === 'DESIGNS' && (
                    <div className="space-y-2 pt-1">
                      {DESIGN_TEMPLATE_CATEGORIES.map((cat) => {
                        const isExpanded = expandedDesignCategory === cat;
                        const categoryTemplates = DESIGN_TEMPLATES.filter((t) => t.category === cat);
                        return (
                          <div
                            key={cat}
                            className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedDesignCategory(isExpanded ? null : cat)}
                              className="w-full px-3.5 py-3 flex items-center justify-between text-left font-bold text-xs text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                              <span>{cat}</span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-stone-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-stone-400" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="p-2.5 pt-0 border-t border-stone-100 bg-stone-50/40">
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  {categoryTemplates.map((tpl) => {
                                    const isSelected = selectedTemplateId === tpl.id;
                                    return (
                                      <div
                                        key={tpl.id}
                                        onClick={() => handleApplyTemplate(tpl)}
                                        className={`group relative rounded-xl border-2 transition-all overflow-hidden flex flex-col justify-between cursor-pointer ${
                                          isSelected
                                            ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm ring-1 ring-[#0E4A93]/20'
                                            : 'border-stone-200 hover:border-stone-400 bg-white'
                                        }`}
                                      >
                                        {isSelected && (
                                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs z-10">
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                          </div>
                                        )}

                                        <div className={`relative w-full h-24 flex items-center justify-center p-2.5 ${tpl.swatchClass}`}>
                                          {renderDecorSvg(tpl.decor, tpl.accent, 'absolute inset-0 w-full h-full pointer-events-none')}
                                          <div className="relative w-12 h-14 rounded bg-white/90 border border-black/10 shadow-xs flex items-center justify-center text-center p-1">
                                            <span className="text-[8px] font-black leading-tight text-stone-800 line-clamp-2">
                                              {tpl.textPreset}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="p-1.5 bg-white text-center border-t border-stone-100">
                                          <div className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                                            {tpl.name}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ==================== LAYOUTS TAB ==================== */}
                  {layoutSubTab === 'LAYOUTS' && (() => {
                    const currentProductLayouts = getProductLayouts(selectedProductTypeId);
                    const activeLayout = currentProductLayouts.find((l) => l.id === selectedLayoutId) || currentProductLayouts[0];
                    return (
                      <div className="space-y-3">
                        {/* Selected Layout Summary Banner */}
                        <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-xl border border-blue-100 my-1">
                          <div>
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Active Layout</span>
                            <div className="text-xs font-black text-stone-900 mt-0.5">
                              {activeLayout?.name || selectedLayoutId}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsLayoutModalOpen(true)}
                            className="px-3 py-1 bg-[#0E4A93] hover:bg-[#0A366C] text-white text-xs font-bold rounded-lg shadow-xs transition-transform hover:scale-102 cursor-pointer flex items-center gap-1.5"
                          >
                            <Layers className="w-3 h-3" />
                            <span>Change Layout</span>
                          </button>
                        </div>

                        <p className="text-xs text-stone-500">
                          Choose a layout arrangement compatible with {selectedProductType.name}.
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          {currentProductLayouts.map((layout) => {
                            const isSelected = selectedLayoutId === layout.id;
                            return (
                              <div
                                key={layout.id}
                                onClick={() => {
                                  setSelectedLayoutId(layout.id);
                                  setExpandedLayoutId(layout.id);
                                  if (!isSinglePrintCanvas) {
                                    setSelectedSizeId(layout.id);
                                    const targetShape = layout.shapeId || (layout.aspectRatio === 1 ? 'shape-square' : 'shape-rectangle');
                                    setSelectedShapeId(targetShape);
                                  }
                                }}
                                className={`group relative rounded-xl border-2 transition-all overflow-hidden flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm ring-1 ring-[#0E4A93]/20'
                                    : 'border-stone-200 hover:border-stone-400 bg-white'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </div>
                                )}

                                <div className="w-full h-24 bg-stone-50 border-b border-stone-100 p-2 flex items-center justify-center">
                                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform">
                                    {renderProductLayoutDiagram(layout, isSelected)}
                                  </div>
                                </div>

                                <div className="p-2 bg-white text-center">
                                  <div className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                                    {layout.name}
                                  </div>
                                  <div className="text-[10px] font-medium text-stone-500 truncate">
                                    {layout.dimensionsSummary || layout.description || `${layout.panelsCount} ${layout.panelsCount === 1 ? 'Panel' : 'Panels'}`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </>
              </div>
            )
          )}

          {/* --------------------------- WRAP & BORDER --------------------------- */}
          {activeTab === 'WRAP & BORDER' && (
            <div className="p-3 sm:p-4 space-y-4">
              {/* ==================== 1. WRAP SECTION (Matching Screenshot 1) ==================== */}
              {selectedProductTypeId !== 'canvas-banner' && (
                <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs bg-white">
                  {/* Dark Section Header Bar */}
                  <div className="bg-[#4a4a4a] text-white px-3.5 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {activeMaterial === 'acrylic' ? 'Thickness' : 'Wrap'}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-200">
                      {activeMaterial === 'acrylic' ? `${ACRYLIC_THICKNESS_OPTIONS.length} options` : '3 options'}
                    </span>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* Thickness Options Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {(activeMaterial === 'acrylic' ? ACRYLIC_THICKNESS_OPTIONS.slice(0, 3) : CANVAS_THICKNESS_OPTIONS.slice(0, 3)).map((th: any) => {
                        const isSelected = selectedThicknessId === th.id;
                        const displayTitle = th.name || th.label.split('(')[0].trim();
                        const displaySub = th.thicknessInches ? `(${th.thicknessInches.toFixed(2)}")` : th.thicknessMm ? `(${th.thicknessMm}mm)` : '';
                        return (
                          <CustomizerOptionCard
                            key={th.id}
                            selected={isSelected}
                            onClick={() => setSelectedThicknessId(th.id)}
                            badge={th.badge}
                            title={displayTitle}
                            subtitle={displaySub}
                            priceText={`₹${th.price.toFixed(2)}`}
                            previewHeightClass="h-16 p-1"
                            preview={renderWrapPreview(th.id)}
                          />
                        );
                      })}
                    </div>

                    {/* Custom Thickness Toggle & Slider */}
                    {activeMaterial === 'canvas' && (
                      <div className="pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setSelectedThicknessId(selectedThicknessId === 'custom-thickness' ? 'thin-gallery' : 'custom-thickness')}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition-all ${
                            selectedThicknessId === 'custom-thickness'
                              ? 'border-[#0E4A93] bg-blue-50/50 text-[#0E4A93]'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50/60'
                          }`}
                        >
                          <span>Custom Thickness</span>
                          <span className="text-[11px] font-semibold text-stone-500">
                            {selectedThicknessId === 'custom-thickness' ? `${customThicknessInches.toFixed(2)}"` : 'Specify custom'}
                          </span>
                        </button>

                        {selectedThicknessId === 'custom-thickness' && (
                          <div className="mt-2.5 p-3 bg-blue-50/40 rounded-xl border border-blue-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800">Specify Custom Depth:</span>
                              <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-md border border-stone-300">
                                <input
                                  type="number"
                                  min={0.25}
                                  max={3.0}
                                  step={0.05}
                                  value={customThicknessInches}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (!isNaN(val)) setCustomThicknessInches(Math.max(0.25, Math.min(3.0, Math.round(val * 100) / 100)));
                                  }}
                                  className="w-12 text-right font-bold text-xs text-[#0E4A93] outline-hidden"
                                />
                                <span className="text-[11px] font-bold text-stone-500">inch</span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min={0.25}
                              max={3.0}
                              step={0.05}
                              value={customThicknessInches}
                              onChange={(e) => setCustomThicknessInches(Math.round(parseFloat(e.target.value) * 100) / 100)}
                              className="w-full accent-[#0E4A93] cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== 2. BORDER SECTION (Matching Screenshot 1 & 3) ==================== */}
              <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs bg-white">
                {/* Dark Section Header Bar */}
                <div className="bg-[#4a4a4a] text-white px-3.5 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Border</span>
                  <span className="text-[11px] font-semibold text-stone-200">
                    {selectedBorderWidthId === 'none' ? 'No Border' : 'Border Active'}
                  </span>
                </div>

                <div className="p-3 space-y-3">
                  {/* Top Feature Cards: Mirror Image & Border Color */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Mirror Image */}
                    <CustomizerOptionCard
                      selected={mirrorImage}
                      onClick={() => setMirrorImage(!mirrorImage)}
                      title="Mirror Image"
                      subtitle="Folded Edge"
                      priceText="Free"
                      previewHeightClass="h-14 p-1.5"
                      preview={
                        <div className="w-10 h-10 rounded border border-stone-300 mx-auto overflow-hidden bg-stone-100 flex items-center justify-center">
                          <FlipHorizontal2 className="w-5 h-5 text-[#0E4A93]" />
                        </div>
                      }
                    />

                    {/* Border Color */}
                    <CustomizerOptionCard
                      selected={selectedBorderWidthId !== 'none'}
                      onClick={() => {
                        if (selectedBorderWidthId === 'none') {
                          setSelectedBorderWidthId('thin');
                        } else {
                          setSelectedBorderWidthId('none');
                        }
                      }}
                      title="Border Color"
                      subtitle={selectedBorderWidthId !== 'none' ? 'Active' : 'Click to Enable'}
                      priceText="Free"
                      previewHeightClass="h-14 p-1.5"
                      preview={
                        <div
                          className="w-10 h-10 rounded mx-auto p-1 shadow-2xs transition-colors flex items-center justify-center"
                          style={{ backgroundColor: selectedBorderWidthId !== 'none' ? selectedBorderColor : '#E2E8F0' }}
                        >
                          <div className="w-7 h-7 rounded-xs bg-white shadow-xs flex items-center justify-center">
                            <Palette className="w-3.5 h-3.5 text-[#0E4A93]" />
                          </div>
                        </div>
                      }
                    />
                  </div>

                  {/* Border Width Selection: Thin vs No Border */}
                  <div className="grid grid-cols-2 gap-2">
                    <CustomizerOptionCard
                      selected={selectedBorderWidthId === 'thin'}
                      onClick={() => setSelectedBorderWidthId('thin')}
                      title="Thin"
                      subtitle="4mm border"
                      priceText="Free"
                      previewHeightClass="h-12 p-1"
                      preview={
                        <div
                          className="w-8 h-8 rounded mx-auto p-0.5 shadow-2xs"
                          style={{ backgroundColor: selectedBorderColor }}
                        >
                          <div className="w-full h-full rounded-2xs bg-stone-200" />
                        </div>
                      }
                    />

                    <CustomizerOptionCard
                      selected={selectedBorderWidthId === 'none'}
                      onClick={() => setSelectedBorderWidthId('none')}
                      title="No Border"
                      subtitle="Border-free edge"
                      priceText="Free"
                      previewHeightClass="h-12 p-1"
                      preview={
                        <div className="w-8 h-8 rounded border border-dashed border-stone-300 mx-auto bg-stone-50 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-2xs bg-stone-200" />
                        </div>
                      }
                    />
                  </div>

                  {/* Flexible Custom Color Selection: Native Picker + Hex + Swatches */}
                  {selectedBorderWidthId !== 'none' && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-stone-800">Border Color:</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          {/* Live Color Swatch */}
                          <div
                            className="w-6 h-6 rounded-md border border-stone-300 shadow-2xs transition-colors"
                            style={{ backgroundColor: selectedBorderColor }}
                            title={`Selected color: ${selectedBorderColor}`}
                          />
                          {/* Hex Input */}
                          <div className="flex items-center bg-white px-2 py-0.5 rounded-md border border-stone-300 shadow-2xs text-xs font-mono font-bold text-stone-800">
                            <span className="text-stone-400 mr-0.5">#</span>
                            <input
                              type="text"
                              maxLength={6}
                              value={borderHexInput.replace('#', '')}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                                setBorderHexInput('#' + raw);
                                if (raw.length === 3 || raw.length === 6) {
                                  setSelectedBorderColor('#' + raw);
                                }
                              }}
                              placeholder="FFFFFF"
                              className="w-16 uppercase outline-hidden font-bold"
                            />
                          </div>
                          {/* Native Picker */}
                          <label className="cursor-pointer px-2 py-1 rounded-md bg-white border border-stone-300 hover:border-stone-400 text-[#0E4A93] flex items-center gap-1 text-[11px] font-bold shadow-2xs">
                            <Pipette className="w-3.5 h-3.5" />
                            <span>Picker</span>
                            <input
                              type="color"
                              value={selectedBorderColor.startsWith('#') && selectedBorderColor.length === 7 ? selectedBorderColor : '#FFFFFF'}
                              onChange={(e) => {
                                const col = e.target.value.toUpperCase();
                                setSelectedBorderColor(col);
                                setBorderHexInput(col);
                              }}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Quick Preset Swatches Palette */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {[
                          { name: 'White', hex: '#FFFFFF' },
                          { name: 'Black', hex: '#000000' },
                          { name: 'Charcoal', hex: '#334155' },
                          { name: 'Warm Cream', hex: '#FDF8F0' },
                          { name: 'Royal Gold', hex: '#D4AF37' },
                          { name: 'Silver Slate', hex: '#94A3B8' },
                          { name: 'Navy Blue', hex: '#1E3A8A' },
                          { name: 'Crimson Red', hex: '#DC2626' },
                          { name: 'Forest Green', hex: '#16A34A' }
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => {
                              setSelectedBorderColor(c.hex);
                              setBorderHexInput(c.hex);
                            }}
                            title={c.name}
                            style={{ backgroundColor: c.hex }}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                              selectedBorderColor.toUpperCase() === c.hex.toUpperCase()
                                ? 'ring-2 ring-[#0E4A93] ring-offset-1 scale-110 shadow-xs'
                                : 'border-stone-300 hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ==================== 3. FRAMES SECTION (Matching Screenshot 3) ==================== */}
              {!isMultiFrameProduct && (
                <div className="rounded-xl border border-stone-200 overflow-hidden shadow-2xs bg-white">
                  {/* Dark Section Header Bar */}
                  <div className="bg-[#4a4a4a] text-white px-3.5 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Frames</span>
                    <span className="text-[11px] font-semibold text-stone-200">
                      {FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name || 'No Frame'}
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {/* Accordion 1: Standard */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedFrameCategory(expandedFrameCategory === 'standard' ? 'floating' : 'standard')}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <span>Standard</span>
                        {expandedFrameCategory === 'standard' ? (
                          <ChevronDown className="w-4 h-4 text-stone-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      {expandedFrameCategory === 'standard' && (
                        <div className="p-3 bg-stone-50/50 text-xs text-stone-500 italic">
                          Standard gallery frames are available in single canvas formats. Select Floating for museum-grade floating shadow gap frames.
                        </div>
                      )}
                    </div>

                    {/* Accordion 2: Premium */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedFrameCategory(expandedFrameCategory === 'premium' ? 'floating' : 'premium')}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <span>Premium</span>
                        {expandedFrameCategory === 'premium' ? (
                          <ChevronDown className="w-4 h-4 text-stone-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      {expandedFrameCategory === 'premium' && (
                        <div className="p-3 bg-stone-50/50 text-xs text-stone-500 italic">
                          Premium artisanal framing with handcrafted solid hardwoods.
                        </div>
                      )}
                    </div>

                    {/* Accordion 3: Floating (Expanded as shown in Screenshot 3) */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedFrameCategory(expandedFrameCategory === 'floating' ? 'standard' : 'floating')}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <span>Floating</span>
                        {expandedFrameCategory === 'floating' ? (
                          <ChevronDown className="w-4 h-4 text-stone-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        )}
                      </button>

                      {expandedFrameCategory === 'floating' && (
                        <div className="p-3 space-y-2.5">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'black-frame', name: 'Black Floating Frame', price: 1798.00 },
                              { id: 'wood-frame', name: 'Brown Floating Frame', price: 1798.00 },
                              { id: 'white-frame', name: 'White Floating Frame', price: 1798.00 },
                              { id: 'gold-frame', name: 'Metal Floating Frame', price: 1798.00 }
                            ].map((ff) => {
                              const isSelected = selectedFrameId === ff.id;
                              return (
                                <CustomizerOptionCard
                                  key={ff.id}
                                  selected={isSelected}
                                  onClick={() => setSelectedFrameId(isSelected ? 'no-frame' : ff.id)}
                                  title={ff.name}
                                  priceText={`₹${ff.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  previewHeightClass="h-16 p-1.5"
                                  preview={renderFloatingFrameThumbnail(ff.id)}
                                />
                              );
                            })}
                          </div>

                          {selectedFrameId !== 'no-frame' && (
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setSelectedFrameId('no-frame')}
                                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove Frame (Frameless)
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* -------------------------- HARDWARE & FINISH ------------------------- */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="p-4 space-y-5">
              {/* 1. Canvas Thickness / Stretcher Bar Depth (Excludes Canvas Banner) */}
              {selectedProductTypeId !== 'canvas-banner' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                      {activeMaterial === 'acrylic' ? '1. Acrylic Thickness' : '1. Canvas Stretcher Thickness'}
                    </label>
                    <span className="text-[11px] font-bold text-[#0E4A93]">{(activeMaterial === 'acrylic' ? ACRYLIC_THICKNESS_OPTIONS : THICKNESS_OPTIONS).length} options</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(activeMaterial === 'acrylic' ? ACRYLIC_THICKNESS_OPTIONS : THICKNESS_OPTIONS).map((th: any) => {
                      const isSelected = selectedThicknessId === th.id;
                      return (
                        <CustomizerOptionCard
                          key={th.id}
                          selected={isSelected}
                          onClick={() => setSelectedThicknessId(th.id)}
                          badge={th.badge}
                          title={th.label}
                          priceText={th.price === 0 ? 'Included' : `+₹${th.price}`}
                          previewHeightClass="h-16 p-1.5"
                          preview={renderWrapPreview(th.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Hardware Option & Style */}
              <div className={`space-y-2.5 ${selectedProductTypeId !== 'canvas-banner' ? 'pt-3 border-t border-stone-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">
                    {selectedProductTypeId === 'canvas-banner' ? 'Hardware & Mounting Options' : '2. Hardware Option & Style'}
                  </label>
                  {selectedProductTypeId === 'canvas-banner' && (
                    <span className="text-[11px] font-bold text-[#0E4A93]">{CANVAS_BANNER_HARDWARE_OPTIONS.length} options</span>
                  )}
                  {activeMaterial === 'acrylic' && (
                    <span className="text-[11px] font-bold text-[#0E4A93]">{ACRYLIC_HARDWARE_OPTIONS.length} options</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(selectedProductTypeId === 'canvas-banner' ? CANVAS_BANNER_HARDWARE_OPTIONS : (activeMaterial === 'acrylic' ? ACRYLIC_HARDWARE_OPTIONS : HARDWARE_OPTIONS)).map((hw: any) => {
                    const isSelected = selectedHardwareId === hw.id;
                    const title = 'label' in hw ? hw.label : hw.name;
                    return (
                      <CustomizerOptionCard
                        key={hw.id}
                        selected={isSelected}
                        onClick={() => {
                          setSelectedHardwareId(hw.id);
                          if (selectedProductTypeId === 'canvas-banner') {
                            setBannerConfig((prev) => ({ ...prev, hardwareId: hw.id }));
                          }
                        }}
                        title={title}
                        priceText={hw.price === 0 ? 'Free' : `+₹${(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(hw.price, quantity) : hw.price).toFixed(0)}`}
                        previewHeightClass="h-16 p-1.5"
                        preview={renderHardwareIcon(hw.id)}
                      />
                    );
                  })}
                </div>
                {selectedProductTypeId === 'canvas-banner' && (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-[#0E4A93] font-medium leading-relaxed">
                    <strong>{CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name}: </strong>
                    {CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.description}
                  </div>
                )}
              </div>

              {/* 3. Display Option (Excludes Canvas Banner) */}
              {selectedProductTypeId !== 'canvas-banner' && (
                <div className="space-y-2.5 pt-3 border-t border-stone-200">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">3. Back Display Option</label>
                  <div className="space-y-2">
                    {DISPLAY_OPTIONS.map((opt) => {
                      const isSelected = selectedDisplayOptionId === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-[#0E4A93] bg-blue-50/20 shadow-xs' : 'border-stone-200 hover:border-stone-300 bg-white'
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
                            {opt.label}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#0E4A93]">
                            {opt.price === 0 ? 'Free' : `+₹${(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(opt.price, quantity) : opt.price).toFixed(0)}`}
                            <Info className="w-3.5 h-3.5 text-stone-400" />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Optional Color Finishing */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">4. Optional Color Finishing</label>
                  <span className="text-[10px] font-bold text-stone-400">Free</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {COLOR_FINISH_OPTIONS.map((cf) => {
                    const activePanelFilter = panelImages[activePanelIndex]?.filter || 'original';
                    const isSelected = activePanelFilter === cf.id;
                    const previewImage = panelImages[activePanelIndex]?.imageUrl || panelImages[0]?.imageUrl || uploadedPhotos[0];
                    return (
                      <CustomizerOptionCard
                        key={cf.id}
                        selected={isSelected}
                        onClick={() => handleApplyFilter(cf.id)}
                        title={cf.label}
                        previewHeightClass="h-20 p-0"
                        preview={
                          previewImage ? (
                            <img src={previewImage} alt={cf.label} style={{ filter: getFilterCss(cf.id) }} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )
                        }
                      />
                    );
                  })}
                </div>
                <div className="text-[11px] text-stone-400">Applies to the active photo panel.</div>
              </div>
            </div>
          )}

          {/* ------------------------------ OPTIONS ------------------------------ */}
          {activeTab === 'OPTIONS' && (
            <div className="p-4 space-y-5">
              {/* 1. Lamination Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">1. Lamination Options</label>
                <div className="space-y-2">
                  {LAMINATION_OPTIONS.map((lam) => {
                    const isSelected = selectedLaminationId === lam.id;
                    return (
                      <label
                        key={lam.id}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-[#0E4A93] bg-blue-50/20 shadow-xs' : 'border-stone-200 hover:border-stone-300 bg-white'
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
                        <span className="text-xs font-black text-[#0E4A93]">{lam.price === 0 ? 'Free' : `+₹${(quantity >= MIN_BULK_QTY ? bulkUnitPriceFor(lam.price, quantity) : lam.price).toFixed(0)}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Minor Photo Retouching */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">2. Minor Photo Retouching</label>
                <div className="grid grid-cols-2 gap-2.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {RETOUCH_CHECKS.map((rc) => (
                    <label key={rc.id} className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
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
              </div>

              {/* 3. Major Retouching */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">3. Major Retouching Notes</label>
                <textarea
                  value={majorRetouchText}
                  onChange={(e) => setMajorRetouchText(e.target.value)}
                  rows={3}
                  placeholder="Describe any major retouching you'd like our team to do..."
                  className="w-full px-3 py-2 border border-stone-300 bg-white rounded-xl text-xs focus:outline-none focus:border-[#0E4A93]"
                />
              </div>

              {/* 4. Proof Request */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">4. Digital Proof Request</label>
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proofRequested}
                    onChange={(e) => setProofRequested(e.target.checked)}
                    className="accent-[#0E4A93] w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span>
                    Email with link to the design proof will be sent within 24 hours and has to be approved online. Approve your
                    proof promptly to avoid production and shipping delays.
                  </span>
                </label>
                <p className="text-[11px] text-stone-400">
                  <strong>Note:</strong> All prints manufactured by Canvas India are handmade and might have a ± 1 inch variation
                  from the size ordered.
                </p>
              </div>

              {/* 5. Order Quantity */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">5. Order Quantity</label>
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-1.5 text-stone-600 hover:text-stone-950 font-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 text-xs font-extrabold text-stone-900 min-w-[40px] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3.5 py-1.5 text-stone-600 hover:text-stone-950 font-black cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-stone-400 uppercase">Subtotal</div>
                    <div className="text-sm font-black text-[#0E4A93]">₹{totalPrice.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CustomizerPanel>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 3: MAIN RIGHT LIVE CANVAS PREVIEW WORKSPACE                  */}
        {/* ------------------------------------------------------------------- */}
        <main className="order-1 md:order-3 w-full min-w-0 h-[38vh] min-h-[230px] max-h-[42vh] md:h-full md:max-h-none md:flex-1 shrink-0 md:shrink flex flex-col bg-[#E2E8F0]/60 relative overflow-hidden">
          {/* Top Action Bar for Workspace */}
          {isBusRollProduct ? (
            <BusRollTopToolbar
              config={busRollConfig}
              onChangeConfig={handleUpdateBusRollConfig}
              onSave={handleSaveDesign}
              onStartOver={handleStartOverBusRoll}
            />
          ) : (
            <CustomizerTopToolbar
              onSave={handleSaveDesign}
              showTextPopover={showTextModal}
              onToggleText={() => {
                const currentSlot = activePanelIndex || 0;
                if (showTextModal) {
                  handleAddText('', currentSlot);
                } else {
                  const slotTexts = textElements.filter((t) => getSlotIndex(t) === currentSlot);
                  if (slotTexts.length === 0) {
                    handleAddText('', currentSlot);
                  } else {
                    const existingEmpty = slotTexts.find((t) => !t.text.trim());
                    const targetText = existingEmpty || slotTexts[slotTexts.length - 1];
                    setSelectedElement({ type: 'text', id: targetText.id });
                    setShowTextModal(true);
                    setShowClipartModal(false);
                  }
                }
              }}
              showClipartPopover={showClipartModal}
              onToggleClipart={() => {
                setShowClipartModal(!showClipartModal);
                setShowTextModal(false);
              }}
              isRoomViewActive={viewerMode === 'room'}
              isRoomViewDisabled={!hasUploadedImage}
              onToggleRoomView={productCapabilities.roomView ? () => {
                if (!hasUploadedImage || !productCapabilities.roomView) return;
                setViewerRotation(0);
                setViewerTiltX(0);
                setViewerAutoRotate(false);
                setViewerMode('room');
              } : undefined}
              is3DViewActive={viewerMode === '3d'}
              onOpen3DView={activeMaterial !== 'acrylic' && productCapabilities.view3D ? () => {
                if (!hasUploadedImage || !productCapabilities.view3D) return;
                setPreset3DAngle('top-left');
                setViewerRotation(35);
                setViewerTiltX(-20);
                setViewerAutoRotate(false);
                setViewerMode('3d');
              } : undefined}
              is360ViewActive={viewerMode === '360'}
              onOpen360View={activeMaterial !== 'acrylic' && productCapabilities.view360 ? () => {
                if (!hasUploadedImage || !productCapabilities.view360) return;
                setViewerRotation(36);
                setViewerTiltX(-18);
                setViewerAutoRotate(false);
                setViewerMode('360');
              } : undefined}
              hasSelectedItem={Boolean(selectedElement)}
              onDeleteSelectedItem={removeSelectedItem}
            />
          )}

          {/* Live Typography Editor matching Acrylic Customizer */}
          {showTextModal && activeTextElement && (
            <AcrylicLiveTextEditor
              activeText={activeTextElement}
              slotLabel={
                isLayoutProduct
                  ? `Panel ${getSlotIndex(activeTextElement) + 1}`
                  : undefined
              }
              onUpdateText={handleUpdateActiveText}
              onDuplicateText={handleDuplicateActiveText}
              onDeleteText={handleDeleteActiveText}
              onClose={() => {
                setShowTextModal(false);
                setTextElements((prev) => prev.filter((t) => Boolean(t.text && t.text.trim())));
              }}
            />
          )}

          {/* Clipart Library Modal & Floating Active Clipart Bar matching Acrylic Customizer */}
          <AcrylicClipartModal
            isOpen={showClipartModal}
            onClose={() => setShowClipartModal(false)}
            onAddClipart={handleSelectClipart}
            activeClipart={activeClipartElement}
            onUpdateClipart={handleUpdateActiveClipart}
            onDuplicateClipart={handleDuplicateActiveClipart}
            onDeleteClipart={handleDeleteActiveClipart}
          />

          {/* Validation Warning Banner (Identical to Acrylic Customizer) */}
          {validationWarning && (
            <div className="bg-amber-500 text-white text-xs font-extrabold px-4 py-2 flex items-center justify-between shadow-md z-30 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 shrink-0" />
                <span>{validationWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationWarning(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Save Toast */}
          {saveToast && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-30 animate-in fade-in slide-in-from-top-2">
              {saveToast}
            </div>
          )}

          {/* Shared Center Stage / Design Canvas Area */}
          <CustomizerPreviewArea
            sizeLabel={
              selectedProductTypeId === 'canvas-banner'
                ? `${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}`
                : isCustomSize && canUseCustomSize
                ? `${customWidth}" × ${customHeight}"`
                : isWordArtProduct
                ? (isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : `${wordArtSizeOption.widthInches}" × ${wordArtSizeOption.heightInches}"`)
                : isSplitProduct
                ? (() => {
                    const activeLayout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                    const w = activeLayout.overallWidthInches;
                    const h = activeLayout.overallHeightInches;
                    const dims = (w && h) ? `${w}" × ${h}"` : (activeLayout.dimensionsSummary || currentSizeOption.dimensionsSummary);
                    const pCount = activeLayout.panelsCount || activeLayout.panels?.length || panels?.length || 3;
                    return `${dims} (${pCount} Panels)`;
                  })()
                : isLayoutProduct
                ? (() => {
                    const targetId = isHexagonProduct ? 'canvas-hexagon' : selectedProductTypeId;
                    const activeLayout = getProductLayout(targetId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                    return activeLayout.dimensionsSummary || `${activeLayout.overallWidthInches}" × ${activeLayout.overallHeightInches}"`;
                  })()
                : currentSizeOption.dimensionsSummary
            }
            onZoomOut={handleZoomOut}
            onZoomIn={handleZoomIn}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            isContain={panelImages[activePanelIndex || 0]?.fitMode === 'contain'}
            onToggleFit={hasUploadedImage ? () => {
              const idx = (isSplitProduct || isMosaicProduct) ? 0 : (activePanelIndex || 0);
              if (panelImages[idx]?.fitMode === 'contain') {
                handleFill(idx);
              } else {
                handleFix(idx);
              }
            } : undefined}
            onReset={hasUploadedImage ? handleReset : undefined}
            extraControls={
              hasUploadedImage && (
                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-stone-200">
                  {/* Supported image-positioning controls for predictable horizontal and vertical adjustments (hidden on Photo Mosaic per Requirement 2D) */}
                  {!isMosaicProduct && (
                    <div className="flex items-center gap-0.5" title="Adjust image position">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudge(-1, 0);
                        }}
                        className="p-1 rounded-md text-stone-600 hover:text-[#0E4A93] hover:bg-stone-200 transition-colors cursor-pointer"
                        title="Move Left"
                        aria-label="Move Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudge(1, 0);
                        }}
                        className="p-1 rounded-md text-stone-600 hover:text-[#0E4A93] hover:bg-stone-200 transition-colors cursor-pointer"
                        title="Move Right"
                        aria-label="Move Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudge(0, -1);
                        }}
                        className="p-1 rounded-md text-stone-600 hover:text-[#0E4A93] hover:bg-stone-200 transition-colors cursor-pointer"
                        title="Move Up"
                        aria-label="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudge(0, 1);
                        }}
                        className="p-1 rounded-md text-stone-600 hover:text-[#0E4A93] hover:bg-stone-200 transition-colors cursor-pointer"
                        title="Move Down"
                        aria-label="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            }
            prevStep={{
              label: prevTab.label,
              disabled: activeTabIndex === 0,
              onClick: () => handleSelectTab(prevTab.id)
            }}
            nextStep={{
              label: nextTab.label,
              disabled: activeTabIndex === toolbarItems.length - 1,
              onClick: () => handleSelectTab(nextTab.id)
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            bottomSlot={
              <div className="hidden md:flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold text-stone-600 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-stone-200/80">
                {activeMaterial === 'acrylic' ? (
                  <>
                    <span>
                      Material: <strong className="text-stone-900">Premium Cast Optical Acrylic</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Thickness:{' '}
                      <strong className="text-stone-900">
                        {ACRYLIC_THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || (selectedThicknessId === '5mm' ? '5mm Standard Studio Acrylic' : '3mm Lightweight Cast Acrylic')}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Hardware:{' '}
                      <strong className="text-stone-900">
                        {ACRYLIC_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name || HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label || 'No Hooks'}
                      </strong>
                    </span>
                  </>
                ) : (
                  <>
                    {isQuotesProduct && (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsQuotesPreferenceModalOpen(true)}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-[#0E4A93] border border-blue-200/80 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal className="w-2.5 h-2.5" />
                          <span>Preference: {quotesPreference === 'create-own' ? 'Create Your Own' : 'Our Collection'} (Change)</span>
                        </button>
                        <span>•</span>
                      </>
                    )}
                    <span>
                      Material:{' '}
                      <strong className="text-stone-900">
                        {selectedProductTypeId === 'canvas-banner'
                          ? 'Premium Flexible Canvas Banner'
                          : (MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Artist Cotton Canvas')}
                      </strong>
                    </span>
                    {selectedProductTypeId === 'canvas-banner' ? (
                      <>
                        <span>•</span>
                        <span>
                          Hardware: <strong className="text-stone-900">{CANVAS_BANNER_HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name || 'No Hardware'}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Background: <strong className="text-stone-900">{bannerConfig.backgroundColor}</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>•</span>
                        <span>
                          Thickness: <strong className="text-stone-900">{THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Wrap: <strong className="text-stone-900">{WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.name}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Hardware: <strong className="text-stone-900">{HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label}</strong>
                        </span>
                      </>
                    )}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(true)}
                  className="ml-1 px-2.5 py-0.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-[10px] font-extrabold rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Change Material
                </button>
                {panelImages[activePanelIndex]?.imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlotPhoto(activePanelIndex)}
                    className="px-2.5 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-extrabold rounded-full transition-colors cursor-pointer inline-flex items-center gap-1 uppercase tracking-wider"
                    title="Remove photo from active canvas slot"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            }
          >
            {/* Stage: everything the customer designs on (frames + movable text/clipart) */}
            <div ref={stageRef} className="relative w-full flex flex-col items-center" onPointerDown={() => setSelectedElement(null)}>
              {/* WALL DISPLAY (Physical Multi-Panel Gallery Wall Layout) */}
              {isWallArtProduct && renderWallDisplayCanvas()}

              {/* PHOTO MOSAIC (Multi-Tile Mosaic Canvas Grid) */}
              {isMosaicProduct && renderMosaicCanvas()}

              {/* HEXAGON PRINTS (1 or Multi-piece Hexagon Bundles) */}
              {isHexagonProduct && renderHexagonCluster()}

              {/* SINGLE PANEL LAYOUTS (Single Print, Round, Triangle, Heart, Oval, etc.) */}
              {!isWallArtProduct &&
                !isCollageProduct &&
                !isMosaicProduct &&
                !isSplitProduct &&
                !isHexagonProduct &&
                (() => {
                const frameOption = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
                const hasFraming = Boolean(frameOption && frameOption.id !== 'no-frame');
                const borderWidthPx = selectedBorderWidthId !== 'none'
                  ? (selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : selectedBorderWidthId === 'thick' ? 12 : 4)
                  : 0;
                const thicknessOption = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[1];
                const wrapDepthPx = (thicknessOption as any)?.depthPx || 26;
                const visibleDepthPx =
                  selectedThicknessId === 'canvas-lite'
                    ? 10
                    : selectedThicknessId === 'thin-gallery'
                    ? 18
                    : selectedThicknessId === 'thick-gallery'
                    ? 28
                    : selectedThicknessId === 'custom-thickness'
                    ? Math.max(8, Math.min(36, Math.round(customThicknessInches * 18)))
                    : 18;

                const displayWidthInches = isWordArtProduct
                  ? wordArtSizeOption.widthInches
                  : isBusRollProduct
                  ? busRollConfig.widthInches
                  : isBannerProduct
                  ? bannerConfig.widthInches
                  : isCustomSize && canUseCustomSize
                  ? customWidth
                  : currentSizeOption?.widthInches || panels[0]?.widthRatio || 8;
                const displayHeightInches = isWordArtProduct
                  ? wordArtSizeOption.heightInches
                  : isBusRollProduct
                  ? busRollConfig.heightInches
                  : isBannerProduct
                  ? bannerConfig.heightInches
                  : isCustomSize && canUseCustomSize
                  ? customHeight
                  : currentSizeOption?.heightInches || panels[0]?.heightRatio || 8;

                const isFullBleedWrap = selectedWrapId === 'full-bleed';
                const isMirrorWrap = selectedWrapId === 'clear-edge';
                const isWhiteBorderWrap = selectedWrapId === 'white-border';
                const isBlackBorderWrap = selectedWrapId === 'black-border';
                const isNoWrap = selectedWrapId === 'no-wrap';

                const wrapBgColor = isWhiteBorderWrap
                  ? '#FFFFFF'
                  : isBlackBorderWrap
                  ? '#0F172A'
                  : isNoWrap
                  ? '#E2E8F0'
                  : '#D6CFC2';

                const isRectangularShape =
                  !shapeApplies ||
                  ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id);

                const panelBox = (
                  <div className="relative flex flex-col items-center select-none w-full">
                    {/* Ruler Top */}
                    <div
                      className="w-full flex items-center justify-center py-1 mb-1 relative"
                      style={{
                        width: isMobile
                          ? `min(calc(100vw - 4rem), calc(28vh * ${printAspect}))`
                          : `min(${printAspect > 1.4 ? '35rem' : printAspect > 1.15 ? '30rem' : '27rem'}, calc(52vh * ${printAspect}))`,
                        maxWidth: '100%'
                      }}
                    >
                      <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
                      <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
                        {selectedProductTypeId === 'canvas-banner' ? formatDimension(bannerConfig.widthInches, bannerConfig.unit) : `${displayWidthInches} inch`}
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                      {/* Top-Left Orientation / Rotate Icon to match reference image */}
                      <button
                        type="button"
                        onClick={handleRotate90}
                        className="absolute -top-6 -left-8 w-6 h-6 rounded-md bg-white border border-stone-300/80 shadow-2xs flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors z-10 cursor-pointer"
                        title="Rotate canvas orientation"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Ruler Left */}
                      <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
                        <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
                        <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
                          {selectedProductTypeId === 'canvas-banner' ? formatDimension(bannerConfig.heightInches, bannerConfig.unit) : `${displayHeightInches} inch`}
                        </div>
                      </div>

                      {/* PHYSICAL CANVAS CONTAINER with clear visible edge & thickness */}
                      {renderFloatingFrameContainer(
                        <div
                          ref={workspaceCanvasBoxRef}
                          className="relative"
                          style={{
                            aspectRatio: String(printAspect),
                            width: isMobile
                              ? `min(calc(100vw - 4rem), calc(28vh * ${printAspect}))`
                              : `min(${printAspect > 1.4 ? '35rem' : printAspect > 1.15 ? '30rem' : '27rem'}, calc(52vh * ${printAspect}))`,
                            maxHeight: isMobile ? '30vh' : '56vh',
                            maxWidth: '100%'
                          }}
                        >
                          {(() => {
                            const showPhysicalEdges = Boolean(productCapabilities.showPhysicalEdges) && !hasFraming;
                          const isWhiteEdge = selectedWrapId === 'white-border';
                          const isImageWrapped = (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && panelImages[0]?.fitMode === 'cover';
                          const imgMeta = panelImages[0]?.uploadedImage;
                          const natWidth = imgMeta?.width || 1200;
                          const natHeight = imgMeta?.height || 800;
                          const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                          const isWiderThanFrame = imgAspect >= printAspect;

                          const effectiveEdgeColor = (isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage)
                            ? quoteBgColor
                            : (isLyricProduct && !panelImages[0]?.imageUrl)
                            ? (selectedLyricTemplate.defaultBackground.color || '#FFFFFF')
                            : (isBlackBorderWrap ? '#0F172A' : '#FFFFFF');

                          const crossClipPath = showPhysicalEdges
                            ? `polygon(${visibleDepthPx}px 0px, calc(100% - ${visibleDepthPx}px) 0px, calc(100% - ${visibleDepthPx}px) ${visibleDepthPx}px, 100% ${visibleDepthPx}px, 100% calc(100% - ${visibleDepthPx}px), calc(100% - ${visibleDepthPx}px) calc(100% - ${visibleDepthPx}px), calc(100% - ${visibleDepthPx}px) 100%, ${visibleDepthPx}px 100%, ${visibleDepthPx}px calc(100% - ${visibleDepthPx}px), 0px calc(100% - ${visibleDepthPx}px), 0px ${visibleDepthPx}px, ${visibleDepthPx}px ${visibleDepthPx}px)`
                            : undefined;

                          return (
                            <>
                              {/* 1. PHYSICAL 4-EDGE PROJECTION GUIDES (ONLY FOR the 7 Edge-Supported Products) */}
                              {showPhysicalEdges && (
                                <>
                                  {/* Top Physical Thickness Edge Guide */}
                                  <div
                                    className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                                    style={{
                                      bottom: '100%',
                                      height: `${visibleDepthPx}px`,
                                      borderBottom: 'none',
                                      backgroundColor: effectiveEdgeColor
                                    }}
                                  >
                                    {panelImages[0]?.imageUrl && isImageWrapped && (
                                      <div
                                        className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                                        style={{
                                          top: '100%',
                                          left: 0,
                                          width: '100%',
                                          height: `${workspaceBoxSize.height}px`,
                                          transformOrigin: 'top center',
                                          transform: 'scaleY(-1)'
                                        }}
                                      >
                                        <img
                                          src={(selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl) ? popArtConfig.processedImageUrl : panelImages[0].imageUrl}
                                          alt=""
                                          style={{
                                            width: isWiderThanFrame ? 'auto' : '100%',
                                            height: isWiderThanFrame ? '100%' : 'auto',
                                            minWidth: '100%',
                                            minHeight: '100%',
                                            maxWidth: 'none',
                                            maxHeight: 'none',
                                            flexShrink: 0,
                                            aspectRatio: `${natWidth} / ${natHeight}`,
                                            objectFit: 'cover',
                                            objectPosition: 'center center',
                                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                            transformOrigin: 'center center',
                                            filter: `${getFilterCss(panelImages[0].filter)} brightness(0.95)`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                          }}
                                          className="pointer-events-none select-none max-w-none"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Left Physical Thickness Edge Guide */}
                                  <div
                                    className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                                    style={{
                                      right: '100%',
                                      width: `${visibleDepthPx}px`,
                                      borderRight: 'none',
                                      backgroundColor: effectiveEdgeColor
                                    }}
                                  >
                                    {panelImages[0]?.imageUrl && isImageWrapped && (
                                      <div
                                        className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                                        style={{
                                          left: '100%',
                                          top: 0,
                                          width: `${workspaceBoxSize.width}px`,
                                          height: '100%',
                                          transformOrigin: 'left center',
                                          transform: 'scaleX(-1)'
                                        }}
                                      >
                                        <img
                                          src={(selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl) ? popArtConfig.processedImageUrl : panelImages[0].imageUrl}
                                          alt=""
                                          style={{
                                            width: isWiderThanFrame ? 'auto' : '100%',
                                            height: isWiderThanFrame ? '100%' : 'auto',
                                            minWidth: '100%',
                                            minHeight: '100%',
                                            maxWidth: 'none',
                                            maxHeight: 'none',
                                            flexShrink: 0,
                                            aspectRatio: `${natWidth} / ${natHeight}`,
                                            objectFit: 'cover',
                                            objectPosition: 'center center',
                                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                            transformOrigin: 'center center',
                                            filter: `${getFilterCss(panelImages[0].filter)} brightness(0.9)`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                          }}
                                          className="pointer-events-none select-none max-w-none"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Bottom Physical Thickness Edge Guide */}
                                  <div
                                    className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                                    style={{
                                      top: '100%',
                                      height: `${visibleDepthPx}px`,
                                      borderTop: 'none',
                                      backgroundColor: effectiveEdgeColor,
                                      boxShadow: '0 12px 20px -4px rgba(15, 23, 42, 0.12)'
                                    }}
                                  >
                                    {panelImages[0]?.imageUrl && isImageWrapped && (
                                      <div
                                        className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                                        style={{
                                          bottom: '100%',
                                          left: 0,
                                          width: '100%',
                                          height: `${workspaceBoxSize.height}px`,
                                          transformOrigin: 'bottom center',
                                          transform: 'scaleY(-1)'
                                        }}
                                      >
                                        <img
                                          src={(selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl) ? popArtConfig.processedImageUrl : panelImages[0].imageUrl}
                                          alt=""
                                          style={{
                                            width: isWiderThanFrame ? 'auto' : '100%',
                                            height: isWiderThanFrame ? '100%' : 'auto',
                                            minWidth: '100%',
                                            minHeight: '100%',
                                            maxWidth: 'none',
                                            maxHeight: 'none',
                                            flexShrink: 0,
                                            aspectRatio: `${natWidth} / ${natHeight}`,
                                            objectFit: 'cover',
                                            objectPosition: 'center center',
                                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                            transformOrigin: 'center center',
                                            filter: `${getFilterCss(panelImages[0].filter)} brightness(0.85)`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                          }}
                                          className="pointer-events-none select-none max-w-none"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Physical Thickness Edge Guide */}
                                  <div
                                    className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0 border border-stone-300/80 transition-colors"
                                    style={{
                                      left: '100%',
                                      width: `${visibleDepthPx}px`,
                                      borderLeft: 'none',
                                      backgroundColor: effectiveEdgeColor
                                    }}
                                  >
                                    {panelImages[0]?.imageUrl && isImageWrapped && (
                                      <div
                                        className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center"
                                        style={{
                                          right: '100%',
                                          top: 0,
                                          width: `${workspaceBoxSize.width}px`,
                                          height: '100%',
                                          transformOrigin: 'right center',
                                          transform: 'scaleX(-1)'
                                        }}
                                      >
                                        <img
                                          src={(selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl) ? popArtConfig.processedImageUrl : panelImages[0].imageUrl}
                                          alt=""
                                          style={{
                                            width: isWiderThanFrame ? 'auto' : '100%',
                                            height: isWiderThanFrame ? '100%' : 'auto',
                                            minWidth: '100%',
                                            minHeight: '100%',
                                            maxWidth: 'none',
                                            maxHeight: 'none',
                                            flexShrink: 0,
                                            aspectRatio: `${natWidth} / ${natHeight}`,
                                            objectFit: 'cover',
                                            objectPosition: 'center center',
                                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                            transformOrigin: 'center center',
                                            filter: `${getFilterCss(panelImages[0].filter)} brightness(0.88)`,
                                            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                          }}
                                          className="pointer-events-none select-none max-w-none"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}

                              {/* 2. FRONT CANVAS SURFACE */}
                              <div
                                {...panelHandlers(0)}
                                ref={registerWheelRef(0)}
                                className={`relative w-full h-full ${
                                  (showPhysicalEdges || selectedProductTypeId === 'canvas-banner' || ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id))
                                    ? 'rounded-xs'
                                    : currentShape.borderRadiusClass
                                } ${
                                  selectedProductTypeId === 'canvas-banner'
                                    ? 'border border-stone-300 shadow-md'
                                    : showPhysicalEdges
                                    ? 'border border-stone-300 shadow-xs'
                                    : 'shadow-lg'
                                } bg-white transition-all cursor-pointer group ${
                                  activePanelIndex === 0 ? 'ring-2 ring-[#0E4A93]/50' : ''
                                } overflow-hidden`}
                                style={{
                                  backgroundColor: (isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage)
                                    ? quoteBgColor
                                    : (isLyricProduct && !panelImages[0]?.imageUrl)
                                    ? (selectedLyricTemplate.defaultBackground.color || '#FFFFFF')
                                    : (selectedProductTypeId === 'canvas-banner' ? bannerConfig.backgroundColor : '#FFFFFF'),
                                  clipPath: (showPhysicalEdges || selectedProductTypeId === 'canvas-banner' || ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id))
                                    ? undefined
                                    : currentShape.clipPathStyle,
                                  WebkitClipPath: (showPhysicalEdges || selectedProductTypeId === 'canvas-banner' || ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id))
                                    ? undefined
                                    : currentShape.clipPathStyle,
                                  touchAction: 'none'
                                }}
                              >
                                {/* Pop Art Live Processing Spinner Overlay */}
                                {selectedProductTypeId === 'canvas-pop-art' && popArtConfig.isProcessing && (
                                  <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs transition-opacity rounded-xs pointer-events-none select-none">
                                    <div className="w-8 h-8 border-3 border-[#0E4A93] border-t-transparent rounded-full animate-spin mb-2" />
                                    <span className="text-xs font-bold text-[#0E4A93] tracking-wide">Applying Pop Art Style...</span>
                                  </div>
                                )}

                                {/* 90° Rotate Button Handle */}
                                {panelImages[0]?.imageUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRotate90();
                                    }}
                                    className="absolute top-2 left-2 z-30 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-stone-300 shadow-md hover:scale-110 hover:border-stone-400 flex items-center justify-center text-stone-700 transition-transform cursor-pointer"
                                    title="Rotate photo 90°"
                                  >
                                    <RotateCw className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Word Art Floating Controls (EDIT / DELETE) as shown in reference */}
                                {isWordArtProduct && panelImages[0]?.imageUrl && (
                                  <div className="absolute top-2 right-2 z-35 flex items-center bg-white/95 backdrop-blur-xs rounded-lg shadow-md border border-stone-200 divide-x divide-stone-200 overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWordArtPersonalizeModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-stone-700 hover:text-[#0E4A93] hover:bg-stone-50 cursor-pointer transition-colors"
                                      title="Edit Word Art details"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                      <span>EDIT</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSlotPhoto(0);
                                        setActiveWordArtDataUrl(null);
                                      }}
                                      className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                                      title="Delete Word Art"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>DELETE</span>
                                    </button>
                                  </div>
                                )}

                                {dragOverPanel === 0 && (
                                  <div className="absolute inset-0 z-30 bg-[#0E4A93]/20 border-4 border-dashed border-[#0E4A93] pointer-events-none" />
                                )}

                                {/* Front Canvas Print Image */}
                                {panelImages[0]?.imageUrl && (isWordArtProduct || !isWordArtArtwork(panelImages[0]?.imageUrl)) && (
                                  <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                                    <img
                                      src={(selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl) ? popArtConfig.processedImageUrl : panelImages[0].imageUrl}
                                      alt="Canvas Print"
                                      draggable={false}
                                      onLoad={(e) => {
                                        const imgEl = e.currentTarget;
                                        if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0 && !imgMeta?.width) {
                                          setPanelImages((prev) => {
                                            const cur = prev[0];
                                            if (!cur) return prev;
                                            return {
                                              ...prev,
                                              [0]: {
                                                ...cur,
                                                uploadedImage: {
                                                  originalSrc: cur.imageUrl || '',
                                                  width: imgEl.naturalWidth,
                                                  height: imgEl.naturalHeight,
                                                  aspectRatio: imgEl.naturalWidth / imgEl.naturalHeight
                                                }
                                              }
                                            };
                                          });
                                        }
                                      }}
                                      style={(() => {
                                        const isSingleContain = panelImages[0]?.fitMode === 'contain';
                                        return {
                                          width: isSingleContain ? '100%' : (isWiderThanFrame ? 'auto' : '100%'),
                                          height: isSingleContain ? '100%' : (isWiderThanFrame ? '100%' : 'auto'),
                                          minWidth: isSingleContain ? '0' : '100%',
                                          minHeight: isSingleContain ? '0' : '100%',
                                          maxWidth: isSingleContain ? '100%' : 'none',
                                          maxHeight: isSingleContain ? '100%' : 'none',
                                          flexShrink: 0,
                                          aspectRatio: `${natWidth} / ${natHeight}`,
                                          objectFit: isSingleContain ? 'contain' : 'cover',
                                          objectPosition: 'center center',
                                          transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                          transformOrigin: 'center center',
                                          filter: isDigitalPaintingProduct
                                            ? `${getFilterCss(panelImages[0].filter) !== 'none' ? getFilterCss(panelImages[0].filter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}`
                                            : getFilterCss(panelImages[0].filter),
                                          transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                        };
                                      })()}
                                      className="pointer-events-none select-none max-w-none"
                                    />
                                  </div>
                                )}

                                {/* Empty State when no image is uploaded */}
                                {!panelImages[0]?.imageUrl && (
                                  isWordArtProduct ? (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWordArtPersonalizeModalOpen(true);
                                      }}
                                      className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center cursor-pointer group select-none"
                                    >
                                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0E4A93] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                                        <Type className="w-7 h-7" />
                                      </div>
                                      <span className="text-sm font-black text-[#0E4A93] mb-1">
                                        Create Personalized Word Art
                                      </span>
                                      <span className="text-xs text-stone-500 max-w-xs">
                                        Click here to customize names, words, shapes, and color palettes
                                      </span>
                                      <span className="mt-3 px-4 py-1.5 bg-[#0E4A93] text-white text-xs font-bold rounded-lg shadow-xs group-hover:bg-[#0b3c77] transition-colors">
                                        Start Customizing
                                      </span>
                                    </div>
                                  ) : selectedProductTypeId === 'canvas-banner' ? (
                                    <div
                                      onClick={() => fileInputRef.current?.click()}
                                      className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group select-none transition-colors"
                                      style={{ backgroundColor: bannerConfig.backgroundColor }}
                                    >
                                      <div className="flex items-center gap-2 text-[#0E4A93] group-hover:scale-105 transition-transform mb-1.5">
                                        <UploadCloud className="w-6 h-6 stroke-[2.2] shrink-0" />
                                        <span className="text-sm font-bold tracking-tight">Upload an Image</span>
                                      </div>
                                      <span className="text-xs text-stone-500 font-medium mb-1">
                                        Maximum upload size: 25MB per file
                                      </span>
                                      <span className="text-[11px] text-stone-400">
                                        Supported formats: PNG, JPG, JPEG, WEBP, BMP
                                      </span>
                                    </div>

                                  ) : isLyricProduct ? (
                                    <div
                                      onClick={() => fileInputRef.current?.click()}
                                      className="w-full h-full relative cursor-pointer group select-none"
                                      style={{
                                        backgroundColor: selectedLyricTemplate.defaultBackground.color || '#FFFFFF'
                                      }}
                                    >
                                      {/* Texture pattern overlay if specified by template */}
                                      {(selectedLyricTemplate.defaultBackground.texture === 'sheet-music' || lyricConfig.layout === 'sheet-music-bg') && (
                                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
                                      )}
                                      {selectedLyricTemplate.defaultBackground.texture === 'parchment' && (
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#78350f_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />
                                      )}

                                      {/* Clean, Non-Obtrusive Upload Prompt at Top of Canvas - Never blocks lyrics */}
                                      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 mx-auto max-w-[280px] bg-white/95 hover:bg-white backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border-2 border-dashed border-[#0E4A93]/35 hover:border-[#0E4A93] shadow-sm hover:shadow-md flex items-center gap-2.5 transition-all z-30 pointer-events-auto">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0E4A93] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                                          <Upload className="w-4 h-4 stroke-[2.2]" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                          <span className="text-xs font-black text-stone-900 block leading-tight truncate">
                                            Upload Photograph
                                          </span>
                                          <span className="text-[10px] text-stone-500 font-medium block leading-tight truncate">
                                            Click to browse or drag photo
                                          </span>
                                        </div>
                                        <span className="px-2.5 py-1 bg-[#0E4A93] text-white text-[10px] font-bold rounded-lg shrink-0 shadow-2xs">
                                          Browse
                                        </span>
                                      </div>
                                    </div>
                                  ) : (isQuotesProduct && quotesPreference === 'create-own') ? (
                                    /* Solid background for Quotes Create Your Own: no white placeholder or overlay */
                                    null
                                  ) : (
                                    <div
                                      onClick={() => fileInputRef.current?.click()}
                                      className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center cursor-pointer group select-none"
                                    >
                                      <div className="flex items-center gap-2 text-[#0E4A93] group-hover:scale-105 transition-transform mb-1">
                                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                          <path d="M11 14.5V6.85l-2.6 2.6L7 8.05 12 3.05l5 5-1.4 1.4-2.6-2.6v7.65h-2zM4 20q-.825 0-1.412-.587Q2 18.825 2 18v-2q0-.425.288-.712Q2.575 15 3 15t.713.288Q4 15.575 4 16v2h16v-2q0-.425.288-.712Q20.575 15 21 15t.713.288Q22 15.575 22 16v2q0 .825-.587 1.413Q20.825 20 20 20Z"/>
                                        </svg>
                                        <span className="text-sm font-semibold tracking-tight">Upload an Image</span>
                                      </div>
                                      <span className="text-xs text-stone-500 mb-2">
                                        Maximum upload size: 25MB per file
                                      </span>
                                    </div>
                                  )
                                )}

                                {borderWidthPx > 0 && (
                                  <div
                                    className="absolute inset-0 pointer-events-none z-25"
                                    style={{
                                      border: `${borderWidthPx}px solid ${selectedBorderColor}`,
                                      borderRadius: currentShape.id === 'shape-circle' ? '9999px' : undefined
                                    }}
                                  />
                                )}

                                {/* Applied design template: real vector decoration */}
                                {activeTemplate && renderDecorSvg(activeTemplate.decor, activeTemplate.accent, 'absolute inset-0 w-full h-full pointer-events-none z-25')}

                                {/* Canvas Banner Hardware Overlays */}
                                {selectedProductTypeId === 'canvas-banner' && (
                                  <>
                                    {/* Corner Eyelets / Metal Grommets */}
                                    {selectedHardwareId === 'banner-grommets' && (
                                      <>
                                        <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center pointer-events-none z-30">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center pointer-events-none z-30">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center pointer-events-none z-30">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center pointer-events-none z-30">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                      </>
                                    )}

                                    {/* Pole Pockets: Top & Bottom Stitched Sleeves */}
                                    {selectedHardwareId === 'banner-pole-pocket' && (
                                      <>
                                        <div className="absolute top-0 inset-x-0 h-5 bg-black/5 border-b border-dashed border-stone-400/80 pointer-events-none z-30 flex items-center justify-center">
                                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500/80">Pole Pocket (Top)</span>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 h-5 bg-black/5 border-t border-dashed border-stone-400/80 pointer-events-none z-30 flex items-center justify-center">
                                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500/80">Pole Pocket (Bottom)</span>
                                        </div>
                                      </>
                                    )}

                                    {/* Solid Wood Hanging Rails */}
                                    {selectedHardwareId === 'banner-hanging-rails' && (
                                      <>
                                        <div className="absolute -top-6 inset-x-0 flex items-center justify-center pointer-events-none z-30">
                                          <svg className="w-32 h-6 overflow-visible" viewBox="0 0 100 24">
                                            <line x1="50" y1="0" x2="10" y2="24" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="50" y1="0" x2="90" y2="24" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="50" cy="0" r="2.5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
                                          </svg>
                                        </div>
                                        <div className="absolute -top-1.5 -inset-x-1 h-3.5 bg-linear-to-b from-[#854D0E] to-[#713F12] border border-[#5A320E] rounded-xs shadow-md z-30 pointer-events-none flex items-center justify-between px-2">
                                          <div className="w-1 h-1 rounded-full bg-[#FEF08A]/70" />
                                          <div className="w-1 h-1 rounded-full bg-[#FEF08A]/70" />
                                        </div>
                                        <div className="absolute -bottom-1.5 -inset-x-1 h-3.5 bg-linear-to-b from-[#854D0E] to-[#713F12] border border-[#5A320E] rounded-xs shadow-md z-30 pointer-events-none flex items-center justify-between px-2">
                                          <div className="w-1 h-1 rounded-full bg-[#FEF08A]/70" />
                                          <div className="w-1 h-1 rounded-full bg-[#FEF08A]/70" />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}

                                {/* Lyric typography overlay for Canvas & Acrylic */}
                                {isLyricProduct && renderLyricOverlay()}
                                {isQuotesProduct && quotesPreference === 'create-own' && renderQuotesCreateOwnOverlay()}

                                {/* Acrylic crystal optical surface gloss reflection & standoffs */}
                                {activeMaterial === 'acrylic' && (
                                  <>
                                    <div
                                      className="absolute inset-0 pointer-events-none z-24 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"
                                      style={{ mixBlendMode: 'screen' }}
                                    />
                                    {(selectedHardwareId === 'standoff-mounts' || selectedHardwareId === 'display-standoff') && isRectangularShape && (
                                      <>
                                        <div className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-700/60" />
                                        </div>
                                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-700/60" />
                                        </div>
                                        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-700/60" />
                                        </div>
                                        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-700/60" />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>,
                      {
                        frameId: selectedFrameId,
                        displayWidthInches,
                        displayHeightInches,
                        aspectRatio: printAspect
                      }
                    )}
                  </div>
                </div>
              );

              return panelBox;
            })()}

              {/* SPLIT CANVAS (Physical Multi-Panel Sliced Layout) */}
              {isSplitProduct && renderContinuousSplitCanvas()}

              {/* PHOTO COLLAGE (Single Canvas Frame containing internal Photo Layout Grid) */}
              {isCollageProduct && (
                <div className="relative flex flex-col items-center select-none w-full">
                  {/* Ruler Top */}
                  <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[30rem] relative">
                    <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
                    <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
                      {getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).overallWidthInches || currentSizeOption?.widthInches || 16} inch ({getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).name})
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    {/* Ruler Left */}
                    <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
                      <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
                      <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
                        {getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).overallHeightInches || currentSizeOption?.heightInches || 16} inch
                      </div>
                    </div>

                    {renderCollageCanvas()}
                  </div>
                </div>
              )}

              {/* Movable text + clipart: drag anywhere on the print */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                {!isLayoutProduct && renderPanelTextItems(0)}
                {clipartElements.map((clip) => {
                  const isSel = selectedElement?.type === 'clipart' && selectedElement.id === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onPointerDown={(e) => startItemDrag(e, 'clipart', clip.id, clip.x, clip.y)}
                      onPointerMove={(e) => moveItemDrag(e, 'clipart', clip.id)}
                      onPointerUp={endItemDrag}
                      onPointerCancel={endItemDrag}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ type: 'clipart', id: clip.id });
                      }}
                      style={{
                        position: 'absolute',
                        left: `${clip.x}%`,
                        top: `${clip.y}%`,
                        transform: `translate(-50%, -50%) scale(${clip.scale || 1}) rotate(${clip.rotation || 0}deg)`,
                        color: clip.color,
                        pointerEvents: 'auto',
                        touchAction: 'none'
                      }}
                      className={`cursor-move select-none p-1 rounded-xl transition-all ${
                        isSel
                          ? 'ring-2 ring-[#0E4A93] bg-black/35 backdrop-blur-xs'
                          : 'hover:ring-1 hover:ring-white/80'
                      }`}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center"
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="${clip.viewBox || '0 0 24 24'}" width="40" height="40" fill="currentColor">${clip.svgPath}</svg>`
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </CustomizerPreviewArea>
        </main>
      </div>

      {/* ===================================================================== */}
      {/* 3. POPUP MODALS                                                       */}
      {/* ===================================================================== */}

      {/* ROOM / 3D / 360 VIEWER */}
      {viewerMode && hasUploadedImage && (() => {
        // Shared live customization state values for all 3 preview modes (Room, 3D, 360)
        const isQuotesCreateOwnSolid = isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage;
        const rawPanel0Url =
          panelImages[activePanelIndex]?.imageUrl ||
          panelImages[0]?.imageUrl ||
          Object.values(panelImages).find((p) => Boolean(p?.imageUrl))?.imageUrl;
        const validPanelUrl = (!isWordArtProduct && isWordArtArtwork(rawPanel0Url)) ? '' : (rawPanel0Url || '');
        const validTrayUrl = uploadedPhotos.find((url) => isWordArtProduct || !isWordArtArtwork(url)) || '';

        const primaryPhotoUrl =
          (selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl)
            ? popArtConfig.processedImageUrl
            : isQuotesCreateOwnSolid
            ? ''
            : (validPanelUrl || validTrayUrl || '');

        const effectiveSizeForViewer = isWordArtProduct
          ? {
              id: wordArtSizeOption.id,
              widthInches: wordArtSizeOption.widthInches,
              heightInches: wordArtSizeOption.heightInches,
              dimensionsSummary: `${wordArtSizeOption.widthInches}" × ${wordArtSizeOption.heightInches}"`,
              aspectRatio: wordArtSizeOption.aspectRatio || (wordArtSizeOption.widthInches / Math.max(1, wordArtSizeOption.heightInches)),
              panelsCount: 1
            }
          : currentSizeOption;

        const geom = getCanvasProductGeometry(
          selectedProductTypeId,
          effectiveSizeForViewer,
          currentShape.id
        );

        const previewAspect = isWordArtProduct
          ? (wordArtSizeOption.aspectRatio || (wordArtSizeOption.widthInches / Math.max(1, wordArtSizeOption.heightInches)))
          : isHexagonProduct
          ? (getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).aspectRatio || 1)
          : isMosaicProduct
          ? (activeMosaicLayout.aspectRatio || 1)
          : isSplitProduct
          ? (getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).aspectRatio || 1)
          : isWallArtProduct
          ? (getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).aspectRatio || 1)
          : isCollageProduct
          ? (getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).aspectRatio || 1)
          : (geom.aspectRatio || (panels.length === 1 ? printAspect : 1));

        const isHexagonCluster = isHexagonProduct && panels.length > 1;
        const isRectShape = !geom.clipPath && ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id);
        const activeClipPath = shapeApplies && currentShape.shapeType === 'custom'
          ? currentShape.clipPathStyle
          : isHexagonProduct
          ? (geom.clipPath || HEXAGON_HORIZONTAL_CLIP_PATH)
          : isRectShape
          ? undefined
          : (geom.clipPath || (shapeApplies ? currentShape.clipPathStyle : undefined));

        const frameOption = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
        const hasOuterFrame = Boolean(frameOption && frameOption.id !== 'no-frame');
        const frameColor = hasOuterFrame ? frameOption?.color : undefined;
        const borderWidthPx = selectedBorderWidthId !== 'none'
          ? (selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 4 : selectedBorderWidthId === 'medium' ? 8 : selectedBorderWidthId === 'thick' ? 12 : 4)
          : 0;
        const isRectangularShape =
          !activeClipPath &&
          (!shapeApplies ||
            ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id));

        // Render the exact shape-following border for both rectangular and curved/custom shapes
        const renderPreviewShapeBorder = (scaledBorderPx: number) => {
          if (scaledBorderPx <= 0) return null;
          if (isRectangularShape) {
            return (
              <div
                className="absolute inset-0 pointer-events-none z-25"
                style={{ border: `${scaledBorderPx}px solid ${selectedBorderColor}` }}
              />
            );
          }
          const sw = Math.max(2, Math.min(9, Math.round(scaledBorderPx * 0.45)));
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-visible"
            >
              {currentShape.id === 'shape-circle' && (
                <circle cx="50" cy="50" r={50 - sw / 2} fill="none" stroke={selectedBorderColor} strokeWidth={sw} />
              )}
              {currentShape.id === 'shape-oval' && (
                <ellipse cx="50" cy="50" rx={50 - sw / 2} ry={50 - sw / 2} fill="none" stroke={selectedBorderColor} strokeWidth={sw} />
              )}
              {currentShape.id === 'shape-rounded-rect' && (
                <rect x={sw / 2} y={sw / 2} width={100 - sw} height={100 - sw} rx="12" ry="12" fill="none" stroke={selectedBorderColor} strokeWidth={sw} />
              )}
              {currentShape.id === 'shape-heart' && (
                <path
                  d="M 50,85 C 12,58 2,38 2,24 C 2,8 14,2 28,2 C 38,2 46,8 50,18 C 54,8 62,2 72,2 C 86,2 98,8 98,24 C 98,38 88,58 50,85 Z"
                  fill="none"
                  stroke={selectedBorderColor}
                  strokeWidth={sw}
                  strokeLinejoin="round"
                />
              )}
              {currentShape.id === 'shape-hexagon' && (
                <polygon
                  points="25,1 75,1 99,50 75,99 25,99 1,50"
                  fill="none"
                  stroke={selectedBorderColor}
                  strokeWidth={sw}
                  strokeLinejoin="round"
                />
              )}
              {currentShape.id === 'shape-triangle' && (
                <polygon
                  points="50,4 96,96 4,96"
                  fill="none"
                  stroke={selectedBorderColor}
                  strokeWidth={sw}
                  strokeLinejoin="round"
                />
              )}
              {currentShape.id === 'shape-arch' && (
                <path
                  d="M 2,98 L 2,40 C 2,15 22,2 50,2 C 78,2 98,15 98,40 L 98,98 Z"
                  fill="none"
                  stroke={selectedBorderColor}
                  strokeWidth={sw}
                />
              )}
            </svg>
          );
        };

        // Render a single slot's image with scaled pan, zoom, rotation, mirror, and filter
        const renderSlotPhoto = (idx: number, photoScaleFactor: number = 1) => {
          const p = panelImages[idx];
          const isMultiSlotProduct = isCollageProduct || isWallArtProduct || isHexagonProduct;
          const rawPanelUrl = (!isWordArtProduct && isWordArtArtwork(p?.imageUrl)) ? null : (p?.imageUrl || null);
          const url = isQuotesCreateOwnSolid
            ? null
            : (selectedProductTypeId === 'canvas-pop-art' && popArtConfig.processedImageUrl)
            ? popArtConfig.processedImageUrl
            : (isMultiSlotProduct
                ? rawPanelUrl
                : (rawPanelUrl || (idx === 0 ? primaryPhotoUrl : null)));
          const panX = (p?.panX || 0) * photoScaleFactor;
          const panY = (p?.panY || 0) * photoScaleFactor;
          const sc = p?.scale || 1;
          const rot = p?.rotation || 0;
          const flt = p?.filter || 'original';
          const isContain = p?.fitMode === 'contain';

          const slotMeta = p?.uploadedImage || panelImages[0]?.uploadedImage;
          const slotNatWidth = slotMeta?.width || 1200;
          const slotNatHeight = slotMeta?.height || 800;
          const slotImgAspect = slotMeta?.aspectRatio || (slotNatWidth / Math.max(1, slotNatHeight));
          const slotIsWider = slotImgAspect >= previewAspect;

          return url ? (
            <div
              className="w-full h-full overflow-hidden relative flex items-center justify-center bg-white pointer-events-none select-none"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <img
                src={url}
                alt={`Canvas Panel ${idx + 1}`}
                draggable={false}
                style={{
                  width: isContain ? '100%' : (slotIsWider ? 'auto' : '100%'),
                  height: isContain ? '100%' : (slotIsWider ? '100%' : 'auto'),
                  minWidth: isContain ? '0' : '100%',
                  minHeight: isContain ? '0' : '100%',
                  maxWidth: isContain ? '100%' : 'none',
                  maxHeight: isContain ? '100%' : 'none',
                  flexShrink: 0,
                  aspectRatio: `${slotNatWidth} / ${slotNatHeight}`,
                  objectFit: isContain ? 'contain' : 'cover',
                  objectPosition: 'center center',
                  filter: isDigitalPaintingProduct
                    ? `${getFilterCss(flt) !== 'none' ? getFilterCss(flt) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}`
                    : getFilterCss(flt),
                  transform: `translate(${panX}px, ${panY}px) scale(${sc}) rotate(${rot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                  transformOrigin: 'center center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                className="max-w-none pointer-events-none select-none"
              />
              {/* Material micro-texture: cotton canvas weave for Canvas, crystal gloss for Acrylic */}
              {activeMaterial === 'canvas' ? (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-tr from-transparent via-white/10 to-white/20"
                  style={{ mixBlendMode: 'screen' }}
                />
              )}
            </div>
          ) : isLyricProduct ? (
            <div
              className="w-full h-full relative overflow-hidden pointer-events-none select-none flex items-center justify-center"
              style={{
                backgroundColor: selectedLyricTemplate.defaultBackground.color || '#FFFFFF'
              }}
            >
              {(selectedLyricTemplate.defaultBackground.texture === 'sheet-music' || lyricConfig.layout === 'sheet-music-bg') && (
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:12px_12px]" />
              )}
              {selectedLyricTemplate.defaultBackground.texture === 'parchment' && (
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#78350f_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
              )}
            </div>
          ) : isQuotesProduct && quotesPreference === 'create-own' ? (
            <div
              className="w-full h-full relative overflow-hidden pointer-events-none select-none"
              style={{ backgroundColor: quoteBgColor }}
            />
          ) : (
            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-[10px] font-bold pointer-events-none select-none">
              {isCollageProduct ? `Slot ${idx + 1}` : `Panel ${idx + 1}`}
            </div>
          );
        };

        // Shared renderer for the complete Canvas & Acrylic front design (artwork, layout, border, template, text, clipart)
        const renderCanvasFrontDesign = (targetWidthPx: number) => {
          const scaleFactor = targetWidthPx / 420;
          const scaledBorderPx = Math.max(0, Math.round(borderWidthPx * scaleFactor));

          return (
            <div
              className="relative w-full h-full overflow-hidden pointer-events-none select-none"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              {panels.length === 1 && !isHexagonProduct && !isCollageProduct ? (
                <div className="relative w-full h-full">
                  {renderSlotPhoto(0, scaleFactor)}
                  {isLyricProduct && renderLyricOverlay(scaleFactor)}
                  {isQuotesProduct && quotesPreference === 'create-own' && renderQuotesCreateOwnOverlay(scaleFactor)}
                </div>
              ) : isHexagonProduct ? (
                (() => {
                  const layoutDef = getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const hexLayout = layoutDef.panels;
                  return (
                    <div className="relative w-full h-full pointer-events-none select-none">
                      {hexLayout.map((pos, i) => {
                        const p = panelImages[i];
                        const url = p?.imageUrl || (i === 0 ? primaryPhotoUrl : null);
                        const panX = (p?.panX || 0) * scaleFactor;
                        const panY = (p?.panY || 0) * scaleFactor;
                        return (
                          <div
                            key={i}
                            style={{
                              position: 'absolute',
                              left: `${pos.x * 100}%`,
                              top: `${pos.y * 100}%`,
                              width: `${pos.w * 100}%`,
                              height: `${pos.h * 100}%`,
                              clipPath: HEXAGON_CLIP_PATH,
                              WebkitClipPath: HEXAGON_CLIP_PATH
                            }}
                            className="overflow-hidden bg-stone-100 flex items-center justify-center"
                          >
                            {url ? (
                              <img
                                src={url}
                                alt=""
                                draggable={false}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: p?.fitMode === 'contain' ? 'contain' : 'cover',
                                  transform: `translate(${panX}px, ${panY}px) scale(${p?.scale || 1}) rotate(${p?.rotation || 0}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  filter: getFilterCss(p?.filter || 'original'),
                                  backfaceVisibility: 'hidden',
                                  WebkitBackfaceVisibility: 'hidden'
                                }}
                              />
                            ) : (
                              <span className="text-stone-400 text-[10px] font-bold">Hexagon {i + 1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : isSplitProduct ? (
                (() => {
                  const layoutDef = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const splitPanels = layoutDef.panels;
                  const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
                  const master = panelImages[0] || createDefaultPanel();
                  const panX = (master.panX || 0) * scaleFactor;
                  const panY = (master.panY || 0) * scaleFactor;

                  return (
                    <div className="relative w-full h-full pointer-events-none select-none bg-stone-100 overflow-hidden">
                      {masterImage ? (
                        <div className="w-full h-full relative">
                          <img
                            src={masterImage}
                            alt=""
                            draggable={false}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: master.fitMode === 'contain' ? 'contain' : 'cover',
                              transform: `translate(${panX}px, ${panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                              filter: getFilterCss(master.filter),
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden'
                            }}
                            className="w-full h-full pointer-events-none"
                          />
                          {/* Internal split division lines (0 gap) */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                            {splitPanels.map((p, idx) => (
                              <rect
                                key={`front-split-${idx}`}
                                x={`${p.x * 100}%`}
                                y={`${p.y * 100}%`}
                                width={`${p.w * 100}%`}
                                height={`${p.h * 100}%`}
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.45)"
                                strokeWidth="1.5"
                                style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }}
                              />
                            ))}
                          </svg>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-[10px] font-bold">
                          Split Canvas ({splitPanels.length} Panels)
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : isMosaicProduct ? (
                (() => {
                  const layoutDef = activeMosaicLayout;
                  const count = layoutDef.panelsCount || layoutDef.panels.length;
                  const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
                  const master = panelImages[0] || createDefaultPanel();
                  const panX = (master.panX || 0) * scaleFactor;
                  const panY = (master.panY || 0) * scaleFactor;

                  return (
                    <div className="relative w-full h-full pointer-events-none select-none bg-white overflow-hidden">
                      {masterImage ? (
                        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                          {layoutDef.panels.map((p, idx) => {
                            const imgMeta = master?.uploadedImage;
                            const natWidth = imgMeta?.width || 1200;
                            const natHeight = imgMeta?.height || 800;
                            const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                            const mosaicAspect = layoutDef.aspectRatio || 1;
                            const isWiderThanMosaic = imgAspect >= mosaicAspect;

                            return (
                              <div
                                key={p.id || idx}
                                style={{
                                  position: 'absolute',
                                  left: `${p.x * 100}%`,
                                  top: `${p.y * 100}%`,
                                  width: `${p.w * 100}%`,
                                  height: `${p.h * 100}%`
                                }}
                                className="relative overflow-hidden rounded-[1px] bg-stone-100 flex items-center justify-center border border-stone-200/40"
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    width: `${(1 / p.w) * 100}%`,
                                    height: `${(1 / p.h) * 100}%`,
                                    left: `${-(p.x / p.w) * 100}%`,
                                    top: `${-(p.y / p.h) * 100}%`
                                  }}
                                  className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                                >
                                  <img
                                    src={masterImage}
                                    alt=""
                                    draggable={false}
                                    style={{
                                      width: isWiderThanMosaic ? 'auto' : '100%',
                                      height: isWiderThanMosaic ? '100%' : 'auto',
                                      minWidth: '100%',
                                      minHeight: '100%',
                                      maxWidth: 'none',
                                      maxHeight: 'none',
                                      flexShrink: 0,
                                      aspectRatio: `${natWidth} / ${natHeight}`,
                                      objectFit: 'cover',
                                      objectPosition: 'center center',
                                      transform: `translate(${panX}px, ${panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                      transformOrigin: 'center center',
                                      filter: getFilterCss(master.filter),
                                      backfaceVisibility: 'hidden',
                                      WebkitBackfaceVisibility: 'hidden'
                                    }}
                                    className="pointer-events-none select-none max-w-none"
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {/* Subtle physical cotton canvas weave micro-texture for Canvas only */}
                          {activeMaterial === 'canvas' && (
                            <div
                              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                              }}
                            />
                          )}
                          {/* Acrylic optical crystal surface gloss reflection & standoffs */}
                          {activeMaterial === 'acrylic' && (
                            <>
                              <div
                                className="absolute inset-0 pointer-events-none z-15"
                                style={{
                                  background:
                                    'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.18) 100%)'
                                }}
                              />
                              <div className="absolute inset-0 pointer-events-none z-15 rounded-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.25)]" />
                              {(selectedHardwareId === 'standoff-mounts' || selectedHardwareId === 'display-standoff') && (
                                <>
                                  <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                  <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                  <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-[10px] font-bold">
                          {layoutDef.name} ({count} Tiles)
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : isWallArtProduct ? (
                (() => {
                  const layoutDef = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const wallPanels = layoutDef.panels;
                  return (
                    <div className="relative w-full h-full pointer-events-none select-none">
                      {wallPanels.map((pos, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: `${pos.x * 100}%`,
                            top: `${pos.y * 100}%`,
                            width: `${pos.w * 100}%`,
                            height: `${pos.h * 100}%`
                          }}
                          className="rounded-xs overflow-hidden shadow-xs bg-white"
                        >
                          {renderSlotPhoto(i, scaleFactor)}
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : isCollageProduct ? (
                (() => {
                  const layout = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  return (
                    <div className="relative w-full h-full bg-[#d8dce2] pointer-events-none select-none">
                      <div className="relative w-full h-full overflow-hidden">
                        {layout.panels.map((pSpec, idx) => (
                          <div
                            key={pSpec.id || idx}
                            style={{
                              position: 'absolute',
                              left: `${pSpec.x * 100}%`,
                              top: `${pSpec.y * 100}%`,
                              width: `${pSpec.w * 100}%`,
                              height: `${pSpec.h * 100}%`,
                              padding: '2px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <div className="w-full h-full rounded-xs overflow-hidden bg-stone-200">
                              {renderSlotPhoto(idx, scaleFactor)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div
                  className="w-full h-full grid gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${panels.length === 4 ? 2 : panels.length}, minmax(0, 1fr))`
                  }}
                >
                  {panels.map((_, i) => (
                    <div key={i} className="min-h-0 rounded-xs overflow-hidden shadow-xs">
                      {renderSlotPhoto(i, scaleFactor)}
                    </div>
                  ))}
                </div>
              )}

              {/* Border Overlay */}
              {renderPreviewShapeBorder(scaledBorderPx)}

              {/* Design Template Vector Decoration */}
              {activeTemplate &&
                renderDecorSvg(
                  activeTemplate.decor,
                  activeTemplate.accent,
                  'absolute inset-0 w-full h-full pointer-events-none z-25'
                )}

              {/* Live Text Items */}
              {textElements.map((t) => (
                <div
                  key={t.id}
                  style={{
                    position: 'absolute',
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: t.fontFamily,
                    fontSize: `${Math.max(9, t.fontSize * scaleFactor)}px`,
                    fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                    fontStyle: t.fontStyle || 'normal',
                    color: t.color,
                    textAlign: t.alignment || 'center',
                    whiteSpace: 'pre',
                    lineHeight: 1.2,
                    textShadow: '0 1px 3px rgba(0,0,0,0.45)'
                  }}
                  className="pointer-events-none z-30"
                >
                  {t.text}
                </div>
              ))}

              {/* Live Clipart Items */}
              {clipartElements.map((c) => (
                <div
                  key={c.id}
                  style={{
                    position: 'absolute',
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: `translate(-50%, -50%) scale(${(c.scale || 1) * scaleFactor}) rotate(${c.rotation || 0}deg)`,
                    color: c.color
                  }}
                  className="pointer-events-none z-30"
                  dangerouslySetInnerHTML={{
                    __html: `<svg viewBox="${c.viewBox || '0 0 24 24'}" width="${Math.round(40 * scaleFactor)}" height="${Math.round(40 * scaleFactor)}" fill="currentColor">${c.svgPath}</svg>`
                  }}
                />
              ))}
            </div>
          );
        };

        // ===================================================================
        // MODE 1: ROOM VIEW (Shared AcrylicRoomViewModal Component)
        // ===================================================================
        if (viewerMode === 'room') {
          if (!productCapabilities.roomView) return null;
          const collageLayout = isCollageProduct ? getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id) : null;
          const wallLayout = isWallArtProduct ? getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id) : null;
          const splitLayout = isSplitProduct ? getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id) : null;
          const mosaicLayout = isMosaicProduct ? activeMosaicLayout : null;
          const hexagonLayout = isHexagonProduct ? getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id) : null;

          const activeMultiLayout = collageLayout || wallLayout || splitLayout || mosaicLayout || hexagonLayout;
          const canvasRoomWidthInches = activeMultiLayout ? activeMultiLayout.overallWidthInches : geom.widthInches;
          const canvasRoomHeightInches = activeMultiLayout ? activeMultiLayout.overallHeightInches : geom.heightInches;

          const thicknessOption = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[0];
          const wrapDepthPx = (thicknessOption as any)?.depthPx || 26;

          return (
            <AcrylicRoomViewModal
              isOpen={true}
              onClose={() => setViewerMode(null)}
              productDimensionLabel={
                isWordArtProduct
                  ? `${wordArtSizeOption.widthInches}" × ${wordArtSizeOption.heightInches}"`
                  : isBannerProduct
                  ? `${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}`
                  : activeMultiLayout
                  ? (activeMultiLayout.dimensionsSummary || `${activeMultiLayout.overallWidthInches}" × ${activeMultiLayout.overallHeightInches}"`)
                  : isCustomSize && canUseCustomSize
                  ? `${customWidth}" × ${customHeight}"`
                  : currentSizeOption.dimensionsSummary
              }
              productId={selectedProductTypeId}
              productName={
                isPopArtProduct
                  ? `Pop Art (${selectedPopStyle?.name || 'Pop Art'})`
                  : isLyricProduct
                  ? `${activeMaterial === 'acrylic' ? 'Lyric on Acrylic' : 'Lyric on Canvas'} (${selectedLyricTemplate.name})`
                  : selectedProductType.name
              }
              shapeId={
                isHexagonProduct
                  ? (isHexagonCluster ? 'shape-rectangle' : 'shape-hexagon')
                  : isMosaicProduct
                  ? (activeMosaicLayout.shapeId || (activeMosaicLayout.aspectRatio === 1 ? 'shape-square' : (activeMosaicLayout.aspectRatio > 1 ? 'shape-landscape' : 'shape-portrait')))
                  : (shapeApplies
                      ? (['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(selectedShapeId)
                          ? (canvasRoomWidthInches === canvasRoomHeightInches ? 'shape-square' : (canvasRoomWidthInches > canvasRoomHeightInches ? 'shape-landscape' : 'shape-portrait'))
                          : selectedShapeId)
                      : (canvasRoomWidthInches === canvasRoomHeightInches ? 'shape-square' : (canvasRoomWidthInches > canvasRoomHeightInches ? 'shape-landscape' : 'shape-portrait')))
              }
              shapeName={
                isWordArtProduct
                  ? (wordArtSizeOption.ratioTab || (wordArtSizeOption.widthInches === wordArtSizeOption.heightInches ? 'Square' : 'Rectangle'))
                  : isCollageProduct
                  ? (collageLayout?.name || 'Photo Collage')
                  : isWallArtProduct
                  ? (wallLayout?.name || 'Wall Display')
                  : isSplitProduct
                  ? (splitLayout?.name || `${splitLayout?.panels.length || 3} Panel Split`)
                  : isMosaicProduct
                  ? (mosaicLayout?.name || 'Photo Mosaic')
                  : isHexagonProduct
                  ? (hexagonLayout?.name || 'Hexagon Prints')
                  : (shapeApplies
                      ? (['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(selectedShapeId)
                          ? (canvasRoomWidthInches === canvasRoomHeightInches ? 'Square' : (canvasRoomWidthInches > canvasRoomHeightInches ? 'Landscape' : 'Portrait'))
                          : currentShape.name)
                      : `${panels.length} Panels`)
              }
              widthInches={isWordArtProduct ? wordArtSizeOption.widthInches : isBannerProduct ? bannerConfig.widthInches : canvasRoomWidthInches}
              heightInches={isWordArtProduct ? wordArtSizeOption.heightInches : isBannerProduct ? bannerConfig.heightInches : canvasRoomHeightInches}
              initialRoomState={roomViewState}
              onRoomStateChange={setRoomViewState}
              renderProduct={(_isRoomView, productPixelSize) => {
                const roomProductWidth = productPixelSize?.width || 240;

                // 1. Hexagon Prints on Room Wall
                if (isHexagonProduct) {
                  const hexLayout = hexagonLayout || getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const roomScale = (productPixelSize?.width || 240) / Math.max(1, workspaceBoxSize.width || 420);
                  return (
                    <div className="relative w-full h-full pointer-events-none select-none">
                      {hexLayout.panels.map((pSpec, idx) => {
                        const p = panelImages[idx];
                        const url = (!isWordArtProduct && isWordArtArtwork(p?.imageUrl)) ? null : (p?.imageUrl || null);
                        const scaledPanX = (p?.panX || 0) * roomScale;
                        const scaledPanY = (p?.panY || 0) * roomScale;
                        const isVertical = pSpec.orientation === 'vertical' || hexLayout.orientation === 'vertical';
                        const hexClip = isVertical ? HEXAGON_VERTICAL_CLIP_PATH : HEXAGON_HORIZONTAL_CLIP_PATH;

                        const imgMeta = p?.uploadedImage;
                        const natWidth = imgMeta?.width || 1200;
                        const natHeight = imgMeta?.height || 800;
                        const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                        const slotAspect = isVertical ? 8.5 / 10 : 10 / 8.5;
                        const isWiderThanSlot = imgAspect >= slotAspect;

                        return (
                          <div
                            key={pSpec.id || idx}
                            style={{
                              position: 'absolute',
                              left: `${pSpec.x * 100}%`,
                              top: `${pSpec.y * 100}%`,
                              width: `${pSpec.w * 100}%`,
                              height: `${pSpec.h * 100}%`,
                              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.22))'
                            }}
                          >
                            <div
                              className="w-full h-full relative overflow-hidden bg-white"
                              style={{
                                clipPath: hexClip,
                                WebkitClipPath: hexClip
                              }}
                            >
                              {url ? (
                                <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                                  <img
                                    src={url}
                                    alt=""
                                    draggable={false}
                                    style={{
                                      width: isWiderThanSlot ? 'auto' : '100%',
                                      height: isWiderThanSlot ? '100%' : 'auto',
                                      minWidth: '100%',
                                      minHeight: '100%',
                                      maxWidth: 'none',
                                      maxHeight: 'none',
                                      flexShrink: 0,
                                      aspectRatio: `${natWidth} / ${natHeight}`,
                                      objectFit: 'cover',
                                      objectPosition: 'center center',
                                      transform: `translate(${scaledPanX}px, ${scaledPanY}px) scale(${p?.scale || 1}) rotate(${p?.rotation || 0}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                      transformOrigin: 'center center',
                                      filter: getFilterCss(p?.filter || 'original')
                                    }}
                                    className="pointer-events-none select-none max-w-none"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">
                                  {pSpec.label || `Hexagon ${idx + 1}`}
                                </div>
                              )}
                              {selectedBorderWidthId !== 'none' && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <polygon
                                    points={isVertical ? "50,0 100,25 100,75 50,100 0,75 0,25" : "25,0 75,0 100,50 75,100 25,100 0,50"}
                                    fill="none"
                                    stroke={selectedBorderColor}
                                    strokeWidth={selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? "3" : selectedBorderWidthId === 'medium' ? "6" : "9"}
                                    vectorEffect="non-scaling-stroke"
                                  />
                                </svg>
                              )}
                              {textElements
                                .filter((t) => getSlotIndex(t) === idx && Boolean(t.text && t.text.trim()))
                                .map((t) => (
                                  <div
                                    key={t.id}
                                    style={{
                                      position: 'absolute',
                                      left: `${t.x}%`,
                                      top: `${t.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: t.fontFamily,
                                      fontSize: `${Math.max(6, Math.round(t.fontSize * (pSpec.w || 0.3) * 0.4))}px`,
                                      fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                                      fontStyle: t.fontStyle || 'normal',
                                      color: t.color,
                                      textAlign: t.alignment || 'center',
                                      whiteSpace: 'pre',
                                      lineHeight: 1.2,
                                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                      pointerEvents: 'none',
                                      zIndex: 25
                                    }}
                                  >
                                    {t.text}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // 1b. Wall Display on Room Wall
                if (isWallArtProduct) {
                  const layoutDef = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const wallPanels = layoutDef.panels;
                  const roomScale = (productPixelSize?.width || 240) / Math.max(1, workspaceBoxSize.width || 420);
                  return (
                    <div className="relative w-full h-full pointer-events-none select-none">
                      {wallPanels.map((pos, idx) => {
                        const p = panelImages[idx];
                        const url = (!isWordArtProduct && isWordArtArtwork(p?.imageUrl)) ? null : (p?.imageUrl || null);
                        const scaledPanX = (p?.panX || 0) * roomScale;
                        const scaledPanY = (p?.panY || 0) * roomScale;

                        const imgMeta = p?.uploadedImage;
                        const natWidth = imgMeta?.width || 1200;
                        const natHeight = imgMeta?.height || 800;
                        const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                        const slotAspect = (pos.w * layoutDef.aspectRatio) / Math.max(0.001, pos.h);
                        const isWiderThanSlot = imgAspect >= slotAspect;

                        return (
                          <div
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: `${pos.x * 100}%`,
                              top: `${pos.y * 100}%`,
                              width: `${pos.w * 100}%`,
                              height: `${pos.h * 100}%`,
                              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.22))'
                            }}
                          >
                            <div className="w-full h-full relative overflow-hidden bg-white rounded-xs">
                              {url ? (
                                <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                                  <img
                                    src={url}
                                    alt=""
                                    draggable={false}
                                    style={{
                                      width: isWiderThanSlot ? 'auto' : '100%',
                                      height: isWiderThanSlot ? '100%' : 'auto',
                                      minWidth: '100%',
                                      minHeight: '100%',
                                      maxWidth: 'none',
                                      maxHeight: 'none',
                                      flexShrink: 0,
                                      aspectRatio: `${natWidth} / ${natHeight}`,
                                      objectFit: 'cover',
                                      objectPosition: 'center center',
                                      transform: `translate(${scaledPanX}px, ${scaledPanY}px) scale(${p?.scale || 1}) rotate(${p?.rotation || 0}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                      transformOrigin: 'center center',
                                      filter: getFilterCss(p?.filter || 'original')
                                    }}
                                    className="pointer-events-none select-none max-w-none"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">
                                  {pos.label || `Panel ${idx + 1}`}
                                </div>
                              )}
                              {selectedBorderWidthId !== 'none' && (
                                <div
                                  className="absolute inset-0 pointer-events-none z-20"
                                  style={{
                                    border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 3 : selectedBorderWidthId === 'medium' ? 6 : 9}px solid ${selectedBorderColor}`
                                  }}
                                />
                              )}
                              {activeMaterial === 'acrylic' && (
                                <div
                                  className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"
                                  style={{ mixBlendMode: 'screen' }}
                                />
                              )}
                              {textElements
                                .filter((t) => getSlotIndex(t) === idx && Boolean(t.text && t.text.trim()))
                                .map((t) => (
                                  <div
                                    key={t.id}
                                    style={{
                                      position: 'absolute',
                                      left: `${t.x}%`,
                                      top: `${t.y}%`,
                                      transform: 'translate(-50%, -50%)',
                                      fontFamily: t.fontFamily,
                                      fontSize: `${Math.max(6, Math.round(t.fontSize * (pos.w || 0.3) * 0.4))}px`,
                                      fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                                      fontStyle: t.fontStyle || 'normal',
                                      color: t.color,
                                      textAlign: t.alignment || 'center',
                                      whiteSpace: 'pre',
                                      lineHeight: 1.2,
                                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                      pointerEvents: 'none',
                                      zIndex: 25
                                    }}
                                  >
                                    {t.text}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // 2. Photo Mosaic on Room Wall
                if (isMosaicProduct) {
                  const layoutDef = activeMosaicLayout;
                  const count = layoutDef.panelsCount || layoutDef.panels.length;
                  const totalCols = layoutDef.cols || (count === 16 ? 4 : count === 25 ? 5 : count === 36 ? 6 : count === 20 ? 4 : count === 15 ? 3 : count === 12 && layoutDef.aspectRatio > 1 ? 4 : 3);
                  const totalRows = layoutDef.rows || Math.ceil(count / totalCols);
                  const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
                  const master = panelImages[0] || createDefaultPanel();
                  const roomScale = (productPixelSize?.width || 240) / Math.max(1, workspaceBoxSize.width || 420);
                  const scaledPanX = (master.panX || 0) * roomScale;
                  const scaledPanY = (master.panY || 0) * roomScale;

                  return (
                    <div
                      className="relative w-full h-full pointer-events-none select-none flex items-center justify-center"
                      style={{
                        filter: activeMaterial === 'acrylic'
                          ? 'drop-shadow(0 16px 28px rgba(0,0,0,0.42)) drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
                          : 'drop-shadow(0 14px 24px rgba(0,0,0,0.36)) drop-shadow(0 3px 6px rgba(0,0,0,0.22))'
                      }}
                    >
                      <div
                        className={`relative w-full h-full overflow-hidden ${
                          activeMaterial === 'acrylic'
                            ? 'rounded-xs bg-[#10141a] ring-1 ring-white/20'
                            : 'rounded-xs bg-white'
                        }`}
                        style={
                          activeMaterial === 'acrylic'
                            ? {
                                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 1px 2px rgba(255,255,255,0.6)'
                              }
                            : undefined
                        }
                      >
                        {masterImage ? (
                          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                            {layoutDef.panels.map((p, idx) => {
                              const imgMeta = master?.uploadedImage;
                              const natWidth = imgMeta?.width || 1200;
                              const natHeight = imgMeta?.height || 800;
                              const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                              const mosaicAspect = layoutDef.aspectRatio || 1;
                              const isWiderThanMosaic = imgAspect >= mosaicAspect;

                              return (
                                <div
                                  key={p.id || idx}
                                  style={{
                                    position: 'absolute',
                                    left: `${p.x * 100}%`,
                                    top: `${p.y * 100}%`,
                                    width: `${p.w * 100}%`,
                                    height: `${p.h * 100}%`
                                  }}
                                  className="relative overflow-hidden rounded-[1px] bg-stone-100 flex items-center justify-center border border-stone-200/40"
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      width: `${(1 / p.w) * 100}%`,
                                      height: `${(1 / p.h) * 100}%`,
                                      left: `${-(p.x / p.w) * 100}%`,
                                      top: `${-(p.y / p.h) * 100}%`
                                    }}
                                    className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                                  >
                                    <img
                                      src={masterImage}
                                      alt="Photo Mosaic"
                                      style={{
                                        width: isWiderThanMosaic ? 'auto' : '100%',
                                        height: isWiderThanMosaic ? '100%' : 'auto',
                                        minWidth: '100%',
                                        minHeight: '100%',
                                        maxWidth: 'none',
                                        maxHeight: 'none',
                                        flexShrink: 0,
                                        aspectRatio: `${natWidth} / ${natHeight}`,
                                        objectFit: 'cover',
                                        objectPosition: 'center center',
                                        transform: `translate(${scaledPanX}px, ${scaledPanY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                        transformOrigin: 'center center',
                                        filter: getFilterCss(master.filter)
                                      }}
                                      className="pointer-events-none select-none max-w-none"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            {/* Subtle physical cotton canvas weave micro-texture for Canvas only */}
                            {activeMaterial === 'canvas' && (
                              <div
                                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                                }}
                              />
                            )}
                            {/* Acrylic optical crystal surface gloss reflection & standoffs */}
                            {activeMaterial === 'acrylic' && (
                              <>
                                <div
                                  className="absolute inset-0 pointer-events-none z-15"
                                  style={{
                                    background:
                                      'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.18) 100%)'
                                  }}
                                />
                                <div className="absolute inset-0 pointer-events-none z-15 rounded-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.25)]" />
                                {(selectedHardwareId === 'standoff-mounts' || selectedHardwareId === 'display-standoff') && (
                                  <>
                                    <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-300/80 z-20 pointer-events-none" />
                                  </>
                                )}
                              </>
                            )}
                            {layoutDef.panels.map((p, idx) => {
                              const cellTexts = textElements.filter(
                                (t) => getSlotIndex(t) === idx && Boolean(t.text && t.text.trim())
                              );
                              if (cellTexts.length === 0) return null;
                              return (
                                <div
                                  key={`rm-t-${idx}`}
                                  style={{
                                    position: 'absolute',
                                    left: `${p.x * 100}%`,
                                    top: `${p.y * 100}%`,
                                    width: `${p.w * 100}%`,
                                    height: `${p.h * 100}%`,
                                    overflow: 'hidden',
                                    pointerEvents: 'none',
                                    zIndex: 25
                                  }}
                                >
                                  {cellTexts.map((t) => (
                                    <div
                                      key={t.id}
                                      style={{
                                        position: 'absolute',
                                        left: `${t.x}%`,
                                        top: `${t.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontFamily: t.fontFamily,
                                        fontSize: `${Math.max(5, Math.round(t.fontSize * (p.w || 0.25) * 0.35))}px`,
                                        fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                                        fontStyle: t.fontStyle || 'normal',
                                        color: t.color,
                                        textAlign: t.alignment || 'center',
                                        whiteSpace: 'pre',
                                        lineHeight: 1.2,
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                      }}
                                    >
                                      {t.text}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="w-full h-full relative flex items-center justify-center bg-[#dcdfe4]">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                              {Array.from({ length: totalCols - 1 }).map((_, c) => {
                                const xPct = ((c + 1) / totalCols) * 100;
                                return (
                                  <line
                                    key={`emv-room-${c}`}
                                    x1={`${xPct}%`}
                                    y1="0"
                                    x2={`${xPct}%`}
                                    y2="100%"
                                    stroke="rgba(0, 0, 0, 0.2)"
                                    strokeWidth="1.5"
                                  />
                                );
                              })}
                              {Array.from({ length: totalRows - 1 }).map((_, r) => {
                                const yPct = ((r + 1) / totalRows) * 100;
                                return (
                                  <line
                                    key={`emh-room-${r}`}
                                    x1="0"
                                    y1={`${yPct}%`}
                                    x2="100%"
                                    y2={`${yPct}%`}
                                    stroke="rgba(0, 0, 0, 0.2)"
                                    strokeWidth="1.5"
                                  />
                                );
                              })}
                            </svg>
                            <span className="text-[10px] font-bold text-stone-500">
                              {layoutDef.name} ({count} Tiles)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // 3. Split Canvas & Acrylic on Room Wall
                if (isSplitProduct) {
                  const layoutDef = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const splitPanels = layoutDef.panels;
                  const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
                  const master = panelImages[0] || createDefaultPanel();

                  const displayWidthInches = layoutDef.overallWidthInches || 36;
                  const displayHeightInches = layoutDef.overallHeightInches || 24;
                  const imgMeta = master?.uploadedImage;
                  const natWidth = imgMeta?.width || 1200;
                  const natHeight = imgMeta?.height || 800;
                  const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                  const layoutAspect = layoutDef.aspectRatio || (displayWidthInches / Math.max(1, displayHeightInches));
                  const isWiderThanLayout = imgAspect >= layoutAspect;

                  const roomScale = (productPixelSize?.width || 240) / Math.max(1, workspaceBoxSize.width || 420);
                  const scaledPanX = (master.panX || 0) * roomScale;
                  const scaledPanY = (master.panY || 0) * roomScale;

                  return (
                    <div className="relative w-full h-full pointer-events-none select-none">
                      {splitPanels.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          style={{
                            position: 'absolute',
                            left: `${p.x * 100}%`,
                            top: `${p.y * 100}%`,
                            width: `${p.w * 100}%`,
                            height: `${p.h * 100}%`,
                            filter: activeMaterial === 'acrylic'
                              ? 'drop-shadow(0 12px 22px rgba(0,0,0,0.38)) drop-shadow(0 3px 6px rgba(0,0,0,0.22))'
                              : 'drop-shadow(0 10px 18px rgba(0,0,0,0.35)) drop-shadow(0 2px 4px rgba(0,0,0,0.22))'
                          }}
                        >
                          <div
                            className={`w-full h-full relative overflow-hidden ${
                              activeMaterial === 'acrylic'
                                ? 'rounded-[1px] bg-[#10141a]'
                                : 'rounded-[1px] bg-white'
                            }`}
                            style={
                              activeMaterial === 'acrylic'
                                ? {
                                    boxShadow: '0 10px 20px -3px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'
                                  }
                                : undefined
                            }
                          >
                            {masterImage ? (
                              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                                <div
                                  style={{
                                    position: 'absolute',
                                    width: `${(1 / p.w) * 100}%`,
                                    height: `${(1 / p.h) * 100}%`,
                                    left: `${-(p.x / p.w) * 100}%`,
                                    top: `${-(p.y / p.h) * 100}%`
                                  }}
                                  className="pointer-events-none select-none flex items-center justify-center overflow-visible"
                                >
                                  <img
                                    src={masterImage}
                                    alt={`Split Panel ${idx + 1}`}
                                    draggable={false}
                                    style={{
                                      width: isWiderThanLayout ? 'auto' : '100%',
                                      height: isWiderThanLayout ? '100%' : 'auto',
                                      minWidth: '100%',
                                      minHeight: '100%',
                                      maxWidth: 'none',
                                      maxHeight: 'none',
                                      flexShrink: 0,
                                      aspectRatio: `${natWidth} / ${natHeight}`,
                                      objectFit: 'cover',
                                      objectPosition: 'center center',
                                      transform: `translate(${scaledPanX}px, ${scaledPanY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                      transformOrigin: 'center center',
                                      filter: getFilterCss(master.filter)
                                    }}
                                    className="pointer-events-none select-none max-w-none"
                                  />
                                  {/* Subtle canvas weave micro-texture for canvas only */}
                                  {activeMaterial !== 'acrylic' && (
                                    <div
                                      className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                                      style={{
                                        backgroundImage:
                                          'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                                      }}
                                    />
                                  )}
                                  {/* Optical crystal depth reflection for acrylic */}
                                  {activeMaterial === 'acrylic' && (
                                    <div
                                      className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"
                                      style={{ mixBlendMode: 'screen' }}
                                    />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">
                                {p.label || `Panel ${idx + 1}`}
                              </div>
                            )}
                            {/* Border overlay for split panel in room view */}
                            {selectedBorderWidthId !== 'none' && (
                              <div
                                className="absolute inset-0 pointer-events-none z-20"
                                style={{
                                  border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 3 : selectedBorderWidthId === 'medium' ? 6 : 9}px solid ${selectedBorderColor}`
                                }}
                              />
                            )}
                            {textElements
                              .filter((t) => getSlotIndex(t) === idx && Boolean(t.text && t.text.trim()))
                              .map((t) => (
                                <div
                                  key={t.id}
                                  style={{
                                    position: 'absolute',
                                    left: `${t.x}%`,
                                    top: `${t.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    fontFamily: t.fontFamily,
                                    fontSize: `${Math.max(6, Math.round(t.fontSize * (p.w || 0.3) * 0.4))}px`,
                                    fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                                    fontStyle: t.fontStyle || 'normal',
                                    color: t.color,
                                    textAlign: t.alignment || 'center',
                                    whiteSpace: 'pre',
                                    lineHeight: 1.2,
                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                    pointerEvents: 'none',
                                    zIndex: 25
                                  }}
                                >
                                  {t.text}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                // 3b. Photo Collage on Room Wall
                if (isCollageProduct) {
                  const collageDef = getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id);
                  const roomScale = (productPixelSize?.width || 240) / Math.max(1, workspaceBoxSize.width || 420);
                  const collageRoomContent = (
                    <div className="relative w-full h-full rounded-xs bg-[#d8dce2] shadow-sm overflow-hidden">
                      <div className="relative w-full h-full overflow-hidden">
                        {collageDef.panels.map((pSpec, idx) => {
                          const p = panelImages[idx];
                          const url = (!isWordArtProduct && isWordArtArtwork(p?.imageUrl)) ? null : (p?.imageUrl || null);
                          const scaledPanX = (p?.panX || 0) * roomScale;
                          const scaledPanY = (p?.panY || 0) * roomScale;

                          const imgMeta = p?.uploadedImage;
                          const natWidth = imgMeta?.width || 1200;
                          const natHeight = imgMeta?.height || 800;
                          const imgAspect = imgMeta?.aspectRatio || (natWidth / Math.max(1, natHeight));
                          const slotAspect = (pSpec.w * collageDef.aspectRatio) / Math.max(0.001, pSpec.h);
                          const isWiderThanSlot = imgAspect >= slotAspect;

                          return (
                            <div
                              key={pSpec.id || idx}
                              style={{
                                position: 'absolute',
                                left: `${pSpec.x * 100}%`,
                                top: `${pSpec.y * 100}%`,
                                width: `${pSpec.w * 100}%`,
                                height: `${pSpec.h * 100}%`,
                                padding: '4px',
                                boxSizing: 'border-box'
                              }}
                            >
                              <div className="w-full h-full rounded-xs overflow-hidden bg-stone-200 flex items-center justify-center relative">
                                {url ? (
                                  <div className="w-full h-full overflow-hidden relative flex items-center justify-center pointer-events-none select-none">
                                    <img
                                      src={url}
                                      alt={`Slot ${idx + 1}`}
                                      draggable={false}
                                      style={{
                                        width: isWiderThanSlot ? 'auto' : '100%',
                                        height: isWiderThanSlot ? '100%' : 'auto',
                                        minWidth: '100%',
                                        minHeight: '100%',
                                        maxWidth: 'none',
                                        maxHeight: 'none',
                                        flexShrink: 0,
                                        aspectRatio: `${natWidth} / ${natHeight}`,
                                        objectFit: 'cover',
                                        objectPosition: 'center center',
                                        transform: `translate(${scaledPanX}px, ${scaledPanY}px) scale(${p?.scale || 1}) rotate(${p?.rotation || 0}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                        transformOrigin: 'center center',
                                        filter: getFilterCss(p?.filter || 'original')
                                      }}
                                      className="pointer-events-none select-none max-w-none"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-[10px] font-bold pointer-events-none select-none">
                                    {pSpec.label || `Slot ${idx + 1}`}
                                  </div>
                                )}
                                {textElements
                                  .filter((t) => getSlotIndex(t) === idx && Boolean(t.text && t.text.trim()))
                                  .map((t) => (
                                    <div
                                      key={t.id}
                                      style={{
                                        position: 'absolute',
                                        left: `${t.x}%`,
                                        top: `${t.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        fontFamily: t.fontFamily,
                                        fontSize: `${Math.max(6, Math.round(t.fontSize * (pSpec.w || 0.3) * 0.4))}px`,
                                        fontWeight: t.fontWeight === 'bold' ? 700 : 400,
                                        fontStyle: t.fontStyle || 'normal',
                                        color: t.color,
                                        textAlign: t.alignment || 'center',
                                        whiteSpace: 'pre',
                                        lineHeight: 1.2,
                                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                        pointerEvents: 'none',
                                        zIndex: 25
                                      }}
                                    >
                                      {t.text}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {selectedBorderWidthId !== 'none' && (
                        <div
                          className="absolute inset-0 pointer-events-none z-25 rounded-xs"
                          style={{
                            border: `${selectedBorderWidthId === 'thin' || selectedBorderWidthId === 'custom-color' ? 3 : selectedBorderWidthId === 'medium' ? 6 : 9}px solid ${selectedBorderColor}`
                          }}
                        />
                      )}
                      {activeMaterial === 'acrylic' && (
                        <div
                          className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"
                          style={{ mixBlendMode: 'screen' }}
                        />
                      )}
                    </div>
                  );

                  return (
                    <div
                      className="relative w-full h-full pointer-events-none select-none flex items-center justify-center"
                      style={{
                        filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.36)) drop-shadow(0 3px 6px rgba(0,0,0,0.22))'
                      }}
                    >
                      {hasOuterFrame
                        ? renderFloatingFrameContainer(collageRoomContent, {
                            frameId: selectedFrameId,
                            scale: 0.65,
                            displayWidthInches: collageDef.overallWidthInches || 16,
                            displayHeightInches: collageDef.overallHeightInches || 16,
                            aspectRatio: collageDef.aspectRatio,
                            isMultiPanel: true
                          })
                        : collageRoomContent}
                    </div>
                  );
                }

                // 4. Single Non-Rectangular or Rectangular Canvas & Acrylic on Room Wall
                const clipStyle = shapeApplies && currentShape.shapeType === 'custom'
                  ? currentShape.clipPathStyle
                  : isHexagonProduct ? HEXAGON_CLIP_PATH : (isRectangularShape ? undefined : (geom.clipPath || (shapeApplies ? currentShape.clipPathStyle : undefined)));
                const hasClip = Boolean(clipStyle);
                const showPhysicalEdges = Boolean(productCapabilities.showPhysicalEdges);

                const singleCanvasContent = (
                  <div
                    className={`relative w-full h-full overflow-hidden bg-white pointer-events-none select-none ${
                      !hasClip ? (shapeApplies ? currentShape.borderRadiusClass : 'rounded-xs') : ''
                    }`}
                    style={{
                      clipPath: clipStyle,
                      WebkitClipPath: clipStyle,
                      boxShadow: !hasClip && !hasOuterFrame
                        ? (activeMaterial === 'acrylic'
                            ? '0 16px 32px rgba(0,0,0,0.28), 0 3px 8px rgba(0,0,0,0.18)'
                            : showPhysicalEdges
                            ? '4px 14px 28px -2px rgba(15, 23, 42, 0.44), 1px 4px 8px -1px rgba(15, 23, 42, 0.30)'
                            : '0 12px 24px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)')
                        : undefined
                    }}
                  >
                    {renderCanvasFrontDesign(roomProductWidth)}

                    {/* Acrylic-specific realistic styling in Room View: glossy reflection + standoffs */}
                    {activeMaterial === 'acrylic' && (
                      <>
                        {/* 4 corner metallic standoff mounts when standoff mounting is selected */}
                        {(selectedHardwareId === 'standoff-mounts' || selectedHardwareId === 'display-standoff') && !hasClip && (
                          <>
                            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-stone-700/60" />
                            </div>
                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-stone-700/60" />
                            </div>
                            <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-stone-700/60" />
                            </div>
                            <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-600 shadow-md border border-stone-400/80 z-30 pointer-events-none flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-stone-700/60" />
                            </div>
                          </>
                        )}
                        {/* Crystal optical acrylic glass gloss sheen */}
                        <div
                          className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"
                          style={{ mixBlendMode: 'screen' }}
                        />
                      </>
                    )}
                  </div>
                );

                return (
                  <div
                    className="relative w-full h-full pointer-events-none select-none flex items-center justify-center"
                    style={{
                      filter: hasClip
                        ? 'drop-shadow(0 14px 22px rgba(0,0,0,0.36)) drop-shadow(0 3px 6px rgba(0,0,0,0.22))'
                        : undefined
                    }}
                  >
                    {hasOuterFrame
                      ? renderFloatingFrameContainer(singleCanvasContent, {
                          frameId: selectedFrameId,
                          scale: 0.65,
                          displayWidthInches: geom.widthInches,
                          displayHeightInches: geom.heightInches,
                          aspectRatio: previewAspect
                        })
                      : singleCanvasContent}
                  </div>
                );
              }}
            />
          );
        }

        // ===================================================================
        // MODE 2 & 3: PHYSICAL 3D VIEW & 360° PRODUCT VIEW
        // ===================================================================
        if (viewerMode === '3d' && !productCapabilities.view3D) return null;
        if (viewerMode === '360' && !productCapabilities.view360) return null;

        return (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in"
            onClick={() => setViewerMode(null)}
          >
            <div
              className={`bg-white rounded-2xl w-full ${viewerMode === '3d' ? 'max-w-4xl' : 'max-w-3xl'} shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[94vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Informational Banner across top matching screenshots */}
              <div className="bg-[#FEF9C3] border-b border-amber-200/90 px-4 py-2 text-center text-xs font-semibold text-amber-900 tracking-wide select-none shrink-0">
                NOTE : Preview shown is for illustration purpose only may differ from the actual product
              </div>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-200 bg-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    {viewerMode === '3d' && (
                      <>
                        <Box className="w-4 h-4 text-[#0E4A93]" />
                        <span>3D View</span>
                      </>
                    )}
                    {viewerMode === '360' && (
                      <>
                        <RotateCw className="w-4 h-4 text-[#0E4A93]" />
                        <span>360&deg; View</span>
                      </>
                    )}
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    <span>{isPopArtProduct ? `Pop Art (${selectedPopStyle?.name || 'Pop Art'})` : isLyricProduct ? `${activeMaterial === 'acrylic' ? 'Lyric on Acrylic' : 'Lyric on Canvas'} (${selectedLyricTemplate.name})` : selectedProductType.name}</span>
                    <span>•</span>
                    <span>
                      {isWordArtProduct
                        ? (wordArtSizeOption.ratioTab || (wordArtSizeOption.widthInches === wordArtSizeOption.heightInches ? 'Square' : 'Rectangle'))
                        : isBannerProduct
                        ? 'Flat Banner'
                        : isCollageProduct
                        ? `${getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).name}`
                        : isMosaicProduct
                        ? `${activeMosaicLayout.name}`
                        : isSplitProduct
                        ? `${getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).name}`
                        : isWallArtProduct
                        ? `${getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).name}`
                        : isHexagonProduct
                        ? `${getProductLayout('canvas-hexagon', selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).name}`
                        : shapeApplies ? currentShape.name : `${panels.length} Panels`}
                    </span>
                    <span>•</span>
                    <span>
                      {isWordArtProduct
                        ? `${wordArtSizeOption.widthInches}" × ${wordArtSizeOption.heightInches}"`
                        : isBannerProduct
                        ? `${formatDimension(bannerConfig.widthInches, bannerConfig.unit)} × ${formatDimension(bannerConfig.heightInches, bannerConfig.unit)}`
                        : isCollageProduct
                        ? (getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).dimensionsSummary)
                        : isMosaicProduct
                        ? (activeMosaicLayout.dimensionsSummary)
                        : isSplitProduct || isWallArtProduct
                        ? (getProductLayout(selectedProductTypeId, selectedLayoutId || currentSizeOption.diagramType || currentSizeOption.id).dimensionsSummary)
                        : isCustomSize && canUseCustomSize
                        ? `${customWidth}" × ${customHeight}"`
                        : currentSizeOption.dimensionsSummary}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewerMode(null)}
                  aria-label="Close preview"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {(viewerMode === '3d' || viewerMode === '360') && (() => {
                const is360 = viewerMode === '360';
                const currentPreset = PRESET_3D_ANGLES.find((p) => p.id === preset3DAngle) || PRESET_3D_ANGLES[0];
                const activeRotY = is360 ? viewerRotation : currentPreset.rotY;
                const activeTiltX = is360 ? viewerTiltX : currentPreset.tiltX;

                // Physical thickness based on selected Canvas thickness option & frame (ONLY for 7 edge products)
                const showPhysicalEdges = Boolean(productCapabilities.showPhysicalEdges);
                const thicknessOption = (activeMaterial === 'acrylic' ? ACRYLIC_THICKNESS_OPTIONS : THICKNESS_OPTIONS).find((t: any) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[0];
                const baseDepthPx = showPhysicalEdges
                  ? (selectedThicknessId === 'canvas-lite' ? 14 : selectedThicknessId === 'thin-gallery' ? 20 : selectedThicknessId === 'thick-gallery' ? 34 : selectedThicknessId === 'custom-thickness' ? Math.round((effectiveThicknessInches * 20) / 0.75) : ((thicknessOption as any)?.depthPx || 20))
                  : 0;
                const depthPx = showPhysicalEdges ? (hasOuterFrame ? Math.max(baseDepthPx, 34) : baseDepthPx) : 0;

                // Maintain exact product aspect ratio without stretching
                const maxBoxW = is360 ? 320 : 340;
                const maxBoxH = is360 ? 300 : 320;
                let cardW = maxBoxW;
                let cardH = cardW / previewAspect;
                if (cardH > maxBoxH) {
                  cardH = maxBoxH;
                  cardW = cardH * previewAspect;
                }
                cardW = Math.round(Math.max(140, cardW));
                cardH = Math.round(Math.max(140, cardH));

                // Thumbnail dimensions for 3D View:
                const thumbBoxW = 68;
                const thumbBoxH = 56;
                let thumbW = thumbBoxW;
                let thumbH = thumbW / previewAspect;
                if (thumbH > thumbBoxH) {
                  thumbH = thumbBoxH;
                  thumbW = thumbH * previewAspect;
                }
                thumbW = Math.round(Math.max(36, thumbW));
                thumbH = Math.round(Math.max(36, thumbH));
                const thumbDepthPx = Math.max(7, Math.round(depthPx * (thumbW / cardW)));

                // Scaled image placement parameters for synchronized 3D and 360 edge wraps
                const viewerImgMeta = panelImages[0]?.uploadedImage;
                const viewerNatWidth = viewerImgMeta?.width || 1200;
                const viewerNatHeight = viewerImgMeta?.height || 800;
                const viewerImgAspect = viewerImgMeta?.aspectRatio || (viewerNatWidth / Math.max(1, viewerNatHeight));
                const viewerIsWiderThanFrame = viewerImgAspect >= previewAspect;

                const activePanel = panelImages[0] || createDefaultPanel();
                const scaleFactor = cardW / Math.max(1, workspaceBoxSize.width || 420);
                const viewerPanX = (activePanel.panX || 0) * scaleFactor;
                const viewerPanY = (activePanel.panY || 0) * scaleFactor;
                const viewerScale = activePanel.scale || 1;
                const viewerRot = activePanel.rotation || 0;
                const viewerFilter = activePanel.filter || 'original';

                const thumbScaleFactor = thumbW / Math.max(1, workspaceBoxSize.width || 420);
                const thumbPanX = (activePanel.panX || 0) * thumbScaleFactor;
                const thumbPanY = (activePanel.panY || 0) * thumbScaleFactor;

                // Normalized angle [0..360) and radians for dynamic lighting & shadow
                const normalizedAngle = ((activeRotY % 360) + 360) % 360;
                const angleRad = (normalizedAngle * Math.PI) / 180;
                const effectiveTiltX = activeTiltX;

                // Dynamic directional shading based on rotationY
                const frontCos = Math.cos(angleRad);
                const sideSin = Math.sin(angleRad);
                const frontBrightness = 0.92 + 0.1 * Math.max(0, frontCos);
                const backBrightness = 0.92 + 0.1 * Math.max(0, -frontCos);
                const rightWallBrightness = 0.78 + 0.18 * Math.max(0, -sideSin);
                const leftWallBrightness = 0.78 + 0.18 * Math.max(0, sideSin);

                // Side / thickness base color
                const sideBaseColor = hasOuterFrame && frameColor
                  ? frameColor
                  : (isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage)
                  ? quoteBgColor
                  : selectedBorderWidthId !== 'none'
                  ? selectedBorderColor
                  : selectedWrapId === 'white-border'
                  ? '#FFFFFF'
                  : selectedWrapId === 'black-border'
                  ? '#0F172A'
                  : selectedWrapId === 'no-wrap'
                  ? '#E2E8F0'
                  : '#d6cfc2';

                // Shape clip styles applied to individual 2D planes (never on preserve-3d parent)
                const shapeClipStyle: React.CSSProperties = activeClipPath
                  ? {
                      clipPath: activeClipPath,
                      WebkitClipPath: activeClipPath
                    }
                  : {};
                const shapeRadiusClass = shapeApplies
                  ? currentShape.borderRadiusClass
                  : isHexagonProduct
                  ? 'rounded-none'
                  : 'rounded-[2px]';

                // Volumetric extrusion slices between -depthPx/2 and +depthPx/2 so curved/non-rectangular
                // shapes have continuous solid 3D thickness (ONLY for the 7 edge products)
                const SLICE_COUNT = showPhysicalEdges ? 32 : 0;
                const depthSlices = showPhysicalEdges
                  ? Array.from({ length: SLICE_COUNT }, (_, idx) => {
                      const t = (idx + 0.5) / SLICE_COUNT; // 0..1 from back to front
                      const z = -depthPx / 2 + t * depthPx;
                      const isRearHalf = t < 0.22;
                      return { z, t, isRearHalf };
                    })
                  : [];

                // Safe interior span for internal perpendicular spine plates on non-rectangular shapes
                // (prevents any see-through gap at exact 90° / 270° edge-on angles)
                const spineCoverage =
                  currentShape.id === 'shape-heart' ||
                  currentShape.id === 'shape-triangle' ||
                  currentShape.id === 'shape-speech-bubble' ||
                  currentShape.id === 'shape-cloud'
                    ? 0.64
                    : isHexagonProduct ||
                      currentShape.id === 'shape-hexagon' ||
                      currentShape.id === 'shape-circle' ||
                      currentShape.id === 'shape-oval' ||
                      currentShape.id === 'shape-scalloped' ||
                      currentShape.id === 'shape-organic-blob'
                    ? 0.78
                    : 0.88;

                // Dynamic floor shadow width tracks the projected horizontal width of the rotating 3D canvas
                const projectedShadowWidth = Math.round(
                  cardW * Math.abs(frontCos) + depthPx * Math.abs(sideSin) + 36
                );

                return (
                  <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                    {/* 3D / 360 Interactive Studio Stage */}
                    <div
                      onPointerDown={is360 ? handleViewerPointerDown : undefined}
                      onPointerMove={is360 ? handleViewerPointerMove : undefined}
                      onPointerUp={is360 ? handleViewerPointerUp : undefined}
                      onPointerCancel={is360 ? handleViewerPointerUp : undefined}
                      onWheel={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{
                        perspective: '1250px',
                        touchAction: is360 ? 'none' : 'auto',
                        background:
                          'radial-gradient(circle at 50% 44%, #ffffff 0%, #f8fafc 58%, #e2e8f0 100%)'
                      }}
                      className={`relative flex-1 min-h-[380px] md:min-h-[460px] w-full flex items-center justify-center select-none overflow-hidden ${
                        is360 ? (isViewerDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                      }`}
                    >
                      {/* Top-Left Mode / Preset Badge */}
                      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none z-20">
                        <span className="bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs">
                          {is360
                            ? (normalizedAngle < 35 || normalizedAngle >= 325
                                ? (effectiveTiltX > 45 ? 'Bottom Edge' : effectiveTiltX < -45 ? 'Top Edge' : 'Front Face')
                                : normalizedAngle >= 35 && normalizedAngle < 75
                                ? '3/4 Front-Side Angle'
                                : normalizedAngle >= 75 && normalizedAngle < 115
                                ? 'Side Edge Profile'
                                : normalizedAngle >= 115 && normalizedAngle < 150
                                ? '3/4 Rear Angle'
                                : normalizedAngle >= 150 && normalizedAngle <= 210
                                ? 'Canvas Back & Hardware'
                                : normalizedAngle > 210 && normalizedAngle <= 245
                                ? '3/4 Rear Angle'
                                : normalizedAngle > 245 && normalizedAngle <= 285
                                ? 'Side Edge Profile'
                                : '3/4 Front-Side Angle')
                            : (PRESET_3D_ANGLES.find((p) => p.id === preset3DAngle)?.label || '3D View')}
                        </span>
                      </div>

                      {is360 && (
                        <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs tabular-nums pointer-events-none z-20">
                          {`${Math.round(normalizedAngle)}°`}
                        </div>
                      )}

                      {/* Dynamic 3D Floor Shadow */}
                      <div
                        style={{
                          width: `${Math.max(48, projectedShadowWidth)}px`,
                          height: '22px',
                          transform: 'translateY(172px)',
                          background:
                            'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.26) 0%, rgba(15, 23, 42, 0.10) 55%, transparent 80%)'
                        }}
                        className="absolute rounded-full blur-[5px] pointer-events-none transition-none"
                      />

                      {/* ===================================================== */}
                      {/* 3D PHYSICAL CANVAS OBJECT (Rotates as One Solid Unit) */}
                      {/* ===================================================== */}
                      <div
                        className="relative"
                        style={{
                          width: `${cardW}px`,
                          height: `${cardH}px`,
                          transformStyle: 'preserve-3d',
                          WebkitTransformStyle: 'preserve-3d',
                          transform: `rotateX(${effectiveTiltX}deg) rotateY(${activeRotY}deg)`,
                          transition: is360
                            ? (isViewerDragging || viewerAutoRotate ? 'none' : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)')
                            : 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                      >
                        {isHexagonCluster ? (
                          (() => {
                            const hexLayout = getHexagonClusterLayout(panels.length);
                            return (
                              <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}>
                                {hexLayout.map((pos, pIdx) => {
                                  const p = panelImages[pIdx];
                                  const panelImgUrl = p?.imageUrl || (pIdx === 0 ? primaryPhotoUrl : null);
                                  const panXPct = ((p?.panX || 0) / 420) * 100;
                                  const panYPct = ((p?.panY || 0) / 420) * 100;
                                  const pScale = p?.scale || 1;
                                  const pRot = p?.rotation || 0;
                                  const pFilter = p?.filter || 'original';

                                  return (
                                    <div
                                      key={`hex-3d-${pIdx}`}
                                      className="absolute"
                                      style={{
                                        left: `${pos.x * 100}%`,
                                        top: `${pos.y * 100}%`,
                                        width: `${pos.w * 100}%`,
                                        height: `${pos.h * 100}%`,
                                        transformStyle: 'preserve-3d',
                                        WebkitTransformStyle: 'preserve-3d'
                                      }}
                                    >
                                      {/* Slices for this hexagon panel (ONLY when showPhysicalEdges is true) */}
                                      {showPhysicalEdges &&
                                        depthSlices.map((slice, sIdx) => {
                                          const edgeShade = 0.66 + 0.14 * Math.sin(slice.t * Math.PI);
                                          return (
                                            <div
                                              key={`hex-${pIdx}-slice-${sIdx}`}
                                              className="absolute inset-0 pointer-events-none"
                                              style={{
                                                transform: `translateZ(${slice.z.toFixed(2)}px)`
                                              }}
                                            >
                                              <div
                                                className="w-full h-full overflow-hidden"
                                                style={{
                                                  clipPath: HEXAGON_CLIP_PATH,
                                                  WebkitClipPath: HEXAGON_CLIP_PATH,
                                                  backgroundColor: (isQuotesProduct && quotesPreference === 'create-own' && !quoteBgImage) ? quoteBgColor : (slice.isRearHalf && !hasOuterFrame ? '#b89365' : sideBaseColor),
                                                  filter: `brightness(${edgeShade.toFixed(2)})`
                                                }}
                                              />
                                            </div>
                                          );
                                        })}

                                      {/* Internal spine plates */}
                                      {showPhysicalEdges && (
                                        <>
                                          <div
                                            className="absolute pointer-events-none"
                                            style={{
                                              left: 'calc(50% - 13px)',
                                              top: '12%',
                                              width: `${depthPx}px`,
                                              height: '76%',
                                              transform: 'rotateY(90deg)',
                                              backgroundColor: sideBaseColor,
                                              filter: 'brightness(0.72)'
                                            }}
                                          />
                                          <div
                                            className="absolute pointer-events-none"
                                            style={{
                                              left: '12%',
                                              top: 'calc(50% - 13px)',
                                              width: '76%',
                                              height: `${depthPx}px`,
                                              transform: 'rotateX(90deg)',
                                              backgroundColor: sideBaseColor,
                                              filter: 'brightness(0.76)'
                                            }}
                                          />
                                        </>
                                      )}

                                      {/* Front Face with Hexagon Panel Photo */}
                                      <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                          transform: `translateZ(${(showPhysicalEdges ? depthPx / 2 + 0.6 : 0.6).toFixed(2)}px)`,
                                          backfaceVisibility: 'hidden',
                                          WebkitBackfaceVisibility: 'hidden'
                                        }}
                                      >
                                        <div
                                          className="w-full h-full bg-white overflow-hidden relative"
                                          style={{
                                            clipPath: HEXAGON_CLIP_PATH,
                                            WebkitClipPath: HEXAGON_CLIP_PATH,
                                            filter: `brightness(${frontBrightness.toFixed(3)})`
                                          }}
                                        >
                                          {panelImgUrl ? (
                                            <img
                                              src={panelImgUrl}
                                              alt=""
                                              draggable={false}
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: p?.fitMode === 'contain' ? 'contain' : 'cover',
                                                transform: `translate3d(${panXPct}%, ${panYPct}%, 0) scale(${pScale}) rotate(${pRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                                filter: getFilterCss(pFilter)
                                              }}
                                              className="w-full h-full pointer-events-none select-none"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">
                                              Hexagon {pIdx + 1}
                                            </div>
                                          )}
                                          <div
                                            className="absolute inset-0 pointer-events-none z-30"
                                            style={{
                                              background: `linear-gradient(${115 + sideSin * 35}deg, rgba(255,255,255,${(
                                                0.12 * Math.max(0, frontCos)
                                              ).toFixed(3)}) 0%, transparent 48%, rgba(15,23,42,${(
                                                0.1 * Math.abs(sideSin)
                                              ).toFixed(3)}) 100%)`
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Back Face clipped to Hexagon */}
                                      <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                          transform: `rotateY(180deg) translateZ(${(showPhysicalEdges ? depthPx / 2 + 0.6 : 0.6).toFixed(2)}px)`,
                                          backfaceVisibility: 'hidden',
                                          WebkitBackfaceVisibility: 'hidden'
                                        }}
                                      >
                                        <div
                                          className="w-full h-full overflow-hidden relative flex flex-col items-center justify-center"
                                          style={{
                                            clipPath: HEXAGON_CLIP_PATH,
                                            WebkitClipPath: HEXAGON_CLIP_PATH,
                                            backgroundColor: '#e6dec8',
                                            backgroundImage:
                                              'repeating-linear-gradient(0deg, rgba(120,113,108,0.08) 0px, rgba(120,113,108,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,113,108,0.08) 0px, rgba(120,113,108,0.08) 1px, transparent 1px, transparent 3px)',
                                            boxShadow: 'inset 0 0 10px rgba(28, 25, 23, 0.25)',
                                            filter: `brightness(${backBrightness.toFixed(3)})`
                                          }}
                                        >
                                          <div className="px-1.5 py-0.5 rounded bg-stone-800/10 text-[7px] font-extrabold text-stone-600 tracking-wider uppercase mb-1">
                                            Hexagon {pIdx + 1}
                                          </div>
                                          {renderHardwareGraphic(selectedHardwareId, false)}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()
                        ) : (
                          <>
                            {showPhysicalEdges && (
                              <>
                                {/* 1. VOLUMETRIC SHAPE-FOLLOWING EXTRUSION SLICES (Side Thickness) */}
                                {depthSlices.map((slice, sIdx) => {
                                  const edgeShade = 0.66 + 0.14 * Math.sin(slice.t * Math.PI);
                                  return (
                                    <div
                                      key={`slice-${sIdx}`}
                                      className="absolute inset-0 pointer-events-none"
                                      style={{
                                        transform: `translateZ(${slice.z.toFixed(2)}px)`
                                      }}
                                    >
                                      <div
                                        className={`w-full h-full overflow-hidden ${shapeRadiusClass}`}
                                        style={{
                                          ...shapeClipStyle,
                                          backgroundColor: slice.isRearHalf && !hasOuterFrame ? '#b89365' : sideBaseColor,
                                          filter: `brightness(${edgeShade.toFixed(2)})`,
                                          boxShadow: 'inset 0 0 0 1.5px rgba(15, 23, 42, 0.16)'
                                        }}
                                      >
                                        {/* Gallery-wrap side edge continuity when full-bleed or clear-edge is active */}
                                        {!hasOuterFrame &&
                                          selectedBorderWidthId === 'none' &&
                                          !slice.isRearHalf &&
                                          primaryPhotoUrl &&
                                          (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                            <img
                                              src={primaryPhotoUrl}
                                              alt=""
                                              draggable={false}
                                              className={`w-full h-full object-cover ${
                                                selectedWrapId === 'clear-edge' ? 'scale-125 blur-[1.5px]' : 'scale-110'
                                              } opacity-80`}
                                            />
                                          )}
                                        {/* Subtle canvas fabric weave on the side thickness */}
                                        <div
                                          className="absolute inset-0 opacity-30"
                                          style={{
                                            backgroundImage:
                                              'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)'
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* 2. PERPENDICULAR 3D SIDE WALLS (Exact 90° Edge-On Solidity) */}
                                {isRectangularShape ? (
                                  <>
                                    {/* Right Side Wall (+X) */}
                                    <div
                                      className="absolute top-0 pointer-events-none overflow-hidden"
                                      style={{
                                        left: `${(cardW - depthPx) / 2}px`,
                                        width: `${depthPx}px`,
                                        height: `${cardH}px`,
                                        transform: `rotateY(90deg) translateZ(${cardW / 2}px)`,
                                        backgroundColor: sideBaseColor,
                                        filter: `brightness(${rightWallBrightness.toFixed(2)})`,
                                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.18)'
                                      }}
                                    >
                                      {!hasOuterFrame &&
                                        selectedBorderWidthId === 'none' &&
                                        primaryPhotoUrl &&
                                        (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                        <div
                                          className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                          style={{
                                            right: '100%',
                                            top: 0,
                                            width: `${cardW}px`,
                                            height: `${cardH}px`,
                                            transformOrigin: 'right center',
                                            transform: 'scaleX(-1)'
                                          }}
                                        >
                                          <img
                                            src={primaryPhotoUrl}
                                            alt=""
                                            draggable={false}
                                            style={{
                                              width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                              height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                              minWidth: '100%',
                                              minHeight: '100%',
                                              maxWidth: 'none',
                                              maxHeight: 'none',
                                              flexShrink: 0,
                                              aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                              objectFit: 'cover',
                                              objectPosition: 'center center',
                                              transform: `translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                              transformOrigin: 'center center',
                                              filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                            }}
                                            className="pointer-events-none select-none max-w-none"
                                          />
                                        </div>
                                      )}
                                      <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                          background:
                                            'linear-gradient(to right, rgba(0,0,0,0.18), rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.24))'
                                        }}
                                      />
                                    </div>

                                    {/* Left Side Wall (-X) */}
                                    <div
                                      className="absolute top-0 pointer-events-none overflow-hidden"
                                      style={{
                                        left: `${(cardW - depthPx) / 2}px`,
                                        width: `${depthPx}px`,
                                        height: `${cardH}px`,
                                        transform: `rotateY(-90deg) translateZ(${cardW / 2}px)`,
                                        backgroundColor: sideBaseColor,
                                        filter: `brightness(${leftWallBrightness.toFixed(2)})`,
                                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.18)'
                                      }}
                                    >
                                      {!hasOuterFrame &&
                                        selectedBorderWidthId === 'none' &&
                                        primaryPhotoUrl &&
                                        (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                        <div
                                          className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                          style={{
                                            left: '100%',
                                            top: 0,
                                            width: `${cardW}px`,
                                            height: `${cardH}px`,
                                            transformOrigin: 'left center',
                                            transform: 'scaleX(-1)'
                                          }}
                                        >
                                          <img
                                            src={primaryPhotoUrl}
                                            alt=""
                                            draggable={false}
                                            style={{
                                              width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                              height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                              minWidth: '100%',
                                              minHeight: '100%',
                                              maxWidth: 'none',
                                              maxHeight: 'none',
                                              flexShrink: 0,
                                              aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                              objectFit: 'cover',
                                              objectPosition: 'center center',
                                              transform: `translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                              transformOrigin: 'center center',
                                              filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                            }}
                                            className="pointer-events-none select-none max-w-none"
                                          />
                                        </div>
                                      )}
                                      <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                          background:
                                            'linear-gradient(to left, rgba(0,0,0,0.18), rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.24))'
                                        }}
                                      />
                                    </div>

                                    {/* Top Side Wall (-Y) */}
                                    <div
                                      className="absolute left-0 pointer-events-none overflow-hidden"
                                      style={{
                                        top: `${(cardH - depthPx) / 2}px`,
                                        width: `${cardW}px`,
                                        height: `${depthPx}px`,
                                        transform: `translateY(-${cardH / 2}px) rotateX(90deg)`,
                                        backgroundColor: sideBaseColor,
                                        filter: 'brightness(0.95)',
                                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.15)'
                                      }}
                                    >
                                      {!hasOuterFrame &&
                                        selectedBorderWidthId === 'none' &&
                                        primaryPhotoUrl &&
                                        (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                        <div
                                          className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                          style={{
                                            top: '100%',
                                            left: 0,
                                            width: `${cardW}px`,
                                            height: `${cardH}px`,
                                            transformOrigin: 'top center',
                                            transform: 'scaleY(-1)'
                                          }}
                                        >
                                          <img
                                            src={primaryPhotoUrl}
                                            alt=""
                                            draggable={false}
                                            style={{
                                              width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                              height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                              minWidth: '100%',
                                              minHeight: '100%',
                                              maxWidth: 'none',
                                              maxHeight: 'none',
                                              flexShrink: 0,
                                              aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                              objectFit: 'cover',
                                              objectPosition: 'center center',
                                              transform: `translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                              transformOrigin: 'center center',
                                              filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                            }}
                                            className="pointer-events-none select-none max-w-none"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* Bottom Side Wall (+Y) */}
                                    <div
                                      className="absolute left-0 pointer-events-none overflow-hidden"
                                      style={{
                                        top: `${(cardH - depthPx) / 2}px`,
                                        width: `${cardW}px`,
                                        height: `${depthPx}px`,
                                        transform: `translateY(${cardH / 2}px) rotateX(-90deg)`,
                                        backgroundColor: sideBaseColor,
                                        filter: 'brightness(0.65)',
                                        boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.22)'
                                      }}
                                    >
                                      {!hasOuterFrame &&
                                        selectedBorderWidthId === 'none' &&
                                        primaryPhotoUrl &&
                                        (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                        <div
                                          className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                          style={{
                                            bottom: '100%',
                                            left: 0,
                                            width: `${cardW}px`,
                                            height: `${cardH}px`,
                                            transformOrigin: 'bottom center',
                                            transform: 'scaleY(-1)'
                                          }}
                                        >
                                          <img
                                            src={primaryPhotoUrl}
                                            alt=""
                                            draggable={false}
                                            style={{
                                              width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                              height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                              minWidth: '100%',
                                              minHeight: '100%',
                                              maxWidth: 'none',
                                              maxHeight: 'none',
                                              flexShrink: 0,
                                              aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                              objectFit: 'cover',
                                              objectPosition: 'center center',
                                              transform: `translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                              transformOrigin: 'center center',
                                              filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                            }}
                                            className="pointer-events-none select-none max-w-none"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  /* Non-rectangular shapes: internal perpendicular 3D spine plates so 90°/270° profile is 100% opaque */
                                  <>
                                    <div
                                      className="absolute pointer-events-none"
                                      style={{
                                        left: `${(cardW - depthPx) / 2}px`,
                                        top: `${cardH * ((1 - spineCoverage) / 2)}px`,
                                        width: `${depthPx}px`,
                                        height: `${cardH * spineCoverage}px`,
                                        transform: 'rotateY(90deg)',
                                        backgroundColor: sideBaseColor,
                                        filter: 'brightness(0.72)'
                                      }}
                                    />
                                    <div
                                      className="absolute pointer-events-none"
                                      style={{
                                        left: `${cardW * ((1 - spineCoverage) / 2)}px`,
                                        top: `${(cardH - depthPx) / 2}px`,
                                        width: `${cardW * spineCoverage}px`,
                                        height: `${depthPx}px`,
                                        transform: 'rotateX(90deg)',
                                        backgroundColor: sideBaseColor,
                                        filter: 'brightness(0.76)'
                                      }}
                                    />
                                  </>
                                )}
                              </>
                            )}

                            {/* Hanging Canvas Wooden Clamp Bars (when 'hanging-canvas' wrap is selected) */}
                            {selectedWrapId === 'hanging-canvas' && isRectangularShape && (
                              <>
                                <div
                                  className="absolute left-[-3%] w-[106%] h-3.5 rounded-xs pointer-events-none"
                                  style={{
                                    top: '-6px',
                                    transform: `translateZ(${depthPx / 2 + 2}px)`,
                                    background: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                  }}
                                />
                                <div
                                  className="absolute left-[-3%] w-[106%] h-3.5 rounded-xs pointer-events-none"
                                  style={{
                                    bottom: '-6px',
                                    transform: `translateZ(${depthPx / 2 + 2}px)`,
                                    background: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                  }}
                                />
                              </>
                            )}

                            {/* 3. FRONT FACE (Customer's Live Canvas Design) */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                transform: `translateZ(${(showPhysicalEdges ? depthPx / 2 + 0.6 : 0.6).toFixed(2)}px)`,
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                              }}
                            >
                              <div
                                className={`w-full h-full bg-white overflow-hidden relative ${shapeRadiusClass}`}
                                style={{
                                  ...shapeClipStyle,
                                  filter: `brightness(${frontBrightness.toFixed(3)})`,
                                  border:
                                    hasOuterFrame && frameColor
                                      ? `${Math.max(5, Math.round(cardW * 0.028))}px solid ${frameColor}`
                                      : undefined,
                                  boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.08)'
                                }}
                              >
                                {renderCanvasFrontDesign(cardW)}

                                {/* Subtle 3D specular light reflection across the canvas surface as it rotates */}
                                <div
                                  className="absolute inset-0 pointer-events-none z-30"
                                  style={{
                                    background: `linear-gradient(${115 + sideSin * 35}deg, rgba(255,255,255,${(
                                      0.12 * Math.max(0, frontCos)
                                    ).toFixed(3)}) 0%, transparent 48%, rgba(15,23,42,${(
                                      0.1 * Math.abs(sideSin)
                                    ).toFixed(3)}) 100%)`
                                  }}
                                />
                              </div>
                            </div>

                            {/* 4. BACK FACE (Physical Canvas Rear: Stretcher Frame / Dust Cover + Hanging Hardware) */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                transform: `rotateY(180deg) translateZ(${(showPhysicalEdges ? depthPx / 2 + 0.6 : 0.6).toFixed(2)}px)`,
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                              }}
                            >
                              <div
                                className={`w-full h-full overflow-hidden relative ${shapeRadiusClass}`}
                                style={{
                                  ...shapeClipStyle,
                                  filter: `brightness(${backBrightness.toFixed(3)})`
                                }}
                              >
                                {selectedProductTypeId === 'canvas-banner' ? (
                                  /* Clean Flat Fabric / Canvas Banner Back */
                                  <div
                                    className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden"
                                    style={{
                                      backgroundColor: '#f5f0e6',
                                      backgroundImage:
                                        'repeating-linear-gradient(0deg, rgba(120,113,108,0.06) 0px, rgba(120,113,108,0.06) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,113,108,0.06) 0px, rgba(120,113,108,0.06) 1px, transparent 1px, transparent 3px)',
                                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                    {selectedHardwareId === 'banner-hanging-rails' && (
                                      <>
                                        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#854D0E] to-[#713F12] border-b border-[#5A320E] shadow-sm z-10" />
                                        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-b from-[#854D0E] to-[#713F12] border-t border-[#5A320E] shadow-sm z-10" />
                                      </>
                                    )}
                                    {selectedHardwareId === 'banner-pole-pocket' && (
                                      <>
                                        <div className="absolute top-0 inset-x-0 h-5 bg-black/10 border-b border-dashed border-stone-400 pointer-events-none z-10 flex items-center justify-center">
                                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500">Pole Pocket (Back)</span>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 h-5 bg-black/10 border-t border-dashed border-stone-400 pointer-events-none z-10 flex items-center justify-center">
                                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500">Pole Pocket (Back)</span>
                                        </div>
                                      </>
                                    )}
                                    {selectedHardwareId === 'banner-grommets' && (
                                      <>
                                        <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center z-10">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center z-10">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center z-10">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-stone-300 border-2 border-stone-500 shadow-inner flex items-center justify-center z-10">
                                          <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                                        </div>
                                      </>
                                    )}
                                    <div className="relative z-10 px-3 py-1 rounded bg-stone-800/10 border border-stone-700/15 text-[8px] font-extrabold text-stone-600 tracking-widest uppercase">
                                      Canvas India • Banner Reverse
                                    </div>
                                  </div>
                                ) : selectedDisplayOptionId === 'dust-cover' ? (
                                  /* Dust Cover Back: Sealed black craft paper backing over wood stretcher frame */
                                  <div
                                    className="w-full h-full relative flex flex-col items-center justify-center"
                                    style={{
                                      background:
                                        'radial-gradient(circle at center, #292524 0%, #1c1917 75%, #0c0a09 100%)',
                                      boxShadow: 'inset 0 0 0 10px #78350f, inset 0 0 0 12px #44403c'
                                    }}
                                  >
                                    <div className="px-3 py-1 rounded border border-stone-700 bg-stone-900/90 text-[9px] font-bold text-stone-400 tracking-widest uppercase">
                                      Canvas India • Sealed Dust Cover
                                    </div>
                                    {renderHardwareGraphic(selectedHardwareId, false)}
                                  </div>
                                ) : !showPhysicalEdges ? (
                                  /* Clean Flat Back for non-edge products (Round, Oval, Triangle, Heart, Mosaic, Split, etc.) */
                                  <div
                                    className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden"
                                    style={{
                                      backgroundColor: '#e6dec8',
                                      backgroundImage:
                                        'repeating-linear-gradient(0deg, rgba(120,113,108,0.08) 0px, rgba(120,113,108,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,113,108,0.08) 0px, rgba(120,113,108,0.08) 1px, transparent 1px, transparent 3px)',
                                      boxShadow: 'inset 0 0 16px rgba(28, 25, 23, 0.25)'
                                    }}
                                  >
                                    <div className="relative z-10 px-2.5 py-0.5 rounded bg-stone-800/10 border border-stone-700/15 text-[8px] font-extrabold text-stone-600 tracking-widest uppercase mb-2">
                                      Canvas India • Art Backing
                                    </div>
                                    {renderHardwareGraphic(selectedHardwareId, false)}
                                  </div>
                                ) : (
                                  /* Standard Open Stretcher-Bar Back: Folded canvas wrap + kiln-dried pinewood bars + raw canvas back */
                                  <div
                                    className="w-full h-full relative flex items-center justify-center"
                                    style={{
                                      backgroundColor: '#f5f0e6',
                                      padding: `${Math.max(6, Math.round(Math.min(cardW, cardH) * 0.035))}px`
                                    }}
                                  >
                                    {/* Kiln-dried Pinewood Stretcher Bar Frame */}
                                    <div
                                      className={`w-full h-full relative flex items-center justify-center overflow-hidden ${shapeRadiusClass}`}
                                      style={{
                                        ...shapeClipStyle,
                                        background:
                                          'linear-gradient(135deg, #d4a373 0%, #b5835a 50%, #9c6644 100%)',
                                        padding: isRectangularShape
                                          ? `${Math.max(14, Math.round(Math.min(cardW, cardH) * 0.085))}px`
                                          : '10%',
                                        boxShadow:
                                          'inset 0 2px 5px rgba(255,255,255,0.35), inset 0 -2px 6px rgba(0,0,0,0.35), 0 0 0 1px rgba(120,53,15,0.4)'
                                      }}
                                    >
                                      {/* 45-degree corner miter joint lines on rectangular stretcher bars */}
                                      {isRectangularShape && (
                                        <svg
                                          viewBox="0 0 100 100"
                                          preserveAspectRatio="none"
                                          className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
                                        >
                                          <line x1="0" y1="0" x2="14" y2="14" stroke="#451a03" strokeWidth="0.8" />
                                          <line x1="100" y1="0" x2="86" y2="14" stroke="#451a03" strokeWidth="0.8" />
                                          <line x1="0" y1="100" x2="14" y2="86" stroke="#451a03" strokeWidth="0.8" />
                                          <line x1="100" y1="100" x2="86" y2="86" stroke="#451a03" strokeWidth="0.8" />
                                        </svg>
                                      )}

                                      {/* Recessed Raw Unbleached Cotton Canvas Rear Surface */}
                                      <div
                                        className={`w-full h-full relative flex flex-col items-center justify-center overflow-hidden ${shapeRadiusClass}`}
                                        style={{
                                          ...shapeClipStyle,
                                          backgroundColor: '#e6dec8',
                                          backgroundImage:
                                            'repeating-linear-gradient(0deg, rgba(120,113,108,0.07) 0px, rgba(120,113,108,0.07) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(120,113,108,0.07) 0px, rgba(120,113,108,0.07) 1px, transparent 1px, transparent 3px)',
                                          boxShadow: 'inset 0 4px 12px rgba(28, 25, 23, 0.42)'
                                        }}
                                      >
                                        {/* Center Pine Cross-Brace on rectangular canvases */}
                                        {isRectangularShape && (
                                          <div
                                            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 pointer-events-none"
                                            style={{
                                              background:
                                                'linear-gradient(90deg, #a67c52 0%, #cfa375 50%, #9c6644 100%)',
                                              boxShadow: '0 0 6px rgba(0,0,0,0.25)'
                                            }}
                                          />
                                        )}

                                        <div className="relative z-10 px-2.5 py-0.5 rounded bg-stone-800/10 border border-stone-700/15 text-[8px] font-extrabold text-stone-600 tracking-widest uppercase">
                                          Canvas India • Hand-Stretched Frame
                                        </div>
                                      </div>

                                      {/* Mounted Hanging Hardware on Rear Stretcher Bar */}
                                      {renderHardwareGraphic(selectedHardwareId, false)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {is360 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-4 py-1.5 rounded-full pointer-events-none select-none z-20 shadow-md">
                            Drag to rotate in full 360&deg;
                          </div>
                        )}
                      </div>

                      {/* Right-Hand Column: Exactly 4 Fixed Orientation Thumbnails (Screenshot 1) */}
                      {!is360 && (
                        <div className="w-full md:w-56 lg:w-64 border-t md:border-t-0 md:border-l border-stone-200 bg-stone-50/70 p-3.5 sm:p-4 flex flex-col justify-start overflow-y-auto">
                          <div className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-3 px-1">
                            Orientation Views
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5 sm:gap-3">
                            {PRESET_3D_ANGLES.map((preset) => {
                              const isSelected = preset3DAngle === preset.id;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => {
                                    setViewerAutoRotate(false);
                                    setPreset3DAngle(preset.id);
                                  }}
                                  className={`relative group rounded-xl p-2.5 sm:p-3 transition-all cursor-pointer flex flex-col items-center justify-center border text-center ${
                                    isSelected
                                      ? 'bg-white border-[#0E4A93] shadow-sm ring-2 ring-[#0E4A93]/20'
                                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                                  }`}
                                >
                                  {/* Active Checkmark Badge */}
                                  {isSelected && (
                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs z-10">
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </div>
                                  )}

                                  {/* Miniature 3D Model Representation */}
                                  <div
                                    className="relative flex items-center justify-center my-1"
                                    style={{ width: `${thumbBoxW + 24}px`, height: `${thumbBoxH + 16}px` }}
                                  >
                                    <div
                                      style={{
                                        width: `${thumbW}px`,
                                        height: `${thumbH}px`,
                                        perspective: '450px'
                                      }}
                                      className="relative flex items-center justify-center"
                                    >
                                      <div
                                        style={{
                                          width: `${thumbW}px`,
                                          height: `${thumbH}px`,
                                          transformStyle: 'preserve-3d',
                                          WebkitTransformStyle: 'preserve-3d',
                                          transform: `rotateX(${preset.tiltX}deg) rotateY(${preset.rotY}deg) scale(0.85)`
                                        }}
                                        className="relative pointer-events-none transition-transform duration-200"
                                      >
                                        {/* Front Face with customized artwork */}
                                        <div
                                          className={`absolute inset-0 overflow-hidden ${shapeRadiusClass}`}
                                          style={{
                                            ...shapeClipStyle,
                                            transform: `translateZ(${thumbDepthPx / 2}px)`,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
                                          }}
                                        >
                                          {renderCanvasFrontDesign(thumbW)}
                                        </div>

                                        {/* Top Edge */}
                                        <div
                                          className="absolute left-0 right-0 overflow-hidden"
                                          style={{
                                            top: 0,
                                            height: `${thumbDepthPx}px`,
                                            backgroundColor: sideBaseColor,
                                            transform: `rotateX(90deg) translateZ(${thumbDepthPx / 2}px)`,
                                            transformOrigin: 'top center',
                                            filter: 'brightness(0.95)'
                                          }}
                                        >
                                          {!hasOuterFrame &&
                                            selectedBorderWidthId === 'none' &&
                                            primaryPhotoUrl &&
                                            (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                            <div
                                              className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                              style={{
                                                top: '100%',
                                                left: 0,
                                                width: `${thumbW}px`,
                                                height: `${thumbH}px`,
                                                transformOrigin: 'top center',
                                                transform: 'scaleY(-1)'
                                              }}
                                            >
                                              <img
                                                src={primaryPhotoUrl}
                                                alt=""
                                                draggable={false}
                                                style={{
                                                  width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                                  height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                                  minWidth: '100%',
                                                  minHeight: '100%',
                                                  maxWidth: 'none',
                                                  maxHeight: 'none',
                                                  flexShrink: 0,
                                                  aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                                  objectFit: 'cover',
                                                  objectPosition: 'center center',
                                                  transform: `translate(${thumbPanX}px, ${thumbPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                                  transformOrigin: 'center center',
                                                  filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                                }}
                                                className="pointer-events-none select-none max-w-none"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Bottom Edge */}
                                        <div
                                          className="absolute left-0 right-0 overflow-hidden"
                                          style={{
                                            bottom: 0,
                                            height: `${thumbDepthPx}px`,
                                            backgroundColor: sideBaseColor,
                                            transform: `rotateX(-90deg) translateZ(${thumbDepthPx / 2}px)`,
                                            transformOrigin: 'bottom center',
                                            filter: 'brightness(0.7)'
                                          }}
                                        >
                                          {!hasOuterFrame &&
                                            selectedBorderWidthId === 'none' &&
                                            primaryPhotoUrl &&
                                            (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                            <div
                                              className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                              style={{
                                                bottom: '100%',
                                                left: 0,
                                                width: `${thumbW}px`,
                                                height: `${thumbH}px`,
                                                transformOrigin: 'bottom center',
                                                transform: 'scaleY(-1)'
                                              }}
                                            >
                                              <img
                                                src={primaryPhotoUrl}
                                                alt=""
                                                draggable={false}
                                                style={{
                                                  width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                                  height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                                  minWidth: '100%',
                                                  minHeight: '100%',
                                                  maxWidth: 'none',
                                                  maxHeight: 'none',
                                                  flexShrink: 0,
                                                  aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                                  objectFit: 'cover',
                                                  objectPosition: 'center center',
                                                  transform: `translate(${thumbPanX}px, ${thumbPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                                  transformOrigin: 'center center',
                                                  filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                                }}
                                                className="pointer-events-none select-none max-w-none"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Left Edge */}
                                        <div
                                          className="absolute top-0 bottom-0 overflow-hidden"
                                          style={{
                                            left: 0,
                                            width: `${thumbDepthPx}px`,
                                            backgroundColor: sideBaseColor,
                                            transform: `rotateY(-90deg) translateZ(${thumbDepthPx / 2}px)`,
                                            transformOrigin: 'left center',
                                            filter: 'brightness(0.85)'
                                          }}
                                        >
                                          {!hasOuterFrame &&
                                            selectedBorderWidthId === 'none' &&
                                            primaryPhotoUrl &&
                                            (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                            <div
                                              className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                              style={{
                                                left: '100%',
                                                top: 0,
                                                width: `${thumbW}px`,
                                                height: `${thumbH}px`,
                                                transformOrigin: 'left center',
                                                transform: 'scaleX(-1)'
                                              }}
                                            >
                                              <img
                                                src={primaryPhotoUrl}
                                                alt=""
                                                draggable={false}
                                                style={{
                                                  width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                                  height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                                  minWidth: '100%',
                                                  minHeight: '100%',
                                                  maxWidth: 'none',
                                                  maxHeight: 'none',
                                                  flexShrink: 0,
                                                  aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                                  objectFit: 'cover',
                                                  objectPosition: 'center center',
                                                  transform: `translate(${thumbPanX}px, ${thumbPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                                  transformOrigin: 'center center',
                                                  filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                                }}
                                                className="pointer-events-none select-none max-w-none"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Right Edge */}
                                        <div
                                          className="absolute top-0 bottom-0 overflow-hidden"
                                          style={{
                                            right: 0,
                                            width: `${thumbDepthPx}px`,
                                            backgroundColor: sideBaseColor,
                                            transform: `rotateY(90deg) translateZ(${thumbDepthPx / 2}px)`,
                                            transformOrigin: 'right center',
                                            filter: 'brightness(0.8)'
                                          }}
                                        >
                                          {!hasOuterFrame &&
                                            selectedBorderWidthId === 'none' &&
                                            primaryPhotoUrl &&
                                            (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                            <div
                                              className="absolute overflow-hidden pointer-events-none select-none flex items-center justify-center opacity-90"
                                              style={{
                                                right: '100%',
                                                top: 0,
                                                width: `${thumbW}px`,
                                                height: `${thumbH}px`,
                                                transformOrigin: 'right center',
                                                transform: 'scaleX(-1)'
                                              }}
                                            >
                                              <img
                                                src={primaryPhotoUrl}
                                                alt=""
                                                draggable={false}
                                                style={{
                                                  width: viewerIsWiderThanFrame ? 'auto' : '100%',
                                                  height: viewerIsWiderThanFrame ? '100%' : 'auto',
                                                  minWidth: '100%',
                                                  minHeight: '100%',
                                                  maxWidth: 'none',
                                                  maxHeight: 'none',
                                                  flexShrink: 0,
                                                  aspectRatio: `${viewerNatWidth} / ${viewerNatHeight}`,
                                                  objectFit: 'cover',
                                                  objectPosition: 'center center',
                                                  transform: `translate(${thumbPanX}px, ${thumbPanY}px) scale(${viewerScale}) rotate(${viewerRot}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                                  transformOrigin: 'center center',
                                                  filter: isDigitalPaintingProduct ? `${getFilterCss(viewerFilter) !== 'none' ? getFilterCss(viewerFilter) + ' ' : ''}${getDigitalPaintingFilterCss(digitalPaintingConfig.selectedEffectId)}` : getFilterCss(viewerFilter)
                                                }}
                                                className="pointer-events-none select-none max-w-none"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Orientation Label */}
                                  <span
                                    className={`text-xs font-bold mt-1 transition-colors ${
                                      isSelected ? 'text-[#0E4A93]' : 'text-stone-700'
                                    }`}
                                  >
                                    {preset.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
          </div>
        );
      })()}

      {materialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">Select Canvas Material Variant</h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
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

      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex z-50 animate-in fade-in">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <img src="/canvas-india-official-logo.webp" alt="Canvas India" className="h-8 w-auto object-contain" />
                <button onClick={() => setMenuOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <Link to={`/products/${catalogProduct.slug || catalogProduct.id}`} className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg">
                  ← Return to Product Page
                </Link>
                <Link to={activeMaterial === 'acrylic' ? '/acrylic' : '/canvas'} className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg">
                  {activeMaterial === 'acrylic' ? 'View All Acrylic Products' : 'View All Canvas Products'}
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

      {/* Select Size & Shape Modal */}
      <SelectSizeShapeModal
        isOpen={isSizeShapeModalOpen}
        onClose={() => setIsSizeShapeModalOpen(false)}
        material={activeMaterial}
        productId={selectedProductTypeId}
        productName={selectedProductType.name}
        currentShapeId={selectedShapeId}
        currentSizeId={selectedSizeId}
        isCustomSize={isCustomSize}
        customWidth={customWidth}
        customHeight={customHeight}
        onSelectSizeAndShape={handleApplySizeAndShape}
        bulkQuantity={quantity}
      />

      {/* Select Layout Modal */}
      <SelectLayoutModal
        isOpen={isLayoutModalOpen}
        onClose={() => setIsLayoutModalOpen(false)}
        material={activeMaterial}
        productId={selectedProductTypeId}
        productName={selectedProductType.name}
        currentLayoutId={selectedLayoutId}
        onSelectLayout={handleApplyLayoutFromModal}
        onHighlightLayout={handleHighlightLayoutFromModal}
        bulkQuantity={quantity}
      />

      {/* Word Art Size + Ratio Modal */}
      <WordArtSizeRatioModal
        isOpen={isWordArtSizeModalOpen}
        onClose={() => setIsWordArtSizeModalOpen(false)}
        selectedSizeId={wordArtSizeOption.id}
        onSelectSize={handleSelectWordArtSize}
        onCreateWordArt={handleCreateWordArtFromSize}
        bulkQuantity={quantity}
      />

      {/* Word Art Personalization Modal */}
      <WordArtPersonalizeModal
        isOpen={isWordArtPersonalizeModalOpen}
        onClose={() => setIsWordArtPersonalizeModalOpen(false)}
        selectedSize={wordArtSizeOption}
        initialConfig={wordArtConfig}
        onChangeSize={handleWordArtChangeSize}
        onAddToProduct={handleAddWordArtToProduct}
        bulkQuantity={quantity}
      />

      {/* Pop Art Style Selection Modal */}
      <PopArtStyleModal
        isOpen={isPopArtStyleModalOpen}
        onClose={() => setIsPopArtStyleModalOpen(false)}
        selectedStyleId={popArtConfig.selectedStyleId}
        onSelectStyle={(style) => {
          setPopArtConfig((prev) => ({
            ...prev,
            selectedStyleId: style.id
          }));
        }}
      />

      {/* Quotes on Canvas / Acrylic Preference Modal (Requirement 1) */}
      <SelectPreferenceModal
        isOpen={isQuotesPreferenceModalOpen}
        onClose={() => {
          if (quotesPreference === null) {
            setQuotesPreference('collection');
          }
          setIsQuotesPreferenceModalOpen(false);
        }}
        selectedPreference={quotesPreference}
        onSelectCreateOwn={handleSelectCreateOwnPreference}
        onSelectCollection={handleSelectCollectionPreference}
        title={activeMaterial === 'acrylic' ? 'QUOTES ON ACRYLIC — SELECT PREFERENCE' : 'QUOTES ON CANVAS — SELECT PREFERENCE'}
      />

      {/* Lyric on Canvas Template Selection Modal */}
      <SelectLyricTemplateModal
        isOpen={isLyricTemplateModalOpen}
        onClose={() => setIsLyricTemplateModalOpen(false)}
        selectedTemplateId={lyricConfig.selectedTemplateId}
        onSelectTemplate={handleSelectLyricTemplate}
      />
    </div>
  );
};

export default CanvasCustomizerPage;

