import type { ReactElement, ReactNode } from 'react';

import { MaterialIcon, StatusBadge, StudioCard, TrustBadge } from '@/components/studio/StudioPrimitives';
import { summarizeSourceBundle, type SourceCitation as Citation, type SourceEvidenceBlock } from '@/lib/source-bundle';

export function SourceCitation({ citation }: { citation: Citation }): ReactElement {
  return (
    <span className="source-citation">
      <MaterialIcon name="link" />
      {citation.label}
      {citation.page ? ` p.${citation.page}` : ''}
      <small>{citation.confidence}</small>
    </span>
  );
}

export function ProvenanceCell({
  value,
  citation,
  state,
}: {
  value: ReactNode;
  citation: Citation;
  state?: string;
}): ReactElement {
  return (
    <div className="provenance-cell">
      <strong>{value}</strong>
      <SourceCitation citation={citation} />
      {state ? <TrustBadge state={state} /> : null}
    </div>
  );
}

export function SourceEvidenceBlockCard({ block }: { block: SourceEvidenceBlock }): ReactElement {
  return (
    <StudioCard title={block.title} actions={<StatusBadge status={block.posture} />}>
      <p>{block.notes}</p>
      <div className="citation-list">
        {block.citations.map((citation) => (
          <SourceCitation key={citation.id} citation={citation} />
        ))}
      </div>
      {block.missingCitations?.length ? (
        <div className="source-alert" role="alert">
          <MaterialIcon name="warning" />
          <span>{block.missingCitations.join(' ')}</span>
        </div>
      ) : null}
    </StudioCard>
  );
}

export function ReviewPostureBanner({ blocks }: { blocks: SourceEvidenceBlock[] }): ReactElement {
  const summary = summarizeSourceBundle(blocks);
  return (
    <aside className={`review-posture review-${summary.posture}`} role="status">
      <MaterialIcon name={summary.posture === 'ready' ? 'verified' : 'gpp_maybe'} />
      <div>
        <strong>Source bundle posture: {summary.posture}</strong>
        <span>{summary.citationCount} citations · {summary.warnings.length} warnings</span>
        {summary.blockedActions.length ? <small>Blocked: {summary.blockedActions.join(', ')}</small> : null}
      </div>
    </aside>
  );
}
