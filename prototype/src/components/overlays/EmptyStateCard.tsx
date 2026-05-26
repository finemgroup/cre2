import type { ReactElement, ReactNode } from 'react';

import { MaterialIcon } from '@/components/studio/StudioPrimitives';

type EmptyStateCardProps = {
  icon?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning';
};

export function EmptyStateCard({
  icon = 'search',
  title,
  description,
  actions,
  tone = 'neutral',
}: EmptyStateCardProps): ReactElement {
  return (
    <div className={`empty-state empty-state-card empty-state-${tone}`}>
      <MaterialIcon name={icon} />
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        {actions ? <div className="empty-state-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
