import React, { useState } from 'react';
import { Sparkles, Calculator, Check, ArrowRight, ShieldCheck, Clock, Ruler, Info } from 'lucide-react';
import { ProductItem } from '../data/brandData';

interface QuickOrderProps {
  onAddToCart: (product: ProductItem) => void;
  onOpenQuote: (specs?: any) => void;
}

export const QuickOrder: React.FC<QuickOrderProps> = ({ onAddToCart, onOpenQuote }) => {
  const [selectedProduct, setSelectedProduct] = useState('canvas-prints');
  const [selectedSize, setSelectedSize] = useState('24x18');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState('museum-matte');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const productOptions = [
    { id: 'canvas-prints', name: 'Canvas Prints', basePrice: 1450, category: 'Canvas' as const },
    { id: 'acrylic-prints', name: 'Acrylic Prints', basePrice: 2200, category: 'Acrylic' as const },
    { id: 'acrylic-frames', name: 'Acrylic Frames', basePrice: 1850, category: 'Acrylic' as const },
    { id: 'cork-boards', name: 'Cork Boards', basePrice: 1650, category: 'Cork' as const },
    { id: 'custom-displays', name: 'Custom Displays', basePrice: 3200, category: 'Custom' as const },
  ];

  const sizeOptions = [
    { id: '12x8', label: '12" × 8"', multiplier: 1.0, popular: false },
    { id: '16x12', label: '16" × 12"', multiplier: 1.35, popular: false },
    { id: '24x18', label: '24" × 18"', multiplier: 1.85, popular: true },
    { id: '36x24', label: '36" × 24"', multiplier: 2.75, popular: false },
    { id: '48x36', label: '48" × 36"', multiplier: 4.2, popular: false },
    { id: 'custom', label: 'Custom Size', multiplier: 2.2, popular: false },
  ];

  const quantityOptions = [1, 2, 5, 10, 25];

  const finishOptions = [
    { id: 'museum-matte', name: 'Museum Matte Glaze', extra: 0, tag: 'Standard' },
    { id: 'diamond-gloss', name: 'Diamond High Gloss', extra: 350, tag: 'Ultra-Clear' },
    { id: 'floating-frame', name: 'Solid Oak Floater Frame', extra: 850, tag: 'Gallery' },
    { id: 'acoustic-cork', name: 'Acoustic Backing Core', extra: 450, tag: 'Sound Buffer' },
  ];

  const currentProd = productOptions.find((p) => p.id === selectedProduct)!;
  const currentSizeObj = sizeOptions.find((s) => s.id === selectedSize)!;
  const currentFinishObj = finishOptions.find((f) => f.id === selectedFinish)!;

  // Calculate dynamic estimated price
  const unitPrice = Math.round(
    (currentProd.basePrice * currentSizeObj.multiplier + currentFinishObj.extra) / 10
  ) * 10;
  
  // Bulk discounts
  const bulkDiscountPct = selectedQuantity >= 25 ? 0.20 : selectedQuantity >= 10 ? 0.15 : selectedQuantity >= 5 ? 0.10 : selectedQuantity >= 2 ? 0.05 : 0;
  const subtotal = Math.round(unitPrice * selectedQuantity * (1 - bulkDiscountPct));

  const handleStartOrder = () => {
    const customConfiguredItem: ProductItem = {
      id: `custom-${selectedProduct}-${selectedSize}-${Date.now()}`,
      name: `${currentProd.name} (${currentSizeObj.label})`,
      category: currentProd.category,
      tagline: `${currentFinishObj.name} • Bespoke Configurator`,
      description: `Custom manufactured ${currentProd.name} with ${currentFinishObj.name} at ${currentSizeObj.label} dimensions.`,
      specs: [
        `Dimensions: ${currentSizeObj.label}`,
        `Finish: ${currentFinishObj.name}`,
        `Quantity: ${selectedQuantity} unit(s)`,
        `Lead Time: 48-72 Hours Dispatch`,
      ],
      imageUrl:
        currentProd.category === 'Canvas'
          ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
          : currentProd.category === 'Acrylic'
          ? 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      badge: 'Quick Order',
      startingPrice: `₹${subtotal.toLocaleString('en-IN')}`,
      leadTime: '2-3 Business Days',
      popularFor: 'Custom Interior Orders',
      rating: 4.95,
      reviewCount: 312,
    };

    onAddToCart(customConfiguredItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handleRequestQuote = () => {
    onOpenQuote({
      product: currentProd.name,
      size: currentSizeObj.label,
      quantity: selectedQuantity,
      finish: currentFinishObj.name,
      estimatedPrice: `₹${subtotal.toLocaleString('en-IN')}`,
    });
  };

  return (
    <section id="quick-order" className="py-12 lg:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2 border border-orange-200">
            <Calculator className="w-3.5 h-3.5 text-orange-600" />
            <span>Interactive Order Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            START YOUR ORDER
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            Configure your exact material, dimension and finishing specifications with instant transparent estimates.
          </p>
        </div>

        {/* Interactive Configurator Container */}
        <div className="bg-stone-50 rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Selections */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Select Product Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  1. Select Product Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {productOptions.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedProduct === p.id
                          ? 'bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-sm text-stone-900 font-bold'
                          : 'bg-white/80 border-stone-200 hover:border-stone-300 text-stone-700 font-medium'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm">{p.name}</span>
                      <span className="block text-[11px] text-stone-500 font-normal mt-0.5">
                        from ₹{p.basePrice.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Select Size */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    2. Select Size (Inches)
                  </label>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-orange-600" />
                    <span>Custom dimensions up to 120"</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {sizeOptions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all relative ${
                        selectedSize === s.id
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md font-bold'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800 font-medium'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm">{s.label}</span>
                      {s.popular && (
                        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          selectedSize === s.id ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'
                        }`}>
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Select Finish & Frame */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  3. Select Finish / Mount
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {finishOptions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFinish(f.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedFinish === f.id
                          ? 'bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                          : 'bg-white/80 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <span className="block text-xs sm:text-sm font-semibold text-stone-900">{f.name}</span>
                        <span className="block text-[11px] text-stone-500">{f.tag}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600">
                        {f.extra === 0 ? 'Included' : `+₹${f.extra}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Select Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                  4. Select Quantity
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {quantityOptions.map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setSelectedQuantity(qty)}
                      className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        selectedQuantity === qty
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      {qty} {qty > 1 ? 'Units' : 'Unit'}
                      {qty >= 10 && <span className="ml-1 text-[10px] text-amber-300 font-bold">(-15%)</span>}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Summary & Price Card */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <h3 className="font-bold text-stone-900 text-sm">Order Summary</h3>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span>48h Dispatch</span>
                  </span>
                </div>

                <div className="space-y-3 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Product:</span>
                    <span className="font-semibold text-stone-900">{currentProd.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Size:</span>
                    <span className="font-semibold text-stone-900">{currentSizeObj.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Finish:</span>
                    <span className="font-semibold text-stone-900">{currentFinishObj.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quantity:</span>
                    <span className="font-semibold text-stone-900">{selectedQuantity}</span>
                  </div>
                  {bulkDiscountPct > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Volume Savings:</span>
                      <span>-{bulkDiscountPct * 100}% Applied</span>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-6 pt-4 border-t border-stone-200">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 font-medium">Estimated Total:</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-stone-400">All Taxes & Pan-India Packing Included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <button
                  onClick={handleStartOrder}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm tracking-wide shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <span>START ORDER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={handleRequestQuote}
                  className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs tracking-wide transition-colors"
                >
                  REQUEST CUSTOM QUOTE
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free digital proof before printing</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
