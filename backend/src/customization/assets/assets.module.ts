import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service.js';
import { AssetsController } from './assets.controller.js';
import { StorageModule } from './storage.module.js';
import { CustomizationQueueModule } from '../queue/customization-queue.module.js';

@Module({
  imports: [StorageModule, CustomizationQueueModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
