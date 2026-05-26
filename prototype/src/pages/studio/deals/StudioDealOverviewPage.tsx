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
      <ContextualSurfaceTriggers dealId={deal.id} route="overview" />
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
