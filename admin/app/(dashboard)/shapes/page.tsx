'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import type { CustomShapeListItem } from '@/lib/types/shape';
import { DataTable, type DataTableColumn } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { usePermission } from '@/lib/auth/use-permission';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export default function ShapesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shapes'],
    queryFn: () => apiClient.get<CustomShapeListItem[]>('/admin/shapes'),
  });

  const createShapeMutation = useMutation({
    mutationFn: async () => {
      if (!file || !name.trim()) {
        throw new Error('Name and image are both required');
      }

      const { assetId, uploadUrl } = await apiClient.post<{ assetId: string; uploadUrl: string }>(
        '/customization/assets/upload-url',
        { ownerType: 'CustomShape', ownerId: 'admin-upload', fileName: file.name, mimeType: file.type, fileSize: file.size },
      );

      // Raw binary PUT straight to object storage — bypasses apiClient since
      // this must not carry JSON headers or the admin's bearer token.
      const putResponse = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      if (!putResponse.ok) {
        throw new Error('Upload to storage failed');
      }

      await apiClient.post(`/customization/assets/${assetId}/confirm`);

      return apiClient.post<CustomShapeListItem>('/admin/shapes', { name: name.trim(), sourceAssetId: assetId });
    },
    onSuccess: (shape) => {
      toast.success('Shape uploaded — tracing an outline now awaiting review');
      queryClient.invalidateQueries({ queryKey: ['shapes'] });
      setOpen(false);
      setName('');
      setFile(null);
      router.push(`/shapes/${shape.id}`);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to upload shape');
    },
    onSettled: () => setIsUploading(false),
  });

  const columns: DataTableColumn<CustomShapeListItem>[] = [
    {
      header: 'Preview',
      cell: (row) =>
        row.previewAssetId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${API_BASE_URL}/customization/assets/${row.previewAssetId}/download-url`}
            alt={row.name}
            className="h-10 w-10 rounded object-contain bg-muted"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted" />
        ),
    },
    { header: 'Name', cell: (row) => row.name },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Uploaded', cell: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Custom Shapes</h1>
          <p className="text-sm text-muted-foreground">
            Upload a photo of a shape to auto-trace an outline customers can pick in the customizer.
          </p>
        </div>

        {hasPermission('shapes.create') && (
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
                  <Input id="shape-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dog Silhouette" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shape-file">Image (plain/solid background works best)</Label>
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
                  disabled={!file || !name.trim() || createShapeMutation.isPending}
                  onClick={() => {
                    setIsUploading(true);
                    createShapeMutation.mutate();
                  }}
                >
                  {isUploading ? 'Uploading…' : 'Upload & Trace'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
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
          data={data ?? []}
          getRowKey={(row) => row.id}
          onRowClick={(row) => router.push(`/shapes/${row.id}`)}
          emptyMessage="No shapes uploaded yet."
        />
      )}
    </div>
  );
}
