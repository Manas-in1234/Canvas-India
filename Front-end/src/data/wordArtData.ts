// ============================================================================
// WORD ART ON CANVAS - DATA & GENERATOR ENGINE
// Provides:
// 1. Ratio-based size catalogs matching reference screenshots
// 2. Shapes, color schemes, font families, text direction configurations
// 3. Client-side deterministic Word Art rendering engine on HTML5 Canvas
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

export interface WordArtConfig {
  primaryName: string;
  fontColor: string;
  backgroundColor: string;
  fontFamily: string;
  otherText: string[];
  shape: 'none' | 'heart' | 'circle' | 'star' | 'butterfly' | 'tree' | 'apple' | 'cloud';
  colorScheme: string;
  textDirection: 'horizontal' | 'vertical' | 'mixed';
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
  { id: 'monochrome', label: 'Monochrome (White/Slate)', colors: ['#FFFFFF', '#E2E8F0', '#CBD5E1', '#94A3B8'] },
  { id: 'neutrals', label: 'Neutrals (Cream/Stone)', colors: ['#F8FAFC', '#E2E8F0', '#F1F5F9', '#CBD5E1'] },
  { id: 'ocean', label: 'Ocean Blues (Canvas India)', colors: ['#FFFFFF', '#38BDF8', '#0284C7', '#BAE6FD', '#60A5FA'] },
  { id: 'sunset', label: 'Sunset Glow (Warm Amber)', colors: ['#FDE047', '#FB923C', '#F43F5E', '#FDA4AF', '#FFFFFF'] },
  { id: 'emerald', label: 'Emerald Forest (Nature)', colors: ['#34D399', '#10B981', '#6EE7B7', '#A7F3D0', '#FFFFFF'] },
  { id: 'vibrant', label: 'Vibrant Multi-Color', colors: ['#F43F5E', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'] }
];

export const DEFAULT_WORD_ART_CONFIG: WordArtConfig = {
  primaryName: 'LOVE & FAMILY',
  fontColor: '#FFFFFF',
  backgroundColor: '#0F172A',
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
  shape: 'none',
  colorScheme: 'monochrome',
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

/**
 * Creates clipping path on canvas for chosen shape
 */
function applyShapePath(ctx: CanvasRenderingContext2D, shape: string, w: number, h: number) {
  ctx.beginPath();
  const pad = Math.min(w, h) * 0.04;
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
      const r = Math.min(cw, ch) * 0.48;
      const topY = cy - r * 0.6;
      ctx.moveTo(cx, cy + r * 0.95);
      ctx.bezierCurveTo(cx - r * 1.4, cy + r * 0.1, cx - r * 1.4, topY - r * 0.4, cx - r * 0.5, topY - r * 0.4);
      ctx.bezierCurveTo(cx - r * 0.1, topY - r * 0.4, cx, topY + r * 0.2, cx, topY + r * 0.2);
      ctx.bezierCurveTo(cx, topY + r * 0.2, cx + r * 0.1, topY - r * 0.4, cx + r * 0.5, topY - r * 0.4);
      ctx.bezierCurveTo(cx + r * 1.4, topY - r * 0.4, cx + r * 1.4, cy + r * 0.1, cx, cy + r * 0.95);
      break;
    }
    case 'star': {
      const spikes = 5;
      const outerR = Math.min(cw, ch) / 2;
      const innerR = outerR * 0.45;
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
      ctx.lineTo(cx, cy - outerR);
      break;
    }
    case 'butterfly': {
      const r = Math.min(cw, ch) * 0.45;
      ctx.moveTo(cx, cy + r * 0.5);
      ctx.bezierCurveTo(cx - r * 1.2, cy + r * 0.8, cx - r * 1.3, cy - r * 0.8, cx - r * 0.2, cy - r * 0.5);
      ctx.bezierCurveTo(cx - r * 0.1, cy - r * 0.7, cx, cy - r * 0.8, cx, cy - r * 0.4);
      ctx.bezierCurveTo(cx, cy - r * 0.8, cx + r * 0.1, cy - r * 0.7, cx + r * 0.2, cy - r * 0.5);
      ctx.bezierCurveTo(cx + r * 1.3, cy - r * 0.8, cx + r * 1.2, cy + r * 0.8, cx, cy + r * 0.5);
      break;
    }
    case 'tree': {
      const r = Math.min(cw, ch) * 0.46;
      ctx.moveTo(cx - r * 0.2, cy + r * 0.9);
      ctx.lineTo(cx + r * 0.2, cy + r * 0.9);
      ctx.lineTo(cx + r * 0.15, cy + r * 0.3);
      ctx.arc(cx, cy - r * 0.2, r * 0.65, 0.2, Math.PI - 0.2, true);
      ctx.lineTo(cx - r * 0.15, cy + r * 0.3);
      ctx.closePath();
      break;
    }
    case 'apple': {
      const r = Math.min(cw, ch) * 0.45;
      ctx.moveTo(cx, cy - r * 0.5);
      ctx.bezierCurveTo(cx + r * 0.8, cy - r * 0.8, cx + r * 1.1, cy + r * 0.7, cx, cy + r * 0.9);
      ctx.bezierCurveTo(cx - r * 1.1, cy + r * 0.7, cx - r * 0.8, cy - r * 0.8, cx, cy - r * 0.5);
      break;
    }
    case 'cloud': {
      const r = Math.min(cw, ch) * 0.35;
      ctx.arc(cx - r * 0.6, cy, r * 0.5, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(cx - r * 0.2, cy - r * 0.45, r * 0.55, Math.PI, Math.PI * 1.85);
      ctx.arc(cx + r * 0.4, cy - r * 0.35, r * 0.5, Math.PI * 1.3, Math.PI * 0.1);
      ctx.arc(cx + r * 0.7, cy + r * 0.1, r * 0.45, Math.PI * 1.8, Math.PI * 0.5);
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
 * High-definition Canvas Word Art Generator
 * Renders an organic, dense typography cloud with prominent primary text
 * and surrounding contextual words.
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

  const rand = createPrng(config.seed || 1);

  // 1. Fill Canvas Background
  ctx.fillStyle = config.backgroundColor || '#0F172A';
  ctx.fillRect(0, 0, renderWidth, renderHeight);

  // 2. Setup Palette Colors
  const scheme = WORD_ART_COLOR_SCHEMES.find((s) => s.id === config.colorScheme);
  const palette = scheme ? scheme.colors : [config.fontColor || '#FFFFFF'];
  const getColor = (isPrimary = false) => {
    if (isPrimary && config.fontColor) return config.fontColor;
    return palette[Math.floor(rand() * palette.length)];
  };

  // 3. Prepare Shape Clipping Path
  ctx.save();
  if (config.shape && config.shape !== 'none') {
    applyShapePath(ctx, config.shape, renderWidth, renderHeight);
    ctx.clip();
  }

  // 4. Clean word list
  const primary = (config.primaryName || 'LOVE').trim().toUpperCase();
  const rawOthers = config.otherText.filter((t) => t.trim().length > 0);
  const others = rawOthers.length > 0 ? rawOthers : ['Together', 'Memories', 'Forever', 'Happiness', 'Joy'];
  const fontFam = config.fontFamily || 'Montserrat';

  // 5. Dense Multi-Row Word Matrix Layout
  // Divide canvas into visual rows with proportional heights
  const numRows = 16;
  const rowHeight = renderHeight / numRows;

  // Strategic rows for the prominent primary name
  const primaryRowIndices = new Set([5, 8, 11]);

  for (let r = 0; r < numRows; r++) {
    const isPrimaryRow = primaryRowIndices.has(r);
    const yCenter = (r + 0.5) * rowHeight;

    if (isPrimaryRow) {
      // Big bold primary text row
      const fontSize = Math.round(rowHeight * (r === 8 ? 1.4 : 1.15));
      ctx.font = `900 ${fontSize}px "${fontFam}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = getColor(true);

      if (r === 8) {
        // Center hero title
        ctx.fillText(primary, renderWidth / 2, yCenter);
      } else {
        // Dual primary placement or flanked by words
        const textWidth = ctx.measureText(primary).width;
        if (textWidth < renderWidth * 0.45) {
          ctx.fillText(primary, renderWidth * 0.28, yCenter);
          ctx.fillText(primary, renderWidth * 0.72, yCenter);
        } else {
          ctx.fillText(primary, renderWidth / 2, yCenter);
        }
      }
    } else {
      // Dense word stream across row
      let xCursor = renderWidth * 0.04;
      const fontSize = Math.round(rowHeight * (0.65 + rand() * 0.35));
      ctx.font = `700 ${fontSize}px "${fontFam}", sans-serif`;
      ctx.textBaseline = 'middle';

      while (xCursor < renderWidth * 0.94) {
        const word = others[Math.floor(rand() * others.length)];
        const isVertical = config.textDirection === 'mixed' && rand() > 0.82;
        const color = getColor(false);
        ctx.fillStyle = color;

        if (isVertical) {
          ctx.save();
          ctx.translate(xCursor + fontSize / 2, yCenter);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.fillText(word, 0, 0);
          ctx.restore();
          xCursor += fontSize + 12;
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(word, xCursor, yCenter);
          const wMetrics = ctx.measureText(word);
          xCursor += wMetrics.width + Math.round(rowHeight * 0.35);

          // Add occasional separator dot or symbol
          if (rand() > 0.65 && xCursor < renderWidth * 0.9) {
            ctx.fillStyle = getColor(false);
            ctx.beginPath();
            ctx.arc(xCursor + 6, yCenter, 2.5, 0, Math.PI * 2);
            ctx.fill();
            xCursor += 16;
          }
        }
      }
    }
  }

  ctx.restore();

  // 6. Draw subtle shape outline if shape is specified for clarity
  if (config.shape && config.shape !== 'none') {
    ctx.save();
    applyShapePath(ctx, config.shape, renderWidth, renderHeight);
    ctx.strokeStyle = `${config.fontColor}33`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
