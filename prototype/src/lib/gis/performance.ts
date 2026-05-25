import type { MapLayerManifest } from '@/lib/contracts/spatial';

export type GisLayerPerformanceBudget = {
  layerId: string;
  label: string;
  payloadSizeClass: MapLayerManifest['payloadSizeClass'];
  lazyLoadPolicy: MapLayerManifest['lazyLoadPolicy'];
  maxInitialPayloadKb: number;
  deferred: boolean;
  safeNote: string;
};

const BUDGET_BY_PAYLOAD: Record<MapLayerManifest['payloadSizeClass'], number> = {
  'metadata-only': 16,
  'tiny-mock': 64,
  'deferred-heavy': 256,
};

export function buildGisPerformanceBudgets(
  layers: MapLayerManifest[]
): GisLayerPerformanceBudget[] {
  return layers.map((layer) => ({
    layerId: layer.id,
    label: layer.label,
    payloadSizeClass: layer.payloadSizeClass,
    lazyLoadPolicy: layer.lazyLoadPolicy,
    maxInitialPayloadKb: BUDGET_BY_PAYLOAD[layer.payloadSizeClass],
    deferred:
      layer.lazyLoadPolicy !== 'initial-metadata' || layer.payloadSizeClass === 'deferred-heavy',
    safeNote:
      layer.payloadSizeClass === 'deferred-heavy'
        ? 'Heavy geometry deferred until layer selection in prototype.'
        : 'Metadata-first load within mock MVP0 budget.',
  }));
}

export function summarizeGisPerformance(budgets: GisLayerPerformanceBudget[]): {
  initialLoadKb: number;
  deferredCount: number;
  withinBudget: boolean;
} {
  const initial = budgets.filter((budget) => !budget.deferred);
  const initialLoadKb = initial.reduce((total, budget) => total + budget.maxInitialPayloadKb, 0);
  return {
    initialLoadKb,
    deferredCount: budgets.filter((budget) => budget.deferred).length,
    withinBudget: initialLoadKb <= 128,
  };
}
