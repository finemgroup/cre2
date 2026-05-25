import { describe, expect, it } from 'vitest';

import { getPublicRouteTitle, getStudioRouteTitle } from '@/lib/a11y/routeTitles';

describe('routeTitles', () => {
  it('maps public routes to document titles', () => {
    expect(getPublicRouteTitle('/')).toBe('Search - Sophex');
    expect(getPublicRouteTitle('/property/demo-001')).toBe('Property Intelligence - Sophex');
    expect(getPublicRouteTitle('/property/demo-001/comps')).toBe('Comparable Sales - Sophex');
    expect(getPublicRouteTitle('/export/demo-001')).toBe('Export Gate - Sophex');
  });

  it('maps studio routes to deal-aware document titles', () => {
    expect(getStudioRouteTitle('/studio')).toBe('Finem CRE Studio');
    expect(getStudioRouteTitle('/studio/onboarding')).toBe('Onboarding - Finem CRE Studio');
    expect(getStudioRouteTitle('/studio/deals/riverside-flats/comps')).toBe(
      'Comps - Riverside Flats - Finem CRE Studio'
    );
    expect(getStudioRouteTitle('/studio/reports/1200-tech/builder')).toBe(
      'Report Builder - 1200 Tech Boulevard - Finem CRE Studio'
    );
  });
});
