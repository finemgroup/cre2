# Project Boundary

Sophex is a separate public-facing CRE intelligence marketplace and valuation product. It is related to the CRE Platform and Finem Fabricator, but it has its own external trust boundary, user permissions, marketplace rules, and product surface.

Sophex should inherit doctrine, not code, from adjacent projects. CRE Platform contributes evidence, observation, audit, idempotency, and comp-governance doctrine. Finem Fabricator contributes workflow, agent, HITL, report-generation, and control-panel doctrine. Neither project should be copied into Sophex as production data truth.

## System Roles

| System | Role | Boundary |
| --- | --- | --- |
| Sophex | Public CRE intelligence, comps, valuation/reporting, contribution marketplace | External users, public/private data exchange, permissioned views |
| CRE Platform | Internal professional operating system and governed evidence substrate | Private operator workflows, canonical evidence, audit, idempotency |
| Finem Fabricator | Agent/workflow/orchestration factory | Workflow UX and agent patterns, not canonical data ownership |

## In Scope For Sophex Setup

| Area | Included Now |
| --- | --- |
| Product framing | Public property intelligence marketplace |
| Documentation | Boundary, evidence, permissions, ingestion, privacy, roadmap |
| Cursor setup | Project rules, branch hygiene, stop conditions |
| Future alignment | CRE and Fabricator integration posture |

## Adjacent But Future-Gated

| Area | Future Relationship |
| --- | --- |
| CRE source observation ledger | Consume through approved APIs/contracts |
| `documents.file_ref` posture | Align to CRE evidence handling once contracts exist |
| Operational receipts | Adopt for future audit and correlation |
| Fabricator agents | Use as implementation patterns after product/spec approval |
| Interactive content engine | Use as lead-gen/reporting inspiration, not runtime work now |
| Cross-project UX doctrine | Use shell/workstation, source panel, confidence, and report patterns as future design guidance |

## Out Of Scope Now

| Area | Exclusion |
| --- | --- |
| Runtime code | No app implementation in setup phase |
| Database | No schema, migration, Prisma, generated client, or DDL |
| Production coupling | No direct CRE production DB access |
| Automations | No provider sends, queues, deploys, or production services |
| Data copying | No migration of CRE truth into Sophex by copy-paste |
| Internal workflow exposure | No public routes that expose CRE operator workflows or Fabricator execution controls |

## Trust Boundary Statement

Sophex must assume that public users, free contributors, paid/private users, source owners, internal operators, and partners may have different rights to the same property field. A value visible to one actor may be hidden, older, anonymized, or replaced with a public baseline for another actor. This boundary must be enforced by future query/API contracts, not by UI-only filtering.

## Boundary Warnings

- Do not create a public `master_comps` truth table that bypasses review.
- Do not treat chunks, embeddings, AI extraction, or model confidence as canonical truth.
- Do not expose internal CRE data or Fabricator execution internals through public Sophex UX.
- Do not index or syndicate user-contributed data until visibility rules and source-use terms are implemented.
