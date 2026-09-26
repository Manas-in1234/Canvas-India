import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  ChevronLeft,
  ShoppingCart,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Save,
  Type,
  Smile,
  Eye,
  Trash2
} from 'lucide-react';

// ============================================================================
// 1. SHARED CUSTOMIZER HEADER
// ============================================================================

export interface CustomizerHeaderProps {
  productName: string;
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
  productName,
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
      {/* LEFT: Menu / Back / Logo / Customizer */}
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
          <span className="text-white font-bold text-xs tracking-wider uppercase inline-block border-l border-white/20 pl-2">
            {productName}
          </span>
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
    <section className="w-full md:w-[400px] lg:w-[440px] bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col z-10 shrink-0 h-72 md:h-full min-h-0 overflow-hidden shadow-sm">
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
// 5. SHARED WORKSPACE TOP TOOLBAR
// ============================================================================

export interface CustomizerToolbarExtraAction {
  id?: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  onClick: () => void;
  title?: string;
}

export interface CustomizerTopToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate?: () => void;
  onRotate90?: () => void;
  onReset: () => void;
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
  extraActions?: CustomizerToolbarExtraAction[];
  canDeleteSelectedItem?: boolean;
  hasSelectedItem?: boolean;
  onDeleteSelectedItem?: () => void;
}

export const CustomizerTopToolbar: React.FC<CustomizerTopToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onRotate,
  onRotate90,
  onReset,
  productSummary,
  summaryBadgeText,
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
  extraActions = [],
  canDeleteSelectedItem,
  hasSelectedItem,
  onDeleteSelectedItem
}) => {
  const handleRotate = onRotate || onRotate90;
  const textActive = Boolean(isTextActive ?? showTextPopover);
  const clipartActive = Boolean(isClipartActive ?? showClipartPopover);
  const handleRoomView = onOpenRoomView || onToggleRoomView;
  const showDelete = Boolean(canDeleteSelectedItem ?? hasSelectedItem);

  return (
    <div className="h-12 bg-white border-b border-stone-200 px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 overflow-x-auto">
      {/* Left Image Manipulation Tools + Active Configuration Summary */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onZoomIn}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onZoomOut}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Reset Image"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {productSummary ? (
          <div className="hidden lg:flex items-center gap-1.5 pl-2 ml-1 border-l border-stone-200 text-[11px] font-bold text-stone-600">
            <span className="text-[#0E4A93]">{productSummary.productName}</span>
            <span className="text-stone-300">•</span>
            <span>{productSummary.shapeName}</span>
            <span className="text-stone-300">•</span>
            <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded">
              {productSummary.dimensionLabel}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">{productSummary.hardwareName}</span>
          </div>
        ) : summaryBadgeText ? (
          <div className="hidden lg:flex items-center gap-1.5 pl-2 ml-1 border-l border-stone-200 text-[11px] font-bold text-stone-600">
            <span className="text-[#0E4A93]">{summaryBadgeText}</span>
          </div>
        ) : null}
      </div>

      {/* Right: [SAVE, ADD TEXT, ADD CLIPART, ROOM VIEW, + Extra Canvas Actions] */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
          onClick={handleRoomView}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
            isRoomViewActive
              ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
          }`}
          title="Preview on realistic wall"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>ROOM VIEW</span>
        </button>

        {/* Extra controls (e.g. 3D VIEW, 360° VIEW in Canvas) */}
        {extraActions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id || act.label}
              type="button"
              onClick={act.onClick}
              title={act.title || act.label}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shadow-2xs cursor-pointer ${
                act.active
                  ? 'bg-[#0E4A93] text-white border-[#0E4A93]'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400'
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
