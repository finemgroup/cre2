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
import { usePrototypeToast } from '@/components/overlays/PrototypeToast';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { IntakeWorkflowNav } from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { mockCandidateFields, mockUploadFiles } from '@/lib/staged-import';
import { getStudioDealView } from '@/lib/runtime/studio-workspace';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

export function StudioDealIntakePage(): ReactElement {
  const { dealId } = useParams();
  const activeDeal = getStudioDealView(dealId)?.deal;
  const [propertyName, setPropertyName] = useState(activeDeal?.name ?? '');
  const { pushToast } = usePrototypeToast();
  if (!activeDeal) return <StudioDealNotFound />;
  const continueDealId = activeDeal.id;
  return (
    <div className="split-layout with-sticky">
      <div>
        <WorkflowContextHeader
          dealName={activeDeal.name}
          stage="Deal intake"
          returnTo={studioDealPath(activeDeal.id)}
          returnLabel="Return to deal"
        />
        <PageTitle
          title="Deal Intake"
          lede={`Capture deal basics for ${activeDeal.id} before comps and underwriting.`}
        />
        <IntakeWorkflowNav dealId={activeDeal.id} activeStep="intake" />
        <NonProductionCallout>
          Uploaded files and extracted fields remain candidate evidence until data review and source
          trace gates clear.
        </NonProductionCallout>
        <MockBoundaryBanner variant="evidence" />
        <GateResolutionCallout
          action="Continue to normalization workbench"
          prerequisite="Cap-rate basis and source materials still need cited evidence."
          owner="An analyst"
          resolveTo={studioDealPath(activeDeal.id, 'data-review')}
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
          <UploadDropzone files={mockUploadFiles} />
        </StudioCard>
        <StudioCard title="Financial Assumptions">
          <div className="form-grid">
            <label>
              T12 NOI
              <input defaultValue="$2,900,000" />
            </label>
            <label>
              Implied Cap Rate
              <input defaultValue="5.8%" aria-invalid="true" aria-describedby="cap-rate-error" />
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
        <StagedImportReviewPanel files={mockUploadFiles} candidates={mockCandidateFields} />
        <StickyActionBar>
          <span>Last saved just now</span>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => pushToast('Draft saved locally (prototype only).', 'success')}
          >
            Save draft
          </button>
          <Link to={studioDealPath(continueDealId, 'comps')} className="btn btn-primary">
            Continue to Comps
          </Link>
          <Link to={studioDealPath(continueDealId, 'data-review')} className="btn btn-secondary">
            Open Data Review
          </Link>
        </StickyActionBar>
      </div>
      <StudioCard title="Packet Preview">
        <div className="packet-preview">
          <h3>{propertyName || 'Untitled deal'}</h3>
          <p>Austin multifamily acquisition packet</p>
          <TrustBadge state="Candidate evidence" />
          <div className="metric-grid">
            <MetricCard label="Asking" value="$42.5M" detail="From OM" />
            <MetricCard label="T12 NOI" value="$2.9M" detail="Candidate" />
          </div>
          <StageStepper
            stages={['Uploaded', 'Extracting', 'Needs review', 'Ready']}
            activeIndex={2}
          />
        </div>
      </StudioCard>
      <ContextualSurfaceTriggers dealId={activeDeal.id} route="intake" />
    </div>
  );
}
