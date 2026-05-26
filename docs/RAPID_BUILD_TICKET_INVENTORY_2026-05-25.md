# Rapid Build Ticket Inventory - 2026-05-25

This inventory confirms the current implementation ticket base for the rapid UI/prototype/product workflow lane.

It does not create external issue-tracker tickets by itself. It preserves the Composer-ready ticket IDs from the accepted rollout plan and classifies them for continued execution or tracker conversion.

## Boundary

- Allowed now: mock-only prototype UI, deterministic fixtures, docs, tests, Storybook, Playwright, Lighthouse, and product workflow copy.
- Not allowed now: schema, migrations, generated clients, DB reads/writes, provider calls, queues, deploys, real upload/OCR, persisted reviewer decisions, immutable storage, signed checksums, or `.env` usage.
- Sister-schema alignment remains future-gated under `SISTER_SCHEMA_BORROWING_GATE.md` and `SISTER_SCHEMA_HARVEST_PACKET.md`.

## Existing Rollout Tickets

| Ticket                                     | Area        | Current status           | Next action                                                                           |
| ------------------------------------------ | ----------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `SOPHEX-FE-DESIGN-SYSTEM-AUDIT`            | Foundation  | Implemented in docs      | Keep as completed baseline; convert to tracker only if historical tracking is needed. |
| `SOPHEX-FE-UI-TOKENS-SURFACES`             | Foundation  | Implemented in prototype | Keep polishing via product workflow tickets.                                          |
| `SOPHEX-FE-POSTURE-BADGE-STANDARD`         | Foundation  | Implemented in prototype | Continue consolidating copy through future UI polish.                                 |
| `SOPHEX-FE-OVERLAY-STANDARD`               | Foundation  | Implemented in prototype | Keep as reusable base for new drawers/modals.                                         |
| `SOPHEX-FE-WORKFLOW-READINESS-RAIL`        | Foundation  | Implemented in prototype | Reuse across route polish and report/export gates.                                    |
| `SOPHEX-FE-EVIDENCE-TRACE-PRIMITIVES`      | Foundation  | Implemented in prototype | Extend through workflow continuity work.                                              |
| `SOPHEX-FE-CALCULATION-BREAKDOWN-DRAWER`   | Interaction | Implemented in prototype | Polish copy, formula trace, and source-posture consistency.                           |
| `SOPHEX-FE-EVIDENCE-CONFLICT-RESOLVER`     | Interaction | Implemented in prototype | Extend into intake-to-assumptions workflow.                                           |
| `SOPHEX-FE-EXPORT-MANIFEST-PREVIEW`        | Interaction | Implemented in prototype | Enrich report/export spine with evidence appendix and redaction states.               |
| `SOPHEX-FE-VERSION-LOCK-CONFIRMATION`      | Interaction | Implemented in prototype | Connect more tightly to valuation timeline and report export gates.                   |
| `SOPHEX-FE-SENSITIVITY-CELL-DRILLDOWN`     | Interaction | Implemented in prototype | Extend scenario governance copy and keyboard coverage as needed.                      |
| `SOPHEX-FE-UNDERWRITING-EXECUTIVE-COCKPIT` | Page        | Implemented in prototype | Polish hierarchy, advisory copy, and evidence-to-export continuity.                   |
| `SOPHEX-FE-SCENARIO-DIFF-VIEW`             | Page        | Implemented in prototype | Tighten scenario lock and source posture behavior.                                    |
| `SOPHEX-FE-ASSUMPTION-SOURCE-TRACE-ROUTE`  | Page        | Implemented in prototype | Use as the canonical evidence trace destination.                                      |
| `SOPHEX-FE-RENTROLL-T12-NORMALIZATION`     | Page        | Implemented in prototype | Connect more clearly to intake and assumption promotion gates.                        |
| `SOPHEX-FE-DEBT-LENDER-QUOTE-PANEL`        | Page        | Implemented in prototype | Keep lender quote missing posture aligned with export/version gates.                  |
| `SOPHEX-FE-VALUATION-VERSION-TIMELINE`     | Page        | Implemented in prototype | Connect timeline refs to future schema harvest concepts.                              |
| `SOPHEX-FE-STORYBOOK-STITCH-COVERAGE`      | Quality     | Implemented in prototype | Keep adding stories when reusable primitives evolve.                                  |
| `SOPHEX-FE-VISUAL-QA-STITCH-PAGES`         | Quality     | Implemented in prototype | Visual baselines need intentional review before snapshot updates.                     |

## Tracker Conversion Recommendation

If these are moved into an external tracker, do not reopen all 19 as active work. Convert them as follows:

- Completed reference tickets: all 19 above.
- Active follow-up epic: `SOPHEX-FE-WORKFLOW-POLISH-EPIC`.
- Future gated epic: `SOPHEX-SCHEMA-HARVEST-EPIC`.

This keeps the tracker focused on the next build wave rather than duplicating completed implementation history.

## Next Active Ticket Pack

Wave 5 polish is complete. The next lanes are **operator-gated**:

- **Schema harvest:** `SISTER_SCHEMA_HARVEST_PACKET.md` (requires `SISTER_SCHEMA_BORROWING_GATE.md` approval)
- **Runtime/provider integration:** outside mock-only prototype boundary
- **Optional UI follow-up:** convert completed tickets to tracker epics per recommendation below

Historical product workflow tickets remain in `COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_PRODUCT_WORKFLOWS.md`.

**Mock resolution tracking:** use [MOCK_RESOLUTION_REGISTRY.md](MOCK_RESOLUTION_REGISTRY.md) as the canonical checklist of mock-only routes, fixtures, simulated CTAs, and disabled gates to resolve when gated lanes open.

**Living execution tracker:** use [SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md](SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md) for the next visual/runtime wave — route scores, component coverage, ticket status, validation evidence, and blocked vs ready lanes. Wave history remains in this inventory; product route specs remain in `WORLD_CLASS_PROTOTYPE_SPEC.md`.

## Product Workflow Tickets (Wave 2)

| Ticket                                           | Status                   | Notes                                                                   |
| ------------------------------------------------ | ------------------------ | ----------------------------------------------------------------------- |
| `SOPHEX-FE-WORKFLOW-UNDERWRITING-SPINE-POLISH`   | Implemented in prototype | Workflow spine nav, expanded handoffs, assumptions source trace link    |
| `SOPHEX-FE-WORKFLOW-INTAKE-TO-ASSUMPTIONS`       | Implemented in prototype | Intake workflow nav, data-review conflict resolver, staged import copy  |
| `SOPHEX-FE-WORKFLOW-SCENARIO-GOVERNANCE`         | Implemented in prototype | Scenario page title fix, gate implications column, lock blocker copy    |
| `SOPHEX-FE-WORKFLOW-REPORT-EXPORT-SPINE`         | Implemented in prototype | Export manifest card, evidence appendix, redaction copy                 |
| `SOPHEX-FE-WORKFLOW-PUBLIC-TO-STUDIO-CONTINUITY` | Implemented in prototype | PublicStudioContinuityBanner on landing/property/report/export          |
| `SOPHEX-FE-DESIGN-REFERENCE-BACKLOG`             | Documented               | Capital Stack/Waterfall, IC Packet, HITL drawer remain design reference |

## Design Reference Backlog (Do Not Promote Without New Ticket)

These Stitch surfaces remain **design reference only** until explicitly promoted with mock-only boundaries:

- ~~Capital Stack / Waterfall View~~ → **Promoted Wave 3** (`/studio/deals/:dealId/capital-stack`)
- ~~Investment Committee / Approval Packet~~ → **Promoted Wave 3** (`/studio/deals/:dealId/ic-packet`)
- ~~Reviewer Assignment / HITL Drawer~~ → **Promoted Wave 3** (`/studio/deals/:dealId/hitl-review`)

See `STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md` and `docs/design/stitch-underwriting-workstation/QUALITY_REVIEW.md`.

## Wave 3 Complete (2026-05-25)

| Track                      | Status      | Notes                                                                   |
| -------------------------- | ----------- | ----------------------------------------------------------------------- |
| Design reference promotion | Implemented | Capital stack, IC packet, HITL review routes with mock-only gates       |
| GIS contract spine         | Implemented | `lib/gis`, spatial workbench route, manifest/source-rights/verification |
| Phase 2 quality expansion  | Implemented | Route titles, Lighthouse URLs, e2e + unit tests for Wave 3              |

## Wave 4 Complete (2026-05-25)

| Track                            | Status      | Notes                                                                                            |
| -------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| Unified valuation readiness rail | Implemented | `ValuationReadinessRail` on public report/export, comps, studio report builder, version timeline |
| Version ↔ export linkage         | Implemented | Version timeline export eligibility, IC/report handoffs, evidence snapshot copy                  |
| GIS performance budgets          | Implemented | `lib/gis/performance`, spatial workbench layer budget table                                      |
| Quality coverage                 | Implemented | Storybook, unit tests, e2e extensions for Wave 4                                                 |

## Wave 5 Complete (2026-05-25)

| Track                   | Status      | Notes                                                                                      |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| Visual regression       | Implemented | Playwright snapshots for capital stack, IC packet, HITL review, spatial, version readiness |
| Storybook polish        | Implemented | `Wave3Polish.stories.tsx` for AdvancedWorkflowNav, ReviewerAssignmentDrawer, trust tiers   |
| HITL / trust-tier copy  | Implemented | `HitlTrustTierBadge`, HITL queue + Broker OS projection, assignment drawer tiers           |
| Cross-entity e2e        | Implemented | `demo-001`↔`riverside-flats`, `demo-002`↔`1200-tech` public→Studio continuity              |
| CTA accessibility audit | Implemented | Disabled Export Waterfall, Send to IC, Approve for export use `aria-describedby`           |
| Quality coverage        | Implemented | `hitl-trust-tier.test.ts`, extended `cta-feedback.test.tsx`, Storybook a11y                |

## Wave 6 UX Polish (2026-05-25)

| Track                         | Status      | Notes                                                                           |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------- |
| Underwriting UX review doc    | Implemented | `UNDERWRITING_WORKFLOW_UX_REVIEW_2026-05-25.md`                                 |
| Deal stage stepper            | Implemented | Six-stage model on all deal workflow tabs                                       |
| Deal cockpit next action      | Implemented | Overview cockpit card with blocker count and resolution link                    |
| Gate resolution copy          | Implemented | `GateResolutionCallout` pattern on debt and related surfaces                    |
| Navigation/copy refresh       | Implemented | Evidence/Snapshots labels, advanced nav gate hints, valuation snapshot language |
| Delivery continuity           | Implemented | Report breadcrumb, mock-boundary banners, Underwrite in Studio CTA              |
| Mock resolution registry sync | Implemented | `MOCK_RESOLUTION_REGISTRY.md` updated for Wave 6 workflow UX layer              |

## Wave 7 Runtime Bridge And Staging (2026-05-25)

| Track                         | Status      | Notes                                                                                       |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| Studio sandbox API            | Implemented | `/studio/dashboard`, deals, comps, report-builder, scenarios, workflow progress/next-action |
| API client studio wiring      | Implemented | `sandbox-api-client.ts` studio ports no longer fall back to fixtures                        |
| Vite sandbox middleware       | Implemented | `plugins/sandbox-api-plugin.mjs` serves `/sandbox/v0/*` with staging security headers       |
| Standalone sandbox server     | Implemented | `npm run sandbox:server` on port 8787                                                       |
| Underwriting sub-tabs         | Implemented | Cockpit / source trace / debt nested under Underwriting tab                                 |
| HITL drawer layer             | Implemented | `HitlReviewDrawer` on underwriting cockpit; route preserved for deep links                  |
| Gate resolution expansion     | Implemented | Callouts on underwriting, data-review, scenarios, snapshots                                 |
| CI API tests                  | Implemented | `test:api` in prototype CI quality job                                                      |
| API-mode e2e smoke            | Implemented | `e2e/api-mode.spec.ts`; CI builds with `VITE_SOPHEX_RUNTIME_MODE=api`                       |
| Staging deploy config         | Implemented | `netlify.toml`, `public/_headers`, staging checklist status refresh                         |
| Mock resolution registry sync | Implemented | Sandbox runtime adapter layer logged post-`674d023` bridge                                  |

## Wave 8 CRE Cockpit Utilization (2026-05-25)

| Track                                | Status      | Notes                                                                                          |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| CRE cockpit harvest matrix           | Implemented | `CRE_PLATFORM_COCKPIT_HARVEST_2026-05-25.md` records copy/adapt/reference decisions            |
| Confidence and next-action utilities | Implemented | `lib/workflow/confidence.ts` and `lib/workflow/next-action.ts` unify advisory escalation copy  |
| Bento state contract                 | Implemented | `BentoTile`, `BentoGrid`, `BentoSection`, and skeleton/empty/error states                      |
| Deal cockpit composition             | Implemented | `DealCockpitPanel` on overview and underwriting cockpit                                        |
| Contextual HITL                      | Implemented | Shared review assignments source feeds HITL drawer and analyst review route                    |
| Evidence workbench shell             | Implemented | `DataWorkbenchShell` adds table/list/grid switching on source trace and data review            |
| AI task pulse                        | Implemented | Mock-only AI/reviewer task projection appears in cockpit surfaces                              |
| Quality coverage                     | Implemented | `wave8-cockpit.test.tsx` covers confidence, next-action precedence, and bento empty-state copy |

### Wave 8 Closeout Ticket Ledger

Canonical ticket pack: [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_CRE_COCKPIT.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_CRE_COCKPIT.md)

| Ticket                                        | Status                | Notes                                       |
| --------------------------------------------- | --------------------- | ------------------------------------------- |
| `SOPHEX-FE-WAVE-8-CRE-COCKPIT-HARVEST-MATRIX` | Implemented on master | CRE source copy/adapt/reference matrix      |
| `SOPHEX-FE-COCKPIT-BENTO-STATE-CONTRACT`      | Implemented on master | Sophex-native bento state primitives        |
| `SOPHEX-FE-COCKPIT-DEAL-PANEL-COMPOSITION`    | Implemented on master | Shared overview/underwriting cockpit panel  |
| `SOPHEX-FE-UW-CONFIDENCE-HITL-ACTIONS`        | Implemented on master | Confidence-aware shared HITL assignments    |
| `SOPHEX-FE-EVIDENCE-DATA-WORKBENCH-SHELL`     | Implemented on master | Table/list/grid shell for evidence surfaces |
| `SOPHEX-FE-COCKPIT-AI-TASK-PULSE`             | Implemented on master | Mock-only AI/reviewer task pulse            |
| `SOPHEX-FE-COCKPIT-STORYBOOK-AND-TESTS`       | Implemented on master | Storybook and Vitest coverage               |
| `SOPHEX-DOCS-CRE-COCKPIT-HARVEST-SYNC`        | Implemented on master | Registry, UX, MVP0, and spec sync           |

## Wave 9 Install / Polish (2026-05-25)

| Track                              | Status      | Notes                                                                                         |
| ---------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| Cockpit visual polish              | Implemented | Responsive bento breakpoints, cockpit stack spacing, duplicate heading cleanup                |
| Spatial workbench integration      | Implemented | `GisRoutes` uses `DataWorkbenchShell` with source-rights/verification header controls       |
| Cockpit runtime port enrichment    | Implemented | `/studio/deals/:dealId/cockpit` projection; `DealCockpitPanel` consumes unified advisory port |
| HITL confidence e2e flows          | Implemented | Underwriting drawer/detail flow in `flows.spec.ts`; API-mode cockpit smoke in `api-mode.spec.ts` |
| Visual regression baselines        | Implemented | New cockpit/spatial snapshots; existing studio baselines refreshed                            |

### Wave 9 Ticket Ledger

| Ticket                                             | Status      | Notes                                                           |
| -------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| `SOPHEX-FE-COCKPIT-VISUAL-POLISH`                  | Implemented | Responsive spacing, visual hierarchy, and visual baselines      |
| `SOPHEX-FE-EVIDENCE-WORKBENCH-SPATIAL-INTEGRATION` | Implemented | Spatial route uses Evidence Workbench shell                     |
| `SOPHEX-FE-COCKPIT-RUNTIME-PORT-ENRICHMENT`        | Implemented | Sandbox cockpit projection with actor-filtered review summary   |
| `SOPHEX-FE-HITL-CONFIDENCE-E2E-FLOWS`              | Implemented | Browser coverage for confidence-aware HITL drawer/detail paths  |
| `SOPHEX-FE-WAVE-8-LIGHTHOUSE-VISUAL-REGRESSION`    | Implemented | Visual baselines updated; per-file CSS budget adjusted to 54 KB |

## Wave 10 UX Workflow Legibility (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Advanced surface triggers | Implemented | `ContextualSurfaceTriggers` on data-review, scenarios, snapshots, report builder |
| Snapshot language | Implemented | Scenario-to-snapshot governance card on versions route |
| Mock boundary banners | Implemented | Evidence and scenario variants on high-risk evidence/scenario routes |
| Report breadcrumb context | Implemented | Report builder breadcrumb links active valuation snapshot |
| Lighthouse expansion | Implemented | Deal cockpit overview route added to Lighthouse CI |

### Wave 10 Ticket Ledger

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-FE-UW-ADVANCED-SURFACE-TRIGGERS` | Implemented | Contextual handoffs on evidence, scenario, governance, and delivery routes |
| `SOPHEX-FE-UW-SNAPSHOT-LANGUAGE` | Implemented | Scenario vs snapshot copy and compare link on versions page |
| `SOPHEX-FE-UW-REPORT-BREADCRUMB` | Implemented | Snapshot ID in report builder breadcrumb trail |
| `SOPHEX-FE-UW-MOCK-BOUNDARY-BANNERS` | Implemented | Evidence/scenario mock boundary banners added |
| `SOPHEX-FE-LIGHTHOUSE-EXPAND` | Implemented | `/studio/deals/riverside-flats` added to Lighthouse URLs |

## Wave 11 UX Closeout (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Grouped deal nav | Implemented | Core / Evidence / Model / Delivery groups in `DealWorkflowTabs` |
| War-room context strip | Implemented | `DealContextStrip` surfaces stage, blockers, trust tier, pending reviews |
| Advanced nav integration | Implemented | `AdvancedWorkflowNav` centralized in `DealWorkflowTabs`; duplicates removed |
| Extended surface triggers | Implemented | Intake, comps, debt, and source-trace contextual handoffs |
| Storybook coverage | Implemented | `Wave10Workflow.stories.tsx` for banners, triggers, strip, grouped nav |
| Wave 11 tests | Implemented | `wave11-ux.test.tsx` + story composition coverage |

### Wave 11 Ticket Ledger

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-FE-UW-NAV-GROUPING` | Implemented | Grouped workflow tabs with integrated advanced nav |
| `SOPHEX-FE-UW-WAR-ROOM-CONTEXT-STRIP` | Implemented | Advisory cockpit context strip on all deal tab routes |
| `SOPHEX-FE-UW-EXTENDED-SURFACE-TRIGGERS` | Implemented | Contextual handoffs on intake, comps, debt, source-trace |
| `SOPHEX-FE-WAVE-11-STORYBOOK-AND-TESTS` | Implemented | Storybook + Vitest + API-mode e2e selector updates |

## Wave 12 Shell Motion Closeout (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Shell nav motion wiring | Implemented | `navRail` on grouped deal tabs and stage stepper |
| Workbench motion policy | Implemented | `sync` crossfade; static render under reduced motion; view-change SR announcement |
| Spatial map selection motion | Implemented | `mapSelection` on `MapLayerControlPanel` selected detail |
| Broker/public mobile nav | Implemented | Broker OS keeps mobile menu; public shell adds drawer nav |
| Topbar panel accessibility | Implemented | Focus trap, Escape, focus restore, `aria-modal`, `aria-controls` |
| Gate resolution expansion | Implemented | Callouts on export, report, capital stack, IC, HITL, staged import |
| Authority/status vocabulary | Implemented | `StatusBadge` routes recognized states through shared vocabulary |
| Motion/a11y test hardening | Implemented | Reduced-motion component tests, comps axe, upload progress RTL, broker/public mobile e2e |
| Tab panel continuity | Implemented | Stable deal tab chrome; `tabPanel` crossfade on route and segmented-control switches |
| Visual design system | Implemented | Wave 13 token harvest, institutional green/gold, CSS split, `/studio/design-system` reference |
| `SOPHEX-VIS-TOKEN-HARVEST` | Implemented on master | design-tokens.css + visual-utilities.css; CRE green/gold replaces legacy studio blue |
| `SOPHEX-VIS-DESIGN-ROUTE` | Implemented on master | `/studio/design-system` live token/badge/table/bento reference |
| `SOPHEX-VIS-PRESENTATION-MODE` | Implemented on master | Topbar toggle + localStorage; `.presentation-mode` demo polish |
| `SOPHEX-VIS-ROUTE-LOADING` | Implemented on master | Branded route-family loading panels; legacy SR fallback preserved |
| `SOPHEX-VIS-INST-TABLE-DEFAULT` | Implemented on master | `DataTable` dense institutional mode on by default |

### Wave 12 Ticket Ledger

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-SHELL-MOTION-TOKENS` | Implemented on master | Extended navRail, workbenchPanel, mapSelection token definitions |
| `SOPHEX-SHELL-NAV-MOTION` | Implemented on master | Grouped tabs, stage stepper, sidebar aria-current |
| `SOPHEX-WORKBENCH-PANEL-MOTION` | Implemented on master | Lighter sync transitions + reduced-motion bypass |
| `SOPHEX-SPATIAL-MOTION-A11Y` | Implemented on master | Map layer detail uses mapSelection with list/drawer fallback preserved |
| `SOPHEX-MOTION-DOC-SYNC` | Implemented on master | Wave 12 ledger, motion guidelines, PROTOTYPE_MVP0 banner |
| `SOPHEX-FE-UW-GATE-RESOLUTION-COPY` | Implemented on master | Gate callouts expanded across blocked export/IC/HITL/import surfaces |
| `SOPHEX-FE-A11Y-NAV` | Implemented on master | Comps route added to axe coverage |
| `SOPHEX-FE-A11Y-PROGRESS` | Implemented on master | Full upload flow progress semantics test |
| `SOPHEX-FE-AUTHORITY-WIRE` | Implemented on master | Shared status badge vocabulary helper |
| `SOPHEX-FE-TAB-PANEL-MOTION` | Implemented on master | `tabPanel` preset, `DealWorkflowLayout`, stable page transition key, in-page `TabPanelSwitch` on comps/scenario/preview/onboarding/billing |

## Wave 17 Visual Runtime Matrix (2026-05-26)

| Track | Status | Notes |
| --- | --- | --- |
| Living integration matrix | Implemented | `SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md` — route scores, ticket matrix, validation protocol |
| Doc cross-links | Implemented | INDEX, RAPID_BUILD, MOCK_RESOLUTION, VISUAL_DESIGN_SYSTEM point to matrix |
| Route chunk optimization | Implemented on master | Commit `7572376` — per-route async chunks, Inter preload, circular chunk warning removed |

### Wave 17 Ticket Ledger

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-AUD-001` | Done | Initial route/component scorecard and tracker structure |
| `SOPHEX-OPT-001` | Done | Route-level code splitting and font loading optimization |
| `SOPHEX-VIS-004` | Done | Marketing/public proof polish |
| `SOPHEX-VIS-005` | Done | CSS budget trim headroom |
| `SOPHEX-CRE-002` | Done | Split `DealRoutes.tsx` into per-route modules |
| `SOPHEX-OPS-001` | Done | Broker OS lite taxonomy |
| `SOPHEX-OPS-002` | Done | Broker OS UI polish |
| `SOPHEX-OPT-002` | Done | Motion bundle evaluation (`m` + LazyMotion) |
| `SOPHEX-CRE-005` | Done | Spatial lazy layer states + source-rights polish |
| `SOPHEX-RUN-001` | Mostly done | Runtime posture chip + sandbox fallback tests |
| Gated runtime tickets | Blocked | Schema, provider, HITL/legal, billing/auth per approval packet |

### Wave 19 Ticket Ledger

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-CRE-006` | Done | Deal route import cleanup on dashboard, overview, comps, scenario modules |
| `SOPHEX-VIS-006` | Done | Comp saved views + filter-empty states (public + studio) |
| `SOPHEX-VIS-007` | Done | Scenario keyboard hint + route module cleanup |
| CSS budget trim | Done | Consolidated proof-strip utilities; CSS 69.4 KB |
