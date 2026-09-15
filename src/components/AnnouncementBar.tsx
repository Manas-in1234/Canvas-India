import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenQuote?: () => void;
  onOpenOffers?: () => void;
  variant?: 'charcoal' | 'orange';
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenQuote,
  onOpenOffers,
  variant = 'charcoal',
}) => {
  const isOrange = variant === 'orange';

  return (
    <div
      className={`text-[11px] sm:text-xs py-2 px-4 transition-colors font-medium border-b ${
        isOrange
          ? 'bg-[var(--accent)] text-white border-[var(--accent)]/40'
          : 'bg-stone-950 text-stone-300 border-stone-850'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Trade Help / Direct Connect */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <Phone className="w-3.5 h-3.5 text-[var(--accent-light)]" />
            <span>Architect & Trade Desk: <strong className="text-white">+91 (080) 4122-8900</strong></span>
          </span>
          <span className="opacity-30">|</span>
          <span className="inline-flex items-center gap-1 text-[var(--accent-light)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100-Year Archival Guarantee</span>
          </span>
        </div>

        {/* Center: Main Official Slogan & Announcement */}
        <div className="flex items-center justify-center gap-2 text-center">
          <span className="tracking-wide">
            <span className="mr-1.5">🇮🇳</span>
            <strong className="text-white font-bold tracking-wider">MADE IN INDIA</strong>
            <span className="mx-2 opacity-50">•</span>
            <span className="tracking-wide">PREMIUM CANVAS, ACRYLIC &amp; CORK</span>
            <span className="mx-2 opacity-50">•</span>
            <span className="text-[var(--accent-border)] font-semibold">CUSTOM ORDERS AVAILABLE</span>
          </span>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenOffers && (
            <button
              onClick={onOpenOffers}
              className="text-white hover:text-[var(--accent-border)] font-semibold underline underline-offset-2 transition-colors cursor-pointer text-[11px]"
            >
              Offers
            </button>
          )}
          {onOpenQuote && (
            <button
              onClick={onOpenQuote}
              className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-[10px] tracking-wider uppercase border border-white/20 transition-all cursor-pointer"
            >
              Get a Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
