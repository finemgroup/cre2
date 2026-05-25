import type { ReviewState } from '@/lib/contracts/evidence';

export type WorkflowGateSeverity = 'info' | 'warn' | 'block';
export type WorkflowGateStatus = 'pending' | 'passed' | 'warning' | 'blocked';

export type WorkflowGateFamily =
  | 'assumption'
  | 'evidence'
  | 'scenario'
  | 'review'
  | 'export'
  | 'spatial-source'
  | 'source-rights';

export type WorkflowGate = {
  id: string;
  family: WorkflowGateFamily;
  label: string;
  severity: WorkflowGateSeverity;
  status: WorkflowGateStatus;
  safeMessage: string;
  nextSafeAction?: string;
};

export type WorkflowGateInput = {
  assumptionsComplete: boolean;
  evidenceLinked: boolean;
  scenariosCompared: boolean;
  reviewState: ReviewState;
  exportConsent: boolean;
  sourceRightsClear: boolean;
  spatialSourceClear: boolean;
};

export type WorkflowGateEvaluation = {
  gates: WorkflowGate[];
  ready: boolean;
  blockerCategories: WorkflowGateFamily[];
  safeNextAction: string;
};

export function evaluateWorkflowGates(input: WorkflowGateInput): WorkflowGateEvaluation {
  const gates: WorkflowGate[] = [
    requiredGate({
      id: 'gate-assumptions',
      family: 'assumption',
      label: 'Assumptions',
      passed: input.assumptionsComplete,
      blockedMessage: 'Required assumptions are incomplete.',
      nextSafeAction: 'Complete the assumption checklist before using this output.',
    }),
    requiredGate({
      id: 'gate-evidence',
      family: 'evidence',
      label: 'Evidence',
      passed: input.evidenceLinked,
      blockedMessage: 'Required evidence references are missing.',
      nextSafeAction: 'Attach permitted evidence before review or export.',
    }),
    warningGate({
      id: 'gate-scenarios',
      family: 'scenario',
      label: 'Scenarios',
      passed: input.scenariosCompared,
      warningMessage: 'Scenario comparison is advisory until reviewed.',
      nextSafeAction: 'Compare the base, downside, and upside scenarios.',
    }),
    requiredGate({
      id: 'gate-review',
      family: 'review',
      label: 'Review',
      passed:
        input.reviewState === 'approved-private-use' ||
        input.reviewState === 'approved-public-projection',
      blockedMessage: 'Reviewer approval is required before export.',
      nextSafeAction: 'Send the valuation packet to human review.',
    }),
    requiredGate({
      id: 'gate-source-rights',
      family: 'source-rights',
      label: 'Source rights',
      passed: input.sourceRightsClear,
      blockedMessage: 'One or more source-rights checks are unresolved.',
      nextSafeAction: 'Remove blocked sources or obtain approved source rights.',
    }),
    requiredGate({
      id: 'gate-spatial-source',
      family: 'spatial-source',
      label: 'Spatial source',
      passed: input.spatialSourceClear,
      blockedMessage: 'Spatial source precision or rights are unresolved.',
      nextSafeAction: 'Use a reviewed spatial source or label the map as sample-only.',
    }),
    requiredGate({
      id: 'gate-export',
      family: 'export',
      label: 'Export consent',
      passed: input.exportConsent,
      blockedMessage: 'Export consent is missing.',
      nextSafeAction: 'Capture consent copy before generating a governed receipt.',
    }),
  ];

  const blockers = gates.filter((gate) => gate.severity === 'block' && gate.status === 'blocked');

  return {
    gates,
    ready: blockers.length === 0,
    blockerCategories: blockers.map((gate) => gate.family),
    safeNextAction: blockers[0]?.nextSafeAction ?? 'All blocking readiness gates are clear.',
  };
}

function requiredGate(input: {
  id: string;
  family: WorkflowGateFamily;
  label: string;
  passed: boolean;
  blockedMessage: string;
  nextSafeAction: string;
}): WorkflowGate {
  return {
    id: input.id,
    family: input.family,
    label: input.label,
    severity: 'block',
    status: input.passed ? 'passed' : 'blocked',
    safeMessage: input.passed ? `${input.label} gate passed.` : input.blockedMessage,
    nextSafeAction: input.passed ? undefined : input.nextSafeAction,
  };
}

function warningGate(input: {
  id: string;
  family: WorkflowGateFamily;
  label: string;
  passed: boolean;
  warningMessage: string;
  nextSafeAction: string;
}): WorkflowGate {
  return {
    id: input.id,
    family: input.family,
    label: input.label,
    severity: input.passed ? 'info' : 'warn',
    status: input.passed ? 'passed' : 'warning',
    safeMessage: input.passed ? `${input.label} gate passed.` : input.warningMessage,
    nextSafeAction: input.passed ? undefined : input.nextSafeAction,
  };
}
