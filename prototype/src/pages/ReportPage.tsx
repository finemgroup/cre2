import { Link, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { mockReportSections } from '@/data/mock';

const STAGES = ['Overview', 'Sections', 'Review', 'Export intent'];

export function ReportPage(): ReactElement {
  const { id } = useParams();

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Valuation report preview</p>
        <h1>Report for property {id}</h1>
        <p className="lede">Interactive evidence-first preview — export remains gated.</p>
      </header>

      <StageRail stages={STAGES} activeIndex={1} />

      <div className="card-grid">
        {mockReportSections.map((section, index) => (
          <SophexMotionSurface key={section.id} motionName="stageItem" className="card">
            <h2>{section.title}</h2>
            <p>{section.citation}</p>
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
            <div style={{ transitionDelay: `${index * 0.03}s` }} />
          </SophexMotionSurface>
        ))}
      </div>

      <div className="action-row">
        <Link to={`/export/${id}`} className="btn btn-primary">
          Continue to export gate
        </Link>
      </div>
    </section>
  );
}
