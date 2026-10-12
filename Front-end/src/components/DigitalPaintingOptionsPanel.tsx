import React from 'react';
import {
  Check,
  Sparkles,
  Info,
  Users,
  Mountain,
  Plus,
  Minus,
  Palette,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';
import {
  DIGITAL_PAINTING_EFFECTS,
  DIGITAL_PAINTING_BACKGROUND_COLORS,
  DigitalPaintingConfig,
  DigitalPaintingEffectId,
  DigitalPaintingSubjectType,
  DigitalPaintingBackgroundOption,
  getDigitalPaintingEffect
} from '../data/digitalPaintingData';

export interface DigitalPaintingOptionsPanelProps {
  config: DigitalPaintingConfig;
  onChangeConfig: (updates: Partial<DigitalPaintingConfig>) => void;
  currentSizeLabel?: string;
  currentPrice?: number;
  onOpenSizeModal?: () => void;
}

export const DigitalPaintingOptionsPanel: React.FC<DigitalPaintingOptionsPanelProps> = ({
  config,
  onChangeConfig,
  currentSizeLabel = '10" × 10"',
  currentPrice,
  onOpenSizeModal
}) => {
  const currentEffect = getDigitalPaintingEffect(config.selectedEffectId);

  const handleSelectEffect = (effectId: DigitalPaintingEffectId) => {
    onChangeConfig({ selectedEffectId: effectId });
  };

  const handleSelectSubjectType = (type: DigitalPaintingSubjectType) => {
    if (type === 'people_pets' && config.peopleCount === 0 && config.petsCount === 0) {
      onChangeConfig({ subjectType: type, peopleCount: 1 });
    } else {
      onChangeConfig({ subjectType: type });
    }
  };

  const handleUpdatePeople = (delta: number) => {
    const next = Math.max(0, Math.min(20, config.peopleCount + delta));
    onChangeConfig({ peopleCount: next });
  };

  const handleUpdatePets = (delta: number) => {
    const next = Math.max(0, Math.min(20, config.petsCount + delta));
    onChangeConfig({ petsCount: next });
  };

  const handleSelectBackground = (opt: DigitalPaintingBackgroundOption) => {
    onChangeConfig({ backgroundOption: opt });
  };

  const handleSelectColor = (hex: string) => {
    onChangeConfig({ backgroundColor: hex });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: ARTISTIC EFFECTS                                   */}
        {/* ------------------------------------------------------------- */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0E4A93]">
                <Palette className="w-3 h-3 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
                Artistic Effect
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#0E4A93] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {DIGITAL_PAINTING_EFFECTS.length} Styles
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mb-3">
            Choose your preferred digital painting style for your photo.
          </p>

          {/* 4 Effect Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {DIGITAL_PAINTING_EFFECTS.map((effect) => {
              const isSelected = config.selectedEffectId === effect.id;
              return (
                <div
                  key={effect.id}
                  onClick={() => handleSelectEffect(effect.id)}
                  className={`group relative bg-white border-2 rounded-xl p-2 flex flex-col cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-[#0E4A93] bg-blue-50/20 shadow-xs ring-1 ring-[#0E4A93]/30'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Active Check Indicator */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-[#0E4A93] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}

                  {/* Badge */}
                  {effect.badge && (
                    <div className="absolute top-1.5 left-1.5 z-10 text-[9px] font-black uppercase tracking-wider bg-stone-900/80 text-white px-1.5 py-0.5 rounded-sm backdrop-blur-xs">
                      {effect.badge}
                    </div>
                  )}

                  {/* Effect Preview Thumbnail */}
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100 mb-2 border border-stone-100 flex items-center justify-center">
                    <img
                      src={effect.previewImage}
                      alt={effect.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-200"
                    />
                  </div>

                  {/* Effect Name & Price Adjustment */}
                  <div className="flex items-center justify-between text-left">
                    <span className="text-xs font-black text-stone-900 leading-tight">
                      {effect.name}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      + ₹0
                    </span>
                  </div>

                  <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {effect.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Real-time preview information message matching Canvas India standards */}
          <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0E4A93] shrink-0 mt-0.5" />
            <div className="text-[11px] text-stone-700 leading-relaxed">
              <span className="font-bold text-[#0E4A93]">Artisan Production Note:</span> Live effect preview isn't available yet. Our expert digital artists will professionally hand-paint your photo into the{' '}
              <span className="font-bold text-stone-900">{currentEffect.name}</span> style. A high-resolution digital proof will be sent for your approval before printing.
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: SUBJECT & ARTWORK OPTIONS                          */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
              <Users className="w-3 h-3 stroke-[2.2]" />
            </div>
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Subject & Artwork Options
            </h3>
          </div>
          <p className="text-[11px] text-stone-500 mb-3">
            Specify whether your artwork features portraits or landscapes.
          </p>

          <div className="space-y-2.5">
            {/* Option A: People / Pets Card */}
            <div
              onClick={() => handleSelectSubjectType('people_pets')}
              className={`border-2 rounded-xl p-3 transition-all cursor-pointer ${
                config.subjectType === 'people_pets'
                  ? 'border-[#0E4A93] bg-blue-50/20 ring-1 ring-[#0E4A93]/30'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      config.subjectType === 'people_pets'
                        ? 'border-[#0E4A93] bg-[#0E4A93]'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {config.subjectType === 'people_pets' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-xs font-black text-stone-900">
                    Persons / Pets
                  </span>
                </div>
                <span className="text-[10px] font-bold text-stone-500">
                  Portrait Mode
                </span>
              </div>

              {/* Counter Controls */}
              {config.subjectType === 'people_pets' && (
                <div className="mt-2.5 pt-2.5 border-t border-stone-200 space-y-2 bg-white/70 p-2.5 rounded-lg">
                  {/* Persons Counter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Persons
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Human subjects in photo (+ ₹0)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdatePeople(-1);
                        }}
                        disabled={config.peopleCount <= 0}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Decrease persons"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-black text-xs text-stone-900">
                        {config.peopleCount}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdatePeople(1);
                        }}
                        disabled={config.peopleCount >= 20}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Increase persons"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Pets Counter */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Pets
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Cats, dogs, other animals (+ ₹0)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdatePets(-1);
                        }}
                        disabled={config.petsCount <= 0}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Decrease pets"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-black text-xs text-stone-900">
                        {config.petsCount}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdatePets(1);
                        }}
                        disabled={config.petsCount >= 20}
                        className="w-7 h-7 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Increase pets"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {config.peopleCount === 0 && config.petsCount === 0 && (
                    <div className="text-[10px] text-amber-700 font-semibold bg-amber-50 p-1.5 rounded">
                      ⚠️ Please specify at least 1 person or pet for portrait mode.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Option B: Landscape Card */}
            <div
              onClick={() => handleSelectSubjectType('landscape')}
              className={`border-2 rounded-xl p-3 transition-all cursor-pointer ${
                config.subjectType === 'landscape'
                  ? 'border-[#0E4A93] bg-blue-50/20 ring-1 ring-[#0E4A93]/30'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      config.subjectType === 'landscape'
                        ? 'border-[#0E4A93] bg-[#0E4A93]'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {config.subjectType === 'landscape' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 block">
                      Landscape / Nature
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Scenic views, nature, architecture, and objects without main people/pets
                    </span>
                  </div>
                </div>
                <Mountain className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: BACKGROUND OPTIONS                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
              <ImageIcon className="w-3 h-3 stroke-[2.2]" />
            </div>
            <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Background Treatment
            </h3>
          </div>
          <p className="text-[11px] text-stone-500 mb-3">
            Select how the background around your subject should be painted.
          </p>

          <div className="space-y-2.5">
            {/* Background 1: Original Background (Default) */}
            <div
              onClick={() => handleSelectBackground('original')}
              className={`border-2 rounded-xl p-3 transition-all cursor-pointer ${
                config.backgroundOption === 'original'
                  ? 'border-[#0E4A93] bg-blue-50/20 ring-1 ring-[#0E4A93]/30'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      config.backgroundOption === 'original'
                        ? 'border-[#0E4A93] bg-[#0E4A93]'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {config.backgroundOption === 'original' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 block">
                      Original Background
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Keep and artistically blend your photo's existing background (Recommended)
                    </span>
                  </div>
                </div>
                {config.backgroundOption === 'original' && (
                  <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
            </div>

            {/* Background 2: Solid Background */}
            <div
              onClick={() => handleSelectBackground('solid')}
              className={`border-2 rounded-xl p-3 transition-all cursor-pointer ${
                config.backgroundOption === 'solid'
                  ? 'border-[#0E4A93] bg-blue-50/20 ring-1 ring-[#0E4A93]/30'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      config.backgroundOption === 'solid'
                        ? 'border-[#0E4A93] bg-[#0E4A93]'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {config.backgroundOption === 'solid' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 block">
                      Solid Background
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Replace background with a clean studio color backdrop
                    </span>
                  </div>
                </div>
                {config.backgroundOption === 'solid' && (
                  <div
                    className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: config.backgroundColor }}
                  />
                )}
              </div>

              {/* Color Swatches Grid */}
              {config.backgroundOption === 'solid' && (
                <div className="mt-2.5 pt-2.5 border-t border-stone-200">
                  <div className="text-[10px] font-bold text-stone-700 mb-1.5">
                    Select Studio Backdrop Color:
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {DIGITAL_PAINTING_BACKGROUND_COLORS.map((c) => {
                      const isColorActive = config.backgroundColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectColor(c.hex);
                          }}
                          className={`w-6 h-6 rounded-full border transition-transform cursor-pointer flex items-center justify-center ${
                            isColorActive
                              ? 'scale-115 border-[#0E4A93] ring-2 ring-[#0E4A93]/40'
                              : 'border-stone-300 hover:scale-108'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        >
                          {isColorActive && (
                            <Check className={`w-3 h-3 ${c.id === 'cream' || c.id === 'warm-beige' || c.id === 'soft-taupe' ? 'text-stone-800' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}

                    {/* Custom Color Input */}
                    <label className="flex items-center gap-1.5 ml-2 cursor-pointer text-[10px] font-bold text-stone-600 hover:text-stone-900">
                      <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => handleSelectColor(e.target.value)}
                        className="w-6 h-6 rounded-full border border-stone-300 cursor-pointer p-0 bg-transparent"
                      />
                      <span>Custom</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Background 3: Let the Artist Choose */}
            <div
              onClick={() => handleSelectBackground('artist_choice')}
              className={`border-2 rounded-xl p-3 transition-all cursor-pointer ${
                config.backgroundOption === 'artist_choice'
                  ? 'border-[#0E4A93] bg-blue-50/20 ring-1 ring-[#0E4A93]/30'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      config.backgroundOption === 'artist_choice'
                        ? 'border-[#0E4A93] bg-[#0E4A93]'
                        : 'border-stone-400 bg-white'
                    }`}
                  >
                    {config.backgroundOption === 'artist_choice' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 block">
                      Let the Artist Choose
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Our senior artist will pick the most complementary lighting and backdrop
                    </span>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-purple-600 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM SUMMARY & SIZE SHORTCUT BAR                            */}
      {/* ------------------------------------------------------------- */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/90 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-black text-stone-900 flex items-center gap-1.5">
              <span>{currentSizeLabel}</span>
              <span className="text-stone-300">•</span>
              <span className="text-[#0E4A93]">{currentEffect.name}</span>
            </div>
            <div className="text-[10px] text-stone-500 font-semibold mt-0.5">
              {config.subjectType === 'landscape'
                ? 'Landscape / Nature'
                : `${config.peopleCount} Person${config.peopleCount === 1 ? '' : 's'}, ${config.petsCount} Pet${config.petsCount === 1 ? '' : 's'}`}{' '}
              •{' '}
              {config.backgroundOption === 'original'
                ? 'Original BG'
                : config.backgroundOption === 'artist_choice'
                ? 'Artist Choice BG'
                : 'Solid BG'}
            </div>
          </div>
          {onOpenSizeModal && (
            <button
              type="button"
              onClick={onOpenSizeModal}
              className="px-2.5 py-1 text-xs font-bold text-[#0E4A93] hover:text-[#0a356a] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-[#0E4A93]/30"
            >
              Change Size
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
