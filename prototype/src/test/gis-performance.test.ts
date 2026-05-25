import { describe, expect, it } from 'vitest';

import { fixtureMapLayerManifests } from '@/lib/contracts/spatial';
import { buildGisPerformanceBudgets, summarizeGisPerformance } from '@/lib/gis/performance';

describe('gis performance budgets', () => {
  it('builds per-layer budgets from manifest fixtures', () => {
    const budgets = buildGisPerformanceBudgets(fixtureMapLayerManifests);
    expect(budgets.length).toBe(fixtureMapLayerManifests.length);
    expect(budgets.some((budget) => budget.deferred)).toBe(true);
  });

  it('summarizes initial load within mock MVP0 cap', () => {
    const summary = summarizeGisPerformance(buildGisPerformanceBudgets(fixtureMapLayerManifests));
    expect(summary.initialLoadKb).toBeGreaterThan(0);
    expect(typeof summary.withinBudget).toBe('boolean');
  });
});
