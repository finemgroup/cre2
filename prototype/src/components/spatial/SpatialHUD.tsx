import { useState, type ReactElement, type ReactNode } from 'react';

type SpatialLayerGroup = {
  id: string;
  label: string;
  layers: readonly {
    id: string;
    label: string;
    precisionLabel?: string;
    refreshedLabel?: string;
    safeCaveat?: string;
  }[];
};

type SpatialFact = {
  label: string;
  value: string;
  sourceLabel?: string;
  asOfLabel?: string;
};

type SpatialHUDProps = {
  title: string;
  subtitle?: string;
  layerGroups: readonly SpatialLayerGroup[];
  facts?: readonly SpatialFact[];
  radiusChips?: readonly string[];
  actions?: ReactNode;
  defaultExpanded?: boolean;
};

export function SpatialHUD({
  title,
  subtitle,
  layerGroups,
  facts = [],
  radiusChips = [],
  actions,
  defaultExpanded = true,
}: SpatialHUDProps): ReactElement {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="spatial-hud" aria-label={title}>
      <header className="spatial-hud__header">
        <div>
          <p className="micro-label">Spatial context</p>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          className="btn btn-ghost spatial-hud__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </header>
      {expanded ? (
        <div className="spatial-hud__body sophex-reveal">
          {radiusChips.length ? (
            <div className="spatial-hud__chips" aria-label="Radius and source chips">
              {radiusChips.map((chip) => (
                <span key={chip} className="trust-chip">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          {layerGroups.map((group) => (
            <div key={group.id} className="spatial-hud__group">
              <h3>{group.label}</h3>
              <ul className="map-layer-list">
                {group.layers.map((layer) => (
                  <li key={layer.id}>
                    <strong>{layer.label}</strong>
                    {layer.precisionLabel || layer.refreshedLabel ? (
                      <span>
                        {layer.precisionLabel}
                        {layer.precisionLabel && layer.refreshedLabel ? ' · ' : ''}
                        {layer.refreshedLabel}
                      </span>
                    ) : null}
                    {layer.safeCaveat ? <small>{layer.safeCaveat}</small> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {facts.length ? (
            <ul className="spatial-hud__facts" aria-label="Spatial facts with provenance">
              {facts.map((fact) => (
                <li key={fact.label}>
                  <strong>{fact.label}</strong>
                  <span className="fin-value">{fact.value}</span>
                  {fact.sourceLabel ? <small>{fact.sourceLabel}</small> : null}
                  {fact.asOfLabel ? <small>{fact.asOfLabel}</small> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {actions ? <div className="spatial-hud__actions">{actions}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
