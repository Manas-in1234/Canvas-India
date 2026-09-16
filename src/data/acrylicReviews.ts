import { Product } from '../types';

export interface AcrylicProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export const DEFAULT_ACRYLIC_REVIEWS: Record<string, AcrylicProductReview[]> = {
  'acr-block': [
    {
      id: 'rev-block-1',
      productId: 'acr-block',
      author: 'Pooja Sharma',
      rating: 5,
      comment: 'Super crystal clear and sits perfectly on my desk! The diamond cut beveled edges look so premium.',
      date: '2 days ago',
      verified: true
    },
    {
      id: 'rev-block-2',
      productId: 'acr-block',
      author: 'Rahul Verma',
      rating: 5,
      comment: 'Excellent print quality, colors are rich and vibrant. Best photo gift I bought this year.',
      date: '1 week ago',
      verified: true
    }
  ],
  'acr-panel': [
    {
      id: 'rev-panel-1',
      productId: 'acr-panel',
      author: 'Ananya Deshmukh',
      rating: 5,
      comment: 'The floating metallic standoffs make this look like an art gallery piece. Highly recommended!',
      date: '3 days ago',
      verified: true
    },
    {
      id: 'rev-panel-2',
      productId: 'acr-panel',
      author: 'Karthik Raja',
      rating: 4,
      comment: 'Very sharp printing and came with solid mounting hardware. Easy to install.',
      date: '2 weeks ago',
      verified: true
    }
  ],
  'acr-abstract': [
    {
      id: 'rev-abs-1',
      productId: 'acr-abstract',
      author: 'Sunil Mehta',
      rating: 5,
      comment: 'The depth of the glossy acrylic brings out the marble swirls beautifully. Centerpiece of our hall.',
      date: '5 days ago',
      verified: true
    }
  ],
  'acr-family': [
    {
      id: 'rev-fam-1',
      productId: 'acr-family',
      author: 'Deepika Iyer',
      rating: 5,
      comment: 'Our family portrait looks stunning behind this glass finish. Great packaging and safely delivered.',
      date: '4 days ago',
      verified: true
    }
  ],
  'acr-corporate': [
    {
      id: 'rev-corp-1',
      productId: 'acr-corporate',
      author: 'Vikram Sethi',
      rating: 5,
      comment: 'Ordered 12 panels for our tech park office corridor. Impeccable finish and quick GST invoicing.',
      date: '1 week ago',
      verified: true
    }
  ],
  'acr-reception': [
    {
      id: 'rev-rec-1',
      productId: 'acr-reception',
      author: 'Neha Singhal',
      rating: 5,
      comment: 'Large format looks regal in our reception entrance. Creates a great impression on guests.',
      date: '6 days ago',
      verified: true
    }
  ],
  'acr-inspirational': [
    {
      id: 'rev-insp-1',
      productId: 'acr-inspirational',
      author: 'Aakash Nair',
      rating: 5,
      comment: 'Clean typographic layout and optical acrylic clarity. Inspires my team daily.',
      date: '3 days ago',
      verified: true
    }
  ],
  'acr-decorative': [
    {
      id: 'rev-dec-1',
      productId: 'acr-decorative',
      author: 'Rohan Gupta',
      rating: 5,
      comment: 'Geometric modern lines with mirror polished finish. Adds a luxurious vibe to our dining area.',
      date: '5 days ago',
      verified: true
    }
  ],
  'acr-gift': [
    {
      id: 'rev-gift-1',
      productId: 'acr-gift',
      author: 'Meera Chawla',
      rating: 5,
      comment: 'Gifted to my sister on her wedding anniversary. She absolutely loved the crystal glass look!',
      date: '1 week ago',
      verified: true
    }
  ],
  'acr-poster': [
    {
      id: 'rev-pos-1',
      productId: 'acr-poster',
      author: 'Tanmay Bhatt',
      rating: 4,
      comment: 'Glossy poster look without the paper curling. Vibrant contrast and easy cleaning.',
      date: '4 days ago',
      verified: true
    }
  ],
  'acr-signage': [
    {
      id: 'rev-sig-1',
      productId: 'acr-signage',
      author: 'Sanjay Reddy',
      rating: 5,
      comment: 'Our dental clinic signage looks clean and ultra professional. Fast shipping to Bangalore.',
      date: '2 weeks ago',
      verified: true
    }
  ],
  'acr-custom': [
    {
      id: 'rev-cust-1',
      productId: 'acr-custom',
      author: 'Nikhil Saxena',
      rating: 5,
      comment: 'Custom panoramic size came out exact to millimeter specifications. Outstanding craftmanship.',
      date: '3 days ago',
      verified: true
    }
  ]
};

const STORAGE_KEY = 'ci_product_reviews';

/**
 * Loads all reviews from localStorage, merged with DEFAULT_ACRYLIC_REVIEWS
 */
export const loadAllStoredReviews = (): Record<string, AcrylicProductReview[]> => {
  if (typeof window === 'undefined') return DEFAULT_ACRYLIC_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACRYLIC_REVIEWS;
    const parsed: Record<string, AcrylicProductReview[]> = JSON.parse(raw);
    const merged: Record<string, AcrylicProductReview[]> = { ...DEFAULT_ACRYLIC_REVIEWS };
    for (const key of Object.keys(parsed)) {
      merged[key] = parsed[key];
    }
    return merged;
  } catch {
    return DEFAULT_ACRYLIC_REVIEWS;
  }
};

/**
 * Returns product-specific reviews for given productId (or slug)
 */
export const getProductReviews = (productId: string): AcrylicProductReview[] => {
  const all = loadAllStoredReviews();
  return all[productId] || [];
};

/**
 * Saves a review for a specific product ID into localStorage
 */
export const saveProductReview = (
  productId: string,
  newReview: { author: string; rating: number; comment: string }
): AcrylicProductReview => {
  const all = loadAllStoredReviews();
  const existing = all[productId] || [];
  
  const created: AcrylicProductReview = {
    id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    productId,
    author: newReview.author.trim(),
    rating: Math.max(1, Math.min(5, newReview.rating)),
    comment: newReview.comment.trim(),
    date: 'Just now',
    verified: true
  };

  const updatedList = [created, ...existing];
  all[productId] = updatedList;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // Storage quota or disabled fallback
    }
  }

  return created;
};

/**
 * Returns related Acrylic products excluding current product
 */
export const getRelatedAcrylicProducts = (currentProductId: string, products: Product[], limit = 4): Product[] => {
  // Only acrylic products
  const acrylicOnly = products.filter(p => p.categorySlug === 'acrylic' || p.category?.toLowerCase().includes('acrylic'));
  
  const current = acrylicOnly.find(p => p.id === currentProductId || p.slug === currentProductId);
  
  if (!current) {
    return acrylicOnly.filter(p => p.id !== currentProductId && p.slug !== currentProductId).slice(0, limit);
  }

  // 1. Same subcategory (excluding current product)
  const sameSub = acrylicOnly.filter(
    p => p.id !== current.id && p.slug !== current.slug && p.subcategory === current.subcategory
  );

  // 2. Matching tags (excluding current and already added)
  const matchingTags = acrylicOnly.filter(
    p => p.id !== current.id && p.slug !== current.slug && p.subcategory !== current.subcategory &&
         p.tags?.some(t => current.tags?.includes(t))
  );

  // 3. Other acrylic products
  const others = acrylicOnly.filter(
    p => p.id !== current.id && p.slug !== current.slug && !sameSub.includes(p) && !matchingTags.includes(p)
  );

  return [...sameSub, ...matchingTags, ...others].slice(0, limit);
};
