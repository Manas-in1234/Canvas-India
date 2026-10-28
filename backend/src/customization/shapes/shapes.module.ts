import { Module } from '@nestjs/common';
import { ShapesService } from './shapes.service.js';
import { ShapesController, AdminShapesController } from './shapes.controller.js';
import { StorageModule } from '../assets/storage.module.js';

@Module({
  imports: [StorageModule],
  controllers: [ShapesController, AdminShapesController],
  providers: [ShapesService],
  exports: [ShapesService],
})
export class ShapesModule {}
