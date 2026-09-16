import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  Award, 
  MapPin, 
  ChevronRight, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  Layers, 
  Sliders, 
  Type, 
  Maximize2,
  PackageCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { fetchProductByIdFromApi } from '../api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { CUSTOMER_REVIEWS } from '../data/storeData';
import { Product } from '../types';
import { AcrylicProductDetailPage } from './AcrylicProductDetailPage';
import { 
  AcrylicProductReview, 
  getProductReviews, 
  saveProductReview 
} from '../data/acrylicReviews';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { 
    allProducts, 
    wishlistIds, 
    onToggleWishlist, 
    onAddToCart, 
    onOpenCustomize,
    isLoadingProducts 
  } = useShop();

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [isFetchingSingle, setIsFetchingSingle] = useState<boolean>(false);

  // Find product by id or slug
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === productId || p.slug === productId) || singleProduct;
  }, [allProducts, productId, singleProduct]);

  useEffect(() => {
    if (!productId || product || isLoadingProducts) return;
    let cancelled = false;
    setIsFetchingSingle(true);
    fetchProductByIdFromApi(productId)
      .then((p) => {
        if (!cancelled && p) {
          setSingleProduct(p);
        }
      })
      .finally(() => {
        if (!cancelled) setIsFetchingSingle(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, product, isLoadingProducts]);

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  // Variant state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Tabs state ('description' | 'specifications' | 'shipping' | 'reviews')
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('description');

  // Product Reviews State for this specific product
  const [reviews, setReviews] = useState<AcrylicProductReview[]>(() => {
    return getProductReviews(product?.id || '');
  });

  useEffect(() => {
    if (!product) return;
    const stored = getProductReviews(product.id);
    if (stored && stored.length > 0) {
      setReviews(stored);
    } else {
      // Provide default relevant reviews
      const defaults = CUSTOMER_REVIEWS.filter(
        (r) => r.product.toLowerCase().includes('canvas') || !r.product.toLowerCase().includes('acrylic')
      ).slice(0, 3).map((r) => ({
        id: r.id,
        productId: product.id,
        author: r.name,
        rating: r.rating,
        comment: r.review,
        date: r.date,
        verified: r.verified,
      }));
      setReviews(defaults);
    }
  }, [product?.id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return Number(product?.rating || 4.8);
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews, product?.rating]);

  const totalReviewsCount = useMemo(() => {
    return (product?.reviewsCount || 48) + Math.max(0, reviews.length - 2);
  }, [reviews.length, product?.reviewsCount]);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  const handleOpenReviewModal = () => {
    setReviewRating(5);
    setHoverRating(0);
    setReviewText('');
    setReviewerName('');
    setReviewError(null);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setReviewError(null);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      setReviewError('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setReviewError('Please write at least a few words describing your experience (minimum 5 characters).');
      return;
    }

    const created = saveProductReview(product.id, {
      author: reviewerName.trim() || 'Verified Customer',
      rating: reviewRating,
      comment: reviewText.trim(),
    });

    setReviews(prev => [created, ...prev]);
    setReviewSuccessMessage(`Thank you! Your review for "${product.name}" has been added.`);
    setTimeout(() => setReviewSuccessMessage(null), 4000);
    handleCloseReviewModal();
  };

  // In-page customization state (preserved for cart compatibility)
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Delivery check state
  const [pincode, setPincode] = useState<string>('500001');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(false);
  const [checkingPincode, setCheckingPincode] = useState<boolean>(false);
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

  // Sync variants when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes?.[0] || product.sizes?.[0] || '12x18 inch');
      setSelectedFinish(product.finishes?.[0] || 'Standard Finish');
      setSelectedMaterial(availableMaterials[0] || 'Standard');
      setQuantity(1);
      setActiveImageIndex(0);
      setCustomText('');
      setUploadedFile(null);
      setUploadSuccess(false);
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
  }, [product, availableMaterials]);

  // Gallery images (product primary + any secondary images)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image];
  }, [product]);

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
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) return;
    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      setPincodeChecked(true);
    }, 350);
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile(reader.result as string);
        setUploadSuccess(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCartWithVariants = () => {
    if (!product) return;
    onAddToCart(product, selectedSize, selectedFinish, quantity, customText, uploadedFile || undefined, selectedMaterial);
  };

  const handleBuyNow = () => {
    if (!product) return;
    onAddToCart(product, selectedSize, selectedFinish, quantity, customText, uploadedFile || undefined, selectedMaterial);
    navigate('/cart');
  };

  if (!product && (isLoadingProducts || isFetchingSingle)) {
    return (
      <div className="w-full bg-[#FFFDF9] py-20 text-center text-stone-900 font-manrope min-h-[65vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="w-12 h-12 border-3 border-stone-200 border-t-[#0E4A93] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-stone-600">Loading product details...</p>
        </div>
      </div>
    );
  }

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
        {/* 2. MAIN 2-COLUMN PRODUCT DISPLAY                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
          
          {/* LEFT: GALLERY (Sticky on desktop, 6-7 columns) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4 sticky top-24">
            
            {/* Main Primary Image */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
              <ProductImage
                src={uploadedFile || galleryImages[activeImageIndex] || product.image}
                alt={product.name}
                categorySlug={product.categorySlug}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Uploaded User Photo Indicator Overlay */}
              {uploadedFile && (
                <div className="absolute top-4 left-4 bg-[#0E4A93] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Custom Artwork Applied</span>
                </div>
              )}

              {/* Discount Tag */}
              {!uploadedFile && product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-[#E8752A] text-white text-xs font-black uppercase px-2.5 py-1 rounded-md shadow-sm tracking-wider">
                  {product.discountPercent}% OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md flex items-center justify-center transition-all cursor-pointer"
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      setActiveImageIndex(idx);
                    }}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx && !uploadedFile
                        ? 'border-[#0E4A93] shadow-md ring-2 ring-[#0E4A93]/20' 
                        : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt={`View ${idx + 1}`} categorySlug={product.categorySlug} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges Strip (Box-Free, underneath gallery) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-stone-200/80 text-left">
              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#E8752A] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-stone-900">Museum Grade</div>
                  <div className="text-[11px] text-stone-500">12-color archival inks</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-5 h-5 text-[#0E4A93] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-stone-900">Free Delivery</div>
                  <div className="text-[11px] text-stone-500">On orders ₹999+</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-stone-900">Safe Payments</div>
                  <div className="text-[11px] text-stone-500">UPI, NetBanking & Cards</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-stone-900">Pan-India Ship</div>
                  <div className="text-[11px] text-stone-500">19,000+ PIN codes</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE CONTROLS (5-6 columns) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-5 text-left">
            
            {/* Header: Category & Share */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Link 
                    to={categoryLink}
                    className="text-xs uppercase font-bold tracking-widest text-[#0E4A93] hover:underline"
                  >
                    {categoryName}
                  </Link>
                  {product.subcategory && (
                    <span className="text-xs text-stone-400 font-medium">/ {product.subcategory}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-stone-100"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                {product.name}
              </h1>

              {/* Status & Ratings */}
              <div className="flex items-center gap-2.5 mt-2.5 text-xs text-stone-600">
                {product.rating !== null && product.rating > 0 ? (
                  <>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-800 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="underline decoration-stone-300">{product.reviewsCount || 48} Customer Reviews</span>
                    <span>•</span>
                  </>
                ) : (
                  <>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] px-2 py-0.5 rounded">
                      New Arrival
                    </span>
                    <span>•</span>
                  </>
                )}
                
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{product.stockStatus || 'In Stock & Handcrafted'}</span>
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Pricing */}
            <div className="pb-4 border-b border-stone-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-stone-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base sm:text-lg text-stone-400 line-through">
                  ₹{(product.compareAtPrice || product.originalPrice || Math.round(product.price * 1.3)).toLocaleString('en-IN')}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{((product.compareAtPrice || product.originalPrice || Math.round(product.price * 1.3)) - product.price).toLocaleString('en-IN')} ({product.discountPercent}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Inclusive of GST taxes. Free shipping on orders above ₹999 across India.</p>
            </div>

            {/* 1. Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Available Sizes:</span>
                  <span className="text-stone-500 font-medium">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
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
            )}

            {/* 2. Material Selector */}
            {availableMaterials.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Material:</span>
                  <span className="text-stone-500 font-medium">{selectedMaterial}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableMaterials.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        selectedMaterial === mat
                          ? 'border-[#0E4A93] bg-blue-50/60 text-[#0E4A93] shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Finish Selector */}
            {product.finishes && product.finishes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">Finish &amp; Style:</span>
                  <span className="text-stone-500 font-medium">{selectedFinish}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.finishes.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
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

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="font-bold text-xs text-stone-800">Quantity:</span>
              <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-extrabold text-stone-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action CTAs: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCartWithVariants}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Indian Delivery Check Section */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <Truck className="w-4 h-4 text-[#0E4A93]" />
                <span>Delivery Options &amp; Timelines</span>
              </div>
              
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeChecked(false);
                  }}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:border-[#0E4A93]"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="px-4 py-1.5 text-xs font-bold bg-stone-800 hover:bg-stone-950 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {checkingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeChecked && (
                <div className="text-xs text-stone-700 space-y-1 pt-1 border-t border-stone-200">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivery available to PIN {pincode} in 3–5 business days</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    • Free doorstep delivery eligible (Order ₹999+)
                    <br />
                    • Multi-layer insured packaging with protective corner guards
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PRODUCT TABS: DESCRIPTION, SPECIFICATIONS, SHIPPING, REVIEWS           */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200 text-left">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-3 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px mb-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Delivery' },
              { id: 'reviews', label: `Reviews (${totalReviewsCount})` },
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
                  {product.description} Handcrafted at Canvas India&apos;s dedicated print studio, each personalized piece undergoes meticulous color grading, museum-grade pigment printing, and professional artisan assembly. Whether displayed in your living room, gifted for an anniversary, or installed in modern corporate spaces, our prints are built to retain vibrancy and depth for over 50 years.
                </p>

                {/* Recommended Applications */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-stone-900">Recommended Applications &amp; Spaces:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(product.applications || ['Living Room', 'Master Bedroom', 'Home Office', 'Dining Foyer', 'Corridors']).map((app) => (
                      <span key={app} className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold border border-stone-200">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-stone-900">Care &amp; Handling Instructions:</h4>
                  <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>Dust gently with a clean, dry microfiber cloth. Avoid abrasive cleaning pads and liquid solvents.</li>
                    <li>Keep out of continuous direct rainfall and excessive humidity.</li>
                    <li>Pre-installed hanging hardware makes mounting effortless on standard wall hooks or screws.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Category</span>
                    <span className="font-bold text-stone-900">{categoryName}</span>
                  </div>
                  {product.subcategory && (
                    <div className="flex justify-between py-2 border-b border-stone-200">
                      <span className="text-stone-500 font-medium">Subcategory</span>
                      <span className="font-bold text-stone-900">{product.subcategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Material</span>
                    <span className="font-bold text-stone-900">{selectedMaterial || product.material || 'Museum Grade Fine Art Canvas'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Print Quality</span>
                    <span className="font-bold text-stone-900">12-Color Archival UV-Resistant Inks (2400 DPI)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Available Sizes</span>
                    <span className="font-bold text-stone-900">{product.sizes?.join(', ') || 'Custom Dimensions Available'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Available Finishes</span>
                    <span className="font-bold text-stone-900">{product.finishes?.join(', ') || 'Standard Finish'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Mounting Hardware</span>
                    <span className="font-bold text-stone-900">Pre-attached hangers &amp; stainless wall standoffs included</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-200">
                    <span className="text-stone-500 font-medium">Origin</span>
                    <span className="font-bold text-stone-900">Proudly Designed &amp; Handcrafted in India</span>
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
              <div className="space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                      ))}
                    </div>
                    <span className="font-extrabold text-stone-900 text-sm">{averageRating} out of 5</span>
                    <span className="text-xs text-stone-500">({totalReviewsCount} Customer Reviews)</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenReviewModal}
                    className="px-4 py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>+ Add Review</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>
                          <span className="text-stone-400 text-[11px]">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className={s <= rev.rating ? 'text-amber-400' : 'text-stone-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-stone-600 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
                      No customer reviews yet for {product.name}. Be the first to add your review!
                    </div>
                  )}
                </div>
              </div>
            )}
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

      {/* ========================================================================= */}
      {/* 7. ADD REVIEW MODAL                                                       */}
      {/* ========================================================================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 text-left space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E4A93]">Customer Review</span>
                <h3 className="text-base font-extrabold text-stone-900">
                  Write a Review for {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseReviewModal}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Overall Rating:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-xl cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span className={(hoverRating || reviewRating) >= star ? 'text-amber-400' : 'text-stone-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-2">
                    {(hoverRating || reviewRating)} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Review:
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (reviewError) setReviewError(null);
                  }}
                  rows={4}
                  placeholder="Write your review about canvas texture, colors, framing, packaging..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#0E4A93] focus:ring-1 focus:ring-[#0E4A93]"
                  required
                />
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your name (e.g. Priya Sharma)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#0E4A93] focus:ring-1 focus:ring-[#0E4A93]"
                />
              </div>

              {reviewError && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {reviewError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification Toast */}
      {reviewSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{reviewSuccessMessage}</span>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
