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
}

export const SelectLayoutModal: React.FC<SelectLayoutModalProps> = ({
  isOpen,
  onClose,
  material: _material,
  productId,
  productName,
  currentLayoutId = '',
  onSelectLayout
}) => {
  if (!isOpen) return null;

  // Single source of truth for layouts
  const productLayouts: ProductLayoutDefinition[] = useMemo(() => {
    return getProductLayouts(productId);
  }, [productId]);

  // Selected layout state
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
      return currentLayoutId;
    }
    return productLayouts[0]?.id || '';
  });

  useEffect(() => {
    if (currentLayoutId && productLayouts.some((l) => l.id === currentLayoutId)) {
      setSelectedId(currentLayoutId);
    } else if (productLayouts.length > 0 && !productLayouts.some((l) => l.id === selectedId)) {
      setSelectedId(productLayouts[0].id);
    }
  }, [currentLayoutId, productLayouts, selectedId]);

  const currentSelected = useMemo(() => {
    return productLayouts.find((l) => l.id === selectedId) || productLayouts[0];
  }, [productLayouts, selectedId]);

  const handleApply = () => {
    if (currentSelected) {
      onSelectLayout(currentSelected);
      onClose();
    }
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
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                Select Layout
              </h2>
              <p className="text-xs text-stone-500">
                Choose an arrangement for {productName}
              </p>
            </div>
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

        {/* Content: Layout Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {productLayouts.map((layout) => {
              const isSelected = selectedId === layout.id;
              return (
                <div
                  key={layout.id}
                  onClick={() => {
                    setSelectedId(layout.id);
                    onSelectLayout(layout);
                  }}
                  onDoubleClick={() => {
                    setSelectedId(layout.id);
                    onSelectLayout(layout);
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
                  <div className="h-32 p-3 bg-stone-50/50 border-b border-stone-100 flex items-center justify-center relative select-none group-hover:scale-102 transition-transform">
                    {renderProductLayoutDiagram(layout, isSelected)}
                  </div>

                  {/* Details Bottom Box */}
                  <div className="p-3 bg-white flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-[13px] font-black text-stone-900 truncate">
                        {layout.name}
                      </span>
                      <span className="text-[11px] font-bold text-[#0E4A93] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {layout.panelsCount} {layout.panelsCount === 1 ? 'Panel' : 'Panels'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {layout.description}
                    </p>
                    {layout.dimensionsSummary && (
                      <span className="text-[10px] font-semibold text-stone-400">
                        {layout.dimensionsSummary}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Selected Layout:{' '}
            <strong className="text-stone-900 font-black">
              {currentSelected?.name}
            </strong>
            <span className="ml-2 text-stone-400">
              ({currentSelected?.panelsCount} {currentSelected?.panelsCount === 1 ? 'Panel' : 'Panels'})
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
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#0E4A93] hover:bg-[#0A366C] shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              Apply Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
