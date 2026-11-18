"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GripVertical, Save } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { HomepageLayout, HomepageSectionSetting } from "@/lib/types/homepage-layout";
import { HOMEPAGE_SECTION_LABELS, CURATABLE_SECTION_KEYS } from "@/lib/types/homepage-layout";
import type { ProductListItem } from "@/lib/types/product";
import { usePermission } from "@/lib/auth/use-permission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const endpoint = "/admin/homepage-layout";

export default function HomepageSectionsPage() {
  const { hasPermission } = usePermission();
  const canManage = hasPermission("homepage_layout.manage");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["homepage-layout"],
    queryFn: () => apiClient.get<HomepageLayout>(endpoint),
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.get<ProductListItem[]>("/products?admin=1"),
    enabled: canManage,
  });

  const [storeOpen, setStoreOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState("");
  const [sections, setSections] = useState<HomepageSectionSetting[]>([]);
  const [productQuery, setProductQuery] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setStoreOpen(data.storeOpen);
    setClosedMessage(data.closedMessage);
    setSections(data.sections);
  }, [data]);

  const save = useMutation({
    mutationFn: () => apiClient.put<HomepageLayout>(endpoint, { storeOpen, closedMessage, sections }),
    onSuccess: () => {
      toast.success("Homepage layout published");
      queryClient.invalidateQueries({ queryKey: ["homepage-layout"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to save homepage layout");
    },
  });

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const toggleSection = (key: string, enabled: boolean) => {
    setSections((current) => current.map((s) => (s.key === key ? { ...s, enabled } : s)));
  };

  const renameSection = (key: string, title: string) => {
    setSections((current) => current.map((s) => (s.key === key ? { ...s, title } : s)));
  };

  const addProduct = (key: string, productId: string) => {
    setSections((current) =>
      current.map((s) =>
        s.key === key && !(s.productIds ?? []).includes(productId)
          ? { ...s, productIds: [...(s.productIds ?? []), productId] }
          : s,
      ),
    );
  };

  const removeProduct = (key: string, productId: string) => {
    setSections((current) =>
      current.map((s) => (s.key === key ? { ...s, productIds: (s.productIds ?? []).filter((id) => id !== productId) } : s)),
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Homepage Sections</h1>
          <p className="text-sm text-muted-foreground">
            Control which sections appear on the storefront homepage, their order, their heading, and — for Best
            Sellers and Shop by Occasion — which products show. Changes go live after you publish.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-3.5 w-3.5" /> {save.isPending ? "Publishing…" : "Publish"}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Store status</CardTitle>
          <CardDescription>When closed, the homepage shows a &ldquo;store is closed&rdquo; message instead of the usual hero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Button type="button" size="sm" variant={storeOpen ? "default" : "outline"} disabled={!canManage} onClick={() => setStoreOpen(true)}>Open</Button>
            <Button type="button" size="sm" variant={!storeOpen ? "destructive" : "outline"} disabled={!canManage} onClick={() => setStoreOpen(false)}>Closed</Button>
          </div>
          {!storeOpen && (
            <div className="space-y-2 max-w-md">
              <Label htmlFor="closed-message">Message shown while closed</Label>
              <Input id="closed-message" maxLength={200} value={closedMessage} disabled={!canManage} onChange={(e) => setClosedMessage(e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sections.map((section, index) => {
          const label = HOMEPAGE_SECTION_LABELS[section.key] ?? section.key;
          const curatable = CURATABLE_SECTION_KEYS.has(section.key);
          const query = productQuery[section.key] ?? "";
          const matches = curatable && query.trim().length >= 2
            ? (products ?? []).filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
            : [];
          return (
            <Card key={section.key} className={section.enabled ? "" : "opacity-60"}>
              <CardContent className="space-y-3 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button type="button" disabled={!canManage || index === 0} onClick={() => moveSection(index, -1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">▲</button>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <button type="button" disabled={!canManage || index === sections.length - 1} onClick={() => moveSection(index, 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">▼</button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{label}</span>
                      <code className="text-xs text-muted-foreground">{section.key}</code>
                    </div>
                    <div className="flex items-center gap-2 max-w-sm">
                      <Label htmlFor={`title-${section.key}`} className="text-xs text-muted-foreground whitespace-nowrap">Heading</Label>
                      <Input
                        id={`title-${section.key}`}
                        placeholder={label}
                        maxLength={80}
                        value={section.title}
                        disabled={!canManage}
                        onChange={(e) => renameSection(section.key, e.target.value)}
                      />
                    </div>
                    {curatable && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(section.productIds ?? []).map((id) => {
                            const product = products?.find((p) => p.id === id);
                            return (
                              <span key={id} className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-xs">
                                {product?.name ?? id}
                                {canManage && (
                                  <button type="button" onClick={() => removeProduct(section.key, id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">×</button>
                                )}
                              </span>
                            );
                          })}
                          {(section.productIds ?? []).length === 0 && (
                            <span className="text-xs text-muted-foreground">No products picked — storefront default applies.</span>
                          )}
                        </div>
                        {canManage && (
                          <div className="relative max-w-sm">
                            <Input
                              placeholder="Search products to add…"
                              value={query}
                              onChange={(e) => setProductQuery((current) => ({ ...current, [section.key]: e.target.value }))}
                            />
                            {matches.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-md">
                                {matches.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    className="block w-full px-3 py-1.5 text-left text-xs hover:bg-muted"
                                    onClick={() => {
                                      addProduct(section.key, p.id);
                                      setProductQuery((current) => ({ ...current, [section.key]: "" }));
                                    }}
                                  >
                                    {p.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      disabled={!canManage}
                      onChange={(e) => toggleSection(section.key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors" />
                    <span className="absolute left-1 h-4 w-4 rounded-full bg-background transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
