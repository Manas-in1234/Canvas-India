export interface DiscountTierConfig {
  note: string;
  initialUsersCount: number | null;
  initialUsersDiscount: number | null;
  initialUsersDiscountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
}

export function parseDiscountDescription(desc: string | null | undefined): DiscountTierConfig {
  if (!desc) {
    return {
      note: '',
      initialUsersCount: null,
      initialUsersDiscount: null,
      initialUsersDiscountType: 'PERCENTAGE',
    };
  }

  const trimmed = desc.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          note: typeof parsed.note === 'string' ? parsed.note : (typeof parsed.description === 'string' ? parsed.description : ''),
          initialUsersCount: parsed.initialUsersCount != null ? Number(parsed.initialUsersCount) : null,
          initialUsersDiscount: parsed.initialUsersDiscount != null ? Number(parsed.initialUsersDiscount) : null,
          initialUsersDiscountType: parsed.initialUsersDiscountType === 'FIXED_AMOUNT' ? 'FIXED_AMOUNT' : 'PERCENTAGE',
        };
      }
    } catch {
      // plain text note fallback
    }
  }

  return {
    note: desc,
    initialUsersCount: null,
    initialUsersDiscount: null,
    initialUsersDiscountType: 'PERCENTAGE',
  };
}

export function formatDiscountDescription(config: {
  note?: string;
  initialUsersCount?: number | null;
  initialUsersDiscount?: number | null;
  initialUsersDiscountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
}): string {
  const note = (config.note ?? '').trim();
  const count = config.initialUsersCount != null && config.initialUsersCount > 0 ? Number(config.initialUsersCount) : null;
  const discount = config.initialUsersDiscount != null && config.initialUsersDiscount > 0 ? Number(config.initialUsersDiscount) : null;
  const type = config.initialUsersDiscountType === 'FIXED_AMOUNT' ? 'FIXED_AMOUNT' : 'PERCENTAGE';

  if (count && discount) {
    return JSON.stringify({
      note,
      initialUsersCount: count,
      initialUsersDiscount: discount,
      initialUsersDiscountType: type,
    });
  }

  return note;
}
