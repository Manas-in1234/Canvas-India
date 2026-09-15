import { Injectable } from '@nestjs/common';

export type PreflightCheckResult = 'PASS' | 'WARNING' | 'FAIL';

export interface PreflightCheck {
  result: PreflightCheckResult;
  actual?: number;
  required?: number;
  message?: string;
}

export interface PreflightReport {
  overall: PreflightCheckResult;
  checks: {
    resolution: PreflightCheck;
    dpi: PreflightCheck;
    aspectRatio: PreflightCheck;
  };
}

const MIN_DPI = 150;
const WARNING_DPI = 200; // below this but above MIN_DPI is a warning, not a hard fail
const ASPECT_RATIO_TOLERANCE = 0.02; // 2%

/**
 * Pure pre-flight checks (scope §28-29): resolution, DPI, aspect ratio vs. the
 * product's expected print size. Kept as plain functions with no I/O so they
 * can be unit tested directly, same as PricingService's rule matching.
 */
@Injectable()
export class PreflightService {
  evaluate(params: {
    imageWidthPx: number;
    imageHeightPx: number;
    targetWidthInches: number;
    targetHeightInches: number;
  }): PreflightReport {
    const { imageWidthPx, imageHeightPx, targetWidthInches, targetHeightInches } = params;

    const dpiWidth = imageWidthPx / targetWidthInches;
    const dpiHeight = imageHeightPx / targetHeightInches;
    const effectiveDpi = Math.min(dpiWidth, dpiHeight);

    const dpiCheck = this.checkDpi(effectiveDpi);
    const resolutionCheck = this.checkResolution(imageWidthPx, imageHeightPx);
    const aspectRatioCheck = this.checkAspectRatio(
      imageWidthPx / imageHeightPx,
      targetWidthInches / targetHeightInches,
    );

    const checks = { resolution: resolutionCheck, dpi: dpiCheck, aspectRatio: aspectRatioCheck };
    const overall = this.worstOf([resolutionCheck.result, dpiCheck.result, aspectRatioCheck.result]);

    return { overall, checks };
  }

  private checkDpi(effectiveDpi: number): PreflightCheck {
    if (effectiveDpi < MIN_DPI) {
      return {
        result: 'FAIL',
        actual: Math.round(effectiveDpi),
        required: MIN_DPI,
        message: `Effective DPI ${Math.round(effectiveDpi)} is below the minimum of ${MIN_DPI}`,
      };
    }
    if (effectiveDpi < WARNING_DPI) {
      return {
        result: 'WARNING',
        actual: Math.round(effectiveDpi),
        required: WARNING_DPI,
        message: `Effective DPI ${Math.round(effectiveDpi)} is below the recommended ${WARNING_DPI}`,
      };
    }
    return { result: 'PASS', actual: Math.round(effectiveDpi), required: MIN_DPI };
  }

  private checkResolution(widthPx: number, heightPx: number): PreflightCheck {
    if (widthPx <= 0 || heightPx <= 0) {
      return { result: 'FAIL', message: 'Image has invalid dimensions' };
    }
    return { result: 'PASS' };
  }

  private checkAspectRatio(imageRatio: number, targetRatio: number): PreflightCheck {
    const deviation = Math.abs(imageRatio - targetRatio) / targetRatio;
    if (deviation > ASPECT_RATIO_TOLERANCE * 5) {
      return {
        result: 'FAIL',
        message: `Image aspect ratio deviates ${(deviation * 100).toFixed(1)}% from the target size`,
      };
    }
    if (deviation > ASPECT_RATIO_TOLERANCE) {
      return {
        result: 'WARNING',
        message: `Image aspect ratio deviates ${(deviation * 100).toFixed(1)}% from the target size; cropping will occur`,
      };
    }
    return { result: 'PASS' };
  }

  private worstOf(results: PreflightCheckResult[]): PreflightCheckResult {
    if (results.includes('FAIL')) return 'FAIL';
    if (results.includes('WARNING')) return 'WARNING';
    return 'PASS';
  }
}
