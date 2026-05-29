import { useMemo, useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import {
  filterPublicComps,
  PUBLIC_COMP_SAVED_VIEWS,
  type CompSavedViewId,
} from '@/lib/comps/comp-saved-views';
import { summarizeCompProviderRights } from '@/lib/comps/comp-provider-rights';
import { getPublicCompContextView } from '@/lib/runtime/public-comps';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';
import { fixtureActors } from '@/lib/contracts/fixtures';
import { getValuationVersionForActor } from '@/lib/contracts/valuation-version';
import { getLinkedDealId, getPropertyRecord } from '@/lib/workflow-identity';
import { appendExportFixtureStateQuery } from '@/lib/runtime/public-export-fixtures';

export function CompsPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const property = getPropertyRecord(id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedView, setSavedView] = useState<CompSavedViewId>('all');
  const compState = useRuntimeResource(
    () => runtimeServices.public.getCompContext(undefined, property?.id),
    `comps-${property?.id ?? 'missing'}`,
    getPublicCompContextView(undefined, property?.id)
  );
  const compContext = compState.value;
  const compViews = compContext.comps;
  const filteredComps = useMemo(
    () => filterPublicComps(compViews, savedView),
    [compViews, savedView]
  );
  const rightsSummary = useMemo(
    () =>
      summarizeCompProviderRights(
        compViews.map((comp) => ({ visible: comp.canInspect, authority: comp.authority }))
      ),
    [compViews]
  );
  const selected = compViews.find((comp) => comp.id === selectedId);
  const activeView = PUBLIC_COMP_SAVED_VIEWS.find((entry) => entry.id === savedView);

  if (!property) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Route guard</p>
          <h1>Comp comparison unavailable</h1>
          <p className="lede">
            Select a sample property first. Global comp views require an active subject property id.
          </p>
        </header>
        <Link to="/" className="btn btn-primary">
          Return to search
        </Link>
      </section>
    );
  }

  const linkedDealId = getLinkedDealId(property.id);
  const valuationVersion = getValuationVersionForActor({
    actor: fixtureActors.public,
    propertyId: property.id,
  });

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Comp comparison</p>
        <h1>Side-by-side comp dashboard</h1>
        <p className="lede">
          Permission-filtered comps for {property.address} with authority labels and blocked rows
          omitted from export.
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="property" />
      <RuntimeResourceStatus loading={compState.loading} error={compState.error} variant="public" />

      {!compState.loading && compViews.length > 0 ? (
        <div className="proof-strip" aria-label="Comp provider rights">
          {[
            [rightsSummary.visible, 'Visible comps'],
            [rightsSummary.restricted, 'Provider-restricted'],
            [rightsSummary.total, 'Total in adapter set'],
          ].map(([value, label]) => (
            <article key={String(label)}>
              <strong className="fin-value">{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      ) : null}

      <section className="card readiness-card">
        <ValuationReadinessRail
          evaluation={valuationVersion.readiness}
          heading="Comp set readiness"
        />
      </section>

      <section className="card" aria-labelledby="comp-saved-view-heading">
        <h2 id="comp-saved-view-heading">Saved comp views</h2>
        <div className="chip-row" role="group" aria-label="Saved comp view">
          {PUBLIC_COMP_SAVED_VIEWS.map((entry) => (
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
      </section>

      {!compState.loading && compViews.length === 0 ? (
        <EmptyStateCard
          icon="analytics"
          title="No comps returned"
          description="The runtime adapter returned an empty comp set for this property. Provider rights or sandbox filtering may be blocking every row."
          tone="warning"
        />
      ) : filteredComps.length === 0 ? (
        <EmptyStateCard
          icon="filter_alt_off"
          title="No comps match this saved view"
          description={`The "${activeView?.label ?? savedView}" filter removed every row for ${property.address}.`}
          actions={
            <button type="button" className="btn btn-secondary" onClick={() => setSavedView('all')}>
              Reset to full set
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table>
            <caption>Sample comp set for {property.address}</caption>
            <thead>
              <tr>
                <th scope="col">Comp</th>
                <th scope="col">Distance</th>
                <th scope="col">Cap rate</th>
                <th scope="col">Authority</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComps.map((comp) => (
                <tr key={comp.id} className={selectedId === comp.id ? 'row-selected' : undefined}>
                  <td>{comp.name}</td>
                  <td>{comp.distanceMi} mi</td>
                  <td>{comp.capRate}</td>
                  <td>
                    <AuthorityBadge
                      label={comp.authority === 'blocked' ? 'blocked' : comp.authority}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setSelectedId(comp.id)}
                      disabled={!comp.canInspect}
                      aria-describedby={!comp.canInspect ? `${comp.id}-blocked-reason` : undefined}
                    >
                      Inspect
                    </button>
                    {!comp.canInspect ? (
                      <span id={`${comp.id}-blocked-reason`} className="sr-only">
                        {comp.safeExplanation}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="card" aria-labelledby="comp-map-context-heading">
        <h2 id="comp-map-context-heading">Map context fallback</h2>
        <p className="muted">
          The comp map is represented as a keyboard-readable list in this prototype.
        </p>
        <div className="provenance-labels" aria-label="Comp map provenance labels">
          <AuthorityBadge label="sample-map-data" />
          <AuthorityBadge label="not-legal-boundary" />
        </div>
        <ul className="map-layer-list" aria-label="Comp map layers">
          {compContext.mapLayers.map((layer) => (
            <li key={layer.id}>
              <strong>{layer.label}</strong>
              <span>
                {layer.precisionLabel} · {layer.refreshedLabel}
              </span>
              <small>{layer.safeCaveat}</small>
            </li>
          ))}
        </ul>
        <ul className="evidence-list" aria-label="Trade areas">
          {compContext.tradeAreas.map((tradeArea) => (
            <li key={tradeArea.id}>
              <strong>{tradeArea.label}</strong> — {tradeArea.parametersLabel}.{' '}
              {tradeArea.safeCaveat}
            </li>
          ))}
        </ul>
      </section>

      <MapLayerControlPanel
        layers={compContext.mapLayers}
        evidenceByLayer={compContext.evidenceByLayer}
        heading="Comp map layer controls"
      />

      <SophexSheet
        isOpen={Boolean(selected)}
        label={selected ? `Comp detail — ${selected.name}` : 'Comp detail'}
        onClose={() => setSelectedId(null)}
      >
        {selected ? (
          <>
            <p>{selected.note ?? 'Permitted comp detail for prototype viewer.'}</p>
            <AuthorityBadge
              label={selected.authority === 'blocked' ? 'blocked' : selected.authority}
            />
          </>
        ) : null}
      </SophexSheet>
      <div className="action-row">
        <Link
          to={appendExportFixtureStateQuery(`/report/${property.id}`, searchParams.get('state'))}
          className="btn btn-primary"
        >
          Preview report for {property.address}
        </Link>
      </div>
    </section>
  );
}
