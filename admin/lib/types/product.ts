export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ProductType {
  id: string;
  name: string;
}

export interface ProductCategoryLink {
  categoryId: string;
  category: { id: string; name: string; slug: string };
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  basePrice: string;
  costPrice: string | null;
  productType: ProductType;
  categories: ProductCategoryLink[];
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

export interface ProductDetail extends Omit<ProductListItem, 'categories'> {
  description: string | null;
  options: ProductOptionGroupLink[];
  variants: ProductVariant[];
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  productTypeId: string;
  basePrice: string;
  costPrice?: string;
}
