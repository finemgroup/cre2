import type { ActorContext } from '@/lib/contracts/actor-context';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { DEFAULT_COCKPIT_TASKS, type AiTaskProjection } from '@/components/workflow/AiTaskPulse';
import {
  DEAL_STAGE_DEFINITIONS,
  getDealStageProgress,
  type DealStageStatus,
  type DealWorkflowStage,
} from '@/lib/workflow/deal-stage-model';
import { getUnifiedDealNextAction, type DealWorkflowNextAction } from '@/lib/workflow/next-action';
import { getContextualReviewAssignments } from '@/lib/workflow/review-assignments';

export type DealCockpitBlockedStage = {
  id: DealWorkflowStage;
  label: string;
  summary: string;
};

export type DealCockpitReviewSummary = {
  pendingCount: number;
  highestTrustTier: string | null;
  visible: boolean;
};

export type DealCockpitProjection = {
  dealId: string;
  progress: Record<DealWorkflowStage, DealStageStatus>;
  nextAction: DealWorkflowNextAction;
  blockerCount: number;
  blockedStages: DealCockpitBlockedStage[];
  tasks: AiTaskProjection[];
  reviewSummary: DealCockpitReviewSummary;
};

export function getDealCockpitProjection(
  dealId: string,
  actor: ActorContext = fixtureActors.orgAdmin
): DealCockpitProjection {
  const progress = getDealStageProgress(dealId);
  const nextAction = getUnifiedDealNextAction(dealId, undefined, progress);
  const blockedStages = DEAL_STAGE_DEFINITIONS.filter((stage) => progress[stage.id] === 'blocked').map(
    (stage) => ({
      id: stage.id,
      label: stage.label,
      summary: stage.summary,
    })
  );

  return {
    dealId,
    progress,
    nextAction,
    blockerCount: nextAction.blockerCount,
    blockedStages,
    tasks: DEFAULT_COCKPIT_TASKS,
    reviewSummary: summarizeReviewPosture(actor),
  };
}

function summarizeReviewPosture(actor: ActorContext): DealCockpitReviewSummary {
  const canViewReviewSummary = ['org-admin', 'internal-operator'].includes(actor.actorClass);
  if (!canViewReviewSummary) {
    return { pendingCount: 0, highestTrustTier: null, visible: false };
  }

  const assignments = getContextualReviewAssignments();
  const pendingCount = assignments.filter((assignment) => assignment.posture !== 'Reviewed').length;
  const highestTrustTier =
    assignments.find((assignment) => assignment.trustTier === 'BLOCK')?.trustTier ??
    assignments.find((assignment) => assignment.trustTier === 'HITL')?.trustTier ??
    assignments[0]?.trustTier ??
    null;

  return {
    pendingCount,
    highestTrustTier,
    visible: true,
  };
}
