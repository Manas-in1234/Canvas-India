import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ShopByCategoryFilter } from '../components/ShopByCategoryFilter';
import { SHOP_CATEGORIES } from '../data/shopCategories';

// Combined results across several "Shop by Category" picks at once (e.g.
// Devotional Art + Line Art together) instead of visiting one category page
// at a time.
export const MultiCategoryPage: React.FC = () => {
  const { allProducts, wishlistIds, onAddToCart, onOpenCustomize, onToggleWishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSlugs = useMemo(
    () => (searchParams.get('categories') || '').split(',').filter(Boolean),
    [searchParams]
  );

  const handleChange = (slugs: string[]) => {
    if (slugs.length > 0) {
      setSearchParams({ categories: slugs.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const selectedNames = useMemo(
    () => SHOP_CATEGORIES.filter((c) => selectedSlugs.includes(c.categorySlug)).map((c) => c.name),
    [selectedSlugs]
  );

  const products = useMemo(
    () => allProducts.filter((p) => selectedSlugs.includes(p.categorySlug)),
    [allProducts, selectedSlugs]
  );

  React.useEffect(() => {
    document.title = selectedNames.length > 0 ? `${selectedNames.join(', ')} | Canvas India` : 'Shop | Canvas India';
  }, [selectedNames]);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-6 sm:py-10">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
          <Link to="/" className="hover:text-[#0E4A93]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">Shop</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {selectedNames.length > 0 ? selectedNames.join(' + ') : 'Shop by Category'}
        </h1>
        <p className="text-sm text-stone-500 mt-1 mb-6">
          {selectedNames.length > 0
            ? `${products.length} product${products.length === 1 ? '' : 's'} across ${selectedNames.length} categor${selectedNames.length === 1 ? 'y' : 'ies'}`
            : 'Check one or more categories to see their products together.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="space-y-3">
            <span className="font-bold text-xs uppercase tracking-wide text-stone-900 block">
              Shop by Category
            </span>
            <ShopByCategoryFilter selectedSlugs={selectedSlugs} onChange={handleChange} />
          </aside>

          {/* Results */}
          <div>
            {selectedSlugs.length === 0 ? (
              <div className="py-16 text-center text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                No categories selected yet — check a few on the left to see their products here.
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                No products found in the selected categories.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                    onCustomize={onOpenCustomize}
                    variant="listing"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiCategoryPage;
