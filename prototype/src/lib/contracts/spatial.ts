import type { ActorContext } from '@/lib/contracts/actor-context';
import type { ReviewState } from '@/lib/contracts/evidence';
import { decideVisibility, type VisibilityClass } from '@/lib/contracts/visibility';

export type SpatialPrecisionClass =
  | 'parcel'
  | 'approximate-centroid'
  | 'inferred-region'
  | 'custom-polygon'
  | 'sample-mock';

export type LocationVerificationState =
  | 'unverified'
  | 'provider-verified'
  | 'human-verified'
  | 'conflict'
  | 'sample';

export type MapLayerManifest = {
  id: string;
  label: string;
  sourceLabel: string;
  visibility: VisibilityClass;
  precisionClass: SpatialPrecisionClass;
  refreshedAt: string;
  reviewState: ReviewState;
  payloadSizeClass: 'metadata-only' | 'tiny-mock' | 'deferred-heavy';
  lazyLoadPolicy: 'initial-metadata' | 'on-toggle' | 'on-selection';
  allowedContexts: Array<'property' | 'comps' | 'report' | 'export'>;
  sourceRightsPolicy: 'public-use' | 'private-use' | 'provider-restricted' | 'sample-only';
  safeCaveat: string;
  organizationId?: string;
  requiredEntitlement?: string;
  requiredPartnerScope?: string;
};

export type PublicMapLayerProjection = {
  id: string;
  label: string;
  sourceLabel: string;
  precisionLabel: string;
  refreshedLabel: string;
  reviewLabel: string;
  payloadSizeClass: MapLayerManifest['payloadSizeClass'];
  lazyLoadPolicy: MapLayerManifest['lazyLoadPolicy'];
  safeCaveat: string;
  canLoadGeometry: boolean;
};

export type SpatialEvidence = {
  id: string;
  propertyId: string;
  layerId: string;
  label: string;
  coordinateRef: string;
  precisionClass: SpatialPrecisionClass;
  verificationState: LocationVerificationState;
  sourceLabel: string;
  visibility: VisibilityClass;
  reviewState: ReviewState;
  safeCaveat: string;
  organizationId?: string;
  requiredEntitlement?: string;
};

export type TradeArea = {
  id: string;
  propertyId: string;
  label: string;
  method: 'radius' | 'drive-time' | 'market-region' | 'custom-polygon';
  parametersLabel: string;
  sourceLabel: string;
  visibility: VisibilityClass;
  precisionClass: SpatialPrecisionClass;
  refreshedAt: string;
  permittedMetrics: string[];
  reportEligible: boolean;
  safeCaveat: string;
  organizationId?: string;
  requiredEntitlement?: string;
};

export const fixtureMapLayerManifests: MapLayerManifest[] = [
  {
    id: 'layer-public-centroid',
    label: 'Public property centroid',
    sourceLabel: 'Sample public records aggregate',
    visibility: 'public-baseline',
    precisionClass: 'approximate-centroid',
    refreshedAt: '2026-05-01',
    reviewState: 'approved-public-projection',
    payloadSizeClass: 'tiny-mock',
    lazyLoadPolicy: 'initial-metadata',
    allowedContexts: ['property', 'report'],
    sourceRightsPolicy: 'public-use',
    safeCaveat: 'Approximate centroid. Not a legal boundary.',
  },
  {
    id: 'layer-sample-comp-radius',
    label: 'Sample comp radius',
    sourceLabel: 'Prototype sample layer',
    visibility: 'public-baseline',
    precisionClass: 'sample-mock',
    refreshedAt: '2026-05-01',
    reviewState: 'approved-public-projection',
    payloadSizeClass: 'tiny-mock',
    lazyLoadPolicy: 'on-toggle',
    allowedContexts: ['comps', 'report'],
    sourceRightsPolicy: 'sample-only',
    safeCaveat: 'Sample map data for prototype comparison only.',
  },
  {
    id: 'layer-org-trade-area',
    label: 'Organization trade area',
    sourceLabel: 'User supplied private trade area',
    visibility: 'organization-private',
    precisionClass: 'custom-polygon',
    refreshedAt: '2026-05-03',
    reviewState: 'approved-private-use',
    payloadSizeClass: 'deferred-heavy',
    lazyLoadPolicy: 'on-selection',
    allowedContexts: ['comps', 'report'],
    sourceRightsPolicy: 'private-use',
    safeCaveat: 'Private layer. Do not expose outside the authorized organization.',
    organizationId: 'org-finem',
  },
  {
    id: 'layer-aggregate-demographics',
    label: 'Aggregate demographic context',
    sourceLabel: 'Sample aggregate layer',
    visibility: 'anonymized-aggregate',
    precisionClass: 'inferred-region',
    refreshedAt: '2026-04-15',
    reviewState: 'approved-public-projection',
    payloadSizeClass: 'metadata-only',
    lazyLoadPolicy: 'on-toggle',
    allowedContexts: ['property', 'comps', 'report'],
    sourceRightsPolicy: 'sample-only',
    safeCaveat: 'Aggregate only. Does not identify private contributor facts.',
  },
  {
    id: 'layer-provider-traffic',
    label: 'Provider traffic layer',
    sourceLabel: 'Provider restricted traffic feed',
    visibility: 'provider-restricted',
    precisionClass: 'inferred-region',
    refreshedAt: '2026-04-20',
    reviewState: 'approved-private-use',
    payloadSizeClass: 'deferred-heavy',
    lazyLoadPolicy: 'on-toggle',
    allowedContexts: ['report'],
    sourceRightsPolicy: 'provider-restricted',
    safeCaveat: 'Provider-restricted layer unavailable in this view.',
    requiredEntitlement: 'spatial-provider-preview',
  },
];

export const fixtureSpatialEvidence: SpatialEvidence[] = [
  {
    id: 'spatial-demo-001-centroid',
    propertyId: 'demo-001',
    layerId: 'layer-public-centroid',
    label: '1200 Commerce St map point',
    coordinateRef: 'mock:30.2672,-97.7431',
    precisionClass: 'approximate-centroid',
    verificationState: 'sample',
    sourceLabel: 'Sample public records aggregate',
    visibility: 'public-baseline',
    reviewState: 'approved-public-projection',
    safeCaveat: 'Approximate centroid. Not a legal boundary.',
  },
  {
    id: 'spatial-demo-001-conflict',
    propertyId: 'demo-001',
    layerId: 'layer-org-trade-area',
    label: 'Private survey variance',
    coordinateRef: 'mock:private-org-survey',
    precisionClass: 'custom-polygon',
    verificationState: 'conflict',
    sourceLabel: 'Organization private survey',
    visibility: 'organization-private',
    reviewState: 'approved-private-use',
    safeCaveat: 'Private coordinate variance requires reviewer reconciliation.',
    organizationId: 'org-finem',
  },
  {
    id: 'spatial-demo-002-centroid',
    propertyId: 'demo-002',
    layerId: 'layer-public-centroid',
    label: '4400 Research Blvd map point',
    coordinateRef: 'mock:30.3072,-97.7560',
    precisionClass: 'approximate-centroid',
    verificationState: 'unverified',
    sourceLabel: 'Sample public records aggregate',
    visibility: 'public-baseline',
    reviewState: 'candidate',
    safeCaveat: 'Unverified approximate centroid. Not a legal boundary.',
  },
];

export const fixtureTradeAreas: TradeArea[] = [
  {
    id: 'trade-demo-001-sample-radius',
    propertyId: 'demo-001',
    label: 'Sample 3-mile comp radius',
    method: 'radius',
    parametersLabel: '3 mile radius',
    sourceLabel: 'Prototype sample radius',
    visibility: 'public-baseline',
    precisionClass: 'sample-mock',
    refreshedAt: '2026-05-01',
    permittedMetrics: ['visible comps', 'sample cap-rate band'],
    reportEligible: true,
    safeCaveat: 'Sample trade area. Not a market study or legal boundary.',
  },
  {
    id: 'trade-demo-001-org-custom',
    propertyId: 'demo-001',
    label: 'Private broker trade area',
    method: 'custom-polygon',
    parametersLabel: 'Broker supplied polygon',
    sourceLabel: 'Organization private upload',
    visibility: 'organization-private',
    precisionClass: 'custom-polygon',
    refreshedAt: '2026-05-03',
    permittedMetrics: ['private comp overlap'],
    reportEligible: true,
    safeCaveat: 'Private organization trade area.',
    organizationId: 'org-finem',
  },
  {
    id: 'trade-demo-001-provider-drive-time',
    propertyId: 'demo-001',
    label: 'Provider drive-time context',
    method: 'drive-time',
    parametersLabel: '10 minute drive time',
    sourceLabel: 'Provider restricted routing feed',
    visibility: 'provider-restricted',
    precisionClass: 'inferred-region',
    refreshedAt: '2026-04-20',
    permittedMetrics: ['provider traffic estimate'],
    reportEligible: false,
    safeCaveat: 'Provider rights block public report use.',
    requiredEntitlement: 'spatial-provider-preview',
  },
];

export function getMapLayerManifestsForActor(
  actor: ActorContext,
  context: 'property' | 'comps' | 'report' | 'export'
): PublicMapLayerProjection[] {
  return fixtureMapLayerManifests
    .filter((layer) => layer.allowedContexts.includes(context))
    .map((layer) => ({ layer, decision: decideVisibility(actor, layer) }))
    .filter(({ decision }) => decision.decision === 'allow' || decision.decision === 'aggregate-only')
    .map(({ layer }) => ({
      id: layer.id,
      label: layer.label,
      sourceLabel: layer.sourceLabel,
      precisionLabel: precisionLabel(layer.precisionClass),
      refreshedLabel: `As of ${layer.refreshedAt}`,
      reviewLabel: reviewLabel(layer.reviewState),
      payloadSizeClass: layer.payloadSizeClass,
      lazyLoadPolicy: layer.lazyLoadPolicy,
      safeCaveat: layer.safeCaveat,
      canLoadGeometry: layer.payloadSizeClass !== 'metadata-only',
    }));
}

export function getSpatialEvidenceForActor(
  actor: ActorContext,
  propertyId: string
): SpatialEvidence[] {
  return fixtureSpatialEvidence.filter((evidence) => {
    if (evidence.propertyId !== propertyId) return false;
    const decision = decideVisibility(actor, evidence);
    return decision.decision === 'allow' || decision.decision === 'aggregate-only';
  });
}

export function getTradeAreasForActor(actor: ActorContext, propertyId: string): TradeArea[] {
  return fixtureTradeAreas.filter((tradeArea) => {
    if (tradeArea.propertyId !== propertyId || !tradeArea.reportEligible) return false;
    const decision = decideVisibility(actor, tradeArea);
    return decision.decision === 'allow' || decision.decision === 'aggregate-only';
  });
}

export function precisionLabel(precisionClass: SpatialPrecisionClass): string {
  switch (precisionClass) {
    case 'parcel':
      return 'Parcel-level source';
    case 'approximate-centroid':
      return 'Approximate centroid';
    case 'inferred-region':
      return 'Inferred region';
    case 'custom-polygon':
      return 'Custom polygon';
    case 'sample-mock':
      return 'Sample map data';
  }
}

export function verificationLabel(state: LocationVerificationState): string {
  switch (state) {
    case 'unverified':
      return 'Unverified location';
    case 'provider-verified':
      return 'Provider verified';
    case 'human-verified':
      return 'Human verified';
    case 'conflict':
      return 'Coordinate conflict';
    case 'sample':
      return 'Sample location';
  }
}

function reviewLabel(reviewState: ReviewState): string {
  if (reviewState === 'approved-public-projection') return 'Approved public projection';
  if (reviewState === 'approved-private-use') return 'Approved private-use';
  if (reviewState === 'candidate') return 'Review pending';
  return 'Review required';
}
