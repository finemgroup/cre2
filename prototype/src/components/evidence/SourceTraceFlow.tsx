import type { ReactElement } from 'react';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';

type CitationRow = {
  id: string;
  title: string;
  meta: string;
  excerpt: string;
  blocksExport: boolean;
};

type SourceTraceFlowProps = {
  rows: readonly CitationRow[];
  expandedId: string | null;
  reviewedIds: readonly string[];
  onToggleExpand: (id: string) => void;
  onToggleReviewed: (id: string) => void;
};

function parseTargetField(meta: string): string {
  const parts = meta.split('·').map((part) => part.trim());
  return parts[1] ?? parts[0] ?? 'Target field';
}

function parseSourceRef(title: string, meta: string): string {
  const parts = meta.split('·').map((part) => part.trim());
  return `${title} · ${parts[0] ?? 'Fixture source'} · p. 12`;
}

export function SourceTraceFlow({
  rows,
  expandedId,
  reviewedIds,
  onToggleExpand,
  onToggleReviewed,
}: SourceTraceFlowProps): ReactElement {
  return (
    <div className="source-trace-flow" aria-label="Source traceability flow">
      {rows.map((row) => {
        const expanded = expandedId === row.id;
        const reviewed = reviewedIds.includes(row.id);
        const targetField = parseTargetField(row.meta);
        return (
          <article key={row.id} className="source-trace-step card">
            <div className="source-trace-step__header">
              <p className="micro-label">Target field</p>
              <h3>{targetField}</h3>
            </div>
            <div className="source-trace-step__observation">
              <p className="micro-label">Extracted observation</p>
              <p>{row.excerpt}</p>
              <AuthorityBadge label={row.blocksExport ? 'blocked' : 'public-baseline'} />
            </div>
            <div className="source-trace-step__document">
              <p className="micro-label">Evidence document</p>
              <div className="source-trace-document-card">
                <strong>{row.title}</strong>
                <span>{parseSourceRef(row.title, row.meta)}</span>
                <span className="muted">As-of 2024-09-30 · Source rights: fixture posture</span>
                <button type="button" className="btn btn-ghost" disabled>
                  View original document (prototype)
                </button>
              </div>
            </div>
            <div className="source-trace-step__actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onToggleExpand(row.id)}
              >
                {expanded ? 'Hide detail' : 'Expand citation detail'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onToggleReviewed(row.id)}
              >
                {reviewed ? 'Unmark citation (prototype)' : 'Mark citation reviewed (prototype)'}
              </button>
            </div>
            {expanded ? (
              <p className="muted">Prototype-only; does not clear export gates.</p>
            ) : null}
            {reviewed ? (
              <p className="warning">Reviewed in local state only. Export remains gated.</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
