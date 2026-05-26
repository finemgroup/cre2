import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  DataTable,
  MaterialIcon,
  MetricCard,
  StatusBadge,
  StudioCard,
  TrustBadge,
} from '@/components/studio/StudioPrimitives';
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
      {provenance.requiresConfirmation ? (
        <span className="trust-badge trust-candidate-evidence">Needs confirmation</span>
      ) : null}
    </div>
  );
}

export function AssumptionsPanel({
  assumptions,
  provenance,
  sourceTracePath,
  onChange,
}: {
  assumptions: UnderwritingAssumptions;
  provenance: DataProvenance;
  sourceTracePath?: string;
  onChange: (next: UnderwritingAssumptions) => void;
}): ReactElement {
  return (
    <StudioCard
      title="Assumptions Editor"
      eyebrow="CRE workbench adapted"
      actions={
        sourceTracePath ? (
          <Link to={sourceTracePath} className="btn btn-secondary">
            Open source trace
          </Link>
        ) : null
      }
    >
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
      <div className="review-summary">
        <TrustBadge state={provenance.requiresConfirmation ? 'Candidate evidence' : 'Reviewed'} />
        <span>
          Every assumption change stays candidate-only until source trace and gates clear.
        </span>
      </div>
    </StudioCard>
  );
}

export function MetricsPanel({
  metrics,
  scenarioLabel,
  onInspectMetric,
}: {
  metrics: UnderwritingMetrics;
  scenarioLabel?: string;
  onInspectMetric?: (metric: { label: string; value: string; formula: string }) => void;
}): ReactElement {
  const metricItems = [
    {
      label: 'NOI',
      value: formatCurrency(metrics.noi),
      detail: 'EGI - expenses',
      formula: 'Effective Gross Income - Operating Expenses',
    },
    {
      label: 'Cap Rate',
      value: formatPercent(metrics.capRate),
      detail: 'NOI / purchase price',
      formula: 'NOI / Purchase Price',
    },
    {
      label: 'Indicated Value',
      value: formatCurrency(metrics.indicatedValue),
      detail: 'NOI / exit cap',
      formula: 'NOI / Exit Cap Rate',
    },
    {
      label: 'DSCR',
      value: formatMultiple(metrics.dscr),
      detail: 'NOI / debt service',
      formula: 'NOI / Debt Service',
      icon: metrics.dscr >= 1.25 ? 'check_circle' : 'warning',
    },
    {
      label: 'IRR',
      value: formatPercent(metrics.irr),
      detail: 'Model-inferred',
      formula: 'Mock hold-period cash-flow projection',
    },
    {
      label: 'Equity Multiple',
      value: formatMultiple(metrics.equityMultiple),
      detail: '5-year mock hold',
      formula: 'Total mock distributions / equity invested',
    },
  ];

  return (
    <StudioCard
      title="Calculated Metrics"
      eyebrow={scenarioLabel ? `${scenarioLabel} · formula-backed mock` : 'Formula-backed mock'}
    >
      <div className="metric-grid">
        {metricItems.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            detail={item.detail}
            icon={item.icon}
            onInspect={onInspectMetric ? () => onInspectMetric(item) : undefined}
          />
        ))}
      </div>
      <table className="sr-only">
        <caption>
          {scenarioLabel
            ? `${scenarioLabel} calculated metrics`
            : 'Calculated underwriting metrics'}
        </caption>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">NOI</th>
            <td>{formatCurrency(metrics.noi)}</td>
          </tr>
          <tr>
            <th scope="row">Cap rate</th>
            <td>{formatPercent(metrics.capRate)}</td>
          </tr>
          <tr>
            <th scope="row">Indicated value</th>
            <td>{formatCurrency(metrics.indicatedValue)}</td>
          </tr>
          <tr>
            <th scope="row">DSCR</th>
            <td>{formatMultiple(metrics.dscr)}</td>
          </tr>
          <tr>
            <th scope="row">IRR</th>
            <td>{formatPercent(metrics.irr)}</td>
          </tr>
          <tr>
            <th scope="row">Equity multiple</th>
            <td>{formatMultiple(metrics.equityMultiple)}</td>
          </tr>
        </tbody>
      </table>
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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onOverride(gate.id)}
                >
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
          <p>
            Review the lock packet before advancing.{' '}
            {canLock ? 'No blocking gates remain.' : 'Open blockers still prevent final lock.'}
          </p>
          <button type="button" className="btn btn-primary" onClick={onLock}>
            Review Version Lock
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
        ...grid.cells[rowIndex].map(
          (cell) => `${formatPercent(cell.irr)} / ${formatMultiple(cell.dscr)}`
        ),
      ])}
      getRowKey={(_row, index) => String(grid.rows[index])}
    />
  );
}
