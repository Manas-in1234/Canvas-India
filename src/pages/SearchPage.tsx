import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'newest'>('recommended');

  const {
    allProducts,
    wishlistIds,
    onToggleWishlist,
    onAddToCart,
    onOpenCustomize,
  } = useShop();

  useEffect(() => {
    setInputValue(query);
    document.title = query ? `Search: "${query}" | Canvas India` : 'Search Products | Canvas India';
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Perform search
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allProducts;

    return allProducts.filter((product) => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q) || product.categorySlug.toLowerCase().includes(q);
      const matchSub = product.subcategory?.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q) || product.shortDescription?.toLowerCase().includes(q);
      const matchTags = product.tags?.some((tag) => tag.toLowerCase().includes(q));

      return matchName || matchCategory || matchSub || matchDesc || matchTags;
    });
  }, [allProducts, query]);

  // Available categories in results
  const resultCategories = useMemo(() => {
    const cats = new Set<string>();
    searchResults.forEach((p) => cats.add(p.category));
    return ['All', ...Array.from(cats)];
  }, [searchResults]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let list = [...searchResults];
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
    }

    return list;
  }, [searchResults, selectedCategory, sortBy]);

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-900">Search</span>
          {query && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-600 truncate max-w-xs">"{query}"</span>
            </>
          )}
        </nav>

        {/* Search Input Bar */}
        <div className="max-w-2xl mb-8">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search canvas, acrylic, cork, posters, yoga mats, decor..."
              className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border-2 border-stone-200 rounded-xl focus:border-[#0E4A93] focus:outline-none shadow-xs text-stone-900"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h1 
              className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              {query ? `Search Results for "${query}"` : 'All Products Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} matching your query.
            </p>
          </div>

          {/* Sort Control */}
          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-800 outline-none focus:border-[#0E4A93]"
              >
                <option value="recommended">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          )}
        </div>

        {/* Category Filter Pills */}
        {resultCategories.length > 2 && (
          <div className="py-4 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-stone-200/80">
            {resultCategories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Products Grid or Empty State */}
        {filteredAndSorted.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">No products found</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              We couldn't find any products matching "{query}". Try checking your spelling or search using more general terms.
            </p>

            <div className="pt-3">
              <div className="text-xs font-bold text-stone-700 mb-2">Popular Searches:</div>
              <div className="flex flex-wrap justify-center gap-2">
                {['Canvas', 'Acrylic', 'Cork', 'Posters', 'Yoga Mats', 'Wall Art', 'Custom Gifts'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setInputValue(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {filteredAndSorted.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isWishlisted={wishlistIds.includes(prod.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
