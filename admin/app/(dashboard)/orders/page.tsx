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

// Pure frontend mock row, pinned to the top of the list - clicking it opens
// /orders/qa-dummy, which renders every customization spec (border, color,
// finish, layout/template, display, frame, wrap, mirror image, backing,
// surface finish) with no API call or database row involved. For visual QA
// only - never sent to or read from the backend.
const QA_DUMMY_LIST_ITEM: OrderListItem = {
  id: "qa-dummy",
  orderNumber: "QA-DUMMY-0001",
  orderStatus: "CONFIRMED",
  paymentStatus: "PENDING",
  shippingStatus: "NOT_SHIPPED",
  subtotal: "4998.00",
  discount: "0.00",
  tax: "899.64",
  shipping: "0.00",
  total: "5897.64",
  createdAt: new Date().toISOString(),
  customer: { id: "qa-dummy-customer", name: "QA Dummy Order - DO NOT SHIP" },
};

export default function OrdersPage() {
  const [status, setStatus] = useState("ALL");
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<OrderListItem[]>("/orders"),
  });

  const rowsWithQaDummy = [QA_DUMMY_LIST_ITEM, ...(data ?? [])];

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
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          All orders placed on the storefront.
        </p>
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
                rowsWithQaDummy.filter(
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
      ) : (
        <>
          {isError && (
            <p className="text-sm text-destructive">
              Failed to load real orders - showing the QA dummy order below only.
            </p>
          )}
          <DataTable
            columns={columns}
            data={rowsWithQaDummy.filter(
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
        </>
      )}
    </div>
  );
}
