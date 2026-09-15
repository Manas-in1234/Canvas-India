import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';
import { UpdateCampaignDto } from './dto/update-campaign.dto.js';
import { ChangeCampaignStatusDto } from './dto/change-campaign-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('growth/campaigns')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get()
  @RequirePermissions('campaigns.view')
  findAll(@Query('status') status?: string, @Query('type') type?: string) {
    return this.campaignsService.findAll({ status, type });
  }

  @Get(':id')
  @RequirePermissions('campaigns.view')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Get(':id/metrics')
  @RequirePermissions('campaigns.view')
  getMetrics(@Param('id') id: string) {
    return this.campaignsService.getMetrics(id);
  }

  @Post()
  @RequirePermissions('campaigns.manage')
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('campaigns.manage')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @Post(':id/status')
  @RequirePermissions('campaigns.manage')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeCampaignStatusDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.campaignsService.changeStatus(id, dto, user?.sub);
  }

  @Delete(':id')
  @RequirePermissions('campaigns.manage')
  delete(@Param('id') id: string) {
    return this.campaignsService.delete(id);
  }
}
