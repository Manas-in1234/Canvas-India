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
      id: 'split-2p',
      productTypeId: 'canvas-split',
      name: '2-Piece Diptych Split',
      description: '1 panoramic photo split across 2 vertical panels',
      geometryType: 'split-canvas',
      panelsCount: 2,
      photoCount: 1,
      arrangement: 'twoSplit',
      dimensionsSummary: '24" × 16" total',
      aspectRatio: 24 / 16,
      overallWidthInches: 24,
      overallHeightInches: 16,
      price: 1199.0,
      acrylicPrice: 674.50,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '12" × 16"',
          x: 0.02,
          y: 0.04,
          w: 0.47,
          h: 0.92,
          widthRatio: 12,
          heightRatio: 16
        },
        {
          id: 'p1',
          label: 'Right Panel',
          dimension: '12" × 16"',
          x: 0.51,
          y: 0.04,
          w: 0.47,
          h: 0.92,
          widthRatio: 12,
          heightRatio: 16
        }
      ]
    },
    {
      id: 'split-3p-36x24',
      productTypeId: 'canvas-split',
      name: '3-Piece Triptych Split',
      description: '1 continuous panoramic photo split across 3 panels',
      geometryType: 'split-canvas',
      panelsCount: 3,
      photoCount: 1,
      arrangement: 'threeSplit',
      dimensionsSummary: '36" × 24" total',
      aspectRatio: 36 / 24,
      overallWidthInches: 36,
      overallHeightInches: 24,
      price: 2199.0,
      acrylicPrice: 1890.00,
      panels: [
        {
          id: 'p0',
          label: 'Left Panel',
          dimension: '12" × 24"',
          x: 0.02,
          y: 0.04,
          w: 0.31,
          h: 0.92,
          widthRatio: 12,
          heightRatio: 24
        },
        {
          id: 'p1',
          label: 'Center Panel',
          dimension: '12" × 24"',
          x: 0.345,
          y: 0.04,
          w: 0.31,
          h: 0.92,
          widthRatio: 12,
          heightRatio: 24
        },
        {
          id: 'p2',
          label: 'Right Panel',
          dimension: '12" × 24"',
          x: 0.67,
          y: 0.04,
          w: 0.31,
          h: 0.92,
          widthRatio: 12,
          heightRatio: 24
        }
      ]
    },
    {
      id: 'split-4panel-10x20',
      productTypeId: 'canvas-split',
      name: '4-Piece Quad Split',
      description: '1 wide photo split into 4 vertical panels',
      geometryType: 'split-canvas',
      panelsCount: 4,
      photoCount: 1,
      arrangement: 'fourGrid',
      dimensionsSummary: '40" × 20" total',
      aspectRatio: 40 / 20,
      overallWidthInches: 40,
      overallHeightInches: 20,
      price: 2899.0,
      acrylicPrice: 2450.00,
      panels: [
        {
          id: 'p0',
          label: 'Panel 1',
          dimension: '10" × 20"',
          x: 0.02,
          y: 0.04,
          w: 0.23,
          h: 0.92,
          widthRatio: 10,
          heightRatio: 20
        },
        {
          id: 'p1',
          label: 'Panel 2',
          dimension: '10" × 20"',
          x: 0.265,
          y: 0.04,
          w: 0.23,
          h: 0.92,
          widthRatio: 10,
          heightRatio: 20
        },
        {
          id: 'p2',
          label: 'Panel 3',
          dimension: '10" × 20"',
          x: 0.51,
          y: 0.04,
          w: 0.23,
          h: 0.92,
          widthRatio: 10,
          heightRatio: 20
        },
        {
          id: 'p3',
          label: 'Panel 4',
          dimension: '10" × 20"',
          x: 0.755,
          y: 0.04,
          w: 0.23,
          h: 0.92,
          widthRatio: 10,
          heightRatio: 20
        }
      ]
    }
  ],

  // 4. Photo Collage (canvas-collage)
  'canvas-collage': [
    {
      id: 'layout-2-split',
      productTypeId: 'canvas-collage',
      name: '2 Photos Dual Split',
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
      acrylicPrice: 426.00,
      panels: [
        {
          id: 'p0',
          label: 'Photo 1',
          dimension: '9" × 12"',
          x: 0.02,
          y: 0.04,
          w: 0.47,
          h: 0.92,
          widthRatio: 9,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Photo 2',
          dimension: '9" × 12"',
          x: 0.51,
          y: 0.04,
          w: 0.47,
          h: 0.92,
          widthRatio: 9,
          heightRatio: 12
        }
      ]
    },
    {
      id: 'layout-3-collage',
      productTypeId: 'canvas-collage',
      name: '3 Photos Feature Collage',
      description: '1 Main top photograph with 2 supporting bottom photos',
      geometryType: 'collage',
      panelsCount: 3,
      photoCount: 3,
      arrangement: 'threeCollage',
      dimensionsSummary: '16" × 20"',
      aspectRatio: 16 / 20,
      overallWidthInches: 16,
      overallHeightInches: 20,
      price: 899.0,
      acrylicPrice: 799.00,
      panels: [
        {
          id: 'p0',
          label: 'Top Main',
          dimension: '16" × 12"',
          x: 0.04,
          y: 0.04,
          w: 0.92,
          h: 0.52,
          widthRatio: 16,
          heightRatio: 12
        },
        {
          id: 'p1',
          label: 'Bottom Left',
          dimension: '8" × 8"',
          x: 0.04,
          y: 0.58,
          w: 0.44,
          h: 0.38,
          widthRatio: 8,
          heightRatio: 8
        },
        {
          id: 'p2',
          label: 'Bottom Right',
          dimension: '8" × 8"',
          x: 0.52,
          y: 0.58,
          w: 0.44,
          h: 0.38,
          widthRatio: 8,
          heightRatio: 8
        }
      ]
    },
    {
      id: 'layout-4-grid',
      productTypeId: 'canvas-collage',
      name: '4 Photos Grid (2×2)',
      description: 'Classic symmetrical 2×2 square quad grid',
      geometryType: 'collage',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '16" × 16"',
      aspectRatio: 1,
      overallWidthInches: 16,
      overallHeightInches: 16,
      price: 1199.0,
      acrylicPrice: 999.00,
      panels: [
        { id: 'p0', label: 'Photo 1', dimension: '8" × 8"', x: 0.04, y: 0.04, w: 0.44, h: 0.44, widthRatio: 8, heightRatio: 8 },
        { id: 'p1', label: 'Photo 2', dimension: '8" × 8"', x: 0.52, y: 0.04, w: 0.44, h: 0.44, widthRatio: 8, heightRatio: 8 },
        { id: 'p2', label: 'Photo 3', dimension: '8" × 8"', x: 0.04, y: 0.52, w: 0.44, h: 0.44, widthRatio: 8, heightRatio: 8 },
        { id: 'p3', label: 'Photo 4', dimension: '8" × 8"', x: 0.52, y: 0.52, w: 0.44, h: 0.44, widthRatio: 8, heightRatio: 8 }
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
      acrylicPrice: 1599.00,
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

  // 5. Photo Mosaic (canvas-mosaic)
  'canvas-mosaic': [
    {
      id: 'mosaic-4p-10x10',
      productTypeId: 'canvas-mosaic',
      name: '4 Mosaic Tiles (2×2)',
      description: '4 artistic mosaic photo blocks',
      geometryType: 'mosaic',
      panelsCount: 4,
      photoCount: 4,
      arrangement: 'fourGrid',
      dimensionsSummary: '10" × 10"',
      aspectRatio: 1,
      overallWidthInches: 10,
      overallHeightInches: 10,
      price: 699.0,
      acrylicPrice: 799.00,
      panels: [
        { id: 'p0', label: 'Tile 1', dimension: '5" × 5"', x: 0.04, y: 0.04, w: 0.44, h: 0.44, widthRatio: 5, heightRatio: 5 },
        { id: 'p1', label: 'Tile 2', dimension: '5" × 5"', x: 0.52, y: 0.04, w: 0.44, h: 0.44, widthRatio: 5, heightRatio: 5 },
        { id: 'p2', label: 'Tile 3', dimension: '5" × 5"', x: 0.04, y: 0.52, w: 0.44, h: 0.44, widthRatio: 5, heightRatio: 5 },
        { id: 'p3', label: 'Tile 4', dimension: '5" × 5"', x: 0.52, y: 0.52, w: 0.44, h: 0.44, widthRatio: 5, heightRatio: 5 }
      ]
    },
    {
      id: 'mosaic-6p-18x12',
      productTypeId: 'canvas-mosaic',
      name: '6 Mosaic Tiles (3×2)',
      description: '6 artistic mosaic photo blocks in landscape layout',
      geometryType: 'mosaic',
      panelsCount: 6,
      photoCount: 6,
      arrangement: 'sixGrid',
      dimensionsSummary: '18" × 12"',
      aspectRatio: 18 / 12,
      overallWidthInches: 18,
      overallHeightInches: 12,
      price: 999.0,
      acrylicPrice: 1199.00,
      panels: Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '6" × 6"',
          x: 0.03 + col * 0.32,
          y: 0.04 + row * 0.46,
          w: 0.29,
          h: 0.42,
          widthRatio: 6,
          heightRatio: 6
        };
      })
    },
    {
      id: 'mosaic-9p-18x18',
      productTypeId: 'canvas-mosaic',
      name: '9 Mosaic Tiles (3×3)',
      description: '9 artistic mosaic photo blocks in square grid',
      geometryType: 'mosaic',
      panelsCount: 9,
      photoCount: 9,
      arrangement: 'nineGrid',
      dimensionsSummary: '18" × 18"',
      aspectRatio: 1,
      overallWidthInches: 18,
      overallHeightInches: 18,
      price: 1299.0,
      acrylicPrice: 1499.00,
      panels: Array.from({ length: 9 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '6" × 6"',
          x: 0.03 + col * 0.32,
          y: 0.03 + row * 0.32,
          w: 0.29,
          h: 0.29,
          widthRatio: 6,
          heightRatio: 6
        };
      })
    },
    {
      id: 'mosaic-16p-20x20',
      productTypeId: 'canvas-mosaic',
      name: '16 Mosaic Tiles (4×4)',
      description: '16 detailed micro-photo mosaic blocks',
      geometryType: 'mosaic',
      panelsCount: 16,
      photoCount: 16,
      arrangement: 'sixteenGrid',
      dimensionsSummary: '20" × 20"',
      aspectRatio: 1,
      overallWidthInches: 20,
      overallHeightInches: 20,
      price: 1999.0,
      acrylicPrice: 2299.00,
      panels: Array.from({ length: 16 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return {
          id: `p${i}`,
          label: `Tile ${i + 1}`,
          dimension: '5" × 5"',
          x: 0.02 + col * 0.245,
          y: 0.02 + row * 0.245,
          w: 0.22,
          h: 0.22,
          widthRatio: 5,
          heightRatio: 5
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
  const found = layouts.find((l) => l.id === layoutId);
  return found || layouts[0];
}

/**
 * Honeycomb cluster positioning for 1, 2, 3, or 4 hexagon panels.
 * Directly sourced from the centralized PRODUCT_LAYOUT_DEFINITIONS['canvas-hexagon'].
 */
export function getHexagonClusterLayout(count: number): HexPanelLayout[] {
  const key = count === 2 ? 'hexagon-2' : count === 3 ? 'hexagon-3' : count === 4 ? 'hexagon-4' : 'hexagon-1';
  const layoutDef = PRODUCT_LAYOUT_DEFINITIONS['canvas-hexagon'].find((l) => l.id === key);
  if (layoutDef) {
    return layoutDef.panels.map((p) => ({ x: p.x, y: p.y, w: p.w, h: p.h }));
  }
  return [{ x: 0.08, y: 0.05, w: 0.84, h: 0.90 }];
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

  // 2. Wall Display, Split Canvas, Collage, Mosaic, Single Print
  const isOuterBorder = layout.geometryType === 'collage' || layout.geometryType === 'mosaic';

  return (
    <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="w-full h-full max-h-24">
      {/* Background card frame for collage / mosaic */}
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
