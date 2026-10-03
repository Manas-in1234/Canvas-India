import React, { useMemo } from 'react';

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
  wallImageSrc?: string;
  wallNaturalAspect?: number;
  wallBounds?: WallBounds;
  className?: string;
}

// A minimal, mostly-empty wall photo (light wall, low console, single plant)
// so a modestly-sized frame reads naturally, the way canvaschamp.in's product
// gallery shows it — not a large frame dominating a busy, furnished room.
const DEFAULT_WALL_IMAGE = 'https://images.unsplash.com/photo-1687075197041-91fba1013e1d?w=1200&h=900&fit=crop&q=80';
const DEFAULT_WALL_ASPECT = 4 / 3;
// Small, centered zone on the open wall above the console — deliberately
// tight so the frame stays modest-sized instead of filling the whole photo.
const DEFAULT_WALL_BOUNDS: WallBounds = { minX: 0.32, maxX: 0.68, minY: 0.08, maxY: 0.4 };
// After fitting the frame to its zone, shrink it further so it reads like a
// real small/medium print on a wall rather than a poster filling the space.
const FRAME_FILL_FACTOR = 0.62;

const SIZE_PATTERN = /(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i;

function parseAspectRatio(sizeLabel?: string): number {
  if (!sizeLabel) return 2 / 3;
  const match = sizeLabel.match(SIZE_PATTERN);
  if (!match) return 2 / 3;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return 2 / 3;
  return w / h;
}

function formatSizeCaption(sizeLabel?: string): string {
  if (!sizeLabel) return '';
  const match = sizeLabel.match(SIZE_PATTERN);
  if (!match) return sizeLabel;
  return `${match[1]}" X ${match[2]}"`;
}

// Live, reactive "hanging on the wall" preview: re-renders instantly whenever
// the selected shape, size or product photo changes, instead of relying on a
// pre-baked static composite image. The wall photo keeps its true aspect
// ratio (letterboxed if the surrounding card is a different shape) so the
// frame is always placed and scaled correctly, never stretched or distorted.
export const WallPreview: React.FC<WallPreviewProps> = ({
  imageSrc,
  shape = 'rectangle',
  sizeLabel,
  wallImageSrc = DEFAULT_WALL_IMAGE,
  wallNaturalAspect = DEFAULT_WALL_ASPECT,
  wallBounds = DEFAULT_WALL_BOUNDS,
  className = '',
}) => {
  const shapeKey = (shape || '').toLowerCase();
  const isCircle = shapeKey === 'circle';
  const isTriangle = shapeKey === 'triangle';

  const ratio = useMemo(() => {
    if (isCircle || shapeKey === 'square') return 1;
    if (isTriangle) return 1;
    if (shapeKey === 'panoramic') return 2.2;
    return parseAspectRatio(sizeLabel);
  }, [shapeKey, isCircle, isTriangle, sizeLabel]);

  // Fit the frame (at its target aspect ratio) inside the wall's safe hanging
  // zone, centered — like object-fit: contain, but for a positioned overlay.
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
    w *= FRAME_FILL_FACTOR;
    h *= FRAME_FILL_FACTOR;
    const left = wallBounds.minX + (boxW - w) / 2;
    const top = wallBounds.minY + (boxH - h) / 2;
    return { left: left * 100, top: top * 100, width: w * 100, height: h * 100 };
  }, [ratio, wallBounds]);

  const clipPath = isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined;

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
            className="relative w-full h-full bg-white"
            style={{
              padding: isTriangle ? 0 : '3%',
              boxShadow: '0 16px 26px -10px rgba(0,0,0,0.5), 0 3px 8px -3px rgba(0,0,0,0.3)',
              borderRadius: isCircle ? '50%' : 2,
              clipPath,
            }}
          >
            <div
              className="w-full h-full overflow-hidden"
              style={{
                borderRadius: isCircle ? '50%' : 0,
                clipPath,
              }}
            >
              <img src={imageSrc} alt="Product on wall preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallPreview;
