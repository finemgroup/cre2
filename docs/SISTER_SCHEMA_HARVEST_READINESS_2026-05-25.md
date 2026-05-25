# Sister Schema Harvest Readiness

**Purpose:** Prepare the read-only harvest that will connect the opened sandbox runtime lane to the sister project schema once that schema is declared stable. This is not schema implementation, migration work, generated-client work, or database access.

**Runtime lane relationship:** The sandbox API should continue using synthetic stores until a reviewed harvest packet maps sister concepts into Sophex contracts.

## Harvest Preconditions

| Item                     | Required before harvest                                                           | Status                  |
| ------------------------ | --------------------------------------------------------------------------------- | ----------------------- |
| Source repo identity     | Repository path, remote, branch, and owner confirmed                              | Pending operator input  |
| Source stability         | Sister project schema declared complete enough for review                         | Pending                 |
| Clean checkout           | `git status --porcelain` empty in source checkout                                 | Pending                 |
| Scope approval           | Read-only concept harvest approved; no runtime/schema edits                       | Pending                 |
| Secret boundary          | No production DB shells, `.env` reads, provider keys, or credentials              | Required                |
| Sophex contracts current | Evidence, architecture, launch gates, API draft, and permission fixtures reviewed | Ready for harvest input |

## Priority Concept Map

| Sister concept to inspect            | Sophex target contract            | First runtime connection point                                 | Decision needed                                               |
| ------------------------------------ | --------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- |
| Property identity and baseline facts | Public property baseline          | `GET /sandbox/v0/properties`, `GET /sandbox/v0/properties/:id` | Reuse/adapt id shape and public baseline fields               |
| Document evidence identity           | Evidence metadata and source refs | `POST /sandbox/v0/uploads/candidates`                          | Adapt for contribution terms and source-owner visibility      |
| Observation/extracted spans          | Field-level evidence resolution   | Property evidence drawer and report source bundle              | Keep candidate/private separate from public projection        |
| Review state and promotion           | HITL review authority             | `GET /sandbox/v0/review-queue`, future decision endpoint       | Require reviewer authority; queue completion is not promotion |
| Receipt/idempotency model            | Governed receipt ledger           | `POST /sandbox/v0/exports`, uploads, review decisions          | Reuse invariant, adapt redacted public projection             |
| Report sections and blockers         | Report governance                 | `GET /sandbox/v0/reports/:id`                                  | Preserve source-rights and section-review gates               |
| Valuation snapshots                  | Snapshot governance               | Studio snapshots and export manifest                           | Adapt to Sophex external actor model                          |
| User/org/team roles                  | Actor context and entitlements    | Actor middleware and API policy                                | Translate; do not expose sister internal roles directly       |

## Harvest Output Template

Each harvested concept should produce one row in the future mapping packet:

| Field                | Required content                                                      |
| -------------------- | --------------------------------------------------------------------- |
| Source path          | File path and commit from clean sister checkout                       |
| Source concept       | Table/model/API/type name or policy object                            |
| Sophex target        | Contract or runtime port it maps to                                   |
| Classification       | Reuse concept, adapt concept, exclude, or open question               |
| Visibility impact    | Public, user-private, org-private, provider-restricted, internal-only |
| Source-rights impact | Whether provider/export/indexing rights are affected                  |
| Export/share impact  | Receipt, consent, redaction, blocker, or no impact                    |
| Required tests       | API permission/idempotency tests that must pass before connection     |
| Approval status      | Pending, approved, rejected, or deferred                              |

## Implementation Boundary

- The sandbox API may accept schema-backed repositories only after this harvest is reviewed.
- No SQL, migrations, Prisma/Drizzle/Kysely clients, generated clients, seeds, or production DB commands are authorized by this readiness doc.
- If a sister concept conflicts with Sophex public marketplace visibility, Sophex visibility wins.
