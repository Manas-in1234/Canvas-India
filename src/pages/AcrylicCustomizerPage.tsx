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
  textElements: TextElement[];
  clipartElements: ClipartElement[];
}

export type SelectedElementType = 'image' | 'text' | 'clipart';

export interface SelectedElement {
  type: SelectedElementType;
  panelIndex: number;
  elementId?: string;
}

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Bodoni Moda', value: '"Bodoni Moda", serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Brush Script / Cursive', value: '"Brush Script MT", "Cormorant Garamond", cursive, serif' }
];

const COLOR_PRESETS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#0E4A93' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Orange', hex: '#E8752A' },
  { name: 'Green', hex: '#16A34A' },
  { name: 'Purple', hex: '#9333EA' }
];

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
  textElements: [],
  clipartElements: []
});

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
    0: createDefaultPanelState(),
    1: createDefaultPanelState(),
    2: createDefaultPanelState(),
    3: createDefaultPanelState()
  });

  // Currently Active Panel Slot for drag/transform/upload targeting
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  // Selected Element for Contextual Toolbar
  const [selectedElement, setSelectedElement] = useState<SelectedElement>({
    type: 'image',
    panelIndex: 0
  });

  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [showClipartSelector, setShowClipartSelector] = useState<boolean>(false);
  const [showPositionPopover, setShowPositionPopover] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetPanelRef = useRef<number>(0);

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

  // Modals & Drawers
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
  const [pricePopoverOpen, setPricePopoverOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
        if (data.uploadedPhotos) setUploadedPhotos(data.uploadedPhotos);
        if (data.panelImages) {
          const loadedPanels: Record<number, PanelImageState> = {};
          Object.keys(data.panelImages).forEach((k) => {
            const idx = Number(k);
            const p = data.panelImages[idx];
            loadedPanels[idx] = {
              imageUrl: p.imageUrl || null,
              panX: p.panX || 0,
              panY: p.panY || 0,
              scale: p.scale || 1,
              rotation: p.rotation || 0,
              textElements: Array.isArray(p.textElements) ? p.textElements : [],
              clipartElements: Array.isArray(p.clipartElements) ? p.clipartElements : []
            };
          });
          setPanelImages((prev) => ({ ...prev, ...loadedPanels }));
        }
      }
    } catch {
      // Safe fallback
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
        panelImages,
        uploadedPhotos,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      setSaveToast('✓ Customization saved successfully!');
      setTimeout(() => setSaveToast(null), 3000);
    } catch {
      setSaveToast('Notice: Could not save to localStorage.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Unit Price Calculation
  const unitPrice = useMemo(() => {
    let price = currentSizeOption.price;
    const finish = FINISH_OPTIONS.find((f) => f.id === selectedFinishId);
    if (finish) price += finish.price;

    const hardware = HARDWARE_OPTIONS.find((h) => h.id === selectedHardwareId);
    if (hardware) price += hardware.price;

    const thickness = THICKNESS_OPTIONS.find((t) => t.id === selectedThicknessId);
    if (thickness) price += thickness.price;

    const paper = PAPER_OPTIONS.find((p) => p.id === selectedPaperId);
    if (paper) price += paper.price;

    if (selectedMaterialId === 'premium-cast') price += 250;
    if (selectedMaterialId === 'ultra-hd') price += 450;

    return price;
  }, [currentSizeOption.price, selectedFinishId, selectedHardwareId, selectedThicknessId, selectedPaperId, selectedMaterialId]);

  const totalPrice = unitPrice * quantity;

  // Validation: Check if every required panel in current size has an image
  const firstEmptyPanelIndex = useMemo(() => {
    for (let i = 0; i < panels.length; i++) {
      if (!panelImages[i]?.imageUrl) return i;
    }
    return -1;
  }, [panels, panelImages]);

  const isComplete = firstEmptyPanelIndex === -1;

  // Active Frame & Active Sub-element state getters
  const activeFrame = panelImages[activePanelIndex] || createDefaultPanelState();

  const activeTextElement = useMemo(() => {
    if (selectedElement.type === 'text' && selectedElement.elementId) {
      const frame = panelImages[selectedElement.panelIndex];
      return frame?.textElements.find((t) => t.id === selectedElement.elementId) || null;
    }
    return null;
  }, [selectedElement, panelImages]);

  const activeClipartElement = useMemo(() => {
    if (selectedElement.type === 'clipart' && selectedElement.elementId) {
      const frame = panelImages[selectedElement.panelIndex];
      return frame?.clipartElements.find((c) => c.id === selectedElement.elementId) || null;
    }
    return null;
  }, [selectedElement, panelImages]);

  // Frame State Updaters
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

  const handleScaleChange = (newScale: number) => {
    updateActiveFrame((curr) => ({
      ...curr,
      scale: Math.min(3.5, Math.max(0.5, Number(newScale.toFixed(2))))
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
      rotation: 0
    }));
  };

  // Replace / Remove Image
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

  // Empty Frame Click-To-Upload
  const handleEmptyFrameClick = (panelIdx: number) => {
    setActivePanelIndex(panelIdx);
    setSelectedElement({ type: 'image', panelIndex: panelIdx });
    uploadTargetPanelRef.current = panelIdx;
    singleFileInputRef.current?.click();
  };

  // Single File Picker Change Handler
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

  // Gallery Multiple Files Upload Handler
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
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Alias for gallery files upload
  const handleFilesUpload = handleGalleryUpload;

  // Assign photo from gallery to panel
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
  };

  // Text Actions
  const handleAddText = () => {
    const newText: TextElement = {
      id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      text: 'Custom Text',
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

  // Clipart Actions
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

  const handleRotateSelectedClipart = () => {
    if (!activeClipartElement) return;
    updateSelectedClipart({ rotation: (activeClipartElement.rotation + 90) % 360 });
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

  // Pointer Drag Engine
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

  // Add to Cart Action
  const handleAddToCart = () => {
    if (!isComplete) {
      const missingIdx = firstEmptyPanelIndex;
      const missingPanel = panels[missingIdx];
      const msg = `Please upload an image for ${missingPanel?.label || `Frame ${missingIdx + 1}`}.`;
      setValidationWarning(msg);
      setActivePanelIndex(missingIdx);
      setSelectedElement({ type: 'image', panelIndex: missingIdx });
      uploadTargetPanelRef.current = missingIdx;
      singleFileInputRef.current?.click();
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
          panY: panelImages[idx]?.panY || 0,
          textElements: panelImages[idx]?.textElements || [],
          clipartElements: panelImages[idx]?.clipartElements || []
        })),
        unitPrice,
        totalPrice
      }
    });

    navigate('/cart');
  };

  // Render Frame Helper (Unified interactive canvas rendering for every Acrylic panel)
  const renderFrame = (panelIdx: number, aspectClass: string, dimensionLabel?: string) => {
    const frame = panelImages[panelIdx] || createDefaultPanelState();
    const isActive = activePanelIndex === panelIdx;
    const isTargetEmpty = !frame.imageUrl;
    const panelInfo = panels[panelIdx];
    const label = dimensionLabel || panelInfo?.dimension || `Frame ${panelIdx + 1}`;

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
      >
        {/* Gloss Glass Sheen Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-20" />

        {/* Frame Badge (Frame Number / Label) */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
          <span>{panelInfo?.label || `Frame ${panelIdx + 1}`}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8752A] animate-pulse" />
          )}
        </div>

        {/* Frame Dimension Badge */}
        <div className="absolute bottom-2 left-2 bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm z-30 pointer-events-none">
          {label}
        </div>

        {/* Frame Content */}
        {frame.imageUrl ? (
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center"
            onPointerDown={(e) => startImageDrag(e, panelIdx)}
          >
            {/* Transformed Image */}
            <img
              src={frame.imageUrl}
              alt={label}
              draggable={false}
              style={{
                transform: `translate(${frame.panX}px, ${frame.panY}px) scale(${frame.scale}) rotate(${frame.rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.12s ease-out'
              }}
              className="max-w-none w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Text Elements Attached to this Frame */}
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
                  className={`max-w-[85%] px-2 py-1 select-none font-bold tracking-wide drop-shadow-md z-30 cursor-move transition-shadow ${
                    isTextSelected
                      ? 'ring-2 ring-dashed ring-[#0E4A93] bg-blue-500/20 rounded'
                      : 'hover:ring-1 hover:ring-white/80 rounded'
                  }`}
                >
                  {txt.text}
                </div>
              );
            })}

            {/* Clipart Elements Attached to this Frame */}
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
                    fontSize: '36px'
                  }}
                  className={`select-none drop-shadow-lg z-30 cursor-move p-1 transition-transform ${
                    isClipSelected
                      ? 'ring-2 ring-dashed ring-[#0E4A93] bg-blue-500/20 rounded-full'
                      : 'hover:scale-110'
                  }`}
                >
                  {clip.emoji}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Frame Placeholder - Clicking directly anywhere opens file picker */
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEmptyFrameClick(panelIdx);
            }}
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-50/90 hover:bg-orange-50/50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100/90 text-[#E8752A] flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 group-hover:bg-[#E8752A] group-hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-stone-800 tracking-tight">
              CLICK TO UPLOAD
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">
              {panelInfo?.label || `Frame ${panelIdx + 1}`} ({label})
            </span>
            <span className="text-[10px] text-[#0E4A93] font-bold mt-1 group-hover:underline">
              Tap to choose photo
            </span>
          </div>
        )}
      </div>
    );
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

      {/* Hidden Targeted Frame File Input */}
      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/bmp"
        className="hidden"
        onChange={(e) => {
          handleSingleFileChange(e.target.files?.[0] || null);
          e.target.value = '';
        }}
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

          {/* Validation Alert Banner (Shown when Add to Cart is clicked with empty frames) */}
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
            <span>Click and drag within any frame to adjust your photo, or click empty frames to upload.</span>
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

          {/* Clipart Emoji Selector Popover */}
          {showClipartSelector && (
            <div className="absolute top-20 right-4 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 text-xs z-30 animate-in fade-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900 pb-2 border-b border-stone-100">
                <span>Add Clipart to Active Frame</span>
                <button
                  type="button"
                  onClick={() => setShowClipartSelector(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-2xl text-center max-h-56 overflow-y-auto p-1">
                {['❤️', '💖', '⭐', '✨', '🎉', '🔥', '👑', '💍', '🌸', '🌿', '🎁', '🏆', '✈️', '☀️', '🌙', '🦋', '🎂', '🎈', '🍾', '☕', ...CLIPART_ITEMS.filter((i) => !['❤️', '⭐', '✨', '🎉'].includes(i))].map((item, i) => (
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

          {/* Notification Toast for Save */}
          {saveToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-30 animate-in fade-in slide-in-from-top-2">
              {saveToast}
            </div>
          )}

          {/* Center Stage / Design Canvas Area */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto"
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
                <div className="flex flex-col items-center gap-3 w-full max-w-lg">
                  {renderFrame(0, 'aspect-[18/12] w-full', '12" × 18"')}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {renderFrame(1, 'aspect-[8/10] w-full', '10" × 8"')}
                    {renderFrame(2, 'aspect-[8/10] w-full', '10" × 8"')}
                  </div>
                </div>
              )}

              {/* SPLIT ACRYLIC (3-Panel Triptych Layout) */}
              {selectedProductTypeId === 'acrylic-split' && panels.length === 3 && (
                <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg aspect-[36/24]">
                  {[0, 1, 2].map((panelIdx) => renderFrame(panelIdx, 'h-full w-full', `Part ${panelIdx + 1}`))}
                </div>
              )}

              {/* PHOTO COLLAGE (4-Grid Layout) */}
              {selectedProductTypeId === 'acrylic-collage' && panels.length === 4 && (
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm aspect-square">
                  {[0, 1, 2, 3].map((panelIdx) => renderFrame(panelIdx, 'aspect-square w-full', `Slot ${panelIdx + 1}`))}
                </div>
              )}

              {/* SINGLE PANEL LAYOUTS (Block, Panel, Print, Signage, Wall Plaque, etc.) */}
              {selectedProductTypeId !== 'acrylic-wall-art' &&
               selectedProductTypeId !== 'acrylic-split' &&
               selectedProductTypeId !== 'acrylic-collage' && (
                <div className="w-full max-w-md flex justify-center">
                  {renderFrame(0, 'aspect-[4/3] w-full', currentSizeOption.dimensionsSummary)}
                </div>
              )}

              {/* MULTI-FRAME SELECTOR PILLS */}
              {panels.length > 1 && (
                <div className="flex items-center gap-1.5 mt-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-xl border border-stone-200 shadow-xs flex-wrap justify-center">
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase px-1">Frames:</span>
                  {panels.map((p, idx) => {
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
                        <span>{p.label || `Frame ${idx + 1}`}</span>
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

              {/* CONTEXTUAL TOOLBAR BASED ON SELECTED ELEMENT */}
              <div className="w-full max-w-xl flex flex-col items-center gap-2 mt-3 z-20">
                {/* 1. IMAGE CONTROLS FOR ACTIVE FRAME */}
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

                      {/* Scale Slider */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-stone-50 rounded-lg border border-stone-200">
                        <input
                          type="range"
                          min={0.5}
                          max={3.0}
                          step={0.05}
                          value={activeFrame.scale}
                          onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                          className="w-16 sm:w-20 accent-[#0E4A93] cursor-pointer"
                          title="Resize / Scale Image"
                        />
                        <span className="text-[11px] font-bold text-stone-700 w-9 text-right">
                          {Math.round(activeFrame.scale * 100)}%
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Zoom In (+15%)"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-px h-5 bg-stone-200" />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleRotate90}
                        className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span className="text-[11px] font-bold hidden sm:inline">{activeFrame.rotation}°</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFit}
                        className="px-2 py-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                        title="Fit to Frame"
                      >
                        Fit
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Reset"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-px h-5 bg-stone-200" />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleReplaceImage(activePanelIndex)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        title="Replace photo in this frame"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#E8752A]" />
                        <span>Replace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(activePanelIndex)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove photo from this frame"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. TEXT CONTROLS FOR SELECTED TEXT */}
                {selectedElement.type === 'text' && activeTextElement && (
                  <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-stone-200 text-xs">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={activeTextElement.text}
                        onChange={(e) => updateSelectedText({ text: e.target.value })}
                        className="px-2 py-1 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#0E4A93] w-28 sm:w-36"
                        placeholder="Edit text"
                      />

                      <select
                        value={activeTextElement.fontFamily}
                        onChange={(e) => updateSelectedText({ fontFamily: e.target.value })}
                        className="px-2 py-1 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#0E4A93]"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-px h-5 bg-stone-200" />

                    {/* Font Size & Colors */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 bg-stone-100 rounded-lg px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateSelectedText({ fontSize: Math.max(12, activeTextElement.fontSize - 2) })}
                          className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 rounded text-xs font-black cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold text-stone-700 w-7 text-center">
                          {activeTextElement.fontSize}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateSelectedText({ fontSize: Math.min(64, activeTextElement.fontSize + 2) })}
                          className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 rounded text-xs font-black cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Color Presets */}
                      <div className="flex items-center gap-1">
                        {COLOR_PRESETS.map((col) => (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => updateSelectedText({ color: col.hex })}
                            style={{ backgroundColor: col.hex }}
                            className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                              activeTextElement.color === col.hex ? 'ring-2 ring-[#0E4A93] scale-110' : 'border-stone-300 hover:scale-105'
                            }`}
                            title={col.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="w-px h-5 bg-stone-200" />

                    {/* Alignment & Position Presets */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateSelectedText({ alignment: 'left' })}
                        className={`px-1.5 py-1 rounded text-xs font-bold cursor-pointer ${activeTextElement.alignment === 'left' ? 'bg-[#0E4A93] text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                        title="Align Left"
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSelectedText({ alignment: 'center' })}
                        className={`px-1.5 py-1 rounded text-xs font-bold cursor-pointer ${activeTextElement.alignment === 'center' ? 'bg-[#0E4A93] text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                        title="Align Center"
                      >
                        C
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSelectedText({ alignment: 'right' })}
                        className={`px-1.5 py-1 rounded text-xs font-bold cursor-pointer ${activeTextElement.alignment === 'right' ? 'bg-[#0E4A93] text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                        title="Align Right"
                      >
                        R
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPositionPopover(!showPositionPopover)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          showPositionPopover ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                        }`}
                        title="Position Presets"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Position</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteSelectedText}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete this text"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. CLIPART CONTROLS FOR SELECTED CLIPART */}
                {selectedElement.type === 'clipart' && activeClipartElement && (
                  <div className="flex flex-wrap items-center justify-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-stone-200 text-xs">
                    <span className="text-xl px-1">{activeClipartElement.emoji}</span>

                    {/* Clipart Scale */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-stone-50 rounded-lg border border-stone-200">
                      <button
                        type="button"
                        onClick={() => updateSelectedClipart({ scale: Math.max(0.5, Number((activeClipartElement.scale - 0.1).toFixed(1))) })}
                        className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 rounded text-xs font-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-[11px] font-bold text-stone-700 w-10 text-center">
                        {Math.round(activeClipartElement.scale * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => updateSelectedClipart({ scale: Math.min(3.0, Number((activeClipartElement.scale + 0.1).toFixed(1))) })}
                        className="w-5 h-5 flex items-center justify-center hover:bg-stone-200 rounded text-xs font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-px h-5 bg-stone-200" />

                    <button
                      type="button"
                      onClick={handleRotateSelectedClipart}
                      className="p-1.5 text-stone-700 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      title="Rotate Clipart 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span className="text-[11px] font-bold">{activeClipartElement.rotation}°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPositionPopover(!showPositionPopover)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        showPositionPopover ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                      }`}
                      title="Position Presets"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Position</span>
                    </button>

                    <div className="w-px h-5 bg-stone-200" />

                    <button
                      type="button"
                      onClick={handleDeleteSelectedClipart}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete this clipart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 4. POSITION PRESETS POPOVER (9-Point Grid) */}
                {showPositionPopover && (
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-stone-200 text-xs animate-in fade-in zoom-in-95 z-30">
                    <div className="text-[11px] font-extrabold text-stone-700 mb-2 text-center uppercase tracking-wider">
                      Snap to Position
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 w-44 mx-auto">
                      {POSITION_PRESETS.map((pos) => (
                        <button
                          key={pos.label}
                          type="button"
                          onClick={() => handleApplyPositionPreset(pos.x, pos.y)}
                          className="p-2 rounded-lg bg-stone-100 hover:bg-[#0E4A93] hover:text-white text-stone-700 text-[10px] font-bold transition-all text-center cursor-pointer"
                          title={pos.title}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Button: CHANGE MATERIAL (Canvas India Blue #0E4A93) */}
              <div className="mt-4">
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
