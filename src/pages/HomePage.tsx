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

  const CATEGORY_ROUTES: Record<string, string> = {
    'canvas': '/canvas',
    'canvas-prints': '/canvas',
    'acrylic': '/acrylic',
    'posters': '/posters',
    'cork': '/cork',
    'cork-prints': '/cork',
    'yoga-fitness': '/yoga-fitness',
    'home-decor': '/home-decor',
    'custom-prints': '/custom-prints',
    'gifts': '/gifts',
    'occasions': '/gifts',
    'festivals': '/gifts',
    'bulk-order': '/bulk-order',
    'bulk-orders': '/bulk-order',
    'corporate-orders': '/corporate-orders',
    'corporate': '/corporate-orders',
    'corporate-printing': '/corporate-orders',
  };

  const handleSelectCategory = (slug: string, sub?: string) => {
    const route = CATEGORY_ROUTES[slug];
    if (route) {
      navigate(sub ? `${route}?sub=${encodeURIComponent(sub)}` : route);
      return;
    }
    if (slug === 'deals' || slug === 'sale') {
      const el = document.getElementById('deals-section');
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
