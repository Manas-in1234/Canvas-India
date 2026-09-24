import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ArrowRight,
  Palette,
  Layers,
  CircleDot,
  Printer,
  Gift,
  Package,
  Building2,
  ChevronDown,
  Sparkles,
  Sliders,
  Grid,
  Phone,
  Flame,
  Image as ImageIcon,
  Home as HomeIcon,
  Activity,
  LogOut,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { 
  MEGA_MENUS_DATA, 
  SEARCH_SUGGESTIONS, 
  PRIMARY_CATEGORIES, 
  CATEGORIES 
} from '../data/storeData';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenQuote: () => void;
  onSelectCategory: (slug: string) => void;
  onSearch: (query: string) => void;
  allProducts: Product[];
  onOpenCustomize: (product?: Product) => void;
  onOpenAccount?: () => void;
}

export interface AllCategoryMenuItem {
  name: string;
  slug: string;
  route: string;
  image: string;
  description: string;
}

export const ALL_CATEGORIES_MENU_ITEMS: AllCategoryMenuItem[] = [
  {
    name: 'Canvas',
    slug: 'canvas',
    route: '/canvas',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    description: 'Museum-grade 380 GSM cotton canvas prints',
  },
  {
    name: 'Acrylic',
    slug: 'acrylic',
    route: '/acrylic',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
    description: 'High-gloss 5mm crystal clear acrylic glass prints',
  },
  {
    name: 'Posters & Custom Wall Graphics',
    slug: 'posters',
    route: '/posters',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&auto=format&fit=crop&q=80',
    description: 'Custom posters and commercial wall graphics',
  },
  {
    name: 'Cork',
    slug: 'cork',
    route: '/cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80',
    description: 'Natural 8mm eco-friendly cork pinboards',
  },
  {
    name: 'Yoga & Fitness',
    slug: 'yoga-fitness',
    route: '/yoga-fitness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80',
    description: 'Customized yoga mats and wellness gear',
  },
  {
    name: 'Home Décor',
    slug: 'home-decor',
    route: '/home-decor',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop&q=80',
    description: 'Curated decorative and interior wall collections',
  },
  {
    name: 'Custom Prints',
    slug: 'custom-prints',
    route: '/custom-prints',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&auto=format&fit=crop&q=80',
    description: 'Personalized prints with custom sizes & photos',
  },
  {
    name: 'Gifts & Occasions',
    slug: 'gifts',
    route: '/gifts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop&q=80',
    description: 'Special photo gifts for birthdays & celebrations',
  },
  {
    name: 'Bulk Order',
    slug: 'bulk-order',
    route: '/bulk-order',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&auto=format&fit=crop&q=80',
    description: 'Volume discounts for events, schools & resellers',
  },
  {
    name: 'Corporate Orders',
    slug: 'corporate-orders',
    route: '/corporate-orders',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80',
    description: 'Office branding, corporate kits & GST billing',
  },
  {
    name: 'Designers & Architects',
    slug: 'designers-architects',
    route: '/designers-architects',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80',
    description: 'Turnkey interior wall solutions for trade professionals',
  },
];

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenQuote,
  onSelectCategory,
  onSearch,
  allProducts,
  onOpenCustomize,
  onOpenAccount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);

  // Dynamic active category state derived from current pathname
  const activeNav = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path === '/canvas' || path === '/canvas-prints' || path.startsWith('/customize/canvas')) return 'canvas';
    if (path === '/acrylic' || path === '/acrylic-prints' || path.startsWith('/customize/acrylic')) return 'acrylic';
    if (path === '/posters') return 'posters';
    if (path === '/cork' || path === '/cork-prints') return 'cork';
    if (path === '/yoga-fitness') return 'yoga-fitness';
    if (path === '/home-decor') return 'home-decor';
    if (path === '/custom-prints') return 'custom-prints';
    if (path === '/gifts') return 'gifts';
    if (path === '/corporate-orders' || path === '/corporate') return 'corporate-orders';
    if (path === '/bulk-order' || path === '/bulk-orders') return 'bulk-order';
    if (path === '/designers-architects') return 'designers-architects';
    return '';
  }, [location.pathname]);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const { user, profile, signOut } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const allCatRef = useRef<HTMLDivElement>(null);
  const allCatDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dropdown panels are rendered via a portal (see below) so the horizontally
  // scrollable category nav row (overflow-x-auto) doesn't clip them — per the
  // CSS overflow spec, overflow-x: auto forces overflow-y to auto too, which
  // silently clips any absolutely-positioned dropdown nested inside that row.
  const [allCatMenuPos, setAllCatMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [megaMenuPos, setMegaMenuPos] = useState<{ top: number; left: number } | null>(null);

  // Category bar shopping categories (Excludes Bulk Order, which sits in the main header after Cart)
  const CATEGORY_BAR_ITEMS = useMemo(() => {
    return PRIMARY_CATEGORIES.filter((cat) => cat.slug !== 'bulk-order' && cat.slug !== 'posters' && cat.slug !== 'custom-prints');
  }, []);

  // Close open dropdown menus on scroll or resize to prevent detached floating elements
  useEffect(() => {
    const handleScrollOrResize = () => {
      setActiveMegaMenu(null);
      setAllCategoriesOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  // Helper to resolve icon from primary category data
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette': return Palette;
      case 'Layers': return Layers;
      case 'CircleDot': return CircleDot;
      case 'Printer': return Printer;
      case 'Gift': return Gift;
      case 'Package': return Package;
      case 'Building2': return Building2;
      case 'Image': return ImageIcon;
      case 'Activity': return Activity;
      case 'Home': return HomeIcon;
      default: return Sliders;
    }
  };

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        setAllCategoriesOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mega-menu or search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const insidePortal = !!target.closest('[data-header-portal]');

      // Handle All Categories dropdown outside click
      const clickedInsideAllCatTrigger = allCatRef.current && allCatRef.current.contains(target);
      const clickedInsideAllCatMenu = (allCatDropdownRef.current && allCatDropdownRef.current.contains(target)) || target.closest('[data-header-portal="all-categories"]');
      if (!clickedInsideAllCatTrigger && !clickedInsideAllCatMenu) {
        setAllCategoriesOpen(false);
      }

      // Handle Mega Menu outside click
      const clickedInsideMegaTrigger = target.closest('[data-mega-menu-trigger]');
      const clickedInsideMegaMenu = (megaMenuDropdownRef.current && megaMenuDropdownRef.current.contains(target)) || target.closest('[data-header-portal="mega-menu"]');
      if (!clickedInsideMegaTrigger && !clickedInsideMegaMenu) {
        setActiveMegaMenu(null);
      }

      // Handle Search dropdown outside click
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }

      // Handle Account menu outside click
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setSearchOpen(false);
  };

  const handleNavClick = (slug: string) => {
    onSelectCategory(slug);
    setActiveMegaMenu(null);
    setAllCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  const handleToggleAllCategories = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!allCategoriesOpen && allCatRef.current) {
      const r = allCatRef.current.getBoundingClientRect();
      setAllCatMenuPos({ top: r.bottom + 6, left: Math.max(16, r.left) });
      setAllCategoriesOpen(true);
      setActiveMegaMenu(null);
    } else {
      setAllCategoriesOpen(false);
    }
  };

  const handleMegaMenuEnter = (slug: string, rect: DOMRect) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    const estWidth = Math.min(850, window.innerWidth * 0.9);
    const left = Math.min(Math.max(rect.left, 16), window.innerWidth - estWidth - 16);
    setMegaMenuPos({ top: rect.bottom + 2, left });
    setActiveMegaMenu(slug);
    setAllCategoriesOpen(false);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 120);
  };

  const handleItemClick = (slug: string, actionType?: 'category' | 'quote' | 'customize') => {
    if (actionType === 'quote') {
      onOpenQuote();
    } else if (actionType === 'customize') {
      onOpenCustomize();
      onSelectCategory(slug);
    } else {
      handleNavClick(slug);
    }
    setActiveMegaMenu(null);
    setAllCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  const renderGroupIcon = (iconType: string) => {
    switch (iconType) {
      case 'heart': return <Heart className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'palette': return <Palette className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'layers': return <Layers className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'circleDot': return <CircleDot className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'printer': return <Printer className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'package': return <Package className="w-3.5 h-3.5 text-[#0E4A93]" />;
      case 'building': return <Building2 className="w-3.5 h-3.5 text-[#0E4A93]" />;
      default:
        return <Sliders className="w-3.5 h-3.5 text-[#0E4A93]" />;
    }
  };

  return (
    <header className="relative z-40 w-full font-manrope">
      
      {/* ========================================================================= */}
      {/* LAYER 2: ROYAL BLUE MAIN HEADER ROW (#0E4A93)                             */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0E4A93] text-white py-2.5 sm:py-3 shadow-md">
        <div className="w-full px-2.5 sm:px-4 lg:pl-8 xl:pl-9 lg:pr-8 xl:pr-10">
          
          {/* DESKTOP HEADER ROW */}
          <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6 w-full">
            
            {/* 1. OFFICIAL CANVAS INDIA LOGO (Left Anchored, 24px-40px from viewport left) */}
            <div className="shrink-0 flex items-center">
              <Link 
                to="/" 
                className="block transition-opacity hover:opacity-95 cursor-pointer py-0.5"
                title="Canvas India - Personalized Canvas, Acrylic & Cork Prints"
              >
                <img
                  src="/canvas-india-official-logo.png"
                  alt="Canvas India"
                  className="w-[130px] lg:w-[140px] xl:w-[148px] h-auto object-contain block select-none"
                />
              </Link>
            </div>

            {/* 2. LARGE HORIZONTAL SEARCH BAR (Starts immediately beside logo) */}
            <div ref={searchRef} className="flex-1 min-w-0 max-w-2xl 2xl:max-w-3xl relative ml-1">
              <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search for products, gifts, photos & more..."
                  className="w-full pl-4 pr-28 h-[44px] sm:h-[46px] bg-white text-[#111827] placeholder-stone-400 text-xs sm:text-sm rounded-lg border-2 border-transparent focus:outline-none focus:border-orange-400 shadow-xs transition-all"
                />
                
                {/* Prominent Orange Search Button (#E8752A) */}
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-5 bg-[#E8752A] hover:bg-[#D3631A] text-white rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Search className="w-4 h-4 text-white" />
                  <span>Search</span>
                </button>
              </form>

              {/* Suggestions & Search Results Popover */}
              {searchOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100 text-left">
                  {searchQuery.trim() === '' && (
                    <div className="p-3.5 bg-stone-50/70">
                      <div className="text-[11px] font-bold tracking-wider uppercase text-stone-500 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Popular Searches in India</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SEARCH_SUGGESTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-lg border border-stone-200 transition-colors cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="p-2">
                      <div className="p-1.5 text-[11px] font-bold tracking-wider uppercase text-stone-400">
                        Matching Products ({searchResults.length})
                      </div>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onOpenCustomize(product);
                            setSearchOpen(false);
                          }}
                          className="p-2 flex items-center gap-3 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {product.category} • <span className="font-bold text-[#0E4A93]">₹{product.price}</span>
                            </div>
                          </div>
                          <span className="text-xs text-[#0E4A93] font-semibold">View →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. HEADER ACTIONS: Account, Wishlist, Cart, Bulk Order, Get a Quote */}
            <div className="flex items-center gap-3 lg:gap-3.5 xl:gap-5 shrink-0 text-xs sm:text-sm font-semibold">
              
              {/* Account Dropdown */}
              <div ref={accountMenuRef} className="relative">
                <button 
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer py-1"
                >
                  <User className="w-4 h-4 text-white/90" strokeWidth={2} />
                  <span>{user ? (profile?.full_name?.split(' ')[0] || 'My Account') : 'Account'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 py-1 text-xs">
                    {user ? (
                      <>
                        <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
                          <p className="text-[10px] uppercase font-bold text-stone-400">Signed in as</p>
                          <p className="font-bold text-stone-900 truncate">{profile?.full_name || 'Canvas Member'}</p>
                          <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/account?tab=orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50/60 hover:text-[#0E4A93] transition font-medium"
                        >
                          <Package className="w-3.5 h-3.5 text-[#0E4A93]" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <Link
                          to="/account?tab=addresses"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50/60 hover:text-[#0E4A93] transition font-medium"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#0E4A93]" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link
                          to="/account?tab=profile"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50/60 hover:text-[#0E4A93] transition font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-[#0E4A93]" />
                          <span>Profile Settings</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50/60 hover:text-[#0E4A93] transition font-medium"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#0E4A93]" />
                          <span>My Wishlist</span>
                        </Link>
                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={async () => {
                              setAccountMenuOpen(false);
                              await signOut();
                              navigate('/');
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition font-medium cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-stone-50 border-b border-stone-100 text-center">
                          <p className="font-bold text-stone-900 mb-1">Welcome to Canvas India</p>
                          <p className="text-[11px] text-stone-500 mb-2">Sign in to access your orders, customized prints and saved addresses.</p>
                          <Link
                            to="/login"
                            onClick={() => setAccountMenuOpen(false)}
                            className="block w-full py-1.5 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg transition text-center shadow-xs"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => setAccountMenuOpen(false)}
                            className="block mt-1.5 text-[11px] text-[#0E4A93] font-semibold hover:underline text-center"
                          >
                            New customer? Create an account
                          </Link>
                        </div>
                        <Link
                          to="/login?redirect=/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-stone-50 transition text-stone-700 font-medium"
                        >
                          <Package className="w-3.5 h-3.5 text-stone-500" />
                          <span>Track Order Status</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Heart className="w-4 h-4 text-white/90" strokeWidth={2} />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-[#E8752A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer py-1"
              >
                <ShoppingCart className="w-4 h-4 text-white/90" strokeWidth={2} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-[#E8752A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Bulk Order */}
              <Link
                to="/bulk-order"
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer py-1 whitespace-nowrap"
                title="Bulk & Corporate Orders"
              >
                <Package className="w-4 h-4 text-white/90" strokeWidth={2} />
                <span>Bulk Order</span>
              </Link>

              </div>

          </div>

          {/* MOBILE MAIN HEADER ROW */}
          <div className="relative flex lg:hidden items-center justify-between w-full min-h-[44px]">
            {/* 1. MOBILE CATEGORY MENU (Far Left Corner) */}
            <div className="flex items-center shrink-0 z-10">
              <button 
                type="button" 
                onClick={() => setMobileMenuOpen(true)} 
                className="p-2 -ml-1 text-white hover:bg-white/10 active:bg-white/20 rounded-lg cursor-pointer flex items-center justify-center min-w-[40px] min-h-[40px]"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* 2. MOBILE CANVAS INDIA LOGO (Centered) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
              <Link 
                to="/" 
                className="flex items-center justify-center transition-opacity hover:opacity-95 focus:outline-none"
                title="Canvas India"
              >
                <img
                  src="/canvas-india-official-logo.png"
                  alt="Canvass India"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain block select-none"
                />
              </Link>
            </div>

            {/* 3. RIGHT ACTIONS (Search, Wishlist, Cart) */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0 z-10">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-white hover:bg-white/10 active:bg-white/20 rounded-lg cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onOpenWishlist}
                className="p-2 text-white hover:bg-white/10 active:bg-white/20 rounded-lg relative cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E8752A] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onOpenCart}
                className="relative p-2 text-white hover:bg-white/10 active:bg-white/20 rounded-lg cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E8752A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Expandable Search */}
          {searchOpen && (
            <div className="lg:hidden mt-2.5">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, gifts, photos & more..."
                  className="w-full pl-3.5 pr-20 py-2 bg-white text-stone-900 placeholder-stone-400 text-xs rounded-lg border border-stone-300 shadow-xs focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#E8752A] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: WHITE CATEGORY NAVIGATION BAR (52–60px High)                     */}
      {/* With "All Categories ↓" at far left and 7 primary categories               */}
      {/* ========================================================================= */}
      <div className="hidden lg:block w-full bg-white border-b border-stone-200 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <nav className="flex items-center justify-between h-[54px] w-full text-xs font-semibold text-[#111827]">
            
            <div className="flex items-center gap-1 xl:gap-2 overflow-x-auto scrollbar-none py-1">
              
              {/* 1. "ALL CATEGORIES" DROPDOWN BUTTON (Far Left) */}
              <div
                ref={allCatRef}
                className="relative shrink-0"
              >
                <button
                  type="button"
                  onClick={handleToggleAllCategories}
                  className={`px-3.5 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs border ${
                    allCategoriesOpen 
                      ? 'bg-stone-200 text-[#0E4A93] border-blue-300/70' 
                      : 'bg-stone-100 hover:bg-stone-200/90 text-[#0E4A93] border-stone-200/80'
                  }`}
                  aria-expanded={allCategoriesOpen}
                  aria-haspopup="true"
                >
                  <Grid className="w-4 h-4 text-[#0E4A93]" />
                  <span>Print Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#0E4A93] transition-transform duration-200 ${allCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* All Categories Dropdown Menu */}
                {allCategoriesOpen && allCatMenuPos && createPortal(
                  <div
                    ref={allCatDropdownRef}
                    data-header-portal="all-categories"
                    className="fixed w-[340px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-stone-200/90 z-50 p-2 text-left animate-in fade-in slide-in-from-top-2 select-none"
                    style={{ top: allCatMenuPos.top, left: allCatMenuPos.left }}
                  >
                    <div className="px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#0E4A93]">
                        <Grid className="w-3.5 h-3.5 text-[#0E4A93]" />
                        <span>Print Categories</span>
                      </span>
                      <span className="text-[10px] font-semibold text-stone-400">11 Categories</span>
                    </div>
                    
                    <div className="py-1 space-y-0.5 max-h-[420px] overflow-y-auto scrollbar-none">
                      {ALL_CATEGORIES_MENU_ITEMS.map((cat) => {
                        const isCatActive = activeNav === cat.slug;
                        return (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => {
                              setAllCategoriesOpen(false);
                              setActiveMegaMenu(null);
                              onSelectCategory(cat.slug);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                              isCatActive 
                                ? 'bg-blue-50/80 text-[#0E4A93] font-semibold' 
                                : 'text-stone-700 hover:text-[#0E4A93] hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-8 h-8 rounded-lg object-cover border border-stone-200/80 shrink-0" 
                              />
                              <div className="min-w-0">
                                <div className={`text-xs truncate ${isCatActive ? 'font-bold text-[#0E4A93]' : 'font-semibold text-stone-800 group-hover:text-[#0E4A93]'}`}>
                                  {cat.name}
                                </div>
                                <div className="text-[10px] text-stone-400 truncate">
                                  {cat.description}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-all ${
                              isCatActive 
                                ? 'text-[#0E4A93] opacity-100 translate-x-0.5' 
                                : 'text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#0E4A93]'
                            }`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Separator */}
              <div className="h-5 w-[1px] bg-stone-200 mx-1" />

              {/* 2. SHOPPING CATEGORIES (Exact 9 Categories, Bulk Order moved to main header) */}
              {CATEGORY_BAR_ITEMS.map((cat, idx) => {
                const Icon = getCategoryIcon(cat.iconName);
                const isActive = activeNav === cat.slug;
                const isMenuOpen = activeMegaMenu === cat.slug;
                const menuData = MEGA_MENUS_DATA[cat.slug];

                return (
                  <React.Fragment key={cat.slug}>
                    {idx > 0 && (
                      <div className="hidden xl:block h-4 w-[1px] bg-stone-200/80 shrink-0" />
                    )}

                    <div
                      data-mega-menu-trigger={cat.slug}
                      className="relative"
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        handleMegaMenuEnter(cat.slug, r);
                      }}
                      onMouseLeave={handleMegaMenuLeave}
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(cat.slug)}
                        className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                          isActive
                            ? 'text-[#0E4A93] font-bold bg-blue-50/70 border-blue-200/60 shadow-2xs'
                            : isMenuOpen
                              ? 'text-[#0E4A93] font-bold bg-stone-100 border-transparent'
                              : 'text-[#111827] hover:text-[#0E4A93] hover:bg-stone-50 font-semibold border-transparent'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${
                          isActive || isMenuOpen ? 'text-[#0E4A93]' : 'text-stone-500'
                        }`} strokeWidth={1.9} />
                        <span>{cat.name}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          isMenuOpen ? 'rotate-180 text-[#0E4A93]' : 'text-stone-400'
                        }`} />
                      </button>

                      {/* Mega-Menu Dropdown Panel */}
                      {isMenuOpen && menuData && megaMenuPos && createPortal(
                        <div
                          ref={megaMenuDropdownRef}
                          data-header-portal="mega-menu"
                          className="fixed w-[850px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-5 lg:p-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2 text-left select-none whitespace-normal"
                          style={{ top: megaMenuPos.top, left: megaMenuPos.left }}
                          onMouseEnter={() => {
                            if (megaMenuTimeoutRef.current) {
                              clearTimeout(megaMenuTimeoutRef.current);
                              megaMenuTimeoutRef.current = null;
                            }
                            setActiveMegaMenu(cat.slug);
                          }}
                          onMouseLeave={handleMegaMenuLeave}
                        >
                          <div className="grid grid-cols-12 gap-5 items-start">
                            {/* Column 1: Group 1 (4 cols) */}
                            {menuData.groups[0] && (
                              <div className="col-span-4 border-r border-stone-100 pr-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E4A93] uppercase tracking-wider mb-2.5 pb-1.5 border-b border-stone-100">
                                  {renderGroupIcon(menuData.groups[0].iconType)}
                                  <span>{menuData.groups[0].title}</span>
                                </div>
                                <ul className="space-y-0.5">
                                  {menuData.groups[0].items.map((item) => (
                                    <li key={item.name}>
                                      <button
                                        type="button"
                                        onClick={() => handleItemClick(item.slug, item.actionType)}
                                        className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:text-[#0E4A93] hover:bg-blue-50/50 rounded-md transition-colors font-medium flex items-center justify-between group cursor-pointer"
                                      >
                                        <div>
                                          <span className="block font-semibold text-stone-900 group-hover:text-[#0E4A93]">{item.name}</span>
                                          {item.description && (
                                            <span className="block text-[10px] text-stone-500 font-normal leading-tight mt-0.5">{item.description}</span>
                                          )}
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Column 2: Group 2 (4 cols) */}
                            {menuData.groups[1] && (
                              <div className="col-span-4 border-r border-stone-100 pr-4">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E4A93] uppercase tracking-wider mb-2.5 pb-1.5 border-b border-stone-100">
                                  {renderGroupIcon(menuData.groups[1].iconType)}
                                  <span>{menuData.groups[1].title}</span>
                                </div>
                                <ul className={`space-y-0.5 ${menuData.groups[1].items.length > 8 ? 'max-h-[350px] overflow-y-auto pr-1 scrollbar-none' : ''}`}>
                                  {menuData.groups[1].items.map((item) => (
                                    <li key={item.name}>
                                      <button
                                        type="button"
                                        onClick={() => handleItemClick(item.slug, item.actionType)}
                                        className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:text-[#0E4A93] hover:bg-blue-50/50 rounded-md transition-colors font-medium flex items-center justify-between group cursor-pointer"
                                      >
                                        <div>
                                          <span className="block font-semibold text-stone-900 group-hover:text-[#0E4A93]">{item.name}</span>
                                          {item.description && (
                                            <span className="block text-[10px] text-stone-500 font-normal leading-tight mt-0.5">{item.description}</span>
                                          )}
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Column 3: Promotional Panel (4 cols) */}
                            <div className="col-span-4 flex flex-col justify-between h-full bg-stone-50 rounded-xl p-3.5 border border-stone-200/80">
                              <div>
                                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-stone-200 mb-2.5 shadow-xs">
                                  <img
                                    src={menuData.promo.image}
                                    alt={menuData.promo.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 left-2 bg-[#E8752A] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                                    {menuData.promo.badge}
                                  </div>
                                </div>
                                <h4 className="font-bold text-sm text-[#0E4A93] mb-1">
                                  {menuData.promo.title}
                                </h4>
                                <p className="text-[11px] text-stone-500 leading-snug mb-3">
                                  {menuData.promo.tagline}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleItemClick(menuData.promo.slug, menuData.promo.actionType)}
                                className="w-full py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                              >
                                <span>{menuData.promo.buttonText}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE HORIZONTAL CATEGORY BAR                                            */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full bg-white border-b border-stone-200 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 whitespace-nowrap shadow-xs">
        {/* All categories mobile pill */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 bg-stone-100 text-[#0E4A93] border border-stone-200"
        >
          <Grid className="w-3 h-3" />
          <span>All</span>
        </button>

        {CATEGORY_BAR_ITEMS.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isActive = activeNav === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleNavClick(cat.slug)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                isActive 
                  ? 'text-white bg-[#0E4A93] font-bold shadow-xs' 
                  : 'text-stone-700 bg-stone-100 hover:bg-stone-200'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-stone-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU                                                        */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-80 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 bg-[#0E4A93] text-white flex items-center justify-between">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img src="/canvas-india-official-logo.png" alt="Canvas India" className="w-[125px] h-auto object-contain" />
              </Link>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-1 text-white hover:text-stone-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            

            {/* Mobile Account Section */}
            <div className="p-3 bg-stone-50 border-b border-stone-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0E4A93] text-white flex items-center justify-center font-bold text-xs">
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{profile?.full_name || 'Canvas Member'}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 px-2 bg-white border border-stone-200 text-[#0E4A93] text-[11px] font-semibold rounded-lg text-center shadow-2xs"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 px-2 bg-[#0E4A93] text-white text-[11px] font-semibold rounded-lg text-center shadow-2xs"
                    >
                      Account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-stone-600 font-medium">Sign in for personalized custom orders and tracking.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 px-2 bg-[#0E4A93] text-white text-xs font-bold rounded-lg text-center shadow-2xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 px-2 bg-white border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2 px-1">
                Explore Categories &amp; Products
              </div>
              {[...PRIMARY_CATEGORIES, {
                id: 'cat-designers-architects',
                name: 'Designers & Architects',
                slug: 'designers-architects',
                iconName: 'Building2' as const,
                startingPrice: 0,
                image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80',
                description: 'Interior trade professional solutions',
              }].map((cat) => {
                const Icon = getCategoryIcon(cat.iconName);
                const isActive = activeNav === cat.slug;
                const isExpanded = expandedMobileCategory === cat.slug;
                const menuData = MEGA_MENUS_DATA[cat.slug];

                return (
                  <div key={cat.slug} className="rounded-xl overflow-hidden border border-stone-200/60 bg-stone-50/50 my-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (menuData) {
                          setExpandedMobileCategory(isExpanded ? null : cat.slug);
                        } else {
                          handleNavClick(cat.slug);
                        }
                      }}
                      className={`w-full text-left py-2.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                        isActive || isExpanded
                          ? 'text-[#0E4A93] font-bold bg-blue-50' 
                          : 'text-[#111827] hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#0E4A93]" strokeWidth={1.8} />
                        <span>{cat.name}</span>
                      </div>
                      {menuData ? (
                        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#0E4A93]' : ''}`} />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </button>

                    {isExpanded && menuData && (
                      <div className="p-3 bg-white space-y-3 border-t border-stone-100 text-xs">
                        {menuData.groups.map((group, gIdx) => (
                          <div key={group.title} className={gIdx > 0 ? 'pt-2 border-t border-stone-100' : ''}>
                            <div className="font-bold text-[11px] text-[#0E4A93] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              {renderGroupIcon(group.iconType)}
                              <span>{group.title}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 pl-1">
                              {group.items.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => handleItemClick(item.slug, item.actionType)}
                                  className="text-left py-1 text-xs text-stone-600 hover:text-[#0E4A93] font-medium flex items-center justify-between"
                                >
                                  <span>{item.name}</span>
                                  <ArrowRight className="w-3 h-3 text-stone-300" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => handleItemClick(menuData.promo.slug, menuData.promo.actionType)}
                            className="w-full py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <span>{menuData.promo.buttonText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="font-semibold text-stone-900">Need Help?</div>
              <div>WhatsApp: +91 78930 51555</div>
              <div className="text-[11px] text-stone-500">Pan-India delivery with live tracking</div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
