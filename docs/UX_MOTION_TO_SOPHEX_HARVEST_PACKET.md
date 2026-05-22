# UX_MOTION_TO_SOPHEX_HARVEST_PACKET

> **Superseded — use [UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md](UX_MOTION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL.md).** Canonical integration: `docs/HARVEST_DOC_HIERARCHY.md`.

**Mode:** `SOPHEX_UX_MOTION_READ_ONLY_HARVEST`  
**Source:** `C:\Projects\cre-platform-erofs-master-landing\apps\core`  
**Harvest date:** 2026-05-22  
**Status:** Reference-only. Richest sister-project frontend/design-system source.

---

## Location Check

| Check | Result |
| --- | --- |
| Path | CRE `apps/core` |
| Branch (at harvest) | `agent/03-operating-lens-navigation` (not clean) |
| Assigned lane | UX/motion/design-system harvest for Sophex |
| Collision posture | Patterns and tokens as doctrine; no component copy |

---

## 1. Design System Takeaway

### 10 principles Sophex should inherit

1. Evidence before persuasion — source, confidence, freshness, review state alongside values.
2. Token-driven surfaces — CSS-variable `surface.*`, `cta.*`, system success/warning/error tokens.
3. Purposeful motion + reduced-motion escape hatch — `MOTION.presets`, `getMotionProps`.
4. Shell vs workstation separation — public lightweight shell vs authenticated workspace.
5. Progressive disclosure — cards, drawers, tabs expand on demand.
6. Operator-grade loading honesty — layout-matched skeletons, phase labels.
7. Trust labels as first-class UI — AUTO/NOTIFY/HITL/BLOCK adapted for marketplace review.
8. Mobile-first conversion — bottom nav, sticky CTAs, collapsible evidence.
9. Accessibility infrastructure — skip links, focus targets, `role="status"` banners.
10. Non-production surfaces scream STUB — amber banner on mock/demo reporting.

### 10 pitfalls to avoid

1. Full CRE operator shell (Jarvis, dialer, gamification, PersistentMainMenu).
2. Dual navigation systems.
3. Over-animation on financial data.
4. Confidence color without semantic review state.
5. Export enabled before approval gates.
6. Placeholder maps as live intelligence.
7. Command palette as MVP0 primary nav.
8. Massive 20+ provider RootProviders tree.
9. Inconsistent badge variant APIs.
10. AI approve/reject underwriting tone.

---

## 2. Component Patterns To Borrow

| Component | Source path(s) | Sophex use | Trust adaptation |
| --- | --- | --- | --- |
| Root shell | `components/providers/RootProviders.tsx` | Public vs workspace shell | Exclude gamification from public |
| TopBar | `components/navigation/TopBar.tsx` | Authenticated header | Hide private counts on public routes |
| Page transition | `components/navigation/PageTransitionShell.tsx` | Route reveal | Reduced motion safe |
| Route progress | `components/navigation/RouteProgressBar.tsx` | Nav loading bar | Non-blocking |
| Command palette | `components/navigation/UniversalCommandPalette.tsx` | Future search | Permission-filter results |
| Card/badge/table | `components/ui/*`, `@acme/shared-ui` | Property/report/comp surfaces | Authority labels on cells |
| Sheet drawer | `components/navigation/ShellNotificationDrawer.tsx` | Activity/notifications | No private previews in public |
| File upload | `components/ui/file-upload.tsx` | Document intake | Per-file errors + progress |
| Document viewer | `components/ui/document-viewer-modal.tsx` | Evidence viewing | Permissioned pages only |
| Source citation | `components/ui/source-citation.tsx` | Inline evidence | Hide private doc names publicly |
| Provenance modal/cell | `alphaDrop/v2/ProvenanceModal.tsx`, `data-studio/ProvenanceCell.tsx` | Field drill-down | Filter by actor |
| BOV section/export | `components/bov/BOVSectionCard.tsx`, `BOVExportCard.tsx` | Report review gate | Disabled until approved |
| Confidence indicator | `components/workflows/common/ConfidenceIndicator.tsx` | Valuation preview | Not legal certainty |
| Trust tier badge | `components/voltron/TrustTierBadge.tsx` | Review queue posture | Map to HITL states |
| Activity timeline | `components/shared/ActivityTimeline.tsx` | Contribution history | Filter private actors |
| Property heatmap | `components/map/PropertyHeatmap.tsx` | Market map | Anonymized weights in MVP0 |
| Comp map (stub) | `components/document-intelligence/CompMapView.tsx` | Comp map | Label as sample |
| Report wizard | `components/reports/ReportBuilderWizard.tsx` | Report builder | Scheduling disabled |
| Loading library | `components/ui/loading.tsx`, `skeleton.tsx` | Progress states | User-safe phase labels |
| Page error | `components/feedback/PageError.tsx` | Recoverable errors | No internal ID leak |
| Non-production banner | `components/surfaces/NonProductionReportingBanner.tsx` | MVP0 mock pages | Required on previews |
| Skip link | `components/accessibility/SkipLink.tsx` | WCAG skip nav | All shells |

Tailwind: `apps/core/tailwind.config.js` — `@acme/design-tokens`, `@finem/design-tokens`, surface/cta CSS vars.

---

## 3. Motion Language

| Category | CRE reference | Sophex guidance |
| --- | --- | --- |
| Transitions | `lib/motion-tokens.ts` presets: reveal, fade, scaleIn | ≤220ms on major steps only |
| Loading | RouteProgressBar, skeletons, LoadingOverlay | Phase labels, layout skeletons |
| Report progress | ReportBuilderWizard steps, BOVExportCard gate | Step-based; disabled export until ready |
| Evidence reveal | listStagger 0.04s, drawer briefPanel | Restrained; reduced motion fallback |
| Map interaction | PropertyHeatmap layer toggle | No pinPulse on public maps |
| Comparison | Row highlight + drawer enter | No cell animation spam |
| Success/error | Toaster 4s; PageError retry | No gamification celebrations |
| Restraint level | execution 120ms / review 220ms | Low motion on public SEO pages |

---

## 4. Visual Trust Language

| Element | Pattern |
| --- | --- |
| Authority badges | Public baseline, licensed provider, user submission, reviewed, unreviewed, stale, disputed, blocked, model-inferred, premium-private |
| Confidence labels | Ring + source/freshness subtext; evidence coverage not bravado |
| Privacy labels | Public / Account-private / Contribution-shared / Premium-private |
| Review states | Auto-eligible (baseline only), notify, HITL required, blocked |
| Provenance UI | Inline citation → cell → drawer → report summary |
| Export trust | Section approve, consent, SHA-256/receipt after export |

Full taxonomy: `docs/SOPHEX_TRUST_UI_GUIDELINES.md`.

---

## 5. Sophex MVP0 Screen Recommendations

| Screen | Core components | State model | Motion | Trust |
| --- | --- | --- | --- | --- |
| Public landing/search | Hero, stat cards, segment chips | idle→results→selected | Route progress, fade | Stub banner |
| Property intelligence | Provenance cells, map stub, citations | loading→public→auth unlock | Skeleton, expand | Authority per field |
| Upload/intake | FileUpload, consent, clean/scanned warning | empty→uploading→queued | Per-file progress | Explicit terms |
| Evidence review | Evidence panel, doc viewer, approve/reject | unreviewed→approved/disputed | Drawer slide | HITL gate |
| Comp comparison | DataTable, map stub, metric drawer | select→compare→export intent | Row highlight | Mask private comps |
| Valuation preview | Section cards, confidence, provenance | generating→partial→ready | Step progress | Citations + stub banner |
| Export gate | Export dialog, BOVExportCard, consent | locked→consent→receipt | Loading overlay | Audit hash |
| My reports | Card list, filters, badges | draft/preview/exported | List skeleton | Visibility badge |
| Contribution history | ActivityTimeline | submitted→accepted/rejected | Expand only | Public/private labels |
| Moderation queue | DataTable, TrustTierBadge | queued→decided | Row stagger | Operator-only |

Full map: `docs/SOPHEX_MVP0_SCREEN_MAP.md`.

---

## 6. File Path Appendix

| Pattern | Source path | Notes |
| --- | --- | --- |
| Motion tokens | `apps/core/lib/motion-tokens.ts` | Canonical presets |
| Page transition | `apps/core/components/navigation/PageTransitionShell.tsx` | Route reveal |
| Route progress | `apps/core/components/navigation/RouteProgressBar.tsx` | Top bar |
| Root shell | `apps/core/components/providers/RootProviders.tsx` | Public vs operator |
| Command palette | `apps/core/components/navigation/UniversalCommandPalette.tsx` | Future-gated |
| Provenance UI | `source-citation.tsx`, `ProvenanceCell.tsx`, `ProvenanceModal.tsx` | Trust drill-down |
| BOV export | `bov/BOVSectionCard.tsx`, `BOVExportCard.tsx`, `BOVProvenanceCard.tsx` | Review gate |
| Map/heatmap | `map/PropertyHeatmap.tsx`, `document-intelligence/CompMapView.tsx` | Mock-first for CompMapView |
| Trust UI | `voltron/TrustTierBadge.tsx`, `workflows/common/ConfidenceIndicator.tsx` | Review posture |
| Non-production | `surfaces/NonProductionReportingBanner.tsx` | MVP0 required |
| Design tokens | `apps/core/tailwind.config.js` | @acme/@finem presets |
| UX assessment | `apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Scope warning |

---

## 7. Sophex Doc Updates (Applied)

- `docs/FRONTEND_UX_INHERITANCE.md`
- `docs/MOTION_AND_INTERACTION_GUIDELINES.md`
- `docs/SOPHEX_TRUST_UI_GUIDELINES.md`
- `docs/SOPHEX_MVP0_SCREEN_MAP.md`
- `docs/SISTER_PROJECT_SOURCE_MAP.md`
- `DECISIONS.md` (ADR-0014, ADR-0017)

---

## Final Recommendation

Harvest **CRE apps/core** for shell split, provenance UI, motion tokens, export gates, and trust visualization. Reimplement minimally against Sophex contracts in MVP0 with mock data and non-production banners. Do not import operator shell complexity.
