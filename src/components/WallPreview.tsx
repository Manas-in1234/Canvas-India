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
const REAL_PPI = 8.6;

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
  }, [ratio, wallBounds, dims]);

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
