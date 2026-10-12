import { Product } from '../types';

export interface CorkProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export const DEFAULT_CORK_REVIEWS: Record<string, CorkProductReview[]> = {
  'cork-9c-ya1': [
    {
      id: 'rev-ya1-1',
      productId: 'cork-9c-ya1',
      author: 'Ananya Sharma',
      rating: 5,
      comment: 'Super lightweight and the grip improves as you sweat! The natural cork feel is so much better than synthetic rubber.',
      date: '3 days ago',
      verified: true
    },
    {
      id: 'rev-ya1-2',
      productId: 'cork-9c-ya1',
      author: 'Rohan Deshmukh',
      rating: 5,
      comment: 'The EVA foam cushioning gives excellent joint support. Completely odor-free even after intense hot yoga sessions.',
      date: '1 week ago',
      verified: true
    }
  ],
  'cork-9c-ya2': [
    {
      id: 'rev-ya2-1',
      productId: 'cork-9c-ya2',
      author: 'Sneha Patel',
      rating: 5,
      comment: 'Extra cushioning with latex backing feels amazing on the knees. 100% eco-friendly and sustainably made.',
      date: '4 days ago',
      verified: true
    }
  ],
  'cork-9c-ya3': [
    {
      id: 'rev-ya3-1',
      productId: 'cork-9c-ya3',
      author: 'Vikram Joshi',
      rating: 5,
      comment: 'Fully rubberized base stays firmly planted on hardwood floors. The reversible feature is very convenient.',
      date: '2 weeks ago',
      verified: true
    }
  ],
  'cork-9c-ya5': [
    {
      id: 'rev-ya5-1',
      productId: 'cork-9c-ya5',
      author: 'Priya Nambiar',
      rating: 5,
      comment: 'Far firmer and more stable than foam yoga bricks. Essential for balance poses and restorative yoga routines.',
      date: '5 days ago',
      verified: true
    }
  ],
  'cork-9c-ya6': [
    {
      id: 'rev-ya6-1',
      productId: 'cork-9c-ya6',
      author: 'Aditya Rao',
      rating: 5,
      comment: 'Solid cork density gives deep tissue myofascial release without flexing or deforming like plastic rollers.',
      date: '1 week ago',
      verified: true
    }
  ],
  'cork-9c-ya7': [
    {
      id: 'rev-ya7-1',
      productId: 'cork-9c-ya7',
      author: 'Meera Iyer',
      rating: 5,
      comment: 'Perfect size for pinpoint trigger release in shoulders and arches. Firm, non-toxic, and durable.',
      date: '6 days ago',
      verified: true
    }
  ],
  'cork-9c-ya11': [
    {
      id: 'rev-ya11-1',
      productId: 'cork-9c-ya11',
      author: 'Gaurav Kulkarni',
      rating: 5,
      comment: 'Saved my knees during low lunges! Great anti-skid grip and rolls up nicely with my mat.',
      date: '3 days ago',
      verified: true
    }
  ],
  'cork-9c-ya12': [
    {
      id: 'rev-ya12-1',
      productId: 'cork-9c-ya12',
      author: 'Divya Nair',
      rating: 5,
      comment: 'The peanut shape cradles the spine perfectly for mid-back and neck relief. High-density Portuguese cork quality.',
      date: '4 days ago',
      verified: true
    }
  ]
};

const STORAGE_KEY = 'canvas_india_cork_reviews';

function loadAllStoredReviews(): Record<string, CorkProductReview[]> {
  if (typeof window === 'undefined') return { ...DEFAULT_CORK_REVIEWS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CORK_REVIEWS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CORK_REVIEWS, ...parsed };
  } catch {
    return { ...DEFAULT_CORK_REVIEWS };
  }
}

export const getCorkProductReviews = (productId: string): CorkProductReview[] => {
  const all = loadAllStoredReviews();
  if (all[productId]) {
    return all[productId];
  }
  return [
    {
      id: `rev-gen-${productId}-1`,
      productId,
      author: 'Verified Yogi',
      rating: 5,
      comment: 'Premium natural cork texture and superior craftsmanship. Highly recommended eco-friendly product!',
      date: '1 week ago',
      verified: true
    }
  ];
};

export const saveCorkProductReview = (
  productId: string,
  newReview: { author: string; rating: number; comment: string }
): CorkProductReview => {
  const all = loadAllStoredReviews();
  const existing = all[productId] || [];

  const created: CorkProductReview = {
    id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    productId,
    author: newReview.author.trim() || 'Anonymous',
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
      // quota fallback
    }
  }

  return created;
};

export const getRelatedCorkProducts = (
  currentProductId: string,
  products: Product[],
  limit = 4
): Product[] => {
  const corkOnly = products.filter(
    (p) => p.categorySlug === 'cork' || p.categorySlug === 'cork-art-patterns' || p.category?.toLowerCase().includes('cork')
  );

  const current = corkOnly.find((p) => p.id === currentProductId || p.slug === currentProductId);

  if (!current) {
    return corkOnly.filter((p) => p.id !== currentProductId && p.slug !== currentProductId).slice(0, limit);
  }

  // 1. Same subcategory
  const sameSub = corkOnly.filter(
    (p) => p.id !== current.id && p.slug !== current.slug && p.subcategory === current.subcategory
  );

  // 2. Matching tags
  const matchingTags = corkOnly.filter(
    (p) =>
      p.id !== current.id &&
      p.slug !== current.slug &&
      p.subcategory !== current.subcategory &&
      p.tags?.some((t) => current.tags?.includes(t))
  );

  // 3. Others
  const others = corkOnly.filter(
    (p) => p.id !== current.id && p.slug !== current.slug && !sameSub.includes(p) && !matchingTags.includes(p)
  );

  return [...sameSub, ...matchingTags, ...others].slice(0, limit);
};
