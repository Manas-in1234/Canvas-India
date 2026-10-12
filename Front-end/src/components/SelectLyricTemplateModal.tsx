import React, { useState, useEffect } from 'react';
import { X, Check, Info, Sparkles, Music } from 'lucide-react';
import {
  LYRIC_CANVAS_TEMPLATES,
  LYRIC_CANVAS_CATEGORIES,
  LyricCanvasTemplate,
  LyricTemplateCategory,
  LyricTemplateId
} from '../data/lyricCanvasData';

interface SelectLyricTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: LyricTemplateId;
  onSelectTemplate: (template: LyricCanvasTemplate) => void;
}

export const SelectLyricTemplateModal: React.FC<SelectLyricTemplateModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate
}) => {
  const [activeCategory, setActiveCategory] = useState<LyricTemplateCategory>('all');
  const [activeInfoTemplate, setActiveInfoTemplate] = useState<LyricCanvasTemplate | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeInfoTemplate) {
          setActiveInfoTemplate(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeInfoTemplate, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveInfoTemplate(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTemplates = activeCategory === 'all'
    ? LYRIC_CANVAS_TEMPLATES
    : LYRIC_CANVAS_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-lyric-template-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0E4A93] flex items-center justify-center shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="select-lyric-template-title"
                className="text-base sm:text-lg font-black text-stone-900 tracking-tight"
              >
                Select Lyric Template
              </h2>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Choose a song or wedding vow design to personalize with your own lyrics and photograph
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Production Notice (Canvas India brand styling) */}
        <div className="px-5 sm:px-6 pt-3.5 pb-2 bg-stone-50/70 border-b border-stone-100 shrink-0">
          <div className="flex items-start gap-2.5 p-3 bg-blue-50/90 rounded-xl border border-blue-200 text-[#0E4A93]">
            <Info className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed text-stone-700">
              <strong className="text-[#0E4A93] font-bold">Designer Crafting Note:</strong> Templates are starting points for your design. Our production team may adjust the final composition to suit your selected lyrics and image. Where applicable, a proof will be shared for your approval before production.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
            {LYRIC_CANVAS_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Template Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className={`group relative bg-white rounded-2xl border-2 transition-all cursor-pointer flex flex-col overflow-hidden text-left ${
                    isSelected
                      ? 'border-[#0E4A93] bg-blue-50/20 shadow-md ring-2 ring-[#0E4A93]/20'
                      : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                  }`}
                >
                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-md animate-in zoom-in duration-150">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Information Icon Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveInfoTemplate(template);
                    }}
                    className={`absolute top-2.5 ${
                      isSelected ? 'right-9.5' : 'right-2.5'
                    } z-20 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-[#0E4A93] shadow-xs flex items-center justify-center transition-all cursor-pointer border border-stone-200/80`}
                    title="View template details"
                    aria-label={`View details for ${template.name}`}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  {/* Preview Image Container */}
                  <div className="w-full aspect-4/3 bg-stone-100 overflow-hidden relative border-b border-stone-100 flex items-center justify-center">
                    <img
                      src={template.previewImage}
                      alt={template.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2 group-hover:scale-103 transition-transform duration-200"
                    />
                  </div>

                  {/* Card Details */}
                  <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
                    <div>
                      <h3 className="text-xs font-black text-stone-900 group-hover:text-[#0E4A93] transition-colors line-clamp-2 leading-snug">
                        {template.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-[#0E4A93] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#E8752A]" />
                        <span>Included in Canvas</span>
                      </span>
                      <span className="text-[10px] font-bold text-stone-400 capitalize">
                        {template.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-stone-100 bg-stone-50 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-stone-500">
            {filteredTemplates.length} Templates Available
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Template Information Popover / Dialog */}
      {activeInfoTemplate && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-100"
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfoTemplate(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E8752A] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {activeInfoTemplate.category.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-black text-stone-900 mt-1.5 leading-snug">
                  {activeInfoTemplate.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveInfoTemplate(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {activeInfoTemplate.description}
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold">Layout Style:</span>
                <span className="font-extrabold text-stone-800 capitalize">
                  {activeInfoTemplate.defaultLayout.replace(/-/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold">Personal Photo:</span>
                <span className="font-extrabold text-emerald-600">
                  {activeInfoTemplate.supportsPhoto ? 'Supported & Recommended' : 'Optional Text-Only'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold">Default Font:</span>
                <span className="font-extrabold text-stone-800">
                  {activeInfoTemplate.defaultTypography.fontFamily}
                </span>
              </div>
              {activeInfoTemplate.themeNote && (
                <div className="pt-2 border-t border-stone-200 text-[11px] text-[#0E4A93] font-medium leading-snug">
                  💡 {activeInfoTemplate.themeNote}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(activeInfoTemplate);
                  setActiveInfoTemplate(null);
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-[#0E4A93] hover:bg-[#0b3c77] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Select This Template
              </button>
              <button
                type="button"
                onClick={() => setActiveInfoTemplate(null)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
