import { Module } from '@nestjs/common';
import { OptionsService } from './options.service.js';
import { OptionsController } from './options.controller.js';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}
