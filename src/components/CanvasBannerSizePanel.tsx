import React, { useState } from 'react';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';
import {
  BannerUnit,
  BANNER_UNITS,
  BannerSizeCategory,
  CanvasBannerSizeOption,
  CanvasBannerConfig,
  CANVAS_BANNER_SIZE_OPTIONS,
  calculateBannerPrice,
  convertToInches,
  convertFromInches,
  formatDimension
} from '../data/canvasBannerData';

export interface CanvasBannerSizePanelProps {
  config: CanvasBannerConfig;
  onChangeConfig: (updates: Partial<CanvasBannerConfig>) => void;
  activeCategory: BannerSizeCategory;
  onChangeCategory: (category: BannerSizeCategory) => void;
  currentPrice: number;
}

const CATEGORIES: BannerSizeCategory[] = ['RECOMMENDED', 'SQUARE', 'PANORAMIC', 'LARGE', 'SMALL'];

export const CanvasBannerSizePanel: React.FC<CanvasBannerSizePanelProps> = ({
  config,
  onChangeConfig,
  activeCategory,
  onChangeCategory,
  currentPrice
}) => {
  const [customHInput, setCustomHInput] = useState<string>(() =>
    String(convertFromInches(config.heightInches, config.unit))
  );
  const [customWInput, setCustomWInput] = useState<string>(() =>
    String(convertFromInches(config.widthInches, config.unit))
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filter preset sizes by category
  const filteredSizes = CANVAS_BANNER_SIZE_OPTIONS.filter((s) =>
    s.categories.includes(activeCategory)
  );

  // Handle Preset Size Click
  const handleSelectPreset = (opt: CanvasBannerSizeOption) => {
    setValidationError(null);
    const convertedW = convertFromInches(opt.widthInches, config.unit);
    const convertedH = convertFromInches(opt.heightInches, config.unit);
    setCustomWInput(String(convertedW));
    setCustomHInput(String(convertedH));

    onChangeConfig({
      isCustom: false,
      selectedSizeId: opt.id,
      width: convertedW,
      height: convertedH,
      widthInches: opt.widthInches,
      heightInches: opt.heightInches
    });
  };

  // Handle Unit Change (Inches, Feet, Centimeters)
  const handleUnitChange = (newUnit: BannerUnit) => {
    // Keep physical inches identical, recalculate display units
    const currentWInches = config.widthInches;
    const currentHInches = config.heightInches;
    const newDisplayW = convertFromInches(currentWInches, newUnit);
    const newDisplayH = convertFromInches(currentHInches, newUnit);

    setCustomWInput(String(newDisplayW));
    setCustomHInput(String(newDisplayH));
    setValidationError(null);

    onChangeConfig({
      unit: newUnit,
      width: newDisplayW,
      height: newDisplayH
    });
  };

  // Validate and apply custom size values
  const applyCustomDimensions = (rawH: string, rawW: string, unit: BannerUnit) => {
    const numH = parseFloat(rawH);
    const numW = parseFloat(rawW);

    if (isNaN(numH) || isNaN(numW) || numH <= 0 || numW <= 0) {
      setValidationError('Please enter positive numbers for height and width.');
      return;
    }

    const inchesH = convertToInches(numH, unit);
    const inchesW = convertToInches(numW, unit);

    if (inchesH < 8 || inchesW < 8) {
      const minVal = unit === 'ft' ? '0.7 ft' : unit === 'cm' ? '20 cm' : '8 inches';
      setValidationError(`Minimum banner dimension is ${minVal}.`);
      return;
    }

    if (inchesH > 360 || inchesW > 360) {
      const maxVal = unit === 'ft' ? '30 ft' : unit === 'cm' ? '900 cm' : '360 inches';
      setValidationError(`Maximum banner dimension is ${maxVal}.`);
      return;
    }

    setValidationError(null);
    onChangeConfig({
      isCustom: true,
      selectedSizeId: 'custom-banner',
      unit,
      width: numW,
      height: numH,
      widthInches: inchesW,
      heightInches: inchesH
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* 1. Selected Active Banner Summary */}
      <div className="flex items-center justify-between p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100">
        <div>
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Banner Dimensions
          </span>
          <div className="text-sm font-black text-stone-900 mt-0.5">
            {config.isCustom
              ? `${config.width} ${config.unit} × ${config.height} ${config.unit} (${Math.round(config.widthInches)}" × ${Math.round(config.heightInches)}")`
              : `${formatDimension(config.widthInches, config.unit)} × ${formatDimension(config.heightInches, config.unit)}`}
          </div>
          <div className="text-xs font-black text-[#0E4A93]">
            ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 bg-white border border-stone-200 text-stone-700 text-[10px] font-bold rounded-lg shadow-2xs">
            Large Format
          </span>
        </div>
      </div>

      {/* 2. Horizontal Category Tabs matching Screenshot 1 */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChangeCategory(cat)}
              className={`flex-1 py-1.5 px-2 text-center text-[11px] font-extrabold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#0E4A93] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {cat === 'RECOMMENDED'
                ? 'Recommended'
                : cat === 'SQUARE'
                ? 'Square'
                : cat === 'PANORAMIC'
                ? 'Panoramic'
                : cat === 'LARGE'
                ? 'Large'
                : 'Small'}
            </button>
          );
        })}
      </div>

      {/* 3. Preset Size Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filteredSizes.map((opt) => {
          const isSelected = !config.isCustom && config.selectedSizeId === opt.id;
          const ratio = opt.widthInches / Math.max(1, opt.heightInches);

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectPreset(opt)}
              className={`group relative bg-white p-2.5 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer min-h-[114px] ${
                isSelected
                  ? 'border-2 border-[#0E4A93] bg-blue-50/20 shadow-xs ring-1 ring-[#0E4A93]/20'
                  : 'border border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              {/* Selected blue checkmark */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Aspect Ratio Shape Preview Box matching Screenshot 1 */}
              <div className="w-full h-12 flex items-center justify-center">
                <div
                  className={`rounded-[2px] transition-all border ${
                    isSelected
                      ? 'bg-[#0E4A93]/20 border-[#0E4A93]'
                      : 'bg-stone-100 border-stone-300 group-hover:border-stone-400'
                  }`}
                  style={{
                    width: `${Math.round(36 * Math.min(1.5, Math.max(0.65, ratio)))}px`,
                    height: `${Math.round(36 / Math.max(1, ratio > 1.3 ? 1.3 : 1))}px`
                  }}
                />
              </div>

              {/* Dimensions Text */}
              <div className="text-[11px] font-black text-stone-900 text-center mt-1">
                {opt.label}
              </div>

              {/* Price Text */}
              <div className="text-[11px] text-[#0E4A93] text-center font-extrabold">
                ₹{opt.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Custom Size Section (Exact Structure from Screenshot 1) */}
      <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
        {/* Select Unit */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Select Unit
          </label>
          <div className="relative">
            <select
              value={config.unit}
              onChange={(e) => handleUnitChange(e.target.value as BannerUnit)}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
            >
              {BANNER_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Custom Size (H × W) */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Custom Size (H × W)
          </label>
          <div className="flex items-center gap-2">
            {/* Height input */}
            <div className="flex-1">
              <input
                type="number"
                step={config.unit === 'ft' ? '0.5' : '1'}
                min="0.5"
                max="900"
                value={customHInput}
                onChange={(e) => {
                  setCustomHInput(e.target.value);
                  applyCustomDimensions(e.target.value, customWInput, config.unit);
                }}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 text-center focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
                placeholder="Height"
              />
            </div>

            <span className="text-stone-400 font-extrabold text-sm">×</span>

            {/* Width input */}
            <div className="flex-1">
              <input
                type="number"
                step={config.unit === 'ft' ? '0.5' : '1'}
                min="0.5"
                max="900"
                value={customWInput}
                onChange={(e) => {
                  setCustomWInput(e.target.value);
                  applyCustomDimensions(customHInput, e.target.value, config.unit);
                }}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-800 text-center focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
                placeholder="Width"
              />
            </div>

            {/* Calculated Price Display matching Screenshot 1 */}
            <div className="shrink-0 font-black text-xs text-[#E8752A] px-2">
              ₹{calculateBannerPrice(config.widthInches, config.heightInches).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>

        {/* Inline Validation Alert */}
        {validationError && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{validationError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
