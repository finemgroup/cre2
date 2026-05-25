# Spatial Source Rights Decision Packet

This packet defines the approval questions and recommended MVP posture for spatial data in Sophex.
It is a **decision packet only**. It does not authorize providers, real GIS assets, schema, ingestion, caching, KML/GeoJSON reuse, provider keys, or map runtime services.

## Recommended MVP Stance

| Surface | Default stance |
| --- | --- |
| Public property maps | Mock/sample only until provider rights are approved. |
| Comp maps | Mock/sample radius and aggregate labels only. |
| Trade-area reports | Prototype labels only; no real drive-time or polygon claims. |
| Demographics/traffic/zoning | Sample or aggregate copy only; no provider-specific claims. |
| User-uploaded regions | Candidate spatial evidence; private by default and HITL-gated. |
| Export/share/indexing | Block or redact spatial sections unless source rights explicitly allow the requested use. |

## Required Approval Questions

- Which spatial providers are approved for public display, private reports, export/share, and indexable pages?
- What retention and cache limits apply to coordinates, polygons, and derived metrics?
- May provider-derived layers appear in white-label reports?
- May provider-derived layers be included in downloadable or partner-delivered artifacts?
- What source labels, as-of dates, and precision labels are contractually required?
- Which spatial observations require human review before affecting comps, valuation, export, or public pages?
- How are revoked or superseded spatial sources removed from future reports while preserving audit history?

## Required Labels

- `Sample map data`
- `Approximate centroid`
- `Parcel-level source`
- `Provider refreshed`
- `User supplied`
- `Review pending`
- `Private layer`
- `Aggregate only`
- `Not legal boundary`

## Launch Gate

Real spatial layers cannot launch until provider/source-rights approval covers:

- Public display.
- Private authenticated display.
- Report generation.
- Export/download/share.
- White-label delivery.
- Indexable public pages.
- Retention/cache/revocation.

Until then, Sophex maps remain mock/sample context with explicit precision and non-legal-boundary labels.
