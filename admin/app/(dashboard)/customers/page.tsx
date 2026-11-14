"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CustomerListItem } from "@/lib/types/customer";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/csv";
import { Download } from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();

  const { data, isLoading, isLoadingError: isError } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiClient.get<CustomerListItem[]>("/customers"),
  });

  const exportCsv = () =>
    downloadCsv(
      `customers-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Name", "Email", "Phone", "Type", "Joined"],
      (data ?? []).map((c) => [c.name, c.email ?? "", c.phone ?? "", c.isGuest ? "Guest" : "Registered", new Date(c.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })]),
    );

  const columns: DataTableColumn<CustomerListItem>[] = [
    {
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    { header: "Email", cell: (row) => row.email ?? "—" },
    { header: "Phone", cell: (row) => row.phone ?? "—" },
    {
      header: "Type",
      cell: (row) =>
        row.isGuest ? (
          <Badge variant="outline" className="border-0 bg-muted font-medium">
            Guest
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-0 bg-emerald-100 font-medium text-emerald-800"
          >
            Registered
          </Badge>
        ),
    },
    { header: "Joined", cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Everyone who has an account or placed an order.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load customers.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) =>
            router.push(
              `/customers/placeholder?id=${encodeURIComponent(row.id)}`,
            )
          }
          emptyMessage="No customers yet."
        />
      )}
    </div>
  );
}
