# Sophex / CRE / Fabricator Alignment

**Status:** Architecture alignment contract  
**Date:** 2026-05-22  
**Implementation status:** `CONTRACT_ONLY`

## Roles

| System | Owns | Does Not Own |
| --- | --- | --- |
| Sophex | Public marketplace UX, contribution exchange, report contracts, public/private trust boundary | CRE production truth, Fabricator runtime orchestration |
| CRE Platform | Internal governed schema/data substrate, document evidence, audit, idempotency, correlation, operator workflows | Sophex public product launch policy |
| Finem Fabricator | Workflow, agent, HITL, evidence-envelope, report-generation patterns | Canonical marketplace data truth |

## Integration Principle

Future integration should happen through APIs, contracts, projections, or reviewed data products by default. Direct DB copying or physical database sharing with CRE Platform is not decided and must not be assumed.

Neon/Postgres remains CRE's current canonical posture unless changed by a separate architecture decision. Railway may later host app/service infrastructure, but it is not assumed as Sophex's canonical database.

## CRE Alignment

CRE Platform has proven evidence/audit/idempotency/correlation patterns through O2-A, O2-B, MVP0 uploader/chunker, and DCI-E1. Sophex should align conceptually with DCI-E1 document evidence and future DCI-C0 source observations, but not fork CRE tables blindly.

## Fabricator Alignment

Fabricator contributes workflow and agent patterns:

- evidence envelopes;
- HITL recommendation/hold/reject posture;
- report artifact warnings/citations/reviewRequired;
- job status projection patterns;
- audit/idempotency/correlation concepts.

Fabricator queue completion and agent output are not Sophex truth, publication authority, or export authority.

## Query-Level Trust Boundary

Public/private visibility belongs in contracts and future query/API enforcement. UI labels are necessary but insufficient.
