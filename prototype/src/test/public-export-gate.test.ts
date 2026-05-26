import { describe, expect, it } from 'vitest';

import { getPublicExportGateView } from '@/lib/runtime/public-export-gate';

describe('getPublicExportGateView', () => {
  it('returns export governance posture for known properties', () => {
    const view = getPublicExportGateView('demo-001');

    expect(view).toBeDefined();
    expect(view?.propertyId).toBe('demo-001');
    expect(view?.linkedDealId).toBe('riverside-flats');
    expect(view?.totalSections).toBeGreaterThan(0);
    expect(view?.scopes.length).toBe(4);
    expect(view?.governanceNote).toContain('fixture-only');
  });

  it('returns undefined for unknown properties', () => {
    expect(getPublicExportGateView('missing-property')).toBeUndefined();
  });
});
