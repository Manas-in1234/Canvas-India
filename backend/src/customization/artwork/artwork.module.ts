import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service.js';
import { ArtworkController } from './artwork.controller.js';
import { PreflightModule } from './preflight.module.js';
import { StorageModule } from '../assets/storage.module.js';
import { JobsModule } from '../../production/jobs/jobs.module.js';

@Module({
  imports: [PreflightModule, StorageModule, JobsModule],
  controllers: [ArtworkController],
  providers: [ArtworkService],
  exports: [ArtworkService],
})
export class ArtworkModule {}
