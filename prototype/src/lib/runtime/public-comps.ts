import { mockComps, type CompRecord } from '@/data/mock';
import { PUBLIC_ACTOR, type ActorContext } from '@/lib/contracts/actor-context';
import { decideVisibility } from '@/lib/contracts/visibility';

export type PublicCompView = CompRecord & {
  canInspect: boolean;
  safeExplanation: string;
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
