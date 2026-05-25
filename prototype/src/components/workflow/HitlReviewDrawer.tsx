import { useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { DataTable, StatusBadge, TrustBadge } from '@/components/studio/StudioPrimitives';
import { ReviewerAssignmentDrawer } from '@/components/workstation/ReviewerAssignmentDrawer';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { HitlTrustTierBadge } from '@/components/workflow/HitlTrustTierBadge';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getReviewQueue } from '@/lib/runtime/review-queue';
import { studioDealPath } from '@/data/studio';
import {
  getContextualReviewAssignments,
  type ReviewAssignment,
} from '@/lib/workflow/review-assignments';

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
  const assignments = useMemo(() => getContextualReviewAssignments(), []);

  return (
    <>
      <SophexSheet isOpen={isOpen} onClose={onClose} label="Analyst review queue">
        <p className="studio-eyebrow">Internal-only HITL projection</p>
        <h2>Analyst review queue</h2>
        <MockBoundaryBanner variant="review" />
        <p className="muted">
          Reviewer assignments recommend readiness only. Queue completion is not promotion
          authority.
        </p>
        <DataTable
          caption="Assigned reviews"
          headers={['Field', 'Assignee', 'Posture', 'Escalation', 'Action']}
          rows={assignments.map((assignment) => [
            assignment.field,
            assignment.assignee,
            <TrustBadge key={`${assignment.id}-posture`} state={assignment.posture} />,
            <HitlTrustTierBadge
              key={`${assignment.id}-tier`}
              tier={assignment.confidenceAssessment.trustTier}
            />,
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
        <Link
          to={studioDealPath(dealId, 'hitl-review')}
          className="btn btn-primary"
          onClick={onClose}
        >
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
