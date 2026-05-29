import { describe, expect, it } from 'vitest';

import { getRouteLoadingCopy, resolveRouteLoadingVariant } from '@/lib/studio/route-loading';

describe('route loading variants', () => {
  it('maps public property routes to the public loading family', () => {
    expect(resolveRouteLoadingVariant('/property/demo-001')).toBe('public');
    expect(getRouteLoadingCopy('public').title).toMatch(/property intelligence/i);
  });

  it('maps studio deal routes to the deal workstation family', () => {
    expect(resolveRouteLoadingVariant('/studio/deals/riverside-flats/underwriting')).toBe(
      'studio-deal'
    );
    expect(getRouteLoadingCopy('studio-deal').title).toMatch(/deal workstation/i);
  });

  it('maps report builder routes to the report loading family', () => {
    expect(resolveRouteLoadingVariant('/studio/reports/riverside-flats/builder')).toBe(
      'studio-report'
    );
    expect(getRouteLoadingCopy('studio-report').title).toMatch(/report assembly/i);
  });

  it('maps broker os to the operator loading family', () => {
    expect(resolveRouteLoadingVariant('/studio/broker-os')).toBe('studio-operator');
    expect(getRouteLoadingCopy('studio-operator').title).toMatch(/operator inventory/i);
  });
});
