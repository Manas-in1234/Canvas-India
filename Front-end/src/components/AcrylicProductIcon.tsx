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
      // Acrylic Photo Block -> compact upright/thick square acrylic block
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="relative w-6 h-6 flex items-center justify-center">
            <div className="absolute top-1 left-1 w-5 h-5 bg-[#0E4A93]/30 border border-[#0E4A93]/40 rounded-xs" />
            <div className="relative -translate-x-0.5 -translate-y-0.5 w-5 h-5 border-2 border-stone-400 bg-white rounded-xs flex items-center justify-center">
              <div className="w-3 h-3 bg-[#0E4A93]/25 rounded-[1px]" />
            </div>
          </div>
        </div>
      );

    case 'panel':
      // Acrylic Photo Panel -> flat rectangular acrylic panel
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="w-7 h-5 border-2 border-stone-400 rounded-xs bg-white" />
        </div>
      );

    case 'wall':
      // Acrylic Wall Art -> rectangular wall-art panel
      return (
        <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
          <div className="w-7 h-5 border-2 border-stone-400 bg-[#0E4A93]/20 rounded-xs" />
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
      // Acrylic Collage -> 2x2 arrangement of 4 equal panels
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
