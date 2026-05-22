# FABRICATOR_TO_SOPHEX_HARVEST_PACKET

> **Superseded for trust purposes by [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** — this file is an earlier draft from the same dirty-tree Fabricator checkout. Use the provisional packet until authoritative clean-checkout harvest exists.

**Mode:** `FABRICATOR_TO_SOPHEX_READ_ONLY_HARVEST`  
**Source:** `C:\Projects\finem_factory_mvp`  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. No edits to Fabricator. No runtime coupling.

---

## Location Check

| Check | Result |
| --- | --- |
| Path | `C:\Projects\finem_factory_mvp` |
| Git repo | Yes |
| Branch (at harvest) | `main` |
| HEAD (at harvest) | `89b2a651a` |
| Clean | **No** — dirty memory-bank + untracked audit docs; HEAD == origin/main |
| Assigned lane | Read-only harvest for Sophex docs |
| Collision posture | Workflow/agent doctrine only; Fabricator does not own marketplace truth |

---

## 1. Fabricator Executive Takeaway For Sophex

### Best ideas to borrow

1. **Control-plane doctrine** — visible workflow state without exposing raw queue internals to public users.
2. **Evidence envelopes** — structured wrappers around agent outputs until HITL review.
3. **Source adapter pattern** — governed ingestion paths; outputs remain candidates.
4. **HITL handler** — human authority layer before promotion or publication.
5. **Analysis OS contracts** — report/analysis artifact shapes with evidence appendix concepts.
6. **Job status projection** — user-safe timelines: uploaded → scanning → extracting → reviewing → ready.
7. **Audit receipts** — correlation and idempotency for replay-safe operations.
8. **Failure/cost/retry/blocked states** — explicit handling for expensive scanned docs and blocked sources.
9. **Agent role separation** — classifier, extractor, scorer, report generator, moderator as distinct bounded roles.
10. **Mission control inspiration** — operator dashboards for review queues (not MVP0 public shell).

### Unsafe until gates clear

1. Letting Fabricator own Sophex marketplace truth or canonical observations.
2. Treating **queue completion** or job success as evidence promotion.
3. Provider/send automation from Fabricator patterns.
4. Copying Fabricator runtime queues into Sophex.
5. Auto-ban or auto-publication from moderation agents.
6. Connecting Sophex to Fabricator remotes or runtime from docs lane.

---

## 2. Control-Plane And Agent Patterns

| Pattern | Source path | Sophex adaptation |
| --- | --- | --- |
| Control plane overview | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Future operator review queue UX |
| Evidence toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Evidence envelope + receipt doctrine |
| Analysis OS | `src/lib/analysis-os/` | Report artifact contracts |
| Mission control UI | `mission_control_bridge/templates/index.html` | Internal moderation inspiration only |
| HITL handler | Agent workflow patterns (conceptual) | Required before public/export use |
| Job projection | Workflow status patterns | Public-safe progress labels only |

---

## 3. Agent Roles For Sophex (Future-Gated)

| Agent | Borrow | Gate |
| --- | --- | --- |
| Ingestion classifier | Clean vs scanned path, cost tier | Review before public use |
| Evidence extractor | Candidate observations with spans | Not canonical truth |
| Valuation report generator | White-label assembly from approved inputs | Export requires HITL |
| Source confidence scorer | Freshness/dispute labels | Cannot bypass permissions |
| HITL reviewer | Accept/reject/supersede | Human authority |
| Moderation assistant | Queue signals only | No auto-ban in MVP |
| Audit/status projector | Safe user timelines | No queue names to public |

---

## 4. Critical Boundaries

- Fabricator **process inspiration only** — Sophex owns marketplace UX and trust boundary.
- Agent outputs = candidates until reviewed and permissioned.
- Queue/worker completion ≠ observation promotion.
- No Fabricator runtime build, queue launch, or provider send in setup phase.

---

## 5. Sophex Doc Updates (Applied)

- `docs/FINEM_FABRICATOR_ALIGNMENT.md`
- `docs/AGENT_WORKFLOW_CONCEPTS.md`
- `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md`
- `docs/DOCUMENT_INGESTION_MODEL.md`
- `DECISIONS.md` (ADR-0019)

---

## 6. File Path Appendix

| Area | Path | Why Sophex should reference it |
| --- | --- | --- |
| Control plane | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Workflow visibility doctrine |
| Evidence toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Envelope and receipt patterns |
| Analysis OS | `src/lib/analysis-os/` | Report/analysis contracts |
| Mission control | `mission_control_bridge/templates/index.html` | Operator UI inspiration |
| Ops hub UI (minimal) | `ops_hub_app/ui/components/ui/` | **Not** primary UX reference — CRE is richer |

---

## Final Recommendation

Use Fabricator for **workflow, HITL, job projection, and evidence envelope doctrine**. Never let Fabricator completion events become Sophex canonical truth. All agent outputs pass through permission and review gates.
