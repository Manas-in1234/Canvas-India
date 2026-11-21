"use client";
import { useRecordId } from "@/lib/use-record-id";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import type { OrderDetail } from "@/lib/types/order";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { OrderShippingPanel } from "@/components/delivery/order-shipping-panel";
import { CodCollectionCard } from "@/components/delivery/cod-collection-card";
import { InvoiceButton } from "@/components/orders/invoice";
import { OrderEditor } from "@/components/order-editor";

// variantSnapshot.options only ever carries two generic Size/Style entries
// (set by the backend as a fallback) - the customer's actual picks (border,
// frame, wrap, display, lamination, layout, etc.) are stored verbatim on
// configurationSnapshot but were never rendered, so production had no way
// to see what the customer actually configured. Render every simple
// (non-nested) field from it instead.
const CONFIG_LABEL_OVERRIDES: Record<string, string> = {
  sizeId: "Size",
  productTypeId: "Product Type",
  customThicknessMm: "Custom Thickness (mm)",
  customThicknessInches: "Custom Thickness (in)",
  borderWidth: "Border Width",
  borderColor: "Border Color",
  mirrorImage: "Mirror Image",
  majorRetouchText: "Retouch Notes",
  proofRequested: "Proof Requested",
  quotePreference: "Quote Preference",
  quoteTemplate: "Quote Template",
  quoteCustomText: "Quote Text",
  quoteAuthor: "Quote Author",
  quoteBgColor: "Quote Background Color",
  quoteFontFamily: "Quote Font",
  quoteTextColor: "Quote Text Color",
  digitalPaintingEffect: "Digital Painting Effect",
  digitalPaintingSubject: "Digital Painting Subject",
  digitalPaintingBackground: "Digital Painting Background",
  peopleCount: "People Count",
  petsCount: "Pets Count",
  busRollLines: "Bus Roll Lines",
  busRollBackgroundColor: "Bus Roll Background Color",
  busRollPattern: "Bus Roll Pattern",
  busRollFont: "Bus Roll Font",
  bannerUnit: "Banner Unit",
  bannerWidthInches: "Banner Width (in)",
  bannerHeightInches: "Banner Height (in)",
  bannerBackgroundColor: "Banner Background Color",
  bannerHardware: "Banner Hardware",
  studQuantity: "Stud Quantity",
  hardwarePrice: "Hardware Price",
  popArtStyleName: "Pop Art Style",
  lyricTemplateName: "Lyric Template",
  lyricTitle: "Lyric Title",
  lyricArtist: "Lyric Artist",
  lyricDateOrNames: "Lyric Date/Names",
  lyricFontFamily: "Lyric Font",
  lyricTextColor: "Lyric Text Color",
  lyricLayout: "Lyric Layout",
};

// Link to the item on the live storefront.
// - A customized item (it has a productTypeId in its configuration) opens that style in the customizer.
//   Its saved product id/slug is NOT used: the customizer falls back to an arbitrary catalogue product when
//   it was opened without one, which sent admins to unrelated products.
// - A plain catalogue item opens its product page.
// - Anything with neither falls back to a storefront search on the product's base name.
function storeItemLink(item: OrderDetail["items"][number]): { href: string; label: string } {
  const config = item.configurationSnapshot ?? {};
  const material = config.material === "acrylic" ? "acrylic" : config.material === "canvas" ? "canvas" : null;
  const typeId = typeof config.productTypeId === "string" ? config.productTypeId : null;
  if (material && typeId) {
    return { href: `https://canvassindia.com/customize/${material}/${encodeURIComponent(typeId)}`, label: "Open this style on store ↗" };
  }
  const ref = item.variantSnapshot.productSlug || item.variantSnapshot.productId;
  if (ref) return { href: `https://canvassindia.com/products/${encodeURIComponent(ref)}`, label: "View product on store ↗" };
  const baseName = item.productNameSnapshot.split(" - ")[0].trim();
  return { href: `https://canvassindia.com/search?q=${encodeURIComponent(baseName)}`, label: "Find product on store ↗" };
}

function formatConfigLabel(key: string): string {
  if (CONFIG_LABEL_OVERRIDES[key]) return CONFIG_LABEL_OVERRIDES[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function getConfigEntries(configurationSnapshot: Record<string, unknown> | null): [string, string][] {
  if (!configurationSnapshot) return [];
  return Object.entries(configurationSnapshot)
    .filter(([key, value]) => {
      if (key === "previewImage") return false;
      if (value === null || value === undefined || value === "") return false;
      if (Array.isArray(value)) return value.length > 0 && value.every((v) => typeof v === "string" || typeof v === "number");
      return typeof value !== "object";
    })
    .map(([key, value]): [string, string] => [
      formatConfigLabel(key),
      Array.isArray(value) ? value.join(", ") : typeof value === "boolean" ? (value ? "Yes" : "No") : String(value),
    ]);
}

// Pure frontend mock - no API call, no database row. Visit /orders/qa-dummy
// in the admin to see every customization spec (border, color, finish,
// layout/template, display, frame, wrap, mirror image, backing, surface
// finish) rendered on this page, for visual QA only.
const QA_DUMMY_ORDER: OrderDetail = {
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
  customer: {
    id: "qa-dummy-customer",
    name: "QA Dummy Order - DO NOT SHIP",
    email: "qa-dummy-order@canvassindia.com",
    phone: "9999999999",
  },
  items: [
    {
      id: "qa-dummy-item-1",
      orderId: "qa-dummy",
      variantId: null,
      productNameSnapshot: "QA TEST - Oval Canvas (DO NOT SHIP)",
      variantSnapshot: {
        sku: "QA-CANVAS-OVAL",
        options: [
          { group: "Size", value: "12x16" },
          { group: "Style", value: "Black Border Wrap" },
        ],
      },
      priceSnapshot: "1999.00",
      configurationSnapshot: {
        material: "canvas",
        productTypeId: "canvas-oval",
        sizeId: "oval-12x16",
        shape: "Oval",
        thickness: 'Thick Gallery Wrap (1.5")',
        wrap: "Black Border Wrap",
        borderWidth: "Medium (6mm)",
        borderColor: "#000000",
        frame: "Brushed Gold Frame",
        mirrorImage: true,
        display: "Ready to Hang Kit",
        lamination: "Matte Laminate",
        retouching: ["Skin Smoothing", "Color Correction"],
        majorRetouchText: "Please remove the background person on the left",
        proofRequested: true,
        template: "Golden Hour Template",
        hardware: "Ready to Hang Kit",
      },
      designVersionSnapshot: null,
      taxSnapshot: "0.00",
      quantity: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "qa-dummy-item-2",
      orderId: "qa-dummy",
      variantId: null,
      productNameSnapshot: "QA TEST - Acrylic Print (DO NOT SHIP)",
      variantSnapshot: {
        sku: "QA-ACRYLIC-RECT",
        options: [
          { group: "Size", value: "16x20" },
          { group: "Style", value: "Standard" },
        ],
      },
      priceSnapshot: "2999.00",
      configurationSnapshot: {
        material: "acrylic",
        productTypeId: "acrylic-print",
        sizeId: "rec-16x20",
        shape: "Rectangle",
        thickness: "5mm Optical Acrylic",
        borderWidth: "Thin (3mm)",
        borderColor: "#FFFFFF",
        backing: "Brushed Aluminum Backing",
        surfaceFinish: "High Gloss",
        display: "Acrylic Standoffs",
        hardware: "Acrylic Standoffs",
        studQuantity: 4,
        proofRequested: false,
      },
      designVersionSnapshot: null,
      taxSnapshot: "0.00",
      quantity: 1,
      createdAt: new Date().toISOString(),
    },
  ],
  addresses: [
    {
      id: "qa-dummy-address",
      type: "SHIPPING",
      name: "QA Dummy Order",
      line1: "Test Street 1",
      line2: null,
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500076",
      country: "IN",
      phone: "9999999999",
    },
  ],
  events: [],
  notes: [],
  payments: [],
};

export function OrderDetailClient({ id: initialId }: { id: string }) {
  const id = useRecordId(initialId);
  const isQaDummy = id === "qa-dummy";
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const {
    data: fetchedOrder,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders", id],
    enabled: !!id && id !== "placeholder" && !isQaDummy,
    queryFn: () => apiClient.get<OrderDetail>(`/orders/${id}`),
  });

  const order = isQaDummy ? QA_DUMMY_ORDER : fetchedOrder;

  const cancelMutation = useMutation({
    mutationFn: () => apiClient.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel order",
      );
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => apiClient.post(`/orders/${id}/accept`),
    onSuccess: () => {
      toast.success("Order accepted - production started");
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to accept order");
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: (action: "hide" | "show" | "archive" | "restore") => apiClient.put(`/admin/orders/${id}/visibility`, { action }),
    onSuccess: async (_, action) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success({ hide: "Order hidden", show: "Order shown", archive: "Order moved to Archived", restore: "Order restored" }[action]);
      if (action === "archive") router.push("/orders");
    },
    onError: error => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return <p className="text-sm text-destructive">Failed to load order.</p>;
  }

  const archived = order.adminVisibility === "ARCHIVED";
  const canEdit = hasPermission("orders.edit");
  const canCancel =
    !archived &&
    !isQaDummy &&
    hasPermission("orders.cancel") &&
    order.orderStatus !== "CANCELLED" &&
    order.orderStatus !== "COMPLETED";

  const canAccept =
    canEdit && !archived &&
    !isQaDummy &&
    order.paymentLabel !== "UNVERIFIED" &&
    (order.orderStatus === "CONFIRMED" || order.orderStatus === "PAID");

  const shippingAddress = order.addresses.find((a) => a.type === "SHIPPING");
  const billingAddress = order.addresses.find((a) => a.type === "BILLING");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/orders"
            className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {order.orderNumber}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <InvoiceButton orderId={order.id} />
          <StatusBadge status={order.orderStatus} />
          <StatusBadge status={order.paymentLabel ?? order.paymentStatus} />
          <StatusBadge status={order.shippingStatus} />
          {order.adminVisibility && order.adminVisibility !== "VISIBLE" && <StatusBadge status={order.adminVisibility} />}
        </div>
      </div>

      {editing && <OrderEditor order={order} onClose={() => setEditing(false)} />}
      {(canAccept || canCancel || canEdit) && (
        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (archived ? (
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => visibilityMutation.mutate("restore")}>Restore order</Button>
          ) : <>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => setEditing(true)}>Edit order</Button>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending}
              onClick={() => visibilityMutation.mutate(order.adminVisibility === "HIDDEN" ? "show" : "hide")}>
              {order.adminVisibility === "HIDDEN" ? "Show order" : "Hide order"}
            </Button>
            <Button size="sm" variant="outline" disabled={visibilityMutation.isPending} onClick={() => {
              if (confirm("Move this order to Archived? You can restore it later. Payment and order history will be kept.")) visibilityMutation.mutate("archive");
            }}>Delete order</Button>
          </>)}
          {canAccept && (
            <Button size="sm" disabled={acceptMutation.isPending} onClick={() => acceptMutation.mutate()}>
              {acceptMutation.isPending ? "Accepting…" : "Accept Order"}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelMutation.isPending}
              onClick={() => confirm("Cancel this order? If it was paid online, the full amount will be refunded to the customer automatically.") && cancelMutation.mutate()}
            >
              {cancelMutation.isPending ? "Cancelling…" : "Cancel Order"}
            </Button>
          )}
          {canAccept && (
            <span className="text-xs text-muted-foreground">
              Accepting starts production; the customer can no longer cancel after that.
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-0"
              >
                {(item.variantSnapshot.previewImage || item.variantSnapshot.imageUrl) && (
                  <a
                    href={item.variantSnapshot.previewImage || item.variantSnapshot.imageUrl || undefined}
                    target="_blank"
                    rel="noreferrer"
                    title={item.variantSnapshot.previewImage ? "Customer's customized design" : "Customer's photo / listing image"}
                    className="shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.variantSnapshot.previewImage || item.variantSnapshot.imageUrl || ""}
                      alt={item.productNameSnapshot}
                      className="h-24 w-24 rounded-md border bg-muted object-contain"
                    />
                  </a>
                )}
                <div className="min-w-0 flex-1">
                  {/* Always render snapshot fields — never re-fetch live product data
                      for a historical order (scope §89/§114). */}
                  <div className="font-medium">{item.productNameSnapshot}</div>
                  {(() => {
                    const link = storeItemLink(item);
                    return (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {link.label}
                      </a>
                    );
                  })()}
                  <div className="text-sm text-muted-foreground">
                    SKU: {item.variantSnapshot.sku}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.variantSnapshot.options
                      .map((o) => `${o.group}: ${o.value}`)
                      .join(", ")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                  {getConfigEntries(item.configurationSnapshot).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {getConfigEntries(item.configurationSnapshot).map(([label, value]) => (
                        <span key={label}>
                          <span className="font-medium text-foreground/80">{label}:</span> {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div>{formatCurrency(item.priceSnapshot)}</div>
                  <div className="text-muted-foreground">
                    Tax: {formatCurrency(item.taxSnapshot)}
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-1 pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <OrderShippingPanel orderId={order.id} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="font-medium">{order.customer.name}</div>
              {order.customer.email && (
                <div className="text-muted-foreground">
                  {order.customer.email}
                </div>
              )}
              {order.customer.phone && (
                <div className="text-muted-foreground">
                  {order.customer.phone}
                </div>
              )}
            </CardContent>
          </Card>

          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div>{shippingAddress.name}</div>
                <div>{shippingAddress.line1}</div>
                {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
                <div>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                </div>
                <div>{shippingAddress.country}</div>
                {shippingAddress.phone && <div>{shippingAddress.phone}</div>}
              </CardContent>
            </Card>
          )}

          {billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div>{billingAddress.name}</div>
                <div>{billingAddress.line1}</div>
                {billingAddress.line2 && <div>{billingAddress.line2}</div>}
                <div>
                  {billingAddress.city}, {billingAddress.state}{" "}
                  {billingAddress.postalCode}
                </div>
                <div>{billingAddress.country}</div>
              </CardContent>
            </Card>
          )}

          {order.paymentLabel === 'UNVERIFIED' && <p className="text-sm text-muted-foreground">
            No captured payment is linked to this order. The total reflects the original order record.
          </p>}
          {order.payments.filter(payment => order.paymentLabel !== 'UNVERIFIED' ||
            payment.provider !== 'RAZORPAY' || Boolean(payment.providerRef)).map((payment) => (
            <Card key={payment.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Payment ({payment.provider})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={payment.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                {payment.providerRef && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs">
                      {payment.providerRef}
                    </span>
                  </div>
                )}
                {payment.provider === 'COD' && <CodCollectionCard payment={payment} invalidateKeys={[["orders", order.id]]} />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {order.events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events recorded.</p>
          ) : (
            <ol className="space-y-3 border-l pl-4">
              {order.events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="text-sm font-medium">
                    {event.type.replaceAll("_", " ")}
                  </div>
                  {event.message && (
                    <div className="text-sm text-muted-foreground">
                      {event.message}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatDate(event.createdAt)}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
