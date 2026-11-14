"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { OrderListItem } from "@/lib/types/order";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { OrderEditor } from "@/components/order-editor";
import { usePermission } from "@/lib/auth/use-permission";

export default function OrdersPage() {
  const [status, setStatus] = useState("ALL");
  const [adding, setAdding] = useState(false);
  const { hasPermission } = usePermission();
  const router = useRouter();

  const { data, isLoading, isLoadingError: isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<OrderListItem[]>("/orders"),
  });
  const matches = (row: OrderListItem, filter: string) => {
    const visibility = row.adminVisibility ?? "VISIBLE";
    if (filter === "HIDDEN" || filter === "ARCHIVED") return visibility === filter;
    if (visibility !== "VISIBLE") return false;
    if (filter === "PENDING_PAYMENT") {
      return row.orderStatus !== "CANCELLED" && row.orderStatus !== "DRAFT" && ["PENDING", "AUTHORIZED"].includes(row.paymentStatus);
    }
    return filter === "ALL" || row.orderStatus === filter;
  };

  const columns: DataTableColumn<OrderListItem>[] = [
    {
      header: "Order #",
      cell: (row) => <span className="font-medium">{row.orderNumber}</span>,
    },
    { header: "Customer", cell: (row) => row.customer.name },
    {
      header: "Order Status",
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: "Payment",
      cell: (row) => <StatusBadge status={row.paymentLabel ?? row.paymentStatus} />,
    },
    {
      header: "Shipping",
      cell: (row) => <StatusBadge status={row.shippingStatus} />,
    },
    { header: "Total", cell: (row) => formatCurrency(row.total) },
    { header: "Created", cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Storefront orders and manual drafts.</p>
        </div>
        {hasPermission("orders.create") && <Button onClick={() => setAdding(true)}>Add order</Button>}
      </div>
      {adding && <OrderEditor onClose={() => setAdding(false)}
        onSaved={id => router.push(`/orders/placeholder?id=${encodeURIComponent(id)}`)} />}

      <div className="status-filters" aria-label="Filter orders">
        {[
          ["ALL", "All orders"],
          ["DRAFT", "Drafts"],
          ["PENDING_PAYMENT", "Awaiting payment"],
          ["CONFIRMED", "Confirmed"],
          ["PROCESSING", "In production"],
          ["COMPLETED", "Completed"],
          ["CANCELLED", "Cancelled"],
          ["HIDDEN", "Hidden"],
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
                (data ?? []).filter(row => matches(row, value)).length
              }
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load orders.</p>
      ) : (
        <DataTable
          columns={columns}
          data={(data ?? []).filter(row => matches(row, status))}
          getRowKey={(row) => row.id}
          onRowClick={(row) =>
            router.push(`/orders/placeholder?id=${encodeURIComponent(row.id)}`)
          }
          emptyMessage="No orders yet."
        />
      )}
    </div>
  );
}
