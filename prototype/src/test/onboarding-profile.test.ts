import { afterEach, describe, expect, it } from 'vitest';

import {
  formatOnboardingSummary,
  getOnboardingProfile,
  saveOnboardingProfile,
} from '@/lib/studio/onboarding-profile';

describe('onboarding profile', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('persists tier and asset selections for dashboard personalization', () => {
    saveOnboardingProfile({
      tier: 'Boutique',
      assetClasses: ['Multifamily', 'Office'],
      companyName: 'Acme Real Estate Partners',
    });

    const profile = getOnboardingProfile();
    expect(profile?.tier).toBe('Boutique');
    expect(profile?.assetClasses).toEqual(['Multifamily', 'Office']);
    expect(formatOnboardingSummary(profile!)).toContain('Boutique workspace');
  });
});
