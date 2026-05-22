# FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE

> **Authoritative Fabricator source archive.** This packet was generated read-only from the clean clone at `C:\Projects\finem_factory_mvp_clean` on `main` with `HEAD == origin/main` and a clean working tree.
>
> This packet supersedes the provisional Fabricator packet generated from dirty `C:\Projects\finem_factory_mvp`. It is still **docs-only doctrine** for Sophex and does not authorize Fabricator runtime coupling, queues, provider/send, package installs, deploys, schema, migrations, production DB access, or copying Fabricator source code.

**Mode:** `SOPHEX_AUTHORITATIVE_FABRICATOR_HARVEST` / `DOCS_ONLY`  
**Harvest date:** 2026-05-22  
**Fabricator source path:** `C:\Projects\finem_factory_mvp_clean`  
**Fabricator branch:** `main`  
**Fabricator HEAD:** `89b2a651a928a2d8cc1c80fba65f0861fc509e09`  
**Fabricator origin/main:** `89b2a651a928a2d8cc1c80fba65f0861fc509e09`  
**Clean confirmation:** `git status --short --branch --untracked-files=all` returned `## main...origin/main` only.

---

## 1. Fabricator Executive Takeaway For Sophex

Finem Fabricator is a **cross-plane control-plane discipline**, not a Sophex or CRE data owner. It coordinates agent work, evidence gathering, gates, HITL review, receipts, and report artifacts. Sophex should inherit the process language and guardrails while keeping marketplace truth, public permissions, reports, and publication policy inside Sophex/CRE contracts.

### Concepts Sophex should inherit

1. **Cross-plane control, not ownership collapse** — Fabricator coordinates; domain products own truth.
2. **Evidence-first gate movement** — no "done" without evidence, tests, route contracts, probes, or schema-validated artifacts.
3. **Fail-closed governance** — missing idempotency, correlation, tenant scope, policy version, or evidence denies execution.
4. **Evidence Envelope v1** — source records carry kind/ref/run/redaction/hash/provenance/blocked-actions metadata.
5. **AnalysisResponse-style report contract** — confidence, warnings, citations, `reviewRequired`, and review reasons are first-class.
6. **HITL as authority boundary** — review outputs recommend/reject/hold; promotion/execution remains separate.
7. **Append-only audit and idempotent mutation ledgers** — replay-safe governed actions with correlation IDs.
8. **Bridge/projection envelopes** — cross-plane payloads carry pointers, digests, evidence refs, and audit receipt refs, not raw tenant payloads.
9. **Operator surfaces separate from public UX** — Broker OS Console/Ops Hub patterns inspire internal review, not contributor UI.
10. **Manual vs evidence-derived status separation** — manual release judgment and automatic evidence status stay distinct.

### Things Sophex must not copy directly

1. Fabricator runtime queues, BullMQ job internals, workers, or provider/send infrastructure.
2. Queue completion as canonical evidence promotion.
3. Raw AXIS/BullMQ status (`waiting`, `active`, `completed`, `failed`) as public status.
4. Database Evidence Toolkit live paths; it is local/fixture-oriented and blocks live DB/MotherDuck/R2/Railway actions.
5. Autonomous promotion from review packets.
6. Mission Control Bridge stubs as production operator UI.
7. Fabricator monorepo topology as Sophex architecture.
8. CRE-first v0 charter assumptions wholesale.
9. Taskmaster nested `AGENTS.md` as Fabricator product doctrine.
10. Speculative unified Fabricator cockpit as current baseline.

---

## 2. Workflow / Control-Plane Patterns

| Pattern | Fabricator source path(s) | What it does | Sophex adaptation | What not to copy |
| --- | --- | --- | --- | --- |
| Control plane overview | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Separates business domain, control plane, and proof surfaces | Keep Sophex public product, operator review, and evidence proof surfaces distinct | Do not make Fabricator the marketplace source of truth |
| Two-product doctrine | `docs/blueprints/TWO_PRODUCT_DOCTRINE.md` | Engine vs vehicle separation; API boundary only | Sophex may consume future services through versioned APIs/contracts | No shared DB or direct runtime import |
| Evidence pack gates | `docs/agent-factory/evidence-pack-spec.md`; `scripts/validate_evidence_pack.py` | Validated proof artifacts before gate movement | Require evidence before approving harvest/prototype/implementation claims | No "trust me" gate movement |
| Evidence v1 | `docs/agent-factory/evidence-spec-v1.md`; `docs/agent-factory/evidence-v1.schema.json` | Append-only events, hash chain, correlation, idempotency | Use conceptual evidence chains for governed workflows | No raw secrets or tenant payloads in evidence |
| Governance context | `apps/core/lib/bootstrap/governance.ts`; `apps/core/lib/bootstrap/repository.ts` | Requires org/actor/correlation/idempotency for mutations | Future Sophex governed actions need same envelope | No mutation without scoped context |
| Skill job approvals | `apps/core/lib/skills/jobs.ts`; `apps/core/lib/skills/approval.ts` | Queue skill jobs with approval/audit/idempotency | Operator-only moderation and export actions | No public queue internals |
| CRE bridge envelope | `docs/runbooks/CRE_READONLY_BRIDGE_ENVELOPE_CONTRACT_2026-05-20.md` | Cross-plane event envelope with correlation, evidence refs, payload digest | Future CRE/Sophex bridge should carry pointers and receipts only | No raw payload replication |
| Database Evidence Toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Local source adapters, envelopes, review packets, promotion policy | Redaction-first evidence wrapper and candidate workflow | No live DB/R2/provider integration in setup |
| Analysis OS | `src/lib/analysis-os/contracts.ts`; `src/lib/analysis-os/*/service.ts` | Structured analysis responses with HITL signals | Report artifact contract and export gate input | No direct analysis runtime import |
| Operator console | `docs/broker-os/console.md`; `src/app/broker-os/console/page.tsx`; `ops_hub_app/ui/components/HITLModal.tsx` | Read-only operator status/review surfaces | Internal moderation/review queue inspiration | Not public contributor UI |

---

## 3. Agent Role Boundaries

| Fabricator role/system | Owns | Sophex should borrow | Must not own in Sophex |
| --- | --- | --- | --- |
| Enhanced Orchestrator | Mission/business orchestration, HITL planning API | Routing and orchestration concepts | Marketplace truth or publication authority |
| Taskmaster | Workflow DAG, locks, task state | Explicit task/run boundaries | Sophex facts or comp promotion |
| Agent Registry | Capability/routing metadata | Capability catalog doctrine | Permission or approval authority by itself |
| AgentBuilder | Build/review/deploy lifecycle | Review history and promotion gates | Sophex runtime deployment from docs lane |
| AXIS / BullMQ | Operational/diagnostic jobs | Operator-only status source | Public status or evidence promotion |
| Database Evidence Toolkit | Local evidence packets and redacted envelopes | Evidence envelope and source adapter pattern | DB writes, provider sends, promotion execution |
| Broker OS / Skills | Governed skill catalog, jobs, approvals | Approval/audit/idempotency patterns | Unscoped public actions |
| Analysis OS | CRE analysis compute and report response shape | AnalysisResponse-style report artifact | Mutating data or public export authority |
| Ops Hub / MCB | Human operator UI | Internal moderation and HITL inspiration | Public Sophex shell |

---

## 4. Evidence Envelope / Redaction Patterns

Fabricator evidence doctrine centers on `database-evidence-envelope/v1` from `agents/DatabaseEvidenceToolkit_MCP/evidence_envelope.py` and runbooks:

- Required: `source_kind`, `source_ref`, `run_id`, `extraction_method`, `redaction_status`, `sensitivity_class`, `sha256`.
- Allowed redaction posture is metadata/synthetic/fixture oriented: `redacted_or_metadata_only`, `fixture_redacted`, `synthetic_only`.
- Default blocked actions include live DB, MotherDuck, R2, Railway, DockerHub, CRE writes, contact creation, promotion, provider/send/queue/campaign.
- Source adapter outputs include `source_records`, `source_mentions`, `source_relationship_hints`, and `source_manifest`.
- Bridge payloads carry `correlation_id`, `idempotency_key`, `audit_receipt_ref`, `evidence_refs`, and `payload_digest`.

**Sophex adaptation:** every uploaded source, extracted candidate, review packet, report generation, public export, and contribution acceptance should have a redaction/source-use envelope. Public UI sees sanitized phases and refs, not raw rows, secrets, worker logs, queue names, or internal payloads.

---

## 5. AnalysisResponse / Report Artifact Contract

`src/lib/analysis-os/contracts.ts` defines an `AnalysisResponse<TResult>` shape Sophex can borrow conceptually:

| Field | Purpose for Sophex |
| --- | --- |
| `ok` | Successful analysis path marker |
| `kind` | Invocation/report type |
| `generatedAt` | Report artifact timestamp |
| `confidence` | Evidence coverage and agreement, not model bravado |
| `reviewRequired` | HITL/export/publication gate |
| `reviewReasons` | Machine-readable reasons such as sparse comps, low confidence, supervised policy, risk flags |
| `warnings` | Human-readable caveats |
| `citations` | Permitted evidence identifiers |
| `result` | Typed domain payload |

Fabricator confirms that most high-impact analysis services either always require review or set `reviewRequired` when confidence/reason conditions fail. Sophex should treat all generated valuation/report outputs as candidates until review, source-use, permission, and export gates clear.

---

## 6. HITL / ReviewDecision

Fabricator clean harvest clarifies that Database Evidence Toolkit review packets use **`recommend`**, **`reject`**, and **`hold`** — not `approve` — and do not grant execution authority.

Sophex should split:

- **ReviewDecision** — human/operator opinion or decision record (`recommend`, `reject`, `hold`, or Sophex-specific accepted private/public states after product/legal design).
- **PromotionAuthority** — separate gate that can publish, export, syndicate, or promote only after source-use, visibility, idempotency, audit, and operator approval pass.
- **BlockedAction** — explicit reason an action cannot proceed.

Timeouts fail closed. Missing audit/correlation/idempotency blocks downstream export/promotion.

---

## 7. JobStatusProjection / Status UI

`JobStatusProjection` is **not** a named Fabricator type. It is a Sophex-facing concept inspired by Fabricator’s operator status surfaces:

- AXIS job routes expose BullMQ state for signed internal/operator users.
- Skill jobs emit queued/audit/evidence routes.
- Planning sessions expose operator HITL state.
- Broker OS Console surfaces doctor/status/inventory coverage read-only.
- CRE bridge envelopes carry status and freshness on projections.

Sophex should design `JobStatusProjection` as a sanitized public/contributor layer: `uploaded -> analyzing -> awaiting review -> ready/blocked`, with no queue names, worker IDs, DLQ internals, stack traces, raw logs, or provider details.

---

## 8. AuditReceipt / Idempotency / Correlation

Fabricator patterns:

- Governance context requires `orgId`, actor, `correlationId`, and `idempotencyKey`.
- Idempotency ledger key is effectively `(orgId, idempotencyKey)`.
- Same key + same request hash returns prior response.
- Same key + different payload fails closed.
- Evidence v1 requires top-level and stage-event correlation to match.
- Bridge envelopes include `audit_receipt_ref`; unified AuditReceipt is a candidate concept rather than a single shipped type.

Sophex should keep `AuditReceipt` conceptual until product/legal/CRE contracts define retention, redaction, public support visibility, and replay behavior.

---

## 9. Mission Control / Operator UI Caveats

- `mission_control_bridge/README.md` and related user guide are stubs, not current operator truth.
- `docs/broker-os/console.md` and Broker OS Console are better current operator references.
- Ops Hub must use Factory public APIs only; no shared DB.
- HITL modal patterns are operator-only inspiration.
- Business domain surfaces, control-plane surfaces, and proof surfaces must remain visibly distinct.

Do not copy Fabricator mission control, raw run logs, queues, SSE streams, or operator cockpit chrome into Sophex MVP0 public/contributor UX.

---

## 10. File Path Appendix

| Area | Fabricator clean source path | Notes |
| --- | --- | --- |
| Control plane | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Current truth vs horizon; control-plane doctrine |
| Two-product doctrine | `docs/blueprints/TWO_PRODUCT_DOCTRINE.md` | Engine vs vehicle separation |
| Execution charter | `docs/adr/ADR-v0-execution-charter.md` | v0 gate discipline |
| Staging lake ADR | `docs/adr/ADR-database-evidence-toolkit-staging-lake.md` | T0-T5 evidence/promotion boundaries |
| Memory bank patterns | `memory-bank/systemPatterns.md` | Evidence-first gate movement, idempotency, manual/auto status |
| Evidence spec | `docs/agent-factory/evidence-spec-v1.md` | Event/correlation/idempotency proof format |
| Evidence pack spec | `docs/agent-factory/evidence-pack-spec.md` | Evidence gate packages |
| Evidence toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Envelopes, adapters, review decisions, promotion policy |
| Envelope runbook | `docs/runbooks/DATABASE_TOOLKIT_SOURCE_ADAPTER_EVIDENCE_ENVELOPE_2026-05-16.md` | Source adapter envelope doctrine |
| CRE bridge contract | `docs/runbooks/CRE_READONLY_BRIDGE_ENVELOPE_CONTRACT_2026-05-20.md` | Read-only bridge envelope |
| Analysis OS contracts | `src/lib/analysis-os/contracts.ts` | AnalysisResponse shape |
| Analysis OS services | `src/lib/analysis-os/*/service.ts` | Comps, underwriting, BPO/BOV/portfolio report patterns |
| Governance runtime | `apps/core/lib/bootstrap/governance.ts`; `apps/core/lib/skills/jobs.ts`; `apps/core/lib/skills/approval.ts` | Governance context and skill job approval/idempotency patterns |
| AXIS queues | `src/api/axis/queues.ts`; `src/app/api/axis/jobs/[jobId]/route.ts` | Internal/operator job state only |
| Broker OS console | `docs/broker-os/console.md`; `src/app/broker-os/console/page.tsx` | Read-only operator console reference |
| Ops Hub HITL | `ops_hub_app/ui/components/HITLModal.tsx` | Operator HITL modal inspiration only |
| Integration audit | `docs/audits/FINEM_CRE_INTEGRATION_ALIGNMENT_AUDIT_2026-05-20.md` | Alignment and audit receipt caveats |
| Cursor rules | `.cursor/rules/*.mdc` | Agent behavior and security protocol; not Sophex product doctrine |

---

## 11. Differences From Prior Provisional Fabricator Packet

| Area | Provisional packet | Authoritative clean harvest |
| --- | --- | --- |
| Source path | `C:\Projects\finem_factory_mvp` | `C:\Projects\finem_factory_mvp_clean` |
| Cleanliness | Dirty memory-bank + untracked audit/closeout docs | Clean `main`, `HEAD == origin/main` |
| JobStatusProjection | Named as if Fabricator type | Confirmed as Sophex concept inspired by Fabricator status surfaces |
| ReviewDecision | Generic accepted/rejected/superseded language in Sophex docs | Fabricator toolkit uses `recommend` / `reject` / `hold`; promotion authority is separate |
| Mission control | Mission control UI listed as direct reference | Mission Control Bridge docs are stubs; Broker OS Console is stronger operator reference |
| Analysis OS | Conceptual reference | Confirmed contracts and services exist; response includes `reviewRequired`, warnings, citations |
| Evidence toolkit | Generic reference | Confirmed Evidence Envelope v1, source adapters, review packet, promotion policy, CRE bridge envelope |
| AuditReceipt | Listed conceptually | Confirmed partial: audit events and `audit_receipt_ref`; unified AuditReceipt remains candidate concept |
| Agent roles | Sophex future agents | Fabricator system roles (EO, Taskmaster, Registry, AXIS, AgentBuilder) map conceptually but should not be copied 1:1 |

---

## Final Recommendation

Use this packet as the **current Fabricator source archive** for Sophex workflow/control-plane doctrine. Keep Fabricator as process inspiration only. Sophex should define its own public-safe `JobStatusProjection`, `ReviewDecision`, `AuditReceipt`, and `ReportArtifact` contracts before any runtime or implementation work.
