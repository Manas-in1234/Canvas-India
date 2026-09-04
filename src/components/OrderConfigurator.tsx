import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ProductItem } from '../data/brandData';

interface OrderConfiguratorProps {
  onStartCustomOrder: (orderConfig: OrderConfig) => void;
  onAddToCart?: (product: ProductItem) => void;
}

export interface OrderConfig {
  productType: string;
  size: string;
  width?: number;
  height?: number;
  wrapStyle: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

export const OrderConfigurator: React.FC<OrderConfiguratorProps> = ({
  onStartCustomOrder,
  onAddToCart,
}) => {
  const [productType, setProductType] = useState('Canvas Prints');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // 12" x 8" default
  const [customWidth, setCustomWidth] = useState(24);
  const [customHeight, setCustomHeight] = useState(18);
  const [wrapStyle, setWrapStyle] = useState('Gallery Wrap (0.75")');
  const [quantity, setQuantity] = useState(1);

  // Standard Popular Sizes with Indian Commercial Pricing
  const popularSizes = [
    {
      size: '8" × 8"',
      label: 'Square Mini',
      price: 299,
      originalPrice: 599,
      discount: '50% OFF',
      bestFor: 'Tabletops & Gifting',
    },
    {
      size: '12" × 8"',
      label: 'Standard Bestseller',
      price: 499,
      originalPrice: 999,
      discount: '50% OFF',
      bestFor: 'Living Rooms & Bedrooms',
      popular: true,
    },
    {
      size: '10" × 10"',
      label: 'Square Medium',
      price: 449,
      originalPrice: 899,
      discount: '50% OFF',
      bestFor: 'Instagram Art & Grid Walls',
    },
    {
      size: '16" × 20"',
      label: 'Classic Gallery',
      price: 1099,
      originalPrice: 2199,
      discount: '50% OFF',
      bestFor: 'Statement Wall Art',
    },
    {
      size: '20" × 30"',
      label: 'Large Statement',
      price: 1999,
      originalPrice: 3999,
      discount: '50% OFF',
      bestFor: 'Living Room Sofa Walls',
    },
    {
      size: 'Custom Size',
      label: 'Exact Fit',
      price: 0, // dynamically calculated
      originalPrice: 0,
      discount: '45% OFF',
      bestFor: 'Any Custom Dimension',
    },
  ];

  // Dynamic Custom Size Calculation (Base ₹1.1 per sq inch on canvas)
  const isCustomSize = selectedSizeIndex === popularSizes.length - 1;
  const customSqInches = customWidth * customHeight;
  const customCalculatedPrice = Math.max(399, Math.round(customSqInches * 1.15));
  const customCalculatedOriginal = Math.round(customCalculatedPrice * 2);

  const currentItem = popularSizes[selectedSizeIndex];
  const unitPrice = isCustomSize ? customCalculatedPrice : currentItem.price;
  const unitOriginalPrice = isCustomSize ? customCalculatedOriginal : currentItem.originalPrice;

  // Wrap style extra cost
  const wrapCost = wrapStyle.includes('Floating Frame') ? 450 : wrapStyle.includes('1.5"') ? 200 : 0;
  const totalPrice = (unitPrice + wrapCost) * quantity;
  const totalOriginalPrice = (unitOriginalPrice + wrapCost * 1.5) * quantity;
  const totalSavings = totalOriginalPrice - totalPrice;

  const handleStartOrder = () => {
    const config: OrderConfig = {
      productType,
      size: isCustomSize ? `${customWidth}" × ${customHeight}" (Custom)` : currentItem.size,
      width: isCustomSize ? customWidth : undefined,
      height: isCustomSize ? customHeight : undefined,
      wrapStyle,
      quantity,
      price: totalPrice,
      originalPrice: totalOriginalPrice,
    };
    onStartCustomOrder(config);
  };

  return (
    <section id="order-configurator" className="bg-white py-10 sm:py-12 border-b border-stone-200">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Panel Box */}
        <div className="bg-gradient-to-br from-stone-50 via-white to-orange-50/40 rounded-2xl border border-orange-200/80 shadow-md p-6 sm:p-8 lg:p-10">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#E85D04] text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Online Ordering</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F243E] tracking-tight uppercase">
                START YOUR ORDER
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Configure your personalized wall print in seconds with guaranteed archival quality and direct Indian atelier pricing.
              </p>
            </div>

            {/* Select Product Dropdown */}
            <div className="w-full md:w-72">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                1. Select Product Type
              </label>
              <div className="relative">
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full appearance-none h-11 px-4 pr-10 rounded-lg bg-white border border-stone-300 text-stone-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04] shadow-xs cursor-pointer"
                >
                  <option value="Canvas Prints">Canvas Prints (Cotton Gallery Wrap)</option>
                  <option value="Acrylic Prints">Acrylic Prints (Diamond Polished)</option>
                  <option value="Cork Prints">Cork Prints (Natural Portuguese Cork)</option>
                  <option value="Photo Frames">Photo Frames (Solid Teak / Floater)</option>
                  <option value="Wall Art">Wall Art (Multi-Panel Sets)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Step 2: Popular Sizes Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Select Popular Size or Enter Custom Dimensions
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ⚡ Flat 50% Off Auto-Applied
              </span>
            </div>

            {/* 6 Cards Grid (Desktop 6 cols, tablet 3 cols, mobile 2 cols) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularSizes.map((item, index) => {
                const isSelected = selectedSizeIndex === index;
                const isCustom = index === popularSizes.length - 1;

                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => setSelectedSizeIndex(index)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-orange-50/80 border-[#E85D04] ring-2 ring-[#E85D04] shadow-md'
                        : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-stone-50/70 shadow-xs'
                    }`}
                  >
                    {/* Bestseller Badge */}
                    {item.popular && (
                      <span className="absolute -top-2.5 right-2 bg-[#E85D04] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Bestseller
                      </span>
                    )}

                    <div>
                      <div className="text-sm sm:text-base font-black text-stone-900 leading-tight">
                        {item.size}
                      </div>
                      <div className="text-[10px] font-medium text-stone-500 mt-0.5">
                        {item.label}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/80">
                      {isCustom ? (
                        <div>
                          <span className="text-xs font-extrabold text-[#E85D04] block">
                            ₹{customCalculatedPrice}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{customCalculatedOriginal}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-extrabold text-[#E85D04]">
                              ₹{item.price}
                            </span>
                            <span className="text-[10px] text-stone-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          </div>
                          <span className="inline-block text-[9px] font-bold text-emerald-600 mt-0.5">
                            {item.discount}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Size Dimension Inputs (Shown when Custom Size is selected) */}
            {isCustomSize && (
              <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 mt-3 flex flex-wrap items-center gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#E85D04]" />
                  <span className="text-xs font-bold text-stone-800">Custom Dimensions (Inches):</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-stone-600 font-semibold">Width:</label>
                  <input
                    type="number"
                    min="6"
                    max="120"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Math.max(6, Number(e.target.value)))}
                    className="w-20 h-9 px-2 text-center text-sm font-bold bg-white border border-stone-300 rounded focus:ring-2 focus:ring-[#E85D04] focus:outline-hidden"
                  />
                  <span className="text-xs text-stone-400">in</span>
                </div>

                <span className="text-stone-400 font-bold">×</span>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-stone-600 font-semibold">Height:</label>
                  <input
                    type="number"
                    min="6"
                    max="120"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Math.max(6, Number(e.target.value)))}
                    className="w-20 h-9 px-2 text-center text-sm font-bold bg-white border border-stone-300 rounded focus:ring-2 focus:ring-[#E85D04] focus:outline-hidden"
                  />
                  <span className="text-xs text-stone-400">in</span>
                </div>

                <div className="text-xs text-stone-500 ml-auto">
                  Total Area: <strong className="text-stone-800">{customSqInches} sq. inches</strong> • Sub-millimeter CNC cut
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Finish & Quantity Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-stone-200">
            
            {/* Wrap / Finish Selector */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                3. Select Edge Wrap / Mounting Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { name: 'Gallery Wrap (0.75")', desc: 'Standard bevelled pine bar' },
                  { name: 'Thick Gallery Wrap (1.5")', desc: 'Museum depth (+₹200)' },
                  { name: 'Solid Wood Floating Frame', desc: 'Teak shadow gap (+₹450)' },
                ].map((wrap) => (
                  <button
                    key={wrap.name}
                    type="button"
                    onClick={() => setWrapStyle(wrap.name)}
                    className={`p-2.5 text-left rounded-lg border text-xs cursor-pointer transition-all ${
                      wrapStyle === wrap.name
                        ? 'bg-white border-[#E85D04] text-[#E85D04] font-bold shadow-xs ring-1 ring-[#E85D04]'
                        : 'bg-white/60 border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900">{wrap.name}</div>
                    <div className="text-[10px] text-stone-500">{wrap.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                4. Quantity
              </label>
              <div className="flex items-center h-10 w-36 bg-white border border-stone-300 rounded-lg overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Bulk tiered discount applies over 5+ units
              </span>
            </div>

          </div>

          {/* Bottom Total & CTA Action Bar */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-100/60 p-4 sm:p-5 rounded-xl">
            
            {/* Live Pricing Summary */}
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold block">
                  Total Offer Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#E85D04]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{totalOriginalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                You Save ₹{totalSavings.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Main Action CTA Button */}
            <button
              type="button"
              onClick={handleStartOrder}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-[#E85D04] hover:bg-[#ff6f0e] active:bg-[#c94e03] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>START ORDER / UPLOAD PHOTO</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* Below Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-stone-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#E85D04]" />
              <span>🚚 Ready to ship in 48-72 hours</span>
            </div>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E85D04]" />
              <span>🇮🇳 Delivered across 19,000+ Pin Codes in India</span>
            </div>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Zero-Fade & Damage-Free Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
