import React from 'react';
import { Check } from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/shopCategories';
import { useShop } from '../context/ShopContext';

export interface ShopCategoryOption {
  name: string;
  categorySlug: string;
}

export interface ShopByCategoryFilterProps {
  categories?: ShopCategoryOption[];
  /** Currently checked category slugs. */
  selectedSlugs: string[];
  /** Called with the updated slug list whenever a box is toggled — the host
   * page merges those categories' products into its own listing in place. */
  onChange: (slugs: string[]) => void;
  onItemClick?: () => void;
}

export const ShopByCategoryFilter: React.FC<ShopByCategoryFilterProps> = ({
  categories,
  selectedSlugs,
  onChange,
  onItemClick,
}) => {
  const { isCategoryVisible, allProducts } = useShop();
  // cat.name is a snapshot that only updates by hand-editing shopCategories.ts
  // - a rename in the admin's Categories page never reaches it on its own.
  // Any live product tagged with this categorySlug already carries the
  // current admin-set name (mapBackendProductToFrontend resolves it from
  // the live ProductType), so prefer that name here, same as the category
  // landing pages and the homepage "Shop by Category" cards already do.
  const list = (categories || SHOP_CATEGORIES)
    .filter((cat) => isCategoryVisible(cat.categorySlug))
    .map((cat) => {
      const liveName = allProducts.find((p) => p.categorySlug === cat.categorySlug)?.category;
      return liveName && liveName !== cat.name ? { ...cat, name: liveName } : cat;
    });

  const toggle = (slug: string) => {
    const next = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((s) => s !== slug)
      : [...selectedSlugs, slug];
    onChange(next);
    onItemClick?.();
  };

  return (
    <div className="space-y-1">
      {list.map((cat) => {
        const isChecked = selectedSlugs.includes(cat.categorySlug);
        return (
          <label
            key={cat.categorySlug}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-stone-50 text-stone-700"
          >
            <span
              className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                isChecked ? 'bg-[#0E4A93] border-[#0E4A93]' : 'bg-white border-stone-300'
              }`}
            >
              {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </span>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(cat.categorySlug)}
              className="sr-only"
            />
            <span className="flex-1">{cat.name}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ShopByCategoryFilter;
