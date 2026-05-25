import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StatusBadge, StudioCard } from '@/components/studio/StudioPrimitives';
import {
  countOpenBlockers,
  getDealNextAction,
  getDealStageProgress,
} from '@/lib/workflow/deal-stage-model';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

export function DealCockpitSummary({ dealId }: { dealId: string }): ReactElement {
  const progressState = useRuntimeResource(
    () => runtimeServices.studio.getWorkflowProgress(dealId),
    `deal-cockpit-progress-${dealId}`,
    getDealStageProgress(dealId)
  );
  const nextActionState = useRuntimeResource(
    () => runtimeServices.studio.getNextAction(dealId),
    `deal-cockpit-action-${dealId}`,
    getDealNextAction(dealId)
  );
  const progress = progressState.value;
  const nextAction = nextActionState.value;
  const blockerCount = countOpenBlockers(progress);

  return (
    <StudioCard title="Deal cockpit" eyebrow="Next best action">
      <div className="deal-cockpit-grid">
        <div>
          <p className="muted">
            Stage posture is mock-only and advisory. It does not authorize export.
          </p>
          {progressState.loading || nextActionState.loading ? (
            <p className="muted" role="status">
              Refreshing workflow state from {runtimeServices.mode} runtime.
            </p>
          ) : null}
          <StatusBadge status={`${blockerCount} open blockers`} />
        </div>
        <div className="deal-cockpit-action">
          <strong>{nextAction.label}</strong>
          <p>{nextAction.reason}</p>
          <p className="muted">Owner: {nextAction.owner}</p>
          <Link to={nextAction.to} className="btn btn-primary">
            {nextAction.label}
          </Link>
        </div>
      </div>
    </StudioCard>
  );
}
