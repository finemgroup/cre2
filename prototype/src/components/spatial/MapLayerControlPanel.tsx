import { useEffect, useId, useState, type ReactElement } from 'react';
import { AnimatePresence } from 'framer-motion';

import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import type { PublicMapLayerProjection } from '@/lib/contracts/spatial';
import {
  geometryLoadDelayMs,
  geometryStateLabel,
  resolveInitialGeometryState,
  shouldLoadGeometryOnSelection,
  shouldLoadGeometryOnVisibility,
  type LayerGeometryState,
} from '@/lib/gis/layer-load-state';
import { useReducedMotionPreference } from '@/lib/motion';

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

function buildInitialGeometryStates(
  layers: PublicMapLayerProjection[]
): Record<string, LayerGeometryState> {
  return Object.fromEntries(layers.map((layer) => [layer.id, resolveInitialGeometryState(layer)]));
}

export function MapLayerControlPanel({
  layers,
  evidenceByLayer = {},
  heading = 'Map layers',
}: MapLayerControlPanelProps): ReactElement {
  const groupId = useId();
  const reducedMotion = useReducedMotionPreference();
  const [visibleLayerIds, setVisibleLayerIds] = useState<string[]>(() =>
    layers.map((layer) => layer.id)
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    layers[0]?.id ?? null
  );
  const [geometryStates, setGeometryStates] = useState<Record<string, LayerGeometryState>>(() =>
    buildInitialGeometryStates(layers)
  );

  useEffect(() => {
    setGeometryStates(buildInitialGeometryStates(layers));
    setVisibleLayerIds(layers.map((layer) => layer.id));
    setSelectedLayerId(layers[0]?.id ?? null);
  }, [layers]);

  function queueGeometryLoad(layer: PublicMapLayerProjection) {
    const current = geometryStates[layer.id] ?? resolveInitialGeometryState(layer);
    if (current === 'loaded' || current === 'loading' || current === 'deferred') return;

    setGeometryStates((states) => ({ ...states, [layer.id]: 'loading' }));
    window.setTimeout(() => {
      setGeometryStates((states) => ({ ...states, [layer.id]: 'loaded' }));
    }, geometryLoadDelayMs(reducedMotion));
  }

  function toggleLayer(layerId: string) {
    const layer = layers.find((entry) => entry.id === layerId);
    const willHide = visibleLayerIds.includes(layerId);
    setVisibleLayerIds((current) =>
      willHide ? current.filter((id) => id !== layerId) : [...current, layerId]
    );
    if (layer && !willHide && shouldLoadGeometryOnVisibility(layer)) {
      queueGeometryLoad(layer);
    }
  }

  function selectLayer(layerId: string) {
    setSelectedLayerId(layerId);
    const layer = layers.find((entry) => entry.id === layerId);
    if (layer && shouldLoadGeometryOnSelection(layer)) {
      queueGeometryLoad(layer);
    }
  }

  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);
  const selectedEvidence = selectedLayerId ? evidenceByLayer[selectedLayerId] ?? [] : [];
  const selectedGeometryState = selectedLayer
    ? geometryStates[selectedLayer.id] ?? resolveInitialGeometryState(selectedLayer)
    : null;

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
            const geometryState = geometryStates[layer.id] ?? resolveInitialGeometryState(layer);
            return (
              <li key={layer.id}>
                <div className="map-layer-toggle-row">
                  <button
                    type="button"
                    className="btn btn-ghost map-layer-select"
                    aria-pressed={selected}
                    onClick={() => selectLayer(layer.id)}
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
                <p className="muted" role="status">
                  {geometryStateLabel(geometryState)}
                </p>
                <small>{layer.safeCaveat}</small>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {selectedLayer ? (
        <AnimatePresence mode="sync" initial={false}>
          <SophexMotionSurface
            key={selectedLayer.id}
            motionName="mapSelection"
            className="map-layer-detail map-hud-detail"
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
            {selectedGeometryState ? (
              <p className="muted" role="status">
                {geometryStateLabel(selectedGeometryState)}
              </p>
            ) : null}
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
          </SophexMotionSurface>
        </AnimatePresence>
      ) : null}
    </section>
  );
}
