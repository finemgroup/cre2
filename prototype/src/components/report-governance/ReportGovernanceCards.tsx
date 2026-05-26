import { useState, type ReactElement } from 'react';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import {
  MaterialIcon,
  StatusBadge,
  StudioCard,
  TrustBadge,
  DataTable,
} from '@/components/studio/StudioPrimitives';
import {
  buildExportManifest,
  evaluateExportReadiness,
  type ExportManifest,
} from '@/lib/report-governance';
import type { SourceEvidenceBlock } from '@/lib/source-bundle';
import type { ReportSection } from '@/data/studio';

const SECTION_STATUS_COPY: Record<string, string> = {
  Approved: 'Ready for export inclusion.',
  Draft: 'Draft content — reviewer required before export.',
  'Needs Review': 'Section review required before export.',
  Blocked: 'Blocked by source posture or missing citations.',
};

export function ReportSectionReviewCard({ section }: { section: ReportSection }): ReactElement {
  const statusCopy =
    SECTION_STATUS_COPY[section.status] ?? 'Reviewer posture determines export inclusion.';
  return (
    <div className="section-check governance-section">
      <MaterialIcon name={section.status === 'Approved' ? 'check_circle' : 'pending'} />
      <div>
        <strong>{section.name}</strong>
        <span>
          {section.citationCount} citations · {statusCopy}
        </span>
      </div>
      <StatusBadge status={section.status} />
    </div>
  );
}

export function ReportProvenanceCard({
  sections,
  sourceBlocks,
}: {
  sections: ReportSection[];
  sourceBlocks?: SourceEvidenceBlock[];
}): ReactElement {
  const readiness = evaluateExportReadiness(sections, sourceBlocks);
  const coverage =
    readiness.totalCount === 0
      ? 'N/A'
      : `${Math.round((readiness.approvedCount / readiness.totalCount) * 100)}%`;

  return (
    <StudioCard title="Provenance Coverage" eyebrow="BOV governance adapted">
      <div className="metric-grid">
        <div className="metric-card">
          <span>Approved sections</span>
          <strong>
            {readiness.approvedCount}/{readiness.totalCount}
          </strong>
          <small>{coverage} coverage</small>
          <MaterialIcon name="fact_check" />
        </div>
        <div className="metric-card">
          <span>Source warnings</span>
          <strong>{readiness.warnings.length}</strong>
          <small>Must be resolved before client delivery</small>
          <MaterialIcon name="warning" />
        </div>
      </div>
    </StudioCard>
  );
}

export function ExportReadinessCard({
  sections,
  sourceBlocks,
}: {
  sections: ReportSection[];
  sourceBlocks?: SourceEvidenceBlock[];
}): ReactElement {
  const readiness = evaluateExportReadiness(sections, sourceBlocks);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <StudioCard title="Export Readiness" eyebrow="Output guard">
      {readiness.ready ? (
        <>
          <StatusBadge status="Ready" />
          <p>All mock review gates are clear.</p>
          <code>{readiness.receiptHash}</code>
        </>
      ) : (
        <>
          <StatusBadge status="Blocked" />
          <p>Export remains disabled until these source and review issues clear:</p>
          <ul className="governance-list">
            {readiness.blockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </>
      )}
      <button
        className="btn btn-primary"
        type="button"
        disabled={!readiness.ready}
        aria-describedby={!readiness.ready ? 'export-readiness-blocked' : undefined}
        onClick={() => setModalOpen(true)}
      >
        Export PDF
      </button>
      {!readiness.ready ? (
        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(true)}>
          Review blockers
        </button>
      ) : null}
      {!readiness.ready ? (
        <p className="sr-only" id="export-readiness-blocked">
          Export is blocked until governance issues clear.
        </p>
      ) : null}
      <ExportGovernanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        readiness={readiness}
      />
    </StudioCard>
  );
}

export function ExportManifestCard({
  sections,
  sourceBlocks,
}: {
  sections: ReportSection[];
  sourceBlocks?: SourceEvidenceBlock[];
}): ReactElement {
  const manifest: ExportManifest = buildExportManifest(sections, sourceBlocks);

  return (
    <StudioCard title="Export Manifest" eyebrow="Included / excluded / redacted">
      <p className="muted">{manifest.redactionCopy}</p>
      <DataTable
        caption="Export manifest sections"
        headers={['Section', 'Disposition', 'Reason']}
        rows={manifest.sections.map((entry) => [
          entry.name,
          <TrustBadge
            key={`${entry.name}-${entry.disposition}`}
            state={
              entry.disposition === 'included'
                ? 'Reviewed'
                : entry.disposition === 'redacted'
                  ? 'Source pending'
                  : entry.disposition === 'reviewer-required'
                    ? 'Reviewer required'
                    : 'Blocked'
            }
          />,
          entry.reason ?? 'Included in mock delivery.',
        ])}
      />
      <div className="manifest-split">
        <section>
          <h3>Evidence appendix</h3>
          {manifest.evidenceAppendix.length > 0 ? (
            <ul className="governance-list">
              {manifest.evidenceAppendix.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Appendix withheld until source bundle context is attached.</p>
          )}
        </section>
        <section>
          <h3>Checksum placeholder</h3>
          <code>{manifest.checksumPlaceholder}</code>
        </section>
      </div>
    </StudioCard>
  );
}
