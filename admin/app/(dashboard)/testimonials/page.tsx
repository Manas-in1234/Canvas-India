'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const endpoint = '/admin/homepage-testimonials';

type Testimonial = { id: string; name: string; city: string; text: string; img: string };

function newTestimonial(): Testimonial {
  return { id: crypto.randomUUID(), name: '', city: '', text: '', img: '' };
}

export default function TestimonialsPage() {
  const query = useQuery({ queryKey: ['homepage-testimonials'], queryFn: () => apiClient.get<Testimonial[]>(endpoint) });
  const [rows, setRows] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (query.data) setRows(query.data);
  }, [query.data]);

  const save = useMutation({
    mutationFn: () => apiClient.put<Testimonial[]>(endpoint, rows),
    onSuccess: (saved) => {
      setRows(saved);
      toast.success('Testimonials published to the homepage');
    },
  });

  const update = (id: string, patch: Partial<Testimonial>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  const remove = (id: string) => setRows((current) => current.filter((row) => row.id !== id));
  const add = () => setRows((current) => [...current, newTestimonial()]);

  const invalid = rows.some((row) => !row.name.trim() || !row.city.trim() || !row.text.trim());

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Edit the “What Our Customers Say” cards shown on the storefront homepage. These are
          separate from the verified-purchase <a href="/reviews" className="underline">product Reviews</a>.
        </p>
      </div>

      {query.isPending ? (
        <p>Loading testimonials…</p>
      ) : query.isError ? (
        <p role="alert">Could not load testimonials.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          {rows.map((row, index) => (
            <div key={row.id} className="space-y-3 rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Testimonial {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(row.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  Customer name
                  <Input
                    required
                    maxLength={80}
                    value={row.name}
                    onChange={(event) => update(row.id, { name: event.target.value })}
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  City
                  <Input
                    required
                    maxLength={80}
                    value={row.city}
                    onChange={(event) => update(row.id, { city: event.target.value })}
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm">
                Review text
                <textarea
                  required
                  maxLength={400}
                  rows={3}
                  value={row.text}
                  onChange={(event) => update(row.id, { text: event.target.value })}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                Photo URL (optional)
                <Input
                  maxLength={2000}
                  placeholder="https://..."
                  value={row.img}
                  onChange={(event) => update(row.id, { img: event.target.value })}
                />
              </label>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={add}>
            <Plus className="h-3.5 w-3.5" />
            Add testimonial
          </Button>

          {save.error && <p role="alert" className="text-sm text-destructive">{save.error.message}</p>}

          <div>
            <Button type="submit" disabled={save.isPending || invalid}>
              {save.isPending ? 'Publishing…' : 'Publish to homepage'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
