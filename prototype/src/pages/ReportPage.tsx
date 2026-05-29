import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { ReactElement } from 'react';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import type { AuthorityPosture } from '@/lib/authority/authority-vocabulary';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { getLinkedDealId } from '@/lib/workflow-identity';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { trackEvent } from '@/lib/analytics/collector';

type ReportFixtureStateId =
  | 'clean'
  | 'blocked'
  | 'low-evidence'
  | 'provider-restricted'
  | 'ready-for-review';

type ReportFixtureState = readonly [
  ReportFixtureStateId,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  readonly string[],
  readonly AuthorityPosture[],
];

const REPORT_FIXTURE_STATES: ReportFixtureState[] = [
  [
    'clean',
    'Clean',
    'High source coverage',
    '$18.4M - $19.2M',
    'High',
    '94%',
    'Refreshed 5 days ago',
    'Reviewed public baseline',
    'Gated for consent and receipt generation.',
    'Reviewed baseline fields; still advisory.',
    ['Export consent and receipt generation are disabled.'],
    ['advisory', 'model-inferred', 'reviewed'],
  ],
  [
    'blocked',
    'Blocked',
    'Review blockers present',
    '$17.8M - $19.6M',
    'Medium',
    '72%',
    'Mixed source dates',
    'Reviewer required',
    'Blocked: section review, consent, and source-rights gates are open.',
    'Preview only; review gaps remain visible.',
    ['Comparable sales review, source rights, and reviewer approval are incomplete.'],
    ['advisory', 'reviewer-required', 'source-pending', 'blocked'],
  ],
  [
    'low-evidence',
    'Low evidence',
    'Thin citation pack',
    '$16.9M - $20.1M',
    'Low',
    '48%',
    'Needs refresh',
    'Candidate evidence only',
    'Blocked: evidence coverage is below review threshold.',
    'Thin sources widen the model-inferred range.',
    ['Assessor, rent roll, and map support need review.'],
    ['advisory', 'candidate-evidence', 'source-pending'],
  ],
  [
    'provider-restricted',
    'Provider restricted',
    'Source rights constrained',
    '$18.1M - $19.7M',
    'Medium',
    '81%',
    'Current, restricted',
    'Provider-limited summary',
    'Blocked: restricted comps must be removed or summarized.',
    'Restricted comps inform the range but cannot ship.',
    ['Premium-private comp rows are summary-only.'],
    ['advisory', 'source-pending', 'blocked'],
  ],
  [
    'ready-for-review',
    'Ready for review',
    'Analyst queue ready',
    '$18.3M - $19.4M',
    'High pending reviewer',
    '89%',
    'Reviewed this week',
    'Reviewer required',
    'Gated: ready for analyst review, not export.',
    'Evidence is assembled for reviewer signoff.',
    ['Analyst approval and export receipt are not recorded.'],
    ['advisory', 'reviewer-required', 'reviewed'],
  ],
];

function resolveFixtureState(value: string | null): ReportFixtureState {
  return (
    REPORT_FIXTURE_STATES.find(([stateId]) => stateId === value) ??
    REPORT_FIXTURE_STATES.find(([stateId]) => stateId === 'blocked') ??
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
  const [
    fixtureStateId,
    fixtureStateLabel,
    fixtureEyebrow,
    fixtureRange,
    fixtureConfidence,
    fixtureCoverage,
    fixtureFreshness,
    fixtureAuthority,
    fixtureExportPosture,
    fixtureSummary,
    fixtureWarnings,
    fixtureBadges,
  ] = activeFixtureState;

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
    ...fixtureWarnings,
    ...(reportView?.readiness.warnings ?? []),
    ...(reportView?.readiness.blockedReasons ?? []),
  ];
  const snapshotDate = formatSnapshotDate(valuationVersion?.evidenceSnapshot.asOf);

  return (
    <section className="page report-trust-page">
      <header className="page-header">
        <p className="eyebrow">Public Intelligence · {property.id}</p>
        <h1>Report for {property.address}</h1>
        <p className="lede">
          Advisory preview with source limits, Review Required posture, and Export gated controls.
        </p>
      </header>

      {linkedDealId ? (
        <section className="card" aria-label="Studio continuity">
          <p className="eyebrow">Linked Studio deal: {linkedDealId}</p>
          <p>
            Analyst workspace handoff remains mock/sandbox-only; it does not promote this advisory
            report or enable export.
          </p>
          <Link to={`/studio/deals/${linkedDealId}/underwriting`} className="btn btn-secondary">
            Open {linkedDealId} in Studio
          </Link>
        </section>
      ) : null}
      <RuntimeResourceStatus
        loading={reportState.loading}
        error={reportState.error}
        variant="public"
      />

      <section className="card report-trust-alert" aria-labelledby="report-not-appraisal-heading">
        <div>
          <p className="eyebrow">Required trust posture</p>
          <h2 id="report-not-appraisal-heading">Not an appraisal</h2>
          <p>
            This page is a prototype-only, model-inferred advisory report. It is not a licensed
            appraisal, broker opinion of value, fairness opinion, or export authorization.
          </p>
        </div>
        <div className="report-trust-alert-badges" aria-label="Report authority labels">
          {fixtureBadges.map((badge) => (
            <AuthorityBadge key={badge} label={badge} />
          ))}
        </div>
      </section>

      <section className="report-trust-hero card" aria-labelledby="report-advisory-heading">
        <div>
          <p className="eyebrow">{fixtureEyebrow}</p>
          <h2 id="report-advisory-heading">Advisory / Model-Inferred valuation range</h2>
          <strong className="report-trust-range">{fixtureRange}</strong>
          <p>
            {fixtureSummary} Figures are derived from deterministic fixture data and public/source
            limits.
          </p>
        </div>
        <div className="report-trust-export-card" aria-label="Export gate posture">
          <span>Export gated</span>
          <strong>Disabled in prototype</strong>
          <p>{fixtureExportPosture}</p>
          <button type="button" className="btn btn-primary" disabled>
            Generate export disabled
          </button>
          <Link to={`/export/${property.id}?state=${fixtureStateId}`} className="btn btn-secondary">
            Continue to export gate
          </Link>
        </div>
      </section>

      <nav className="proof-strip report-state-switcher" aria-label="Report fixture states">
        {REPORT_FIXTURE_STATES.map((state) => (
          <Link
            key={state[0]}
            to={`/report/${property.id}?state=${state[0]}`}
            className={state[0] === fixtureStateId ? 'active' : undefined}
            aria-current={state[0] === fixtureStateId ? 'page' : undefined}
          >
            <span>{state[1]}</span>
            <small>{state[2]}</small>
          </Link>
        ))}
      </nav>

      <section
        className="proof-strip report-trust-metrics"
        aria-label="Source coverage and confidence"
      >
        {[
          ['Source Coverage', fixtureCoverage, `${citationCount} visible citations`],
          ['Confidence', fixtureConfidence, fixtureAuthority],
          ['Freshness', fixtureFreshness, `Snapshot ${snapshotDate}`],
          [
            'Authority Labels Applied',
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
        </section>
      ) : null}

      <section className="report-gap-register card" aria-labelledby="report-gap-heading">
        <div>
          <p className="eyebrow">Warning & Gap Register</p>
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
          {sections.map((section) => (
            <article key={section.id} className="card">
              <h2>{section.title}</h2>
              <p>{section.citation}</p>
              <p className="muted">
                Draft report sections. Copy remains review-gated and cannot be exported from this
                prototype.
              </p>
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
            </article>
          ))}
        </div>
      )}

      <div className="action-row">
        <button type="button" className="btn btn-primary" disabled>
          Export disabled until governed receipt
        </button>
        <Link to={`/export/${property.id}?state=${fixtureStateId}`} className="btn btn-secondary">
          Review export gate details
        </Link>
        <Link to={`/review/${property.id}?state=${fixtureStateId}`} className="btn btn-secondary">
          Open review queue
        </Link>
      </div>

      <footer className="card report-prototype-footer">
        Prototype-only. No live valuation or export. State: {fixtureStateLabel}.
      </footer>
    </section>
  );
}
