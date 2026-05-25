import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { MapLayerControlPanel } from '@/components/spatial/MapLayerControlPanel';
import { MapPlaceholderPreview } from '@/components/spatial/MapPlaceholderPreview';
import { EvidenceMetadataList } from '@/components/evidence/EvidenceMetadataList';
import { PublicStudioContinuityBanner } from '@/components/evidence/PublicStudioContinuity';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { usePrototypeAction } from '@/lib/prototype/usePrototypeAction';
import { studioDealPath } from '@/data/studio';
import { getPublicPropertyView } from '@/lib/runtime/public-property';
import { getLinkedDealId } from '@/lib/workflow-identity';
import { trackEvent } from '@/lib/analytics/collector';

export function PropertyPage(): ReactElement {
  const { id } = useParams();
  const propertyView = getPublicPropertyView(id);
  const property = propertyView?.property;
  const linkedDealId = getLinkedDealId(id);
  const notifyPrototype = usePrototypeAction();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openEvidenceDrawer() {
    notifyPrototype('Public evidence drawer');
    trackEvent({
      name: 'evidence_drawer_opened',
      actorClass: 'anonymous',
      route: `/property/${property?.id ?? 'unknown'}`,
      propertyId: property?.id,
      authorityLabel: propertyView?.evidenceDrawer[0]?.authorityLabel,
    });
    setDrawerOpen(true);
  }

  if (!property) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Route guard</p>
          <h1>Property not found</h1>
          <p className="lede">
            The requested sample property does not exist in the prototype dataset.
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
        <p className="eyebrow">Property intelligence · {property.id}</p>
        <h1>{property.address}</h1>
        <p>
          {property.market} · {property.assetType}
        </p>
      </header>

      <PublicStudioContinuityBanner linkedDealId={linkedDealId} surface="property" />

      <div className="split-layout">
        <div className="card">
          <div className="field-row">
            <span>Cap rate</span>
            <strong>{propertyView?.evidenceDrawer[0]?.value ?? property.capRate}</strong>
            <AuthorityBadge label={property.authority} />
          </div>
          <div className="field-row">
            <span>Source</span>
            <strong>Public records aggregate</strong>
            <AuthorityBadge label="public-baseline" />
          </div>
          <button type="button" className="btn btn-secondary" onClick={openEvidenceDrawer}>
            View evidence drawer
          </button>
        </div>

        <div className="card">
          <MapPlaceholderPreview caption="Sample map layer — no live geo precision. Not a legal boundary.">
          <p className="muted">Selected property context preserved when drawer opens.</p>
          <div className="provenance-labels" aria-label="Map truth labels">
            <AuthorityBadge label="sample-map-data" />
            <AuthorityBadge label="approximate-centroid" />
            <AuthorityBadge label="not-legal-boundary" />
          </div>
          <ul className="map-layer-list" aria-label="Visible map layer summary">
            {propertyView?.spatialContext.layers.map((layer) => (
              <li key={layer.id}>
                <strong>{layer.label}</strong>
                <span>
                  {layer.precisionLabel} · {layer.refreshedLabel}
                </span>
                <small>{layer.safeCaveat}</small>
              </li>
            ))}
          </ul>
        </MapPlaceholderPreview>
        </div>
      </div>

      <MapLayerControlPanel
        layers={propertyView?.spatialContext.layers ?? []}
        evidenceByLayer={propertyView?.spatialContext.evidenceByLayer ?? {}}
        heading="Map layer controls"
      />

      <section className="card" aria-labelledby="map-fallback-heading">
        <h2 id="map-fallback-heading">Map facts as list</h2>
        <p className="muted">
          Non-map fallback for the same sample spatial facts shown in the regional map.
        </p>
        <ul className="evidence-list">
          {propertyView?.spatialContext.evidence.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.value} — {item.safeExplanation}
            </li>
          ))}
        </ul>
      </section>

      <div className="action-row">
        <Link to={`/property/${property.id}/comps`} className="btn btn-primary">
          Compare comps
        </Link>
        <Link to={`/report/${property.id}`} className="btn btn-secondary">
          Preview report
        </Link>
        {linkedDealId ? (
          <>
            <Link to={studioDealPath(linkedDealId)} className="btn btn-secondary">
              Open linked Studio deal
            </Link>
            <Link to={studioDealPath(linkedDealId, 'spatial')} className="btn btn-secondary">
              Open spatial workbench
            </Link>
          </>
        ) : null}
      </div>

      <SophexSheet isOpen={drawerOpen} label="Evidence drawer" onClose={() => setDrawerOpen(false)}>
        <p>Public baseline fields only in this prototype.</p>
        <EvidenceMetadataList
          heading="Field evidence"
          items={[...(propertyView?.evidenceDrawer ?? []), ...(propertyView?.spatialContext.evidence ?? [])]}
        />
        <p className="muted">Private contributor observations are not shown on public routes.</p>
      </SophexSheet>
    </section>
  );
}
