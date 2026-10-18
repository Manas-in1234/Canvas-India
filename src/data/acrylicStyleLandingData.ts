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
// friendly intro, a step-2 title/desc, and an icon (no distinct real photos
// exist for these product types anywhere in the app — the customizer itself
// only uses generic shape placeholders — so each uses a plain, accurate icon
// instead of a mismatched stock photo).
const STYLE_META: Record<string, { slug: string; intro: string; step2: { title: string; desc: string }; icon: import('../components/CanvasStyleLandingPage').CanvasStyleIcon }> = {
  'acrylic-print': {
    slug: 'single-print',
    intro: 'One photo, printed edge-to-edge on crystal-clear optical acrylic for a vivid, glass-like glow.',
    step2: { title: 'Pick Your Size', desc: 'Choose a size from our standard range, or set a custom width and height.' },
    icon: 'print'
  },
  'acrylic-wall-art': {
    slug: 'wall-display',
    intro: 'A cluster of acrylic panels arranged together as one striking gallery-wall display.',
    step2: { title: 'Pick Your Panel Layout', desc: 'Choose a multi-panel gallery arrangement, then fine-tune individual panel sizes.' },
    icon: 'wall'
  },
  'acrylic-collage': {
    slug: 'photo-collage',
    intro: 'Several of your favorite photos arranged into one cohesive acrylic grid.',
    step2: { title: 'Pick Your Collage Grid', desc: 'Choose from multiple photo layouts, then slot in your photos.' },
    icon: 'grid'
  },
  'acrylic-split': {
    slug: 'split-acrylic',
    intro: 'One photo, seamlessly split across separate acrylic panels for a dramatic centerpiece.',
    step2: { title: 'Pick Your Panel Count', desc: "Choose a multi-piece split layout, and we'll divide your photo seamlessly across each panel." },
    icon: 'columns'
  },
  'acrylic-mosaic': {
    slug: 'photo-mosaic',
    intro: 'Dozens of your smaller photographs blended together into one intricate acrylic mosaic.',
    step2: { title: 'Set Your Mosaic Size', desc: 'Choose your panel size — more photos uploaded means a richer, more detailed mosaic.' },
    icon: 'mosaic'
  },
  'acrylic-lyric': {
    slug: 'lyric-on-acrylic',
    intro: 'Pair your favorite photo with the song lyrics, vows, or quote that means the most, rendered in elegant typography on acrylic.',
    step2: { title: 'Add Your Lyrics & Template', desc: 'Type your song lyrics, vows, or quote, choose a template, then pick your size.' },
    icon: 'music'
  },
  'acrylic-digital': {
    slug: 'digital-painting',
    intro: 'Turn your favorite photo into an artistic digital oil, charcoal, or palette-knife painting, printed on acrylic.',
    step2: { title: 'Pick Your Painting Effect', desc: 'Choose a digital painting style and subject, and we\'ll transform your photo into artwork.' },
    icon: 'painting'
  },
  'acrylic-quotes': {
    slug: 'quotes-on-acrylic',
    intro: 'Your favorite quote, rendered in bold custom typography on crystal-clear acrylic.',
    step2: { title: 'Pick Your Template', desc: 'Choose a quote template and typography style, then personalize the text.' },
    icon: 'quote'
  },
  'acrylic-bus-roll': {
    slug: 'bus-roll',
    intro: 'A tall vertical acrylic strip styled after classic destination bus rolls — a fun, retro statement piece.',
    step2: { title: 'Create Your Bus Roll', desc: 'Type your destination lines and pick a background style for your roll.' },
    icon: 'bus'
  },
  'acrylic-word-art': {
    slug: 'word-art',
    intro: 'Your name, a favorite word, or a short phrase, shaped into bold typographic wall art on acrylic.',
    step2: { title: 'Design Your Word Art', desc: 'Type your word or phrase and choose a layout, then pick your size.' },
    icon: 'type'
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
          icon: meta.icon,
          customizeHref: `/customize/acrylic/${pt.id}`
        }
      ],
      featuresTitle: 'Made to display',
      features: STANDARD_ACRYLIC_FEATURES
    };
    return [meta.slug, data];
  })
);

export function getAcrylicStyleLandingData(slug: string): CanvasStyleLandingData | undefined {
  return ACRYLIC_STYLE_LANDING_DATA[slug];
}
