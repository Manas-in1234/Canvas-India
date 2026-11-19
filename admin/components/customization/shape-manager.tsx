"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ScanLine, Upload } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CustomShapeListItem, ShapePriceMode } from "@/lib/types/shape";
import type { CustomizerProductType } from "@/lib/types/customizer-product-type";
import type { SizePresetListItem } from "@/lib/types/size-preset";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Shape detection and shape customization, as one piece that lives inside the
 * Customization page's Add / Edit style dialog. It replaces the old standalone
 * "Shape detection" screen; the same endpoints, rules and permissions apply.
 */

/**
 * The id a style stores for a shape. The storefront names built-in shapes by their own id
 * ('shape-heart') but refers to an uploaded, traced shape as 'custom-<id>'.
 */
export const shapeKey = (s: Pick<CustomShapeListItem, "id" | "origin">) =>
  s.origin === "ADMIN_UPLOADED" ? `custom-${s.id}` : s.id;

/** Called after a shape is approved. addAsStyle = the admin also wants it as a card on the Products tab. */
export type ShapeApprovedHandler = (
  shape: CustomShapeListItem,
  opts: { addAsStyle: boolean },
) => void;

export function useShapes(enabled = true) {
  return useQuery({
    queryKey: ["shapes"],
    enabled,
    queryFn: () => apiClient.get<CustomShapeListItem[]>("/admin/shapes"),
  });
}

/** A small preview of how a shape clips the product, the same way the storefront draws it. */
export function ShapeThumb({
  shape,
  size = 40,
}: {
  shape: Pick<
    CustomShapeListItem,
    "name" | "clipPathType" | "clipPathValue" | "previewUrl"
  >;
  size?: number;
}) {
  const box = { width: size, height: size };
  if (shape.clipPathType === "SVG_PATH") {
    return (
      <svg
        viewBox="0 0 1 1"
        style={box}
        className="shrink-0 rounded bg-muted"
        aria-label={shape.name}
      >
        <path
          d={shape.clipPathValue}
          fill="currentColor"
          className="text-slate-800"
        />
      </svg>
    );
  }
  if (shape.clipPathType === "CSS_FUNCTION" && shape.clipPathValue) {
    return (
      <div
        style={box}
        className="flex shrink-0 items-center justify-center rounded bg-muted"
        aria-label={shape.name}
      >
        <div
          className="h-[80%] w-[80%] bg-slate-800"
          style={{ clipPath: shape.clipPathValue }}
        />
      </div>
    );
  }
  return shape.previewUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shape.previewUrl}
      alt={shape.name}
      style={box}
      className="shrink-0 rounded bg-muted object-contain"
    />
  ) : (
    <div style={box} className="shrink-0 rounded bg-muted" />
  );
}

function errorText(err: unknown, fallback: string) {
  return err instanceof ApiError || err instanceof Error
    ? err.message
    : fallback;
}

/** Upload a photo; the backend traces its outline and queues it for review. */
export function ShapeDetectDialog({
  open,
  onOpenChange,
  onDetected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (shape: CustomShapeListItem) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {open && (
          <ShapeDetectForm
            onOpenChange={onOpenChange}
            onDetected={onDetected}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ShapeDetectForm({
  onOpenChange,
  onDetected,
}: {
  onOpenChange: (open: boolean) => void;
  onDetected: (shape: CustomShapeListItem) => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file || !name.trim())
        throw new Error("Name and image are both required");
      if (file.size > 1024 * 1024)
        throw new Error("Image must be 1 MB or smaller");
      const form = new FormData();
      form.set("name", name.trim());
      form.set("file", file);
      return apiClient.upload<CustomShapeListItem>(
        "/admin/shapes/upload",
        form,
      );
    },
    onSuccess: (shape) => {
      toast.success(
        "Shape uploaded. The outline was traced and is waiting for review.",
      );
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
      onOpenChange(false);
      onDetected(shape);
    },
    onError: (err: unknown) =>
      toast.error(errorText(err, "Failed to upload shape")),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detect a new shape</DialogTitle>
        <DialogDescription>
          Upload a silhouette and the outline is traced automatically. It stays
          private until you approve it.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shape-name">Shape name</Label>
          <Input
            id="shape-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dog Silhouette"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shape-file">
            PNG or JPEG, up to 1 MB (a plain background works best)
          </Label>
          <Input
            id="shape-file"
            type="file"
            accept="image/png,image/jpeg"
            ref={fileRef}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          disabled={!file || !name.trim() || upload.isPending}
          onClick={() => upload.mutate()}
        >
          {upload.isPending ? "Tracing outline…" : "Upload & detect"}
        </Button>
      </DialogFooter>
    </>
  );
}

/** Sizes that belong to one shape are stored against this scope, keyed by the shape's own id. */
const SHAPE_SIZE_SCOPE = "__shape_generic__";

async function fetchShapeSizes(key: string) {
  const all = await apiClient.get<SizePresetListItem[]>(`/admin/size-presets?productTypeId=${SHAPE_SIZE_SCOPE}`);
  return all.filter((p) => p.shapeId === key);
}

const sizeBody = (key: string, w: number, h: number, canvasPrice: string | number, acrylicPrice: string | number) => ({
  productTypeId: SHAPE_SIZE_SCOPE,
  shapeId: key,
  label: `${w}" × ${h}"`,
  dimensionsSummary: `${w}" × ${h}"`,
  widthInches: String(w),
  heightInches: String(h),
  canvasPrice: String(canvasPrice),
  acrylicPrice: String(acrylicPrice),
  category: "RECOMMENDED",
});

/**
 * Gives a new shape a starting list of sizes: Single Print's square sizes and prices when there
 * are any, otherwise a small standard set. The admin then adds or removes sizes for that shape.
 */
export async function seedShapeSizes(key: string) {
  let seed: Array<{ w: number; canvas: string | number; acrylic: string | number }> = [];
  try {
    const single = await apiClient.get<SizePresetListItem[]>("/admin/size-presets?productTypeId=canvas-single");
    const seen = new Set<number>();
    seed = single
      .filter((p) => Number(p.widthInches) === Number(p.heightInches) && !seen.has(Number(p.widthInches)) && !!seen.add(Number(p.widthInches)))
      .map((p) => ({ w: Number(p.widthInches), canvas: p.canvasPrice, acrylic: p.acrylicPrice }));
  } catch {
    /* fall back to the standard set below */
  }
  if (seed.length === 0) {
    const sizes = [8, 10, 12, 16, 20, 24];
    const canvas = [349, 499, 699, 999, 1499, 2099];
    const acrylic = [699, 999, 1399, 1999, 2999, 4199];
    seed = sizes.map((w, i) => ({ w, canvas: canvas[i], acrylic: acrylic[i] }));
  }
  for (const row of seed) await apiClient.post("/admin/size-presets", sizeBody(key, row.w, row.w, row.canvas, row.acrylic));
}

/** Add and remove the sizes a customer can pick for this one shape. */
function ShapeSizesEditor({ shapeKey: key }: { shapeKey: string }) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission("size_presets.manage");
  const queryKey = ["size-presets", "shape", key];
  const { data, isLoading, isError } = useQuery({ queryKey, queryFn: () => fetchShapeSizes(key), enabled: hasPermission("size_presets.view") });
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [canvas, setCanvas] = useState("");
  const [acrylic, setAcrylic] = useState("");

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["size-presets"] });
  };
  const valid = Number(w) > 0 && Number(h) > 0 && canvas !== "" && Number(canvas) >= 0 && acrylic !== "" && Number(acrylic) >= 0;
  const add = useMutation({
    mutationFn: () => apiClient.post("/admin/size-presets", sizeBody(key, Number(w), Number(h), canvas, acrylic)),
    onSuccess: () => {
      toast.success("Size added");
      setW("");
      setH("");
      setCanvas("");
      setAcrylic("");
      refresh();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Failed to add size")),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/size-presets/${id}`),
    onSuccess: () => {
      toast.success("Size removed");
      refresh();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Failed to remove size")),
  });
  const seed = useMutation({
    mutationFn: () => seedShapeSizes(key),
    onSuccess: () => {
      toast.success("Standard sizes added");
      refresh();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Failed to add sizes")),
  });

  if (!hasPermission("size_presets.view")) return null;
  const sizes = data ?? [];
  return (
    <div className="space-y-3 rounded-md border p-4">
      <div>
        <div className="text-sm font-medium">Sizes for this shape</div>
        <p className="text-[11px] text-muted-foreground">
          The sizes customers pick in the Select Size popup when they choose this shape, with the price for each. Changes show on the
          storefront straight away.
        </p>
      </div>
      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : isError ? (
        <p className="text-sm text-destructive">Could not load this shape&apos;s sizes.</p>
      ) : sizes.length === 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No sizes yet. Customers see a standard set until you add some.</p>
          {canManage && (
            <Button size="sm" variant="outline" disabled={seed.isPending} onClick={() => seed.mutate()}>
              {seed.isPending ? "Adding…" : "Add standard sizes"}
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y rounded-md border text-sm">
          {sizes.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2">
              <span className="w-24 font-medium">{p.dimensionsSummary}</span>
              <span className="flex-1 text-xs text-muted-foreground">
                Canvas Rs.{p.canvasPrice} · Acrylic Rs.{p.acrylicPrice}
              </span>
              {canManage && (
                <Button size="sm" variant="ghost" disabled={remove.isPending} onClick={() => remove.mutate(p.id)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {canManage && (
        <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-5">
          <div className="space-y-1">
            <Label className="text-xs">Width (in)</Label>
            <Input type="number" min="1" step="0.5" value={w} onChange={(e) => setW(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Height (in)</Label>
            <Input type="number" min="1" step="0.5" value={h} onChange={(e) => setH(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Canvas Rs.</Label>
            <Input type="number" min="0" step="0.01" value={canvas} onChange={(e) => setCanvas(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Acrylic Rs.</Label>
            <Input type="number" min="0" step="0.01" value={acrylic} onChange={(e) => setAcrylic(e.target.value)} />
          </div>
          <Button disabled={!valid || add.isPending} onClick={() => add.mutate()}>
            {add.isPending ? "Adding…" : "Add size"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ShapeDetail({
  id,
  onBack,
  onApproved,
  styleLabel,
}: {
  id: string;
  onBack: () => void;
  onApproved?: ShapeApprovedHandler;
  styleLabel?: string;
}) {
  const {
    data: shape,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["shapes", id],
    queryFn: () => apiClient.get<CustomShapeListItem>(`/admin/shapes/${id}`),
  });

  const back = (
    <button
      type="button"
      onClick={onBack}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      All shapes
    </button>
  );

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !shape) {
    return (
      <div className="space-y-3">
        {back}
        <p className="text-sm text-destructive">Failed to load shape.</p>
      </div>
    );
  }
  // Keyed on the saved values so the form resets to what the server now holds.
  return (
    <ShapeDetailBody
      key={`${shape.id}|${shape.name}|${shape.priceMode}|${shape.flatPrice}|${shape.areaRatePerSqIn}|${shape.status}`}
      shape={shape}
      id={id}
      back={back}
      onBack={onBack}
      onApproved={onApproved}
      styleLabel={styleLabel}
    />
  );
}

function ShapeDetailBody({
  shape,
  id,
  back,
  onBack,
  onApproved,
  styleLabel,
}: {
  shape: CustomShapeListItem;
  id: string;
  back: React.ReactNode;
  onBack: () => void;
  onApproved?: ShapeApprovedHandler;
  styleLabel?: string;
}) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission("shapes.create");
  const [reason, setReason] = useState("");
  const [addAsStyle, setAddAsStyle] = useState(true);
  const [name, setName] = useState(shape.name);
  const [priceMode, setPriceMode] = useState<ShapePriceMode>(shape.priceMode);
  const [flatPrice, setFlatPrice] = useState(shape.flatPrice);
  const [areaRatePerSqIn, setAreaRatePerSqIn] = useState(
    shape.areaRatePerSqIn ?? "",
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["shapes", id] });
    queryClient.invalidateQueries({ queryKey: ["shapes"] });
  };

  const approve = useMutation({
    mutationFn: () =>
      apiClient.post(`/admin/shapes/${id}/approve`, {
        reason: reason || undefined,
      }),
    onSuccess: () => {
      toast.success("Shape approved. It can now be used by styles.");
      invalidate();
      onApproved?.(shape, { addAsStyle: !!styleLabel && addAsStyle });
    },
    onError: (err: unknown) =>
      toast.error(errorText(err, "Failed to approve shape")),
  });
  const reject = useMutation({
    mutationFn: () =>
      apiClient.post(`/admin/shapes/${id}/reject`, {
        reason: reason || undefined,
      }),
    onSuccess: () => {
      toast.success("Shape rejected");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(errorText(err, "Failed to reject shape")),
  });
  const save = useMutation({
    mutationFn: () =>
      apiClient.patch(`/admin/shapes/${id}`, {
        name,
        priceMode,
        flatPrice: priceMode === "FLAT" ? flatPrice : "0",
        areaRatePerSqIn:
          priceMode === "AREA_RATE" ? areaRatePerSqIn : undefined,
      }),
    onSuccess: () => {
      toast.success("Shape updated");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(errorText(err, "Failed to update shape")),
  });
  const toggle = useMutation({
    mutationFn: () =>
      apiClient.patch(`/admin/shapes/${id}`, {
        status: shape?.status === "REJECTED" ? "APPROVED" : "REJECTED",
      }),
    onSuccess: () => {
      toast.success(
        shape?.status === "REJECTED" ? "Shape re-enabled" : "Shape disabled",
      );
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(errorText(err, "Failed to update shape")),
  });

  // Removing a shape also tidies the style cards that depend on it.
  const [confirmRemove, setConfirmRemove] = useState(false);
  const stylesQuery = useQuery({
    queryKey: ["customizer-product-types"],
    enabled: confirmRemove,
    queryFn: () => apiClient.get<CustomizerProductType[]>("/admin/customizer-product-types"),
  });
  const key = shapeKey(shape);
  const usingStyles = (stylesQuery.data ?? []).filter((st) => st.supportedShapeIds?.includes(key) || st.defaultShapeId === key);
  const soleStyles = usingStyles.filter((st) => (st.supportedShapeIds ?? []).every((x) => x === key));
  const sharedStyles = usingStyles.filter((st) => !soleStyles.includes(st));

  const remove = useMutation({
    mutationFn: async () => {
      // Cards that offer only this shape go away; cards that offer others just lose it.
      for (const st of soleStyles) await apiClient.delete(`/admin/customizer-product-types/${st.id}`);
      for (const st of sharedStyles) {
        const left = (st.supportedShapeIds ?? []).filter((x) => x !== key);
        await apiClient.patch(`/admin/customizer-product-types/${st.id}`, {
          supportedShapeIds: left,
          defaultShapeId: st.defaultShapeId === key ? (left[0] ?? null) : st.defaultShapeId,
        });
      }
      // The shape's own sizes go with it (skipped quietly if this admin may not manage sizes).
      try {
        for (const p of await fetchShapeSizes(key)) await apiClient.delete(`/admin/size-presets/${p.id}`);
      } catch {
        /* nothing to clean up, or not permitted */
      }
      return apiClient.delete(`/admin/shapes/${id}`);
    },
    onSuccess: () => {
      toast.success(soleStyles.length ? `Shape and ${soleStyles.length} style card(s) removed` : "Shape removed");
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
      queryClient.invalidateQueries({ queryKey: ["customizer-product-types"] });
      queryClient.invalidateQueries({ queryKey: ["size-presets"] });
      setConfirmRemove(false);
      onBack();
    },
    onError: (err: unknown) => toast.error(errorText(err, "Failed to remove shape")),
  });

  const isBuiltIn = shape.origin === "BUILT_IN";
  const canReview =
    !isBuiltIn &&
    shape.status === "PENDING" &&
    (hasPermission("shapes.approve") || hasPermission("shapes.reject"));

  return (
    <div className="space-y-5">
      {back}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{shape.name}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{isBuiltIn ? "Built-in" : "Uploaded"}</Badge>
          <StatusBadge status={shape.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {!isBuiltIn && (
          <div className="space-y-2">
            <Label>Source photo</Label>
            {shape.previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shape.previewUrl}
                alt={shape.name}
                className="w-full rounded-md border bg-muted object-contain"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No preview available.
              </p>
            )}
          </div>
        )}
        <div className={`space-y-2 ${isBuiltIn ? "sm:col-span-2" : ""}`}>
          <Label>Shape outline</Label>
          <div className="mx-auto w-full max-w-xs">
            {shape.clipPathType === "SVG_PATH" ? (
              <svg
                viewBox="0 0 1 1"
                className="w-full rounded-md border bg-muted"
              >
                <path
                  d={shape.clipPathValue}
                  fill="currentColor"
                  className="text-slate-800"
                />
              </svg>
            ) : (
              <div
                className="aspect-square w-full rounded-md border bg-slate-800"
                style={{ clipPath: shape.clipPathValue }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            This is exactly how the shape clips the product in the customizer.
          </p>
        </div>
      </div>

      {canManage && (
        <div className="space-y-4 rounded-md border p-4">
          <div className="text-sm font-medium">Customize shape</div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={priceMode === "FLAT" ? "default" : "outline"}
              onClick={() => setPriceMode("FLAT")}
            >
              Flat price
            </Button>
            <Button
              type="button"
              size="sm"
              variant={priceMode === "AREA_RATE" ? "default" : "outline"}
              onClick={() => setPriceMode("AREA_RATE")}
            >
              Area rate (per sq.in)
            </Button>
          </div>
          {priceMode === "FLAT" ? (
            <div className="space-y-2">
              <Label>Flat price (Rs.)</Label>
              <Input
                type="number"
                step="0.01"
                value={flatPrice}
                onChange={(e) => setFlatPrice(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Rate per sq. inch (Rs.)</Label>
              <Input
                type="number"
                step="0.0001"
                value={areaRatePerSqIn}
                onChange={(e) => setAreaRatePerSqIn(e.target.value)}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button disabled={save.isPending} onClick={() => save.mutate()}>
              Save
            </Button>
            {shape.status !== "PENDING" && (
              <Button
                variant="outline"
                disabled={toggle.isPending}
                onClick={() => toggle.mutate()}
              >
                {shape.status === "REJECTED"
                  ? "Re-enable shape"
                  : "Disable shape"}
              </Button>
            )}
            {!isBuiltIn && (
              <Button variant="destructive" className="ml-auto" onClick={() => setConfirmRemove(true)}>
                Remove shape
              </Button>
            )}
          </div>
        </div>
      )}

      {!isBuiltIn && <ShapeSizesEditor shapeKey={key} />}

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {isBuiltIn ? "Added" : "Uploaded"}
          </span>
          <span>{formatDate(shape.createdAt)}</span>
        </div>
        {shape.reviewedAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reviewed</span>
            <span>{formatDate(shape.reviewedAt)}</span>
          </div>
        )}
        {shape.rejectionReason && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rejection reason</span>
            <span>{shape.rejectionReason}</span>
          </div>
        )}
      </div>

      <Dialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove &quot;{shape.name}&quot;?</DialogTitle>
            <DialogDescription>
              The shape and its uploaded image are deleted for good. Customers can no longer pick it. To keep it but
              hide it, use Disable shape instead.
            </DialogDescription>
          </DialogHeader>
          {stylesQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="space-y-2 text-sm">
              {soleStyles.length > 0 && (
                <p>
                  These style cards offer only this shape and will be removed from the Products tab:{" "}
                  <strong>{soleStyles.map((st) => st.name).join(", ")}</strong>.
                </p>
              )}
              {sharedStyles.length > 0 && (
                <p>
                  These styles keep working and just lose this shape:{" "}
                  <strong>{sharedStyles.map((st) => st.name).join(", ")}</strong>.
                </p>
              )}
              {usingStyles.length === 0 && !stylesQuery.isError && <p className="text-muted-foreground">No style uses this shape.</p>}
              {stylesQuery.isError && <p className="text-destructive">Could not check which styles use it. Remove them first, or try again.</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemove(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={remove.isPending || stylesQuery.isLoading || stylesQuery.isError} onClick={() => remove.mutate()}>
              {remove.isPending ? "Removing…" : "Remove shape"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {canReview && (
        <div className="space-y-3 rounded-md border p-4">
          <div className="text-sm font-medium">Review</div>
          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {styleLabel && hasPermission("shapes.approve") && (
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={addAsStyle}
                onChange={(e) => setAddAsStyle(e.target.checked)}
              />
              <span>
                Also add it to the Products tab as a {styleLabel} style
                <span className="block text-[11px] text-muted-foreground">
                  Creates a &quot;{shape.name} {styleLabel}&quot; card for customers, the way Heart Canvas works.
                </span>
              </span>
            </label>
          )}
          <div className="flex gap-2">
            {hasPermission("shapes.approve") && (
              <Button
                disabled={approve.isPending}
                onClick={() => approve.mutate()}
              >
                Approve
              </Button>
            )}
            {hasPermission("shapes.reject") && (
              <Button
                variant="destructive"
                disabled={reject.isPending}
                onClick={() => reject.mutate()}
              >
                Reject
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FILTERS: Array<[string, string]> = [
  ["ALL", "All shapes"],
  ["PENDING", "Awaiting review"],
  ["APPROVED", "Approved"],
  ["REJECTED", "Rejected"],
];

/** The full shape library (filter, review, edit price) in a dialog opened from the style form. */
export function ShapeManagerDialog({
  open,
  onOpenChange,
  initialShapeId,
  onApproved,
  styleLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialShapeId?: string | null;
  onApproved?: ShapeApprovedHandler;
  styleLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        {open && (
          <ShapeManagerBody
            initialShapeId={initialShapeId}
            onApproved={onApproved}
            styleLabel={styleLabel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ShapeManagerBody({
  initialShapeId,
  onApproved,
  styleLabel,
}: {
  initialShapeId?: string | null;
  onApproved?: ShapeApprovedHandler;
  styleLabel?: string;
}) {
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState<string | null>(
    initialShapeId ?? null,
  );
  const { data, isLoading, isError } = useShapes(true);

  const shapes = data ?? [];
  const visible = shapes.filter((s) => status === "ALL" || s.status === status);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Manage shapes</DialogTitle>
        <DialogDescription>
          Built-in shapes and detected outlines. Approved shapes can be offered
          by any style.
        </DialogDescription>
      </DialogHeader>

      {selected ? (
        <ShapeDetail
          id={selected}
          onBack={() => setSelected(null)}
          onApproved={onApproved}
          styleLabel={styleLabel}
        />
      ) : (
        <div className="space-y-4">
          <div className="status-filters" aria-label="Filter shapes">
            {FILTERS.map(([value, label]) => (
              <button
                key={value}
                className={status === value ? "active" : ""}
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
              >
                {label}
                <span>
                  {
                    shapes.filter((s) => value === "ALL" || s.status === value)
                      .length
                  }
                </span>
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive">Failed to load shapes.</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shapes here yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {visible.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => setSelected(shape.id)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50"
                >
                  <ShapeThumb shape={shape} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {shape.name}
                  </span>
                  <Badge variant="outline">
                    {shape.origin === "BUILT_IN" ? "Built-in" : "Uploaded"}
                  </Badge>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {shape.priceMode === "AREA_RATE"
                      ? `Rs.${shape.areaRatePerSqIn}/sq.in`
                      : `Rs.${shape.flatPrice}`}
                  </span>
                  <StatusBadge status={shape.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/** Buttons shown beside the style form's Shapes section. */
export function ShapeToolbar({
  canDetect,
  onDetect,
  onManage,
  pending,
}: {
  canDetect: boolean;
  onDetect: () => void;
  onManage: () => void;
  pending: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {canDetect && (
        <Button type="button" size="sm" variant="outline" onClick={onDetect}>
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Detect new shape
        </Button>
      )}
      <Button type="button" size="sm" variant="outline" onClick={onManage}>
        <ScanLine className="mr-1.5 h-3.5 w-3.5" />
        Manage shapes
        {pending > 0 && (
          <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 text-[10px] font-medium text-amber-800">
            {pending} to review
          </span>
        )}
      </Button>
    </div>
  );
}
