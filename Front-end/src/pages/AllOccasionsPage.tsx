import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { OCCASIONS } from '../data/occasionsData';

export const AllOccasionsPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => { document.title = 'All Occasions | Canvas India'; }, []);

  return (
    <div className="w-full bg-[#FFFDF9] py-8 sm:py-12 text-stone-900 font-manrope min-h-[70vh]">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-[#0E4A93]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">All Occasions</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Occasions</h1>
        <p className="text-sm text-stone-500 mt-1 mb-8">Thoughtful personalized gifts for every celebration</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
          {OCCASIONS.map((o) => (
            <button
              key={o.slug}
              type="button"
              onClick={() => navigate(`/occasions/${o.slug}`)}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
            >
              <img src={o.bannerImage} alt={o.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${o.tint} via-transparent to-transparent`} />
              <span className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow">{o.emoji}</span>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-bold text-sm">{o.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllOccasionsPage;
