import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import {
  DataTable,
  DetailDrawer,
  NonProductionCallout,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { EvidenceMetadataList } from '@/components/evidence/EvidenceMetadataList';
import { DealCockpitPanel } from '@/components/workflow/DealCockpitPanel';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';
import { getStudioDealView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

import { DEAL_DOCUMENT_EVIDENCE } from './deal-route-shared';

export function StudioDealOverviewPage(): ReactElement {
  const { dealId } = useParams();
  const dealState = useRuntimeResource(
    () => runtimeServices.studio.getDeal(dealId),
    `deal-overview-${dealId ?? 'missing'}`,
    getStudioDealView(dealId)
  );
  const deal = dealState.value?.deal;
  const sourceBlocks = dealState.value?.sourceBlocks ?? [];
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!deal && !dealState.loading) return <StudioDealNotFound />;

  return (
    <div>
      {deal ? (
        <WorkflowContextHeader
          dealName={deal.name}
          stage="Deal cockpit"
          returnTo="/studio/dashboard"
        />
      ) : null}
      <NonProductionCallout>
        Deal metrics are mock projections with candidate/review state labels.
      </NonProductionCallout>
      <RuntimeResourceStatus
        loading={dealState.loading}
        error={dealState.error}
        variant="studio-deal"
      />
      {deal && !dealState.loading ? (
        <>
          <ReviewPostureBanner blocks={sourceBlocks} />
          <div className="deal-cockpit-stack">
            <DealCockpitPanel
              dealId={deal.id}
              kpis={[
                {
                  label: 'Asking Price',
                  value: deal.value,
                  detail: deal.authority,
                  posture: deal.authority,
                },
                { label: 'Indicated Value', value: '$46.8M', detail: 'Model-inferred' },
                { label: 'Target IRR', value: '14.8%', detail: 'Scenario draft' },
                { label: 'Equity Multiple', value: '1.82x', detail: 'Analyst review active' },
              ]}
            />
          </div>
          <div className="dashboard-grid">
            <StudioCard title="Property Snapshot" className="wide-card">
              <div className="property-snapshot">
                <div className="property-image" aria-label="Mock property image" />
                <div>
                  <p>
                    {deal.address} in {deal.market}. {deal.assetClass} value-add opportunity with
                    source-backed assumptions pending review.
                  </p>
                  <div className="mini-grid">
                    <div>
                      <strong>Asset Class</strong>
                      <span>{deal.assetClass}</span>
                    </div>
                    <div>
                      <strong>Status</strong>
                      <span>{deal.status}</span>
                    </div>
                    <div>
                      <strong>Authority</strong>
                      <TrustBadge state={deal.authority} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline">
                {['Packet received', 'Comps matched', 'Underwriting flags', 'Report draft'].map(
                  (step, index) => (
                    <div key={step} className={index < 2 ? 'done' : ''}>
                      <span>{index + 1}</span>
                      {step}
                    </div>
                  )
                )}
              </div>
            </StudioCard>
            <StudioCard
              title="Source Documents"
              actions={
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                >
                  Open drawer
                </button>
              }
            >
              <DataTable
                caption="Source documents"
                headers={['Document', 'Type', 'Uploaded', 'State']}
                rows={[
                  [
                    'Offering memorandum.pdf',
                    'Offering memorandum',
                    'Today',
                    <TrustBadge state="Candidate evidence" />,
                  ],
                  ['Rent roll.xlsx', 'Rent roll', 'Yesterday', <TrustBadge state="Reviewed" />],
                  [
                    'T12.pdf',
                    'Operating statement',
                    'Yesterday',
                    <TrustBadge state="Candidate evidence" />,
                  ],
                ]}
              />
            </StudioCard>
            <StudioCard title="Analyst Notes">
              <div className="notes-thread">
                <p>
                  <strong>Alex:</strong> Rent roll normalization and exit cap assumptions require
                  final review before report export.
                </p>
                <p>
                  <strong>Priya:</strong> Waiting on lender quote before clearing DSCR warning.
                </p>
                <label>
                  Add note
                  <textarea defaultValue="Mock note draft only." />
                </label>
              </div>
              <TrustBadge state="Candidate evidence" />
            </StudioCard>
            <StudioCard title="Deal Team">
              <div className="team-list">
                {[
                  'Alex Morgan - Lead',
                  'Priya Shah - Underwriting',
                  'Chris Lee - Capital Markets',
                ].map((member) => (
                  <div key={member}>{member}</div>
                ))}
              </div>
            </StudioCard>
          </div>
          <ContextualSurfaceTriggers dealId={deal.id} route="overview" />
          <DetailDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Document Evidence"
          >
            <p>
              Candidate document evidence remains separate from canonical deal facts until reviewed.
            </p>
            <TrustBadge state="Candidate evidence" />
            <EvidenceMetadataList heading="Source documents" items={DEAL_DOCUMENT_EVIDENCE} />
          </DetailDrawer>
        </>
      ) : null}
    </div>
  );
}
