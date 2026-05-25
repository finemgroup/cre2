import type { Observation, ReviewState } from '@/lib/contracts/evidence';
import type { ActorContext } from '@/lib/contracts/actor-context';
import { isInternalOperator } from '@/lib/contracts/actor-context';

const PROMOTABLE_STATES: ReviewState[] = ['needs-review', 'approved-private-use'];

export type ReviewAction = 'approve-private-use' | 'approve-public-projection' | 'reject' | 'revoke';

export function transitionReviewState(
  observation: Observation,
  actor: ActorContext,
  action: ReviewAction
): Observation {
  if (!isInternalOperator(actor)) {
    return observation;
  }

  if (action === 'approve-private-use' && observation.reviewState === 'needs-review') {
    return { ...observation, reviewState: 'approved-private-use' };
  }

  if (
    action === 'approve-public-projection' &&
    PROMOTABLE_STATES.includes(observation.reviewState) &&
    observation.visibility !== 'user-private' &&
    observation.visibility !== 'organization-private'
  ) {
    return { ...observation, reviewState: 'approved-public-projection' };
  }

  if (action === 'reject') return { ...observation, reviewState: 'rejected' };
  if (action === 'revoke') return { ...observation, reviewState: 'revoked' };
  return observation;
}

export function isPublicProjectionEligible(observation: Observation): boolean {
  return (
    observation.reviewState === 'approved-public-projection' &&
    observation.visibility !== 'user-private' &&
    observation.visibility !== 'organization-private' &&
    observation.visibility !== 'internal-only'
  );
}

export function queueCompletionPromotes(): false {
  return false;
}
