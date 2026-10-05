// Money fields arrive from the backend as Prisma Decimal serialized to
// strings (never numbers) — format via string parsing at the display
// boundary only, never do float arithmetic on these values upstream.
export function formatCurrency(value: string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

// Analytics summaries return plain numbers (not Decimal-as-string like
// Order/Product fields) — a separate formatter avoids silently mis-handling
// either shape.
export function formatCurrencyNumber(value: number): string {
  if (Number.isNaN(value)) return String(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
