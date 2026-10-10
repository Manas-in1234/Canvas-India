import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ArrowRight, Sparkles, Cake, Heart, Gem, Home, Flame, Gift, PartyPopper,
  Users, GraduationCap, Baby, UserRound, Flag, CalendarHeart, HandHeart, Music2, Moon, Ghost, TreePine, Sun, Wheat, Crown,
  Check, ShieldCheck, Smile, Image as ImageIcon, RectangleHorizontal, Square, Circle, Plus,
} from 'lucide-react';
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
  'mothers-day': Heart,
  'brothers-day': Users,
  'fathers-day': UserRound,
  'friendship-day': HandHeart,
  'teachers-day': GraduationCap,
  'childrens-day': Baby,
  'mens-day': UserRound,
  'new-year': PartyPopper,
  'republic-day': Flag,
  'valentines-day': Heart,
  'womens-day': Crown,
};

// Festival/special-day list shown on the Festive Offers page. The 11 with
// their own dedicated occasion page (Mother's/Brother's/Father's Day,
// Friendship Day, Teacher's/Children's/Men's/Women's Day, New Year,
// Republic Day, Valentine's Day) live there instead — this is just the
// remainder, still worth a quick-pick grid but without a full page each.
const ALL_FESTIVALS: { name: string; date: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { name: 'Rakshabandhan', date: '28th August', icon: HandHeart },
  { name: 'Janmashtami', date: '4th September', icon: Music2 },
  { name: 'Ganesh Chaturthi', date: '14th September', icon: Sparkles },
  { name: 'Karwa Chauth', date: '29th October', icon: Moon },
  { name: 'Halloween', date: '31st October', icon: Ghost },
  { name: 'Diwali', date: '5th November', icon: Flame },
  { name: 'Bhai Dooj', date: '11th November', icon: CalendarHeart },
  { name: 'Christmas', date: '25th December', icon: TreePine },
  { name: 'Lohri', date: '13th January', icon: Flame },
  { name: 'Makar Sankranti', date: '14th January', icon: Sun },
  { name: 'Pongal', date: '14th January', icon: Wheat },
  { name: 'Holi', date: '6th March', icon: Sparkles },
];

// Format-level selling points (material, not occasion-specific — the same
// canvas/acrylic facts apply no matter which occasion page they appear on).
const FORMAT_INFO: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; tagline: string; description: string; bullets: string[]; cta: string }> = {
  canvas: {
    icon: ImageIcon,
    tagline: 'Warm. Artistic. Timeless.',
    description: 'Canvas prints give your photos a beautiful textured finish, creating a classic and heartfelt gift that feels personal and warm.',
    bullets: ['Matte finish with rich colours', 'Sturdy & durable', 'Perfect for home or gifting'],
    cta: 'Explore Canvas',
  },
  acrylic: {
    icon: Sparkles,
    tagline: 'Sleek. Vibrant. Modern.',
    description: 'Acrylic prints bring your photos to life with vivid colours, a glossy finish and a premium, modern look.',
    bullets: ['Crystal clear, high-gloss finish', 'Brighter & sharper colours', 'Looks premium and elegant'],
    cta: 'Explore Acrylic',
  },
};

const SHAPE_OPTIONS: { name: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { name: 'Rectangle', icon: RectangleHorizontal },
  { name: 'Square', icon: Square },
  { name: 'Circle', icon: Circle },
  { name: 'Heart', icon: Heart },
  { name: 'Custom Size', icon: Plus },
];

const STANDARD_SIZES = ['8x6', '12x8', '16x12', '20x16', '24x18'];

const TRUST_BADGES: { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[] = [
  { label: 'High Quality Prints', icon: Gift },
  { label: 'Safe & Secure Delivery', icon: ShieldCheck },
  { label: 'Premium Finish', icon: Heart },
  { label: 'Loved by Thousands', icon: Smile },
];

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

  // Every festival tile leads to the same live customizer — there's no
  // per-festival product catalogue yet, so this is a functional "start a
  // personalized gift" entry point rather than a filtered listing.
  const handleCustomizeFestival = () => {
    const first = allProducts.find((p) => p.categorySlug === 'canvas');
    navigate(`/customize/canvas/${first?.slug || first?.id || 'canvas-photo-panel'}`);
  };

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

      {/* FORMAT CARDS — Canvas / Acrylic, each with its own selling points, straight into the customizer */}
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 pb-16 sm:pb-20">
        {occasion.categorySlugs.length > 0 && (
          giftTiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
              {giftTiles.map((tile) => {
                const info = FORMAT_INFO[tile.categorySlug];
                if (!info) return null;
                const FormatIcon = info.icon;
                return (
                  <div
                    key={tile.categorySlug}
                    className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={tile.image} alt={tile.name} className="absolute inset-0 w-full h-full object-cover" />
                      <span
                        className="absolute bottom-3 right-3 w-14 h-14 rounded-full border-4 border-white shadow-md"
                        style={{ background: tile.categorySlug === 'canvas' ? 'repeating-linear-gradient(45deg, #e7e5e4, #e7e5e4 2px, #f5f5f4 2px, #f5f5f4 6px)' : 'linear-gradient(135deg, #cbd5e1, #f8fafc, #93c5fd)' }}
                      />
                    </div>
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${occasion.accent}14` }}>
                          <FormatIcon className="w-5 h-5" style={{ color: occasion.accent }} />
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                          {tile.name}
                        </h3>
                      </div>
                      <p className="mt-4 font-bold text-base" style={{ color: occasion.accent }}>{info.tagline}</p>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed">{info.description}</p>
                      <ul className="mt-4 space-y-2">
                        {info.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-sm text-stone-700">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${occasion.accent}14` }}>
                              <Check className="w-3 h-3" style={{ color: occasion.accent }} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => navigate(tile.destination)}
                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8752A] hover:bg-[#D3631A] text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <span>{info.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-stone-500 py-12">New {occasion.name.toLowerCase()} picks are on the way — check back soon.</p>
          )
        )}

        {/* Shop by Festival — every special day from the reference grid,
            not just the occasions with their own dedicated page. Festive
            Offers only. */}
        {occasion.slug === 'festive-offers' && (
          <div className="mt-16 sm:mt-20">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Shop by Festival
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1.5">Pick any special day to start a personalized gift for it</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {ALL_FESTIVALS.map((f) => {
                const FIcon = f.icon;
                return (
                <button
                  key={f.name}
                  type="button"
                  onClick={handleCustomizeFestival}
                  className="group flex flex-col items-center text-center p-4 rounded-xl border border-stone-200 bg-white hover:border-transparent hover:shadow-lg transition-all cursor-pointer"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = occasion.accent)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <span
                    className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5 transition-colors"
                    style={{ backgroundColor: `${occasion.accent}14` }}
                  >
                    <FIcon className="w-5 h-5" style={{ color: occasion.accent }} />
                  </span>
                  <span className="text-xs font-bold text-stone-800 leading-tight">{f.name}</span>
                  <span className="text-[10px] text-stone-400 mt-0.5">{f.date}</span>
                </button>
                );
              })}
            </div>
          </div>
        )}

        {occasion.categorySlugs.length > 0 && (
        <div className="text-center mt-10">
          <Link to={`/search?q=${encodeURIComponent(occasion.name)}`} className="text-xs font-bold text-[#0E4A93] hover:text-[#E8752A] inline-flex items-center gap-1 transition-colors">
            <span>Or browse all {occasion.name} products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        )}
      </div>

      {/* CHOOSE YOUR SHAPE & SIZE — a visual teaser of the customizer's first
          two steps, same on every occasion page, leading into Personalize Now */}
      <div className="w-full bg-[#EFF6FF] py-14 sm:py-16">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: occasion.accent }}>Choose Your</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Choose Your Shape &amp; Size
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl mx-auto">
            Pick a shape and size, or go custom. Then upload your photo, add a message (optional), and we&apos;ll turn it into a beautiful keepsake.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Step 1: Choose Shape */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: occasion.accent }}>1</span>
                <span className="font-bold text-sm text-stone-900">Choose Shape</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SHAPE_OPTIONS.map((s, i) => {
                  const SIcon = s.icon;
                  const active = i === 0;
                  return (
                    <div
                      key={s.name}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center ${active ? '' : 'border-stone-200 border-dashed'}`}
                      style={active ? { borderColor: occasion.accent, backgroundColor: `${occasion.accent}14` } : undefined}
                      title={s.name}
                    >
                      <SIcon className="w-4 h-4" style={{ color: active ? occasion.accent : '#a8a29e' }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Size */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: occasion.accent }}>2</span>
                <span className="font-bold text-sm text-stone-900">Select Size</span>
              </div>
              <div className="flex rounded-lg border border-stone-200 p-1 text-xs font-bold mb-3">
                <span className="flex-1 text-center py-1.5 rounded-md text-white" style={{ backgroundColor: occasion.accent }}>Standard Sizes</span>
                <span className="flex-1 text-center py-1.5 rounded-md text-stone-500">Custom Size</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.map((sz) => (
                  <span key={sz} className="px-2.5 py-1 rounded-full border border-stone-200 text-[11px] font-semibold text-stone-600">{sz}</span>
                ))}
              </div>
            </div>

            {/* Step 3: Start Customizing */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: occasion.accent }}>3</span>
                <span className="font-bold text-sm text-stone-900">Start Customizing</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed flex-1">
                Upload your photo, add a message (if you want) and create something truly special.
              </p>
              <button
                type="button"
                onClick={handleCustomizeFestival}
                className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E8752A] hover:bg-[#D3631A] text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                <span>Personalize Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST BADGES FOOTER */}
      <div className="w-full bg-[#FFFDF9] py-8 border-t border-stone-100">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TRUST_BADGES.map((b) => {
            const BIcon = b.icon;
            return (
              <div key={b.label} className="flex flex-col items-center text-center gap-2">
                <BIcon className="w-5 h-5" style={{ color: occasion.accent }} />
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600">{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OccasionPage;
