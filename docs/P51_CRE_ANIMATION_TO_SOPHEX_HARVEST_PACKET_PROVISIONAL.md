# P51_CRE_ANIMATION_TO_SOPHEX_HARVEST_PACKET_PROVISIONAL

> **Provisional P51 animation supplement.** This packet was generated read-only from `C:\Projects\p51 Site Selection Tool\cre-platform`. The checkout was on `master` with `HEAD == origin/master`, but the working tree had many untracked `.tmp` schema/proof artifacts. Use this as high-end animation, workflow-continuity, and OS-motion doctrine only until reconciled against a clean authoritative CRE checkout.
>
> This packet does not authorize copying CRE/P51 source code, runtime implementation, packages, schema, migrations, deploy, provider/send, queues, or production data into Sophex.

**Mode:** `SOPHEX_P51_CRE_ANIMATION_HARVEST` / `DOCS_ONLY`  
**Harvest date:** 2026-05-22  
**P51 CRE source path:** `C:\Projects\p51 Site Selection Tool\cre-platform`  
**Branch:** `master`  
**HEAD:** `af4a453b66bb62e79a147cae143dc61ed042906e`  
**origin/master:** `af4a453b66bb62e79a147cae143dc61ed042906e`  
**Clean caveat:** tracked files matched `origin/master`, but untracked `.tmp/` schema/proof artifacts were present. Treat as provisional/reference for motion doctrine.

---

## 1. Executive Takeaway

The prior clean CRE UX/Motion harvest captured the general `apps/core` motion system. P51 adds a richer **high-end institutional animation doctrine**: workflow-first continuity, OS-neutral motion primitives, Brief-specific wrappers, execution-vs-review motion policy, focus-safe sheets, route continuity, and a primitive graduation checklist.

Sophex should inherit the doctrine, naming discipline, timing bands, and accessibility requirements. Sophex should not inherit CRE operator chrome, ICSC/war-room naming, runtime dependencies, schema, route semantics, or looping attention animations.

---

## 2. Core Animation Principles To Borrow

1. **Workflow first, route second** — route changes are authority boundaries but should not feel like hard product exits.
2. **Persistent context** — workflow name, stage, selected record, proof posture, source context, and return target stay visible across tables, maps, drawers, and workstations.
3. **Institutional tone** — quiet, fast, purposeful motion; no consumer bounce, hype, or decorative loops.
4. **Proof-motion coupling** — animation must never imply source proof, launch, send, verification, or publication when gates are not met.
5. **Two-layer motion system** — token/spec layer plus named component primitives with data attributes and tests.
6. **Disclosure ladder** — inline expansion before split panel, split panel before inspector drawer, drawer before full workstation route.
7. **Execution vs review split** — speed-critical execution surfaces use lower motion; review/report surfaces can use restrained continuity.
8. **Map motion is contextual** — pulses and spatial effects belong only to map intelligence contexts, not universal UI.
9. **Reduced motion is a contract** — remove travel/scale, preserve stable layout, focus placement, copy, and skeleton geometry.
10. **Primitive graduation requires proof** — token, consumer, reduced-motion, keyboard, mobile density, context safety, and test/manual proof.

---

## 3. Motion Timing Bands

| Band | Target | P51 anchors | Sophex use |
| --- | ---: | --- | --- |
| Instant feedback | 80-120ms | execution 120ms; workflow instant 100ms | Button/chip/timeline feedback |
| Standard reveal | 150-220ms | workflow reveal 180ms; review 220ms | Page, panel, card, evidence reveal |
| Emphasized continuity | 220-320ms | workflow emphasized 260ms; slow token 320ms | Table-to-detail, map-to-drawer, report-step continuity |
| Avoid by default | >320ms | legacy count-up/fix scripts exceed this | Rare only; not public financial polish |
| Reduced motion | near-instant | 0.01s helper / CSS collapse | Opacity-only or stable layout |

Canonical easing:

- `standard`: `[0.2, 0, 0, 1]`
- `emphasize`: `[0.16, 1, 0.3, 1]`
- `exit`: `[0.4, 0, 1, 1]`
- `linear`: progress/execution indicators only

Forbidden for Sophex MVP0: elastic, springy, overshooting, urgency, celebration, or looping decorative motion.

---

## 4. Primitive Vocabulary

### OS-neutral specs

| Primitive | Purpose |
| --- | --- |
| `osReveal` | Opacity plus small y reveal for route/content entry |
| `osStageItem` | Dense list/card stage reveal |
| `osRecede` | Soft exit/recede state |
| `osRailEnter` | Active rail/pill indicator |
| `osCollapse` | Collapsible region lifecycle |
| `osSheetBackdrop` | Sheet/dialog backdrop |
| `osSheetPanel` | Sheet/dialog panel entry |

### Brief facade mapping

| Brief name | OS primitive |
| --- | --- |
| `modeTab` | `osRailEnter` |
| `modeContent` | `osReveal` |
| `sectionContent` | `osCollapse` |
| `sheetBackdrop` | `osSheetBackdrop` |
| `sheetPanel` | `osSheetPanel` |
| `panelListItem` | `osStageItem` |

### Workflow transition presets

- `page`
- `section`
- `drawerRight`
- `drawerLeft`
- `timeline`

### Document intelligence variants

- `pageTransition`
- `modalTransition`
- `listItemTransition`
- `staggerContainer`
- `fadeIn`
- `slideUp`
- `slideDown`
- `scaleIn`
- `hoverScale`
- `tapScale`

Sophex should define a slimmer public subset first: `fade`, `osReveal`, `drawerRight`, `osCollapse`, layout skeletons, and one report-step transition. Authenticated review/report surfaces can use the fuller set later.

---

## 5. Component And Interaction Patterns

| Pattern | P51 source path | Sophex adaptation |
| --- | --- | --- |
| Workflow continuity standard | `docs/program/frontend-experience/WORKFLOW_CONTINUITY_AND_MOTION_STANDARD_2026-05-02.md` | Property -> evidence -> comp -> report -> export should feel like one chain |
| OS motion audit | `docs/briefing/CRE1_OS_MOTION_AND_VISUAL_STANDARD_AUDIT_2026-05-13.md` | Primitive graduation checklist for Sophex motion system |
| Motion tokens | `apps/core/lib/motion-tokens.ts` | Token-first durations, easing, translate, opacity, stagger, reduced-motion helper |
| Workflow motion | `apps/core/lib/motion/workflow-motion.ts` | Page/section/drawer/timeline presets |
| OS primitives | `apps/core/components/os/OSMotion.tsx` | Focus-trapped sheets, collapses, active indicators, reduced-motion metadata |
| Brief facade | `apps/core/components/brief/BriefMotion.tsx` | Product-specific wrappers can map to OS-neutral primitives |
| Page transition | `apps/core/components/navigation/PageTransitionShell.tsx` | Route reveal with focus target |
| Route progress | `apps/core/components/navigation/RouteProgressBar.tsx` | Navigation cue only; never workflow completion proof |
| Workflow inspector | `apps/core/components/ui/workflow/DetailInspectorDrawer.tsx` | Evidence/proof drawer with focus restore and Escape |
| Stage rail | `apps/core/components/ui/workflow/WorkflowStageRail.tsx` | Report/intake phase rail; reduced-motion safe |
| Map focus mode | `apps/core/components/map/focus-mode/MapFocusModeShell.tsx` | Preserve shell/context during map drill-down |
| AI suggestion pin | `apps/core/components/map/AISuggestionPin.tsx` | Time-limited operator pulse only; no public infinite pin pulse |
| Document animations | `apps/core/lib/document-intelligence/animations.ts` | Upload/review list and modal motion, tied to shared tokens |

---

## 6. Accessibility And Reduced Motion

Sophex motion primitives should require:

- One canonical reduced-motion source; avoid split Framer-vs-`matchMedia` behavior.
- Reduced motion removes translate/scale and long-running loops, while preserving orientation.
- Drawers/sheets focus the first meaningful control, trap tab focus, close on Escape when safe, and restore focus to the invoking control.
- Route handoffs focus `#page-content` or a meaningful heading.
- Loading states use layout-matched skeletons and named phase copy.
- Map/focus modes announce state with polite live regions.
- Motion metadata or test hooks should prove which primitive is active and whether reduced motion was honored.

---

## 7. What Not To Copy

- CRE operator shell, Jarvis, dialer, gamification, command palette as MVP0 nav, or operating-lens chrome.
- ICSC/war-room CSS naming or sister-project route semantics.
- Looping public financial animations: `statusPulse`, `pinPulse`, typing dots, spin, shimmer, urgency pulses.
- Legacy 500ms/ease-heavy broad motion fixes that conflict with institutional fast-motion doctrine.
- Fragmented map drawer implementations or mock geo precision.
- Route progress as workflow completion proof.
- Confidence animation that implies live recalculation, appraisal certainty, or source authority.
- Any P51 runtime code, package graph, schema, provider/send, queues, deploy, or production data.

---

## 8. Differences From Clean CRE UX/Motion Harvest

| Area | Clean CRE authoritative harvest | P51 animation supplement |
| --- | --- | --- |
| Source trust | Clean `cre-platform-master-clean\apps\core` | Tracked `master` matched upstream, but untracked `.tmp` artifacts make this provisional |
| Motion coverage | General motion tokens, OSMotion, page transitions, trust UI | Full workflow-continuity doctrine, Brief facade, primitive graduation checklist |
| Timing guidance | Token values and key presets | Explicit duration bands and disclosure ladder |
| Execution policy | Restrained motion noted | Execution-vs-review split is stronger and route-scoped |
| Map motion | MapClient, selected-object drawer, focus mode | Adds map motion restraint and time-limited pulse caveats |
| Testing | Accessibility/motion patterns referenced | OS/Brief motion unit tests and workflow validation debt identified |
| Anti-patterns | Pulse/gamification warning | Adds warning against 500ms/ease-heavy legacy bulk fixes and ICSC naming import |

---

## 9. Recommended Sophex Updates Applied

- Add this packet as a P51 provisional animation supplement in the harvest index and doc hierarchy.
- Update motion guidelines with P51 timing bands, primitive vocabulary, disclosure ladder, and primitive graduation proof.
- Update frontend UX inheritance with workflow-continuity and route handoff doctrine.
- Update MVP0 screen map with motion constraints for each public/authenticated surface.
- Update trust UI guidelines so animation cannot upgrade proof posture visually.
- Update source/reference maps with the P51 path and caveat.
- Add an ADR recording P51 as a doctrine supplement, not authoritative runtime source.

---

## Final Recommendation

Use P51 as a **high-end animation doctrine supplement**. Sophex should adopt the institutional motion language, workflow-continuity model, and accessibility proof requirements, while keeping public MVP0 motion slim and honest. Reconcile P51 against a clean authoritative CRE checkout before any implementation or component extraction.
