# Security, Privacy, And Launch Gates

This document defines the minimum gates before Sophex may move from prototype to runtime, marketplace, indexing, exports, analytics, or outbound operations.
It does not authorize production services, provider sends, queues, schema work, migrations, or deploys.

## Gate Summary

| Gate | Required before | Status |
| --- | --- | --- |
| Contribution terms | Capturing real uploads or user-contributed facts. | Not ready |
| Query-layer permissions | Any private/org/source-owner data read. | Not ready |
| File safety controls | Real document upload or storage. | Not ready |
| Evidence review workflow | Candidate extraction affects reports/comps/projections. | Not ready |
| Export/share receipts | Download, share, partner delivery, or PDF generation. | Not ready |
| Spatial source rights | Real GIS layers, trade-area claims, map export/share, or indexable map facts. | Not ready |
| Indexing policy | Public SEO pages using property/report data. | Not ready |
| Analytics redaction | Production telemetry or conversion analytics. | Not ready |
| Outbound consent stack | Email, CRM, partner notifications, retargeting, syndication. | Blocked |
| Dependency/security scanning | Production CI/CD. | Not ready |
| Incident response | Production launch. | Not ready |

## Threat Model

Highest-risk failures:

- Private comp or uploaded document facts appear on public property pages.
- User-private or org-private observations are indexed by search engines.
- Provider-restricted comps leak into exports or public reports.
- Provider-restricted or unlicensed spatial layers leak into maps, reports, exports, or indexed pages.
- OCR/chunk output is treated as authoritative.
- UI-only gating is mistaken for permission enforcement.
- Export/download/share actions lack idempotent receipts.
- Raw logs, queue ids, stack traces, secrets, or PII appear in public progress views.
- Analytics payloads include document content, private values, source owner identity, or raw PII.
- Engagement scoring triggers outbound before consent/suppression/unsubscribe are proven.
- Sister-project internal roles or data models are exposed to external users.

## Contribution Terms Gate

Before real uploads or user-contributed facts:

- Terms state whether contributions remain private, shared, anonymized, aggregated, public, or internally usable.
- Source-owner rights are defined: attribution, revocation, deletion requests, visibility, marketplace participation.
- Free valuation/reporting exchange clearly states what is received and what may be reused.
- Users see terms before upload, not after extraction.
- Terms version is stored with each governed upload/action.

Decision packet: see `CONTRIBUTION_TERMS_DECISION_PACKET.md`.

## Permission Enforcement Gate

Before private data exists:

- Every sensitive query receives an actor context.
- Public requests default to public baseline only.
- Server-side policy filters search, field values, evidence drawers, chunks, comps, valuation inputs, reports, exports, global search, and partner APIs.
- Tests cover anonymous, source owner, org member, paid user, internal operator, and partner/API consumer.
- Denied data returns safe explanations without confirming hidden values.

## File And Document Safety Gate

Before real document upload:

- File type allowlist.
- Size limits.
- Malware scanning plan.
- Storage location and retention policy.
- Hash/digest identity.
- PII/private payload handling.
- OCR/extraction sidecar isolation.
- Revocation/supersession behavior.
- No public URL or unauthenticated byte access for private files.

Detailed plan: see `FILE_SAFETY_AND_RETENTION_PLAN.md`.

## Evidence Review Gate

Before extraction affects product output:

- Candidate evidence review queue exists.
- Confidence and source family are visible to reviewers.
- Promotion requires a reviewer/policy decision.
- Rejection and supersession remain auditable.
- Public projection promotion is separate from private report use.
- Queue/job completion cannot promote evidence by itself.

Review policy: see `REVIEW_AUTHORITY_AND_HITL_POLICY.md`.

## Spatial Source Rights Gate

Before real GIS layers, trade areas, traffic, zoning, demographic, parcel, or drive-time data:

- Provider/source rights are approved for public display, private reports, export/share, and indexing.
- Precision labels are required for approximate centroids, parcels, inferred regions, and custom polygons.
- Spatial observations have review state and revocation/supersession behavior.
- Real KML/GeoJSON assets, local links, provider keys, and SharePoint links are excluded unless explicitly approved.
- Public maps include non-map fallback lists and do not imply legal boundary, title, survey, zoning entitlement, or live traffic certainty.

Decision packet: see `SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md`.

## Export, Download, And Share Gate

Before real exports/shares:

- Consent copy/version captured.
- Section approval checked.
- Source-rights filters applied.
- Private/provider-restricted citations redacted or blocked.
- Idempotency key required.
- Receipt generated.
- Share/download audit includes actor, artifact, visibility, policy result, and timestamp.
- Replays return existing receipt or fail closed.

## SEO And Indexing Gate

Before indexing public pages:

- Pages use public baseline or operator-approved aggregates only.
- User-contributed facts are excluded unless reviewed and public-use terms allow.
- Private source names and values are never present in HTML, metadata, JSON-LD, sitemap payloads, or crawled API responses.
- Robots/sitemap policy is reviewed.
- Removal/revocation process exists.

Indexing plan: see `SEO_INDEXING_GATE_PLAN.md`.

## Analytics Gate

Before production analytics:

- Event taxonomy is documented.
- Raw PII, document content, private comp values, source owner identity, and raw evidence payloads are forbidden.
- Upload/export events use receipt ids or redacted phase labels.
- Engagement scoring cannot trigger outbound.
- Analytics sink access is role-limited.

## Outbound Automation Gate

Outbound remains blocked until all are proven:

- Consent capture.
- Suppression and unsubscribe.
- Idempotency.
- Audit trail.
- Operator approval.
- Provider reliability and retry policy.
- Redacted payload policy.

This blocks email nurture, CRM sync, partner notifications, retargeting, paid ads, and syndication using contributed intelligence.

## CI/CD Security Gate

Before production deployment:

- Dependency audit.
- Secret scanning.
- Static analysis.
- License review.
- Bundle budgets.
- CSP/security headers.
- Preview deploy smoke tests.
- Browser/device matrix.
- Manual keyboard and screen-reader pass.
- Error reporting and SLO dashboards.

## Incident Response Gate

Before launch:

- Security contact and escalation path.
- Privacy request handling.
- Evidence revocation process.
- Provider-rights incident process.
- Public correction/dispute process.
- Export/share takedown process.
- Audit log preservation policy.

Runbooks: see `INCIDENT_RESPONSE_AND_PRIVACY_RUNBOOKS.md`.

## Launch Rule

If any gate is not ready, the corresponding capability stays prototype-only, sandbox-only, or blocked.
