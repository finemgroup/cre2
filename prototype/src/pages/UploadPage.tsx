import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { DEFAULT_DEAL_ID, studioDealPath } from '@/data/studio';

const STAGES = ['Select files', 'Terms', 'Upload', 'Candidate'];

export function UploadPage(): ReactElement {
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  function simulateUpload() {
    if (!consent) return;
    setStage(2);
    setProgress(0);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
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
        <p className="lede">
          Extraction produces candidate evidence only — not automatic public truth.
        </p>
      </header>

      <StageRail stages={STAGES} activeIndex={stage} />

      {stage === 0 ? (
        <EmptyStateCard
          icon="upload_file"
          title="Drop source documents"
          description="Lease abstracts, rent rolls, and OMs stay in prototype-only storage. No files are sent."
          actions={
            <>
              <label className="upload-drop" htmlFor="file-input">
                Drag lease, rent roll, or OM here (prototype — no files sent)
              </label>
              <input id="file-input" type="file" className="sr-only" onChange={() => setStage(1)} />
              <p className="muted">Scanned documents may require review before extraction.</p>
            </>
          }
        />
      ) : null}

      {stage === 1 ? (
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
          <p id="upload-progress-label">Uploading sample document...</p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-labelledby="upload-progress-label"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${progress}% complete`}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {stage === 3 ? (
        <EmptyStateCard
          icon="task_alt"
          title="Upload complete"
          description="Candidate extraction is queued for review. No public promotion until source-use gates clear."
          tone="success"
          actions={
            <>
              <AuthorityBadge label="candidate-evidence" />
              <Link to={studioDealPath(DEFAULT_DEAL_ID, 'intake')} className="btn btn-primary">
                Review in Studio
              </Link>
            </>
          }
        />
      ) : null}
    </section>
  );
}
