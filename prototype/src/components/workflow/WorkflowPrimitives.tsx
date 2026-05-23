import { Link } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { MaterialIcon, StatusBadge } from '@/components/studio/StudioPrimitives';

export function ScreenReaderAnnouncement({ message }: { message: string }): ReactElement {
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

export function ProofStatusBadge({ status }: { status: string }): ReactElement {
  return <StatusBadge status={status} />;
}

export function WorkflowContinuityContainer({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): ReactElement {
  return (
    <section className="workflow-continuity" aria-label={label}>
      {children}
    </section>
  );
}

export function WorkflowHandoffLink({
  to,
  label,
  reason,
}: {
  to: string;
  label: string;
  reason: string;
}): ReactElement {
  return (
    <Link to={to} className="handoff-link">
      <MaterialIcon name="arrow_forward" />
      <span>
        <strong>{label}</strong>
        <small>{reason}</small>
      </span>
    </Link>
  );
}

export function ActivityTimelinePanel({ items }: { items: string[] }): ReactElement {
  return (
    <ol className="workflow-timeline" aria-label="Workflow activity">
      {items.map((item, index) => (
        <li key={item}>
          <span>{index + 1}</span>
          <p>{item}</p>
          <ProofStatusBadge status={index === 0 ? 'Reviewed' : 'Staged'} />
        </li>
      ))}
    </ol>
  );
}
