# SEO And Indexing Gate Plan

This plan defines when Sophex public pages may be indexed.
It does not authorize production indexing, sitemap publishing, syndication, schema work, or deploys.

## Indexing Eligibility

Public indexing is allowed only for pages whose rendered HTML, metadata, JSON-LD, sitemap entries, and backing API responses contain:

- Public baseline data.
- Operator-approved aggregates.
- Reviewed public projections with source-use permission.
- No private source-owner identity.
- No raw document text or uploaded file names.
- No provider-restricted comp values.

## Route Readiness

| Route family | Initial indexing stance | Required gate |
| --- | --- | --- |
| `/` search landing | Eligible after terms/privacy review. | Public copy and analytics redaction. |
| `/property/:id` | Blocked until public baseline source rights are approved. | Public-data provider contract and permission tests. |
| `/property/:id/comps` | Blocked. | Comp source-rights and provider restrictions. |
| `/report/:id` | Blocked. | Report source filtering and export policy. |
| `/export/:id` | Never indexed. | `noindex`. |
| `/upload` | Never indexed as contributed data source. | `noindex`. |
| `/studio/*` | Never indexed. | Auth/private workspace boundary. |

## Removal And Revocation

- Revoked public projection must be removed from rendered HTML and metadata.
- Sitemap entries must be regenerated after revocation.
- Cached/public pages need a takedown path.
- Disputed values should show correction state or be removed until resolved.

## Acceptance Tests For Runtime

- Public HTML contains no private sentinel values.
- JSON-LD excludes user-contributed facts unless public-use terms and review allow.
- `robots.txt` and sitemap exclude upload/export/studio routes.
- Revoked evidence cannot remain in sitemap payloads.
