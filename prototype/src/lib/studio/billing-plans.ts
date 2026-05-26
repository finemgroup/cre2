export type BillingPlanTier = {
  id: string;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  copy: string;
  featured?: boolean;
};

export const BILLING_PLAN_TIERS: BillingPlanTier[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    copy: 'Starter comps and one draft report',
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: '$199/mo',
    annualPrice: '$149/mo',
    copy: 'Pipeline, comps, underwriting, report builder',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    copy: 'White-label portal, team governance, Broker OS',
  },
];

export const BILLING_FEATURE_COMPARISON = [
  ['Deal pipeline', '1 active', 'Unlimited', 'Team controls'],
  ['Comps', 'Sample only', 'Reviewed + candidate', 'Premium/private tiers'],
  ['Reports', 'Draft preview', 'Export gate', 'White-label portal'],
  ['Broker OS', 'No', 'Read-only summary', 'Full operator inventory'],
] as const;

export const BILLING_FAQ = [
  [
    'Can I upgrade later?',
    'Yes. Upgrade paths are mocked here and route through the same governed workspace.',
  ],
  [
    'Do reports export automatically?',
    'No. Exports remain gated by review, consent, and source-rights posture.',
  ],
  [
    'Does white-label change source limits?',
    'No. Branding never hides evidence posture, consent state, or non-production labels.',
  ],
] as const;

export function getStudioBillingView() {
  return {
    plans: BILLING_PLAN_TIERS,
    featureComparison: BILLING_FEATURE_COMPARISON.map((row) => [...row]),
    faq: BILLING_FAQ.map((entry) => [...entry]),
    entitlementsNote:
      'Plan entitlements are fixture-only. Billing provider integration remains operator gated.',
  };
}

export type StudioBillingView = ReturnType<typeof getStudioBillingView>;
