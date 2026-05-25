import type { ReactElement } from 'react';

import {
  getPublicAuthorityLabel,
  type AuthorityPosture,
} from '@/lib/authority/authority-vocabulary';

export type AuthorityLabel = AuthorityPosture;

type AuthorityBadgeProps = {
  label: AuthorityLabel;
};

export function AuthorityBadge({ label }: AuthorityBadgeProps): ReactElement {
  const text = getPublicAuthorityLabel(label);
  return (
    <span className={`badge badge-${label}`} aria-label={`Authority state: ${text}`}>
      {text}
    </span>
  );
}
