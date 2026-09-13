import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle, 
  Receipt,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenQuote: () => void;
  variant?: string;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenQuote }) => {
  return (
    <footer className="bg-[#0B1727] text-stone-300 pt-12 pb-8 text-xs font-manrope">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Top Trust & Value Proposition Strip (Unboxed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 mb-8 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E8752A]/20 text-[#E8752A] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Free Delivery on ₹999+</div>
              <div className="text-[11px] text-stone-400">Insured shipping across 19,000+ pin codes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">GST Invoicing Available</div>
              <div className="text-[11px] text-stone-400">Claim 18% input tax credit on business orders</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0E4A93]/40 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">100% Safe Payments</div>
              <div className="text-[11px] text-stone-400">Encrypted UPI, Cards, NetBanking & EMI</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">Instant WhatsApp Support</div>
              <div className="text-[11px] text-stone-400">+91 78930 51555 (Mon-Sat 9am - 8pm)</div>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-stone-800/80">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-3.5">
            <div className="py-1">
              <img
                src="/canvas-india-official-logo.png"
                alt="Canvas India"
                className="w-[125px] sm:w-[135px] h-auto object-contain block select-none"
              />
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              India's preferred personalized art & printing studio. Handcrafted custom canvas, museum-grade acrylics, eco-cork, and premium photo frames.
            </p>
            <Link to="/about-us" className="inline-block text-[11px] font-semibold text-[#E8752A] hover:text-white transition-colors">
              About Us &rarr;
            </Link>

            <div className="pt-1 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-white font-medium">
                <Phone className="w-3.5 h-3.5 text-[#E8752A]" />
                <a href="tel:+917893051555" className="hover:text-[#E8752A] transition-colors">
                  +91 78930 51555
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/917893051555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: +91 78930 51555
                </a>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <a href="mailto:info@canvassindia.com" className="hover:text-white transition-colors">
                  info@canvassindia.com
                </a>
              </div>
              <div className="flex items-start gap-2 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span>
                  H NO 4-9-197/8184, HMT Nagar, HMT Nagar Main Road, Nacharam, Hyderabad, Telangana &ndash; 500076
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Shop Categories</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={() => onSelectCategory('canvas-prints')} className="hover:text-white transition-colors cursor-pointer">
                  Canvas Prints
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('acrylic-prints')} className="hover:text-white transition-colors cursor-pointer">
                  Acrylic Photo Prints
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('cork-prints')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Cork Boards
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('custom-prints')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Prints & Collages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('photo-frames')} className="hover:text-white transition-colors cursor-pointer">
                  Solid Wood Photo Frames
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('wall-decor')} className="hover:text-white transition-colors cursor-pointer">
                  Living Room Wall Art
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Occasions & Gifting */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Occasions & Gifting</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Birthday Gifts</button></li>
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Anniversary Frames</button></li>
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Wedding Keepsakes</button></li>
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Couple Photo Displays</button></li>
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Festive & Diwali Specials</button></li>
              <li><button onClick={() => onSelectCategory('gifts')} className="hover:text-white transition-colors cursor-pointer">Housewarming Art</button></li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Customer Support</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping &amp; Delivery Timelines</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Returns &amp; Replacement Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 5: Bulk & Corporate */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Bulk & Corporate</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Tailored solutions for businesses, interior designers, architects, and corporate gifting.
            </p>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left cursor-pointer">
                  Corporate Gifting Solutions
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left cursor-pointer">
                  Bulk Order Discounts (25+ units)
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left cursor-pointer">
                  GST Invoicing & Input Credit
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="hover:text-white transition-colors text-left cursor-pointer">
                  Artist & Creator Program
                </button>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E8752A] text-white font-bold text-xs hover:bg-[#d0641e] transition-colors cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Payments + Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Canvas India Inc. Handcrafted with passion in India. All rights reserved.
          </div>

          {/* Payment Badges Strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-400 text-[10px] font-semibold mr-1">Accepted Payment Methods:</span>
            <span className="px-2 py-0.5 bg-stone-800 text-white rounded text-[10px] font-bold border border-stone-700">UPI (GPay / PhonePe / Paytm)</span>
            <span className="px-2 py-0.5 bg-stone-800 text-white rounded text-[10px] font-bold border border-stone-700">RuPay</span>
            <span className="px-2 py-0.5 bg-stone-800 text-white rounded text-[10px] font-bold border border-stone-700">Visa / Mastercard</span>
            <span className="px-2 py-0.5 bg-stone-800 text-white rounded text-[10px] font-bold border border-stone-700">NetBanking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
