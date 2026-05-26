import { describe, expect, it } from 'vitest';

import { summarizeEvidenceTracePosture } from '@/lib/evidence/trace-posture';
import type { EvidenceTraceItem } from '@/components/workstation/UnderwritingWorkstationPrimitives';

const SAMPLE_ITEMS: EvidenceTraceItem[] = [
  {
    id: 'a',
    label: 'Reviewed field',
    value: '1',
    posture: 'Reviewed',
    sourceRef: 'ref-a',
    asOf: '2026-05-20',
    confidence: 'High',
    detail: 'Reviewed',
  },
  {
    id: 'b',
    label: 'Blocked field',
    value: '2',
    posture: 'Blocked',
    sourceRef: 'ref-b',
    asOf: '2026-05-20',
    confidence: 'Low',
    detail: 'Blocked',
  },
  {
    id: 'c',
    label: 'Candidate field',
    value: '3',
    posture: 'Candidate evidence',
    sourceRef: 'ref-c',
    asOf: '2026-05-20',
    confidence: 'Medium',
    detail: 'Candidate',
  },
];

describe('summarizeEvidenceTracePosture', () => {
  it('counts reviewed and open posture rows', () => {
    expect(summarizeEvidenceTracePosture(SAMPLE_ITEMS)).toEqual({
      reviewed: 1,
      open: 2,
      total: 3,
    });
  });

  it('returns zero counts for an empty trace set', () => {
    expect(summarizeEvidenceTracePosture([])).toEqual({
      reviewed: 0,
      open: 0,
      total: 0,
    });
  });
});
