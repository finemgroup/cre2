import { useEffect, useState } from 'react';

export type RuntimeResourceState<T> = {
  value: T;
  loading: boolean;
  error?: string;
};

export function useRuntimeResource<T>(
  load: () => Promise<T>,
  key: string,
  initialValue: T
): RuntimeResourceState<T> {
  const [state, setState] = useState<RuntimeResourceState<T>>({
    value: initialValue,
    loading: false,
  });

  useEffect(() => {
    let active = true;
    load()
      .then((value) => {
        if (active) setState({ value, loading: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error instanceof Error ? error.message : 'Runtime request failed.',
        }));
      });
    return () => {
      active = false;
    };
    // Runtime service callers pass a stable resource key; the loader is scoped to that key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
