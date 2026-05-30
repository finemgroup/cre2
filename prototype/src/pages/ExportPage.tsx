import { useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { PublicTrustStrip } from '@/components/public/PublicTrustStrip';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { EXPORT_FLOW_STAGES } from '@/lib/readiness-stages';
import { getPublicReportView } from '@/lib/runtime/report-flow';
import { getPublicExportGateView } from '@/lib/runtime/public-export-gate';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import type { ExportScope } from '@/lib/runtime/export-policy';
import { getLinkedDealId } from '@/lib/workflow-identity';
import {
  EXPORT_FIXTURE_STATES,
  resolveExportFixtureState,
} from '@/lib/runtime/public-export-fixtures';

const STAGES = [...EXPORT_FLOW_STAGES];

export function ExportPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [scope, setScope] = useState<ExportScope>('download');
  const [modalOpen, setModalOpen] = useState(false);
  const activeFixtureState = resolveExportFixtureState(searchParams.get('state'));
  const [
    fixtureStateId,
    fixtureStateLabel,
    fixtureEyebrow,
    fixtureCoverage,
    consentGate,
    sourceRightsGate,
    reviewerGate,
    sectionGate,
    fixtureExportPosture,
    fixtureBlockers,
    fixtureBadges,
  ] = activeFixtureState;
  const reportState = useRuntimeResource(
    () => runtimeServices.public.getReportView(id),
    `export-report-${id ?? 'missing'}`,
    getPublicReportView(id)
  );
  const reportView = reportState.value;
  const propertyId = reportView?.property.id ?? id ?? '';
  const gateState = useRuntimeResource(
    () => runtimeServices.public.getExportGateView(id),
    `export-gate-${id ?? 'missing'}`,
    getPublicExportGateView(id)
  );
  const gateView = gateState.value;

  if (!reportView && reportState.loading) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Report export gate</p>
          <h1>Loading export gate</h1>
          <p className="lede">Fetching export governance posture from the runtime adapter.</p>
        </header>
        <RuntimeResourceStatus
          loading={reportState.loading || gateState.loading}
          error={reportState.error ?? gateState.error}
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
          <h1>Export gate not found</h1>
          <p className="lede">
            The requested sample property does not exist in the prototype dataset.
          </p>
        </header>
      </section>
    );
  }

  const { property, readiness, valuationVersion } = reportView;
  const linkedDealId = getLinkedDealId(propertyId);
  const blockerRegister = [
    ...fixtureBlockers,
    ...readiness.warnings,
    ...readiness.blockedReasons,
    'Consent gate must clear before export.',
    'Source-rights gate must clear before export.',
    'Reviewer approval gate must clear before export.',
    'Section-readiness gate must clear before export.',
  ];

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">
          Export gated · {fixtureStateLabel} · {fixtureEyebrow}
        </p>
        <h1>Review readiness for {property.address}</h1>
        <p className="lede">
          Mock-only export readiness cockpit. Generate stays disabled; no live export, PDF, billing,
          provider send, or syndication is enabled.
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="export" />
      <MockBoundaryBanner variant="export" />
      <RuntimeResourceStatus
        loading={reportState.loading || gateState.loading}
        error={reportState.error ?? gateState.error}
        variant="public"
      />

      {gateView && !reportState.loading ? (
        <div className="proof-strip" aria-label="Export governance posture">
          {[
            [gateView.evidenceSnapshotId, 'Evidence snapshot'],
            [gateView.manifestPrefix, 'Manifest prefix'],
            [`${gateView.readySections}/${gateView.totalSections}`, 'Sections ready'],
            [gateView.exportReady ? 'Clear' : 'Blocked', 'Export posture'],
            [gateView.blockerCount, 'Open blockers'],
          ].map(([value, label]) => (
            <article key={String(label)}>
              <strong className="fin-value">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      ) : null}

      {gateView ? (
        <p className="contextual-handoffs">
          <Link to={`${gateView.reportPath}?state=${fixtureStateId}`}>
            Review public report sections
          </Link>
          {' · '}
          <Link to={`/review/${propertyId}?state=${fixtureStateId}`}>
            Open source gap review queue
          </Link>
          {' · '}
          <Link to={`/sources/${propertyId}?state=${fixtureStateId}`}>Open source pack</Link>
          {gateView.studioReportPath ? (
            <>
              {' · '}
              <Link to={gateView.studioReportPath}>Open Studio report builder</Link>
            </>
          ) : null}
        </p>
      ) : null}

      <StageRail stages={STAGES} activeIndex={stage} />

      <nav className="proof-strip report-state-switcher" aria-label="Export fixture states">
        {EXPORT_FIXTURE_STATES.map((state) => (
          <Link
            key={state[0]}
            to={`/export/${property.id}?state=${state[0]}`}
            className={state[0] === fixtureStateId ? 'active' : undefined}
            aria-current={state[0] === fixtureStateId ? 'page' : undefined}
          >
            <span>{state[1]}</span>
            <small>{state[2]}</small>
          </Link>
        ))}
      </nav>

      <PublicTrustStrip
        labels={['Advisory / model-inferred', 'Not an appraisal', 'Export gated', 'Mock-only']}
      />

      <GateResolutionCallout
        action="Generate export receipt"
        prerequisite="Consent, section review, reviewer approval, and source-use terms must clear before export."
        owner="A report reviewer"
        resolveTo={`/report/${propertyId}?state=${fixtureStateId}`}
        resolveLabel="Review report sections"
      />

      <div className="governance-gate-layout">
        <div className="card governance-gate-alert">
          <p className="eyebrow">Export gated</p>
          <h2>Requirements checklist</h2>
          <ul className="governance-checklist" aria-label="Export review readiness gates">
            {[
              ['Basic inputs complete', consentGate],
              ['Source rights cleared', sourceRightsGate],
              ['Reviewer approval', reviewerGate],
              ['Section readiness', sectionGate],
            ].map(([label, value]) => (
              <li key={label}>
                {label}: <strong>{value}</strong>
              </li>
            ))}
          </ul>
          <p className="warning" id="export-blockers">
            {fixtureExportPosture} Prototype-only. No live export or receipt generation.
          </p>
        </div>

        <div className="governance-gate-rail">
          <section className="card">
            <h2>Required resolutions</h2>
            <ul className="evidence-list" aria-label="Export readiness blocker register">
              {[...new Set(blockerRegister)].map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="card">
        <div className="report-trust-alert-badges" aria-label="Export authority labels">
          {fixtureBadges.map((badge) => (
            <AuthorityBadge key={badge} label={badge} />
          ))}
          <AuthorityBadge label="blocked" />
        </div>
        <ul className="evidence-list" aria-label="Export blockers">
          {['consent', 'source-rights', 'reviewer-approval', 'section-readiness'].map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        <section className="proof-strip" aria-label="Export fixture posture">
          {[
            [fixtureStateLabel, 'Fixture state'],
            [fixtureCoverage, 'Coverage'],
            [scope, 'Selected scope'],
            ['Disabled', 'Generate'],
          ].map(([value, label]) => (
            <article key={String(label)}>
              <strong className="fin-value">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </section>

        {gateView ? (
          <ul className="evidence-list" aria-label="Export snapshot details">
            {[
              `Evidence snapshot: ${gateView.evidenceSnapshotId}`,
              `Manifest prefix: ${gateView.manifestPrefix}`,
              `Sections ready: ${gateView.readySections}/${gateView.totalSections}`,
              `Open blockers: ${gateView.blockerCount}`,
            ].map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}

        <fieldset className="export-options">
          <legend>Export scope</legend>
          {(['preview', 'download', 'share', 'partner-delivery'] satisfies ExportScope[]).map(
            (option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="export-scope"
                  value={option}
                  checked={scope === option}
                  onChange={() => setScope(option)}
                />{' '}
                {option}
              </label>
            )
          )}
        </fieldset>

        <fieldset className="export-options">
          <legend>Export sections</legend>
          <label>
            <input type="checkbox" defaultChecked disabled /> Executive summary
          </label>
          <label>
            <input type="checkbox" defaultChecked disabled /> Comp table
          </label>
          <label>
            <input type="checkbox" disabled /> Regional map (sample layer)
          </label>
        </fieldset>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setStage(1);
            }}
          />
          I consent to export under prototype terms (no live send or syndication).
        </label>

        <div className="page-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(true)}>
            Review blockers
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled
            aria-describedby="export-blockers"
          >
            Generate export receipt disabled
          </button>
        </div>
      </div>

      <section className="card readiness-card" aria-labelledby="readiness-heading">
        <h2 id="readiness-heading">Valuation readiness gates</h2>
        <p>{valuationVersion.resultSummary}</p>
        <ValuationReadinessRail evaluation={valuationVersion.readiness} />
      </section>

      <ExportGovernanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        readiness={readiness}
      />
    </section>
  );
}
