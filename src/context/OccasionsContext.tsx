import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { buildApiUrl } from '../api/productsApi';
import { FESTIVAL_OCCASIONS, OCCASIONS, type OccasionDef } from '../data/occasionsData';
import { MEGA_MENUS_DATA } from '../data/storeData';

type Occasion = OccasionDef & { heroTitle?: string; group: 'occasion' | 'festival' };

const defaults: Occasion[] = [
  ...OCCASIONS.map(row => ({ ...row, group: 'occasion' as const })),
  ...FESTIVAL_OCCASIONS.filter(row => !OCCASIONS.some(item => item.slug === row.slug))
    .map(row => ({ ...row, group: 'festival' as const })),
];
const originalSlugs = new Set(defaults.map(row => row.slug));
const defaultMenu = MEGA_MENUS_DATA.gifts;
const occasionsContext = createContext({ entries: defaults, occasions: defaults.filter(row => row.group === 'occasion'), loading: true, giftMenu: defaultMenu });

export function OccasionsProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]);
    fetch(buildApiUrl('/occasions'), { signal })
      .then(response => {
        if (!response.ok) throw new Error('Could not load occasions.');
        return response.json() as Promise<Occasion[]>;
      })
      .then(rows => {
        if (!controller.signal.aborted && Array.isArray(rows) && rows.length) {
          setEntries(rows.map(row => ({
            ...row,
            bannerImage: row.bannerImage.startsWith('/api/v1/')
              ? buildApiUrl(row.bannerImage.slice('/api/v1'.length))
              : row.bannerImage,
          })));
        }
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const occasions = entries.filter(row => row.group === 'occasion');
  const namesByHref = new Map(entries.map(row => ['/occasions/' + row.slug, row.name]));
  const groups = defaultMenu.groups.map((group, index) => ({
    ...group,
    items: [
      ...group.items.map(item => ({ ...item, name: namesByHref.get(item.href ?? '') ?? item.name })),
      ...(index === 0 ? occasions.filter(row => !originalSlugs.has(row.slug))
        .map(row => ({ name: row.name, slug: 'gifts', href: '/occasions/' + row.slug })) : []),
    ],
  }));

  return (
    <occasionsContext.Provider value={{ entries, occasions, loading, giftMenu: { ...defaultMenu, groups } }}>
      {children}
    </occasionsContext.Provider>
  );
}

export function useOccasions() {
  return useContext(occasionsContext);
}
