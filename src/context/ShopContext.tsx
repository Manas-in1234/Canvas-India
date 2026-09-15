import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { ALL_PRODUCTS } from '../data/productsData';

interface ShopContextType {
  cartItems: CartItem[];
  wishlistIds: string[];
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  customizeModalOpen: boolean;
  quoteModalOpen: boolean;
  accountModalOpen: boolean;
  selectedProductForCustomize: Product | null;
  allProducts: Product[];
  totalCartCount: number;

  // Actions
  onAddToCart: (
    product: Product,
    size?: string,
    finish?: string,
    quantity?: number,
    customText?: string,
    photoUrl?: string,
    material?: string,
    thickness?: string,
    style?: string,
    base?: string,
    paper?: string,
    customizationDetails?: any
  ) => void;
  onUpdateCartQuantity: (itemId: string, newQty: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenCustomize: (product?: Product) => void;
  onOpenQuote: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  setCartDrawerOpen: (open: boolean) => void;
  setWishlistDrawerOpen: (open: boolean) => void;
  setCustomizeModalOpen: (open: boolean) => void;
  setQuoteModalOpen: (open: boolean) => void;
  setAccountModalOpen: (open: boolean) => void;
  onAddToCartCustomized: (item: {
    product: Product;
    quantity: number;
    size: string;
    finish?: string;
    customText?: string;
    photoUrl?: string;
    calculatedPrice: number;
    material?: string;
    thickness?: string;
    style?: string;
    base?: string;
    paper?: string;
    customizationDetails?: any;
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

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedProductForCustomize, setSelectedProductForCustomize] = useState<Product | null>(null);

  // Wishlist persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ci_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['cnv-1', 'acr-1'];
  });

  // Cart persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ci_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        // Ensure every item has an id
        return parsed.map((item) => ({
          ...item,
          id: item.id || `${item.product.id}-${item.size || 'std'}-${item.finish || 'std'}`
        }));
      }
    } catch {
      // fallback
    }
    const firstProd = ALL_PRODUCTS[0] || {
      id: 'cnv-1',
      name: 'Classic Family Photo Canvas',
      category: 'Canvas',
      categorySlug: 'canvas',
      price: 1499,
      originalPrice: 1999,
      discountPercent: 25,
      rating: null,
      badge: 'New',
      image: '/products/placeholders/canvas-placeholder.svg',
      description: 'Stretched 380 GSM matte cotton canvas on solid pine frame.',
      sizes: ['12x18 inch'],
      finishes: ['Matte Gallery Wrap']
    };
    return [
      {
        id: `${firstProd.id}-12x18-matte`,
        product: firstProd,
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

  const handleAddToCart = (
    product: Product,
    size?: string,
    finish?: string,
    quantity: number = 1,
    customText?: string,
    photoUrl?: string,
    material?: string,
    thickness?: string,
    style?: string,
    base?: string,
    paper?: string,
    customizationDetails?: any
  ) => {
    setCartItems((prev) => {
      const selectedSize = size || product.sizes?.[0] || 'Standard Size';
      const selectedFinish = finish || product.finishes?.[0] || 'Standard Finish';
      const itemKey = `${product.id}-${selectedSize}-${selectedFinish}-${thickness || ''}-${style || ''}-${base || ''}-${paper || ''}-${customText || ''}-${Date.now()}`;

      const existingIndex = prev.findIndex(
        (item) => (item.id === itemKey) || (
          item.product.id === product.id &&
          item.size === selectedSize &&
          item.finish === selectedFinish &&
          item.thickness === thickness &&
          item.style === style &&
          item.base === base &&
          item.paper === paper &&
          item.customText === customText
        )
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
          id: itemKey,
          product,
          quantity,
          size: selectedSize,
          finish: selectedFinish,
          material: material || (product as any).material,
          thickness,
          style,
          base,
          paper,
          customText,
          photoUrl: photoUrl || product.image,
          customizationDetails,
        },
      ];
    });
    setCartDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (
        item.id === itemId || item.product.id === itemId
          ? { ...item, quantity: newQty }
          : item
      ))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId && item.product.id !== itemId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleOpenCustomize = (product?: Product) => {
    setSelectedProductForCustomize(product || ALL_PRODUCTS[0]);
    setCustomizeModalOpen(true);
  };

  const handleAddToCartCustomized = (item: {
    product: Product;
    quantity: number;
    size: string;
    finish?: string;
    customText?: string;
    photoUrl?: string;
    calculatedPrice: number;
    material?: string;
    thickness?: string;
    style?: string;
    base?: string;
    paper?: string;
    customizationDetails?: any;
  }) => {
    const itemKey = `custom-${item.product.id}-${item.size}-${item.thickness || ''}-${item.base || ''}-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        id: itemKey,
        product: {
          ...item.product,
          price: item.calculatedPrice || item.product.price,
        },
        quantity: item.quantity,
        size: item.size,
        finish: item.finish || 'Standard Finish',
        material: item.material || item.product.material,
        thickness: item.thickness,
        style: item.style,
        base: item.base,
        paper: item.paper,
        customText: item.customText,
        photoUrl: item.photoUrl || item.product.image,
        customizationDetails: item.customizationDetails,
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
      categorySlug: customItem.material.toLowerCase().replace(/\s+/g, '-'),
      price: customItem.price,
      originalPrice: Math.round(customItem.price * 1.3),
      discountPercent: 25,
      rating: null,
      reviewsCount: 0,
      image: customItem.image,
      sizes: [customItem.size],
      finishes: [customItem.finish],
      badge: 'Custom',
      description: 'Custom personalized print with customized dimensions, finish and text.',
    };

    const itemKey = `bench-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        id: itemKey,
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
        wishlistDrawerOpen,
        customizeModalOpen,
        quoteModalOpen,
        accountModalOpen,
        selectedProductForCustomize,
        allProducts: ALL_PRODUCTS,
        totalCartCount,
        onAddToCart: handleAddToCart,
        onUpdateCartQuantity: handleUpdateCartQuantity,
        onRemoveCartItem: handleRemoveCartItem,
        onToggleWishlist: handleToggleWishlist,
        onOpenCustomize: handleOpenCustomize,
        onOpenQuote: () => setQuoteModalOpen(true),
        onOpenCart: () => setCartDrawerOpen(true),
        onOpenWishlist: () => setWishlistDrawerOpen(true),
        onOpenAccount: () => setAccountModalOpen(true),
        setCartDrawerOpen,
        setWishlistDrawerOpen,
        setCustomizeModalOpen,
        setQuoteModalOpen,
        setAccountModalOpen,
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

export default ShopProvider;
