export interface SizePresetPanel {
  id: string;
  label: string;
  dimension: string;
  widthRatio: number;
  heightRatio: number;
}

export interface SizePresetListItem {
  id: string;
  productTypeId: string;
  shapeId: string | null;
  label: string;
  dimensionsSummary: string;
  widthInches: string;
  heightInches: string;
  acrylicPrice: string;
  canvasPrice: string;
  category: string | null;
  panelsCount: number | null;
  panels: SizePresetPanel[] | null;
  arrangement: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
