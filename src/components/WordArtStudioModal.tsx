import React, { useMemo, useRef, useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';

// ============================================================================
// WORD ART STUDIO — Size picker -> Personalization form -> Canvas word-cloud
// preview generator -> hands the rendered PNG back to the customizer as if
// it were an uploaded photo.
// ============================================================================

interface WordArtStudioModalProps {
  onClose: () => void;
  onComplete: (dataUrl: string, sizeLabel: string, price: number) => void;
}

type ShapeKey = 'none' | 'butterfly' | 'diamond' | 'heart' | 'hexagon' | 'home' | 'pentagon' | 'round';
type RatioKey = 'square' | '3:2' | '4:3' | '16:9';
type Step = 'size' | 'personalize';

interface SizeOption {
  w: number;
  h: number;
  label: string;
  price: number;
}

const RATIO_TABS: { key: RatioKey; label: string; ratio: number }[] = [
  { key: 'square', label: 'Square', ratio: 1 },
  { key: '3:2', label: '3:2 Ratio', ratio: 1.5 },
  { key: '4:3', label: '4:3 Ratio', ratio: 4 / 3 },
  { key: '16:9', label: '16:9 Ratio', ratio: 16 / 9 }
];

const BASE_PRICE = 454; // acrylic-word-art starting price, at the smallest square size (8"x8" = 64 sq in)
const BASE_AREA = 64;

function buildSizesForRatio(ratio: number): SizeOption[] {
  const sizes: SizeOption[] = [];
  if (ratio === 1) {
    for (let side = 8; side <= 30; side += 2) {
      const price = Math.round((BASE_PRICE * (side * side)) / BASE_AREA / 10) * 10;
      sizes.push({ w: side, h: side, label: `${side}" x ${side}"`, price });
    }
  } else {
    for (let h = 8; h <= 24; h += 2) {
      const w = Math.round(h * ratio);
      const price = Math.round((BASE_PRICE * (w * h)) / BASE_AREA / 10) * 10;
      sizes.push({ w, h, label: `${w}" x ${h}"`, price });
    }
  }
  return sizes;
}

const FONT_OPTIONS = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Impact'];

const SHAPE_OPTIONS: { key: ShapeKey; label: string; emoji: string }[] = [
  { key: 'none', label: 'None', emoji: '' },
  { key: 'butterfly', label: 'Butterfly', emoji: '🦋' },
  { key: 'diamond', label: 'Diamond', emoji: '♦' },
  { key: 'heart', label: 'Heart', emoji: '♥' },
  { key: 'hexagon', label: 'Hexagon', emoji: '⬢' },
  { key: 'home', label: 'Home', emoji: '🏠' },
  { key: 'pentagon', label: 'Pentagon', emoji: '⬟' },
  { key: 'round', label: 'Round', emoji: '○' }
];

const SYMBOL_CATEGORIES: { name: string; symbols: string[] }[] = [
  { name: 'Alphabets', symbols: ['™', '@', '¶', '°C', '%', 'ε', 'λ', 'χ'] },
  { name: 'Animals', symbols: ['🐶', '🐱', '🐰', '🦋', '🐦', '🐠', '🦁', '🐯', '🐼', '🐨'] },
  { name: 'Arrows', symbols: ['➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '🔄', '↩️'] },
  { name: 'Common Shapes', symbols: ['⭐', '⬤', '◼️', '▲', '♦️', '⬡', '◆', '⭕', '◻️', '⬢'] },
  { name: 'Flowers', symbols: ['🌸', '🌹', '🌺', '🌻', '🌼', '💐', '🌷', '🪷'] },
  { name: 'Heart', symbols: ['❤️', '💕', '💖', '💗', '💓', '💞', '💘', '🤍'] },
  { name: 'Nature', symbols: ['🌿', '🍃', '🌳', '🌙', '⭐', '☀️', '🌈', '❄️'] },
  { name: 'Stars and Planets', symbols: ['⭐', '✨', '🌟', '💫', '🌙', '🪐', '🌍', '☄️'] }
];

const COLOR_SCHEMES: Record<string, string[]> = {
  'Neutrals': ['#44403c', '#78716c', '#a8a29e', '#1c1917'],
  'Pastels': ['#ec4899', '#60a5fa', '#a78bfa', '#ca8a04'],
  'Vibrant': ['#dc2626', '#2563eb', '#16a34a', '#f59e0b'],
  'Monochrome': ['#000000', '#404040', '#737373', '#a3a3a3'],
  'Sunset': ['#f97316', '#ef4444', '#eab308', '#a855f7']
};

const MAX_SYMBOLS = 16;
const MAX_OTHER_LINES = 10;
const MAX_LINE_CHARS = 20;

// Returns one or more non-self-intersecting sub-paths whose UNION forms the
// shape mask. A point counts as "inside the shape" if it falls inside ANY of
// these — this avoids the classic bug where a single hand-built path with
// multiple loops self-intersects and the canvas winding rule cancels out
// most of its interior (which is what produced two disconnected blobs
// instead of a butterfly previously: that whole shape was one tangled path).
// Regular N-sided polygon centered at (cx, cy), point-up by default.
function regularPolygon(cx: number, cy: number, radius: number, sides: number, rotationOffset = -Math.PI / 2): Path2D {
  const p = new Path2D();
  const step = (Math.PI * 2) / sides;
  for (let i = 0; i <= sides; i++) {
    const angle = rotationOffset + step * i;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

function buildShapePaths(shape: ShapeKey, w: number, h: number): Path2D[] {
  const cx = w / 2;
  const cy = h / 2;
  const radius = (Math.min(w, h) / 2) * 0.95;

  if (shape === 'none') {
    // No mask — words can land anywhere on the canvas.
    const p = new Path2D();
    p.rect(0, 0, w, h);
    return [p];
  }

  if (shape === 'round') {
    const p = new Path2D();
    p.ellipse(cx, cy, radius, radius, 0, 0, Math.PI * 2);
    return [p];
  }

  if (shape === 'diamond') {
    return [regularPolygon(cx, cy, radius, 4, -Math.PI / 2)];
  }

  if (shape === 'pentagon') {
    return [regularPolygon(cx, cy, radius, 5, -Math.PI / 2)];
  }

  if (shape === 'hexagon') {
    return [regularPolygon(cx, cy, radius, 6, -Math.PI / 2)];
  }

  if (shape === 'home') {
    // A simple house silhouette: rectangular body + triangular roof, traced
    // as one non-self-intersecting loop.
    const p = new Path2D();
    const bodyTop = cy - h * 0.05;
    const left = cx - w * 0.42;
    const right = cx + w * 0.42;
    const bottom = cy + h * 0.46;
    p.moveTo(left, bottom);
    p.lineTo(left, bodyTop);
    p.lineTo(cx, cy - h * 0.46);
    p.lineTo(right, bodyTop);
    p.lineTo(right, bottom);
    p.closePath();
    return [p];
  }

  if (shape === 'heart') {
    // Exact parametric heart curve (x = 16sin³t, y = 13cos t − 5cos 2t − 2cos
    // 3t − cos 4t) traced as a single smooth closed loop — mathematically a
    // true heart outline (sharp bottom point, clean top notch), not an
    // approximation built out of overlapping ellipses.
    const p = new Path2D();
    const scaleX = (w * 0.46) / 16;
    const scaleY = (h * 0.42) / 17;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const px = cx + hx * scaleX;
      const py = cy - hy * scaleY;
      if (i === 0) p.moveTo(px, py);
      else p.lineTo(px, py);
    }
    p.closePath();
    return [p];
  }

  // Butterfly: a slim body plus four independent, properly tapered wing
  // shapes (rounded near the body, pointed at the tip) instead of plain
  // ellipses — each wing is the first operation on its own fresh Path2D, so
  // it's a clean closed loop with no stray connecting lines between wings.
  const body = new Path2D();
  body.ellipse(cx, cy, w * 0.022, h * 0.4, 0, 0, Math.PI * 2);

  const buildWing = (s: 1 | -1, fore: boolean): Path2D => {
    const p = new Path2D();
    if (fore) {
      p.moveTo(cx + s * w * 0.015, cy - h * 0.05);
      p.bezierCurveTo(cx + s * w * 0.1, cy - h * 0.32, cx + s * w * 0.4, cy - h * 0.48, cx + s * w * 0.49, cy - h * 0.24);
      p.bezierCurveTo(cx + s * w * 0.54, cy - h * 0.05, cx + s * w * 0.4, cy + h * 0.08, cx + s * w * 0.18, cy + h * 0.06);
      p.bezierCurveTo(cx + s * w * 0.08, cy + h * 0.05, cx + s * w * 0.02, cy - h * 0.0, cx + s * w * 0.015, cy - h * 0.05);
    } else {
      p.moveTo(cx + s * w * 0.015, cy + h * 0.03);
      p.bezierCurveTo(cx + s * w * 0.06, cy + h * 0.16, cx + s * w * 0.3, cy + h * 0.44, cx + s * w * 0.2, cy + h * 0.47);
      p.bezierCurveTo(cx + s * w * 0.1, cy + h * 0.49, cx, cy + h * 0.24, cx, cy + h * 0.08);
      p.bezierCurveTo(cx, cy + h * 0.05, cx + s * w * 0.005, cy + h * 0.03, cx + s * w * 0.015, cy + h * 0.03);
    }
    p.closePath();
    return p;
  };

  const upperLeft = buildWing(-1, true);
  const lowerLeft = buildWing(-1, false);
  const upperRight = buildWing(1, true);
  const lowerRight = buildWing(1, false);

  return [body, upperLeft, lowerLeft, upperRight, lowerRight];
}

export const WordArtStudioModal: React.FC<WordArtStudioModalProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState<Step>('size');

  // Size step state
  const [activeRatio, setActiveRatio] = useState<RatioKey>('square');
  const [selectedSize, setSelectedSize] = useState<SizeOption>(() => buildSizesForRatio(1)[0]);
  const sizesForActiveRatio = useMemo(
    () => buildSizesForRatio(RATIO_TABS.find((r) => r.key === activeRatio)?.ratio || 1),
    [activeRatio]
  );

  // Personalization step state
  const [primaryName, setPrimaryName] = useState('');
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0]);
  const [otherText, setOtherText] = useState('');
  const [shape, setShape] = useState<ShapeKey>('heart');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [colorSchemeName, setColorSchemeName] = useState<keyof typeof COLOR_SCHEMES>('Neutrals');
  const [textDirection, setTextDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const otherTextLines = useMemo(
    () => otherText.split('\n').filter((l) => l.trim().length > 0).slice(0, MAX_OTHER_LINES).map((l) => l.slice(0, MAX_LINE_CHARS)),
    [otherText]
  );

  const toggleSymbol = (sym: string) => {
    setSelectedSymbols((prev) => {
      if (prev.includes(sym)) return prev.filter((s) => s !== sym);
      if (prev.length >= MAX_SYMBOLS) return prev;
      return [...prev, sym];
    });
  };

  const handleGeneratePreview = () => {
    setGenerating(true);
    // Let the UI paint the "generating" state before the (synchronous)
    // canvas work runs, so the button feedback isn't dropped.
    requestAnimationFrame(() => {
      const PX = 900; // offscreen render resolution, scaled to the chosen aspect ratio
      const w = PX;
      const h = Math.round(PX * (selectedSize.h / selectedSize.w));
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setGenerating(false);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      const shapePaths = buildShapePaths(shape, w, h);

      // Rasterize the shape mask once into pixel data. Sampling actual pixel
      // coverage (instead of checking only a handful of bounding-box corners
      // against vector paths) is what lets thin/pointed regions — star tips,
      // the heart's notch, butterfly wing tips — actually get filled: those
      // areas are tiny and a few random corner checks almost never land
      // inside them, which is why the previous version only ever filled the
      // large, easy central blob of each shape and never read as the real
      // silhouette.
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) {
        setGenerating(false);
        return;
      }
      maskCtx.fillStyle = '#000';
      shapePaths.forEach((sp) => maskCtx.fill(sp));
      const maskData = maskCtx.getImageData(0, 0, w, h).data;
      const isMaskedAt = (px: number, py: number) => {
        const xi = Math.round(px);
        const yi = Math.round(py);
        if (xi < 0 || yi < 0 || xi >= w || yi >= h) return false;
        return maskData[(yi * w + xi) * 4 + 3] > 10;
      };
      // A word box "fits" if most of a sampled grid across it falls inside
      // the mask — a tolerant threshold (not 100%) so words can hug curved
      // and pointed edges instead of being rejected outright near them.
      const boxFits = (cx: number, cy: number, boxW: number, boxH: number) => {
        const cols = 4;
        const rows = 3;
        let inside = 0;
        let total = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const px = cx - boxW / 2 + (boxW * c) / (cols - 1);
            const py = cy - boxH / 2 + (boxH * r) / (rows - 1);
            total++;
            if (isMaskedAt(px, py)) inside++;
          }
        }
        return inside / total >= 0.82;
      };

      const palette = COLOR_SCHEMES[colorSchemeName] || [fontColor];
      const name = primaryName.trim() || 'YOUR NAME';
      const pool: { text: string; weight: 'large' | 'medium' | 'small' }[] = [
        { text: name, weight: 'large' },
        { text: name, weight: 'large' },
        { text: name, weight: 'medium' },
        ...otherTextLines.map((l) => ({ text: l, weight: 'medium' as const })),
        ...otherTextLines.map((l) => ({ text: l, weight: 'small' as const })),
        ...selectedSymbols.map((s) => ({ text: s, weight: 'small' as const }))
      ];
      if (pool.length === 0) pool.push({ text: name, weight: 'large' });

      const placed: { x: number; y: number; w: number; h: number }[] = [];
      const overlapsAny = (x: number, y: number, boxW: number, boxH: number) =>
        placed.some(
          (p) =>
            x - boxW / 2 < p.x + p.w / 2 &&
            x + boxW / 2 > p.x - p.w / 2 &&
            y - boxH / 2 < p.y + p.h / 2 &&
            y + boxH / 2 > p.y - p.h / 2
        );

      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.max(w, h) * 0.75;

      // For each word, walk an outward Archimedean spiral from the shape's
      // center and take the first spot where its box both fits the mask and
      // doesn't collide with an already-placed word. A systematic search
      // (not a single random guess per word) is what guarantees every part
      // of the shape — including its thin extremities — eventually gets
      // tried and filled, rather than only the spots random sampling
      // happens to land on.
      const findSpot = (boxW: number, boxH: number): { x: number; y: number } | null => {
        const steps = 260;
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const angle = t * Math.PI * 16 + Math.random() * 0.6;
          const radius = t * maxRadius;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          if (x - boxW / 2 < 0 || x + boxW / 2 > w || y - boxH / 2 < 0 || y + boxH / 2 > h) continue;
          if (!boxFits(x, y, boxW, boxH)) continue;
          if (overlapsAny(x, y, boxW, boxH)) continue;
          return { x, y };
        }
        return null;
      };

      const maxWords = 320;
      let placedCount = 0;
      let consecutiveMisses = 0;

      while (placedCount < maxWords && consecutiveMisses < 40) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        // Sizes scaled down and biased smaller as more words get placed, so
        // later words are small enough to still slot into whatever gaps
        // (including narrow extremities) remain — the classic word-cloud
        // "shrink as you go" approach.
        const shrink = 1 - (placedCount / maxWords) * 0.5;
        const fontSize =
          item.weight === 'large'
            ? Math.round(w * (0.05 + Math.random() * 0.025) * shrink)
            : item.weight === 'medium'
            ? Math.round(w * (0.026 + Math.random() * 0.014) * shrink)
            : Math.round(w * (0.014 + Math.random() * 0.01) * shrink);

        ctx.font = `${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(item.text);
        let boxW = metrics.width * 1.04;
        let boxH = fontSize * 1.08;
        if (textDirection === 'vertical') {
          const tmp = boxW;
          boxW = boxH;
          boxH = tmp;
        }

        const spot = findSpot(boxW, boxH);
        if (!spot) {
          consecutiveMisses++;
          continue;
        }
        consecutiveMisses = 0;

        const color = palette[Math.floor(Math.random() * palette.length)];
        ctx.save();
        ctx.translate(spot.x, spot.y);
        if (textDirection === 'vertical') ctx.rotate(-Math.PI / 2);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.globalAlpha = item.weight === 'large' ? 1 : item.weight === 'medium' ? 0.85 : 0.65;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, 0, 0);
        ctx.restore();

        placed.push({ x: spot.x, y: spot.y, w: boxW, h: boxH });
        placedCount++;
      }

      setPreviewUrl(canvas.toDataURL('image/png'));
      setGenerating(false);
    });
  };

  const handleAddToProduct = () => {
    if (!previewUrl) return;
    onComplete(previewUrl, selectedSize.label, selectedSize.price);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#B91C1C] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step === 'personalize' && (
              <button type="button" onClick={() => setStep('size')} className="text-white/90 hover:text-white cursor-pointer" aria-label="Back to size">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-sm sm:text-base font-bold tracking-wide">
              {step === 'size' ? 'Select Size of Word Art on Acrylic' : `${selectedSize.label} Word Art on Acrylic`}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-white/90 hover:text-white cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'size' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="flex border-b border-stone-200 sticky top-0 bg-white z-10">
              {RATIO_TABS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setActiveRatio(r.key)}
                  className={`flex-1 py-3 text-sm font-semibold cursor-pointer transition-colors ${
                    activeRatio === r.key ? 'text-stone-900 border-b-2 border-[#B91C1C]' : 'text-stone-500 hover:text-stone-700 bg-stone-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="p-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
              {sizesForActiveRatio.map((sz) => {
                const isActive = sz.label === selectedSize.label;
                return (
                  <button
                    key={sz.label}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                      isActive ? 'border-stone-900' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <div className="relative w-full aspect-square flex items-center justify-center">
                      <div
                        className="bg-stone-300"
                        style={{ width: `${30 + (sz.w / Math.max(...sizesForActiveRatio.map((s) => s.w))) * 60}%`, aspectRatio: `${sz.w} / ${sz.h}` }}
                      />
                      {isActive && (
                        <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">✓</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-stone-800">{sz.label}</span>
                    <span className="text-xs font-bold text-[#B91C1C]">₹{sz.price.toLocaleString('en-IN')}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-6 pt-0 flex justify-center">
              <button
                type="button"
                onClick={() => setStep('personalize')}
                className="px-8 py-3 bg-[#B91C1C] hover:bg-[#991515] text-white text-sm font-bold rounded-md shadow-sm transition-colors cursor-pointer"
              >
                CREATE WORD-ART
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
            {/* LEFT: form */}
            <div className="w-full sm:w-[340px] shrink-0 overflow-y-auto border-r border-stone-200 p-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Primary Name (Max:15 Character)</label>
                <input
                  type="text"
                  value={primaryName}
                  maxLength={15}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#B91C1C]"
                  placeholder="e.g. SARAH"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Choose Font Color</label>
                  <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-full h-9 rounded-md border border-stone-300 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Choose Background Color</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded-md border border-stone-300 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Font</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Other Text (Min 5 &amp; max 10 line. Max 20 characters per line)</label>
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#B91C1C] resize-none"
                  placeholder={'One phrase per line\nUp to 20 characters each'}
                />
                <p className="text-[10px] text-stone-400 mt-1">{otherTextLines.length} / {MAX_OTHER_LINES} lines used</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Shape</label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value as ShapeKey)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  {SHAPE_OPTIONS.map((s) => (
                    <option key={s.key} value={s.key}>{s.label} {s.emoji}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700">Select Symbol (Max:{MAX_SYMBOLS} Allowed)</label>
                  <span className="text-[10px] text-stone-400">{selectedSymbols.length} / {MAX_SYMBOLS}</span>
                </div>
                {selectedSymbols.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-stone-50 rounded-md border border-stone-200">
                    {selectedSymbols.map((s) => (
                      <button key={s} type="button" onClick={() => toggleSymbol(s)} className="w-7 h-7 rounded bg-white border border-stone-300 flex items-center justify-center text-sm cursor-pointer" title="Remove">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="border border-stone-200 rounded-md divide-y divide-stone-100 max-h-56 overflow-y-auto">
                  {SYMBOL_CATEGORIES.map((cat) => (
                    <div key={cat.name}>
                      <button
                        type="button"
                        onClick={() => setOpenCategory((c) => (c === cat.name ? null : cat.name))}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                      >
                        <span>{cat.name}</span>
                        <span>{openCategory === cat.name ? '−' : '+'}</span>
                      </button>
                      {openCategory === cat.name && (
                        <div className="px-3 pb-2.5 grid grid-cols-8 gap-1.5">
                          {cat.symbols.map((sym) => (
                            <button
                              key={sym}
                              type="button"
                              onClick={() => toggleSymbol(sym)}
                              className={`w-7 h-7 rounded flex items-center justify-center text-sm border cursor-pointer ${
                                selectedSymbols.includes(sym) ? 'border-[#B91C1C] bg-red-50' : 'border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Color Scheme</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(COLOR_SCHEMES).map(([name, colors]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setColorSchemeName(name as keyof typeof COLOR_SCHEMES)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] font-semibold cursor-pointer ${
                        colorSchemeName === name ? 'border-[#B91C1C] bg-red-50' : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span className="flex">
                        {colors.slice(0, 3).map((c, i) => (
                          <span key={i} className="w-3 h-3 rounded-full border border-white -ml-1 first:ml-0" style={{ backgroundColor: c }} />
                        ))}
                      </span>
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Text Direction</label>
                <select
                  value={textDirection}
                  onChange={(e) => setTextDirection(e.target.value as 'horizontal' | 'vertical')}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={generating}
                className="w-full py-3 bg-[#B91C1C] hover:bg-[#991515] disabled:opacity-60 text-white text-sm font-bold rounded-md shadow-sm transition-colors cursor-pointer"
              >
                {generating ? 'GENERATING...' : 'VIEW YOUR PERSONALIZATION'}
              </button>
            </div>

            {/* RIGHT: preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 overflow-y-auto">
              {previewUrl && (
                <div className="w-full mb-4 px-2">
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-md px-3 py-2 flex items-center gap-2">
                    <span>✥</span>
                    <span>To generate a different Word-Art design/preview, click "View Your Personalization" again.</span>
                  </div>
                </div>
              )}
              <div
                className="bg-white border border-stone-200 rounded-md shadow-sm flex items-center justify-center overflow-hidden"
                style={{ width: '100%', maxWidth: 420, aspectRatio: `${selectedSize.w} / ${selectedSize.h}` }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Word art preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm text-stone-400 px-6 text-center">Click on "View Your Personalization" to generate preview</span>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setStep('size')}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 text-sm font-bold rounded-md hover:border-stone-400 transition-colors cursor-pointer"
                >
                  CHANGE SIZE
                </button>
                <button
                  type="button"
                  onClick={handleAddToProduct}
                  disabled={!previewUrl}
                  className="px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991515] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  ADD TO PRODUCT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordArtStudioModal;
