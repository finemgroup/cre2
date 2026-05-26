import { describe, expect, it } from 'vitest';

import { summarizeCompProviderRights } from '@/lib/comps/comp-provider-rights';

describe('comp provider rights summary', () => {
  it('counts visible and provider-restricted comps', () => {
    const summary = summarizeCompProviderRights([
      { visible: true, authority: 'Reviewed' },
      { visible: false, authority: 'Premium-private' },
      { visible: true, authority: 'Public baseline' },
    ]);

    expect(summary).toEqual({ visible: 2, restricted: 1, total: 3 });
  });

  it('returns zero totals for an empty comp set', () => {
    expect(summarizeCompProviderRights([])).toEqual({ visible: 0, restricted: 0, total: 0 });
  });
});
