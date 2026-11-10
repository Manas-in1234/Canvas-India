export interface BulkVariant {
  name: string;
  image: string;
  price: number;
  customizeHref: string;
}

export interface BulkItem {
  slug: string;
  material: 'canvas' | 'acrylic' | 'cork';
  name: string;
  image: string;
  unitPrice: number;
  customizeHref: string;
  variants: BulkVariant[];
}

export const CORK_BULK_ITEMS: BulkItem[] = [
  {
    slug: 'cork-pattern-prints',
    material: 'cork',
    name: 'Cork Pattern Prints',
    image: '/assets/catalogue/cork-art-patterns/C-A_001.webp',
    unitPrice: 249,
    customizeHref: '/cork-art-patterns',
    variants: [
      { name: 'Cork Pattern Print 001', image: '/assets/catalogue/cork-art-patterns/C-A_001.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-001' },
      { name: 'Cork Pattern Print 002', image: '/assets/catalogue/cork-art-patterns/C-A_002.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-002' },
      { name: 'Cork Pattern Print 003', image: '/assets/catalogue/cork-art-patterns/C-A_003.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-003' },
      { name: 'Cork Pattern Print 004', image: '/assets/catalogue/cork-art-patterns/C-A_004.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-004' },
      { name: 'Cork Pattern Print 005', image: '/assets/catalogue/cork-art-patterns/C-A_005.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-005' },
      { name: 'Cork Pattern Print 006', image: '/assets/catalogue/cork-art-patterns/C-A_006.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-006' },
      { name: 'Cork Pattern Print 007', image: '/assets/catalogue/cork-art-patterns/C-A_007.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-007' },
      { name: 'Cork Pattern Print 008', image: '/assets/catalogue/cork-art-patterns/C-A_008.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-008' },
      { name: 'Cork Pattern Print 009', image: '/assets/catalogue/cork-art-patterns/C-A_009.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-009' },
      { name: 'Cork Pattern Print 010', image: '/assets/catalogue/cork-art-patterns/C-A_010.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-010' },
      { name: 'Cork Pattern Print 011', image: '/assets/catalogue/cork-art-patterns/C-A_011.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-011' },
      { name: 'Cork Pattern Print 012', image: '/assets/catalogue/cork-art-patterns/C-A_012.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-012' },
      { name: 'Cork Pattern Print 013', image: '/assets/catalogue/cork-art-patterns/C-A_013.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-013' },
      { name: 'Cork Pattern Print 014', image: '/assets/catalogue/cork-art-patterns/C-A_014.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-014' },
      { name: 'Cork Pattern Print 015', image: '/assets/catalogue/cork-art-patterns/C-A_015.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-015' },
      { name: 'Cork Pattern Print 016', image: '/assets/catalogue/cork-art-patterns/C-A_016.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-016' },
      { name: 'Cork Pattern Print 017', image: '/assets/catalogue/cork-art-patterns/C-A_017.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-017' },
      { name: 'Cork Pattern Print 018', image: '/assets/catalogue/cork-art-patterns/C-A_018.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-018' },
      { name: 'Cork Pattern Print 019', image: '/assets/catalogue/cork-art-patterns/C-A_019.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-019' },
      { name: 'Cork Pattern Print 020', image: '/assets/catalogue/cork-art-patterns/C-A_020.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-020' },
      { name: 'Cork Pattern Print 021', image: '/assets/catalogue/cork-art-patterns/C-A_021.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-021' },
      { name: 'Cork Pattern Print 022', image: '/assets/catalogue/cork-art-patterns/C-A_022.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-022' },
      { name: 'Cork Pattern Print 023', image: '/assets/catalogue/cork-art-patterns/C-A_023.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-023' },
      { name: 'Cork Pattern Print 024', image: '/assets/catalogue/cork-art-patterns/C-A_024.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-024' },
      { name: 'Cork Pattern Print 025', image: '/assets/catalogue/cork-art-patterns/C-A_025.webp', price: 249, customizeHref: '/product/cork-art-patterns-c-a-025' },
    ],
  },
  {
    slug: 'yoga-mats',
    material: 'cork',
    name: 'Yoga Mats',
    image: '/assets/products/cork/9C-YA1/9c-ya1(1).webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya1',
    variants: [
      { name: 'Cork Fabric with EVA 5mm', image: '/assets/products/cork/9C-YA1/9c-ya1(1).webp', price: 999, customizeHref: '/product/cork-9c-ya1' },
      { name: 'Cork Fabric with Latex 5mm', image: '/assets/products/cork/9C-YA2/9C-YA2(1).webp', price: 999, customizeHref: '/product/cork-9c-ya2' },
      { name: 'Fully Rubberized Cork Mat 3mm', image: '/assets/products/cork/9C-YA3/9C-YA3(1).webp', price: 999, customizeHref: '/product/cork-9c-ya3' },
      { name: 'Rubberized Cork with Latex 1.5mm', image: '/assets/products/cork/9C-YA4/9C-YA4(1).webp', price: 999, customizeHref: '/product/cork-9c-ya4' },
    ],
  },
  {
    slug: 'yoga-bricks',
    material: 'cork',
    name: 'Yoga Bricks',
    image: '/assets/products/cork/9C-YA5/9C-YA5(1).webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya5',
    variants: [
      { name: 'Solid Cork Yoga Brick (3-inch)', image: '/assets/products/cork/9C-YA5/9C-YA5(1).webp', price: 999, customizeHref: '/product/cork-9c-ya5' },
      { name: 'High-Density Cork Brick (4-inch)', image: '/assets/products/cork/9C-YA5/9C-YA5(2).webp', price: 999, customizeHref: '/product/cork-9c-ya5' },
    ],
  },
  {
    slug: 'yoga-wedges',
    material: 'cork',
    name: 'Yoga Wedges',
    image: '/assets/products/cork/9C-YA8/9C-YA8.webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya8',
    variants: [
      { name: 'Natural Cork Wrist & Ankle Support Wedge', image: '/assets/products/cork/9C-YA8/9C-YA8.webp', price: 999, customizeHref: '/product/cork-9c-ya8' },
    ],
  },
  {
    slug: 'yoga-rollers',
    material: 'cork',
    name: 'Yoga Rollers',
    image: '/assets/products/cork/9C-YA6/9C-YA6(1).webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya6',
    variants: [
      { name: 'Solid Cork Roller (85mm × 300mm)', image: '/assets/products/cork/9C-YA6/9C-YA6(1).webp', price: 999, customizeHref: '/product/cork-9c-ya6' },
      { name: 'Large Cork Massage Roller (100mm × 300mm)', image: '/assets/products/cork/9C-YA6/9C-YA6(2).webp', price: 999, customizeHref: '/product/cork-9c-ya6' },
      { name: 'Cork Yoga Peanut Spinal Roller', image: '/assets/products/cork/9C-YA12/9C-YA12(1).webp', price: 999, customizeHref: '/product/cork-9c-ya12' },
    ],
  },
  {
    slug: 'yoga-balls',
    material: 'cork',
    name: 'Yoga Balls',
    image: '/assets/products/cork/9C-YA7/9C-YA7(1).webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya7',
    variants: [
      { name: 'Solid Cork Massage Ball (55mm)', image: '/assets/products/cork/9C-YA7/9C-YA7(1).webp', price: 999, customizeHref: '/product/cork-9c-ya7' },
      { name: 'Deep-Tissue Cork Massage Ball (65mm)', image: '/assets/products/cork/9C-YA7/9C-YA7(2).webp', price: 999, customizeHref: '/product/cork-9c-ya7' },
    ],
  },
  {
    slug: 'massage-sets',
    material: 'cork',
    name: 'Massage Sets',
    image: '/assets/products/cork/9C-YA9/9C-YA9.webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya9',
    variants: [
      { name: 'Cork 3-in-1 Massage Roller & Ball Set', image: '/assets/products/cork/9C-YA9/9C-YA9.webp', price: 999, customizeHref: '/product/cork-9c-ya9' },
      { name: 'Cork Foot Massage Ball Recovery Set', image: '/assets/products/cork/9C-YA10/9C-YA10(1).webp', price: 999, customizeHref: '/product/cork-9c-ya10' },
    ],
  },
  {
    slug: 'knee-pads',
    material: 'cork',
    name: 'Knee Pads',
    image: '/assets/products/cork/9C-YA11/9C-YA11(1).webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-ya11',
    variants: [
      { name: 'Rubberized Cork Yoga Knee Pad (24 × 12 inch)', image: '/assets/products/cork/9C-YA11/9C-YA11(1).webp', price: 999, customizeHref: '/product/cork-9c-ya11' },
      { name: 'Cushioned Cork Joint Support Pad', image: '/assets/products/cork/9C-YA11/9C-YA11(2).webp', price: 999, customizeHref: '/product/cork-9c-ya11' },
    ],
  },
  {
    slug: 'yoga-bags',
    material: 'cork',
    name: 'Yoga Bags',
    image: '/assets/products/cork/9C-YB1/9C-YB1.webp',
    unitPrice: 999,
    customizeHref: '/product/cork-9c-yb1',
    variants: [
      { name: 'Cotton & Cork Trim Yoga Mat Bag', image: '/assets/products/cork/9C-YB1/9C-YB1.webp', price: 999, customizeHref: '/product/cork-9c-yb1' },
      { name: 'Natural Cork Yoga Mat Carrier Strap', image: '/assets/products/cork/9C-YB2/9C-YB2.webp', price: 999, customizeHref: '/product/cork-9c-yb2' },
      { name: 'Deluxe Cork Yoga Kit Duffle Bag', image: '/assets/products/cork/9C-YB3/9C-YB3(1).webp', price: 999, customizeHref: '/product/cork-9c-yb3' },
    ],
  },
];
