import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Permission catalog — extended as later phases add modules.
const PERMISSIONS = [
  'users.view',
  'users.manage',
  'roles.view',
  'roles.manage',
  'customers.view',
  'customers.create',
  'customers.edit',
  'products.view',
  'products.create',
  'products.edit',
  'products.delete',
  'orders.view',
  'orders.create',
  'orders.edit',
  'orders.cancel',
  'orders.refund',
  'inventory.view',
  'inventory.adjust',
  'warehouses.view',
  'warehouses.manage',
  'shipping.view',
  'shipping.create',
  'shipping.cancel',
  'ndr.view',
  'ndr.action',
  'returns.view',
  'returns.manage',
  'finance.view',

  // Customization Engine (Phase 2)
  'assets.upload',
  'designs.view',
  'designs.edit',
  'artwork.view',
  'artwork.approve',
  'artwork.reject',
  'shapes.view',
  'shapes.create',
  'shapes.approve',
  'shapes.reject',

  // Production Management (Phase 3)
  'production.view',
  'production.assign',
  'production.complete',
  'production.qc',
  'machines.view',
  'machines.manage',
  'bom.view',
  'bom.manage',
  'materials.view',
  'materials.adjust',

  // Growth (Phase 5)
  'discounts.view',
  'discounts.manage',
  'promotions.view',
  'promotions.manage',
  'campaigns.view',
  'campaigns.manage',
  'segments.view',
  'segments.manage',
  'abandoned_carts.view',
  'abandoned_carts.manage',
  'analytics.view',
  'pricing.view',
  'pricing.manage',
  'option_catalog.view',
  'option_catalog.manage',
  'size_presets.view',
  'size_presets.manage',
];

// Rs. per sq. inch — non-rectangular shapes (heart, hexagon, custom traced
// shapes) are billed by their bounding rectangle's area at this rate (client
// pricing sheet). Admin-editable via PricingSettingsController.
const SHAPE_AREA_RATE_PER_SQIN_KEY = 'shape_area_rate_per_sqin';
const SHAPE_AREA_RATE_PER_SQIN_DEFAULT = 1.65;

// Rs. per sq. inch per acrylic sheet thickness (client pricing sheet) — the
// 18mm tier has no rate in the sheet and stays a flat addon in frontend code.
const ACRYLIC_THICKNESS_RATE_SETTINGS: Array<{ key: string; value: number; description: string }> = [
  { key: 'acrylic_thickness_rate_3mm', value: 5.50, description: 'Rs. per sq. inch for 3mm acrylic sheet thickness' },
  { key: 'acrylic_thickness_rate_5mm', value: 6.50, description: 'Rs. per sq. inch for 5mm acrylic sheet thickness' },
  { key: 'acrylic_thickness_rate_6mm', value: 7.75, description: 'Rs. per sq. inch for 6mm acrylic sheet thickness' },
  { key: 'acrylic_thickness_rate_8mm', value: 9.50, description: 'Rs. per sq. inch for 8mm acrylic sheet thickness' },
];

// Admin-manageable customizer option catalog (scope: admin CRUD over
// storefront customize-page options). First rollout batch covers the
// lowest-risk, purely-cosmetic categories (no pricing-correctness risk) per
// the agreed build order; price-bearing categories (Wrap, Hardware, Finish,
// Frame, ...) follow in a later batch once this pattern is proven.
//
// Mirrors the exact current values in src/data/acrylicCustomizerData.ts so
// seeding this does not change what customers see on day one — it only
// moves the source of truth from a frontend data file to the database.
interface SeedOptionItem {
  label: string;
  description?: string;
  flatPrice?: number;
  extras?: Record<string, unknown>;
}

interface SeedOptionCategory {
  baseKey: string;
  materialScope: 'ACRYLIC' | 'CANVAS' | 'BOTH';
  name: string;
  description?: string;
  items: SeedOptionItem[];
}

const OPTION_CATEGORIES_SEED: SeedOptionCategory[] = [
  {
    baseKey: 'backgrounds',
    materialScope: 'BOTH',
    name: 'Backgrounds',
    items: [
      { label: 'Transparent (Clear Optical)', extras: { id: 'transparent', hex: 'transparent' } },
      { label: 'Solid White Opaque Backing', extras: { id: 'white', hex: '#FFFFFF' } },
      { label: 'Solid Black Opaque Backing', extras: { id: 'black', hex: '#000000' } },
      { label: 'Frosted Translucent Backing', extras: { id: 'frosted', hex: 'rgba(255, 255, 255, 0.65)' } },
    ],
  },
  {
    baseKey: 'border_width',
    materialScope: 'BOTH',
    name: 'Border Width',
    description: 'Previously two separate sources (data-file widthPx + a page-local price map) — now one row per option.',
    items: [
      { label: 'No Border', flatPrice: 0, extras: { id: 'none', widthPx: 0 } },
      { label: 'Thin (3mm)', flatPrice: 49, extras: { id: 'thin', widthPx: 3 } },
      { label: 'Medium (6mm)', flatPrice: 89, extras: { id: 'medium', widthPx: 6 } },
      { label: 'Thick (12mm)', flatPrice: 149, extras: { id: 'thick', widthPx: 12 } },
    ],
  },
  {
    baseKey: 'border_color',
    materialScope: 'BOTH',
    name: 'Border Color',
    items: [
      { label: 'White', extras: { hex: '#FFFFFF' } },
      { label: 'Black', extras: { hex: '#000000' } },
      { label: 'Gold', extras: { hex: '#D4AF37' } },
      { label: 'Silver', extras: { hex: '#94A3B8' } },
    ],
  },
  {
    baseKey: 'font',
    materialScope: 'BOTH',
    name: 'Typography / Font',
    items: [
      { label: 'Playfair Display (Elegant Serif)', extras: { cssFontFamily: '"Playfair Display", Georgia, serif' } },
      { label: 'Montserrat (Modern Geometric)', extras: { cssFontFamily: 'Montserrat, sans-serif' } },
      { label: 'Great Vibes (Romantic Script)', extras: { cssFontFamily: '"Great Vibes", cursive' } },
      { label: 'Cinzel (Classic Roman)', extras: { cssFontFamily: 'Cinzel, serif' } },
      { label: 'Dancing Script (Casual Script)', extras: { cssFontFamily: '"Dancing Script", cursive' } },
      { label: 'Oswald (Bold Headline)', extras: { cssFontFamily: 'Oswald, sans-serif' } },
      { label: 'Inter (Clean UI Sans)', extras: { cssFontFamily: 'Inter, sans-serif' } },
      { label: 'Georgia (Classic Serif)', extras: { cssFontFamily: 'Georgia, serif' } },
      { label: 'Times New Roman (Editorial)', extras: { cssFontFamily: '"Times New Roman", Times, serif' } },
      { label: 'Arial (Modern Sans)', extras: { cssFontFamily: 'Arial, sans-serif' } },
      { label: 'Courier New (Typewriter)', extras: { cssFontFamily: '"Courier New", Courier, monospace' } },
      { label: 'Verdana (Clean Geometric)', extras: { cssFontFamily: 'Verdana, Geneva, sans-serif' } },
    ],
  },
  {
    baseKey: 'text_color',
    materialScope: 'BOTH',
    name: 'Text Color Presets',
    items: [
      { label: 'White', extras: { hex: '#FFFFFF' } },
      { label: 'Black', extras: { hex: '#000000' } },
      { label: 'Red', extras: { hex: '#DC2626' } },
      { label: 'Blue', extras: { hex: '#0E4A93' } },
      { label: 'Gold', extras: { hex: '#D4AF37' } },
      { label: 'Orange', extras: { hex: '#E8752A' } },
      { label: 'Green', extras: { hex: '#16A34A' } },
    ],
  },
  {
    baseKey: 'clipart',
    materialScope: 'BOTH',
    name: 'Clipart',
    description: 'One item per emoji; extras.category groups them the way the storefront picker tabs them.',
    items: [
      { label: 'Party Popper', extras: { category: 'Celebration', emoji: '🎉' } },
      { label: 'Champagne Bottle', extras: { category: 'Celebration', emoji: '🍾' } },
      { label: 'Clinking Glasses', extras: { category: 'Celebration', emoji: '🥂' } },
      { label: 'Birthday Cake', extras: { category: 'Celebration', emoji: '🎂' } },
      { label: 'Balloon', extras: { category: 'Celebration', emoji: '🎈' } },
      { label: 'Fireworks', extras: { category: 'Celebration', emoji: '🎆' } },
      { label: 'Confetti Ball', extras: { category: 'Celebration', emoji: '🎊' } },
      { label: 'Sparkler', extras: { category: 'Celebration', emoji: '🎇' } },
      { label: 'Shortcake', extras: { category: 'Celebration', emoji: '🍰' } },
      { label: 'Partying Face', extras: { category: 'Celebration', emoji: '🥳' } },
      { label: 'Red Heart', extras: { category: 'Love & Wedding', emoji: '❤️' } },
      { label: 'Sparkling Heart', extras: { category: 'Love & Wedding', emoji: '💖' } },
      { label: 'Ring', extras: { category: 'Love & Wedding', emoji: '💍' } },
      { label: 'Bouquet', extras: { category: 'Love & Wedding', emoji: '💐' } },
      { label: 'Bride', extras: { category: 'Love & Wedding', emoji: '👰' } },
      { label: 'Groom', extras: { category: 'Love & Wedding', emoji: '🤵' } },
      { label: 'Love Letter', extras: { category: 'Love & Wedding', emoji: '💌' } },
      { label: 'Rose', extras: { category: 'Love & Wedding', emoji: '🌹' } },
      { label: 'Dove', extras: { category: 'Love & Wedding', emoji: '🕊️' } },
      { label: 'Revolving Hearts', extras: { category: 'Love & Wedding', emoji: '💞' } },
      { label: 'Family', extras: { category: 'Family & Kids', emoji: '👨‍👩‍👧' } },
      { label: 'Baby', extras: { category: 'Family & Kids', emoji: '👶' } },
      { label: 'Teddy Bear', extras: { category: 'Family & Kids', emoji: '🧸' } },
      { label: 'Footprints', extras: { category: 'Family & Kids', emoji: '👣' } },
      { label: 'House', extras: { category: 'Family & Kids', emoji: '🏡' } },
      { label: 'Paw Prints', extras: { category: 'Family & Kids', emoji: '🐾' } },
      { label: 'Cherry Blossom', extras: { category: 'Family & Kids', emoji: '🌸' } },
      { label: 'Sun', extras: { category: 'Family & Kids', emoji: '☀️' } },
      { label: 'Baby Bottle', extras: { category: 'Family & Kids', emoji: '🍼' } },
      { label: 'Hatching Chick', extras: { category: 'Family & Kids', emoji: '🐣' } },
      { label: 'Star', extras: { category: 'Decorative', emoji: '⭐' } },
      { label: 'Sparkles', extras: { category: 'Decorative', emoji: '✨' } },
      { label: 'Gem Stone', extras: { category: 'Decorative', emoji: '💎' } },
      { label: 'Crown', extras: { category: 'Decorative', emoji: '👑' } },
      { label: 'Herb', extras: { category: 'Decorative', emoji: '🌿' } },
      { label: 'Crescent Moon', extras: { category: 'Decorative', emoji: '🌙' } },
      { label: 'Butterfly', extras: { category: 'Decorative', emoji: '🦋' } },
      { label: 'Four Leaf Clover', extras: { category: 'Decorative', emoji: '🍀' } },
      { label: 'Candle', extras: { category: 'Decorative', emoji: '🕯️' } },
      { label: 'Magic Wand', extras: { category: 'Decorative', emoji: '🪄' } },
      { label: 'Trophy', extras: { category: 'Business', emoji: '🏆' } },
      { label: 'Medal', extras: { category: 'Business', emoji: '🎖️' } },
      { label: 'Briefcase', extras: { category: 'Business', emoji: '💼' } },
      { label: 'Office Building', extras: { category: 'Business', emoji: '🏢' } },
      { label: 'Label', extras: { category: 'Business', emoji: '🏷️' } },
      { label: 'Glowing Star', extras: { category: 'Business', emoji: '🌟' } },
      { label: 'Shield', extras: { category: 'Business', emoji: '🛡️' } },
      { label: '100 Points', extras: { category: 'Business', emoji: '💯' } },
      { label: 'Bookmark', extras: { category: 'Business', emoji: '🔖' } },
      { label: 'Triangular Ruler', extras: { category: 'Business', emoji: '📐' } },
    ],
  },
  // Batch 2: price-bearing categories. Wrap/Display/Material Grade/
  // Lamination are genuinely one shared list in the live page today (no
  // acrylic-specific variant is ever rendered) despite acrylic-named data
  // files existing — seeded as BOTH to match real behavior, not aspiration.
  // Finish has no live picker anywhere in the page (verified same as
  // Backgrounds) but is seeded anyway, ready for whenever one is built.
  {
    baseKey: 'wrap_style',
    materialScope: 'BOTH',
    name: 'Wrap Style',
    items: [
      { label: 'Image Wrap', extras: { id: 'full-bleed', borderWidth: 0, borderColor: 'transparent' } },
      { label: 'Mirror Wrap', extras: { id: 'clear-edge', borderWidth: 10, borderColor: 'rgba(255, 255, 255, 0.75)' } },
      { label: 'White Border Wrap', flatPrice: 120, extras: { id: 'white-border', borderWidth: 16, borderColor: '#FFFFFF' } },
      { label: 'Black Border Wrap', flatPrice: 120, extras: { id: 'black-border', borderWidth: 16, borderColor: '#0F172A' } },
      { label: 'Solid Color Wrap', extras: { id: 'no-wrap', borderWidth: 0, borderColor: 'transparent' } },
    ],
  },
  {
    baseKey: 'hardware',
    materialScope: 'CANVAS',
    name: 'Hardware (Canvas)',
    description: 'The flat canvas hardware list the live picker actually renders for canvas products.',
    items: [
      { label: 'No Hooks', extras: { id: 'no-hooks' } },
      { label: 'Hooks for Hanging', extras: { id: 'hooks-hanging' } },
      { label: 'Ready to Hang', extras: { id: 'ready-to-hang' } },
      { label: 'Sawtooth Hanger', flatPrice: 25, extras: { id: 'sawtooth-hanger' } },
      { label: 'Easel Back', flatPrice: 49, extras: { id: 'easel-back' } },
      { label: 'Nail Free Hook', flatPrice: 49, extras: { id: 'nail-free-hook' } },
    ],
  },
  {
    baseKey: 'hardware',
    materialScope: 'ACRYLIC',
    name: 'Hardware (Acrylic)',
    description: 'Includes Chrome Standoffs (Rs.200 = Rs.50/stud x 4-stud minimum, client pricing sheet) — the acrylic picker is the one place this list is actually rendered, now that its pricing bug is fixed.',
    items: [
      { label: 'Without Base / No Hooks', description: 'Clean unmounted acrylic panel for custom installation.', extras: { id: 'no-hooks' } },
      { label: 'Hooks for Hanging', description: 'Twin self-levelling hanging hooks included at no charge.', extras: { id: 'hooks-hanging' } },
      { label: 'Ready to Hang Cleat', description: 'Pre-installed recessed French cleat wall hanger.', extras: { id: 'ready-to-hang' } },
      { label: 'Sawtooth Hanger', description: 'Heavy-duty brass sawtooth hanger attached to rear backing.', flatPrice: 25, extras: { id: 'sawtooth-hanger' } },
      { label: 'Easel Back / Stand', description: 'Foldable tabletop stand for desk, shelf, and mantle display.', flatPrice: 49, extras: { id: 'easel-back' } },
      { label: 'Nail Free Hook', description: 'Damage-free adhesive wall hook with high weight capacity.', flatPrice: 49, extras: { id: 'nail-free-hook' } },
      { label: 'Chrome Standoffs', description: '4 architectural brushed chrome corner standoff bolts.', flatPrice: 200, extras: { id: 'standoff-mounts' } },
    ],
  },
  {
    baseKey: 'display_option',
    materialScope: 'BOTH',
    name: 'Display Option',
    items: [
      { label: 'Open Back', extras: { id: 'open-back' } },
      { label: 'Dust Cover', flatPrice: 49, extras: { id: 'dust-cover' } },
    ],
  },
  {
    baseKey: 'material_grade',
    materialScope: 'BOTH',
    name: 'Material Grade',
    items: [
      { label: 'Standard 280 GSM Cotton Canvas', description: 'Durable poly-cotton blend canvas for everyday prints.', extras: { id: 'standard-cotton' } },
      { label: 'Premium 380 GSM Cotton Canvas', description: '100% cotton museum-grade canvas with rich texture.', flatPrice: 250, extras: { id: 'premium-cotton' } },
      { label: 'Archival Museum Canvas', description: 'Acid-free archival canvas rated for 100+ years of fade resistance.', flatPrice: 450, extras: { id: 'archival-cotton' } },
    ],
  },
  {
    baseKey: 'lamination',
    materialScope: 'BOTH',
    name: 'Lamination',
    items: [
      { label: 'No', extras: { id: 'none' } },
      { label: 'Standard', flatPrice: 149, extras: { id: 'standard' } },
      { label: 'Premium', flatPrice: 249, extras: { id: 'premium' } },
    ],
  },
  {
    baseKey: 'frame',
    materialScope: 'BOTH',
    name: 'Frame',
    items: [
      { label: 'No Frame (Frameless)', extras: { id: 'no-frame', color: 'transparent' } },
      { label: 'Modern Black Frame', flatPrice: 350, extras: { id: 'black-frame', color: '#18181b' } },
      { label: 'Brushed Gold Frame', flatPrice: 450, extras: { id: 'gold-frame', color: '#d4af37' } },
      { label: 'Gallery White Frame', flatPrice: 350, extras: { id: 'white-frame', color: '#ffffff' } },
      { label: 'Natural Oak Frame', flatPrice: 490, extras: { id: 'wood-frame', color: '#92400e' } },
    ],
  },
  {
    baseKey: 'finish',
    materialScope: 'BOTH',
    name: 'Finish',
    description: 'No live picker renders this today (verified — same situation as Backgrounds); seeded ready for when one exists.',
    items: [
      { label: 'High Gloss Clear', description: 'Direct optical crystal finish with unmatched vibrancy & 3D depth.', extras: { id: 'high-gloss' } },
      { label: 'Anti-Glare Matte', description: 'Velvet soft matte surface reducing reflection from bright lights & windows.', flatPrice: 180, extras: { id: 'anti-glare' } },
      { label: 'Frosted Backing', description: 'Soft diffused translucency for gentle light transmission.', flatPrice: 150, extras: { id: 'frosted-backing' } },
      { label: 'Diamond Beveled Edge', description: 'Hand-polished 45-degree prism beveled luxury perimeter edge.', flatPrice: 220, extras: { id: 'diamond-bevel' } },
    ],
  },
];

// The original hand-authored shapes (ACRYLIC_SHAPES in
// src/data/acrylicCustomizerData.ts), seeded into the same CustomShape table
// as admin-uploaded shapes so they're all admin-manageable from one screen.
// Values copied exactly from that file so this changes nothing about how
// customers see these shapes today — origin/status just make them visible
// to the admin Shapes screen alongside uploads. clipPathType is
// CSS_FUNCTION for every shape except Heart, which is stored as its real
// SVG path (copied from the hardcoded <clipPath id="acrylic-clip-shape-heart">
// def in CanvasCustomizerPage.tsx) rather than the "url(#...)" reference
// the frontend data file uses, since a url() reference isn't something an
// admin could meaningfully edit.
interface BuiltInShapeSeed {
  id: string;
  name: string;
  shapeType: string;
  category: string;
  aspectRatio: number;
  isSingleDimension: boolean;
  clipPathType: 'SVG_PATH' | 'CSS_FUNCTION';
  clipPathValue: string;
  flatPrice: number;
}

const BUILT_IN_SHAPES_SEED: BuiltInShapeSeed[] = [
  { id: 'shape-square', name: 'Square', shapeType: 'square', category: 'basic', aspectRatio: 1, isSingleDimension: true, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
  { id: 'shape-rectangle', name: 'Rectangle', shapeType: 'rectangle', category: 'basic', aspectRatio: 1.333, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
  { id: 'shape-landscape', name: 'Landscape', shapeType: 'landscape', category: 'basic', aspectRatio: 1.6, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
  { id: 'shape-portrait', name: 'Portrait', shapeType: 'portrait', category: 'basic', aspectRatio: 0.75, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
  { id: 'shape-circle', name: 'Circle', shapeType: 'circle', category: 'basic', aspectRatio: 1, isSingleDimension: true, clipPathType: 'CSS_FUNCTION', clipPathValue: 'circle(50% at 50% 50%)', flatPrice: 0 },
  { id: 'shape-oval', name: 'Oval', shapeType: 'oval', category: 'basic', aspectRatio: 1.333, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'ellipse(50% 38% at 50% 50%)', flatPrice: 0 },
  { id: 'shape-rounded-rect', name: 'Rounded Rectangle', shapeType: 'roundedRectangle', category: 'basic', aspectRatio: 1.333, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 28px)', flatPrice: 0 },
  { id: 'shape-heart', name: 'Heart', shapeType: 'heart', category: 'special', aspectRatio: 1, isSingleDimension: true, clipPathType: 'SVG_PATH', clipPathValue: 'M 0.5,0.85 C 0.12,0.58 0.02,0.38 0.02,0.24 C 0.02,0.08 0.14,0.02 0.28,0.02 C 0.38,0.02 0.46,0.08 0.5,0.18 C 0.54,0.08 0.62,0.02 0.72,0.02 C 0.86,0.02 0.98,0.08 0.98,0.24 C 0.98,0.38 0.88,0.58 0.5,0.85 Z', flatPrice: 150 },
  { id: 'shape-hexagon', name: 'Hexagon', shapeType: 'hexagon', category: 'special', aspectRatio: 1, isSingleDimension: true, clipPathType: 'CSS_FUNCTION', clipPathValue: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', flatPrice: 150 },
  { id: 'shape-triangle', name: 'Triangle', shapeType: 'triangle', category: 'special', aspectRatio: 1, isSingleDimension: true, clipPathType: 'CSS_FUNCTION', clipPathValue: 'polygon(50% 0%, 0% 100%, 100% 100%)', flatPrice: 150 },
  { id: 'shape-panoramic', name: 'Panoramic', shapeType: 'panoramic', category: 'special', aspectRatio: 3, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
  { id: 'shape-banner', name: 'Banner', shapeType: 'banner', category: 'special', aspectRatio: 0.5, isSingleDimension: false, clipPathType: 'CSS_FUNCTION', clipPathValue: 'inset(0 round 14px)', flatPrice: 0 },
];

async function main() {
  // Seed permissions.
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  // Seed Super Admin role.
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Full system access',
      isSystem: true,
    },
  });

  // Grant every known permission to Super Admin.
  const allPermissions = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: superAdminRole.id },
  });

  await prisma.rolePermission.createMany({
    data: allPermissions.map((p) => ({
      roleId: superAdminRole.id,
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  // Seed Super Admin user.
  const seedEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@canvaschamp.in';
  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const passwordHash = await argon2.hash(seedPassword);

  await prisma.adminUser.upsert({
    where: { email: seedEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: seedEmail,
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  // Baseline product type + option groups so the catalog isn't empty on first boot.
  await prisma.productType.upsert({
    where: { name: 'Canvas' },
    update: {},
    create: { name: 'Canvas' },
  });

  const sizeGroup = await prisma.optionGroup.upsert({
    where: { name: 'SIZE' },
    update: {},
    create: { name: 'SIZE' },
  });

  const sizeValues: [string, string][] = [
    ['8x8', '0'],
    ['10x10', '50'],
    ['12x12', '100'],
    ['16x20', '250'],
    ['20x30', '500'],
  ];

  for (const [value, priceAdjustment] of sizeValues) {
    await prisma.optionValue.upsert({
      where: {
        optionGroupId_value: {
          optionGroupId: sizeGroup.id,
          value,
        },
      },
      update: {},
      create: {
        optionGroupId: sizeGroup.id,
        value,
        priceAdjustment,
      },
    });
  }

  // Seed warehouses for Phase 4.
  await prisma.warehouse.upsert({
    where: { code: 'BLR-01' },
    update: {},
    create: {
      name: 'Bengaluru Production Warehouse',
      code: 'BLR-01',
      addressLine1: 'Industrial Area, Peenya',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560058',
      country: 'IN',
    },
  });

  await prisma.warehouse.upsert({
    where: { code: 'DEL-01' },
    update: {},
    create: {
      name: 'Delhi Fulfilment Warehouse',
      code: 'DEL-01',
      addressLine1: 'Okhla Industrial Area',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110020',
      country: 'IN',
    },
  });

  // Phase 5: Growth — seed a demo segment, campaign, discount & promotion.
  const vipSegment = await prisma.customerSegment.upsert({
    where: { slug: 'vip-customers' },
    update: {},
    create: {
      name: 'VIP Customers',
      slug: 'vip-customers',
      description: 'Customers with lifetime spend ≥ ₹10,000 or ≥ 5 orders',
      type: 'DYNAMIC',
      criteria: {
        minSpend: 10000,
        minOrders: 5,
      },
      isActive: true,
    },
  });

  const launchCampaign = await prisma.campaign.upsert({
    where: { code: 'LAUNCH2025' },
    update: {},
    create: {
      name: 'Annual Launch 2025',
      code: 'LAUNCH2025',
      description: 'Year-round launch campaign bundling all promotional offers',
      type: 'SEASONAL',
      status: 'DRAFT',
      startsAt: new Date('2025-01-01T00:00:00Z'),
      endsAt: new Date('2025-12-31T23:59:59Z'),
      budget: 500000,
      targetSegmentId: vipSegment.id,
    },
  });

  await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off for new customers, max ₹500 discount',
      discountType: 'PERCENTAGE',
      value: 10,
      maxDiscountAmount: 500,
      minOrderSubtotal: 999,
      usageLimit: 1000,
      perCustomerLimit: 1,
      isActive: true,
      isExclusive: false,
      campaignId: launchCampaign.id,
    },
  });

  await prisma.promotion.upsert({
    where: { slug: 'flat100-on-2k' },
    update: {},
    create: {
      name: 'Flat ₹100 off on orders above ₹2,000',
      slug: 'flat100-on-2k',
      description: 'Automatic ₹100 discount applied to orders above ₹2,000',
      promotionType: 'AUTOMATIC_DISCOUNT',
      discountType: 'FIXED_AMOUNT',
      value: 100,
      minOrderSubtotal: 2000,
      priority: 10,
      isStackable: true,
      startsAt: new Date('2025-01-01T00:00:00Z'),
      endsAt: new Date('2025-12-31T23:59:59Z'),
      isActive: true,
      campaignId: launchCampaign.id,
    },
  });

  await prisma.pricingSetting.upsert({
    where: { key: SHAPE_AREA_RATE_PER_SQIN_KEY },
    update: {},
    create: {
      key: SHAPE_AREA_RATE_PER_SQIN_KEY,
      value: SHAPE_AREA_RATE_PER_SQIN_DEFAULT,
      description: 'Rs. per sq. inch used to price non-rectangular shapes by their bounding-box area',
    },
  });

  for (const setting of ACRYLIC_THICKNESS_RATE_SETTINGS) {
    await prisma.pricingSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value, description: setting.description },
    });
  }

  for (const categorySeed of OPTION_CATEGORIES_SEED) {
    const category = await prisma.optionCategory.upsert({
      where: { baseKey_materialScope: { baseKey: categorySeed.baseKey, materialScope: categorySeed.materialScope } },
      update: {},
      create: {
        baseKey: categorySeed.baseKey,
        materialScope: categorySeed.materialScope,
        name: categorySeed.name,
        description: categorySeed.description,
      },
    });

    const existingItems = await prisma.optionCategoryItem.findMany({
      where: { categoryId: category.id },
      select: { label: true },
    });
    const existingLabels = new Set(existingItems.map((i) => i.label));

    const newItems = categorySeed.items.filter((item) => !existingLabels.has(item.label));
    for (const [index, item] of newItems.entries()) {
      await prisma.optionCategoryItem.create({
        data: {
          categoryId: category.id,
          label: item.label,
          description: item.description,
          flatPrice: item.flatPrice ?? 0,
          extras: item.extras as never,
          sortOrder: existingLabels.size + index,
        },
      });
    }
  }

  for (const [index, shape] of BUILT_IN_SHAPES_SEED.entries()) {
    await prisma.customShape.upsert({
      where: { id: shape.id },
      update: {},
      create: {
        id: shape.id,
        name: shape.name,
        origin: 'BUILT_IN',
        clipPathType: shape.clipPathType,
        clipPathValue: shape.clipPathValue,
        shapeType: shape.shapeType,
        category: shape.category,
        aspectRatio: shape.aspectRatio,
        isSingleDimension: shape.isSingleDimension,
        priceMode: 'FLAT',
        flatPrice: shape.flatPrice,
        sortOrder: index,
        status: 'APPROVED',
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed complete. Super admin login: ${seedEmail} / ${seedPassword}`,
  );

}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

