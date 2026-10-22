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
    expect(traced.svgPathData).toMatch(/^M/);
    const coordinates = traced.svgPathData.match(/-?\d*\.?\d+/g)!.map(Number);
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
      where: {status: 'APPROVED'}, select: {id:true, name:true, svgPathData:true}
    }));
  });

  it('does not approve an already reviewed shape or write a misleading audit event', async () => {
    const tx = { customShape: {updateMany: vi.fn().mockResolvedValue({count:0})}, auditLog:{create:vi.fn()} };
    await expect(new WorkerShapes({$transaction:(fn: any)=>fn(tx)}).review('id','APPROVED','admin')).rejects.toThrow('already been reviewed');
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });
});
