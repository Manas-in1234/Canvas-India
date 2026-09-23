import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service.js';
import { VariantsController } from './variants.controller.js';

@Module({
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
