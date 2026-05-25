import { useState, type ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { DataTable, StatusBadge, TrustBadge } from '@/components/studio/StudioPrimitives';
import {
  HitlTrustTierBadge,
  type HitlTrustTier,
} from '@/components/workflow/HitlTrustTierBadge';

export type ReviewAssignment = {
  id: string;
  field: string;
  reason: string;
  assignee: string;
  queueState: string;
  posture: string;
  trustTier: HitlTrustTier;
};

export function ReviewerAssignmentDrawer({
  isOpen,
  onClose,
  assignment,
}: {
  isOpen: boolean;
  onClose: () => void;
  assignment: ReviewAssignment | null;
}): ReactElement {
  const [note, setNote] = useState('');

  return (
    <SophexSheet isOpen={isOpen} onClose={onClose} label="Reviewer assignment detail">
      {assignment ? (
        <>
          <p className="studio-eyebrow">Internal-only HITL projection</p>
          <h2>{assignment.field}</h2>
          <div className="tag-row">
            <TrustBadge state={assignment.posture} />
            <HitlTrustTierBadge tier={assignment.trustTier} />
          </div>
          <p>{assignment.reason}</p>
          <DataTable
            caption="Assignment detail"
            headers={['Field', 'Value']}
            rows={[
              ['Assignee', assignment.assignee],
              ['Queue state', assignment.queueState],
              ['Trust tier', assignment.trustTier],
              ['Authority', 'Reviewer decision required — queue completion is not promotion'],
            ]}
          />
          <label>
            Reviewer note (mock)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Record rationale before recommend/hold/approve."
            />
          </label>
          <div className="modal-actions">
            <PrototypeActionButton feature="Recommend review action" className="btn btn-secondary">
              Recommend
            </PrototypeActionButton>
            <PrototypeActionButton feature="Hold review item" className="btn btn-secondary">
              Hold
            </PrototypeActionButton>
            <button type="button" className="btn btn-primary" disabled aria-describedby="hitl-no-promote">
              Approve for export
            </button>
            <span className="sr-only" id="hitl-no-promote">
              Approval is disabled in prototype. HITL actions do not persist truth.
            </span>
          </div>
        </>
      ) : (
        <StatusBadge status="No assignment selected" />
      )}
    </SophexSheet>
  );
}
