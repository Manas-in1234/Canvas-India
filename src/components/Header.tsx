import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  LayoutGrid,
  Palette,
  Layers,
  CircleDot,
  Image as ImageIcon,
  Frame,
  FileImage,
  Printer,
  Gift,
  Building2,
  Briefcase,
  Ticket,
  PhoneCall
} from 'lucide-react';
import { Product } from '../types';

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
  const [activeNav, setActiveNav] = useState('all');

  // Exact 12 categories in the required order with clean orange outline icons
  const navCategories = [
    { name: 'Canvas', slug: 'canvas', icon: Palette },
    { name: 'Acrylic', slug: 'acrylic', icon: Layers },
    { name: 'Cork', slug: 'cork', icon: CircleDot },
    { name: 'Wall Art', slug: 'wall-art', icon: ImageIcon },
    { name: 'Photo Frames', slug: 'photo-frames', icon: Frame },
    { name: 'Posters', slug: 'posters', icon: FileImage },
    { name: 'Custom Prints', slug: 'custom-prints', icon: Printer },
    { name: 'Gifts & Occasions', slug: 'gifts', icon: Gift },
    { name: 'Corporate', slug: 'corporate', icon: Building2 },
    { name: 'Projects', slug: 'projects', icon: Briefcase },
    { name: 'Deals', slug: 'deals', icon: Ticket, isDeals: true },
  ];

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

  const handleNavClick = (slug: string, _name: string) => {
    setActiveNav(slug);
    onSelectCategory(slug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-none font-manrope">
      {/* Top Utility / Announcement Strip in Dark Navy — Full Viewport Width */}
      <div className="w-full bg-[#0F243E] text-stone-200 text-xs py-1.5 font-medium tracking-wide">
        <div className="w-full max-w-[1800px] mx-auto px-[clamp(24px,3vw,60px)] flex items-center justify-between text-center">
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="hidden sm:inline">🚚</span>
            <span>Free Delivery on orders above ₹999 across India</span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:inline text-stone-300">
              Use Code <strong className="text-white font-bold bg-[#E85D04] px-1.5 py-0.5 rounded">CANVAS15</strong> for 15% OFF
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-300">
            <button 
              onClick={onOpenQuote} 
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 text-[#E85D04]" />
              <span>Bulk Inquiries: +91 98450 12345</span>
            </button>
            <span>•</span>
            <span className="text-white font-semibold">100% Made in India</span>
          </div>
        </div>
      </div>

      {/* Main Header — Full Viewport Width with Light Cream #FFFDF9 Background */}
      <div className="w-full max-w-none bg-[#FFFDF9] border-b border-[#EFE9DF] shadow-xs relative overflow-hidden py-2.5 sm:py-3.5">
        {/* Subtle Decorative Brushstroke Accent (Top Right) */}
        <div className="absolute -top-3 -right-3 w-40 sm:w-56 h-20 sm:h-28 pointer-events-none select-none z-0 opacity-80">
          <svg viewBox="0 0 240 120" className="w-full h-full" preserveAspectRatio="none" fill="none">
            <path d="M50,0 C100,16 150,6 240,0 L240,40 C195,55 155,30 115,35 C80,40 60,20 50,0 Z" fill="#E85D04" opacity="0.35" />
            <path d="M90,0 C140,8 190,2 240,0 L240,22 C185,35 145,18 95,14 Z" fill="#D44E00" opacity="0.6" />
            <path d="M120,8 Q180,16 230,10" stroke="#E85D04" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <path d="M160,22 Q200,26 235,16" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>

        {/* Subtle Decorative Wash Accent (Bottom Left) */}
        <div className="absolute -bottom-4 -left-4 w-28 sm:w-36 h-16 sm:h-20 pointer-events-none select-none z-0 opacity-40">
          <svg viewBox="0 0 160 80" className="w-full h-full" preserveAspectRatio="none" fill="none">
            <path d="M0,35 C35,20 75,40 120,25 C140,40 110,65 70,60 C35,68 10,50 0,45 Z" fill="#849885" opacity="0.25" />
            <path d="M0,50 C25,38 55,48 90,42 C70,65 25,60 0,62 Z" fill="#A4B3A2" opacity="0.2" />
          </svg>
        </div>

        {/* Wide Responsive Inner Container */}
        <div className="w-full max-w-[1800px] mx-auto px-[clamp(24px,3vw,60px)] relative z-10 flex flex-col gap-3 sm:gap-3.5">

          {/* ROW 1: Desktop Main Header Row (Logo, Large Search Bar, Actions) */}
          <div className="relative z-10 hidden lg:flex items-center justify-between gap-4 xl:gap-8">
            
            {/* Left: Official Canvas India Logo ONLY (No extra brand text) */}
            <div className="shrink-0">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavClick('all', 'All Categories'); }}
                className="bg-white border border-stone-200/80 rounded-xl px-2.5 py-1.5 shadow-xs flex items-center justify-center shrink-0 hover:border-orange-300 transition-colors cursor-pointer group"
                title="Canvas India - Canvas, Acrylic & Cork"
              >
                <img
                  src="/canvas-india-logo.svg"
                  alt="Canvas India"
                  className="w-[130px] xl:w-[145px] h-[54px] xl:h-[60px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/canvas-india-logo.jpeg';
                  }}
                />
              </a>
            </div>

            {/* Center: Large Search Bar with Dark Navy Button */}
            <div className="flex-1 min-w-0 max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-1 xl:mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search for products, gifts, photos & more..."
                  className="w-full pl-4 pr-24 py-2.5 xl:py-3 bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-sm rounded-xl border border-stone-200/90 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0F243E]/20 focus:border-[#0F243E] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#0F243E] hover:bg-[#1A385C] text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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
                      className="p-2.5 flex items-center gap-3 hover:bg-orange-50 cursor-pointer transition-colors"
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
                          {product.category} • <span className="font-bold text-[#E85D04]">₹{product.price}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#E85D04] font-semibold">View</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Account, Wishlist, Cart & Get a Quote */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0">
              {/* Account */}
              <button 
                onClick={() => alert('Customer portal: Login or Sign Up to view your personalized orders and saved designs.')}
                className="flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[#E85D04] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="My Account"
              >
                <User className="w-4 h-4 text-[#0F243E]" strokeWidth={2} />
                <span>Account</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={onOpenWishlist}
                className="relative flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[#E85D04] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Saved Wishlist"
              >
                <Heart className="w-4 h-4 text-[#E85D04]" strokeWidth={2} />
                <span>Wishlist</span>
                <span className="bg-[#E85D04] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {wishlistCount > 0 ? wishlistCount : 2}
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-2.5 py-2 text-[#0F243E] hover:text-[#E85D04] hover:bg-stone-100/60 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4 text-[#E85D04]" strokeWidth={2} />
                <span>Cart</span>
                <span className="bg-[#E85D04] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {cartCount > 0 ? cartCount : 1}
                </span>
              </button>

              {/* Get a Quote Button (Dark Navy) */}
              <button
                onClick={onOpenQuote}
                className="bg-[#0F243E] hover:bg-[#1A385C] text-white px-3.5 xl:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs hover:shadow transition-all transform active:scale-95 cursor-pointer ml-1"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Main Header Row (Menu, Logo, Search, Cart) */}
          <div className="relative z-10 flex lg:hidden items-center justify-between gap-2">
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
                onClick={(e) => { e.preventDefault(); handleNavClick('all', 'All Categories'); }}
                className="bg-white border border-stone-200/80 rounded-lg px-2 py-1 shadow-xs flex items-center justify-center shrink-0"
              >
                <img
                  src="/canvas-india-logo.svg"
                  alt="Canvas India"
                  className="w-[110px] h-[42px] object-contain"
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
                <ShoppingCart className="w-5 h-5 text-[#E85D04]" strokeWidth={2} />
                <span className="absolute top-1 right-1 bg-[#E85D04] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {cartCount > 0 ? cartCount : 1}
                </span>
              </button>
              <button
                onClick={onOpenQuote}
                className="bg-[#0F243E] text-white px-2.5 py-1.5 rounded-lg text-xs font-bold"
              >
                Quote
              </button>
            </div>
          </div>

          {/* Mobile Expandable Search Bar */}
          {searchOpen && (
            <div className="relative z-10 lg:hidden mt-1">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, gifts, photos & more..."
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
            </div>
          )}

          {/* ROW 2: CATEGORY NAVIGATION ROW */}
          <nav className="w-full bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 shadow-xs p-1.5 sm:p-2 flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none whitespace-nowrap relative z-10">
            
            {/* All Categories Button (Dark Navy) */}
            <button
              onClick={() => handleNavClick('all', 'All Categories')}
              className={`bg-[#0F243E] hover:bg-[#1A385C] text-white px-3 sm:px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-colors shadow-xs cursor-pointer ${
                activeNav === 'all' ? 'ring-2 ring-orange-400' : ''
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-white" />
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/80" />
            </button>

            {/* The Categories in Exact Order with Orange Outline Icons */}
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeNav === cat.slug;

              // Deals highlighted with orange outline/accent
              if (cat.isDeals) {
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleNavClick(cat.slug, cat.name)}
                    className={`border border-[#E85D04] text-[#E85D04] bg-orange-50/60 hover:bg-orange-100/70 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ml-auto sm:ml-0 ${
                      isActive ? 'ring-2 ring-[#E85D04]/40 bg-orange-100' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#E85D04]" strokeWidth={2} />
                    <span>{cat.name}</span>
                  </button>
                );
              }

              return (
                <button
                  key={cat.slug}
                  onClick={() => handleNavClick(cat.slug, cat.name)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-[#E85D04] bg-orange-50 font-bold' 
                      : 'text-[#0F243E] hover:text-[#E85D04] hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#E85D04]" strokeWidth={1.75} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 bg-[#0F243E] text-white flex items-center justify-between">
              <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                <img src="/canvas-india-logo.svg" alt="Canvas India" className="h-8 w-auto object-contain" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white hover:text-stone-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-stone-100">
              <button
                onClick={() => { onOpenQuote(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-[#0F243E] text-white font-bold rounded-lg text-sm text-center flex items-center justify-center gap-2"
              >
                <span>Get a Bulk Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-2">
                Categories
              </div>
              <button
                onClick={() => handleNavClick('all', 'All Categories')}
                className="w-full text-left py-2 px-2.5 text-sm font-semibold text-[#0F243E] hover:bg-orange-50 hover:text-[#E85D04] rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-[#0F243E]" />
                  <span>All Categories</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
              {navCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleNavClick(cat.slug, cat.name)}
                    className={`w-full text-left py-2 px-2.5 text-sm font-medium rounded-lg flex items-center justify-between transition-colors ${
                      cat.isDeals 
                        ? 'text-[#E85D04] font-bold bg-orange-50/70' 
                        : 'text-[#0F243E] hover:bg-orange-50 hover:text-[#E85D04]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#E85D04]" strokeWidth={1.75} />
                      <span>{cat.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="font-semibold text-stone-900">Canvas India Support</div>
              <div>Bulk Inquiries: +91 98450 12345</div>
              <div>Pan-India delivery within 4-6 business days</div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

