export interface OccasionDef {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  bannerImage: string;
  tint: string; // tailwind gradient "from-[#hex]/85" class used over the banner
  accent: string; // hex color for badges/CTAs on the banner
  categorySlugs: string[]; // which product categories are relevant to this occasion
  tileImages?: Record<string, string>; // optional per-category photo override for the format tiles
}

const u = (id: string, w: number) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

export const OCCASIONS: OccasionDef[] = [
  {
    slug: 'mothers-day',
    name: "Mother's Day",
    emoji: '💐',
    tagline: 'Heartfelt photo prints and keepsakes to thank mom for everything',
    bannerImage: u('photo-1589169011402-8b2cbd1ee593', 1600),
    tint: 'from-[#DB2777]/90',
    accent: '#DB2777',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'brothers-day',
    name: "Brother's Day",
    emoji: '🧡',
    tagline: 'Fun, personalized prints celebrating the sibling bond',
    bannerImage: u('photo-1605713288610-00c1c630ca1e', 1600),
    tint: 'from-[#2563EB]/90',
    accent: '#2563EB',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'fathers-day',
    name: "Father's Day",
    emoji: '👔',
    tagline: 'Custom canvases and plaques to honor dad',
    bannerImage: u('photo-1560328055-e938bb2ed50a', 1600),
    tint: 'from-[#1D4ED8]/90',
    accent: '#1D4ED8',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'friendship-day',
    name: 'Friendship Day',
    emoji: '🤝',
    tagline: 'Photo prints and frames for your favorite people',
    bannerImage: u('photo-1582298538104-fe2e74c27f59', 1600),
    tint: 'from-[#F59E0B]/90',
    accent: '#F59E0B',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'teachers-day',
    name: "Teacher's Day",
    emoji: '🍎',
    tagline: 'Thoughtful personalized gifts to thank the teachers who shaped you',
    bannerImage: u('photo-1509062522246-3755977927d7', 1600),
    tint: 'from-[#065F46]/90',
    accent: '#065F46',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'childrens-day',
    name: "Children's Day",
    emoji: '🎈',
    tagline: 'Playful photo prints and decor for the little ones',
    bannerImage: u('photo-1502086223501-7ea6ecd79368', 1600),
    tint: 'from-[#F97316]/90',
    accent: '#F97316',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'mens-day',
    name: "Men's Day",
    emoji: '🧔',
    tagline: 'Sharp, personalized prints and plaques for the men in your life',
    bannerImage: u('photo-1557862921-37829c790f19', 1600),
    tint: 'from-[#334155]/90',
    accent: '#334155',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'new-year',
    name: 'New Year',
    emoji: '🎆',
    tagline: 'Fresh starts deserve fresh wall art — personalized prints for the year ahead',
    bannerImage: u('photo-1560986752-2e31d9507413', 1600),
    tint: 'from-[#7C3AED]/90',
    accent: '#7C3AED',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'republic-day',
    name: 'Republic Day',
    emoji: '🇮🇳',
    tagline: 'Patriotic prints and tricolor-inspired decor for the occasion',
    bannerImage: u('photo-1597058712635-3182d1eacc1e', 1600),
    tint: 'from-[#1E3A8A]/90',
    accent: '#1E3A8A',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'valentines-day',
    name: "Valentine's Day",
    emoji: '❤️',
    tagline: 'Romantic photo prints and keepsakes for the one you love',
    bannerImage: u('photo-1518709779341-56cf4535e94b', 1600),
    tint: 'from-[#DC2626]/90',
    accent: '#DC2626',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'womens-day',
    name: "Women's Day",
    emoji: '👑',
    tagline: 'Bold, personalized prints celebrating the women who inspire you',
    bannerImage: u('photo-1747264464985-2bc2e20c739e', 1600),
    tint: 'from-[#9333EA]/90',
    accent: '#9333EA',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    tagline: 'Custom photo canvases and acrylic prints to celebrate another trip around the sun',
    bannerImage: '/assets/occasions/birthday-banner.png',
    tint: 'from-[#EC4899]/90',
    accent: '#EC4899',
    categorySlugs: ['canvas', 'acrylic'],
    tileImages: {
      canvas: '/assets/occasions/birthday-cakesmash.png',
      acrylic: '/assets/occasions/birthday-dino.png',
    },
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    emoji: '💞',
    tagline: 'Romantic photo prints and keepsakes to celebrate every milestone together',
    bannerImage: u('photo-1518199266791-5375a83190b7', 1600),
    tint: 'from-[#E11D48]/90',
    accent: '#E11D48',
    categorySlugs: ['canvas', 'acrylic'],
    tileImages: {
      canvas: '/assets/occasions/anniversary-beach.png',
      acrylic: '/assets/occasions/anniversary-dinner.png',
    },
  },
  {
    slug: 'wedding',
    name: 'Wedding',
    emoji: '💍',
    tagline: 'Grand canvas portraits and acrylic keepsakes for your big day',
    bannerImage: u('photo-1519741497674-611481863552', 1600),
    tint: 'from-[#7C3AED]/90',
    accent: '#7C3AED',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'housewarming',
    name: 'Housewarming',
    emoji: '🏡',
    tagline: 'Wall art and decor pieces to make a new house feel like home',
    bannerImage: u('photo-1560448204-e02f11c3d0e2', 1600),
    tint: 'from-[#0E4A93]/90',
    accent: '#0E4A93',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    tagline: 'Festive devotional art and motivational prints to light up the season',
    bannerImage: u('photo-1605721911519-3dfeb3be25e7', 1600),
    tint: 'from-[#EA580C]/90',
    accent: '#EA580C',
    categorySlugs: ['canvas', 'acrylic'],
  },
  {
    slug: 'festive-offers',
    name: 'Festive Offers',
    emoji: '✨',
    tagline: 'Up to 20% off + free shipping on ₹999+ — festive devotional art, posters and more',
    bannerImage: u('photo-1577083753695-e010191bacb5', 1600),
    tint: 'from-[#9A3412]/90',
    accent: '#E8752A',
    categorySlugs: [], // Festive Offers uses the "Shop by Festival" grid instead of format tiles
  },
];

export const getOccasionBySlug = (slug: string | undefined): OccasionDef | undefined =>
  OCCASIONS.find((o) => o.slug === slug);
