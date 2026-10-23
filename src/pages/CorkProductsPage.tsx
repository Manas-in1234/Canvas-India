import React from 'react';
import { StyleGridPage } from '../components/StyleGridPage';
import { CORK_PRODUCT_CARDS } from '../data/corkProductCards';

// Same card set as the homepage's "Cork Products" row, just shown in full
// instead of a scrollable strip.
export const CorkProductsPage: React.FC = () => (
  <StyleGridPage
    pageTitle="Cork Products"
    breadcrumbLabel="Cork Products"
    subtitle="Browse every cork format — prints, yoga mats, bricks and more"
    cards={CORK_PRODUCT_CARDS}
  />
);

export default CorkProductsPage;
