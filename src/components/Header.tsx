import React, { useState, useEffect } from 'react';
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
  PhoneCall,
  ChevronDown,
  Sparkles,
  Sliders
} from 'lucide-react';
import { Product } from '../types';
import { MEGA_MENUS_DATA } from '../data/storeData';

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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('canvas');
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // Exact 7 categories requested in exact order:
  // Canvas, Acrylic, Cork, Custom Prints, Gifts & Occasions, Bulk Order, Corporate Orders
  const navCategories = [
    { name: 'Canvas', slug: 'canvas', icon: Palette },
    { name: 'Acrylic', slug: 'acrylic', icon: Layers },
    { name: 'Cork', slug: 'cork', icon: CircleDot },
    { name: 'Custom Prints', slug: 'custom-prints', icon: Printer },
    { name: 'Gifts & Occasions', slug: 'gifts', icon: Gift },
    { name: 'Bulk Order', slug: 'bulk-order', icon: Package },
    { name: 'Corporate Orders', slug: 'corporate-orders', icon: Building2 },
  ];

  // Close mega-menu when clicking outside
  useEffect(() => {
    if (!activeMegaMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMegaMenu]);

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

  const handleNavClick = (slug: string, _name?: string) => {
    setActiveNav(slug);
    onSelectCategory(slug);
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
    setMobileMenuOpen(false);
  };

  const renderGroupIcon = (iconType: string) => {
    switch (iconType) {
      case 'heart': return <Heart className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'palette': return <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'layers': return <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'circleDot': return <CircleDot className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'printer': return <Printer className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'package': return <Package className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'building': return <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />;
      case 'sliders':
      default:
        return <Sliders className="w-3.5 h-3.5 text-[var(--accent)]" />;
    }
  };

  const getDropdownPositionClass = (slug: string) => {
    switch (slug) {
      case 'canvas':
        return 'left-0';
      case 'acrylic':
        return 'left-0 xl:left-[-20px]';
      case 'cork':
        return 'left-[-60px] xl:left-[-40px]';
      case 'custom-prints':
        return 'left-1/2 -translate-x-1/2';
      case 'gifts':
        return 'right-[-140px] xl:right-[-60px] 2xl:right-0';
      case 'bulk-order':
        return 'right-0 xl:right-[-40px] 2xl:right-0';
      case 'corporate-orders':
        return 'right-0';
      default:
        return 'left-0';
    }
  };

  return (
    <header className="relative z-40 w-full max-w-none font-manrope">
      {/* Top Utility / Announcement Strip in Dark Navy — Full Viewport Width */}
      <div className="w-full bg-[#0F243E] text-stone-200 text-xs py-1.5 sm:py-2 font-medium tracking-wide">
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-stone-200">
            <span>🚚 Free Delivery on orders above ₹999 across India</span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-300">
              Use Code: <strong className="text-white font-bold bg-[var(--accent)] px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] uppercase tracking-wide">CANVAS10</strong> for 10% OFF
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-stone-300">
            <button 
              onClick={onOpenQuote} 
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-[var(--accent)]" />
              <span>Customer Support: +91 90765 43510</span>
            </button>
            <span className="hidden sm:inline text-stone-500">|</span>
            <span className="hidden sm:inline hover:text-white cursor-pointer transition-colors">📦 Track Order</span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span 
              onClick={() => alert('Customer portal: Login or Sign Up')}
              className="hidden md:inline hover:text-white cursor-pointer transition-colors"
            >
              👤 Login / Sign Up
            </span>
          </div>
        </div>
      </div>

      {/* Main Header — Clean Warm White #FFFDF9 Background (Compact Height) */}
      <div className="w-full bg-[#FFFDF9] border-b border-[#EFE9DF] shadow-xs relative py-1.5 lg:py-2">
        {/* Full-width Container with standardized padding matching Hero */}
        <div className="w-full max-w-[1680px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 relative z-10">

          {/* DESKTOP HEADER (lg and up): 
              [ CANVAS INDIA LOGO ]  [ Search products, gifts, artists & more... ] [Search] [Account] [Wishlist] [Cart] [Get a Quote]
                                     [ Canvas | Acrylic | Cork | Custom Prints | Gifts & Occasions | Bulk Order | Corporate Orders ]
          */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 w-full">
            
            {/* 1. CANVAS INDIA LOGO: Visible on LEFT, moderately large, doesn't force excessive height */}
            <div className="shrink-0 flex items-center justify-center">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavClick('canvas', 'Canvas'); }}
                className="block transition-opacity hover:opacity-95 cursor-pointer"
                title="Canvas India - Canvas, Acrylic & Cork"
              >
                <img
                  src="/canvas-india-logo.png"
                  alt="Canvas India"
                  className="w-[150px] lg:w-[165px] h-auto max-h-[68px] object-contain block select-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/canvas-india-logo.jpeg';
                  }}
                />
              </a>
            </div>

            {/* RIGHT SIDE: Search Bar + Actions (Top) and Category Bar (Directly Below Search Bar) */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 py-0.5">
              
              {/* Row 1: Search Bar and Actions */}
              <div className="flex items-center justify-between gap-3.5 xl:gap-5 w-full">
                
                {/* Search Bar - wide and prominent */}
                <div className="flex-1 min-w-0 max-w-xl xl:max-w-2xl 2xl:max-w-3xl relative">
                  <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchOpen(true);
                      }}
                      onFocus={() => setSearchOpen(true)}
                      placeholder="Search for products, gifts, artists & more..."
                      className="w-full pl-4 pr-24 py-2 bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-sm rounded-xl border border-stone-200/90 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0F243E]/20 focus:border-[#0F243E] transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1 bottom-1 px-4 bg-[#0F243E] hover:bg-[#1A385C] text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Search className="w-4 h-4 text-white" />
                      <span>Search</span>
                    </button>
                  </form>

                  {/* Live Search Dropdown */}
                  {searchOpen && searchResults.length > 0 && (
                    <div 
                      className="absolute left-0 right-0 top-full mt-1.5 bg-white text-stone-800 rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100"
                      onMouseLeave={() => setSearchOpen(false)}
                    >
                      <div className="p-2 text-[11px] font-bold tracking-wider uppercase text-stone-400 bg-stone-50">
                        Matching Products
                      </div>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onOpenCustomize(product);
                            setSearchOpen(false);
                          }}
                          className="p-2.5 flex items-center gap-3 hover:bg-[var(--accent-bg)] cursor-pointer transition-colors"
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
                              {product.category} • <span className="font-bold text-[var(--accent)]">₹{product.price}</span>
                            </div>
                          </div>
                          <span className="text-xs text-[var(--accent)] font-semibold">View</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Actions: Account, Wishlist, Cart, Get a Quote */}
                <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                  {/* Account */}
                  <button 
                    onClick={() => alert('Customer portal: Login or Sign Up to view your personalized orders and saved designs.')}
                    className="flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[var(--accent)] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    title="My Account"
                  >
                    <User className="w-4 h-4 text-[#0F243E]" strokeWidth={2} />
                    <span>Account</span>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={onOpenWishlist}
                    className="relative flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[var(--accent)] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    title="Saved Wishlist"
                  >
                    <Heart className="w-4 h-4 text-[#0F243E]" strokeWidth={2} />
                    <span>Wishlist</span>
                    <span className="bg-[var(--accent)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                      {wishlistCount > 0 ? wishlistCount : 2}
                    </span>
                  </button>

                  {/* Cart */}
                  <button
                    onClick={onOpenCart}
                    className="relative flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[var(--accent)] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                    title="Shopping Cart"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#0F243E]" strokeWidth={2} />
                    <span>Cart</span>
                    <span className="bg-[var(--accent)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                      {cartCount > 0 ? cartCount : 1}
                    </span>
                  </button>
                </div>
              </div>

              {/* Row 2: Category Navigation Bar directly below the search bar area and beside the large logo */}
              <nav className="w-full bg-white rounded-xl border border-stone-200/90 shadow-xs px-3 sm:px-4 py-1.5 flex items-center justify-between gap-1 sm:gap-2 relative whitespace-nowrap">
                {navCategories.map((cat, index) => {
                  const Icon = cat.icon;
                  const isActive = activeNav === cat.slug;
                  const isMenuOpen = activeMegaMenu === cat.slug;
                  const menuData = MEGA_MENUS_DATA[cat.slug];

                  return (
                    <React.Fragment key={cat.slug}>
                      {index > 0 && (
                        <span className="text-stone-300 select-none text-xs font-light">|</span>
                      )}
                      <div
                        className="relative flex items-center"
                        onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                        onMouseLeave={() => setActiveMegaMenu(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (activeMegaMenu === cat.slug) {
                              handleItemClick(cat.slug, 'category');
                            } else {
                              setActiveMegaMenu(cat.slug);
                            }
                          }}
                          className={`px-2.5 xl:px-3 py-1 rounded-lg text-xs xl:text-sm transition-all flex items-center gap-1.5 xl:gap-2 shrink-0 cursor-pointer ${
                            isActive || isMenuOpen
                              ? 'text-[var(--accent)] bg-[var(--accent-bg)]/90 border border-[var(--accent-border)]/90 font-bold' 
                              : 'text-[#0F243E] hover:text-[var(--accent)] hover:bg-stone-50 font-semibold border border-transparent'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive || isMenuOpen ? 'text-[var(--accent)]' : 'text-[#0F243E]'}`} strokeWidth={1.8} />
                          <span>{cat.name}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-[var(--accent)]' : ''}`} />
                        </button>

                        {/* Mega-Menu Dropdown */}
                        {isMenuOpen && menuData && (
                          <div 
                            className={`absolute top-full ${getDropdownPositionClass(cat.slug)} mt-1.5 w-[850px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-5 lg:p-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2 text-left select-none whitespace-normal`}
                            onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                            onMouseLeave={() => setActiveMegaMenu(null)}
                          >
                            <div className="grid grid-cols-12 gap-5 items-start">
                              {/* Column 1: Group 1 (4 cols) */}
                              {menuData.groups[0] && (
                                <div className="col-span-4 border-r border-stone-100 pr-4">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F243E] uppercase tracking-wider mb-2.5 pb-1.5 border-b border-stone-100">
                                    {renderGroupIcon(menuData.groups[0].iconType)}
                                    <span>{menuData.groups[0].title}</span>
                                  </div>
                                  <ul className="space-y-0.5">
                                    {menuData.groups[0].items.map((item) => (
                                      <li key={item.name}>
                                        <button
                                          type="button"
                                          onClick={() => handleItemClick(item.slug, item.actionType)}
                                          className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]/70 rounded-md transition-colors font-medium flex items-center justify-between group cursor-pointer"
                                        >
                                          <div>
                                            <span className="block font-semibold text-stone-900 group-hover:text-[var(--accent)]">{item.name}</span>
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
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F243E] uppercase tracking-wider mb-2.5 pb-1.5 border-b border-stone-100">
                                    {renderGroupIcon(menuData.groups[1].iconType)}
                                    <span>{menuData.groups[1].title}</span>
                                  </div>
                                  <ul className={`space-y-0.5 ${menuData.groups[1].items.length > 8 ? 'max-h-[350px] overflow-y-auto pr-1 scrollbar-none' : ''}`}>
                                    {menuData.groups[1].items.map((item) => (
                                      <li key={item.name}>
                                        <button
                                          type="button"
                                          onClick={() => handleItemClick(item.slug, item.actionType)}
                                          className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]/70 rounded-md transition-colors font-medium flex items-center justify-between group cursor-pointer"
                                        >
                                          <div>
                                            <span className="block font-semibold text-stone-900 group-hover:text-[var(--accent)]">{item.name}</span>
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
                                    <div className="absolute top-2 left-2 bg-[var(--accent)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                                      {menuData.promo.badge}
                                    </div>
                                  </div>
                                  <h4 className="font-bold text-sm text-[#0F243E] mb-1">
                                    {menuData.promo.title}
                                  </h4>
                                  <p className="text-[11px] text-stone-500 leading-snug mb-3">
                                    {menuData.promo.tagline}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleItemClick(menuData.promo.slug, menuData.promo.actionType)}
                                  className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                                >
                                  <span>{menuData.promo.buttonText}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </nav>

            </div>
          </div>

          {/* MOBILE HEADER (screens below lg) */}
          <div className="flex lg:hidden flex-col gap-2.5 w-full">
            {/* Mobile Top Row: Menu, Logo, Search Toggle, Cart, Quote */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 text-[#0F243E] hover:bg-stone-100 rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNavClick('canvas', 'Canvas'); }}
                  className="flex items-center shrink-0"
                >
                  <img
                    src="/canvas-india-logo.png"
                    alt="Canvas India"
                    className="w-[140px] sm:w-[165px] h-[48px] sm:h-[58px] object-contain block"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/canvas-india-logo.jpeg';
                    }}
                  />
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-[#0F243E] hover:bg-stone-100 rounded-lg"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={onOpenCart}
                  className="relative p-2 text-[#0F243E] hover:bg-stone-100 rounded-lg"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5 text-[#0F243E]" strokeWidth={2} />
                  <span className="absolute top-1 right-1 bg-[var(--accent)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 0 ? cartCount : 1}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Expandable Search Bar */}
            {searchOpen && (
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, gifts, artists & more..."
                  className="w-full pl-3.5 pr-20 py-2 bg-white text-stone-900 placeholder-stone-400 text-xs rounded-lg border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0F243E]/20"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#0F243E] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>
            )}

            {/* Mobile Category Navigation Bar */}
            <nav className="w-full bg-white rounded-xl border border-stone-200/90 shadow-xs px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
              {navCategories.map((cat, index) => {
                const Icon = cat.icon;
                const isActive = activeNav === cat.slug;
                return (
                  <React.Fragment key={cat.slug}>
                    {index > 0 && <span className="text-stone-300 text-[10px]">|</span>}
                    <button
                      onClick={() => handleNavClick(cat.slug, cat.name)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 ${
                        isActive ? 'text-[var(--accent)] bg-[var(--accent-bg)] font-bold' : 'text-[#0F243E]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={1.8} />
                      <span>{cat.name}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 bg-[#0F243E] text-white flex items-center justify-between">
              <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                <img src="/canvas-india-logo.png" alt="Canvas India" className="h-9 w-auto object-contain" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white hover:text-stone-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-stone-100">
              <button
                onClick={() => { onOpenQuote(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[var(--accent)] text-white font-bold rounded-lg text-sm text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Get a Bulk Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2">
                Categories
              </div>
              {navCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeNav === cat.slug;
                const isExpanded = expandedMobileCategory === cat.slug;
                const menuData = MEGA_MENUS_DATA[cat.slug];

                return (
                  <div key={cat.slug} className="rounded-lg overflow-hidden border border-stone-200/60 bg-stone-50/50 my-1">
                    <button
                      type="button"
                      onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.slug)}
                      className={`w-full text-left py-2 px-2.5 text-sm font-medium rounded-lg flex items-center justify-between transition-colors ${
                        isActive || isExpanded
                          ? 'text-[var(--accent)] font-bold bg-[var(--accent-bg)]/80' 
                          : 'text-[#0F243E] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.8} />
                        <span className={isActive || isExpanded ? 'font-bold' : ''}>{cat.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[var(--accent)]' : ''}`} />
                    </button>

                    {isExpanded && menuData && (
                      <div className="p-3 bg-white space-y-3 border-t border-stone-100 text-xs">
                        {menuData.groups.map((group, gIdx) => (
                          <div key={group.title} className={gIdx > 0 ? 'pt-2 border-t border-stone-100' : ''}>
                            <div className="font-bold text-[11px] text-[#0F243E] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              {renderGroupIcon(group.iconType)}
                              <span>{group.title}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1 pl-1">
                              {group.items.map((item) => (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => handleItemClick(item.slug, item.actionType)}
                                  className="text-left py-1 text-xs text-stone-600 hover:text-[var(--accent)] font-medium flex items-center justify-between"
                                >
                                  <span>{item.name}</span>
                                  <ArrowRight className="w-3 h-3 text-stone-300" />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Promotional Action Button */}
                        <div className="pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => handleItemClick(menuData.promo.slug, menuData.promo.actionType)}
                            className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
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

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="font-semibold text-stone-900">Canvas India Support</div>
              <div>Customer Support: +91 90765 43510</div>
              <div>Pan-India delivery within 4-6 business days</div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

