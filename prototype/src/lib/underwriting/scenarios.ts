import type { UnderwritingAssumptions } from '@/lib/underwriting';

export const SCENARIO_NAMES = ['Base Case', 'Upside', 'Downside', 'Lender Case'] as const;

export type ScenarioName = (typeof SCENARIO_NAMES)[number];

export type ScenarioPreset = {
  name: ScenarioName;
  assumptions: UnderwritingAssumptions;
};

export function buildScenarioPresets(
  baseAssumptions: UnderwritingAssumptions
): Record<ScenarioName, UnderwritingAssumptions> {
  return {
    'Base Case': baseAssumptions,
    Upside: {
      ...baseAssumptions,
      annualAppreciationRate: baseAssumptions.annualAppreciationRate + 0.012,
      vacancyRate: Math.max(0.02, baseAssumptions.vacancyRate - 0.01),
    },
    Downside: {
      ...baseAssumptions,
      annualAppreciationRate: baseAssumptions.annualAppreciationRate - 0.012,
      exitCapRate: baseAssumptions.exitCapRate + 0.005,
    },
    'Lender Case': {
      ...baseAssumptions,
      ltv: Math.max(0.5, baseAssumptions.ltv - 0.06),
      interestRate: baseAssumptions.interestRate + 0.004,
    },
  };
}

export function listScenarioPresets(baseAssumptions: UnderwritingAssumptions): ScenarioPreset[] {
  const presets = buildScenarioPresets(baseAssumptions);
  return SCENARIO_NAMES.map((name) => ({
    name,
    assumptions: presets[name],
  }));
}
