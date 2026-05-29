export const ONBOARDING_STEPS = ['Tier', 'Account', 'Workspace', 'First deal'] as const;

export const ONBOARDING_TIER_OPTIONS = [
  {
    id: 'boutique',
    label: 'Boutique',
    price: '$149/mo',
    copy: 'Lean broker teams managing focused mandates.',
    detail: '3 active deals, draft reports, sample comps.',
  },
  {
    id: 'institutional',
    label: 'Institutional',
    price: 'Popular - $399/mo',
    copy: 'Multi-market teams requiring advanced controls.',
    detail: 'Unlimited deals, premium comps, white-label portal.',
  },
] as const;

export const ONBOARDING_ASSET_CLASSES = ['Multifamily', 'Office', 'Industrial', 'Retail'] as const;

export function getStudioOnboardingView() {
  return {
    steps: [...ONBOARDING_STEPS],
    tierOptions: ONBOARDING_TIER_OPTIONS.map((tier) => ({ ...tier })),
    assetClassOptions: [...ONBOARDING_ASSET_CLASSES],
    linkedBillingPath: '/studio/settings/billing',
    accountCreationNote:
      'Account and org creation remain operator gated. Profile selections save locally in this prototype.',
  };
}

export type StudioOnboardingView = ReturnType<typeof getStudioOnboardingView>;
