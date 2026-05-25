# Sister-Project Schema Borrowing Gate

This gate defines how Sophex may later borrow schema concepts from a sister project.
It does not authorize schema copying, migrations, generated-client edits, production database reads, runtime imports, or deploys.

## Gate Status

- Current status: **closed**
- Reason: sister-project schema is still in process.
- Allowed now: doctrine, contract mapping, read-only planning.
- Forbidden now: direct schema implementation, migration, generated clients, DB commands, production data coupling.
- Rapid implementation posture: Sophex may build prototype contract simulators and sandbox API drafts, but the sister schema harvest remains deferred until explicit operator approval after source schema stabilization.
- Composer ticket posture: prototype adapter work, docs decision packets, and sandbox approval checklists may proceed; read-only sister schema diff work remains closed until the source repo, branch, commit, clean status, and operator approval are confirmed.
- Harvest packet template: [SISTER_SCHEMA_HARVEST_PACKET.md](SISTER_SCHEMA_HARVEST_PACKET.md)
- Operator signoff checklists: [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md)

## Long-Term Planning Layer

The sister project schema is expected to become an important upstream reference for Sophex once it stabilizes. Sophex should plan to leverage as much of that work as is appropriate, but only through an explicit read-only harvest, contract mapping, and approval process.

Until the source schema is declared stable enough for review, Sophex should treat it as a moving reference, not an implementation dependency. Product, design, and prototype work may anticipate alignment with the sister schema by using stable concept names in docs and mock contracts, but must not copy schema files, migrations, generated clients, seed data, or runtime coupling into this project.

Long-term alignment should be layered in this order:

1. Track the sister schema stabilization milestone and identify the source repo, branch, commit, and owner.
2. Run a read-only schema/concept harvest after operator approval.
3. Produce a Sophex mapping packet that classifies concepts as reuse, adapt, exclude, or open question.
4. Update Sophex contract docs before any runtime or schema implementation.
5. Seek separate implementation approval in the correct lane if schema or runtime work becomes necessary.

## Borrowing Principles

- Borrow concepts and invariants before names and tables.
- Prefer API/contract alignment over database coupling.
- Treat internal sister-project tables as implementation details unless intentionally promoted to public/product contracts.
- Preserve Sophex as a separate external trust boundary.
- Map every borrowed concept through Sophex visibility, source-use, marketplace, and export policy.

## Required Preconditions

Before any schema harvest:

1. Sister project declares its schema stable enough for review.
2. A clean checkout path, branch, commit, and remote are confirmed.
3. Source checkout is clean.
4. Operator confirms read-only harvest scope.
5. No production credentials, DB shells, migrations, provider sends, queues, or deploy terminals are used.
6. Sophex contract docs are current: `EVIDENCE_PERMISSION_CONTRACTS.md`, `PRODUCTION_ARCHITECTURE_PACKET.md`, and `SECURITY_PRIVACY_LAUNCH_GATES.md`.

## Read-Only Harvest Procedure

1. Confirm source repository identity, branch, HEAD, and cleanliness.
2. Identify schema files, API contracts, evidence models, audit/receipt patterns, and permission policy references.
3. Extract names and relationships into a harvest packet.
4. Classify each concept as reuse, adapt, exclude, or open question.
5. Produce a diff against Sophex contracts.
6. Do not edit Sophex runtime or schema files during harvest.

## Classification Matrix

| Classification | Meaning                                                               | Sophex action                                         |
| -------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| Reuse concept  | Concept matches Sophex external trust model.                          | Add to contract docs with Sophex naming if needed.    |
| Adapt concept  | Useful but internal/private semantics differ.                         | Translate into Sophex visibility/source-rights terms. |
| Exclude        | Internal-only, production-specific, or unsafe for public marketplace. | Document as non-importable.                           |
| Open question  | Requires product/legal/security decision.                             | Add to open questions before any implementation.      |

## Concepts Likely To Reuse Or Adapt

- Property identity and public baseline references.
- Document evidence identity and file-reference authority.
- Source observations and extracted spans.
- Review/promotion/supersession state.
- Idempotency and correlation identifiers.
- Redacted operational receipts.
- Comp source, confidence, provider-rights, and verification metadata.
- Report section review and export blocker patterns.
- Valuation version, evidence snapshot, export manifest, and source-lock governance concepts.
- Organization/team/user permission concepts that can be safely translated into Sophex external actor classes.
- Underwriting assumption, scenario, sensitivity, and calculation-trace concepts that remain advisory until reviewed.

## Concepts That Must Not Be Copied Blindly

- Internal operator roles.
- Production-only document or evidence tables.
- Private user data, private comps, or internal deal facts.
- Raw logs, queue states, worker ids, stack traces, or provider payloads.
- Schema names that imply public visibility where Sophex needs actor-specific resolution.
- Any migration history, seed data, generated client, or production DB assumption.

## Diff Packet Template

Each harvested concept should be documented with:

- Source path.
- Source commit.
- Source concept name.
- Sophex target concept.
- Classification.
- Visibility impact.
- Source-rights impact.
- Export/share impact.
- Idempotency/audit impact.
- Required tests.
- Open questions.
- Approval status.

## Approval Gates

No runtime/schema work begins until:

- Diff packet is reviewed.
- Concepts are mapped to Sophex contracts.
- Security/privacy gates are updated.
- Operator explicitly approves implementation in the correct lane.
- Any schema/migration work is authorized separately from this setup/prototype lane.

## Stop Conditions

Stop immediately if:

- Source repo identity or cleanliness is unclear.
- The task requires production DB access.
- The task asks for Prisma migrate, db push, generated-client edits, SQL DDL, or deploys.
- Harvested concepts would leak private/internal data into public Sophex.
- Sister-project internal roles are being treated as public marketplace roles.
