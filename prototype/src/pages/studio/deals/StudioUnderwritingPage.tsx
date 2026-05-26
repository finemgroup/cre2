import { useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { DataTable, StudioCard, WorkflowContextHeader } from '@/components/studio/StudioPrimitives';
import {
  AssumptionsPanel,
  GatesPanel,
  MetricsPanel,
  SyntheticDataBanner,
  VersionLockCard,
} from '@/components/underwriting/UnderwritingPanels';
import { GateOverrideModal } from '@/components/overlays/GateOverrideModal';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import {
  WorkflowContinuityContainer,
  WorkflowHandoffLink,
} from '@/components/workflow/WorkflowPrimitives';
import { DealCockpitPanel } from '@/components/workflow/DealCockpitPanel';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { HitlReviewDrawer } from '@/components/workflow/HitlReviewDrawer';
import {
  CalculationBreakdownDrawer,
  ReadinessRail,
  SourceCoverageCard,
  VersionLockConfirmationModal,
  WorkflowSpineNav,
  buildUnderwritingSpineSteps,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import {
  buildProFormaRows,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import { buildScenarioPresets, type ScenarioName } from '@/lib/underwriting/scenarios';
import { getStudioUnderwritingView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import type { StudioUnderwritingView } from '@/lib/runtime/service-ports';
import { studioDealPath, studioReportPath, type Deal } from '@/data/studio';
import { TabPanelSwitch, StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

import { READINESS_ITEMS } from './deal-route-shared';

export function StudioUnderwritingPage(): ReactElement {
  const deal = useStudioDeal();
  const underwritingState = useRuntimeResource(
    () => runtimeServices.studio.getUnderwriting(deal?.id),
    `underwriting-${deal?.id ?? 'missing'}`,
    getStudioUnderwritingView(deal?.id)
  );
  if (!deal) return <StudioDealNotFound />;
  const view = underwritingState.value;
  if (!view) return <StudioDealNotFound />;

  return (
    <>
      <RuntimeResourceStatus
        loading={underwritingState.loading}
        error={underwritingState.error}
        variant="studio-deal"
      />
      {!underwritingState.loading && view.reviewedCompCount < 2 ? (
        <EmptyStateCard
          icon="compare"
          title="Comp set not ready for underwriting"
          description={`Only ${view.reviewedCompCount} reviewed comp${view.reviewedCompCount === 1 ? '' : 's'} are visible to this workspace. Underwriting gates stay in review posture until at least two reviewed comps clear.`}
          tone="warning"
          actions={
            <Link to={studioDealPath(deal.id, 'comps')} className="btn btn-secondary">
              Review comp set
            </Link>
          }
        />
      ) : null}
      <StudioUnderwritingWorkspace key={deal.id} deal={deal} view={view} />
    </>
  );
}

function StudioUnderwritingWorkspace({
  deal,
  view,
}: {
  deal: Deal;
  view: StudioUnderwritingView;
}): ReactElement {
  const baseAssumptions = view.assumptions;
  const scenarioAssumptions = useMemo(
    () => buildScenarioPresets(baseAssumptions),
    [baseAssumptions]
  );
  const [activeScenario, setActiveScenario] = useState<ScenarioName>('Base Case');
  const [locked, setLocked] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [calculationTarget, setCalculationTarget] = useState<{
    label: string;
    value: string;
    formula: string;
  } | null>(null);
  const [overriddenGates, setOverriddenGates] = useState<string[]>([]);
  const [overrideTarget, setOverrideTarget] = useState<{
    id: string;
    label: string;
    detail: string;
  } | null>(null);
  const [hitlDrawerOpen, setHitlDrawerOpen] = useState(false);
  const { pushToast } = usePrototypeToast();
  const [assumptions, setAssumptions] = useState(() => baseAssumptions);

  const metrics = useMemo(() => calculateUnderwritingMetrics(assumptions), [assumptions]);
  const reviewedCompCount = view.reviewedCompCount;
  const gates = useMemo(
    () =>
      evaluateUnderwritingGates(assumptions, metrics, reviewedCompCount).map((gate) =>
        overriddenGates.includes(gate.id) ? { ...gate, status: 'OVERRIDDEN' as const } : gate
      ),
    [assumptions, metrics, overriddenGates, reviewedCompCount]
  );
  const proFormaRows = useMemo(() => buildProFormaRows(assumptions), [assumptions]);

  return (
    <WorkflowContinuityContainer label="Underwriting workflow">
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Underwriting cockpit"
        returnTo={studioDealPath(deal.id)}
        returnLabel="Return to deal"
      />
      <SyntheticDataBanner />
      <ReviewPostureBanner blocks={view.sourceBlocks} />
      <div className="proof-strip" aria-label="Underwriting cockpit posture">
        {[
          [reviewedCompCount, 'Reviewed comps'],
          [gates.filter((gate) => gate.status === 'PASS').length, 'Clear gates'],
          [
            gates.filter((gate) => gate.status !== 'PASS' && gate.status !== 'OVERRIDDEN').length,
            'Open gates',
          ],
          [formatPercent(metrics.irr), 'Base IRR'],
        ].map(([value, label]) => (
          <article key={String(label)}>
            <strong className="fin-value">{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
      {!gates.every((gate) => gate.status === 'PASS' || gate.status === 'OVERRIDDEN') ? (
        <GateResolutionCallout
          action="Lock valuation snapshot"
          prerequisite="Underwriting gates remain open, including lender quote and unit count evidence."
          owner="An analyst"
          resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
          resolveLabel="Resolve evidence blockers"
        />
      ) : null}
      <div className="deal-cockpit-stack">
        <DealCockpitPanel
          dealId={deal.id}
          title="Executive Underwriting Cockpit"
          eyebrow="CRE cockpit pattern adapted"
          kpis={[
            {
              label: 'Advisory Value',
              value: formatCurrency(metrics.indicatedValue),
              detail: `${activeScenario} formula-backed range`,
            },
            { label: 'IRR', value: formatPercent(metrics.irr), detail: 'Model-inferred' },
            { label: 'DSCR', value: formatMultiple(metrics.dscr), detail: 'Lender quote pending' },
            {
              label: 'Open Gates',
              value: String(gates.filter((gate) => gate.status !== 'PASS').length),
              detail: 'Mock underwriting gates',
            },
          ]}
        />
      </div>
      <StudioCard title="Workflow Spine" eyebrow="Assumptions → export">
        <WorkflowSpineNav steps={buildUnderwritingSpineSteps(deal.id, 'assumptions')} />
      </StudioCard>
      <p className="muted" id="scenario-truth-note">
        Scenario controls apply formula-backed assumption presets. Metrics below update when the
        active scenario changes.
      </p>
      <div
        className="tabs-row"
        role="group"
        aria-label="Scenario controls"
        aria-describedby="scenario-truth-note"
      >
        {Object.keys(scenarioAssumptions).map((scenario) => (
          <button
            key={scenario}
            type="button"
            aria-pressed={activeScenario === scenario}
            className={activeScenario === scenario ? 'active' : ''}
            onClick={() => {
              const nextScenario = scenario as ScenarioName;
              setActiveScenario(nextScenario);
              setAssumptions(scenarioAssumptions[nextScenario]);
              setLocked(false);
            }}
          >
            {scenario}
          </button>
        ))}
        <Link to={studioDealPath(deal.id, 'scenarios')} className="btn btn-secondary">
          Compare Scenarios
        </Link>
      </div>
      <TabPanelSwitch panelKey={activeScenario}>
        <div className="workstation-hero-grid">
          <StudioCard title="Valuation Range & Model Output" eyebrow="Stitch rollout surface">
            <div className="valuation-range">
              <span>Advisory valuation range</span>
              <strong>
                {formatCurrency(metrics.indicatedValue * 0.94)} -{' '}
                {formatCurrency(metrics.indicatedValue * 1.06)}
              </strong>
              <p>
                Range is formula-backed mock output. Lender quote and unit-count evidence must clear
                before report/export.
              </p>
            </div>
            <div className="studio-actions">
              <Link
                to={studioDealPath(deal.id, 'underwriting-sources')}
                className="btn btn-secondary"
              >
                Open Source Trace
              </Link>
              <Link to={studioDealPath(deal.id, 'data-review')} className="btn btn-secondary">
                Open Data Review
              </Link>
              <Link to={studioDealPath(deal.id, 'underwriting-debt')} className="btn btn-secondary">
                Open Debt Panel
              </Link>
              <Link to={studioReportPath(deal.id)} className="btn btn-primary">
                Review Report Gates
              </Link>
            </div>
          </StudioCard>
          <SourceCoverageCard
            documentedPercent={92}
            blockers={[
              'Lender quote missing',
              'Unit count conflict unresolved',
              'Scenario set not locked',
            ]}
          />
          <StudioCard title="Readiness Rail">
            <ReadinessRail items={READINESS_ITEMS} />
          </StudioCard>
        </div>
        <div className="cockpit-grid">
          <AssumptionsPanel
            assumptions={assumptions}
            provenance={view.provenance}
            sourceTracePath={studioDealPath(deal.id, 'underwriting-sources')}
            onChange={setAssumptions}
          />
          <MetricsPanel
            metrics={metrics}
            scenarioLabel={activeScenario}
            onInspectMetric={setCalculationTarget}
          />
          <div aria-live="polite" className="sr-only">
            {activeScenario} scenario: IRR {formatPercent(metrics.irr)}, NOI{' '}
            {formatCurrency(metrics.noi)}
          </div>
          <GatesPanel
            gates={gates}
            onOverride={(gateId) => {
              const gate = gates.find((item) => item.id === gateId);
              if (!gate) return;
              setOverrideTarget({ id: gate.id, label: gate.label, detail: gate.detail });
            }}
          />
        </div>
        <StudioCard title="Pro Forma Cash Flow">
          <DataTable
            caption="Five-year pro forma cash flow"
            headers={['Year', 'Gross Revenue', 'Expenses', 'NOI', 'Debt Service', 'Cash Flow']}
            rows={proFormaRows}
          />
        </StudioCard>
        <div className="dashboard-grid">
          <VersionLockCard
            canLock={gates.every((gate) => gate.status === 'PASS' || gate.status === 'OVERRIDDEN')}
            locked={locked}
            onLock={() => setLockModalOpen(true)}
          />
          <StudioCard title="Next Handoff">
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'underwriting-sources')}
              label="Resolve evidence blockers"
              reason="Lender quote and unit count conflict block version lock and export."
            />
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'versions')}
              label="Review version timeline"
              reason="Version lock stays disabled until all gates pass or are overridden."
            />
            <WorkflowHandoffLink
              to={studioReportPath(deal.id)}
              label="Review report gates"
              reason="Export remains blocked until section review and source rights clear."
            />
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'scenarios')}
              label="Compare scenarios"
              reason={`${activeScenario} metrics are formula-backed but still mock-only.`}
            />
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'capital-stack')}
              label="Review capital stack"
              reason="Advisory stack and waterfall remain mock-only and export gated."
            />
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'ic-packet')}
              label="Open IC packet"
              reason="IC delivery simulated until section and evidence gates clear."
            />
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'hitl-review')}
              label="Open HITL review queue"
              reason="Internal reviewer assignments do not persist promotion authority."
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setHitlDrawerOpen(true)}
            >
              Open analyst review drawer
            </button>
            <WorkflowHandoffLink
              to={studioDealPath(deal.id, 'spatial')}
              label="Open spatial workbench"
              reason="Map manifest, trade areas, and source rights for report context."
            />
          </StudioCard>
        </div>
      </TabPanelSwitch>
      <ContextualSurfaceTriggers dealId={deal.id} route="underwriting" />
      <GateOverrideModal
        isOpen={overrideTarget !== null}
        onClose={() => setOverrideTarget(null)}
        gateLabel={overrideTarget?.label ?? 'Gate'}
        gateDetail={overrideTarget?.detail}
        onConfirm={(reason) => {
          if (!overrideTarget) return;
          setOverriddenGates((current) => [...new Set([...current, overrideTarget.id])]);
          pushToast(`Override recorded for ${overrideTarget.label}: ${reason}`, 'warning');
        }}
      />
      <CalculationBreakdownDrawer
        isOpen={calculationTarget !== null}
        onClose={() => setCalculationTarget(null)}
        metricLabel={calculationTarget?.label ?? 'Metric'}
        metricValue={calculationTarget?.value ?? ''}
        formula={calculationTarget?.formula ?? 'Formula-backed mock calculation'}
        metrics={metrics}
      />
      <VersionLockConfirmationModal
        isOpen={lockModalOpen}
        onClose={() => setLockModalOpen(false)}
        canLock={gates.every((gate) => gate.status === 'PASS' || gate.status === 'OVERRIDDEN')}
        gates={gates}
        onConfirm={() => {
          setLocked(true);
          pushToast('Version lock recorded as mock governance state.', 'success');
        }}
      />
      <HitlReviewDrawer
        dealId={deal.id}
        isOpen={hitlDrawerOpen}
        onClose={() => setHitlDrawerOpen(false)}
      />
    </WorkflowContinuityContainer>
  );
}
