// ============================================================================
// ACRYLIC CUSTOMIZER — LIVE CLIPART ASSETS & 12 CATEGORIES
// Fully functional vector-based visual clipart with clean SVG paths
// ============================================================================

export interface ClipartItem {
  id: string;
  name: string;
  category: string;
  svgPath: string;
  viewBox: string;
  defaultColor: string;
}

export const CLIPART_CATEGORY_NAMES = [
  'Celebration',
  'Love',
  'Wedding',
  'Birthday',
  'Family',
  'Travel',
  'Nature',
  'Business',
  'Motivation',
  'Festivals',
  'Kids',
  'Decorative'
] as const;

export type ClipartCategoryName = typeof CLIPART_CATEGORY_NAMES[number];

export const CLIPART_ITEMS: ClipartItem[] = [
  // 1. CELEBRATION
  { id: 'clip-celeb-poppers', name: 'Party Popper', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#E8752A', svgPath: '<path fill="currentColor" d="M2.5 19.5l4-1.5 2 2-6-0.5zm7-4.5l-3-3 10-7 2 2-9 8zm8-7.5l2-2m-4 0l1-2m3 4l2-1m-7 5l1 2m3-1l2 2m-1-4l2 1m-10-8l1 1m-3 2l2-1m6 10l-1 2m3-1l1 2m-5-2l-1 2"/>' },
  { id: 'clip-celeb-champagne', name: 'Champagne Toast', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M7 2v6c0 1.9 1.3 3.5 3.1 3.9L9 19H7v2h6v-2h-2l-1.1-7.1C11.7 11.5 13 9.9 13 8V2H7zm4 6c0 .6-.4 1-1 1s-1-.4-1-1V4h2v4zm7-4l-1.5 3.5L13 9l3.5 1.5L18 14l1.5-3.5L23 9l-3.5-1.5L18 4z"/>' },
  { id: 'clip-celeb-confetti', name: 'Confetti Burst', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#3B82F6', svgPath: '<path fill="currentColor" d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm6 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 13l1 2.5 2.5 1-2.5 1L5 20l-1-2.5L1.5 16.5l2.5-1L5 13z"/>' },
  { id: 'clip-celeb-fireworks', name: 'Fireworks Spark', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#EC4899', svgPath: '<path fill="currentColor" d="M12 1v4m0 14v4M1 12h4m14 0h4M4.2 4.2l2.8 2.8m10 10l2.8 2.8M4.2 19.8l2.8-2.8m10-10l2.8-2.8M12 8a4 4 0 100 8 4 4 0 000-8z"/>' },
  { id: 'clip-celeb-ribbon', name: 'Celebration Ribbon', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#10B981', svgPath: '<path fill="currentColor" d="M12 2C8.7 2 6 4.7 6 8c0 2.2 1.2 4.1 3 5.1V22l3-2 3 2v-8.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>' },
  { id: 'clip-celeb-garland', name: 'Party Garland', category: 'Celebration', viewBox: '0 0 24 24', defaultColor: '#8B5CF6', svgPath: '<path fill="currentColor" d="M2 4c5 3 15 3 20 0v2c-5 3-15 3-20 0V4zm2 5l3 6 3-6H4zm7 0l3 6 3-6h-6zm7 0l3 6 3-6h-6z"/>' },

  // 2. LOVE
  { id: 'clip-love-heart-solid', name: 'Classic Heart', category: 'Love', viewBox: '0 0 24 24', defaultColor: '#EF4444', svgPath: '<path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' },
  { id: 'clip-love-two-hearts', name: 'Intertwined Hearts', category: 'Love', viewBox: '0 0 24 24', defaultColor: '#F43F5E', svgPath: '<path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-6 13.5l-.5.45C6.1 13.4 4 11.1 4 8.5 4 6.5 5.5 5 7.5 5c1.5 0 3 1 3.5 2.4h2C13.5 6 15 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.6-2.1 4.9-6 8.45l-.5-.45-1.5 1.5-1.5-1.5z"/>' },
  { id: 'clip-love-infinity', name: 'Infinity Love', category: 'Love', viewBox: '0 0 24 24', defaultColor: '#E11D48', svgPath: '<path fill="currentColor" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.33 5.33 0 005.4 6.62C2.42 6.62 0 9.04 0 12.02s2.42 5.4 5.4 5.4c1.44 0 2.8-.56 3.77-1.53L12 13.06l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.98 0 5.4-2.42 5.4-5.4s-2.42-5.4-5.4-5.4zm-13.2 8.8c-1.87 0-3.4-1.53-3.4-3.4s1.53-3.4 3.4-3.4c.9 0 1.76.36 2.4 1l2.4 2.4-2.4 2.4c-.64.64-1.5 1-2.4 1zm13.2 0c-.9 0-1.76-.36-2.4-1l-2.4-2.4 2.4-2.4c.64-.64 1.5-1 2.4-1 1.87 0 3.4 1.53 3.4 3.4s-1.53 3.4-3.4 3.4z"/>' },
  { id: 'clip-love-rose', name: 'Blooming Rose', category: 'Love', viewBox: '0 0 24 24', defaultColor: '#BE123C', svgPath: '<path fill="currentColor" d="M12 2C9.5 2 7.5 3.8 7.1 6.1 6.5 6 5.8 6 5 6.4c-1.6.8-2.3 2.8-1.5 4.4.4.9 1.2 1.5 2.1 1.8-.4 1.3-.2 2.7.6 3.8 1.4 1.9 4.1 2.2 5.9.8.3-.2.6-.5.8-.8v5.6h2v-5.6c1.6.5 3.3.1 4.5-1.1 1.6-1.6 1.7-4.1.3-5.8.5-.8.7-1.7.5-2.6-.4-1.8-2-3.1-3.9-3.1-.3 0-.6 0-.9.1C14.7 3.1 13.4 2 12 2z"/>' },
  { id: 'clip-love-envelope', name: 'Love Letter', category: 'Love', viewBox: '0 0 24 24', defaultColor: '#FB7185', svgPath: '<path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2zm-8 7c-.6 0-1.2-.2-1.6-.5L4 10.8V18h16v-7.2l-6.4 4.7c-.4.3-1 .5-1.6.5z"/>' },

  // 3. WEDDING
  { id: 'clip-wed-rings', name: 'Wedding Rings', category: 'Wedding', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M9 3C5.7 3 3 5.7 3 9c0 3.3 2.7 6 6 6 1.1 0 2.1-.3 3-.8.9.5 1.9.8 3 .8 3.3 0 6-2.7 6-6s-2.7-6-6-6c-1.1 0-2.1.3-3 .8-.9-.5-1.9-.8-3-.8zm0 2c2.2 0 4 1.8 4 4 0 .4-.1.8-.2 1.2-.8-.8-1.8-1.2-2.8-1.2-2.2 0-4-1.8-4-4 0-.4.1-.8.2-1.2.8.8 1.8 1.2 2.8 1.2zm6 0c2.2 0 4 1.8 4 4s-1.8 4-4 4c-1 0-2-.4-2.8-1.2.1-.4.2-.8.2-1.2 0-2.2-1.8-4-4-4-.4 0-.8.1-1.2.2.8-.8 1.8-1.2 2.8-1.2 1 0 2 .4 2.8 1.2.8-.8 1.8-1.2 2.8-1.2z"/>' },
  { id: 'clip-wed-cake', name: 'Wedding Cake', category: 'Wedding', viewBox: '0 0 24 24', defaultColor: '#F59E0B', svgPath: '<path fill="currentColor" d="M12 2a2 2 0 00-2 2c0 .3.1.6.2.8L8 6v4h8V6l-2.2-1.2c.1-.2.2-.5.2-.8a2 2 0 00-2-2zm-6 9v5h12v-5H6zm-2 6v5h16v-5H4z"/>' },
  { id: 'clip-wed-dove', name: 'Peace Dove', category: 'Wedding', viewBox: '0 0 24 24', defaultColor: '#0EA5E9', svgPath: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.8 2.6 6.4L3 22l4.8-1.3C9.3 21.5 10.6 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm1 4l3 3-5 5-2-2 4-6zm-5 7l2 2-3 3-1-1 2-4z"/>' },
  { id: 'clip-wed-wreath', name: 'Floral Wreath', category: 'Wedding', viewBox: '0 0 24 24', defaultColor: '#10B981', svgPath: '<path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-3-10h2v4H9v-4zm4 0h2v4h-2v-4z"/>' },
  { id: 'clip-wed-bouquet', name: 'Bridal Bouquet', category: 'Wedding', viewBox: '0 0 24 24', defaultColor: '#EC4899', svgPath: '<path fill="currentColor" d="M12 2c-2 0-3.8 1-4.8 2.5C6.2 4.2 5.2 4 4 4.5 2.5 5.2 1.8 7 2.5 8.5c.4.8 1.1 1.3 2 1.5-.2.8 0 1.6.5 2.2 1 1.4 3 1.8 4.5 1l3 8.8 2-1-3-7.8c1.2.3 2.5 0 3.3-.8 1.2-1.2 1.4-3.1.5-4.5.5-.6.7-1.4.5-2.2-.4-1.5-1.8-2.5-3.3-2.5-.5 0-1 .1-1.5.3C13.2 2.6 12.6 2 12 2z"/>' },

  // 4. BIRTHDAY
  { id: 'clip-bday-cake', name: 'Birthday Cake', category: 'Birthday', viewBox: '0 0 24 24', defaultColor: '#F59E0B', svgPath: '<path fill="currentColor" d="M12 2c-.6 0-1 .4-1 1v2h2V3c0-.6-.4-1-1-1zm-4 4c-.6 0-1 .4-1 1v2h2V7c0-.6-.4-1-1-1zm8 0c-.6 0-1 .4-1 1v2h2V7c0-.6-.4-1-1-1zM4 11v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4H4zm0 8v3h16v-3H4z"/>' },
  { id: 'clip-bday-balloon', name: 'Helium Balloons', category: 'Birthday', viewBox: '0 0 24 24', defaultColor: '#EF4444', svgPath: '<path fill="currentColor" d="M12 2C8.7 2 6 4.7 6 8c0 3 2.1 5.5 5 5.9V18l-2 3h6l-2-3v-4.1c2.9-.4 5-2.9 5-5.9 0-3.3-2.7-6-6-6zm-4 7c-.6 0-1-.4-1-1 0-1.7 1.3-3 3-3 .6 0 1 .4 1 1s-.4 1-1 1c-.6 0-1 .4-1 1 0 .6-.4 1-1 1z"/>' },
  { id: 'clip-bday-cupcake', name: 'Sweet Cupcake', category: 'Birthday', viewBox: '0 0 24 24', defaultColor: '#EC4899', svgPath: '<path fill="currentColor" d="M12 2a1.5 1.5 0 00-1.5 1.5c0 .3.1.5.2.7C8.5 4.8 7 6.8 7 9c0 .6.1 1.1.3 1.6C5.5 11 4 12.3 4 14c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3 0-1.7-1.5-3-3.3-3.4.2-.5.3-1 .3-1.6 0-2.2-1.5-4.2-3.7-4.8.1-.2.2-.4.2-.7A1.5 1.5 0 0012 2zm-6 16l1.5 5h9L18 18H6z"/>' },
  { id: 'clip-bday-gift', name: 'Present Gift Box', category: 'Birthday', viewBox: '0 0 24 24', defaultColor: '#10B981', svgPath: '<path fill="currentColor" d="M20 6h-2.2c.4-.6.6-1.3.6-2 0-2.2-1.8-4-4-4-1.5 0-2.8.8-3.5 2-.6-1.2-2-2-3.5-2-2.2 0-4 1.8-4 4 0 .7.2 1.4.6 2H3c-1.1 0-2 .9-2 2v3c0 .6.4 1 1 1h1v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h1c.6 0 1-.4 1-1V8c0-1.1-.9-2-2-2zm-9-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-6 2c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 16H5v-8h6v8zm0-10H3V8h8v2zm8 10h-6v-8h6v8zm1-10h-7V8h7v2z"/>' },
  { id: 'clip-bday-hat', name: 'Party Conical Hat', category: 'Birthday', viewBox: '0 0 24 24', defaultColor: '#8B5CF6', svgPath: '<path fill="currentColor" d="M12 2a1.5 1.5 0 100 3c.2 0 .4 0 .5-.1L6 20h12L11.5 4.9c.2.1.3.1.5.1zm-4.3 16l4.3-10.8L16.3 18H7.7z"/>' },

  // 5. FAMILY
  { id: 'clip-fam-house', name: 'Home Sweet Home', category: 'Family', viewBox: '0 0 24 24', defaultColor: '#3B82F6', svgPath: '<path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>' },
  { id: 'clip-fam-tree', name: 'Family Tree', category: 'Family', viewBox: '0 0 24 24', defaultColor: '#059669', svgPath: '<path fill="currentColor" d="M12 2C8.7 2 6 4.7 6 8c0 1.9.9 3.6 2.3 4.7L7 20h4v2h2v-2h4l-1.3-7.3C17.1 11.6 18 9.9 18 8c0-3.3-2.7-6-6-6zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>' },
  { id: 'clip-fam-paw', name: 'Pet Pawprint', category: 'Family', viewBox: '0 0 24 24', defaultColor: '#D97706', svgPath: '<path fill="currentColor" d="M12 13c-2.2 0-4 1.8-4 4 0 1.5 1 2.8 2.4 3.2l1.6 1.8 1.6-1.8C15 19.8 16 18.5 16 17c0-2.2-1.8-4-4-4zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>' },
  { id: 'clip-fam-babyfeet', name: 'Baby Feet', category: 'Family', viewBox: '0 0 24 24', defaultColor: '#06B6D4', svgPath: '<path fill="currentColor" d="M8 9c-1.7 0-3 1.8-3 4 0 2.2 1.3 4 3 4s3-1.8 3-4c0-2.2-1.3-4-3-4zm-2-4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm2.5-1c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm2.5 1c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm6 4c-1.7 0-3 1.8-3 4 0 2.2 1.3 4 3 4s3-1.8 3-4c0-2.2-1.3-4-3-4z"/>' },

  // 6. TRAVEL
  { id: 'clip-trv-plane', name: 'Airplane Jet', category: 'Travel', viewBox: '0 0 24 24', defaultColor: '#0284C7', svgPath: '<path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.8-.7-1.5-1.5-1.5S10 2.7 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>' },
  { id: 'clip-trv-compass', name: 'Compass Rose', category: 'Travel', viewBox: '0 0 24 24', defaultColor: '#D97706', svgPath: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm2.1-12.9L8.4 9.9l2.8 5.7 5.7-2.8-2.8-5.7zm-.9 3.9a1 1 0 11-1.4-1.4 1 1 0 011.4 1.4z"/>' },
  { id: 'clip-trv-globe', name: 'World Globe', category: 'Travel', viewBox: '0 0 24 24', defaultColor: '#10B981', svgPath: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm7.9 9h-3.2c-.2-2.3-.9-4.4-1.9-6.1 2.3 1.2 4.1 3.4 5.1 6.1zM12 4.1c1.2 1.8 2 4.1 2.2 6.9H9.8c.2-2.8 1-5.1 2.2-6.9zm-6.8 6.9h3.2c.2-2.3.9-4.4 1.9-6.1-2.3 1.2-4.1 3.4-5.1 6.1zm0 2c1 2.7 2.8 4.9 5.1 6.1-1-1.7-1.7-3.8-1.9-6.1H5.2zm6.8 6.9c-1.2-1.8-2-4.1-2.2-6.9h4.4c-.2 2.8-1 5.1-2.2 6.9zm2.8-1.8c1-1.7 1.7-3.8 1.9-6.1h3.2c-1 2.7-2.8 4.9-5.1 6.1z"/>' },
  { id: 'clip-trv-mountain', name: 'Mountain Peaks', category: 'Travel', viewBox: '0 0 24 24', defaultColor: '#6366F1', svgPath: '<path fill="currentColor" d="M14 6l-4 6-2-3-6 9h20l-8-12zm0 3.8l4.8 7.2H5.2l3-4.5 2 3 3.8-5.7z"/>' },

  // 7. NATURE
  { id: 'clip-nat-monstera', name: 'Monstera Leaf', category: 'Nature', viewBox: '0 0 24 24', defaultColor: '#15803D', svgPath: '<path fill="currentColor" d="M17 2c-3.9 0-7 3.1-7 7 0 .5.1 1 .2 1.5C8.4 11.2 7 12.9 7 15c0 2.8 2.2 5 5 5h2v2h2v-2h1c3.3 0 6-2.7 6-6 0-3.3-2.7-6-6-6zm0 10h-2V9c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3z"/>' },
  { id: 'clip-nat-sun', name: 'Radiant Sun', category: 'Nature', viewBox: '0 0 24 24', defaultColor: '#F59E0B', svgPath: '<path fill="currentColor" d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0-5v3m0 14v3m10-10h-3M5 12H2m15.1-7.1l-2.1 2.1M9 15l-2.1 2.1m10.2 0l-2.1-2.1M9 9L6.9 6.9"/>' },
  { id: 'clip-nat-butterfly', name: 'Monarch Butterfly', category: 'Nature', viewBox: '0 0 24 24', defaultColor: '#A855F7', svgPath: '<path fill="currentColor" d="M12 5c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1s1-.4 1-1V6c0-.6-.4-1-1-1zm-2 2C7 7 4 9 4 12c0 2.5 2 4.5 4.5 4.5.5 0 1-.1 1.5-.3V7zm4 0v9.2c.5.2 1 .3 1.5.3 2.5 0 4.5-2 4.5-4.5 0-3-3-5-6-5z"/>' },
  { id: 'clip-nat-flower', name: 'Blossom Daisy', category: 'Nature', viewBox: '0 0 24 24', defaultColor: '#EC4899', svgPath: '<path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm0-6a3 3 0 00-3 3c0 1.2.7 2.2 1.7 2.7.4-.4.8-.6 1.3-.7V3a1 1 0 011-1 1 1 0 011 1v4c.5.1.9.3 1.3.7 1-.5 1.7-1.5 1.7-2.7a3 3 0 00-3-3zm-6 7a3 3 0 00-3 3 3 3 0 003 3c1.2 0 2.2-.7 2.7-1.7-.4-.4-.6-.8-.7-1.3H3a1 1 0 01-1-1 1 1 0 011-1h4c.1-.5.3-.9.7-1.3-.5-1-1.5-1.7-2.7-1.7zm12 0c-1.2 0-2.2.7-2.7 1.7.4.4.6.8.7 1.3h4a1 1 0 011 1 1 1 0 01-1 1h-4c-.1.5-.3.9-.7 1.3.5 1 1.5 1.7 2.7 1.7a3 3 0 003-3 3 3 0 00-3-3z"/>' },

  // 8. BUSINESS
  { id: 'clip-biz-trophy', name: 'Excellence Trophy', category: 'Business', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.8 2.2 5 5 5h.4c.8 1.4 2.2 2.4 3.8 2.8V18H9v2h6v-2h-3.2v-2.2c1.6-.4 3-1.4 3.8-2.8H16c2.8 0 5-2.2 5-5V7c0-1.1-.9-2-2-2zM5 8V7h2v3.8C5.8 10.4 5 9.3 5 8zm14 0c0 1.3-.8 2.4-2 2.8V7h2v1z"/>' },
  { id: 'clip-biz-badge', name: 'Certified Seal', category: 'Business', viewBox: '0 0 24 24', defaultColor: '#0E4A93', svgPath: '<path fill="currentColor" d="M12 2l2.4 2.6 3.5-.4 1.1 3.3 3.3 1.1-.4 3.5L24 14.5l-2.6 2.4.4 3.5-3.3 1.1-1.1 3.3-3.5-.4L12 26.8l-2.4-2.6-3.5.4-1.1-3.3-3.3-1.1.4-3.5L0 14.5l2.6-2.4-.4-3.5 3.3-1.1 1.1-3.3 3.5.4L12 2zm-1.5 13.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z"/>' },
  { id: 'clip-biz-chart', name: 'Growth Arrow', category: 'Business', viewBox: '0 0 24 24', defaultColor: '#10B981', svgPath: '<path fill="currentColor" d="M3.5 18.5L2 17l7-7 4 4 6.5-6.5L21 9V3h-6l2.5 2.5-7 7-4-4-3 3z"/>' },
  { id: 'clip-biz-briefcase', name: 'Executive Suite', category: 'Business', viewBox: '0 0 24 24', defaultColor: '#475569', svgPath: '<path fill="currentColor" d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-2h4v2h-4V4zm10 15H4V8h16v11z"/>' },

  // 9. MOTIVATION
  { id: 'clip-mot-star', name: 'Shining Star', category: 'Motivation', viewBox: '0 0 24 24', defaultColor: '#F59E0B', svgPath: '<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>' },
  { id: 'clip-mot-crown', name: 'Victory Crown', category: 'Motivation', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>' },
  { id: 'clip-mot-spark', name: 'Lightning Energy', category: 'Motivation', viewBox: '0 0 24 24', defaultColor: '#EAB308', svgPath: '<path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/>' },
  { id: 'clip-mot-target', name: 'Focus Bullseye', category: 'Motivation', viewBox: '0 0 24 24', defaultColor: '#DC2626', svgPath: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0-14c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>' },

  // 10. FESTIVALS
  { id: 'clip-fest-diya', name: 'Diwali Diya Lamp', category: 'Festivals', viewBox: '0 0 24 24', defaultColor: '#EA580C', svgPath: '<path fill="currentColor" d="M12 2c-.5 1-2 2.5-2 4.5 0 1.4 1 2.5 2 2.5s2-1.1 2-2.5C14 4.5 12.5 3 12 2zm-8 9c0 4.4 3.6 8 8 8s8-3.6 8-8H4zm8 10c-2.8 0-5.1-.9-7-2.3v1.3c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-1.3c-1.9 1.4-4.2 2.3-7 2.3z"/>' },
  { id: 'clip-fest-tree', name: 'Holiday Pine Tree', category: 'Festivals', viewBox: '0 0 24 24', defaultColor: '#16A34A', svgPath: '<path fill="currentColor" d="M12 2L6 10h3l-4 6h5l-3 4h12l-3-4h5l-4-6h3L12 2zm-1 20h2v2h-2v-2z"/>' },
  { id: 'clip-fest-crescent', name: 'Eid Crescent & Star', category: 'Festivals', viewBox: '0 0 24 24', defaultColor: '#0D9488', svgPath: '<path fill="currentColor" d="M12.3 2a10 10 0 003.5 19.4 10 10 0 01-3.5-19.4zm5.7 4.5l.8 1.8 1.9.3-1.4 1.3.3 1.9-1.6-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3z"/>' },
  { id: 'clip-fest-mandala', name: 'Rangoli Mandala', category: 'Festivals', viewBox: '0 0 24 24', defaultColor: '#D946EF', svgPath: '<path fill="currentColor" d="M12 2l2 4 4-2-2 4 4 2-4 2 2 4-4-2-2 4-2-4-4 2 2-4-4-2 4-2-2-4 4 2zm0 6a4 4 0 100 8 4 4 0 000-8z"/>' },

  // 11. KIDS
  { id: 'clip-kids-teddy', name: 'Teddy Bear', category: 'Kids', viewBox: '0 0 24 24', defaultColor: '#B45309', svgPath: '<path fill="currentColor" d="M4.5 4a2.5 2.5 0 00-1.8 4.2C3.3 9.4 4 10.9 4.3 12.5c-.8.8-1.3 2-1.3 3.5 0 2.8 2.2 5 5 5h8c2.8 0 5-2.2 5-5 0-1.5-.5-2.7-1.3-3.5.3-1.6 1-3.1 1.6-4.3A2.5 2.5 0 0019.5 4c-1.4 0-2.5 1.1-2.5 2.5 0 .4.1.7.2 1-1.4-.9-3.2-1.5-5.2-1.5s-3.8.6-5.2 1.5c.1-.3.2-.6.2-1C7 5.1 5.9 4 4.5 4zM9 11a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>' },
  { id: 'clip-kids-duck', name: 'Rubber Ducky', category: 'Kids', viewBox: '0 0 24 24', defaultColor: '#EAB308', svgPath: '<path fill="currentColor" d="M18.5 7C17.7 7 17 7.7 17 8.5c0 .2 0 .4.1.6L14 9c0-2.8-2.2-5-5-5S4 6.2 4 9c0 1.2.4 2.3 1.1 3.1C3.8 13.2 3 14.8 3 16.5 3 19.5 5.5 22 8.5 22h7c3 0 5.5-2.5 5.5-5.5 0-1.9-.9-3.5-2.3-4.5.2-.5.3-1 .3-1.5 0-.8-.7-1.5-1.5-1.5zM7 8a1 1 0 110 2 1 1 0 010-2z"/>' },
  { id: 'clip-kids-cloud', name: 'Happy Cloud', category: 'Kids', viewBox: '0 0 24 24', defaultColor: '#38BDF8', svgPath: '<path fill="currentColor" d="M19.4 10c-.7-3.4-3.8-6-7.4-6-2.9 0-5.4 1.7-6.6 4.2C2.4 8.7 0 11.1 0 14c0 3.3 2.7 6 6 6h13c2.8 0 5-2.2 5-5 0-2.6-2-4.8-4.6-5zm-9.4 4a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm-4.5 2c.4.6 1.4 1 2.5 1s2.1-.4 2.5-1h-5z"/>' },
  { id: 'clip-kids-bottle', name: 'Baby Bottle', category: 'Kids', viewBox: '0 0 24 24', defaultColor: '#F472B6', svgPath: '<path fill="currentColor" d="M13 2h-2v2H9v2h6V4h-2V2zm3 6H8v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V8zm-2 4h-4v-1h4v1zm0 3h-4v-1h4v1zm0 3h-4v-1h4v1z"/>' },

  // 12. DECORATIVE
  { id: 'clip-dec-flourish', name: 'Corner Flourish', category: 'Decorative', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M2 2v6c0 4.4 3.6 8 8 8h6v-2h-6c-3.3 0-6-2.7-6-6V2H2zm8 0v4c0 2.2 1.8 4 4 4h4V8h-4c-1.1 0-2-.9-2-2V2h-2z"/>' },
  { id: 'clip-dec-sparkle', name: 'Crystal Sparkle', category: 'Decorative', viewBox: '0 0 24 24', defaultColor: '#38BDF8', svgPath: '<path fill="currentColor" d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>' },
  { id: 'clip-dec-diamond', name: 'Precious Gem', category: 'Decorative', viewBox: '0 0 24 24', defaultColor: '#0EA5E9', svgPath: '<path fill="currentColor" d="M16 2H8L2 8l10 14L22 8l-6-6zm-1.1 2l3.6 3.6H14V4h.9zM9.1 4H10v3.6H5.5L9.1 4zm-4.3 6h4.5l-4.5 6.7V10zm6.2 0h2l-1 8.8L11 10zm3.7 0h4.5v6.7L14.7 10z"/>' },
  { id: 'clip-dec-botanical', name: 'Botanical Sprig', category: 'Decorative', viewBox: '0 0 24 24', defaultColor: '#059669', svgPath: '<path fill="currentColor" d="M17 2c-3.9 0-7 3.1-7 7 0 .5.1 1 .2 1.5C8.4 11.2 7 12.9 7 15c0 2.8 2.2 5 5 5h2v2h2v-2h1c3.3 0 6-2.7 6-6 0-3.3-2.7-6-6-6zm0 10h-2V9c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3z"/>' },
  { id: 'clip-dec-laurel', name: 'Laurel Branch', category: 'Decorative', viewBox: '0 0 24 24', defaultColor: '#D4AF37', svgPath: '<path fill="currentColor" d="M7 2a4 4 0 00-4 4c0 1.8 1.2 3.3 2.8 3.8-.4.7-.8 1.5-1 2.4C3.8 12.1 3 12 2 12c-1.1 0-2 .9-2 2s.9 2 2 2c1.3 0 2.3-.3 3.2-.8.5 1.5 1.4 2.8 2.6 3.8-1 .3-1.8.8-2.3 1.6-.9 1.3-.6 3.1.7 4 1.3.9 3.1.6 4-.7.6-.8.7-1.8.4-2.8 1.8.9 3.9 1.4 6.2 1.4v-2c-4.4 0-8-3.6-8-8 0-1.8.6-3.5 1.6-4.8.9.5 2 .8 3.2.8 2.2 0 4-1.8 4-4s-1.8-4-4-4c-1.4 0-2.6.7-3.3 1.8C9.5 2.6 8.3 2 7 2z"/>' }
];
