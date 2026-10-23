import React from 'react';
import { StyleGridPage } from '../components/StyleGridPage';
import { CANVAS_STYLE_LANDING_DATA } from '../data/canvasStyleLandingData';

// Same card set as the homepage's "Canvas & Boards" row (one per Canvas
// style landing page), just shown in full instead of a scrollable strip.
const CANVAS_STYLE_CARDS = Object.values(CANVAS_STYLE_LANDING_DATA)
  .filter((data) => Boolean(data.styles[0]?.image))
  .map((data) => ({
    name: data.pageTitle,
    image: data.styles[0]!.image as string,
    price: data.styles[0]!.price,
    href: `/canvas/${data.slug}`,
  }));

export const CanvasStylesPage: React.FC = () => (
  <StyleGridPage
    pageTitle="Canvas & Boards"
    breadcrumbLabel="Canvas & Boards"
    subtitle="Browse every canvas format and layout"
    cards={CANVAS_STYLE_CARDS}
  />
);

export default CanvasStylesPage;
