import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';

export function GateResolutionCallout({
  action,
  prerequisite,
  owner,
  resolveTo,
  resolveLabel,
}: {
  action: string;
  prerequisite: string;
  owner: string;
  resolveTo: string;
  resolveLabel: string;
}): ReactElement {
  return (
    <aside className="gate-resolution-callout" role="note">
      <MaterialIcon name="block" />
      <div>
        <strong>{action} is blocked</strong>
        <p>
          {prerequisite} {owner} should resolve this next.
        </p>
        <Link to={resolveTo} className="btn btn-secondary">
          {resolveLabel}
        </Link>
      </div>
    </aside>
  );
}
