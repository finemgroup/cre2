import { studioDealPath, studioReportPath } from '@/data/studio';
import type { WorkflowGateEvaluation, WorkflowGateFamily } from '@/lib/contracts/workflow-gates';
import {
  countOpenBlockers,
  getDealNextAction,
  getDealStageProgress,
  type DealNextAction,
  type DealStageStatus,
  type DealWorkflowStage,
} from '@/lib/workflow/deal-stage-model';
import { assessConfidence, type ConfidenceAssessment } from '@/lib/workflow/confidence';

export type DealWorkflowActionSource = 'stage-progress' | 'readiness-gate';

export type DealWorkflowNextAction = DealNextAction & {
  source: DealWorkflowActionSource;
  confidence: ConfidenceAssessment;
  blockerCount: number;
  supportingAction?: string;
};

const GATE_ROUTE_BY_FAMILY: Record<WorkflowGateFamily, (dealId: string) => string> = {
  assumption: (dealId) => studioDealPath(dealId, 'underwriting'),
  evidence: (dealId) => studioDealPath(dealId, 'data-review'),
  scenario: (dealId) => studioDealPath(dealId, 'scenarios'),
  review: (dealId) => studioDealPath(dealId, 'hitl-review'),
  export: (dealId) => studioReportPath(dealId),
  'spatial-source': (dealId) => studioDealPath(dealId, 'spatial'),
  'source-rights': (dealId) => studioDealPath(dealId, 'underwriting-sources'),
};

export function getUnifiedDealNextAction(
  dealId: string,
  readiness?: WorkflowGateEvaluation,
  progress: Record<DealWorkflowStage, DealStageStatus> = getDealStageProgress(dealId)
): DealWorkflowNextAction {
  const stageAction = getDealNextAction(dealId);
  const blockerCount = countOpenBlockers(progress);
  const readinessBlocker = readiness?.gates.find(
    (gate) => gate.severity === 'block' && gate.status === 'blocked'
  );

  if (readinessBlocker) {
    return {
      label: readinessBlocker.nextSafeAction ?? stageAction.label,
      reason: readinessBlocker.safeMessage,
      to: GATE_ROUTE_BY_FAMILY[readinessBlocker.family](dealId),
      owner: readinessBlocker.family === 'review' ? 'Reviewer' : 'Analyst',
      source: 'readiness-gate',
      confidence: assessConfidence(35, true),
      blockerCount,
      supportingAction: stageAction.label,
    };
  }

  return {
    ...stageAction,
    source: 'stage-progress',
    confidence: assessConfidence(blockerCount > 0 ? 68 : 92, blockerCount > 0),
    blockerCount,
  };
}
