// ============================================================================
// CANVAS STYLE LANDING PAGES
// One entry per "Canvas" header dropdown item (excluding "Canvas Prints",
// which keeps its existing /canvas listing page). Every price and
// description here is pulled from real data already used elsewhere in the
// app (canvasCustomizerData.ts, popArtData.ts, lyricCanvasData.ts,
// storeData.ts). Every image is either real local artwork (Pop Art, Lyrics
// on Canvas) or one of the Unsplash photo IDs already live on this site
// today (storeData.ts product cards and mega-menu promos) — reused here
// rather than fabricating new, unverified photo URLs.
// ============================================================================

import { CanvasStyleLandingData } from '../components/CanvasStyleLandingPage';

// Unsplash photo IDs already confirmed live elsewhere in this codebase
// (src/data/storeData.ts product cards and MEGA_MENUS_DATA promo images).
const u = (id: string, w: number = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=80`;

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
        image: u('1513519245088-0e12902e5a38'),
        customizeHref: '/customize/canvas/canvas-round'
      },
      {
        id: 'canvas-triangle',
        number: '02',
        name: 'Triangle Canvas',
        description: 'Geometric 3-sided triangle canvas for modern geometric wall galleries and asymmetric arrangements.',
        price: 1250.79,
        image: u('1526738549149-8e07eca6c147'),
        customizeHref: '/customize/canvas/canvas-triangle'
      },
      {
        id: 'canvas-heart',
        number: '03',
        name: 'Heart Canvas',
        description: 'Romantic heart-shaped canvas for wedding, couple, and family portraits — a thoughtful gift silhouette.',
        price: 1854.68,
        image: u('1582561424760-0321d75e81fa'),
        customizeHref: '/customize/canvas/canvas-heart'
      },
      {
        id: 'canvas-oval',
        number: '04',
        name: 'Oval Canvas',
        description: 'Graceful elliptical canvas silhouette for timeless wall art and heirloom-style portraits.',
        price: 1380.67,
        image: u('1515934751635-c81c6bc9a2d8'),
        customizeHref: '/customize/canvas/canvas-oval'
      }
    ],
    galleryTitle: 'Shapes for every wall',
    galleryItems: [
      { label: 'Round', image: u('1513519245088-0e12902e5a38', 400) },
      { label: 'Triangle', image: u('1526738549149-8e07eca6c147', 400) },
      { label: 'Heart', image: u('1582561424760-0321d75e81fa', 400) },
      { label: 'Oval', image: u('1515934751635-c81c6bc9a2d8', 400) }
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
        name: 'Gallery Wall Display',
        description: 'Multi-panel gallery wall display for striking home and office focal points — fully customizable panel count and layout.',
        price: 856.9,
        image: u('1549465220-1a8b9238cd48'),
        customizeHref: '/customize/canvas/canvas-wall-art'
      },
      {
        id: 'canvas-living-room-set',
        number: '02',
        name: 'Living Room Gallery Canvas Set (3 Panels)',
        description: 'Triptych 3-panel split wall art set for modern living rooms and master bedrooms.',
        price: 2299,
        image: u('1544816155-12df9643f363'),
        customizeHref: '/customize/canvas/canvas-wall-art'
      }
    ],
    galleryTitle: 'Arrangements for every room',
    galleryItems: [
      { label: '3-Panel Set', image: u('1544816155-12df9643f363', 400) },
      { label: '4-Panel Grid', image: u('1549465220-1a8b9238cd48', 400) },
      { label: 'Gallery Cluster', image: u('1577083552431-6e5fd01aa342', 400) },
      { label: 'Living Room', image: u('1524758631624-e2822e304c36', 400) }
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
        name: 'Wall Collage Set (3 Panels)',
        description: 'Three coordinated canvas panels designed to transform living rooms and hallways — pick from grid, mosaic, or freeform layouts.',
        price: 2199,
        image: u('1544816155-12df9643f363'),
        customizeHref: '/customize/canvas/canvas-collage'
      }
    ],
    galleryTitle: 'Layouts for every memory',
    galleryItems: [
      { label: '4-Photo Grid', image: u('1586075010923-2dd4570fb338', 400) },
      { label: 'Family Collage', image: u('1582561424760-0321d75e81fa', 400) },
      { label: 'Travel Memories', image: u('1519741497674-611481863552', 400) },
      { label: 'Milestones', image: u('1549465220-1a8b9238cd48', 400) }
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
        image: u('1524758631624-e2822e304c36'),
        customizeHref: '/customize/canvas/canvas-mosaic'
      }
    ],
    galleryTitle: 'Occasions people love',
    galleryItems: [
      { label: 'Anniversary', image: u('1582561424760-0321d75e81fa', 400) },
      { label: 'Family Reunion', image: u('1586075010923-2dd4570fb338', 400) },
      { label: 'Memorial Tribute', image: u('1549465220-1a8b9238cd48', 400) },
      { label: 'Team Photo', image: u('1441986300917-64674bd600d8', 400) }
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
        image: u('1519741497674-611481863552'),
        customizeHref: '/customize/canvas/canvas-split'
      }
    ],
    galleryTitle: 'Moments wide enough to fill a wall',
    galleryItems: [
      { label: 'Weddings', image: u('1519741497674-611481863552', 400) },
      { label: 'Skylines', image: u('1513151233558-d860c5398176', 400) },
      { label: 'Landscapes', image: u('1577083552431-6e5fd01aa342', 400) },
      { label: 'Group Shots', image: u('1497215728101-856f4ea42174', 400) }
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
        image: u('1497215728101-856f4ea42174'),
        customizeHref: '/customize/canvas/canvas-split'
      },
      {
        id: 'canvas-split-panel',
        number: '02',
        name: '5-Panel Panoramic Landscape Canvas',
        description: 'Dramatic multi-tier 5-piece split canvas centerpiece for spacious living and dining halls.',
        price: 3499,
        image: u('1577083552431-6e5fd01aa342'),
        customizeHref: '/customize/canvas/canvas-split'
      }
    ],
    galleryTitle: 'Panel counts for every wall',
    galleryItems: [
      { label: '3 Panels', image: u('1497215728101-856f4ea42174', 400) },
      { label: '5 Panels', image: u('1577083552431-6e5fd01aa342', 400) },
      { label: 'Landscape', image: u('1513151233558-d860c5398176', 400) },
      { label: 'Portrait', image: u('1582561424760-0321d75e81fa', 400) }
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
        image: u('1544367567-0f2fcb009e0b'),
        customizeHref: '/customize/canvas/canvas-hexagon'
      }
    ],
    galleryTitle: 'Cluster ideas',
    galleryItems: [
      { label: 'Single Hexagon', image: u('1544367567-0f2fcb009e0b', 400) },
      { label: 'Honeycomb Cluster', image: u('1513201099705-a9746e1e201f', 400) },
      { label: 'Mixed Grid', image: u('1586075010923-2dd4570fb338', 400) },
      { label: 'Office Wall', image: u('1497366216548-37526070297c', 400) }
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
        image: u('1582555172866-f73bb12a2ab3'),
        customizeHref: '/bulk-order'
      }
    ],
    galleryTitle: 'Who orders wholesale with us',
    galleryItems: [
      { label: 'Artists & Studios', image: u('1518199266791-5375a83190b7', 400) },
      { label: 'Interior Designers', image: u('1549465220-1a8b9238cd48', 400) },
      { label: 'Hotels & Resorts', image: u('1583847268964-b28dc8f51f92', 400) },
      { label: 'Corporate Offices', image: u('1497215728101-856f4ea42174', 400) }
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
      { label: 'Solo Portraits', image: u('1534447677768-be436bb09401', 400) },
      { label: 'Couples', image: u('1582561424760-0321d75e81fa', 400) },
      { label: 'Family', image: u('1586075010923-2dd4570fb338', 400) },
      { label: 'Pets', image: u('1526738549149-8e07eca6c147', 400) }
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
        image: u('1517248135467-4c7edcad34c4'),
        customizeHref: '/customize/canvas/canvas-banner'
      }
    ],
    galleryTitle: 'Finish options',
    galleryItems: [
      { label: 'Grommets', image: u('1566073771259-6a8506099945', 400) },
      { label: 'Pole Pockets', image: u('1605721911519-3dfeb3be25e7', 400) },
      { label: 'Wood Rails', image: u('1507646227500-4d389b0012be', 400) },
      { label: 'Twine Hanging', image: u('1517248135467-4c7edcad34c4', 400) }
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  }
};

export function getCanvasStyleLandingData(slug: string): CanvasStyleLandingData | undefined {
  return CANVAS_STYLE_LANDING_DATA[slug];
}
