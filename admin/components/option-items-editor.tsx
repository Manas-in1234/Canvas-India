"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SECTION_EXTRAS,
  blankItem,
  imageToIconDataUrl,
  slugify,
  type EditableItem,
  type ExtraField,
} from "@/lib/customizer-options";

const formatPrice = (item: EditableItem) =>
  item.priceMode === "AREA_RATE"
    ? `₹${item.areaRatePerSqIn ?? 0}/sq in`
    : item.flatPrice === 0
      ? "Included"
      : `+₹${item.flatPrice.toLocaleString("en-IN")}`;

/** The small picture on each card: the uploaded icon, or a swatch drawn from the option's own settings. */
function OptionPreview({ baseKey, item }: { baseKey: string; item: EditableItem }) {
  const box = "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40";
  if (item.imageUrl) {
    const src = item.imageUrl.startsWith("/") ? `https://canvassindia.com${item.imageUrl}` : item.imageUrl;
    // eslint-disable-next-line @next/next/no-img-element
    return <div className={box}><img src={src} alt="" className="h-full w-full object-contain" /></div>;
  }
  const x = item.extras;
  if (baseKey === "border_color" || baseKey === "backgrounds") {
    const hex = (x.hex as string) || "#FFFFFF";
    return <div className={box}><div className="h-10 w-10 rounded-full border" style={{ backgroundColor: hex === "transparent" ? undefined : hex }} /></div>;
  }
  if (baseKey === "frame") {
    return <div className={box}><div className="h-10 w-10 rounded border-4" style={{ borderColor: (x.color as string) || "#000" }} /></div>;
  }
  if (baseKey === "wrap_style") {
    const w = Number(x.borderWidth) || 0;
    return (
      <div className={box}>
        <div className="h-10 w-10 rounded-sm bg-sky-400" style={{ border: w > 0 ? `${Math.min(w / 2, 6)}px solid ${(x.borderColor as string) || "transparent"}` : undefined }} />
      </div>
    );
  }
  if (baseKey === "border_width") {
    return <div className={box}><div className="bg-foreground/70" style={{ width: Math.max(2, Math.min(Number(x.widthPx) || 0, 16)), height: 28 }} /></div>;
  }
  if (baseKey === "design_templates") {
    return (
      <div className={box} style={{ backgroundColor: (x.bgColor as string) || "#fff" }}>
        <span className="px-1 text-center text-[9px] font-black leading-tight" style={{ color: (x.textColor as string) || "#000" }}>
          {(x.textPreset as string) || item.label}
        </span>
      </div>
    );
  }
  return <div className={`${box} text-[10px] text-muted-foreground`}>No icon</div>;
}

function ExtraInput({ field, value, onChange }: { field: ExtraField; value: unknown; onChange: (v: unknown) => void }) {
  const text = value === undefined || value === null ? "" : String(value);
  return (
    <div className="space-y-1">
      <Label className="text-xs">{field.label}</Label>
      {field.kind === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(text) ? text : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded border"
          />
          <Input value={text} onChange={(e) => onChange(e.target.value)} placeholder="#FFFFFF" />
        </div>
      ) : field.kind === "select" ? (
        <select
          className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
          value={text}
          onChange={(e) => onChange(e.target.value)}
        >
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <Input
          type={field.kind === "number" ? "number" : "text"}
          value={text}
          onChange={(e) => onChange(field.kind === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
        />
      )}
      {field.hint && <p className="text-[11px] text-muted-foreground">{field.hint}</p>}
    </div>
  );
}

function ItemForm({
  baseKey,
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  baseKey: string;
  draft: EditableItem;
  setDraft: (i: EditableItem) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const fields = SECTION_EXTRAS[baseKey] ?? [];
  const setExtra = (key: string, value: unknown) => setDraft({ ...draft, extras: { ...draft.extras, [key]: value } });
  return (
    <div className="space-y-4 rounded-xl border-2 border-primary/30 bg-card p-4">
      <div className="flex items-start gap-4">
        <div className="space-y-2">
          <OptionPreview baseKey={baseKey} item={draft} />
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-[11px] hover:bg-muted">
            <ImagePlus className="h-3 w-3" />
            {draft.imageUrl ? "Change icon" : "Upload icon"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  setDraft({ ...draft, imageUrl: await imageToIconDataUrl(file) });
                } catch {
                  toast.error("Could not read that image. Try a PNG, JPG or WebP file.");
                }
              }}
            />
          </label>
          {draft.imageUrl && (
            <button type="button" className="block text-[11px] text-muted-foreground hover:text-destructive" onClick={() => setDraft({ ...draft, imageUrl: "" })}>
              Remove icon
            </button>
          )}
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Name</Label>
            <Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} autoFocus />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs">Description (optional)</Label>
            <Input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Price (₹)</Label>
            <div className="flex gap-2">
              <select
                className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                value={draft.priceMode}
                onChange={(e) => setDraft({ ...draft, priceMode: e.target.value as EditableItem["priceMode"] })}
              >
                <option value="FLAT">Flat</option>
                <option value="AREA_RATE">Per sq in</option>
              </select>
              {draft.priceMode === "FLAT" ? (
                <Input type="number" min="0" step="0.01" value={draft.flatPrice} onChange={(e) => setDraft({ ...draft, flatPrice: Number(e.target.value) || 0 })} />
              ) : (
                <Input type="number" min="0" step="0.01" value={draft.areaRatePerSqIn ?? ""} onChange={(e) => setDraft({ ...draft, areaRatePerSqIn: Number(e.target.value) || 0 })} />
              )}
            </div>
          </div>
        </div>
      </div>
      {fields.length > 0 && (
        <div className="grid gap-3 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <ExtraInput key={field.key} field={field} value={draft.extras[field.key]} onChange={(v) => setExtra(field.key, v)} />
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="mr-1 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onSave}>
          <Check className="mr-1 h-3.5 w-3.5" />
          Done
        </Button>
      </div>
    </div>
  );
}

/**
 * Cards for one list of options. Everything happens in place: edit, hide, delete, reorder, add.
 * Nothing is saved until the page's own Save button is used.
 */
export function OptionItemsEditor({
  baseKey,
  items,
  onChange,
  canEdit,
}: {
  baseKey: string;
  items: EditableItem[];
  onChange: (items: EditableItem[]) => void;
  canEdit: boolean;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startEdit = (item: EditableItem) => {
    setEditingId(item.id);
    setDraft({ ...item, extras: { ...item.extras } });
    setIsNew(false);
  };
  const startAdd = () => {
    const item = blankItem(baseKey);
    setEditingId(item.id);
    setDraft(item);
    setIsNew(true);
  };
  const cancel = () => {
    setEditingId(null);
    setDraft(null);
    setIsNew(false);
  };
  const commit = () => {
    if (!draft) return;
    if (!draft.label.trim()) {
      toast.error("Give this option a name.");
      return;
    }
    const extras = { ...draft.extras };
    if ((SECTION_EXTRAS[baseKey] ?? []).some((f) => f.key === "id") && !String(extras.id ?? "").trim()) {
      extras.id = slugify(draft.label) || draft.id;
    }
    const saved = { ...draft, label: draft.label.trim(), extras };
    onChange(isNew ? [...items, saved] : items.map((i) => (i.id === saved.id ? saved : i)));
    cancel();
  };
  const move = (index: number, by: number) => {
    const target = index + by;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2.5">
      {items.length === 0 && !draft && (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No options yet. Customers will see nothing here until you add one.
        </p>
      )}
      {items.map((item, index) =>
        editingId === item.id && draft && !isNew ? (
          <ItemForm key={item.id} baseKey={baseKey} draft={draft} setDraft={setDraft} onSave={commit} onCancel={cancel} />
        ) : (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-xl border bg-card p-3 transition-opacity ${item.hidden ? "opacity-60" : ""}`}
          >
            <OptionPreview baseKey={baseKey} item={item} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.label}</span>
                {item.hidden && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">Hidden</span>}
                {typeof item.extras.badge === "string" && item.extras.badge && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800">{item.extras.badge}</span>
                )}
                {typeof item.extras.category === "string" && item.extras.category && (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] text-sky-800">{item.extras.category}</span>
                )}
              </div>
              {item.description && <p className="truncate text-xs text-muted-foreground">{item.description}</p>}
              <p className="text-sm font-semibold text-primary">{formatPrice(item)}</p>
            </div>
            {canEdit && (
              confirmDeleteId === item.id ? (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">Delete?</span>
                  <Button type="button" size="xs" variant="destructive" onClick={() => { onChange(items.filter((i) => i.id !== item.id)); setConfirmDeleteId(null); }}>
                    Yes
                  </Button>
                  <Button type="button" size="xs" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                    No
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Button type="button" size="icon-sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="icon-sm" variant="ghost" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={item.hidden ? "Show" : "Hide"}
                    title={item.hidden ? "Show to customers" : "Hide from customers"}
                    onClick={() => onChange(items.map((i) => (i.id === item.id ? { ...i, hidden: !i.hidden } : i)))}
                  >
                    {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button type="button" size="icon-sm" variant="ghost" aria-label="Edit" onClick={() => startEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" size="icon-sm" variant="ghost" aria-label="Delete" onClick={() => setConfirmDeleteId(item.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              )
            )}
          </div>
        ),
      )}
      {isNew && draft && <ItemForm baseKey={baseKey} draft={draft} setDraft={setDraft} onSave={commit} onCancel={cancel} />}
      {canEdit && !draft && (
        <Button type="button" variant="outline" size="sm" onClick={startAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add option
        </Button>
      )}
    </div>
  );
}
