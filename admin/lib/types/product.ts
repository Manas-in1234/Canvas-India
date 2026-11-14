export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ProductType {
  id: string;
  name: string;
  /** false when the whole category is hidden from the website. */
  isActive?: boolean;
}

/** A category as listed by the admin: the product type plus how many products it holds. */
export interface ProductTypeSummary extends ProductType {
  isActive: boolean;
  productCount: number;
  liveCount: number;
}

export interface ProductListItem {
  storefront?: { image?: string | null };
  id: string;
  name: string;
  status: ProductStatus;
  basePrice: string;
  productType: ProductType;
  createdAt: string;
}

export interface VariantOptionValue {
  optionValue: { id: string; value: string; optionGroup: { id: string; name: string } };
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  isActive: boolean;
  options: VariantOptionValue[];
  inventory: { available: number; reserved: number; damaged: number; reorderLevel: number } | null;
}

export interface ProductOptionGroupLink {
  optionGroupId: string;
  isRequired: boolean;
  optionGroup: { id: string; name: string; values: { id: string; value: string }[] };
}

export interface ProductDetail extends Omit<ProductListItem, 'storefront'> {
  storefront?: Record<string, any>;
  slug: string;
  costPrice: string | null;
  description: string | null;
  options: ProductOptionGroupLink[];
  variants: ProductVariant[];
}

export interface CreateProductInput {
  status?: "DRAFT" | "ACTIVE";
  storefront?: Record<string, unknown>;
  name: string;
  slug: string;
  description?: string;
  productTypeId: string;
  basePrice: string;
  costPrice?: string;
}
