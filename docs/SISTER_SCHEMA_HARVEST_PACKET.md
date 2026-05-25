# Sister Schema Harvest Packet

This packet is the future read-only template for harvesting concepts from the actively evolving sister-project schema.

It is not an implementation authorization. It does not permit schema copying, migrations, generated-client edits, DB commands, production data access, runtime imports, deploys, provider calls, queues, or real document handling.

## Status

- Current status: **not started**
- Gate: `SISTER_SCHEMA_BORROWING_GATE.md`
- Allowed now: planning, template preparation, concept-mapping readiness.
- Forbidden now: any schema/runtime implementation or production coupling.

## Required Operator Inputs

Before this packet can move from template to active harvest, the operator must provide:

| Required input                        | Value   |
| ------------------------------------- | ------- |
| Sister project name                   | Pending |
| Local checkout path                   | Pending |
| Remote URL                            | Pending |
| Branch                                | Pending |
| Commit SHA                            | Pending |
| Source owner / reviewer               | Pending |
| Confirmation source checkout is clean | Pending |
| Approved read-only scope              | Pending |
| Schema stabilization note             | Pending |

## Preflight Checklist

Do not proceed unless every item is confirmed:

- The sister schema has been declared stable enough for read-only review.
- Source repo identity, branch, commit, and remote are known.
- Source checkout is clean.
- No production credentials, DB shells, migrations, provider sends, queues, or deploy terminals are used.
- Sophex contract docs are current:
  - `EVIDENCE_PERMISSION_CONTRACTS.md`
  - `PRODUCTION_ARCHITECTURE_PACKET.md`
  - `SECURITY_PRIVACY_LAUNCH_GATES.md`
  - `SISTER_SCHEMA_BORROWING_GATE.md`
- Operator approves read-only harvest scope for the current session.

## Harvest Procedure

1. Confirm source repo identity, branch, HEAD, and clean status.
2. Identify schema files, API contracts, evidence models, audit/receipt models, and permission policy references.
3. Extract concept names, relationships, invariants, and lifecycle states.
4. Classify each concept as `reuse`, `adapt`, `exclude`, or `open question`.
5. Map approved concepts into Sophex external-trust vocabulary.
6. Diff against existing Sophex contracts and prototype fixtures.
7. Update docs only unless a separate implementation lane is approved.

## Concept Mapping Matrix

| Source concept | Source path | Sophex target concept               | Classification | Visibility impact | Source-rights impact | Export/share impact | Idempotency/audit impact | Required tests | Open questions | Approval status |
| -------------- | ----------- | ----------------------------------- | -------------- | ----------------- | -------------------- | ------------------- | ------------------------ | -------------- | -------------- | --------------- |
| Pending        | Pending     | `DocumentEvidence`                  | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `SourceObservation`                 | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `EvidenceSnapshot`                  | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `ValuationVersion`                  | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `ExportManifest`                    | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `AuditReceipt`                      | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `ActorContext` / `VisibilityPolicy` | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `UnderwritingAssumption`            | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |
| Pending        | Pending     | `ScenarioSet` / `SensitivityTrace`  | Pending        | Pending           | Pending              | Pending             | Pending                  | Pending        | Pending        | Pending         |

## Classification Guide

| Classification  | Meaning                                                                                | Sophex action                                                                |
| --------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `reuse`         | Concept directly matches Sophex external trust and product needs.                      | Adopt in contract docs, with Sophex naming if needed.                        |
| `adapt`         | Concept is useful but has internal/private semantics.                                  | Translate into Sophex visibility, source-rights, and export policy language. |
| `exclude`       | Concept is internal-only, unsafe, production-specific, or not marketplace appropriate. | Document as non-importable.                                                  |
| `open question` | Concept needs product, legal, security, or operator decision.                          | Add to `OPEN_QUESTIONS.md` before implementation.                            |

## First Concepts To Examine

- Property identity and public baseline references.
- Document evidence identity and file-reference authority.
- Source observations, extracted spans, and confidence state.
- Review, promotion, supersession, hold, and rejection state.
- Valuation version and evidence snapshot references.
- Export manifest, redaction, receipt, checksum, and source-lock governance.
- Organization, team, user, role, and actor-permission concepts.
- Underwriting assumptions, scenarios, sensitivity cells, and calculation traces.
- Idempotency and correlation identifiers.

## Explicit Exclusions

Do not copy or depend on:

- Migration history.
- Prisma/schema files or generated clients.
- Seed data.
- Production-only document tables.
- Provider payloads.
- Raw logs, queue states, worker IDs, stack traces, or operational internals.
- Private users, internal deal facts, private comps, or confidential uploads.
- Internal role names that do not translate safely into Sophex external actor classes.

## Output Requirements

An active harvest should produce:

1. A completed concept mapping matrix.
2. A list of concepts safe to reuse or adapt.
3. A list of concepts explicitly excluded.
4. A diff against Sophex contract docs.
5. Proposed doc updates.
6. Test implications for prototype contracts and future runtime contracts.
7. Open questions requiring product/legal/security/operator review.
8. A clear approval status.

## Approval Gate

No schema or runtime implementation starts until:

- This packet is completed.
- `SISTER_SCHEMA_BORROWING_GATE.md` preconditions are satisfied.
- Sophex contract docs are updated.
- Security/privacy gates are reviewed.
- Operator explicitly approves implementation in the correct lane.

## Stop Conditions

Stop immediately if:

- Source repo identity or checkout cleanliness is unclear.
- Any task requires production DB access.
- Any task asks for migrations, SQL DDL, Prisma commands, generated-client edits, or deploys.
- Any concept would leak private/internal data into public Sophex surfaces.
- Any sister-project internal role is being treated as marketplace truth.
