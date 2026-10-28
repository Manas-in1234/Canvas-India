import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenQuote: () => void;
  onOpenAccount?: () => void;
  onTrackOrder?: () => void;
  variant?: string;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenQuote, onOpenAccount, onTrackOrder }) => {
  return (
    <footer className="bg-[#0B1727] text-stone-300 pt-12 pb-8 text-xs font-manrope">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-stone-800/80">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-3.5">
            <div className="py-1">
              <img
                src="/canvas-india-official-logo.webp"
                alt="Canvas India"
                className="w-[125px] sm:w-[135px] h-auto object-contain block select-none"
              />
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              India&apos;s preferred personalized art &amp; printing studio. Handcrafted custom canvas, museum-grade acrylics, eco-cork, and premium photo frames.
            </p>
            <div>
              <Link to="/about-us" className="inline-block text-[11px] font-semibold text-[#E8752A] hover:text-white transition-colors">
                About Us &rarr;
              </Link>
            </div>

            {/* Contact Us */}
            <div className="pt-2 text-stone-400 text-[11px] leading-relaxed space-y-1.5 border-t border-stone-800/80">
              <div className="font-bold text-xs uppercase tracking-wider text-white mb-2">
                Contact Us
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400">Email:</span>
                <a href="mailto:info@canvassindia.com" className="text-stone-200 hover:text-white transition-colors">
                  info@canvassindia.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8752A] shrink-0" />
                <span className="text-stone-400">Contact Number:</span>
                <a href="tel:+917893051555" className="text-stone-200 hover:text-white transition-colors">
                  78930 51555
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-stone-400">WhatsApp:</span>
                <a 
                  href="https://wa.me/917893051555" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-200 hover:text-emerald-400 transition-colors"
                >
                  78930 51555
                </a>
              </div>

              <div className="flex items-start gap-2 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#E8752A] shrink-0 mt-0.5" />
                <div className="leading-snug text-stone-300">
                  <span className="text-stone-400 mr-1">Address:</span>
                  H NO 4-9-197/8184, HMT Nagar, HMT Nagar Main Road, Nacharam, Hyderabad, Hyderabad District, Telangana – 500076
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Shop Categories</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><Link to="/canvas" className="hover:text-white transition-colors">Canvas Frames</Link></li>
              <li><Link to="/acrylic" className="hover:text-white transition-colors">Acrylic Wall Art</Link></li>
              <li><Link to="/cork" className="hover:text-white transition-colors">Natural Cork Prints &amp; Yoga Mats</Link></li>
              <li><Link to="/occasions" className="hover:text-white transition-colors">Gifts &amp; Celebrations</Link></li>
              <li><Link to="/bulk-order" className="hover:text-white transition-colors">Corporate Branding</Link></li>
            </ul>
          </div>

          {/* Column 3: Occasions & Gifting */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Occasions & Gifting</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><Link to="/occasions/birthday" className="hover:text-white transition-colors">Birthday Gifts</Link></li>
              <li><Link to="/occasions/anniversary" className="hover:text-white transition-colors">Anniversary Frames</Link></li>
              <li><Link to="/occasions/wedding" className="hover:text-white transition-colors">Wedding Keepsakes</Link></li>
              <li><Link to="/occasions/valentines-day" className="hover:text-white transition-colors">Valentine's Day Gifts</Link></li>
              <li><Link to="/occasions/housewarming" className="hover:text-white transition-colors">Housewarming Art</Link></li>
              <li><Link to="/occasions/festive-offers" className="hover:text-white transition-colors">Festive &amp; Diwali Specials</Link></li>
              <li><Link to="/occasions/mothers-day" className="hover:text-white transition-colors">Mother's &amp; Father's Day</Link></li>
              <li><Link to="/bulk-order" className="hover:text-white transition-colors">Corporate Hampers</Link></li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Customer Support</h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li>
                <button type="button" onClick={onTrackOrder} className="hover:text-white transition-colors text-left cursor-pointer">
                  Track Your Order
                </button>
              </li>
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
              <li>
                <Link to="/designers-architects" className="hover:text-white transition-colors">
                  Designers &amp; Architects Solutions
                </Link>
              </li>
            </ul>
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

export default Footer;
