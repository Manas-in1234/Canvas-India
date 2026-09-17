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
  Search
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

  // Active Left Toolbar Tab (8 tabs in exact order)
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

  // Template Selection Tab States
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory>('All');
  const [templateSearch, setTemplateSearch] = useState<string>('');
  const [workspaceMode, setWorkspaceMode] = useState<'CANVAS' | 'TEMPLATES'>('CANVAS');

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return ACRYLIC_TEMPLATES.filter((tmpl) => {
      // Category filter
      const matchesCategory = 
        templateCategory === 'All' || 
        tmpl.category === templateCategory || 
        (tmpl.secondaryCategories && tmpl.secondaryCategories.includes(templateCategory));
      
      // Search filter
      const matchesSearch = 
        !templateSearch.trim() || 
        tmpl.name.toLowerCase().includes(templateSearch.toLowerCase()) || 
        tmpl.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
        tmpl.defaultTitle.toLowerCase().includes(templateSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [templateCategory, templateSearch]);

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
  const [roomBackgroundIndex, setRoomBackgroundIndex] = useState<number>(0);

  // Add Text Editor state
  const [textInput, setTextInput] = useState<string>('');
  const [selectedFontFamily, setSelectedFontFamily] = useState<string>('Georgia, serif');
  const [selectedFontSize, setSelectedFontSize] = useState<number>(18);
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#FFFFFF');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');

  // UI Modals & Notifications
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number } | null>(null);
  const textDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);
  const clipartDragRef = useRef<{ x: number; y: number; initialOffset: { x: number; y: number }; rect: DOMRect } | null>(null);

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetPanelRef = useRef<number>(0);

  // Auto switch workspaceMode if TEMPLATES tab is clicked
  useEffect(() => {
    if (activeTab === 'TEMPLATES') {
      setWorkspaceMode('TEMPLATES');
    }
  }, [activeTab]);

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
    selectedHardwareId,
    selectedFinishId,
    selectedFrameId,
    selectedEdgeWrapId,
    selectedThicknessId,
    selectedPaperId
  ]);

  // Dimension summary string
  const currentDimensionLabel = isCustomSize
    ? `${customWidth}" × ${customHeight}"`
    : currentSizeOption?.dimensionsSummary || selectedProductType.name;

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

  // Select a template from the Template Gallery
  const handleSelectTemplate = (template: AcrylicTemplateItem) => {
    setSelectedTemplateId(template.id);

    // Check if user has an uploaded photo in frame 0
    const currentFrame = panelImages[0];
    const isUserPhoto = !!currentFrame?.imageUrl && uploadedPhotos.includes(currentFrame.imageUrl);

    // Build template text elements
    const newTextElements: TextElement[] = [];
    if (template.defaultTitle) {
      newTextElements.push({
        id: `txt-tmpl-title-${Date.now()}`,
        text: template.defaultTitle,
        fontFamily: 'Georgia, serif',
        fontSize: 18,
        color: '#FFFFFF',
        x: 0,
        y: -30,
        alignment: 'center'
      });
    }
    if (template.defaultSubtitle) {
      newTextElements.push({
        id: `txt-tmpl-sub-${Date.now() + 1}`,
        text: template.defaultSubtitle,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 11,
        color: '#E2E8F0',
        x: 0,
        y: -20,
        alignment: 'center'
      });
    }
    if (template.defaultLyrics && template.defaultLyrics.length > 0) {
      newTextElements.push({
        id: `txt-tmpl-lyrics-${Date.now() + 2}`,
        text: template.defaultLyrics.join('\n'),
        fontFamily: 'Georgia, serif',
        fontSize: 10,
        color: '#F8FAFC',
        x: 0,
        y: 22,
        alignment: 'center'
      });
    }

    updateFrame(0, (curr) => ({
      ...curr,
      // Retain user's uploaded photo if already present! Otherwise use template mockup image
      imageUrl: isUserPhoto ? curr.imageUrl : template.image,
      textElements: newTextElements
    }));

    // Auto-switch to canvas view so user can immediately see and edit their template
    setWorkspaceMode('CANVAS');
  };

  // Clear / Start with Blank Canvas
  const handleSelectBlankCanvas = () => {
    setSelectedTemplateId(null);
    // Remove template-generated text elements while keeping uploaded photo intact
    updateFrame(0, (curr) => ({
      ...curr,
      textElements: curr.textElements.filter((t) => !t.id.startsWith('txt-tmpl-'))
    }));
    setWorkspaceMode('CANVAS');
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

  // Panning / Dragging Handlers
  const startImageDrag = (e: React.PointerEvent, panelIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    setIsDragging(true);

    const frame = panelImages[panelIdx] || createDefaultPanelState(null);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: frame.panX,
      initialPanY: frame.panY
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging && dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      updateFrame(activePanelIndex, (curr) => ({
        ...curr,
        panX: dragStartRef.current!.initialPanX + deltaX,
        panY: dragStartRef.current!.initialPanY + deltaY
      }));
    }

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
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if target wasn't captured
    }
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
      setSelectedSizeId(pt.defaultSizeOptionId);
      if (ptId === 'acrylic-wall-art' || ptId === 'acrylic-split') {
        setSelectedLayoutId('layout-3-wall');
      } else if (ptId === 'acrylic-collage') {
        setSelectedLayoutId('layout-4-grid');
      } else {
        setSelectedLayoutId('layout-1-single');
      }
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
    // Validation: at least one photo must be loaded
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

  // RENDER A SINGLE ACRYLIC FRAME
  const renderFrameContainer = (panelIdx: number, aspectClass: string, dimensionLabel?: string) => {
    const frame = panelImages[panelIdx] || createDefaultPanelState(null);
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

  // Dynamic frame outer border CSS (Modern Mouldings)
  const currentFrameCss = useMemo(() => {
    const frameObj = FRAME_OPTIONS.find((f) => f.id === selectedFrameId);
    return frameObj?.borderCss || '';
  }, [selectedFrameId]);

  // Toolbar items configuration (8 items in exact order)
  const toolbarItems: { id: ToolbarTab; label: string; icon: React.ElementType }[] = [
    { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
    { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
    { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Grid },
    { id: 'LAYOUTS & DESIGNS', label: 'LAYOUTS & DESIGNS', icon: Layers },
    { id: 'TEMPLATES', label: 'TEMPLATES', icon: Smile },
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

      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER BAR                                                      */}
      {/* ------------------------------------------------------------------- */}
      <header className="h-14 bg-[#0E4A93] text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/acrylic"
            className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Acrylic</span>
          </Link>
          <div className="h-5 w-px bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <CanvasIndiaLogo className="h-6 w-auto brightness-0 invert" />
            <span className="text-sm font-bold tracking-tight hidden md:inline">
              Customizer
            </span>
          </div>
        </div>

        {/* Center: Selected Product & Dimensions summary */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="font-semibold text-white/80">{selectedProductType.name}</span>
          <span className="text-white/40">•</span>
          <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded">
            {currentDimensionLabel}
          </span>
          {selectedTemplateId && (
            <>
              <span className="text-white/40">•</span>
              <span className="font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded truncate max-w-[160px]">
                {ACRYLIC_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name}
              </span>
            </>
          )}
        </div>

        {/* Right Actions: Price, Save & Add to Cart */}
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

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CUSTOMIZER BODY                                                */}
      {/* ------------------------------------------------------------------- */}
      <div 
        className="flex-1 flex flex-col md:flex-row overflow-hidden"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >

        {/* ----------------------------------------------------------------- */}
        {/* LEFT PRIMARY TOOLBAR (8 TABS IN EXACT ORDER)                      */}
        {/* ----------------------------------------------------------------- */}
        <aside className="w-full md:w-20 bg-white border-b md:border-b-0 md:border-r border-stone-200 flex md:flex-col items-center justify-between md:justify-start py-1 md:py-3 z-20 shrink-0 overflow-x-auto md:overflow-x-visible">
          {toolbarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'TEMPLATES') {
                    setWorkspaceMode('TEMPLATES');
                  }
                }}
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
              {activeTab === 'SELECT SIZE' && `${filteredSizes.length} Options`}
              {activeTab === 'LAYOUTS & DESIGNS' && `${LAYOUT_PRESETS.length} Layouts`}
              {activeTab === 'TEMPLATES' && '20 Templates'}
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

                    {/* Compact Fixed Image Container */}
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

              {/* Frame target selector */}
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

              {/* Upload Drop Zone */}
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

              {/* Uploaded Gallery Thumbnails */}
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
              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {(['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE'] as SizeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSizeCategory(cat);
                      setIsCustomSize(false);
                    }}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                      sizeCategory === cat && !isCustomSize
                        ? 'bg-[#0E4A93] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomSize(true)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    isCustomSize
                      ? 'bg-[#0E4A93] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  CUSTOM
                </button>
              </div>

              {/* Standard Sizes Grid */}
              {!isCustomSize ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredSizes.map((size) => {
                    const isSelected = selectedSizeId === size.id && !isCustomSize;
                    return (
                      <div
                        key={size.id}
                        onClick={() => {
                          setSelectedSizeId(size.id);
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

                        {/* Compact Visual Aspect Container */}
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
                /* Custom Size Dimensions */
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-800">Set Custom Dimensions:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">WIDTH (INCHES)</label>
                      <input
                        type="number"
                        min={6}
                        max={60}
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Math.max(6, Math.min(60, Number(e.target.value))))}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-1">HEIGHT (INCHES)</label>
                      <input
                        type="number"
                        min={6}
                        max={60}
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Math.max(6, Math.min(60, Number(e.target.value))))}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200">
                    Acrylic custom size: <span className="font-bold">{customWidth}" × {customHeight}"</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LAYOUTS & DESIGNS */}
          {activeTab === 'LAYOUTS & DESIGNS' && (
            <div className="p-3.5 space-y-3">
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

                                  {/* Compact Visual Diagram Representation */}
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

              {/* DESIGNS SUB-TAB */}
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

          {/* TAB 5: TEMPLATES (DRAWER QUICK CONTROLS) */}
          {activeTab === 'TEMPLATES' && (
            <div className="p-3.5 space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-800">Current Selection:</div>
                <div className="text-xs font-extrabold text-[#0E4A93] truncate">
                  {selectedTemplateId 
                    ? ACRYLIC_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name 
                    : 'Blank Canvas'}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode('TEMPLATES')}
                    className="flex-1 py-1.5 px-2 bg-[#0E4A93] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Open Gallery
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectBlankCanvas}
                    className="py-1.5 px-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Blank Canvas
                  </button>
                </div>
              </div>

              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">Quick Categories:</div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Wedding', 'Love', 'Family', 'Music', 'Quotes', 'Baby', 'Travel', 'Minimal'] as TemplateCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setTemplateCategory(cat);
                      setWorkspaceMode('TEMPLATES');
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      templateCategory === cat
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
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

              {/* Inner Border Width */}
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

              {/* Border Color */}
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
              {/* Hardware Selection */}
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

              {/* Surface Finish */}
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
              {/* Frames */}
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

              {/* Color Finishing (Filters) */}
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
          {/* MODE A: TEMPLATE SELECTION PANEL IN WORKSPACE (Per user spec)    */}
          {/* =============================================================== */}
          {workspaceMode === 'TEMPLATES' ? (
            <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-4">
              
              {/* Top Bar inside Template Workspace */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                      Choose a Template
                    </h1>
                    <span className="text-xs font-semibold text-stone-500">
                      (Optional)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Pick a template and we'll add it to your canvas. You can still customize everything.
                  </p>
                </div>

                {/* View Canvas Toggle */}
                <button
                  type="button"
                  onClick={() => setWorkspaceMode('CANVAS')}
                  className="self-start sm:self-auto px-4 py-2 bg-[#0E4A93] hover:bg-[#0c3e7b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>View Canvas</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar & Category Filter Tabs */}
              <div className="space-y-2.5">
                {/* Search Input */}
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search templates by name or lyric..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0E4A93]/30 focus:border-[#0E4A93]"
                  />
                  {templateSearch && (
                    <button
                      type="button"
                      onClick={() => setTemplateSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {(['All', 'Wedding', 'Love', 'Family', 'Music', 'Quotes', 'Baby', 'Travel', 'Minimal'] as TemplateCategory[]).map((cat) => {
                    const isActive = templateCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTemplateCategory(cat)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0E4A93] text-white shadow-xs'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Yellow Information Notice Box (Section 3) */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950 shadow-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  These templates are for reference purpose only. Our designer will try to match the final product with selected template but it may vary based on the lyrics and image you have uploaded while placing the order. Final image proof will be shared with you before manufacturing the order.
                </div>
              </div>

              {/* Templates Grid (3-4 Columns on Desktop, 2 on Mobile) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {filteredTemplates.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0E4A93] bg-blue-50/20 shadow-md ring-2 ring-[#0E4A93]/20'
                          : 'border-stone-200 hover:border-stone-400 bg-white shadow-xs'
                      }`}
                    >
                      {/* Top Right Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Compact Fixed Image Container (Approx 100-140px wide, 70-100px high) */}
                      <div className="w-full h-24 sm:h-28 bg-stone-50 flex items-center justify-center p-2 overflow-hidden relative">
                        <img 
                          src={tmpl.image} 
                          alt={tmpl.name} 
                          className="max-h-full max-w-[140px] object-contain group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/customizer/acrylic/templates/blank-canvas.svg';
                          }}
                        />
                      </div>

                      {/* Template Title & Category */}
                      <div className="p-2.5 bg-white border-t border-stone-100 flex-1 flex flex-col justify-between">
                        <div className="text-xs font-bold text-stone-900 leading-snug line-clamp-2 min-h-[32px]">
                          {tmpl.name}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-50 text-[10px]">
                          <span className="font-semibold text-stone-500">{tmpl.category}</span>
                          <span className="font-bold text-[#0E4A93]">Free Template</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Section: Or Start with a Blank Canvas (Section 11) */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Or Start with a Blank Canvas
                </div>
                <div
                  onClick={handleSelectBlankCanvas}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                    !selectedTemplateId
                      ? 'border-[#0E4A93] bg-blue-50/30 ring-1 ring-[#0E4A93]/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-14 h-11 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                    <img src="/assets/customizer/acrylic/templates/blank-canvas.svg" alt="Blank Canvas" className="w-10 h-8 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-stone-900">Blank Canvas</div>
                    <div className="text-[11px] text-stone-500">Upload your own image and design freely without template overlays</div>
                  </div>
                  {!selectedTemplateId && (
                    <div className="w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* =============================================================== */
            /* MODE B: INTERACTIVE ACRYLIC CANVAS WORKSPACE                    */
            /* =============================================================== */
            <div className="flex-1 flex flex-col relative overflow-hidden">
              
              {/* Workspace Top Toolbar */}
              <div className="h-11 bg-white border-b border-stone-200 px-4 flex items-center justify-between shrink-0 z-20">
                {/* Left: Interactive Tools (Zoom In/Out, Rotate, Reset) */}
                <div className="flex items-center gap-1">
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
                    title="Reset Photo Pan/Scale"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Center: Template Badge with Quick Gallery Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWorkspaceMode('TEMPLATES')}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5 text-amber-600" />
                    <span>Template: {selectedTemplateId ? ACRYLIC_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name.slice(0, 24) + '...' : 'Blank Canvas'}</span>
                    <span className="text-[10px] text-amber-700 underline ml-0.5">Change</span>
                  </button>
                </div>

                {/* Right: Room View & Delete Element */}
                <div className="flex items-center gap-1.5">
                  {selectedElement.type !== 'image' && (
                    <button
                      type="button"
                      onClick={handleDeleteSelectedElement}
                      className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowRoomView(!showRoomView)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      showRoomView
                        ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Room View</span>
                  </button>
                </div>
              </div>

              {/* Canvas Interactive Grid Container */}
              <div 
                className={`flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none ${
                  showRoomView ? 'bg-stone-800' : 'bg-[#E2E8F0]/50'
                }`}
                style={{
                  backgroundImage: showRoomView 
                    ? 'url(/assets/acrylic/acrylic-panel-living.jpg)' 
                    : 'radial-gradient(circle at 50% 50%, #F8FAFC 0%, #E2E8F0 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >

                {/* Acrylic Product Frame Wrapper with Optional Outer Moulding Frame */}
                <div 
                  className={`relative max-w-2xl w-full flex items-center justify-center transition-all duration-300 ${currentFrameCss}`}
                >
                  
                  {/* Single Frame Layout */}
                  {selectedLayoutId === 'layout-1-single' && (
                    <div className="w-full max-w-lg">
                      {renderFrameContainer(0, currentSizeOption.aspectClass, currentDimensionLabel)}
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

              </div>

              {/* Bottom Quick-Add Action Bar (Text & Clipart) */}
              <div className="h-12 bg-white border-t border-stone-200 px-4 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Add custom text..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddText();
                      }}
                      className="w-40 sm:w-60 px-3 py-1 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddText}
                    className="px-3 py-1 bg-[#0E4A93] hover:bg-[#0c3e7b] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Add Text
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-500 font-semibold hidden sm:inline">Add Emoji:</span>
                  {['❤️', '✨', '💍', '🕊️', '🌸', '⭐'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddClipart(emoji)}
                      className="w-7 h-7 rounded hover:bg-stone-100 flex items-center justify-center text-base transition-colors cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
};

export default AcrylicCustomizerPage;
