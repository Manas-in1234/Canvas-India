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
  { name: 'Devotional Art', path: '/devotional-art', categorySlug: 'devotional-art', image: '/assets/catalogue/devotional-art/G-A_001.jpg' },
  { name: 'Line Art', path: '/line-art', categorySlug: 'line-art', image: '/assets/catalogue/line-art/L-A_010.jpg' },
  { name: 'Motivational Posters', path: '/motivational-posters', categorySlug: 'motivational-posters', image: '/assets/catalogue/motivational-posters/M-A_030.jpg' },
  { name: 'Scenery & Landscape Art', path: '/scenery-landscape-art', categorySlug: 'scenery-landscape-art', image: '/assets/catalogue/scenery-landscape-art/S-A_010.jpg' },
  { name: 'Tribal & Ethnic Art', path: '/tribal-ethnic-art', categorySlug: 'tribal-ethnic-art', image: '/assets/catalogue/tribal-ethnic-art/A-A_006.jpg' },
];

export const getShopCategory = (categorySlug: string): ShopCategoryLink | undefined =>
  SHOP_CATEGORIES.find((c) => c.categorySlug === categorySlug);
