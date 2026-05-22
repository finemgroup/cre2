# Document Ingestion Model

This document describes intended ingestion behavior only. No implementation is authorized in this setup phase.

**Fabricator reference:** [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md) — provisional.

## Evidence-First Ingestion

Ingestion creates **document evidence identity and policy metadata** before extraction drives product behavior. Upload bytes are stored; business records track evidence identity, source-use policy, visibility, and review eligibility. Extraction produces **candidates only** — never automatic public promotion.

## Source Classification

The ingestion classifier (future-gated) routes documents by:

- Clean digital PDF vs scanned/image-heavy PDF.
- Declared source type: lease, rent roll, deed, appraisal, OM, listing, comp record, other.
- Risk tier: standard, sensitive, legally restricted, blocked pending review.
- Cost tier: cheap path (clean PDF) vs expensive path (OCR/scan).

Classification outputs an `IngestionRun` reference and determines whether extraction may proceed.

## Redaction-First Envelope

Before extraction or model input, apply a **redaction-first evidence envelope**:

- Strip or mask fields not permitted for the processing stage.
- Attach visibility and source-use policy to every candidate.
- Never pass raw private payloads to public models or indexes.
- Fabricator evidence-envelope doctrine applies conceptually; Sophex owns policy.

## Scan Vs Clean PDF Cost Controls

| Path | Characteristics | Cost posture |
| --- | --- | --- |
| **Clean PDF** | Selectable text, tables, metadata | Low-cost extraction; higher initial confidence |
| **Scanned/OCR** | Image-heavy, poor text layer | Higher cost; lower confidence; stronger HITL expectation |

Users should see cost/review expectations before committing scanned uploads. Blocked or unpaid scan paths remain future product decisions (see open questions).

## Blocked Actions Before Extraction

Extraction must **not** proceed when:

- Source-use or visibility terms not accepted.
- Document classified as blocked or awaiting operator review.
- Consent missing for sensitive source types.
- Duplicate/idempotency conflict unresolved (fail-closed).
- File fails validation (size, type, malware scan — future-gated).

## Candidate Facts Only — No Public Promotion

- Extracted values become `ExtractionCandidate` records, not observations promoted to public baseline.
- Chunks and embeddings are retrieval sidecars — never canonical truth.
- Public promotion requires HITL review, source-use eligibility, and permission filters.

## Source Types

Sophex should eventually support evidence from:

- Clean digital PDFs.
- Scanned or image-heavy PDFs.
- Leases and amendments.
- Rent rolls.
- Deeds and title/public records.
- Mortgages and financing documents.
- Purchase contracts.
- Appraisals.
- Listings and offering memoranda.
- Trade records and user-submitted comps.

## Evidence Retention

Documents should be retained or referenced as evidence according to future source-owner terms, privacy rules, and storage policy. Extracted values should retain links back to source location where possible.

Future metadata: source-use policy, visibility policy, owner/uploader scope, hash, review status, revocation/supersession state, publication eligibility.

## Extraction Confidence

Every extracted observation should carry confidence signals such as source quality, extraction method, review status, and whether a human confirmed the value.

## HITL Review

Human-in-the-loop review is required for low-confidence extraction, high-value fields, private marketplace contributions, scanned/OCR paths, and values that may affect public or paid outputs.

Possible review states include unreviewed, needs evidence, conflicting, accepted public, accepted private, rejected, revoked, superseded, and blocked.

## Sister-Project References

- CRE uploader and document-viewer patterns inform intake UX — doctrine only.
- Content Engine gated-export concepts inform terms copy, not ingestion runtime.
- Fabricator ingestion classifier and evidence envelope: `docs/AGENT_WORKFLOW_CONCEPTS.md`.

## Not Implemented Yet

No vectorization, OCR, chunking, parser, storage, queue, worker, runtime service, schema, or production document pipeline is part of this setup packet.
