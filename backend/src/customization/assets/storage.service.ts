import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const SIGNED_URL_EXPIRY_SECONDS = 15 * 60;

/**
 * Thin wrapper around the S3-compatible client (scope §90-91: signed
 * upload/download URLs, sensitive assets never publicly accessible). Backed
 * by MinIO locally; swapping to real S3/R2 in production is a config change
 * only — nothing above this service depends on the endpoint being MinIO.
 */
@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('s3.bucket')!;
    this.publicEndpoint = this.configService.get<string>('s3.publicEndpoint')!;
    this.client = new S3Client({
      endpoint: this.configService.get<string>('s3.endpoint'),
      region: this.configService.get<string>('s3.region'),
      forcePathStyle: true, // required for MinIO
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKey')!,
        secretAccessKey: this.configService.get<string>('s3.secretKey')!,
      },
    });
  }

  buildStorageKey(ownerType: string, ownerId: string, fileName: string): string {
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${ownerType.toLowerCase()}/${ownerId}/${randomUUID()}-${safeName}`;
  }

  async getSignedUploadUrl(storageKey: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: storageKey, ContentType: mimeType });
    return getSignedUrl(this.client, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
  }

  async getSignedDownloadUrl(storageKey: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: storageKey });
    return getSignedUrl(this.client, command, { expiresIn: SIGNED_URL_EXPIRY_SECONDS });
  }

  async getObjectBuffer(storageKey: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: storageKey }));
    const byteArray = await response.Body!.transformToByteArray();
    return Buffer.from(byteArray);
  }

  async putObjectBuffer(storageKey: string, body: Buffer, mimeType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: storageKey, Body: body, ContentType: mimeType }),
    );
  }
}
