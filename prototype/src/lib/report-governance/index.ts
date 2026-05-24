import { mockSourceBlocks, summarizeSourceBundle } from '@/lib/source-bundle';
import type { SourceEvidenceBlock } from '@/lib/source-bundle';

export type ReadinessSection = {
  id: string;
  name?: string;
  title?: string;
  status: string;
};

export type ExportReadiness = {
  ready: boolean;
  approvedCount: number;
  totalCount: number;
  warnings: string[];
  blockedReasons: string[];
  receiptHash?: string;
};

function sectionLabel(section: ReadinessSection): string {
  return section.name ?? section.title ?? section.id;
}

function isApprovedStatus(status: string): boolean {
  return status === 'Approved' || status === 'ready';
}

function statusLabel(status: string): string {
  if (status === 'review-required') return 'review required';
  return status.toLowerCase();
}

export function evaluateExportReadiness(
  sections: ReadinessSection[],
  blocks: SourceEvidenceBlock[] = mockSourceBlocks
): ExportReadiness {
  const approvedCount = sections.filter((section) => isApprovedStatus(section.status)).length;
  const sourceSummary = summarizeSourceBundle(blocks);
  const unapproved = sections
    .filter((section) => !isApprovedStatus(section.status))
    .map((section) => `${sectionLabel(section)} is ${statusLabel(section.status)}`);
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
