import { useMemo, useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import {
  EXPORT_FIXTURE_STATES,
  resolveExportFixtureState,
  type ExportFixtureStateId,
} from '@/lib/runtime/public-export-fixtures';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

const GAP_SECTIONS: Record<ExportFixtureStateId, readonly string[]> = {
  clean: ['Executive summary', 'Comparable Sales', 'Export receipt'],
  blocked: ['Comparable Sales', 'Source rights checklist', 'Underwriting Assumptions'],
  'low-evidence': ['Property facts', 'Rent roll support', 'Regional map'],
  'provider-restricted': ['Comp appendix', 'Premium comp row', 'Partner feed'],
  'ready-for-review': ['Executive summary', 'Section bundle', 'Consent packet'],
};

const NOTE = 'Prototype reviewer note copied locally only; export gates remain blocked.';

export function ReviewPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [reviewedGapIds, setReviewedGapIds] = useState<string[]>([]);
  const [expandedGapId, setExpandedGapId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const fixture = resolveExportFixtureState(searchParams.get('state'));
  const [
    fixtureStateId,
    fixtureStateLabel,
    fixtureEyebrow,
    ,
    ,
    sourceRightsStatus,
    reviewerStatus,
    sectionReadiness,
    exportPosture,
  ] = fixture;
  const sourceGaps = useMemo(
    () =>
      GAP_SECTIONS[fixtureStateId].map((section, index) => ({
        id: `${fixtureStateId}-gap-${index}`,
        section,
        blockerType: index === 0 ? fixture[7] : index === 1 ? fixture[5] : fixture[6],
        evidenceStatus: fixture[3],
        sourceRightsPosture: fixture[5],
        confidenceImpact: fixtureStateId === 'low-evidence' ? 'High' : 'Medium',
        reviewerAction: fixture[9][0] ?? fixture[8],
        detail: `${fixture[9][index] ?? fixture[8]} Prototype-only; does not clear export gates.`,
      })),
    [fixture, fixtureStateId]
  );

  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `review-report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const reportView = reportState.value;
  const propertyId = reportView?.property.id ?? id ?? '';

  if (!reportView && reportState.loading) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Loading review cockpit</h1>
        </header>
        <RuntimeResourceStatus
          loading={reportState.loading}
          error={reportState.error}
          variant="public"
        />
      </section>
    );
  }

  if (!reportView) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Review queue not found</h1>
        </header>
      </section>
    );
  }

  const { property, readiness } = reportView;

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">
          Public Intelligence · Review Required · Source Gap Resolution · {fixtureStateLabel} ·{' '}
          {fixtureEyebrow}
        </p>
        <h1>Review queue for {property.address}</h1>
        <p className="lede">
          Mock-only source gap cockpit. Prototype-only / no live approval. Export remains gated. Not
          an appraisal.
        </p>
      </header>

      <RuntimeResourceStatus
        loading={reportState.loading}
        error={reportState.error}
        variant="public"
      />

      <div className="proof-strip" aria-label="Review queue identity">
        {[
          [`report-${property.id}`, 'Report identity'],
          [property.id, 'Property identity'],
          [fixtureStateLabel, 'Fixture state'],
          [reviewerStatus, 'Reviewer status'],
          [sourceRightsStatus, 'Source-rights status'],
          [sectionReadiness, 'Section readiness'],
        ].map(([value, label]) => (
          <article key={String(label)}>
            <strong className="fin-value">{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>

      <p className="contextual-handoffs">
        <Link to={`/report/${propertyId}?state=${fixtureStateId}`}>Return to report preview</Link>
        {' · '}
        <Link to={`/export/${propertyId}?state=${fixtureStateId}`}>Return to export gate</Link>
      </p>

      <nav className="proof-strip report-state-switcher" aria-label="Review fixture states">
        {EXPORT_FIXTURE_STATES.map((state) => (
          <Link
            key={state[0]}
            to={`/review/${property.id}?state=${state[0]}`}
            className={state[0] === fixtureStateId ? 'active' : undefined}
          >
            <span>{state[1]}</span>
            <small>{state[2]}</small>
          </Link>
        ))}
      </nav>

      <section className="card" aria-labelledby="review-export-posture-heading">
        <h2 id="review-export-posture-heading">Export remains gated</h2>
        <p className="warning" id="review-export-blockers">
          {exportPosture} Prototype-only review. Does not clear export gates.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled
          aria-describedby="review-export-blockers"
        >
          Generate export disabled
        </button>
      </section>

      <section className="card report-gap-register" aria-labelledby="review-gap-register-heading">
        <p className="eyebrow">Source gap register</p>
        <h2 id="review-gap-register-heading">Unresolved blockers before export readiness</h2>
        <ul>
          {sourceGaps
            .filter((gap) => !reviewedGapIds.includes(gap.id))
            .map((gap) => (
              <li key={gap.id}>
                {gap.section}: {gap.blockerType}
              </li>
            ))}
          {[...new Set([...readiness.warnings, ...readiness.blockedReasons])].map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>

      <section className="card-grid" aria-label="Source gap resolution register">
        {sourceGaps.map((gap) => {
          const reviewed = reviewedGapIds.includes(gap.id);
          const expanded = expandedGapId === gap.id;
          return (
            <article key={gap.id} className="card">
              <h3>{gap.section}</h3>
              <p>
                {gap.blockerType} · {gap.evidenceStatus} · {gap.sourceRightsPosture} ·{' '}
                {gap.confidenceImpact}
              </p>
              <p>{gap.reviewerAction}</p>
              <p className="muted">Blocks export</p>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setExpandedGapId(expanded ? null : gap.id)}
              >
                {expanded ? 'Hide detail' : 'Expand blocker detail'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setReviewedGapIds((current) =>
                    current.includes(gap.id)
                      ? current.filter((value) => value !== gap.id)
                      : [...current, gap.id]
                  )
                }
              >
                {reviewed ? 'Unmark gap (prototype)' : 'Mark gap reviewed (prototype)'}
              </button>
              {expanded ? <p className="muted">{gap.detail}</p> : null}
              {reviewed ? (
                <p className="warning">Reviewed in local state only. Export remains gated.</p>
              ) : null}
            </article>
          );
        })}
      </section>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() =>
          void navigator.clipboard
            .writeText(NOTE)
            .then(() => setCopyStatus('Mock reviewer note copied.'))
        }
      >
        Copy mock reviewer note
      </button>
      {copyStatus ? <p className="muted">{copyStatus}</p> : null}

      <footer className="card report-prototype-footer">
        Prototype-only / no live approval. Export remains disabled.
      </footer>
    </section>
  );
}
