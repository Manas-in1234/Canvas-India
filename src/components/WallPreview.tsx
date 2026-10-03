import React, { useMemo } from 'react';

interface WallPreviewProps {
  imageSrc: string;
  shape?: string;
  sizeLabel?: string;
  wallImageSrc?: string;
  className?: string;
}

// A clean, warmly-lit living room wall — used as the default backdrop for every
// live room-view preview so the frame always reads as "actually hanging" rather
// than pasted on top of an unrelated photo.
const DEFAULT_WALL = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=80';

function parseAspectRatio(sizeLabel?: string): number {
  if (!sizeLabel) return 4 / 3;
  const match = sizeLabel.match(/(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 4 / 3;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return 4 / 3;
  return w / h;
}

// Live, reactive "hanging on the wall" preview: re-renders instantly whenever
// the selected shape, size or product photo changes, instead of relying on a
// pre-baked static composite image.
export const WallPreview: React.FC<WallPreviewProps> = ({
  imageSrc,
  shape = 'rectangle',
  sizeLabel,
  wallImageSrc,
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

  // Treat the wall container as roughly square/4:3 and clamp the frame to a
  // sensible band on both axes so no shape ever overflows its wall photo.
  const { widthPct, heightPct } = useMemo(() => {
    const baseHeight = 50;
    let w = baseHeight * ratio;
    let h = baseHeight;
    const MAX = 62;
    if (w > MAX) {
      const scale = MAX / w;
      w *= scale;
      h *= scale;
    }
    if (h > MAX) {
      const scale = MAX / h;
      w *= scale;
      h *= scale;
    }
    return { widthPct: w, heightPct: h };
  }, [ratio]);

  const clipPath = isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-100 ${className}`}>
      <img
        src={wallImageSrc || DEFAULT_WALL}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Soft ground shadow under the frame for depth */}
      <div
        className="absolute"
        style={{
          left: `${50 - widthPct / 2}%`,
          top: `${52 - heightPct / 2}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
        }}
      >
        <div
          className="relative w-full h-full bg-white"
          style={{
            padding: isTriangle ? 0 : 7,
            boxShadow: '0 22px 34px -14px rgba(0,0,0,0.5), 0 4px 10px -4px rgba(0,0,0,0.25)',
            borderRadius: isCircle ? '50%' : 3,
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
  );
};

export default WallPreview;
