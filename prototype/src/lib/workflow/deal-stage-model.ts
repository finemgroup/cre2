import { studioDealPath, studioReportPath } from '@/data/studio';

export const DEAL_WORKFLOW_STAGES = [
  'Intake',
  'Evidence',
  'Underwriting',
  'Scenarios',
  'Governance',
  'Delivery',
] as const;

export type DealWorkflowStage = (typeof DEAL_WORKFLOW_STAGES)[number];

export type DealStageStatus = 'not-started' | 'in-progress' | 'blocked' | 'ready' | 'complete';

export type DealStageDefinition = {
  id: DealWorkflowStage;
  label: string;
  summary: string;
  primaryRoute: (dealId: string) => string;
};

export const DEAL_STAGE_DEFINITIONS: DealStageDefinition[] = [
  {
    id: 'Intake',
    label: 'Intake',
    summary: 'Capture deal context and expected source documents.',
    primaryRoute: (dealId) => studioDealPath(dealId, 'intake'),
  },
  {
    id: 'Evidence',
    label: 'Evidence',
    summary: 'Review candidate facts, source posture, and location intelligence.',
    primaryRoute: (dealId) => studioDealPath(dealId, 'data-review'),
  },
  {
    id: 'Underwriting',
    label: 'Underwriting',
    summary: 'Lock assumptions, comps, debt, and model health.',
    primaryRoute: (dealId) => studioDealPath(dealId, 'underwriting'),
  },
  {
    id: 'Scenarios',
    label: 'Scenarios',
    summary: 'Compare cases and optional capital structure.',
    primaryRoute: (dealId) => studioDealPath(dealId, 'scenarios'),
  },
  {
    id: 'Governance',
    label: 'Governance',
    summary: 'Lock valuation snapshots and route analyst review.',
    primaryRoute: (dealId) => studioDealPath(dealId, 'versions'),
  },
  {
    id: 'Delivery',
    label: 'Delivery',
    summary: 'Assemble IC packet, report, and export gates.',
    primaryRoute: (dealId) => studioReportPath(dealId),
  },
];

export function resolveDealStageFromPath(pathname: string): DealWorkflowStage {
  if (/\/intake$/.test(pathname)) return 'Intake';
  if (/\/data-review$|\/underwriting\/sources$|\/spatial$/.test(pathname)) return 'Evidence';
  if (/\/underwriting\/debt$|\/underwriting$|\/comps$/.test(pathname)) return 'Underwriting';
  if (/\/scenarios$|\/capital-stack$/.test(pathname)) return 'Scenarios';
  if (/\/versions$|\/hitl-review$/.test(pathname)) return 'Governance';
  if (/\/ic-packet$|\/studio\/reports\//.test(pathname)) return 'Delivery';
  if (/^\/studio\/deals\/[^/]+$/.test(pathname)) return 'Intake';
  return 'Intake';
}

export function getDealStageProgress(dealId: string): Record<DealWorkflowStage, DealStageStatus> {
  if (dealId === '1200-tech') {
    return {
      Intake: 'complete',
      Evidence: 'complete',
      Underwriting: 'in-progress',
      Scenarios: 'ready',
      Governance: 'not-started',
      Delivery: 'not-started',
    };
  }

  return {
    Intake: 'complete',
    Evidence: 'blocked',
    Underwriting: 'in-progress',
    Scenarios: 'ready',
    Governance: 'blocked',
    Delivery: 'not-started',
  };
}

export type DealNextAction = {
  label: string;
  reason: string;
  to: string;
  owner: string;
};

export function getDealNextAction(dealId: string): DealNextAction {
  const progress = getDealStageProgress(dealId);

  if (progress.Evidence === 'blocked') {
    return {
      label: 'Resolve evidence blockers',
      reason: 'Candidate evidence and unit-count conflict must clear before assumptions lock.',
      to: studioDealPath(dealId, 'data-review'),
      owner: 'Analyst',
    };
  }

  if (progress.Underwriting === 'in-progress') {
    return {
      label: 'Continue underwriting model',
      reason: 'DSCR and lender quote gates remain open on the executive cockpit.',
      to: studioDealPath(dealId, 'underwriting'),
      owner: 'Analyst',
    };
  }

  if (progress.Governance === 'blocked') {
    return {
      label: 'Review valuation snapshots',
      reason: 'Lock a governed snapshot before IC packet or export delivery.',
      to: studioDealPath(dealId, 'versions'),
      owner: 'Analyst',
    };
  }

  return {
    label: 'Open report builder',
    reason: 'Delivery surfaces activate after governance gates clear.',
    to: studioReportPath(dealId),
    owner: 'Analyst',
  };
}

export function countOpenBlockers(progress: Record<DealWorkflowStage, DealStageStatus>): number {
  return Object.values(progress).filter((status) => status === 'blocked').length;
}
