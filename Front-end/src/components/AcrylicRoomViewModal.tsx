import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Upload,
  RotateCcw,
  Eye,
  Move
} from 'lucide-react';

export type BuiltInRoomPreset = 'office' | 'living';

export type RoomPreset = {
  id: BuiltInRoomPreset;
  name: string;
  image: string;
  naturalAspect: number;
  wallBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  defaultPosition: {
    x: number;
    y: number;
  };
};

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
  productId?: string;
  productName?: string;
  shapeId?: string;
  shapeName?: string;
  widthInches?: number;
  heightInches?: number;
  initialRoomState?: RoomPlacementState;
  onRoomStateChange?: (state: RoomPlacementState) => void;
  renderProduct: (isRoomView: boolean) => React.ReactNode;
}

export const PRESET_ROOMS: RoomPreset[] = [
  {
    id: 'office',
    name: 'OFFICE',
    image: '/assets/acrylic/acrylic-corporate-office.jpg',
    naturalAspect: 800 / 560,
    // Left dark-blue office wall above the wooden credenza and below the recessed ceiling
    wallBounds: {
      minX: 0.03,
      maxX: 0.41,
      minY: 0.18,
      maxY: 0.485
    },
    defaultPosition: {
      x: 0.22,
      y: 0.33
    }
  },
  {
    id: 'living',
    name: 'HOME / LIVING ROOM',
    image: '/assets/acrylic/acrylic-panel-living.jpg',
    naturalAspect: 800 / 600,
    // Main open living room wall above the sofa and left of the indoor plants/windows
    wallBounds: {
      minX: 0.08,
      maxX: 0.77,
      minY: 0.04,
      maxY: 0.53
    },
    defaultPosition: {
      x: 0.46,
      y: 0.18
    }
  }
];

const CUSTOM_ROOM_BOUNDS = {
  minX: 0.10,
  maxX: 0.90,
  minY: 0.10,
  maxY: 0.68,
  defaultPosition: {
    x: 0.50,
    y: 0.34
  }
};

export const AcrylicRoomViewModal: React.FC<AcrylicRoomViewModalProps> = ({
  isOpen,
  onClose,
  productDimensionLabel,
  productId = 'acrylic-print',
  productName = 'Acrylic Print',
  shapeId = 'shape-square',
  shapeName = 'Square',
  widthInches = 12,
  heightInches = 12,
  initialRoomState,
  onRoomStateChange,
  renderProduct
}) => {
  const [roomPreset, setRoomPreset] = useState<BuiltInRoomPreset>(
    initialRoomState?.roomPreset || 'office'
  );
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(
    initialRoomState?.customRoomUrl || null
  );
  const [customImgAspect, setCustomImgAspect] = useState<number>(4 / 3);

  const currentPreset = useMemo(
    () => PRESET_ROOMS.find((r) => r.id === roomPreset) || PRESET_ROOMS[0],
    [roomPreset]
  );

  // Normalized [0..1] center position of the product within the room image
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (
      initialRoomState &&
      initialRoomState.productRoomX > 0.02 &&
      initialRoomState.productRoomX < 0.98 &&
      initialRoomState.productRoomY > 0.02 &&
      initialRoomState.productRoomY < 0.98
    ) {
      return {
        x: initialRoomState.productRoomX,
        y: initialRoomState.productRoomY
      };
    }
    return currentPreset.defaultPosition;
  });

  // Track the outer viewport container size so we can fit the room image with its exact aspect ratio
  const outerStageRef = useRef<HTMLDivElement>(null);
  const roomBoxRef = useRef<HTMLDivElement>(null);
  const roomFileInputRef = useRef<HTMLInputElement>(null);
  const [outerSize, setOuterSize] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 720
  });

  useEffect(() => {
    if (!isOpen) return;
    const el = outerStageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setOuterSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isOpen]);

  const activeAspect = customRoomUrl ? customImgAspect : currentPreset.naturalAspect;

  // Compute exact rendered room image box dimensions that fit inside outerStage
  const roomBoxSize = useMemo(() => {
    const availW = Math.max(320, outerSize.width - 24);
    const availH = Math.max(240, outerSize.height - 24);
    let w = availW;
    let h = w / activeAspect;
    if (h > availH) {
      h = availH;
      w = h * activeAspect;
    }
    return {
      width: Math.round(w),
      height: Math.round(h)
    };
  }, [outerSize.width, outerSize.height, activeAspect]);

  const activeWallBounds = useMemo(() => {
    if (customRoomUrl) {
      return {
        minX: CUSTOM_ROOM_BOUNDS.minX,
        maxX: CUSTOM_ROOM_BOUNDS.maxX,
        minY: CUSTOM_ROOM_BOUNDS.minY,
        maxY: CUSTOM_ROOM_BOUNDS.maxY
      };
    }
    return currentPreset.wallBounds;
  }, [customRoomUrl, currentPreset]);

  const activeDefaultPos = useMemo(() => {
    if (customRoomUrl) {
      return CUSTOM_ROOM_BOUNDS.defaultPosition;
    }
    return currentPreset.defaultPosition;
  }, [customRoomUrl, currentPreset]);

  // Compute locked product width & height in pixels based on selectedProduct + selectedShape + selectedSize
  const productPixelSize = useMemo(() => {
    const isOneToOneShape =
      shapeId === 'shape-square' ||
      shapeId === 'shape-circle' ||
      shapeId === 'shape-heart' ||
      shapeId === 'shape-hexagon' ||
      ['square', 'circle', 'heart', 'hexagon'].includes(shapeName.toLowerCase());

    let effW = Math.max(4, Number(widthInches) || 12);
    let effH = Math.max(4, Number(heightInches) || 12);

    if (isOneToOneShape) {
      const side = Math.max(effW, effH);
      effW = side;
      effH = side;
    } else if (
      shapeId === 'shape-landscape' ||
      shapeId === 'shape-oval' ||
      ['landscape', 'oval'].includes(shapeName.toLowerCase())
    ) {
      if (effW < effH) {
        const tmp = effW;
        effW = effH;
        effH = tmp;
      } else if (effW === effH) {
        effW = Math.round(effH * 1.4);
      }
    } else if (
      shapeId === 'shape-portrait' ||
      shapeName.toLowerCase() === 'portrait'
    ) {
      if (effH < effW) {
        const tmp = effW;
        effW = effH;
        effH = tmp;
      } else if (effH === effW) {
        effH = Math.round(effW * 1.35);
      }
    }

    // Split panel products span wider horizontally across multiple panels
    const isSplitProduct =
      productId === 'acrylic-split' || productId === 'acrylic-split-panel';
    const maxInches = Math.max(effW, effH) * (isSplitProduct ? 1.08 : 1);

    // Room-scale mapping:
    // - Small sizes (4x4, 8x8, 8x10, 12x12) -> compact wall piece (~9% - 13% of room width)
    // - Medium sizes (12x18, 16x20, 18x24) -> medium wall piece (~14% - 18% of room width)
    // - Large sizes (24x36, 30x40) -> larger wall piece (~20% - 24% of room width), fitting cleanly on the wall
    const normalizedMaxFraction = Math.min(
      0.24,
      Math.max(0.09, 0.075 + (maxInches - 4) * 0.0042)
    );

    const targetMaxPx = roomBoxSize.width * normalizedMaxFraction;
    const aspect = effW / Math.max(1, effH);

    let widthPx = aspect >= 1 ? targetMaxPx : targetMaxPx * aspect;
    let heightPx = aspect >= 1 ? targetMaxPx / aspect : targetMaxPx;

    // Ensure the product always fits cleanly inside the active wall bounds with draggable margin
    const wallWidthPx =
      (activeWallBounds.maxX - activeWallBounds.minX) * roomBoxSize.width;
    const wallHeightPx =
      (activeWallBounds.maxY - activeWallBounds.minY) * roomBoxSize.height;

    const maxAllowedW = wallWidthPx * 0.72;
    const maxAllowedH = wallHeightPx * 0.72;

    if (widthPx > maxAllowedW) {
      const ratio = maxAllowedW / widthPx;
      widthPx *= ratio;
      heightPx *= ratio;
    }
    if (heightPx > maxAllowedH) {
      const ratio = maxAllowedH / heightPx;
      widthPx *= ratio;
      heightPx *= ratio;
    }

    return {
      width: Math.max(48, Math.round(widthPx)),
      height: Math.max(48, Math.round(heightPx))
    };
  }, [
    shapeId,
    shapeName,
    widthInches,
    heightInches,
    productId,
    roomBoxSize.width,
    roomBoxSize.height,
    activeWallBounds
  ]);

  // Clamp normalized center (x, y) so the entire product stays inside activeWallBounds and room bounds
  const clampPosition = useCallback(
    (rawX: number, rawY: number) => {
      const halfW =
        roomBoxSize.width > 0
          ? productPixelSize.width / 2 / roomBoxSize.width
          : 0.06;
      const halfH =
        roomBoxSize.height > 0
          ? productPixelSize.height / 2 / roomBoxSize.height
          : 0.06;

      const minX = activeWallBounds.minX + halfW;
      const maxX = activeWallBounds.maxX - halfW;
      const minY = activeWallBounds.minY + halfH;
      const maxY = activeWallBounds.maxY - halfH;

      const clampedX =
        minX <= maxX
          ? Math.max(minX, Math.min(maxX, rawX))
          : (activeWallBounds.minX + activeWallBounds.maxX) / 2;

      const clampedY =
        minY <= maxY
          ? Math.max(minY, Math.min(maxY, rawY))
          : (activeWallBounds.minY + activeWallBounds.maxY) / 2;

      return {
        x: Number(clampedX.toFixed(4)),
        y: Number(clampedY.toFixed(4))
      };
    },
    [roomBoxSize.width, roomBoxSize.height, productPixelSize.width, productPixelSize.height, activeWallBounds]
  );

  // Keep current position clamped whenever room preset, product size, or stage dimensions change
  const clampedPosition = useMemo(
    () => clampPosition(position.x, position.y),
    [clampPosition, position.x, position.y]
  );

  const lastEmittedRoomRef = useRef<string>('');
  useEffect(() => {
    if (!isOpen || !onRoomStateChange) return;
    const payload: RoomPlacementState = {
      roomPreset,
      customRoomUrl,
      productRoomX: clampedPosition.x,
      productRoomY: clampedPosition.y
    };
    const serialized = JSON.stringify(payload);
    if (lastEmittedRoomRef.current !== serialized) {
      lastEmittedRoomRef.current = serialized;
      onRoomStateChange(payload);
    }
  }, [isOpen, roomPreset, customRoomUrl, clampedPosition.x, clampedPosition.y, onRoomStateChange]);

  // Dragging states
  const [isDraggingProduct, setIsDraggingProduct] = useState<boolean>(false);
  const dragProductRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    boxRect: DOMRect;
  } | null>(null);

  if (!isOpen) return null;

  const activeRoomBg = customRoomUrl || currentPreset.image;

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
        const probe = new Image();
        probe.onload = () => {
          if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
            setCustomImgAspect(probe.naturalWidth / probe.naturalHeight);
          }
        };
        probe.src = result;
        setCustomRoomUrl(result);
        setPosition(CUSTOM_ROOM_BOUNDS.defaultPosition);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset Product Position to default wall position for active room
  const handleResetPosition = () => {
    setPosition(activeDefaultPos);
  };

  // Product Drag Handlers on Wall (Mouse & Touch via Pointer Events)
  const handleProductPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingProduct(true);

    const boxRect = roomBoxRef.current?.getBoundingClientRect();
    if (!boxRect) return;

    dragProductRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: clampedPosition.x,
      initY: clampedPosition.y,
      boxRect
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleProductPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingProduct || !dragProductRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const { startX, startY, initX, initY, boxRect } = dragProductRef.current;
    const deltaXNorm = (e.clientX - startX) / Math.max(1, boxRect.width);
    const deltaYNorm = (e.clientY - startY) / Math.max(1, boxRect.height);

    const nextClamped = clampPosition(initX + deltaXNorm, initY + deltaYNorm);
    setPosition(nextClamped);
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
              Drag the product within the wall area (true-to-scale fixed size preview)
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
                  setPosition(r.defaultPosition);
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
            title="Reset product position on wall"
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
        ref={outerStageRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-stone-950 p-2 sm:p-3"
      >
        {/* Aspect-Locked Room Image Wrapper so normalized wall coordinates match 100% */}
        <div
          ref={roomBoxRef}
          style={{
            width: `${roomBoxSize.width}px`,
            height: `${roomBoxSize.height}px`
          }}
          className="relative overflow-hidden rounded-xl shadow-2xl border border-stone-800/80 bg-stone-900"
        >
          <img
            src={activeRoomBg}
            alt={customRoomUrl ? 'Uploaded Room' : currentPreset.name}
            draggable={false}
            className="w-full h-full object-fill select-none pointer-events-none"
          />

          {/* Subtle ambient lighting vignette */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Subtle wall boundary guide while actively dragging */}
          {isDraggingProduct && (
            <div
              style={{
                position: 'absolute',
                left: `${activeWallBounds.minX * 100}%`,
                top: `${activeWallBounds.minY * 100}%`,
                width: `${(activeWallBounds.maxX - activeWallBounds.minX) * 100}%`,
                height: `${(activeWallBounds.maxY - activeWallBounds.minY) * 100}%`
              }}
              className="border border-dashed border-white/45 bg-white/5 rounded-lg pointer-events-none z-10 transition-opacity"
            />
          )}

          {/* Fixed-Size Draggable Acrylic Product */}
          <div
            onPointerDown={handleProductPointerDown}
            onPointerMove={handleProductPointerMove}
            onPointerUp={handleProductPointerUp}
            onPointerCancel={handleProductPointerUp}
            style={{
              position: 'absolute',
              left: `${clampedPosition.x * 100}%`,
              top: `${clampedPosition.y * 100}%`,
              width: `${productPixelSize.width}px`,
              height: `${productPixelSize.height}px`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              filter:
                'drop-shadow(0 18px 24px rgba(0, 0, 0, 0.45)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.28))'
            }}
            className={`z-20 select-none flex items-center justify-center ${
              isDraggingProduct
                ? 'cursor-grabbing ring-2 ring-[#0E4A93] rounded-md'
                : 'cursor-grab hover:ring-2 hover:ring-[#0E4A93]/70 rounded-md'
            }`}
          >
            {renderProduct(true)}
          </div>
        </div>

        {/* Bottom Status Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-800 shadow-xl flex items-center gap-2.5 text-white text-xs pointer-events-none">
          <Move className="w-3.5 h-3.5 text-[#E8752A]" />
          <span className="font-semibold text-stone-200">
            Drag product on the wall • Locked scale ({productDimensionLabel})
          </span>
        </div>
      </div>
    </div>
  );
};
