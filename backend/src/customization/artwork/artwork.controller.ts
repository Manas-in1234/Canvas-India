import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArtworkService } from './artwork.service.js';
import { CreateArtworkDto } from './dto/create-artwork.dto.js';
import { ReviewArtworkDto } from './dto/review-artwork.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.js';

@Controller('customization/artwork')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ArtworkController {
  constructor(private readonly artworkService: ArtworkService) {}

  @Get(':id')
  @RequirePermissions('artwork.view')
  findOne(@Param('id') id: string) {
    return this.artworkService.findOne(id);
  }

  @Post()
  @RequirePermissions('artwork.view')
  create(@Body() dto: CreateArtworkDto) {
    return this.artworkService.create(dto.designVersionId);
  }

  @Post(':id/approve')
  @RequirePermissions('artwork.approve')
  approve(@Param('id') id: string, @Body() dto: ReviewArtworkDto, @CurrentUser() user: AuthenticatedUser) {
    return this.artworkService.approve(id, user.id, dto.reason);
  }

  @Post(':id/reject')
  @RequirePermissions('artwork.reject')
  reject(@Param('id') id: string, @Body() dto: ReviewArtworkDto, @CurrentUser() user: AuthenticatedUser) {
    return this.artworkService.reject(id, user.id, dto.reason);
  }
}
