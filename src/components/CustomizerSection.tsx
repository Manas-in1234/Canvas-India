import React, { useState } from 'react';
import { 
  UploadCloud, 
  Type, 
  Maximize2, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { Product } from '../types';

interface CustomizerSectionProps {
  onStartCreating: () => void;
  onAddToCartCustom: (customItem: {
    name: string;
    material: string;
    size: string;
    finish: string;
    text: string;
    price: number;
    image: string;
  }) => void;
}

export const CustomizerSection: React.FC<CustomizerSectionProps> = ({
  onStartCreating,
  onAddToCartCustom,
}) => {
  const [material, setMaterial] = useState<'canvas' | 'acrylic' | 'cork'>('canvas');
  const [size, setSize] = useState('12x18 inch');
  const [finish, setFinish] = useState('Matte Finish');
  const [customText, setCustomText] = useState('Cherished Moments • 2026');
  const [uploadedImage, setUploadedImage] = useState(
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
  );

  const sampleImages = [
    {
      name: 'Artistic Landscape',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Family Memories',
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Botanical Living',
      url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80',
    },
  ];

  // Dynamic price calculation
  const getPrice = () => {
    let base = material === 'canvas' ? 999 : material === 'acrylic' ? 1499 : 799;
    if (size === '16x24 inch') base += 400;
    if (size === '24x36 inch') base += 900;
    if (finish === 'Floating Frame') base += 350;
    return base;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleAddPreviewToCart = () => {
    onAddToCartCustom({
      name: `Custom ${material.toUpperCase()} Print`,
      material,
      size,
      finish,
      text: customText,
      price: getPrice(),
      image: uploadedImage,
    });
  };

  return (
    <section id="customizer-section" className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-[clamp(20px,4vw,64px)]">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Customization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Create Something Your Way
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Test our customization workflow below. Pick materials, upload a photo, adjust typography, 
            and see a live preview in seconds.
          </p>
        </div>

        {/* Interactive Customizer Workbench */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-4 sm:p-6 lg:p-8 xl:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Live Visual Mockup Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg xl:max-w-xl bg-stone-100 p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-inner flex flex-col items-center">
              
              {/* Product Frame Rendering */}
              <div 
                className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
                  material === 'canvas' 
                    ? 'border-8 border-stone-800' 
                    : material === 'acrylic' 
                    ? 'border-2 border-white/80 ring-4 ring-sky-200' 
                    : 'border-4 border-amber-900/60'
                }`}
              >
                <img
                  src={uploadedImage}
                  alt="Custom Preview"
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Custom Text */}
                {customText && (
                  <div className="absolute bottom-4 left-4 right-4 text-center bg-black/60 backdrop-blur-sm text-white py-1.5 px-3 rounded-md text-xs sm:text-sm font-semibold tracking-wide">
                    {customText}
                  </div>
                )}

                {/* Material Tag */}
                <div className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                  {material} • {size}
                </div>
              </div>

              {/* Sample Images Quick Switch */}
              <div className="mt-4 w-full flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold">Sample Photos:</span>
                <div className="flex gap-2">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUploadedImage(s.url)}
                      className={`px-2 py-1 rounded text-[11px] border font-medium ${
                        uploadedImage === s.url 
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)]' 
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="mt-4 w-full bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-[11px] text-stone-500">Estimated Total (Incl. Taxes)</div>
                  <div className="text-xl font-black text-stone-900">₹{getPrice()}</div>
                </div>
                <button
                  onClick={handleAddPreviewToCart}
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* 1. Choose Material */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                1. Choose Material
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'canvas', label: 'Canvas', desc: 'Textured Cotton' },
                  { id: 'acrylic', label: 'Acrylic', desc: 'Gloss Glass' },
                  { id: 'cork', label: 'Cork', desc: 'Natural Board' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      material === m.id
                        ? 'border-[var(--accent)] bg-[var(--accent-bg)]/50 text-[var(--accent)] shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{m.label}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Upload Photo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                2. Upload Your Photo
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 border-2 border-dashed border-stone-300 hover:border-[var(--accent-light)] rounded-xl p-3 text-center cursor-pointer bg-stone-50 hover:bg-[var(--accent-bg)]/30 transition-colors flex items-center justify-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[var(--accent)]" />
                  <span className="text-xs font-bold text-stone-700">Click to upload image file</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* 3. Add Custom Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                3. Add Personalized Text (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Family Name, Date, or Quote"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]"
                />
                <Type className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* 4. Choose Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                4. Choose Dimensions
              </label>
              <div className="flex flex-wrap gap-2">
                {['8x10 inch', '12x18 inch', '16x24 inch', '24x36 inch'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      size === s
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Choose Finish */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                5. Choose Finish
              </label>
              <div className="flex flex-wrap gap-2">
                {['Matte Finish', 'Gloss Finish', 'Floating Frame'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      finish === f
                        ? 'bg-[#0F243E] text-white border-[#0F243E] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Customizer CTA */}
            <div className="pt-2">
              <button
                onClick={onStartCreating}
                className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Open Full Customizer Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
