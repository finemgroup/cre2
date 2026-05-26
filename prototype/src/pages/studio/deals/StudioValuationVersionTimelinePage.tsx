import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  DataTable,
  NonProductionCallout,
  PageTitle,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { PrototypeActionLink } from '@/components/overlays/PrototypeActionLink';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { EvidenceValueCard } from '@/components/workstation/UnderwritingWorkstationPrimitives';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getLinkedPropertyId } from '@/lib/workflow-identity';
import { studioDealPath, studioReportPath } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

import { VERSION_SNAPSHOTS } from './deal-route-shared';

export function StudioValuationVersionTimelinePage(): ReactElement {
  const deal = useStudioDeal();
  const [selectedVersion, setSelectedVersion] = useState(VERSION_SNAPSHOTS[0]);
  const propertyId = getLinkedPropertyId(deal?.id) ?? 'demo-001';
  const valuationVersion = getValuationVersionForActor({
    actor: fixtureActors.orgAdmin,
    propertyId,
  });
  if (!deal) return <StudioDealNotFound />;

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Valuation snapshots"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <PageTitle
        eyebrow="Snapshot governance"
        title="Valuation snapshots"
        lede="Working scenarios stay editable. A valuation snapshot locks one scenario with evidence refs, comp set, as-of dates, and export posture."
      />
      <MockBoundaryBanner variant="snapshot" />
      <StudioCard title="Scenario to snapshot model" eyebrow="Governance language">
        <p>
          Use <strong>Scenarios</strong> to compare assumption presets and sensitivity output. When
          gates clear, promote one scenario into a <strong>valuation snapshot</strong> that carries
          evidence refs, comp set, and export eligibility — without implying immutable storage in
          this prototype.
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
      <div className="split-workstation-grid">
        <StudioCard title="Timeline" className="wide-card">
          <div className="version-timeline">
            {VERSION_SNAPSHOTS.map((version) => (
              <button
                key={version.id}
                type="button"
                className={
                  selectedVersion.id === version.id ? 'version-card active' : 'version-card'
                }
                onClick={() => setSelectedVersion(version)}
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
        </StudioCard>
      </div>
      <ContextualSurfaceTriggers dealId={deal.id} route="versions" />
    </div>
  );
}
