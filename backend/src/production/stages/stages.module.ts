import { Module } from '@nestjs/common';
import { StagesService } from './stages.service.js';
import { StagesController } from './stages.controller.js';
import { MaterialsModule } from '../materials/materials.module.js';

@Module({
  imports: [MaterialsModule],
  controllers: [StagesController],
  providers: [StagesService],
  exports: [StagesService],
})
export class StagesModule {}
