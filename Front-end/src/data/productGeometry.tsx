import React from 'react';

// ============================================================================
// CENTRALIZED CANVAS PRODUCT GEOMETRY ENGINE
// Single source of truth for all Canvas product geometries:
// - Single Print, Round, Triangle, Heart, Oval, Hexagon, Split, Mosaic, Wall Art, Collage
// Drives:
// 1. Product Cards
// 2. Size Selector Cards & Popup Diagrams
// 3. Main Customizer Workspace
// 4. Free 360 Viewer (3D extruded shapes)
// 5. Room View (Wall hanging)
// 6. Upload Image Masking & Clipping
// ============================================================================

export type CanvasGeometryType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'heart'
  | 'oval'
  | 'hexagon'
  | 'hexagon-cluster'
  | 'split-canvas'
  | 'wall-display'
  | 'mosaic'
  | 'collage';

export interface HexPanelLayout {
  x: number; // 0..1 percentage left
  y: number; // 0..1 percentage top
  w: number; // 0..1 percentage width
  h: number; // 0..1 percentage height
}

export interface CanvasGeometryConfig {
  productTypeId: string;
  geometryType: CanvasGeometryType;
  shapeId: string;
  aspectRatio: number;
  widthInches: number;
  heightInches: number;
  clipPath?: string;
  borderRadius?: string;
  isMultiPanel: boolean;
  panelsCount: number;
  hexPanelsLayout?: HexPanelLayout[];
  renderSvgPreview: (options: {
    isSelected?: boolean;
    widthInches?: number;
    heightInches?: number;
    label?: string;
    diagramType?: string;
  }) => React.ReactNode;
}

export const HEXAGON_CLIP_PATH = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
export const TRIANGLE_CLIP_PATH = 'polygon(50% 0%, 0% 100%, 100% 100%)';
export const CIRCLE_CLIP_PATH = 'circle(50% at 50% 50%)';
export const OVAL_CLIP_PATH = 'ellipse(50% 50% at 50% 50%)';
export const HEART_CLIP_PATH = 'url(#acrylic-clip-shape-heart)';

/**
 * Honeycomb cluster positioning for 1, 2, 3, or 4 hexagon panels.
 * Adjacent hexagons lock together along shared edges.
 */
export function getHexagonClusterLayout(count: number): HexPanelLayout[] {
  if (count === 2) {
    const w = 0.44;
    const h = 0.76;
    const dx = w * 0.75;
    return [
      { x: 0.5 - dx / 2 - w / 2, y: 0.5 - h / 2, w, h },
      { x: 0.5 + dx / 2 - w / 2, y: 0.5 - h / 2, w, h }
    ];
  }
  if (count === 3) {
    const w = 0.36;
    const h = 0.56;
    const dx = w * 0.75;
    const colX1 = 0.5 - dx / 2;
    const colX2 = 0.5 + dx / 2;
    return [
      { x: colX1 - w / 2, y: 0.5 - h, w, h },
      { x: colX1 - w / 2, y: 0.5, w, h },
      { x: colX2 - w / 2, y: 0.5 - h / 2, w, h }
    ];
  }
  if (count === 4) {
    const w = 0.32;
    const h = 0.44;
    const dx = w * 0.75;
    return [
      { x: 0.5 - w / 2, y: 0.5 - h, w, h },
      { x: 0.5 - w / 2, y: 0.5, w, h },
      { x: 0.5 - dx - w / 2, y: 0.5 - h / 2, w, h },
      { x: 0.5 + dx - w / 2, y: 0.5 - h / 2, w, h }
    ];
  }
  // Single hexagon: centered
  const w = 0.74;
  const h = 0.88;
  return [{ x: 0.5 - w / 2, y: 0.5 - h / 2, w, h }];
}

/**
 * Resolves the explicit Canvas product geometry.
 */
export function getCanvasProductGeometry(
  productTypeId: string,
  sizeOption?: {
    widthInches?: number;
    heightInches?: number;
    panels?: any[];
    panelsCount?: number;
    diagramType?: string;
  },
  shapeId?: string
): CanvasGeometryConfig {
  const normType = (productTypeId || '').toLowerCase();
  const panelsCount = sizeOption?.panels?.length || sizeOption?.panelsCount || 1;
  const width = sizeOption?.widthInches || 12;
  const height = sizeOption?.heightInches || 12;
  const rawAspect = width / Math.max(1, height);

  // 1. Hexagon Prints
  if (normType.includes('hexagon')) {
    const hexLayout = getHexagonClusterLayout(panelsCount);
    const aspect = panelsCount === 2 ? 19 / 10 : panelsCount === 3 ? 27 / 13.75 : panelsCount === 4 ? 27 / 19 : 10 / 11.5;
    const hexW = panelsCount === 2 ? 19 : panelsCount === 3 ? 27 : panelsCount === 4 ? 27 : (width || 10);
    const hexH = panelsCount === 2 ? 10 : panelsCount === 3 ? 13.75 : panelsCount === 4 ? 19 : (height || 11);
    return {
      productTypeId,
      geometryType: panelsCount > 1 ? 'hexagon-cluster' : 'hexagon',
      shapeId: 'shape-hexagon',
      aspectRatio: aspect,
      widthInches: hexW,
      heightInches: hexH,
      clipPath: HEXAGON_CLIP_PATH,
      borderRadius: '0px',
      isMultiPanel: panelsCount > 1,
      panelsCount,
      hexPanelsLayout: hexLayout,
      renderSvgPreview: ({ isSelected, widthInches, heightInches, diagramType }) =>
        renderHexagonSvgDiagram({ count: panelsCount, isSelected, widthInches, heightInches, diagramType })
    };
  }

  // 2. Round Canvas
  if (normType.includes('round') || shapeId === 'shape-circle') {
    return {
      productTypeId,
      geometryType: 'circle',
      shapeId: 'shape-circle',
      aspectRatio: 1,
      widthInches: width,
      heightInches: width,
      clipPath: CIRCLE_CLIP_PATH,
      borderRadius: '9999px',
      isMultiPanel: false,
      panelsCount: 1,
      renderSvgPreview: ({ isSelected, widthInches }) => {
        const strokeColor = isSelected ? '#0E4A93' : '#64748b';
        const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';
        return (
          <svg viewBox="0 0 60 48" className="w-full h-full max-h-12">
            <circle cx="30" cy="24" r="18" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <text x="30" y="27" fill={strokeColor} fontSize="8" fontWeight="bold" textAnchor="middle">
              {widthInches || 8}&quot;
            </text>
          </svg>
        );
      }
    };
  }

  // 3. Triangle Canvas
  if (normType.includes('triangle') || shapeId === 'shape-triangle') {
    return {
      productTypeId,
      geometryType: 'triangle',
      shapeId: 'shape-triangle',
      aspectRatio: 1,
      widthInches: width,
      heightInches: height,
      clipPath: TRIANGLE_CLIP_PATH,
      borderRadius: '0px',
      isMultiPanel: false,
      panelsCount: 1,
      renderSvgPreview: ({ isSelected, widthInches }) => {
        const strokeColor = isSelected ? '#0E4A93' : '#64748b';
        const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';
        return (
          <svg viewBox="0 0 60 48" className="w-full h-full max-h-12">
            <polygon points="30,6 50,42 10,42" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" strokeLinejoin="round" />
            <text x="30" y="34" fill={strokeColor} fontSize="7.5" fontWeight="bold" textAnchor="middle">
              {widthInches || 8}&quot;
            </text>
          </svg>
        );
      }
    };
  }

  // 4. Heart Canvas
  if (normType.includes('heart') || shapeId === 'shape-heart') {
    return {
      productTypeId,
      geometryType: 'heart',
      shapeId: 'shape-heart',
      aspectRatio: 1,
      widthInches: width,
      heightInches: width,
      clipPath: HEART_CLIP_PATH,
      borderRadius: '0px',
      isMultiPanel: false,
      panelsCount: 1,
      renderSvgPreview: ({ isSelected, widthInches }) => {
        const strokeColor = isSelected ? '#0E4A93' : '#64748b';
        const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';
        return (
          <svg viewBox="0 0 60 48" className="w-full h-full max-h-12">
            <path
              d="M 30,40 C 12,28 6,18 6,12 C 6,6 12,4 18,4 C 24,4 27,8 30,13 C 33,8 36,4 42,4 C 48,4 54,6 54,12 C 54,18 48,28 30,40 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.6"
            />
            <text x="30" y="24" fill={strokeColor} fontSize="7.5" fontWeight="bold" textAnchor="middle">
              {widthInches || 8}&quot;
            </text>
          </svg>
        );
      }
    };
  }

  // 5. Oval Canvas
  if (normType.includes('oval') || shapeId === 'shape-oval') {
    return {
      productTypeId,
      geometryType: 'oval',
      shapeId: 'shape-oval',
      aspectRatio: rawAspect || 1.25,
      widthInches: width,
      heightInches: height,
      clipPath: OVAL_CLIP_PATH,
      borderRadius: '9999px',
      isMultiPanel: false,
      panelsCount: 1,
      renderSvgPreview: ({ isSelected, widthInches, heightInches }) => {
        const strokeColor = isSelected ? '#0E4A93' : '#64748b';
        const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';
        return (
          <svg viewBox="0 0 60 48" className="w-full h-full max-h-12">
            <ellipse cx="30" cy="24" rx="24" ry="17" fill={fillColor} stroke={strokeColor} strokeWidth="1.8" />
            <text x="30" y="26" fill={strokeColor} fontSize="7" fontWeight="bold" textAnchor="middle">
              {widthInches || 10}&quot;×{heightInches || 8}&quot;
            </text>
          </svg>
        );
      }
    };
  }

  // 6. Split Canvas (Triptych)
  if (normType.includes('split')) {
    return {
      productTypeId,
      geometryType: 'split-canvas',
      shapeId: 'shape-rectangle',
      aspectRatio: 1.5,
      widthInches: width || 36,
      heightInches: height || 24,
      isMultiPanel: true,
      panelsCount: 3,
      renderSvgPreview: ({ isSelected }) => {
        const strokeColor = isSelected ? '#0E4A93' : '#64748b';
        const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';
        return (
          <div className="w-12 h-9 grid grid-cols-3 gap-0.5 items-center">
            <div className={`h-full rounded-[2px] border ${isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-stone-100'}`} />
            <div className={`h-full rounded-[2px] border ${isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-stone-100'}`} />
            <div className={`h-full rounded-[2px] border ${isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-stone-100'}`} />
          </div>
        );
      }
    };
  }

  // 7. Wall Display
  if (normType.includes('wall')) {
    return {
      productTypeId,
      geometryType: 'wall-display',
      shapeId: 'shape-rectangle',
      aspectRatio: 1.1,
      widthInches: width || 24,
      heightInches: height || 22,
      isMultiPanel: true,
      panelsCount: panelsCount || 3,
      renderSvgPreview: ({ isSelected }) => {
        const boxClass = `rounded-[2px] border transition-colors ${
          isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-[#0E4A93]/12'
        }`;
        return (
          <div className="w-11 h-10 flex flex-col gap-0.5">
            <div className={`flex-[1.3] ${boxClass}`} />
            <div className="flex-1 grid grid-cols-2 gap-0.5">
              <div className={boxClass} />
              <div className={boxClass} />
            </div>
          </div>
        );
      }
    };
  }

  // 8. Photo Mosaic
  if (normType.includes('mosaic')) {
    const cols = panelsCount === 4 ? 2 : panelsCount === 9 ? 3 : panelsCount === 16 ? 4 : 2;
    return {
      productTypeId,
      geometryType: 'mosaic',
      shapeId: 'shape-square',
      aspectRatio: 1,
      widthInches: width || 16,
      heightInches: height || 16,
      isMultiPanel: true,
      panelsCount,
      renderSvgPreview: ({ isSelected }) => {
        const boxClass = `rounded-[1px] border ${
          isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-stone-100'
        }`;
        return (
          <div
            className="w-10 h-10 grid gap-0.5 p-0.5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: panelsCount }).map((_, idx) => (
              <div key={idx} className={boxClass} />
            ))}
          </div>
        );
      }
    };
  }

  // 9. Photo Collage
  if (normType.includes('collage')) {
    return {
      productTypeId,
      geometryType: 'collage',
      shapeId: 'shape-square',
      aspectRatio: 1,
      widthInches: width || 16,
      heightInches: height || 16,
      isMultiPanel: false,
      panelsCount,
      renderSvgPreview: ({ isSelected }) => {
        const boxClass = `rounded-[1px] border ${
          isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-stone-100'
        }`;
        const cols = panelsCount === 3 ? 'grid-cols-3' : 'grid-cols-2';
        return (
          <div className={`w-11 h-10 grid ${cols} gap-0.5 p-0.5`}>
            {Array.from({ length: panelsCount }).map((_, idx) => (
              <div key={idx} className={boxClass} />
            ))}
          </div>
        );
      }
    };
  }

  // 10. Default / Single Print (Rectangle/Square)
  const clampedRatio = Math.max(0.65, Math.min(2.1, rawAspect));
  const h = clampedRatio > 1.4 ? 26 : 34;
  const w = Math.round(h * clampedRatio);
  return {
    productTypeId,
    geometryType: 'rectangle',
    shapeId: 'shape-rectangle',
    aspectRatio: rawAspect || 1,
    widthInches: width,
    heightInches: height,
    borderRadius: '2px',
    isMultiPanel: false,
    panelsCount: 1,
    renderSvgPreview: ({ isSelected, widthInches, heightInches }) => {
      const boxClass = `rounded-[3px] border-2 transition-colors ${
        isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-[#0E4A93]/12'
      }`;
      return (
        <div style={{ width: `${w}px`, height: `${h}px` }} className={`${boxClass} flex items-center justify-center`}>
          <span className="text-[7.5px] font-bold text-stone-600">
            {widthInches && heightInches ? `${widthInches}×${heightInches}` : ''}
          </span>
        </div>
      );
    }
  };
}

/**
 * Renders an exact SVG hexagon cluster diagram for size cards & modals.
 */
function renderHexagonSvgDiagram({
  count,
  isSelected,
  widthInches,
  heightInches,
  diagramType
}: {
  count: number;
  isSelected?: boolean;
  widthInches?: number;
  heightInches?: number;
  diagramType?: string;
}): React.ReactNode {
  const strokeColor = isSelected ? '#0E4A93' : '#64748b';
  const fillColor = isSelected ? '#0E4A9322' : '#f8fafc';

  const hexPoints = (cx: number, cy: number, w: number, h: number) =>
    `${cx - w * 0.25},${cy - h * 0.5} ${cx + w * 0.25},${cy - h * 0.5} ${cx + w * 0.5},${cy} ${cx + w * 0.25},${cy + h * 0.5} ${cx - w * 0.25},${cy + h * 0.5} ${cx - w * 0.5},${cy}`;

  let faces: React.ReactNode[] = [];

  if (count === 2 || diagramType === 'hexagon-2') {
    const w = 24;
    const h = 28;
    const cy = 24;
    const dx = w * 0.75;
    faces = [
      <polygon key="h0" points={hexPoints(30 - dx / 2, cy, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.4" />,
      <polygon key="h1" points={hexPoints(30 + dx / 2, cy, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.4" />
    ];
  } else if (count === 3 || diagramType === 'hexagon-3') {
    const w = 18;
    const h = 20;
    const cy = 24;
    const dx = w * 0.75;
    const colX1 = 30 - dx / 2;
    const colX2 = 30 + dx / 2;
    faces = [
      <polygon key="h0" points={hexPoints(colX1, cy - h / 2, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.3" />,
      <polygon key="h1" points={hexPoints(colX1, cy + h / 2, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.3" />,
      <polygon key="h2" points={hexPoints(colX2, cy, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.3" />
    ];
  } else if (count === 4 || diagramType === 'hexagon-4') {
    const w = 16;
    const h = 18;
    const cy = 24;
    const dx = w * 0.75;
    faces = [
      <polygon key="h0" points={hexPoints(30, cy - h / 2, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />,
      <polygon key="h1" points={hexPoints(30, cy + h / 2, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />,
      <polygon key="h2" points={hexPoints(30 - dx, cy, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />,
      <polygon key="h3" points={hexPoints(30 + dx, cy, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
    ];
  } else {
    // 1 Hexagon
    const w = 32;
    const h = 36;
    faces = [
      <polygon key="h0" points={hexPoints(30, 24, w, h)} fill={fillColor} stroke={strokeColor} strokeWidth="1.6" />
    ];
  }

  return (
    <svg viewBox="0 0 60 48" className="w-full h-full max-h-12">
      {faces}
      {widthInches && (
        <text x="30" y="47" fill={strokeColor} fontSize="6" fontWeight="bold" textAnchor="middle">
          {widthInches}&quot;{heightInches ? ` × ${heightInches}"` : ''}
        </text>
      )}
    </svg>
  );
}
