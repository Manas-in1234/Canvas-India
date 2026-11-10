// Shared between the homepage's "Cork Products" row and the dedicated
// "View All" grid page (CorkProductsPage), so both list the exact same
// set of cork formats instead of drifting apart.
export interface CorkProductCard {
  name: string;
  price: number;
  image: string;
  href: string;
}

export const CORK_PRODUCT_CARDS: CorkProductCard[] = [
  {
    name: 'Cork Pattern Print',
    price: 249,
    image: '/assets/catalogue/cork-art-patterns/C-A_003.webp',
    href: '/cork-art-patterns',
  },
  {
    name: 'Yoga Mats',
    price: 999,
    image: '/assets/products/cork/9C-YA1/9c-ya1(1).webp',
    href: '/yoga-fitness?sub=Yoga%20Mats',
  },
  {
    name: 'Yoga Bricks',
    price: 999,
    image: '/assets/products/cork/9C-YA5/9C-YA5(1).webp',
    href: '/yoga-fitness?sub=Yoga%20Bricks',
  },
  {
    name: 'Yoga Wedges',
    price: 999,
    image: '/assets/products/cork/9C-YA8/9C-YA8.webp',
    href: '/yoga-fitness?sub=Yoga%20Wedges',
  },
  {
    name: 'Yoga Rollers',
    price: 999,
    image: '/assets/products/cork/9C-YA6/9C-YA6(1).webp',
    href: '/yoga-fitness?sub=Yoga%20Rollers',
  },
  {
    name: 'Yoga Balls',
    price: 999,
    image: '/assets/products/cork/9C-YA7/9C-YA7(1).webp',
    href: '/yoga-fitness?sub=Yoga%20Balls',
  },
  {
    name: 'Massage Sets',
    price: 999,
    image: '/assets/products/cork/9C-YA9/9C-YA9.webp',
    href: '/yoga-fitness?sub=Massage%20Sets',
  },
  {
    name: 'Knee Pads',
    price: 999,
    image: '/assets/products/cork/9C-YA11/9C-YA11(1).webp',
    href: '/yoga-fitness?sub=Knee%20Pads',
  },
  {
    name: 'Yoga Bags',
    price: 999,
    image: '/assets/products/cork/9C-YB1/9C-YB1.webp',
    href: '/yoga-fitness?sub=Yoga%20Bags',
  },
];
