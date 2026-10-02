import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Save,
  Type,
  Smile,
  Eye,
  Box,
  Trash2
} from 'lucide-react';

// ============================================================================
// 1. SHARED CUSTOMIZER HEADER
// ============================================================================

export interface CustomizerHeaderProps {
  productName?: string;
  backToPath?: string;
  backLink?: string;
  backToLabel?: string;
  backLabel?: string;
  totalPrice: number;
  onToggleMenu?: () => void;
  onMenuClick?: () => void;
  onAddToCart: () => void;
  onClickPrice?: () => void;
  onPriceClick?: () => void;
  pricePopoverContent?: React.ReactNode;
}

export const CustomizerHeader: React.FC<CustomizerHeaderProps> = ({
  backToPath,
  backLink,
  backToLabel,
  backLabel,
  totalPrice,
  onToggleMenu,
  onMenuClick,
  onAddToCart,
  onClickPrice,
  onPriceClick,
  pricePopoverContent
}) => {
  const resolvedBackPath = backToPath || backLink || '/';
  const resolvedBackLabel = backToLabel || backLabel || 'Back';
  const handleMenu = onToggleMenu || onMenuClick;
  const handlePrice = onClickPrice || onPriceClick;

  return (
    <header className="h-14 bg-[#0E4A93] text-white flex items-center justify-between px-3 sm:px-6 shadow-md z-30 shrink-0">
      {/* LEFT: [MENU] [BACK TO CANVAS / ACRYLIC] | [CANVAS INDIA LOGO] */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleMenu}
          className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
          title="Navigation Menu"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to={resolvedBackPath}
          className="flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-md transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{resolvedBackLabel}</span>
        </Link>

        <div className="h-5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
          title="Canvas India"
        >
          <img
            src="/canvas-india-official-logo.png"
            alt="Canvas India"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain block select-none"
          />
        </Link>
      </div>

      {/* RIGHT: Price Display + Add to Cart Button */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            onClick={handlePrice}
            className={`text-right block ${handlePrice ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
            title={handlePrice ? 'Click to view price breakdown' : undefined}
          >
            <div className="text-[10px] text-white/70 uppercase font-semibold">Total Price</div>
            <div className="text-lg font-black text-white leading-tight">
              ₹{totalPrice.toLocaleString('en-IN')}
            </div>
          </div>
          {pricePopoverContent}
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex items-center gap-2 bg-[#E8752A] hover:bg-[#d4651e] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-lg shadow-md transition-all transform active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </header>
  );
};

// ============================================================================
// 2. SHARED LEFT NAVIGATION SIDEBAR
// ============================================================================

export interface CustomizerSidebarItem<T extends string = string> {
  id: T;
  label: string;
  icon: React.ElementType;
}

export interface CustomizerSidebarProps<T extends string = string> {
  items: CustomizerSidebarItem<T>[];
  activeTab: T;
  onSelectTab: (tab: T) => void;
}

export function CustomizerSidebar<T extends string = string>({
  items,
  activeTab,
  onSelectTab
}: CustomizerSidebarProps<T>) {
  return (
    <aside
      aria-label="Customizer Tools"
      className="bg-[#1E293B] text-stone-300 w-full md:w-20 md:min-w-[80px] shrink-0 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-2 z-20 border-b md:border-b-0 md:border-r border-slate-700 overflow-x-auto md:overflow-y-auto no-scrollbar"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-3 px-1 text-center transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-[#0E4A93] shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 stroke-[1.8] ${isActive ? 'text-[#0E4A93]' : 'text-slate-300'}`} />
            <span className="text-[9px] leading-tight tracking-tight uppercase px-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

// ============================================================================
// 3. SHARED SECONDARY CONFIGURATION PANEL & SECTION HEADER
// ============================================================================

export interface CustomizerSectionHeaderProps {
  title: string;
  metaText?: string;
}

export const CustomizerSectionHeader: React.FC<CustomizerSectionHeaderProps> = ({
  title,
  metaText
}) => {
  return (
    <div className="p-3.5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
      <h2 className="text-xs font-black tracking-wider text-stone-800 uppercase flex items-center gap-1.5">
        <span>{title}</span>
      </h2>
      {metaText && (
        <span className="text-[11px] font-semibold text-stone-500">{metaText}</span>
      )}
    </div>
  );
};

export interface CustomizerPanelProps {
  title?: string;
  metaText?: string;
  badge?: string;
  children: React.ReactNode;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  title,
  metaText,
  badge,
  children
}) => {
  const resolvedMeta = metaText || badge;
  return (
    <section className="w-full md:w-[440px] lg:w-[480px] bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col z-10 shrink-0 h-72 md:h-full min-h-0 overflow-hidden shadow-sm">
      {title && <CustomizerSectionHeader title={title} metaText={resolvedMeta} />}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
        {children}
      </div>
    </section>
  );
};

// ============================================================================
// 4. SHARED OPTION CARD (Matches Acrylic Option Cards)
// ============================================================================

export interface CustomizerOptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  priceText?: string;
  badgeText?: string;
  badge?: string;
  previewHeightClass?: string;
  previewBgClass?: string;
  preview?: React.ReactNode;
  children?: React.ReactNode;
}

export const CustomizerOptionCard: React.FC<CustomizerOptionCardProps> = ({
  selected,
  onClick,
  title,
  subtitle,
  priceText,
  badgeText,
  badge,
  previewHeightClass = 'h-16',
  previewBgClass = 'bg-stone-50',
  preview,
  children
}) => {
  const resolvedBadge = badgeText || badge;
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
        selected
          ? 'border-[#0E4A93] bg-blue-50/20 shadow-sm ring-1 ring-[#0E4A93]/20'
          : 'border-stone-200 hover:border-stone-400 bg-white'
      }`}
    >
      {resolvedBadge && (
        <span className="absolute top-1.5 left-1.5 text-[8px] font-black uppercase bg-[#E8752A] text-white px-1.5 py-0.5 rounded shadow-2xs z-10">
          {resolvedBadge}
        </span>
      )}

      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0E4A93] text-white rounded-full flex items-center justify-center shadow-sm z-10">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      <div
        className={`w-full ${previewHeightClass} ${previewBgClass} flex items-center justify-center p-2 overflow-hidden relative`}
      >
        {preview ?? children}
      </div>

      <div className="p-1.5 bg-white border-t border-stone-100 text-center">
        <div className="text-xs font-bold text-stone-900 leading-tight truncate">
          {title}
        </div>
        {priceText !== undefined && (
          <div className="text-[10px] font-semibold text-stone-500 mt-0.5">
            {priceText}
          </div>
        )}
        {subtitle !== undefined && (
          <div className="text-[10px] font-medium text-stone-500 mt-0.5 truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 5. SHARED WORKSPACE TOP TOOLBAR (SAVE, ADD TEXT, ADD CLIPART, ROOM, 3D, 360)
// ============================================================================

export interface CustomizerToolbarExtraAction {
  id?: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
}

export interface CustomizerTopToolbarProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: () => void;
  onRotate90?: () => void;
  onReset?: () => void;
  hideImageControls?: boolean;
  productSummary?: {
    productName: string;
    shapeName: string;
    dimensionLabel: string;
    hardwareName: string;
  };
  summaryBadgeText?: string;
  onSave: () => void;
  onToggleText: () => void;
  isTextActive?: boolean;
  showTextPopover?: boolean;
  onToggleClipart: () => void;
  isClipartActive?: boolean;
  showClipartPopover?: boolean;
  onOpenRoomView?: () => void;
  onToggleRoomView?: () => void;
  isRoomViewActive?: boolean;
  isRoomViewDisabled?: boolean;
  onOpen3DView?: () => void;
  is3DViewActive?: boolean;
  onOpen360View?: () => void;
  is360ViewActive?: boolean;
  extraActions?: CustomizerToolbarExtraAction[];
  canDeleteSelectedItem?: boolean;
  hasSelectedItem?: boolean;
  onDeleteSelectedItem?: () => void;
}

export const CustomizerTopToolbar: React.FC<CustomizerTopToolbarProps> = ({
  onSave,
  onToggleText,
  isTextActive,
  showTextPopover,
  onToggleClipart,
  isClipartActive,
  showClipartPopover,
  onOpenRoomView,
  onToggleRoomView,
  isRoomViewActive = false,
  isRoomViewDisabled = false,
  onOpen3DView,
  is3DViewActive = false,
  onOpen360View,
  is360ViewActive = false,
  extraActions = [],
  canDeleteSelectedItem,
  hasSelectedItem,
  onDeleteSelectedItem
}) => {
  const textActive = Boolean(isTextActive ?? showTextPopover);
  const clipartActive = Boolean(isClipartActive ?? showClipartPopover);
  const handleRoomView = onOpenRoomView || onToggleRoomView;
  const showDelete = Boolean(canDeleteSelectedItem ?? hasSelectedItem);

  const builtInPreviewActions: CustomizerToolbarExtraAction[] = [];
  if (onOpen3DView) {
    builtInPreviewActions.push({
      id: 'shared-3d-view',
      label: '3D VIEW',
      icon: Box,
      active: is3DViewActive,
      disabled: isRoomViewDisabled,
      title: isRoomViewDisabled
        ? 'Upload an image first to enable 3D View'
        : 'Inspect physical 3D product perspective',
      onClick: onOpen3DView
    });
  }
  if (onOpen360View) {
    builtInPreviewActions.push({
      id: 'shared-360-view',
      label: '360° VIEW',
      icon: RotateCw,
      active: is360ViewActive,
      disabled: isRoomViewDisabled,
      title: isRoomViewDisabled
        ? 'Upload an image first to enable 360° View'
        : 'Interactive 360° rotating product preview',
      onClick: onOpen360View
    });
  }

  const allExtraActions = [...builtInPreviewActions, ...extraActions];

  return (
    <div className="h-12 bg-white border-b border-stone-200 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 overflow-x-auto">
      {/* Left Spacer (No Zoom/Rotate or duplicate product info in top toolbar) */}
      <div className="flex items-center gap-1.5 shrink-0" />

      {/* Right: [SAVE, ADD TEXT, ADD CLIPART, ROOM VIEW, 3D VIEW, 360° VIEW] */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
        {/* SAVE */}
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded-lg text-xs font-bold transition-all shadow-2xs hover:border-stone-400 cursor-pointer"
          title="Save design to browser"
        >
          <Save className="w-3.5 h-3.5 text-[#0E4A93]" />
          <span>SAVE</span>
        </button>

        {/* ADD TEXT */}
        <button
          type="button"
          onClick={onToggleText}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
            textActive
              ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
          }`}
          title="Add custom typography"
        >
          <Type className="w-3.5 h-3.5" />
          <span>ADD TEXT</span>
        </button>

        {/* ADD CLIPART */}
        <button
          type="button"
          onClick={onToggleClipart}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
            clipartActive
              ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
          }`}
          title="Add clipart and stickers"
        >
          <Smile className="w-3.5 h-3.5" />
          <span>ADD CLIPART</span>
        </button>

        {/* ROOM VIEW */}
        <button
          type="button"
          disabled={isRoomViewDisabled}
          aria-disabled={isRoomViewDisabled}
          onClick={() => {
            if (isRoomViewDisabled) return;
            handleRoomView?.();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs ${
            isRoomViewDisabled
              ? 'bg-stone-100 text-stone-400 border-stone-200 opacity-50 cursor-not-allowed'
              : isRoomViewActive
              ? 'bg-[#0E4A93] text-white border-[#0E4A93] cursor-pointer'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400 cursor-pointer'
          }`}
          title={isRoomViewDisabled ? 'Upload an image first to enable Room View' : 'Preview on realistic wall'}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>ROOM VIEW</span>
        </button>

        {/* 3D VIEW & 360° VIEW (and any additional actions) */}
        {allExtraActions.map((act) => {
          const Icon = act.icon;
          const isDisabled = Boolean(act.disabled);
          return (
            <button
              key={act.id || act.label}
              type="button"
              disabled={isDisabled}
              aria-disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return;
                act.onClick();
              }}
              title={isDisabled ? `Upload an image first to enable ${act.label}` : act.title || act.label}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs ${
                isDisabled
                  ? 'bg-stone-100 text-stone-400 border-stone-200 opacity-50 cursor-not-allowed'
                  : act.active
                  ? 'bg-[#0E4A93] text-white border-[#0E4A93] cursor-pointer'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400 cursor-pointer'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{act.label}</span>
            </button>
          );
        })}

        {/* Delete Selected Element (Text/Clipart) */}
        {showDelete && onDeleteSelectedItem && (
          <button
            type="button"
            onClick={onDeleteSelectedItem}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer ml-1"
            title="Delete Selected Item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const CustomizerWorkspaceHeader = CustomizerTopToolbar;

// ============================================================================
// 6. SHARED PREVIEW CONTROLS (Dynamic Size Pill + [ − ] [ + ] [ ↶ ] [ ↷ ])
// ============================================================================

export interface CustomizerPreviewControlsProps {
  sizeLabel: string;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  extraControls?: React.ReactNode;
  bottomSlot?: React.ReactNode;
}

export const CustomizerPreviewControls: React.FC<CustomizerPreviewControlsProps> = ({
  sizeLabel,
  onZoomOut,
  onZoomIn,
  onRotateLeft,
  onRotateRight,
  extraControls,
  bottomSlot
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full select-none">
      {/* Dynamic Size Indicator directly below the Product Preview */}
      <div
        data-testid="customizer-size-indicator"
        className="mt-3 inline-flex items-center justify-center px-3 py-1 rounded-full border border-stone-300 bg-white text-xs font-extrabold text-stone-700 shadow-xs"
      >
        {sizeLabel}
      </div>

      {/* Image Controls: [ − ] [ + ] [ ↶ ] [ ↷ ] directly below the Size Indicator */}
      <div
        data-testid="customizer-preview-controls"
        className="mt-2 inline-flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl shadow-xs border border-stone-200"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoomOut();
          }}
          className="p-1.5 rounded-lg hover:bg-stone-100 active:bg-stone-200 text-stone-700 hover:text-[#0E4A93] border border-stone-200 transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoomIn();
          }}
          className="p-1.5 rounded-lg hover:bg-stone-100 active:bg-stone-200 text-stone-700 hover:text-[#0E4A93] border border-stone-200 transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotateLeft();
          }}
          className="p-1.5 rounded-lg hover:bg-stone-100 active:bg-stone-200 text-stone-700 hover:text-[#0E4A93] border border-stone-200 transition-colors cursor-pointer"
          title="Rotate Left"
          aria-label="Rotate Left"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotateRight();
          }}
          className="p-1.5 rounded-lg hover:bg-stone-100 active:bg-stone-200 text-stone-700 hover:text-[#0E4A93] border border-stone-200 transition-colors cursor-pointer"
          title="Rotate Right"
          aria-label="Rotate Right"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        {extraControls}
      </div>

      {/* Optional Bottom Status / Material / Remove Photo Slot */}
      {bottomSlot && <div className="mt-2.5 flex justify-center w-full">{bottomSlot}</div>}
    </div>
  );
};

// ============================================================================
// 7. SHARED PREVIEW AREA (Wraps Product Preview + Shared Preview Controls)
// ============================================================================

export interface CustomizerPreviewAreaProps {
  children: React.ReactNode;
  sizeLabel: string;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  extraControls?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  prevStep?: { label: string; disabled: boolean; onClick: () => void };
  nextStep?: { label: string; disabled: boolean; onClick: () => void };
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const CustomizerPreviewArea: React.FC<CustomizerPreviewAreaProps> = ({
  children,
  sizeLabel,
  onZoomOut,
  onZoomIn,
  onRotateLeft,
  onRotateRight,
  extraControls,
  bottomSlot,
  prevStep,
  nextStep,
  onPointerMove,
  onPointerUp,
  onClick,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden overflow-y-auto"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Subtle Studio Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Optional Left Chevron Button: Prev Step */}
      {prevStep && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevStep.onClick();
          }}
          disabled={prevStep.disabled}
          className={`hidden lg:flex flex-col items-center justify-center absolute left-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all group z-20 ${
            prevStep.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-stone-500 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-black tracking-tight uppercase mt-0.5 max-w-[64px] leading-tight">
            {prevStep.label}
          </span>
        </button>
      )}

      {/* Optional Right Chevron Button: Next Step */}
      {nextStep && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextStep.onClick();
          }}
          disabled={nextStep.disabled}
          className={`hidden lg:flex flex-col items-center justify-center absolute right-5 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 p-3 rounded-xl shadow-md border border-stone-200 transition-all group z-20 ${
            nextStep.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-black tracking-tight uppercase mt-0.5 max-w-[64px] leading-tight">
            {nextStep.label}
          </span>
        </button>
      )}

      {/* Product Preview + Shared Size Indicator + [ − ] [ + ] [ ↶ ] [ ↷ ] Controls */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full">
        {children}

        <CustomizerPreviewControls
          sizeLabel={sizeLabel}
          onZoomOut={onZoomOut}
          onZoomIn={onZoomIn}
          onRotateLeft={onRotateLeft}
          onRotateRight={onRotateRight}
          extraControls={extraControls}
          bottomSlot={bottomSlot}
        />
      </div>
    </div>
  );
};
