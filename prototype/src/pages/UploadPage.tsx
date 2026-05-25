import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';
import { DEFAULT_DEAL_ID, studioDealPath } from '@/data/studio';
import { fixtureActors } from '@/lib/contracts/fixtures';
import type { CandidateUploadResult } from '@/lib/runtime/upload-flow';
import { createCandidateUpload } from '@/lib/runtime/upload-flow';
import { trackEvent } from '@/lib/analytics/collector';

const STAGES = ['Select files', 'Terms', 'Upload', 'Candidate'];

export function UploadPage(): ReactElement {
  const notifyPrototype = usePrototypeAction();
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('rent-roll.pdf');
  const [candidate, setCandidate] = useState<CandidateUploadResult | null>(null);
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
          const result = createCandidateUpload({
            actor: fixtureActors.sourceOwner,
            propertyId: 'demo-001',
            fileName,
            idempotencyKey: `upload-${fileName}`,
          });
          setCandidate(result);
          trackEvent({
            name: 'candidate_evidence_created',
            actorClass: fixtureActors.sourceOwner.actorClass,
            propertyId: result.evidence.propertyId,
            phase: result.evidence.reviewState,
            receiptId: result.receipt.id,
          });
          setStage(3);
          return 100;
        }
        return p + 20;
      });
    }, 20);
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
              <input
                id="file-input"
                type="file"
                className="sr-only"
                onChange={(event) => {
                  const nextFileName = event.target.files?.[0]?.name ?? 'rent-roll.pdf';
                  setFileName(nextFileName);
                  notifyPrototype('Public document upload');
                  trackEvent({
                    name: 'upload_stage_changed',
                    actorClass: fixtureActors.sourceOwner.actorClass,
                    route: '/upload',
                    phase: 'terms',
                  });
                  setStage(1);
                }}
              />
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
        <div className="card" aria-busy="true" aria-live="polite">
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
              {candidate ? (
                <div className="receipt" role="status">
                  <p>
                    Candidate evidence <code>{candidate.evidence.id}</code> remains{' '}
                    {candidate.evidence.reviewState}.
                  </p>
                  <p>
                    Upload receipt: <code>{candidate.receipt.id}</code> ·{' '}
                    {candidate.receipt.safeMessage}
                  </p>
                </div>
              ) : null}
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
