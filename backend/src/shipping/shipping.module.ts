import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller.js';
import {
  COURIER_PROVIDER,
  ShippingService,
} from './shipping.service.js';
import { DelhiveryAdapter } from './adapters/delhivery.adapter.js';
import { NdrRtoModule } from './ndr-rto/ndr-rto.module.js';

@Module({
  imports: [NdrRtoModule],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    {
      provide: COURIER_PROVIDER,
      useClass: DelhiveryAdapter,
    },
  ],
  exports: [ShippingService],
})
export class ShippingModule {}