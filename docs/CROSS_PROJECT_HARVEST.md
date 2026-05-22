# Cross-Project Harvest

Source: Ara Cross-Project Harvest Packet supplied on 2026-05-22.

This document records what Sophex should inherit from CRE Platform and Finem Fabricator. Sophex should inherit doctrine, contracts, review posture, and UX patterns. It should not inherit runtime code, production data, schema migrations, or internal operator workflows by copy-paste.

## Harvest Summary

- Sophex remains a separate product and public trust boundary.
- CRE Platform remains the governed internal substrate for evidence, source observations, comp intelligence, receipts, audit, idempotency, and correlation.
- Finem Fabricator contributes workflow, agent, HITL, report-generation, and control-panel patterns, but it does not own Sophex data truth.
- The core Sophex primitive is permissioned evidence and field observation resolution, not a flat comps table.
- Uploaded documents are evidence; chunks and embeddings are derived retrieval sidecars.
- Public/free contribution creates a data flywheel, but source-use, consent, privacy, publication, and revocation rules must exist before launch.
- Authority labels must be visible in UI so users can distinguish public baseline, private, reviewed, unreviewed, stale, disputed, blocked, and promoted values.
- Retrieval must be permission-filtered at every hop, including search, evidence panels, report generation, export, and future API access.
- Valuation/reporting UX must be evidence-first, with assumptions, comps, confidence language, source freshness, and reviewer control.
- Runtime, schema, marketplace writes, and public launch remain future-gated.

## Gap List Against Current Docs

| Gap | Current Coverage | Integration Action |
| --- | --- | --- |
| Doctrine-not-code inheritance | Partially in project boundary | Added explicit cross-project harvest and ADR |
| Chunks/embeddings are sidecars | Lightly mentioned in ingestion | Added document and future schema concepts |
| Authority labels in UI | Not explicit enough | Added trust model and UX inheritance guidance |
| Permission-filtered retrieval at every hop | Query/API permission present | Expanded to retrieval/report/export/search paths |
| Operational receipts/idempotency/correlation | CRE alignment mentions | Added future schema and workflow concepts |
| Audit/event separation | Not explicit | Added evidence model and future schema concepts |
| Comp candidate vs resolved comp set | Not explicit | Added future schema concepts |
| Contact/user/org boundary separation | Actor classes present | Expanded permissions and future schema concepts |
| HITL review state taxonomy | Basic HITL mention | Expanded ingestion, workflow, and schema concepts |
| UX inheritance from CRE | Not captured | Added frontend UX inheritance doc |
| Motion/interaction guidance | Missing | Added motion and interaction doc |
| Agent workflow roles | Listed in Fabricator alignment | Added detailed agent workflow concepts |
| Security/privacy warning list | Partially present | Expanded privacy and non-goals |
| Content engine boundaries | Present in report doc | Expanded marketplace/privacy language |

## Doctrine To Carry Forward

Sophex should treat evidence, observation, permission, review state, source-use policy, and auditability as first-order product concepts. This means future implementation should define contracts for visibility, authority labels, source identity, and review state before any database write path or public marketplace launch.

## Doctrine Not To Carry Forward

Sophex should not copy CRE production data, internal role assumptions, internal evidence tables, Fabricator runtime queues, provider/send workflows, or private operator screens into a public product. Any future alignment should happen through approved APIs, contracts, read models, or sandboxed mock data.

## Future-Gated Adoption

The harvest packet informs documentation, contracts, and design. It does not authorize schema, migrations, runtime code, queue jobs, provider sends, deployment, production DB access, or public data publication.
