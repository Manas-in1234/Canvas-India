import React, { useState } from 'react';
import { X, UploadCloud, Check, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCartCustomized: (item: {
    product: Product;
    quantity: number;
    size: string;
    finish: string;
    customText: string;
    photoUrl: string;
    calculatedPrice: number;
  }) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCartCustomized,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '12x18 inch');
  const [selectedFinish, setSelectedFinish] = useState(product.finishes?.[0] || 'Standard Finish');
  const [customText, setCustomText] = useState('');
  const [photoPreview, setPhotoPreview] = useState(product.image);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // Price adjustment based on size
  const calculatePrice = () => {
    let price = product.price;
    if (selectedSize.includes('16x24') || selectedSize.includes('18x24')) price += 350;
    if (selectedSize.includes('24x36') || selectedSize.includes('30x40')) price += 800;
    if (selectedFinish.includes('Floating Frame') || selectedFinish.includes('Gallery')) price += 300;
    return price;
  };

  const handleConfirm = () => {
    onAddToCartCustomized({
      product: {
        ...product,
        price: calculatePrice(),
      },
      quantity: 1,
      size: selectedSize,
      finish: selectedFinish,
      customText,
      photoUrl: photoPreview,
      calculatedPrice: calculatePrice(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="bg-[#E85D04] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            <h3 className="font-bold text-base">Customize: {product.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Top Row: Preview & Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Live Visual Preview Frame */}
            <div className="relative aspect-[4/3] bg-stone-100 rounded-xl overflow-hidden border-4 border-stone-800 shadow-md">
              <img
                src={photoPreview}
                alt="Customized Preview"
                className="w-full h-full object-cover"
              />
              {customText && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold py-1 px-2 rounded text-center truncate">
                  {customText}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {selectedSize}
              </div>
            </div>

            {/* Photo Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                Upload Your Own Photo
              </label>
              <label className="border-2 border-dashed border-stone-300 hover:border-orange-400 bg-stone-50 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-6 h-6 text-[#E85D04]" />
                <span className="text-xs font-semibold text-stone-700">Click to upload from device</span>
                <span className="text-[10px] text-stone-400">JPG, PNG, WEBP (Min 1000px recommended)</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* 1. Size Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
              Select Dimensions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center ${
                    selectedSize === s
                      ? 'bg-[#E85D04] text-white border-[#E85D04] shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Finish Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
              Select Framing / Finish
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.finishes.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(f)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center ${
                    selectedFinish === f
                      ? 'bg-[#0F243E] text-white border-[#0F243E] shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Personalized Text */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
              Personalized Text / Subtitle (Optional)
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Wedding Date, Names, Family Quote"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Bottom Bar Price & Confirmation */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-stone-400">Total Customized Price</div>
              <div className="text-xl font-black text-stone-900">
                ₹{calculatePrice().toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-[#E85D04] hover:bg-[#D44E00] text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Confirm &amp; Add to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
