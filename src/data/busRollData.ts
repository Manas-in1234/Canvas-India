// ============================================================================
// BUS ROLL DATA & CENTRALIZED CONFIGURATION
// Centralized definitions for Bus Roll lines, patterns, backgrounds, and templates
// ============================================================================

export interface BusRollLine {
  id: string;
  text: string;
  color: string;
  opacity: number; // 1 = 100%, 0.75 = 75%, 0.5 = 50%
}

export type BusRollFontStyle = 'Normal' | 'Bold' | 'Italic' | 'Bold Italic';

export interface BusRollFontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
}

export interface BusRollPattern {
  id: string;
  name: string;
  svgDefs: string; // Inner SVG pattern definitions
  patternWidth: number;
  patternHeight: number;
  previewSvg: string; // Standalone preview SVG data
}

export interface BusRollBackground {
  id: string;
  name: string;
  hex: string;
  isGradient?: boolean;
  gradientCss?: string;
  category: 'dark' | 'neutral' | 'vibrant' | 'earth';
}

export interface BusRollTemplate {
  id: string;
  title: string;
  category: 'Family' | 'Bus Roll' | 'Food and Drink' | 'Holiday' | 'Inspirational';
  lines: BusRollLine[];
  backgroundColor: string;
  patternId: string;
  patternOpacity: number;
  fontFamily: string;
  fontStyle: BusRollFontStyle;
  lineSpacing: number; // inches
  margin: number; // inches
  widthInches: number;
  heightInches: number;
}

export interface BusRollConfig {
  lines: BusRollLine[];
  lineSpacing: number; // 0.5", 0.75", 1", 1.25", 1.5", 2" (default 1")
  margin: number; // 1", 1.5", 2", 2.5", 3" (default 2.5")
  widthInches: number; // default 21"
  heightInches: number; // default 32"
  fontFamily: string;
  fontStyle: BusRollFontStyle;
  backgroundColor: string;
  patternId: string;
  patternOpacity: number;
  templateId?: string;
}

// ----------------------------------------------------------------------------
// 1. FONTS (Modern typography with safe standard fallbacks)
// ----------------------------------------------------------------------------
export const BUS_ROLL_FONTS: BusRollFontOption[] = [
  { id: 'font-aller', name: 'Aller / Poppins', fontFamily: 'Poppins, -apple-system, sans-serif', category: 'sans-serif' },
  { id: 'font-inter', name: 'Inter', fontFamily: 'Inter, -apple-system, sans-serif', category: 'sans-serif' },
  { id: 'font-manrope', name: 'Manrope', fontFamily: 'Manrope, sans-serif', category: 'sans-serif' },
  { id: 'font-montserrat', name: 'Montserrat', fontFamily: 'Montserrat, sans-serif', category: 'sans-serif' },
  { id: 'font-bebas', name: 'Bebas Neue / Transit', fontFamily: '"Bebas Neue", Impact, sans-serif', category: 'display' },
  { id: 'font-playfair', name: 'Playfair Display', fontFamily: '"Playfair Display", Georgia, serif', category: 'serif' },
  { id: 'font-cormorant', name: 'Cormorant Garamond', fontFamily: '"Cormorant Garamond", serif', category: 'serif' },
  { id: 'font-rockwell', name: 'Rockwell / Slab', fontFamily: 'Rockwell, "Roboto Slab", serif', category: 'serif' },
  { id: 'font-arial', name: 'Arial Black', fontFamily: '"Arial Black", Arial, sans-serif', category: 'sans-serif' },
  { id: 'font-georgia', name: 'Georgia', fontFamily: 'Georgia, serif', category: 'serif' },
  { id: 'font-courier', name: 'Courier Prime', fontFamily: '"Courier New", monospace', category: 'monospace' }
];

export const BUS_ROLL_FONT_STYLES: BusRollFontStyle[] = ['Normal', 'Bold', 'Italic', 'Bold Italic'];

export const BUS_ROLL_LINE_SPACINGS = [0.5, 0.75, 1, 1.25, 1.5, 2];
export const BUS_ROLL_MARGINS = [1, 1.5, 2, 2.5, 3];
export const BUS_ROLL_WIDTHS = [8, 10, 12, 16, 20, 21, 24, 30, 36];

// ----------------------------------------------------------------------------
// 2. BACKGROUNDS (Solid colors, neutrals, rich tones & gradients)
// ----------------------------------------------------------------------------
export const BUS_ROLL_BACKGROUNDS: BusRollBackground[] = [
  // Dark & Rich (Screenshot match: Deep Purple #6B2D5C)
  { id: 'bg-deep-purple', name: 'Deep Purple (Classic)', hex: '#6B2D5C', category: 'dark' },
  { id: 'bg-dark-charcoal', name: 'Dark Charcoal', hex: '#1E293B', category: 'dark' },
  { id: 'bg-classic-black', name: 'Classic Transit Black', hex: '#111827', category: 'dark' },
  { id: 'bg-midnight-navy', name: 'Midnight Navy', hex: '#0F172A', category: 'dark' },
  { id: 'bg-vintage-maroon', name: 'Vintage Maroon', hex: '#5B1824', category: 'dark' },
  { id: 'bg-forest-green', name: 'Forest Green', hex: '#143823', category: 'dark' },
  { id: 'bg-warm-walnut', name: 'Warm Walnut', hex: '#3B2219', category: 'dark' },
  { id: 'bg-slate-gray', name: 'Slate Gray', hex: '#334155', category: 'dark' },

  // Vibrant / Studio
  { id: 'bg-crimson', name: 'Royal Crimson', hex: '#7F1D1D', category: 'vibrant' },
  { id: 'bg-indigo', name: 'Deep Indigo', hex: '#312E81', category: 'vibrant' },
  { id: 'bg-teal', name: 'Peacock Teal', hex: '#134E4A', category: 'vibrant' },
  { id: 'bg-burnt-amber', name: 'Burnt Amber', hex: '#78350F', category: 'vibrant' },

  // Neutrals / Light
  { id: 'bg-parchment', name: 'Vintage Parchment', hex: '#F5EBE1', category: 'neutral' },
  { id: 'bg-soft-cream', name: 'Soft Cream', hex: '#FDFBF7', category: 'neutral' },
  { id: 'bg-studio-white', name: 'Studio White', hex: '#FFFFFF', category: 'neutral' },
  { id: 'bg-soft-gray', name: 'Mist Gray', hex: '#E2E8F0', category: 'neutral' }
];

// Curated preset line text colors
export const BUS_ROLL_TEXT_COLOR_PALETTES = [
  '#FFFFFF', // Pure White
  '#FFF7D6', // Soft Cream
  '#FFA64D', // Radiant Orange
  '#FFD6C2', // Soft Peach
  '#FFFF99', // Pale Lemon
  '#FEF08A', // Warm Yellow
  '#F43F5E', // Rose Pink
  '#38BDF8', // Sky Blue
  '#4ADE80', // Mint Green
  '#E2E8F0', // Pale Slate
  '#1E293B', // Charcoal
  '#0F172A'  // Deep Navy
];

// ----------------------------------------------------------------------------
// 3. PATTERNS (16 Geometric & Transit patterns matching the 4x4 screenshot grid)
// ----------------------------------------------------------------------------
export const BUS_ROLL_PATTERNS: BusRollPattern[] = [
  // 1. Diamonds / Argyle
  {
    id: 'diamonds',
    name: 'Argyle Diamonds',
    patternWidth: 40,
    patternHeight: 60,
    svgDefs: `
      <path d="M20 0 L40 30 L20 60 L0 30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M0 0 L40 60 M40 0 L0 60" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M0 0 L40 40 M40 0 L0 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2,2"/></svg>`
  },
  // 2. Checkered / Large Squares
  {
    id: 'squares',
    name: 'Checkered Squares',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <rect x="0" y="0" width="20" height="20" fill="currentColor"/>
      <rect x="20" y="20" width="20" height="20" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><rect x="0" y="0" width="20" height="20" fill="currentColor"/><rect x="20" y="20" width="20" height="20" fill="currentColor"/></svg>`
  },
  // 3. Plaid / Tartan
  {
    id: 'plaid',
    name: 'Tartan Plaid',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <rect x="0" y="0" width="40" height="40" fill="none"/>
      <path d="M0 10 H40 M0 30 H40 M10 0 V40 M30 0 V40" stroke="currentColor" stroke-width="4"/>
      <path d="M0 20 H40 M20 0 V40" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0 10 H40 M0 30 H40 M10 0 V40 M30 0 V40" stroke="currentColor" stroke-width="4"/><path d="M0 20 H40 M20 0 V40" stroke="currentColor" stroke-width="1.5"/></svg>`
  },
  // 4. Geometric Triangles
  {
    id: 'geo-triangles',
    name: 'Geometric Triangles',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <polygon points="0,0 40,0 20,20" fill="currentColor"/>
      <polygon points="0,40 40,40 20,20" fill="currentColor" opacity="0.6"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><polygon points="0,0 40,0 20,20" fill="currentColor"/><polygon points="0,40 40,40 20,20" fill="currentColor" opacity="0.6"/></svg>`
  },
  // 5. Houndstooth
  {
    id: 'houndstooth',
    name: 'Classic Houndstooth',
    patternWidth: 32,
    patternHeight: 32,
    svgDefs: `
      <polygon points="0,0 16,0 16,16 0,16" fill="currentColor"/>
      <polygon points="16,16 32,16 32,32 16,32" fill="currentColor"/>
      <polygon points="16,0 32,16 16,16" fill="currentColor"/>
      <polygon points="0,16 16,32 0,32" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 32 32" class="w-full h-full"><polygon points="0,0 16,0 16,16 0,16" fill="currentColor"/><polygon points="16,16 32,16 32,32 16,32" fill="currentColor"/><polygon points="16,0 32,16 16,16" fill="currentColor"/></svg>`
  },
  // 6. Chevrons / Diagonal Zigzag (Default from Reference Screenshots!)
  {
    id: 'chevrons',
    name: 'Chevron Stripes',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <path d="M-10,30 L10,10 L30,30 L50,10 L50,22 L30,42 L10,22 L-10,42 Z" fill="currentColor"/>
      <path d="M-10,10 L10,-10 L30,10 L50,-10 L50,2 L30,22 L10,2 L-10,22 Z" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0,30 L10,20 L20,30 L30,20 L40,30 L40,40 L30,30 L20,40 L10,30 L0,40 Z" fill="currentColor"/><path d="M0,10 L10,0 L20,10 L30,0 L40,10 L40,20 L30,10 L20,20 L10,10 L0,20 Z" fill="currentColor"/></svg>`
  },
  // 7. Vertical Stripes
  {
    id: 'vertical-stripes',
    name: 'Vertical Stripes',
    patternWidth: 32,
    patternHeight: 32,
    svgDefs: `
      <rect x="0" y="0" width="16" height="32" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 32 32" class="w-full h-full"><rect x="0" y="0" width="16" height="32" fill="currentColor"/></svg>`
  },
  // 8. Fan / Quarter Circles
  {
    id: 'fan-arcs',
    name: 'Quarter Circle Fan',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <path d="M0,0 A20,20 0 0,1 20,20 L0,20 Z" fill="currentColor"/>
      <path d="M40,40 A20,20 0 0,1 20,20 L40,20 Z" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0,0 A20,20 0 0,1 20,20 L0,20 Z" fill="currentColor"/><path d="M40,40 A20,20 0 0,1 20,20 L40,20 Z" fill="currentColor"/></svg>`
  },
  // 9. Stars
  {
    id: 'stars',
    name: 'Transit Stars',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <polygon points="20,5 24,15 35,16 27,24 29,35 20,30 11,35 13,24 5,16 16,15" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><polygon points="20,5 24,15 35,16 27,24 29,35 20,30 11,35 13,24 5,16 16,15" fill="currentColor"/></svg>`
  },
  // 10. Triangles
  {
    id: 'triangles',
    name: 'Triangles Tile',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <polygon points="0,40 20,0 40,40" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><polygon points="0,40 20,0 40,40" fill="currentColor"/></svg>`
  },
  // 11. Bold Diagonal Stripes
  {
    id: 'bold-diagonal',
    name: 'Bold Diagonals',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <path d="M0,40 L40,0 L20,0 L0,20 Z M20,40 L40,20 L40,40 Z" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0,40 L40,0 L20,0 L0,20 Z M20,40 L40,20 L40,40 Z" fill="currentColor"/></svg>`
  },
  // 12. Horizontal Stripes
  {
    id: 'horizontal-stripes',
    name: 'Horizontal Stripes',
    patternWidth: 32,
    patternHeight: 32,
    svgDefs: `
      <rect x="0" y="0" width="32" height="16" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 32 32" class="w-full h-full"><rect x="0" y="0" width="32" height="16" fill="currentColor"/></svg>`
  },
  // 13. Scallops / Draped Arcs
  {
    id: 'scallops',
    name: 'Draped Scallops',
    patternWidth: 40,
    patternHeight: 30,
    svgDefs: `
      <path d="M0,0 Q20,30 40,0 L40,5 Q20,35 0,5 Z" fill="currentColor"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0,10 Q20,35 40,10 L40,18 Q20,43 0,18 Z" fill="currentColor"/></svg>`
  },
  // 14. Interlocking Circles
  {
    id: 'circles',
    name: 'Interlocking Rings',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="0" cy="0" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="40" cy="0" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="0" cy="40" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="40" cy="40" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="0" cy="0" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`
  },
  // 15. Moroccan Tiles / Fish Scale
  {
    id: 'moroccan',
    name: 'Moroccan Scales',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: `
      <path d="M0,20 C10,0 30,0 40,20 C30,40 10,40 0,20 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>
    `,
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><path d="M0,20 C10,0 30,0 40,20 C30,40 10,40 0,20 Z" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`
  },
  // 16. Solid / Plain (No Pattern)
  {
    id: 'solid',
    name: 'Plain / Solid',
    patternWidth: 40,
    patternHeight: 40,
    svgDefs: '',
    previewSvg: `<svg viewBox="0 0 40 40" class="w-full h-full"><rect width="40" height="40" fill="currentColor" opacity="0.3"/></svg>`
  }
];

export const getBusRollPattern = (patternId: string): BusRollPattern => {
  return BUS_ROLL_PATTERNS.find((p) => p.id === patternId) || BUS_ROLL_PATTERNS[5]; // default chevrons
};

// ----------------------------------------------------------------------------
// 4. DEFAULT TEXT LINES (From Screenshot 1)
// ----------------------------------------------------------------------------
export const DEFAULT_BUS_ROLL_LINES: BusRollLine[] = [
  { id: 'line-1', text: 'THIS HOME', color: '#FFFFFF', opacity: 1 },
  { id: 'line-2', text: 'RUNS ON', color: '#FFF7D6', opacity: 1 },
  { id: 'line-3', text: 'LOVE', color: '#FFA64D', opacity: 1 },
  { id: 'line-4', text: 'LAUGHTER', color: '#FFFFFF', opacity: 1 },
  { id: 'line-5', text: 'AND LOTS OF', color: '#FFD6C2', opacity: 1 },
  { id: 'line-6', text: 'STRONG', color: '#FFF7D6', opacity: 1 },
  { id: 'line-7', text: 'COFFEE', color: '#FFFF99', opacity: 1 }
];

export const DEFAULT_BUS_ROLL_CONFIG: BusRollConfig = {
  lines: DEFAULT_BUS_ROLL_LINES,
  lineSpacing: 1,
  margin: 2.5,
  widthInches: 21,
  heightInches: 32,
  fontFamily: 'Poppins, -apple-system, sans-serif',
  fontStyle: 'Bold',
  backgroundColor: '#6B2D5C',
  patternId: 'chevrons',
  patternOpacity: 0.22,
  templateId: 'tpl-family-coffee'
};

// ----------------------------------------------------------------------------
// 5. TEMPLATES (Family, Bus Roll, Food and Drink, Holiday, Inspirational)
// ----------------------------------------------------------------------------
export const BUS_ROLL_TEMPLATES: BusRollTemplate[] = [
  // --- FAMILY CATEGORY (Matches Screenshot 3) ---
  {
    id: 'tpl-family-coffee',
    title: 'This Home Runs On Coffee',
    category: 'Family',
    lines: [
      { id: 't1', text: 'THIS HOME', color: '#FFFFFF', opacity: 1 },
      { id: 't2', text: 'RUNS ON', color: '#FFF7D6', opacity: 1 },
      { id: 't3', text: 'LOVE', color: '#FFA64D', opacity: 1 },
      { id: 't4', text: 'LAUGHTER', color: '#FFFFFF', opacity: 1 },
      { id: 't5', text: 'AND LOTS OF', color: '#FFD6C2', opacity: 1 },
      { id: 't6', text: 'STRONG', color: '#FFF7D6', opacity: 1 },
      { id: 't7', text: 'COFFEE', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#6B2D5C',
    patternId: 'chevrons',
    patternOpacity: 0.22,
    fontFamily: 'Poppins, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-family-mom',
    title: 'Mom - Have You As A Friend',
    category: 'Family',
    lines: [
      { id: 'm1', text: "IF I DIDN'T HAVE", color: '#334155', opacity: 1 },
      { id: 'm2', text: 'YOU FOR A', color: '#475569', opacity: 1 },
      { id: 'm3', text: 'MOM', color: '#E11D48', opacity: 1 },
      { id: 'm4', text: "I'D HAVE", color: '#0284C7', opacity: 1 },
      { id: 'm5', text: 'YOU AS A', color: '#334155', opacity: 1 },
      { id: 'm6', text: 'FRIEND', color: '#E11D48', opacity: 1 }
    ],
    backgroundColor: '#FDFBF7',
    patternId: 'diamonds',
    patternOpacity: 0.08,
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1.25,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-family-dad',
    title: 'Dad - Son Hero & Daughter Love',
    category: 'Family',
    lines: [
      { id: 'd1', text: 'DAD', color: '#FFFFFF', opacity: 1 },
      { id: 'd2', text: "A SON'S FIRST", color: '#E2E8F0', opacity: 1 },
      { id: 'd3', text: 'HERO', color: '#38BDF8', opacity: 1 },
      { id: 'd4', text: "A DAUGHTER'S FIRST", color: '#E2E8F0', opacity: 1 },
      { id: 'd5', text: 'LOVE', color: '#F43F5E', opacity: 1 }
    ],
    backgroundColor: '#0F172A',
    patternId: 'squares',
    patternOpacity: 0.15,
    fontFamily: '"Bebas Neue", Impact, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-family-normal',
    title: 'Normal Family',
    category: 'Family',
    lines: [
      { id: 'n1', text: 'AS FAR', color: '#FFFFFF', opacity: 1 },
      { id: 'n2', text: 'AS ANYONE', color: '#E2E8F0', opacity: 1 },
      { id: 'n3', text: 'KNOWS', color: '#FFA64D', opacity: 1 },
      { id: 'n4', text: "WE'RE A", color: '#FFFFFF', opacity: 1 },
      { id: 'n5', text: 'NORMAL', color: '#FFD6C2', opacity: 1 },
      { id: 'n6', text: 'FAMILY', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#5B1824',
    patternId: 'plaid',
    patternOpacity: 0.18,
    fontFamily: 'Poppins, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-family-love-begins',
    title: 'Where Life Begins & Love Never Ends',
    category: 'Family',
    lines: [
      { id: 'fl1', text: 'FAMILY', color: '#FFFFFF', opacity: 1 },
      { id: 'fl2', text: 'WHERE LIFE', color: '#FFF7D6', opacity: 1 },
      { id: 'fl3', text: 'BEGINS', color: '#FFA64D', opacity: 1 },
      { id: 'fl4', text: '& LOVE', color: '#FFFFFF', opacity: 1 },
      { id: 'fl5', text: 'NEVER', color: '#FFD6C2', opacity: 1 },
      { id: 'fl6', text: 'ENDS', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#1E293B',
    patternId: 'geo-triangles',
    patternOpacity: 0.15,
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },

  // --- BUS ROLL (TRANSIT & METRO DESTINATIONS) ---
  {
    id: 'tpl-transit-london',
    title: 'London Underground Transit Scroll',
    category: 'Bus Roll',
    lines: [
      { id: 'l1', text: 'PICCADILLY CIRCUS', color: '#FFFFFF', opacity: 1 },
      { id: 'l2', text: 'COVENT GARDEN', color: '#E2E8F0', opacity: 1 },
      { id: 'l3', text: 'LEICESTER SQUARE', color: '#FFFFFF', opacity: 1 },
      { id: 'l4', text: 'TOTTENHAM COURT', color: '#E2E8F0', opacity: 1 },
      { id: 'l5', text: 'OXFORD CIRCUS', color: '#FFFFFF', opacity: 1 },
      { id: 'l6', text: 'CAMDEN TOWN', color: '#FFA64D', opacity: 1 },
      { id: 'l7', text: "KINGS CROSS", color: '#FFFFFF', opacity: 1 }
    ],
    backgroundColor: '#111827',
    patternId: 'vertical-stripes',
    patternOpacity: 0.08,
    fontFamily: '"Bebas Neue", Impact, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 0.75,
    margin: 2,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-transit-mumbai',
    title: 'Mumbai Western Suburban Express',
    category: 'Bus Roll',
    lines: [
      { id: 'mb1', text: 'CHURCHGATE', color: '#FFFFFF', opacity: 1 },
      { id: 'mb2', text: 'MARINE LINES', color: '#FFF7D6', opacity: 1 },
      { id: 'mb3', text: 'CHARNI ROAD', color: '#FFFFFF', opacity: 1 },
      { id: 'mb4', text: 'DADAR JUNCTION', color: '#FFA64D', opacity: 1 },
      { id: 'mb5', text: 'BANDRA WEST', color: '#FFFFFF', opacity: 1 },
      { id: 'mb6', text: 'ANDHERI', color: '#FFD6C2', opacity: 1 },
      { id: 'mb7', text: 'BORIVALI', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#0F172A',
    patternId: 'bold-diagonal',
    patternOpacity: 0.12,
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-transit-nyc',
    title: 'New York Subway Express Line',
    category: 'Bus Roll',
    lines: [
      { id: 'ny1', text: 'TIMES SQUARE', color: '#FFFFFF', opacity: 1 },
      { id: 'ny2', text: '42ND STREET', color: '#38BDF8', opacity: 1 },
      { id: 'ny3', text: 'UNION SQUARE', color: '#FFFFFF', opacity: 1 },
      { id: 'ny4', text: 'SOHO / BROOME', color: '#FEF08A', opacity: 1 },
      { id: 'ny5', text: 'CANAL STREET', color: '#FFFFFF', opacity: 1 },
      { id: 'ny6', text: 'WALL STREET', color: '#4ADE80', opacity: 1 }
    ],
    backgroundColor: '#1E293B',
    patternId: 'horizontal-stripes',
    patternOpacity: 0.1,
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-transit-banner-horizontal',
    title: 'Horizontal Transit Banner',
    category: 'Bus Roll',
    lines: [
      { id: 'h1', text: 'NEW YORK', color: '#FFFFFF', opacity: 1 },
      { id: 'h2', text: 'PARIS', color: '#FFA64D', opacity: 1 },
      { id: 'h3', text: 'LONDON', color: '#FFFFFF', opacity: 1 },
      { id: 'h4', text: 'TOKYO', color: '#38BDF8', opacity: 1 },
      { id: 'h5', text: 'MUMBAI', color: '#FEF08A', opacity: 1 }
    ],
    backgroundColor: '#111827',
    patternId: 'chevrons',
    patternOpacity: 0.15,
    fontFamily: '"Bebas Neue", Impact, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 0.75,
    margin: 1.5,
    widthInches: 20,
    heightInches: 8
  },

  // --- FOOD AND DRINK ---
  {
    id: 'tpl-food-cafe',
    title: 'Artisan Coffee Roasters',
    category: 'Food and Drink',
    lines: [
      { id: 'c1', text: 'FRESH ROASTED', color: '#FFFFFF', opacity: 1 },
      { id: 'c2', text: 'ESPRESSO', color: '#FFA64D', opacity: 1 },
      { id: 'c3', text: 'CAPPUCCINO', color: '#FFF7D6', opacity: 1 },
      { id: 'c4', text: 'FLAT WHITE', color: '#FFFFFF', opacity: 1 },
      { id: 'c5', text: 'COLD BREW', color: '#FFD6C2', opacity: 1 },
      { id: 'c6', text: 'GOOD VIBES ONLY', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#3B2219',
    patternId: 'houndstooth',
    patternOpacity: 0.12,
    fontFamily: 'Poppins, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-food-kitchen-rules',
    title: 'Kitchen Rules',
    category: 'Food and Drink',
    lines: [
      { id: 'k1', text: 'KITCHEN RULES', color: '#FFFFFF', opacity: 1 },
      { id: 'k2', text: 'EAT TOGETHER', color: '#FFF7D6', opacity: 1 },
      { id: 'k3', text: 'LAUGH OFTEN', color: '#FFA64D', opacity: 1 },
      { id: 'k4', text: 'SAY THANK YOU', color: '#FFFFFF', opacity: 1 },
      { id: 'k5', text: 'HELP CLEAN UP', color: '#FFD6C2', opacity: 1 },
      { id: 'k6', text: 'KISS THE COOK', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#143823',
    patternId: 'scallops',
    patternOpacity: 0.15,
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },

  // --- HOLIDAY ---
  {
    id: 'tpl-holiday-christmas',
    title: 'Merry Christmas Joy',
    category: 'Holiday',
    lines: [
      { id: 'xm1', text: 'MERRY', color: '#FFFFFF', opacity: 1 },
      { id: 'xm2', text: 'CHRISTMAS', color: '#FEF08A', opacity: 1 },
      { id: 'xm3', text: 'SLEIGH BELLS', color: '#FFFFFF', opacity: 1 },
      { id: 'xm4', text: 'HOT COCOA', color: '#FFA64D', opacity: 1 },
      { id: 'xm5', text: 'WARM FIRES', color: '#FFF7D6', opacity: 1 },
      { id: 'xm6', text: 'PEACE ON EARTH', color: '#4ADE80', opacity: 1 }
    ],
    backgroundColor: '#7F1D1D',
    patternId: 'stars',
    patternOpacity: 0.18,
    fontFamily: 'Poppins, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-holiday-newyear',
    title: 'New Year Fresh Beginnings',
    category: 'Holiday',
    lines: [
      { id: 'ny01', text: 'HAPPY', color: '#FFFFFF', opacity: 1 },
      { id: 'ny02', text: 'NEW YEAR', color: '#FFA64D', opacity: 1 },
      { id: 'ny03', text: '365 DAYS', color: '#FFFFFF', opacity: 1 },
      { id: 'ny04', text: 'NEW CHANCES', color: '#FEF08A', opacity: 1 },
      { id: 'ny05', text: 'CELEBRATE LIFE', color: '#38BDF8', opacity: 1 }
    ],
    backgroundColor: '#0F172A',
    patternId: 'circles',
    patternOpacity: 0.15,
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1.25,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },

  // --- INSPIRATIONAL ---
  {
    id: 'tpl-inspire-dream',
    title: 'Dream Big Stay Humble',
    category: 'Inspirational',
    lines: [
      { id: 'in1', text: 'DREAM BIG', color: '#FFFFFF', opacity: 1 },
      { id: 'in2', text: 'WORK HARD', color: '#FFA64D', opacity: 1 },
      { id: 'in3', text: 'STAY HUMBLE', color: '#FFF7D6', opacity: 1 },
      { id: 'in4', text: 'BE KIND', color: '#FFFFFF', opacity: 1 },
      { id: 'in5', text: 'NEVER GIVE UP', color: '#FEF08A', opacity: 1 }
    ],
    backgroundColor: '#1E293B',
    patternId: 'geo-triangles',
    patternOpacity: 0.15,
    fontFamily: '"Bebas Neue", Impact, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1.25,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  },
  {
    id: 'tpl-inspire-journey',
    title: 'Happiness Is A Journey',
    category: 'Inspirational',
    lines: [
      { id: 'hj1', text: 'HAPPINESS', color: '#FFFFFF', opacity: 1 },
      { id: 'hj2', text: 'IS NOT A', color: '#E2E8F0', opacity: 1 },
      { id: 'hj3', text: 'DESTINATION', color: '#FFA64D', opacity: 1 },
      { id: 'hj4', text: 'IT IS A', color: '#FFF7D6', opacity: 1 },
      { id: 'hj5', text: 'WAY OF LIFE', color: '#FFFF99', opacity: 1 }
    ],
    backgroundColor: '#334155',
    patternId: 'chevrons',
    patternOpacity: 0.16,
    fontFamily: 'Poppins, -apple-system, sans-serif',
    fontStyle: 'Bold',
    lineSpacing: 1.2,
    margin: 2.5,
    widthInches: 21,
    heightInches: 32
  }
];

export const getBusRollTemplate = (id: string): BusRollTemplate | undefined => {
  return BUS_ROLL_TEMPLATES.find((t) => t.id === id);
};

// ----------------------------------------------------------------------------
// 6. SVG DATA URI GENERATOR FOR REALISTIC 2D/3D CANVAS TEXTURES
// ----------------------------------------------------------------------------
export const generateBusRollSvgString = (config: BusRollConfig): string => {
  const widthPx = Math.max(200, Math.round(config.widthInches * 40));
  const heightPx = Math.max(200, Math.round(config.heightInches * 40));
  const marginPx = Math.max(12, Math.round(config.margin * 14));
  const innerWidth = widthPx - marginPx * 2;
  const innerHeight = heightPx - marginPx * 2;

  const pattern = getBusRollPattern(config.patternId);
  const patternDefs = pattern.svgDefs ? `
    <pattern id="br-pattern" width="${pattern.patternWidth}" height="${pattern.patternHeight}" patternUnits="userSpaceOnUse">
      <g color="#FFFFFF">
        ${pattern.svgDefs}
      </g>
    </pattern>
  ` : '';

  const patternRect = pattern.svgDefs ? `
    <rect width="${widthPx}" height="${heightPx}" fill="url(#br-pattern)" opacity="${config.patternOpacity}" />
  ` : '';

  const linesCount = Math.max(1, config.lines.length);
  const lineSpacingRatio = config.lineSpacing / 1.0;
  // Font styling
  const isBold = config.fontStyle.includes('Bold');
  const isItalic = config.fontStyle.includes('Italic');
  const fontWeight = isBold ? '900' : '500';
  const fontStyle = isItalic ? 'italic' : 'normal';

  // Calculate proportional vertical layout
  const availableH = innerHeight;
  const slotHeight = availableH / (linesCount + (linesCount - 1) * 0.18 * lineSpacingRatio);
  const gap = slotHeight * 0.18 * lineSpacingRatio;

  const textLinesSvg = config.lines.map((line, idx) => {
    // Center placement was biased to 72% down each line's own slot (meant
    // to compensate for how uppercase glyphs sit visually above true
    // vertical-center) — combined with a near-max font size, that left too
    // little room below the anchor point, so the LAST line's glyph
    // descended past its slot (and the panel's bottom margin) entirely,
    // getting clipped by the print border. A smaller bias still reads
    // balanced for all-caps text without running out of room underneath.
    const yCenter = marginPx + idx * (slotHeight + gap) + slotHeight * 0.56;
    // Dynamic font sizing proportional to text length and slot height.
    // The 1.55x estimate ran real template text (wide bold uppercase
    // characters, plus the 0.06em letter-spacing below) past the panel's
    // edges — scaled down with an explicit safety margin so lines reliably
    // fit the available width instead of visually overflowing it. The
    // height-based cap (was 0.82x) is tightened too, for the same reason
    // the vertical bias above was reduced — less margin for the last
    // line's glyph to overrun the bottom of the panel.
    const charLen = Math.max(1, line.text.trim().length);
    const approxFontSize = Math.min(slotHeight * 0.68, (innerWidth * 0.9 / charLen) * 1.3);
    const clampedFontSize = Math.max(14, Math.round(approxFontSize));

    return `
      <text
        x="${widthPx / 2}"
        y="${yCenter}"
        text-anchor="middle"
        dominant-baseline="central"
        fill="${line.color}"
        opacity="${line.opacity}"
        font-family="${config.fontFamily.replace(/"/g, '&quot;')}"
        font-weight="${fontWeight}"
        font-style="${fontStyle}"
        font-size="${clampedFontSize}px"
        letter-spacing="0.06em"
      >${escapeXml(line.text.toUpperCase())}</text>
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}">
      <defs>
        ${patternDefs}
      </defs>
      <!-- Base Background -->
      <rect width="${widthPx}" height="${heightPx}" fill="${config.backgroundColor}" />
      <!-- Geometric Pattern Layer -->
      ${patternRect}
      <!-- Typography Lines -->
      ${textLinesSvg}
    </svg>
  `.trim();
};

export const generateBusRollSvgDataUrl = (config: BusRollConfig): string => {
  const svg = generateBusRollSvgString(config);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
