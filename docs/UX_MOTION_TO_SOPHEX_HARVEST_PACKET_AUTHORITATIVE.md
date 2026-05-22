# UX_MOTION_TO_SOPHEX_HARVEST_PACKET_AUTHORITATIVE

> **Authoritative UX/Motion source archive.** This packet was generated read-only from `C:\Projects\cre-platform-master-clean\apps\core` while the CRE root was on clean `master` with `HEAD == origin/master`.
>
> This packet supersedes the provisional UX/Motion packet generated from stale/dirty branch `agent/03-operating-lens-navigation`. It is still **docs-only doctrine** for Sophex and does not authorize copying CRE source code, runtime implementation, schema, deploy, provider/send, queues, or package changes.

**Mode:** `SOPHEX_AUTHORITATIVE_UX_MOTION_VALIDATION` / `DOCS_ONLY`  
**Harvest date:** 2026-05-22  
**CRE UX source path:** `C:\Projects\cre-platform-master-clean\apps\core`  
**CRE root path:** `C:\Projects\cre-platform-master-clean`  
**CRE branch:** `master`  
**CRE HEAD:** `5300e7e5510e27d5ba505bfba8bec39990f68f7c`  
**CRE origin/master:** `5300e7e5510e27d5ba505bfba8bec39990f68f7c`  
**Clean confirmation:** `git status --short --branch --untracked-files=all` returned `## master...origin/master` only.

---

## 1. Design System Takeaway

### Design principles Sophex should inherit

1. **Evidence before persuasion** — source, confidence, freshness, review state, and visibility near every important value.
2. **Lightweight public shell vs authenticated workstation** — public routes avoid operator chrome; authenticated workstations can carry richer review/report navigation.
3. **Tokenized, restrained motion** — use named motion tiers and reduced-motion fallbacks rather than ad hoc animation.
4. **Progressive disclosure** — cards, drawers, tabs, citations, and provenance modals reveal depth only when useful.
5. **Candidate/staged labeling** — extracted or imported data stays visibly candidate-only until reviewed.
6. **Section-gated reporting** — report sections, provenance, publication holds, and export readiness are visible before export.
7. **Honest loading** — layout skeletons and phase labels beat fake progress.
8. **Mobile-first but not operator-first** — bottom nav and sticky affordances should serve contributor/report tasks, not CRE operator tasks.
9. **Accessibility by default** — skip links, focus traps, `aria-live`, alert roles, captions, and screen-reader text are part of trust.
10. **Non-production visibility** — mock/demo/reporting surfaces must show explicit STUB/non-production banners.

### Pitfalls Sophex must avoid

1. Importing the full CRE operator shell (Jarvis, dialer, gamification, large provider tree, operating-lens chrome).
2. Dual navigation debt (canonical mobile nav vs legacy duplicate).
3. Command palette as MVP0 primary navigation.
4. Command/RAG/graph/document hits without permission filtering.
5. Pulse loops, gamification, celebration overlays, or confidence animations on public CRE data.
6. Canonical-looking views from fixture, candidate, mocked, stale, or provider-restricted data.
7. Confidence scores presented as legal or valuation authority.
8. Hover-only provenance that fails on mobile or assistive tech.
9. Copying CRE lab/stub Sophex routes or AI approve/reject underwriting tone.
10. Copying CRE components, runtime providers, packages, schema, or design-system implementation directly.

---

## 2. Component Patterns To Borrow

| Component / pattern | CRE clean-master source path(s) | Current behavior | Sophex use case | Public/private/trust adaptation | Accessibility notes |
| --- | --- | --- | --- | --- | --- |
| Lightweight public shell | `components/providers/RootProviders.tsx`; `components/providers/SessionGate.tsx` | Splits public/auth route handling from authenticated provider tree | Public marketplace shell | Public routes skip operator providers and sensitive context | Mount skip link and route progress safely |
| Authenticated workspace shell | `RootProviders.tsx`; `TopBar.tsx`; `PageTransitionShell.tsx`; `components/mobile/MobileBottomNav.tsx`; `UniversalCommandPalette.tsx` | Full shell for authenticated workstations | Upload/report/account workspace | Simplify heavily for Sophex; no Jarvis/dialer/gamification | Label icon buttons and announce route changes |
| TopBar/nav | `components/navigation/TopBar.tsx`; `PersistentMainMenu.tsx`; `lib/navigation/operating-lenses.ts`; `lib/navigation/os-workstation-matrix.ts` | Operator nav, workspace switcher, route roles/lenses | Minimal authenticated header and route taxonomy | Do not copy operator lens menu into public MVP0 | Preserve keyboard and visible labels |
| Route progress | `components/navigation/RouteProgressBar.tsx` | Top loading bar on navigation | App-level transition feedback | Optional on public pages; never imply workflow completion | Pair with page title/focus update |
| Page transitions | `components/navigation/PageTransitionShell.tsx` | Route-keyed reveal using motion tokens | Internal page reveal | Keep low motion and reduced-motion fallback | `tabIndex={-1}` page focus target |
| Command palette | `components/navigation/UniversalCommandPalette.tsx`; `CommandPaletteProvider.tsx`; `hooks/useCommandPalette.ts` | Global command/search merges entity, RAG, graph, document, agent hits | Future authenticated power search | Future-gated; permission-filter all hits; not MVP0 primary nav | Needs focus trap, Escape, listbox semantics |
| Mobile shell/bottom nav | `components/mobile/MobileBottomNav.tsx` (canonical); `components/navigation/MobileBottomNav.tsx` (legacy duplicate) | Canonical mobile nav imported by RootProviders; legacy duplicate exists | Future contributor mobile shell | Use simple Sophex tabs; avoid dual nav | Thumb-zone targets and sheet labels |
| Cards/stat cards | `components/ui/*`; `components/feedback/LoadingSkeleton.tsx`; property/report cards | Dense operator cards and skeletons | Property/report/market cards | Add authority labels and non-production banners | Headings and readable empty states |
| Tables | `components/market-reports/source-bundle/CandidateCompPreviewTable.tsx`; `components/bov/BOVCompTable.tsx`; data-table patterns | Accessible comp and review tables with confidence/status | Comp comparison dashboard | Mask private comps; label candidate-only rows | Captions, `scope="col"`, text labels |
| Drawers/sheets/modals | `components/os/OSMotion.tsx`; `components/ui/workflow/DetailInspectorDrawer.tsx`; `ProvenanceModal.tsx` | Focus-trapped sheets/dialogs, Escape, restore focus | Evidence drawer, metric drill-down, provenance modal | Filter tabs/details by viewer role | `aria-modal`, focus restore, keyboard close |
| Badges/status chips | `components/ui/workflow/ProofStatusBadge.tsx`; `TrustTierBadge.tsx`; `DataProvenanceLabel.tsx` | Proof posture, trust gate, AI estimate badges | Authority/review/status labels | No AUTO public publication; AI estimates blocked until confirmed | Text plus color, not color alone |
| File upload | `components/document-intelligence/UploadZone.tsx`; pilot intake paths | Drag/drop, queue/progress, variants | Document contribution intake | Consent, file type/size, source-use gates; no auto-publish | Per-file progress and errors |
| Source citation | `components/ui/source-citation.tsx`; `components/documents/staged-import/SourceCitationList.tsx` | Document/page citations with similarity bands and snippets | Report/evidence citations | Hide private/provider-restricted names publicly | Buttons/lists, not hover-only |
| Provenance/evidence panels | `SelectedObjectDrawer.tsx`; `SourceEvidenceBlockCard.tsx`; `MarketReportSourceBundleReviewPanel.tsx`; `StagedImportReviewPanel.tsx` | Candidate-only review panels and evidence cards | Evidence review panel, map drawer, report source review | Candidate labels, publication holds, filtered source visibility | Issue flags and holds visible as text/alerts |
| Field provenance cells | `components/data-studio/ProvenanceCell.tsx`; `app/map/ProvenanceRow.tsx` | Value + source chip + confidence/freshness dots | Property fields, comp rows, map cards | Show unknown/stale/private states honestly | Dot tiers need text/title |
| BOV/report section review | `components/bov/BOVSectionCard.tsx`; `BOVProvenanceCard.tsx`; `components/bov/review/BovReviewGovernancePanels.tsx` | Section approval, provenance summary, ready/degraded/blocked panels | Valuation report section review | Export blocked until review and consent | Disabled controls need explanation |
| Report export gate | `components/bov/BOVExportCard.tsx`; `lib/bov/output-guard.ts`; provider export readiness panels | Disabled export until approvals; hash output; restricted vendor comp filtering | Export/download/share gate | Enforce provider rights and publication holds before public export | Warnings visible, not toast-only |
| Confidence/trust indicators | `alphaDrop/v2/ConfidenceIndicator.tsx`; `components/ml/ConfidenceScoreBadge.tsx`; `TrustTierBadge.tsx` | Confidence breakdowns and trust tiers | Report confidence and review posture | Confidence is evidence coverage, not authority | Tooltips and text equivalents |
| Activity/timeline | `components/ui/workflow/ActivityTimelinePanel.tsx`; `UnifiedActivityFeedPanel.tsx`; HITL queue panels | Timeline rows, proof badges, HITL queue | Contribution history and moderation queue | Operator-only internal detail; public sanitized status | Selectable rows need keyboard handling |
| Maps/geospatial | `app/map/MapClient.tsx`; `components/map/selected-object/*`; `MapFocusModeShell.tsx`; `StatusLegend.tsx` | Map workbench with evidence drawer and shell-preserving focus mode | Property map/heatmap UX | No fake precision or private deal markers | Focus mode and evidence drawer labels |
| Loading/skeletons | `components/feedback/LoadingSkeleton.tsx`; `components/ui/skeleton.tsx`; route loading files | List/card/table/full-page skeletons | Property/report/queue loading | Prefer real phase labels | Decorative pulse only |
| Error/empty states | `components/feedback/PageError.tsx`; `EmptyState.tsx` | Retry/back actions and CTA empty states | Upload/comp/report empty or error | No internal stack IDs in public | Buttons large enough; readable copy |
| Non-production/stub banners | `components/surfaces/NonProductionReportingBanner.tsx`; `config/route-status.config.ts`; `RouteClassificationBanner.tsx` | STUB banner and route maturity banners | MVP0 mock report/market pages | Required for mock data | `role="status"` or labeled `aside` |
| Accessibility primitives | `components/accessibility/SkipLink.tsx`; `ScreenReaderAnnouncement.tsx`; `FocusTrap.tsx`; accessibility docs/tests | Skip links, live regions, focus management | All shells and trust UI | Do not hide state changes visually only | WCAG 2.1 AA baseline |

---

## 3. Motion Language

### Transition presets and timings

| Source | Names / timings | Sophex guidance |
| --- | --- | --- |
| `lib/motion-tokens.ts` | `execution` ~120ms linear; `review` ~220ms ease-out; presets `reveal`, `railEnter`, `briefPanel`, `bottomBar`, `scaleIn`, `tooltip`, `fade`; staggers 0.03-0.04s | Use execution for ticks/progress, review for reveal/drawers, citation stagger sparingly |
| `lib/motion/workflow-motion.ts` | `instantFeedback` 100ms; `standardReveal` 180ms; `emphasizedContinuity` 260ms; `drawerRight/Left`; `timeline` | Multi-step report and intake transitions |
| `components/os/OSMotion.tsx` | `osReveal`, `osStageItem`, `osRecede`, `osRailEnter`, `osCollapse`, `osSheetBackdrop`, `osSheetPanel`; reduced-motion data attributes | Standard Sophex sheets/drawers/modals doctrine |
| `tailwind.config.js` | `count-up` 420ms; `fade-up` 260ms; `stagger-in` 280ms; agent status CSS variables | Use count-up only for mock-safe metrics; avoid hype on financial values |
| `lib/document-intelligence/animations.ts` | page/modal/list/fade/slide/scale/hover/tap variants | Upload and document review flows |

### Interaction guidance

- **Route transitions:** short page reveal plus route progress; reduced motion collapses to opacity/instant.
- **Loading states:** layout skeletons and real labels; no fake completion bars.
- **Report generation progress:** step wizard, section gates, export readiness, publication holds, hash/receipt placeholder.
- **Evidence reveal:** drawer/sheet or expandable evidence card; citation list stagger only when not distracting.
- **Map interaction:** selection opens evidence drawer; focus mode preserves shell; no infinite pin pulse on public maps.
- **Comparison interaction:** row highlight and drawer detail; no cell animation spam.
- **Success/error states:** concise confirmation; no gamified celebrations; errors explain recovery without internal IDs.
- **Reduced motion:** required for all transitions through token helpers and CSS data hooks.
- **MVP0 restraint:** low motion on public SEO/GEO pages; richer but still restrained motion only in authenticated workstations.

### Forbidden / gated MVP0 motion

- Pulse loops, celebration overlays, bounce easing, urgency animations, animated confidence rings implying live recalculation.
- Command palette and notification drawer animations on public MVP0.
- Simulated worker/report progress untied to real states.
- Operator gamification and Jarvis-style animation language.

---

## 4. Visual Trust Language

| Signal | CRE expression | Sophex adaptation |
| --- | --- | --- |
| Authority badges | `ProofStatusBadge`, `DataProvenanceLabel`, source bundle candidate pills | Public baseline, user submission, candidate evidence, reviewed, blocked, provider-restricted |
| Confidence labels | `SourceCitation`, `ProvenanceCell`, `ConfidenceIndicator`, `ConfidenceScoreBadge` | Evidence coverage and agreement with freshness/source text |
| Privacy state | Route/session gates, document ACL concepts, publication holds | Public, account-private, org-private, contribution-shared, premium-private |
| Review state | ready/degraded/blocked panels, HITL/BLOCK trust badges | Reviewed, unreviewed, HITL required, disputed, stale, blocked |
| Public/private/premium distinction | Shell split, client-safe route roles, filtered panels | Never let private-source facts appear in public templates |
| Source drawers/provenance | `ProvenanceModal`, selected-object drawer, source evidence cards | Inline citation -> cell -> drawer -> report summary ladder |
| Sample/mock labels | `NonProductionReportingBanner`, route status banners | Mandatory on MVP0 mock data and sample maps |
| Confidence warning | AI estimate needs confirmation and confidence breakdowns | Confidence does not equal authority, legal certainty, or appraisal replacement |

---

## 5. Sophex MVP0 Screen Recommendations

| Screen | Core components | State model | Motion needs | Evidence/trust needs | Mock-data boundary |
| --- | --- | --- | --- | --- | --- |
| Public landing/search | Lightweight shell, hero/search, segment chips, stat cards, route progress | `idle -> searching -> results -> selected` | Fade-in results, route progress | Stub banner on market stats, public baseline labels | Sample stats only until rights clear |
| Property intelligence page | Property card layout, provenance cells, source citations, map drawer | `loading -> public projection -> auth unlock` | Skeleton, section expand | Per-field authority, private facts hidden | Public baseline/sample only |
| Upload/intake flow | UploadZone, consent copy, file progress, source-use labels | `empty -> validating -> uploading -> queued -> candidate` | Per-file progress, honest blocked state | Candidate-only, source-use and visibility accepted | No real extraction pipeline in MVP0 |
| Evidence review panel | StagedImportReviewPanel, SourceCitationList, evidence drawer | `unreviewed -> in_review -> accepted/rejected/blocked` | Drawer slide, citation stagger | HITL gate, candidate label, filtered docs | Mock candidates only |
| Comp comparison dashboard | CandidateCompPreviewTable/BOVCompTable doctrine, filters, map drawer | `select -> compare -> save set -> export intent` | Row highlight, detail drawer | Permission-filtered comps, provider restrictions | Sample/reviewed comps only |
| Valuation report preview | BOVSectionCard, ProvenanceCard, ConfidenceIndicator, source evidence cards | `generating -> partial -> review -> ready` | Step progress, section reveal | Section citations, warnings, `reviewRequired` | Non-production report banner |
| Report export gate | BOVExportCard, output-guard warnings, consent modal, hash placeholder | `locked -> consent -> generating -> receipt -> download` | Loading overlay, single success | Disabled until review, consent, source rights | No live PDF/send automation |
| My reports/workspace | Card list, proof/status badges, filters, empty state | `draft / preview / exported / archived` | List skeleton | Visibility badge per report | Mock report cards |
| Contribution history | ActivityTimelinePanel doctrine, privacy badges | `submitted -> processing -> accepted/rejected/blocked` | Timeline expand | Public/private outcome labels; no internal logs | Sanitized statuses only |
| Moderation/review queue | HITL queue, TrustTierBadge, proof badges, source cards | `queued -> assigned -> decided` | Row stagger, drawer | Operator-only; idempotent decisions | Mock operator surface only |

---

## 6. File Path Appendix

| Pattern | CRE clean-master source path | Notes |
| --- | --- | --- |
| Design guide | `apps/core/docs/DESIGN_SYSTEM_GUIDE.md` | UX principles, token stack, accessibility posture |
| UX assessment | `apps/core/docs/SOPHEX_OS_UX_ASSESSMENT.md` | Warns against full OS scope/import |
| Accessibility checklist | `apps/core/docs/ACCESSIBILITY/accessibility-checklist.md` | WCAG and keyboard guidance |
| Framer stability | `apps/core/docs/FRAMER_MOTION_DOWNGRADE.md` | Centralize motion and avoid unstable ad hoc use |
| Motion tokens | `apps/core/lib/motion-tokens.ts` | Primary motion doctrine |
| Workflow motion | `apps/core/lib/motion/workflow-motion.ts` | Intake/report workflow transitions |
| OS motion primitives | `apps/core/components/os/OSMotion.tsx` | Sheets, focus trap, reduced-motion data hooks |
| Root shell | `apps/core/components/providers/RootProviders.tsx` | Public/auth vs authenticated shell split |
| Session gate | `apps/core/components/providers/SessionGate.tsx` | Public route prefixes and auth gating |
| TopBar | `apps/core/components/navigation/TopBar.tsx` | Authenticated header reference |
| Page transition | `apps/core/components/navigation/PageTransitionShell.tsx` | Route reveal |
| Route progress | `apps/core/components/navigation/RouteProgressBar.tsx` | Navigation loading feedback |
| Route status | `apps/core/config/route-status.config.ts`; `apps/core/components/navigation/RouteClassificationBanner.tsx` | Stub/working/legacy/canonical labels |
| Command palette | `apps/core/components/navigation/UniversalCommandPalette.tsx` | Future-gated authenticated search |
| Mobile nav | `apps/core/components/mobile/MobileBottomNav.tsx` | Canonical mobile nav |
| Legacy mobile nav | `apps/core/components/navigation/MobileBottomNav.tsx` | Exists but should not be copied |
| Source citation | `apps/core/components/ui/source-citation.tsx`; `apps/core/components/documents/staged-import/SourceCitationList.tsx` | Citation ladder |
| Provenance cell | `apps/core/components/data-studio/ProvenanceCell.tsx` | Table-cell trust UI |
| Provenance modal | `apps/core/components/alphaDrop/v2/ProvenanceModal.tsx` | Deep provenance |
| Field source label | `apps/core/components/underwriting/DataProvenanceLabel.tsx` | AI estimate/source badges |
| Proof badge | `apps/core/components/ui/workflow/ProofStatusBadge.tsx` | Proof posture states |
| Trust tier | `apps/core/components/voltron/TrustTierBadge.tsx` | AUTO/NOTIFY/HITL/BLOCK reference |
| Non-production banner | `apps/core/components/surfaces/NonProductionReportingBanner.tsx` | STUB reporting banner |
| Upload | `apps/core/components/document-intelligence/UploadZone.tsx` | Drag/drop upload UX |
| Staged review | `apps/core/components/documents/staged-import/StagedImportReviewPanel.tsx` | Candidate extraction review |
| Source bundle | `apps/core/components/market-reports/source-bundle/SourceEvidenceBlockCard.tsx`; `ReviewPostureBanner.tsx` | Evidence cards and posture |
| BOV review | `apps/core/components/bov/BOVSectionCard.tsx`; `BOVProvenanceCard.tsx`; `BOVExportCard.tsx`; `components/bov/review/BovReviewGovernancePanels.tsx` | Section approval/export gate |
| Output guard | `apps/core/lib/bov/output-guard.ts` | Restricted source filtering |
| Reports wizard | `apps/core/components/reports/ReportBuilderWizard.tsx` | Report-builder steps |
| Map workbench | `apps/core/app/map/MapClient.tsx`; `components/map/selected-object/`; `MapFocusModeShell.tsx` | Map + evidence drawer |
| Loading/empty/error | `components/feedback/LoadingSkeleton.tsx`; `PageError.tsx`; `EmptyState.tsx` | Honest states |
| Accessibility | `components/accessibility/SkipLink.tsx`; `ScreenReaderAnnouncement.tsx`; `FocusTrap.tsx` | Skip/focus/live-region primitives |

---

## 7. Differences From Prior Provisional UX/Motion Packet

| Area | Provisional packet | Authoritative clean-master finding |
| --- | --- | --- |
| Source state | `cre-platform-erofs-master-landing\apps\core`, stale/dirty branch | `cre-platform-master-clean\apps\core`, clean `master` @ `5300e7e5510e27d5ba505bfba8bec39990f68f7c` |
| Mobile nav | Generic `components/navigation/MobileBottomNav.tsx` reference | Canonical path is `components/mobile/MobileBottomNav.tsx`; navigation copy is legacy duplicate |
| Shared shell | Sometimes implied from broader harvest | `packages/shared-shell/**` not present; shell lives in `apps/core` |
| Source citation | Root/component path ambiguity | Prefer `apps/core/components/ui/source-citation.tsx`; staged import has `SourceCitationList.tsx` |
| BOV/report | Basic BOV cards | Expanded: `BovReviewGovernancePanels`, `output-guard`, source bundle review, provider/export holds |
| Motion | `motion-tokens.ts` only | Confirmed `motion-tokens.ts`, `workflow-motion.ts`, `OSMotion.tsx`, document-intelligence animations, Tailwind animation tokens |
| Maps | Heatmap/CompMap emphasis | Stronger current reference is `MapClient` + selected-object evidence drawer + focus mode |
| Non-production | Banner confirmed | Route status and STUB banners are both useful |
| Command palette | Future-gated | Confirmed as powerful but risky because it merges entity/RAG/graph/doc hits |
| Remaining unverified | Provisional caveat that paths may drift | Superseded for UX/motion. Fabricator still needs clean rerun. |

---

## 8. Recommended Sophex Doc Updates Applied

- Packet index/hierarchy/cross-project docs now point to this authoritative UX/Motion packet.
- Source/reference maps now record `C:\Projects\cre-platform-master-clean\apps\core` as the authoritative UX/motion source.
- Frontend UX, motion, trust UI, valuation, privacy, MVP0, roadmap, non-goals, open questions, decisions, and index docs now reflect clean-master UX validation.
- Old UX/Motion packets are marked superseded and retained as archives.

---

## Final Recommendation

Use this packet as the current **UX/motion source archive** for Sophex. Inherit evidence-first visual grammar, restrained motion, accessibility primitives, source/provenance UI, report gates, and shell split. Do not import CRE operator chrome, command palette as MVP0 nav, gamification, duplicated components, runtime packages, or source code.
