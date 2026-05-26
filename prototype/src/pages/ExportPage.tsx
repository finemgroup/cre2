import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { EXPORT_FLOW_STAGES } from '@/lib/readiness-stages';
import { getPublicExportDecision, getPublicReportView } from '@/lib/runtime/report-flow';
import { getPublicExportGateView } from '@/lib/runtime/public-export-gate';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import type { ExportScope } from '@/lib/runtime/export-policy';
import type { GovernedReceipt } from '@/lib/contracts/receipts';
import { trackEvent } from '@/lib/analytics/collector';
import { getLinkedDealId } from '@/lib/workflow-identity';

const STAGES = [...EXPORT_FLOW_STAGES];

export function ExportPage(): ReactElement {
  const { pushToast } = usePrototypeToast();
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scope, setScope] = useState<ExportScope>('download');
  const [receipt, setReceipt] = useState<GovernedReceipt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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
  const policyState = useRuntimeResource(
    () =>
      propertyId
        ? runtimeServices.public.evaluateExport({
            propertyId,
            scope,
            consent,
            idempotencyKey: `public-export-${propertyId}-${scope}`,
          })
        : Promise.resolve(undefined),
    `export-policy-${propertyId}-${scope}-${consent}`,
    propertyId
      ? getPublicExportDecision({
          propertyId,
          scope,
          consent,
          idempotencyKey: `public-export-${propertyId}-${scope}`,
        })
      : undefined
  );
  const policyDecision = policyState.value;
  const exportBlocked = !policyDecision?.allowed;

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

  function handleGenerate() {
    if (exportBlocked) return;
    setGenerating(true);
    setStage(2);
    window.setTimeout(() => {
      void runtimeServices.public
        .evaluateExport({
          propertyId,
          scope,
          consent,
          idempotencyKey: `public-export-${propertyId}-${scope}`,
        })
        .then((decision) => {
          setGenerating(false);
          setStage(3);
          setReceipt(decision?.receipt ?? null);
          if (decision?.receipt) {
            trackEvent({
              name: 'export_receipt_generated',
              actorClass: decision.receipt.actorId,
              route: `/export/${propertyId}`,
              propertyId,
              phase: scope,
              receiptId: decision.receipt.id,
            });
          }
          pushToast('Export receipt generated in prototype only. No file was sent.', 'success');
        });
    }, 20);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Report export gate</p>
        <h1>Gated export for {property.address}</h1>
        <p className="lede">
          Export is a permissioned, audited value exchange — not a simple download button.
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="export" />
      <MockBoundaryBanner variant="export" />
      <RuntimeResourceStatus
        loading={reportState.loading || policyState.loading || gateState.loading}
        error={reportState.error ?? policyState.error ?? gateState.error}
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
          <Link to={gateView.reportPath}>Review public report sections</Link>
          {gateView.studioReportPath ? (
            <>
              {' · '}
              <Link to={gateView.studioReportPath}>Open Studio report builder</Link>
            </>
          ) : null}
        </p>
      ) : null}

      <StageRail stages={STAGES} activeIndex={stage} />

      {exportBlocked ? (
        <GateResolutionCallout
          action="Generate export receipt"
          prerequisite="Consent, section review, and source-use terms must clear before export."
          owner="A report reviewer"
          resolveTo={`/report/${propertyId}`}
          resolveLabel="Review report sections"
        />
      ) : null}

      <div className="card">
        <AuthorityBadge label={exportBlocked ? 'blocked' : 'reviewed'} />
        <p className={exportBlocked ? 'warning' : undefined} id="export-blockers">
          {exportBlocked
            ? 'Export disabled until consent, section review, and source-use terms are clear.'
            : 'Prototype policy is clear for this selected scope.'}
        </p>
        {exportBlocked ? (
          <ul className="evidence-list" aria-label="Export blockers">
            {(policyDecision?.blockerCategories.length
              ? policyDecision.blockerCategories
              : readiness.blockedReasons
            ).map((reason) => (
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
            {exportBlocked ? 'Review blockers' : 'Review export readiness'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={exportBlocked || generating}
            aria-describedby={exportBlocked ? 'export-blockers' : undefined}
            onClick={handleGenerate}
          >
            {generating ? 'Generating…' : 'Generate export receipt'}
          </button>
        </div>

        {receipt ? (
          <div className="receipt" role="status">
            <p>
              Receipt <code>{receipt.id}</code> · {receipt.kind} · {receipt.policyDecision}
            </p>
            <p>{receipt.safeMessage}</p>
            <p>
              Evidence snapshot: {valuationVersion.evidenceSnapshot.id} ·{' '}
              {valuationVersion.evidenceSnapshot.manifestHash}
            </p>
            <p>
              Redacted evidence refs:{' '}
              {receipt.redactedEvidenceRefs.length > 0
                ? receipt.redactedEvidenceRefs.join(', ')
                : 'none'}
            </p>
            {policyDecision?.exportManifest ? (
              <div className="manifest-summary" aria-label="Export manifest">
                <strong>Export manifest: {policyDecision.exportManifest.status}</strong>
                <span>Checksum: {policyDecision.exportManifest.checksum}</span>
                <span>
                  Included sections:{' '}
                  {policyDecision.exportManifest.includedSectionIds.length || 'preview only'}
                </span>
                <span>{policyDecision.exportManifest.safeSummary}</span>
              </div>
            ) : null}
          </div>
        ) : null}
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
        policyDecision={policyDecision}
        onConfirm={handleGenerate}
      />
    </section>
  );
}
