import { useCallback } from 'react';

import { usePrototypeToast } from '@/components/overlays/PrototypeToast';

export function usePrototypeAction() {
  const { pushToast } = usePrototypeToast();

  return useCallback(
    (feature: string) => {
      pushToast(`${feature} is simulated in this prototype. No live action was taken.`, 'info');
    },
    [pushToast]
  );
}
