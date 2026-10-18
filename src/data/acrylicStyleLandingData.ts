// ============================================================================
// ACRYLIC STYLE LANDING PAGES
// One entry per real acrylic product type (same ids/prices/descriptions as
// ACRYLIC_PRODUCT_TYPES in acrylicCustomizerData.ts, and the homepage's
// Acrylic Prints cards) — mirrors the Canvas style landing page system so
// each format opens its own page instead of jumping straight into the
// customizer, exactly like Canvas does.
// ============================================================================

import { CanvasStyleLandingData } from '../components/CanvasStyleLandingPage';
import { ACRYLIC_PRODUCT_TYPES } from './acrylicCustomizerData';

const buildAcrylicSteps = (step2: { title: string; desc: string }) => [
  {
    icon: 'upload' as const,
    title: 'Upload Your Photo(s)',
    desc: 'Upload high-resolution photos straight from your device, or scan the QR code to send them from your phone — no app needed.'
  },
  { icon: 'grid' as const, ...step2 },
  {
    icon: 'crop' as const,
    title: 'Choose Your Size & Shape',
    desc: 'Pick the size and shape that fits your wall or desk — every acrylic piece is cut and polished to order.'
  },
  {
    icon: 'sliders' as const,
    title: 'Select Hardware & Finish',
    desc: 'Choose your acrylic thickness and hanging or standoff hardware — every piece ships ready to display.'
  },
  {
    icon: 'eye' as const,
    title: 'Preview & Order',
    desc: "See exactly how it'll look on your wall with our live Room View preview, then add it to your cart and check out."
  }
];

const STANDARD_ACRYLIC_FEATURES = [
  { icon: 'layers' as const, title: 'Premium Materials', desc: 'Crystal-clear cast acrylic with diamond-polished, beveled edges.' },
  { icon: 'sparkles' as const, title: 'Archival UV Inks', desc: 'Sub-surface UV printing seals every pigment against moisture and fading.' },
  { icon: 'shield' as const, title: 'Built to Last', desc: 'Hand-inspected and quality-tested before it ever leaves our workshop.' },
  { icon: 'clock' as const, title: 'Ready to Hang', desc: 'Arrives with hardware pre-attached — no framing needed.' }
];

// Maps each acrylic product type's id to a distinct landing-page slug, a
// friendly intro, a step-2 title/desc, an icon, and real encyclopedic
// history. Only Single Print has a verified real photo (user-supplied); the
// rest have no distinct real photos anywhere in the app — the customizer
// itself only ever used generic shape placeholders — so they use a plain,
// accurate icon instead of a mismatched stock photo.
const STYLE_META: Record<string, {
  slug: string;
  intro: string;
  step2: { title: string; desc: string };
  icon: import('../components/CanvasStyleLandingPage').CanvasStyleIcon;
  image?: string;
  /** For multi-panel formats (collage/split/wall-art/mosaic), the real
   * layout id (from productGeometry.tsx) that matches what the main style
   * card's own image actually shows, deep-linked via ?layout= so
   * "Customize This Style" opens the matching panel configuration instead
   * of the customizer's unrelated default. */
  layoutId?: string;
  historyTitle: string;
  historyParagraphs: string[];
  tipsTitle?: string;
  tipsSubtitle?: string;
  tipsItems?: { title: string; desc: string }[];
  /** Additional real-photo style cards shown after the main one, for
   * formats with more than one verified real example — each deep-linking
   * to its own matching layout the same way. */
  extraStyles?: { name: string; description: string; image: string; layoutId?: string }[];
}> = {
  'acrylic-print': {
    slug: 'single-print',
    intro: 'One photo, printed edge-to-edge on crystal-clear optical acrylic for a vivid, glass-like glow.',
    step2: { title: 'Pick Your Size', desc: 'Choose a size from our standard range, or set a custom width and height.' },
    icon: 'print',
    image: '/assets/canvas-styles/acrylic-single-print-peacock.webp',
    historyTitle: 'The History of Acrylic Glass',
    historyParagraphs: [
      'Acrylic glass (polymethyl methacrylate) was patented in 1933 by German chemists at Rohm and Haas, who marketed it under the name Plexiglas — a shatter-resistant, lightweight alternative to glass that was soon used everywhere from aircraft canopies in World War II to dental prosthetics.',
      "Photographers and galleries began mounting prints directly behind acrylic sheets from the 1980s onward, prized for how the material's optical clarity makes colors appear to glow with extra depth and saturation compared to printing on paper alone.",
      "Today's acrylic photo print carries that same idea forward — a direct UV print sealed beneath (or printed sub-surface onto) crystal-clear cast acrylic, giving photographs a luminous, almost three-dimensional quality that a standard paper print can't match."
    ]
  },
  'acrylic-wall-art': {
    slug: 'wall-display',
    intro: 'A cluster of acrylic panels arranged together as one striking gallery-wall display.',
    step2: { title: 'Pick Your Panel Layout', desc: 'Choose a multi-panel gallery arrangement, then fine-tune individual panel sizes.' },
    icon: 'wall',
    image: '/assets/canvas-styles/acrylic-wall-forest-selfie.webp',
    historyTitle: 'The History of the Gallery Wall',
    historyParagraphs: [
      'The densely packed "gallery wall" look traces back to the Paris Salon, which from 1667 accepted far more paintings than its walls could comfortably hold, so organizers covered every inch floor to ceiling with little regard for matching styles.',
      'That "salon-style hang" had its own hierarchy — prized works hung "on the line" at eye level, lesser ones pushed toward the ceiling or floor — a practice London\'s Royal Academy soon adopted too.',
      'The look eventually left the gallery altogether, becoming a deliberate home-decorating style in its own right — and a cluster of acrylic panels is simply that same arrangement, made modern with a glossy, glass-like finish.'
    ],
    extraStyles: [
      {
        name: 'Pier Sunset Acrylic Display',
        description: 'A sweeping boardwalk sunset, floating on standoff mounts for a gallery-style hang on any wall.',
        image: '/assets/canvas-styles/acrylic-wall-pier-sunset.webp'
      },
      {
        name: 'Rocky Beach Sunset Acrylic Display',
        description: 'A calm rocky shoreline at sunset, printed edge-to-edge for a vivid, glass-like glow.',
        image: '/assets/canvas-styles/acrylic-wall-rocky-beach-sunset.webp'
      },
      {
        name: 'Portrait Acrylic Display',
        description: 'A warm couple portrait on a compact standoff-mounted panel — perfect for a desk, shelf, or entryway wall.',
        image: '/assets/canvas-styles/acrylic-wall-couple-portrait.webp'
      },
      {
        name: 'Abstract Art Acrylic Display',
        description: 'Bold modern abstract artwork, framed by crystal-clear acrylic for a contemporary gallery look.',
        image: '/assets/canvas-styles/acrylic-wall-abstract-face.webp'
      }
    ]
  },
  'acrylic-collage': {
    slug: 'photo-collage',
    intro: 'Several of your favorite photos arranged into one cohesive acrylic grid.',
    step2: { title: 'Pick Your Collage Grid', desc: 'Choose from multiple photo layouts, then slot in your photos.' },
    icon: 'grid',
    image: '/assets/canvas-styles/acrylic-collage-wedding-3panel.webp',
    layoutId: 'collage-land-3p-left2-right1',
    historyTitle: 'The History of Collage',
    historyParagraphs: [
      'The word "collage" comes from the French coller, "to glue." The earliest known paper collage dates to 10th-century Japan, where calligraphers glued paper onto surfaces when writing poems.',
      'Collage became a recognized fine-art technique in 1912, when Georges Braque began attaching cut wallpaper to his drawings and Pablo Picasso quickly followed — the two are credited with coining the term papier collé, "pasted paper."',
      "A photo collage on acrylic carries that same idea forward — several photographs arranged into one piece — just printed edge-to-edge on crystal-clear acrylic instead of glued paper."
    ],
    extraStyles: [
      {
        name: '4-Photo Grid Acrylic Collage',
        description: 'A clean 2×2 grid pairing everyday moments with your favorite close-ups.',
        image: '/assets/canvas-styles/acrylic-collage-couple-4panel.webp',
        layoutId: 'collage-sq-4p-grid'
      },
      {
        name: '9-Photo Family Acrylic Collage',
        description: 'A full 3×3 grid for a big family collection spanning every generation.',
        image: '/assets/canvas-styles/acrylic-collage-family-9panel.webp',
        layoutId: 'collage-land-9p-feature'
      },
      {
        name: 'Feature Photo Acrylic Collage',
        description: 'One large feature photo paired with smaller accent shots for an editorial-style layout.',
        image: '/assets/canvas-styles/acrylic-collage-bride-feature.webp',
        layoutId: 'collage-land-5p-left-tall-right-grid'
      }
    ]
  },
  'acrylic-split': {
    slug: 'split-acrylic',
    intro: 'One photo, seamlessly split across separate acrylic panels for a dramatic centerpiece.',
    step2: { title: 'Pick Your Panel Count', desc: "Choose a multi-piece split layout, and we'll divide your photo seamlessly across each panel." },
    icon: 'columns',
    image: '/assets/canvas-styles/acrylic-split-couple-sunset.webp',
    layoutId: 'split-3p-75x50-triptych',
    historyTitle: 'The History of the Multi-Panel Format',
    historyParagraphs: [
      'Splitting an image across multiple hinged panels dates back to early Christian art, where the three-panel "triptych" became the standard format for altarpieces from the Middle Ages onward.',
      "During World War II, a U.S. citizens' committee commissioned nearly 460 portable triptych altarpieces for troops of different faiths — proof the multi-panel format has always been practical, not just decorative.",
      "Split acrylic reframes that same structure — one image divided across separate panels — as a deliberate, modern design choice, finished with a glossy acrylic surface instead of painted wood."
    ],
    extraStyles: [
      {
        name: '5-Panel Beach Pier Split Acrylic',
        description: 'A wide panoramic jetty view stretched across 5 stepped acrylic panels.',
        image: '/assets/canvas-styles/acrylic-split-beach-pier.webp',
        layoutId: 'split-5p-57-75-97-stepped'
      },
      {
        name: 'Sailboat Painting Split Acrylic',
        description: 'A warm painted seascape split across 4 panels — one large feature panel plus 3 accent panels.',
        image: '/assets/canvas-styles/acrylic-split-sailboat-painting.webp',
        layoutId: 'split-4p-85x50-stacked-right'
      },
      {
        name: 'Marble Abstract Split Acrylic',
        description: 'Flowing blue and gold abstract marbling split evenly across 4 equal panels.',
        image: '/assets/canvas-styles/acrylic-split-marble-abstract.webp',
        layoutId: 'split-4p-50x50-grid'
      }
    ]
  },
  'acrylic-mosaic': {
    slug: 'photo-mosaic',
    intro: 'Dozens of your smaller photographs blended together into one intricate acrylic mosaic.',
    step2: { title: 'Set Your Mosaic Size', desc: 'Choose your panel size — more photos uploaded means a richer, more detailed mosaic.' },
    icon: 'mosaic',
    image: '/assets/canvas-styles/acrylic-mosaic-couple.webp',
    layoutId: 'mosaic2-4x4',
    historyTitle: 'The History of Mosaic',
    historyParagraphs: [
      'Mosaic is one of the oldest art forms in the world — the earliest known examples, made from colored stones, shells, and ivory, were found at a temple in Mesopotamia dating to the 3rd millennium BC.',
      'The Greeks developed figural mosaics by the 4th century BC, and the Romans took the technique across their empire, decorating villa floors from Britain to Syria with intricate tesserae work.',
      "Today's photo mosaic reinvents that ancient technique with hundreds of individual photographs instead of stone or glass tiles — many small pieces combining into one larger picture, now printed on acrylic."
    ],
    tipsTitle: 'Tips for a Stunning Photo Mosaic',
    tipsSubtitle: 'A few things to know before you upload your photos.',
    tipsItems: [
      { title: 'Choose a strong main image', desc: 'Pick a clear, close-up photo with bold shapes and good contrast — busy, cluttered scenes lose the mosaic effect once broken into tiles.' },
      { title: 'Use plenty of photos', desc: 'Most photo mosaics use anywhere from 100 to several hundred smaller photos — the more you upload, the richer and more recognizable the final piece.' },
      { title: 'Keep your cell photos varied', desc: 'Aim for a mix of colors and subjects among your smaller photos — more variety gives the design more to work with when matching tones.' },
      { title: 'Design at full resolution', desc: "Upload your highest-resolution files from the start — scaling a low-resolution image up to canvas size afterward is where detail gets lost." }
    ],
    extraStyles: [
      {
        name: 'Star Portrait Acrylic Mosaic',
        description: 'A bold, high-contrast hero portrait formed from hundreds of micro-moments, encased in optical acrylic.',
        image: '/assets/canvas-styles/acrylic-mosaic-star-portrait.webp',
        layoutId: 'mosaic5-4x5'
      },
      {
        name: 'Baby Milestone Acrylic Mosaic',
        description: 'Celebrate your child’s precious memories in a luminous, diamond-polished acrylic mosaic display.',
        image: '/assets/canvas-styles/acrylic-mosaic-baby-room.webp',
        layoutId: 'mosaic1-3x4'
      },
      {
        name: 'Classic Tonal Acrylic Mosaic',
        description: 'An elegant black-and-white tonal portrait crafted from dozens of micro memories, sealed with a glossy depth.',
        image: '/assets/canvas-styles/acrylic-mosaic-gentleman-portrait.webp',
        layoutId: 'mosaic4-5x5'
      }
    ]
  },
  'acrylic-lyric': {
    slug: 'lyric-on-acrylic',
    intro: 'Pair your favorite photo with the song lyrics, vows, or quote that means the most, rendered in elegant typography on acrylic.',
    step2: { title: 'Add Your Lyrics & Template', desc: 'Type your song lyrics, vows, or quote, choose a template, then pick your size.' },
    icon: 'music',
    image: '/assets/canvas-styles/acrylic-lyric-vinyl-record.webp',
    historyTitle: 'The History of Lyric Art',
    historyParagraphs: [
      'Pairing handwritten text with an image has roots in illuminated manuscripts, where medieval scribes wove decorated lettering directly into the artwork surrounding sacred texts.',
      'The specific idea of pairing a couple\'s own wedding song lyrics with their portrait grew out of the custom wedding-gift market that expanded alongside affordable digital printing in the 2000s and 2010s.',
      'Lyric on acrylic continues that tradition on crystal-clear acrylic, letting the typography and photo sit together with the same glossy depth as a gallery print.'
    ],
    extraStyles: [
      {
        name: 'Gold Script Acrylic Lyric Block',
        description: 'Shimmering gold script names and milestone date layered over custom song lyrics on a freestanding obsidian black acrylic block.',
        image: '/assets/canvas-styles/acrylic-lyric-gold-black-block.webp'
      },
      {
        name: 'Sheet Music Acrylic Lyric Block',
        description: 'Classical stave and musical notation backdrop paired with couple names, anniversary date, and song lyrics on crystal-clear acrylic.',
        image: '/assets/canvas-styles/acrylic-lyric-sheet-music-block.webp'
      },
      {
        name: 'Heart Line Art Acrylic Lyric Block',
        description: 'Romantic minimalist line art hands with a vibrant red heart, wreathed in the words of your special melody.',
        image: '/assets/canvas-styles/acrylic-lyric-heart-line-art.webp'
      }
    ]
  },
  'acrylic-digital': {
    slug: 'digital-painting',
    intro: 'Turn your favorite photo into an artistic digital oil, charcoal, or palette-knife painting, printed on acrylic.',
    step2: { title: 'Pick Your Painting Effect', desc: 'Choose a digital painting style and subject, and we\'ll transform your photo into artwork.' },
    icon: 'painting',
    historyTitle: 'The History of Photo-to-Painting Art',
    historyParagraphs: [
      'Simulating painterly brushwork from a photograph dates back to early image-editing software in the 1990s, when programs like Adobe Photoshop first shipped built-in "oil paint" and "watercolor" filters.',
      'The style went mainstream with mobile apps like Prisma in 2016, which used neural-network style transfer to turn ordinary phone photos into convincing paintings in seconds — introducing the effect to a mass audience.',
      "A digital painting print carries that same transformation onto physical wall art, turning a favorite photo into an oil, charcoal, or palette-knife-style portrait on acrylic."
    ]
  },
  'acrylic-quotes': {
    slug: 'quotes-on-acrylic',
    intro: 'Your favorite quote, rendered in bold custom typography on crystal-clear acrylic.',
    step2: { title: 'Pick Your Template', desc: 'Choose a quote template and typography style, then personalize the text.' },
    icon: 'quote',
    historyTitle: 'The History of Typographic Wall Art',
    historyParagraphs: [
      'Using bold lettering alone as the subject of a poster traces back to the WPA-era public information posters of the 1930s-40s, which relied on strong typography to deliver a message at a glance.',
      'The modern "motivational quote" wall art trend took off in the 2000s and 2010s alongside the rise of home-decor retailers and platforms like Pinterest, which popularized short, shareable phrases as standalone decor.',
      'Quotes on acrylic brings that same typographic tradition to a glossy, gallery-like surface — the words alone, printed crisp and bold.'
    ]
  },
  'acrylic-bus-roll': {
    slug: 'bus-roll',
    intro: 'A tall vertical acrylic strip styled after classic destination bus rolls — a fun, retro statement piece.',
    step2: { title: 'Create Your Bus Roll', desc: 'Type your destination lines and pick a background style for your roll.' },
    icon: 'bus',
    historyTitle: 'The History of the Destination Roll Blind',
    historyParagraphs: [
      'Mechanical roller-blind destination signs were fitted to buses and trams from the early 20th century onward, each roll printed with a long list of routes that the driver wound into place by hand.',
      "London's classic Routemaster buses made the format especially iconic through the mid-20th century, and original canvas destination rolls are now sought after by transport collectors and decorators alike.",
      'A bus roll print borrows that same tall, hand-wound format purely for its nostalgic look — a personalized destination list printed on acrylic instead of canvas.'
    ]
  },
  'acrylic-word-art': {
    slug: 'word-art',
    intro: 'Your name, a favorite word, or a short phrase, shaped into bold typographic wall art on acrylic.',
    step2: { title: 'Design Your Word Art', desc: 'Type your word or phrase and choose a layout, then pick your size.' },
    icon: 'type',
    historyTitle: 'The History of Word Art',
    historyParagraphs: [
      'Decorative lettering as a standalone art object has roots in illuminated manuscripts and hand-lettered signage, where a single word or initial could carry as much visual weight as a full illustration.',
      'The modern "word art" home-decor trend — a name, family word, or short phrase displayed as the entire artwork — became especially popular through home-decor retailers in the early 2000s.',
      'Word art on acrylic brings that same single-word focus to a glossy, gallery-style finish, letting the lettering itself be the centerpiece.'
    ]
  },
};

export const ACRYLIC_STYLE_LANDING_DATA: Record<string, CanvasStyleLandingData> = Object.fromEntries(
  ACRYLIC_PRODUCT_TYPES.map((pt) => {
    const meta = STYLE_META[pt.id];
    const data: CanvasStyleLandingData = {
      slug: meta.slug,
      pageTitle: pt.name,
      heroTitle: `What is ${pt.name}?`,
      heroSubtitle: `${pt.description} ${meta.intro}`,
      stylesSectionTitle: `Explore ${pt.name}`,
      stepsTitle: `How to Customize Your ${pt.name}`,
      stepsSubtitle: 'From upload to finish in 5 simple steps.',
      steps: buildAcrylicSteps(meta.step2),
      styles: [
        {
          id: pt.id,
          number: '01',
          name: pt.name,
          description: pt.description,
          price: pt.startingPrice,
          ...(meta.image ? { image: meta.image } : { icon: meta.icon }),
          customizeHref: `/customize/acrylic/${pt.id}${meta.layoutId ? `?layout=${meta.layoutId}` : ''}`
        },
        ...(meta.extraStyles || []).map((extra, i) => ({
          id: `${pt.id}-${i + 2}`,
          number: String(i + 2).padStart(2, '0'),
          name: extra.name,
          description: extra.description,
          price: pt.startingPrice,
          image: extra.image,
          customizeHref: `/customize/acrylic/${pt.id}${extra.layoutId ? `?layout=${extra.layoutId}` : ''}`
        }))
      ],
      ...(meta.tipsTitle && meta.tipsItems
        ? {
            tipsTitle: meta.tipsTitle,
            tipsSubtitle: meta.tipsSubtitle,
            tipsItems: meta.tipsItems
          }
        : {}),
      historyTitle: meta.historyTitle,
      historyParagraphs: meta.historyParagraphs,
      featuresTitle: 'Made to display',
      features: STANDARD_ACRYLIC_FEATURES
    };
    return [meta.slug, data];
  })
);

export function getAcrylicStyleLandingData(slug: string): CanvasStyleLandingData | undefined {
  return ACRYLIC_STYLE_LANDING_DATA[slug];
}
