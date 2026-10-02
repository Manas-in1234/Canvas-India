import React, { useState, useMemo, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import {
  SizeShapeOption,
  getProductSizeShapeOptions,
  getProductSupportedShapes
} from '../data/productSizeShapeConfig';

export interface SelectSizeShapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: 'canvas' | 'acrylic';
  productId: string;
  productName: string;
  currentShapeId?: string;
  currentSizeId?: string;
  isCustomSize?: boolean;
  customWidth?: number;
  customHeight?: number;
  onSelectSizeAndShape: (config: {
    shapeId: string;
    sizeId: string;
    widthInches: number;
    heightInches: number;
    price: number;
    label: string;
    isCustom?: boolean;
    arrangement?: string;
    panelsCount?: number;
    panels?: any[];
  }) => void;
}

export const SelectSizeShapeModal: React.FC<SelectSizeShapeModalProps> = ({
  isOpen,
  onClose,
  material,
  productId,
  productName,
  currentShapeId = 'shape-rectangle',
  currentSizeId = '',
  isCustomSize = false,
  customWidth = 12,
  customHeight = 12,
  onSelectSizeAndShape
}) => {
  if (!isOpen) return null;

  // Retrieve product-specific options and supported shapes
  const allOptions = useMemo(() => {
    return getProductSizeShapeOptions(productId, material);
  }, [productId, material]);

  const supportedShapes = useMemo(() => {
    return getProductSupportedShapes(productId, material);
  }, [productId, material]);

  const isMultiPanelProduct = useMemo(() => {
    const norm = productId.toLowerCase();
    return norm.includes('wall') || norm.includes('display') || norm.includes('split') || norm.includes('collage');
  }, [productId]);

  // Active shape filter (defaults to 'ALL' if multiple shapes, or current shape)
  const [activeShapeFilter, setActiveShapeFilter] = useState<string>(() => {
    if (isMultiPanelProduct) return 'ALL';
    if (supportedShapes.some((s) => s.id === currentShapeId)) return currentShapeId;
    return 'ALL';
  });

  // Locally selected option id
  const [selectedOptionId, setSelectedOptionId] = useState<string>(() => {
    const exactMatch = allOptions.find((o) => o.id === currentSizeId || o.dimensionsSummary === currentSizeId);
    if (exactMatch) return exactMatch.id;
    const shapeMatch = allOptions.find((o) => o.shapeId === currentShapeId);
    return shapeMatch?.id || allOptions[0]?.id || '';
  });

  // Custom size state
  const [showCustomSize, setShowCustomSize] = useState<boolean>(isCustomSize);
  const [localCustomW, setLocalCustomW] = useState<number>(customWidth || 12);
  const [localCustomH, setLocalCustomH] = useState<number>(customHeight || 12);

  // Filtered options based on active shape
  const visibleOptions = useMemo(() => {
    if (activeShapeFilter === 'ALL') return allOptions;
    return allOptions.filter((o) => o.shapeId === activeShapeFilter);
  }, [allOptions, activeShapeFilter]);

  // Synchronize selected option when switching active shape filter
  useEffect(() => {
    if (!showCustomSize && visibleOptions.length > 0 && !visibleOptions.some((o) => o.id === selectedOptionId)) {
      setSelectedOptionId(visibleOptions[0].id);
    }
  }, [visibleOptions, selectedOptionId, showCustomSize]);

  const currentSelectedOption = useMemo(() => {
    return allOptions.find((o) => o.id === selectedOptionId) || allOptions[0];
  }, [allOptions, selectedOptionId]);

  // Handle applying selection
  const handleApply = () => {
    if (showCustomSize) {
      const w = Math.max(8, Math.min(48, Number(localCustomW) || 12));
      const h = Math.max(8, Math.min(48, Number(localCustomH) || 12));
      const sqInches = w * h;
      const rate = material === 'acrylic' ? 4.5 : 2.5;
      const calculatedPrice = Math.round(sqInches * rate);

      onSelectSizeAndShape({
        shapeId: currentShapeId || 'shape-rectangle',
        sizeId: `custom-${w}x${h}`,
        widthInches: w,
        heightInches: h,
        price: calculatedPrice,
        label: `${w}" × ${h}" (Custom)`,
        isCustom: true
      });
      onClose();
      return;
    }

    if (currentSelectedOption) {
      onSelectSizeAndShape({
        shapeId: currentSelectedOption.shapeId,
        sizeId: currentSelectedOption.id,
        widthInches: currentSelectedOption.widthInches,
        heightInches: currentSelectedOption.heightInches,
        price: currentSelectedOption.price,
        label: currentSelectedOption.label,
        isCustom: false,
        arrangement: currentSelectedOption.arrangement,
        panelsCount: currentSelectedOption.panelsCount,
        panels: currentSelectedOption.panels
      });
      onClose();
    }
  };

  const handleCardClick = (option: SizeShapeOption) => {
    setShowCustomSize(false);
    setSelectedOptionId(option.id);
  };

  const handleCardDoubleClick = (option: SizeShapeOption) => {
    setShowCustomSize(false);
    setSelectedOptionId(option.id);
    onSelectSizeAndShape({
      shapeId: option.shapeId,
      sizeId: option.id,
      widthInches: option.widthInches,
      heightInches: option.heightInches,
      price: option.price,
      label: option.label,
      isCustom: false,
      arrangement: option.arrangement,
      panelsCount: option.panelsCount,
      panels: option.panels
    });
    onClose();
  };

  // Render visual diagram for multi-piece or single shape
  const renderDiagram = (opt: SizeShapeOption) => {
    // 1. Wall Display 3-piece Layout A
    if (opt.diagramType === 'wall-display-3a') {
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
          {/* Dimension arrows */}
          <line x1="20" y1="15" x2="20" y2="115" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="12" y="68" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">24"</text>
          <line x1="30" y1="122" x2="180" y2="122" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="105" y="129" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">18"</text>

          {/* Left tall panel */}
          <rect x="30" y="15" width="68" height="100" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <circle cx="64" cy="50" r="14" fill="#cbd5e1" opacity="0.6" />
          <path d="M48 95 C50 75 78 75 80 95 Z" fill="#cbd5e1" opacity="0.6" />
          <text x="64" y="108" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle">24" tall</text>

          {/* Right top panel */}
          <rect x="104" y="15" width="76" height="48" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="142" y="44" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">12"×18"</text>

          {/* Right bottom 2 panels */}
          <rect x="104" y="68" width="35" height="47" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="121" y="95" fill="#475569" fontSize="6.5" fontWeight="bold" textAnchor="middle">10"×8"</text>
          <rect x="145" y="68" width="35" height="47" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="162" y="95" fill="#475569" fontSize="6.5" fontWeight="bold" textAnchor="middle">10"×8"</text>
        </svg>
      );
    }

    // 2. Wall Display 3-piece Layout B (Center Tall Winged)
    if (opt.diagramType === 'wall-display-3b') {
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
          <line x1="12" y1="20" x2="12" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="7" y="65" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">16"</text>
          <line x1="22" y1="116" x2="185" y2="116" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="103" y="126" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">40"</text>

          {/* Left panel */}
          <rect x="22" y="38" width="40" height="52" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="42" y="68" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle">10"×8"</text>

          {/* Center tall panel */}
          <rect x="68" y="20" width="70" height="85" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <circle cx="103" cy="50" r="12" fill="#cbd5e1" opacity="0.6" />
          <path d="M88 88 C90 70 116 70 118 88 Z" fill="#cbd5e1" opacity="0.6" />
          <text x="103" y="98" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">16"×20"</text>

          {/* Right panel */}
          <rect x="144" y="38" width="40" height="52" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="164" y="68" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle">10"×8"</text>
        </svg>
      );
    }

    // 3. Wall Display 4-piece Grid
    if (opt.diagramType === 'wall-display-4a' || opt.diagramType === 'wall-display-tiered') {
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
          <line x1="15" y1="15" x2="15" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="8" y="65" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">24"</text>
          <line x1="25" y1="118" x2="185" y2="118" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="105" y="127" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">34"</text>

          {/* Left tall */}
          <rect x="25" y="15" width="60" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="55" y="68" fill="#475569" fontSize="7" fontWeight="bold" textAnchor="middle">24"×16"</text>

          {/* Right top */}
          <rect x="91" y="15" width="94" height="42" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="138" y="40" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">11"×17"</text>

          {/* Right bottom 2 */}
          <rect x="91" y="62" width="44" height="48" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="113" y="90" fill="#475569" fontSize="6.5" fontWeight="bold" textAnchor="middle">12"×8"</text>
          <rect x="141" y="62" width="44" height="48" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
          <text x="163" y="90" fill="#475569" fontSize="6.5" fontWeight="bold" textAnchor="middle">12"×8"</text>
        </svg>
      );
    }

    // 4. Split Panels (2 or 3 split)
    if (opt.diagramType === 'split-2' || opt.diagramType === 'split-3') {
      const panelCount = opt.diagramType === 'split-3' ? 3 : 2;
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
          <line x1="20" y1="120" x2="180" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
          <text x="100" y="128" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">{opt.widthInches}"</text>
          {panelCount === 2 ? (
            <>
              <rect x="35" y="15" width="60" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
              <text x="65" y="68" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">Left</text>
              <rect x="105" y="15" width="60" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
              <text x="135" y="68" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">Right</text>
            </>
          ) : (
            <>
              <rect x="25" y="15" width="44" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
              <rect x="78" y="15" width="44" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
              <rect x="131" y="15" width="44" height="95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" rx="2" />
              <text x="100" y="68" fill="#475569" fontSize="7.5" fontWeight="bold" textAnchor="middle">Triptych</text>
            </>
          )}
        </svg>
      );
    }

    // 5. Collage Grids
    if (opt.diagramType?.startsWith('collage')) {
      const is4 = opt.diagramType === 'collage-4';
      const is9 = opt.diagramType === 'collage-9';
      return (
        <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
          <rect x="45" y="12" width="110" height="98" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" rx="3" />
          {is4 ? (
            <>
              <rect x="49" y="16" width="50" height="43" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="1.5" />
              <rect x="101" y="16" width="50" height="43" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="1.5" />
              <rect x="49" y="61" width="50" height="45" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="1.5" />
              <rect x="101" y="61" width="50" height="45" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" rx="1.5" />
              <text x="100" y="66" fill="#0E4A93" fontSize="8" fontWeight="black" textAnchor="middle">4 Grid</text>
            </>
          ) : is9 ? (
            <text x="100" y="65" fill="#0E4A93" fontSize="8" fontWeight="black" textAnchor="middle">9 Grid (3×3)</text>
          ) : (
            <text x="100" y="65" fill="#0E4A93" fontSize="8" fontWeight="black" textAnchor="middle">{opt.label}</text>
          )}
        </svg>
      );
    }

    // 6. Single Geometric Shapes
    const isRound = opt.shapeId === 'shape-circle';
    const isHeart = opt.shapeId === 'shape-heart';
    const isTriangle = opt.shapeId === 'shape-triangle';
    const isOval = opt.shapeId === 'shape-oval';
    const isHexagon = opt.shapeId === 'shape-hexagon';
    const isSquare = opt.shapeId === 'shape-square';

    return (
      <svg viewBox="0 0 200 130" className="w-full h-full max-h-28">
        {/* Top dimension */}
        <line x1="35" y1="12" x2="165" y2="12" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <text x="100" y="8" fill="#64748b" fontSize="8.5" fontWeight="bold" textAnchor="middle">{opt.widthInches}"</text>

        {/* Left dimension */}
        <line x1="18" y1="20" x2="18" y2="115" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <text x="10" y="70" fill="#64748b" fontSize="8.5" fontWeight="bold" textAnchor="middle">{opt.heightInches}"</text>

        {isRound ? (
          <circle cx="100" cy="68" r="45" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" />
        ) : isOval ? (
          <ellipse cx="100" cy="68" rx="60" ry="44" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" />
        ) : isHeart ? (
          <path
            d="M 100,105 C 50,75 35,50 35,35 C 35,20 50,15 65,15 C 80,15 90,25 100,38 C 110,25 120,15 135,15 C 150,15 165,20 165,35 C 165,50 150,75 100,105 Z"
            fill="#f8fafc"
            stroke="#0E4A93"
            strokeWidth="1.5"
          />
        ) : isTriangle ? (
          <polygon points="100,20 160,110 40,110" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" />
        ) : isHexagon ? (
          <polygon points="70,22 130,22 160,68 130,112 70,112 40,68" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" />
        ) : isSquare ? (
          <rect x="55" y="24" width="90" height="90" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" rx="3" />
        ) : opt.widthInches > opt.heightInches ? (
          <rect x="35" y="32" width="130" height="74" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" rx="3" />
        ) : (
          <rect x="58" y="18" width="84" height="98" fill="#f8fafc" stroke="#0E4A93" strokeWidth="1.5" rx="3" />
        )}

        <text x="100" y="72" fill="#0E4A93" fontSize="8" fontWeight="extrabold" textAnchor="middle">
          {opt.label}
        </text>
      </svg>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              Select size & shape
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#0E4A93] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {productName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shape Filter Pills (Only shown for products that support multiple geometric shapes) */}
        {!isMultiPanelProduct && supportedShapes.length > 1 && (
          <div className="px-6 pt-3 pb-2 border-b border-stone-100 bg-stone-50/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-black uppercase text-stone-500 mr-1 shrink-0">
              Shape:
            </span>
            <button
              type="button"
              onClick={() => setActiveShapeFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeShapeFilter === 'ALL'
                  ? 'bg-[#0E4A93] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              All Shapes
            </button>
            {supportedShapes.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => setActiveShapeFilter(shape.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeShapeFilter === shape.id
                    ? 'bg-[#0E4A93] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        )}

        {/* Content: Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleOptions.map((opt) => {
              const isSelected = !showCustomSize && selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleCardClick(opt)}
                  onDoubleClick={() => handleCardDoubleClick(opt)}
                  className={`relative rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden bg-white hover:border-stone-400 group ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] shadow-md bg-blue-50/10 ring-2 ring-[#0E4A93]/15'
                      : 'border-stone-200 shadow-2xs'
                  }`}
                >
                  {/* Top-right Checkmark badge when selected (Matches reference styling: blue checkmark, zero red) */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Diagram / Preview Upper Box */}
                  <div className="h-32 p-3 bg-stone-50/60 border-b border-stone-100 flex items-center justify-center relative select-none">
                    {renderDiagram(opt)}
                  </div>

                  {/* Details Bottom Box */}
                  <div className="p-3 bg-white flex flex-col items-center justify-center space-y-1">
                    <span className="text-xs sm:text-[13px] font-bold text-stone-800 text-center line-clamp-1">
                      {opt.label}
                    </span>
                    <span className="text-sm font-extrabold text-[#0E4A93]">
                      ₹{opt.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Size Section (Available for single-panel products) */}
          {!isMultiPanelProduct && (
            <div className="pt-2">
              <div
                onClick={() => setShowCustomSize(!showCustomSize)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  showCustomSize
                    ? 'border-2 border-[#0E4A93] bg-blue-50/20 ring-2 ring-[#0E4A93]/15'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${showCustomSize ? 'border-[#0E4A93] bg-[#0E4A93]' : 'border-stone-400'}`}>
                    {showCustomSize && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Custom Size</h4>
                    <p className="text-[11px] text-stone-500">Need specific custom dimensions? Enter width and height (8" to 48")</p>
                  </div>
                </div>
                {showCustomSize && (
                  <span className="text-xs font-bold text-[#0E4A93]">
                    ₹{Math.round(Math.max(8, localCustomW) * Math.max(8, localCustomH) * (material === 'acrylic' ? 4.5 : 2.5)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {showCustomSize && (
                <div className="mt-3 p-4 rounded-xl bg-white border border-stone-200 shadow-inner grid grid-cols-2 gap-3 animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] font-extrabold text-stone-600 block mb-1">WIDTH (INCHES)</label>
                    <input
                      type="number"
                      min={8}
                      max={48}
                      value={localCustomW}
                      onChange={(e) => setLocalCustomW(Number(e.target.value) || 8)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-stone-600 block mb-1">HEIGHT (INCHES)</label>
                    <input
                      type="number"
                      min={8}
                      max={48}
                      value={localCustomH}
                      onChange={(e) => setLocalCustomH(Number(e.target.value) || 8)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:border-[#0E4A93]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer / Action Bar */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Selected:{' '}
            <strong className="text-stone-800">
              {showCustomSize ? `${localCustomW}" × ${localCustomH}" Custom` : currentSelectedOption?.label}
            </strong>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-xl text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] shadow-md transition-transform hover:scale-102 cursor-pointer"
            >
              Apply Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
