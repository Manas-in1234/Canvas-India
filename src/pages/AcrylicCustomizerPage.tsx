import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  Maximize2
} from 'lucide-react';
import { CanvasIndiaLogo } from '../components/CanvasIndiaLogo';
import { useShop } from '../context/ShopContext';
import {
  ToolbarTab,
  AcrylicProductType,
  ACRYLIC_PRODUCT_TYPES,
  SizeCategory,
  SizeOption,
  SIZE_OPTIONS,
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
  TemplateCategory,
  AcrylicTemplateItem,
  ACRYLIC_TEMPLATES,
  AcrylicEdgeWrap,
  ACRYLIC_EDGE_WRAPS,
  AcrylicShapeOption,
  ACRYLIC_SHAPES,
  getSizesForShape,
  ACRYLIC_BACKGROUNDS,
  ACRYLIC_BORDER_WIDTHS,
  ACRYLIC_BORDER_COLORS,
  THICKNESS_OPTIONS,
  PAPER_OPTIONS,
  FONT_OPTIONS,
  TEXT_COLOR_PRESETS,
  CLIPART_CATEGORIES
} from '../data/acrylicCustomizerData';

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number; // % offset from center (-42 to 42)
  y: number; // % offset from center (-42 to 42)
  alignment: 'left' | 'center' | 'right';
}

export interface ClipartElement {
  id: string;
  emoji: string;
  x: number; // % offset from center (-42 to 42)
  y: number; // % offset from center (-42 to 42)
  scale: number; // 0.6 to 2.5
  rotation: number; // 0, 90, 180, 270
}

export interface PanelImageState {
  imageUrl: string | null;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
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
  panX: 0,
  panY: 0,
  scale: 1,
  rotation: 0,
  filter: 'original',
  textElements: [],
  clipartElements: []
});

// ============================================================================
// MAIN ACRYLIC CUSTOMIZER COMPONENT
// ============================================================================

export const AcrylicCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Matched catalog product
  const catalogProduct = useMemo(() => {
    return allProducts.find(
      (p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'acrylic'
    ) || allProducts.find((p) => p.categorySlug === 'acrylic') || allProducts[0];
  }, [allProducts, productId]);

  // Active Left Toolbar Tab (8 tabs: PRODUCTS, UPLOAD, SELECT SIZE, LAYOUTS & DESIGNS, SHAPE, WRAP & BORDER, HARDWARE & FINISH, OPTIONS)
  const [activeTab, setActiveTab] = useState<ToolbarTab>('PRODUCTS');

  // Selected Acrylic Product Type
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<string>(() => {
    const key = (catalogProduct?.slug || catalogProduct?.id || catalogProduct?.name || '').toLowerCase();
    if (key.includes('block')) return 'acrylic-photo-block';
    if (key.includes('wall') || key.includes('display')) return 'acrylic-wall-art';
    if (key.includes('collage')) return 'acrylic-collage';
    if (key.includes('split')) return 'acrylic-split';
    if (key.includes('signage')) return 'acrylic-signage';
    if (key.includes('panel')) return 'acrylic-photo-panel';
    return 'acrylic-photo-panel';
  });

  const selectedProductType = useMemo(() => {
    return ACRYLIC_PRODUCT_TYPES.find((pt) => pt.id === selectedProductTypeId) || ACRYLIC_PRODUCT_TYPES[0];
  }, [selectedProductTypeId]);

  // Size Category filter tabs in SELECT SIZE panel
  const [sizeCategory, setSizeCategory] = useState<SizeCategory>('RECOMMENDED');

  const filteredSizes = useMemo(() => {
    return SIZE_OPTIONS.filter((s) => s.category === sizeCategory);
  }, [sizeCategory]);

  // Shape Selection State (SHAPE Tab - 23 Shapes Suite)
  const [selectedShapeId, setSelectedShapeId] = useState<string>('shape-square');
  const [shapeFilterCategory, setShapeFilterCategory] = useState<'ALL' | 'BASIC' | 'SPECIAL' | 'DECORATIVE'>('ALL');

  const currentShape = useMemo(() => {
    return ACRYLIC_SHAPES.find((s) => s.id === selectedShapeId) || ACRYLIC_SHAPES[0];
  }, [selectedShapeId]);

  const filteredShapes = useMemo(() => {
    if (shapeFilterCategory === 'ALL') return ACRYLIC_SHAPES;
    return ACRYLIC_SHAPES.filter((s) => s.category.toUpperCase() === shapeFilterCategory);
  }, [shapeFilterCategory]);

  // Dynamic Shape-Specific Sizes (Section 8 & 9)
  const shapeSizes = useMemo(() => {
    return getSizesForShape(selectedShapeId, selectedProductTypeId);
  }, [selectedShapeId, selectedProductTypeId]);

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>('shape-square-8x8');

  // Custom Size controls
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<number>(8);
  const [customHeight, setCustomHeight] = useState<number>(8);

  const currentSizeOption = useMemo(() => {
    return (
      shapeSizes.find((s) => s.id === selectedSizeId) ||
      SIZE_OPTIONS.find((s) => s.id === selectedSizeId) ||
      shapeSizes[2] ||
      shapeSizes[0] ||
      SIZE_OPTIONS[0]
    );
  }, [selectedSizeId, shapeSizes]);

  // Layouts & Designs Subtabs
  const [layoutSubTab, setLayoutSubTab] = useState<'DESIGNS' | 'LAYOUTS'>('LAYOUTS');
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('layout-1-single');
  const [expandedPhotoCount, setExpandedPhotoCount] = useState<number | null>(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);


  const currentLayout = useMemo(() => {
    return LAYOUT_PRESETS.find((l) => l.id === selectedLayoutId) || LAYOUT_PRESETS[0];
  }, [selectedLayoutId]);

  const frames = currentLayout.frames;

  // Frame Images State
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

  // Hardware & Finish States
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('standoff-mounts');
  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('display-standoff');
  const [selectedFinishId, setSelectedFinishId] = useState<string>('high-gloss');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('frame-none');
  const [selectedEdgeWrapId, setSelectedEdgeWrapId] = useState<string>('polished-clear');

  // Options panel states
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('3mm');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('white-luster');
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>('transparent');
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [selectedTypographyId, setSelectedTypographyId] = useState<string>('modern-sans');

  // Uploaded Photos session gallery
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Room View state
  const [showRoomView, setShowRoomView] = useState<boolean>(false);
  const [roomBackdrop, setRoomBackdrop] = useState<'living' | 'office' | 'bedroom'>('living');

  // Wheel Cleanup Map for smooth native non-passive zooming
  const wheelCleanupMapRef = useRef<Map<number, () => void>>(new Map());

  useEffect(() => {
    return () => {
      wheelCleanupMapRef.current.forEach((cleanup) => cleanup());
      wheelCleanupMapRef.current.clear();
    };
  }, []);

  // Add Text Editor Popover State
  const [showTextModal, setShowTextModal] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [selectedFontFamily, setSelectedFontFamily] = useState<string>('Georgia, serif');
  const [selectedFontSize, setSelectedFontSize] = useState<number>(20);
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#FFFFFF');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');

  // Clipart Picker Popover State
  const [showClipartModal, setShowClipartModal] = useState<boolean>(false);
  const [selectedClipartCategory, setSelectedClipartCategory] = useState<string>('Love & Wedding');

  // UI Modals & Notifications
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number; panelIdx: number } | null>(null);
  const textDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);
  const clipartDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);

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

  // Dynamic Pricing Calculation
  const finalPrice = useMemo(() => {
    let base = currentSizeOption?.price || selectedProductType.startingPrice;
    
    // Custom size calculation (approx ₹4.5 per sq inch)
    if (isCustomSize) {
      base = Math.max(399, Math.round(customWidth * customHeight * 4.5));
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

    // Edge Wrap
    const wrap = ACRYLIC_EDGE_WRAPS.find((w) => w.id === selectedEdgeWrapId);
    if (wrap) base += wrap.price;

    // Thickness
    const thk = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId);
    if (thk) base += thk.price;

    // Paper
    const ppr = PAPER_OPTIONS.find((p) => p.id === selectedPaperId);
    if (ppr) base += ppr.price;

    return Math.round(base);
  }, [
    currentSizeOption,
    selectedProductType,
    isCustomSize,
    customWidth,
    customHeight,
    currentShape,
    selectedHardwareId,
    selectedFinishId,
    selectedFrameId,
    selectedEdgeWrapId,
    selectedThicknessId,
    selectedPaperId
  ]);

  // Dimension summary string
  const currentDimensionLabel = isCustomSize
    ? currentShape.isSingleDimension
      ? `${customWidth}" Dia`
      : `${customWidth}" × ${customHeight}"`
    : currentSizeOption?.label || currentSizeOption?.dimensionsSummary || currentShape.name;

  // Direct Click to Upload on Empty Frame
  const handleEmptyFrameClick = (panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    uploadTargetPanelRef.current = panelIdx;
    singleFileInputRef.current?.click();
  };

  // Single file picker change
  const handleSingleFileChange = (file: File | null) => {
    if (!file) return;
    const targetIdx = uploadTargetPanelRef.current;

    if (file.size > 25 * 1024 * 1024) {
      alert(`File ${file.name} exceeds the 25MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateFrame(targetIdx, (curr) => ({
          ...curr,
          imageUrl: result,
          panX: 0,
          panY: 0,
          scale: 1,
          rotation: 0
        }));
        setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
        setActivePanelIndex(targetIdx);
        setSelectedElement({ type: 'image', panelIndex: targetIdx });
        setValidationWarning(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Multiple files upload to session gallery
  const handleGalleryUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const readers: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      if (file.size <= 25 * 1024 * 1024) {
        const promise = new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) resolve(result);
          };
          reader.readAsDataURL(file);
        });
        readers.push(promise);
      }
    });

    Promise.all(readers).then((newPhotos) => {
      setUploadedPhotos((prev) => [...newPhotos, ...prev]);
      // If current active frame is empty, populate it with the first uploaded image
      if (!panelImages[activePanelIndex]?.imageUrl && newPhotos[0]) {
        updateFrame(activePanelIndex, (curr) => ({
          ...curr,
          imageUrl: newPhotos[0]
        }));
      }
    });
  };

  // Image Transformations (Per Active Frame)
  const handleZoomIn = () => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      scale: Math.min(curr.scale + 0.15, 3.5)
    }));
  };

  const handleZoomOut = () => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      scale: Math.max(curr.scale - 0.15, 0.4)
    }));
  };

  const handleRotate = () => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      rotation: (curr.rotation + 90) % 360
    }));
  };

  const handleResetImage = () => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      scale: 1,
      panX: 0,
      panY: 0,
      rotation: 0
    }));
  };

  // Filter application
  const handleApplyFilter = (filterType: ColorFilterType) => {
    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      filter: filterType
    }));
  };

  // Dedicated Image Panning Handlers (Independent per frame, Touch & Mouse)
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
    e.stopPropagation();

    const { x: startX, y: startY, initialPanX, initialPanY, panelIdx } = dragStartRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const currentFrame = panelImages[panelIdx];
    const scale = currentFrame?.scale || 1;
    const maxPan = 450 * Math.max(1, scale);

    const newPanX = Math.max(-maxPan, Math.min(maxPan, initialPanX + deltaX));
    const newPanY = Math.max(-maxPan, Math.min(maxPan, initialPanY + deltaY));

    updateFrame(panelIdx, (curr) => ({
      ...curr,
      panX: Math.round(newPanX),
      panY: Math.round(newPanY)
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

  // Dedicated Wheel Zoom Registration with { passive: false } for smooth zooming and no page scroll
  const registerWheelRef = (panelIdx: number) => (el: HTMLDivElement | null) => {
    if (wheelCleanupMapRef.current.has(panelIdx)) {
      wheelCleanupMapRef.current.get(panelIdx)!();
      wheelCleanupMapRef.current.delete(panelIdx);
    }
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setActivePanelIndex(panelIdx);
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      updateFrame(panelIdx, (curr) => {
        const nextScale = Math.max(0.5, Math.min(3.5, Number((curr.scale + delta).toFixed(2))));
        return {
          ...curr,
          scale: nextScale
        };
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    wheelCleanupMapRef.current.set(panelIdx, () => {
      el.removeEventListener('wheel', onWheel);
    });
  };

  // Global Pointer Handlers for Independent Text & Clipart Dragging
  const onPointerMove = (e: React.PointerEvent) => {
    if (textDragRef.current && selectedElement.type === 'text' && selectedElement.elementId) {
      const { x: startX, y: startY, initialOffset, rect } = textDragRef.current;
      const dxPx = e.clientX - startX;
      const dyPx = e.clientY - startY;

      const pctX = (dxPx / rect.width) * 100;
      const pctY = (dyPx / rect.height) * 100;

      const newX = Math.max(-42, Math.min(42, Math.round(initialOffset.x + pctX)));
      const newY = Math.max(-42, Math.min(42, Math.round(initialOffset.y + pctY)));

      updateFrame(selectedElement.panelIndex, (curr) => ({
        ...curr,
        textElements: curr.textElements.map((txt) =>
          txt.id === selectedElement.elementId ? { ...txt, x: newX, y: newY } : txt
        )
      }));
    }

    if (clipartDragRef.current && selectedElement.type === 'clipart' && selectedElement.elementId) {
      const { x: startX, y: startY, initialOffset, rect } = clipartDragRef.current;
      const dxPx = e.clientX - startX;
      const dyPx = e.clientY - startY;

      const pctX = (dxPx / rect.width) * 100;
      const pctY = (dyPx / rect.height) * 100;

      const newX = Math.max(-42, Math.min(42, Math.round(initialOffset.x + pctX)));
      const newY = Math.max(-42, Math.min(42, Math.round(initialOffset.y + pctY)));

      updateFrame(selectedElement.panelIndex, (curr) => ({
        ...curr,
        clipartElements: curr.clipartElements.map((clip) =>
          clip.id === selectedElement.elementId ? { ...clip, x: newX, y: newY } : clip
        )
      }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
    textDragRef.current = null;
    clipartDragRef.current = null;
  };

  // Text Drag start
  const startTextDrag = (e: React.PointerEvent, panelIdx: number, textId: string, frameRect: DOMRect) => {
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: textId });

    const txt = panelImages[panelIdx]?.textElements.find((t) => t.id === textId);
    if (!txt) return;

    textDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffset: { x: txt.x, y: txt.y },
      rect: frameRect
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Clipart Drag start
  const startClipartDrag = (e: React.PointerEvent, panelIdx: number, clipId: string, frameRect: DOMRect) => {
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: clipId });

    const clip = panelImages[panelIdx]?.clipartElements.find((c) => c.id === clipId);
    if (!clip) return;

    clipartDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffset: { x: clip.x, y: clip.y },
      rect: frameRect
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Add new Text to active frame
  const handleAddText = () => {
    if (!textInput.trim()) return;
    const newId = `text-${Date.now()}`;
    const newText: TextElement = {
      id: newId,
      text: textInput,
      fontFamily: selectedFontFamily,
      fontSize: selectedFontSize,
      color: selectedTextColor,
      x: 0,
      y: 0,
      alignment: textAlignment
    };

    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      textElements: [...curr.textElements, newText]
    }));

    setSelectedElement({ type: 'text', panelIndex: activePanelIndex, elementId: newId });
    setTextInput('');
    setShowTextModal(false);
  };

  // Add Clipart to active frame
  const handleAddClipart = (emoji: string) => {
    const newId = `clipart-${Date.now()}`;
    const newClip: ClipartElement = {
      id: newId,
      emoji,
      x: 0,
      y: 0,
      scale: 1.2,
      rotation: 0
    };

    updateFrame(activePanelIndex, (curr) => ({
      ...curr,
      clipartElements: [...curr.clipartElements, newClip]
    }));

    setSelectedElement({ type: 'clipart', panelIndex: activePanelIndex, elementId: newId });
  };

  // Delete selected element
  const handleDeleteSelectedElement = () => {
    if (selectedElement.type === 'text' && selectedElement.elementId) {
      updateFrame(selectedElement.panelIndex, (curr) => ({
        ...curr,
        textElements: curr.textElements.filter((t) => t.id !== selectedElement.elementId)
      }));
      setSelectedElement({ type: 'image', panelIndex: selectedElement.panelIndex });
    } else if (selectedElement.type === 'clipart' && selectedElement.elementId) {
      updateFrame(selectedElement.panelIndex, (curr) => ({
        ...curr,
        clipartElements: curr.clipartElements.filter((c) => c.id !== selectedElement.elementId)
      }));
      setSelectedElement({ type: 'image', panelIndex: selectedElement.panelIndex });
    }
  };

  // Switch product type
  const handleSelectProductType = (ptId: string) => {
    setSelectedProductTypeId(ptId);
    const pt = ACRYLIC_PRODUCT_TYPES.find((p) => p.id === ptId);
    if (pt) {
      if (ptId === 'acrylic-wall-art' || ptId === 'acrylic-split') {
        setSelectedLayoutId('layout-3-wall');
      } else if (ptId === 'acrylic-collage') {
        setSelectedLayoutId('layout-4-grid');
      } else {
        setSelectedLayoutId('layout-1-single');
      }
      // Check shape compatibility with this product
      if (pt.supportedShapeIds && !pt.supportedShapeIds.includes(selectedShapeId)) {
        const supported = pt.supportedShapeIds[0] || 'shape-square';
        setSelectedShapeId(supported);
      }
      const newSizes = getSizesForShape(selectedShapeId, ptId);
      if (newSizes.length > 0) {
        setSelectedSizeId(newSizes[2]?.id || newSizes[0]?.id);
      }
    }
  };

  // Switch acrylic shape with automatic size & canvas adaptation
  const handleSelectShape = (shapeId: string) => {
    setSelectedShapeId(shapeId);
    const newSizes = getSizesForShape(shapeId, selectedProductTypeId);
    if (newSizes.length > 0) {
      // Pick balanced preset (index 2 is typically 8" or 8x8)
      const targetSize = newSizes[2] || newSizes[0];
      setSelectedSizeId(targetSize.id);
      setIsCustomSize(false);
      setCustomWidth(targetSize.widthInches);
      setCustomHeight(targetSize.heightInches);
    }
  };

  // Switch layout preset
  const handleSelectLayout = (layout: LayoutPreset) => {
    setSelectedLayoutId(layout.id);
    setActivePanelIndex(0);
    setSelectedElement({ type: 'image', panelIndex: 0 });
  };

  // Save customization to local storage
  const handleSaveDesign = () => {
    const designPayload = {
      productId: catalogProduct?.id || productId,
      productTypeId: selectedProductTypeId,
      sizeId: selectedSizeId,
      shapeId: selectedShapeId,
      isCustomSize,
      customWidth,
      customHeight,
      layoutId: selectedLayoutId,
      templateId: selectedTemplateId,
      hardwareId: selectedHardwareId,
      finishId: selectedFinishId,
      frameId: selectedFrameId,
      edgeWrapId: selectedEdgeWrapId,
      panelImages,
      uploadedPhotos,
      savedAt: new Date().toISOString(),
      finalPrice
    };

    localStorage.setItem(`canvas_india_acrylic_custom_${productId}`, JSON.stringify(designPayload));
    setSaveToast('Custom design saved to browser successfully!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Add to Cart
  const handleAddToCart = () => {
    const hasAnyPhoto = Object.values(panelImages).some((p) => !!p.imageUrl);
    if (!hasAnyPhoto) {
      setValidationWarning('Please upload at least one photo to complete your Acrylic customizer.');
      setActiveTab('UPLOAD');
      setTimeout(() => setValidationWarning(null), 5000);
      return;
    }

    if (onAddToCartCustomized && catalogProduct) {
      const primaryPhoto = Object.values(panelImages).find((p) => !!p.imageUrl)?.imageUrl || catalogProduct.image;
      onAddToCartCustomized({
        product: catalogProduct,
        quantity: 1,
        size: currentDimensionLabel,
        photoUrl: primaryPhoto,
        calculatedPrice: finalPrice,
        finish: FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name,
        customizationDetails: {
          acrylicProductType: selectedProductType.name,
          dimensions: currentDimensionLabel,
          shape: currentShape.name,
          layout: currentLayout.name,
          template: selectedTemplateId ? ACRYLIC_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name : 'Blank Canvas',
          hardware: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name,
          finish: FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name,
          frame: FRAME_OPTIONS.find((f) => f.id === selectedFrameId)?.name,
          edgeWrap: ACRYLIC_EDGE_WRAPS.find((w) => w.id === selectedEdgeWrapId)?.name,
          thickness: THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label,
          border: ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.label
        }
      });
      navigate('/cart');
    }
  };

  // RENDER A SINGLE ACRYLIC FRAME (Fully Functional Image Masking & Shape Dimensions)
  const renderFrameContainer = (panelIdx: number, aspectClass: string, dimensionLabel?: string) => {
    const frame = panelImages[panelIdx] || createDefaultPanelState(null);
    const isActive = activePanelIndex === panelIdx;
    const isTargetEmpty = !frame.imageUrl;
    const frameInfo = frames[panelIdx];
    const label = dimensionLabel || frameInfo?.dimension || `Frame ${panelIdx + 1}`;

    // Filter CSS (Section 21)
    const filterCss = 
      frame.filter === 'sepia'
        ? 'sepia(0.85) contrast(1.1) brightness(0.95)'
        : frame.filter === 'grayscale'
        ? 'grayscale(100%) contrast(1.05)'
        : 'none';

    // Border style
    const borderWidthPx = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0;

    // True Shape Masking & Dimensions (Section 6 & 7)
    const shapeClip = currentShape.clipPathStyle;
    const shapeRadius = currentShape.borderRadiusClass;

    // Custom dimensions or shape aspect class
    const containerAspectStyle: React.CSSProperties = isCustomSize
      ? { aspectRatio: `${customWidth} / ${customHeight}` }
      : {};
    const effectiveAspectClass = isCustomSize ? '' : (aspectClass || currentShape.aspectClass);

    return (
      <div 
        key={panelIdx} 
        className="relative w-full transition-all"
        style={{
          filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.2)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.1))'
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActivePanelIndex(panelIdx);
            setSelectedElement({ type: 'image', panelIndex: panelIdx });
            if (isTargetEmpty) {
              handleEmptyFrameClick(panelIdx);
            }
          }}
          className={`acrylic-frame-container relative w-full ${effectiveAspectClass} ${shapeRadius} bg-white overflow-hidden transition-all select-none border-2 ${
            isActive
              ? 'border-[#0E4A93] ring-4 ring-[#0E4A93]/30 z-20'
              : 'border-stone-300 hover:border-stone-400 z-10'
          } ${isTargetEmpty ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
          style={{
            clipPath: shapeClip,
            WebkitClipPath: shapeClip,
            ...containerAspectStyle
          }}
        >
        {/* Optical Acrylic Gloss Overlay */}
        {selectedFinishId === 'high-gloss' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-20" />
        )}
        {selectedFinishId === 'anti-glare' && (
          <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[0.5px] pointer-events-none z-20" />
        )}
        {selectedFinishId === 'diamond-bevel' && (
          <div className="absolute inset-0 border-4 border-white/60 pointer-events-none z-20 shadow-inner" />
        )}

        {/* Optional Inner Border Rendering */}
        {borderWidthPx > 0 && (
          <div
            className="absolute inset-0 pointer-events-none z-25"
            style={{
              border: `${borderWidthPx}px solid ${selectedBorderColor}`,
              borderRadius: selectedShapeId === 'shape-circle' ? '9999px' : undefined
            }}
          />
        )}

        {/* Architectural Chrome Standoff Bolts */}
        {(selectedHardwareId === 'standoff-mounts' || selectedProductTypeId === 'acrylic-signage' || selectedDisplayOptionId === 'display-standoff') && selectedShapeId !== 'shape-circle' && (
          <>
            <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-stone-400 via-stone-200 to-stone-50 border border-stone-600 shadow-md z-30 pointer-events-none flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-500" />
            </div>
            <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-stone-400 via-stone-200 to-stone-50 border border-stone-600 shadow-md z-30 pointer-events-none flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-500" />
            </div>
            <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-stone-400 via-stone-200 to-stone-50 border border-stone-600 shadow-md z-30 pointer-events-none flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-500" />
            </div>
            <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-stone-400 via-stone-200 to-stone-50 border border-stone-600 shadow-md z-30 pointer-events-none flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-500" />
            </div>
          </>
        )}

        {/* Frame Label Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
          <span>{frameInfo?.label || `Frame ${panelIdx + 1}`}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8752A] animate-pulse" />
          )}
        </div>

        {/* Frame Dimension Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
          {label}
        </div>

        {/* Active Filter Badge */}
        {frame.imageUrl && frame.filter !== 'original' && (
          <div className="absolute bottom-2 right-2 bg-[#0E4A93]/85 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
            {frame.filter}
          </div>
        )}

        {/* Frame Content (Independent Image Transform Inside Shape) */}
        {frame.imageUrl ? (
          <div
            ref={registerWheelRef(panelIdx)}
            onPointerDown={(e) => handleImagePointerDown(e, panelIdx)}
            onPointerMove={handleImagePointerMove}
            onPointerUp={handleImagePointerUp}
            onPointerCancel={handleImagePointerUp}
            style={{ touchAction: 'none' }}
            className={`w-full h-full relative overflow-hidden flex items-center justify-center select-none ${
              isDragging && activePanelIndex === panelIdx ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <img
              src={frame.imageUrl}
              alt={label}
              draggable={false}
              style={{
                transform: `translate3d(${frame.panX || 0}px, ${frame.panY || 0}px, 0) scale(${frame.scale || 1}) rotate(${frame.rotation || 0}deg)`,
                transformOrigin: 'center center',
                filter: filterCss,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              className="max-w-none w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Draggable Text Elements */}
            {frame.textElements?.map((txt) => {
              const isTextSelected =
                selectedElement.type === 'text' &&
                selectedElement.panelIndex === panelIdx &&
                selectedElement.elementId === txt.id;

              return (
                <div
                  key={txt.id}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    const frameEl = (e.currentTarget as HTMLElement).closest('.acrylic-frame-container');
                    const rect = frameEl?.getBoundingClientRect() || (e.currentTarget as HTMLElement).getBoundingClientRect();
                    startTextDrag(e, panelIdx, txt.id, rect);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePanelIndex(panelIdx);
                    setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: txt.id });
                  }}
                  style={{
                    position: 'absolute',
                    left: `${50 + txt.x}%`,
                    top: `${50 + txt.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: txt.fontFamily,
                    fontSize: `${txt.fontSize}px`,
                    color: txt.color,
                    textAlign: txt.alignment,
                    whiteSpace: 'pre-line'
                  }}
                  className={`z-30 cursor-move px-2 py-1 select-none transition-shadow rounded ${
                    isTextSelected
                      ? 'ring-2 ring-[#0E4A93] bg-black/40 backdrop-blur-xs'
                      : 'hover:ring-1 hover:ring-white/80'
                  }`}
                >
                  {txt.text}
                </div>
              );
            })}

            {/* Draggable Clipart Elements */}
            {frame.clipartElements?.map((clip) => {
              const isClipSelected =
                selectedElement.type === 'clipart' &&
                selectedElement.panelIndex === panelIdx &&
                selectedElement.elementId === clip.id;

              return (
                <div
                  key={clip.id}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    const frameEl = (e.currentTarget as HTMLElement).closest('.acrylic-frame-container');
                    const rect = frameEl?.getBoundingClientRect() || (e.currentTarget as HTMLElement).getBoundingClientRect();
                    startClipartDrag(e, panelIdx, clip.id, rect);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePanelIndex(panelIdx);
                    setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: clip.id });
                  }}
                  style={{
                    position: 'absolute',
                    left: `${50 + clip.x}%`,
                    top: `${50 + clip.y}%`,
                    transform: `translate(-50%, -50%) scale(${clip.scale}) rotate(${clip.rotation}deg)`,
                    fontSize: '28px',
                    lineHeight: '1'
                  }}
                  className={`z-30 cursor-move p-1 select-none rounded transition-shadow ${
                    isClipSelected
                      ? 'ring-2 ring-[#0E4A93] bg-black/40 backdrop-blur-xs'
                      : 'hover:ring-1 hover:ring-white/80'
                  }`}
                >
                  {clip.emoji}
                </div>
              );
            })}
          </div>
        ) : (
          /* STRICTLY MINIMAL EMPTY FRAME: ONLY THE UPLOAD ICON (Rule 15) */
          <div 
            className="w-full h-full flex items-center justify-center bg-stone-50/70 hover:bg-stone-100/90 transition-colors cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:border-[#0E4A93]/40 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
        )}
      </div>
    </div>
    );
  };

  // Dynamic frame outer border CSS
  const currentFrameCss = useMemo(() => {
    const frameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    return frameObj?.borderCss || '';
  }, [selectedFrameId]);

  // Primary Toolbar items: EXACT 8 ITEMS IN ORDER (Section 3 & 4)
  const toolbarItems: { id: ToolbarTab; label: string; icon: React.ElementType }[] = [
    { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
    { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
    { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
    { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers },
    { id: 'SHAPE', label: 'SHAPE', icon: Shapes },
    { id: 'WRAP & BORDER', label: 'WRAP & BORDER', icon: Crop },
    { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: SlidersHorizontal },
    { id: 'OPTIONS', label: 'OPTIONS', icon: Menu }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] font-sans antialiased select-none">
      
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

      {/* =================================================================== */}
      {/* 1. RESTORED CUSTOMIZER HEADER (Section 1)                          */}
      {/* =================================================================== */}
      <header className="h-14 bg-[#0E4A93] text-white flex items-center justify-between px-3 sm:px-6 shadow-md z-30 shrink-0">
        
        {/* LEFT: Menu / Back / Logo / Customizer */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
            title="Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link
            to="/acrylic"
            className="flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Acrylic</span>
          </Link>
          
          <div className="h-5 w-px bg-white/20 hidden sm:block" />
          
          {/* Canvas India Original Logo directly on header background without white box (Section 1 & 24) */}
          <div className="flex items-center gap-2">
            <img 
              src="/canvas-india-official-logo.png" 
              alt="Canvas India" 
              className="h-7 sm:h-8 w-auto object-contain shrink-0" 
            />
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white hidden md:inline">
              Customizer
            </span>
          </div>
        </div>

        {/* CENTER: Current product name & selected size */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-white/90">
          <span className="font-bold text-white">{selectedProductType.name}</span>
          <span className="text-white/40">•</span>
          <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full">
            {currentDimensionLabel}
          </span>
        </div>

        {/* RIGHT: Total Price, Save, Add to Cart */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-white/70 font-semibold leading-tight">Total Price</div>
            <div className="text-base sm:text-lg font-black text-amber-400 leading-tight">
              ₹{finalPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveDesign}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="Save custom design"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-[#E8752A] hover:bg-[#d6651d] text-white text-xs sm:text-sm font-black px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </header>

      {/* SVG Global ClipPath Mask Definitions for 23 Acrylic Shapes (Section 7) */}
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

      {/* =================================================================== */}
      {/* MAIN CUSTOMIZER BODY                                                */}
      {/* =================================================================== */}
      <div 
        className="flex-1 flex flex-col md:flex-row overflow-hidden"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >

        {/* ----------------------------------------------------------------- */}
        {/* LEFT PRIMARY TOOLBAR: 8 ITEMS IN ORDER (Sections 3 & 4)           */}
        {/* ----------------------------------------------------------------- */}
        <aside className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex md:flex-col items-center justify-between md:justify-start py-1 md:py-3 z-20 shrink-0 overflow-x-auto md:overflow-x-visible">
          {toolbarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 md:flex-none md:w-16 py-2 px-1 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-[#0E4A93] font-bold bg-blue-50/60'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50 font-medium'
                }`}
              >
                {isActive && (
                  <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0E4A93] rounded-r-full" />
                )}
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#0E4A93]/10' : ''}`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[9px] sm:text-[10px] text-center tracking-tight leading-tight line-clamp-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </aside>

        {/* ----------------------------------------------------------------- */}
        {/* LEFT SECONDARY PANEL (DRAWER CONTENT FOR ACTIVE TAB)              */}
        {/* ----------------------------------------------------------------- */}
        <section className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col z-10 shrink-0 h-72 md:h-auto overflow-y-auto">
          
          {/* Panel Header */}
          <div className="p-3.5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
            <h2 className="text-xs font-black tracking-wider text-stone-800 uppercase flex items-center gap-1.5">
              <span>{activeTab}</span>
            </h2>
            <span className="text-[11px] font-semibold text-stone-500">
              {activeTab === 'PRODUCTS' && '7 Styles'}
              {activeTab === 'SELECT SIZE' && `${shapeSizes.length} Options`}
              {activeTab === 'LAYOUTS & DESIGNS' && `${LAYOUT_PRESETS.length} Layouts`}
              {activeTab === 'SHAPE' && `${ACRYLIC_SHAPES.length} Shapes`}
              {activeTab === 'WRAP & BORDER' && '4 Edges'}
              {activeTab === 'HARDWARE & FINISH' && 'Hardware'}
              {activeTab === 'OPTIONS' && 'Specifications'}
            </span>
          </div>

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'PRODUCTS' && (
            <div className="p-3.5 grid grid-cols-2 gap-2.5">
              {ACRYLIC_PRODUCT_TYPES.map((pt) => {
                const isSelected = selectedProductTypeId === pt.id;
                return (
                  <div
                    key={pt.id}
                    onClick={() => handleSelectProductType(pt.id)}
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

                    <div className="w-full h-20 bg-stone-50 flex items-center justify-center p-1 overflow-hidden relative">
                      <img 
                        src={pt.image} 
                        alt={pt.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/acrylic/acrylic-fallback.jpg';
                        }}
                      />
                    </div>

                    <div className="p-2 bg-white border-t border-stone-100">
                      <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                        {pt.name}
                      </div>
                      <div className="text-[11px] font-medium text-stone-500 mt-0.5">
                        From ₹{pt.startingPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-1">
                  Upload Photos
                </h3>
                <p className="text-[11px] text-stone-500">
                  Upload multiple photos from your device to easily assign into frames.
                </p>
              </div>

              {frames.length > 1 && (
                <div className="p-2.5 bg-stone-100 rounded-xl space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-700">Assign to Frame:</div>
                  <div className="flex gap-1.5">
                    {frames.map((f, fIdx) => {
                      const isTarget = activePanelIndex === fIdx;
                      const hasPhoto = !!panelImages[fIdx]?.imageUrl;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setActivePanelIndex(fIdx)}
                          className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isTarget
                              ? 'bg-white border-[#0E4A93] text-[#0E4A93] shadow-xs'
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          <span>Frame {fIdx + 1}</span>
                          {hasPhoto && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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

              {uploadedPhotos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">Uploaded Photos ({uploadedPhotos.length}):</span>
                    <span className="text-[11px] text-[#0E4A93]">Click to assign to active frame</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200">
                    {uploadedPhotos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => {
                          updateFrame(activePanelIndex, (curr) => ({
                            ...curr,
                            imageUrl: photo
                          }));
                        }}
                        className="aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-[#0E4A93] cursor-pointer hover:opacity-90 relative group"
                      >
                        <img src={photo} alt={`Upload ${pIdx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SELECT SIZE */}
          {activeTab === 'SELECT SIZE' && (
            <div className="p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                  {currentShape.name} Sizes
                </span>
                <span className="text-[11px] font-bold text-[#0E4A93]">
                  {shapeSizes.length} Available
                </span>
              </div>

              {/* Subtabs: Preset Sizes vs Custom Dimensions */}
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsCustomSize(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    !isCustomSize
                      ? 'bg-white text-[#0E4A93] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  PRESET SIZES
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomSize(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    isCustomSize
                      ? 'bg-white text-[#0E4A93] shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  CUSTOM SIZE
                </button>
              </div>

              {!isCustomSize ? (
                <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {shapeSizes.map((size) => {
                    const isSelected = selectedSizeId === size.id && !isCustomSize;
                    return (
                      <div
                        key={size.id}
                        onClick={() => {
                          setSelectedSizeId(size.id);
                          setIsCustomSize(false);
                          setCustomWidth(size.widthInches);
                          setCustomHeight(size.heightInches);
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

                        <div className="w-full h-16 bg-stone-50 flex items-center justify-center p-1.5 overflow-hidden relative">
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
                            ₹{size.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-800">Custom Dimensions:</div>
                  {currentShape.isSingleDimension ? (
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase">
                        DIAMETER / SIZE (INCHES)
                      </label>
                      <input
                        type="number"
                        min={4}
                        max={48}
                        value={customWidth}
                        onChange={(e) => {
                          const val = Math.max(4, Math.min(48, Number(e.target.value) || 4));
                          setCustomWidth(val);
                          setCustomHeight(val);
                        }}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                      />
                      <div className="text-[10px] text-stone-500 mt-1">Min 4", Max 48" for symmetrical laser cuts</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase">WIDTH (INCHES)</label>
                        <input
                          type="number"
                          min={4}
                          max={60}
                          value={customWidth}
                          onChange={(e) => {
                            const val = Math.max(4, Math.min(60, Number(e.target.value) || 4));
                            setCustomWidth(val);
                          }}
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 block mb-1 uppercase">HEIGHT (INCHES)</label>
                        <input
                          type="number"
                          min={4}
                          max={60}
                          value={customHeight}
                          onChange={(e) => {
                            const val = Math.max(4, Math.min(60, Number(e.target.value) || 4));
                            setCustomHeight(val);
                          }}
                          className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                        />
                      </div>
                    </div>
                  )}
                  <div className="text-[11px] text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200 flex items-center justify-between">
                    <span>Dimension: <strong className="text-stone-900">{currentDimensionLabel}</strong></span>
                    <span className="text-[#0E4A93] font-black">₹{Math.max(399, Math.round(customWidth * customHeight * 4.5))}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LAYOUTS & DESIGNS */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="p-3.5 space-y-3">
              <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100">
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
              </div>

              {layoutSubTab === 'LAYOUTS' && (
                <div className="space-y-2.5">
                  {[1, 2, 3, 4].map((count) => {
                    const isExpanded = expandedPhotoCount === count;
                    const matchingLayouts = LAYOUT_PRESETS.filter((l) => l.photoCount === count);

                    return (
                      <div key={count} className="border border-stone-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedPhotoCount(isExpanded ? null : count)}
                          className="w-full flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 text-xs font-black text-stone-800 transition-colors cursor-pointer"
                        >
                          <span>{count} {count === 1 ? 'Photo' : 'Photos'}</span>
                          <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="p-2.5 grid grid-cols-2 gap-2 bg-white border-t border-stone-100">
                            {matchingLayouts.map((layout) => {
                              const isSelected = selectedLayoutId === layout.id;
                              return (
                                <div
                                  key={layout.id}
                                  onClick={() => handleSelectLayout(layout)}
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

                                  <div className="w-full h-16 bg-stone-50 border-b border-stone-100 p-2 flex items-center justify-center">
                                    {layout.layoutType === '1-single' && (
                                      <div className="w-12 h-10 bg-[#0E4A93]/40 rounded-xs" />
                                    )}
                                    {layout.layoutType === '2-vertical' && (
                                      <div className="w-12 h-10 flex gap-0.5">
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                      </div>
                                    )}
                                    {layout.layoutType === '2-horizontal' && (
                                      <div className="w-12 h-10 flex flex-col gap-0.5">
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                      </div>
                                    )}
                                    {layout.layoutType === '3-wall' && (
                                      <div className="w-12 h-10 flex gap-0.5">
                                        <div className="w-3 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="w-3 bg-[#0E4A93]/40 rounded-xs" />
                                      </div>
                                    )}
                                    {layout.layoutType === '3-triptych' && (
                                      <div className="w-12 h-10 flex gap-0.5">
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                      </div>
                                    )}
                                    {layout.layoutType === '4-grid' && (
                                      <div className="w-12 h-10 grid grid-cols-2 gap-0.5">
                                        <div className="bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="bg-[#0E4A93]/40 rounded-xs" />
                                        <div className="bg-[#0E4A93]/40 rounded-xs" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-1.5 bg-white text-center">
                                    <div className="text-[11px] font-bold text-stone-900 leading-tight truncate">
                                      {layout.name}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {layoutSubTab === 'DESIGNS' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {DESIGN_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedTemplateId(tmpl.id);
                          setSelectedLayoutId(tmpl.layoutId);
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

                        <div className="w-full h-20 bg-stone-50 flex items-center justify-center p-1 overflow-hidden relative">
                          <img 
                            src={tmpl.image} 
                            alt={tmpl.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-stone-100">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {tmpl.name}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5 truncate">
                            {tmpl.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 5: SHAPE (Full 23 Shapes Suite: Section 4, 5, 6 & 13)         */}
          {/* =============================================================== */}
          {activeTab === 'SHAPE' && (
            <div className="p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-0.5">
                    Acrylic Shapes
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Select laser-cut shape. Instant canvas masking.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#0E4A93]">
                  {ACRYLIC_SHAPES.length} Shapes
                </span>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {(['ALL', 'BASIC', 'SPECIAL', 'DECORATIVE'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setShapeFilterCategory(cat)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      shapeFilterCategory === cat
                        ? 'bg-[#0E4A93] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat} {cat === 'ALL' ? `(${ACRYLIC_SHAPES.length})` : `(${ACRYLIC_SHAPES.filter(s => s.category.toUpperCase() === cat).length})`}
                  </button>
                ))}
              </div>

              {/* Grid of 23 Shape Cards with Image Thumbnails */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredShapes.map((shape) => {
                  const isSelected = selectedShapeId === shape.id;
                  const isSupported = !selectedProductType.supportedShapeIds || selectedProductType.supportedShapeIds.includes(shape.id);

                  return (
                    <div
                      key={shape.id}
                      onClick={() => handleSelectShape(shape.id)}
                      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0E4A93] bg-blue-50/25 shadow-sm ring-1 ring-[#0E4A93]/20'
                          : isSupported
                          ? 'border-stone-200 hover:border-stone-400 bg-white'
                          : 'border-stone-200 bg-stone-50/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="w-full h-20 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                        <img 
                          src={shape.image} 
                          alt={shape.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      </div>

                      <div className="p-2 bg-white border-t border-stone-100 text-center">
                        <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                          {shape.name}
                        </div>
                        <div className="text-[10px] font-semibold text-stone-500 mt-0.5">
                          {shape.priceAddon ? `+₹${shape.priceAddon}` : 'Included'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: WRAP & BORDER */}
          {activeTab === 'WRAP & BORDER' && (
            <div className="p-3.5 space-y-4">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Acrylic Edge Finish / Wrap
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ACRYLIC_EDGE_WRAPS.map((wrap) => {
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

                        <div className="w-full h-18 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                          <img 
                            src={wrap.image} 
                            alt={wrap.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {wrap.name}
                          </div>
                          <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
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
                <div className="grid grid-cols-2 gap-2">
                  {ACRYLIC_BORDER_WIDTHS.map((border) => {
                    const isSelected = selectedBorderWidthId === border.id;
                    return (
                      <div
                        key={border.id}
                        onClick={() => setSelectedBorderWidthId(border.id)}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
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
            <div className="p-3.5 space-y-4">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Hardware & Mounting
                </div>
                <div className="grid grid-cols-2 gap-2">
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

                        <div className="w-full h-18 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                          <img 
                            src={hw.image} 
                            alt={hw.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {hw.name}
                          </div>
                          <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
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
                <div className="grid grid-cols-2 gap-2">
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

                        <div className="w-full h-18 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                          <img 
                            src={fin.image} 
                            alt={fin.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {fin.name}
                          </div>
                          <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
                            {fin.price === 0 ? 'Included' : `+₹${fin.price}`}
                          </div>
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
            <div className="p-3.5 space-y-4">
              <div>
                <div className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
                  Frame Moulding
                </div>
                <div className="grid grid-cols-2 gap-2">
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

                        <div className="w-full h-18 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                          <img 
                            src={frm.image} 
                            alt={frm.name} 
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2 bg-white border-t border-stone-100 text-center">
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {frm.name}
                          </div>
                          <div className="text-[11px] font-semibold text-stone-500 mt-0.5">
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
                    const previewImg = activeFrameState.imageUrl || selectedProductType.image;
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

                        <div className="w-full h-16 bg-stone-50 flex items-center justify-center p-1 overflow-hidden relative">
                          <img
                            src={previewImg}
                            alt={cfo.label}
                            style={{ filter: cfo.cssFilter }}
                            className="max-h-full max-w-full object-cover rounded"
                          />
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

        </section>

        {/* ----------------------------------------------------------------- */}
        {/* CENTER / MAIN WORKSPACE                                           */}
        {/* ----------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col bg-[#F8FAFC] relative overflow-hidden">
          
          {/* =============================================================== */}
          {/* 6. TOP-RIGHT TOOLBAR ABOVE WORKSPACE (Sections 6 - 12)           */}
          {/* =============================================================== */}
          <div className="h-12 bg-white border-b border-stone-200 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 overflow-x-auto">
            
            {/* Left Image Manipulation Tools */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetImage}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                title="Reset Image"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Top-Right Toolbar [SAVE, ADD TEXT, ADD CLIPART, ROOM VIEW] */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* SAVE */}
              <button
                type="button"
                onClick={handleSaveDesign}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-xs font-bold transition-all shadow-2xs hover:border-stone-400 cursor-pointer"
                title="Save design to browser"
              >
                <Save className="w-3.5 h-3.5 text-[#0E4A93]" />
                <span>SAVE</span>
              </button>

              {/* ADD TEXT */}
              <button
                type="button"
                onClick={() => setShowTextModal(!showTextModal)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
                  showTextModal
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
                title="Add custom typography and lyrics"
              >
                <Type className="w-3.5 h-3.5" />
                <span>ADD TEXT</span>
              </button>

              {/* ADD CLIPART */}
              <button
                type="button"
                onClick={() => setShowClipartModal(!showClipartModal)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
                  showClipartModal
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
                title="Add stickers and clipart"
              >
                <Smile className="w-3.5 h-3.5" />
                <span>ADD CLIPART</span>
              </button>

              {/* ROOM VIEW */}
              <button
                type="button"
                onClick={() => setShowRoomView(!showRoomView)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
                  showRoomView
                    ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
                }`}
                title="Preview in realistic room interior"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ROOM VIEW</span>
              </button>


              {/* Delete Selected Element (Text/Clipart) */}
              {selectedElement.type !== 'image' && (
                <button
                  type="button"
                  onClick={handleDeleteSelectedElement}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer ml-1"
                  title="Delete Selected Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>

          {/* =============================================================== */}
          {/* FLOATING ADD TEXT TOOLBAR / MODAL                                */}
          {/* =============================================================== */}
          {showTextModal && (
            <div className="absolute top-14 right-4 z-40 bg-white border border-stone-300 rounded-2xl shadow-2xl p-4 w-80 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#0E4A93]" />
                  <span>Add Typography</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTextModal(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Your Text / Lyrics</label>
                  <textarea
                    rows={2}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter custom text or vows..."
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Font Style</label>
                    <select
                      value={selectedFontFamily}
                      onChange={(e) => setSelectedFontFamily(e.target.value)}
                      className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-medium text-stone-900"
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Font Size</label>
                    <input
                      type="number"
                      min={10}
                      max={72}
                      value={selectedFontSize}
                      onChange={(e) => setSelectedFontSize(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Text Color</label>
                  <div className="flex gap-2">
                    {TEXT_COLOR_PRESETS.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedTextColor(col.hex)}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                        className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                          selectedTextColor === col.hex ? 'border-[#0E4A93] scale-110 ring-2 ring-[#0E4A93]/30' : 'border-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddText}
                    className="flex-1 py-2 bg-[#0E4A93] hover:bg-[#0c3e7b] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Add to Canvas
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* FLOATING ADD CLIPART TOOLBAR / MODAL                             */}
          {/* =============================================================== */}
          {showClipartModal && (
            <div className="absolute top-14 right-4 z-40 bg-white border border-stone-300 rounded-2xl shadow-2xl p-4 w-80 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[#E8752A]" />
                  <span>Select Clipart</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowClipartModal(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Clipart Categories */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
                {Object.keys(CLIPART_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedClipartCategory(cat)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      selectedClipartCategory === cat
                        ? 'bg-[#0E4A93] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Clipart Icons Grid */}
              <div className="grid grid-cols-5 gap-2 p-2 bg-stone-50 rounded-xl max-h-48 overflow-y-auto">
                {(CLIPART_CATEGORIES[selectedClipartCategory] || []).map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddClipart(emoji)}
                    className="w-10 h-10 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

                    {/* =============================================================== */}
          {/* CANVAS INTERACTIVE WORKSPACE (Section 13)                         */}
          {/* =============================================================== */}
          <div 
            className={`flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none ${
              showRoomView ? 'bg-stone-800' : 'bg-[#E2E8F0]/50'
            }`}
            style={{
              backgroundImage: showRoomView 
                ? roomBackdrop === 'office'
                  ? 'url(/assets/acrylic/acrylic-corporate-office.jpg)'
                  : roomBackdrop === 'bedroom'
                  ? 'url(/assets/acrylic/acrylic-family-wall.jpg)'
                  : 'url(/assets/acrylic/acrylic-panel-living.jpg)' 
                : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #E2E8F0 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >

            {/* Room View Backdrop Switcher overlay */}
            {showRoomView && (
              <div className="absolute top-4 left-4 z-30 bg-black/75 backdrop-blur-md rounded-xl p-2 flex gap-1.5 text-white">
                {(['living', 'office', 'bedroom'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoomBackdrop(r)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                      roomBackdrop === r ? 'bg-[#0E4A93] text-white' : 'hover:bg-white/20 text-stone-300'
                    }`}
                  >
                    {r === 'living' && 'Living Room'}
                    {r === 'office' && 'Modern Office'}
                    {r === 'bedroom' && 'Gallery Wall'}
                  </button>
                ))}
              </div>
            )}

            {/* Acrylic Product Frame Wrapper with Optional Outer Moulding Frame */}
            <div 
              className={`relative max-w-2xl w-full flex items-center justify-center transition-all duration-300 ${currentFrameCss}`}
            >
              
              {/* Single Frame Layout */}
              {selectedLayoutId === 'layout-1-single' && (
                <div className="w-full max-w-lg">
                  {renderFrameContainer(0, currentShape.aspectClass, currentDimensionLabel)}
                </div>
              )}

              {/* 2 Split Vertical Layout */}
              {selectedLayoutId === 'layout-2-vertical' && (
                <div className="w-full max-w-xl flex gap-3">
                  <div className="flex-1">
                    {renderFrameContainer(0, 'aspect-[3/4]')}
                  </div>
                  <div className="flex-1">
                    {renderFrameContainer(1, 'aspect-[3/4]')}
                  </div>
                </div>
              )}

              {/* 2 Split Horizontal Layout */}
              {selectedLayoutId === 'layout-2-horizontal' && (
                <div className="w-full max-w-md flex flex-col gap-3">
                  <div className="w-full">
                    {renderFrameContainer(0, 'aspect-[16/9]')}
                  </div>
                  <div className="w-full">
                    {renderFrameContainer(1, 'aspect-[16/9]')}
                  </div>
                </div>
              )}

              {/* 3 Wall / Triptych Display Layout */}
              {(selectedLayoutId === 'layout-3-wall' || selectedProductTypeId === 'acrylic-wall-art' || selectedProductTypeId === 'acrylic-split') && (
                <div className="w-full max-w-2xl flex items-center justify-center gap-3">
                  <div className="w-1/3">
                    {renderFrameContainer(0, 'aspect-[1/2]')}
                  </div>
                  <div className="w-1/3 scale-105 z-10">
                    {renderFrameContainer(1, 'aspect-[1/2]')}
                  </div>
                  <div className="w-1/3">
                    {renderFrameContainer(2, 'aspect-[1/2]')}
                  </div>
                </div>
              )}

              {/* 4 Photo Grid / Collage Layout */}
              {selectedLayoutId === 'layout-4-grid' && (
                <div className="w-full max-w-lg grid grid-cols-2 gap-3">
                  {renderFrameContainer(0, 'aspect-square')}
                  {renderFrameContainer(1, 'aspect-square')}
                  {renderFrameContainer(2, 'aspect-square')}
                  {renderFrameContainer(3, 'aspect-square')}
                </div>
              )}

            </div>

            {/* Compact Floating Image Editor Controls Bar (Section 6, 8, 9, 18) */}
            {activeFrameState.imageUrl && (
              <div className="mt-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-stone-200/90 flex items-center gap-2.5 z-30 select-none animate-in fade-in slide-in-from-bottom-2">
                {frames.length > 1 && (
                  <div className="text-[11px] font-bold text-stone-700 pr-2 border-r border-stone-200">
                    Frame {activePanelIndex + 1}
                  </div>
                )}

                {/* Zoom Controls: [ − ] [ 1.00x ] [ + ] */}
                <div className="flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-700 hover:text-stone-900 transition-colors font-bold text-sm cursor-pointer"
                    title="Zoom Out (or wheel down)"
                  >
                    −
                  </button>
                  <span className="text-[11px] font-extrabold text-stone-800 min-w-[36px] text-center">
                    {(activeFrameState.scale || 1).toFixed(2)}x
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-700 hover:text-stone-900 transition-colors font-bold text-sm cursor-pointer"
                    title="Zoom In (or wheel up)"
                  >
                    +
                  </button>
                </div>

                {/* Rotate Button */}
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-[#0E4A93] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Reset position, zoom & rotation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default AcrylicCustomizerPage;
