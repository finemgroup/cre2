import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { mockProperties } from '@/data/mock';

export function PropertyPage(): ReactElement {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id) ?? mockProperties[0];
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Property intelligence</p>
        <h1>{property.address}</h1>
        <p>{property.market} · {property.assetType}</p>
      </header>

      <div className="split-layout">
        <div className="card">
          <div className="field-row">
            <span>Cap rate</span>
            <strong>{property.capRate}</strong>
            <AuthorityBadge label={property.authority} />
          </div>
          <div className="field-row">
            <span>Source</span>
            <strong>Public records aggregate</strong>
            <AuthorityBadge label="public-baseline" />
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => setDrawerOpen(true)}>
            View evidence drawer
          </button>
        </div>

        <aside className="card map-placeholder" aria-label="Map preview">
          <p className="eyebrow">Regional map</p>
          <p>Sample map layer — no live geo precision.</p>
          <p className="muted">Selected property context preserved when drawer opens.</p>
        </aside>
      </div>

      <div className="action-row">
        <Link to="/comps" className="btn btn-primary">
          Compare comps
        </Link>
        <Link to={`/report/${property.id}`} className="btn btn-secondary">
          Preview report
        </Link>
      </div>

      <SophexSheet
        isOpen={drawerOpen}
        label="Evidence drawer"
        onClose={() => setDrawerOpen(false)}
      >
        <p>Public baseline fields only in this prototype.</p>
        <ul className="evidence-list">
          <li>County assessor record — 2024 tax year</li>
          <li>Sample market aggregate — anonymized</li>
        </ul>
        <p className="muted">Private contributor observations are not shown on public routes.</p>
      </SophexSheet>
    </section>
  );
}
