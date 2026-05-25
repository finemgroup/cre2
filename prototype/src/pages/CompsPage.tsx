import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { getPublicCompContextView } from '@/lib/runtime/public-comps';
import { getPropertyRecord } from '@/lib/workflow-identity';

export function CompsPage(): ReactElement {
  const { id } = useParams();
  const property = getPropertyRecord(id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const compContext = getPublicCompContextView(undefined, property?.id);
  const compViews = compContext.comps;
  const selected = compViews.find((comp) => comp.id === selectedId);

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
            {compViews.map((comp) => (
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
                    aria-describedby={
                      !comp.canInspect ? `${comp.id}-blocked-reason` : undefined
                    }
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
        <Link to={`/report/${property.id}`} className="btn btn-primary">
          Preview report for {property.address}
        </Link>
      </div>
    </section>
  );
}
