export interface ProductItem {
  id: string;
  name: string;
  category: 'Canvas' | 'Acrylic' | 'Cork' | 'Wall Art' | 'Frames' | 'Custom';
  tagline: string;
  description: string;
  specs: string[];
  imageUrl: string;
  badge?: string;
  startingPrice: string;
  originalPrice?: string;
  discount?: string;
  leadTime: string;
  popularFor: string;
  rating: number;
  reviewCount: number;
}

export interface MaterialDetail {
  id: 'canvas' | 'acrylic' | 'cork';
  name: string;
  tagline: string;
  subtitle: string;
  vibe: string;
  textureNote: string;
  description: string;
  qualities: string[];
  applications: string[];
  heroImage: string;
  detailImage: string;
  accentColor: string;
  bgAtmosphere: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  location: string;
  materialsUsed: string[];
  description: string;
  outcome: string;
  imageUrl: string;
  gridSpan?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  designation: string;
  company: string;
  location: string;
  sector: string;
  rating?: number;
}

export interface IndustryApplication {
  id: string;
  name: string;
  category: string;
  description: string;
  suitableMaterials: string[];
  imageUrl: string;
  iconName: string;
}

export const MATERIALS_DATA: Record<'canvas' | 'acrylic' | 'cork', MaterialDetail> = {
  canvas: {
    id: 'canvas',
    name: 'Canvas',
    tagline: 'Bring photographs and artwork to life.',
    subtitle: 'Woven archival cotton for timeless gallery presence',
    vibe: 'Artistic & Tactile',
    textureNote: 'Natural 420 GSM cotton weave with archival gesso priming',
    description:
      'Engineered for fine artists, interior decorators, and high-impact living spaces. Hand-stretched onto kiln-dried solid pine stretcher bars with 12-color archival pigment inks.',
    qualities: [
      'Archival 100+ Year Pigment Retention',
      '420 GSM Heavyweight Pure Cotton & Linen Blends',
      'Anti-sag Kiln-Dried Pine Stretcher Bars (1.5" - 2" depth)',
      'UV-resistant satin or matte protective topcoats',
    ],
    applications: [
      'Museum Reproductions & Gallery Exhibitions',
      'Bespoke Hotel & Hospitality Wall Paneling',
      'High-End Residential Artwork',
      'Architectural Acoustic Canvas Installations',
    ],
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85',
    detailImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#166534',
    bgAtmosphere: 'from-emerald-50 to-stone-100',
  },
  acrylic: {
    id: 'acrylic',
    name: 'Acrylic',
    tagline: 'Premium clarity. Modern presentation.',
    subtitle: 'Optical cast crystal brilliance with diamond-milled edges',
    vibe: 'Clean, Transparent & Luminous',
    textureNote: '92% light transmittance, diamond-polished edges, shatterproof cast acrylic',
    description:
      'Where contemporary architecture meets surgical precision. Our optical cast acrylic sheets deliver diamond-polished brilliance, floating standoffs, and radiant sub-surface prints.',
    qualities: [
      'Cast Acrylic with 92% Optical Transparency',
      'Precision CNC Laser Cutting & Diamond Edge Polishing',
      'Direct UV Sub-surface Printing with Opaque White Backer',
      'Brushed Stainless Steel Floating Architectural Standoffs',
    ],
    applications: [
      'Luxury Retail Vitrines & Point-of-Sale Displays',
      'Frameless Fine-Art Acrylic Glass Float Prints',
      'Corporate Headquarters Directional & Logo Signage',
      'Minimalist Contemporary Furniture & Partitions',
    ],
    heroImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=85',
    detailImage: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#0284C7',
    bgAtmosphere: 'from-sky-50 to-stone-100',
  },
  cork: {
    id: 'cork',
    name: 'Cork',
    tagline: 'Natural texture. Endless possibilities.',
    subtitle: 'Harvested from regenerative bark for thermal and sound warmth',
    vibe: 'Natural, Sustainable & Earthy',
    textureNote: 'High-density micro-grain Portuguese bark with natural elastic memory',
    description:
      'Sustainably harvested without harming trees, our Portuguese cork solutions bring warmth, tactile elegance, and acoustic dampening to contemporary workplaces, hospitality, and living spaces.',
    qualities: [
      '100% Biodegradable & Harvested Sustainably',
      'Self-Healing Micro-Grain Surface (No Visible Pinholes)',
      'Class-A Noise Reduction Coefficient (NRC 0.45 - 0.70)',
      'Naturally Hypoallergenic, Fire-Retardant & Anti-static',
    ],
    applications: [
      'Modular Acoustic Wall Cladding & Hexagonal Panels',
      'Executive Pinboards with Anodized Aluminum Frames',
      'Interactive Design Studio War-Rooms & Workbenches',
      'Zero-Waste Packaging & Sensory Display Blocks',
    ],
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
    detailImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#D97706',
    bgAtmosphere: 'from-amber-50 to-stone-100',
  },
};

export const FEATURED_PRODUCTS: ProductItem[] = [
  {
    id: 'premium-canvas-print',
    name: 'Premium Canvas Print',
    category: 'Canvas',
    tagline: 'Archival museum-wrapped personalized canvas',
    description: 'High-definition fine art reproduction on 420 GSM pure cotton with tailored corners and archival UV seal.',
    specs: ['420 GSM Cotton Canvas', '1.75" Gallery Depth', 'UV Glaze Protection', 'Ready to Hang'],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    badge: '50% OFF',
    startingPrice: '₹499',
    originalPrice: '₹999',
    discount: '50% OFF',
    leadTime: '2-3 Business Days',
    popularFor: 'Living Rooms & Family Portraits',
    rating: 4.9,
    reviewCount: 384,
  },
  {
    id: 'acrylic-photo-print',
    name: 'Acrylic Photo Print',
    category: 'Acrylic',
    tagline: 'High-gloss optical brilliance with diamond-polished edges',
    description: 'Sub-surface archival print behind 4mm optical cast acrylic with crystal-clarity and stainless steel standoffs.',
    specs: ['4mm Optical Cast Acrylic', 'Diamond Edge Milled', 'Sub-Surface UV Print', 'Floating Standoffs Included'],
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    badge: 'BESTSELLER',
    startingPrice: '₹699',
    originalPrice: '₹1,399',
    discount: '50% OFF',
    leadTime: '2-3 Business Days',
    popularFor: 'Modern Homes & Executive Walls',
    rating: 4.95,
    reviewCount: 420,
  },
  {
    id: 'cork-photo-board',
    name: 'Cork Photo Board',
    category: 'Cork',
    tagline: 'High-density self-healing natural bulletin & photo board',
    description: 'Crafted from sustainable Portuguese cork that self-repairs without visible pinhole marks. Frame with photo prints or pins.',
    specs: ['Self-Healing Micro-Grain', 'Sleek Anodized Edge', 'Acoustic Backing', 'Pushpins Included'],
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    badge: 'ECO-FRIENDLY',
    startingPrice: '₹549',
    originalPrice: '₹1,099',
    discount: '50% OFF',
    leadTime: '2-3 Business Days',
    popularFor: 'Home Offices & Vision Boards',
    rating: 4.88,
    reviewCount: 260,
  },
  {
    id: 'framed-wall-art',
    name: 'Framed Wall Art',
    category: 'Frames',
    tagline: 'Hand-finished solid wood floater & gallery frames',
    description: 'Solid ash, oak, and teak wood floater frames with an elegant 6mm shadow float gap around gallery canvas.',
    specs: ['Solid Teak / Ash Wood', 'Precision Mitered Corners', '6mm Shadow Float Gap', 'Acid-Free Backing'],
    imageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    badge: 'POPULAR',
    startingPrice: '₹899',
    originalPrice: '₹1,799',
    discount: '50% OFF',
    leadTime: '3-4 Business Days',
    popularFor: 'Curated Walls & Interior Design',
    rating: 4.94,
    reviewCount: 195,
  },
  {
    id: 'split-canvas-set',
    name: 'Split Canvas 3-Piece Set',
    category: 'Canvas',
    tagline: 'Panoramic multi-panel triptych wall artwork',
    description: 'Transform a single panoramic landscape or cherished photo across 3 sequential gallery-wrapped canvas panels.',
    specs: ['3-Panel Triptych', '420 GSM Cotton Weave', 'Matching Pattern Borders', 'Pre-Installed Wall Hooks'],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    badge: '50% OFF',
    startingPrice: '₹1,499',
    originalPrice: '₹2,999',
    discount: '50% OFF',
    leadTime: '2-3 Business Days',
    popularFor: 'Living Room Sofas & Master Bedrooms',
    rating: 4.92,
    reviewCount: 310,
  },
  {
    id: 'tabletop-acrylic-block',
    name: 'Tabletop Acrylic Block',
    category: 'Acrylic',
    tagline: 'Freestanding 20mm diamond-milled crystal photo block',
    description: 'Ultra-thick solid cast acrylic block standing securely on any desk or shelf with 3D prism depth and luminous clarity.',
    specs: ['20mm Ultra-Thick Block', 'Freestanding (No Base Needed)', 'Diamond Lapped Edges', 'Scratch-Resistant Face'],
    imageUrl: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=800&q=80',
    badge: 'GIFTING FAVOURITE',
    startingPrice: '₹399',
    originalPrice: '₹799',
    discount: '50% OFF',
    leadTime: '2 Business Days',
    popularFor: 'Work Desks & Corporate Gifts',
    rating: 4.96,
    reviewCount: 520,
  },
  {
    id: 'acoustic-hexagon-cork',
    name: 'Hexagon Acoustic Cork Tiles (Set of 6)',
    category: 'Cork',
    tagline: 'Modular geometric wall tiles for acoustic sound dampening',
    description: 'Precision laser-cut 100% natural Portuguese cork hexagons with high-tack peel & stick backing for easy DIY patterns.',
    specs: ['Pack of 6 Tiles', '12mm Acoustic Thickness', 'Peel & Stick Adhesive', 'Self-Healing Surface'],
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    badge: '44% OFF',
    startingPrice: '₹899',
    originalPrice: '₹1,599',
    discount: '44% OFF',
    leadTime: '2-3 Business Days',
    popularFor: 'Home Studios & Creator Setups',
    rating: 4.87,
    reviewCount: 178,
  },
  {
    id: 'custom-corporate-display',
    name: 'Custom Corporate Display',
    category: 'Custom',
    tagline: 'Architectural brand walls & bespoke logo signage',
    description: 'Complete integrated installations combining backlit acrylic lettering, acoustic cork panels, and canvas brand timelines.',
    specs: ['Multi-Material Atelier Spec', 'Precision CNC Routing', 'Concealed LED Fixtures', 'Turnkey Pan-India Delivery'],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    badge: 'ENTERPRISE',
    startingPrice: '₹3,499',
    originalPrice: '₹5,999',
    discount: '42% OFF',
    leadTime: '4-5 Business Days',
    popularFor: 'Offices, Reception & Boardrooms',
    rating: 4.98,
    reviewCount: 112,
  },
];

export const BRAND_PILLARS = [
  {
    number: '01',
    title: 'Material Authenticity',
    description:
      'Every roll of canvas is tested for tensile stability. Every acrylic sheet is optical-grade cast monomer. Every cork block is sustainably harvested without synthetic binders.',
  },
  {
    number: '02',
    title: 'Precision Finishing',
    description:
      'We combine Swiss CNC laser cutting, diamond micro-polishing, and time-tested hand stretching to ensure sub-millimeter tolerances on every piece.',
  },
  {
    number: '03',
    title: 'Custom Engineering',
    description:
      'From a single 10-foot lobby canvas to 500 bespoke acrylic signage suites for pan-India retail, our workshop is designed for bespoke scale.',
  },
  {
    number: '04',
    title: 'Sustainable Responsibility',
    description:
      'Low-VOC water-based inks, renewable Portuguese cork, fully recyclable acrylic offcuts, and FSC-certified kiln-dried stretcher wood.',
  },
];

export const PROJECT_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'corporate-office',
    title: 'Mindspace Financial Hub',
    client: 'Mindspace Financial & Tech HQ',
    category: 'Corporate Office',
    location: 'Gurugram & Mumbai',
    materialsUsed: ['Acoustic Portuguese Cork Tiles', 'Backlit Cast Acrylic Signage', 'Gallery Cotton Canvas'],
    description:
      'Transformed 24,000 sq ft across 4 executive floors with acoustic cork strategy pods, laser-milled acrylic architectural directories, and large-format heritage canvases.',
    outcome: '42% sound reverberation reduction with unified brand identity across 800 workstations.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    gridSpan: 'col-span-1 md:col-span-2',
  },
  {
    id: 'modern-home',
    title: 'The Alibaug Coastal Villa',
    client: 'Private Residence & Atelier',
    category: 'Modern Home',
    location: 'Alibaug, Maharashtra',
    materialsUsed: ['Custom Belgian Linen Canvas', 'Solid Ashwood Floater Frames', 'Optical Acrylic Floating Glass'],
    description:
      'Curated large-scale triptych canvas commissions and ultra-clear acrylic family portraits harmonized with sea-breeze moisture protection coatings.',
    outcome: 'Zero warpage or moisture degradation in tropical coastal conditions over 3 years.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'retail-display',
    title: 'Titan Luxury Flagship Showcase',
    client: 'Titan Company Luxury Division',
    category: 'Retail Display',
    location: 'Bangalore & Mumbai',
    materialsUsed: ['12mm Diamond-Polished Acrylic', 'Sub-Surface Gold Metallic UV', 'Concealed LED Mounts'],
    description:
      'Precision vitrines, glowing display pedestals, and frameless floating acrylic signage installed across 18 flagship stores.',
    outcome: '92% optical clarity with pristine scratch-resistant micro-coatings.',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hotel-interior',
    title: 'The Heritage Sanctuary Suites',
    client: 'The Oberoi & Leela Group',
    category: 'Hotel Interior',
    location: 'Jaipur & Udaipur',
    materialsUsed: ['Archival Gesso Canvas', 'Hand-Stained Teakwood Frames', 'Acoustic Headboard Cork'],
    description:
      'Bespoke production of 160 oversized lobby and presidential suite canvas art installations honoring traditional Indian artistry with modern architectural framing.',
    outcome: 'Rated immaculate by hotel art conservationists with zero frame deflection.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85',
    gridSpan: 'col-span-1 md:col-span-2',
  },
  {
    id: 'creative-studio',
    title: 'Studio Vistara Design Lab',
    client: 'Studio Vistara Architecture',
    category: 'Creative Studio',
    location: 'Bengaluru',
    materialsUsed: ['Self-Healing Cork Pinboards', 'Magnetic Acrylic Moodboards', 'Wide-Span Canvas Prints'],
    description:
      'Full floor-to-ceiling modular cork presentation walls and crystal-clear acrylic specification overlays for intense daily architectural critiques.',
    outcome: 'Pins leave zero visible holes after 10,000+ insertions with Class-A acoustic buffering.',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=85',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Canvas India delivers an optical purity in cast acrylic and tensile tautness in gallery canvas that we previously had to import from Milan. They are our definitive manufacturing partner for hospitality projects across South Asia.',
    author: 'Sunita Mehra',
    designation: 'Principal Architect & Partner',
    company: 'Studio Vistara Design',
    location: 'Mumbai',
    sector: 'Luxury Hospitality Architecture',
    rating: 5,
  },
  {
    quote:
      'Their Portuguese cork acoustic wall cladding completely transformed our open-plan design floor. The self-healing texture means hundreds of pins leave zero scars even after months of intense sprint reviews.',
    author: 'Vikramaditya Rao',
    designation: 'VP of Product Experience',
    company: 'NextGen Mobility Corp',
    location: 'Bengaluru',
    sector: 'Enterprise Creative Tech',
    rating: 5,
  },
  {
    quote:
      'Finding a manufacturer that understands sub-millimeter tolerances for museum float mounts is exceptionally rare in India. Canvas India is in a tier of its own.',
    author: 'Ananya Deshmukh',
    designation: 'Senior Curator & Gallerist',
    company: 'Kala Kendra Modern Art',
    location: 'New Delhi',
    sector: 'Fine Art & Museum Curation',
    rating: 5,
  },
];

export const INDUSTRY_APPLICATIONS: IndustryApplication[] = [
  {
    id: 'app-living-rooms',
    name: 'Living Rooms',
    category: 'LIVING ROOMS',
    description: 'Statement canvas triptychs, archival floating portraits, and natural cork accent walls crafted for contemporary Indian homes.',
    suitableMaterials: ['Canvas Wall Art', 'Floating Frames', 'Decorative Cork'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    iconName: 'Home',
  },
  {
    id: 'app-modern-offices',
    name: 'Modern Offices',
    category: 'MODERN OFFICES',
    description: 'Acoustic cork collaboration boards, sub-surface acrylic architectural directories, and motivational corporate canvas galleries.',
    suitableMaterials: ['Acoustic Cork Boards', 'Acrylic Signage', 'Canvas Sets'],
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    iconName: 'Briefcase',
  },
  {
    id: 'app-luxury-cafes',
    name: 'Luxury Cafes & Restaurants',
    category: 'LUXURY CAFES & RESTAURANTS',
    description: 'Gleaming diamond-polished acrylic menu showcases, atmospheric textured wall canvas art, and sound-absorbing natural cork baffles.',
    suitableMaterials: ['Optical Acrylic Prints', 'Moodboard Cork', 'Archival Canvas'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    iconName: 'Coffee',
  },
  {
    id: 'app-creative-studios',
    name: 'Creative Studios',
    category: 'CREATIVE STUDIOS',
    description: 'Self-healing Portuguese cork pin walls, high-clarity magnetic acrylic moodboards, and wide-gamut giclée artist prints.',
    suitableMaterials: ['Self-Healing Cork', 'Magnetic Acrylic', 'Artist Canvas'],
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    iconName: 'Palette',
  },
  {
    id: 'app-hotel-lobbies',
    name: 'Hotel Lobbies',
    category: 'HOTEL LOBBIES',
    description: 'Monumental 120-inch heritage canvas art, illuminated standoff acrylic installations, and bespoke organic acoustic installations.',
    suitableMaterials: ['Monumental Canvas', 'Illuminated Acrylic', 'Acoustic Wall Panels'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    iconName: 'Hotel',
  },
];
