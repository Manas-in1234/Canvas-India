// ============================================================================
// CANVAS BANNER DATA & CONFIGURATION CONSTANTS
// Centralized configuration for large-format Canvas Banner prints
// ============================================================================

export type BannerUnit = 'in' | 'ft' | 'cm';

export interface BannerUnitOption {
  id: BannerUnit;
  label: string;
  symbol: string;
}

export const BANNER_UNITS: BannerUnitOption[] = [
  { id: 'in', label: 'Inches', symbol: '"' },
  { id: 'ft', label: 'Ft. (Feet)', symbol: ' ft' },
  { id: 'cm', label: 'Centimeters', symbol: ' cm' }
];

export type BannerSizeCategory = 'RECOMMENDED' | 'SQUARE' | 'PANORAMIC' | 'LARGE' | 'SMALL';

export interface CanvasBannerSizeOption {
  id: string;
  productTypeId: 'canvas-banner';
  label: string;
  dimensionsSummary: string;
  widthInches: number;
  heightInches: number;
  price: number;
  categories: BannerSizeCategory[];
  panels: Array<{
    id: string;
    label: string;
    dimension: string;
    widthRatio: number;
    heightRatio: number;
  }>;
}

// ----------------------------------------------------------------------------
// UNIT CONVERSION HELPERS
// Canonical internal unit is INCHES
// ----------------------------------------------------------------------------
export function convertToInches(value: number, unit: BannerUnit): number {
  if (unit === 'ft') return Math.round(value * 12 * 100) / 100;
  if (unit === 'cm') return Math.round((value / 2.54) * 100) / 100;
  return Math.round(value * 100) / 100;
}

export function convertFromInches(inches: number, unit: BannerUnit): number {
  if (unit === 'ft') return Number((inches / 12).toFixed(1));
  if (unit === 'cm') return Math.round(inches * 2.54);
  return Math.round(inches);
}

export function formatDimension(inches: number, unit: BannerUnit): string {
  if (unit === 'ft') {
    const ft = inches / 12;
    return `${Number.isInteger(ft) ? ft : ft.toFixed(1)} ft`;
  }
  if (unit === 'cm') {
    return `${Math.round(inches * 2.54)} cm`;
  }
  return `${Math.round(inches)} inch`;
}

// ----------------------------------------------------------------------------
// DYNAMIC PRICING ENGINE
// Accurately calibrated to reference screenshot prices:
// 10" × 8": ₹399.00
// 69" × 52": ₹3,567.00
// 128" × 96": ₹12,025.24
// 187" × 140": ₹25,769.88
// 246" × 185": ₹42,025.56
// 305" × 229": ₹63,171.16
// ----------------------------------------------------------------------------
export function calculateBannerPrice(widthInches: number, heightInches: number): number {
  const area = Math.max(1, widthInches * heightInches);
  // Base minimum for banner printing: ₹399
  if (area <= 144) {
    return 399.0;
  }

  let ratePerSqIn: number;
  if (area >= 50000) {
    ratePerSqIn = 0.90445; // ~₹63,171 at 69,845 sq in
  } else if (area >= 30000) {
    ratePerSqIn = 0.92344; // ~₹42,025 at 45,510 sq in
  } else if (area >= 18000) {
    ratePerSqIn = 0.98433; // ~₹25,770 at 26,180 sq in
  } else if (area >= 8000) {
    ratePerSqIn = 0.97862; // ~₹12,025 at 12,288 sq in
  } else if (area >= 2000) {
    ratePerSqIn = 0.99415; // ~₹3,567 at 3,588 sq in
  } else {
    ratePerSqIn = 1.0;
  }

  const raw = area * ratePerSqIn;
  return Math.max(399.0, Math.round(raw * 100) / 100);
}

// ----------------------------------------------------------------------------
// PRESET SIZES CATALOG
// ----------------------------------------------------------------------------
export const CANVAS_BANNER_SIZE_OPTIONS: CanvasBannerSizeOption[] = [
  // RECOMMENDED (from Reference Screenshot 1)
  {
    id: 'banner-10x8',
    productTypeId: 'canvas-banner',
    label: '10" × 8"',
    dimensionsSummary: '10" × 8"',
    widthInches: 10,
    heightInches: 8,
    price: 399.0,
    categories: ['RECOMMENDED', 'SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '10" × 8"', widthRatio: 10, heightRatio: 8 }]
  },
  {
    id: 'banner-12x12',
    productTypeId: 'canvas-banner',
    label: '12" × 12" (1 ft × 1 ft)',
    dimensionsSummary: '12" × 12"',
    widthInches: 12,
    heightInches: 12,
    price: 399.0,
    categories: ['RECOMMENDED', 'SQUARE', 'SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'banner-24x36',
    productTypeId: 'canvas-banner',
    label: '24" × 36" (2 ft × 3 ft)',
    dimensionsSummary: '24" × 36"',
    widthInches: 24,
    heightInches: 36,
    price: 864.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  },
  {
    id: 'banner-36x48',
    productTypeId: 'canvas-banner',
    label: '36" × 48" (3 ft × 4 ft)',
    dimensionsSummary: '36" × 48"',
    widthInches: 36,
    heightInches: 48,
    price: 1728.0,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '36" × 48"', widthRatio: 36, heightRatio: 48 }]
  },
  {
    id: 'banner-69x52',
    productTypeId: 'canvas-banner',
    label: '69" × 52"',
    dimensionsSummary: '69" × 52"',
    widthInches: 69,
    heightInches: 52,
    price: 3567.0,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '69" × 52"', widthRatio: 69, heightRatio: 52 }]
  },
  {
    id: 'banner-128x96',
    productTypeId: 'canvas-banner',
    label: '128" × 96"',
    dimensionsSummary: '128" × 96"',
    widthInches: 128,
    heightInches: 96,
    price: 12025.24,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '128" × 96"', widthRatio: 128, heightRatio: 96 }]
  },
  {
    id: 'banner-187x140',
    productTypeId: 'canvas-banner',
    label: '187" × 140"',
    dimensionsSummary: '187" × 140"',
    widthInches: 187,
    heightInches: 140,
    price: 25769.88,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '187" × 140"', widthRatio: 187, heightRatio: 140 }]
  },
  {
    id: 'banner-246x185',
    productTypeId: 'canvas-banner',
    label: '246" × 185"',
    dimensionsSummary: '246" × 185"',
    widthInches: 246,
    heightInches: 185,
    price: 42025.56,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '246" × 185"', widthRatio: 246, heightRatio: 185 }]
  },
  {
    id: 'banner-305x229',
    productTypeId: 'canvas-banner',
    label: '305" × 229"',
    dimensionsSummary: '305" × 229"',
    widthInches: 305,
    heightInches: 229,
    price: 63171.16,
    categories: ['RECOMMENDED', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '305" × 229"', widthRatio: 305, heightRatio: 229 }]
  },

  // SQUARE SIZES
  {
    id: 'banner-sq-24x24',
    productTypeId: 'canvas-banner',
    label: '24" × 24" (2 ft × 2 ft)',
    dimensionsSummary: '24" × 24"',
    widthInches: 24,
    heightInches: 24,
    price: 576.0,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '24" × 24"', widthRatio: 24, heightRatio: 24 }]
  },
  {
    id: 'banner-sq-36x36',
    productTypeId: 'canvas-banner',
    label: '36" × 36" (3 ft × 3 ft)',
    dimensionsSummary: '36" × 36"',
    widthInches: 36,
    heightInches: 36,
    price: 1296.0,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '36" × 36"', widthRatio: 36, heightRatio: 36 }]
  },
  {
    id: 'banner-sq-48x48',
    productTypeId: 'canvas-banner',
    label: '48" × 48" (4 ft × 4 ft)',
    dimensionsSummary: '48" × 48"',
    widthInches: 48,
    heightInches: 48,
    price: 2304.0,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '48" × 48"', widthRatio: 48, heightRatio: 48 }]
  },
  {
    id: 'banner-sq-72x72',
    productTypeId: 'canvas-banner',
    label: '72" × 72" (6 ft × 6 ft)',
    dimensionsSummary: '72" × 72"',
    widthInches: 72,
    heightInches: 72,
    price: 5080.0,
    categories: ['SQUARE', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '72" × 72"', widthRatio: 72, heightRatio: 72 }]
  },
  {
    id: 'banner-sq-96x96',
    productTypeId: 'canvas-banner',
    label: '96" × 96" (8 ft × 8 ft)',
    dimensionsSummary: '96" × 96"',
    widthInches: 96,
    heightInches: 96,
    price: 9032.0,
    categories: ['SQUARE', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '96" × 96"', widthRatio: 96, heightRatio: 96 }]
  },

  // PANORAMIC SIZES
  {
    id: 'banner-pan-36x12',
    productTypeId: 'canvas-banner',
    label: '36" × 12" (3 ft × 1 ft)',
    dimensionsSummary: '36" × 12"',
    widthInches: 36,
    heightInches: 12,
    price: 432.0,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '36" × 12"', widthRatio: 36, heightRatio: 12 }]
  },
  {
    id: 'banner-pan-48x16',
    productTypeId: 'canvas-banner',
    label: '48" × 16" (4 ft × 1.3 ft)',
    dimensionsSummary: '48" × 16"',
    widthInches: 48,
    heightInches: 16,
    price: 768.0,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '48" × 16"', widthRatio: 48, heightRatio: 16 }]
  },
  {
    id: 'banner-pan-60x20',
    productTypeId: 'canvas-banner',
    label: '60" × 20" (5 ft × 1.67 ft)',
    dimensionsSummary: '60" × 20"',
    widthInches: 60,
    heightInches: 20,
    price: 1200.0,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '60" × 20"', widthRatio: 60, heightRatio: 20 }]
  },
  {
    id: 'banner-pan-72x24',
    productTypeId: 'canvas-banner',
    label: '72" × 24" (6 ft × 2 ft)',
    dimensionsSummary: '72" × 24"',
    widthInches: 72,
    heightInches: 24,
    price: 1728.0,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '72" × 24"', widthRatio: 72, heightRatio: 24 }]
  },
  {
    id: 'banner-pan-96x32',
    productTypeId: 'canvas-banner',
    label: '96" × 32" (8 ft × 2.67 ft)',
    dimensionsSummary: '96" × 32"',
    widthInches: 96,
    heightInches: 32,
    price: 3072.0,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '96" × 32"', widthRatio: 96, heightRatio: 32 }]
  },
  {
    id: 'banner-pan-120x36',
    productTypeId: 'canvas-banner',
    label: '120" × 36" (10 ft × 3 ft)',
    dimensionsSummary: '120" × 36"',
    widthInches: 120,
    heightInches: 36,
    price: 4320.0,
    categories: ['PANORAMIC', 'LARGE'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '120" × 36"', widthRatio: 120, heightRatio: 36 }]
  },

  // SMALL SIZES
  {
    id: 'banner-sm-12x18',
    productTypeId: 'canvas-banner',
    label: '12" × 18" (1 ft × 1.5 ft)',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    price: 399.0,
    categories: ['SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'banner-sm-16x20',
    productTypeId: 'canvas-banner',
    label: '16" × 20"',
    dimensionsSummary: '16" × 20"',
    widthInches: 16,
    heightInches: 20,
    price: 399.0,
    categories: ['SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'banner-sm-16x24',
    productTypeId: 'canvas-banner',
    label: '16" × 24"',
    dimensionsSummary: '16" × 24"',
    widthInches: 16,
    heightInches: 24,
    price: 399.0,
    categories: ['SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 }]
  },
  {
    id: 'banner-sm-20x24',
    productTypeId: 'canvas-banner',
    label: '20" × 24"',
    dimensionsSummary: '20" × 24"',
    widthInches: 20,
    heightInches: 24,
    price: 480.0,
    categories: ['SMALL'],
    panels: [{ id: 'p0', label: 'Canvas Banner', dimension: '20" × 24"', widthRatio: 20, heightRatio: 24 }]
  }
];

// ----------------------------------------------------------------------------
// CANVAS BANNER HARDWARE OPTIONS
// ----------------------------------------------------------------------------
export interface BannerHardwareOption {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export const CANVAS_BANNER_HARDWARE_OPTIONS: BannerHardwareOption[] = [
  {
    id: 'no-hooks',
    name: 'No Hardware (Clean Trim)',
    price: 0,
    description: 'Clean, flat banner edges ready for tape, tacking, or custom frames.'
  },
  {
    id: 'banner-grommets',
    name: 'Corner Eyelets / Metal Grommets',
    price: 99.0,
    description: 'Reinforced nickel eyelets placed at corners for rope, bungee, or zip tie mounting.'
  },
  {
    id: 'banner-pole-pocket',
    name: 'Top & Bottom Pole Pockets',
    price: 149.0,
    description: 'Neatly stitched 2-inch top and bottom sleeves for dowels, tubes, or hanging banner rods.'
  },
  {
    id: 'banner-hanging-rails',
    name: 'Solid Wood Hanging Rails',
    price: 199.0,
    description: 'Natural solid wood top and bottom magnetic clamping rails with rustic hanging cord.'
  },
  {
    id: 'hooks-hanging',
    name: 'Standard Hanging Mounts',
    price: 0,
    description: 'Pre-attached lightweight adhesive wall mounting hooks.'
  }
];

// ----------------------------------------------------------------------------
// CANVAS BANNER BACKGROUND COLOR PALETTES
// ----------------------------------------------------------------------------
export const BANNER_BACKGROUND_PRESETS = [
  { hex: '#FFFFFF', name: 'Studio White (Default)' },
  { hex: '#FFFDF9', name: 'Warm Cream' },
  { hex: '#F1F5F9', name: 'Mist Gray' },
  { hex: '#FAF8F5', name: 'Soft Ivory' },
  { hex: '#E53935', name: 'Crimson Red' },
  { hex: '#0E4A93', name: 'Canvas India Blue' },
  { hex: '#1E293B', name: 'Dark Slate' },
  { hex: '#0F172A', name: 'Midnight Black' }
];

// ----------------------------------------------------------------------------
// DEFAULT BANNER CONFIG
// ----------------------------------------------------------------------------
export interface CanvasBannerConfig {
  unit: BannerUnit;
  width: number;
  height: number;
  widthInches: number;
  heightInches: number;
  backgroundColor: string;
  isCustom: boolean;
  selectedSizeId: string;
  hardwareId: string;
}

export const DEFAULT_CANVAS_BANNER_CONFIG: CanvasBannerConfig = {
  unit: 'in',
  width: 10,
  height: 8,
  widthInches: 10,
  heightInches: 8,
  backgroundColor: '#FFFFFF',
  isCustom: false,
  selectedSizeId: 'banner-10x8',
  hardwareId: 'no-hooks'
};
