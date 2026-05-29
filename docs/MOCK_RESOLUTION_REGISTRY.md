# Mock Resolution Registry

**Purpose:** Single checklist of every mock-only prototype location so operators can resolve them deliberately when gated lanes open. This is a **tracking doc**, not runtime authorization.

**Last synced:** 2026-05-29 (after `SOPHEX-EXPORT-GATE-001` export gate review readiness closeout)

**Related docs:**

| Doc                                                                                                | What it tracks                                                    | Gap vs this registry                       |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| [SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md](SOPHEX_VISUAL_AND_RUNTIME_INTEGRATION_MATRIX.md) | Living visual/runtime tracker with route scores and ticket status | Per-fixture inventory detail               |
| [RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md](RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md)           | Wave completion by ticket                                         | No per-route resolution lane               |
| [UNDERWRITING_WORKFLOW_UX_REVIEW_2026-05-25.md](UNDERWRITING_WORKFLOW_UX_REVIEW_2026-05-25.md)     | UX strategy + Wave 6 ticket pack                                  | Product intent, not mock inventory         |
| [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md)                                     | Route acceptance matrix                                           | Synced through Wave 16 design-system route |
| [PROTOTYPE_MVP0.md](PROTOTYPE_MVP0.md)                                                             | Early MVP0 route list                                             | **Stale** — 12-screen snapshot only        |
| [STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md](STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md)             | Stitch classification                                             | Triage intent, not resolution status       |
| [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md)                     | Operator gates to open runtime                                    | Approval checklist, not mock inventory     |

**Resolution lanes** (use when marking items resolved):

| Lane           | When to use                                                              | Primary references                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sandbox-api`  | Replace mock fixtures with synthetic sandbox HTTP + permission filtering | [RUNTIME_FOUNDATION_SANDBOX_PLAN.md](RUNTIME_FOUNDATION_SANDBOX_PLAN.md), [API_CONTRACT_DRAFT.md](API_CONTRACT_DRAFT.md)                                     |
| `schema-db`    | Persisted deals, evidence, versions, receipts                            | [SISTER_SCHEMA_HARVEST_PACKET.md](SISTER_SCHEMA_HARVEST_PACKET.md), [SISTER_SCHEMA_BORROWING_GATE.md](SISTER_SCHEMA_BORROWING_GATE.md)                       |
| `provider`     | Upload/OCR, comps providers, lender quotes, map tiles                    | [FILE_SAFETY_AND_RETENTION_PLAN.md](FILE_SAFETY_AND_RETENTION_PLAN.md), [SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md](SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md) |
| `hitl-legal`   | Reviewer decisions, IC delivery, export consent, contribution terms      | [REVIEW_AUTHORITY_AND_HITL_POLICY.md](REVIEW_AUTHORITY_AND_HITL_POLICY.md), [CONTRIBUTION_TERMS_DECISION_PACKET.md](CONTRIBUTION_TERMS_DECISION_PACKET.md)   |
| `billing-auth` | Accounts, org scope, plan entitlements, sign-in                          | [SECURITY_PRIVACY_LAUNCH_GATES.md](SECURITY_PRIVACY_LAUNCH_GATES.md)                                                                                         |
| `keep-mock`    | Guard patterns, marketing shells, explicit non-production banners        | No runtime replacement planned                                                                                                                               |

**Status key:** `mock-ui` = clickable prototype only · `mock-data` = deterministic fixtures · `simulated-cta` = toast feedback · `disabled-gate` = hard-disabled with blocker copy · `design-ref` = promoted Stitch reference, still mock-only · `workflow-advisory` = stage/next-action UX that does not authorize runtime gates

---

## Public routes

| Route                 | Page file                              | Mock posture                                                                                                                                                                                                                                                              | Resolution lane                           | Logged in                                                             |
| --------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `/`                   | `prototype/src/pages/LandingPage.tsx`  | `mock-ui` search + sample properties; `runtimeServices.public.getLandingView()` with fixture fallback                                                                                                                                                                     | `sandbox-api`, `provider`                 | Wave 2 / Wave 30                                                      |
| `/property/:id`       | `prototype/src/pages/PropertyPage.tsx` | `mock-data` from `lib/runtime/public-property.ts`; primary **Underwrite in Studio** CTA → deal intake via `lib/workflow-identity`                                                                                                                                         | `sandbox-api`, `provider`, `billing-auth` | Wave 6 cross-entity entry                                             |
| `/property/:id/comps` | `prototype/src/pages/CompsPage.tsx`    | `mock-data` comps + blocked labels                                                                                                                                                                                                                                        | `provider`, `sandbox-api`                 | Wave 4 readiness rail                                                 |
| `/comps`              | `prototype/src/pages/CompsPage.tsx`    | Route guard only                                                                                                                                                                                                                                                          | `keep-mock`                               | WORLD_CLASS spec                                                      |
| `/upload`             | `prototype/src/pages/UploadPage.tsx`   | `simulated-cta` upload stages; `runtimeServices.public.getUploadGuide()` with fixture fallback; contribution proof strip                                                                                                                                                  | `provider`, `hitl-legal`                  | WORLD_CLASS spec / Wave 29                                            |
| `/report/:id`         | `prototype/src/pages/ReportPage.tsx`   | `mock-data` sections; deterministic trust fixture states (`clean`, `blocked`, `low-evidence`, `provider-restricted`, `ready-for-review`); disabled export CTA plus export-gate handoff; `simulated-cta` section review                                                    | `sandbox-api`, `hitl-legal`               | Wave 2/4 / `SOPHEX-REPORT-002` / `SOPHEX-OVERNIGHT-REPORT-MATRIX-001` |
| `/export/:id`         | `prototype/src/pages/ExportPage.tsx`   | `disabled-gate` generate; deterministic review-readiness fixture states (`clean`, `blocked`, `low-evidence`, `provider-restricted`, `ready-for-review`); consent/source-rights/reviewer/section gates; report/studio cross-links; `MockBoundaryBanner` (`export` variant) | `hitl-legal`, `schema-db`                 | Wave 2/4/6 / Wave 26 / Wave 31 / `SOPHEX-EXPORT-GATE-001`             |
| `*` (404)             | `prototype/src/pages/NotFoundPage.tsx` | Static guard                                                                                                                                                                                                                                                              | `keep-mock`                               | —                                                                     |

**Public mock data sources:** `prototype/src/data/mock.ts`, `lib/runtime/public-search.ts`, `lib/runtime/public-comps.ts`, `lib/runtime/report-flow.ts`, `lib/runtime/upload-flow.ts`

**Runtime adapter layer (Wave 7):** When `VITE_SOPHEX_RUNTIME_MODE=api`, public and studio reads route through `lib/runtime/sandbox-api-client.ts` → `/sandbox/v0/*` (`sandbox-api.ts`). In-process fallback when `VITE_SOPHEX_API_BASE_URL` is empty; standalone rehearsal via `npm run sandbox:server`. UI routes and mock-boundary banners unchanged.

**Public ↔ Studio identity:** `lib/workflow-identity/index.ts` (`demo-001`↔`riverside-flats`, `demo-002`↔`1200-tech`)

---

## Studio routes

| Route                                        | Page file                                      | Mock posture                                                                                                                          | Resolution lane                         | Logged in                                                            |
| -------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `/studio`                                    | `MarketingRoutes.tsx`                          | Marketing shell; `simulated-cta` nav                                                                                                  | `billing-auth`, `keep-mock`             | PROTOTYPE_MVP0 (stale)                                               |
| `/studio/onboarding`                         | `MarketingRoutes.tsx`                          | Mock tier/workspace wizard; `runtimeServices.studio.getOnboardingView()` with fixture fallback; billing handoff                       | `billing-auth`                          | PROTOTYPE_MVP0 / Wave 31                                             |
| `/studio/dashboard`                          | `deals/StudioDashboardPage.tsx`                | Mock pipeline metrics; `runtimeServices.studio.getDashboard()` with fixture fallback                                                  | `sandbox-api`, `schema-db`              | Wave 1 / Wave 21                                                     |
| `/studio/deal-intake`                        | redirect → deal intake                         | Route alias                                                                                                                           | `keep-mock`                             | —                                                                    |
| `/studio/deals/:dealId/intake`               | `deals/StudioDealIntakePage.tsx`               | Staged import mock; `runtimeServices.studio.getDealIntake()` with fixture fallback; data-review handoffs                              | `provider`, `hitl-legal`                | Wave 2 / Wave 28                                                     |
| `/studio/deals/:dealId/data-review`          | `deals/StudioDataReviewPage.tsx`               | **Evidence review** — normalization workbench; `runtimeServices.studio.getDataReview()` with fixture fallback                         | `provider`, `hitl-legal`                | Phase 2 / Stitch W1 / Wave 8 / Wave 27                               |
| `/studio/deals/:dealId`                      | `deals/StudioDealOverviewPage.tsx`             | Deal overview + evidence drawer; `runtimeServices.studio.getDeal()` with fixture fallback; `DealCockpitPanel` bento next-action       | `sandbox-api`, `schema-db`              | Wave 1/6/8 / Wave 25                                                 |
| `/studio/deals/:dealId/comps`                | `deals/StudioCompsPage.tsx`                    | Studio comps + premium lock labels; `runtimeServices.studio.getComps()` + `getDeal()` source blocks with fixture fallback             | `provider`                              | Wave 4 readiness / Wave 21 / Wave 25                                 |
| `/studio/deals/:dealId/underwriting`         | `deals/StudioUnderwritingPage.tsx`             | Executive cockpit; bento `DealCockpitPanel`; gates; handoffs; `runtimeServices.studio.getUnderwriting()` with fixture fallback        | `sandbox-api`, `hitl-legal`             | Stitch W1, Wave 2 / Wave 8 cockpit / Wave 21                         |
| `/studio/deals/:dealId/underwriting/sources` | `deals/StudioAssumptionSourceTracePage.tsx`    | Assumption source trace inside `DataWorkbenchShell`; `runtimeServices.studio.getSourceTrace()` with fixture fallback                  | `schema-db`, `hitl-legal`               | Stitch W1 / Wave 8 workbench / Wave 26                               |
| `/studio/deals/:dealId/underwriting/debt`    | `deals/StudioDebtPanelPage.tsx`                | Lender quote panel; `runtimeServices.studio.getDebtPanel()` with fixture fallback; source trace cross-link                            | `provider`, `hitl-legal`                | Stitch W1 / Wave 6 / Wave 27                                         |
| `/studio/deals/:dealId/scenarios`            | `deals/StudioScenarioComparisonPage.tsx`       | Scenario diff + sensitivity; posture proof strip                                                                                      | `sandbox-api`                           | Stitch W2, Wave 2 / Wave 25                                          |
| `/studio/deals/:dealId/versions`             | `deals/StudioValuationVersionTimelinePage.tsx` | **Valuation snapshots** timeline + export linkage; `runtimeServices.studio.getValuationVersions()` with fixture fallback              | `schema-db`, `hitl-legal`               | Stitch W2, Wave 4/6 / Wave 26                                        |
| `/studio/deals/:dealId/capital-stack`        | `DesignReferenceRoutes.tsx`                    | `design-ref`; `disabled-gate` Export Waterfall; advanced nav gate hint                                                                | `hitl-legal`, `provider`                | Wave 3/6, Stitch design-ref                                          |
| `/studio/deals/:dealId/ic-packet`            | `DesignReferenceRoutes.tsx`                    | `design-ref`; `disabled-gate` Send to IC; `MockBoundaryBanner` (`ic`)                                                                 | `hitl-legal`                            | Wave 3/6, Stitch design-ref                                          |
| `/studio/deals/:dealId/hitl-review`          | `DesignReferenceRoutes.tsx`                    | **Analyst review** — shared mock assignments + confidence tiers; `MockBoundaryBanner` (`review`)                                      | `hitl-legal`, `schema-db`               | Wave 3/5/6/8                                                         |
| `/studio/deals/:dealId/spatial`              | `GisRoutes.tsx`                                | **Location intelligence** — GIS manifest + `DataWorkbenchShell`; `runtimeServices.studio.getSpatialWorkbench()` with fixture fallback | `provider`, `sandbox-api`               | Wave 3/4/6 nav label, Wave 9 spatial workbench / Wave 22 integration |
| `/studio/reports/:dealId/builder`            | `ReportRoutes.tsx`                             | Report builder + export gates; section posture proof strip; deal breadcrumb; `MockBoundaryBanner` (`export`)                          | `hitl-legal`, `schema-db`               | Wave 2/4/6 / Wave 25                                                 |
| `/studio/settings/billing`                   | `MarketingRoutes.tsx`                          | Mock plan tiers; `runtimeServices.studio.getBillingPlans()` with fixture fallback                                                     | `billing-auth`                          | Phase 2 / Wave 30                                                    |
| `/studio/settings/white-label`               | `ReportRoutes.tsx`                             | Mock branding uploads; non-production evidence posture callout                                                                        | `schema-db`, `billing-auth`             | Phase 2 / Wave 25                                                    |
| `/studio/broker-os`                          | `OperatorRoutes.tsx`                           | Sanitized job/agent projection; `runtimeServices.studio.getBrokerOs()` with fixture fallback                                          | `sandbox-api`, `keep-mock` (projection) | Wave 5 HITL card / Wave 29                                           |
| `/studio/design-system`                      | `DesignSystemRoutes.tsx`                       | Reference-only token/badge/table showcase; no product state                                                                           | `keep-mock`                             | Wave 13-16 visual design system                                      |

**Studio mock data sources:** `prototype/src/data/studio.ts`, `lib/runtime/studio-workspace.ts`, `lib/source-bundle/index.ts`, `lib/staged-import/index.ts`, `lib/underwriting/*`, `lib/gis/*`, `lib/workflow/deal-stage-model.ts`

**Studio workflow chrome (all deal routes via `StudioShared.tsx`):** `DealContextStrip` (war-room-lite advisory context), `DealStageStepper` (six-stage model), grouped `DealWorkflowTabs` (Core / Evidence / Model / Delivery), and integrated `AdvancedWorkflowNav` (delivery surfaces + gate hints)

**Wave 11 UX closeout:** Grouped nav, `DealContextStrip`, and extended `ContextualSurfaceTriggers` on intake/comps/debt/source-trace remain `workflow-advisory`. They improve legibility without authorizing export or evidence promotion.

**Wave 8 cockpit primitives:** `BentoTile` state contract, `DealCockpitPanel`, `DataWorkbenchShell`, `AiTaskPulse`, `confidence.ts`, `next-action.ts`, and shared `review-assignments.ts` are `workflow-advisory` / `mock-ui`. They do not authorize evidence promotion, reviewer decisions, IC delivery, or export.

**Wave 9 cockpit projection:** `GET /sandbox/v0/studio/deals/:dealId/cockpit` returns unified advisory progress, next action, blocked stages, AI task pulse, and actor-filtered review summary. `DealCockpitPanel` consumes this port in fixture and API modes; KPI tiles remain page-local props.

**Wave 21 runtime adapter prep:** `GET /sandbox/v0/studio/deals/:dealId/underwriting` exposes assumptions, provenance, and comp-readiness counts. Dashboard, studio comps, and underwriting pages use `useRuntimeResource` + `RuntimeResourceStatus` for branded loading/error shells with fixture fallback.

**Wave 22 runtime surface closeout:** `GET /sandbox/v0/studio/deals/:dealId/spatial` exposes GIS manifest, source rights, verification, trade areas, and layer budgets. Landing, export, spatial workbench, and deal cockpit surfaces share `RuntimeResourceStatus` loading/error posture.

---

## Modals, drawers, and overlays (mock-only)

| Surface                    | Component file                          | Mock posture                       | Resolution lane             | Logged in         |
| -------------------------- | --------------------------------------- | ---------------------------------- | --------------------------- | ----------------- |
| Calculation breakdown      | `UnderwritingWorkstationPrimitives.tsx` | Formula trace mock                 | `sandbox-api`               | Stitch W2         |
| DSCR / gate override       | `deals/StudioUnderwritingPage.tsx`      | Disabled lock / mock override      | `hitl-legal`, `schema-db`   | Phase 2           |
| Evidence conflict resolver | `UnderwritingWorkstationPrimitives.tsx` | `disabled-gate` Confirm Decision   | `hitl-legal`, `schema-db`   | Stitch W2         |
| Version lock confirmation  | `deals/StudioUnderwritingPage.tsx`      | `disabled-gate` Lock Version       | `schema-db`, `hitl-legal`   | Stitch W2, Wave 4 |
| Export manifest preview    | `ExportGovernanceModal.tsx`             | Checksum placeholder; gated export | `hitl-legal`, `schema-db`   | Wave 2            |
| Sensitivity cell drilldown | `UnderwritingWorkstationPrimitives.tsx` | Advisory metrics mock              | `sandbox-api`               | Stitch W2         |
| Reviewer assignment drawer | `ReviewerAssignmentDrawer.tsx`          | `disabled-gate` Approve for export | `hitl-legal`                | Wave 3/5          |
| Document evidence drawer   | `StudioPrimitives.tsx` / deal overview  | Mock source blocks                 | `schema-db`                 | Wave 1            |
| Upgrade / paywall modal    | `UpgradePlanModal.tsx`                  | `simulated-cta`                    | `billing-auth`              | Phase 2           |
| Studio topbar panels       | `StudioTopbarPanels.tsx`                | Notifications, support mock        | `billing-auth`, `keep-mock` | Phase 2           |

---

## Wave 6 workflow UX layer (mock-only)

Persistent workflow chrome added in Wave 6. **Does not authorize export, IC delivery, or evidence promotion** — copy states this explicitly where needed.

| Surface                        | Component file                                   | Mock posture                                              | Resolution lane                                 | Logged in |
| ------------------------------ | ------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------- | --------- |
| Six-stage deal stepper         | `components/workflow/DealStageStepper.tsx`       | `workflow-advisory`; reads `getDealStageProgress()`       | `sandbox-api`, `schema-db`                      | Wave 6    |
| Deal cockpit next action       | `components/workflow/DealCockpitSummary.tsx`     | `workflow-advisory`; reads `getDealNextAction()`          | `sandbox-api`, `schema-db`                      | Wave 6    |
| Stage progress + routing model | `lib/workflow/deal-stage-model.ts`               | `mock-data` per `dealId` (`riverside-flats`, `1200-tech`) | `sandbox-api`, `schema-db`                      | Wave 6    |
| Gate resolution hints          | `components/workflow/GateResolutionCallout.tsx`  | `keep-mock`; navigation copy only                         | `keep-mock` (replace with server gate messages) | Wave 6    |
| Mock boundary banners          | `components/workflow/MockBoundaryBanner.tsx`     | `keep-mock`                                               | `keep-mock`                                     | Wave 6    |
| Advanced / delivery nav        | `components/workstation/AdvancedWorkflowNav.tsx` | `keep-mock`; gate hints in `title` + subtitle             | `keep-mock`                                     | Wave 6    |
| Report deal breadcrumb         | `ReportRoutes.tsx`                               | `keep-mock`                                               | `keep-mock`                                     | Wave 6    |
| Back to deal link              | `StudioStandaloneShell.tsx`                      | `keep-mock`; deal-aware exit from report shell            | `keep-mock`                                     | Wave 6    |

### `MockBoundaryBanner` placements

| Variant    | Copy theme                                       | Route(s)                                         | Page file                                      |
| ---------- | ------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------- |
| `export`   | Demo export — not for distribution               | `/export/:id`, `/studio/reports/:dealId/builder` | `ExportPage.tsx`, `ReportRoutes.tsx`           |
| `ic`       | Prototype IC assembly — no transmission          | `/studio/deals/:dealId/ic-packet`                | `DesignReferenceRoutes.tsx`                    |
| `review`   | Advisory analyst review — no authority promotion | `/studio/deals/:dealId/hitl-review`              | `DesignReferenceRoutes.tsx`                    |
| `snapshot` | Simulated snapshot lock — no production records  | `/studio/deals/:dealId/versions`                 | `deals/StudioValuationVersionTimelinePage.tsx` |

### `GateResolutionCallout` placements

| Blocked action   | Prerequisite (mock)                       | Resolve route                        | Page file                       |
| ---------------- | ----------------------------------------- | ------------------------------------ | ------------------------------- |
| Lock assumptions | Missing lender quote; DSCR source pending | `/studio/deals/:dealId/underwriting` | `deals/StudioDebtPanelPage.tsx` |

**When resolving:** replace `deal-stage-model.ts` hardcoded progress with server workflow state; keep stepper/cockpit UI but wire reads to sandbox API. Retain or tighten mock-boundary banners until real consent/receipt flows exist.

---

## Simulated CTAs (`PrototypeAction*` → toast)

These actions show **“is simulated”** toasts and do not persist state. Replace with governed receipts, real navigation, or API calls per lane.

| Feature label                                  | Location                                                                                                            | Resolution lane                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Mark section reviewed                          | `ReportPage.tsx`                                                                                                    | `hitl-legal`                             |
| Source trust tiers / Privacy                   | `PublicShell.tsx`                                                                                                   | `keep-mock` or legal pages               |
| Export Excel / Logo upload / Save branding     | `ReportRoutes.tsx`                                                                                                  | `schema-db`, `provider`                  |
| Report export / Report help                    | `StudioStandaloneShell.tsx`                                                                                         | `hitl-legal`                             |
| Broker OS job refresh / agent inventory        | `OperatorRoutes.tsx`                                                                                                | `sandbox-api`                            |
| Recommend / Hold review                        | `ReviewerAssignmentDrawer.tsx`                                                                                      | `hitl-legal`                             |
| Export waterfall / Send IC packet              | `DesignReferenceRoutes.tsx`                                                                                         | `hitl-legal` (buttons also **disabled**) |
| Plan upgrade / Premium comp set                | `deals/StudioCompsPage.tsx`                                                                                         | `billing-auth`, `provider`               |
| Scenario / sensitivity / normalization actions | `deals/StudioScenarioComparisonPage.tsx`, `deals/StudioDataReviewPage.tsx`, `UnderwritingWorkstationPrimitives.tsx` | `sandbox-api`, `hitl-legal`              |
| Marketing nav / onboarding CTAs                | `MarketingRoutes.tsx`                                                                                               | `billing-auth`                           |
| Support chat / sign out                        | `StudioTopbarPanels.tsx`                                                                                            | `billing-auth`                           |
| Studio file dropzone                           | `UploadDropzone.tsx`                                                                                                | `provider`                               |
| PDF export / Request export review             | `ExportGovernanceModal.tsx`                                                                                         | `hitl-legal`, `schema-db`                |

---

## Hard-disabled gates (not just toasts)

These remain **disabled** with `aria-describedby` or blocker copy until runtime gates clear:

| Control                       | Location                                                                                        | Blocker theme                       | Resolution lane            |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------- |
| Generate export (full)        | `ExportPage.tsx`                                                                                | Consent + section review            | `hitl-legal`, `schema-db`  |
| Export Waterfall              | `DesignReferenceRoutes.tsx`                                                                     | LP/legal/reporting gated            | `hitl-legal`               |
| Send to IC                    | `DesignReferenceRoutes.tsx`                                                                     | Section + evidence gates            | `hitl-legal`               |
| Approve for export (HITL)     | `ReviewerAssignmentDrawer.tsx`                                                                  | No promotion authority in prototype | `hitl-legal`, `schema-db`  |
| Lock Version                  | `deals/StudioValuationVersionTimelinePage.tsx`                                                  | Gate summary blockers               | `schema-db`, `hitl-legal`  |
| Confirm Decision (conflict)   | `UnderwritingWorkstationPrimitives.tsx`                                                         | Reviewer rationale required         | `hitl-legal`, `schema-db`  |
| Scenario lock                 | `deals/StudioScenarioComparisonPage.tsx`                                                        | Gate implications                   | `hitl-legal`               |
| Promote assumption            | `deals/StudioDataReviewPage.tsx`                                                                | Evidence posture                    | `hitl-legal`, `schema-db`  |
| Premium comp / heatmap unlock | `deals/StudioCompsPage.tsx`, `deals/StudioScenarioComparisonPage.tsx`, `SensitivityHeatmap.tsx` | Plan entitlements                   | `billing-auth`, `provider` |

---

## Mock contract & runtime simulator modules

Replace as a set when opening sandbox — see [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md) prototype bridge section.

| Module                                       | Role                                                             | Resolution lane             |
| -------------------------------------------- | ---------------------------------------------------------------- | --------------------------- |
| `lib/contracts/*`                            | Actor, evidence, review state, receipts, spatial, workflow gates | `sandbox-api` → `schema-db` |
| `lib/runtime/public-*`                       | Public property, comps, search, report, export                   | `sandbox-api`               |
| `lib/runtime/studio-workspace.ts`            | Dashboard, deal, report builder views                            | `sandbox-api`, `schema-db`  |
| `lib/runtime/review-queue.ts`                | HITL queue projection (non-persisted)                            | `hitl-legal`, `schema-db`   |
| `lib/runtime/export-policy.ts`               | Export eligibility rules                                         | `hitl-legal`                |
| `lib/runtime/upload-flow.ts`                 | Candidate upload simulation                                      | `provider`                  |
| `lib/runtime/actor-demo-context.ts`          | Demo actor switcher (localStorage)                               | `billing-auth`              |
| `lib/report-governance/index.ts`             | Readiness / export evaluation                                    | `hitl-legal`                |
| `lib/workflow-identity/index.ts`             | Public↔Studio entity links                                       | `schema-db`                 |
| `lib/workflow/deal-stage-model.ts`           | Six-stage progress, route→stage map, next-action fixtures        | `sandbox-api`, `schema-db`  |
| `lib/gis/index.ts`, `lib/gis/performance.ts` | Spatial manifest + layer budgets                                 | `provider`, `sandbox-api`   |
| `lib/source-bundle/index.ts`                 | Source blocks per deal                                           | `schema-db`                 |
| `lib/staged-import/index.ts`                 | Intake/normalization fixtures                                    | `provider`                  |
| `lib/underwriting/*`                         | Scenario presets, metrics                                        | `sandbox-api`               |
| `data/mock.ts`, `data/studio.ts`             | Deterministic fixtures                                           | `schema-db`, `provider`     |

---

## Stitch design inputs (source artifacts)

| Stitch surface                             | Triage                         | Prototype route / component              | Still mock? |
| ------------------------------------------ | ------------------------------ | ---------------------------------------- | ----------- |
| Underwriting Executive Cockpit             | Prototype now                  | `/underwriting`                          | Yes         |
| Assumption Source Trace                    | Prototype now                  | `/underwriting/sources`                  | Yes         |
| Rent Roll / T12 Normalization              | Prototype now                  | `/data-review`                           | Yes         |
| Debt / Lender Quote Panel                  | Prototype now                  | `/underwriting/debt`                     | Yes         |
| Scenario Diff View                         | Prototype now                  | `/scenarios`                             | Yes         |
| Valuation Snapshots (was Version Timeline) | Prototype now                  | `/versions`                              | Yes         |
| Calculation Breakdown Drawer               | Prototype now                  | Underwriting modals                      | Yes         |
| Evidence Conflict Resolver                 | Prototype now                  | Conflict modal                           | Yes         |
| Export Manifest Preview                    | Prototype now                  | `ExportGovernanceModal`                  | Yes         |
| Version Lock Confirmation                  | Prototype now                  | Version lock modal                       | Yes         |
| Sensitivity Cell Drilldown                 | Prototype now                  | Scenario drilldown                       | Yes         |
| Capital Stack / Waterfall                  | Design reference → promoted W3 | `/capital-stack`                         | Yes         |
| Investment Committee Packet                | Design reference → promoted W3 | `/ic-packet`                             | Yes         |
| Reviewer Assignment / HITL                 | Design reference → promoted W3 | `/hitl-review` (Analyst review) + drawer | Yes         |
| Spatial manifest workbench                 | GIS pack W3                    | `/spatial`                               | Yes         |

Artifacts: `docs/design/stitch-underwriting-workstation/`

---

## Quality coverage (does not imply resolution)

| Coverage         | Location                                  | Notes                                                              |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Unit tests       | `prototype/src/test/`                     | 256+ tests; `sandbox-api.test.ts` covers public + studio API shell |
| Storybook        | `prototype/src/stories/`                  | Includes `Wave3Polish.stories.tsx`                                 |
| E2E flows        | `prototype/e2e/flows.spec.ts`             | Cross-entity demo paths; **Underwrite in Studio** entry CTA        |
| Visual baselines | `prototype/e2e/visual.spec.ts-snapshots/` | Updated for Valuation snapshots + Wave 6 chrome                    |
| Lighthouse       | `prototype/lighthouserc.cjs`              | 20 representative URLs                                             |

---

## Operator resolution checklist (when ready)

Use this when opening a gated lane — check off per row in the tables above.

1. ☐ Operator signed [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md) for target lane
2. ☐ API contracts updated in `docs/API_CONTRACT_DRAFT.md` for affected surfaces
3. ☐ Permission fixtures cover actor transitions in [PERMISSION_TEST_FIXTURES.md](PERMISSION_TEST_FIXTURES.md)
4. ☐ Replace `lib/runtime/*` reads with sandbox/production API (keep UI routes stable)
5. ☐ Replace `simulated-cta` with real receipts or governed writes
6. ☐ Replace `disabled-gate` controls only when server-side gates agree (UI never authorizes alone)
7. ☐ Update this registry row status from `mock-*` → `resolved-{lane}` with date and PR link
8. ☐ Keep [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md) route matrix synced when new prototype routes or workflow chrome land

---

## Maintenance

- **After each prototype wave:** add rows or update “Logged in” column here; do not rely on ticket inventory alone.
- **Wave 6 note:** workflow stepper/cockpit are **advisory UX** — track separately from `disabled-gate` controls; resolving runtime gates does not automatically remove mock-boundary banners.
- **When a mock is resolved:** mark the row, link the implementing PR, and note which lane cleared it.
- **Doc drift alert:** `PROTOTYPE_MVP0.md` remains an early snapshot; `WORLD_CLASS_PROTOTYPE_SPEC.md` is the current route acceptance source and should be kept synced after future waves.
