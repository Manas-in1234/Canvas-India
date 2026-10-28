import { buildApiUrl } from './productsApi';

export const SHAPE_AREA_RATE_SETTING_KEY = 'shape_area_rate_per_sqin';

/** Fallback used only if the live settings fetch fails — kept in sync with the seeded defaults. */
export const SHAPE_AREA_RATE_FALLBACK = 1.65;

export const ACRYLIC_THICKNESS_RATE_FALLBACKS: Record<string, number> = {
  '3mm': 5.50,
  '5mm': 6.50,
  '6mm': 7.75,
  '8mm': 9.50,
};

interface PricingSettingDto {
  key: string;
  value: string;
}

export interface PricingRates {
  shapeAreaRate: number;
  acrylicThicknessRates: Record<string, number>;
}

const FALLBACK_RATES: PricingRates = {
  shapeAreaRate: SHAPE_AREA_RATE_FALLBACK,
  acrylicThicknessRates: ACRYLIC_THICKNESS_RATE_FALLBACKS,
};

/**
 * Admin-editable pricing rates (see backend PricingSettingsService) — the
 * Rs./sq.inch rates non-rectangular shapes and acrylic sheet thicknesses are
 * billed at by bounding-box area. Fetched once live so an admin's change
 * takes effect without a frontend deploy; falls back to the seeded defaults
 * if the fetch fails, so pricing never breaks on a network hiccup.
 */
export async function fetchPricingRates(): Promise<PricingRates> {
  try {
    const response = await fetch(buildApiUrl('/pricing-settings'));
    if (!response.ok) return FALLBACK_RATES;
    const settings = (await response.json()) as PricingSettingDto[];
    if (!Array.isArray(settings)) return FALLBACK_RATES;

    const byKey = new Map(settings.map((s) => [s.key, Number(s.value)]));

    const shapeAreaRate = byKey.get(SHAPE_AREA_RATE_SETTING_KEY);

    const acrylicThicknessRates: Record<string, number> = { ...ACRYLIC_THICKNESS_RATE_FALLBACKS };
    for (const mm of Object.keys(ACRYLIC_THICKNESS_RATE_FALLBACKS)) {
      const rate = byKey.get(`acrylic_thickness_rate_${mm}`);
      if (Number.isFinite(rate) && rate! > 0) acrylicThicknessRates[mm] = rate!;
    }

    return {
      shapeAreaRate: Number.isFinite(shapeAreaRate) && shapeAreaRate! > 0 ? shapeAreaRate! : SHAPE_AREA_RATE_FALLBACK,
      acrylicThicknessRates,
    };
  } catch {
    return FALLBACK_RATES;
  }
}
