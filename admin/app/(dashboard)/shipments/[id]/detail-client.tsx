"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, ExternalLink, Printer, RefreshCw } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import { useRecordId } from "@/lib/use-record-id";
import type { ShipmentDetail, ShipmentLabel } from "@/lib/types/shipping";
import { SHIPMENT_STATUS_LABEL } from "@/lib/types/shipping";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentLabelPreview, buildLabelData, printShipmentLabel } from "@/components/delivery/shipment-label";

const FINAL = new Set(["DELIVERED", "NOT_SHIPPED"]);

function errorText(err: unknown, fallback: string) {
  return err instanceof ApiError || err instanceof Error ? err.message : fallback;
}

export function ShipmentDetailClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("shipping.create");
  const canCancel = hasPermission("shipping.cancel");
  const canNdr = hasPermission("ndr.action");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);

  const enabled = !!id && id !== "placeholder";
  const { data: shipment, isLoading, isError } = useQuery({
    queryKey: ["shipments", id],
    enabled,
    queryFn: () => apiClient.get<ShipmentDetail>(`/shipping/${id}`),
    refetchInterval: 60000,
  });
  const labelQuery = useQuery({
    queryKey: ["shipment-label", id],
    enabled: enabled && labelOpen,
    queryFn: () => apiClient.get<ShipmentLabel>(`/shipping/${id}/label`),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
    queryClient.invalidateQueries({ queryKey: ["delivery-summary"] });
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const refresh = useMutation({
    mutationFn: () => apiClient.post<ShipmentDetail>(`/shipping/${id}/refresh`),
    onSuccess: () => {
      toast.success("Tracking refreshed");
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not refresh tracking")),
  });
  const cancel = useMutation({
    mutationFn: () => apiClient.post<ShipmentDetail>(`/shipping/${id}/cancel`),
    onSuccess: () => {
      toast.success("Shipment cancelled with Delhivery");
      setConfirmCancel(false);
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not cancel the shipment")),
  });
  const received = useMutation({
    mutationFn: () => apiClient.post<ShipmentDetail>(`/shipping/${id}/rto-received`),
    onSuccess: () => {
      toast.success("Marked as received back");
      invalidate();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Could not update")),
  });

  const printLabel = async () => {
    try {
      const label = await queryClient.fetchQuery({ queryKey: ["shipment-label", id], queryFn: () => apiClient.get<ShipmentLabel>(`/shipping/${id}/label`) });
      if (!printShipmentLabel(buildLabelData(label.shipment, label.pickup))) toast.error("Allow pop-ups for this site to print the label.");
    } catch (err) {
      toast.error(errorText(err, "Could not prepare the label"));
    }
  };

  if (isLoading || !enabled) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (isError || !shipment) return <p className="text-sm text-destructive">Failed to load this shipment.</p>;

  const address = shipment.order.addresses.find((a) => a.type === "SHIPPING");
  const isCod = shipment.order.payments.some((p) => p.provider === "COD");
  const events = [...shipment.trackingEvents].sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt));
  const openNdr = shipment.ndrCases.find((n) => n.status === "NDR");
  const cancellable = !!shipment.awbNumber && ["READY", "PICKED_UP", "IN_TRANSIT"].includes(shipment.status);
  const trackUrl = shipment.awbNumber ? `https://www.delhivery.com/track-v2/package/${encodeURIComponent(shipment.awbNumber)}` : null;
  const isCancelled = shipment.status === "NOT_SHIPPED";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/shipments" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shipments
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {shipment.order.orderNumber}
            <span className="ml-3 font-mono text-base font-normal text-muted-foreground">{shipment.awbNumber ?? "No AWB"}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={shipment.status} />
            <span className="text-sm text-muted-foreground">{SHIPMENT_STATUS_LABEL[shipment.status] ?? shipment.status}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!FINAL.has(shipment.status) && (
            <Button variant="outline" disabled={refresh.isPending || !canCreate} onClick={() => refresh.mutate()}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refresh.isPending ? "animate-spin" : ""}`} />
              Refresh tracking
            </Button>
          )}
          {!isCancelled && shipment.awbNumber && (
            <>
              <Button variant="outline" onClick={printLabel}>
                <Printer className="mr-2 h-4 w-4" />
                Print label
              </Button>
              <Button variant="ghost" onClick={() => setLabelOpen(true)}>Preview label</Button>
            </>
          )}
          {trackUrl && (
            <a href={trackUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost">
                <ExternalLink className="mr-2 h-4 w-4" />
                Customer tracking page
              </Button>
            </a>
          )}
          {canCancel && cancellable && (
            <Button variant="destructive" onClick={() => setConfirmCancel(true)}>Cancel shipment</Button>
          )}
        </div>
      </div>

      {shipment.status === "NDR" && (
        <NdrCard shipmentId={shipment.id} reason={openNdr?.reason} attempt={openNdr?.attemptNumber} canAct={canNdr} defaultPhone={address?.phone ?? ""} onDone={invalidate} />
      )}
      {shipment.status === "RTO" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <strong>This parcel is coming back to you (RTO).</strong> Delhivery could not deliver it. When it arrives, mark it received, then decide whether to refund or reship.
              {shipment.rtoCases[0]?.receivedAt && <div className="mt-1">Received on {formatDate(shipment.rtoCases[0].receivedAt)}.</div>}
            </div>
          </div>
          {canNdr && !shipment.rtoCases[0]?.receivedAt && (
            <Button variant="outline" disabled={received.isPending} onClick={() => received.mutate()}>Mark received back</Button>
          )}
        </div>
      )}
      {isCancelled && <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">This shipment was cancelled. You can book a new one from the order.</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scans yet. Delhivery shows scans after the parcel is picked up.</p>
            ) : (
              <ol className="relative space-y-4 border-l pl-5">
                {events.map((e, i) => (
                  <li key={e.id} className="relative">
                    <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-background ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <StatusBadge status={e.status} />
                      <span className="text-xs text-muted-foreground">{formatDate(e.occurredAt)}</span>
                    </div>
                    {e.description && <div className="mt-0.5 text-sm">{e.description}</div>}
                    {e.location && <div className="text-xs text-muted-foreground">{e.location}</div>}
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deliver to</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {address ? (
                <>
                  <div className="font-medium">{address.name}</div>
                  <div>{address.line1}</div>
                  {address.line2 && <div>{address.line2}</div>}
                  <div>{address.city}, {address.state} {address.postalCode}</div>
                  {(address.phone || shipment.order.customer?.phone) && <div>Phone: {address.phone ?? shipment.order.customer?.phone}</div>}
                </>
              ) : (
                <p className="text-muted-foreground">No address on file.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {isCod ? (
                <div className="rounded bg-amber-50 p-2 text-amber-900">
                  <strong>Cash on Delivery.</strong> The courier collects {formatCurrency(shipment.order.total)} at the door. Delhivery pays this to you later; it shows as paid here after delivery.
                </div>
              ) : (
                <div>Prepaid online. Nothing to collect.</div>
              )}
              <div className="flex items-center gap-2">Order payment: <StatusBadge status={shipment.order.paymentStatus} /></div>
              <Link href={`/orders/placeholder?id=${encodeURIComponent(shipment.order.id)}`} className="text-primary hover:underline">Open order</Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Parcel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {shipment.items.map((i) => (
                <div key={i.id}>{i.orderItem.productNameSnapshot} x {i.quantity}</div>
              ))}
              <div className="pt-1 text-xs text-muted-foreground">Picked up from: {shipment.warehouse.name}</div>
              <div className="text-xs text-muted-foreground">Booked: {formatDate(shipment.createdAt)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {shipment.ndrCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Failed delivery history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {shipment.ndrCases.map((n) => (
              <div key={n.id} className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0">
                <span>Attempt #{n.attemptNumber}: {n.reason}</span>
                <span className="text-muted-foreground">{n.resolution ?? "Open"} · {formatDate(n.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this shipment?</DialogTitle>
            <DialogDescription>
              Delhivery is asked to cancel AWB {shipment.awbNumber}. It works only before the parcel is out for delivery. If Delhivery refuses, nothing changes here. The order stays open so you can book again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>Keep shipment</Button>
            <Button variant="destructive" disabled={cancel.isPending} onClick={() => cancel.mutate()}>{cancel.isPending ? "Cancelling…" : "Cancel shipment"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={labelOpen} onOpenChange={setLabelOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Label preview</DialogTitle>
            <DialogDescription>4 x 6 inch label. Print it, stick it on the parcel, and keep it flat.</DialogDescription>
          </DialogHeader>
          {labelQuery.isLoading && <Skeleton className="h-64 w-full" />}
          {labelQuery.isError && <p className="text-sm text-destructive">Could not load the label.</p>}
          {labelQuery.data && <ShipmentLabelPreview data={buildLabelData(labelQuery.data.shipment, labelQuery.data.pickup)} />}
          <DialogFooter>
            <Button onClick={printLabel}><Printer className="mr-2 h-4 w-4" />Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** What to do when Delhivery could not hand the parcel over. */
function NdrCard({ shipmentId, reason, attempt, canAct, defaultPhone, onDone }: { shipmentId: string; reason?: string; attempt?: number; canAct: boolean; defaultPhone: string; onDone: () => void }) {
  const [mode, setMode] = useState<"" | "DEFER_DLV" | "EDIT_DETAILS">("");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState(defaultPhone);
  const [add, setAdd] = useState("");
  // Computed once on mount (not on every render): the date window Delhivery allows for a new delivery date.
  const [{ today, max }] = useState(() => ({
    today: new Date().toISOString().slice(0, 10),
    max: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
  }));
  const act = useMutation({
    mutationFn: (body: Record<string, string>) => apiClient.post<{ message: string }>(`/shipping/${shipmentId}/ndr-action`, body),
    onSuccess: (r) => {
      toast.success(r.message);
      setMode("");
      onDone();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Delhivery did not accept the request")),
  });
  return (
    <div className="space-y-3 rounded-md border border-orange-300 bg-orange-50 p-4 text-sm text-orange-950">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Delivery attempt {attempt ? `#${attempt} ` : ""}failed.</strong> {reason ?? "The customer could not be reached."}
          <div className="mt-1 text-xs">Call the customer first, then choose what Delhivery should do. If nothing is done, the parcel is sent back to you.</div>
        </div>
      </div>
      {canAct ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={act.isPending} onClick={() => act.mutate({ act: "RE-ATTEMPT" })}>Try delivery again</Button>
            <Button size="sm" variant="outline" onClick={() => setMode(mode === "DEFER_DLV" ? "" : "DEFER_DLV")}>Deliver on another date</Button>
            <Button size="sm" variant="outline" onClick={() => setMode(mode === "EDIT_DETAILS" ? "" : "EDIT_DETAILS")}>Correct phone or address</Button>
          </div>
          {mode === "DEFER_DLV" && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1">
                <Label className="text-xs">New delivery date (within 6 days)</Label>
                <Input type="date" min={today} max={max} value={date} onChange={(e) => setDate(e.target.value)} className="bg-white" />
              </div>
              <Button size="sm" disabled={!date || act.isPending} onClick={() => act.mutate({ act: "DEFER_DLV", deferredDate: date })}>Send to Delhivery</Button>
            </div>
          )}
          {mode === "EDIT_DETAILS" && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Corrected full address (leave blank to keep)</Label>
                <Input value={add} onChange={(e) => setAdd(e.target.value)} className="bg-white" />
              </div>
              <div>
                <Button size="sm" disabled={act.isPending || (!add.trim() && phone === defaultPhone)} onClick={() => act.mutate({ act: "EDIT_DETAILS", ...(phone !== defaultPhone ? { phone } : {}), ...(add.trim() ? { add: add.trim() } : {}) })}>
                  Send to Delhivery
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs">You do not have permission to act on failed deliveries.</p>
      )}
    </div>
  );
}
