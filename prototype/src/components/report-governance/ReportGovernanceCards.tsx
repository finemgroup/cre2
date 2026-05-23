import type { ReactElement } from 'react';

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
  const coverage = Math.round((readiness.approvedCount / readiness.totalCount) * 100);

  return (
    <StudioCard title="Provenance Coverage" eyebrow="BOV governance adapted">
      <div className="metric-grid">
        <div className="metric-card">
          <span>Approved sections</span>
          <strong>{readiness.approvedCount}/{readiness.totalCount}</strong>
          <small>{coverage}% coverage</small>
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
      <button className="btn btn-primary" type="button" disabled={!readiness.ready}>
        Export PDF
      </button>
    </StudioCard>
  );
}
