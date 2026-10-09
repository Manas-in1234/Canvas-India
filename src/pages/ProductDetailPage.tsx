import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Share2,
  ArrowRight,
  CheckCircle2,
  Layers,
  Pencil
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { WallPreview } from '../components/WallPreview';
import { SmartCropImage } from '../components/SmartCropImage';
import { Product } from '../types';
import { AcrylicProductDetailPage } from './AcrylicProductDetailPage';

// Sentinel inserted as the first gallery slot for wall-hangable categories so
// the "Room View" thumbnail renders a live WallPreview instead of a static image.
const ROOM_VIEW_SENTINEL = '__ROOM_VIEW__';

// Default to the largest available size so the product — and its Room View
// — looks substantial right away, instead of starting on the tiniest
// option. Size lists are ordered smallest-to-largest.
function pickDefaultSize(sizes?: string[]): string | undefined {
  if (!sizes || sizes.length === 0) return undefined;
  return sizes[sizes.length - 1];
}

// Simple outline swatch standing in for each shape in the icon-based Shape
// tab, styled as a small rectangle whose own proportions hint at the shape
// it represents.
function ShapeIcon({ shape, active }: { shape: string; active: boolean }) {
  const dims: Record<string, string> = {
    standard: 'w-5 h-6',
    square: 'w-6 h-6',
    rectangle: 'w-7 h-5',
    panoramic: 'w-8 h-4',
  };
  return (
    <div
      className={`${dims[shape.toLowerCase()] || 'w-6 h-6'} rounded-sm border-2 ${
        active ? 'border-[#0E4A93]' : 'border-stone-400'
      }`}
    />
  );
}

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onAddToCart, 
    onOpenCustomize 
  } = useShop();

  // Find product by id or slug
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === productId || p.slug === productId);
  }, [allProducts, productId]);

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  // Variant state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<number>(8);
  const [customHeight, setCustomHeight] = useState<number>(8);
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [sizeShapeTab, setSizeShapeTab] = useState<'size' | 'shape'>('size');
  const [customSizeOpen, setCustomSizeOpen] = useState<boolean>(false);
  const [customSizeW, setCustomSizeW] = useState<string>('');
  const [customSizeH, setCustomSizeH] = useState<string>('');

  // In-page customization state
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Materials available for this product
  const availableMaterials = useMemo(() => {
    if (!product) return ['Premium Archival Grade Material'];
    if (product.material) {
      return [product.material];
    }
    switch (product.categorySlug) {
      case 'canvas':
        return ['380 GSM Cotton Canvas', 'Satin Lustre Canvas', 'Museum Archival Blend'];
      case 'acrylic':
        return ['5mm Cast Optical Acrylic', '3mm Ultra-Clear Acrylic', '8mm Heavy Glass Acrylic'];
      case 'cork':
        return ['8mm Natural Portuguese Cork', 'High-Density Fine Grain Cork', 'Acoustic Backed Cork'];
      case 'yoga-fitness':
        return ['Natural Tree Rubber & Microfiber', 'Eco TPE High Grip', 'Dual-Layer Cushioned Foam'];
      case 'posters':
        return ['300 GSM Heavyweight Matte Paper', 'Lustre Coated Archival Paper', 'Tear-Proof Coated Film'];
      default:
        return ['Premium Archival Grade Material'];
    }
  }, [product]);

  // Categories that only need Size + Frame (Finish) selection — no Shape
  // picker, no Custom dimensions.
  const SIMPLE_VARIANT_CATEGORIES = ['cork', 'cork-art-patterns', 'yoga-fitness'];

  // Shape options for this product. Every wall-hangable category gets the
  // same reduced shape range by default (Cork and yoga mats don't use
  // shapes); products can still override with their own explicit list.
  const availableShapes = useMemo(() => {
    if (!product) return [];
    if (product.shapes && product.shapes.length > 0) return product.shapes;
    if (SIMPLE_VARIANT_CATEGORIES.includes(product.categorySlug)) return [];
    return ['Standard', 'Square', 'Rectangle', 'Panoramic'];
  }, [product]);

  const showCustomSize = product ? !SIMPLE_VARIANT_CATEGORIES.includes(product.categorySlug) : true;

  // Sync variants when product changes
  useEffect(() => {
    if (product) {
      const defaultShape = product.shape || availableShapes[0] || '';
      setSelectedSize(pickDefaultSize(product.availableSizes) || pickDefaultSize(product.sizes) || '12x18 inch');
      setSelectedFinish(product.finishes?.[0] || 'Standard Finish');
      setSelectedMaterial(availableMaterials[0] || 'Standard');
      setSelectedShape(defaultShape);
      setIsCustomSize(false);
      setCustomWidth(8);
      setCustomHeight(8);
      setQuantity(1);
      setActiveImageIndex(0);
      setCustomText('');
      setUploadedFile(null);
      setCustomSizeOpen(false);
      setCustomSizeW('');
      setCustomSizeH('');
      document.title = `${product.name} | Canvas India`;

      // Save to recently viewed
      try {
        const raw = localStorage.getItem('ci_recently_viewed');
        const existing: string[] = raw ? JSON.parse(raw) : [];
        const updated = [product.id, ...existing.filter(id => id !== product.id)].slice(0, 6);
        localStorage.setItem('ci_recently_viewed', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }, [product, availableMaterials, availableShapes]);

  // Gallery images (product primary + any secondary images). Wall-hangable
  // categories get a leading "Room View" sentinel slot — shown first, like
  // canvaschamp — rendered live via WallPreview, reacting to the selected
  // shape/size instead of a static photo.
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const base = product.images && product.images.length > 0 ? product.images : [product.image];
    if (product.categorySlug === 'yoga-fitness') return base;
    return [ROOM_VIEW_SENTINEL, ...base];
  }, [product]);

  // The real product photo used inside the live Room View preview (first non-sentinel image)
  const roomViewSourceImage = useMemo(() => {
    const real = galleryImages.find((img) => img !== ROOM_VIEW_SENTINEL);
    return real || product?.image || '';
  }, [galleryImages, product]);

  // Related products from same category or catalog
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
      .slice(0, 6);
  }, [allProducts, product]);

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  useEffect(() => {
    if (!product) return;
    try {
      const raw = localStorage.getItem('ci_recently_viewed');
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const filtered = ids
          .filter(id => id !== product.id)
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => Boolean(p))
          .slice(0, 4);
        setRecentlyViewed(filtered);
      }
    } catch {
      // ignore
    }
  }, [product?.id, allProducts]);

  // Handlers
  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Canvas India`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCustomSizeChange = (width: number, height: number) => {
    setCustomWidth(width);
    setCustomHeight(height);
    setIsCustomSize(true);
    setSelectedSize(`${width}" x ${height}" (Custom)`);
  };

  const applyCustomSize = () => {
    const w = Number(customSizeW);
    const h = Number(customSizeH);
    if (w > 0 && h > 0) {
      handleCustomSizeChange(w, h);
    }
  };

  const handlePrevImage = () => {
    setUploadedFile(null);
    setActiveImageIndex((idx) => (idx - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setUploadedFile(null);
    setActiveImageIndex((idx) => (idx + 1) % galleryImages.length);
  };

  const handleAddToCartWithVariants = () => {
    if (!product) return;
    onAddToCart(product, selectedSize, selectedFinish, quantity, customText, uploadedFile || undefined, selectedMaterial);
  };

  if (!product) {
    return (
      <div className="w-full bg-[#FFFDF9] py-20 text-center text-stone-900 font-manrope min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The requested product (<code className="text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded font-mono text-xs">{productId}</code>) could not be found.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/canvas"
              className="px-5 py-2.5 bg-[#0E4A93] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#09356A] transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 border border-stone-300 text-stone-800 text-xs font-bold rounded-lg hover:border-stone-400 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  // Dedicated Acrylic Product Detail Page with Reference 1 layout & customizer drawer
  if (product.categorySlug === 'acrylic') {
    return <AcrylicProductDetailPage product={product} />;
  }

  const categoryName = product.category || 'Prints';
  const categoryLink = `/${product.categorySlug || 'canvas'}`;

  return (
    <div className="w-full bg-[#FFFDF9] py-6 sm:py-10 text-stone-900 font-manrope">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* ========================================================================= */}
        {/* 1. BREADCRUMBS                                                            */}
        {/* ========================================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to={categoryLink} className="hover:text-[#0E4A93] transition-colors">{categoryName}</Link>
          {product.subcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <Link to={`${categoryLink}?sub=${encodeURIComponent(product.subcategory)}`} className="hover:text-[#0E4A93] transition-colors">
                {product.subcategory}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium truncate max-w-[180px] sm:max-w-md">{product.name}</span>
        </nav>

        {/* ========================================================================= */}
        {/* 2. MAIN PRODUCT DISPLAY                                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">

            {/* Thumbnails — vertical strip on desktop, horizontal row on mobile */}
            <div className="order-2 lg:order-1 lg:col-span-1 min-w-0 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setUploadedFile(null); setActiveImageIndex(idx); }}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx && !uploadedFile
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                      : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  {img === ROOM_VIEW_SENTINEL ? (
                    <WallPreview imageSrc={roomViewSourceImage} shape={selectedShape} sizeLabel={selectedSize} finish={selectedFinish} className="w-full h-full" />
                  ) : (
                    <ProductImage src={img} alt={`View ${idx + 1}`} categorySlug={product.categorySlug} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="order-1 lg:order-2 lg:col-span-5 min-w-0">
              <div
                className={`relative rounded-2xl overflow-hidden bg-stone-100 shadow-xs group mx-auto w-auto max-w-full ${
                  galleryImages[activeImageIndex] === ROOM_VIEW_SENTINEL
                    ? 'aspect-[16/9] h-[42vh] sm:h-[46vh] min-h-[260px] max-h-[420px]'
                    : 'aspect-[4/5] h-[48vh] sm:h-[52vh] min-h-[300px] max-h-[500px]'
                }`}
              >
                {galleryImages[activeImageIndex] === ROOM_VIEW_SENTINEL ? (
                  <WallPreview
                    imageSrc={uploadedFile || roomViewSourceImage}
                    shape={selectedShape}
                    sizeLabel={selectedSize}
                    finish={selectedFinish}
                    className="w-full h-full"
                  />
                ) : (
                  <SmartCropImage
                    src={uploadedFile || galleryImages[activeImageIndex] || product.image}
                    alt={product.name}
                    containerAspect={4 / 5}
                    className="w-full h-full"
                  />
                )}

                {!uploadedFile && product.discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-[#E8752A] text-white text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-sm tracking-wider">
                    {product.discountPercent}% OFF
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md flex items-center justify-center transition-all cursor-pointer"
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>

                {galleryImages.length > 1 && (
                  <>
                    <button type="button" onClick={handlePrevImage} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={handleNextImage} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info + Purchase Card */}
            <div className="order-3 lg:col-span-6 min-w-0 flex flex-col gap-3.5 text-left">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">{product.name}</h1>
                {product.rating !== null && product.rating > 0 && (
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="underline decoration-stone-300">({product.reviewsCount || 48} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-950">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-base text-stone-400 line-through">
                  ₹{(product.compareAtPrice || product.originalPrice || Math.round(product.price * 1.3)).toLocaleString('en-IN')}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Lowest Price Guaranteed</span>
              </div>

              {/* Size / Shape Tabs */}
              {((product.sizes && product.sizes.length > 0) || availableShapes.length > 0) && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  {availableShapes.length > 0 ? (
                    <div className="flex items-center gap-6 border-b border-stone-200 mb-4">
                      <button
                        type="button"
                        onClick={() => setSizeShapeTab('size')}
                        className={`pb-2.5 text-sm font-bold cursor-pointer transition-colors ${sizeShapeTab === 'size' ? 'text-stone-900 border-b-2 border-emerald-600' : 'text-stone-400'}`}
                      >
                        Size
                      </button>
                      <button
                        type="button"
                        onClick={() => setSizeShapeTab('shape')}
                        className={`pb-2.5 text-sm font-bold cursor-pointer transition-colors ${sizeShapeTab === 'shape' ? 'text-stone-900 border-b-2 border-emerald-600' : 'text-stone-400'}`}
                      >
                        Shape
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-stone-900 mb-4">Size</div>
                  )}

                  {(sizeShapeTab === 'size' || availableShapes.length === 0) && product.sizes && product.sizes.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => { setIsCustomSize(false); setSelectedSize(size); }}
                          className={`px-1.5 py-2 text-[11px] leading-tight font-semibold rounded-lg border-2 text-center transition-all cursor-pointer ${
                            selectedSize === size && !isCustomSize
                              ? 'border-[#0E4A93] bg-blue-50/60 text-[#0E4A93]'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {size.replace(' inch', '')}
                        </button>
                      ))}
                    </div>
                  )}

                  {(sizeShapeTab === 'size' || availableShapes.length === 0) && showCustomSize && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setCustomSizeOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-700 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Need a Custom Size?</span>
                      </button>
                      {customSizeOpen && (
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min={4}
                            value={customSizeW}
                            onChange={(e) => setCustomSizeW(e.target.value)}
                            placeholder="Width [W] in"
                            className="w-0 flex-1 px-2.5 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93]"
                          />
                          <input
                            type="number"
                            min={4}
                            value={customSizeH}
                            onChange={(e) => setCustomSizeH(e.target.value)}
                            placeholder="Height [H] in"
                            className="w-0 flex-1 px-2.5 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93]"
                          />
                          <button
                            type="button"
                            onClick={applyCustomSize}
                            className="shrink-0 px-4 py-2 text-xs font-bold rounded-full border-2 border-stone-300 text-stone-700 hover:border-stone-400 transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {availableShapes.length > 0 && sizeShapeTab === 'shape' && (
                    <div className="grid grid-cols-4 gap-2">
                      {availableShapes.map((shapeOpt) => (
                        <button
                          key={shapeOpt}
                          type="button"
                          onClick={() => setSelectedShape(shapeOpt)}
                          className={`flex flex-col items-center gap-1.5 px-1.5 py-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedShape === shapeOpt
                              ? 'border-[#0E4A93] bg-blue-50/60'
                              : 'border-stone-200 bg-white hover:border-stone-400'
                          }`}
                        >
                          <ShapeIcon shape={shapeOpt} active={selectedShape === shapeOpt} />
                          <span className={`text-[10px] font-semibold ${selectedShape === shapeOpt ? 'text-[#0E4A93]' : 'text-stone-600'}`}>{shapeOpt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                <span className="font-bold text-xs text-stone-800">Quantity:</span>
                <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer" aria-label="Decrease quantity">-</button>
                  <span className="w-10 text-center text-xs font-extrabold text-stone-900">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer" aria-label="Increase quantity">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToCartWithVariants}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex-1 py-3.5 px-6 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isWishlisted ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

          </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT SPECIFICATIONS & APPLICATIONS                                  */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Specifications Table */}
            <div className="lg:col-span-12 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Product Specifications
              </h2>

              <div className="rounded-xl border border-stone-200 overflow-hidden text-xs bg-white divide-y divide-stone-100">
                <div className="flex py-2.5 px-4 bg-stone-50">
                  <span className="w-1/3 font-bold text-stone-800">Category</span>
                  <span className="w-2/3 text-stone-700">{categoryName}</span>
                </div>
                {product.subcategory && (
                  <div className="flex py-2.5 px-4">
                    <span className="w-1/3 font-bold text-stone-800">Subcategory</span>
                    <span className="w-2/3 text-stone-700">{product.subcategory}</span>
                  </div>
                )}
                <div className="flex py-2.5 px-4 bg-stone-50">
                  <span className="w-1/3 font-bold text-stone-800">Material</span>
                  <span className="w-2/3 text-stone-700">{selectedMaterial || product.material || 'Museum Grade Fine Art'}</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 font-bold text-stone-800">Print Quality</span>
                  <span className="w-2/3 text-stone-700">12-Color Archival UV-Resistant Inks (2400 DPI)</span>
                </div>
                <div className="flex py-2.5 px-4 bg-stone-50">
                  <span className="w-1/3 font-bold text-stone-800">Available Sizes</span>
                  <span className="w-2/3 text-stone-700">{product.sizes?.join(', ') || 'Custom Dimensions Available'}</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 font-bold text-stone-800">Available Finishes</span>
                  <span className="w-2/3 text-stone-700">{product.finishes?.join(', ') || 'Standard Finish'}</span>
                </div>
                <div className="flex py-2.5 px-4 bg-stone-50">
                  <span className="w-1/3 font-bold text-stone-800">Mounting Hardware</span>
                  <span className="w-2/3 text-stone-700">Pre-attached hangers &amp; stainless wall standoffs included</span>
                </div>
                <div className="flex py-2.5 px-4">
                  <span className="w-1/3 font-bold text-stone-800">Origin</span>
                  <span className="w-2/3 text-stone-700">Proudly Designed &amp; Handcrafted in India</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. WORKSHOP QUALITY VERIFICATION & CUSTOMER FEEDBACK                      */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200 text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Quality Verification &amp; Workshop Standards
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Every piece is handcrafted &amp; individually tested at our Hyderabad facility</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Inspected Prior to Dispatch</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E4A93]">Color Fidelity Test</span>
                <span className="text-[11px] text-emerald-600 font-bold">Passed</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Calibrated against 12-color archival pigment gamut for &gt;99% tone accuracy and zero banding.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                Canvas India Hyderabad Lab
              </div>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E4A93]">Substrate &amp; Frame Rigidity</span>
                <span className="text-[11px] text-emerald-600 font-bold">Passed</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kiln-dried pine wood and cast-acrylic substrate tested for humidity tolerance and zero warping.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                Master Framers Studio
              </div>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 bg-white space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E4A93]">Safe Transit Guarantee</span>
                <span className="text-[11px] text-emerald-600 font-bold">Passed</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                3-ply corner-reinforced shock-resistant packaging tested to withstand transit vibration and moisture.
              </p>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                Logistics &amp; Fulfillment
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. YOU MAY ALSO LIKE (Related Products, Box-Free)                         */}
        {/* ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200 text-left">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  You May Also Like in {categoryName}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">Popular complementary formats and bestselling custom wall decor</p>
              </div>
              <Link to={categoryLink} className="text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] flex items-center gap-1 transition-colors">
                <span>View All {categoryName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
              {relatedProducts.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  isWishlisted={wishlistIds.includes(relProd.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. RECENTLY VIEWED (LocalStorage driven, box-free)                        */}
        {/* ========================================================================= */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-200 text-left">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight mb-6">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
              {recentlyViewed.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isWishlisted={wishlistIds.includes(item.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
