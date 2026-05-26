import { describe, expect, it } from 'vitest';

import { fixtureActors } from '@/lib/contracts/fixtures';
import {
  getBrokerOsProjection,
  getStudioCompViews,
  getStudioDashboardView,
  getStudioDealView,
  getStudioReportBuilderView,
  getStudioUnderwritingView,
  getStudioSpatialWorkbenchView,
  getStudioSourceTraceView,
  getStudioValuationVersionsView,
} from '@/lib/runtime/studio-workspace';

describe('studio runtime adapters', () => {
  it('exposes dashboard data through an org-scoped actor projection', () => {
    const view = getStudioDashboardView(fixtureActors.orgAdmin);

    expect(view.deals.length).toBeGreaterThan(0);
    expect(view.activityActor).toBe(fixtureActors.orgAdmin.id);
  });

  it('resolves deal source blocks through the studio deal adapter', () => {
    const view = getStudioDealView('riverside-flats', fixtureActors.orgMember);

    expect(view?.deal.name).toBe('Riverside Flats');
    expect(view?.sourceBlocks.length).toBeGreaterThan(0);
  });

  it('applies entitlement-aware visibility to studio comps', () => {
    const freeComps = getStudioCompViews(fixtureActors.freeContributor);
    const premiumComps = getStudioCompViews(fixtureActors.orgAdmin);

    expect(freeComps.find((comp) => comp.authority === 'Premium-private')?.visible).toBe(false);
    expect(premiumComps.find((comp) => comp.authority === 'Premium-private')?.visible).toBe(true);
  });

  it('returns report builder readiness from source posture', () => {
    const view = getStudioReportBuilderView('riverside-flats', fixtureActors.orgAdmin);

    expect(view?.readiness.ready).toBe(false);
    expect(view?.sections.length).toBeGreaterThan(0);
  });

  it('returns underwriting assumptions and comp readiness through the studio adapter', () => {
    const view = getStudioUnderwritingView('riverside-flats', fixtureActors.orgAdmin);

    expect(view?.deal.id).toBe('riverside-flats');
    expect(view?.assumptions.purchasePrice).toBeGreaterThan(0);
    expect(view?.reviewedCompCount).toBeGreaterThanOrEqual(0);
    expect(view?.provenance).toBeDefined();
  });

  it('returns spatial workbench manifest through the studio adapter', () => {
    const view = getStudioSpatialWorkbenchView('riverside-flats', fixtureActors.orgAdmin);

    expect(view?.deal.id).toBe('riverside-flats');
    expect(view?.summary.layerCount).toBeGreaterThan(0);
    expect(view?.layers.length).toBeGreaterThan(0);
    expect(view?.sourceRights.length).toBeGreaterThan(0);
  });

  it('returns valuation snapshots and export posture through the studio adapter', () => {
    const view = getStudioValuationVersionsView('riverside-flats', fixtureActors.orgAdmin);

    expect(view?.deal.id).toBe('riverside-flats');
    expect(view?.snapshots.length).toBeGreaterThan(0);
    expect(view?.valuationVersion.evidenceSnapshot.id).toBeTruthy();
    expect(view?.sourceBlocks.length).toBeGreaterThan(0);
  });

  it('returns assumption source trace rows through the studio adapter', () => {
    const view = getStudioSourceTraceView('riverside-flats', fixtureActors.orgAdmin);

    expect(view?.deal.id).toBe('riverside-flats');
    expect(view?.traceItems.length).toBeGreaterThan(0);
    expect(view?.conflictOptions.length).toBeGreaterThan(0);
    expect(view?.sourceBlocks.length).toBeGreaterThan(0);
  });

  it('keeps Broker OS as a sanitized projection', () => {
    const projection = getBrokerOsProjection();

    expect(projection.rawLogsExposed).toBe(false);
    expect(projection.jobStreams.length).toBeGreaterThan(0);
    expect(projection.taxonomy.externalSurfaces.length).toBeGreaterThan(0);
    expect(projection.taxonomy.internalOnly.length).toBeGreaterThan(0);
  });
});
