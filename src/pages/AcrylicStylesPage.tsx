import React from 'react';
import { StyleGridPage } from '../components/StyleGridPage';
import { ACRYLIC_PRODUCT_TYPES } from '../data/acrylicCustomizerData';
import { ACRYLIC_STYLE_LANDING_DATA } from '../data/acrylicStyleLandingData';

// Same card set as the homepage's "Acrylic Prints" row (one per real acrylic
// product type), just shown in full instead of a scrollable strip.
const ACRYLIC_STYLE_CARDS = ACRYLIC_PRODUCT_TYPES.map((pt) => {
  const landingData = Object.values(ACRYLIC_STYLE_LANDING_DATA).find((d) => d.styles[0]?.id === pt.id);
  return {
    name: pt.name,
    price: pt.startingPrice,
    image: landingData?.styles[0]?.image,
    href: landingData ? `/acrylic/${landingData.slug}` : `/customize/acrylic/${pt.id}`,
  };
});

export const AcrylicStylesPage: React.FC = () => (
  <StyleGridPage
    pageTitle="Acrylic Prints"
    breadcrumbLabel="Acrylic Prints"
    subtitle="Browse every acrylic format and style"
    cards={ACRYLIC_STYLE_CARDS}
  />
);

export default AcrylicStylesPage;
