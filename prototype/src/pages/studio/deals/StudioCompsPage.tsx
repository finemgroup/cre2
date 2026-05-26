// @ts-nocheck
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
  SegmentedControl,
  TabPanelSwitch,
  StudioDealNotFound,
  useStudioDeal,
} from '@/pages/studio/StudioShared';

import {
  DEAL_DOCUMENT_EVIDENCE,
  ASSUMPTION_TRACE_ITEMS,
  UNIT_CONFLICT_OPTIONS,
  VERSION_SNAPSHOTS,
  READINESS_ITEMS,
} from './deal-route-shared';

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
          <TabPanelSwitch panelKey={view}>
            {view === 'map' ? (
              <div className="mock-map map-hud-panel">
                <MaterialIcon name="map" />
                Sample map view. No precise public markers in MVP0.
              </div>
            ) : (
              <DataTable
                dense
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
          </TabPanelSwitch>
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
