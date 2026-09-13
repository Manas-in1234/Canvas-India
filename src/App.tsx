import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DesignersArchitectsPage } from './pages/DesignersArchitectsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { SearchPage } from './pages/SearchPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { ShippingDeliveryPage } from './pages/ShippingDeliveryPage';
import { CancellationPolicyPage } from './pages/CancellationPolicyPage';
import { RefundReturnPage } from './pages/RefundReturnPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CanvasCategoryPage } from './pages/CanvasCategoryPage';

export function App() {
  return (
    <ShopProvider>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Canvas — dedicated product listing page (feature/canvas-category-page) */}
          <Route path="/canvas" element={<CanvasCategoryPage />} />
          {/* /canvas-prints is an alias that uses the generic CategoryPage for SEO parity */}
          <Route path="/canvas-prints" element={<CategoryPage categorySlug="canvas" />} />

          {/* Other Primary Category Routes */}
          <Route path="/acrylic" element={<CategoryPage categorySlug="acrylic" />} />
          <Route path="/acrylic-prints" element={<CategoryPage categorySlug="acrylic" />} />

          <Route path="/posters" element={<CategoryPage categorySlug="posters" />} />

          <Route path="/cork" element={<CategoryPage categorySlug="cork" />} />
          <Route path="/cork-prints" element={<CategoryPage categorySlug="cork" />} />

          <Route path="/yoga-fitness" element={<CategoryPage categorySlug="yoga-fitness" />} />
          <Route path="/home-decor" element={<CategoryPage categorySlug="home-decor" />} />
          <Route path="/custom-prints" element={<CategoryPage categorySlug="custom-prints" />} />
          <Route path="/gifts" element={<CategoryPage categorySlug="gifts" />} />

          <Route path="/bulk-order" element={<CategoryPage categorySlug="bulk-order" />} />
          <Route path="/bulk-orders" element={<CategoryPage categorySlug="bulk-order" />} />

          <Route path="/corporate-orders" element={<CategoryPage categorySlug="corporate-orders" />} />
          <Route path="/corporate" element={<CategoryPage categorySlug="corporate-orders" />} />

          {/* Solutions for Designers & Architects */}
          <Route path="/designers-architects" element={<DesignersArchitectsPage />} />

          {/* Dedicated Cart, Wishlist, Search Pages */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Reusable Product Detail Page */}
          <Route path="/products/:productId" element={<ProductDetailPage />} />

          {/* About & Policies */}
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/shipping-policy" element={<ShippingDeliveryPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/refund-policy" element={<RefundReturnPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}

export default App;
