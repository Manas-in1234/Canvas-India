import { Product } from '../types';

/**
 * Captured catalog images live in Front-end/src/assets/products/cork/
 * and are served from /assets/products/cork/ (copied into public/, filenames unchanged).
 *
 * The Cork Yoga Wellness Product Catalogue 2026 does not include retail prices.
 * price/originalPrice use the existing productsApi missing-price fallback (999)
 * with discountPercent 0 so they are not presented as catalog sale prices.
 */
const CORK_PRICE_FALLBACK = 999;

export const CORK_PRODUCT_IMAGES: Record<string, string[]> = {
  '9C-YA1': [
    '/assets/products/cork/9C-YA1/9c-ya1(1).png',
    '/assets/products/cork/9C-YA1/9c-ya1(2).png',
  ],
  '9C-YA2': [
    '/assets/products/cork/9C-YA2/9C-YA2(1).png',
    '/assets/products/cork/9C-YA2/9C-YA2(2).png',
  ],
  '9C-YA3': [
    '/assets/products/cork/9C-YA3/9C-YA3(1).png',
    '/assets/products/cork/9C-YA3/9C-YA3(2).png',
  ],
  '9C-YA4': [
    '/assets/products/cork/9C-YA4/9C-YA4(1).png',
    '/assets/products/cork/9C-YA4/9C-YA4(2).png',
  ],
  '9C-YA5': [
    '/assets/products/cork/9C-YA5/9C-YA5(1).png',
    '/assets/products/cork/9C-YA5/9C-YA5(2).png',
  ],
  '9C-YA6': [
    '/assets/products/cork/9C-YA6/9C-YA6(1).png',
    '/assets/products/cork/9C-YA6/9C-YA6(2).png',
  ],
  '9C-YA7': [
    '/assets/products/cork/9C-YA7/9C-YA7(1).png',
    '/assets/products/cork/9C-YA7/9C-YA7(2).png',
  ],
  '9C-YA8': ['/assets/products/cork/9C-YA8/9C-YA8.png'],
  '9C-YA9': ['/assets/products/cork/9C-YA9/9C-YA9.png'],
  '9C-YA10': [
    '/assets/products/cork/9C-YA10/9C-YA10(1).png',
    '/assets/products/cork/9C-YA10/9C-YA10(2).png',
  ],
  '9C-YA11': [
    '/assets/products/cork/9C-YA11/9C-YA11(1).png',
    '/assets/products/cork/9C-YA11/9C-YA11(2).png',
  ],
  '9C-YA12': [
    '/assets/products/cork/9C-YA12/9C-YA12(1).png',
    '/assets/products/cork/9C-YA12/9C-YA12(2).png',
  ],
  '9C-YB1': ['/assets/products/cork/9C-YB1/9C-YB1.png'],
  '9C-YB2': ['/assets/products/cork/9C-YB2/9C-YB2.png'],
  '9C-YB3': [
    '/assets/products/cork/9C-YB3/9C-YB3(1).png',
    '/assets/products/cork/9C-YB3/9C-YB3(2).png',
  ],
};

const CORK_IDS = [
  'cork-9c-ya1',
  'cork-9c-ya2',
  'cork-9c-ya3',
  'cork-9c-ya4',
  'cork-9c-ya5',
  'cork-9c-ya6',
  'cork-9c-ya7',
  'cork-9c-ya8',
  'cork-9c-ya9',
  'cork-9c-ya10',
  'cork-9c-ya11',
  'cork-9c-ya12',
  'cork-9c-yb1',
  'cork-9c-yb2',
  'cork-9c-yb3',
] as const;

type CorkProductInput = Omit<
  Product,
  | 'id'
  | 'category'
  | 'categorySlug'
  | 'image'
  | 'images'
  | 'price'
  | 'originalPrice'
  | 'compareAtPrice'
  | 'discountPercent'
  | 'rating'
  | 'reviewsCount'
  | 'badge'
  | 'customizable'
  | 'customizationAvailable'
  | 'uploadRequired'
  | 'relatedProductIds'
  | 'stockStatus'
  | 'finishes'
> & {
  code: keyof typeof CORK_PRODUCT_IMAGES;
  finishes?: string[];
};

function corkProduct(input: CorkProductInput): Product {
  const images = CORK_PRODUCT_IMAGES[input.code];
  const id = `cork-${input.code.toLowerCase()}`;
  const { code, finishes, ...rest } = input;
  return {
    ...rest,
    id,
    category: 'Cork',
    categorySlug: 'cork',
    image: images[0],
    images,
    price: CORK_PRICE_FALLBACK,
    originalPrice: CORK_PRICE_FALLBACK,
    compareAtPrice: CORK_PRICE_FALLBACK,
    discountPercent: 0,
    rating: null,
    reviewsCount: 0,
    badge: 'New',
    finishes: finishes ?? ['Natural Cork'],
    customizable: false,
    customizationAvailable: false,
    uploadRequired: false,
    stockStatus: 'In Stock',
    relatedProductIds: CORK_IDS.filter((otherId) => otherId !== id),
    tags: Array.from(new Set([...(rest.tags || []), 'cork', code.toLowerCase(), code])),
  };
}

export const CORK_CATALOG_PRODUCTS: Product[] = [
  corkProduct({
    code: '9C-YA1',
    name: 'Yoga Mat Cork Fabric with EVA 5mm',
    slug: 'yoga-mat-cork-fabric-with-eva-5mm',
    subcategory: 'Yoga Mats',
    description:
      'Yoga mat in cork fabric with EVA, 5mm. Designed for yoga practice. Made from cork fabric with EVA foam. The catalog lists it as lightweight and eco friendly. Cork fabric + EVA mats are described as dual-side usage with enhanced grip, soft touch fabric with superior foam cushioning, water-resistant, and lightweight.',
    shortDescription: 'Cork fabric + EVA yoga mat, 5mm. Lightweight; eco friendly. 6 × 2 feet.',
    material: 'Cork Fabric + EVA',
    sizes: ['6 × 2 feet'],
    availableSizes: ['6 × 2 feet'],
    features: [
      'Light Weight',
      'Eco Friendly',
      'Dual-side Usage',
      'Enhanced Grip',
      'Soft Touch Fabric with Superior Foam Cushioning',
      'Water-resistant, lightweight',
    ],
    tags: ['cork', 'yoga mat', 'eva', '9c-ya1'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA2',
    name: 'Yoga Mat Cork Fabric with Latex 5mm',
    slug: 'yoga-mat-cork-fabric-with-latex-5mm',
    subcategory: 'Yoga Mats',
    description:
      'Yoga mat in cork fabric with latex, 5mm. Made from cork fabric with latex. Catalog properties: soft touch and extra cushioning. Marked 100% sustainable and eco friendly.',
    shortDescription: 'Cork fabric + latex yoga mat, 5mm. Soft touch; extra cushioning. 6 × 2 feet.',
    material: 'Cork Fabric + Latex',
    sizes: ['6 × 2 feet'],
    availableSizes: ['6 × 2 feet'],
    features: [
      'Soft Touch',
      'Extra cushioning',
      '100% sustainable and eco friendly',
    ],
    tags: ['cork', 'yoga mat', 'latex', '9c-ya2'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA3',
    name: 'Yoga Mat Fully Rubberized 3mm',
    slug: 'yoga-mat-fully-rubberized-3mm',
    subcategory: 'Yoga Mats',
    description:
      'Fully rubberized yoga mat, 3mm. Catalog properties: enhanced grip and reversible. Size 6 × 2 feet. Marked 100% sustainable and eco friendly. Fully rubberized cork yoga mats are listed for dual-side usage and enhanced grip.',
    shortDescription: 'Fully rubberized 3mm yoga mat. Enhanced grip; reversible. 6 × 2 feet.',
    material: 'Fully Rubberized Cork',
    sizes: ['6 × 2 feet'],
    availableSizes: ['6 × 2 feet'],
    features: [
      'Enhanced Grip',
      'Reversible',
      'Dual-side Usage',
      '100% sustainable and eco friendly',
    ],
    tags: ['cork', 'yoga mat', 'rubberized', '9c-ya3'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA4',
    name: 'Yoga Mat 1.5mm Rubberized with Latex',
    slug: 'yoga-mat-1-5mm-rubberized-with-latex',
    subcategory: 'Yoga Mats',
    description:
      'Yoga mat, 1.5mm, rubberized with latex. Catalog properties: anti microbial, anti skid, extra grip, extra cushioning. Marked 100% sustainable and eco friendly. Cork rubberized + latex yoga mats are listed as anti-skid, extra grip, superior cushioning, and ideal for joint support.',
    shortDescription: '1.5mm rubberized-with-latex yoga mat. Anti microbial; anti skid; extra grip and cushioning.',
    material: 'Cork Rubberized + Latex',
    sizes: ['24*72 inch', '30*72 inch'],
    availableSizes: ['24*72 inch', '30*72 inch'],
    features: [
      'Anti Microbial',
      'Anti Skid',
      'Extra Grip',
      'Extra Cushioning',
      'Superior cushioning',
      'Ideal for joint support',
      '100% sustainable and eco friendly',
    ],
    tags: ['cork', 'yoga mat', 'latex', 'rubberized', '9c-ya4'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA5',
    name: 'Cork Yoga Brick',
    slug: 'cork-yoga-brick',
    subcategory: 'Yoga Bricks',
    description:
      'Cork yoga brick for yoga practice. Provides stability in balance poses. Cork is firmer and more durable than foam. Preferred for restorative and Iyengar yoga.',
    shortDescription: 'Cork yoga brick. Firmer and more durable than foam; for balance, restorative, and Iyengar yoga.',
    material: 'Natural Cork',
    sizes: ['9 x 5 x 3 inches', '9 x 6 x 4 inches'],
    availableSizes: ['9 x 5 x 3 inches', '9 x 6 x 4 inches'],
    features: [
      'Stability in balance poses',
      'Cork is firmer & more durable than foam',
      'Preferred for restorative and Iyengar yoga',
    ],
    tags: ['cork', 'yoga brick', '9c-ya5'],
    applications: ['Balance poses', 'Restorative yoga', 'Iyengar yoga'],
  }),
  corkProduct({
    code: '9C-YA6',
    name: 'Cork Yoga Roller',
    slug: 'cork-yoga-roller',
    subcategory: 'Yoga Rollers',
    description:
      'Cork yoga roller. Firmer and longer lasting. Ideal for deep tissue massage. Eco-friendly and chemical-free.',
    shortDescription: 'Cork yoga roller for deep tissue massage. Firmer, longer lasting, eco-friendly and chemical-free.',
    material: 'Natural Cork',
    sizes: ['DIA 85 mm × L 300 mm', 'DIA 100 mm × L 300 mm'],
    availableSizes: ['DIA 85 mm × L 300 mm', 'DIA 100 mm × L 300 mm'],
    features: [
      'Firmer and longer lasting',
      'Ideal for deep tissue massage',
      'Eco-friendly and chemical-free',
    ],
    tags: ['cork', 'yoga roller', '9c-ya6'],
    applications: ['Deep tissue massage', 'Yoga'],
  }),
  corkProduct({
    code: '9C-YA7',
    name: 'Cork Yoga Ball',
    slug: 'cork-yoga-ball',
    subcategory: 'Yoga Balls',
    description:
      'Cork yoga ball. Superior grip and control. Natural texture enhances effectiveness. Non-toxic, firm, and long-lasting.',
    shortDescription: 'Cork yoga ball with superior grip and control. Non-toxic, firm, and long-lasting.',
    material: 'Natural Cork',
    sizes: ['55 mm dia', '65 mm dia'],
    availableSizes: ['55 mm dia', '65 mm dia'],
    features: [
      'Superior grip and control',
      'Natural texture enhances effectiveness',
      'Non-toxic, firm, and long-lasting',
    ],
    tags: ['cork', 'yoga ball', '9c-ya7'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA8',
    name: 'Cork Yoga Wedge',
    slug: 'cork-yoga-wedge',
    subcategory: 'Yoga Wedges',
    description:
      'Cork yoga wedge. Provides wrist and ankle support during yoga. Helps reduce strain and discomfort. Improves alignment and stability. Enhances balance in challenging poses. Natural non-slip cork surface. Durable, lightweight, and sustainable.',
    shortDescription: 'Cork yoga wedge for wrist and ankle support, alignment, and balance. Natural non-slip cork surface.',
    material: 'Natural Cork',
    sizes: ['L 8" × B 6.5" × T 3"'],
    availableSizes: ['L 8" × B 6.5" × T 3"'],
    features: [
      'Provides wrist and ankle support during yoga',
      'Helps reduce strain and discomfort',
      'Improves alignment and stability',
      'Enhances balance in challenging poses',
      'Natural non-slip cork surface',
      'Durable, lightweight, and sustainable',
    ],
    tags: ['cork', 'yoga wedge', '9c-ya8'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YA9',
    name: 'Cork Massage Roller Set',
    slug: 'cork-massage-roller-set',
    subcategory: 'Massage Sets',
    description:
      'Cork massage roller set. Includes: 1 cork roller (DIA 100 mm, L 300 mm); 1 cork massage ball (DIA 55); 1 cork storage roller (L 12 × D 4 inches). Helps relieve muscle tension and soreness. Improves blood circulation. Supports post-workout recovery. Suitable for trigger point and myofascial release. Lightweight, durable, and eco-friendly.',
    shortDescription: 'Set with cork roller, massage ball, and storage roller for muscle recovery and myofascial release.',
    material: 'Natural Cork',
    sizes: [
      '1 Cork Roller (DIA 100 mm, L 300 mm)',
      '1 Cork Massage Ball (DIA 55)',
      '1 Cork Storage Roller (L 12 × D 4 inches)',
    ],
    availableSizes: [
      '1 Cork Roller (DIA 100 mm, L 300 mm)',
      '1 Cork Massage Ball (DIA 55)',
      '1 Cork Storage Roller (L 12 × D 4 inches)',
    ],
    features: [
      'Helps relieve muscle tension and soreness',
      'Improves blood circulation',
      'Supports post-workout recovery',
      'Suitable for trigger point and myofascial release',
      'Lightweight, durable, and eco-friendly',
    ],
    tags: ['cork', 'massage set', 'roller', '9c-ya9'],
    applications: ['Post-workout recovery', 'Trigger point and myofascial release'],
  }),
  corkProduct({
    code: '9C-YA10',
    name: 'Cork Foot Massage Ball Set',
    slug: 'cork-foot-massage-ball-set',
    subcategory: 'Massage Sets',
    description:
      'Cork foot massage ball set. Helps relieve muscle tension and soreness. Improves blood circulation. Supports post-workout recovery. Suitable for trigger point and myofascial release. Lightweight, durable, and eco-friendly.',
    shortDescription: 'Cork foot massage ball set for muscle tension, circulation, and post-workout recovery.',
    material: 'Natural Cork',
    sizes: ['Standard'],
    availableSizes: ['Standard'],
    features: [
      'Helps relieve muscle tension and soreness',
      'Improves blood circulation',
      'Supports post-workout recovery',
      'Suitable for trigger point and myofascial release',
      'Lightweight, durable, and eco-friendly',
    ],
    tags: ['cork', 'foot massage', 'massage ball', '9c-ya10'],
    applications: ['Foot massage', 'Post-workout recovery', 'Trigger point and myofascial release'],
  }),
  corkProduct({
    code: '9C-YA11',
    name: 'Cork Yoga Knee Pad (Rubberized with Latex)',
    slug: 'cork-yoga-knee-pad-rubberized-with-latex',
    subcategory: 'Knee Pads',
    description:
      'Cork yoga knee pad, rubberized with latex. Provides cushioning and support for knees, elbows, wrists, and forearms. Helps reduce pressure and discomfort during yoga practice. Natural cork surface offers excellent grip and stability. Lightweight, durable, and easy to carry. Moisture-resistant and easy to clean. Sustainable, non-toxic, and eco-friendly.',
    shortDescription: 'Cork yoga knee pad, rubberized with latex. Cushioning for knees, elbows, wrists, and forearms.',
    material: 'Cork Yoga Knee Pad (Rubberized with Latex)',
    sizes: ['L 24" × B 12" × T 0.5 MM'],
    availableSizes: ['L 24" × B 12" × T 0.5 MM'],
    features: [
      'Provides cushioning and support for knees, elbows, wrists, and forearms',
      'Helps reduce pressure and discomfort during yoga practice',
      'Natural cork surface offers excellent grip and stability',
      'Lightweight, durable, and easy to carry',
      'Moisture-resistant and easy to clean',
      'Sustainable, non-toxic, and eco-friendly',
    ],
    tags: ['cork', 'knee pad', 'latex', '9c-ya11'],
    applications: ['Yoga practice'],
  }),
  corkProduct({
    code: '9C-YA12',
    name: 'Cork Yoga Peanut',
    slug: 'cork-yoga-peanut',
    subcategory: 'Yoga Rollers',
    description:
      'Cork yoga peanut. Relieves muscle tension and knots. Safely massages muscles along the spine. Releases trigger points and fascia. Improves flexibility and mobility. Enhances blood circulation. Aids post-workout recovery. Helps reduce neck, back, and shoulder stiffness. Supports better posture. Made from natural, eco-friendly cork. Durable, non-slip, antimicrobial, and easy to clean.',
    shortDescription: 'Cork yoga peanut for muscle tension, spinal massage, trigger points, and recovery.',
    material: 'Natural Cork',
    sizes: ['DIA 80 mm × L 170 mm'],
    availableSizes: ['DIA 80 mm × L 170 mm'],
    features: [
      'Relieves muscle tension and knots',
      'Safely massages muscles along the spine',
      'Releases trigger points and fascia',
      'Improves flexibility and mobility',
      'Enhances blood circulation',
      'Aids post-workout recovery',
      'Helps reduce neck, back, and shoulder stiffness',
      'Supports better posture',
      'Made from natural, eco-friendly cork',
      'Durable, non-slip, antimicrobial, and easy to clean',
    ],
    tags: ['cork', 'yoga peanut', '9c-ya12'],
    applications: ['Yoga', 'Post-workout recovery'],
  }),
  corkProduct({
    code: '9C-YB1',
    name: 'Cork Yoga Bag 1',
    slug: 'cork-yoga-bag-1',
    subcategory: 'Yoga Bags',
    description: 'Cork Yoga Bag 1. Product code 9C-YB1.',
    shortDescription: 'Cork Yoga Bag 1 (9C-YB1).',
    sizes: ['Standard'],
    availableSizes: ['Standard'],
    tags: ['cork', 'yoga bag', '9c-yb1'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YB2',
    name: 'Cork Yoga Bag 2',
    slug: 'cork-yoga-bag-2',
    subcategory: 'Yoga Bags',
    description: 'Cork Yoga Bag 2. Product code 9C-YB2.',
    shortDescription: 'Cork Yoga Bag 2 (9C-YB2).',
    sizes: ['Standard'],
    availableSizes: ['Standard'],
    tags: ['cork', 'yoga bag', '9c-yb2'],
    applications: ['Yoga'],
  }),
  corkProduct({
    code: '9C-YB3',
    name: 'Premium Yoga Kit Bag',
    slug: 'premium-yoga-kit-bag',
    subcategory: 'Yoga Bags',
    description: 'Premium Yoga Kit Bag. Product code 9C-YB3.',
    shortDescription: 'Premium Yoga Kit Bag (9C-YB3).',
    sizes: ['Standard'],
    availableSizes: ['Standard'],
    tags: ['cork', 'yoga bag', 'kit bag', '9c-yb3'],
    applications: ['Yoga'],
  }),
];
