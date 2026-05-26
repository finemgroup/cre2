import { describe, expect, it } from 'vitest';

import { fixtureActors, fixtureObservations } from '@/lib/contracts/fixtures';
import {
  isPublicProjectionEligible,
  queueCompletionPromotes,
  transitionReviewState,
} from '@/lib/contracts/review-state';

describe('review state contract simulator', () => {
  it('does not let candidate or private observations become public by queue completion', () => {
    const candidate = fixtureObservations.find(
      (observation) => observation.id === 'obs-private-cap-rate'
    );

    expect(candidate).toBeDefined();
    expect(queueCompletionPromotes()).toBe(false);
    expect(isPublicProjectionEligible(candidate!)).toBe(false);
  });

  it('allows explicit operator promotion only for non-private eligible observations', () => {
    const providerObservation = fixtureObservations.find(
      (observation) => observation.id === 'obs-provider-comp'
    )!;
    const promoted = transitionReviewState(
      providerObservation,
      fixtureActors.internalOperator,
      'approve-public-projection'
    );

    expect(promoted.reviewState).toBe('approved-public-projection');
    expect(isPublicProjectionEligible(promoted)).toBe(true);
  });

  it('rejects non-operator promotion attempts', () => {
    const observation = fixtureObservations.find((item) => item.id === 'obs-provider-comp')!;
    const result = transitionReviewState(
      observation,
      fixtureActors.orgAdmin,
      'approve-public-projection'
    );

    expect(result.reviewState).toBe(observation.reviewState);
  });

  it('keeps machine recommendations from becoming review authority', () => {
    const observation = fixtureObservations.find((item) => item.id === 'obs-private-cap-rate')!;
    const result = transitionReviewState(
      observation,
      fixtureActors.internalOperator,
      'recommend-private-use'
    );

    expect(result.reviewState).toBe(observation.reviewState);
    expect(isPublicProjectionEligible(result)).toBe(false);
  });

  it('can explicitly hold evidence for HITL review without promoting it', () => {
    const observation = fixtureObservations.find((item) => item.id === 'obs-provider-comp')!;
    const result = transitionReviewState(observation, fixtureActors.internalOperator, 'hold');

    expect(result.reviewState).toBe('publication-hold');
    expect(isPublicProjectionEligible(result)).toBe(false);
  });
});
