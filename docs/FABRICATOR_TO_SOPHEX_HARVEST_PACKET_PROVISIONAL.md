# FABRICATOR_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL

> **Superseded by [FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md](FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md).** This provisional packet remains archive-only because it was generated from a dirty Fabricator checkout.

> **This packet is provisional.** It was generated from `C:\Projects\finem_factory_mvp` while that checkout was on `main` at `origin/main`, but the working tree was dirty from memory-bank edits and untracked audit/closeout docs. Use as workflow/control-plane doctrine, not as a clean authoritative repo inventory, until rerun from a clean Fabricator checkout.

**Mode:** `FABRICATOR_TO_SOPHEX_READ_ONLY_HARVEST` (provisional)  
**Source:** `C:\Projects\finem_factory_mvp`  
**Harvest date:** 2026-05-22  
**Status:** Workflow/control-plane doctrine only. **Not authoritative.** No runtime coupling.

---

## Provenance And Trust Level

| Check | Result at harvest time |
| --- | --- |
| Path | `C:\Projects\finem_factory_mvp` |
| Branch | `main` |
| HEAD | `89b2a651a` |
| HEAD == origin/main | **Yes** |
| Clean | **No** — dirty `memory-bank/` + untracked audit/closeout docs |
| Collision posture | Workflow/agent doctrine only; Fabricator does not own marketplace truth |

### Dirty paths on source checkout (inventory trust caveat)

**Modified tracked (memory-bank):**
- `memory-bank/activeContext.md`
- `memory-bank/progress.md`
- `memory-bank/systemPatterns.md`

**Untracked:**
- `docs/audits/FINEM_FRONTEND_TOOLING_QUALITY_SCORECARD_2026-05-21.md`
- `docs/closeouts/FINEM_FRONTEND_TOOLING_QUALITY_SCORECARD_2026-05-21.md`

**Not dirty at harvest:** schema, migrations, package locks, deploy configs, `.env*`.

---

## 1. Fabricator Executive Takeaway For Sophex

### Best ideas to borrow (directional)

1. **Control-plane doctrine** — visible workflow state without exposing raw queue internals to public users.
2. **Evidence envelopes** — structured wrappers around agent outputs until HITL review; redaction-first where needed.
3. **Source adapter pattern** — governed ingestion paths; outputs remain candidates.
4. **HITL handler** — human authority layer before promotion or publication.
5. **Analysis OS / AnalysisResponse-style contracts** — structured report output with confidence, warnings, citations, `reviewRequired`.
6. **Job status projection** — user-safe phase timelines, not raw run logs.
7. **Audit/correlation receipts** — idempotency keys, correlation IDs, replay-safe governed actions.
8. **Failure/cost/retry/blocked states** — explicit handling for expensive scanned docs and blocked sources.
9. **Agent role separation** — classifier, extractor, scorer, report generator, moderator, receipt writer as bounded roles.
10. **Mission control inspiration** — operator dashboards for review queues (not MVP0 public shell).

### Unsafe until gates clear

1. Letting Fabricator own Sophex marketplace truth or canonical observations.
2. Treating **queue completion** or job success as evidence promotion.
3. Provider/send automation from Fabricator patterns.
4. Copying Fabricator runtime queues, SSE streams, or operator cockpits into public Sophex UI.
5. Auto-ban or auto-publication from moderation agents.
6. Simulated/fake progress bars not tied to real phase transitions.
7. Connecting Sophex to Fabricator remotes or runtime from docs lane.

---

## 2. Control-Plane And Agent Patterns

| Pattern | Source path (provisional) | Sophex adaptation |
| --- | --- | --- |
| Control plane overview | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Future operator review queue UX |
| Evidence toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Evidence envelope + receipt doctrine |
| Analysis OS | `src/lib/analysis-os/` | AnalysisResponse-style report contracts |
| Mission control UI | `mission_control_bridge/templates/index.html` | Internal moderation inspiration only |
| HITL handler | Agent workflow patterns (conceptual) | Required before public/export use |
| Job projection | Workflow status patterns | Public-safe progress labels only |

---

## 3. Agent Roles For Sophex (Future-Gated)

| Agent | Borrow | Gate |
| --- | --- | --- |
| Ingestion classifier | Clean vs scanned path, cost tier, source type | Review before extraction on blocked/risky docs |
| Evidence extractor | Candidate observations with spans | Not canonical truth |
| Valuation report generator | White-label assembly from approved inputs | Export requires HITL; warnings/citations required |
| Source confidence scorer | Freshness/dispute labels | Cannot bypass permissions |
| HITL reviewer | Accept/reject/supersede | Human authority |
| Moderation assistant | Queue signals only | No auto-ban in MVP |
| Audit/correlation receipt writer | Idempotent governed-action receipts | Fail-closed on duplicate/replay |
| Background job status projector | Safe user timelines | No queue names or raw logs to public |

---

## 4. Critical Boundaries

- Fabricator **process inspiration only** — Sophex owns marketplace UX and trust boundary.
- Agent outputs = candidates until reviewed and permissioned.
- Queue/worker completion ≠ observation promotion.
- Public UI shows **JobStatusProjection**, not Fabricator run internals.
- No Fabricator runtime build, queue launch, or provider send in setup phase.

---

## 5. AnalysisResponse-Style Report Doctrine (Conceptual)

Future Sophex reports should inherit Fabricator Analysis OS shape conceptually:

- Structured sections with typed outputs.
- **confidence** — evidence coverage, not model bravado.
- **warnings** — stale data, missing comps, scan quality, permission limits.
- **citations** — links to permitted evidence only.
- **reviewRequired** — boolean or tier indicating HITL gate before export/public use.

No headline valuation without evidence, citations, and review state visible.

---

## 6. File Path Appendix

| Area | Path | Why Sophex should reference it |
| --- | --- | --- |
| Control plane | `docs/context/FINEM_FABRICATOR_CONTROL_PLANE_OVERVIEW.md` | Workflow visibility doctrine |
| Evidence toolkit | `agents/DatabaseEvidenceToolkit_MCP/` | Envelope and receipt patterns |
| Analysis OS | `src/lib/analysis-os/` | Report/analysis contracts |
| Mission control | `mission_control_bridge/templates/index.html` | Operator UI inspiration |
| Ops hub UI (minimal) | `ops_hub_app/ui/components/ui/` | **Not** Sophex public default — CRE is richer |

Paths relative to `C:\Projects\finem_factory_mvp`. Verify on clean checkout before implementation.

---

## 7. Differences From Authoritative Packet

| Aspect | This provisional packet | Authoritative packet |
| --- | --- | --- |
| Status | Directional doctrine | **Not yet produced** — requires clean Fabricator checkout |
| HEAD vs origin | Matched at harvest | Must re-verify |
| Working tree | Dirty memory-bank + audit docs | Requires clean tree |
| Path inventory | May miss untracked operator surfaces | Must be re-verified |

When authoritative harvest succeeds, diff against future `FABRICATOR_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md`.

---

## Final Recommendation

Use Fabricator for **workflow, HITL, job projection, evidence envelope, and AnalysisResponse-style report doctrine**. Never let Fabricator completion events become Sophex canonical truth. Rerun harvest from clean Fabricator checkout before implementation or contract hardening.
