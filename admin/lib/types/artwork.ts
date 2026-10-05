export type ArtworkStatus =
  | 'PENDING'
  | 'PREFLIGHT_PASSED'
  | 'PREFLIGHT_WARNING'
  | 'PREFLIGHT_FAILED'
  | 'APPROVED'
  | 'REJECTED';

export interface DesignVersionSummary {
  id: string;
  versionNumber: number;
  canvasWidth: number;
  canvasHeight: number;
  targetWidthInches: string;
  targetHeightInches: string;
  previewAssetId: string | null;
}

export interface PreflightCheckResult {
  status: 'PASS' | 'WARNING' | 'FAIL';
  message?: string;
}

export interface ArtworkListItem {
  id: string;
  designVersionId: string;
  orderItemId: string | null;
  status: ArtworkStatus;
  preflightResult: Record<string, PreflightCheckResult> | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  designVersion: DesignVersionSummary;
}
