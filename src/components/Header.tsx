import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
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
  Flame
} from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('canvas-prints');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const allCatRef = useRef<HTMLDivElement>(null);

  // Dropdown panels are rendered via a portal (see below) so the horizontally
  // scrollable category nav row (overflow-x-auto) doesn't clip them — per the
  // CSS overflow spec, overflow-x: auto forces overflow-y to auto too, which
  // silently clips any absolutely-positioned dropdown nested inside that row.
  const [allCatMenuPos, setAllCatMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [megaMenuPos, setMegaMenuPos] = useState<{ top: number; left: number } | null>(null);

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
      default: return Sliders;
    }
  };

  // Close mega-menu or search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setActiveMegaMenu(null);
        setAllCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (allCatRef.current && !allCatRef.current.contains(target)) {
        setAllCategoriesOpen(false);
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
    setActiveNav(slug);
    onSelectCategory(slug);
    setActiveMegaMenu(null);
    setAllCategoriesOpen(false);
    setMobileMenuOpen(false);
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
      {/* LAYER 1: TOP PROMOTIONAL STRIP (Dark Navy)                                */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#082C59] text-stone-200 text-xs py-1.5 font-medium tracking-wide border-b border-[#062347]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
          
          {/* Left: Free delivery + Coupon code */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-stone-100">
              <span>🚚</span>
              <span>Free Delivery on orders above ₹999 across India</span>
            </span>
            <span className="text-blue-300/40 hidden md:inline">|</span>
            <span className="hidden md:inline text-stone-300">
              Use Code: <strong className="text-amber-300 font-bold">CANVAS10</strong> for 10% OFF
            </span>
          </div>

          {/* Right: Phone support + Track order + Login */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-stone-200">
            <a 
              href="tel:+917893051555" 
              className="hidden lg:flex items-center gap-1 text-stone-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-stone-300" />
              <span>Support:</span>
              <span className="font-bold text-white">+91 78930 51555</span>
            </a>
            <span className="text-blue-300/40 hidden lg:inline">|</span>
            
            <button 
              type="button"
              onClick={() => onOpenAccount && onOpenAccount()}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Track Order</span>
            </button>
            <span className="text-blue-300/40">|</span>

            <button 
              type="button"
              onClick={() => onOpenAccount && onOpenAccount()}
              className="hover:text-white flex items-center gap-1 font-semibold text-white transition-colors cursor-pointer"
            >
              <span>Login / Sign Up</span>
            </button>
          </div>

        </div>
      </div>

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

            {/* 3. HEADER ACTIONS: Account, Wishlist, Cart + "Get a Quote →" Button */}
            <div className="flex items-center gap-4 xl:gap-6 shrink-0 text-xs sm:text-sm font-semibold">
              
              {/* Account */}
              <button 
                type="button"
                onClick={() => onOpenAccount && onOpenAccount()}
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer py-1"
              >
                <User className="w-4 h-4 text-white/90" strokeWidth={2} />
                <span>Account</span>
              </button>

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

              {/* 4. PROMINENT "GET A QUOTE →" BUTTON (Orange #E8752A) */}
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-4 py-2 bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Get a Quote →</span>
              </button>

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
              
              {/* 1. "ALL CATEGORIES ↓" DROPDOWN BUTTON (Far Left) */}
              <div
                ref={allCatRef}
                className="relative"
                onMouseEnter={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setAllCatMenuPos({ top: r.bottom + 4, left: r.left });
                  setAllCategoriesOpen(true);
                }}
                onMouseLeave={() => setAllCategoriesOpen(false)}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setAllCatMenuPos({ top: r.bottom + 4, left: r.left });
                    setAllCategoriesOpen(!allCategoriesOpen);
                  }}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200/90 text-[#0E4A93] font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs border border-stone-200/80"
                >
                  <Grid className="w-4 h-4 text-[#0E4A93]" />
                  <span>All Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#0E4A93] transition-transform duration-200 ${allCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* All Categories Dropdown Menu — portaled to <body> so the
                    scrollable nav row above can't clip it (see megaMenuPos comment) */}
                {allCategoriesOpen && allCatMenuPos && createPortal(
                  <div
                    className="fixed w-72 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 p-2 text-left animate-in fade-in slide-in-from-top-2 select-none"
                    style={{ top: allCatMenuPos.top, left: allCatMenuPos.left }}
                    onMouseEnter={() => setAllCategoriesOpen(true)}
                    onMouseLeave={() => setAllCategoriesOpen(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                      Browse All Categories
                    </div>
                    <div className="py-1 space-y-0.5 max-h-[380px] overflow-y-auto scrollbar-none">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleItemClick(cat.slug, 'category')}
                          className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:text-[#0E4A93] hover:bg-blue-50/60 rounded-lg transition-colors font-medium flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={cat.image} alt={cat.name} className="w-7 h-7 rounded-md object-cover border border-stone-200" />
                            <span>{cat.name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-stone-100 bg-stone-50 rounded-b-lg">
                      <button
                        type="button"
                        onClick={onOpenQuote}
                        className="w-full py-1.5 bg-[#E8752A] hover:bg-[#D3631A] text-white text-[11px] font-bold rounded-md transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Need Custom Dimensions? Request Quote →</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>

              {/* Separator */}
              <div className="h-5 w-[1px] bg-stone-200 mx-1" />

              {/* 2. EXACT 7 PRIMARY CATEGORIES IN EXACT ORDER */}
              {PRIMARY_CATEGORIES.map((cat, idx) => {
                const Icon = getCategoryIcon(cat.iconName);
                const isActive = activeNav === cat.slug;
                const isMenuOpen = activeMegaMenu === cat.slug;
                const menuData = MEGA_MENUS_DATA[cat.slug];

                return (
                  <React.Fragment key={cat.slug}>
                    {/* Subtle separator between items */}
                    {idx > 0 && (
                      <div className="hidden xl:block h-4 w-[1px] bg-stone-200/80 shrink-0" />
                    )}

                    <div
                      className="relative"
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const estWidth = Math.min(850, window.innerWidth * 0.9);
                        const left = Math.min(Math.max(r.left, 16), window.innerWidth - estWidth - 16);
                        setMegaMenuPos({ top: r.bottom + 4, left });
                        setActiveMegaMenu(cat.slug);
                      }}
                      onMouseLeave={() => setActiveMegaMenu(null)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          if (activeMegaMenu === cat.slug) {
                            handleItemClick(cat.slug, 'category');
                          } else {
                            const r = e.currentTarget.getBoundingClientRect();
                            const estWidth = Math.min(850, window.innerWidth * 0.9);
                            const left = Math.min(Math.max(r.left, 16), window.innerWidth - estWidth - 16);
                            setMegaMenuPos({ top: r.bottom + 4, left });
                            setActiveMegaMenu(cat.slug);
                          }
                        }}
                        className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-[#0E4A93] font-bold bg-blue-50/70 border border-blue-200/60'
                            : isMenuOpen
                              ? 'text-[#0E4A93] font-bold bg-stone-100'
                              : 'text-[#111827] hover:text-[#0E4A93] hover:bg-stone-50 font-semibold'
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

                      {/* Mega-Menu Dropdown Panel — portaled to <body> so the horizontally
                          scrollable nav row (overflow-x-auto) can't clip it. Per the CSS
                          overflow spec, overflow-x: auto forces overflow-y to auto too,
                          which silently clips an absolutely-positioned dropdown nested
                          inside that row instead of showing it below the nav bar. */}
                      {isMenuOpen && menuData && megaMenuPos && createPortal(
                        <div
                          className="fixed w-[850px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-5 lg:p-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2 text-left select-none whitespace-normal"
                          style={{ top: megaMenuPos.top, left: megaMenuPos.left }}
                          onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                          onMouseLeave={() => setActiveMegaMenu(null)}
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

            {/* Right Side: Quick Deal Indicator */}
            <div className="hidden 2xl:flex items-center gap-2 text-xs font-bold text-[#E8752A]">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Great Indian Print Sale Live</span>
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

        {PRIMARY_CATEGORIES.map((cat) => {
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
            
            <div className="p-3 border-b border-stone-100">
              <button
                type="button"
                onClick={() => { onOpenQuote(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Request Bulk / Corporate Quote →</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2 px-1">
                Explore Categories &amp; Products
              </div>
              {PRIMARY_CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat.iconName);
                const isActive = activeNav === cat.slug;
                const isExpanded = expandedMobileCategory === cat.slug;
                const menuData = MEGA_MENUS_DATA[cat.slug];

                return (
                  <div key={cat.slug} className="rounded-xl overflow-hidden border border-stone-200/60 bg-stone-50/50 my-1">
                    <button
                      type="button"
                      onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.slug)}
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
                      <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#0E4A93]' : ''}`} />
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
