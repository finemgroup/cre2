import type { ReactElement } from 'react';

import { DataTable, MaterialIcon, StatusBadge, StudioCard, TrustBadge } from '@/components/studio/StudioPrimitives';
import type { CandidateField, MockUploadFile } from '@/lib/staged-import';

export function StagedImportReviewPanel({
  files,
  candidates,
}: {
  files: MockUploadFile[];
  candidates: CandidateField[];
}): ReactElement {
  const issueCount = candidates.filter((candidate) => candidate.issue).length + files.filter((file) => file.issue).length;

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
        <button type="button" className="btn btn-secondary">Reject selected</button>
        <button type="button" className="btn btn-primary" disabled>Promote after review</button>
      </div>
    </StudioCard>
  );
}
