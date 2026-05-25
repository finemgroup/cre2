import { summarizeSourceBundle, type SourceEvidenceBlock } from '@/lib/source-bundle';

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

export type ExportManifestSection = {
  name: string;
  disposition: 'included' | 'excluded' | 'redacted' | 'reviewer-required';
  reason?: string;
};

export type ExportManifest = {
  sections: ExportManifestSection[];
  redactionCopy: string;
  evidenceAppendix: string[];
  checksumPlaceholder: string;
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
  blocks?: SourceEvidenceBlock[]
): ExportReadiness {
  const approvedCount = sections.filter((section) => isApprovedStatus(section.status)).length;

  if (blocks === undefined) {
    return {
      ready: false,
      approvedCount,
      totalCount: sections.length,
      warnings: [],
      blockedReasons: ['Source bundle context is required before export readiness can be evaluated.'],
    };
  }

  if (blocks.length === 0) {
    return {
      ready: false,
      approvedCount,
      totalCount: sections.length,
      warnings: [],
      blockedReasons: ['Source bundle has no evidence blocks for this workflow context.'],
    };
  }

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

function sectionDisposition(status: string): ExportManifestSection['disposition'] {
  if (status === 'Approved' || status === 'ready') return 'included';
  if (status === 'blocked') return 'excluded';
  if (status === 'Draft') return 'reviewer-required';
  if (status === 'review-required') return 'reviewer-required';
  return 'excluded';
}

function sectionReason(section: ReadinessSection, disposition: ExportManifestSection['disposition']): string | undefined {
  const label = sectionLabel(section);
  if (disposition === 'included') return undefined;
  if (disposition === 'reviewer-required') return `${label} requires reviewer signoff before export.`;
  if (disposition === 'redacted') return `${label} redacted for LP identifiers in this mock manifest.`;
  return `${label} is ${statusLabel(section.status)} and excluded from delivery.`;
}

export function buildExportManifest(
  sections: ReadinessSection[],
  blocks?: SourceEvidenceBlock[]
): ExportManifest {
  const manifestSections: ExportManifestSection[] = sections.map((section) => {
    const disposition = sectionDisposition(section.status);
    return {
      name: sectionLabel(section),
      disposition,
      reason: sectionReason(section, disposition),
    };
  });

  manifestSections.push({
    name: 'Evidence appendix',
    disposition: blocks && blocks.length > 0 ? 'included' : 'excluded',
    reason:
      blocks && blocks.length > 0
        ? undefined
        : 'Evidence appendix withheld until source bundle context is attached.',
  });

  manifestSections.push({
    name: 'LP identifiers',
    disposition: 'redacted',
    reason: 'Sensitive LP identifiers are redacted in prototype export manifests.',
  });

  const evidenceAppendix =
    blocks?.flatMap((block) =>
      block.citations.map(
        (citation) => `${block.title}: ${citation.label} (${citation.sourceType})`
      )
    ) ?? [];

  return {
    sections: manifestSections,
    redactionCopy:
      'Advisory chips, internal reviewer notes, and LP identifiers are redacted. Export remains simulated.',
    evidenceAppendix,
    checksumPlaceholder: 'sha256:prototype-export-manifest-a7f9',
  };
}
