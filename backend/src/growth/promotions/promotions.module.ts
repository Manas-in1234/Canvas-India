import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service.js';
import { PromotionsController } from './promotions.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { CustomerSegmentsModule } from '../customer-segments/customer-segments.module.js';

@Module({
  imports: [DatabaseModule, CustomerSegmentsModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
