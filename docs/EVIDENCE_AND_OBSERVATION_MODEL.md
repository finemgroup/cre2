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
- Document evidence identity: durable metadata and source identity for an uploaded or referenced document.
- Chunk or embedding: derived retrieval sidecar for search and extraction support, not business truth.
- Operational receipt: future audit/correlation reference for upload, extraction, review, publication, report generation, or export.

## Operating Principle

Observations do not overwrite truth by default. A user-entered value, OCR extract, lease clause, or uploaded rent roll value becomes a new observation with source, actor, timestamp, confidence, visibility, and lineage.

Future reconciliation may promote some observations into canonical/public projections, but promotion must be governed, auditable, and permission-aware.

Documents are evidence; chunks and embeddings are derived sidecars. A retrieved chunk can support extraction or search, but it does not replace the source document, source extract, observation, review state, or permission policy.

## Public Baseline And Private Variance

Public records are not proprietary by default. Public property records, acreage, GIS, title records, traffic, demographics, zoning, and parcel data can seed the public baseline. User-submitted documents and observations may diverge from that baseline without automatically replacing it.

## Future CRE Alignment

Sophex should later align with CRE evidence architecture through approved contracts. The authoritative clean-master harvest confirmed these reference concepts:

- Relationship Truth Doctrine separates notes, documents, comments, activities, evidence, receipts, and projections.
- `documents.file_ref` style byte-pointer authority separates file bytes from business/evidence metadata.
- `DocumentEvidence` style registry carries source family, source hashes, review/promotion status, receipt refs, idempotency, correlation, supersession, freshness, and HITL review.
- Source observation timing and digest fields distinguish observed/uploaded/extracted times.
- `DoclingChunk` style chunks and embeddings remain retrieval sidecars.
- Policy and operational receipts provide replay-safe audit anchors with redacted evidence references.
- Comp intelligence uses source, confidence, verification, provider rights, and review gates before public use.

## Provenance UI Contract (Future)

Future APIs and UI should support inline citation, table provenance cells, and provenance drawers filtered by actor permissions. CRE `SourceCitation`, `ProvenanceCell`, and `ProvenanceModal` patterns are reference shapes only.

Clean-master path references live in [CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md); topic docs remain canonical.

## Audit And Event Separation

Future Sophex should not collapse notes, comments, audit events, operational receipts, evidence records, and observations into one feed. Public audit views should be permission-filtered projections that answer "why am I seeing this value?" and "what changed?" without leaking private facts or internal operator details.
