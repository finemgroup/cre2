import { describe, expect, it } from 'vitest';

import { fixtureActors, fixtureObservations, PRIVATE_SENTINELS } from '@/lib/contracts/fixtures';
import { resolveFieldForActor } from '@/lib/contracts/evidence';
import { decideVisibility } from '@/lib/contracts/visibility';
import { createReceipt, resetReceiptStore } from '@/lib/contracts/receipts';

function expectNoPrivateSentinels(value: unknown): void {
  const serialized = JSON.stringify(value);
  for (const sentinel of PRIVATE_SENTINELS) {
    expect(serialized).not.toContain(sentinel);
  }
}

describe('redaction contract simulator', () => {
  it('does not leak hidden private values through public resolved fields', () => {
    const resolved = resolveFieldForActor(
      fixtureActors.public,
      'demo-001',
      'acreage',
      fixtureObservations
    );

    expectNoPrivateSentinels(resolved);
    expect(resolved?.safeExplanation).toMatch(/hidden|not available/i);
  });

  it('uses safe denial explanations without confirming hidden facts', () => {
    const decision = decideVisibility(fixtureActors.public, {
      visibility: 'organization-private',
      organizationId: 'org-finem',
    });

    expect(decision.decision).toBe('redact');
    expectNoPrivateSentinels(decision);
  });

  it('redacts evidence refs in public receipts', () => {
    resetReceiptStore();
    const receipt = createReceipt({
      actor: fixtureActors.public,
      kind: 'blocked',
      targetId: 'export-demo-001',
      idempotencyKey: 'export-blocked-001',
      policyDecision: 'blocked',
      evidenceRefs: ['evidence-private-rent-roll', 'raw-provider-payload'],
    });

    expect(receipt.redactedEvidenceRefs).toHaveLength(2);
    expectNoPrivateSentinels(receipt);
    expect(JSON.stringify(receipt)).not.toContain('raw-provider-payload');
  });
});
