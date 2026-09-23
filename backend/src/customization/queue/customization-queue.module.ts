import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis as IORedis } from 'ioredis';
import { ImageProcessingProcessor } from './processors/image-processing.processor.js';
import { ArtworkGenerationProcessor } from './processors/artwork-generation.processor.js';
import { StorageModule } from '../assets/storage.module.js';
import { PreflightModule } from '../artwork/preflight.module.js';
import { IMAGE_PROCESSING_QUEUE, ARTWORK_GENERATION_QUEUE } from './queue-names.js';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // BullMQ cannot auto-require the optional `ioredis` peer in a native ESM
      // project, so an already-constructed client instance is passed instead
      // of a connection-options object.
      useFactory: (configService: ConfigService) => ({
        connection: new IORedis(configService.get<string>('redisUrl')!, { maxRetriesPerRequest: null }),
      }),
    }),
    BullModule.registerQueue({ name: IMAGE_PROCESSING_QUEUE }, { name: ARTWORK_GENERATION_QUEUE }),
    StorageModule,
    PreflightModule,
  ],
  providers: [ImageProcessingProcessor, ArtworkGenerationProcessor],
  exports: [BullModule],
})
export class CustomizationQueueModule {}
