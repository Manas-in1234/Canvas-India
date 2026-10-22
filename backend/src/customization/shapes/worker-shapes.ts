import Jimp from 'jimp';
import potrace from 'potrace';
import svgpath from 'svgpath';
import { PNG } from 'pngjs';

export const MAX_SHAPE_BYTES = 1024 * 1024;
const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

function badRequest(message: string): never {
  throw Object.assign(new Error(message), { status: 400 });
}

export async function traceShape(bytes: Buffer) {
  let source: Jimp;
  try {
    if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
      if (bytes.length < 24 || bytes.readUInt32BE(16) * bytes.readUInt32BE(20) > 4_000_000)
        badRequest('Image must be no larger than 4 megapixels');
      const decoded = await new Promise<any>((resolve, reject) =>
        new PNG().parse(bytes, (error: Error | null, image: any) => error ? reject(error) : resolve(image)));
      source = new Jimp({ data: decoded.data, width: decoded.width, height: decoded.height });
    } else { source = await Jimp.read(bytes); }
  } catch (error: any) {
    console.error('Shape image decode failed:', error?.message);
    return badRequest('Upload a valid PNG or JPEG image');
  }
  const { width, height } = source.bitmap;
  if (width * height > 4_000_000) badRequest('Image must be no larger than 4 megapixels');
  // Flatten transparency onto white and bound tracing CPU independently of file size.
  const image = new Jimp(width, height, 0xffffffff).composite(source, 0, 0);
  image.scaleToFit(600, 600);
  const w = image.bitmap.width, h = image.bitmap.height;
  let border = 0, count = 0;
  for (let x = 0; x < w; x++) for (const y of [0, h - 1]) {
    const c = Jimp.intToRGBA(image.getPixelColor(x, y)); border += (c.r+c.g+c.b)/3; count++;
  }
  const svg = await new Promise<string>((resolve, reject) => potrace.trace(image as never,
    { threshold: 180, blackOnWhite: border / count >= 128, optCurve: true },
    (error: Error | null, result: string) => error ? reject(error) : resolve(result)));
  const path = /<path[^>]*\sd="([^"]+)"/.exec(svg)?.[1];
  if (!path?.trim()) badRequest('No outline found. Use a contrasting shape on a plain background');
  const svgPathData = svgpath(path).scale(1/w, 1/h).round(4).toString();
  const preview = await image.scaleToFit(200, 200).getBufferAsync(Jimp.MIME_PNG);
  return { svgPathData, preview, width, height };
}

export class WorkerShapes {
  constructor(private prisma: any) {}

  async approved() {
    return this.prisma.customShape.findMany({ where: { status: 'APPROVED' },
      select: { id: true, name: true, svgPathData: true }, orderBy: { createdAt: 'desc' } });
  }

  private present(shape: any) {
    const { previewAsset, ...data } = shape;
    return { ...data, previewUrl: previewAsset?.contentBytes
      ? `data:image/png;base64,${Buffer.from(previewAsset.contentBytes).toString('base64')}` : null };
  }

  async list(status?: string) {
    if (status && !VALID_STATUSES.includes(status)) badRequest('Invalid shape status');
    const shapes = await this.prisma.customShape.findMany({ where: status ? { status } : undefined,
      include: { previewAsset: { select: { contentBytes: true } } }, orderBy: { createdAt: 'desc' } });
    return shapes.map((s: any) => this.present(s));
  }

  async get(id: string) {
    const shape = await this.prisma.customShape.findUnique({ where: { id },
      include: { previewAsset: { select: { contentBytes: true } } } });
    if (!shape) throw Object.assign(new Error('Shape not found'), { status: 404 });
    return this.present(shape);
  }

  async upload(request: Request, userId: string) {
    if (Number(request.headers.get('Content-Length') || 0) > MAX_SHAPE_BYTES + 16384)
      badRequest('Image must be 1 MB or smaller');
    const form = await request.formData();
    const file = form.get('file'), name = String(form.get('name') || '').trim();
    if (!name || name.length > 120) badRequest('Provide a name of 1–120 characters');
    if (!file || typeof file === 'string' || !['image/png','image/jpeg'].includes(file.type))
      badRequest('Upload a PNG or JPEG image');
    if (!file.size || file.size > MAX_SHAPE_BYTES) badRequest('Image must be 1 MB or smaller');
    const bytes = Buffer.from(await file.arrayBuffer());
    const traced = await traceShape(bytes);
    const shape = await this.prisma.$transaction(async (tx: any) => {
      const asset = await tx.asset.create({ data: { ownerType: 'CustomShape', ownerId: userId,
        storageKey: `custom-shapes/${crypto.randomUUID()}/source`, fileName: file.name,
        mimeType: file.type, fileSize: bytes.length, contentBytes: bytes,
        width: traced.width, height: traced.height, assetType: 'ORIGINAL', uploadStatus: 'READY' } });
      const preview = await tx.asset.create({ data: { ownerType: 'CustomShape', ownerId: userId,
        storageKey: `custom-shapes/${asset.id}/preview`, fileName: 'preview.png', mimeType: 'image/png',
        fileSize: traced.preview.length, contentBytes: traced.preview, assetType: 'PREVIEW', uploadStatus: 'READY' } });
      return tx.customShape.create({ data: { name, sourceAssetId: asset.id, previewAssetId: preview.id,
        svgPathData: traced.svgPathData, createdBy: userId, status: 'PENDING' } });
    });
    return this.get(shape.id);
  }

  async review(id: string, status: 'APPROVED' | 'REJECTED', userId: string, reason?: string) {
    if (reason && (typeof reason !== 'string' || reason.length > 1000)) badRequest('Reason must be 1000 characters or fewer');
    await this.prisma.$transaction(async (tx: any) => {
      const result = await tx.customShape.updateMany({ where: { id, status: 'PENDING' },
        data: { status, reviewedBy: userId, reviewedAt: new Date(), rejectionReason: status === 'REJECTED' ? reason : null } });
      if (!result.count) badRequest('Shape is missing or has already been reviewed');
      await tx.auditLog.create({ data: { adminUserId: userId, action: `CUSTOM_SHAPE_${status}`,
        entityType: 'CustomShape', entityId: id, reason } });
    });
    return this.get(id);
  }
}
