'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePermission } from '@/lib/auth/use-permission';
import { StylesPanel } from '@/components/customization/styles-panel';
import { SizesPanel } from '@/components/customization/sizes-panel';
import { OptionsPanel } from '@/components/customization/options-panel';

type Material = 'CANVAS' | 'ACRYLIC';
type Tab = 'styles' | 'sizes' | 'options';

const TABS: { key: Tab; label: string; permission: string }[] = [
  { key: 'styles', label: 'Product styles', permission: 'option_catalog.view' },
  { key: 'sizes', label: 'Sizes', permission: 'size_presets.view' },
  { key: 'options', label: 'Options', permission: 'option_catalog.view' },
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

      <div className="flex gap-1 border-b" role="tablist">
        {allowed.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
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
          {tab === 'styles' && <StylesPanel material={material} />}
          {tab === 'sizes' && <SizesPanel material={material} />}
          {tab === 'options' && <OptionsPanel material={material} />}
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
