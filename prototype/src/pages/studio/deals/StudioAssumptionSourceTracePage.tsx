import { useState, type ReactElement } from 'react';

import {
  DataTable,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
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
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

import { ASSUMPTION_TRACE_ITEMS, UNIT_CONFLICT_OPTIONS } from './deal-route-shared';

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
