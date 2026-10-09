import React, { useState, useMemo } from 'react';
import { Check, ChevronDown, ChevronRight, Type, Maximize2, Quote, Sparkles } from 'lucide-react';
import {
  QUOTE_CATEGORIES,
  QUOTE_FILTER_TAGS,
  QUOTE_TEMPLATES,
  QuoteCategoryName,
  QuoteFilterTag,
  QuoteTemplateItem
} from '../data/quoteTemplatesData';

export interface QuotesTemplateSidebarPanelProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: QuoteTemplateItem) => void;
  onChangeSizeClick?: () => void;
  currentSizeLabel?: string;
  currentPrice?: number;
  onOpenTextModal?: () => void;
}

export const QuotesTemplateSidebarPanel: React.FC<QuotesTemplateSidebarPanelProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onChangeSizeClick,
  currentSizeLabel = '8" × 8"',
  currentPrice = 999,
  onOpenTextModal
}) => {
  // Top filter tag (Failure, Good, Better, Best, New Day, or 'ALL')
  const [activeFilterTag, setActiveFilterTag] = useState<string>('ALL');

  // Currently expanded category accordion (defaults to 'Inspirational Quotes' matching the reference screenshot)
  const [expandedCategory, setExpandedCategory] = useState<QuoteCategoryName | null>('Inspirational Quotes');

  // Filter templates by tag
  const filteredTemplates = useMemo(() => {
    if (activeFilterTag === 'ALL') {
      return QUOTE_TEMPLATES;
    }
    return QUOTE_TEMPLATES.filter((t) => t.filterTags.includes(activeFilterTag));
  }, [activeFilterTag]);

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    const map: Record<QuoteCategoryName, QuoteTemplateItem[]> = {
      'Life Quotes': [],
      'Inspirational Quotes': [],
      'Love Quotes': [],
      'Funny Quotes': [],
      'Best Quotes': [],
      'Happiness Quotes': []
    };

    filteredTemplates.forEach((t) => {
      if (map[t.category]) {
        map[t.category].push(t);
      }
    });

    return map;
  }, [filteredTemplates]);

  // Handle category accordion click
  const handleToggleCategory = (cat: QuoteCategoryName) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white select-none">
      {/* 1. Header with Title & Description */}
      <div className="p-3.5 pb-2 border-b border-stone-200/80 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
              <Quote className="w-3 h-3 stroke-[2.2]" />
            </div>
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Select Template
            </h3>
          </div>
          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            {filteredTemplates.length} Designs
          </span>
        </div>
        <p className="text-[11px] text-stone-500">
          Choose a predesigned quote template to print directly on your canvas.
        </p>

        {/* 2. Top Filter Tags Bar matching Reference Screenshot */}
        <div className="mt-2.5 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilterTag('ALL')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilterTag === 'ALL'
                  ? 'bg-[#0E4A93] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {QUOTE_FILTER_TAGS.map((tag: QuoteFilterTag) => {
              const isActive = activeFilterTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveFilterTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0E4A93] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Category Accordion Rows & 3-Column Template Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-stone-100">
        {QUOTE_CATEGORIES.map((catObj) => {
          const catName = catObj.id;
          const items = templatesByCategory[catName] || [];
          const isExpanded = expandedCategory === catName;
          const hasSelected = items.some((t) => t.id === selectedTemplateId);

          return (
            <div key={catName} className="bg-white transition-colors">
              {/* Category Header Row matching screenshot */}
              <button
                type="button"
                onClick={() => handleToggleCategory(catName)}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group ${
                  isExpanded ? 'bg-blue-50/50' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black tracking-tight transition-colors ${
                      isExpanded || hasSelected
                        ? 'text-[#0E4A93]'
                        : 'text-stone-700 group-hover:text-stone-900'
                    }`}
                  >
                    {catObj.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isExpanded
                        ? 'bg-[#0E4A93]/15 text-[#0E4A93]'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-400 group-hover:text-stone-700">
                  {hasSelected && !isExpanded && (
                    <span className="w-2 h-2 rounded-full bg-[#0E4A93]" title="Active design inside" />
                  )}
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#0E4A93]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* Collapsible 3-Column Template Grid */}
              {isExpanded && (
                <div className="p-2.5 bg-stone-50/60 border-t border-stone-100/80 animate-in fade-in duration-150">
                  {items.length === 0 ? (
                    <div className="py-6 text-center text-stone-400 text-xs">
                      No templates match "{activeFilterTag}" in this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {items.map((t) => {
                        const isSelected = t.id === selectedTemplateId;
                        return (
                          <div
                            key={t.id}
                            onClick={() => onSelectTemplate(t)}
                            className={`group relative flex flex-col items-center p-1.5 rounded-xl border bg-white cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/20 shadow-xs bg-blue-50/20'
                                : 'border-stone-200 hover:border-stone-400 hover:shadow-2xs'
                            }`}
                          >
                            {/* Artwork Image Container */}
                            <div className="w-full aspect-square rounded-lg overflow-hidden relative bg-stone-100 flex items-center justify-center border border-stone-100">
                              <img
                                src={t.image}
                                alt={t.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  // Clean fallback in case image fails
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  if (target.parentElement) {
                                    target.parentElement.innerHTML = `
                                      <div class="w-full h-full flex flex-col items-center justify-center p-1.5 text-center bg-stone-800 text-amber-200 text-[8px] font-bold uppercase leading-tight">
                                        <div class="text-[9px] mb-0.5">${t.title}</div>
                                        <div class="text-[7px] text-stone-400">${t.lines.slice(0, 2).join(' ')}</div>
                                      </div>
                                    `;
                                  }
                                }}
                              />

                              {/* Active Blue Check Indicator matching Canvas India UI */}
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs z-10">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            {/* Template Short Title */}
                            <span
                              className={`w-full mt-1.5 text-[10px] font-bold text-center truncate px-0.5 leading-tight ${
                                isSelected ? 'text-[#0E4A93]' : 'text-stone-700'
                              }`}
                              title={t.title}
                            >
                              {t.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Controls: Canvas Size & Text Personalization */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/80 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-500 font-medium">
            <span>Size:</span>
            <strong className="text-stone-800">{currentSizeLabel}</strong>
          </div>
          <div className="text-xs font-black text-[#0E4A93]">
            ₹{currentPrice.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {onChangeSizeClick && (
            <button
              type="button"
              onClick={onChangeSizeClick}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Maximize2 className="w-3 h-3 text-[#0E4A93]" />
              <span>Change Size</span>
            </button>
          )}

          {onOpenTextModal && (
            <button
              type="button"
              onClick={onOpenTextModal}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Type className="w-3 h-3 text-[#0E4A93]" />
              <span>Add Custom Text</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
