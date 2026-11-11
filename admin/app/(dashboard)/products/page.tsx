"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ProductListItem, ProductStatus, ProductTypeSummary } from "@/lib/types/product";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [status, setStatus] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ProductListItem | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canDelete = hasPermission("products.delete");
  const canEdit = hasPermission("products.edit");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.get<ProductListItem[]>("/products?admin=1"),
  });

  // Categories (product types) tell us which products are hidden because their
  // whole category is hidden, and feed the category filter.
  const { data: categories } = useQuery({
    queryKey: ["product-types"],
    queryFn: () => apiClient.get<ProductTypeSummary[]>("/product-types"),
  });
  const hiddenCategoryIds = new Set(
    (categories ?? []).filter((c) => c.isActive === false).map((c) => c.id),
  );

  // Show or hide one product on the website. The row is updated in place
  // instead of refetching the whole list, which is large.
  const visibilityMutation = useMutation({
    mutationFn: ({ id, status: next }: { id: string; status: ProductStatus }) =>
      apiClient.patch(`/products/${id}`, { status: next }),
    onSuccess: (_result, { id, status: next }) => {
      queryClient.setQueryData<ProductListItem[]>(["products"], (old) =>
        old?.map((p) => (p.id === id ? { ...p, status: next } : p)),
      );
      toast.success(next === "ACTIVE" ? "Now live on the website" : "Hidden from the website");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : "Could not change visibility");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success("Product archived");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setPendingDelete(null);
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to archive product",
      );
    },
  });

  const columns: DataTableColumn<ProductListItem>[] = [
    {
      header: "Name",
      cell: (row) => <span className="flex items-center gap-3">{row.storefront?.image && <img src={row.storefront.image.startsWith("/") ? `https://canvassindia.com${row.storefront.image}` : row.storefront.image} alt="" className="h-12 w-12 rounded object-cover" />}<span className="font-medium">{row.name}</span></span>,
    },
    { header: "Category", cell: (row) => row.productType?.name ?? "—" },
    {
      header: "Website",
      cell: (row) => {
        if (row.status === "ARCHIVED") return <StatusBadge status={row.status} />;
        const live = row.status === "ACTIVE";
        if (live && hiddenCategoryIds.has(row.productType?.id)) {
          return (
            <span className="text-xs text-muted-foreground" title="Show the category again from Categories">
              Category hidden
            </span>
          );
        }
        const pill = cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
          live ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground",
        );
        const dot = cn("h-1.5 w-1.5 rounded-full", live ? "bg-emerald-600" : "bg-muted-foreground/60");
        if (!canEdit) {
          return (
            <span className={pill}>
              <span className={dot} />
              {live ? "Live" : "Hidden"}
            </span>
          );
        }
        return (
          <button
            type="button"
            className={cn(pill, "cursor-pointer hover:opacity-80 disabled:opacity-50")}
            disabled={visibilityMutation.isPending}
            title={live ? "Click to hide from the website" : "Click to show on the website"}
            onClick={(e) => {
              e.stopPropagation();
              visibilityMutation.mutate({ id: row.id, status: live ? "DRAFT" : "ACTIVE" });
            }}
          >
            <span className={dot} />
            {live ? "Live" : "Hidden"}
          </button>
        );
      },
    },
    { header: "Base Price", cell: (row) => formatCurrency(row.basePrice) },
    { header: "Created", cell: (row) => formatDate(row.createdAt) },
    ...(canEdit
      ? [
          {
            header: "",
            cell: (row: ProductListItem) => {
              if (row.status === "ARCHIVED") return null;
              const live = row.status === "ACTIVE";
              return (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={visibilityMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    visibilityMutation.mutate({
                      id: row.id,
                      status: live ? "DRAFT" : "ACTIVE",
                    });
                  }}
                >
                  {live ? (
                    <EyeOff className="mr-1.5 h-4 w-4" />
                  ) : (
                    <Eye className="mr-1.5 h-4 w-4" />
                  )}
                  {live ? "Hide from website" : "Show on website"}
                </Button>
              );
            },
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            header: "",
            cell: (row: ProductListItem) =>
              row.status !== "ARCHIVED" ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Archive product"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingDelete(row);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  const query = search.trim().toLowerCase();
  const inScope = (data ?? []).filter(
    (row) =>
      (categoryFilter === "ALL" || row.productType?.id === categoryFilter) &&
      (!query || row.name.toLowerCase().includes(query)),
  );
  const rows = inScope.filter((row) => status === "ALL" || row.status === status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Everything in the catalog. Use the Website switch to show or hide a product on the live site.
          </p>
        </div>
        {hasPermission("products.create") && (
          <Link
            href="/products/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Product
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load products.</p>
      ) : (
        <>
          <div className="status-filters" aria-label="Filter products">
            {[
              ["ALL", "All products"],
              ["ACTIVE", "Live on website"],
              ["DRAFT", "Hidden"],
              ["ARCHIVED", "Archived"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={status === value ? "active" : ""}
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
              >
                {label}
                <span>
                  {
                    inScope.filter(
                      (row) => value === "ALL" || row.status === value,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
              aria-label="Filter by category"
            >
              <option value="ALL">All categories</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.isActive === false ? " (hidden)" : ""}
                </option>
              ))}
            </select>
            <span className="text-xs text-muted-foreground">
              {rows.length} of {(data ?? []).length} products
            </span>
          </div>
          <DataTable
            columns={columns}
            data={rows}
            getRowKey={(row) => row.id}
            onRowClick={(row) =>
              router.push(
                `/products/placeholder?id=${encodeURIComponent(row.id)}`,
              )
            }
            emptyMessage="No products yet."
          />
        </>
      )}

      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this product?</DialogTitle>
            <DialogDescription>
              {pendingDelete?.name} will be removed from the storefront and
              hidden from active listings. This can&apos;t be undone from
              here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                pendingDelete && deleteMutation.mutate(pendingDelete.id)
              }
            >
              {deleteMutation.isPending ? "Archiving…" : "Archive Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
