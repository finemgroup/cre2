import { mockSourceBlocks, summarizeSourceBundle } from '@/lib/source-bundle';
import type { ReportSection } from '@/data/studio';

export type ExportReadiness = {
  ready: boolean;
  approvedCount: number;
  totalCount: number;
  warnings: string[];
  blockedReasons: string[];
  receiptHash?: string;
};

export function evaluateExportReadiness(sections: ReportSection[]): ExportReadiness {
  const approvedCount = sections.filter((section) => section.status === 'Approved').length;
  const sourceSummary = summarizeSourceBundle(mockSourceBlocks);
  const unapproved = sections
    .filter((section) => section.status !== 'Approved')
    .map((section) => `${section.name} is ${section.status.toLowerCase()}`);
  const blockedReasons = [
    ...unapproved,
    ...sourceSummary.blockedActions.map((action) => `${action} blocked by source posture`),
  ];
  const ready = blockedReasons.length === 0;

  return {
    ready,
    approvedCount,
    totalCount: sections.length,
    warnings: sourceSummary.warnings,
    blockedReasons,
    receiptHash: ready ? 'sha256:prototype-source-manifest-8f3c' : undefined,
  };
}
