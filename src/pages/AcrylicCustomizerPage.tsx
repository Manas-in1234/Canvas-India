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
  Grid
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

const POSITION_PRESETS = [
  { label: 'TL', title: 'Top Left', x: -32, y: -35 },
  { label: 'TC', title: 'Top Center', x: 0, y: -35 },
  { label: 'TR', title: 'Top Right', x: 32, y: -35 },
  { label: 'CL', title: 'Center Left', x: -32, y: 0 },
  { label: 'C', title: 'Center', x: 0, y: 0 },
  { label: 'CR', title: 'Center Right', x: 32, y: 0 },
  { label: 'BL', title: 'Bottom Left', x: -32, y: 35 },
  { label: 'BC', title: 'Bottom Center', x: 0, y: 35 },
  { label: 'BR', title: 'Bottom Right', x: 32, y: 35 }
];

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

  // Active Left Toolbar Tab (6 tabs)
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

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>('rec-11x17');

  // Custom Size controls
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<number>(8);
  const [customHeight, setCustomHeight] = useState<number>(8);

  const currentSizeOption = useMemo(() => {
    return SIZE_OPTIONS.find((s) => s.id === selectedSizeId) || SIZE_OPTIONS[0];
  }, [selectedSizeId]);

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
    0: createDefaultPanelState(),
    1: createDefaultPanelState(),
    2: createDefaultPanelState(),
    3: createDefaultPanelState()
  });

  // Active Frame Index
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  // Selected Element
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({
    type: 'image',
    panelIndex: 0
  });

  // Options State
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('hooks-hanging');
  const [selectedDisplayOptionId, setSelectedDisplayOptionId] = useState<string>('display-tabletop');
  const [selectedFinishId, setSelectedFinishId] = useState<string>('high-gloss');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('no-frame');
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>('transparent');
  const [selectedBorderWidthId, setSelectedBorderWidthId] = useState<string>('none');
  const [selectedBorderColor, setSelectedBorderColor] = useState<string>('#FFFFFF');
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('3mm');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('white-luster');
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Uploaded Photos session gallery
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // UI state
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [showClipartSelector, setShowClipartSelector] = useState<boolean>(false);
  const [selectedClipartCategory, setSelectedClipartCategory] = useState<string>('Celebration');
  const [showPositionPopover, setShowPositionPopover] = useState<boolean>(false);
  const [showRoomView, setShowRoomView] = useState<boolean>(false);
  const [selectedRoomBg, setSelectedRoomBg] = useState<'living' | 'office' | 'gallery'>('living');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs for upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetPanelRef = useRef<number>(0);

  // Pointer drag info
  const dragInfoRef = useRef<{
    active: boolean;
    targetType: 'image' | 'text' | 'clipart';
    panelIndex: number;
    elementId?: string;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    startPercX: number;
    startPercY: number;
    frameWidth: number;
    frameHeight: number;
  }>({
    active: false,
    targetType: 'image',
    panelIndex: 0,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    startPercX: 0,
    startPercY: 0,
    frameWidth: 1,
    frameHeight: 1
  });

  // Storage key
  const storageKey = `ci_acrylic_customizer_${catalogProduct.id || catalogProduct.slug || 'acrylic'}`;

  // Restore saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedProductTypeId) setSelectedProductTypeId(data.selectedProductTypeId);
        if (data.selectedSizeId) setSelectedSizeId(data.selectedSizeId);
        if (data.isCustomSize !== undefined) setIsCustomSize(data.isCustomSize);
        if (data.customWidth) setCustomWidth(data.customWidth);
        if (data.customHeight) setCustomHeight(data.customHeight);
        if (data.selectedLayoutId) setSelectedLayoutId(data.selectedLayoutId);
        if (data.selectedHardwareId) setSelectedHardwareId(data.selectedHardwareId);
        if (data.selectedDisplayOptionId) setSelectedDisplayOptionId(data.selectedDisplayOptionId);
        if (data.selectedFinishId) setSelectedFinishId(data.selectedFinishId);
        if (data.selectedFrameId) setSelectedFrameId(data.selectedFrameId);
        if (data.selectedBackgroundId) setSelectedBackgroundId(data.selectedBackgroundId);
        if (data.selectedBorderWidthId) setSelectedBorderWidthId(data.selectedBorderWidthId);
        if (data.selectedBorderColor) setSelectedBorderColor(data.selectedBorderColor);
        if (data.selectedThicknessId) setSelectedThicknessId(data.selectedThicknessId);
        if (data.selectedPaperId) setSelectedPaperId(data.selectedPaperId);
        if (data.quantity) setQuantity(data.quantity);
        if (data.uploadedPhotos) setUploadedPhotos(data.uploadedPhotos);
        if (data.panelImages) {
          const loaded: Record<number, PanelImageState> = {};
          Object.keys(data.panelImages).forEach((k) => {
            const idx = Number(k);
            const p = data.panelImages[idx];
            loaded[idx] = {
              imageUrl: p.imageUrl || null,
              panX: p.panX || 0,
              panY: p.panY || 0,
              scale: p.scale || 1,
              rotation: p.rotation || 0,
              filter: p.filter || 'original',
              textElements: Array.isArray(p.textElements) ? p.textElements : [],
              clipartElements: Array.isArray(p.clipartElements) ? p.clipartElements : []
            };
          });
          setPanelImages((prev) => ({ ...prev, ...loaded }));
        }
      }
    } catch {
      // Safe fallback
    }
  }, [storageKey]);

  // Save current design
  const handleSaveDesign = () => {
    try {
      const stateToSave = {
        selectedProductTypeId,
        selectedSizeId,
        isCustomSize,
        customWidth,
        customHeight,
        selectedLayoutId,
        selectedHardwareId,
        selectedDisplayOptionId,
        selectedFinishId,
        selectedFrameId,
        selectedBackgroundId,
        selectedBorderWidthId,
        selectedBorderColor,
        selectedThicknessId,
        selectedPaperId,
        quantity,
        specialInstructions,
        panelImages,
        uploadedPhotos,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      setSaveToast('Customization saved successfully!');
      setTimeout(() => setSaveToast(null), 3000);
    } catch {
      setSaveToast('Could not save to browser storage.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Synchronize product type change
  const handleSelectProductType = (ptId: string) => {
    setSelectedProductTypeId(ptId);
    if (ptId === 'acrylic-photo-block') {
      setSelectedLayoutId('layout-1-single');
      setExpandedPhotoCount(1);
      setSelectedSizeId('sq-4x4');
      setIsCustomSize(false);
      setSelectedFrameId('no-frame'); // Blocks are freestanding frameless
    } else if (ptId === 'acrylic-wall-art') {
      setSelectedLayoutId('layout-3-wall');
      setExpandedPhotoCount(3);
    } else if (ptId === 'acrylic-collage') {
      setSelectedLayoutId('layout-4-grid');
      setExpandedPhotoCount(4);
    } else if (ptId === 'acrylic-split') {
      setSelectedLayoutId('layout-3-triptych');
      setExpandedPhotoCount(3);
    } else {
      setSelectedLayoutId('layout-1-single');
      setExpandedPhotoCount(1);
    }
  };

  // Layout selection (preserves existing photos)
  const handleSelectLayout = (layout: LayoutPreset) => {
    setSelectedLayoutId(layout.id);
    setExpandedPhotoCount(layout.photoCount);
    setPanelImages((prev) => {
      const next: Record<number, PanelImageState> = { ...prev };
      for (let i = 0; i < layout.frames.length; i++) {
        if (!next[i]) {
          next[i] = createDefaultPanelState();
        }
      }
      return next;
    });
    if (activePanelIndex >= layout.frames.length) {
      setActivePanelIndex(0);
      setSelectedElement({ type: 'image', panelIndex: 0 });
    }
  };

  // Template selection
  const handleSelectTemplate = (tmpl: DesignTemplate) => {
    setSelectedTemplateId(tmpl.id);
    const matchedLayout = LAYOUT_PRESETS.find((l) => l.id === tmpl.layoutId);
    if (matchedLayout) {
      handleSelectLayout(matchedLayout);
    }
    if (tmpl.borderWidth > 0) {
      setSelectedBorderWidthId(tmpl.borderWidth >= 6 ? 'medium' : 'thin');
      setSelectedBorderColor(tmpl.borderColor);
    } else {
      setSelectedBorderWidthId('none');
    }
    const bgMatch = ACRYLIC_BACKGROUNDS.find((b) => b.hex === tmpl.backgroundColor);
    if (bgMatch) {
      setSelectedBackgroundId(bgMatch.id);
    }
  };

  const handleRemoveTemplate = () => {
    setSelectedTemplateId(null);
    setSelectedBorderWidthId('none');
    setSelectedBackgroundId('transparent');
  };

  // Dimensions & Aspect
  const currentDimensions = useMemo(() => {
    if (isCustomSize) {
      return `${customHeight}" × ${customWidth}"`;
    }
    return currentSizeOption.dimensionsSummary;
  }, [isCustomSize, customHeight, customWidth, currentSizeOption]);

  const currentAspect = useMemo(() => {
    if (isCustomSize) {
      return customWidth / Math.max(1, customHeight);
    }
    return currentSizeOption.widthInches / Math.max(1, currentSizeOption.heightInches);
  }, [isCustomSize, customWidth, customHeight, currentSizeOption]);

  // Dynamic Price Calculation
  const unitPrice = useMemo(() => {
    let price = 0;
    if (isCustomSize) {
      const area = customWidth * customHeight;
      price = Math.max(99, Math.round(area * 4.2 + 150));
    } else {
      price = currentSizeOption.price;
    }

    const hw = HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
    if (hw) price += hw.price;

    const disp = DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId);
    if (disp) price += disp.price;

    const fin = FINISH_OPTIONS.find((f) => f.id === selectedFinishId);
    if (fin) price += fin.price;

    const frame = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    if (frame) price += frame.price;

    const th = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId);
    if (th) price += th.price;

    const pa = PAPER_OPTIONS.find((p) => p.id === selectedPaperId);
    if (pa) price += pa.price;

    if (selectedBorderWidthId !== 'none') {
      price += 99;
    }

    return price;
  }, [
    isCustomSize,
    customWidth,
    customHeight,
    currentSizeOption.price,
    selectedHardwareId,
    selectedDisplayOptionId,
    selectedFinishId,
    selectedFrameId,
    selectedThicknessId,
    selectedPaperId,
    selectedBorderWidthId
  ]);

  const totalPrice = unitPrice * quantity;
  const originalPrice = Math.round(totalPrice * 1.35);
  const savings = originalPrice - totalPrice;

  // Validation: Check empty frames
  const firstEmptyPanelIndex = useMemo(() => {
    for (let i = 0; i < frames.length; i++) {
      if (!panelImages[i]?.imageUrl) return i;
    }
    return -1;
  }, [frames, panelImages]);

  const isComplete = firstEmptyPanelIndex === -1;

  // Active frame helper
  const activeFrame = panelImages[activePanelIndex] || createDefaultPanelState();

  const updateFrame = (panelIdx: number, updater: (curr: PanelImageState) => PanelImageState) => {
    setPanelImages((prev) => {
      const curr = prev[panelIdx] || createDefaultPanelState();
      return {
        ...prev,
        [panelIdx]: updater(curr)
      };
    });
  };

  const updateActiveFrame = (updater: (curr: PanelImageState) => PanelImageState) => {
    updateFrame(activePanelIndex, updater);
  };

  // Image editing handlers (independent per frame)
  const handleZoomIn = () => {
    updateActiveFrame((curr) => ({
      ...curr,
      scale: Math.min(3.5, Number((curr.scale + 0.15).toFixed(2)))
    }));
  };

  const handleZoomOut = () => {
    updateActiveFrame((curr) => ({
      ...curr,
      scale: Math.max(0.5, Number((curr.scale - 0.15).toFixed(2)))
    }));
  };

  const handleRotate90 = () => {
    updateActiveFrame((curr) => ({
      ...curr,
      rotation: (curr.rotation + 90) % 360
    }));
  };

  const handleFit = () => {
    updateActiveFrame((curr) => ({
      ...curr,
      scale: 1,
      panX: 0,
      panY: 0
    }));
  };

  const handleReset = () => {
    updateActiveFrame((curr) => ({
      ...curr,
      scale: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      filter: 'original'
    }));
  };

  const handleReplaceImage = (panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    uploadTargetPanelRef.current = panelIdx;
    singleFileInputRef.current?.click();
  };

  const handleRemoveImage = (panelIdx: number) => {
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      imageUrl: null,
      panX: 0,
      panY: 0,
      scale: 1,
      rotation: 0
    }));
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
  };

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

  // Gallery files upload
  const handleGalleryUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      if (file.size > 25 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedPhotos((prev) => (prev.includes(result) ? prev : [result, ...prev]));
          if (idx === 0) {
            updateFrame(activePanelIndex, (curr) => {
              if (!curr.imageUrl) {
                return { ...curr, imageUrl: result, panX: 0, panY: 0, scale: 1, rotation: 0 };
              }
              return curr;
            });
            setValidationWarning(null);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAssignPhotoToPanel = (photoUrl: string, panelIdx: number) => {
    updateFrame(panelIdx, (curr) => ({
      ...curr,
      imageUrl: photoUrl,
      panX: 0,
      panY: 0,
      scale: 1,
      rotation: 0
    }));
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    setValidationWarning(null);
  };

  // Per-Frame Color Filter
  const handleColorFilterChange = (filterId: ColorFilterType) => {
    updateActiveFrame((curr) => ({
      ...curr,
      filter: filterId
    }));
  };

  // Text Elements
  const handleAddText = () => {
    const newText: TextElement = {
      id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      text: 'Your Text Here',
      fontFamily: 'Arial, sans-serif',
      fontSize: 24,
      color: '#FFFFFF',
      x: 0,
      y: 0,
      alignment: 'center'
    };

    updateActiveFrame((curr) => ({
      ...curr,
      textElements: [...curr.textElements, newText]
    }));

    setSelectedElement({
      type: 'text',
      panelIndex: activePanelIndex,
      elementId: newText.id
    });
  };

  const updateSelectedText = (partial: Partial<TextElement>) => {
    if (selectedElement.type !== 'text' || !selectedElement.elementId) return;
    const { panelIndex, elementId } = selectedElement;

    updateFrame(panelIndex, (curr) => ({
      ...curr,
      textElements: curr.textElements.map((t) => (t.id === elementId ? { ...t, ...partial } : t))
    }));
  };

  const handleDeleteSelectedText = () => {
    if (selectedElement.type !== 'text' || !selectedElement.elementId) return;
    const { panelIndex, elementId } = selectedElement;

    updateFrame(panelIndex, (curr) => ({
      ...curr,
      textElements: curr.textElements.filter((t) => t.id !== elementId)
    }));

    setSelectedElement({ type: 'image', panelIndex });
  };

  // Clipart Elements
  const handleAddClipart = (emoji: string) => {
    const newClipart: ClipartElement = {
      id: `clip_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      emoji,
      x: 0,
      y: 0,
      scale: 1.2,
      rotation: 0
    };

    updateActiveFrame((curr) => ({
      ...curr,
      clipartElements: [...curr.clipartElements, newClipart]
    }));

    setSelectedElement({
      type: 'clipart',
      panelIndex: activePanelIndex,
      elementId: newClipart.id
    });

    setShowClipartSelector(false);
  };

  const updateSelectedClipart = (partial: Partial<ClipartElement>) => {
    if (selectedElement.type !== 'clipart' || !selectedElement.elementId) return;
    const { panelIndex, elementId } = selectedElement;

    updateFrame(panelIndex, (curr) => ({
      ...curr,
      clipartElements: curr.clipartElements.map((c) => (c.id === elementId ? { ...c, ...partial } : c))
    }));
  };

  const handleDeleteSelectedClipart = () => {
    if (selectedElement.type !== 'clipart' || !selectedElement.elementId) return;
    const { panelIndex, elementId } = selectedElement;

    updateFrame(panelIndex, (curr) => ({
      ...curr,
      clipartElements: curr.clipartElements.filter((c) => c.id !== elementId)
    }));

    setSelectedElement({ type: 'image', panelIndex });
  };

  const handleApplyPositionPreset = (x: number, y: number) => {
    if (selectedElement.type === 'text') {
      updateSelectedText({ x, y });
    } else if (selectedElement.type === 'clipart') {
      updateSelectedClipart({ x, y });
    }
    setShowPositionPopover(false);
  };

  // Pointer drag engine
  const startImageDrag = (e: React.PointerEvent, panelIdx: number) => {
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });

    const frame = panelImages[panelIdx];
    if (!frame?.imageUrl) return;

    dragInfoRef.current = {
      active: true,
      targetType: 'image',
      panelIndex: panelIdx,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: frame.panX,
      startPanY: frame.panY,
      startPercX: 0,
      startPercY: 0,
      frameWidth: 1,
      frameHeight: 1
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const startTextDrag = (e: React.PointerEvent, panelIdx: number, textId: string, frameRect: DOMRect) => {
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'text', panelIndex: panelIdx, elementId: textId });

    const frame = panelImages[panelIdx];
    const txt = frame?.textElements.find((t) => t.id === textId);
    if (!txt) return;

    dragInfoRef.current = {
      active: true,
      targetType: 'text',
      panelIndex: panelIdx,
      elementId: textId,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: 0,
      startPanY: 0,
      startPercX: txt.x,
      startPercY: txt.y,
      frameWidth: frameRect.width || 1,
      frameHeight: frameRect.height || 1
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const startClipartDrag = (e: React.PointerEvent, panelIdx: number, clipartId: string, frameRect: DOMRect) => {
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'clipart', panelIndex: panelIdx, elementId: clipartId });

    const frame = panelImages[panelIdx];
    const clip = frame?.clipartElements.find((c) => c.id === clipartId);
    if (!clip) return;

    dragInfoRef.current = {
      active: true,
      targetType: 'clipart',
      panelIndex: panelIdx,
      elementId: clipartId,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: 0,
      startPanY: 0,
      startPercX: clip.x,
      startPercY: clip.y,
      frameWidth: frameRect.width || 1,
      frameHeight: frameRect.height || 1
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragInfoRef.current.active) return;
    const { targetType, panelIndex, elementId, startX, startY, startPanX, startPanY, startPercX, startPercY, frameWidth, frameHeight } = dragInfoRef.current;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (targetType === 'image') {
      updateFrame(panelIndex, (curr) => ({
        ...curr,
        panX: Math.max(-180, Math.min(180, startPanX + deltaX)),
        panY: Math.max(-180, Math.min(180, startPanY + deltaY))
      }));
    } else if (targetType === 'text' && elementId) {
      const deltaPercX = (deltaX / frameWidth) * 100;
      const deltaPercY = (deltaY / frameHeight) * 100;
      updateFrame(panelIndex, (curr) => ({
        ...curr,
        textElements: curr.textElements.map((t) =>
          t.id === elementId
            ? {
                ...t,
                x: Math.max(-42, Math.min(42, Number((startPercX + deltaPercX).toFixed(1)))),
                y: Math.max(-42, Math.min(42, Number((startPercY + deltaPercY).toFixed(1))))
              }
            : t
        )
      }));
    } else if (targetType === 'clipart' && elementId) {
      const deltaPercX = (deltaX / frameWidth) * 100;
      const deltaPercY = (deltaY / frameHeight) * 100;
      updateFrame(panelIndex, (curr) => ({
        ...curr,
        clipartElements: curr.clipartElements.map((c) =>
          c.id === elementId
            ? {
                ...c,
                x: Math.max(-42, Math.min(42, Number((startPercX + deltaPercX).toFixed(1)))),
                y: Math.max(-42, Math.min(42, Number((startPercY + deltaPercY).toFixed(1))))
              }
            : c
        )
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragInfoRef.current.active) {
      dragInfoRef.current.active = false;
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!isComplete) {
      const missingIdx = firstEmptyPanelIndex;
      const missingFrame = frames[missingIdx];
      const msg = `Please upload an image for ${missingFrame?.label || `Frame ${missingIdx + 1}`}.`;
      setValidationWarning(msg);
      setActivePanelIndex(missingIdx);
      setSelectedElement({ type: 'image', panelIndex: missingIdx });
      uploadTargetPanelRef.current = missingIdx;
      singleFileInputRef.current?.click();
      return;
    }

    const firstImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || catalogProduct.image;
    const borderObj = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId);
    const bgObj = ACRYLIC_BACKGROUNDS.find((b) => b.id === selectedBackgroundId);
    const frameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);

    onAddToCartCustomized({
      product: {
        ...catalogProduct,
        price: unitPrice,
        name: `${selectedProductType.name} - ${currentDimensions}`
      },
      size: currentDimensions,
      finish: FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name || 'High Gloss Clear',
      quantity,
      photoUrl: firstImage,
      calculatedPrice: totalPrice,
      material: 'Clear Optical Acrylic',
      thickness: THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId)?.label || '3mm Lightweight Cast Acrylic',
      style: currentLayout.name,
      base: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name || 'Hooks for Hanging',
      paper: PAPER_OPTIONS.find((p) => p.id === selectedPaperId)?.label || 'White Luster Photo Paper',
      customizationDetails: {
        productTypeId: selectedProductTypeId,
        productName: selectedProductType.name,
        size: currentDimensions,
        isCustomSize,
        customWidth,
        customHeight,
        layoutId: selectedLayoutId,
        layoutName: currentLayout.name,
        hardware: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.name,
        displayOption: DISPLAY_OPTIONS.find((d) => d.id === selectedDisplayOptionId)?.name,
        finish: FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name,
        frame: frameObj?.name,
        border: borderObj?.label,
        borderColor: selectedBorderColor,
        background: bgObj?.label,
        specialInstructions,
        panels: frames.map((f, idx) => ({
          label: f.label,
          dimension: f.dimension,
          imageUrl: panelImages[idx]?.imageUrl || null,
          scale: panelImages[idx]?.scale || 1,
          rotation: panelImages[idx]?.rotation || 0,
          panX: panelImages[idx]?.panX || 0,
          panY: panelImages[idx]?.panY || 0,
          filter: panelImages[idx]?.filter || 'original',
          textElements: panelImages[idx]?.textElements || [],
          clipartElements: panelImages[idx]?.clipartElements || []
        })),
        unitPrice,
        totalPrice
      }
    });

    navigate('/cart');
  };

  // Selected frame styling for outer canvas
  const activeFrameOption = useMemo(() => {
    return FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];
  }, [selectedFrameId]);

  // Render a Single Acrylic Frame within the workspace
  const renderFrame = (panelIdx: number, aspectClass: string, dimensionLabel?: string) => {
    const frame = panelImages[panelIdx] || createDefaultPanelState();
    const isActive = activePanelIndex === panelIdx;
    const isTargetEmpty = !frame.imageUrl;
    const frameInfo = frames[panelIdx];
    const label = dimensionLabel || frameInfo?.dimension || `Frame ${panelIdx + 1}`;

    // Filter CSS
    const filterCss = 
      frame.filter === 'sepia'
        ? 'sepia(0.85) contrast(1.1) brightness(0.95)'
        : frame.filter === 'grayscale'
        ? 'grayscale(100%) contrast(1.05)'
        : 'none';

    // Border style
    const borderWidthPx = ACRYLIC_BORDER_WIDTHS.find((b) => b.id === selectedBorderWidthId)?.widthPx || 0;

    return (
      <div
        key={panelIdx}
        onClick={(e) => {
          e.stopPropagation();
          setActivePanelIndex(panelIdx);
          setSelectedElement({ type: 'image', panelIndex: panelIdx });
          if (isTargetEmpty) {
            handleEmptyFrameClick(panelIdx);
          }
        }}
        className={`acrylic-frame-container relative w-full ${aspectClass} bg-white rounded-xl overflow-hidden transition-all select-none border-2 ${
          isActive
            ? 'border-[#0E4A93] shadow-2xl ring-4 ring-[#0E4A93]/30 z-20'
            : 'border-stone-300 shadow-md hover:border-stone-400 z-10'
        } ${isTargetEmpty ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
        style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
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
              border: `${borderWidthPx}px solid ${selectedBorderColor}`
            }}
          />
        )}

        {/* Architectural Chrome Standoff Bolts */}
        {(selectedHardwareId === 'standoff-mounts' || selectedProductTypeId === 'acrylic-signage' || selectedDisplayOptionId === 'display-standoff') && (
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

        {/* Frame Label Badge (Frame Number) */}
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

        {/* Frame Content */}
        {frame.imageUrl ? (
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
            onPointerDown={(e) => startImageDrag(e, panelIdx)}
          >
            <img
              src={frame.imageUrl}
              alt={label}
              draggable={false}
              style={{
                transform: `translate(${frame.panX}px, ${frame.panY}px) scale(${frame.scale}) rotate(${frame.rotation}deg)`,
                filter: filterCss,
                transition: isDragging ? 'none' : 'transform 0.12s ease-out'
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
                    textAlign: txt.alignment
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
          /* ============================================================= */
          /* STRICTLY MINIMAL EMPTY FRAME: ONLY THE UPLOAD ICON (Rule 15)  */
          /* ============================================================= */
          <div 
            className="w-full h-full flex items-center justify-center bg-stone-50/70 hover:bg-stone-100/90 transition-colors cursor-pointer group"
            title="Click to upload photo for this frame"
          >
            <div className="w-11 h-11 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-[#0E4A93] group-hover:border-[#0E4A93]/40 group-hover:scale-110 transition-all">
              <Upload className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
        )}
      </div>
    );
  };

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

      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER BAR                                                      */}
      {/* ------------------------------------------------------------------- */}
      <header className="h-14 bg-[#0E4A93] text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/acrylic"
            className="flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Acrylic Products</span>
          </Link>
          <div className="h-4 w-px bg-white/30 hidden sm:block" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-300 hidden md:inline">
            ACRYLIC CUSTOMIZER
          </span>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <CanvasIndiaLogo className="h-7 w-auto" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleSaveDesign}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRoomView(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Room View</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E8752A] hover:bg-[#d6651d] text-white rounded-lg text-xs font-black transition-all shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTAINER: LEFT TOOLBAR + IMAGE-BASED CONFIG PANEL + WORKSPACE */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* ----------------------------------------------------------------- */}
        {/* COLUMN 1: LEFT VERTICAL TOOLBAR (6 TABS)                          */}
        {/* ----------------------------------------------------------------- */}
        <nav 
          aria-label="Customizer Tools"
          className="bg-[#2D2D2D] text-stone-300 w-full md:w-20 md:min-w-[80px] shrink-0 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-2 z-20 border-r border-stone-700 overflow-x-auto scrollbar-none"
        >
          {[
            { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
            { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
            { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Crop },
            { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Grid },
            { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: Layers },
            { id: 'OPTIONS', label: 'OPTIONS', icon: SlidersHorizontal }
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as ToolbarTab)}
                className={`flex flex-col items-center justify-center w-full py-3 px-1 text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0E4A93] shadow-md font-extrabold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#0E4A93]' : 'text-stone-300'}`} />
                <span className="text-[9px] leading-tight tracking-tight uppercase px-0.5 text-center font-bold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ----------------------------------------------------------------- */}
        {/* COLUMN 2: IMAGE-BASED CONFIGURATION PANEL                         */}
        {/* ----------------------------------------------------------------- */}
        <aside className="w-full md:w-[380px] lg:w-[410px] bg-white shrink-0 border-r border-stone-200 flex flex-col h-[340px] md:h-full overflow-y-auto shadow-sm z-10">
          
          {/* TAB 1: PRODUCTS (Image-First Option Cards) */}
          {activeTab === 'PRODUCTS' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0E4A93]">
                    Acrylic Collection
                  </span>
                  <p className="text-[11px] text-stone-500">
                    High definition direct UV optical printing
                  </p>
                </div>
                <span className="text-[10px] bg-blue-50 text-[#0E4A93] font-black px-2.5 py-0.5 rounded-full border border-blue-200/80">
                  OPTICAL GLASS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                      <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden relative">
                        <img 
                          src={pt.image} 
                          alt={pt.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/acrylic/acrylic-fallback.jpg';
                          }}
                        />
                      </div>

                      <div className="p-2.5 bg-white border-t border-stone-100">
                        <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                          {pt.name}
                        </div>
                        <div className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                          Starts at ₹{pt.startingPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="p-4 space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-900">
                  Upload Photos
                </h3>
                <p className="text-xs text-stone-500">
                  Select high-resolution images (PNG, JPG, WEBP up to 25MB).
                </p>
              </div>

              {/* Target Frame Pill Selector */}
              {frames.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Assigning Photo to Frame:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {frames.map((f, idx) => {
                      const isSelected = activePanelIndex === idx;
                      const hasPhoto = Boolean(panelImages[idx]?.imageUrl);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setActivePanelIndex(idx);
                            setSelectedElement({ type: 'image', panelIndex: idx });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0E4A93] text-white shadow-xs'
                              : hasPhoto
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          <span>{f.label}</span>
                          {hasPhoto && <Check className="w-3 h-3 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleGalleryUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-[#E8752A] bg-stone-50 hover:bg-orange-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto text-[#E8752A] group-hover:scale-110 transition-transform mb-3">
                  <UploadCloud className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="text-xs font-black text-stone-900">
                  UPLOAD AN IMAGE
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  Drag and drop here, or click to browse files
                </div>
                <div className="text-[10px] text-stone-400 mt-2 font-medium">
                  Max file size: 25MB (JPG, PNG, WEBP)
                </div>
              </div>

              {/* Uploaded Gallery Thumbnails */}
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
                          <span className="text-[10px] text-white font-bold bg-[#0E4A93] px-2 py-0.5 rounded">
                            Apply
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SELECT SIZE (Image-Based Aspect Ratio Cards) */}
          {activeTab === 'SELECT SIZE' && (
            <div className="p-4 space-y-5">
              
              {/* Category Filter Pills */}
              <div className="flex items-center border-b border-stone-200 overflow-x-auto scrollbar-none pb-1 gap-1">
                {(['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE', 'SMALL'] as SizeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSizeCategory(cat);
                      setIsCustomSize(false);
                    }}
                    className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      sizeCategory === cat && !isCustomSize
                        ? 'bg-[#0E4A93] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Size Cards Grid with Visual Aspect Ratio Graphics */}
              <div className="grid grid-cols-2 gap-3">
                {filteredSizes.map((sz) => {
                  const isSelected = !isCustomSize && selectedSizeId === sz.id;
                  return (
                    <div
                      key={sz.id}
                      onClick={() => {
                        setSelectedSizeId(sz.id);
                        setIsCustomSize(false);
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

                      <div className="aspect-[4/3] w-full bg-stone-50 overflow-hidden flex items-center justify-center p-2 border-b border-stone-100">
                        <img 
                          src={sz.image} 
                          alt={sz.label} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                        />
                      </div>

                      <div className="p-2.5 bg-white">
                        <div className="text-xs font-bold text-stone-900 leading-tight">
                          {sz.label}
                        </div>
                        <div className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                          ₹{sz.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Size Section */}
              <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-stone-800 text-center">
                  Custom Size (H × W inches)
                </div>

                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <select
                      value={customHeight}
                      onChange={(e) => {
                        setCustomHeight(Number(e.target.value));
                        setIsCustomSize(true);
                      }}
                      className="pl-3 pr-7 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 appearance-none focus:outline-none focus:border-[#0E4A93] cursor-pointer"
                    >
                      {[4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 40, 48].map((val) => (
                        <option key={val} value={val}>{val}"</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <span className="text-xs font-bold text-stone-500">×</span>

                  <div className="relative">
                    <select
                      value={customWidth}
                      onChange={(e) => {
                        setCustomWidth(Number(e.target.value));
                        setIsCustomSize(true);
                      }}
                      className="pl-3 pr-7 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 appearance-none focus:outline-none focus:border-[#0E4A93] cursor-pointer"
                    >
                      {[4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 36, 40, 48].map((val) => (
                        <option key={val} value={val}>{val}"</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="text-sm font-black text-red-600 ml-2">
                    ₹{Math.max(99, Math.round(customWidth * customHeight * 4.2 + 150)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomSize(true)}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isCustomSize
                      ? 'bg-[#0E4A93] text-white shadow-xs'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {isCustomSize ? 'Custom Size Active' : 'Apply Custom Size'}
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: LAYOUTS & DESIGNS (Visual Layout Option Cards) */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="p-4 space-y-4">
              
              {/* Reset Template Button */}
              {selectedTemplateId && (
                <button
                  type="button"
                  onClick={handleRemoveTemplate}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Design/Template</span>
                </button>
              )}

              {/* Sub-Tabs: DESIGNS vs LAYOUTS */}
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

              {/* LAYOUTS SUB-TAB */}
              {layoutSubTab === 'LAYOUTS' && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((count) => {
                    const isExpanded = expandedPhotoCount === count;
                    const matchingLayouts = LAYOUT_PRESETS.filter((l) => l.photoCount === count);

                    return (
                      <div key={count} className="border border-stone-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedPhotoCount(isExpanded ? null : count)}
                          className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 text-xs font-black text-stone-800 transition-colors cursor-pointer"
                        >
                          <span>{count} {count === 1 ? 'Photo' : 'Photos'}</span>
                          <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="p-3 grid grid-cols-2 gap-2.5 bg-white border-t border-stone-100">
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

                                  {/* Visual Diagram Representation */}
                                  <div className="aspect-[4/3] w-full bg-stone-50 border-b border-stone-100 p-2.5 flex items-center justify-center">
                                    <div className="w-full h-full bg-stone-200/80 rounded p-1 flex items-center justify-center">
                                      {layout.layoutType === '1-single' && (
                                        <div className="w-full h-full bg-[#0E4A93]/40 rounded-xs" />
                                      )}
                                      {layout.layoutType === '2-vertical' && (
                                        <div className="w-full h-full flex gap-1">
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                      {layout.layoutType === '2-horizontal' && (
                                        <div className="w-full h-full flex flex-col gap-1">
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                      {layout.layoutType === '2-offset' && (
                                        <div className="w-full h-full relative">
                                          <div className="w-7 h-5 bg-[#0E4A93]/40 rounded-xs absolute top-0 left-0" />
                                          <div className="w-7 h-5 bg-[#0E4A93]/40 rounded-xs absolute bottom-0 right-0" />
                                        </div>
                                      )}
                                      {layout.layoutType === '3-wall' && (
                                        <div className="w-full h-full flex flex-col gap-0.5">
                                          <div className="w-full h-4 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="w-full h-3 flex gap-0.5">
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          </div>
                                        </div>
                                      )}
                                      {layout.layoutType === '3-triptych' && (
                                        <div className="w-full h-full flex gap-0.5">
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                      {layout.layoutType === '3-split-left' && (
                                        <div className="w-full h-full flex gap-0.5">
                                          <div className="w-6 h-full bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 flex flex-col gap-0.5">
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          </div>
                                        </div>
                                      )}
                                      {layout.layoutType === '4-grid' && (
                                        <div className="w-full h-full grid grid-cols-2 gap-0.5">
                                          <div className="bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                      {layout.layoutType === '4-hero-right' && (
                                        <div className="w-full h-full flex gap-0.5">
                                          <div className="w-7 h-full bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 flex flex-col gap-0.5">
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                            <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          </div>
                                        </div>
                                      )}
                                      {layout.layoutType === '4-strips-h' && (
                                        <div className="w-full h-full flex flex-col gap-0.5">
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                      {layout.layoutType === '4-strips-v' && (
                                        <div className="w-full h-full flex gap-0.5">
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                          <div className="flex-1 bg-[#0E4A93]/40 rounded-xs" />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="p-2 bg-white text-center">
                                    <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                                      {layout.name}
                                    </div>
                                    <div className="text-[10px] text-stone-500 mt-0.5">
                                      {layout.description}
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

              {/* DESIGNS SUB-TAB */}
              {layoutSubTab === 'DESIGNS' && (
                <div className="grid grid-cols-2 gap-3">
                  {DESIGN_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
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

                        <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden relative">
                          <img 
                            src={tmpl.image} 
                            alt={tmpl.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
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

          {/* TAB 5: HARDWARE & FINISH (Image-Based Cards) */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="p-4 space-y-6">
              
              {/* Hardware Option & Style */}
              <div className="space-y-3">
                <div className="bg-stone-800 text-white text-xs font-black uppercase py-1.5 px-3 rounded-lg tracking-wider">
                  Hardware Option &amp; Style
                </div>

                <div className="grid grid-cols-2 gap-3">
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

                        <div className="aspect-[4/3] w-full bg-stone-50 overflow-hidden flex items-center justify-center p-2 border-b border-stone-100">
                          <img 
                            src={hw.image} 
                            alt={hw.name} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2.5 bg-white">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {hw.name}
                          </div>
                          <div className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                            {hw.price === 0 ? 'Free' : `₹${hw.price.toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Acrylic Edge & Surface Finish */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="bg-stone-800 text-white text-xs font-black uppercase py-1.5 px-3 rounded-lg tracking-wider">
                  Acrylic Edge &amp; Surface Finish
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {FINISH_OPTIONS.map((finish) => {
                    const isSelected = selectedFinishId === finish.id;
                    return (
                      <div
                        key={finish.id}
                        onClick={() => setSelectedFinishId(finish.id)}
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

                        <div className="aspect-[4/3] w-full bg-stone-900 overflow-hidden flex items-center justify-center border-b border-stone-100">
                          <img 
                            src={finish.image} 
                            alt={finish.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2.5 bg-white">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {finish.name}
                          </div>
                          <div className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                            {finish.price === 0 ? 'Included' : `+₹${finish.price.toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optional Color Finishing (Filters on User's Active Uploaded Image) */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="bg-stone-800 text-white text-xs font-black uppercase py-1.5 px-3 rounded-lg flex items-center justify-between tracking-wider">
                  <span>Optional Color Finishing</span>
                  <span className="text-[10px] text-amber-300 font-bold capitalize">
                    Frame {activePanelIndex + 1}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {COLOR_FINISH_OPTIONS.map((fOpt) => {
                    const isSelected = activeFrame.filter === fOpt.id;
                    const sampleSource = activeFrame.imageUrl || uploadedPhotos[0] || fOpt.defaultImg;
                    return (
                      <div
                        key={fOpt.id}
                        onClick={() => handleColorFilterChange(fOpt.id)}
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

                        <div className="aspect-square w-full bg-stone-100 overflow-hidden">
                          <img
                            src={sampleSource}
                            alt={fOpt.label}
                            style={{ filter: fOpt.cssFilter }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="p-2 bg-white text-center border-t border-stone-100">
                          <div className="text-[11px] font-bold text-stone-900 leading-tight">
                            {fOpt.label}
                          </div>
                          <div className="text-[10px] font-black text-emerald-600 mt-0.5">
                            {fOpt.tag}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: OPTIONS (Frame Options, Backing, Thickness, Paper, Notes) */}
          {activeTab === 'OPTIONS' && (
            <div className="p-4 space-y-6">
              
              {/* Acrylic Framing Option Cards (Prompt Section 9) */}
              <div className="space-y-3">
                <div className="bg-stone-800 text-white text-xs font-black uppercase py-1.5 px-3 rounded-lg tracking-wider">
                  Frame Options
                </div>

                <div className="grid grid-cols-2 gap-3">
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

                        <div className="aspect-[4/3] w-full bg-stone-50 overflow-hidden flex items-center justify-center border-b border-stone-100">
                          <img 
                            src={frm.image} 
                            alt={frm.name} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        </div>

                        <div className="p-2.5 bg-white">
                          <div className="text-xs font-bold text-stone-900 leading-tight truncate">
                            {frm.name}
                          </div>
                          <div className="text-[11px] font-black text-[#0E4A93] mt-0.5">
                            {frm.price === 0 ? 'Free' : `+₹${frm.price.toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sheet Thickness */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Acrylic Sheet Thickness:
                </label>
                <div className="space-y-1.5">
                  {THICKNESS_OPTIONS.map((th) => {
                    const isSelected = selectedThicknessId === th.id;
                    return (
                      <div
                        key={th.id}
                        onClick={() => setSelectedThicknessId(th.id)}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/20 text-[#0E4A93]'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span>{th.label}</span>
                        <span>{th.price === 0 ? 'Standard' : `+₹${th.price.toFixed(2)}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-surface Photo Paper */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Sub-surface Photo Paper:
                </label>
                <div className="space-y-1.5">
                  {PAPER_OPTIONS.map((pa) => {
                    const isSelected = selectedPaperId === pa.id;
                    return (
                      <div
                        key={pa.id}
                        onClick={() => setSelectedPaperId(pa.id)}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/20 text-[#0E4A93]'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span>{pa.label}</span>
                        <span>{pa.price === 0 ? 'Included' : `+₹${pa.price.toFixed(2)}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Special Instructions:
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Optional custom instructions for our lab..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#0E4A93] resize-none"
                />
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-2 text-stone-600 hover:text-stone-950 font-black cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-xs font-bold text-stone-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
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

        {/* ----------------------------------------------------------------- */}
        {/* COLUMN 3: MAIN DESIGN WORKSPACE                                   */}
        {/* ----------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden">
          
          {/* Graph Grid Pattern Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Validation Alert Warning */}
          {validationWarning && (
            <div className="w-full bg-amber-500 text-white text-xs font-bold py-2 px-4 flex items-center justify-between shadow-md z-30 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-white" />
                <span>{validationWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationWarning(null)}
                className="p-1 hover:bg-amber-600 rounded text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Instruction Banner */}
          <div className="w-full bg-[#FEF08A] text-stone-900 text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 border-b border-amber-300 shadow-xs z-10">
            <Move className="w-3.5 h-3.5 text-stone-900" />
            <span>Click and drag within the print lines to Adjust your Photo, or click empty frames to upload.</span>
          </div>

          {/* Top-Right Workspace Action Buttons: SAVE | ADD TEXT | ADD CLIPART */}
          <div className="absolute top-10 right-4 flex items-center gap-2 z-20">
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
              onClick={handleAddText}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 rounded-lg text-xs font-bold shadow-xs border border-stone-200 transition-all cursor-pointer"
              title="Add text to active frame"
            >
              <Type className="w-3.5 h-3.5 text-[#0E4A93]" />
              <span>ADD TEXT</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClipartSelector(!showClipartSelector)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-all cursor-pointer ${
                showClipartSelector
                  ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                  : 'bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200'
              }`}
              title="Add clipart sticker to active frame"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>ADD CLIPART</span>
            </button>
          </div>

          {/* Clipart Picker Popover */}
          {showClipartSelector && (
            <div className="absolute top-20 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>Add Clipart to Frame {activePanelIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => setShowClipartSelector(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clipart Category Selector */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {Object.keys(CLIPART_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedClipartCategory(cat)}
                    className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap ${
                      selectedClipartCategory === cat
                        ? 'bg-[#0E4A93] text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Clipart Items Grid */}
              <div className="grid grid-cols-4 gap-2 text-2xl text-center max-h-48 overflow-y-auto p-1">
                {(CLIPART_CATEGORIES[selectedClipartCategory] || []).map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddClipart(item)}
                    className="p-2 rounded-xl border border-stone-100 bg-stone-50 hover:bg-blue-50 hover:border-[#0E4A93] hover:scale-110 transition-transform cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save Toast */}
          {saveToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-30 animate-in fade-in slide-in-from-top-2">
              {saveToast}
            </div>
          )}

          {/* Center Stage / Interactive Canvas Area */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Side Navigation Chevron: < SELECT SIZE */}
            <button
              type="button"
              onClick={() => setActiveTab('SELECT SIZE')}
              className="hidden lg:flex flex-col items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all cursor-pointer group z-20"
            >
              <ChevronLeft className="w-5 h-5 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5">SELECT SIZE</span>
            </button>

            {/* Side Navigation Chevron: HARDWARE & FINISH > */}
            <button
              type="button"
              onClick={() => setActiveTab('HARDWARE & FINISH')}
              className="hidden lg:flex flex-col items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all cursor-pointer group z-20"
            >
              <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5">HARDWARE &amp; FINISH</span>
            </button>

            {/* Canvas Outer Boundary with Dimension Lines */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full">
              
              {/* Top Dimension Guide Line */}
              <div className="w-full flex items-center justify-center mb-2 pointer-events-none">
                <div className="w-full flex items-center">
                  <div className="w-2 h-2 border-l border-t border-stone-400" />
                  <div className="flex-1 border-t border-dashed border-stone-400" />
                  <span className="mx-2 px-2 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold text-stone-600 shadow-xs">
                    {isCustomSize ? `${customWidth} inch` : `${currentSizeOption.widthInches} inch`}
                  </span>
                  <div className="flex-1 border-t border-dashed border-stone-400" />
                  <div className="w-2 h-2 border-r border-t border-stone-400" />
                </div>
              </div>

              {/* Dynamic Frame Layout Renderer (with optional outer physical frame) */}
              <div 
                className="w-full flex justify-center relative p-1 transition-all rounded-2xl"
                style={{
                  border: activeFrameOption.id !== 'no-frame' ? activeFrameOption.borderCss : 'none',
                  boxShadow: activeFrameOption.id !== 'no-frame' ? '0 25px 35px -5px rgba(0, 0, 0, 0.25)' : 'none'
                }}
              >
                
                {/* 1 Photo Single */}
                {currentLayout.layoutType === '1-single' && (
                  <div 
                    className="w-full max-w-md flex justify-center"
                    style={{ aspectRatio: currentAspect }}
                  >
                    {renderFrame(0, 'w-full h-full', currentDimensions)}
                  </div>
                )}

                {/* 2 Photos Vertical Columns */}
                {currentLayout.layoutType === '2-vertical' && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-lg aspect-[16/10]">
                    {renderFrame(0, 'h-full w-full', 'Left Frame')}
                    {renderFrame(1, 'h-full w-full', 'Right Frame')}
                  </div>
                )}

                {/* 2 Photos Horizontal Rows */}
                {currentLayout.layoutType === '2-horizontal' && (
                  <div className="grid grid-rows-2 gap-3 w-full max-w-md aspect-[10/14]">
                    {renderFrame(0, 'h-full w-full', 'Top Frame')}
                    {renderFrame(1, 'h-full w-full', 'Bottom Frame')}
                  </div>
                )}

                {/* 2 Photos Offset / Staggered */}
                {currentLayout.layoutType === '2-offset' && (
                  <div className="grid grid-cols-2 gap-4 w-full max-w-lg aspect-[16/11] items-center">
                    <div className="-translate-y-3">
                      {renderFrame(0, 'aspect-square w-full', 'Frame 1 (Upper)')}
                    </div>
                    <div className="translate-y-3">
                      {renderFrame(1, 'aspect-square w-full', 'Frame 2 (Lower)')}
                    </div>
                  </div>
                )}

                {/* 3 Photos Wall Art Trio */}
                {currentLayout.layoutType === '3-wall' && (
                  <div className="flex flex-col items-center gap-3 w-full max-w-lg">
                    {renderFrame(0, 'aspect-[18/12] w-full', 'Top Hero 12" × 18"')}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {renderFrame(1, 'aspect-[8/10] w-full', 'Bottom Left 10" × 8"')}
                      {renderFrame(2, 'aspect-[8/10] w-full', 'Bottom Right 10" × 8"')}
                    </div>
                  </div>
                )}

                {/* 3 Photos Triptych Split */}
                {currentLayout.layoutType === '3-triptych' && (
                  <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg aspect-[36/24]">
                    {renderFrame(0, 'h-full w-full', 'Panel 1')}
                    {renderFrame(1, 'h-full w-full', 'Panel 2')}
                    {renderFrame(2, 'h-full w-full', 'Panel 3')}
                  </div>
                )}

                {/* 3 Photos Split Left */}
                {currentLayout.layoutType === '3-split-left' && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-lg aspect-[16/10]">
                    {renderFrame(0, 'h-full w-full', 'Hero Left')}
                    <div className="grid grid-rows-2 gap-2 h-full">
                      {renderFrame(1, 'h-full w-full', 'Top Right')}
                      {renderFrame(2, 'h-full w-full', 'Bottom Right')}
                    </div>
                  </div>
                )}

                {/* 4 Photos Grid */}
                {currentLayout.layoutType === '4-grid' && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm aspect-square">
                    {renderFrame(0, 'aspect-square w-full', 'Top Left')}
                    {renderFrame(1, 'aspect-square w-full', 'Top Right')}
                    {renderFrame(2, 'aspect-square w-full', 'Bottom Left')}
                    {renderFrame(3, 'aspect-square w-full', 'Bottom Right')}
                  </div>
                )}

                {/* 4 Photos Hero Right */}
                {currentLayout.layoutType === '4-hero-right' && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-lg aspect-[16/10]">
                    {renderFrame(0, 'h-full w-full', 'Hero Left')}
                    <div className="grid grid-rows-3 gap-1.5 h-full">
                      {renderFrame(1, 'h-full w-full', 'Mini 1')}
                      {renderFrame(2, 'h-full w-full', 'Mini 2')}
                      {renderFrame(3, 'h-full w-full', 'Mini 3')}
                    </div>
                  </div>
                )}

                {/* 4 Photos Horizontal Strips */}
                {currentLayout.layoutType === '4-strips-h' && (
                  <div className="grid grid-rows-4 gap-2 w-full max-w-md aspect-[10/12]">
                    {renderFrame(0, 'h-full w-full', 'Strip 1')}
                    {renderFrame(1, 'h-full w-full', 'Strip 2')}
                    {renderFrame(2, 'h-full w-full', 'Strip 3')}
                    {renderFrame(3, 'h-full w-full', 'Strip 4')}
                  </div>
                )}

                {/* 4 Photos Vertical Columns */}
                {currentLayout.layoutType === '4-strips-v' && (
                  <div className="grid grid-cols-4 gap-2 w-full max-w-lg aspect-[16/10]">
                    {renderFrame(0, 'h-full w-full', 'Col 1')}
                    {renderFrame(1, 'h-full w-full', 'Col 2')}
                    {renderFrame(2, 'h-full w-full', 'Col 3')}
                    {renderFrame(3, 'h-full w-full', 'Col 4')}
                  </div>
                )}

              </div>

              {/* Multi-Frame Target Selector Pills */}
              {frames.length > 1 && (
                <div className="flex items-center gap-1.5 mt-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs flex-wrap justify-center">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase px-1">Active Frame:</span>
                  {frames.map((f, idx) => {
                    const isFilled = !!panelImages[idx]?.imageUrl;
                    const isSelected = activePanelIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActivePanelIndex(idx);
                          setSelectedElement({ type: 'image', panelIndex: idx });
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0E4A93] text-white shadow-xs'
                            : isFilled
                            ? 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                            : 'bg-orange-50 text-[#E8752A] border border-orange-200 hover:bg-orange-100'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isSelected ? '#FFFFFF' : isFilled ? '#0E4A93' : '#E8752A' }}
                        />
                        <span>{f.label || `Frame ${idx + 1}`}</span>
                        {isFilled ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <span className="text-[10px] font-bold opacity-80">(Empty)</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* CONTEXTUAL TOOLBAR BASED ON SELECTION */}
              <div className="w-full max-w-xl flex flex-col items-center gap-2 mt-3 z-20">
                
                {/* 1. IMAGE CONTROLS (When Image is Selected) */}
                {selectedElement.type === 'image' && activeFrame.imageUrl && (
                  <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-stone-200 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Zoom Out (-15%)"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-bold text-stone-700 min-w-[36px] text-center">
                        {Math.round(activeFrame.scale * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Zoom In (+15%)"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="h-4 w-px bg-stone-300" />

                    <button
                      type="button"
                      onClick={handleRotate90}
                      className="flex items-center gap-1 p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors font-bold cursor-pointer"
                      title="Rotate 90 degrees"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFit}
                      className="flex items-center gap-1 p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors font-bold cursor-pointer"
                      title="Fit to frame"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Fit</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1 p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors font-bold cursor-pointer"
                      title="Reset image position and zoom"
                    >
                      <span>Reset</span>
                    </button>

                    <div className="h-4 w-px bg-stone-300" />

                    <button
                      type="button"
                      onClick={() => handleReplaceImage(activePanelIndex)}
                      className="flex items-center gap-1 p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors font-bold cursor-pointer"
                      title="Replace photo for this frame"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(activePanelIndex)}
                      className="flex items-center gap-1 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-bold cursor-pointer"
                      title="Delete photo from this frame"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}

                {/* 2. TEXT CONTROLS & VISUAL TYPOGRAPHY CARDS (When Text is Selected) */}
                {selectedElement.type === 'text' && selectedElement.elementId && (
                  <div className="w-full bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200 text-xs space-y-2 animate-in fade-in">
                    
                    {/* Visual Typography Font Cards (Section 13) */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-stone-600">Select Typography Style:</div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {TYPOGRAPHY_OPTIONS.map((typo) => {
                          const isCurrentFont = activeFrame.textElements.find((t) => t.id === selectedElement.elementId)?.fontFamily === typo.fontFamily;
                          return (
                            <button
                              key={typo.id}
                              type="button"
                              onClick={() => updateSelectedText({ fontFamily: typo.fontFamily })}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                isCurrentFont
                                  ? 'border-[#0E4A93] bg-blue-50 text-[#0E4A93] font-bold shadow-xs'
                                  : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                              }`}
                            >
                              <div className="text-base leading-none mb-0.5" style={{ fontFamily: typo.fontFamily }}>
                                {typo.previewSample}
                              </div>
                              <div className="text-[9px] truncate">{typo.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
                      {/* Text Input */}
                      <input
                        type="text"
                        value={activeFrame.textElements.find((t) => t.id === selectedElement.elementId)?.text || ''}
                        onChange={(e) => updateSelectedText({ text: e.target.value })}
                        className="px-2 py-1 border border-stone-300 rounded text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] flex-1 min-w-[120px]"
                        placeholder="Enter text..."
                      />

                      {/* Text Size Stepper */}
                      <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                        <button
                          type="button"
                          onClick={() => {
                            const curr = activeFrame.textElements.find((t) => t.id === selectedElement.elementId);
                            if (curr) updateSelectedText({ fontSize: Math.max(12, curr.fontSize - 2) });
                          }}
                          className="px-1.5 py-0.5 font-bold"
                        >
                          −
                        </button>
                        <span className="px-1 text-[11px] font-bold">
                          {activeFrame.textElements.find((t) => t.id === selectedElement.elementId)?.fontSize || 24}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const curr = activeFrame.textElements.find((t) => t.id === selectedElement.elementId);
                            if (curr) updateSelectedText({ fontSize: Math.min(48, curr.fontSize + 2) });
                          }}
                          className="px-1.5 py-0.5 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex gap-1">
                        {TEXT_COLOR_PRESETS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => updateSelectedText({ color: c.hex })}
                            className="w-4 h-4 rounded-full border border-stone-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>

                      {/* Position Presets Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPositionPopover(!showPositionPopover)}
                          className="p-1 text-stone-700 hover:bg-stone-100 rounded font-bold border border-stone-200"
                        >
                          Position
                        </button>

                        {showPositionPopover && (
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-stone-200 p-2 grid grid-cols-3 gap-1 z-40">
                            {POSITION_PRESETS.map((pos) => (
                              <button
                                key={pos.label}
                                type="button"
                                onClick={() => handleApplyPositionPreset(pos.x, pos.y)}
                                className="px-2 py-1 bg-stone-100 hover:bg-[#0E4A93] hover:text-white rounded text-[10px] font-bold transition-colors"
                                title={pos.title}
                              >
                                {pos.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete Text */}
                      <button
                        type="button"
                        onClick={handleDeleteSelectedText}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Text"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. CLIPART CONTROLS (When Clipart is Selected) */}
                {selectedElement.type === 'clipart' && selectedElement.elementId && (
                  <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-stone-200 text-xs animate-in fade-in">
                    <span className="text-xl">
                      {activeFrame.clipartElements.find((c) => c.id === selectedElement.elementId)?.emoji}
                    </span>

                    {/* Scale Stepper */}
                    <div className="flex items-center border border-stone-300 rounded bg-stone-50">
                      <button
                        type="button"
                        onClick={() => {
                          const curr = activeFrame.clipartElements.find((c) => c.id === selectedElement.elementId);
                          if (curr) updateSelectedClipart({ scale: Math.max(0.6, Number((curr.scale - 0.2).toFixed(1))) });
                        }}
                        className="px-1.5 py-0.5 font-bold"
                      >
                        −
                      </button>
                      <span className="px-1.5 text-[11px] font-bold">
                        {activeFrame.clipartElements.find((c) => c.id === selectedElement.elementId)?.scale || 1}x
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = activeFrame.clipartElements.find((c) => c.id === selectedElement.elementId);
                          if (curr) updateSelectedClipart({ scale: Math.min(2.5, Number((curr.scale + 0.2).toFixed(1))) });
                        }}
                        className="px-1.5 py-0.5 font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Rotate Clipart */}
                    <button
                      type="button"
                      onClick={() => {
                        const curr = activeFrame.clipartElements.find((c) => c.id === selectedElement.elementId);
                        if (curr) updateSelectedClipart({ rotation: (curr.rotation + 90) % 360 });
                      }}
                      className="flex items-center gap-1 p-1 text-stone-700 hover:bg-stone-100 rounded font-bold border border-stone-200"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate</span>
                    </button>

                    {/* Position Presets Toggle */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPositionPopover(!showPositionPopover)}
                        className="p-1 text-stone-700 hover:bg-stone-100 rounded font-bold border border-stone-200"
                      >
                        Position
                      </button>

                      {showPositionPopover && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-stone-200 p-2 grid grid-cols-3 gap-1 z-40">
                          {POSITION_PRESETS.map((pos) => (
                            <button
                              key={pos.label}
                              type="button"
                              onClick={() => handleApplyPositionPreset(pos.x, pos.y)}
                              className="px-2 py-1 bg-stone-100 hover:bg-[#0E4A93] hover:text-white rounded text-[10px] font-bold transition-colors"
                              title={pos.title}
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Clipart */}
                    <button
                      type="button"
                      onClick={handleDeleteSelectedClipart}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Clipart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>

        </main>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* BOTTOM CHECKOUT BAR                                                 */}
      {/* ------------------------------------------------------------------- */}
      <footer className="h-16 bg-white border-t border-stone-200 px-4 sm:px-8 flex items-center justify-between shadow-lg z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-stone-900">
                ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                Save ₹{savings.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 truncate max-w-xs sm:max-w-md">
              {selectedProductType.name} • {currentDimensions} • {FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name} • Qty: {quantity}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E8752A] hover:bg-[#d6651d] text-white rounded-xl text-sm font-black transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>ADD TO CART</span>
          </button>
        </div>
      </footer>

      {/* ------------------------------------------------------------------- */}
      {/* REALISTIC ROOM VIEW MODAL                                           */}
      {/* ------------------------------------------------------------------- */}
      {showRoomView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black uppercase text-[#0E4A93]">Realistic Room Preview</span>
                <div className="flex gap-1">
                  {(['living', 'office', 'gallery'] as const).map((rm) => (
                    <button
                      key={rm}
                      type="button"
                      onClick={() => setSelectedRoomBg(rm)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                        selectedRoomBg === rm
                          ? 'bg-[#0E4A93] text-white'
                          : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {rm === 'living' ? 'Living Room' : rm === 'office' ? 'Executive Desk' : 'Art Gallery'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRoomView(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Room Canvas */}
            <div 
              className="relative flex-1 min-h-[420px] bg-cover bg-center flex items-center justify-center p-8 overflow-hidden"
              style={{
                backgroundImage: 
                  selectedRoomBg === 'living'
                    ? 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80)'
                    : selectedRoomBg === 'office'
                    ? 'url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80)'
                    : 'url(https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80)'
              }}
            >
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />

              <div 
                className="relative max-w-sm w-full bg-white/90 backdrop-blur-xs rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-105"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                  border: activeFrameOption.id !== 'no-frame' ? activeFrameOption.borderCss : 'none'
                }}
              >
                <div className="p-3">
                  <div className="aspect-[4/3] w-full rounded-lg overflow-hidden relative bg-stone-100">
                    <img
                      src={panelImages[0]?.imageUrl || uploadedPhotos[0] || catalogProduct.image}
                      alt="Room Preview"
                      style={{
                        filter: 
                          panelImages[0]?.filter === 'sepia'
                            ? 'sepia(0.85) contrast(1.1) brightness(0.95)'
                            : panelImages[0]?.filter === 'grayscale'
                            ? 'grayscale(100%) contrast(1.05)'
                            : 'none'
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-xs font-bold text-stone-900">{selectedProductType.name}</div>
                    <div className="text-[10px] text-stone-500">{currentDimensions} • {FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Realistic scale preview for visual estimation.</span>
              <button
                type="button"
                onClick={() => setShowRoomView(false)}
                className="px-4 py-1.5 bg-[#0E4A93] text-white font-bold rounded-lg"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AcrylicCustomizerPage;
