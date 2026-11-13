'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DiscountExpiryFields({ neverExpires, setNeverExpires, date, setDate }: {
  neverExpires: boolean;
  setNeverExpires: (value: boolean) => void;
  date: string;
  setDate: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-medium">Expiry</legend>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={neverExpires} onChange={event => setNeverExpires(event.target.checked)} />
        Never expires
      </label>
      {!neverExpires && (
        <div className="space-y-2">
          <Label htmlFor="discount-expiry-date">Expiry date</Label>
          <Input id="discount-expiry-date" type="date" required value={date}
            onChange={event => setDate(event.target.value)} />
        </div>
      )}
    </fieldset>
  );
}
