# File Safety And Retention Plan

This plan defines requirements before Sophex accepts real document bytes.
It does not implement storage, scanning, OCR, queues, schemas, migrations, or production services.

## MVP Safety Posture

Real upload is blocked until all of the following are approved:

- File type allowlist for PDF, XLSX, CSV, and image formats if needed.
- Maximum size per file and per workspace.
- Malware scanning provider and failure policy.
- Hash/digest identity before extraction.
- Private byte storage access model.
- Retention and deletion policy.
- OCR/extraction sidecar isolation.
- Revocation and supersession process.

## Byte Access Rules

- Private files must not have public URLs.
- Public routes must consume redacted metadata and resolved observations, not bytes.
- OCR text, chunks, embeddings, and extracted spans are retrieval sidecars, not authority.
- Internal/operator views may show sanitized metadata; raw bytes require explicit permission and audit.
- Provider-restricted documents require separate source-use terms.

## Retention Defaults To Decide

| Item | Recommended sandbox default |
| --- | --- |
| Raw uploaded bytes | Not stored in sandbox unless separately approved. |
| Metadata | Stored as synthetic evidence identity. |
| Digest/hash | Required for idempotency and duplicate detection. |
| OCR/chunks | Disabled until extraction safety is approved. |
| Revoked evidence | Retain redacted audit record; block reuse. |
| Receipts | Retain as public-safe governed action proof. |

## Runtime Acceptance Tests

- Unsupported file type is rejected before upload receipt creation.
- Oversized file returns safe error without storing bytes.
- Malware scan pending state cannot promote evidence.
- Revoked evidence remains auditable but cannot appear in public projections.
- Public receipt never exposes raw filename, byte path, stack trace, worker id, or private source-owner identity.
