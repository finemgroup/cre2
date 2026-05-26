import { useState, type ReactElement } from 'react';

import {
  DataTable,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StatusBadge,
  StickyActionBar,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  EvidenceConflictResolverModal,
  IntakeWorkflowNav,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { mockUploadFiles } from '@/lib/staged-import';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

import { UNIT_CONFLICT_OPTIONS } from './deal-route-shared';

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
