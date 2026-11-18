import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '../generated/prisma/client.js';

const maxSubjectLength = 200;
const maxBodyLength = 20000;
const RESEND_BATCH_SIZE = 100;

export class Broadcasts {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly resendApiKey: string | undefined,
    private readonly fromEmail: string | undefined,
  ) {}

  async list() {
    return this.prisma.broadcast.findMany({
      orderBy: { createdAt: 'desc' },
      include: { targetSegment: { select: { name: true } } },
    });
  }

  private async recipientCount(targetSegmentId: string | null) {
    if (targetSegmentId) {
      return this.prisma.customer.count({
        where: { email: { not: null }, segmentMemberships: { some: { segmentId: targetSegmentId } } },
      });
    }
    return this.prisma.customer.count({ where: { email: { not: null } } });
  }

  async create(subject: string, body: string, targetSegmentId: string | null, adminUserId: string) {
    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();
    if (!trimmedSubject || trimmedSubject.length > maxSubjectLength) {
      throw new BadRequestException(`Subject must be 1-${maxSubjectLength} characters.`);
    }
    if (!trimmedBody || trimmedBody.length > maxBodyLength) {
      throw new BadRequestException(`Message must be 1-${maxBodyLength} characters.`);
    }
    if (targetSegmentId) {
      const segment = await this.prisma.customerSegment.findUnique({ where: { id: targetSegmentId } });
      if (!segment) throw new BadRequestException('That customer segment no longer exists.');
    }
    const recipientCount = await this.recipientCount(targetSegmentId);
    return this.prisma.broadcast.create({
      data: { subject: trimmedSubject, body: trimmedBody, targetSegmentId, recipientCount, createdBy: adminUserId },
    });
  }

  async remove(id: string) {
    const broadcast = await this.prisma.broadcast.findUnique({ where: { id } });
    if (!broadcast) throw new NotFoundException('Broadcast not found.');
    if (broadcast.status === 'SENDING' || broadcast.status === 'SENT') {
      throw new BadRequestException('A sent broadcast cannot be deleted, to keep an accurate send history.');
    }
    await this.prisma.broadcast.delete({ where: { id } });
    return { deleted: true };
  }

  async send(id: string) {
    const broadcast = await this.prisma.broadcast.findUnique({ where: { id } });
    if (!broadcast) throw new NotFoundException('Broadcast not found.');
    if (broadcast.status !== 'DRAFT' && broadcast.status !== 'FAILED') {
      throw new BadRequestException('This broadcast has already been sent.');
    }
    if (!this.resendApiKey?.trim() || !this.fromEmail?.trim()) {
      throw new BadRequestException('Email sending is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL to send broadcasts.');
    }

    const customers = await this.prisma.customer.findMany({
      where: broadcast.targetSegmentId
        ? { email: { not: null }, segmentMemberships: { some: { segmentId: broadcast.targetSegmentId } } }
        : { email: { not: null } },
      select: { email: true },
    });
    const emails = [...new Set(customers.map(c => c.email!).filter(Boolean))];

    await this.prisma.broadcast.update({ where: { id }, data: { status: 'SENDING', recipientCount: emails.length } });

    let sentCount = 0;
    let failedCount = 0;
    for (let i = 0; i < emails.length; i += RESEND_BATCH_SIZE) {
      const batch = emails.slice(i, i + RESEND_BATCH_SIZE);
      try {
        const response = await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(batch.map(email => ({
            from: this.fromEmail,
            to: [email],
            subject: broadcast.subject,
            html: broadcast.body,
          }))),
        });
        if (response.ok) {
          sentCount += batch.length;
        } else {
          failedCount += batch.length;
        }
      } catch {
        failedCount += batch.length;
      }
    }

    return this.prisma.broadcast.update({
      where: { id },
      data: {
        status: failedCount === 0 ? 'SENT' : (sentCount === 0 ? 'FAILED' : 'SENT'),
        sentCount,
        failedCount,
        sentAt: new Date(),
        errorMessage: failedCount > 0 ? `${failedCount} of ${emails.length} recipient(s) failed to send.` : null,
      },
    });
  }
}
