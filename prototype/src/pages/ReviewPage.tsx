import { useMemo, useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import {
  getPublicReviewQueueView,
  resolveReviewFixtureState,
  REVIEW_FIXTURE_STATES,
  type SourceGapRow,
} from '@/lib/runtime/public-review-queue';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

const MOCK_REVIEWER_NOTE =
  'Prototype reviewer note: source gaps reviewed in cockpit only. Export, consent, and source-rights gates remain blocked. No live approval recorded.';

export function ReviewPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [reviewedGapIds, setReviewedGapIds] = useState<string[]>([]);
  const [expandedGapId, setExpandedGapId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const activeFixtureState = resolveReviewFixtureState(searchParams.get('state'));
  const [
    fixtureStateId,
    fixtureStateLabel,
    fixtureEyebrow,
    reviewerStatus,
    sourceRightsStatus,
    sectionReadiness,
    exportPosture,
    nextReviewerAction,
    prototypeNote,
    sourceGaps,
  ] = activeFixtureState;

  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `review-report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const queueState = useRuntimeResource(
    () => runtimeServices.public.getReviewQueueView(id),
    `review-queue-${id ?? 'missing'}`,
    getPublicReviewQueueView(id)
  );
  const reportView = reportState.value;
  const queueView = queueState.value;
  const propertyId = reportView?.property.id ?? id ?? '';

  const unresolvedBlockers = useMemo(() => {
    const blockers = sourceGaps.filter(
      (gap) => gap.blocksExport && !reviewedGapIds.includes(gap.id)
    );
    return blockers.map((gap) => `${gap.section}: ${gap.blockerType}`);
  }, [reviewedGapIds, sourceGaps]);

  if (!reportView && reportState.loading) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Review queue</p>
          <h1>Loading review cockpit</h1>
          <p className="lede">Fetching review posture from the runtime adapter.</p>
        </header>
        <RuntimeResourceStatus
          loading={reportState.loading || queueState.loading}
          error={reportState.error ?? queueState.error}
          variant="public"
        />
      </section>
    );
  }

  if (!reportView) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Route guard</p>
          <h1>Review queue not found</h1>
          <p className="lede">
            The requested sample property does not exist in the prototype dataset.
          </p>
        </header>
      </section>
    );
  }

  const { property, readiness } = reportView;
  const linkedDealId = queueView?.linkedDealId;

  async function copyReviewerNote(): Promise<void> {
    try {
      await navigator.clipboard.writeText(MOCK_REVIEWER_NOTE);
      setCopyStatus('Mock reviewer note copied. Prototype-only; does not clear export gates.');
    } catch {
      setCopyStatus('Copy unavailable in this browser context.');
    }
  }

  function toggleGapReviewed(gapId: string): void {
    setReviewedGapIds((current) =>
      current.includes(gapId) ? current.filter((value) => value !== gapId) : [...current, gapId]
    );
  }

  function renderGapRow(gap: SourceGapRow): ReactElement {
    const reviewed = reviewedGapIds.includes(gap.id);
    const expanded = expandedGapId === gap.id;

    return (
      <tr key={gap.id} data-gap-reviewed={reviewed ? 'true' : 'false'}>
        <td>{gap.section}</td>
        <td>{gap.blockerType}</td>
        <td>{gap.evidenceStatus}</td>
        <td>{gap.sourceRightsPosture}</td>
        <td>{gap.confidenceImpact}</td>
        <td>{gap.reviewerAction}</td>
        <td>{gap.blocksExport ? 'Yes' : 'No'}</td>
        <td>
          <div className="page-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setExpandedGapId(expanded ? null : gap.id)}
              aria-expanded={expanded}
            >
              {expanded ? 'Hide detail' : 'Expand blocker detail'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toggleGapReviewed(gap.id)}
            >
              {reviewed ? 'Unmark gap (prototype)' : 'Mark gap reviewed (prototype)'}
            </button>
          </div>
          {expanded ? (
            <p className="muted" id={`gap-detail-${gap.id}`}>
              {gap.detail} Prototype-only; does not clear export gates.
            </p>
          ) : null}
          {reviewed ? (
            <p className="warning">Reviewed in local state only. Export remains gated.</p>
          ) : null}
        </td>
      </tr>
    );
  }

  return (
    <section className="page report-trust-page">
      <header className="page-header">
        <p className="eyebrow">
          Public Intelligence · Review Required · Source Gap Resolution · {fixtureStateLabel} ·{' '}
          {fixtureEyebrow}
        </p>
        <h1>Review queue for {property.address}</h1>
        <p className="lede">
          Mock-only source gap cockpit. Prototype-only / no live approval. Export remains gated.
          Advisory posture only — not an appraisal.
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="report" />
      <RuntimeResourceStatus
        loading={reportState.loading || queueState.loading}
        error={reportState.error ?? queueState.error}
        variant="public"
      />

      <section className="card report-trust-alert" aria-labelledby="review-not-appraisal-heading">
        <div>
          <p className="eyebrow">Required trust posture</p>
          <h2 id="review-not-appraisal-heading">Not an appraisal</h2>
          <p>
            This review queue is prototype-only. Reviewer actions do not persist, do not authorize
            export, and do not constitute licensed appraisal or broker opinion of value.
          </p>
        </div>
        <div className="report-trust-alert-badges" aria-label="Review authority labels">
          <AuthorityBadge label="advisory" />
          <AuthorityBadge label="reviewer-required" />
          <AuthorityBadge label="source-pending" />
          <AuthorityBadge label="blocked" />
        </div>
      </section>

      {queueView ? (
        <div className="proof-strip" aria-label="Review queue identity">
          {[
            [queueView.reportId, 'Report identity'],
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

      <p className="contextual-handoffs">
        <Link to={`/report/${propertyId}?state=${fixtureStateId}`}>Return to report preview</Link>
        {' · '}
        <Link to={`/export/${propertyId}?state=${fixtureStateId}`}>Return to export gate</Link>
      </p>

      <nav className="proof-strip report-state-switcher" aria-label="Review fixture states">
        {REVIEW_FIXTURE_STATES.map((state) => (
          <Link
            key={state[0]}
            to={`/review/${property.id}?state=${state[0]}`}
            className={state[0] === fixtureStateId ? 'active' : undefined}
            aria-current={state[0] === fixtureStateId ? 'page' : undefined}
          >
            <span>{state[1]}</span>
            <small>{state[2]}</small>
          </Link>
        ))}
      </nav>

      <section className="card" aria-labelledby="review-export-posture-heading">
        <h2 id="review-export-posture-heading">Export remains gated</h2>
        <p className="warning" id="review-export-blockers">
          {exportPosture} {prototypeNote}
        </p>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled
            aria-describedby="review-export-blockers"
          >
            Generate export disabled
          </button>
          <Link to={`/export/${propertyId}?state=${fixtureStateId}`} className="btn btn-secondary">
            Open export gate
          </Link>
        </div>
      </section>

      <section className="card" aria-labelledby="review-next-action-heading">
        <h2 id="review-next-action-heading">Next recommended reviewer action</h2>
        <p>{nextReviewerAction}</p>
        <p className="muted">{queueView?.governanceNote}</p>
      </section>

      <section className="card report-gap-register" aria-labelledby="review-gap-register-heading">
        <div>
          <p className="eyebrow">Source gap register</p>
          <h2 id="review-gap-register-heading">Unresolved blockers before export readiness</h2>
        </div>
        <ul>
          {unresolvedBlockers.length > 0 ? (
            unresolvedBlockers.map((blocker) => <li key={blocker}>{blocker}</li>)
          ) : (
            <li>
              All fixture gaps marked reviewed in local state. Export, consent, and source-rights
              gates remain blocked in prototype.
            </li>
          )}
          {[...new Set([...readiness.warnings, ...readiness.blockedReasons])].map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="source-gap-table-heading">
        <h2 id="source-gap-table-heading">Source gap resolution table</h2>
        <p className="muted">
          Mark gap reviewed, expand blocker detail, and copy mock reviewer notes are prototype-only.
          They do not persist and do not clear export gates.
        </p>
        <div className="table-wrap">
          <table aria-label="Source gap resolution register">
            <thead>
              <tr>
                <th scope="col">Section</th>
                <th scope="col">Blocker type</th>
                <th scope="col">Evidence status</th>
                <th scope="col">Source-rights posture</th>
                <th scope="col">Confidence impact</th>
                <th scope="col">Recommended action</th>
                <th scope="col">Blocks export</th>
                <th scope="col">Reviewer actions</th>
              </tr>
            </thead>
            <tbody>{sourceGaps.map((gap) => renderGapRow(gap))}</tbody>
          </table>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void copyReviewerNote()}
          >
            Copy mock reviewer note
          </button>
          {copyStatus ? <p className="muted">{copyStatus}</p> : null}
        </div>
      </section>

      {queueView ? (
        <section className="proof-strip" aria-label="Section readiness summary">
          {[
            [`${queueView.readySections}/${queueView.totalSections}`, 'Sections ready'],
            [queueView.reviewRequiredCount, 'Need review'],
            [queueView.blockedSections, 'Blocked sections'],
            ['Blocked', 'Export posture'],
            [queueView.blockerCount, 'Governance blockers'],
          ].map(([value, label]) => (
            <article key={String(label)}>
              <strong className="fin-value">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>
      ) : null}

      <footer className="card report-prototype-footer">
        Prototype-only / no live approval. Review actions do not persist. Export remains disabled.
        State: {fixtureStateLabel}.
      </footer>
    </section>
  );
}
