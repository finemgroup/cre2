export type UnderwritingAssumptions = {
  grossPotentialRent: number;
  vacancyRate: number;
  otherIncome: number;
  operatingExpenses: number;
  purchasePrice: number;
  closingCosts: number;
  renovationBudget: number;
  ltv: number;
  interestRate: number;
  amortizationYears: number;
  holdYears: number;
  annualAppreciationRate: number;
  exitCapRate: number;
};

export type UnderwritingMetrics = {
  effectiveGrossIncome: number;
  noi: number;
  totalBasis: number;
  indicatedValue: number;
  debtAmount: number;
  annualDebtService: number;
  dscr: number;
  capRate: number;
  cashOnCash: number;
  irr: number;
  equityMultiple: number;
};

export type GateStatus = 'PASS' | 'WARN' | 'BLOCKED' | 'OVERRIDDEN';

export type UnderwritingGate = {
  id: string;
  label: string;
  status: GateStatus;
  detail: string;
  source: 'formula' | 'document' | 'review' | 'market';
};

export type DataProvenance = {
  source: 'OM' | 'Rent roll' | 'T12' | 'Model estimate' | 'Reviewed comp set';
  sourceDetail: string;
  asOfDate: string;
  confidence: 'High' | 'Medium' | 'Low';
  freshness: 'Fresh' | 'Watch' | 'Stale';
  requiresConfirmation?: boolean;
};

export type SensitivityGrid = {
  columns: number[];
  rows: number[];
  cells: Array<Array<UnderwritingMetrics>>;
};

export const DEFAULT_UNDERWRITING_ASSUMPTIONS: UnderwritingAssumptions = {
  grossPotentialRent: 7_200_000,
  vacancyRate: 0.045,
  otherIncome: 320_000,
  operatingExpenses: 3_100_000,
  purchasePrice: 42_500_000,
  closingCosts: 0.015,
  renovationBudget: 2_352_000,
  ltv: 0.62,
  interestRate: 0.0675,
  amortizationYears: 30,
  holdYears: 5,
  annualAppreciationRate: 0.03,
  exitCapRate: 0.0575,
};

export function safeDivide(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : numerator / denominator;
}

export function annualDebtService(
  principal: number,
  annualRate: number,
  amortizationYears: number
): number {
  const months = amortizationYears * 12;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return safeDivide(principal, months) * 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return monthlyPayment * 12;
}

export function calculateUnderwritingMetrics(
  assumptions: UnderwritingAssumptions
): UnderwritingMetrics {
  const vacancyLoss = assumptions.grossPotentialRent * assumptions.vacancyRate;
  const effectiveGrossIncome =
    assumptions.grossPotentialRent - vacancyLoss + assumptions.otherIncome;
  const noi = effectiveGrossIncome - assumptions.operatingExpenses;
  const totalBasis =
    assumptions.purchasePrice * (1 + assumptions.closingCosts) + assumptions.renovationBudget;
  const indicatedValue = safeDivide(noi, assumptions.exitCapRate);
  const debtAmount = totalBasis * assumptions.ltv;
  const annualDebt = annualDebtService(
    debtAmount,
    assumptions.interestRate,
    assumptions.amortizationYears
  );
  const equity = Math.max(totalBasis - debtAmount, 1);
  const cashFlow = noi - annualDebt;
  const exitValue = safeDivide(
    noi * Math.pow(1 + assumptions.annualAppreciationRate, assumptions.holdYears),
    assumptions.exitCapRate
  );
  const totalCashFlow = cashFlow * assumptions.holdYears + (exitValue - debtAmount);
  const equityMultiple = safeDivide(totalCashFlow, equity);
  const irr = Math.max(
    -0.05,
    Math.min(0.42, Math.pow(Math.max(equityMultiple, 0.01), 1 / assumptions.holdYears) - 1)
  );

  return {
    effectiveGrossIncome,
    noi,
    totalBasis,
    indicatedValue,
    debtAmount,
    annualDebtService: annualDebt,
    dscr: safeDivide(noi, annualDebt),
    capRate: safeDivide(noi, assumptions.purchasePrice),
    cashOnCash: safeDivide(cashFlow, equity),
    irr,
    equityMultiple,
  };
}

export function buildSensitivityGrid(
  assumptions: UnderwritingAssumptions,
  prices = [0.92, 0.96, 1, 1.04, 1.08],
  exitCaps = [0.0525, 0.055, 0.0575, 0.06, 0.0625]
): SensitivityGrid {
  const rows = prices.map((multiplier) => assumptions.purchasePrice * multiplier);
  return {
    columns: exitCaps,
    rows,
    cells: rows.map((purchasePrice) =>
      exitCaps.map((exitCapRate) =>
        calculateUnderwritingMetrics({
          ...assumptions,
          purchasePrice,
          exitCapRate,
        })
      )
    ),
  };
}

export function evaluateUnderwritingGates(
  assumptions: UnderwritingAssumptions,
  metrics: UnderwritingMetrics,
  reviewedCompCount: number
): UnderwritingGate[] {
  return [
    {
      id: 'GATE_UW_NOI_IDENTITY',
      label: 'NOI identity',
      status: metrics.noi > 0 ? 'PASS' : 'BLOCKED',
      detail:
        metrics.noi > 0
          ? 'EGI less operating expenses produces positive NOI.'
          : 'NOI is not positive.',
      source: 'formula',
    },
    {
      id: 'GATE_UW_DSCR',
      label: 'Debt coverage',
      status: metrics.dscr >= 1.25 ? 'PASS' : metrics.dscr >= 1.1 ? 'WARN' : 'BLOCKED',
      detail: `DSCR is ${formatMultiple(metrics.dscr)} against a 1.25x target.`,
      source: 'formula',
    },
    {
      id: 'GATE_UW_COMPS',
      label: 'Comp readiness',
      status: reviewedCompCount >= 2 ? 'PASS' : 'WARN',
      detail: `${reviewedCompCount} reviewed comps are available for this mock model.`,
      source: 'market',
    },
    {
      id: 'GATE_UW_SOURCE_RIGHTS',
      label: 'Source rights',
      status: 'WARN',
      detail: 'Provider-restricted and candidate evidence cannot flow into export until reviewed.',
      source: 'review',
    },
    {
      id: 'GATE_UW_VACANCY',
      label: 'Vacancy support',
      status: assumptions.vacancyRate <= 0.06 ? 'PASS' : 'WARN',
      detail: `Vacancy is ${formatPercent(assumptions.vacancyRate)} and requires rent-roll support if above market.`,
      source: 'document',
    },
  ];
}

export function buildProFormaRows(assumptions: UnderwritingAssumptions): string[][] {
  return Array.from({ length: 5 }, (_, index) => {
    const growth = Math.pow(1 + assumptions.annualAppreciationRate, index);
    const revenue = assumptions.grossPotentialRent + assumptions.otherIncome;
    const grossRevenue = revenue * growth;
    const expenses = assumptions.operatingExpenses * Math.pow(1.025, index);
    const noi = grossRevenue * (1 - assumptions.vacancyRate) - expenses;
    const debt = annualDebtService(
      (assumptions.purchasePrice * (1 + assumptions.closingCosts) + assumptions.renovationBudget) *
        assumptions.ltv,
      assumptions.interestRate,
      assumptions.amortizationYears
    );
    return [
      `Year ${index + 1}`,
      formatCurrency(grossRevenue),
      formatCurrency(expenses),
      formatCurrency(noi),
      formatCurrency(debt),
      formatCurrency(noi - debt),
    ];
  });
}

export function getGateSummary(gates: UnderwritingGate[]): {
  blocked: number;
  warnings: number;
  passed: number;
} {
  return {
    blocked: gates.filter((gate) => gate.status === 'BLOCKED').length,
    warnings: gates.filter((gate) => gate.status === 'WARN').length,
    passed: gates.filter((gate) => gate.status === 'PASS' || gate.status === 'OVERRIDDEN').length,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatMultiple(value: number): string {
  return `${value.toFixed(2)}x`;
}
