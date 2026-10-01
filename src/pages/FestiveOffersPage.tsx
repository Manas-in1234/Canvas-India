import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, Clock, Percent } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

const SERIF = '"Playfair Display", Georgia, serif';
const BLUE = '#0E4A93';
const ORANGE = '#E8752A';

const FESTIVALS = [
  { name: 'Diwali', emoji: '🪔' },
  { name: 'Christmas', emoji: '🎄' },
  { name: 'New Year', emoji: '🎉' },
  { name: 'Anniversary', emoji: '💞' },
  { name: 'Wedding', emoji: '💍' },
  { name: 'Birthday', emoji: '🎂' },
];

const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[1280px] mx-auto px-4 sm:px-8 ${className}`}>{children}</div>
);

export const FestiveOffersPage: React.FC = () => {
  const navigate = useNavigate();
  const { allProducts, wishlistIds, onToggleWishlist, onAddToCart, onOpenCustomize } = useShop();

  useEffect(() => {
    document.title = 'Festive Offers | Canvas India — Flat 20% OFF';
  }, []);

  const offerProducts = useMemo(() => {
    return [...allProducts]
      .filter((p) => (p.discountPercent ?? 0) > 0)
      .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
      .slice(0, 12);
  }, [allProducts]);

  const displayProducts = offerProducts.length > 0 ? offerProducts : allProducts.slice(0, 12);

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F6EFE1] to-[#F3E3CB] border-b border-stone-200/60 py-8 sm:py-10">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <Container className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/30 text-[#EA580C] text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Festive Season Offer • Limited Time</span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-3"
            style={{ fontFamily: SERIF }}
          >
            <span style={{ color: BLUE }}>Festive </span>
            <em className="font-semibold italic" style={{ color: ORANGE }}>Offers</em>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
            Celebrate the season with flat 20% off on canvas prints, acrylic frames, cork decor and personalized gifts.
          </p>
        </Container>
      </section>

      {/* OFFER PRODUCTS GRID */}
      <section className="py-10 sm:py-12">
        <Container>
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: SERIF, color: BLUE }}>
              On Offer Right Now
            </h2>
            <p className="text-sm mt-2 text-stone-500">Hand-picked festive favorites, discounted for a limited time</p>
          </div>
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={onAddToCart}
                  onCustomize={onOpenCustomize}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-stone-500">New festive offers are on the way — check back soon.</p>
          )}
        </Container>
      </section>

      {/* FESTIVALS STRIP */}
      <section className="py-6 sm:py-8 border-y border-stone-200/60">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {FESTIVALS.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => navigate(`/gifts?sub=${encodeURIComponent(f.name)}`)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-stone-200 hover:border-[#0E4A93]/40 hover:shadow-md transition-all cursor-pointer"
              >
                <span className="text-lg leading-none">{f.emoji}</span>
                <span className="text-sm font-semibold text-stone-700">{f.name}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* WHY SHOP THE OFFER */}
      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Percent, title: 'Flat 20% OFF', desc: 'Across canvas, acrylic, cork & gifts' },
              { icon: Gift, title: 'Free Personalization', desc: 'Add names, photos & custom text' },
              { icon: Clock, title: 'Limited Time', desc: 'Festive pricing ends soon' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#0E4A93]/10 text-[#0E4A93] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};
