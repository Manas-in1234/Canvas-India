import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles, Cake, Heart, Gem, Home, Flame, Gift } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OCCASIONS, getOccasionBySlug } from '../data/occasionsData';
import { SHOP_CATEGORIES } from '../data/shopCategories';

const OCCASION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  birthday: Cake,
  anniversary: Heart,
  wedding: Gem,
  housewarming: Home,
  diwali: Flame,
  'festive-offers': Sparkles,
  'corporate-gifts': Gift,
};

export const OccasionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { allProducts } = useShop();

  const occasion = getOccasionBySlug(slug);

  useEffect(() => {
    if (occasion) {
      document.title = `${occasion.name} Gifts & Prints | Canvas India`;
    }
  }, [occasion]);

  // One tile per category relevant to this occasion — categories with a
  // live customizer (Canvas, Acrylic) open the customizer directly;
  // ready-made print categories open their listing page.
  const giftTiles = useMemo(() => {
    if (!occasion) return [];
    return occasion.categorySlugs
      .map((slugKey) => SHOP_CATEGORIES.find((c) => c.categorySlug === slugKey))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((cat) => {
        const firstProduct = allProducts.find((p) => p.categorySlug === cat.categorySlug);
        const destination = cat.customizerKey
          ? `/customize/${cat.customizerKey}/${firstProduct?.slug || firstProduct?.id || cat.categorySlug}`
          : cat.path;
        // The first catalogue product in a category is often unrelated to
        // the occasion (e.g. a tribal print showing up on the Anniversary
        // page) — use the occasion's own curated photo instead, which is
        // actually relevant and already verified to load (it's the banner).
        return { ...cat, destination, image: occasion.tileImages?.[cat.categorySlug] || occasion.bannerImage };
      });
  }, [occasion, allProducts]);

  if (!occasion) {
    return (
      <div className="w-full bg-[#FFFDF9] py-20 text-center text-stone-900 font-manrope min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h1 className="text-2xl font-bold text-stone-900">Occasion Not Found</h1>
          <p className="text-sm text-stone-500">We couldn&apos;t find that occasion.</p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-[#0E4A93] text-white text-xs font-bold rounded-lg hover:bg-[#09356A] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope relative overflow-hidden">
      {/* Scattered page decorations — florals, a second polaroid, ribbon,
          loose heart doodles — so the page reads as a designed scene, not
          a bare template. Faded on small screens to avoid clutter. */}
      <div className="hidden md:block absolute top-16 left-0 w-40 opacity-70 pointer-events-none -translate-x-6">
        <svg viewBox="0 0 160 140" fill="none">
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx={20 + (i % 3) * 30 + (i > 2 ? 15 : 0)} cy={20 + Math.floor(i / 3) * 40} r={7 + (i % 2) * 2} fill="white" stroke="#E5CFC0" strokeWidth="1" />
          ))}
        </svg>
      </div>
      <div className="hidden lg:block absolute top-[520px] left-0 -translate-x-10 -rotate-6 bg-white p-2 pb-5 rounded-sm shadow-lg z-20 pointer-events-none">
        <img src={occasion.bannerImage} alt="" className="w-28 h-28 object-cover" />
      </div>
      <Heart className="hidden lg:block absolute top-[470px] left-24 w-6 h-6 opacity-40 pointer-events-none" style={{ color: occasion.accent }} />
      <svg className="hidden lg:block absolute bottom-10 right-8 w-28 h-28 opacity-50 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <path d="M10 10 Q50 10 50 50 Q50 90 90 90" stroke="#C9A0A0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="10" r="4" fill="#E8B4B4" />
        <circle cx="88" cy="90" r="4" fill="#E8B4B4" />
      </svg>

      {/* BREADCRUMB */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium">{occasion.name}</span>
        </nav>
      </div>

      {/* HERO BANNER — flat solid color in the occasion's own accent, the
          occasion photo on the right, text vertically centered. No pattern
          texture or doodles — kept clean. */}
      <div className="relative mt-4 mx-auto max-w-[1680px] px-4 sm:px-8 lg:px-12 xl:px-14">
        <section
          className="relative w-full overflow-hidden rounded-3xl h-[280px] sm:h-[320px] lg:h-[360px]"
          style={{ backgroundColor: occasion.accent }}
        >
          {/* The occasion photo, full-bleed on the right, fading into the
              solid color on the left so the headline stays readable */}
          <img
            src={occasion.bannerImage}
            alt={occasion.name}
            className="hidden sm:block absolute right-0 top-0 h-full w-[55%] object-cover"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 20%, #000 45%, #000 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 20%, #000 45%, #000 100%)',
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-sm" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {occasion.name} Gifts &amp; Prints
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mt-3 leading-relaxed drop-shadow-sm">
              {occasion.tagline}
            </p>
          </div>
        </section>
      </div>

      {/* OTHER OCCASIONS QUICK SWITCH */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-6 flex flex-wrap items-center justify-center gap-2.5">
        {OCCASIONS.map((o) => {
          const OIcon = OCCASION_ICONS[o.slug] || Sparkles;
          const active = o.slug === occasion.slug;
          return (
            <Link
              key={o.slug}
              to={`/occasions/${o.slug}`}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                active
                  ? 'text-white border-transparent shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
              style={active ? { backgroundColor: occasion.accent } : undefined}
            >
              <OIcon className="w-3.5 h-3.5" />
              {o.name}
            </Link>
          );
        })}
      </div>

      {/* START YOUR GIFT ORDER — one tile per relevant format, straight into the customizer */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pb-16 sm:pb-20">
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-stone-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Start Your {occasion.name} Gift Order
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">Pick a format to start personalizing your {occasion.name.toLowerCase()} gift</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="h-px w-16 bg-stone-300" />
            <Heart className="w-3.5 h-3.5" style={{ color: occasion.accent }} fill={occasion.accent} />
            <span className="h-px w-16 bg-stone-300" />
          </div>
        </div>

        {giftTiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {giftTiles.map((tile) => {
              const isCanvas = tile.categorySlug === 'canvas';
              const isAcrylic = tile.categorySlug === 'acrylic';
              return (
                <button
                  key={tile.categorySlug}
                  type="button"
                  onClick={() => navigate(tile.destination)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left ring-1 ring-black/5"
                  style={{ backgroundColor: `${occasion.accent}14` }}
                >
                  {/* Canvas: inset like a framed/stretched canvas on a wall.
                      Acrylic: full-bleed with a glossy diagonal sheen. */}
                  <div className={isCanvas ? 'absolute inset-5 sm:inset-7 rounded-md overflow-hidden shadow-lg' : 'absolute inset-0'}>
                    <img
                      src={tile.image}
                      alt={tile.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {isAcrylic && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.2) 100%)' }}
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {tile.customizerKey && (
                    <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5" style={{ color: occasion.accent }} />
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="font-extrabold text-white text-xl sm:text-2xl leading-tight drop-shadow-sm">
                      {tile.name}
                    </div>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/95 bg-white/15 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/30 group-hover:bg-white/25 transition-colors">
                      <span>{tile.customizerKey ? 'Customize Now' : 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-stone-500 py-12">New {occasion.name.toLowerCase()} picks are on the way — check back soon.</p>
        )}

        <div className="text-center mt-10">
          <Link to={`/search?q=${encodeURIComponent(occasion.name)}`} className="text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] inline-flex items-center gap-1 transition-colors">
            <span>Or browse all {occasion.name} products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OccasionPage;
