export type CustomizerMaterial = 'CANVAS' | 'ACRYLIC';

/** A style card on the storefront customizer's PRODUCTS tab. */
export interface CustomizerProductType {
  id: string;
  material: CustomizerMaterial;
  slug: string;
  name: string;
  startingPrice: string;
  image: string | null;
  iconType: string | null;
  panelsCount: number | null;
  description: string | null;
  defaultSizeOptionId: string | null;
  defaultShapeId: string | null;
  defaultLayoutId: string | null;
  defaultHardwareId: string | null;
  defaultThicknessId: string | null;
  supportedShapeIds: string[] | null;
  supportedHardwareIds: string[] | null;
  supportedLayoutIds: string[] | null;
  capabilities: Record<string, unknown> | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
