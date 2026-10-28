import { Module } from '@nestjs/common';
import { SizePresetsService } from './size-presets.service.js';
import { SizePresetsPublicController, AdminSizePresetsController } from './size-presets.controller.js';

@Module({
  controllers: [SizePresetsPublicController, AdminSizePresetsController],
  providers: [SizePresetsService],
  exports: [SizePresetsService],
})
export class SizePresetsModule {}
