# Document Ingestion Model

This document describes intended ingestion behavior only. No implementation is authorized in this setup phase.

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

## Clean PDF Cheap Path

Clean digital PDFs are the low-cost path. They often contain selectable text, tables, and metadata that can be chunked, extracted, linked, and reviewed with lower OCR cost and better confidence.

## Scanned/OCR Expensive Path

Scanned leases and image-heavy documents require OCR, layout analysis, table reconstruction, and more human review. These sources may be valuable but should carry higher processing cost, lower initial confidence, and clearer HITL expectations.

## Evidence Retention

Documents should be retained or referenced as evidence according to future source-owner terms, privacy rules, and storage policy. Extracted values should retain links back to source location where possible.

## Extraction Confidence

Every extracted observation should carry confidence signals such as source quality, extraction method, review status, and whether a human confirmed the value.

## HITL Review

Human-in-the-loop review is required for low-confidence extraction, high-value fields, private marketplace contributions, and values that may affect public or paid outputs.

## Not Implemented Yet

No vectorization, OCR, chunking, parser, storage, queue, worker, runtime service, schema, or production document pipeline is part of this setup packet.
