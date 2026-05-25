import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StatusBadge, StudioCard } from '@/components/studio/StudioPrimitives';
import {
  countOpenBlockers,
  getDealNextAction,
  getDealStageProgress,
} from '@/lib/workflow/deal-stage-model';

export function DealCockpitSummary({ dealId }: { dealId: string }): ReactElement {
  const progress = getDealStageProgress(dealId);
  const nextAction = getDealNextAction(dealId);
  const blockerCount = countOpenBlockers(progress);

  return (
    <StudioCard title="Deal cockpit" eyebrow="Next best action">
      <div className="deal-cockpit-grid">
        <div>
          <p className="muted">Stage posture is mock-only and advisory. It does not authorize export.</p>
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
