import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { TRENDING_PRODUCTS, DEALS_PRODUCTS, CANVAS_PRODUCTS } from '../data/storeData';

interface ShopContextType {
  cartItems: CartItem[];
  wishlistIds: string[];
  cartDrawerOpen: boolean;
  customizeModalOpen: boolean;
  quoteModalOpen: boolean;
  selectedProductForCustomize: Product | null;
  allProducts: Product[];
  totalCartCount: number;
  
  // Actions
  onAddToCart: (product: Product, size?: string, finish?: string, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, newQty: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenCustomize: (product?: Product) => void;
  onOpenQuote: () => void;
  onOpenCart: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  setCustomizeModalOpen: (open: boolean) => void;
  setQuoteModalOpen: (open: boolean) => void;
  onAddToCartCustomized: (item: {
    product: Product;
    quantity: number;
    size: string;
    finish: string;
    customText: string;
    photoUrl: string;
    calculatedPrice: number;
  }) => void;
  onAddToCartFromWorkbench: (customItem: {
    name: string;
    material: string;
    size: string;
    finish: string;
    text: string;
    price: number;
    image: string;
  }) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Combined product catalog
const ALL_CATALOG_PRODUCTS: Product[] = [
  ...TRENDING_PRODUCTS,
  ...CANVAS_PRODUCTS.filter((cp) => !TRENDING_PRODUCTS.some((tp) => tp.id === cp.id)),
  ...DEALS_PRODUCTS.filter(
    (dp) => !TRENDING_PRODUCTS.some((tp) => tp.id === dp.id) && !CANVAS_PRODUCTS.some((cp) => cp.id === dp.id)
  ),
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [selectedProductForCustomize, setSelectedProductForCustomize] = useState<Product | null>(null);

  // Wishlist persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ci_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['prod-1', 'prod-2'];
  });

  // Cart persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ci_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        product: TRENDING_PRODUCTS[0],
        quantity: 1,
        size: '12x18 inch',
        finish: 'Matte Gallery Wrap',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ci_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ci_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const handleAddToCart = (product: Product, size?: string, finish?: string, quantity: number = 1) => {
    setCartItems((prev) => {
      const selectedSize = size || product.sizes?.[0] || 'Standard';
      const selectedFinish = finish || product.finishes?.[0] || 'Standard';
      
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === selectedSize && item.finish === selectedFinish
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          size: selectedSize,
          finish: selectedFinish,
        },
      ];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
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

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        wishlistIds,
        cartDrawerOpen,
        customizeModalOpen,
        quoteModalOpen,
        selectedProductForCustomize,
        allProducts: ALL_CATALOG_PRODUCTS,
        totalCartCount,
        onAddToCart: handleAddToCart,
        onUpdateCartQuantity: handleUpdateCartQuantity,
        onRemoveCartItem: handleRemoveCartItem,
        onToggleWishlist: handleToggleWishlist,
        onOpenCustomize: handleOpenCustomize,
        onOpenQuote: () => setQuoteModalOpen(true),
        onOpenCart: () => setCartDrawerOpen(true),
        setCartDrawerOpen,
        setCustomizeModalOpen,
        setQuoteModalOpen,
        onAddToCartCustomized: handleAddToCartCustomized,
        onAddToCartFromWorkbench: handleAddToCartFromWorkbench,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
