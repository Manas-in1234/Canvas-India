import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PRIMARY_CATEGORIES } from '../data/storeData';

const ROUTES: Record<string, string> = {
  'canvas': '/canvas',
  'canvas-prints': '/canvas',
  'acrylic': '/acrylic',
  'acrylic-prints': '/acrylic',
  'cork-prints': '/cork',
  'bulk-orders': '/bulk-order',
  'corporate': '/corporate-orders',
  'corporate-printing': '/corporate-orders',
};

export const AllCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => { document.title = 'All Categories | Canvas India'; }, []);

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">All Categories</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Categories</h1>
        <p className="text-sm text-stone-500 mt-1 mb-8">Browse every product category at Canvas India</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {PRIMARY_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => navigate(ROUTES[cat.slug] || `/${cat.slug}`)}
              className="group text-left cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group-hover:border-[#0E4A93] transition-colors">
                <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="mt-2 font-semibold text-sm group-hover:text-[#0E4A93]">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesPage;
