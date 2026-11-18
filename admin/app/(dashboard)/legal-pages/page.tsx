"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { SupportPage } from "@/lib/types/support-page";
import { SUPPORT_PAGE_LABELS } from "@/lib/types/support-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

const STOREFRONT_BASE_URL = "https://canvassindia.com";

export default function LegalPagesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-support-pages"],
    queryFn: () => apiClient.get<SupportPage[]>("/admin/support-pages"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Legal Pages</h1>
        <p className="text-sm text-muted-foreground">
          Edit the text shown on the storefront&apos;s About Us, Privacy Policy, Terms &amp; Conditions and
          Cancellation Policy pages. Any field left blank keeps its original wording.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(data ?? []).map((page) => {
            const overrideCount = Object.keys(page.content ?? {}).length;
            return (
              <Card key={page.slug}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {SUPPORT_PAGE_LABELS[page.slug] ?? page.slug}
                  </CardTitle>
                  <CardDescription>
                    {overrideCount > 0
                      ? `${overrideCount} field${overrideCount === 1 ? "" : "s"} customized`
                      : "Using the original wording throughout"}
                    {page.updatedAt ? ` · last edited ${formatDate(page.updatedAt)}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Link
                    href={`/legal-pages/placeholder?id=${encodeURIComponent(page.slug)}`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Edit page
                  </Link>
                  <a
                    href={`${STOREFRONT_BASE_URL}/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    View live page <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
