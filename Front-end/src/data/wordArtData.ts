// ============================================================================
// WORD ART ON CANVAS - DATA & DENSE WORD CLOUD GENERATOR ENGINE
// Provides:
// 1. Ratio-based size catalogs matching reference screenshots
// 2. Shapes, color schemes, font families, text direction configurations (6 options)
// 3. Client-side deterministic organic Word Cloud rendering engine on HTML5 Canvas
//    matching the heart-shaped reference silhouette and filling all supported shapes
// ============================================================================

export type WordArtRatioTab = 'Square' | '3:2 Ratio' | '4:3 Ratio' | '16:9 Ratio';

export interface WordArtSizeOption {
  id: string;
  ratioTab: WordArtRatioTab;
  widthInches: number;
  heightInches: number;
  label: string;
  price: number;
  aspectRatio: number;
}

export const WORD_ART_SIZE_CATALOG: Record<WordArtRatioTab, WordArtSizeOption[]> = {
  Square: [
    { id: 'word-sq-8x8', ratioTab: 'Square', widthInches: 8, heightInches: 8, label: '8" × 8"', price: 198.0, aspectRatio: 1 },
    { id: 'word-sq-9x9', ratioTab: 'Square', widthInches: 9, heightInches: 9, label: '9" × 9"', price: 305.0, aspectRatio: 1 },
    { id: 'word-sq-10x10', ratioTab: 'Square', widthInches: 10, heightInches: 10, label: '10" × 10"', price: 349.0, aspectRatio: 1 },
    { id: 'word-sq-11x11', ratioTab: 'Square', widthInches: 11, heightInches: 11, label: '11" × 11"', price: 397.0, aspectRatio: 1 },
    { id: 'word-sq-12x12', ratioTab: 'Square', widthInches: 12, heightInches: 12, label: '12" × 12"', price: 449.0, aspectRatio: 1 },
    { id: 'word-sq-13x13', ratioTab: 'Square', widthInches: 13, heightInches: 13, label: '13" × 13"', price: 506.0, aspectRatio: 1 },
    { id: 'word-sq-14x14', ratioTab: 'Square', widthInches: 14, heightInches: 14, label: '14" × 14"', price: 566.0, aspectRatio: 1 },
    { id: 'word-sq-15x15', ratioTab: 'Square', widthInches: 15, heightInches: 15, label: '15" × 15"', price: 608.0, aspectRatio: 1 },
    { id: 'word-sq-16x16', ratioTab: 'Square', widthInches: 16, heightInches: 16, label: '16" × 16"', price: 670.0, aspectRatio: 1 },
    { id: 'word-sq-17x17', ratioTab: 'Square', widthInches: 17, heightInches: 17, label: '17" × 17"', price: 746.0, aspectRatio: 1 },
    { id: 'word-sq-18x18', ratioTab: 'Square', widthInches: 18, heightInches: 18, label: '18" × 18"', price: 821.0, aspectRatio: 1 },
    { id: 'word-sq-19x19', ratioTab: 'Square', widthInches: 19, heightInches: 19, label: '19" × 19"', price: 900.0, aspectRatio: 1 },
    { id: 'word-sq-20x20', ratioTab: 'Square', widthInches: 20, heightInches: 20, label: '20" × 20"', price: 984.0, aspectRatio: 1 },
    { id: 'word-sq-21x21', ratioTab: 'Square', widthInches: 21, heightInches: 21, label: '21" × 21"', price: 1070.0, aspectRatio: 1 },
    { id: 'word-sq-22x22', ratioTab: 'Square', widthInches: 22, heightInches: 22, label: '22" × 22"', price: 1161.0, aspectRatio: 1 },
    { id: 'word-sq-23x23', ratioTab: 'Square', widthInches: 23, heightInches: 23, label: '23" × 23"', price: 1256.0, aspectRatio: 1 },
    { id: 'word-sq-24x24', ratioTab: 'Square', widthInches: 24, heightInches: 24, label: '24" × 24"', price: 1356.0, aspectRatio: 1 },
    { id: 'word-sq-25x25', ratioTab: 'Square', widthInches: 25, heightInches: 25, label: '25" × 25"', price: 1461.0, aspectRatio: 1 },
    { id: 'word-sq-26x26', ratioTab: 'Square', widthInches: 26, heightInches: 26, label: '26" × 26"', price: 1569.0, aspectRatio: 1 },
    { id: 'word-sq-27x27', ratioTab: 'Square', widthInches: 27, heightInches: 27, label: '27" × 27"', price: 1681.0, aspectRatio: 1 },
    { id: 'word-sq-28x28', ratioTab: 'Square', widthInches: 28, heightInches: 28, label: '28" × 28"', price: 1797.0, aspectRatio: 1 },
    { id: 'word-sq-29x29', ratioTab: 'Square', widthInches: 29, heightInches: 29, label: '29" × 29"', price: 1916.0, aspectRatio: 1 },
    { id: 'word-sq-30x30', ratioTab: 'Square', widthInches: 30, heightInches: 30, label: '30" × 30"', price: 2041.0, aspectRatio: 1 },
    { id: 'word-sq-31x31', ratioTab: 'Square', widthInches: 31, heightInches: 31, label: '31" × 31"', price: 2169.0, aspectRatio: 1 }
  ],
  '3:2 Ratio': [
    { id: 'word-32-12x8', ratioTab: '3:2 Ratio', widthInches: 12, heightInches: 8, label: '12" × 8"', price: 249.0, aspectRatio: 12 / 8 },
    { id: 'word-32-15x10', ratioTab: '3:2 Ratio', widthInches: 15, heightInches: 10, label: '15" × 10"', price: 399.0, aspectRatio: 15 / 10 },
    { id: 'word-32-18x12', ratioTab: '3:2 Ratio', widthInches: 18, heightInches: 12, label: '18" × 12"', price: 499.0, aspectRatio: 18 / 12 },
    { id: 'word-32-21x14', ratioTab: '3:2 Ratio', widthInches: 21, heightInches: 14, label: '21" × 14"', price: 699.0, aspectRatio: 21 / 14 },
    { id: 'word-32-24x16', ratioTab: '3:2 Ratio', widthInches: 24, heightInches: 16, label: '24" × 16"', price: 899.0, aspectRatio: 24 / 16 },
    { id: 'word-32-27x18', ratioTab: '3:2 Ratio', widthInches: 27, heightInches: 18, label: '27" × 18"', price: 1099.0, aspectRatio: 27 / 18 },
    { id: 'word-32-30x20', ratioTab: '3:2 Ratio', widthInches: 30, heightInches: 20, label: '30" × 20"', price: 1299.0, aspectRatio: 30 / 20 },
    { id: 'word-32-36x24', ratioTab: '3:2 Ratio', widthInches: 36, heightInches: 24, label: '36" × 24"', price: 1799.0, aspectRatio: 36 / 24 }
  ],
  '4:3 Ratio': [
    { id: 'word-43-12x9', ratioTab: '4:3 Ratio', widthInches: 12, heightInches: 9, label: '12" × 9"', price: 299.0, aspectRatio: 12 / 9 },
    { id: 'word-43-16x12', ratioTab: '4:3 Ratio', widthInches: 16, heightInches: 12, label: '16" × 12"', price: 449.0, aspectRatio: 16 / 12 },
    { id: 'word-43-20x15', ratioTab: '4:3 Ratio', widthInches: 20, heightInches: 15, label: '20" × 15"', price: 749.0, aspectRatio: 20 / 15 },
    { id: 'word-43-24x18', ratioTab: '4:3 Ratio', widthInches: 24, heightInches: 18, label: '24" × 18"', price: 999.0, aspectRatio: 24 / 18 },
    { id: 'word-43-28x21', ratioTab: '4:3 Ratio', widthInches: 28, heightInches: 21, label: '28" × 21"', price: 1299.0, aspectRatio: 28 / 21 },
    { id: 'word-43-32x24', ratioTab: '4:3 Ratio', widthInches: 32, heightInches: 24, label: '32" × 24"', price: 1599.0, aspectRatio: 32 / 24 }
  ],
  '16:9 Ratio': [
    { id: 'word-169-16x9', ratioTab: '16:9 Ratio', widthInches: 16, heightInches: 9, label: '16" × 9"', price: 349.0, aspectRatio: 16 / 9 },
    { id: 'word-169-20x11', ratioTab: '16:9 Ratio', widthInches: 20, heightInches: 11.25, label: '20" × 11.25"', price: 599.0, aspectRatio: 16 / 9 },
    { id: 'word-169-24x13', ratioTab: '16:9 Ratio', widthInches: 24, heightInches: 13.5, label: '24" × 13.5"', price: 799.0, aspectRatio: 16 / 9 },
    { id: 'word-169-28x15', ratioTab: '16:9 Ratio', widthInches: 28, heightInches: 15.75, label: '28" × 15.75"', price: 999.0, aspectRatio: 16 / 9 },
    { id: 'word-169-32x18', ratioTab: '16:9 Ratio', widthInches: 32, heightInches: 18, label: '32" × 18"', price: 1299.0, aspectRatio: 16 / 9 },
    { id: 'word-169-40x22', ratioTab: '16:9 Ratio', widthInches: 40, heightInches: 22.5, label: '40" × 22.5"', price: 1899.0, aspectRatio: 16 / 9 }
  ]
};

export type WordArtTextDirection =
  | 'horizontal'
  | 'horizontal_vertical'
  | 'left_angled'
  | 'left_right_angled'
  | 'right_angled'
  | 'vertical'
  | 'mixed';

export interface WordArtTextDirectionOption {
  id: WordArtTextDirection;
  label: string;
}

export const WORD_ART_TEXT_DIRECTION_OPTIONS: WordArtTextDirectionOption[] = [
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'horizontal_vertical', label: 'Horizontal & Vertical' },
  { id: 'left_angled', label: 'Left Angled' },
  { id: 'left_right_angled', label: 'Left & Right Angled' },
  { id: 'right_angled', label: 'Right Angled' },
  { id: 'vertical', label: 'Vertical' }
];

export interface WordArtConfig {
  primaryName: string;
  fontColor: string;
  backgroundColor: string;
  fontFamily: string;
  otherText: string[];
  shape: 'none' | 'heart' | 'circle' | 'star' | 'butterfly' | 'tree' | 'apple' | 'cloud';
  colorScheme: string;
  textDirection: WordArtTextDirection;
  seed: number;
}

export const WORD_ART_FONT_OPTIONS = [
  { id: 'Arial', label: 'Arial (Clean Sans)' },
  { id: 'Montserrat', label: 'Montserrat (Modern Bold)' },
  { id: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  { id: 'Bebas Neue', label: 'Bebas Neue (Impact Display)' },
  { id: 'Pacifico', label: 'Pacifico (Casual Script)' },
  { id: 'Dancing Script', label: 'Dancing Script (Playful Script)' },
  { id: 'Oswald', label: 'Oswald (Condensed Sans)' },
  { id: 'Roboto', label: 'Roboto (Geometric Sans)' }
];

export const WORD_ART_SHAPE_OPTIONS = [
  { id: 'none', label: 'None (Full Canvas Frame)' },
  { id: 'heart', label: 'Heart (Romance & Family)' },
  { id: 'circle', label: 'Circle (Classic Round)' },
  { id: 'star', label: 'Star (Inspirational)' },
  { id: 'butterfly', label: 'Butterfly (Graceful)' },
  { id: 'tree', label: 'Tree of Life (Roots & Growth)' },
  { id: 'apple', label: 'Apple (Appreciation)' },
  { id: 'cloud', label: 'Cloud (Dreams & Freedom)' }
];

export const WORD_ART_COLOR_SCHEMES = [
  {
    id: 'neutrals-plum',
    label: 'Neutrals & Plum',
    colors: ['#FFFFFF', '#4A4036', '#483D4A']
  },
  {
    id: 'mint-steel-beige',
    label: 'Mint / Steel Grey / Beige',
    colors: ['#72B5A8', '#A8B0B5', '#9C8E82']
  },
  {
    id: 'greens',
    label: 'Greens',
    colors: ['#2ECC40', '#00B32C', '#007A1E']
  },
  {
    id: 'blues',
    label: 'Blues',
    colors: ['#93C5FD', '#3B82F6', '#1D4ED8', '#1E3A8A']
  },
  {
    id: 'warm-earth-tones',
    label: 'Warm Earth Tones',
    colors: ['#F5EBE1', '#D4A373', '#A98467', '#6C584C']
  },
  {
    id: 'sunset',
    label: 'Sunset',
    colors: ['#FEF08A', '#FDBA74', '#FB923C', '#F43F5E', '#BE123C']
  },
  {
    id: 'pastels',
    label: 'Pastels',
    colors: ['#FDE2E4', '#FAD2E1', '#E2ECE9', '#BEE1E6', '#DFE7FD']
  },
  {
    id: 'black-gold',
    label: 'Black & Gold',
    colors: ['#FFFFFF', '#D4AF37', '#AA7C11', '#1A1A1A']
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: ['#E0F2FE', '#7DD3FC', '#0284C7', '#0369A1', '#0E4A93']
  },
  {
    id: 'jewel-tones',
    label: 'Jewel Tones',
    colors: ['#0D9488', '#4338CA', '#7E22CE', '#BE185D', '#B45309']
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    colors: ['#FFFFFF', '#CBD5E1', '#94A3B8', '#64748B', '#334155', '#0F172A']
  },
  {
    id: 'bright-vibrant',
    label: 'Bright & Vibrant',
    colors: ['#F43F5E', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']
  },
  {
    id: 'rose-burgundy',
    label: 'Rose & Burgundy',
    colors: ['#FFE4E6', '#FDA4AF', '#F43F5E', '#9F1239', '#4C0519']
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    colors: ['#FDF0ED', '#E07A5F', '#C85A32', '#9C4121', '#3D405B']
  },
  {
    id: 'lavender',
    label: 'Lavender',
    colors: ['#F3E8FF', '#D8B4FE', '#A855F7', '#7E22CE', '#581C87']
  },
  {
    id: 'forest-moss',
    label: 'Forest & Moss',
    colors: ['#ECFDF5', '#A7F3D0', '#34D399', '#059669', '#064E3B', '#2D4A22']
  }
];

export const DEFAULT_WORD_ART_CONFIG: WordArtConfig = {
  primaryName: 'LOVE & FAMILY',
  fontColor: '#FFFFFF',
  backgroundColor: '#000000',
  fontFamily: 'Montserrat',
  otherText: [
    'Together',
    'Memories',
    'Happiness',
    'Laughter',
    'Forever',
    'Blessings',
    'Cherish',
    'Home',
    'Journey'
  ],
  shape: 'heart',
  colorScheme: 'neutrals-plum',
  textDirection: 'horizontal',
  seed: 42
};

// Seeded pseudorandom generator for reproducible variation on click
function createPrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = (hex || '#000000').replace('#', '').trim();
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function ensureColorContrast(textColor: string, bgColor: string): string {
  const bgRgb = hexToRgb(bgColor);
  const textRgb = hexToRgb(textColor);
  const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const textLum = getLuminance(textRgb.r, textRgb.g, textRgb.b);
  const diff = Math.abs(bgLum - textLum);

  if (diff < 65) {
    if (bgLum < 128) {
      return '#FFFFFF';
    } else {
      return '#0F172A';
    }
  }
  return textColor;
}

/**
 * Creates path for chosen shape fitted within canvas bounds
 */
function applyShapePath(ctx: CanvasRenderingContext2D, shape: string, w: number, h: number) {
  ctx.beginPath();
  const pad = Math.min(w, h) * 0.05;
  const cw = w - pad * 2;
  const ch = h - pad * 2;
  const cx = w / 2;
  const cy = h / 2;

  switch (shape) {
    case 'circle': {
      const r = Math.min(cw, ch) / 2;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
    case 'heart': {
      // Broad, full-lobed heart silhouette matching the visual reference
      const hw = cw * 0.5;
      const hh = ch * 0.5;
      const topY = cy - hh * 0.28;
      const bottomY = cy + hh * 0.96;

      ctx.moveTo(cx, topY);
      // Left lobe
      ctx.bezierCurveTo(cx - hw * 0.15, cy - hh * 1.0, cx - hw * 0.95, cy - hh * 0.8, cx - hw * 0.98, cy - hh * 0.18);
      // Left bottom taper to bottom tip
      ctx.bezierCurveTo(cx - hw * 0.98, cy + hh * 0.35, cx - hw * 0.55, cy + hh * 0.72, cx, bottomY);
      // Right bottom taper from bottom tip
      ctx.bezierCurveTo(cx + hw * 0.55, cy + hh * 0.72, cx + hw * 0.98, cy + hh * 0.35, cx + hw * 0.98, cy - hh * 0.18);
      // Right lobe back to center top cleft
      ctx.bezierCurveTo(cx + hw * 0.95, cy - hh * 0.8, cx + hw * 0.15, cy - hh * 1.0, cx, topY);
      ctx.closePath();
      break;
    }
    case 'star': {
      const spikes = 5;
      const outerR = Math.min(cw, ch) / 2;
      const innerR = outerR * 0.44;
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    case 'butterfly': {
      const hw = cw * 0.48;
      const hh = ch * 0.48;
      ctx.moveTo(cx, cy + hh * 0.5);
      ctx.bezierCurveTo(cx - hw * 1.1, cy + hh * 0.8, cx - hw * 1.2, cy - hh * 0.8, cx - hw * 0.2, cy - hh * 0.4);
      ctx.bezierCurveTo(cx - hw * 0.1, cy - hh * 0.7, cx, cy - hh * 0.8, cx, cy - hh * 0.35);
      ctx.bezierCurveTo(cx, cy - hh * 0.8, cx + hw * 0.1, cy - hh * 0.7, cx + hw * 0.2, cy - hh * 0.4);
      ctx.bezierCurveTo(cx + hw * 1.2, cy - hh * 0.8, cx + hw * 1.1, cy + hh * 0.8, cx, cy + hh * 0.5);
      ctx.closePath();
      break;
    }
    case 'tree': {
      const hw = cw * 0.46;
      const hh = ch * 0.46;
      ctx.moveTo(cx - hw * 0.18, cy + hh * 0.92);
      ctx.lineTo(cx + hw * 0.18, cy + hh * 0.92);
      ctx.lineTo(cx + hw * 0.14, cy + hh * 0.3);
      ctx.arc(cx, cy - hh * 0.2, hw * 0.78, 0.25, Math.PI - 0.25, true);
      ctx.lineTo(cx - hw * 0.14, cy + hh * 0.3);
      ctx.closePath();
      break;
    }
    case 'apple': {
      const hw = cw * 0.45;
      const hh = ch * 0.45;
      ctx.moveTo(cx, cy - hh * 0.45);
      ctx.bezierCurveTo(cx + hw * 0.85, cy - hh * 0.85, cx + hw * 1.1, cy + hh * 0.7, cx, cy + hh * 0.92);
      ctx.bezierCurveTo(cx - hw * 1.1, cy + hh * 0.7, cx - hw * 0.85, cy - hh * 0.85, cx, cy - hh * 0.45);
      ctx.closePath();
      break;
    }
    case 'cloud': {
      const hw = cw * 0.38;
      const hh = ch * 0.35;
      ctx.arc(cx - hw * 0.55, cy, hh * 0.55, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cx - hw * 0.15, cy - hh * 0.45, hh * 0.65, Math.PI, Math.PI * 1.85);
      ctx.arc(cx + hw * 0.4, cy - hh * 0.3, hh * 0.55, Math.PI * 1.3, Math.PI * 0.15);
      ctx.arc(cx + hw * 0.65, cy + hh * 0.1, hh * 0.5, Math.PI * 1.8, Math.PI * 0.5);
      ctx.closePath();
      break;
    }
    case 'none':
    default: {
      ctx.rect(pad, pad, cw, ch);
      break;
    }
  }
}

/**
 * Creates binary occupancy mask of chosen shape for fast pixel-accurate in-shape tests
 */
function createShapeMask(shape: string, renderWidth: number, renderHeight: number) {
  const maskScale = 3;
  const maskW = Math.max(120, Math.round(renderWidth / maskScale));
  const maskH = Math.max(120, Math.round(renderHeight / maskScale));

  const offscreen = document.createElement('canvas');
  offscreen.width = maskW;
  offscreen.height = maskH;
  const ctx = offscreen.getContext('2d');
  if (!ctx) {
    return {
      maskW,
      maskH,
      isInside: () => true
    };
  }

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, maskW, maskH);

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  applyShapePath(ctx, shape, maskW, maskH);
  ctx.fill();

  const imgData = ctx.getImageData(0, 0, maskW, maskH).data;

  return {
    maskW,
    maskH,
    isInside: (x: number, y: number) => {
      const mx = Math.round((x * maskW) / renderWidth);
      const my = Math.round((y * maskH) / renderHeight);
      if (mx < 0 || mx >= maskW || my < 0 || my >= maskH) return false;
      return imgData[(my * maskW + mx) * 4] > 128;
    }
  };
}

/**
 * 2D Spatial Occupancy Grid for collision avoidance and compact word packing
 */
class OccupancyGrid {
  private grid: Uint8Array;
  private width: number;
  private height: number;
  private scale: number;

  constructor(canvasW: number, canvasH: number, scale = 4, isInsideShape: (x: number, y: number) => boolean) {
    this.scale = scale;
    this.width = Math.ceil(canvasW / scale);
    this.height = Math.ceil(canvasH / scale);
    this.grid = new Uint8Array(this.width * this.height);

    for (let gy = 0; gy < this.height; gy++) {
      const py = (gy + 0.5) * scale;
      for (let gx = 0; gx < this.width; gx++) {
        const px = (gx + 0.5) * scale;
        if (!isInsideShape(px, py)) {
          this.grid[gy * this.width + gx] = 1; // Wall / Outside shape
        }
      }
    }
  }

  public canPlace(cx: number, cy: number, w: number, h: number, angle: number, pad = 2): boolean {
    const hw = w / 2 + pad;
    const hh = h / 2 + pad;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Fast corner & midpoint test
    const corners = [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
      [0, -hh],
      [0, hh],
      [-hw, 0],
      [hw, 0]
    ];

    for (let i = 0; i < corners.length; i++) {
      const u = corners[i][0];
      const v = corners[i][1];
      const px = cx + u * cosA - v * sinA;
      const py = cy + u * sinA + v * cosA;
      const gx = Math.floor(px / this.scale);
      const gy = Math.floor(py / this.scale);
      if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) return false;
      if (this.grid[gy * this.width + gx] !== 0) return false;
    }

    // Step across interior bounding box
    const step = this.scale;
    for (let v = -hh; v <= hh; v += step) {
      for (let u = -hw; u <= hw; u += step) {
        const px = cx + u * cosA - v * sinA;
        const py = cy + u * sinA + v * cosA;
        const gx = Math.floor(px / this.scale);
        const gy = Math.floor(py / this.scale);
        if (gx < 0 || gx >= this.width || gy < 0 || gy >= this.height) return false;
        if (this.grid[gy * this.width + gx] !== 0) return false;
      }
    }

    return true;
  }

  public markPlaced(cx: number, cy: number, w: number, h: number, angle: number, pad = 2) {
    const hw = w / 2 + pad;
    const hh = h / 2 + pad;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const step = this.scale * 0.75;

    for (let v = -hh; v <= hh; v += step) {
      for (let u = -hw; u <= hw; u += step) {
        const px = cx + u * cosA - v * sinA;
        const py = cy + u * sinA + v * cosA;
        const gx = Math.floor(px / this.scale);
        const gy = Math.floor(py / this.scale);
        if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
          this.grid[gy * this.width + gx] = 2; // Word cell
        }
      }
    }
  }

  public findRandomEmptyCell(rand: () => number): { x: number; y: number } | null {
    for (let attempts = 0; attempts < 35; attempts++) {
      const gx = Math.floor(rand() * this.width);
      const gy = Math.floor(rand() * this.height);
      if (this.grid[gy * this.width + gx] === 0) {
        return { x: (gx + 0.5) * this.scale, y: (gy + 0.5) * this.scale };
      }
    }
    // Fallback search
    for (let gy = 0; gy < this.height; gy += 4) {
      for (let gx = 0; gx < this.width; gx += 4) {
        if (this.grid[gy * this.width + gx] === 0) {
          return { x: (gx + 0.5) * this.scale, y: (gy + 0.5) * this.scale };
        }
      }
    }
    return null;
  }
}

function getWordAngle(direction: WordArtTextDirection, rand: () => number): number {
  switch (direction) {
    case 'horizontal':
      return 0;
    case 'horizontal_vertical':
    case 'mixed':
      // 0 or vertical (-90 deg)
      return rand() > 0.42 ? 0 : -Math.PI / 2;
    case 'left_angled':
      // Rotate diagonal toward the left: -45 deg
      return -Math.PI / 4;
    case 'left_right_angled':
      // Diagonals in both directions: -45 deg and +45 deg
      return rand() > 0.5 ? -Math.PI / 4 : Math.PI / 4;
    case 'right_angled':
      // Rotate diagonal toward the right: +45 deg
      return Math.PI / 4;
    case 'vertical':
      // Vertical: -90 deg
      return -Math.PI / 2;
    default:
      return 0;
  }
}

interface PlacedWord {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: number | string;
  angle: number;
  color: string;
}

/**
 * High-definition Organic Word Cloud Generator
 * Places user-provided words inside the chosen shape silhouette with dense packing,
 * strong visual hierarchy, zero overlap, and accurate text orientation.
 */
export function renderWordArtToCanvas(
  canvas: HTMLCanvasElement,
  config: WordArtConfig,
  renderWidth = 1000,
  renderHeight = 1000
) {
  canvas.width = renderWidth;
  canvas.height = renderHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rand = createPrng(config.seed || 42);

  // 1. Fill Solid Background Color
  const bgColor = config.backgroundColor || '#000000';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, renderWidth, renderHeight);

  // 2. Setup Palette & Color Helper
  const scheme = WORD_ART_COLOR_SCHEMES.find((s) => s.id === config.colorScheme);
  const rawPalette = scheme ? scheme.colors : [config.fontColor || '#FFFFFF'];
  const palette = rawPalette.map((c) => ensureColorContrast(c, bgColor));
  const primaryColor = ensureColorContrast(config.fontColor || '#FFFFFF', bgColor);

  let paletteColorIdx = 0;
  const getWordColor = (isPrimary = false) => {
    if (isPrimary) {
      return primaryColor;
    }
    const color = palette[paletteColorIdx % palette.length];
    paletteColorIdx++;
    return color;
  };

  // 3. User Words Gathering & Hierarchy
  const primaryText = (config.primaryName || '').trim();
  const rawOtherWords = (config.otherText || [])
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  // Exclude primary name completely from secondary/filler pool to prevent duplicate appearances
  const filteredOtherWords = rawOtherWords.filter(
    (w) => !primaryText || w.toLowerCase() !== primaryText.toLowerCase()
  );

  const defaultFillerWords = [
    'Together', 'Memories', 'Forever', 'Happiness', 'Joy',
    'Home', 'Blessings', 'Cherish', 'Family', 'Love'
  ].filter((w) => !primaryText || w.toLowerCase() !== primaryText.toLowerCase());

  const fillerPool = filteredOtherWords.length > 0 ? filteredOtherWords : defaultFillerWords;

  // 4. Shape Mask & Occupancy Grid Setup
  const shape = config.shape || 'heart';
  const shapeMask = createShapeMask(shape, renderWidth, renderHeight);
  const cellScale = 3;
  const grid = new OccupancyGrid(renderWidth, renderHeight, cellScale, shapeMask.isInside);

  // Visual center of mass
  const baseDim = Math.min(renderWidth, renderHeight);
  const scaleRatio = baseDim / 800;
  const fontFam = config.fontFamily || 'Montserrat';

  const centerX = renderWidth / 2;
  const centerY = shape === 'heart' ? renderHeight * 0.44 : shape === 'tree' ? renderHeight * 0.42 : renderHeight * 0.48;

  // 5. Generate Target Word Items by Font Size Tiers
  interface WordItemPlan {
    text: string;
    fontSize: number;
    fontWeight: number | string;
    isPrimary: boolean;
  }

  const itemsToPlace: WordItemPlan[] = [];

  // Tier 1: Large Bold Hero Primary Word — EXACTLY ONCE!
  if (primaryText.length > 0) {
    itemsToPlace.push({
      text: primaryText,
      fontSize: Math.round((50 + rand() * 8) * scaleRatio),
      fontWeight: 900,
      isPrimary: true
    });
  } else if (fillerPool.length > 0) {
    itemsToPlace.push({
      text: fillerPool[0],
      fontSize: Math.round((50 + rand() * 8) * scaleRatio),
      fontWeight: 900,
      isPrimary: true
    });
  }

  // Tier 2: Large words across key shape regions — ONLY from fillerPool (NO primaryText repetition!)
  const tier2Count = 8;
  for (let i = 0; i < tier2Count; i++) {
    const word = fillerPool[i % fillerPool.length];
    itemsToPlace.push({
      text: word,
      fontSize: Math.round((30 + rand() * 8) * scaleRatio),
      fontWeight: 800,
      isPrimary: false
    });
  }

  // Tier 3: Medium words — ONLY from fillerPool
  const tier3Count = 18;
  for (let i = 0; i < tier3Count; i++) {
    const word = fillerPool[(i + 3) % fillerPool.length];
    itemsToPlace.push({
      text: word,
      fontSize: Math.round((21 + rand() * 6) * scaleRatio),
      fontWeight: 700,
      isPrimary: false
    });
  }

  // Tier 4: Small words for density — ONLY from fillerPool
  const tier4Count = 34;
  for (let i = 0; i < tier4Count; i++) {
    const word = fillerPool[(i + 7) % fillerPool.length];
    itemsToPlace.push({
      text: word,
      fontSize: Math.round((14 + rand() * 5) * scaleRatio),
      fontWeight: 600,
      isPrimary: false
    });
  }

  // Tier 5: Mini contour words to trace the exact shape outline and corners — ONLY from fillerPool
  const tier5Count = 48;
  for (let i = 0; i < tier5Count; i++) {
    const word = fillerPool[(i + 13) % fillerPool.length];
    itemsToPlace.push({
      text: word,
      fontSize: Math.round((9 + rand() * 4) * scaleRatio),
      fontWeight: 600,
      isPrimary: false
    });
  }

  // 6. Anchor points for balanced multi-focal distribution
  const anchorPoints: { x: number; y: number }[] = [];
  if (shape === 'heart') {
    anchorPoints.push(
      { x: centerX, y: centerY },
      { x: centerX - renderWidth * 0.22, y: centerY - renderHeight * 0.16 }, // Left lobe
      { x: centerX + renderWidth * 0.22, y: centerY - renderHeight * 0.16 }, // Right lobe
      { x: centerX, y: centerY + renderHeight * 0.22 }, // Lower body
      { x: centerX, y: centerY + renderHeight * 0.38 } // Bottom tip
    );
  } else {
    anchorPoints.push({ x: centerX, y: centerY });
  }

  const placedWords: PlacedWord[] = [];

  // Helper to measure text bounding box
  const measureTextBox = (text: string, fontSize: number, fontWeight: number | string) => {
    ctx.font = `${fontWeight} ${fontSize}px "${fontFam}", sans-serif`;
    const m = ctx.measureText(text);
    const w = m.width;
    const h = fontSize * 0.82;
    return { w, h };
  };

  // 7. Place Each Word Item via Archimedean Spiral Search
  let hasPlacedPrimary = false;

  for (let idx = 0; idx < itemsToPlace.length; idx++) {
    const item = itemsToPlace[idx];
    const isItemPrimary = primaryText.length > 0 && item.text.toLowerCase() === primaryText.toLowerCase();

    // Strict guard: ensure primary name is placed only once
    if (isItemPrimary && hasPlacedPrimary) {
      continue;
    }

    let curFontSize = item.fontSize;
    let placed = false;

    // Up to 2 size attempts if space is tight
    for (let attemptSize = 0; attemptSize < 2 && !placed; attemptSize++) {
      const angle = getWordAngle(config.textDirection || 'horizontal', rand);
      const { w, h } = measureTextBox(item.text, curFontSize, item.fontWeight);

      // Determine starting seed center for the spiral
      let startPoint: { x: number; y: number };
      if (idx < anchorPoints.length) {
        startPoint = anchorPoints[idx];
      } else {
        startPoint = grid.findRandomEmptyCell(rand) || { x: centerX, y: centerY };
      }

      // Archimedean spiral search: r = b * theta
      const maxRadius = Math.max(renderWidth, renderHeight) * 0.65;
      const stepTheta = 0.22;
      const b = 2.0;

      for (let theta = 0; !placed; theta += stepTheta) {
        const r = b * theta;
        if (r > maxRadius) break;

        const candidateX = startPoint.x + r * Math.cos(theta) * (renderWidth / renderHeight);
        const candidateY = startPoint.y + r * Math.sin(theta);

        if (grid.canPlace(candidateX, candidateY, w, h, angle, 2.5)) {
          grid.markPlaced(candidateX, candidateY, w, h, angle, 2.5);
          if (isItemPrimary) {
            hasPlacedPrimary = true;
          }
          placedWords.push({
            text: item.text,
            x: candidateX,
            y: candidateY,
            fontSize: curFontSize,
            fontWeight: item.fontWeight,
            angle,
            color: getWordColor(item.isPrimary)
          });
          placed = true;
          break;
        }
      }

      if (!placed) {
        curFontSize = Math.round(curFontSize * 0.78);
      }
    }
  }

  // 8. Render All Placed Words Onto Canvas (The words themselves form the silhouette!)
  for (let i = 0; i < placedWords.length; i++) {
    const pw = placedWords[i];
    ctx.save();
    ctx.translate(pw.x, pw.y);
    if (pw.angle !== 0) {
      ctx.rotate(pw.angle);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = pw.color;
    ctx.font = `${pw.fontWeight} ${pw.fontSize}px "${fontFam}", sans-serif`;
    ctx.fillText(pw.text, 0, 0);
    ctx.restore();
  }
}
