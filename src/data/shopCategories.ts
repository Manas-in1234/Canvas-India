export interface ShopCategoryLink {
  name: string;
  path: string;
  categorySlug: string;
  image: string;
  customizerKey?: 'canvas' | 'acrylic'; // set only for categories with a live customizer tool
}

// Every live product category, used for the "Shop by Category" sidebar
// shared across the Canvas/Acrylic/Cork category pages, and for the
// "Start Your Gift Order" tiles on occasion pages.
export const SHOP_CATEGORIES: ShopCategoryLink[] = [
  { name: 'Canvas', path: '/canvas', categorySlug: 'canvas', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80', customizerKey: 'canvas' },
  { name: 'Acrylic', path: '/acrylic', categorySlug: 'acrylic', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', customizerKey: 'acrylic' },
  { name: 'Cork Art Patterns', path: '/cork-art-patterns', categorySlug: 'cork-art-patterns', image: '/assets/catalogue/cork-art-patterns/C-A_003.jpg' },
  { name: 'Devotional Art', path: '/devotional-art', categorySlug: 'devotional-art', image: '/assets/catalogue/devotional-art/G-A_001.jpg' },
  { name: 'Line Art', path: '/line-art', categorySlug: 'line-art', image: '/assets/catalogue/line-art/L-A_010.jpg' },
  { name: 'Motivational Posters', path: '/motivational-posters', categorySlug: 'motivational-posters', image: '/assets/catalogue/motivational-posters/M-A_030.jpg' },
  { name: 'Scenery & Landscape Art', path: '/scenery-landscape-art', categorySlug: 'scenery-landscape-art', image: '/assets/catalogue/scenery-landscape-art/S-A_010.jpg' },
  { name: 'Tribal & Ethnic Art', path: '/tribal-ethnic-art', categorySlug: 'tribal-ethnic-art', image: '/assets/catalogue/tribal-ethnic-art/A-A_006.jpg' },
];

export const getShopCategory = (categorySlug: string): ShopCategoryLink | undefined =>
  SHOP_CATEGORIES.find((c) => c.categorySlug === categorySlug);
