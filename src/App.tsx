import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OccasionsProvider } from './context/OccasionsContext';
import { ShopProvider } from './context/ShopContext';
import { RootLayout } from './components/RootLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoadingFallback } from './components/RouteLoadingFallback';

// Helper to support both default and named exports transparently with React.lazy
function lazyNamed<P = {}>(
  loader: () => Promise<any>,
  name: string
): React.LazyExoticComponent<React.ComponentType<P>> {
  return React.lazy(() =>
    loader().then((mod) => ({ default: (mod.default || mod[name]) as React.ComponentType<P> }))
  );
}

// Full-Screen / Heavy interactive customizers
const AcrylicCustomizerPage = lazyNamed(() => import('./pages/AcrylicCustomizerPage'), 'AcrylicCustomizerPage');
const CanvasCustomizerPage = lazyNamed(() => import('./pages/CanvasCustomizerPage'), 'CanvasCustomizerPage');
const MobileUploadPage = lazyNamed(() => import('./pages/MobileUploadPage'), 'MobileUploadPage');

// Storefront & Category Pages
const HomePage = lazyNamed(() => import('./pages/HomePage'), 'HomePage');
const CategoryPage = lazyNamed<{ categorySlug?: string }>(() => import('./pages/CategoryPage'), 'CategoryPage');
const AcrylicCategoryPage = lazyNamed(() => import('./pages/AcrylicCategoryPage'), 'AcrylicCategoryPage');
const ProductDetailPage = lazyNamed(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const DesignersArchitectsPage = lazyNamed(() => import('./pages/DesignersArchitectsPage'), 'DesignersArchitectsPage');
const CartPage = lazyNamed(() => import('./pages/CartPage'), 'CartPage');
const WishlistPage = lazyNamed(() => import('./pages/WishlistPage'), 'WishlistPage');
const SearchPage = lazyNamed(() => import('./pages/SearchPage'), 'SearchPage');
const AboutUsPage = lazyNamed(() => import('./pages/AboutUsPage'), 'AboutUsPage');
const PrivacyPolicyPage = lazyNamed(() => import('./pages/PrivacyPolicyPage'), 'PrivacyPolicyPage');
const TermsConditionsPage = lazyNamed(() => import('./pages/TermsConditionsPage'), 'TermsConditionsPage');
const ShippingDeliveryPage = lazyNamed(() => import('./pages/ShippingDeliveryPage'), 'ShippingDeliveryPage');
const CancellationPolicyPage = lazyNamed(() => import('./pages/CancellationPolicyPage'), 'CancellationPolicyPage');
const RefundReturnPage = lazyNamed(() => import('./pages/RefundReturnPage'), 'RefundReturnPage');
const NotFoundPage = lazyNamed(() => import('./pages/NotFoundPage'), 'NotFoundPage');
const CanvasCategoryPage = lazyNamed(() => import('./pages/CanvasCategoryPage'), 'CanvasCategoryPage');
const CanvasStylePage = lazyNamed(() => import('./pages/CanvasStylePage'), 'CanvasStylePage');
const AcrylicStylePage = lazyNamed(() => import('./pages/AcrylicStylePage'), 'AcrylicStylePage');
const CorkCategoryPage = lazyNamed(() => import('./pages/CorkCategoryPage'), 'CorkCategoryPage');
const CanvasStylesPage = lazyNamed(() => import('./pages/CanvasStylesPage'), 'CanvasStylesPage');
const AcrylicStylesPage = lazyNamed(() => import('./pages/AcrylicStylesPage'), 'AcrylicStylesPage');
const CorkProductsPage = lazyNamed(() => import('./pages/CorkProductsPage'), 'CorkProductsPage');
const AllCategoriesPage = lazyNamed(() => import('./pages/AllCategoriesPage'), 'AllCategoriesPage');
const AllOccasionsPage = lazyNamed(() => import('./pages/AllOccasionsPage'), 'AllOccasionsPage');
const FestiveOffersPage = lazyNamed(() => import('./pages/FestiveOffersPage'), 'FestiveOffersPage');
const ReadymadeOffersPage = lazyNamed(() => import('./pages/ReadymadeOffersPage'), 'ReadymadeOffersPage');
const BulkOrdersPage = lazyNamed(() => import('./pages/BulkOrdersPage'), 'BulkOrdersPage');
const BulkProductDetailPage = lazyNamed(() => import('./pages/BulkProductDetailPage'), 'BulkProductDetailPage');
const OccasionPage = lazyNamed(() => import('./pages/OccasionPage'), 'OccasionPage');

// Auth & Checkout Pages
const SignUpPage = lazyNamed(() => import('./pages/SignUpPage'), 'SignUpPage');
const LoginPage = lazyNamed(() => import('./pages/LoginPage'), 'LoginPage');
const ForgotPasswordPage = lazyNamed(() => import('./pages/ForgotPasswordPage'), 'ForgotPasswordPage');
const ResetPasswordPage = lazyNamed(() => import('./pages/ResetPasswordPage'), 'ResetPasswordPage');
const AccountPage = lazyNamed(() => import('./pages/AccountPage'), 'AccountPage');
const OrdersPage = lazyNamed(() => import('./pages/OrdersPage'), 'OrdersPage');
const OrderDetailPage = lazyNamed(() => import('./pages/OrderDetailPage'), 'OrderDetailPage');
const CheckoutPage = lazyNamed(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const OrderSuccessPage = lazyNamed(() => import('./pages/OrderSuccessPage'), 'OrderSuccessPage');

export function App() {
  return (
    <ErrorBoundary>
      <OccasionsProvider>
      <AuthProvider>
        <ShopProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Dedicated Full-Screen Acrylic Customizer */}
            <Route path="/customize/acrylic/:productId" element={<AcrylicCustomizerPage />} />
            {/* Dedicated Full-Screen Canvas Customizer */}
            <Route path="/customize/canvas/:productId" element={<CanvasCustomizerPage />} />
            {/* Dedicated Mobile QR Upload Page */}
            <Route path="/mobile-upload/:sessionId" element={<MobileUploadPage />} />

            <Route element={<RootLayout />}>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Authentication & Account Routes */}
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />

              {/* Checkout & Order Success */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

              {/* Canvas — dedicated product listing page */}
              <Route path="/categories" element={<AllCategoriesPage />} />
              <Route path="/occasions" element={<AllOccasionsPage />} />
              <Route path="/canvas" element={<CanvasCategoryPage />} />
              <Route path="/canvas-prints" element={<CategoryPage categorySlug="canvas" />} />
              <Route path="/canvas-styles" element={<CanvasStylesPage />} />
              <Route path="/canvas/:styleSlug" element={<CanvasStylePage />} />
              
              {/* Acrylic — dedicated category page */}
              <Route path="/acrylic" element={<AcrylicCategoryPage />} />
              <Route path="/acrylic-prints" element={<AcrylicCategoryPage />} />
              <Route path="/acrylic-styles" element={<AcrylicStylesPage />} />
              <Route path="/acrylic/:styleSlug" element={<AcrylicStylePage />} />
              <Route path="/posters" element={<CategoryPage categorySlug="posters" />} />

              <Route path="/cork" element={<CorkCategoryPage />} />
              <Route path="/cork-prints" element={<CorkCategoryPage />} />
              <Route path="/cork-products" element={<CorkProductsPage />} />

              <Route path="/yoga-fitness" element={<CategoryPage categorySlug="yoga-fitness" />} />
              <Route path="/home-decor" element={<CategoryPage categorySlug="home-decor" />} />
              <Route path="/custom-prints" element={<CategoryPage categorySlug="custom-prints" />} />
              <Route path="/gifts" element={<Navigate to="/occasions" replace />} />

              {/* Festive Offers landing page */}
              <Route path="/festive-offers" element={<FestiveOffersPage />} />
              <Route path="/offers" element={<ReadymadeOffersPage />} />
              <Route path="/occasions/:slug" element={<OccasionPage />} />

              <Route path="/bulk-order" element={<BulkOrdersPage />} />
              <Route path="/bulk-orders" element={<BulkOrdersPage />} />
              <Route path="/bulk-order/:material/:slug" element={<BulkProductDetailPage />} />

              <Route path="/corporate-orders" element={<Navigate to="/bulk-order" replace />} />
              <Route path="/corporate" element={<Navigate to="/bulk-order" replace />} />

              <Route path="/wall-art" element={<CategoryPage categorySlug="wall-art" />} />
              <Route path="/photo-frames" element={<CategoryPage categorySlug="photo-frames" />} />

              {/* Print-design categories */}
              <Route path="/devotional-art" element={<CategoryPage categorySlug="devotional-art" />} />
              <Route path="/scenery-landscape-art" element={<CategoryPage categorySlug="scenery-landscape-art" />} />
              <Route path="/tribal-ethnic-art" element={<CategoryPage categorySlug="tribal-ethnic-art" />} />
              <Route path="/line-art" element={<CategoryPage categorySlug="line-art" />} />
              <Route path="/motivational-posters" element={<CategoryPage categorySlug="motivational-posters" />} />
              <Route path="/cork-art-patterns" element={<CorkCategoryPage />} />

              {/* Solutions for Designers & Architects */}
              <Route path="/designers-architects" element={<DesignersArchitectsPage />} />

              {/* Dedicated Cart, Wishlist, Search Pages */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Reusable Product Detail Page */}
              <Route path="/products/:productId" element={<ProductDetailPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />

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
        </Suspense>
        </ShopProvider>
      </AuthProvider>
      </OccasionsProvider>
    </ErrorBoundary>
  );
}

export default App;
