"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { ProductListItem } from "@/lib/types/product";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const [status, setStatus] = useState("ALL");
  const router = useRouter();
  const { hasPermission } = usePermission();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.get<ProductListItem[]>("/products"),
  });

  const columns: DataTableColumn<ProductListItem>[] = [
    {
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    { header: "Type", cell: (row) => row.productType?.name ?? "—" },
    {
      header: "Category",
      cell: (row) => row.categories?.[0]?.category?.name ?? "—",
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { header: "Base Price", cell: (row) => formatCurrency(row.basePrice) },
    { header: "Created", cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Catalog of products available for sale.
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
              ["ACTIVE", "Live products"],
              ["DRAFT", "Drafts"],
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
                    (data || []).filter(
                      (row) => value === "ALL" || row.status === value,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <DataTable
            columns={columns}
            data={(data ?? []).filter(
              (row) => status === "ALL" || row.status === status,
            )}
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
    </div>
  );
}
