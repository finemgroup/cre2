import { fixtureActors, fixtureObservations } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';
import type { Observation } from '@/lib/contracts/evidence';
import {
  isPublicProjectionEligible,
  queueCompletionPromotes,
  transitionReviewState,
  type ReviewAction,
} from '@/lib/contracts/review-state';

export type ReviewQueueItem = {
  observation: Observation;
  canPromotePublic: boolean;
  safeStatus: string;
};

export function getReviewQueue(
  actor: ActorContext = fixtureActors.internalOperator
): ReviewQueueItem[] {
  if (actor.actorClass !== 'internal-operator') return [];
  return fixtureObservations
    .filter(
      (observation) =>
        observation.reviewState === 'candidate' || observation.reviewState === 'needs-review'
    )
    .map((observation) => ({
      observation,
      canPromotePublic: isPublicProjectionEligible(observation),
      safeStatus: `${observation.reviewState} - HITL reviewer decision required; queue completion is not promotion authority`,
    }));
}

export function applyReviewAction(input: {
  observation: Observation;
  actor: ActorContext;
  action: ReviewAction;
}): Observation {
  return transitionReviewState(input.observation, input.actor, input.action);
}

export function completeExtractionJob(observation: Observation): Observation {
  if (queueCompletionPromotes()) {
    return { ...observation, reviewState: 'approved-public-projection' };
  }
  return observation;
}
