import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export class SendRecoveryNotificationDto {
  @IsString()
  @IsOptional()
  discountCode?: string;

  @IsEnum(NotificationChannel)
  @IsOptional()
  channel?: NotificationChannel = NotificationChannel.EMAIL;

  @IsString()
  @IsOptional()
  customMessage?: string;
}
