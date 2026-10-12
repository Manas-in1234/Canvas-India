// ============================================================================
// CANVAS STYLE LANDING PAGES
// One entry per "Canvas" header dropdown item (excluding "Canvas Prints",
// which keeps its existing /canvas listing page). Every price and
// description here is pulled from real data already used elsewhere in the
// app (canvasCustomizerData.ts, popArtData.ts, lyricCanvasData.ts,
// storeData.ts). Every image was individually downloaded and visually
// inspected before use (see the earlier pass, which reused several
// Unsplash IDs purely by filename/context guessing and got many of them
// wrong — confetti, a ship painting, a tote bag, a yoga silhouette, etc.).
// Shapes and grid-style layouts (Shaped Canvas, Photo Collage, Photo
// Mosaic) use deterministic CSS/SVG `visual` mockups instead, which are
// correct by construction rather than relying on a stock photo matching.
// ============================================================================

import { CanvasStyleLandingData } from '../components/CanvasStyleLandingPage';

const u = (id: string, w: number = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`;

// Verified by actually downloading and viewing each one:
const PHOTO = {
  weddingCouple: u('1519741497674-611481863552'), // bride & groom with bouquet
  galleryWallViewer: u('1582555172866-f73bb12a2ab3'), // framed photo gallery wall, person viewing
  galleryWallFrames: u('1513519245088-0e12902e5a38'), // shelf gallery wall, many small frames
  livingRoomWallArt: u('1583847268964-b28dc8f51f92'), // living room sofa with 2 framed prints on wall
  resortPoolside: u('1566073771259-6a8506099945'), // hotel/resort pool deck
  paintTexture: u('1605721911519-3dfeb3be25e7'), // abstract painted canvas texture
  officeWorkspace: u('1497215728101-856f4ea42174'), // office desk with plants, city view
  officeHallway: u('1497366216548-37526070297c'), // office interior hallway
  weddingGalleryWall: '/assets/canvas-styles/wall-display-wedding-gallery.png', // user-supplied: 6-panel asymmetric wedding photo gallery over a sofa
  photoCollageGrid: '/assets/canvas-styles/photo-collage-6panel-baby.png', // user-supplied: 6-panel (3x2) baby photo collage canvas, angled room shot
  collageCluster: u('1541359927273-d76820fc43f9'), // cluster of photos/cards collaged on a wall
  collageFramedGrid: u('1670726113933-4bb3940deaf3'), // wall densely covered in framed photos
  collagePolaroids: u('1661009540506-e708c3288ec8') // polaroid photos strung up side by side
};

const STANDARD_FEATURES = [
  { icon: 'layers' as const, title: 'Premium Materials', desc: '380 GSM cotton canvas stretched on kiln-dried pine wood frames.' },
  { icon: 'sparkles' as const, title: 'Archival Inks', desc: '12-color fade-resistant pigment inks for vivid, long-lasting color.' },
  { icon: 'shield' as const, title: 'Built to Last', desc: 'Hand-inspected and quality-tested before it ever leaves our workshop.' },
  { icon: 'clock' as const, title: 'Ready to Hang', desc: 'Arrives with hardware pre-attached — no framing needed.' }
];

export const CANVAS_STYLE_LANDING_DATA: Record<string, CanvasStyleLandingData> = {
  'shaped-canvas-prints': {
    slug: 'shaped-canvas-prints',
    pageTitle: 'Shaped Canvas Prints',
    heroTitle: 'What are Shaped Canvas Prints?',
    heroSubtitle:
      'Custom cut round, oval, heart & geometric shapes. Each shape is stretched by hand over its own precision-milled wood frame for a clean, gallery-ready silhouette — no rectangle required.',
    stylesSectionTitle: 'Explore Our Shaped Canvas Styles',
    styles: [
      {
        id: 'canvas-round',
        number: '01',
        name: 'Round Canvas',
        description: 'Curved circular canvas stretched on a precision round wood stretcher — a soft, modern alternative to the classic rectangle.',
        price: 721.27,
        visual: 'shape-circle',
        customizeHref: '/customize/canvas/canvas-round'
      },
      {
        id: 'canvas-triangle',
        number: '02',
        name: 'Triangle Canvas',
        description: 'Geometric 3-sided triangle canvas for modern geometric wall galleries and asymmetric arrangements.',
        price: 1250.79,
        visual: 'shape-triangle',
        customizeHref: '/customize/canvas/canvas-triangle'
      },
      {
        id: 'canvas-heart',
        number: '03',
        name: 'Heart Canvas',
        description: 'Romantic heart-shaped canvas for wedding, couple, and family portraits — a thoughtful gift silhouette.',
        price: 1854.68,
        visual: 'shape-heart',
        customizeHref: '/customize/canvas/canvas-heart'
      },
      {
        id: 'canvas-oval',
        number: '04',
        name: 'Oval Canvas',
        description: 'Graceful elliptical canvas silhouette for timeless wall art and heirloom-style portraits.',
        price: 1380.67,
        visual: 'shape-oval',
        customizeHref: '/customize/canvas/canvas-oval'
      }
    ],
    galleryTitle: 'Shapes for every wall',
    galleryItems: [
      { label: 'Round', visual: 'shape-circle' },
      { label: 'Triangle', visual: 'shape-triangle' },
      { label: 'Heart', visual: 'shape-heart' },
      { label: 'Oval', visual: 'shape-oval' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'wall-display': {
    slug: 'wall-display',
    pageTitle: 'Wall Display',
    heroTitle: 'What is a Canvas Wall Display?',
    heroSubtitle:
      'Multi-frame canvas clusters & gallery wall arrangements. Several canvases are sized and spaced to work together as one striking focal point for your living room, hallway, or office.',
    stylesSectionTitle: 'Explore Our Wall Display Styles',
    styles: [
      {
        id: 'canvas-wall-art',
        number: '01',
        name: 'Asymmetric Gallery Wall Display',
        description: 'Varied-size panels arranged asymmetrically — a large central photo flanked by smaller accent panels — for a striking, editorial-style focal point above a sofa or bed.',
        price: 856.9,
        image: PHOTO.weddingGalleryWall,
        customizeHref: '/customize/canvas/canvas-wall-art'
      },
      {
        id: 'canvas-living-room-set',
        number: '02',
        name: 'Living Room Gallery Canvas Set (3 Panels)',
        description: 'Triptych 3-panel split wall art set for modern living rooms and master bedrooms.',
        price: 2299,
        image: PHOTO.livingRoomWallArt,
        customizeHref: '/customize/canvas/canvas-wall-art'
      }
    ],
    infoTitle: 'Choose Your Panel Count',
    infoSubtitle: 'Every layout below is a real configuration available in the customizer — pick one as a starting point, then fine-tune sizes and spacing to fit your wall.',
    infoItems: [
      { title: '3-Piece Gallery Display', desc: '(1) 12"×18" Tall + (2) 10"×8" Mini panels' },
      { title: '4-Piece Gallery Showcase', desc: '(1) 24"×16" + (1) 11"×17" + (2) 12"×8"' },
      { title: '5-Piece Stepped Pyramid', desc: '(2) 10"×8" + (2) 14"×11" + (1) 20"×16"' },
      { title: '6-Piece Panoramic Horizon', desc: '(1) 10"×10" + (1) 18"×12" + (1) 28"×18" + (2) 11"×16" + (1) 10"×12"' },
      { title: '7-Piece Centerpiece Halo', desc: '(1) 26"×26" + (6) 8"×8" Mini Panels' },
      { title: '9-Piece Ennead Matrix', desc: '(9) 12"×12" Equal Squares in a 3×3 Grid' },
      { title: '10-Piece Pantheon Gallery Wall', desc: '(1) 24"×32" + (2) 16"×20" + (2) 12"×16" + (2) 10"×12" + (3) 8"×10"' }
    ],
    galleryTitle: 'Arrangements for every room',
    galleryItems: [
      { label: '3-Panel Set', visual: 'gallery-wall' },
      { label: 'Asymmetric Wedding Wall', image: PHOTO.weddingGalleryWall },
      { label: 'Gallery Cluster', image: PHOTO.galleryWallFrames },
      { label: 'Living Room', image: PHOTO.livingRoomWallArt }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'photo-collage': {
    slug: 'photo-collage',
    pageTitle: 'Photo Collage',
    heroTitle: 'What is a Canvas Photo Collage?',
    heroSubtitle:
      'Multi-photo grid layout canvas displays. Arrange several of your favorite memories into one cohesive canvas, printed as a single gallery-wrapped piece.',
    stylesSectionTitle: 'Explore Our Photo Collage Styles',
    styles: [
      {
        id: 'canvas-collage',
        number: '01',
        name: '6 Landscape Photo Collage',
        description: '6-Photo Grid (3 Columns × 2 Rows) — six of your favorite moments arranged edge-to-edge on a single gallery-wrapped canvas.',
        price: 148.5,
        image: PHOTO.photoCollageGrid,
        customizeHref: '/customize/canvas/canvas-collage'
      }
    ],
    infoTitle: 'Explore Our Collage Layouts',
    infoSubtitle: '28 real layouts across Landscape, Panoramic, Portrait and Square orientations — all available directly in the customizer.',
    infoItems: [
      { title: '2 Landscape Photo Collage', desc: '2 Equal Side-by-Side Vertical Photo Panels' },
      { title: '3 Landscape Photo Collage', desc: '2 Stacked Photos on Left + 1 Tall Photo on Right' },
      { title: '5 Landscape Photo Collage', desc: '5-Photo Pinwheel Collage with Center Focus' },
      { title: '6 Landscape Photo Collage', desc: '6-Photo Grid (3 Columns × 2 Rows)' },
      { title: '9 Landscape Photo Collage', desc: 'Center Feature Photo surrounded by 8 Border Photos' },
      { title: 'Square & Portrait Collages', desc: 'Matching grid, pinwheel and feature layouts sized for square and portrait walls too' }
    ],
    tipsTitle: 'How to Choose Photos for Your Collage',
    tipsSubtitle: 'A few tips from photo printing guides worth following before you upload.',
    tipsItems: [
      { title: 'Pick a unifying theme', desc: 'A family collection, a trip, or a single occasion gives the collage a clear story instead of a random mix of photos.' },
      { title: 'Use high-resolution images', desc: 'Low-resolution or blurry shots look pixelated once enlarged onto canvas — start with your sharpest, best-lit photos.' },
      { title: 'Vary the orientation and size', desc: 'Mixing landscape, portrait, and close-up shots keeps a grid from feeling repetitive — pick the layout first, then slot photos in.' },
      { title: 'Coordinate color and mood', desc: 'Photos that share a similar color palette or tone (or deliberately contrast) tie the whole piece together visually.' }
    ],
    galleryTitle: 'Layouts for every memory',
    galleryItems: [
      { label: '6-Photo Grid', image: PHOTO.photoCollageGrid },
      { label: 'Cluster Collage', image: PHOTO.collageCluster },
      { label: 'Framed Grid Wall', image: PHOTO.collageFramedGrid },
      { label: 'Polaroid Strip', image: PHOTO.collagePolaroids }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'photo-mosaic': {
    slug: 'photo-mosaic',
    pageTitle: 'Photo Mosaic',
    heroTitle: 'What is a Canvas Photo Mosaic?',
    heroSubtitle:
      'A mosaic grid created from hundreds of micro photos. Dozens of your smaller photographs are blended together into one intricate large-scale artwork.',
    stylesSectionTitle: 'Explore Our Photo Mosaic Styles',
    styles: [
      {
        id: 'canvas-mosaic',
        number: '01',
        name: 'Photo Mosaic',
        description: 'Intricate mosaic grid pattern blending dozens of micro photos into one artwork — ideal for anniversaries, reunions, and tributes.',
        price: 148.5,
        visual: 'mosaic-grid',
        customizeHref: '/customize/canvas/canvas-mosaic'
      }
    ],
    galleryTitle: 'Occasions people love',
    galleryItems: [
      { label: 'Anniversary', visual: 'mosaic-grid' },
      { label: 'Family Reunion', visual: 'mosaic-grid' },
      { label: 'Memorial Tribute', visual: 'mosaic-grid' },
      { label: 'Team Photo', visual: 'mosaic-grid' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'pop-art': {
    slug: 'pop-art',
    pageTitle: 'Pop Art',
    heroTitle: 'What is Pop Art?',
    heroSubtitle:
      'A celebration of everyday life and popular culture, using bold outlines, vibrant colors, and iconic patterns. Our digital artists transform your ordinary photos into stunning custom artworks inspired by this famous movement.',
    stylesSectionTitle: 'Explore Our Pop Art Styles',
    styles: [
      {
        id: 'andy-warhol',
        number: '01',
        name: 'Andy-Warhol',
        description: 'Iconic 4-quadrant screenprint Pop Art with contrasting vibrant pop palettes across four quadrants.',
        price: 499,
        image: '/assets/pop-art/andy-warhol.svg',
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'caricatures',
        number: '02',
        name: 'Caricatures',
        description: 'Playful cartoon caricature styling with bold hand-drawn contours, comic cel shading, and warm tones.',
        price: 599,
        image: '/assets/pop-art/caricatures.svg',
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'lichtenstein',
        number: '03',
        name: 'Lichtenstein',
        description: 'Roy Lichtenstein comic strip pop art featuring Ben-Day halftone dots, ink contours, and primary comic colors.',
        price: 499,
        image: '/assets/pop-art/lichtenstein.svg',
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'pixel-painting',
        number: '04',
        name: 'Pixel Painting',
        description: 'Retro 8-bit digital pixel art mosaic transformation preserving facial likeness with sharp mosaic tiles.',
        price: 1750,
        image: '/assets/pop-art/pixel-painting.svg',
        customizeHref: '/customize/canvas/canvas-pop-art'
      }
    ],
    galleryTitle: 'Vibrant styles for everyone',
    galleryItems: [
      { label: 'Glo-Portrait', image: '/assets/pop-art/glo-portrait.svg' },
      { label: 'Coca Cola', image: '/assets/pop-art/coca-cola1.svg' },
      { label: 'Marilyn', image: '/assets/pop-art/marilyn1.svg' },
      { label: 'Che', image: '/assets/pop-art/che1.svg' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'lyrics-on-canvas': {
    slug: 'lyrics-on-canvas',
    pageTitle: 'Lyrics on Canvas',
    heroTitle: 'What is Lyrics on Canvas?',
    heroSubtitle:
      'Song lyrics, wedding vows & custom typography art. Pair your favorite photo with the lyrics, vows, or quote that means the most — rendered in elegant custom typography.',
    stylesSectionTitle: 'Explore Our Lyric Canvas Styles',
    styles: [
      {
        id: 'wedding-song-lyrics',
        number: '01',
        name: 'Personalized Wedding Picture Canvas with Song Lyrics',
        description: 'Cherish your wedding moments with flowing romantic song lyrics softly layered over your couple portrait.',
        price: 1498.5,
        image: '/assets/lyric-canvas/wedding-song-lyrics.svg',
        customizeHref: '/customize/canvas/canvas-lyric'
      },
      {
        id: 'wedding-first-dance',
        number: '02',
        name: 'Wedding First Dance Song Lyrics',
        description: 'Capture the magic of your first dance with romantic song lyrics framed in a modern frosted plaque.',
        price: 1498.5,
        image: '/assets/lyric-canvas/wedding-first-dance.svg',
        customizeHref: '/customize/canvas/canvas-lyric'
      },
      {
        id: 'wedding-vows-wall-art',
        number: '03',
        name: 'Turn Wedding Vows into Wall Art',
        description: 'Timeless split canvas layout featuring your wedding ceremony photo paired with your personal vows.',
        price: 1498.5,
        image: '/assets/lyric-canvas/wedding-vows-wall-art.svg',
        customizeHref: '/customize/canvas/canvas-lyric'
      },
      {
        id: 'sheet-music-wall-art',
        number: '04',
        name: 'Sheet Music Canvas Print',
        description: 'Vintage stave, clef and musical notes canvas background paired with your song title, couple names, and lyrics.',
        price: 1498.5,
        image: '/assets/lyric-canvas/sheet-music-wall-art.svg',
        customizeHref: '/customize/canvas/canvas-lyric'
      }
    ],
    galleryTitle: 'A template for every milestone',
    galleryItems: [
      { label: 'Weddings', image: '/assets/lyric-canvas/wedding-vows-canvas.svg' },
      { label: 'Anniversaries', image: '/assets/lyric-canvas/first-anniversary-gift.svg' },
      { label: 'Couples', image: '/assets/lyric-canvas/couples-personalized-art.svg' },
      { label: 'Forever Young', image: '/assets/lyric-canvas/forever-young-lyrics.svg' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'panoramic-canvas-prints': {
    slug: 'panoramic-canvas-prints',
    pageTitle: 'Panoramic Canvas Prints',
    heroTitle: 'What are Panoramic Canvas Prints?',
    heroSubtitle:
      'Wide aspect landscape & horizon photo prints. Your widest, most sweeping shots — weddings, skylines, landscapes — printed across an extra-long canvas built for impact.',
    stylesSectionTitle: 'Explore Our Panoramic Canvas Styles',
    styles: [
      {
        id: 'canvas-wedding-panoramic',
        number: '01',
        name: 'Grand Panoramic Wedding Canvas',
        description: 'Wide panoramic wedding ceremony memories printed on fine archival cotton weave.',
        price: 2799,
        image: PHOTO.weddingCouple,
        customizeHref: '/customize/canvas/canvas-split'
      }
    ],
    galleryTitle: 'Moments wide enough to fill a wall',
    galleryItems: [
      { label: 'Weddings', image: PHOTO.weddingCouple },
      { label: 'Skylines', icon: 'mountain' },
      { label: 'Landscapes', icon: 'mountain' },
      { label: 'Group Shots', icon: 'users' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'split-canvas-prints': {
    slug: 'split-canvas-prints',
    pageTitle: 'Split Canvas Prints',
    heroTitle: 'What are Split Canvas Prints?',
    heroSubtitle:
      'Multi-panel triptych & 3-to-5 piece canvas sets. One photo, seamlessly split across separate canvas panels for a dramatic, gallery-style centerpiece.',
    stylesSectionTitle: 'Explore Our Split Canvas Styles',
    styles: [
      {
        id: 'canvas-split',
        number: '01',
        name: 'Split Canvas (Triptych)',
        description: 'Panoramic photo split seamlessly across 3 triptych canvas panels.',
        price: 188.1,
        icon: 'columns',
        customizeHref: '/customize/canvas/canvas-split'
      },
      {
        id: 'canvas-split-panel',
        number: '02',
        name: '5-Panel Panoramic Landscape Canvas',
        description: 'Dramatic multi-tier 5-piece split canvas centerpiece for spacious living and dining halls.',
        price: 3499,
        icon: 'mountain',
        customizeHref: '/customize/canvas/canvas-split'
      }
    ],
    galleryTitle: 'Panel counts for every wall',
    galleryItems: [
      { label: '3 Panels', icon: 'columns' },
      { label: '5 Panels', icon: 'columns' },
      { label: 'Landscape', icon: 'mountain' },
      { label: 'Portrait', icon: 'frame' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'hexagon-canvas': {
    slug: 'hexagon-canvas',
    pageTitle: 'Hexagon Canvas',
    heroTitle: 'What is Hexagon Canvas?',
    heroSubtitle:
      'Honeycomb geometric multi-canvas clusters. Six-sided canvas prints that interlock into a modern honeycomb arrangement on your wall.',
    stylesSectionTitle: 'Explore Our Hexagon Canvas Styles',
    styles: [
      {
        id: 'canvas-hexagon',
        number: '01',
        name: 'Hexagon Prints',
        description: 'Geometric 6-sided honeycomb canvas prints for modular wall clusters.',
        price: 449,
        icon: 'hexagon',
        customizeHref: '/customize/canvas/canvas-hexagon'
      }
    ],
    galleryTitle: 'Cluster ideas',
    galleryItems: [
      { label: 'Single Hexagon', icon: 'hexagon' },
      { label: 'Honeycomb Cluster', icon: 'hexagon' },
      { label: 'Mixed Grid', visual: 'mosaic-grid' },
      { label: 'Office Wall', image: PHOTO.officeHallway }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'wholesale-canvas-prints': {
    slug: 'wholesale-canvas-prints',
    pageTitle: 'Wholesale Canvas Prints',
    heroTitle: 'What is Wholesale Canvas Printing?',
    heroSubtitle:
      'Bulk printing for artists, studios & interior designers. Tiered pricing for 20+ units with official GST invoicing — built for galleries, decorators, and resellers who order in volume.',
    stylesSectionTitle: 'How Wholesale Pricing Works',
    styles: [
      {
        id: 'bulk-order',
        number: '01',
        name: 'Tiered Wholesale Pricing',
        description: 'Tiered wholesale pricing for 20+ units with official GST invoicing and 18% input tax credit — request a custom quote for your order volume.',
        price: 0,
        image: PHOTO.galleryWallViewer,
        customizeHref: '/bulk-order'
      }
    ],
    galleryTitle: 'Who orders wholesale with us',
    galleryItems: [
      { label: 'Artists & Studios', image: PHOTO.paintTexture },
      { label: 'Interior Designers', image: PHOTO.livingRoomWallArt },
      { label: 'Hotels & Resorts', image: PHOTO.resortPoolside },
      { label: 'Corporate Offices', image: PHOTO.officeWorkspace }
    ],
    featuresTitle: 'Why order wholesale with us',
    features: [
      { icon: 'layers' as const, title: 'Volume Pricing', desc: 'Tiered discounts that scale with order size, starting at 20 units.' },
      { icon: 'shield' as const, title: 'GST Invoicing', desc: 'Official tax invoices with 18% input tax credit for your business.' },
      { icon: 'sparkles' as const, title: 'Consistent Quality', desc: 'Every piece in your order held to the same archival print standard.' },
      { icon: 'clock' as const, title: 'Dedicated Support', desc: 'A quote and production timeline tailored to your order.' }
    ]
  },

  'custom-caricature': {
    slug: 'custom-caricature',
    pageTitle: 'Custom Caricature',
    heroTitle: 'What is a Custom Caricature?',
    heroSubtitle:
      'Digital caricature portraits printed on canvas. Our digital artists turn your photo into a playful, exaggerated hand-drawn-style portrait, then print it on gallery-wrapped canvas.',
    stylesSectionTitle: 'Explore Our Caricature Style',
    styles: [
      {
        id: 'caricatures',
        number: '01',
        name: 'Caricatures',
        description: 'Playful cartoon caricature styling with bold hand-drawn contours, comic cel shading, and warm tones.',
        price: 599,
        image: '/assets/pop-art/caricatures.svg',
        customizeHref: '/customize/canvas/canvas-pop-art'
      }
    ],
    galleryTitle: 'Great for any occasion',
    galleryItems: [
      { label: 'Solo Portraits', icon: 'users' },
      { label: 'Couples', icon: 'heart' },
      { label: 'Family', icon: 'images' },
      { label: 'Pets', icon: 'paw' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  },

  'canvas-banner': {
    slug: 'canvas-banner',
    pageTitle: 'Canvas Banner',
    heroTitle: 'What is a Canvas Banner?',
    heroSubtitle:
      'Heavyweight cotton canvas hanging scroll banners. A rustic, fabric alternative to a framed print — finished with solid wood rails and a twine cord, ready to hang.',
    stylesSectionTitle: 'Explore Our Canvas Banner Styles',
    styles: [
      {
        id: 'canvas-banner',
        number: '01',
        name: 'Hanging Canvas Banner',
        description: 'Hanging fabric canvas banner with solid wood rails and rustic twine cord for wall hanging.',
        price: 399,
        icon: 'scroll',
        customizeHref: '/customize/canvas/canvas-banner'
      }
    ],
    galleryTitle: 'Finish options',
    galleryItems: [
      { label: 'Grommets', icon: 'scroll' },
      { label: 'Pole Pockets', icon: 'scroll' },
      { label: 'Wood Rails', icon: 'scroll' },
      { label: 'Twine Hanging', icon: 'scroll' }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  }
};

export function getCanvasStyleLandingData(slug: string): CanvasStyleLandingData | undefined {
  return CANVAS_STYLE_LANDING_DATA[slug];
}
