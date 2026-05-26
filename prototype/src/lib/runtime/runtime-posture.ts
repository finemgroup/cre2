import type { RuntimeMode } from '@/lib/runtime/service-ports';

export type RuntimePosture = {
  mode: RuntimeMode;
  label: string;
  description: string;
  fixtureFallbackAvailable: boolean;
};

export function getRuntimePosture(mode: RuntimeMode): RuntimePosture {
  if (mode === 'api') {
    return {
      mode,
      label: 'Sandbox API runtime',
      description: 'In-process sandbox reads with fixture fallback on failure.',
      fixtureFallbackAvailable: true,
    };
  }

  return {
    mode,
    label: 'Fixture runtime',
    description: 'Synthetic prototype data only — no production claims.',
    fixtureFallbackAvailable: true,
  };
}
