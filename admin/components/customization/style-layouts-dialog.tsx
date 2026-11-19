'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import type { CustomizerProductType } from '@/lib/types/customizer-product-type';
import type { CustomShapeListItem } from '@/lib/types/shape';

type Panel = { id: string; x: number; y: number; width: number; height: number; rotation: number };
type Layout = { id: string; name: string; price: number; visible: boolean; panels: Panel[] };
const maxPanels = 200;
const defaultView = { x: -6, y: -6, width: 48, height: 32 };
const controls = [['x', 'Left (in)'], ['y', 'Top (in)'], ['width', 'Width (in)'], ['height', 'Height (in)'], ['rotation', 'Rotation (°)']] as const;

function fit(panels: Panel[]) {
  const extents = panels.map(p => {
    const radius = Math.hypot(p.width, p.height) / 2;
    return { x: p.x + p.width / 2, y: p.y + p.height / 2, radius };
  });
  const x = Math.min(...extents.map(p => p.x - p.radius)) - 3;
  const y = Math.min(...extents.map(p => p.y - p.radius)) - 3;
  return { x, y, width: Math.max(...extents.map(p => p.x + p.radius)) + 3 - x,
    height: Math.max(...extents.map(p => p.y + p.radius)) + 3 - y };
}

function LayoutEditor({ layout, outline, busy, onSave, onBack }: {
  layout: Layout; outline: string; busy: boolean; onSave: (layout: Layout) => void; onBack: () => void;
}) {
  const [draft, setDraft] = useState(layout);
  const [selected, setSelected] = useState(layout.panels[0].id);
  const [view, setView] = useState(() => layout.panels.length > 1 ? fit(layout.panels) : defaultView);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ panel: Panel; x: number; y: number; resize?: boolean } | null>(null);
  const current = draft.panels.find(p => p.id === selected) ?? draft.panels[0];

  function editPanel(panel: Panel) {
    setDraft(previous => ({ ...previous, panels: previous.panels.map(p => p.id === panel.id ? panel : p) }));
  }

  function copy(duplicate: boolean) {
    const source = duplicate ? current : draft.panels[0];
    const panel = { ...source, id: crypto.randomUUID(), x: duplicate ? current.x + 2 : current.x + current.width + 1, y: current.y + (duplicate ? 2 : 0) };
    const panels = [...draft.panels, panel];
    setDraft({ ...draft, panels });
    setSelected(panel.id);
    if (panel.x + panel.width > view.x + view.width || panel.y + panel.height > view.y + view.height) setView(fit(panels));
  }

  function point(event: PointerEvent<SVGElement>) {
    const matrix = svg.current?.getScreenCTM();
    return matrix && new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  }

  return (
    <form className="space-y-4" onSubmit={event => { event.preventDefault(); onSave(draft); }}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">Layout name<Input required maxLength={100} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
        <label className="space-y-1 text-sm">Layout base price (₹)<Input type="number" required min={0} max={10000000} step=".01" value={draft.price} onChange={e => setDraft({ ...draft, price: Number(e.target.value) })} /></label>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={draft.panels.length >= maxPanels} onClick={() => copy(false)}>Add panel</Button>
        <Button type="button" size="sm" variant="outline" disabled={draft.panels.length >= maxPanels} onClick={() => copy(true)}>Duplicate</Button>
        <Button type="button" size="sm" variant="outline" disabled={draft.panels.length === 1} onClick={() => {
          const panels = draft.panels.filter(p => p.id !== current.id);
          setDraft({ ...draft, panels });
          setSelected(panels[0].id);
        }}>Remove panel</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setView(fit(draft.panels))}>Fit to panels</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setView(v => ({ x: v.x - v.width / 4, y: v.y - v.height / 4, width: v.width * 1.5, height: v.height * 1.5 }))}>Zoom out</Button>
        <span className="text-sm text-muted-foreground">{draft.panels.length} / {maxPanels} panels</span>
      </div>
      <svg ref={svg} viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`} className="h-[42vh] w-full touch-none rounded-lg border bg-slate-50"
        aria-label="Layout canvas" onPointerMove={event => {
          const start = drag.current;
          const target = point(event);
          if (!start || !target) return;
          const round = (n: number) => Math.round(n * 100) / 100;
          const dx = target.x - start.x;
          const dy = target.y - start.y;
          if (start.resize) {
            const angle = start.panel.rotation * Math.PI / 180;
            const width = Math.max(0.25, round(start.panel.width + 2 * (dx * Math.cos(angle) + dy * Math.sin(angle))));
            const height = Math.max(0.25, round(start.panel.height + 2 * (dy * Math.cos(angle) - dx * Math.sin(angle))));
            editPanel({ ...start.panel, width, height, x: start.panel.x + (start.panel.width - width) / 2,
              y: start.panel.y + (start.panel.height - height) / 2 });
          } else {
            editPanel({ ...start.panel, x: round(start.panel.x + dx), y: round(start.panel.y + dy) });
          }
        }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
        {draft.panels.map((panel, index) => (
          <g key={panel.id} transform={`rotate(${panel.rotation} ${panel.x + panel.width / 2} ${panel.y + panel.height / 2})`} className="cursor-move"
            onPointerDown={event => {
              const target = point(event);
              if (!target || event.button !== 0) return;
              setSelected(panel.id);
              drag.current = { panel, x: target.x, y: target.y };
              svg.current?.setPointerCapture(event.pointerId);
            }}>
            <path d={outline} transform={`translate(${panel.x} ${panel.y}) scale(${panel.width} ${panel.height})`}
              fill={selected === panel.id ? '#bfdbfe' : '#e2e8f0'} stroke={selected === panel.id ? '#0e4a93' : '#64748b'}
              strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <text x={panel.x + panel.width / 2} y={panel.y + panel.height / 2} textAnchor="middle" dominantBaseline="central"
              fontSize={Math.min(panel.width, panel.height) * 0.24} fill="#0e4a93" pointerEvents="none">{index + 1}</text>
            {selected === panel.id && <circle cx={panel.x + panel.width} cy={panel.y + panel.height}
              r={Math.min(view.width, view.height) / 70} fill="#fff" stroke="#0e4a93"
              vectorEffect="non-scaling-stroke" className="cursor-nwse-resize" aria-label="Resize panel"
              onPointerDown={event => {
                event.stopPropagation();
                const target = point(event);
                if (!target || event.button !== 0) return;
                drag.current = { panel, x: target.x, y: target.y, resize: true };
                svg.current?.setPointerCapture(event.pointerId);
              }} />}
          </g>
        ))}
      </svg>
      <label className="flex items-center gap-2 text-sm">Selected panel
        <select className="rounded border px-2 py-1" value={current.id} onChange={e => setSelected(e.target.value)}>
          {draft.panels.map((panel, index) => <option key={panel.id} value={panel.id}>Panel {index + 1}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {controls.map(([key, label]) => (
          <label key={key} className="space-y-1 text-sm">{label}<Input key={current.id} type="number" step="any" required
            defaultValue={current[key]} onFocus={e => { e.currentTarget.value = String(current[key]); }}
            onChange={e => { if (e.target.value !== '') editPanel({ ...current, [key]: Number(e.target.value) }); }}
            ref={node => { if (node && document.activeElement !== node) node.value = String(current[key]); }} /></label>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.visible} onChange={e => setDraft({ ...draft, visible: e.target.checked })} /> Show on storefront</label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={busy} onClick={onBack}>Cancel</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save layout'}</Button>
      </div>
    </form>
  );
}

export function StyleLayoutsDialog({ style, shape, onClose }: {
  style: CustomizerProductType; shape: CustomShapeListItem; onClose: () => void;
}) {
  const base = '/admin/customizer-product-types/' + style.id + '/layouts';
  const queryKey = ['style-layouts', style.id];
  const client = useQueryClient();
  const { data, error, isPending, refetch } = useQuery({ queryKey, queryFn: () => apiClient.get<Layout[]>(base) });
  const [editing, setEditing] = useState<Layout>();
  const action = useMutation({
    mutationFn: ({ layout, remove }: { layout: Layout; remove?: boolean }) =>
      remove ? apiClient.delete(base + '/' + layout.id) : apiClient.put(base + '/' + layout.id, layout),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey });
      setEditing(undefined);
    },
  });

  return (
    <Dialog open onOpenChange={open => {
      if (!open && !action.isPending && (!editing || window.confirm('Discard unsaved layout changes?'))) onClose();
    }}>
      <DialogContent className="max-h-[92vh] overflow-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{style.name} layouts</DialogTitle>
          <DialogDescription>Arrange copies of the {shape.name} outline. Shoppers get one photo slot per panel.</DialogDescription>
        </DialogHeader>
        {action.error && <p role="alert" className="text-sm text-destructive">{action.error.message}</p>}
        {editing ? (
          <LayoutEditor key={editing.id} layout={editing} outline={shape.clipPathValue} busy={action.isPending}
            onSave={layout => action.mutate({ layout })} onBack={() => {
              if (window.confirm('Discard unsaved layout changes?')) { action.reset(); setEditing(undefined); }
            }} />
        ) : (
          <div className="space-y-3">
            <Button disabled={!data || action.isPending} onClick={() => {
              action.reset();
              const ratio = Number(shape.aspectRatio) || 1;
              setEditing({ id: crypto.randomUUID(), name: '', price: Number(style.startingPrice), visible: true, panels: [
                { id: crypto.randomUUID(), x: 0, y: 0, width: Math.max(0.25, 10 * Math.min(1, ratio)), height: Math.max(0.25, 10 * Math.min(1, 1 / ratio)), rotation: 0 },
              ] });
            }}>Add layout</Button>
            {isPending && <p role="status">Loading layouts…</p>}
            {error && !data && <div><p role="alert">{error.message}</p><Button variant="outline" onClick={() => void refetch()}>Try again</Button></div>}
            {data?.length === 0 && <p className="text-sm text-muted-foreground">No layouts saved for this style.</p>}
            {data?.map(layout => (
              <div key={layout.id} className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm">
                <span className="grow font-medium">{layout.name} · {layout.panels.length} panels · {layout.visible ? 'Visible' : 'Hidden'}</span>
                <Button size="sm" variant="ghost" disabled={action.isPending} onClick={() => { action.reset(); setEditing(layout); }}>Edit</Button>
                <Button size="sm" variant="outline" disabled={action.isPending} onClick={() => action.mutate({ layout: { ...layout, visible: !layout.visible } })}>{layout.visible ? 'Hide' : 'Show'}</Button>
                <Button size="sm" variant="destructive" disabled={action.isPending} onClick={() => {
                  if (window.confirm('Delete “' + layout.name + '”?')) action.mutate({ layout, remove: true });
                }}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
