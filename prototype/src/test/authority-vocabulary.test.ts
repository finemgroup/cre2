import { describe, expect, it } from 'vitest';

import {
  ALL_AUTHORITY_POSTURES,
  formatStatusBadge,
  formatTrustBadgeState,
  getPublicAuthorityLabel,
  isExportBlockingPosture,
  normalizeAuthorityPosture,
  toStudioTrustPosture,
} from '@/lib/authority/authority-vocabulary';

describe('authority vocabulary', () => {
  it('maps every public authority label to a display string and studio posture', () => {
    for (const label of ALL_AUTHORITY_POSTURES) {
      expect(getPublicAuthorityLabel(label)).toMatch(/\S/);
      expect(toStudioTrustPosture(label)).toMatch(/\S/);
    }
  });

  it('normalizes public label strings for trust badge formatting', () => {
    expect(normalizeAuthorityPosture('Candidate evidence')).toBe('candidate-evidence');
    expect(normalizeAuthorityPosture('sample-map-data')).toBe('sample-map-data');
    expect(normalizeAuthorityPosture('Premium-private')).toBeNull();
  });

  it('formats trust badges from public labels and native studio states', () => {
    expect(formatTrustBadgeState('public-baseline')).toEqual({
      display: 'Public baseline',
      ariaLabel: 'Authority state: Public baseline',
    });
    expect(formatTrustBadgeState('Needs review')).toEqual({
      display: 'Needs review',
      ariaLabel: 'Authority state: Needs review',
    });
  });

  it('flags export-blocking postures consistently', () => {
    expect(isExportBlockingPosture('blocked')).toBe(true);
    expect(isExportBlockingPosture('Candidate evidence')).toBe(true);
    expect(isExportBlockingPosture('reviewer-required')).toBe(true);
    expect(isExportBlockingPosture('reviewed')).toBe(false);
    expect(isExportBlockingPosture('Public baseline')).toBe(false);
    expect(isExportBlockingPosture('sample-map-data')).toBe(false);
  });

  it('formats status badges through shared vocabulary when recognized', () => {
    expect(formatStatusBadge('Policy blocked')).toEqual({
      display: 'Policy blocked',
      ariaLabel: 'Status: Policy blocked',
      classSuffix: 'blocked',
    });
    expect(formatStatusBadge('table view').display).toBe('table view');
  });
});
