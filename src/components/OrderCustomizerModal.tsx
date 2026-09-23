import React, { useState } from 'react';
import {
  X,
  Upload,
  Check,
  Sparkles,
  Maximize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';
import { OrderConfig } from './OrderConfigurator';

interface OrderCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OrderConfig | null;
  onAddToCartWithCustom: (item: {
    id: string;
    name: string;
    category: 'Canvas' | 'Acrylic' | 'Cork' | 'Frames';
    price: number;
    originalPrice: number;
    size: string;
    wrapStyle: string;
    imageUrl: string;
    quantity: number;
  }) => void;
}

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onAddToCartWithCustom,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
  );
  const [activeWrapEffect, setActiveWrapEffect] = useState<'mirror' | 'image' | 'black' | 'white'>('mirror');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen || !config) return null;

  const samplePhotos = [
    {
      name: 'Family Portrait',
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Himalayan Landscape',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Abstract Architecture',
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Botanical Earth',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhoto(event.target.result as string);
          setIsUploading(false);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteOrder = () => {
    onAddToCartWithCustom({
      id: `custom-${Date.now()}`,
      name: `Custom ${config.productType} (${config.size})`,
      category: config.productType.includes('Acrylic')
        ? 'Acrylic'
        : config.productType.includes('Cork')
        ? 'Cork'
        : 'Canvas',
      price: config.price,
      originalPrice: config.originalPrice,
      size: config.size,
      wrapStyle: config.wrapStyle,
      imageUrl: selectedPhoto,
      quantity: config.quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0F243E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                Preview & Upload Your Photo
              </h3>
              <p className="text-xs text-stone-300">
                {config.productType} • {config.size} • {config.wrapStyle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Grid with Preview & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          
          {/* Left: 3D Product Canvas Mockup (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-stone-100/80 rounded-xl p-6 border border-stone-200 min-h-[340px]">
            
            <div className="relative max-w-sm w-full aspect-[4/3] rounded-lg shadow-2xl overflow-hidden border-8 border-stone-800 transform hover:scale-[1.02] transition-transform">
              <img
                src={selectedPhoto}
                alt="Live Preview Mockup"
                className="w-full h-full object-cover"
              />
              
              {/* Corner Glaze Reflection on Acrylic / Canvas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 pointer-events-none" />

              {/* Edge Style indicator */}
              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded">
                Edge: {activeWrapEffect.toUpperCase()}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 font-medium">
              <Check className="w-4 h-4 text-[var(--accent)]" />
              <span>Fine Art Archival 12-Color Pigment Rendering Preview</span>
            </div>
          </div>

          {/* Right: Upload controls & Sample Photos (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-5">
            
            {/* Upload Area */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                1. Upload Your Image
              </label>

              <label className="border-2 border-dashed border-[var(--accent)]/60 hover:border-[var(--accent)] bg-[var(--accent-bg)]/40 hover:bg-[var(--accent-bg)] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-[var(--accent)] mb-1.5" />
                <span className="text-xs font-bold text-stone-800">
                  {isUploading ? 'Uploading...' : 'Click to Upload Photo'}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  Supports JPG, PNG, WEBP, TIFF up to 50MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadSuccess && (
                <div className="mt-2 text-xs text-[var(--accent-hover)] bg-[var(--accent-bg)] border border-[var(--accent-border)] p-2 rounded flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Photo uploaded successfully!</span>
                </div>
              )}
            </div>

            {/* Pick Sample Art */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Or Pick Sample Art For Testing
              </label>
              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((photo) => (
                  <button
                    key={photo.name}
                    type="button"
                    onClick={() => setSelectedPhoto(photo.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedPhoto === photo.url
                        ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Edge Wrap Style Option */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Edge Wrap Visual Effect
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold">
                {[
                  { id: 'mirror', label: 'Mirror' },
                  { id: 'image', label: 'Continuous' },
                  { id: 'black', label: 'Black Edge' },
                  { id: 'white', label: 'White Edge' },
                ].map((wrap) => (
                  <button
                    key={wrap.id}
                    type="button"
                    onClick={() => setActiveWrapEffect(wrap.id as any)}
                    className={`py-1.5 text-center rounded border transition-colors cursor-pointer ${
                      activeWrapEffect === wrap.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {wrap.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add to Cart Confirmation */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-stone-500 font-semibold">Configured Total:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[var(--accent)]">
                    ₹{config.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 line-through ml-2">
                    ₹{config.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-3.5 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-light)] active:bg-[var(--accent-hover)] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ADD CUSTOM ITEM TO CART</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Modal Footer Trust Badges */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
            <span>High-DPI resolution check will be performed before printing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[var(--accent)]" />
            <span>Dispatched within 48-72 hours across India</span>
          </div>
        </div>

      </div>
    </div>
  );
};
