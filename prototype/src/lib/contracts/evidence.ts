import { decideVisibility, type VisibilityClass } from '@/lib/contracts/visibility';
import type { ActorContext } from '@/lib/contracts/actor-context';

export type ReviewState =
  | 'candidate'
  | 'needs-review'
  | 'approved-private-use'
  | 'approved-public-projection'
  | 'rejected'
  | 'superseded'
  | 'revoked'
  | 'publication-hold';

export type EvidenceIdentity = {
  id: string;
  sourceFamily: 'public-record' | 'user-upload' | 'provider' | 'operator-review';
  propertyId: string;
  sourceOwnerId?: string;
  organizationId?: string;
  visibility: VisibilityClass;
  sourceUsePolicy: 'public-use' | 'private-use' | 'provider-restricted' | 'internal-review';
  digest: string;
  reviewState: ReviewState;
  receiptRefs: string[];
};

export type Observation = {
  id: string;
  propertyId: string;
  fieldKey: string;
  value: string;
  evidenceId: string;
  confidence: number;
  visibility: VisibilityClass;
  sourceOwnerId?: string;
  organizationId?: string;
  requiredEntitlement?: string;
  requiredPartnerScope?: string;
  reviewState: ReviewState;
};

export type ResolvedFieldValue = {
  propertyId: string;
  fieldKey: string;
  value: string;
  authorityLabel: string;
  evidenceId?: string;
  safeExplanation: string;
};

export function resolveFieldForActor(
  actor: ActorContext,
  propertyId: string,
  fieldKey: string,
  observations: Observation[]
): ResolvedFieldValue | undefined {
  const candidates = observations
    .filter(
      (observation) => observation.propertyId === propertyId && observation.fieldKey === fieldKey
    )
    .map((observation) => ({
      observation,
      decision: decideVisibility(actor, observation),
    }));

  const allowed = candidates
    .filter(
      ({ decision }) => decision.decision === 'allow' || decision.decision === 'aggregate-only'
    )
    .sort(
      (left, right) =>
        scoreCandidate(right.observation, right.decision.label) -
        scoreCandidate(left.observation, left.decision.label)
    );

  const winner = allowed[0];
  if (!winner) {
    const hidden = candidates[0]?.decision;
    return hidden
      ? {
          propertyId,
          fieldKey,
          value: 'Unavailable',
          authorityLabel: hidden.label,
          safeExplanation: hidden.safeExplanation,
        }
      : undefined;
  }

  return {
    propertyId,
    fieldKey,
    value: winner.observation.value,
    evidenceId: winner.observation.evidenceId,
    authorityLabel: winner.decision.label,
    safeExplanation: winner.decision.safeExplanation,
  };
}

export function canPromoteToPublicProjection(observation: Observation): boolean {
  return (
    observation.visibility === 'public-baseline' ||
    (observation.visibility === 'shared-with-permission' &&
      observation.reviewState === 'approved-public-projection')
  );
}

function scoreCandidate(observation: Observation, decisionLabel: string): number {
  const reviewScore = observation.reviewState === 'approved-public-projection' ? 10 : 0;
  const actorSpecificScore = /private|restricted|permission/i.test(decisionLabel) ? 20 : 0;
  return actorSpecificScore + reviewScore + observation.confidence;
}
