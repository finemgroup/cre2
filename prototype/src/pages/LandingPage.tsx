import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { mockProperties } from '@/data/mock';

export function LandingPage(): ReactElement {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const results = searched
    ? mockProperties.filter((p) =>
        `${p.address} ${p.market}`.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">CRE intelligence marketplace</p>
        <h1>Evidence-first property intelligence</h1>
        <p className="lede">
          Search public baseline properties, compare comps, and preview valuation reports with visible
          source and review state.
        </p>
      </header>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
      >
        <label htmlFor="search">Property or market</label>
        <div className="search-row">
          <input
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Austin retail, 1200 Commerce St"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {searched ? (
        <div className="card-grid">
          {results.length === 0 ? (
            <p>No sample matches. Try &quot;Austin&quot; or &quot;Commerce&quot;.</p>
          ) : (
            results.map((property, index) => (
              <SophexMotionSurface
                key={property.id}
                motionName="stageItem"
                className="card"
                style={{ transitionDelay: `${index * 0.04}s` }}
              >
                <h2>{property.address}</h2>
                <p>{property.market} · {property.assetType}</p>
                <p className="metric">Cap rate {property.capRate}</p>
                <Link to={`/property/${property.id}`} className="btn btn-secondary">
                  View property
                </Link>
              </SophexMotionSurface>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
