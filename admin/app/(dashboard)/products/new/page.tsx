"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { usePermission } from "@/lib/auth/use-permission";
import type { CreateProductInput, ProductType } from "@/lib/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { buildStorefrontPayload, ProductForm, validateForm, type ProductFormState } from "../product-form";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canCreate = hasPermission("products.create");
  const canPublish = hasPermission("products.edit");
  const [form, setForm] = useState<ProductFormState>({
    status: "DRAFT", name: "", description: "", basePrice: "", costPrice: "", originalPrice: "",
    storefront: { images: [], sizes: [], finishes: [] }, specifications: [],
  });
  const [slugOverride, setSlugOverride] = useState<string>();
  const [productTypeId, setProductTypeId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const slug = slugOverride ?? slugify(form.name);
  const types = useQuery({
    queryKey: ["product-types"],
    queryFn: () => apiClient.get<ProductType[]>("/product-types"),
    enabled: canCreate,
  });
  const typeName = types.data?.find(type => type.id === productTypeId)?.name;
  const create = useMutation({
    mutationFn: (input: CreateProductInput) => apiClient.post<{ id: string }>("/products", input),
    onSuccess: (product) => {
      toast.success("Product created");
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["product-types"] });
      router.push(`/products/placeholder?id=${encodeURIComponent(product.id)}`);
    },
    onError: error => setFormError(error.message || "Failed to create product."),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canCreate || create.isPending) return;
    const error = validateForm(form) || (!slug ? "Enter a product URL slug." : null)
      || (!typeName ? "Select a product type." : null);
    setFormError(error);
    if (error) return;
    create.mutate({
      name: form.name.trim(),
      slug,
      productTypeId,
      description: form.description,
      basePrice: form.basePrice,
      costPrice: form.costPrice || undefined,
      status: canPublish && form.status === "ACTIVE" ? "ACTIVE" : "DRAFT",
      storefront: buildStorefrontPayload(form),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/products" className="mb-1 flex items-center gap-1 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Product</h1>
      </div>
      {canCreate ? (
        <form onSubmit={submit} className="max-w-5xl space-y-5">
          <Card>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="product-type">Product type</Label>
                <select id="product-type" required value={productTypeId} disabled={create.isPending || types.isPending}
                  className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                  onChange={event => {
                    const next = types.data?.find(type => type.id === event.target.value);
                    setProductTypeId(event.target.value);
                    if (next) setForm(current => ({
                      ...current,
                      storefront: { ...current.storefront, category: next.name, categorySlug: slugify(next.name) },
                    }));
                  }}>
                  <option value="">{types.isPending ? "Loading product types…" : "Select a type"}</option>
                  {types.data?.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
                {types.isError && <Button type="button" variant="outline" onClick={() => void types.refetch()}>Retry loading types</Button>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-slug">URL slug</Label>
                <Input id="product-slug" value={slug} disabled={create.isPending}
                  onChange={event => setSlugOverride(event.target.value)} onBlur={() => {
                    if (slugOverride !== undefined) setSlugOverride(slugify(slugOverride) || undefined);
                  }} />
              </div>
            </CardContent>
          </Card>
          <ProductForm form={form} setForm={setForm} canEdit={!create.isPending} canPublish={canPublish} typeName={typeName} />
          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background/95 p-3 shadow-lg">
            {formError && <p className="text-sm text-destructive" role="alert">{formError}</p>}
            <Button type="submit" className="ml-auto" disabled={create.isPending || types.isPending}>
              {create.isPending ? "Creating…" : form.status === "ACTIVE" ? "Create and publish" : "Create draft"}
            </Button>
          </div>
        </form>
      ) : <p>You don’t have permission to create products.</p>}
    </div>
  );
}
