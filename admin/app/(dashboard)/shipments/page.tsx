"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, PackageCheck, RefreshCw, Settings2, Truck } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { DeliveryConfig, DeliverySummary, PickupRecord, ShipmentListItem } from "@/lib/types/shipping";
import { SHIPMENT_STATUS_LABEL } from "@/lib/types/shipping";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const FILTERS: Array<[string, string]> = [
  ["ALL", "All"],
  ["READY", "Awaiting pickup"],
  ["IN_TRANSIT", "On the way"],
  ["OUT_FOR_DELIVERY", "Out for delivery"],
  ["NDR", "Failed delivery"],
  ["RTO", "Returning"],
  ["DELIVERED", "Delivered"],
  ["NOT_SHIPPED", "Cancelled"],
];

const ON_THE_WAY = new Set(["PICKED_UP", "IN_TRANSIT"]);

function todayPlus(days: number) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10);
}

export default function ShipmentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const [filter, setFilter] = useState("ALL");
  const [pickupOpen, setPickupOpen] = useState(false);

  const shipments = useQuery({ queryKey: ["shipments"], queryFn: () => apiClient.get<ShipmentListItem[]>("/shipping"), refetchInterval: 60000 });
  const summary = useQuery({ queryKey: ["delivery-summary"], queryFn: () => apiClient.get<DeliverySummary>("/shipping/summary") });
  const config = useQuery({ queryKey: ["delivery-config"], queryFn: () => apiClient.get<DeliveryConfig>("/shipping/config") });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
    queryClient.invalidateQueries({ queryKey: ["delivery-summary"] });
  };

  const sync = useMutation({
    mutationFn: () => apiClient.post<{ checked: number; updated: number; skipped?: string }>("/shipping/sync"),
    onSuccess: (r) => {
      toast.success(r.skipped ? r.skipped : r.checked === 0 ? "Nothing to refresh: no parcels are on the way." : `Checked ${r.checked} parcel(s), ${r.updated} updated.`);
      refresh();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "Could not refresh tracking"),
  });

  const counts = summary.data?.counts ?? {};
  const n = (s: string) => counts[s] ?? 0;
  const onTheWay = [...ON_THE_WAY].reduce((sum, s) => sum + n(s), 0);
  const all = shipments.data ?? [];
  const rows = all.filter((s) => {
    return filter === "IN_TRANSIT" ? ON_THE_WAY.has(s.status) : filter === "ALL" || s.status === filter;
  });
  const countFor = (value: string) =>
    value === "ALL" ? all.length : value === "IN_TRANSIT" ? all.filter((s) => ON_THE_WAY.has(s.status)).length : all.filter((s) => s.status === value).length;

  const columns: DataTableColumn<ShipmentListItem>[] = [
    { header: "Order #", cell: (row) => <span className="font-medium">{row.order.orderNumber}</span> },
    { header: "AWB", cell: (row) => <span className="font-mono text-xs">{row.awbNumber ?? "—"}</span> },
    { header: "Amount", cell: (row) => formatCurrency(row.order.total) },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { header: "Booked", cell: (row) => formatDate(row.createdAt) },
    { header: "Last update", cell: (row) => formatDate(row.updatedAt) },
  ];

  const canCreate = hasPermission("shipping.create");
  const cfg = config.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="page-eyebrow">DELIVERY</div>
          <h1 className="text-2xl font-semibold tracking-tight">Shipments</h1>
          <p className="text-sm text-muted-foreground">
            Parcels booked with Delhivery. Book a shipment from an order, print its label, then ask Delhivery to pick up. Tracking updates on its own every 20 minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => sync.mutate()} disabled={sync.isPending || !canCreate}>
            <RefreshCw className={`mr-2 h-4 w-4 ${sync.isPending ? "animate-spin" : ""}`} />
            Refresh tracking
          </Button>
          {canCreate && (
            <Button onClick={() => setPickupOpen(true)}>
              <Truck className="mr-2 h-4 w-4" />
              Request pickup
            </Button>
          )}
          <Link href="/delivery-settings">
            <Button variant="ghost">
              <Settings2 className="mr-2 h-4 w-4" />
              Delivery settings
            </Button>
          </Link>
        </div>
      </div>

      {cfg && !cfg.configured && (
        <div className="flex items-start gap-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Delhivery is not connected.</strong> The backend has no Delhivery token, so shipments cannot be booked. See Delivery settings.
          </div>
        </div>
      )}
      {cfg?.configured && cfg.mode === "staging" && (
        <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Delhivery TEST mode.</strong> Bookings made now are not real parcels. Switch to production before going live (Delivery settings).
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/orders">
          <Card className="transition-colors hover:bg-muted/40">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><PackageCheck className="h-3.5 w-3.5" /> Orders ready to ship</div>
              <div className="mt-1 text-2xl font-semibold">{summary.data ? summary.data.toShip : "—"}</div>
            </CardContent>
          </Card>
        </Link>
        {[
          ["Awaiting pickup", n("READY"), "READY"],
          ["On the way", onTheWay, "IN_TRANSIT"],
          ["Out for delivery", n("OUT_FOR_DELIVERY"), "OUT_FOR_DELIVERY"],
          ["Needs action", n("NDR") + n("RTO"), "NDR"],
        ].map(([label, value, key]) => (
          <button key={String(key)} type="button" className="text-left" onClick={() => setFilter(String(key))}>
            <Card className={`transition-colors hover:bg-muted/40 ${key === "NDR" && Number(value) > 0 ? "border-orange-300 bg-orange-50/60" : ""}`}>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-1 text-2xl font-semibold">{summary.data ? String(value) : "—"}</div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="status-filters" aria-label="Filter shipments">
          {FILTERS.map(([value, label]) => (
            <button key={value} className={filter === value ? "active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {label}
              <span>{countFor(value)}</span>
            </button>
          ))}
        </div>
      </div>

      {shipments.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : shipments.isError ? (
        <p className="text-sm text-destructive">Failed to load shipments.</p>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/shipments/placeholder?id=${encodeURIComponent(row.id)}`)}
          emptyMessage={all.length === 0 ? "No shipments yet. Open an order and press Ship with Delhivery." : "No shipments match this filter."}
        />
      )}
      {filter !== "ALL" && <p className="text-xs text-muted-foreground">Showing: {SHIPMENT_STATUS_LABEL[filter] ?? filter}</p>}

      <PickupDialog open={pickupOpen} onOpenChange={setPickupOpen} waiting={n("READY")} onDone={refresh} />
    </div>
  );
}

function PickupDialog({ open, onOpenChange, waiting, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; waiting: number; onDone: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{open && <PickupForm waiting={waiting} onClose={() => onOpenChange(false)} onDone={onDone} />}</DialogContent>
    </Dialog>
  );
}

function PickupForm({ waiting, onClose, onDone }: { waiting: number; onClose: () => void; onDone: () => void }) {
  const [date, setDate] = useState(todayPlus(0));
  const [time, setTime] = useState("16:00");
  const [count, setCount] = useState(String(Math.max(waiting, 1)));
  const recent = useQuery({ queryKey: ["delivery-pickups"], queryFn: () => apiClient.get<PickupRecord[]>("/shipping/pickups") });
  const request = useMutation({
    mutationFn: () => apiClient.post<{ pickupId: string | null; count: number; date: string; time: string }>("/shipping/pickups", { date, time, count: Number(count) }),
    onSuccess: (r) => {
      toast.success(`Pickup requested for ${r.date} ${r.time}${r.pickupId ? ` (id ${r.pickupId})` : ""}`);
      onDone();
      onClose();
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError ? err.message : "Could not request a pickup"),
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle>Request a pickup</DialogTitle>
        <DialogDescription>
          Tell Delhivery to collect your booked parcels from the warehouse. Keep the parcels packed with labels stuck on before the pickup time. Delhivery allows one open pickup at a time.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" min={todayPlus(0)} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Time</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Parcels</Label>
          <Input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{waiting} booked parcel(s) are waiting for pickup right now.</p>
      {(recent.data ?? []).length > 0 && (
        <div className="space-y-1 text-xs">
          <div className="font-medium">Recent requests</div>
          {(recent.data ?? []).slice(0, 4).map((p) => (
            <div key={p.id} className="flex justify-between text-muted-foreground">
              <span>{p.date} {p.time} · {p.count} parcel(s)</span>
              <span>{p.pickupId ? `id ${p.pickupId}` : ""}</span>
            </div>
          ))}
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button disabled={request.isPending || !date || !time || Number(count) < 1} onClick={() => request.mutate()}>
          {request.isPending ? "Requesting…" : "Request pickup"}
        </Button>
      </DialogFooter>
    </>
  );
}
