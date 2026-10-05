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

const SIZE_PATTERN = /(\d+(?:\.\d+)?)\s*["”]?\s*x\s*(\d+(?:\.\d+)?)/i;

function parseDims(label: string): { w: number; h: number } {
  const m = label.match(SIZE_PATTERN);
  if (!m) return { w: 10, h: 10 };
  return { w: parseFloat(m[1]), h: parseFloat(m[2]) };
}

// Staggered gallery-wall cluster slots (fractions of the wall photo),
// matching canvaschamp's "see it in every size" layout: one larger photo
// up top, two smaller alongside, one more below-center.
const SLOTS = [
  { x: 0.05, y: 0.05 },
  { x: 0.33, y: 0.02 },
  { x: 0.58, y: 0.07 },
  { x: 0.3, y: 0.36 },
];

// Shows the SAME product photo mounted at several of its real selectable
// sizes side by side, so the customer can compare scale on an actual wall —
// the "multi-size" gallery image canvaschamp.in always includes.
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

  const maxArea = Math.max(...picks.map((p) => p.dims.w * p.dims.h), 1);

  return (
    <div className={`relative w-full h-full bg-stone-50 ${className}`}>
      <div className="relative h-full max-w-full" style={{ aspectRatio: wallNaturalAspect }}>
        <img src={wallImageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {picks.map((p, i) => {
          const slot = SLOTS[i] || SLOTS[SLOTS.length - 1];
          const relScale = 0.55 + 0.45 * Math.sqrt((p.dims.w * p.dims.h) / maxArea);
          const w = 0.22 * relScale;
          const ratio = p.dims.w / p.dims.h || 1;
          const h = w / ratio;

          return (
            <div
              key={p.label}
              className="absolute"
              style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }}
            >
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-5 text-[10px] sm:text-xs font-semibold text-stone-700 whitespace-nowrap"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                {p.dims.w}&quot; X {p.dims.h}&quot;
              </div>
              <div
                className="relative w-full h-full bg-white"
                style={{ padding: '4%', boxShadow: '0 14px 22px -8px rgba(0,0,0,0.5), 0 3px 8px -3px rgba(0,0,0,0.3)' }}
              >
                <div className="w-full h-full overflow-hidden">
                  <img src={imageSrc} alt={`${p.dims.w}x${p.dims.h} preview`} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WallMultiSizePreview;
