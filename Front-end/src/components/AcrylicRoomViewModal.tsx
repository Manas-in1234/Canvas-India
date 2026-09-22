import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  RotateCcw,
  Eye,
  Compass
} from 'lucide-react';

export interface RoomPlacementState {
  roomPreset: 'living' | 'office' | 'bedroom' | 'lobby' | 'minimal';
  customRoomUrl: string | null;
  roomPanX: number;
  roomPanY: number;
  roomZoom: number;
  productRoomX: number;
  productRoomY: number;
  productRoomScale: number;
  productRoomRotate: number;
  wallPlacementMode: boolean;
  wallTiltY: number;
  wallTiltX: number;
}

interface AcrylicRoomViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productDimensionLabel: string;
  renderProduct: (isRoomView: boolean) => React.ReactNode;
}

const PRESET_ROOMS: { id: RoomPlacementState['roomPreset']; name: string; url: string; defaultY: number }[] = [
  { id: 'living', name: 'Living Room', url: '/assets/acrylic/acrylic-panel-living.jpg', defaultY: -16 },
  { id: 'office', name: 'Modern Office', url: '/assets/acrylic/acrylic-corporate-office.jpg', defaultY: -14 },
  { id: 'bedroom', name: 'Gallery Wall', url: '/assets/acrylic/acrylic-family-wall.jpg', defaultY: -18 },
  { id: 'lobby', name: 'Reception Lobby', url: '/assets/acrylic/acrylic-reception-lobby.jpg', defaultY: -15 },
  { id: 'minimal', name: 'Interior Wall', url: '/assets/acrylic/acrylic-abstract-room.jpg', defaultY: -12 }
];

export const AcrylicRoomViewModal: React.FC<AcrylicRoomViewModalProps> = ({
  isOpen,
  onClose,
  productDimensionLabel,
  renderProduct
}) => {
  const [roomPreset, setRoomPreset] = useState<RoomPlacementState['roomPreset']>('living');
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);

  // Room background adjustments
  const [roomPanX, setRoomPanX] = useState<number>(0);
  const [roomPanY, setRoomPanY] = useState<number>(0);
  const [roomZoom, setRoomZoom] = useState<number>(1);

  // Acrylic Product on Wall Coordinates
  const [productRoomX, setProductRoomX] = useState<number>(0);
  const [productRoomY, setProductRoomY] = useState<number>(-16);
  const [productRoomScale, setProductRoomScale] = useState<number>(0.85);
  const [productRoomRotate, setProductRoomRotate] = useState<number>(0);

  // Perspective Wall Placement
  const [wallPlacementMode, setWallPlacementMode] = useState<boolean>(false);
  const [wallTiltY, setWallTiltY] = useState<number>(0);
  const [wallTiltX, setWallTiltX] = useState<number>(0);

  // Dragging states
  const [isDraggingProduct, setIsDraggingProduct] = useState<boolean>(false);
  const dragProductRef = useRef<{ startX: number; startY: number; initX: number; initY: number; containerRect: DOMRect } | null>(null);

  const roomFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPreset = PRESET_ROOMS.find((r) => r.id === roomPreset) || PRESET_ROOMS[0];
  const activeRoomBg = customRoomUrl || currentPreset.url;

  // Custom Room Image Upload Handler
  const handleRoomImageUpload = (file: File | null) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('Room image exceeds 20MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCustomRoomUrl(result);
        setRoomPanX(0);
        setRoomPanY(0);
        setRoomZoom(1);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Product Position without deleting custom room image
  const handleResetProduct = () => {
    setProductRoomX(0);
    setProductRoomY(currentPreset.defaultY);
    setProductRoomScale(0.85);
    setProductRoomRotate(0);
    setWallTiltY(0);
    setWallTiltX(0);
  };

  // Reset Room (resets room image & pan/zoom)
  const handleResetRoom = () => {
    setRoomPreset('living');
    setRoomPanX(0);
    setRoomPanY(0);
    setRoomZoom(1);
  };

  // Remove custom room image (revert to preset)
  const handleRemoveCustomRoom = () => {
    setCustomRoomUrl(null);
    setRoomPanX(0);
    setRoomPanY(0);
    setRoomZoom(1);
  };

  // Product Drag Handlers on Wall
  const handleProductPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingProduct(true);

    const container = (e.currentTarget.parentElement as HTMLElement)?.getBoundingClientRect();
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

    const deltaXPercent = (deltaXPx / containerRect.width) * 100;
    const deltaYPercent = (deltaYPx / containerRect.height) * 100;

    const newX = Math.max(-46, Math.min(46, Number((initX + deltaXPercent).toFixed(1))));
    const newY = Math.max(-44, Math.min(44, Number((initY + deltaYPercent).toFixed(1))));

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
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900 select-none animate-in fade-in duration-200">
      {/* Hidden File Input for Custom Room Image */}
      <input
        ref={roomFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleRoomImageUpload(e.target.files[0]);
          }
        }}
      />

      {/* Top Header Bar */}
      <header className="h-14 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 px-4 flex items-center justify-between z-30 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0E4A93] flex items-center justify-center font-bold">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight flex items-center gap-2">
              <span>Realistic Room View</span>
              <span className="text-[10px] font-semibold bg-[#0E4A93] px-2 py-0.5 rounded-full text-white">
                {productDimensionLabel}
              </span>
            </h2>
            <p className="text-[11px] text-stone-400">Drag to position anywhere on the wall</p>
          </div>
        </div>

        {/* Room Presets + Add Room Image */}
        <div className="hidden md:flex items-center gap-1.5 bg-stone-800/80 p-1 rounded-xl border border-stone-700">
          {PRESET_ROOMS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRoomPreset(r.id);
                setCustomRoomUrl(null);
                setProductRoomY(r.defaultY);
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                !customRoomUrl && roomPreset === r.id
                  ? 'bg-[#0E4A93] text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
            >
              {r.name}
            </button>
          ))}

          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
              customRoomUrl
                ? 'bg-[#E8752A] text-white shadow-xs'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
            }`}
            title="Upload your own room photograph"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{customRoomUrl ? 'Custom Room Active' : '+ ADD ROOM IMAGE'}</span>
          </button>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-2">
          {customRoomUrl && (
            <button
              type="button"
              onClick={handleRemoveCustomRoom}
              className="text-xs font-bold text-stone-300 hover:text-red-400 bg-stone-800 hover:bg-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-700 transition-colors cursor-pointer"
              title="Remove custom uploaded room"
            >
              Remove Room Image
            </button>
          )}

          <button
            type="button"
            onClick={handleResetProduct}
            className="flex items-center gap-1 text-xs font-bold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-700 transition-colors cursor-pointer"
            title="Reset product position & scale"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Product</span>
          </button>

          <button
            type="button"
            onClick={() => setWallPlacementMode(!wallPlacementMode)}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
              wallPlacementMode
                ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
            }`}
            title="Toggle wall angle / 3D perspective"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wall Angle</span>
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

      {/* Main Room Canvas Workspace */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center"
        style={{
          backgroundColor: '#1E293B',
          backgroundImage: `url(${activeRoomBg})`,
          backgroundSize: `${roomZoom * 100}%`,
          backgroundPosition: `calc(50% + ${roomPanX}px) calc(50% + ${roomPanY}px)`,
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Layer: Room Dimming & Subtle Vignette */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Layer: Draggable Acrylic Product on the Wall */}
        <div
          onPointerDown={handleProductPointerDown}
          onPointerMove={handleProductPointerMove}
          onPointerUp={handleProductPointerUp}
          onPointerCancel={handleProductPointerUp}
          style={{
            position: 'absolute',
            left: `${50 + productRoomX}%`,
            top: `${50 + productRoomY}%`,
            transform: `translate(-50%, -50%) scale(${productRoomScale}) rotate(${productRoomRotate}deg) perspective(1000px) rotateY(${wallTiltY}deg) rotateX(${wallTiltX}deg)`,
            transformOrigin: 'center center',
            touchAction: 'none',
            filter: 'drop-shadow(0 28px 36px rgba(0, 0, 0, 0.45)) drop-shadow(0 12px 16px rgba(0, 0, 0, 0.3))',
            transition: isDraggingProduct ? 'none' : 'transform 0.1s ease-out'
          }}
          className={`z-20 max-w-md w-full select-none ${
            isDraggingProduct ? 'cursor-grabbing' : 'cursor-grab hover:ring-2 hover:ring-[#0E4A93]/60 rounded-xl'
          }`}
        >
          {renderProduct(true)}
        </div>

        {/* Mobile Room Selector Bar */}
        <div className="md:hidden absolute top-3 left-3 right-3 z-30 flex items-center gap-1 overflow-x-auto bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-800">
          {PRESET_ROOMS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRoomPreset(r.id);
                setCustomRoomUrl(null);
                setProductRoomY(r.defaultY);
              }}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors ${
                !customRoomUrl && roomPreset === r.id
                  ? 'bg-[#0E4A93] text-white'
                  : 'text-stone-300'
              }`}
            >
              {r.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className="px-2.5 py-1 text-[11px] font-bold bg-[#E8752A] text-white rounded-lg whitespace-nowrap"
          >
            + Upload Room
          </button>
        </div>

        {/* Floating Product Adjustment Controls Bar (Bottom) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-stone-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-800 shadow-2xl flex flex-wrap items-center gap-3 text-white">
          {/* Scale Product in Room */}
          <div className="flex items-center gap-1.5 bg-stone-800/80 px-2 py-1 rounded-xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Product Size</span>
            <button
              type="button"
              onClick={() => setProductRoomScale((prev) => Math.max(0.35, Number((prev - 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-lg bg-stone-700 hover:bg-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer"
              title="Scale smaller"
            >
              −
            </button>
            <span className="text-xs font-mono font-bold min-w-[36px] text-center">
              {productRoomScale.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setProductRoomScale((prev) => Math.min(2.0, Number((prev + 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-lg bg-stone-700 hover:bg-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer"
              title="Scale larger"
            >
              +
            </button>
          </div>

          {/* Rotate in Room */}
          <div className="flex items-center gap-1 bg-stone-800/80 px-2 py-1 rounded-xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Angle</span>
            <button
              type="button"
              onClick={() => setProductRoomRotate((prev) => prev - 5)}
              className="px-1.5 py-0.5 rounded bg-stone-700 hover:bg-stone-600 text-xs font-bold cursor-pointer"
              title="Rotate counter-clockwise"
            >
              -5°
            </button>
            <span className="text-xs font-mono font-bold min-w-[28px] text-center">
              {productRoomRotate}°
            </span>
            <button
              type="button"
              onClick={() => setProductRoomRotate((prev) => prev + 5)}
              className="px-1.5 py-0.5 rounded bg-stone-700 hover:bg-stone-600 text-xs font-bold cursor-pointer"
              title="Rotate clockwise"
            >
              +5°
            </button>
          </div>

          {/* Wall Perspective Angles (When Wall Mode is active) */}
          {wallPlacementMode && (
            <div className="flex items-center gap-2 bg-stone-800/80 px-2.5 py-1 rounded-xl border border-[#0E4A93]/40">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Tilt Y</span>
              <input
                type="range"
                min={-30}
                max={30}
                value={wallTiltY}
                onChange={(e) => setWallTiltY(Number(e.target.value))}
                className="w-16 accent-[#0E4A93] h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                title="Perspective tilt Y (side wall angle)"
              />
              <span className="text-[10px] font-mono w-6 text-right">{wallTiltY}°</span>
            </div>
          )}

          {/* Room Background Zoom Controls */}
          <div className="flex items-center gap-1 bg-stone-800/80 px-2 py-1 rounded-xl">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Room Zoom</span>
            <button
              type="button"
              onClick={() => setRoomZoom((prev) => Math.max(1, Number((prev - 0.15).toFixed(2))))}
              className="w-5 h-5 rounded bg-stone-700 hover:bg-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer"
              title="Zoom out room"
            >
              −
            </button>
            <span className="text-xs font-mono font-bold min-w-[32px] text-center">
              {roomZoom.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setRoomZoom((prev) => Math.min(2.5, Number((prev + 0.15).toFixed(2))))}
              className="w-5 h-5 rounded bg-stone-700 hover:bg-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer"
              title="Zoom in room"
            >
              +
            </button>
          </div>

          {/* Reset Room position */}
          <button
            type="button"
            onClick={handleResetRoom}
            className="text-[11px] font-bold text-stone-400 hover:text-white hover:bg-stone-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            title="Reset room background zoom & pan"
          >
            Reset Room
          </button>
        </div>
      </div>
    </div>
  );
};
