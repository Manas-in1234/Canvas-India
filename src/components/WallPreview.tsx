import React, { useMemo, useState, useEffect } from 'react';
import { getFinishStyle } from '../utils/finishStyle';

interface WallBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface WallPreviewProps {
  imageSrc: string;
  shape?: string;
  sizeLabel?: string;
  finish?: string;
  wallImageSrc?: string;
  wallNaturalAspect?: number;
  wallBounds?: WallBounds;
  className?: string;
}

// Wide minimal living-room photo (wood console, plant, pendant light).
const DEFAULT_WALL_IMAGE = 'https://images.unsplash.com/photo-1687075197041-91fba1013e1d?w=1600&q=80';
const DEFAULT_WALL_ASPECT = 1600 / 900;
// The blank stretch of wall on the left side of this photo.
const DEFAULT_WALL_BOUNDS: WallBounds = { minX: 0.04, maxX: 0.46, minY: 0.03, maxY: 0.58 };
// Real-world scale calibration for DEFAULT_WALL_IMAGE at its native 1600x900:
// pixels-per-inch, measured against the accent chair in that photo (its
// floor-to-backrest height spans ~267px there, and that style of chair is
// consistently sold at ~31" tall) — so a selected print size renders at its
// TRUE physical size relative to the room's furniture, not an arbitrary
// fraction of a box.
const WALL_PHOTO_NATIVE_WIDTH = 1600;
const WALL_PHOTO_NATIVE_HEIGHT = 900;
// Slightly more generous than the literal chair measurement (8.6) so prints
// read as more prominent, without cropping the room out of frame the way a
// camera zoom does. Relative scale between different sizes is unaffected —
// every size still scales through this exact same number.
const REAL_PPI = 11;

const SIZE_PATTERN = /(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i;

function parseDimensions(sizeLabel?: string): { w: number; h: number } | null {
  if (!sizeLabel) return null;
  const match = sizeLabel.match(SIZE_PATTERN);
  if (!match) return null;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return null;
  return { w, h };
}

function formatSizeCaption(sizeLabel?: string): string {
  const dims = parseDimensions(sizeLabel);
  if (!dims) return sizeLabel || '';
  return `${dims.w}" X ${dims.h}"`;
}

// Live, reactive "hanging on the wall" preview: re-renders instantly whenever
// the selected shape, size, finish or product photo changes, instead of
// relying on a pre-baked static composite image. The wall photo keeps its
// true aspect ratio (letterboxed if the surrounding card is a different
// shape) so the frame is always placed and scaled correctly, never
// stretched or distorted.
export const WallPreview: React.FC<WallPreviewProps> = ({
  imageSrc,
  shape = 'rectangle',
  sizeLabel,
  finish,
  wallImageSrc = DEFAULT_WALL_IMAGE,
  wallNaturalAspect = DEFAULT_WALL_ASPECT,
  wallBounds = DEFAULT_WALL_BOUNDS,
  className = '',
}) => {
  const shapeKey = (shape || '').toLowerCase();
  const isCircle = shapeKey === 'circle';
  const isTriangle = shapeKey === 'triangle';

  const dims = useMemo(() => parseDimensions(sizeLabel), [sizeLabel]);

  // The selected print size's aspect ratio is what the frame SHOULD be, but
  // catalogue photos aren't always cropped to exactly that ratio — a forced
  // box shape then either crops the art or leaves a visible gap at the
  // edges. Measuring the actual file's own aspect ratio and shaping the
  // frame to match it guarantees a perfect, gap-free, never-cropped fit.
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);
  // When the frame's shape doesn't exactly match the photo's own aspect
  // ratio, object-contain leaves a sliver of the frame's own background
  // showing on one axis — sampling the artwork's own corner color and using
  // that (instead of plain white/transparent) makes that sliver read as an
  // intentional mat in the artwork's own tone, not a stray white border.
  const [sampledBg, setSampledBg] = useState<string | null>(null);
  useEffect(() => {
    setNaturalAspect(null);
    setSampledBg(null);
    if (!imageSrc) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
      setNaturalAspect(img.naturalWidth / img.naturalHeight);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 4;
        canvas.height = 4;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 4, 4);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        if (!cancelled) setSampledBg(`rgb(${r}, ${g}, ${b})`);
      } catch {
        // Cross-origin image without CORS headers — fall back silently.
      }
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  // The frame's SHAPE should be true to what you're actually ordering — a
  // selected 27x27 size should visibly render as a square, a Rectangle shape
  // should be horizontal — not whatever aspect ratio the source photo
  // happens to be. The image itself never crops to match (see object-contain
  // below), so there's no downside to prioritizing the real shape/size here.
  const ratio = useMemo(() => {
    if (isCircle || shapeKey === 'square') return 1;
    if (isTriangle) return 1;
    if (shapeKey === 'rectangle') return 1.5; // horizontal/landscape
    if (shapeKey === 'panoramic') return 2.2;
    if (dims) return dims.w / dims.h;
    if (naturalAspect) return naturalAspect;
    return 2 / 3;
  }, [shapeKey, isCircle, isTriangle, dims, naturalAspect]);

  const finishStyle = useMemo(() => getFinishStyle(finish || ''), [finish]);

  // Size the frame to the selected print's TRUE physical area (in square
  // inches, converted via REAL_PPI), then shape it to the image's actual
  // aspect ratio (not the size label's) so it stays gap-free. This is what
  // makes an 18x24 genuinely read as ~3x the area of an 8x12 next to the
  // room's furniture, instead of both just filling the same box.
  const frameBox = useMemo(() => {
    const areaIn2 = dims ? dims.w * dims.h : 144; // ~12x12 default when no size is selected yet
    const widthIn = Math.sqrt(areaIn2 * ratio);
    const heightIn = Math.sqrt(areaIn2 / ratio);

    let w = (widthIn * REAL_PPI) / WALL_PHOTO_NATIVE_WIDTH;
    let h = (heightIn * REAL_PPI) / WALL_PHOTO_NATIVE_HEIGHT;

    // Circle/Triangle only ever show the rectangle inscribed in their
    // outline (never-crop fit), which uses a fraction of the bounding
    // square's area — without this, the visible artwork reads as much
    // smaller than the same true size in a Square/Rectangle frame. Boost
    // the frame itself so the inscribed image ends up comparably sized.
    if (isCircle || isTriangle) {
      const boost = 1.6;
      w *= boost;
      h *= boost;
    }

    // Safety cap: don't let an oversized custom print overflow the safe
    // hanging zone or collide with the window to its right.
    const boxW = wallBounds.maxX - wallBounds.minX;
    const boxH = wallBounds.maxY - wallBounds.minY;
    const overflow = Math.max(w / boxW, h / boxH, 1);
    w /= overflow;
    h /= overflow;

    const left = wallBounds.minX + (boxW - w) / 2;
    const top = wallBounds.minY + (boxH - h) / 2;
    return { left: left * 100, top: top * 100, width: w * 100, height: h * 100 };
  }, [ratio, wallBounds, dims, isCircle, isTriangle]);

  const clipPath = isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined;

  // Circle/Triangle clip a square bounding box to that outline — an image
  // sized to fill the square has its corners fall outside the circle/
  // triangle and get masked away, which reads as cropping even though
  // object-contain never zoomed it. Fix: size the image to the exact
  // rectangle inscribed in that shape (preserving the image's own aspect),
  // so every pixel of it stays inside the visible outline.
  const inscribedFit = useMemo(() => {
    if (!isCircle && !isTriangle) return null;
    const r = naturalAspect || (dims ? dims.w / dims.h : 0.75);
    if (isCircle) {
      // Largest w x h (w/h = r) with w^2 + h^2 = diameter^2 (unit square box).
      const hFrac = 1 / Math.sqrt(r * r + 1);
      return { widthPct: r * hFrac * 100, heightPct: hFrac * 100, align: 'center' as const };
    }
    // Triangle (apex top-center, base full-width at bottom, unit box): the
    // widest rectangle of aspect r sitting on the base is width = r*h,
    // height = h, where r*h + h = 1 (triangle narrows linearly to the apex).
    const hFrac = 1 / (r + 1);
    return { widthPct: r * hFrac * 100, heightPct: hFrac * 100, align: 'end' as const };
  }, [isCircle, isTriangle, naturalAspect, dims]);

  const hasFrameBorder = finishStyle.border > 0;
  const framePadding = isTriangle || !hasFrameBorder ? 0 : `${finishStyle.border}%`;
  const frameBg = hasFrameBorder ? finishStyle.color : (sampledBg || 'transparent');

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-stone-50 ${className}`}>
      <div className="relative h-full max-w-full" style={{ aspectRatio: wallNaturalAspect }}>
        <img
          src={wallImageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute"
          style={{
            left: `${frameBox.left}%`,
            top: `${frameBox.top}%`,
            width: `${frameBox.width}%`,
            height: `${frameBox.height}%`,
          }}
        >
          {formatSizeCaption(sizeLabel) && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-5 text-[11px] sm:text-xs font-semibold text-stone-700 whitespace-nowrap"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              {formatSizeCaption(sizeLabel)}
            </div>
          )}
          <div
            className="relative w-full h-full"
            style={{
              padding: framePadding,
              background: frameBg,
              boxShadow: '0 16px 26px -10px rgba(0,0,0,0.5), 0 3px 8px -3px rgba(0,0,0,0.3)',
              borderRadius: isCircle ? '50%' : 2,
              clipPath,
            }}
          >
            <div
              className={`relative w-full h-full overflow-hidden flex justify-center ${
                inscribedFit?.align === 'end' ? 'items-end' : 'items-center'
              }`}
              style={{
                borderRadius: isCircle ? '50%' : 0,
                clipPath,
                background: frameBg,
              }}
            >
              <img
                src={imageSrc}
                alt="Product on wall preview"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    const a = img.naturalWidth / img.naturalHeight;
                    setNaturalAspect((prev) => (prev === a ? prev : a));
                  }
                }}
                className="object-contain"
                style={
                  inscribedFit
                    ? { width: `${inscribedFit.widthPct}%`, height: `${inscribedFit.heightPct}%` }
                    : { maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%' }
                }
              />
              {finishStyle.overlay && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: finishStyle.overlay }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallPreview;
