import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getStudioReportBuilderView } from '@/lib/runtime/studio-workspace';

describe('valuation version contract', () => {
  it('keeps valuation version identity and evidence snapshot stable across repeated reads', () => {
    const first = getValuationVersionForActor({
      actor: fixtureActors.orgAdmin,
      propertyId: 'demo-001',
      reportId: 'report-demo-001',
      exportConsent: true,
      sourceRightsClear: true,
      spatialSourceClear: true,
    });
    const second = getValuationVersionForActor({
      actor: fixtureActors.orgAdmin,
      propertyId: 'demo-001',
      reportId: 'report-demo-001',
      exportConsent: true,
      sourceRightsClear: true,
      spatialSourceClear: true,
    });

    expect(first.id).toBe(second.id);
    expect(first.evidenceSnapshot.asOf).toBe(second.evidenceSnapshot.asOf);
    expect(first.evidenceSnapshot.manifestHash).toBe('sha256-report-demo-001-manifest');
  });

  it('redacts public valuation metadata and blocks export readiness when review is pending', () => {
    const publicVersion = getValuationVersionForActor({
      actor: fixtureActors.public,
      propertyId: 'demo-001',
      reportId: 'report-demo-001',
      exportConsent: false,
      sourceRightsClear: false,
      spatialSourceClear: true,
    });

    expect(publicVersion.reviewState).toBe('needs-review');
    expect(publicVersion.readiness.ready).toBe(false);
    expect(publicVersion.evidenceSnapshot.redactedEvidenceCount).toBeGreaterThan(0);
    expect(JSON.stringify(publicVersion)).not.toContain('private rent roll');
  });

  it('exposes valuation versions through public and studio report adapters', () => {
    const publicReport = getPublicReportView('demo-001', fixtureActors.public);
    const studioReport = getStudioReportBuilderView('riverside-flats', fixtureActors.orgAdmin);

    expect(publicReport?.valuationVersion.reportId).toBe('report-demo-001');
    expect(publicReport?.valuationVersion.readiness.blockerCategories).toContain('review');
    expect(studioReport?.valuationVersion.actorId).toBe(fixtureActors.orgAdmin.id);
    expect(studioReport?.valuationVersion.tradeAreas.length).toBeGreaterThan(0);
  });
});
