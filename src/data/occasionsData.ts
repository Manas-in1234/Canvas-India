export interface OccasionDef {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  bannerImage: string;
  tint: string; // tailwind gradient "from-[#hex]/85" class used over the banner
  accent: string; // hex color for badges/CTAs on the banner
  categorySlugs: string[]; // which product categories are relevant to this occasion
}

const u = (id: string, w: number) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=80`;

export const OCCASIONS: OccasionDef[] = [
  {
    slug: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    tagline: 'Custom photo canvases and acrylic prints to celebrate another trip around the sun',
    bannerImage: u('photo-1513151233558-d860c5398176', 1600),
    tint: 'from-[#EC4899]/90',
    accent: '#EC4899',
    categorySlugs: ['canvas', 'acrylic'],
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
    categorySlugs: ['scenery-landscape-art', 'tribal-ethnic-art', 'line-art', 'devotional-art'],
  },
  {
    slug: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    tagline: 'Festive devotional art and motivational prints to light up the season',
    bannerImage: u('photo-1605721911519-3dfeb3be25e7', 1600),
    tint: 'from-[#EA580C]/90',
    accent: '#EA580C',
    categorySlugs: ['devotional-art', 'motivational-posters'],
  },
  {
    slug: 'corporate-gifts',
    name: 'Corporate Gifts',
    emoji: '🎁',
    tagline: 'Premium acrylic plaques and motivational prints for offices and teams',
    bannerImage: u('photo-1497215728101-856f4ea42174', 1600),
    tint: 'from-[#0F766E]/90',
    accent: '#0F766E',
    categorySlugs: ['acrylic', 'motivational-posters'],
  },
];

export const getOccasionBySlug = (slug: string | undefined): OccasionDef | undefined =>
  OCCASIONS.find((o) => o.slug === slug);
