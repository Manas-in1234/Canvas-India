'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Plus, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient, buildAdminApiUrl } from '@/lib/api-client';
import { bannerTextColor } from '@/lib/banner-text-color';
import { usePermission } from '@/lib/auth/use-permission';
import { imageTypes, maxSourceBytes, prepareImage } from '@/lib/storefront-image-upload';

const fields = [
  ['name', 'Category name', 80],
  ['heroTitle', 'Banner title', 140],
  ['tagline', 'Banner subtitle', 250],
  ['pitchHeadline', 'Heading below the banner', 180],
  ['pitchText', 'Text below the heading', 600],
] as const;

type Details = Record<(typeof fields)[number][0], string>;
type Occasion = Details & {
  slug: string;
  bannerImage: string;
  accent: string;
  bannerColor?: string | null;
  hasCustomCover: boolean;
  group: 'occasion' | 'festival';
};

const empty: Details = { name: '', heroTitle: '', tagline: '', pitchHeadline: '', pitchText: '' };
const queryKey = ['storefront-occasions'];
const route = '/admin/occasions';
const store = 'https://canvassindia.com';
const defaultBannerColor = '#0E4A93';
const fadeMask = 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 10%, #000 35%, #000 100%)';
const control = 'w-full rounded-md border bg-background px-3 py-2 text-sm';
const card = 'space-y-5 rounded-xl border bg-card p-5';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function OccasionEditor({ occasion, onCreated }: { occasion?: Occasion; onCreated: (slug: string) => void }) {
  const [details, setDetails] = useState<Details>(occasion ?? empty);
  const [bannerColor, setBannerColor] = useState(occasion?.bannerColor ?? null);
  const [slug, setSlug] = useState(occasion?.slug ?? '');
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState('');
  const client = useQueryClient();
  const savedImage = occasion?.bannerImage;
  const currentImage = savedImage?.startsWith('/api/v1/')
    ? buildAdminApiUrl(savedImage.slice('/api/v1'.length))
    : new URL(savedImage ?? '/assets/acrylic/acrylic-gift.webp', store).href;
  const effectiveBannerColor = bannerColor ?? occasion?.accent ?? defaultBannerColor;

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const save = useMutation({
    mutationFn: () => occasion
      ? apiClient.put<{ slug: string }>(route + '/' + occasion.slug, { ...details, bannerColor })
      : apiClient.post<{ slug: string }>(route, { ...details, slug, bannerColor }),
    onSuccess: async result => {
      await client.invalidateQueries({ queryKey });
      if (!occasion) onCreated(result.slug);
      setStatus('Occasion published.');
    },
  });

  const changeCover = useMutation({
    mutationFn: async (replacement: File | null) => {
      const path = route + '/' + occasion!.slug + '/cover';
      if (!replacement) return apiClient.delete(path);
      const body = new FormData();
      body.set('file', await prepareImage(replacement));
      return apiClient.upload(path, body);
    },
    onSuccess: async (_, replacement) => {
      await client.invalidateQueries({ queryKey });
      setFile(undefined);
      setPreview('');
      setStatus(replacement ? 'Cover published.' : 'Original cover restored.');
    },
  });

  const busy = save.isPending || changeCover.isPending;

  function clearFeedback() {
    save.reset();
    changeCover.reset();
    setStatus('');
    setFileError('');
  }

  return (
    <div className="space-y-5">
      <form className={card} onSubmit={event => {
        event.preventDefault();
        clearFeedback();
        save.mutate();
      }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">{occasion ? 'Edit occasion' : 'New occasion'}</h2>
          {occasion && <a className="inline-flex items-center gap-1.5 text-sm text-primary" href={store + '/occasions/' + occasion.slug} target="_blank" rel="noreferrer">
            View storefront <ExternalLink className="size-4" />
          </a>}
        </div>
        <fieldset disabled={busy} className="space-y-4">
          {fields.map(([key, label, maxLength]) => (
            <div className="space-y-1.5" key={key}>
              <Label htmlFor={key}>{label}</Label>
              {key === 'pitchText'
                ? <textarea className={control} rows={3} id={key} required maxLength={maxLength} value={details[key]}
                    onChange={event => setDetails({ ...details, [key]: event.target.value })} />
                : <Input id={key} required maxLength={maxLength} value={details[key]} onChange={event => {
                    const value = event.target.value;
                    setDetails({ ...details, [key]: value });
                    if (!occasion && key === 'name') {
                      setSlug(current => current === slugFromName(details.name) ? slugFromName(value) : current);
                    }
                  }} />}
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="occasion-banner-color">Banner fade color</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Input id="occasion-banner-color" type="color" className="w-14 cursor-pointer p-1"
                value={effectiveBannerColor} onChange={event => setBannerColor(event.target.value.toUpperCase())} />
              <span className="text-sm text-muted-foreground">{effectiveBannerColor}</span>
              <Button type="button" variant="outline" size="sm" disabled={!bannerColor} onClick={() => setBannerColor(null)}>
                <RotateCcw className="size-4" /> Reset color
              </Button>
            </div>
            <div className="relative flex min-h-36 max-w-lg items-center overflow-hidden rounded-xl p-4"
              style={{ backgroundColor: effectiveBannerColor, color: bannerTextColor(bannerColor) }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview || currentImage} alt="" className="absolute inset-y-0 right-0 h-full w-[55%] object-cover"
                style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }} />
              <div className="relative w-[55%] break-words">
                <p className="font-serif text-lg font-bold">{details.heroTitle || 'Banner title'}</p>
                {details.tagline && <p className="mt-1 text-xs">{details.tagline}</p>}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="occasion-url">Page URL</Label>
            {occasion ? <p id="occasion-url" className="break-all text-sm text-muted-foreground">/occasions/{slug}</p>
              : <Input id="occasion-url" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={64} value={slug}
                  onChange={event => setSlug(event.target.value)} placeholder="e.g. graduation" />}
          </div>
        </fieldset>
        {save.error && <p role="alert" className="text-sm text-destructive">{errorMessage(save.error)}</p>}
        <Button disabled={busy} type="submit">{save.isPending ? 'Publishing…' : occasion ? 'Save and publish' : 'Create and publish'}</Button>
      </form>
      {occasion && (
        <section className={card}>
          <div>
            <h2 className="font-semibold">Cover image</h2>
            <p className="mt-1 text-sm text-muted-foreground">Used on the occasion card and the page banner.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview || currentImage} alt={preview ? 'Replacement cover preview' : occasion.name + ' cover'} className="aspect-video w-full max-w-lg rounded-lg border object-cover" />
          <div className="space-y-1.5">
            <Label htmlFor="occasion-cover">Choose a JPEG, PNG or WebP</Label>
            <Input key={currentImage} id="occasion-cover" type="file" accept={imageTypes.join(',')} disabled={busy} onChange={event => {
              clearFeedback();
              setPreview('');
              const chosen = event.target.files?.[0];
              setFile(undefined);
              if (!chosen) return;
              if (!imageTypes.includes(chosen.type) || chosen.size > maxSourceBytes) {
                setFileError('Choose a JPEG, PNG or WebP up to 25 MB.');
                event.target.value = '';
                return;
              }
              setFile(chosen);
            }} />
          </div>
          {(fileError || changeCover.error) && <p role="alert" className="text-sm text-destructive">{fileError || errorMessage(changeCover.error)}</p>}
          <div className="flex flex-wrap gap-2">
            <Button disabled={!file || busy} onClick={() => { if (file) { clearFeedback(); changeCover.mutate(file); } }}>
              <Upload className="size-4" />{changeCover.isPending ? 'Updating cover…' : 'Upload and publish'}
            </Button>
            <Button variant="outline" disabled={!occasion.hasCustomCover || busy} onClick={() => {
              if (window.confirm('Restore the original cover for this occasion?')) {
                clearFeedback();
                changeCover.mutate(null);
              }
            }}>
              <RotateCcw className="size-4" /> Revert to original
            </Button>
          </div>
        </section>
      )}
      {status && <p role="status" className="text-sm text-green-700">{status}</p>}
    </div>
  );
}

function slugFromName(name: string) {
  return name.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').slice(0, 64).replace(/^-|-$/g, '');
}

export default function OccasionsPage() {
  const { hasPermission } = usePermission();
  const canEdit = hasPermission('products.edit');
  const [selected, setSelected] = useState<string | null>(null);
  const { data, isPending, error, refetch } = useQuery({
    queryKey,
    queryFn: () => apiClient.get<Occasion[]>(route),
    enabled: canEdit,
  });
  const active = selected === '' ? undefined : data?.find(row => row.slug === selected) ?? data?.[0];

  if (!canEdit) return <p>You don’t have permission to edit occasions.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gifts &amp; Occasions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage occasion cards and pages on the storefront.</p>
      </div>
      {isPending && <p role="status" className="text-sm text-muted-foreground">Loading occasions…</p>}
      {!data && error && <div className="space-y-2">
        <p role="alert" className="text-sm text-destructive">{errorMessage(error)}</p>
        <Button variant="outline" onClick={() => void refetch()}>Try again</Button>
      </div>}
      {data && <>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="occasion-picker">Occasion</Label>
            <select id="occasion-picker" className={control} value={active?.slug ?? ''} onChange={event => setSelected(event.target.value)}>
              <option value="">New occasion</option>
              {(['occasion', 'festival'] as const).map(group => (
                <optgroup key={group} label={group === 'occasion' ? 'Special occasions' : 'Festivals'}>
                  {data.filter(row => row.group === group).map(row => <option key={row.slug} value={row.slug}>{row.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={() => setSelected('')}><Plus className="size-4" /> New occasion</Button>
        </div>
        <div className="max-w-3xl"><OccasionEditor key={active?.slug ?? 'new'} occasion={active} onCreated={setSelected} /></div>
      </>}
    </div>
  );
}
