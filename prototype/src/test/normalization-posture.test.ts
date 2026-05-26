import { describe, expect, it } from 'vitest';

import { summarizeNormalizationPosture } from '@/lib/evidence/normalization-posture';
import type { NormalizationCandidateRow } from '@/lib/staged-import';

const SAMPLE_ROWS: NormalizationCandidateRow[] = [
  {
    id: 'a',
    field: 'Unit count',
    extracted: 'conflict',
    normalized: '195',
    source: 'OM',
    confidence: 'Medium',
    posture: 'Blocked',
  },
  {
    id: 'b',
    field: 'T12 revenue',
    extracted: '$7.52M',
    normalized: '$7.52M',
    source: 'T12',
    confidence: 'High',
    posture: 'Reviewed',
  },
  {
    id: 'c',
    field: 'Insurance',
    extracted: '$185k',
    normalized: '$185k',
    source: 'Broker',
    confidence: 'Low',
    posture: 'Source pending',
  },
];

describe('summarizeNormalizationPosture', () => {
  it('counts reviewed, blocked, and open posture rows', () => {
    expect(summarizeNormalizationPosture(SAMPLE_ROWS)).toEqual({
      reviewed: 1,
      blocked: 1,
      open: 2,
      total: 3,
    });
  });

  it('returns zero counts for an empty candidate set', () => {
    expect(summarizeNormalizationPosture([])).toEqual({
      reviewed: 0,
      blocked: 0,
      open: 0,
      total: 0,
    });
  });
});
