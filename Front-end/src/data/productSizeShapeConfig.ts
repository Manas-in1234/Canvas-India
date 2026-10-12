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
  priceRange?: string;
  collageCategory?: 'landscape' | 'panoramic' | 'portrait' | 'square';
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
    label: '3-Piece Gallery Display (18" × 24" total)',
    dimensionsSummary: '18" × 24" (3 Panels)',
    widthInches: 18,
    heightInches: 24,
    acrylicPrice: 1050.00,
    canvasPrice: 856.90,
    aspectRatio: 0.7500,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '(1) 12"×18" Tall + (2) 10"×8" Mini panels',
    arrangement: 'threeCollage',
    diagramType: 'wall-display-3a',
    panels: [
      { id: 'p0', label: 'Main Tall', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 },
      { id: 'p1', label: 'Top Mini', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p2', label: 'Bottom Mini', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-3b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-Piece Center Winged (40" × 16" total)',
    dimensionsSummary: '40" × 16" (3 Panels)',
    widthInches: 40,
    heightInches: 16,
    acrylicPrice: 1290.00,
    canvasPrice: 1065.90,
    aspectRatio: 2.5000,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '(1) 16"×20" Large Center + (2) 10"×8" Wings',
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
    label: '4-Piece Gallery Showcase (34" × 24" total)',
    dimensionsSummary: '34" × 24" (4 Panels)',
    widthInches: 34,
    heightInches: 24,
    acrylicPrice: 1990.00,
    canvasPrice: 1693.85,
    aspectRatio: 1.4167,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(1) 24"×16" + (1) 11"×17" + (2) 12"×8"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4a',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '24" × 16"', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Right Top', dimension: '11" × 17"', widthRatio: 17, heightRatio: 11 },
      { id: 'p2', label: 'Bottom Left', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 },
      { id: 'p3', label: 'Bottom Right', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-4b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-Piece Classic Showcase (36" × 25" total)',
    dimensionsSummary: '36" × 25" (4 Panels)',
    widthInches: 36,
    heightInches: 25,
    acrylicPrice: 2090.00,
    canvasPrice: 1749.00,
    aspectRatio: 1.4400,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(1) 25"×16" + (1) 11"×18" + (2) 12"×8"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4b',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '25" × 16"', widthRatio: 16, heightRatio: 25 },
      { id: 'p1', label: 'Right Top', dimension: '11" × 18"', widthRatio: 18, heightRatio: 11 },
      { id: 'p2', label: 'Bottom Left', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 },
      { id: 'p3', label: 'Bottom Right', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-4c',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-Piece Centerpiece Display (50" × 18" total)',
    dimensionsSummary: '50" × 18" (4 Panels)',
    widthInches: 50,
    heightInches: 18,
    acrylicPrice: 2190.00,
    canvasPrice: 1799.00,
    aspectRatio: 2.7778,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(2) 8"×10" + (1) 18"×24" + (1) 18"×12"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4c',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 },
      { id: 'p1', label: 'Left Bottom', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 },
      { id: 'p2', label: 'Center Large', dimension: '18" × 24"', widthRatio: 24, heightRatio: 18 },
      { id: 'p3', label: 'Right Vertical', dimension: '18" × 12"', widthRatio: 12, heightRatio: 18 }
    ]
  },
  {
    id: 'wall-display-4d',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-Piece Asymmetric Display (38" × 24" total)',
    dimensionsSummary: '38" × 24" (4 Panels)',
    widthInches: 38,
    heightInches: 24,
    acrylicPrice: 2250.00,
    canvasPrice: 1849.00,
    aspectRatio: 1.5833,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(1) 24"×18" + (1) 12"×18" + (2) 10"×8"',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4d',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '24" × 18"', widthRatio: 18, heightRatio: 24 },
      { id: 'p1', label: 'Right Top', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 },
      { id: 'p2', label: 'Bottom Left', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p3', label: 'Bottom Right', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-5a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-Piece Stepped Pyramid (62" × 36" total)',
    dimensionsSummary: '62" × 36" (5 Panels)',
    widthInches: 62,
    heightInches: 36,
    acrylicPrice: 2150.00,
    canvasPrice: 1772.70,
    aspectRatio: 1.7222,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '(2) 10"×8" + (2) 14"×11" + (1) 20"×16"',
    arrangement: 'fivePyramid',
    diagramType: 'wall-display-5a',
    panels: [
      { id: 'p0', label: 'Far Left', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 },
      { id: 'p1', label: 'Mid Left', dimension: '14" × 11"', widthRatio: 11, heightRatio: 14 },
      { id: 'p2', label: 'Center Apex', dimension: '20" × 16"', widthRatio: 16, heightRatio: 20 },
      { id: 'p3', label: 'Mid Right', dimension: '14" × 11"', widthRatio: 11, heightRatio: 14 },
      { id: 'p4', label: 'Far Right', dimension: '10" × 8"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-3c',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-Piece Studio Gallery (38" × 26" total)',
    dimensionsSummary: '38" × 26" (3 Panels)',
    widthInches: 38,
    heightInches: 26,
    acrylicPrice: 2350.00,
    canvasPrice: 1913.30,
    aspectRatio: 1.4615,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '(1) 26"×18" + (2) 12"×18"',
    arrangement: 'threeCollage',
    diagramType: 'wall-display-3c',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '26" × 18"', widthRatio: 18, heightRatio: 26 },
      { id: 'p1', label: 'Right Top', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 },
      { id: 'p2', label: 'Right Bottom', dimension: '12" × 18"', widthRatio: 18, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-4e',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-Piece Quad Square Grid (32" × 32" total)',
    dimensionsSummary: '32" × 32" (4 Panels)',
    widthInches: 32,
    heightInches: 32,
    acrylicPrice: 2390.00,
    canvasPrice: 1934.20,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(4) 15"×15" Equal Squares',
    arrangement: 'fourGrid',
    diagramType: 'wall-display-4e',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '15" × 15"', widthRatio: 15, heightRatio: 15 },
      { id: 'p1', label: 'Top Right', dimension: '15" × 15"', widthRatio: 15, heightRatio: 15 },
      { id: 'p2', label: 'Bottom Left', dimension: '15" × 15"', widthRatio: 15, heightRatio: 15 },
      { id: 'p3', label: 'Bottom Right', dimension: '15" × 15"', widthRatio: 15, heightRatio: 15 }
    ]
  },
  {
    id: 'wall-display-7a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '7-Piece Centerpiece Halo (44" × 26" total)',
    dimensionsSummary: '44" × 26" (7 Panels)',
    widthInches: 44,
    heightInches: 26,
    acrylicPrice: 2490.00,
    canvasPrice: 1999.00,
    aspectRatio: 1.6923,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '(1) 26"×26" + (6) 8"×8" Mini Panels',
    arrangement: 'sevenHalo',
    diagramType: 'wall-display-7a',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p1', label: 'Left Mid', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p2', label: 'Left Bot', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p3', label: 'Center Large', dimension: '26" × 26"', widthRatio: 26, heightRatio: 26 },
      { id: 'p4', label: 'Right Top', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p5', label: 'Right Mid', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p6', label: 'Right Bot', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'wall-display-3d',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-Piece Horizon Trio (40" × 26" total)',
    dimensionsSummary: '40" × 26" (3 Panels)',
    widthInches: 40,
    heightInches: 26,
    acrylicPrice: 2390.00,
    canvasPrice: 1899.00,
    aspectRatio: 1.5385,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '(1) 26"×26" + (2) 12"×12"',
    arrangement: 'threeCollage',
    diagramType: 'wall-display-3d',
    panels: [
      { id: 'p0', label: 'Left Square', dimension: '26" × 26"', widthRatio: 26, heightRatio: 26 },
      { id: 'p1', label: 'Right Top', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Right Bottom', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-3e',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '3-Piece Dynamic Offset (42" × 36" total)',
    dimensionsSummary: '42" × 36" (3 Panels)',
    widthInches: 42,
    heightInches: 36,
    acrylicPrice: 2450.00,
    canvasPrice: 1949.00,
    aspectRatio: 1.1667,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '(1) 16"×24" + (1) 18"×12" + (1) 24"×16"',
    arrangement: 'threeCollage',
    diagramType: 'wall-display-3e',
    panels: [
      { id: 'p0', label: 'Top Left', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 },
      { id: 'p1', label: 'Bottom Mid', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 },
      { id: 'p2', label: 'Right Vertical', dimension: '24" × 16"', widthRatio: 16, heightRatio: 24 }
    ]
  },
  {
    id: 'wall-display-5b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-Piece Cross Gallery (50" × 24" total)',
    dimensionsSummary: '50" × 24" (5 Panels)',
    widthInches: 50,
    heightInches: 24,
    acrylicPrice: 2890.00,
    canvasPrice: 2326.55,
    aspectRatio: 2.0833,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '(1) 24"×24" + (4) 11"×11"',
    arrangement: 'fiveGrid',
    diagramType: 'wall-display-5b',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '11" × 11"', widthRatio: 11, heightRatio: 11 },
      { id: 'p1', label: 'Left Bottom', dimension: '11" × 11"', widthRatio: 11, heightRatio: 11 },
      { id: 'p2', label: 'Center Large', dimension: '24" × 24"', widthRatio: 24, heightRatio: 24 },
      { id: 'p3', label: 'Right Top', dimension: '11" × 11"', widthRatio: 11, heightRatio: 11 },
      { id: 'p4', label: 'Right Bottom', dimension: '11" × 11"', widthRatio: 11, heightRatio: 11 }
    ]
  },
  {
    id: 'wall-display-5c',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-Piece Pavilion Gallery (55" × 33" total)',
    dimensionsSummary: '55" × 33" (5 Panels)',
    widthInches: 55,
    heightInches: 33,
    acrylicPrice: 3350.00,
    canvasPrice: 2725.55,
    aspectRatio: 1.6667,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '(2) 20"×14" + (1) 15"×23" + (2) 16"×11"',
    arrangement: 'fivePavilion',
    diagramType: 'wall-display-5c',
    panels: [
      { id: 'p0', label: 'Left Wing', dimension: '20" × 14"', widthRatio: 14, heightRatio: 20 },
      { id: 'p1', label: 'Center Top', dimension: '15" × 23"', widthRatio: 23, heightRatio: 15 },
      { id: 'p2', label: 'Center Bot Left', dimension: '16" × 11"', widthRatio: 11, heightRatio: 16 },
      { id: 'p3', label: 'Center Bot Right', dimension: '16" × 11"', widthRatio: 11, heightRatio: 16 },
      { id: 'p4', label: 'Right Wing', dimension: '20" × 14"', widthRatio: 14, heightRatio: 20 }
    ]
  },
  {
    id: 'wall-display-5d',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-Piece Square Focal Gallery (54" × 26" total)',
    dimensionsSummary: '54" × 26" (5 Panels)',
    widthInches: 54,
    heightInches: 26,
    acrylicPrice: 3360.00,
    canvasPrice: 2726.50,
    aspectRatio: 2.0769,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '(1) 26"×26" + (4) 12"×12"',
    arrangement: 'fiveGrid',
    diagramType: 'wall-display-5d',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Left Bottom', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Center Focal', dimension: '26" × 26"', widthRatio: 26, heightRatio: 26 },
      { id: 'p3', label: 'Right Top', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Right Bottom', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-7b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '7-Piece Multi-Tier Salon (47" × 32" total)',
    dimensionsSummary: '47" × 32" (7 Panels)',
    widthInches: 47,
    heightInches: 32,
    acrylicPrice: 3450.00,
    canvasPrice: 2819.60,
    aspectRatio: 1.4688,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '(2) 15"×20" + (3) 8"×12" + (1) 18"×12" + (1) 13"×13"',
    arrangement: 'sevenSalon',
    diagramType: 'wall-display-7b',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '15" × 20"', widthRatio: 15, heightRatio: 20 },
      { id: 'p1', label: 'Left Bot', dimension: '15" × 20"', widthRatio: 15, heightRatio: 20 },
      { id: 'p2', label: 'Mid Top', dimension: '8" × 12"', widthRatio: 12, heightRatio: 8 },
      { id: 'p3', label: 'Mid Center', dimension: '12" × 8"', widthRatio: 8, heightRatio: 12 },
      { id: 'p4', label: 'Mid Bot', dimension: '8" × 12"', widthRatio: 12, heightRatio: 8 },
      { id: 'p5', label: 'Right Top', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 },
      { id: 'p6', label: 'Right Bot', dimension: '13" × 13"', widthRatio: 13, heightRatio: 13 }
    ]
  },
  {
    id: 'wall-display-6a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '6-Piece Panoramic Horizon (72" × 28" total)',
    dimensionsSummary: '72" × 28" (6 Panels)',
    widthInches: 72,
    heightInches: 28,
    acrylicPrice: 3490.00,
    canvasPrice: 2843.35,
    aspectRatio: 2.5714,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '(1) 10"×10" + (1) 18"×12" + (1) 28"×18" + (2) 11"×16" + (1) 10"×12"',
    arrangement: 'sixHorizon',
    diagramType: 'wall-display-6a',
    panels: [
      { id: 'p0', label: 'Far Left', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Mid Left', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 },
      { id: 'p2', label: 'Center Panoramic', dimension: '28" × 18"', widthRatio: 28, heightRatio: 18 },
      { id: 'p3', label: 'Stack Top', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p4', label: 'Stack Bot', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p5', label: 'Far Right', dimension: '10" × 12"', widthRatio: 12, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-4f',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '4-Piece Monument Display (40" × 37" total)',
    dimensionsSummary: '40" × 37" (4 Panels)',
    widthInches: 40,
    heightInches: 37,
    acrylicPrice: 3550.00,
    canvasPrice: 2883.25,
    aspectRatio: 1.0811,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '(1) 37"×24" + (3) 11"×14"',
    arrangement: 'fourMonument',
    diagramType: 'wall-display-4f',
    panels: [
      { id: 'p0', label: 'Left Monument', dimension: '37" × 24"', widthRatio: 24, heightRatio: 37 },
      { id: 'p1', label: 'Right Top', dimension: '11" × 14"', widthRatio: 11, heightRatio: 14 },
      { id: 'p2', label: 'Right Mid', dimension: '11" × 14"', widthRatio: 11, heightRatio: 14 },
      { id: 'p3', label: 'Right Bot', dimension: '11" × 14"', widthRatio: 11, heightRatio: 14 }
    ]
  },
  {
    id: 'wall-display-7c',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '7-Piece Symphony Gallery (48" × 32" total)',
    dimensionsSummary: '48" × 32" (7 Panels)',
    widthInches: 48,
    heightInches: 32,
    acrylicPrice: 3650.00,
    canvasPrice: 2949.00,
    aspectRatio: 1.5000,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '(2) 15"×20" + (3) 10"×12" + (1) 18"×12" + (1) 12"×12"',
    arrangement: 'sevenSalon',
    diagramType: 'wall-display-7c',
    panels: [
      { id: 'p0', label: 'Left Top', dimension: '15" × 20"', widthRatio: 15, heightRatio: 20 },
      { id: 'p1', label: 'Left Bot', dimension: '15" × 20"', widthRatio: 15, heightRatio: 20 },
      { id: 'p2', label: 'Mid Top', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 },
      { id: 'p3', label: 'Mid Center', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 },
      { id: 'p4', label: 'Mid Bot', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 },
      { id: 'p5', label: 'Right Top', dimension: '18" × 12"', widthRatio: 18, heightRatio: 12 },
      { id: 'p6', label: 'Right Bot', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-6b',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '6-Piece Showcase & Base (56" × 44" total)',
    dimensionsSummary: '56" × 44" (6 Panels)',
    widthInches: 56,
    heightInches: 44,
    acrylicPrice: 3890.00,
    canvasPrice: 3149.00,
    aspectRatio: 1.2727,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '(1) 30"×32" + (2) 14"×11" + (3) 8"×8"',
    arrangement: 'sixShowcase',
    diagramType: 'wall-display-6b',
    panels: [
      { id: 'p0', label: 'Left Flank', dimension: '14" × 11"', widthRatio: 11, heightRatio: 14 },
      { id: 'p1', label: 'Center Focal', dimension: '30" × 32"', widthRatio: 30, heightRatio: 32 },
      { id: 'p2', label: 'Right Flank', dimension: '14" × 11"', widthRatio: 11, heightRatio: 14 },
      { id: 'p3', label: 'Base Left', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p4', label: 'Base Center', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 },
      { id: 'p5', label: 'Base Right', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }
    ]
  },
  {
    id: 'wall-display-9a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '9-Piece Ennead Matrix (40" × 40" total)',
    dimensionsSummary: '40" × 40" (9 Panels)',
    widthInches: 40,
    heightInches: 40,
    acrylicPrice: 3990.00,
    canvasPrice: 3299.00,
    aspectRatio: 1.0000,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: '(9) 12"×12" Equal Squares (3×3 Grid)',
    arrangement: 'nineGrid',
    diagramType: 'wall-display-9a',
    panels: [
      { id: 'p0', label: 'Row 1 Col 1', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p1', label: 'Row 1 Col 2', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p2', label: 'Row 1 Col 3', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p3', label: 'Row 2 Col 1', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p4', label: 'Row 2 Col 2', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p5', label: 'Row 2 Col 3', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p6', label: 'Row 3 Col 1', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p7', label: 'Row 3 Col 2', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 },
      { id: 'p8', label: 'Row 3 Col 3', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }
    ]
  },
  {
    id: 'wall-display-5e',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '5-Piece Panoramic Crest (54" × 37" total)',
    dimensionsSummary: '54" × 37" (5 Panels)',
    widthInches: 54,
    heightInches: 37,
    acrylicPrice: 4390.00,
    canvasPrice: 3598.60,
    aspectRatio: 1.4595,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '(1) 15"×54" Panorama + (4) Columns',
    arrangement: 'fivePanoramaCrest',
    diagramType: 'wall-display-5e',
    panels: [
      { id: 'p0', label: 'Top Panorama', dimension: '15" × 54"', widthRatio: 54, heightRatio: 15 },
      { id: 'p1', label: 'Col 1', dimension: '20" × 13"', widthRatio: 13, heightRatio: 20 },
      { id: 'p2', label: 'Col 2', dimension: '16" × 11"', widthRatio: 11, heightRatio: 16 },
      { id: 'p3', label: 'Col 3', dimension: '16" × 11"', widthRatio: 11, heightRatio: 16 },
      { id: 'p4', label: 'Col 4', dimension: '20" × 13"', widthRatio: 13, heightRatio: 20 }
    ]
  },
  {
    id: 'wall-display-7d',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '7-Piece Grand Colonnade (82" × 33" total)',
    dimensionsSummary: '82" × 33" (7 Panels)',
    widthInches: 82,
    heightInches: 33,
    acrylicPrice: 4490.00,
    canvasPrice: 3667.00,
    aspectRatio: 2.4848,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '(2) 20"×14" + (1) 23"×18" + (4) 11"×16"',
    arrangement: 'sevenColonnade',
    diagramType: 'wall-display-7d',
    panels: [
      { id: 'p0', label: 'Left Wing', dimension: '20" × 14"', widthRatio: 14, heightRatio: 20 },
      { id: 'p1', label: 'Stack 1 Top', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p2', label: 'Stack 1 Bot', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p3', label: 'Center Focal', dimension: '23" × 18"', widthRatio: 18, heightRatio: 23 },
      { id: 'p4', label: 'Stack 2 Top', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p5', label: 'Stack 2 Bot', dimension: '11" × 16"', widthRatio: 11, heightRatio: 16 },
      { id: 'p6', label: 'Right Wing', dimension: '20" × 14"', widthRatio: 14, heightRatio: 20 }
    ]
  },
  {
    id: 'wall-display-10a',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '10-Piece Pantheon Gallery Wall (72" × 46" total)',
    dimensionsSummary: '72" × 46" (10 Panels)',
    widthInches: 72,
    heightInches: 46,
    acrylicPrice: 5790.00,
    canvasPrice: 4693.00,
    aspectRatio: 1.5652,
    category: 'MULTI_PANEL',
    panelsCount: 10,
    pieceBreakdown: '(1) 24"×32" + (2) 16"×20" + (2) 12"×16" + (2) 10"×12" + (3) 8"×10"',
    arrangement: 'tenPantheon',
    diagramType: 'wall-display-10a',
    panels: [
      { id: 'p0', label: 'Col 1 Top', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 },
      { id: 'p1', label: 'Col 1 Bot', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 },
      { id: 'p2', label: 'Col 2 Top', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 },
      { id: 'p3', label: 'Col 2 Bot', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 },
      { id: 'p4', label: 'Grand Focal', dimension: '24" × 32"', widthRatio: 24, heightRatio: 32 },
      { id: 'p5', label: 'Col 4 Top', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 },
      { id: 'p6', label: 'Col 4 Bot', dimension: '10" × 12"', widthRatio: 10, heightRatio: 12 },
      { id: 'p7', label: 'Col 5 Top', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 },
      { id: 'p8', label: 'Col 5 Mid', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 },
      { id: 'p9', label: 'Col 5 Bot', dimension: '8" × 10"', widthRatio: 8, heightRatio: 10 }
    ]
  },
  {
    id: 'wall-display-7e',
    shapeId: 'shape-rectangle',
    shapeName: 'Wall Display',
    label: '7-Piece Archway Gallery (78" × 38" total)',
    dimensionsSummary: '78" × 38" (7 Panels)',
    widthInches: 78,
    heightInches: 38,
    acrylicPrice: 4790.00,
    canvasPrice: 3899.00,
    aspectRatio: 2.0526,
    category: 'MULTI_PANEL',
    panelsCount: 7,
    pieceBreakdown: '(1) 24"×38" + (2) 16"×24" + (2) 12"×16" + (2) 10"×10"',
    arrangement: 'sevenArchway',
    diagramType: 'wall-display-7e',
    panels: [
      { id: 'p0', label: 'Wing Left', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 },
      { id: 'p1', label: 'Col Left Top', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 },
      { id: 'p2', label: 'Col Left Bot', dimension: '12" × 16"', widthRatio: 12, heightRatio: 16 },
      { id: 'p3', label: 'Center Master', dimension: '24" × 38"', widthRatio: 24, heightRatio: 38 },
      { id: 'p4', label: 'Col Right Top', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 },
      { id: 'p5', label: 'Col Right Bot', dimension: '16" × 24"', widthRatio: 16, heightRatio: 24 },
      { id: 'p6', label: 'Wing Right', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }
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

// COLLAGE PRESETS - 28 exact layouts across 4 categories (Landscape, Panoramic, Portrait, Square)
export const COLLAGE_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number; priceRange?: string; collageCategory?: 'landscape' | 'panoramic' | 'portrait' | 'square' }> = [
  {
    id: 'collage-land-5p-pinwheel',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '5 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-Photo Pinwheel Collage with Center Focus',
    arrangement: 'collage-land-5p-pinwheel',
    diagramType: 'collage-land-5p-pinwheel',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '11" × 5"', widthRatio: 60, heightRatio: 40 },
      { id: 'p1', label: 'Photo 2', dimension: '7" × 7"', widthRatio: 40, heightRatio: 60 },
      { id: 'p2', label: 'Photo 3', dimension: '11" × 5"', widthRatio: 60, heightRatio: 40 },
      { id: 'p3', label: 'Photo 4', dimension: '7" × 7"', widthRatio: 40, heightRatio: 60 },
      { id: 'p4', label: 'Photo 5', dimension: '4" × 2.5"', widthRatio: 20, heightRatio: 20 }
    ]
  },
  {
    id: 'collage-land-2p-split',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '2 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2 Equal Side-by-Side Vertical Photo Panels',
    arrangement: 'collage-land-2p-split',
    diagramType: 'collage-land-2p-split',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '9" × 12"', widthRatio: 50, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '9" × 12"', widthRatio: 50, heightRatio: 100 }
    ]
  },
  {
    id: 'collage-land-3p-left2-right1',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '3 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '2 Stacked Photos on Left + 1 Tall Photo on Right',
    arrangement: 'collage-land-3p-left2-right1',
    diagramType: 'collage-land-3p-left2-right1',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '9" × 6"', widthRatio: 50, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '9" × 6"', widthRatio: 50, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '9" × 12"', widthRatio: 50, heightRatio: 100 }
    ]
  },
  {
    id: 'collage-land-3p-left1-right2',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '3 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '1 Tall Photo on Left + 2 Stacked Photos on Right',
    arrangement: 'collage-land-3p-left1-right2',
    diagramType: 'collage-land-3p-left1-right2',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '9" × 12"', widthRatio: 50, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '9" × 6"', widthRatio: 50, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '9" × 6"', widthRatio: 50, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-land-6p-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '6 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '6-Photo Grid (3 Columns × 2 Rows)',
    arrangement: 'collage-land-6p-grid',
    diagramType: 'collage-land-6p-grid',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 },
      { id: 'p5', label: 'Photo 6', dimension: '6" × 6"', widthRatio: 33, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-land-5p-center-tall',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '5 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Left 2 Stacked + Center Tall + Right 2 Stacked',
    arrangement: 'collage-land-5p-center-tall',
    diagramType: 'collage-land-5p-center-tall',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 6"', widthRatio: 32, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 6"', widthRatio: 32, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '6.5" × 12"', widthRatio: 36, heightRatio: 100 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 32, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 6"', widthRatio: 32, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-land-9p-feature',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '9 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: 'Center Feature Photo surrounded by 8 Border Photos',
    arrangement: 'collage-land-9p-feature',
    diagramType: 'collage-land-9p-feature',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 },
      { id: 'p1', label: 'Photo 2', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 },
      { id: 'p2', label: 'Photo 3', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 },
      { id: 'p3', label: 'Photo 4', dimension: '9" × 3"', widthRatio: 52, heightRatio: 25 },
      { id: 'p4', label: 'Center', dimension: '9" × 6"', widthRatio: 52, heightRatio: 50 },
      { id: 'p5', label: 'Photo 6', dimension: '9" × 3"', widthRatio: 52, heightRatio: 25 },
      { id: 'p6', label: 'Photo 7', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 },
      { id: 'p7', label: 'Photo 8', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 },
      { id: 'p8', label: 'Photo 9', dimension: '4.5" × 4"', widthRatio: 24, heightRatio: 33 }
    ]
  },
  {
    id: 'collage-land-5p-left-tall-right-grid',
    shapeId: 'shape-landscape',
    shapeName: 'Photo Collage',
    label: '5 Landscape Photo Collage',
    dimensionsSummary: '18" × 12"',
    widthInches: 18,
    heightInches: 12,
    acrylicPrice: 380.00,
    canvasPrice: 307.50,
    priceRange: '₹307.50 - ₹6,367.50',
    aspectRatio: 1.5,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Left 1 Tall Feature Photo + Right 4-Photo Grid (2×2)',
    arrangement: 'collage-land-5p-left-tall-right-grid',
    diagramType: 'collage-land-5p-left-tall-right-grid',
    collageCategory: 'landscape',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '7" × 12"', widthRatio: 38, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '5.5" × 6"', widthRatio: 31, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '5.5" × 6"', widthRatio: 31, heightRatio: 50 },
      { id: 'p3', label: 'Photo 4', dimension: '5.5" × 6"', widthRatio: 31, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '5.5" × 6"', widthRatio: 31, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-pano-6p-top3-bot3',
    shapeId: 'shape-panoramic',
    shapeName: 'Photo Collage',
    label: '6 Panoramic Photo Collage',
    dimensionsSummary: '24" × 10"',
    widthInches: 24,
    heightInches: 10,
    acrylicPrice: 950.00,
    canvasPrice: 819.00,
    priceRange: '₹819.00 - ₹3,114.00',
    aspectRatio: 2.4,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: 'Top 3 Photos + Bottom 3 Photos with Wide Accent',
    arrangement: 'collage-pano-6p-top3-bot3',
    diagramType: 'collage-pano-6p-top3-bot3',
    collageCategory: 'panoramic',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '10" × 4.5"', widthRatio: 42, heightRatio: 45 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 4.5"', widthRatio: 26, heightRatio: 45 },
      { id: 'p2', label: 'Photo 3', dimension: '8" × 4.5"', widthRatio: 32, heightRatio: 45 },
      { id: 'p3', label: 'Photo 4', dimension: '5" × 5.5"', widthRatio: 22, heightRatio: 55 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 5.5"', widthRatio: 23, heightRatio: 55 },
      { id: 'p5', label: 'Photo 6', dimension: '13" × 5.5"', widthRatio: 55, heightRatio: 55 }
    ]
  },
  {
    id: 'collage-pano-5p-center-tall',
    shapeId: 'shape-panoramic',
    shapeName: 'Photo Collage',
    label: '5 Panoramic Photo Collage',
    dimensionsSummary: '24" × 10"',
    widthInches: 24,
    heightInches: 10,
    acrylicPrice: 1290.00,
    canvasPrice: 1131.00,
    priceRange: '₹1,131.00',
    aspectRatio: 2.4,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Left 2 Stacked + Center Tall Feature + Right 2 Stacked',
    arrangement: 'collage-pano-5p-center-tall',
    diagramType: 'collage-pano-5p-center-tall',
    collageCategory: 'panoramic',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '7.5" × 5"', widthRatio: 32, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '7.5" × 5"', widthRatio: 32, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '9" × 10"', widthRatio: 36, heightRatio: 100 },
      { id: 'p3', label: 'Photo 4', dimension: '7.5" × 5"', widthRatio: 32, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '7.5" × 5"', widthRatio: 32, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-pano-6p-top4-bot2',
    shapeId: 'shape-panoramic',
    shapeName: 'Photo Collage',
    label: '6 Panoramic Photo Collage',
    dimensionsSummary: '24" × 10"',
    widthInches: 24,
    heightInches: 10,
    acrylicPrice: 2150.00,
    canvasPrice: 1894.50,
    priceRange: '₹1,894.50',
    aspectRatio: 2.4,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: 'Top 4 Narrow Photos + Bottom 2 Wide Panoramic Photos',
    arrangement: 'collage-pano-6p-top4-bot2',
    diagramType: 'collage-pano-6p-top4-bot2',
    collageCategory: 'panoramic',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 3.6"', widthRatio: 25, heightRatio: 36 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 3.6"', widthRatio: 25, heightRatio: 36 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 3.6"', widthRatio: 25, heightRatio: 36 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 3.6"', widthRatio: 25, heightRatio: 36 },
      { id: 'p4', label: 'Photo 5', dimension: '12" × 6.4"', widthRatio: 50, heightRatio: 64 },
      { id: 'p5', label: 'Photo 6', dimension: '12" × 6.4"', widthRatio: 50, heightRatio: 64 }
    ]
  },
  {
    id: 'collage-pano-5p-left-tall-right-grid',
    shapeId: 'shape-panoramic',
    shapeName: 'Photo Collage',
    label: '5 Panoramic Photo Collage',
    dimensionsSummary: '24" × 10"',
    widthInches: 24,
    heightInches: 10,
    acrylicPrice: 3450.00,
    canvasPrice: 3114.00,
    priceRange: '₹3,114.00',
    aspectRatio: 2.4,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Left 1 Tall Panoramic Photo + Right 4-Photo Grid (2×2)',
    arrangement: 'collage-pano-5p-left-tall-right-grid',
    diagramType: 'collage-pano-5p-left-tall-right-grid',
    collageCategory: 'panoramic',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '8" × 10"', widthRatio: 34, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '8" × 5"', widthRatio: 33, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '8" × 5"', widthRatio: 33, heightRatio: 50 },
      { id: 'p3', label: 'Photo 4', dimension: '8" × 5"', widthRatio: 33, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '8" × 5"', widthRatio: 33, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-pano-8p-staggered',
    shapeId: 'shape-panoramic',
    shapeName: 'Photo Collage',
    label: '8 Panoramic Photo Collage',
    dimensionsSummary: '24" × 10"',
    widthInches: 24,
    heightInches: 10,
    acrylicPrice: 1350.00,
    canvasPrice: 1131.00,
    priceRange: '₹1,131.00 - ₹3,114.00',
    aspectRatio: 2.4,
    category: 'MULTI_PANEL',
    panelsCount: 8,
    pieceBreakdown: '8-Photo Alternating Height Column Arrangement',
    arrangement: 'collage-pano-8p-staggered',
    diagramType: 'collage-pano-8p-staggered',
    collageCategory: 'panoramic',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 6"', widthRatio: 25, heightRatio: 60 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 4"', widthRatio: 25, heightRatio: 40 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 4"', widthRatio: 25, heightRatio: 40 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 25, heightRatio: 60 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 6"', widthRatio: 25, heightRatio: 60 },
      { id: 'p5', label: 'Photo 6', dimension: '6" × 4"', widthRatio: 25, heightRatio: 40 },
      { id: 'p6', label: 'Photo 7', dimension: '6" × 4"', widthRatio: 25, heightRatio: 40 },
      { id: 'p7', label: 'Photo 8', dimension: '6" × 6"', widthRatio: 25, heightRatio: 60 }
    ]
  },
  {
    id: 'collage-port-5p-top2-mid2-bot1',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '5 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 620.00,
    canvasPrice: 514.50,
    priceRange: '₹514.50 - ₹4,047.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Top 2 Photos + Mid 2 Photos + Bottom 1 Wide Photo',
    arrangement: 'collage-port-5p-top2-mid2-bot1',
    diagramType: 'collage-port-5p-top2-mid2-bot1',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p4', label: 'Photo 5', dimension: '12" × 6"', widthRatio: 100, heightRatio: 34 }
    ]
  },
  {
    id: 'collage-port-5p-top2-mid1-bot2',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '5 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 660.00,
    canvasPrice: 547.50,
    priceRange: '₹547.50 - ₹4,332.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Top 2 Photos + Center 1 Wide Feature Photo + Bottom 2 Photos',
    arrangement: 'collage-port-5p-top2-mid1-bot2',
    diagramType: 'collage-port-5p-top2-mid1-bot2',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p2', label: 'Center', dimension: '12" × 8"', widthRatio: 100, heightRatio: 44 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 }
    ]
  },
  {
    id: 'collage-port-9p-feature',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '9 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 699.00,
    canvasPrice: 580.50,
    priceRange: '₹580.50 - ₹4,617.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 9,
    pieceBreakdown: 'Center Feature Photo surrounded by 8 Border Photos',
    arrangement: 'collage-port-9p-feature',
    diagramType: 'collage-port-9p-feature',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 },
      { id: 'p1', label: 'Photo 2', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 },
      { id: 'p2', label: 'Photo 3', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 4.5"', widthRatio: 52, heightRatio: 24 },
      { id: 'p4', label: 'Center', dimension: '6" × 9"', widthRatio: 52, heightRatio: 52 },
      { id: 'p5', label: 'Photo 6', dimension: '6" × 4.5"', widthRatio: 52, heightRatio: 24 },
      { id: 'p6', label: 'Photo 7', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 },
      { id: 'p7', label: 'Photo 8', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 },
      { id: 'p8', label: 'Photo 9', dimension: '3" × 6"', widthRatio: 24, heightRatio: 33 }
    ]
  },
  {
    id: 'collage-port-5p-left4-right1',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '5 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 799.00,
    canvasPrice: 685.50,
    priceRange: '₹685.50 - ₹5,517.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Left 4 Stacked Photos + Right 1 Large Tall Feature Photo',
    arrangement: 'collage-port-5p-left4-right1',
    diagramType: 'collage-port-5p-left4-right1',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '4" × 4.5"', widthRatio: 34, heightRatio: 25 },
      { id: 'p1', label: 'Photo 2', dimension: '4" × 4.5"', widthRatio: 34, heightRatio: 25 },
      { id: 'p2', label: 'Photo 3', dimension: '4" × 4.5"', widthRatio: 34, heightRatio: 25 },
      { id: 'p3', label: 'Photo 4', dimension: '4" × 4.5"', widthRatio: 34, heightRatio: 25 },
      { id: 'p4', label: 'Right Tall', dimension: '8" × 18"', widthRatio: 66, heightRatio: 100 }
    ]
  },
  {
    id: 'collage-port-5p-top1-mid2-bot2',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '5 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 620.00,
    canvasPrice: 514.50,
    priceRange: '₹514.50 - ₹4,047.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Top 1 Large Feature Photo + Mid 2 Photos + Bottom 2 Photos',
    arrangement: 'collage-port-5p-top1-mid2-bot2',
    diagramType: 'collage-port-5p-top1-mid2-bot2',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Top Large', dimension: '12" × 8"', widthRatio: 100, heightRatio: 44 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 5"', widthRatio: 50, heightRatio: 28 }
    ]
  },
  {
    id: 'collage-port-6p-2cols',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '6 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 660.00,
    canvasPrice: 547.50,
    priceRange: '₹547.50 - ₹4,332.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 6,
    pieceBreakdown: '6-Photo Vertical Grid (2 Columns × 3 Rows)',
    arrangement: 'collage-port-6p-2cols',
    diagramType: 'collage-port-6p-2cols',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p4', label: 'Photo 5', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 },
      { id: 'p5', label: 'Photo 6', dimension: '6" × 6"', widthRatio: 50, heightRatio: 33 }
    ]
  },
  {
    id: 'collage-port-4p-left1-right3',
    shapeId: 'shape-portrait',
    shapeName: 'Photo Collage',
    label: '4 Portrait Photo Collage',
    dimensionsSummary: '12" × 18"',
    widthInches: 12,
    heightInches: 18,
    acrylicPrice: 699.00,
    canvasPrice: 580.50,
    priceRange: '₹580.50 - ₹4,617.00',
    aspectRatio: 0.6666666666666666,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: 'Left 1 Large Tall Feature Photo + Right 3 Stacked Photos',
    arrangement: 'collage-port-4p-left1-right3',
    diagramType: 'collage-port-4p-left1-right3',
    collageCategory: 'portrait',
    panels: [
      { id: 'p0', label: 'Left Tall', dimension: '6" × 18"', widthRatio: 52, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '6" × 6"', widthRatio: 48, heightRatio: 33 },
      { id: 'p2', label: 'Photo 3', dimension: '6" × 6"', widthRatio: 48, heightRatio: 33 },
      { id: 'p3', label: 'Photo 4', dimension: '6" × 6"', widthRatio: 48, heightRatio: 33 }
    ]
  },
  {
    id: 'collage-sq-5p-feature',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '5 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Top-Left Main Square + Top-Right & Bottom-Right Panels + 2 Bottom-Left Panels',
    arrangement: 'collage-sq-5p-feature',
    diagramType: 'collage-sq-5p-feature',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Top Left Large', dimension: '9" × 9"', widthRatio: 56, heightRatio: 56 },
      { id: 'p1', label: 'Top Right', dimension: '7" × 8"', widthRatio: 44, heightRatio: 50 },
      { id: 'p2', label: 'Bottom Left 1', dimension: '4.5" × 7"', widthRatio: 28, heightRatio: 44 },
      { id: 'p3', label: 'Bottom Left 2', dimension: '4.5" × 7"', widthRatio: 28, heightRatio: 44 },
      { id: 'p4', label: 'Bottom Right', dimension: '7" × 8"', widthRatio: 44, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-sq-2p-split',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '2 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 2,
    pieceBreakdown: '2 Equal Side-by-Side Vertical Photo Panels',
    arrangement: 'collage-sq-2p-split',
    diagramType: 'collage-sq-2p-split',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '8" × 16"', widthRatio: 50, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '8" × 16"', widthRatio: 50, heightRatio: 100 }
    ]
  },
  {
    id: 'collage-sq-3p-left2-right1',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '3 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '2 Stacked Photos on Left + 1 Tall Photo on Right',
    arrangement: 'collage-sq-3p-left2-right1',
    diagramType: 'collage-sq-3p-left2-right1',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '8" × 16"', widthRatio: 50, heightRatio: 100 }
    ]
  },
  {
    id: 'collage-sq-3p-left1-right2',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '3 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 3,
    pieceBreakdown: '1 Tall Photo on Left + 2 Stacked Photos on Right',
    arrangement: 'collage-sq-3p-left1-right2',
    diagramType: 'collage-sq-3p-left1-right2',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '8" × 16"', widthRatio: 50, heightRatio: 100 },
      { id: 'p1', label: 'Photo 2', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-sq-5p-pinwheel',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '5 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: '5-Photo Pinwheel with Center Square and 4 Rotating Rectangles',
    arrangement: 'collage-sq-5p-pinwheel',
    diagramType: 'collage-sq-5p-pinwheel',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Center', dimension: '5" × 5"', widthRatio: 30, heightRatio: 30 },
      { id: 'p1', label: 'Top', dimension: '10.5" × 5.5"', widthRatio: 65, heightRatio: 35 },
      { id: 'p2', label: 'Right', dimension: '5.5" × 10.5"', widthRatio: 35, heightRatio: 65 },
      { id: 'p3', label: 'Bottom', dimension: '10.5" × 5.5"', widthRatio: 65, heightRatio: 35 },
      { id: 'p4', label: 'Left', dimension: '5.5" × 10.5"', widthRatio: 35, heightRatio: 65 }
    ]
  },
  {
    id: 'collage-sq-5p-top3-bot2',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '5 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 5,
    pieceBreakdown: 'Top 3 Equal Photos + Bottom 2 Equal Wide Photos',
    arrangement: 'collage-sq-5p-top3-bot2',
    diagramType: 'collage-sq-5p-top3-bot2',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '5.3" × 8"', widthRatio: 33, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '5.3" × 8"', widthRatio: 33, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '5.3" × 8"', widthRatio: 33, heightRatio: 50 },
      { id: 'p3', label: 'Photo 4', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p4', label: 'Photo 5', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 }
    ]
  },
  {
    id: 'collage-sq-4p-pinwheel',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4 Interlocking Asymmetric Pinwheel Photo Panels',
    arrangement: 'collage-sq-4p-pinwheel',
    diagramType: 'collage-sq-4p-pinwheel',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Top', dimension: '10" × 7"', widthRatio: 62, heightRatio: 45 },
      { id: 'p1', label: 'Right', dimension: '6" × 10"', widthRatio: 38, heightRatio: 62 },
      { id: 'p2', label: 'Bottom', dimension: '10" × 7"', widthRatio: 62, heightRatio: 45 },
      { id: 'p3', label: 'Left', dimension: '6" × 10"', widthRatio: 38, heightRatio: 55 }
    ]
  },
  {
    id: 'collage-sq-4p-grid',
    shapeId: 'shape-square',
    shapeName: 'Photo Collage',
    label: '4 Square Photo Collage',
    dimensionsSummary: '16" × 16"',
    widthInches: 16,
    heightInches: 16,
    acrylicPrice: 220.00,
    canvasPrice: 148.50,
    priceRange: '₹148.50 - ₹7,929.00',
    aspectRatio: 1.0,
    category: 'MULTI_PANEL',
    panelsCount: 4,
    pieceBreakdown: '4 Equal Square Photo Grid (2×2)',
    arrangement: 'collage-sq-4p-grid',
    diagramType: 'collage-sq-4p-grid',
    collageCategory: 'square',
    panels: [
      { id: 'p0', label: 'Photo 1', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p1', label: 'Photo 2', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p2', label: 'Photo 3', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 },
      { id: 'p3', label: 'Photo 4', dimension: '8" × 8"', widthRatio: 50, heightRatio: 50 }
    ]
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

// HEXAGON BUNDLE PRESETS — 15 Authentic Reference Layouts
export const HEXAGON_PRESETS: Array<Omit<SizeShapeOption, 'price'> & { acrylicPrice: number; canvasPrice: number }> = [
  {
    id: 'hex-horizontal-single',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints',
    dimensionsSummary: '10" × 8.5" (1 Hexagon)',
    widthInches: 10.0,
    heightInches: 8.5,
    acrylicPrice: 399.00,
    canvasPrice: 449.00,
    aspectRatio: 1.1765,
    category: 'SPECIAL',
    panelsCount: 1,
    pieceBreakdown: '1 Horizontal Hexagon Canvas Print (10" × 8.5")',
    arrangement: 'hex-horizontal-single',
    diagramType: 'hex-horizontal-single',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-vertical-single',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints',
    dimensionsSummary: '8.5" × 10" (1 Hexagon)',
    widthInches: 8.5,
    heightInches: 10.0,
    acrylicPrice: 399.00,
    canvasPrice: 449.00,
    aspectRatio: 0.85,
    category: 'SPECIAL',
    panelsCount: 1,
    pieceBreakdown: '1 Vertical Hexagon Canvas Print (8.5" × 10")',
    arrangement: 'hex-vertical-single',
    diagramType: 'hex-vertical-single',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-vertical-bundle-3',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints Bundle of 3',
    dimensionsSummary: '19" × 17.5" (3 Hexagons)',
    widthInches: 19.0,
    heightInches: 17.5,
    acrylicPrice: 1590.00,
    canvasPrice: 1782.00,
    aspectRatio: 1.0857,
    category: 'SPECIAL',
    panelsCount: 3,
    pieceBreakdown: '3-Piece Vertical Triangular Honeycomb Cluster (19" × 17.5")',
    arrangement: 'hex-vertical-bundle-3',
    diagramType: 'hex-vertical-bundle-3',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p1', label: 'Hexagon 2', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p2', label: 'Hexagon 3', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-3',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 3',
    dimensionsSummary: '27" × 13.75" (3 Hexagons)',
    widthInches: 27.0,
    heightInches: 13.75,
    acrylicPrice: 1590.00,
    canvasPrice: 1782.00,
    aspectRatio: 1.9636,
    category: 'SPECIAL',
    panelsCount: 3,
    pieceBreakdown: '3-Piece Horizontal Triangular Cluster (27" × 13.75")',
    arrangement: 'hex-horizontal-bundle-3',
    diagramType: 'hex-horizontal-bundle-3',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-3-alt',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 3 (Alternate)',
    dimensionsSummary: '18.5" × 19" (3 Hexagons)',
    widthInches: 18.5,
    heightInches: 19.0,
    acrylicPrice: 1590.00,
    canvasPrice: 1782.00,
    aspectRatio: 0.9737,
    category: 'SPECIAL',
    panelsCount: 3,
    pieceBreakdown: '3-Piece Right-Wing Honeycomb Arrangement (18.5" × 19")',
    arrangement: 'hex-horizontal-bundle-3-alt',
    diagramType: 'hex-horizontal-bundle-3-alt',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-4',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 4',
    dimensionsSummary: '27" × 19" (4 Hexagons)',
    widthInches: 27.0,
    heightInches: 19.0,
    acrylicPrice: 2090.00,
    canvasPrice: 2377.00,
    aspectRatio: 1.4211,
    category: 'SPECIAL',
    panelsCount: 4,
    pieceBreakdown: '4-Piece Diamond Honeycomb Cluster (27" × 19")',
    arrangement: 'hex-horizontal-bundle-4',
    diagramType: 'hex-horizontal-bundle-4',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-vertical-bundle-4',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints Bundle of 4',
    dimensionsSummary: '19" × 27" (4 Hexagons)',
    widthInches: 19.0,
    heightInches: 27.0,
    acrylicPrice: 2090.00,
    canvasPrice: 2377.00,
    aspectRatio: 0.7037,
    category: 'SPECIAL',
    panelsCount: 4,
    pieceBreakdown: '4-Piece Vertical Diamond Honeycomb Cluster (19" × 27")',
    arrangement: 'hex-vertical-bundle-4',
    diagramType: 'hex-vertical-bundle-4',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p1', label: 'Hexagon 2', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p2', label: 'Hexagon 3', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p3', label: 'Hexagon 4', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-5',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 5',
    dimensionsSummary: '27" × 19" (5 Hexagons)',
    widthInches: 27.0,
    heightInches: 19.0,
    acrylicPrice: 2590.00,
    canvasPrice: 2972.00,
    aspectRatio: 1.4211,
    category: 'SPECIAL',
    panelsCount: 5,
    pieceBreakdown: '5-Piece Center-Cross Honeycomb Display (27" × 19")',
    arrangement: 'hex-horizontal-bundle-5',
    diagramType: 'hex-horizontal-bundle-5',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p4', label: 'Hexagon 5', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-5-alt',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 5 (Alternate)',
    dimensionsSummary: '27" × 22.25" (5 Hexagons)',
    widthInches: 27.0,
    heightInches: 22.25,
    acrylicPrice: 2590.00,
    canvasPrice: 2972.00,
    aspectRatio: 1.2135,
    category: 'SPECIAL',
    panelsCount: 5,
    pieceBreakdown: '5-Piece U-Shape / Horseshoe Honeycomb Display (27" × 22.25")',
    arrangement: 'hex-horizontal-bundle-5-alt',
    diagramType: 'hex-horizontal-bundle-5-alt',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p4', label: 'Hexagon 5', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-7',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 7',
    dimensionsSummary: '27" × 27.5" (7 Hexagons)',
    widthInches: 27.0,
    heightInches: 27.5,
    acrylicPrice: 3690.00,
    canvasPrice: 4161.00,
    aspectRatio: 0.9818,
    category: 'SPECIAL',
    panelsCount: 7,
    pieceBreakdown: '7-Piece Flower Rosette Honeycomb Display (27" × 27.5")',
    arrangement: 'hex-horizontal-bundle-7',
    diagramType: 'hex-horizontal-bundle-7',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p4', label: 'Hexagon 5', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p5', label: 'Hexagon 6', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p6', label: 'Hexagon 7', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-vertical-bundle-7',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints Bundle of 7',
    dimensionsSummary: '29.5" × 27" (7 Hexagons)',
    widthInches: 29.5,
    heightInches: 27.0,
    acrylicPrice: 3690.00,
    canvasPrice: 4161.00,
    aspectRatio: 1.0926,
    category: 'SPECIAL',
    panelsCount: 7,
    pieceBreakdown: '7-Piece Vertical Rosette Honeycomb Display (29.5" × 27")',
    arrangement: 'hex-vertical-bundle-7',
    diagramType: 'hex-vertical-bundle-7',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p1', label: 'Hexagon 2', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p2', label: 'Hexagon 3', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p3', label: 'Hexagon 4', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p4', label: 'Hexagon 5', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p5', label: 'Hexagon 6', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p6', label: 'Hexagon 7', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-8',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 8',
    dimensionsSummary: '27" × 27.5" (8 Hexagons)',
    widthInches: 27.0,
    heightInches: 27.5,
    acrylicPrice: 4190.00,
    canvasPrice: 4756.00,
    aspectRatio: 0.9818,
    category: 'SPECIAL',
    panelsCount: 8,
    pieceBreakdown: '8-Piece 3-Column Honeycomb Display (27" × 27.5")',
    arrangement: 'hex-horizontal-bundle-8',
    diagramType: 'hex-horizontal-bundle-8',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p4', label: 'Hexagon 5', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p5', label: 'Hexagon 6', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p6', label: 'Hexagon 7', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p7', label: 'Hexagon 8', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
  {
    id: 'hex-vertical-bundle-8',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints Bundle of 8',
    dimensionsSummary: '29.5" × 27" (8 Hexagons)',
    widthInches: 29.5,
    heightInches: 27.0,
    acrylicPrice: 4190.00,
    canvasPrice: 4756.00,
    aspectRatio: 1.0926,
    category: 'SPECIAL',
    panelsCount: 8,
    pieceBreakdown: '8-Piece 3-Row Honeycomb Display (29.5" × 27")',
    arrangement: 'hex-vertical-bundle-8',
    diagramType: 'hex-vertical-bundle-8',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p1', label: 'Hexagon 2', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p2', label: 'Hexagon 3', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p3', label: 'Hexagon 4', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p4', label: 'Hexagon 5', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p5', label: 'Hexagon 6', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p6', label: 'Hexagon 7', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p7', label: 'Hexagon 8', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-vertical-bundle-10',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Vertical Hexagonal Prints Bundle of 10',
    dimensionsSummary: '40" × 27" (10 Hexagons)',
    widthInches: 40.0,
    heightInches: 27.0,
    acrylicPrice: 5190.00,
    canvasPrice: 5945.00,
    aspectRatio: 1.4815,
    category: 'SPECIAL',
    panelsCount: 10,
    pieceBreakdown: '10-Piece 3-Row Extended Honeycomb Display (40" × 27")',
    arrangement: 'hex-vertical-bundle-10',
    diagramType: 'hex-vertical-bundle-10',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p1', label: 'Hexagon 2', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p2', label: 'Hexagon 3', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p3', label: 'Hexagon 4', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p4', label: 'Hexagon 5', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p5', label: 'Hexagon 6', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p6', label: 'Hexagon 7', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p7', label: 'Hexagon 8', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p8', label: 'Hexagon 9', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
      { id: 'p9', label: 'Hexagon 10', dimension: '8.5" × 10"', widthRatio: 8.5, heightRatio: 10.0 },
    ]
  },
  {
    id: 'hex-horizontal-bundle-10',
    shapeId: 'shape-hexagon',
    shapeName: 'Hexagon',
    label: 'Horizontal Hexagonal Prints Bundle of 10',
    dimensionsSummary: '27" × 40" (10 Hexagons)',
    widthInches: 27.0,
    heightInches: 40.0,
    acrylicPrice: 5190.00,
    canvasPrice: 5945.00,
    aspectRatio: 0.675,
    category: 'SPECIAL',
    panelsCount: 10,
    pieceBreakdown: '10-Piece 3-Column Extended Honeycomb Display (27" × 40")',
    arrangement: 'hex-horizontal-bundle-10',
    diagramType: 'hex-horizontal-bundle-10',
    panels: [
      { id: 'p0', label: 'Hexagon 1', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p1', label: 'Hexagon 2', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p2', label: 'Hexagon 3', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p3', label: 'Hexagon 4', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p4', label: 'Hexagon 5', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p5', label: 'Hexagon 6', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p6', label: 'Hexagon 7', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p7', label: 'Hexagon 8', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p8', label: 'Hexagon 9', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
      { id: 'p9', label: 'Hexagon 10', dimension: '10" × 8.5"', widthRatio: 10.0, heightRatio: 8.5 },
    ]
  },
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
