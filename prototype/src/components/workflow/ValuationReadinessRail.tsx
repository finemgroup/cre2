import type { ReactElement } from 'react';

import {
  ReadinessRail,
  type ReadinessRailItem,
} from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { VALUATION_READINESS_STAGES, type ValuationReadinessStage } from '@/lib/readiness-stages';
import type { WorkflowGate, WorkflowGateEvaluation } from '@/lib/contracts/workflow-gates';

const STAGE_FAMILIES: Record<ValuationReadinessStage, WorkflowGate['family'][]> = {
  Assumptions: ['assumption'],
  Evidence: ['evidence', 'source-rights', 'spatial-source'],
  Scenarios: ['scenario'],
  Review: ['review'],
  Export: ['export'],
};

function gateStatusToRailStatus(status: WorkflowGate['status']): ReadinessRailItem['status'] {
  if (status === 'passed') return 'ready';
  if (status === 'warning') return 'warning';
  if (status === 'blocked') return 'blocked';
  return 'pending';
}

function worstRailStatus(statuses: ReadinessRailItem['status'][]): ReadinessRailItem['status'] {
  if (statuses.includes('blocked')) return 'blocked';
  if (statuses.includes('warning')) return 'warning';
  if (statuses.includes('pending')) return 'pending';
  return 'ready';
}

export function evaluationToReadinessRailItems(
  evaluation: WorkflowGateEvaluation
): ReadinessRailItem[] {
  return VALUATION_READINESS_STAGES.map((stage) => {
    const gates = evaluation.gates.filter((gate) => STAGE_FAMILIES[stage].includes(gate.family));
    const status = worstRailStatus(gates.map((gate) => gateStatusToRailStatus(gate.status)));
    const detail =
      gates.find((gate) => gate.status !== 'passed')?.safeMessage ??
      gates[0]?.safeMessage ??
      `${stage} gate clear.`;

    return {
      id: stage.toLowerCase(),
      label: stage,
      status,
      detail,
    };
  });
}

export function ValuationReadinessRail({
  evaluation,
  orientation = 'horizontal',
  heading = 'Valuation readiness',
}: {
  evaluation: WorkflowGateEvaluation;
  orientation?: 'horizontal' | 'vertical';
  heading?: string;
}): ReactElement {
  const items = evaluationToReadinessRailItems(evaluation);

  return (
    <section className="valuation-readiness-rail" aria-label={heading}>
      <div className="valuation-readiness-summary">
        <strong>{heading}</strong>
        <p>{evaluation.safeNextAction}</p>
        {!evaluation.ready ? (
          <p className="muted">Export and public projection remain gated until blockers clear.</p>
        ) : null}
      </div>
      <ReadinessRail items={items} orientation={orientation} />
    </section>
  );
}
