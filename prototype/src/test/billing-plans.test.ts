import { describe, expect, it } from 'vitest';

import { getStudioBillingView } from '@/lib/studio/billing-plans';

describe('getStudioBillingView', () => {
  it('returns plan tiers, comparison rows, and FAQ entries', () => {
    const view = getStudioBillingView();

    expect(view.plans.length).toBe(3);
    expect(view.featureComparison.length).toBeGreaterThan(0);
    expect(view.faq.length).toBeGreaterThan(0);
    expect(view.entitlementsNote).toContain('fixture-only');
  });
});
