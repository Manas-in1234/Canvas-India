import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module.js';
import { StagesModule } from './stages/stages.module.js';
import { BatchesModule } from './batches/batches.module.js';
import { MachinesModule } from './machines/machines.module.js';
import { BomModule } from './bom/bom.module.js';
import { MaterialsModule } from './materials/materials.module.js';
import { SlaModule } from './sla/sla.module.js';

@Module({
  imports: [JobsModule, StagesModule, BatchesModule, MachinesModule, BomModule, MaterialsModule, SlaModule],
  exports: [JobsModule, StagesModule, BatchesModule, MachinesModule, BomModule, MaterialsModule, SlaModule],
})
export class ProductionModule {}
