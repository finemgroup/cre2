import { describe, expect, it } from 'vitest';

import { getStudioOnboardingView } from '@/lib/studio/onboarding-flow';

describe('getStudioOnboardingView', () => {
  it('returns onboarding steps, tier options, and billing handoff', () => {
    const view = getStudioOnboardingView();

    expect(view.steps.length).toBe(4);
    expect(view.tierOptions.length).toBe(2);
    expect(view.assetClassOptions.length).toBeGreaterThan(0);
    expect(view.linkedBillingPath).toBe('/studio/settings/billing');
    expect(view.accountCreationNote).toContain('operator gated');
  });
});
