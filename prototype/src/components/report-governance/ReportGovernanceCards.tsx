import { useState, type ReactElement } from 'react';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { MaterialIcon, StatusBadge, StudioCard } from '@/components/studio/StudioPrimitives';
import { evaluateExportReadiness } from '@/lib/report-governance';
import type { ReportSection } from '@/data/studio';

export function ReportSectionReviewCard({ section }: { section: ReportSection }): ReactElement {
  return (
    <div className="section-check governance-section">
      <MaterialIcon name={section.status === 'Approved' ? 'check_circle' : 'pending'} />
      <div>
        <strong>{section.name}</strong>
        <span>{section.citationCount} citations · section review required before export</span>
      </div>
      <StatusBadge status={section.status} />
    </div>
  );
}

export function ReportProvenanceCard({ sections }: { sections: ReportSection[] }): ReactElement {
  const readiness = evaluateExportReadiness(sections);
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

export function ExportReadinessCard({ sections }: { sections: ReportSection[] }): ReactElement {
  const readiness = evaluateExportReadiness(sections);
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
