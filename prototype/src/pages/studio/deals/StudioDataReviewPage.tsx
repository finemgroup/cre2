import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

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
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  EvidenceConflictResolverModal,
  IntakeWorkflowNav,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { summarizeNormalizationPosture } from '@/lib/evidence/normalization-posture';
import type { NormalizationCandidateRow } from '@/lib/staged-import';
import { getStudioDataReviewView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

export function StudioDataReviewPage(): ReactElement {
  const { dealId } = useParams();
  const reviewState = useRuntimeResource(
    () => runtimeServices.studio.getDataReview(dealId),
    `data-review-${dealId ?? 'missing'}`,
    getStudioDataReviewView(dealId)
  );
  const reviewView = reviewState.value;
  const deal = reviewView?.deal;
  const uploadFiles = reviewView?.uploadFiles ?? [];
  const normalizationRows = reviewView?.normalizationRows ?? [];
  const conflictOptions = reviewView?.conflictOptions ?? [];
  const sourceBlocks = reviewView?.sourceBlocks ?? [];
  const normalizationPosture = summarizeNormalizationPosture(normalizationRows);
  const [conflictOpen, setConflictOpen] = useState(false);
  const { pushToast } = usePrototypeToast();

  if (!deal && !reviewState.loading) return <StudioDealNotFound />;

  return (
    <div>
      {deal ? (
        <WorkflowContextHeader
          dealName={deal.name}
          stage="Rent roll / T12 normalization"
          returnTo={studioDealPath(deal.id, 'intake')}
          returnLabel="Return to intake"
        />
      ) : null}
      <IntakeWorkflowNav dealId={deal?.id ?? dealId ?? ''} activeStep="data-review" />
      <PageTitle
        eyebrow="Evidence review"
        title="Rent roll / T12 normalization"
        lede="Compare extracted fields against normalized candidate values before promotion to assumptions."
      />
      <NonProductionCallout>
        Normalization rows are candidate-only mock evidence until analyst and reviewer gates clear.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <RuntimeResourceStatus
        loading={reviewState.loading}
        error={reviewState.error}
        variant="studio-deal"
      />
      {deal && !reviewState.loading ? (
        <>
          <ReviewPostureBanner blocks={sourceBlocks} />
          {normalizationRows.length > 0 ? (
            <div className="proof-strip" aria-label="Normalization posture">
              {[
                [normalizationPosture.reviewed, 'Reviewed fields'],
                [normalizationPosture.blocked, 'Blocked fields'],
                [uploadFiles.length, 'Staged files'],
                [normalizationPosture.total, 'Candidate rows'],
              ].map(([value, label]) => (
                <article key={String(label)}>
                  <strong className="fin-value">{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          ) : null}
          <GateResolutionCallout
            action="Promote normalized fields to assumptions"
            prerequisite="Unit count conflict between OM and rent roll remains unresolved."
            owner="An analyst"
            resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
            resolveLabel="Open source trace"
          />
          {uploadFiles.length === 0 && normalizationRows.length === 0 ? (
            <EmptyStateCard
              icon="folder_open"
              title="No normalization data returned"
              description="The studio runtime adapter returned no staged files or candidate rows. Evidence review remains blocked until intake completes."
              tone="warning"
              actions={
                <Link to={studioDealPath(deal.id, 'intake')} className="btn btn-secondary">
                  Return to intake
                </Link>
              }
            />
          ) : (
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
              secondaryControls={
                <StatusBadge
                  status={
                    normalizationPosture.blocked > 0
                      ? `${normalizationPosture.blocked} blocked candidate`
                      : 'Candidates ready for review'
                  }
                />
              }
              views={{
                table: (
                  <div className="dashboard-grid">
                    <StudioCard title="Source Files">
                      {uploadFiles.length === 0 ? (
                        <p className="muted">No staged source files returned from the adapter.</p>
                      ) : (
                        <DataTable
                          caption="Normalization source files"
                          headers={['File', 'Type', 'State', 'Issue']}
                          rows={uploadFiles.map((file) => [
                            file.name,
                            file.type,
                            <StatusBadge status={file.status} />,
                            file.issue ?? 'No blocking issue',
                          ])}
                          getRowKey={(_row, index) => uploadFiles[index].id}
                        />
                      )}
                    </StudioCard>
                    <NormalizationCandidateCard
                      rows={normalizationRows}
                      onResolveConflict={() => setConflictOpen(true)}
                      dealId={deal.id}
                    />
                  </div>
                ),
                list: (
                  <StudioCard title="Candidate blocker list">
                    <ul className="governance-list">
                      {normalizationRows.map((row) => (
                        <li key={row.id}>
                          {row.field} · {row.extracted} · {row.posture.toLowerCase()} posture
                        </li>
                      ))}
                    </ul>
                  </StudioCard>
                ),
                grid: (
                  <div className="metric-grid">
                    <MetricCard
                      label="Files staged"
                      value={String(uploadFiles.length)}
                      detail="Candidate set"
                    />
                    <MetricCard
                      label="Blocked fields"
                      value={String(normalizationPosture.blocked)}
                      detail="Reviewer resolution required"
                      icon={normalizationPosture.blocked > 0 ? 'block' : undefined}
                    />
                    <MetricCard
                      label="Reviewed fields"
                      value={String(normalizationPosture.reviewed)}
                      detail="Ready for assumption use"
                    />
                  </div>
                ),
              }}
            />
          )}
          <EvidenceConflictResolverModal
            isOpen={conflictOpen}
            onClose={() => setConflictOpen(false)}
            options={conflictOptions}
            onConfirm={(summary) => {
              pushToast(`Mock conflict resolution recorded: ${summary}`, 'warning');
            }}
          />
          <ContextualSurfaceTriggers dealId={deal.id} route="data-review" />
        </>
      ) : null}
    </div>
  );
}

function NormalizationCandidateCard({
  rows,
  onResolveConflict,
  dealId,
}: {
  rows: NormalizationCandidateRow[];
  onResolveConflict: () => void;
  dealId: string;
}): ReactElement {
  return (
    <StudioCard title="Candidate Normalization" className="wide-card">
      {rows.length === 0 ? (
        <EmptyStateCard
          icon="table_rows"
          title="No normalization candidates"
          description="The adapter returned no candidate rows for this deal. Promotion to assumptions remains blocked."
          tone="warning"
        />
      ) : (
        <DataTable
          caption="Rent roll and T12 normalized candidate fields"
          headers={['Field', 'Extracted', 'Normalized', 'Source', 'Confidence', 'Posture']}
          rows={rows.map((row) => [
            row.field,
            row.extracted,
            row.normalized,
            row.source,
            row.confidence,
            <TrustBadge state={row.posture} />,
          ])}
          getRowKey={(_row, index) => rows[index].id}
        />
      )}
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
        <PrototypeActionLink
          to={studioDealPath(dealId, 'underwriting-debt')}
          className="btn btn-secondary"
          feature="Review debt quote gate"
        >
          Open debt quote panel
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
