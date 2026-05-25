# ICSC Map Recovery To Sophex Harvest Packet Provisional

This packet records mapping and GIS concepts harvested from `C:\Projects\ICSC Map Recovery`.
It is **provisional** because the source was inspected as an external local project for product/UX patterns, not as an authoritative clean dependency.
It does not authorize copying code, KML/GeoJSON assets, SharePoint links, environment variables, schema, SQL, provider credentials, or runtime map services into Sophex.

## Source Posture

| Signal | Finding |
| --- | --- |
| Source path | `C:\Projects\ICSC Map Recovery` |
| Trust level | Provisional mapping/GIS product harvest. |
| Use in Sophex | Map UX doctrine, source-rights questions, future GIS contract tickets, performance/a11y checklists. |
| Do not use for | Runtime imports, KML/asset reuse, DB schema, provider keys, SharePoint asset links, Prisma/SQL, legacy HTML copy. |

## Why This Matters To Sophex

Sophex needs property maps, comp radii, trade-area context, public baseline geography, and future spatial search.
The ICSC project offers useful map-product patterns, but Sophex must treat GIS layers as evidence-bearing projections rather than decorative map overlays.

Core adoption rule:

`map layer -> source/provenance -> permission -> freshness -> precision label -> evidence drawer/report use`

## High-Value Mapping Concepts

### Layer-Control HUD

ICSC-style map controls can help Sophex expose multiple spatial contexts without overwhelming users:

- Properties.
- Comps.
- Trade areas.
- Traffic/drive-time.
- Demographics.
- Zoning or parcel context.
- User uploaded regions.

Sophex adaptation:

- Every layer needs a source label, as-of date, precision label, and visibility class.
- Disabled layers should explain why: missing provider, private entitlement, review pending, or unsupported mock data.
- Public prototype maps should clearly label mock/sample precision.

### Lazy Layer Loading

Large spatial assets should load on demand:

- Do not hydrate every KML/polygon layer on first route load.
- Load layers when toggled, zoomed into, or selected.
- Cache layer metadata separately from geometry payloads.
- Keep heavy polygon sources out of the public bundle.

Sophex adaptation:

- MVP0 should use small mock geometries only.
- Future runtime should define a `MapLayerManifestContract` before real GIS ingestion.
- Public maps need bundle/performance budgets for layer payloads.

### Spatial Provenance

Map-derived claims need explicit provenance:

- Source provider or file.
- Coordinate system / projection assumptions.
- Last refreshed date.
- Geocode confidence.
- Human-verified status.
- Precision class: exact parcel, approximate centroid, inferred region, sample/mock.

Sophex adaptation:

- Coordinate and boundary claims should be evidence fields, not untraceable UI state.
- Any valuation/report claim that depends on a map layer must cite the layer source and precision.
- Public property pages must not imply title, legal boundary, zoning entitlement, or survey precision.

### Map Selection To Evidence Drawer

ICSC-style selection flows support a useful Sophex pattern:

- Click a property, comp, or region.
- Highlight selection.
- Open a side drawer with layer source, facts, confidence, and next actions.
- Keep map context visible while the drawer is open.

Sophex adaptation:

- The drawer is the trust surface.
- Private facts are redacted per actor context.
- "Add to report" and "compare" actions should route through governed visibility/export policy.

### Location Enrichment Pipeline

ICSC-style location enrichment points to future Sophex workflows:

- Geocode address.
- Verify coordinates.
- Attach parcel/trade-area layers.
- Compute radius/drive-time/market context.
- Label confidence and stale data.

Sophex adaptation:

- Geocoding is a candidate observation until reviewed or provider-verified.
- Enriched facts must preserve source family and terms.
- Derived metrics should know their dependency graph, for example "drive-time based on provider X and timestamp Y."

### Asset Audit Scripts

The mapping project reinforces the need for asset discipline:

- Inventory KML/GeoJSON/map assets.
- Detect missing/stale/oversized layers.
- Report source/license gaps.
- Track generated vs hand-authored assets.

Sophex adaptation:

- Add future scripts for map asset manifest validation only after real map assets are approved.
- For MVP0, keep a tiny mock manifest and document that it is non-production.

## Conceptual Contracts To Add Or Extend

| Contract | Purpose |
| --- | --- |
| `MapLayerManifestContract` | Metadata for each map layer: source, visibility, precision, freshness, payload size, lazy-load policy. |
| `SpatialEvidenceContract` | Evidence identity for geocode, parcel, radius, trade-area, zoning, traffic, and demographic claims. |
| `LocationVerificationContract` | Confidence and review state for coordinates/address matching. |
| `TradeAreaContract` | Radius/drive-time/market-region abstraction with source and method labels. |
| `MapSelectionContract` | Actor-specific selected feature projection with allowed actions and redacted details. |
| `LayerPerformanceBudgetContract` | Max initial payload and per-layer payload thresholds for public maps. |

## Map UX Truth Labels

Sophex map UI should label:

- `Sample map data`.
- `Approximate centroid`.
- `Parcel-level source`.
- `Provider refreshed`.
- `User supplied`.
- `Review pending`.
- `Private layer`.
- `Aggregate only`.
- `Not legal boundary`.

Maps should avoid copy that implies legal survey, title confirmation, zoning entitlement, environmental assurance, or live traffic certainty without provider/legal approval.

## Accessibility Requirements

Public maps need non-map alternatives:

- Search result list mirrors visible map properties.
- Selected feature details are available in a drawer/list, not only a pin.
- Layer toggles are keyboard reachable and have text labels.
- Map color scales include text labels and non-color indicators.
- Keyboard users can move from result list to selected feature detail without coordinate-only interactions.
- Screen-reader copy states when map data is sample, approximate, private, or unavailable.

## Performance Requirements

Future map work should define:

- Initial map route JS budget: stay within the prototype JS budget unless an approved map route budget is added.
- Initial layer metadata budget: target <= 24 KB per layer metadata payload.
- Per-layer geometry budget: target <= 96 KB per lazy-loaded mock/approved geometry payload.
- Lazy-load threshold: geometry loads only on toggle, selection, or zoom/context threshold.
- Maximum visible features before clustering/aggregation: document before real provider data ships.
- Offline/error fallback copy for failed layer fetches.

MVP0 should keep map assets static, tiny, and mock-labeled.

## Authoritative Rerun Checklist

Before this provisional map harvest can become authoritative:

1. Confirm the source path, branch/tag, commit hash, and upstream status.
2. Confirm the source tree is clean or record all dirty/untracked artifacts.
3. Inventory KML, GeoJSON, image, local-link, SharePoint-link, and provider-key references.
4. Exclude secrets, `.env`, local links, provider credentials, and external storage links from Sophex.
5. Review layer source rights, license posture, as-of dates, stale layers, and generated-vs-hand-authored assets.
6. Diff authoritative findings against this provisional packet.
7. Update topic docs once, then mark this packet superseded if an authoritative packet replaces it.

No real map assets, GIS provider calls, or spatial runtime adoption are authorized until that rerun and operator approval happen.

## Do Not Copy

| Source concept | Reason |
| --- | --- |
| KML/GeoJSON assets | Source rights and freshness unknown. |
| SharePoint or local asset links | External storage and permission leakage risk. |
| `.env`, provider keys, or API endpoints | Secrets/provider authorization not approved. |
| Prisma/SQL models | Sophex schema gate is closed. |
| Legacy HTML map shells | Does not match Sophex accessibility, evidence, or runtime architecture. |
| Hardcoded coordinates without provenance | Public trust and report evidence risk. |
| Unlabeled polygon layers | Legal/title/zoning overclaim risk. |

## Recommended Sophex Tickets

Expanded Composer-ready versions of these tickets live in [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md).

| Ticket | Scope |
| --- | --- |
| `SOPHEX-GIS-MANIFEST` | Define `MapLayerManifestContract` and mock layer fixtures. |
| `SOPHEX-GIS-PROVENANCE` | Add spatial provenance labels to public property and comp maps. |
| `SOPHEX-GIS-A11Y` | Add public map accessibility checklist and list/drawer fallback pattern. |
| `SOPHEX-GIS-PERFORMANCE` | Add map bundle/layer payload budgets for future routes. |
| `SOPHEX-GIS-VERIFICATION` | Define coordinate/geocode verification states and review flow. |
| `SOPHEX-GIS-TRADE-AREA` | Define trade-area abstraction for radius/drive-time/market context. |
| `SOPHEX-GIS-SOURCE-RIGHTS` | Create decision packet for spatial provider/source-rights policy. |
| `SOPHEX-GIS-HARVEST-REBASE` | Re-run mapping harvest against clean tagged source before runtime adoption. |

## Classification For Future Schema Gate

| Mapping concept | Sophex classification |
| --- | --- |
| Layer-control HUD | Reuse concept. |
| Lazy KML/polygon loading | Adapt through future manifest contract. |
| Spatial provenance labels | Reuse concept, expand for source-rights model. |
| Asset audit scripts | Adapt after real assets approved. |
| Coordinate verification | Reuse concept. |
| Trade area/radius abstractions | Adapt with provider/license labels. |
| KML/GeoJSON assets | Exclude until rights approved. |
| SharePoint/local asset links | Exclude. |
| Legacy map UI/runtime code | Exclude. |

## Sophex Adoption Rule

Mapping should be treated as permissioned evidence visualization, not decorative geography.
Every spatial claim must carry source, precision, freshness, permission, and safe-copy labels before it can influence a report, comp set, export, or public indexable page.
