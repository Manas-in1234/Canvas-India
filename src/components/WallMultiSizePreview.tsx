import React, { useMemo } from 'react';

interface WallMultiSizePreviewProps {
  imageSrc: string;
  sizes: string[];
  wallImageSrc?: string;
  wallNaturalAspect?: number;
  className?: string;
}

// Same wall photo used by the single Room View preview, for visual
// consistency between gallery slots.
const DEFAULT_WALL_IMAGE = 'https://images.unsplash.com/photo-1687075197041-91fba1013e1d?w=1600&q=80';
const DEFAULT_WALL_ASPECT = 1600 / 900;

// Same real-world calibration as WallPreview (same source photo): pixels per
// inch at the photo's native 1600x900, measured against the accent chair's
// real ~31" height. Sizes here must be true-to-scale against the console —
// a 16x16 should look like it genuinely sits around console height, not
// bigger than the sofa and not a postage stamp.
const WALL_PHOTO_NATIVE_WIDTH = 1600;
const WALL_PHOTO_NATIVE_HEIGHT = 900;
const REAL_PPI = 8.6;

// Safe wall zone: left portion of the photo, clear of the window on the right.
const ZONE_LEFT = 0.05;
const ZONE_RIGHT = 0.47;
const ZONE_TOP = 0.09;
const GAP = 0.016;

const SIZE_PATTERN = /(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i;

function parseDims(label: string): { w: number; h: number } {
  const m = label.match(SIZE_PATTERN);
  if (!m) return { w: 10, h: 10 };
  return { w: parseFloat(m[1]), h: parseFloat(m[2]) };
}

// Shows the SAME product photo mounted at several of its real selectable
// sizes side by side, true to each other's actual physical scale against
// the room's furniture — the "multi-size" gallery image canvaschamp.in
// always includes, and why that one looks right: a 16x16 reads as roughly
// console-height, not sofa-sized.
export const WallMultiSizePreview: React.FC<WallMultiSizePreviewProps> = ({
  imageSrc,
  sizes,
  wallImageSrc = DEFAULT_WALL_IMAGE,
  wallNaturalAspect = DEFAULT_WALL_ASPECT,
  className = '',
}) => {
  const picks = useMemo(() => {
    const uniq = Array.from(new Set((sizes || []).filter(Boolean)));
    const source = uniq.length > 0 ? uniq : ['16x16 inch', '12x12 inch', '10x10 inch', '8x8 inch'];
    return source
      .map((label) => ({ label, dims: parseDims(label) }))
      .sort((a, b) => b.dims.w * b.dims.h - a.dims.w * a.dims.h)
      .slice(0, 4);
  }, [sizes]);

  const frames = useMemo(() => {
    const zoneWidth = ZONE_RIGHT - ZONE_LEFT;
    const raw = picks.map((p) => ({
      label: p.label,
      dims: p.dims,
      w: (p.dims.w * REAL_PPI) / WALL_PHOTO_NATIVE_WIDTH,
      h: (p.dims.h * REAL_PPI) / WALL_PHOTO_NATIVE_HEIGHT,
    }));

    const totalWidth = raw.reduce((sum, f) => sum + f.w, 0) + GAP * Math.max(0, raw.length - 1);
    // Uniform safety scale-down if the row would overflow the safe zone —
    // preserves true RELATIVE proportions, just fits the display.
    const fit = totalWidth > zoneWidth ? zoneWidth / totalWidth : 1;

    let left = ZONE_LEFT + (zoneWidth - totalWidth * fit) / 2;
    return raw.map((f) => {
      const w = f.w * fit;
      const h = f.h * fit;
      const frame = { label: f.label, dims: f.dims, left, top: ZONE_TOP, w, h };
      left += w + GAP * fit;
      return frame;
    });
  }, [picks]);

  return (
    <div className={`relative w-full h-full bg-stone-50 ${className}`}>
      <div className="relative h-full max-w-full" style={{ aspectRatio: wallNaturalAspect }}>
        <img src={wallImageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {frames.map((f) => (
          <div
            key={f.label}
            className="absolute"
            style={{ left: `${f.left * 100}%`, top: `${f.top * 100}%`, width: `${f.w * 100}%`, height: `${f.h * 100}%` }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-5 text-[10px] sm:text-xs font-semibold text-stone-700 whitespace-nowrap"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              {f.dims.w}&quot; X {f.dims.h}&quot;
            </div>
            <div
              className="relative w-full h-full overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 14px 22px -8px rgba(0,0,0,0.5), 0 3px 8px -3px rgba(0,0,0,0.3)' }}
            >
              <img src={imageSrc} alt={`${f.dims.w}x${f.dims.h} preview`} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallMultiSizePreview;
