import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Award, 
  Palette, 
  Gift, 
  SlidersHorizontal,
  ArrowRight,
  PackageCheck,
  Info
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/ProductImage';
import { CUSTOMER_REVIEWS } from '../data/storeData';

export interface AcrylicProductDetailPageProps {
  product: Product;
}

export const AcrylicProductDetailPage: React.FC<AcrylicProductDetailPageProps> = ({ product }) => {
  const navigate = useNavigate();
  const { wishlistIds, onToggleWishlist, onAddToCart } = useShop();

  const isWishlisted = wishlistIds.includes(product.id);

  // Gallery State
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    // Add additional angles if available
    if (list.length < 3) {
      list.push('/assets/acrylic/acrylic-panel-living.jpg');
      list.push('/assets/acrylic/acrylic-panel-standoff.jpg');
    }
    return list;
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Configuration Selectors State
  const availableStyles = product.availableStyles || ['Block', 'Shapes'];
  const availableThicknesses = product.availableThicknesses || ['7mm', '18mm'];
  const availableSizes = product.availableSizes || product.sizes || [
    '4" x 4"', '6" x 4"', '4" x 6"', '5" x 5"', '5" x 7"', '7" x 5"',
    '6" x 6"', '8" x 8"', '10" x 8"', '8" x 10"', '12" x 8"', '8" x 12"'
  ];
  const availablePapers = product.availablePapers || ['White Luster Photo Paper', 'Metallic Pearl Paper'];
  const availableBases = product.availableBases || ['Without Base', 'Acrylic Base', 'Solid Wood Base'];

  const [selectedStyle, setSelectedStyle] = useState<string>(availableStyles[0]);
  const [selectedThickness, setSelectedThickness] = useState<string>(availableThicknesses[0]);
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]);
  const [selectedPaper, setSelectedPaper] = useState<string>(availablePapers[0]);
  const [selectedBase, setSelectedBase] = useState<string>(availableBases[0]);
  const [quantity, setQuantity] = useState<number>(1);

  // Bottom Tabs State ('description' | 'specifications' | 'shipping' | 'reviews')
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('description');

  // Reset variant state when product changes
  useEffect(() => {
    setSelectedStyle(availableStyles[0] || 'Block');
    setSelectedThickness(availableThicknesses[0] || '7mm');
    setSelectedSize(availableSizes[0] || '4" x 4"');
    setSelectedPaper(availablePapers[0] || 'White Luster Photo Paper');
    setSelectedBase(availableBases[0] || 'Without Base');
    setQuantity(1);
    setActiveImageIndex(0);
    document.title = `${product.name} | Canvas India`;
    window.scrollTo(0, 0);
  }, [product]);

  // Gallery Navigation Controls
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

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
    if (selectedThickness === '18mm' || selectedThickness === '8mm' || selectedThickness === '10mm') {
      price += 350;
    }

    // Base adjustment
    if (selectedBase === 'Acrylic Base') price += 200;
    else if (selectedBase === 'Solid Wood Base') price += 250;
    else if (selectedBase === 'Chrome Floating Standoffs') price += 200;

    // Paper adjustment
    if (selectedPaper === 'Metallic Pearl Paper') price += 150;

    return price;
  }, [product.price, selectedSize, selectedThickness, selectedBase, selectedPaper]);

  const originalUnitPrice = useMemo(() => {
    return Math.round(unitPrice * 1.4);
  }, [unitPrice]);

  const discountPercent = useMemo(() => {
    return Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100);
  }, [originalUnitPrice, unitPrice]);

  const totalDiscountedPrice = unitPrice * quantity;
  const totalOriginalPrice = originalUnitPrice * quantity;
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  // Add to Cart from PDP
  const handleAddToCart = () => {
    onAddToCart(
      {
        ...product,
        price: unitPrice,
      },
      selectedSize,
      `${selectedThickness} Acrylic - ${selectedStyle}`,
      quantity,
      undefined,
      galleryImages[activeImageIndex] || product.image,
      product.material,
      selectedThickness,
      selectedStyle,
      selectedBase,
      selectedPaper
    );
  };

  // Dedicated Customizer Page Navigation
  const handleOpenCustomizer = () => {
    const params = new URLSearchParams({
      size: selectedSize,
      thickness: selectedThickness,
      style: selectedStyle,
      paper: selectedPaper,
      base: selectedBase,
      qty: quantity.toString(),
    });
    navigate(`/customize/acrylic/${product.slug || product.id}?${params.toString()}`);
  };

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. FUNCTIONAL BREADCRUMB STRIP                                            */}
      {/* ========================================================================= */}
      <div className="w-full border-b border-stone-200 bg-white">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto scrollbar-none">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors whitespace-nowrap">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link to="/acrylic" className="hover:text-[#0E4A93] transition-colors whitespace-nowrap">Acrylic</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link 
              to={`/acrylic?sub=${encodeURIComponent(product.subcategory || 'Photo Panels')}`} 
              className="hover:text-[#0E4A93] transition-colors whitespace-nowrap"
            >
              {product.subcategory || 'Photo Panels'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-bold text-stone-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN PRODUCT SECTION                                        */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: PRODUCT IMAGE GALLERY                                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image Container */}
            <div className="relative aspect-[4/3] bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-md group">
              
              <ProductImage
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.name}
                category="acrylic"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Acrylic Gloss Glass Sheen Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none" />

              {/* Discount Tag Overlay */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="bg-[#E8752A] text-white text-xs font-black px-3 py-1 rounded-full shadow-md tracking-wide uppercase">
                  {discountPercent}% OFF
                </span>
                {product.badge && product.badge !== 'Custom' && (
                  <span className="bg-[#0E4A93] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist Heart Button Overlay */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              {/* Previous Image Navigation Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer z-10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Image Navigation Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer z-10"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Thickness / Optical Tag */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {selectedThickness} Optical Cast Acrylic
              </div>
            </div>

            {/* Thumbnail Gallery Underneath */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20 shadow-md scale-105'
                          : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={imgUrl}
                        alt={`${product.name} preview ${idx + 1}`}
                        category="acrylic"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: PRODUCT INFORMATION & PURCHASE / CUSTOMIZATION         */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Category Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E4A93]">
                  ACRYLIC / {product.subcategory || 'Photo Panels'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star Rating Display */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-stone-900">
                  {product.rating || '4.8'} / 5
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 underline cursor-pointer hover:text-[#0E4A93]">
                  {product.reviewsCount || 48} Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Display */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-stone-950 tracking-tight">
                    ₹{totalDiscountedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-stone-400 line-through">
                    ₹{totalOriginalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Save ₹{totalSavings.toLocaleString('en-IN')} ({discountPercent}%)
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100/70 text-[#92400e] text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#E8752A]" />
                <span>LOWEST PRICE GUARANTEED</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.shortDescription || 'Personalized Acrylic Photo Blocks provide a clean, modern display for photographs and artwork, featuring crystal-clear cast acrylic, diamond-polished beveled edges, and an immersive dimensional appearance.'}
            </p>

            {/* =================================================================== */}
            {/* PRODUCT CONFIGURATION SELECTORS                                     */}
            {/* =================================================================== */}
            <div className="space-y-4 pt-2 border-t border-stone-200">
              
              {/* 1. SELECT STYLE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Select Style:
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-2xs"
                  >
                    {availableStyles.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. SELECT THICKNESS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Select Thickness:
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={selectedThickness}
                    onChange={(e) => setSelectedThickness(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-2xs"
                  >
                    {availableThicknesses.map((th) => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. SELECT SIZE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Select Size:
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-2xs"
                  >
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. SELECT PAPER */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Select Paper:
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={selectedPaper}
                    onChange={(e) => setSelectedPaper(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-2xs"
                  >
                    {availablePapers.map((paper) => (
                      <option key={paper} value={paper}>{paper}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. SELECT BASE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Select Base:
                </label>
                <div className="sm:col-span-2">
                  <select
                    value={selectedBase}
                    onChange={(e) => setSelectedBase(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93] cursor-pointer shadow-2xs"
                  >
                    {availableBases.map((base) => (
                      <option key={base} value={base}>{base}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. QUANTITY SELECTOR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 pt-1">
                <label className="text-xs font-bold text-stone-700 sm:col-span-1">
                  Quantity:
                </label>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-black cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-stone-900 min-w-[28px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-black cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">
                    Total: <strong className="text-stone-900">₹{totalDiscountedPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

            </div>

            {/* =================================================================== */}
            {/* TWO PRIMARY ACTIONS: [ CUSTOMIZE ] & [ ADD TO CART ]                */}
            {/* =================================================================== */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. CUSTOMIZE BUTTON */}
                <button
                  type="button"
                  onClick={handleOpenCustomizer}
                  className="w-full py-3.5 px-4 bg-[#0E4A93] hover:bg-[#09356A] active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 tracking-wide transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>CUSTOMIZE</span>
                </button>

                {/* 2. ADD TO CART BUTTON */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 bg-[#E8752A] hover:bg-[#d6651d] active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 tracking-wide transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Quality Guaranteed</span>
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#0E4A93]" />
                  <span>Free Pan-India Delivery &gt;₹999</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADVANTAGES & EDITORIAL COPY SECTION (Matches Reference 1)               */}
      {/* ========================================================================= */}
      <section className="w-full bg-stone-50 border-t border-stone-200/80 py-12">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 text-center max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 uppercase tracking-tight">
            ADVANTAGES OF CUSTOM ACRYLIC PHOTO BLOCKS
          </h2>
          <div className="w-16 h-1 bg-[#E8752A] mx-auto my-3 rounded-full" />
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            You can make your memories last a lifetime when you decorate your home with them. With Canvas India, we go the extra mile when it comes to transforming your family photos into unique home decor. Print your special occasions onto custom acrylic photo blocks from Canvas India.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRODUCT TABS: DESCRIPTION, SPECIFICATIONS, SHIPPING, REVIEWS           */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-t border-stone-200 py-12">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-3 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount || 48})` },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-[#0E4A93] text-[#0E4A93]'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <h3 className="text-base font-bold text-stone-900">
                  About {product.name}
                </h3>
                <p>
                  Custom photo acrylic blocks, crafted with {selectedThickness} clear, diamond-polished optical acrylic, allow natural light to filter through for a striking 3D glass effect that stands proudly on any desk, shelf, or mantelpiece.
                </p>
                <p>
                  Create a contemporary, vibrant look for your favorite photographs. These crystal pieces capture ambient lighting to enhance color saturation and optical depth in portraits, wedding snapshots, family milestones, and architectural cityscapes.
                </p>
                <p>
                  Choose from custom size options, finishes, and optional solid wooden or crystal acrylic bases. Sub-surface archival UV printing seals every pigment against moisture and UV light, ensuring vibrant color fidelity that never fades or wrinkles.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Material</span>
                    <span className="font-bold text-stone-900">Solid Optical Cast Acrylic</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Thickness</span>
                    <span className="font-bold text-stone-900">{selectedThickness} (approx 0.3 to 0.7 inch)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Edge Finish</span>
                    <span className="font-bold text-stone-900">Diamond Beveled &amp; Hand Flame Polished</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Printing Technology</span>
                    <span className="font-bold text-stone-900">Direct Archival Sub-Surface UV Inks</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Display Style</span>
                    <span className="font-bold text-stone-900">{selectedStyle} (Freestanding / Standoff)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Manufactured In</span>
                    <span className="font-bold text-stone-900">Hyderabad Facility, Telangana, India</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <h3 className="text-base font-bold text-stone-900">
                  Fast &amp; Secure Pan-India Dispatch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                    <PackageCheck className="w-5 h-5 text-[#0E4A93]" />
                    <div className="font-bold text-stone-900 text-xs">Production Time</div>
                    <div className="text-[11px] text-stone-500">Handcrafted &amp; cured in 24 - 48 hours</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <div className="font-bold text-stone-900 text-xs">Delivery Time</div>
                    <div className="text-[11px] text-stone-500">3 - 5 business days across Indian pin codes</div>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <div className="font-bold text-stone-900 text-xs">Transit Guarantee</div>
                    <div className="text-[11px] text-stone-500">Free replacement if damaged in transit</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-900 text-sm">{product.rating || '4.8'} out of 5</span>
                  <span className="text-xs text-stone-500">Based on verified customer orders</span>
                </div>

                <div className="space-y-3 pt-2">
                  {CUSTOMER_REVIEWS.slice(0, 3).map((rev) => (
                    <div key={rev.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">{rev.name} ({rev.city})</span>
                        <span className="text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <p className="text-xs text-stone-600">{rev.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRODUCT BENEFITS (4 CLEAN ICONS)                                       */}
      {/* ========================================================================= */}
      <section className="w-full bg-stone-50 border-t border-stone-200 py-10">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E4A93] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-stone-900">Premium Quality</div>
                <div className="text-[11px] text-stone-500">Crystal clear &amp; vibrant prints</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E8752A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-stone-900">Secure Packaging</div>
                <div className="text-[11px] text-stone-500">Damage-free transit guarantee</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-stone-900">Easy Customization</div>
                <div className="text-[11px] text-stone-500">Design your way with 3D studio</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-stone-900">Fast Delivery</div>
                <div className="text-[11px] text-stone-500">Direct from Hyderabad across India</div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
export default AcrylicProductDetailPage;
