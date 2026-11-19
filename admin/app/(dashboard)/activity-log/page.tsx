"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditRow {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown> | null;
  reason: string | null;
  adminUser: { name: string; email: string } | null;
}

/** ORDER_CANCELLED -> "Order cancelled" */
function humanize(action: string) {
  const text = action.toLowerCase().replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function summarize(row: AuditRow) {
  const parts: string[] = [];
  if (row.reason) parts.push(row.reason);
  if (row.changes) {
    for (const [key, value] of Object.entries(row.changes)) {
      const v = value && typeof value === "object" && "new" in (value as object) ? (value as { old?: unknown; new?: unknown }) : null;
      parts.push(v ? `${key}: ${String(v.old ?? "—")} → ${String(v.new ?? "—")}` : `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`);
    }
  }
  return parts.join(" · ").slice(0, 160);
}

export default function ActivityLogPage() {
  const { data, isLoading, isLoadingError: isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => apiClient.get<AuditRow[]>("/audit-logs?take=300"),
  });

  const columns: DataTableColumn<AuditRow>[] = [
    { header: "When", cell: (row) => formatDate(row.createdAt) },
    { header: "Who", cell: (row) => (row.adminUser ? <span title={row.adminUser.email}>{row.adminUser.name}</span> : <span className="text-muted-foreground">System or customer</span>) },
    { header: "What happened", cell: (row) => <span className="font-medium">{humanize(row.action)}</span> },
    { header: "On", cell: (row) => <span className="text-xs text-muted-foreground">{row.entityType} {row.entityId.slice(0, 8)}</span> },
    { header: "Details", cell: (row) => <span className="text-xs text-muted-foreground">{summarize(row) || "—"}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="page-eyebrow">ADMINISTRATION</div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity log</h1>
        <p className="text-sm text-muted-foreground">
          A permanent record of important changes: refunds, cancellations, price changes, shipments, team and layout edits. The most recent 300 are shown. Entries cannot be edited or deleted.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load the activity log.</p>
      ) : (
        <DataTable columns={columns} data={data ?? []} getRowKey={(row) => row.id} emptyMessage="Nothing recorded yet." />
      )}
    </div>
  );
}
