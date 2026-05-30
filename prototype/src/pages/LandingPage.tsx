import { useState, type ReactElement } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { EmptyStateCard } from '@/components/overlays/EmptyStateCard';
import { RuntimeResourceStatus } from '@/components/runtime/RuntimeResourceStatus';
import { PublicTrustStrip } from '@/components/public/PublicTrustStrip';
import { SophexMotionSurface } from '@/components/motion/SophexMotionSurface';
import { getPublicSearchProperties } from '@/lib/runtime/public-search';
import { getPublicLandingView } from '@/lib/runtime/public-landing';
import { runtimeServices } from '@/lib/runtime/runtime-services';
import { useRuntimeResource } from '@/lib/runtime/useRuntimeResource';

export function LandingPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(Boolean(initialQuery));

  const landingState = useRuntimeResource(
    () => runtimeServices.public.getLandingView(),
    'landing-guide',
    getPublicLandingView()
  );
  const landingView = landingState.value;
  const featuredState = useRuntimeResource(
    () => runtimeServices.public.getLandingView().then((view) => view.featuredProperties),
    'landing-featured',
    getPublicLandingView().featuredProperties
  );
  const searchState = useRuntimeResource(
    () => (searched ? runtimeServices.public.searchProperties(query) : Promise.resolve([])),
    `landing-search-${searched}-${query}`,
    searched ? getPublicSearchProperties(query) : []
  );
  const featuredProperties = featuredState.value;
  const results = searchState.value;
  const sampleQueries = landingView?.sampleQueries ?? [];

  function runSearch(nextQuery = query) {
    setQuery(nextQuery);
    setSearched(true);
  }

  return (
    <section className="page explore-page">
      <header className="explore-hero">
        <p className="eyebrow">Public intelligence</p>
        <h1>Discover Institutional Intelligence</h1>
        <p className="lede">
          Search public baseline properties, compare comps, and preview valuation reports with
          visible source and review state.
        </p>
        <form
          className="explore-search-form"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch();
          }}
        >
          <label htmlFor="explore-search" className="sr-only">
            Property or market
          </label>
          <input
            id="explore-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Austin retail, 1200 Commerce St, market name..."
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <PublicTrustStrip
          labels={[
            'Advisory / model-inferred',
            'Not an appraisal',
            'Public baseline',
            'Export gated',
          ]}
        />
      </header>

      <RuntimeResourceStatus
        loading={landingState.loading || featuredState.loading || searchState.loading}
        error={searchState.error ?? featuredState.error ?? landingState.error}
        variant="public"
      />

      {!searched ? (
        <>
          <div className="explore-bento" aria-label="Market intelligence">
            <article className="explore-bento__card explore-bento__card--map">
              <p className="micro-label">Market map</p>
              <h2>Featured markets</h2>
              <p className="fin-value">{landingView?.marketCount ?? '—'}</p>
              <p className="muted">Sample coverage only — no live provider feed.</p>
            </article>
            <article className="explore-bento__card">
              <p className="micro-label">Trust tiers</p>
              <h2>Labeled authority</h2>
              <p>{landingView?.trustTierLabels ?? 'Public baseline · Reviewed · Restricted'}</p>
            </article>
            <article className="explore-bento__card">
              <p className="micro-label">Listings</p>
              <h2>Sample properties</h2>
              <p className="fin-value">{landingView?.totalListings ?? '—'}</p>
            </article>
          </div>
          <EmptyStateCard
            icon="travel_explore"
            title="Start with a market or address"
            description="Sample properties are available for Austin and nearby markets. Try a suggested query or browse featured listings."
            actions={
              <>
                <div className="chip-row">
                  {sampleQueries.map((sample) => (
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
        </>
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

      <section id="source-trust" className="card" aria-labelledby="source-trust-heading">
        <h2 id="source-trust-heading">Source trust tiers</h2>
        <p className="muted">
          Every property card, comp, and report preview shows how far evidence has progressed from
          candidate extraction to reviewed output.
        </p>
        <ul className="trust-explainer-list">
          {[
            ['Public baseline', 'Sample listings safe for marketplace discovery and search.'],
            ['Reviewed output', 'Fields promoted after analyst review with visible provenance.'],
            [
              'Restricted / premium',
              'Provider-gated comps and exports stay labeled, never implied as public.',
            ],
          ].map(([title, copy]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
