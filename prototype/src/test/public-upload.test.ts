import { describe, expect, it } from 'vitest';

import { getPublicUploadGuideView } from '@/lib/runtime/public-upload';

describe('getPublicUploadGuideView', () => {
  it('returns upload stages and linked studio deal for a property', () => {
    const view = getPublicUploadGuideView('demo-001');

    expect(view.propertyId).toBe('demo-001');
    expect(view.linkedDealId).toBe('riverside-flats');
    expect(view.supportedTypes.length).toBeGreaterThan(0);
    expect(view.stages).toHaveLength(4);
  });
});
