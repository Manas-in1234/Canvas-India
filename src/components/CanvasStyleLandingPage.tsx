import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Layers,
  Clock,
  Heart,
  Hexagon,
  ScrollText,
  Users,
  Package,
  Mountain,
  Columns3,
  Frame,
  Images,
  PawPrint
} from 'lucide-react';

export type CanvasStyleIcon =
  | 'hexagon' | 'scroll' | 'users' | 'package' | 'mountain'
  | 'columns' | 'frame' | 'images' | 'heart' | 'paw';

// A handful of categories (Hexagon, Banner, Wholesale, Caricature, Panoramic
// and Split gallery slots) still don't have a real photographed or
// deterministically-drawable image — those keep a plain icon card, chosen
// so the icon's own meaning is still accurate (a mountain for "Landscapes",
// a hexagon for hexagon prints). Shapes and layout-style categories (Shaped
// Canvas, Photo Collage, Photo Mosaic) instead get a `visual` mockup drawn
// in CSS/SVG below, which is guaranteed to actually look like what it's
// labeled as, unlike a reused stock photo whose real subject was never
// verified before — several of those turned out to show something
// completely unrelated (confetti, a tote bag, a ship painting).
const STYLE_ICONS: Record<CanvasStyleIcon, React.ReactNode> = {
  hexagon: <Hexagon className="w-10 h-10" />,
  scroll: <ScrollText className="w-10 h-10" />,
  users: <Users className="w-10 h-10" />,
  package: <Package className="w-10 h-10" />,
  mountain: <Mountain className="w-10 h-10" />,
  columns: <Columns3 className="w-10 h-10" />,
  frame: <Frame className="w-10 h-10" />,
  images: <Images className="w-10 h-10" />,
  heart: <Heart className="w-10 h-10" />,
  paw: <PawPrint className="w-10 h-10" />
};

export type CanvasStyleVisual =
  | 'shape-circle' | 'shape-triangle' | 'shape-heart' | 'shape-oval'
  | 'gallery-wall' | 'collage-grid' | 'mosaic-grid';

const VISUAL_GRADIENTS = ['from-[#0E4A93] to-[#2f6fc9]', 'from-[#E8752A] to-[#f4a05f]', 'from-emerald-600 to-emerald-400', 'from-violet-600 to-violet-400'];

function renderVisual(visual: CanvasStyleVisual) {
  switch (visual) {
    case 'shape-circle':
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-blue-50/60">
          <div className="w-2/3 aspect-square rounded-full bg-gradient-to-br from-[#0E4A93] to-[#2f6fc9] shadow-inner" />
        </div>
      );
    case 'shape-triangle':
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-blue-50/60">
          <div
            className="w-2/3 aspect-square bg-gradient-to-br from-[#0E4A93] to-[#2f6fc9]"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
        </div>
      );
    case 'shape-heart':
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-blue-50/60">
          <Heart className="w-2/3 h-2/3 fill-[#0E4A93] text-[#0E4A93]" />
        </div>
      );
    case 'shape-oval':
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-50 to-blue-50/60">
          <div className="w-2/3 aspect-[4/3] rounded-full bg-gradient-to-br from-[#0E4A93] to-[#2f6fc9] shadow-inner" />
        </div>
      );
    case 'gallery-wall':
      // An asymmetric 3-panel arrangement — mirrors an actual hung gallery wall.
      return (
        <div className="w-full h-full flex items-center justify-center gap-2 p-4 bg-stone-100">
          <div className={`w-1/2 aspect-[3/4] rounded-sm bg-gradient-to-br ${VISUAL_GRADIENTS[0]} shadow-md border-2 border-white`} />
          <div className="flex flex-col gap-2 w-1/3">
            <div className={`aspect-square rounded-sm bg-gradient-to-br ${VISUAL_GRADIENTS[1]} shadow-md border-2 border-white`} />
            <div className={`aspect-square rounded-sm bg-gradient-to-br ${VISUAL_GRADIENTS[2]} shadow-md border-2 border-white`} />
          </div>
        </div>
      );
    case 'collage-grid':
      // A tight edge-to-edge 2x2 grid — a literal photo collage layout.
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5 bg-stone-100">
          {VISUAL_GRADIENTS.map((g) => (
            <div key={g} className={`bg-gradient-to-br ${g}`} />
          ))}
        </div>
      );
    case 'mosaic-grid': {
      // A dense grid of many small tiles — "built from hundreds of micro photos".
      const cells = Array.from({ length: 36 });
      return (
        <div className="w-full h-full grid grid-cols-6 grid-rows-6 gap-px p-1 bg-stone-100">
          {cells.map((_, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${VISUAL_GRADIENTS[i % VISUAL_GRADIENTS.length]}`}
              style={{ opacity: [0.6, 0.8, 1][i % 3] }}
            />
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

export interface CanvasStyleHighlight {
  id: string;
  number: string;
  name: string;
  description: string;
  price: number;
  /** Real photo path/URL — only used when the actual photo content has been verified. */
  image?: string;
  /** Deterministic CSS/SVG mockup guaranteed to match its label (shape outlines, layout grids). */
  visual?: CanvasStyleVisual;
  icon?: CanvasStyleIcon;
  customizeHref: string;
}

export interface CanvasStyleGalleryItem {
  label: string;
  image?: string;
  visual?: CanvasStyleVisual;
  icon?: CanvasStyleIcon;
}

export interface CanvasStyleFeature {
  icon: 'layers' | 'sparkles' | 'shield' | 'clock';
  title: string;
  desc: string;
}

export interface CanvasStyleInfoItem {
  title: string;
  desc: string;
}

export interface CanvasStyleLandingData {
  slug: string;
  pageTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  stylesSectionTitle: string;
  styles: CanvasStyleHighlight[];
  /** Optional extra detail section between the styles and the gallery strip. */
  infoTitle?: string;
  infoSubtitle?: string;
  infoItems?: CanvasStyleInfoItem[];
  galleryTitle: string;
  galleryItems: CanvasStyleGalleryItem[];
  featuresTitle: string;
  features: CanvasStyleFeature[];
}

const FEATURE_ICONS: Record<CanvasStyleFeature['icon'], React.ReactNode> = {
  layers: <Layers className="w-5 h-5" />,
  sparkles: <Sparkles className="w-5 h-5" />,
  shield: <ShieldCheck className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />
};

export const CanvasStyleLandingPage: React.FC<{ data: CanvasStyleLandingData }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FFFDF9] text-stone-900 font-manrope min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full border-b border-stone-200 bg-white">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
            <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link to="/canvas" className="hover:text-[#0E4A93] transition-colors">Canvas</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-bold text-stone-900">{data.pageTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="w-full max-w-3xl mx-auto px-4 sm:px-8 pt-12 pb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">{data.heroTitle}</h1>
        <p className="mt-3 text-sm text-stone-600 leading-relaxed">{data.heroSubtitle}</p>
      </section>

      {/* Styles */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-12">
        <h2 className="text-lg sm:text-xl font-black text-stone-900 mb-8">{data.stylesSectionTitle}</h2>

        <div className="space-y-10">
          {data.styles.map((style, idx) => {
            const imageOnRight = idx % 2 === 1;
            return (
              <div
                key={style.id}
                className={`flex flex-col ${imageOnRight ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-center gap-6 sm:gap-8`}
              >
                <div className="w-full sm:w-64 shrink-0 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 aspect-[4/3]">
                  {style.visual ? (
                    renderVisual(style.visual)
                  ) : style.image ? (
                    <img src={style.image} alt={style.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center text-[#0E4A93]">
                      {style.icon ? STYLE_ICONS[style.icon] : <Sparkles className="w-10 h-10" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-[#0E4A93] tracking-wider mb-1">{style.number} /</div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mb-1.5">{style.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">{style.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-stone-700">
                      From <span className="text-stone-900">₹{style.price.toLocaleString('en-IN')}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(style.customizeHref)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8752A] hover:bg-[#d6651d] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <span>Customize This Style</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Optional extra info section */}
      {data.infoItems && data.infoItems.length > 0 && (
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-12">
          <h2 className="text-lg sm:text-xl font-black text-stone-900 mb-1">{data.infoTitle}</h2>
          {data.infoSubtitle && <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-2xl">{data.infoSubtitle}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.infoItems.map((item) => (
              <div key={item.title} className="p-4 rounded-xl border border-stone-200 bg-white">
                <div className="text-xs font-extrabold text-stone-900 mb-1">{item.title}</div>
                <div className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery strip */}
      <section className="w-full bg-stone-50 border-y border-stone-200/80 py-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mb-6">{data.galleryTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.galleryItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="aspect-square rounded-2xl overflow-hidden bg-stone-200 border border-stone-200">
                  {item.visual ? (
                    renderVisual(item.visual)
                  ) : item.image ? (
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center text-[#0E4A93]">
                      {item.icon ? STYLE_ICONS[item.icon] : <Sparkles className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <div className="text-center text-[11px] font-bold text-stone-700">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features footer */}
      <section className="w-full py-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mb-6">{data.featuresTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {data.features.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0E4A93]">
                  {FEATURE_ICONS[feature.icon]}
                </div>
                <div className="text-xs font-bold text-stone-900">{feature.title}</div>
                <div className="text-[11px] text-stone-500 leading-relaxed">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
