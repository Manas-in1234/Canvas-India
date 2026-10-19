export interface ShopCategoryLink {
  name: string;
  path: string;
  categorySlug: string;
  image: string;
  customizerKey?: 'canvas' | 'acrylic'; // set only for categories with a live customizer tool
}

// Every "other catalogue category" shown in the "Shop by Category" sidebar
// on the Canvas/Acrylic/Cork pages. Canvas, Acrylic and Cork Art Patterns
// are deliberately excluded here since each already has its own dedicated
// top-level category page (this list is only for the OTHER ones) — see
// [[GIFT_TILE_CATEGORIES]] below for the full set used on occasion pages.
export const SHOP_CATEGORIES: ShopCategoryLink[] = [
  { name: 'Devotional Art', path: '/devotional-art', categorySlug: 'devotional-art', image: '/assets/catalogue/devotional-art/G-A_001.webp' },
  { name: 'Line Art', path: '/line-art', categorySlug: 'line-art', image: '/assets/catalogue/line-art/L-A_010.webp' },
  { name: 'Motivational Posters', path: '/motivational-posters', categorySlug: 'motivational-posters', image: '/assets/catalogue/motivational-posters/M-A_030.webp' },
  { name: 'Scenery & Landscape Art', path: '/scenery-landscape-art', categorySlug: 'scenery-landscape-art', image: '/assets/catalogue/scenery-landscape-art/S-A_010.webp' },
  { name: 'Tribal & Ethnic Art', path: '/tribal-ethnic-art', categorySlug: 'tribal-ethnic-art', image: '/assets/catalogue/tribal-ethnic-art/A-A_006.webp' },
];

export const CORK_FILTER_CATEGORIES: ShopCategoryLink[] = [
  { name: 'Cork Pattern Prints', path: '/cork-art-patterns', categorySlug: 'cork-art-patterns', image: '/assets/catalogue/cork-art-patterns/C-A_003.webp' },
  { name: 'Yoga Mats', path: '/yoga-fitness?sub=Yoga%20Mats', categorySlug: 'Yoga Mats', image: '/assets/products/cork/9C-YA1/9c-ya1(1).webp' },
  { name: 'Yoga Bricks', path: '/yoga-fitness?sub=Yoga%20Bricks', categorySlug: 'Yoga Bricks', image: '/assets/products/cork/9C-YA5/9C-YA5(1).webp' },
  { name: 'Yoga Wedges', path: '/yoga-fitness?sub=Yoga%20Wedges', categorySlug: 'Yoga Wedges', image: '/assets/products/cork/9C-YA8/9C-YA8.webp' },
  { name: 'Yoga Rollers', path: '/yoga-fitness?sub=Yoga%20Rollers', categorySlug: 'Yoga Rollers', image: '/assets/products/cork/9C-YA6/9C-YA6(1).webp' },
  { name: 'Yoga Balls', path: '/yoga-fitness?sub=Yoga%20Balls', categorySlug: 'Yoga Balls', image: '/assets/products/cork/9C-YA7/9C-YA7(1).webp' },
  { name: 'Massage Sets', path: '/yoga-fitness?sub=Massage%20Sets', categorySlug: 'Massage Sets', image: '/assets/products/cork/9C-YA9/9C-YA9.webp' },
  { name: 'Knee Pads', path: '/yoga-fitness?sub=Knee%20Pads', categorySlug: 'Knee Pads', image: '/assets/products/cork/9C-YA11/9C-YA11(1).webp' },
  { name: 'Yoga Bags', path: '/yoga-fitness?sub=Yoga%20Bags', categorySlug: 'Yoga Bags', image: '/assets/products/cork/9C-YB1/9C-YB1.webp' },
];

// Full category set (including Canvas/Acrylic/Cork Art Patterns), used only
// for the "Start Your Gift Order" format tiles on occasion pages — those
// need Canvas/Acrylic specifically since each opens its own live customizer.
export const GIFT_TILE_CATEGORIES: ShopCategoryLink[] = [
  { name: 'Canvas', path: '/canvas', categorySlug: 'canvas', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80', customizerKey: 'canvas' },
  { name: 'Acrylic', path: '/acrylic', categorySlug: 'acrylic', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', customizerKey: 'acrylic' },
  { name: 'Cork Art Patterns', path: '/cork-art-patterns', categorySlug: 'cork-art-patterns', image: '/assets/catalogue/cork-art-patterns/C-A_003.webp' },
  ...SHOP_CATEGORIES,
];

export const getShopCategory = (categorySlug: string): ShopCategoryLink | undefined =>
  SHOP_CATEGORIES.find((c) => c.categorySlug === categorySlug);

// Matches a product against a Cork/Yoga "Shop by Category" pick — those
// slugs (e.g. "Yoga Mats") aren't real categorySlug values, they're
// subcategory/tag/name matches within the yoga-fitness and cork catalogues.
export const isCorkCategoryMatch = (
  p: { categorySlug: string; category?: string; subcategory?: string; tags?: string[]; name: string },
  slugOrSub: string
): boolean => {
  if (slugOrSub === 'cork-art-patterns' || slugOrSub === 'Cork Pattern Prints') {
    return (
      p.categorySlug === 'cork-art-patterns' ||
      p.category === 'Cork Art Patterns' ||
      p.name.toLowerCase().includes('cork pattern print')
    );
  }
  const target = slugOrSub.toLowerCase();
  return (
    p.subcategory?.toLowerCase() === target ||
    (p.tags && p.tags.some((t) => t.toLowerCase() === target || target.includes(t.toLowerCase()))) ||
    p.name.toLowerCase().includes(target)
  );
};
