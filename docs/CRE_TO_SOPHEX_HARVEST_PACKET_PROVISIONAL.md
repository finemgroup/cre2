# CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL

> **This packet is provisional.** It was generated from `C:\Projects\cre-platform-erofs-master-landing` while that checkout was on branch `agent/03-operating-lens-navigation`, dirty, 758 commits behind `origin/master`, and not suitable as CRE control-panel truth. Use for directional doctrine only until rerun from clean CRE `master`.
>
> An authoritative harvest (`CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE`) was **not executed** — preconditions failed (`STOP_FOR_CONTROL_PANEL_STATE` on 2026-05-22).

**Mode:** `CRE_TO_SOPHEX_READ_ONLY_HARVEST` (provisional)  
**Source:** `C:\Projects\cre-platform-erofs-master-landing`  
**Harvest date:** 2026-05-22  
**Status:** Directional doctrine only. No edits to CRE. No runtime coupling. **Not authoritative.**

---

## Provenance And Trust Level

| Check | Result at harvest time |
| --- | --- |
| Path | `C:\Projects\cre-platform-erofs-master-landing` |
| Branch | `agent/03-operating-lens-navigation` (**not `master`**) |
| HEAD | `48d7e5f910` |
| origin/master | `8ab69a1b24` |
| HEAD == origin/master | **No** — 758 commits behind |
| Clean | **No** — 7 modified + 6 untracked |
| Authoritative rerun | **Blocked** — clean `master` checkout required |

### Dirty paths on source checkout (contaminate trust)

**Modified tracked:**
- `apps/core/app/api/entities/graph/neighborhood/route.ts`
- `apps/core/app/api/entities/graph/nodes/route.ts`
- `apps/core/app/api/relationships/graph/shortest-path/route.ts`
- `apps/core/app/api/relationships/graph/warm-intro/route.ts`
- `apps/core/components/navigation/PersistentMainMenu.tsx`
- `apps/core/components/workspace/WorkspaceSwitcher.tsx`
- `apps/core/lib/workflows/builder/rbac.ts`

**Untracked:**
- `apps/core/__tests__/graph/dialer-graph-degraded.test.ts`
- `apps/core/__tests__/navigation/workspace-switcher.test.tsx`
- `apps/core/__tests__/workflows/workflow-builder-rbac.test.ts`
- `apps/core/app/marketing/page.tsx`
- `apps/core/app/marketing/content-studio/page.tsx`
- `apps/core/app/marketing/signage-hub/page.tsx`

**Not dirty at harvest:** `prisma/`, migrations, package locks, deploy configs, `.env*`.

---

## 1. CRE Executive Takeaway For Sophex

### Best ideas to borrow (directional)

1. **Relationship truth doctrine** — notes, comments, audit events, evidence records, and observations remain distinct feeds.
2. **Source observation ledger** — append-only observations with visibility, not mutable global field truth.
3. **Document evidence identity** — `documents.file_ref` style references; bytes in storage, identity in governed record.
4. **Evidence envelopes** — structured provenance around extracted values and report claims.
5. **Operational receipts** — idempotency keys, correlation IDs, replay-safe audit references for upload/review/export.
6. **HITL review taxonomy** — unreviewed, needs evidence, conflicting, accepted, rejected, blocked, superseded.
7. **BOV/UW report patterns** — section cards, section approval, export gate, provenance summary, SHA-256 on export.
8. **Shell vs workstation** — lightweight public shell vs authenticated operator/workspace shell.
9. **Authority labels** — public baseline, reviewed, unreviewed, stale, disputed, blocked, promoted, model-inferred.
10. **Permission-filtered retrieval** — search, panels, reports, exports, and future APIs filter at query layer.

### Unsafe until gates clear

1. Direct CRE production DB reads/writes from Sophex.
2. Copying `prisma/schema.prisma` or internal evidence tables into Sophex.
3. Exposing internal CRE comps or private operator evidence to public Sophex users.
4. Importing full operator shell (Jarvis, dialer, gamification, PersistentMainMenu).
5. Treating CRE internal roles as public marketplace roles.
6. Raw operational logs or receipt internals on public surfaces.
7. Autonomous approve/reject underwriting UX (`components/sophex/ai/AIUnderwritingInterface.tsx` tone).
8. Treating **this provisional packet** as schema or API truth.

---

## 2. Schema / Data Concepts To Borrow Conceptually

**Conceptual only — not verified against current `origin/master`. Do not treat as authoritative schema.**

| Concept | CRE reference (provisional) | Sophex adaptation |
| --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Separate audit, activity, evidence, narrative feeds |
| Source observations | Evidence/observation architecture | Permissioned field resolution per actor |
| Document evidence | `documents.file_ref`, evidence registry | `DocumentEvidence` conceptual contract |
| Idempotency/correlation | Operational receipts in workflows | Export/upload/review receipt contract |
| Comp intelligence | Comp candidate vs resolved set | `CompCandidate` / `ResolvedCompSet` contracts |
| Chunks/embeddings | Retrieval sidecars | Never canonical business truth |
| BOV export gate | `BOVExportCard`, `BOVSectionCard` | Report export disabled until review + consent |

**Deferred until clean master harvest:** full conceptual inventory of `prisma/schema.prisma`, `packages/shared-types/**`, comp intelligence docs.

---

## 3. Frontend / UX Concepts

| Pattern | Source path (provisional) | Sophex use |
| --- | --- | --- |
| Source citation | `apps/core/components/ui/source-citation.tsx` | Inline evidence links |
| Provenance cell | `apps/core/components/data-studio/ProvenanceCell.tsx` | Table trust micro-UI |
| Provenance modal | `apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` | Field-level drill-down |
| BOV provenance/export | `apps/core/components/bov/BOVProvenanceCard.tsx`, `BOVExportCard.tsx` | Report chain + export gate |
| Public shell | `apps/core/components/providers/RootProviders.tsx` | Lightweight public vs workspace |
| TopBar / nav | `apps/core/components/navigation/TopBar.tsx`, `PersistentMainMenu.tsx` | **Simplify for Sophex** — do not copy operator nav |
| Command palette | `apps/core/components/navigation/UniversalCommandPalette.tsx` | Future-gated; permission-filter |
| Non-production banner | `apps/core/components/surfaces/NonProductionReportingBanner.tsx` | MVP0 stub labeling |

**Caveat:** `PersistentMainMenu.tsx` was **modified WIP** on source checkout — behavior may not match `origin/master`.

See also: [UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md) (same stale CRE source; also provisional).

---

## 4. Motion / Interaction / Visual Language

Provisional reference: `apps/core/lib/motion-tokens.ts`, `PageTransitionShell.tsx`, `RouteProgressBar.tsx`.

- Restrained motion tiers (execution ~120ms, review ~220ms).
- Reduced-motion fallback required.
- No gamification/celebration overlays for Sophex.
- Trust visualization via badges, provenance drawers, confidence sublabels.

Full catalog in `UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md` — treat as provisional until clean master rerun.

---

## 5. API / Contract Ideas For Future Sophex

Future-gated alignment concepts (not verified on current master):

- Governed document evidence API with `file_ref` and source-use policy metadata.
- Source observation read/write contracts with visibility and review state.
- Comp candidate submission and resolved comp set retrieval (permission-filtered).
- Operational receipt endpoints for upload, review, report generation, export.
- Idempotency keys and correlation IDs on governed mutations.

**Do not implement** from this packet without clean-master verification and CRE alignment approval.

---

## 6. Security / Privacy / Trust Warnings

1. **Provisional only** — 758 commits of drift may change governance, auth, and evidence models on `origin/master`.
2. **Dirty WIP** — graph API and navigation changes may not represent CRE baseline.
3. **No public exposure** of CRE internal document evidence or operator comps.
4. **Query/API permission filtering** required — UI hiding is not security.
5. **No schema copy** from stale `prisma/schema.prisma` snapshot.
6. All implementation future-gated.

---

## 7. File Path Appendix

| Area | Path | Notes |
| --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Verify exists on clean master |
| Root providers | `apps/core/components/providers/RootProviders.tsx` | Shell split |
| Source citation | `apps/core/components/ui/source-citation.tsx` | Inline evidence |
| Provenance UI | `ProvenanceCell.tsx`, `ProvenanceModal.tsx` | Trust drill-down |
| BOV patterns | `apps/core/components/bov/` | Report review/export |
| Sophex stub | `apps/core/components/sophex/ai/AIUnderwritingInterface.tsx` | Reframe as valuation preview |
| UX assessment | `apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Scope warning |
| Schema (conceptual) | `prisma/schema.prisma` | **Do not copy** — verify on clean master |

Paths relative to `C:\Projects\cre-platform-erofs-master-landing`.

---

## 8. Differences From Authoritative Packet

| Aspect | This provisional packet | Authoritative packet |
| --- | --- | --- |
| Status | Directional doctrine | **Not produced** (`STOP_FOR_CONTROL_PANEL_STATE`) |
| Branch | `agent/03-operating-lens-navigation` | Requires clean `master` |
| Staleness | 758 behind `origin/master` | Requires `HEAD == origin/master` |
| Dirty tree | Yes | Requires clean |
| Schema inventory | Hypothesis | Must be re-verified |
| Contradictions | Unknown vs current master | Unresolved until rerun |

When authoritative harvest succeeds, diff this file against `CRE_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE.md` (to be created) and update Sophex alignment docs.

---

## 9. Recommended Sophex Doc Updates (When Authoritative Harvest Lands)

- Replace or supersede this file with authoritative packet.
- Update `docs/CRE_PLATFORM_ALIGNMENT.md` with verified paths and concepts.
- Update `docs/CROSS_PROJECT_HARVEST.md` — remove provisional caveat or mark superseded.
- Update `docs/HARVEST_PACKET_INDEX.md` with authoritative HEAD hash and date.
- **Do not** update `docs/FUTURE_SCHEMA_CONCEPTS.md` from this provisional packet as authoritative.

---

## Final Recommendation

Use this packet for **directional Sophex planning only**. Borrow governance, evidence, audit, BOV export discipline, and provenance UX **doctrine**. Do not copy runtime, schema, operator shell, or production data. **Rerun harvest from clean CRE `master` before any implementation or schema contract hardening.**
