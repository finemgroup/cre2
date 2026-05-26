import { useState, type ReactElement, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { studioDealPath, studioReportPath } from '@/data/studio';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { SophexModal } from '@/components/overlays/SophexModal';
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
  type UnderwritingGate,
  type UnderwritingMetrics,
} from '@/lib/underwriting';

export type ReadinessRailItem = {
  id: string;
  label: string;
  status: 'ready' | 'warning' | 'blocked' | 'pending';
  detail: string;
};

export type EvidenceTraceItem = {
  id: string;
  label: string;
  value: string;
  posture: string;
  sourceRef: string;
  asOf: string;
  confidence: 'High' | 'Medium' | 'Low';
  detail: string;
};

export type ConflictOption = {
  id: string;
  source: string;
  value: string;
  sourceRef: string;
  asOf: string;
  confidence: 'High' | 'Medium' | 'Low';
};

export type VersionSnapshot = {
  id: string;
  label: string;
  actor: string;
  createdAt: string;
  gateStatus: string;
  evidenceRef: string;
  scenarioSet: string;
  current?: boolean;
};

export function ReadinessRail({
  items,
  orientation = 'vertical',
}: {
  items: ReadinessRailItem[];
  orientation?: 'horizontal' | 'vertical';
}): ReactElement {
  return (
    <nav
      className={`readiness-rail readiness-rail-${orientation}`}
      aria-label="Underwriting readiness"
    >
      {items.map((item) => (
        <div key={item.id} className={`readiness-rail-item readiness-${item.status}`}>
          <span className="readiness-rail-icon" aria-hidden="true">
            <MaterialIcon
              name={
                item.status === 'ready'
                  ? 'verified_user'
                  : item.status === 'blocked'
                    ? 'block'
                    : 'pending'
              }
            />
          </span>
          <div>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
          </div>
        </div>
      ))}
    </nav>
  );
}

export function EvidenceValueCard({
  item,
  action,
}: {
  item: EvidenceTraceItem;
  action?: ReactNode;
}): ReactElement {
  return (
    <article className="evidence-value-card">
      <div className="evidence-value-card-header">
        <div>
          <p className="studio-eyebrow">{item.label}</p>
          <strong>{item.value}</strong>
        </div>
        <TrustBadge state={item.posture} />
      </div>
      <p>{item.detail}</p>
      <dl className="trace-metadata">
        <div>
          <dt>Source ref</dt>
          <dd>{item.sourceRef}</dd>
        </div>
        <div>
          <dt>As of</dt>
          <dd>{item.asOf}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{item.confidence}</dd>
        </div>
      </dl>
      {action ? <div className="studio-actions">{action}</div> : null}
    </article>
  );
}

export function EvidenceTraceList({
  items,
  onInspect,
}: {
  items: EvidenceTraceItem[];
  onInspect?: (item: EvidenceTraceItem) => void;
}): ReactElement {
  return (
    <div className="evidence-trace-list">
      {items.map((item) => (
        <EvidenceValueCard
          key={item.id}
          item={item}
          action={
            onInspect ? (
              <button type="button" className="btn btn-secondary" onClick={() => onInspect(item)}>
                Inspect evidence
              </button>
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

export function WorkstationDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}): ReactElement {
  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label={title}>
      <div className="workstation-drawer-body">{children}</div>
      {footer ? <footer className="workstation-drawer-footer">{footer}</footer> : null}
    </SophexSheet>
  );
}

export function CalculationBreakdownDrawer({
  isOpen,
  onClose,
  metricLabel,
  metricValue,
  formula,
  metrics,
}: {
  isOpen: boolean;
  onClose: () => void;
  metricLabel: string;
  metricValue: string;
  formula: string;
  metrics: UnderwritingMetrics;
}): ReactElement {
  return (
    <WorkstationDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${metricLabel} calculation breakdown`}
      footer={
        <PrototypeActionButton feature="Open assumption trace" className="btn btn-primary">
          Open Assumption Trace
        </PrototypeActionButton>
      }
    >
      <p className="studio-eyebrow">Calculation breakdown</p>
      <div className="workstation-hero-metric">
        <strong>{metricValue}</strong>
        <TrustBadge
          state={
            metricLabel === 'DSCR' && metrics.dscr < 1.25 ? 'source-pending' : 'model-inferred'
          }
        />
      </div>
      <div className="formula-box">{formula}</div>
      <h3>Input Traceability</h3>
      <EvidenceTraceList
        items={[
          {
            id: 'noi',
            label: 'Net Operating Income',
            value: formatCurrency(metrics.noi),
            posture: 'Reviewed',
            sourceRef: 'T12-normalized/ref-T12-04',
            asOf: '2026-05-19',
            confidence: 'Medium',
            detail: 'NOI is normalized from candidate T12 and rent-roll review data.',
          },
          {
            id: 'debt-service',
            label: 'Debt Service',
            value: formatCurrency(metrics.annualDebtService),
            posture: metrics.dscr < 1.25 ? 'Source pending' : 'Model-inferred',
            sourceRef: 'lender-quote-pending',
            asOf: 'Pending',
            confidence: 'Low',
            detail:
              metrics.dscr < 1.25
                ? 'Calculation remains advisory until lender quote evidence is reviewed.'
                : 'Debt service is formula-backed from mock lender assumptions.',
          },
        ]}
      />
      <div className="advisory-panel">
        <MaterialIcon name="info" />
        <p>
          This metric is model-inferred and not an appraisal. Underlying assumptions require review
          before export.
        </p>
      </div>
    </WorkstationDrawer>
  );
}

export function VersionLockConfirmationModal({
  isOpen,
  onClose,
  canLock,
  gates,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  canLock: boolean;
  gates: UnderwritingGate[];
  onConfirm: () => void;
}): ReactElement {
  const blockers = gates.filter((gate) => gate.status === 'BLOCKED' || gate.status === 'WARN');
  return (
    <SophexModal
      isOpen={isOpen}
      onClose={onClose}
      label="Lock Version v0.3 (IC-Ready Draft)"
      size="lg"
    >
      <div className="summary-grid">
        <MetricCard label="Assumptions" value="14" detail="Included" icon="calculate" />
        <MetricCard label="Scenarios" value="3" detail="Active" icon="query_stats" />
        <MetricCard label="Source refs" value="28" detail="Linked" icon="description" />
      </div>
      {blockers.length > 0 ? (
        <div className="blocked-panel" role="alert">
          <strong>Current blockers</strong>
          <ul>
            {blockers.map((gate) => (
              <li key={gate.id}>{gate.detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <DataTable
        caption="Excluded candidate sources"
        headers={['Source', 'Reason']}
        rows={[
          ['Draft_RentRoll_Q3_Unverified.pdf', 'Pending review'],
          ['Operating_Statement_Prelim.xlsx', 'Superseded'],
        ]}
      />
      <EvidenceValueCard
        item={{
          id: 'snap-89a2f',
          label: 'Evidence snapshot',
          value: 'SNAP-89A2F',
          posture: 'reviewer-required',
          sourceRef: 'EVID-SNAP-992',
          asOf: '2026-05-25',
          confidence: 'Medium',
          detail:
            'Locked version controls report/export eligibility. Future edits create a new branch.',
        }}
      />
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canLock}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Lock Version
        </button>
      </div>
    </SophexModal>
  );
}

export function EvidenceConflictResolverModal({
  isOpen,
  onClose,
  options,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  options: ConflictOption[];
  onConfirm: (summary: string) => void;
}): ReactElement {
  const [selected, setSelected] = useState<string>('');
  const [reason, setReason] = useState('');
  const canConfirm = selected.length > 0 && reason.trim().length > 0;

  return (
    <SophexModal isOpen={isOpen} onClose={onClose} label="Unit Count Discrepancy" size="lg">
      <p className="studio-eyebrow">Select authorized source value</p>
      <div className="conflict-option-grid">
        {options.map((option) => (
          <label key={option.id} className="conflict-option-card">
            <input
              type="radio"
              name="source_selection"
              value={option.id}
              checked={selected === option.id}
              onChange={() => setSelected(option.id)}
            />
            <span>{option.source}</span>
            <strong>{option.value}</strong>
            <small>
              {option.sourceRef} · {option.asOf} · {option.confidence}
            </small>
          </label>
        ))}
        <label className="conflict-option-card">
          <input
            type="radio"
            name="source_selection"
            value="hold"
            checked={selected === 'hold'}
            onChange={() => setSelected('hold')}
          />
          <span>Hold unresolved</span>
          <strong>Escalate</strong>
          <small>Senior reviewer required</small>
        </label>
      </div>
      <label className="form-field">
        Resolution rationale
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Provide justification for the selected source value or hold decision."
        />
      </label>
      <p className="muted">
        Resolution is a mock reviewer action and does not promote truth outside this prototype.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canConfirm}
          onClick={() => {
            onConfirm(reason);
            onClose();
          }}
        >
          Confirm Decision
        </button>
      </div>
    </SophexModal>
  );
}

export function SensitivityCellDrilldownDrawer({
  isOpen,
  onClose,
  purchasePrice,
  exitCap,
  metrics,
}: {
  isOpen: boolean;
  onClose: () => void;
  purchasePrice: number;
  exitCap: number;
  metrics: UnderwritingMetrics;
}): ReactElement {
  return (
    <WorkstationDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Sensitivity cell drilldown"
      footer={
        <>
          <PrototypeActionButton feature="Add to scenario set" className="btn btn-primary">
            Add to Scenario Set
          </PrototypeActionButton>
          <PrototypeActionButton feature="Send scenario for review" className="btn btn-secondary">
            Send Scenario for Review
          </PrototypeActionButton>
        </>
      }
    >
      <p className="studio-eyebrow">Selected cell target</p>
      <h3>
        Exit Cap {formatPercent(exitCap)} · Purchase Price {formatCurrency(purchasePrice)}
      </h3>
      <div className="metric-grid two">
        <MetricCard label="IRR" value={formatPercent(metrics.irr)} detail="Model-inferred" />
        <MetricCard
          label="Equity Multiple"
          value={formatMultiple(metrics.equityMultiple)}
          detail="Advisory"
        />
        <MetricCard
          label="DSCR"
          value={formatMultiple(metrics.dscr)}
          detail="Source pending"
          icon="warning"
        />
        <MetricCard
          label="Indicated Value"
          value={formatCurrency(metrics.indicatedValue)}
          detail="NOI / exit cap"
        />
      </div>
      <EvidenceTraceList
        items={[
          {
            id: 'exit-cap',
            label: 'Exit Cap',
            value: formatPercent(exitCap),
            posture: 'Candidate evidence',
            sourceRef: 'market-comp-candidate',
            asOf: '2026-05-20',
            confidence: 'Medium',
            detail: 'Aligned with recent multifamily dispositions in the MSA.',
          },
          {
            id: 'purchase-price',
            label: 'Purchase Price',
            value: formatCurrency(purchasePrice),
            posture: 'Blocked',
            sourceRef: 'seller-om-conflict',
            asOf: '2026-05-22',
            confidence: 'Low',
            detail: 'Variance with seller OM expectations remains unresolved.',
          },
        ]}
      />
      <div className="advisory-panel" role="note">
        <MaterialIcon name="info" />
        <div>
          <strong>Advisory mock output</strong>
          <p>
            Sensitivity cells are formula-backed prototype values — not investment advice or lender
            commitments. Scenario lock and reviewer gates must clear before export.
          </p>
        </div>
      </div>
    </WorkstationDrawer>
  );
}

export function SourceCoverageCard({
  documentedPercent,
  blockers,
}: {
  documentedPercent: number;
  blockers: string[];
}): ReactElement {
  return (
    <StudioCard
      title="Source Coverage"
      actions={<StatusBadge status={`${documentedPercent}% documented`} />}
    >
      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Source coverage"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={documentedPercent}
      >
        <div className="progress-fill" style={{ width: `${documentedPercent}%` }} />
      </div>
      {blockers.length > 0 ? (
        <ul className="governance-list">
          {blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      ) : null}
    </StudioCard>
  );
}

export type WorkflowSpineStep = {
  id: string;
  label: string;
  to?: string;
  status: ReadinessRailItem['status'];
  detail?: string;
  current?: boolean;
};

export function WorkflowSpineNav({ steps }: { steps: WorkflowSpineStep[] }): ReactElement {
  return (
    <nav className="workflow-spine-nav" aria-label="Underwriting workflow spine">
      <ol className="workflow-spine-list">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`workflow-spine-step readiness-${step.status}${step.current ? ' current' : ''}`}
            aria-current={step.current ? 'step' : undefined}
          >
            <span className="workflow-spine-marker" aria-hidden="true">
              {index + 1}
            </span>
            <div className="workflow-spine-copy">
              {step.to ? (
                <Link to={step.to} className="workflow-spine-link">
                  {step.label}
                </Link>
              ) : (
                <strong>{step.label}</strong>
              )}
              {step.detail ? <small>{step.detail}</small> : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type IntakeWorkflowStepId = 'intake' | 'data-review' | 'source-trace' | 'underwriting';

export function IntakeWorkflowNav({
  dealId,
  activeStep,
}: {
  dealId: string;
  activeStep: IntakeWorkflowStepId;
}): ReactElement {
  const steps: Array<{ id: IntakeWorkflowStepId; label: string; to: string; detail: string }> = [
    {
      id: 'intake',
      label: 'Intake & upload',
      to: studioDealPath(dealId, 'intake'),
      detail: 'Source files and candidate fields',
    },
    {
      id: 'data-review',
      label: 'Data review',
      to: studioDealPath(dealId, 'data-review'),
      detail: 'Rent roll / T12 normalization',
    },
    {
      id: 'source-trace',
      label: 'Source trace',
      to: studioDealPath(dealId, 'underwriting-sources'),
      detail: 'Assumption lineage and conflicts',
    },
    {
      id: 'underwriting',
      label: 'Underwriting cockpit',
      to: studioDealPath(dealId, 'underwriting'),
      detail: 'Assumptions, gates, and version lock',
    },
  ];

  return (
    <nav className="intake-workflow-nav" aria-label="Intake to assumptions workflow">
      <ol className="workflow-spine-list intake-workflow-list">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`workflow-spine-step${step.id === activeStep ? ' current' : ''}`}
            aria-current={step.id === activeStep ? 'step' : undefined}
          >
            <Link to={step.to} className="workflow-spine-link">
              {step.label}
            </Link>
            <small>{step.detail}</small>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function buildUnderwritingSpineSteps(
  dealId: string,
  activeStepId: string
): WorkflowSpineStep[] {
  return [
    {
      id: 'assumptions',
      label: 'Assumptions',
      to: studioDealPath(dealId, 'underwriting'),
      status: 'warning',
      detail: 'Candidate values need reviewer confirmation.',
      current: activeStepId === 'assumptions',
    },
    {
      id: 'evidence',
      label: 'Evidence',
      to: studioDealPath(dealId, 'underwriting-sources'),
      status: 'blocked',
      detail: 'Lender quote and unit count conflict unresolved.',
      current: activeStepId === 'evidence',
    },
    {
      id: 'review',
      label: 'Review',
      to: studioDealPath(dealId, 'data-review'),
      status: 'pending',
      detail: 'Normalization and comp review in progress.',
      current: activeStepId === 'review',
    },
    {
      id: 'gates',
      label: 'Gates',
      to: studioDealPath(dealId, 'underwriting'),
      status: 'warning',
      detail: 'Override or clear blockers before version lock.',
      current: activeStepId === 'gates',
    },
    {
      id: 'version',
      label: 'Version',
      to: studioDealPath(dealId, 'versions'),
      status: 'pending',
      detail: 'Lock disabled until all gates pass.',
      current: activeStepId === 'version',
    },
    {
      id: 'export',
      label: 'Report / export',
      to: studioReportPath(dealId),
      status: 'blocked',
      detail: 'Export gated until sections and source rights clear.',
      current: activeStepId === 'export',
    },
  ];
}
