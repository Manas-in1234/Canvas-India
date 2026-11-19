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

export type MovementType =
  | "PURCHASE"
  | "RESERVATION"
  | "RELEASE"
  | "CONSUMPTION"
  | "RETURN"
  | "DAMAGE"
  | "TRANSFER"
  | "ADJUSTMENT";

export interface InventoryMovement {
  id: string;
  movementType: MovementType;
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  referenceType: string | null;
  referenceId: string | null;
  performedBy: string | null;
  createdAt: string;
  inventoryItem: { variant: { sku: string; productId: string; product: { name: string } } };
}
