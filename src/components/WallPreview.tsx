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

// Reuses the same proven, clutter-free living-room wall photo and "safe"
// hanging zone already used by the Acrylic Room View feature — an open wall
// above the sofa, left of the plants/windows — instead of a random stock shot.
const DEFAULT_WALL_IMAGE = '/assets/acrylic/acrylic-panel-living.jpg';
const DEFAULT_WALL_ASPECT = 800 / 600;
const DEFAULT_WALL_BOUNDS: WallBounds = { minX: 0.08, maxX: 0.77, minY: 0.04, maxY: 0.53 };

function parseAspectRatio(sizeLabel?: string): number {
  if (!sizeLabel) return 2 / 3;
  const match = sizeLabel.match(/(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 2 / 3;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return 2 / 3;
  return w / h;
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
