import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, Layers } from 'lucide-react';

export interface LayoutModalOption {
  id: string;
  name: string;
  photoCount: number;
  panelsCount: number;
  description: string;
  diagramType: string;
  arrangement?: string;
  dimensionsSummary?: string;
}

export interface SelectLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: 'canvas' | 'acrylic';
  productId: string;
  productName: string;
  currentLayoutId?: string;
  onSelectLayout: (layout: LayoutModalOption) => void;
}

export const SelectLayoutModal: React.FC<SelectLayoutModalProps> = ({
  isOpen,
  onClose,
  material: _material,
  productId,
  productName,
  currentLayoutId = '',
  onSelectLayout
}) => {
  if (!isOpen) return null;

  const normId = productId.toLowerCase();

  // Layouts based on product type
  const productLayouts: LayoutModalOption[] = useMemo(() => {
    // 1. Hexagon Prints
    if (normId.includes('hexagon')) {
      return [
        {
          id: 'hexagon-1',
          name: 'Single Hexagon Print',
          photoCount: 1,
          panelsCount: 1,
          description: '1 Individual Honeycomb Canvas Panel',
          diagramType: 'hexagon-1',
          arrangement: 'single',
          dimensionsSummary: '10" × 11.5"'
        },
        {
          id: 'hexagon-2',
          name: 'Hexagon Bundle of 2',
          photoCount: 2,
          panelsCount: 2,
          description: '2 Interlocking Honeycomb Canvas Panels',
          diagramType: 'hexagon-2',
          arrangement: 'twoHex',
          dimensionsSummary: '19" × 10"'
        },
        {
          id: 'hexagon-3',
          name: 'Hexagon Bundle of 3',
          photoCount: 3,
          panelsCount: 3,
          description: '3 Honeycomb Cluster Panels (2 stacked + 1 nested)',
          diagramType: 'hexagon-3',
          arrangement: 'threeHex',
          dimensionsSummary: '27" × 13.75"'
        },
        {
          id: 'hexagon-4',
          name: 'Hexagon Bundle of 4',
          photoCount: 4,
          panelsCount: 4,
          description: '4-Piece Diamond Honeycomb Cluster',
          diagramType: 'hexagon-4',
          arrangement: 'fourHex',
          dimensionsSummary: '27" × 19"'
        }
      ];
    }

    // 2. Wall Display
    if (normId.includes('wall') || normId.includes('display')) {
      return [
        {
          id: 'wall-display-3a',
          name: '3-Piece Gallery A',
          photoCount: 3,
          panelsCount: 3,
          description: '(1) 12"×18" Tall + (2) 10"×8" Mini panels',
          diagramType: 'wall-display-3a',
          arrangement: 'threeCollage',
          dimensionsSummary: '18" × 24" total'
        },
        {
          id: 'wall-display-3b',
          name: '3-Piece Center Winged',
          photoCount: 3,
          panelsCount: 3,
          description: '(1) 16"×20" Large Center + (2) 10"×8" Wings',
          diagramType: 'wall-display-3b',
          arrangement: 'threeSplit',
          dimensionsSummary: '40" × 16" total'
        },
        {
          id: 'wall-display-4a',
          name: '4-Piece Gallery Showcase',
          photoCount: 4,
          panelsCount: 4,
          description: '(1) 24"×16" + (1) 11"×17" + (2) 12"×8"',
          diagramType: 'wall-display-4a',
          arrangement: 'fourGrid',
          dimensionsSummary: '34" × 24" total'
        },
        {
          id: 'wall-display-tiered',
          name: '4-Piece Tiered Staircase',
          photoCount: 4,
          panelsCount: 4,
          description: 'Staircase flow: 10"×8", 14"×11", 20"×16", 10"×8"',
          diagramType: 'wall-display-tiered',
          arrangement: 'fourGrid',
          dimensionsSummary: '36" × 20" total'
        }
      ];
    }

    // 3. Split Canvas / Split Acrylic
    if (normId.includes('split')) {
      return [
        {
          id: 'split-2p',
          name: '2-Piece Diptych Split',
          photoCount: 1,
          panelsCount: 2,
          description: '1 panoramic photo split across 2 panels',
          diagramType: 'split-2',
          arrangement: 'twoSplit',
          dimensionsSummary: '24" × 16" total'
        },
        {
          id: 'split-3p-36x24',
          name: '3-Piece Triptych Split',
          photoCount: 1,
          panelsCount: 3,
          description: '1 continuous panoramic photo split across 3 panels',
          diagramType: 'split-3',
          arrangement: 'threeSplit',
          dimensionsSummary: '36" × 24" total'
        },
        {
          id: 'split-4panel-10x20',
          name: '4-Piece Quad Split',
          photoCount: 1,
          panelsCount: 4,
          description: '1 wide landscape photo split into 4 tall vertical sections',
          diagramType: 'split-4',
          arrangement: 'fourGrid',
          dimensionsSummary: '40" × 20" total'
        }
      ];
    }

    // 4. Photo Collage
    if (normId.includes('collage')) {
      return [
        {
          id: 'layout-2-split',
          name: '2 Photos Dual Split',
          photoCount: 2,
          panelsCount: 2,
          description: '2 Photos side by side with clean dividing line',
          diagramType: 'collage-2',
          arrangement: 'twoSplit'
        },
        {
          id: 'layout-3-collage',
          name: '3 Photos Feature Collage',
          photoCount: 3,
          panelsCount: 3,
          description: '1 Main top photograph with 2 supporting bottom photos',
          diagramType: 'collage-3',
          arrangement: 'threeCollage'
        },
        {
          id: 'layout-4-grid',
          name: '4 Photos Grid (2×2)',
          photoCount: 4,
          panelsCount: 4,
          description: 'Classic symmetrical 2×2 square quad grid',
          diagramType: 'collage-4',
          arrangement: 'fourGrid'
        },
        {
          id: 'layout-9-grid',
          name: '9 Photos Grid (3×3)',
          photoCount: 9,
          panelsCount: 9,
          description: 'High-density 3×3 square photo collection',
          diagramType: 'collage-9',
          arrangement: 'nineGrid'
        }
      ];
    }

    // 5. Photo Mosaic
    if (normId.includes('mosaic')) {
      return [
        {
          id: 'mosaic-4p-10x10',
          name: '4 Mosaic Tiles (2×2)',
          photoCount: 4,
          panelsCount: 4,
          description: '4 artistic mosaic photo blocks',
          diagramType: 'mosaic-4',
          arrangement: 'fourGrid',
          dimensionsSummary: '10" × 10"'
        },
        {
          id: 'mosaic-6p-18x12',
          name: '6 Mosaic Tiles (3×2)',
          photoCount: 6,
          panelsCount: 6,
          description: '6 artistic mosaic photo blocks in landscape layout',
          diagramType: 'mosaic-6',
          arrangement: 'sixGrid',
          dimensionsSummary: '18" × 12"'
        },
        {
          id: 'mosaic-9p-18x18',
          name: '9 Mosaic Tiles (3×3)',
          photoCount: 9,
          panelsCount: 9,
          description: '9 artistic mosaic photo blocks in square grid',
          diagramType: 'mosaic-9',
          arrangement: 'nineGrid',
          dimensionsSummary: '18" × 18"'
        },
        {
          id: 'mosaic-16p-20x20',
          name: '16 Mosaic Tiles (4×4)',
          photoCount: 16,
          panelsCount: 16,
          description: '16 detailed micro-photo mosaic blocks',
          diagramType: 'mosaic-16',
          arrangement: 'sixteenGrid',
          dimensionsSummary: '20" × 20"'
        }
      ];
    }

    // 6. Default: Single Print (canvas-single, acrylic-print)
    return [
      {
        id: 'layout-1-single',
        name: 'Single Full Canvas',
        photoCount: 1,
        panelsCount: 1,
        description: 'Classic single edge-to-edge photo layout',
        diagramType: 'single-1',
        arrangement: 'single'
      },
      {
        id: 'layout-2-split',
        name: '2 Photos Split',
        photoCount: 2,
        panelsCount: 2,
        description: '2 photos side-by-side with crisp divider',
        diagramType: 'collage-2',
        arrangement: 'twoSplit'
      },
      {
        id: 'layout-top-bottom',
        name: 'Top & Bottom (2 Photos)',
        photoCount: 2,
        panelsCount: 2,
        description: '2 horizontal photo sections stacked vertically',
        diagramType: 'top-bottom',
        arrangement: 'topBottom'
      },
      {
        id: 'layout-3-collage',
        name: '3 Photos Collage',
        photoCount: 3,
        panelsCount: 3,
        description: '1 large focal photo with 2 smaller accents',
        diagramType: 'collage-3',
        arrangement: 'threeCollage'
      },
      {
        id: 'layout-main-two-small',
        name: '1 Large + 2 Accents',
        photoCount: 3,
        panelsCount: 3,
        description: 'Left vertical hero with 2 stacked side photos',
        diagramType: 'main-two-small',
        arrangement: 'mainTwoSmall'
      },
      {
        id: 'layout-4-grid',
        name: '4 Photos Grid (2×2)',
        photoCount: 4,
        panelsCount: 4,
        description: '4 balanced photos in 2×2 square matrix',
        diagramType: 'collage-4',
        arrangement: 'fourGrid'
      }
    ];
  }, [normId]);

  // Selected layout state
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
      return currentLayoutId;
    }
    return productLayouts[0]?.id || '';
  });

  useEffect(() => {
    if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
      setSelectedId(currentLayoutId);
    } else if (productLayouts.length > 0 && !productLayouts.some((l) => l.id === selectedId)) {
      setSelectedId(productLayouts[0].id);
    }
  }, [currentLayoutId, productLayouts, selectedId]);

  const currentSelected = useMemo(() => {
    return productLayouts.find((l) => l.id === selectedId) || productLayouts[0];
  }, [productLayouts, selectedId]);

  const handleApply = () => {
    if (currentSelected) {
      onSelectLayout(currentSelected);
      onClose();
    }
  };

  // Render SVG diagram for layout cards
  const renderLayoutDiagram = (layout: LayoutModalOption, isSelected: boolean) => {
    const strokeColor = isSelected ? '#0E4A93' : '#94a3b8';
    const fillColor = isSelected ? '#eff6ff' : '#f8fafc';
    const innerStroke = isSelected ? '#0E4A93' : '#cbd5e1';

    // 1. Hexagon Tessellation Diagram
    if (layout.diagramType.startsWith('hexagon')) {
      const hexPoints = (cx: number, cy: number, w: number, h: number) =>
        `${cx - w * 0.25},${cy - h * 0.5} ${cx + w * 0.25},${cy - h * 0.5} ${cx + w * 0.5},${cy} ${cx + w * 0.25},${cy + h * 0.5} ${cx - w * 0.25},${cy + h * 0.5} ${cx - w * 0.5},${cy}`;

      const pencilFace = (cx: number, cy: number, h: number) => {
        const r = h * 0.26;
        return (
          <g stroke="#334155" strokeWidth={Math.max(1, h * 0.022)} fill="none" strokeLinecap="round">
            <circle cx={cx} cy={cy} r={r} />
            <path d={`M ${cx - r * 0.55} ${cy - r * 0.15} q ${r * 0.15} ${-r * 0.35} ${r * 0.3} 0`} />
            <path d={`M ${cx + r * 0.25} ${cy - r * 0.15} q ${r * 0.15} ${-r * 0.35} ${r * 0.3} 0`} />
            <path d={`M ${cx - r * 0.6} ${cy - r * 0.42} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} 0`} />
            <path d={`M ${cx + r * 0.1} ${cy - r * 0.42} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} 0`} />
            <path d={`M ${cx - r * 0.45} ${cy + r * 0.3} q ${r * 0.45} ${r * 0.32} ${r * 0.9} 0`} />
            <path
              d={`M ${cx - r * 0.12} ${cy + r * 0.42} q ${r * 0.12} ${r * 0.55} ${r * 0.3} ${r * 0.1}`}
              fill="#64748b"
              fillOpacity="0.15"
            />
          </g>
        );
      };

      const hexFace = (cx: number, cy: number, w: number, h: number, key: string) => (
        <g key={key}>
          <polygon
            points={hexPoints(cx, cy, w, h)}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
          />
          {pencilFace(cx, cy, h)}
        </g>
      );

      let faces: React.ReactNode[] = [];
      if (layout.diagramType === 'hexagon-1') {
        faces = [hexFace(80, 50, 80, 70, 'h0')];
      } else if (layout.diagramType === 'hexagon-2') {
        const w = 55, h = 65, cy = 50;
        const dx = w * 0.75;
        faces = [hexFace(80 - dx / 2, cy, w, h, 'h0'), hexFace(80 + dx / 2, cy, w, h, 'h1')];
      } else if (layout.diagramType === 'hexagon-3') {
        const w = 44, h = 42, cy = 50;
        const dx = w * 0.75;
        const colX1 = 80 - dx / 2;
        const colX2 = 80 + dx / 2;
        faces = [
          hexFace(colX1, cy - h / 2, w, h, 'h0'),
          hexFace(colX1, cy + h / 2, w, h, 'h1'),
          hexFace(colX2, cy, w, h, 'h2')
        ];
      } else if (layout.diagramType === 'hexagon-4') {
        const w = 38, h = 34, cy = 50;
        const dx = w * 0.75;
        faces = [
          hexFace(80, cy - h / 2, w, h, 'h0'),
          hexFace(80, cy + h / 2, w, h, 'h1'),
          hexFace(80 - dx, cy, w, h, 'h2'),
          hexFace(80 + dx, cy, w, h, 'h3')
        ];
      }

      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          {faces}
        </svg>
      );
    }

    // 2. Wall Display Diagrams
    if (layout.diagramType === 'wall-display-3a') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="25" y="15" width="48" height="70" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="78" y="15" width="56" height="32" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="78" y="52" width="26" height="33" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="108" y="52" width="26" height="33" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'wall-display-3b') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="20" y="32" width="32" height="36" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="56" y="18" width="48" height="64" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="108" y="32" width="32" height="36" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'wall-display-4a') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="20" y="15" width="42" height="70" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="66" y="15" width="74" height="32" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="66" y="51" width="35" height="34" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="105" y="51" width="35" height="34" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'wall-display-tiered') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="20" y="45" width="26" height="30" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="50" y="35" width="28" height="40" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="82" y="20" width="34" height="55" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="120" y="45" width="24" height="30" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    // 3. Split Canvas Diagrams
    if (layout.diagramType === 'split-2') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="30" y="20" width="46" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="84" y="20" width="46" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'split-3') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="22" y="20" width="34" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="63" y="20" width="34" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="104" y="20" width="34" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'split-4') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="20" y="20" width="26" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="50" y="20" width="26" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="80" y="20" width="26" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
          <rect x="110" y="20" width="26" height="60" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="2" />
        </svg>
      );
    }

    // 4. Collage & Single Print Layouts
    if (layout.diagramType === 'single-1') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="35" y="15" width="90" height="70" fill={fillColor} stroke={strokeColor} strokeWidth="2" rx="3" />
        </svg>
      );
    }

    if (layout.diagramType === 'collage-2') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="32" y="15" width="96" height="70" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          <rect x="36" y="19" width="42" height="62" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="82" y="19" width="42" height="62" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'top-bottom') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="40" y="15" width="80" height="70" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          <rect x="44" y="19" width="72" height="29" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="44" y="52" width="72" height="29" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'collage-3') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="35" y="15" width="90" height="70" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          <rect x="39" y="19" width="82" height="35" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="39" y="58" width="39" height="23" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="82" y="58" width="39" height="23" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'main-two-small') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="35" y="15" width="90" height="70" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          <rect x="39" y="19" width="46" height="62" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="89" y="19" width="32" height="29" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="89" y="52" width="32" height="29" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'collage-4' || layout.diagramType === 'mosaic-4') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="42" y="12" width="76" height="76" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          <rect x="46" y="16" width="32" height="32" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="82" y="16" width="32" height="32" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="46" y="52" width="32" height="32" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
          <rect x="82" y="52" width="32" height="32" fill={fillColor} stroke={innerStroke} strokeWidth="1.2" rx="2" />
        </svg>
      );
    }

    if (layout.diagramType === 'mosaic-6') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="30" y="18" width="100" height="64" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          {Array.from({ length: 6 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <rect
                key={i}
                x={34 + col * 32}
                y={22 + row * 28}
                width={28}
                height={24}
                fill={fillColor}
                stroke={innerStroke}
                strokeWidth="1.2"
                rx="1.5"
              />
            );
          })}
        </svg>
      );
    }

    if (layout.diagramType === 'collage-9' || layout.diagramType === 'mosaic-9') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="42" y="12" width="76" height="76" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          {Array.from({ length: 9 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <rect
                key={i}
                x={46 + col * 23}
                y={16 + row * 23}
                width={20}
                height={20}
                fill={fillColor}
                stroke={innerStroke}
                strokeWidth="1"
                rx="1"
              />
            );
          })}
        </svg>
      );
    }

    if (layout.diagramType === 'mosaic-16') {
      return (
        <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
          <rect x="42" y="12" width="76" height="76" fill="#ffffff" stroke={strokeColor} strokeWidth="1.5" rx="3" />
          {Array.from({ length: 16 }).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            return (
              <rect
                key={i}
                x={45 + col * 17.5}
                y={15 + row * 17.5}
                width={15}
                height={15}
                fill={fillColor}
                stroke={innerStroke}
                strokeWidth="0.8"
                rx="1"
              />
            );
          })}
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 160 100" className="w-full h-full max-h-24">
        <rect x="35" y="15" width="90" height="70" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" rx="3" />
        <text x="80" y="55" fill="#0E4A93" fontSize="10" fontWeight="bold" textAnchor="middle">
          {layout.name}
        </text>
      </svg>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Select Layout
              </h2>
              <p className="text-xs text-stone-500">
                Choose a photo or panel layout for {productName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content: Layout Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {productLayouts.map((layout) => {
              const isSelected = selectedId === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => setSelectedId(layout.id)}
                  onDoubleClick={() => {
                    setSelectedId(layout.id);
                    onSelectLayout(layout);
                    onClose();
                  }}
                  className={`group relative rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden bg-white hover:border-[#0E4A93]/60 ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] shadow-md bg-blue-50/15 ring-2 ring-[#0E4A93]/15'
                      : 'border-stone-200 shadow-xs hover:shadow-sm'
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Diagram / Preview Box */}
                  <div className="h-32 p-3 bg-stone-50/50 border-b border-stone-100 flex items-center justify-center relative select-none group-hover:scale-102 transition-transform">
                    {renderLayoutDiagram(layout, isSelected)}
                  </div>

                  {/* Details Bottom Box */}
                  <div className="p-3 bg-white flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-[13px] font-black text-stone-900 truncate">
                        {layout.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#0E4A93] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {layout.photoCount} {layout.photoCount === 1 ? 'Photo' : 'Photos'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {layout.description}
                    </p>
                    {layout.dimensionsSummary && (
                      <span className="text-[10px] font-semibold text-stone-400">
                        {layout.dimensionsSummary}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Selected Layout:{' '}
            <strong className="text-stone-900 font-black">
              {currentSelected?.name}
            </strong>
            <span className="ml-2 text-stone-400">
              ({currentSelected?.photoCount} {currentSelected?.photoCount === 1 ? 'Photo' : 'Photos'})
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              Apply Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
