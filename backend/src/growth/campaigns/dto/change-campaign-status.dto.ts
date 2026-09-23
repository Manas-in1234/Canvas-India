import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CampaignStatus } from './create-campaign.dto.js';

export class ChangeCampaignStatusDto {
  @IsEnum(CampaignStatus)
  @IsNotEmpty()
  status: CampaignStatus;

  @IsString()
  @IsOptional()
  reason?: string;
}
