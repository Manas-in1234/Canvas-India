import { PreflightService } from './preflight.service.js';

describe('PreflightService', () => {
  const service = new PreflightService();

  it('passes a high-resolution image matching the target aspect ratio', () => {
    // 20x30 inch target at 300 DPI = 6000x9000 px
    const report = service.evaluate({
      imageWidthPx: 6000,
      imageHeightPx: 9000,
      targetWidthInches: 20,
      targetHeightInches: 30,
    });

    expect(report.overall).toBe('PASS');
    expect(report.checks.dpi.result).toBe('PASS');
    expect(report.checks.aspectRatio.result).toBe('PASS');
  });

  it('warns when DPI is below the recommended threshold but above the minimum', () => {
    // 20x30 inch target at ~180 DPI = 3600x5400 px
    const report = service.evaluate({
      imageWidthPx: 3600,
      imageHeightPx: 5400,
      targetWidthInches: 20,
      targetHeightInches: 30,
    });

    expect(report.checks.dpi.result).toBe('WARNING');
    expect(report.overall).toBe('WARNING');
  });

  it('fails when DPI is below the hard minimum (scope §29 example: actual 118 vs required 150)', () => {
    const report = service.evaluate({
      imageWidthPx: 2360, // 118 DPI at 20 inches wide
      imageHeightPx: 3540,
      targetWidthInches: 20,
      targetHeightInches: 30,
    });

    expect(report.checks.dpi.result).toBe('FAIL');
    expect(report.checks.dpi.actual).toBe(118);
    expect(report.overall).toBe('FAIL');
  });

  it('fails when the aspect ratio deviates significantly from the target size', () => {
    const report = service.evaluate({
      imageWidthPx: 6000,
      imageHeightPx: 6000, // square image against a 20x30 (2:3) target
      targetWidthInches: 20,
      targetHeightInches: 30,
    });

    expect(report.checks.aspectRatio.result).toBe('FAIL');
    expect(report.overall).toBe('FAIL');
  });

  it('takes the worst result across checks as the overall verdict', () => {
    const report = service.evaluate({
      imageWidthPx: 3600, // DPI warning (180 effective DPI)
      imageHeightPx: 5400, // aspect ratio still matches the 20x30 target exactly
      targetWidthInches: 20,
      targetHeightInches: 30,
    });

    expect(report.checks.dpi.result).toBe('WARNING');
    expect(report.checks.aspectRatio.result).toBe('PASS');
    expect(report.overall).toBe('WARNING'); // worst of [PASS, WARNING, PASS]
  });
});
