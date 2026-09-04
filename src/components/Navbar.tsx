import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
  Clock,
  Layers,
} from 'lucide-react';
import { CanvasIndiaLogo } from './CanvasIndiaLogo';
import { AnnouncementBar } from './AnnouncementBar';
import { FEATURED_PRODUCTS } from '../data/brandData';

interface NavbarProps {
  themeVariant?: 'light' | 'editorial' | 'commerce';
  onOpenQuote: () => void;
  onOpenCart: () => void;
  onOpenSwatch?: () => void;
  cartCount: number;
  wishlistCount?: number;
  onSelectProduct?: (productId: string) => void;
  onNavigateCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeVariant = 'light',
  onOpenQuote,
  onOpenCart,
  onOpenSwatch,
  cartCount,
  wishlistCount = 3,
  onSelectProduct,
  onNavigateCategory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const searchResults = searchQuery.trim() === ''
    ? []
    : FEATURED_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4);

  const categories = [
    {
      id: 'home',
      label: 'Home',
      href: '#hero',
    },
    {
      id: 'canvas',
      label: 'Canvas',
      href: '#materials',
      hasDropdown: true,
      items: [
        { name: 'Museum Gallery Wrap Canvas', desc: '420 GSM pure cotton archival stretched canvas' },
        { name: 'Custom Canvas Print', desc: 'Personal photo & artwork reproduction' },
        { name: 'Canvas Wall Art Collection', desc: 'Curated artistic suites for residences' },
        { name: 'Rolled Raw Cotton Canvas', desc: 'Unmounted rolls for artist studios & framing' },
      ],
    },
    {
      id: 'acrylic',
      label: 'Acrylic',
      href: '#materials',
      hasDropdown: true,
      items: [
        { name: 'Acrylic Photo Frame', desc: 'Diamond-polished floating glass prints' },
        { name: 'Seamless Acrylic Display', desc: 'Architectural vitrines and brand pedestals' },
        { name: 'Backlit Acrylic Signage', desc: 'Edge-lit laser-engraved corporate panels' },
        { name: 'Desktop Acrylic Obelisks', desc: '25mm solid crystal awards and mementos' },
      ],
    },
    {
      id: 'cork',
      label: 'Cork',
      href: '#materials',
      hasDropdown: true,
      items: [
        { name: 'Archon Cork Board', desc: 'High-density self-healing bulletin board' },
        { name: 'Custom Cork Display', desc: 'Geometric 3D acoustic wall cladding tiles' },
        { name: 'Framed Cork Pinboards', desc: 'Anodized aluminum and hardwood framed' },
        { name: 'Printed Cork Art Panels', desc: 'Organic textures with fine pigment graphics' },
      ],
    },
    {
      id: 'wall-art',
      label: 'Wall Art',
      href: '#featured-products',
    },
    {
      id: 'frames',
      label: 'Frames',
      href: '#featured-products',
    },
    {
      id: 'custom-solutions',
      label: 'Custom Solutions',
      href: '#custom-solutions',
    },
    {
      id: 'corporate',
      label: 'Corporate',
      href: '#applications',
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '#project-showcase',
    },
    {
      id: 'about-us',
      label: 'About Us',
      href: '#why-canvas-india',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '#contact-footer',
    },
  ];

  const handleNavClick = (href: string, categoryId?: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (categoryId && onNavigateCategory) {
      onNavigateCategory(categoryId);
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full transition-all duration-300">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar
        onOpenQuote={onOpenQuote}
        onOpenOffers={() => handleNavClick('#featured-products', 'offers')}
      />

      {/* 2. Main Header Level 2: Orange header (or white for editorial), ~76-88px tall */}
      <div
        className={`w-full transition-all duration-300 ${
          themeVariant === 'editorial'
            ? isScrolled
              ? 'bg-white/95 backdrop-blur-md py-2 shadow-md border-b border-stone-200 text-stone-900'
              : 'bg-white py-3 border-b border-stone-200 text-stone-900 shadow-xs'
            : isScrolled
            ? 'bg-[#E8751A] py-2 shadow-md text-white'
            : 'bg-[#E8751A] py-3 text-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6 min-h-[64px] sm:min-h-[72px] md:min-h-[76px]">
          
          {/* Left: Dedicated Canvas India Logo Container (190-220px wide desktop, 130-155px mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 -ml-2 lg:hidden rounded-lg transition-colors ${
                themeVariant === 'editorial'
                  ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-white hover:text-orange-100 hover:bg-white/10'
              }`}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="block group"
              aria-label="Canvas India Home"
            >
              {themeVariant === 'editorial' ? (
                <div className="w-[145px] sm:w-[195px] md:w-[220px] h-[54px] sm:h-[68px] md:h-[76px] flex items-center justify-start shrink-0">
                  <CanvasIndiaLogo className="w-full h-full object-contain" variant="original" />
                </div>
              ) : (
                <div className="w-[140px] sm:w-[190px] md:w-[215px] h-[52px] sm:h-[68px] md:h-[74px] bg-white rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 shadow-sm border border-white/50 flex items-center justify-center shrink-0 hover:shadow-md transition-shadow">
                  <CanvasIndiaLogo className="w-full h-full object-contain" variant="original" />
                </div>
              )}
            </a>
          </div>

          {/* Center: Large Prominent E-Commerce Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search Canvas, Acrylic, Cork & more..."
                className={`w-full pl-5 pr-12 py-2.5 sm:py-3 text-sm rounded-full outline-none transition-all placeholder:text-stone-400 ${
                  themeVariant === 'editorial'
                    ? 'bg-stone-100 hover:bg-stone-100/90 focus:bg-white text-stone-900 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs'
                    : 'bg-white text-stone-900 shadow-md focus:ring-2 focus:ring-stone-900/40 border-0'
                }`}
              />
              <button
                type="button"
                className={`absolute right-1.5 p-2 sm:p-2.5 rounded-full text-white transition-colors shadow-xs ${
                  themeVariant === 'editorial'
                    ? 'bg-stone-900 hover:bg-orange-600'
                    : 'bg-[#E8751A] hover:bg-[#d66512]'
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {searchFocused && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 text-left">
                {searchQuery.trim() === '' ? (
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Popular Materials &amp; Categories
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Canvas Prints', 'Acrylic Wall Frame', 'Cork Pinboard', 'Floating Frames', 'Corporate Displays'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-1 rounded-full text-xs bg-stone-100 hover:bg-orange-50 hover:text-orange-600 text-stone-700 transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Custom dimensions &amp; bespoke orders</span>
                      <span className="text-[#E8751A] font-semibold cursor-pointer" onClick={onOpenQuote}>
                        Request Custom Quote →
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Matching Products ({searchResults.length})
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-stone-100">
                        {searchResults.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => {
                              if (onSelectProduct) onSelectProduct(prod.id);
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-stone-50 rounded-xl transition-colors text-left group cursor-pointer"
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-stone-900 text-sm group-hover:text-orange-600 truncate">
                                {prod.name}
                              </div>
                              <div className="text-xs text-stone-500 truncate">{prod.tagline}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-orange-600">{prod.startingPrice}</span>
                              <span className="block text-[10px] text-stone-400">Starting</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-stone-500">
                        No products found for "{searchQuery}". Try searching for Canvas, Acrylic, or Cork.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Account, Wishlist, Cart & White "Get a Quote" CTA */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Account */}
            <button
              onClick={onOpenQuote}
              className={`hidden sm:flex flex-col items-center p-1.5 rounded-xl transition-colors ${
                themeVariant === 'editorial'
                  ? 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                  : 'text-white hover:text-orange-100 hover:bg-white/10'
              }`}
              title="Account"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">Account</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('#featured-products')}
              className={`relative hidden sm:flex flex-col items-center p-1.5 rounded-xl transition-colors ${
                themeVariant === 'editorial'
                  ? 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                  : 'text-white hover:text-orange-100 hover:bg-white/10'
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">Wishlist</span>
              {wishlistCount > 0 && (
                <span className={`absolute top-1 right-2 w-4 h-4 rounded-full font-bold text-[10px] flex items-center justify-center ${
                  themeVariant === 'editorial'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-[#E8751A]'
                }`}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className={`relative flex flex-col items-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                themeVariant === 'editorial'
                  ? 'text-stone-700 hover:text-orange-600 hover:bg-stone-50'
                  : 'text-white hover:text-orange-100 hover:bg-white/10'
              }`}
              title="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">Cart</span>
              {cartCount > 0 && (
                <span className={`absolute top-0.5 right-1 w-4 h-4 rounded-full font-bold text-[10px] flex items-center justify-center shadow-xs ${
                  themeVariant === 'editorial'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-[#E8751A]'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Prominent CTA: "Get a Quote" */}
            <button
              onClick={onOpenQuote}
              className={`ml-1 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-1.5 group cursor-pointer ${
                themeVariant === 'editorial'
                  ? 'bg-[#E8751A] hover:bg-[#d66512] text-white shadow-orange-500/20'
                  : 'bg-white hover:bg-stone-50 active:bg-stone-100 text-[#E8751A] hover:shadow-lg'
              }`}
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Row Underneath (White Category Bar) */}
      <div className="w-full bg-white border-b border-stone-200 text-stone-700 text-xs hidden lg:block shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-0.5 xl:gap-1.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative py-2.5 px-2.5 xl:px-3 font-medium transition-colors hover:text-orange-600 flex items-center gap-1 cursor-pointer group"
                onMouseEnter={() => cat.hasDropdown && setActiveDropdown(cat.id)}
                onMouseLeave={() => cat.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={cat.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(cat.href, cat.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <span className="tracking-wide">{cat.label}</span>
                  {cat.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 transition-transform group-hover:rotate-180" />}
                </a>

                {/* Dropdown Menu */}
                {cat.hasDropdown && activeDropdown === cat.id && cat.items && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 text-left">
                    {cat.items.map((item) => (
                      <a
                        key={item.name}
                        href={cat.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(cat.href, cat.id);
                        }}
                        className="block p-2.5 rounded-lg hover:bg-orange-50/70 transition-colors group/sub"
                      >
                        <div className="font-semibold text-stone-900 group-hover/sub:text-orange-600 text-xs">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">{item.desc}</div>
                      </a>
                    ))}
                    <div className="p-2 border-t border-stone-100 mt-1 flex items-center justify-between text-[11px] text-orange-600 font-bold">
                      <span>Explore all {cat.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Highlight: "Offers" with orange styling */}
          <div className="flex items-center gap-3">
            <a
              href="#featured-products"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#featured-products', 'offers');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs tracking-wide hover:bg-orange-200 transition-colors border border-orange-200 shadow-xs"
            >
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              <span>Offers</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#E8751A] text-white text-[9px]">20% OFF</span>
            </a>

            {onOpenSwatch && (
              <button
                onClick={onOpenSwatch}
                className="hidden xl:inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>Swatch Box</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto">
            {/* Header of drawer */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <CanvasIndiaLogo className="h-10 w-auto" variant="original" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-stone-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-stone-100 text-stone-900 text-xs rounded-lg border border-stone-300 outline-none"
                />
                <Search className="w-4 h-4 text-stone-500 absolute right-3" />
              </div>
            </div>

            {/* Mobile Links */}
            <div className="p-4 flex-1 space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={cat.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(cat.href, cat.id);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg text-sm font-medium text-stone-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <span>{cat.label}</span>
                  {cat.hasDropdown && <ChevronDown className="w-4 h-4 text-stone-400" />}
                </a>
              ))}

              <div className="pt-3 border-t border-stone-100">
                <a
                  href="#featured-products"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#featured-products');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg text-sm font-bold text-orange-600 bg-orange-50"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Special Offers (20% Off)
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenSwatch && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSwatch();
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-xs hover:bg-stone-100"
                >
                  Order Physical Swatch Kit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
