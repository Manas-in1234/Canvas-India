import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Check, ShoppingCart, SlidersHorizontal, Sparkles, Layers, Box, CheckCircle2, ZoomIn, ZoomOut, RotateCw, RefreshCw, AlignStartVertical, AlignCenterVertical, AlignEndVertical } from 'lucide-react';
import { Product } from '../types';
import { FRAME_LOOK, getFrameCategory } from './FrameHookVisuals';

type TextPosition = 'top' | 'center' | 'bottom';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCartCustomized: (item: {
    product: Product;
    quantity: number;
    size: string;
    finish: string;
    customText: string;
    photoUrl: string;
    calculatedPrice: number;
    material?: string;
    thickness?: string;
    style?: string;
    base?: string;
    paper?: string;
  }) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCartCustomized,
}) => {
  if (!isOpen || !product) return null;

  const isAcrylic = product.categorySlug === 'acrylic';

  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || product.sizes?.[0] || '12x18 inch');
  const [selectedFinish, setSelectedFinish] = useState(product.availableFinishes?.[0] || product.finishes?.[0] || 'Standard Finish');
  const [selectedThickness, setSelectedThickness] = useState(isAcrylic ? '3mm' : (product.availableThicknesses?.[0] || '0.75"'));
  const [selectedStyle, setSelectedStyle] = useState(product.availableStyles?.[0] || 'Block');
  const [selectedBase, setSelectedBase] = useState(product.availableBases?.[0] || 'Without Base');
  const [selectedPaper, setSelectedPaper] = useState(product.availablePapers?.[0] || 'White Luster Photo Paper');
  const [customText, setCustomText] = useState('');
  const [textPosition, setTextPosition] = useState<TextPosition>('bottom');
  const [photoPreview, setPhotoPreview] = useState(product.image);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2.5;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 10) / 10));
  const handleZoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_STEP) * 10) / 10));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleFitReset = () => {
    setZoom(1);
    setRotation(0);
  };

  // Sync state if product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes?.[0] || product.sizes?.[0] || '12x18 inch');
      setSelectedFinish(product.availableFinishes?.[0] || product.finishes?.[0] || 'Standard Finish');
      setSelectedThickness(isAcrylic ? '3mm' : (product.availableThicknesses?.[0] || '0.75"'));
      setSelectedStyle(product.availableStyles?.[0] || 'Block');
      setSelectedBase(product.availableBases?.[0] || 'Without Base');
      setSelectedPaper(product.availablePapers?.[0] || 'White Luster Photo Paper');
      setPhotoPreview(product.image);
      setCustomText('');
      setTextPosition('bottom');
      setZoom(1);
      setRotation(0);
      setUploadError(null);
    }
  }, [product]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid JPG, PNG or WebP image file.');
      return;
    }

    // Validate size (max 40MB)
    if (file.size > 40 * 1024 * 1024) {
      setUploadError('File size exceeds 40MB limit. Please upload a smaller file.');
      return;
    }

    setUploadError(null);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setZoom(1);
    setRotation(0);
  };

  // Dynamic price calculation
  const calculatePrice = () => {
    let price = product.price;

    if (isAcrylic) {
      // Size pricing
      if (selectedSize.includes('6" x 6"') || selectedSize.includes('5" x 7"') || selectedSize.includes('7" x 5"')) price += 200;
      else if (selectedSize.includes('8" x 8"') || selectedSize.includes('8" x 10"') || selectedSize.includes('10" x 8"')) price += 450;
      else if (selectedSize.includes('12" x 8"') || selectedSize.includes('8" x 12"') || selectedSize.includes('12" x 12"')) price += 700;
      else if (selectedSize.includes('12" x 18"') || selectedSize.includes('16" x 24"')) price += 1100;
      else if (selectedSize.includes('20" x 30"') || selectedSize.includes('24" x 36"') || selectedSize.includes('Set of 3')) price += 1800;
      else if (selectedSize.includes('30" x 48"') || selectedSize.includes('36" x 60"')) price += 2600;

      // Thickness pricing (3mm: 0, 5mm: +150, 6mm: +200, 8mm: +250)
      if (selectedThickness === '5mm') price += 150;
      else if (selectedThickness === '6mm') price += 200;
      else if (selectedThickness === '8mm') price += 250;

      // Base pricing
      if (selectedBase === 'Acrylic Base') price += 200;
      else if (selectedBase === 'Solid Wood Base') price += 250;
      else if (selectedBase === 'Chrome Floating Standoffs') price += 200;

      // Paper pricing
      if (selectedPaper === 'Metallic Pearl Paper') price += 150;
    } else {
      if (selectedSize.includes('16x24') || selectedSize.includes('18x24')) price += 350;
      if (selectedSize.includes('24x36') || selectedSize.includes('30x40')) price += 800;
      if (selectedFinish.includes('Floating Frame') || selectedFinish.includes('Gallery')) price += 300;
    }

    return price;
  };

  const handleConfirm = () => {
    onAddToCartCustomized({
      product: {
        ...product,
        price: calculatePrice(),
      },
      quantity: 1,
      size: selectedSize,
      finish: selectedFinish,
      customText,
      photoUrl: photoPreview,
      calculatedPrice: calculatePrice(),
      material: product.material,
      thickness: isAcrylic ? selectedThickness : undefined,
      style: isAcrylic ? selectedStyle : undefined,
      base: isAcrylic ? selectedBase : undefined,
      paper: isAcrylic ? selectedPaper : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0E4A93] text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base truncate">
              Customize: {product.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Top Row: Live Interactive Preview & Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            {/* Live Visual Preview Frame with Realistic Acrylic Glass or Frame Effect */}
            <div className="space-y-2">
              {(() => {
                const modalFrameCat = !isAcrylic ? getFrameCategory(selectedFinish) : 'No Frame';
                const modalFrameLook = FRAME_LOOK[modalFrameCat] || FRAME_LOOK['No Frame'];
                const hasModalFrame = modalFrameCat !== 'No Frame';

                return (
                  <div
                    className={`relative aspect-[4/3] bg-stone-100 rounded-xl overflow-hidden border-2 border-stone-200 shadow-md flex items-center justify-center ${
                      hasModalFrame ? 'p-2.5 sm:p-3' : ''
                    }`}
                  >
                    {hasModalFrame ? (
                      <div
                        className="relative max-w-full max-h-full aspect-[4/3] rounded-[2px] flex items-center justify-center shadow-lg"
                        style={{
                          padding: '10px',
                          background: modalFrameLook.frame,
                          boxShadow: modalFrameLook.boxShadow,
                          border: `1px solid ${modalFrameLook.borderColor}`,
                        }}
                      >
                        <div className="relative w-full h-full overflow-hidden rounded-[1px] bg-stone-50 flex items-center justify-center">
                          <img
                            src={photoPreview}
                            alt="Customized Preview"
                            className="w-full h-full object-contain transition-transform duration-150 ease-out"
                            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ boxShadow: modalFrameLook.innerShadow }}
                          />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={photoPreview}
                        alt="Customized Preview"
                        className="w-full h-full object-contain transition-transform duration-150 ease-out"
                        style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                      />
                    )}

                    {/* Gloss Acrylic Reflection Overlay */}
                    {isAcrylic && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/30 pointer-events-none" />
                    )}

                    {customText && (
                      <div
                        className={`absolute left-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold py-1 px-2 rounded text-center truncate ${
                          textPosition === 'top' ? 'top-2' : textPosition === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-2'
                        }`}
                      >
                        {customText}
                      </div>
                    )}

                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {selectedSize} {isAcrylic && selectedThickness && `• ${selectedThickness}`}
                    </div>

                    {isAcrylic && selectedBase && selectedBase !== 'Without Base' && (
                      <div className="absolute bottom-2 left-2 bg-[#0E4A93]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {selectedBase}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Image Zoom / Rotate / Reset Controls */}
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Zoom out"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-stone-500 w-9 text-center">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Zoom in"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-stone-200 mx-1" />
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  aria-label="Rotate image"
                  title="Rotate 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleFitReset}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-[10px] font-bold"
                  aria-label="Reset image"
                  title="Reset image"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Photo Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase flex items-center justify-between">
                <span>Upload Your Photo</span>
                {photoPreview !== product.image && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(product.image);
                      setZoom(1);
                      setRotation(0);
                    }}
                    className="text-[10px] text-rose-600 hover:underline cursor-pointer lowercase"
                  >
                    reset photo
                  </button>
                )}
              </label>

              <label className="border-2 border-dashed border-stone-300 hover:border-[#0E4A93] bg-stone-50 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors">
                <UploadCloud className="w-6 h-6 text-[#0E4A93]" />
                <span className="text-xs font-semibold text-stone-700">Click to upload from PC or laptop</span>
                <span className="text-[10px] text-stone-400">JPG, PNG, WEBP (Up to 40MB)</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {uploadError && (
                <div className="text-[11px] text-rose-600 font-semibold">{uploadError}</div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* ACRYLIC SPECIFIC CONTROLS (Rendered when category = acrylic) */}
          {/* ========================================================= */}
          {isAcrylic ? (
            <div className="space-y-4 pt-2 border-t border-stone-100 text-xs">
              
              {/* 1. SELECT STYLE */}
              {product.availableStyles && product.availableStyles.length > 0 && (
                <div>
                  <label className="block font-bold text-stone-800 uppercase text-[11px] mb-1.5">
                    Select Style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableStyles.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStyle(st)}
                        className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                          selectedStyle === st
                            ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. SELECT THICKNESS */}
              {(isAcrylic || (product.availableThicknesses && product.availableThicknesses.length > 0)) && (
                <div>
                  <label className="block font-bold text-stone-800 uppercase text-[11px] mb-1.5 flex items-center justify-between">
                    <span>Select Thickness</span>
                    <span className="text-stone-500 font-normal">
                      {isAcrylic
                        ? (selectedThickness === '8mm' ? 'Museum Grade 8mm Optical Cast' : selectedThickness === '6mm' ? 'Architectural 6mm Acrylic' : selectedThickness === '5mm' ? 'Standard 5mm Studio Acrylic' : 'Lightweight 3mm Acrylic')
                        : 'Pine Stretcher Profile'}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(isAcrylic ? ['3mm', '5mm', '6mm', '8mm'] : product.availableThicknesses || []).map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setSelectedThickness(th)}
                        className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer text-xs ${
                          selectedThickness.toLowerCase() === th.toLowerCase()
                            ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {th.toUpperCase()} {th === '8mm' && '(Museum Quality)'} {th === '5mm' && '(Recommended)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SELECT SIZE */}
              <div>
                <label className="block font-bold text-stone-800 uppercase text-[11px] mb-1.5">
                  Select Dimensions (Inches)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {(product.availableSizes || product.sizes).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-2 rounded-lg font-semibold border transition-all text-center text-xs cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. SELECT BASE */}
              {product.availableBases && product.availableBases.length > 0 && (
                <div>
                  <label className="block font-bold text-stone-800 uppercase text-[11px] mb-1.5">
                    Select Base / Stand
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableBases.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBase(b)}
                        className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                          selectedBase === b
                            ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SELECT PAPER */}
              {product.availablePapers && product.availablePapers.length > 0 && (
                <div>
                  <label className="block font-bold text-stone-800 uppercase text-[11px] mb-1.5">
                    Select Paper Substrate
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availablePapers.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPaper(p)}
                        className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                          selectedPaper === p
                            ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Standard Non-Acrylic Options */
            <div className="space-y-4 pt-2 border-t border-stone-100">
              {/* Size Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  Select Dimensions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center ${
                        selectedSize === s
                          ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                  Select Framing / Finish
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.finishes.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFinish(f)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all text-center ${
                        selectedFinish === f
                          ? 'bg-[#0E4A93] text-white border-[#0E4A93] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Personalized Text */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5 flex items-center justify-between">
              <span>Personalized Text / Engraving (Optional)</span>
              {customText && (
                <span className="flex items-center gap-1 normal-case">
                  <button
                    type="button"
                    onClick={() => setTextPosition('top')}
                    className={`p-1 rounded border transition-colors cursor-pointer ${textPosition === 'top' ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
                    aria-label="Place text at top"
                    title="Place text at top"
                  >
                    <AlignStartVertical className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextPosition('center')}
                    className={`p-1 rounded border transition-colors cursor-pointer ${textPosition === 'center' ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
                    aria-label="Place text at center"
                    title="Place text at center"
                  >
                    <AlignCenterVertical className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextPosition('bottom')}
                    className={`p-1 rounded border transition-colors cursor-pointer ${textPosition === 'bottom' ? 'bg-[#0E4A93] text-white border-[#0E4A93]' : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'}`}
                    aria-label="Place text at bottom"
                    title="Place text at bottom"
                  >
                    <AlignEndVertical className="w-3 h-3" />
                  </button>
                </span>
              )}
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Names, Date, Mantra, Heartfelt Message"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#0E4A93]"
            />
            {customText && (
              <p className="text-[10px] text-stone-400 mt-1">Shown live in the preview above — use the icons to choose where it appears.</p>
            )}
          </div>

        </div>

        {/* Bottom Bar Price & Confirmation */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">Configured Total Price</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900">
              ₹{calculatePrice().toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-[#0E4A93] hover:bg-[#09356A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Confirm &amp; Add to Cart</span>
          </button>
        </div>

      </div>
    </div>
  );
};
