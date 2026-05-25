import type { ActorContext } from '@/lib/contracts/actor-context';

export type ReceiptKind =
  | 'upload'
  | 'extraction'
  | 'review'
  | 'promotion'
  | 'report-generation'
  | 'export'
  | 'share'
  | 'blocked';

export type GovernedReceipt = {
  id: string;
  kind: ReceiptKind;
  actorId: string;
  targetId: string;
  policyDecision: 'allowed' | 'blocked' | 'redacted';
  idempotencyKey: string;
  correlationId: string;
  redactedEvidenceRefs: string[];
  safeMessage: string;
};

const receiptStore = new Map<string, GovernedReceipt>();

export function resetReceiptStore(): void {
  receiptStore.clear();
}

export function createReceipt(input: {
  actor: ActorContext;
  targetId: string;
  kind: ReceiptKind;
  idempotencyKey: string;
  policyDecision: GovernedReceipt['policyDecision'];
  evidenceRefs?: string[];
  safeMessage?: string;
}): GovernedReceipt {
  const replayKey = `${input.actor.id}:${input.kind}:${input.targetId}:${input.idempotencyKey}`;
  const existing = receiptStore.get(replayKey);
  if (existing) return existing;

  const receipt: GovernedReceipt = {
    id: `rcpt_${hashLike(replayKey)}`,
    kind: input.kind,
    actorId: input.actor.id,
    targetId: input.targetId,
    policyDecision: input.policyDecision,
    idempotencyKey: input.idempotencyKey,
    correlationId: `corr_${hashLike(`${replayKey}:correlation`)}`,
    redactedEvidenceRefs: (input.evidenceRefs ?? []).map((ref) => `evidence:${hashLike(ref)}`),
    safeMessage: input.safeMessage ?? 'Governed prototype action recorded.',
  };
  receiptStore.set(replayKey, receipt);
  return receipt;
}

export function assertReceiptIsRedacted(receipt: GovernedReceipt): boolean {
  return receipt.redactedEvidenceRefs.every((ref) => !ref.includes('private') && !ref.includes('raw'));
}

function hashLike(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16).padStart(8, '0').slice(0, 8);
}
