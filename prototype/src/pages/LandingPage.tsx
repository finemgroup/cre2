import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { getPublicSearchProperties } from '@/lib/runtime/public-search';

const SAMPLE_QUERIES = ['Austin', 'Commerce', 'Research Blvd', 'Retail'];

export function LandingPage(): ReactElement {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const featuredProperties = getPublicSearchProperties().slice(0, 2);
  const results = searched ? getPublicSearchProperties(query) : [];

  function runSearch(nextQuery = query) {
    setQuery(nextQuery);
    setSearched(true);
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">CRE intelligence marketplace</p>
        <h1>Evidence-first property intelligence</h1>
        <p className="lede">
          Search public baseline properties, compare comps, and preview valuation reports with
          visible source and review state.
        </p>
      </header>

      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
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

      {!searched ? (
        <EmptyStateCard
          icon="travel_explore"
          title="Start with a market or address"
          description="Sample properties are available for Austin and nearby markets. Try a suggested query or browse featured listings."
          actions={
            <>
              <div className="chip-row">
                {SAMPLE_QUERIES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => runSearch(sample)}
                  >
                    {sample}
                  </button>
                ))}
              </div>
              <div className="card-grid featured-grid">
                {featuredProperties.map((property) => (
                  <article key={property.id} className="card">
                    <h2>{property.address}</h2>
                    <p>
                      {property.market} · {property.assetType}
                    </p>
                    <Link to={`/property/${property.id}`} className="btn btn-secondary">
                      View featured property
                    </Link>
                  </article>
                ))}
              </div>
            </>
          }
        />
      ) : null}

      {searched ? (
        <div className="card-grid">
          {results.length === 0 ? (
            <EmptyStateCard
              icon="search_off"
              title="No sample matches"
              description={`Nothing in the prototype matched "${query}". Try Austin, Commerce, or Research.`}
              tone="warning"
              actions={
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => runSearch('Austin')}
                >
                  Search Austin
                </button>
              }
            />
          ) : (
            results.map((property, index) => (
              <SophexMotionSurface
                key={property.id}
                motionName="stageItem"
                className="card"
                staggerIndex={index}
              >
                <h2>{property.address}</h2>
                <p>
                  {property.market} · {property.assetType}
                </p>
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
