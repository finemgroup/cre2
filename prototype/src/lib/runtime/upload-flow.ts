import type { ActorContext } from '@/lib/contracts/actor-context';
import { createReceipt, type GovernedReceipt } from '@/lib/contracts/receipts';
import type { EvidenceIdentity } from '@/lib/contracts/evidence';

export type CandidateUploadResult = {
  evidence: EvidenceIdentity;
  receipt: GovernedReceipt;
};

export function createCandidateUpload(input: {
  actor: ActorContext;
  propertyId: string;
  fileName: string;
  idempotencyKey: string;
}): CandidateUploadResult {
  const evidenceId = `candidate-${slug(input.fileName)}`;
  const evidence: EvidenceIdentity = {
    id: evidenceId,
    sourceFamily: 'user-upload',
    propertyId: input.propertyId,
    sourceOwnerId: input.actor.sourceOwnerId ?? input.actor.id,
    organizationId: input.actor.organizationId,
    visibility: 'user-private',
    sourceUsePolicy: 'private-use',
    digest: `sha256-prototype-${slug(input.fileName)}`,
    reviewState: 'candidate',
    receiptRefs: [],
  };
  const receipt = createReceipt({
    actor: input.actor,
    kind: 'upload',
    targetId: evidence.id,
    idempotencyKey: input.idempotencyKey,
    policyDecision: 'allowed',
    evidenceRefs: [evidence.id],
    safeMessage: 'Candidate evidence created for review.',
  });

  return {
    evidence: { ...evidence, receiptRefs: [receipt.id] },
    receipt,
  };
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
