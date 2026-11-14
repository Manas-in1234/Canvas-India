import React, { useId } from 'react';
import { Upload } from 'lucide-react';
import type { ProductLayoutDefinition } from '../data/productGeometry';

export function ShapedLayoutWorkspace({ layout, mobile, children }: {
  layout: ProductLayoutDefinition; mobile: boolean; children: (index: number) => React.ReactNode;
}) {
  const clipId = useId();
  return (
    <div className="mx-auto my-auto w-full max-w-2xl px-4 py-5">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs><clipPath id={clipId} clipPathUnits="objectBoundingBox"><path d={layout.outline} /></clipPath></defs>
      </svg>
      <p className="mb-3 text-center text-xs font-semibold text-stone-600">{layout.name} · {layout.dimensionsSummary}</p>
      <div className="relative mx-auto" style={{
        aspectRatio: layout.aspectRatio,
        width: `min(100%, calc(${mobile ? 32 : 54}vh * ${layout.aspectRatio}))`,
      }}>
        {layout.panels.map((panel, index) => (
          <div key={panel.id} className="absolute" style={{
            left: `${panel.x * 100}%`, top: `${panel.y * 100}%`,
            width: `${panel.w * 100}%`, height: `${panel.h * 100}%`,
            transform: `rotate(${panel.rotation ?? 0}deg)`,
            clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})`,
          }}>
            {children(index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyLayoutPanel({ index, onUpload }: { index: number; onUpload: () => void }) {
  return (
    <button type="button" className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-xs font-semibold text-[#0E4A93]"
      aria-label={`Upload photo for panel ${index + 1}`} onClick={onUpload}>
      <Upload className="h-4 w-4" /> <span>{index + 1}</span>
    </button>
  );
}
