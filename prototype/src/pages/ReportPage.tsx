import { Link, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { trackEvent } from '@/lib/analytics/collector';

const STAGES = ['Overview', 'Sections', 'Review', 'Export intent'];

export function ReportPage(): ReactElement {
  const { id } = useParams();
  const reportView = getPublicReportView(id);
  const property = reportView?.property;
  const sections = reportView?.sections ?? [];
  const valuationVersion = reportView?.valuationVersion;

  if (!property) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Route guard</p>
          <h1>Report not found</h1>
          <p className="lede">
            The requested sample property does not exist in the prototype dataset.
          </p>
        </header>
        <Link to="/" className="btn btn-primary">
          Return to search
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Valuation report preview</p>
        <h1>Report for {property.address}</h1>
        <p className="lede">Interactive evidence-first preview — export remains gated.</p>
      </header>

      <StageRail stages={STAGES} activeIndex={1} />

      {valuationVersion ? (
        <section className="card readiness-card" aria-labelledby="report-readiness-heading">
          <h2 id="report-readiness-heading">Readiness rail</h2>
          <p>{valuationVersion.resultSummary}</p>
          <div className="provenance-labels" aria-label="Valuation provenance labels">
            <AuthorityBadge label="advisory" />
            <AuthorityBadge label="reviewer-required" />
            <AuthorityBadge label="source-pending" />
          </div>
          <ul className="readiness-gates">
            {valuationVersion.readiness.gates.slice(0, 5).map((gate) => (
              <li key={gate.id} data-status={gate.status}>
                <strong>{gate.label}</strong>
                <span>
                  {gate.status} · {gate.safeMessage}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="card-grid">
        {sections.map((section, index) => (
          <SophexMotionSurface key={section.id} motionName="stageItem" className="card">
            <h2>{section.title}</h2>
            <p>{section.citation}</p>
            {section.id === 'map' ? (
              <div className="provenance-labels" aria-label="Map provenance labels">
                <AuthorityBadge label="sample-map-data" />
                <AuthorityBadge label="approximate-centroid" />
                <AuthorityBadge label="not-legal-boundary" />
              </div>
            ) : null}
            <AuthorityBadge
              label={
                section.status === 'ready'
                  ? 'reviewed'
                  : section.status === 'blocked'
                    ? 'blocked'
                    : 'unreviewed'
              }
            />
            {section.status === 'review-required' ? (
              <p className="warning">Review required before export.</p>
            ) : null}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                trackEvent({
                  name: 'report_section_reviewed',
                  actorClass: 'anonymous',
                  route: `/report/${property.id}`,
                  propertyId: property.id,
                  phase: section.status,
                })
              }
            >
              Mark section reviewed (prototype)
            </button>
            <div style={{ transitionDelay: `${index * 0.03}s` }} />
          </SophexMotionSurface>
        ))}
      </div>

      <div className="action-row">
        <Link to={`/export/${property.id}`} className="btn btn-primary">
          Continue to export gate
        </Link>
      </div>
    </section>
  );
}
