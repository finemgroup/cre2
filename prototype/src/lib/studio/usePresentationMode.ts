import { useCallback, useSyncExternalStore } from 'react';

import { readPresentationMode, writePresentationMode } from '@/lib/studio/presentation-mode';

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return readPresentationMode();
}

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

export function usePresentationMode(): {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
} {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const setEnabled = useCallback((next: boolean) => {
    writePresentationMode(next);
    emitChange();
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!readPresentationMode());
  }, [setEnabled]);

  return { enabled, toggle, setEnabled };
}
