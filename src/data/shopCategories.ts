export interface ShopCategoryLink {
  name: string;
  path: string;
}

// Every live product category, used for the "Shop by Category" sidebar
// shared across the Canvas/Acrylic/Cork category pages.
export const SHOP_CATEGORIES: ShopCategoryLink[] = [
  { name: 'Canvas', path: '/canvas' },
  { name: 'Acrylic', path: '/acrylic' },
  { name: 'Cork Art Patterns', path: '/cork-art-patterns' },
  { name: 'Devotional Art', path: '/devotional-art' },
  { name: 'Line Art', path: '/line-art' },
  { name: 'Motivational Posters', path: '/motivational-posters' },
  { name: 'Scenery & Landscape Art', path: '/scenery-landscape-art' },
  { name: 'Tribal & Ethnic Art', path: '/tribal-ethnic-art' },
];
