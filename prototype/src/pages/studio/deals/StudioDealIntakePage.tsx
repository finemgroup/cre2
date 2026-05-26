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
