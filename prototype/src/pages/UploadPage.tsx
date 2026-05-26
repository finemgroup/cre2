import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { StageRail } from '@/components/ui/StageRail';
import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';
import { getPublicUploadGuideView } from '@/lib/runtime/public-upload';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { fixtureActors } from '@/lib/contracts/fixtures';
import type { CandidateUploadResult } from '@/lib/runtime/upload-flow';
import { createCandidateUpload } from '@/lib/runtime/upload-flow';
import { trackEvent } from '@/lib/analytics/collector';

export function UploadPage(): ReactElement {
  const notifyPrototype = usePrototypeAction();
  const uploadGuideState = useRuntimeResource(
    () => runtimeServices.public.getUploadGuide('demo-001'),
    'public-upload-guide',
    getPublicUploadGuideView('demo-001')
  );
  const uploadGuide = uploadGuideState.value;
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('rent-roll.pdf');
  const [candidate, setCandidate] = useState<CandidateUploadResult | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stages = uploadGuide?.stages ?? ['Select files', 'Terms', 'Upload', 'Candidate'];

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  function simulateUpload() {
    if (!consent || !uploadGuide) return;
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
            propertyId: uploadGuide.propertyId,
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

      <MockBoundaryBanner variant="evidence" />
      <RuntimeResourceStatus
        loading={uploadGuideState.loading}
        error={uploadGuideState.error}
        variant="public"
      />

      {!uploadGuideState.loading && uploadGuide ? (
        <>
          <div className="proof-strip" aria-label="Upload contribution posture">
            {[
              [uploadGuide.supportedTypes.length, 'Supported doc types'],
              [stages.length, 'Governed stages'],
              [uploadGuide.linkedDealId, 'Linked Studio deal'],
              ['Candidate', 'Default posture'],
            ].map(([value, label]) => (
              <article key={String(label)}>
                <strong className="fin-value">{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <p className="muted">{uploadGuide.reviewPolicy}</p>
        </>
      ) : null}

      <StageRail stages={stages} activeIndex={stage} />

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
              {uploadGuide ? (
                <ul className="evidence-list" aria-label="Supported document types">
                  {uploadGuide.supportedTypes.map((type) => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              ) : null}
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
          <p id="upload-progress-label">Uploading {fileName}…</p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-label={`Uploading ${fileName}`}
            aria-labelledby="upload-progress-label"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${progress}% complete`}
          >
            <div
              className="progress-fill"
              style={{ '--progress-fill': `${progress}%` } as CSSProperties}
            />
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
              <Link
                to={studioDealPath(uploadGuide?.linkedDealId ?? 'riverside-flats', 'intake')}
                className="btn btn-primary"
              >
                Review in Studio
              </Link>
              <Link
                to={studioDealPath(uploadGuide?.linkedDealId ?? 'riverside-flats', 'data-review')}
                className="btn btn-secondary"
              >
                Open data review
              </Link>
            </>
          }
        />
      ) : null}
    </section>
  );
}
