'use client';

import { ManagedBoxes } from '@/components/customization/managed-boxes';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/**
 * The three parts of the storefront's LAYOUTS & DESIGNS tab as numbered boxes: Design templates,
 * Layout arrangements and Optional Color Finishing. Rename, hide and move them here; the storefront
 * shows the Designs / Layouts switch and the color finishing block in this order with these names.
 */
export function LayoutBoxes({ canManage }: { canManage: boolean }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight">Parts of this tab</h2>
      <p className="text-sm text-muted-foreground">
        Rename, move or hide each part. Hidden parts disappear from the storefront; the items inside each part are edited below.
      </p>
      <ManagedBoxes
        baseKey="section_order_layouts"
        listName="Layouts & designs parts"
        canManage={canManage}
        columns="md:grid-cols-3"
        boxes={[
          {
            id: 'design_templates',
            label: 'Design templates',
            onOpen: () => scrollTo('section-layouts-designs'),
            body: <p className="text-xs text-muted-foreground">The DESIGNS switch: Father&apos;s Day, Birthday and other templates.</p>,
          },
          {
            id: 'layouts',
            label: 'Layout arrangements',
            onOpen: () => scrollTo('section-layouts-designs'),
            body: <p className="text-xs text-muted-foreground">The LAYOUTS switch: single image, landscape, wall display, collage and so on.</p>,
          },
          {
            id: 'color_finishing',
            label: 'Optional Color Finishing',
            onOpen: () => scrollTo('section-optional-color-finishing'),
            body: <p className="text-xs text-muted-foreground">Original, Sepia and GrayScale for the active photo.</p>,
          },
        ]}
      />
    </div>
  );
}
