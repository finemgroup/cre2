import { mockProperties, mockReportSections, type ReportSection } from '@/data/mock';
import {
  DEFAULT_DEAL_ID,
  getStudioDeal,
  reportSections as defaultStudioReportSections,
  type ReportSection as StudioReportSection,
} from '@/data/studio';
import { getSourceBlocksForDeal, type SourceEvidenceBlock } from '@/lib/source-bundle';

export const propertyToDealId: Record<string, string> = {
  'demo-001': 'riverside-flats',
  'demo-002': '1200-tech',
};

export function getLinkedDealId(propertyId?: string): string | undefined {
  if (!propertyId) return undefined;
  return propertyToDealId[propertyId];
}

export function getLinkedPropertyId(dealId?: string): string | undefined {
  if (!dealId) return undefined;
  return Object.entries(propertyToDealId).find(([, linkedDealId]) => linkedDealId === dealId)?.[0];
}

export function getPropertyRecord(propertyId?: string) {
  if (!propertyId) return undefined;
  return mockProperties.find((property) => property.id === propertyId);
}

function studioSectionToPublic(section: StudioReportSection): ReportSection {
  const status =
    section.status === 'Approved'
      ? 'ready'
      : section.status === 'Needs review'
        ? 'review-required'
        : 'blocked';

  return {
    id: section.id,
    title: section.name,
    status,
    citation: `${section.citationCount} cited sources`,
  };
}

const studioReportSectionsByDeal: Record<string, StudioReportSection[]> = {
  'riverside-flats': defaultStudioReportSections,
  '1200-tech': defaultStudioReportSections.map((section) => ({
    ...section,
    status: section.id === 'underwriting' ? ('Needs review' as const) : ('Approved' as const),
  })),
  'canyon-logistics': defaultStudioReportSections.map((section) => ({
    ...section,
    status: 'Approved' as const,
  })),
};

export function getStudioReportSections(dealId?: string): StudioReportSection[] {
  const resolvedDealId = dealId ?? DEFAULT_DEAL_ID;
  return studioReportSectionsByDeal[resolvedDealId] ?? defaultStudioReportSections;
}

export function getPublicReportSections(propertyId?: string): ReportSection[] {
  const linkedDealId = getLinkedDealId(propertyId);
  if (linkedDealId) {
    return getStudioReportSections(linkedDealId).map(studioSectionToPublic);
  }

  if (!propertyId) return mockReportSections;
  return mockReportSectionsByProperty[propertyId] ?? mockReportSections;
}

const mockReportSectionsByProperty: Record<string, ReportSection[]> = {
  'demo-001': mockReportSections,
  'demo-002': mockReportSections.map((section) =>
    section.id === 'comps'
      ? { ...section, status: 'ready' as const, citation: 'Reviewed comp set' }
      : section.id === 'export'
        ? { ...section, status: 'review-required' as const }
        : section
  ),
};

export function getSourceBlocksForProperty(propertyId?: string): SourceEvidenceBlock[] {
  const linkedDealId = getLinkedDealId(propertyId);
  return getSourceBlocksForDeal(linkedDealId ?? DEFAULT_DEAL_ID);
}

export function getWorkflowSummary(propertyId?: string) {
  const property = getPropertyRecord(propertyId);
  const linkedDealId = getLinkedDealId(propertyId);
  const deal = linkedDealId ? getStudioDeal(linkedDealId) : undefined;

  return {
    property,
    linkedDealId,
    deal,
    reportSections: getPublicReportSections(propertyId),
    sourceBlocks: getSourceBlocksForProperty(propertyId),
  };
}
