import type { OptionCategoryItem, OptionPriceMode } from "@/lib/types/option-category";

/** One option card in a customizer list, as the admin edits it. */
export interface EditableItem {
  id: string;
  label: string;
  description: string;
  imageUrl: string;
  priceMode: OptionPriceMode;
  flatPrice: number;
  areaRatePerSqIn: number | null;
  hidden: boolean;
  extras: Record<string, unknown>;
}

/** What is stored on a product: its own, independent copy of every list it customizes. */
export interface ProductCustomizer {
  version: 1;
  sections: Record<string, { items: EditableItem[] }>;
}

export type ExtraKind = "text" | "number" | "color" | "select";
export interface ExtraField {
  key: string;
  label: string;
  kind: ExtraKind;
  hint?: string;
  options?: { value: string; label: string }[];
}

const DECOR_OPTIONS = ["confetti", "ribbon", "floral", "hearts", "necktie", "balloons"].map((value) => ({
  value,
  label: value[0].toUpperCase() + value.slice(1),
}));

/** The extra details each kind of list needs (what the storefront reads from `extras`). */
export const SECTION_EXTRAS: Record<string, ExtraField[]> = {
  border_color: [{ key: "hex", label: "Swatch color", kind: "color" }],
  backgrounds: [{ key: "hex", label: "Swatch color", kind: "color" }],
  border_width: [{ key: "widthPx", label: "Line width (px)", kind: "number" }],
  frame: [{ key: "color", label: "Frame color", kind: "color" }],
  wrap_style: [
    { key: "borderColor", label: "Edge color", kind: "color" },
    { key: "borderWidth", label: "Edge width (px)", kind: "number" },
  ],
  canvas_thickness: [
    { key: "name", label: "Short name", kind: "text" },
    { key: "badge", label: "Badge", kind: "text", hint: "e.g. Recommended" },
    { key: "thicknessInches", label: "Thickness (inches)", kind: "number" },
    { key: "depthPx", label: "Preview depth (px)", kind: "number" },
    { key: "id", label: "Internal id", kind: "text", hint: "Leave blank to create automatically" },
  ],
  acrylic_thickness: [
    { key: "name", label: "Short name", kind: "text" },
    { key: "badge", label: "Badge", kind: "text", hint: "e.g. Recommended" },
    { key: "thicknessMm", label: "Thickness (mm)", kind: "number" },
    { key: "id", label: "Internal id", kind: "text", hint: "Leave blank to create automatically" },
  ],
  design_templates: [
    { key: "category", label: "Group", kind: "text", hint: "e.g. Birthday, Wedding" },
    { key: "textPreset", label: "Text on the card", kind: "text" },
    { key: "decor", label: "Decoration", kind: "select", options: DECOR_OPTIONS },
    { key: "accent", label: "Decoration color", kind: "color" },
    { key: "bgColor", label: "Card background", kind: "color" },
    { key: "textColor", label: "Card text color", kind: "color" },
  ],
};

export type CustomizerTab = "LAYOUTS & DESIGNS" | "WRAP & BORDER" | "HARDWARE & FINISH" | "OPTIONS";
export type Material = "canvas" | "acrylic";

export interface SectionDef {
  baseKey: string;
  title: string;
  hint: string;
  tab: CustomizerTab;
  materials: Material[];
}

/** Every list a single product can customize, grouped by the customizer tab the customer sees it in. */
export const PRODUCT_SECTIONS: SectionDef[] = [
  { baseKey: "design_templates", title: "Design templates", hint: "Ready-made themes such as Birthday or Wedding.", tab: "LAYOUTS & DESIGNS", materials: ["canvas", "acrylic"] },
  { baseKey: "canvas_thickness", title: "Wrap thickness", hint: "Canvas Lite, Thin and Thick Gallery Wrap and similar.", tab: "WRAP & BORDER", materials: ["canvas"] },
  { baseKey: "wrap_style", title: "Edge wrap", hint: "How the picture wraps around the edge.", tab: "WRAP & BORDER", materials: ["canvas"] },
  { baseKey: "border_width", title: "Border width", hint: "Thin, medium and thick borders.", tab: "WRAP & BORDER", materials: ["canvas"] },
  { baseKey: "border_color", title: "Border colors", hint: "Color swatches for the border.", tab: "WRAP & BORDER", materials: ["canvas"] },
  { baseKey: "frame", title: "Frames", hint: "Standard, premium and floating frames.", tab: "WRAP & BORDER", materials: ["canvas"] },
  { baseKey: "acrylic_thickness", title: "Acrylic thickness", hint: "3, 5, 6, 8 mm and so on.", tab: "HARDWARE & FINISH", materials: ["acrylic"] },
  { baseKey: "backgrounds", title: "Backing", hint: "What sits behind the acrylic.", tab: "HARDWARE & FINISH", materials: ["acrylic"] },
  { baseKey: "finish", title: "Surface finish", hint: "Gloss, matte and similar finishes.", tab: "HARDWARE & FINISH", materials: ["acrylic"] },
  { baseKey: "hardware", title: "Hardware & hanging", hint: "Hooks, hangers, stands and so on.", tab: "HARDWARE & FINISH", materials: ["canvas", "acrylic"] },
  { baseKey: "display_option", title: "Back display", hint: "Open back or dust cover.", tab: "HARDWARE & FINISH", materials: ["canvas"] },
  { baseKey: "color_finishing", title: "Color finishing", hint: "Original, sepia, grayscale.", tab: "HARDWARE & FINISH", materials: ["canvas", "acrylic"] },
  { baseKey: "lamination", title: "Lamination", hint: "No, standard or premium lamination.", tab: "OPTIONS", materials: ["canvas", "acrylic"] },
  { baseKey: "retouching", title: "Minor photo retouching", hint: "Red eye, dust removal and similar.", tab: "OPTIONS", materials: ["canvas", "acrylic"] },
  { baseKey: "material_grade", title: "Canvas material variant", hint: "Standard, premium and archival canvas.", tab: "OPTIONS", materials: ["canvas"] },
];

export const TAB_ORDER: CustomizerTab[] = ["LAYOUTS & DESIGNS", "WRAP & BORDER", "HARDWARE & FINISH", "OPTIONS"];

export function newItemId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

export function blankItem(baseKey: string): EditableItem {
  return {
    id: newItemId(),
    label: "",
    description: "",
    imageUrl: "",
    priceMode: "FLAT",
    flatPrice: 0,
    areaRatePerSqIn: null,
    hidden: false,
    extras: baseKey === "design_templates" ? { decor: "confetti", accent: "#e11d48", bgColor: "#fff1f2", textColor: "#881337" } : {},
  };
}

export function fromGlobalItem(item: OptionCategoryItem): EditableItem {
  return {
    id: newItemId(),
    label: item.label,
    description: item.description ?? "",
    imageUrl: item.imageUrl ?? "",
    priceMode: item.priceMode,
    flatPrice: Number(item.flatPrice) || 0,
    areaRatePerSqIn: item.areaRatePerSqIn ? Number(item.areaRatePerSqIn) : null,
    hidden: !item.isActive,
    extras: { ...(item.extras ?? {}) },
  };
}

// ---------------------------------------------------------------------------
// Built-in defaults, for lists that were fixed in the storefront code until now.
// ---------------------------------------------------------------------------

type SeedItem = { label: string; description: string; flatPrice: string; extras: Record<string, unknown> };

export const CANVAS_THICKNESS_SEED_ITEMS: SeedItem[] = [
  { label: "Canvas Lite", description: "Ultra slim & lightweight, economical mount", flatPrice: "148.50", extras: { id: "canvas-lite", name: "Canvas Lite", thicknessInches: 0.5, depthPx: 12, badge: "" } },
  { label: "Thin Gallery Wrap", description: "Standard modern gallery profile", flatPrice: "193.05", extras: { id: "thin-gallery", name: "Thin Gallery Wrap", thicknessInches: 0.75, depthPx: 18, badge: "Recommended" } },
  { label: "Thick Gallery Wrap", description: "Museum-grade premium deep projection", flatPrice: "231.66", extras: { id: "thick-gallery", name: "Thick Gallery Wrap", thicknessInches: 1.5, depthPx: 30, badge: "Museum Quality" } },
  { label: "Custom Thickness", description: "Specify custom canvas frame depth", flatPrice: "193.05", extras: { id: "custom-thickness", name: "Custom Thickness", thicknessInches: 1, depthPx: 22, badge: "" } },
  { label: "Unframed Rolled Canvas", description: "Flexible unmounted rolled canvas or hanging bar", flatPrice: "85.00", extras: { id: "hanging-canvas", name: "Unframed Rolled Canvas", thicknessInches: 0.25, depthPx: 8, badge: "" } },
];

export const ACRYLIC_THICKNESS_SEED_ITEMS: SeedItem[] = [
  { label: "3MM Lightweight Cast Acrylic", description: "", flatPrice: "0.00", extras: { id: "3mm", name: "3MM Cast Acrylic", thicknessMm: 3, badge: "" } },
  { label: "5MM Standard Studio Acrylic", description: "", flatPrice: "150.00", extras: { id: "5mm", name: "5MM Studio Acrylic", thicknessMm: 5, badge: "Recommended" } },
  { label: "6MM Architectural Grade Acrylic", description: "", flatPrice: "200.00", extras: { id: "6mm", name: "6MM Architectural Grade", thicknessMm: 6, badge: "" } },
  { label: "8MM Premium Optical Cast Acrylic", description: "", flatPrice: "250.00", extras: { id: "8mm", name: "8MM Optical Cast", thicknessMm: 8, badge: "Museum Quality" } },
  { label: "18mm Heavy Block Acrylic", description: "", flatPrice: "450.00", extras: { id: "18mm", name: "18mm Heavy Block", thicknessMm: 18, badge: "" } },
];

const tpl = (id: string, category: string, name: string, textPreset: string, decor: string, accent: string, bgColor: string, textColor: string): SeedItem => ({
  label: name,
  description: "",
  flatPrice: "0",
  extras: { id, category, textPreset, decor, accent, bgColor, textColor },
});

export const DESIGN_TEMPLATE_SEED_ITEMS: SeedItem[] = [
  tpl("tpl-fd-1", "Father's Day", "Love You Dad", "Love You Dad", "necktie", "#0f172a", "#1c1917", "#ffffff"),
  tpl("tpl-fd-2", "Father's Day", "Happy Father's Day", "Happy Father's Day", "ribbon", "#0284c7", "#e0f2fe", "#0c4a6e"),
  tpl("tpl-fd-3", "Father's Day", "Dad, The Hero", "Dad, The Hero", "confetti", "#f59e0b", "#ecfdf5", "#064e3b"),
  tpl("tpl-md-1", "Mother's Day", "Best Mom Ever", "Best Mom Ever", "floral", "#ec4899", "#fce7f3", "#831843"),
  tpl("tpl-md-2", "Mother's Day", "Love You Mom", "Love You Mom", "hearts", "#e11d48", "#fff1f2", "#881337"),
  tpl("tpl-sd-1", "Summer Day", "Summer Vibes", "Summer Vibes", "confetti", "#f59e0b", "#fef3c7", "#78350f"),
  tpl("tpl-sd-2", "Summer Day", "Hello Sunshine", "Hello Sunshine", "ribbon", "#0284c7", "#ecfeff", "#164e63"),
  tpl("tpl-vd-1", "Valentine's Day", "Be My Valentine", "Be My Valentine", "hearts", "#e11d48", "#fee2e2", "#7f1d1d"),
  tpl("tpl-vd-2", "Valentine's Day", "With All My Love", "With All My Love", "hearts", "#be123c", "#ffe4e6", "#881337"),
  tpl("tpl-vd-3", "Valentine's Day", "Together Forever", "Together Forever", "hearts", "#e11d48", "#fff1f2", "#881337"),
  tpl("tpl-bd-1", "Birthday", "Happy Birthday", "Happy Birthday!", "balloons", "#e11d48", "#ffe4e6", "#881337"),
  tpl("tpl-bd-2", "Birthday", "Another Year Wiser", "Another Year Wiser", "confetti", "#d97706", "#fef3c7", "#78350f"),
  tpl("tpl-wd-1", "Wedding", "Mr & Mrs", "Mr & Mrs", "floral", "#be123c", "#fff1f2", "#881337"),
  tpl("tpl-wd-2", "Wedding", "Forever & Always", "Forever & Always", "floral", "#78716c", "#ffffff", "#1c1917"),
  tpl("tpl-an-1", "Anniversary", "Happy Anniversary", "Happy Anniversary", "hearts", "#dc2626", "#fef2f2", "#7f1d1d"),
  tpl("tpl-an-2", "Anniversary", "Together Forever", "Together Forever", "hearts", "#4338ca", "#eef2ff", "#312e81"),
];

/** Built-in defaults for a list, if it has any. */
export function builtInDefaults(baseKey: string): SeedItem[] | null {
  if (baseKey === "canvas_thickness") return CANVAS_THICKNESS_SEED_ITEMS;
  if (baseKey === "acrylic_thickness") return ACRYLIC_THICKNESS_SEED_ITEMS;
  if (baseKey === "design_templates") return DESIGN_TEMPLATE_SEED_ITEMS;
  return null;
}

export function fromSeedItem(seed: SeedItem): EditableItem {
  return {
    id: newItemId(),
    label: seed.label,
    description: seed.description,
    imageUrl: "",
    priceMode: "FLAT",
    flatPrice: Number(seed.flatPrice) || 0,
    areaRatePerSqIn: null,
    hidden: false,
    extras: { ...seed.extras },
  };
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Shrinks an uploaded picture to a small icon so it can be stored with the option. */
export function imageToIconDataUrl(file: File, maxSize = 192): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) {
        reject(new Error("no canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/webp", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}
