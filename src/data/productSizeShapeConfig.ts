// ============================================================================
// CENTRALIZED PRODUCT SIZE & SHAPE CONFIGURATIONS
// Provides product-aware size and shape configurations for Canvas and Acrylic.
// Follows all sizing limits (approx 5-6 useful options for non-square, full square
// catalog, shape-specific dimensions, and multi-piece presets matching reference).
// ============================================================================

export interface SizeShapeOption {
  id: string;
  shapeId: string;
  shapeName: string;
  label: string;
  dimensionsSummary: string;
  widthInches: number;
  heightInches: number;
  price: number;
  aspectRatio: number;
  category: 'SQUARE' | 'RECTANGLE' | 'LANDSCAPE' | 'PORTRAIT' | 'SPECIAL' | 'MULTI_PANEL';
  panelsCount?: number;
  pieceBreakdown?: string;
  arrangement?: string;
  diagramType?: 'single-shape' | 'wall-display-3a' | 'wall-display-3b' | 'wall-display-4a' | 'wall-display-tiered' | 'wall-display-triptych' | 'wall-display-5piece' | 'split-2' | 'split-3' | 'split-4' | 'collage-2' | 'collage-3' | 'collage-4' | 'collage-9' | 'mosaic-4' | 'mosaic-6' | 'mosaic-9' | 'mosaic-16' | 'hexagon-1' | 'hexagon-2' | 'hexagon-3' | 'hexagon-4' | string;
  panels?: Array<{ id: string; label: string; dimension: string; widthRatio: number; heightRatio: number }>;
}

export interface ShapeDefinition {
  id: string;
  label: string;
  category: 'basic' | 'special' | 'decorative';
}

export const ALL_SHAPE_DEFINITIONS: ShapeDefinition[] = [
  { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' },
  { id: 'shape-square', label: 'Square', category: 'basic' },
  { id: 'shape-landscape', label: 'Landscape', category: 'basic' },
  { id: 'shape-portrait', label: 'Portrait', category: 'basic' },
  { id: 'shape-circle', label: 'Round / Circle', category: 'special' },
  { id: 'shape-oval', label: 'Oval', category: 'special' },
  { id: 'shape-rounded-rect', label: 'Rounded Rect', category: 'special' },
  { id: 'shape-heart', label: 'Heart', category: 'decorative' },
  { id: 'shape-triangle', label: 'Triangle', category: 'decorative' },
  { id: 'shape-hexagon', label: 'Hexagon', category: 'decorative' },
  { id: 'shape-panoramic', label: 'Panoramic', category: 'special' }
];

// Helper to generate standardized shape sizes
export const STANDARD_SHAPE_SIZES: Record<string, Array<{ width: number; height: number; label: string; acrylicPrice: number; canvasPrice: number }>> = {
  // Square: EXACTLY four sizes (Requirement 1: 10"x10", 16"x16", 18"x18", 20"x20")
  'shape-square': [
    { width: 10, height: 10, label: '10" × 10"', acrylicPrice: 799.0, canvasPrice: 199.0 },
    { width: 16, height: 16, label: '16" × 16"', acrylicPrice: 1799.0, canvasPrice: 699.0 },
    { width: 18, height: 18, label: '18" × 18"', acrylicPrice: 2299.0, canvasPrice: 899.0 },
    { width: 20, height: 20, label: '20" × 20"', acrylicPrice: 2799.0, canvasPrice: 1199.0 }
  ],
  // Rectangle: approx 5-6 useful options (Requirement 6)
  'shape-rectangle': [
    { width: 10, height: 8, label: '8" × 10"', acrylicPrice: 590.0, canvasPrice: 249.0 },
    { width: 12, height: 10, label: '10" × 12"', acrylicPrice: 790.0, canvasPrice: 349.0 },
    { width: 16, height: 12, label: '12" × 16"', acrylicPrice: 1150.0, canvasPrice: 449.0 },
    { width: 18, height: 12, label: '12" × 18"', acrylicPrice: 1250.0, canvasPrice: 499.0 },
    { width: 20, height: 16, label: '16" × 20"', acrylicPrice: 1590.0, canvasPrice: 649.0 },
    { width: 24, height: 18, label: '18" × 24"', acrylicPrice: 2190.0, canvasPrice: 899.0 }
  ],
  // Landscape: width > height, approx 5-6 useful options (Requirement 6, 9)
  'shape-landscape': [
    { width: 10, height: 8, label: '10" × 8"', acrylicPrice: 590.0, canvasPrice: 249.0 },
    { width: 12, height: 8, label: '12" × 8"', acrylicPrice: 650.0, canvasPrice: 299.0 },
    { width: 16, height: 10, label: '16" × 10"', acrylicPrice: 990.0, canvasPrice: 399.0 },
    { width: 18, height: 12, label: '18" × 12"', acrylicPrice: 1250.0, canvasPrice: 499.0 },
    { width: 20, height: 12, label: '20" × 12"', acrylicPrice: 1490.0, canvasPrice: 599.0 },
    { width: 24, height: 16, label: '24" × 16"', acrylicPrice: 2190.0, canvasPrice: 899.0 }
  ],
  // Portrait: height > width, approx 5-6 useful options (Requirement 6, 9)
  'shape-portrait': [
    { width: 8, height: 10, label: '8" × 10"', acrylicPrice: 590.0, canvasPrice: 249.0 },
    { width: 8, height: 12, label: '8" × 12"', acrylicPrice: 650.0, canvasPrice: 299.0 },
    { width: 10, height: 16, label: '10" × 16"', acrylicPrice: 990.0, canvasPrice: 399.0 },
    { width: 12, height: 18, label: '12" × 18"', acrylicPrice: 1250.0, canvasPrice: 499.0 },
    { width: 12, height: 20, label: '12" × 20"', acrylicPrice: 1490.0, canvasPrice: 599.0 },
    { width: 16, height: 24, label: '16" × 24"', acrylicPrice: 2190.0, canvasPrice: 899.0 }
  ],
  // Circle: 1:1 square-equivalent dimensions (Requirement 9: 8x8, 10x10, 12x12, 16x16, 20x20, 24x24)
  'shape-circle': [
    { width: 8, height: 8, label: '8" Dia (8" × 8")', acrylicPrice: 650.0, canvasPrice: 721.27 },
    { width: 10, height: 10, label: '10" Dia (10" × 10")', acrylicPrice: 899.0, canvasPrice: 899.0 },
    { width: 12, height: 12, label: '12" Dia (12" × 12")', acrylicPrice: 1099.0, canvasPrice: 1099.0 },
    { width: 16, height: 16, label: '16" Dia (16" × 16")', acrylicPrice: 1699.0, canvasPrice: 1599.0 },
    { width: 20, height: 20, label: '20" Dia (20" × 20")', acrylicPrice: 2499.0, canvasPrice: 2299.0 },
    { width: 24, height: 24, label: '24" Dia (24" × 24")', acrylicPrice: 3299.0, canvasPrice: 2999.0 }
  ],
  // Oval: proportional oval dimensions (Requirement 9)
  'shape-oval': [
    { width: 10, height: 8, label: '8" × 10"', acrylicPrice: 750.0, canvasPrice: 1380.67 },
    { width: 14, height: 10, label: '10" × 14"', acrylicPrice: 1190.0, canvasPrice: 1699.0 },
    { width: 16, height: 12, label: '12" × 16"', acrylicPrice: 1490.0, canvasPrice: 1999.0 },
    { width: 20, height: 16, label: '16" × 20"', acrylicPrice: 2190.0, canvasPrice: 2599.0 },
    { width: 24, height: 18, label: '18" × 24"', acrylicPrice: 2890.0, canvasPrice: 3299.0 }
  ],
  // Heart: proportional sizes (Requirement 9)
  'shape-heart': [
    { width: 8, height: 8, label: '8" × 8"', acrylicPrice: 699.0, canvasPrice: 1854.68 },
    { width: 10, height: 10, label: '10" × 10"', acrylicPrice: 999.0, canvasPrice: 2099.0 },
    { width: 12, height: 12, label: '12" × 12"', acrylicPrice: 1299.0, canvasPrice: 2299.0 },
    { width: 16, height: 16, label: '16" × 16"', acrylicPrice: 1899.0, canvasPrice: 2899.0 },
    { width: 20, height: 20, label: '20" × 20"', acrylicPrice: 2699.0, canvasPrice: 3599.0 },
    { width: 24, height: 24, label: '24" × 24"', acrylicPrice: 3499.0, canvasPrice: 4299.0 }
  ],
  // Triangle: proportional sizes (Requirement 9)
  'shape-triangle': [
    { width: 8, height: 8, label: '8" × 8"', acrylicPrice: 650.0, canvasPrice: 1250.79 },
    { width: 10, height: 10, label: '10" × 10"', acrylicPrice: 899.0, canvasPrice: 1450.0 },
    { width: 12, height: 12, label: '12" × 12"', acrylicPrice: 1199.0, canvasPrice: 1699.0 },
    { width: 16, height: 16, label: '16" × 16"', acrylicPrice: 1799.0, canvasPrice: 2299.0 },
    { width: 20, height: 20, label: '20" × 20"', acrylicPrice: 2499.0, canvasPrice: 2999.0 }
  ],
  // Hexagon: proportional sizes (Requirement 9)
  'shape-hexagon': [
    { width: 8, height: 8, label: '8" × 8"', acrylicPrice: 650.0, canvasPrice: 799.0 },
    { width: 10, height: 10, label: '10" × 10"', acrylicPrice: 899.0, canvasPrice: 999.0 },
    { width: 12, height: 12, label: '12" × 12"', acrylicPrice: 1199.0, canvasPrice: 1299.0 },
    { width: 16, height: 16, label: '16" × 16"', acrylicPrice: 1799.0, canvasPrice: 1899.0 },
    { width: 20, height: 20, label: '20" × 20"', acrylicPrice: 2499.0, canvasPrice: 2599.0 }
  ],
  // Rounded Rectangle: rectangular dimensions (Requirement 9)
  'shape-rounded-rect': [
    { width: 10, height: 8, label: '8" × 10"', acrylicPrice: 590.0, canvasPrice: 299.0 },
    { width: 12, height: 10, label: '10" × 12"', acrylicPrice: 790.0, canvasPrice: 399.0 },
    { width: 16, height: 12, label: '12" × 16"', acrylicPrice: 1150.0, canvasPrice: 499.0 },
    { width: 20, height: 16, label: '16" × 20"', acrylicPrice: 1590.0, canvasPrice: 699.0 },
    { width: 24, height: 18, label: '18" × 24"', acrylicPrice: 2190.0, canvasPrice: 999.0 }
  ],
  // Panoramic: 6 sizes (12"x18", 12"x24", 16"x24", 16"x32", 20"x30", 24"x36")
  'shape-panoramic': [
    { width: 18, height: 12, label: '12" × 18"', acrylicPrice: 1250.0, canvasPrice: 449.0 },
    { width: 24, height: 12, label: '12" × 24"', acrylicPrice: 1699.0, canvasPrice: 599.0 },
    { width: 24, height: 16, label: '16" × 24"', acrylicPrice: 2190.0, canvasPrice: 799.0 },
    { width: 32, height: 16, label: '16" × 32"', acrylicPrice: 2890.0, canvasPrice: 999.0 },
    { width: 30, height: 20, label: '20" × 30"', acrylicPrice: 3490.0, canvasPrice: 1199.0 },
    { width: 36, height: 24, label: '24" × 36"', acrylicPrice: 4990.0, canvasPrice: 1599.0 }
  ],
  // Bus Roll: portrait transit format
  'shape-bus-roll': [
    { width: 8, height: 24, label: '8" × 24"', acrylicPrice: 1256.40, canvasPrice: 499.0 },
    { width: 10, height: 30, label: '10" × 30"', acrylicPrice: 1590.0, canvasPrice: 699.0 },
    { width: 12, height: 36, label: '12" × 36"', acrylicPrice: 1990.0, canvasPrice: 899.0 },
    { width: 16, height: 48, label: '16" × 48"', acrylicPrice: 2790.0, canvasPrice: 1199.0 }
  ],
  // Banner: horizontal banner format
  'shape-banner': [
    { width: 24, height: 8, label: '24" × 8"', acrylicPrice: 990.0, canvasPrice: 399.0 },
    { width: 36, height: 10, label: '36" × 10"', acrylicPrice: 1490.0, canvasPrice: 599.0 },
    { width: 48, height: 12, label: '48" × 12"', acrylicPrice: 1990.0, canvasPrice: 799.0 }
  ]
};

// MULTI-PIECE PRESETS (Matches the exact layouts from the uploaded reference screenshot!)
export const WALL_DISPLAY_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number }> = [
  {
    id: 'wall-display-3a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-piece (1) 12"×18", (2) 10"×8"',
    dimensionsSummary: '3-piece (1) 12"×18", (2) 10"×8"',
    widthInches: 18,
    heightInches: 24,
    acrylicPrice: 2338.90, // Exactly as in reference screenshot!
    canvasPrice: 1899.00,
    aspectRatio: 18 / 24,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (1) 12"×18", (2) 10"×8"',
    arrangement: 'threeCollage',
    diagramType: 'wall-display-3a',
    panels: [
      { id: 'p0', label: 'Main Panel', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 },
      { id: 'p1', label: 'Bottom Left', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p2', label: 'Bottom Right', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-3b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-piece (2) 10"×8", (1) 16"×20"',
    dimensionsSummary: '3-piece (2) 10"×8", (1) 16"×20"',
    widthInches: 40,
    heightInches: 16,
    acrylicPrice: 2964.90, // Exactly as in reference screenshot!
    canvasPrice: 2499.00,
    aspectRatio: 40 / 16,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (2) 10"×8", (1) 16"×20"',
    arrangement: 'threeSplit',
    diagramType: 'wall-display-3b',
    panels: [
      { id: 'p0', label: 'Left Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p1', label: 'Center Large', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 },
      { id: 'p2', label: 'Right Wing', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-4a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-piece (1) 24"×16", (1) 11"×17", (2) 12"×8"',
    dimensionsSummary: '4-piece (1) 24"×16", (1) 11"×17", (2) 12"×8"',
    widthInches: 34,
    heightInches: 24,
    acrylicPrice: 4746.20, // Exactly as in reference screenshot!
    canvasPrice: 3899.00,
    aspectRatio: 34 / 24,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (1) 24"×16", (1) 11"×17", (2) 12"×8"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4a',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '24" × 16"', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Right Top', dimension: '11" × 17"', widthRatio: 17, heightRatio: 11 },
      { id: 'p2', label: 'Bottom Mid', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 },
      { id: 'p3', label: 'Bottom Far', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-tiered',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-piece Tiered Staircase (10"×8", 14"×11", 20"×16", 10"×8")',
    dimensionsSummary: '4-piece (10"×8", 14"×11", 20"×16", 10"×8")',
    widthInches: 36,
    heightInches: 20,
    acrylicPrice: 3890.00,
    canvasPrice: 3299.00,
    aspectRatio: 36 / 20,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (10"×8", 14"×11", 20"×16", 10"×8")',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-tiered',
    panels: [
      { id: 'p0', label: 'Step 1', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p1', label: 'Step 2', dimension: '14" × 11"', widthRatio: 11, heightRatio: 14 },
      { id: 'p2', label: 'Step 3', dimension: '20" × 16"', widthRatio: 16, heightRatio: 20 },
      { id: 'p3', label: 'Step 4', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-triptych',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-piece Balanced Triptych (3) 12" × 24"',
    dimensionsSummary: '3-piece (3) 12" × 24"',
    widthInches: 36,
    heightInches: 24,
    acrylicPrice: 3250.00,
    canvasPrice: 2699.00,
    aspectRatio: 36 / 24,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 12" × 24"',
    arrangement: 'threeSplit',
    diagramType: 'wall-display-triptych',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p1', label: 'Panel 2', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p2', label: 'Panel 3', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
    ]
  },
  {
    id: 'wall-display-5piece',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-piece Gallery (1) 18"×24", (2) 12"×18", (2) 8"×10"',
    dimensionsSummary: '5-piece (1) 18"×24", (2) 12"×18", (2) 8"×10"',
    widthInches: 50,
    heightInches: 24,
    acrylicPrice: 5490.00,
    canvasPrice: 4599.00,
    aspectRatio: 50 / 24,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (1) 18"×24", (2) 12"×18", (2) 8"×10"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-5piece',
    panels: [
      { id: 'p0', label: 'Center', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 },
      { id: 'p1', label: 'Left Mid', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 },
      { id: 'p2', label: 'Right Mid', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 },
      { id: 'p3', label: 'Far Left', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 },
      { id: 'p4', label: 'Far Right', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }
    ]
  }
];

// SPLIT PRESETS
export const SPLIT_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number }> = [
  {
    id: 'split-2panel-12x18',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '2-piece Diptych (2) 12" × 18"',
    dimensionsSummary: '2-piece (2) 12" × 18" (Total 24" × 18")',
    widthInches: 24,
    heightInches: 18,
    acrylicPrice: 674.50, // Matches starting price
    canvasPrice: 1199.00,
    aspectRatio: 24 / 18,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-piece (2) 12" × 18"',
    arrangement: 'twoSplit',
    diagramType: 'split-2',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 },
      { id: 'p1', label: 'Right Panel', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }
    ]
  },
  {
    id: 'split-3panel-12x24',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece Triptych (3) 12" × 24"',
    dimensionsSummary: '3-piece (3) 12" × 24" (Total 36" × 24")',
    widthInches: 36,
    heightInches: 24,
    acrylicPrice: 1890.00,
    canvasPrice: 2199.00,
    aspectRatio: 36 / 24,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 12" × 24"',
    arrangement: 'threeSplit',
    diagramType: 'split-3',
    panels: [
      { id: 'p0', label: 'Left', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p1', label: 'Center', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 },
      { id: 'p2', label: 'Right', dimension: '12" × 24"', widthRatio: 12, heightRatio: 24 }
    ]
  },
  {
    id: 'split-3panel-16x32',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece Triptych (3) 16" × 32"',
    dimensionsSummary: '3-piece (3) 16" × 32" (Total 48" × 32")',
    widthInches: 48,
    heightInches: 32,
    acrylicPrice: 2790.00,
    canvasPrice: 3199.00,
    aspectRatio: 48 / 32,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 16" × 32"',
    arrangement: 'threeSplit',
    diagramType: 'split-3',
    panels: [
      { id: 'p0', label: 'Left', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 },
      { id: 'p1', label: 'Center', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 },
      { id: 'p2', label: 'Right', dimension: '16" × 32"', widthRatio: 16, heightRatio: 32 }
    ]
  },
  {
    id: 'split-4panel-10x20',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece Quad Split (4) 10" × 20"',
    dimensionsSummary: '4-piece (4) 10" × 20" (Total 40" × 20")',
    widthInches: 40,
    heightInches: 20,
    acrylicPrice: 2450.00,
    canvasPrice: 2899.00,
    aspectRatio: 40 / 20,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (4) 10" × 20"',
    arrangement: 'fourGrid',
    diagramType: 'split-4',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '10" × 20"', widthRatio: 10, heightRatio: 20 },
      { id: 'p1', label: 'Panel 2', dimension: '10" × 20"', widthRatio: 10, heightRatio: 20 },
      { id: 'p2', label: 'Panel 3', dimension: '10" × 20"', widthRatio: 10, heightRatio: 20 },
      { id: 'p3', label: 'Panel 4', dimension: '10" × 20"', widthRatio: 10, heightRatio: 20 }
    ]
  }
];

// COLLAGE PRESETS
export const COLLAGE_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number }> = [
  {
    id: 'collage-2photo-12x18',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '2 Photos: 12" × 18"',
    dimensionsSummary: '12" × 18" (2 Photo Slots)',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 426.00,
    canvasPrice: 599.00,
    aspectRatio: 18 / 12,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-Photo Split Frame',
    arrangement: 'twoSplit',
    diagramType: 'collage-2',
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '9" × 12"', widthRatio: 9, heightRatio: 12 },
      { id: 'p1', label: 'Slot 2', dimension: '9" × 12"', widthRatio: 9, heightRatio: 12 }
    ]
  },
  {
    id: 'collage-3photo-16x20',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '3 Photos: 16" × 20"',
    dimensionsSummary: '16" × 20" (3 Photo Slots)',
    widthInches: 16,
    heightInches: 20,
    acrylicPrice: 799.00,
    canvasPrice: 899.00,
    aspectRatio: 16 / 20,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-Photo Collage Frame',
    arrangement: 'threeCollage',
    diagramType: 'collage-3',
    panels: [
      { id: 'p0', label: 'Top Main Photo', dimension: '16" × 12"', widthRatio: 16, heightRatio: 12 },
      { id: 'p1', label: 'Bottom Left Photo', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p2', label: 'Bottom Right Photo', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'collage-4photo-10x10',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Photos (2×2): 10" × 10"',
    dimensionsSummary: '10" × 10" (4 Photo Grid)',
    widthInches: 10,
    heightInches: 10,
    acrylicPrice: 699.00,
    canvasPrice: 799.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-Photo Square Grid',
    arrangement: 'fourGrid',
    diagramType: 'collage-4',
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '5" × 5"', widthRatio: 5, heightRatio: 5 },
      { id: 'p1', label: 'Slot 2', dimension: '5" × 5"', widthRatio: 5, heightRatio: 5 },
      { id: 'p2', label: 'Slot 3', dimension: '5" × 5"', widthRatio: 5, heightRatio: 5 },
      { id: 'p3', label: 'Slot 4', dimension: '5" × 5"', widthRatio: 5, heightRatio: 5 }
    ]
  },
  {
    id: 'collage-4photo-16x16',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Photos (2×2): 16" × 16"',
    dimensionsSummary: '16" × 16" (4 Photo Grid)',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 999.00,
    canvasPrice: 1199.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-Photo Square Grid',
    arrangement: 'fourGrid',
    diagramType: 'collage-4',
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p1', label: 'Slot 2', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p2', label: 'Slot 3', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p3', label: 'Slot 4', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'collage-4photo-18x18',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Photos (2×2): 18" × 18"',
    dimensionsSummary: '18" × 18" (4 Photo Grid)',
    widthInches: 18,
    heightInches: 18,
    acrylicPrice: 1199.00,
    canvasPrice: 1399.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-Photo Square Grid',
    arrangement: 'fourGrid',
    diagramType: 'collage-4',
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '9" × 9"', widthRatio: 9, heightRatio: 9 },
      { id: 'p1', label: 'Slot 2', dimension: '9" × 9"', widthRatio: 9, heightRatio: 9 },
      { id: 'p2', label: 'Slot 3', dimension: '9" × 9"', widthRatio: 9, heightRatio: 9 },
      { id: 'p3', label: 'Slot 4', dimension: '9" × 9"', widthRatio: 9, heightRatio: 9 }
    ]
  },
  {
    id: 'collage-4photo-20x20',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Photos (2×2): 20" × 20"',
    dimensionsSummary: '20" × 20" (4 Photo Grid)',
    widthInches: 20,
    heightInches: 20,
    acrylicPrice: 1399.00,
    canvasPrice: 1599.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-Photo Square Grid',
    arrangement: 'fourGrid',
    diagramType: 'collage-4',
    panels: [
      { id: 'p0', label: 'Slot 1', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Slot 2', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 },
      { id: 'p2', label: 'Slot 3', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 },
      { id: 'p3', label: 'Slot 4', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }
    ]
  },
  {
    id: 'collage-9photo-18x18',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '9 Photos (3×3): 18" × 18"',
    dimensionsSummary: '18" × 18" (9 Photo Grid)',
    widthInches: 18,
    heightInches: 18,
    acrylicPrice: 1599.00,
    canvasPrice: 1799.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: '9-Photo Square Grid',
    arrangement: 'nineGrid',
    diagramType: 'collage-9',
    panels: Array.from({ length: 9 }, (_, i) => ({
      id: `p${i}`,
      label: `Slot ${i + 1}`,
      dimension: '6" × 6"',
      widthRatio: 6,
      heightRatio: 6
    }))
  },
  {
    id: 'collage-9photo-20x20',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '9 Photos (3×3): 20" × 20"',
    dimensionsSummary: '20" × 20" (9 Photo Grid)',
    widthInches: 20,
    heightInches: 20,
    acrylicPrice: 1799.00,
    canvasPrice: 1999.00,
    aspectRatio: 1,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: '9-Photo Square Grid',
    arrangement: 'nineGrid',
    diagramType: 'collage-9',
    panels: Array.from({ length: 9 }, (_, i) => ({
      id: `p${i}`,
      label: `Slot ${i + 1}`,
      dimension: '6.5" × 6.5"',
      widthRatio: 6.5,
      heightRatio: 6.5
    }))
  }
];

// MOSAIC PRESETS
export const MOSAIC_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number; cols?: number; rows?: number; priceRange?: string }> = [
  {
    id: 'mosaic2-4x4',
    shapeId: 'shape-square',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic2-4x4 (16 Tiles)',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 198.50,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹9,225.00',
    aspectRatio: 1,
    category: 'SQUARE',
    panelsCount: 16,
    pieceBreakdown: '16-Tile Mosaic Grid (4×4)',
    arrangement: 'mosaic2-4x4',
    diagramType: 'mosaic-4x4',
    cols: 4,
    rows: 4,
    panels: Array.from({ length: 16 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic4-5x5',
    shapeId: 'shape-square',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic4-5x5 (25 Tiles)',
    dimensionsSummary: '20" × 20"',
    widthInches: 20,
    heightInches: 20,
    acrylicPrice: 198.50,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹9,225.00',
    aspectRatio: 1,
    category: 'SQUARE',
    panelsCount: 25,
    pieceBreakdown: '25-Tile Mosaic Grid (5×5)',
    arrangement: 'mosaic4-5x5',
    diagramType: 'mosaic-5x5',
    cols: 5,
    rows: 5,
    panels: Array.from({ length: 25 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic6-6x6',
    shapeId: 'shape-square',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic6-6x6 (36 Tiles)',
    dimensionsSummary: '24" × 24"',
    widthInches: 24,
    heightInches: 24,
    acrylicPrice: 198.50,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹9,225.00',
    aspectRatio: 1,
    category: 'SQUARE',
    panelsCount: 36,
    pieceBreakdown: '36-Tile Mosaic Grid (6×6)',
    arrangement: 'mosaic6-6x6',
    diagramType: 'mosaic-6x6',
    cols: 6,
    rows: 6,
    panels: Array.from({ length: 36 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic3-3x4',
    shapeId: 'shape-rectangle',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic3-3x4 (12 Tiles)',
    dimensionsSummary: '16" × 12"',
    widthInches: 16,
    heightInches: 12,
    acrylicPrice: 505.00,
    canvasPrice: 405.00,
    priceRange: '₹405.00 - ₹5,517.00',
    aspectRatio: 16 / 12,
    category: 'RECTANGLE',
    panelsCount: 12,
    pieceBreakdown: '12-Tile Mosaic Grid (4 cols × 3 rows)',
    arrangement: 'mosaic3-3x4',
    diagramType: 'mosaic-3x4',
    cols: 4,
    rows: 3,
    panels: Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic5-4x5',
    shapeId: 'shape-rectangle',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic5-4x5 (20 Tiles)',
    dimensionsSummary: '16" × 20"',
    widthInches: 16,
    heightInches: 20,
    acrylicPrice: 795.00,
    canvasPrice: 645.00,
    priceRange: '₹645.00 - ₹5,176.50',
    aspectRatio: 16 / 20,
    category: 'RECTANGLE',
    panelsCount: 20,
    pieceBreakdown: '20-Tile Mosaic Grid (4 cols × 5 rows)',
    arrangement: 'mosaic5-4x5',
    diagramType: 'mosaic-4x5',
    cols: 4,
    rows: 5,
    panels: Array.from({ length: 20 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic1-3x4',
    shapeId: 'shape-rectangle',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic1-3x4 (12 Tiles)',
    dimensionsSummary: '12" × 16"',
    widthInches: 12,
    heightInches: 16,
    acrylicPrice: 845.00,
    canvasPrice: 685.50,
    priceRange: '₹685.50 - ₹5,517.00',
    aspectRatio: 12 / 16,
    category: 'RECTANGLE',
    panelsCount: 12,
    pieceBreakdown: '12-Tile Mosaic Grid (3 cols × 4 rows)',
    arrangement: 'mosaic1-3x4',
    diagramType: 'mosaic-1-3x4',
    cols: 3,
    rows: 4,
    panels: Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  },
  {
    id: 'mosaic7-5x3',
    shapeId: 'shape-rectangle',
    shapeName: 'Photo Mosaic',
    label: 'Mosaic7-5x3 (15 Tiles)',
    dimensionsSummary: '12" × 20"',
    widthInches: 12,
    heightInches: 20,
    acrylicPrice: 999.00,
    canvasPrice: 813.00,
    priceRange: '₹813.00 - ₹3,105.00',
    aspectRatio: 12 / 20,
    category: 'RECTANGLE',
    panelsCount: 15,
    pieceBreakdown: '15-Tile Mosaic Grid (3 cols × 5 rows)',
    arrangement: 'mosaic7-5x3',
    diagramType: 'mosaic-5x3',
    cols: 3,
    rows: 5,
    panels: Array.from({ length: 15 }, (_, i) => ({
      id: `p${i}`,
      label: `Tile ${i + 1}`,
      dimension: '4" × 4"',
      widthRatio: 4,
      heightRatio: 4
    }))
  }
];

// HEXAGON BUNDLE PRESETS — multi-piece hexagon clusters (1/2/3/4 hexagons
// hung together), matching the canvaschamp.in "Hexagonal Prints" size
// picker: each card shows a live diagram of the hexagon(s) with dimension
// lines, so picking a count visually previews the real arrangement.
export const HEXAGON_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number }> = [
  {
    id: 'hexagon-1p-10x11',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Single Hexagonal Print',
    dimensionsSummary: '10" × 11.5"',
    widthInches: 10,
    heightInches: 11.5,
    acrylicPrice: 650.0,
    canvasPrice: 799.0,
    aspectRatio: 10 / 11.5,
    category: 'SPECIAL',
    panelsCount: 1,
    pieceBreakdown: '1 Hexagon Panel',
    arrangement: 'single',
    diagramType: 'hexagon-1',
    panels: [{ id: 'p0', label: 'Hexagon', dimension: '10" × 11.5"', widthRatio: 10, heightRatio: 11.5 }]
  },
  {
    id: 'hexagon-2p-19x10',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Hexagonal Prints Bundle of 2',
    dimensionsSummary: '19" × 10" (2 Hexagons)',
    widthInches: 19,
    heightInches: 10,
    acrylicPrice: 1150.0,
    canvasPrice: 1399.0,
    aspectRatio: 19 / 10,
    category: 'SPECIAL',
    panelsCount: 2,
    pieceBreakdown: '2-Hexagon Cluster (10"×11.5" ea)',
    arrangement: 'twoHex',
    diagramType: 'hexagon-2',
    panels: Array.from({ length: 2 }, (_, i) => ({
      id: `p${i}`,
      label: `Hexagon ${i + 1}`,
      dimension: '10" × 11.5"',
      widthRatio: 10,
      heightRatio: 11.5
    }))
  },
  {
    id: 'hexagon-3p-27x13.75',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Hexagonal Prints Bundle of 3',
    dimensionsSummary: '27" × 13.75" (3 Hexagons)',
    widthInches: 27,
    heightInches: 13.75,
    acrylicPrice: 1650.0,
    canvasPrice: 1999.0,
    aspectRatio: 27 / 13.75,
    category: 'SPECIAL',
    panelsCount: 3,
    pieceBreakdown: '3-Hexagon Cluster (10"×11.5" ea)',
    arrangement: 'threeHex',
    diagramType: 'hexagon-3',
    panels: Array.from({ length: 3 }, (_, i) => ({
      id: `p${i}`,
      label: `Hexagon ${i + 1}`,
      dimension: '10" × 11.5"',
      widthRatio: 10,
      heightRatio: 11.5
    }))
  },
  {
    id: 'hexagon-4p-27x19',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Hexagonal Prints Bundle of 4',
    dimensionsSummary: '27" × 19" (4 Hexagons)',
    widthInches: 27,
    heightInches: 19,
    acrylicPrice: 2150.0,
    canvasPrice: 2599.0,
    aspectRatio: 27 / 19,
    category: 'SPECIAL',
    panelsCount: 4,
    pieceBreakdown: '4-Hexagon Cluster (10"×11.5" ea)',
    arrangement: 'fourHex',
    diagramType: 'hexagon-4',
    panels: Array.from({ length: 4 }, (_, i) => ({
      id: `p${i}`,
      label: `Hexagon ${i + 1}`,
      dimension: '10" × 11.5"',
      widthRatio: 10,
      heightRatio: 11.5
    }))
  }
];

/**
 * Returns the compatible shapes list for a given product
 */
export function getProductSupportedShapes(productId: string, material: 'canvas' | 'acrylic'): ShapeDefinition[] {
  const normId = productId.toLowerCase();

  // Multi-panel products
  if (normId.includes('wall') || normId.includes('display')) {
    return [{ id: 'shape-rectangle', label: 'Wall Display Sets', category: 'basic' }];
  }
  if (normId.includes('split')) {
    return [{ id: 'shape-landscape', label: 'Split Panels', category: 'basic' }];
  }
  if (normId.includes('collage')) {
    return [
      { id: 'shape-square', label: 'Square Collage', category: 'basic' },
      { id: 'shape-landscape', label: 'Landscape Collage', category: 'basic' },
      { id: 'shape-portrait', label: 'Portrait Collage', category: 'basic' }
    ];
  }

  // Dedicated single-shape products
  if (normId.includes('round') || normId === 'canvas-round') {
    return [{ id: 'shape-circle', label: 'Round / Circle', category: 'special' }];
  }
  if (normId.includes('triangle') || normId === 'canvas-triangle') {
    return [{ id: 'shape-triangle', label: 'Triangle', category: 'decorative' }];
  }
  if (normId.includes('heart') || normId === 'canvas-heart') {
    return [{ id: 'shape-heart', label: 'Heart', category: 'decorative' }];
  }
  if (normId.includes('oval') || normId === 'canvas-oval') {
    return [{ id: 'shape-oval', label: 'Oval', category: 'special' }];
  }
  if (normId.includes('hexagon') || normId === 'canvas-hexagon') {
    return [{ id: 'shape-hexagon', label: 'Hexagon', category: 'decorative' }];
  }
  if (normId.includes('bus') || normId.includes('roll')) {
    return [{ id: 'shape-portrait', label: 'Portrait', category: 'basic' }];
  }
  if (normId.includes('word')) {
    return [
      { id: 'shape-square', label: 'Square', category: 'basic' },
      { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' },
      { id: 'shape-circle', label: 'Round', category: 'special' },
      { id: 'shape-heart', label: 'Heart', category: 'decorative' }
    ];
  }
  if (normId.includes('pop')) {
    return [
      { id: 'shape-square', label: 'Square', category: 'basic' },
      { id: 'shape-portrait', label: 'Portrait', category: 'basic' },
      { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' }
    ];
  }
  if (normId.includes('lyric')) {
    return [
      { id: 'shape-portrait', label: 'Portrait', category: 'basic' },
      { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' },
      { id: 'shape-square', label: 'Square', category: 'basic' },
      { id: 'shape-heart', label: 'Heart', category: 'decorative' }
    ];
  }
  if (normId.includes('quote')) {
    return [
      { id: 'shape-square', label: 'Square', category: 'basic' },
      { id: 'shape-portrait', label: 'Portrait', category: 'basic' },
      { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' },
      { id: 'shape-heart', label: 'Heart', category: 'decorative' }
    ];
  }
  if (normId.includes('mosaic')) {
    return [
      { id: 'shape-square', label: 'Square', category: 'basic' },
      { id: 'shape-rectangle', label: 'Rectangle', category: 'basic' }
    ];
  }

  // General single prints (Single Print, Photo Panel, Classic Canvas, Digital Painting, etc.)
  if (normId.includes('panoramic')) {
    return [
      { id: 'shape-panoramic', label: 'Panoramic', category: 'special' },
      { id: 'shape-landscape', label: 'Landscape', category: 'basic' }
    ];
  }
  if (normId.includes('banner')) {
    return [
      { id: 'shape-banner', label: 'Banner', category: 'special' },
      { id: 'shape-panoramic', label: 'Panoramic', category: 'special' }
    ];
  }
  return ALL_SHAPE_DEFINITIONS;
}

/**
 * Returns all size & shape configuration options for a given product
 */
export function getProductSizeShapeOptions(productId: string, material: 'canvas' | 'acrylic'): SizeShapeOption[] {
  const normId = productId.toLowerCase();

  // 1. Wall Display
  if (normId.includes('wall') || normId.includes('display')) {
    return WALL_DISPLAY_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }

  // 2. Split Display
  if (normId.includes('split')) {
    return SPLIT_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }

  // 3. Collage
  if (normId.includes('collage')) {
    return COLLAGE_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }

  // 3b. Mosaic (7 exact configurations)
  if (normId.includes('mosaic')) {
    return MOSAIC_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }

  // 4. Standard Single-Panel Shape Configurations
  const supportedShapes = getProductSupportedShapes(productId, material);
  const options: SizeShapeOption[] = [];

  supportedShapes.forEach((shape) => {
    // Hexagon gets its own preset cluster (1/2/3/4-hexagon bundles with a
    // live diagram) instead of the generic flat single-size list.
    if (shape.id === 'shape-hexagon') {
      HEXAGON_PRESETS.forEach((p) => {
        options.push({ ...p, price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice });
      });
      return;
    }
    const rawSizes = STANDARD_SHAPE_SIZES[shape.id] || STANDARD_SHAPE_SIZES['shape-rectangle'];
    rawSizes.forEach((sz) => {
      const optionId = `${shape.id}-${sz.width}x${sz.height}`;
      const shapeCategory =
        shape.id === 'shape-square'
          ? 'SQUARE'
          : shape.id === 'shape-landscape'
          ? 'LANDSCAPE'
          : shape.id === 'shape-portrait' || shape.id === 'shape-bus-roll'
          ? 'PORTRAIT'
          : shape.id === 'shape-rectangle'
          ? 'RECTANGLE'
          : 'SPECIAL';

      options.push({
        id: optionId,
        shapeId: shape.id,
        shapeName: shape.label,
        label: sz.label,
        dimensionsSummary: sz.label,
        widthInches: sz.width,
        heightInches: sz.height,
        price: material === 'acrylic' ? sz.acrylicPrice : sz.canvasPrice,
        aspectRatio: sz.width / sz.height,
        category: shapeCategory,
        panelsCount: 1,
        diagramType: 'single-shape'
      });
    });
  });

  return options;
}

/**
 * Strict shape-aware sizing pipeline:
 * PRODUCT -> SUPPORTED SHAPES -> SELECTED SHAPE -> SUPPORTED SIZES -> SELECTED SIZE -> WORKSPACE
 * Returns the exact sizes corresponding to the chosen product and active shape.
 */
export function getSizesForProductAndShape(
  productId: string,
  shapeId: string,
  material: 'canvas' | 'acrylic'
): SizeShapeOption[] {
  const normId = productId.toLowerCase();

  // Multi-panel products
  if (normId.includes('wall') || normId.includes('display')) {
    return WALL_DISPLAY_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }
  if (normId.includes('split')) {
    return SPLIT_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }
  if (normId.includes('collage')) {
    const collages = COLLAGE_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
    const matching = collages.filter((c) => c.shapeId === shapeId);
    return matching.length > 0 ? matching : collages;
  }
  if (normId.includes('mosaic')) {
    const mosaics = MOSAIC_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
    const matching = mosaics.filter((c) => c.shapeId === shapeId);
    return matching.length > 0 ? matching : mosaics;
  }
  if (normId.includes('hexagon') || shapeId === 'shape-hexagon') {
    return HEXAGON_PRESETS.map((p) => ({
      ...p,
      price: material === 'acrylic' ? p.acrylicPrice : p.canvasPrice
    }));
  }

  // Single panel products: return sizes for the active shape
  const targetShapeId =
    STANDARD_SHAPE_SIZES[shapeId] ? shapeId :
    (normId.includes('bus') ? 'shape-bus-roll' :
     normId.includes('banner') ? 'shape-banner' :
     normId.includes('panoramic') ? 'shape-panoramic' :
     'shape-rectangle');

  const rawSizes = STANDARD_SHAPE_SIZES[targetShapeId] || STANDARD_SHAPE_SIZES['shape-rectangle'] || STANDARD_SHAPE_SIZES['shape-square'];
  const shapeDef = ALL_SHAPE_DEFINITIONS.find((s) => s.id === targetShapeId) || { label: 'Custom' };

  return rawSizes.map((sz) => {
    const shapeCategory =
      targetShapeId === 'shape-square'
        ? 'SQUARE'
        : targetShapeId === 'shape-landscape'
        ? 'LANDSCAPE'
        : targetShapeId === 'shape-portrait' || targetShapeId === 'shape-bus-roll'
        ? 'PORTRAIT'
        : targetShapeId === 'shape-rectangle'
        ? 'RECTANGLE'
        : 'SPECIAL';

    return {
      id: `${targetShapeId}-${sz.width}x${sz.height}`,
      shapeId: targetShapeId,
      shapeName: shapeDef.label,
      label: sz.label,
      dimensionsSummary: sz.label,
      widthInches: sz.width,
      heightInches: sz.height,
      price: material === 'acrylic' ? sz.acrylicPrice : sz.canvasPrice,
      aspectRatio: sz.width / sz.height,
      category: shapeCategory,
      panelsCount: 1,
      diagramType: 'single-shape' as const
    };
  });
}
