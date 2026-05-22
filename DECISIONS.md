# Sophex Decisions

This file is the initial ADR-style decision log for the Sophex setup phase.

## ADR-0001: Sophex Is A Separate Product And Trust Boundary

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex is a public-facing CRE intelligence marketplace with an external user trust boundary.
- Consequence: Sophex must not be treated as a casual extension of internal CRE production workflows.

## ADR-0002: CRE Platform Remains The Governed Substrate

- Status: Accepted
- Date: 2026-05-22
- Decision: CRE Platform remains the governed internal substrate for canonical documents, source observations, comp intelligence, audit, idempotency, and correlation.
- Consequence: Sophex should later align through approved APIs and contracts, not direct database coupling or copy-paste migrations.

## ADR-0003: Finem Fabricator Is Not The Data Owner

- Status: Accepted
- Date: 2026-05-22
- Decision: Finem Fabricator can provide workflow, agent, report-generation, and HITL patterns, but it is not the canonical Sophex or CRE data owner.
- Consequence: Fabricator-inspired agents must respect Sophex permissions and CRE evidence contracts.

## ADR-0004: Field Values Resolve From Permissioned Observations

- Status: Accepted
- Date: 2026-05-22
- Decision: Displayed property field values resolve from the latest observation/change-log entry that the actor has permission to see.
- Consequence: Permissions must be enforced at the query/API layer, not only in UI rendering.

## ADR-0005: Uploaded Documents Are Evidence

- Status: Accepted
- Date: 2026-05-22
- Decision: Uploaded PDFs, leases, rent rolls, deeds, mortgages, contracts, appraisals, listings, and trade records become evidence and source material, not automatic canonical truth.
- Consequence: Extracted values require source, actor, timestamp, confidence, visibility, and lineage.

## ADR-0006: No Schema Or Runtime In Setup Phase

- Status: Accepted
- Date: 2026-05-22
- Decision: This setup packet authorizes documentation and project rules only.
- Consequence: Runtime implementation, schema design syntax, migrations, provider sends, queues, and deploys are future-gated.

## ADR-0007: No Worktrees

- Status: Accepted
- Date: 2026-05-22
- Decision: This Sophex setup lane does not use worktrees.
- Consequence: Branch hygiene is handled with a single docs branch and explicit path staging.

## ADR-0008: Local Git Bootstrap Uses Master

- Status: Accepted
- Date: 2026-05-22
- Decision: Local Git is initialized on `master` for the initial project shell bootstrap.
- Consequence: Remote/default branch policy can change later only after a Sophex remote URL and operator approval are provided.

## ADR-0009: Sophex Inherits Doctrine, Not Code

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex should inherit evidence, observation, permission, audit, UX, and workflow doctrine from CRE Platform and Finem Fabricator, not production code or data by copy-paste.
- Consequence: Cross-project alignment must happen through future contracts, APIs, mock data, or approved read models.

## ADR-0010: Chunks And Embeddings Are Sidecars

- Status: Accepted
- Date: 2026-05-22
- Decision: Document metadata and evidence identity are business records; chunks and embeddings are derived retrieval sidecars.
- Consequence: Retrieval material must not become canonical truth or bypass document/evidence permissions.

## ADR-0011: Authority Labels Are Product Requirements

- Status: Accepted
- Date: 2026-05-22
- Decision: Sophex must show authority labels for public baseline, private, reviewed, unreviewed, stale, disputed, blocked, promoted, and model-inferred values.
- Consequence: Future UX and APIs must carry enough review, source, freshness, and visibility context to explain why a value is shown.

## ADR-0012: Retrieval Must Be Permission-Filtered At Every Hop

- Status: Accepted
- Date: 2026-05-22
- Decision: Search, source panels, report generation, export, future APIs, and model inputs must respect actor, org, source-use, review, freshness, and public/private boundaries.
- Consequence: UI hiding is not a security model; query/API filtering is required before implementation.

## ADR-0013: Schema Concepts Remain Future-Gated

- Status: Accepted
- Date: 2026-05-22
- Decision: Conceptual entities and invariants may be documented, but schema, migrations, generated-client edits, and database writes remain unauthorized.
- Consequence: `docs/FUTURE_SCHEMA_CONCEPTS.md` is a contract-thinking artifact only.
