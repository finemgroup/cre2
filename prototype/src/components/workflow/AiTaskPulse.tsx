import type { ReactElement } from 'react';

import { StatusBadge } from '@/components/studio/StudioPrimitives';

export type AiTaskStatus = 'queued' | 'running' | 'completed' | 'error';

export type AiTaskProjection = {
  id: string;
  label: string;
  owner: string;
  status: AiTaskStatus;
  progress: number;
  safeDetail: string;
};

export const DEFAULT_COCKPIT_TASKS: AiTaskProjection[] = [
  {
    id: 'task-evidence-gap',
    label: 'Evidence gap scan',
    owner: 'Evidence analyst agent',
    status: 'running',
    progress: 64,
    safeDetail: 'Checking source refs for unit count and rent roll conflicts.',
  },
  {
    id: 'task-lender-quote',
    label: 'Lender quote checklist',
    owner: 'Debt review agent',
    status: 'queued',
    progress: 18,
    safeDetail: 'Waiting for mock term sheet metadata; no provider calls are made.',
  },
  {
    id: 'task-export-readiness',
    label: 'Export readiness preflight',
    owner: 'Governance agent',
    status: 'completed',
    progress: 100,
    safeDetail: 'Report remains blocked until review, source rights, and consent gates clear.',
  },
];

export function AiTaskPulse({
  tasks = DEFAULT_COCKPIT_TASKS,
}: {
  tasks?: AiTaskProjection[];
}): ReactElement {
  const activeCount = tasks.filter(
    (task) => task.status === 'queued' || task.status === 'running'
  ).length;
  const issueCount = tasks.filter((task) => task.status === 'error').length;

  return (
    <section className="ai-task-pulse" aria-label="AI staff task pulse">
      <header>
        <div>
          <p className="studio-eyebrow">AI staff pulse</p>
          <h3>{activeCount} active advisory tasks</h3>
        </div>
        <StatusBadge status={issueCount > 0 ? `${issueCount} needs review` : 'Mock-only'} />
      </header>
      <div className="ai-task-list">
        {tasks.map((task) => (
          <article key={task.id} className={`ai-task-card ai-task-${task.status}`}>
            <div>
              <strong>{task.label}</strong>
              <span>{task.owner}</span>
            </div>
            <StatusBadge status={task.status} />
            <div
              className="ai-task-progress"
              role="progressbar"
              aria-valuenow={task.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${task.label} progress`}
            >
              <span style={{ width: `${task.progress}%` }} />
            </div>
            <p className="muted">{task.safeDetail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
