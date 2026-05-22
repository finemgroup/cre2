import { useState, type ReactElement } from 'react';

import { StageRail } from '@/components/ui/StageRail';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';

const STAGES = ['Select files', 'Terms', 'Upload', 'Candidate'];

export function UploadPage(): ReactElement {
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState(0);

  function simulateUpload() {
    if (!consent) return;
    setStage(2);
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(interval);
          setStage(3);
          return 100;
        }
        return p + 20;
      });
    }, 180);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Contribution exchange</p>
        <h1>Upload documents</h1>
        <p className="lede">Extraction produces candidate evidence only — not automatic public truth.</p>
      </header>

      <StageRail stages={STAGES} activeIndex={stage} />

      {stage === 0 ? (
        <div className="card">
          <label className="upload-drop" htmlFor="file-input">
            Drag lease, rent roll, or OM here (prototype — no files sent)
          </label>
          <input id="file-input" type="file" className="sr-only" onChange={() => setStage(1)} />
          <p className="muted">Scanned documents may require review before extraction.</p>
        </div>
      ) : null}

      {stage >= 1 && stage < 3 ? (
        <div className="card">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I accept source-use and visibility terms for this upload.
          </label>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!consent}
            onClick={simulateUpload}
          >
            Start upload
          </button>
        </div>
      ) : null}

      {stage === 2 ? (
        <div className="card">
          <p>Uploading sample document…</p>
          <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {stage === 3 ? (
        <div className="card">
          <AuthorityBadge label="candidate-evidence" />
          <p>Upload complete. Candidate extraction queued for review.</p>
          <p className="muted">No public promotion until review and source-use gates clear.</p>
        </div>
      ) : null}
    </section>
  );
}
