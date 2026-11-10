export type CustomShapeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ShapeOrigin = 'BUILT_IN' | 'ADMIN_UPLOADED';
export type ShapeClipPathType = 'SVG_PATH' | 'CSS_FUNCTION';
export type ShapePriceMode = 'FLAT' | 'AREA_RATE';

export interface CustomShapeListItem {
  id: string;
  name: string;
  origin: ShapeOrigin;
  sourceAssetId: string | null;
  previewAssetId: string | null;
  // Set by the Workers-side WorkerShapes.present() as a base64 data: URI
  // from Asset.contentBytes — the NestJS/S3 deployment instead serves the
  // preview via GET /customization/assets/:id/download-url using
  // previewAssetId, so this stays optional.
  previewUrl?: string | null;
  clipPathType: ShapeClipPathType;
  clipPathValue: string;
  shapeType: string | null;
  category: string;
  aspectRatio: string;
  isSingleDimension: boolean;
  priceMode: ShapePriceMode;
  flatPrice: string;
  areaRatePerSqIn: string | null;
  status: CustomShapeStatus;
  createdBy: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}
