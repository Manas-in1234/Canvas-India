export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  image: string;
  images?: string[];
  rating: number | null;
  reviewsCount?: number;
  reviewCount?: number;
  price: number;
  originalPrice: number;
  compareAtPrice?: number;
  discountPercent: number;
  badge?: 'Best Seller' | 'Sale' | 'Trending' | 'Popular' | 'Hot' | 'New' | 'Custom';
  description: string;
  shortDescription?: string;
  material?: string;
  tags?: string[];
  sizes: string[];
  availableSizes?: string[];
  finishes: string[];
  customizationAvailable?: boolean;
  uploadRequired?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  stockStatus?: 'In Stock' | 'Made to Order' | 'Out of Stock';
  status?: string;
  relatedProductIds?: string[];
  relatedProducts?: string[];
  applications?: string[];
  isDemoData?: boolean;
}

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CategoryConfig {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  seoTitle: string;
  description: string;
  heroImage?: string;
  subcategories: string[];
  features?: string[];
  ctaText?: string;
  ctaType?: 'quote' | 'customize' | 'shop';
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  startingPrice: number;
  popularItem: string;
}

export interface OccasionItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  offerText: string;
  tagline: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  startingPrice: number;
  highlight: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  product: string;
  review: string;
  verified: boolean;
  date: string;
}

export interface RealSpaceItem {
  id: string;
  spaceType: string;
  title: string;
  image: string;
  productUsed: string;
  description: string;
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  size?: string;
  finish?: string;
  material?: string;
  customText?: string;
  uploadedPhotoUrl?: string;
  photoUrl?: string;
}

