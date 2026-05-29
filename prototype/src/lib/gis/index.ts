import type { ActorContext } from '@/lib/contracts/actor-context';
import { decideVisibility } from '@/lib/contracts/visibility';
import type { VisibilityDecisionKind } from '@/lib/contracts/visibility';
import {
  evaluateSpatialSourceClear,
  fixtureMapLayerManifests,
  getMapLayerManifestsForActor,
  getSpatialEvidenceForActor,
  getTradeAreasForActor,
  precisionLabel,
  verificationLabel,
  type MapLayerManifest,
  type SpatialEvidence,
  type TradeArea,
} from '@/lib/contracts/spatial';

export type GisManifestSummary = {
  layerCount: number;
  reportEligibleTradeAreas: number;
  blockedLayers: string[];
  warnings: string[];
  spatialSourceClear: boolean;
};

export type SourceRightsEntry = {
  layerId: string;
  label: string;
  policy: MapLayerManifest['sourceRightsPolicy'];
  decision: VisibilityDecisionKind;
  safeExplanation: string;
};

export type VerificationSummary = {
  propertyId: string;
  totalEvidence: number;
  conflicts: number;
  unverified: number;
  items: Array<{
    label: string;
    state: string;
    caveat: string;
  }>;
};

export function summarizeGisManifest(
  actor: ActorContext,
  context: 'property' | 'comps' | 'report' | 'export',
  propertyId: string
): GisManifestSummary {
  const layers = getMapLayerManifestsForActor(actor, context);
  const blockedLayers = fixtureMapLayerManifests
    .filter((layer) => layer.allowedContexts.includes(context))
    .filter((layer) => decideVisibility(actor, layer).decision === 'deny')
    .map((layer) => layer.label);
  const warnings = layers
    .filter((layer) => layer.payloadSizeClass === 'deferred-heavy')
    .map((layer) => `${layer.label} geometry deferred in prototype.`);

  return {
    layerCount: layers.length,
    reportEligibleTradeAreas: getTradeAreasForActor(actor, propertyId).length,
    blockedLayers,
    warnings,
    spatialSourceClear: evaluateSpatialSourceClear(actor, propertyId),
  };
}

export function evaluateSourceRightsManifest(
  actor: ActorContext,
  context: 'property' | 'comps' | 'report' | 'export'
): SourceRightsEntry[] {
  return fixtureMapLayerManifests
    .filter((layer) => layer.allowedContexts.includes(context))
    .map((layer) => {
      const decision = decideVisibility(actor, layer);
      return {
        layerId: layer.id,
        label: layer.label,
        policy: layer.sourceRightsPolicy,
        decision: decision.decision,
        safeExplanation: decision.safeExplanation,
      };
    });
}

export function getVerificationSummary(
  actor: ActorContext,
  propertyId: string
): VerificationSummary {
  const evidence = getSpatialEvidenceForActor(actor, propertyId);
  return {
    propertyId,
    totalEvidence: evidence.length,
    conflicts: evidence.filter((item) => item.verificationState === 'conflict').length,
    unverified: evidence.filter((item) => item.verificationState === 'unverified').length,
    items: evidence.map((item) => ({
      label: item.label,
      state: verificationLabel(item.verificationState),
      caveat: item.safeCaveat,
    })),
  };
}

export function listTradeAreasForReport(actor: ActorContext, propertyId: string): TradeArea[] {
  return getTradeAreasForActor(actor, propertyId);
}

export function listSpatialEvidence(actor: ActorContext, propertyId: string): SpatialEvidence[] {
  return getSpatialEvidenceForActor(actor, propertyId);
}

export function formatLayerManifestRow(layer: MapLayerManifest): string[] {
  return [
    layer.label,
    layer.sourceLabel,
    layer.sourceRightsPolicy,
    precisionLabel(layer.precisionClass),
    layer.reviewState,
  ];
}
