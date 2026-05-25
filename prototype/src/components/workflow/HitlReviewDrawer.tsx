import { useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { DataTable, StatusBadge, TrustBadge } from '@/components/studio/StudioPrimitives';
import {
  ReviewerAssignmentDrawer,
  type ReviewAssignment,
} from '@/components/workstation/ReviewerAssignmentDrawer';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import { studioDealPath } from '@/data/studio';

const MOCK_ASSIGNMENTS: ReviewAssignment[] = [
  {
    id: 'assign-unit-count',
    field: 'Unit count conflict',
    reason: 'OM and rent roll disagree; export blocked until resolved.',
    assignee: 'Sarah Jenkins (VP)',
    queueState: 'Assigned',
    posture: 'Blocked',
    trustTier: 'BLOCK',
  },
  {
    id: 'assign-lender-quote',
    field: 'Lender quote missing',
    reason: 'DSCR gate requires term sheet citation.',
    assignee: 'Mike Chen (Analyst)',
    queueState: 'Queued',
    posture: 'Source pending',
    trustTier: 'HITL',
  },
];

export function HitlReviewDrawer({
  dealId,
  isOpen,
  onClose,
}: {
  dealId: string;
  isOpen: boolean;
  onClose: () => void;
}): ReactElement {
  const [selected, setSelected] = useState<ReviewAssignment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const queue = useMemo(() => getReviewQueue(fixtureActors.internalOperator), []);

  return (
    <>
      <SophexSheet isOpen={isOpen} onClose={onClose} label="Analyst review queue">
        <p className="studio-eyebrow">Internal-only HITL projection</p>
        <h2>Analyst review queue</h2>
        <MockBoundaryBanner variant="review" />
        <p className="muted">
          Reviewer assignments recommend readiness only. Queue completion is not promotion authority.
        </p>
        <DataTable
          caption="Assigned reviews"
          headers={['Field', 'Assignee', 'Posture', 'Action']}
          rows={MOCK_ASSIGNMENTS.map((assignment) => [
            assignment.field,
            assignment.assignee,
            <TrustBadge key={`${assignment.id}-posture`} state={assignment.posture} />,
            <button
              key={`${assignment.id}-action`}
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSelected(assignment);
                setDetailOpen(true);
              }}
            >
              Open assignment
            </button>,
          ])}
        />
        <StatusBadge status={`${queue.length} operator queue items`} />
        <Link to={studioDealPath(dealId, 'hitl-review')} className="btn btn-primary" onClick={onClose}>
          Open full analyst review route
        </Link>
      </SophexSheet>
      <ReviewerAssignmentDrawer
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        assignment={selected}
      />
    </>
  );
}
