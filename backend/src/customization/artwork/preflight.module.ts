import { Module } from '@nestjs/common';
import { PreflightService } from './preflight.service.js';

@Module({
  providers: [PreflightService],
  exports: [PreflightService],
})
export class PreflightModule {}
