// CanvasChamp Catalog Seed Data derived from src/data/productsData.ts
// Self-contained for backend deployment

export interface SeedCategory {
  name: string;
  slug: string;
  description: string | null;
}

export interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  basePrice: number;
  costPrice: number;
  description: string | null;
  sizes: string[];
  finishes: string[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    "name": "Canvas Frames",
    "slug": "canvas",
    "description": "Bring photographs, artwork, memories, and creative designs to life with premium canvas frames."
  },
  {
    "name": "Acrylic Prints & Acrylic Wall Art",
    "slug": "acrylic",
    "description": "For a modern, elegant and premium appearance, acrylic prints provide sharp imagery and vibrant visual impact."
  },
  {
    "name": "Posters & Custom Wall Graphics",
    "slug": "posters",
    "description": "Custom posters and wall graphics designed to transform the personality of residential and commercial spaces."
  },
  {
    "name": "Cork Products & Cork Décor",
    "slug": "cork",
    "description": "Natural-looking cork products combining warmth, texture and everyday functionality."
  },
  {
    "name": "Yoga Mats & Fitness Products",
    "slug": "yoga-fitness",
    "description": "Yoga mats and customized fitness products designed for yoga studios, gyms, wellness centers, corporate wellness programs, events and personal use."
  },
  {
    "name": "Home Décor Collection",
    "slug": "home-decor",
    "description": "Decorative and personalized products designed to add beauty, warmth and individuality to interiors."
  },
  {
    "name": "Custom Prints",
    "slug": "custom-prints",
    "description": "Create products based on your own design, size, material, quantity and finishing requirements."
  },
  {
    "name": "Gifts & Occasions",
    "slug": "gifts",
    "description": "Thoughtfully personalized gifts and commemorative prints for every celebration and festive milestone."
  },
  {
    "name": "Bulk Order Inquiries & Volume Production",
    "slug": "bulk-order",
    "description": "Volume manufacturing and custom print production for events, institutions, studios, and businesses."
  },
  {
    "name": "Corporate & Commercial Décor",
    "slug": "corporate-orders",
    "description": "Customized décor and visual products for businesses looking to create attractive and engaging environments."
  },
  {
    "name": "Wall Art",
    "slug": "wall-art",
    "description": "Curated statement wall art across canvas, acrylic and poster formats — botanical sets, Indian folk motifs, and modern abstract designs."
  },
  {
    "name": "Photo Frames",
    "slug": "photo-frames",
    "description": "Framed prints across our catalog — solid wood and metal frame finishes for canvas, cork and poster prints."
  }
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    "name": "Classic Family Photo Canvas",
    "slug": "classic-family-photo-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Stretched 380 GSM matte cotton canvas on solid pine frame. Skin-tone color balancing with mirrored wrap edges.",
    "sizes": [
      "8x10 inch",
      "12x18 inch",
      "16x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Matte Gallery Wrap",
      "Satin Lustre",
      "Black Floating Frame"
    ]
  },
  {
    "name": "Wedding Memories Canvas",
    "slug": "wedding-memories-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1899,
    "costPrice": 1139,
    "description": "Capture your wedding vows and romantic portraits on museum-grade canvas with rich vibrancy and archival longevity.",
    "sizes": [
      "12x18 inch",
      "16x24 inch",
      "20x30 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Gallery Stretched",
      "Teak Floater Frame",
      "White Modern Float"
    ]
  },
  {
    "name": "Nature Landscape Canvas",
    "slug": "nature-landscape-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Vivid, breathtaking landscape photography reproduced on textured cotton canvas, bringing the serenity of nature indoors.",
    "sizes": [
      "12x18 inch",
      "18x24 inch",
      "24x36 inch",
      "30x40 inch"
    ],
    "finishes": [
      "Matte Gallery Wrap",
      "Natural Teak Wood Frame"
    ]
  },
  {
    "name": "Motivational Quote Canvas",
    "slug": "motivational-quote-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 999,
    "costPrice": 599,
    "description": "Bold typography and inspirational messages crafted to elevate productivity and daily inspiration in studies and offices.",
    "sizes": [
      "8x10 inch",
      "12x18 inch",
      "16x24 inch"
    ],
    "finishes": [
      "Classic Wrap",
      "Minimalist Black Frame"
    ]
  },
  {
    "name": "Spiritual Canvas Art",
    "slug": "spiritual-canvas-art",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1599,
    "costPrice": 959,
    "description": "Sacred motifs and spiritual art printed with rich gold undertones and devotional clarity, perfect for mandirs and living spaces.",
    "sizes": [
      "12x18 inch",
      "16x24 inch",
      "20x30 inch"
    ],
    "finishes": [
      "Gold Accented Frame",
      "Gallery Wrap",
      "Warm Teak Frame"
    ]
  },
  {
    "name": "Corporate Office Canvas",
    "slug": "corporate-office-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 2199,
    "costPrice": 1319,
    "description": "Large-format branded office canvas featuring company milestones, mission values, and skyline graphics.",
    "sizes": [
      "16x24 inch",
      "24x36 inch",
      "36x48 inch",
      "Multi-Panel Set"
    ],
    "finishes": [
      "Architectural Matte Wrap",
      "Anodized Slim Floater Frame"
    ]
  },
  {
    "name": "Premium Living Room Canvas",
    "slug": "premium-living-room-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1799,
    "costPrice": 1079,
    "description": "Contemporary artwork set designed specifically to anchor sofas and living room feature walls.",
    "sizes": [
      "16x24 inch",
      "24x36 inch",
      "Set of 3 (12x18 each)"
    ],
    "finishes": [
      "Floating Oak Frame",
      "Matte Wrap"
    ]
  },
  {
    "name": "Personalized Photo Canvas",
    "slug": "personalized-photo-canvas",
    "categorySlug": "canvas",
    "categoryName": "Canvas",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Upload your digital camera or smartphone photo. We optimize contrast and stretch it over precision pine bars.",
    "sizes": [
      "8x10 inch",
      "12x12 inch",
      "12x18 inch",
      "16x20 inch"
    ],
    "finishes": [
      "Mirrored Edge Wrap",
      "Solid White Edge",
      "Solid Black Edge"
    ]
  },
  {
    "name": "Personalized Acrylic Photo Blocks",
    "slug": "acrylic-photo-block",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 999,
    "costPrice": 599,
    "description": "Personalized Acrylic Photo Blocks provide a clean, modern display for photographs and artwork, featuring crystal-clear cast acrylic, diamond-polished beveled edges, and an immersive dimensional appearance that stands freely on any desk, shelf, or tabletop without framing.",
    "sizes": [
      "4\" x 4\"",
      "6\" x 4\"",
      "4\" x 6\"",
      "5\" x 5\"",
      "5\" x 7\"",
      "7\" x 5\"",
      "6\" x 6\"",
      "8\" x 8\"",
      "10\" x 8\"",
      "8\" x 10\"",
      "12\" x 8\"",
      "8\" x 12\""
    ],
    "finishes": [
      "High Gloss Clear",
      "Anti-Glare Frosted Backing",
      "Diamond Beveled Edge"
    ]
  },
  {
    "name": "Ultra-Clear Acrylic Photo Panels",
    "slug": "acrylic-photo-panel",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 1799,
    "costPrice": 1079,
    "description": "High-definition photo prints encapsulated behind 5mm optical cast acrylic. Comes with pre-drilled holes and 4 brushed stainless steel floating wall standoffs for a floating museum effect.",
    "sizes": [
      "8\" x 10\"",
      "12\" x 12\"",
      "12\" x 18\"",
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\""
    ],
    "finishes": [
      "High Gloss Clear",
      "Anti-Glare Frosted",
      "Opaque White Backing"
    ]
  },
  {
    "name": "Modern Abstract Acrylic Wall Art",
    "slug": "acrylic-abstract-art",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 2199,
    "costPrice": 1319,
    "description": "Dynamic contemporary abstract art with vibrant fluid marble gradients. The glossy acrylic depth reflects ambient light to create a radiant interior focal point.",
    "sizes": [
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\"",
      "30\" x 45\""
    ],
    "finishes": [
      "Diamond Gloss",
      "Matte Non-Reflective"
    ]
  },
  {
    "name": "Family Heirloom Acrylic Print",
    "slug": "acrylic-family-print",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 1999,
    "costPrice": 1199,
    "description": "Preserve cherished wedding, anniversary, and family portraits on optical acrylic. The crystal layer shields memories from humidity and UV fading for generations.",
    "sizes": [
      "12\" x 18\"",
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\""
    ],
    "finishes": [
      "High Gloss",
      "Satin Anti-Glare"
    ]
  },
  {
    "name": "Corporate Architectural Acrylic Panel",
    "slug": "acrylic-corporate-panel",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 2499,
    "costPrice": 1499,
    "description": "Elevate boardrooms and executive spaces with branded architectural acrylic panels. Displays mission statements, core values, or milestone photography with pristine corporate aesthetics.",
    "sizes": [
      "18\" x 24\"",
      "24\" x 36\"",
      "30\" x 48\"",
      "36\" x 60\""
    ],
    "finishes": [
      "Crystal Clear",
      "Frosted Privacy Backing"
    ]
  },
  {
    "name": "Executive Reception Acrylic Artwork",
    "slug": "acrylic-reception-art",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 3499,
    "costPrice": 2099,
    "description": "Imposing large-format architectural acrylic panel customized with your company identity or statement cityscape. Creates an unforgettable first impression for visiting clients.",
    "sizes": [
      "24\" x 36\"",
      "30\" x 48\"",
      "36\" x 60\"",
      "Set of 3 Multi-Panel"
    ],
    "finishes": [
      "Diamond Polished Edge with LED Backlight Ready"
    ]
  },
  {
    "name": "Inspirational Typography Acrylic Print",
    "slug": "acrylic-inspirational-print",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Sleek motivational quote printed behind optical crystal glass. Minimalist monochrome typography designed to inspire daily focus on modern desks and study walls.",
    "sizes": [
      "6\" x 8\"",
      "8\" x 10\"",
      "12\" x 12\"",
      "12\" x 18\""
    ],
    "finishes": [
      "Gloss Clear",
      "Freestanding Desk Block"
    ]
  },
  {
    "name": "Contemporary Decorative Acrylic Panel",
    "slug": "acrylic-decorative-panel",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 2299,
    "costPrice": 1379,
    "description": "Luminous graphic artwork with 3D optical refraction. The high-gloss glass-like front illuminates interior colors with vibrant warmth, transforming plain walls into luxury art galleries.",
    "sizes": [
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\"",
      "30\" x 45\""
    ],
    "finishes": [
      "Diamond Edge Polish with 4 Metal Standoffs"
    ]
  },
  {
    "name": "Personalized Keepsake Acrylic Gift",
    "slug": "acrylic-gift",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 899,
    "costPrice": 539,
    "description": "A heavy, freestanding diamond-cut acrylic block featuring your personal photo and custom greeting message. Ships in a premium gift presentation box, making it an unforgettable gift.",
    "sizes": [
      "4\" x 4\"",
      "5\" x 5\"",
      "6\" x 4\"",
      "5\" x 7\"",
      "8\" x 8\""
    ],
    "finishes": [
      "Freestanding Desk Block",
      "Diamond Beveled Edges"
    ]
  },
  {
    "name": "High-Gloss Acrylic Art Poster",
    "slug": "acrylic-poster",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Transform traditional graphic posters into sleek modern acrylic panels. Water-resistant, wipe-clean surface with deep color contrast that never wrinkles or curls.",
    "sizes": [
      "12\" x 18\"",
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\""
    ],
    "finishes": [
      "High Gloss Clear",
      "Matte Anti-Glare"
    ]
  },
  {
    "name": "Precision Acrylic Business Signage",
    "slug": "acrylic-signage",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 2799,
    "costPrice": 1679,
    "description": "Premium acrylic office door, clinic, and corporate directory signage. Features laser-cut logo application, polished edges, and tamper-resistant stainless steel mounting hardware.",
    "sizes": [
      "12\" x 18\"",
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\""
    ],
    "finishes": [
      "Frosted Privacy",
      "Crystal Clear",
      "Solid Black Acrylic Backing"
    ]
  },
  {
    "name": "Custom Dimension Acrylic Wall Art",
    "slug": "custom-acrylic-wall-art",
    "categorySlug": "acrylic",
    "categoryName": "Acrylic",
    "basePrice": 2599,
    "costPrice": 1559,
    "description": "Design your own bespoke acrylic wall art by uploading high-resolution digital artwork, photography, or panoramas. Custom millimetre precision cutting with diamond-polished edges.",
    "sizes": [
      "12\" x 18\"",
      "16\" x 24\"",
      "20\" x 30\"",
      "24\" x 36\"",
      "30\" x 45\"",
      "36\" x 60\""
    ],
    "finishes": [
      "Diamond Gloss Clear",
      "Matte Anti-Glare",
      "Opaque White Barrier"
    ]
  },
  {
    "name": "Minimalist Home Poster",
    "slug": "minimalist-home-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 499,
    "costPrice": 299,
    "description": "Clean line art and Scandinavian-inspired minimalist posters printed on 300 GSM matte art paper.",
    "sizes": [
      "A4 (8.3x11.7 in)",
      "A3 (11.7x16.5 in)",
      "A2 (16.5x23.4 in)",
      "18x24 inch"
    ],
    "finishes": [
      "Print Only (Rolled)",
      "Matte Black Wood Frame",
      "Teak Wood Frame"
    ]
  },
  {
    "name": "Motivational Office Poster",
    "slug": "motivational-office-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 549,
    "costPrice": 329,
    "description": "High contrast typography and bold leadership quotes designed for startups, studios, and team breakout spaces.",
    "sizes": [
      "A3",
      "A2",
      "18x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Print Only",
      "Slim Black Metal Frame",
      "Laminated Board"
    ]
  },
  {
    "name": "Kids Room Poster",
    "slug": "kids-room-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 399,
    "costPrice": 239,
    "description": "Charming educational animal illustrations, solar system maps, and alphabet artwork printed with non-toxic eco inks.",
    "sizes": [
      "A4",
      "A3",
      "Set of 3 (A4 each)"
    ],
    "finishes": [
      "Print Only",
      "White Wood Frame with Shatterproof Glass"
    ]
  },
  {
    "name": "Fitness Motivation Poster",
    "slug": "fitness-motivation-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 599,
    "costPrice": 359,
    "description": "High energy fitness quotes, anatomy sketches, and bodybuilding motivation prints for home gyms and commercial fitness centers.",
    "sizes": [
      "12x18 inch",
      "18x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Print Only",
      "Laminated Foam Board Mount",
      "Black Frame"
    ]
  },
  {
    "name": "Café Wall Poster",
    "slug": "cafe-wall-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 649,
    "costPrice": 389,
    "description": "Artisanal coffee sketches, bistro chalkboard aesthetics, and vintage recipe typography tailored for cafés and dining nooks.",
    "sizes": [
      "A3",
      "A2",
      "18x24 inch"
    ],
    "finishes": [
      "Rustic Wooden Frame",
      "Matte Print"
    ]
  },
  {
    "name": "Corporate Wall Graphic",
    "slug": "corporate-wall-graphic",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Custom adhesive or framed wall graphics featuring company timelines, core values, or architectural skyline illustrations.",
    "sizes": [
      "24x36 inch",
      "36x48 inch",
      "Custom Wall Dimensions"
    ],
    "finishes": [
      "Peel & Stick Vinyl",
      "Stiff Board Mounted"
    ]
  },
  {
    "name": "Custom Photo Poster",
    "slug": "custom-photo-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 349,
    "costPrice": 209,
    "description": "Upload personal photos or artwork for ultra-high-resolution poster printing with true-to-life color calibration.",
    "sizes": [
      "12x18 inch",
      "16x24 inch",
      "20x30 inch"
    ],
    "finishes": [
      "Matte Finish",
      "Gloss Finish",
      "Framed"
    ]
  },
  {
    "name": "Event Display Poster",
    "slug": "event-display-poster",
    "categorySlug": "posters",
    "categoryName": "Posters",
    "basePrice": 799,
    "costPrice": 479,
    "description": "High impact graphics tailored for product launches, exhibitions, corporate conferences, and cultural events.",
    "sizes": [
      "24x36 inch",
      "30x40 inch",
      "Standee Insert Size"
    ],
    "finishes": [
      "Matte Lamination",
      "Gloss Lamination"
    ]
  },
  {
    "name": "Classic Cork Board",
    "slug": "classic-cork-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 899,
    "costPrice": 539,
    "description": "High-density 8mm natural Portuguese cork board with self-healing grain and matching natural pin accessories.",
    "sizes": [
      "12x18 inch",
      "18x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Natural Cork",
      "Solid Pine Wood Frame",
      "Dark Roast Cork"
    ]
  },
  {
    "name": "Office Pin Board",
    "slug": "office-pin-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Commercial notice and pin board encased in anodized aluminum with corner safety caps for office environments.",
    "sizes": [
      "18x24 inch",
      "24x36 inch",
      "36x48 inch"
    ],
    "finishes": [
      "Anodized Aluminum Frame",
      "Matte Black Aluminum"
    ]
  },
  {
    "name": "Kids Learning Cork Board",
    "slug": "kids-learning-cork-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 999,
    "costPrice": 599,
    "description": "Fun, colorful printed cork surface featuring world maps, alphabets, and activity calendars for children.",
    "sizes": [
      "12x18 inch",
      "18x24 inch"
    ],
    "finishes": [
      "World Map Print",
      "Activity Planner Grid",
      "Plain Natural"
    ]
  },
  {
    "name": "Memory Photo Cork Board",
    "slug": "memory-photo-cork-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Pin vacation polaroids, tickets, and love notes on a customized printed cork background with your family monogram.",
    "sizes": [
      "12x18 inch",
      "16x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Monogram Printed",
      "Travel Map Background",
      "Minimal Frame"
    ]
  },
  {
    "name": "Decorative Cork Panel",
    "slug": "decorative-cork-panel",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Acoustic decorative cork wall panels offering natural wood warmth, sound buffering, and textured tactile charm.",
    "sizes": [
      "Set of 6 Hexagons (8 inch each)",
      "24x24 inch Tiles",
      "18x36 inch Panel"
    ],
    "finishes": [
      "Natural Raw",
      "Dark Smoked",
      "Geometric Dual-Tone"
    ]
  },
  {
    "name": "Custom Shape Cork Board",
    "slug": "custom-shape-cork-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1399,
    "costPrice": 839,
    "description": "CNC laser-cut custom silhouette cork shapes including India maps, world continents, hearts, and company logos.",
    "sizes": [
      "18x18 inch",
      "24x24 inch",
      "Custom Dimensions"
    ],
    "finishes": [
      "India Map Contour",
      "Hexagon Modular",
      "World Map Silhouette"
    ]
  },
  {
    "name": "Creative Wall Cork Display",
    "slug": "creative-wall-cork-display",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1099,
    "costPrice": 659,
    "description": "Multi-functional cork display with built-in photo clips, brass pushpins, and magnetic accessory strip.",
    "sizes": [
      "12x24 inch",
      "16x32 inch"
    ],
    "finishes": [
      "White Pine Frame",
      "Warm Teak Frame"
    ]
  },
  {
    "name": "Personalized Cork Board",
    "slug": "personalized-cork-board",
    "categorySlug": "cork",
    "categoryName": "Cork",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Direct UV printed personalized family surname, wedding date, or inspirational office slogan permanently sealed onto cork.",
    "sizes": [
      "12x18 inch",
      "18x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Custom Name Printed",
      "Plain Cork with Engraved Frame"
    ]
  },
  {
    "name": "Classic Yoga Mat",
    "slug": "classic-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Eco-friendly textured 6mm TPE yoga mat with anti-skid bottom and alignment guide markings for daily asana practice.",
    "sizes": [
      "Standard 72x24 inch (6mm thick)",
      "Extra Long 76x26 inch (6mm)"
    ],
    "finishes": [
      "Ocean Blue",
      "Sage Green",
      "Lotus Purple"
    ]
  },
  {
    "name": "Premium Yoga Mat",
    "slug": "premium-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1899,
    "costPrice": 1139,
    "description": "Ultra-absorbent vegan microfiber suede bonded to a heavy natural tree rubber base for superior sweat-activated grip.",
    "sizes": [
      "72x24 inch (4.5mm thick)"
    ],
    "finishes": [
      "Mandala Sacred Print",
      "Marble Mineral Wave",
      "Indigo Haze"
    ]
  },
  {
    "name": "Personalized Yoga Mat",
    "slug": "personalized-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1699,
    "costPrice": 1019,
    "description": "Add your personal name, Sanskrit mantra, or monogram with permanent dye-sublimation print that will never peel or fade.",
    "sizes": [
      "72x24 inch (5mm)"
    ],
    "finishes": [
      "Custom Name Top Right",
      "Full Length Custom Monogram"
    ]
  },
  {
    "name": "Branded Yoga Mat",
    "slug": "branded-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Full-bleed custom logo and artwork printing for yoga studios, gyms, hotels, and wellness brands across India.",
    "sizes": [
      "72x24 inch (5mm)",
      "Studio Batch (10+ Units)"
    ],
    "finishes": [
      "Corner Studio Logo",
      "Full Center Artwork"
    ]
  },
  {
    "name": "Corporate Wellness Yoga Mat",
    "slug": "corporate-wellness-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1399,
    "costPrice": 839,
    "description": "Custom employee wellness mats with company branding, carry strap, and motivational wellness messaging.",
    "sizes": [
      "72x24 inch (6mm)"
    ],
    "finishes": [
      "Company Brand Colors",
      "Subtle Tone-on-Tone Logo"
    ]
  },
  {
    "name": "Yoga Studio Mat",
    "slug": "yoga-studio-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1599,
    "costPrice": 959,
    "description": "Heavy duty studio-grade yoga mat built to withstand hundreds of continuous classes with anti-microbial surface.",
    "sizes": [
      "72x24 inch (6mm)"
    ],
    "finishes": [
      "Midnight Charcoal",
      "Terracotta Red",
      "Emerald Green"
    ]
  },
  {
    "name": "Fitness Event Mat",
    "slug": "fitness-event-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Lightweight commemorative workout and yoga mat customized for marathon participants, yoga festivals, and brand summits.",
    "sizes": [
      "68x24 inch (4mm)"
    ],
    "finishes": [
      "Event Logo Print",
      "Sponsor Banner Print"
    ]
  },
  {
    "name": "Custom Printed Yoga Mat",
    "slug": "custom-printed-yoga-mat",
    "categorySlug": "yoga-fitness",
    "categoryName": "Yoga & Fitness",
    "basePrice": 1799,
    "costPrice": 1079,
    "description": "Upload your own digital artwork, chakra illustrations, or personal photography for full-surface vibrant printing.",
    "sizes": [
      "72x24 inch (5mm)"
    ],
    "finishes": [
      "Full Bleed Graphic Print",
      "Matte Finish"
    ]
  },
  {
    "name": "Modern Acrylic Wall Art",
    "slug": "modern-acrylic-wall-art",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 2399,
    "costPrice": 1439,
    "description": "Contemporary fluid art behind glossy optical glass with floating metal standoffs that add luminous depth to walls.",
    "sizes": [
      "16x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Gloss Glass Look",
      "Floating Standoffs Included"
    ]
  },
  {
    "name": "Personalized Family Photo Décor",
    "slug": "personalized-family-photo-decor",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 1899,
    "costPrice": 1139,
    "description": "Custom multi-generational family photo centerpiece formatted with warm earth tones matching Indian home interiors.",
    "sizes": [
      "16x24 inch",
      "20x30 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Canvas Floater Frame",
      "Matte Gallery Wrap"
    ]
  },
  {
    "name": "Inspirational Wall Art",
    "slug": "inspirational-wall-art",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Elegant typography featuring words of gratitude, peace, and mindfulness suited for serene living spaces.",
    "sizes": [
      "12x18 inch",
      "16x24 inch"
    ],
    "finishes": [
      "Pure White Text on Charcoal",
      "Warm Cream on Teak"
    ]
  },
  {
    "name": "Kids Room Wall Art",
    "slug": "kids-room-wall-art",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Whimsical animal themes, pastel cloud palettes, and personalized baby birth milestone details.",
    "sizes": [
      "Set of 3 (10x12 each)",
      "12x18 inch Single"
    ],
    "finishes": [
      "Pastel Blue",
      "Soft Pink",
      "Neutral Mint"
    ]
  },
  {
    "name": "Bedroom Photo Panel",
    "slug": "bedroom-photo-panel",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 1699,
    "costPrice": 1019,
    "description": "Subtle panoramic sunset and couple portrait formatted to sit gracefully above headboards and dressers.",
    "sizes": [
      "12x36 inch Panoramic",
      "16x24 inch"
    ],
    "finishes": [
      "Wrapped Canvas",
      "Solid Dark Oak Floater"
    ]
  },
  {
    "name": "Decorative Cork Wall Panel",
    "slug": "decorative-cork-wall-panel",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Natural eco cork panels combining sound dampening acoustic comfort with earthy, organic interior style.",
    "sizes": [
      "18x24 inch",
      "Set of 6 Hexagonal Tiles"
    ],
    "finishes": [
      "Natural Cork",
      "Geometric Screenprint"
    ]
  },
  {
    "name": "Personalized Home Display",
    "slug": "personalized-home-display",
    "categorySlug": "home-decor",
    "categoryName": "Home Décor",
    "basePrice": 2199,
    "costPrice": 1319,
    "description": "Custom family tree, address plaque or established-year sign crafted from archival materials.",
    "sizes": [
      "12x24 inch",
      "16x32 inch"
    ],
    "finishes": [
      "Teak Wood Border",
      "Matte Black Minimal Frame"
    ]
  },
  {
    "name": "Custom Canvas Print",
    "slug": "custom-canvas-print",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "Upload your personal digital photo or artwork. Choose custom dimensions, frame wrap depth, and floating frame options.",
    "sizes": [
      "8x10 inch",
      "12x18 inch",
      "16x24 inch",
      "24x36 inch",
      "Custom Size"
    ],
    "finishes": [
      "Gallery Wrap (1.25 inch)",
      "Slim Wrap (0.75 inch)",
      "Floating Teak Frame"
    ]
  },
  {
    "name": "Custom Acrylic Print",
    "slug": "custom-acrylic-print",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 1899,
    "costPrice": 1139,
    "description": "High-gloss optical grade cast acrylic print made from your uploaded design with polished edges and steel standoffs.",
    "sizes": [
      "12x12 inch",
      "12x18 inch",
      "18x24 inch",
      "Custom Dimensions"
    ],
    "finishes": [
      "Gloss Clear",
      "Anti-Glare Frosted",
      "White Opaque Backing"
    ]
  },
  {
    "name": "Custom Poster",
    "slug": "custom-poster",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 449,
    "costPrice": 269,
    "description": "Transform digital designs, infographics, movie art, or certificates into heavyweight posters with crisp detail.",
    "sizes": [
      "A4",
      "A3",
      "A2",
      "18x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Matte Coated",
      "Satin Lustre",
      "Framed"
    ]
  },
  {
    "name": "Custom Wall Graphic",
    "slug": "custom-wall-graphic",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 1699,
    "costPrice": 1019,
    "description": "Removable wall decals and architectural adhesive graphics printed at scale for showrooms, stores, and gyms.",
    "sizes": [
      "24x36 inch",
      "36x48 inch",
      "Custom Wall Dimensions"
    ],
    "finishes": [
      "Peel & Stick",
      "Laminated Protective Coat"
    ]
  },
  {
    "name": "Custom Photo Panel",
    "slug": "custom-photo-panel",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 1399,
    "costPrice": 839,
    "description": "MDF backed wooden photo board with beveled black edges and scratch-resistant matte protective lamination.",
    "sizes": [
      "8x10 inch",
      "12x18 inch",
      "16x24 inch"
    ],
    "finishes": [
      "Beveled Black Edge",
      "Natural Teak Edge"
    ]
  },
  {
    "name": "Custom Cork Product",
    "slug": "custom-cork-product",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Print your customized organization layout, corporate map, or desk calendar directly onto sustainable cork bark.",
    "sizes": [
      "12x18 inch",
      "18x24 inch",
      "Custom Cut"
    ],
    "finishes": [
      "Custom Grid Printed",
      "Plain Natural",
      "Framed"
    ]
  },
  {
    "name": "Custom Branded Display",
    "slug": "custom-branded-display",
    "categorySlug": "custom-prints",
    "categoryName": "Custom Prints",
    "basePrice": 2999,
    "costPrice": 1799,
    "description": "Multi-layer dimensional acrylic and wood brand logo display for reception counters and boardroom backdrops.",
    "sizes": [
      "24x36 inch",
      "30x48 inch",
      "Custom Dimensions"
    ],
    "finishes": [
      "Brushed Silver Backing",
      "Frosted Backing with Gold Cutout"
    ]
  },
  {
    "name": "Corporate Office Canvas Set",
    "slug": "corporate-office-canvas-set",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 3899,
    "costPrice": 2339,
    "description": "Coordinated set of 3 grand architectural canvas panels customized to brand colour palettes and office aesthetics.",
    "sizes": [
      "Set of 3 (16x24 each)",
      "Set of 3 (24x36 each)"
    ],
    "finishes": [
      "Architectural Matte Wrap",
      "Anodized Aluminum Floater"
    ]
  },
  {
    "name": "Reception Acrylic Panel",
    "slug": "reception-acrylic-panel",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 3499,
    "costPrice": 2099,
    "description": "Ultra-clear cast acrylic panel with diamond polished beveled edges and stainless standoffs for corporate entrance areas.",
    "sizes": [
      "24x36 inch",
      "30x48 inch"
    ],
    "finishes": [
      "Diamond Polished Edge with 4 Heavy Duty Standoffs"
    ]
  },
  {
    "name": "Corporate Brand Wall Graphic",
    "slug": "corporate-brand-wall-graphic",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 2499,
    "costPrice": 1499,
    "description": "Architectural vinyl graphics tailored for feature walls, highlighting company core values, milestones, and mission.",
    "sizes": [
      "24x48 inch",
      "Custom Wall Coverage"
    ],
    "finishes": [
      "Matte Anti-Reflective",
      "Satin Protective"
    ]
  },
  {
    "name": "Meeting Room Artwork",
    "slug": "meeting-room-artwork",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 1999,
    "costPrice": 1199,
    "description": "Focused abstract and motivational graphics creating a calm, innovative atmosphere in collaborative conference rooms.",
    "sizes": [
      "16x24 inch",
      "24x36 inch"
    ],
    "finishes": [
      "Matte Black Minimal Frame",
      "Canvas Wrap"
    ]
  },
  {
    "name": "Employee Recognition Display",
    "slug": "employee-recognition-display",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 1599,
    "costPrice": 959,
    "description": "Modular employee of the month and tenure milestone acrylic plaques with magnetic swapping mechanism.",
    "sizes": [
      "8x10 inch",
      "12x12 inch",
      "Set of 6 Grid"
    ],
    "finishes": [
      "Clear Crystal with Gold Backer",
      "Black & Silver"
    ]
  },
  {
    "name": "Office Motivation Poster",
    "slug": "office-motivation-poster",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 699,
    "costPrice": 419,
    "description": "Framed prints with minimal typography encouraging ownership, teamwork, empathy, and innovation.",
    "sizes": [
      "12x18 inch",
      "18x24 inch"
    ],
    "finishes": [
      "Matte Black Frame",
      "Teak Frame"
    ]
  },
  {
    "name": "Corporate Logo Acrylic",
    "slug": "corporate-logo-acrylic",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 2799,
    "costPrice": 1679,
    "description": "Custom laser-cut and UV printed company logo with 3D standoffs matching strict Pantone corporate guidelines.",
    "sizes": [
      "18x24 inch",
      "24x36 inch",
      "Custom Dimensions"
    ],
    "finishes": [
      "Full Color UV Print",
      "Frosted Silhouette",
      "LED Edge Ready"
    ]
  },
  {
    "name": "Branded Office Décor",
    "slug": "branded-office-decor",
    "categorySlug": "corporate-orders",
    "categoryName": "Corporate Orders",
    "basePrice": 3199,
    "costPrice": 1919,
    "description": "Turnkey workplace décor packages including wall panels, acoustic cork dividers, and architectural canvases.",
    "sizes": [
      "Complete Room Set (4 Units)",
      "Custom Floor Plan"
    ],
    "finishes": [
      "Customized to Corporate Interior Palette"
    ]
  },
  {
    "name": "Birthday Photo Memory Frame",
    "slug": "birthday-photo-memory-frame",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 999,
    "costPrice": 599,
    "description": "Cherish joyful birthday milestones with custom collage layout, personal greeting message, and elegant solid wood frame.",
    "sizes": [
      "8x10 inch",
      "12x18 inch",
      "16x24 inch"
    ],
    "finishes": [
      "Warm Teak Frame",
      "Matte Black Minimal Frame"
    ]
  },
  {
    "name": "Anniversary Romantic Couple Canvas",
    "slug": "anniversary-romantic-couple-canvas",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1699,
    "costPrice": 1019,
    "description": "Honor your journey together with a romantic stretched canvas featuring wedding date typography and gallery edge wrap.",
    "sizes": [
      "12x18 inch",
      "16x24 inch",
      "20x30 inch"
    ],
    "finishes": [
      "Gallery Wrapped (1.25 inch)",
      "Gold Floater Frame"
    ]
  },
  {
    "name": "Wedding Vows Acrylic Desk Block",
    "slug": "wedding-vows-acrylic-desk-block",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1499,
    "costPrice": 899,
    "description": "20mm freestanding solid optical acrylic block printed sub-surface with crisp wedding portrait and vows.",
    "sizes": [
      "6x8 inch",
      "8x10 inch"
    ],
    "finishes": [
      "Diamond Milled Edge",
      "White Base Coat"
    ]
  },
  {
    "name": "New Home Blessings Display",
    "slug": "new-home-blessings-display",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Warm housewarming plaque featuring Sanskrit shlokas, family surname, and architectural door motif.",
    "sizes": [
      "10x14 inch",
      "12x18 inch"
    ],
    "finishes": [
      "Earthy Cork Print",
      "Polished Teak Edge"
    ]
  },
  {
    "name": "Romantic Silhouette Acrylic Block",
    "slug": "romantic-silhouette-acrylic-block",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1199,
    "costPrice": 719,
    "description": "Subtle backlit effect crystal block with sunset silhouette and personalized coordinates of where you met.",
    "sizes": [
      "5x7 inch",
      "6x8 inch"
    ],
    "finishes": [
      "Clear Beveled Edge",
      "Warm Backlight Compatible"
    ]
  },
  {
    "name": "Mother & Child Keepsake Canvas",
    "slug": "mother-child-keepsake-canvas",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1399,
    "costPrice": 839,
    "description": "Heartfelt tribute canvas with gentle warm skin tone balancing and handwritten gratitude note print.",
    "sizes": [
      "10x12 inch",
      "12x18 inch",
      "16x20 inch"
    ],
    "finishes": [
      "Museum Wrap",
      "White Floating Frame"
    ]
  },
  {
    "name": "Father Tribute Wood Photo Board",
    "slug": "father-tribute-wood-photo-board",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1299,
    "costPrice": 779,
    "description": "Solid engineered wood block with archival photo lamination celebrating life lessons and fatherly bond.",
    "sizes": [
      "8x10 inch",
      "10x12 inch"
    ],
    "finishes": [
      "Natural Oak Edge",
      "Walnut Dark Finish"
    ]
  },
  {
    "name": "Festive Diya Heritage Art Print",
    "slug": "festive-diya-heritage-art-print",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1599,
    "costPrice": 959,
    "description": "Traditional festive motif print combining deep indigo, golden ochre and metallic brass accents.",
    "sizes": [
      "12x18 inch",
      "16x24 inch"
    ],
    "finishes": [
      "Antique Gold Frame",
      "Gallery Stretched Canvas"
    ]
  },
  {
    "name": "Executive Milestone Desk Block",
    "slug": "executive-milestone-desk-block",
    "categorySlug": "gifts",
    "categoryName": "Gifts & Occasions",
    "basePrice": 1899,
    "costPrice": 1139,
    "description": "Custom corporate token with laser cut optical acrylic and personalized tenure appreciation engraving.",
    "sizes": [
      "6x8 inch",
      "8x10 inch"
    ],
    "finishes": [
      "Frosted Accent with Gold Infill",
      "Pure Crystal"
    ]
  },
  {
    "name": "Wholesale Canvas Print Multi-Pack",
    "slug": "wholesale-canvas-print-multi-pack",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 9999,
    "costPrice": 5999,
    "description": "Pack of 10 identical or assorted 12x18 inch stretched canvas prints for art dealers, photographers, and interior projects.",
    "sizes": [
      "Pack of 10 (12x18 inch)",
      "Pack of 25 (12x18 inch)",
      "Pack of 50 (Custom)"
    ],
    "finishes": [
      "Matte Gallery Wrap (1.25 inch)",
      "Satin Lustre Wrap"
    ]
  },
  {
    "name": "Commercial Grade Acrylic Signs (Batch of 5)",
    "slug": "commercial-grade-acrylic-signs-batch",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 11499,
    "costPrice": 6899,
    "description": "Batch of 5 high-impact cast acrylic signage displays with heavy-duty stainless steel standoffs for building floors.",
    "sizes": [
      "Batch of 5 (16x24 inch)",
      "Batch of 10 (18x24 inch)"
    ],
    "finishes": [
      "Diamond Milled Edges + 4 Standoffs Per Unit"
    ]
  },
  {
    "name": "Architectural Project Poster Set (Batch of 20)",
    "slug": "architectural-project-poster-set",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 3999,
    "costPrice": 2399,
    "description": "20 high-fidelity posters printed on 300 GSM archival matte paper for real estate sites, campus noticeboards, and events.",
    "sizes": [
      "Pack of 20 (A3 Size)",
      "Pack of 20 (18x24 inch)"
    ],
    "finishes": [
      "Matte Protective Finish",
      "Gloss Vibrant Finish"
    ]
  },
  {
    "name": "Workplace Acoustic Cork Pinboard Pack (Batch of 8)",
    "slug": "workplace-acoustic-cork-pinboard-pack",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 7499,
    "costPrice": 4499,
    "description": "Set of 8 modular 18x24 inch Portuguese cork pinboards with custom printed company calendars or agile grids.",
    "sizes": [
      "Set of 8 (18x24 inch)",
      "Set of 16 (12x18 inch)"
    ],
    "finishes": [
      "Custom Screen Printed Grid",
      "Plain Natural"
    ]
  },
  {
    "name": "Studio Custom Yoga Mat Batch (Batch of 15)",
    "slug": "studio-custom-yoga-mat-batch",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 16999,
    "costPrice": 10199,
    "description": "15 bespoke branded yoga mats for wellness centers, pilates academies, fitness studios, and retreat goodie bags.",
    "sizes": [
      "15 Mats (72x24 inch - 5mm)"
    ],
    "finishes": [
      "Anti-Slip Texture Coating",
      "Edge Laser Engraved Logo"
    ]
  },
  {
    "name": "Hotel Suite Coordinated Wall Décor (Batch of 12)",
    "slug": "hotel-suite-coordinated-wall-decor",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 14999,
    "costPrice": 8999,
    "description": "12 curated, framed wall art pieces designed to harmonize with guest bedroom color themes and regional heritage.",
    "sizes": [
      "12 Frames (16x24 inch)"
    ],
    "finishes": [
      "Teak Wood Texture Frame",
      "Black Minimalist Frame"
    ]
  },
  {
    "name": "Conference & Summit Commemorative Art (50 Units)",
    "slug": "conference-summit-commemorative-art",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 18999,
    "costPrice": 11399,
    "description": "50 personalized wooden photo boards or acrylic blocks packed in protective sleeves for delegates and keynote speakers.",
    "sizes": [
      "50 Units (6x8 inch)"
    ],
    "finishes": [
      "Precision Silver Foil Stamping",
      "Crystal Clear"
    ]
  },
  {
    "name": "Brand Launch Promotional Graphic Pack (Batch of 30)",
    "slug": "brand-launch-promotional-graphic-pack",
    "categorySlug": "bulk-order",
    "categoryName": "Bulk Order",
    "basePrice": 12999,
    "costPrice": 7799,
    "description": "30 peel-and-stick architectural vinyl displays and branded counter standees for nationwide franchise store rollouts.",
    "sizes": [
      "30 Units (18x24 inch)"
    ],
    "finishes": [
      "Matte Anti-Scratch Lamination"
    ]
  }
];
