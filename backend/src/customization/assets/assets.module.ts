import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service.js';
import { AssetsController } from './assets.controller.js';
import { StorageModule } from './storage.module.js';

@Module({
  imports: [StorageModule],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
