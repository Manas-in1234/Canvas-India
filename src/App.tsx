import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { RootLayout } from './components/RootLayout';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
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
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/canvas" element={<CanvasCategoryPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/shipping-policy" element={<ShippingDeliveryPage />} />
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/refund-policy" element={<RefundReturnPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}

export default App;
