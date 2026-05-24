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
});
