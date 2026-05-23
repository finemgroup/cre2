import type { ReactElement } from 'react';

import { DataTable, MaterialIcon, MetricCard, StatusBadge, StudioCard } from '@/components/studio/StudioPrimitives';
import {
  formatCurrency,
  formatMultiple,
  formatPercent,
  getGateSummary,
  type DataProvenance,
  type SensitivityGrid,
  type UnderwritingAssumptions,
  type UnderwritingGate,
  type UnderwritingMetrics,
} from '@/lib/underwriting';

type AssumptionField = {
  key: keyof UnderwritingAssumptions;
  label: string;
  kind: 'currency' | 'percent' | 'number';
};

const assumptionFields: AssumptionField[] = [
  { key: 'grossPotentialRent', label: 'Gross potential rent', kind: 'currency' },
  { key: 'vacancyRate', label: 'Vacancy rate', kind: 'percent' },
  { key: 'otherIncome', label: 'Other income', kind: 'currency' },
  { key: 'operatingExpenses', label: 'Operating expenses', kind: 'currency' },
  { key: 'purchasePrice', label: 'Purchase price', kind: 'currency' },
  { key: 'renovationBudget', label: 'Renovation budget', kind: 'currency' },
  { key: 'ltv', label: 'LTV', kind: 'percent' },
  { key: 'interestRate', label: 'Interest rate', kind: 'percent' },
  { key: 'exitCapRate', label: 'Exit cap', kind: 'percent' },
  { key: 'annualAppreciationRate', label: 'Rent growth', kind: 'percent' },
];

function displayAssumption(value: number, kind: AssumptionField['kind']): string {
  if (kind === 'currency') return String(Math.round(value));
  if (kind === 'percent') return String((value * 100).toFixed(2));
  return String(value);
}

function parseAssumption(value: string, kind: AssumptionField['kind']): number {
  const numeric = Number(value.replace(/[$,%]/g, ''));
  if (!Number.isFinite(numeric)) return 0;
  return kind === 'percent' ? numeric / 100 : numeric;
}

export function SyntheticDataBanner(): ReactElement {
  return (
    <aside className="synthetic-banner" role="status">
      <MaterialIcon name="science" />
      <div>
        <strong>Mock underwriting model</strong>
        <span>Calculations are prototype-only and require source review before export.</span>
      </div>
    </aside>
  );
}

export function DataProvenanceLabel({ provenance }: { provenance: DataProvenance }): ReactElement {
  return (
    <div className="provenance-label">
      <span className="status-badge">{provenance.source}</span>
      <span>{provenance.sourceDetail}</span>
      <span>{provenance.asOfDate}</span>
      <span>{provenance.confidence} confidence</span>
      {provenance.requiresConfirmation ? <span className="trust-badge trust-candidate-evidence">Needs confirmation</span> : null}
    </div>
  );
}

export function AssumptionsPanel({
  assumptions,
  provenance,
  onChange,
}: {
  assumptions: UnderwritingAssumptions;
  provenance: DataProvenance;
  onChange: (next: UnderwritingAssumptions) => void;
}): ReactElement {
  return (
    <StudioCard title="Assumptions Editor" eyebrow="CRE workbench adapted">
      <div className="form-grid compact">
        {assumptionFields.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              inputMode="decimal"
              value={displayAssumption(assumptions[field.key], field.kind)}
              onChange={(event) =>
                onChange({
                  ...assumptions,
                  [field.key]: parseAssumption(event.target.value, field.kind),
                })
              }
            />
          </label>
        ))}
      </div>
      <DataProvenanceLabel provenance={provenance} />
    </StudioCard>
  );
}

export function MetricsPanel({ metrics }: { metrics: UnderwritingMetrics }): ReactElement {
  return (
    <StudioCard title="Calculated Metrics" eyebrow="Formula-backed mock">
      <div className="metric-grid">
        <MetricCard label="NOI" value={formatCurrency(metrics.noi)} detail="EGI - expenses" />
        <MetricCard label="Cap Rate" value={formatPercent(metrics.capRate)} detail="NOI / purchase price" />
        <MetricCard label="Indicated Value" value={formatCurrency(metrics.indicatedValue)} detail="NOI / exit cap" />
        <MetricCard label="DSCR" value={formatMultiple(metrics.dscr)} detail="NOI / debt service" icon={metrics.dscr >= 1.25 ? 'check_circle' : 'warning'} />
        <MetricCard label="IRR" value={formatPercent(metrics.irr)} detail="Model-inferred" />
        <MetricCard label="Equity Multiple" value={formatMultiple(metrics.equityMultiple)} detail="5-year mock hold" />
      </div>
    </StudioCard>
  );
}

export function GatesPanel({
  gates,
  onOverride,
}: {
  gates: UnderwritingGate[];
  onOverride: (gateId: string) => void;
}): ReactElement {
  const summary = getGateSummary(gates);
  return (
    <StudioCard
      title="Workflow Gates"
      eyebrow="Review posture"
      actions={<StatusBadge status={`${summary.blocked} blocked / ${summary.warnings} warn`} />}
    >
      <div className="gate-list">
        {gates.map((gate) => (
          <div className="gate-row" key={gate.id}>
            <div>
              <strong>{gate.label}</strong>
              <span>{gate.detail}</span>
            </div>
            <div className="studio-actions">
              <StatusBadge status={gate.status} />
              {(gate.status === 'WARN' || gate.status === 'BLOCKED') && (
                <button type="button" className="btn btn-secondary" onClick={() => onOverride(gate.id)}>
                  Override
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </StudioCard>
  );
}

export function VersionLockCard({
  canLock,
  locked,
  onLock,
}: {
  canLock: boolean;
  locked: boolean;
  onLock: () => void;
}): ReactElement {
  return (
    <StudioCard title="Decision-Ready Version" eyebrow="Mock governance">
      {locked ? (
        <>
          <StatusBadge status="Locked" />
          <p>Model version locked for report review. Audit receipt is prototype-only.</p>
        </>
      ) : (
        <>
          <p>Lock the model only when no blocking gates remain.</p>
          <button type="button" className="btn btn-primary" disabled={!canLock} onClick={onLock}>
            Lock Version & Advance
          </button>
        </>
      )}
    </StudioCard>
  );
}

export function SensitivityMatrix({ grid }: { grid: SensitivityGrid }): ReactElement {
  return (
    <DataTable
      caption="Price by exit cap sensitivity matrix"
      headers={['Purchase Price', ...grid.columns.map((cap) => formatPercent(cap))]}
      rows={grid.rows.map((price, rowIndex) => [
        formatCurrency(price),
        ...grid.cells[rowIndex].map((cell) => `${formatPercent(cell.irr)} / ${formatMultiple(cell.dscr)}`),
      ])}
      getRowKey={(_row, index) => String(grid.rows[index])}
    />
  );
}
