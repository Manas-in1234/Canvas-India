import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Award, 
  Truck, 
  ShieldCheck, 
  Layers, 
  Palette, 
  Heart,
  Eye,
  ShoppingBag,
  Upload
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRIMARY_CATEGORIES } from '../data/storeData';

export const AboutUsPage: React.FC = () => {
  const { onOpenCustomize } = useShop();

  useEffect(() => {
    document.title = 'About Us | Canvas India — Handcrafted Personalized Art & Printing';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope selection:bg-[var(--accent-bg)] selection:text-[var(--accent)]">
      
      {/* ========================================================================= */}
      {/* 1. ABOUT US HERO (Warm, Editorial, Box-Free)                             */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#FBF7F0] border-b border-[#EAE3D9] py-14 sm:py-20 lg:py-24">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#0E4A93] text-xs font-bold shadow-xs border border-stone-200/80">
                <Sparkles className="w-3.5 h-3.5 text-[#E8752A]" />
                <span>Handcrafted in India • Dedicated Print Studio</span>
              </div>

              <h1 
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                We Turn Memories Into Things You Can Keep.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                Canvas India is a personalized printing and gifting brand creating beautiful products from the moments, people and ideas that matter. From custom cotton canvas wraps to crystal-clear acrylic glass and eco-cork pinboards, every piece is made to order with pride.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenCustomize()}
                  className="px-6 py-3.5 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Start Creating Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm border border-stone-300 transition-all"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            {/* Hero Visual Display */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=80"
                  alt="Canvas India Artisan Framing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-left text-white">
                  <div className="text-xs uppercase font-bold tracking-widest text-amber-300">Curated Craft</div>
                  <div className="text-sm font-semibold mt-0.5">Where digital memories meet physical artisan craftsmanship</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR STORY (Warm, Authentic Indian Brand Story)                        */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-b border-stone-200">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 text-left space-y-8">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8752A]">
              Authentic Purpose
            </span>
            <h2 
              className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Our Story
            </h2>
          </div>

          <div className="space-y-5 text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
            <p>
              In an age where thousands of family milestones, travel adventures, and festive memories remain locked away in smartphone photo galleries, Canvas India was founded with a clear mission: <strong>bring your most meaningful moments into your living spaces as physical art.</strong>
            </p>
            <p>
              We operate a specialized printing studio that pairs modern 12-color archival pigment printers with master woodwork and framing traditions. Rather than mass-producing generic decor, every order is treated individually. From delicate skin-tone adjustments on wedding portraits to precision laser polishing on acrylic desk blocks, our craftspeople take personal pride in every inch of artwork that leaves our workshop.
            </p>
            <p>
              Whether you are decorating your first apartment living room, celebrating parents&apos; milestone anniversaries, or fitting out contemporary corporate offices, Canvas India delivers museum-standard art with hassle-free doorstep delivery across India.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT WE CREATE (Box-Free Category Showcase)                           */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 bg-[#FFFDF9] border-b border-stone-200">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="text-left space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0E4A93]">
              Product Spectrum
            </span>
            <h2 
              className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              What We Create
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl">
              Five signature product families designed to elevate Indian homes, gifting occasions, and modern workplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
            
            {/* Canvas */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80"
                  alt="Canvas Prints"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">Canvas</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Personalized canvas wall art. Stretched 380 GSM cotton canvas mounted on kiln-dried pine wood with gallery wrap edges.
              </p>
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] transition-colors">
                <span>Explore Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Acrylic */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80"
                  alt="Acrylic Prints"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">Acrylic</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Modern acrylic photo products. High-gloss 5mm cast acrylic with vibrant color depth and stainless steel standoffs.
              </p>
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] transition-colors">
                <span>Explore Acrylic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cork */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80"
                  alt="Cork Prints"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">Cork</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Unique cork-based personalized products. 100% natural compressed cork travel pinboards, calendars and modular tiles.
              </p>
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] transition-colors">
                <span>Explore Cork</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Custom Prints */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80"
                  alt="Custom Prints"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">Custom Prints</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Personalized printing and photo products. Upload your own digital photography or digital designs with custom sizing.
              </p>
              <button onClick={() => onOpenCustomize()} className="inline-flex items-center gap-1 text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] transition-colors cursor-pointer">
                <span>Customize Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gifts */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80"
                  alt="Gifts and Occasions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-base text-stone-900">Gifts</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Personalized gifts for important occasions. Freestanding 20mm desktop blocks, anniversary collages and festive sets.
              </p>
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] transition-colors">
                <span>Explore Gifts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY CANVAS INDIA (4 Core Pillars, Box-Free)                            */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 bg-[#FBF7F0] border-b border-[#EAE3D9]">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="text-left space-y-2 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E8752A]">
              Our Commitments
            </span>
            <h2 
              className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              Why Canvas India?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0E4A93]/10 text-[#0E4A93] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Made For You</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Every personalized product is individually crafted around your memories, custom dimensions, and preferred finish.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E8752A]/10 text-[#E8752A] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Easy Customization</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Create your product online in minutes with real-time size selection, material previews, and instant crop previews.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700/10 text-emerald-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Premium Quality</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Professional 12-color archival inks, 380 GSM cotton canvas, and optical-grade cast acrylic ensure 50+ year longevity.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-700/10 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Pan-India Delivery</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Insured express delivery covering 19,000+ PIN codes across India with custom multi-layer protective packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUR PROCESS (From Your Photo To Your Product)                         */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 border-b border-stone-200">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
          <div className="text-left space-y-2 mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#0E4A93]">
              Simple 4-Step Journey
            </span>
            <h2 
              className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              From Your Photo To Your Product
            </h2>
            <p className="text-sm text-stone-600 max-w-xl">
              Turn your digital photographs into gallery-worthy prints in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            
            {/* 01 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-[#0E4A93] opacity-40 font-mono">01</span>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#0E4A93]" />
                <span>Upload</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Choose your photo from your phone, laptop or cloud storage. High-resolution files give optimal depth.
              </p>
            </div>

            {/* 02 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-[#0E4A93] opacity-40 font-mono">02</span>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#0E4A93]" />
                <span>Customize</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Choose your size, layout, edge wrapping, and frame finish to match your room aesthetic.
              </p>
            </div>

            {/* 03 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-[#0E4A93] opacity-40 font-mono">03</span>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0E4A93]" />
                <span>Preview</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                See exactly how your product looks in realistic 3D mockup before production begins.
              </p>
            </div>

            {/* 04 */}
            <div className="space-y-3">
              <span className="text-3xl font-extrabold text-[#0E4A93] opacity-40 font-mono">04</span>
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0E4A93]" />
                <span>Order</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Place your order securely via UPI or Card. We print, frame, pack and deliver to your doorstep.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5b. CONTACT US                                                           */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-[#FBF7F0] border-t border-b border-[#EAE3D9]">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 text-left space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#E8752A]">Get in Touch</span>
          <h2
            className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
          >
            Contact Us
          </h2>
          <div className="text-sm sm:text-base text-stone-700 space-y-1">
            <p>
              Email:{' '}
              <a href="mailto:info@canvassindia.com" className="text-[#0E4A93] font-semibold hover:underline">
                info@canvassindia.com
              </a>
            </p>
            <p>
              Contact number:{' '}
              <a href="tel:+917893051555" className="text-[#0E4A93] font-semibold hover:underline">
                78930 51555
              </a>
            </p>
            <p>
              Address: H NO 4-9-197/8184, HMT Nagar, HMT Nagar Main Road, Nacharam, Hyderabad, Hyderabad
              District, Telangana &ndash; 500076
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ABOUT US CTA (Have a Memory Worth Framing?)                           */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-24 bg-[#082C59] text-white">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
          >
            Have a Memory Worth Framing?
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            Create something special with Canvas India. Bring your favorite moments to life today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onOpenCustomize()}
              className="px-8 py-3.5 rounded-xl bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Start Creating &rarr;</span>
            </button>
            <Link
              to="/"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition-all"
            >
              Shop Products &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
