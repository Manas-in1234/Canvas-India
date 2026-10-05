import { Product, CategoryConfig } from '../types';
import { CORK_CATALOG_PRODUCTS } from './corkCatalog';
import { CATALOGUE_PRODUCTS } from './catalogueProducts';
import { CATALOGUE_CANVAS_ACRYLIC_PRODUCTS } from './catalogueCanvasAcrylicProducts';

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  canvas: {
    id: 'canvas',
    slug: 'canvas',
    title: 'Canvas Frames',
    shortTitle: 'Canvas',
    seoTitle: 'Canvas Frames | Canvas India',
    description: 'Bring photographs, artwork, memories, and creative designs to life with premium canvas frames.',
    heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Photo Canvas',
      'Family & Personal Photos',
      'Wedding & Celebration Memories',
      'Artistic Reproductions',
      'Nature & Landscape',
      'Motivational & Inspirational',
      'Religious & Spiritual',
      'Corporate Canvas',
      'Hotel & Hospitality Décor',
      'Restaurant & Café Décor',
      'Bedroom Décor',
      'Living Room Décor',
      'Customized Canvas Gifts'
    ],
    features: [
      '380 GSM archival cotton canvas',
      'Kiln-dried sturdy pine wood stretcher bars',
      '12-color fade-resistant pigment printing',
      'Ready-to-hang with pre-installed hardware'
    ],
    ctaText: 'Custom Size Canvas',
    ctaType: 'customize'
  },
  acrylic: {
    id: 'acrylic',
    slug: 'acrylic',
    title: 'Acrylic Prints & Acrylic Wall Art',
    shortTitle: 'Acrylic',
    seoTitle: 'Acrylic Prints & Wall Art | Canvas India',
    description: 'For a modern, elegant and premium appearance, acrylic prints provide sharp imagery and vibrant visual impact.',
    heroImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Acrylic Photo Panels',
      'Acrylic Wall Art',
      'Acrylic Posters',
      'Acrylic Artwork',
      'Acrylic Signage',
      'Decorative Acrylic Panels',
      'Corporate Acrylic',
      'Office Graphics',
      'Reception Artwork',
      'Retail Displays',
      'Restaurant Décor',
      'Hotel Décor',
      'Inspirational Acrylic',
      'Customized Acrylic Gifts'
    ],
    features: [
      '5mm ultra-clear cast acrylic glass',
      'Sub-surface direct UV printing',
      'Precision diamond-polished beveled edges',
      'Stainless steel floating mounting standoffs'
    ],
    ctaText: 'Design Acrylic Print',
    ctaType: 'customize'
  },
  posters: {
    id: 'posters',
    slug: 'posters',
    title: 'Posters & Custom Wall Graphics',
    shortTitle: 'Posters & Wall Graphics',
    seoTitle: 'Posters & Custom Wall Graphics | Canvas India',
    description: 'Custom posters and wall graphics designed to transform the personality of residential and commercial spaces.',
    heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Home Posters',
      'Bedroom Posters',
      'Living Room Posters',
      'Kids Room Posters',
      'Office Posters',
      'Gym Posters',
      'Fitness Posters',
      'School & Institution Posters',
      'Restaurant Posters',
      'Café Posters',
      'Retail Posters',
      'Hotel Posters',
      'Event Posters',
      'Exhibition Graphics',
      'Custom Wall Graphics'
    ],
    features: [
      '300 GSM heavyweight premium paper',
      'Anti-glare matte & high-sheen satin finishes',
      'Fade-proof pigment inks',
      'Optional solid wood framing & mount borders'
    ],
    ctaText: 'Create Custom Poster',
    ctaType: 'customize'
  },
  cork: {
    id: 'cork',
    slug: 'cork',
    title: 'Cork Yoga & Wellness Products',
    shortTitle: 'Cork Products',
    seoTitle: 'Cork Yoga & Wellness Products | Canvas India',
    description: 'Eco-friendly cork yoga and wellness products. Cork is renewable, harvested from the bark of cork oak trees every 9–12 years. Lightweight, water-resistant, and durable. Naturally antimicrobial and biodegradable.',
    heroImage: '/assets/products/cork/9C-YA1/9c-ya1(1).png',
    subcategories: [
      'All',
      'Yoga Mats',
      'Yoga Bricks',
      'Yoga Rollers',
      'Yoga Balls',
      'Yoga Wedges',
      'Massage Sets',
      'Knee Pads',
      'Yoga Bags'
    ],
    features: [
      'Improves grip when wet',
      'Durable and long-lasting',
      'Eco-friendly and sustainable',
      'Antimicrobial (no odor buildup)',
      'Hypoallergenic and chemical-free'
    ],
    ctaText: 'Shop Cork Yoga Products',
    ctaType: 'shop'
  },
  'yoga-fitness': {
    id: 'yoga-fitness',
    slug: 'yoga-fitness',
    title: 'Yoga Mats & Fitness Products',
    shortTitle: 'Yoga & Fitness',
    seoTitle: 'Yoga Mats & Fitness Products | Canvas India',
    description: 'Yoga mats and customized fitness products designed for yoga studios, gyms, wellness centers, corporate wellness programs, events and personal use.',
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Yoga Mats',
      'Customized Yoga Mats',
      'Branded Yoga Mats',
      'Gym Products',
      'Wellness Products',
      'Corporate Wellness',
      'Event Fitness Products',
      'Promotional Fitness Products',
      'Personalized Fitness Gifts'
    ],
    features: [
      'Eco-friendly non-slip natural rubber & suede top',
      'High-resolution permanent dye-sublimation print',
      'Laser alignment guides & customized monogramming',
      'Washable, sweat-absorbent & travel-friendly'
    ],
    ctaText: 'Custom Branded Mats',
    ctaType: 'quote'
  },
  'home-decor': {
    id: 'home-decor',
    slug: 'home-decor',
    title: 'Home Décor Collection',
    shortTitle: 'Home Décor',
    seoTitle: 'Home Décor | Canvas India',
    description: 'Decorative and personalized products designed to add beauty, warmth and individuality to interiors.',
    heroImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Canvas Wall Art',
      'Acrylic Artwork',
      'Posters',
      'Photo Décor',
      'Cork Décor',
      'Inspirational Wall Art',
      'Personalized Artwork',
      'Decorative Panels',
      'Customized Wall Displays',
      'Kids Room Décor',
      'Bedroom Décor',
      'Living Room Décor',
      'Office Décor'
    ],
    features: [
      'Curated coordinated gallery wall collections',
      'Matching palette for modern Indian interiors',
      'Handcrafted solid wood and floater frame options',
      'Personalized with your family moments'
    ],
    ctaText: 'Explore Home Collections',
    ctaType: 'shop'
  },
  'custom-prints': {
    id: 'custom-prints',
    slug: 'custom-prints',
    title: 'Custom Prints',
    shortTitle: 'Custom Prints',
    seoTitle: 'Custom Prints | Canvas India',
    description: 'Create products based on your own design, size, material, quantity and finishing requirements.',
    heroImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Custom Canvas',
      'Custom Acrylic',
      'Custom Posters',
      'Custom Cork',
      'Custom Photo Prints',
      'Custom Wall Graphics',
      'Custom Artwork',
      'Custom Branding',
      'Upload Your Design'
    ],
    features: [
      'Step-by-step interactive customizer',
      'Direct photo & vector artwork upload',
      'Custom millimetre dimensions supported',
      'Instant online 3D finish preview'
    ],
    ctaText: 'Launch Customizer',
    ctaType: 'customize'
  },
  gifts: {
    id: 'gifts',
    slug: 'gifts',
    title: 'Gifts & Occasions',
    shortTitle: 'Gifts & Occasions',
    seoTitle: 'Personalized Gifts & Occasions | Canvas India',
    description: 'Thoughtfully personalized gifts and commemorative prints for every celebration and festive milestone.',
    heroImage: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Birthday',
      'Anniversary',
      'Wedding',
      'Housewarming',
      "Valentine's Day",
      "Mother's Day",
      "Father's Day",
      'Festivals',
      'Diwali',
      'Personalized Gifts',
      'Photo Gifts',
      'Corporate Gifts'
    ],
    features: [
      'Gift packaging with personalized greeting card',
      'Direct recipient doorstep dispatch with tracking',
      'Special couple and milestone formats',
      'Express priority dispatch available'
    ],
    ctaText: 'Shop Gifts by Occasion',
    ctaType: 'shop'
  },
  'bulk-order': {
    id: 'bulk-order',
    slug: 'bulk-order',
    title: 'Bulk Order Inquiries & Volume Production',
    shortTitle: 'Bulk Order',
    seoTitle: 'Bulk Orders & Wholesale Printing | Canvas India',
    description: 'Volume manufacturing and custom print production for events, institutions, studios, and businesses.',
    heroImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Bulk Canvas Orders',
      'Bulk Acrylic Orders',
      'Bulk Posters',
      'Bulk Cork Products',
      'Bulk Yoga Mats',
      'Bulk Décor',
      'Event Orders',
      'Promotional Orders'
    ],
    features: [
      'Tiered wholesale pricing for 20+ units',
      'Official GST invoicing with 18% input tax credit',
      'Pan-India multi-location drop shipping',
      'Digital proof approval before mass printing'
    ],
    ctaText: 'Request Bulk Quote',
    ctaType: 'quote'
  },
  'corporate-orders': {
    id: 'corporate-orders',
    slug: 'corporate-orders',
    title: 'Corporate & Commercial Décor',
    shortTitle: 'Corporate Orders',
    seoTitle: 'Corporate & Commercial Décor | Canvas India',
    description: 'Customized décor and visual products for businesses looking to create attractive and engaging environments.',
    heroImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    subcategories: [
      'All',
      'Corporate Wall Art',
      'Brand Graphics',
      'Motivational Artwork',
      'Acrylic Panels',
      'Office Posters',
      'Office Décor',
      'Reception Artwork',
      'Employee Recognition Displays',
      'Meeting Room Graphics',
      'Training Room Décor',
      'Brand-Focused Wall Installations'
    ],
    features: [
      'Strict adherence to corporate brand guidelines & Pantone colors',
      'Reception, boardroom & training facility packages',
      'Employee onboarding milestone awards & welcome kits',
      'Dedicated enterprise project manager'
    ],
    ctaText: 'Request Corporate Quote',
    ctaType: 'quote'
  },
  'wall-art': {
    id: 'wall-art',
    slug: 'wall-art',
    title: 'Wall Art',
    shortTitle: 'Wall Art',
    seoTitle: 'Wall Art Prints | Canvas India',
    description: 'Curated statement wall art across canvas, acrylic and poster formats — botanical sets, Indian folk motifs, and modern abstract designs.',
    heroImage: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1200&auto=format&fit=crop&q=80',
    subcategories: ['All'],
    features: [
      'Curated across canvas, acrylic and poster materials',
      'Gallery wall sets and standalone statement pieces',
      'Ready to hang with mounting hardware included'
    ],
    ctaText: 'Shop Wall Art',
    ctaType: 'shop'
  },
  'photo-frames': {
    id: 'photo-frames',
    slug: 'photo-frames',
    title: 'Photo Frames',
    shortTitle: 'Photo Frames',
    seoTitle: 'Photo Frames | Canvas India',
    description: 'Framed prints across our catalog — solid wood and metal frame finishes for canvas, cork and poster prints.',
    heroImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&auto=format&fit=crop&q=80',
    subcategories: ['All'],
    features: [
      'Solid wood and anodized metal frame options',
      'Shatterproof mounting glass where applicable',
      'Ready-to-hang mounting hardware included'
    ],
    ctaText: 'Shop Photo Frames',
    ctaType: 'shop'
  },
  'devotional-art': {
    id: 'devotional-art',
    slug: 'devotional-art',
    title: 'Devotional Art',
    shortTitle: 'Devotional Art',
    seoTitle: 'Devotional Art Prints | Canvas India',
    description: 'God, spiritual and religious print art for home shrines, pooja rooms and devotional corners.',
    heroImage: '/assets/catalogue/devotional-art/G-A_002.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Devotional Art',
    ctaType: 'shop'
  },
  'scenery-landscape-art': {
    id: 'scenery-landscape-art',
    slug: 'scenery-landscape-art',
    title: 'Scenery & Landscape Art',
    shortTitle: 'Scenery & Landscape',
    seoTitle: 'Scenery & Landscape Art Prints | Canvas India',
    description: 'Nature, seascape and landscape print art to bring the outdoors onto your walls.',
    heroImage: '/assets/catalogue/scenery-landscape-art/S-A_011.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Scenery & Landscape Art',
    ctaType: 'shop'
  },
  'tribal-ethnic-art': {
    id: 'tribal-ethnic-art',
    slug: 'tribal-ethnic-art',
    title: 'Tribal & Ethnic Art',
    shortTitle: 'Tribal & Ethnic Art',
    seoTitle: 'Tribal & Ethnic Art Prints | Canvas India',
    description: 'Aboriginal, tribal and ethnic-pattern print art with bold, earthy character.',
    heroImage: '/assets/catalogue/tribal-ethnic-art/A-A_007.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Tribal & Ethnic Art',
    ctaType: 'shop'
  },
  'line-art': {
    id: 'line-art',
    slug: 'line-art',
    title: 'Line Art',
    shortTitle: 'Line Art',
    seoTitle: 'Line Art Prints | Canvas India',
    description: 'Minimal monochrome line-art prints for a clean, modern wall.',
    heroImage: '/assets/catalogue/line-art/L-A_011.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Line Art',
    ctaType: 'shop'
  },
  'motivational-posters': {
    id: 'motivational-posters',
    slug: 'motivational-posters',
    title: 'Motivational Posters',
    shortTitle: 'Motivational Posters',
    seoTitle: 'Motivational Posters | Canvas India',
    description: 'Motivational quote and typography posters for home, office and study spaces.',
    heroImage: '/assets/catalogue/motivational-posters/M-A_031.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Motivational Posters',
    ctaType: 'shop'
  },
  'cork-art-patterns': {
    id: 'cork-art-patterns',
    slug: 'cork-art-patterns',
    title: 'Cork Art Patterns',
    shortTitle: 'Cork Art Patterns',
    seoTitle: 'Cork Art Pattern Prints | Canvas India',
    description: 'Textured cork-finish pattern prints, from geometric motifs to natural wood-grain designs.',
    heroImage: '/assets/catalogue/cork-art-patterns/C-A_004.jpg',
    subcategories: ['All'],
    features: [
      'Premium archival print quality',
      'Available across canvas, acrylic and poster formats',
      'Custom sizes on request'
    ],
    ctaText: 'Shop Cork Art Patterns',
    ctaType: 'shop'
  }
};

export const ALL_PRODUCTS: Product[] = [
  // ==========================================
  // Print World Catalogue — 300 products across 6 new categories
  // ==========================================
  ...CATALOGUE_PRODUCTS,

  // ==========================================
  // Print World Catalogue designs (non-cork), also offered as Canvas and
  // Acrylic products — 550 products (275 designs x 2 materials)
  // ==========================================
  ...CATALOGUE_CANVAS_ACRYLIC_PRODUCTS,

];

export const ALL_CATALOG_PRODUCTS: Product[] = ALL_PRODUCTS;

