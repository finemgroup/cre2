import { describe, expect, it } from 'vitest';

import { getPublicCompViews } from '@/lib/runtime/public-comps';
import { getStudioCompViews } from '@/lib/runtime/studio-workspace';
import {
  filterPublicComps,
  filterStudioComps,
  PUBLIC_COMP_SAVED_VIEWS,
  STUDIO_COMP_SAVED_VIEWS,
} from '@/lib/comps/comp-saved-views';

describe('comp saved views', () => {
  it('exposes public and studio saved view presets', () => {
    expect(PUBLIC_COMP_SAVED_VIEWS.length).toBeGreaterThan(1);
    expect(STUDIO_COMP_SAVED_VIEWS.length).toBeGreaterThan(1);
  });

  it('filters public comps by inspectable and nearby presets', () => {
    const comps = getPublicCompViews();
    const inspectable = filterPublicComps(comps, 'inspectable');
    const nearby = filterPublicComps(comps, 'nearby');

    expect(inspectable.every((comp) => comp.canInspect)).toBe(true);
    expect(nearby.every((comp) => comp.distanceMi <= 1)).toBe(true);
  });

  it('filters studio comps by visible and reviewed presets', () => {
    const comps = getStudioCompViews();
    const visible = filterStudioComps(comps, 'inspectable');
    const reviewed = filterStudioComps(comps, 'reviewed');

    expect(visible.every((comp) => comp.visible)).toBe(true);
    expect(
      reviewed.every(
        (comp) => comp.authority === 'Reviewed' || comp.authority === 'Premium-private'
      )
    ).toBe(true);
  });

  it('can produce an empty filtered set for strict nearby filters', () => {
    const comps = getPublicCompViews().map((comp) => ({ ...comp, distanceMi: 5 }));
    expect(filterPublicComps(comps, 'nearby')).toHaveLength(0);
  });
});
