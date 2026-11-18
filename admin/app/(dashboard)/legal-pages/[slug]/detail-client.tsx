"use client";
import { useRecordId } from "@/lib/use-record-id";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Plus, Trash2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { SupportPage } from "@/lib/types/support-page";
import { SUPPORT_PAGE_LABELS } from "@/lib/types/support-page";
import { usePermission } from "@/lib/auth/use-permission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STOREFRONT_BASE_URL = "https://canvassindia.com";

export function LegalPageEditor({ slug: initialSlug }: { slug: string }) {
  const slug = useRecordId(initialSlug);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canManage = hasPermission("cms.manage");

  const [fields, setFields] = useState<Array<{ key: string; value: string }>>([]);
  const [newKey, setNewKey] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-support-page", slug],
    queryFn: () => apiClient.get<SupportPage>(`/admin/support-pages/${slug}`),
    enabled: !!slug,
  });

  useEffect(() => {
    if (data) {
      setFields(Object.entries(data.content ?? {}).map(([key, value]) => ({ key, value })));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const content: Record<string, string> = {};
      for (const { key, value } of fields) {
        if (key.trim()) content[key.trim()] = value;
      }
      return apiClient.put(`/admin/support-pages/${slug}`, { content });
    },
    onSuccess: () => {
      toast.success("Page updated");
      queryClient.invalidateQueries({ queryKey: ["admin-support-page", slug] });
      queryClient.invalidateQueries({ queryKey: ["admin-support-pages"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to save page");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const addField = () => {
    const key = newKey.trim();
    if (!key) return;
    if (fields.some((f) => f.key === key)) {
      toast.error(`Field "${key}" is already in the list.`);
      return;
    }
    setFields((prev) => [...prev, { key, value: "" }]);
    setNewKey("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/legal-pages")}
            className="mb-1 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Legal Pages
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {SUPPORT_PAGE_LABELS[slug] ?? slug}
          </h1>
        </div>
        <a
          href={`${STOREFRONT_BASE_URL}/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Open live page <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Field overrides</CardTitle>
          <CardDescription>
            Each paragraph/heading on the live page has a field key (f1, f2, ...). Open the live page in another
            tab to see what each one currently says and where it sits, then type the replacement text here. A
            field with no override keeps its original wording.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">No fields customized yet.</p>
          )}
          {fields.map((field, idx) => (
            <div key={field.key} className="space-y-1.5 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <Label className="font-mono text-xs text-muted-foreground">{field.key}</Label>
                {canManage && (
                  <button
                    type="button"
                    onClick={() => setFields((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove override for ${field.key}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <textarea
                value={field.value}
                disabled={!canManage}
                onChange={(e) =>
                  setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, value: e.target.value } : f)))
                }
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
              />
            </div>
          ))}

          {canManage && (
            <div className="flex items-center gap-2 border-t border-border pt-4">
              <Input
                placeholder="Field key (e.g. f12)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addField();
                  }
                }}
                className="max-w-[200px] font-mono"
              />
              <Button type="button" variant="outline" onClick={addField}>
                <Plus className="h-3.5 w-3.5" /> Add field
              </Button>
            </div>
          )}

          {canManage && (
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
