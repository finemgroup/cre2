import { Link, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import {
  DEAL_STAGE_DEFINITIONS,
  getDealStageProgress,
  resolveDealStageFromPath,
  type DealStageStatus,
} from '@/lib/workflow/deal-stage-model';
import { MotionBlock } from '@/components/studio/StudioPrimitives';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

const STATUS_LABEL: Record<DealStageStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  ready: 'Ready',
  complete: 'Complete',
};

export function DealStageStepper({ dealId }: { dealId: string }): ReactElement {
  const location = useLocation();
  const activeStage = resolveDealStageFromPath(location.pathname);
  const progressState = useRuntimeResource(
    () => runtimeServices.studio.getWorkflowProgress(dealId),
    `deal-stage-progress-${dealId}`,
    getDealStageProgress(dealId)
  );
  const progress = progressState.value;

  return (
    <MotionBlock motionName="navRail">
      <nav className="deal-stage-stepper" aria-label="Deal workflow stages">
        <p className="studio-eyebrow">Deal workflow</p>
        <ol className="deal-stage-list">
          {DEAL_STAGE_DEFINITIONS.map((stage) => {
            const status = progress[stage.id];
            const isActive = stage.id === activeStage;
            return (
              <li
                key={stage.id}
                className={`deal-stage-item deal-stage-${status}${isActive ? ' active' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <Link to={stage.primaryRoute(dealId)} className="deal-stage-link">
                  <span className="deal-stage-name">{stage.label}</span>
                  <span className="deal-stage-status">{STATUS_LABEL[status]}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </MotionBlock>
  );
}
