export type ActorClass =
  | 'anonymous'
  | 'free-contributor'
  | 'paid-user'
  | 'source-owner'
  | 'org-member'
  | 'org-admin'
  | 'internal-operator'
  | 'partner-api';

export type ActorPurpose =
  | 'search'
  | 'evidence-panel'
  | 'comp-comparison'
  | 'valuation'
  | 'report'
  | 'export'
  | 'admin-review'
  | 'partner-api';

export type ActorContext = {
  id: string;
  actorClass: ActorClass;
  organizationId?: string;
  sourceOwnerId?: string;
  entitlements: string[];
  partnerScopes?: string[];
  purpose: ActorPurpose;
};

export const PUBLIC_ACTOR: ActorContext = {
  id: 'public-anonymous',
  actorClass: 'anonymous',
  entitlements: [],
  purpose: 'search',
};

export function hasEntitlement(actor: ActorContext, entitlement: string): boolean {
  return actor.entitlements.includes(entitlement);
}

export function hasPartnerScope(actor: ActorContext, scope: string): boolean {
  return actor.actorClass === 'partner-api' && Boolean(actor.partnerScopes?.includes(scope));
}

export function isInternalOperator(actor: ActorContext): boolean {
  return actor.actorClass === 'internal-operator';
}

export function isSameOrganization(actor: ActorContext, organizationId?: string): boolean {
  return Boolean(organizationId && actor.organizationId === organizationId);
}

export function isSourceOwner(actor: ActorContext, sourceOwnerId?: string): boolean {
  return Boolean(sourceOwnerId && actor.sourceOwnerId === sourceOwnerId);
}
