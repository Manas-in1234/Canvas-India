import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service.js';
import { CampaignsController } from './campaigns.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { AuditModule } from '../../audit/audit.module.js';
import { CustomerSegmentsModule } from '../customer-segments/customer-segments.module.js';

@Module({
  imports: [DatabaseModule, AuditModule, CustomerSegmentsModule],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
