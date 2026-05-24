import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { ExportGovernanceModal } from '@/components/overlays/ExportGovernanceModal';
import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { evaluateExportReadiness } from '@/lib/report-governance';
import {
  getPropertyRecord,
  getPublicReportSections,
  getSourceBlocksForProperty,
} from '@/lib/workflow-identity';

const STAGES = ['Sections', 'Consent', 'Generate', 'Receipt'];

export function ExportPage(): ReactElement {
  const { id } = useParams();
  const property = getPropertyRecord(id);
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sections = getPublicReportSections(id);
  const readiness = evaluateExportReadiness(sections, getSourceBlocksForProperty(id));
  const exportBlocked = !readiness.ready;

  if (!property) {
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

  const propertyId = property.id;

  function handleGenerate() {
    if (!consent || exportBlocked) return;
    setGenerating(true);
    setStage(2);
    window.setTimeout(() => {
      setGenerating(false);
      setStage(3);
      setReceipt(`audit://prototype/export/${propertyId}`);
    }, 900);
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
            : 'All prototype governance gates are clear. Confirm consent before generating.'}
        </p>
        {exportBlocked ? (
          <ul className="evidence-list" aria-label="Export blockers">
            {readiness.blockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}

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
            disabled={!consent || exportBlocked || generating}
            aria-describedby={exportBlocked ? 'export-blockers' : undefined}
            onClick={handleGenerate}
          >
            {generating ? 'Generating…' : 'Generate export'}
          </button>
        </div>

        {receipt ? (
          <p className="receipt" role="status">
            Receipt placeholder: <code>{receipt}</code>
          </p>
        ) : null}
      </div>

      <ExportGovernanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        readiness={readiness}
        onConfirm={handleGenerate}
      />
    </section>
  );
}
