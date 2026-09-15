import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module.js';
import { JobsModule } from '../../production/jobs/jobs.module.js';
import { ReturnsReplacementsController } from './returns-replacements.controller.js';
import { ReturnsReplacementsService } from './returns-replacements.service.js';

@Module({
  imports: [JobsModule, OrdersModule],
  controllers: [ReturnsReplacementsController],
  providers: [ReturnsReplacementsService],
  exports: [ReturnsReplacementsService],
})
export class ReturnsReplacementsModule {}

