import React from 'react';

// ============================================================================
// CENTRALIZED CANVAS PRODUCT GEOMETRY ENGINE
// Single source of truth for all Canvas product geometries:
// - Single Print, Round, Triangle, Heart, Oval, Hexagon, Split, Mosaic, Wall Art, Collage
// Drives:
// 1. Product Cards & Sidebar Preview
// 2. Select Layout / Size Selector Cards & Popup Diagrams
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

export interface ProductPanelGeometry {
  id: string;
  label: string;
  dimension?: string;
  x: number; // 0..1 normalized left within overall arrangement bounding box
  y: number; // 0..1 normalized top
  w: number; // 0..1 normalized width
  h: number; // 0..1 normalized height
  clipPath?: string;
  borderRadius?: string;
  widthRatio?: number;
  heightRatio?: number;
}

export interface ProductLayoutDefinition {
  id: string;
  productTypeId: string;
  name: string;
  description: string;
  geometryType: CanvasGeometryType;
  panelsCount: number;
  photoCount: number;
  arrangement?: string;
  dimensionsSummary: string;
  aspectRatio: number; // width / height of the overall arrangement
  overallWidthInches: number;
  overallHeightInches: number;
  price: number;
  acrylicPrice?: number;
  panels: ProductPanelGeometry[];
  cols?: number;
  rows?: number;
  priceRange?: string;
  diagramType?: string;
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
  layoutDef?: ProductLayoutDefinition;
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

// ============================================================================
// CENTRALIZED PRODUCT LAYOUT DEFINITIONS
// Single source of truth consumed by Layout Modal, Sidebar, Workspace, 360, & Room View
// ============================================================================

export const PRODUCT_LAYOUT_DEFINITIONS: Record<string, ProductLayoutDefinition[]> = {
  // 1. Hexagon Prints (canvas-hexagon)
  'canvas-hexagon': [
    {
      id: 'hexagon-1',
      productTypeId: 'canvas-hexagon',
      name: 'Single Hexagon Print',
      description: '1 Individual Honeycomb Canvas Panel',
      geometryType: 'hexagon',
      panelsCount: 1,
      photoCount: 1,
      arrangement: 'single',
      dimensionsSummary: '10" × 11.5"',
      aspectRatio: 10 / 11.5,
      overallWidthInches: 10,
      overallHeightInches: 11.5,
      price: 799.0,
      acrylicPrice: 650.0,
      panels: [
        {
          id: 'p0',
          label: 'Hexagon',
          dimension: '10" × 11.5"',
          x: 0.08,
          y: 0.05,
          w: 0.84,
          h: 0.90,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        }
      ]
    },
    {
      id: 'hexagon-2',
      productTypeId: 'canvas-hexagon',
      name: 'Hexagon Bundle of 2',
      description: '2 Interlocking Honeycomb Canvas Panels',
      geometryType: 'hexagon-cluster',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'twoHex',
      dimensionsSummary: '19" × 10" (2 Hexagons)',
      aspectRatio: 1.9,
      overallWidthInches: 19,
      overallHeightInches: 10,
      price: 1399.0,
      acrylicPrice: 1150.0,
      panels: [
        {
          id: 'p0',
          label: 'Hexagon 1',
          dimension: '10" × 11.5"',
          x: 0.04,
          y: 0.08,
          w: 0.44,
          h: 0.84,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p1',
          label: 'Hexagon 2',
          dimension: '10" × 11.5"',
          x: 0.52,
          y: 0.08,
          w: 0.44,
          h: 0.84,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        }
      ]
    },
    {
      id: 'hexagon-3',
      productTypeId: 'canvas-hexagon',
      name: 'Hexagon Bundle of 3',
      description: '3 Honeycomb Cluster Panels (1 Top + 2 Bottom)',
      geometryType: 'hexagon-cluster',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeHex',
      dimensionsSummary: '27" × 13.75" (3 Hexagons)',
      aspectRatio: 1.45,
      overallWidthInches: 27,
      overallHeightInches: 13.75,
      price: 1899.0,
      acrylicPrice: 1650.0,
      panels: [
        {
          id: 'p0',
          label: 'Hexagon 1 (Top)',
          dimension: '10" × 11.5"',
          x: 0.27,
          y: 0.04,
          w: 0.46,
          h: 0.46,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p1',
          label: 'Hexagon 2 (Left)',
          dimension: '10" × 11.5"',
          x: 0.04,
          y: 0.50,
          w: 0.46,
          h: 0.46,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p2',
          label: 'Hexagon 3 (Right)',
          dimension: '10" × 11.5"',
          x: 0.50,
          y: 0.50,
          w: 0.46,
          h: 0.46,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        }
      ]
    },
    {
      id: 'hexagon-4',
      productTypeId: 'canvas-hexagon',
      name: 'Hexagon Bundle of 4',
      description: '4-Piece Diamond Honeycomb Cluster',
      geometryType: 'hexagon-cluster',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourHex',
      dimensionsSummary: '27" × 19" (4 Hexagons)',
      aspectRatio: 1.42,
      overallWidthInches: 27,
      overallHeightInches: 19,
      price: 2399.0,
      acrylicPrice: 2150.0,
      panels: [
        {
          id: 'p0',
          label: 'Hexagon 1 (Top)',
          dimension: '10" × 11.5"',
          x: 0.27,
          y: 0.03,
          w: 0.46,
          h: 0.45,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p1',
          label: 'Hexagon 2 (Left)',
          dimension: '10" × 11.5"',
          x: 0.04,
          y: 0.275,
          w: 0.46,
          h: 0.45,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p2',
          label: 'Hexagon 3 (Right)',
          dimension: '10" × 11.5"',
          x: 0.50,
          y: 0.275,
          w: 0.46,
          h: 0.45,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        },
        {
          id: 'p3',
          label: 'Hexagon 4 (Bottom)',
          dimension: '10" × 11.5"',
          x: 0.27,
          y: 0.52,
          w: 0.46,
          h: 0.45,
          clipPath: HEXAGON_CLIP_PATH,
          widthRatio: 10,
          heightRatio: 11.5
        }
      ]
    }
  ],

  // 2. Wall Display (canvas-wall-art)
  'canvas-wall-art': [
    {
      id: 'wall-display-3a',
      productTypeId: 'canvas-wall-art',
      name: '3-Piece Gallery A',
      description: '(1) 12"×18" Tall + (2) 10"×8" Mini panels',
      geometryType: 'wall-display',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeCollage',
      dimensionsSummary: '18" × 24" total',
      aspectRatio: 18 / 24,
      overallWidthInches: 18,
      overallHeightInches: 24,
      price: 1899.0,
      acrylicPrice: 2338.90,
      panels: [
        {
          id: 'p0',
          label: 'Main Tall',
          dimension: '12" × 18"',
          x: 0.04,
          y: 0.04,
          w: 0.44,
          h: 0.92,
          widthRatio: 18,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Top Mini',
          dimension: '10" × 8"',
          x: 0.52,
          y: 0.04,
          w: 0.44,
          h: 0.44,
          widthRatio: 8,
          heightRatio: 10
        },
        {
          id: 'p2',
          label: 'Bottom Mini',
          dimension: '10" × 8"',
          x: 0.52,
          y: 0.52,
          w: 0.44,
          h: 0.44,
          widthRatio: 8,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'wall-display-3b',
      productTypeId: 'canvas-wall-art',
      name: '3-Piece Center Winged',
      description: '(1) 16"×20" Large Center + (2) 10"×8" Wings',
      geometryType: 'wall-display',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeSplit',
      dimensionsSummary: '40" × 16" total',
      aspectRatio: 40 / 16,
      overallWidthInches: 40,
      overallHeightInches: 16,
      price: 2499.0,
      acrylicPrice: 2964.90,
      panels: [
        {
          id: 'p0',
          label: 'Left Wing',
          dimension: '10" × 8"',
          x: 0.03,
          y: 0.22,
          w: 0.26,
          h: 0.56,
          widthRatio: 8,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Center Large',
          dimension: '16" × 20"',
          x: 0.32,
          y: 0.05,
          w: 0.36,
          h: 0.90,
          widthRatio: 16,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Right Wing',
          dimension: '10" × 8"',
          x: 0.71,
          y: 0.22,
          w: 0.26,
          h: 0.56,
          widthRatio: 8,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'wall-display-4a',
      productTypeId: 'canvas-wall-art',
      name: '4-Piece Gallery Showcase',
      description: '(1) 24"×16" + (1) 11"×17" + (2) 12"×8"',
      geometryType: 'wall-display',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '34" × 24" total',
      aspectRatio: 34 / 24,
      overallWidthInches: 34,
      overallHeightInches: 24,
      price: 3899.0,
      acrylicPrice: 4746.20,
      panels: [
        {
          id: 'p0',
          label: 'Left Tall',
          dimension: '24" × 16"',
          x: 0.03,
          y: 0.04,
          w: 0.36,
          h: 0.92,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Top Wide',
          dimension: '11" × 17"',
          x: 0.42,
          y: 0.04,
          w: 0.55,
          h: 0.42,
          widthRatio: 17,
          heightRatio: 11
        },
        {
          id: 'p2',
          label: 'Bottom Left',
          dimension: '12" × 8"',
          x: 0.42,
          y: 0.50,
          w: 0.26,
          h: 0.46,
          widthRatio: 8,
          heightRatio: 12
        },
        {
          id: 'p3',
          label: 'Bottom Right',
          dimension: '12" × 8"',
          x: 0.71,
          y: 0.50,
          w: 0.26,
          h: 0.46,
          widthRatio: 8,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'wall-display-tiered',
      productTypeId: 'canvas-wall-art',
      name: '4-Piece Tiered Staircase',
      description: 'Staircase flow: 10"×8", 14"×11", 20"×16", 10"×8"',
      geometryType: 'wall-display',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '36" × 20" total',
      aspectRatio: 36 / 20,
      overallWidthInches: 36,
      overallHeightInches: 20,
      price: 3299.0,
      acrylicPrice: 3890.00,
      panels: [
        {
          id: 'p0',
          label: 'Step 1',
          dimension: '10" × 8"',
          x: 0.03,
          y: 0.45,
          w: 0.21,
          h: 0.50,
          widthRatio: 8,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Step 2',
          dimension: '14" × 11"',
          x: 0.27,
          y: 0.30,
          w: 0.22,
          h: 0.65,
          widthRatio: 11,
          heightRatio: 14
        },
        {
          id: 'p2',
          label: 'Step 3',
          dimension: '20" × 16"',
          x: 0.52,
          y: 0.10,
          w: 0.25,
          h: 0.85,
          widthRatio: 16,
          heightRatio: 20
        },
        {
          id: 'p3',
          label: 'Step 4',
          dimension: '10" × 8"',
          x: 0.80,
          y: 0.45,
          w: 0.17,
          h: 0.50,
          widthRatio: 8,
          heightRatio: 10
        }
      ]
    }
  ],

  // 3. Split Canvas (canvas-split)
  'canvas-split': [
    {
      id: 'split-2p-20x20',
      productTypeId: 'canvas-split',
      name: '2-piece (2) 20x20 CM (8"x8")',
      description: '1 photo split across 2 square panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 2,
      photoCount: 1,
      arrangement: 'twoSplit',
      dimensionsSummary: '2-piece (2) 20x20 CM (8"x8")',
      aspectRatio: 2.0000,
      overallWidthInches: 16,
      overallHeightInches: 8,
      price: 188.10,
      acrylicPrice: 169.00,
      diagramType: 'split-2p-20x20' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '20x20 CM (8"x8")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 8,
          heightRatio: 8
        },
        {
          id: 'p1',
          label: 'Right Panel',
          dimension: '20x20 CM (8"x8")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 8,
          heightRatio: 8
        }
      ]
    },
    {
      id: 'split-2p-45x25',
      productTypeId: 'canvas-split',
      name: '2-piece (2) 45x25 CM (18"x10")',
      description: '1 photo split across 2 vertical panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 2,
      photoCount: 1,
      arrangement: 'twoSplit',
      dimensionsSummary: '2-piece (2) 45x25 CM (18"x10")',
      aspectRatio: 1.1111,
      overallWidthInches: 20,
      overallHeightInches: 18,
      price: 824.60,
      acrylicPrice: 740.00,
      diagramType: 'split-2p-45x25' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '25x45 CM (10"x18")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 10,
          heightRatio: 18
        },
        {
          id: 'p1',
          label: 'Right Panel',
          dimension: '25x45 CM (10"x18")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 10,
          heightRatio: 18
        }
      ]
    },
    {
      id: 'split-2p-40x40-stacked',
      productTypeId: 'canvas-split',
      name: '2-piece (2) 40x40 CM (16"x16")',
      description: '1 photo split across 2 stacked square panels',
      geometryType: 'split-canvas',
      panelsCount: 2,
      photoCount: 1,
      arrangement: 'twoStacked',
      dimensionsSummary: '2-piece (2) 40x40 CM (16"x16")',
      aspectRatio: 0.5000,
      overallWidthInches: 16,
      overallHeightInches: 32,
      price: 1096.30,
      acrylicPrice: 985.00,
      diagramType: 'split-2p-40x40-stacked' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Panel',
          dimension: '40x40 CM (16"x16")',
          x: 0.0000,
          y: 0.0000,
          w: 1.0000,
          h: 0.5000,
          widthRatio: 16,
          heightRatio: 16
        },
        {
          id: 'p1',
          label: 'Bottom Panel',
          dimension: '40x40 CM (16"x16")',
          x: 0.0000,
          y: 0.5000,
          w: 1.0000,
          h: 0.5000,
          widthRatio: 16,
          heightRatio: 16
        }
      ]
    },
    {
      id: 'split-4p-30x30-grid',
      productTypeId: 'canvas-split',
      name: '4-piece (4) 30x30 CM (12"x12")',
      description: '1 photo split across a 2x2 grid of 4 square panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'fourGrid',
      dimensionsSummary: '4-piece (4) 30x30 CM (12"x12")',
      aspectRatio: 1.0000,
      overallWidthInches: 24,
      overallHeightInches: 24,
      price: 1330.00,
      acrylicPrice: 1195.00,
      diagramType: 'split-4p-30x30-grid' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Left',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Top Right',
          dimension: '30x30 CM (12"x12")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Bottom Left',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p3',
          label: 'Bottom Right',
          dimension: '30x30 CM (12"x12")',
          x: 0.5000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-2p-40x50',
      productTypeId: 'canvas-split',
      name: '2-piece (2) 40x50 CM (16"x20")',
      description: '1 photo split across 2 wide landscape panels',
      geometryType: 'split-canvas',
      panelsCount: 2,
      photoCount: 1,
      arrangement: 'twoSplit',
      dimensionsSummary: '2-piece (2) 40x50 CM (16"x20")',
      aspectRatio: 2.5000,
      overallWidthInches: 40,
      overallHeightInches: 16,
      price: 1357.00,
      acrylicPrice: 1220.00,
      diagramType: 'split-2p-40x50' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '50x40 CM (20"x16")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 16
        },
        {
          id: 'p1',
          label: 'Right Panel',
          dimension: '50x40 CM (20"x16")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 16
        }
      ]
    },
    {
      id: 'split-3p-45x30',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 45x30 CM (18"x12")',
      description: '1 photo split across 3 vertical panels',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '3-piece (3) 45x30 CM (18"x12")',
      aspectRatio: 2.0000,
      overallWidthInches: 36,
      overallHeightInches: 18,
      price: 1495.20,
      acrylicPrice: 1345.00,
      diagramType: 'split-3p-45x30' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 18
        }
      ]
    },
    {
      id: 'split-3p-62x45-combo',
      productTypeId: 'canvas-split',
      name: '3-piece (1) 62x45 CM (25"x18"), (2) 30x30 CM (12"x12")',
      description: '1 large panel on left with 2 stacked panels on right',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'tSplitRight',
      dimensionsSummary: '3-piece (1) 62x45 CM, (2) 30x30 CM',
      aspectRatio: 2.0444,
      overallWidthInches: 37,
      overallHeightInches: 18,
      price: 1637.00,
      acrylicPrice: 1470.00,
      diagramType: 'split-3p-62x45-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Large',
          dimension: '62x45 CM (25"x18")',
          x: 0.0000,
          y: 0.0000,
          w: 0.6739,
          h: 1.0000,
          widthRatio: 25,
          heightRatio: 18
        },
        {
          id: 'p1',
          label: 'Right Top',
          dimension: '30x30 CM (12"x12")',
          x: 0.6739,
          y: 0.0000,
          w: 0.3261,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Right Bottom',
          dimension: '30x30 CM (12"x12")',
          x: 0.6739,
          y: 0.5000,
          w: 0.3261,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-5p-stepped-chevron',
      productTypeId: 'canvas-split',
      name: '5-piece (2) 35x20 CM (14"x8"), (2) 45x20 CM (18"x8"), (1) 55x20 CM (22"x8")',
      description: '5 vertical panels in stepped chevron cascade',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'steppedChevron',
      dimensionsSummary: '5-piece (2) 35x20 CM, (2) 45x20 CM, (1) 55x20 CM',
      aspectRatio: 1.8182,
      overallWidthInches: 40,
      overallHeightInches: 22,
      price: 1699.00,
      acrylicPrice: 1525.00,
      diagramType: 'split-5p-stepped-chevron' as any,
      panels: [
        {
          id: 'p0',
          label: 'Outer Left',
          dimension: '20x35 CM (8"x14")',
          x: 0.0000,
          y: 0.1818,
          w: 0.2000,
          h: 0.6364,
          widthRatio: 8,
          heightRatio: 14
        },
        {
          id: 'p1',
          label: 'Inner Left',
          dimension: '20x45 CM (8"x18")',
          x: 0.2000,
          y: 0.0909,
          w: 0.2000,
          h: 0.8182,
          widthRatio: 8,
          heightRatio: 18
        },
        {
          id: 'p2',
          label: 'Center Tall',
          dimension: '20x55 CM (8"x22")',
          x: 0.4000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 8,
          heightRatio: 22
        },
        {
          id: 'p3',
          label: 'Inner Right',
          dimension: '20x45 CM (8"x18")',
          x: 0.6000,
          y: 0.0909,
          w: 0.2000,
          h: 0.8182,
          widthRatio: 8,
          heightRatio: 18
        },
        {
          id: 'p4',
          label: 'Outer Right',
          dimension: '20x35 CM (8"x14")',
          x: 0.8000,
          y: 0.1818,
          w: 0.2000,
          h: 0.6364,
          widthRatio: 8,
          heightRatio: 14
        }
      ]
    },
    {
      id: 'split-4p-62x40-combo',
      productTypeId: 'canvas-split',
      name: '4-piece (1) 62x40 CM (25"x16"), (1) 27x45 CM (11"x18"), (2) 30x20 CM (12"x8")',
      description: '1 tall panel with top landscape panel and 2 bottom panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'tSplitCombo',
      dimensionsSummary: '4-piece (1) 62x40, (1) 27x45, (2) 30x20 CM',
      aspectRatio: 1.9778,
      overallWidthInches: 36,
      overallHeightInches: 18,
      price: 1751.80,
      acrylicPrice: 1575.00,
      diagramType: 'split-4p-62x40-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Tall',
          dimension: '27x45 CM (11"x18")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3034,
          h: 1.0000,
          widthRatio: 11,
          heightRatio: 18
        },
        {
          id: 'p1',
          label: 'Right Top',
          dimension: '62x40 CM (25"x16")',
          x: 0.3034,
          y: 0.0000,
          w: 0.6966,
          h: 0.5556,
          widthRatio: 25,
          heightRatio: 16
        },
        {
          id: 'p2',
          label: 'Right Bot-Left',
          dimension: '30x20 CM (12"x8")',
          x: 0.3034,
          y: 0.5556,
          w: 0.3483,
          h: 0.4444,
          widthRatio: 12,
          heightRatio: 8
        },
        {
          id: 'p3',
          label: 'Right Bot-Right',
          dimension: '30x20 CM (12"x8")',
          x: 0.6517,
          y: 0.5556,
          w: 0.3483,
          h: 0.4444,
          widthRatio: 12,
          heightRatio: 8
        }
      ]
    },
    {
      id: 'split-3p-65x65-combo',
      productTypeId: 'canvas-split',
      name: '3-piece (1) 65x65 CM (26"x26"), (2) 30x30 CM (12"x12")',
      description: '1 large square on left with 2 stacked panels on right',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'tSplitRight',
      dimensionsSummary: '3-piece (1) 65x65 CM, (2) 30x30 CM',
      aspectRatio: 1.4615,
      overallWidthInches: 38,
      overallHeightInches: 26,
      price: 2061.50,
      acrylicPrice: 1850.00,
      diagramType: 'split-3p-65x65-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Square',
          dimension: '65x65 CM (26"x26")',
          x: 0.0000,
          y: 0.0000,
          w: 0.6842,
          h: 1.0000,
          widthRatio: 26,
          heightRatio: 26
        },
        {
          id: 'p1',
          label: 'Right Top',
          dimension: '30x30 CM (12"x12")',
          x: 0.6842,
          y: 0.0000,
          w: 0.3158,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Right Bottom',
          dimension: '30x30 CM (12"x12")',
          x: 0.6842,
          y: 0.5000,
          w: 0.3158,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-9p-22x22-grid',
      productTypeId: 'canvas-split',
      name: '9-piece (9) 22x22 CM (10"x10")',
      description: '3x3 grid of 9 square panels',
      geometryType: 'split-canvas',
      panelsCount: 9,
      photoCount: 1,
      arrangement: 'nineGrid',
      dimensionsSummary: '9-piece (9) 22x22 CM (10"x10")',
      aspectRatio: 1.0000,
      overallWidthInches: 30,
      overallHeightInches: 30,
      price: 2778.75,
      acrylicPrice: 2490.00,
      diagramType: 'split-9p-22x22-grid' as any,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '22x22 CM (10"x10")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '22x22 CM (10"x10")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '22x22 CM (10"x10")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '22x22 CM (10"x10")',
          x: 0.0000,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p4',
          label: 'Panel 5',
          dimension: '22x22 CM (10"x10")',
          x: 0.3333,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p5',
          label: 'Panel 6',
          dimension: '22x22 CM (10"x10")',
          x: 0.6667,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p6',
          label: 'Panel 7',
          dimension: '22x22 CM (10"x10")',
          x: 0.0000,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p7',
          label: 'Panel 8',
          dimension: '22x22 CM (10"x10")',
          x: 0.3333,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p8',
          label: 'Panel 9',
          dimension: '22x22 CM (10"x10")',
          x: 0.6667,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'split-5p-flanked-landscape',
      productTypeId: 'canvas-split',
      name: '5-piece (4) 27x27 CM (12"x12"), (1) 62x42 CM (25"x18")',
      description: 'Center landscape panel flanked by 2 stacked panels on each side',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'flankedCenter',
      dimensionsSummary: '5-piece (4) 27x27 CM, (1) 62x42 CM',
      aspectRatio: 2.1481,
      overallWidthInches: 46,
      overallHeightInches: 21,
      price: 2272.40,
      acrylicPrice: 2045.00,
      diagramType: 'split-5p-flanked-landscape' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Top',
          dimension: '27x27 CM (12"x12")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2328,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Left Bottom',
          dimension: '27x27 CM (12"x12")',
          x: 0.0000,
          y: 0.5000,
          w: 0.2328,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Center Large',
          dimension: '62x42 CM (25"x18")',
          x: 0.2328,
          y: 0.0000,
          w: 0.5345,
          h: 1.0000,
          widthRatio: 25,
          heightRatio: 18
        },
        {
          id: 'p3',
          label: 'Right Top',
          dimension: '27x27 CM (12"x12")',
          x: 0.7672,
          y: 0.0000,
          w: 0.2328,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p4',
          label: 'Right Bottom',
          dimension: '27x27 CM (12"x12")',
          x: 0.7672,
          y: 0.5000,
          w: 0.2328,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-4p-85x50-stacked-right',
      productTypeId: 'canvas-split',
      name: '4-piece (1) 85x50 CM (34"x20"), (3) 25x32 CM (10"x13")',
      description: '1 large panel on left with 3 stacked panels on right',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'tSplitRight3',
      dimensionsSummary: '4-piece (1) 85x50 CM, (3) 25x32 CM',
      aspectRatio: 0.8824,
      overallWidthInches: 30,
      overallHeightInches: 34,
      price: 2390.00,
      acrylicPrice: 2150.00,
      diagramType: 'split-4p-85x50-stacked-right' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Large',
          dimension: '50x85 CM (20"x34")',
          x: 0.0000,
          y: 0.0000,
          w: 0.6667,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 34
        },
        {
          id: 'p1',
          label: 'Right Top',
          dimension: '25x28 CM (10"x11")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 11
        },
        {
          id: 'p2',
          label: 'Right Mid',
          dimension: '25x28 CM (10"x11")',
          x: 0.6667,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 11
        },
        {
          id: 'p3',
          label: 'Right Bot',
          dimension: '25x28 CM (10"x11")',
          x: 0.6667,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 11
        }
      ]
    },
    {
      id: 'split-5p-flanked-square',
      productTypeId: 'canvas-split',
      name: '5-piece (4) 27x27 CM (12"x12"), (1) 60x60 CM (24"x24")',
      description: 'Center square panel flanked by 2 stacked panels on each side',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'flankedCenter',
      dimensionsSummary: '5-piece (4) 27x27 CM, (1) 60x60 CM',
      aspectRatio: 1.9000,
      overallWidthInches: 45,
      overallHeightInches: 24,
      price: 2450.00,
      acrylicPrice: 2200.00,
      diagramType: 'split-5p-flanked-square' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Top',
          dimension: '27x27 CM (12"x12")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2368,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Left Bottom',
          dimension: '27x27 CM (12"x12")',
          x: 0.0000,
          y: 0.5000,
          w: 0.2368,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Center Square',
          dimension: '60x60 CM (24"x24")',
          x: 0.2368,
          y: 0.0000,
          w: 0.5263,
          h: 1.0000,
          widthRatio: 24,
          heightRatio: 24
        },
        {
          id: 'p3',
          label: 'Right Top',
          dimension: '27x27 CM (12"x12")',
          x: 0.7632,
          y: 0.0000,
          w: 0.2368,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p4',
          label: 'Right Bottom',
          dimension: '27x27 CM (12"x12")',
          x: 0.7632,
          y: 0.5000,
          w: 0.2368,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-6p-checker-combo',
      productTypeId: 'canvas-split',
      name: '6-piece (3) 30x30 CM (12"x12"), (3) 45x30 CM (18"x12")',
      description: '6 alternating staggered panels across 3 columns',
      geometryType: 'split-canvas',
      panelsCount: 6,
      photoCount: 1,
      arrangement: 'checkerColumns',
      dimensionsSummary: '6-piece (3) 30x30 CM, (3) 45x30 CM',
      aspectRatio: 1.2000,
      overallWidthInches: 36,
      overallHeightInches: 30,
      price: 2550.00,
      acrylicPrice: 2295.00,
      diagramType: 'split-6p-checker-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Col 1 Top',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 0.4000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Col 1 Bot',
          dimension: '30x45 CM (12"x18")',
          x: 0.0000,
          y: 0.4000,
          w: 0.3333,
          h: 0.6000,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p2',
          label: 'Col 2 Top',
          dimension: '30x45 CM (12"x18")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 0.6000,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p3',
          label: 'Col 2 Bot',
          dimension: '30x30 CM (12"x12")',
          x: 0.3333,
          y: 0.6000,
          w: 0.3333,
          h: 0.4000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p4',
          label: 'Col 3 Top',
          dimension: '30x30 CM (12"x12")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 0.4000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p5',
          label: 'Col 3 Bot',
          dimension: '30x45 CM (12"x18")',
          x: 0.6667,
          y: 0.4000,
          w: 0.3333,
          h: 0.6000,
          widthRatio: 12,
          heightRatio: 18
        }
      ]
    },
    {
      id: 'split-3p-80x27-tall',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 80x27 CM (32"x11")',
      description: '3 tall vertical panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '3-piece (3) 80x27 CM (32"x11")',
      aspectRatio: 1.0125,
      overallWidthInches: 32,
      overallHeightInches: 32,
      price: 2590.00,
      acrylicPrice: 2330.00,
      diagramType: 'split-3p-80x27-tall' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '27x80 CM (11"x32")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 11,
          heightRatio: 32
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '27x80 CM (11"x32")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 11,
          heightRatio: 32
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '27x80 CM (11"x32")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 11,
          heightRatio: 32
        }
      ]
    },
    {
      id: 'split-3p-50x50-vertical',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 50x50 CM (20"x20") (vertical stack)',
      description: '1 vertical column of 3 stacked square panels',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'verticalStack',
      dimensionsSummary: '3-piece (3) 50x50 CM (Vertical Stack)',
      aspectRatio: 0.3333,
      overallWidthInches: 20,
      overallHeightInches: 60,
      price: 3278.91,
      acrylicPrice: 2950.00,
      diagramType: 'split-3p-50x50-vertical' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.0000,
          w: 1.0000,
          h: 0.3333,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Middle Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.3333,
          w: 1.0000,
          h: 0.3333,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Bottom Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.6667,
          w: 1.0000,
          h: 0.3333,
          widthRatio: 20,
          heightRatio: 20
        }
      ]
    },
    {
      id: 'split-3p-50x50-horizontal',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 50x50 CM (20"x20") (horizontal row)',
      description: '3 square panels side by side in a single row',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '3-piece (3) 50x50 CM (Horizontal Row)',
      aspectRatio: 3.0000,
      overallWidthInches: 60,
      overallHeightInches: 20,
      price: 3278.91,
      acrylicPrice: 2950.00,
      diagramType: 'split-3p-50x50-horizontal' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '50x50 CM (20"x20")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 20
        }
      ]
    },
    {
      id: 'split-3p-center-tall',
      productTypeId: 'canvas-split',
      name: '3-piece (2) 57x37 CM (24"x16"), (1) 72x37 CM (30"x16")',
      description: '3 vertical panels with a taller center panel',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'triptychCenterTall',
      dimensionsSummary: '3-piece (2) 57x37 CM, (1) 72x37 CM',
      aspectRatio: 1.5417,
      overallWidthInches: 44,
      overallHeightInches: 28,
      price: 2619.15,
      acrylicPrice: 2355.00,
      diagramType: 'split-3p-center-tall' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '37x57 CM (16"x24")',
          x: 0.0000,
          y: 0.1042,
          w: 0.3333,
          h: 0.7917,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Center Tall',
          dimension: '37x72 CM (16"x30")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '37x57 CM (16"x24")',
          x: 0.6667,
          y: 0.1042,
          w: 0.3333,
          h: 0.7917,
          widthRatio: 16,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-5p-30-45-60-stepped',
      productTypeId: 'canvas-split',
      name: '5-piece (2) 30x30 CM (12"x12"), (2) 45x30 CM (18"x12"), (1) 60x60 CM (24"x24")',
      description: '5 panels tiered in stepped pyramid with center square',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'steppedPyramid',
      dimensionsSummary: '5-piece (2) 30x30, (2) 45x30, (1) 60x60 CM',
      aspectRatio: 3.0000,
      overallWidthInches: 72,
      overallHeightInches: 24,
      price: 3632.13,
      acrylicPrice: 3265.00,
      diagramType: 'split-5p-30-45-60-stepped' as any,
      panels: [
        {
          id: 'p0',
          label: 'Outer Left',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.2500,
          w: 0.1667,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Inner Left',
          dimension: '30x45 CM (12"x18")',
          x: 0.1667,
          y: 0.1250,
          w: 0.1667,
          h: 0.7500,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p2',
          label: 'Center Square',
          dimension: '60x60 CM (24"x24")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 24,
          heightRatio: 24
        },
        {
          id: 'p3',
          label: 'Inner Right',
          dimension: '30x45 CM (12"x18")',
          x: 0.6667,
          y: 0.1250,
          w: 0.1667,
          h: 0.7500,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p4',
          label: 'Outer Right',
          dimension: '30x30 CM (12"x12")',
          x: 0.8333,
          y: 0.2500,
          w: 0.1667,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-3p-37x75-horizontal',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 37x75 CM (15"x30")',
      description: '3 wide panoramic panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '3-piece (3) 37x75 CM (15"x30")',
      aspectRatio: 6.0811,
      overallWidthInches: 90,
      overallHeightInches: 15,
      price: 2890.00,
      acrylicPrice: 2599.00,
      diagramType: 'split-3p-37x75-horizontal' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '75x37 CM (30"x15")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 30,
          heightRatio: 15
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '75x37 CM (30"x15")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 30,
          heightRatio: 15
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '75x37 CM (30"x15")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 30,
          heightRatio: 15
        }
      ]
    },
    {
      id: 'split-3p-50x90-t-split',
      productTypeId: 'canvas-split',
      name: '3-piece (1) 50x90 CM (20"x36"), (2) 50x40 CM (20"x16")',
      description: '1 top wide panel with 2 bottom panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'tSplitTop',
      dimensionsSummary: '3-piece (1) 50x90 CM, (2) 50x40 CM',
      aspectRatio: 0.9000,
      overallWidthInches: 36,
      overallHeightInches: 40,
      price: 2990.00,
      acrylicPrice: 2690.00,
      diagramType: 'split-3p-50x90-t-split' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Wide',
          dimension: '90x50 CM (36"x20")',
          x: 0.0000,
          y: 0.0000,
          w: 1.0000,
          h: 0.5000,
          widthRatio: 36,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Bottom Left',
          dimension: '45x50 CM (18"x20")',
          x: 0.0000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 18,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Bottom Right',
          dimension: '45x50 CM (18"x20")',
          x: 0.5000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 18,
          heightRatio: 20
        }
      ]
    },
    {
      id: 'split-9p-30x30-grid',
      productTypeId: 'canvas-split',
      name: '9-piece (9) 30x30 CM (12"x12")',
      description: '3x3 grid of 9 square panels',
      geometryType: 'split-canvas',
      panelsCount: 9,
      photoCount: 1,
      arrangement: 'nineGrid',
      dimensionsSummary: '9-piece (9) 30x30 CM (12"x12")',
      aspectRatio: 1.0000,
      overallWidthInches: 36,
      overallHeightInches: 36,
      price: 3150.00,
      acrylicPrice: 2835.00,
      diagramType: 'split-9p-30x30-grid' as any,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '30x30 CM (12"x12")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '30x30 CM (12"x12")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p4',
          label: 'Panel 5',
          dimension: '30x30 CM (12"x12")',
          x: 0.3333,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p5',
          label: 'Panel 6',
          dimension: '30x30 CM (12"x12")',
          x: 0.6667,
          y: 0.3333,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p6',
          label: 'Panel 7',
          dimension: '30x30 CM (12"x12")',
          x: 0.0000,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p7',
          label: 'Panel 8',
          dimension: '30x30 CM (12"x12")',
          x: 0.3333,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p8',
          label: 'Panel 9',
          dimension: '30x30 CM (12"x12")',
          x: 0.6667,
          y: 0.6667,
          w: 0.3333,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-7p-25x35-combo',
      productTypeId: 'canvas-split',
      name: '7-piece (4) 25x35 CM (10"x14"), (3) 50x35 CM (20"x14")',
      description: '7 panels in symmetrical 3-column wall display',
      geometryType: 'split-canvas',
      panelsCount: 7,
      photoCount: 1,
      arrangement: 'sevenDisplay',
      dimensionsSummary: '7-piece (4) 25x35 CM, (3) 50x35 CM',
      aspectRatio: 1.0500,
      overallWidthInches: 42,
      overallHeightInches: 40,
      price: 3250.00,
      acrylicPrice: 2925.00,
      diagramType: 'split-7p-25x35-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Left',
          dimension: '35x25 CM (14"x10")',
          x: 0.1667,
          y: 0.0000,
          w: 0.3333,
          h: 0.2500,
          widthRatio: 14,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Top Right',
          dimension: '35x25 CM (14"x10")',
          x: 0.5000,
          y: 0.0000,
          w: 0.3333,
          h: 0.2500,
          widthRatio: 14,
          heightRatio: 10
        },
        {
          id: 'p2',
          label: 'Mid Left',
          dimension: '35x50 CM (14"x20")',
          x: 0.0000,
          y: 0.2500,
          w: 0.3333,
          h: 0.5000,
          widthRatio: 14,
          heightRatio: 20
        },
        {
          id: 'p3',
          label: 'Mid Center',
          dimension: '35x50 CM (14"x20")',
          x: 0.3333,
          y: 0.2500,
          w: 0.3333,
          h: 0.5000,
          widthRatio: 14,
          heightRatio: 20
        },
        {
          id: 'p4',
          label: 'Mid Right',
          dimension: '35x50 CM (14"x20")',
          x: 0.6667,
          y: 0.2500,
          w: 0.3333,
          h: 0.5000,
          widthRatio: 14,
          heightRatio: 20
        },
        {
          id: 'p5',
          label: 'Bot Left',
          dimension: '35x25 CM (14"x10")',
          x: 0.1667,
          y: 0.7500,
          w: 0.3333,
          h: 0.2500,
          widthRatio: 14,
          heightRatio: 10
        },
        {
          id: 'p6',
          label: 'Bot Right',
          dimension: '35x25 CM (14"x10")',
          x: 0.5000,
          y: 0.7500,
          w: 0.3333,
          h: 0.2500,
          widthRatio: 14,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'split-6p-mosaic-cluster',
      productTypeId: 'canvas-split',
      name: '6-piece (2) 45x30 CM (18"x12"), (3) 25x25 CM (10"x10"), (1) 50x65 CM (20"x36")',
      description: 'Center feature panel with 3 top squares and 2 side panels',
      geometryType: 'split-canvas',
      panelsCount: 6,
      photoCount: 1,
      arrangement: 'centerFeatureCluster',
      dimensionsSummary: '6-piece (2) 45x30, (3) 25x25, (1) 50x65 CM',
      aspectRatio: 1.6667,
      overallWidthInches: 50,
      overallHeightInches: 30,
      price: 3134.05,
      acrylicPrice: 2820.00,
      diagramType: 'split-6p-mosaic-cluster' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top 1',
          dimension: '25x25 CM (10"x10")',
          x: 0.2500,
          y: 0.0000,
          w: 0.2000,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Top 2',
          dimension: '25x25 CM (10"x10")',
          x: 0.4500,
          y: 0.0000,
          w: 0.2000,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p2',
          label: 'Top 3',
          dimension: '25x25 CM (10"x10")',
          x: 0.6500,
          y: 0.0000,
          w: 0.2000,
          h: 0.3333,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p3',
          label: 'Left Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.0000,
          y: 0.3333,
          w: 0.2400,
          h: 0.6667,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p4',
          label: 'Center Large',
          dimension: '65x50 CM (26"x20")',
          x: 0.2400,
          y: 0.3333,
          w: 0.5200,
          h: 0.6667,
          widthRatio: 26,
          heightRatio: 20
        },
        {
          id: 'p5',
          label: 'Right Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.7600,
          y: 0.3333,
          w: 0.2400,
          h: 0.6667,
          widthRatio: 12,
          heightRatio: 18
        }
      ]
    },
    {
      id: 'split-4p-50x50-grid',
      productTypeId: 'canvas-split',
      name: '4-piece (4) 50x50 CM (20"x20")',
      description: '2x2 grid of 4 large square panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'fourGrid',
      dimensionsSummary: '4-piece (4) 50x50 CM (20"x20")',
      aspectRatio: 1.0000,
      overallWidthInches: 40,
      overallHeightInches: 40,
      price: 4371.88,
      acrylicPrice: 3935.00,
      diagramType: 'split-4p-50x50-grid' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Left',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Top Right',
          dimension: '50x50 CM (20"x20")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Bottom Left',
          dimension: '50x50 CM (20"x20")',
          x: 0.0000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p3',
          label: 'Bottom Right',
          dimension: '50x50 CM (20"x20")',
          x: 0.5000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 20,
          heightRatio: 20
        }
      ]
    },
    {
      id: 'split-3p-75x50-triptych',
      productTypeId: 'canvas-split',
      name: '3-piece (3) 75x50 CM (30"x20")',
      description: '3 large vertical panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '3-piece (3) 75x50 CM (30"x20")',
      aspectRatio: 2.0000,
      overallWidthInches: 60,
      overallHeightInches: 30,
      price: 4412.31,
      acrylicPrice: 3970.00,
      diagramType: 'split-3p-75x50-triptych' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '50x75 CM (20"x30")',
          x: 0.0000,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 30
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '50x75 CM (20"x30")',
          x: 0.3333,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '50x75 CM (20"x30")',
          x: 0.6667,
          y: 0.0000,
          w: 0.3333,
          h: 1.0000,
          widthRatio: 20,
          heightRatio: 30
        }
      ]
    },
    {
      id: 'split-4p-97x72-combo',
      productTypeId: 'canvas-split',
      name: '4-piece (1) 97x72 CM (40"x30"), (3) 27x27 CM (12"x12")',
      description: '1 grand vertical panel on left with 3 stacked panels on right',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'tSplitRight3',
      dimensionsSummary: '4-piece (1) 97x72 CM, (3) 27x27 CM',
      aspectRatio: 1.0206,
      overallWidthInches: 39,
      overallHeightInches: 38,
      price: 3441.85,
      acrylicPrice: 3095.00,
      diagramType: 'split-4p-97x72-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Grand',
          dimension: '72x97 CM (30"x40")',
          x: 0.0000,
          y: 0.0000,
          w: 0.7273,
          h: 1.0000,
          widthRatio: 30,
          heightRatio: 40
        },
        {
          id: 'p1',
          label: 'Right Top',
          dimension: '27x27 CM (12"x12")',
          x: 0.7273,
          y: 0.0000,
          w: 0.2727,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Right Mid',
          dimension: '27x27 CM (12"x12")',
          x: 0.7273,
          y: 0.3333,
          w: 0.2727,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p3',
          label: 'Right Bot',
          dimension: '27x27 CM (12"x12")',
          x: 0.7273,
          y: 0.6667,
          w: 0.2727,
          h: 0.3333,
          widthRatio: 12,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'split-5p-50x30-stepped',
      productTypeId: 'canvas-split',
      name: '5-piece (2) 50x30 CM (20"x12"), (2) 75x30 CM (30"x12"), (1) 100x30 CM (40"x12")',
      description: '5 vertical panels in stepped chevron cascade',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'steppedChevron',
      dimensionsSummary: '5-piece (2) 50x30, (2) 75x30, (1) 100x30 CM',
      aspectRatio: 1.5000,
      overallWidthInches: 60,
      overallHeightInches: 40,
      price: 3590.00,
      acrylicPrice: 3230.00,
      diagramType: 'split-5p-50x30-stepped' as any,
      panels: [
        {
          id: 'p0',
          label: 'Outer Left',
          dimension: '30x50 CM (12"x20")',
          x: 0.0000,
          y: 0.2500,
          w: 0.2000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Inner Left',
          dimension: '30x75 CM (12"x30")',
          x: 0.2000,
          y: 0.1250,
          w: 0.2000,
          h: 0.7500,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Center Tall',
          dimension: '30x100 CM (12"x40")',
          x: 0.4000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 40
        },
        {
          id: 'p3',
          label: 'Inner Right',
          dimension: '30x75 CM (12"x30")',
          x: 0.6000,
          y: 0.1250,
          w: 0.2000,
          h: 0.7500,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p4',
          label: 'Outer Right',
          dimension: '30x50 CM (12"x20")',
          x: 0.8000,
          y: 0.2500,
          w: 0.2000,
          h: 0.5000,
          widthRatio: 12,
          heightRatio: 20
        }
      ]
    },
    {
      id: 'split-4p-75x40-alternating',
      productTypeId: 'canvas-split',
      name: '4-piece (2) 75x40 CM (30"x16"), (2) 40x60 CM (16"x24")',
      description: '4 vertical panels in alternating stepped height',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'alternatingStepped',
      dimensionsSummary: '4-piece (2) 75x40 CM, (2) 40x60 CM',
      aspectRatio: 2.1333,
      overallWidthInches: 64,
      overallHeightInches: 30,
      price: 3750.00,
      acrylicPrice: 3375.00,
      diagramType: 'split-4p-75x40-alternating' as any,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '40x60 CM (16"x24")',
          x: 0.0000,
          y: 0.1000,
          w: 0.2500,
          h: 0.8000,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '40x75 CM (16"x30")',
          x: 0.2500,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '40x75 CM (16"x30")',
          x: 0.5000,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '40x60 CM (16"x24")',
          x: 0.7500,
          y: 0.1000,
          w: 0.2500,
          h: 0.8000,
          widthRatio: 16,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-4p-75x37-inner-tall',
      productTypeId: 'canvas-split',
      name: '4-piece (2) 75x37 CM (30"x16"), (2) 57x37 CM (24"x16")',
      description: '4 vertical panels with taller inner panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'innerTall4',
      dimensionsSummary: '4-piece (2) 75x37 CM, (2) 57x37 CM',
      aspectRatio: 1.9733,
      overallWidthInches: 59,
      overallHeightInches: 30,
      price: 3820.00,
      acrylicPrice: 3435.00,
      diagramType: 'split-4p-75x37-inner-tall' as any,
      panels: [
        {
          id: 'p0',
          label: 'Outer Left',
          dimension: '37x57 CM (16"x24")',
          x: 0.0000,
          y: 0.1200,
          w: 0.2500,
          h: 0.7600,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Inner Left',
          dimension: '37x75 CM (16"x30")',
          x: 0.2500,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Inner Right',
          dimension: '37x75 CM (16"x30")',
          x: 0.5000,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p3',
          label: 'Outer Right',
          dimension: '37x57 CM (16"x24")',
          x: 0.7500,
          y: 0.1200,
          w: 0.2500,
          h: 0.7600,
          widthRatio: 16,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-5p-75x30-equal',
      productTypeId: 'canvas-split',
      name: '5-piece (5) 75x30 CM (30"x12")',
      description: '5 equal vertical panels side by side',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'fiveEqual',
      dimensionsSummary: '5-piece (5) 75x30 CM (30"x12")',
      aspectRatio: 2.0000,
      overallWidthInches: 60,
      overallHeightInches: 30,
      price: 3950.00,
      acrylicPrice: 3550.00,
      diagramType: 'split-5p-75x30-equal' as any,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '30x75 CM (12"x30")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '30x75 CM (12"x30")',
          x: 0.2000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '30x75 CM (12"x30")',
          x: 0.4000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '30x75 CM (12"x30")',
          x: 0.6000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 30
        },
        {
          id: 'p4',
          label: 'Panel 5',
          dimension: '30x75 CM (12"x30")',
          x: 0.8000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 30
        }
      ]
    },
    {
      id: 'split-3p-90x30-center-wide',
      productTypeId: 'canvas-split',
      name: '3-piece (2) 90x30 CM (36"x12"), (1) 90x70 CM (36"x28")',
      description: '3 vertical panels with a wide center feature panel',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'centerWide3',
      dimensionsSummary: '3-piece (2) 90x30 CM, (1) 90x70 CM',
      aspectRatio: 1.4444,
      overallWidthInches: 51,
      overallHeightInches: 36,
      price: 3893.10,
      acrylicPrice: 3500.00,
      diagramType: 'split-3p-90x30-center-wide' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '30x90 CM (12"x36")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2308,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 36
        },
        {
          id: 'p1',
          label: 'Center Wide',
          dimension: '70x90 CM (28"x36")',
          x: 0.2308,
          y: 0.0000,
          w: 0.5385,
          h: 1.0000,
          widthRatio: 28,
          heightRatio: 36
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '30x90 CM (12"x36")',
          x: 0.7692,
          y: 0.0000,
          w: 0.2308,
          h: 1.0000,
          widthRatio: 12,
          heightRatio: 36
        }
      ]
    },
    {
      id: 'split-4p-75x40-stepped',
      productTypeId: 'canvas-split',
      name: '4-piece (4) 75x40 CM (30"x16")',
      description: '4 vertical panels in staggered stepped elevation',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'fourStepped',
      dimensionsSummary: '4-piece (4) 75x40 CM (30"x16")',
      aspectRatio: 1.8824,
      overallWidthInches: 64,
      overallHeightInches: 34,
      price: 4016.60,
      acrylicPrice: 3615.00,
      diagramType: 'split-4p-75x40-stepped' as any,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '40x75 CM (16"x30")',
          x: 0.0000,
          y: 0.1176,
          w: 0.2500,
          h: 0.8824,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '40x75 CM (16"x30")',
          x: 0.2500,
          y: 0.0000,
          w: 0.2500,
          h: 0.8824,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '40x75 CM (16"x30")',
          x: 0.5000,
          y: 0.0000,
          w: 0.2500,
          h: 0.8824,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '40x75 CM (16"x30")',
          x: 0.7500,
          y: 0.1176,
          w: 0.2500,
          h: 0.8824,
          widthRatio: 16,
          heightRatio: 30
        }
      ]
    },
    {
      id: 'split-8p-gallery-wall',
      productTypeId: 'canvas-split',
      name: '8-piece (2) 50x40 CM (20"x16"), (2) 25x40 CM (10"x16"), (3) 25x25 CM (10"x10"), (1) 50x80 CM (20"x32")',
      description: '8-piece gallery wall display with center panorama panel',
      geometryType: 'split-canvas',
      panelsCount: 8,
      photoCount: 1,
      arrangement: 'eightGalleryWall',
      dimensionsSummary: '8-piece (2) 50x40, (2) 25x40, (3) 25x25, (1) 50x80 CM',
      aspectRatio: 1.3000,
      overallWidthInches: 52,
      overallHeightInches: 40,
      price: 4125.85,
      acrylicPrice: 3710.00,
      diagramType: 'split-8p-gallery-wall' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top 1',
          dimension: '25x25 CM (10"x10")',
          x: 0.2500,
          y: 0.0000,
          w: 0.1923,
          h: 0.2500,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p1',
          label: 'Top 2',
          dimension: '25x25 CM (10"x10")',
          x: 0.4400,
          y: 0.0000,
          w: 0.1923,
          h: 0.2500,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p2',
          label: 'Top 3',
          dimension: '25x25 CM (10"x10")',
          x: 0.6300,
          y: 0.0000,
          w: 0.1923,
          h: 0.2500,
          widthRatio: 10,
          heightRatio: 10
        },
        {
          id: 'p3',
          label: 'Left Panel',
          dimension: '25x40 CM (10"x16")',
          x: 0.0000,
          y: 0.2500,
          w: 0.1923,
          h: 0.4000,
          widthRatio: 10,
          heightRatio: 16
        },
        {
          id: 'p4',
          label: 'Center Large',
          dimension: '80x50 CM (32"x20")',
          x: 0.1923,
          y: 0.2500,
          w: 0.6154,
          h: 0.5000,
          widthRatio: 32,
          heightRatio: 20
        },
        {
          id: 'p5',
          label: 'Right Panel',
          dimension: '25x40 CM (10"x16")',
          x: 0.8077,
          y: 0.2500,
          w: 0.1923,
          h: 0.4000,
          widthRatio: 10,
          heightRatio: 16
        },
        {
          id: 'p6',
          label: 'Bottom Left',
          dimension: '50x40 CM (20"x16")',
          x: 0.1500,
          y: 0.7500,
          w: 0.3846,
          h: 0.2500,
          widthRatio: 20,
          heightRatio: 10
        },
        {
          id: 'p7',
          label: 'Bottom Right',
          dimension: '50x40 CM (20"x16")',
          x: 0.5500,
          y: 0.7500,
          w: 0.3846,
          h: 0.2500,
          widthRatio: 20,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'split-3p-90x35-center-wide',
      productTypeId: 'canvas-split',
      name: '3-piece (2) 90x35 CM (36"x14"), (1) 90x70 CM (36"x28")',
      description: '3 vertical panels with a wide center feature panel',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'centerWide3',
      dimensionsSummary: '3-piece (2) 90x35 CM, (1) 90x70 CM',
      aspectRatio: 1.5556,
      overallWidthInches: 56,
      overallHeightInches: 36,
      price: 4180.00,
      acrylicPrice: 3760.00,
      diagramType: 'split-3p-90x35-center-wide' as any,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '35x90 CM (14"x36")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 14,
          heightRatio: 36
        },
        {
          id: 'p1',
          label: 'Center Wide',
          dimension: '70x90 CM (28"x36")',
          x: 0.2500,
          y: 0.0000,
          w: 0.5000,
          h: 1.0000,
          widthRatio: 28,
          heightRatio: 36
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '35x90 CM (14"x36")',
          x: 0.7500,
          y: 0.0000,
          w: 0.2500,
          h: 1.0000,
          widthRatio: 14,
          heightRatio: 36
        }
      ]
    },
    {
      id: 'split-4p-60x60-grid',
      productTypeId: 'canvas-split',
      name: '4-piece (4) 60x60 CM (24"x24")',
      description: '2x2 grid of 4 grand square panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'fourGrid',
      dimensionsSummary: '4-piece (4) 60x60 CM (24"x24")',
      aspectRatio: 1.0000,
      overallWidthInches: 48,
      overallHeightInches: 48,
      price: 4890.00,
      acrylicPrice: 4400.00,
      diagramType: 'split-4p-60x60-grid' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top Left',
          dimension: '60x60 CM (24"x24")',
          x: 0.0000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 24,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Top Right',
          dimension: '60x60 CM (24"x24")',
          x: 0.5000,
          y: 0.0000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 24,
          heightRatio: 24
        },
        {
          id: 'p2',
          label: 'Bottom Left',
          dimension: '60x60 CM (24"x24")',
          x: 0.0000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 24,
          heightRatio: 24
        },
        {
          id: 'p3',
          label: 'Bottom Right',
          dimension: '60x60 CM (24"x24")',
          x: 0.5000,
          y: 0.5000,
          w: 0.5000,
          h: 0.5000,
          widthRatio: 24,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-5p-57-75-97-stepped',
      productTypeId: 'canvas-split',
      name: '5-piece (2) 57x37 CM (24"x16"), (2) 75x37 CM (30"x16"), (1) 97x37 CM (40"x16")',
      description: '5 grand vertical panels in stepped chevron cascade',
      geometryType: 'split-canvas',
      panelsCount: 5,
      photoCount: 1,
      arrangement: 'steppedChevron',
      dimensionsSummary: '5-piece (2) 57x37, (2) 75x37, (1) 97x37 CM',
      aspectRatio: 1.9072,
      overallWidthInches: 74,
      overallHeightInches: 39,
      price: 4650.00,
      acrylicPrice: 4185.00,
      diagramType: 'split-5p-57-75-97-stepped' as any,
      panels: [
        {
          id: 'p0',
          label: 'Outer Left',
          dimension: '37x57 CM (16"x24")',
          x: 0.0000,
          y: 0.2062,
          w: 0.2000,
          h: 0.5876,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Inner Left',
          dimension: '37x75 CM (16"x30")',
          x: 0.2000,
          y: 0.1134,
          w: 0.2000,
          h: 0.7732,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p2',
          label: 'Center Tall',
          dimension: '37x97 CM (16"x40")',
          x: 0.4000,
          y: 0.0000,
          w: 0.2000,
          h: 1.0000,
          widthRatio: 16,
          heightRatio: 40
        },
        {
          id: 'p3',
          label: 'Inner Right',
          dimension: '37x75 CM (16"x30")',
          x: 0.6000,
          y: 0.1134,
          w: 0.2000,
          h: 0.7732,
          widthRatio: 16,
          heightRatio: 30
        },
        {
          id: 'p4',
          label: 'Outer Right',
          dimension: '37x57 CM (16"x24")',
          x: 0.8000,
          y: 0.2062,
          w: 0.2000,
          h: 0.5876,
          widthRatio: 16,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-8p-30x30-combo',
      productTypeId: 'canvas-split',
      name: '8-piece (2) 30x30 CM (12"x12"), (5) 45x50 CM (18"x12"), (1) 75x100 CM (30"x40")',
      description: '8-piece gallery arrangement with grand center canvas',
      geometryType: 'split-canvas',
      panelsCount: 8,
      photoCount: 1,
      arrangement: 'eightGrandFeature',
      dimensionsSummary: '8-piece (2) 30x30, (5) 45x50, (1) 75x100 CM',
      aspectRatio: 1.6000,
      overallWidthInches: 64,
      overallHeightInches: 40,
      price: 4980.00,
      acrylicPrice: 4480.00,
      diagramType: 'split-8p-30x30-combo' as any,
      panels: [
        {
          id: 'p0',
          label: 'Top 1',
          dimension: '30x30 CM (12"x12")',
          x: 0.1500,
          y: 0.0000,
          w: 0.1875,
          h: 0.3000,
          widthRatio: 12,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Top 2',
          dimension: '45x30 CM (18"x12")',
          x: 0.3500,
          y: 0.0000,
          w: 0.2812,
          h: 0.3000,
          widthRatio: 18,
          heightRatio: 12
        },
        {
          id: 'p2',
          label: 'Top 3',
          dimension: '45x30 CM (18"x12")',
          x: 0.6500,
          y: 0.0000,
          w: 0.2812,
          h: 0.3000,
          widthRatio: 18,
          heightRatio: 12
        },
        {
          id: 'p3',
          label: 'Left Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.0000,
          y: 0.3000,
          w: 0.1875,
          h: 0.4500,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p4',
          label: 'Center Grand',
          dimension: '100x70 CM (40"x28")',
          x: 0.1875,
          y: 0.3000,
          w: 0.6250,
          h: 0.7000,
          widthRatio: 40,
          heightRatio: 28
        },
        {
          id: 'p5',
          label: 'Right Panel',
          dimension: '30x45 CM (12"x18")',
          x: 0.8125,
          y: 0.3000,
          w: 0.1875,
          h: 0.4500,
          widthRatio: 12,
          heightRatio: 18
        },
        {
          id: 'p6',
          label: 'Bottom Left',
          dimension: '45x25 CM (18"x10")',
          x: 0.2500,
          y: 0.7500,
          w: 0.2812,
          h: 0.2500,
          widthRatio: 18,
          heightRatio: 10
        },
        {
          id: 'p7',
          label: 'Bottom Right',
          dimension: '45x25 CM (18"x10")',
          x: 0.5500,
          y: 0.7500,
          w: 0.2812,
          h: 0.2500,
          widthRatio: 18,
          heightRatio: 10
        }
      ]
    },
    {
      id: 'split-8p-50x50-gallery',
      productTypeId: 'canvas-split',
      name: '8-piece (4) 50x50 CM (20"x20"), (2) 40x60 CM (16"x24"), (2) 60x60 CM (24"x24")',
      description: '8-piece symmetrical gallery wall arrangement in 2 rows',
      geometryType: 'split-canvas',
      panelsCount: 8,
      photoCount: 1,
      arrangement: 'eightTwoRows',
      dimensionsSummary: '8-piece (4) 50x50, (2) 40x60, (2) 60x60 CM',
      aspectRatio: 1.6364,
      overallWidthInches: 72,
      overallHeightInches: 44,
      price: 5250.00,
      acrylicPrice: 4725.00,
      diagramType: 'split-8p-50x50-gallery' as any,
      panels: [
        {
          id: 'p0',
          label: 'Row 1 Col 1',
          dimension: '40x50 CM (16"x20")',
          x: 0.0000,
          y: 0.0000,
          w: 0.2222,
          h: 0.4545,
          widthRatio: 16,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Row 1 Col 2',
          dimension: '50x50 CM (20"x20")',
          x: 0.2222,
          y: 0.0000,
          w: 0.2778,
          h: 0.4545,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Row 1 Col 3',
          dimension: '50x50 CM (20"x20")',
          x: 0.5000,
          y: 0.0000,
          w: 0.2778,
          h: 0.4545,
          widthRatio: 20,
          heightRatio: 20
        },
        {
          id: 'p3',
          label: 'Row 1 Col 4',
          dimension: '40x50 CM (16"x20")',
          x: 0.7778,
          y: 0.0000,
          w: 0.2222,
          h: 0.4545,
          widthRatio: 16,
          heightRatio: 20
        },
        {
          id: 'p4',
          label: 'Row 2 Col 1',
          dimension: '40x60 CM (16"x24")',
          x: 0.0000,
          y: 0.4545,
          w: 0.2222,
          h: 0.5455,
          widthRatio: 16,
          heightRatio: 24
        },
        {
          id: 'p5',
          label: 'Row 2 Col 2',
          dimension: '60x60 CM (24"x24")',
          x: 0.2222,
          y: 0.4545,
          w: 0.2778,
          h: 0.5455,
          widthRatio: 20,
          heightRatio: 24
        },
        {
          id: 'p6',
          label: 'Row 2 Col 3',
          dimension: '60x60 CM (24"x24")',
          x: 0.5000,
          y: 0.4545,
          w: 0.2778,
          h: 0.5455,
          widthRatio: 20,
          heightRatio: 24
        },
        {
          id: 'p7',
          label: 'Row 2 Col 4',
          dimension: '40x60 CM (16"x24")',
          x: 0.7778,
          y: 0.4545,
          w: 0.2222,
          h: 0.5455,
          widthRatio: 16,
          heightRatio: 24
        }
      ]
    }
  ],

  // 4. Photo Collage (canvas-collage)
  'canvas-collage': [
    {
      id: 'layout-1-single',
      productTypeId: 'canvas-collage',
      name: 'Single Image',
      description: '1 Large Full Canvas Image Slot',
      geometryType: 'collage',
      panelsCount: 1,
      photoCount: 1,
      arrangement: 'single',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 499.0,
      acrylicPrice: 449.0,
      panels: [
        {
          id: 'p0',
          label: 'Photo 1',
          dimension: '16" × 16"',
          x: 0.03,
          y: 0.03,
          w: 0.94,
          h: 0.94,
          widthRatio: 16,
          heightRatio: 16
        }
      ]
    },
    {
      id: 'layout-2-split',
      productTypeId: 'canvas-collage',
      name: '2 Image Split',
      description: '2 Photos side by side with clean dividing line',
      geometryType: 'collage',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'twoSplit',
      dimensionsSummary: '18" × 12"',
      aspectRatio: 18 / 12,
      overallWidthInches: 18,
      overallHeightInches: 12,
      price: 599.0,
      acrylicPrice: 549.0,
      panels: [
        {
          id: 'p0',
          label: 'Left Photo',
          dimension: '9" × 12"',
          x: 0.03,
          y: 0.03,
          w: 0.455,
          h: 0.94,
          widthRatio: 9,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Right Photo',
          dimension: '9" × 12"',
          x: 0.515,
          y: 0.03,
          w: 0.455,
          h: 0.94,
          widthRatio: 9,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'layout-3-collage',
      productTypeId: 'canvas-collage',
      name: '3 Image Collage',
      description: '1 Main top photograph + 2 supporting bottom photos',
      geometryType: 'collage',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeCollage',
      dimensionsSummary: '16" × 20"',
      aspectRatio: 16 / 20,
      overallWidthInches: 16,
      overallHeightInches: 20,
      price: 899.0,
      acrylicPrice: 799.0,
      panels: [
        {
          id: 'p0',
          label: 'Top Main',
          dimension: '16" × 12"',
          x: 0.03,
          y: 0.03,
          w: 0.94,
          h: 0.55,
          widthRatio: 16,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Bottom Left',
          dimension: '8" × 8"',
          x: 0.03,
          y: 0.61,
          w: 0.455,
          h: 0.36,
          widthRatio: 8,
          heightRatio: 8
        },
        {
          id: 'p2',
          label: 'Bottom Right',
          dimension: '8" × 8"',
          x: 0.515,
          y: 0.61,
          w: 0.455,
          h: 0.36,
          widthRatio: 8,
          heightRatio: 8
        }
      ]
    },
    {
      id: 'layout-4-grid',
      productTypeId: 'canvas-collage',
      name: '4 Image Grid',
      description: '2 × 2 Symmetrical square quad grid',
      geometryType: 'collage',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 1199.0,
      acrylicPrice: 999.0,
      panels: [
        { id: 'p0', label: 'Top Left', dimension: '8" × 8"', x: 0.03, y: 0.03, w: 0.455, h: 0.455, widthRatio: 8, heightRatio: 8 },
        { id: 'p1', label: 'Top Right', dimension: '8" × 8"', x: 0.515, y: 0.03, w: 0.455, h: 0.455, widthRatio: 8, heightRatio: 8 },
        { id: 'p2', label: 'Bottom Left', dimension: '8" × 8"', x: 0.03, y: 0.515, w: 0.455, h: 0.455, widthRatio: 8, heightRatio: 8 },
        { id: 'p3', label: 'Bottom Right', dimension: '8" × 8"', x: 0.515, y: 0.515, w: 0.455, h: 0.455, widthRatio: 8, heightRatio: 8 }
      ]
    },
    {
      id: 'layout-top-bottom',
      productTypeId: 'canvas-collage',
      name: 'Top + Bottom',
      description: '2 Horizontal stacked split photo slots',
      geometryType: 'collage',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'twoSplit',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 699.0,
      acrylicPrice: 599.0,
      panels: [
        { id: 'p0', label: 'Top Photo', dimension: '16" × 8"', x: 0.03, y: 0.03, w: 0.94, h: 0.455, widthRatio: 16, heightRatio: 8 },
        { id: 'p1', label: 'Bottom Photo', dimension: '16" × 8"', x: 0.03, y: 0.515, w: 0.94, h: 0.455, widthRatio: 16, heightRatio: 8 }
      ]
    },
    {
      id: 'layout-left-right',
      productTypeId: 'canvas-collage',
      name: 'Left + Right',
      description: '2 Equal vertical photo slots',
      geometryType: 'collage',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'twoSplit',
      dimensionsSummary: '20" × 16"',
      aspectRatio: 20 / 16,
      overallWidthInches: 20,
      overallHeightInches: 16,
      price: 799.0,
      acrylicPrice: 699.0,
      panels: [
        { id: 'p0', label: 'Left Photo', dimension: '10" × 16"', x: 0.03, y: 0.03, w: 0.455, h: 0.94, widthRatio: 10, heightRatio: 16 },
        { id: 'p1', label: 'Right Photo', dimension: '10" × 16"', x: 0.515, y: 0.03, w: 0.455, h: 0.94, widthRatio: 10, heightRatio: 16 }
      ]
    },
    {
      id: 'layout-main-2small',
      productTypeId: 'canvas-collage',
      name: 'Main + 2 Small',
      description: '1 Large left photo slot + 2 stacked right photo slots',
      geometryType: 'collage',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeCollage',
      dimensionsSummary: '20" × 15"',
      aspectRatio: 20 / 15,
      overallWidthInches: 20,
      overallHeightInches: 15,
      price: 999.0,
      acrylicPrice: 899.0,
      panels: [
        { id: 'p0', label: 'Left Main', dimension: '12" × 15"', x: 0.03, y: 0.03, w: 0.56, h: 0.94, widthRatio: 12, heightRatio: 15 },
        { id: 'p1', label: 'Top Right', dimension: '8" × 7.5"', x: 0.62, y: 0.03, w: 0.35, h: 0.455, widthRatio: 8, heightRatio: 7.5 },
        { id: 'p2', label: 'Bottom Right', dimension: '8" × 7.5"', x: 0.62, y: 0.515, w: 0.35, h: 0.455, widthRatio: 8, heightRatio: 7.5 }
      ]
    },
    {
      id: 'layout-9-grid',
      productTypeId: 'canvas-collage',
      name: '9 Photos Grid (3×3)',
      description: 'High-density 3×3 square photo collection',
      geometryType: 'collage',
      panelsCount: 9,
      photoCount: 9,
      arrangement: 'nineGrid',
      dimensionsSummary: '18" × 18"',
      aspectRatio: 1,
      overallWidthInches: 18,
      overallHeightInches: 18,
      price: 1799.0,
      acrylicPrice: 1599.0,
      panels: Array.from({ length: 9 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          id: `p${i}`,
          label: `Photo ${i + 1}`,
          dimension: '6" × 6"',
          x: 0.03 + col * 0.32,
          y: 0.03 + row * 0.32,
          w: 0.29,
          h: 0.29,
          widthRatio: 6,
          heightRatio: 6
        };
      })
    }
  ],

  // 5. Photo Mosaic (canvas-mosaic) - 7 exact configurations from reference
  'canvas-mosaic': [
    {
      id: 'mosaic2-4x4',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic2-4x4',
      description: '16 mosaic tiles in a 4×4 grid',
      geometryType: 'mosaic',
      panelsCount: 16,
      photoCount: 16,
      arrangement: 'mosaic2-4x4',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 148.5,
      acrylicPrice: 198.5,
      priceRange: '₹148.50 - ₹9,225.00',
      cols: 4,
      rows: 4,
      panels: Array.from({ length: 16 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const tileW = 1 / 4;
        const tileH = 1 / 4;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic4-5x5',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic4-5x5',
      description: '25 mosaic tiles in a 5×5 grid',
      geometryType: 'mosaic',
      panelsCount: 25,
      photoCount: 25,
      arrangement: 'mosaic4-5x5',
      dimensionsSummary: '20" × 20"',
      aspectRatio: 1,
      overallWidthInches: 20,
      overallHeightInches: 20,
      price: 148.5,
      acrylicPrice: 198.5,
      priceRange: '₹148.50 - ₹9,225.00',
      cols: 5,
      rows: 5,
      panels: Array.from({ length: 25 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const tileW = 1 / 5;
        const tileH = 1 / 5;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic6-6x6',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic6-6x6',
      description: '36 mosaic tiles in a 6×6 grid',
      geometryType: 'mosaic',
      panelsCount: 36,
      photoCount: 36,
      arrangement: 'mosaic6-6x6',
      dimensionsSummary: '24" × 24"',
      aspectRatio: 1,
      overallWidthInches: 24,
      overallHeightInches: 24,
      price: 148.5,
      acrylicPrice: 198.5,
      priceRange: '₹148.50 - ₹9,225.00',
      cols: 6,
      rows: 6,
      panels: Array.from({ length: 36 }, (_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const tileW = 1 / 6;
        const tileH = 1 / 6;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic3-3x4',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic3-3x4',
      description: '12 mosaic tiles in a 4×3 landscape grid',
      geometryType: 'mosaic',
      panelsCount: 12,
      photoCount: 12,
      arrangement: 'mosaic3-3x4',
      dimensionsSummary: '16" × 12"',
      aspectRatio: 16 / 12,
      overallWidthInches: 16,
      overallHeightInches: 12,
      price: 405.0,
      acrylicPrice: 505.0,
      priceRange: '₹405.00 - ₹5,517.00',
      cols: 4,
      rows: 3,
      panels: Array.from({ length: 12 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const tileW = 1 / 4;
        const tileH = 1 / 3;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic5-4x5',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic5-4x5',
      description: '20 mosaic tiles in a 4×5 portrait grid',
      geometryType: 'mosaic',
      panelsCount: 20,
      photoCount: 20,
      arrangement: 'mosaic5-4x5',
      dimensionsSummary: '16" × 20"',
      aspectRatio: 16 / 20,
      overallWidthInches: 16,
      overallHeightInches: 20,
      price: 645.0,
      acrylicPrice: 795.0,
      priceRange: '₹645.00 - ₹5,176.50',
      cols: 4,
      rows: 5,
      panels: Array.from({ length: 20 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const tileW = 1 / 4;
        const tileH = 1 / 5;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic1-3x4',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic1-3x4',
      description: '12 mosaic tiles in a 3×4 portrait grid',
      geometryType: 'mosaic',
      panelsCount: 12,
      photoCount: 12,
      arrangement: 'mosaic1-3x4',
      dimensionsSummary: '12" × 16"',
      aspectRatio: 12 / 16,
      overallWidthInches: 12,
      overallHeightInches: 16,
      price: 685.5,
      acrylicPrice: 845.0,
      priceRange: '₹685.50 - ₹5,517.00',
      cols: 3,
      rows: 4,
      panels: Array.from({ length: 12 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const tileW = 1 / 3;
        const tileH = 1 / 4;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    },
    {
      id: 'mosaic7-5x3',
      productTypeId: 'canvas-mosaic',
      name: 'Mosaic7-5x3',
      description: '15 mosaic tiles in a 3×5 portrait grid',
      geometryType: 'mosaic',
      panelsCount: 15,
      photoCount: 15,
      arrangement: 'mosaic7-5x3',
      dimensionsSummary: '12" × 20"',
      aspectRatio: 12 / 20,
      overallWidthInches: 12,
      overallHeightInches: 20,
      price: 813.0,
      acrylicPrice: 999.0,
      priceRange: '₹813.00 - ₹3,105.00',
      cols: 3,
      rows: 5,
      panels: Array.from({ length: 15 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const tileW = 1 / 3;
        const tileH = 1 / 5;
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '4" × 4"',
          x: col * tileW,
          y: row * tileH,
          w: tileW,
          h: tileH,
          widthRatio: 4,
          heightRatio: 4
        };
      })
    }
  ],

  // 6. Single Print & Classic Canvas (canvas-single, canvas-classic)
  'canvas-single': [
    {
      id: 'layout-1-single',
      productTypeId: 'canvas-single',
      name: 'Single Full Canvas',
      description: 'Classic single edge-to-edge photo layout',
      geometryType: 'rectangle',
      panelsCount: 1,
      photoCount: 1,
      arrangement: 'single',
      dimensionsSummary: '10" × 10"',
      aspectRatio: 1,
      overallWidthInches: 10,
      overallHeightInches: 10,
      price: 199.0,
      acrylicPrice: 799.00,
      panels: [
        {
          id: 'p0',
          label: 'Canvas',
          dimension: '10" × 10"',
          x: 0.05,
          y: 0.05,
          w: 0.90,
          h: 0.90,
          borderRadius: '3px'
        }
      ]
    },
    {
      id: 'layout-2-split',
      productTypeId: 'canvas-single',
      name: '2 Photos Split',
      description: '2 photos side-by-side with crisp divider',
      geometryType: 'collage',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'twoSplit',
      dimensionsSummary: '12" × 18"',
      aspectRatio: 18 / 12,
      overallWidthInches: 18,
      overallHeightInches: 12,
      price: 449.0,
      acrylicPrice: 899.00,
      panels: [
        { id: 'p0', label: 'Photo 1', dimension: '9" × 12"', x: 0.04, y: 0.06, w: 0.44, h: 0.88 },
        { id: 'p1', label: 'Photo 2', dimension: '9" × 12"', x: 0.52, y: 0.06, w: 0.44, h: 0.88 }
      ]
    },
    {
      id: 'layout-top-bottom',
      productTypeId: 'canvas-single',
      name: 'Top & Bottom (2 Photos)',
      description: '2 horizontal photo sections stacked vertically',
      geometryType: 'collage',
      panelsCount: 2,
      photoCount: 2,
      arrangement: 'topBottom',
      dimensionsSummary: '12" × 18"',
      aspectRatio: 12 / 18,
      overallWidthInches: 12,
      overallHeightInches: 18,
      price: 449.0,
      acrylicPrice: 899.00,
      panels: [
        { id: 'p0', label: 'Top', dimension: '12" × 9"', x: 0.06, y: 0.04, w: 0.88, h: 0.44 },
        { id: 'p1', label: 'Bottom', dimension: '12" × 9"', x: 0.06, y: 0.52, w: 0.88, h: 0.44 }
      ]
    },
    {
      id: 'layout-3-collage',
      productTypeId: 'canvas-single',
      name: '3 Photos Collage',
      description: '1 large focal photo with 2 smaller accents',
      geometryType: 'collage',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeCollage',
      dimensionsSummary: '16" × 20"',
      aspectRatio: 16 / 20,
      overallWidthInches: 16,
      overallHeightInches: 20,
      price: 649.0,
      acrylicPrice: 1199.00,
      panels: [
        { id: 'p0', label: 'Main', dimension: '16" × 12"', x: 0.05, y: 0.05, w: 0.90, h: 0.50 },
        { id: 'p1', label: 'Accent 1', dimension: '8" × 8"', x: 0.05, y: 0.58, w: 0.43, h: 0.37 },
        { id: 'p2', label: 'Accent 2', dimension: '8" × 8"', x: 0.52, y: 0.58, w: 0.43, h: 0.37 }
      ]
    },
    {
      id: 'layout-main-two-small',
      productTypeId: 'canvas-single',
      name: '1 Large + 2 Accents',
      description: 'Left vertical hero with 2 stacked side photos',
      geometryType: 'collage',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'mainTwoSmall',
      dimensionsSummary: '20" × 16"',
      aspectRatio: 20 / 16,
      overallWidthInches: 20,
      overallHeightInches: 16,
      price: 649.0,
      acrylicPrice: 1199.00,
      panels: [
        { id: 'p0', label: 'Left Hero', dimension: '12" × 16"', x: 0.04, y: 0.04, w: 0.52, h: 0.92 },
        { id: 'p1', label: 'Top Accent', dimension: '8" × 8"', x: 0.60, y: 0.04, w: 0.36, h: 0.44 },
        { id: 'p2', label: 'Bottom Accent', dimension: '8" × 8"', x: 0.60, y: 0.52, w: 0.36, h: 0.44 }
      ]
    },
    {
      id: 'layout-4-grid',
      productTypeId: 'canvas-single',
      name: '4 Photos Grid (2×2)',
      description: '4 balanced photos in 2×2 square matrix',
      geometryType: 'collage',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 699.0,
      acrylicPrice: 1299.00,
      panels: [
        { id: 'p0', label: 'Photo 1', dimension: '8" × 8"', x: 0.05, y: 0.05, w: 0.43, h: 0.43 },
        { id: 'p1', label: 'Photo 2', dimension: '8" × 8"', x: 0.52, y: 0.05, w: 0.43, h: 0.43 },
        { id: 'p2', label: 'Photo 3', dimension: '8" × 8"', x: 0.05, y: 0.52, w: 0.43, h: 0.43 },
        { id: 'p3', label: 'Photo 4', dimension: '8" × 8"', x: 0.52, y: 0.52, w: 0.43, h: 0.43 }
      ]
    }
  ]
};

// Map alternate product type IDs to their parent layout set
PRODUCT_LAYOUT_DEFINITIONS['canvas-classic'] = PRODUCT_LAYOUT_DEFINITIONS['canvas-single'];

/**
 * Returns all layout definitions for a given productTypeId
 */
export function getProductLayouts(productTypeId: string): ProductLayoutDefinition[] {
  const normId = (productTypeId || '').toLowerCase();
  if (normId.includes('hexagon')) {
    return PRODUCT_LAYOUT_DEFINITIONS['canvas-hexagon'];
  }
  if (normId.includes('wall') || normId.includes('display')) {
    return PRODUCT_LAYOUT_DEFINITIONS['canvas-wall-art'];
  }
  if (normId.includes('split')) {
    return PRODUCT_LAYOUT_DEFINITIONS['canvas-split'];
  }
  if (normId.includes('collage')) {
    return PRODUCT_LAYOUT_DEFINITIONS['canvas-collage'];
  }
  if (normId.includes('mosaic')) {
    return PRODUCT_LAYOUT_DEFINITIONS['canvas-mosaic'];
  }
  return PRODUCT_LAYOUT_DEFINITIONS['canvas-single'] || [];
}

/**
 * Resolves a specific layout definition for a given product and layout ID
 */
export function getProductLayout(productTypeId: string, layoutId?: string): ProductLayoutDefinition {
  const layouts = getProductLayouts(productTypeId);
  if (!layoutId) return layouts[0];
  const normKey = layoutId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const found = layouts.find((l) => {
    if (l.id === layoutId) return true;
    if (l.name.toLowerCase() === layoutId.toLowerCase()) return true;
    const lNorm = l.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (lNorm === normKey) return true;
    if ((l as any).diagramType === layoutId) return true;
    if (layoutId.startsWith(l.id) || l.id.startsWith(layoutId)) return true;
    // Map legacy / alternative IDs for Mosaic
    if (normKey.includes('4x4') && lNorm.includes('4x4')) return true;
    if (normKey.includes('5x5') && lNorm.includes('5x5')) return true;
    if ((normKey.includes('6x6') || normKey.includes('86x6')) && lNorm.includes('6x6')) return true;
    if (normKey.includes('3x4') && !normKey.includes('13x4') && lNorm.includes('3x4') && l.aspectRatio > 1) return true;
    if (normKey.includes('4x5') && lNorm.includes('4x5')) return true;
    if ((normKey.includes('13x4') || (normKey.includes('3x4') && l.aspectRatio < 1)) && (lNorm.includes('13x4') || lNorm.includes('1-3x4'))) return true;
    if (normKey.includes('5x3') && lNorm.includes('5x3')) return true;
    return false;
  });
  return found || layouts[0];
}

/**
 * Honeycomb cluster positioning for 1, 2, 3, or 4 hexagon panels.
 * Adjacent hexagons lock together along shared edges.
 */
export function getHexagonClusterLayout(count: number): HexPanelLayout[] {
  const key = count === 2 ? 'hexagon-2' : count === 3 ? 'hexagon-3' : count === 4 ? 'hexagon-4' : 'hexagon-1';
  const layoutDef = PRODUCT_LAYOUT_DEFINITIONS['canvas-hexagon']?.find((l) => l.id === key);
  if (layoutDef) {
    return layoutDef.panels.map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h }));
  }
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

/**
 * Renders an artistic sketch portrait pencil face inside preview slots.
 */
function renderPencilFace(cx: number, cy: number, h: number): React.ReactNode {
  const r = Math.max(7, h * 0.26);
  return (
    <g stroke="#475569" strokeWidth={Math.max(1, h * 0.022)} fill="none" strokeLinecap="round">
      <circle cx={cx} cy={cy} r={r} />
      {/* Eyebrows */}
      <path d={`M ${cx - r * 0.6} ${cy - r * 0.42} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} 0`} />
      <path d={`M ${cx + r * 0.1} ${cy - r * 0.42} q ${r * 0.3} ${-r * 0.2} ${r * 0.5} 0`} />
      {/* Eyes */}
      <path d={`M ${cx - r * 0.55} ${cy - r * 0.15} q ${r * 0.15} ${-r * 0.35} ${r * 0.3} 0`} />
      <path d={`M ${cx + r * 0.25} ${cy - r * 0.15} q ${r * 0.15} ${-r * 0.35} ${r * 0.3} 0`} />
      {/* Smile */}
      <path d={`M ${cx - r * 0.45} ${cy + r * 0.3} q ${r * 0.45} ${r * 0.32} ${r * 0.9} 0`} />
      {/* Subtle shading */}
      <path
        d={`M ${cx - r * 0.12} ${cy + r * 0.42} q ${r * 0.12} ${r * 0.55} ${r * 0.3} ${r * 0.1}`}
        fill="#64748b"
        fillOpacity="0.15"
      />
    </g>
  );
}

/**
 * Generates regular hexagon polygon points string for SVG.
 */
function hexPolygonPoints(cx: number, cy: number, w: number, h: number): string {
  return [
    `${cx - w * 0.25},${cy - h * 0.5}`,
    `${cx + w * 0.25},${cy - h * 0.5}`,
    `${cx + w * 0.5},${cy}`,
    `${cx + w * 0.25},${cy + h * 0.5}`,
    `${cx - w * 0.25},${cy + h * 0.5}`,
    `${cx - w * 0.5},${cy}`
  ].join(' ');
}

/**
 * Centralized SVG diagram renderer for Layout Modal & Sidebar layout cards.
 * Produces authentic geometry matching actual workspace panels.
 */
export function renderProductLayoutDiagram(
  layout: ProductLayoutDefinition,
  isSelected: boolean
): React.ReactNode {
  const strokeColor = isSelected ? '#0E4A93' : '#94a3b8';
  const fillColor = isSelected ? '#eff6ff' : '#f8fafc';
  const viewBoxW = 160;
  const viewBoxH = 100;

  // 1. Hexagon Prints (true hexagon polygons with pencil faces)
  if (layout.geometryType === 'hexagon' || layout.geometryType === 'hexagon-cluster') {
    return (
      <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full max-h-24">
        {layout.panels.map((p, idx) => {
          const cx = (p.x + p.w / 2) * viewBoxW;
          const cy = (p.y + p.h / 2) * viewBoxH;
          const w = p.w * viewBoxW;
          const h = p.h * viewBoxH;
          return (
            <g key={p.id || idx}>
              <polygon
                points={hexPolygonPoints(cx, cy, w, h)}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.6"
              />
              {renderPencilFace(cx, cy, h)}
            </g>
          );
        })}
      </svg>
    );
  }

  // 1b. Photo Mosaic (continuous rectangular product surface with hairline grid divisions, 0 gaps)
  if (layout.geometryType === 'mosaic') {
    const cols = layout.cols || (layout.panelsCount === 16 ? 4 : layout.panelsCount === 25 ? 5 : layout.panelsCount === 36 ? 6 : layout.panelsCount === 20 ? 4 : layout.panelsCount === 15 ? 3 : layout.panelsCount === 12 && layout.aspectRatio > 1 ? 4 : 3);
    const rows = layout.rows || Math.ceil(layout.panelsCount / cols);
    const padding = 12;
    const availW = viewBoxW - padding * 2;
    const availH = viewBoxH - padding * 2;
    const gridAspect = layout.aspectRatio || (cols / rows);
    let drawW = availW;
    let drawH = drawW / gridAspect;
    if (drawH > availH) {
      drawH = availH;
      drawW = drawH * gridAspect;
    }
    const startX = (viewBoxW - drawW) / 2;
    const startY = (viewBoxH - drawH) / 2;

    return (
      <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full max-h-24">
        {/* Continuous single surface (0 gap) */}
        <rect
          x={startX}
          y={startY}
          width={drawW}
          height={drawH}
          rx={2}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.6"
        />
        {/* Internal division grid lines (0 gap) */}
        {Array.from({ length: cols - 1 }).map((_, c) => {
          const x = startX + ((c + 1) / cols) * drawW;
          return (
            <line
              key={`mv-${c}`}
              x1={x}
              y1={startY}
              x2={x}
              y2={startY + drawH}
              stroke={strokeColor}
              strokeWidth="0.9"
              opacity="0.75"
            />
          );
        })}
        {Array.from({ length: rows - 1 }).map((_, r) => {
          const y = startY + ((r + 1) / rows) * drawH;
          return (
            <line
              key={`mh-${r}`}
              x1={startX}
              y1={y}
              x2={startX + drawW}
              y2={y}
              stroke={strokeColor}
              strokeWidth="0.9"
              opacity="0.75"
            />
          );
        })}
      </svg>
    );
  }

  // 1c. Split Canvas (multi-panel physical card icons matching reference screenshots)
  if (layout.geometryType === 'split-canvas') {
    const padding = 12;
    const availW = viewBoxW - padding * 2;
    const availH = viewBoxH - padding * 2;
    const gridAspect = Math.max(0.65, Math.min(2.4, layout.aspectRatio || 1.5));
    let drawW = availW;
    let drawH = drawW / gridAspect;
    if (drawH > availH) {
      drawH = availH;
      drawW = drawH * gridAspect;
    }
    const startX = (viewBoxW - drawW) / 2;
    const startY = (viewBoxH - drawH) / 2;
    const gap = 2;

    return (
      <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full max-h-24">
        {layout.panels.map((p, idx) => {
          const px = startX + p.x * drawW + gap / 2;
          const py = startY + p.y * drawH + gap / 2;
          const pw = Math.max(2, p.w * drawW - gap);
          const ph = Math.max(2, p.h * drawH - gap);
          return (
            <rect
              key={p.id || idx}
              x={px}
              y={py}
              width={pw}
              height={ph}
              rx={1.5}
              fill={isSelected ? '#0E4A93' : '#9ca3af'}
              opacity={isSelected ? 0.9 : 0.85}
            />
          );
        })}
      </svg>
    );
  }

  // 2. Wall Display, Collage, Single Print
  const isOuterBorder = layout.geometryType === 'collage';

  return (
    <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full max-h-24">
      {/* Background card frame for collage */}
      {isOuterBorder && (
        <rect
          x="12"
          y="6"
          width="136"
          height="88"
          rx="3"
          fill="#ffffff"
          stroke={isSelected ? '#0E4A93' : '#cbd5e1'}
          strokeWidth="1.2"
        />
      )}

      {layout.panels.map((p, idx) => {
        const x = p.x * viewBoxW;
        const y = p.y * viewBoxH;
        const w = p.w * viewBoxW;
        const h = p.h * viewBoxH;
        const cx = x + w / 2;
        const cy = y + h / 2;

        return (
          <g key={p.id || idx}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.4"
            />
            {/* If slot is large enough, render artistic pencil face */}
            {h >= 24 && w >= 24 && renderPencilFace(cx, cy, Math.min(w, h))}
            {/* Dimension label if available */}
            {p.dimension && h < 38 && (
              <text
                x={cx}
                y={cy + 3}
                fill={strokeColor}
                fontSize="6"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.dimension}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Resolves the explicit Canvas product geometry.
 */
export function getCanvasProductGeometry(
  productTypeId: string,
  sizeOption?: {
    id?: string;
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
    const layoutDef = getProductLayout('canvas-hexagon', sizeOption?.diagramType || sizeOption?.id);
    const hexLayout = layoutDef.panels.map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h }));
    return {
      productTypeId,
      geometryType: layoutDef.geometryType,
      shapeId: 'shape-hexagon',
      aspectRatio: layoutDef.aspectRatio,
      widthInches: layoutDef.overallWidthInches,
      heightInches: layoutDef.overallHeightInches,
      clipPath: HEXAGON_CLIP_PATH,
      borderRadius: '0px',
      isMultiPanel: layoutDef.panelsCount > 1,
      panelsCount: layoutDef.panelsCount,
      hexPanelsLayout: hexLayout,
      layoutDef,
      renderSvgPreview: ({ isSelected }) => renderProductLayoutDiagram(layoutDef, Boolean(isSelected))
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

  // 6. Split Canvas
  if (normType.includes('split')) {
    const layoutDef = getProductLayout('canvas-split', sizeOption?.diagramType || sizeOption?.id);
    return {
      productTypeId,
      geometryType: 'split-canvas',
      shapeId: 'shape-rectangle',
      aspectRatio: layoutDef.aspectRatio,
      widthInches: layoutDef.overallWidthInches,
      heightInches: layoutDef.overallHeightInches,
      isMultiPanel: true,
      panelsCount: layoutDef.panelsCount,
      layoutDef,
      renderSvgPreview: ({ isSelected }) => renderProductLayoutDiagram(layoutDef, Boolean(isSelected))
    };
  }

  // 7. Wall Display
  if (normType.includes('wall') || normType.includes('display')) {
    const layoutDef = getProductLayout('canvas-wall-art', sizeOption?.diagramType || sizeOption?.id);
    return {
      productTypeId,
      geometryType: 'wall-display',
      shapeId: 'shape-rectangle',
      aspectRatio: layoutDef.aspectRatio,
      widthInches: layoutDef.overallWidthInches,
      heightInches: layoutDef.overallHeightInches,
      isMultiPanel: true,
      panelsCount: layoutDef.panelsCount,
      layoutDef,
      renderSvgPreview: ({ isSelected }) => renderProductLayoutDiagram(layoutDef, Boolean(isSelected))
    };
  }

  // 8. Photo Mosaic
  if (normType.includes('mosaic')) {
    const layoutDef = getProductLayout('canvas-mosaic', sizeOption?.diagramType || sizeOption?.id);
    return {
      productTypeId,
      geometryType: 'mosaic',
      shapeId: 'shape-square',
      aspectRatio: layoutDef.aspectRatio,
      widthInches: layoutDef.overallWidthInches,
      heightInches: layoutDef.overallHeightInches,
      isMultiPanel: true,
      panelsCount: layoutDef.panelsCount,
      layoutDef,
      renderSvgPreview: ({ isSelected }) => renderProductLayoutDiagram(layoutDef, Boolean(isSelected))
    };
  }

  // 9. Photo Collage
  if (normType.includes('collage')) {
    const layoutDef = getProductLayout('canvas-collage', sizeOption?.diagramType || sizeOption?.id);
    return {
      productTypeId,
      geometryType: 'collage',
      shapeId: 'shape-square',
      aspectRatio: layoutDef.aspectRatio,
      widthInches: layoutDef.overallWidthInches,
      heightInches: layoutDef.overallHeightInches,
      isMultiPanel: false,
      panelsCount: layoutDef.panelsCount,
      layoutDef,
      renderSvgPreview: ({ isSelected }) => renderProductLayoutDiagram(layoutDef, Boolean(isSelected))
    };
  }

  // 10. Word Art
  if (normType.includes('word')) {
    const rawRatio = width / Math.max(1, height);
    return {
      productTypeId,
      geometryType: 'rectangle',
      shapeId: width === height ? 'shape-square' : 'shape-rectangle',
      aspectRatio: rawRatio || 1,
      widthInches: width,
      heightInches: height,
      borderRadius: '2px',
      isMultiPanel: false,
      panelsCount: 1,
      renderSvgPreview: ({ isSelected, widthInches, heightInches }) => {
        const clampedRatio = Math.max(0.65, Math.min(2.1, rawRatio));
        const hBox = clampedRatio > 1.4 ? 26 : 34;
        const wBox = Math.round(hBox * clampedRatio);
        const boxClass = `rounded-[3px] border-2 transition-colors ${
          isSelected ? 'border-[#0E4A93] bg-[#0E4A93]/20' : 'border-stone-400 bg-[#0E4A93]/12'
        }`;
        return (
          <div style={{ width: `${wBox}px`, height: `${hBox}px` }} className={`${boxClass} flex items-center justify-center`}>
            <span className="text-[7.5px] font-bold text-stone-600">
              {widthInches && heightInches ? `${widthInches}×${heightInches}` : ''}
            </span>
          </div>
        );
      }
    };
  }

  // 11. Default / Single Print (Rectangle/Square)
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
