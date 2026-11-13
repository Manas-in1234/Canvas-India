import { describe, it, expect, vi } from 'vitest';
import Jimp from 'jimp';
import { WorkerShapes, traceShape } from './worker-shapes.js';

describe('Worker custom shapes', () => {
  it('traces a dark silhouette on a light background into normalized coordinates', async () => {
    const image = new Jimp(80, 60, 0xffffffff);
    image.scan(20, 10, 40, 40, (_x, _y, i) => {
      image.bitmap.data[i] = image.bitmap.data[i+1] = image.bitmap.data[i+2] = 0;
    });
    const traced = await traceShape(await image.getBufferAsync(Jimp.MIME_PNG));
    expect(traced.width).toBe(80);
    expect(traced.clipPathValue).toMatch(/^M/);
    const coordinates = traced.clipPathValue.match(/-?\d*\.?\d+/g)!.map(Number);
    expect(coordinates.every(n => n >= 0 && n <= 1)).toBe(true);
    expect(traced.preview.length).toBeGreaterThan(50);
  });

  it('rejects invalid images and blank silhouettes', async () => {
    await expect(traceShape(Buffer.from('invalid'))).rejects.toThrow('valid PNG or JPEG');
    const blank = await new Jimp(20, 20, 0xffffffff).getBufferAsync(Jimp.MIME_PNG);
    await expect(traceShape(blank)).rejects.toThrow('No outline found');
  });

  it('only publishes approved shapes and never exposes image bytes publicly', async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    await new WorkerShapes({customShape: {findMany}}).approved();
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {status: 'APPROVED'}, select: {id:true, name:true, clipPathValue:true, clipPathType:true, origin:true}
    }));
  });

  it('does not approve an already reviewed shape or write a misleading audit event', async () => {
    const tx = { customShape: {updateMany: vi.fn().mockResolvedValue({count:0})}, auditLog:{create:vi.fn()} };
    await expect(new WorkerShapes({$transaction:(fn: any)=>fn(tx)}).review('id','APPROVED','admin')).rejects.toThrow('already been reviewed');
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  describe('edit and remove', () => {
    const txWith = (existing: any) => ({
      customShape: { findUnique: vi.fn().mockResolvedValue(existing), update: vi.fn(), delete: vi.fn() },
      asset: { deleteMany: vi.fn() },
      auditLog: { create: vi.fn() },
    });
    const shapesFor = (tx: any) => new WorkerShapes({ $transaction: (fn: any) => fn(tx), customShape: { findUnique: vi.fn().mockResolvedValue({ id: 's1' }) } });

    it('updates only the allowed fields and records an audit event', async () => {
      const tx = txWith({ id: 's1', status: 'APPROVED' });
      await shapesFor(tx).updateMetadata('s1', { name: ' Star ', priceMode: 'FLAT', flatPrice: '150', origin: 'BUILT_IN', clipPathValue: 'x' }, 'admin');
      expect(tx.customShape.update).toHaveBeenCalledWith({ where: { id: 's1' }, data: { name: 'Star', priceMode: 'FLAT', flatPrice: '150' } });
      expect(tx.auditLog.create).toHaveBeenCalled();
    });

    it('rejects bad names, prices and an empty update', async () => {
      const tx = txWith({ id: 's1', status: 'APPROVED' });
      const shapes = shapesFor(tx);
      await expect(shapes.updateMetadata('s1', { name: '  ' }, 'a')).rejects.toThrow('name');
      await expect(shapes.updateMetadata('s1', { flatPrice: '-5' }, 'a')).rejects.toThrow('0 or more');
      await expect(shapes.updateMetadata('s1', { priceMode: 'AREA_RATE', areaRatePerSqIn: '0' }, 'a')).rejects.toThrow('greater than 0');
      await expect(shapes.updateMetadata('s1', {}, 'a')).rejects.toThrow('Nothing to update');
      expect(tx.customShape.update).not.toHaveBeenCalled();
    });

    it('will not enable or disable a shape that is still awaiting review', async () => {
      const tx = txWith({ id: 's1', status: 'PENDING' });
      await expect(shapesFor(tx).updateMetadata('s1', { status: 'REJECTED' }, 'a')).rejects.toThrow('Review this shape');
      expect(tx.customShape.update).not.toHaveBeenCalled();
    });

    it('removes an uploaded shape together with its images', async () => {
      const tx = txWith({ id: 's1', origin: 'ADMIN_UPLOADED', sourceAssetId: 'a1', previewAssetId: 'a2' });
      await shapesFor(tx).remove('s1', 'admin');
      expect(tx.customShape.delete).toHaveBeenCalledWith({ where: { id: 's1' } });
      expect(tx.asset.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ['a1', 'a2'] } } });
      expect(tx.auditLog.create).toHaveBeenCalled();
    });

    it('never removes a built-in shape and 404s on a missing one', async () => {
      const builtIn = txWith({ id: 's1', origin: 'BUILT_IN' });
      await expect(shapesFor(builtIn).remove('s1', 'a')).rejects.toThrow('Built-in');
      expect(builtIn.customShape.delete).not.toHaveBeenCalled();
      await expect(shapesFor(txWith(null)).remove('s1', 'a')).rejects.toThrow('not found');
    });
  });
});
