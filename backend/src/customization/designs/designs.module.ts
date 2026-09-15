import { Module } from '@nestjs/common';
import { DesignsService } from './designs.service.js';
import { DesignsController } from './designs.controller.js';

@Module({
  controllers: [DesignsController],
  providers: [DesignsService],
  exports: [DesignsService],
})
export class DesignsModule {}
