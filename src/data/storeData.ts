import { ALL_PRODUCTS, ALL_CATALOG_PRODUCTS as CATALOG_PRODUCTS, CATEGORY_CONFIGS } from './productsData';
export { ALL_PRODUCTS, CATEGORY_CONFIGS };
import { Product, CategoryItem, OccasionItem, CollectionItem, ReviewItem, RealSpaceItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'canvas',
    name: 'Canvas Prints',
    slug: 'canvas',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Cotton blend wrapped canvas with rich color print and sturdy pine wood bars.',
    startingPrice: 599,
    popularItem: 'Single & Multi-Panel Prints',
  },
  {
    id: 'acrylic',
    name: 'Acrylic Prints',
    slug: 'acrylic',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    description: 'High gloss acrylic glass prints with vivid depth, bevelled edges & metal standoffs.',
    startingPrice: 799,
    popularItem: 'Frameless Glass Wall Art',
  },
  {
    id: 'cork',
    name: 'Cork Prints',
    slug: 'cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    description: 'Natural sustainable cork sheets printed with custom graphics, maps & pin boards.',
    startingPrice: 499,
    popularItem: 'Custom Pin Boards & Tiles',
  },
  {
    id: 'wall-art',
    name: 'Wall Art',
    slug: 'wall-art',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80',
    description: 'Curated artistic prints, botanical sets, Indian folk motifs & modern abstract designs.',
    startingPrice: 699,
    popularItem: 'Triptych & Gallery Wall Sets',
  },
  {
    id: 'photo-frames',
    name: 'Photo Frames',
    slug: 'photo-frames',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    description: 'Solid engineered wood frames with shatterproof acrylic glass and mounting hardware.',
    startingPrice: 399,
    popularItem: 'Collage & Table Top Frames',
  },
  {
    id: 'posters',
    name: 'Posters',
    slug: 'posters',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80',
    description: '300 GSM heavyweight matte and glossy paper posters for bedroom, studio or office.',
    startingPrice: 249,
    popularItem: 'Motivational & Cinematic Prints',
  },
  {
    id: 'custom-prints',
    name: 'Custom Prints',
    slug: 'custom-prints',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
    description: 'Upload your own digital photo, artwork or design with instant online sizing preview.',
    startingPrice: 449,
    popularItem: 'Personalized Photo Products',
  },
  {
    id: 'gifts',
    name: 'Gifts & Occasions',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    description: 'Memorable photo gifts for birthdays, weddings, housewarming, anniversaries & festivals.',
    startingPrice: 499,
    popularItem: 'Desk Blocks & Keepsakes',
  },
  {
    id: 'corporate',
    name: 'Corporate Printing',
    slug: 'corporate',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    description: 'Bulk workplace branding, reception logos, signage boards & employee welcome gifts.',
    startingPrice: 1299,
    popularItem: 'Office Displays & Bulk Orders',
  },
];

export const QUICK_ORDER_CHOICES = [
  {
    name: 'Canvas',
    slug: 'canvas',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    description: 'Classic texture with wrapped wood edges',
    startingAt: 599,
  },
  {
    name: 'Acrylic',
    slug: 'acrylic',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    description: 'Glossy glass look with floating metal studs',
    startingAt: 799,
  },
  {
    name: 'Cork',
    slug: 'cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    description: 'Natural pin boards, hexagonal tiles & maps',
    startingAt: 499,
  },
  {
    name: 'Wall Art',
    slug: 'wall-art',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=500&auto=format&fit=crop&q=80',
    description: 'Ready-to-hang modern and Indian art sets',
    startingAt: 699,
  },
  {
    name: 'Photo Frames',
    slug: 'photo-frames',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
    description: 'Framed prints with matte border mounts',
    startingAt: 399,
  },
  {
    name: 'Custom Prints',
    slug: 'custom-prints',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80',
    description: 'Direct upload with full size & finish control',
    startingAt: 449,
  },
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Custom Canvas Print',
    category: 'Canvas Prints',
    categorySlug: 'canvas',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 384,
    price: 1499,
    originalPrice: 1999,
    discountPercent: 25,
    badge: 'Best Seller',
    description: 'Stretched 380 GSM matte cotton canvas on solid pine frame. Ready to hang.',
    sizes: ['8x10 inch', '12x18 inch', '16x24 inch', '24x36 inch'],
    finishes: ['Matte Canvas', 'Satin Finish', 'Floating Frame'],
  },
  {
    id: 'prod-2',
    name: 'Personalized Acrylic Photo',
    category: 'Acrylic Prints',
    categorySlug: 'acrylic',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 260,
    price: 1899,
    originalPrice: 2499,
    discountPercent: 24,
    badge: 'Trending',
    description: '5mm ultra-clear cast acrylic with direct UV printing and stainless steel mounting studs.',
    sizes: ['12x12 inch', '12x18 inch', '18x24 inch', '24x36 inch'],
    finishes: ['Gloss Clear', 'Anti-Glare Matte', 'White Backing'],
  },
  {
    id: 'prod-3',
    name: 'Custom Cork Board',
    category: 'Cork Prints',
    categorySlug: 'cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 145,
    price: 899,
    originalPrice: 1299,
    discountPercent: 30,
    badge: 'Popular',
    description: 'High density 8mm natural cork board with custom UV printed travel map or calendar.',
    sizes: ['12x18 inch', '18x24 inch', '24x36 inch'],
    finishes: ['Natural Cork', 'Dark Roast Cork', 'White Frame'],
  },
  {
    id: 'prod-4',
    name: 'Family Photo Canvas',
    category: 'Canvas Prints',
    categorySlug: 'canvas',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 412,
    price: 1699,
    originalPrice: 2299,
    discountPercent: 26,
    badge: 'Best Seller',
    description: 'High resolution reproduction with skin-tone color balancing and edge wrap options.',
    sizes: ['16x20 inch', '20x30 inch', '24x36 inch'],
    finishes: ['Mirrored Edge', 'Solid Black Edge', 'Folded Edge'],
  },
  {
    id: 'prod-5',
    name: 'Wall Collage Set (3 Panels)',
    category: 'Wall Art',
    categorySlug: 'wall-art',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 189,
    price: 2199,
    originalPrice: 2999,
    discountPercent: 26,
    badge: 'Hot',
    description: 'Three coordinated canvas or framed panels designed to transform living rooms and hallways.',
    sizes: ['Set of 3 (12x18 each)', 'Set of 3 (16x24 each)'],
    finishes: ['Canvas Wrap', 'Black Slim Frame', 'Natural Wood'],
  },
  {
    id: 'prod-6',
    name: 'Modern Solid Wood Photo Frame',
    category: 'Photo Frames',
    categorySlug: 'photo-frames',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 220,
    price: 799,
    originalPrice: 1099,
    discountPercent: 27,
    badge: 'Sale',
    description: 'Crafted from solid wood molding with white beveled mat and archival photo paper.',
    sizes: ['8x10 inch', '11x14 inch', '12x18 inch'],
    finishes: ['Matte Black', 'Warm Teak', 'Pure White'],
  },
  {
    id: 'prod-7',
    name: 'Custom Quote Canvas',
    category: 'Canvas Prints',
    categorySlug: 'canvas',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 178,
    price: 1299,
    originalPrice: 1699,
    discountPercent: 23,
    badge: 'Popular',
    description: 'Add your favorite Hindi or English inspirational quotes, poetry or family rules.',
    sizes: ['12x18 inch', '16x24 inch', '20x30 inch'],
    finishes: ['Clean Minimalist', 'Vintage Textured', 'Bold Typography'],
  },
  {
    id: 'prod-8',
    name: 'Office Acrylic Name Board',
    category: 'Corporate Printing',
    categorySlug: 'corporate',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 132,
    price: 1599,
    originalPrice: 2199,
    discountPercent: 27,
    badge: 'Trending',
    description: 'Sleek company entrance board with laser polished edges and precision logo print.',
    sizes: ['12x6 inch', '18x12 inch', '24x16 inch'],
    finishes: ['Frosted Acrylic', 'Clear Standoff', 'Brushed Silver Base'],
  },
  {
    id: 'prod-9',
    name: 'Personalized Wall Art',
    category: 'Wall Art',
    categorySlug: 'wall-art',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 195,
    price: 1999,
    originalPrice: 2699,
    discountPercent: 25,
    badge: 'Best Seller',
    description: 'Vibrant artistic print with fade-resistant 12-color ink technology and satin protective seal.',
    sizes: ['18x24 inch', '24x36 inch', '30x40 inch'],
    finishes: ['Canvas Stretched', 'Gallery Wood Frame'],
  },
  {
    id: 'prod-10',
    name: 'Custom Corporate Display',
    category: 'Corporate Printing',
    categorySlug: 'corporate',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 94,
    price: 2499,
    originalPrice: 3299,
    discountPercent: 24,
    badge: 'New',
    description: 'Values display, timeline walls and mission boards for conference rooms and workspaces.',
    sizes: ['24x36 inch', '36x48 inch', '48x72 inch'],
    finishes: ['Acrylic Wall Panel', 'Textured Cork Board', 'Gallery Canvas'],
  },
  {
    id: 'prod-11',
    name: 'Hexagon Cork Wall Tiles (Set of 6)',
    category: 'Cork Prints',
    categorySlug: 'cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 167,
    price: 999,
    originalPrice: 1499,
    discountPercent: 33,
    badge: 'Sale',
    description: 'Modular self-adhesive cork tiles for pinboards, acoustic dampening and photo displays.',
    sizes: ['Set of 6 (8x9 inch each)', 'Set of 12 (8x9 inch each)'],
    finishes: ['Natural Cork', 'Geometric Printed', 'Mixed Pattern'],
  },
  {
    id: 'prod-12',
    name: 'Desk Acrylic Photo Block',
    category: 'Acrylic Prints',
    categorySlug: 'acrylic',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 310,
    price: 699,
    originalPrice: 999,
    discountPercent: 30,
    badge: 'Best Seller',
    description: 'Freestanding 20mm thick solid acrylic block. Perfect gift for work desks and bedside tables.',
    sizes: ['4x6 inch', '5x7 inch', '6x8 inch'],
    finishes: ['Crystal Clear 20mm', 'Magnetic Double Sided'],
  },
];

export const DEALS_PRODUCTS: Product[] = [
  {
    id: 'deal-1',
    name: 'Mini Canvas Desk Print',
    category: 'Canvas Prints',
    categorySlug: 'canvas',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 140,
    price: 499,
    originalPrice: 799,
    discountPercent: 38,
    badge: 'Sale',
    description: 'Compact 6x6 inch canvas with mini wooden display easel.',
    sizes: ['6x6 inch', '8x8 inch'],
    finishes: ['Matte Canvas with Easel'],
  },
  {
    id: 'deal-2',
    name: 'Everyday Photo Frame (Pack of 2)',
    category: 'Photo Frames',
    categorySlug: 'photo-frames',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 98,
    price: 649,
    originalPrice: 999,
    discountPercent: 35,
    badge: 'Popular',
    description: 'Clean composite black or white frames with stand and wall hook.',
    sizes: ['Set of 2 (5x7 inch)', 'Set of 2 (6x8 inch)'],
    finishes: ['Classic Black', 'Nordic White'],
  },
  {
    id: 'deal-3',
    name: 'Personalized Cork Coasters (Set of 4)',
    category: 'Cork Prints',
    categorySlug: 'cork',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 112,
    price: 399,
    originalPrice: 599,
    discountPercent: 33,
    badge: 'Best Seller',
    description: 'Heat resistant 5mm thick cork coasters printed with your family initials or motifs.',
    sizes: ['4x4 inch round', '4x4 inch square'],
    finishes: ['Natural Cork Printed'],
  },
  {
    id: 'deal-4',
    name: 'Budget Matte Poster Print',
    category: 'Posters',
    categorySlug: 'posters',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 84,
    price: 299,
    originalPrice: 499,
    discountPercent: 40,
    badge: 'Sale',
    description: 'High color gamut matte posters shipped rolled in rigid postal tubes.',
    sizes: ['12x18 inch', '16x24 inch'],
    finishes: ['300 GSM Matte Paper'],
  },
];

export const OCCASIONS: OccasionItem[] = [
  {
    id: 'bday',
    name: 'Birthday',
    slug: 'birthday',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    offerText: 'Up to 30% OFF',
    tagline: 'Custom photo collages, acrylic desk blocks & memory frames',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    slug: 'wedding',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    offerText: 'Special Couple Packs',
    tagline: 'Grand canvas portraits, vows on acrylic & family gallery sets',
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    slug: 'anniversary',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80',
    offerText: 'Flat 25% OFF',
    tagline: 'Timeline photo frames and romantic quote canvas prints',
  },
  {
    id: 'housewarming',
    name: 'Housewarming',
    slug: 'housewarming',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    offerText: 'From ₹799',
    tagline: 'Living room wall art, entrance boards & cork pinboards',
  },
  {
    id: 'festivals',
    name: 'Festivals',
    slug: 'festivals',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    offerText: 'Diwali & Festival Specials',
    tagline: 'Traditional Indian art, pooja room prints & festive gifting',
  },
  {
    id: 'corporate-occ',
    name: 'Corporate',
    slug: 'corporate',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    offerText: 'Volume Discounts',
    tagline: 'Employee milestones, founder awards & office wall decor',
  },
  {
    id: 'gifts-occ',
    name: 'Gifts',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    offerText: 'Starting at ₹399',
    tagline: 'Customized surprises for friends, parents & loved ones',
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80',
    offerText: 'New Arrivals',
    tagline: 'Cohesive gallery walls, modern canvas and acrylic accents',
  },
];

export interface OccasionMenuItem {
  name: string;
  slug: string;
}

export const SPECIAL_OCCASIONS: OccasionMenuItem[] = [
  { name: "Mother's Day", slug: 'mothers-day' },
  { name: "Brother's Day", slug: 'brothers-day' },
  { name: "Father's Day", slug: 'fathers-day' },
  { name: 'Friendship Day', slug: 'friendship-day' },
  { name: "Teacher's Day", slug: 'teachers-day' },
  { name: "Children's Day", slug: 'childrens-day' },
  { name: "Men's Day", slug: 'mens-day' },
  { name: 'New Year', slug: 'new-year' },
  { name: 'Republic Day', slug: 'republic-day' },
  { name: "Valentine's Day", slug: 'valentines-day' },
  { name: "Women's Day", slug: 'womens-day' },
];

export const FESTIVALS: OccasionMenuItem[] = [
  { name: 'Rakshabandhan', slug: 'rakshabandhan' },
  { name: 'Janmashtami', slug: 'janmashtami' },
  { name: 'Ganesh Chaturthi', slug: 'ganesh-chaturthi' },
  { name: 'Karwa Chauth', slug: 'karwa-chauth' },
  { name: 'Halloween', slug: 'halloween' },
  { name: 'Diwali', slug: 'diwali' },
  { name: 'Bhai Dooj', slug: 'bhai-dooj' },
  { name: 'Christmas', slug: 'christmas' },
  { name: 'Lohri', slug: 'lohri' },
  { name: 'Makar Sankranti', slug: 'makar-sankranti' },
  { name: 'Pongal', slug: 'pongal' },
  { name: 'Holi', slug: 'holi' },
];

export const ALL_GIFTS_PROMO = {
  title: 'All Gifts & Celebrations',
  tagline: 'Personalized photo keepsakes, crystal acrylic blocks & custom wall prints for every milestone.',
  badge: 'Special Festive Offers',
  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
  buttonText: 'Shop All Gifts',
  slug: 'gifts',
};

export interface MegaMenuItem {
  name: string;
  slug: string;
  description?: string;
  badge?: string;
  actionType?: 'category' | 'quote' | 'customize';
}

export interface MegaMenuGroup {
  title: string;
  iconType: 'heart' | 'sparkles' | 'palette' | 'layers' | 'circleDot' | 'printer' | 'package' | 'building' | 'sliders' | 'gift';
  items: MegaMenuItem[];
}

export interface MegaMenuPromo {
  title: string;
  tagline: string;
  badge: string;
  image: string;
  buttonText: string;
  slug: string;
  actionType: 'category' | 'quote' | 'customize';
}

export interface MegaMenuConfig {
  id: string;
  name: string;
  groups: MegaMenuGroup[];
  promo: MegaMenuPromo;
}

export const MEGA_MENUS_DATA: Record<string, MegaMenuConfig> = {
  canvas: {
    id: 'canvas',
    name: 'Canvas Frames',
    groups: [
      {
        title: 'Shop Canvas',
        iconType: 'palette',
        items: [
          { name: 'Photo Canvas', slug: 'canvas', description: 'Stretched 380 GSM cotton on solid pine frame' },
          { name: 'Family Photos', slug: 'canvas', description: 'Skin-tone color balancing with mirrored edge' },
          { name: 'Wedding Memories', slug: 'canvas', description: 'Grand panoramic portraits with floater frame' },
          { name: 'Artistic Reproductions', slug: 'canvas', description: 'Museum-grade pigment color reproduction' },
          { name: 'Nature & Landscape', slug: 'canvas', description: 'Vivid scenic wilderness & mountain views' },
          { name: 'Motivational', slug: 'canvas', description: 'Inspirational quotes on fine textured canvas' },
          { name: 'Religious & Spiritual', slug: 'canvas', description: 'Devotional sacred motifs & pooja art' },
          { name: 'Corporate Canvas', slug: 'canvas', description: 'Large architectural prints for office walls' },
        ],
      },
      {
        title: 'Spaces & Décor',
        iconType: 'sliders',
        items: [
          { name: 'Living Room Décor', slug: 'canvas', description: 'Statement sofa centerpieces & gallery walls' },
          { name: 'Bedroom Décor', slug: 'canvas', description: 'Calming headboard panoramas & couple art' },
          { name: 'Hotel & Hospitality Décor', slug: 'canvas', description: 'Coordinated suite art & guest lobby sets' },
          { name: 'Restaurant & Café Décor', slug: 'canvas', description: 'Atmospheric food & beverage wall prints' },
          { name: 'Customized Canvas Gifts', slug: 'canvas', description: 'Personalized gift wrapping & custom sizes' },
        ],
      },
    ],
    promo: {
      title: 'Turn Your Memories Into Wall Art',
      tagline: 'Premium Cotton Canvas Prints stretched on kiln-dried pine wood with 12-color archival inks.',
      badge: 'Starting at ₹499',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Explore Canvas Frames',
      slug: 'canvas',
      actionType: 'category',
    },
  },
  acrylic: {
    id: 'acrylic',
    name: 'Acrylic Prints',
    groups: [
      {
        title: 'Acrylic Prints & Wall Art',
        iconType: 'layers',
        items: [
          { name: 'Acrylic Photo Panels', slug: 'acrylic', description: '5mm ultra-clear cast acrylic with floating metal standoffs' },
          { name: 'Acrylic Wall Art', slug: 'acrylic', description: 'Glossy glass look frameless contemporary art' },
          { name: 'Acrylic Posters', slug: 'acrylic', description: 'Crystal-clear vibrant visual displays' },
          { name: 'Acrylic Artwork', slug: 'acrylic', description: 'Museum optical clarity with sub-surface UV printing' },
          { name: 'Acrylic Signage', slug: 'acrylic', description: 'Directional, door plaques & business logos' },
          { name: 'Decorative Panels', slug: 'acrylic', description: 'Beveled diamond-polished reflective wall panels' },
          { name: 'Corporate Acrylic', slug: 'acrylic', description: 'Office values & architectural graphics' },
        ],
      },
      {
        title: 'Commercial & Gifting',
        iconType: 'sliders',
        items: [
          { name: 'Reception Artwork', slug: 'acrylic', description: 'Statement entrance lobby glass panels' },
          { name: 'Office Graphics', slug: 'acrylic', description: 'Boardroom mission & branding displays' },
          { name: 'Retail Displays', slug: 'acrylic', description: 'Countertop & point-of-sale optical blocks' },
          { name: 'Restaurant Décor', slug: 'acrylic', description: 'Backlit & polished dining space art' },
          { name: 'Hotel Décor', slug: 'acrylic', description: 'Luxury suite & hallway optical prints' },
          { name: 'Inspirational Acrylic', slug: 'acrylic', description: 'Sleek modern typography desk & wall art' },
          { name: 'Customized Acrylic Gifts', slug: 'acrylic', description: '20mm freestanding crystal photo blocks' },
        ],
      },
    ],
    promo: {
      title: 'Modern Acrylic Elegance',
      tagline: 'Ultra-glossy crystal clarity with diamond-milled edges and floating metal standoffs.',
      badge: 'Starting from ₹399',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Explore Acrylic Prints',
      slug: 'acrylic',
      actionType: 'category',
    },
  },
  posters: {
    id: 'posters',
    name: 'Posters & Custom Wall Graphics',
    groups: [
      {
        title: 'Home & Workplace Posters',
        iconType: 'palette',
        items: [
          { name: 'Home Posters', slug: 'posters', description: '300 GSM heavyweight matte and lustre prints' },
          { name: 'Office Posters', slug: 'posters', description: 'Startup motivation and leadership typography' },
          { name: 'Kids Room Posters', slug: 'posters', description: 'Playful educational art & nursery illustrations' },
          { name: 'Gym & Fitness Posters', slug: 'posters', description: 'High energy workout & training inspiration' },
          { name: 'Restaurant & Café Posters', slug: 'posters', description: 'Bistro aesthetics & culinary art' },
          { name: 'Retail Posters', slug: 'posters', description: 'Promotional, seasonal & showcase prints' },
          { name: 'Custom Wall Graphics', slug: 'posters', description: 'Adhesive vinyl graphics & feature wall decals' },
        ],
      },
      {
        title: 'Spaces & Special Themes',
        iconType: 'sliders',
        items: [
          { name: 'Living Room Posters', slug: 'posters', description: 'Minimalist line art & botanical sets' },
          { name: 'Bedroom Posters', slug: 'posters', description: 'Serene landscapes & aesthetic prints' },
          { name: 'School & Institution Posters', slug: 'posters', description: 'Educational diagrams & motivational signs' },
          { name: 'Hotel Posters', slug: 'posters', description: 'Curated artistic cityscapes & photography' },
          { name: 'Event Posters', slug: 'posters', description: 'Conference, festival & commemorative prints' },
          { name: 'Exhibition Graphics', slug: 'posters', description: 'Large format trade show & gallery displays' },
        ],
      },
    ],
    promo: {
      title: 'Custom Posters & Wall Graphics',
      tagline: 'Transform any residential or commercial space with 300 GSM fade-proof pigment printing.',
      badge: 'Starting from ₹249',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Shop Posters',
      slug: 'posters',
      actionType: 'category',
    },
  },
  cork: {
    id: 'cork',
    name: 'Cork Products & Cork Décor',
    groups: [
      {
        title: 'Cork Products',
        iconType: 'circleDot',
        items: [
          { name: 'Cork Boards', slug: 'cork', description: 'High-density natural bulletin and pin boards' },
          { name: 'Notice Boards', slug: 'cork', description: 'Anodized aluminum edge boards for workrooms' },
          { name: 'Pin Boards', slug: 'cork', description: 'Self-healing Portuguese micro-grain cork' },
          { name: 'Memory Boards', slug: 'cork', description: 'Travel maps & photo displays with matching pins' },
          { name: 'Decorative Cork Panels', slug: 'cork', description: 'Acoustic tiles for noise reduction & warmth' },
          { name: 'Custom Cork Products', slug: 'cork', description: 'Custom printed calendars, grids & logos' },
        ],
      },
      {
        title: 'Organization & Creative Displays',
        iconType: 'sliders',
        items: [
          { name: 'Office Organization Boards', slug: 'cork', description: 'Sprint planners, kanban & vision boards' },
          { name: 'Kids Learning Boards', slug: 'cork', description: 'World maps, alphabet & activity cork boards' },
          { name: 'Photo Display Boards', slug: 'cork', description: 'Polaroid clips and keepsake wall displays' },
          { name: 'Creative Wall Décor', slug: 'cork', description: 'CNC laser-cut custom shape contour cork' },
          { name: 'Hexagon Acoustic Tiles', slug: 'cork', description: 'Modular sound dampening set of 6 tiles' },
        ],
      },
    ],
    promo: {
      title: 'Natural Cork Warmth',
      tagline: '100% sustainable bark cork with self-healing grain and acoustic sound-softening.',
      badge: 'Starting from ₹449',
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Explore Cork Products',
      slug: 'cork',
      actionType: 'category',
    },
  },
  'yoga-fitness': {
    id: 'yoga-fitness',
    name: 'Yoga Mats & Fitness Products',
    groups: [
      {
        title: 'Yoga Mats & Personal Gear',
        iconType: 'sliders',
        items: [
          { name: 'Yoga Mats', slug: 'yoga-fitness', description: 'Eco-friendly TPE & natural tree rubber mats' },
          { name: 'Customized Yoga Mats', slug: 'yoga-fitness', description: 'Monogrammed names, mantras & laser alignment lines' },
          { name: 'Branded Yoga Mats', slug: 'yoga-fitness', description: 'Commercial studio branding & logo printing' },
          { name: 'Gym Products', slug: 'yoga-fitness', description: 'Sweat towels, workout mats & fitness banners' },
          { name: 'Wellness Products', slug: 'yoga-fitness', description: 'Meditation cushions & soothing wellness art' },
        ],
      },
      {
        title: 'Corporate & Events',
        iconType: 'building',
        items: [
          { name: 'Corporate Wellness', slug: 'yoga-fitness', description: 'Employee health kit branded yoga mats' },
          { name: 'Event Fitness Products', slug: 'yoga-fitness', description: 'Marathon & Yoga Day participant mats' },
          { name: 'Promotional Fitness Products', slug: 'yoga-fitness', description: 'Custom printed brand giveaway gear' },
          { name: 'Personalized Fitness Gifts', slug: 'yoga-fitness', description: 'Individualized yoga sets with custom straps' },
        ],
      },
    ],
    promo: {
      title: 'Custom Fitness & Yoga Studio Gear',
      tagline: 'Anti-slip natural rubber & vegan suede yoga mats with high-definition dye sublimation print.',
      badge: 'From ₹1,199',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Shop Yoga & Fitness',
      slug: 'yoga-fitness',
      actionType: 'category',
    },
  },
  'home-decor': {
    id: 'home-decor',
    name: 'Home Décor Collection',
    groups: [
      {
        title: 'Art & Wall Décor',
        iconType: 'palette',
        items: [
          { name: 'Canvas Wall Art', slug: 'home-decor', description: 'Museum-grade multi-panel triptychs & singles' },
          { name: 'Acrylic Artwork', slug: 'home-decor', description: 'Modern fluid abstract art with glass sheen' },
          { name: 'Posters', slug: 'home-decor', description: 'Curated Scandinavian & Indian folk motifs' },
          { name: 'Photo Décor', slug: 'home-decor', description: 'Family timeline frames & gallery wall sets' },
          { name: 'Cork Décor', slug: 'home-decor', description: 'Organic textured acoustic wall panels' },
        ],
      },
      {
        title: 'Spaces & Custom Displays',
        iconType: 'sliders',
        items: [
          { name: 'Living Room Décor', slug: 'home-decor', description: 'Grand centerpiece art matching sofa palettes' },
          { name: 'Bedroom Décor', slug: 'home-decor', description: 'Serene headboard panoramas & mood art' },
          { name: 'Kids Room Décor', slug: 'home-decor', description: 'Nursery milestones & playful animals' },
          { name: 'Inspirational Wall Art', slug: 'home-decor', description: 'Mindful poetry & home blessings' },
          { name: 'Decorative Panels', slug: 'home-decor', description: 'Laser cut & geometric composite panels' },
          { name: 'Customized Wall Displays', slug: 'home-decor', description: 'Family crests & personalized home signs' },
        ],
      },
    ],
    promo: {
      title: 'Elevate Every Room',
      tagline: 'Curated wall art and personalized decor handcrafted to complement contemporary Indian homes.',
      badge: 'Curated Collections',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Explore Home Décor',
      slug: 'home-decor',
      actionType: 'category',
    },
  },
  'custom-prints': {
    id: 'custom-prints',
    name: 'Custom Prints',
    groups: [
      {
        title: 'Custom Formats',
        iconType: 'printer',
        items: [
          { name: 'Custom Canvas', slug: 'custom-prints', description: 'Any dimension with instant wrapped 3D preview' },
          { name: 'Custom Acrylic', slug: 'custom-prints', description: 'Optical glass finish with stainless wall studs' },
          { name: 'Custom Posters', slug: 'custom-prints', description: '300 GSM photo prints with framing options' },
          { name: 'Custom Cork', slug: 'custom-prints', description: 'Direct UV print on natural self-healing cork' },
          { name: 'Custom Wall Graphics', slug: 'custom-prints', description: 'Removable adhesive wall vinyl for interiors' },
          { name: 'Custom Photo Prints', slug: 'custom-prints', description: 'Desk blocks, framed prints & collages' },
        ],
      },
      {
        title: '5-Step Workflow',
        iconType: 'sparkles',
        items: [
          { name: '1. Your Design', slug: 'custom-prints', description: 'Upload high-res photo or artwork' },
          { name: '2. Your Size', slug: 'custom-prints', description: 'Choose from 8+ preset or custom sizes' },
          { name: '3. Your Material', slug: 'custom-prints', description: 'Canvas, Acrylic, Cork or Paper' },
          { name: '4. Your Finish', slug: 'custom-prints', description: 'Matte, Gloss, Floater Frame or Standoffs' },
          { name: '5. Our Production', slug: 'custom-prints', description: 'Handcrafted in India with 3-5 day dispatch' },
          { name: 'Upload Your Design', slug: 'custom-prints', description: 'Instant upload and visual preview tool', actionType: 'customize' },
        ],
      },
    ],
    promo: {
      title: 'Your Design. Your Finish. Handcrafted.',
      tagline: 'Bring any digital photograph or artwork to life with millimetre precision and archival inks.',
      badge: 'Start Customizing',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Launch Customizer',
      slug: 'custom-prints',
      actionType: 'customize',
    },
  },
  gifts: {
    id: 'gifts',
    name: 'Gifts & Occasions',
    groups: [
      {
        title: 'Occasions & Milestones',
        iconType: 'gift',
        items: [
          { name: 'Birthday Gifts', slug: 'gifts', description: 'Personalized memory collages & desk blocks' },
          { name: 'Anniversary Gifts', slug: 'gifts', description: 'Timeline frames & romantic quote canvas' },
          { name: 'Wedding Keepsakes', slug: 'gifts', description: 'Grand canvas portraits & guest memory boards' },
          { name: 'Housewarming Gifts', slug: 'gifts', description: 'Living room wall art & entryway plaques' },
          { name: "Valentine's Day", slug: 'gifts', description: 'Cherished couple prints & crystal hearts' },
          { name: "Mother's & Father's Day", slug: 'gifts', description: 'Heartfelt family portraits & mother-child memories' },
          { name: 'Festivals & Diwali', slug: 'gifts', description: 'Pooja room spiritual art & festive gift hampers' },
        ],
      },
      {
        title: 'Gift Formats',
        iconType: 'sparkles',
        items: [
          { name: 'Personalized Gifts', slug: 'gifts', description: 'Custom names, special dates and photos' },
          { name: 'Photo Gifts', slug: 'gifts', description: 'Tabletop acrylic blocks & collage frames' },
          { name: 'Corporate Gifts', slug: 'gifts', description: 'Custom branded employee & client appreciation gifts' },
          { name: 'Gift Wrapping Included', slug: 'gifts', description: 'Rigid safety packaging with greeting card' },
        ],
      },
    ],
    promo: {
      title: 'Cherished Personalized Gifts',
      tagline: 'Memorable photo gifts for birthdays, weddings, anniversaries, housewarming & festive seasons.',
      badge: 'From ₹399',
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Shop All Gifts',
      slug: 'gifts',
      actionType: 'category',
    },
  },
  'bulk-order': {
    id: 'bulk-order',
    name: 'Bulk Order',
    groups: [
      {
        title: 'Bulk Categories',
        iconType: 'package',
        items: [
          { name: 'Bulk Canvas Orders', slug: 'bulk-order', description: 'Volume rates on museum stretched canvas', actionType: 'quote' },
          { name: 'Bulk Acrylic Orders', slug: 'bulk-order', description: 'Wholesale crystal awards & photo panels', actionType: 'quote' },
          { name: 'Bulk Posters', slug: 'bulk-order', description: 'High volume print runs for events & retail', actionType: 'quote' },
          { name: 'Bulk Cork Products', slug: 'bulk-order', description: 'Quantity school, studio & office notice boards', actionType: 'quote' },
          { name: 'Bulk Yoga Mats', slug: 'bulk-order', description: 'Custom branded batch for gyms & events', actionType: 'quote' },
          { name: 'Bulk Décor', slug: 'bulk-order', description: 'Hospitality & residential project fitouts', actionType: 'quote' },
          { name: 'Event Orders', slug: 'bulk-order', description: 'Customized favors for weddings & summits', actionType: 'quote' },
        ],
      },
      {
        title: 'Volume Advantages',
        iconType: 'sliders',
        items: [
          { name: 'Tiered Wholesale Rates', slug: 'bulk-order', description: 'Save up to 40% on orders above 20 units', actionType: 'quote' },
          { name: 'Free Pre-Production Proofs', slug: 'bulk-order', description: 'Color-calibrated digital sample before production', actionType: 'quote' },
          { name: 'Multi-Location Dispatch', slug: 'bulk-order', description: 'Split shipping to branches across India', actionType: 'quote' },
          { name: '100% GST Compliant', slug: 'bulk-order', description: 'Official tax invoices with B2B input credit', actionType: 'quote' },
          { name: 'Request Bulk Quote', slug: 'bulk-order', description: 'Instant response from production specialists', actionType: 'quote' },
        ],
      },
    ],
    promo: {
      title: 'Order in Volume & Save',
      tagline: 'Special tiered manufacturing pricing for volume orders above 15 units. Fast proofs & pan-India dispatch.',
      badge: 'Volume Discounts',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Request Bulk Quote',
      slug: 'bulk-order',
      actionType: 'quote',
    },
  },
  'corporate-orders': {
    id: 'corporate-orders',
    name: 'Corporate & Commercial Décor',
    groups: [
      {
        title: 'Corporate Décor & Graphics',
        iconType: 'building',
        items: [
          { name: 'Corporate Wall Art', slug: 'corporate-orders', description: 'Office reception and boardroom statement art' },
          { name: 'Brand Graphics', slug: 'corporate-orders', description: 'Mission values, timelines & branded graphics' },
          { name: 'Motivational Artwork', slug: 'corporate-orders', description: 'Productivity & innovation typography' },
          { name: 'Acrylic Panels', slug: 'corporate-orders', description: 'High-gloss company logo & signage boards' },
          { name: 'Office Posters', slug: 'corporate-orders', description: 'Framed corporate values poster sets' },
          { name: 'Office Décor', slug: 'corporate-orders', description: 'Turnkey workplace décor packages' },
          { name: 'Reception Artwork', slug: 'corporate-orders', description: 'Grand architectural entrance displays' },
        ],
      },
      {
        title: 'Workplace Solutions',
        iconType: 'sliders',
        items: [
          { name: 'Employee Recognition Displays', slug: 'corporate-orders', description: 'Modular wall-of-fame milestone plaques' },
          { name: 'Meeting Room Graphics', slug: 'corporate-orders', description: 'Inspiring collaborative room installations' },
          { name: 'Training Room Décor', slug: 'corporate-orders', description: 'Interactive acoustic cork & visual boards' },
          { name: 'Brand-Focused Installations', slug: 'corporate-orders', description: 'Full Pantone and brand guideline adherence' },
          { name: 'Solutions for Designers & Architects', slug: 'designers-architects', description: 'Trade discounts & production partnership' },
        ],
      },
    ],
    promo: {
      title: 'Commercial & Workplace Décor',
      tagline: 'Customized visual products for offices, hotels, hospitals & commercial spaces. GST invoicing included.',
      badge: 'B2B Services',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
      buttonText: 'Request Corporate Quote',
      slug: 'corporate-orders',
      actionType: 'quote',
    },
  },
};

// Aliases for backwards compatibility
MEGA_MENUS_DATA['canvas-prints'] = MEGA_MENUS_DATA.canvas;
MEGA_MENUS_DATA['acrylic-prints'] = MEGA_MENUS_DATA.acrylic;
MEGA_MENUS_DATA['cork-prints'] = MEGA_MENUS_DATA.cork;
MEGA_MENUS_DATA.corporate = MEGA_MENUS_DATA['corporate-orders'];
MEGA_MENUS_DATA['bulk-orders'] = MEGA_MENUS_DATA['bulk-order'];


export const SEARCH_SUGGESTIONS = [
  'canvas prints',
  'acrylic photo frames',
  'birthday gifts',
  'couple gifts',
  'wedding gifts',
  'photo collage',
  'wall art',
  'corporate gifts',
  'Diwali gifts',
];

export interface CircularCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  startingPrice: number;
}

export interface PrimaryCategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: 'Palette' | 'Layers' | 'CircleDot' | 'Printer' | 'Gift' | 'Package' | 'Building2' | 'Image' | 'Activity' | 'Home';
  startingPrice: number;
  image: string;
  description: string;
}

export const PRIMARY_CATEGORIES: PrimaryCategoryItem[] = [
  {
    id: 'cat-canvas',
    name: 'Canvas',
    slug: 'canvas',
    iconName: 'Palette',
    startingPrice: 499,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    description: 'Museum-grade 380 GSM cotton canvas prints',
  },
  {
    id: 'cat-acrylic',
    name: 'Acrylic',
    slug: 'acrylic',
    iconName: 'Layers',
    startingPrice: 399,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
    description: 'High-gloss 5mm crystal clear acrylic glass prints',
  },
  {
    id: 'cat-posters',
    name: 'Posters & Custom Wall Graphics',
    slug: 'posters',
    iconName: 'Image',
    startingPrice: 249,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&auto=format&fit=crop&q=80',
    description: 'Custom posters and wall graphics for residential and commercial spaces',
  },
  {
    id: 'cat-cork',
    name: 'Cork',
    slug: 'cork',
    iconName: 'CircleDot',
    startingPrice: 449,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80',
    description: 'Natural 8mm eco-friendly cork pinboards and prints',
  },
  {
    id: 'cat-yoga',
    name: 'Yoga & Fitness',
    slug: 'yoga-fitness',
    iconName: 'Activity',
    startingPrice: 1199,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80',
    description: 'Customized yoga mats and wellness products',
  },
  {
    id: 'cat-decor',
    name: 'Home Décor',
    slug: 'home-decor',
    iconName: 'Home',
    startingPrice: 699,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&auto=format&fit=crop&q=80',
    description: 'Curated decorative and personalized interior wall collections',
  },
  {
    id: 'cat-custom',
    name: 'Custom Prints',
    slug: 'custom-prints',
    iconName: 'Printer',
    startingPrice: 299,
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&auto=format&fit=crop&q=80',
    description: 'Create products based on your own design, size and material',
  },
  {
    id: 'cat-gifts',
    name: 'Gifts & Occasions',
    slug: 'gifts',
    iconName: 'Gift',
    startingPrice: 499,
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop&q=80',
    description: 'Personalized gifts for birthdays, weddings, anniversaries and festivals',
  },
  {
    id: 'cat-bulk',
    name: 'Bulk Order',
    slug: 'bulk-order',
    iconName: 'Package',
    startingPrice: 249,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&auto=format&fit=crop&q=80',
    description: 'Volume discounts for events, schools, artists and resellers',
  },
  {
    id: 'cat-corporate',
    name: 'Corporate Orders',
    slug: 'corporate-orders',
    iconName: 'Building2',
    startingPrice: 499,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80',
    description: 'B2B office art, employee welcome kits and GST invoicing',
  },
];

export const CIRCULAR_CATEGORIES: CircularCategory[] = PRIMARY_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  image: cat.image,
  startingPrice: cat.startingPrice,
}));

export interface OccasionCardItem {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  image: string;
  tagline: string;
  offerText: string;
}

export const OCCASION_CARDS: OccasionCardItem[] = [
  {
    id: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    tagline: 'Custom photo collages & acrylic desk blocks',
    offerText: 'Up to 30% OFF',
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    emoji: '💍',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&auto=format&fit=crop&q=80',
    tagline: 'Romantic timeline frames and quote canvas',
    offerText: 'Flat 25% OFF',
  },
  {
    id: 'valentine',
    name: "Valentine's Day",
    emoji: '❤️',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80',
    tagline: 'Cherished couple prints & crystal hearts',
    offerText: 'From ₹399',
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    emoji: '👩',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
    tagline: 'Heartfelt family portraits & mother-child memories',
    offerText: 'Special Packs',
  },
  {
    id: 'fathers-day',
    name: "Father's Day",
    emoji: '👨',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=500&auto=format&fit=crop&q=80',
    tagline: 'Desk photo blocks & engraved cork boards',
    offerText: 'Up to 20% OFF',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    emoji: '💒',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80',
    tagline: 'Grand canvas portraits & wedding vow sets',
    offerText: 'Couple Packs',
  },
  {
    id: 'housewarming',
    name: 'Housewarming',
    emoji: '🏠',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format&fit=crop&q=80',
    tagline: 'Living room wall art & entryway boards',
    offerText: 'From ₹799',
  },
  {
    id: 'personalized',
    name: 'Personalized Gifts',
    emoji: '🎁',
    slug: 'custom-prints',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
    tagline: 'Custom names, special dates and photos',
    offerText: 'Bestseller',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    tagline: 'Festive pooja wall art & family gifting packs',
    offerText: 'Diwali Specials',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    slug: 'gifts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    tagline: 'Holiday season photo blocks & secret Santa gifts',
    offerText: 'Year End Sale',
  },
];

export interface BudgetTier {
  id: string;
  range: string;
  title: string;
  subtitle: string;
  badge: string;
  slug: string;
  image: string;
}

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-499',
    range: 'Under ₹499',
    title: 'Affordable Personalized Gifts',
    subtitle: 'Tabletop acrylic blocks, mini cork tiles & photo posters',
    badge: 'Pocket Friendly',
    slug: 'deals',
    image: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: '499-999',
    range: '₹499 – ₹999',
    title: 'Popular Gifting Options',
    subtitle: '8x10 canvas prints, wooden photo frames & cork pinboards',
    badge: 'Most Popular',
    slug: 'canvas-prints',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: '999-1999',
    range: '₹999 – ₹1,999',
    title: 'Premium Personalized Products',
    subtitle: '16x24 gallery wrapped canvas & glossy acrylic float prints',
    badge: 'Premium Picks',
    slug: 'acrylic-prints',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: '1999-plus',
    range: '₹1,999+',
    title: 'Premium Wall Decor & Gifts',
    subtitle: 'Multi-panel triptychs, grand wall art sets & corporate displays',
    badge: 'Luxury Finish',
    slug: 'wall-decor',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=400&auto=format&fit=crop&q=80',
  },
];

export const FEATURED_COLLECTIONS: CollectionItem[] = [
  {
    id: 'memories',
    name: 'Photo Memories',
    slug: 'photo-memories',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    itemCount: 42,
    startingPrice: 499,
    highlight: 'Turn vacation, family & celebration clicks into real keepsakes',
  },
  {
    id: 'decor',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600&auto=format&fit=crop&q=80',
    itemCount: 88,
    startingPrice: 699,
    highlight: 'Contemporary canvas sets matching Indian living room aesthetics',
  },
  {
    id: 'indian-art',
    name: 'Indian Art & Heritage',
    slug: 'indian-art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    itemCount: 56,
    startingPrice: 599,
    highlight: 'Warli, Madhubani, Pichwai and modern ethnic fusion prints',
  },
  {
    id: 'office',
    name: 'Office & Workspace',
    slug: 'office-workspace',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    itemCount: 35,
    startingPrice: 899,
    highlight: 'Modern motivational typography, acoustic cork tiles & logos',
  },
  {
    id: 'kids',
    name: 'Kids & Family',
    slug: 'kids-family',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    itemCount: 29,
    startingPrice: 449,
    highlight: 'Nursery wall sets, baby milestone collages & family trees',
  },
  {
    id: 'gifting',
    name: 'Gifting Studio',
    slug: 'gifting-studio',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    itemCount: 48,
    startingPrice: 399,
    highlight: 'Ready to gift with custom gift wrap, greeting card & sturdy box',
  },
  {
    id: 'branding',
    name: 'Business Branding',
    slug: 'business-branding',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    itemCount: 30,
    startingPrice: 1499,
    highlight: 'Acrylic signage, branded cork boards & client corporate packs',
  },
];

export const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Ananya Sharma',
    city: 'Bengaluru',
    rating: 5,
    product: 'Custom Canvas Print (16x24 inch)',
    review: 'Ordered a family vacation photo on canvas. The print quality is crisp, colors match my phone screen accurately, and the wooden frame is very solid. Delivered safely in 4 days.',
    verified: true,
    date: '3 days ago',
  },
  {
    id: 'rev-2',
    name: 'Rajesh Patel',
    city: 'Ahmedabad',
    rating: 5,
    product: 'Personalized Acrylic Photo (18x24 inch)',
    review: 'The glossy acrylic glass look is stunning on our living room wall. The metallic standoffs were easy to mount with provided screws. Super happy with the finish!',
    verified: true,
    date: '1 week ago',
  },
  {
    id: 'rev-3',
    name: 'Karthik Raman',
    city: 'Chennai',
    rating: 5,
    product: 'Custom Cork Board with Travel Map',
    review: 'We use it to pin photos from our trips across India. The print on the natural cork texture is very clean and the pins hold firmly without crumbling.',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 'rev-4',
    name: 'Pooja Verma',
    city: 'Delhi NCR',
    rating: 5,
    product: 'Solid Wood Photo Frame Set (3 Pcs)',
    review: 'Packing was bubble-wrapped with heavy corner protectors. Glass arrived completely safe. Great value for money compared to local framing shops.',
    verified: true,
    date: '3 weeks ago',
  },
  {
    id: 'rev-5',
    name: 'Vikram Sengupta',
    city: 'Kolkata',
    rating: 5,
    product: 'Office Acrylic Name Board',
    review: 'Got our startup reception board printed with company logo and founder names. Looked very professional and neat. Received clear proof before production.',
    verified: true,
    date: '1 month ago',
  },
  {
    id: 'rev-6',
    name: 'Sneha Kulkarni',
    city: 'Pune',
    rating: 5,
    product: 'Desk Acrylic Photo Block (5x7 inch)',
    review: 'Gifted this to my sister for her birthday with a candid picture. The crystal clear 20mm thickness stands freely on the study desk. She loved it!',
    verified: true,
    date: '1 month ago',
  },
];

export const REAL_SPACES: RealSpaceItem[] = [
  {
    id: 'space-1',
    spaceType: 'Homes',
    title: 'Modern Apartment Living Rooms',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    productUsed: 'Gallery Canvas & Framed Family Art',
    description: 'Transform bare walls into warm memory showcases with balanced size layouts.',
  },
  {
    id: 'space-2',
    spaceType: 'Offices',
    title: 'Corporate Workspaces & Boardrooms',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    productUsed: 'Acrylic Logos, Brand Values & Mission Walls',
    description: 'Reinforce brand culture and welcoming entry experiences for clients and team members.',
  },
  {
    id: 'space-3',
    spaceType: 'Restaurants',
    title: 'Cafes, Lounges & Dining Spaces',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    productUsed: 'Themed Food Photography & Wall Murals',
    description: 'Durable wipe-clean acrylic and textured art prints that enhance dining ambience.',
  },
  {
    id: 'space-4',
    spaceType: 'Hotels',
    title: 'Boutique Hotels & Reception Lobbies',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    productUsed: 'Indian Heritage Art & Regional Scenery',
    description: 'Large format multi-panel canvases custom sized to fit wide headboards and lobbies.',
  },
  {
    id: 'space-5',
    spaceType: 'Studios',
    title: 'Creative Agencies & Design Studios',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    productUsed: 'Custom Cork Pinboards & Modular Hexagons',
    description: 'Functional moodboards and project pin surfaces that keep creative teams inspired.',
  },
  {
    id: 'space-6',
    spaceType: 'Retail Spaces',
    title: 'Retail Stores & Showroom Displays',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    productUsed: 'High-Impact Acrylic Signs & Promotional Posters',
    description: 'Vivid point-of-sale branding that catches eyes from store entrances.',
  },
];
