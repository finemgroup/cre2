import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import {
  evaluateSourceRightsManifest,
  getVerificationSummary,
  summarizeGisManifest,
} from '@/lib/gis';

describe('gis manifest spine', () => {
  it('summarizes visible layers and spatial source clearance', () => {
    const summary = summarizeGisManifest(fixtureActors.orgAdmin, 'report', 'demo-001');
    expect(summary.layerCount).toBeGreaterThan(0);
    expect(typeof summary.spatialSourceClear).toBe('boolean');
  });

  it('evaluates source rights with safe messages', () => {
    const rights = evaluateSourceRightsManifest(fixtureActors.public, 'report');
    expect(rights.some((entry) => entry.decision === 'deny')).toBe(true);
    rights.forEach((entry) => {
      expect(entry.safeExplanation.length).toBeGreaterThan(0);
    });
  });

  it('reports verification conflicts without leaking private values', () => {
    const verification = getVerificationSummary(fixtureActors.orgAdmin, 'demo-001');
    expect(verification.totalEvidence).toBeGreaterThan(0);
    expect(JSON.stringify(verification)).not.toMatch(/private rent roll/i);
  });
});
