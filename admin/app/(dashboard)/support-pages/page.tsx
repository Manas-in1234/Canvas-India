"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePermission } from "@/lib/auth/use-permission";
import { apiClient } from "@/lib/api-client";

const pages = [
  ["about-us", "About Us"],
  ["refund-policy", "Returns & Replacement Policy"],
  ["cancellation-policy", "Cancellation Policy"],
  ["privacy-policy", "Privacy Policy"],
  ["terms-and-conditions", "Terms of Service"],
] as const;

type Field = { key: string; group: string; label: string; value: string; kind: "text" | "link" | "image" };
type Page = { title: string; fields: Field[]; content: Record<string, string>; updatedAt: string | null };

export default function SupportPagesPage() {
  const [slug, setSlug] = useState<string>(pages[0][0]);
  const { hasPermission } = usePermission();
  const query = useQuery({ queryKey: ["support-page", slug],
    queryFn: () => apiClient.get<Page>("/admin/support-pages/" + slug) });
  return <div className="max-w-4xl space-y-5">
    <h1 className="text-2xl font-semibold tracking-tight">Support pages</h1>
    <div className="space-y-2">
      <Label htmlFor="support-page">Choose a page</Label>
      <select id="support-page" className="block w-full max-w-md rounded-lg border bg-background p-2 text-sm"
        value={slug} onChange={event => setSlug(event.target.value)}>
        {pages.map(([id, title]) => <option value={id} key={id}>{title}</option>)}
      </select>
    </div>
    {query.isPending && <p role="status">Loading page content…</p>}
    {query.isError && !query.data && <div role="alert" className="space-y-2">
      <p>{query.error.message}</p><Button variant="outline" onClick={() => void query.refetch()}>Try again</Button>
    </div>}
    {query.data && <Editor key={slug} slug={slug} saved={query.data} canEdit={hasPermission("products.edit")} />}
  </div>;
}

function Editor({ slug, saved, canEdit }: { slug: string; saved: Page; canEdit: boolean }) {
  const client = useQueryClient();
  const [draft, setDraft] = useState(saved.content);
  const [published, setPublished] = useState(false);
  const groups = new Map<string, Field[]>();
  for (const field of saved.fields) groups.set(field.group, [...(groups.get(field.group) ?? []), field]);
  const save = useMutation({
    mutationFn: () => apiClient.put<Page>("/admin/support-pages/" + slug, draft),
    onSuccess: data => {
      client.setQueryData(["support-page", slug], data);
      setDraft(data.content);
      setPublished(true);
    },
  });
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved.content);
  return <form className="space-y-3" onSubmit={event => {
    event.preventDefault();
    if (canEdit && dirty && !save.isPending) save.mutate();
  }}>
    <div className="flex flex-wrap items-center gap-3">
      <h2 className="grow font-semibold">{saved.title}</h2>
      <a className="text-sm text-primary underline" href={`https://canvassindia.com/${slug}`} target="_blank" rel="noreferrer">View live page</a>
      {canEdit && <Button type="submit" disabled={!dirty || save.isPending}>{save.isPending ? "Publishing…" : "Publish page"}</Button>}
    </div>
    {published && <p role="status" className="text-sm text-green-700">Page published.</p>}
    {save.error && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}
    {[...groups].map(([group, fields]) => <details className="rounded-lg border bg-card p-4" key={group} open={group === "Page introduction" ? true : undefined}>
      <summary className="cursor-pointer text-sm font-medium">{group}</summary>
      <div className="mt-4 space-y-4">
        {fields.map(field => {
          const value = draft[field.key] ?? field.value;
          const edit = (next: string) => {
            setPublished(false);
            setDraft(previous => {
              const copy = { ...previous };
              if (next === field.value) delete copy[field.key];
              else copy[field.key] = next;
              return copy;
            });
          };
          return <div key={field.key} className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {canEdit && value !== field.value && <Button type="button" variant="ghost" size="sm" disabled={save.isPending} onClick={() => edit(field.value)}>Restore original</Button>}
            </div>
            {field.kind === "text" && (field.value.length >= 90 || field.label === "Paragraph") ?
              <textarea id={field.key} disabled={!canEdit || save.isPending} className="w-full rounded-lg border bg-background p-2 text-sm"
                maxLength={4000} rows={Math.max(2, Math.min(5, Math.ceil(value.length / 100)))} value={value} onChange={event => edit(event.target.value)} /> :
              <Input id={field.key} disabled={!canEdit || save.isPending} maxLength={4000} value={value} onChange={event => edit(event.target.value)} />}
          </div>;
        })}
      </div>
    </details>)}
    {canEdit && <div className="sticky bottom-2 flex justify-end"><Button type="submit" disabled={!dirty || save.isPending}>Publish page</Button></div>}
  </form>;
}
