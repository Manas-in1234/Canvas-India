import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service.js';
import { ArtworkController } from './artwork.controller.js';
import { PreflightModule } from './preflight.module.js';
import { CustomizationQueueModule } from '../queue/customization-queue.module.js';
import { JobsModule } from '../../production/jobs/jobs.module.js';

@Module({
  imports: [PreflightModule, CustomizationQueueModule, JobsModule],
  controllers: [ArtworkController],
  providers: [ArtworkService],
  exports: [ArtworkService],
})
export class ArtworkModule {}
