import { describe, expect, it } from 'vitest';

import {
  buildScenarioPresets,
  listScenarioPresets,
} from '@/lib/underwriting/scenarios';
import { DEFAULT_UNDERWRITING_ASSUMPTIONS, calculateUnderwritingMetrics } from '@/lib/underwriting';

describe('underwriting scenario presets', () => {
  it('builds distinct assumption presets for each scenario name', () => {
    const presets = buildScenarioPresets(DEFAULT_UNDERWRITING_ASSUMPTIONS);
    expect(presets.Upside.vacancyRate).toBeLessThan(presets['Base Case'].vacancyRate);
    expect(presets.Downside.exitCapRate).toBeGreaterThan(presets['Base Case'].exitCapRate);
    expect(presets['Lender Case'].ltv).toBeLessThan(presets['Base Case'].ltv);
  });

  it('produces different IRR metrics across upside and downside presets', () => {
    const scenarios = listScenarioPresets(DEFAULT_UNDERWRITING_ASSUMPTIONS);
    const upside = scenarios.find((scenario) => scenario.name === 'Upside');
    const downside = scenarios.find((scenario) => scenario.name === 'Downside');
    expect(upside).toBeDefined();
    expect(downside).toBeDefined();

    const upsideIrr = calculateUnderwritingMetrics(upside!.assumptions).irr;
    const downsideIrr = calculateUnderwritingMetrics(downside!.assumptions).irr;
    expect(upsideIrr).not.toBe(downsideIrr);
  });
});
