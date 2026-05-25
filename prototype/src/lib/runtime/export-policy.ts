import type { ActorContext } from '@/lib/contracts/actor-context';
import { createReceipt, type GovernedReceipt } from '@/lib/contracts/receipts';
import type { ExportReadiness } from '@/lib/report-governance';

export type ExportScope = 'preview' | 'download' | 'share' | 'partner-delivery';

export type ExportPolicyDecision = {
  allowed: boolean;
  scope: ExportScope;
  blockerCategories: string[];
  safeMessage: string;
  receipt: GovernedReceipt;
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

  return {
    allowed,
    scope: input.scope,
    blockerCategories,
    safeMessage: receipt.safeMessage,
    receipt,
  };
}
