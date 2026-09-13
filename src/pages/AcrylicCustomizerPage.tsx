import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  UploadCloud, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RefreshCw, 
  Type, 
  Smile, 
  Palette, 
  LayoutGrid, 
  Check, 
  AlertCircle, 
  ShoppingCart, 
  Trash2, 
  Save, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Box,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Plus,
  Minus,
  MessageSquare,
  SlidersHorizontal
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

type ToolbarTab = 'PRODUCTS' | 'UPLOAD' | 'SELECT SIZE' | 'LAYOUT' | 'HARDWARE' | 'OPTIONS';
type QuickTool = 'layouts' | 'text' | 'clipart' | 'background' | 'none';

const CLIPART_ITEMS = ['❤️', '⭐', '🎉', '🌸', '🎁', '✨', '😊', '🏆', '🌿', '💎', '🎂', '💍'];

const BG_COLOR_PALETTE = [
  { name: 'Pure White', value: '#FFFFFF', border: true },
  { name: 'Midnight Black', value: '#18181B', border: false },
  { name: 'Light Beige', value: '#F5F0E6', border: false },
  { name: 'Soft Pink', value: '#FCE7F3', border: false },
  { name: 'Sky Blue', value: '#E0F2FE', border: false },
  { name: 'Clear Glass', value: 'transparent', border: true },
];

const TEXT_COLOR_PALETTE = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Gold', value: '#D4AF37' },
  { name: 'Navy', value: '#0E4A93' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Emerald', value: '#059669' },
];

export const AcrylicCustomizerPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts, onAddToCartCustomized } = useShop();

  // Find Acrylic product by id or slug
  const product = useMemo(() => {
    return allProducts.find(
      (p) => (p.id === productId || p.slug === productId) && p.categorySlug === 'acrylic'
    ) || allProducts.find((p) => p.categorySlug === 'acrylic') || allProducts[0];
  }, [allProducts, productId]);

  // All other Acrylic products for the PRODUCTS tab
  const acrylicProducts = useMemo(() => {
    return allProducts.filter((p) => p.categorySlug === 'acrylic');
  }, [allProducts]);

  // Product configurations
  const availableSizes = useMemo(() => {
    return product.availableSizes || product.sizes || [
      '4" x 4"', '6" x 4"', '4" x 6"', '5" x 5"', '5" x 7"', '7" x 5"',
      '6" x 6"', '8" x 8"', '10" x 8"', '8" x 10"', '12" x 8"', '8" x 12"'
    ];
  }, [product]);

  const availableThicknesses = product.availableThicknesses || ['7mm', '18mm'];
  const availableStyles = product.availableStyles || ['Block', 'Shapes'];
  const availablePapers = product.availablePapers || ['White Luster Photo Paper', 'Metallic Pearl Paper'];
  const availableBases = product.availableBases || ['Without Base', 'Acrylic Base', 'Solid Wood Base'];

  // Initial values from query params or localStorage
  const storageKey = `ci_customization_${product.id}`;
  const savedData = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  // State Management
  const [activeTab, setActiveTab] = useState<ToolbarTab>('UPLOAD');
  const [activeQuickTool, setActiveQuickTool] = useState<QuickTool>('none');

  const [selectedSize, setSelectedSize] = useState<string>(
    searchParams.get('size') || savedData?.size || availableSizes[0] || '8" x 8"'
  );
  const [selectedThickness, setSelectedThickness] = useState<string>(
    searchParams.get('thickness') || savedData?.thickness || availableThicknesses[0] || '7mm'
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(
    searchParams.get('style') || savedData?.style || availableStyles[0] || 'Block'
  );
  const [selectedPaper, setSelectedPaper] = useState<string>(
    searchParams.get('paper') || savedData?.paper || availablePapers[0] || 'White Luster Photo Paper'
  );
  const [selectedBase, setSelectedBase] = useState<string>(
    searchParams.get('base') || savedData?.base || availableBases[0] || 'Without Base'
  );
  const [quantity, setQuantity] = useState<number>(
    parseInt(searchParams.get('qty') || '') || savedData?.quantity || 1
  );

  // Edge Wrap finish (Standard Edge, Diamond Polished Edge, Beveled Edge)
  const [edgeFinish, setEdgeFinish] = useState<string>(
    savedData?.edgeFinish || 'Diamond Polished Edge'
  );

  // Uploaded images
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    savedData?.uploadedImages || []
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Transformations
  const [scale, setScale] = useState<number>(savedData?.scale || 1);
  const [rotation, setRotation] = useState<number>(savedData?.rotation || 0);
  const [panX, setPanX] = useState<number>(savedData?.panX || 0);
  const [panY, setPanY] = useState<number>(savedData?.panY || 0);

  // Layout
  const [layout, setLayout] = useState<'single' | '2-split' | '3-collage' | '4-grid'>(
    savedData?.layout || 'single'
  );

  // Text
  const [customText, setCustomText] = useState<string>(savedData?.customText || '');
  const [textColor, setTextColor] = useState<string>(savedData?.textColor || '#FFFFFF');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(savedData?.textSize || 'md');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(savedData?.textAlign || 'center');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>(savedData?.textPosition || 'bottom');

  // Clipart
  const [selectedClipart, setSelectedClipart] = useState<string | null>(savedData?.selectedClipart || null);

  // Background
  const [bgColor, setBgColor] = useState<string>(savedData?.bgColor || '#FFFFFF');

  // Save Toast
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Price Calculation
  const unitPrice = useMemo(() => {
    let price = product.price;

    // Size adjustment
    if (selectedSize.includes('6" x 6"') || selectedSize.includes('5" x 7"') || selectedSize.includes('7" x 5"')) price += 200;
    else if (selectedSize.includes('8" x 8"') || selectedSize.includes('8" x 10"') || selectedSize.includes('10" x 8"')) price += 450;
    else if (selectedSize.includes('12" x 8"') || selectedSize.includes('8" x 12"') || selectedSize.includes('12" x 12"')) price += 700;
    else if (selectedSize.includes('12" x 18"') || selectedSize.includes('16" x 24"')) price += 1100;
    else if (selectedSize.includes('20" x 30"') || selectedSize.includes('24" x 36"') || selectedSize.includes('Set of 3')) price += 1800;
    else if (selectedSize.includes('30" x 48"') || selectedSize.includes('36" x 60"')) price += 2600;

    // Thickness adjustment
    if (selectedThickness === '18mm' || selectedThickness === '8mm' || selectedThickness === '10mm') price += 350;

    // Base adjustment
    if (selectedBase === 'Acrylic Base') price += 200;
    else if (selectedBase === 'Solid Wood Base') price += 250;
    else if (selectedBase === 'Chrome Floating Standoffs') price += 200;

    // Paper adjustment
    if (selectedPaper === 'Metallic Pearl Paper') price += 150;

    // Edge adjustment
    if (edgeFinish === 'Beveled Edge') price += 100;

    return price;
  }, [product.price, selectedSize, selectedThickness, selectedBase, selectedPaper, edgeFinish]);

  const originalUnitPrice = useMemo(() => Math.round(unitPrice * 1.4), [unitPrice]);
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = originalUnitPrice * quantity;

  // Aspect ratio calculation for the preview container
  const previewAspect = useMemo(() => {
    const s = selectedSize.toLowerCase();
    if (s.includes('4" x 4"') || s.includes('5" x 5"') || s.includes('6" x 6"') || s.includes('8" x 8"') || s.includes('12" x 12"')) {
      return 'aspect-square';
    }
    if (s.includes('6" x 4"') || s.includes('7" x 5"') || s.includes('10" x 8"') || s.includes('12" x 8"')) {
      return 'aspect-[3/2]';
    }
    if (s.includes('4" x 6"') || s.includes('5" x 7"') || s.includes('8" x 10"') || s.includes('8" x 12"')) {
      return 'aspect-[2/3]';
    }
    if (s.includes('12" x 18"') || s.includes('16" x 24"') || s.includes('20" x 30"') || s.includes('24" x 36"')) {
      return 'aspect-[2/3]';
    }
    return 'aspect-square';
  }, [selectedSize]);

  // Set document title
  useEffect(() => {
    document.title = `Customize: ${product.name} | Canvas India`;
    window.scrollTo(0, 0);
  }, [product]);

  // Auto-save customization to localStorage
  const handleSaveCustomization = () => {
    const snapshot = {
      size: selectedSize,
      thickness: selectedThickness,
      style: selectedStyle,
      paper: selectedPaper,
      base: selectedBase,
      quantity,
      edgeFinish,
      uploadedImages,
      scale,
      rotation,
      panX,
      panY,
      layout,
      customText,
      textColor,
      textSize,
      textAlign,
      textPosition,
      selectedClipart,
      bgColor,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(snapshot));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch {
      // ignore
    }
  };

  // Image Upload Handler
  const handleFileUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/bmp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
      setUploadError('Please select a valid PNG, JPG, JPEG, or WEBP image.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB maximum upload limit.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImages((prev) => [...prev, dataUrl]);
      setSelectedImageIndex(uploadedImages.length);
      setScale(1);
      setRotation(0);
      setPanX(0);
      setPanY(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // Transform Controls
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.15, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleFit = () => {
    setScale(1);
    setPanX(0);
    setPanY(0);
  };
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPanX(0);
    setPanY(0);
  };

  // Check if image upload is required and satisfied
  const isImageRequirementSatisfied = useMemo(() => {
    if (!product.uploadRequired) return true;
    return uploadedImages.length > 0;
  }, [product, uploadedImages]);

  // Add to Cart
  const handleAddToCart = () => {
    if (!isImageRequirementSatisfied) return;

    const primaryImage = uploadedImages[selectedImageIndex] || product.image;

    onAddToCartCustomized({
      product: {
        ...product,
        price: unitPrice,
      },
      quantity,
      size: selectedSize,
      finish: `${selectedThickness} Acrylic - ${selectedStyle} (${edgeFinish})`,
      customText,
      photoUrl: primaryImage,
      calculatedPrice: totalPrice,
      material: product.material,
      thickness: selectedThickness,
      style: selectedStyle,
      base: selectedBase,
      paper: selectedPaper,
      customizationDetails: {
        layout,
        text: customText,
        textColor,
        textSize,
        clipart: selectedClipart,
        bgColor,
        uploadedImagesCount: uploadedImages.length,
        scale,
        rotation,
        edgeFinish,
      }
    });

    setIsAddedToCart(true);
    setTimeout(() => {
      navigate('/cart');
    }, 400);
  };

  const currentImage = uploadedImages[selectedImageIndex] || null;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-stone-900 font-manrope flex flex-col justify-between select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (CANVAS INDIA BRANDING & ACTION CONTROLS)                   */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#0E4A93] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md shrink-0 z-30">
        
        {/* Left: Back & Breadcrumb title */}
        <div className="flex items-center gap-3">
          <Link
            to={`/products/${product.slug || product.id}`}
            className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Return to product page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Product</span>
          </Link>

          <div className="h-4 w-px bg-white/30 hidden sm:block" />

          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
              Create &amp; Customize
            </div>
            <div className="text-sm font-black truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </div>
          </div>
        </div>

        {/* Center: Brand Name (Canvas India) */}
        <div className="hidden md:flex items-center gap-2 font-black tracking-wider text-base text-white">
          <span className="text-amber-300">★</span>
          <span>CANVAS INDIA</span>
        </div>

        {/* Right Actions: Save Button & Chat indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveCustomization}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
            title="Save design progress in browser"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white" title="Canvas India Live Support">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-16 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Customization saved successfully!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOP TOOLBAR TABS (Matches Reference Screenshot)                         */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-b border-stone-200 shadow-2xs z-20 shrink-0">
        <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1.5">
            {[
              { id: 'PRODUCTS', label: 'PRODUCTS', icon: Box },
              { id: 'UPLOAD', label: 'UPLOAD', icon: UploadCloud },
              { id: 'SELECT SIZE', label: 'SELECT SIZE', icon: Maximize2 },
              { id: 'LAYOUT', label: 'LAYOUT', icon: LayoutGrid },
              { id: 'HARDWARE', label: 'HARDWARE', icon: Layers },
              { id: 'OPTIONS', label: 'OPTIONS', icon: SlidersHorizontal },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as ToolbarTab);
                    setActiveQuickTool('none');
                  }}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#0E4A93] border border-blue-200 shadow-xs ring-1 ring-[#0E4A93]/20'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: CANVAS + RIGHT TOOLS (Matches Reference)               */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col lg:flex-row items-center justify-center gap-6 relative">
        
        {/* CENTER: DESIGN CANVAS CONTAINER */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          
          {/* Selected Size Banner */}
          <div className="mb-3 text-center">
            <span className="text-xs sm:text-sm font-extrabold text-stone-700 bg-white px-3.5 py-1 rounded-full border border-stone-200 shadow-2xs inline-block">
              Selected Size: <strong className="text-stone-900">{selectedSize}</strong>
            </span>
          </div>

          {/* Actual Acrylic Canvas Shell with Aspect Ratio */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] ${previewAspect} bg-white rounded-2xl shadow-2xl border-4 border-white/90 overflow-hidden transition-all duration-300 flex items-center justify-center`}
            style={{ backgroundColor: bgColor }}
          >
            {/* 3D Acrylic Glass Beveled Depth Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-0 ring-1 ring-black/10 rounded-xl pointer-events-none z-20" />

            {/* If uploaded image exists -> render layout */}
            {currentImage ? (
              <div className="w-full h-full relative overflow-hidden">
                
                {/* 1. Single Image Layout */}
                {layout === 'single' && (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={currentImage}
                      alt="Custom Acrylic Artwork"
                      className="w-full h-full object-cover select-none transition-transform duration-100"
                      style={{
                        transform: `scale(${scale}) rotate(${rotation}deg) translate(${panX}px, ${panY}px)`
                      }}
                    />
                  </div>
                )}

                {/* 2. 2-Split Layout */}
                {layout === '2-split' && (
                  <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                    <div className="w-full h-full overflow-hidden rounded">
                      <img src={currentImage} alt="Slot 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full h-full overflow-hidden rounded bg-stone-100 flex items-center justify-center">
                      <img 
                        src={uploadedImages[1] || currentImage} 
                        alt="Slot 2" 
                        className={`w-full h-full object-cover ${uploadedImages[1] ? '' : 'opacity-80'}`} 
                      />
                    </div>
                  </div>
                )}

                {/* 3. 3-Collage Layout */}
                {layout === '3-collage' && (
                  <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
                    <div className="h-full overflow-hidden rounded">
                      <img src={currentImage} alt="Slot 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-rows-2 gap-1 h-full">
                      <div className="overflow-hidden rounded bg-stone-100">
                        <img src={uploadedImages[1] || currentImage} alt="Slot 2" className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden rounded bg-stone-100">
                        <img src={uploadedImages[2] || currentImage} alt="Slot 3" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. 4-Grid Layout */}
                {layout === '4-grid' && (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1 p-1">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="w-full h-full overflow-hidden rounded bg-stone-100">
                        <img 
                          src={uploadedImages[idx] || currentImage} 
                          alt={`Slot ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ) : (
              /* Empty Canvas Prompt (Matching Reference Arrow) */
              <div 
                onClick={() => {
                  setActiveTab('UPLOAD');
                  fileInputRef.current?.click();
                }}
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer border-2 border-dashed border-stone-300 hover:border-[#0E4A93] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0E4A93] flex items-center justify-center mb-2 animate-bounce">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                  Upload an Image
                </div>
                <p className="text-[11px] text-stone-500 mt-1 max-w-[200px]">
                  Maximum upload size: 25MB per file (PNG, JPG, WEBP)
                </p>
                <span className="mt-3 px-3 py-1 bg-[#0E4A93] text-white text-[11px] font-bold rounded-lg shadow-xs">
                  Choose Image
                </span>
              </div>
            )}

            {/* Clipart Emoji Overlay */}
            {selectedClipart && (
              <div className="absolute top-3 left-3 z-30 text-3xl drop-shadow-lg select-none animate-in zoom-in-50">
                {selectedClipart}
              </div>
            )}

            {/* Custom Text Overlay */}
            {customText.trim() !== '' && (
              <div 
                className={`absolute left-4 right-4 z-30 pointer-events-none px-3 py-1 rounded bg-black/35 backdrop-blur-2xs ${
                  textPosition === 'top' ? 'top-4' : textPosition === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-4'
                }`}
                style={{ textAlign }}
              >
                <span 
                  className={`font-black drop-shadow-md leading-tight block ${
                    textSize === 'sm' ? 'text-xs sm:text-sm' : textSize === 'md' ? 'text-sm sm:text-base' : textSize === 'lg' ? 'text-base sm:text-xl' : 'text-xl sm:text-2xl'
                  }`}
                  style={{ color: textColor }}
                >
                  {customText}
                </span>
              </div>
            )}

            {/* Bottom Left: Edge & Thickness Tag */}
            <div className="absolute bottom-2 left-2 z-25 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
              {selectedThickness} • {edgeFinish}
            </div>
          </div>

          {/* On-Canvas Image Tools Toolbar */}
          {currentImage && (
            <div className="mt-4 bg-white px-4 py-2 rounded-full border border-stone-300 shadow-md flex items-center gap-2 text-xs text-stone-700">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleFit}
                className="p-1 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                title="Fit to Canvas"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1 hover:text-[#0E4A93] hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                title="Reset Position"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR QUICK TOOLS (Matches Reference Screenshot Column) */}
        <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col gap-2 justify-center">
          {[
            { id: 'layouts', label: 'Layouts & Designs', icon: LayoutGrid },
            { id: 'text', label: 'Add Text', icon: Type },
            { id: 'clipart', label: 'Add Clipart', icon: Smile },
            { id: 'background', label: 'Background', icon: Palette },
          ].map((tool) => {
            const isSelected = activeQuickTool === tool.id;
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  setActiveQuickTool(isSelected ? 'none' : (tool.id as QuickTool));
                }}
                className={`flex-1 lg:w-full p-2.5 rounded-xl border flex flex-col lg:flex-row items-center gap-2 text-center lg:text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-[#0E4A93] text-[#0E4A93] font-black shadow-xs ring-1 ring-[#0E4A93]'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-bold'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-[#0E4A93]" />
                <span className="text-[11px] font-extrabold truncate">{tool.label}</span>
              </button>
            );
          })}
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. EXPANDABLE QUICK TOOL PANELS (Text, Clipart, Layout, Background)         */}
      {/* ========================================================================= */}
      {activeQuickTool !== 'none' && (
        <div className="w-full bg-white border-t border-stone-200 p-4 shadow-lg animate-in slide-in-from-bottom-2 z-20">
          <div className="w-full max-w-[1680px] mx-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900">
                {activeQuickTool === 'layouts' && 'Choose Collage Layout'}
                {activeQuickTool === 'text' && 'Add Custom Text Overlay'}
                {activeQuickTool === 'clipart' && 'Select Clipart / Icon'}
                {activeQuickTool === 'background' && 'Select Base Background Color'}
              </span>
              <button 
                type="button" 
                onClick={() => setActiveQuickTool('none')} 
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Tool: Layouts */}
            {activeQuickTool === 'layouts' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'single', name: 'Single Image', desc: '1 Full Image' },
                  { id: '2-split', name: '2 Image Split', desc: 'Side by Side' },
                  { id: '3-collage', name: '3 Image Collage', desc: 'Featured + 2' },
                  { id: '4-grid', name: '4 Image Grid', desc: '2x2 Grid' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLayout(item.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      layout === item.id ? 'bg-blue-50 border-[#0E4A93] text-[#0E4A93] font-black' : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Tool: Text */}
            {activeQuickTool === 'text' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Type custom message (e.g. Happy Anniversary, Forever Loved)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0E4A93] focus:bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-stone-500">Color:</span>
                    {TEXT_COLOR_PALETTE.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setTextColor(c.value)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          textColor === c.value ? 'scale-110 border-[#0E4A93]' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: c.value }}
                      >
                        {textColor === c.value && <Check className={`w-3 h-3 ${c.value === '#FFFFFF' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-1">Font Size</label>
                    <select
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 mb-1">Position</label>
                    <select
                      value={textPosition}
                      onChange={(e) => setTextPosition(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tool: Clipart */}
            {activeQuickTool === 'clipart' && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {CLIPART_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedClipart(selectedClipart === item ? null : item)}
                    className={`w-12 h-12 text-2xl rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      selectedClipart === item ? 'bg-blue-50 border-[#0E4A93] scale-105 shadow-xs' : 'bg-white border-stone-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Tool: Background */}
            {activeQuickTool === 'background' && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {BG_COLOR_PALETTE.map((bg) => (
                  <button
                    key={bg.name}
                    type="button"
                    onClick={() => setBgColor(bg.value)}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer ${
                      bgColor === bg.value ? 'bg-blue-50 border-[#0E4A93]' : 'bg-white border-stone-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ backgroundColor: bg.value }} />
                    <span className="text-[11px] font-bold truncate">{bg.name}</span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DEDICATED TOOL TAB PANELS (Products, Upload, Size, Hardware, Options)  */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border-t border-stone-200 py-4 px-4 sm:px-8 shrink-0 z-10">
        <div className="w-full max-w-[1680px] mx-auto">
          
          {/* A. PRODUCTS TAB */}
          {activeTab === 'PRODUCTS' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-900">
                  Current Acrylic Product: <span className="text-[#0E4A93]">{product.name}</span>
                </span>
                <span className="text-xs text-stone-500 font-semibold">
                  Switch Acrylic Product:
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {acrylicProducts.map((p) => {
                  const isCurrent = p.id === product.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigate(`/customize/acrylic/${p.slug || p.id}`)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 border-[#0E4A93] ring-1 ring-[#0E4A93]'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate text-stone-900">{p.name}</div>
                      <div className="text-[10px] text-[#0E4A93] font-extrabold mt-0.5">From ₹{p.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* B. UPLOAD TAB */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-stone-900">
                    Upload Photos (PNG, JPG, BMP accepted, &lt;25MB)
                  </span>
                  <div className="text-[11px] text-stone-500">
                    Drag your images to proceed, or choose from device
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg,image/bmp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#70a800] hover:bg-[#5f8f00] text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>UPLOAD</span>
                  </button>
                </div>
              </div>

              {uploadError && (
                <div className="text-xs text-rose-600 font-bold">
                  {uploadError}
                </div>
              )}

              {/* Thumbnails strip */}
              {uploadedImages.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                  {uploadedImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                        selectedImageIndex === idx ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/30' : 'border-stone-300'
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-rose-600 font-bold hover:underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {/* C. SELECT SIZE TAB */}
          {activeTab === 'SELECT SIZE' && (
            <div className="space-y-2 animate-in fade-in">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block">
                Select Acrylic Dimension
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-[#0E4A93] text-[#0E4A93] font-black ring-1 ring-[#0E4A93]'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800 font-bold'
                      }`}
                    >
                      <div className="text-xs">{size}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* D. LAYOUT TAB */}
          {activeTab === 'LAYOUT' && (
            <div className="space-y-2 animate-in fade-in">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block">
                Select Collage Arrangement
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'single', name: 'Single Image', desc: '1 Full Image' },
                  { id: '2-split', name: '2 Image Split', desc: 'Side by Side' },
                  { id: '3-collage', name: '3 Image Collage', desc: 'Featured + 2' },
                  { id: '4-grid', name: '4 Image Grid', desc: '2x2 Grid' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLayout(item.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      layout === item.id ? 'bg-blue-50 border-[#0E4A93] text-[#0E4A93] font-black' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* E. HARDWARE / BASE TAB */}
          {activeTab === 'HARDWARE' && (
            <div className="space-y-2 animate-in fade-in">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 block">
                Select Acrylic Display Hardware &amp; Base
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableBases.map((base) => {
                  const isSelected = selectedBase === base;
                  return (
                    <button
                      key={base}
                      type="button"
                      onClick={() => setSelectedBase(base)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected ? 'bg-blue-50 border-[#0E4A93] text-[#0E4A93] font-black ring-1 ring-[#0E4A93]' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="text-xs font-bold">{base}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {base === 'Without Base' ? 'Freestanding' : base === 'Solid Wood Base' ? '+₹250' : '+₹200'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* F. OPTIONS TAB */}
          {activeTab === 'OPTIONS' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {/* Thickness */}
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Thickness</label>
                  <select
                    value={selectedThickness}
                    onChange={(e) => setSelectedThickness(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold"
                  >
                    {availableThicknesses.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Style */}
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold"
                  >
                    {availableStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Paper */}
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Print Paper</label>
                  <select
                    value={selectedPaper}
                    onChange={(e) => setSelectedPaper(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold"
                  >
                    {availablePapers.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Edge Finish */}
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Edge Finish</label>
                  <select
                    value={edgeFinish}
                    onChange={(e) => setEdgeFinish(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold"
                  >
                    <option value="Standard Edge">Standard Edge</option>
                    <option value="Diamond Polished Edge">Diamond Polished Edge</option>
                    <option value="Beveled Edge">Beveled Edge (+₹100)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. BOTTOM STICKY PURCHASE BAR (Matches Reference Screenshot)              */}
      {/* ========================================================================= */}
      <footer className="w-full bg-white border-t border-stone-200 py-3.5 px-4 sm:px-8 shadow-xl shrink-0 z-30">
        <div className="w-full max-w-[1680px] mx-auto flex items-center justify-between gap-4">
          
          {/* Price details */}
          <div>
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Your Discounted Price
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-stone-950">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ₹{totalOriginalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">
                ({selectedSize} • {selectedThickness})
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3">
            
            {/* Quantity */}
            <div className="hidden sm:inline-flex items-center border border-stone-300 rounded-xl bg-white">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-2.5 py-1 text-stone-600 hover:text-stone-900 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ADD TO CART BUTTON */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isImageRequirementSatisfied}
              className={`px-6 sm:px-10 py-3 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                isImageRequirementSatisfied
                  ? 'bg-[#0E4A93] hover:bg-[#09356A] text-white active:scale-[0.99]'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isImageRequirementSatisfied ? 'ADD TO CART' : 'Upload an image to continue'}
              </span>
            </button>

          </div>

        </div>
      </footer>

    </div>
  );
};
export default AcrylicCustomizerPage;
