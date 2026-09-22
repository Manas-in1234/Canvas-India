import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check 
} from 'lucide-react';

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
      name: 'Landscape',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Family',
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Botanical',
      url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80',
    },
  ];

  // Dynamic price calculation
  const getPrice = () => {
    let base = material === 'canvas' ? 699 : material === 'acrylic' ? 899 : 599;
    if (size === '16x24 inch') base += 300;
    if (size === '24x36 inch') base += 700;
    if (finish === 'Floating Frame') base += 250;
    return base;
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
    <section id="customizer-section" className="py-10 sm:py-14 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        
        {/* Section Header */}
        <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Customization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Customize Your Products
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pick your print material, select dimensions, and preview live before ordering
          </p>
        </div>

        {/* Unboxed 2-Column Customizer Layout (No Outer Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Live Floating Preview */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-xl overflow-hidden shadow-md bg-stone-100">
              <img
                src={uploadedImage}
                alt="Custom Preview"
                className="w-full h-full object-cover"
              />

              {/* Overlaid Custom Caption */}
              {customText && (
                <div className="absolute bottom-3 left-3 right-3 text-center bg-black/60 backdrop-blur-xs text-white py-1 px-3 rounded text-xs font-semibold">
                  {customText}
                </div>
              )}

              <div className="absolute top-2.5 right-2.5 bg-black/75 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {material} • {size}
              </div>
            </div>

            {/* Quick Sample Switcher */}
            <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-[11px]">Sample Photo:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUploadedImage(s.url)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    uploadedImage === s.url
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Step Choices (No Boxed Cards) */}
          <div className="lg:col-span-6 space-y-5 text-left">
            
            {/* Step 1: Material */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                1. Select Print Material
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'canvas', name: 'Museum Canvas', price: 699 },
                  { id: 'acrylic', name: 'High-Gloss Acrylic', price: 899 },
                  { id: 'cork', name: 'Eco-Cork Board', price: 599 },
                ].map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setMaterial(mat.id as any)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      material === mat.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <span>{mat.name}</span>
                    <span className="ml-1 opacity-75 text-[10px]">from ₹{mat.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dimensions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                2. Choose Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['8x10 inch', '12x18 inch', '16x24 inch', '24x36 inch'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      size === sz
                        ? 'bg-[var(--accent)] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Finish */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                3. Select Finish Option
              </label>
              <div className="flex flex-wrap gap-2">
                {['Matte Finish', 'Glossy Finish', 'Floating Frame'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFinish(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      finish === f
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Caption Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                4. Custom Caption (Optional)
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter custom family name, date, or quote"
                className="w-full max-w-md px-3.5 py-2 bg-white text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
            </div>

            {/* Price & Action Row */}
            <div className="pt-2 flex items-center gap-4">
              <div>
                <span className="text-[10px] text-stone-500 block uppercase font-bold">Total Price</span>
                <span className="text-xl font-bold text-stone-900">₹{getPrice()}</span>
              </div>
              <button
                type="button"
                onClick={handleAddPreviewToCart}
                className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={onStartCreating}
                className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Open Full Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
