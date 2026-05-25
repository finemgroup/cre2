import { useId, useState, type ReactElement } from 'react';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import type { PublicMapLayerProjection } from '@/lib/contracts/spatial';

export type MapLayerDetailItem = {
  label: string;
  value: string;
  safeExplanation: string;
};

export type MapLayerControlPanelProps = {
  layers: PublicMapLayerProjection[];
  evidenceByLayer?: Record<string, MapLayerDetailItem[]>;
  heading?: string;
};

export function MapLayerControlPanel({
  layers,
  evidenceByLayer = {},
  heading = 'Map layers',
}: MapLayerControlPanelProps): ReactElement {
  const groupId = useId();
  const [visibleLayerIds, setVisibleLayerIds] = useState<string[]>(() =>
    layers.map((layer) => layer.id)
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    layers[0]?.id ?? null
  );

  function toggleLayer(layerId: string) {
    setVisibleLayerIds((current) =>
      current.includes(layerId)
        ? current.filter((id) => id !== layerId)
        : [...current, layerId]
    );
  }

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
  const selectedEvidence = selectedLayerId ? evidenceByLayer[selectedLayerId] ?? [] : [];

  return (
    <section className="map-layer-controls" aria-labelledby={groupId}>
      <h2 id={groupId}>{heading}</h2>
      <p className="muted">
        Toggle sample layers and inspect spatial facts without relying on map interaction.
      </p>
      <fieldset className="map-layer-fieldset">
        <legend className="sr-only">Map layer visibility and selection</legend>
        <ul className="map-layer-toggle-list">
          {layers.map((layer) => {
            const visible = visibleLayerIds.includes(layer.id);
            const selected = selectedLayerId === layer.id;
            return (
              <li key={layer.id}>
                <div className="map-layer-toggle-row">
                  <button
                    type="button"
                    className="btn btn-ghost map-layer-select"
                    aria-pressed={selected}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    {layer.label}
                  </button>
                  <label className="map-layer-visibility">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={() => toggleLayer(layer.id)}
                    />
                    <span>{visible ? 'Visible' : 'Hidden'}</span>
                  </label>
                </div>
                <p className="muted map-layer-meta">
                  {layer.precisionLabel} · {layer.refreshedLabel} · {layer.lazyLoadPolicy}
                </p>
                <small>{layer.safeCaveat}</small>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {selectedLayer ? (
        <div
          className="map-layer-detail"
          role="region"
          aria-label={`Selected layer details for ${selectedLayer.label}`}
          tabIndex={-1}
        >
          <h3>{selectedLayer.label}</h3>
          <div className="provenance-labels" aria-label="Selected layer provenance">
            <AuthorityBadge label="sample-map-data" />
            <AuthorityBadge label="approximate-centroid" />
            <AuthorityBadge label="not-legal-boundary" />
          </div>
          <p>{selectedLayer.safeCaveat}</p>
          {selectedEvidence.length > 0 ? (
            <ul className="evidence-list">
              {selectedEvidence.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.value} — {item.safeExplanation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No additional spatial evidence is visible for this layer.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
