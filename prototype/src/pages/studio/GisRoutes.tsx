import type { ReactElement } from 'react';

import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { MapPlaceholderPreview } from '@/components/spatial/MapPlaceholderPreview';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import {
  DataTable,
  MaterialIcon,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  StatusBadge,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { DataWorkbenchShell } from '@/components/workflow/DataWorkbenchShell';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import { getStudioSpatialWorkbenchView } from '@/lib/runtime/studio-workspace';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { studioDealPath } from '@/data/studio';
import { StudioDealNotFound, useStudioDeal } from '@/pages/studio/StudioShared';

export function StudioSpatialWorkbenchPage(): ReactElement {
  const deal = useStudioDeal();
  const spatialState = useRuntimeResource(
    () => runtimeServices.studio.getSpatialWorkbench(deal?.id),
    `spatial-${deal?.id ?? 'missing'}`,
    getStudioSpatialWorkbenchView(deal?.id)
  );
  if (!deal) return <StudioDealNotFound />;
  const view = spatialState.value;
  if (!view) return <StudioDealNotFound />;

  const {
    summary,
    sourceRights,
    verification,
    tradeAreas,
    layers,
    performanceBudgets,
    performanceSummary,
    spatialContext,
  } = view;

  const manifestPanel = (
    <StudioCard title="Map Layer Manifest" className="wide-card">
      <MapPlaceholderPreview caption="Sample spatial workbench — metadata-first, geometry deferred.">
        <div className="provenance-labels">
          <AuthorityBadge label="sample-map-data" />
          <AuthorityBadge label="not-legal-boundary" />
        </div>
      </MapPlaceholderPreview>
      <MapLayerControlPanel
        layers={layers}
        evidenceByLayer={spatialContext?.evidenceByLayer ?? {}}
        heading="Report-context layer controls"
      />
      <DataTable
        caption="Source rights manifest"
        headers={['Layer', 'Policy', 'Decision', 'Safe message']}
        rows={sourceRights.map((entry) => [
          entry.label,
          entry.policy,
          entry.decision,
          entry.safeExplanation,
        ])}
      />
    </StudioCard>
  );

  const tradeAreaPanel = (
    <StudioCard title="Trade Areas">
      {tradeAreas.length > 0 ? (
        <DataTable
          caption="Report-eligible trade areas"
          headers={['Label', 'Method', 'Parameters', 'Posture']}
          rows={tradeAreas.map((area) => [
            area.label,
            area.method,
            area.parametersLabel,
            <TrustBadge
              key={area.id}
              state={
                area.visibility === 'organization-private'
                  ? 'Reviewer required'
                  : area.visibility === 'provider-restricted'
                    ? 'Blocked'
                    : 'Reviewed'
              }
            />,
          ])}
        />
      ) : (
        <p className="muted">No report-eligible trade areas for this actor context.</p>
      )}
      {summary.warnings.length > 0 ? (
        <ul className="governance-list">
          {summary.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </StudioCard>
  );

  const verificationPanel = (
    <StudioCard title="Location Verification">
      <StatusBadge
        status={verification.conflicts > 0 ? 'Coordinate conflict' : 'Sample verification'}
      />
      <DataTable
        caption="Spatial evidence verification"
        headers={['Label', 'State', 'Caveat']}
        rows={verification.items.map((item) => [item.label, item.state, item.caveat])}
      />
      {summary.blockedLayers.length > 0 ? (
        <>
          <p className="studio-eyebrow">Blocked layers</p>
          <ul className="governance-list">
            {summary.blockedLayers.map((layer) => (
              <li key={layer}>
                <MaterialIcon name="block" /> {layer}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </StudioCard>
  );

  const performancePanel = (
    <StudioCard title="Layer Performance Budgets">
      <DataTable
        caption="GIS layer performance budgets"
        headers={['Layer', 'Payload class', 'Lazy load', 'Budget (KB)', 'Note']}
        rows={performanceBudgets.map((budget) => [
          budget.label,
          budget.payloadSizeClass,
          budget.lazyLoadPolicy,
          String(budget.maxInitialPayloadKb),
          budget.safeNote,
        ])}
      />
      <p className="muted">
        {performanceSummary.deferredCount} layers deferred · mock MVP0 initial cap 128 KB
      </p>
    </StudioCard>
  );

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Spatial workbench"
        returnTo={studioDealPath(deal.id, 'underwriting')}
        returnLabel="Return to cockpit"
      />
      <PageTitle
        eyebrow="GIS contract spine"
        title="Spatial Manifest & Trade Area Workbench"
        lede="Map layer manifest, source rights, verification posture, and trade areas — all mock-only."
      />
      <NonProductionCallout>
        No live GeoJSON, provider keys, or external GIS services. Geometry remains deferred-heavy in
        prototype manifests.
      </NonProductionCallout>
      <RuntimeResourceStatus
        loading={spatialState.loading}
        error={spatialState.error}
        variant="studio-deal"
      />
      <div className="metric-grid spatial-workbench-metrics">
        <MetricCard
          label="Visible layers"
          value={String(summary.layerCount)}
          detail="Report context"
        />
        <MetricCard
          label="Trade areas"
          value={String(summary.reportEligibleTradeAreas)}
          detail="Report eligible"
        />
        <MetricCard
          label="Spatial source"
          value={summary.spatialSourceClear ? 'Clear' : 'Blocked'}
          detail={summary.spatialSourceClear ? 'No visible conflicts' : 'Conflict or rights issue'}
        />
        <MetricCard
          label="Verification conflicts"
          value={String(verification.conflicts)}
          detail={`${verification.unverified} unverified`}
        />
        <MetricCard
          label="Initial load budget"
          value={`${performanceSummary.initialLoadKb} KB`}
          detail={performanceSummary.withinBudget ? 'Within mock budget' : 'Review deferred layers'}
        />
      </div>
      <DataWorkbenchShell
        title="Spatial Evidence Workbench"
        subtitle="Source rights, verification, and layer budgets stay visible across table, list, and grid views."
        storageKey={`spatial-workbench-${deal.id}`}
        secondaryControls={
          <>
            <StatusBadge
              status={summary.spatialSourceClear ? 'Source rights clear' : 'Source rights blocked'}
            />
            <StatusBadge
              status={
                verification.conflicts > 0
                  ? `${verification.conflicts} verification conflicts`
                  : 'Verification sample'
              }
            />
          </>
        }
        views={{
          table: (
            <div className="split-workstation-grid">
              {manifestPanel}
              {tradeAreaPanel}
              {verificationPanel}
              {performancePanel}
            </div>
          ),
          list: (
            <ul className="governance-list spatial-workbench-list">
              {sourceRights.map((entry) => (
                <li key={entry.label}>
                  <strong>{entry.label}</strong>
                  <span>
                    {entry.decision} · {entry.safeExplanation}
                  </span>
                </li>
              ))}
              {tradeAreas.map((area) => (
                <li key={area.id}>
                  <strong>{area.label}</strong>
                  <span>
                    {area.method} · {area.parametersLabel}
                  </span>
                </li>
              ))}
              {verification.items.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>
                    {item.state} · {item.caveat}
                  </span>
                </li>
              ))}
            </ul>
          ),
          grid: (
            <div className="dashboard-grid spatial-workbench-grid">
              {manifestPanel}
              {tradeAreaPanel}
              {verificationPanel}
              {performancePanel}
            </div>
          ),
        }}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="spatial" />
    </div>
  );
}
