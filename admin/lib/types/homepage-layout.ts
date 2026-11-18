export interface HomepageSectionSetting {
  key: string;
  enabled: boolean;
  title: string;
  productIds?: string[];
}

export interface HomepageLayout {
  storeOpen: boolean;
  closedMessage: string;
  sections: HomepageSectionSetting[];
}

/** Keys the storefront knows how to render — see src/api/homepageLayoutApi.ts. */
export const HOMEPAGE_SECTION_LABELS: Record<string, string> = {
  categories: 'Shop by Category',
  canvas: 'Canvas Prints',
  acrylic: 'Acrylic Prints',
  cork: 'Cork Prints',
  occasions: 'Shop by Occasion',
  bestsellers: 'Best Sellers',
  bulk: 'Bulk & Corporate Orders',
  why: 'Why Canvas India',
  testimonials: 'What Our Customers Say',
};

/** Only these sections let the admin curate an explicit product list. */
export const CURATABLE_SECTION_KEYS = new Set(['occasions', 'bestsellers']);
