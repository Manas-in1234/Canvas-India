"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ShipmentListItem } from "@/lib/types/shipping";
import { SHIPMENT_STATUS_LABEL } from "@/lib/types/shipping";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

/** Parcels that need a person: delivery failed, or the parcel is coming back. Open one to act on it. */
export default function DeliveryProblemsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shipments"],
    queryFn: () => apiClient.get<ShipmentListItem[]>("/shipping"),
    refetchInterval: 60000,
  });

  const rows = (data ?? [])
    .filter((s) => s.status === "NDR" || s.status === "RTO")
    .sort((a, b) => (a.status === b.status ? +new Date(b.updatedAt) - +new Date(a.updatedAt) : a.status === "NDR" ? -1 : 1));

  const columns: DataTableColumn<ShipmentListItem>[] = [
    { header: "Order #", cell: (row) => <span className="font-medium">{row.order.orderNumber}</span> },
    { header: "AWB", cell: (row) => <span className="font-mono text-xs">{row.awbNumber ?? "—"}</span> },
    { header: "Problem", cell: (row) => <span>{SHIPMENT_STATUS_LABEL[row.status]}</span> },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { header: "Failed attempts", cell: (row) => row._count?.ndrCases ?? 0 },
    { header: "Amount", cell: (row) => formatCurrency(row.order.total) },
    { header: "Last update", cell: (row) => formatDate(row.updatedAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="page-eyebrow">DELIVERY</div>
        <h1 className="text-2xl font-semibold tracking-tight">Delivery problems</h1>
        <p className="text-sm text-muted-foreground">
          Parcels where delivery failed, or that are returning to you. Failed deliveries are returned to you if no one acts, so check this page daily.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load.</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/shipments/placeholder?id=${encodeURIComponent(row.id)}`)}
          emptyMessage="No delivery problems. Every parcel is on track."
        />
      )}
    </div>
  );
}
