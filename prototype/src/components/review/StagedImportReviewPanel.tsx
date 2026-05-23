import { useState, type ReactElement } from 'react';

import { SophexModal } from '@/components/overlays/SophexModal';
import {
  DataTable,
  MaterialIcon,
  StatusBadge,
  StudioCard,
  TrustBadge,
} from '@/components/studio/StudioPrimitives';
import type { CandidateField, MockUploadFile } from '@/lib/staged-import';

export function StagedImportReviewPanel({
  files,
  candidates,
}: {
  files: MockUploadFile[];
  candidates: CandidateField[];
}): ReactElement {
  const [reviewOpen, setReviewOpen] = useState(false);
  const issueCount =
    candidates.filter((candidate) => candidate.issue).length +
    files.filter((file) => file.issue).length;
  const flagged = candidates.filter((candidate) => candidate.issue);

  return (
    <StudioCard
      title="Candidate Evidence Review"
      eyebrow="Staged import adapted"
      actions={<StatusBadge status={`${issueCount} issues`} />}
    >
      <div className="review-summary">
        <div>
          <MaterialIcon name="rule" />
          <strong>{candidates.length} candidate fields</strong>
          <span>None are promoted to truth in the prototype.</span>
        </div>
        <TrustBadge state="Candidate evidence" />
      </div>
      <div className="upload-queue" aria-label="Reviewed upload files">
        {files.map((file) => (
          <div className="upload-file-row" key={file.id}>
            <MaterialIcon name="description" />
            <div>
              <strong>{file.name}</strong>
              <span>
                {file.type} · {file.status}
              </span>
              {file.issue ? <small role="alert">{file.issue}</small> : null}
            </div>
            <StatusBadge status={file.status} />
          </div>
        ))}
      </div>
      <DataTable
        caption="Candidate extracted fields"
        headers={['Field', 'Value', 'Source', 'Confidence', 'Issue']}
        rows={candidates.map((candidate) => [
          candidate.field,
          candidate.value,
          candidate.source,
          candidate.confidence,
          candidate.issue ?? 'None',
        ])}
        getRowKey={(_row, index) => candidates[index].field}
      />
      <div className="studio-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setReviewOpen(true)}>
          Review flagged fields
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled
          aria-describedby="promote-blocked-reason"
        >
          Promote after review
        </button>
      </div>
      <p className="muted" id="promote-blocked-reason">
        Promotion is disabled until candidate field issues are cleared by review.
      </p>
      <SophexModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        label="Candidate field review"
        size="lg"
      >
        <p>Resolve extraction conflicts before promoting candidate evidence.</p>
        <ul className="governance-list">
          {flagged.length === 0 ? (
            <li>No flagged fields in this prototype sample.</li>
          ) : (
            flagged.map((candidate) => (
              <li key={candidate.field}>
                <strong>{candidate.field}</strong>: {candidate.issue}
              </li>
            ))
          )}
        </ul>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={() => setReviewOpen(false)}>
            Mark reviewed (prototype)
          </button>
        </div>
      </SophexModal>
    </StudioCard>
  );
}
