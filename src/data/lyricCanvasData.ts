// ============================================================================
// LYRIC ON CANVAS DATA & CONFIGURATION
// Centralized configuration for Lyric Canvas templates, layouts, typography, & pricing
// ============================================================================

export type LyricTemplateId =
  | 'wedding-song-lyrics'
  | 'wedding-first-dance'
  | 'wedding-vows-wall-art'
  | 'first-marriage-anniversary'
  | 'personalized-wedding-gift'
  | 'forever-young-lyrics'
  | 'wedding-vows-canvas'
  | 'sheet-music-wall-art'
  | 'first-anniversary-gift'
  | 'couples-personalized-art'
  | 'first-dance-lyrics'
  | 'wedding-vows-1st-anniversary';

export type LyricTemplateCategory =
  | 'all'
  | 'wedding'
  | 'first_dance'
  | 'vows'
  | 'anniversary'
  | 'sheet_music'
  | 'couples';

export type LyricTemplateLayout =
  | 'photo-lyrics-overlay'
  | 'split-side-by-side'
  | 'wedding-vows-photo'
  | 'first-dance-card'
  | 'bottom-third-lyrics'
  | 'classic-centered-lyrics'
  | 'sheet-music-bg'
  | 'quote-solid-bg';

export type LyricFontFamily =
  | 'Playfair Display'
  | 'Cormorant Garamond'
  | 'Dancing Script'
  | 'Montserrat'
  | 'Cinzel';

export interface LyricCanvasTemplate {
  id: LyricTemplateId;
  name: string;
  category: LyricTemplateCategory;
  previewImage: string;
  description: string;
  defaultLayout: LyricTemplateLayout;
  defaultBackground: {
    color: string;
    texture?: 'none' | 'sheet-music' | 'parchment' | 'frosted-card';
    overlayDarkness: number; // 0-100%
  };
  defaultTypography: {
    fontFamily: LyricFontFamily;
    fontSize: 'sm' | 'base' | 'lg';
    fontStyle: 'normal' | 'italic';
    textColor: string;
    alignment: 'center' | 'left' | 'right';
  };
  supportsPhoto: boolean;
  defaultText: {
    title: string;
    artistOrSubtitle: string;
    lyrics: string;
    dateOrNames?: string;
  };
  priceAdjustment: number;
  available: boolean;
  themeNote?: string;
}

export interface LyricCanvasConfig {
  selectedTemplateId: LyricTemplateId;
  title: string;
  artistOrSubtitle: string;
  lyrics: string;
  dateOrNames: string;
  fontFamily: LyricFontFamily;
  textColor: string;
  alignment: 'center' | 'left' | 'right';
  overlayDarkness: number; // 0 to 80
  compositeImageUrl: string | null;
  // Optional convenience aliases
  songTitle?: string;
  artistOrNames?: string;
  lyricsText?: string;
  dateOrInscription?: string;
  textAlign?: 'center' | 'left' | 'right';
  layout?: LyricTemplateLayout;
}

export const LYRIC_CANVAS_CATEGORIES: { id: LyricTemplateCategory; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'wedding', label: 'Wedding & Gifts' },
  { id: 'first_dance', label: 'First Dance' },
  { id: 'vows', label: 'Wedding Vows' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'sheet_music', label: 'Sheet Music' },
  { id: 'couples', label: 'Couples Art' }
];

// All 12 templates matching the reference screenshots
export const LYRIC_CANVAS_TEMPLATES: LyricCanvasTemplate[] = [
  {
    id: 'wedding-song-lyrics',
    name: 'Personalized Wedding Picture Canvas Prints With Song Lyrics',
    category: 'wedding',
    previewImage: '/assets/lyric-canvas/wedding-song-lyrics.svg',
    description: 'Cherish your wedding moments with flowing romantic song lyrics softly layered over your couple portrait.',
    defaultLayout: 'photo-lyrics-overlay',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Playfair Display',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#FFFFFF',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'A THOUSAND YEARS',
      artistOrSubtitle: 'CHRISTINA PERRI',
      lyrics: "Heart beats fast, colors and promises\nHow to be brave? How can I love when I'm afraid to fall?\nI have died every day waiting for you\nDarling, don't be afraid\nI have loved you for a thousand years\nI'll love you for a thousand more",
      dateOrNames: 'SARAH & DAVID • OCTOBER 14, 2024'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Designer will harmonize typography placement with your photo composition.'
  },
  {
    id: 'wedding-first-dance',
    name: 'Wedding First Dance Song Lyrics',
    category: 'first_dance',
    previewImage: '/assets/lyric-canvas/wedding-first-dance.svg',
    description: 'Capture the magic of your first dance with romantic song lyrics framed in a modern frosted plaque.',
    defaultLayout: 'first-dance-card',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Dancing Script',
      fontSize: 'base',
      fontStyle: 'italic',
      textColor: '#FFFFFF',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: "CAN'T HELP FALLING IN LOVE",
      artistOrSubtitle: 'OUR FIRST DANCE SONG',
      lyrics: "Wise men say only fools rush in\nBut I can't help falling in love with you\nLike a river flows surely to the sea\nDarling, so it goes, some things are meant to be\nTake my hand, take my whole life too\nFor I can't help falling in love with you",
      dateOrNames: 'EMMA & NOAH • ESTABLISHED 2024'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Includes modern frosted glass card treatment over the first dance photograph.'
  },
  {
    id: 'wedding-vows-wall-art',
    name: 'Turn Wedding Vows into Wall Art',
    category: 'vows',
    previewImage: '/assets/lyric-canvas/wedding-vows-wall-art.svg',
    description: 'Timeless split canvas layout featuring your wedding ceremony photo paired with your personal vows.',
    defaultLayout: 'wedding-vows-photo',
    defaultBackground: {
      color: '#FEFCE8',
      texture: 'parchment',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Cormorant Garamond',
      fontSize: 'base',
      fontStyle: 'italic',
      textColor: '#1C1917',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'OUR SACRED WEDDING VOWS',
      artistOrSubtitle: 'PROMISES FOR A LIFETIME',
      lyrics: "I take you to be my partner for life.\nTo laugh with you in joy, to comfort you in sorrow,\nTo encourage you in your dreams and cherish you through every season.\nThrough sunshine and through storm, in sickness and in health,\nAs long as we both shall live,\nMy heart is forever your home.",
      dateOrNames: 'MICHAEL & JESSICA • JUNE 22, 2024'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Displays photo on left and vows in crisp calligraphic typography on right.'
  },
  {
    id: 'first-marriage-anniversary',
    name: 'First Marriage Anniversary Songs on Canvas',
    category: 'anniversary',
    previewImage: '/assets/lyric-canvas/first-marriage-anniversary.svg',
    description: 'Celebrate 365 days of love with your anniversary song and couple portrait in sleek editorial typography.',
    defaultLayout: 'split-side-by-side',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Cinzel',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#F4F4F5',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: '1ST ANNIVERSARY',
      artistOrSubtitle: '365 DAYS OF HAPPINESS',
      lyrics: "Every single day with you is a gift.\nYou are my today and all of my tomorrows.\nThrough every laughter and every journey,\nLoving you has been the easiest and most beautiful choice\nI have ever made.",
      dateOrNames: 'SOPHIA & JAMES • ONE YEAR DOWN, FOREVER TO GO'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Editorial anniversary edition with high-contrast monochrome typography.'
  },
  {
    id: 'personalized-wedding-gift',
    name: 'Personalized Wedding Gift Canvas Prints',
    category: 'wedding',
    previewImage: '/assets/lyric-canvas/personalized-wedding-gift.svg',
    description: 'An unforgettable gift featuring the newlyweds photo with an elegant lower-third lyric banner.',
    defaultLayout: 'bottom-third-lyrics',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Playfair Display',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#FEF08A',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'ALL OF ME LOVES ALL OF YOU',
      artistOrSubtitle: 'JOHN LEGEND',
      lyrics: "'Cause all of me loves all of you\nLove your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I'll give my all to you\nYou're my end and my beginning",
      dateOrNames: 'OLIVIA & LIAM • CELEBRATING LOVE'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Full-bleed portrait photo with lower-third gold accent typography.'
  },
  {
    id: 'forever-young-lyrics',
    name: 'Forever Young — Song Lyrics on Canvas',
    category: 'wedding',
    previewImage: '/assets/lyric-canvas/forever-young-lyrics.svg',
    description: 'Inspirational Bob Dylan folk classic lyrics with golden hour glow over cherished family and couple photos.',
    defaultLayout: 'photo-lyrics-overlay',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Cinzel',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#FFFBEB',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'FOREVER YOUNG',
      artistOrSubtitle: 'BOB DYLAN',
      lyrics: "May God bless and keep you always\nMay your wishes all come true\nMay you always do for others and let others do for you\nMay you build a ladder to the stars and climb on every rung\nMay you stay forever young",
      dateOrNames: 'BLESSINGS FOR A LIFETIME • ESTABLISHED 2024'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Warm golden hues and timeless classic serif typography.'
  },
  {
    id: 'wedding-vows-canvas',
    name: 'Canvas Wall Art — Wedding Vows Canvas',
    category: 'vows',
    previewImage: '/assets/lyric-canvas/wedding-vows-canvas.svg',
    description: 'Sacred wedding promises crafted in romantic cursive script with decorative double-line border detailing.',
    defaultLayout: 'classic-centered-lyrics',
    defaultBackground: {
      color: '#FAF5FF',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Dancing Script',
      fontSize: 'lg',
      fontStyle: 'italic',
      textColor: '#581C87',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'TO HAVE AND TO HOLD',
      artistOrSubtitle: 'FROM THIS DAY FORWARD',
      lyrics: "From this day forward, for better, for worse,\nFor richer, for poorer, in sickness and in health,\nTo love and to cherish, till death do us part.\nI give you my hand, my heart, and my love.",
      dateOrNames: 'ALEX & TAYLOR • OUR SACRED PROMISE'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Clean botanical and vows typography on canvas.'
  },
  {
    id: 'sheet-music-wall-art',
    name: 'Sheet Music Canvas Print — Wall Art',
    category: 'sheet_music',
    previewImage: '/assets/lyric-canvas/sheet-music-wall-art.svg',
    description: 'Vintage stave, clef and musical notes canvas background paired with your song title, couple names, and lyrics.',
    defaultLayout: 'sheet-music-bg',
    defaultBackground: {
      color: '#FEF9C3',
      texture: 'sheet-music',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Cinzel',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#78350F',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'CANON IN D MAJOR',
      artistOrSubtitle: 'OUR SONG WRITTEN IN THE STARS',
      lyrics: "Music gives a soul to the universe,\nWings to the mind, flight to the imagination,\nAnd life to everything.\nOur song will play on in our hearts forever.",
      dateOrNames: 'SARAH & LUCAS • FIRST DANCE SCORE'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Features authentic vintage sheet music stave illustration.'
  },
  {
    id: 'first-anniversary-gift',
    name: 'First Wedding Anniversary Gift',
    category: 'anniversary',
    previewImage: '/assets/lyric-canvas/first-anniversary-gift.svg',
    description: 'Statement quote design with large decorative quotation marks on blush canvas for him or her.',
    defaultLayout: 'quote-solid-bg',
    defaultBackground: {
      color: '#FCE7F3',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Playfair Display',
      fontSize: 'base',
      fontStyle: 'normal',
      textColor: '#831843',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: '1ST ANNIVERSARY FOR HIM & HER',
      artistOrSubtitle: '365 DAYS OF UNCONDITIONAL LOVE',
      lyrics: "Love is a partnership of two people who bring out\nthe very best in each other.\nThank you for 365 days of smiles,\nlaughter, and endless love.",
      dateOrNames: 'HAPPY 1ST ANNIVERSARY • TO MY FOREVER'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Typographic quote style with optional photo background.'
  },
  {
    id: 'couples-personalized-art',
    name: 'Personalized Canvas Art Couples Gifts',
    category: 'couples',
    previewImage: '/assets/lyric-canvas/couples-personalized-art.svg',
    description: 'Split modern layout pairing your favorite couple snapshot with a sweet song lyric and heart emblem.',
    defaultLayout: 'split-side-by-side',
    defaultBackground: {
      color: '#FEF9C3',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Dancing Script',
      fontSize: 'base',
      fontStyle: 'italic',
      textColor: '#854D0E',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'BETTER TOGETHER',
      artistOrSubtitle: 'JACK JOHNSON',
      lyrics: "It's always better when we're together.\nWe'll look at the stars when we're together,\nWell, it's always better when we're together.",
      dateOrNames: 'JACK & CHLOE • TOGETHER IS OUR FAVORITE PLACE'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Cozy split canvas with hand-drawn red heart motif.'
  },
  {
    id: 'first-dance-lyrics',
    name: 'First Dance Canvas — Your Wedding Song Lyrics on Canvas',
    category: 'first_dance',
    previewImage: '/assets/lyric-canvas/first-dance-lyrics.svg',
    description: 'Large calligraphic "Love" headline with biblical 1 Corinthians love poem or your wedding song lyrics.',
    defaultLayout: 'classic-centered-lyrics',
    defaultBackground: {
      color: '#FEFCE8',
      texture: 'parchment',
      overlayDarkness: 0
    },
    defaultTypography: {
      fontFamily: 'Cormorant Garamond',
      fontSize: 'base',
      fontStyle: 'italic',
      textColor: '#78350F',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'LOVE NEVER FAILS',
      artistOrSubtitle: '1 CORINTHIANS 13:4-8',
      lyrics: "Love is patient, love is kind.\nIt does not envy, it does not boast.\nIt always protects, always trusts,\nAlways hopes, always perseveres.\nLove never fails.",
      dateOrNames: 'DANIEL & CHARLOTTE • FIRST DANCE MEMORIES'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Classic script "Love" header on gallery-wrapped canvas.'
  },
  {
    id: 'wedding-vows-1st-anniversary',
    name: 'Wedding Vows on Canvas — Anniversary Gift',
    category: 'vows',
    previewImage: '/assets/lyric-canvas/wedding-vows-1st-anniversary.svg',
    description: 'Golden hour sunset couple photo with anniversary vow renewal typography along the lower third.',
    defaultLayout: 'bottom-third-lyrics',
    defaultBackground: {
      color: '#FFFFFF',
      overlayDarkness: 35
    },
    defaultTypography: {
      fontFamily: 'Dancing Script',
      fontSize: 'base',
      fontStyle: 'italic',
      textColor: '#FEF08A',
      alignment: 'center'
    },
    supportsPhoto: true,
    defaultText: {
      title: 'I CHOOSE YOU OVER AND OVER AGAIN',
      artistOrSubtitle: '1ST ANNIVERSARY VOW RENEWAL',
      lyrics: "Without pause, without a doubt, in a heartbeat.\nThrough every laughter and every trial,\nI'll keep choosing you.\nToday, tomorrow, and for all the days to come.",
      dateOrNames: 'ONE YEAR OF HAPPINESS • FOREVER TO GO'
    },
    priceAdjustment: 0,
    available: true,
    themeNote: 'Sunset romantic atmosphere with vow renewal dedication.'
  }
];

export const DEFAULT_LYRIC_CONFIG: LyricCanvasConfig = {
  selectedTemplateId: 'wedding-song-lyrics',
  title: 'A THOUSAND YEARS',
  artistOrSubtitle: 'CHRISTINA PERRI',
  lyrics: "Heart beats fast, colors and promises\nHow to be brave? How can I love when I'm afraid to fall?\nI have died every day waiting for you\nDarling, don't be afraid\nI have loved you for a thousand years\nI'll love you for a thousand more",
  dateOrNames: 'SARAH & DAVID • OCTOBER 14, 2024',
  fontFamily: 'Playfair Display',
  textColor: '#FFFFFF',
  alignment: 'center',
  overlayDarkness: 35,
  compositeImageUrl: null
};

// Centralized helper to get template by ID
export function getLyricTemplate(id: string): LyricCanvasTemplate {
  const match = LYRIC_CANVAS_TEMPLATES.find((t) => t.id === id);
  return match || LYRIC_CANVAS_TEMPLATES[0];
}

// Popular Preset Songs for Quick Selection in Studio
export const POPULAR_LYRIC_PRESETS = [
  {
    title: 'A THOUSAND YEARS',
    artist: 'CHRISTINA PERRI',
    lyrics: "Heart beats fast, colors and promises\nHow to be brave? How can I love when I'm afraid to fall?\nI have died every day waiting for you\nDarling, don't be afraid\nI have loved you for a thousand years\nI'll love you for a thousand more"
  },
  {
    title: "CAN'T HELP FALLING IN LOVE",
    artist: 'ELVIS PRESLEY',
    lyrics: "Wise men say only fools rush in\nBut I can't help falling in love with you\nLike a river flows surely to the sea\nDarling, so it goes, some things are meant to be\nTake my hand, take my whole life too\nFor I can't help falling in love with you"
  },
  {
    title: 'PERFECT',
    artist: 'ED SHEERAN',
    lyrics: "Baby, I'm dancing in the dark\nWith you between my arms\nBarefoot on the grass\nListening to our favorite song\nWhen you said you looked a mess\nI whispered underneath my breath\nYou heard it, darling\nYou look perfect tonight"
  },
  {
    title: 'ALL OF ME',
    artist: 'JOHN LEGEND',
    lyrics: "'Cause all of me loves all of you\nLove your curves and all your edges\nAll your perfect imperfections\nGive your all to me, I'll give my all to you\nYou're my end and my beginning\nEven when I lose I'm winning"
  },
  {
    title: 'OUR SACRED WEDDING VOWS',
    artist: 'WEDDING CEREMONY',
    lyrics: "I take you to be my partner for life.\nTo laugh with you in joy, to comfort you in sorrow,\nTo encourage you in your dreams and cherish you through every season.\nThrough sunshine and through storm, in sickness and in health,\nAs long as we both shall live,\nMy heart is forever your home."
  },
  {
    title: 'FOREVER YOUNG',
    artist: 'BOB DYLAN',
    lyrics: "May God bless and keep you always\nMay your wishes all come true\nMay you always do for others and let others do for you\nMay you build a ladder to the stars and climb on every rung\nMay you stay forever young"
  }
];

// Predefined size options specifically tailored for Lyric on Canvas
export const LYRIC_CANVAS_SIZE_OPTIONS = [
  {
    id: 'lyric-8x8',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 8" × 8"',
    dimensionsSummary: '8" × 8"',
    price: 1498.50,
    widthInches: 8,
    heightInches: 8,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '8" × 8"', widthRatio: 8, heightRatio: 8 }]
  },
  {
    id: 'lyric-10x10',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 10" × 10"',
    dimensionsSummary: '10" × 10"',
    price: 1699.00,
    widthInches: 10,
    heightInches: 10,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '10" × 10"', widthRatio: 10, heightRatio: 10 }]
  },
  {
    id: 'lyric-12x12',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 12" × 12"',
    dimensionsSummary: '12" × 12"',
    price: 1899.00,
    widthInches: 12,
    heightInches: 12,
    categories: ['RECOMMENDED', 'SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '12" × 12"', widthRatio: 12, heightRatio: 12 }]
  },
  {
    id: 'lyric-16x16',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 16" × 16"',
    dimensionsSummary: '16" × 16"',
    price: 2299.00,
    widthInches: 16,
    heightInches: 16,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '16" × 16"', widthRatio: 16, heightRatio: 16 }]
  },
  {
    id: 'lyric-20x20',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 20" × 20"',
    dimensionsSummary: '20" × 20"',
    price: 2799.00,
    widthInches: 20,
    heightInches: 20,
    categories: ['SQUARE'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '20" × 20"', widthRatio: 20, heightRatio: 20 }]
  },
  {
    id: 'lyric-12x18',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 12" × 18"',
    dimensionsSummary: '12" × 18"',
    price: 1999.00,
    widthInches: 12,
    heightInches: 18,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '12" × 18"', widthRatio: 12, heightRatio: 18 }]
  },
  {
    id: 'lyric-16x20',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 16" × 20"',
    dimensionsSummary: '16" × 20"',
    price: 2499.00,
    widthInches: 16,
    heightInches: 20,
    categories: ['RECOMMENDED'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '16" × 20"', widthRatio: 16, heightRatio: 20 }]
  },
  {
    id: 'lyric-18x24',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 18" × 24"',
    dimensionsSummary: '18" × 24"',
    price: 2999.00,
    widthInches: 18,
    heightInches: 24,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '18" × 24"', widthRatio: 18, heightRatio: 24 }]
  },
  {
    id: 'lyric-20x30',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 20" × 30"',
    dimensionsSummary: '20" × 30"',
    price: 3499.00,
    widthInches: 20,
    heightInches: 30,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '20" × 30"', widthRatio: 20, heightRatio: 30 }]
  },
  {
    id: 'lyric-24x36',
    productTypeId: 'canvas-lyric',
    label: 'Lyric Canvas: 24" × 36"',
    dimensionsSummary: '24" × 36"',
    price: 4299.00,
    widthInches: 24,
    heightInches: 36,
    categories: ['PANORAMIC'],
    panels: [{ id: 'p0', label: 'Lyric Canvas', dimension: '24" × 36"', widthRatio: 24, heightRatio: 36 }]
  }
];
