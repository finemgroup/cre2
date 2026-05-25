# Sophex Gated Lanes Approval Packet

This packet consolidates operator approval requirements for work that **must not** proceed from the mock-only prototype lane without explicit signoff.
It is documentation and checklist only — no runtime implementation is authorized by this file.

## Lane Overview

| Lane | ID prefix | Current status | Authorized now |
| --- | --- | --- | --- |
| Mock prototype & docs | `SOPHEX-FE-*`, `SOPHEX-UX-*`, `SOPHEX-CONTRACT-*` (mock) | **Open** | Yes — `prototype/` and `docs/` only |
| Sandbox runtime foundation | `SOPHEX-S0-001` … | **Closed** | Docs, contract drafts, approval prep only |
| Sister schema harvest | `SOPHEX-X0-001` … | **Closed** | Read-only planning packets only |
| Schema waves (contract → DB) | `SOPHEX-S0` … `SOPHEX-REPORT1` | **Closed** | Local contract docs under `docs/schema/` only |
| Deploy / providers / queues | — | **Closed** | Not authorized |

Primary references:

- [RUNTIME_FOUNDATION_SANDBOX_PLAN.md](RUNTIME_FOUNDATION_SANDBOX_PLAN.md)
- [SISTER_SCHEMA_BORROWING_GATE.md](SISTER_SCHEMA_BORROWING_GATE.md)
- [PRODUCTION_ARCHITECTURE_PACKET.md](PRODUCTION_ARCHITECTURE_PACKET.md)
- [EVIDENCE_PERMISSION_CONTRACTS.md](EVIDENCE_PERMISSION_CONTRACTS.md)
- [SECURITY_PRIVACY_LAUNCH_GATES.md](SECURITY_PRIVACY_LAUNCH_GATES.md)
- [API_CONTRACT_DRAFT.md](API_CONTRACT_DRAFT.md)
- [roadmap/SOPHEX_SCHEMA_WAVE_ROADMAP_2026-05-22.md](roadmap/SOPHEX_SCHEMA_WAVE_ROADMAP_2026-05-22.md)

## Universal Stop Conditions

Stop immediately and escalate to the operator if any task would:

- Run Prisma migrate, db push, SQL DDL, or edit generated clients.
- Connect to production or sister-project databases.
- Read `.env` secrets into code, logs, or docs.
- Import CRE/Fabricator runtime packages, workers, or queues.
- Deploy to Railway, Vercel, or any production host.
- Copy sister-project source code, assets, or schema files verbatim.
- Expose private observations, provider-restricted comps, or internal operator roles to public actors.

---

## Lane 3: Sandbox Runtime Foundation

**Ticket anchor:** `SOPHEX-S0-001` — Sandbox HTTP harness and permission-enforced API shell.

**Purpose:** Prove server-side actor context, evidence filtering, review queue, and idempotent export receipts using synthetic sandbox data only.

**Gate status:** Closed until this checklist is signed.

### Required document review

| Document | Reviewed | Reviewer | Date |
| --- | --- | --- | --- |
| [PRODUCTION_ARCHITECTURE_PACKET.md](PRODUCTION_ARCHITECTURE_PACKET.md) | ☐ | | |
| [EVIDENCE_PERMISSION_CONTRACTS.md](EVIDENCE_PERMISSION_CONTRACTS.md) | ☐ | | |
| [SECURITY_PRIVACY_LAUNCH_GATES.md](SECURITY_PRIVACY_LAUNCH_GATES.md) | ☐ | | |
| [API_CONTRACT_DRAFT.md](API_CONTRACT_DRAFT.md) | ☐ | | |
| [CONTRIBUTION_TERMS_DECISION_PACKET.md](CONTRIBUTION_TERMS_DECISION_PACKET.md) | ☐ | | |
| [FILE_SAFETY_AND_RETENTION_PLAN.md](FILE_SAFETY_AND_RETENTION_PLAN.md) | ☐ | | |
| [REVIEW_AUTHORITY_AND_HITL_POLICY.md](REVIEW_AUTHORITY_AND_HITL_POLICY.md) | ☐ | | |
| [OBSERVABILITY_EVENT_TAXONOMY.md](OBSERVABILITY_EVENT_TAXONOMY.md) | ☐ | | |
| [INCIDENT_RESPONSE_AND_PRIVACY_RUNBOOKS.md](INCIDENT_RESPONSE_AND_PRIVACY_RUNBOOKS.md) | ☐ | | |
| [PERMISSION_TEST_FIXTURES.md](PERMISSION_TEST_FIXTURES.md) | ☐ | | |

### Sandbox scope confirmation

| Question | Operator answer |
| --- | --- |
| Sandbox is synthetic/mock-data-only (no production bytes)? | ☐ Yes ☐ No |
| No real document storage unless separately approved? | ☐ Yes ☐ No |
| UI will not be treated as authorization boundary? | ☐ Yes ☐ No |
| Idempotency keys required on all governed writes? | ☐ Yes ☐ No |
| Public errors/logs will never include private field values? | ☐ Yes ☐ No |
| Sister schema gate remains closed during sandbox Phase 1? | ☐ Yes ☐ N/A |

### Prototype bridge acceptance

The operator confirms sandbox APIs will preserve invariants from:

- `prototype/src/lib/contracts/*`
- `prototype/src/lib/runtime/*`

Replacement sequence follows [RUNTIME_FOUNDATION_SANDBOX_PLAN.md](RUNTIME_FOUNDATION_SANDBOX_PLAN.md) § Replacement Sequence From Prototype.

### Minimum first modules (when approved)

1. Identity sandbox fixtures (anonymous → operator roles).
2. Public property baseline API (filtered responses).
3. Observation append API (visibility class enforced server-side).
4. Evidence identity + review state API.
5. Metadata-only upload placeholder.
6. HITL review queue (promotion requires reviewer authority).
7. Report section API with source bundle filtering.
8. Idempotent export receipt API.
9. Redacted audit log projections.

### Sandbox exit criteria

- Permission fixture matrix passes at API level (see [PERMISSION_TEST_FIXTURES.md](PERMISSION_TEST_FIXTURES.md)).
- Prototype adapters can swap mock data source without changing permission semantics.
- No production DB, deploy, or provider integration without a new approval packet.

### Operator signoff — Sandbox lane

| Field | Value |
| --- | --- |
| Approved to begin sandbox **implementation** | ☐ Yes ☐ No |
| Approved branch/lane name | |
| Approved module subset (if partial) | |
| Operator name | |
| Date | |

---

## Lane 4: Sister Schema Harvest

**Ticket anchor:** `SOPHEX-X0-001` — Read-only sister schema diff and classification packet.

**Purpose:** Harvest schema **concepts** from a stabilized sister project into Sophex contract docs — not to copy tables or run migrations.

**Gate status:** Closed per [SISTER_SCHEMA_BORROWING_GATE.md](SISTER_SCHEMA_BORROWING_GATE.md).

### Preconditions checklist

| Precondition | Confirmed |
| --- | --- |
| Sister project declares schema stable enough for review | ☐ |
| Repository identity, branch, HEAD commit recorded | ☐ |
| Source checkout is clean (no dirty worktree) | ☐ |
| Read-only harvest scope confirmed by operator | ☐ |
| No production credentials or DB shells will be used | ☐ |
| Sophex contract docs are current (evidence, architecture, security gates) | ☐ |

### Source inventory (fill before harvest)

| Field | Value |
| --- | --- |
| Sister repository path | |
| Branch | |
| HEAD commit | |
| Clean status (`git status --porcelain` empty?) | ☐ |
| Schema file paths identified | |
| API contract paths identified | |
| Harvest agent / operator | |

### Classification deliverables

Each harvested concept must produce a diff row using the template in [SISTER_SCHEMA_BORROWING_GATE.md](SISTER_SCHEMA_BORROWING_GATE.md) § Diff Packet Template:

- Source path and commit
- Source concept name → Sophex target concept
- Classification: reuse | adapt | exclude | open question
- Visibility, source-rights, export, and idempotency impact
- Required tests (future)
- Approval status

### Concepts likely to reuse or adapt

- Property identity and public baseline references
- Document evidence identity and file-reference authority
- Source observations and extracted spans
- Review/promotion/supersession state
- Idempotency and correlation identifiers
- Redacted operational receipts
- Comp source, confidence, provider-rights metadata
- Report section review and export blocker patterns

### Concepts that must not be copied blindly

- Internal operator roles as public marketplace roles
- Production-only tables or private user data
- Raw logs, queue states, worker IDs, provider payloads
- Migration history, seed data, generated clients

### Operator signoff — Schema harvest lane

| Field | Value |
| --- | --- |
| Approved to run read-only schema harvest | ☐ Yes ☐ No |
| Approved sister repo / branch / commit | |
| Approved to produce diff packet only (no Sophex schema edits) | ☐ Yes ☐ No |
| Operator name | |
| Date | |

### Operator signoff — Schema implementation (separate gate)

| Field | Value |
| --- | --- |
| Approved to implement Sophex schema/migrations | ☐ Yes ☐ No |
| Approved wave(s) from [SOPHEX_SCHEMA_WAVE_ROADMAP_2026-05-22.md](roadmap/SOPHEX_SCHEMA_WAVE_ROADMAP_2026-05-22.md) | |
| DB provider and migration tool approved | |
| Operator name | |
| Date | |

---

## Lane Coordination Rules

1. **Prototype lane may proceed in parallel** with approval-packet updates; it must not implement sandbox servers or schema tools.
2. **Sandbox lane may start** only after sandbox signoff; it should consume contract simulators, not sister schema tables directly.
3. **Schema harvest lane may start** only after sister stability and harvest signoff; output is a diff packet, not migrations.
4. **Schema implementation** requires a second signoff after diff packet review and security gate updates.
5. **Composer agents** should refuse tasks that cross lanes without a signed row in this packet.

## Composer Ticket Stubs (Gated — Do Not Implement Without Signoff)

### SOPHEX-S0-001 — Sandbox HTTP harness shell

**Objective:** Scaffold a local-only sandbox API server with actor context middleware and health route.

**Forbidden until:** Sandbox operator signoff above.

**First tests when approved:** Anonymous actor cannot read private observations; idempotency replay returns same receipt.

### SOPHEX-X0-001 — Sister schema read-only harvest

**Objective:** Produce classified diff packet from approved sister checkout.

**Forbidden until:** Schema harvest operator signoff above.

**Deliverable:** Markdown diff packet linked from [HARVEST_PACKET_INDEX.md](HARVEST_PACKET_INDEX.md); zero Sophex runtime/schema file edits during harvest.

---

## Revision Log

| Date | Change |
| --- | --- |
| 2026-05-25 | Initial consolidated approval packet for sandbox and sister-schema gated lanes. |
