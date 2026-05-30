import { useMemo, useState, type ReactElement } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { PublicTrustStrip } from '@/components/public/PublicTrustStrip';
import { PublicWorkbenchShell } from '@/components/public/PublicWorkbenchShell';
import { SpatialPreviewCard } from '@/components/spatial/SpatialPreviewCard';
import { ValuationReadinessRail } from '@/components/workflow/ValuationReadinessRail';
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
import { getPropertyRecord } from '@/lib/workflow-identity';
import { appendExportFixtureStateQuery } from '@/lib/runtime/public-export-fixtures';

type CompTab = 'sale' | 'lease';

export function CompsPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const property = getPropertyRecord(id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedView, setSavedView] = useState<CompSavedViewId>('all');
  const [compTab, setCompTab] = useState<CompTab>('sale');
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

  const valuationVersion = getValuationVersionForActor({
    actor: fixtureActors.public,
    propertyId: property.id,
  });

  const gridPanel = (
    <div className="comps-workbench-grid">
      <div className="comps-workbench-toolbar">
        <div className="chip-row" role="tablist" aria-label="Comp type">
          {(['sale', 'lease'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={compTab === tab}
              className={compTab === tab ? 'chip active' : 'chip'}
              onClick={() => setCompTab(tab)}
            >
              {tab === 'sale' ? 'Sale comps' : 'Lease comps'}
            </button>
          ))}
        </div>
        <p className="muted">
          {filteredComps.length} matching comps · {compTab} view · fixture-backed only
        </p>
      </div>

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
          description="The runtime adapter returned an empty comp set for this property."
          tone="warning"
        />
      ) : filteredComps.length === 0 ? (
        <EmptyStateCard
          icon="filter_alt_off"
          title="No comps match this saved view"
          description={`The "${activeView?.label ?? savedView}" filter removed every row.`}
          actions={
            <button type="button" className="btn btn-secondary" onClick={() => setSavedView('all')}>
              Reset to full set
            </button>
          }
        />
      ) : (
        <>
          <div className="table-wrap comps-table-desktop">
            <table className="studio-table inst-table">
              <caption>Sample comp set for {property.address}</caption>
              <thead>
                <tr>
                  <th scope="col">Address</th>
                  <th scope="col">Asset type</th>
                  <th scope="col">Sale date</th>
                  <th scope="col">Price/SF</th>
                  <th scope="col">Cap rate</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Sources</th>
                </tr>
              </thead>
              <tbody>
                {filteredComps.map((comp) => (
                  <tr key={comp.id} className={selectedId === comp.id ? 'row-selected' : undefined}>
                    <td>{comp.name}</td>
                    <td>{property.assetType}</td>
                    <td>2024-Q3</td>
                    <td>{compTab === 'sale' ? '$412' : '$28/mo'}</td>
                    <td>{comp.capRate}</td>
                    <td>
                      <AuthorityBadge
                        label={comp.authority === 'blocked' ? 'blocked' : comp.authority}
                      />
                    </td>
                    <td>{comp.canInspect ? '2 sources' : 'Restricted'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comps-card-list" aria-label="Comp cards">
            {filteredComps.map((comp) => (
              <article key={comp.id} className="card comps-mobile-card">
                <h3>{comp.name}</h3>
                <p>
                  {comp.distanceMi} mi · Cap {comp.capRate}
                </p>
                <AuthorityBadge label={comp.authority === 'blocked' ? 'blocked' : comp.authority} />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSelectedId(comp.id)}
                  disabled={!comp.canInspect}
                >
                  Inspect
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const mapPanel = (
    <div className="comps-map-panel">
      <SpatialPreviewCard
        title={`Comp context — ${property.address}`}
        caption="Priced markers are fixture-only — no live provider feed"
        badges={['Sample map data', `${rightsSummary.restricted} restricted`]}
      />
      <ul className="map-layer-list" aria-label="Comp map layers">
        {compContext.mapLayers.map((layer) => (
          <li key={layer.id}>
            <strong>{layer.label}</strong>
            <span>
              {layer.precisionLabel} · {layer.refreshedLabel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const evidenceRail = (
    <>
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
      <p className="muted">
        Private and provider-restricted comps stay labeled. Export and download remain disabled.
      </p>
    </>
  );

  return (
    <section className="page">
      <PublicWorkbenchShell
        eyebrow="Comp comparison"
        title={`Comps for ${property.address}`}
        description="Split map and grid workbench with authority labels and blocked rows omitted from export."
        headerActions={
          <Link
            to={appendExportFixtureStateQuery(`/report/${property.id}`, searchParams.get('state'))}
            className="btn btn-secondary comps-desktop-handoff"
          >
            Preview report
          </Link>
        }
        visualPanel={mapPanel}
        evidenceRail={
          <>
            {evidenceRail}
            {gridPanel}
          </>
        }
        mobileCta={
          <Link
            to={appendExportFixtureStateQuery(`/report/${property.id}`, searchParams.get('state'))}
            className="btn btn-primary"
          >
            Preview report
          </Link>
        }
      />

      <PublicTrustStrip labels={['Mock-only', 'Not an appraisal']} className="comps-trust-footer" />

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
    </section>
  );
}
