"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PackagePlus, SlidersHorizontal } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { InventoryItem, InventoryMovement } from "@/lib/types/inventory";
import type { ProductListItem } from "@/lib/types/product";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InventoryPage() {
  const { hasPermission } = usePermission();
  const canAdjust = hasPermission("inventory.adjust");
  const queryClient = useQueryClient();

  const [adjusting, setAdjusting] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const [stockingIn, setStockingIn] = useState(false);
  const [stockInProductId, setStockInProductId] = useState("");
  const [stockInQty, setStockInQty] = useState("");
  const [stockInReason, setStockInReason] = useState("");

  const itemsQuery = useQuery({
    queryKey: ["inventory", "items"],
    queryFn: () => apiClient.get<InventoryItem[]>("/inventory"),
  });

  const movementsQuery = useQuery({
    queryKey: ["inventory", "movements"],
    queryFn: () => apiClient.get<InventoryMovement[]>("/inventory/movements"),
  });

  const productsQuery = useQuery({
    queryKey: ["products", "for-stock-in"],
    queryFn: () => apiClient.get<ProductListItem[]>("/products?admin=1"),
    enabled: stockingIn,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const adjustMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/inventory/adjust", {
        variantId: adjusting!.variantId,
        quantity: Number(adjustQty),
        reason: adjustReason || undefined,
      }),
    onSuccess: () => {
      toast.success("Stock adjusted");
      setAdjusting(null);
      setAdjustQty("");
      setAdjustReason("");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to adjust stock"),
  });

  const stockInMutation = useMutation({
    mutationFn: () =>
      apiClient.post("/inventory/stock-in", {
        productId: stockInProductId,
        quantity: Number(stockInQty),
        reason: stockInReason || undefined,
      }),
    onSuccess: () => {
      toast.success("Stock added");
      setStockingIn(false);
      setStockInProductId("");
      setStockInQty("");
      setStockInReason("");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(err instanceof ApiError ? err.message : "Failed to add stock"),
  });

  const adjustQtyNumber = Number(adjustQty);
  const adjustValid = adjustQty.trim() !== "" && Number.isInteger(adjustQtyNumber) && adjustQtyNumber !== 0;
  const stockInQtyNumber = Number(stockInQty);
  const stockInValid =
    !!stockInProductId && stockInQty.trim() !== "" && Number.isInteger(stockInQtyNumber) && stockInQtyNumber > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Stock on hand for products that carry their own fixed SKU — most custom-print
            products are made to order and are not tracked here.
          </p>
        </div>
        {canAdjust && (
          <Button size="sm" onClick={() => setStockingIn(true)}>
            <PackagePlus className="mr-1.5 h-4 w-4" />
            Stock in a product
          </Button>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Stock on hand</h2>
        {itemsQuery.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : itemsQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load inventory.</p>
        ) : !itemsQuery.data || itemsQuery.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No products are stocked yet. Use "Stock in a product" to start tracking one.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Available</th>
                  <th className="px-3 py-2 font-medium">Reserved</th>
                  <th className="px-3 py-2 font-medium">Damaged</th>
                  <th className="px-3 py-2 font-medium">Updated</th>
                  {canAdjust && <th className="px-3 py-2" />}
                </tr>
              </thead>
              <tbody className="divide-y">
                {itemsQuery.data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2 font-medium">{item.variant.sku}</td>
                    <td className="px-3 py-2">
                      <span className={item.available <= item.reorderLevel ? "font-semibold text-destructive" : ""}>
                        {item.available}
                      </span>
                    </td>
                    <td className="px-3 py-2">{item.reserved}</td>
                    <td className="px-3 py-2">{item.damaged}</td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(item.updatedAt)}</td>
                    {canAdjust && (
                      <td className="px-3 py-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAdjusting(item);
                            setAdjustQty("");
                            setAdjustReason("");
                          }}
                        >
                          <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                          Adjust
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Recent stock movements</h2>
        {movementsQuery.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : movementsQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load stock movements.</p>
        ) : !movementsQuery.data || movementsQuery.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stock movements yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">When</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Qty</th>
                  <th className="px-3 py-2 font-medium">Before → After</th>
                  <th className="px-3 py-2 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {movementsQuery.data.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(m.createdAt)}</td>
                    <td className="px-3 py-2 font-medium">{m.inventoryItem.variant.sku}</td>
                    <td className="px-3 py-2">{m.movementType}</td>
                    <td className={`px-3 py-2 ${m.quantity < 0 ? "text-destructive" : ""}`}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {m.beforeQuantity} → {m.afterQuantity}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{m.referenceType ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!adjusting} onOpenChange={(open) => !open && setAdjusting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock for {adjusting?.variant.sku}</DialogTitle>
            <DialogDescription>
              Enter a positive number to add stock, or a negative number to remove it. Currently{" "}
              {adjusting?.available} available.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Quantity, e.g. 10 or -3"
              value={adjustQty}
              onChange={(e) => setAdjustQty(e.target.value)}
            />
            <Input
              placeholder="Reason (optional) — e.g. damaged, physical count correction"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
            <Button disabled={!adjustValid || adjustMutation.isPending} onClick={() => adjustMutation.mutate()}>
              Save adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={stockingIn} onOpenChange={(open) => !open && setStockingIn(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock in a product</DialogTitle>
            <DialogDescription>
              Start tracking stock for a product, or add to what it already has. Creates a
              default SKU automatically the first time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <select
              className="h-9 w-full rounded-md border bg-background px-2"
              value={stockInProductId}
              onChange={(e) => setStockInProductId(e.target.value)}
            >
              <option value="">Select a product…</option>
              {productsQuery.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Quantity to add"
              value={stockInQty}
              onChange={(e) => setStockInQty(e.target.value)}
            />
            <Input
              placeholder="Reason (optional) — e.g. new shipment arrived"
              value={stockInReason}
              onChange={(e) => setStockInReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStockingIn(false)}>
              Cancel
            </Button>
            <Button disabled={!stockInValid || stockInMutation.isPending} onClick={() => stockInMutation.mutate()}>
              Add stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
