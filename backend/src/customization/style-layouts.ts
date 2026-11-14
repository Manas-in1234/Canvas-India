import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const ownerType = 'CustomizerStyleLayout';
const key = (styleId: string, id: string) => 'customizer/layouts/' + styleId + '/' + id;
export type LayoutPanel = { id: string; x: number; y: number; width: number; height: number; rotation: number };
type Layout = { id: string; name: string; price: number; visible: boolean; outline: string; shapeId: string; panels: LayoutPanel[] };
const select = { id: true, slug: true, defaultShapeId: true } as const;
const idPattern = /^[a-zA-Z0-9-]{1,64}$/;
const decoder = new TextDecoder();

function parse(bytes: Uint8Array | null) {
  return bytes ? JSON.parse(decoder.decode(bytes)) as Layout : null;
}

export class StyleLayouts {
  constructor(private readonly prisma: PrismaClient) {}

  async list(material: 'CANVAS' | 'ACRYLIC', adminStyleId?: string) {
    const styles = await this.prisma.customizerProductType.findMany({
      where: adminStyleId ? { id: adminStyleId } : { material, isActive: true, defaultShapeId: { startsWith: 'custom-' } },
      select,
    });
    if (adminStyleId && !styles.length) throw new NotFoundException('Style not found.');
    const byId = new Map(styles.map(style => [style.id, style]));
    const rows = await this.prisma.asset.findMany({
      where: { ownerType, ownerId: { in: [...byId.keys()] } },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { ownerId: true, contentBytes: true },
    });
    return rows.flatMap(row => {
      const layout = parse(row.contentBytes);
      const style = byId.get(row.ownerId);
      if (!layout || !style || (!adminStyleId && (!layout.visible || layout.shapeId !== style.defaultShapeId))) return [];
      return [{ ...layout, style: style.slug }];
    });
  }

  async save(styleId: string, id: string, input: unknown, adminUserId: string) {
    if (!idPattern.test(id)) throw new BadRequestException('Invalid layout identifier.');
    const body = (input ?? {}) as Partial<Layout>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const price = body.price;
    if (!name || name.length > 100 || typeof price !== 'number' || !Number.isFinite(price) ||
      price < 0 || price > 10000000 || typeof body.visible !== 'boolean') {
      throw new BadRequestException('Enter a name, a valid price and a visibility setting.');
    }
    if (!Array.isArray(body.panels) || body.panels.length === 0 || body.panels.length > 200) {
      throw new BadRequestException('A layout needs between 1 and 200 panels.');
    }
    const seen = new Set<string>();
    const panels = body.panels.map(panel => {
      if (!panel || typeof panel.id !== 'string' || !idPattern.test(panel.id) || seen.has(panel.id) ||
        ![panel.x, panel.y, panel.width, panel.height, panel.rotation].every(Number.isFinite) ||
        Math.abs(panel.x) > 10000 || Math.abs(panel.y) > 10000 ||
        panel.width < 0.25 || panel.height < 0.25 || panel.width > 1000 || panel.height > 1000 ||
        Math.abs(panel.rotation) > 360) {
        throw new BadRequestException('Each panel needs a valid position, size and rotation.');
      }
      seen.add(panel.id);
      const { id, x, y, width, height, rotation } = panel;
      return { id, x, y, width, height, rotation };
    });
    return this.prisma.$transaction(async tx => {
      const style = await tx.customizerProductType.findUnique({ where: { id: styleId }, select });
      if (!style) throw new NotFoundException('Style not found.');
      const shapeId = style.defaultShapeId ?? '';
      const shape = shapeId.startsWith('custom-') ? await tx.customShape.findUnique({
        where: { id: shapeId.slice('custom-'.length) },
        select: { clipPathType: true, clipPathValue: true, origin: true, status: true },
      }) : null;
      if (shape?.origin !== 'ADMIN_UPLOADED' || shape.status !== 'APPROVED' || shape.clipPathType !== 'SVG_PATH') {
        throw new BadRequestException('Set an approved detected shape as this style’s default shape first.');
      }
      const layout = { id, name, price: Math.round(price * 100) / 100, visible: body.visible!, outline: shape.clipPathValue, shapeId, panels };
      const contentBytes = new TextEncoder().encode(JSON.stringify(layout));
      const data = { contentBytes, fileSize: contentBytes.byteLength };
      const storageKey = key(styleId, id);
      await tx.asset.upsert({ where: { storageKey }, update: data, create: { ...data, storageKey,
        ownerType, ownerId: styleId, fileName: 'layout.json', mimeType: 'application/json', assetType: 'ORIGINAL', uploadStatus: 'READY',
      } });
      await tx.auditLog.create({ data: { adminUserId, action: 'CUSTOMIZER_LAYOUT_SAVED', entityType: ownerType, entityId: id } });
      return { ...layout, style: style.slug };
    });
  }

  async remove(styleId: string, id: string, adminUserId: string) {
    await this.prisma.$transaction(async tx => {
      const deleted = await tx.asset.deleteMany({ where: { storageKey: key(styleId, id), ownerType } });
      if (deleted.count) {
        await tx.auditLog.create({ data: { adminUserId, action: 'CUSTOMIZER_LAYOUT_DELETED', entityType: ownerType, entityId: id } });
      }
    });
  }
}
