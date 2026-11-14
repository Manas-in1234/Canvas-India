"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { OrderDetail } from "@/lib/types/order";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";

const addressFields = [
  ["name", "Recipient", 150], ["line1", "Address", 250], ["line2", "Address line 2", 250],
  ["city", "City", 100], ["state", "State", 100], ["postalCode", "Postal code", 24],
  ["country", "Country", 80], ["phone", "Phone", 40],
] as const;
type Address = Record<(typeof addressFields)[number][0], string>;
type Line = { key: string; productId: string; quantity: number };
type CatalogProduct = { id: string; name: string; basePrice: string };
const selectClass = "w-full rounded-lg border bg-background px-2 py-1.5 text-sm";

export function OrderEditor({ order, onClose, onSaved }: {
  order?: OrderDetail; onClose: () => void; onSaved?: (id: string) => void;
}) {
  const client = useQueryClient();
  const existing = order?.addresses.find(row => row.type === "SHIPPING");
  const draft = order?.orderStatus === "DRAFT" && order.paymentStatus === "PENDING" && order.events.some(event => event.type === "order.manual_created");
  const canEditItems = !order || draft;
  const canEditAddress = !order || order.shippingStatus === "NOT_SHIPPED";
  const [address, setAddress] = useState<Address>(() => ({
    name: existing?.name ?? "", line1: existing?.line1 ?? "", line2: existing?.line2 ?? "",
    city: existing?.city ?? "", state: existing?.state ?? "", postalCode: existing?.postalCode ?? "",
    country: existing?.country ?? "IN", phone: existing?.phone ?? "",
  }));
  const [customerId, setCustomerId] = useState("");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>(() => draft ? order.items.map(item => ({
    key: item.id, productId: String(item.configurationSnapshot?.manualProductId ?? ""), quantity: item.quantity,
  })) : [{ key: crypto.randomUUID(), productId: "", quantity: 1 }]);
  const requestId = useRef(crypto.randomUUID());
  const customers = useQuery({ queryKey: ["manual-order-customers"], enabled: !order,
    queryFn: () => apiClient.get<{ id: string; name: string; email?: string }[]>("/admin/orders/customers") });
  const products = useQuery({ queryKey: ["manual-order-products"], enabled: canEditItems,
    queryFn: () => apiClient.get<CatalogProduct[]>("/admin/orders/catalog") });
  const save = useMutation({
    mutationFn: async () => {
      const body = { shippingAddress: canEditAddress ? address : undefined, note,
        items: canEditItems ? lines.map(({ productId, quantity }) => ({ productId, quantity })) : undefined };
      if (order) {
        await apiClient.patch("/admin/orders/" + order.id, body);
        return order.id;
      }
      return (await apiClient.post<{ id: string }>("/admin/orders", { ...body, customerId, requestId: requestId.current })).id;
    },
    onSuccess: async id => {
      await client.invalidateQueries({ queryKey: ["orders"] });
      onClose();
      onSaved?.(id);
    },
  });
  const total = lines.reduce((sum, line) => sum + Number(products.data?.find(p => p.id === line.productId)?.basePrice ?? 0) * line.quantity, 0);

  return (
    <Dialog open onOpenChange={open => { if (!open && !save.isPending) onClose(); }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Edit order" : "Add order"}</DialogTitle>
          <DialogDescription>{order ? "Update the delivery address or add an internal note." : "Create an unpaid draft for an existing customer using current catalog prices."}</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
          {!order && (
            <label className="block space-y-1 text-sm">Customer
              <select className={selectClass} required value={customerId} onChange={event => {
                setCustomerId(event.target.value);
                const customer = customers.data?.find(row => row.id === event.target.value);
                if (customer) setAddress(current => ({ ...current, name: customer.name }));
              }}>
                <option value="">{customers.isPending ? "Loading customers…" : "Choose a customer"}</option>
                {customers.data?.map(row => <option value={row.id} key={row.id}>{row.name}{row.email ? " · " + row.email : ""}</option>)}
              </select>
            </label>
          )}
          {canEditItems && <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium">Order items</legend>
            {lines.map((line, index) => <div key={line.key} className="flex items-center gap-2">
              <select className={selectClass} aria-label={`Product ${index + 1}`} required value={line.productId}
                onChange={event => setLines(rows => rows.map(row => row.key === line.key ? { ...row, productId: event.target.value } : row))}>
                <option value="">{products.isPending ? "Loading products…" : "Choose a product"}</option>
                {line.productId && products.data && !products.data.some(row => row.id === line.productId) &&
                  <option value={line.productId} disabled>Product no longer available</option>}
                {products.data?.map(row => <option value={row.id} key={row.id}>{row.name} · {formatCurrency(row.basePrice)}</option>)}
              </select>
              <Input className="w-20" aria-label={`Quantity ${index + 1}`} type="number" required min={1} max={999} value={line.quantity}
                onChange={event => setLines(rows => rows.map(row => row.key === line.key ? { ...row, quantity: Number(event.target.value) } : row))} />
              <Button type="button" variant="ghost" size="sm" disabled={lines.length === 1}
                onClick={() => setLines(rows => rows.filter(row => row.key !== line.key))}>Remove</Button>
            </div>)}
            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="outline" size="sm" disabled={lines.length >= 100}
                onClick={() => setLines(rows => [...rows, { key: crypto.randomUUID(), productId: "", quantity: 1 }])}>Add item</Button>
              <span className="text-sm font-medium">Draft total {formatCurrency(total)}</span>
            </div>
          </fieldset>}
          {canEditAddress && <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-medium">Delivery address</legend>
            {addressFields.map(([key, label, max]) => (
              <label key={key} className="space-y-1 text-sm">{label}
                <Input value={address[key]} maxLength={max} required={key !== "line2" && key !== "phone"}
                  onChange={event => setAddress(current => ({ ...current, [key]: event.target.value }))} />
              </label>
            ))}
          </fieldset>}
          <label className="block space-y-1 text-sm">Internal note
            <textarea className={selectClass} rows={3} maxLength={2000} value={note} onChange={event => setNote(event.target.value)} required={!canEditAddress} />
          </label>
          {(customers.error || products.error || save.error) && <p role="alert" className="text-sm text-destructive">
            {(save.error ?? customers.error ?? products.error)?.message}
          </p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={save.isPending}>Cancel</Button>
            <Button type="submit" disabled={save.isPending || (!order && !customers.data) ||
              (canEditItems && (!products.data || lines.some(line => !products.data?.some(row => row.id === line.productId))))}>
              {save.isPending ? "Saving…" : order ? "Save changes" : "Create draft order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
