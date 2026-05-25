import { describe, expect, it } from 'vitest';

import { fixtureActors, fixtureObservations } from '@/lib/contracts/fixtures';
import { completeExtractionJob, getReviewQueue, applyReviewAction } from '@/lib/runtime/review-queue';

describe('review queue runtime simulation', () => {
  it('shows review queue only to internal operators', () => {
    expect(getReviewQueue(fixtureActors.public)).toEqual([]);
    expect(getReviewQueue(fixtureActors.internalOperator).length).toBeGreaterThan(0);
  });

  it('does not promote candidates when extraction jobs complete', () => {
    const candidate = fixtureObservations.find((item) => item.id === 'obs-private-cap-rate')!;
    const completed = completeExtractionJob(candidate);

    expect(completed.reviewState).toBe(candidate.reviewState);
  });

  it('applies explicit operator review actions', () => {
    const observation = fixtureObservations.find((item) => item.id === 'obs-provider-comp')!;
    const reviewed = applyReviewAction({
      observation,
      actor: fixtureActors.internalOperator,
      action: 'approve-public-projection',
    });

    expect(reviewed.reviewState).toBe('approved-public-projection');
  });

  it('uses HITL-safe queue language and supports explicit holds', () => {
    const queue = getReviewQueue(fixtureActors.internalOperator);
    const held = applyReviewAction({
      observation: queue[0].observation,
      actor: fixtureActors.internalOperator,
      action: 'hold',
    });

    expect(queue[0].safeStatus).toMatch(/HITL reviewer decision required/i);
    expect(held.reviewState).toBe('publication-hold');
  });
});
