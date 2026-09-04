import React, { useState } from 'react';
import { X, Check, Box, Package, ShieldCheck, ArrowRight } from 'lucide-react';

interface SampleSwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleSwatchModal: React.FC<SampleSwatchModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [firmType, setFirmType] = useState('Interior Designer');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Order Architect Swatch Box</h3>
              <p className="text-xs text-stone-400">Free material kit delivered to design professionals.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Sample Box Dispatched Soon!</h4>
            <p className="text-stone-300 text-xs leading-relaxed max-w-xs mx-auto">
              Your architectural swatch box containing 420 GSM Canvas, 6mm Cast Optical Acrylic, and Portuguese Cork samples is queued for courier dispatch to {city || 'your office'}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Swatch contents showcase */}
            <div className="p-3.5 bg-stone-800/60 rounded-xl border border-stone-700/60 space-y-1.5">
              <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                Box Contents:
              </div>
              <ul className="text-stone-400 space-y-1 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <strong>Canvas:</strong> 420 GSM 100% Cotton & Linen Swatches (Matte + Satin)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <strong>Acrylic:</strong> 3mm, 6mm & 12mm Diamond Polished Cast Acrylic Blocks
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <strong>Cork:</strong> High-density Portuguese Acoustic & Pinboard Tile specimens
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1">Your Name / Studio *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Studio Vista Architects"
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-stone-300 mb-1">Profession / Firm Type</label>
                <select
                  value={firmType}
                  onChange={(e) => setFirmType(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500 cursor-pointer"
                >
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Architect">Architect</option>
                  <option value="Art Curator / Gallery">Art Curator / Gallery</option>
                  <option value="Hospitality Developer">Hospitality Developer</option>
                  <option value="Brand / Retail Agency">Brand / Retail Agency</option>
                  <option value="Private Collector">Private Collector</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-300 mb-1">Studio / Delivery Address *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building, floor..."
                className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-stone-300 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-stone-300 mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="400001"
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-stone-300 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
            >
              <span>Dispatch Swatch Kit (Free Delivery)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
