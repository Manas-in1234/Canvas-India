import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LAYOUT, HOMEPAGE_SECTIONS, HomepageLayout, normalizeLayout } from './homepage-layout.js';

const bytes = (value: unknown) => new TextEncoder().encode(JSON.stringify(value));

describe('homepage layout', () => {
  it('starts with every section shown, in the built-in order, and the store open', () => {
    const layout = normalizeLayout(undefined);
    expect(layout.storeOpen).toBe(true);
    expect(layout.sections.map((s) => s.key)).toEqual(HOMEPAGE_SECTIONS.map((s) => s.key));
    expect(layout.sections.every((s) => s.enabled && s.title === '')).toBe(true);
  });

  it('keeps the admin order and settings, drops unknown or repeated sections, and adds new ones at the end', () => {
    const layout = normalizeLayout({
      storeOpen: false,
      closedMessage: '  Back on Monday  ',
      sections: [
        { key: 'bestsellers', enabled: true, title: ' Our Favourites ' },
        { key: 'nonsense', enabled: true },
        { key: 'canvas', enabled: false },
        { key: 'bestsellers', enabled: false },
      ],
    });
    expect(layout.storeOpen).toBe(false);
    expect(layout.closedMessage).toBe('Back on Monday');
    expect(layout.sections[0]).toEqual({ key: 'bestsellers', enabled: true, title: 'Our Favourites' });
    expect(layout.sections[1]).toEqual({ key: 'canvas', enabled: false, title: '' });
    expect(layout.sections).toHaveLength(HOMEPAGE_SECTIONS.length);
    expect(layout.sections.map((s) => s.key)).not.toContain('nonsense');
  });

  it('falls back to the default when nothing is saved or the saved data is unreadable', async () => {
    const none = new HomepageLayout({ asset: { findUnique: vi.fn(async () => null) } } as never);
    expect(await none.settings()).toEqual(DEFAULT_LAYOUT);
    const broken = new HomepageLayout({ asset: { findUnique: vi.fn(async () => ({ contentBytes: new TextEncoder().encode('{not json') })) } } as never);
    expect(await broken.settings()).toEqual(DEFAULT_LAYOUT);
    const saved = new HomepageLayout({ asset: { findUnique: vi.fn(async () => ({ contentBytes: bytes({ storeOpen: false, sections: [{ key: 'why', enabled: false }] }) })) } } as never);
    const out = await saved.settings();
    expect(out.storeOpen).toBe(false);
    expect(out.sections[0]).toMatchObject({ key: 'why', enabled: false });
  });

  it('saves a valid layout and records who changed it', async () => {
    const tx = { asset: { upsert: vi.fn() }, auditLog: { create: vi.fn() } };
    const layout = new HomepageLayout({ $transaction: (fn: any) => fn(tx) } as never);
    const sections = HOMEPAGE_SECTIONS.map((s) => ({ key: s.key, enabled: s.key !== 'cork', title: '' }));
    const result = await layout.save({ storeOpen: true, closedMessage: '', sections }, 'admin1');
    expect(result.sections.find((s) => s.key === 'cork')?.enabled).toBe(false);
    expect(tx.asset.upsert).toHaveBeenCalledTimes(1);
    expect(tx.auditLog.create.mock.calls[0][0].data).toMatchObject({ adminUserId: 'admin1', action: 'HOMEPAGE_LAYOUT_UPDATED' });
    expect(tx.auditLog.create.mock.calls[0][0].data.changes.hidden).toEqual(['cork']);
  });

  it('rejects bad input without saving anything', async () => {
    const tx = { asset: { upsert: vi.fn() }, auditLog: { create: vi.fn() } };
    const layout = new HomepageLayout({ $transaction: (fn: any) => fn(tx) } as never);
    const ok = HOMEPAGE_SECTIONS.map((s) => ({ key: s.key, enabled: true, title: '' }));
    await expect(layout.save({ sections: ok }, 'a')).rejects.toThrow(/open or closed/);
    await expect(layout.save({ storeOpen: true }, 'a')).rejects.toThrow(/section list/);
    await expect(layout.save({ storeOpen: true, sections: [{ key: 'hero', enabled: true }] }, 'a')).rejects.toThrow(/Unknown/);
    await expect(layout.save({ storeOpen: true, sections: [{ key: 'canvas', enabled: 'yes' }] }, 'a')).rejects.toThrow(/shown or hidden/);
    await expect(layout.save({ storeOpen: true, sections: [{ key: 'canvas', enabled: true, title: 'x'.repeat(81) }] }, 'a')).rejects.toThrow(/80/);
    await expect(layout.save({ storeOpen: true, closedMessage: 'x'.repeat(241), sections: ok }, 'a')).rejects.toThrow(/240/);
    expect(tx.asset.upsert).not.toHaveBeenCalled();
  });
});
