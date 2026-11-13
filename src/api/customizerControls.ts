import { useEffect, useState } from 'react';
import { fetchOptionCategoryItems, type OptionCategoryItemDto } from './optionCategoriesApi';
import layoutSeed from '../data/layoutSeed.json';

/**
 * Admin-managed names, visibility and order for the customizer's left-hand tabs and
 * top buttons (Customization → Tabs & buttons). Everything fails open: if the lists
 * are not set up, or cannot be loaded, the customizer looks exactly as it did before.
 */
export interface ControlOverride {
  label: string;
  order: number;
}
export type ControlMap = Map<string, ControlOverride> | null;

/** What the admin screen seeds each id with, so an untouched label never replaces a context-specific one. */
const DEFAULT_LABELS: Record<string, string> = {
  PRODUCTS: 'Products',
  UPLOAD: 'Upload',
  'SELECT SIZE': 'Select size',
  'LAYOUTS & DESIGNS': 'Layouts & designs',
  'WRAP & BORDER': 'Wrap & border',
  'HARDWARE & FINISH': 'Hardware & finish',
  OPTIONS: 'Options',
  save: 'Save',
  add_text: 'Add text',
  add_clipart: 'Add clipart',
  room_view: 'Room view',
  view_3d: '3D view',
  view_360: '360° view',
};

export const KNOWN_TAB_IDS = new Set(['PRODUCTS', 'UPLOAD', 'SELECT SIZE', 'LAYOUTS & DESIGNS', 'WRAP & BORDER', 'HARDWARE & FINISH', 'OPTIONS']);
export const KNOWN_TOOLBAR_IDS = new Set(['save', 'add_text', 'add_clipart', 'room_view', 'view_3d', 'view_360']);

interface Controls {
  tabs: ControlMap;
  toolbar: ControlMap;
}

const toMap = (items: Awaited<ReturnType<typeof fetchOptionCategoryItems>>): ControlMap => {
  if (!items.length) return null;
  const map = new Map<string, ControlOverride>();
  items.forEach((item, index) => {
    const id = String(item.extras?.id ?? '');
    if (id) map.set(id, { label: item.label, order: index });
  });
  return map.size > 0 ? map : null;
};

let cached: Promise<Controls> | null = null;

function loadControls(): Promise<Controls> {
  if (!cached) {
    cached = Promise.all([fetchOptionCategoryItems('sidebar_tabs'), fetchOptionCategoryItems('toolbar_buttons')])
      .then(([tabs, toolbar]) => ({ tabs: toMap(tabs), toolbar: toMap(toolbar) }))
      .catch(() => ({ tabs: null, toolbar: null }));
  }
  return cached;
}

export function useCustomizerControls(): Controls {
  const [controls, setControls] = useState<Controls>({ tabs: null, toolbar: null });
  useEffect(() => {
    let cancelled = false;
    void loadControls().then((value) => {
      if (!cancelled) setControls(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return controls;
}

/**
 * Drops items the admin hid and puts the known ones in the admin's order. Items the admin
 * screen does not manage keep their place; known items only trade places with each other.
 */
export function applyControls<T>(items: T[], map: ControlMap, getId: (item: T) => string | undefined, known: Set<string>): T[] {
  if (!map) return items;
  const visible = items.filter((item) => {
    const id = getId(item);
    return !id || !known.has(id) || map.has(id);
  });
  const slots: number[] = [];
  visible.forEach((item, index) => {
    const id = getId(item);
    if (id && known.has(id)) slots.push(index);
  });
  const ordered = slots
    .map((index) => visible[index])
    .sort((a, b) => (map.get(getId(a)!)?.order ?? 0) - (map.get(getId(b)!)?.order ?? 0));
  const result = [...visible];
  slots.forEach((slot, i) => {
    result[slot] = ordered[i];
  });
  return result;
}

/** The label to show: the admin's rename if they changed it, otherwise the built-in label. */
export function controlLabel(map: ControlMap, id: string, builtIn: string): string {
  const override = map?.get(id);
  if (!override) return builtIn;
  const seeded = DEFAULT_LABELS[id];
  if (seeded && override.label.trim().toLowerCase() === seeded.toLowerCase()) return builtIn;
  return override.label.trim() ? override.label.trim().toUpperCase() : builtIn;
}

/** Layout ids that existed when the admin list was set up; a layout added to the code later is shown until the admin manages it. */
const SEEDED_LAYOUT_IDS = new Set<string>((layoutSeed as { id: string }[]).map((l) => l.id));

export interface LayoutLike {
  id: string;
  name: string;
  price: number;
  acrylicPrice?: number;
}

/**
 * Applies the admin's layout list (Customization → Layouts & designs): hidden or deleted layouts
 * disappear, names, prices and cover images follow the admin, and the admin's order is used.
 * With no list set up, the built-in layouts are returned untouched.
 */
export function applyLayoutOverrides<T extends LayoutLike>(layouts: T[], items: OptionCategoryItemDto[] | null): (T & { coverImage?: string })[] {
  if (!items || items.length === 0) return layouts;
  const byId = new Map<string, OptionCategoryItemDto>();
  const order = new Map<string, ControlOverride>();
  items.forEach((item, index) => {
    const id = String(item.extras?.id ?? '');
    if (!id) return;
    byId.set(id, item);
    order.set(id, { label: item.label, order: index });
  });
  const kept = applyControls(layouts, order, (l) => l.id, SEEDED_LAYOUT_IDS);
  return kept.map((layout) => {
    const item = byId.get(layout.id);
    if (!item) return layout;
    const flat = Number(item.flatPrice);
    const acrylic = Number(item.extras?.acrylicPrice);
    return {
      ...layout,
      name: item.label || layout.name,
      price: Number.isFinite(flat) ? flat : layout.price,
      acrylicPrice: Number.isFinite(acrylic) && item.extras?.acrylicPrice !== '' && item.extras?.acrylicPrice != null ? acrylic : layout.acrylicPrice,
      coverImage: item.imageUrl || undefined,
    };
  });
}
