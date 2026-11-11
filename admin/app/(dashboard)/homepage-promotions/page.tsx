'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const endpoint = '/admin/homepage-promotions';
const presets = ['Festive Sale', 'Anniversary Sale', 'Valentine’s Day Sale', 'Independence Day Sale', 'Republic Day Sale'];
type Settings = { saleName: string; percentage: number; codes: string[] };

export default function HomepagePromotionsPage() {
  const settings = useQuery({ queryKey: ['homepage-promotions'], queryFn: () => apiClient.get<Settings>(endpoint) });
  const discounts = useQuery({ queryKey: ['discounts'], queryFn: () => apiClient.get<{ code: string }[]>('/growth/discounts') });
  const [saleType, setSaleType] = useState(presets[0]);
  const [customName, setCustomName] = useState('');
  const [percentage, setPercentage] = useState('20');
  const [codes, setCodes] = useState(['', '']);

  useEffect(() => {
    if (!settings.data) return;
    const { saleName, percentage, codes } = settings.data;
    setSaleType(presets.includes(saleName) ? saleName : 'custom');
    setCustomName(presets.includes(saleName) ? '' : saleName);
    setPercentage(String(percentage));
    setCodes([codes[0] ?? '', codes[1] ?? '']);
  }, [settings.data]);

  const save = useMutation({
    mutationFn: () => apiClient.put<Settings>(endpoint, {
      saleName: saleType === 'custom' ? customName : saleType,
      percentage: Number(percentage),
      codes,
    }),
    onSuccess: () => toast.success('Homepage promotions published'),
  });
  const missing = codes.map(code => !!code.trim() && !!discounts.data && !discounts.data.some(row => row.code.toUpperCase() === code.trim().toUpperCase()));

  return <div className="max-w-2xl space-y-5">
    <h1 className="text-2xl font-semibold">Homepage Promotions</h1>
    {settings.isPending ? <p>Loading promotions…</p> : settings.isError ? <p role="alert">Could not load homepage promotions.</p> :
      <form className="space-y-5 rounded-lg border bg-card p-5" onSubmit={event => { event.preventDefault(); save.mutate(); }}>
        <label className="grid gap-2">Sale type
          <select className="rounded border bg-background p-2" value={saleType} onChange={event => setSaleType(event.target.value)}>
            {presets.map(name => <option key={name}>{name}</option>)}
            <option value="custom">Custom sale</option>
          </select>
        </label>
        {saleType === 'custom' && <label className="grid gap-2">Custom sale name<Input required maxLength={60} value={customName} onChange={event => setCustomName(event.target.value)} /></label>}
        <label className="grid gap-2">Sale percentage (banner and hanging badge)<Input required type="number" min={1} max={100} step={1} value={percentage} onChange={event => setPercentage(event.target.value)} /></label>
        <p className="text-sm text-muted-foreground">The percentage is for display. Set checkout discounts in <Link href="/discounts" className="underline">Discount Codes</Link>.</p>
        <datalist id="homepage-discount-codes">{discounts.data?.map(({ code }) => <option key={code} value={code} />)}</datalist>
        {codes.map((code, index) => <div key={index} className="space-y-1">
          <label className="grid gap-2">Discount code {index + 1}<Input list="homepage-discount-codes" maxLength={80} value={code} onChange={event => setCodes(current => current.map((value, position) => position === index ? event.target.value : value))} /></label>
          {missing[index] && <p role="alert" className="text-sm text-destructive">This discount code hasn’t been created yet. <Link href="/discounts/new" className="underline">Create a discount code</Link>.</p>}
        </div>)}
        {save.error && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}
        <Button type="submit" disabled={save.isPending || missing.some(Boolean)}>{save.isPending ? 'Publishing…' : 'Publish to homepage'}</Button>
      </form>}
  </div>;
}
