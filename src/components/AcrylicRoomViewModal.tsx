import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  RotateCcw,
  Eye,
  Move
} from 'lucide-react';

export type BuiltInRoomPreset = 'office' | 'living';

export interface RoomPlacementState {
  roomPreset: BuiltInRoomPreset;
  customRoomUrl: string | null;
  productRoomX: number;
  productRoomY: number;
}

interface AcrylicRoomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productDimensionLabel: string;
  productName?: string;
  shapeName?: string;
  widthInches?: number;
  heightInches?: number;
  renderProduct: (isRoomView: boolean) => React.ReactNode;
}

const PRESET_ROOMS: { id: BuiltInRoomPreset; name: string; url: string; defaultY: number }[] = [
  { id: 'office', name: 'OFFICE', url: '/assets/acrylic/acrylic-corporate-office.jpg', defaultY: -14 },
  { id: 'living', name: 'HOME / LIVING ROOM', url: '/assets/acrylic/acrylic-panel-living.jpg', defaultY: -16 }
];

export const AcrylicRoomViewModal: React.FC<AcrylicRoomViewModalProps> = ({
  isOpen,
  onClose,
  productDimensionLabel,
  productName = 'Acrylic Print',
  shapeName = 'Square',
  widthInches = 12,
  heightInches = 12,
  renderProduct
}) => {
  const [roomPreset, setRoomPreset] = useState<BuiltInRoomPreset>('office');
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);

  // Acrylic Product on Wall X/Y Coordinates (percentage offset from center)
  const [productRoomX, setProductRoomX] = useState<number>(0);
  const [productRoomY, setProductRoomY] = useState<number>(-14);

  // Dragging states
  const [isDraggingProduct, setIsDraggingProduct] = useState<boolean>(false);
  const dragProductRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    containerRect: DOMRect;
  } | null>(null);

  const roomStageRef = useRef<HTMLDivElement>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPreset = PRESET_ROOMS.find((r) => r.id === roomPreset) || PRESET_ROOMS[0];
  const activeRoomBg = customRoomUrl || currentPreset.url;

  // Fixed product display width in pixels based on selected size configuration (no free scaling)
  const maxDim = Math.max(1, widthInches, heightInches);
  const fixedDisplayMaxPx = Math.round(Math.min(380, Math.max(150, 130 + maxDim * 5.5)));

  // Custom Room Image Upload Handler (JPG, JPEG, PNG, WEBP)
  const handleRoomImageUpload = (file: File | null) => {
    if (!file) return;
    const isValidType =
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase()) ||
      /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!isValidType) {
      alert('Please upload a valid JPG, JPEG, PNG, or WEBP room image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('Room image exceeds 20MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCustomRoomUrl(result);
        setProductRoomX(0);
        setProductRoomY(-10);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Product Position to default center wall position
  const handleResetPosition = () => {
    setProductRoomX(0);
    setProductRoomY(customRoomUrl ? -10 : currentPreset.defaultY);
  };

  // Product Drag Handlers on Wall (Mouse & Touch via Pointer Events)
  const handleProductPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingProduct(true);

    const container = roomStageRef.current?.getBoundingClientRect() ||
      (e.currentTarget.parentElement as HTMLElement)?.getBoundingClientRect();
    if (!container) return;

    dragProductRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: productRoomX,
      initY: productRoomY,
      containerRect: container
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleProductPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingProduct || !dragProductRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const { startX, startY, initX, initY, containerRect } = dragProductRef.current;
    const deltaXPx = e.clientX - startX;
    const deltaYPx = e.clientY - startY;

    const deltaXPercent = (deltaXPx / Math.max(1, containerRect.width)) * 100;
    const deltaYPercent = (deltaYPx / Math.max(1, containerRect.height)) * 100;

    // Clamp within room boundaries so the product never disappears outside the room
    const newX = Math.max(-38, Math.min(38, Number((initX + deltaXPercent).toFixed(2))));
    const newY = Math.max(-36, Math.min(36, Number((initY + deltaYPercent).toFixed(2))));

    setProductRoomX(newX);
    setProductRoomY(newY);
  };

  const handleProductPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingProduct) {
      setIsDraggingProduct(false);
      dragProductRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-950 select-none animate-in fade-in duration-200">
      {/* Hidden File Input for Upload Room Image */}
      <input
        ref={roomFileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleRoomImageUpload(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Top Header Bar */}
      <header className="min-h-14 py-2 bg-stone-900 border-b border-stone-800 px-4 flex flex-wrap items-center justify-between gap-2 z-30 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0E4A93] flex items-center justify-center font-bold shrink-0">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight flex items-center gap-2 flex-wrap">
              <span>Room View</span>
              <span className="text-[10px] font-semibold bg-[#0E4A93] px-2 py-0.5 rounded-full text-white">
                {productName} • {shapeName} • {productDimensionLabel}
              </span>
            </h2>
            <p className="text-[11px] text-stone-400">
              Drag the product to position it anywhere in the room (fixed size preview)
            </p>
          </div>
        </div>

        {/* Room Selector: ONLY OFFICE, HOME / LIVING ROOM, and Upload Room Image */}
        <div className="flex items-center gap-1.5 bg-stone-800/90 p-1 rounded-xl border border-stone-700">
          {PRESET_ROOMS.map((r) => {
            const isSelected = !customRoomUrl && roomPreset === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRoomPreset(r.id);
                  setCustomRoomUrl(null);
                  setProductRoomX(0);
                  setProductRoomY(r.defaultY);
                }}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-colors cursor-pointer uppercase tracking-wide ${
                  isSelected
                    ? 'bg-[#0E4A93] text-white shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                {r.name}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              customRoomUrl
                ? 'bg-[#E8752A] text-white shadow-xs'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-100'
            }`}
            title="Upload your own room photograph (JPG, JPEG, PNG, WEBP)"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Room Image</span>
          </button>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetPosition}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg border border-stone-700 transition-colors cursor-pointer"
            title="Reset product position to center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Position</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Close Room View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Room Canvas Stage */}
      <div
        ref={roomStageRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-stone-950 p-2 sm:p-4"
      >
        {/* Room Photograph Container — preserves aspect ratio without cropping */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
          <img
            src={activeRoomBg}
            alt={customRoomUrl ? 'Uploaded Room' : currentPreset.name}
            draggable={false}
            className={`w-full h-full select-none pointer-events-none ${
              customRoomUrl ? 'object-contain bg-stone-900' : 'object-cover'
            }`}
          />

          {/* Subtle ambient lighting vignette */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Fixed-Size Draggable Acrylic Product */}
          <div
            onPointerDown={handleProductPointerDown}
            onPointerMove={handleProductPointerMove}
            onPointerUp={handleProductPointerUp}
            onPointerCancel={handleProductPointerUp}
            style={{
              position: 'absolute',
              left: `${50 + productRoomX}%`,
              top: `${50 + productRoomY}%`,
              width: `${fixedDisplayMaxPx}px`,
              maxWidth: '42%',
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              filter:
                'drop-shadow(0 24px 32px rgba(0, 0, 0, 0.42)) drop-shadow(0 10px 14px rgba(0, 0, 0, 0.28))'
            }}
            className={`z-20 select-none ${
              isDraggingProduct
                ? 'cursor-grabbing ring-2 ring-[#0E4A93] rounded-xl'
                : 'cursor-grab hover:ring-2 hover:ring-[#0E4A93]/70 rounded-xl'
            }`}
          >
            {renderProduct(true)}
          </div>
        </div>

        {/* Bottom Status Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-800 shadow-xl flex items-center gap-2.5 text-white text-xs pointer-events-none">
          <Move className="w-3.5 h-3.5 text-[#E8752A]" />
          <span className="font-semibold text-stone-200">
            Drag product to position • Fixed size ({productDimensionLabel})
          </span>
        </div>
      </div>
    </div>
  );
};
