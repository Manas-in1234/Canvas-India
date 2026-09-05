import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StartOrder } from './components/StartOrder';
import { PromoStrip } from './components/PromoStrip';
import { CategoryGrid } from './components/CategoryGrid';
import { TrendingProducts } from './components/TrendingProducts';
import { OccasionSection } from './components/OccasionSection';
import { DealsSection } from './components/DealsSection';
import { HowItWorks } from './components/HowItWorks';
import { CustomizerSection } from './components/CustomizerSection';
import { CorporateSection } from './components/CorporateSection';
import { TrustSection } from './components/TrustSection';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

// Modals and Drawers
import { CartDrawer } from './components/CartDrawer';
import { CustomizeModal } from './components/CustomizeModal';
import { QuoteModal } from './components/QuoteModal';
import { AccentColorPicker } from './components/AccentColorPicker';

// Data and Types
import { TRENDING_PRODUCTS } from './data/storeData';
import { Product, CartItem } from './types';

export function App() {
  // State management
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [selectedProductForCustomize, setSelectedProductForCustomize] = useState<Product | null>(null);

  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'trending-1', // Custom Canvas Print
    'trending-2', // Glossy Acrylic Photo
  ]);

  // Initial cart with a popular custom canvas print
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: TRENDING_PRODUCTS[0],
      quantity: 1,
      size: '12x18 inch',
      finish: 'Matte Gallery Wrap',
    },
  ]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          size: product.sizes?.[0] || '12x18 inch',
          finish: product.finishes?.[0] || 'Standard Finish',
        },
      ];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleOpenCustomize = (product?: Product) => {
    setSelectedProductForCustomize(product || TRENDING_PRODUCTS[0]);
    setCustomizeModalOpen(true);
  };

  const handleAddToCartCustomized = (item: {
    product: Product;
    quantity: number;
    size: string;
    finish: string;
    customText: string;
    photoUrl: string;
    calculatedPrice: number;
  }) => {
    setCartItems((prev) => [
      ...prev,
      {
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        finish: item.finish,
        customText: item.customText,
        photoUrl: item.photoUrl,
      },
    ]);
    setCartDrawerOpen(true);
  };

  const handleAddToCartFromWorkbench = (customItem: {
    name: string;
    material: string;
    size: string;
    finish: string;
    text: string;
    price: number;
    image: string;
  }) => {
    const virtualProduct: Product = {
      id: `custom-${Date.now()}`,
      name: customItem.name,
      category: customItem.material.toUpperCase(),
      categorySlug: customItem.material,
      price: customItem.price,
      originalPrice: Math.round(customItem.price * 1.3),
      discountPercent: 25,
      rating: 5.0,
      reviewsCount: 1,
      image: customItem.image,
      sizes: [customItem.size],
      finishes: [customItem.finish],
      badge: 'Custom',
      description: 'Custom personalized print with customized dimensions, finish and text.',
    };

    setCartItems((prev) => [
      ...prev,
      {
        product: virtualProduct,
        quantity: 1,
        size: customItem.size,
        finish: customItem.finish,
        customText: customItem.text,
        photoUrl: customItem.image,
      },
    ]);
    setCartDrawerOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (slug: string) => {
    if (slug === 'corporate' || slug === 'corporate-printing' || slug === 'bulk-order' || slug === 'corporate-orders') {
      scrollToSection('corporate-section');
    } else if (slug === 'deals' || slug === 'sale') {
      scrollToSection('deals-section');
    } else if (slug === 'custom-prints') {
      scrollToSection('customizer-section');
    } else if (slug === 'gifts' || slug === 'occasions' || slug === 'festivals') {
      scrollToSection('shop-occasions');
    } else {
      scrollToSection('trending-products');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-stone-900 flex flex-col font-sans selection:bg-[var(--accent-bg)] selection:text-[var(--accent)]">
      {/* 3-Layer E-commerce Header */}
      <Header
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenWishlist={() => setCartDrawerOpen(true)}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onSelectCategory={handleSelectCategory}
        onSearch={(query) => scrollToSection('trending-products')}
        allProducts={TRENDING_PRODUCTS}
        onOpenCustomize={handleOpenCustomize}
      />

      {/* Main Homepage Flow (Sections 6 through 21) */}
      <main className="flex-1">
        {/* Section 6: Hero */}
        <Hero
          onStartCreating={() => scrollToSection('customizer-section')}
          onExploreProducts={() => scrollToSection('shop-categories')}
          onSelectCategory={handleSelectCategory}
        />

        {/* Customize Your Products */}
        <CustomizerSection
          onStartCreating={() => handleOpenCustomize()}
          onAddToCartCustom={handleAddToCartFromWorkbench}
        />

        {/* Start Your Order */}
        <StartOrder
          onSelectCategory={handleSelectCategory}
          onOpenCustomizer={() => handleOpenCustomize()}
        />

        {/* Section 8: Promotional Offer Strip */}
        <PromoStrip
          onShopDeals={() => scrollToSection('deals-section')}
          onOpenCustomizer={() => handleOpenCustomize()}
        />

        {/* Section 9: Shop by Category */}
        <CategoryGrid onSelectCategory={handleSelectCategory} />

        {/* Section 10: Trending Products Grid */}
        <TrendingProducts
          products={TRENDING_PRODUCTS}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onCustomize={handleOpenCustomize}
        />

        {/* Section 12: Shop by Occasion */}
        <OccasionSection onSelectOccasion={handleSelectCategory} />

        {/* Section 14: Deals & Budget Picks */}
        <DealsSection
          onAddToCart={handleAddToCart}
          onCustomize={handleOpenCustomize}
        />

        {/* Section 15: How It Works */}
        <HowItWorks />

        {/* Section 17: Corporate & Bulk Orders */}
        <CorporateSection onOpenQuote={() => setQuoteModalOpen(true)} />

        {/* Section 18: Why Canvas India */}
        <TrustSection />

        {/* Section 20: Customer Reviews */}
        <Testimonials />

        {/* Section 21: Final CTA */}
        <FinalCTA
          onStartCreating={() => scrollToSection('customizer-section')}
          onExploreProducts={() => scrollToSection('shop-categories')}
        />
      </main>

      {/* Section 22: Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenQuote={() => setQuoteModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          alert('Thank you for shopping with Canvas India! Checkout gateway initiated.');
          setCartDrawerOpen(false);
        }}
      />

      {/* Customize Product Modal */}
      <CustomizeModal
        isOpen={customizeModalOpen}
        onClose={() => setCustomizeModalOpen(false)}
        product={selectedProductForCustomize}
        onAddToCartCustomized={handleAddToCartCustomized}
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
}

export default App;
