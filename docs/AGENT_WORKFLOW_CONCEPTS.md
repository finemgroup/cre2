# Agent Workflow Concepts

Finem Fabricator can inspire Sophex workflows and agents, but agents do not own truth. Every agent output is candidate evidence, workflow status, or report material until reviewed, permissioned, and governed.

## Ingestion Classifier

- Role: classify uploads as clean PDF, scanned PDF, lease, rent roll, appraisal, deed, mortgage, offering memorandum, listing, or other.
- Inputs: file metadata, text layer presence, user-declared source type, quality signals.
- Outputs: ingestion path, cost tier, extraction expectations, blocked or needs-review state.
- Gate: scanned, high-risk, private, or legally sensitive documents require review.
- Boundary: no public publication.

## Evidence Extractor

- Role: extract property facts, lease terms, rent schedules, sale data, tenant data, valuation assumptions, and source spans.
- Inputs: document evidence, chunks, parser/model output.
- Outputs: candidate observations with source references.
- Gate: required before public or canonical use.
- Boundary: extraction is not truth.

## Valuation Report Generator

- Role: assemble white-labeled valuation reports from approved comps, model assumptions, evidence, public/private values visible to the actor, and user branding.
- Outputs: report artifact, confidence summary, top drivers, source appendix.
- Gate: early external export should require human review.
- Boundary: no send automation without consent, suppression, unsubscribe, idempotency, audit, and operator approval.

## Source Confidence Scorer

- Role: rank observations using source type, recency, review state, contradiction, completeness, and contributor trust.
- Outputs: confidence, freshness, and dispute labels.
- Gate: threshold changes and public promotion require review.
- Boundary: scoring informs resolution but never bypasses permissions.

## HITL Reviewer

- Role: route candidate facts and comps to human review.
- Outputs: accepted, rejected, needs-more-evidence, superseded, revoked, or blocked.
- Gate: the workflow itself is the human authority layer.
- Boundary: reviewer UI must respect permissions and audit.

## Marketplace Moderation Assistant

- Role: detect spam, bad comps, suspicious uploads, adversarial data, duplicates, and source-use risk.
- Outputs: moderation queue signals.
- Gate: ban, removal, and publication decisions require human authority.
- Boundary: no auto-ban or auto-publication in MVP.

## Audit And Background Job Status

- Role: create user-safe progress projections for upload, scan, extract, review, model run, report generation, and export.
- Outputs: status timeline and internal receipt references.
- Gate: failures, replay, expensive scanned docs, and blocked docs require review.
- Boundary: public users see safe summaries only, not internal queue details.
