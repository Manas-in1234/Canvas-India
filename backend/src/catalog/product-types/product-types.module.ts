import { Module } from '@nestjs/common';
import { ProductTypesService } from './product-types.service.js';
import { ProductTypesController } from './product-types.controller.js';

@Module({
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  exports: [ProductTypesService],
})
export class ProductTypesModule {}
