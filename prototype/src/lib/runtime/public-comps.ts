import { mockComps, type CompRecord } from '@/data/mock';
import { PUBLIC_ACTOR, type ActorContext } from '@/lib/contracts/actor-context';
import { getMapLayerManifestsForActor, getSpatialEvidenceForActor, getTradeAreasForActor, precisionLabel, verificationLabel, type TradeArea } from '@/lib/contracts/spatial';
import { decideVisibility } from '@/lib/contracts/visibility';

export type PublicCompView = CompRecord & {
  canInspect: boolean;
  safeExplanation: string;
};

export type PublicCompContextView = {
  comps: PublicCompView[];
  mapLayers: ReturnType<typeof getMapLayerManifestsForActor>;
  tradeAreas: TradeArea[];
  evidenceByLayer: Record<
    string,
    Array<{ label: string; value: string; safeExplanation: string }>
  >;
};

export function getPublicCompViews(actor: ActorContext = PUBLIC_ACTOR): PublicCompView[] {
  return mockComps.map((comp) => {
    if (comp.authority === 'blocked') {
      return {
        ...comp,
        canInspect: false,
        safeExplanation: 'Omitted from public comparison because source rights block inspection.',
      };
    }

    if (comp.authority === 'candidate-evidence') {
      const decision = decideVisibility(actor, {
        visibility: 'shared-with-permission',
        requiredEntitlement: 'candidate-comp-preview',
      });
      return {
        ...comp,
        canInspect: decision.decision === 'allow',
        safeExplanation:
          decision.decision === 'allow'
            ? decision.safeExplanation
            : 'Candidate comp is summarized publicly but detail requires review.',
      };
    }

    return {
      ...comp,
      canInspect: true,
      safeExplanation: 'Visible because it is public baseline or reviewed output.',
    };
  });
}

export function getPublicCompContextView(
  actor: ActorContext = PUBLIC_ACTOR,
  propertyId = 'demo-001'
): PublicCompContextView {
  const spatialEvidence = getSpatialEvidenceForActor(actor, propertyId);
  return {
    comps: getPublicCompViews(actor),
    mapLayers: getMapLayerManifestsForActor(actor, 'comps'),
    tradeAreas: getTradeAreasForActor(actor, propertyId),
    evidenceByLayer: spatialEvidence.reduce<
      Record<string, Array<{ label: string; value: string; safeExplanation: string }>>
    >((groups, evidence) => {
      const item = {
        label: evidence.label,
        value: `${precisionLabel(evidence.precisionClass)} · ${verificationLabel(
          evidence.verificationState
        )}`,
        safeExplanation: evidence.safeCaveat,
      };
      groups[evidence.layerId] = [...(groups[evidence.layerId] ?? []), item];
      return groups;
    }, {}),
  };
}
