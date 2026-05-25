export const VALUATION_READINESS_STAGES = [
  'Assumptions',
  'Evidence',
  'Scenarios',
  'Review',
  'Export',
] as const;

export type ValuationReadinessStage = (typeof VALUATION_READINESS_STAGES)[number];

export const EXPORT_FLOW_STAGES = ['Sections', 'Consent', 'Generate', 'Receipt'] as const;
