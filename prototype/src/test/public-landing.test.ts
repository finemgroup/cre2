import { describe, expect, it } from 'vitest';

import { getPublicLandingView } from '@/lib/runtime/public-landing';

describe('getPublicLandingView', () => {
  it('returns featured listings and marketplace counts from public search fixtures', () => {
    const view = getPublicLandingView();

    expect(view.totalListings).toBeGreaterThan(0);
    expect(view.marketCount).toBeGreaterThan(0);
    expect(view.featuredProperties.length).toBe(2);
    expect(view.sampleQueries.length).toBeGreaterThan(0);
  });
});
