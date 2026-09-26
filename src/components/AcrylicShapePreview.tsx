import React, { useId } from 'react';

export type AcrylicShapeType =
  | 'square'
  | 'rectangle'
  | 'landscape'
  | 'portrait'
  | 'circle'
  | 'oval'
  | 'roundedRectangle'
  | 'heart'
  | 'hexagon';

export interface AcrylicShapePreviewProps {
  shape: AcrylicShapeType | string;
  selected?: boolean;
  className?: string;
}

export function normalizeAcrylicShapeType(shapeInput: string): AcrylicShapeType {
  const key = shapeInput.trim().toLowerCase();
  switch (key) {
    case 'square':
    case 'shape-square':
      return 'square';
    case 'rectangle':
    case 'shape-rectangle':
      return 'rectangle';
    case 'landscape':
    case 'shape-landscape':
      return 'landscape';
    case 'portrait':
    case 'shape-portrait':
      return 'portrait';
    case 'circle':
    case 'shape-circle':
      return 'circle';
    case 'oval':
    case 'shape-oval':
      return 'oval';
    case 'roundedrectangle':
    case 'rounded-rectangle':
    case 'rounded rectangle':
    case 'shape-rounded-rect':
      return 'roundedRectangle';
    case 'heart':
    case 'shape-heart':
      return 'heart';
    case 'hexagon':
    case 'shape-hexagon':
      return 'hexagon';
    default:
      return 'rectangle';
  }
}

export const AcrylicShapePreview: React.FC<AcrylicShapePreviewProps> = ({
  shape,
  selected = false,
  className = ''
}) => {
  const uid = useId().replace(/:/g, '');
  const shapeType = normalizeAcrylicShapeType(shape);

  const gradId = `acrylic-surf-${uid}`;
  const sheenId = `acrylic-sheen-${uid}`;
  const edgeGradId = `acrylic-edge-${uid}`;
  const shadowId = `acrylic-shadow-${uid}`;
  const clipId = `acrylic-clip-${uid}`;

  const outerStroke = selected ? '#0E4A93' : `url(#${edgeGradId})`;
  const outerStrokeWidth = selected ? 2.2 : 1.75;

  const renderGeometry = () => {
    switch (shapeType) {
      case 'square':
        return <rect x="25" y="13" width="50" height="50" rx="4.5" ry="4.5" />;
      case 'rectangle':
        return <rect x="18" y="16" width="64" height="44" rx="4.5" ry="4.5" />;
      case 'landscape':
        return <rect x="11" y="20" width="78" height="36" rx="4.5" ry="4.5" />;
      case 'portrait':
        return <rect x="30" y="9" width="40" height="58" rx="4.5" ry="4.5" />;
      case 'circle':
        return <circle cx="50" cy="38" r="26" />;
      case 'oval':
        return <ellipse cx="50" cy="38" rx="34" ry="22" />;
      case 'roundedRectangle':
        return <rect x="18" y="16" width="64" height="44" rx="13" ry="13" />;
      case 'heart':
        return (
          <path
            d="M 50 63 C 50 63 22 46 22 27.5 C 22 17.5 30 12 38.5 12 C 44.2 12 48.2 15.2 50 19.5 C 51.8 15.2 55.8 12 61.5 12 C 70 12 78 17.5 78 27.5 C 78 46 50 63 50 63 Z"
            strokeLinejoin="round"
          />
        );
      case 'hexagon':
        return (
          <polygon
            points="35,13 65,13 80,38 65,63 35,63 20,38"
            strokeLinejoin="round"
          />
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 76"
      className={`w-full h-full select-none overflow-visible ${className}`}
      aria-label={`${shapeType} acrylic shape preview`}
      role="img"
    >
      <defs>
        {/* Soft physical elevation shadow */}
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor={selected ? '#0E4A93' : '#0F172A'}
            floodOpacity={selected ? '0.22' : '0.14'}
          />
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            floodColor="#0F172A"
            floodOpacity="0.08"
          />
        </filter>

        {/* Translucent optical acrylic sheet surface */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="45%" stopColor="#F0F9FF" stopOpacity="0.88" />
          <stop offset="80%" stopColor="#E0F2FE" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.65" />
        </linearGradient>

        {/* Laser-polished acrylic edge gradient */}
        <linearGradient id={edgeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Diagonal glass reflection streak */}
        <linearGradient id={sheenId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <clipPath id={clipId}>{renderGeometry()}</clipPath>
      </defs>

      {/* Acrylic Body with Shadow */}
      <g
        filter={`url(#${shadowId})`}
        fill={`url(#${gradId})`}
        stroke={outerStroke}
        strokeWidth={outerStrokeWidth}
      >
        {renderGeometry()}
      </g>

      {/* Clipped internal glass reflections & inner crystal bevel */}
      <g clipPath={`url(#${clipId})`} pointerEvents="none">
        {/* Diagonal acrylic light reflection band */}
        <polygon
          points="5,0 48,0 22,76 -15,76"
          fill={`url(#${sheenId})`}
        />
        <polygon
          points="54,0 64,0 38,76 28,76"
          fill="#FFFFFF"
          fillOpacity="0.35"
        />

        {/* Inner diamond-polished bevel highlight */}
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.9"
          strokeWidth="2.4"
        >
          {renderGeometry()}
        </g>
      </g>
    </svg>
  );
};

export default AcrylicShapePreview;
