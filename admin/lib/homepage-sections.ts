/**
 * The homepage blocks an admin can show, hide, reorder and rename. A copy of the backend list
 * (backend/src/catalog/homepage-layout.ts): the admin build cannot import from outside admin/.
 * The hero banner always comes first and is not listed.
 */
export const HOMEPAGE_SECTIONS: Array<{ key: string; label: string; renamable: boolean; hint: string }> = [
  { key: "categories", label: "Shop by Category", renamable: true, hint: "The row of category tiles" },
  { key: "canvas", label: "Canvas & Boards", renamable: true, hint: "Canvas styles row" },
  { key: "acrylic", label: "Acrylic Prints", renamable: true, hint: "Acrylic styles row" },
  { key: "cork", label: "Cork Products", renamable: true, hint: "Hides itself when there are no cork products" },
  { key: "occasions", label: "Shop by Occasion", renamable: true, hint: "Gifts & Occasions you manage" },
  { key: "bestsellers", label: "Best Sellers", renamable: true, hint: "Popular products" },
  { key: "bulk", label: "Corporate & Bulk Orders", renamable: false, hint: "The blue enquiry banner" },
  { key: "why", label: "Why Choose Canvas India", renamable: false, hint: "Reasons to buy panel" },
  { key: "testimonials", label: "What Our Customers Say", renamable: true, hint: "Customer testimonials" },
];

export interface HomepageSectionSetting {
  key: string;
  enabled: boolean;
  title: string;
}

export interface HomepageLayoutSettings {
  storeOpen: boolean;
  closedMessage: string;
  sections: HomepageSectionSetting[];
}
