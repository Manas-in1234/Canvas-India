import React from 'react';

export type AcrylicProductIconType =
  | 'block'
  | 'panel'
  | 'wall'
  | 'print'
  | 'collage'
  | 'split'
  | 'signage';

export interface AcrylicProductIconProps {
  iconType: AcrylicProductIconType | string;
  className?: string;
}

/**
 * Clean, minimal SVG/CSS product icons matching the Canvas Products panel style.
 * Zero photographic images; uses soft stone outlines and muted blue (#0E4A93/40) geometric shapes.
 */
export const AcrylicProductIcon: React.FC<AcrylicProductIconProps> = ({
  iconType,
  className = ''
}) => {
  switch (iconType) {
    case 'block':
      // Acrylic Photo Block -> small upright rectangular acrylic block
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <svg
            viewBox="0 0 32 32"
            className="w-7 h-7 overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            {/* Subtle 3D acrylic block back-edge */}
            <rect
              x="8.5"
              y="4.5"
              width="17"
              height="21"
              rx="1.5"
              fill="#0E4A93"
              fillOpacity="0.22"
            />
            {/* Front upright block face */}
            <rect
              x="6"
              y="7"
              width="17"
              height="21"
              rx="1.5"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.8"
            />
          </svg>
        </div>
      );

    case 'panel':
      // Acrylic Photo Panel -> rectangular acrylic panel with subtle panel divisions/details
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="flex items-center gap-1">
            <div className="w-5 h-6 border-2 border-stone-400 rounded-xs bg-white" />
            <div className="flex flex-col gap-1">
              <div className="w-2 h-2.5 bg-[#0E4A93]/40 rounded-xs" />
              <div className="w-2 h-2.5 bg-[#0E4A93]/40 rounded-xs" />
            </div>
          </div>
        </div>
      );

    case 'wall':
      // Acrylic Wall Art -> 3-panel wall-art style arrangement
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="space-y-1">
            <div className="w-6 h-2.5 bg-[#0E4A93]/40 rounded-xs" />
            <div className="flex gap-1">
              <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
              <div className="w-2.5 h-3 bg-[#0E4A93]/40 rounded-xs" />
            </div>
          </div>
        </div>
      );

    case 'print':
      // Acrylic Print -> single landscape rectangular panel
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="w-7 h-5 border-2 border-stone-400 rounded-xs bg-white" />
        </div>
      );

    case 'collage':
      // Acrylic Collage -> 2x2 arrangement of small panels
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-3 h-3 bg-[#0E4A93]/40 rounded-xs" />
          </div>
        </div>
      );

    case 'split':
      // Acrylic Split Panel -> 3 vertical acrylic panels
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
            <div className="w-2 h-6 bg-[#0E4A93]/40 rounded-xs" />
          </div>
        </div>
      );

    case 'signage':
      // Acrylic Signage -> rectangular signage panel with subtle corner standoffs
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="w-7 h-5 border-2 border-stone-400 rounded-xs bg-white relative flex items-center justify-center">
            <span className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute bottom-0.5 left-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full bg-[#0E4A93]/50" />
            <div className="w-3.5 h-1 bg-[#0E4A93]/35 rounded-full" />
          </div>
        </div>
      );

    default:
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="w-6 h-6 border-2 border-stone-400 rounded-xs bg-white" />
        </div>
      );
  }
};

export default AcrylicProductIcon;
