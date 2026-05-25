import { describe, expect, it } from 'vitest';

import {
  isExportBlockingPosture,
  toStudioTrustPosture,
} from '@/lib/authority/authority-vocabulary';

describe('authority vocabulary', () => {
  it('maps public authority labels to studio trust posture', () => {
    expect(toStudioTrustPosture('public-baseline')).toBe('Public baseline');
    expect(toStudioTrustPosture('candidate-evidence')).toBe('Candidate evidence');
  });

  it('flags export-blocking postures consistently', () => {
    expect(isExportBlockingPosture('blocked')).toBe(true);
    expect(isExportBlockingPosture('Candidate evidence')).toBe(true);
    expect(isExportBlockingPosture('reviewed')).toBe(false);
    expect(isExportBlockingPosture('Public baseline')).toBe(false);
  });
});
