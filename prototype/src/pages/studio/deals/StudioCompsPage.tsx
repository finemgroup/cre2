import { useMemo, useState, type ReactElement } from 'react';

import {
  DataTable,
  DetailDrawer,
  MaterialIcon,
  MetricCard,
  NonProductionCallout,
  PageTitle,
  PaywallOverlay,
  StudioCard,
  TrustBadge,
  WorkflowContextHeader,
} from '@/components/studio/StudioPrimitives';
import { ProvenanceCell, ReviewPostureBanner, SourceEvidenceBlockCard } from '@/components/provenance/ProvenanceWidgets';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { UpgradePlanModal } from '@/components/overlays/UpgradePlanModal';
import { TrustExplainerDrawer } from '@/components/overlays/TrustExplainerDrawer';
import { GateResolutionCallout } from '@/components/workflow/GateResolutionCallout';
import { MockBoundaryBanner } from '@/components/workflow/MockBoundaryBanner';
import { ContextualSurfaceTriggers } from '@/components/workflow/ContextualSurfaceTriggers';
import {
  filterStudioComps,
  STUDIO_COMP_SAVED_VIEWS,
  type CompSavedViewId,
} from '@/lib/comps/comp-saved-views';
import { getStudioCompViews, getStudioDealView } from '@/lib/runtime/studio-workspace';
import { studioDealPath } from '@/data/studio';
import {
  SegmentedControl,
  TabPanelSwitch,
  StudioDealNotFound,
  useStudioDeal,
} from '@/pages/studio/StudioShared';

export function StudioCompsPage(): ReactElement {
  const deal = useStudioDeal();
  const compViews = getStudioCompViews();
  const [savedView, setSavedView] = useState<CompSavedViewId>('all');
  const filteredComps = useMemo(
    () => filterStudioComps(compViews, savedView),
    [compViews, savedView]
  );
  const [selectedId, setSelectedId] = useState(compViews[0]?.id ?? '');
  const selected = compViews.find((comp) => comp.id === selectedId) ?? null;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<'table' | 'map'>('table');
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
  if (!deal) return <StudioDealNotFound />;
  const sourceBlocks = getStudioDealView(deal.id)?.sourceBlocks ?? [];
  const activeView = STUDIO_COMP_SAVED_VIEWS.find((entry) => entry.id === savedView);

  return (
    <div>
      <WorkflowContextHeader
        dealName={deal.name}
        stage="Comparable sales review"
        returnTo={studioDealPath(deal.id)}
        returnLabel="Return to deal"
      />
      <PageTitle
        eyebrow="Comparable sales"
        title="Comparable Sales Review"
        lede="Review comp authority, source citations, and visibility before underwriting assumptions."
      />
      <NonProductionCallout>
        Comparable sales are sample rows with mixed authority states.
      </NonProductionCallout>
      <MockBoundaryBanner variant="evidence" />
      <GateResolutionCallout
        action="Apply comp set to underwriting"
        prerequisite="Premium-private comp visibility and exit cap citation remain blocked."
        owner="An analyst"
        resolveTo={studioDealPath(deal.id, 'underwriting-sources')}
        resolveLabel="Review comp source trace"
      />
      <ReviewPostureBanner blocks={sourceBlocks} />
      <StudioCard title="Saved comp views" eyebrow="Filter preset">
        <div className="chip-row" role="group" aria-label="Saved comp view">
          {STUDIO_COMP_SAVED_VIEWS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={savedView === entry.id ? 'chip active' : 'chip'}
              aria-pressed={savedView === entry.id}
              onClick={() => setSavedView(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        {activeView ? <p className="muted">{activeView.description}</p> : null}
      </StudioCard>
      <div className="comps-grid">
        <StudioCard title="Subject Property">
          <div className="property-image small" aria-label="Mock subject property image" />
          <p>{deal.address}</p>
          <MetricCard label="Units" value="196" detail="Candidate from OM" />
          <MetricCard label="Target basis" value="$217k/unit" detail="Model-inferred" />
        </StudioCard>
        <StudioCard
          title="Sales Comparables"
          className="wide-card"
          actions={
            <SegmentedControl
              label="Comp view mode"
              value={view}
              options={['table', 'map']}
              onChange={setView}
            />
          }
        >
          <TabPanelSwitch panelKey={view}>
            {view === 'map' ? (
              <div className="mock-map map-hud-panel">
                <MaterialIcon name="map" />
                Sample map view. No precise public markers in MVP0.
              </div>
            ) : filteredComps.length === 0 ? (
              <EmptyStateCard
                icon="filter_alt_off"
                title="No comps in this saved view"
                description={`The "${activeView?.label ?? savedView}" filter removed every comparable row. Try Full set or Visible.`}
                actions={
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSavedView('all')}
                  >
                    Reset to full set
                  </button>
                }
              />
            ) : (
              <DataTable
                dense
                caption="Sales comparables"
                headers={['Comp', 'Distance', 'Units', 'Sale Price', 'Authority']}
                getRowKey={(_row, index) => filteredComps[index].id}
                rows={filteredComps.map((comp) => [
                  <button
                    type="button"
                    className="table-link"
                    onClick={() => {
                      setSelectedId(comp.id);
                      setDrawerOpen(true);
                    }}
                    aria-describedby={!comp.visible ? `${comp.id}-visibility` : undefined}
                  >
                    {comp.name}
                    {!comp.visible ? (
                      <span id={`${comp.id}-visibility`} className="sr-only">
                        {comp.safeExplanation}
                      </span>
                    ) : null}
                  </button>,
                  comp.distance,
                  comp.units,
                  <ProvenanceCell
                    value={comp.salePrice}
                    citation={sourceBlocks[2]?.citations[0]}
                    state={comp.authority}
                  />,
                  <TrustBadge state={comp.authority} />,
                ])}
              />
            )}
          </TabPanelSwitch>
          <div className="paywall-zone">
            <PaywallOverlay>
              <h3>Premium comp set locked</h3>
              <p>Upgrade to view provider-restricted and organization-private comparables.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setUpgradeOpen(true)}
              >
                Upgrade
              </button>
            </PaywallOverlay>
          </div>
        </StudioCard>
        <StudioCard title="Comp Detail" className="comp-aside">
          {selected ? (
            <div className="drawer-facts">
              <MetricCard
                label="Selected comp"
                value={selected.name}
                detail={`${selected.distance} from subject`}
              />
              <MetricCard
                label="Price / Unit"
                value={selected.pricePerUnit}
                detail={selected.authority}
              />
              <TrustBadge state={selected.authority} />
            </div>
          ) : (
            <p>Select a comparable sale to inspect authority and valuation context.</p>
          )}
        </StudioCard>
      </div>
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selected?.name ?? 'Comparable'}
      >
        {selected ? (
          <div className="drawer-facts">
            <MetricCard
              label="Price / Unit"
              value={selected.pricePerUnit}
              detail={selected.authority}
            />
            <MetricCard
              label="Cap Rate"
              value={selected.capRate}
              detail="Reviewed comparison basis"
            />
            <TrustBadge state={selected.authority} />
            {sourceBlocks.map((block) => (
              <SourceEvidenceBlockCard key={block.id} block={block} />
            ))}
            <button type="button" className="btn btn-secondary" onClick={() => setTrustOpen(true)}>
              How trust tiers work
            </button>
          </div>
        ) : null}
      </DetailDrawer>
      <UpgradePlanModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature="Premium comp set"
        detail="Unlock provider-restricted and organization-private comparables."
      />
      <TrustExplainerDrawer
        isOpen={trustOpen}
        onClose={() => setTrustOpen(false)}
        context={`Authority for ${selected?.name ?? 'this comp'} is ${selected?.authority ?? 'unknown'}.`}
      />
      <ContextualSurfaceTriggers dealId={deal.id} route="comps" />
    </div>
  );
}
