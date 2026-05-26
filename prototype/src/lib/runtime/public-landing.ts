import { getPublicSearchProperties } from '@/lib/runtime/public-search';

export const PUBLIC_LANDING_SAMPLE_QUERIES = [
  'Austin',
  'Commerce',
  'Research Blvd',
  'Retail',
] as const;

export function getPublicLandingView() {
  const properties = getPublicSearchProperties();
  const markets = new Set(properties.map((property) => property.market));
  return {
    featuredProperties: properties.slice(0, 2),
    totalListings: properties.length,
    marketCount: markets.size,
    sampleQueries: [...PUBLIC_LANDING_SAMPLE_QUERIES],
    trustTierLabels: 4,
  };
}

export type PublicLandingView = ReturnType<typeof getPublicLandingView>;
