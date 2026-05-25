import { describe, expect, it } from 'vitest';

import { evaluateExportReadiness } from '@/lib/report-governance';
import { getSourceBlocksForDeal } from '@/lib/source-bundle';
import {
  getLinkedDealId,
  getLinkedPropertyId,
  getPublicReportSections,
  getSourceBlocksForProperty,
  getStudioReportSections,
} from '@/lib/workflow-identity';
import { getStudioReportBuilderView } from '@/lib/runtime/studio-workspace';

describe('workflow identity', () => {
  it('links public properties to Studio deals', () => {
    expect(getLinkedDealId('demo-001')).toBe('riverside-flats');
    expect(getLinkedDealId('demo-002')).toBe('1200-tech');
    expect(getLinkedPropertyId('1200-tech')).toBe('demo-002');
  });

  it('derives public report sections from linked deals', () => {
    const riversideSections = getPublicReportSections('demo-001');
    expect(riversideSections.some((section) => section.status === 'review-required')).toBe(true);

    const techSections = getPublicReportSections('demo-002');
    expect(techSections.filter((section) => section.status === 'ready').length).toBeGreaterThan(1);
  });

  it('returns no source blocks when a property has no linked deal', () => {
    expect(getSourceBlocksForProperty('unknown-property')).toEqual([]);
  });

  it('resolves linked property ids for studio deals', () => {
    expect(getLinkedPropertyId('1200-tech')).toBe('demo-002');
    expect(getLinkedPropertyId('riverside-flats')).toBe('demo-001');
  });

  it('parameterizes export readiness by property context', () => {
    const blocked = evaluateExportReadiness(
      getPublicReportSections('demo-001'),
      getSourceBlocksForProperty('demo-001')
    );
    expect(blocked.ready).toBe(false);

    const canyonSections = getStudioReportSections('canyon-logistics');
    const canyonReady = evaluateExportReadiness(
      canyonSections,
      getSourceBlocksForDeal('canyon-logistics')
    );
    expect(canyonReady.ready).toBe(true);
  });

  it('binds studio report builder readiness and property context to the active deal', () => {
    const riverside = getStudioReportBuilderView('riverside-flats');
    const tech = getStudioReportBuilderView('1200-tech');
    expect(riverside?.readiness.ready).toBe(false);
    expect(tech?.readiness.ready).toBe(false);
    expect(riverside?.valuationVersion.propertyId).toBe('demo-001');
    expect(tech?.valuationVersion.propertyId).toBe('demo-002');
  });
});
