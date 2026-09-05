export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  badge?: 'Best Seller' | 'Sale' | 'Trending' | 'Popular' | 'Hot' | 'New' | 'Custom';
  description: string;
  tags?: string[];
  sizes: string[];
  finishes: string[];
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
  product: Product;
  quantity: number;
  size?: string;
  finish?: string;
  customText?: string;
  uploadedPhotoUrl?: string;
  photoUrl?: string;
}
