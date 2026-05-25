import { Link } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { BentoSection, BentoTile } from '@/components/studio/BentoTile';
import { StatusBadge, TrustBadge } from '@/components/studio/StudioPrimitives';
import { HitlTrustTierBadge } from '@/components/workflow/HitlTrustTierBadge';
import {
  DEAL_STAGE_DEFINITIONS,
  getDealNextAction,
  getDealStageProgress,
  type DealStageStatus,
} from '@/lib/workflow/deal-stage-model';
import { getUnifiedDealNextAction } from '@/lib/workflow/next-action';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

export type DealCockpitKpi = {
  label: string;
  value: string;
  detail: string;
  posture?: string;
};

export type DealCockpitPanelProps = {
  dealId: string;
  title?: string;
  eyebrow?: string;
  kpis?: DealCockpitKpi[];
  rail?: ReactNode;
  actions?: ReactNode;
};

const STATUS_LABELS: Record<DealStageStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  ready: 'Ready',
  complete: 'Complete',
};

export function DealCockpitPanel({
  dealId,
  title = 'Deal Cockpit',
  eyebrow = 'Workflow command center',
  kpis = [],
  rail,
  actions,
}: DealCockpitPanelProps): ReactElement {
  const progressState = useRuntimeResource(
    () => runtimeServices.studio.getWorkflowProgress(dealId),
    `wave8-cockpit-progress-${dealId}`,
    getDealStageProgress(dealId)
  );
  const nextActionState = useRuntimeResource(
    () => runtimeServices.studio.getNextAction(dealId),
    `wave8-cockpit-next-action-${dealId}`,
    getDealNextAction(dealId)
  );
  const progress = progressState.value;
  const unifiedAction = getUnifiedDealNextAction(dealId, undefined, progress);
  const nextAction = nextActionState.value ?? unifiedAction;
  const action = { ...unifiedAction, ...nextAction };
  const blockedStages = DEAL_STAGE_DEFINITIONS.filter((stage) => progress[stage.id] === 'blocked');

  return (
    <BentoSection
      title={title}
      eyebrow={eyebrow}
      actions={
        <>
          <StatusBadge status={`${action.blockerCount} blockers`} />
          {actions}
        </>
      }
    >
      <BentoTile
        title={action.label}
        subtitle={action.reason}
        variant="action"
        span={2}
        status={runtimeServices.mode === 'api' ? 'API-backed advisory' : 'Fixture advisory'}
        state={progressState.loading || nextActionState.loading ? 'loading' : 'ok'}
        primary={
          <div className="sophex-next-action-primary">
            <HitlTrustTierBadge tier={action.confidence.trustTier} />
            <p>{action.confidence.safeMessage}</p>
          </div>
        }
        actions={
          <Link to={action.to} className="btn btn-primary">
            {action.label}
          </Link>
        }
      >
        <p className="muted">Owner: {action.owner}</p>
        {action.supportingAction ? (
          <p className="muted">Also watch: {action.supportingAction}</p>
        ) : null}
      </BentoTile>
      <BentoTile
        title="Stage Posture"
        subtitle="Advisory progress only; UI state never authorizes export."
        variant="status"
        span={2}
        state="ok"
      >
        <div className="sophex-stage-chip-grid">
          {DEAL_STAGE_DEFINITIONS.map((stage) => (
            <span key={stage.id} className={`stage-chip stage-chip-${progress[stage.id]}`}>
              <strong>{stage.label}</strong>
              <small>{STATUS_LABELS[progress[stage.id]]}</small>
            </span>
          ))}
        </div>
      </BentoTile>
      {kpis.map((kpi) => (
        <BentoTile
          key={kpi.label}
          title={kpi.label}
          subtitle={kpi.detail}
          variant="metric"
          state="ok"
          primary={<strong className="sophex-bento-metric-value">{kpi.value}</strong>}
          secondary={kpi.posture ? <TrustBadge state={kpi.posture} /> : undefined}
        />
      ))}
      <BentoTile
        title="Blocked Work"
        subtitle="High-priority gaps pulled into one cockpit rail."
        variant="list"
        span={rail ? 2 : 1}
        state={blockedStages.length > 0 ? 'ok' : 'empty'}
        emptyMessage="No blocked stages are visible in the current advisory model."
      >
        <ul className="governance-list">
          {blockedStages.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.label}</strong>
              <span>{stage.summary}</span>
            </li>
          ))}
        </ul>
      </BentoTile>
      {rail ? (
        <BentoTile
          title="Cockpit Rail"
          subtitle="Contextual operator-safe projection."
          variant="composite"
          span={2}
        >
          {rail}
        </BentoTile>
      ) : null}
    </BentoSection>
  );
}
