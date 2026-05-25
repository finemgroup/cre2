import { useCallback } from 'react';

import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { trackEvent } from '@/lib/analytics/collector';

export function usePrototypeAction() {
  const { pushToast } = usePrototypeToast();

  return useCallback(
    (feature: string) => {
      if (/pricing|plan|upgrade/i.test(feature)) {
        trackEvent({
          name: 'pricing_cta_clicked',
          actorClass: 'prototype-user',
          phase: feature,
        });
      }
      pushToast(`${feature} is simulated in this prototype. No live action was taken.`, 'info');
    },
    [pushToast]
  );
}
