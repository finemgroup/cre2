# Evidence And Observation Model

This is a conceptual model only. It does not define database schema, migrations, Prisma models, or runtime APIs.

## Concepts

- Property: the real-world asset or parcel being described.
- Field: a named property attribute such as acreage, owner, zoning, NOI, lease term, rent, cap rate, or sale price.
- Observation: a sourced claim about a field at a point in time.
- Source document: an uploaded or referenced PDF, lease, rent roll, deed, mortgage, contract, appraisal, listing, or trade record.
- Source extract: a structured value or text span extracted from a source document.
- Actor: the user, organization, operator, source owner, or partner responsible for an observation or allowed to view it.
- Visibility: the permission class attached to an observation, source, extract, or projection.
- Confidence: a measure of extraction, source, review, or reconciliation quality.
- Lineage: links from displayed value back to observation, extract, source document, actor, and timestamp.
- Change log: append-only history of observations and revisions.
- Canonical/public projection: the public-facing value chosen for broad display, which may remain the public-record value even when private observations differ.

## Operating Principle

Observations do not overwrite truth by default. A user-entered value, OCR extract, lease clause, or uploaded rent roll value becomes a new observation with source, actor, timestamp, confidence, visibility, and lineage.

Future reconciliation may promote some observations into canonical/public projections, but promotion must be governed, auditable, and permission-aware.

## Public Baseline And Private Variance

Public records are not proprietary by default. Public property records, acreage, GIS, title records, traffic, demographics, zoning, and parcel data can seed the public baseline. User-submitted documents and observations may diverge from that baseline without automatically replacing it.

## Future CRE Alignment

Sophex should later align with the CRE source observation ledger and evidence architecture through approved contracts. Expected alignment concepts include governed source observations, document references, operational receipts, idempotency keys, correlation identifiers, and audit trails.
