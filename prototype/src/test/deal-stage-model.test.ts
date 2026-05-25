import { describe, expect, it } from 'vitest';

import {
  countOpenBlockers,
  getDealNextAction,
  getDealStageProgress,
  resolveDealStageFromPath,
} from '@/lib/workflow/deal-stage-model';

describe('deal stage model', () => {
  it('maps routes to workflow stages', () => {
    expect(resolveDealStageFromPath('/studio/deals/riverside-flats/intake')).toBe('Intake');
    expect(resolveDealStageFromPath('/studio/deals/riverside-flats/data-review')).toBe('Evidence');
    expect(resolveDealStageFromPath('/studio/deals/riverside-flats/underwriting')).toBe(
      'Underwriting'
    );
    expect(resolveDealStageFromPath('/studio/deals/riverside-flats/scenarios')).toBe('Scenarios');
    expect(resolveDealStageFromPath('/studio/deals/riverside-flats/versions')).toBe('Governance');
    expect(resolveDealStageFromPath('/studio/reports/riverside-flats/builder')).toBe('Delivery');
  });

  it('returns deterministic mock progress for demo deals', () => {
    expect(getDealStageProgress('riverside-flats').Evidence).toBe('blocked');
    expect(getDealStageProgress('1200-tech').Evidence).toBe('complete');
  });

  it('suggests a next action with resolution route', () => {
    const next = getDealNextAction('riverside-flats');
    expect(next.label).toMatch(/evidence|underwriting|snapshot|report/i);
    expect(next.to).toMatch(/^\/studio\//);
  });

  it('counts open blockers', () => {
    expect(countOpenBlockers(getDealStageProgress('riverside-flats'))).toBeGreaterThan(0);
  });
});
