import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PolicyPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Shared container for standalone legal policy pages (Privacy Policy, Terms, Shipping,
 * Cancellation, Refund). Preserves the exact text and section markup while seamlessly
 * fitting into the unified RootLayout shell.
 */
export const PolicyPageLayout: React.FC<PolicyPageLayoutProps> = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | Canvas India`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="w-full bg-[#FFFDF9] py-10 sm:py-16 text-left font-manrope">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#0E4A93] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 mb-8 tracking-tight">
          {title}
        </h1>
        <div className="policy-content space-y-6 text-[15px] leading-relaxed text-stone-700">
          {children}
        </div>
      </div>
    </div>
  );
};
