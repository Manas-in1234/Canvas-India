"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AuditLogEntry } from "@/lib/types/audit-log";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export default function AuditLogPage() {
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");

  const params = new URLSearchParams();
  if (entityType.trim()) params.set("entityType", entityType.trim());
  if (action.trim()) params.set("action", action.trim());
  const query = params.toString();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-log", entityType, action],
    queryFn: () => apiClient.get<AuditLogEntry[]>(`/admin/audit-log${query ? `?${query}` : ""}`),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground">
          A record of admin actions across the store — who changed what, and when. Showing the
          most recent 200 matching entries.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Filter by entity type, e.g. Product"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by action, e.g. PRODUCT_PRICE_CHANGED"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load the audit log.</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matching audit entries.</p>
      ) : (
        <div className="space-y-2">
          {data.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <span className="font-medium">{entry.action}</span>{" "}
                  <span className="text-muted-foreground">
                    on {entry.entityType} ({entry.entityId})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {entry.adminUser ? `${entry.adminUser.name} (${entry.adminUser.email})` : "System"}
                {entry.reason ? ` · ${entry.reason}` : ""}
              </div>
              {entry.changes && (
                <pre className="mt-2 overflow-x-auto rounded bg-muted/50 p-2 text-xs">
                  {JSON.stringify(entry.changes, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
