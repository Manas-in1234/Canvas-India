"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, ScanLine } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CustomShapeListItem } from "@/lib/types/shape";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { usePermission } from "@/lib/auth/use-permission";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShapesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["shapes"],
    queryFn: () => apiClient.get<CustomShapeListItem[]>("/admin/shapes"),
  });

  const createShapeMutation = useMutation({
    mutationFn: async () => {
      if (!file || !name.trim()) {
        throw new Error("Name and image are both required");
      }

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
      toast.success("Shape uploaded — tracing an outline now awaiting review");
      queryClient.invalidateQueries({ queryKey: ["shapes"] });
      setOpen(false);
      setName("");
      setFile(null);
      router.push(`/shapes/placeholder?id=${encodeURIComponent(shape.id)}`);
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Failed to upload shape",
      );
    },
    onSettled: () => setIsUploading(false),
  });

  const columns: DataTableColumn<CustomShapeListItem>[] = [
    {
      header: "Preview",
      cell: (row) =>
        row.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.previewUrl}
            alt={row.name}
            className="h-10 w-10 rounded object-contain bg-muted"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted" />
        ),
    },
    { header: "Name", cell: (row) => row.name },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    { header: "Uploaded", cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="page-eyebrow">CUSTOMIZATION STUDIO</div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Shape detection
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn a photo into a custom shape. Every detected outline stays
            private until you approve it.
          </p>
        </div>

        {hasPermission("shapes.create") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Shape
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload a new shape</DialogTitle>
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
                    PNG or JPEG, up to 1 MB (plain background works best)
                  </Label>
                  <Input
                    id="shape-file"
                    type="file"
                    accept="image/png,image/jpeg"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={
                    !file || !name.trim() || createShapeMutation.isPending
                  }
                  onClick={() => {
                    setIsUploading(true);
                    createShapeMutation.mutate();
                  }}
                >
                  {isUploading ? "Uploading…" : "Upload & Trace"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="shape-steps">
        <div className="shape-step">
          <span>01</span>
          <div>
            <strong>Upload a shape</strong>
            <small>PNG or JPEG · up to 1 MB</small>
          </div>
        </div>
        <div className="shape-step">
          <span>
            <ScanLine size={17} />
          </span>
          <div>
            <strong>Detect the outline</strong>
            <small>A silhouette traced automatically</small>
          </div>
        </div>
        <div className="shape-step">
          <span>03</span>
          <div>
            <strong>Review & publish</strong>
            <small>Approved shapes appear in the customizer</small>
          </div>
        </div>
      </div>
      <div className="status-filters" aria-label="Filter custom shapes">
        {[
          ["ALL", "All shapes"],
          ["PENDING", "Awaiting review"],
          ["APPROVED", "Approved"],
          ["REJECTED", "Rejected"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={status === value ? "active" : ""}
            aria-pressed={status === value}
            onClick={() => setStatus(value)}
          >
            {label}
            <span>
              {
                (data || []).filter(
                  (shape) => value === "ALL" || shape.status === value,
                ).length
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
      ) : (
        <DataTable
          columns={columns}
          data={(data ?? []).filter(
            (shape) => status === "ALL" || shape.status === status,
          )}
          getRowKey={(row) => row.id}
          onRowClick={(row) =>
            router.push(`/shapes/placeholder?id=${encodeURIComponent(row.id)}`)
          }
          emptyMessage="No shapes uploaded yet."
        />
      )}
    </div>
  );
}
