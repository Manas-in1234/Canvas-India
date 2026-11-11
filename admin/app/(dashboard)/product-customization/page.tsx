"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { ProductListItem } from "@/lib/types/product";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const imageSrc = (url?: string) => (url ? (url.startsWith("/") ? `https://canvassindia.com${url}` : url) : "");

export default function ProductCustomizationPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [onlyCustomized, setOnlyCustomized] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.get<ProductListItem[]>("/products?admin=1"),
  });

  const query = search.trim().toLowerCase();
  const customizedCount = (data ?? []).filter((p) => p.storefront?.customizer?.sections).length;
  const rows = (data ?? [])
    .filter((p) => p.status !== "ARCHIVED")
    .filter((p) => !onlyCustomized || p.storefront?.customizer?.sections)
    .filter((p) => !query || p.name.toLowerCase().includes(query) || (p.productType?.name ?? "").toLowerCase().includes(query))
    .slice(0, 60);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Product customization</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Pick a product to give it its own customization options and prices. Each product keeps its own copy, so
          changing one never affects another. Products you don&apos;t change keep using the shared options from
          Customize page options.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search a product by name or category…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyCustomized} onChange={(e) => setOnlyCustomized(e.target.checked)} />
          Only products with their own options ({customizedCount})
        </label>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Couldn&apos;t load products. Refresh the page to try again.</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products match.</p>
      ) : (
        <div className="grid gap-2.5 md:grid-cols-2">
          {rows.map((product) => {
            const custom = product.storefront?.customizer?.sections
              ? Object.keys(product.storefront.customizer.sections).length
              : 0;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => router.push(`/product-customization/placeholder?id=${encodeURIComponent(product.id)}`)}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {product.storefront?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageSrc(product.storefront.image)} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.productType?.name ?? "—"}</div>
                </div>
                {custom > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    {custom} custom {custom === 1 ? "list" : "lists"}
                  </span>
                )}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}
      {!isLoading && (data ?? []).length > rows.length && !query && !onlyCustomized && (
        <p className="text-xs text-muted-foreground">Showing the first {rows.length}. Search to find a specific product.</p>
      )}
    </div>
  );
}
