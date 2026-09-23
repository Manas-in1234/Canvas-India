import { describe, expect, it, vi } from 'vitest';
import { ReturnsReplacementsService } from './returns-replacements.service.js';

describe('ReturnsReplacementsService', () => {
  it('approves a replacement and creates a new production job', async () => {
    const replacementRequest = {
      id: 'replacement-1',
      orderId: 'order-1',
      orderItemId: 'item-1',
      complaintReason: 'Damaged during delivery',
      status: 'REVIEW',
      order: {},
      orderItem: {},
    };

    const updatedRequest = {
      ...replacementRequest,
      status: 'APPROVED',
    };

    const productionJob = {
      id: 'job-new',
      orderItemId: 'item-1',
      status: 'QUEUED',
      stages: [],
    };

    const tx = {
      replacementRequest: {
        update: vi.fn().mockResolvedValue(updatedRequest),
      },
      orderEvent: {
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const prisma = {
      returnRequest: {},
      replacementRequest: {
        findUnique: vi.fn().mockResolvedValue(replacementRequest),
      },
      $transaction: vi.fn(async (callback: (tx: typeof tx) => unknown) =>
        callback(tx),
      ),
    };

    const jobsService = {
      createForOrderItem: vi.fn().mockResolvedValue(productionJob),
    };

    const ordersService = {
      refund: vi.fn(),
    };

    const service = new ReturnsReplacementsService(
      prisma as never,
      jobsService as never,
      ordersService as never,
    );

    const result = await service.approveReplacement('replacement-1');

    expect(jobsService.createForOrderItem).toHaveBeenCalledWith(
      'item-1',
      true,
      tx,
    );

    expect(tx.replacementRequest.update).toHaveBeenCalledWith({
      where: { id: 'replacement-1' },
      data: { status: 'APPROVED' },
    });

    expect(tx.orderEvent.create).toHaveBeenCalled();

    expect(result).toEqual({
      request: updatedRequest,
      productionJob,
    });
  });
});
