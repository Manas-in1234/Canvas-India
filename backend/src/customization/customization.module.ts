import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module.js';
import { DesignsModule } from './designs/designs.module.js';
import { ArtworkModule } from './artwork/artwork.module.js';

@Module({
  imports: [AssetsModule, DesignsModule, ArtworkModule],
  exports: [AssetsModule, DesignsModule, ArtworkModule],
})
export class CustomizationModule {}
