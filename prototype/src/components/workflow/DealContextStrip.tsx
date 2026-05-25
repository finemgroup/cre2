import { useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';

import { StatusBadge } from '@/components/studio/StudioPrimitives';
import { HitlTrustTierBadge } from '@/components/workflow/HitlTrustTierBadge';
import { getDealCockpitProjection } from '@/lib/workflow/cockpit-projection';
import { resolveDealStageFromPath } from '@/lib/workflow/deal-stage-model';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

export function DealContextStrip({
  dealId,
  dealName,
}: {
  dealId: string;
  dealName: string;
}): ReactElement {
  const location = useLocation();
  const activeStage = resolveDealStageFromPath(location.pathname);
  const fallback = getDealCockpitProjection(dealId);
  const cockpitState = useRuntimeResource(
    () => runtimeServices.studio.getCockpitProjection(dealId),
    `deal-context-strip-${dealId}`,
    fallback
  );
  const projection = cockpitState.value ?? fallback;

  return (
    <div className="deal-context-strip" aria-label="Deal cockpit context">
      <div>
        <p className="studio-eyebrow">Deal context</p>
        <strong>{dealName}</strong>
      </div>
      <div className="deal-context-strip-meta">
        <StatusBadge status={`Stage: ${activeStage}`} />
        <StatusBadge status={`${projection.blockerCount} blockers`} />
        <HitlTrustTierBadge tier={projection.nextAction.confidence.trustTier} />
        {projection.reviewSummary.visible ? (
          <StatusBadge status={`${projection.reviewSummary.pendingCount} pending reviews`} />
        ) : null}
      </div>
      <p className="muted deal-context-strip-note">
        Advisory cockpit context only. UI posture never authorizes export or evidence promotion.
      </p>
    </div>
  );
}
