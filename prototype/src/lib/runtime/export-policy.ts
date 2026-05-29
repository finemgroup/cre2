import type { ActorContext } from '@/lib/contracts/actor-context';
import { createReceipt, type GovernedReceipt } from '@/lib/contracts/receipts';
import type { ExportReadiness } from '@/lib/report-governance';

export type ExportScope = 'preview' | 'download' | 'share' | 'partner-delivery';

export type ExportManifest = {
  id: string;
  status: 'draft-preview' | 'approved' | 'blocked';
  includedSectionIds: string[];
  redactedEvidenceRefs: string[];
  excludedReasonCount: number;
  checksum: string;
  actorScope: ActorContext['actorClass'];
  receiptRef: string;
  safeSummary: string;
};

export type ExportPolicyDecision = {
  allowed: boolean;
  scope: ExportScope;
  blockerCategories: string[];
  safeMessage: string;
  receipt: GovernedReceipt;
  exportManifest?: ExportManifest;
};

export function evaluateExportPolicy(input: {
  actor: ActorContext;
  reportId: string;
  scope: ExportScope;
  readiness: ExportReadiness;
  consent: boolean;
  idempotencyKey: string;
}): ExportPolicyDecision {
  const blockerCategories: string[] = [];
  if (!input.consent && input.scope !== 'preview') blockerCategories.push('consent');
  if (!input.readiness.ready && input.scope !== 'preview') blockerCategories.push('source-rights');
  if (input.scope === 'partner-delivery' && input.actor.actorClass !== 'partner-api') {
    blockerCategories.push('partner-scope');
  }

  const allowed = blockerCategories.length === 0;
  const receipt = createReceipt({
    actor: input.actor,
    targetId: input.reportId,
    kind: allowed ? 'export' : 'blocked',
    idempotencyKey: input.idempotencyKey,
    policyDecision: allowed ? 'allowed' : 'blocked',
    evidenceRefs: input.readiness.blockedReasons,
    safeMessage: allowed
      ? 'Export scope approved in prototype policy.'
      : 'Export blocked by consent, source-rights, or partner policy.',
  });
  const exportManifest =
    allowed || input.scope === 'preview'
      ? createExportManifest({
          actor: input.actor,
          reportId: input.reportId,
          scope: input.scope,
          receipt,
          readiness: input.readiness,
          blocked: !allowed,
        })
      : undefined;

  return {
    allowed,
    scope: input.scope,
    blockerCategories,
    safeMessage: receipt.safeMessage,
    receipt,
    exportManifest,
  };
}

function createExportManifest(input: {
  actor: ActorContext;
  reportId: string;
  scope: ExportScope;
  receipt: GovernedReceipt;
  readiness: ExportReadiness;
  blocked: boolean;
}): ExportManifest {
  const includedSectionIds = Array.from(
    { length: input.readiness.approvedCount },
    (_value, index) => `section-${index + 1}`
  );
  const status = input.scope === 'preview' || input.blocked ? 'draft-preview' : 'approved';

  return {
    id: `manifest-${input.reportId}-${input.scope}`,
    status,
    includedSectionIds,
    redactedEvidenceRefs: input.receipt.redactedEvidenceRefs,
    excludedReasonCount: input.readiness.blockedReasons.length,
    checksum: input.readiness.receiptHash ?? input.receipt.correlationId,
    actorScope: input.actor.actorClass,
    receiptRef: input.receipt.id,
    safeSummary:
      status === 'approved'
        ? 'Approved-only export manifest generated for prototype policy.'
        : 'Draft preview manifest; download/share remains governed by readiness gates.',
  };
}
