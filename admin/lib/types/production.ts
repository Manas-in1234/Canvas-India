export type ProductionStageType = 'ARTWORK_QUEUE' | 'PRINTING' | 'CUTTING' | 'FRAMING' | 'ASSEMBLY' | 'QC' | 'PACKAGING';
export type ProductionStageStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'SKIPPED';
export type ProductionJobStatus = 'QUEUED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type MachineStatus = 'AVAILABLE' | 'RUNNING' | 'MAINTENANCE' | 'OFFLINE';

export const PIPELINE_STAGES: ProductionStageType[] = [
  'PRINTING',
  'CUTTING',
  'FRAMING',
  'ASSEMBLY',
  'QC',
  'PACKAGING',
];

export interface BoardCard {
  stageId: string;
  productionJobId: string;
  orderNumber: string;
  status: ProductionStageStatus;
  slaDueAt: string | null;
}

export type Board = Partial<Record<ProductionStageType, BoardCard[]>>;

export interface ProductionJobStage {
  id: string;
  productionJobId: string;
  stage: ProductionStageType;
  status: ProductionStageStatus;
  machineId: string | null;
  assignedAdminUserId: string | null;
  slaDueAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface ProductionJobListItem {
  id: string;
  orderItemId: string;
  status: ProductionJobStatus;
  priority: number;
  reworkCount: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  stages: ProductionJobStage[];
}

export interface ProductionEvent {
  id: string;
  type: string;
  message: string | null;
  createdAt: string;
}

export interface ProductionJobDetail extends ProductionJobListItem {
  events: ProductionEvent[];
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: MachineStatus;
  capacity: number | null;
  supportedMaterials: string[];
  warehouseId: string | null;
  createdAt: string;
}

export interface CreateMachineInput {
  name: string;
  type: string;
  capacity?: number;
  supportedMaterials?: string[];
  warehouseId?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  available: string;
  reserved: string;
  consumed: string;
  damaged: string;
  reorderLevel: string;
  createdAt: string;
}

export interface CreateMaterialInput {
  name: string;
  unit: string;
  reorderLevel?: string;
}

export interface ProductionBatch {
  id: string;
  name: string;
  machineId: string | null;
  status: string;
  createdAt: string;
  jobs: { productionJobId: string }[];
}

export interface CreateBatchInput {
  name: string;
  machineId?: string;
  productionJobIds: string[];
}

export interface QcResultInput {
  printQuality: 'PASS' | 'FAIL' | 'REWORK';
  colorQuality: 'PASS' | 'FAIL' | 'REWORK';
  alignment: 'PASS' | 'FAIL' | 'REWORK';
  materialQuality: 'PASS' | 'FAIL' | 'REWORK';
  assemblyQuality: 'PASS' | 'FAIL' | 'REWORK';
  packagingQuality: 'PASS' | 'FAIL' | 'REWORK';
}
