import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { getPublicExportDecision, getPublicReportView } from '@/lib/runtime/report-flow';
import type { ExportScope } from '@/lib/runtime/export-policy';
import type { GovernedReceipt } from '@/lib/contracts/receipts';
import { trackEvent } from '@/lib/analytics/collector';

const STAGES = ['Sections', 'Consent', 'Generate', 'Receipt'];

export function ExportPage(): ReactElement {
  const { pushToast } = usePrototypeToast();
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [scope, setScope] = useState<ExportScope>('download');
  const [receipt, setReceipt] = useState<GovernedReceipt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const reportView = getPublicReportView(id);

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
  const propertyId = property.id;
  const policyDecision = getPublicExportDecision({
    propertyId,
    scope,
    consent,
    idempotencyKey: `public-export-${propertyId}-${scope}`,
  });
  const exportBlocked = !policyDecision?.allowed;

  function handleGenerate() {
    if (exportBlocked) return;
    setGenerating(true);
    setStage(2);
    window.setTimeout(() => {
      const decision = getPublicExportDecision({
        propertyId,
        scope,
        consent,
        idempotencyKey: `public-export-${propertyId}-${scope}`,
      });
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

      <StageRail stages={STAGES} activeIndex={stage} />

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
        <ul className="readiness-gates">
          {valuationVersion.readiness.gates.map((gate) => (
            <li key={gate.id} data-status={gate.status}>
              <strong>{gate.label}</strong>
              <span>
                {gate.status} · {gate.safeMessage}
              </span>
            </li>
          ))}
        </ul>
        <p className="muted">{valuationVersion.readiness.safeNextAction}</p>
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
