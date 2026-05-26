import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  DataTable,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { AiTaskPulse } from '@/components/workflow/AiTaskPulse';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import {
  EvidenceConflictResolverModal,
  EvidenceTraceList,
  EvidenceValueCard,
  IntakeWorkflowNav,
  type EvidenceTraceItem,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { summarizeEvidenceTracePosture } from '@/lib/evidence/trace-posture';
import { getStudioSourceTraceView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

export function StudioAssumptionSourceTracePage(): ReactElement {
  const { dealId } = useParams();
  const traceState = useRuntimeResource(
    () => runtimeServices.studio.getSourceTrace(dealId),
    `source-trace-${dealId ?? 'missing'}`,
    getStudioSourceTraceView(dealId)
  );
  const traceView = traceState.value;
  const deal = traceView?.deal;
  const traceItems = traceView?.traceItems ?? [];
  const conflictOptions = traceView?.conflictOptions ?? [];
  const sourceBlocks = traceView?.sourceBlocks ?? [];
  const tracePosture = summarizeEvidenceTracePosture(traceItems);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceTraceItem | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const { pushToast } = usePrototypeToast();
  const activeEvidence = selectedEvidence ?? traceItems[0] ?? null;

  if (!deal && !traceState.loading) return <StudioDealNotFound />;

  return (
    <div>
      {deal ? (
        <WorkflowContextHeader
          dealName={deal.name}
          stage="Assumption source trace"
          returnTo={studioDealPath(deal.id, 'underwriting')}
          returnLabel="Return to cockpit"
        />
      ) : null}
      <IntakeWorkflowNav dealId={deal?.id ?? dealId ?? ''} activeStep="source-trace" />
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
      <RuntimeResourceStatus
        loading={traceState.loading}
        error={traceState.error}
        variant="studio-deal"
      />
      {deal && !traceState.loading ? (
        <>
          <ReviewPostureBanner blocks={sourceBlocks} />
          {traceItems.length > 0 ? (
            <div className="proof-strip" aria-label="Assumption trace posture">
              {[
                [tracePosture.reviewed, 'Reviewed assumptions'],
                [tracePosture.open, 'Open posture items'],
                [tracePosture.total, 'Total trace rows'],
              ].map(([value, label]) => (
                <article key={String(label)}>
                  <strong className="fin-value">{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          ) : null}
          <GateResolutionCallout
            action="Promote cleared assumptions"
            prerequisite="Unit count conflict remains blocked until reviewer resolution."
            owner="An analyst"
            resolveTo={studioDealPath(deal.id, 'data-review')}
            resolveLabel="Open normalization workbench"
          />
          <div className="studio-actions" aria-label="Evidence workflow handoffs">
            <PrototypeActionLink
              to={studioDealPath(deal.id, 'intake')}
              className="btn btn-secondary"
              feature="Return to deal intake"
            >
              Return to intake
            </PrototypeActionLink>
            <PrototypeActionLink
              to={studioDealPath(deal.id, 'data-review')}
              className="btn btn-secondary"
              feature="Open normalization workbench"
            >
              Open data review
            </PrototypeActionLink>
            <PrototypeActionLink
              to={studioDealPath(deal.id, 'underwriting-debt')}
              className="btn btn-secondary"
              feature="Open debt quote panel"
            >
              Open debt panel
            </PrototypeActionLink>
          </div>
          {traceItems.length === 0 ? (
            <EmptyStateCard
              icon="account_tree"
              title="No assumption trace rows returned"
              description="The studio runtime adapter returned an empty source trace. Underwriting gates remain blocked until assumption lineage is available."
              tone="warning"
              actions={
                <Link to={studioDealPath(deal.id, 'data-review')} className="btn btn-secondary">
                  Open normalization workbench
                </Link>
              }
            />
          ) : (
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
                        rows={traceItems.map((item) => [
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
                        getRowKey={(_row, index) => traceItems[index].id}
                      />
                    </StudioCard>
                    <StudioCard title="Selected Evidence Detail">
                      {activeEvidence ? (
                        <EvidenceValueCard item={activeEvidence} />
                      ) : (
                        <p className="muted">Select an assumption row to inspect source posture.</p>
                      )}
                      <EvidenceTraceList
                        items={traceItems.filter((item) => item.id !== activeEvidence?.id)}
                        onInspect={setSelectedEvidence}
                      />
                    </StudioCard>
                  </div>
                ),
                list: (
                  <StudioCard title="Blocker-focused list">
                    <EvidenceTraceList items={traceItems} onInspect={setSelectedEvidence} />
                  </StudioCard>
                ),
                grid: (
                  <div className="dashboard-grid">
                    {traceItems.slice(0, 4).map((item) => (
                      <EvidenceValueCard key={item.id} item={item} />
                    ))}
                  </div>
                ),
              }}
            />
          )}
          <ContextualSurfaceTriggers dealId={deal.id} route="source-trace" />
          <EvidenceConflictResolverModal
            isOpen={conflictOpen}
            onClose={() => setConflictOpen(false)}
            options={conflictOptions}
            onConfirm={(reason) =>
              pushToast(`Conflict resolution captured for review: ${reason}`, 'warning')
            }
          />
        </>
      ) : null}
    </div>
  );
}
