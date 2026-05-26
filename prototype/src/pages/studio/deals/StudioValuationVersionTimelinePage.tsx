import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  DataTable,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { ReviewPostureBanner } from '@/components/provenance/ProvenanceWidgets';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { EvidenceValueCard } from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { getStudioValuationVersionsView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath, studioReportPath } from '@/data/studio';
import { StudioDealNotFound } from '@/pages/studio/StudioShared';

export function StudioValuationVersionTimelinePage(): ReactElement {
  const { dealId } = useParams();
  const versionsState = useRuntimeResource(
    () => runtimeServices.studio.getValuationVersions(dealId),
    `valuation-versions-${dealId ?? 'missing'}`,
    getStudioValuationVersionsView(dealId)
  );
  const versionsView = versionsState.value;
  const deal = versionsView?.deal;
  const snapshots = versionsView?.snapshots ?? [];
  const valuationVersion = versionsView?.valuationVersion;
  const sourceBlocks = versionsView?.sourceBlocks ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedVersion =
    snapshots.find((version) => version.id === selectedId) ?? snapshots[0] ?? null;
  const openGateCount = snapshots.filter((version) => !version.current).length;

  if (!deal && !versionsState.loading) return <StudioDealNotFound />;

  return (
    <div>
      {deal ? (
        <WorkflowContextHeader
          dealName={deal.name}
          stage="Valuation snapshots"
          returnTo={studioDealPath(deal.id, 'underwriting')}
          returnLabel="Return to cockpit"
        />
      ) : null}
      <PageTitle
        eyebrow="Snapshot governance"
        title="Valuation snapshots"
        lede="Working scenarios stay editable. A valuation snapshot locks one scenario with evidence refs, comp set, as-of dates, and export posture."
      />
      <MockBoundaryBanner variant="snapshot" />
      <RuntimeResourceStatus
        loading={versionsState.loading}
        error={versionsState.error}
        variant="studio-deal"
      />
      {deal && !versionsState.loading ? (
        <>
          <ReviewPostureBanner blocks={sourceBlocks} />
          {!versionsState.loading && snapshots.length > 0 ? (
            <div className="proof-strip" aria-label="Valuation snapshot posture">
              {[
                [snapshots.length, 'Snapshots in adapter'],
                [snapshots.filter((version) => version.current).length, 'Current snapshot'],
                [valuationVersion?.readiness.ready ? 'Clear' : 'Blocked', 'Export posture'],
                [openGateCount, 'Prior snapshots'],
              ].map(([value, label]) => (
                <article key={String(label)}>
                  <strong className="fin-value">{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          ) : null}
          <StudioCard title="Scenario to snapshot model" eyebrow="Governance language">
            <p>
              Use <strong>Scenarios</strong> to compare assumption presets and sensitivity output.
              When gates clear, promote one scenario into a <strong>valuation snapshot</strong> that
              carries evidence refs, comp set, and export eligibility — without implying immutable
              storage in this prototype.
            </p>
            <div className="studio-actions">
              <Link to={studioDealPath(deal.id, 'scenarios')} className="btn btn-secondary">
                Compare scenarios
              </Link>
            </div>
          </StudioCard>
          <NonProductionCallout>
            Snapshot history is a mock governance projection. Immutable storage and receipts remain
            runtime gated.
          </NonProductionCallout>
          <GateResolutionCallout
            action="Export governed report"
            prerequisite="Export remains blocked until section review, source rights, and snapshot lock clear."
            owner="An analyst"
            resolveTo={studioReportPath(deal.id)}
            resolveLabel="Review report gates"
          />
          {valuationVersion ? (
            <StudioCard title="Export eligibility">
              <ValuationReadinessRail
                evaluation={valuationVersion.readiness}
                orientation="vertical"
                heading="Version export posture"
              />
              <p className="muted">
                Evidence snapshot {valuationVersion.evidenceSnapshot.id} ·{' '}
                {valuationVersion.evidenceSnapshot.manifestHash}
              </p>
              <div className="studio-actions">
                <PrototypeActionLink
                  to={studioReportPath(deal.id)}
                  className="btn btn-secondary"
                  feature="Review report gates"
                >
                  Review Report Gates
                </PrototypeActionLink>
                <PrototypeActionLink
                  to={studioDealPath(deal.id, 'ic-packet')}
                  className="btn btn-secondary"
                  feature="Open IC packet"
                >
                  Open IC Packet
                </PrototypeActionLink>
              </div>
            </StudioCard>
          ) : null}
          {snapshots.length === 0 ? (
            <EmptyStateCard
              icon="history"
              title="No valuation snapshots returned"
              description="The studio runtime adapter returned an empty snapshot timeline. Scenario promotion and export gates remain blocked until a snapshot exists."
              tone="warning"
              actions={
                <Link to={studioDealPath(deal.id, 'scenarios')} className="btn btn-secondary">
                  Compare scenarios
                </Link>
              }
            />
          ) : (
            <div className="split-workstation-grid">
              <StudioCard title="Timeline" className="wide-card">
                <div className="version-timeline">
                  {snapshots.map((version) => (
                    <button
                      key={version.id}
                      type="button"
                      className={
                        selectedVersion?.id === version.id ? 'version-card active' : 'version-card'
                      }
                      onClick={() => setSelectedId(version.id)}
                    >
                      <span>{version.id}</span>
                      <strong>{version.label}</strong>
                      <small>
                        {version.createdAt} · {version.actor}
                      </small>
                      <TrustBadge state={version.current ? 'Reviewed' : 'Candidate evidence'} />
                    </button>
                  ))}
                </div>
              </StudioCard>
              <StudioCard title="Selected Version Details">
                {selectedVersion ? (
                  <>
                    <EvidenceValueCard
                      item={{
                        id: selectedVersion.id,
                        label: selectedVersion.label,
                        value: selectedVersion.id,
                        posture: selectedVersion.current ? 'Reviewed' : 'Candidate evidence',
                        sourceRef: selectedVersion.evidenceRef,
                        asOf: selectedVersion.createdAt,
                        confidence: selectedVersion.current ? 'High' : 'Medium',
                        detail: `${selectedVersion.scenarioSet}. Gate status: ${selectedVersion.gateStatus}.`,
                      }}
                    />
                    <DataTable
                      caption="Version deltas"
                      headers={['Delta', 'Detail']}
                      rows={[
                        ['Cap rate adjust', '5.25% to 5.50%'],
                        ['Scenario added', selectedVersion.scenarioSet],
                        ['Excluded candidate', 'OM_Draft_v1.pdf superseded'],
                      ]}
                    />
                    <PrototypeActionLink
                      to={studioReportPath(deal.id)}
                      className="btn btn-primary"
                      feature="Create report draft"
                    >
                      Create Report Draft
                    </PrototypeActionLink>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled
                      aria-describedby="version-lock-blocked"
                    >
                      Lock Version
                    </button>
                    <span className="sr-only" id="version-lock-blocked">
                      Version lock disabled until all underwriting gates pass in mock state.
                    </span>
                  </>
                ) : (
                  <p className="muted">Select a snapshot to inspect evidence refs and gate posture.</p>
                )}
              </StudioCard>
            </div>
          )}
          <ContextualSurfaceTriggers dealId={deal.id} route="versions" />
        </>
      ) : null}
    </div>
  );
}
