# Sophex Stitch Implementation Bridge Plan

Date: 2026-05-30

Status: execution plan / not runtime authorization

Parent audit: `docs/SOPHEX_STITCH_DELTA_AND_PRIMITIVES_PLAN.md`

Target: move Sophex from the current PR #13 public shell baseline toward the Google Stitch public intelligence shell goals while formalizing reusable primitives from Sophex, CRE/P51, and ICSC Map Recovery.

## Operating Boundary

This plan authorizes planning and mock-only prototype UI sequencing. It does not authorize runtime/API expansion, schema/DB work, live export, billing, provider/send, queue/worker, Railway/deploy, package/lock changes, CRE/P51 edits, ICSC edits, or copying Stitch-generated HTML/Tailwind into app source.

Implementation lanes should remain:

- One branch per lane.
- One PR per lane.
- Explicit file staging only.
- `master` base unless the operator redirects.
- Draft PR until visual QA and CI pass.

## Bridge Strategy

Do not try to "make every page look like Stitch" in one large PR. The gap should be closed in three layers:

1. Reference and primitive foundation: archive Stitch evidence and build shared Sophex primitives so pages can converge without adding one-off CSS.
2. First impression parity: Explore, property hero, and mobile property profile, because those define whether the product feels like Stitch.
3. Workbench parity: comps, source pack, review/export, and spatial HUD, each using the shared primitives.

This avoids the failure mode that caused earlier drift: agents polished current pages instead of treating Stitch as a gate.

## Milestone Map

| Milestone | PR lane | Goal | Stitch targets | Primary output | Merge gate |
| --- | --- | --- | --- | --- | --- |
| M0 | `docs/sophex-stitch-reference-archive` | Restore Stitch packet into repo history and link it from tracker docs | `SPI-01` to `SPI-08` | `docs/design/stitch-public-intelligence-shell/**` plus tracker links | Docs-only diff, no prototype files |
| M1 | `ui/sophex-primitives-001-public-shell` | Establish shared nav/trust/drawer/mobile primitives | `SPI-01`, `SPI-06`, `SPI-08` | `PublicProductNav`, `PublicTrustStrip`, `DemoControlsDrawer`, shared route model | Existing visuals preserved except intentional demo/nav refinements |
| M2 | `ui/sophex-explore-property-stitch` | Make Explore and property first fold match Stitch hierarchy | `SPI-01`, `SPI-02`, `SPI-08` | Explore bento/search, property hero, mobile property CTA | Desktop/mobile visual QA on `/` and `/property/demo-001` |
| M3 | `ui/sophex-comps-source-workbench` | Convert comps and source pack to Stitch workbench models | `SPI-03`, `SPI-05` | Split map/grid comps, target-field source trace | Export/source remains disabled and mock-only |
| M4 | `ui/sophex-review-export-stitch` | Reframe review/export as checklist, resolutions, export options | `SPI-07` | Checklist/resolution/export option layout | Generate/export remains disabled |
| M5 | `ui/sophex-spatial-motion-primitives` | Add ICSC-inspired spatial HUD and motion polish | `SPI-02`, `SPI-03`, `SPI-08` | `SpatialHUD`, `SpatialPreviewCard`, reveal/rail motion utilities | No live map/source dependency |

## Lane 0: Stitch Reference Archive

### Objective

Make Stitch a first-class design gate in repo history without introducing generated source code.

### Source

Restore from stash `preserve stitch matrix planning artifacts before SOPHEX-PRES-001`:

- `docs/design/stitch-public-intelligence-shell/README.md`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/00-source-map.md`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/01-public-product-shell.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/02-property-profile-hero.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/03-comps-map-grid.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/04-underwrite-shell.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/05-source-pack-drilldown.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/06-demo-controls-drawer.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/07-review-export-gate.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/raw-html/08-mobile-property-profile.reference.html`
- `docs/design/stitch-public-intelligence-shell/wave-1/screenshots/*.png`

### Allowed Files

- `docs/design/stitch-public-intelligence-shell/**`
- `docs/SOPHEX_STITCH_DELTA_AND_PRIMITIVES_PLAN.md`
- `docs/SOPHEX_STITCH_IMPLEMENTATION_BRIDGE_PLAN.md`
- `docs/SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md`

### Acceptance Criteria

- Every `SPI-*` screen has screenshot, reference stub, current target route, and adoption ticket.
- Docs state that generated HTML is design evidence only.
- No `prototype/` files changed.
- PR #11 remains unmerged/frozen.

## Lane 1: Universal Public Primitives

### Objective

Create the primitives that subsequent pages must use before they add page-local CSS.

### Work Items

#### `PublicProductNav`

Purpose: single source of truth for public product nav.

Suggested files:

- `prototype/src/components/layout/PublicShell.tsx`
- `prototype/src/components/overlays/PublicMobileNavDrawer.tsx`
- New optional helper: `prototype/src/components/public/PublicProductNav.tsx`

Contract:

- Nav items: `Explore`, `Comps`, `Intelligence`, `Underwrite`, `Review`.
- `Studio` is not part of primary nav; it is a separated secondary action.
- `?state=` is preserved for public fixture-backed links.
- Active-state logic shared by desktop and mobile.
- No fixture/runtime/actor/debug controls.

Acceptance:

- Unit test covers active state for property, comps, review/export/sources.
- E2E confirms public mobile nav opens and primary routes remain reachable.

#### `PublicTrustStrip`

Purpose: normalize advisory/safety/source labels.

Suggested files:

- New optional component under `prototype/src/components/public/`
- Existing users: `PropertyPage`, `LandingPage`, `ReportPage`, `ExportPage`, `ReviewPage`

Required label vocabulary:

- `Advisory / model-inferred`
- `Not an appraisal`
- `Source-confirmed`
- `Public baseline`
- `Export gated`
- `Mock-only`

Acceptance:

- Hero, report, export, review, and source pack use the same label grammar.
- Labels do not imply production authority.

#### `DemoControlsDrawer`

Purpose: make demo controls a reusable drawer rather than a rail/aside pattern.

Suggested files:

- `prototype/src/components/demo/GuidedDemoRail.tsx`
- New optional component: `prototype/src/components/demo/DemoControlsDrawer.tsx`
- `prototype/src/components/motion/SophexSheet.tsx`

Contract:

- Trigger text remains discreet (`Demo`).
- Drawer uses `SophexSheet` or same focus/close semantics.
- Contains guided path, fixture state, prototype actor, reset, route shortcuts.
- Route shortcuts include `Explore` and public guided routes where safe.
- Drawer is visually operator/demo tooling, not product navigation.

Acceptance:

- `guided-demo.spec.ts` passes desktop/mobile.
- Actor selector is only visible after drawer opens.
- Header does not expose fixture/runtime/actor/reset/guided controls.

#### `PublicWorkbenchShell`

Purpose: common layout for comps, source pack, review/export workbench pages.

Suggested files:

- New optional component under `prototype/src/components/public/`
- Consumers: `CompsPage`, `ReviewPage`, `ExportPage`

Contract:

- Header region with title, posture labels, primary actions.
- Main split region: visual/map/table panel plus evidence/control rail.
- Mobile collapses to stacked cards and sticky primary CTA.
- Supports empty/blocked/private-source states.

Acceptance:

- Comps, source pack, review/export do not each invent independent grid CSS.

#### `SpatialHUD` And `SpatialPreviewCard`

Purpose: translate ICSC spatial quality without live map/runtime expansion.

Suggested files:

- `prototype/src/components/spatial/`
- `prototype/src/styles/visual-utilities.css`

Inspired by:

- `ICSC Map Recovery/icsc-war-room-standalone/components/war-room/WarRoomMapHud.tsx`
- `ICSC Map Recovery/icsc-war-room-standalone/components/SiteMiniMap.tsx`

Contract:

- Mock/static map or existing placeholder only unless a runtime lane opens.
- Layer controls grouped by purpose.
- Radius/source chips are visual/provenance only.
- Every spatial fact has source/as-of/provenance copy.

Acceptance:

- No new map dependency.
- No live tile/provider implication.
- Reduced-motion behavior preserved.

## Lane 2: Explore And Property Parity

### Objective

Make the two highest-visibility public surfaces match Stitch hierarchy before deeper workbench pages.

### Explore (`SPI-01`)

Primary file:

- `prototype/src/pages/LandingPage.tsx`

Supporting files:

- `PublicShell`
- `PublicProductNav`
- `PublicTrustStrip`
- `index.css` or visual utility file
- `visual.spec.ts` snapshots

Implementation requirements:

- Replace older page-header rhythm with Stitch-like "Discover Institutional Intelligence" hierarchy.
- Put high-intent search in the hero, not only a form block.
- Show trust strip immediately under hero.
- Use bento market-map and market-intelligence cards.
- Keep current search behavior and sample-property links.
- Header search either routes to Explore with a query or is intentionally disabled with no false promise.
- Footer/legal links remain secondary.

Acceptance gates:

- `/` desktop visual snapshot updated.
- `/` mobile visual snapshot updated.
- Search smoke still passes.
- No runtime/provider/search expansion.

### Property Hero (`SPI-02`, `SPI-08`)

Primary file:

- `prototype/src/pages/PropertyPage.tsx`

Supporting files:

- `PublicTrustStrip`
- `SpatialPreviewCard`
- `AuthorityBadge`
- `MapLayerControlPanel`
- mobile visual snapshots

Implementation requirements:

- Add breadcrumb context: `Intelligence > Texas > Austin > 1200 Commerce St`.
- Keep property address dominant.
- Media card has source/model badges over or adjacent to the image/preview.
- Value/source card explains advisory value range and not-appraisal posture.
- KPI stack includes cap rate, NOI or current fixture analog, square footage/year/occupancy if fixture supports it; otherwise mock-only public baseline with clear source labels.
- Primary action order: `Compare comps`, `Preview report`, `View source pack`.
- Add first-fold explanation of why export remains gated.
- Mobile: compact title, advisory pill, metric cards, sticky primary CTA, no cramped demo controls.

Acceptance gates:

- Desktop visual route `/property/demo-001?state=clean`.
- Mobile visual route `/property/demo-001?state=clean`.
- Evidence drawer still opens.
- `?state=` continuity preserved.

## Lane 3: Comps And Source Workbenches

### Comps (`SPI-03`)

Primary file:

- `prototype/src/pages/CompsPage.tsx`

Implementation requirements:

- Use `PublicWorkbenchShell`.
- Layout: 1/3 map/context panel and 2/3 grid on desktop.
- Sale/Lease tab control.
- Matching count and filter summary.
- Columns: Address, Asset Type, Sale Date, Price/SF or rent analog, Cap Rate, Confidence, Sources.
- Map panel shows priced markers or static marker cards.
- Keep blocked/private labels and provider-rights posture.
- Mobile: cards instead of dense table.

Acceptance gates:

- `/property/demo-001/comps?state=blocked` desktop and mobile QA.
- Report handoff preserves `?state=`.
- Export/download controls remain disabled/simulated.

### Source Pack (`SPI-05`)

Primary file:

- `prototype/src/pages/ReviewPage.tsx` source mode, or split into `SourcePackPage.tsx` if it reduces complexity.

Implementation requirements:

- Convert citation register into traceability flow:
  - Target field.
  - Extracted observation.
  - Evidence document card.
- Document card includes source ref, page/ref, as-of date, source rights, analyst/review posture.
- "View original document" is prototype feedback or disabled.
- Source-rights blockers remain explicit.

Acceptance gates:

- `/sources/demo-001?state=provider-restricted` desktop/mobile QA.
- No live source retrieval implication.
- Export remains gated.

## Lane 4: Review And Export Parity

### Review / Export (`SPI-07`)

Primary files:

- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/ReviewPage.tsx`

Implementation requirements:

- Reframe export gate around:
  - Export gated alert.
  - Requirements checklist.
  - Required resolutions.
  - Export options.
- Preserve current fixture state logic.
- Preserve disabled generate/download action.
- Review actions remain local-only and do not clear export gates.
- Source pack and report handoffs preserve `?state=`.

Acceptance gates:

- `/export/demo-001?state=clean` desktop/mobile QA.
- `/review/demo-001?state=ready-for-review` desktop/mobile QA.
- Unit/e2e confirms disabled export remains disabled.

## Lane 5: Spatial And Motion Polish

### Objective

Make spatial/property visuals feel closer to ICSC quality without taking on live geometry, maps, provider contracts, or source-rights runtime.

Implementation requirements:

- Add `SpatialHUD` with collapsible details, layer groups, source/as-of facts, and selected-property context.
- Add `SpatialPreviewCard` for compact property and comps map preview.
- Add motion utility classes:
  - reveal/stage stagger.
  - rail enter.
  - recede/soften.
  - reduced-motion fallbacks.
- Use existing `--motion-*` tokens first; only add tokens when necessary.
- Keep all spatial actions mock/prototype feedback unless already implemented safely.

Acceptance gates:

- No new package dependency.
- No Leaflet or map provider added without explicit approval.
- Existing visual snapshots updated intentionally.

## Cross-Lane Primitive Contracts

### CSS Ownership

Preferred order:

1. `design-tokens.css` for semantic values.
2. `visual-utilities.css` for reusable utilities.
3. Component-local class in `index.css` only when the primitive is still being extracted.
4. Page-local CSS only as a temporary bridge with a follow-up cleanup note.

Do not add new one-off page classes if an existing primitive can express the same pattern.

### Motion Ownership

Preferred order:

1. Existing `SophexMotionSurface`, `SophexSheet`, `PageTransition`, `TabPanelTransition`.
2. Existing CSS motion tokens.
3. New shared motion utility classes in `visual-utilities.css`.
4. Page-local transitions only for one-off prototype experiments.

Every motion change must respect `prefers-reduced-motion`.

### Navigation Ownership

Public nav route model should be shared. Do not duplicate link arrays in desktop and mobile shell after `SOPHEX-PRIMITIVES-001`.

Public product chrome may include:

- Explore
- Comps
- Intelligence
- Underwrite
- Review
- Separated Studio action
- Search if behavior is clear

Public product chrome must not include:

- Fixture state
- Runtime mode
- Public baseline viewer actor control
- Prototype actor selector
- Reset demo
- Guided path controls
- Debug/prototype badges

### Trust And Safety Ownership

Every public valuation, report, source, review, export, and spatial claim must carry the right safety posture nearby:

- Advisory / model-inferred.
- Not an appraisal.
- Public baseline.
- Source-confirmed where applicable.
- Source-rights blocker where applicable.
- Export gated until review/source/consent gates clear.

## Work Package Specs

### `SOPHEX-DOCS-STITCH-ARCHIVE-001`

Type: docs-only

Branch: `docs/sophex-stitch-reference-archive`

Files:

- `docs/design/stitch-public-intelligence-shell/**`
- `docs/SOPHEX_STITCH_DELTA_AND_PRIMITIVES_PLAN.md`
- `docs/SOPHEX_STITCH_IMPLEMENTATION_BRIDGE_PLAN.md`
- `docs/SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md`

Checks:

- `git diff --check`
- Manual review of image/reference links

Done when:

- Stitch packet is no longer stash-only.
- Matrix links resolve in repo.

### `SOPHEX-PRIMITIVES-001`

Type: prototype UI foundation

Branch: `ui/sophex-primitives-001-public-shell`

Files:

- `prototype/src/components/layout/PublicShell.tsx`
- `prototype/src/components/overlays/PublicMobileNavDrawer.tsx`
- `prototype/src/components/demo/GuidedDemoRail.tsx`
- `prototype/src/components/public/**`
- `prototype/src/components/spatial/**`
- `prototype/src/styles/design-tokens.css`
- `prototype/src/styles/visual-utilities.css`
- `prototype/src/index.css`
- focused tests/snapshots

Checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run budget:check`
- `npm run test -- src/test/a11y-nav.test.tsx src/test/public-routes.test.tsx`
- `npm run test:e2e -- guided-demo`
- `npm run test:e2e`
- API-mode `npm run test:e2e` if snapshots change
- `git diff --check`

Done when:

- Shared nav model exists.
- Demo drawer uses shared sheet/drawer semantics.
- Trust strip primitive exists.
- No route visual behavior regresses unless intentionally rebaselined.

### `SOPHEX-EXPLORE-UI-001`

Type: public page parity

Branch: `ui/sophex-explore-stitch`

Files:

- `prototype/src/pages/LandingPage.tsx`
- public primitives from `SOPHEX-PRIMITIVES-001`
- `prototype/src/index.css`
- `prototype/e2e/visual.spec.ts`
- public landing snapshots

Done when:

- `/` visibly matches `SPI-01` hierarchy.
- Search behavior still works.
- Trust strip and bento cards are above the fold.
- Desktop and mobile snapshots pass.

### `SOPHEX-PROPERTY-HERO-002`

Type: public page parity

Branch: `ui/sophex-property-hero-stitch`

Files:

- `prototype/src/pages/PropertyPage.tsx`
- public trust/spatial primitives
- `prototype/e2e/visual.spec.ts`
- property desktop/mobile snapshots

Done when:

- `/property/demo-001?state=clean` matches `SPI-02` hierarchy.
- Mobile property profile matches `SPI-08` intent.
- Export-gated reason is visible in first fold.
- Evidence drawer and report/comps/source actions still work.

### `SOPHEX-COMPS-UI-001`

Type: public workbench parity

Branch: `ui/sophex-comps-workbench-stitch`

Files:

- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/components/public/**`
- `prototype/src/components/spatial/**`
- tests/snapshots

Done when:

- Comps page reads as split map/grid workbench.
- Confidence/source columns are visible.
- Private/blocked/provider labels remain explicit.
- Report handoff and `?state=` continuity pass.

### `SOPHEX-SOURCE-UI-001`

Type: public source trace parity

Branch: `ui/sophex-source-pack-stitch`

Files:

- `prototype/src/pages/ReviewPage.tsx` or new source page component
- `prototype/src/components/evidence/**`
- tests/snapshots

Done when:

- Source pack follows target-field -> observation -> evidence document flow.
- Source rights and no-live-retrieval posture are unmistakable.
- Export remains gated.

### `SOPHEX-REVIEW-EXPORT-UI-001`

Type: public governance UI parity

Branch: `ui/sophex-review-export-stitch`

Files:

- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/ReviewPage.tsx`
- `prototype/src/components/report-governance/**`
- tests/snapshots

Done when:

- Export page follows checklist/resolution/export-options structure.
- Review page actions stay local-only.
- Generate/download remains disabled.

### `SOPHEX-SPATIAL-UI-001`

Type: spatial UI primitive polish

Branch: `ui/sophex-spatial-primitives`

Files:

- `prototype/src/components/spatial/**`
- `prototype/src/styles/visual-utilities.css`
- `prototype/src/index.css`
- tests/snapshots

Done when:

- `SpatialHUD` and `SpatialPreviewCard` are reusable.
- Map/spatial presentation gains ICSC-level structure without live dependencies.
- Reduced-motion behavior remains correct.

## QA Program

### Required Desktop Routes

- `/`
- `/property/demo-001?state=clean`
- `/property/demo-001/comps?state=blocked`
- `/report/demo-001?state=low-evidence`
- `/export/demo-001?state=clean`
- `/review/demo-001?state=ready-for-review`
- `/sources/demo-001?state=provider-restricted`

### Required Mobile Routes

- `/`
- `/property/demo-001?state=clean`
- `/property/demo-001/comps?state=blocked`
- `/report/demo-001?state=low-evidence`
- `/export/demo-001?state=clean`
- `/review/demo-001?state=ready-for-review`
- `/sources/demo-001?state=provider-restricted`

### Visual QA Checklist

For every page touched, mark `PASS` or `FIX_REQUIRED`:

- Product nav only in header.
- No demo/debug/fixture/actor controls in product chrome.
- Demo controls separate and visibly operator-only.
- Advisory/not-appraisal/export-gated posture visible.
- Source/model/trust labels elegant and near the relevant facts.
- Primary CTA obvious.
- Mobile hierarchy readable without cramped controls.
- Footer/legal does not compete with primary journey.
- No live export/provider/billing/API implication.

## CI And Validation Profile

Minimum for docs-only lanes:

```text
git diff --check
git status --short --branch --untracked-files=all
```

Minimum for primitive or UI lanes:

```text
npm run lint
npm run typecheck
npm run build
npm run budget:check
npm run test:coverage
npm run test:api
npm run test:e2e
VITE_SOPHEX_RUNTIME_MODE=api npm run test:e2e
git diff --check
git status --short --branch --untracked-files=all
```

When snapshots change, run visual snapshots in the same runtime mode used by CI.

## Risk Register

| Risk | Where it appears | Mitigation |
| --- | --- | --- |
| Stitch treated as mood board again | All visual lanes | Each PR must map changed routes to `SPI-*` acceptance gates. |
| Page-local CSS grows again | Explore/property/comps | Land primitives first; reject duplicate nav/trust/workbench CSS. |
| Header regresses into demo harness | Shell/demo lanes | Unit/e2e tests assert no actor/fixture/reset controls in header. |
| Runtime implication leaks into UI | Underwrite/source/export | Keep disabled/simulated actions and explicit blocker copy. |
| Mobile gets deferred | Property/comps/review | Require mobile visual QA and snapshots in each page lane. |
| CI snapshot mismatch | Visual lanes | Run fixture and API-mode e2e when visual baselines are touched. |
| Sister-project copy/paste | Primitive lanes | Harvest patterns only; no source imports or CRE/ICSC edits. |

## Recommended Immediate Next Step

Start with `SOPHEX-DOCS-STITCH-ARCHIVE-001` and `SOPHEX-PRIMITIVES-001`.

Do not start `Explore`, `Property`, `Comps`, or `Source Pack` implementation until the shared nav/trust/drawer primitives are available. That is the fastest way to stop the design from fragmenting again.

