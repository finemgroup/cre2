import { describe, expect, it } from 'vitest';

import { evaluateExportReadiness } from '@/lib/report-governance';
import { mockSourceBlocks } from '@/lib/source-bundle';

describe('evaluateExportReadiness', () => {
  const approvedSection = { id: 'summary', name: 'Executive summary', status: 'Approved' };

  it('fails closed when source blocks are omitted', () => {
    const readiness = evaluateExportReadiness([approvedSection]);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockedReasons[0]).toMatch(/Source bundle context is required/i);
  });

  it('fails closed when source blocks are empty', () => {
    const readiness = evaluateExportReadiness([approvedSection], []);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockedReasons[0]).toMatch(/no evidence blocks/i);
  });

  it('evaluates readiness from explicit source blocks', () => {
    const readyBlocks = mockSourceBlocks.map((block) => ({
      ...block,
      posture: 'ready' as const,
      missingCitations: undefined,
    }));
    const readiness = evaluateExportReadiness([approvedSection], readyBlocks);
    expect(readiness.ready).toBe(true);
    expect(readiness.receiptHash).toMatch(/sha256/);
  });
});
