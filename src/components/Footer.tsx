import React from 'react';
import { 
  Globe,
  Share2,
  MessageCircle,
  Send,
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CreditCard 
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenQuote }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 text-xs">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img
                src="/canvas-india-logo.svg"
                alt="Canvas India"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/canvas-india-logo.jpeg';
                }}
              />
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              India's online personalized printing destination for canvas prints, acrylic glass displays, 
              custom cork boards and photo frames.
            </p>
            <div className="flex items-center gap-3 text-stone-400 pt-1">
              <a href="#" className="hover:text-[#E85D04] transition-colors" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#E85D04] transition-colors" title="Chat Support">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#E85D04] transition-colors" title="Telegram">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-[#E85D04] transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={() => onSelectCategory('canvas')} className="hover:text-white transition-colors">
                  Canvas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('acrylic')} className="hover:text-white transition-colors">
                  Acrylic
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('cork')} className="hover:text-white transition-colors">
                  Cork
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('wall-art')} className="hover:text-white transition-colors">
                  Wall Art
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('photo-frames')} className="hover:text-white transition-colors">
                  Photo Frames
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('posters')} className="hover:text-white transition-colors">
                  Posters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('custom-prints')} className="hover:text-white transition-colors">
                  Custom Prints
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Help</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns &amp; Replacements</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Column 3: Business */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Business</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left">
                  Corporate Orders
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left">
                  Bulk Orders
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="text-[#E85D04] font-bold hover:underline transition-colors text-left">
                  Get a Quote
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('projects')} className="hover:text-white transition-colors text-left">
                  Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#" className="hover:text-white transition-colors">About Canvas India</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>

            <div className="pt-2 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-1 text-white font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#E85D04]" />
                <span>+91 98450 12345</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>orders@canvasindia.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Canvas India. All rights reserved. Made in India.
          </div>

          <div className="flex items-center gap-4">
            <span>100% Safe Payments (UPI, Cards, NetBanking)</span>
            <span>•</span>
            <a href="#" className="hover:text-stone-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-stone-300">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
