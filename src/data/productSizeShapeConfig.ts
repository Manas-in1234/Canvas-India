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
    id: 'split-2p-20x20',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '2-piece (2) 20x20 CM (8"x8")',
    dimensionsSummary: '2-piece (2) 20x20 CM (8"x8")',
    widthInches: 16,
    heightInches: 8,
    acrylicPrice: 169.00,
    canvasPrice: 188.10,
    aspectRatio: 2.0000,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-piece (2) 20x20 CM (8"x8")',
    arrangement: 'twoSplit',
    diagramType: 'split-2p-20x20',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '20x20 CM (8"x8")', widthRatio: 8, heightRatio: 8 },
      { id: 'p1', label: 'Right Panel', dimension: '20x20 CM (8"x8")', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'split-2p-45x25',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '2-piece (2) 45x25 CM (18"x10")',
    dimensionsSummary: '2-piece (2) 45x25 CM (18"x10")',
    widthInches: 20,
    heightInches: 18,
    acrylicPrice: 740.00,
    canvasPrice: 824.60,
    aspectRatio: 1.1111,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-piece (2) 45x25 CM (18"x10")',
    arrangement: 'twoSplit',
    diagramType: 'split-2p-45x25',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '25x45 CM (10"x18")', widthRatio: 10, heightRatio: 18 },
      { id: 'p1', label: 'Right Panel', dimension: '25x45 CM (10"x18")', widthRatio: 10, heightRatio: 18 }
    ]
  },
  {
    id: 'split-2p-40x40-stacked',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '2-piece (2) 40x40 CM (16"x16")',
    dimensionsSummary: '2-piece (2) 40x40 CM (16"x16")',
    widthInches: 16,
    heightInches: 32,
    acrylicPrice: 985.00,
    canvasPrice: 1096.30,
    aspectRatio: 0.5000,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-piece (2) 40x40 CM (16"x16")',
    arrangement: 'twoStacked',
    diagramType: 'split-2p-40x40-stacked',
    panels: [
      { id: 'p0', label: 'Top Panel', dimension: '40x40 CM (16"x16")', widthRatio: 16, heightRatio: 16 },
      { id: 'p1', label: 'Bottom Panel', dimension: '40x40 CM (16"x16")', widthRatio: 16, heightRatio: 16 }
    ]
  },
  {
    id: 'split-4p-30x30-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (4) 30x30 CM (12"x12")',
    dimensionsSummary: '4-piece (4) 30x30 CM (12"x12")',
    widthInches: 24,
    heightInches: 24,
    acrylicPrice: 1195.00,
    canvasPrice: 1330.00,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (4) 30x30 CM (12"x12")',
    arrangement: 'fourGrid',
    diagramType: 'split-4p-30x30-grid',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Top Right', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Bottom Left', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p3', label: 'Bottom Right', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-2p-40x50',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '2-piece (2) 40x50 CM (16"x20")',
    dimensionsSummary: '2-piece (2) 40x50 CM (16"x20")',
    widthInches: 40,
    heightInches: 16,
    acrylicPrice: 1220.00,
    canvasPrice: 1357.00,
    aspectRatio: 2.5000,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2-piece (2) 40x50 CM (16"x20")',
    arrangement: 'twoSplit',
    diagramType: 'split-2p-40x50',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '50x40 CM (20"x16")', widthRatio: 20, heightRatio: 16 },
      { id: 'p1', label: 'Right Panel', dimension: '50x40 CM (20"x16")', widthRatio: 20, heightRatio: 16 }
    ]
  },
  {
    id: 'split-3p-45x30',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 45x30 CM (18"x12")',
    dimensionsSummary: '3-piece (3) 45x30 CM (18"x12")',
    widthInches: 36,
    heightInches: 18,
    acrylicPrice: 1345.00,
    canvasPrice: 1495.20,
    aspectRatio: 2.0000,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 45x30 CM (18"x12")',
    arrangement: 'threeSplit',
    diagramType: 'split-3p-45x30',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p1', label: 'Center Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p2', label: 'Right Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 }
    ]
  },
  {
    id: 'split-3p-62x45-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (1) 62x45 CM (25"x18"), (2) 30x30 CM (12"x12")',
    dimensionsSummary: '3-piece (1) 62x45 CM, (2) 30x30 CM',
    widthInches: 37,
    heightInches: 18,
    acrylicPrice: 1470.00,
    canvasPrice: 1637.00,
    aspectRatio: 2.0444,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (1) 62x45 CM (25"x18"), (2) 30x30 CM (12"x12")',
    arrangement: 'tSplitRight',
    diagramType: 'split-3p-62x45-combo',
    panels: [
      { id: 'p0', label: 'Left Large', dimension: '62x45 CM (25"x18")', widthRatio: 25, heightRatio: 18 },
      { id: 'p1', label: 'Right Top', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Right Bottom', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-5p-stepped-chevron',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (2) 35x20 CM (14"x8"), (2) 45x20 CM (18"x8"), (1) 55x20 CM (22"x8")',
    dimensionsSummary: '5-piece (2) 35x20 CM, (2) 45x20 CM, (1) 55x20 CM',
    widthInches: 40,
    heightInches: 22,
    acrylicPrice: 1525.00,
    canvasPrice: 1699.00,
    aspectRatio: 1.8182,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (2) 35x20 CM (14"x8"), (2) 45x20 CM (18"x8"), (1) 55x20 CM (22"x8")',
    arrangement: 'steppedChevron',
    diagramType: 'split-5p-stepped-chevron',
    panels: [
      { id: 'p0', label: 'Outer Left', dimension: '20x35 CM (8"x14")', widthRatio: 8, heightRatio: 14 },
      { id: 'p1', label: 'Inner Left', dimension: '20x45 CM (8"x18")', widthRatio: 8, heightRatio: 18 },
      { id: 'p2', label: 'Center Tall', dimension: '20x55 CM (8"x22")', widthRatio: 8, heightRatio: 22 },
      { id: 'p3', label: 'Inner Right', dimension: '20x45 CM (8"x18")', widthRatio: 8, heightRatio: 18 },
      { id: 'p4', label: 'Outer Right', dimension: '20x35 CM (8"x14")', widthRatio: 8, heightRatio: 14 }
    ]
  },
  {
    id: 'split-4p-62x40-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (1) 62x40 CM (25"x16"), (1) 27x45 CM (11"x18"), (2) 30x20 CM (12"x8")',
    dimensionsSummary: '4-piece (1) 62x40, (1) 27x45, (2) 30x20 CM',
    widthInches: 36,
    heightInches: 18,
    acrylicPrice: 1575.00,
    canvasPrice: 1751.80,
    aspectRatio: 1.9778,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (1) 62x40 CM (25"x16"), (1) 27x45 CM (11"x18"), (2) 30x20 CM (12"x8")',
    arrangement: 'tSplitCombo',
    diagramType: 'split-4p-62x40-combo',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '27x45 CM (11"x18")', widthRatio: 11, heightRatio: 18 },
      { id: 'p1', label: 'Right Top', dimension: '62x40 CM (25"x16")', widthRatio: 25, heightRatio: 16 },
      { id: 'p2', label: 'Right Bot-Left', dimension: '30x20 CM (12"x8")', widthRatio: 12, heightRatio: 8 },
      { id: 'p3', label: 'Right Bot-Right', dimension: '30x20 CM (12"x8")', widthRatio: 12, heightRatio: 8 }
    ]
  },
  {
    id: 'split-3p-65x65-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (1) 65x65 CM (26"x26"), (2) 30x30 CM (12"x12")',
    dimensionsSummary: '3-piece (1) 65x65 CM, (2) 30x30 CM',
    widthInches: 38,
    heightInches: 26,
    acrylicPrice: 1850.00,
    canvasPrice: 2061.50,
    aspectRatio: 1.4615,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (1) 65x65 CM (26"x26"), (2) 30x30 CM (12"x12")',
    arrangement: 'tSplitRight',
    diagramType: 'split-3p-65x65-combo',
    panels: [
      { id: 'p0', label: 'Left Square', dimension: '65x65 CM (26"x26")', widthRatio: 26, heightRatio: 26 },
      { id: 'p1', label: 'Right Top', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Right Bottom', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-9p-22x22-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '9-piece (9) 22x22 CM (10"x10")',
    dimensionsSummary: '9-piece (9) 22x22 CM (10"x10")',
    widthInches: 30,
    heightInches: 30,
    acrylicPrice: 2490.00,
    canvasPrice: 2778.75,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: '9-piece (9) 22x22 CM (10"x10")',
    arrangement: 'nineGrid',
    diagramType: 'split-9p-22x22-grid',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Panel 2', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p2', label: 'Panel 3', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p3', label: 'Panel 4', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p4', label: 'Panel 5', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p5', label: 'Panel 6', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p6', label: 'Panel 7', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p7', label: 'Panel 8', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p8', label: 'Panel 9', dimension: '22x22 CM (10"x10")', widthRatio: 10, heightRatio: 10 }
    ]
  },
  {
    id: 'split-5p-flanked-landscape',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (4) 27x27 CM (12"x12"), (1) 62x42 CM (25"x18")',
    dimensionsSummary: '5-piece (4) 27x27 CM, (1) 62x42 CM',
    widthInches: 46,
    heightInches: 21,
    acrylicPrice: 2045.00,
    canvasPrice: 2272.40,
    aspectRatio: 2.1481,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (4) 27x27 CM (12"x12"), (1) 62x42 CM (25"x18")',
    arrangement: 'flankedCenter',
    diagramType: 'split-5p-flanked-landscape',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Left Bottom', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Center Large', dimension: '62x42 CM (25"x18")', widthRatio: 25, heightRatio: 18 },
      { id: 'p3', label: 'Right Top', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Right Bottom', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-4p-85x50-stacked-right',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (1) 85x50 CM (34"x20"), (3) 25x32 CM (10"x13")',
    dimensionsSummary: '4-piece (1) 85x50 CM, (3) 25x32 CM',
    widthInches: 30,
    heightInches: 34,
    acrylicPrice: 2150.00,
    canvasPrice: 2390.00,
    aspectRatio: 0.8824,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (1) 85x50 CM (34"x20"), (3) 25x32 CM (10"x13")',
    arrangement: 'tSplitRight3',
    diagramType: 'split-4p-85x50-stacked-right',
    panels: [
      { id: 'p0', label: 'Left Large', dimension: '50x85 CM (20"x34")', widthRatio: 20, heightRatio: 34 },
      { id: 'p1', label: 'Right Top', dimension: '25x28 CM (10"x11")', widthRatio: 10, heightRatio: 11 },
      { id: 'p2', label: 'Right Mid', dimension: '25x28 CM (10"x11")', widthRatio: 10, heightRatio: 11 },
      { id: 'p3', label: 'Right Bot', dimension: '25x28 CM (10"x11")', widthRatio: 10, heightRatio: 11 }
    ]
  },
  {
    id: 'split-5p-flanked-square',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (4) 27x27 CM (12"x12"), (1) 60x60 CM (24"x24")',
    dimensionsSummary: '5-piece (4) 27x27 CM, (1) 60x60 CM',
    widthInches: 45,
    heightInches: 24,
    acrylicPrice: 2200.00,
    canvasPrice: 2450.00,
    aspectRatio: 1.9000,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (4) 27x27 CM (12"x12"), (1) 60x60 CM (24"x24")',
    arrangement: 'flankedCenter',
    diagramType: 'split-5p-flanked-square',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Left Bottom', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Center Square', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 },
      { id: 'p3', label: 'Right Top', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Right Bottom', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-6p-checker-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '6-piece (3) 30x30 CM (12"x12"), (3) 45x30 CM (18"x12")',
    dimensionsSummary: '6-piece (3) 30x30 CM, (3) 45x30 CM',
    widthInches: 36,
    heightInches: 30,
    acrylicPrice: 2295.00,
    canvasPrice: 2550.00,
    aspectRatio: 1.2000,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '6-piece (3) 30x30 CM (12"x12"), (3) 45x30 CM (18"x12")',
    arrangement: 'checkerColumns',
    diagramType: 'split-6p-checker-combo',
    panels: [
      { id: 'p0', label: 'Col 1 Top', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Col 1 Bot', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p2', label: 'Col 2 Top', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p3', label: 'Col 2 Bot', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Col 3 Top', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p5', label: 'Col 3 Bot', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 }
    ]
  },
  {
    id: 'split-3p-80x27-tall',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 80x27 CM (32"x11")',
    dimensionsSummary: '3-piece (3) 80x27 CM (32"x11")',
    widthInches: 32,
    heightInches: 32,
    acrylicPrice: 2330.00,
    canvasPrice: 2590.00,
    aspectRatio: 1.0125,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 80x27 CM (32"x11")',
    arrangement: 'threeSplit',
    diagramType: 'split-3p-80x27-tall',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '27x80 CM (11"x32")', widthRatio: 11, heightRatio: 32 },
      { id: 'p1', label: 'Center Panel', dimension: '27x80 CM (11"x32")', widthRatio: 11, heightRatio: 32 },
      { id: 'p2', label: 'Right Panel', dimension: '27x80 CM (11"x32")', widthRatio: 11, heightRatio: 32 }
    ]
  },
  {
    id: 'split-3p-50x50-vertical',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 50x50 CM (20"x20") (vertical stack)',
    dimensionsSummary: '3-piece (3) 50x50 CM (Vertical Stack)',
    widthInches: 20,
    heightInches: 60,
    acrylicPrice: 2950.00,
    canvasPrice: 3278.91,
    aspectRatio: 0.3333,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 50x50 CM (20"x20") (vertical stack)',
    arrangement: 'verticalStack',
    diagramType: 'split-3p-50x50-vertical',
    panels: [
      { id: 'p0', label: 'Top Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p1', label: 'Middle Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p2', label: 'Bottom Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 }
    ]
  },
  {
    id: 'split-3p-50x50-horizontal',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 50x50 CM (20"x20") (horizontal row)',
    dimensionsSummary: '3-piece (3) 50x50 CM (Horizontal Row)',
    widthInches: 60,
    heightInches: 20,
    acrylicPrice: 2950.00,
    canvasPrice: 3278.91,
    aspectRatio: 3.0000,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 50x50 CM (20"x20") (horizontal row)',
    arrangement: 'threeSplit',
    diagramType: 'split-3p-50x50-horizontal',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p1', label: 'Center Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p2', label: 'Right Panel', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 }
    ]
  },
  {
    id: 'split-3p-center-tall',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (2) 57x37 CM (24"x16"), (1) 72x37 CM (30"x16")',
    dimensionsSummary: '3-piece (2) 57x37 CM, (1) 72x37 CM',
    widthInches: 44,
    heightInches: 28,
    acrylicPrice: 2355.00,
    canvasPrice: 2619.15,
    aspectRatio: 1.5417,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (2) 57x37 CM (24"x16"), (1) 72x37 CM (30"x16")',
    arrangement: 'triptychCenterTall',
    diagramType: 'split-3p-center-tall',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Center Tall', dimension: '37x72 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p2', label: 'Right Panel', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 }
    ]
  },
  {
    id: 'split-5p-30-45-60-stepped',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (2) 30x30 CM (12"x12"), (2) 45x30 CM (18"x12"), (1) 60x60 CM (24"x24")',
    dimensionsSummary: '5-piece (2) 30x30, (2) 45x30, (1) 60x60 CM',
    widthInches: 72,
    heightInches: 24,
    acrylicPrice: 3265.00,
    canvasPrice: 3632.13,
    aspectRatio: 3.0000,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (2) 30x30 CM (12"x12"), (2) 45x30 CM (18"x12"), (1) 60x60 CM (24"x24")',
    arrangement: 'steppedPyramid',
    diagramType: 'split-5p-30-45-60-stepped',
    panels: [
      { id: 'p0', label: 'Outer Left', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Inner Left', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p2', label: 'Center Square', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 },
      { id: 'p3', label: 'Inner Right', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p4', label: 'Outer Right', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-3p-37x75-horizontal',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 37x75 CM (15"x30")',
    dimensionsSummary: '3-piece (3) 37x75 CM (15"x30")',
    widthInches: 90,
    heightInches: 15,
    acrylicPrice: 2599.00,
    canvasPrice: 2890.00,
    aspectRatio: 6.0811,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 37x75 CM (15"x30")',
    arrangement: 'threeSplit',
    diagramType: 'split-3p-37x75-horizontal',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '75x37 CM (30"x15")', widthRatio: 30, heightRatio: 15 },
      { id: 'p1', label: 'Center Panel', dimension: '75x37 CM (30"x15")', widthRatio: 30, heightRatio: 15 },
      { id: 'p2', label: 'Right Panel', dimension: '75x37 CM (30"x15")', widthRatio: 30, heightRatio: 15 }
    ]
  },
  {
    id: 'split-3p-50x90-t-split',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (1) 50x90 CM (20"x36"), (2) 50x40 CM (20"x16")',
    dimensionsSummary: '3-piece (1) 50x90 CM, (2) 50x40 CM',
    widthInches: 36,
    heightInches: 40,
    acrylicPrice: 2690.00,
    canvasPrice: 2990.00,
    aspectRatio: 0.9000,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (1) 50x90 CM (20"x36"), (2) 50x40 CM (20"x16")',
    arrangement: 'tSplitTop',
    diagramType: 'split-3p-50x90-t-split',
    panels: [
      { id: 'p0', label: 'Top Wide', dimension: '90x50 CM (36"x20")', widthRatio: 36, heightRatio: 20 },
      { id: 'p1', label: 'Bottom Left', dimension: '45x50 CM (18"x20")', widthRatio: 18, heightRatio: 20 },
      { id: 'p2', label: 'Bottom Right', dimension: '45x50 CM (18"x20")', widthRatio: 18, heightRatio: 20 }
    ]
  },
  {
    id: 'split-9p-30x30-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '9-piece (9) 30x30 CM (12"x12")',
    dimensionsSummary: '9-piece (9) 30x30 CM (12"x12")',
    widthInches: 36,
    heightInches: 36,
    acrylicPrice: 2835.00,
    canvasPrice: 3150.00,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: '9-piece (9) 30x30 CM (12"x12")',
    arrangement: 'nineGrid',
    diagramType: 'split-9p-30x30-grid',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Panel 2', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Panel 3', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p3', label: 'Panel 4', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Panel 5', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p5', label: 'Panel 6', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p6', label: 'Panel 7', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p7', label: 'Panel 8', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p8', label: 'Panel 9', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-7p-25x35-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '7-piece (4) 25x35 CM (10"x14"), (3) 50x35 CM (20"x14")',
    dimensionsSummary: '7-piece (4) 25x35 CM, (3) 50x35 CM',
    widthInches: 42,
    heightInches: 40,
    acrylicPrice: 2925.00,
    canvasPrice: 3250.00,
    aspectRatio: 1.0500,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '7-piece (4) 25x35 CM (10"x14"), (3) 50x35 CM (20"x14")',
    arrangement: 'sevenDisplay',
    diagramType: 'split-7p-25x35-combo',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '35x25 CM (14"x10")', widthRatio: 14, heightRatio: 10 },
      { id: 'p1', label: 'Top Right', dimension: '35x25 CM (14"x10")', widthRatio: 14, heightRatio: 10 },
      { id: 'p2', label: 'Mid Left', dimension: '35x50 CM (14"x20")', widthRatio: 14, heightRatio: 20 },
      { id: 'p3', label: 'Mid Center', dimension: '35x50 CM (14"x20")', widthRatio: 14, heightRatio: 20 },
      { id: 'p4', label: 'Mid Right', dimension: '35x50 CM (14"x20")', widthRatio: 14, heightRatio: 20 },
      { id: 'p5', label: 'Bot Left', dimension: '35x25 CM (14"x10")', widthRatio: 14, heightRatio: 10 },
      { id: 'p6', label: 'Bot Right', dimension: '35x25 CM (14"x10")', widthRatio: 14, heightRatio: 10 }
    ]
  },
  {
    id: 'split-6p-mosaic-cluster',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '6-piece (2) 45x30 CM (18"x12"), (3) 25x25 CM (10"x10"), (1) 50x65 CM (20"x36")',
    dimensionsSummary: '6-piece (2) 45x30, (3) 25x25, (1) 50x65 CM',
    widthInches: 50,
    heightInches: 30,
    acrylicPrice: 2820.00,
    canvasPrice: 3134.05,
    aspectRatio: 1.6667,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '6-piece (2) 45x30 CM (18"x12"), (3) 25x25 CM (10"x10"), (1) 50x65 CM (20"x36")',
    arrangement: 'centerFeatureCluster',
    diagramType: 'split-6p-mosaic-cluster',
    panels: [
      { id: 'p0', label: 'Top 1', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Top 2', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p2', label: 'Top 3', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p3', label: 'Left Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p4', label: 'Center Large', dimension: '65x50 CM (26"x20")', widthRatio: 26, heightRatio: 20 },
      { id: 'p5', label: 'Right Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 }
    ]
  },
  {
    id: 'split-4p-50x50-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (4) 50x50 CM (20"x20")',
    dimensionsSummary: '4-piece (4) 50x50 CM (20"x20")',
    widthInches: 40,
    heightInches: 40,
    acrylicPrice: 3935.00,
    canvasPrice: 4371.88,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (4) 50x50 CM (20"x20")',
    arrangement: 'fourGrid',
    diagramType: 'split-4p-50x50-grid',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p1', label: 'Top Right', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p2', label: 'Bottom Left', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p3', label: 'Bottom Right', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 }
    ]
  },
  {
    id: 'split-3p-75x50-triptych',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (3) 75x50 CM (30"x20")',
    dimensionsSummary: '3-piece (3) 75x50 CM (30"x20")',
    widthInches: 60,
    heightInches: 30,
    acrylicPrice: 3970.00,
    canvasPrice: 4412.31,
    aspectRatio: 2.0000,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (3) 75x50 CM (30"x20")',
    arrangement: 'threeSplit',
    diagramType: 'split-3p-75x50-triptych',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '50x75 CM (20"x30")', widthRatio: 20, heightRatio: 30 },
      { id: 'p1', label: 'Center Panel', dimension: '50x75 CM (20"x30")', widthRatio: 20, heightRatio: 30 },
      { id: 'p2', label: 'Right Panel', dimension: '50x75 CM (20"x30")', widthRatio: 20, heightRatio: 30 }
    ]
  },
  {
    id: 'split-4p-97x72-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (1) 97x72 CM (40"x30"), (3) 27x27 CM (12"x12")',
    dimensionsSummary: '4-piece (1) 97x72 CM, (3) 27x27 CM',
    widthInches: 39,
    heightInches: 38,
    acrylicPrice: 3095.00,
    canvasPrice: 3441.85,
    aspectRatio: 1.0206,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (1) 97x72 CM (40"x30"), (3) 27x27 CM (12"x12")',
    arrangement: 'tSplitRight3',
    diagramType: 'split-4p-97x72-combo',
    panels: [
      { id: 'p0', label: 'Left Grand', dimension: '72x97 CM (30"x40")', widthRatio: 30, heightRatio: 40 },
      { id: 'p1', label: 'Right Top', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Right Mid', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p3', label: 'Right Bot', dimension: '27x27 CM (12"x12")', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'split-5p-50x30-stepped',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (2) 50x30 CM (20"x12"), (2) 75x30 CM (30"x12"), (1) 100x30 CM (40"x12")',
    dimensionsSummary: '5-piece (2) 50x30, (2) 75x30, (1) 100x30 CM',
    widthInches: 60,
    heightInches: 40,
    acrylicPrice: 3230.00,
    canvasPrice: 3590.00,
    aspectRatio: 1.5000,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (2) 50x30 CM (20"x12"), (2) 75x30 CM (30"x12"), (1) 100x30 CM (40"x12")',
    arrangement: 'steppedChevron',
    diagramType: 'split-5p-50x30-stepped',
    panels: [
      { id: 'p0', label: 'Outer Left', dimension: '30x50 CM (12"x20")', widthRatio: 12, heightRatio: 20 },
      { id: 'p1', label: 'Inner Left', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p2', label: 'Center Tall', dimension: '30x100 CM (12"x40")', widthRatio: 12, heightRatio: 40 },
      { id: 'p3', label: 'Inner Right', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p4', label: 'Outer Right', dimension: '30x50 CM (12"x20")', widthRatio: 12, heightRatio: 20 }
    ]
  },
  {
    id: 'split-4p-75x40-alternating',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (2) 75x40 CM (30"x16"), (2) 40x60 CM (16"x24")',
    dimensionsSummary: '4-piece (2) 75x40 CM, (2) 40x60 CM',
    widthInches: 64,
    heightInches: 30,
    acrylicPrice: 3375.00,
    canvasPrice: 3750.00,
    aspectRatio: 2.1333,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (2) 75x40 CM (30"x16"), (2) 40x60 CM (16"x24")',
    arrangement: 'alternatingStepped',
    diagramType: 'split-4p-75x40-alternating',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '40x60 CM (16"x24")', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Panel 2', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p2', label: 'Panel 3', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p3', label: 'Panel 4', dimension: '40x60 CM (16"x24")', widthRatio: 16, heightRatio: 24 }
    ]
  },
  {
    id: 'split-4p-75x37-inner-tall',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (2) 75x37 CM (30"x16"), (2) 57x37 CM (24"x16")',
    dimensionsSummary: '4-piece (2) 75x37 CM, (2) 57x37 CM',
    widthInches: 59,
    heightInches: 30,
    acrylicPrice: 3435.00,
    canvasPrice: 3820.00,
    aspectRatio: 1.9733,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (2) 75x37 CM (30"x16"), (2) 57x37 CM (24"x16")',
    arrangement: 'innerTall4',
    diagramType: 'split-4p-75x37-inner-tall',
    panels: [
      { id: 'p0', label: 'Outer Left', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Inner Left', dimension: '37x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p2', label: 'Inner Right', dimension: '37x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p3', label: 'Outer Right', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 }
    ]
  },
  {
    id: 'split-5p-75x30-equal',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (5) 75x30 CM (30"x12")',
    dimensionsSummary: '5-piece (5) 75x30 CM (30"x12")',
    widthInches: 60,
    heightInches: 30,
    acrylicPrice: 3550.00,
    canvasPrice: 3950.00,
    aspectRatio: 2.0000,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (5) 75x30 CM (30"x12")',
    arrangement: 'fiveEqual',
    diagramType: 'split-5p-75x30-equal',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p1', label: 'Panel 2', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p2', label: 'Panel 3', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p3', label: 'Panel 4', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 },
      { id: 'p4', label: 'Panel 5', dimension: '30x75 CM (12"x30")', widthRatio: 12, heightRatio: 30 }
    ]
  },
  {
    id: 'split-3p-90x30-center-wide',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (2) 90x30 CM (36"x12"), (1) 90x70 CM (36"x28")',
    dimensionsSummary: '3-piece (2) 90x30 CM, (1) 90x70 CM',
    widthInches: 51,
    heightInches: 36,
    acrylicPrice: 3500.00,
    canvasPrice: 3893.10,
    aspectRatio: 1.4444,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (2) 90x30 CM (36"x12"), (1) 90x70 CM (36"x28")',
    arrangement: 'centerWide3',
    diagramType: 'split-3p-90x30-center-wide',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '30x90 CM (12"x36")', widthRatio: 12, heightRatio: 36 },
      { id: 'p1', label: 'Center Wide', dimension: '70x90 CM (28"x36")', widthRatio: 28, heightRatio: 36 },
      { id: 'p2', label: 'Right Panel', dimension: '30x90 CM (12"x36")', widthRatio: 12, heightRatio: 36 }
    ]
  },
  {
    id: 'split-4p-75x40-stepped',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (4) 75x40 CM (30"x16")',
    dimensionsSummary: '4-piece (4) 75x40 CM (30"x16")',
    widthInches: 64,
    heightInches: 34,
    acrylicPrice: 3615.00,
    canvasPrice: 4016.60,
    aspectRatio: 1.8824,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (4) 75x40 CM (30"x16")',
    arrangement: 'fourStepped',
    diagramType: 'split-4p-75x40-stepped',
    panels: [
      { id: 'p0', label: 'Panel 1', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p1', label: 'Panel 2', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p2', label: 'Panel 3', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p3', label: 'Panel 4', dimension: '40x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 }
    ]
  },
  {
    id: 'split-8p-gallery-wall',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '8-piece (2) 50x40 CM (20"x16"), (2) 25x40 CM (10"x16"), (3) 25x25 CM (10"x10"), (1) 50x80 CM (20"x32")',
    dimensionsSummary: '8-piece (2) 50x40, (2) 25x40, (3) 25x25, (1) 50x80 CM',
    widthInches: 52,
    heightInches: 40,
    acrylicPrice: 3710.00,
    canvasPrice: 4125.85,
    aspectRatio: 1.3000,
    category: 'MULTI_PANEL',
    panelsCount: 8,
    pieceBreakdown: '8-piece (2) 50x40 CM (20"x16"), (2) 25x40 CM (10"x16"), (3) 25x25 CM (10"x10"), (1) 50x80 CM (20"x32")',
    arrangement: 'eightGalleryWall',
    diagramType: 'split-8p-gallery-wall',
    panels: [
      { id: 'p0', label: 'Top 1', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Top 2', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p2', label: 'Top 3', dimension: '25x25 CM (10"x10")', widthRatio: 10, heightRatio: 10 },
      { id: 'p3', label: 'Left Panel', dimension: '25x40 CM (10"x16")', widthRatio: 10, heightRatio: 16 },
      { id: 'p4', label: 'Center Large', dimension: '80x50 CM (32"x20")', widthRatio: 32, heightRatio: 20 },
      { id: 'p5', label: 'Right Panel', dimension: '25x40 CM (10"x16")', widthRatio: 10, heightRatio: 16 },
      { id: 'p6', label: 'Bottom Left', dimension: '50x40 CM (20"x16")', widthRatio: 20, heightRatio: 10 },
      { id: 'p7', label: 'Bottom Right', dimension: '50x40 CM (20"x16")', widthRatio: 20, heightRatio: 10 }
    ]
  },
  {
    id: 'split-3p-90x35-center-wide',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '3-piece (2) 90x35 CM (36"x14"), (1) 90x70 CM (36"x28")',
    dimensionsSummary: '3-piece (2) 90x35 CM, (1) 90x70 CM',
    widthInches: 56,
    heightInches: 36,
    acrylicPrice: 3760.00,
    canvasPrice: 4180.00,
    aspectRatio: 1.5556,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '3-piece (2) 90x35 CM (36"x14"), (1) 90x70 CM (36"x28")',
    arrangement: 'centerWide3',
    diagramType: 'split-3p-90x35-center-wide',
    panels: [
      { id: 'p0', label: 'Left Panel', dimension: '35x90 CM (14"x36")', widthRatio: 14, heightRatio: 36 },
      { id: 'p1', label: 'Center Wide', dimension: '70x90 CM (28"x36")', widthRatio: 28, heightRatio: 36 },
      { id: 'p2', label: 'Right Panel', dimension: '35x90 CM (14"x36")', widthRatio: 14, heightRatio: 36 }
    ]
  },
  {
    id: 'split-4p-60x60-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '4-piece (4) 60x60 CM (24"x24")',
    dimensionsSummary: '4-piece (4) 60x60 CM (24"x24")',
    widthInches: 48,
    heightInches: 48,
    acrylicPrice: 4400.00,
    canvasPrice: 4890.00,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4-piece (4) 60x60 CM (24"x24")',
    arrangement: 'fourGrid',
    diagramType: 'split-4p-60x60-grid',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 },
      { id: 'p1', label: 'Top Right', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 },
      { id: 'p2', label: 'Bottom Left', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 },
      { id: 'p3', label: 'Bottom Right', dimension: '60x60 CM (24"x24")', widthRatio: 24, heightRatio: 24 }
    ]
  },
  {
    id: 'split-5p-57-75-97-stepped',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '5-piece (2) 57x37 CM (24"x16"), (2) 75x37 CM (30"x16"), (1) 97x37 CM (40"x16")',
    dimensionsSummary: '5-piece (2) 57x37, (2) 75x37, (1) 97x37 CM',
    widthInches: 74,
    heightInches: 39,
    acrylicPrice: 4185.00,
    canvasPrice: 4650.00,
    aspectRatio: 1.9072,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-piece (2) 57x37 CM (24"x16"), (2) 75x37 CM (30"x16"), (1) 97x37 CM (40"x16")',
    arrangement: 'steppedChevron',
    diagramType: 'split-5p-57-75-97-stepped',
    panels: [
      { id: 'p0', label: 'Outer Left', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Inner Left', dimension: '37x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p2', label: 'Center Tall', dimension: '37x97 CM (16"x40")', widthRatio: 16, heightRatio: 40 },
      { id: 'p3', label: 'Inner Right', dimension: '37x75 CM (16"x30")', widthRatio: 16, heightRatio: 30 },
      { id: 'p4', label: 'Outer Right', dimension: '37x57 CM (16"x24")', widthRatio: 16, heightRatio: 24 }
    ]
  },
  {
    id: 'split-8p-30x30-combo',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '8-piece (2) 30x30 CM (12"x12"), (5) 45x50 CM (18"x12"), (1) 75x100 CM (30"x40")',
    dimensionsSummary: '8-piece (2) 30x30, (5) 45x50, (1) 75x100 CM',
    widthInches: 64,
    heightInches: 40,
    acrylicPrice: 4480.00,
    canvasPrice: 4980.00,
    aspectRatio: 1.6000,
    category: 'MULTI_PANEL',
    panelsCount: 8,
    pieceBreakdown: '8-piece (2) 30x30 CM (12"x12"), (5) 45x50 CM (18"x12"), (1) 75x100 CM (30"x40")',
    arrangement: 'eightGrandFeature',
    diagramType: 'split-8p-30x30-combo',
    panels: [
      { id: 'p0', label: 'Top 1', dimension: '30x30 CM (12"x12")', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Top 2', dimension: '45x30 CM (18"x12")', widthRatio: 18, heightRatio: 12 },
      { id: 'p2', label: 'Top 3', dimension: '45x30 CM (18"x12")', widthRatio: 18, heightRatio: 12 },
      { id: 'p3', label: 'Left Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p4', label: 'Center Grand', dimension: '100x70 CM (40"x28")', widthRatio: 40, heightRatio: 28 },
      { id: 'p5', label: 'Right Panel', dimension: '30x45 CM (12"x18")', widthRatio: 12, heightRatio: 18 },
      { id: 'p6', label: 'Bottom Left', dimension: '45x25 CM (18"x10")', widthRatio: 18, heightRatio: 10 },
      { id: 'p7', label: 'Bottom Right', dimension: '45x25 CM (18"x10")', widthRatio: 18, heightRatio: 10 }
    ]
  },
  {
    id: 'split-8p-50x50-gallery',
    shapeId: 'shape-landscape',
    shapeName: 'Split Display',
    label: '8-piece (4) 50x50 CM (20"x20"), (2) 40x60 CM (16"x24"), (2) 60x60 CM (24"x24")',
    dimensionsSummary: '8-piece (4) 50x50, (2) 40x60, (2) 60x60 CM',
    widthInches: 72,
    heightInches: 44,
    acrylicPrice: 4725.00,
    canvasPrice: 5250.00,
    aspectRatio: 1.6364,
    category: 'MULTI_PANEL',
    panelsCount: 8,
    pieceBreakdown: '8-piece (4) 50x50 CM (20"x20"), (2) 40x60 CM (16"x24"), (2) 60x60 CM (24"x24")',
    arrangement: 'eightTwoRows',
    diagramType: 'split-8p-50x50-gallery',
    panels: [
      { id: 'p0', label: 'Row 1 Col 1', dimension: '40x50 CM (16"x20")', widthRatio: 16, heightRatio: 20 },
      { id: 'p1', label: 'Row 1 Col 2', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p2', label: 'Row 1 Col 3', dimension: '50x50 CM (20"x20")', widthRatio: 20, heightRatio: 20 },
      { id: 'p3', label: 'Row 1 Col 4', dimension: '40x50 CM (16"x20")', widthRatio: 16, heightRatio: 20 },
      { id: 'p4', label: 'Row 2 Col 1', dimension: '40x60 CM (16"x24")', widthRatio: 16, heightRatio: 24 },
      { id: 'p5', label: 'Row 2 Col 2', dimension: '60x60 CM (24"x24")', widthRatio: 20, heightRatio: 24 },
      { id: 'p6', label: 'Row 2 Col 3', dimension: '60x60 CM (24"x24")', widthRatio: 20, heightRatio: 24 },
      { id: 'p7', label: 'Row 2 Col 4', dimension: '40x60 CM (16"x24")', widthRatio: 16, heightRatio: 24 }
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
