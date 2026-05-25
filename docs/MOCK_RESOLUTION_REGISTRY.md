# Mock Resolution Registry

**Purpose:** Single checklist of every mock-only prototype location so operators can resolve them deliberately when gated lanes open. This is a **tracking doc**, not runtime authorization.

**Last synced:** 2026-05-25 (after Wave 5 polish, commit `1fb9052`)

**Related docs:**

| Doc | What it tracks | Gap vs this registry |
| --- | --- | --- |
| [RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md](RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md) | Wave completion by ticket | No per-route resolution lane |
| [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md) | Route acceptance matrix | **Stale** — missing Wave 3–5 routes |
| [PROTOTYPE_MVP0.md](PROTOTYPE_MVP0.md) | Early MVP0 route list | **Stale** — 12-screen snapshot only |
| [STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md](STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md) | Stitch classification | Triage intent, not resolution status |
| [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md) | Operator gates to open runtime | Approval checklist, not mock inventory |

**Resolution lanes** (use when marking items resolved):

| Lane | When to use | Primary references |
| --- | --- | --- |
| `sandbox-api` | Replace mock fixtures with synthetic sandbox HTTP + permission filtering | [RUNTIME_FOUNDATION_SANDBOX_PLAN.md](RUNTIME_FOUNDATION_SANDBOX_PLAN.md), [API_CONTRACT_DRAFT.md](API_CONTRACT_DRAFT.md) |
| `schema-db` | Persisted deals, evidence, versions, receipts | [SISTER_SCHEMA_HARVEST_PACKET.md](SISTER_SCHEMA_HARVEST_PACKET.md), [SISTER_SCHEMA_BORROWING_GATE.md](SISTER_SCHEMA_BORROWING_GATE.md) |
| `provider` | Upload/OCR, comps providers, lender quotes, map tiles | [FILE_SAFETY_AND_RETENTION_PLAN.md](FILE_SAFETY_AND_RETENTION_PLAN.md), [SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md](SPATIAL_SOURCE_RIGHTS_DECISION_PACKET.md) |
| `hitl-legal` | Reviewer decisions, IC delivery, export consent, contribution terms | [REVIEW_AUTHORITY_AND_HITL_POLICY.md](REVIEW_AUTHORITY_AND_HITL_POLICY.md), [CONTRIBUTION_TERMS_DECISION_PACKET.md](CONTRIBUTION_TERMS_DECISION_PACKET.md) |
| `billing-auth` | Accounts, org scope, plan entitlements, sign-in | [SECURITY_PRIVACY_LAUNCH_GATES.md](SECURITY_PRIVACY_LAUNCH_GATES.md) |
| `keep-mock` | Guard patterns, marketing shells, explicit non-production banners | No runtime replacement planned |

**Status key:** `mock-ui` = clickable prototype only · `mock-data` = deterministic fixtures · `simulated-cta` = toast feedback · `disabled-gate` = hard-disabled with blocker copy · `design-ref` = promoted Stitch reference, still mock-only

---

## Public routes

| Route | Page file | Mock posture | Resolution lane | Logged in |
| --- | --- | --- | --- | --- |
| `/` | `prototype/src/pages/LandingPage.tsx` | `mock-ui` search + sample properties | `sandbox-api`, `provider` | Wave 2 continuity banner |
| `/property/:id` | `prototype/src/pages/PropertyPage.tsx` | `mock-data` from `lib/runtime/public-property.ts` | `sandbox-api`, `provider` | WORLD_CLASS spec (partial) |
| `/property/:id/comps` | `prototype/src/pages/CompsPage.tsx` | `mock-data` comps + blocked labels | `provider`, `sandbox-api` | Wave 4 readiness rail |
| `/comps` | `prototype/src/pages/CompsPage.tsx` | Route guard only | `keep-mock` | WORLD_CLASS spec |
| `/upload` | `prototype/src/pages/UploadPage.tsx` | `simulated-cta` upload stages; no bytes sent | `provider`, `hitl-legal` | WORLD_CLASS spec |
| `/report/:id` | `prototype/src/pages/ReportPage.tsx` | `mock-data` sections; `simulated-cta` section review | `sandbox-api`, `hitl-legal` | Wave 2/4 |
| `/export/:id` | `prototype/src/pages/ExportPage.tsx` | `disabled-gate` generate; simulated receipt | `hitl-legal`, `schema-db` | Wave 2/4 |
| `*` (404) | `prototype/src/pages/NotFoundPage.tsx` | Static guard | `keep-mock` | — |

**Public mock data sources:** `prototype/src/data/mock.ts`, `lib/runtime/public-search.ts`, `lib/runtime/public-comps.ts`, `lib/runtime/report-flow.ts`, `lib/runtime/upload-flow.ts`

**Public ↔ Studio identity:** `lib/workflow-identity/index.ts` (`demo-001`↔`riverside-flats`, `demo-002`↔`1200-tech`)

---

## Studio routes

| Route | Page file | Mock posture | Resolution lane | Logged in |
| --- | --- | --- | --- | --- |
| `/studio` | `MarketingRoutes.tsx` | Marketing shell; `simulated-cta` nav | `billing-auth`, `keep-mock` | PROTOTYPE_MVP0 (stale) |
| `/studio/onboarding` | `MarketingRoutes.tsx` | Mock tier/workspace wizard | `billing-auth` | PROTOTYPE_MVP0 |
| `/studio/dashboard` | `DealRoutes.tsx` | Mock pipeline metrics | `sandbox-api`, `schema-db` | Wave 1 |
| `/studio/deal-intake` | redirect → deal intake | Route alias | `keep-mock` | — |
| `/studio/deals/:dealId/intake` | `DealRoutes.tsx` | Staged import mock | `provider`, `hitl-legal` | Wave 2 |
| `/studio/deals/:dealId/data-review` | `DealRoutes.tsx` | Rent roll/T12 normalization mock | `provider`, `hitl-legal` | Phase 2 / Stitch W1 |
| `/studio/deals/:dealId` | `DealRoutes.tsx` | Deal overview + evidence drawer | `sandbox-api`, `schema-db` | Wave 1 |
| `/studio/deals/:dealId/comps` | `DealRoutes.tsx` | Studio comps + premium lock labels | `provider` | Wave 4 readiness |
| `/studio/deals/:dealId/underwriting` | `DealRoutes.tsx` | Executive cockpit; gates; handoffs | `sandbox-api`, `hitl-legal` | Stitch W1, Wave 2 |
| `/studio/deals/:dealId/underwriting/sources` | `DealRoutes.tsx` | Assumption source trace | `schema-db`, `hitl-legal` | Stitch W1 |
| `/studio/deals/:dealId/underwriting/debt` | `DealRoutes.tsx` | Lender quote panel mock | `provider`, `hitl-legal` | Stitch W1 |
| `/studio/deals/:dealId/scenarios` | `DealRoutes.tsx` | Scenario diff + sensitivity | `sandbox-api` | Stitch W2, Wave 2 |
| `/studio/deals/:dealId/versions` | `DealRoutes.tsx` | Version timeline + export linkage | `schema-db`, `hitl-legal` | Stitch W2, Wave 4 |
| `/studio/deals/:dealId/capital-stack` | `DesignReferenceRoutes.tsx` | `design-ref`; `disabled-gate` Export Waterfall | `hitl-legal`, `provider` | Wave 3, Stitch design-ref |
| `/studio/deals/:dealId/ic-packet` | `DesignReferenceRoutes.tsx` | `design-ref`; `disabled-gate` Send to IC | `hitl-legal` | Wave 3, Stitch design-ref |
| `/studio/deals/:dealId/hitl-review` | `DesignReferenceRoutes.tsx` | `design-ref`; mock assignments + tiers | `hitl-legal`, `schema-db` | Wave 3/5 |
| `/studio/deals/:dealId/spatial` | `GisRoutes.tsx` | GIS manifest + layer budgets mock | `provider`, `sandbox-api` | Wave 3/4, GIS pack |
| `/studio/reports/:dealId/builder` | `ReportRoutes.tsx` | Report builder + export gates | `hitl-legal`, `schema-db` | Wave 2/4 |
| `/studio/settings/billing` | `MarketingRoutes.tsx` | Mock plan tiers | `billing-auth` | Phase 2 |
| `/studio/settings/white-label` | `ReportRoutes.tsx` | Mock branding uploads | `schema-db`, `billing-auth` | Phase 2 |
| `/studio/broker-os` | `OperatorRoutes.tsx` | Sanitized job/agent projection + HITL queue | `sandbox-api`, `keep-mock` (projection) | Wave 5 HITL card |

**Studio mock data sources:** `prototype/src/data/studio.ts`, `lib/runtime/studio-workspace.ts`, `lib/source-bundle/index.ts`, `lib/staged-import/index.ts`, `lib/underwriting/*`, `lib/gis/*`

---

## Modals, drawers, and overlays (mock-only)

| Surface | Component file | Mock posture | Resolution lane | Logged in |
| --- | --- | --- | --- | --- |
| Calculation breakdown | `UnderwritingWorkstationPrimitives.tsx` | Formula trace mock | `sandbox-api` | Stitch W2 |
| DSCR / gate override | `DealRoutes.tsx` | Disabled lock / mock override | `hitl-legal`, `schema-db` | Phase 2 |
| Evidence conflict resolver | `UnderwritingWorkstationPrimitives.tsx` | `disabled-gate` Confirm Decision | `hitl-legal`, `schema-db` | Stitch W2 |
| Version lock confirmation | `DealRoutes.tsx` | `disabled-gate` Lock Version | `schema-db`, `hitl-legal` | Stitch W2, Wave 4 |
| Export manifest preview | `ExportGovernanceModal.tsx` | Checksum placeholder; gated export | `hitl-legal`, `schema-db` | Wave 2 |
| Sensitivity cell drilldown | `UnderwritingWorkstationPrimitives.tsx` | Advisory metrics mock | `sandbox-api` | Stitch W2 |
| Reviewer assignment drawer | `ReviewerAssignmentDrawer.tsx` | `disabled-gate` Approve for export | `hitl-legal` | Wave 3/5 |
| Document evidence drawer | `StudioPrimitives.tsx` / deal overview | Mock source blocks | `schema-db` | Wave 1 |
| Upgrade / paywall modal | `UpgradePlanModal.tsx` | `simulated-cta` | `billing-auth` | Phase 2 |
| Studio topbar panels | `StudioTopbarPanels.tsx` | Notifications, support mock | `billing-auth`, `keep-mock` | Phase 2 |

---

## Simulated CTAs (`PrototypeAction*` → toast)

These actions show **“is simulated”** toasts and do not persist state. Replace with governed receipts, real navigation, or API calls per lane.

| Feature label | Location | Resolution lane |
| --- | --- | --- |
| Mark section reviewed | `ReportPage.tsx` | `hitl-legal` |
| Source trust tiers / Privacy | `PublicShell.tsx` | `keep-mock` or legal pages |
| Export Excel / Logo upload / Save branding | `ReportRoutes.tsx` | `schema-db`, `provider` |
| Report export / Report help | `StudioStandaloneShell.tsx` | `hitl-legal` |
| Broker OS job refresh / agent inventory | `OperatorRoutes.tsx` | `sandbox-api` |
| Recommend / Hold review | `ReviewerAssignmentDrawer.tsx` | `hitl-legal` |
| Export waterfall / Send IC packet | `DesignReferenceRoutes.tsx` | `hitl-legal` (buttons also **disabled**) |
| Plan upgrade / Premium comp set | `DealRoutes.tsx` | `billing-auth`, `provider` |
| Scenario / sensitivity / normalization actions | `DealRoutes.tsx`, `UnderwritingWorkstationPrimitives.tsx` | `sandbox-api`, `hitl-legal` |
| Marketing nav / onboarding CTAs | `MarketingRoutes.tsx` | `billing-auth` |
| Support chat / sign out | `StudioTopbarPanels.tsx` | `billing-auth` |
| Studio file dropzone | `UploadDropzone.tsx` | `provider` |
| PDF export / Request export review | `ExportGovernanceModal.tsx` | `hitl-legal`, `schema-db` |

---

## Hard-disabled gates (not just toasts)

These remain **disabled** with `aria-describedby` or blocker copy until runtime gates clear:

| Control | Location | Blocker theme | Resolution lane |
| --- | --- | --- | --- |
| Generate export (full) | `ExportPage.tsx` | Consent + section review | `hitl-legal`, `schema-db` |
| Export Waterfall | `DesignReferenceRoutes.tsx` | LP/legal/reporting gated | `hitl-legal` |
| Send to IC | `DesignReferenceRoutes.tsx` | Section + evidence gates | `hitl-legal` |
| Approve for export (HITL) | `ReviewerAssignmentDrawer.tsx` | No promotion authority in prototype | `hitl-legal`, `schema-db` |
| Lock Version | `DealRoutes.tsx` | Gate summary blockers | `schema-db`, `hitl-legal` |
| Confirm Decision (conflict) | `UnderwritingWorkstationPrimitives.tsx` | Reviewer rationale required | `hitl-legal`, `schema-db` |
| Scenario lock | `DealRoutes.tsx` | Gate implications | `hitl-legal` |
| Promote assumption | `DealRoutes.tsx` | Evidence posture | `hitl-legal`, `schema-db` |
| Premium comp / heatmap unlock | `DealRoutes.tsx`, `SensitivityHeatmap.tsx` | Plan entitlements | `billing-auth`, `provider` |

---

## Mock contract & runtime simulator modules

Replace as a set when opening sandbox — see [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md) prototype bridge section.

| Module | Role | Resolution lane |
| --- | --- | --- |
| `lib/contracts/*` | Actor, evidence, review state, receipts, spatial, workflow gates | `sandbox-api` → `schema-db` |
| `lib/runtime/public-*` | Public property, comps, search, report, export | `sandbox-api` |
| `lib/runtime/studio-workspace.ts` | Dashboard, deal, report builder views | `sandbox-api`, `schema-db` |
| `lib/runtime/review-queue.ts` | HITL queue projection (non-persisted) | `hitl-legal`, `schema-db` |
| `lib/runtime/export-policy.ts` | Export eligibility rules | `hitl-legal` |
| `lib/runtime/upload-flow.ts` | Candidate upload simulation | `provider` |
| `lib/runtime/actor-demo-context.ts` | Demo actor switcher (localStorage) | `billing-auth` |
| `lib/report-governance/index.ts` | Readiness / export evaluation | `hitl-legal` |
| `lib/workflow-identity/index.ts` | Public↔Studio entity links | `schema-db` |
| `lib/gis/index.ts`, `lib/gis/performance.ts` | Spatial manifest + layer budgets | `provider`, `sandbox-api` |
| `lib/source-bundle/index.ts` | Source blocks per deal | `schema-db` |
| `lib/staged-import/index.ts` | Intake/normalization fixtures | `provider` |
| `lib/underwriting/*` | Scenario presets, metrics | `sandbox-api` |
| `data/mock.ts`, `data/studio.ts` | Deterministic fixtures | `schema-db`, `provider` |

---

## Stitch design inputs (source artifacts)

| Stitch surface | Triage | Prototype route / component | Still mock? |
| --- | --- | --- | --- |
| Underwriting Executive Cockpit | Prototype now | `/underwriting` | Yes |
| Assumption Source Trace | Prototype now | `/underwriting/sources` | Yes |
| Rent Roll / T12 Normalization | Prototype now | `/data-review` | Yes |
| Debt / Lender Quote Panel | Prototype now | `/underwriting/debt` | Yes |
| Scenario Diff View | Prototype now | `/scenarios` | Yes |
| Valuation Version Timeline | Prototype now | `/versions` | Yes |
| Calculation Breakdown Drawer | Prototype now | Underwriting modals | Yes |
| Evidence Conflict Resolver | Prototype now | Conflict modal | Yes |
| Export Manifest Preview | Prototype now | `ExportGovernanceModal` | Yes |
| Version Lock Confirmation | Prototype now | Version lock modal | Yes |
| Sensitivity Cell Drilldown | Prototype now | Scenario drilldown | Yes |
| Capital Stack / Waterfall | Design reference → promoted W3 | `/capital-stack` | Yes |
| Investment Committee Packet | Design reference → promoted W3 | `/ic-packet` | Yes |
| Reviewer Assignment / HITL | Design reference → promoted W3 | `/hitl-review` + drawer | Yes |
| Spatial manifest workbench | GIS pack W3 | `/spatial` | Yes |

Artifacts: `docs/design/stitch-underwriting-workstation/`

---

## Quality coverage (does not imply resolution)

| Coverage | Location | Notes |
| --- | --- | --- |
| Unit tests | `prototype/src/test/` | 245 tests post–Wave 5 |
| Storybook | `prototype/src/stories/` | Includes `Wave3Polish.stories.tsx` |
| E2E flows | `prototype/e2e/flows.spec.ts` | Cross-entity demo paths |
| Visual baselines | `prototype/e2e/visual.spec.ts-snapshots/` | 21 routes including Wave 3/4 |
| Lighthouse | `prototype/lighthouserc.cjs` | 10 representative URLs |

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
8. ☐ Refresh [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md) route matrix (currently behind Waves 3–5)

---

## Maintenance

- **After each prototype wave:** add rows or update “Logged in” column here; do not rely on ticket inventory alone.
- **When a mock is resolved:** mark the row, link the implementing PR, and note which lane cleared it.
- **Doc drift alert:** `WORLD_CLASS_PROTOTYPE_SPEC.md` and `PROTOTYPE_MVP0.md` need a sync pass to include Wave 3–5 routes — tracked as doc debt, not product debt.
