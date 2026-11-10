import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';

export interface StyleGridCard {
  name: string;
  image?: string;
  price?: number;
  href: string;
}

interface StyleGridPageProps {
  pageTitle: string;
  breadcrumbLabel: string;
  subtitle: string;
  cards: StyleGridCard[];
}

// Shared "View All" grid used by the homepage's Canvas & Boards, Acrylic
// Prints and Cork Products rows — same layout as AllCategoriesPage, but for
// a single vertical's own set of style/format cards (which route straight
// into that style's landing or customizer page) instead of every top-level
// category.
export const StyleGridPage: React.FC<StyleGridPageProps> = ({ pageTitle, breadcrumbLabel, subtitle, cards }) => {
  const navigate = useNavigate();
  React.useEffect(() => { document.title = `${pageTitle} | Canvas India`; }, [pageTitle]);

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">{breadcrumbLabel}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="text-sm text-stone-500 mt-1 mb-8">{subtitle}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {cards.map((c) => (
            <button
              key={c.href}
              type="button"
              onClick={() => navigate(c.href)}
              className="group text-left cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group-hover:border-[#0E4A93] transition-colors">
                {c.image ? (
                  <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100">
                    <ImageIcon className="w-10 h-10 text-stone-300" />
                  </div>
                )}
              </div>
              <div className="mt-2 font-semibold text-sm group-hover:text-[#0E4A93]">{c.name}</div>
              {c.price !== undefined && (
                <div className="text-xs text-stone-500">Starts at ₹{c.price.toLocaleString('en-IN')}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleGridPage;
