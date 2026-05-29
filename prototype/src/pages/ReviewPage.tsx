import { useState, type ReactElement } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';

import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import {
  EXPORT_FIXTURE_STATES,
  getCitationRows,
  resolveExportFixtureState,
  sourcePackBlocker,
  type ExportFixtureStateId,
} from '@/lib/runtime/public-export-fixtures';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

const GAP_SECTIONS: Record<ExportFixtureStateId, readonly string[]> = {
  clean: ['Executive summary', 'Comparable Sales'],
  blocked: ['Comparable Sales', 'Source rights checklist'],
  'low-evidence': ['Property facts', 'Rent roll support'],
  'provider-restricted': ['Comp appendix', 'Premium comp row'],
  'ready-for-review': ['Executive summary', 'Consent packet'],
};

const NOTE = 'Prototype note copied locally only; export gates remain blocked.';

export function ReviewPage(): ReactElement {
  const isSources = useLocation().pathname.startsWith('/sources/');
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
    fixtureBlockers,
  ] = fixture;
  const routeBase = isSources ? 'sources' : 'review';
  const sourceGaps = GAP_SECTIONS[fixtureStateId].map((section, index) => ({
    id: `${fixtureStateId}-gap-${index}`,
    section,
    blockerType: index === 0 ? fixture[7] : fixture[5],
    detail: `${fixtureBlockers[index] ?? exportPosture} Prototype-only; does not clear export gates.`,
  }));
  const citations = isSources ? getCitationRows(fixtureStateId) : [];

  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `${routeBase}-report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const reportView = reportState.value;
  const propertyId = reportView?.property.id ?? id ?? '';

  if (!reportView && reportState.loading) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>{isSources ? 'Loading source pack' : 'Loading review cockpit'}</h1>
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
          <h1>{isSources ? 'Source pack not found' : 'Review queue not found'}</h1>
        </header>
      </section>
    );
  }

  const { property, readiness } = reportView;
  const rows = isSources ? citations : sourceGaps;

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">
          Public Intelligence ·{' '}
          {isSources
            ? 'Source Pack · Citation Drilldown'
            : 'Review Required · Source Gap Resolution'}{' '}
          · {fixtureStateLabel} · {fixtureEyebrow}
        </p>
        <h1>
          {isSources ? 'Source pack for' : 'Review queue for'} {property.address}
        </h1>
        <p className="lede">
          {isSources
            ? 'Mock-only citation drilldown. Prototype-only / no live source retrieval. Advisory / Model-Inferred. Not an appraisal. Export remains gated.'
            : 'Mock-only source gap cockpit. Prototype-only / no live approval. Export remains gated. Not an appraisal.'}
        </p>
      </header>

      <RuntimeResourceStatus
        loading={reportState.loading}
        error={reportState.error}
        variant="public"
      />

      {!isSources ? (
        <div className="proof-strip" aria-label="Review queue identity">
          {[
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
      ) : null}

      <nav
        className="contextual-handoffs"
        aria-label={isSources ? 'Source pack handoffs' : 'Review route handoffs'}
      >
        <Link to={`/report/${propertyId}?state=${fixtureStateId}`}>Return to report preview</Link>
        <Link to={`/export/${propertyId}?state=${fixtureStateId}`}>Return to export gate</Link>
        {isSources ? (
          <Link to={`/review/${propertyId}?state=${fixtureStateId}`}>Return to review queue</Link>
        ) : (
          <Link to={`/sources/${propertyId}?state=${fixtureStateId}`}>Open source pack</Link>
        )}
      </nav>

      <nav
        className="proof-strip report-state-switcher"
        aria-label={isSources ? 'Source pack fixture states' : 'Review fixture states'}
      >
        {EXPORT_FIXTURE_STATES.map((state) => (
          <Link
            key={state[0]}
            to={`/${routeBase}/${property.id}?state=${state[0]}`}
            className={state[0] === fixtureStateId ? 'active' : undefined}
          >
            <span>{state[1]}</span>
            <small>{state[2]}</small>
          </Link>
        ))}
      </nav>

      <section className="card">
        <h2>Export remains gated</h2>
        <p className="warning">
          {exportPosture}{' '}
          {isSources
            ? sourcePackBlocker(fixtureStateId)
            : 'Prototype-only review. Does not clear export gates.'}
        </p>
        {isSources ? (
          <>
            <p className="eyebrow">Source-rights and blocker posture</p>
            <ul>
              {fixtureBlockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </>
        ) : null}
        <button type="button" className="btn btn-primary" disabled>
          Generate export disabled
        </button>
      </section>

      {!isSources ? (
        <section className="card report-gap-register">
          <p className="eyebrow">Source gap register</p>
          <h2>Unresolved blockers before export readiness</h2>
          <ul>
            {sourceGaps
              .filter((gap) => !reviewedIds.includes(gap.id))
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
      ) : null}

      <section
        className="card-grid"
        aria-label={isSources ? 'Citation drilldown register' : 'Source gap resolution register'}
      >
        {rows.map((row) => {
          const rowId = row.id;
          const reviewed = reviewedIds.includes(rowId);
          const expanded = expandedId === rowId;
          return (
            <article key={rowId} className="card">
              <h3>{'title' in row ? row.title : row.section}</h3>
              {'meta' in row ? (
                <>
                  <p>{row.meta}</p>
                  <p className="muted">Blocks export: {row.blocksExport ? 'Yes' : 'No'}</p>
                  <p>{row.excerpt}</p>
                </>
              ) : (
                <>
                  <p>{row.blockerType}</p>
                  <p className="muted">Blocks export</p>
                </>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setExpandedId(expanded ? null : rowId)}
              >
                {expanded
                  ? 'Hide detail'
                  : isSources
                    ? 'Expand citation detail'
                    : 'Expand blocker detail'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setReviewedIds((current) =>
                    current.includes(rowId)
                      ? current.filter((value) => value !== rowId)
                      : [...current, rowId]
                  )
                }
              >
                {reviewed
                  ? isSources
                    ? 'Unmark citation (prototype)'
                    : 'Unmark gap (prototype)'
                  : isSources
                    ? 'Mark citation reviewed (prototype)'
                    : 'Mark gap reviewed (prototype)'}
              </button>
              {expanded ? (
                <p className="muted">
                  {isSources
                    ? 'Prototype-only; does not clear export gates.'
                    : 'detail' in row
                      ? row.detail
                      : ''}
                </p>
              ) : null}
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
            .then(() =>
              setCopyStatus(isSources ? 'Mock citation note copied.' : 'Mock reviewer note copied.')
            )
        }
      >
        {isSources ? 'Copy mock citation note' : 'Copy mock reviewer note'}
      </button>
      {copyStatus ? <p className="muted">{copyStatus}</p> : null}

      <footer className="card report-prototype-footer">
        {isSources
          ? 'Prototype-only / no live source retrieval. Export remains disabled.'
          : 'Prototype-only / no live approval. Export remains disabled.'}
      </footer>
    </section>
  );
}
