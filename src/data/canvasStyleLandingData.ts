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
  collageCluster: u('1541359927273-d76820fc43f9'), // verified: cluster of photos/cards collaged on a wall
  photoCollage2Panel: '/assets/canvas-styles/photo-collage-2panel-couple.png', // user-supplied: 2 photos side-by-side, framed, "Sarah & Marc"
  photoCollage3Panel: '/assets/canvas-styles/photo-collage-3panel-family.png', // user-supplied: 2 stacked (dog, baby) left + 1 tall (family) right, framed
  photoCollage5Panel: '/assets/canvas-styles/photo-collage-5panel-wedding.png', // user-supplied: 5-photo wedding pinwheel collage
  photoCollage9Panel: '/assets/canvas-styles/photo-collage-9panel-landscape.png', // user-supplied: 3x3 grid of 9 landscape photos
  shapedCanvasRound: '/assets/canvas-styles/shaped-canvas-round.png', // user-supplied: round painted sunset lake landscape
  shapedCanvasTriangle: '/assets/canvas-styles/shaped-canvas-triangle.png', // user-supplied: triangle painted figure-in-doorway scene
  shapedCanvasHeart: '/assets/canvas-styles/shaped-canvas-heart.png', // user-supplied: heart-shaped painted island sunset
  shapedCanvasOval: '/assets/canvas-styles/shaped-canvas-oval.png', // user-supplied: oval painted tulips
  photoMosaicEye: '/assets/canvas-styles/photo-mosaic-eye.png', // user-supplied: tile-mosaic close-up of an eye
  photoMosaicPhoenix: '/assets/canvas-styles/photo-mosaic-phoenix.png', // user-supplied: tile-mosaic phoenix/sunrise bird design
  photoMosaicFace: '/assets/canvas-styles/photo-mosaic-face.png', // user-supplied: tile-mosaic sleeping face with spiral hair
  photoMosaicBirdhouse: '/assets/canvas-styles/photo-mosaic-birdhouse.png', // user-supplied: tile-mosaic birdhouse with two birds
  photoMosaicParrots: '/assets/canvas-styles/photo-mosaic-parrots.png', // user-supplied: round tile-mosaic of two parrots
  popArtWarholZebra: '/assets/canvas-styles/pop-art-warhol-zebra.png', // user-supplied: Warhol-style zebra painting
  popArtCaricature: '/assets/canvas-styles/pop-art-caricature-takeabreak.png', // user-supplied: illustrated "Take a Break" portrait
  popArtLichtenstein: '/assets/canvas-styles/pop-art-lichtenstein-crying.png', // user-supplied: Lichtenstein-style crying girl
  popArtPixel: '/assets/canvas-styles/pop-art-pixel-mario.png' // user-supplied: pixel-art Mario painting
};

// The customizer's real tab order is Upload -> Size/Layout -> Wrap & Border
// -> Hardware & Finish -> Room View preview & checkout (see ToolbarTab /
// toolbarItems in CanvasCustomizerPage.tsx). Step 2 is the only one that
// genuinely differs per product category; steps 1, 3-5 are identical for
// every upload-capable product, so they're built once here.
const buildCustomizeSteps = (step2: { title: string; desc: string }) => [
  {
    icon: 'upload' as const,
    title: 'Upload Your Photo(s)',
    desc: 'Upload high-resolution photos straight from your device, or scan the QR code to send them from your phone — no app needed.'
  },
  { icon: 'grid' as const, ...step2 },
  {
    icon: 'crop' as const,
    title: 'Choose Your Wrap & Border',
    desc: 'Pick a full-bleed wrap, mirrored edge, or a solid color border to finish the sides of your canvas exactly how you like.'
  },
  {
    icon: 'sliders' as const,
    title: 'Select Hardware & Finish',
    desc: 'Choose your canvas thickness and hanging hardware — every piece ships ready to hang, no extra tools needed.'
  },
  {
    icon: 'eye' as const,
    title: 'Preview & Order',
    desc: "See exactly how it'll look on your wall with our live Room View preview, then add it to your cart and check out."
  }
];

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
    stepsTitle: 'How to Customize Your Shaped Canvas',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Shape & Size',
      desc: 'Choose round, triangle, heart, or oval, then select the exact size for your wall.'
    }),
    styles: [
      {
        id: 'canvas-round',
        number: '01',
        name: 'Round Canvas',
        description: 'Curved circular canvas stretched on a precision round wood stretcher — a soft, modern alternative to the classic rectangle.',
        price: 721.27,
        image: PHOTO.shapedCanvasRound,
        customizeHref: '/customize/canvas/canvas-round'
      },
      {
        id: 'canvas-triangle',
        number: '02',
        name: 'Triangle Canvas',
        description: 'Geometric 3-sided triangle canvas for modern geometric wall galleries and asymmetric arrangements.',
        price: 1250.79,
        image: PHOTO.shapedCanvasTriangle,
        customizeHref: '/customize/canvas/canvas-triangle'
      },
      {
        id: 'canvas-heart',
        number: '03',
        name: 'Heart Canvas',
        description: 'Romantic heart-shaped canvas for wedding, couple, and family portraits — a thoughtful gift silhouette.',
        price: 1854.68,
        image: PHOTO.shapedCanvasHeart,
        customizeHref: '/customize/canvas/canvas-heart'
      },
      {
        id: 'canvas-oval',
        number: '04',
        name: 'Oval Canvas',
        description: 'Graceful elliptical canvas silhouette for timeless wall art and heirloom-style portraits.',
        price: 1380.67,
        image: PHOTO.shapedCanvasOval,
        customizeHref: '/customize/canvas/canvas-oval'
      }
    ],
    galleryTitle: 'Shapes for every wall',
    galleryItems: [
      { label: 'Round', image: PHOTO.shapedCanvasRound },
      { label: 'Triangle', image: PHOTO.shapedCanvasTriangle },
      { label: 'Heart', image: PHOTO.shapedCanvasHeart },
      { label: 'Oval', image: PHOTO.shapedCanvasOval }
    ],
    historyTitle: 'The History of Shaped Canvas',
    historyParagraphs: [
      'Painting on a non-rectangular surface is older than it looks. Renaissance masters like Raphael, Michelangelo, and Botticelli painted on round wooden panels called tondos, breaking from the standard rectangle centuries before it became a modern art movement.',
      'The shaped canvas as we know it took shape in the 20th century. Sculptor Peter László Péri made polychromatic cut-out paintings in the early 1920s, and Uruguayan artist Rhod Rothfuss began his "marco irregular" (irregular frame) paintings in 1942, publishing an influential essay on the subject two years later.',
      'By the 1960s, shaped canvases had become, in critic Frances Colpitt\'s words, "the dominant form of abstract painting" of the decade. Frank Stella, Kenneth Noland, and Ellsworth Kelly all worked in the form, and in 1964 the Solomon R. Guggenheim Museum staged a dedicated exhibition, The Shaped Canvas, cementing it as a serious artistic statement rather than a novelty.'
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
    stepsTitle: 'How to Customize Your Wall Display',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Panel Layout',
      desc: 'Choose from 3 to 10-piece gallery arrangements, then fine-tune individual panel sizes.'
    }),
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
        visual: 'gallery-wall',
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
    historyTitle: 'The History of the Gallery Wall',
    historyParagraphs: [
      'The densely packed "gallery wall" look has a specific birthplace: the Paris Salon. Starting in 1667, the French Royal Academy\'s annual exhibition accepted far more paintings than its walls could reasonably hold, so organizers covered every inch, floor to ceiling, with almost no regard for matching styles or subjects.',
      'This "salon-style hang" had its own hierarchy — the most prized works hung "on the line," at eye level, while lesser pieces were pushed toward the ceiling or the floor. London\'s Royal Academy adopted the same crowded hanging style soon after.',
      'The look eventually left the gallery altogether. What was once a practical solution to too many paintings and too little wall space became, centuries later, a deliberate decorating style — the modern "gallery wall," named directly after the French salons that started it.'
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
    stepsTitle: 'How to Customize Your Photo Collage',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Collage Grid',
      desc: 'Choose from 2 to 9-photo layouts — grid, pinwheel, or feature style — then slot in your photos.'
    }),
    storyTitle: 'A Collection of Memories on One Canvas',
    storyParagraphs: [
      "The beauty of a photo collage canvas is simple — it keeps your most treasured pictures together, in one place, on one wall. At Canvas India, turning a handful of favorite moments into a single piece of art takes just a few minutes.",
      "Upload your photos, choose the grid that fits your story — from a clean 2-photo pairing to a 9-photo feature wall — and preview exactly how it will look before you order. No design experience needed.",
      "Pick your size and finish and we'll print it on gallery-wrapped canvas and have it at your door. Whether it's a birthday gift, a family milestone, or a wall that's been bare too long, a photo collage turns scattered memories into one lasting piece of home decor."
    ],
    storyImage: PHOTO.collageCluster,
    styles: [
      {
        id: 'canvas-collage',
        number: '01',
        name: '6 Landscape Photo Collage',
        description: '6-Photo Grid (3 Columns × 2 Rows) — six of your favorite moments arranged edge-to-edge on a single gallery-wrapped canvas.',
        price: 148.5,
        image: PHOTO.photoCollageGrid,
        customizeHref: '/customize/canvas/canvas-collage?layout=collage-land-6p-grid'
      },
      {
        id: 'collage-land-2p-split',
        number: '02',
        name: '2 Landscape Photo Collage',
        description: '2 Equal Side-by-Side Vertical Photo Panels — a simple, clean pairing that works well in smaller spaces.',
        price: 148.5,
        image: PHOTO.photoCollage2Panel,
        customizeHref: '/customize/canvas/canvas-collage?layout=collage-land-2p-split'
      },
      {
        id: 'collage-land-3p-left2-right1',
        number: '03',
        name: '3 Landscape Photo Collage',
        description: '2 Stacked Photos on Left + 1 Tall Photo on Right — a great way to pair everyday moments with one standout shot.',
        price: 148.5,
        image: PHOTO.photoCollage3Panel,
        customizeHref: '/customize/canvas/canvas-collage?layout=collage-land-3p-left2-right1'
      },
      {
        id: 'collage-land-5p-pinwheel',
        number: '04',
        name: '5 Landscape Photo Collage',
        description: '5-Photo Pinwheel Collage with Center Focus — one photo anchors the middle while four more surround it.',
        price: 148.5,
        image: PHOTO.photoCollage5Panel,
        customizeHref: '/customize/canvas/canvas-collage?layout=collage-land-5p-pinwheel'
      },
      {
        id: 'collage-land-9p-feature',
        number: '05',
        name: '9 Landscape Photo Collage',
        description: 'Center Feature Photo surrounded by 8 Border Photos — perfect for a big family collection or a year in review.',
        price: 148.5,
        image: PHOTO.photoCollage9Panel,
        customizeHref: '/customize/canvas/canvas-collage?layout=collage-land-9p-feature'
      }
    ],
    infoTitle: 'More Orientations, Same Layouts',
    infoSubtitle: "The 5 grid styles above are just the Landscape set — 28 real layouts in total are available directly in the customizer.",
    infoItems: [
      { title: 'Panoramic Collages', desc: 'The same grid, pinwheel and feature layouts stretched for wide panoramic canvases' },
      { title: 'Portrait Collages', desc: 'Matching layouts resized for tall portrait-orientation walls' },
      { title: 'Square Collages', desc: 'Grid, pinwheel and feature layouts sized for a perfectly square canvas' }
    ],
    tipsTitle: 'How to Choose Photos for Your Collage',
    tipsSubtitle: 'A few tips from photo printing guides worth following before you upload.',
    tipsItems: [
      { title: 'Pick a unifying theme', desc: 'A family collection, a trip, or a single occasion gives the collage a clear story instead of a random mix of photos.' },
      { title: 'Use high-resolution images', desc: 'Low-resolution or blurry shots look pixelated once enlarged onto canvas — start with your sharpest, best-lit photos.' },
      { title: 'Vary the orientation and size', desc: 'Mixing landscape, portrait, and close-up shots keeps a grid from feeling repetitive — pick the layout first, then slot photos in.' },
      { title: 'Coordinate color and mood', desc: 'Photos that share a similar color palette or tone (or deliberately contrast) tie the whole piece together visually.' }
    ],
    historyTitle: 'The History of Collage',
    historyParagraphs: [
      'The word "collage" comes from the French coller, meaning "to glue" or "to stick together." The technique of gluing paper to a surface is far older than the word itself — the earliest known paper collage dates to 10th-century Japan, where calligraphers glued paper onto surfaces when writing poems.',
      'In the 18th century, British artist Mary Delany began an extraordinary body of collage work at age 72, eventually creating 985 intricately cut botanical paper collages she called "flower Mosaicks." By the Victorian era, collage was a popular pastime for photo albums and memorabilia, with Victorian photocollage dating to the early 1860s.',
      'Collage became a recognized fine-art technique in the 20th century. In 1912, Georges Braque began attaching cut pieces of simulated wood-grain wallpaper to his charcoal drawings, and Pablo Picasso quickly followed — his Still Life with Chair Caning (1912) incorporated a patch of oilcloth. The two artists are credited with coining the French term papier collé ("pasted paper").',
      'Photomontage — collage built from cut photographs — grew out of the Dada movement in Berlin around 1918–1919, with artists like Hannah Höch using it as a tool for political and social commentary. The form resurfaced decades later in Pop Art: Richard Hamilton\'s 1956 collage for the exhibition "This Is Tomorrow" is considered an early landmark, and collage artists including Andy Warhol and Roy Lichtenstein were featured in the influential 1962 New Realist Exhibition in New York.'
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
    stepsTitle: 'How to Customize Your Photo Mosaic',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Set Your Mosaic Size',
      desc: 'Choose your canvas size — more photos uploaded means a richer, more detailed mosaic.'
    }),
    styles: [
      {
        id: 'mosaic2-4x4',
        number: '01',
        name: '16-Tile Mosaic (4×4 Grid)',
        description: '16 mosaic tiles in a compact 4×4 grid — 16" × 16" overall, great for a first mosaic or a smaller wall.',
        price: 148.5,
        image: PHOTO.photoMosaicEye,
        customizeHref: '/customize/canvas/canvas-mosaic?layout=mosaic2-4x4'
      },
      {
        id: 'mosaic3-3x4',
        number: '02',
        name: '12-Tile Landscape Mosaic (4×3 Grid)',
        description: '12 mosaic tiles in a wide 4×3 landscape grid — 16" × 12" overall, suited to horizontal wall spaces.',
        price: 405.0,
        image: PHOTO.photoMosaicPhoenix,
        customizeHref: '/customize/canvas/canvas-mosaic?layout=mosaic3-3x4'
      },
      {
        id: 'mosaic4-5x5',
        number: '03',
        name: '25-Tile Mosaic (5×5 Grid)',
        description: '25 mosaic tiles in a 5×5 grid — 20" × 20" overall, with enough detail to hold a close-up portrait.',
        price: 148.5,
        image: PHOTO.photoMosaicFace,
        customizeHref: '/customize/canvas/canvas-mosaic?layout=mosaic4-5x5'
      },
      {
        id: 'mosaic5-4x5',
        number: '04',
        name: '20-Tile Portrait Mosaic (4×5 Grid)',
        description: '20 mosaic tiles in a tall 4×5 portrait grid — 16" × 20" overall, suited to narrower wall spaces.',
        price: 645.0,
        image: PHOTO.photoMosaicBirdhouse,
        customizeHref: '/customize/canvas/canvas-mosaic?layout=mosaic5-4x5'
      },
      {
        id: 'mosaic6-6x6',
        number: '05',
        name: '36-Tile Mosaic (6×6 Grid)',
        description: '36 mosaic tiles in a large 6×6 grid — 24" × 24" overall, our most detailed square mosaic.',
        price: 148.5,
        image: PHOTO.photoMosaicParrots,
        customizeHref: '/customize/canvas/canvas-mosaic?layout=mosaic6-6x6'
      }
    ],
    tipsTitle: 'Tips for a Stunning Photo Mosaic',
    tipsSubtitle: 'A few things to know before you upload your photos.',
    tipsItems: [
      { title: 'Choose a strong main image', desc: 'Pick a clear, close-up photo with bold shapes and good contrast — busy, cluttered scenes lose the mosaic effect once broken into tiles.' },
      { title: 'Use plenty of photos', desc: 'Most photo mosaics use anywhere from 100 to several hundred smaller photos — the more you upload, the richer and more recognizable the final piece.' },
      { title: 'Keep your cell photos varied', desc: 'Aim for a mix of colors and subjects among your smaller photos — more variety gives the design more to work with when matching tones.' },
      { title: 'Design at full resolution', desc: "Upload your highest-resolution files from the start — scaling a low-resolution image up to canvas size afterward is where detail gets lost." }
    ],
    historyTitle: 'The History of Mosaic',
    historyParagraphs: [
      'Mosaic is one of the oldest art forms in the world. The earliest known mosaics, made from colored stones, shells, and ivory, were found at a temple in Mesopotamia dating back to the second half of the 3rd millennium BC.',
      'The Greeks developed figural mosaics by the 4th century BC, and the Romans took the technique to new heights, decorating villa floors from Britain to Syria with intricate tesserae work. The art form reached another peak in Ravenna, Italy, where Byzantine artists covered church walls and ceilings in dazzling mosaic scenes from the 5th century onward.',
      "Today's photo mosaic — built from hundreds of individual photographs instead of stone or glass tiles — is a thoroughly modern reinvention of that ancient technique: many small pieces, combining into one larger picture."
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
    stepsTitle: 'How to Customize Your Pop Art',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Pop Art Style',
      desc: 'Choose from Andy-Warhol, Caricatures, Lichtenstein, Pixel Painting and more, then select your size.'
    }),
    styles: [
      {
        id: 'andy-warhol',
        number: '01',
        name: 'Andy-Warhol',
        description: 'Iconic 4-quadrant screenprint Pop Art with contrasting vibrant pop palettes across four quadrants.',
        price: 499,
        image: PHOTO.popArtWarholZebra,
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'caricatures',
        number: '02',
        name: 'Caricatures',
        description: 'Playful cartoon caricature styling with bold hand-drawn contours, comic cel shading, and warm tones.',
        price: 599,
        image: PHOTO.popArtCaricature,
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'lichtenstein',
        number: '03',
        name: 'Lichtenstein',
        description: 'Roy Lichtenstein comic strip pop art featuring Ben-Day halftone dots, ink contours, and primary comic colors.',
        price: 499,
        image: PHOTO.popArtLichtenstein,
        customizeHref: '/customize/canvas/canvas-pop-art'
      },
      {
        id: 'pixel-painting',
        number: '04',
        name: 'Pixel Painting',
        description: 'Retro 8-bit digital pixel art mosaic transformation preserving facial likeness with sharp mosaic tiles.',
        price: 1750,
        image: PHOTO.popArtPixel,
        customizeHref: '/customize/canvas/canvas-pop-art'
      }
    ],
    historyTitle: 'The History of Pop Art',
    historyParagraphs: [
      'Pop Art began in the mid-1950s in Britain, with the Independent Group in London discussing mass media, advertising, and consumer culture. Eduardo Paolozzi\'s 1947 collage "I was a Rich Man\'s Plaything," built from American magazine clippings, is often cited as the first artwork to use the word "pop."',
      'Richard Hamilton\'s 1956 collage "Just what is it that makes today\'s homes so different, so appealing?" is widely considered one of the movement\'s founding works. The term "pop art" itself was popularized by critic Lawrence Alloway in a 1958 essay.',
      "The movement found its most famous voice in New York in the early 1960s, through Andy Warhol's soup cans and celebrity silkscreens, Roy Lichtenstein's comic-strip paintings with their bold Ben-Day dots, and Claes Oldenburg's oversized sculptures of everyday objects. Warhol's first solo show, 32 Campbell's Soup Cans, opened at the Ferus Gallery in Los Angeles in July 1962 — a moment often marked as Pop Art's true arrival."
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
    stepsTitle: 'How to Customize Your Lyric Canvas',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Add Your Lyrics & Template',
      desc: 'Type your song lyrics, vows, or quote, choose a template, then pick your size.'
    }),
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
    historyTitle: 'A Modern Twist on an Old Tradition',
    historyParagraphs: [
      "Turning words into wall art is far from new — illuminated manuscripts and hand-lettered calligraphy have decorated walls and pages for centuries, long before printing presses existed.",
      "What's changed is how personal it's become. Where lettering was once the domain of trained scribes and calligraphers, today anyone can pair a favorite song lyric, wedding vow, or quote with their own photograph and have it printed as a one-of-a-kind piece of canvas art — no calligraphy skills required."
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
    stepsTitle: 'How to Customize Your Panoramic Canvas',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Panoramic Size',
      desc: 'Choose an extra-wide size that fits your wall, from 12"×36" up to 20"×60" and beyond.'
    }),
    styles: [
      {
        id: 'canvas-wedding-panoramic',
        number: '01',
        name: 'Grand Panoramic Wedding Canvas',
        description: 'Wide panoramic wedding ceremony memories printed on fine archival cotton weave.',
        price: 2799,
        image: PHOTO.weddingCouple,
        customizeHref: '/customize/canvas/canvas-single?category=PANORAMIC'
      }
    ],
    galleryTitle: 'Moments wide enough to fill a wall',
    galleryItems: [
      { label: 'Weddings', image: PHOTO.weddingCouple },
      { label: 'Skylines', icon: 'mountain' },
      { label: 'Landscapes', icon: 'mountain' },
      { label: 'Group Shots', icon: 'users' }
    ],
    historyTitle: 'The History of the Panorama',
    historyParagraphs: [
      'Immersive, wide-format art is older than photography itself — murals designed to wrap around a viewer have been found in Pompeii, dating back to around 20 AD.',
      "The word \"panorama\" itself was coined by Scottish painter Robert Barker, who patented his 360-degree painting technique in 1787 and opened a dedicated rotunda in London's Leicester Square that ran for 70 years, from 1793 to 1863.",
      "Panoramic photography followed soon after the daguerreotype's invention in 1839, as photographers began joining multiple images into one sweeping view — the same idea behind today's panoramic canvas prints, just with a camera instead of a brush."
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
    stepsTitle: 'How to Customize Your Split Canvas',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Panel Count',
      desc: "Choose a 3 to 5-piece split layout, and we'll divide your photo seamlessly across each panel."
    }),
    styles: [
      {
        id: 'canvas-split',
        number: '01',
        name: 'Split Canvas (Triptych)',
        description: 'Panoramic photo split seamlessly across 3 triptych canvas panels.',
        price: 188.1,
        visual: 'split-panels',
        customizeHref: '/customize/canvas/canvas-split'
      },
      {
        id: 'canvas-split-panel',
        number: '02',
        name: '5-Panel Panoramic Landscape Canvas',
        description: 'Dramatic multi-tier 5-piece split canvas centerpiece for spacious living and dining halls.',
        price: 3499,
        visual: 'split-panels',
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
    historyTitle: 'The History of the Multi-Panel Format',
    historyParagraphs: [
      'Splitting an image or artwork across multiple hinged panels dates back to early Christian art, where the three-panel "triptych" became the standard format for altarpieces from the Middle Ages onward — valued partly because hinged panels folded shut and were easy to transport between churches.',
      'During World War II, a U.S. citizens\' committee commissioned nearly 460 portable triptych altarpieces from about 70 artists for use by troops of different faiths — a reminder of how practical the multi-panel format has always been, not just decorative.',
      "Today's split canvas print borrows that same structure — one image, divided across separate panels — reframed as a deliberate, modern design choice rather than a religious or practical necessity."
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
    stepsTitle: 'How to Customize Your Hexagon Canvas',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Hexagon Cluster',
      desc: 'Choose a single hexagon or a multi-piece honeycomb cluster arrangement.'
    }),
    styles: [
      {
        id: 'canvas-hexagon',
        number: '01',
        name: 'Hexagon Prints',
        description: 'Geometric 6-sided honeycomb canvas prints for modular wall clusters.',
        price: 449,
        visual: 'hexagon-cluster',
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
    historyTitle: 'Why the Hexagon?',
    historyParagraphs: [
      "The hexagon's place in art and design isn't an accident — it's math. Roman scholar Marcus Terentius Varro first posed the question, in the 1st century BC, of why bees build their honeycomb in hexagons rather than any other shape.",
      'Centuries later, mathematician Thomas Hales finally proved it in 1999: the hexagon is the most efficient shape for tiling a surface, enclosing the most area with the least material and no wasted gaps.',
      'That same efficiency is what makes hexagons so satisfying on a wall — six-sided canvases interlock edge to edge into a honeycomb cluster with no awkward spacing, a pattern humans have been drawn to in tile work and architecture for centuries.'
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
    stepsTitle: 'How Wholesale Ordering Works',
    stepsSubtitle: 'Bulk orders go through our quote desk instead of the standard customizer.',
    steps: [
      { icon: 'upload', title: 'Request a Quote', desc: 'Tell us your order volume (20+ units) and the canvas sizes or formats you need.' },
      { icon: 'grid', title: 'Share Your Order Details', desc: 'Send over your artwork or photos, along with your preferred sizes, finishes, and delivery timeline.' },
      { icon: 'sliders', title: 'Approve Your Quote', desc: "We'll send tiered pricing with GST invoicing — confirm your order once you're happy with it." },
      { icon: 'eye', title: 'Production & Delivery', desc: 'Every piece is printed to the same archival standard and shipped together, pan-India.' }
    ],
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
    stepsTitle: 'How to Customize Your Caricature',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Caricature Style',
      desc: 'Upload a clear photo and let our digital artists turn it into a playful caricature portrait.'
    }),
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
    historyTitle: 'The History of Caricature',
    historyParagraphs: [
      'The word "caricature" comes from the Italian caricare, meaning "to load" or "exaggerate." Leonardo da Vinci was already sketching people with unusual, striking features centuries before the term existed, and Italian artist Pier Leone Ghezzi is credited with popularizing the style among European aristocracy in the early 1700s.',
      'The art form found its golden age in 18th-century London, where artists like William Hogarth, James Gillray, and Thomas Rowlandson turned caricature into a serious tool of political satire — Gillray\'s 1805 cartoon "The Plumb-pudding in Danger" is still considered one of the most famous political cartoons ever drawn.',
      'Caricature has stayed personal and playful ever since, evolving from political satire into the warm, exaggerated portrait style used today for gifts and celebrations — the same spirit behind the digital caricature we offer on canvas.'
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
    stepsTitle: 'How to Customize Your Canvas Banner',
    stepsSubtitle: 'From upload to finish in 5 simple steps.',
    steps: buildCustomizeSteps({
      title: 'Pick Your Size & Finish',
      desc: 'Choose your size, then select grommets, pole pockets, or wood rails for hanging.'
    }),
    styles: [
      {
        id: 'canvas-banner',
        number: '01',
        name: 'Hanging Canvas Banner',
        description: 'Hanging fabric canvas banner with solid wood rails and rustic twine cord for wall hanging.',
        price: 399,
        visual: 'banner-scroll',
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
    historyTitle: 'The History of the Banner',
    historyParagraphs: [
      'The word "banner" traces back through Old French baniere to the Latin bandum, and the tradition is ancient: Roman legions carried cloth standards called vexilla, hung from a horizontal crossbar, into battle.',
      "Banners have carried meaning for millennia beyond the battlefield — heraldic banners displayed a family's coat of arms, church banners have been carried in processions for centuries, and trade unions in Australia marched under elaborate banners during the Eight Hour Day parades of the late 1800s and early 1900s.",
      'Banner-making is, in the words of one historian, "an ancient craft" — and the heavyweight canvas banner is simply that tradition continuing, now with your own photos and message instead of a coat of arms or a union crest.'
    ],
    featuresTitle: 'Made for your walls',
    features: STANDARD_FEATURES
  }
};

export function getCanvasStyleLandingData(slug: string): CanvasStyleLandingData | undefined {
  return CANVAS_STYLE_LANDING_DATA[slug];
}
