import { IsIn } from 'class-validator';

const STATUSES = ['AVAILABLE', 'RUNNING', 'MAINTENANCE', 'OFFLINE'];

export class UpdateMachineStatusDto {
  @IsIn(STATUSES)
  status!: 'AVAILABLE' | 'RUNNING' | 'MAINTENANCE' | 'OFFLINE';
}
