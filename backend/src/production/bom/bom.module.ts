import { Module } from '@nestjs/common';
import { BomService } from './bom.service.js';
import { BomController } from './bom.controller.js';

@Module({
  controllers: [BomController],
  providers: [BomService],
  exports: [BomService],
})
export class BomModule {}
