import { buildApiUrl } from './productsApi';

export const SHAPE_AREA_RATE_SETTING_KEY = 'shape_area_rate_per_sqin';

/** Fallback used only if the live settings fetch fails — kept in sync with the seeded default. */
export const SHAPE_AREA_RATE_FALLBACK = 1.65;

interface PricingSettingDto {
  key: string;
  value: string;
}

/**
 * Admin-editable pricing rates (see backend PricingSettingsService) — e.g.
 * the Rs./sq.inch rate non-rectangular shapes are billed at by their
 * bounding-box area. Fetched live so an admin's change takes effect without
 * a frontend deploy.
 */
export async function fetchShapeAreaRate(): Promise<number> {
  try {
    const response = await fetch(buildApiUrl('/pricing-settings'));
    if (!response.ok) return SHAPE_AREA_RATE_FALLBACK;
    const settings = (await response.json()) as PricingSettingDto[];
    const setting = Array.isArray(settings) ? settings.find((s) => s.key === SHAPE_AREA_RATE_SETTING_KEY) : null;
    const parsed = setting ? Number(setting.value) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : SHAPE_AREA_RATE_FALLBACK;
  } catch {
    // Pricing must never break because a settings fetch failed.
    return SHAPE_AREA_RATE_FALLBACK;
  }
}
