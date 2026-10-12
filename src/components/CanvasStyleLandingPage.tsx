import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Layers,
  Clock,
  Circle,
  Triangle,
  Heart,
  Hexagon,
  Grid3x3,
  Columns3,
  ScrollText,
  Users,
  Package,
  Frame,
  Images,
  Mountain
} from 'lucide-react';

export type CanvasStyleIcon =
  | 'circle' | 'triangle' | 'heart' | 'hexagon' | 'grid' | 'columns'
  | 'scroll' | 'users' | 'package' | 'frame' | 'images' | 'mountain';

// Most of these categories have no real photographed product image in the
// repo yet (confirmed via repo-wide search) — rather than invent fake photo
// URLs that would 404 or mislead, a style with no real `image` renders as a
// clean branded icon card instead via `icon`.
const STYLE_ICONS: Record<CanvasStyleIcon, React.ReactNode> = {
  circle: <Circle className="w-10 h-10" />,
  triangle: <Triangle className="w-10 h-10" />,
  heart: <Heart className="w-10 h-10" />,
  hexagon: <Hexagon className="w-10 h-10" />,
  grid: <Grid3x3 className="w-10 h-10" />,
  columns: <Columns3 className="w-10 h-10" />,
  scroll: <ScrollText className="w-10 h-10" />,
  users: <Users className="w-10 h-10" />,
  package: <Package className="w-10 h-10" />,
  frame: <Frame className="w-10 h-10" />,
  images: <Images className="w-10 h-10" />,
  mountain: <Mountain className="w-10 h-10" />
};

export interface CanvasStyleHighlight {
  id: string;
  number: string;
  name: string;
  description: string;
  price: number;
  /** Real photo path/URL. Leave unset and use `icon` when no real image exists. */
  image?: string;
  icon?: CanvasStyleIcon;
  customizeHref: string;
}

export interface CanvasStyleGalleryItem {
  label: string;
  image?: string;
  icon?: CanvasStyleIcon;
}

export interface CanvasStyleFeature {
  icon: 'layers' | 'sparkles' | 'shield' | 'clock';
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
                  {style.image ? (
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

      {/* Gallery strip */}
      <section className="w-full bg-stone-50 border-y border-stone-200/80 py-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mb-6">{data.galleryTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.galleryItems.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="aspect-square rounded-2xl overflow-hidden bg-stone-200 border border-stone-200">
                  {item.image ? (
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
