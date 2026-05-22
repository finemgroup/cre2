# UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL

> **This packet is provisional.** It was harvested from `C:\Projects\cre-platform-erofs-master-landing\apps\core` while that CRE checkout was on branch `agent/03-operating-lens-navigation`, dirty, 758 commits behind `origin/master`, and not suitable as CRE control-panel truth. Use for directional UX/motion/design-system doctrine only until rerun from clean CRE `master`. Component paths may have changed on current master.

**Mode:** `SOPHEX_UX_MOTION_READ_ONLY_HARVEST` (provisional)  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. **Not authoritative.**

---

## Relationship To Other Packets

| Topic | Canonical doc (read this first) | This packet |
| --- | --- | --- |
| UX inheritance | `docs/FRONTEND_UX_INHERITANCE.md` | Source archive + CRE paths |
| Motion | `docs/MOTION_AND_INTERACTION_GUIDELINES.md` | Source archive + presets |
| Trust UI | `docs/SOPHEX_TRUST_UI_GUIDELINES.md` | Badge/taxonomy reference |
| MVP0 screens | `docs/SOPHEX_MVP0_SCREEN_MAP.md` | Screen inventory archive |
| CRE governance/evidence | `docs/CRE_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md` | Separate lane |

**Do not maintain duplicate screen lists or trust taxonomies in multiple files.** Update canonical docs; keep this packet as provenance archive only.

---

## 1. Design System Takeaway (Summary)

**Inherit:** evidence-first UI, token-driven surfaces, restrained motion + reduced motion, shell vs workstation split, progressive disclosure, honest loading, trust labels, mobile-first, accessibility, non-production banners.

**Avoid:** full CRE operator shell, dual nav, over-animation, confidence without review state, export before gates, fake maps, command palette as MVP0 nav, 20+ provider tree, AI approve/reject tone.

Full detail: `docs/FRONTEND_UX_INHERITANCE.md`, `docs/MOTION_AND_INTERACTION_GUIDELINES.md`.

---

## 2. Component Patterns (CRE Path Reference)

| Pattern | CRE path (verify on clean master) |
| --- | --- |
| Root shell | `components/providers/RootProviders.tsx` |
| TopBar | `components/navigation/TopBar.tsx` |
| Page transition | `components/navigation/PageTransitionShell.tsx` |
| Route progress | `components/navigation/RouteProgressBar.tsx` |
| Command palette | `components/navigation/UniversalCommandPalette.tsx` |
| Source citation | `components/ui/source-citation.tsx` |
| Provenance cell/modal | `data-studio/ProvenanceCell.tsx`, `alphaDrop/v2/ProvenanceModal.tsx` |
| BOV export gate | `components/bov/BOVSectionCard.tsx`, `BOVExportCard.tsx` |
| File upload | `components/ui/file-upload.tsx` |
| Non-production banner | `components/surfaces/NonProductionReportingBanner.tsx` |
| Motion tokens | `lib/motion-tokens.ts` |
| Heatmap | `components/map/PropertyHeatmap.tsx` |

Also see `docs/SISTER_PROJECT_SOURCE_MAP.md`.

---

## 3. Motion Language (Summary)

Execution ~120ms, review ~220ms, no gamification loops on public pages. Phase labels for upload/report progress. No simulated progress. Full rules: `docs/MOTION_AND_INTERACTION_GUIDELINES.md`.

---

## 4. Visual Trust Language (Summary)

Authority badges, privacy labels, review states, provenance UI ladder, export trust — **canonical:** `docs/SOPHEX_TRUST_UI_GUIDELINES.md`.

---

## 5. MVP0 Screens (Summary)

**Canonical:** `docs/SOPHEX_MVP0_SCREEN_MAP.md` — do not duplicate screen tables here.

---

## Final Recommendation

Use CRE `apps/core` as **directional** UX/motion reference only. Reimplement minimally for Sophex MVP0 with mock data and stub banners. Rerun harvest from clean CRE `master` before treating paths or patterns as current.
