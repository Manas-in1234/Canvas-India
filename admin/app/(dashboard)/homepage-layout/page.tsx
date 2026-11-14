"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Lock, Store } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import { HOMEPAGE_SECTIONS, type HomepageLayoutSettings, type HomepageSectionSetting } from "@/lib/homepage-sections";
import { usePermission } from "@/lib/auth/use-permission";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const ENDPOINT = "/admin/homepage-layout";
const META = new Map(HOMEPAGE_SECTIONS.map((s) => [s.key, s]));

export default function HomepageLayoutPage() {
  const query = useQuery({ queryKey: ["homepage-layout"], queryFn: () => apiClient.get<HomepageLayoutSettings>(ENDPOINT) });
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  if (query.isLoadingError || !query.data) return <p className="text-sm text-destructive">Failed to load the homepage layout.</p>;
  // Keyed on the saved copy so the form starts from what the server holds after each save.
  return <LayoutEditor key={JSON.stringify(query.data)} saved={query.data} />;
}

function LayoutEditor({ saved }: { saved: HomepageLayoutSettings }) {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission("products.edit");
  const [draft, setDraft] = useState<HomepageLayoutSettings>(saved);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const save = useMutation({
    mutationFn: () => apiClient.put<HomepageLayoutSettings>(ENDPOINT, draft),
    onSuccess: (data) => {
      toast.success("Homepage layout published. The website shows it right away.");
      queryClient.setQueryData(["homepage-layout"], data);
    },
    onError: (err: unknown) => toast.error(err instanceof ApiError || err instanceof Error ? err.message : "Could not save the layout"),
  });

  const patch = (key: string, change: Partial<HomepageSectionSetting>) =>
    setDraft((d) => ({ ...d, sections: d.sections.map((s) => (s.key === key ? { ...s, ...change } : s)) }));
  const move = (index: number, direction: -1 | 1) =>
    setDraft((d) => {
      const target = index + direction;
      if (target < 0 || target >= d.sections.length) return d;
      const sections = [...d.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...d, sections };
    });

  const hiddenCount = draft.sections.filter((s) => !s.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="page-eyebrow">STOREFRONT</div>
          <h1 className="text-2xl font-semibold tracking-tight">Homepage layout</h1>
          <p className="text-sm text-muted-foreground">
            Choose which sections the website homepage shows, their order and headings, and put a notice up when the store is closed.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="https://canvassindia.com" target="_blank" rel="noreferrer">
            <Button variant="ghost">
              <ExternalLink className="mr-2 h-4 w-4" />
              View website
            </Button>
          </a>
          {canEdit && (
            <Button disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Publishing…" : dirty ? "Publish changes" : "Published"}
            </Button>
          )}
        </div>
      </div>
      {!canEdit && <p className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">You can view the layout but not change it.</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store className="h-4 w-4" />
            Store status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 ${draft.storeOpen ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"}`}>
            <div className="text-sm">
              <div className="font-medium">{draft.storeOpen ? "The store is OPEN" : "The store is CLOSED"}</div>
              <div className="text-muted-foreground">
                {draft.storeOpen ? "No notice is shown." : "A notice bar is shown at the top of the homepage. Customers can still browse and order."}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={draft.storeOpen ? "default" : "outline"} disabled={!canEdit} onClick={() => setDraft((d) => ({ ...d, storeOpen: true }))}>
                Open
              </Button>
              <Button size="sm" variant={!draft.storeOpen ? "default" : "outline"} disabled={!canEdit} onClick={() => setDraft((d) => ({ ...d, storeOpen: false }))}>
                Closed
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="closed-message">Message shown while closed</Label>
            <Input id="closed-message" maxLength={240} disabled={!canEdit} value={draft.closedMessage} onChange={(e) => setDraft((d) => ({ ...d, closedMessage: e.target.value }))} />
            <p className="text-[11px] text-muted-foreground">For example: &quot;Closed for Diwali. Orders placed now ship from 5 November.&quot; The notice does not block checkout.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Homepage sections</CardTitle>
          <p className="text-xs text-muted-foreground">
            Top to bottom, as customers see them.{hiddenCount > 0 ? ` ${hiddenCount} hidden.` : ""} Use the arrows to reorder. Leave a heading blank to keep the standard one.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">Hero banner</div>
              <div className="text-xs text-muted-foreground">Always first. Change its images under Hero Images.</div>
            </div>
          </div>
          {draft.sections.map((section, index) => {
            const meta = META.get(section.key);
            if (!meta) return null;
            return (
              <div key={section.key} className={`flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-sm ${section.enabled ? "" : "bg-muted/30 opacity-70"}`}>
                <div className="flex flex-col">
                  <Button size="icon-sm" variant="ghost" aria-label={`Move ${meta.label} up`} disabled={!canEdit || index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label={`Move ${meta.label} down`} disabled={!canEdit || index === draft.sections.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="min-w-[10rem] flex-1">
                  <div className="font-medium">{meta.label}</div>
                  <div className="text-xs text-muted-foreground">{meta.hint}</div>
                </div>
                {meta.renamable ? (
                  <Input
                    aria-label={`Heading for ${meta.label}`}
                    className="max-w-xs"
                    placeholder={meta.label}
                    maxLength={80}
                    disabled={!canEdit}
                    value={section.title}
                    onChange={(e) => patch(section.key, { title: e.target.value })}
                  />
                ) : (
                  <span className="max-w-xs text-xs text-muted-foreground">Heading is part of the design</span>
                )}
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={section.enabled} disabled={!canEdit} onChange={(e) => patch(section.key, { enabled: e.target.checked })} />
                  <span>{section.enabled ? "Shown" : "Hidden"}</span>
                </label>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
