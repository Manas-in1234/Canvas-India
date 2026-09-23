import { Module } from '@nestjs/common';
import { InventoryModule } from '../../inventory/inventory.module.js';
import { NdrRtoController } from './ndr-rto.controller.js';
import { NdrRtoService } from './ndr-rto.service.js';

@Module({
  imports: [InventoryModule],
  controllers: [NdrRtoController],
  providers: [NdrRtoService],
  exports: [NdrRtoService],
})
export class NdrRtoModule {}
