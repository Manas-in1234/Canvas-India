import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { WishlistDrawer } from './WishlistDrawer';
import { CustomizeModal } from './CustomizeModal';
import { QuoteModal } from './QuoteModal';
import { AccountModal } from './AccountModal';
import { AccentColorPicker } from './AccentColorPicker';
import { useShop } from '../context/ShopContext';
import { Home, Layers, Sparkles, Heart, ShoppingBag } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    cartItems,
    wishlistIds,
    cartDrawerOpen,
    wishlistDrawerOpen,
    customizeModalOpen,
    quoteModalOpen,
    accountModalOpen,
    selectedProductForCustomize,
    allProducts,
    totalCartCount,
    setCartDrawerOpen,
    setWishlistDrawerOpen,
    setCustomizeModalOpen,
    setQuoteModalOpen,
    setAccountModalOpen,
    onAddToCart,
    onToggleWishlist,
    onUpdateCartQuantity,
    onRemoveCartItem,
    onAddToCartCustomized,
    onOpenCustomize,
  } = useShop();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const handleSelectCategory = (slug: string) => {
    // Canvas category navigates to the dedicated Canvas product listing page
    // This takes explicit precedence before the generic categoryRoutes map
    if (slug === 'canvas-prints' || slug === 'canvas') {
      navigate('/canvas');
      return;
    }

    // Generic category page routes (from origin/main)
    const categoryRoutes = [
      'acrylic', 'posters', 'cork', 'yoga-fitness',
      'home-decor', 'custom-prints', 'gifts', 'bulk-order', 'corporate-orders', 'designers-architects'
    ];
    if (categoryRoutes.includes(slug)) {
      navigate(`/${slug}`);
      return;
    }

    // Slug aliases → canonical routes
    if (slug === 'acrylic-prints') {
      navigate('/acrylic');
      return;
    }
    if (slug === 'cork-prints') {
      navigate('/cork');
      return;
    }
    if (slug === 'corporate') {
      navigate('/corporate-orders');
      return;
    }
    if (slug === 'bulk-orders') {
      navigate('/bulk-order');
      return;
    }

    // Remaining slugs: scroll to the relevant homepage section
    if (pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToCategory(slug);
      }, 100);
    } else {
      scrollToCategory(slug);
    }
  };

  const scrollToCategory = (slug: string) => {
    if (slug === 'corporate' || slug === 'corporate-printing' || slug === 'bulk-order' || slug === 'corporate-orders' || slug === 'bulk-orders') {
      const el = document.getElementById('corporate-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (slug === 'deals' || slug === 'sale') {
      const el = document.getElementById('deals-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (slug === 'custom-prints') {
      const el = document.getElementById('create-something-new');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (slug === 'gifts' || slug === 'occasions' || slug === 'festivals') {
      const el = document.getElementById('shop-occasions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('shop-categories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-stone-900 flex flex-col font-manrope selection:bg-[var(--accent-bg)] selection:text-[var(--accent)] pb-14 sm:pb-0">

      {/* Royal Blue Header + White Category Nav */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setWishlistDrawerOpen(true)}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onSelectCategory={handleSelectCategory}
        onSearch={handleSearch}
        allProducts={allProducts}
        onOpenCustomize={onOpenCustomize}
        onOpenAccount={() => setAccountModalOpen(true)}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Indian E-Commerce Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onOpenAccount={() => setAccountModalOpen(true)}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav aria-label="Mobile Navigation" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          type="button"
          onClick={() => {
            if (pathname !== '/') navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#0E4A93] text-[10px] font-semibold py-1 px-2 cursor-pointer"
        >
          <Home className="w-5 h-5 text-stone-700" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#0E4A93] text-[10px] font-semibold py-1 px-2 cursor-pointer"
        >
          <Layers className="w-5 h-5 text-stone-700" />
          <span>Categories</span>
        </button>

        {/* Center Customizer Highlight Button */}
        <button
          type="button"
          onClick={() => onOpenCustomize()}
          className="flex flex-col items-center -mt-4 text-[10px] font-bold text-stone-900 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-[#E8752A] text-white flex items-center justify-center shadow-md shadow-[#E8752A]/30 border-2 border-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="mt-0.5 text-[10px] font-extrabold text-[#E8752A]">Customize</span>
        </button>

        <button
          type="button"
          onClick={() => setWishlistDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#0E4A93] text-[10px] font-semibold py-1 px-2 relative cursor-pointer"
        >
          <Heart className="w-5 h-5 text-stone-700" />
          <span>Wishlist</span>
          {wishlistIds.length > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#E8752A] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {wishlistIds.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 text-stone-600 hover:text-[#0E4A93] text-[10px] font-semibold py-1 px-2 relative cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-stone-700" />
          <span>Cart</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#E8752A] text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveCartItem}
        onCheckout={() => {
          navigate('/cart');
          setCartDrawerOpen(false);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlistIds={wishlistIds}
        allProducts={allProducts}
        onToggleWishlist={onToggleWishlist}
        onAddToCart={(product) => onAddToCart(product)}
      />

      {/* Account / Track Shipment Portal Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      {/* Customize Product Modal */}
      <CustomizeModal
        isOpen={customizeModalOpen}
        onClose={() => setCustomizeModalOpen(false)}
        product={selectedProductForCustomize}
        onAddToCartCustomized={onAddToCartCustomized}
      />

      {/* Corporate & Bulk Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* Live Accent Color Picker (client demo tool) */}
      <AccentColorPicker />
    </div>
  );
};
