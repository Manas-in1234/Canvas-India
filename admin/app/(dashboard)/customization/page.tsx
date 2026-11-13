'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePermission } from '@/lib/auth/use-permission';
import { StylesPanel } from '@/components/customization/styles-panel';
import { SizesPanel } from '@/components/customization/sizes-panel';
import { OptionsPanel } from '@/components/customization/options-panel';

type Material = 'CANVAS' | 'ACRYLIC';
type Tab = 'styles' | 'sizes' | 'layouts' | 'wrap' | 'hardware' | 'options' | 'controls';

const TABS: { key: Tab; label: string; hint: string; permission: string; blocks?: string[] }[] = [
  { key: 'styles', label: 'Products', hint: 'The style cards a customer picks first: name, price and cover image.', permission: 'option_catalog.view' },
  { key: 'sizes', label: 'Select size', hint: 'Every size and its price, plus the inch limits for custom sizes.', permission: 'size_presets.view', blocks: ['SELECT SIZE'] },
  { key: 'layouts', label: 'Layouts & designs', hint: 'Design templates grouped by day or occasion.', permission: 'option_catalog.view', blocks: ['LAYOUTS & DESIGNS'] },
  { key: 'wrap', label: 'Wrap & border', hint: 'Thickness, edge wrap, borders and frames.', permission: 'option_catalog.view', blocks: ['WRAP & BORDER'] },
  { key: 'hardware', label: 'Hardware & finish', hint: 'Thickness, backing, hardware, back display and color finishing.', permission: 'option_catalog.view', blocks: ['HARDWARE & FINISH'] },
  { key: 'options', label: 'Options', hint: 'Lamination, photo retouching, material variants and special products.', permission: 'option_catalog.view', blocks: ['OPTIONS', 'SELECT CANVAS MATERIAL VARIANT', 'SPECIALTY PRODUCTS'] },
  { key: 'controls', label: 'Tabs & buttons', hint: 'Rename, hide or reorder the customizer tabs and top buttons.', permission: 'option_catalog.view', blocks: ['CUSTOMIZER TABS & BUTTONS'] },
];

function CustomizationInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { hasPermission } = usePermission();
  const [material, setMaterialState] = useState<Material>(params.get('material') === 'ACRYLIC' ? 'ACRYLIC' : 'CANVAS');
  const allowed = TABS.filter((t) => hasPermission(t.permission));
  const wanted = params.get('tab');
  const [tab, setTabState] = useState<Tab>(
    allowed.find((t) => t.key === wanted)?.key ?? allowed[0]?.key ?? 'styles',
  );

  const sync = (nextMaterial: Material, nextTab: Tab) =>
    router.replace(`/customization?material=${nextMaterial}&tab=${nextTab}`);
  const setMaterial = (m: Material) => {
    setMaterialState(m);
    sync(m, tab);
  };
  const setTab = (t: Tab) => {
    setTabState(t);
    sync(material, t);
  };

  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="space-y-6">
      <div>
        <div className="page-eyebrow">CUSTOMIZATION STUDIO</div>
        <h1 className="text-2xl font-semibold tracking-tight">Customization</h1>
        <p className="text-sm text-muted-foreground">
          Pick Canvas or Acrylic, then edit styles, sizes and options once. The change applies to every{' '}
          {material === 'CANVAS' ? 'canvas' : 'acrylic'} product.
        </p>
      </div>

      <div className="status-filters" aria-label="Material">
        {(['CANVAS', 'ACRYLIC'] as const).map((m) => (
          <button key={m} className={material === m ? 'active' : ''} aria-pressed={material === m} onClick={() => setMaterial(m)}>
            {m === 'CANVAS' ? 'Canvas' : 'Acrylic'}
          </button>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b" role="tablist">
        {allowed.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {allowed.length === 0 ? (
        <p className="text-sm text-muted-foreground">You do not have access to customization settings.</p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{current.hint}</p>
          {tab === 'styles' && <StylesPanel material={material} />}
          {tab === 'sizes' && (
            <div className="space-y-10">
              <SizesPanel material={material} />
              <OptionsPanel material={material} tabs={current.blocks ?? []} />
            </div>
          )}
          {tab !== 'styles' && tab !== 'sizes' && <OptionsPanel material={material} tabs={current.blocks ?? []} />}
        </>
      )}
    </div>
  );
}

export default function CustomizationPage() {
  return (
    <Suspense fallback={null}>
      <CustomizationInner />
    </Suspense>
  );
}
