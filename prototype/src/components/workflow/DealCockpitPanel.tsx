import { Link } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { BentoSection, BentoTile } from '@/components/studio/BentoTile';
import { StatusBadge, TrustBadge } from '@/components/studio/StudioPrimitives';
import { AiTaskPulse } from '@/components/workflow/AiTaskPulse';
import { HitlTrustTierBadge } from '@/components/workflow/HitlTrustTierBadge';
import {
  DEAL_STAGE_DEFINITIONS,
  type DealStageStatus,
} from '@/lib/workflow/deal-stage-model';
import { getDealCockpitProjection } from '@/lib/workflow/cockpit-projection';
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
  const fallbackProjection = getDealCockpitProjection(dealId);
  const cockpitState = useRuntimeResource(
    () => runtimeServices.studio.getCockpitProjection(dealId),
    `wave9-cockpit-projection-${dealId}`,
    fallbackProjection
  );
  const projection = cockpitState.value ?? fallbackProjection;
  const progress = projection.progress;
  const action = projection.nextAction;
  const blockedStages = projection.blockedStages;
  const taskRail = rail ?? <AiTaskPulse tasks={projection.tasks} />;

  return (
    <BentoSection
      title={title}
      eyebrow={eyebrow}
      className="deal-cockpit-panel"
      actions={
        <>
          <StatusBadge status={`${action.blockerCount} blockers`} />
          {projection.reviewSummary.visible ? (
            <StatusBadge
              status={`${projection.reviewSummary.pendingCount} pending reviews`}
            />
          ) : null}
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
        state={cockpitState.loading ? 'loading' : 'ok'}
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
        state={cockpitState.loading ? 'loading' : 'ok'}
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
        span={taskRail ? 2 : 1}
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
      {taskRail ? (
        <BentoTile
          title="Cockpit Rail"
          subtitle="Contextual operator-safe projection."
          variant="composite"
          span={2}
        >
          {taskRail}
        </BentoTile>
      ) : null}
    </BentoSection>
  );
}
