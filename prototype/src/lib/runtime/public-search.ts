import { mockProperties } from '@/data/mock';

export function getPublicSearchProperties(query?: string) {
  if (!query) return mockProperties;
  return mockProperties.filter((property) =>
    `${property.address} ${property.market} ${property.assetType}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );
}
