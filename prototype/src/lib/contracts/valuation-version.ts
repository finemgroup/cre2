import type { ActorContext } from '@/lib/contracts/actor-context';
import type { ReviewState } from '@/lib/contracts/evidence';
import { evaluateWorkflowGates, type WorkflowGateEvaluation } from '@/lib/contracts/workflow-gates';
import { getTradeAreasForActor, type TradeArea } from '@/lib/contracts/spatial';

export type EvidenceSnapshot = {
  id: string;
  propertyId: string;
  actorScope: 'public' | 'organization' | 'source-owner' | 'internal';
  includedEvidenceRefs: string[];
  redactedEvidenceCount: number;
  sourceUsePolicyVersions: string[];
  asOf: string;
  manifestHash: string;
  receiptRef?: string;
};

export type ValuationScenarioRef = {
  id: string;
  label: string;
  posture: 'advisory' | 'review-required' | 'approved-private-use';
};

export type ValuationVersion = {
  id: string;
  propertyId: string;
  reportId: string;
  actorId: string;
  assumptionsLabel: string;
  scenarioRefs: ValuationScenarioRef[];
  evidenceSnapshot: EvidenceSnapshot;
  reviewState: ReviewState;
  readiness: WorkflowGateEvaluation;
  tradeAreas: TradeArea[];
  resultSummary: string;
  createdAt: string;
  updatedAt: string;
};

const VERSION_AS_OF = '2026-05-25T12:00:00.000Z';

export function getValuationVersionForActor(input: {
  actor: ActorContext;
  propertyId: string;
  reportId?: string;
  exportConsent?: boolean;
  sourceRightsClear?: boolean;
  spatialSourceClear?: boolean;
}): ValuationVersion {
  const reportId = input.reportId ?? `report-${input.propertyId}`;
  const isPublic =
    input.actor.actorClass === 'anonymous' || input.actor.actorClass === 'partner-api';
  const tradeAreas = getTradeAreasForActor(input.actor, input.propertyId);
  const reviewState: ReviewState = isPublic ? 'needs-review' : 'approved-private-use';
  const sourceRightsClear = input.sourceRightsClear ?? !isPublic;
  const spatialSourceClear = input.spatialSourceClear ?? tradeAreas.length > 0;

  return {
    id: `valuation-${input.propertyId}-v1`,
    propertyId: input.propertyId,
    reportId,
    actorId: input.actor.id,
    assumptionsLabel: 'Base assumptions complete with source posture labels.',
    scenarioRefs: [
      { id: 'scenario-base', label: 'Base case', posture: 'advisory' },
      { id: 'scenario-downside', label: 'Downside case', posture: 'review-required' },
      { id: 'scenario-upside', label: 'Upside case', posture: 'advisory' },
    ],
    evidenceSnapshot: createEvidenceSnapshot({
      actor: input.actor,
      propertyId: input.propertyId,
      reportId,
      isPublic,
      sourceRightsClear,
    }),
    reviewState,
    readiness: evaluateWorkflowGates({
      assumptionsComplete: true,
      evidenceLinked: true,
      scenariosCompared: true,
      reviewState,
      exportConsent: input.exportConsent ?? false,
      sourceRightsClear,
      spatialSourceClear,
    }),
    tradeAreas,
    resultSummary: isPublic
      ? 'Advisory valuation preview; reviewer approval required before export.'
      : 'Private-use valuation version staged for governed export review.',
    createdAt: VERSION_AS_OF,
    updatedAt: VERSION_AS_OF,
  };
}

function createEvidenceSnapshot(input: {
  actor: ActorContext;
  propertyId: string;
  reportId: string;
  isPublic: boolean;
  sourceRightsClear: boolean;
}): EvidenceSnapshot {
  return {
    id: `snapshot-${input.reportId}-v1`,
    propertyId: input.propertyId,
    actorScope: actorScope(input.actor),
    includedEvidenceRefs: input.isPublic
      ? ['evidence-public-assessor', 'spatial-demo-001-centroid']
      : ['evidence-public-assessor', 'evidence-org-survey', 'spatial-demo-001-centroid'],
    redactedEvidenceCount: input.isPublic ? 2 : 1,
    sourceUsePolicyVersions: input.sourceRightsClear
      ? ['public-use-v0', 'private-use-v0']
      : ['public-use-v0', 'source-rights-pending'],
    asOf: VERSION_AS_OF,
    manifestHash: input.sourceRightsClear
      ? `sha256-${input.reportId}-manifest`
      : `sha256-${input.reportId}-draft-manifest`,
  };
}

function actorScope(actor: ActorContext): EvidenceSnapshot['actorScope'] {
  if (actor.actorClass === 'internal-operator') return 'internal';
  if (actor.organizationId) return 'organization';
  if (actor.sourceOwnerId) return 'source-owner';
  return 'public';
}
