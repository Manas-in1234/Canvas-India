export interface InventoryItem {
  id: string;
  variantId: string;
  available: number;
  reserved: number;
  damaged: number;
  reorderLevel: number;
  updatedAt: string;
  variant: { sku: string; productId: string };
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateWarehouseInput {
  name: string;
  code: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}
