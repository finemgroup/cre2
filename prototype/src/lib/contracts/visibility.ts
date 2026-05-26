import {
  hasEntitlement,
  hasPartnerScope,
  isInternalOperator,
  isSameOrganization,
  isSourceOwner,
  type ActorContext,
} from '@/lib/contracts/actor-context';

export type VisibilityClass =
  | 'public-baseline'
  | 'user-private'
  | 'organization-private'
  | 'shared-with-permission'
  | 'anonymized-aggregate'
  | 'internal-only'
  | 'provider-restricted';

export type VisibilityDecisionKind =
  | 'allow'
  | 'deny'
  | 'redact'
  | 'aggregate-only'
  | 'hold-for-review';

export type VisibilitySubject = {
  visibility: VisibilityClass;
  sourceOwnerId?: string;
  organizationId?: string;
  requiredEntitlement?: string;
  requiredPartnerScope?: string;
  reviewState?: string;
  exportEligible?: boolean;
};

export type VisibilityDecision = {
  decision: VisibilityDecisionKind;
  label: string;
  reason: string;
  safeExplanation: string;
};

export function decideVisibility(
  actor: ActorContext,
  subject: VisibilitySubject
): VisibilityDecision {
  if (subject.reviewState === 'publication-hold') {
    return hold('Publication hold', 'Held for source-rights or reviewer approval.');
  }

  switch (subject.visibility) {
    case 'public-baseline':
      return allow(
        'Public baseline',
        'Visible because it is public baseline or approved aggregate.'
      );
    case 'anonymized-aggregate':
      return aggregateOnly('Anonymized aggregate', 'Only aggregate output is available.');
    case 'user-private':
      if (isSourceOwner(actor, subject.sourceOwnerId) || isInternalOperator(actor)) {
        return allow('User-private', 'Visible to the source owner or internal reviewer.');
      }
      return redact('Private observation', 'Private source details are hidden.');
    case 'organization-private':
      if (isSameOrganization(actor, subject.organizationId) || isInternalOperator(actor)) {
        return allow('Organization-private', 'Visible to the authorized organization.');
      }
      return redact('Organization-private', 'Organization-private details are hidden.');
    case 'shared-with-permission':
      if (
        isInternalOperator(actor) ||
        (subject.requiredEntitlement && actor.entitlements.includes(subject.requiredEntitlement))
      ) {
        return allow('Shared with permission', 'Visible through an explicit permission grant.');
      }
      return deny('Permission required', 'This source requires an explicit sharing grant.');
    case 'provider-restricted':
      if (
        isInternalOperator(actor) ||
        (subject.requiredEntitlement && hasEntitlement(actor, subject.requiredEntitlement)) ||
        (subject.requiredPartnerScope && hasPartnerScope(actor, subject.requiredPartnerScope))
      ) {
        return allow('Provider-restricted', 'Visible under provider rights and actor scope.');
      }
      return deny('Provider-restricted', 'Provider-restricted data is not available in this view.');
    case 'internal-only':
      if (isInternalOperator(actor)) {
        return allow('Internal-only', 'Visible to internal operators only.');
      }
      return redact('Internal-only', 'Internal review details are hidden.');
  }
}

function allow(label: string, safeExplanation: string): VisibilityDecision {
  return { decision: 'allow', label, reason: label, safeExplanation };
}

function deny(label: string, safeExplanation: string): VisibilityDecision {
  return { decision: 'deny', label, reason: label, safeExplanation };
}

function redact(label: string, safeExplanation: string): VisibilityDecision {
  return { decision: 'redact', label, reason: label, safeExplanation };
}

function aggregateOnly(label: string, safeExplanation: string): VisibilityDecision {
  return { decision: 'aggregate-only', label, reason: label, safeExplanation };
}

function hold(label: string, safeExplanation: string): VisibilityDecision {
  return { decision: 'hold-for-review', label, reason: label, safeExplanation };
}
