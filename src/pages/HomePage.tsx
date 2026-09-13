import React from 'react';
import { Homepage } from '../components/Homepage';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    allProducts,
    wishlistIds,
    onAddToCart,
    onOpenCustomize,
    onOpenQuote,
    onToggleWishlist,
    onAddToCartFromWorkbench,
  } = useShop();

  const handleSelectCategory = (slug: string) => {
    // Canvas category navigates to the dedicated Canvas page
    if (slug === 'canvas-prints' || slug === 'canvas') {
      navigate('/canvas');
      return;
    }
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

  return (
    <Homepage
      allProducts={allProducts}
      wishlistIds={wishlistIds}
      onAddToCart={onAddToCart}
      onCustomize={onOpenCustomize}
      onOpenQuote={onOpenQuote}
      onToggleWishlist={onToggleWishlist}
      onAddToCartCustom={onAddToCartFromWorkbench}
      onSelectCategory={handleSelectCategory}
    />
  );
};

export default HomePage;
