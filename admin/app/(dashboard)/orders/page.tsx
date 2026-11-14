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
import { downloadCsv } from "@/lib/csv";
import { Download } from "lucide-react";

export default function OrdersPage() {
  const [status, setStatus] = useState("ALL");
  const router = useRouter();

  const { data, isLoading, isLoadingError: isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<OrderListItem[]>("/orders"),
  });

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

  const visibleRows = (data ?? []).filter(
    (row) =>
      status === "ALL" ||
      (status === "PENDING_PAYMENT"
        ? ["PENDING", "AUTHORIZED"].includes(row.paymentStatus) && row.orderStatus !== "CANCELLED"
        : row.orderStatus === status),
  );
  const exportCsv = () =>
    downloadCsv(
      `orders-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Order #", "Date", "Customer", "Order status", "Payment status", "Shipping status", "Subtotal", "Discount", "Tax", "Shipping fee", "Total"],
      visibleRows.map((r) => [
        r.orderNumber,
        new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        r.customer.name,
        r.orderStatus,
        r.paymentLabel ?? r.paymentStatus,
        r.shippingStatus,
        r.subtotal,
        r.discount,
        r.tax,
        r.shipping,
        r.total,
      ]),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            All orders placed on the storefront.
          </p>
        </div>
        <Button variant="outline" disabled={visibleRows.length === 0} onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV ({visibleRows.length})
        </Button>
      </div>

      <div className="status-filters" aria-label="Filter orders">
        {[
          ["ALL", "All orders"],
          ["PENDING_PAYMENT", "Awaiting payment"],
          ["CONFIRMED", "Confirmed"],
          ["PROCESSING", "In production"],
          ["COMPLETED", "Completed"],
          ["CANCELLED", "Cancelled"],
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
                  (row) =>
                    value === "ALL" ||
                    (value === "PENDING_PAYMENT"
                      ? ["PENDING", "AUTHORIZED"].includes(row.paymentStatus) &&
                        row.orderStatus !== "CANCELLED"
                      : row.orderStatus === value),
                ).length
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
          data={(data ?? []).filter(
            (row) =>
              status === "ALL" ||
              (status === "PENDING_PAYMENT"
                ? ["PENDING", "AUTHORIZED"].includes(row.paymentStatus) &&
                  row.orderStatus !== "CANCELLED"
                : row.orderStatus === status),
          )}
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
