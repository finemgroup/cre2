import { describe, expect, it } from 'vitest';

import { fixtureMapLayerManifests, getMapLayerManifestsForActor } from '@/lib/contracts/spatial';
import { fixtureActors } from '@/lib/contracts/fixtures';
import {
  geometryLoadDelayMs,
  geometryStateLabel,
  resolveInitialGeometryState,
  shouldLoadGeometryOnSelection,
  shouldLoadGeometryOnVisibility,
} from '@/lib/gis/layer-load-state';

describe('gis layer load state', () => {
  const layers = getMapLayerManifestsForActor(fixtureActors.public, 'property');

  it('marks metadata-only layers without geometry load', () => {
    const metadataLayer = layers.find((layer) => !layer.canLoadGeometry);
    expect(metadataLayer).toBeDefined();
    expect(resolveInitialGeometryState(metadataLayer!)).toBe('metadata-only');
  });

  it('defers heavy geometry until selection or toggle', () => {
    const deferredLayer = fixtureMapLayerManifests.find(
      (layer) => layer.payloadSizeClass === 'deferred-heavy'
    );
    expect(deferredLayer).toBeDefined();
    const projection = layers.find((layer) => layer.id === deferredLayer!.id);
    if (projection) {
      expect(resolveInitialGeometryState(projection)).toBe('deferred');
    }
  });

  it('loads initial-metadata geometry immediately in mock posture', () => {
    const initialLayer = layers.find((layer) => layer.lazyLoadPolicy === 'initial-metadata');
    expect(initialLayer).toBeDefined();
    expect(resolveInitialGeometryState(initialLayer!)).toBe('loaded');
  });

  it('maps lazy policies to visibility and selection triggers', () => {
    const toggleLayer = layers.find((layer) => layer.lazyLoadPolicy === 'on-toggle');
    const selectionLayer = layers.find((layer) => layer.lazyLoadPolicy === 'on-selection');

    if (toggleLayer) {
      expect(shouldLoadGeometryOnVisibility(toggleLayer)).toBe(toggleLayer.canLoadGeometry);
    }
    if (selectionLayer) {
      expect(shouldLoadGeometryOnSelection(selectionLayer)).toBe(selectionLayer.canLoadGeometry);
    }
  });

  it('uses zero delay under reduced motion', () => {
    expect(geometryLoadDelayMs(true)).toBe(0);
    expect(geometryLoadDelayMs(false)).toBeGreaterThan(0);
  });

  it('labels geometry states for customer-safe UI copy', () => {
    expect(geometryStateLabel('loaded')).toContain('mock');
    expect(geometryStateLabel('deferred')).toContain('deferred');
  });
});
