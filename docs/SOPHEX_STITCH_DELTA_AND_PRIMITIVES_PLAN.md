# Sophex Stitch Delta And Universal Primitives Plan

Date: 2026-05-30

Status: planning / audit artifact

Scope: public Sophex presentation architecture, Stitch target adoption, and universal primitive consolidation.

This document inventories the delta between the archived Google Stitch public intelligence shell references and the current Sophex prototype. It also captures reusable primitive patterns from the sister CRE/P51 project and ICSC Map Recovery so Sophex can move toward the intended product system without copying runtime code, schema, provider behavior, billing/export behavior, queues, deploy files, or sister-project application code.

## Source Inventory

### Stitch Public Intelligence Shell

The public Stitch packet is currently preserved in stash `preserve stitch matrix planning artifacts before SOPHEX-PRES-001` and should be restored into a docs-only branch when the design archive needs to become first-class repo history.

| ID | Stitch screen | Screenshot | HTML reference | Primary target |
| --- | --- | --- | --- | --- |
| `SPI-01` | Sophex - Explore Intelligence | `docs/design/stitch-public-intelligence-shell/wave-1/screenshots/01-public-product-shell.png` | `01-public-product-shell.reference.html` | Public shell / Explore |
| `SPI-02` | Property Profile - 1200 Commerce St | `02-property-profile-hero.png` | `02-property-profile-hero.reference.html` | Property hero |
| `SPI-03` | Sophex - Comps | `03-comps-map-grid.png` | `03-comps-map-grid.reference.html` | Comps map/grid |
| `SPI-04` | Sophex - Underwrite | `04-underwrite-shell.png` | `04-underwrite-shell.reference.html` | Underwrite shell |
| `SPI-05` | Sophex - Source Pack Drilldown | `05-source-pack-drilldown.png` | `05-source-pack-drilldown.reference.html` | Source pack |
| `SPI-06` | Sophex - Property Hero & Demo Controls | `06-demo-controls-drawer.png` | `06-demo-controls-drawer.reference.html` | Demo controls drawer |
| `SPI-07` | Sophex - Review | `07-review-export-gate.png` | `07-review-export-gate.reference.html` | Review/export gate |
| `SPI-08` | Property Profile - Mobile | `08-mobile-property-profile.png` | `08-mobile-property-profile.reference.html` | Mobile public shell |

The generated HTML uses Tailwind CDN, duplicate Material Symbols links, generated image URLs, and static utility markup. Treat it as design evidence, not prototype source. Adapt structure into existing Sophex React/CSS primitives.

### Current Sophex Reality

Current branch audited: `ui/sophex-pres-001-nav-shell-stitch`.

Current implementation files:

- `prototype/src/components/layout/PublicShell.tsx`
- `prototype/src/components/overlays/PublicMobileNavDrawer.tsx`
- `prototype/src/components/demo/GuidedDemoRail.tsx`
- `prototype/src/pages/LandingPage.tsx`
- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/ReviewPage.tsx`
- `prototype/src/index.css`
- `prototype/src/styles/design-tokens.css`
- `prototype/src/styles/visual-utilities.css`
- `prototype/e2e/visual.spec.ts`
- `prototype/e2e/guided-demo.spec.ts`
- `prototype/src/test/public-routes.test.tsx`
- `prototype/src/test/a11y-nav.test.tsx`

## Executive Delta

SOPHEX-PRES-001 moved the prototype substantially closer to Stitch: the public header now carries product nav only, Studio is separated, demo controls are isolated in a drawer, mobile has a sheet nav, and the property page has a premium hero with trust badges and primary actions.

The remaining delta is no longer "remove the prototype harness from the header." The next gap is systematic product-surface completion:

1. Make Explore/landing match `SPI-01` rather than remaining a strong but older search page.
2. Push property hero and mobile property profile from "improved" to Stitch-equivalent.
3. Convert comps into the split map/table workbench from `SPI-03`.
4. Translate source pack into a target-field -> observation -> evidence document trace from `SPI-05`.
5. Align review/export to the checklist/resolution/export-options layout from `SPI-07`.
6. Promote universal primitives so future surfaces do not add page-local CSS for every new screen.

## Stitch-To-Reality Matrix

| Stitch ID | Target hierarchy | Current reality | Delta | Recommended ticket | Priority |
| --- | --- | --- | --- | --- | --- |
| `SPI-01` Public product shell | Logo, global search, Explore/Comps/Intelligence/Underwrite/Review, separated Studio pill, high-intent search hero, trust strip, bento market cards | `PublicShell` now has correct product nav and separated Studio. `LandingPage` still carries older "CRE intelligence marketplace" search form, proof strip, Studio continuity banner, and featured property cards. Header search is decorative. | Landing should become the authoritative Explore screen: centered search, market-intelligence bento, trust strip, and header search wired or intentionally disabled with product copy. | `SOPHEX-EXPLORE-UI-001` | P0 |
| `SPI-02` Property hero | Breadcrumbs, property image, source-confirmed/model-inferred badges, estimated value card, KPI panel, Preview Report / View Source Pack / Compare Comps | `PropertyPage` now has `property-intelligence-hero`, trust chips, value range, trust strip, primary actions, evidence drawer, map placeholder, and KPI strip. | Needs breadcrumb/path context, richer media treatment, value/source card hierarchy, cleaner "why export gated" explainer near first fold, and mobile-specific sticky CTA. | `SOPHEX-PROPERTY-HERO-002` | P0 |
| `SPI-03` Comps map/grid | Comps active nav, 1/3 map + 2/3 spreadsheet grid, sale/lease tabs, matching count, confidence/source chips, map markers/layer controls | `CompsPage` has saved views, provider-rights posture, table/list context, blocked/private labels, and report handoff. It is behaviorally strong but not Stitch workbench-shaped. | Needs split map/table composition, comparable rows with confidence/source counts as first-class columns, filter controls, sale/lease tabs, and mobile comp-card fallback. | `SOPHEX-COMPS-UI-001` | P1 |
| `SPI-04` Underwrite shell | Underwrite active nav, advisory/not-appraisal banner, assumptions, pro forma grid, valuation summary, evidence panel | Current product nav links to Studio underwriting. Studio underwriting is strong but internally dense and not public-underwrite shaped. | Decide whether public Underwrite should remain a Studio handoff or gain a public preview shell. If preview, keep mock-only and disabled export/report actions. | `SOPHEX-UNDERWRITE-PREVIEW-001` | P2 |
| `SPI-05` Source pack drilldown | Traceability flow: target field, extracted observation, sourced evidence document, highlighted document preview, verified-by-analyst posture | `/sources/:id` is implemented via `ReviewPage` source mode with citations, source-rights blockers, disabled export, and local-only actions. | Needs Stitch trace model and document-card hierarchy: target field -> observation -> evidence doc. Keep "view original" as simulated unless source-rights lane opens. | `SOPHEX-SOURCE-UI-001` | P1 |
| `SPI-06` Demo controls drawer | Clean product shell, right-side Demo Controls drawer, Internal Operator Utility warning, guided path, fixture state, prototype actor, reset | `GuidedDemoRail` is now a fixed `Demo` trigger and right drawer with guided path, fixture state, actor selector, reset, warning copy, and URL-only continuity. | Mostly aligned. Remaining gaps: route shortcuts could include Explore/Upload, drawer could use shared `SophexSheet` rather than page-local aside, and desktop/mobile affordance placement needs formal primitive. | `SOPHEX-DEMO-CONTROLS-002` | P2 |
| `SPI-07` Review/export gate | Review & Export header, export gated alert, checklist, required resolutions, export options, disabled Download Branded Report | `ExportPage` and `ReviewPage` are behaviorally strong: fixture states, blockers, disabled generate, modal, review/source handoffs. Layout still reads more prototype cockpit than Stitch checklist/resolution panel. | Reframe to checklist + required resolutions + export options. Keep existing blocker logic and disabled actions. | `SOPHEX-REVIEW-EXPORT-UI-001` | P1 |
| `SPI-08` Mobile property profile | Compact property title, advisory pill, hero image, metrics, trust chips, summary cards, sticky Compare Comps CTA, bottom nav | `PublicMobileNavDrawer` is a real product sheet and property page is responsive. Only landing has explicit mobile snapshot coverage. | Needs mobile-specific property profile pass: sticky primary CTA, compact metric cards, bottom nav or equivalent, mobile visual coverage for property/comps/report/export/review/source. | `SOPHEX-MOBILE-UI-001` | P0 |

## Universal Primitive Inventory

### Established In Sophex

| Primitive area | Current assets | Keep / consolidate | Gap |
| --- | --- | --- | --- |
| Design tokens | `prototype/src/styles/design-tokens.css` defines ink/paper/parchment/forest/gold, button variables, studio tokens, motion durations, type scale | Keep as universal foundation. Promote component-facing token names for shell, panel, chip, and data-grid usage. | `index.css` still holds many page-specific rules; token usage is uneven. |
| Visual utilities | `prototype/src/styles/visual-utilities.css` defines `.micro-label`, `.fin-value`, elevation, hover-lift, active nav, table density, map HUD detail, empty state, route loading, proof strip | Keep and expand as the place for primitives that repeat across public and Studio surfaces. | Some obsolete shell/actor selectors remain from earlier harness patterns. |
| Motion | `SophexMotionSurface`, `SophexSheet`, `PageTransition`, `TabPanelTransition`, CSS motion variables, reduced-motion guards | Keep. Every drawer/sheet/card transition should use these before local animation. | Demo drawer currently uses local aside/scrim classes instead of `SophexSheet`. |
| Product shell | `PublicShell`, `.shell-header`, `.shell-search`, `.shell-nav`, `.shell-studio-entry`, `PublicMobileNavDrawer` | Keep as the public shell primitive. | Header search contract not established; active-state logic duplicated between desktop/mobile. |
| Demo controls | `GuidedDemoRail`, `demo-controls-trigger`, `demo-controls-drawer`, fixture state utilities | Keep behavior, migrate visual shell to shared drawer primitive. | Drawer route support omits landing/upload; actor selector is local. |
| Trust/authority | `AuthorityBadge`, authority vocabulary, trust chips, `RuntimeResourceStatus`, proof strips, mock boundary banners | Keep. Make a public trust-strip primitive to replace one-off spans. | "Source-confirmed/model-inferred" appears as local hero chips rather than a reusable component. |
| Data density | `.studio-table.inst-table`, `DataWorkbenchShell`, Studio primitives, evidence lists | Reuse for comps/source pack when adapting Stitch grid/drilldown. | Public comps lacks a shared map/table workbench primitive. |
| Map/spatial | `MapPlaceholderPreview`, `MapLayerControlPanel`, map layer list, authority labels | Keep for mock-only spatial evidence. | Needs ICSC-inspired HUD/card composition and richer mobile map fallback. |

### P51 / CRE Transfer Map

| Source | Transfer to Sophex | Do not transfer |
| --- | --- | --- |
| `apps/core/components/navigation/TopBar.tsx` | Fixed/elevated topbar quality, restrained controls, warm border, backdrop-like depth | Authenticated workspace/account controls |
| `apps/core/components/navigation/PersistentMainMenu.tsx` | Drawer separation, primary destinations, active-state treatment, section headings, route-close behavior, concise badges | Operating lens customization, drag/drop menu editing, internal operator density, user/session account controls |
| `apps/core/components/mobile/MobileBottomNav.tsx` | Bottom-nav mental model, More sheet pattern, active-path helper, keyboard-aware hiding, grouped more panel | Authenticated workspace switcher, Jarvis/dialer/tasks/operator tabs, role/permission menu generation |
| `apps/core/components/layout/OffCanvasMenu.tsx` | Accessible drawer/backdrop pattern, route-change close behavior, body-scroll lock, icon + label nav rows | CRE branding, account footer, sign-out/profile actions, generic admin route set |
| `apps/core/components/navigation/PageTransitionShell.tsx` and `apps/core/lib/motion-tokens.ts` | Named motion specs, reveal/sheet/backdrop presets, reduced-motion fallback | Motion tied to internal route ownership or OS command surfaces |
| `apps/core/components/operations/doctrine-workbench/PanelShell.tsx` | Institutional panel grammar: eyebrow, title, description, warm/gold border, dark warm surface | Internal doctrine/operator labels |
| `packages/shared-layouts/src/components/DockedSidebarLayout.tsx` | Route-local dock/inspector layout for evidence, comps, source-rights, review rails | Authenticated workspace layout assumptions |
| CRE/P51 docs/nav audit artifacts | Route visibility discipline and "nav is not security" principle | Any implication that public Sophex nav grants access or internal workflow authority |

### ICSC Map Recovery Transfer Map

| Source | Transfer to Sophex | Do not transfer |
| --- | --- | --- |
| `icsc-war-room-standalone/components/war-room/WarRoomMapHud.tsx` | Collapsible map HUD, layer controls grouped by purpose, radius chips, selected-site action chips, mobile touch sizing, summary title | Real packet minting, retailer gap analysis claims, live map actions that imply source authority |
| `icsc-war-room-standalone/components/SiteMiniMap.tsx` | Compact mini-map card primitive, no-scroll map, rounded/bordered spatial preview | Direct Leaflet dependency in public prototype unless approved; external tile/source assumptions |
| `icsc-war-room-standalone/app/globals.css` | Presentation mode, reveal/recede/rail-enter motion vocabulary, marker/ring animation concepts, reduced diagnostic chrome | Hardcoded colors, production KML/data ingestion assumptions, retailer/broker-specific language |
| `icsc-war-room-standalone/lib/war-room/motion-tokens.ts` | Duration/easing/stagger/elevation tokens for map and rail motion | Any hardcoded visual values that conflict with Sophex tokens |
| `icsc-war-room-standalone/components/war-room/ProofMetricCards.tsx` | Proof metric triplet pattern with label, subtitle, tabular value, footnote | Retailer-specific proof copy |
| `icsc-war-room-standalone/lib/war-room/pitch.ts` | `splitProofValueFootnote()` and provenance-line shaping ideas | Pitch-specific claims, QSR/retailer framing |
| `icsc-war-room-standalone/components/war-room/VoiceCaptureDrawer.tsx` | Mobile bottom snap sheet mechanics | Voice capture workflow/business logic |

## Primitive Build Plan

### Phase 0: Freeze And Archive References

Goal: make Stitch a gate, not a mood board.

- Restore `docs/design/stitch-public-intelligence-shell/**` from stash into a docs-only commit or dedicated docs PR.
- Keep raw HTML as reference stubs only.
- Add every screenshot to the audit matrix with target routes and acceptance criteria.
- Do not merge PR #11.

### Phase 1: Universal Shell Primitives

Goal: reduce page-local shell CSS before the next visual pass.

- Create or formalize a `PublicProductNav` helper shared by `PublicShell` and `PublicMobileNavDrawer`.
- Define a `PublicTrustStrip` primitive for advisory/not-appraisal/source-confirmed/model-inferred/export-gated labels.
- Move demo drawer structure onto `SophexSheet` while preserving the separate operator/demo visual language.
- Decide header search behavior: either wire to landing route/search params or mark as product preview with no false runtime implication.
- Add public mobile visual snapshots for property, comps, report, export, review, and source pack.

### Phase 2: Explore And Property Parity

Goal: make the first impression match `SPI-01` and `SPI-02`.

- Rework `LandingPage` into the Explore shell: high-intent centered search, trust strip, bento cards, market intelligence card, and featured-property action hierarchy.
- Rework `PropertyPage` first fold: breadcrumbs, larger media card, value/source card, KPI stack, export-gated explainer, and mobile sticky CTA.
- Reuse `AuthorityBadge`, `fin-value`, proof strip, motion primitives, and new trust-strip primitive.

### Phase 3: Workbench Surfaces

Goal: translate Stitch comps/source/review surfaces without runtime expansion.

- `CompsPage`: add split map/table workbench, sale/lease tabs, confidence/source count columns, filter affordances, mobile card fallback.
- `ReviewPage` source mode: rebuild as target-field -> observation -> evidence document trace.
- `ExportPage`/`ReviewPage`: align to checklist + required resolutions + export options layout.
- Keep every export/download/source retrieval action disabled or simulated.

### Phase 4: Spatial And Motion Polish

Goal: import ICSC-quality spatial presentation while keeping Sophex mock-only.

- Add a public `MapHudPanel` primitive inspired by ICSC `WarRoomMapHud`.
- Add a compact `SpatialPreviewCard` primitive inspired by ICSC `SiteMiniMap`, but keep it static/mock unless a runtime lane opens.
- Standardize reveal/recede/rail-enter motion with existing Sophex motion tokens and reduced-motion behavior.
- Keep provenance labels beside every spatial fact.

## Route-Level Acceptance Checklist

| Route | Stitch target | Pass gate before merge |
| --- | --- | --- |
| `/` | `SPI-01` | Product nav only, wired or explicitly preview search, trust strip, bento cards, no demo controls in chrome |
| `/property/demo-001?state=clean` | `SPI-02`, `SPI-08` | Strong address hierarchy, hero media, trust/source chips, KPI stack, export-gated explainer, primary CTA visible on mobile |
| `/property/demo-001/comps?state=blocked` | `SPI-03` | Split map/table, sale/lease tabs, confidence/source columns, blocked/private labels, mobile fallback |
| `/report/demo-001?state=low-evidence` | Stitch report/governance language | Advisory/not-appraisal, readiness rail, section posture, disabled export |
| `/export/demo-001?state=clean` | `SPI-07` | Checklist, required resolutions, export options, disabled generate/download, blocker copy |
| `/review/demo-001?state=ready-for-review` | `SPI-07` | Review queue reads like product workflow, actions local-only, export remains gated |
| `/sources/demo-001?state=provider-restricted` | `SPI-05` | Target field -> observation -> evidence doc trace, source-rights copy, no live retrieval |

## Non-Negotiable Boundaries

- No schema, DB, Prisma, migrations, generated clients.
- No runtime/API implementation beyond existing sandbox/fixture adapters.
- No live export, live valuation, billing, provider/send, queue/worker, Railway, deploy.
- No package or lockfile changes for this planning lane.
- No CRE/P51 or ICSC code edits.
- Do not copy generated Stitch HTML or Tailwind CDN output into the prototype.
- Keep public UI proof-honest: advisory, model-inferred, not an appraisal, export gated, mock/prototype posture visible but not dominant.

## Proposed Ticket Sequence

1. `SOPHEX-DOCS-STITCH-ARCHIVE-001`: restore public Stitch images/html stubs into `docs/design/stitch-public-intelligence-shell/**`.
2. `SOPHEX-PRIMITIVES-001`: public nav model, trust strip, drawer/sheet standard, shared active-state helper.
3. `SOPHEX-EXPLORE-UI-001`: Stitch Explore landing shell.
4. `SOPHEX-PROPERTY-HERO-002`: Stitch property hero + mobile sticky CTA.
5. `SOPHEX-MOBILE-UI-001`: mobile snapshots and bottom/sheet nav decision.
6. `SOPHEX-COMPS-UI-001`: comps split map/grid workbench.
7. `SOPHEX-SOURCE-UI-001`: source pack traceability flow.
8. `SOPHEX-REVIEW-EXPORT-UI-001`: review/export checklist/resolution/options shell.
9. `SOPHEX-SPATIAL-UI-001`: ICSC-inspired map HUD and spatial preview primitives.

## Recommended Next PR

Start with `SOPHEX-DOCS-STITCH-ARCHIVE-001` plus `SOPHEX-PRIMITIVES-001` only.

Reason: the next implementation pass should not redesign four pages while primitives are still being invented page-by-page. First establish the universal CSS/component vocabulary, then apply it to Explore and Property.

