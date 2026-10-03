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
  Image as ImageIcon,
  Sparkles,
  FileText,
  Shapes,
  FlipHorizontal2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
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
  getCanvasProductCapabilities
} from '../data/canvasCustomizerData';
import { CustomizerProductSelector } from '../components/CustomizerProductSelector';
import { CustomizerPreloader, PRELOADER_MIN_MS } from '../components/CustomizerPreloader';
import { AcrylicShapePreview } from '../components/AcrylicShapePreview';
import { AcrylicRoomViewModal, RoomPlacementState } from '../components/AcrylicRoomViewModal';
import { SelectSizeShapeModal } from '../components/SelectSizeShapeModal';
import { getProductSizeShapeOptions, getSizesForProductAndShape } from '../data/productSizeShapeConfig';
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
  | 'UPLOAD'
  | 'SHAPES'
  | 'SHAPE'
  | 'SELECT SIZE'
  | 'LAYOUTS & DESIGNS'
  | 'WRAP & BORDER'
  | 'HARDWARE & FINISH'
  | 'OPTIONS';

const TOOLBAR_ITEMS: { id: ToolbarTab; label: string; icon: React.ElementType }[] = [
  { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
  { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
  { id: 'SHAPES', label: 'SHAPES', icon: Shapes },
  { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
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

const CANVAS_BORDER_WIDTH_PRICES: Record<string, number> = { none: 0, thin: 49, medium: 89, thick: 149 };

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
  // 1. Single Print (canvas-single) - Starts at ₹99.00
  {
    id: 'single-8x8',
    productTypeId: 'canvas-single',
    label: 'Single: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 99.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'single-10x10',
    productTypeId: 'canvas-single',
    label: 'Single: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 199.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'single-12x18',
    productTypeId: 'canvas-single',
    label: 'Single: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 399.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
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

  // 5. Oval Canvas (canvas-oval) - Starts at ₹1,380.67
  {
    id: 'oval-8x10',
    productTypeId: 'canvas-oval',
    label: 'Oval: 8" × 10"',
    dimensionsSummary: '8" × 10"',
    price: 1380.67,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }]
  },
  {
    id: 'oval-12x16',
    productTypeId: 'canvas-oval',
    label: 'Oval: 12" × 16"',
    dimensionsSummary: '12" × 16"',
    price: 1899.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Oval Canvas', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 }]
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
    id: 'hex-8x8',
    productTypeId: 'canvas-hexagon',
    label: 'Hexagon: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 449.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Hexagon Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'hex-12x12',
    productTypeId: 'canvas-hexagon',
    label: 'Hexagon: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 799.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Hexagon Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
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

  // 11. Lyric on Canvas (canvas-lyric) - Starts at ₹148.50
  {
    id: 'lyric-8x8',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 148.50,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'lyric-12x18',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 499.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },

  // 12. Digital Painting (canvas-digital-painting) - Starts at ₹2,598.00
  {
    id: 'painting-12x18',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 2598.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'painting-16x24',
    productTypeId: 'canvas-digital-painting',
    label: 'Digital Painting: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 3299.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Painting Canvas', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },

  // 13. Quotes on Canvas (canvas-quotes) - Starts at ₹99.00
  {
    id: 'quotes-8x8',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 99.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'quotes-12x12',
    productTypeId: 'canvas-quotes',
    label: 'Quotes Canvas: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 299.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Quotes Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },

  // 14. Bus Roll (canvas-bus-roll) - Starts at ₹705.60
  {
    id: 'bus-12x36',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 12" × 36"',
    dimensionsSummary: '12" × 36"',
    price: 705.60,
    categories: ['RECOMMENDED', 'PANORAMIC'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '12" × 36"', widthRatio: 12, heightRatio: 36 }]
  },
  {
    id: 'bus-16x48',
    productTypeId: 'canvas-bus-roll',
    label: 'Bus Roll: 16" × 48"',
    dimensionsSummary: '16" × 48"',
    price: 1199.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Bus Roll Canvas', dimension: '16" × 48"', widthRatio: 16, heightRatio: 48 }]
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

  // 16. Pop Art (canvas-pop-art) - Starts at ₹598.00
  {
    id: 'pop-12x12',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 598.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'pop-16x16',
    productTypeId: 'canvas-pop-art',
    label: 'Pop Art: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 999.0,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Pop Art Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },

  // 17. Classic Canvas Print (canvas-classic) - Starts at ₹99.00
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

const DESIGN_TEMPLATE_CATEGORIES = ["Father's Day", 'Birthday', 'Wedding', 'Anniversary'];

const DESIGN_TEMPLATES: DesignTemplate[] = [
  { id: 'tpl-fd-1', category: "Father's Day", name: 'Love You Dad', textPreset: 'Love You Dad', decor: 'necktie', accent: '#0f172a', swatchClass: 'bg-stone-900 text-white' },
  { id: 'tpl-fd-2', category: "Father's Day", name: "Happy Father's Day", textPreset: "Happy Father's Day", decor: 'ribbon', accent: '#0284c7', swatchClass: 'bg-sky-100 text-sky-900' },
  { id: 'tpl-fd-3', category: "Father's Day", name: 'Dad, The Hero', textPreset: 'Dad, The Hero', decor: 'confetti', accent: '#f59e0b', swatchClass: 'bg-emerald-50 text-emerald-900' },
  { id: 'tpl-bd-1', category: 'Birthday', name: 'Happy Birthday', textPreset: 'Happy Birthday!', decor: 'balloons', accent: '#e11d48', swatchClass: 'bg-rose-100 text-rose-900' },
  { id: 'tpl-bd-2', category: 'Birthday', name: 'Another Year Wiser', textPreset: 'Another Year Wiser', decor: 'confetti', accent: '#d97706', swatchClass: 'bg-amber-100 text-amber-900' },
  { id: 'tpl-wd-1', category: 'Wedding', name: 'Mr & Mrs', textPreset: 'Mr & Mrs', decor: 'floral', accent: '#be123c', swatchClass: 'bg-rose-50 text-rose-900' },
  { id: 'tpl-wd-2', category: 'Wedding', name: 'Forever & Always', textPreset: 'Forever & Always', decor: 'floral', accent: '#78716c', swatchClass: 'bg-white text-stone-900 border border-stone-200' },
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

type SelectedItem = { type: 'text' | 'clip'; id: string } | null;

// Gallery: sample photographs bundled with the site
const GALLERY_PHOTOS = [
  { url: '/assets/acrylic/acrylic-family-print.jpg', label: 'Family' },
  { url: '/assets/acrylic/acrylic-abstract-art.jpg', label: 'Abstract' },
  { url: '/assets/acrylic/acrylic-custom-wall-art.jpg', label: 'Wall art' },
  { url: '/assets/acrylic/acrylic-inspirational-print.jpg', label: 'Quote' },
  { url: '/assets/acrylic/acrylic-poster.jpg', label: 'Poster' },
  { url: '/assets/acrylic/acrylic-gift.jpg', label: 'Gift' },
  { url: '/assets/acrylic/acrylic-decorative-panel.jpg', label: 'Decor' },
  { url: '/assets/acrylic/acrylic-photo-panel.jpg', label: 'Portrait' }
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
  fitMode: 'contain'
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

  const depthValue = id === 'canvas-lite' ? '0.5"' : id === 'thin-gallery' ? '0.75"' : '1.5"';
  const sideWidth = id === 'canvas-lite' ? 12 : id === 'thin-gallery' ? 20 : 30;

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
  return (
    <svg viewBox="0 0 60 50" className="w-12 h-10 mx-auto">
      <rect x="2" y="2" width="56" height="46" fill="#f1f5f9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="16" y="12" width="28" height="26" fill="#ffffff" stroke="#94a3b8" strokeDasharray="3 3" rx="4" />
      <line x1="22" y1="18" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  );
};

// ============================================================================
// 2. MAIN CANVAS CUSTOMIZER COMPONENT
// ============================================================================

export const CanvasCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Matched product from catalog with safe fallback so route never renders blank even if catalog is empty
  const catalogProduct = useMemo(() => {
    const safeList = Array.isArray(allProducts) ? allProducts : [];
    return (
      safeList.find((p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'canvas') ||
      safeList.find((p) => p.categorySlug === 'canvas') ||
      safeList[0] || {
        id: productId || 'canvas-classic',
        slug: productId || 'canvas-classic',
        name: 'Classic Canvas Print',
        categorySlug: 'canvas' as const,
        price: 499,
        originalPrice: 999,
        rating: 4.9,
        reviewsCount: 128,
        image: '/assets/acrylic/acrylic-family-print.jpg',
        images: ['/assets/acrylic/acrylic-family-print.jpg'],
        sizes: [],
        thicknesses: [],
        orientations: ['Landscape', 'Portrait', 'Square'],
        description: 'Stretched 380 GSM cotton canvas on a solid pine frame.',
        highlights: [],
        inStock: true
      }
    );
  }, [allProducts, productId]);

  // Active step in the left toolbar
  const [activeTab, setActiveTab] = useState<ToolbarTab>('PRODUCTS');

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
    if (tabId === 'SELECT SIZE') {
      setIsSizeShapeModalOpen(true);
    }
    beginPreloader();
    endPreloader(PRELOADER_MIN_MS);
  };

  // Selected Canvas Product Type (supports all Canvas products via route param or sidebar switcher)
  const resolveCanvasProductTypeId = (rawId?: string, catProd?: typeof catalogProduct): string => {
    const key = (rawId || catProd?.slug || catProd?.id || catProd?.name || '').toLowerCase();
    if (CANVAS_PRODUCT_TYPES.some((pt) => pt.id === key)) return key;
    if (key.includes('single') || key.includes('classic')) return 'canvas-single';
    if (key.includes('round')) return 'canvas-round';
    if (key.includes('triangle')) return 'canvas-triangle';
    if (key.includes('heart')) return 'canvas-heart';
    if (key.includes('oval')) return 'canvas-oval';
    if (key.includes('hexagon')) return 'canvas-hexagon';
    if (key.includes('mosaic')) return 'canvas-mosaic';
    if (key.includes('lyric')) return 'canvas-lyric';
    if (key.includes('painting')) return 'canvas-digital-painting';
    if (key.includes('quote')) return 'canvas-quotes';
    if (key.includes('bus') || key.includes('roll')) return 'canvas-bus-roll';
    if (key.includes('banner')) return 'canvas-banner';
    if (key.includes('pop')) return 'canvas-pop-art';
    if (key.includes('block') || key.includes('desk') || key.includes('easel')) return 'canvas-photo-block';
    if (key.includes('wall') || key.includes('display')) return 'canvas-wall-art';
    if (key.includes('collage')) return 'canvas-collage';
    if (key.includes('split')) return 'canvas-split';
    if (key.includes('panoramic') || key.includes('landscape')) return 'canvas-panoramic';
    if (key.includes('sign')) return 'canvas-signage';
    return 'canvas-single';
  };

  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(() =>
    resolveCanvasProductTypeId(productId, catalogProduct)
  );

  useEffect(() => {
    if (productId) {
      setSelectedProductTypeId(resolveCanvasProductTypeId(productId, catalogProduct));
    }
  }, [productId, catalogProduct]);

  const selectedProductType = useMemo(() => {
    return CANVAS_PRODUCT_TYPES.find((pt) => pt.id === selectedProductTypeId) || CANVAS_PRODUCT_TYPES[0];
  }, [selectedProductTypeId]);

  // Product capabilities for dynamic sidebar tabs
  const productCapabilities = useMemo(() => {
    return getCanvasProductCapabilities(selectedProductType);
  }, [selectedProductType]);

  // Primary Toolbar items: dynamically filtered by selected product capabilities
  // EXACT ORDER: 1. PRODUCTS, 2. UPLOAD, 3. SHAPES, 4. SELECT SIZE, 5. LAYOUTS & DESIGNS, 6. WRAP & BORDER, 7. HARDWARE & FINISH, 8. OPTIONS
  const toolbarItems = useMemo<{ id: ToolbarTab; label: string; icon: React.ElementType }[]>(() => {
    const items: { id: ToolbarTab; label: string; icon: React.ElementType; enabled: boolean }[] = [
      { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid, enabled: productCapabilities.products !== false },
      { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud, enabled: productCapabilities.upload !== false },
      { id: 'SHAPES', label: 'SHAPES', icon: Shapes, enabled: productCapabilities.shapes === true },
      { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid, enabled: productCapabilities.sizes !== false },
      { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers, enabled: productCapabilities.layouts === true },
      { id: 'WRAP & BORDER', label: 'WRAP & BORDER', icon: Crop, enabled: productCapabilities.wrap !== false },
      { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal, enabled: productCapabilities.hardware !== false },
      { id: 'OPTIONS', label: 'OPTIONS', icon: Menu, enabled: productCapabilities.options !== false }
    ];
    return items.filter((item) => item.enabled);
  }, [productCapabilities]);

  // If the active tab is not supported by the currently selected product, safely revert to PRODUCTS
  useEffect(() => {
    const isCurrentTabSupported = toolbarItems.some(
      (item) => item.id === activeTab || (item.id === 'SHAPES' && activeTab === 'SHAPE') || (item.id === 'SHAPE' && activeTab === 'SHAPES')
    );
    if (!isCurrentTabSupported) {
      setActiveTab('PRODUCTS');
    }
  }, [toolbarItems, activeTab]);

  const activeTabIndex = Math.max(0, toolbarItems.findIndex((t) => t.id === activeTab || (t.id === 'SHAPES' && activeTab === 'SHAPE')));
  const prevTab = toolbarItems[Math.max(0, activeTabIndex - 1)] || toolbarItems[0];
  const nextTab = toolbarItems[Math.min(toolbarItems.length - 1, activeTabIndex + 1)] || toolbarItems[toolbarItems.length - 1];

  // SHAPE tab state
  const [selectedShapeId, setSelectedShapeId] = useState<string>('shape-rectangle');
  const [shapeFilterCategory, setShapeFilterCategory] = useState<'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'>('ALL');

  const currentShape = useMemo<CanvasShapeOption>(() => {
    return CANVAS_SHAPES.find((s) => s.id === selectedShapeId) || CANVAS_SHAPES[0];
  }, [selectedShapeId]);

  // Available size options for the current product type and active shape (from centralized productSizeShapeConfig)
  const availableSizeOptions = useMemo(() => {
    const configOptions = getSizesForProductAndShape(selectedProductTypeId, selectedShapeId, 'canvas').map((opt) => ({
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
      panels: opt.panels || [{ id: 'p0', label: 'Canvas', dimension: opt.dimensionsSummary, widthRatio: opt.widthInches, heightRatio: opt.heightInches }]
    }));
    return configOptions.length > 0 ? configOptions : SIZE_OPTIONS.filter((s) => s.productTypeId === 'canvas-classic' || s.productTypeId === 'canvas-single');
  }, [selectedProductTypeId, selectedShapeId]);

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => availableSizeOptions[0]?.id || 'shape-rectangle-10x8');

  useEffect(() => {
    if (!availableSizeOptions.some((s) => s.id === selectedSizeId)) {
      setSelectedSizeId(availableSizeOptions[0]?.id || 'shape-rectangle-10x8');
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

  const filteredLayoutPresets = useMemo(() => {
    if (selectedProductType?.supportedLayoutIds && selectedProductType.supportedLayoutIds.length > 0) {
      return LAYOUT_PRESETS.filter((l) => selectedProductType.supportedLayoutIds!.includes(l.id));
    }
    return LAYOUT_PRESETS;
  }, [selectedProductType]);

  const filteredShapes = useMemo(() => {
    let list = CANVAS_SHAPES;
    if (selectedProductType?.supportedShapeIds && selectedProductType.supportedShapeIds.length > 0) {
      list = list.filter((s) => selectedProductType.supportedShapeIds!.includes(s.id));
    }
    if (shapeFilterCategory === 'ALL') return list;
    return list.filter((s) => s.category.toUpperCase() === shapeFilterCategory);
  }, [shapeFilterCategory, selectedProductType]);

  // WRAP & BORDER tab
  const [selectedWrapId, setSelectedWrapId] = useState<string>('full-bleed');
  const [mirrorImage, setMirrorImage] = useState<boolean>(false);
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('no-frame');

  // HARDWARE & FINISH tab: Strictly defaults to "No Hooks" (no-hooks) across all products
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('thin-gallery');
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('no-hooks');
  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('open-back');

  // Select Size & Shape Modal State
  const [isSizeShapeModalOpen, setIsSizeShapeModalOpen] = useState<boolean>(false);

  // Automatically sync default shape, hardware, and thickness when product selection changes
  useEffect(() => {
    const pt = CANVAS_PRODUCT_TYPES.find((p) => p.id === selectedProductTypeId);
    if (pt) {
      if (pt.defaultShape) setSelectedShapeId(pt.defaultShape);
      if (pt.defaultHardwareId) setSelectedHardwareId(pt.defaultHardwareId);
      if (pt.defaultThicknessId) setSelectedThicknessId(pt.defaultThicknessId);
      if (pt.supportedShapeIds && !pt.supportedShapeIds.includes(selectedShapeId)) {
        setSelectedShapeId(pt.defaultShape || 'shape-rectangle');
      }
    }
  }, [selectedProductTypeId, selectedShapeId]);

  // Master selection handler for all 21 Canvas products
  const selectCanvasProduct = (productId: string) => {
    const pt = CANVAS_PRODUCT_TYPES.find((p) => p.id === productId);
    if (!pt) return;

    setSelectedProductTypeId(productId);
    setIsCustomSize(false);
    setActivePanelIndex(0);

    // 1. Immediately apply product default shape
    if (pt.defaultShape) {
      setSelectedShapeId(pt.defaultShape);
    }

    // 2. Select first compatible size option for this product
    const matchingSizes = SIZE_OPTIONS.filter((s) => s.productTypeId === productId);
    if (matchingSizes.length > 0) {
      setSelectedSizeId(matchingSizes[0].id);
    }

    // 3. Apply default hardware & thickness (strictly no-hooks default)
    setSelectedHardwareId(pt.defaultHardwareId || 'no-hooks');
    if (pt.defaultThicknessId) {
      setSelectedThicknessId(pt.defaultThicknessId);
    }

    // 4. Apply default layout preset
    if (pt.defaultLayoutId) {
      setExpandedLayoutId(pt.defaultLayoutId);
    }

    // 5. Immediately open the "Select size & shape" popup modal
    setIsSizeShapeModalOpen(true);
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

      if (config.arrangement) {
        if (config.arrangement === 'threeCollage' || config.arrangement === 'threeSplit') {
          setExpandedLayoutId('layout-3-collage');
        } else if (config.arrangement === 'fourGrid') {
          setExpandedLayoutId('layout-4-grid');
        }
      }
    }

    // Uploaded customer images remain attached and refitted cleanly
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
            fitMode: 'contain'
          };
        }
      });
      return next;
    });
  };

  // OPTIONS tab
  const [selectedLaminationId, setSelectedLaminationId] = useState<string>('standard');
  const [retouchChecks, setRetouchChecks] = useState<Record<string, boolean>>({});
  const [majorRetouchText, setMajorRetouchText] = useState<string>('');
  const [proofRequested, setProofRequested] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Material Variant (from Change Material modal)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('standard-cotton');
  const [materialModalOpen, setMaterialModalOpen] = useState<boolean>(false);

  // Dedicated Lyric Canvas State (for canvas-lyric product typography overlay)
  const [lyricTitle, setLyricTitle] = useState<string>('PERFECT');
  const [lyricArtist, setLyricArtist] = useState<string>('ED SHEERAN');
  const [lyricText, setLyricText] = useState<string>(
    "Baby, I'm dancing in the dark\nWith you between my arms\nBarefoot on the grass\nListening to our favorite song\nWhen you said you looked a mess\nI whispered underneath my breath\nYou heard it, darling\nYou look perfect tonight"
  );
  const [lyricFontFamily, setLyricFontFamily] = useState<'serif' | 'script' | 'sans' | 'cinzel'>('serif');
  const [lyricTextColor, setLyricTextColor] = useState<string>('#FFFFFF');
  const [lyricTemplate, setLyricTemplate] = useState<'center-minimal' | 'music-player' | 'elegant-script' | 'split-card'>('center-minimal');
  const [lyricOverlayDarkness, setLyricOverlayDarkness] = useState<number>(35);

  // Creative Tools State
  // Free-form text + clipart: any number of items, each draggable anywhere on the print
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [clipItems, setClipItems] = useState<ClipItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [showTextPopover, setShowTextPopover] = useState<boolean>(false);
  const [showClipartPopover, setShowClipartPopover] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; w: number; h: number } | null>(null);

  const selectedTextItem = selectedItem?.type === 'text' ? textItems.find((t) => t.id === selectedItem.id) || null : null;
  const selectedClipItem = selectedItem?.type === 'clip' ? clipItems.find((c) => c.id === selectedItem.id) || null : null;
  const customText = textItems.map((t) => t.text).join(' | ');

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
  const [roomViewState, setRoomViewState] = useState<RoomPlacementState>({
    roomPreset: 'office',
    customRoomUrl: null,
    productRoomX: 0.22,
    productRoomY: 0.33
  });

  const [viewerRotation, setViewerRotation] = useState<number>(-24);
  const [viewerTiltX, setViewerTiltX] = useState<number>(6);
  const [viewerAutoRotate, setViewerAutoRotate] = useState<boolean>(false);
  const [isViewerDragging, setIsViewerDragging] = useState<boolean>(false);
  const viewerDragRef = useRef<{ x: number; y: number; startRotation: number; startTiltX: number } | null>(null);

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
        textItems,
        clipItems,
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

    const thickness = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId);
    if (thickness) price += thickness.price;

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
    selectedThicknessId,
    selectedBorderWidthId,
    selectedFrameId,
    selectedHardwareId,
    selectedDisplayOptionId,
    selectedLaminationId,
    selectedMaterialId
  ]);

  const totalPrice = unitPrice * quantity;

  // Single source of truth for whether at least ONE valid customer image is currently uploaded
  const hasUploadedImage = useMemo(() => {
    const anySlotHasImage = Object.values(panelImages).some(
      (p) => Boolean(p?.imageUrl && p.imageUrl.trim().length > 0)
    );
    const anyTrayHasImage = uploadedPhotos.some(
      (url) => Boolean(url && url.trim().length > 0)
    );
    return anySlotHasImage || anyTrayHasImage;
  }, [panelImages, uploadedPhotos]);

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

  // File Upload Handler
  // Files go to the frame that asked for them; extra files fill the following frames, the rest just join the uploads tray.
  const handleFilesUpload = (files: FileList | File[] | null, startIdx: number = uploadTargetRef.current) => {
    if (!files || files.length === 0) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

    Array.from(files).forEach((file, i) => {
      if (file.size > 40 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 40MB limit.`);
        return;
      }
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
        alert(`File ${file.name} is not a supported format (JPG, PNG, WEBP, BMP).`);
        return;
      }

      const target = startIdx + i;
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
            if (i === 0 || target < panels.length) {
              const idx = target < panels.length ? target : startIdx;
              setPanelImages((prev) => ({
                ...prev,
                [idx]: {
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
              setActivePanelIndex(idx);
            }
            setValidationWarning(null);
            endPreloader(PRELOADER_MIN_MS);
          };
          img.onerror = () => {
            setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
            if (i === 0 || target < panels.length) {
              const idx = target < panels.length ? target : startIdx;
              setPanelImages((prev) => ({ ...prev, [idx]: { ...createDefaultPanel(), imageUrl: result } }));
              setActivePanelIndex(idx);
            }
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
          fitMode: 'contain'
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files, panelIdx);
    }
  };

  // Spread onto any frame element: click, drag-image-to-pan, and drop targets
  const panelHandlers = (panelIdx: number) => ({
    onClick: () => handlePanelClick(panelIdx),
    onPointerDown: (e: React.PointerEvent) => handlePointerDown(e, panelIdx),
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

  // --- Text & clipart items (freely movable) ---
  const addTextItem = (text = 'Your text') => {
    const id = `txt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const item: TextItem = { id, text, fontId: 'playfair', size: 32, color: '#FFFFFF', bold: false, italic: false, x: 50, y: 50 };
    setTextItems((prev) => [...prev, item]);
    setSelectedItem({ type: 'text', id });
    setShowTextPopover(true);
    setShowClipartPopover(false);
  };
  const updateTextItem = (id: string, patch: Partial<TextItem>) => setTextItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addClipItem = (emoji: string) => {
    const id = `clip-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setClipItems((prev) => [...prev, { id, emoji, size: 56, x: 50, y: 50 }]);
    setSelectedItem({ type: 'clip', id });
  };
  const updateClipItem = (id: string, patch: Partial<ClipItem>) => setClipItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeSelectedItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === 'text') setTextItems((prev) => prev.filter((t) => t.id !== selectedItem.id));
    else setClipItems((prev) => prev.filter((c) => c.id !== selectedItem.id));
    setSelectedItem(null);
  };

  const startItemDrag = (e: React.PointerEvent, type: 'text' | 'clip', id: string, x: number, y: number) => {
    e.stopPropagation();
    setSelectedItem({ type, id });
    if (type === 'text') setShowTextPopover(true);
    else setShowClipartPopover(true);
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    itemDragRef.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, w: rect.width, h: rect.height };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const moveItemDrag = (e: React.PointerEvent, type: 'text' | 'clip', id: string) => {
    const d = itemDragRef.current;
    if (!d) return;
    const nx = Math.max(0, Math.min(100, d.origX + ((e.clientX - d.startX) / d.w) * 100));
    const ny = Math.max(0, Math.min(100, d.origY + ((e.clientY - d.startY) / d.h) * 100));
    if (type === 'text') updateTextItem(id, { x: nx, y: ny });
    else updateClipItem(id, { x: nx, y: ny });
  };
  const endItemDrag = () => {
    itemDragRef.current = null;
  };

  const updateActivePanelTransform = (updater: (curr: PanelImageState) => Partial<PanelImageState>) => {
    setPanelImages((prev) => {
      const curr = prev[activePanelIndex] || createDefaultPanel();
      return { ...prev, [activePanelIndex]: { ...curr, ...updater(curr) } };
    });
  };

  const handleZoomIn = () => updateActivePanelTransform((curr) => ({ scale: Math.min(3, curr.scale + 0.15) }));
  const handleZoomOut = () => updateActivePanelTransform((curr) => ({ scale: Math.max(0.4, curr.scale - 0.15) }));
  const handleRotateLeft = () => updateActivePanelTransform((curr) => ({ rotation: (curr.rotation - 90 + 360) % 360 }));
  const handleRotateRight = () => updateActivePanelTransform((curr) => ({ rotation: (curr.rotation + 90) % 360 }));
  const handleRotate90 = handleRotateRight;
  const handleFit = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, fitMode: 'contain' }));
  const handleReset = () => updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, rotation: 0, fitMode: 'contain' }));
  const handleApplyFilter = (filter: ColorFilterType) => updateActivePanelTransform(() => ({ filter }));

  // Fill: makes the uploaded image completely cover the canvas area (cover crop), preserving original image intact
  const handleFill = (panelIdx = activePanelIndex) => {
    setPanelImages((prev) => {
      const curr = prev[panelIdx] || createDefaultPanel();
      return {
        ...prev,
        [panelIdx]: {
          ...curr,
          fitMode: 'cover'
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

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!panelImages[activePanelIndex]?.imageUrl) return;
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    updateActivePanelTransform((curr) => ({
      scale: Math.max(0.4, Math.min(4, (curr.scale || 1) + delta))
    }));
  };

  // Smooth 60fps 360° auto-rotate loop using requestAnimationFrame
  useEffect(() => {
    if (!viewerAutoRotate || viewerMode !== '360' || isViewerDragging) return;
    let rafId = 0;
    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = Math.min(0.064, (now - lastTime) / 1000);
      lastTime = now;
      setViewerRotation((prev) => prev + dt * 36);
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
    setViewerRotation(viewerDragRef.current.startRotation + deltaX * 0.65);
    if (viewerMode === '3d' || viewerMode === '360') {
      setViewerTiltX(Math.max(-32, Math.min(32, viewerDragRef.current.startTiltX - deltaY * 0.38)));
    }
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
    const { initialPanX, initialPanY } = dragStartRef.current;

    updateActivePanelTransform(() => ({
      panX: initialPanX + deltaX,
      panY: initialPanY + deltaY
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

  // Apply a design template: sets a canned caption + the template's vector decoration
  const handleApplyTemplate = (tpl: DesignTemplate) => {
    setSelectedTemplateId(tpl.id);
    // The caption is a normal text item (id "tpl-text"): one per template, movable and editable like any other
    setTextItems((prev) => {
      const rest = prev.filter((t) => t.id !== 'tpl-text');
      return [...rest, { id: 'tpl-text', text: tpl.textPreset, fontId: 'playfair', size: 34, color: '#FFFFFF', bold: true, italic: false, x: 50, y: 86 }];
    });
    setSelectedItem({ type: 'text', id: 'tpl-text' });
  };

  const activeTemplate = useMemo(() => DESIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) || null, [selectedTemplateId]);

  // Width / height ratio of the print: fixed for symmetric shapes (circle, heart...), otherwise follows the chosen size.
  const printAspect = useMemo(() => {
    if (shapeApplies && currentShape.isSingleDimension) return 1;
    if (isCustomSize && canUseCustomSize) return customWidth / customHeight;
    const p = panels[0];
    return p ? p.widthRatio / p.heightRatio : 1;
  }, [shapeApplies, currentShape, isCustomSize, canUseCustomSize, customWidth, customHeight, panels]);

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
    const boxClass = `rounded-[3px] border-2 transition-colors ${
      isSelected
        ? 'border-[#0E4A93] bg-[#0E4A93]/20'
        : 'border-stone-400 bg-[#0E4A93]/12 group-hover:border-[#0E4A93]'
    }`;

    if (opt.productTypeId === 'canvas-wall-art' && opt.panels.length === 3) {
      return (
        <div className="w-11 h-10 flex flex-col gap-0.5">
          <div className={`flex-[1.3] ${boxClass}`} />
          <div className="flex-1 grid grid-cols-2 gap-0.5">
            <div className={boxClass} />
            <div className={boxClass} />
          </div>
        </div>
      );
    }
    if (opt.productTypeId === 'canvas-wall-art' && opt.panels.length === 4) {
      return (
        <div className="w-11 h-10 grid grid-cols-2 grid-rows-2 gap-0.5">
          <div className={boxClass} />
          <div className={boxClass} />
          <div className={boxClass} />
          <div className={boxClass} />
        </div>
      );
    }
    if (opt.productTypeId === 'canvas-split') {
      return (
        <div className="w-12 h-9 grid grid-cols-3 gap-0.5">
          <div className={boxClass} />
          <div className={boxClass} />
          <div className={boxClass} />
        </div>
      );
    }
    if (opt.productTypeId === 'canvas-collage') {
      const cols = opt.panels.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
      return (
        <div className={`w-11 h-10 grid ${cols} gap-0.5`}>
          {opt.panels.map((p) => (
            <div key={p.id} className={boxClass} />
          ))}
        </div>
      );
    }
    const p0 = opt.panels[0];
    const ratio = p0 ? p0.widthRatio / p0.heightRatio : 1;
    const clamped = Math.max(0.65, Math.min(2.1, ratio));
    const h = clamped > 1.4 ? 26 : 36;
    const w = Math.round(h * clamped);
    return <div style={{ width: `${w}px`, height: `${h}px` }} className={boxClass} />;
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
      base: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label || 'No Hooks',
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
        clipart: clipItems.map((c) => c.emoji),
        customText,
        textItems: textItems.map((t) => ({ text: t.text, font: FONT_OPTIONS.find((f) => f.id === t.fontId)?.label, color: t.color, size: t.size, x: t.x, y: t.y })),
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
                  Slot {panelIdx + 1} {panelSpec?.dimension ? `(${panelSpec.dimension})` : ''}
                </span>
              </div>
            )}
            {panelSpec?.dimension && (
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
                {panelSpec.dimension}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // Split Product: Single continuous image sliced across physical canvas panels
  const renderContinuousSplitCanvas = () => {
    const splitPanels = currentSizeOption.panels && currentSizeOption.panels.length >= 2
      ? currentSizeOption.panels
      : [
          { id: 'p0', label: 'Left', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
          { id: 'p1', label: 'Center', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
          { id: 'p2', label: 'Right', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
        ];
    const N = splitPanels.length;
    const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
    const master = panelImages[0] || createDefaultPanel();
    const gapPx = 12;

    return (
      <div className="w-full max-w-2xl mx-auto my-auto p-4 flex flex-col items-center select-none">
        <div
          className="relative flex items-center justify-center w-full"
          style={{
            gap: `${gapPx}px`,
            filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.22)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.12))'
          }}
        >
          {splitPanels.map((pSpec, i) => {
            const panelAspect = `${pSpec.widthRatio || 12} / ${pSpec.heightRatio || 24}`;
            return (
              <div
                key={pSpec.id || i}
                {...panelHandlers(0)}
                style={{
                  flex: 1,
                  aspectRatio: panelAspect,
                  boxShadow: '4px 6px 0px rgba(203, 213, 225, 0.8), 0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                className={`relative bg-stone-100 rounded-lg overflow-hidden transition-all group ${
                  masterImage ? 'cursor-grab active:cursor-grabbing ring-1 ring-black/10' : 'cursor-pointer hover:border-[#0E4A93]'
                }`}
                onClick={() => {
                  if (!masterImage) fileInputRef.current?.click();
                }}
              >
                {/* 3D Stretcher Edge Visual on each panel */}
                <div
                  className="absolute inset-0 pointer-events-none z-20 rounded-lg"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4), inset 2px 2px 4px rgba(0,0,0,0.15)'
                  }}
                />

                {masterImage ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `calc(-${i * 100}% - ${i * gapPx}px)`,
                      width: `calc(${N * 100}% + ${(N - 1) * gapPx}px)`,
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  >
                    <img
                      src={masterImage}
                      alt={`Split Panel ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: master.fitMode === 'contain' ? 'contain' : 'cover',
                        transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                        filter: getFilterCss(master.filter),
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                      }}
                      className="pointer-events-none"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-50/90 group-hover:bg-blue-50/40 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-110 transition-all mb-1">
                      <Upload className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-600 group-hover:text-[#0E4A93]">
                      Panel {i + 1}
                    </span>
                    <span className="text-[9px] text-stone-400">
                      {pSpec.dimension}
                    </span>
                  </div>
                )}

                {/* Panel Dimension Tag */}
                <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
                  {pSpec.dimension || `Panel ${i + 1}`}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] font-semibold text-stone-500 mt-3 text-center">
          1 Photo Split Continuously Across {N} Physical Panels • Drag photo to pan, use toolbar to Zoom/Rotate/Fill/Fix
        </p>
      </div>
    );
  };

  // Dedicated Lyric Canvas Typography Overlay (for canvas-lyric)
  const renderLyricOverlay = (scaleFactor: number = 1) => {
    const fontFamilies: Record<string, string> = {
      serif: 'Georgia, Cambria, "Times New Roman", serif',
      script: '"Brush Script MT", "Caveat", "Dancing Script", cursive',
      sans: 'system-ui, -apple-system, Montserrat, sans-serif',
      cinzel: 'Cinzel, Georgia, serif'
    };
    const resolvedFont = fontFamilies[lyricFontFamily] || fontFamilies.serif;

    return (
      <div
        className="absolute inset-0 z-25 flex flex-col justify-end p-4 sm:p-6 pointer-events-none select-none"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,${lyricOverlayDarkness / 100}) 0%, rgba(0,0,0,${(lyricOverlayDarkness / 100) * 0.45}) 60%, transparent 100%)`,
          color: lyricTextColor,
          fontFamily: resolvedFont
        }}
      >
        {lyricTemplate === 'music-player' ? (
          <div className="space-y-2 max-w-full drop-shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <span className="text-xs">▶</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black tracking-wide truncate uppercase">{lyricTitle || 'Song Title'}</div>
                <div className="text-[11px] font-semibold opacity-90 truncate">{lyricArtist || 'Artist Name'}</div>
              </div>
            </div>
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden my-1">
              <div className="w-2/5 h-full bg-white rounded-full" />
            </div>
            <div className="text-[11px] leading-relaxed whitespace-pre-line opacity-95 max-h-36 overflow-hidden">
              {lyricText}
            </div>
          </div>
        ) : lyricTemplate === 'elegant-script' ? (
          <div className="text-center space-y-1.5 drop-shadow-lg my-auto">
            <div className="text-xl sm:text-2xl font-normal italic tracking-wide">{lyricTitle || 'Perfect'}</div>
            <div className="w-16 h-[1px] bg-current mx-auto opacity-70 my-1" />
            <div className="text-[10px] sm:text-xs font-light tracking-widest uppercase opacity-80">{lyricArtist || 'Ed Sheeran'}</div>
            <div className="text-xs sm:text-sm italic leading-relaxed whitespace-pre-line opacity-95 mt-2 max-h-40 overflow-hidden">
              {lyricText}
            </div>
          </div>
        ) : lyricTemplate === 'split-card' ? (
          <div className="bg-black/50 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 space-y-1.5 drop-shadow-md">
            <div className="flex justify-between items-baseline border-b border-white/20 pb-1">
              <span className="text-xs font-black tracking-wider uppercase">{lyricTitle}</span>
              <span className="text-[10px] opacity-80">{lyricArtist}</span>
            </div>
            <div className="text-[10px] leading-relaxed whitespace-pre-line opacity-90 max-h-32 overflow-hidden">
              {lyricText}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1.5 drop-shadow-md mb-2">
            <div className="text-xs sm:text-sm font-black tracking-widest uppercase">{lyricTitle || 'Song Title'}</div>
            <div className="text-[10px] tracking-wider uppercase opacity-80">{lyricArtist || 'Artist Name'}</div>
            <div className="w-12 h-[1px] bg-current mx-auto opacity-60 my-1" />
            <div className="text-[11px] sm:text-xs leading-relaxed whitespace-pre-line font-medium opacity-95 max-h-36 overflow-hidden">
              {lyricText}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Photo Mosaic (canvas-mosaic): Multi-tile grid geometry with physical seams and live size updates
  const renderMosaicCanvas = () => {
    const tilePanels = currentSizeOption.panels && currentSizeOption.panels.length > 0
      ? currentSizeOption.panels
      : Array.from({ length: 4 }, (_, i) => ({ id: `p${i}`, label: `Tile ${i + 1}`, dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 }));
    const count = tilePanels.length;
    const colsClass = count === 4 ? 'grid-cols-2' : count === 6 ? 'grid-cols-3' : count === 9 ? 'grid-cols-3' : count === 16 ? 'grid-cols-4' : 'grid-cols-2';
    const aspectClass = count === 6 ? 'aspect-[18/12]' : 'aspect-square';
    const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;

    const totalCols = count === 4 ? 2 : count === 6 ? 3 : count === 9 ? 3 : 4;
    const totalRows = count === 4 ? 2 : count === 6 ? 2 : count === 9 ? 3 : 4;

    return (
      <div className="w-full max-w-xl mx-auto my-auto p-4 flex flex-col items-center select-none">
        <div
          className={`grid ${colsClass} gap-2 sm:gap-2.5 w-full ${aspectClass} p-3 bg-stone-100/90 rounded-2xl border-2 border-stone-300 shadow-2xl`}
          style={{
            maxWidth: count === 6 ? '32rem' : '26rem',
            boxShadow: '6px 8px 0px #CBD5E1, 0 25px 50px -12px rgba(15, 23, 42, 0.35)'
          }}
        >
          {tilePanels.map((pSpec, i) => {
            const panel = panelImages[i];
            const hasIndividualPhoto = Boolean(panel?.imageUrl);
            const displayPhoto = hasIndividualPhoto ? panel.imageUrl : masterImage;
            const isTarget = activePanelIndex === i;

            const colIdx = i % totalCols;
            const rowIdx = Math.floor(i / totalCols);

            return (
              <div
                key={pSpec.id || i}
                {...panelHandlers(i)}
                onWheel={handleWheel}
                className={`relative w-full h-full bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
                  isTarget
                    ? 'border-[#0E4A93] shadow-lg ring-2 ring-[#0E4A93]/40 z-20'
                    : 'border-stone-200 hover:border-stone-400 shadow-xs'
                }`}
                style={{
                  boxShadow: '2px 3px 0px #CBD5E1, 0 6px 12px -2px rgba(15, 23, 42, 0.12)'
                }}
              >
                {dragOverPanel === i && (
                  <div className="absolute inset-0 z-30 bg-[#E8752A]/25 border-4 border-dashed border-[#E8752A] pointer-events-none" />
                )}

                {displayPhoto ? (
                  <div className="w-full h-full overflow-hidden relative">
                    {hasIndividualPhoto ? (
                      <img
                        src={panel.imageUrl!}
                        alt={`Tile ${i + 1}`}
                        style={{
                          transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                          filter: getFilterCss(panel.filter),
                          objectFit: panel.fitMode === 'contain' ? 'contain' : 'cover'
                        }}
                        className="w-full h-full pointer-events-none"
                      />
                    ) : (
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{
                          backgroundImage: `url(${displayPhoto})`,
                          backgroundSize: `${totalCols * 100}% ${totalRows * 100}%`,
                          backgroundPosition: `${(colIdx / (totalCols - 1 || 1)) * 100}% ${(rowIdx / (totalRows - 1 || 1)) * 100}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors p-1 text-center">
                    <div className="w-6 h-6 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-105 transition-all mb-0.5">
                      <Upload className="w-3 h-3 stroke-[2.2]" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-600">Tile {i + 1}</span>
                    <span className="text-[8px] text-stone-400">{pSpec.dimension || '6"×6"'}</span>
                  </div>
                )}

                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1 py-0.5 rounded z-20 pointer-events-none">
                  {pSpec.dimension || `Tile ${i + 1}`}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] font-semibold text-stone-500 mt-2.5 text-center">
          Photo Mosaic • {count} Canvas Tiles Grid • Upload 1 photo to tile across seams, or click individual tiles to customize
        </p>
      </div>
    );
  };

  // Wall Display (canvas-wall-art): Multi-panel gallery collection with physical 3D canvas bevels
  const renderWallDisplayCanvas = () => {
    const wallPanels = currentSizeOption.panels && currentSizeOption.panels.length > 0
      ? currentSizeOption.panels
      : [
          { id: 'p0', label: 'Left Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
          { id: 'p1', label: 'Center Large', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 },
          { id: 'p2', label: 'Right Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
        ];

    const isTriptych = currentSizeOption.diagramType === 'wall-display-triptych';
    const isThreeSplit = currentSizeOption.arrangement === 'threeSplit' || currentSizeOption.diagramType === 'wall-display-3b';
    const isThreeCollage = currentSizeOption.arrangement === 'threeCollage' || currentSizeOption.diagramType === 'wall-display-3a';
    const isFivePiece = wallPanels.length === 5 || currentSizeOption.diagramType === 'wall-display-5piece';
    const isTiered = currentSizeOption.diagramType === 'wall-display-tiered';

    const renderPanelSlot = (idx: number, customAspect?: string, extraClass: string = '') => {
      const pSpec = wallPanels[idx] || { id: `p${idx}`, label: `Panel ${idx + 1}`, dimension: '' };
      const panel = panelImages[idx] || createDefaultPanel();
      const isTarget = activePanelIndex === idx;

      return (
        <div
          key={pSpec.id || idx}
          {...panelHandlers(idx)}
          onWheel={handleWheel}
          style={{
            boxShadow: '4px 6px 0px #CBD5E1, 0 20px 25px -5px rgba(15, 23, 42, 0.25)'
          }}
          className={`relative bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
            customAspect ? customAspect : ''
          } ${extraClass} ${
            isTarget
              ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40 z-20'
              : 'border-stone-300 hover:border-stone-400'
          }`}
        >
          {dragOverPanel === idx && (
            <div className="absolute inset-0 z-30 bg-[#E8752A]/25 border-4 border-dashed border-[#E8752A] pointer-events-none" />
          )}

          {panel.imageUrl ? (
            <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
              <img
                src={panel.imageUrl}
                alt={pSpec.label || `Panel ${idx + 1}`}
                style={{
                  transform: `translate(${panel.panX}px, ${panel.panY}px) scale(${panel.scale}) rotate(${panel.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                  filter: getFilterCss(panel.filter),
                  objectFit: panel.fitMode === 'contain' ? 'contain' : 'cover',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="max-w-none w-full h-full pointer-events-none"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50/90 hover:bg-stone-100 transition-colors p-2 text-center">
              <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-105 transition-all mb-1">
                <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-stone-600">{pSpec.label || `Panel ${idx + 1}`}</span>
              {pSpec.dimension && <span className="text-[9px] text-stone-400">{pSpec.dimension}</span>}
            </div>
          )}

          {pSpec.dimension && (
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
              {pSpec.dimension}
            </div>
          )}
        </div>
      );
    };

    if (wallPanels.length === 3 && (isThreeSplit || isTriptych)) {
      return (
        <div className="flex items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto my-auto p-4 select-none">
          {isTriptych ? (
            [0, 1, 2].map((idx) => (
              <div key={idx} className="flex-1 max-w-[170px]">
                {renderPanelSlot(idx, 'aspect-[12/24]')}
              </div>
            ))
          ) : (
            <>
              <div className="flex-1 max-w-[140px] self-center">
                {renderPanelSlot(0, 'aspect-[8/10]')}
              </div>
              <div className="flex-[1.4] max-w-[200px]">
                {renderPanelSlot(1, 'aspect-[16/20]')}
              </div>
              <div className="flex-1 max-w-[140px] self-center">
                {renderPanelSlot(2, 'aspect-[8/10]')}
              </div>
            </>
          )}
        </div>
      );
    }

    if (wallPanels.length === 3 && isThreeCollage) {
      return (
        <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto my-auto p-4 select-none">
          <div className="w-full">
            {renderPanelSlot(0, 'aspect-[18/12]')}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {renderPanelSlot(1, 'aspect-[8/10]')}
            {renderPanelSlot(2, 'aspect-[8/10]')}
          </div>
        </div>
      );
    }

    if (isFivePiece) {
      return (
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full max-w-3xl mx-auto my-auto p-3 select-none">
          <div className="flex-1 max-w-[100px] self-center">{renderPanelSlot(3, 'aspect-[8/10]')}</div>
          <div className="flex-[1.2] max-w-[125px] self-center">{renderPanelSlot(1, 'aspect-[12/18]')}</div>
          <div className="flex-[1.5] max-w-[160px]">{renderPanelSlot(0, 'aspect-[18/24]')}</div>
          <div className="flex-[1.2] max-w-[125px] self-center">{renderPanelSlot(2, 'aspect-[12/18]')}</div>
          <div className="flex-1 max-w-[100px] self-center">{renderPanelSlot(4, 'aspect-[8/10]')}</div>
        </div>
      );
    }

    if (isTiered) {
      return (
        <div className="grid grid-cols-4 gap-2.5 items-end w-full max-w-2xl mx-auto my-auto p-4 select-none">
          {renderPanelSlot(0, 'aspect-[8/10]')}
          {renderPanelSlot(1, 'aspect-[11/14]')}
          {renderPanelSlot(2, 'aspect-[16/20]')}
          {renderPanelSlot(3, 'aspect-[8/10]')}
        </div>
      );
    }

    if (wallPanels.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto my-auto p-4 select-none">
          {renderPanelSlot(0, 'aspect-square')}
          {renderPanelSlot(1, 'aspect-square')}
          {renderPanelSlot(2, 'aspect-square')}
          {renderPanelSlot(3, 'aspect-square')}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl mx-auto my-auto p-4 select-none">
        {wallPanels.map((_, idx) => renderPanelSlot(idx, 'aspect-square'))}
      </div>
    );
  };

  // Photo Collage (canvas-collage): Single canvas frame containing internal photo slots
  // 3 photos renders 1 large top photo + 2 smaller bottom photos (NEVER 3 vertical columns!)
  const renderCollageCanvas = () => {
    const renderCollageSlot = (panelIdx: number) => {
      const panel = panelImages[panelIdx] || createDefaultPanel();
      const panelSpec = panels[panelIdx];
      const isTarget = activePanelIndex === panelIdx;

      return (
        <div
          key={panelIdx}
          {...panelHandlers(panelIdx)}
          className={`relative w-full h-full min-h-[110px] bg-stone-50 rounded-lg overflow-hidden transition-all cursor-pointer group ${
            isTarget
              ? 'ring-2 ring-inset ring-[#0E4A93] z-20 shadow-md'
              : 'border border-stone-200/90 hover:border-stone-300'
          }`}
        >
          {dragOverPanel === panelIdx && (
            <div className="absolute inset-0 z-30 bg-blue-500/20 border-2 border-dashed border-[#0E4A93] pointer-events-none" />
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
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors p-2 text-center">
              <div className="w-7 h-7 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:scale-105 transition-all mb-1">
                <Upload className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 group-hover:text-[#0E4A93]">
                Slot {panelIdx + 1} {panelSpec?.dimension ? `(${panelSpec.dimension})` : ''}
              </span>
              <span className="text-[9px] text-stone-400">Click to upload</span>
            </div>
          )}
          {panelSpec?.dimension && (
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
              {panelSpec.dimension}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        className="relative rounded-2xl bg-white p-2.5 sm:p-3 overflow-hidden transition-all cursor-pointer shadow-2xl border-2 border-stone-300 mx-auto my-auto"
        style={{
          aspectRatio: panels.length === 2 ? '16/10' : panels.length === 3 ? '16/12' : '1/1',
          width: `min(27rem, calc(48vh * ${panels.length === 2 ? 1.6 : panels.length === 3 ? 1.33 : 1}))`,
          maxWidth: '100%',
          boxShadow: '5px 7px 0px #CBD5E1, 0 25px 50px -12px rgba(15, 23, 42, 0.38)'
        }}
      >
        {panels.length === 3 ? (
          // 1 large top photo + 2 smaller bottom photos (NEVER 3 vertical columns!)
          <div className="flex flex-col gap-2 w-full h-full">
            <div className="flex-[1.35] w-full min-h-0">
              {renderCollageSlot(0)}
            </div>
            <div className="flex-1 w-full min-h-0 grid grid-cols-2 gap-2">
              {renderCollageSlot(1)}
              {renderCollageSlot(2)}
            </div>
          </div>
        ) : (
          <div className={`grid ${panels.length === 2 ? 'grid-cols-2' : panels.length === 9 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 w-full h-full`}>
            {panels.map((_, panelIdx) => renderCollageSlot(panelIdx))}
          </div>
        )}
      </div>
    );
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
          backLink="/canvas"
          backLabel="Back to Canvas"
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
                <span>Base ({isCustomSize && canUseCustomSize ? `${customWidth}"×${customHeight}"` : currentSizeOption.dimensionsSummary}):</span>
                <span className="font-bold text-stone-900">₹{sizePrice}</span>
              </div>
              {selectedWrapId !== 'canvas-lite' && (
                <div className="flex justify-between">
                  <span>Wrap:</span>
                  <span className="font-bold text-stone-900">+₹{WRAP_OPTIONS.find((w) => w.id === selectedWrapId)?.price}</span>
                </div>
              )}
              {selectedHardwareId !== 'no-hooks' && (
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

      {/* ===================================================================== */}
      {/* 2. BODY CONTAINER: 3-COLUMN LAYOUT (Shared with Acrylic Customizer)   */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* COLUMN 1: LEFT VERTICAL SIDEBAR */}
        <CustomizerSidebar
          items={toolbarItems}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* COLUMN 2: CONFIGURATION PANEL */}
        <CustomizerPanel
          title={activeTab === 'SHAPES' || activeTab === 'SHAPE' ? 'SHAPES' : activeTab}
          metaText={
            activeTab === 'PRODUCTS'
              ? `${CANVAS_PRODUCT_TYPES.length} Styles`
              : activeTab === 'UPLOAD'
              ? `${uploadedPhotos.length} Photos`
              : activeTab === 'SHAPES' || activeTab === 'SHAPE'
              ? `${filteredShapes.length} Shapes`
              : activeTab === 'SELECT SIZE'
              ? `${availableSizeOptions.length + (canUseCustomSize ? 1 : 0)} Options`
              : activeTab === 'LAYOUTS & DESIGNS'
              ? selectedProductTypeId === 'canvas-lyric'
                ? 'Lyrics & Typography'
                : layoutSubTab === 'LAYOUTS'
                ? `${filteredLayoutPresets.length} Layouts`
                : `${DESIGN_TEMPLATE_CATEGORIES.length} Categories`
              : activeTab === 'WRAP & BORDER'
              ? `${WRAP_OPTIONS.length} Options`
              : activeTab === 'HARDWARE & FINISH'
              ? `${HARDWARE_OPTIONS.length} Hardware`
              : 'Specifications'
          }
        >
          {/* ---------------------------- PRODUCTS ---------------------------- */}
          {activeTab === 'PRODUCTS' && (
            <CustomizerProductSelector
              activeMaterial="canvas"
              products={CANVAS_PRODUCT_TYPES}
              selectedProductId={selectedProductTypeId}
              onSelectProduct={selectCanvasProduct}
              onSwitchMaterial={() => navigate('/customize/acrylic/acrylic-photo-panel')}
            />
          )}

          {/* ----------------------------- UPLOAD ------------------------------ */}
          {activeTab === 'UPLOAD' && (
            <div className="p-4 space-y-4">
              {/* Source Switcher (PC/Laptop, Phone, Gallery, Art Generator) */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'computer' as const, label: 'PC or Laptop', icon: Monitor },
                  { id: 'phone' as const, label: 'Upload from phone', icon: Smartphone },
                  { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon },
                  { id: 'ai' as const, label: 'Art Generator', icon: Sparkles }
                ].map((src) => {
                  const Icon = src.icon;
                  const isSelected = uploadSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setUploadSource(src.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0E4A93] bg-blue-50/40 text-[#0E4A93] shadow-xs'
                          : 'border-stone-200 text-stone-500 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold leading-tight">{src.label}</span>
                    </button>
                  );
                })}
              </div>

              {uploadSource === 'computer' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFilesUpload(e.dataTransfer.files, activePanelIndex);
                  }}
                  onClick={() => {
                    uploadTargetRef.current = activePanelIndex;
                    fileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-[#0E4A93]/40 hover:border-[#0E4A93] bg-blue-50/30 hover:bg-blue-50/60 rounded-2xl p-6 text-center transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0E4A93] text-white flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-black text-stone-900">Click or Drag Photos Here</div>
                  <p className="text-xs text-stone-500 mt-1">Supports high-resolution JPG, PNG, WEBP &amp; BMP up to 40MB</p>
                  <span className="inline-block mt-3 px-4 py-1.5 bg-[#0E4A93] text-white text-xs font-extrabold rounded-lg shadow-xs">
                    Browse Files
                  </span>
                </div>
              )}

              {uploadSource === 'phone' && (
                <div
                  onClick={() => {
                    uploadTargetRef.current = activePanelIndex;
                    phoneInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-[#0E4A93]/40 hover:border-[#0E4A93] bg-blue-50/30 hover:bg-blue-50/60 rounded-2xl p-6 text-center transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0E4A93] text-white flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-black text-stone-900">Upload from Phone or Camera</div>
                  <p className="text-xs text-stone-500 mt-1">
                    On a phone or tablet this opens your camera or photo library. On a computer it opens the file picker.
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 bg-[#0E4A93] text-white text-xs font-extrabold rounded-lg shadow-xs">
                    <Smartphone className="w-3.5 h-3.5" /> Take / Choose Photo
                  </span>
                </div>
              )}

              {uploadSource === 'gallery' && (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-stone-500">Sample photos — click one to place it, or drag it onto a frame.</p>
                  <div className="grid grid-cols-4 gap-2">
                    {GALLERY_PHOTOS.map((g) => (
                      <div
                        key={g.url}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/x-ci-url', g.url);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => {
                          handleAssignPhotoToPanel(g.url, activePanelIndex);
                          setUploadedPhotos((prev) => (prev.includes(g.url) ? prev : [g.url, ...prev]));
                        }}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 cursor-grab hover:ring-2 hover:ring-[#0E4A93] transition-all"
                        title={g.label}
                      >
                        <img src={g.url} alt={g.label} draggable={false} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-[9px] font-bold text-center py-0.5">{g.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadSource === 'ai' && (
                <div className="space-y-2.5 bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                  <p className="text-[11px] text-stone-500">
                    Describe a mood or colours (e.g. &ldquo;sunset ocean&rdquo;) and get four unique abstract artworks made just for that prompt.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGenerateArt();
                      }}
                      placeholder="e.g. calm blue mountains"
                      className="flex-1 px-3 py-2 border border-stone-300 bg-white rounded-lg text-xs focus:outline-none focus:border-[#0E4A93]"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateArt}
                      className="px-4 py-2 bg-[#E8752A] hover:bg-[#d6651d] text-white text-xs font-black rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Generate
                    </button>
                  </div>
                  {aiResults.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {aiResults.map((art, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/x-ci-url', art);
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => {
                            handleAssignPhotoToPanel(art, activePanelIndex);
                            setUploadedPhotos((prev) => (prev.includes(art) ? prev : [art, ...prev]));
                          }}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 cursor-grab hover:ring-2 hover:ring-[#0E4A93] transition-all"
                        >
                          <img src={art} alt={`Generated art ${i + 1}`} draggable={false} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Split Canvas single image notification */}
              {selectedProductTypeId === 'canvas-split' && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs font-semibold text-[#0E4A93]">
                  Upload 1 photo — it is divided seamlessly across the {panels.length || 3} physical canvas panels.
                </div>
              )}

              {/* Active Panel Target Selector for Multi-Panel Layouts (Collage / Mosaic / Wall Art) */}
              {panels.length > 1 && selectedProductTypeId !== 'canvas-split' && (
                <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-xs font-extrabold text-stone-700">Target Slot for Next Photo:</div>
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
                              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <span>{p.label}</span>
                          {hasPhoto && <Check className="w-3 h-3 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Photo Tray */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-stone-700">Your Uploaded Photos ({uploadedPhotos.length})</span>
                    <button
                      type="button"
                      onClick={handleClearAllUploadedPhotos}
                      className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      title="Remove all uploaded photos"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove All</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {uploadedPhotos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/x-ci-tray', String(pIdx));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => handleAssignPhotoToPanel(photo, activePanelIndex)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 cursor-grab shadow-xs hover:ring-2 hover:ring-[#0E4A93] transition-all"
                      >
                        <img src={photo} alt={`Upload ${pIdx + 1}`} draggable={false} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                          <span className="text-[10px] text-white font-bold bg-[#0E4A93] px-2 py-0.5 rounded">Use Photo</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUploadedPhoto(photo, pIdx);
                          }}
                          title="Remove this uploaded photo"
                          aria-label="Remove uploaded photo"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------- SHAPES -------------------------------- */}
          {(activeTab === 'SHAPES' || activeTab === 'SHAPE') && (
            <div className="p-4 space-y-3">
              {!shapeApplies ? (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
                  <p>
                    Laser-cut shapes are only available on single-panel canvases. Switch to <strong>Classic Canvas Print</strong> or{' '}
                    <strong>Panoramic Canvas Print</strong> under Products to choose a shape.
                  </p>
                </div>
              ) : (
                <>
                  {/* Category Filter Pills (Identical to Acrylic Customizer) */}
                  <div className="flex flex-wrap gap-1.5">
                    {SHAPE_FILTER_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setShapeFilterCategory(tab.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          shapeFilterCategory === tab.id
                            ? 'bg-[#0E4A93] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Shape Cards Grid (Identical to Acrylic Customizer) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {filteredShapes.map((shape) => {
                      const isSelected = selectedShapeId === shape.id;
                      return (
                        <CustomizerOptionCard
                          key={shape.id}
                          selected={isSelected}
                          onClick={() => {
                            setSelectedShapeId(shape.id);
                            setIsSizeShapeModalOpen(true);
                          }}
                          title={shape.name}
                          priceText={shape.priceAddon === 0 ? 'Included' : `+₹${shape.priceAddon}`}
                          previewHeightClass="h-16 p-1.5"
                          preview={
                            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                              <AcrylicShapePreview
                                shape={shape.shapeType}
                                selected={isSelected}
                              />
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* --------------------------- SELECT SIZE ---------------------------- */}
          {activeTab === 'SELECT SIZE' && (
            <div className="p-4 space-y-4">
              {/* Quick Trigger for the Select Size & Shape Modal */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
                <div className="text-xs">
                  <span className="font-black text-[#0E4A93] uppercase tracking-wide">Select Size & Shape</span>
                  <p className="text-stone-600 text-[11px] mt-0.5">Explore recommended sizes, shapes, and multi-piece arrangements</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeShapeModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Open Popup
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSizeOptions.map((opt) => {
                  const isSelected = !isCustomSize && selectedSizeId === opt.id;
                  return (
                    <CustomizerOptionCard
                      key={opt.id}
                      selected={isSelected}
                      onClick={() => {
                        setIsCustomSize(false);
                        setSelectedSizeId(opt.id);
                      }}
                      title={opt.label}
                      subtitle={opt.dimensionsSummary}
                      priceText={`₹${opt.price.toLocaleString('en-IN')}`}
                      previewHeightClass="h-14 p-1.5"
                      preview={renderSizePreview(opt, isSelected)}
                    />
                  );
                })}
              </div>

              {canUseCustomSize ? (
                <div
                  className={`p-3.5 rounded-xl border-2 space-y-2.5 transition-all ${
                    isCustomSize
                      ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm ring-1 ring-[#0E4A93]/20'
                      : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold uppercase tracking-wide text-stone-800">Custom Size</div>
                    {isCustomSize && (
                      <div className="w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 text-[10px] font-bold text-stone-500 uppercase">
                      Width (in)
                      <select
                        value={customWidth}
                        onChange={(e) => {
                          setIsCustomSize(true);
                          setCustomWidth(Number(e.target.value));
                        }}
                        className="mt-1 w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold bg-white text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                      >
                        {CUSTOM_SIZE_STEPS.map((n) => (
                          <option key={n} value={n}>
                            {n}&quot;
                          </option>
                        ))}
                      </select>
                    </label>
                    <span className="text-stone-400 text-xs font-bold pt-4">×</span>
                    <label className="flex-1 text-[10px] font-bold text-stone-500 uppercase">
                      Height (in)
                      <select
                        value={customHeight}
                        onChange={(e) => {
                          setIsCustomSize(true);
                          setCustomHeight(Number(e.target.value));
                        }}
                        className="mt-1 w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold bg-white text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                      >
                        {CUSTOM_SIZE_STEPS.map((n) => (
                          <option key={n} value={n}>
                            {n}&quot;
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-stone-600">
                      {customWidth}&quot; × {customHeight}&quot;
                    </span>
                    <span className="text-xs font-black text-[#0E4A93]">₹{customSizePrice.toLocaleString('en-IN')}</span>
                  </div>
                  {!isCustomSize && (
                    <button
                      type="button"
                      onClick={() => setIsCustomSize(true)}
                      className="w-full py-2 rounded-lg bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-black transition-colors cursor-pointer"
                    >
                      Use Custom Size
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-3">
                  Custom sizes are available for single-photo canvases (Classic and Panoramic).
                </p>
              )}
            </div>
          )}

          {/* ------------------------ LAYOUTS & DESIGNS ------------------------- */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="p-4 space-y-4">
              {selectedProductTypeId === 'canvas-lyric' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-[#0E4A93]">
                    <div className="font-extrabold uppercase tracking-wide">Lyric & Typography Canvas</div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Customize your song title, artist, and lyrics below. Live preview updates on the canvas.</p>
                  </div>

                  {/* Template Style */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Typography Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'center-minimal' as const, label: 'Center Minimal', desc: 'Centered classic typography' },
                        { id: 'music-player' as const, label: 'Spotify Style', desc: 'Player icon & progress bar' },
                        { id: 'elegant-script' as const, label: 'Elegant Script', desc: 'Handwritten romantic vibe' },
                        { id: 'split-card' as const, label: 'Lyric Card', desc: 'Frosted card with header' }
                      ].map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => setLyricTemplate(tpl.id)}
                          className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            lyricTemplate === tpl.id
                              ? 'border-[#0E4A93] bg-blue-50/30 text-[#0E4A93] shadow-xs'
                              : 'border-stone-200 text-stone-700 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="text-xs font-black">{tpl.label}</div>
                          <div className="text-[10px] text-stone-500 mt-0.5">{tpl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Preset Songs */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase">Popular Song Presets</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        {
                          title: 'PERFECT',
                          artist: 'ED SHEERAN',
                          text: "Baby, I'm dancing in the dark\nWith you between my arms\nBarefoot on the grass\nListening to our favorite song\nWhen you said you looked a mess\nI whispered underneath my breath\nYou heard it, darling\nYou look perfect tonight"
                        },
                        {
                          title: 'A THOUSAND YEARS',
                          artist: 'CHRISTINA PERRI',
                          text: "Heart beats fast\nColors and promises\nHow to be brave?\nHow can I love when I'm afraid to fall?\nI have died every day waiting for you\nDarling, don't be afraid\nI have loved you for a thousand years\nI'll love you for a thousand more"
                        },
                        {
                          title: 'ALL OF ME',
                          artist: 'JOHN LEGEND',
                          text: "'Cause all of me\nLoves all of you\nLove your curves and all your edges\nAll your perfect imperfections\nGive your all to me\nI'll give my all to you\nYou're my end and my beginning\nEven when I lose I'm winning"
                        },
                        {
                          title: 'WEDDING VOWS',
                          artist: 'FOREVER & ALWAYS',
                          text: "I promise to love you unconditionally,\nTo support your dreams as my own,\nTo laugh with you in joy,\nAnd hold your hand through every storm.\nToday and for all our tomorrows,\nMy heart is yours."
                        }
                      ].map((song) => (
                        <button
                          key={song.title}
                          type="button"
                          onClick={() => {
                            setLyricTitle(song.title);
                            setLyricArtist(song.artist);
                            setLyricText(song.text);
                          }}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-[#0E4A93] hover:text-white rounded-lg text-[10px] font-bold text-stone-700 transition-colors cursor-pointer"
                        >
                          {song.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Song Title & Artist Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Song / Vow Title</label>
                      <input
                        type="text"
                        value={lyricTitle}
                        onChange={(e) => setLyricTitle(e.target.value)}
                        placeholder="e.g. Perfect"
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Artist / Couple Name</label>
                      <input
                        type="text"
                        value={lyricArtist}
                        onChange={(e) => setLyricArtist(e.target.value)}
                        placeholder="e.g. Ed Sheeran"
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93]"
                      />
                    </div>
                  </div>

                  {/* Lyrics Textarea */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Lyrics / Text</label>
                    <textarea
                      rows={5}
                      value={lyricText}
                      onChange={(e) => setLyricText(e.target.value)}
                      placeholder="Paste your favorite lyrics or personal vows here..."
                      className="w-full px-2.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] resize-y"
                    />
                  </div>

                  {/* Font & Color */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Typography Font</label>
                      <select
                        value={lyricFontFamily}
                        onChange={(e) => setLyricFontFamily(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93]"
                      >
                        <option value="serif">Playfair Serif</option>
                        <option value="script">Dancing Script</option>
                        <option value="sans">Montserrat Sans</option>
                        <option value="cinzel">Cinzel Classic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Text Color</label>
                      <div className="flex gap-2 pt-1">
                        {[
                          { hex: '#FFFFFF', name: 'White' },
                          { hex: '#FEF08A', name: 'Soft Gold' },
                          { hex: '#F5EBE0', name: 'Cream' },
                          { hex: '#1E293B', name: 'Charcoal' }
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setLyricTextColor(c.hex)}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                              lyricTextColor === c.hex ? 'border-[#0E4A93] scale-110 shadow-sm' : 'border-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Background Scrim Darkness */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-stone-700 uppercase mb-1">
                      <span>Overlay Contrast</span>
                      <span>{lyricOverlayDarkness}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={80}
                      value={lyricOverlayDarkness}
                      onChange={(e) => setLyricOverlayDarkness(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0E4A93]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Sub-tab toggle matching Acrylic pill filter style */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'LAYOUTS' as const, label: 'Layouts' },
                      { id: 'DESIGNS' as const, label: 'Design Templates' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setLayoutSubTab(sub.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                          layoutSubTab === sub.id
                            ? 'bg-[#0E4A93] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {layoutSubTab === 'LAYOUTS' && (
                    <div className="space-y-3">
                      <p className="text-xs text-stone-500">
                        Choose a single-photo or multi-photo layout arrangement. Selecting a layout automatically adjusts your canvas panels.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {filteredLayoutPresets.map((preset) => {
                          const isSelected = selectedProductTypeId === preset.productTypeId && selectedSizeId === preset.sizeId;
                          return (
                            <CustomizerOptionCard
                              key={preset.id}
                              selected={isSelected}
                              onClick={() => {
                                setExpandedLayoutId(preset.id);
                                handleSelectLayoutPreset(preset);
                              }}
                              title={preset.label}
                              previewHeightClass="h-28 p-2"
                              preview={<div className="w-full">{renderLayoutThumbnail(preset.arrangement)}</div>}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {layoutSubTab === 'DESIGNS' && (
                    <div className="space-y-3">
                      <div className="relative">
                        <select
                          value={designCategory}
                          onChange={(e) => setDesignCategory(e.target.value)}
                          className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] appearance-none shadow-2xs"
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
                            <CustomizerOptionCard
                              key={tpl.id}
                              selected={isSelected}
                              onClick={() => handleApplyTemplate(tpl)}
                              title={tpl.name}
                              subtitle={tpl.category}
                              previewHeightClass="h-28 p-0"
                              preview={
                                <div className={`relative w-full h-full flex flex-col items-center justify-center p-2.5 ${tpl.swatchClass}`}>
                                  {renderDecorSvg(tpl.decor, tpl.accent, 'absolute inset-0 w-full h-full pointer-events-none')}
                                  <div className="relative w-12 h-12 rounded-md bg-white/80 border border-black/10 shadow-xs" />
                                </div>
                              }
                            />
                          );
                        })}
                      </div>

                      {selectedTemplateId && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(null);
                            setTextItems((prev) => prev.filter((t) => t.id !== 'tpl-text'));
                          }}
                          className="w-full py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-center text-xs cursor-pointer transition-colors"
                        >
                          Remove Design / Template
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* --------------------------- WRAP & BORDER --------------------------- */}
          {activeTab === 'WRAP & BORDER' && (
            <div className="p-4 space-y-5">
              {/* 1. Edge Wrap Styles */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">1. Edge Wrap Style</label>
                  <span className="text-[11px] font-bold text-[#0E4A93]">{WRAP_OPTIONS.length} styles</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WRAP_OPTIONS.map((w) => {
                    const isSelected = selectedWrapId === w.id;
                    return (
                      <CustomizerOptionCard
                        key={w.id}
                        selected={isSelected}
                        onClick={() => setSelectedWrapId(w.id)}
                        title={w.name}
                        priceText={w.price === 0 ? 'Included' : `+₹${w.price}`}
                        previewHeightClass="h-16 p-1.5"
                        preview={
                          <div className="w-12 h-12 mx-auto relative flex items-center justify-center">
                            <div className="w-10 h-10 rounded border border-stone-300 relative overflow-hidden bg-stone-100 flex items-center justify-center">
                              {w.id === 'full-bleed' && (
                                <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500" />
                              )}
                              {w.id === 'clear-edge' && (
                                <div className="w-full h-full p-1 bg-stone-200">
                                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-xs border border-dashed border-white" />
                                </div>
                              )}
                              {w.id === 'white-border' && (
                                <div className="w-full h-full p-1.5 bg-white border border-stone-300">
                                  <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 rounded-xs" />
                                </div>
                              )}
                              {w.id === 'black-border' && (
                                <div className="w-full h-full p-1.5 bg-[#0F172A]">
                                  <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 rounded-xs" />
                                </div>
                              )}
                              {w.id === 'no-wrap' && (
                                <div className="w-full h-full p-1 bg-stone-300">
                                  <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xs" />
                                </div>
                              )}
                            </div>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </div>

              {/* 2. Mirror Image Option */}
              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">2. Mirror Image</label>
                <label
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    mirrorImage
                      ? 'border-[#0E4A93] bg-blue-50/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold text-stone-800">
                    <FlipHorizontal2 className="w-4 h-4 text-[#0E4A93]" />
                    Flip photo horizontally
                  </span>
                  <input
                    type="checkbox"
                    checked={mirrorImage}
                    onChange={(e) => setMirrorImage(e.target.checked)}
                    className="accent-[#0E4A93] w-4 h-4"
                  />
                </label>
                {!shapeApplies && <p className="text-[11px] text-stone-400">Applies to the active photo panel.</p>}
              </div>

              {/* 3. Print Border Options */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">3. Print Border</label>
                {!shapeApplies ? (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500">
                    A print border is only available on single-panel canvases. Switch to Classic or Panoramic Canvas under Products.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ACRYLIC_BORDER_WIDTHS.map((bw) => {
                        const isSelected = selectedBorderWidthId === bw.id;
                        const borderPrice = CANVAS_BORDER_WIDTH_PRICES[bw.id] || 0;
                        return (
                          <CustomizerOptionCard
                            key={bw.id}
                            selected={isSelected}
                            onClick={() => setSelectedBorderWidthId(bw.id)}
                            title={bw.label}
                            priceText={borderPrice === 0 ? 'Free' : `+₹${borderPrice}`}
                            previewHeightClass="h-14 p-1.5"
                            preview={
                              <div
                                className="w-9 h-9 rounded-xs shadow-2xs"
                                style={{
                                  backgroundColor: bw.widthPx === 0 ? 'transparent' : selectedBorderColor,
                                  padding: `${Math.min(bw.widthPx, 8)}px`
                                }}
                              >
                                <div className="w-full h-full rounded-xs bg-gradient-to-br from-sky-200 to-emerald-200" />
                              </div>
                            }
                          />
                        );
                      })}
                    </div>

                    {selectedBorderWidthId !== 'none' && (
                      <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                        <span className="text-[11px] font-bold text-stone-700 block">Select Border Colour:</span>
                        <div className="flex items-center gap-2.5 pt-0.5">
                          {ACRYLIC_BORDER_COLORS.map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setSelectedBorderColor(c.hex)}
                              title={c.name}
                              style={{ backgroundColor: c.hex }}
                              className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                                selectedBorderColor === c.hex ? 'ring-2 ring-[#0E4A93] ring-offset-2' : 'border-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Floating Frame Options */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">4. Floating Frames</label>
                {!shapeApplies ? (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500">
                    An outer frame is only available on single-panel canvases. Switch to Classic or Panoramic Canvas under Products.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FRAME_OPTIONS.map((f) => {
                      const isSelected = selectedFrameId === f.id;
                      return (
                        <CustomizerOptionCard
                          key={f.id}
                          selected={isSelected}
                          onClick={() => setSelectedFrameId(f.id)}
                          title={f.name}
                          priceText={f.price === 0 ? 'Free' : `+₹${f.price.toFixed(0)}`}
                          previewHeightClass="h-16 p-1.5"
                          preview={
                            <div
                              className="w-10 h-10 rounded mx-auto p-1 shadow-2xs"
                              style={
                                f.id === 'no-frame'
                                  ? {
                                      backgroundImage: 'repeating-conic-gradient(#d6d3d1 0% 25%, #f5f5f4 0% 50%)',
                                      backgroundSize: '8px 8px',
                                      border: '1px solid #d6d3d1'
                                    }
                                  : { backgroundColor: f.color, border: f.color === '#ffffff' ? '1px solid #d6d3d1' : undefined }
                              }
                            >
                              <div className="w-full h-full rounded-xs bg-gradient-to-br from-sky-200 to-emerald-200" />
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -------------------------- HARDWARE & FINISH ------------------------- */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="p-4 space-y-5">
              {/* 1. Canvas Thickness / Stretcher Bar Depth */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">1. Canvas Stretcher Thickness</label>
                  <span className="text-[11px] font-bold text-[#0E4A93]">{THICKNESS_OPTIONS.length} options</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THICKNESS_OPTIONS.map((th) => {
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

              {/* 2. Hardware Option & Style */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">2. Hardware Option &amp; Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HARDWARE_OPTIONS.map((hw) => {
                    const isSelected = selectedHardwareId === hw.id;
                    return (
                      <CustomizerOptionCard
                        key={hw.id}
                        selected={isSelected}
                        onClick={() => setSelectedHardwareId(hw.id)}
                        title={hw.label}
                        priceText={hw.price === 0 ? 'Free' : `+₹${hw.price}`}
                        previewHeightClass="h-16 p-1.5"
                        preview={renderHardwareIcon(hw.id)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 3. Display Option */}
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
                          {opt.price === 0 ? 'Free' : `+₹${opt.price.toFixed(0)}`}
                          <Info className="w-3.5 h-3.5 text-stone-400" />
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

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
                        <span className="text-xs font-black text-[#0E4A93]">{lam.price === 0 ? 'Free' : `+₹${lam.price.toFixed(0)}`}</span>
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
        <main className="flex-1 flex flex-col h-full bg-[#E2E8F0]/60 relative overflow-hidden">
          {/* Top Action Bar for Workspace (Shared with Acrylic Customizer) */}
          <CustomizerTopToolbar
            onSave={handleSaveDesign}
            showTextPopover={showTextPopover}
            onToggleText={() => {
              if (showTextPopover) {
                setShowTextPopover(false);
              } else if (textItems.length === 0) {
                addTextItem();
              } else {
                setShowTextPopover(true);
                setShowClipartPopover(false);
              }
            }}
            showClipartPopover={showClipartPopover}
            onToggleClipart={() => {
              setShowClipartPopover(!showClipartPopover);
              setShowTextPopover(false);
            }}
            isRoomViewActive={viewerMode === 'room'}
            isRoomViewDisabled={!hasUploadedImage}
            onToggleRoomView={() => {
              if (!hasUploadedImage) return;
              setViewerRotation(0);
              setViewerTiltX(0);
              setViewerAutoRotate(false);
              setViewerMode('room');
            }}
            is3DViewActive={viewerMode === '3d'}
            onOpen3DView={() => {
              if (!hasUploadedImage) return;
              setViewerRotation(-28);
              setViewerTiltX(8);
              setViewerAutoRotate(false);
              setViewerMode('3d');
            }}
            is360ViewActive={viewerMode === '360'}
            onOpen360View={() => {
              if (!hasUploadedImage) return;
              setViewerRotation(0);
              setViewerTiltX(10);
              setViewerAutoRotate(true);
              setViewerMode('360');
            }}
            hasSelectedItem={Boolean(selectedItem)}
            onDeleteSelectedItem={removeSelectedItem}
          />

          {/* ALWAYS-VISIBLE PREVIEW THUMBNAILS: Studio / Living Room / Office.
              Clicking a room thumbnail shows the *live* customization (current
              photo, shape, size - whatever is set right now) composited onto
              that wall, via the same AcrylicRoomViewModal render path used
              below - nothing here is a separate static image. */}
          <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-b border-stone-200 overflow-x-auto">
            {[
              { id: null as 'room' | null, label: 'Studio', thumb: null },
              { id: 'room' as const, preset: 'living' as const, label: 'Living Room', thumb: '/assets/acrylic/acrylic-panel-living.jpg' },
              { id: 'room' as const, preset: 'office' as const, label: 'Office', thumb: '/assets/acrylic/acrylic-corporate-office.jpg' }
            ].map((opt) => {
              const isActive = opt.id === null ? viewerMode !== 'room' : viewerMode === 'room' && roomViewState.roomPreset === opt.preset;
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={opt.id === 'room' && !hasUploadedImage}
                  onClick={() => {
                    if (opt.id === null) {
                      setViewerMode(null);
                      return;
                    }
                    if (!hasUploadedImage) return;
                    setRoomViewState((prev) => ({ ...prev, roomPreset: opt.preset! }));
                    setViewerRotation(0);
                    setViewerTiltX(0);
                    setViewerAutoRotate(false);
                    setViewerMode('room');
                  }}
                  title={opt.id === 'room' && !hasUploadedImage ? 'Upload a photo first to preview it on a wall' : opt.label}
                  className={`shrink-0 flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive ? 'border-[#0E4A93] bg-blue-50/60' : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="w-9 h-9 rounded-md overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    {opt.thumb ? (
                      <img src={opt.thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-50">
                        <ImageIcon className="w-4 h-4 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold whitespace-nowrap ${isActive ? 'text-[#0E4A93]' : 'text-stone-600'}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Floating Tool Popover: ADD TEXT */}
          {showTextPopover && (
            <div className="absolute top-14 right-4 w-80 max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>{selectedTextItem ? 'Edit Text' : 'Text'}</span>
                <button onClick={() => setShowTextPopover(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedTextItem ? (
                <>
                  <input
                    type="text"
                    value={selectedTextItem.text}
                    onChange={(e) => updateTextItem(selectedTextItem.id, { text: e.target.value })}
                    placeholder="Type your text"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0E4A93]"
                  />

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-600">Font style</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FONT_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateTextItem(selectedTextItem.id, { fontId: f.id })}
                          className={`px-1.5 py-2 rounded-lg border text-center leading-tight cursor-pointer transition-colors ${
                            selectedTextItem.fontId === f.id ? 'border-[#0E4A93] bg-blue-50 text-[#0E4A93]' : 'border-stone-200 hover:border-stone-400 text-stone-700'
                          }`}
                        >
                          <div className="text-base" style={{ fontFamily: f.family }}>Aa</div>
                          <div className="text-[9px] font-bold text-stone-500">{f.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateTextItem(selectedTextItem.id, { bold: !selectedTextItem.bold })}
                      className={`w-9 py-1.5 rounded-lg border font-black cursor-pointer ${selectedTextItem.bold ? 'border-[#0E4A93] bg-blue-50 text-[#0E4A93]' : 'border-stone-200 text-stone-600'}`}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTextItem(selectedTextItem.id, { italic: !selectedTextItem.italic })}
                      className={`w-9 py-1.5 rounded-lg border italic font-bold cursor-pointer ${selectedTextItem.italic ? 'border-[#0E4A93] bg-blue-50 text-[#0E4A93]' : 'border-stone-200 text-stone-600'}`}
                    >
                      I
                    </button>
                    <span className="text-[11px] font-bold text-stone-600 ml-2 whitespace-nowrap">Size {selectedTextItem.size}px</span>
                    <input
                      type="range"
                      min={12}
                      max={120}
                      value={selectedTextItem.size}
                      onChange={(e) => updateTextItem(selectedTextItem.id, { size: Number(e.target.value) })}
                      className="flex-1 accent-[#0E4A93]"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-600">Colour</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {TEXT_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => updateTextItem(selectedTextItem.id, { color: col })}
                          style={{ backgroundColor: col }}
                          className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selectedTextItem.color === col ? 'ring-2 ring-[#0E4A93] ring-offset-1' : 'border-stone-300'}`}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedTextItem.color}
                        onChange={(e) => updateTextItem(selectedTextItem.id, { color: e.target.value })}
                        className="w-7 h-7 p-0 border border-stone-300 rounded cursor-pointer"
                        title="Custom colour"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Move className="w-3 h-3" /> Drag the text on the canvas to move it anywhere.
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => addTextItem()} className="flex-1 py-2 rounded-lg bg-[#0E4A93] hover:bg-[#09356A] text-white font-black cursor-pointer">
                      + Add another
                    </button>
                    <button type="button" onClick={removeSelectedItem} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  {textItems.length === 0 ? (
                    <p className="text-stone-500">No text yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {textItems.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedItem({ type: 'text', id: t.id })}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-[#0E4A93] truncate cursor-pointer"
                        >
                          {t.text || '(empty)'}
                        </button>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={() => addTextItem()} className="w-full py-2 rounded-lg bg-[#0E4A93] hover:bg-[#09356A] text-white font-black cursor-pointer">
                    + Add text
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Floating Tool Popover: ADD CLIPART */}
          {showClipartPopover && (
            <div className="absolute top-14 right-4 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>Select Clipart / Sticker</span>
                <button onClick={() => setShowClipartPopover(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5 text-xl text-center">
                {CLIPART_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addClipItem(item)}
                    className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:scale-110 hover:border-[#0E4A93] transition-transform cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
              {selectedClipItem && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-stone-600 whitespace-nowrap">Size {selectedClipItem.size}px</span>
                    <input
                      type="range"
                      min={20}
                      max={220}
                      value={selectedClipItem.size}
                      onChange={(e) => updateClipItem(selectedClipItem.id, { size: Number(e.target.value) })}
                      className="flex-1 accent-[#0E4A93]"
                    />
                  </div>
                  <button type="button" onClick={removeSelectedItem} className="w-full py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold cursor-pointer">
                    Remove this clipart
                  </button>
                </div>
              )}
              <p className="text-[11px] text-stone-400 flex items-center gap-1">
                <Move className="w-3 h-3" /> Tap to add, then drag it anywhere on the canvas.
              </p>
            </div>
          )}

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
            sizeLabel={isCustomSize && canUseCustomSize ? `${customWidth}" × ${customHeight}"` : currentSizeOption.dimensionsSummary}
            onZoomOut={handleZoomOut}
            onZoomIn={handleZoomIn}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            extraControls={
              hasUploadedImage && (
                <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 gap-0.5 ml-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFill(activePanelIndex);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      panelImages[activePanelIndex]?.fitMode === 'cover'
                        ? 'bg-[#0E4A93] text-white shadow-xs'
                        : 'text-stone-700 hover:text-[#0E4A93] hover:bg-stone-200'
                    }`}
                    title="Fill: scale up to completely cover the canvas area"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFix(activePanelIndex);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      panelImages[activePanelIndex]?.fitMode === 'contain'
                        ? 'bg-[#0E4A93] text-white shadow-xs'
                        : 'text-stone-700 hover:text-[#0E4A93] hover:bg-stone-200'
                    }`}
                    title="Fix (Fit): scale down to fit completely within the canvas area with no clipping"
                  >
                    Fix
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors cursor-pointer"
                    title="Reset zoom, position and rotation"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
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
              <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold text-stone-600 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-stone-200/80">
                <span>
                  Material:{' '}
                  <strong className="text-stone-900">
                    {MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Artist Cotton Canvas'}
                  </strong>
                </span>
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
            <div ref={stageRef} className="relative w-full flex flex-col items-center" onPointerDown={() => setSelectedItem(null)}>
              {/* Reference Screenshot Top Adjustment Banner */}
              <div className="w-full max-w-xl mx-auto mb-2 bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs select-none">
                <Move className="w-3.5 h-3.5 text-[#A16207]" />
                <span>Click and drag within the print lines to Adjust your Photo.</span>
              </div>

              {/* WALL DISPLAY (Physical Multi-Panel Gallery Wall Layout) */}
              {selectedProductTypeId === 'canvas-wall-art' && renderWallDisplayCanvas()}

              {/* PHOTO MOSAIC (Multi-Tile Mosaic Canvas Grid) */}
              {selectedProductTypeId === 'canvas-mosaic' && renderMosaicCanvas()}

              {/* SINGLE PANEL LAYOUTS (Single Print, Round, Triangle, Heart, Oval, Hexagon, etc.) */}
              {selectedProductTypeId !== 'canvas-wall-art' && selectedProductTypeId !== 'canvas-collage' && selectedProductTypeId !== 'canvas-mosaic' && selectedProductTypeId !== 'canvas-split' && panels.length === 1 && (() => {
                const frameOption = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
                const borderWidthPx = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0;
                const thicknessOption = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[1];
                const wrapDepthPx = thicknessOption?.depthPx || 26;
                const visibleDepthPx =
                  selectedThicknessId === 'canvas-lite'
                    ? 8
                    : selectedThicknessId === 'thin-gallery'
                    ? 16
                    : selectedThicknessId === 'thick-gallery'
                    ? 28
                    : 5;

                const displayWidthInches = isCustomSize && canUseCustomSize
                  ? customWidth
                  : panels[0]?.widthRatio || 8;
                const displayHeightInches = isCustomSize && canUseCustomSize
                  ? customHeight
                  : panels[0]?.heightRatio || 8;

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
                    <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[27rem] relative">
                      <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
                      <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
                        {displayWidthInches} inch
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                      {/* Ruler Left */}
                      <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
                        <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
                        <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
                          {displayHeightInches} inch
                        </div>
                      </div>

                      {/* PHYSICAL CANVAS CONTAINER with clear visible edge & thickness */}
                      <div
                        className="relative"
                        style={{
                          aspectRatio: String(printAspect),
                          width: `min(27rem, calc(52vh * ${printAspect}))`,
                          maxWidth: '100%'
                        }}
                      >
                        {/* 1. PHYSICAL 4-EDGE PROJECTION (Derived from selectedThicknessId & selectedWrapId) */}
                        {isRectangularShape ? (
                          <>
                            {/* Top Physical Thickness Edge / Bevel */}
                            <div
                              className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0"
                              style={{
                                bottom: '100%',
                                height: `${Math.max(3, Math.round(visibleDepthPx * 0.45))}px`,
                                transformOrigin: 'bottom center',
                                transform: 'perspective(500px) rotateX(24deg)',
                                backgroundColor: wrapBgColor,
                                borderTopLeftRadius: '2px',
                                borderTopRightRadius: '2px',
                                boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.12), 0 -2px 6px -1px rgba(0,0,0,0.08)'
                              }}
                            >
                              {(isFullBleedWrap || isMirrorWrap) && panelImages[0]?.imageUrl && (
                                <img
                                  src={panelImages[0].imageUrl}
                                  alt=""
                                  draggable={false}
                                  className={`w-full h-full object-cover filter brightness-95 contrast-95 ${
                                    isMirrorWrap ? 'scale-y-[-1]' : ''
                                  }`}
                                  style={{ objectPosition: 'center top' }}
                                />
                              )}
                              <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, transparent 1px, transparent 3px)'
                                }}
                              />
                            </div>

                            {/* Left Physical Thickness Edge / Bevel */}
                            <div
                              className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0"
                              style={{
                                right: '100%',
                                width: `${Math.max(3, Math.round(visibleDepthPx * 0.45))}px`,
                                transformOrigin: 'right center',
                                transform: 'perspective(500px) rotateY(-24deg)',
                                backgroundColor: wrapBgColor,
                                borderTopLeftRadius: '2px',
                                borderBottomLeftRadius: '2px',
                                boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.12), -2px 0 6px -1px rgba(0,0,0,0.08)'
                              }}
                            >
                              {(isFullBleedWrap || isMirrorWrap) && panelImages[0]?.imageUrl && (
                                <img
                                  src={panelImages[0].imageUrl}
                                  alt=""
                                  draggable={false}
                                  className={`w-full h-full object-cover filter brightness-90 contrast-95 ${
                                    isMirrorWrap ? 'scale-x-[-1]' : ''
                                  }`}
                                  style={{ objectPosition: 'left center' }}
                                />
                              )}
                              <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(90deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, transparent 1px, transparent 3px)'
                                }}
                              />
                            </div>

                            {/* Bottom Physical Thickness Edge */}
                            <div
                              className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0"
                              style={{
                                top: '100%',
                                height: `${visibleDepthPx}px`,
                                transformOrigin: 'top center',
                                transform: 'perspective(500px) rotateX(-24deg)',
                                backgroundColor: wrapBgColor,
                                borderBottomLeftRadius: '2px',
                                borderBottomRightRadius: '2px',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.18), 0 12px 24px -4px rgba(15, 23, 42, 0.42)'
                              }}
                            >
                              {(isFullBleedWrap || isMirrorWrap) && panelImages[0]?.imageUrl && (
                                <img
                                  src={panelImages[0].imageUrl}
                                  alt=""
                                  draggable={false}
                                  className={`w-full h-full object-cover filter brightness-70 contrast-90 ${
                                    isMirrorWrap ? 'scale-y-[-1]' : ''
                                  }`}
                                  style={{ objectPosition: 'center bottom' }}
                                />
                              )}
                              <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)'
                                }}
                              />
                            </div>

                            {/* Right Physical Thickness Edge */}
                            <div
                              className="absolute top-0 bottom-0 overflow-hidden pointer-events-none z-0"
                              style={{
                                left: '100%',
                                width: `${Math.max(4, Math.round(visibleDepthPx * 0.65))}px`,
                                transformOrigin: 'left center',
                                transform: 'perspective(500px) rotateY(24deg)',
                                backgroundColor: wrapBgColor,
                                borderTopRightRadius: '2px',
                                borderBottomRightRadius: '2px',
                                boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.18), 4px 8px 16px -2px rgba(15, 23, 42, 0.35)'
                              }}
                            >
                              {(isFullBleedWrap || isMirrorWrap) && panelImages[0]?.imageUrl && (
                                <img
                                  src={panelImages[0].imageUrl}
                                  alt=""
                                  draggable={false}
                                  className={`w-full h-full object-cover filter brightness-80 contrast-95 ${
                                    isMirrorWrap ? 'scale-x-[-1]' : ''
                                  }`}
                                  style={{ objectPosition: 'right center' }}
                                />
                              )}
                              <div
                                className="absolute inset-0 opacity-25"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)'
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          /* Non-rectangular geometric shapes (Circle, Oval, Triangle, Heart, Hexagon) extruded under-plate */
                          <div
                            className="absolute inset-0 pointer-events-none overflow-hidden"
                            style={{
                              transform: `translate(${Math.max(3, Math.round(visibleDepthPx * 0.45))}px, ${visibleDepthPx}px)`,
                              clipPath: currentShape.clipPathStyle,
                              WebkitClipPath: currentShape.clipPathStyle,
                              backgroundColor: wrapBgColor,
                              filter: 'drop-shadow(0 14px 22px rgba(15,23,42,0.45))',
                              zIndex: -1
                            }}
                          >
                            {(isFullBleedWrap || isMirrorWrap) && panelImages[0]?.imageUrl && (
                              <img
                                src={panelImages[0].imageUrl}
                                alt=""
                                draggable={false}
                                className="w-full h-full object-cover filter brightness-70 contrast-90"
                              />
                            )}
                            <div
                              className="absolute inset-0 opacity-30"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)'
                              }}
                            />
                          </div>
                        )}

                        {/* 2. FRONT CANVAS SURFACE */}
                        <div
                          {...panelHandlers(0)}
                          onWheel={handleWheel}
                          className={`relative w-full h-full ${currentShape.borderRadiusClass} bg-white overflow-hidden transition-all cursor-pointer group shadow-lg ${
                            activePanelIndex === 0 ? 'ring-2 ring-[#0E4A93]/50' : ''
                          }`}
                          style={{
                            clipPath: currentShape.clipPathStyle,
                            WebkitClipPath: currentShape.clipPathStyle
                          }}
                        >
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

                          {/* Folded edge wrap frame */}
                          <div
                            className="absolute inset-0 pointer-events-none z-10"
                            style={{
                              border: isFullBleedWrap || isMirrorWrap ? '12px solid rgba(0,0,0,0.06)' : `12px solid ${wrapBgColor}`,
                              borderRadius: currentShape.id === 'shape-circle' ? '9999px' : undefined
                            }}
                          />

                          {/* 3. DOTTED PRINT AREA DEMARCATION (Sits inside the physical Canvas) */}
                          {isRectangularShape ? (
                            <div className="absolute inset-[18px] pointer-events-none z-20 border border-dashed border-sky-600/70 rounded-xs flex items-start justify-start p-1.5">
                              <span className="text-[8px] font-black uppercase tracking-wider text-sky-800 bg-sky-50/90 border border-sky-200/80 px-1.5 py-0.5 rounded shadow-2xs select-none">
                                PRINT AREA
                              </span>
                            </div>
                          ) : (
                            <svg
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
                            >
                              {currentShape.id === 'shape-circle' && (
                                <circle cx="50" cy="50" r="44" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 2" />
                              )}
                              {currentShape.id === 'shape-oval' && (
                                <ellipse cx="50" cy="50" rx="44" ry="44" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 2" />
                              )}
                              {currentShape.id === 'shape-triangle' && (
                                <polygon points="50,14 88,90 12,90" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 2" />
                              )}
                              {currentShape.id === 'shape-heart' && (
                                <path
                                  d="M 50,78 C 16,54 6,36 6,24 C 6,10 16,5 28,5 C 37,5 44,10 50,19 C 56,10 63,5 72,5 C 84,5 94,10 94,24 C 94,36 84,54 50,78 Z"
                                  fill="none"
                                  stroke="#0284c7"
                                  strokeWidth="1.2"
                                  strokeDasharray="3 2"
                                />
                              )}
                              {currentShape.id === 'shape-hexagon' && (
                                <polygon points="27,6 73,6 94,50 73,94 27,94 6,50" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3 2" />
                              )}
                            </svg>
                          )}

                          {dragOverPanel === 0 && (
                            <div className="absolute inset-0 z-30 bg-[#0E4A93]/20 border-4 border-dashed border-[#0E4A93] pointer-events-none" />
                          )}

                          {panelImages[0]?.imageUrl ? (
                            <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                              <img
                                src={panelImages[0].imageUrl}
                                alt="Canvas Print"
                                style={{
                                  transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  filter: getFilterCss(panelImages[0].filter),
                                  objectFit: panelImages[0].fitMode === 'contain' ? 'contain' : 'cover',
                                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                                }}
                                className="max-w-none w-full h-full pointer-events-none"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-full flex flex-col items-center justify-center bg-white p-6 text-center cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0E4A93] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                                <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                              </div>
                              <span className="text-xs font-extrabold text-[#0E4A93] group-hover:underline">
                                Upload an Image
                              </span>
                              <span className="text-[10px] text-stone-400 mt-0.5">
                                Maximum upload size: 25MB per file
                              </span>
                            </div>
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

                          {/* Canvas Banner Hanging Wooden Bars */}
                          {selectedProductTypeId === 'canvas-banner' && (
                            <>
                              <div className="absolute -top-1 left-0 right-0 h-3.5 bg-amber-800 border-b border-amber-900 shadow-md z-30 flex items-center justify-center pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-stone-300 shadow-xs" />
                              </div>
                              <div className="absolute -bottom-1 left-0 right-0 h-3.5 bg-amber-800 border-t border-amber-900 shadow-md z-30 pointer-events-none" />
                            </>
                          )}

                          {/* Lyric on Canvas typography overlay */}
                          {selectedProductTypeId === 'canvas-lyric' && renderLyricOverlay()}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                if (frameOption && frameOption.id !== 'no-frame') {
                  return (
                    <div className="p-3 rounded-2xl shadow-xl mx-auto w-fit max-w-full" style={{ background: frameOption.color }}>
                      {panelBox}
                    </div>
                  );
                }
                return panelBox;
              })()}

              {/* SPLIT CANVAS (Physical Multi-Panel Sliced Layout) */}
              {selectedProductTypeId === 'canvas-split' && renderContinuousSplitCanvas()}

              {/* PHOTO COLLAGE (Single Canvas Frame containing internal Photo Layout Grid) */}
              {selectedProductTypeId === 'canvas-collage' && renderCollageCanvas()}

              {/* Movable text + clipart: drag anywhere on the print */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                {textItems.map((t) => {
                  const isSel = selectedItem?.type === 'text' && selectedItem.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onPointerDown={(e) => startItemDrag(e, 'text', t.id, t.x, t.y)}
                      onPointerMove={(e) => moveItemDrag(e, 'text', t.id)}
                      onPointerUp={endItemDrag}
                      onPointerCancel={endItemDrag}
                      style={{
                        position: 'absolute',
                        left: `${t.x}%`,
                        top: `${t.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontFamily: FONT_OPTIONS.find((f) => f.id === t.fontId)?.family,
                        fontSize: `${t.size}px`,
                        fontWeight: t.bold ? 800 : 500,
                        fontStyle: t.italic ? 'italic' : 'normal',
                        color: t.color,
                        whiteSpace: 'pre',
                        lineHeight: 1.15,
                        textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                        pointerEvents: 'auto',
                        touchAction: 'none'
                      }}
                      className={`cursor-move select-none px-1.5 py-0.5 rounded ${
                        isSel ? 'outline outline-2 outline-dashed outline-[#0E4A93] bg-black/10' : 'hover:outline hover:outline-1 hover:outline-white/70'
                      }`}
                    >
                      {t.text || ' '}
                    </div>
                  );
                })}
                {clipItems.map((c) => {
                  const isSel = selectedItem?.type === 'clip' && selectedItem.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onPointerDown={(e) => startItemDrag(e, 'clip', c.id, c.x, c.y)}
                      onPointerMove={(e) => moveItemDrag(e, 'clip', c.id)}
                      onPointerUp={endItemDrag}
                      onPointerCancel={endItemDrag}
                      style={{
                        position: 'absolute',
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${c.size}px`,
                        lineHeight: 1,
                        pointerEvents: 'auto',
                        touchAction: 'none'
                      }}
                      className={`cursor-move select-none rounded ${isSel ? 'outline outline-2 outline-dashed outline-[#0E4A93] bg-black/10' : ''}`}
                    >
                      {c.emoji}
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
        const primaryPhotoUrl =
          panelImages[activePanelIndex]?.imageUrl ||
          panelImages[0]?.imageUrl ||
          Object.values(panelImages).find((p) => Boolean(p?.imageUrl))?.imageUrl ||
          uploadedPhotos[0] ||
          '';

        const previewAspect =
          panels.length === 1
            ? printAspect
            : selectedProductTypeId === 'canvas-wall-art'
            ? panels.length === 3
              ? 1.02
              : 1
            : selectedProductTypeId === 'canvas-split'
            ? 1.55
            : panels.length === 2
            ? 1.9
            : panels.length === 3
            ? 1.55
            : 1;

        const frameOption = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
        const hasOuterFrame = Boolean(shapeApplies && frameOption && frameOption.id !== 'no-frame');
        const frameColor = hasOuterFrame ? frameOption?.color : undefined;
        const borderWidthPx = shapeApplies
          ? ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0
          : 0;
        const isRectangularShape =
          !shapeApplies ||
          ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id);

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

        // Render a single slot's image with locked percentage pan, zoom, rotation, mirror, and filter
        const renderSlotPhoto = (idx: number) => {
          const p = panelImages[idx];
          const url = p?.imageUrl || (idx === 0 ? primaryPhotoUrl : null);
          const panXPct = ((p?.panX || 0) / 420) * 100;
          const panYPct = ((p?.panY || 0) / 420) * 100;
          const sc = p?.scale || 1;
          const rot = p?.rotation || 0;
          const flt = p?.filter || 'original';

          return url ? (
            <div className="w-full h-full overflow-hidden relative flex items-center justify-center bg-stone-100 pointer-events-none select-none">
              <img
                src={url}
                alt={`Canvas Panel ${idx + 1}`}
                draggable={false}
                style={{
                  filter: getFilterCss(flt),
                  transform: `translate3d(${panXPct}%, ${panYPct}%, 0) scale(${sc}) rotate(${rot}deg) scaleX(${mirrorImage ? -1 : 1})`
                }}
                className="max-w-none w-full h-full object-cover pointer-events-none select-none"
              />
              {/* Subtle physical cotton canvas weave micro-texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(15,23,42,0.08) 0px, rgba(15,23,42,0.08) 1px, transparent 1px, transparent 3px)'
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-[10px] font-bold pointer-events-none select-none">
              Panel {idx + 1}
            </div>
          );
        };

        // Shared renderer for the complete Canvas front design (artwork, layout, border, template, text, clipart)
        const renderCanvasFrontDesign = (targetWidthPx: number) => {
          const scaleFactor = targetWidthPx / 420;
          const scaledBorderPx = Math.max(0, Math.round(borderWidthPx * scaleFactor));

          return (
            <div className="relative w-full h-full overflow-hidden pointer-events-none select-none">
              {panels.length === 1 ? (
                <div className="relative w-full h-full">
                  {renderSlotPhoto(0)}
                  {selectedProductTypeId === 'canvas-lyric' && renderLyricOverlay(scaleFactor)}
                </div>
              ) : selectedProductTypeId === 'canvas-mosaic' ? (
                <div
                  className="w-full h-full grid gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${panels.length === 4 ? 2 : panels.length === 6 ? 3 : panels.length === 9 ? 3 : panels.length === 16 ? 4 : 2}, minmax(0, 1fr))`
                  }}
                >
                  {panels.map((_, i) => (
                    <div key={i} className="min-h-0 rounded-xs overflow-hidden shadow-xs bg-white">
                      {panelImages[i]?.imageUrl ? renderSlotPhoto(i) : renderSlotPhoto(0)}
                    </div>
                  ))}
                </div>
              ) : selectedProductTypeId === 'canvas-wall-art' ? (
                currentSizeOption.arrangement === 'threeSplit' || currentSizeOption.diagramType === 'wall-display-3b' || currentSizeOption.diagramType === 'wall-display-triptych' ? (
                  <div className="w-full h-full flex items-center justify-center gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none">
                    {panels.map((_, i) => (
                      <div key={i} className={`h-[90%] flex-1 min-h-0 rounded-xs overflow-hidden shadow-xs ${i === 1 && currentSizeOption.diagramType === 'wall-display-3b' ? 'h-full flex-[1.4]' : ''}`}>
                        {renderSlotPhoto(i)}
                      </div>
                    ))}
                  </div>
                ) : panels.length === 3 ? (
                  <div className="w-full h-full flex flex-col gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none">
                    <div className="flex-[1.35] min-h-0 rounded-xs overflow-hidden shadow-xs">
                      {renderSlotPhoto(0)}
                    </div>
                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5">
                      <div className="rounded-xs overflow-hidden shadow-xs">{renderSlotPhoto(1)}</div>
                      <div className="rounded-xs overflow-hidden shadow-xs">{renderSlotPhoto(2)}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full grid gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(${panels.length === 4 ? 2 : panels.length >= 5 ? 3 : 2}, minmax(0, 1fr))`
                    }}
                  >
                    {panels.map((_, i) => (
                      <div key={i} className="min-h-0 rounded-xs overflow-hidden shadow-xs">
                        {renderSlotPhoto(i)}
                      </div>
                    ))}
                  </div>
                )
              ) : selectedProductTypeId === 'canvas-collage' ? (
                panels.length === 3 ? (
                  <div className="w-full h-full flex flex-col gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none">
                    <div className="flex-[1.35] min-h-0 rounded-xs overflow-hidden shadow-xs">
                      {renderSlotPhoto(0)}
                    </div>
                    <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5">
                      <div className="rounded-xs overflow-hidden shadow-xs">{renderSlotPhoto(1)}</div>
                      <div className="rounded-xs overflow-hidden shadow-xs">{renderSlotPhoto(2)}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full grid gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(${panels.length === 2 ? 2 : panels.length === 9 ? 3 : 2}, minmax(0, 1fr))`
                    }}
                  >
                    {panels.map((_, i) => (
                      <div key={i} className="min-h-0 rounded-xs overflow-hidden shadow-xs">
                        {renderSlotPhoto(i)}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div
                  className="w-full h-full grid gap-1.5 p-1.5 bg-stone-200/80 pointer-events-none"
                  style={{
                    gridTemplateColumns: `repeat(${panels.length === 4 ? 2 : panels.length}, minmax(0, 1fr))`
                  }}
                >
                  {panels.map((_, i) => (
                    <div key={i} className="min-h-0 rounded-xs overflow-hidden shadow-xs">
                      {renderSlotPhoto(i)}
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
              {textItems.map((t) => (
                <div
                  key={t.id}
                  style={{
                    position: 'absolute',
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: FONT_OPTIONS.find((f) => f.id === t.fontId)?.family,
                    fontSize: `${Math.max(9, t.size * scaleFactor)}px`,
                    fontWeight: t.bold ? 800 : 500,
                    fontStyle: t.italic ? 'italic' : 'normal',
                    color: t.color,
                    whiteSpace: 'pre',
                    lineHeight: 1.15,
                    textShadow: '0 1px 3px rgba(0,0,0,0.45)'
                  }}
                  className="pointer-events-none z-30"
                >
                  {t.text}
                </div>
              ))}

              {/* Live Clipart Items */}
              {clipItems.map((c) => (
                <div
                  key={c.id}
                  style={{
                    position: 'absolute',
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `${Math.max(12, c.size * scaleFactor)}px`,
                    lineHeight: 1
                  }}
                  className="pointer-events-none z-30"
                >
                  {c.emoji}
                </div>
              ))}
            </div>
          );
        };

        // ===================================================================
        // MODE 1: ROOM VIEW (Shared AcrylicRoomViewModal Component)
        // ===================================================================
        if (viewerMode === 'room') {
          const canvasRoomWidthInches =
            panels.length === 1
              ? isCustomSize && canUseCustomSize
                ? customWidth
                : panels[0]?.widthRatio || 12
              : selectedProductTypeId === 'canvas-wall-art'
              ? panels.length === 3
                ? 22
                : 24
              : selectedProductTypeId === 'canvas-split'
              ? 36
              : panels.length === 2
              ? 16
              : panels.length === 3
              ? 18
              : 16;

          const canvasRoomHeightInches =
            panels.length === 1
              ? isCustomSize && canUseCustomSize
                ? customHeight
                : panels[0]?.heightRatio || 12
              : selectedProductTypeId === 'canvas-wall-art'
              ? 22
              : selectedProductTypeId === 'canvas-split'
              ? 24
              : panels.length === 2
              ? 8
              : panels.length === 3
              ? 12
              : 16;

          const thicknessOption = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[0];
          const wrapDepthPx = thicknessOption?.depthPx || 26;

          return (
            <AcrylicRoomViewModal
              isOpen={true}
              onClose={() => setViewerMode(null)}
              productDimensionLabel={
                isCustomSize && canUseCustomSize
                  ? `${customWidth}" × ${customHeight}"`
                  : currentSizeOption.dimensionsSummary
              }
              productId={selectedProductTypeId}
              productName={selectedProductType.name}
              shapeId={shapeApplies ? selectedShapeId : 'shape-rectangle'}
              shapeName={shapeApplies ? currentShape.name : `${panels.length} Panels`}
              widthInches={canvasRoomWidthInches}
              heightInches={canvasRoomHeightInches}
              initialRoomState={roomViewState}
              onRoomStateChange={setRoomViewState}
              renderProduct={() => {
                if (selectedProductTypeId === 'canvas-split') {
                  const splitPanels = currentSizeOption.panels && currentSizeOption.panels.length >= 2
                    ? currentSizeOption.panels
                    : [{ id: 'p0', widthRatio: 12, heightRatio: 24 }, { id: 'p1', widthRatio: 12, heightRatio: 24 }, { id: 'p2', widthRatio: 12, heightRatio: 24 }];
                  const N = splitPanels.length;
                  const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;
                  const master = panelImages[0] || createDefaultPanel();
                  const gapPx = 6;
                  return (
                    <div className="relative w-full h-full pointer-events-none select-none flex items-center justify-center" style={{ gap: `${gapPx}px` }}>
                      {splitPanels.map((_, i) => (
                        <div
                          key={i}
                          className="relative h-full rounded-xs bg-white overflow-hidden"
                          style={{
                            flex: 1,
                            filter: `drop-shadow(${Math.round(wrapDepthPx * 0.35)}px ${Math.round(wrapDepthPx * 0.45)}px 0px rgba(30, 41, 59, 0.55))`
                          }}
                        >
                          {masterImage && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: `calc(-${i * 100}% - ${i * gapPx}px)`,
                                width: `calc(${N * 100}% + ${(N - 1) * gapPx}px)`,
                                height: '100%'
                              }}
                            >
                              <img
                                src={masterImage}
                                alt=""
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: master.fitMode === 'contain' ? 'contain' : 'cover',
                                  transform: `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg) scaleX(${mirrorImage ? -1 : 1})`,
                                  filter: getFilterCss(master.filter)
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div
                    className="relative w-full h-full pointer-events-none select-none flex items-center justify-center"
                    style={{
                      filter: `drop-shadow(${Math.round(wrapDepthPx * 0.35)}px ${Math.round(
                        wrapDepthPx * 0.45
                      )}px 0px rgba(30, 41, 59, 0.55))`
                    }}
                  >
                    <div
                      className={`relative w-full h-full overflow-hidden bg-white pointer-events-none select-none ${
                        shapeApplies ? currentShape.borderRadiusClass : 'rounded-xs'
                      }`}
                      style={{
                        clipPath: shapeApplies ? currentShape.clipPathStyle : undefined,
                        WebkitClipPath: shapeApplies ? currentShape.clipPathStyle : undefined,
                        border: hasOuterFrame && frameColor ? `4px solid ${frameColor}` : undefined
                      }}
                    >
                      {renderCanvasFrontDesign(180)}
                    </div>
                  </div>
                );
              }}
            />
          );
        }

        // ===================================================================
        // MODE 2 & 3: PHYSICAL 3D VIEW & 360° PRODUCT VIEW
        // ===================================================================
        return (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in"
            onClick={() => setViewerMode(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[94vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-200 bg-white shrink-0">
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
                    <span>{selectedProductType.name}</span>
                    <span>•</span>
                    <span>{shapeApplies ? currentShape.name : `${panels.length} Panels`}</span>
                    <span>•</span>
                    <span>
                      {isCustomSize && canUseCustomSize
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

                // Physical thickness based on selected Canvas thickness option & frame
                const thicknessOption = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId) || THICKNESS_OPTIONS[0];
                const baseDepthPx = thicknessOption?.depthPx || 26;
                const depthPx = hasOuterFrame ? Math.max(baseDepthPx, 34) : baseDepthPx;

                // Maintain exact product aspect ratio without stretching
                const maxBoxW = 310;
                const maxBoxH = 290;
                let cardW = maxBoxW;
                let cardH = cardW / previewAspect;
                if (cardH > maxBoxH) {
                  cardH = maxBoxH;
                  cardW = cardH * previewAspect;
                }
                cardW = Math.round(Math.max(140, cardW));
                cardH = Math.round(Math.max(140, cardH));

                // Normalized angle [0..360) and radians for dynamic lighting & shadow
                const normalizedAngle = ((viewerRotation % 360) + 360) % 360;
                const angleRad = (normalizedAngle * Math.PI) / 180;
                const effectiveTiltX = viewerTiltX;

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
                const shapeClipStyle: React.CSSProperties = shapeApplies
                  ? {
                      clipPath: currentShape.clipPathStyle,
                      WebkitClipPath: currentShape.clipPathStyle
                    }
                  : {};
                const shapeRadiusClass = shapeApplies ? currentShape.borderRadiusClass : 'rounded-[2px]';

                // Volumetric extrusion slices between -depthPx/2 and +depthPx/2 so curved/non-rectangular
                // shapes (Circle, Oval, Heart, Hexagon, Rounded Rect, Arch, Cloud, etc.) have continuous solid 3D thickness
                const SLICE_COUNT = 32;
                const depthSlices = Array.from({ length: SLICE_COUNT }, (_, idx) => {
                  const t = (idx + 0.5) / SLICE_COUNT; // 0..1 from back to front
                  const z = -depthPx / 2 + t * depthPx;
                  const isRearHalf = t < 0.22;
                  return { z, t, isRearHalf };
                });

                // Safe interior span for internal perpendicular spine plates on non-rectangular shapes
                // (prevents any see-through gap at exact 90° / 270° edge-on angles)
                const spineCoverage =
                  currentShape.id === 'shape-heart' ||
                  currentShape.id === 'shape-triangle' ||
                  currentShape.id === 'shape-speech-bubble' ||
                  currentShape.id === 'shape-cloud'
                    ? 0.64
                    : currentShape.id === 'shape-hexagon' ||
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
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* 3D / 360 Interactive Studio Stage */}
                    <div
                      onPointerDown={handleViewerPointerDown}
                      onPointerMove={handleViewerPointerMove}
                      onPointerUp={handleViewerPointerUp}
                      onPointerCancel={handleViewerPointerUp}
                      style={{
                        perspective: '1250px',
                        touchAction: 'none',
                        background:
                          'radial-gradient(circle at 50% 44%, #ffffff 0%, #f8fafc 58%, #e2e8f0 100%)'
                      }}
                      className={`relative h-[340px] sm:h-[430px] w-full flex items-center justify-center select-none overflow-hidden ${
                        isViewerDragging ? 'cursor-grabbing' : 'cursor-grab'
                      }`}
                    >
                      {/* Top-Left Mode Badge & Orientation Readout */}
                      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none z-20">
                        <span className="bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs">
                          {normalizedAngle < 35 || normalizedAngle >= 325
                            ? 'Front Face'
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
                            : '3/4 Front-Side Angle'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs tabular-nums pointer-events-none z-20">
                        {Math.round(normalizedAngle)}&deg;
                      </div>

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
                          transform: `rotateX(${effectiveTiltX}deg) rotateY(${viewerRotation}deg)`,
                          transition:
                            isViewerDragging || viewerAutoRotate
                              ? 'none'
                              : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                      >
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
                                <img
                                  src={primaryPhotoUrl}
                                  alt=""
                                  draggable={false}
                                  style={{ objectPosition: 'right center' }}
                                  className={`w-full h-full object-cover opacity-75 filter brightness-80 ${
                                    selectedWrapId === 'clear-edge' ? 'scale-x-[-1]' : ''
                                  }`}
                                />
                              )}
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    'linear-gradient(to right, rgba(0,0,0,0.22), rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.28))'
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
                                <img
                                  src={primaryPhotoUrl}
                                  alt=""
                                  draggable={false}
                                  style={{ objectPosition: 'left center' }}
                                  className={`w-full h-full object-cover opacity-75 filter brightness-80 ${
                                    selectedWrapId === 'clear-edge' ? 'scale-x-[-1]' : ''
                                  }`}
                                />
                              )}
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    'linear-gradient(to left, rgba(0,0,0,0.22), rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.28))'
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
                                <img
                                  src={primaryPhotoUrl}
                                  alt=""
                                  draggable={false}
                                  style={{ objectPosition: 'center top' }}
                                  className={`w-full h-full object-cover opacity-75 filter brightness-90 ${
                                    selectedWrapId === 'clear-edge' ? 'scale-y-[-1]' : ''
                                  }`}
                                />
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
                                filter: 'brightness(0.62)',
                                boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.22)'
                              }}
                            >
                              {!hasOuterFrame &&
                                selectedBorderWidthId === 'none' &&
                                primaryPhotoUrl &&
                                (selectedWrapId === 'full-bleed' || selectedWrapId === 'clear-edge') && (
                                <img
                                  src={primaryPhotoUrl}
                                  alt=""
                                  draggable={false}
                                  style={{ objectPosition: 'center bottom' }}
                                  className={`w-full h-full object-cover opacity-70 filter brightness-70 ${
                                    selectedWrapId === 'clear-edge' ? 'scale-y-[-1]' : ''
                                  }`}
                                />
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
                            transform: `translateZ(${(depthPx / 2 + 0.6).toFixed(2)}px)`,
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
                            transform: `rotateY(180deg) translateZ(${(depthPx / 2 + 0.6).toFixed(2)}px)`,
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
                            {selectedDisplayOptionId === 'dust-cover' ? (
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
                                    padding: `${Math.max(14, Math.round(Math.min(cardW, cardH) * 0.085))}px`,
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
                      </div>
                    </div>

                    {/* 360° View Controls Footer */}
                    {is360 && (
                      <div className="px-4 py-3 border-t border-stone-200 bg-stone-50 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setViewerAutoRotate((v) => !v)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                              viewerAutoRotate
                                ? 'bg-[#0E4A93] text-white shadow-xs'
                                : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                            }`}
                          >
                            <RotateCw className={`w-3.5 h-3.5 ${viewerAutoRotate ? 'animate-spin' : ''}`} />
                            <span>{viewerAutoRotate ? 'Pause 360°' : 'Auto Rotate'}</span>
                          </button>

                          <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={Math.round(normalizedAngle)}
                            onChange={(e) => {
                              setViewerAutoRotate(false);
                              setViewerRotation(Number(e.target.value));
                            }}
                            aria-label="360 degree rotation angle"
                            className="flex-1 accent-[#0E4A93] cursor-pointer"
                          />

                          <div className="hidden sm:flex items-center gap-1">
                            {[
                              { label: 'Front', deg: 0 },
                              { label: '3/4', deg: 35 },
                              { label: 'Side', deg: 90 },
                              { label: 'Back', deg: 180 }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  setViewerAutoRotate(false);
                                  setViewerRotation(preset.deg);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                  Math.abs(normalizedAngle - preset.deg) < 8
                                    ? 'bg-[#0E4A93] text-white'
                                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-center text-[11px] font-medium text-stone-500">
                          Drag horizontally left or right to rotate the physical Canvas 360&deg; — inspect the front artwork, wrapped edge thickness, and rear stretcher frame.
                        </div>
                      </div>
                    )}

                    {/* 3D View Controls Footer */}
                    {!is360 && (
                      <div className="px-4 py-3 border-t border-stone-200 bg-stone-50 space-y-2">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {[
                            { label: 'Front', rotY: 0, tiltX: 0 },
                            { label: '3/4 Left', rotY: -28, tiltX: 8 },
                            { label: '3/4 Right', rotY: 28, tiltX: 8 },
                            { label: 'Side Edge', rotY: -82, tiltX: 4 },
                            { label: 'Back & Hardware', rotY: 180, tiltX: 6 }
                          ].map((v) => {
                            const isCurrent =
                              Math.abs(((viewerRotation - v.rotY + 540) % 360) - 180) < 8;
                            return (
                              <button
                                key={v.label}
                                type="button"
                                onClick={() => {
                                  setViewerAutoRotate(false);
                                  setViewerRotation(v.rotY);
                                  setViewerTiltX(v.tiltX);
                                }}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#0E4A93] text-white shadow-xs'
                                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                                }`}
                              >
                                {v.label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-center text-[11px] font-medium text-stone-500">
                          Drag horizontally or vertically to inspect the physical Canvas perspective, edge depth, and rear frame.
                        </p>
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
                <img src="/canvas-india-official-logo.png" alt="Canvas India" className="h-8 w-auto object-contain" />
                <button onClick={() => setMenuOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
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

      {/* Select Size & Shape Modal */}
      <SelectSizeShapeModal
        isOpen={isSizeShapeModalOpen}
        onClose={() => setIsSizeShapeModalOpen(false)}
        material="canvas"
        productId={selectedProductTypeId}
        productName={selectedProductType.name}
        currentShapeId={selectedShapeId}
        currentSizeId={selectedSizeId}
        isCustomSize={isCustomSize}
        customWidth={customWidth}
        customHeight={customHeight}
        onSelectSizeAndShape={handleApplySizeAndShape}
      />
    </div>
  );
};

export default CanvasCustomizerPage;

