import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Check,
  Type
} from 'lucide-react';
import {
  BusRollConfig,
  BusRollLine,
  BUS_ROLL_TEXT_COLOR_PALETTES
} from '../data/busRollData';

export interface BusRollLineEditorPanelProps {
  config: BusRollConfig;
  onChangeConfig: (updates: Partial<BusRollConfig>) => void;
}

export const BusRollLineEditorPanel: React.FC<BusRollLineEditorPanelProps> = ({
  config,
  onChangeConfig
}) => {
  const [activeColorPickerLineId, setActiveColorPickerLineId] = useState<string | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setActiveColorPickerLineId(null);
      }
    };
    if (activeColorPickerLineId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeColorPickerLineId]);

  // Update line text
  const handleUpdateLineText = (lineId: string, newText: string) => {
    const updated = config.lines.map((l) =>
      l.id === lineId ? { ...l, text: newText } : l
    );
    onChangeConfig({ lines: updated });
  };

  // Update line color
  const handleUpdateLineColor = (lineId: string, color: string) => {
    const updated = config.lines.map((l) =>
      l.id === lineId ? { ...l, color } : l
    );
    onChangeConfig({ lines: updated });
  };

  // Update line opacity / width
  const handleUpdateLineWidth = (lineId: string, opacity: number) => {
    const updated = config.lines.map((l) =>
      l.id === lineId ? { ...l, opacity } : l
    );
    onChangeConfig({ lines: updated });
  };

  // Move line up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newLines = [...config.lines];
    const temp = newLines[index - 1];
    newLines[index - 1] = newLines[index];
    newLines[index] = temp;
    onChangeConfig({ lines: newLines });
  };

  // Move line down
  const handleMoveDown = (index: number) => {
    if (index >= config.lines.length - 1) return;
    const newLines = [...config.lines];
    const temp = newLines[index + 1];
    newLines[index + 1] = newLines[index];
    newLines[index] = temp;
    onChangeConfig({ lines: newLines });
  };

  // Delete line
  const handleDeleteLine = (lineId: string) => {
    if (config.lines.length <= 1) return; // Keep at least one line
    const filtered = config.lines.filter((l) => l.id !== lineId);
    onChangeConfig({ lines: filtered });
  };

  // Add line
  const handleAddLine = () => {
    const newId = `line-${Date.now()}`;
    const newLine: BusRollLine = {
      id: newId,
      text: 'NEW DESTINATION',
      color: '#FFFFFF',
      opacity: 1
    };
    onChangeConfig({ lines: [...config.lines, newLine] });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Informative Header Banner */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-[#0E4A93]">
        <div className="font-extrabold uppercase tracking-wide flex items-center gap-1.5">
          <Type className="w-4 h-4 text-[#0E4A93]" />
          <span>Editable Bus Roll Typography</span>
        </div>
        <p className="text-[11px] text-stone-600 mt-0.5">
          Each line can be moved, edited, styled with custom colors and line widths. Changes reflect live on the canvas.
        </p>
      </div>

      {/* Table Column Headers */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-1.5 px-2 text-[10px] font-black text-stone-500 uppercase tracking-wider">
        <div className="col-span-2 text-center">Move</div>
        <div className="col-span-4">Text</div>
        <div className="col-span-3 text-center">Text Color</div>
        <div className="col-span-2 text-center">Line Width</div>
        <div className="col-span-1 text-center">Delete</div>
      </div>

      {/* Text Lines List */}
      <div className="space-y-2">
        {config.lines.map((line, idx) => {
          const isColorPickerOpen = activeColorPickerLineId === line.id;

          return (
            <div
              key={line.id}
              className="bg-white border border-stone-200 rounded-xl p-2 sm:p-2.5 shadow-2xs hover:border-stone-300 transition-all flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-1.5 items-center relative"
            >
              {/* 1. Move Controls */}
              <div className="col-span-2 flex items-center justify-center gap-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <div className="text-stone-300 py-1">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === config.lines.length - 1}
                  className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Text Input */}
              <div className="col-span-4 w-full">
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => handleUpdateLineText(line.id, e.target.value)}
                  placeholder="Enter text..."
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0E4A93] focus:border-[#0E4A93] uppercase tracking-wide"
                />
              </div>

              {/* 3. Text Color Button & Popover */}
              <div className="col-span-3 flex justify-center w-full relative">
                <button
                  type="button"
                  onClick={() => setActiveColorPickerLineId(isColorPickerOpen ? null : line.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:border-stone-400 transition-all cursor-pointer shadow-2xs w-full justify-center"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: line.color }}
                  />
                  <span className="text-[10px] font-mono text-stone-600 truncate">{line.color.toUpperCase()}</span>
                </button>

                {/* Color Picker Dropdown */}
                {isColorPickerOpen && (
                  <div
                    ref={colorPickerRef}
                    className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-40 bg-white border border-stone-200 rounded-xl p-3 shadow-xl w-60 animate-in fade-in zoom-in-95"
                  >
                    <div className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-2">
                      Select Text Color
                    </div>
                    {/* Swatches Grid */}
                    <div className="grid grid-cols-6 gap-1.5 mb-2.5">
                      {BUS_ROLL_TEXT_COLOR_PALETTES.map((swatch) => {
                        const isSelected = line.color.toLowerCase() === swatch.toLowerCase();
                        return (
                          <button
                            key={swatch}
                            type="button"
                            onClick={() => {
                              handleUpdateLineColor(line.id, swatch);
                              setActiveColorPickerLineId(null);
                            }}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                              isSelected ? 'border-[#0E4A93] ring-2 ring-[#0E4A93]/40' : 'border-stone-200'
                            }`}
                            style={{ backgroundColor: swatch }}
                            title={swatch}
                          >
                            {isSelected && (
                              <Check
                                className={`w-3.5 h-3.5 stroke-[3] ${
                                  swatch === '#FFFFFF' || swatch === '#FFF7D6' || swatch === '#FFD6C2' || swatch === '#FFFF99'
                                    ? 'text-stone-900'
                                    : 'text-white'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {/* Custom Hex Picker Input */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
                      <input
                        type="color"
                        value={line.color}
                        onChange={(e) => handleUpdateLineColor(line.id, e.target.value)}
                        className="w-7 h-7 p-0 border border-stone-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={line.color}
                        onChange={(e) => handleUpdateLineColor(line.id, e.target.value)}
                        className="flex-1 px-2 py-1 text-xs font-mono font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded uppercase"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Line Width / Opacity Dropdown */}
              <div className="col-span-2 w-full flex justify-center">
                <select
                  value={String(line.opacity)}
                  onChange={(e) => handleUpdateLineWidth(line.id, Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 cursor-pointer text-center focus:outline-none focus:ring-1 focus:ring-[#0E4A93]"
                >
                  <option value="1">100%</option>
                  <option value="0.75">75%</option>
                  <option value="0.5">50%</option>
                </select>
              </div>

              {/* 5. Delete Action */}
              <div className="col-span-1 flex justify-center w-full">
                <button
                  type="button"
                  onClick={() => handleDeleteLine(line.id)}
                  disabled={config.lines.length <= 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                  title="Delete Line"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add a Line CTA Button */}
      <button
        type="button"
        onClick={handleAddLine}
        className="w-full py-2.5 px-4 bg-[#E8752A] hover:bg-[#d6651d] active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Add a Line</span>
      </button>

      {/* Quick Summary Counter */}
      <div className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest pt-1">
        {config.lines.length} {config.lines.length === 1 ? 'Line' : 'Lines'} Configured
      </div>
    </div>
  );
};
