# CRE_TO_SOPHEX_HARVEST_PACKET

> **Superseded for trust purposes by [CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md)** — this file is an earlier draft from the same stale/dirty CRE checkout. Use the provisional packet for Sophex doctrine until authoritative clean-master harvest exists.

**Mode:** `CRE_TO_SOPHEX_READ_ONLY_HARVEST`  
**Source:** `C:\Projects\cre-platform-erofs-master-landing`  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. No edits to CRE. No runtime coupling.

---

## Location Check

| Check | Result |
| --- | --- |
| Path | `C:\Projects\cre-platform-erofs-master-landing` |
| Git repo | Yes |
| Branch (at harvest) | `agent/03-operating-lens-navigation` |
| HEAD (at harvest) | `48d7e5f910` |
| Clean | **No** — modified tracked files; behind `origin/master` |
| Assigned lane | Read-only harvest for Sophex docs |
| Collision posture | Doctrine and contracts only; no schema/runtime copy |

---

## 1. CRE Executive Takeaway For Sophex

### Best ideas to borrow

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

---

## 2. Governance And Evidence Concepts

| Concept | CRE reference | Sophex adaptation |
| --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Separate audit, activity, evidence, and narrative feeds |
| Source observations | Evidence/observation architecture (conceptual) | Permissioned field resolution per actor |
| Document evidence | `documents.file_ref`, evidence registry | `DocumentEvidence` conceptual contract |
| Idempotency/correlation | Operational receipts in governed workflows | Export/upload/review receipt contract |
| Comp intelligence | Internal comp candidate vs resolved set | `CompCandidate` / `ResolvedCompSet` contracts |
| BOV export gate | `BOVExportCard`, `BOVSectionCard` | Report export disabled until review + consent |
| Analysis OS / BOV | `components/bov/*`, underwriting workstations | Evidence-first valuation preview, not credit decision |

---

## 3. UX Patterns To Borrow (Doctrine Only)

| Pattern | Source path | Sophex use |
| --- | --- | --- |
| Source citation | `apps/core/components/ui/source-citation.tsx` | Inline evidence links on reports |
| Provenance cell | `apps/core/components/data-studio/ProvenanceCell.tsx` | Table rows with source/confidence/freshness |
| Provenance modal | `apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` | Field-level “why this value” drawer |
| BOV provenance | `apps/core/components/bov/BOVProvenanceCard.tsx` | Report chain summary |
| Export gate | `apps/core/components/bov/BOVExportCard.tsx` | Disabled export until approved |
| Public shell | `apps/core/components/providers/RootProviders.tsx` | Lightweight public vs workspace shell |
| Non-production banner | `apps/core/components/surfaces/NonProductionReportingBanner.tsx` | MVP0 stub labeling |

See also: `UX_MOTION_TO_SOPHEX_HARVEST_PACKET.md` for full UX/motion catalog.

---

## 4. Privacy / Trust Warnings

- No public exposure of CRE internal document evidence.
- No indexing user-contributed facts before visibility rules exist.
- UI hiding is not security; query/API permission filtering required.
- Export/share requires audit receipt and consent where applicable.

---

## 5. Sophex Doc Updates (Applied)

- `docs/CRE_PLATFORM_ALIGNMENT.md`
- `docs/EVIDENCE_AND_OBSERVATION_MODEL.md`
- `docs/TRUST_AND_PERMISSIONS_MODEL.md`
- `docs/VALUATION_REPORTING_PRODUCT.md`
- `docs/SOPHEX_TRUST_UI_GUIDELINES.md`
- `docs/SOPHEX_CONCEPTUAL_CONTRACTS.md`
- `DECISIONS.md` (ADR-0014, ADR-0018)

---

## 6. File Path Appendix

| Area | Path | Why Sophex should reference it |
| --- | --- | --- |
| Relationship truth | `docs/governance/RELATIONSHIP_TRUTH_DOCTRINE.md` | Governed truth separation |
| Root providers | `apps/core/components/providers/RootProviders.tsx` | Shell split pattern |
| Source citation | `apps/core/components/ui/source-citation.tsx` | Inline evidence UI |
| Provenance UI | `apps/core/components/data-studio/ProvenanceCell.tsx`, `alphaDrop/v2/ProvenanceModal.tsx` | Trust drill-down |
| BOV patterns | `apps/core/components/bov/` | Report review and export |
| Sophex stub | `apps/core/components/sophex/ai/AIUnderwritingInterface.tsx` | Reframe as valuation preview |
| UX assessment | `apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Scope warning vs full OS |
| Schema (conceptual only) | `prisma/schema.prisma` | **Do not copy** — contract thinking only |

---

## Final Recommendation

Borrow CRE **governance, evidence, audit, BOV export discipline, and provenance UX doctrine**. Do not copy runtime, schema, operator shell, or production data. Align later through approved APIs and read models.
