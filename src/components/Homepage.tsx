import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, BadgeCheck, Headphones, ShieldCheck, Palette, Leaf, Heart, MapPin, Star, ShoppingCart } from 'lucide-react';
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

const CATEGORY_CARDS = [
  { name: 'Canvas Prints', sub: 'Museum-grade | Made to order', slug: 'canvas', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80' },
  { name: 'Acrylic Prints', sub: 'Vibrant Colors | Crystal Clear', slug: 'acrylic', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80' },
  { name: 'Cork Products', sub: 'Natural | Durable | Stylish', slug: 'cork', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=700&auto=format&fit=crop&q=80' },
  { name: 'Personalized Gifts', sub: 'Make it Uniquely Yours', slug: 'gifts', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&auto=format&fit=crop&q=80' },
];

const OCCASIONS = [
  { name: 'Birthday', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80' },
  { name: 'Anniversary', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80' },
  { name: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80' },
  { name: 'Housewarming', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&auto=format&fit=crop&q=80' },
  { name: 'Diwali', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&auto=format&fit=crop&q=80' },
  { name: 'Corporate Gifts', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop&q=80' },
];

const TESTIMONIALS = [
  { name: 'Asha S.', text: 'Amazing quality and vibrant colours! My canvas turned out even better than I imagined!', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Rohit P.', text: 'Loved the personal touch and quick delivery. Will definitely order again!', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sneha T.', text: 'Beautiful products, great service and such unique designs. Highly recommended!', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Vikram R.', text: 'The acrylic print looks stunning on our living room wall. Packaging was superb.', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1280px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

const SectionTitle: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <div className="text-center mb-7">
    <div className="flex items-center justify-center gap-4">
      <span className="hidden sm:block h-px w-16" style={{ background: `${BLUE}66` }} />
      <h2 className="text-2xl sm:text-[28px] font-bold" style={{ fontFamily: SERIF, color: BLUE }}>{title}</h2>
      <span className="hidden sm:block h-px w-16" style={{ background: `${BLUE}66` }} />
    </div>
    <p className="text-xs text-stone-500 mt-1">{sub}</p>
  </div>
);

const Stars: React.FC = () => (
  <div className="flex gap-0.5">
    {[0, 1, 2, 3, 4].map((n) => (
      <Star key={n} className="w-3 h-3 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const arrowBtn =
  'w-8 h-8 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[#0E4A93] hover:bg-[#0E4A93] hover:text-white transition-colors cursor-pointer shrink-0';

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
    <div className="w-full bg-[#FBF7F0] text-[#1f2937] font-manrope">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-stone-200/70">
        <img
          src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1800&auto=format&fit=crop&q=80"
          alt="Canvas art and craft supplies on a sunlit shelf"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F0] via-[#FBF7F0]/90 to-[#FBF7F0]/10" />
        <Container className="relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-xl">
            <div className="text-[11px] tracking-[0.3em] text-stone-600 font-semibold uppercase mb-4">Art / Craft / Home Decor</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]" style={{ fontFamily: SERIF, color: BLUE }}>
              Make it <em style={{ color: ORANGE }}>Yours</em>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-stone-700 max-w-md leading-relaxed">
              Premium canvas prints, acrylic photo prints, cork products and more — turn your ideas into art, your way.
            </p>
            <button
              type="button"
              onClick={handleStartCreatingCanvas}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0E4A93] hover:bg-[#0B3B77] text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              Create your Canvas <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
              {[
                { icon: Truck, t: 'Free', s: 'Delivery' },
                { icon: BadgeCheck, t: 'Quality', s: 'Products' },
                { icon: Headphones, t: 'Satisfaction', s: '& Support' },
                { icon: ShieldCheck, t: 'Secure', s: 'Payments' },
              ].map(({ icon: Icon, t, s }) => (
                <div key={t} className="flex items-center gap-2">
                  <Icon className="w-6 h-6 shrink-0" style={{ color: BLUE }} strokeWidth={1.6} />
                  <div className="text-[11px] leading-tight text-stone-700">
                    <div className="font-semibold">{t}</div>
                    <div>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="shop-categories" className="py-10 sm:py-12">
        <Container>
          <SectionTitle title="Shop by Category" sub="Explore our wide range of creative handmade products" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CATEGORY_CARDS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelectCategory(c.slug)}
                className="group text-left bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                  <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate" style={{ color: BLUE }}>{c.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">{c.sub}</div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-5">
            <button type="button" onClick={() => navigate('/categories')} className="text-sm font-bold text-[#0E4A93] hover:underline cursor-pointer">
              View All →
            </button>
          </div>
        </Container>
      </section>

      {/* OFFER BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F3E9D8] via-[#F7EFE1] to-[#EADBC2]">
        <img
          src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1400&auto=format&fit=crop&q=80"
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-70"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
        />
        <Container className="relative py-10 sm:py-12">
          <div className="max-w-md">
            <div className="text-[11px] tracking-[0.25em] text-stone-600 font-semibold uppercase">Limited Time Offer</div>
            <h3 className="text-3xl sm:text-4xl font-bold italic mt-1" style={{ fontFamily: SERIF, color: BLUE }}>Handcrafted with Love ♡</h3>
            <p className="text-lg text-stone-800 mt-1" style={{ fontFamily: SERIF }}>Special Offers Just for You!</p>
            <p className="text-sm text-stone-600 mt-1">Get up to 50% OFF on selected products.</p>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="mt-4 px-5 py-2.5 rounded-lg bg-[#0E4A93] hover:bg-[#0B3B77] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              Shop Deals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Container>
      </section>

      {/* SHOP BY OCCASION */}
      <section id="shop-occasions" className="py-10 sm:py-12">
        <Container>
          <SectionTitle title="Shop by Occasion" sub="Thoughtful personalized gifts for life's most precious celebrations" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {OCCASIONS.map((o) => (
              <button key={o.name} type="button" onClick={() => onSelectCategory('gifts', o.name)} className="group text-left cursor-pointer">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 border border-stone-200">
                  <img src={o.image} alt={o.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="mt-2 text-xs font-semibold text-stone-800 group-hover:text-[#0E4A93]">{o.name}</div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* BEST SELLERS */}
      <section id="bestsellers-unboxed" className="pb-10 sm:pb-12">
        <Container>
          <SectionTitle title="Best Sellers" sub="Loved by artists, creators and home decorators" />
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={() => scrollRow(carouselRef, -1)} className={arrowBtn}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div ref={carouselRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 flex-1 snap-x" style={{ scrollbarWidth: 'none' }}>
              {bestsellers.map((p) => (
                <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23.5%] bg-white rounded-xl border border-stone-200/80 shadow-sm p-3">
                  <Link to={`/products/${p.id}`} className="block aspect-[4/3] rounded-lg overflow-hidden bg-stone-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                  </Link>
                  <Link to={`/products/${p.id}`} className="block mt-2 text-xs font-medium text-stone-800 line-clamp-1 hover:text-[#0E4A93]">
                    {p.name}
                  </Link>
                  <div className="flex items-end justify-between mt-1">
                    <div>
                      <div className="text-base font-extrabold" style={{ color: BLUE }}>₹{p.price.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500">
                        <Stars />
                        {p.reviewsCount ? <span>({p.reviewsCount})</span> : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Add to cart"
                      onClick={() => onAddToCart(p)}
                      className="w-8 h-8 rounded-full bg-[#0E4A93] hover:bg-[#E8752A] text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => scrollRow(carouselRef, 1)} className={arrowBtn}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-4">
            <button type="button" onClick={() => navigate('/search')} className="text-sm font-bold text-[#0E4A93] hover:underline cursor-pointer">
              View All →
            </button>
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-gradient-to-r from-[#F3E9D8] to-[#F7EFE1] py-10 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: SERIF, color: BLUE }}>
                Why Choose<br />Canvas India?
              </h2>
              <p className="text-sm text-stone-600 mt-3 max-w-sm">
                We bring your ideas to life with high-quality canvas, acrylic and cork products — helping you create beautiful, handcrafted art that lasts and adds heart to your space.
              </p>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="mt-4 px-5 py-2.5 rounded-lg bg-[#0E4A93] hover:bg-[#0B3B77] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                Order Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { icon: Palette, t: 'Premium Quality' },
                { icon: Leaf, t: 'Eco-Friendly Materials' },
                { icon: Heart, t: 'Trusted by Thousands' },
                { icon: MapPin, t: 'Proudly Indian' },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex flex-col items-center gap-2">
                  <span className="w-14 h-14 rounded-full border bg-white/60 flex items-center justify-center" style={{ borderColor: `${BLUE}66` }}>
                    <Icon className="w-6 h-6" style={{ color: BLUE }} strokeWidth={1.5} />
                  </span>
                  <span className="text-xs font-semibold text-stone-700">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-10 sm:py-12">
        <Container>
          <SectionTitle title="What Our Customers Say" sub="Real people. Real art. Real stories." />
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={() => scrollRow(testiRef, -1)} className={arrowBtn}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div ref={testiRef} className="flex gap-4 overflow-x-auto scroll-smooth flex-1 snap-x pb-1" style={{ scrollbarWidth: 'none' }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="snap-start shrink-0 w-full sm:w-[48%] lg:w-[32%] bg-white rounded-xl border border-stone-200/80 shadow-sm p-4 flex gap-3">
                  <img src={t.img} alt={t.name} loading="lazy" className="w-14 h-14 rounded-full object-cover shrink-0 bg-stone-200" />
                  <div>
                    <Stars />
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed">"{t.text}"</p>
                    <div className="text-[11px] text-stone-500 mt-1">— {t.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => scrollRow(testiRef, 1)} className={arrowBtn}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
};
