"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ProductDetail } from "@/lib/types/product";
import type { OptionCategoryListItem } from "@/lib/types/option-category";
import { usePermission } from "@/lib/auth/use-permission";
import { useRecordId } from "@/lib/use-record-id";
import {
  PRODUCT_SECTIONS,
  TAB_ORDER,
  builtInDefaults,
  fromGlobalItem,
  fromSeedItem,
  type CustomizerTab,
  type EditableItem,
  type Material,
  type ProductCustomizer,
  type SectionDef,
} from "@/lib/customizer-options";
import { OptionItemsEditor } from "@/components/option-items-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY: ProductCustomizer = { version: 1, sections: {} };
const imageSrc = (url?: string) => (url ? (url.startsWith("/") ? `https://canvassindia.com${url}` : url) : "");

function guessMaterial(product: ProductDetail): Material | null {
  const text = `${product.storefront?.categorySlug ?? ""} ${product.storefront?.category ?? ""} ${product.productType?.name ?? ""}`.toLowerCase();
  if (text.includes("acrylic")) return "acrylic";
  if (text.includes("canvas")) return "canvas";
  return null;
}

export function ProductCustomizationClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission("products.edit");

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", id],
    enabled: !!id && id !== "placeholder",
    queryFn: () => apiClient.get<ProductDetail>(`/products/${id}`),
  });

  const saved: ProductCustomizer = useMemo(() => {
    const raw = product?.storefront?.customizer;
    return raw && typeof raw === "object" && raw.sections ? (raw as ProductCustomizer) : EMPTY;
  }, [product]);

  const [draft, setDraft] = useState<ProductCustomizer>(EMPTY);
  const [material, setMaterial] = useState<Material>("canvas");
  const [tab, setTab] = useState<CustomizerTab>("LAYOUTS & DESIGNS");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);
  useEffect(() => {
    if (product) setMaterial(guessMaterial(product) ?? "canvas");
  }, [product]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const detectedMaterial = product ? guessMaterial(product) : null;

  const saveMutation = useMutation({
    mutationFn: (customizer: ProductCustomizer) => {
      const storefront: Record<string, unknown> = { ...(product?.storefront ?? {}) };
      if (Object.keys(customizer.sections).length > 0) storefront.customizer = customizer;
      else delete storefront.customizer;
      return apiClient.patch(`/products/${id}`, { storefront });
    },
    onSuccess: () => {
      toast.success("Saved. The customizer for this product is updated.");
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "Could not save. Please try again."),
  });

  const sections = PRODUCT_SECTIONS.filter((s) => s.materials.includes(material));
  const tabs = TAB_ORDER.filter((t) => sections.some((s) => s.tab === t));
  const activeTab = tabs.includes(tab) ? tab : tabs[0];

  // Starts this product's own copy of a list, from the shared options (or the built-in ones).
  const customize = async (section: SectionDef) => {
    setBusyKey(section.baseKey);
    try {
      let items: EditableItem[] = [];
      const all = await queryClient.fetchQuery({
        queryKey: ["option-categories"],
        queryFn: () => apiClient.get<OptionCategoryListItem[]>("/admin/option-categories"),
        staleTime: 30_000,
      });
      const matches = all.filter((c) => c.baseKey === section.baseKey && c.isActive !== false);
      const scope = material === "acrylic" ? "ACRYLIC" : "CANVAS";
      const chosen = matches.find((c) => c.materialScope === scope) ?? matches.find((c) => c.materialScope === "BOTH") ?? matches[0];
      if (chosen && chosen.items.length > 0) {
        items = [...chosen.items].sort((a, b) => a.sortOrder - b.sortOrder).map(fromGlobalItem);
      } else {
        const defaults = builtInDefaults(section.baseKey);
        if (defaults) items = defaults.map(fromSeedItem);
      }
      setDraft((d) => ({ ...d, sections: { ...d.sections, [section.baseKey]: { items } } }));
    } catch {
      toast.error("Couldn't load the shared options. Please try again.");
    } finally {
      setBusyKey(null);
    }
  };

  const resetSection = (baseKey: string) =>
    setDraft((d) => {
      const next = { ...d.sections };
      delete next[baseKey];
      return { ...d, sections: next };
    });

  if (isLoading || id === "placeholder") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">Couldn&apos;t load this product.</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => void refetch()}>Try again</Button>
          <Link href="/product-customization" className="inline-flex items-center text-sm text-muted-foreground hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const customizedCount = Object.keys(draft.sections).length;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <Link href="/product-customization" className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          All products
        </Link>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {product.storefront?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc(product.storefront.image)} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold tracking-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground">
              {product.productType?.name ?? "—"} · {customizedCount === 0 ? "using the shared options" : `${customizedCount} list${customizedCount === 1 ? "" : "s"} customized for this product`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Options for</span>
            <select
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              value={material}
              onChange={(e) => setMaterial(e.target.value as Material)}
            >
              <option value="canvas">Canvas</option>
              <option value="acrylic">Acrylic</option>
            </select>
          </div>
        </div>
        {!detectedMaterial && (
          <p className="mt-2 text-xs text-amber-700">
            This product isn&apos;t a Canvas or Acrylic product. Choose which material&apos;s options you want to edit above.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors ${
              activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {sections
          .filter((s) => s.tab === activeTab)
          .map((section) => {
            const custom = draft.sections[section.baseKey];
            return (
              <Card key={section.baseKey}>
                <CardHeader className="border-b pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <CardDescription>{section.hint}</CardDescription>
                    </div>
                    {custom ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                          Custom for this product · {custom.items.length}
                        </span>
                        {canEdit && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => resetSection(section.baseKey)}>
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                            Use shared options
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Using shared options</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  {custom ? (
                    <OptionItemsEditor
                      baseKey={section.baseKey}
                      items={custom.items}
                      canEdit={canEdit}
                      onChange={(items) => setDraft((d) => ({ ...d, sections: { ...d.sections, [section.baseKey]: { items } } }))}
                    />
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="max-w-xl text-sm text-muted-foreground">
                        Customers of this product currently see the shared options. Customize to give this product its
                        own copy that you can rename, re-price, hide, delete or add to, without touching any other product.
                      </p>
                      {canEdit && (
                        <Button type="button" size="sm" disabled={busyKey === section.baseKey} onClick={() => void customize(section)}>
                          <Sparkles className="mr-1.5 h-4 w-4" />
                          {busyKey === section.baseKey ? "Preparing…" : "Customize for this product"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      {canEdit && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 p-3 backdrop-blur md:left-64">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {dirty ? "You have unsaved changes." : "All changes saved."}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" disabled={!dirty || saveMutation.isPending} onClick={() => setDraft(saved)}>
                Discard
              </Button>
              <Button type="button" size="sm" disabled={!dirty || saveMutation.isPending} onClick={() => saveMutation.mutate(draft)}>
                {saveMutation.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
