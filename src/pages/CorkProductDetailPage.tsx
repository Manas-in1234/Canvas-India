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
  ArrowRight,
  PackageCheck,
  RotateCcw,
  Check,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  CorkProductReview,
  getCorkProductReviews,
  saveCorkProductReview,
  getRelatedCorkProducts
} from '../data/corkReviews';

export interface CorkProductDetailPageProps {
  product: Product;
}

export const CorkProductDetailPage: React.FC<CorkProductDetailPageProps> = ({ product }) => {
  const navigate = useNavigate();
  const { allProducts, wishlistIds, onToggleWishlist, onAddToCart, onOpenCustomize } = useShop();

  const isWishlisted = wishlistIds.includes(product.id);

  // Gallery images list
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        if (!list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['/assets/products/cork/9C-YA1/9c-ya1(1).png'];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Sizes & finishes options
  const availableSizes = useMemo(() => {
    if (product.availableSizes && product.availableSizes.length > 0) return product.availableSizes;
    if (product.sizes && product.sizes.length > 0) return product.sizes;
    return ['Standard Size'];
  }, [product]);

  const availableFinishes = useMemo(() => {
    if (product.finishes && product.finishes.length > 0) return product.finishes;
    if (product.material) return [product.material];
    return ['Natural Cork'];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'Standard');
  const [selectedFinish, setSelectedFinish] = useState<string>(availableFinishes[0] || 'Natural Cork');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Tabs State ('description' | 'specifications' | 'shipping' | 'reviews')
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('description');

  // Reset state on product change
  useEffect(() => {
    setSelectedSize(availableSizes[0] || 'Standard');
    setSelectedFinish(availableFinishes[0] || 'Natural Cork');
    setQuantity(1);
    setActiveImageIndex(0);
    document.title = `${product.name} | Canvas India`;
  }, [product, availableSizes, availableFinishes]);

  // Gallery Navigation Controls
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Pricing calculations
  const unitPrice = product.price || 999;
  const originalUnitPrice = product.originalPrice && product.originalPrice > unitPrice
    ? product.originalPrice
    : Math.round(unitPrice * 1.35);

  const discountPercent = product.discountPercent > 0
    ? product.discountPercent
    : Math.max(15, Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100));

  const totalDiscountedPrice = unitPrice * quantity;
  const totalOriginalPrice = originalUnitPrice * quantity;
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;

  // Add to cart handler
  const handleAddToCart = () => {
    onAddToCart(
      {
        ...product,
        price: unitPrice,
      },
      selectedSize,
      selectedFinish,
      quantity,
      undefined,
      galleryImages[activeImageIndex] || product.image,
      product.material || selectedFinish
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Reviews state
  const [reviews, setReviews] = useState<CorkProductReview[]>(() => {
    return getCorkProductReviews(product.id);
  });

  useEffect(() => {
    setReviews(getCorkProductReviews(product.id));
  }, [product.id]);

  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev = saveCorkProductReview(product.id, {
      author: reviewAuthor,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviews((prev) => [newRev, ...prev]);
    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const relatedProducts = useMemo(() => {
    return getRelatedCorkProducts(product.id, allProducts, 4);
  }, [product.id, allProducts]);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS                                                            */}
      {/* ========================================================================= */}
      <nav aria-label="Breadcrumb" className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pt-4 sm:pt-6 pb-4 flex items-center gap-1.5 text-xs text-stone-500">
        <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to="/cork" className="hover:text-[#0E4A93] transition-colors">Cork Products</Link>
        {product.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to={`/cork?sub=${encodeURIComponent(product.subcategory)}`} className="hover:text-[#0E4A93] transition-colors">
              {product.subcategory}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN PRODUCT DISPLAY                                          */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
          
          {/* LEFT: IMAGE GALLERY (Sticky on desktop, 6-7 columns) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4 lg:sticky lg:top-24">
            
            {/* Primary Main Image Frame */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm flex items-center justify-center group">
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />

              {/* Wishlist Button */}
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

              {/* Material / Eco Badge */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {product.material || '100% Sustainable Natural Cork'}
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
                      className={`relative w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-stone-50 ${
                        isActive
                          ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20 shadow-md scale-105'
                          : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} preview ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Reassurances Card Under Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col items-center text-center gap-1.5">
                <Truck className="w-5 h-5 text-[#0E4A93]" />
                <span className="text-[11px] font-bold text-stone-800 leading-tight">Pan-India Delivery</span>
                <span className="text-[10px] text-stone-500">Free above ₹999</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col items-center text-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[11px] font-bold text-stone-800 leading-tight">Safe Transit</span>
                <span className="text-[10px] text-stone-500">Free Replacement</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col items-center text-center gap-1.5">
                <Award className="w-5 h-5 text-[#E8752A]" />
                <span className="text-[11px] font-bold text-stone-800 leading-tight">100% Eco Cork</span>
                <span className="text-[10px] text-stone-500">Renewable Harvest</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col items-center text-center gap-1.5">
                <PackageCheck className="w-5 h-5 text-purple-600" />
                <span className="text-[11px] font-bold text-stone-800 leading-tight">24-48h Dispatch</span>
                <span className="text-[10px] text-stone-500">Express Available</span>
              </div>
            </div>

          </div>

          {/* RIGHT: PRODUCT INFO & SELECTORS (5-6 columns) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6 text-left">
            
            {/* Title & Review Row */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-[#92400e]">
                  {product.subcategory || 'Cork Wellness'}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Review Stars & Anchor */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs font-bold text-stone-600 hover:text-[#0E4A93] transition-colors cursor-pointer"
                >
                  {averageRating} ({reviews.length} Customer {reviews.length === 1 ? 'Review' : 'Reviews'})
                </button>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Special Offer Price</span>
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
              {product.shortDescription || product.description || 'Natural sustainable cork yoga and wellness products. Lightweight, durable, odor-resistant and naturally antimicrobial.'}
            </p>

            {/* =================================================================== */}
            {/* CONFIGURATION SELECTORS                                             */}
            {/* =================================================================== */}
            <div className="space-y-4 pt-2 border-t border-stone-200">
              
              {/* SIZE SELECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Select Size / Dimensions:</span>
                  <span className="text-stone-500 font-medium">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 text-xs font-semibold rounded-full border-2 text-center transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#0E4A93] bg-blue-50/60 text-[#0E4A93] shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* FINISH / MATERIAL SELECTION */}
              {availableFinishes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700">Material &amp; Construction:</span>
                    <span className="text-stone-500 font-medium">{selectedFinish}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableFinishes.map((finish) => (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-3 py-2 text-xs font-semibold rounded-full border-2 text-center transition-all cursor-pointer ${
                          selectedFinish === finish
                            ? 'border-[#0E4A93] bg-blue-50/60 text-[#0E4A93] shadow-2xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY SELECTOR */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Quantity:</span>
                  <span className="text-stone-500 font-medium">{quantity} Unit{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-stone-800 text-xs">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500">
                    Subtotal: <strong className="text-stone-800">₹{totalDiscountedPrice.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

            </div>

            {/* =================================================================== */}
            {/* ACTION BUTTONS (ADD TO CART & BUY NOW)                              */}
            {/* =================================================================== */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-xl bg-[#E8752A] hover:bg-[#D3631A] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart — ₹{totalDiscountedPrice.toLocaleString('en-IN')}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0E4A93] hover:bg-[#0A376E] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Buy Now with Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Share Link */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>In Stock &amp; Ready to Ship</span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-stone-600 hover:text-[#0E4A93] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ADVANTAGES OF NATURAL CORK (Matches Reference 1 Acrylic Banner)         */}
      {/* ========================================================================= */}
      <section className="w-full bg-stone-50 border-t border-stone-200/80 py-12">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 text-center max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 uppercase tracking-tight">
            ADVANTAGES OF NATURAL CORK YOGA &amp; WELLNESS PRODUCTS
          </h2>
          <div className="w-16 h-1 bg-[#E8752A] mx-auto my-3 rounded-full" />
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-8">
            Cork is nature’s most sustainable, high-performance wellness material. Harvested from the outer bark of living cork oak trees every 9 to 12 years without felling trees, cork absorbs carbon throughout its life. Its microscopic cellular honeycomb structure delivers self-healing durability, natural antimicrobial protection, and unparalleled traction that actually grips firmer when you sweat.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#E8752A]" />
              <div className="font-bold text-stone-900 text-xs">Sweat-Activated Grip</div>
              <div className="text-[11px] text-stone-500">Suberin wax in cork creates superior non-skid traction as moisture increases.</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="font-bold text-stone-900 text-xs">Naturally Antimicrobial</div>
              <div className="text-[11px] text-stone-500">Resists bacteria, fungal buildup, and odor naturally without harmful chemical washes.</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
              <Award className="w-5 h-5 text-[#0E4A93]" />
              <div className="font-bold text-stone-900 text-xs">Joint Cushioning</div>
              <div className="text-[11px] text-stone-500">Dense closed-cell foam backing buffers knees, wrists, and spine during deep practice.</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
              <RotateCcw className="w-5 h-5 text-purple-600" />
              <div className="font-bold text-stone-900 text-xs">100% Biodegradable</div>
              <div className="text-[11px] text-stone-500">Cruelty-free, PVC-free, zero toxic microplastics, and gentle on the planet.</div>
            </div>
          </div>
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
              { id: 'reviews', label: `Reviews (${reviews.length})` },
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

          {/* Tab Content Area */}
          <div className="max-w-4xl text-left">
            
            {/* TAB: DESCRIPTION */}
            {activeTab === 'description' && (
              <div className="space-y-6 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">
                    About {product.name}
                  </h3>
                  <p>
                    {product.description || 'Crafted with premium natural cork, engineered to support your daily wellness, balance, and rehabilitation routines.'}
                  </p>
                </div>

                {/* Features list */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Key Features &amp; Performance Benefits:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-stone-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Applications */}
                {product.applications && product.applications.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Recommended Uses:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.applications.map((app, idx) => (
                        <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold border border-stone-200">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Care & Handling */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">Care &amp; Cleaning Instructions:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                    <li>Wipe gently after use with a soft cloth dampened with warm water and mild organic soap.</li>
                    <li>Avoid soaking or machine washing. Allow to air dry flat away from direct harsh sunlight.</li>
                    <li>Roll with the cork surface facing outward to preserve optimal flat unrolling.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB: SPECIFICATIONS */}
            {activeTab === 'specifications' && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Category</span>
                    <span className="font-bold text-stone-900">{product.category || 'Cork'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Subcategory</span>
                    <span className="font-bold text-stone-900">{product.subcategory || 'Yoga & Wellness'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Material</span>
                    <span className="font-bold text-stone-900">{product.material || selectedFinish}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Available Dimensions</span>
                    <span className="font-bold text-stone-900">{availableSizes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Grip Property</span>
                    <span className="font-bold text-stone-900">Naturally Non-Skid &amp; Moisture-Activated</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Antimicrobial Rating</span>
                    <span className="font-bold text-stone-900">100% Odor Resistant (Suberin Layer)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Eco Certification</span>
                    <span className="font-bold text-stone-900">Sustainable Cork Oak Harvested Bark</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Manufactured In</span>
                    <span className="font-bold text-stone-900">Hyderabad Facility, Telangana, India</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SHIPPING */}
            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <h3 className="text-base font-bold text-stone-900">
                  Fast &amp; Secure Pan-India Dispatch
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
                    <PackageCheck className="w-5 h-5 text-[#0E4A93]" />
                    <div className="font-bold text-stone-900 text-xs">Production Time</div>
                    <div className="text-[11px] text-stone-500">Quality checked &amp; packed in 24 - 48 hours</div>
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

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Review Header Stats */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left space-y-1">
                    <div className="text-4xl font-black text-stone-950 tracking-tight">{averageRating}</div>
                    <div className="flex items-center justify-center sm:justify-start text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-stone-500 font-semibold">
                      Based on {reviews.length} Verified Customer {reviews.length === 1 ? 'Review' : 'Reviews'}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>100% of customers recommend this product</span>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Write Review Form */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <h4 className="font-bold text-stone-900 text-sm">Write a Customer Review</h4>
                  {reviewSubmitted ? (
                    <div className="p-3 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Thank you! Your review has been submitted and published.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Your Rating:</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="cursor-pointer text-amber-500 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cork-review-author" className="block text-xs font-bold text-stone-700 mb-1">Your Name:</label>
                        <input
                          id="cork-review-author"
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93]"
                        />
                      </div>

                      <div>
                        <label htmlFor="cork-review-comment" className="block text-xs font-bold text-stone-700 mb-1">Your Review:</label>
                        <textarea
                          id="cork-review-comment"
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this cork product..."
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-[#0E4A93] hover:bg-[#0A376E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RELATED PRODUCTS SECTION                                               */}
      {/* ========================================================================= */}
      {relatedProducts.length > 0 && (
        <section className="w-full bg-[#FFFDF9] border-t border-stone-200 py-12 sm:py-16">
          <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-1 text-left">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  Related Cork Products
                </h2>
                <p className="text-xs text-stone-500">
                  More sustainable cork yoga, massage, and wellness accessories.
                </p>
              </div>
              <Link
                to="/cork"
                className="text-xs font-bold text-[#0E4A93] hover:underline flex items-center gap-1"
              >
                <span>View All Cork</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  isWishlisted={wishlistIds.includes(relProduct.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                  variant="listing"
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default CorkProductDetailPage;
