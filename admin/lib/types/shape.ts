export type CustomShapeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CustomShapeListItem {
  id: string;
  name: string;
  sourceAssetId: string;
  previewAssetId: string | null;
  previewUrl?: string | null;
  svgPathData: string;
  status: CustomShapeStatus;
  createdBy: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}
