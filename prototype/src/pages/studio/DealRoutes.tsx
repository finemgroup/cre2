import { useMemo, useState, type ReactElement } from 'react';
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
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
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
import { AiTaskPulse } from '@/components/workflow/AiTaskPulse';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { DealCockpitPanel } from '@/components/workflow/DealCockpitPanel';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { HitlReviewDrawer } from '@/components/workflow/HitlReviewDrawer';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  CalculationBreakdownDrawer,
  EvidenceConflictResolverModal,
  EvidenceTraceList,
  EvidenceValueCard,
  ReadinessRail,
  SensitivityCellDrilldownDrawer,
  SourceCoverageCard,
  VersionLockConfirmationModal,
  WorkflowSpineNav,
  IntakeWorkflowNav,
  buildUnderwritingSpineSteps,
  WorkstationDrawer,
  type ConflictOption,
  type EvidenceTraceItem,
  type ReadinessRailItem,
  type VersionSnapshot,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import {
  buildProFormaRows,
  buildSensitivityGrid,
  calculateUnderwritingMetrics,
  evaluateUnderwritingGates,
  formatCurrency,
  formatMultiple,
  formatPercent,
} from '@/lib/underwriting';
import {
  buildScenarioPresets,
  listScenarioPresets,
  type ScenarioName,
} from '@/lib/underwriting/scenarios';
import { mockCandidateFields, mockUploadFiles } from '@/lib/staged-import';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getLinkedPropertyId } from '@/lib/workflow-identity';
import {
  activity,
  DEFAULT_DEAL_ID,
  studioDealPath,
  studioReportPath,
  underwritingAssumptionsByDeal,
  underwritingProvenanceByDeal,
  type Deal,
} from '@/data/studio';
import {
  getStudioCompViews,
  getStudioDashboardView,
  getStudioDealView,
} from '@/lib/runtime/studio-workspace';
import { formatOnboardingSummary, getOnboardingProfile } from '@/lib/studio/onboarding-profile';
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

const ASSUMPTION_TRACE_ITEMS: EvidenceTraceItem[] = [
  {
    id: 'unit-count',
    label: 'Unit count',
    value: '195 units',
    posture: 'Blocked',
    sourceRef: 'OM p.14 / RentRoll p.1',
    asOf: '2026-05-22',
    confidence: 'Medium',
    detail: 'Offering memorandum and rent roll disagree; senior reviewer resolution is required.',
  },
  {
    id: 'exit-cap',
    label: 'Exit cap rate',
    value: '5.75%',
    posture: 'Candidate evidence',
    sourceRef: 'CompSet-Austin-MF-05',
    asOf: '2026-05-20',
    confidence: 'Medium',
    detail: 'Candidate market-comp evidence supports the current exit cap assumption.',
  },
  {
    id: 't12-noi',
    label: 'T12 NOI',
    value: '$2.9M',
    posture: 'Reviewed',
    sourceRef: 'T12_Normalized_04',
    asOf: '2026-05-19',
    confidence: 'High',
    detail: 'Reviewed normalization supports current NOI calculation inputs.',
  },
  {
    id: 'debt-service',
    label: 'Debt service',
    value: '$2.3M',
    posture: 'Source pending',
    sourceRef: 'Lender quote missing',
    asOf: 'Pending',
    confidence: 'Low',
    detail: 'Awaiting lender quote review before DSCR can clear export gates.',
  },
];

const UNIT_CONFLICT_OPTIONS: ConflictOption[] = [
  {
    id: 'om',
    source: 'Offering Memorandum',
    value: '196',
    sourceRef: 'OM p.14',
    asOf: '2026-05-20',
    confidence: 'High',
  },
  {
    id: 'rent-roll',
    source: 'Rent Roll',
    value: '194',
    sourceRef: 'RentRoll p.1',
    asOf: '2026-05-21',
    confidence: 'Medium',
  },
  {
    id: 'analyst',
    source: 'Analyst Override',
    value: '195',
    sourceRef: 'J. Doe note',
    asOf: '2026-05-22',
    confidence: 'Low',
  },
];

const VERSION_SNAPSHOTS: VersionSnapshot[] = [
  {
    id: 'v0.3',
    label: 'IC-Ready Draft',
    actor: 'Sarah Jenkins (VP)',
    createdAt: '2026-05-25 14:30',
    gateStatus: 'Cleared for IC',
    evidenceRef: 'EVID-SNAP-992',
    scenarioSet: 'Base + Conservative Refi',
    current: true,
  },
  {
    id: 'v0.2',
    label: 'Analyst Reviewed',
    actor: 'Mike Chen (Analyst)',
    createdAt: '2026-05-24 09:15',
    gateStatus: 'Analyst sign-off',
    evidenceRef: 'EVID-SNAP-991',
    scenarioSet: 'Base only',
  },
  {
    id: 'v0.1',
    label: 'Draft',
    actor: 'System Auto-Gen',
    createdAt: '2026-05-22 16:45',
    gateStatus: 'Pending review',
    evidenceRef: 'EVID-SNAP-980',
    scenarioSet: 'Default processing',
  },
];

const READINESS_ITEMS: ReadinessRailItem[] = [
  {
    id: 'assumptions',
    label: 'Assumptions',
    status: 'warning',
    detail: 'Two candidate values need reviewer confirmation.',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    status: 'blocked',
    detail: 'Lender quote and unit count conflict unresolved.',
  },
  {
    id: 'scenarios',
    label: 'Scenarios',
    status: 'warning',
    detail: 'Scenario output remains advisory until gates clear.',
  },
  {
    id: 'review',
    label: 'Review',
    status: 'pending',
    detail: 'Senior reviewer signoff required before export.',
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
                <div className="progress-fill progress-fill-half" />
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
        stage="Deal cockpit"
        returnTo="/studio/dashboard"
      />
      <NonProductionCallout>
        Deal metrics are mock projections with candidate/review state labels.
      </NonProductionCallout>
      <DealWorkflowTabs deal={deal} />
      <div className="deal-cockpit-stack">
      <DealCockpitPanel
        dealId={deal.id}
        kpis={[
          {
            label: 'Asking Price',
            value: deal.value,
            detail: deal.authority,
            posture: deal.authority,
          },
          { label: 'Indicated Value', value: '$46.8M', detail: 'Model-inferred' },
          { label: 'Target IRR', value: '14.8%', detail: 'Scenario draft' },
          { label: 'Equity Multiple', value: '1.82x', detail: 'Analyst review active' },
        ]}
      />
      </div>
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
        <IntakeWorkflowNav dealId={activeDeal.id} activeStep="intake" />
        <NonProductionCallout>
          Uploaded files and extracted fields remain candidate evidence until data review and source
          trace gates clear.
        </NonProductionCallout>
        <MockBoundaryBanner variant="evidence" />
        <GateResolutionCallout
          action="Continue to normalization workbench"
          prerequisite="Cap-rate basis and source materials still need cited evidence."
          owner="An analyst"
          resolveTo={studioDealPath(activeDeal.id, 'data-review')}
          resolveLabel="Open data review"
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
          <Link to={studioDealPath(continueDealId, 'data-review')} className="btn btn-secondary">
            Open Data Review
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
      <ContextualSurfaceTriggers dealId={activeDeal.id} route="intake" />
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
      <PageTitle
        eyebrow="Comparable sales"
        title="Comparable Sales Review"
        lede="Review comp authority, source citations, and visibility before underwriting assumptions."
      />
      <NonProductionCallout>
        Comparable sales are sample rows with mixed authority states.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Apply comp set to underwriting"
        prerequisite="Premium-private comp visibility and exit cap citation remain blocked."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
        resolveLabel="Review comp source trace"
      />
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
      <ContextualSurfaceTriggers dealId={deal.id} route="comps" />
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
  const reviewedCompCount = getStudioCompViews().filter(
    (comp) => comp.authority === 'Reviewed' && comp.visible
  ).length;
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
      <DealWorkflowTabs deal={deal} />
      <SyntheticDataBanner />
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
          provenance={underwritingProvenanceByDeal[deal.id]}
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

export function StudioScenarioComparisonPage(): ReactElement {
  const deal = useStudioDeal();
  const heatmapLocked = false;
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    purchasePrice: number;
    exitCapRate: number;
    metrics: ReturnType<typeof calculateUnderwritingMetrics>;
  } | null>(null);
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
      <PageTitle
        eyebrow="Scenario governance"
        title="Scenario Comparison & Sensitivity"
        lede="Compare governed scenario presets, driver deltas, and advisory sensitivity output before lock."
      />
      <NonProductionCallout>
        Scenario outputs are mock calculations and not investment recommendations. Lock remains
        disabled until source and lender gates clear.
      </NonProductionCallout>
      <MockBoundaryBanner variant="scenario" />
      <GateResolutionCallout
        action="Promote scenario to valuation snapshot"
        prerequisite="Upside rent growth remains candidate evidence and lender quote is still missing."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting-debt')}
        resolveLabel="Review debt / lender quote"
      />
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
      <StudioCard
        title="Driver Comparison"
        actions={
          <PrototypeActionLink
            to={studioDealPath(deal.id, 'underwriting-sources')}
            className="btn btn-secondary"
            feature="Scenario driver evidence"
          >
            Open evidence trace
          </PrototypeActionLink>
        }
      >
        <DataTable
          caption="Scenario driver comparison with source posture"
          headers={[
            'Driver',
            'Base',
            'Upside',
            'Downside',
            'Max delta',
            'Source posture',
            'Gate implication',
          ]}
          rows={[
            [
              'Vacancy',
              '4.5%',
              '3.5%',
              '4.5%',
              '1.0%',
              <TrustBadge state="Reviewed" />,
              'Clear for scenario lock',
            ],
            [
              'Rent growth',
              '3.0%',
              '4.2%',
              '1.8%',
              '2.4%',
              <TrustBadge state="Candidate evidence" />,
              'Reviewer required before upside lock',
            ],
            [
              'Exit cap rate',
              '5.75%',
              '5.75%',
              '6.25%',
              '0.50%',
              <TrustBadge state="Candidate evidence" />,
              'Export blocked until comp citation clears',
            ],
            [
              'Interest rate',
              '6.75%',
              '6.75%',
              '6.75%',
              '-',
              <TrustBadge state="Source pending" />,
              'Lender quote required for DSCR gate',
            ],
            [
              'Renovation budget',
              '$2.4M',
              '$2.4M',
              '$2.4M',
              '-',
              <TrustBadge state="Reviewer required" />,
              'Senior signoff before IC memo export',
            ],
          ]}
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
          onSelectCell={(cell) => setSelectedCell(cell)}
        />
      </StudioCard>
      <StudioCard title="Scenario Gates">
        <ReadinessRail
          orientation="horizontal"
          items={[
            {
              id: 'base-reviewed',
              label: 'Base reviewed',
              status: 'ready',
              detail: 'IC memo v2 source references are linked.',
            },
            {
              id: 'upside-source',
              label: 'Upside source pending',
              status: 'warning',
              detail: 'Market comp data is candidate evidence.',
            },
            {
              id: 'downside-lender',
              label: 'Downside lender quote missing',
              status: 'blocked',
              detail: 'Term sheet draft is required before lock.',
            },
          ]}
        />
        <p className="muted" id="scenario-lock-blocked">
          Scenario set lock is simulated and disabled while downside lender quote and upside source
          gates remain open.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled
          aria-describedby="scenario-lock-blocked"
        >
          Lock Scenario Set
        </button>
      </StudioCard>
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="Sensitivity heatmap"
        detail="Premium unlocks IRR/DSCR heatmaps across purchase price and exit cap ranges."
      />
      <SensitivityCellDrilldownDrawer
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        purchasePrice={selectedCell?.purchasePrice ?? assumptions.purchasePrice}
        exitCap={selectedCell?.exitCapRate ?? assumptions.exitCapRate}
        metrics={selectedCell?.metrics ?? calculateUnderwritingMetrics(assumptions)}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="scenarios" />
    </div>
  );
}

export function StudioAssumptionSourceTracePage(): ReactElement {
  const deal = useStudioDeal();
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceTraceItem | null>(
    ASSUMPTION_TRACE_ITEMS[0]
  );
  const [conflictOpen, setConflictOpen] = useState(false);
  const { pushToast } = usePrototypeToast();
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Assumption source trace"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <IntakeWorkflowNav dealId={deal.id} activeStep="source-trace" />
      <PageTitle
        eyebrow="Source trace"
        title="Assumption Source Trace"
        lede="Review every important underwriting input against source refs, as-of dates, confidence, and reviewer posture."
      />
      <NonProductionCallout>
        Assumption lineage is deterministic mock data. Reviewer actions are simulated and do not
        persist truth.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Promote cleared assumptions"
        prerequisite="Unit count conflict remains blocked until reviewer resolution."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'data-review')}
        resolveLabel="Open normalization workbench"
      />
      <DataWorkbenchShell
        title="Assumption Source Trace"
        subtitle="Switch between trace table, blocker list, and evidence grid without changing authority."
        storageKey={`source-trace-${deal.id}`}
        aiSlot={<AiTaskPulse tasks={[]} />}
        views={{
          table: (
            <div className="split-workstation-grid">
              <StudioCard title="Assumption Sources" className="wide-card">
                <DataTable
                  caption="Assumption source trace"
                  headers={[
                    'Assumption',
                    'Current value',
                    'Source ref',
                    'As of',
                    'Confidence',
                    'Posture',
                    'Action',
                  ]}
                  rows={ASSUMPTION_TRACE_ITEMS.map((item) => [
                    item.label,
                    item.value,
                    item.sourceRef,
                    item.asOf,
                    item.confidence,
                    <TrustBadge state={item.posture} />,
                    item.id === 'unit-count' ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setConflictOpen(true)}
                      >
                        Resolve conflict
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedEvidence(item)}
                      >
                        Inspect
                      </button>
                    ),
                  ])}
                  getRowKey={(_row, index) => ASSUMPTION_TRACE_ITEMS[index].id}
                />
              </StudioCard>
              <StudioCard title="Selected Evidence Detail">
                {selectedEvidence ? (
                  <EvidenceValueCard item={selectedEvidence} />
                ) : (
                  <p className="muted">Select an assumption row to inspect source posture.</p>
                )}
                <EvidenceTraceList
                  items={ASSUMPTION_TRACE_ITEMS.filter((item) => item.id !== selectedEvidence?.id)}
                  onInspect={setSelectedEvidence}
                />
              </StudioCard>
            </div>
          ),
          list: (
            <StudioCard title="Blocker-focused list">
              <EvidenceTraceList items={ASSUMPTION_TRACE_ITEMS} onInspect={setSelectedEvidence} />
            </StudioCard>
          ),
          grid: (
            <div className="dashboard-grid">
              {ASSUMPTION_TRACE_ITEMS.slice(0, 4).map((item) => (
                <EvidenceValueCard key={item.id} item={item} />
              ))}
            </div>
          ),
        }}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="source-trace" />
      <EvidenceConflictResolverModal
        isOpen={conflictOpen}
        onClose={() => setConflictOpen(false)}
        options={UNIT_CONFLICT_OPTIONS}
        onConfirm={(reason) =>
          pushToast(`Conflict resolution captured for review: ${reason}`, 'warning')
        }
      />
    </div>
  );
}

export function StudioDataReviewPage(): ReactElement {
  const deal = useStudioDeal();
  const [conflictOpen, setConflictOpen] = useState(false);
  const { pushToast } = usePrototypeToast();
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Rent roll / T12 normalization"
        returnTo={studioDealPath(deal.id, 'intake')}
        returnLabel="Return to intake"
      />
      <DealWorkflowTabs deal={deal} />
      <IntakeWorkflowNav dealId={deal.id} activeStep="data-review" />
      <PageTitle
        eyebrow="Evidence review"
        title="Rent roll / T12 normalization"
        lede="Compare extracted fields against normalized candidate values before promotion to assumptions."
      />
      <NonProductionCallout>
        Normalization rows are candidate-only mock evidence until analyst and reviewer gates clear.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Promote normalized fields to assumptions"
        prerequisite="Unit count conflict between OM and rent roll remains unresolved."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
        resolveLabel="Open source trace"
      />
      <DataWorkbenchShell
        title="Normalization Workbench"
        subtitle="Review source files, candidate fields, and promotion blockers in one Evidence-stage shell."
        storageKey={`normalization-workbench-${deal.id}`}
        actions={
          <PrototypeActionLink
            to={studioDealPath(deal.id, 'underwriting-sources')}
            className="btn btn-primary"
            feature="Review normalization evidence"
          >
            Review Source Trace
          </PrototypeActionLink>
        }
        secondaryControls={<StatusBadge status="1 blocked candidate" />}
        views={{
          table: (
            <div className="dashboard-grid">
              <StudioCard title="Source Files">
                <DataTable
                  caption="Normalization source files"
                  headers={['File', 'Type', 'State', 'Issue']}
                  rows={mockUploadFiles.map((file) => [
                    file.name,
                    file.type,
                    <StatusBadge status={file.status} />,
                    file.issue ?? 'No blocking issue',
                  ])}
                />
              </StudioCard>
              <NormalizationCandidateCard
                onResolveConflict={() => setConflictOpen(true)}
                dealId={deal.id}
              />
            </div>
          ),
          list: (
            <StudioCard title="Candidate blocker list">
              <ul className="governance-list">
                <li>Unit count conflict · OM + rent roll · reviewer resolution required</li>
                <li>T12 revenue · reviewed · clear for assumptions</li>
                <li>Insurance premium · broker estimate · source pending</li>
              </ul>
            </StudioCard>
          ),
          grid: (
            <div className="metric-grid">
              <MetricCard
                label="Files staged"
                value={String(mockUploadFiles.length)}
                detail="Candidate set"
              />
              <MetricCard
                label="Blocked fields"
                value="1"
                detail="Unit count conflict"
                icon="block"
              />
              <MetricCard label="Reviewed fields" value="2" detail="Ready for assumption use" />
            </div>
          ),
        }}
      />
      <EvidenceConflictResolverModal
        isOpen={conflictOpen}
        onClose={() => setConflictOpen(false)}
        options={UNIT_CONFLICT_OPTIONS}
        onConfirm={(summary) => {
          pushToast(`Mock conflict resolution recorded: ${summary}`, 'warning');
        }}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="data-review" />
    </div>
  );
}

function NormalizationCandidateCard({
  onResolveConflict,
  dealId,
}: {
  onResolveConflict: () => void;
  dealId: string;
}): ReactElement {
  return (
    <StudioCard title="Candidate Normalization" className="wide-card">
      <DataTable
        caption="Rent roll and T12 normalized candidate fields"
        headers={['Field', 'Extracted', 'Normalized', 'Source', 'Confidence', 'Posture']}
        rows={[
          [
            'Unit count',
            '194 / 196 conflict',
            '195 held',
            'OM + Rent roll',
            'Medium',
            <TrustBadge state="Blocked" />,
          ],
          [
            'T12 revenue',
            '$7.52M',
            '$7.52M',
            'T12 page 1',
            'High',
            <TrustBadge state="Reviewed" />,
          ],
          [
            'Property taxes',
            '$315k',
            '$315k',
            'County tax record',
            'High',
            <TrustBadge state="Reviewed" />,
          ],
          [
            'Insurance premium',
            '$185k estimate',
            '$185k',
            'Broker estimate',
            'Low',
            <TrustBadge state="Source pending" />,
          ],
        ]}
      />
      <StickyActionBar>
        <button type="button" className="btn btn-secondary" onClick={onResolveConflict}>
          Resolve Unit Count Conflict
        </button>
        <PrototypeActionLink
          to={studioDealPath(dealId, 'underwriting-sources')}
          className="btn btn-secondary"
          feature="Review normalization evidence"
        >
          Open assumption source trace
        </PrototypeActionLink>
        <button
          type="button"
          className="btn btn-secondary"
          disabled
          aria-describedby="promote-blocked"
        >
          Promote to Assumptions
        </button>
        <span className="sr-only" id="promote-blocked">
          Promotion is disabled until conflicts clear and reviewer gates pass.
        </span>
      </StickyActionBar>
    </StudioCard>
  );
}

export function StudioDebtPanelPage(): ReactElement {
  const deal = useStudioDeal();
  const assumptions =
    underwritingAssumptionsByDeal[deal?.id ?? ''] ??
    underwritingAssumptionsByDeal['riverside-flats'];
  const metrics = calculateUnderwritingMetrics(assumptions);
  const [quoteOpen, setQuoteOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Debt / lender quote panel"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <PageTitle
        eyebrow="Debt posture"
        title="Debt / lender quote panel"
        lede="Track DSCR, LTV, debt yield, and source-pending lender quote gates."
      />
      <NonProductionCallout>
        Lender quote capture is mock-only. No files, providers, storage, or borrower data are used.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Lock assumptions"
        prerequisite="A lender quote is missing and DSCR remains source pending."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting')}
        resolveLabel="Go to Underwriting"
      />
      <div className="metric-grid four">
        <MetricCard
          label="DSCR"
          value={formatMultiple(metrics.dscr)}
          detail="Source pending"
          icon="warning"
        />
        <MetricCard label="LTV" value={formatPercent(assumptions.ltv)} detail="Mock lender case" />
        <MetricCard
          label="Debt amount"
          value={formatCurrency(metrics.debtAmount)}
          detail="Formula-backed"
        />
        <MetricCard
          label="Annual debt service"
          value={formatCurrency(metrics.annualDebtService)}
          detail="Quote pending"
          icon="pending"
        />
      </div>
      <div className="dashboard-grid">
        <StudioCard title="Lender Quote Gate" className="wide-card">
          <div className="blocked-panel">
            <strong>Lender quote missing</strong>
            <p>
              DSCR and debt yield remain advisory until a reviewed term sheet or lender quote is
              attached as candidate evidence.
            </p>
          </div>
          <EvidenceTraceList
            items={ASSUMPTION_TRACE_ITEMS.filter((item) => item.id === 'debt-service')}
          />
          <button type="button" className="btn btn-primary" onClick={() => setQuoteOpen(true)}>
            Add Mock Lender Quote
          </button>
        </StudioCard>
        <StudioCard title="Debt Assumptions">
          <DataTable
            caption="Debt assumptions"
            headers={['Assumption', 'Value', 'Posture']}
            rows={[
              [
                'Interest rate',
                formatPercent(assumptions.interestRate),
                <TrustBadge state="Source pending" />,
              ],
              [
                'Amortization',
                `${assumptions.amortizationYears} years`,
                <TrustBadge state="Model-inferred" />,
              ],
              [
                'Loan-to-value',
                formatPercent(assumptions.ltv),
                <TrustBadge state="Candidate evidence" />,
              ],
            ]}
          />
        </StudioCard>
      </div>
      <WorkstationDrawer
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        title="Add mock lender quote"
        footer={
          <PrototypeActionButton
            feature="Save lender quote candidate evidence"
            className="btn btn-primary"
          >
            Save Candidate Quote
          </PrototypeActionButton>
        }
      >
        <label className="form-field">
          Lender
          <input defaultValue="Regional Bank term sheet (mock)" />
        </label>
        <label className="form-field">
          Rate
          <input defaultValue="6.75%" />
        </label>
        <label className="form-field">
          Term
          <input defaultValue="5 years fixed, 30-year amortization" />
        </label>
        <p className="muted">
          Saving creates candidate evidence only and does not upload, store, or send files.
        </p>
      </WorkstationDrawer>
      <ContextualSurfaceTriggers dealId={deal.id} route="debt" />
    </div>
  );
}

export function StudioValuationVersionTimelinePage(): ReactElement {
  const deal = useStudioDeal();
  const [selectedVersion, setSelectedVersion] = useState(VERSION_SNAPSHOTS[0]);
  const propertyId = getLinkedPropertyId(deal?.id) ?? 'demo-001';
  const valuationVersion = getValuationVersionForActor({
    actor: fixtureActors.orgAdmin,
    propertyId,
  });
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Valuation snapshots"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <DealWorkflowTabs deal={deal} />
      <PageTitle
        eyebrow="Snapshot governance"
        title="Valuation snapshots"
        lede="Working scenarios stay editable. A valuation snapshot locks one scenario with evidence refs, comp set, as-of dates, and export posture."
      />
      <MockBoundaryBanner variant="snapshot" />
      <StudioCard title="Scenario to snapshot model" eyebrow="Governance language">
        <p>
          Use <strong>Scenarios</strong> to compare assumption presets and sensitivity output. When
          gates clear, promote one scenario into a <strong>valuation snapshot</strong> that carries
          evidence refs, comp set, and export eligibility — without implying immutable storage in
          this prototype.
        </p>
        <div className="studio-actions">
          <Link to={studioDealPath(deal.id, 'scenarios')} className="btn btn-secondary">
            Compare scenarios
          </Link>
        </div>
      </StudioCard>
      <NonProductionCallout>
        Snapshot history is a mock governance projection. Immutable storage and receipts remain
        runtime gated.
      </NonProductionCallout>
      <GateResolutionCallout
        action="Export governed report"
        prerequisite="Export remains blocked until section review, source rights, and snapshot lock clear."
        owner="An analyst"
        resolveTo={studioReportPath(deal.id)}
        resolveLabel="Review report gates"
      />
      <StudioCard title="Export eligibility">
        <ValuationReadinessRail
          evaluation={valuationVersion.readiness}
          orientation="vertical"
          heading="Version export posture"
        />
        <p className="muted">
          Evidence snapshot {valuationVersion.evidenceSnapshot.id} ·{' '}
          {valuationVersion.evidenceSnapshot.manifestHash}
        </p>
        <div className="studio-actions">
          <PrototypeActionLink
            to={studioReportPath(deal.id)}
            className="btn btn-secondary"
            feature="Review report gates"
          >
            Review Report Gates
          </PrototypeActionLink>
          <PrototypeActionLink
            to={studioDealPath(deal.id, 'ic-packet')}
            className="btn btn-secondary"
            feature="Open IC packet"
          >
            Open IC Packet
          </PrototypeActionLink>
        </div>
      </StudioCard>
      <div className="split-workstation-grid">
        <StudioCard title="Timeline" className="wide-card">
          <div className="version-timeline">
            {VERSION_SNAPSHOTS.map((version) => (
              <button
                key={version.id}
                type="button"
                className={
                  selectedVersion.id === version.id ? 'version-card active' : 'version-card'
                }
                onClick={() => setSelectedVersion(version)}
              >
                <span>{version.id}</span>
                <strong>{version.label}</strong>
                <small>
                  {version.createdAt} · {version.actor}
                </small>
                <TrustBadge state={version.current ? 'Reviewed' : 'Candidate evidence'} />
              </button>
            ))}
          </div>
        </StudioCard>
        <StudioCard title="Selected Version Details">
          <EvidenceValueCard
            item={{
              id: selectedVersion.id,
              label: selectedVersion.label,
              value: selectedVersion.id,
              posture: selectedVersion.current ? 'Reviewed' : 'Candidate evidence',
              sourceRef: selectedVersion.evidenceRef,
              asOf: selectedVersion.createdAt,
              confidence: selectedVersion.current ? 'High' : 'Medium',
              detail: `${selectedVersion.scenarioSet}. Gate status: ${selectedVersion.gateStatus}.`,
            }}
          />
          <DataTable
            caption="Version deltas"
            headers={['Delta', 'Detail']}
            rows={[
              ['Cap rate adjust', '5.25% to 5.50%'],
              ['Scenario added', selectedVersion.scenarioSet],
              ['Excluded candidate', 'OM_Draft_v1.pdf superseded'],
            ]}
          />
          <PrototypeActionLink
            to={studioReportPath(deal.id)}
            className="btn btn-primary"
            feature="Create report draft"
          >
            Create Report Draft
          </PrototypeActionLink>
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            aria-describedby="version-lock-blocked"
          >
            Lock Version
          </button>
          <span className="sr-only" id="version-lock-blocked">
            Version lock disabled until all underwriting gates pass in mock state.
          </span>
        </StudioCard>
      </div>
      <ContextualSurfaceTriggers dealId={deal.id} route="versions" />
    </div>
  );
}
