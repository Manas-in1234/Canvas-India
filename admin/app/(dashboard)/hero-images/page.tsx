'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, RotateCcw, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient, buildAdminApiUrl } from '@/lib/api-client';
import { usePermission } from '@/lib/auth/use-permission';
import { HERO_IMAGE_MAX_BYTES, HERO_IMAGE_SLOTS, type HeroImageSlot } from '../../../../backend/src/catalog/hero-image-slots';

type HeroImage = { ownerId: string; fileName: string; checksum: string };
const queryKey = ['hero-images'];
const storeUrl = 'https://canvassindia.com';
const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];

function HeroImageCard({ slot, image }: { slot: HeroImageSlot; image?: HeroImage }) {
  const settings = HERO_IMAGE_SLOTS[slot];
  const input = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [selection, setSelection] = useState<{ file: File; url: string } | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [error, setError] = useState('');
  const route = `/admin/hero-images/${slot}`;
  const currentUrl = image
    ? buildAdminApiUrl(`/hero-images/${slot}?v=${encodeURIComponent(image.checksum)}`)
    : new URL(settings.fallback, storeUrl).href;

  useEffect(() => () => { if (selection) URL.revokeObjectURL(selection.url); }, [selection]);

  function clearFile() {
    if (input.current) input.current.value = '';
    setSelection(null);
    setPreviewReady(false);
    setError('');
  }

  const changeImage = useMutation({
    mutationFn: async (file: File | null) => {
      if (!file) {
        await apiClient.delete(route);
        return null;
      }
      const data = new FormData();
      data.set('file', file);
      return apiClient.upload<HeroImage>(route, data);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<HeroImage[]>(queryKey, (current = []) => [
        ...current.filter((item) => item.ownerId !== slot),
        ...(saved ? [saved] : []),
      ]);
      clearFile();
      toast.success(saved ? `${settings.label} image published` : `${settings.label} default image restored`);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Could not update the image.'),
  });

  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{settings.label}</h2>
        <a href={`${storeUrl}${settings.path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          View page <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
      <figure className="space-y-2">
        <div className={`relative overflow-hidden rounded-lg bg-muted ${settings.layout === 'fade' ? 'aspect-video' : 'aspect-[4/3]'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={selection?.url ?? currentUrl}
            src={selection?.url ?? currentUrl}
            alt={`${settings.label} ${selection ? 'new' : 'current'} hero image`}
            className="h-full w-full object-cover"
            onLoad={selection ? () => setPreviewReady(true) : undefined}
            onError={selection ? () => setError('This image could not be opened. Choose a different file.') : undefined}
          />
          {settings.layout === 'fade' && (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#F7F1E5] to-transparent" aria-hidden="true" />
          )}
        </div>
        <figcaption className="truncate text-sm text-muted-foreground">
          {selection ? `Preview: ${selection.file.name}` : image ? `Published: ${image.fileName}` : 'Using the default image'}
        </figcaption>
      </figure>
      <div className="mt-auto space-y-2">
        <Label htmlFor={`hero-${slot}`}>Choose a replacement</Label>
        <Input
          ref={input}
          id={`hero-${slot}`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={`hero-hint-${slot}`}
          disabled={changeImage.isPending}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            setPreviewReady(false);
            setSelection(null);
            setError('');
            if (!file) return;
            if (!imageTypes.includes(file.type) || !file.size || file.size > HERO_IMAGE_MAX_BYTES) {
              event.currentTarget.value = '';
              setError('Choose a JPEG, PNG, or WebP image no larger than 4 MB.');
              return;
            }
            setSelection({ file, url: URL.createObjectURL(file) });
          }}
        />
        <p id={`hero-hint-${slot}`} className="text-xs text-muted-foreground">
          {settings.layout === 'fade'
            ? 'Choose a wide image and keep the subject on the right, away from the fade.'
            : 'A 4:3 landscape image fits the picture area best.'}
        </p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={!selection || !previewReady || changeImage.isPending} onClick={() => selection && changeImage.mutate(selection.file)}>
          <Upload className="size-4" aria-hidden="true" />
          {changeImage.isPending ? 'Updating…' : 'Upload & publish'}
        </Button>
        {selection && <Button variant="ghost" disabled={changeImage.isPending} onClick={clearFile}>Cancel</Button>}
        {image && !selection && (
          <Button variant="outline" disabled={changeImage.isPending} onClick={() => {
            if (window.confirm(`Restore the default hero image for ${settings.label}?`)) changeImage.mutate(null);
          }}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Restore default
          </Button>
        )}
      </div>
    </section>
  );
}

export default function HeroImagesPage() {
  const { hasPermission } = usePermission();
  const canEdit = hasPermission('products.edit');
  const images = useQuery({
    queryKey,
    queryFn: () => apiClient.get<HeroImage[]>('/admin/hero-images'),
    enabled: canEdit,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Hero Images</h1>
        <p className="text-sm text-muted-foreground">Replace the main image at the top of each storefront page. Uploads go live when published.</p>
        <p className="mt-1 text-sm text-muted-foreground">JPEG, PNG, or WebP · Up to 4 MB per image</p>
      </header>
      {!canEdit ? <p>You don’t have permission to manage hero images.</p>
        : images.isPending ? <p role="status">Loading hero images…</p>
        : images.isError ? (
          <div className="space-y-2">
            <p role="alert">Could not load hero images.</p>
            <Button variant="outline" onClick={() => void images.refetch()}>Try again</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {(Object.keys(HERO_IMAGE_SLOTS) as HeroImageSlot[]).map((slot) => (
              <HeroImageCard key={slot} slot={slot} image={images.data.find((image) => image.ownerId === slot)} />
            ))}
          </div>
        )}
    </div>
  );
}
