import React from 'react';
import { CanvasIndiaLogo } from './CanvasIndiaLogo';
import { Phone, Mail, MapPin, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface SharedFooterProps {
  themeVariant?: 'dark' | 'light' | 'modern';
  onOpenQuote?: () => void;
  onOpenSwatch?: () => void;
}

export const SharedFooter: React.FC<SharedFooterProps> = ({
  themeVariant = 'dark',
  onOpenQuote,
  onOpenSwatch,
}) => {
  const isLight = themeVariant === 'light';

  return (
    <footer className={`border-t transition-colors ${
      isLight 
        ? 'bg-stone-100 text-stone-700 border-stone-300' 
        : 'bg-stone-950 text-stone-400 border-stone-800'
    }`}>
      {/* Top Banner: Manufacturing Hubs & Guarantees */}
      <div className={`border-b px-4 py-6 ${isLight ? 'border-stone-200 bg-stone-200/40' : 'border-stone-850 bg-stone-900/40'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Archival Longevity</div>
              <div className="text-[11px] text-stone-500">100+ year pigment warranty on canvases</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Sub-Millimeter CNC</div>
              <div className="text-[11px] text-stone-500">Diamond polished cast acrylic precision</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Pan-India Production</div>
              <div className="text-[11px] text-stone-500">Hubs in Mumbai, Bengaluru & Delhi NCR</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <span className="font-bold text-xs">ECO</span>
            </div>
            <div>
              <div className={`font-bold ${isLight ? 'text-stone-900' : 'text-white'}`}>Sustainable Cork & Pine</div>
              <div className="text-[11px] text-stone-500">100% renewable bark & FSC timber</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <CanvasIndiaLogo
                className="h-14 w-auto"
                variant={isLight ? 'original' : 'dark-mode'}
              />
              <span className="text-xs font-bold tracking-widest text-[#E8751A] uppercase">
                Canvas | Acrylic | Corks
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-stone-400">
              Canvas India is a premier Indian manufacturing atelier delivering museum-grade Canvas, optical Cast Acrylic, and sustainable Portuguese Cork displays for homes, creative workspaces, luxury hospitality, and progressive enterprises.
            </p>
            
            {/* Made in India Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#E8751A]" />
              <span>Proudly Made in India • Precision Engineered</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenSwatch}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-700 hover:border-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                Request Swatch Box
              </button>
              <button
                onClick={onOpenQuote}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#E8751A] hover:bg-orange-600 text-white transition-colors cursor-pointer"
              >
                Get a Quote
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-orange-500 transition-colors">Home</a></li>
              <li><a href="#featured-products" className="hover:text-orange-500 transition-colors">Products</a></li>
              <li><a href="#materials" className="hover:text-orange-500 transition-colors">Materials</a></li>
              <li><a href="#quick-order" className="hover:text-orange-500 transition-colors">Custom Orders</a></li>
              <li><a href="#custom-solutions" className="hover:text-orange-500 transition-colors">Corporate</a></li>
              <li><a href="#why-canvas-india" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#quote-modal" onClick={(e) => { e.preventDefault(); if (onOpenQuote) onOpenQuote(); }} className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Materials */}
          <div className="space-y-3 text-xs">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Materials
            </h4>
            <ul className="space-y-2">
              <li><a href="#featured-products" className="hover:text-orange-500 transition-colors font-medium text-stone-300">Canvas</a></li>
              <li className="text-[11px] text-stone-500 pl-2">420 GSM Pure Cotton, Belgian Linen &amp; Archival Inks</li>
              <li><a href="#featured-products" className="hover:text-orange-500 transition-colors font-medium text-stone-300">Acrylic</a></li>
              <li className="text-[11px] text-stone-500 pl-2">Cast Monomer, 92% Clarity &amp; Diamond Polished</li>
              <li><a href="#featured-products" className="hover:text-orange-500 transition-colors font-medium text-stone-300">Cork</a></li>
              <li className="text-[11px] text-stone-500 pl-2">Self-Healing Portuguese Bark &amp; Acoustic Wall Tiles</li>
            </ul>
          </div>

          {/* Col 4: Contact & Manufacturing Studio */}
          <div className="space-y-3 text-xs">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-stone-900' : 'text-white'}`}>
              Contact &amp; Studios
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E8751A] shrink-0 mt-0.5" />
                <span>Unit 14, Marol Industrial Estate, Andheri East, Mumbai, MH 400059</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8751A] shrink-0" />
                <span>support@canvasindia.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8751A] shrink-0" />
                <span>+91 98200 12345 / 022 2850 6789</span>
              </div>
              
              {/* WhatsApp Quick Chat */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919820012345?text=Hi%20Canvas%20India%2C%20I%20would%20like%20to%20enquire%20about%20custom%20displays"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>WhatsApp: +91 98200 12345</span>
                </a>
              </div>

              <div className="pt-1">
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 border border-stone-800">
                  GST Registered • Pan-India Freight
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Tagline Echo */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Canvas India. All rights reserved.</span>
            <span>•</span>
            <span className="text-orange-400 font-medium">Canvas | Acrylic | Corks</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-stone-300 transition-colors">Terms of Supply</a>
            <a href="#sustainability" className="hover:text-stone-300 transition-colors">Material Quality Specs</a>
            <a href="#login" className="hover:text-stone-300 transition-colors">Trade Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
