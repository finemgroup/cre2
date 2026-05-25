import { Link, useParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { VALUATION_READINESS_STAGES } from '@/lib/readiness-stages';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { getLinkedDealId } from '@/lib/workflow-identity';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { trackEvent } from '@/lib/analytics/collector';

const STAGES = [...VALUATION_READINESS_STAGES];

export function ReportPage(): ReactElement {
  const { id } = useParams();
  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const reportView = reportState.value;
  const property = reportView?.property;
  const sections = reportView?.sections ?? [];
  const valuationVersion = reportView?.valuationVersion;
  const spatialState = useRuntimeResource(
    () =>
      property?.id
        ? runtimeServices.public.getPropertyView(property.id).then((view) => view?.spatialContext)
        : Promise.resolve(undefined),
    `report-spatial-${property?.id ?? 'missing'}`,
    getPublicPropertyView(property?.id)?.spatialContext
  );
  const spatialContext = spatialState.value;

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

  const linkedDealId = getLinkedDealId(property.id);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Valuation report preview · {property.id}</p>
        <h1>Report for {property.address}</h1>
        <p className="lede">Interactive evidence-first preview — export remains gated.</p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="report" />
      {reportState.loading || spatialState.loading ? (
        <p className="muted" role="status">
          Refreshing report data from {runtimeServices.mode} runtime.
        </p>
      ) : null}
      {reportState.error || spatialState.error ? (
        <p className="warning">{reportState.error ?? spatialState.error}</p>
      ) : null}

      <StageRail stages={STAGES} activeIndex={3} />

      {valuationVersion ? (
        <section className="card readiness-card" aria-labelledby="report-readiness-heading">
          <h2 id="report-readiness-heading">Readiness rail</h2>
          <p>{valuationVersion.resultSummary}</p>
          <div className="provenance-labels" aria-label="Valuation provenance labels">
            <AuthorityBadge label="advisory" />
            <AuthorityBadge label="reviewer-required" />
            <AuthorityBadge label="source-pending" />
          </div>
          <ValuationReadinessRail evaluation={valuationVersion.readiness} />
        </section>
      ) : null}

      <div className="card-grid">
        {sections.map((section, index) => (
          <SophexMotionSurface
            key={section.id}
            motionName="stageItem"
            className="card"
            staggerIndex={index}
          >
            <h2>{section.title}</h2>
            <p>{section.citation}</p>
            {section.id === 'map' ? (
              <>
                <div className="provenance-labels" aria-label="Map provenance labels">
                  <AuthorityBadge label="sample-map-data" />
                  <AuthorityBadge label="approximate-centroid" />
                  <AuthorityBadge label="not-legal-boundary" />
                </div>
                <MapLayerControlPanel
                  layers={spatialContext?.layers ?? []}
                  evidenceByLayer={spatialContext?.evidenceByLayer ?? {}}
                  heading="Report map layer controls"
                />
              </>
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
            <PrototypeActionButton
              feature="Mark section reviewed"
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
            </PrototypeActionButton>
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
