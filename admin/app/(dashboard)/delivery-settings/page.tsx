"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, CircleAlert, CircleDashed, Wifi } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { DeliveryConfig, PickupRecord } from "@/lib/types/shipping";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

type Check = { state: "ok" | "bad" | "todo"; title: string; detail: string };

function Icon({ state }: { state: Check["state"] }) {
  if (state === "ok") return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />;
  if (state === "bad") return <CircleAlert className="h-4 w-4 shrink-0 text-red-600" />;
  return <CircleDashed className="h-4 w-4 shrink-0 text-amber-600" />;
}

export default function DeliverySettingsPage() {
  const { data: cfg, isLoading, isError } = useQuery({ queryKey: ["delivery-config"], queryFn: () => apiClient.get<DeliveryConfig>("/shipping/config") });
  const pickups = useQuery({ queryKey: ["delivery-pickups"], queryFn: () => apiClient.get<PickupRecord[]>("/shipping/pickups") });
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const test = useMutation({
    mutationFn: () => apiClient.post<{ ok: boolean; message: string }>("/shipping/test-connection"),
    onSuccess: (r) => setResult(r),
    onError: (err: unknown) => {
      setResult({ ok: false, message: err instanceof ApiError ? err.message : "Could not run the test" });
      toast.error("Connection test failed");
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !cfg) return <p className="text-sm text-destructive">Failed to load delivery settings.</p>;

  const checks: Check[] = [
    cfg.configured
      ? { state: "ok", title: "Delhivery token is set", detail: "The backend can talk to Delhivery." }
      : { state: "bad", title: "Delhivery token is missing", detail: "Set the DELHIVERY_API_TOKEN secret on the backend worker." },
    cfg.mode === "production"
      ? { state: "ok", title: "Production mode", detail: "Bookings create real parcels on Delhivery's live system." }
      : { state: "todo", title: "Test mode (staging)", detail: "Fine for rehearsal. Before going live, use the production token and set DELHIVERY_MODE to production." },
    result?.ok
      ? { state: "ok", title: "Connection test passed", detail: result.message }
      : result
        ? { state: "bad", title: "Connection test failed", detail: result.message }
        : { state: "todo", title: "Run the connection test", detail: "Press Test connection below. It checks the token and the pickup pincode with Delhivery." },
    { state: "todo", title: "Pickup location is registered with Delhivery", detail: `Delhivery must have a warehouse named exactly "${cfg.pickupLocation}" (capitals and spacing count). If bookings fail with a warehouse error, ask Delhivery to register it or correct DELHIVERY_PICKUP_LOCATION.` },
    cfg.gstConfigured
      ? { state: "ok", title: "Seller GST number is set", detail: "Printed on bookings." }
      : { state: "todo", title: "Seller GST number not set", detail: "Delhivery asks for the seller GSTIN on bookings. Set DELHIVERY_SELLER_GST. Without it, some accounts reject shipments." },
    { state: "todo", title: "Wallet balance", detail: "Prepaid Delhivery accounts need at least Rs. 500 in the wallet to book. Top up in the Delhivery dashboard." },
    { state: "todo", title: "Do one test booking", detail: "Book a real order's shipment, print the label, then cancel it. This proves the full path before customers depend on it." },
    cfg.webhookConfigured
      ? { state: "ok", title: "Live tracking push is on", detail: "Delhivery pushes every scan to us." }
      : { state: "todo", title: "Live tracking push (optional)", detail: "Not set up. That is fine: tracking refreshes by itself every 20 minutes. Delhivery sets up the push on request (about 5 to 6 working days)." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="page-eyebrow">DELIVERY</div>
          <h1 className="text-2xl font-semibold tracking-tight">Delivery settings</h1>
          <p className="text-sm text-muted-foreground">Delhivery connection, pickup location and a go-live checklist.</p>
        </div>
        <Button onClick={() => test.mutate()} disabled={test.isPending}>
          <Wifi className="mr-2 h-4 w-4" />
          {test.isPending ? "Testing…" : "Test connection"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Go-live checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checks.map((c) => (
              <div key={c.title} className="flex gap-3 text-sm">
                <Icon state={c.state} />
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-muted-foreground">{c.detail}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Courier</span><span>Delhivery</span></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mode</span>
                <Badge variant="outline" className={cfg.mode === "production" ? "border-0 bg-emerald-100 text-emerald-800" : "border-0 bg-amber-100 text-amber-800"}>
                  {cfg.mode === "production" ? "Production (live)" : "Test (staging)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Token</span><span>{cfg.configured ? "Set" : "Missing"}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">HSN code</span><span>{cfg.hsnCode}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pickup location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="font-medium">{cfg.pickupLocation}</div>
              <div>{cfg.pickupAddress}</div>
              <div>PIN {cfg.pickupPincode}</div>
              <div>Phone {cfg.pickupPhone}</div>
              <div className="pt-1 text-xs text-muted-foreground">Parcels are collected here and returned here if undelivered.</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How delivery works here</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1. Ship", "Open a paid or Cash on Delivery order and press Ship with Delhivery. Check the weight and box size, then book. You get an AWB number."],
            ["2. Label and pickup", "Print the label, stick it on the parcel, then press Request pickup on the Shipments page."],
            ["3. Tracking", "Status updates by itself every 20 minutes (Refresh tracking forces it). Customers can track with the AWB on Delhivery's page."],
            ["4. Problems", "If a delivery fails, open Delivery problems. Call the customer, then choose: try again, new date, or correct the details."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="font-medium">{t}</div>
              <div className="text-muted-foreground">{d}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent pickup requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          {(pickups.data ?? []).length === 0 ? (
            <p className="text-muted-foreground">None yet.</p>
          ) : (
            (pickups.data ?? []).map((p) => (
              <div key={p.id} className="flex flex-wrap justify-between gap-2 border-b pb-1 last:border-0">
                <span>{p.date} {p.time} · {p.count} parcel(s)</span>
                <span className="text-muted-foreground">{p.pickupId ? `Pickup id ${p.pickupId} · ` : ""}requested {formatDate(p.createdAt)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backend settings (Cloudflare worker)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="mb-2 text-muted-foreground">These are set on the backend worker, not here. Secrets use wrangler secret put.</p>
          <div className="grid gap-x-6 gap-y-1 font-mono text-xs sm:grid-cols-2">
            {[
              ["DELHIVERY_API_TOKEN", "secret, required"],
              ["DELHIVERY_MODE", "staging or production (default production)"],
              ["DELHIVERY_PICKUP_LOCATION", "exact Delhivery warehouse name"],
              ["DELHIVERY_PICKUP_PINCODE / PHONE / ADDRESS", "return address"],
              ["DELHIVERY_SELLER_GST", "seller GSTIN"],
              ["DELHIVERY_WEBHOOK_SECRET", "secret, for the optional tracking push"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b py-1"><span>{k}</span><span className="text-muted-foreground">{v}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
