import type { PublicMapLayerProjection } from '@/lib/contracts/spatial';

export type LayerGeometryState =
  | 'metadata-only'
  | 'deferred'
  | 'idle'
  | 'loading'
  | 'loaded';

export function resolveInitialGeometryState(
  layer: PublicMapLayerProjection
): LayerGeometryState {
  if (!layer.canLoadGeometry) return 'metadata-only';
  if (layer.payloadSizeClass === 'deferred-heavy') return 'deferred';
  if (layer.lazyLoadPolicy === 'initial-metadata') return 'loaded';
  return 'idle';
}

export function shouldLoadGeometryOnVisibility(layer: PublicMapLayerProjection): boolean {
  return layer.lazyLoadPolicy === 'on-toggle' && layer.canLoadGeometry;
}

export function shouldLoadGeometryOnSelection(layer: PublicMapLayerProjection): boolean {
  return layer.lazyLoadPolicy === 'on-selection' && layer.canLoadGeometry;
}

export function geometryStateLabel(state: LayerGeometryState): string {
  switch (state) {
    case 'metadata-only':
      return 'Metadata only';
    case 'deferred':
      return 'Geometry deferred';
    case 'idle':
      return 'Geometry not loaded';
    case 'loading':
      return 'Loading geometry';
    case 'loaded':
      return 'Geometry loaded (mock)';
  }
}

export function geometryLoadDelayMs(reducedMotion: boolean): number {
  return reducedMotion ? 0 : 280;
}
