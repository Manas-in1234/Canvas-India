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
// How much of the safe hanging zone the frame fills. Tried true-to-life
// physical scale here (calibrated against the room's furniture) — at that
// scale an 8x8 or 8.3x11.7 print is genuinely tiny next to a whole room, and
// it read as broken/wrong next to reference sites, which always show the
// print large and clearly visible regardless of its actual size. Matching
// that instead: the frame fills almost the whole zone every time, with only
// a gentle size-based nudge so bigger selections still read as bigger.
const FRAME_FILL_FACTOR = 0.98;

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
  useEffect(() => {
    setNaturalAspect(null);
    if (!imageSrc) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth && img.naturalHeight) {
        setNaturalAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  const ratio = useMemo(() => {
    if (isCircle || shapeKey === 'square') return 1;
    if (isTriangle) return 1;
    if (naturalAspect) return naturalAspect;
    if (shapeKey === 'panoramic') return 2.2;
    if (dims) return dims.w / dims.h;
    return 2 / 3;
  }, [shapeKey, isCircle, isTriangle, naturalAspect, dims]);

  // Larger selected sizes should still visibly occupy a bit more of the
  // wall, even when two sizes share the same aspect ratio (e.g. 12x18 vs
  // 24x36) — but gently: every size stays clearly large and visible.
  const sizeScale = useMemo(() => {
    if (!dims) return 1;
    const maxDim = Math.min(Math.max(Math.max(dims.w, dims.h), 8), 40);
    return 0.94 + ((maxDim - 8) / (40 - 8)) * 0.06;
  }, [dims]);

  const finishStyle = useMemo(() => getFinishStyle(finish || ''), [finish]);

  // Fit the frame (at its target aspect ratio) inside the wall's safe hanging
  // zone, centered — like object-fit: contain, but for a positioned overlay —
  // then scale by both the fill factor and the selected size's magnitude.
  const frameBox = useMemo(() => {
    const boxW = wallBounds.maxX - wallBounds.minX;
    const boxH = wallBounds.maxY - wallBounds.minY;
    const boxRatio = boxW / boxH;
    let w = boxW;
    let h = boxH;
    if (ratio >= boxRatio) {
      w = boxW;
      h = w / ratio;
    } else {
      h = boxH;
      w = h * ratio;
    }
    const scale = FRAME_FILL_FACTOR * sizeScale;
    w *= scale;
    h *= scale;
    const left = wallBounds.minX + (boxW - w) / 2;
    const top = wallBounds.minY + (boxH - h) / 2;
    return { left: left * 100, top: top * 100, width: w * 100, height: h * 100 };
  }, [ratio, wallBounds, sizeScale]);

  const clipPath = isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined;

  const hasFrameBorder = finishStyle.border > 0;
  const framePadding = isTriangle || !hasFrameBorder ? 0 : `${finishStyle.border}%`;
  const frameBg = hasFrameBorder ? finishStyle.color : 'transparent';

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
              className="relative w-full h-full overflow-hidden flex items-center justify-center"
              style={{
                borderRadius: isCircle ? '50%' : 0,
                clipPath,
                background: frameBg,
              }}
            >
              <img
                src={imageSrc}
                alt="Product on wall preview"
                className={
                  isCircle || isTriangle
                    ? 'w-full h-full object-cover'
                    : 'max-w-full max-h-full w-full h-full object-contain'
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
