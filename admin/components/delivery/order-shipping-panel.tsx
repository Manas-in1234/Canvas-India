"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Truck } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { ShipmentDetail, ShipmentPreview } from "@/lib/types/shipping";
import { SHIPMENT_STATUS_LABEL } from "@/lib/types/shipping";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/** Book, review and jump to the Delhivery shipment for one order. */
export function OrderShippingPanel({ orderId }: { orderId: string }) {
  const { hasPermission } = usePermission();
  const canView = hasPermission("shipping.view");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shipment-preview", orderId],
    enabled: canView && !!orderId && orderId !== "placeholder",
    queryFn: () => apiClient.get<ShipmentPreview>(`/shipping/preview/${orderId}`),
  });
  if (!canView) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Truck className="h-4 w-4" />
          Delivery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : isError || !data ? (
          <p className="text-destructive">Could not load delivery details.</p>
        ) : data.activeShipment ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={data.activeShipment.status} />
              <span className="text-muted-foreground">{SHIPMENT_STATUS_LABEL[data.activeShipment.status]}</span>
            </div>
            <div>AWB <span className="font-mono">{data.activeShipment.awbNumber ?? "—"}</span></div>
            <Link href={`/shipments/placeholder?id=${encodeURIComponent(data.activeShipment.id)}`} className="text-primary hover:underline">
              Open shipment, tracking and label
            </Link>
          </div>
        ) : (
          <BookForm preview={data} orderId={orderId} />
        )}
      </CardContent>
    </Card>
  );
}

function BookForm({ preview, orderId }: { preview: ShipmentPreview; orderId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("shipping.create");
  const [weight, setWeight] = useState(String(preview.package.weightGrams));
  const [length, setLength] = useState(String(preview.package.lengthCm));
  const [width, setWidth] = useState(String(preview.package.widthCm));
  const [height, setHeight] = useState(String(preview.package.heightCm));
  const [mode, setMode] = useState<"Surface" | "Express">("Surface");
  const [confirm, setConfirm] = useState(false);

  const book = useMutation({
    mutationFn: () =>
      apiClient.post<ShipmentDetail>("/shipping/shipments", {
        orderId,
        weightGrams: Number(weight),
        lengthCm: Number(length),
        widthCm: Number(width),
        heightCm: Number(height),
        shippingMode: mode,
      }),
    onSuccess: (s) => {
      toast.success(`Booked with Delhivery. AWB ${s.awbNumber}`);
      setConfirm(false);
      queryClient.invalidateQueries({ queryKey: ["shipment-preview", orderId] });
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-summary"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/shipments/placeholder?id=${encodeURIComponent(s.id)}`);
    },
    onError: (err: unknown) => {
      setConfirm(false);
      toast.error(err instanceof ApiError || err instanceof Error ? err.message : "Could not book the shipment");
    },
  });

  const numbersOk = [weight, length, width, height].every((v) => Number(v) > 0);
  const volumetricKg = (Number(length) * Number(width) * Number(height)) / 5000;
  const a = preview.address;

  return (
    <div className="space-y-3">
      {preview.problems.length > 0 ? (
        <div className="space-y-1 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
          <div className="flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" /> Not ready to ship</div>
          <ul className="list-disc pl-5">
            {preview.problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Ready to ship</div>
      )}

      <div className="rounded-md bg-muted/40 p-3">
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium">{preview.paymentMode === "COD" ? `Cash on Delivery: collect ${formatCurrency(String(preview.codAmount))}` : "Prepaid"}</span>
        </div>
        {a && (
          <div className="mt-1 text-muted-foreground">
            To: {a.name}, {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.postalCode}
          </div>
        )}
        <div className="mt-1 text-muted-foreground">From: {preview.pickupLocation}</div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label className="text-xs">Package {preview.package.basis === "default" ? "(estimated: no print size found, check it)" : "(estimated from print size, adjust if needed)"}</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Weight (g)</Label>
            <Input type="number" min="50" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Service</Label>
            <select value={mode} onChange={(e) => setMode(e.target.value as "Surface" | "Express")} className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm">
              <option value="Surface">Surface (cheaper)</option>
              <option value="Express">Express (faster)</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Length (cm)</Label>
            <Input type="number" min="1" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Width (cm)</Label>
            <Input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Height (cm)</Label>
            <Input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>
        {numbersOk && volumetricKg * 1000 > Number(weight) && (
          <p className="mt-1 text-xs text-muted-foreground">Delhivery will charge by box size ({volumetricKg.toFixed(1)} kg), which is more than the actual weight.</p>
        )}
      </div>

      {preview.mode === "staging" && <p className="text-xs text-amber-700">Delhivery is in TEST mode: this booking will not create a real parcel.</p>}

      <Button className="w-full" disabled={!canCreate || preview.problems.length > 0 || !numbersOk || book.isPending} onClick={() => setConfirm(true)}>
        <Truck className="mr-2 h-4 w-4" />
        Ship with Delhivery
      </Button>
      {!canCreate && <p className="text-xs text-muted-foreground">You do not have permission to book shipments.</p>}

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book this shipment?</DialogTitle>
            <DialogDescription>
              {preview.mode === "production"
                ? "This books a real Delhivery shipment for this order and cannot be undone except by cancelling the shipment."
                : "Delhivery is in test mode, so this is a rehearsal booking."}{" "}
              {preview.paymentMode === "COD" ? `The courier will collect ${formatCurrency(String(preview.codAmount))} from the customer.` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>Not yet</Button>
            <Button disabled={book.isPending} onClick={() => book.mutate()}>{book.isPending ? "Booking with Delhivery…" : "Book shipment"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
