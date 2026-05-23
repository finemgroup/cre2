import type { ReactElement } from 'react';

export type AuthorityLabel =
  | 'public-baseline'
  | 'user-submission'
  | 'candidate-evidence'
  | 'reviewed'
  | 'unreviewed'
  | 'blocked'
  | 'model-inferred';

const LABELS: Record<AuthorityLabel, string> = {
  'public-baseline': 'Public baseline',
  'user-submission': 'User submission',
  'candidate-evidence': 'Candidate evidence only',
  reviewed: 'Reviewed',
  unreviewed: 'Unreviewed',
  blocked: 'Blocked',
  'model-inferred': 'Model-inferred',
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
