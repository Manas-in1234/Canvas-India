import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Canvas India';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-20 px-4 text-center font-manrope bg-[#FFFDF9]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-6xl font-extrabold text-[#0E4A93]/30 font-mono">
          404
        </div>
        
        <div className="space-y-2">
          <h1 
            className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
          >
            Page Not Found
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to creating beautiful artwork.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
