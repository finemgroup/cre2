import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import { assertReceiptIsRedacted, createReceipt, resetReceiptStore } from '@/lib/contracts/receipts';

describe('export receipt idempotency contract simulator', () => {
  it('returns the same receipt for replayed idempotency keys', () => {
    resetReceiptStore();
    const first = createReceipt({
      actor: fixtureActors.orgAdmin,
      targetId: 'report-riverside-flats',
      kind: 'export',
      idempotencyKey: 'export-123',
      policyDecision: 'allowed',
      evidenceRefs: ['evidence-org-survey'],
    });
    const replay = createReceipt({
      actor: fixtureActors.orgAdmin,
      targetId: 'report-riverside-flats',
      kind: 'export',
      idempotencyKey: 'export-123',
      policyDecision: 'allowed',
      evidenceRefs: ['evidence-org-survey'],
    });

    expect(replay).toEqual(first);
    expect(assertReceiptIsRedacted(replay)).toBe(true);
  });

  it('records blocked exports as receipts instead of artifact success', () => {
    resetReceiptStore();
    const receipt = createReceipt({
      actor: fixtureActors.public,
      targetId: 'report-demo-001',
      kind: 'blocked',
      idempotencyKey: 'blocked-001',
      policyDecision: 'blocked',
      evidenceRefs: ['evidence-private-rent-roll'],
      safeMessage: 'Export blocked by source-rights policy.',
    });

    expect(receipt.policyDecision).toBe('blocked');
    expect(receipt.kind).toBe('blocked');
    expect(receipt.safeMessage).toMatch(/blocked/i);
  });
});
