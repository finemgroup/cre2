import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StageStepper,
  StickyActionBar,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { UploadDropzone } from '@/components/upload/UploadDropzone';
import { StagedImportReviewPanel } from '@/components/review/StagedImportReviewPanel';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { IntakeWorkflowNav } from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { getStudioDealIntakeView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

const INTAKE_STAGES = ['Uploaded', 'Extracting', 'Needs review', 'Ready'];

export function StudioDealIntakePage(): ReactElement {
  const { dealId } = useParams();
  const intakeState = useRuntimeResource(
    () => runtimeServices.studio.getDealIntake(dealId),
    `deal-intake-${dealId ?? 'missing'}`,
    getStudioDealIntakeView(dealId)
  );
  const intakeView = intakeState.value;
  const deal = intakeView?.deal;
  const uploadFiles = intakeView?.uploadFiles ?? [];
  const candidateFields = intakeView?.candidateFields ?? [];
  const sourceBlocks = intakeView?.sourceBlocks ?? [];
  const activeStageIndex = intakeView?.activeStageIndex ?? 0;
  const filesNeedingReview = intakeView?.filesNeedingReview ?? 0;
  const [propertyName, setPropertyName] = useState(deal?.name ?? '');
  const { pushToast } = usePrototypeToast();

  if (!deal && !intakeState.loading) return <StudioDealNotFound />;

  return (
    <div className="split-layout with-sticky">
      <div>
        {deal ? (
          <WorkflowContextHeader
            dealName={deal.name}
            stage="Deal intake"
            returnTo={studioDealPath(deal.id)}
            returnLabel="Return to deal"
          />
        ) : null}
        <PageTitle
          title="Deal Intake"
          lede={
            deal
              ? `Capture deal basics for ${deal.id} before comps and underwriting.`
              : 'Capture deal basics before comps and underwriting.'
          }
        />
        <IntakeWorkflowNav dealId={deal?.id ?? dealId ?? ''} activeStep="intake" />
        <NonProductionCallout>
          Uploaded files and extracted fields remain candidate evidence until data review and source
          trace gates clear.
        </NonProductionCallout>
        <MockBoundaryBanner variant="evidence" />
        <RuntimeResourceStatus
          loading={intakeState.loading}
          error={intakeState.error}
          variant="studio-deal"
        />
        {deal && !intakeState.loading ? (
          <>
            <ReviewPostureBanner blocks={sourceBlocks} />
            {uploadFiles.length > 0 ? (
              <div className="proof-strip" aria-label="Intake packet posture">
                {[
                  [uploadFiles.length, 'Staged files'],
                  [candidateFields.length, 'Candidate fields'],
                  [filesNeedingReview, 'Need review'],
                  [INTAKE_STAGES[activeStageIndex], 'Pipeline stage'],
                ].map(([value, label]) => (
                  <article key={String(label)}>
                    <strong className="fin-value">{value}</strong>
                    <span>{label}</span>
                  </article>
                ))}
              </div>
            ) : null}
            <GateResolutionCallout
              action="Continue to normalization workbench"
              prerequisite="Cap-rate basis and source materials still need cited evidence."
              owner="An analyst"
              resolveTo={studioDealPath(deal.id, 'data-review')}
              resolveLabel="Open data review"
            />
            <StudioCard title="Property Basics">
              <div className="form-grid">
                <label>
                  Property name
                  <input
                    value={propertyName}
                    onChange={(event) => setPropertyName(event.target.value)}
                  />
                </label>
                <label>
                  Market
                  <input defaultValue="Austin, TX" />
                </label>
                <label>
                  Units
                  <input defaultValue="196" />
                </label>
                <label>
                  Year Built
                  <input defaultValue="2018" />
                </label>
              </div>
            </StudioCard>
            <StudioCard title="Deal Basics">
              <div className="form-grid">
                <label>
                  Asking price
                  <input defaultValue="$42,500,000" />
                </label>
                <label>
                  Status
                  <select defaultValue="Candidate evidence">
                    <option>Candidate evidence</option>
                    <option>Needs review</option>
                  </select>
                </label>
              </div>
              <p className="field-error" id="cap-rate-error">
                Validation: cap-rate basis requires a cited source before export.
              </p>
            </StudioCard>
            <StudioCard title="Source Materials">
              {uploadFiles.length === 0 ? (
                <EmptyStateCard
                  icon="upload_file"
                  title="No staged files returned"
                  description="The studio runtime adapter returned an empty intake file list. Upload remains mock-only until the provider lane opens."
                  tone="warning"
                  actions={
                    <Link to={studioDealPath(deal.id, 'data-review')} className="btn btn-secondary">
                      Open data review
                    </Link>
                  }
                />
              ) : (
                <UploadDropzone files={uploadFiles} />
              )}
            </StudioCard>
            <StudioCard title="Financial Assumptions">
              <div className="form-grid">
                <label>
                  T12 NOI
                  <input defaultValue="$2,900,000" />
                </label>
                <label>
                  Implied Cap Rate
                  <input
                    defaultValue="5.8%"
                    aria-invalid="true"
                    aria-describedby="cap-rate-error"
                  />
                </label>
                <label>
                  Vacancy
                  <input defaultValue="4.5%" aria-invalid="true" aria-describedby="vacancy-error" />
                </label>
              </div>
              <p className="field-error" id="vacancy-error">
                Vacancy assumption requires a supporting rent roll citation.
              </p>
            </StudioCard>
            {candidateFields.length > 0 ? (
              <StagedImportReviewPanel files={uploadFiles} candidates={candidateFields} />
            ) : null}
            <StickyActionBar>
              <span>Last saved just now</span>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => pushToast('Draft saved locally (prototype only).', 'success')}
              >
                Save draft
              </button>
              <Link to={studioDealPath(deal.id, 'comps')} className="btn btn-primary">
                Continue to Comps
              </Link>
              <Link to={studioDealPath(deal.id, 'data-review')} className="btn btn-secondary">
                Open Data Review
              </Link>
            </StickyActionBar>
          </>
        ) : null}
      </div>
      {deal && !intakeState.loading ? (
        <StudioCard title="Packet Preview">
          <div className="packet-preview">
            <h3>{propertyName || deal.name || 'Untitled deal'}</h3>
            <p>Austin multifamily acquisition packet</p>
            <TrustBadge state="Candidate evidence" />
            <div className="metric-grid">
              <MetricCard label="Asking" value="$42.5M" detail="From OM" />
              <MetricCard label="T12 NOI" value="$2.9M" detail="Candidate" />
            </div>
            <StageStepper stages={INTAKE_STAGES} activeIndex={activeStageIndex} />
          </div>
        </StudioCard>
      ) : null}
      {deal ? <ContextualSurfaceTriggers dealId={deal.id} route="intake" /> : null}
    </div>
  );
}
