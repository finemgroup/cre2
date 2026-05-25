import type { ReactElement } from 'react';

export type AuthorityLabel =
  | 'public-baseline'
  | 'user-submission'
  | 'candidate-evidence'
  | 'reviewed'
  | 'unreviewed'
  | 'blocked'
  | 'model-inferred'
  | 'advisory'
  | 'source-pending'
  | 'reviewer-required'
  | 'approved-private-use'
  | 'approved-public-projection'
  | 'approximate-centroid'
  | 'sample-map-data'
  | 'not-legal-boundary';

const LABELS: Record<AuthorityLabel, string> = {
  'public-baseline': 'Public baseline',
  'user-submission': 'User submission',
  'candidate-evidence': 'Candidate evidence only',
  reviewed: 'Reviewed',
  unreviewed: 'Unreviewed',
  blocked: 'Blocked',
  'model-inferred': 'Model-inferred',
  advisory: 'Advisory',
  'source-pending': 'Source pending',
  'reviewer-required': 'Reviewer required',
  'approved-private-use': 'Approved private-use',
  'approved-public-projection': 'Approved public projection',
  'approximate-centroid': 'Approximate centroid',
  'sample-map-data': 'Sample map data',
  'not-legal-boundary': 'Not legal boundary',
};

type AuthorityBadgeProps = {
  label: AuthorityLabel;
};

export function AuthorityBadge({ label }: AuthorityBadgeProps): ReactElement {
  return (
    <span className={`badge badge-${label}`} aria-label={`Authority state: ${LABELS[label]}`}>
      {LABELS[label]}
    </span>
  );
}
