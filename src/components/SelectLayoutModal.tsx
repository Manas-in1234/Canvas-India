import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, Layers } from 'lucide-react';
import {
  getProductLayouts,
  renderProductLayoutDiagram,
  ProductLayoutDefinition
} from '../data/productGeometry';

export type LayoutModalOption = ProductLayoutDefinition;

export interface SelectLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: 'canvas' | 'acrylic';
  productId: string;
  productName: string;
  currentLayoutId?: string;
  onSelectLayout: (layout: LayoutModalOption) => void;
  onHighlightLayout?: (layout: LayoutModalOption) => void;
}

const COLLAGE_CATEGORIES: Array<{ id: 'landscape' | 'panoramic' | 'portrait' | 'square'; label: string }> = [
  { id: 'landscape', label: 'Landscape' },
  { id: 'panoramic', label: 'Panoramic' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'square', label: 'Square' }
];

const WALL_PANEL_FILTERS: Array<{ id: string; label: string; min?: number; max?: number }> = [
  { id: 'ALL', label: 'All' },
  { id: '3', label: '3 Panels', min: 3, max: 3 },
  { id: '4', label: '4 Panels', min: 4, max: 4 },
  { id: '5', label: '5 Panels', min: 5, max: 5 },
  { id: '6', label: '6 Panels', min: 6, max: 6 },
  { id: '7', label: '7 Panels', min: 7, max: 7 },
  { id: '8_PLUS', label: '8+ Panels', min: 8, max: 99 }
];

const SPLIT_PANEL_FILTERS: Array<{ id: string; label: string; min?: number; max?: number }> = [
  { id: 'ALL', label: 'All' },
  { id: '2', label: '2 Panels', min: 2, max: 2 },
  { id: '3', label: '3 Panels', min: 3, max: 3 },
  { id: '4', label: '4 Panels', min: 4, max: 4 },
  { id: '5', label: '5 Panels', min: 5, max: 5 },
  { id: '6_PLUS', label: '6+ Panels', min: 6, max: 99 }
];

export const SelectLayoutModal: React.FC<SelectLayoutModalProps> = ({
  isOpen,
  onClose,
  material: _material,
  productId,
  productName,
  currentLayoutId = '',
  onSelectLayout,
  onHighlightLayout
}) => {
  if (!isOpen) return null;

  // Single source of truth for layouts
  const productLayouts: ProductLayoutDefinition[] = useMemo(() => {
    return getProductLayouts(productId);
  }, [productId]);

  const isCollageProduct = productId === 'canvas-collage' || productLayouts.some((l) => Boolean(l.collageCategory));
  const isWallDisplay = productId.includes('wall') || productId.includes('display');
  const isSplitCanvas = productId.includes('split');

  // Category state for Photo Collage
  const [selectedCategory, setSelectedCategory] = useState<'landscape' | 'panoramic' | 'portrait' | 'square'>(() => {
    if (currentLayoutId) {
      const match = productLayouts.find((l) => l.id === currentLayoutId);
      if (match?.collageCategory) return match.collageCategory;
    }
    return 'landscape';
  });

  // Panel filter state for Wall Display and Split Canvas
  const [panelFilter, setPanelFilter] = useState<string>('ALL');

  // Selected layout state
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
      return currentLayoutId;
    }
    return productLayouts[0]?.id || '';
  });

  // Track modal open transition so we ONLY sync from currentLayoutId when opening the modal
  const prevIsOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
        setSelectedId(currentLayoutId);
        const match = productLayouts.find((l) => l.id === currentLayoutId);
        if (match?.collageCategory) {
          setSelectedCategory(match.collageCategory);
        }
      } else if (productLayouts.length > 0) {
        setSelectedId(productLayouts[0].id);
        if (productLayouts[0]?.collageCategory) {
          setSelectedCategory(productLayouts[0].collageCategory);
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, currentLayoutId, productLayouts]);

  // If product changed while open and selectedId is invalid
  useEffect(() => {
    if (isOpen && productLayouts.length > 0 && !productLayouts.some((l) => l.id === selectedId)) {
      const fallback = productLayouts[0];
      setSelectedId(fallback.id);
      if (fallback.collageCategory) {
        setSelectedCategory(fallback.collageCategory);
      }
    }
  }, [isOpen, productLayouts, selectedId]);

  const filteredLayouts = useMemo(() => {
    if (isCollageProduct) {
      return productLayouts.filter((l) => l.collageCategory === selectedCategory);
    }
    if (isWallDisplay) {
      if (panelFilter === 'ALL') return productLayouts;
      const f = WALL_PANEL_FILTERS.find((filter) => filter.id === panelFilter);
      if (!f) return productLayouts;
      return productLayouts.filter((l) => {
        if (f.min !== undefined && f.max !== undefined) {
          return l.panelsCount >= f.min && l.panelsCount <= f.max;
        }
        return true;
      });
    }
    if (isSplitCanvas) {
      if (panelFilter === 'ALL') return productLayouts;
      const f = SPLIT_PANEL_FILTERS.find((filter) => filter.id === panelFilter);
      if (!f) return productLayouts;
      return productLayouts.filter((l) => {
        if (f.min !== undefined && f.max !== undefined) {
          return l.panelsCount >= f.min && l.panelsCount <= f.max;
        }
        return true;
      });
    }
    return productLayouts;
  }, [isCollageProduct, isWallDisplay, isSplitCanvas, productLayouts, selectedCategory, panelFilter]);

  const currentSelected = useMemo(() => {
    return productLayouts.find((l) => l.id === selectedId) || filteredLayouts[0] || productLayouts[0];
  }, [productLayouts, selectedId, filteredLayouts]);

  const handleSelectCategory = (catId: 'landscape' | 'panoramic' | 'portrait' | 'square') => {
    setSelectedCategory(catId);
    const inCat = productLayouts.filter((l) => l.collageCategory === catId);
    if (inCat.length > 0 && !inCat.some((l) => l.id === selectedId)) {
      const nextLayout = inCat[0];
      setSelectedId(nextLayout.id);
      onHighlightLayout?.(nextLayout);
    }
  };

  const handleApply = () => {
    const layoutToApply = productLayouts.find((l) => l.id === selectedId) || currentSelected;
    if (layoutToApply) {
      onSelectLayout(layoutToApply);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                {isCollageProduct ? 'PHOTO COLLAGE' : 'Select Layout'}
              </h2>
              <p className="text-xs text-stone-500">
                {isCollageProduct
                  ? 'Choose your desired collage shape and photo arrangement'
                  : `Choose an arrangement for ${productName}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors bg-stone-100 hover:bg-stone-200 text-stone-700"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left category sidebar (for collage) + Main cards content */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
          {/* Collage Category Navigation */}
          {isCollageProduct && (
            <div className="w-full sm:w-48 lg:w-52 border-b sm:border-b-0 sm:border-r border-stone-200 bg-stone-50/70 p-2.5 sm:p-4 flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-x-visible shrink-0">
              <div className="hidden sm:block text-[11px] font-black uppercase tracking-wider text-stone-400 px-3 py-1 mb-1">
                Category
              </div>
              {COLLAGE_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = productLayouts.filter((l) => l.collageCategory === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white text-[#0E4A93] shadow-xs border-l-4 border-[#0E4A93] font-black'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 font-bold'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                        isActive ? 'bg-blue-50 text-[#0E4A93]' : 'bg-stone-200/60 text-stone-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Content: Layout Cards */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-800 tracking-tight">
                {isCollageProduct ? 'Select shape' : 'Available Layouts'}
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                Showing {filteredLayouts.length} arrangements
              </span>
            </div>

            {/* Panel Count Filters for Wall Display and Split Canvas */}
            {(isWallDisplay || isSplitCanvas) && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3.5 no-scrollbar">
                {(isWallDisplay ? WALL_PANEL_FILTERS : SPLIT_PANEL_FILTERS).map((filter) => {
                  const isActive = panelFilter === filter.id;
                  const count =
                    filter.id === 'ALL'
                      ? productLayouts.length
                      : productLayouts.filter((l) => {
                          if (filter.min !== undefined && filter.max !== undefined) {
                            return l.panelsCount >= filter.min && l.panelsCount <= filter.max;
                          }
                          return true;
                        }).length;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setPanelFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0E4A93] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredLayouts.map((layout) => {
                const isSelected = selectedId === layout.id;

                return (
                  <div
                    key={layout.id}
                    onClick={() => {
                      setSelectedId(layout.id);
                      onHighlightLayout?.(layout);
                    }}
                    onDoubleClick={() => {
                      setSelectedId(layout.id);
                      onSelectLayout(layout);
                      onClose();
                    }}
                    className={`group relative rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden bg-white hover:border-[#0E4A93]/60 ${
                      isSelected
                        ? 'border-2 border-[#0E4A93] shadow-md bg-blue-50/15 ring-2 ring-[#0E4A93]/15'
                        : 'border-stone-200 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Diagram / Preview Box */}
                    <div className="h-28 sm:h-32 p-3 bg-stone-50/60 border-b border-stone-100 flex items-center justify-center relative select-none group-hover:scale-102 transition-transform">
                      {renderProductLayoutDiagram(layout, isSelected)}
                    </div>

                    {/* Details Bottom Box */}
                    <div className="p-3 bg-white flex flex-col space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-[13px] font-black text-stone-900 truncate">
                          {layout.name}
                        </span>
                        {!isCollageProduct && (
                          <span className="text-[10px] font-bold text-[#0E4A93] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                            {layout.geometryType === 'mosaic'
                              ? (layout.cols && layout.rows ? `${layout.cols}×${layout.rows}` : `${layout.panelsCount} Tiles`)
                              : `${layout.panelsCount} ${layout.panelsCount === 1 ? 'Panel' : 'Panels'}`}
                          </span>
                        )}
                      </div>
                      {layout.description && (
                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {layout.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        {layout.dimensionsSummary && (
                          <span className="text-[10px] font-semibold text-stone-400">
                            {layout.dimensionsSummary}
                          </span>
                        )}
                        {(layout.priceRange || layout.price) && (
                          <span className="font-extrabold text-[#0E4A93] ml-auto">
                            {layout.priceRange || `₹${layout.price.toFixed(2)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 truncate mr-2">
            Selected Layout:{' '}
            <strong className="text-stone-900 font-black">
              {currentSelected?.name}
            </strong>
            <span className="ml-1.5 text-stone-400">
              ({currentSelected?.panelsCount} {currentSelected?.panelsCount === 1 ? 'Photo Slot' : 'Photo Slots'})
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
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
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#EA580C] hover:bg-[#C2410C] shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              Apply Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
