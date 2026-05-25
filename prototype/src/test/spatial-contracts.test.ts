import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import {
  getMapLayerManifestsForActor,
  getSpatialEvidenceForActor,
  getTradeAreasForActor,
  verificationLabel,
} from '@/lib/contracts/spatial';
import { getPublicCompContextView } from '@/lib/runtime/public-comps';
import { getPublicPropertyView } from '@/lib/runtime/public-property';

describe('spatial contracts', () => {
  it('returns only public-safe map layer metadata for anonymous actors', () => {
    const layers = getMapLayerManifestsForActor(fixtureActors.public, 'report');

    expect(layers.map((layer) => layer.id)).toContain('layer-public-centroid');
    expect(layers.map((layer) => layer.id)).not.toContain('layer-org-trade-area');
    expect(layers.map((layer) => layer.id)).not.toContain('layer-provider-traffic');
    expect(JSON.stringify(layers)).toContain('Not a legal boundary');
  });

  it('exposes organization trade-area context only to authorized organization actors', () => {
    const publicTradeAreas = getTradeAreasForActor(fixtureActors.public, 'demo-001');
    const orgTradeAreas = getTradeAreasForActor(fixtureActors.orgAdmin, 'demo-001');

    expect(publicTradeAreas.map((tradeArea) => tradeArea.id)).toEqual([
      'trade-demo-001-sample-radius',
    ]);
    expect(orgTradeAreas.map((tradeArea) => tradeArea.id)).toContain('trade-demo-001-org-custom');
    expect(orgTradeAreas.map((tradeArea) => tradeArea.id)).not.toContain(
      'trade-demo-001-provider-drive-time'
    );
  });

  it('labels verification and precision without implying legal boundary certainty', () => {
    const publicEvidence = getSpatialEvidenceForActor(fixtureActors.public, 'demo-001');

    expect(publicEvidence[0]?.verificationState).toBe('sample');
    expect(verificationLabel(publicEvidence[0]?.verificationState ?? 'unverified')).toBe(
      'Sample location'
    );
    expect(publicEvidence[0]?.safeCaveat).toMatch(/not a legal boundary/i);
  });

  it('wires public property and comp adapters to spatial projections', () => {
    const propertyView = getPublicPropertyView('demo-001', fixtureActors.public);
    const compContext = getPublicCompContextView(fixtureActors.public, 'demo-001');

    expect(propertyView?.spatialContext.layers.length).toBeGreaterThan(0);
    expect(propertyView?.spatialContext.evidence[0]?.value).toContain('Approximate centroid');
    expect(compContext.tradeAreas[0]?.safeCaveat).toMatch(/sample trade area/i);
  });
});
