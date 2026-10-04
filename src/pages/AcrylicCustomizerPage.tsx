import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Menu,
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
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
  AlertCircle, 
  Trash2, 
  Move,
  Eye,
  Crop,
  Grid,
  Search,
  Shapes,
  Maximize2,
  Smartphone,
  Laptop,
  Copy,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import {
  ToolbarTab,
  AcrylicProductType,
  ACRYLIC_PRODUCT_TYPES,
  SizeCategory,
  SizeOption,
  SIZE_OPTIONS,
  LayoutType,
  LayoutSlotDefinition,
  getLayoutSlots,
  LayoutPreset,
  LAYOUT_PRESETS,
  DesignTemplate,
  DESIGN_TEMPLATES,
  HardwareOption,
  HARDWARE_OPTIONS,
  DisplayOption,
  DISPLAY_OPTIONS,
  FinishOption,
  FINISH_OPTIONS,
  FrameOption,
  FRAME_OPTIONS,
  ColorFilterType,
  ColorFinishOption,
  COLOR_FINISH_OPTIONS,
  TypographyOption,
  TYPOGRAPHY_OPTIONS,
  AcrylicEdgeWrap,
  ACRYLIC_EDGE_WRAPS,
  ACRYLIC_WRAP_OPTIONS,
  AcrylicShapeOption,
  ACRYLIC_SHAPES,
  getCompatibleShapesForProduct,
  getSizesForShape,
  getCompatibleHardwareForProduct,
  normalizeAcrylicHardwareId,
  getHardwarePointsForShape,
  ACRYLIC_BACKGROUNDS,
  ACRYLIC_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS,
  THICKNESS_OPTIONS,
  PAPER_OPTIONS,
  FONT_OPTIONS,
  TEXT_COLOR_PRESETS,
  DesignCategory,
  DESIGN_CATEGORIES,
  AcrylicDesignOverlay,
  ACRYLIC_DESIGN_OVERLAYS
} from '../data/acrylicCustomizerData';
import { AcrylicLiveTextEditor, TextElement } from '../components/AcrylicLiveTextEditor';
import { AcrylicClipartModal, ClipartElement } from '../components/AcrylicClipartModal';
import { AcrylicRoomViewModal, RoomPlacementState } from '../components/AcrylicRoomViewModal';
import { AcrylicShapePreview } from '../components/AcrylicShapePreview';
import { CustomizerProductSelector } from '../components/CustomizerProductSelector';
import { CustomizerPreloader, PRELOADER_MIN_MS } from '../components/CustomizerPreloader';
import {
  CustomizerHeader,
  CustomizerSidebar,
  CustomizerPanel,
  CustomizerTopToolbar,
  CustomizerPreviewArea
} from '../components/CustomizerUiShell';
import { ClipartItem } from '../data/acrylicClipartData';
import { SelectSizeShapeModal } from '../components/SelectSizeShapeModal';
import { getProductSizeShapeOptions, getSizesForProductAndShape } from '../data/productSizeShapeConfig';

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export interface UploadedImageMeta {
  file?: File;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: number;
}

export interface PanelImageState {
  imageUrl: string | null;
  uploadedImage?: UploadedImageMeta | null;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
  fitMode: 'contain' | 'cover';
  filter: ColorFilterType;
  textElements: TextElement[];
  clipartElements: ClipartElement[];
}

export type SelectedElementType = 'image' | 'text' | 'clipart';

export interface SelectedElement {
  type: SelectedElementType;
  panelIndex: number;
  elementId?: string;
}

const createDefaultPanelState = (imageUrl: string | null = null): PanelImageState => ({
  imageUrl,
  uploadedImage: null,
  panX: 0,
  panY: 0,
  scale: 1,
  rotation: 0,
  fitMode: 'contain',
  filter: 'original',
  textElements: [],
  clipartElements: []
});

const CURVED_GEOMETRIC_SHAPES = ['shape-circle', 'shape-oval', 'shape-heart', 'shape-hexagon'];

// ============================================================================
// MAIN ACRYLIC CUSTOMIZER COMPONENT
// ============================================================================

export const AcrylicCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Matched catalog product with safe fallback so route never renders blank even if catalog is empty
  const catalogProduct = useMemo(() => {
    const safeList = Array.isArray(allProducts) ? allProducts : [];
    return (
      safeList.find(
        (p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'acrylic'
      ) ||
      safeList.find((p) => p.categorySlug === 'acrylic') ||
      safeList[0] || {
        id: productId || 'acrylic-rectangle-print',
        slug: productId || 'acrylic-rectangle-print',
        name: 'Acrylic Print',
        categorySlug: 'acrylic' as const,
        price: 355,
        originalPrice: 710,
        rating: 4.9,
        reviewsCount: 128,
        image: '/images/acrylic/shapes/landscape.svg',
        images: ['/images/acrylic/shapes/landscape.svg'],
        sizes: [],
        thicknesses: ['3mm', '5mm', '8mm'],
        orientations: ['Landscape', 'Portrait', 'Square'],
        description: 'Vibrant direct UV sub-surface print on crystal acrylic.',
        highlights: [],
        inStock: true
      }
    );
  }, [allProducts, productId]);

  // Active Left Toolbar Tab
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

  // Track whether the user has explicitly selected a custom shape or layout in the SHAPES / LAYOUTS tabs
  const hasUserSelectedCustomShapeRef = useRef<boolean>(false);
  const hasUserSelectedCustomLayoutRef = useRef<boolean>(false);

  // Resolve initial Acrylic Product ID from URL param or catalog product (within 5 Acrylic products)
  const resolveProductTypeId = (urlId?: string, catProd?: { id?: string; slug?: string; name?: string }): string => {
    const directMatch = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === urlId);
    if (directMatch) return directMatch.id;
    const key = (urlId || catProd?.slug || catProd?.id || catProd?.name || '').toLowerCase();
    if (key.includes('wall') || key.includes('display')) return 'acrylic-wall-art';
    if (key.includes('collage')) return 'acrylic-collage';
    if (key.includes('split') || key.includes('triptych')) return 'acrylic-split';
    if (key.includes('mosaic')) return 'acrylic-mosaic';
    return 'acrylic-print';
  };

  // Selected Acrylic Product Type (Single source of truth for selected Acrylic product)
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(() =>
    resolveProductTypeId(productId, catalogProduct)
  );

  const selectedProductType = useMemo(() => {
    return ACRYLIC_PRODUCT_TYPES.find((pt) => pt.id === selectedProductTypeId) || ACRYLIC_PRODUCT_TYPES[0];
  }, [selectedProductTypeId]);

  // Product-Specific Compatible Shapes (Centralized via AcrylicProductShapeConfig)
  const compatibleShapes = useMemo(() => {
    return getCompatibleShapesForProduct(selectedProductTypeId);
  }, [selectedProductTypeId]);

  // Full Hardware Options (all 7 restored hardware options from HARDWARE_OPTIONS)
  const compatibleHardware = useMemo(() => {
    return getCompatibleHardwareForProduct(selectedProductTypeId);
  }, [selectedProductTypeId]);

  // Size Category filter tabs in SELECT SIZE panel
  const [sizeCategory, setSizeCategory] = useState<SizeCategory>('RECOMMENDED');

  // Shape Selection State (Filtered by selected Acrylic product)
  const [selectedShapeId, setSelectedShapeId] = useState<string>(() => {
    const initProdId = resolveProductTypeId(productId, catalogProduct);
    const initAllowedShapes = getCompatibleShapesForProduct(initProdId);
    const paramShape = searchParams.get('shape')?.toLowerCase();
    if (paramShape) {
      const match = initAllowedShapes.find(
        (s) => s.id.toLowerCase() === paramShape || s.id.toLowerCase() === `shape-${paramShape}`
      );
      if (match) return match.id;
    }
    if (catalogProduct?.shape) {
      const catShape = String(catalogProduct.shape).toLowerCase();
      const match = initAllowedShapes.find(
        (s) => s.id.toLowerCase() === catShape || s.id.toLowerCase() === `shape-${catShape}`
      );
      if (match) return match.id;
    }
    if (productId) {
      const lowerSlug = productId.toLowerCase();
      const slugShapeMatch = initAllowedShapes.find((s) =>
        lowerSlug.includes(s.id.replace('shape-', '').toLowerCase())
      );
      if (slugShapeMatch) return slugShapeMatch.id;
    }
    const initProd = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === initProdId);
    if (initProd?.defaultShape && initAllowedShapes.some((s) => s.id === initProd.defaultShape)) {
      return initProd.defaultShape;
    }
    return initAllowedShapes[0]?.id || 'shape-square';
  });

  // Automatically fallback to the product's default shape (or first compatible shape) if current shape is incompatible
  useEffect(() => {
    if (compatibleShapes.length > 0 && !compatibleShapes.some((s) => s.id === selectedShapeId)) {
      const defaultShape =
        selectedProductType?.defaultShape && compatibleShapes.some((s) => s.id === selectedProductType.defaultShape)
          ? selectedProductType.defaultShape
          : compatibleShapes[0].id;
      setSelectedShapeId(defaultShape);
    }
  }, [compatibleShapes, selectedShapeId, selectedProductType]);

  const currentShape = useMemo(() => {
    return (
      compatibleShapes.find((s) => s.id === selectedShapeId) ||
      ACRYLIC_SHAPES.find((s) => s.id === selectedShapeId) ||
      compatibleShapes[0] ||
      ACRYLIC_SHAPES[0]
    );
  }, [compatibleShapes, selectedShapeId]);

  const isCurvedShape = useMemo(() => {
    return CURVED_GEOMETRIC_SHAPES.includes(selectedShapeId);
  }, [selectedShapeId]);

  // Dynamic Shape-Specific Sizes (shape-aware pipeline from centralized productSizeShapeConfig)
  const shapeSizes = useMemo(() => {
    const configSizes = getSizesForProductAndShape(selectedProductTypeId, selectedShapeId, 'acrylic');
    const filtered = selectedProductTypeId === 'acrylic-mosaic'
      ? configSizes.filter((opt) => !(opt.widthInches === 9 && opt.heightInches === 9) && !(opt.widthInches === 16 && opt.heightInches === 16))
      : configSizes;
    return filtered.map((opt) => ({
      id: opt.id,
      productTypeId: selectedProductTypeId,
      category: (opt.category === 'MULTI_PANEL' ? 'RECTANGLE' : opt.category) as SizeCategory,
      label: opt.label,
      dimensionsSummary: opt.dimensionsSummary,
      widthInches: opt.widthInches,
      heightInches: opt.heightInches,
      price: opt.price,
      aspectClass: opt.aspectRatio >= 1.2 ? 'aspect-[16/10]' : opt.aspectRatio <= 0.8 ? 'aspect-[10/16]' : 'aspect-square',
      image: opt.widthInches === opt.heightInches ? '/assets/customizer/acrylic/sizes/square.svg' : '/assets/customizer/acrylic/sizes/panoramic.svg'
    }));
  }, [selectedShapeId, selectedProductTypeId]);

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => {
    const defaultSizes = getSizesForShape(selectedShapeId, selectedProductTypeId);
    const initProd = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === selectedProductTypeId);
    if (initProd?.defaultSizeOptionId) {
      const matched = defaultSizes.find((s) => s.id === initProd.defaultSizeOptionId);
      if (matched) return matched.id;
    }
    return defaultSizes[0]?.id || 'shape-square-8x8';
  });

  useEffect(() => {
    if (shapeSizes.length > 0 && !shapeSizes.some((s) => s.id === selectedSizeId)) {
      const defaultMatched = selectedProductType?.defaultSizeOptionId
        ? shapeSizes.find((s) => s.id === selectedProductType.defaultSizeOptionId)
        : undefined;
      setSelectedSizeId(defaultMatched?.id || shapeSizes[0]?.id);
    }
  }, [shapeSizes, selectedSizeId, selectedProductType]);

  // Custom Size controls (1" × 1" up to 44" × 44")
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<number>(12);
  const [customHeight, setCustomHeight] = useState<number>(12);
  const [customWidthInput, setCustomWidthInput] = useState<string>('12');
  const [customHeightInput, setCustomHeightInput] = useState<string>('12');
  const [customSizeError, setCustomSizeError] = useState<string | null>(null);

  const validateAndApplyCustomDimensions = (wRaw: string, hRaw: string): boolean => {
    const wTrim = wRaw.trim();
    const hTrim = hRaw.trim();
    if (!wTrim || !hTrim) {
      setCustomSizeError('Please enter both Width and Height (between 1" and 44").');
      return false;
    }
    const wNum = Number(wTrim);
    const hNum = Number(hTrim);
    if (isNaN(wNum) || isNaN(hNum) || wNum < 1 || hNum < 1) {
      setCustomSizeError('Dimensions must be at least 1" × 1" (positive numbers only).');
      return false;
    }
    if (wNum > 44 || hNum > 44) {
      setCustomSizeError('Maximum allowed size is 44" × 44". Dimensions cannot exceed 44".');
      return false;
    }
    setCustomSizeError(null);
    setCustomWidth(Math.round(wNum));
    setCustomHeight(Math.round(hNum));
    setIsCustomSize(true);
    return true;
  };

  const currentSizeOption: SizeOption = useMemo(() => {
    const matchedShapeSize = shapeSizes.find((s) => s.id === selectedSizeId);
    if (matchedShapeSize) return matchedShapeSize;
    const configOpt = getProductSizeShapeOptions(selectedProductTypeId, 'acrylic').find((o) => o.id === selectedSizeId);
    if (configOpt) {
      return {
        id: configOpt.id,
        productTypeId: selectedProductTypeId,
        category: (configOpt.category === 'MULTI_PANEL' ? 'RECTANGLE' : configOpt.category) as SizeCategory,
        label: configOpt.label,
        dimensionsSummary: configOpt.dimensionsSummary,
        widthInches: configOpt.widthInches,
        heightInches: configOpt.heightInches,
        price: configOpt.price,
        aspectClass: configOpt.aspectRatio >= 1.2 ? 'aspect-[16/10]' : configOpt.aspectRatio <= 0.8 ? 'aspect-[10/16]' : 'aspect-square',
        image: '/assets/customizer/acrylic/sizes/square.svg'
      };
    }
    return (
      SIZE_OPTIONS.find((s) => s.id === selectedSizeId) ||
      shapeSizes[0] ||
      SIZE_OPTIONS[0]
    );
  }, [selectedSizeId, shapeSizes, selectedProductTypeId]);

  // Layouts & Designs Subtabs — initialized from selectedProductType's defaultLayoutId
  const [layoutSubTab, setLayoutSubTab] = useState<'LAYOUTS' | 'DESIGNS'>('LAYOUTS');
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(() => {
    const initProdId = resolveProductTypeId(productId, catalogProduct);
    const initProd = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === initProdId) || ACRYLIC_PRODUCT_TYPES[0];
    return initProd.defaultLayoutId || 'layout-1-single';
  });

  // Sync product & default layout if route param :productId changes
  useEffect(() => {
    if (!productId) return;
    const matchedId = resolveProductTypeId(productId, catalogProduct);
    const matchedProd = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === matchedId);
    if (matchedProd) {
      setSelectedProductTypeId(matchedProd.id);
      setSelectedLayoutId(matchedProd.defaultLayoutId || 'layout-1-single');
    }
  }, [productId]);

  // Designs Overlay state
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<DesignCategory>('Minimal');
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const activeDesignOverlay = useMemo(() => {
    if (!selectedDesignId) return null;
    return ACRYLIC_DESIGN_OVERLAYS.find((d) => d.id === selectedDesignId) || null;
  }, [selectedDesignId]);

  const currentLayout = useMemo(() => {
    return LAYOUT_PRESETS.find((l) => l.id === selectedLayoutId) || LAYOUT_PRESETS[0];
  }, [selectedLayoutId]);

  const frames = currentLayout.frames;

  // Frame Images State (independent slots)
  const [panelImages, setPanelImages] = useState<Record<number, PanelImageState>>({
    0: createDefaultPanelState(null),
    1: createDefaultPanelState(null),
    2: createDefaultPanelState(null),
    3: createDefaultPanelState(null)
  });

  // Active Frame / Element Selection
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({
    type: 'image',
    panelIndex: 0
  });

  // Hardware & Finish States (Strictly defaults to "No Hooks" for all products)
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>(() => {
    const initProdId = resolveProductTypeId(productId, catalogProduct);
    const initProd = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === initProdId);
    return normalizeAcrylicHardwareId(initProd?.defaultHardwareId || 'no-hooks');
  });

  // Select Size & Shape Modal State
  const [isSizeShapeModalOpen, setIsSizeShapeModalOpen] = useState<boolean>(false);

  // Apply handler for SelectSizeShapeModal in Acrylic Customizer
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
      setCustomWidthInput(String(config.widthInches));
      setCustomHeightInput(String(config.heightInches));
      setSelectedShapeId(config.shapeId);
    } else {
      setIsCustomSize(false);
      setSelectedShapeId(config.shapeId);
      setSelectedSizeId(config.sizeId);

      if (config.arrangement) {
        if (config.arrangement === 'threeCollage' || config.arrangement === 'threeSplit') {
          setSelectedLayoutId('layout-3-split');
        } else if (config.arrangement === 'fourGrid') {
          setSelectedLayoutId('layout-4-grid');
        } else if (config.arrangement === 'twoSplit') {
          setSelectedLayoutId('layout-2-split');
        }
      }
    }

    // Customer photos remain attached and refitted cleanly
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

  // Normalize hardware ID if any legacy alias is encountered
  useEffect(() => {
    const normalized = normalizeAcrylicHardwareId(selectedHardwareId);
    if (normalized !== selectedHardwareId) {
      setSelectedHardwareId(normalized);
    }
  }, [selectedHardwareId]);

  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('display-standoff');
  const [selectedFinishId, setSelectedFinishId] = useState<string>('high-gloss');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('no-frame');
  const [selectedEdgeWrapId, setSelectedEdgeWrapId] = useState<string>('full-bleed');

  // Options panel states
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('3mm');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('white-luster');
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>('transparent');
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [selectedTypographyId, setSelectedTypographyId] = useState<string>('modern-sans');

  // Material Variant
  const ACRYLIC_MATERIAL_VARIANTS = [
    { id: 'optical-crystal', name: 'Optical Crystal Acrylic', desc: 'Ultra-clear 99.7% light transmission optical cast acrylic panel', tag: 'Standard' },
    { id: 'frosted-satin', name: 'Frosted Satin Acrylic', desc: 'Non-glare velvet frosted rear surface for diffuse elegance', tag: '+₹99' },
    { id: 'onyx-black', name: 'Onyx Black Backed Acrylic', desc: 'Opaque deep black backing layer for rich contrast & depth', tag: '+₹149' }
  ];
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('optical-crystal');
  const [materialModalOpen, setMaterialModalOpen] = useState<boolean>(false);

  // Dedicated Lyric Acrylic State (for acrylic-lyric product typography overlay)
  const [lyricTitle, setLyricTitle] = useState<string>('PERFECT');
  const [lyricArtist, setLyricArtist] = useState<string>('ED SHEERAN');
  const [lyricText, setLyricText] = useState<string>(
    "Baby, I'm dancing in the dark\nWith you between my arms\nBarefoot on the grass\nListening to our favorite song\nWhen you said you looked a mess\nI whispered underneath my breath\nYou heard it, darling\nYou look perfect tonight"
  );
  const [lyricFontFamily, setLyricFontFamily] = useState<'serif' | 'script' | 'sans' | 'cinzel'>('serif');
  const [lyricTextColor, setLyricTextColor] = useState<string>('#FFFFFF');
  const [lyricTemplate, setLyricTemplate] = useState<'center-minimal' | 'music-player' | 'elegant-script' | 'split-card'>('center-minimal');
  const [lyricOverlayDarkness, setLyricOverlayDarkness] = useState<number>(35);

  // Uploaded Photos session gallery
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

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

  // Room View state
  const [showRoomView, setShowRoomView] = useState<boolean>(false);
  const [roomViewState, setRoomViewState] = useState<RoomPlacementState>({
    roomPreset: 'office',
    customRoomUrl: null,
    productRoomX: 0.22,
    productRoomY: 0.33
  });

  // Automatically close Room View if all uploaded photos are removed
  useEffect(() => {
    if (!hasUploadedImage && showRoomView) {
      setShowRoomView(false);
    }
  }, [hasUploadedImage, showRoomView]);

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
              ...next[slotIdx],
              imageUrl: slotIdx === 0 && nextUploaded.length === 1 ? fallbackUrl : null,
              uploadedImage: null,
              panX: 0,
              panY: 0,
              scale: 1,
              rotation: 0
            };
          }
        });
        return next;
      });
    }
  };

  // Remove photo from a specific Acrylic slot (and from uploadedPhotos if no other slot uses it)
  const handleRemoveSlotPhoto = (panelIdx: number) => {
    const removedUrl = panelImages[panelIdx]?.imageUrl;
    setPanelImages((prev) => {
      const current = prev[panelIdx] || createDefaultPanelState(null);
      const next: Record<number, PanelImageState> = {
        ...prev,
        [panelIdx]: {
          ...current,
          imageUrl: null,
          uploadedImage: null,
          panX: 0,
          panY: 0,
          scale: 1,
          rotation: 0
        }
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

  // Clear all uploaded photos from both the tray and all Acrylic slots
  const handleClearAllUploadedPhotos = () => {
    setUploadedPhotos([]);
    setPanelImages((prev) => {
      const next: Record<number, PanelImageState> = {};
      Object.keys(prev).forEach((k) => {
        const slotIdx = Number(k);
        next[slotIdx] = {
          ...prev[slotIdx],
          imageUrl: null,
          uploadedImage: null,
          panX: 0,
          panY: 0,
          scale: 1,
          rotation: 0
        };
      });
      return next;
    });
  };

  // Add Text Editor Popover State
  const [showTextModal, setShowTextModal] = useState<boolean>(false);

  // Clipart Picker Popover State
  const [showClipartModal, setShowClipartModal] = useState<boolean>(false);

  // UI Modals & Notifications
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Drag-and-Drop state for Upload Panel -> Canvas Frames
  const [draggingPhotoIndex, setDraggingPhotoIndex] = useState<number | null>(null);
  const [dragOverPanelIndex, setDragOverPanelIndex] = useState<number | null>(null);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState<boolean>(false);

  // Helper to assign a photo to a specific panel slot non-destructively
  const handleAssignPhotoToPanel = (photoSrc: string, panelIdx: number) => {
    if (!photoSrc) return;
    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || 1200;
      const naturalHeight = img.naturalHeight || 800;
      const aspectRatio = naturalWidth / naturalHeight;

      updateFrame(panelIdx, (curr) => ({
        ...curr,
        imageUrl: photoSrc,
        uploadedImage: {
          src: photoSrc,
          naturalWidth,
          naturalHeight,
          aspectRatio
        },
        panX: 0,
        panY: 0,
        scale: 1,
        rotation: 0,
        fitMode: 'contain'
      }));

      setActivePanelIndex(panelIdx);
      setSelectedElement({ type: 'image', panelIndex: panelIdx });
      setValidationWarning(null);
    };
    img.onerror = () => {
      updateFrame(panelIdx, (curr) => ({
        ...curr,
        imageUrl: photoSrc,
        panX: 0,
        panY: 0,
        scale: 1,
        rotation: 0,
        fitMode: 'contain'
      }));
      setActivePanelIndex(panelIdx);
      setSelectedElement({ type: 'image', panelIndex: panelIdx });
    };
    img.src = photoSrc;
  };

  // Drop handler for a specific panel slot
  const handlePanelSlotDrop = (e: React.DragEvent, panelIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverPanelIndex(null);
    setIsDragOverCanvas(false);
    setDraggingPhotoIndex(null);

    // 1. Check custom tray index data from upload panel
    const trayIdxStr = e.dataTransfer.getData('application/x-ci-tray');
    if (trayIdxStr !== '' && !isNaN(Number(trayIdxStr))) {
      const photo = uploadedPhotos[Number(trayIdxStr)];
      if (photo) {
        handleAssignPhotoToPanel(photo, panelIdx);
        return;
      }
    }

    // 2. Check plain text / URL data
    const textData = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
    if (textData && (textData.startsWith('data:image') || textData.startsWith('http') || textData.startsWith('/') || textData.startsWith('blob:'))) {
      handleAssignPhotoToPanel(textData, panelIdx);
      setUploadedPhotos((prev) => (prev.includes(textData) ? prev : [textData, ...prev]));
      return;
    }

    // 3. Native files dropped from user OS
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && (file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name))) {
        handleSingleFileChange(file, panelIdx);
      }
    }
  };

  // Mobile Upload & QR Code Sync State
  const [uploadMode, setUploadMode] = useState<'computer' | 'mobile'>('computer');
  const [uploadSessionId] = useState<string>(() => 'ac-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [serverLanIp, setServerLanIp] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const processedImagesRef = useRef<Set<string>>(new Set<string>());

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

  // Compute mobile upload URL
  const mobileUploadUrl = useMemo(() => {
    if (serverLanIp && window.location.hostname === 'localhost') {
      return `http://${serverLanIp}:${window.location.port || '3000'}/mobile-upload/${uploadSessionId}`;
    }
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

    // 1. Add to gallery list
    setUploadedPhotos((prev) => (prev.includes(imgSrc) ? prev : [imgSrc, ...prev]));

    // 2. Load into image meta to preserve full natural dimensions non-destructively
    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || 1200;
      const naturalHeight = img.naturalHeight || 800;
      const aspectRatio = naturalWidth / naturalHeight;

      // 3. Determine target slot
      let targetSlot = activePanelIndex;
      if (frames.length > 1) {
        // If active slot already has an image, look for an empty slot
        const emptyIdx = [0, 1, 2, 3].slice(0, frames.length).find((idx) => !panelImages[idx]?.imageUrl);
        if (emptyIdx !== undefined) {
          targetSlot = emptyIdx;
          setActivePanelIndex(emptyIdx);
        }
      }

      updateFrame(targetSlot, (curr) => ({
        ...curr,
        imageUrl: imgSrc,
        uploadedImage: {
          src: imgSrc,
          naturalWidth,
          naturalHeight,
          aspectRatio
        },
        panX: 0,
        panY: 0,
        scale: 1,
        rotation: 0,
        fitMode: 'contain'
      }));

      setSelectedElement({ type: 'image', panelIndex: targetSlot });
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
      console.warn('[AcrylicCustomizer] Supabase Realtime subscription error:', err);
    }
  }, [uploadSessionId, activePanelIndex, frames.length, panelImages]);

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
  }, [uploadSessionId, activePanelIndex, frames.length, panelImages]);

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
  }, [uploadSessionId, activePanelIndex, frames.length, panelImages]);

  // 3. Poll Connect API endpoint every 1.5 seconds for cross-network phone uploads
  useEffect(() => {
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
  }, [uploadSessionId, activePanelIndex, frames.length, panelImages]);

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number; panelIdx: number } | null>(null);
  const textDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);
  const clipartDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);
  const frameElsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const wheelBoundNodesRef = useRef<WeakSet<HTMLDivElement>>(new WeakSet());
  const imageDimsRef = useRef<Record<number, { naturalWidth: number; naturalHeight: number }>>({});

  // Compute how far an image at (scale, rotation, fitMode) may be panned inside its slot element
  const getPanBounds = (panelIdx: number, curr: PanelImageState, nextScale = curr.scale, nextRotation = curr.rotation, nextFitMode = curr.fitMode) => {
    const el = frameElsRef.current[panelIdx];
    const W = el?.clientWidth || 320;
    const H = el?.clientHeight || 320;
    const nat = curr.uploadedImage || imageDimsRef.current[panelIdx];
    const natW = nat?.naturalWidth || W;
    const natH = nat?.naturalHeight || H;
    const imgRatio = Math.max(0.05, natW / Math.max(1, natH));
    const slotRatio = Math.max(0.05, W / Math.max(1, H));

    let renderedW = W;
    let renderedH = H;
    if (nextFitMode === 'contain') {
      if (imgRatio > slotRatio) {
        renderedW = W;
        renderedH = W / imgRatio;
      } else {
        renderedH = H;
        renderedW = H * imgRatio;
      }
    } else {
      // cover / fill mode
      if (imgRatio > slotRatio) {
        renderedH = H;
        renderedW = H * imgRatio;
      } else {
        renderedW = W;
        renderedH = W / imgRatio;
      }
    }

    const s = Math.max(0.4, nextScale || 1);
    const rot = (((nextRotation || 0) % 360) + 360) % 360;
    const swapped = rot === 90 || rot === 270;
    const effW = (swapped ? renderedH : renderedW) * s;
    const effH = (swapped ? renderedW : renderedH) * s;

    const minVisibleX = Math.min(W, effW) * 0.25;
    const minVisibleY = Math.min(H, effH) * 0.25;
    const maxPanX = Math.max(Math.abs(effW - W) / 2, (W + effW) / 2 - minVisibleX);
    const maxPanY = Math.max(Math.abs(effH - H) / 2, (H + effH) / 2 - minVisibleY);
    return { maxPanX, maxPanY };
  };

  const clampPanForFrame = (
    panelIdx: number,
    curr: PanelImageState,
    panX: number,
    panY: number,
    nextScale = curr.scale,
    nextRotation = curr.rotation,
    nextFitMode = curr.fitMode
  ) => {
    const { maxPanX, maxPanY } = getPanBounds(panelIdx, curr, nextScale, nextRotation, nextFitMode);
    return {
      panX: Math.max(-maxPanX, Math.min(maxPanX, panX)),
      panY: Math.max(-maxPanY, Math.min(maxPanY, panY))
    };
  };

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetPanelRef = useRef<number>(0);

  // Handle URL pre-selects
  useEffect(() => {
    const sizeParam = searchParams.get('size');
    if (sizeParam) {
      const matched = SIZE_OPTIONS.find((s) => s.id === sizeParam || s.label.toLowerCase() === sizeParam.toLowerCase());
      if (matched) setSelectedSizeId(matched.id);
    }
  }, [searchParams]);

  // Update a specific frame's state
  const updateFrame = (panelIdx: number, updater: (curr: PanelImageState) => PanelImageState) => {
    setPanelImages((prev) => {
      const current = prev[panelIdx] || createDefaultPanelState(null);
      return {
        ...prev,
        [panelIdx]: updater(current)
      };
    });
  };

  // Active Frame helper
  const activeFrameState = panelImages[activePanelIndex] || createDefaultPanelState(null);

  // Helper to compute the price of any size option for the currently selected Acrylic product
  const getProductSizePrice = (sizeBasePrice: number) => {
    const minShapeSizePrice = shapeSizes[0]?.price || 399;
    const sizeDifferential = Math.max(0, sizeBasePrice - minShapeSizePrice);
    return Math.round((selectedProductType.startingPrice + sizeDifferential) * 100) / 100;
  };

  // Dynamic Pricing Calculation derived from selectedProductType + selectedSize + options
  const finalPrice = useMemo(() => {
    let base = selectedProductType.startingPrice;

    if (isCustomSize) {
      // Custom size calculation (1" × 1" up to 44" × 44")
      const customAreaAddon = Math.max(0, Math.round(customWidth * customHeight * 4.5) - 355);
      base = selectedProductType.startingPrice + customAreaAddon;
    } else if (currentSizeOption) {
      const minShapeSizePrice = shapeSizes[0]?.price || currentSizeOption.price;
      const sizeDifferential = Math.max(0, currentSizeOption.price - minShapeSizePrice);
      base = selectedProductType.startingPrice + sizeDifferential;
    }

    // Shape Laser-Cut Addon (if any)
    if (currentShape?.priceAddon) {
      base += currentShape.priceAddon;
    }

    // Hardware
    const hw = HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
    if (hw) base += hw.price;

    // Finish
    const fin = FINISH_OPTIONS.find((f) => f.id === selectedFinishId);
    if (fin) base += fin.price;

    // Frame
    const frm = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    if (frm) base += frm.price;

    // Edge Wrap / Border
    const wrap = ACRYLIC_WRAP_OPTIONS.find((w) => w.id === selectedEdgeWrapId);
    if (wrap) base += wrap.price;

    // Thickness
    const thick = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId);
    if (thick) base += thick.price;

    return Math.max(355, Math.round(base * 100) / 100);
  }, [
    currentSizeOption,
    shapeSizes,
    selectedProductType,
    isCustomSize,
    customWidth,
    customHeight,
    currentShape,
    selectedHardwareId,
    selectedFinishId,
    selectedFrameId,
    selectedEdgeWrapId,
    selectedThicknessId
  ]);

  // Dimension label helper
  const currentDimensionLabel = useMemo(() => {
    if (isCustomSize) {
      return `${customWidth}" × ${customHeight}"`;
    }
    return currentSizeOption?.label || currentShape.name;
  }, [isCustomSize, customWidth, customHeight, currentShape, currentSizeOption]);

  const effectiveWidthInches = useMemo(() => {
    const rawW = isCustomSize ? customWidth : (currentSizeOption?.widthInches || 12);
    const rawH = isCustomSize ? customHeight : (currentSizeOption?.heightInches || 12);
    if (['shape-square', 'shape-circle', 'shape-heart', 'shape-hexagon'].includes(selectedShapeId)) {
      return Math.max(rawW, rawH);
    }
    if (['shape-landscape', 'shape-oval'].includes(selectedShapeId)) {
      if (rawW < rawH) return rawH;
      if (rawW === rawH) return Math.round(rawH * 1.35);
    }
    if (selectedShapeId === 'shape-portrait') {
      if (rawW > rawH) return rawH;
    }
    return rawW;
  }, [isCustomSize, customWidth, customHeight, currentSizeOption, selectedShapeId]);

  const effectiveHeightInches = useMemo(() => {
    const rawW = isCustomSize ? customWidth : (currentSizeOption?.widthInches || 12);
    const rawH = isCustomSize ? customHeight : (currentSizeOption?.heightInches || 12);
    if (['shape-square', 'shape-circle', 'shape-heart', 'shape-hexagon'].includes(selectedShapeId)) {
      return Math.max(rawW, rawH);
    }
    if (['shape-landscape', 'shape-oval'].includes(selectedShapeId)) {
      if (rawW < rawH) return rawW;
    }
    if (selectedShapeId === 'shape-portrait') {
      if (rawH < rawW) return rawW;
      if (rawH === rawW) return Math.round(rawW * 1.35);
    }
    return rawH;
  }, [isCustomSize, customWidth, customHeight, currentSizeOption, selectedShapeId]);

  const productAspectRatio = useMemo(() => {
    return Math.max(0.2, effectiveWidthInches / Math.max(1, effectiveHeightInches));
  }, [effectiveWidthInches, effectiveHeightInches]);

  // Centralized normalized layout slots (0..1) for the active layout and product aspect ratio
  const layoutSlots = useMemo(() => {
    return getLayoutSlots(currentLayout.layoutType, productAspectRatio);
  }, [currentLayout.layoutType, productAspectRatio]);

  useEffect(() => {
    if (activePanelIndex >= layoutSlots.length) {
      setActivePanelIndex(0);
      setSelectedElement({ type: 'image', panelIndex: 0 });
    }
  }, [layoutSlots.length, activePanelIndex]);

  // Click on empty frame opens picker for that specific frame
  const handleEmptyFrameClick = (panelIdx: number) => {
    uploadTargetPanelRef.current = panelIdx;
    singleFileInputRef.current?.click();
  };

  // Single file picker change
  const handleSingleFileChange = (file: File | null, explicitPanelIdx?: number) => {
    if (!file) return;
    const targetIdx = explicitPanelIdx !== undefined ? explicitPanelIdx : uploadTargetPanelRef.current;

    if (file.size > 40 * 1024 * 1024) {
      alert(`File ${file.name} exceeds the 40MB limit.`);
      return;
    }

    const reader = new FileReader();
    // Preloader stays visible for exactly as long as this real read takes -
    // genuinely scales with file size / device speed, loops longer if slow.
    beginPreloader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          const naturalWidth = img.naturalWidth || 800;
          const naturalHeight = img.naturalHeight || 600;
          const aspectRatio = naturalWidth / naturalHeight;

          updateFrame(targetIdx, (curr) => ({
            ...curr,
            imageUrl: result,
            uploadedImage: {
              file,
              src: result,
              naturalWidth,
              naturalHeight,
              aspectRatio
            },
            panX: 0,
            panY: 0,
            scale: 1,
            rotation: 0,
            fitMode: 'contain'
          }));
          setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
          setActivePanelIndex(targetIdx);
          setSelectedElement({ type: 'image', panelIndex: targetIdx });
          setValidationWarning(null);
          endPreloader(PRELOADER_MIN_MS);
        };
        img.onerror = () => {
          updateFrame(targetIdx, (curr) => ({
            ...curr,
            imageUrl: result,
            panX: 0,
            panY: 0,
            scale: 1,
            rotation: 0,
            fitMode: 'contain'
          }));
          setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
          endPreloader();
        };
        img.src = result;
      } else {
        endPreloader();
      }
    };
    reader.onerror = () => endPreloader();
    reader.readAsDataURL(file);
  };

  // Multiple files upload to session gallery
  const handleGalleryUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Preloader stays visible for exactly as long as all these reads take -
    // genuinely scales with file size/count and device speed.
    beginPreloader();
    const readers: Promise<{ result: string; file: File; naturalWidth: number; naturalHeight: number; aspectRatio: number } | null>[] = [];

    Array.from(files).forEach((file) => {
      if (file.size <= 40 * 1024 * 1024) {
        const promise = new Promise<{ result: string; file: File; naturalWidth: number; naturalHeight: number; aspectRatio: number } | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
              const img = new Image();
              img.onload = () => {
                const naturalWidth = img.naturalWidth || 800;
                const naturalHeight = img.naturalHeight || 600;
                resolve({ result, file, naturalWidth, naturalHeight, aspectRatio: naturalWidth / naturalHeight });
              };
              img.onerror = () => resolve({ result, file, naturalWidth: 800, naturalHeight: 600, aspectRatio: 1.33 });
              img.src = result;
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        });
        readers.push(promise);
      }
    });

    Promise.all(readers).then((items) => {
      const validItems = items.filter((item): item is NonNullable<typeof item> => !!item);
      const newPhotos = validItems.map((v) => v.result);
      setUploadedPhotos((prev) => [...newPhotos, ...prev]);

      if (!panelImages[activePanelIndex]?.imageUrl && validItems[0]) {
        const first = validItems[0];
        updateFrame(activePanelIndex, (curr) => ({
          ...curr,
          imageUrl: first.result,
          uploadedImage: {
            file: first.file,
            src: first.result,
            naturalWidth: first.naturalWidth,
            naturalHeight: first.naturalHeight,
            aspectRatio: first.aspectRatio
          },
          panX: 0,
          panY: 0,
          scale: 1,
          rotation: 0,
          fitMode: 'contain'
        }));
      }
      endPreloader(PRELOADER_MIN_MS);
    });
  };

  // Image Transformations (Per Active Frame)
  const handleZoomIn = () => {
    updateFrame(activePanelIndex, (curr) => {
      const nextScale = Math.min(curr.scale + 0.15, 3.5);
      const clamped = clampPanForFrame(activePanelIndex, curr, curr.panX || 0, curr.panY || 0, nextScale);
      return { ...curr, scale: nextScale, ...clamped };
    });
  };

  const handleZoomOut = () => {
    updateFrame(activePanelIndex, (curr) => {
      const nextScale = Math.max(curr.scale - 0.15, 0.4);
      const clamped = clampPanForFrame(activePanelIndex, curr, curr.panX || 0, curr.panY || 0, nextScale);
      return { ...curr, scale: nextScale, ...clamped };
    });
  };

  const handleRotateLeft = () => {
    updateFrame(activePanelIndex, (curr) => {
      const nextRotation = (curr.rotation - 90 + 360) % 360;
      const clamped = clampPanForFrame(activePanelIndex, curr, curr.panX || 0, curr.panY || 0, curr.scale, nextRotation);
      return { ...curr, rotation: nextRotation, ...clamped };
    });
  };

  const handleRotateRight = () => {
    updateFrame(activePanelIndex, (curr) => {
      const nextRotation = (curr.rotation + 90) % 360;
      const clamped = clampPanForFrame(activePanelIndex, curr, curr.panX || 0, curr.panY || 0, curr.scale, nextRotation);
      return { ...curr, rotation: nextRotation, ...clamped };
    });
  };

  const handleRotate = handleRotateRight;

  const handleResetImage = () => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      scale: 1,
      panX: 0,
      panY: 0,
      rotation: 0
    }));
  };

  // Fill: makes the uploaded image completely cover the product/image frame (visual crop), preserving original image intact
  const handleFill = (panelIdx = activePanelIndex) => {
    updateFrame(panelIdx, (curr) => {
      const nextFitMode: 'contain' | 'cover' = 'cover';
      const clamped = clampPanForFrame(panelIdx, curr, 0, 0, Math.max(1, curr.scale), curr.rotation, nextFitMode);
      return {
        ...curr,
        fitMode: nextFitMode,
        panX: clamped.panX,
        panY: clamped.panY
      };
    });
  };

  // Fix (Fit): fits the complete uncropped original image visually inside the product/image frame without any distortion
  const handleFix = (panelIdx = activePanelIndex) => {
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      fitMode: 'contain',
      panX: 0,
      panY: 0,
      scale: 1
    }));
  };

  const handleApplyFilter = (filterType: ColorFilterType) => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      filter: filterType
    }));
  };

  // Image Panning Handlers
  const handleImagePointerDown = (e: React.PointerEvent<HTMLDivElement>, panelIdx: number) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    setIsDragging(true);

    const frame = panelImages[panelIdx] || createDefaultPanelState(null);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: frame.panX || 0,
      initialPanY: frame.panY || 0,
      panelIdx
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleImagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    e.preventDefault();
    const { x, y, initialPanX, initialPanY, panelIdx: targetIdx } = dragStartRef.current;
    const rawPanX = initialPanX + (e.clientX - x);
    const rawPanY = initialPanY + (e.clientY - y);

    updateFrame(targetIdx, (curr) => ({
      ...curr,
      ...clampPanForFrame(targetIdx, curr, rawPanX, rawPanY)
    }));
  };

  const handleImagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Wheel Zoom Listener Ref Callback (idempotent per DOM node to prevent duplicate listeners on re-render)
  const registerWheelRef = (panelIdx: number) => (el: HTMLDivElement | null) => {
    frameElsRef.current[panelIdx] = el;
    if (!el || wheelBoundNodesRef.current.has(el)) return;
    wheelBoundNodesRef.current.add(el);
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
      updateFrame(panelIdx, (curr) => {
        const nextScale = Math.max(0.4, Math.min(curr.scale + zoomFactor, 3.5));
        const clamped = clampPanForFrame(panelIdx, curr, curr.panX || 0, curr.panY || 0, nextScale);
        return { ...curr, scale: nextScale, ...clamped };
      });
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
  };

  // Drag Text Element
  const startTextDrag = (e: React.PointerEvent<HTMLDivElement>, panelIdx: number, textId: string, rect: DOMRect) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: textId });

    const txt = panelImages[panelIdx]?.textElements.find((t) => t.id === textId);
    if (!txt) return;

    textDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffset: { x: txt.x, y: txt.y },
      rect
    };

    const targetEl = e.currentTarget;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch {}

    const onMove = (moveEv: PointerEvent) => {
      if (!textDragRef.current) return;
      const { x, y, initialOffset, rect: r } = textDragRef.current;
      const percentX = ((moveEv.clientX - x) / Math.max(1, r.width)) * 100;
      const percentY = ((moveEv.clientY - y) / Math.max(1, r.height)) * 100;
      const nextX = Math.max(-48, Math.min(48, initialOffset.x + percentX));
      const nextY = Math.max(-48, Math.min(48, initialOffset.y + percentY));

      updateFrame(panelIdx, (curr) => ({
        ...curr,
        textElements: curr.textElements.map((t) =>
          t.id === textId ? { ...t, x: nextX, y: nextY } : t
        )
      }));
    };

    const onUp = (upEv: PointerEvent) => {
      textDragRef.current = null;
      try {
        targetEl.releasePointerCapture(upEv.pointerId);
      } catch {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Drag Clipart Element
  const startClipartDrag = (e: React.PointerEvent<HTMLDivElement>, panelIdx: number, clipId: string, rect: DOMRect) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: clipId });

    const clip = panelImages[panelIdx]?.clipartElements.find((c) => c.id === clipId);
    if (!clip) return;

    clipartDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffset: { x: clip.x, y: clip.y },
      rect
    };

    const targetEl = e.currentTarget;
    try {
      targetEl.setPointerCapture(e.pointerId);
    } catch {}

    const onMove = (moveEv: PointerEvent) => {
      if (!clipartDragRef.current) return;
      const { x, y, initialOffset, rect: r } = clipartDragRef.current;
      const percentX = ((moveEv.clientX - x) / Math.max(1, r.width)) * 100;
      const percentY = ((moveEv.clientY - y) / Math.max(1, r.height)) * 100;
      const nextX = Math.max(-48, Math.min(48, initialOffset.x + percentX));
      const nextY = Math.max(-48, Math.min(48, initialOffset.y + percentY));

      updateFrame(panelIdx, (curr) => ({
        ...curr,
        clipartElements: curr.clipartElements.map((c) =>
          c.id === clipId ? { ...c, x: nextX, y: nextY } : c
        )
      }));
    };

    const onUp = (upEv: PointerEvent) => {
      clipartDragRef.current = null;
      try {
        targetEl.releasePointerCapture(upEv.pointerId);
      } catch {}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Remove any empty text objects (text.trim() === "") across all slots
  const pruneEmptyTextElements = (keepId?: string) => {
    setPanelImages((prev) => {
      let changed = false;
      const next: Record<number, PanelImageState> = { ...prev };
      Object.keys(next).forEach((key) => {
        const idx = Number(key);
        const slotState = next[idx];
        if (!slotState?.textElements?.length) return;
        const filtered = slotState.textElements.filter(
          (t) => t.id === keepId || t.text.trim().length > 0
        );
        if (filtered.length !== slotState.textElements.length) {
          changed = true;
          next[idx] = {
            ...slotState,
            textElements: filtered
          };
        }
      });
      return changed ? next : prev;
    });
  };

  // Text Elements Management — NEVER insert default visible text
  const handleAddNewText = () => {
    const activeSlot = panelImages[activePanelIndex] || createDefaultPanelState(null);
    const existingEmpty = activeSlot.textElements.find((t) => t.text.trim() === '');
    if (existingEmpty) {
      setSelectedElement({ type: 'text', panelIndex: activePanelIndex, elementId: existingEmpty.id });
      setShowTextModal(true);
      return;
    }

    const newId = `text-${Date.now()}`;
    const hasPhotoInSlot = !!activeSlot.imageUrl;
    const newTextObj: TextElement = {
      id: newId,
      text: '',
      fontFamily: '"Playfair Display", Georgia, serif',
      fontSize: 26,
      fontWeight: 'bold',
      color: hasPhotoInSlot ? '#FFFFFF' : '#0F172A',
      alignment: 'center',
      lineHeight: 1.2,
      letterSpacing: 0,
      rotation: 0,
      x: 0,
      y: 0
    };

    pruneEmptyTextElements(newId);
    updateFrame(activePanelIndex, (curr) => ({
      ...curr.textElements ? curr : createDefaultPanelState(curr.imageUrl),
      textElements: [...(curr.textElements || []).filter((t) => t.text.trim().length > 0), newTextObj]
    }));
    setSelectedElement({ type: 'text', panelIndex: activePanelIndex, elementId: newId });
    setShowTextModal(true);
  };

  const handleCloseTextModal = () => {
    pruneEmptyTextElements();
    setShowTextModal(false);
    setSelectedElement((prev) => {
      if (prev.type === 'text' && prev.elementId) {
        const txt = panelImages[prev.panelIndex]?.textElements.find((t) => t.id === prev.elementId);
        if (!txt || txt.text.trim() === '') {
          return { type: 'image', panelIndex: activePanelIndex };
        }
      }
      return prev;
    });
  };

  const handleUpdateActiveText = (updates: Partial<TextElement>) => {
    if (selectedElement.type !== 'text' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      textElements: curr.textElements.map((t) => (t.id === selectedElement.elementId ? { ...t, ...updates } : t))
    }));
  };

  const handleDuplicateActiveText = () => {
    if (selectedElement.type !== 'text' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    const source = panelImages[panelIdx]?.textElements.find((t) => t.id === selectedElement.elementId);
    if (!source || source.text.trim() === '') return;
    const newId = `text-${Date.now()}`;
    const copyText: TextElement = {
      ...source,
      id: newId,
      x: Math.min(45, source.x + 4),
      y: Math.min(45, source.y + 4)
    };
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      textElements: [...curr.textElements, copyText]
    }));
    setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: newId });
  };

  const handleDeleteActiveText = () => {
    if (selectedElement.type !== 'text' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      textElements: curr.textElements.filter((t) => t.id !== selectedElement.elementId)
    }));
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    setShowTextModal(false);
  };

  // Clipart Elements Management
  const handleSelectClipart = (clip: ClipartItem) => {
    const newId = `clipart-${Date.now()}`;
    const newClipObj: ClipartElement = {
      id: newId,
      clipartId: clip.id,
      name: clip.name,
      svgPath: clip.svgPath,
      viewBox: clip.viewBox,
      x: 0,
      y: -25,
      scale: 1.2,
      rotation: 0,
      color: '#D4AF37'
    };

    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      clipartElements: [...curr.clipartElements, newClipObj]
    }));
    setSelectedElement({ type: 'clipart', panelIndex: activePanelIndex, elementId: newId });
  };

  const handleUpdateActiveClipart = (updates: Partial<ClipartElement>) => {
    if (selectedElement.type !== 'clipart' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      clipartElements: curr.clipartElements.map((c) => (c.id === selectedElement.elementId ? { ...c, ...updates } : c))
    }));
  };

  const handleDuplicateActiveClipart = () => {
    if (selectedElement.type !== 'clipart' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    const source = panelImages[panelIdx]?.clipartElements.find((c) => c.id === selectedElement.elementId);
    if (!source) return;
    const newId = `clipart-${Date.now()}`;
    const copyClip: ClipartElement = {
      ...source,
      id: newId,
      x: Math.min(42, source.x + 4),
      y: Math.min(42, source.y + 4)
    };
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      clipartElements: [...curr.clipartElements, copyClip]
    }));
    setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: newId });
  };

  const handleDeleteActiveClipart = () => {
    if (selectedElement.type !== 'clipart' || !selectedElement.elementId) return;
    const panelIdx = selectedElement.panelIndex;
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      clipartElements: curr.clipartElements.filter((c) => c.id !== selectedElement.elementId)
    }));
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
  };

  const activeTextElement = useMemo(() => {
    if (selectedElement.type === 'text' && selectedElement.elementId) {
      return panelImages[selectedElement.panelIndex]?.textElements.find((t) => t.id === selectedElement.elementId) || null;
    }
    return null;
  }, [selectedElement, panelImages]);

  const activeClipartElement = useMemo(() => {
    if (selectedElement.type === 'clipart' && selectedElement.elementId) {
      return panelImages[selectedElement.panelIndex]?.clipartElements.find((c) => c.id === selectedElement.elementId) || null;
    }
    return null;
  }, [selectedElement, panelImages]);

  const handleDeleteSelectedElement = () => {
    if (selectedElement.type === 'text' && selectedElement.elementId) {
      handleDeleteActiveText();
    } else if (selectedElement.type === 'clipart' && selectedElement.elementId) {
      handleDeleteActiveClipart();
    }
  };

  // Helper to check if a size option's dimensions match the target shape's natural orientation
  const doesSizeMatchShapeOrientation = (size: SizeOption, shapeId: string): boolean => {
    if (['shape-square', 'shape-circle', 'shape-heart', 'shape-hexagon'].includes(shapeId)) {
      return size.widthInches === size.heightInches;
    }
    if (['shape-landscape', 'shape-oval'].includes(shapeId)) {
      return size.widthInches > size.heightInches;
    }
    if (shapeId === 'shape-portrait') {
      return size.heightInches > size.widthInches;
    }
    if (['shape-rectangle', 'shape-rounded-rect'].includes(shapeId)) {
      return size.widthInches !== size.heightInches;
    }
    return true;
  };

  // Switch Acrylic Product Type: updates product, header, price, default layout, and default/compatible shape & hardware
  const handleSelectProductType = (ptId: string) => {
    const pt = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === ptId);
    if (!pt) return;

    // 1. Update selected product state (updates card checkmark, header title, and price)
    setSelectedProductTypeId(pt.id);

    // 2. Apply the product's default layout (4-grid for Acrylic Collage, 2-split for Acrylic Split Panel; preserve manual layout between single-panel products)
    const isMultiSlotProduct = (id: string) =>
      id === 'acrylic-collage' || id === 'acrylic-split' || id === 'acrylic-wall-art' || id === 'acrylic-mosaic';
    const shouldApplyDefaultLayout =
      isMultiSlotProduct(pt.id) ||
      isMultiSlotProduct(selectedProductTypeId) ||
      !hasUserSelectedCustomLayoutRef.current;
    const nextLayoutId = shouldApplyDefaultLayout
      ? (pt.defaultLayoutId || 'layout-1-single')
      : selectedLayoutId;
    setSelectedLayoutId(nextLayoutId);
    if (isMultiSlotProduct(pt.id)) {
      hasUserSelectedCustomLayoutRef.current = false;
    }

    // 3. Apply product default shape unless user explicitly picked a custom shape in SHAPES that is compatible with the new product
    const allowedShapes = getCompatibleShapesForProduct(pt.id);
    const defaultShapeForProduct =
      pt.defaultShape && allowedShapes.some((s) => s.id === pt.defaultShape)
        ? pt.defaultShape
        : (allowedShapes[0]?.id || 'shape-square');

    let nextShapeId = defaultShapeForProduct;
    if (hasUserSelectedCustomShapeRef.current && allowedShapes.some((s) => s.id === selectedShapeId)) {
      nextShapeId = selectedShapeId;
    } else {
      hasUserSelectedCustomShapeRef.current = false;
      nextShapeId = defaultShapeForProduct;
    }
    if (nextShapeId !== selectedShapeId) {
      setSelectedShapeId(nextShapeId);
    }

    // 4. Apply product-specific default hardware and thickness (validated against compatible hardware)
    const allowedHardware = getCompatibleHardwareForProduct(pt.id);
    const defaultHwNormalized = normalizeAcrylicHardwareId(pt.defaultHardwareId || 'no-hooks');
    if (allowedHardware.some((h) => h.id === defaultHwNormalized)) {
      setSelectedHardwareId(defaultHwNormalized);
    } else {
      const normalizedHw = normalizeAcrylicHardwareId(selectedHardwareId);
      if (!allowedHardware.some((h) => h.id === normalizedHw)) {
        setSelectedHardwareId(allowedHardware[0]?.id || 'no-hooks');
      } else if (normalizedHw !== selectedHardwareId) {
        setSelectedHardwareId(normalizedHw);
      }
    }
    if (pt.defaultThicknessId) {
      setSelectedThicknessId(pt.defaultThicknessId);
    }

    // 5. Preserve uploaded images non-destructively across slot count changes
    setPanelImages((prev) => {
      const next: Record<number, PanelImageState> = {
        0: prev[0] || createDefaultPanelState(null),
        1: prev[1] || createDefaultPanelState(null),
        2: prev[2] || createDefaultPanelState(null),
        3: prev[3] || createDefaultPanelState(null)
      };

      // If switching to a single-image product and slot 0 is empty, keep the first uploaded slot image
      if (!next[0].imageUrl) {
        const firstOccupied = [1, 2, 3].map((i) => next[i]).find((s) => !!s?.imageUrl);
        if (firstOccupied && firstOccupied.imageUrl) {
          next[0] = {
            ...firstOccupied,
            panX: 0,
            panY: 0,
            scale: 1,
            rotation: 0
          };
        }
      }
      return next;
    });

    // 6. Reset active slot index to 0
    setActivePanelIndex(0);
    setSelectedElement({ type: 'image', panelIndex: 0 });

    // 7. Update selected size to match the active shape and product
    if (!isCustomSize) {
      const newSizes = getSizesForShape(nextShapeId, pt.id);
      if (newSizes.length > 0) {
        const defaultProductSize = pt.defaultSizeOptionId
          ? newSizes.find((s) => s.id === pt.defaultSizeOptionId)
          : undefined;
        const matchingSize = newSizes.find(
          (s) =>
            doesSizeMatchShapeOrientation(s, nextShapeId) &&
            (s.label === currentSizeOption?.label ||
              (s.widthInches === currentSizeOption?.widthInches &&
                s.heightInches === currentSizeOption?.heightInches))
        );
        const firstOrientationSize = newSizes.find((s) => doesSizeMatchShapeOrientation(s, nextShapeId));
        const targetSize =
          nextShapeId === defaultShapeForProduct && defaultProductSize
            ? defaultProductSize
            : (matchingSize || defaultProductSize || firstOrientationSize || newSizes[0]);
        setSelectedSizeId(targetSize.id);
      }
    }

    // 8. Open the "Select size & shape" popup modal immediately
    setIsSizeShapeModalOpen(true);
  };

  // Switch acrylic shape (updates workspace geometry, aspect ratio, clipping mask, and size orientation)
  const handleSelectShape = (shapeId: string) => {
    hasUserSelectedCustomShapeRef.current = true;
    setSelectedShapeId(shapeId);
    const newSizes = getSizesForShape(shapeId, selectedProductTypeId);

    if (isCustomSize) {
      if (['shape-square', 'shape-circle', 'shape-heart', 'shape-hexagon'].includes(shapeId)) {
        const side = Math.max(customWidth, customHeight);
        setCustomWidth(side);
        setCustomHeight(side);
        setCustomWidthInput(String(side));
        setCustomHeightInput(String(side));
      } else if (['shape-landscape', 'shape-oval'].includes(shapeId) && customWidth <= customHeight) {
        const nextW = customWidth === customHeight ? Math.min(44, Math.round(customHeight * 1.35)) : customHeight;
        const nextH = customWidth;
        setCustomWidth(nextW);
        setCustomHeight(nextH);
        setCustomWidthInput(String(nextW));
        setCustomHeightInput(String(nextH));
      } else if (shapeId === 'shape-portrait' && customHeight <= customWidth) {
        const nextW = customHeight;
        const nextH = customWidth === customHeight ? Math.min(44, Math.round(customWidth * 1.35)) : customWidth;
        setCustomWidth(nextW);
        setCustomHeight(nextH);
        setCustomWidthInput(String(nextW));
        setCustomHeightInput(String(nextH));
      }
    } else if (newSizes.length > 0) {
      const matchingOrientationSize = newSizes.find(
        (s) =>
          doesSizeMatchShapeOrientation(s, shapeId) &&
          (s.label === currentSizeOption?.label ||
            (s.widthInches === currentSizeOption?.widthInches &&
              s.heightInches === currentSizeOption?.heightInches))
      );
      const firstOrientationSize = newSizes.find((s) => doesSizeMatchShapeOrientation(s, shapeId));
      const targetSize = matchingOrientationSize || firstOrientationSize || newSizes[0];
      setSelectedSizeId(targetSize.id);
    }

    // Open size & shape modal to confirm or pick size
    setIsSizeShapeModalOpen(true);
  };

  // Switch layout preset (independent of product type and shape selection)
  const handleSelectLayout = (layout: LayoutPreset) => {
    hasUserSelectedCustomLayoutRef.current = true;
    setSelectedLayoutId(layout.id);
    setActivePanelIndex(0);
    setSelectedElement({ type: 'image', panelIndex: 0 });
  };

  // Save customization to local storage (filtering out any empty text objects)
  const handleSaveDesign = () => {
    pruneEmptyTextElements();
    const cleanedPanels: Record<number, PanelImageState> = {};
    Object.keys(panelImages).forEach((k) => {
      const idx = Number(k);
      const p = panelImages[idx];
      if (p) {
        cleanedPanels[idx] = {
          ...p,
          textElements: (p.textElements || []).filter((t) => t.text.trim().length > 0)
        };
      }
    });

    const designPayload = {
      productId: catalogProduct?.id || productId,
      productTypeId: selectedProductTypeId,
      productTypeName: selectedProductType.name,
      sizeId: isCustomSize ? 'custom' : selectedSizeId,
      isCustomSize,
      customWidth,
      customHeight,
      widthInches: effectiveWidthInches,
      heightInches: effectiveHeightInches,
      dimensionLabel: currentDimensionLabel,
      shapeId: selectedShapeId,
      shapeName: currentShape.name,
      layoutId: selectedLayoutId,
      designId: selectedDesignId,
      hardwareId: selectedHardwareId,
      finishId: selectedFinishId,
      thicknessId: selectedThicknessId,
      frameId: selectedFrameId,
      edgeWrapId: selectedEdgeWrapId,
      borderWidthId: selectedBorderWidthId,
      borderColor: selectedBorderColor,
      roomView: roomViewState,
      panelImages: cleanedPanels,
      uploadedPhotos,
      quantity: 1,
      savedAt: new Date().toISOString(),
      finalPrice
    };

    try {
      localStorage.setItem(`canvas_india_acrylic_custom_${productId}`, JSON.stringify(designPayload));
      setSaveToast('Custom design saved to browser successfully!');
      setTimeout(() => setSaveToast(null), 3500);
    } catch {
      setValidationWarning('Design is too large to save in browser storage (try smaller images).');
      setTimeout(() => setValidationWarning(null), 4000);
    }
  };

  // Add to Cart with ShopContext typing (stores full non-empty configuration)
  const handleAddToCart = () => {
    pruneEmptyTextElements();
    const hasAnyPhoto = Object.values(panelImages).some((p) => !!p.imageUrl);
    if (!hasAnyPhoto) {
      setValidationWarning('Please upload at least one photo to complete your Acrylic customizer.');
      setTimeout(() => setValidationWarning(null), 4000);
      return;
    }

    if (onAddToCartCustomized && catalogProduct) {
      const firstPhoto =
        panelImages[0]?.imageUrl ||
        uploadedPhotos[0] ||
        catalogProduct?.image ||
        '/assets/customizer/acrylic/products/acrylic-photo-panel.jpg';

      const selectedHardwareObj =
        compatibleHardware.find((h) => h.id === selectedHardwareId) ||
        HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
      const selectedFinishObj = FINISH_OPTIONS.find((f) => f.id === selectedFinishId);

      const activeSlotsPayload = layoutSlots.map((slot, idx) => {
        const p = panelImages[idx] || createDefaultPanelState(null);
        const nonEmptyTexts = (p.textElements || []).filter((t) => t.text.trim().length > 0);
        return {
          slot: idx + 1,
          dimension: slot.label,
          imageUrl: p.imageUrl || null,
          panX: p.panX || 0,
          panY: p.panY || 0,
          scale: p.scale || 1,
          rotation: p.rotation || 0,
          fitMode: p.fitMode || 'contain',
          filter: p.filter || 'original',
          textElements: nonEmptyTexts,
          clipartElements: p.clipartElements || []
        };
      });

      onAddToCartCustomized({
        product: {
          ...catalogProduct,
          price: finalPrice,
          name: `${selectedProductType.name} (${currentShape.name}) - ${currentDimensionLabel}`
        },
        quantity: 1,
        size: currentDimensionLabel,
        calculatedPrice: finalPrice,
        material: 'Acrylic',
        finish: selectedFinishObj?.name || 'High Gloss Optical Acrylic',
        thickness: THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || '3mm',
        style: `${selectedProductType.name} • ${currentShape.name} • ${selectedHardwareObj?.name || 'No Hardware'}`,
        photoUrl: firstPhoto,
        customizationDetails: {
          product: selectedProductType.name,
          productTypeId: selectedProductTypeId,
          productType: selectedProductType.name,
          shapeId: selectedShapeId,
          shape: currentShape.name,
          sizeId: isCustomSize ? 'custom' : selectedSizeId,
          size: currentDimensionLabel,
          isCustomSize,
          customWidth: isCustomSize ? customWidth : undefined,
          customHeight: isCustomSize ? customHeight : undefined,
          widthInches: effectiveWidthInches,
          heightInches: effectiveHeightInches,
          dimensions: currentDimensionLabel,
          layoutId: selectedLayoutId,
          layout: currentLayout.name,
          design: activeDesignOverlay?.name || 'None',
          hardwareId: selectedHardwareId,
          hardware: selectedHardwareObj?.name || 'No Hardware',
          finishId: selectedFinishId,
          finish: selectedFinishObj?.name || 'High Gloss Optical Acrylic',
          thickness: THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || '3mm',
          edgeWrap: ACRYLIC_WRAP_OPTIONS.find((w) => w.id === selectedEdgeWrapId)?.name || 'Full Bleed',
          borderWidth: ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.label || 'No Border',
          borderColor: selectedBorderWidthId !== 'none' ? selectedBorderColor : undefined,
          frame: FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name || 'Frameless',
          paper: PAPER_OPTIONS.find((p) => p.id === selectedPaperId)?.label || 'White Luster Finish',
          uploadedImages: activeSlotsPayload.map((s) => s.imageUrl).filter((u): u is string => !!u),
          imagePositions: activeSlotsPayload.map((s) => ({ slot: s.slot, x: s.panX, y: s.panY })),
          imageScale: activeSlotsPayload.map((s) => ({ slot: s.slot, scale: s.scale })),
          imageRotation: activeSlotsPayload.map((s) => ({ slot: s.slot, rotation: s.rotation })),
          textObjects: activeSlotsPayload.flatMap((s) => s.textElements),
          clipart: activeSlotsPayload.flatMap((s) => s.clipartElements),
          roomView: roomViewState,
          quantity: 1,
          price: finalPrice,
          panels: activeSlotsPayload
        }
      });
      navigate('/cart');
    }
  };

  // ============================================================================
  // EXACT SHAPE-FOLLOWING SVG BORDER RENDERER
  // ============================================================================
  const renderShapeBorder = () => {
    let strokeColor = '#CBD5E1';
    let strokeWidth = 1.4;
    let isClearEdge = false;

    if (selectedEdgeWrapId === 'white-border') {
      strokeColor = '#FFFFFF';
      strokeWidth = 4.5;
    } else if (selectedEdgeWrapId === 'black-border') {
      strokeColor = '#0F172A';
      strokeWidth = 4.5;
    } else if (selectedEdgeWrapId === 'clear-edge') {
      strokeColor = 'rgba(255, 255, 255, 0.78)';
      strokeWidth = 3;
      isClearEdge = true;
    }

    const borderWidthPx = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0;
    if (borderWidthPx > 0) {
      strokeColor = selectedBorderColor;
      strokeWidth = Math.max(strokeWidth, Math.min(8, Math.round(borderWidthPx / 2.5)));
    }

    return (
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none z-25 overflow-visible"
      >
        {selectedShapeId === 'shape-heart' && (
          <path
            d="M 50,85 C 12,58 2,38 2,24 C 2,8 14,2 28,2 C 38,2 46,8 50,18 C 54,8 62,2 72,2 C 86,2 98,8 98,24 C 98,38 88,58 50,85 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        )}
        {selectedShapeId === 'shape-circle' && (
          <circle
            cx="50"
            cy="50"
            r={50 - strokeWidth / 2}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {selectedShapeId === 'shape-oval' && (
          <ellipse
            cx="50"
            cy="50"
            rx={50 - strokeWidth / 2}
            ry={38 - strokeWidth / 2}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {selectedShapeId === 'shape-hexagon' && (
          <polygon
            points="25,1 75,1 99,50 75,99 25,99 1,50"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        )}
        {selectedShapeId === 'shape-rounded-rect' && (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={100 - strokeWidth}
            height={100 - strokeWidth}
            rx="10"
            ry="10"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(selectedShapeId) && (
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={100 - strokeWidth}
            height={100 - strokeWidth}
            rx="3"
            ry="3"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}

        {isClearEdge && (
          <g opacity="0.6">
            {selectedShapeId === 'shape-circle' ? (
              <circle cx="50" cy="50" r={47} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" />
            ) : selectedShapeId === 'shape-heart' ? (
              <path d="M 50,82 C 14,56 4,37 4,25 C 4,10 15,4 28,4 C 37,4 45,10 50,19 C 55,10 63,4 72,4 C 85,4 96,10 96,25 C 96,37 86,56 50,82 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            ) : (
              <rect x="3" y="3" width="94" height="94" rx="4" ry="4" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="5 2" />
            )}
          </g>
        )}
      </svg>
    );
  };

  // ============================================================================
  // SHAPE-AWARE HARDWARE VISUAL RENDERER (Applied directly to the product preview)
  // ============================================================================
  const renderInternalHardwareOverlay = (isRoomView = false) => {
    const hwId = normalizeAcrylicHardwareId(selectedHardwareId);
    if (hwId === 'no-hooks') return null;

    const points = getHardwarePointsForShape(selectedShapeId);
    const topPoints = points.slice(0, 2);

    // 1. Chrome Standoffs ('standoff-mounts'): 4 brushed stainless corner/perimeter bolts following the active shape
    if (hwId === 'standoff-mounts') {
      const boltSizeClass = isRoomView ? 'w-2.5 h-2.5' : 'w-4 h-4';
      const innerDotClass = isRoomView ? 'w-1 h-1' : 'w-1.5 h-1.5';
      return (
        <div className="absolute inset-0 pointer-events-none z-30">
          {points.map((pt, idx) => (
            <div
              key={`standoff-${idx}`}
              style={{
                position: 'absolute',
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`${boltSizeClass} rounded-full bg-gradient-to-tr from-slate-500 via-slate-100 to-white border border-slate-700 shadow-[0_2px_5px_rgba(0,0,0,0.45)] flex items-center justify-center`}
            >
              <div className={`${innerDotClass} rounded-full bg-slate-600/80 border border-white/60`} />
            </div>
          ))}
        </div>
      );
    }

    // 2. Hooks for Hanging ('hooks-hanging'): Twin self-levelling top hanging hooks inside the top shape mounting points
    if (hwId === 'hooks-hanging') {
      return (
        <div className="absolute inset-0 pointer-events-none z-30">
          {topPoints.map((pt, idx) => (
            <div
              key={`hooks-hanging-${idx}`}
              style={{
                position: 'absolute',
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`${
                isRoomView ? 'w-4 h-2.5' : 'w-6 h-3.5'
              } rounded-t-full bg-gradient-to-b from-slate-300 via-slate-100 to-slate-500 border border-slate-700 shadow-md flex items-center justify-center`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-white/70" />
            </div>
          ))}
        </div>
      );
    }

    // 3. Ready to Hang Cleat ('ready-to-hang'): Pre-installed recessed French cleat wall hanger inside the shape contour
    if (hwId === 'ready-to-hang') {
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-28"
        >
          {selectedShapeId === 'shape-circle' ? (
            <circle
              cx="50"
              cy="50"
              r="41"
              fill="none"
              stroke="rgba(30, 41, 59, 0.38)"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
          ) : selectedShapeId === 'shape-oval' ? (
            <ellipse
              cx="50"
              cy="50"
              rx="41"
              ry="30"
              fill="none"
              stroke="rgba(30, 41, 59, 0.38)"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
          ) : selectedShapeId === 'shape-heart' ? (
            <path
              d="M 50,76 C 20,54 12,38 12,26 C 12,14 20,10 30,10 C 38,10 45,15 50,23 C 55,15 62,10 70,10 C 80,10 88,14 88,26 C 88,38 80,54 50,76 Z"
              fill="none"
              stroke="rgba(30, 41, 59, 0.38)"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
          ) : selectedShapeId === 'shape-hexagon' ? (
            <polygon
              points="29,9 71,9 90,50 71,91 29,91 10,50"
              fill="none"
              stroke="rgba(30, 41, 59, 0.38)"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
          ) : (
            <rect
              x="8"
              y="8"
              width="84"
              height="84"
              rx={selectedShapeId === 'shape-rounded-rect' ? '7' : '2'}
              ry={selectedShapeId === 'shape-rounded-rect' ? '7' : '2'}
              fill="none"
              stroke="rgba(30, 41, 59, 0.38)"
              strokeWidth="1.2"
              strokeDasharray="3.5 2"
            />
          )}
        </svg>
      );
    }

    // 4. Sawtooth Hanger ('sawtooth-hanger'): Top-center brass sawtooth hanger attached inside top boundary
    if (hwId === 'sawtooth-hanger') {
      const topCenterY = selectedShapeId === 'shape-heart' ? 24 : Math.max(8, topPoints[0]?.y || 8);
      return (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: `${topCenterY}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className={`${
              isRoomView ? 'w-8 h-2' : 'w-12 h-3'
            } rounded-xs bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 border border-amber-800 shadow-md flex items-center justify-between px-1`}
          >
            <div className="w-1 h-1 rounded-full bg-amber-900" />
            <div className="w-4 h-[2px] border-b-2 border-dotted border-amber-950" />
            <div className="w-1 h-1 rounded-full bg-amber-900" />
          </div>
        </div>
      );
    }

    // 5. Nail Free Hook ('nail-free-hook'): Damage-free adhesive wall hook pads at shape-aware mounting points
    if (hwId === 'nail-free-hook') {
      const padSizeClass = isRoomView ? 'w-3.5 h-2.5' : 'w-5 h-3.5';
      return (
        <div className="absolute inset-0 pointer-events-none z-30">
          {points.map((pt, idx) => (
            <div
              key={`nail-free-${idx}`}
              style={{
                position: 'absolute',
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`${padSizeClass} rounded-[2px] bg-white/75 border border-slate-400/90 shadow-xs backdrop-blur-[1px] flex items-center justify-center`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500/80" />
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // External protruding hardware elements (Easel Back / Stand tabletop support feet)
  const renderExternalHardwareOverlay = (isRoomView = false) => {
    const hwId = normalizeAcrylicHardwareId(selectedHardwareId);

    if (hwId === 'easel-back') {
      const footWidth = isRoomView ? 'w-5 h-2.5' : 'w-8 h-3.5';
      return (
        <div className="absolute inset-x-0 -bottom-2.5 pointer-events-none z-35 flex items-center justify-between px-[20%]">
          <div
            className={`${footWidth} rounded-b-md bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 border border-slate-600 shadow-lg`}
          />
          <div
            className={`${footWidth} rounded-b-md bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 border border-slate-600 shadow-lg`}
          />
        </div>
      );
    }

    return null;
  };

  // Dynamic frame outer border CSS
  const currentFrameCss = useMemo(() => {
    const frameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    return frameObj?.borderCss || '';
  }, [selectedFrameId]);

  const getAcrylicFilterCss = (filter?: string) => {
    if (filter === 'sepia') return 'sepia(0.85) contrast(1.1) brightness(0.95)';
    if (filter === 'grayscale') return 'grayscale(100%) contrast(1.05)';
    return 'none';
  };

  // ============================================================================
  // RENDER A SINGLE NORMALIZED LAYOUT SLOT (Inside the Outer Product Boundary)
  // ============================================================================
  const renderLayoutSlot = (slot: LayoutSlotDefinition, totalSlots: number, isRoomView = false) => {
    const panelIdx = slot.slotIndex;
    const frame = panelImages[panelIdx] || createDefaultPanelState(null);
    const isActive = !isRoomView && activePanelIndex === panelIdx;
    const isTargetEmpty = !frame.imageUrl;
    const isDragOverThisSlot = !isRoomView && dragOverPanelIndex === panelIdx;

    const filterCss = getAcrylicFilterCss(frame.filter);

    // In Room View, express panX/panY as a locked percentage of the main workspace slot so the crop stays 100% locked
    const mainSlotEl = frameElsRef.current[panelIdx];
    const mainSlotW = mainSlotEl?.clientWidth || 380;
    const mainSlotH = mainSlotEl?.clientHeight || 380;
    const lockedPanXPct = ((frame.panX || 0) / Math.max(1, mainSlotW)) * 100;
    const lockedPanYPct = ((frame.panY || 0) / Math.max(1, mainSlotH)) * 100;

    return (
      <div
        key={slot.id}
        style={{
          position: 'absolute',
          left: `${slot.x * 100}%`,
          top: `${slot.y * 100}%`,
          width: `${slot.width * 100}%`,
          height: `${slot.height * 100}%`,
          boxSizing: 'border-box',
          padding: totalSlots > 1 ? '2.5px' : '0px'
        }}
        className={isRoomView ? 'pointer-events-none select-none' : 'transition-all duration-200'}
      >
        <div
          onClick={
            isRoomView
              ? undefined
              : (e) => {
                  e.stopPropagation();
                  setActivePanelIndex(panelIdx);
                  setSelectedElement({ type: 'image', panelIndex: panelIdx });
                  if (isTargetEmpty) {
                    handleEmptyFrameClick(panelIdx);
                  }
                }
          }
          onDragOver={
            isRoomView
              ? undefined
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.dataTransfer.dropEffect = 'copy';
                  if (dragOverPanelIndex !== panelIdx) {
                    setDragOverPanelIndex(panelIdx);
                  }
                }
          }
          onDragLeave={
            isRoomView
              ? undefined
              : (e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setDragOverPanelIndex((curr) => (curr === panelIdx ? null : curr));
                }
          }
          onDrop={
            isRoomView
              ? undefined
              : (e) => {
                  handlePanelSlotDrop(e, panelIdx);
                }
          }
          className={`acrylic-frame-container relative w-full h-full overflow-hidden select-none transition-all ${
            totalSlots > 1 ? 'rounded-[4px]' : ''
          } ${
            isRoomView
              ? 'pointer-events-none z-10'
              : isDragOverThisSlot
              ? 'ring-2 ring-inset ring-[#0E4A93] bg-blue-50/40 z-30'
              : isActive
              ? 'ring-2 ring-inset ring-[#0E4A93] z-20'
              : totalSlots > 1
              ? 'ring-1 ring-inset ring-stone-200/90 hover:ring-stone-400 z-10'
              : 'z-10'
          } ${isRoomView ? '' : isTargetEmpty ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
        >
          {/* Dynamic Drop Overlay when dragging an image over this slot */}
          {isDragOverThisSlot && (
            <div className="absolute inset-0 bg-[#0E4A93]/20 backdrop-blur-[1px] z-40 flex flex-col items-center justify-center pointer-events-none transition-all animate-in fade-in duration-150">
              <div className="bg-[#0E4A93] text-white px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 border border-white/20">
                <Upload className="w-3.5 h-3.5 animate-bounce" />
                <span className="text-[11px] font-black tracking-wide uppercase">Drop Here</span>
              </div>
            </div>
          )}

          {/* Active Filter Badge (Workspace Only) */}
          {!isRoomView && frame.imageUrl && frame.filter !== 'original' && (
            <div className="absolute bottom-2 right-2 bg-[#0E4A93]/85 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
              {frame.filter}
            </div>
          )}

          {/* Slot Image or Clean Empty Upload Icon */}
          {frame.imageUrl ? (
            <div
              ref={isRoomView ? undefined : registerWheelRef(panelIdx)}
              onPointerDown={isRoomView ? undefined : (e) => handleImagePointerDown(e, panelIdx)}
              onPointerMove={isRoomView ? undefined : handleImagePointerMove}
              onPointerUp={isRoomView ? undefined : handleImagePointerUp}
              onPointerCancel={isRoomView ? undefined : handleImagePointerUp}
              style={{ touchAction: 'none' }}
              className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-white select-none ${
                isRoomView
                  ? 'pointer-events-none'
                  : isDragging && activePanelIndex === panelIdx
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
              }`}
            >
              {(() => {
                const nat = frame.uploadedImage || imageDimsRef.current[panelIdx];
                const natW = nat?.naturalWidth || 1200;
                const natH = nat?.naturalHeight || 800;
                const imgRatio = Math.max(0.05, natW / Math.max(1, natH));
                const slotRatio = Math.max(0.05, (slot.width * mainSlotW) / Math.max(1, slot.height * mainSlotH));
                const isWiderThanSlot = imgRatio >= slotRatio;

                return (
                  <img
                    src={frame.imageUrl}
                    alt={slot.label}
                    draggable={false}
                    onLoad={(ev) => {
                      const imgEl = ev.currentTarget;
                      if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
                        imageDimsRef.current[panelIdx] = {
                          naturalWidth: imgEl.naturalWidth,
                          naturalHeight: imgEl.naturalHeight
                        };
                      }
                    }}
                    style={{
                      width: frame.fitMode === 'cover'
                        ? (isWiderThanSlot ? 'auto' : '100%')
                        : (isWiderThanSlot ? '100%' : 'auto'),
                      height: frame.fitMode === 'cover'
                        ? (isWiderThanSlot ? '100%' : 'auto')
                        : (isWiderThanSlot ? 'auto' : '100%'),
                      minWidth: frame.fitMode === 'cover' ? '100%' : undefined,
                      minHeight: frame.fitMode === 'cover' ? '100%' : undefined,
                      maxWidth: frame.fitMode === 'cover' ? 'none' : '100%',
                      maxHeight: frame.fitMode === 'cover' ? 'none' : '100%',
                      aspectRatio: `${natW} / ${natH}`,
                      objectFit: frame.fitMode === 'cover' ? 'cover' : 'contain',
                      transform: isRoomView
                        ? `translate3d(${lockedPanXPct}%, ${lockedPanYPct}%, 0) scale(${frame.scale || 1}) rotate(${frame.rotation || 0}deg)`
                        : `translate3d(${frame.panX || 0}px, ${frame.panY || 0}px, 0) scale(${frame.scale || 1}) rotate(${frame.rotation || 0}deg)`,
                      transformOrigin: 'center center',
                      filter: filterCss,
                      transition: isRoomView || isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="max-w-none pointer-events-none select-none"
                  />
                );
              })()}
            </div>
          ) : (
            /* CLEAN EMPTY SLOT: Blue upload icon + blue Upload an Image text */
            <div className="w-full h-full flex flex-col items-center justify-center bg-white hover:bg-stone-50/50 transition-colors cursor-pointer group p-3 text-center select-none">
              <div className="flex items-center gap-2 text-[#0E4A93] group-hover:scale-105 transition-transform mb-1">
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M11 14.5V6.85l-2.6 2.6L7 8.05 12 3.05l5 5-1.4 1.4-2.6-2.6v7.65h-2zM4 20q-.825 0-1.412-.587Q2 18.825 2 18v-2q0-.425.288-.712Q2.575 15 3 15t.713.288Q4 15.575 4 16v2h16v-2q0-.425.288-.712Q20.575 15 21 15t.713.288Q22 15.575 22 16v2q0 .825-.587 1.413Q20.825 20 20 20Z"/>
                </svg>
                <span className={`${totalSlots === 1 ? 'text-sm font-semibold' : 'text-xs font-semibold'} tracking-tight`}>
                  {totalSlots === 1 ? 'Upload an Image' : `Upload Slot ${panelIdx + 1}`}
                </span>
              </div>
              {totalSlots === 1 && (
                <span className="text-xs text-stone-500">
                  Maximum upload size: 25MB per file
                </span>
              )}
              {!isRoomView && draggingPhotoIndex !== null && !isDragOverThisSlot && (
                <span className="text-[10px] font-bold text-[#0E4A93] animate-pulse mt-1">
                  Drop photo
                </span>
              )}
            </div>
          )}

          {/* Draggable & Editable Text Elements for this Slot (ONLY render non-empty text) */}
          {frame.textElements?.map((txt) => {
            if (!txt.text || txt.text.trim().length === 0) return null;

            const isTextSelected =
              !isRoomView &&
              selectedElement.type === 'text' &&
              selectedElement.panelIndex === panelIdx &&
              selectedElement.elementId === txt.id;

            return (
              <div
                key={txt.id}
                onPointerDown={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        const frameEl = (e.currentTarget as HTMLElement).closest('.acrylic-frame-container');
                        const rect = frameEl?.getBoundingClientRect() || (e.currentTarget as HTMLElement).getBoundingClientRect();
                        startTextDrag(e, panelIdx, txt.id, rect);
                      }
                }
                onClick={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        setActivePanelIndex(panelIdx);
                        setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: txt.id });
                        setShowTextModal(true);
                      }
                }
                onDoubleClick={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        setActivePanelIndex(panelIdx);
                        setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: txt.id });
                        setShowTextModal(true);
                      }
                }
                style={{
                  position: 'absolute',
                  left: `${50 + txt.x}%`,
                  top: `${50 + txt.y}%`,
                  transform: `translate(-50%, -50%) rotate(${txt.rotation || 0}deg)`,
                  fontFamily: txt.fontFamily,
                  fontSize: isRoomView ? `${Math.max(8, Math.round(txt.fontSize * 0.42))}px` : `${txt.fontSize}px`,
                  fontWeight: txt.fontWeight || 'bold',
                  color: txt.color,
                  textAlign: txt.alignment,
                  lineHeight: txt.lineHeight || 1.2,
                  letterSpacing: `${txt.letterSpacing || 0}px`,
                  whiteSpace: 'pre-line',
                  textShadow:
                    txt.color.toUpperCase() === '#FFFFFF'
                      ? '0 1px 4px rgba(0,0,0,0.45)'
                      : 'none'
                }}
                className={`z-30 px-2.5 py-1 select-none transition-all rounded-lg ${
                  isRoomView
                    ? 'pointer-events-none'
                    : isTextSelected
                    ? 'cursor-move ring-2 ring-[#0E4A93] bg-black/45 backdrop-blur-xs shadow-xl'
                    : 'cursor-move hover:ring-1 hover:ring-white/80'
                }`}
              >
                {txt.text}
              </div>
            );
          })}

          {/* Draggable & Editable Clipart Elements for this Slot */}
          {frame.clipartElements?.map((clip) => {
            const isClipSelected =
              !isRoomView &&
              selectedElement.type === 'clipart' &&
              selectedElement.panelIndex === panelIdx &&
              selectedElement.elementId === clip.id;

            return (
              <div
                key={clip.id}
                onPointerDown={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        const frameEl = (e.currentTarget as HTMLElement).closest('.acrylic-frame-container');
                        const rect = frameEl?.getBoundingClientRect() || (e.currentTarget as HTMLElement).getBoundingClientRect();
                        startClipartDrag(e, panelIdx, clip.id, rect);
                      }
                }
                onClick={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        setActivePanelIndex(panelIdx);
                        setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: clip.id });
                      }
                }
                style={{
                  position: 'absolute',
                  left: `${50 + clip.x}%`,
                  top: `${50 + clip.y}%`,
                  transform: `translate(-50%, -50%) scale(${isRoomView ? clip.scale * 0.45 : clip.scale}) rotate(${clip.rotation}deg)`,
                  color: clip.color || '#D4AF37'
                }}
                className={`z-30 p-1.5 select-none rounded-xl transition-all flex items-center justify-center ${
                  isRoomView
                    ? 'pointer-events-none'
                    : isClipSelected
                    ? 'cursor-move ring-2 ring-[#0E4A93] bg-black/45 backdrop-blur-xs shadow-xl'
                    : 'cursor-move hover:ring-1 hover:ring-white/80'
                }`}
              >
                {clip.svgPath ? (
                  <div
                    className="w-9 h-9 flex items-center justify-center"
                    dangerouslySetInnerHTML={{
                      __html: `<svg viewBox="${clip.viewBox || '0 0 24 24'}" width="34" height="34" fill="currentColor">${clip.svgPath}</svg>`
                    }}
                  />
                ) : (
                  <span className="text-3xl leading-none">⭐</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Lyric & Typography overlay for Acrylic
  const renderLyricOverlay = () => {
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

  // Wall Display (acrylic-wall-art): Multi-panel optical acrylic gallery wall
  const renderWallDisplayCanvas = (isRoomView = false) => {
    const wallPanels = (currentSizeOption as any).panels && (currentSizeOption as any).panels.length > 0
      ? (currentSizeOption as any).panels
      : [
          { id: 'p0', label: 'Left Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
          { id: 'p1', label: 'Center Large', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 },
          { id: 'p2', label: 'Right Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
        ];

    const isTriptych = (currentSizeOption as any).diagramType === 'wall-display-triptych';
    const isThreeSplit = (currentSizeOption as any).arrangement === 'threeSplit' || (currentSizeOption as any).diagramType === 'wall-display-3b';
    const isThreeCollage = (currentSizeOption as any).arrangement === 'threeCollage' || (currentSizeOption as any).diagramType === 'wall-display-3a';
    const isFivePiece = wallPanels.length === 5 || (currentSizeOption as any).diagramType === 'wall-display-5piece';
    const isTiered = (currentSizeOption as any).diagramType === 'wall-display-tiered';

    const renderAcrylicPanelSlot = (idx: number, customAspect?: string, extraClass: string = '') => {
      const pSpec = wallPanels[idx] || { id: `p${idx}`, label: `Panel ${idx + 1}`, dimension: '' };
      const panel = panelImages[idx] || createDefaultPanelState(null);
      const isTarget = !isRoomView && activePanelIndex === idx;

      return (
        <div
          key={pSpec.id || idx}
          onClick={
            isRoomView
              ? undefined
              : (e) => {
                  e.stopPropagation();
                  setActivePanelIndex(idx);
                  setSelectedElement({ type: 'image', panelIndex: idx });
                  if (!panel.imageUrl) {
                    handleEmptyFrameClick(idx);
                  }
                }
          }
          style={{
            boxShadow: isRoomView ? '0 10px 18px rgba(0,0,0,0.25)' : '0 12px 24px -4px rgba(15, 23, 42, 0.22)'
          }}
          className={`relative bg-white rounded-xl overflow-hidden transition-all select-none border border-slate-200/90 ${
            customAspect ? customAspect : ''
          } ${extraClass} ${
            isRoomView
              ? 'pointer-events-none'
              : isTarget
              ? 'ring-2 ring-[#0E4A93] z-20 cursor-pointer'
              : 'hover:border-[#0E4A93]/60 cursor-pointer'
          }`}
        >
          {panel.imageUrl ? (
            <div
              ref={isRoomView ? undefined : registerWheelRef(idx)}
              onPointerDown={isRoomView ? undefined : (e) => handleImagePointerDown(e, idx)}
              onPointerMove={isRoomView ? undefined : handleImagePointerMove}
              onPointerUp={isRoomView ? undefined : handleImagePointerUp}
              onPointerCancel={isRoomView ? undefined : handleImagePointerUp}
              style={{ touchAction: 'none' }}
              className={`w-full h-full relative overflow-hidden flex items-center justify-center bg-white ${
                isRoomView
                  ? 'pointer-events-none'
                  : isDragging && activePanelIndex === idx
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
              }`}
            >
              <img
                src={panel.imageUrl}
                alt={pSpec.label || `Panel ${idx + 1}`}
                draggable={false}
                style={{
                  transform: `translate3d(${panel.panX || 0}px, ${panel.panY || 0}px, 0) scale(${panel.scale || 1}) rotate(${panel.rotation || 0}deg)`,
                  filter: getAcrylicFilterCss(panel.filter),
                  objectFit: panel.fitMode === 'contain' ? 'contain' : 'cover'
                }}
                className="max-w-none w-full h-full pointer-events-none select-none"
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50/90 hover:bg-stone-100 transition-colors p-2 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0E4A93] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
                <UploadCloud className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-stone-700">{pSpec.label || `Panel ${idx + 1}`}</span>
              {pSpec.dimension && <span className="text-[9px] text-stone-400">{pSpec.dimension}</span>}
            </div>
          )}

          {/* Optical Acrylic Gloss */}
          {selectedFinishId === 'high-gloss' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-25" />
          )}

          {/* 4 Corner Standoff Mounts */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((posClass, sIdx) => (
            <div
              key={sIdx}
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-br from-stone-100 to-stone-400 border border-stone-500 shadow-xs pointer-events-none z-30 ${posClass}`}
            >
              <div className="w-1 h-1 rounded-full bg-stone-600 mx-auto mt-0.5" />
            </div>
          ))}

          {/* Dimension badge */}
          {pSpec.dimension && (
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
              {pSpec.dimension}
            </div>
          )}
        </div>
      );
    };

    if (wallPanels.length === 3 && (isThreeSplit || isTriptych)) {
      return (
        <div className={`flex items-center justify-center gap-3 sm:gap-4 w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-2xl my-auto p-4'} select-none`}>
          {isTriptych ? (
            [0, 1, 2].map((idx) => (
              <div key={idx} className="flex-1 max-w-[170px]">
                {renderAcrylicPanelSlot(idx, 'aspect-[12/24]')}
              </div>
            ))
          ) : (
            <>
              <div className="flex-1 max-w-[140px] self-center">
                {renderAcrylicPanelSlot(0, 'aspect-[8/10]')}
              </div>
              <div className="flex-[1.4] max-w-[200px]">
                {renderAcrylicPanelSlot(1, 'aspect-[16/20]')}
              </div>
              <div className="flex-1 max-w-[140px] self-center">
                {renderAcrylicPanelSlot(2, 'aspect-[8/10]')}
              </div>
            </>
          )}
        </div>
      );
    }

    if (wallPanels.length === 3 && isThreeCollage) {
      return (
        <div className={`flex flex-col items-center gap-3 w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-md my-auto p-4'} select-none`}>
          <div className="w-full">
            {renderAcrylicPanelSlot(0, 'aspect-[18/12]')}
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {renderAcrylicPanelSlot(1, 'aspect-[8/10]')}
            {renderAcrylicPanelSlot(2, 'aspect-[8/10]')}
          </div>
        </div>
      );
    }

    if (isFivePiece) {
      return (
        <div className={`flex items-center justify-center gap-2 sm:gap-2.5 w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-3xl my-auto p-3'} select-none`}>
          <div className="flex-1 max-w-[100px] self-center">{renderAcrylicPanelSlot(3, 'aspect-[8/10]')}</div>
          <div className="flex-[1.2] max-w-[125px] self-center">{renderAcrylicPanelSlot(1, 'aspect-[12/18]')}</div>
          <div className="flex-[1.5] max-w-[160px]">{renderAcrylicPanelSlot(0, 'aspect-[18/24]')}</div>
          <div className="flex-[1.2] max-w-[125px] self-center">{renderAcrylicPanelSlot(2, 'aspect-[12/18]')}</div>
          <div className="flex-1 max-w-[100px] self-center">{renderAcrylicPanelSlot(4, 'aspect-[8/10]')}</div>
        </div>
      );
    }

    if (isTiered) {
      return (
        <div className={`grid grid-cols-4 gap-2.5 items-end w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-2xl my-auto p-4'} select-none`}>
          {renderAcrylicPanelSlot(0, 'aspect-[8/10]')}
          {renderAcrylicPanelSlot(1, 'aspect-[11/14]')}
          {renderAcrylicPanelSlot(2, 'aspect-[16/20]')}
          {renderAcrylicPanelSlot(3, 'aspect-[8/10]')}
        </div>
      );
    }

    if (wallPanels.length === 4) {
      return (
        <div className={`grid grid-cols-2 gap-3 w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-md my-auto p-4'} select-none`}>
          {renderAcrylicPanelSlot(0, 'aspect-square')}
          {renderAcrylicPanelSlot(1, 'aspect-square')}
          {renderAcrylicPanelSlot(2, 'aspect-square')}
          {renderAcrylicPanelSlot(3, 'aspect-square')}
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 w-full ${isRoomView ? 'h-full max-w-full' : 'max-w-xl my-auto p-4'} select-none`}>
        {wallPanels.map((_: any, idx: number) => renderAcrylicPanelSlot(idx, 'aspect-square'))}
      </div>
    );
  };

  // Photo Mosaic (acrylic-mosaic): Physical Multi-Tile Optical Acrylic Grid
  const renderMosaicCanvas = (isRoomView = false) => {
    const tilePanels = (currentSizeOption as any).panels && (currentSizeOption as any).panels.length > 0
      ? (currentSizeOption as any).panels
      : Array.from({ length: 4 }, (_, i) => ({ id: `p${i}`, label: `Tile ${i + 1}`, dimension: '5" × 5"', widthRatio: 5, heightRatio: 5 }));
    const count = tilePanels.length;
    const colsClass = count === 4 ? 'grid-cols-2' : count === 6 ? 'grid-cols-3' : count === 9 ? 'grid-cols-3' : count === 16 ? 'grid-cols-4' : 'grid-cols-2';
    const aspectClass = count === 6 ? 'aspect-[18/12]' : 'aspect-square';
    const masterImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || null;

    const totalCols = count === 4 ? 2 : count === 6 ? 3 : count === 9 ? 3 : 4;
    const totalRows = count === 4 ? 2 : count === 6 ? 2 : count === 9 ? 3 : 4;

    return (
      <div className={`w-full max-w-xl mx-auto my-auto ${isRoomView ? 'h-full p-2' : 'p-4'} flex flex-col items-center select-none`}>
        <div
          className={`grid ${colsClass} gap-2 w-full ${aspectClass} p-3 bg-white/70 backdrop-blur-xs rounded-2xl border border-stone-200/90 shadow-xl`}
          style={{
            maxWidth: count === 6 ? '32rem' : '26rem',
            filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))'
          }}
        >
          {tilePanels.map((pSpec: any, i: number) => {
            const panel = panelImages[i];
            const hasIndividualPhoto = Boolean(panel?.imageUrl);
            const displayPhoto = hasIndividualPhoto ? panel?.imageUrl : masterImage;
            const isTarget = !isRoomView && activePanelIndex === i;
            const colIdx = i % totalCols;
            const rowIdx = Math.floor(i / totalCols);

            return (
              <div
                key={pSpec.id || i}
                onClick={
                  isRoomView
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        setActivePanelIndex(i);
                        setSelectedElement({ type: 'image', panelIndex: i });
                        if (!panel?.imageUrl) {
                          handleEmptyFrameClick(i);
                        }
                      }
                }
                className={`relative w-full h-full bg-white rounded-lg overflow-hidden transition-all border ${
                  isRoomView
                    ? 'pointer-events-none'
                    : isTarget
                    ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40 z-20 cursor-pointer shadow-md'
                    : 'border-stone-200 hover:border-stone-400 cursor-pointer shadow-xs'
                }`}
              >
                {displayPhoto ? (
                  <div className="w-full h-full overflow-hidden relative">
                    {hasIndividualPhoto ? (
                      <img
                        src={panel?.imageUrl!}
                        alt={`Tile ${i + 1}`}
                        style={{
                          transform: `translate(${panel?.panX || 0}px, ${panel?.panY || 0}px) scale(${panel?.scale || 1}) rotate(${panel?.rotation || 0}deg)`,
                          filter: getAcrylicFilterCss(panel?.filter),
                          objectFit: panel?.fitMode === 'contain' ? 'contain' : 'cover'
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
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-[#0E4A93] flex items-center justify-center mb-0.5 shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <span className="text-[9px] font-bold text-stone-700">Tile {i + 1}</span>
                    <span className="text-[8px] text-stone-400">{pSpec.dimension || '5"×5"'}</span>
                  </div>
                )}

                {/* Optical gloss */}
                {selectedFinishId === 'high-gloss' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-25" />
                )}

                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1 py-0.5 rounded z-20 pointer-events-none">
                  {pSpec.dimension || `Tile ${i + 1}`}
                </div>
              </div>
            );
          })}
        </div>
        {!isRoomView && (
          <p className="text-[11px] font-semibold text-stone-500 mt-2.5 text-center">
            Photo Mosaic • {count} Acrylic Tiles Grid • Upload 1 photo to tile across seams, or click individual tiles to customize
          </p>
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER OUTER ACRYLIC PRODUCT CANVAS (Respects Shape, Aspect Ratio, Layout & Hardware)
  // ============================================================================
  const renderProductCanvas = (isRoomView = false) => {
    const shapeClip = currentShape?.clipPathStyle;
    const shapeRadius = currentShape?.borderRadiusClass || 'rounded-sm';
    const isPhotoBlock = selectedProductTypeId === 'acrylic-photo-block';
    const isFloatingMount = normalizeAcrylicHardwareId(selectedHardwareId) === 'ready-to-hang';

    // In Room View, the parent AcrylicRoomViewModal controls exact locked pixel width & height
    const maxDim = isPhotoBlock ? 360 : 450;
    const boxWidthPx =
      productAspectRatio >= 1
        ? maxDim
        : Math.max(180, Math.round(maxDim * productAspectRatio));

    const outerFilter = isPhotoBlock
      ? 'drop-shadow(6px 7px 0px rgba(203, 213, 225, 0.95)) drop-shadow(10px 12px 0px rgba(148, 163, 184, 0.75)) drop-shadow(0 22px 28px rgba(0, 0, 0, 0.28))'
      : isFloatingMount
      ? 'drop-shadow(0 28px 34px rgba(15, 23, 42, 0.36)) drop-shadow(0 12px 16px rgba(15, 23, 42, 0.22))'
      : 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.1))';

    // WALL DISPLAY (Physical Multi-Panel Gallery Wall Layout)
    if (selectedProductTypeId === 'acrylic-wall-art') {
      return renderWallDisplayCanvas(isRoomView);
    }

    // PHOTO MOSAIC (Multi-Tile Mosaic Acrylic Grid)
    if (selectedProductTypeId === 'acrylic-mosaic') {
      return renderMosaicCanvas(isRoomView);
    }

    // SPLIT PRODUCT: 1 photo continuous split across physical optical acrylic panels
    if (selectedProductTypeId === 'acrylic-split') {
      const panelCount = (currentSizeOption as any).panelsCount || ((currentSizeOption as any).arrangement === 'twoSplit' ? 2 : (currentSizeOption as any).arrangement === 'fourGrid' ? 4 : 3);
      const N = panelCount;
      const masterImage = panelImages[0]?.imageUrl || Object.values(panelImages).find((p) => Boolean(p?.imageUrl))?.imageUrl || null;
      const master = panelImages[0] || createDefaultPanelState(null);
      const gapPx = isRoomView ? 8 : 14;

      return (
        <div
          className={`relative w-full ${isRoomView ? 'h-full pointer-events-none select-none' : ''} flex items-center justify-center transition-all duration-300`}
          style={
            isRoomView
              ? {
                  width: '100%',
                  height: '100%',
                  gap: `${gapPx}px`
                }
              : {
                  maxWidth: `${boxWidthPx}px`,
                  aspectRatio: `${effectiveWidthInches} / ${effectiveHeightInches}`,
                  gap: `${gapPx}px`,
                  filter: outerFilter
                }
          }
        >
          {Array.from({ length: N }).map((_, i) => (
            <div
              key={i}
              className={`relative h-full rounded-xl bg-white overflow-hidden select-none transition-all ${
                !isRoomView && !masterImage ? 'cursor-pointer hover:border-[#0E4A93]' : ''
              }`}
              style={{
                flex: 1,
                border: '1.5px solid rgba(226, 232, 240, 0.9)',
                boxShadow: isRoomView ? '0 12px 18px rgba(0,0,0,0.22)' : '0 8px 16px rgba(15, 23, 42, 0.15)'
              }}
              onClick={() => {
                if (!isRoomView && !masterImage) singleFileInputRef.current?.click();
              }}
            >
              {/* Continuous Sliced Photo */}
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
                    alt={`Split Acrylic Panel ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: master.fitMode === 'contain' ? 'contain' : 'cover',
                      transform: isRoomView
                        ? `scale(${master.scale}) rotate(${master.rotation}deg)`
                        : `translate(${master.panX}px, ${master.panY}px) scale(${master.scale}) rotate(${master.rotation}deg)`,
                      filter: getAcrylicFilterCss(master.filter)
                    }}
                    className="pointer-events-none"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-50 group-hover:bg-blue-50/40">
                  <UploadCloud className="w-5 h-5 text-stone-400 mb-1" />
                  <span className="text-[10px] font-bold text-stone-600">Panel {i + 1}</span>
                </div>
              )}

              {/* Optical Acrylic Gloss Overlay */}
              {selectedFinishId === 'high-gloss' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-25" />
              )}

              {/* 4 Corner Standoff Mounts on Each Panel */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                <div
                  key={pos}
                  className={`absolute w-3.5 h-3.5 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 border border-stone-500 shadow-sm pointer-events-none z-30 ${
                    pos === 'top-left'
                      ? 'top-2 left-2'
                      : pos === 'top-right'
                      ? 'top-2 right-2'
                      : pos === 'bottom-left'
                      ? 'bottom-2 left-2'
                      : 'bottom-2 right-2'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-600 mx-auto mt-0.5" />
                </div>
              ))}

              {/* Panel label tag */}
              <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-20 pointer-events-none">
                Panel {i + 1} of {N}
              </div>
            </div>
          ))}
        </div>
      );
    }

    const isRectangularShape = ['shape-square', 'shape-rectangle', 'shape-landscape', 'shape-portrait'].includes(currentShape.id);

    return (
      <div
        className={`relative w-full ${isRoomView ? 'h-full pointer-events-none select-none' : ''} flex items-center justify-center transition-all duration-300`}
        style={
          isRoomView
            ? {
                width: '100%',
                height: '100%',
                filter: isPhotoBlock
                  ? 'drop-shadow(5px 6px 0px rgba(148, 163, 184, 0.5))'
                  : undefined
              }
            : {
                maxWidth: `${boxWidthPx}px`,
                aspectRatio: `${effectiveWidthInches} / ${effectiveHeightInches}`,
                filter: outerFilter
              }
        }
      >
        {/* External Hardware (Tabletop Stand Feet or Top Hanging Wires) */}
        {renderExternalHardwareOverlay(isRoomView)}

        <div
          className={`relative w-full h-full ${shapeRadius} bg-white overflow-hidden transition-all select-none ${currentFrameCss}`}
          style={{
            clipPath: shapeClip,
            WebkitClipPath: shapeClip
          }}
        >
          {/* Normalized Layout Slots Inside the Outer Acrylic Shape */}
          <div className="absolute inset-0 w-full h-full bg-stone-200/70">
            {layoutSlots.map((slot) => renderLayoutSlot(slot, layoutSlots.length, isRoomView))}
          </div>


          {/* Lyric Typography Overlay */}
          {selectedProductTypeId === 'acrylic-lyric' && renderLyricOverlay()}

          {/* Design Overlay Layer */}
          {activeDesignOverlay && (
            <div
              className="absolute inset-0 pointer-events-none z-22 w-full h-full flex items-center justify-center select-none"
              dangerouslySetInnerHTML={{ __html: activeDesignOverlay.renderOverlaySvg }}
            />
          )}

          {/* Optical Acrylic Gloss / Finish Overlays */}
          {selectedFinishId === 'high-gloss' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-25" />
          )}
          {selectedFinishId === 'anti-glare' && (
            <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[0.5px] pointer-events-none z-25" />
          )}
          {selectedFinishId === 'diamond-bevel' && (
            <div className="absolute inset-0 border-4 border-white/60 pointer-events-none z-25 shadow-inner" />
          )}

          {/* Shape-Following Exact Wrap & Border Overlay */}
          {renderShapeBorder()}

          {/* Shape-Aware Hardware Visuals (Standoff, Wall Mount, Floating Mount, Adhesive, Hanging) */}
          {renderInternalHardwareOverlay(isRoomView)}
        </div>
      </div>
    );
  };

  // Dynamic Product Capabilities for the active Acrylic product
  const productCapabilities = selectedProductType?.capabilities || {
    products: true,
    upload: true,
    sizes: true,
    shapes: true,
    layouts: false,
    wrap: true,
    hardware: true,
    options: true
  };

  // Primary Toolbar items: dynamically filtered by selected product capabilities
  const toolbarItems = useMemo<{ id: ToolbarTab; label: string; icon: React.ElementType }[]>(() => {
    const items: { id: ToolbarTab; label: string; icon: React.ElementType; enabled: boolean }[] = [
      { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid, enabled: productCapabilities.products !== false },
      { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud, enabled: productCapabilities.upload !== false },
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
    const isCurrentTabSupported = toolbarItems.some((item) => item.id === activeTab);
    if (!isCurrentTabSupported) {
      setActiveTab('PRODUCTS');
    }
  }, [toolbarItems, activeTab]);

  const activeTabIndex = useMemo(() => {
    return toolbarItems.findIndex((item) => item.id === activeTab);
  }, [toolbarItems, activeTab]);

  const prevTab = useMemo(() => {
    if (activeTabIndex <= 0) return { id: toolbarItems[0]?.id || 'PRODUCTS', label: 'Previous' };
    return { id: toolbarItems[activeTabIndex - 1].id, label: toolbarItems[activeTabIndex - 1].label };
  }, [toolbarItems, activeTabIndex]);

  const nextTab = useMemo(() => {
    if (activeTabIndex < 0 || activeTabIndex >= toolbarItems.length - 1) return { id: toolbarItems[toolbarItems.length - 1]?.id || 'OPTIONS', label: 'Next' };
    return { id: toolbarItems[activeTabIndex + 1].id, label: toolbarItems[activeTabIndex + 1].label };
  }, [toolbarItems, activeTabIndex]);

  return (
    <div className="w-full h-screen flex flex-col bg-[#F1F5F9] font-sans antialiased overflow-hidden select-none">
      <CustomizerPreloader active={preloaderActive} />

      {/* Hidden File Pickers */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp"
        className="hidden"
        onChange={(e) => handleGalleryUpload(e.target.files)}
      />
      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleSingleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* 1. SHARED CUSTOMIZER BLUE HEADER (No product name in header) */}
      <CustomizerHeader
        backLink="/acrylic"
        backLabel="Back to Acrylic"
        totalPrice={finalPrice}
        onAddToCart={handleAddToCart}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex z-50 animate-in fade-in">
          <div className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200 text-stone-800">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <img src="/canvas-india-official-logo.png" alt="Canvas India" className="h-8 w-auto object-contain" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                <Link 
                  to={`/products/${catalogProduct?.slug || catalogProduct?.id || productId || 'acrylic-rectangle-print'}`} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  Return to Product Page
                </Link>
                <Link 
                  to="/acrylic" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  View All Acrylic Products
                </Link>
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  Homepage
                </Link>
              </div>
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="font-bold text-stone-900">Official Company Details</div>
                <div>H NO 4-9-197/8184, HMT Nagar Main Road, Nacharam, Hyderabad, Telangana - 500076</div>
                <div>Email: info@canvasindia.com | Phone: +91 99999 99999</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Global ClipPath Mask Definitions for Shapes */}
      <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <clipPath id="acrylic-clip-shape-heart" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0.85 C 0.12,0.58 0.02,0.38 0.02,0.24 C 0.02,0.08 0.14,0.02 0.28,0.02 C 0.38,0.02 0.46,0.08 0.5,0.18 C 0.54,0.08 0.62,0.02 0.72,0.02 C 0.86,0.02 0.98,0.08 0.98,0.24 C 0.98,0.38 0.88,0.58 0.5,0.85 Z" />
          </clipPath>
          <clipPath id="acrylic-clip-shape-arch" clipPathUnits="objectBoundingBox">
            <path d="M 0,1 L 0,0.4 C 0,0.15 0.22,0 0.5,0 C 0.78,0 1,0.15 1,0.4 L 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Validation Warning Banner */}
      {validationWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* MAIN CUSTOMIZER BODY */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
        
        {/* COLUMN 1: LEFT VERTICAL SIDEBAR */}
        <CustomizerSidebar
          items={toolbarItems}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* COLUMN 2: CONFIGURATION PANEL */}
        <CustomizerPanel
          title={activeTab}
          metaText={
            activeTab === 'PRODUCTS'
              ? `${ACRYLIC_PRODUCT_TYPES.length} Styles`
              : activeTab === 'UPLOAD'
              ? `${uploadedPhotos.length} Photos`
              : activeTab === 'SELECT SIZE'
              ? `${shapeSizes.length + 1} Options`
              : activeTab === 'LAYOUTS & DESIGNS'
              ? selectedProductTypeId === 'acrylic-lyric'
                ? 'Lyrics & Typography'
                : layoutSubTab === 'LAYOUTS'
                ? '7 Layouts'
                : '11 Categories'
              : activeTab === 'WRAP & BORDER'
              ? '5 Options'
              : activeTab === 'HARDWARE & FINISH'
              ? `${compatibleHardware.length} Hardware`
              : 'Specifications'
          }
        >

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'PRODUCTS' && (
            <CustomizerProductSelector
              activeMaterial="acrylic"
              products={ACRYLIC_PRODUCT_TYPES}
              selectedProductId={selectedProductTypeId}
              onSelectProduct={handleSelectProductType}
              onSwitchMaterial={() => navigate('/customize/canvas/canvas-classic')}
            />
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                  Upload Photos
                </h3>
                <p className="text-[11px] text-stone-500">
                  Add high-resolution photos from your PC or laptop or scan the QR code to upload directly from your mobile phone.
                </p>
              </div>

              {/* Segmented Control: Computer vs Mobile QR */}
              <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100">
                <button
                  type="button"
                  onClick={() => setUploadMode('computer')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    uploadMode === 'computer'
                      ? 'bg-white text-[#0E4A93] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Upload from PC or Laptop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('mobile')}
                  className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    uploadMode === 'mobile'
                      ? 'bg-white text-[#0E4A93] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Upload from Mobile</span>
                </button>
              </div>

              {/* Split Acrylic notice */}
              {selectedProductTypeId === 'acrylic-split' && (
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs font-semibold text-[#0E4A93]">
                  Upload 1 photo — it is divided seamlessly across the physical acrylic panels.
                </div>
              )}

              {/* Multi-slot assignment selector */}
              {layoutSlots.length > 1 && selectedProductTypeId !== 'acrylic-split' && (
                <div className="p-2.5 bg-stone-100 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-700">Assign to Slot:</div>
                  <div className="flex gap-1.5">
                    {layoutSlots.map((slot, fIdx) => {
                      const isTarget = activePanelIndex === fIdx;
                      const hasPhoto = !!panelImages[fIdx]?.imageUrl;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setActivePanelIndex(fIdx)}
                          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isTarget
                              ? 'bg-white border-[#0E4A93] text-[#0E4A93] shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          <span>Slot {fIdx + 1}</span>
                          {hasPhoto && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {uploadMode === 'computer' ? (
                /* COMPUTER UPLOAD ZONE */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleGalleryUpload(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-[#0E4A93]/40 hover:border-[#0E4A93] bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-white text-[#0E4A93] shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="text-xs font-bold text-stone-900">
                    Click to Browse or Drag Photos
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Supports JPG, PNG, WEBP up to 25MB
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
                      Point your smartphone camera at this QR code to upload photos directly from your phone into your Acrylic print.
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
                            setDragOverPanelIndex(null);
                            setIsDragOverCanvas(false);
                          }}
                          onClick={() => handleAssignPhotoToPanel(photo, activePanelIndex)}
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
            </div>
          )}

          {/* SELECT SIZE */}
          {activeTab === 'SELECT SIZE' && (
            <div className="flex-1 min-h-0 p-3.5 space-y-3.5 overflow-y-auto">
              {/* Quick Trigger for the Select Size Modal */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
                <div className="text-xs">
                  <span className="font-black text-[#0E4A93] uppercase tracking-wide">Select Size</span>
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

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {currentShape.name} Sizes
                </span>
                <span className="text-[11px] font-bold text-[#0E4A93]">
                  {shapeSizes.length} Presets + Custom
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {shapeSizes.map((size) => {
                  const isSelected = !isCustomSize && selectedSizeId === size.id;
                  return (
                    <div
                      key={size.id}
                      onClick={() => {
                        setIsCustomSize(false);
                        setCustomSizeError(null);
                        setSelectedSizeId(size.id);
                      }}
                      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                      <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                        <img 
                          src={size.image} 
                          alt={size.label} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      </div>

                      <div className="p-2 bg-white border-t border-stone-100 text-center">
                        <div className="text-xs font-bold text-stone-900 leading-tight">
                          {size.label}
                        </div>
                        <div className="text-[11px] font-bold text-[#0E4A93] mt-0.5">
                          ₹{getProductSizePrice(size.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* LAST OPTION: CUSTOM SIZE CARD */}
                <div
                  onClick={() => {
                    validateAndApplyCustomDimensions(customWidthInput, customHeightInput);
                  }}
                  className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isCustomSize
                      ? 'border-[#0E4A93] bg-blue-50/25 shadow-sm ring-1 ring-[#0E4A93]/20'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  {isCustomSize && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                    <div className="w-9 h-9 rounded-lg border-2 border-dashed border-[#0E4A93]/70 bg-blue-50/50 flex items-center justify-center text-[#0E4A93] font-black text-[10px]">
                      W×H
                    </div>
                  </div>

                  <div className="p-2 bg-white border-t border-stone-100 text-center">
                    <div className="text-xs font-bold text-stone-900 leading-tight">
                      Custom Size
                    </div>
                    <div className="text-[11px] font-bold text-[#0E4A93] mt-0.5">
                      {isCustomSize ? `${customWidth}" × ${customHeight}"` : '1" × 1" to 44" × 44"'}
                    </div>
                  </div>
                </div>
              </div>

              {/* CUSTOM SIZE CONFIGURATION PANEL (LAST IN SELECT SIZE) */}
              <div
                className={`p-3.5 rounded-xl border-2 transition-all space-y-3 ${
                  isCustomSize
                    ? 'border-[#0E4A93] bg-blue-50/25 shadow-xs'
                    : 'border-stone-200 bg-stone-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-stone-900 uppercase tracking-wide">
                      Custom Size (Inches)
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium">
                      Allowed range: 1&quot; × 1&quot; up to 44&quot; × 44&quot;
                    </div>
                  </div>
                  {isCustomSize && (
                    <span className="text-[11px] font-extrabold text-[#0E4A93] bg-white px-2 py-0.5 rounded-md border border-[#0E4A93]/20">
                      {customWidth}&quot; × {customHeight}&quot;
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Width (1&quot; – 44&quot;)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={44}
                        step={1}
                        value={customWidthInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomWidthInput(val);
                          validateAndApplyCustomDimensions(val, customHeightInput);
                        }}
                        className="w-full px-2.5 py-1.5 pr-7 text-xs font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] focus:ring-1 focus:ring-[#0E4A93]"
                        placeholder="12"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">
                        &quot;
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">
                      Height (1&quot; – 44&quot;)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={44}
                        step={1}
                        value={customHeightInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomHeightInput(val);
                          validateAndApplyCustomDimensions(customWidthInput, val);
                        }}
                        className="w-full px-2.5 py-1.5 pr-7 text-xs font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#0E4A93] focus:ring-1 focus:ring-[#0E4A93]"
                        placeholder="12"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">
                        &quot;
                      </span>
                    </div>
                  </div>
                </div>

                {customSizeError && (
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-[11px] font-bold text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{customSizeError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    validateAndApplyCustomDimensions(customWidthInput, customHeightInput);
                  }}
                  className="w-full py-2 px-3 bg-[#0E4A93] hover:bg-[#0b3b75] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Apply Custom Size ({customWidth}&quot; × {customHeight}&quot;)
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LAYOUTS & DESIGNS */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="flex-1 min-h-0 p-3.5 space-y-3 overflow-y-auto">
              {selectedProductTypeId === 'acrylic-lyric' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-[#0E4A93]">
                    <div className="font-extrabold uppercase tracking-wide">Lyric & Typography Acrylic Panel</div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Customize your song title, artist, and lyrics below. Live preview updates on the acrylic panel.</p>
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
                  <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100">
                    <button
                      type="button"
                      onClick={() => setLayoutSubTab('LAYOUTS')}
                      className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        layoutSubTab === 'LAYOUTS'
                          ? 'bg-white text-[#0E4A93] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      LAYOUTS
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutSubTab('DESIGNS')}
                      className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        layoutSubTab === 'DESIGNS'
                          ? 'bg-white text-[#0E4A93] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      DESIGNS
                    </button>
                  </div>

              {/* SUBTAB 1: LAYOUTS (7 Options) */}
              {layoutSubTab === 'LAYOUTS' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {(selectedProductType?.supportedLayoutIds && selectedProductType.supportedLayoutIds.length > 0
                      ? LAYOUT_PRESETS.filter((l) => selectedProductType.supportedLayoutIds!.includes(l.id))
                      : LAYOUT_PRESETS.slice(0, 7)
                    ).map((layout) => {
                      const isSelected = selectedLayoutId === layout.id;
                      const previewSlots = getLayoutSlots(layout.layoutType, productAspectRatio);
                      const clampedRatio = Math.max(0.78, Math.min(1.35, productAspectRatio));
                      const previewHeight = 46;
                      const previewWidth = Math.round(previewHeight * clampedRatio);

                      return (
                        <div
                          key={layout.id}
                          onClick={() => handleSelectLayout(layout)}
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

                          <div className="w-full h-16 bg-stone-50 border-b border-stone-100 p-2 flex items-center justify-center">
                            <div
                              style={{
                                width: `${previewWidth}px`,
                                height: `${previewHeight}px`
                              }}
                              className="relative group-hover:scale-105 transition-transform"
                            >
                              {previewSlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  style={{
                                    position: 'absolute',
                                    left: `${slot.x * 100}%`,
                                    top: `${slot.y * 100}%`,
                                    width: `${slot.width * 100}%`,
                                    height: `${slot.height * 100}%`,
                                    boxSizing: 'border-box',
                                    padding: '1.5px'
                                  }}
                                >
                                  <div
                                    className={`w-full h-full rounded-[2px] border-[1.5px] transition-colors ${
                                      isSelected
                                        ? 'border-[#0E4A93] bg-[#0E4A93]/20'
                                        : 'border-[#0E4A93]/75 bg-[#0E4A93]/12 group-hover:border-[#0E4A93]'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-1.5 bg-white text-center">
                            <div className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                              {layout.name}
                            </div>
                            <div className="text-[10px] font-medium text-stone-500">
                              {layout.photoCount} {layout.photoCount === 1 ? 'Photo' : 'Photos'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: DESIGNS (11 Categories with Overlays) */}
              {layoutSubTab === 'DESIGNS' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                      Categories
                    </span>
                    {selectedDesignId && (
                      <button
                        type="button"
                        onClick={() => setSelectedDesignId(null)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        [ Remove Design ]
                      </button>
                    )}
                  </div>

                  {/* 11 Category Chips */}
                  <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {DESIGN_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedDesignCategory(cat)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                          selectedDesignCategory === cat
                            ? 'bg-[#0E4A93] text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Design Cards for Selected Category */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* None Card */}
                    <div
                      onClick={() => setSelectedDesignId(null)}
                      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                        selectedDesignId === null
                          ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="w-full h-18 bg-stone-50 flex items-center justify-center p-2 text-stone-400 font-bold text-xs">
                        No Design
                      </div>
                      <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                        <div className="text-xs font-bold text-stone-800">Original Only</div>
                      </div>
                    </div>

                    {ACRYLIC_DESIGN_OVERLAYS.filter((d) => d.category === selectedDesignCategory).map((overlay) => {
                      const isSelected = selectedDesignId === overlay.id;

                      return (
                        <div
                          key={overlay.id}
                          onClick={() => setSelectedDesignId(overlay.id)}
                          className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                          <div className="w-full h-18 bg-stone-900 flex items-center justify-center p-1 overflow-hidden relative">
                            <img 
                              src={overlay.image} 
                              alt={overlay.name} 
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                            />
                          </div>

                          <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                            <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                              {overlay.name}
                            </div>
                            <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                              {overlay.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          )}

          {/* TAB 6: WRAP & BORDER (5 Edge Options with Shape-Following Borders) */}
          {activeTab === 'WRAP & BORDER' && (
            <div className="flex-1 min-h-0 p-3.5 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Wrap & Edge Finish
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ACRYLIC_WRAP_OPTIONS.map((wrap) => {
                    const isSelected = selectedEdgeWrapId === wrap.id;
                    return (
                      <div
                        key={wrap.id}
                        onClick={() => setSelectedEdgeWrapId(wrap.id)}
                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                        <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                          <img 
                            src={wrap.image} 
                            alt={wrap.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {wrap.name}
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500 mt-0.5 truncate">
                            {wrap.price === 0 ? 'Included' : `+₹${wrap.price}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Inner Border Width
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ACRYLIC_BORDER_WIDTHS.map((border) => {
                    const isSelected = selectedBorderWidthId === border.id;
                    return (
                      <div
                        key={border.id}
                        onClick={() => setSelectedBorderWidthId(border.id)}
                        className={`p-2 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 ring-1 ring-[#0E4A93]/20 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="text-xs font-bold text-stone-900">{border.label}</div>
                        <div className="text-[10px] text-stone-500">{border.widthPx === 0 ? 'No Border' : `${border.widthPx}px`}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedBorderWidthId !== 'none' && (
                <div>
                  <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                    Border Color
                  </div>
                  <div className="flex gap-2">
                    {ACRYLIC_BORDER_COLORS.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedBorderColor(col.hex)}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          selectedBorderColor === col.hex ? 'border-[#0E4A93] scale-110 shadow-sm' : 'border-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: HARDWARE & FINISH */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="flex-1 min-h-0 p-3.5 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Hardware & Hanging
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HARDWARE_OPTIONS.map((hw) => {
                    const isSelected = selectedHardwareId === hw.id;
                    return (
                      <div
                        key={hw.id}
                        onClick={() => setSelectedHardwareId(hw.id)}
                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                        <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                          <img 
                            src={hw.image} 
                            alt={hw.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {hw.name}
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500 mt-0.5 truncate">
                            {hw.price === 0 ? 'Included' : `+₹${hw.price}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Surface Finish
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FINISH_OPTIONS.map((fin) => {
                    const isSelected = selectedFinishId === fin.id;
                    return (
                      <div
                        key={fin.id}
                        onClick={() => setSelectedFinishId(fin.id)}
                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                        <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                          <img 
                            src={fin.image} 
                            alt={fin.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {fin.name}
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500 mt-0.5 truncate">
                            {fin.price === 0 ? 'Included' : `+₹${fin.price}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Acrylic Thickness
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THICKNESS_OPTIONS.map((thick) => {
                    const isSelected = selectedThicknessId === thick.id;
                    return (
                      <div
                        key={thick.id}
                        onClick={() => setSelectedThicknessId(thick.id)}
                        className={`p-2 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="text-xs font-bold text-stone-900">{thick.label}</div>
                        <div className="text-[10px] font-semibold text-stone-500">
                          {thick.price === 0 ? 'Included' : `+₹${thick.price}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: OPTIONS */}
          {activeTab === 'OPTIONS' && (
            <div className="flex-1 min-h-0 p-3.5 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Frame Moulding
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FRAME_OPTIONS.map((frm) => {
                    const isSelected = selectedFrameId === frm.id;
                    return (
                      <div
                        key={frm.id}
                        onClick={() => setSelectedFrameId(frm.id)}
                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
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

                        <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                          <img 
                            src={frm.image} 
                            alt={frm.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {frm.name}
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500 mt-0.5 truncate">
                            {frm.price === 0 ? 'Included' : `+₹${frm.price}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Color Finishing
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_FINISH_OPTIONS.map((cfo) => {
                    const isSelected = activeFrameState.filter === cfo.id;
                    const previewImg = activeFrameState.imageUrl;
                    return (
                      <div
                        key={cfo.id}
                        onClick={() => handleApplyFilter(cfo.id)}
                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm ring-1 ring-[#0E4A93]/20'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        <div className="w-full h-14 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
                          {previewImg ? (
                            <img
                              src={previewImg}
                              alt={cfo.label}
                              style={{ filter: cfo.cssFilter }}
                              className="max-h-full max-w-full object-cover rounded"
                            />
                          ) : (
                            <div
                              style={{ filter: cfo.cssFilter }}
                              className="w-full h-full rounded bg-gradient-to-br from-sky-400 via-amber-300 to-rose-400"
                            />
                          )}
                        </div>

                        <div className="p-1.5 bg-white border-t border-stone-100 text-center">
                          <div className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                            {cfo.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </CustomizerPanel>

        {/* CENTER / MAIN WORKSPACE (Shared Customizer Workspace Shell) */}
        <main className="flex-1 flex flex-col bg-[#E2E8F0]/60 relative overflow-hidden">
          
          {/* SHARED TOP WORKSPACE TOOLBAR: [SAVE, ADD TEXT, ADD CLIPART, ROOM VIEW] */}
          <CustomizerTopToolbar
            onSave={handleSaveDesign}
            isTextActive={showTextModal}
            onToggleText={handleAddNewText}
            isClipartActive={showClipartModal}
            onToggleClipart={() => setShowClipartModal(!showClipartModal)}
            isRoomViewActive={showRoomView}
            isRoomViewDisabled={!hasUploadedImage}
            onOpenRoomView={() => {
              if (!hasUploadedImage) return;
              setShowRoomView(true);
            }}
            canDeleteSelectedItem={selectedElement.type !== 'image'}
            onDeleteSelectedItem={handleDeleteSelectedElement}
          />

          {/* LIVE REAL-TIME TEXT EDITOR COMPONENT */}
          {showTextModal && activeTextElement && (
            <AcrylicLiveTextEditor
              activeText={activeTextElement}
              onUpdateText={handleUpdateActiveText}
              onDuplicateText={handleDuplicateActiveText}
              onDeleteText={handleDeleteActiveText}
              onClose={handleCloseTextModal}
            />
          )}

          {/* VISUAL CLIPART PICKER MODAL */}
          <AcrylicClipartModal
            isOpen={showClipartModal}
            onClose={() => setShowClipartModal(false)}
            onAddClipart={handleSelectClipart}
            activeClipart={activeClipartElement}
            onUpdateClipart={handleUpdateActiveClipart}
            onDuplicateClipart={handleDuplicateActiveClipart}
            onDeleteClipart={handleDeleteActiveClipart}
          />

          {/* SHARED INTERACTIVE WORKSPACE PREVIEW AREA + DYNAMIC SIZE PILL + [ − ] [ + ] [ ↶ ] [ ↷ ] */}
          <CustomizerPreviewArea
            sizeLabel={currentDimensionLabel}
            onZoomOut={handleZoomOut}
            onZoomIn={handleZoomIn}
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onClick={() => {
              pruneEmptyTextElements();
              setShowTextModal(false);
              setSelectedElement({ type: 'image', panelIndex: activePanelIndex });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              if (!isDragOverCanvas) setIsDragOverCanvas(true);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setIsDragOverCanvas(false);
            }}
            onDrop={(e) => {
              handlePanelSlotDrop(e, activePanelIndex);
            }}
            extraControls={
              activeFrameState.imageUrl ? (
                <>
                  {layoutSlots.length > 1 && selectedProductTypeId !== 'acrylic-split' && (
                    <div className="text-[11px] font-bold text-stone-700 pr-1.5 border-r border-stone-200">
                      Slot {activePanelIndex + 1}
                    </div>
                  )}

                  {/* Containment / Fill Controls: [ Fill ] [ Fix ] */}
                  <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFill(activePanelIndex);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        activeFrameState.fitMode === 'cover'
                          ? 'bg-[#0E4A93] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#0E4A93] hover:bg-stone-200'
                      }`}
                      title="Fill: make image completely cover the frame area (visual crop)"
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
                        activeFrameState.fitMode === 'contain'
                          ? 'bg-[#0E4A93] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#0E4A93] hover:bg-stone-200'
                      }`}
                      title="Fix (Fit): fit full uncropped original image inside the product frame"
                    >
                      Fix
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetImage();
                    }}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-amber-700 border border-stone-200 transition-colors cursor-pointer"
                    title="Reset position, zoom & rotation"
                    aria-label="Reset Image"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              ) : undefined
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
            bottomSlot={
              <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold text-stone-600 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-stone-200/80">
                <span>
                  Material:{' '}
                  <strong className="text-stone-900">
                    {ACRYLIC_MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Optical Crystal Acrylic'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Thickness:{' '}
                  <strong className="text-stone-900">
                    {THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || '3mm Acrylic'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Finish:{' '}
                  <strong className="text-stone-900">
                    {FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name || 'High Gloss'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Hardware:{' '}
                  <strong className="text-stone-900">
                    {compatibleHardware.find((h) => h.id === selectedHardwareId)?.name || 'No Hardware'}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(true)}
                  className="ml-1 px-2.5 py-0.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-[10px] font-extrabold rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Change Material
                </button>
                {layoutSlots.length > 1 && selectedProductTypeId !== 'acrylic-split' && (
                  <>
                    <span>•</span>
                    <span className="text-[#0E4A93] font-extrabold">Slot {activePanelIndex + 1}</span>
                  </>
                )}
                {activeFrameState.imageUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSlotPhoto(activePanelIndex);
                    }}
                    className="px-2.5 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-extrabold rounded-full transition-colors cursor-pointer inline-flex items-center gap-1 uppercase tracking-wider"
                    title="Remove photo from active slot"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            }
          >
            {/* Top Adjustment Banner */}
            <div className="w-full max-w-xl mx-auto mb-2 bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs select-none">
              <Move className="w-3.5 h-3.5 text-[#A16207]" />
              <span>Click and drag within the print lines to Adjust your Photo.</span>
            </div>

            {/* Acrylic Product Frame Wrapper with Dimension Rulers */}
            <div className="relative flex flex-col items-center select-none w-full max-w-2xl my-auto">
              {/* Ruler Top */}
              <div className="w-full flex items-center justify-center py-1 mb-1 max-w-[27rem] relative">
                <div className="absolute inset-x-0 h-px border-b border-dashed border-stone-300" />
                <div className="relative bg-white px-2 py-0.5 rounded-full border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs z-10">
                  {effectiveWidthInches} inch
                </div>
              </div>

              <div className="relative flex items-center justify-center w-full">
                {/* Ruler Left */}
                <div className="absolute -left-10 inset-y-0 flex flex-col items-center justify-center">
                  <div className="absolute inset-y-0 w-px border-r border-dashed border-stone-300" />
                  <div className="relative bg-white px-1.5 py-0.5 rounded-full border border-stone-200 text-[9px] font-bold text-stone-600 shadow-2xs rotate-[-90deg] whitespace-nowrap z-10">
                    {effectiveHeightInches} inch
                  </div>
                </div>

                {/* Outer Acrylic Stage */}
                <div className="relative w-full flex items-center justify-center transition-all duration-300">
                  {renderProductCanvas(false)}
                </div>
              </div>
            </div>
          </CustomizerPreviewArea>

        </main>

      </div>

      {/* REALISTIC ROOM VIEW MODAL */}
      <AcrylicRoomViewModal
        isOpen={showRoomView && hasUploadedImage}
        onClose={() => setShowRoomView(false)}
        productDimensionLabel={currentDimensionLabel}
        productId={selectedProductTypeId}
        productName={selectedProductType.name}
        shapeId={selectedShapeId}
        shapeName={currentShape.name}
        widthInches={effectiveWidthInches}
        heightInches={effectiveHeightInches}
        initialRoomState={roomViewState}
        onRoomStateChange={setRoomViewState}
        renderProduct={(isRoomView) => renderProductCanvas(isRoomView)}
      />

      {/* Select Size & Shape Modal */}
      <SelectSizeShapeModal
        isOpen={isSizeShapeModalOpen}
        onClose={() => setIsSizeShapeModalOpen(false)}
        material="acrylic"
        productId={selectedProductTypeId}
        productName={selectedProductType.name}
        currentShapeId={selectedShapeId}
        currentSizeId={selectedSizeId}
        isCustomSize={isCustomSize}
        customWidth={customWidth}
        customHeight={customHeight}
        onSelectSizeAndShape={handleApplySizeAndShape}
      />

      {/* Change Material Modal */}
      {materialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">Select Acrylic Material Variant</h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {ACRYLIC_MATERIAL_VARIANTS.map((mat) => {
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

              {/* Option to Switch to Canvas */}
              <div
                onClick={() => {
                  setMaterialModalOpen(false);
                  navigate('/customize/canvas/single-print');
                }}
                className="p-3.5 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#0E4A93] hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-[#0E4A93]">Switch to Canvas Prints</div>
                  <div className="text-[11px] text-stone-500">Artist-grade cotton canvas stretched on kiln-dried pine wood</div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#0E4A93]" />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AcrylicCustomizerPage;
