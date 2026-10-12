import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';
import {
  BusRollConfig,
  BusRollTemplate,
  BUS_ROLL_TEMPLATES,
  getBusRollPattern
} from '../data/busRollData';

export interface BusRollTemplatePanelProps {
  config: BusRollConfig;
  onChangeConfig: (updates: Partial<BusRollConfig>) => void;
}

const TEMPLATE_CATEGORIES = [
  'Family',
  'Bus Roll',
  'Food and Drink',
  'Holiday',
  'Inspirational'
] as const;

export const BusRollTemplatePanel: React.FC<BusRollTemplatePanelProps> = ({
  config,
  onChangeConfig
}) => {
  // Accordion state - Family expanded by default matching Screenshot 3
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Family: true,
    'Bus Roll': false,
    'Food and Drink': false,
    Holiday: false,
    Inspirational: false
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleApplyTemplate = (tpl: BusRollTemplate) => {
    onChangeConfig({
      lines: tpl.lines.map((l) => ({ ...l })), // Deep copy
      backgroundColor: tpl.backgroundColor,
      patternId: tpl.patternId,
      patternOpacity: tpl.patternOpacity,
      fontFamily: tpl.fontFamily,
      fontStyle: tpl.fontStyle,
      lineSpacing: tpl.lineSpacing,
      margin: tpl.margin,
      widthInches: tpl.widthInches,
      heightInches: tpl.heightInches,
      templateId: tpl.id
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Informative Header */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-[#0E4A93]">
        <div className="font-extrabold uppercase tracking-wide flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-[#0E4A93]" />
          <span>Curated Bus Roll Templates</span>
        </div>
        <p className="text-[11px] text-stone-600 mt-0.5">
          Select any ready-made design below as a starting point. All text, colors, backgrounds, and fonts remain 100% editable.
        </p>
      </div>

      {/* Accordion Categories matching Screenshot 3 */}
      <div className="space-y-2">
        {TEMPLATE_CATEGORIES.map((cat) => {
          const isExpanded = Boolean(expandedCategories[cat]);
          const templatesInCat = BUS_ROLL_TEMPLATES.filter((t) => t.category === cat);

          return (
            <div
              key={cat}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs transition-all"
            >
              {/* Category Header Row */}
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="w-full px-4 py-3 bg-stone-50/80 hover:bg-stone-100/80 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-stone-900 tracking-wide">{cat}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold text-stone-600 bg-stone-200/80 rounded-full">
                    {templatesInCat.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-[#0E4A93] stroke-[2.5]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                )}
              </button>

              {/* Collapsible Templates Grid */}
              {isExpanded && (
                <div className="p-3 bg-white border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-2.5">
                    {templatesInCat.map((tpl) => {
                      const isSelected = config.templateId === tpl.id;
                      const pattern = getBusRollPattern(tpl.patternId);

                      return (
                        <div
                          key={tpl.id}
                          onClick={() => handleApplyTemplate(tpl)}
                          className={`group relative rounded-xl border p-2 flex flex-col items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'border-2 border-[#0E4A93] bg-blue-50/30 shadow-xs ring-1 ring-[#0E4A93]/20'
                              : 'border-stone-200 hover:border-stone-400 bg-white shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          {/* Selected Badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-xs z-10">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Mini Realistic Bus Roll Thumbnail */}
                          <div
                            className="w-full h-32 rounded-lg border border-black/10 shadow-xs overflow-hidden relative flex flex-col items-center justify-center p-2 group-hover:scale-102 transition-transform select-none"
                            style={{ backgroundColor: tpl.backgroundColor }}
                          >
                            {/* Pattern Overlay */}
                            {pattern.svgDefs && (
                              <div
                                className="absolute inset-0 pointer-events-none text-white"
                                style={{ opacity: tpl.patternOpacity }}
                                dangerouslySetInnerHTML={{
                                  __html: `
                                    <svg width="100%" height="100%">
                                      <defs>
                                        <pattern id="thumb-pat-${tpl.id}" width="${pattern.patternWidth}" height="${pattern.patternHeight}" patternUnits="userSpaceOnUse">
                                          ${pattern.svgDefs}
                                        </pattern>
                                      </defs>
                                      <rect width="100%" height="100%" fill="url(#thumb-pat-${tpl.id})"/>
                                    </svg>
                                  `
                                }}
                              />
                            )}

                            {/* Lines preview */}
                            <div className="relative z-1 flex flex-col items-center justify-center gap-0.5 w-full text-center">
                              {tpl.lines.slice(0, 6).map((l, lIdx) => (
                                <span
                                  key={lIdx}
                                  className="truncate font-black tracking-widest leading-none uppercase"
                                  style={{
                                    color: l.color,
                                    fontSize: `${Math.max(6, Math.min(10, 52 / (l.text.length || 1)))}px`,
                                    fontFamily: tpl.fontFamily
                                  }}
                                >
                                  {l.text}
                                </span>
                              ))}
                              {tpl.lines.length > 6 && (
                                <span className="text-[6px] text-white/70 leading-none">...</span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <div className="text-[11px] font-black text-stone-900 text-center mt-2 truncate w-full leading-tight">
                            {tpl.title}
                          </div>

                          {/* Dimensions Pill */}
                          <div className="text-[9px] font-bold text-stone-600 mt-0.5">
                            {tpl.widthInches}" × {tpl.heightInches}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
