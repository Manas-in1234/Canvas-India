"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface SpecRow {
  label: string;
  value: string;
}

export interface ProductFormState {
  status: string;
  name: string;
  description: string;
  basePrice: string;
  costPrice: string;
  originalPrice: string;
  storefront: Record<string, any>;
  specifications: SpecRow[];
}

const STANDARD_PRINT_QUALITY = "12-Color Archival UV-Resistant Inks (2400 DPI)";
const STANDARD_MOUNTING = "Pre-attached hangers & stainless wall standoffs included";
const STANDARD_ORIGIN = "Proudly Designed & Made in India";

const asList = (value: unknown): string[] => (Array.isArray(value) ? value.map(String) : []);

/** The rows the website shows today, so editing starts from what shoppers already see. */
export function defaultSpecifications(sf: Record<string, any>, typeName?: string): SpecRow[] {
  return [
    { label: "Category", value: sf.category || typeName || "" },
    { label: "Subcategory", value: sf.subcategory || "" },
    { label: "Material", value: sf.material || "" },
    { label: "Print Quality", value: STANDARD_PRINT_QUALITY },
    { label: "Available Sizes", value: asList(sf.sizes).join(", ") },
    { label: "Available Finishes", value: asList(sf.finishes).join(", ") },
    { label: "Mounting Hardware", value: STANDARD_MOUNTING },
    { label: "Origin", value: STANDARD_ORIGIN },
  ].filter((row) => row.value);
}

export function discountFor(price: number, original: number): number {
  return original > price && original > 0 ? Math.round(((original - price) / original) * 100) : 0;
}

export function buildStorefrontPayload(form: ProductFormState): Record<string, any> {
  const price = Number(form.basePrice) || 0;
  const original = Number(form.originalPrice) > price ? Number(form.originalPrice) : price;
  const images = asList(form.storefront.images);
  const sf = { ...form.storefront };
  return {
    ...sf,
    image: images[0] ?? sf.image ?? "",
    images,
    price,
    originalPrice: original,
    compareAtPrice: original,
    discountPercent: discountFor(price, original),
    availableSizes: asList(sf.sizes),
    availableFinishes: asList(sf.finishes),
    specifications: form.specifications
      .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
      .filter((row) => row.label && row.value),
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4 pt-5">{children}</CardContent>
    </Card>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ListEditor({
  values,
  onChange,
  disabled,
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter((p) => p && !values.includes(p));
    if (parts.length) onChange([...values, ...parts]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-1 text-xs"
            >
              {value}
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${value}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onChange(values.filter((v) => v !== value))}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {!disabled && (
        <div className="flex gap-2">
          <Input
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={add}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}

const imageSrc = (url: string) => (url.startsWith("/") ? `https://canvassindia.com${url}` : url);

const LIST_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "sizes", label: "Available sizes", placeholder: "e.g. 12x18 inch" },
  { key: "finishes", label: "Available finishes", placeholder: "e.g. Matte Black Wood Frame" },
  { key: "tags", label: "Search tags", placeholder: "e.g. spiritual" },
  { key: "features", label: "Key features", placeholder: "e.g. Fade resistant" },
  { key: "occasions", label: "Occasions", placeholder: "e.g. Housewarming" },
  { key: "applications", label: "Applications", placeholder: "e.g. Living room" },
  { key: "availableThicknesses", label: "Thicknesses", placeholder: "e.g. 3 mm" },
  { key: "availableStyles", label: "Styles", placeholder: "e.g. Modern" },
  { key: "availableBases", label: "Bases", placeholder: "e.g. Wooden" },
  { key: "availablePapers", label: "Papers", placeholder: "e.g. Matte" },
];

const FLAGS: { key: string; label: string; hint: string }[] = [
  { key: "customizable", label: "Customizable", hint: "Shoppers can personalise this product" },
  { key: "uploadRequired", label: "Photo upload required", hint: "Shoppers must upload an image" },
  { key: "featured", label: "Featured", hint: "Highlight on the website" },
  { key: "bestseller", label: "Bestseller", hint: "Show the bestseller badge" },
];

export function ProductForm({
  form,
  setForm,
  canEdit,
  typeName,
}: {
  form: ProductFormState;
  setForm: (next: ProductFormState) => void;
  canEdit: boolean;
  typeName?: string;
}) {
  const sf = form.storefront;
  const setSf = (key: string, value: unknown) =>
    setForm({ ...form, storefront: { ...sf, [key]: value } });

  const price = Number(form.basePrice) || 0;
  const original = Number(form.originalPrice) || 0;
  const discount = discountFor(price, original);
  const invalidOriginal = original > 0 && original < price;

  const images = asList(sf.images).length ? asList(sf.images) : sf.image ? [String(sf.image)] : [];
  const setSpecs = (specifications: SpecRow[]) => setForm({ ...form, specifications });
  const updateSpec = (index: number, patch: Partial<SpecRow>) =>
    setSpecs(form.specifications.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  const moveSpec = (index: number, by: number) => {
    const target = index + by;
    if (target < 0 || target >= form.specifications.length) return;
    const next = [...form.specifications];
    [next[index], next[target]] = [next[target], next[index]];
    setSpecs(next);
  };

  return (
    <div className="space-y-5">
      <Section title="Basics" description="What shoppers see first.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name">
            <Input value={form.name} disabled={!canEdit} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Website visibility">
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={form.status}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ACTIVE">Live on website</option>
              <option value="DRAFT">Hidden (draft)</option>
            </select>
          </Field>
        </div>
        <Field label="Short description" hint="One line shown on product cards.">
          <Input
            value={sf.shortDescription ?? ""}
            disabled={!canEdit}
            onChange={(e) => setSf("shortDescription", e.target.value)}
          />
        </Field>
        <Field label="Full description">
          <textarea
            rows={4}
            className="w-full rounded-lg border border-input bg-background p-2.5 text-sm"
            value={form.description}
            disabled={!canEdit}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Badge" hint="e.g. New, Trending">
            <Input value={sf.badge ?? ""} disabled={!canEdit} onChange={(e) => setSf("badge", e.target.value)} />
          </Field>
          <Field label="Stock status">
            <Input
              value={sf.stockStatus ?? ""}
              disabled={!canEdit}
              onChange={(e) => setSf("stockStatus", e.target.value)}
            />
          </Field>
          <Field label="Material">
            <Input value={sf.material ?? ""} disabled={!canEdit} onChange={(e) => setSf("material", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section
        title="Pricing"
        description="The selling price, the struck-through original price and the % off always stay in step."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Selling price (₹)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.basePrice}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
          </Field>
          <Field label="Original price (₹)" hint="Shown struck through">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.originalPrice}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
            />
          </Field>
          <Field label="Discount (%)" hint="Edit to set the original price">
            <Input
              type="number"
              min="0"
              max="95"
              value={discount}
              disabled={!canEdit || price <= 0}
              onChange={(e) => {
                const pct = Math.min(95, Math.max(0, Number(e.target.value) || 0));
                setForm({
                  ...form,
                  originalPrice: pct > 0 ? String(Math.round(price / (1 - pct / 100))) : String(price),
                });
              }}
            />
          </Field>
          <Field label="Cost price (₹)" hint="Internal only">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.costPrice}
              disabled={!canEdit}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            />
          </Field>
        </div>
        {invalidOriginal && (
          <p className="text-sm text-destructive">The original price must not be lower than the selling price.</p>
        )}
        <div className="flex items-baseline gap-3 rounded-lg bg-muted/40 px-4 py-3">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">On the website</span>
          <span className="text-xl font-semibold">₹{price.toLocaleString("en-IN")}</span>
          {discount > 0 && (
            <>
              <span className="text-muted-foreground line-through">₹{original.toLocaleString("en-IN")}</span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </Section>

      <Section title="Category" description="Where the product sits on the website.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Category">
            <Input value={sf.category ?? ""} disabled={!canEdit} onChange={(e) => setSf("category", e.target.value)} />
          </Field>
          <Field label="Category slug">
            <Input
              value={sf.categorySlug ?? ""}
              disabled={!canEdit}
              onChange={(e) => setSf("categorySlug", e.target.value)}
            />
          </Field>
          <Field label="Subcategory">
            <Input
              value={sf.subcategory ?? ""}
              disabled={!canEdit}
              onChange={(e) => setSf("subcategory", e.target.value)}
            />
          </Field>
          <Field label="Shape / finish">
            <div className="flex gap-2">
              <Input
                placeholder="Shape"
                value={sf.shape ?? ""}
                disabled={!canEdit}
                onChange={(e) => setSf("shape", e.target.value)}
              />
              <Input
                placeholder="Finish"
                value={sf.finish ?? ""}
                disabled={!canEdit}
                onChange={(e) => setSf("finish", e.target.value)}
              />
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Images" description="The first image is the main picture shown on cards and the product page.">
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url, index) => (
              <div key={url + index} className="space-y-1.5 rounded-lg border p-2">
                <div className="relative aspect-square overflow-hidden rounded bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc(url)} alt="" className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                      Main
                    </span>
                  )}
                </div>
                {canEdit && (
                  <div className="flex gap-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setSf("images", [url, ...images.filter((_, i) => i !== index)])}
                      >
                        Make main
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove image"
                      onClick={() => setSf("images", images.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <ListEditor
          values={[]}
          disabled={!canEdit}
          placeholder="Paste an image URL or /assets/... path and press Enter"
          onChange={(added) => setSf("images", [...images, ...added])}
        />
      </Section>

      <Section title="Options & details" description="Type a value and press Enter. These feed the choices and search on the website.">
        <div className="grid gap-5 lg:grid-cols-2">
          {LIST_FIELDS.map(({ key, label, placeholder }) => (
            <Field key={key} label={label}>
              <ListEditor
                values={asList(sf[key])}
                disabled={!canEdit}
                placeholder={placeholder}
                onChange={(next) => setSf(key, next)}
              />
            </Field>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {FLAGS.map(({ key, label, hint }) => (
            <label key={key} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4"
                checked={!!sf[key]}
                disabled={!canEdit}
                onChange={(e) => setSf(key, e.target.checked)}
              />
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section
        title="Product specifications"
        description="The table at the bottom of the product page. Edit any row, add your own, or reorder them."
      >
        <div className="space-y-2">
          {form.specifications.map((row, index) => (
            <div key={index} className="grid grid-cols-[1fr_2fr_auto] items-start gap-2">
              <Input
                placeholder="Label"
                value={row.label}
                disabled={!canEdit}
                onChange={(e) => updateSpec(index, { label: e.target.value })}
              />
              <Input
                placeholder="Value"
                value={row.value}
                disabled={!canEdit}
                onChange={(e) => updateSpec(index, { value: e.target.value })}
              />
              {canEdit && (
                <div className="flex">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" onClick={() => moveSpec(index, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Move down" onClick={() => moveSpec(index, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove row"
                    onClick={() => setSpecs(form.specifications.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {form.specifications.length === 0 && (
            <p className="text-sm text-muted-foreground">No rows — the website will show its standard table.</p>
          )}
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSpecs([...form.specifications, { label: "", value: "" }])}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add row
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSpecs(defaultSpecifications(sf, typeName))}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset to standard rows
            </Button>
          </div>
        )}
      </Section>
    </div>
  );
}
