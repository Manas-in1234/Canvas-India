import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
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

export type SinglePrintCategory = 'SQUARE' | 'PANORAMIC' | 'RECOMMENDED';

export const SelectSizeShapeModal: React.FC<SelectSizeShapeModalProps> = ({
  isOpen,
  onClose,
  material,
  productId,
  productName,
  currentShapeId = 'shape-square',
  currentSizeId = '',
  isCustomSize = false,
  customWidth = 10,
  customHeight = 10,
  onSelectSizeAndShape
}) => {
  if (!isOpen) return null;

  const isQuotes = productId.toLowerCase() === 'canvas-quotes';

  const isSinglePrint = useMemo(() => {
    const norm = productId.toLowerCase();
    return norm === 'canvas-single' || norm === 'canvas-classic' || norm === 'acrylic-print' || norm === 'acrylic-photo-panel' || norm === 'canvas-quotes';
  }, [productId]);

  // Active Category Tab for Single Print: SQUARE (default), PANORAMIC, RECOMMENDED
  const [activeCategory, setActiveCategory] = useState<SinglePrintCategory>('SQUARE');

  // Single Print predefined sizes per category
  const singlePrintSizes = useMemo(() => {
    const isAcrylic = material === 'acrylic';

    if (isQuotes) {
      const squareSizes: SizeShapeOption[] = [
        {
          id: 'quotes-8x8',
          shapeId: 'shape-square',
          shapeName: 'Square',
          label: '8" × 8"',
          dimensionsSummary: '8" × 8"',
          widthInches: 8,
          heightInches: 8,
          price: 999.0,
          aspectRatio: 1,
          category: 'SQUARE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-10x10',
          shapeId: 'shape-square',
          shapeName: 'Square',
          label: '10" × 10"',
          dimensionsSummary: '10" × 10"',
          widthInches: 10,
          heightInches: 10,
          price: 1199.0,
          aspectRatio: 1,
          category: 'SQUARE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-12x12',
          shapeId: 'shape-square',
          shapeName: 'Square',
          label: '12" × 12"',
          dimensionsSummary: '12" × 12"',
          widthInches: 12,
          heightInches: 12,
          price: 1399.0,
          aspectRatio: 1,
          category: 'SQUARE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-16x16',
          shapeId: 'shape-square',
          shapeName: 'Square',
          label: '16" × 16"',
          dimensionsSummary: '16" × 16"',
          widthInches: 16,
          heightInches: 16,
          price: 1799.0,
          aspectRatio: 1,
          category: 'SQUARE',
          panelsCount: 1,
          diagramType: 'single-shape'
        }
      ];

      const panoramicSizes: SizeShapeOption[] = [
        {
          id: 'quotes-12x18',
          shapeId: 'shape-rectangle',
          shapeName: 'Portrait',
          label: '12" × 18"',
          dimensionsSummary: '12" × 18"',
          widthInches: 12,
          heightInches: 18,
          price: 1499.0,
          aspectRatio: 12 / 18,
          category: 'LANDSCAPE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-18x12',
          shapeId: 'shape-rectangle',
          shapeName: 'Landscape',
          label: '18" × 12"',
          dimensionsSummary: '18" × 12"',
          widthInches: 18,
          heightInches: 12,
          price: 1499.0,
          aspectRatio: 18 / 12,
          category: 'LANDSCAPE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-16x24',
          shapeId: 'shape-rectangle',
          shapeName: 'Portrait',
          label: '16" × 24"',
          dimensionsSummary: '16" × 24"',
          widthInches: 16,
          heightInches: 24,
          price: 2199.0,
          aspectRatio: 16 / 24,
          category: 'LANDSCAPE',
          panelsCount: 1,
          diagramType: 'single-shape'
        },
        {
          id: 'quotes-24x16',
          shapeId: 'shape-rectangle',
          shapeName: 'Landscape',
          label: '24" × 16"',
          dimensionsSummary: '24" × 16"',
          widthInches: 24,
          heightInches: 16,
          price: 2199.0,
          aspectRatio: 24 / 16,
          category: 'LANDSCAPE',
          panelsCount: 1,
          diagramType: 'single-shape'
        }
      ];

      const recommendedSizes: SizeShapeOption[] = [
        squareSizes[0],
        squareSizes[1],
        squareSizes[2],
        panoramicSizes[0],
        panoramicSizes[1]
      ];

      return {
        SQUARE: squareSizes,
        PANORAMIC: panoramicSizes,
        RECOMMENDED: recommendedSizes
      };
    }

    const squareSizes: SizeShapeOption[] = [
      {
        id: isAcrylic ? 'sq-10x10' : 'single-10x10',
        shapeId: 'shape-square',
        shapeName: 'Square',
        label: '10" × 10"',
        dimensionsSummary: '10" × 10"',
        widthInches: 10,
        heightInches: 10,
        price: isAcrylic ? 799.0 : 250.0,
        aspectRatio: 1,
        category: 'SQUARE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'sq-16x16' : 'single-16x16',
        shapeId: 'shape-square',
        shapeName: 'Square',
        label: '16" × 16"',
        dimensionsSummary: '16" × 16"',
        widthInches: 16,
        heightInches: 16,
        price: isAcrylic ? 1799.0 : 577.0,
        aspectRatio: 1,
        category: 'SQUARE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'sq-18x18' : 'single-18x18',
        shapeId: 'shape-square',
        shapeName: 'Square',
        label: '18" × 18"',
        dimensionsSummary: '18" × 18"',
        widthInches: 18,
        heightInches: 18,
        price: isAcrylic ? 2299.0 : 749.0,
        aspectRatio: 1,
        category: 'SQUARE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'sq-20x20' : 'single-20x20',
        shapeId: 'shape-square',
        shapeName: 'Square',
        label: '20" × 20"',
        dimensionsSummary: '20" × 20"',
        widthInches: 20,
        heightInches: 20,
        price: isAcrylic ? 2799.0 : 999.0,
        aspectRatio: 1,
        category: 'SQUARE',
        panelsCount: 1,
        diagramType: 'single-shape'
      }
    ];

    const panoramicSizes: SizeShapeOption[] = [
      {
        id: isAcrylic ? 'pan-12x18' : 'single-18x12',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '12" × 18"',
        dimensionsSummary: '12" × 18"',
        widthInches: 18,
        heightInches: 12,
        price: isAcrylic ? 1250.0 : 449.0,
        aspectRatio: 18 / 12,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'pan-12x24' : 'single-24x12',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '12" × 24"',
        dimensionsSummary: '12" × 24"',
        widthInches: 24,
        heightInches: 12,
        price: isAcrylic ? 1699.0 : 599.0,
        aspectRatio: 24 / 12,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'pan-16x24' : 'single-24x16',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '16" × 24"',
        dimensionsSummary: '16" × 24"',
        widthInches: 24,
        heightInches: 16,
        price: isAcrylic ? 2190.0 : 799.0,
        aspectRatio: 24 / 16,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'pan-16x32' : 'single-32x16',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '16" × 32"',
        dimensionsSummary: '16" × 32"',
        widthInches: 32,
        heightInches: 16,
        price: isAcrylic ? 2890.0 : 999.0,
        aspectRatio: 32 / 16,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'pan-20x30' : 'single-30x20',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '20" × 30"',
        dimensionsSummary: '20" × 30"',
        widthInches: 30,
        heightInches: 20,
        price: isAcrylic ? 3490.0 : 1199.0,
        aspectRatio: 30 / 20,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      },
      {
        id: isAcrylic ? 'pan-24x36' : 'single-36x24',
        shapeId: 'shape-rectangle',
        shapeName: 'Panoramic',
        label: '24" × 36"',
        dimensionsSummary: '24" × 36"',
        widthInches: 36,
        heightInches: 24,
        price: isAcrylic ? 4990.0 : 1599.0,
        aspectRatio: 36 / 24,
        category: 'LANDSCAPE',
        panelsCount: 1,
        diagramType: 'single-shape'
      }
    ];

    const recommendedSizes: SizeShapeOption[] = [
      squareSizes[0], // 10x10
      squareSizes[1], // 16x16
      squareSizes[2], // 18x18
      panoramicSizes[0], // 12x18
      panoramicSizes[2], // 16x24
      panoramicSizes[4]  // 20x30
    ];

    return {
      SQUARE: squareSizes,
      PANORAMIC: panoramicSizes,
      RECOMMENDED: recommendedSizes
    };
  }, [material]);

  // Options for shaped products (Round, Triangle, Heart, Oval)
  const shapedProductOptions = useMemo(() => {
    return getProductSizeShapeOptions(productId, material);
  }, [productId, material]);

  // All valid options to pick from
  const currentCategoryOptions = useMemo(() => {
    if (isSinglePrint) {
      return singlePrintSizes[activeCategory];
    }
    return shapedProductOptions;
  }, [isSinglePrint, activeCategory, singlePrintSizes, shapedProductOptions]);

  // Selected Option state
  const defaultOptionId = isSinglePrint
    ? (isQuotes ? 'quotes-8x8' : material === 'acrylic' ? 'sq-10x10' : 'single-10x10')
    : (shapedProductOptions[0]?.id || '');

  const [selectedOptionId, setSelectedOptionId] = useState<string>(() => {
    if (currentSizeId) {
      const match = currentCategoryOptions.find((o) => o.id === currentSizeId || o.dimensionsSummary === currentSizeId);
      if (match) return match.id;
    }
    return defaultOptionId;
  });

  // Custom size state
  const [showCustomSize, setShowCustomSize] = useState<boolean>(isCustomSize);
  const [localCustomW, setLocalCustomW] = useState<number>(customWidth || 10);
  const [localCustomH, setLocalCustomH] = useState<number>(customHeight || 10);

  // If category changes, keep selection if present or default to first
  useEffect(() => {
    if (!showCustomSize && currentCategoryOptions.length > 0) {
      const exists = currentCategoryOptions.some((o) => o.id === selectedOptionId);
      if (!exists) {
        setSelectedOptionId(currentCategoryOptions[0].id);
      }
    }
  }, [activeCategory, currentCategoryOptions, selectedOptionId, showCustomSize]);

  const currentSelectedOption = useMemo(() => {
    return currentCategoryOptions.find((o) => o.id === selectedOptionId) || currentCategoryOptions[0];
  }, [currentCategoryOptions, selectedOptionId]);

  // Confirmation handler
  const handleApply = () => {
    if (showCustomSize) {
      const w = Math.max(8, Math.min(48, Number(localCustomW) || 10));
      const h = Math.max(8, Math.min(48, Number(localCustomH) || 10));
      const sqInches = w * h;
      const rate = material === 'acrylic' ? 4.5 : 2.5;
      const calculatedPrice = Math.round(sqInches * rate);

      onSelectSizeAndShape({
        shapeId: currentShapeId || (w === h ? 'shape-square' : 'shape-rectangle'),
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

  // Render proportional SVG preview for square, panoramic, round, triangle, heart, and oval
  const renderSizePreviewSvg = (opt: SizeShapeOption, isSelected: boolean) => {
    const shapeId = opt.shapeId;
    const isRound = shapeId === 'shape-circle' || productId.includes('round');
    const isTriangle = shapeId === 'shape-triangle' || productId.includes('triangle');
    const isHeart = shapeId === 'shape-heart' || productId.includes('heart');
    const isOval = shapeId === 'shape-oval' || productId.includes('oval');
    const isSquare = shapeId === 'shape-square' || (opt.widthInches === opt.heightInches && !isRound && !isTriangle && !isHeart);

    const strokeColor = isSelected ? '#0E4A93' : '#94a3b8';
    const fillColor = isSelected ? '#eff6ff' : '#f8fafc';

    // 1. Round Canvas
    if (isRound) {
      return (
        <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
          <circle cx="80" cy="55" r="42" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <line x1="38" y1="55" x2="122" y2="55" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
          <text x="80" y="52" fill="#0E4A93" fontSize="10" fontWeight="bold" textAnchor="middle">
            {opt.widthInches}&quot; Dia
          </text>
        </svg>
      );
    }

    // 2. Triangle Canvas
    if (isTriangle) {
      return (
        <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
          <polygon points="80,18 135,95 25,95" fill={fillColor} stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />
          <text x="80" y="72" fill="#0E4A93" fontSize="10" fontWeight="bold" textAnchor="middle">
            {opt.widthInches}&quot;
          </text>
        </svg>
      );
    }

    // 3. Heart Canvas
    if (isHeart) {
      return (
        <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
          <path
            d="M 80,95 C 40,70 25,48 25,34 C 25,20 38,14 50,14 C 64,14 73,23 80,32 C 87,23 96,14 110,14 C 122,14 135,20 135,34 C 135,48 120,70 80,95 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <text x="80" y="55" fill="#0E4A93" fontSize="10" fontWeight="bold" textAnchor="middle">
            {opt.widthInches}&quot;
          </text>
        </svg>
      );
    }

    // 4. Oval Canvas
    if (isOval) {
      return (
        <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
          <ellipse cx="80" cy="55" rx="55" ry="38" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <text x="80" y="58" fill="#0E4A93" fontSize="9.5" fontWeight="bold" textAnchor="middle">
            {opt.widthInches}&quot; × {opt.heightInches}&quot;
          </text>
        </svg>
      );
    }

    // 5. Square (Canvas Single Print or Acrylic Square)
    if (isSquare) {
      return (
        <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
          <rect x="45" y="20" width="70" height="70" rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <text x="80" y="59" fill="#0E4A93" fontSize="10" fontWeight="bold" textAnchor="middle">
            {opt.widthInches}&quot; × {opt.heightInches}&quot;
          </text>
        </svg>
      );
    }

    // 6. Panoramic / Rectangle (Canvas Single Print or Acrylic Panoramic)
    const ratio = opt.widthInches / (opt.heightInches || 1);
    let rectW = 100;
    let rectH = 50;
    if (ratio >= 2) {
      rectW = 120;
      rectH = 44;
    } else if (ratio >= 1.5) {
      rectW = 110;
      rectH = 55;
    }

    const rectX = (160 - rectW) / 2;
    const rectY = (110 - rectH) / 2;

    return (
      <svg viewBox="0 0 160 110" className="w-full h-full max-h-24">
        <rect x={rectX} y={rectY} width={rectW} height={rectH} rx="3" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
        <text x="80" y="58" fill="#0E4A93" fontSize="9.5" fontWeight="bold" textAnchor="middle">
          {opt.widthInches}&quot; × {opt.heightInches}&quot;
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
              Select Size
            </h2>
            <span className="inline-block text-[11px] font-bold text-[#0E4A93] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {productName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Single Print Category Tabs: SQUARE | PANORAMIC | RECOMMENDED */}
        {isSinglePrint && (
          <div className="px-6 pt-3 pb-2 bg-stone-50/70 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 mr-2 hidden sm:inline">Category:</span>
              {(['SQUARE', 'PANORAMIC', 'RECOMMENDED'] as SinglePrintCategory[]).map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowCustomSize(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0E4A93] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {cat === 'SQUARE' && 'Square'}
                    {cat === 'PANORAMIC' && 'Panoramic'}
                    {cat === 'RECOMMENDED' && 'Recommended'}
                    <span className="ml-1.5 text-[10px] opacity-80">
                      ({singlePrintSizes[cat].length})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content: Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {currentCategoryOptions.map((opt) => {
              const isSelected = !showCustomSize && selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleCardClick(opt)}
                  onDoubleClick={() => handleCardDoubleClick(opt)}
                  className={`group relative rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden bg-white hover:border-[#0E4A93]/60 ${
                    isSelected
                      ? 'border-2 border-[#0E4A93] shadow-md bg-blue-50/15 ring-2 ring-[#0E4A93]/15'
                      : 'border-stone-200 shadow-xs hover:shadow-sm'
                  }`}
                >
                  {/* Top-right Checkmark badge when selected */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Diagram / Preview Upper Box */}
                  <div className="h-28 p-3 bg-stone-50/50 border-b border-stone-100 flex items-center justify-center relative select-none group-hover:scale-102 transition-transform">
                    {renderSizePreviewSvg(opt, isSelected)}
                  </div>

                  {/* Details Bottom Box */}
                  <div className="p-3 bg-white flex flex-col items-center justify-center space-y-0.5">
                    <span className="text-xs sm:text-[13px] font-black text-stone-900 text-center">
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

          {/* Custom Size Section (Available for single print) */}
          {isSinglePrint && (
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
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      showCustomSize ? 'border-[#0E4A93] bg-[#0E4A93]' : 'border-stone-400'
                    }`}
                  >
                    {showCustomSize && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900">Custom Size</h4>
                    <p className="text-[11px] text-stone-500">
                      Need custom dimensions? Enter width and height (8&quot; to 48&quot;)
                    </p>
                  </div>
                </div>
                {showCustomSize && (
                  <span className="text-xs font-bold text-[#0E4A93]">
                    ₹
                    {Math.round(
                      Math.max(8, localCustomW) * Math.max(8, localCustomH) * (material === 'acrylic' ? 4.5 : 2.5)
                    ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {showCustomSize && (
                <div className="mt-3 p-4 rounded-xl bg-white border border-stone-200 shadow-inner grid grid-cols-2 gap-3 animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] font-extrabold text-stone-600 block mb-1">
                      WIDTH (INCHES)
                    </label>
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
                    <label className="text-[11px] font-extrabold text-stone-600 block mb-1">
                      HEIGHT (INCHES)
                    </label>
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
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Selected:{' '}
            <strong className="text-stone-900 font-black">
              {showCustomSize
                ? `${localCustomW}" × ${localCustomH}" (Custom)`
                : currentSelectedOption?.label}
            </strong>
            <span className="ml-2 font-bold text-[#0E4A93]">
              ₹
              {showCustomSize
                ? Math.round(
                    Math.max(8, localCustomW) * Math.max(8, localCustomH) * (material === 'acrylic' ? 4.5 : 2.5)
                  ).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                : currentSelectedOption?.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
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
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] shadow-md transition-all hover:scale-102 cursor-pointer flex items-center gap-2"
            >
              <span>Continue to Upload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
