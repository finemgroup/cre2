import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import type { AuthorityPosture } from '@/lib/authority/authority-vocabulary';
import { StageRail } from '@/components/ui/StageRail';
import { VALUATION_READINESS_STAGES } from '@/lib/readiness-stages';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { getLinkedDealId } from '@/lib/workflow-identity';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { trackEvent } from '@/lib/analytics/collector';

const STAGES = [...VALUATION_READINESS_STAGES];

type ReportFixtureStateId =
  | 'clean'
  | 'blocked'
  | 'low-evidence'
  | 'provider-restricted'
  | 'ready-for-review';

type ReportFixtureState = {
  id: ReportFixtureStateId;
  label: string;
  eyebrow: string;
  valuationRange: string;
  confidence: string;
  coverage: string;
  freshness: string;
  authority: string;
  exportPosture: string;
  summary: string;
  warnings: string[];
  authorityBadges: AuthorityPosture[];
};

const REPORT_FIXTURE_STATES: ReportFixtureState[] = [
  {
    id: 'clean',
    label: 'Clean',
    eyebrow: 'High source coverage',
    valuationRange: '$18.4M - $19.2M',
    confidence: 'High',
    coverage: '94%',
    freshness: 'Refreshed 5 days ago',
    authority: 'Reviewed public baseline',
    exportPosture: 'Still gated for consent and receipt generation.',
    summary:
      'Most public baseline fields are reviewed. This remains advisory until a governed export receipt exists.',
    warnings: ['Export consent and receipt generation are not enabled in the prototype.'],
    authorityBadges: ['advisory', 'model-inferred', 'reviewed'],
  },
  {
    id: 'blocked',
    label: 'Blocked',
    eyebrow: 'Review blockers present',
    valuationRange: '$17.8M - $19.6M',
    confidence: 'Medium',
    coverage: '72%',
    freshness: 'Mixed source dates',
    authority: 'Reviewer required',
    exportPosture: 'Blocked: section review, consent, and source-rights gates are open.',
    summary:
      'The report can be previewed, but it is not distributable. Review gaps and source limits remain visible.',
    warnings: [
      'Comparable sales review is incomplete.',
      'Source-rights posture blocks client-facing export.',
      'Reviewer approval is required before any governed receipt.',
    ],
    authorityBadges: ['advisory', 'reviewer-required', 'source-pending', 'blocked'],
  },
  {
    id: 'low-evidence',
    label: 'Low evidence',
    eyebrow: 'Thin citation pack',
    valuationRange: '$16.9M - $20.1M',
    confidence: 'Low',
    coverage: '48%',
    freshness: 'Needs refresh',
    authority: 'Candidate evidence only',
    exportPosture: 'Blocked: evidence coverage is below review threshold.',
    summary:
      'The valuation range widens because source coverage is thin. Treat every figure as model-inferred.',
    warnings: [
      'Public assessor and candidate upload data disagree.',
      'Fresh rent roll support is missing.',
      'Map context is approximate and not a legal boundary.',
    ],
    authorityBadges: ['advisory', 'candidate-evidence', 'source-pending'],
  },
  {
    id: 'provider-restricted',
    label: 'Provider restricted',
    eyebrow: 'Source rights constrained',
    valuationRange: '$18.1M - $19.7M',
    confidence: 'Medium',
    coverage: '81%',
    freshness: 'Current, restricted',
    authority: 'Provider-limited summary',
    exportPosture: 'Blocked: provider-restricted comps must be removed or summarized.',
    summary:
      'Some comps can inform the advisory range but cannot be copied into a public export package.',
    warnings: [
      'Premium-private comp data is summarized only.',
      'Provider-restricted source rows are excluded from draft delivery.',
      'Source-use policy must clear before export review.',
    ],
    authorityBadges: ['advisory', 'source-pending', 'blocked'],
  },
  {
    id: 'ready-for-review',
    label: 'Ready for review',
    eyebrow: 'Analyst queue ready',
    valuationRange: '$18.3M - $19.4M',
    confidence: 'High pending reviewer',
    coverage: '89%',
    freshness: 'Reviewed this week',
    authority: 'Reviewer required',
    exportPosture: 'Gated: ready for analyst review, not ready for export.',
    summary:
      'The evidence pack is assembled for reviewer signoff. It is still not an appraisal or export authority.',
    warnings: [
      'Analyst review has not been recorded.',
      'Export receipt is not generated in this prototype.',
    ],
    authorityBadges: ['advisory', 'reviewer-required', 'reviewed'],
  },
];

function resolveFixtureState(value: string | null): ReportFixtureState {
  return (
    REPORT_FIXTURE_STATES.find((state) => state.id === value) ??
    REPORT_FIXTURE_STATES.find((state) => state.id === 'blocked') ??
    REPORT_FIXTURE_STATES[0]
  );
}

function formatSnapshotDate(value?: string): string {
  if (!value) return 'Fixture snapshot pending';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ReportPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const reportView = reportState.value;
  const property = reportView?.property;
  const sections = reportView?.sections ?? [];
  const valuationVersion = reportView?.valuationVersion;
  const activeFixtureState = resolveFixtureState(searchParams.get('state'));
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
  const reviewedCount = sections.filter((section) => section.status === 'ready').length;
  const reviewRequiredCount = sections.filter(
    (section) => section.status === 'review-required'
  ).length;
  const blockedCount = sections.filter((section) => section.status === 'blocked').length;
  const sourceBlocks = reportView?.sourceBlocks ?? [];
  const citationCount = sourceBlocks.reduce((total, block) => total + block.citations.length, 0);
  const gapRegister = [
    ...activeFixtureState.warnings,
    ...(reportView?.readiness.warnings ?? []),
    ...(reportView?.readiness.blockedReasons ?? []),
  ];
  const snapshotDate = formatSnapshotDate(valuationVersion?.evidenceSnapshot.asOf);

  return (
    <section className="page report-trust-page">
      <header className="page-header">
        <p className="eyebrow">Prototype public report · {property.id}</p>
        <h1>Report for {property.address}</h1>
        <p className="lede">
          Advisory public intelligence preview with source limits, reviewer posture, and disabled
          export gates always visible.
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="report" />
      <RuntimeResourceStatus
        loading={reportState.loading || spatialState.loading}
        error={reportState.error ?? spatialState.error}
        variant="public"
      />

      <StageRail stages={STAGES} activeIndex={3} />

      <section className="report-trust-alert" aria-labelledby="report-not-appraisal-heading">
        <div>
          <p className="eyebrow">Required trust posture</p>
          <h2 id="report-not-appraisal-heading">Not an appraisal</h2>
          <p>
            This page is a prototype-only, model-inferred advisory report. It is not a licensed
            appraisal, broker opinion of value, fairness opinion, or export authorization.
          </p>
        </div>
        <div className="report-trust-alert-badges" aria-label="Report authority labels">
          {activeFixtureState.authorityBadges.map((badge) => (
            <AuthorityBadge key={badge} label={badge} />
          ))}
        </div>
      </section>

      <section className="report-trust-hero card" aria-labelledby="report-advisory-heading">
        <div>
          <p className="eyebrow">{activeFixtureState.eyebrow}</p>
          <h2 id="report-advisory-heading">Advisory model-inferred valuation range</h2>
          <strong className="report-trust-range">{activeFixtureState.valuationRange}</strong>
          <p>
            {activeFixtureState.summary} Figures are derived from deterministic fixture data and
            public/source-limited evidence posture.
          </p>
        </div>
        <div className="report-trust-export-card" aria-label="Export gate posture">
          <span>Export gate</span>
          <strong>Disabled in prototype</strong>
          <p>{activeFixtureState.exportPosture}</p>
          <button type="button" className="btn btn-primary" disabled>
            Generate export disabled
          </button>
          <Link to={`/export/${property.id}`} className="btn btn-secondary">
            Continue to export gate
          </Link>
        </div>
      </section>

      <nav className="report-state-switcher" aria-label="Report fixture states">
        {REPORT_FIXTURE_STATES.map((state) => (
          <Link
            key={state.id}
            to={`/report/${property.id}?state=${state.id}`}
            className={state.id === activeFixtureState.id ? 'active' : undefined}
            aria-current={state.id === activeFixtureState.id ? 'page' : undefined}
          >
            <span>{state.label}</span>
            <small>{state.eyebrow}</small>
          </Link>
        ))}
      </nav>

      <section className="report-trust-metrics" aria-label="Source coverage and confidence">
        {[
          ['Source coverage', activeFixtureState.coverage, `${citationCount} visible citations`],
          ['Confidence', activeFixtureState.confidence, activeFixtureState.authority],
          ['Freshness', activeFixtureState.freshness, `Snapshot ${snapshotDate}`],
          [
            'Authority',
            'Advisory only',
            `${valuationVersion?.evidenceSnapshot.redactedEvidenceCount ?? 0} refs redacted`,
          ],
        ].map(([label, value, detail]) => (
          <article key={label} className="report-trust-metric-card">
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      {valuationVersion ? (
        <section className="card readiness-card" aria-labelledby="report-readiness-heading">
          <h2 id="report-readiness-heading">Readiness rail</h2>
          <p>
            {valuationVersion.resultSummary} Scenario outputs are advisory, model-inferred, and
            blocked from export until review and source-rights gates clear.
          </p>
          <div className="provenance-labels" aria-label="Valuation provenance labels">
            <AuthorityBadge label="advisory" />
            <AuthorityBadge label="model-inferred" />
            <AuthorityBadge label="reviewer-required" />
            <AuthorityBadge label="source-pending" />
          </div>
          <ValuationReadinessRail evaluation={valuationVersion.readiness} />
        </section>
      ) : null}

      <section className="report-gap-register card" aria-labelledby="report-gap-heading">
        <div>
          <p className="eyebrow">Warning and gap register</p>
          <h2 id="report-gap-heading">What still blocks trust and export</h2>
        </div>
        <ul>
          {gapRegister.length > 0 ? (
            [...new Set(gapRegister)].map((warning) => <li key={warning}>{warning}</li>)
          ) : (
            <li>Governed export receipt is still disabled in this prototype.</li>
          )}
        </ul>
      </section>

      <section className="card" aria-labelledby="report-advisor-heading">
        <div className="report-advisor-layout">
          <h2 id="report-advisor-heading">Advisor sharing preview</h2>
          <p className="muted">
            Sections below show review posture and source limits before any export or syndication.
          </p>
        </div>
        {!reportState.loading && sections.length > 0 ? (
          <div className="proof-strip" aria-label="Report section posture">
            {[
              [reviewedCount, 'Reviewed sections'],
              [reviewRequiredCount, 'Need review'],
              [blockedCount, 'Blocked sections'],
              [sections.length, 'Total sections'],
            ].map(([value, label]) => (
              <article key={String(label)}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="report-source-grid" aria-label="Source posture detail">
        {sourceBlocks.length > 0 ? (
          sourceBlocks.map((block) => (
            <article key={block.id} className="card report-source-card">
              <span className={`report-source-posture report-source-${block.posture}`}>
                {block.posture}
              </span>
              <h2>{block.title}</h2>
              <p>{block.notes}</p>
              <dl>
                <div>
                  <dt>Citations</dt>
                  <dd>{block.citations.length}</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>{block.citations[0]?.confidence ?? 'Pending'}</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{block.citations[0]?.visibility ?? 'Restricted'}</dd>
                </div>
              </dl>
            </article>
          ))
        ) : (
          <article className="card report-source-card">
            <span className="report-source-posture report-source-blocked">blocked</span>
            <h2>No source bundle attached</h2>
            <p>Public report preview remains blocked until a source bundle is available.</p>
          </article>
        )}
      </section>

      {sections.length === 0 && !reportState.loading ? (
        <EmptyStateCard
          icon="description"
          title="No report sections available"
          description="The runtime adapter returned an empty section list for this property. Section review and export gates remain blocked."
          tone="warning"
          actions={
            <Link to={`/property/${property.id}`} className="btn btn-secondary">
              Return to property
            </Link>
          }
        />
      ) : (
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
              <p className="muted">
                Draft section only. Copy remains review-gated and cannot be exported from this
                prototype.
              </p>
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
      )}

      <div className="action-row">
        <button type="button" className="btn btn-primary" disabled>
          Export disabled until governed receipt
        </button>
        <Link to={`/export/${property.id}`} className="btn btn-secondary">
          Review export gate details
        </Link>
      </div>

      <footer className="report-prototype-footer">
        Prototype-only report state: {activeFixtureState.label}. No live valuation, provider send,
        billing, CRE bridge, or export authority is enabled.
      </footer>
    </section>
  );
}
