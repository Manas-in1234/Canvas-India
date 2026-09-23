import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Mail, 
  Award, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  Palette,
  Layers,
  CircleDot,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const DesignersArchitectsPage: React.FC = () => {
  const { onOpenQuote } = useShop();

  useEffect(() => {
    document.title = 'Solutions for Interior Designers & Architects | Canvas India';
  }, []);

  const supportedSpaces = [
    { name: 'Residential Interiors', desc: 'Custom living room statement canvases & bedroom panoramas' },
    { name: 'Corporate Offices', desc: 'Brand values, meeting room graphics & acoustic wall tiles' },
    { name: 'Hotels', desc: 'Suite collections, corridors & reception optical glass art' },
    { name: 'Restaurants', desc: 'Atmospheric culinary artwork & bespoke dining partitions' },
    { name: 'Cafés', desc: 'Artisanal coffee sketches, chalkboard themes & wall decals' },
    { name: 'Retail Stores', desc: 'High-gloss acrylic signage, point-of-sale & showcase displays' },
    { name: 'Schools', desc: 'Educational notice boards, cork learning maps & inspirational art' },
    { name: 'Hospitals', desc: 'Healing nature landscapes, wellness art & calming corridor sets' },
    { name: 'Gyms', desc: 'High energy workout posters, vinyl murals & motivational canvas' },
    { name: 'Yoga Studios', desc: 'Mantra art, branded yoga mats & serene meditation decor' },
    { name: 'Wellness Centers', desc: 'Organic cork acoustics, natural textures & minimalist art' },
    { name: 'Showrooms', desc: 'Grand oversized wall panels & precision dimensional logos' },
    { name: 'Hospitality Projects', desc: 'Turnkey art packages for boutique resorts & luxury stays' },
    { name: 'Commercial Interiors', desc: 'Architectural wall installations adhering to design briefs' },
  ];

  const customizationSpecs = [
    { title: 'Brand Guidelines', desc: 'Strict adherence to design manuals and corporate visual identity' },
    { title: 'Colours & Pantone', desc: 'Exact Pantone and CMYK color balancing with pre-production digital proofs' },
    { title: 'Logos & Vectors', desc: 'Laser-cut acrylic letters, brushed metal composite & UV sub-surface print' },
    { title: 'Photographs & Art', desc: 'Museum-grade 12-color archival pigment inks guaranteed for 50+ years' },
    { title: 'Design Requirements', desc: 'Tailored to architect AutoCAD, 3D render, and interior elevation layouts' },
    { title: 'Custom Dimensions', desc: 'Millimetre precision sizing from tabletop blocks up to grand multi-panel walls' },
    { title: 'Quantity Scaling', desc: 'From bespoke single pieces to 500+ unit hotel and corporate fitouts' },
    { title: 'Materials', desc: '380 GSM Cotton Canvas, 5mm–10mm Optical Cast Acrylic, Natural Portuguese Cork & Heavy Wood' },
    { title: 'Finishes', desc: 'Matte Gallery Wrap, Teak Floater Frames, Polished Beveled Edges & Stainless Standoffs' },
  ];

  return (
    <div className="w-full bg-[#FFFDF9] py-6 sm:py-12 text-stone-900 font-manrope">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-8">
          <Link to="/" className="hover:text-[#0E4A93] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-semibold">Solutions for Interior Designers &amp; Architects</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-stone-200">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E8752A]">
              <Building2 className="w-4 h-4 text-[#E8752A]" />
              <span>Architectural Trade &amp; Production Partnership</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-tight">
              Solutions for Interior Designers &amp; Architects
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Canvas India works as a dedicated production partner for interior designers, architects, decorators, contractors, hospitality professionals and commercial-space developers across India.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-6 py-3.5 rounded-xl bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Talk to Our Production Team →</span>
              </button>

              <a
                href="https://wa.me/917893051555?text=Hi%20Canvas%20India%2C%20I%20am%20an%20interior%20designer%2Farchitect%20interested%20in%20production%20partnership"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Trade Desk</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80"
                alt="Architectural Visual Display"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Supported Spaces Grid */}
        <div className="py-14 border-b border-stone-200 text-left">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#0E4A93]">
              Spaces &amp; Verticals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Supported Commercial &amp; Residential Spaces
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              From individual luxury residences to 500-room hotel fitouts, we manufacture and drop-ship custom visual products nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedSpaces.map((space) => (
              <div 
                key={space.name}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-[#0E4A93]/60 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#E8752A]" />
                  <h3 className="font-bold text-sm text-stone-900">{space.name}</h3>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {space.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Capabilities According to Specs */}
        <div className="py-14 border-b border-stone-200 text-left">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#E8752A]">
              Manufacturing Flexibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Customized to Your Exact Project Specifications
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Every product is built from scratch at our dedicated Indian production studio to meet client design criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customizationSpecs.map((spec) => (
              <div 
                key={spec.title}
                className="p-5 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0E4A93]" />
                  <h3 className="font-bold text-sm text-stone-900">{spec.title}</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trade Partner Benefits Strip */}
        <div className="py-14 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <Award className="w-6 h-6 text-[#E8752A]" />
              <div className="font-bold text-sm text-stone-900">Trade Pricing &amp; Volume Rebates</div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Exclusive tiered trade discounts for registered interior design firms, architects, and independent decorators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div className="font-bold text-sm text-stone-900">Dedicated Account Manager</div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Single point of contact for pre-production color proofs, CAD scaling, site deliveries, and GST invoicing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <Truck className="w-6 h-6 text-[#0E4A93]" />
              <div className="font-bold text-sm text-stone-900">Pan-India Multi-Site Logistics</div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Direct insured delivery to client project sites across 19,000+ PIN codes with multi-layer rigid corner packing.
              </p>
            </div>
          </div>

          <div className="mt-10 p-8 rounded-2xl bg-[#0E4A93] text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left">
              <h3 className="text-xl sm:text-2xl font-bold">Have an Upcoming Interior Project?</h3>
              <p className="text-xs sm:text-sm text-blue-100">
                Share your mood board, elevations, or bill of quantities with our technical production team.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-6 py-3 rounded-xl bg-[#E8752A] hover:bg-[#D3631A] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Talk to Our Production Team →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DesignersArchitectsPage;
