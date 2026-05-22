import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';

const STAGES = ['Sections', 'Consent', 'Generate', 'Receipt'];

export function ExportPage(): ReactElement {
  const { id } = useParams();
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  const exportBlocked = true;

  function handleGenerate() {
    if (!consent || exportBlocked) return;
    setGenerating(true);
    setStage(2);
    window.setTimeout(() => {
      setGenerating(false);
      setStage(3);
      setReceipt(`audit://prototype/export/${id ?? 'demo'}`);
    }, 900);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Report export gate</p>
        <h1>Gated export for {id}</h1>
        <p className="lede">Export is a permissioned, audited value exchange — not a simple download button.</p>
      </header>

      <StageRail stages={STAGES} activeIndex={stage} />

      <div className="card">
        <AuthorityBadge label="blocked" />
        <p className="warning">
          Export disabled: 1 report section requires review; consent and source-use terms must be captured.
        </p>

        <fieldset className="export-options">
          <legend>Export sections</legend>
          <label><input type="checkbox" defaultChecked disabled /> Executive summary</label>
          <label><input type="checkbox" defaultChecked disabled /> Comp table</label>
          <label><input type="checkbox" disabled /> Regional map (sample layer)</label>
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

        <button
          type="button"
          className="btn btn-primary"
          disabled={!consent || exportBlocked || generating}
          onClick={handleGenerate}
        >
          {generating ? 'Generating…' : 'Generate export'}
        </button>

        {receipt ? (
          <p className="receipt" role="status">
            Receipt placeholder: <code>{receipt}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}
