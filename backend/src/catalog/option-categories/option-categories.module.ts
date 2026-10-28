import { Module } from '@nestjs/common';
import { OptionCategoriesService } from './option-categories.service.js';
import { OptionCategoriesPublicController, AdminOptionCategoriesController } from './option-categories.controller.js';

@Module({
  controllers: [OptionCategoriesPublicController, AdminOptionCategoriesController],
  providers: [OptionCategoriesService],
  exports: [OptionCategoriesService],
})
export class OptionCategoriesModule {}
