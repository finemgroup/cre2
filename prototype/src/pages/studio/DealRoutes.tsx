import { useMemo, useState, type CSSProperties, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  AnimatedList,
  DataTable,
  DetailDrawer,
  MaterialIcon,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  PaywallOverlay,
  StageStepper,
  StatusBadge,
  StickyActionBar,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import {
  AssumptionsPanel,
  GatesPanel,
  MetricsPanel,
  SensitivityMatrix,
  SyntheticDataBanner,
  VersionLockCard,
} from '@/components/underwriting/UnderwritingPanels';
import {
  ProvenanceCell,
  ReviewPostureBanner,
  SourceEvidenceBlockCard,
} from '@/components/provenance/ProvenanceWidgets';
import { EvidenceMetadataList } from '@/components/evidence/EvidenceMetadataList';
import type { EvidenceMetadataItem } from '@/components/evidence/EvidenceMetadataList';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { StagedImportReviewPanel } from '@/components/review/StagedImportReviewPanel';
import { GateOverrideModal } from '@/components/overlays/GateOverrideModal';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { TrustExplainerDrawer } from '@/components/overlays/TrustExplainerDrawer';
import { UpgradePlanModal } from '@/components/overlays/UpgradePlanModal';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { SensitivityHeatmap } from '@/components/visualization/SensitivityHeatmap';
import { AccessibleBarChart } from '@/components/visualization/AccessibleBarChart';
import {
  ActivityTimelinePanel,
  WorkflowContinuityContainer,
  WorkflowHandoffLink,
} from '@/components/workflow/WorkflowPrimitives';
import {
  buildProFormaRows,
  buildSensitivityGrid,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import { buildScenarioPresets, listScenarioPresets, type ScenarioName } from '@/lib/underwriting/scenarios';
import { mockCandidateFields, mockUploadFiles } from '@/lib/staged-import';
import {
  activity,
  DEFAULT_DEAL_ID,
  studioDealPath,
  underwritingAssumptionsByDeal,
  underwritingProvenanceByDeal,
  type Deal,
} from '@/data/studio';
import {
  getStudioCompViews,
  getStudioDashboardView,
  getStudioDealView,
} from '@/lib/runtime/studio-workspace';
import {
  formatOnboardingSummary,
  getOnboardingProfile,
} from '@/lib/studio/onboarding-profile';
import {
  DealWorkflowTabs,
  SegmentedControl,
  StudioDealNotFound,
  useStudioDeal,
} from '@/pages/studio/StudioShared';

const DEAL_DOCUMENT_EVIDENCE: EvidenceMetadataItem[] = [
  {
    label: 'Offering memorandum.pdf',
    value: 'Purchase price and unit mix extracted as candidate fields',
    authorityLabel: 'Candidate evidence',
    safeExplanation: 'Document bytes stay prototype-only until review clears source-use.',
    sourceId: 'doc-om-riverside-flats',
    asOf: '2026-05-22',
  },
  {
    label: 'Rent roll.xlsx',
    value: 'Occupied units and in-place rents staged for analyst review',
    authorityLabel: 'Reviewed',
    safeExplanation: 'Reviewed org-private rent roll supports underwriting assumptions only.',
    sourceId: 'doc-rent-roll-riverside-flats',
    asOf: '2026-05-21',
  },
  {
    label: 'T12.pdf',
    value: 'Operating statement normalized to prototype expense categories',
    authorityLabel: 'Candidate evidence',
    safeExplanation: 'Expense normalization remains advisory until reviewer signoff.',
    sourceId: 'doc-t12-riverside-flats',
    asOf: '2026-05-19',
  },
];

export function StudioDashboardPage(): ReactElement {
  const dashboardView = getStudioDashboardView();
  const onboardingProfile = getOnboardingProfile();

  return (
    <div>
      <PageTitle
        eyebrow={onboardingProfile ? 'Workspace configured' : 'Welcome back, Alex'}
        title="Main Deal Dashboard"
        lede={
          onboardingProfile
            ? `${formatOnboardingSummary(onboardingProfile)} — mock broker workspace ready for review.`
            : 'Track active mandates, plan usage, and source-aware broker workflow activity.'
        }
        actions={
          <>
            <div className="usage-pill">
              <span>Plan usage</span>
              <strong>
                {onboardingProfile?.tier === 'Boutique' ? '1 of 3 deals' : '1 of 2 deals'}
              </strong>
              <div
                className="progress-bar progress-bar-compact"
                role="progressbar"
                aria-label="Plan usage"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
                aria-valuetext="50% of deal quota used"
              >
                <div
                  className="progress-fill"
                  style={{ '--progress-fill': '50%' } as CSSProperties}
                />
              </div>
            </div>
            <Link to={studioDealPath(DEFAULT_DEAL_ID, 'intake')} className="btn btn-primary">
              Import OM
            </Link>
            <Link to={studioDealPath(DEFAULT_DEAL_ID, 'intake')} className="btn btn-secondary">
              New Deal
            </Link>
          </>
        }
      />
      <NonProductionCallout>
        Dashboard KPIs are synthetic projections for product validation.
      </NonProductionCallout>
      <div className="metric-grid four">
        <MetricCard label="Active pipeline" value="$193.5M" detail="3 tracked deals" />
        <MetricCard label="Reports drafted" value="12" detail="4 need review" icon="description" />
        <MetricCard label="Comp sets" value="28" detail="7 premium-private" icon="analytics" />
        <MetricCard label="Plan usage" value="72%" detail="Premium mock tier" icon="speed" />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Deal Pipeline" className="wide-card">
          <DataTable
            caption="Deal pipeline"
            headers={['Deal', 'Market', 'Stage', 'Value', 'Authority']}
            getRowKey={(_row, index) => dashboardView.deals[index].id}
            rows={dashboardView.deals.map((deal) => [
              <Link key={deal.id} to={studioDealPath(deal.id)}>
                {deal.name}
              </Link>,
              deal.market,
              <StatusBadge status={deal.stage} />,
              deal.value,
              <TrustBadge state={deal.authority} />,
            ])}
          />
        </StudioCard>
        <div>
          <StudioCard title="Upgrade Coverage">
            <p>
              Premium unlocks additional comp authority tiers, scenario sensitivity, and white-label
              exports.
            </p>
            <PrototypeActionLink
              to="/studio/settings/billing"
              className="btn btn-primary"
              feature="Plan upgrade"
            >
              Upgrade plan
            </PrototypeActionLink>
          </StudioCard>
          <StudioCard title="Recent Activity">
            <AnimatedList className="activity-list">
              <ActivityTimelinePanel items={activity} />
            </AnimatedList>
          </StudioCard>
        </div>
      </div>
      <footer className="studio-footer">Finem CRE Studio dashboard - mock data only.</footer>
    </div>
  );
}

export function StudioDealOverviewPage(): ReactElement {
  const deal = useStudioDeal();
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Underwriting workspace"
        returnTo="/studio/dashboard"
      />
      <NonProductionCallout>
        Deal metrics are mock projections with candidate/review state labels.
      </NonProductionCallout>
      <div className="metric-grid four">
        <MetricCard label="Asking Price" value={deal.value} detail={deal.authority} />
        <MetricCard label="Indicated Value" value="$46.8M" detail="Model-inferred" />
        <MetricCard label="Target IRR" value="14.8%" detail="Scenario draft" />
        <MetricCard label="Equity Multiple" value="1.82x" detail="Analyst review active" />
      </div>
      <DealWorkflowTabs deal={deal} />
      <div className="dashboard-grid">
        <StudioCard title="Property Snapshot" className="wide-card">
          <div className="property-snapshot">
            <div className="property-image" aria-label="Mock property image" />
            <div>
              <p>
                {deal.address} in {deal.market}. {deal.assetClass} value-add opportunity with
                source-backed assumptions pending review.
              </p>
              <div className="mini-grid">
                <div>
                  <strong>Asset Class</strong>
                  <span>{deal.assetClass}</span>
                </div>
                <div>
                  <strong>Status</strong>
                  <span>{deal.status}</span>
                </div>
                <div>
                  <strong>Authority</strong>
                  <TrustBadge state={deal.authority} />
                </div>
              </div>
            </div>
          </div>
          <div className="timeline">
            {['Packet received', 'Comps matched', 'Underwriting flags', 'Report draft'].map(
              (step, index) => (
                <div key={step} className={index < 2 ? 'done' : ''}>
                  <span>{index + 1}</span>
                  {step}
                </div>
              )
            )}
          </div>
        </StudioCard>
        <StudioCard
          title="Source Documents"
          actions={
            <button className="btn btn-secondary" type="button" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </button>
          }
        >
          <DataTable
            caption="Source documents"
            headers={['Document', 'Type', 'Uploaded', 'State']}
            rows={[
              [
                'Offering memorandum.pdf',
                'Offering memorandum',
                'Today',
                <TrustBadge state="Candidate evidence" />,
              ],
              ['Rent roll.xlsx', 'Rent roll', 'Yesterday', <TrustBadge state="Reviewed" />],
              [
                'T12.pdf',
                'Operating statement',
                'Yesterday',
                <TrustBadge state="Candidate evidence" />,
              ],
            ]}
          />
        </StudioCard>
        <StudioCard title="Analyst Notes">
          <div className="notes-thread">
            <p>
              <strong>Alex:</strong> Rent roll normalization and exit cap assumptions require final
              review before report export.
            </p>
            <p>
              <strong>Priya:</strong> Waiting on lender quote before clearing DSCR warning.
            </p>
            <label>
              Add note
              <textarea defaultValue="Mock note draft only." />
            </label>
          </div>
          <TrustBadge state="Candidate evidence" />
        </StudioCard>
        <StudioCard title="Deal Team">
          <div className="team-list">
            {['Alex Morgan - Lead', 'Priya Shah - Underwriting', 'Chris Lee - Capital Markets'].map(
              (member) => (
                <div key={member}>{member}</div>
              )
            )}
          </div>
        </StudioCard>
      </div>
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Document Evidence"
      >
        <p>
          Candidate document evidence remains separate from canonical deal facts until reviewed.
        </p>
        <TrustBadge state="Candidate evidence" />
        <EvidenceMetadataList heading="Source documents" items={DEAL_DOCUMENT_EVIDENCE} />
      </DetailDrawer>
    </div>
  );
}

export function StudioDealIntakePage(): ReactElement {
  const { dealId } = useParams();
  const activeDeal = getStudioDealView(dealId)?.deal;
  const [propertyName, setPropertyName] = useState(activeDeal?.name ?? '');
  const { pushToast } = usePrototypeToast();
  if (!activeDeal) return <StudioDealNotFound />;
  const continueDealId = activeDeal.id;
  return (
    <div className="split-layout with-sticky">
      <div>
        <WorkflowContextHeader
          dealName={activeDeal.name}
          stage="Deal intake"
          returnTo={studioDealPath(activeDeal.id)}
          returnLabel="Return to deal"
        />
        <PageTitle
          title="Deal Intake"
          lede={`Capture deal basics for ${activeDeal.id} before comps and underwriting.`}
        />
        <StudioCard title="Property Basics">
          <div className="form-grid">
            <label>
              Property name
              <input
                value={propertyName}
                onChange={(event) => setPropertyName(event.target.value)}
              />
            </label>
            <label>
              Market
              <input defaultValue="Austin, TX" />
            </label>
            <label>
              Units
              <input defaultValue="196" />
            </label>
            <label>
              Year Built
              <input defaultValue="2018" />
            </label>
          </div>
        </StudioCard>
        <StudioCard title="Deal Basics">
          <div className="form-grid">
            <label>
              Asking price
              <input defaultValue="$42,500,000" />
            </label>
            <label>
              Status
              <select defaultValue="Candidate evidence">
                <option>Candidate evidence</option>
                <option>Needs review</option>
              </select>
            </label>
          </div>
          <p className="field-error" id="cap-rate-error">
            Validation: cap-rate basis requires a cited source before export.
          </p>
        </StudioCard>
        <StudioCard title="Source Materials">
          <UploadDropzone files={mockUploadFiles} />
        </StudioCard>
        <StudioCard title="Financial Assumptions">
          <div className="form-grid">
            <label>
              T12 NOI
              <input defaultValue="$2,900,000" />
            </label>
            <label>
              Implied Cap Rate
              <input defaultValue="5.8%" aria-invalid="true" aria-describedby="cap-rate-error" />
            </label>
            <label>
              Vacancy
              <input defaultValue="4.5%" aria-invalid="true" aria-describedby="vacancy-error" />
            </label>
          </div>
          <p className="field-error" id="vacancy-error">
            Vacancy assumption requires a supporting rent roll citation.
          </p>
        </StudioCard>
        <StagedImportReviewPanel files={mockUploadFiles} candidates={mockCandidateFields} />
        <StickyActionBar>
          <span>Last saved just now</span>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => pushToast('Draft saved locally (prototype only).', 'success')}
          >
            Save draft
          </button>
          <Link to={studioDealPath(continueDealId, 'comps')} className="btn btn-primary">
            Continue to Comps
          </Link>
        </StickyActionBar>
      </div>
      <StudioCard title="Packet Preview">
        <div className="packet-preview">
          <h3>{propertyName || 'Untitled deal'}</h3>
          <p>Austin multifamily acquisition packet</p>
          <TrustBadge state="Candidate evidence" />
          <div className="metric-grid">
            <MetricCard label="Asking" value="$42.5M" detail="From OM" />
            <MetricCard label="T12 NOI" value="$2.9M" detail="Candidate" />
          </div>
          <StageStepper
            stages={['Uploaded', 'Extracting', 'Needs review', 'Ready']}
            activeIndex={2}
          />
        </div>
      </StudioCard>
    </div>
  );
}

export function StudioCompsPage(): ReactElement {
  const deal = useStudioDeal();
  const compViews = getStudioCompViews();
  const [selectedId, setSelectedId] = useState(compViews[0]?.id ?? '');
  const selected = compViews.find((comp) => comp.id === selectedId) ?? null;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<'table' | 'map'>('table');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;
  const sourceBlocks = getStudioDealView(deal.id)?.sourceBlocks ?? [];

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Comparable sales review"
        returnTo={studioDealPath(deal.id)}
        returnLabel="Return to deal"
      />
      <DealWorkflowTabs deal={deal} />
      <NonProductionCallout>
        Comparable sales are sample rows with mixed authority states.
      </NonProductionCallout>
      <ReviewPostureBanner blocks={sourceBlocks} />
      <div className="comps-grid">
        <StudioCard title="Subject Property">
          <div className="property-image small" aria-label="Mock subject property image" />
          <p>{deal.address}</p>
          <MetricCard label="Units" value="196" detail="Candidate from OM" />
          <MetricCard label="Target basis" value="$217k/unit" detail="Model-inferred" />
        </StudioCard>
        <StudioCard
          title="Sales Comparables"
          className="wide-card"
          actions={
            <SegmentedControl
              label="Comp view mode"
              value={view}
              options={['table', 'map']}
              onChange={setView}
            />
          }
        >
          {view === 'map' ? (
            <div className="mock-map">
              <MaterialIcon name="map" />
              Sample map view. No precise public markers in MVP0.
            </div>
          ) : (
            <DataTable
              caption="Sales comparables"
              headers={['Comp', 'Distance', 'Units', 'Sale Price', 'Authority']}
              getRowKey={(_row, index) => compViews[index].id}
              rows={compViews.map((comp) => [
                <button
                  type="button"
                  className="table-link"
                  onClick={() => {
                    setSelectedId(comp.id);
                    setDrawerOpen(true);
                  }}
                  aria-describedby={!comp.visible ? `${comp.id}-visibility` : undefined}
                >
                  {comp.name}
                  {!comp.visible ? (
                    <span id={`${comp.id}-visibility`} className="sr-only">
                      {comp.safeExplanation}
                    </span>
                  ) : null}
                </button>,
                comp.distance,
                comp.units,
                <ProvenanceCell
                  value={comp.salePrice}
                  citation={sourceBlocks[2]?.citations[0]}
                  state={comp.authority}
                />,
                <TrustBadge state={comp.authority} />,
              ])}
            />
          )}
          <div className="paywall-zone">
            <PaywallOverlay>
              <h3>Premium comp set locked</h3>
              <p>Upgrade to view provider-restricted and organization-private comparables.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setUpgradeOpen(true)}
              >
                Upgrade
              </button>
            </PaywallOverlay>
          </div>
        </StudioCard>
        <StudioCard title="Comp Detail" className="comp-aside">
          {selected ? (
            <div className="drawer-facts">
              <MetricCard
                label="Selected comp"
                value={selected.name}
                detail={`${selected.distance} from subject`}
              />
              <MetricCard
                label="Price / Unit"
                value={selected.pricePerUnit}
                detail={selected.authority}
              />
              <TrustBadge state={selected.authority} />
            </div>
          ) : (
            <p>Select a comparable sale to inspect authority and valuation context.</p>
          )}
        </StudioCard>
      </div>
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected?.name ?? 'Comparable'}
      >
        {selected ? (
          <div className="drawer-facts">
            <MetricCard
              label="Price / Unit"
              value={selected.pricePerUnit}
              detail={selected.authority}
            />
            <MetricCard
              label="Cap Rate"
              value={selected.capRate}
              detail="Reviewed comparison basis"
            />
            <TrustBadge state={selected.authority} />
            {sourceBlocks.map((block) => (
              <SourceEvidenceBlockCard key={block.id} block={block} />
            ))}
            <button type="button" className="btn btn-secondary" onClick={() => setTrustOpen(true)}>
              How trust tiers work
            </button>
          </div>
        ) : null}
      </DetailDrawer>
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="Premium comp set"
        detail="Unlock provider-restricted and organization-private comparables."
      />
      <TrustExplainerDrawer
        isOpen={trustOpen}
        onClose={() => setTrustOpen(false)}
        context={`Authority for ${selected?.name ?? 'this comp'} is ${selected?.authority ?? 'unknown'}.`}
      />
    </div>
  );
}

export function StudioUnderwritingPage(): ReactElement {
  const deal = useStudioDeal();
  if (!deal) return <StudioDealNotFound />;
  return <StudioUnderwritingWorkspace key={deal.id} deal={deal} />;
}

function StudioUnderwritingWorkspace({ deal }: { deal: Deal }): ReactElement {
  const baseAssumptions =
    underwritingAssumptionsByDeal[deal.id] ?? underwritingAssumptionsByDeal['riverside-flats'];
  const scenarioAssumptions = useMemo(
    () => buildScenarioPresets(baseAssumptions),
    [baseAssumptions]
  );
  const [activeScenario, setActiveScenario] = useState<ScenarioName>('Base Case');
  const [locked, setLocked] = useState(false);
  const [overriddenGates, setOverriddenGates] = useState<string[]>([]);
  const [overrideTarget, setOverrideTarget] = useState<{
    id: string;
    label: string;
    detail: string;
  } | null>(null);
  const { pushToast } = usePrototypeToast();
  const [assumptions, setAssumptions] = useState(() => baseAssumptions);

  const metrics = useMemo(() => calculateUnderwritingMetrics(assumptions), [assumptions]);
  const reviewedCompCount = getStudioCompViews().filter(
    (comp) => comp.authority === 'Reviewed' && comp.visible
  ).length;
  const gates = useMemo(
    () =>
      evaluateUnderwritingGates(
        assumptions,
        metrics,
        reviewedCompCount
      ).map((gate) =>
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
      <DealWorkflowTabs deal={deal} />
      <SyntheticDataBanner />
      <p className="muted" id="scenario-truth-note">
        Scenario controls apply formula-backed assumption presets. Metrics below update when the
        active scenario changes.
      </p>
      <div className="tabs-row" role="group" aria-label="Scenario controls" aria-describedby="scenario-truth-note">
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
      <div className="cockpit-grid">
        <AssumptionsPanel
          assumptions={assumptions}
          provenance={underwritingProvenanceByDeal[deal.id]}
          onChange={setAssumptions}
        />
        <MetricsPanel metrics={metrics} scenarioLabel={activeScenario} />
        <div aria-live="polite" className="sr-only">
          {activeScenario} scenario: IRR {formatPercent(metrics.irr)}, NOI {formatCurrency(metrics.noi)}
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
          canLock={gates.every((gate) => gate.status !== 'BLOCKED')}
          locked={locked}
          onLock={() => setLocked(true)}
        />
        <StudioCard title="Next Handoff">
          <WorkflowHandoffLink
            to={studioDealPath(deal.id, 'scenarios')}
            label="Compare scenarios"
            reason={`${activeScenario} metrics are formula-backed but still mock-only.`}
          />
        </StudioCard>
      </div>
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
    </WorkflowContinuityContainer>
  );
}

export function StudioScenarioComparisonPage(): ReactElement {
  const deal = useStudioDeal();
  const heatmapLocked = true;
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const assumptions =
    underwritingAssumptionsByDeal[deal?.id ?? ''] ??
    underwritingAssumptionsByDeal['riverside-flats'];
  const grid = useMemo(() => buildSensitivityGrid(assumptions), [assumptions]);
  const scenarioMetrics = useMemo(
    () =>
      listScenarioPresets(assumptions).map(({ name, assumptions: scenarioAssumptions }) => ({
        name,
        metrics: calculateUnderwritingMetrics(scenarioAssumptions),
      })),
    [assumptions]
  );
  const irrValues = scenarioMetrics.map((scenario) => scenario.metrics.irr);
  const maxIrr = Math.max(...irrValues);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Scenario comparison"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to underwriting"
      />
      <DealWorkflowTabs deal={deal} />
      <NonProductionCallout>
        Scenario outputs are mock calculations and not investment recommendations.
      </NonProductionCallout>
      <div className="scenario-grid">
        {scenarioMetrics.map((scenario) => (
          <StudioCard key={scenario.name} title={scenario.name}>
            <MetricCard
              label="IRR"
              value={formatPercent(scenario.metrics.irr)}
              detail="Model-inferred"
            />
            <MetricCard
              label="Equity Multiple"
              value={formatMultiple(scenario.metrics.equityMultiple)}
              detail={`Value ${formatCurrency(scenario.metrics.indicatedValue)}`}
            />
          </StudioCard>
        ))}
      </div>
      <StudioCard title="Scenario metrics">
        <DataTable
          caption="Scenario comparison metrics"
          headers={['Scenario', 'IRR', 'Equity multiple', 'Indicated value']}
          rows={scenarioMetrics.map((scenario) => [
            scenario.name,
            formatPercent(scenario.metrics.irr),
            formatMultiple(scenario.metrics.equityMultiple),
            formatCurrency(scenario.metrics.indicatedValue),
          ])}
          getRowKey={(_row, index) => scenarioMetrics[index].name}
        />
      </StudioCard>
      <StudioCard title="Key Metrics Matrix">
        <SensitivityMatrix grid={grid} />
      </StudioCard>
      <StudioCard title="IRR Bar Chart">
        <AccessibleBarChart
          title="IRR by scenario"
          caption="IRR by scenario. Bar heights are decorative; use the table for exact values."
          items={scenarioMetrics.map((scenario) => ({
            id: scenario.name,
            label: scenario.name,
            value: formatPercent(scenario.metrics.irr),
            ratio: scenario.metrics.irr / maxIrr,
          }))}
          tableHeaders={['Scenario', 'IRR']}
        />
      </StudioCard>
      <StudioCard title="Sensitivity Heatmap">
        <SensitivityHeatmap
          grid={grid}
          locked={heatmapLocked}
          onUnlock={() => setUpgradeOpen(true)}
        />
      </StudioCard>
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="Sensitivity heatmap"
        detail="Premium unlocks IRR/DSCR heatmaps across purchase price and exit cap ranges."
      />
    </div>
  );
}
