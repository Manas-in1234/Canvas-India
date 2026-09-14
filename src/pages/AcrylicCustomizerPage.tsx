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
  MessageSquare, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  Minus, 
  Move,
  Sparkles,
  Phone,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

// ============================================================================
// 1. CONSTANTS & ACRYLIC-ONLY DATA DEFINITIONS
// ============================================================================

type ToolbarTab = 'PRODUCTS' | 'UPLOAD' | 'HARDWARE & FINISH' | 'OPTIONS';

interface AcrylicProductType {
  id: string;
  name: string;
  startingPrice: number;
  iconType: 'block' | 'panel' | 'wall' | 'print' | 'collage' | 'split' | 'signage';
  panelsCount: number;
  description: string;
  defaultSizeOptionId: string;
}

// Strictly Acrylic-only products (No bus roll, no canvas, no wood, etc.)
const ACRYLIC_PRODUCT_TYPES: AcrylicProductType[] = [
  {
    id: 'acrylic-photo-block',
    name: 'Acrylic Photo Block',
    startingPrice: 499.00,
    iconType: 'block',
    panelsCount: 1,
    description: 'Freestanding, solid optical acrylic block with 3D crystal depth.',
    defaultSizeOptionId: 'block-6x4'
  },
  {
    id: 'acrylic-photo-panel',
    name: 'Acrylic Photo Panel',
    startingPrice: 355.00,
    iconType: 'panel',
    panelsCount: 1,
    description: 'Modern slim acrylic panel with diamond polished border.',
    defaultSizeOptionId: 'single-8x8'
  },
  {
    id: 'acrylic-wall-art',
    name: 'Acrylic Wall Art',
    startingPrice: 2338.90,
    iconType: 'wall',
    panelsCount: 3,
    description: 'Multi-panel gallery wall display for striking home and office focal points.',
    defaultSizeOptionId: 'wd-3p-12x18-10x8'
  },
  {
    id: 'acrylic-print',
    name: 'Acrylic Print',
    startingPrice: 355.00,
    iconType: 'print',
    panelsCount: 1,
    description: 'Vibrant direct UV sub-surface print on crystal acrylic.',
    defaultSizeOptionId: 'single-8x8'
  },
  {
    id: 'acrylic-collage',
    name: 'Acrylic Collage',
    startingPrice: 426.00,
    iconType: 'collage',
    panelsCount: 4,
    description: 'Multiple cherished photographs printed together on acrylic.',
    defaultSizeOptionId: 'col-4p-12x12'
  },
  {
    id: 'acrylic-split',
    name: 'Acrylic Split Panel',
    startingPrice: 674.50,
    iconType: 'split',
    panelsCount: 3,
    description: 'Panoramic photograph split seamlessly across 3 triptych panels.',
    defaultSizeOptionId: 'split-3p-36x24'
  },
  {
    id: 'acrylic-signage',
    name: 'Acrylic Signage',
    startingPrice: 799.00,
    iconType: 'signage',
    panelsCount: 1,
    description: 'Professional architectural logo and nameplate display with standoff bolts.',
    defaultSizeOptionId: 'signage-12x8'
  }
];

interface SizeOption {
  id: string;
  productTypeId: string;
  label: string;
  dimensionsSummary: string;
  price: number;
  panels: Array<{
    id: string;
    label: string;
    dimension: string;
    widthRatio: number;
    heightRatio: number;
  }>;
}

const SIZE_OPTIONS: SizeOption[] = [
  // Acrylic Wall Art (3-Piece Layout)
  {
    id: 'wd-3p-12x18-10x8',
    productTypeId: 'acrylic-wall-art',
    label: '3-piece (1) 12"x18", (2) 10"x8"',
    dimensionsSummary: '(1) 12"x18", (2) 10"x8"',
    price: 2338.90,
    panels: [
      { id: 'p0', label: 'Panel 1 (Top)', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 },
      { id: 'p1', label: 'Panel 2 (Left)', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wd-4p-12x12-8x8',
    productTypeId: 'acrylic-wall-art',
    label: '4-piece (2) 12"x12", (2) 8"x8"',
    dimensionsSummary: '(2) 12"x12", (2) 8"x8"',
    price: 2890.00,
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Panel 2', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Panel 3', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p3', label: 'Panel 4', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  // Acrylic Photo Block
  {
    id: 'block-4x4',
    productTypeId: 'acrylic-photo-block',
    label: 'Block: 4" × 4" (18mm Thick)',
    dimensionsSummary: '4" × 4"',
    price: 499.00,
    panels: [{ id: 'p0', label: 'Photo Block', dimension: '4" × 4"', widthRatio: 4, heightRatio: 4 }]
  },
  {
    id: 'block-6x4',
    productTypeId: 'acrylic-photo-block',
    label: 'Block: 6" × 4" (18mm Thick)',
    dimensionsSummary: '6" × 4"',
    price: 699.00,
    panels: [{ id: 'p0', label: 'Photo Block', dimension: '6" × 4"', widthRatio: 6, heightRatio: 4 }]
  },
  {
    id: 'block-8x8',
    productTypeId: 'acrylic-photo-block',
    label: 'Block: 8" × 8" (18mm Thick)',
    dimensionsSummary: '8" × 8"',
    price: 999.00,
    panels: [{ id: 'p0', label: 'Photo Block', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  // Acrylic Photo Panel & Print
  {
    id: 'single-8x8',
    productTypeId: 'acrylic-photo-panel',
    label: 'Panel: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 355.00,
    panels: [{ id: 'p0', label: 'Panel', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'single-10x8',
    productTypeId: 'acrylic-photo-panel',
    label: 'Panel: 10" × 8"',
    dimensionsSummary: '10" × 8"',
    price: 590.00,
    panels: [{ id: 'p0', label: 'Panel', dimension: '10" × 8"', widthRatio: 10, heightRatio: 8 }]
  },
  {
    id: 'single-12x18',
    productTypeId: 'acrylic-photo-panel',
    label: 'Panel: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1250.00,
    panels: [{ id: 'p0', label: 'Panel', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  },
  {
    id: 'single-16x24',
    productTypeId: 'acrylic-photo-panel',
    label: 'Panel: 16" × 24"',
    dimensionsSummary: '16" × 24"',
    price: 1890.00,
    panels: [{ id: 'p0', label: 'Panel', dimension: '16" × 24"', widthRatio: 24, heightRatio: 16 }]
  },
  // Acrylic Print
  {
    id: 'print-8x8',
    productTypeId: 'acrylic-print',
    label: 'Print: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 355.00,
    panels: [{ id: 'p0', label: 'Print Panel', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'print-12x18',
    productTypeId: 'acrylic-print',
    label: 'Print: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1250.00,
    panels: [{ id: 'p0', label: 'Print Panel', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }]
  },
  // Acrylic Split Panel
  {
    id: 'split-3p-36x24',
    productTypeId: 'acrylic-split',
    label: '3-Panel Triptych: 36" × 24" total',
    dimensionsSummary: '(3) 12" × 24"',
    price: 1850.00,
    panels: [
      { id: 'p0', label: 'Panel 1 (Left)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p1', label: 'Panel 2 (Center)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p2', label: 'Panel 3 (Right)', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
    ]
  },
  // Acrylic Collage
  {
    id: 'col-4p-12x12',
    productTypeId: 'acrylic-collage',
    label: '4-Photo Grid: 12" × 12"',
    dimensionsSummary: '4 Photos (6" × 6" ea)',
    price: 850.00,
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p1', label: 'Slot 2', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p2', label: 'Slot 3', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 },
      { id: 'p3', label: 'Slot 4', dimension: '6" × 6"', widthRatio: 6, heightRatio: 6 }
    ]
  },
  // Acrylic Signage
  {
    id: 'signage-12x8',
    productTypeId: 'acrylic-signage',
    label: 'Signage: 12" × 8" + Standoffs',
    dimensionsSummary: '12" × 8"',
    price: 799.00,
    panels: [{ id: 'p0', label: 'Sign Panel', dimension: '12" × 8"', widthRatio: 12, heightRatio: 8 }]
  },
  {
    id: 'signage-18x12',
    productTypeId: 'acrylic-signage',
    label: 'Signage: 18" × 12" + Standoffs',
    dimensionsSummary: '18" × 12"',
    price: 1499.00,
    panels: [{ id: 'p0', label: 'Sign Panel', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 }]
  }
];

const FINISH_OPTIONS = [
  { id: 'high-gloss', label: 'High Gloss Clear', price: 0, description: 'Direct optical crystal finish with unmatched vibrancy.' },
  { id: 'anti-glare', label: 'Anti-Glare Matte', price: 180, description: 'Velvet soft matte surface reducing reflection from windows & lights.' },
  { id: 'frosted-backing', label: 'Frosted Backing', price: 150, description: 'Soft diffused translucency for gentle light transmission.' },
  { id: 'diamond-bevel', label: 'Diamond Beveled Edge', price: 220, description: 'Hand-polished 45-degree prism beveled luxury border.' }
];

const HARDWARE_OPTIONS = [
  { id: 'no-hardware', label: 'Without Base / Stand', price: 0, description: 'Standalone tabletop display or custom frame mounting.' },
  { id: 'acrylic-base', label: 'Acrylic Foot Base', price: 200, description: 'Clear optical grooved acrylic foot base.' },
  { id: 'desktop-stand', label: 'Desktop Stand', price: 250, description: 'Brushed metal kickstand for credenza & desk.' },
  { id: 'wall-mount', label: 'Wall Mount Bracket', price: 150, description: 'Concealed French-cleat flush wall hanger.' },
  { id: 'standoff-mount', label: 'Chrome Floating Standoffs', price: 250, description: '4 Stainless steel architectural wall bolts.' }
];

const THICKNESS_OPTIONS = [
  { id: '7mm', label: '7mm Optical Acrylic', price: 0 },
  { id: '18mm', label: '18mm Heavy Block Acrylic', price: 350 }
];

const PAPER_OPTIONS = [
  { id: 'white-luster', label: 'White Luster Photo Paper', price: 0 },
  { id: 'metallic-pearl', label: 'Metallic Pearl Paper', price: 180 }
];

const MATERIAL_VARIANTS = [
  { id: 'clear-optical', name: 'Clear Optical Acrylic', tag: 'Standard', desc: '99.2% light transmission crystal optical clarity.' },
  { id: 'premium-cast', name: 'Premium Cast Acrylic', tag: '+₹250', desc: 'Cell-cast scratch-resistant museum glass grade.' },
  { id: 'ultra-hd', name: 'Ultra-HD Anti-Scratch Acrylic', tag: '+₹450', desc: 'Diamond-hardened protective coating.' }
];

const CLIPART_ITEMS = ['❤️', '⭐', '🎉', '🎁', '✨', '🌸', '😊', '🌿', '💎', '🎂', '💍', '🏆'];

interface PanelImageState {
  imageUrl: string | null;
  panX: number;
  panY: number;
  scale: number;
  rotation: number;
}

// ============================================================================
// 2. MAIN ACRYLIC CUSTOMIZER COMPONENT
// ============================================================================

export const AcrylicCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Matched product from catalog
  const catalogProduct = useMemo(() => {
    return allProducts.find(
      (p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'acrylic'
    ) || allProducts.find((p) => p.categorySlug === 'acrylic') || allProducts[0];
  }, [allProducts, productId]);

  // Active Tool in Left Toolbar ('PRODUCTS' | 'UPLOAD' | 'HARDWARE & FINISH' | 'OPTIONS')
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
    return 'acrylic-photo-block'; // Clean default
  });

  const selectedProductType = useMemo(() => {
    return ACRYLIC_PRODUCT_TYPES.find((pt) => pt.id === selectedProductTypeId) || ACRYLIC_PRODUCT_TYPES[0];
  }, [selectedProductTypeId]);

  // Available size options for the current product type
  const availableSizeOptions = useMemo(() => {
    const list = SIZE_OPTIONS.filter((s) => s.productTypeId === selectedProductTypeId);
    if (list.length > 0) return list;
    return SIZE_OPTIONS.filter((s) => s.productTypeId === 'acrylic-photo-panel');
  }, [selectedProductTypeId]);

  // Selected Size Option
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => {
    return availableSizeOptions[0]?.id || 'wd-3p-12x18-10x8';
  });

  // Update selected size when product type changes
  useEffect(() => {
    if (!availableSizeOptions.some((s) => s.id === selectedSizeId)) {
      setSelectedSizeId(availableSizeOptions[0]?.id || 'single-8x8');
    }
  }, [availableSizeOptions, selectedSizeId]);

  const currentSizeOption = useMemo(() => {
    return availableSizeOptions.find((s) => s.id === selectedSizeId) || availableSizeOptions[0] || SIZE_OPTIONS[0];
  }, [availableSizeOptions, selectedSizeId]);

  // Panels for the current size layout
  const panels = currentSizeOption.panels;

  // Panel Images State: map panel index -> PanelImageState
  const [panelImages, setPanelImages] = useState<Record<number, PanelImageState>>({
    0: { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 },
    1: { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 },
    2: { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 },
    3: { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 }
  });

  // Currently Active Panel Slot for drag/transform/upload targeting
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  // Uploaded photo collection (all photos uploaded in this session)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Hardware & Finish State
  const [selectedFinishId, setSelectedFinishId] = useState<string>('diamond-bevel');
  const [selectedHardwareId, setSelectedHardwareId] = useState<string>('no-hardware');

  // Options State
  const [selectedThicknessId, setSelectedThicknessId] = useState<string>('7mm');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('white-luster');
  const [quantity, setQuantity] = useState<number>(1);

  // Material Variant (from Change Material modal)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('clear-optical');
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
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Key
  const storageKey = `ci_customization_${catalogProduct.id || catalogProduct.slug || 'acrylic-custom'}`;

  // Restore saved state on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedProductTypeId) setSelectedProductTypeId(data.selectedProductTypeId);
        if (data.selectedSizeId) setSelectedSizeId(data.selectedSizeId);
        if (data.selectedFinishId) setSelectedFinishId(data.selectedFinishId);
        if (data.selectedHardwareId) setSelectedHardwareId(data.selectedHardwareId);
        if (data.selectedThicknessId) setSelectedThicknessId(data.selectedThicknessId);
        if (data.selectedPaperId) setSelectedPaperId(data.selectedPaperId);
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
  }, [storageKey]);

  // Save current design state to localStorage
  const handleSaveDesign = () => {
    try {
      const stateToSave = {
        selectedProductTypeId,
        selectedSizeId,
        selectedFinishId,
        selectedHardwareId,
        selectedThicknessId,
        selectedPaperId,
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
  const unitPrice = useMemo(() => {
    let price = currentSizeOption.price;

    // Finish addon
    const finish = FINISH_OPTIONS.find((f) => f.id === selectedFinishId);
    if (finish) price += finish.price;

    // Hardware addon
    const hardware = HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
    if (hardware) price += hardware.price;

    // Thickness addon
    if (selectedThicknessId === '18mm') price += 350;

    // Paper addon
    if (selectedPaperId === 'metallic-pearl') price += 180;

    // Material variant addon
    if (selectedMaterialId === 'premium-cast') price += 250;
    else if (selectedMaterialId === 'ultra-hd') price += 450;

    return price;
  }, [currentSizeOption.price, selectedFinishId, selectedHardwareId, selectedThicknessId, selectedPaperId, selectedMaterialId]);

  const totalPrice = unitPrice * quantity;

  // Validation: Check how many panels require images
  const totalRequiredPanels = panels.length;
  const filledPanelsCount = useMemo(() => {
    return panels.filter((_, idx) => Boolean(panelImages[idx]?.imageUrl)).length;
  }, [panels, panelImages]);

  const isComplete = filledPanelsCount >= 1; // At least one photo uploaded

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
          // Automatically assign to the active panel slot
          setPanelImages((prev) => ({
            ...prev,
            [activePanelIndex]: {
              imageUrl: result,
              panX: 0,
              panY: 0,
              scale: 1,
              rotation: 0
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Assign an already uploaded photo to the active panel
  const handleAssignPhotoToPanel = (photoUrl: string, panelIdx: number) => {
    setPanelImages((prev) => ({
      ...prev,
      [panelIdx]: {
        imageUrl: photoUrl,
        panX: 0,
        panY: 0,
        scale: 1,
        rotation: 0
      }
    }));
  };

  // Image Transformation Helpers for Active Panel
  const updateActivePanelTransform = (updater: (curr: PanelImageState) => Partial<PanelImageState>) => {
    setPanelImages((prev) => {
      const curr = prev[activePanelIndex] || { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 };
      return {
        ...prev,
        [activePanelIndex]: {
          ...curr,
          ...updater(curr)
        }
      };
    });
  };

  const handleZoomIn = () => {
    updateActivePanelTransform((curr) => ({ scale: Math.min(3, curr.scale + 0.15) }));
  };

  const handleZoomOut = () => {
    updateActivePanelTransform((curr) => ({ scale: Math.max(0.6, curr.scale - 0.15) }));
  };

  const handleRotate90 = () => {
    updateActivePanelTransform((curr) => ({ rotation: (curr.rotation + 90) % 360 }));
  };

  const handleFit = () => {
    updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0 }));
  };

  const handleReset = () => {
    updateActivePanelTransform(() => ({ scale: 1, panX: 0, panY: 0, rotation: 0 }));
  };

  // Mouse/Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent, panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    const curr = panelImages[panelIdx];
    if (!curr?.imageUrl) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: curr.panX,
      initialPanY: curr.panY
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    updateActivePanelTransform((curr) => ({
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

  // Add to Cart Action
  const handleAddToCart = () => {
    if (!isComplete) {
      alert('Please upload or select at least one photograph to customize your acrylic print.');
      return;
    }

    const firstImage = panelImages[0]?.imageUrl || uploadedPhotos[0] || catalogProduct.image;

    onAddToCartCustomized({
      product: {
        ...catalogProduct,
        price: unitPrice,
        name: `${selectedProductType.name} - ${currentSizeOption.label}`
      },
      size: currentSizeOption.dimensionsSummary,
      finish: FINISH_OPTIONS.find((f) => f.id === selectedFinishId)?.label || 'High Gloss Clear',
      quantity,
      customText: customText || undefined,
      photoUrl: firstImage,
      calculatedPrice: totalPrice,
      material: MATERIAL_VARIANTS.find((m) => m.id === selectedMaterialId)?.name || 'Clear Optical Acrylic',
      thickness: selectedThicknessId,
      style: selectedProductType.name,
      base: HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId)?.label || 'Without Base',
      paper: PAPER_OPTIONS.find((p) => p.id === selectedPaperId)?.label || 'White Luster Photo Paper',
      customizationDetails: {
        productTypeId: selectedProductTypeId,
        sizeId: selectedSizeId,
        panels: panels.map((p, idx) => ({
          dimension: p.dimension,
          imageUrl: panelImages[idx]?.imageUrl || null,
          scale: panelImages[idx]?.scale || 1,
          rotation: panelImages[idx]?.rotation || 0,
          panX: panelImages[idx]?.panX || 0,
          panY: panelImages[idx]?.panY || 0
        })),
        clipart: activeClipart,
        customText,
        textColor,
        unitPrice,
        totalPrice
      }
    });
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#F8FAFC] text-stone-900 font-manrope overflow-hidden select-none">
      
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
        
        {/* LEFT: Hamburger Menu (Far Left) & (Desktop) Product Name */}
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
              Acrylic Studio
            </span>
          </div>
        </div>

        {/* CENTER: Official Canvas India Logo (Centered directly on blue header) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link 
            to="/" 
            className="flex items-center hover:opacity-90 transition-opacity focus:outline-none"
            title="Canvas India"
          >
            <img 
              src="/canvas-india-official-logo.png" 
              alt="Canvass India" 
              className="h-7 sm:h-8 md:h-9 w-auto object-contain block select-none" 
            />
          </Link>
        </div>

        {/* RIGHT: Live Chat, Dynamic Price Pill, and Canvas India Orange Add to Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 z-10">
          
          {/* Live Chat Button */}
          <button
            type="button"
            onClick={() => setChatModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-full border border-white/20 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span>LIVE CHAT</span>
          </button>

          {/* Dynamic Price Pill with Caret Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPricePopoverOpen(!pricePopoverOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[#0E4A93] font-black text-xs sm:text-sm rounded-lg shadow-xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0E4A93]/80" />
            </button>

            {/* Price Breakdown Popover */}
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
                    <span>Base ({currentSizeOption.dimensionsSummary}):</span>
                    <span className="font-bold text-stone-900">₹{currentSizeOption.price}</span>
                  </div>
                  {selectedFinishId !== 'high-gloss' && (
                    <div className="flex justify-between">
                      <span>Finish:</span>
                      <span className="font-bold text-stone-900">+₹{FINISH_OPTIONS.find(f => f.id === selectedFinishId)?.price}</span>
                    </div>
                  )}
                  {selectedHardwareId !== 'no-hardware' && (
                    <div className="flex justify-between">
                      <span>Hardware:</span>
                      <span className="font-bold text-stone-900">+₹{HARDWARE_OPTIONS.find(h => h.id === selectedHardwareId)?.price}</span>
                    </div>
                  )}
                  {selectedThicknessId === '18mm' && (
                    <div className="flex justify-between">
                      <span>18mm Heavy Acrylic:</span>
                      <span className="font-bold text-stone-900">+₹350</span>
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

          {/* Primary Action: ADD TO CART (Canvas India Orange #E8752A) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isComplete}
            className={`px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-black rounded-lg transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm ${
              isComplete
                ? 'bg-[#E8752A] hover:bg-[#d6651d] text-white active:scale-[0.98]'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            title={!isComplete ? 'Upload an image to continue' : 'Add customized acrylic to cart'}
            aria-label="Add customized acrylic to cart"
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
        {/* COLUMN 1: LEFT VERTICAL TOOLBAR                                     */}
        {/* ------------------------------------------------------------------- */}
        <nav 
          aria-label="Customizer Tools"
          className="bg-[#1E293B] text-stone-300 w-full md:w-20 md:min-w-[80px] shrink-0 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-3 z-20 border-r border-slate-700"
        >
          {[
            { id: 'PRODUCTS', label: 'PRODUCTS', icon: LayoutGrid },
            { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
            { id: 'HARDWARE & FINISH', label: 'HARDWARE & FINISH', icon: Layers },
            { id: 'OPTIONS', label: 'OPTIONS', icon: SlidersHorizontal },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as ToolbarTab)}
                className={`flex flex-col items-center justify-center w-full py-3.5 px-1 text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0E4A93] shadow-md font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#0E4A93]' : 'text-slate-300'}`} />
                <span className="text-[10px] leading-tight tracking-tight uppercase px-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 2: CONFIGURATION PANEL (Acrylic-Only Options)                */}
        {/* ------------------------------------------------------------------- */}
        <aside className="w-full md:w-[380px] lg:w-[410px] bg-white shrink-0 border-r border-stone-200 flex flex-col h-auto md:h-full overflow-y-auto shadow-sm z-10">
          
          {/* TAB CONTENT: PRODUCTS (Clean Acrylic-Only Selection) */}
          {activeTab === 'PRODUCTS' && (
            <div className="p-4 space-y-4">
              
              {/* Clean Acrylic Header Tag (Non-acrylic Canvas/Metal/Wood tabs removed) */}
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

              {/* 7 Acrylic Product Types Grid */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Select Acrylic Product:
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {ACRYLIC_PRODUCT_TYPES.map((pt) => {
                    const isSelected = selectedProductTypeId === pt.id;
                    return (
                      <div
                        key={pt.id}
                        onClick={() => setSelectedProductTypeId(pt.id)}
                        className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[96px] ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {/* Layout Diagram Icon */}
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
                          {pt.iconType === 'block' && (
                            <div className="w-6 h-6 border-2 border-[#0E4A93]/60 rounded-xs shadow-xs bg-stone-50" />
                          )}
                          {pt.iconType === 'panel' && (
                            <div className="w-6 h-6 border-2 border-stone-400 rounded-xs" />
                          )}
                          {pt.iconType === 'print' && (
                            <div className="w-6 h-6 border-2 border-stone-400 rounded-xs" />
                          )}
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
                          {pt.iconType === 'signage' && (
                            <div className="w-7 h-5 border border-stone-400 rounded-xs relative flex items-center justify-center">
                              <div className="w-1 h-1 bg-[#0E4A93] rounded-full absolute top-0.5 left-0.5" />
                              <div className="w-1 h-1 bg-[#0E4A93] rounded-full absolute top-0.5 right-0.5" />
                              <div className="w-1 h-1 bg-[#0E4A93] rounded-full absolute bottom-0.5 left-0.5" />
                              <div className="w-1 h-1 bg-[#0E4A93] rounded-full absolute bottom-0.5 right-0.5" />
                            </div>
                          )}
                        </div>

                        {/* Title & Starting Price */}
                        <div>
                          <div className="text-xs font-bold text-stone-900 leading-tight">
                            {pt.name}
                          </div>
                          <div className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-[#0E4A93]' : 'text-stone-500'}`}>
                            Starts at ₹{pt.startingPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Select Size & Shape Dropdown */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Select size &amp; shape:
                </label>

                <div className="relative">
                  <select
                    value={selectedSizeId}
                    onChange={(e) => setSelectedSizeId(e.target.value)}
                    className="w-full pl-3 pr-8 py-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-xs appearance-none"
                  >
                    {availableSizeOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} — ₹{opt.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: UPLOAD */}
          {activeTab === 'UPLOAD' && (
            <div className="p-4 space-y-5">
              
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-stone-900">
                  Upload Photos
                </h3>
                <p className="text-xs text-stone-500">
                  Select high-resolution images (PNG, JPG, WEBP, BMP up to 25MB each).
                </p>
              </div>

              {/* Target Panel Slot Selector */}
              {panels.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Assigning Photo to Panel:
                  </label>
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

              {/* Drag & Drop Upload Zone (Canvas India Orange #E8752A Highlights) */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilesUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-[#E8752A] bg-stone-50 hover:bg-orange-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto text-[#E8752A] group-hover:scale-110 transition-transform mb-3">
                  <UploadCloud className="w-6 h-6" />
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
                          <span className="text-[10px] text-white font-bold bg-[#0E4A93] px-1.5 py-0.5 rounded">
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

          {/* TAB CONTENT: HARDWARE & FINISH */}
          {activeTab === 'HARDWARE & FINISH' && (
            <div className="p-4 space-y-6">
              
              {/* SECTION A: FINISH */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Acrylic Edge &amp; Surface Finish:
                </label>
                <div className="space-y-2">
                  {FINISH_OPTIONS.map((finish) => {
                    const isSelected = selectedFinishId === finish.id;
                    return (
                      <div
                        key={finish.id}
                        onClick={() => setSelectedFinishId(finish.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">{finish.label}</div>
                          <div className="text-[11px] text-stone-500">{finish.description}</div>
                        </div>
                        <div className="text-xs font-black text-stone-900 ml-2">
                          {finish.price === 0 ? 'Included' : `+₹${finish.price}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: HARDWARE */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Mounting &amp; Display Hardware:
                </label>
                <div className="space-y-2">
                  {HARDWARE_OPTIONS.map((hw) => {
                    const isSelected = selectedHardwareId === hw.id;
                    return (
                      <div
                        key={hw.id}
                        onClick={() => setSelectedHardwareId(hw.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">{hw.label}</div>
                          <div className="text-[11px] text-stone-500">{hw.description}</div>
                        </div>
                        <div className="text-xs font-black text-stone-900 ml-2">
                          {hw.price === 0 ? 'Included' : `+₹${hw.price}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: OPTIONS */}
          {activeTab === 'OPTIONS' && (
            <div className="p-4 space-y-6">
              
              {/* Thickness Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Select Thickness:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THICKNESS_OPTIONS.map((th) => {
                    const isSelected = selectedThicknessId === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setSelectedThicknessId(th.id)}
                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 text-[#0E4A93] font-black'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <div>{th.label}</div>
                        <div className="text-[10px] text-stone-500 font-normal mt-0.5">
                          {th.price === 0 ? 'Standard' : `+₹${th.price}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paper Selector */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Sub-Surface Photo Paper:
                </label>
                <div className="space-y-2">
                  {PAPER_OPTIONS.map((paper) => {
                    const isSelected = selectedPaperId === paper.id;
                    return (
                      <div
                        key={paper.id}
                        onClick={() => setSelectedPaperId(paper.id)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                          isSelected
                            ? 'border-[#0E4A93] bg-blue-50/30 text-[#0E4A93]'
                            : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <span>{paper.label}</span>
                        <span>{paper.price === 0 ? 'Included' : `+₹${paper.price}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
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

        {/* ------------------------------------------------------------------- */}
        {/* COLUMN 3: MAIN RIGHT DESIGN WORKSPACE                               */}
        {/* ------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden">
          
          {/* Subtle Faint Graph Grid Backdrop */}
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

          {/* Top-Right Workspace Quick Tools: SAVE | ADD TEXT | ADD CLIPART */}
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
              onClick={() => setShowTextPopover(!showTextPopover)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-all cursor-pointer ${
                showTextPopover
                  ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                  : 'bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>ADD TEXT</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClipartPopover(!showClipartPopover)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs border transition-all cursor-pointer ${
                showClipartPopover
                  ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                  : 'bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>ADD CLIPART</span>
            </button>
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
                <button
                  type="button"
                  onClick={() => setCustomText('')}
                  className="w-full py-1 text-rose-600 hover:underline font-bold text-center text-[11px]"
                >
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
                <button
                  type="button"
                  onClick={() => setActiveClipart(null)}
                  className="w-full py-1 text-rose-600 hover:underline font-bold text-center text-[11px]"
                >
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
          <div 
            className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            
            {/* Left Chevron Button: < PRODUCTS */}
            <button
              type="button"
              onClick={() => setActiveTab('PRODUCTS')}
              className="hidden lg:flex flex-col items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all cursor-pointer group z-20"
            >
              <ChevronLeft className="w-5 h-5 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5">PRODUCTS</span>
            </button>

            {/* Right Chevron Button: HARDWARE > */}
            <button
              type="button"
              onClick={() => setActiveTab('HARDWARE & FINISH')}
              className="hidden lg:flex flex-col items-center justify-center absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all cursor-pointer group z-20"
            >
              <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-black tracking-tight uppercase mt-0.5">HARDWARE</span>
            </button>

            {/* ACRYLIC PANELS PREVIEW CONTAINER */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full">
              
              {/* WALL DISPLAY 3-PIECE LAYOUT */}
              {selectedProductTypeId === 'acrylic-wall-art' && panels.length === 3 && (
                <div className="flex flex-col items-center gap-3.5 w-full max-w-lg">
                  
                  {/* TOP PANEL: (1) 12" x 18" Horizontal Panel */}
                  <div
                    onClick={() => setActivePanelIndex(0)}
                    onPointerDown={(e) => handlePointerDown(e, 0)}
                    className={`relative w-full aspect-[18/12] bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
                      activePanelIndex === 0
                        ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                        : 'border-stone-300 shadow-md hover:border-stone-400'
                    }`}
                  >
                    {/* Gloss Glass Sheen Layer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-10" />

                    {panelImages[0]?.imageUrl ? (
                      <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                        <img
                          src={panelImages[0].imageUrl}
                          alt="Panel 1"
                          style={{
                            transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg)`,
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

                    {/* Active Indicator Tag */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
                      12" × 18"
                    </div>
                  </div>

                  {/* BOTTOM TWO PANELS: (2) 10" x 8" Vertical Panels Side-by-Side */}
                  <div className="grid grid-cols-2 gap-3.5 w-full">
                    {[1, 2].map((panelIdx) => (
                      <div
                        key={panelIdx}
                        onClick={() => setActivePanelIndex(panelIdx)}
                        onPointerDown={(e) => handlePointerDown(e, panelIdx)}
                        className={`relative w-full aspect-[8/10] bg-white rounded-lg overflow-hidden transition-all cursor-pointer group border-2 ${
                          activePanelIndex === panelIdx
                            ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                            : 'border-stone-300 shadow-md hover:border-stone-400'
                        }`}
                      >
                        {/* Glass Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-10" />

                        {panelImages[panelIdx]?.imageUrl ? (
                          <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                            <img
                              src={panelImages[panelIdx].imageUrl!}
                              alt={`Panel ${panelIdx + 1}`}
                              style={{
                                transform: `translate(${panelImages[panelIdx].panX}px, ${panelImages[panelIdx].panY}px) scale(${panelImages[panelIdx].scale}) rotate(${panelImages[panelIdx].rotation}deg)`,
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

                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
                          10" × 8"
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* SINGLE PANEL LAYOUTS (Block, Panel, Print, Signage) */}
              {selectedProductTypeId !== 'acrylic-wall-art' && panels.length === 1 && (
                <div
                  onClick={() => setActivePanelIndex(0)}
                  onPointerDown={(e) => handlePointerDown(e, 0)}
                  className={`relative w-full max-w-md aspect-[4/3] bg-white rounded-xl overflow-hidden transition-all cursor-pointer group border-2 ${
                    activePanelIndex === 0
                      ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                      : 'border-stone-300 shadow-md hover:border-stone-400'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-10" />

                  {panelImages[0]?.imageUrl ? (
                    <div className="w-full h-full overflow-hidden relative flex items-center justify-center">
                      <img
                        src={panelImages[0].imageUrl}
                        alt="Acrylic Print"
                        style={{
                          transform: `translate(${panelImages[0].panX}px, ${panelImages[0].panY}px) scale(${panelImages[0].scale}) rotate(${panelImages[0].rotation}deg)`,
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
                      <span className="text-xs font-bold text-stone-700">{currentSizeOption.dimensionsSummary}</span>
                      <span className="text-[11px] text-stone-400">Click to upload photo</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded z-20">
                    {currentSizeOption.dimensionsSummary}
                  </div>
                </div>
              )}

              {/* SPLIT ACRYLIC (3-Panel Triptych Layout) */}
              {selectedProductTypeId === 'acrylic-split' && panels.length === 3 && (
                <div className="grid grid-cols-3 gap-2 w-full max-w-lg aspect-[36/24]">
                  {[0, 1, 2].map((panelIdx) => (
                    <div
                      key={panelIdx}
                      onClick={() => setActivePanelIndex(panelIdx)}
                      onPointerDown={(e) => handlePointerDown(e, panelIdx)}
                      className={`relative w-full h-full bg-white rounded-lg overflow-hidden transition-all cursor-pointer border-2 ${
                        activePanelIndex === panelIdx
                          ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                          : 'border-stone-300 shadow-md'
                      }`}
                    >
                      {panelImages[panelIdx]?.imageUrl ? (
                        <img
                          src={panelImages[panelIdx].imageUrl!}
                          alt={`Split ${panelIdx}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                          <Upload className="w-4 h-4 text-[#E8752A] mb-1" />
                          <span className="text-[10px] font-bold">Part {panelIdx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PHOTO COLLAGE (4-Grid Layout) */}
              {selectedProductTypeId === 'acrylic-collage' && panels.length === 4 && (
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm aspect-square">
                  {[0, 1, 2, 3].map((panelIdx) => (
                    <div
                      key={panelIdx}
                      onClick={() => setActivePanelIndex(panelIdx)}
                      onPointerDown={(e) => handlePointerDown(e, panelIdx)}
                      className={`relative w-full h-full bg-white rounded-lg overflow-hidden transition-all cursor-pointer border-2 ${
                        activePanelIndex === panelIdx
                          ? 'border-[#0E4A93] shadow-2xl ring-2 ring-[#0E4A93]/30'
                          : 'border-stone-300 shadow-md'
                      }`}
                    >
                      {panelImages[panelIdx]?.imageUrl ? (
                        <img
                          src={panelImages[panelIdx].imageUrl!}
                          alt={`Slot ${panelIdx}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                          <Upload className="w-4 h-4 text-[#E8752A] mb-1" />
                          <span className="text-[10px] font-bold">Slot {panelIdx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Creative Overlays: Custom Text */}
              {customText && (
                <div
                  className="absolute pointer-events-none select-none z-30 font-black tracking-wide drop-shadow-md px-4 text-center max-w-xs"
                  style={{
                    color: textColor,
                    fontSize: `${textSize}px`,
                    textAlign: textAlign
                  }}
                >
                  {customText}
                </div>
              )}

              {/* Creative Overlays: Clipart */}
              {activeClipart && (
                <div className="absolute top-1/4 right-1/4 text-4xl pointer-events-none drop-shadow-lg z-30 animate-bounce">
                  {activeClipart}
                </div>
              )}

              {/* FLOATING TRANSFORM CONTROLS FOR ACTIVE PANEL */}
              {panelImages[activePanelIndex]?.imageUrl && (
                <div className="flex items-center gap-1.5 mt-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-stone-200 z-20">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    title="Zoom In (+15%)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    title="Zoom Out (-15%)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-stone-200 mx-0.5" />

                  <button
                    type="button"
                    onClick={handleRotate90}
                    className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleFit}
                    className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-xs font-bold"
                    title="Fit to bounds"
                  >
                    Fit
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    title="Reset transformations"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-stone-200 mx-0.5" />

                  <button
                    type="button"
                    onClick={() => {
                      setPanelImages((prev) => ({
                        ...prev,
                        [activePanelIndex]: { imageUrl: null, panX: 0, panY: 0, scale: 1, rotation: 0 }
                      }));
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
              Upload an image to continue with your personalized acrylic order.
            </div>
          )}

        </main>

      </div>

      {/* ===================================================================== */}
      {/* 3. POPUP MODALS                                                       */}
      {/* ===================================================================== */}

      {/* CHANGE MATERIAL MODAL (Acrylic-Only Glass Variants) */}
      {materialModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
                Select Acrylic Material Variant
              </h3>
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
                      isSelected
                        ? 'border-[#0E4A93] bg-blue-50/30'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
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

      {/* LIVE CHAT SUPPORT MODAL */}
      {chatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-stone-900">Need Customization Help?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Our acrylic printing specialists in Hyderabad are available to help with high-res photos and dimensions.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs font-bold">
              <a
                href="https://wa.me/917893051555?text=Hello%20Canvas%20India,%20I%20need%20help%20with%20customizing%20my%20Acrylic%20print."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>WhatsApp: 78930 51555</span>
              </a>
              <a
                href="tel:+917893051555"
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-stone-600" />
                <span>Call: 78930 51555</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setChatModalOpen(false)}
              className="text-xs text-stone-400 hover:text-stone-700 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HAMBURGER SIDE NAVIGATION MENU */}
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
                <Link
                  to={`/products/${catalogProduct.slug || catalogProduct.id}`}
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  ← Return to Product Page
                </Link>
                <Link
                  to="/acrylic"
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
                  View All Acrylic Products
                </Link>
                <Link
                  to="/"
                  className="block px-3 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 rounded-lg"
                >
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

            <div className="text-[11px] text-stone-400 pt-4 border-t border-stone-100">
              Canvas India &copy; 2026. All rights reserved.
            </div>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}

    </div>
  );
};

export default AcrylicCustomizerPage;
