import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, BadgeCheck, Headphones, ShieldCheck, Palette, Leaf, Heart, MapPin, Star, ShoppingCart, Sparkles, Quote } from 'lucide-react';
import { Product } from '../types';

export interface HomepageProps {
  onSelectCategory: (slug: string, sub?: string) => void;
  onAddToCart: (product: Product) => void;
  onCustomize: (product?: Product) => void;
  onOpenQuote: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCartCustom?: (customItem: {
    name: string;
    material: string;
    size: string;
    finish: string;
    text: string;
    price: number;
    image: string;
  }) => void;
  allProducts: Product[];
}

const SERIF = '"Playfair Display", Georgia, serif';
const BLUE = '#0E4A93';
const ORANGE = '#E8752A';

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=90`;

const CATEGORY_CARDS = [
  { name: 'Acrylic Paints', sub: 'Vibrant Colors | Endless Possibilities', price: 499, slug: 'acrylic', image: u('photo-1513364776144-60967b0f800f'), grad: 'from-[#0E4A93]/90', chip: 'bg-[#E8752A]' },
  { name: 'Canvas & Boards', sub: 'For Every Art Idea', price: 399, slug: 'canvas', image: u('photo-1579783902614-a3fb3927b675'), grad: 'from-[#7C3AED]/90', chip: 'bg-[#EC4899]' },
  { name: 'Cork Products', sub: 'Natural | Durable | Stylish', price: 449, slug: 'cork', image: u('photo-1586075010923-2dd4570fb338'), grad: 'from-[#B45309]/90', chip: 'bg-[#F59E0B]' },
  { name: 'Personalized Gifts', sub: 'Make it Uniquely Yours', price: 299, slug: 'gifts', image: u('photo-1513151233558-d860c5398176'), grad: 'from-[#BE185D]/90', chip: 'bg-[#0E4A93]' },
];

const OCCASIONS = [
  { name: 'Birthday', emoji: '🎂', image: u('photo-1513151233558-d860c5398176', 800), tint: 'from-[#EC4899]/85' },
  { name: 'Anniversary', emoji: '💞', image: u('photo-1518199266791-5375a83190b7', 800), tint: 'from-[#E11D48]/85' },
  { name: 'Wedding', emoji: '💍', image: u('photo-1519741497674-611481863552', 800), tint: 'from-[#7C3AED]/85' },
  { name: 'Housewarming', emoji: '🏡', image: u('photo-1560448204-e02f11c3d0e2', 800), tint: 'from-[#0E4A93]/85' },
  { name: 'Diwali', emoji: '🪔', image: u('photo-1605721911519-3dfeb3be25e7', 800), tint: 'from-[#EA580C]/85' },
  { name: 'Corporate Gifts', emoji: '🎁', image: u('photo-1497215728101-856f4ea42174', 800), tint: 'from-[#0F766E]/85' },
];

const TESTIMONIALS = [
  { name: 'Asha S.', city: 'Bengaluru', text: 'Amazing quality and vibrant colours! My canvas turned out even better than I imagined!', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rohit P.', city: 'Mumbai', text: 'Loved the personal touch and quick delivery. Will definitely order again!', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sneha T.', city: 'Hyderabad', text: 'Beautiful products, great service and such unique designs. Highly recommended!', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Vikram R.', city: 'Delhi', text: 'The acrylic print looks stunning on our living room wall. Packaging was superb.', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1280px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

const SectionTitle: React.FC<{ title: string; sub: string; light?: boolean }> = ({ title, sub, light }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-4">
      <span className="hidden sm:block h-[3px] w-14 rounded-full bg-gradient-to-r from-transparent to-[#E8752A]" />
      <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: SERIF, color: light ? '#fff' : BLUE }}>{title}</h2>
      <span className="hidden sm:block h-[3px] w-14 rounded-full bg-gradient-to-l from-transparent to-[#E8752A]" />
    </div>
    <p className={`text-sm mt-2 ${light ? 'text-white/75' : 'text-stone-500'}`}>{sub}</p>
  </div>
);

const Stars: React.FC = () => (
  <div className="flex gap-0.5">
    {[0, 1, 2, 3, 4].map((n) => (
      <Star key={n} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const arrowBtn =
  'w-10 h-10 rounded-full bg-white border border-stone-200 shadow-md flex items-center justify-center text-[#0E4A93] hover:bg-[#E8752A] hover:text-white hover:border-[#E8752A] transition-colors cursor-pointer shrink-0';

export const Homepage: React.FC<HomepageProps> = ({ onSelectCategory, onAddToCart, allProducts }) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const testiRef = useRef<HTMLDivElement>(null);

  const handleStartCreatingCanvas = () => {
    const first = allProducts.find((p) => p.categorySlug === 'canvas');
    navigate(`/customize/canvas/${first?.slug || first?.id || 'canvas-classic'}`);
  };

  const scrollRow = (ref: React.RefObject<HTMLDivElement>, dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const bestsellers = allProducts.slice(0, 10);

  return (
    <div className="w-full bg-[#FFF9F1] text-[#1f2937] font-manrope">
      <style>{`
        @keyframes ci-float { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-10px) rotate(var(--r,0deg)); } }
        .ci-float { animation: ci-float 5s ease-in-out infinite; }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F7F1E5] border-b border-stone-200/60">
        <img
          src="/hero-scene.jpg"
          alt="Canvas painting, frame, cork coaster and paints on a sunlit table"
          className="absolute right-0 top-0 h-full w-full lg:w-[60%] object-cover object-left lg:object-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, #000 35%, #000 100%)',
          }}
        />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#F7F1E5] via-[#F7F1E5]/80 to-transparent" />
        <Container className="relative py-14 sm:py-16 lg:py-20 lg:min-h-[540px] flex items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-[11px] sm:text-xs tracking-[0.3em] text-[#093A3E] font-semibold uppercase">
              <span>ART / CRAFT / HOME DECOR</span>
              <span className="h-px w-10 bg-[#093A3E]/40" />
            </div>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.02] text-[#093A3E]" style={{ fontFamily: SERIF }}>
              Make it <em className="font-normal italic">Yours</em>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-stone-700 max-w-md leading-relaxed">
              Premium canvas prints, acrylic paints, cork products and more — turn your ideas into art, your way.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartCreatingCanvas}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#093A3E] hover:bg-[#06292C] text-white text-sm font-bold shadow-md transition cursor-pointer"
              >
                Create your Canvas <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* In-hero feature highlights */}
            <div className="mt-10 pt-6 border-t border-[#093A3E]/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[#093A3E]">
              {[
                { icon: Truck, t: 'Free Delivery' },
                { icon: BadgeCheck, t: 'Quality Products' },
                { icon: Headphones, t: 'Satisfaction & Support' },
                { icon: ShieldCheck, t: 'Secure Payments' },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0 text-[#093A3E]" strokeWidth={2} />
                  <span className="text-xs font-semibold text-stone-800 leading-tight">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="shop-categories" className="py-12 sm:py-16 bg-[#FDFCF8]">
        <Container>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden sm:block h-[1px] w-12 bg-[#1A4F53]" />
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A4F53]" style={{ fontFamily: SERIF }}>Shop by Category</h2>
              <span className="hidden sm:block h-[1px] w-12 bg-[#1A4F53]" />
            </div>
            <p className="text-sm mt-2 text-[#567477]">Explore our wide range of creative handmade products</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORY_CARDS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelectCategory(c.slug)}
                className="group flex flex-col text-left cursor-pointer focus:outline-none"
              >
                <div className="w-full aspect-[4/3] lg:aspect-[3/2] rounded-xl overflow-hidden mb-4 bg-stone-100 shadow-sm">
                  <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-start justify-between gap-2 px-1">
                  <div>
                    <h3 className="text-[#1A4F53] font-bold text-[15px] sm:text-[17px] leading-tight mb-1">{c.name}</h3>
                    <p className="text-[11px] sm:text-[13px] text-[#567477] truncate">{c.sub}</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A4F53] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E8752A] transition-colors shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* OFFER BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#F97316] text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 2px, transparent 3px), radial-gradient(circle at 70% 60%, #fff 2px, transparent 3px), radial-gradient(circle at 90% 20%, #fff 3px, transparent 4px)', backgroundSize: '90px 90px, 120px 120px, 160px 160px' }} />
        <img
          src={u('photo-1518199266791-5375a83190b7', 1600)}
          alt="Happy couple with handcrafted love gift"
          className="absolute right-0 top-0 h-full w-1/2 object-cover object-center"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)', opacity: 0.85 }}
        />
        <Container className="relative py-12 sm:py-16">
          <div className="max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 border border-white/40 text-[11px] tracking-[0.25em] font-bold uppercase">Limited Time Offer</span>
            <h3 className="text-4xl sm:text-5xl font-bold italic mt-3 leading-tight" style={{ fontFamily: SERIF }}>Handcrafted with Love ♡</h3>
            <p className="text-xl mt-2" style={{ fontFamily: SERIF }}>Special Offers Just for You!</p>
            <p className="mt-2 text-base text-white/90">Get up to <span className="text-3xl font-black text-amber-300 align-middle">50% OFF</span> on selected products.</p>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="mt-5 px-7 py-3 rounded-full bg-white text-[#DB2777] hover:bg-amber-300 hover:text-[#7C3AED] text-sm font-extrabold inline-flex items-center gap-2 shadow-xl cursor-pointer transition-colors"
            >
              Shop Deals <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </section>

      {/* SHOP BY OCCASION */}
      <section id="shop-occasions" className="py-12 sm:py-16">
        <Container>
          <SectionTitle title="Shop by Occasion" sub="Thoughtful personalized gifts for life's most precious celebrations" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {OCCASIONS.map((o) => (
              <button
                key={o.name}
                type="button"
                onClick={() => onSelectCategory('gifts', o.name)}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
              >
                <img src={o.image} alt={o.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${o.tint} via-transparent to-transparent`} />
                <span className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow">{o.emoji}</span>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-bold text-sm" style={{ fontFamily: SERIF }}>{o.name}</div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* BEST SELLERS */}
      <section id="bestsellers-unboxed" className="pb-12 sm:pb-16">
        <Container>
          <SectionTitle title="Best Sellers" sub="Loved by artists, creators and home decorators" />
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={() => scrollRow(carouselRef, -1)} className={arrowBtn}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div ref={carouselRef} className="flex gap-5 overflow-x-auto scroll-smooth py-3 flex-1 snap-x" style={{ scrollbarWidth: 'none' }}>
              {bestsellers.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[62%] sm:w-[36%] lg:w-[23.5%] bg-white rounded-2xl border border-orange-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all p-3">
                  <Link to={`/products/${p.id}`} className="relative block aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-[#E8752A] to-[#EC4899] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">Bestseller</span>
                  </Link>
                  <Link to={`/products/${p.id}`} className="block mt-3 text-sm font-semibold text-stone-800 line-clamp-1 hover:text-[#0E4A93]">
                    {p.name}
                  </Link>
                  <div className="flex items-end justify-between mt-1.5">
                    <div>
                      <div className="text-lg font-extrabold" style={{ color: BLUE }}>₹{p.price.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Stars />
                        {p.reviewsCount ? <span>({p.reviewsCount})</span> : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Add to cart"
                      onClick={() => onAddToCart(p)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E4A93] to-[#5B2BB8] hover:from-[#E8752A] hover:to-[#EC4899] text-white flex items-center justify-center shadow-md transition cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => scrollRow(carouselRef, 1)} className={arrowBtn}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#0E4A93] text-[#0E4A93] hover:bg-[#0E4A93] hover:text-white text-sm font-bold transition-colors cursor-pointer"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A3573] via-[#0E4A93] to-[#5B2BB8] text-white py-14 sm:py-16">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#E8752A]/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-72 h-72 rounded-full bg-[#EC4899]/25 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: SERIF }}>
                Why Choose<br /><span className="bg-gradient-to-r from-amber-300 to-[#FF6FB1] bg-clip-text text-transparent">Canvas India?</span>
              </h2>
              <p className="text-sm text-white/80 mt-4 max-w-sm leading-relaxed">
                We bring your ideas to life with high-quality canvas, acrylic and cork products — helping you create beautiful, handcrafted art that lasts and adds heart to your space.
              </p>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="mt-6 px-7 py-3 rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#E8752A] hover:brightness-110 text-white text-sm font-bold inline-flex items-center gap-2 shadow-xl cursor-pointer transition"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-5 text-center">
              {[
                { icon: Palette, t: 'Premium Quality', c: 'from-[#F59E0B] to-[#EF4444]' },
                { icon: Leaf, t: 'Eco-Friendly Materials', c: 'from-[#10B981] to-[#0EA5E9]' },
                { icon: Heart, t: 'Trusted by Thousands', c: 'from-[#EC4899] to-[#8B5CF6]' },
                { icon: MapPin, t: 'Proudly Indian', c: 'from-[#F97316] to-[#EAB308]' },
              ].map(({ icon: Icon, t, c }) => (
                <div key={t} className="flex flex-col items-center gap-3 bg-white/10 border border-white/20 rounded-2xl py-5 px-2 backdrop-blur-sm hover:bg-white/15 transition">
                  <span className={`w-14 h-14 rounded-full bg-gradient-to-br ${c} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-bold">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 sm:py-16 bg-[radial-gradient(ellipse_at_bottom,#FFE9D2_0%,#FFF9F1_60%)]">
        <Container>
          <SectionTitle title="What Our Customers Say" sub="Real people. Real art. Real stories." />
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={() => scrollRow(testiRef, -1)} className={arrowBtn}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div ref={testiRef} className="flex gap-5 overflow-x-auto scroll-smooth flex-1 snap-x py-3" style={{ scrollbarWidth: 'none' }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="relative snap-start shrink-0 w-full sm:w-[48%] lg:w-[32%] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-5 border-t-4 border-[#E8752A]">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-[#E8752A]/20" />
                  <Stars />
                  <p className="text-sm text-stone-700 mt-3 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-4">
                    <img src={t.img} alt={t.name} loading="lazy" className="w-11 h-11 rounded-full object-cover ring-2 ring-[#E8752A]/40 bg-stone-200" />
                    <div className="leading-tight">
                      <div className="text-sm font-bold text-stone-900">{t.name}</div>
                      <div className="text-[11px] text-stone-500">{t.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => scrollRow(testiRef, 1)} className={arrowBtn}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
};
