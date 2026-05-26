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
