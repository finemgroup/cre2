import { describe, expect, it } from 'vitest';

import { reviewStateToHitlTier } from '@/components/workflow/HitlTrustTierBadge';

describe('HITL trust tier mapping', () => {
  it('maps review states to advisory trust tiers', () => {
    expect(reviewStateToHitlTier('approved-public-projection')).toBe('AUTO');
    expect(reviewStateToHitlTier('approved-private-use')).toBe('AUTO');
    expect(reviewStateToHitlTier('held')).toBe('NOTIFY');
    expect(reviewStateToHitlTier('rejected')).toBe('BLOCK');
    expect(reviewStateToHitlTier('blocked')).toBe('BLOCK');
    expect(reviewStateToHitlTier('pending-review')).toBe('HITL');
  });
});
