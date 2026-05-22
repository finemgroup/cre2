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
