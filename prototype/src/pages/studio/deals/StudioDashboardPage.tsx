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
