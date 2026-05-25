# Composer 2.5 Rapid Implementation Ticket Pack: Frontend Phase 2

This packet turns the remaining items from [FRONTEND_COMPONENT_AUDIT_2026-05-23.md](FRONTEND_COMPONENT_AUDIT_2026-05-23.md) into Composer-ready implementation tickets.
It is designed for rapid **mock-only Sophex prototype and documentation work**.

## Execution Boundary

Allowed:

- `prototype/` mock-only TypeScript, React, CSS, Storybook, Playwright, Lighthouse, and tests.
- `docs/` contract, UX, decision, and checklist updates.
- Deterministic fixtures and pure functions under existing mock contract/runtime patterns.

Forbidden:

- Prisma, SQL, migrations, generated clients, database writes, or schema changes.
- Deploys, provider calls, queue workers, production services, or CRE/Fabricator runtime imports.
- Real KML/GeoJSON assets, SharePoint links, provider keys, `.env` reads, or external GIS services.
- Sandbox HTTP servers, sister-schema harvest execution, or any runtime lane work without operator approval.

Primary references:

- [FRONTEND_COMPONENT_AUDIT_2026-05-23.md](FRONTEND_COMPONENT_AUDIT_2026-05-23.md)
- [WORLD_CLASS_PROTOTYPE_SPEC.md](WORLD_CLASS_PROTOTYPE_SPEC.md)
- [FRONTEND_UX_INHERITANCE.md](FRONTEND_UX_INHERITANCE.md)
- [SOPHEX_TRUST_UI_GUIDELINES.md](SOPHEX_TRUST_UI_GUIDELINES.md)
- [MOTION_AND_INTERACTION_GUIDELINES.md](MOTION_AND_INTERACTION_GUIDELINES.md)
- [COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md](COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_UNDERWRITING_GIS.md)

## Already Landed (Do Not Rebuild)

These audit items are complete or substantially addressed in prior batches:

- ESLint, Prettier, typecheck, coverage, axe, Playwright, Lighthouse, bundle budgets, and CI.
- Studio route module split (`pages/studio/*Routes.tsx`).
- Onboarding → dashboard continuity and route announcements.
- Map placeholder preview, tablet grid tuning, progress tokenization.
- Map layer controls, readiness rails, export governance cards with optional `sourceBlocks`.
- Visual regression baseline under `prototype/e2e/visual.spec.ts-snapshots/`.
- Shared `authority-vocabulary` module (partial integration — see `SOPHEX-FE-AUTHORITY-WIRE`).

## Recommended Build Order

| Wave | Tickets | Why first |
| --- | --- | --- |
| Wave 1: Workflow truth | `SOPHEX-FE-WORKFLOW-ID`, `SOPHEX-FE-EXPORT-PARAM`, `SOPHEX-FE-SCENARIO-TRUTH` | Fixes misleading navigation and governance before more polish. |
| Wave 2: Accessibility | `SOPHEX-FE-A11Y-NAV`, `SOPHEX-FE-A11Y-PROGRESS`, `SOPHEX-FE-A11Y-CHARTS` | Makes trust signals usable for keyboard and screen-reader users. |
| Wave 3: Authority & Storybook | `SOPHEX-FE-AUTHORITY-WIRE`, `SOPHEX-FE-STORYBOOK-GAPS` | Unifies public/Studio vocabulary and gives review surfaces. |
| Wave 4: Quality gates | `SOPHEX-FE-VISUAL-REGRESSION`, `SOPHEX-FE-LIGHTHOUSE-EXPAND`, `SOPHEX-FE-PUBLIC-ROUTE-TESTS` | Locks regressions after UX truth is stable. |

## Definition Of Done For Every Ticket

- Uses existing Sophex mock contract/runtime patterns where possible.
- Adds or updates focused tests for the behavior introduced.
- Keeps all public copy proof-honest: advisory, source pending, review required, blocked.
- Adds no schema, provider, queue, deploy, or production data dependency.
- Does not copy sister-project source code or assets.
- Updates docs when a new concept becomes a prototype convention.

## Ticket SOPHEX-FE-WORKFLOW-ID

**Objective:** Keep property, deal, report, and export identity coherent across public and Studio navigation.

**Likely files:**

- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/lib/runtime/public-property.ts`
- `prototype/src/lib/runtime/studio-workspace.ts`
- `prototype/src/test/route-*.test.ts`

**Implementation notes:**

- Public comps/report/export links should preserve `:propertyId` from the entry route.
- Studio deal tabs (inputs, scenarios, report builder) should resolve against the active `:dealId`.
- Intake continuation should not silently fall back to the default deal when a property was entered.
- Report builder should resolve `reportId` vs `dealId` consistently in adapters and route params.

**Acceptance criteria:**

- Route tests cover at least two distinct property/deal IDs end-to-end.
- No hardcoded `1200 Commerce St` or default deal ID in cross-route links unless explicitly demo-labeled.
- Breadcrumbs or page titles reflect the active entity ID.

**Out of scope:** Real CRM sync, persisted session stores beyond existing mock adapters, or database identity.

## Ticket SOPHEX-FE-EXPORT-PARAM

**Objective:** Remove implicit global mock source blocks from export readiness evaluation when page context is available.

**Likely files:**

- `prototype/src/lib/runtime/export-policy.ts`
- `prototype/src/lib/runtime/report-flow.ts`
- `prototype/src/components/governance/ReportGovernanceCards.tsx`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/test/export-policy.test.ts`

**Implementation notes:**

- `evaluateExportReadiness` should accept explicit `sourceBlocks` and fail closed when omitted in Studio contexts.
- Public export may keep a documented demo fallback but must label it as mock-default in tests.
- Blocker copy should match between public export and Studio report export surfaces.

**Acceptance criteria:**

- Tests prove different source block fixtures produce different blocker sets on the same route adapter.
- Export page no longer hardcodes `exportBlocked = true` without calling shared evaluation.
- Governance cards and export CTAs share the same readiness summary for equivalent fixtures.

**Out of scope:** Real export receipts, storage, or provider delivery.

## Ticket SOPHEX-FE-SCENARIO-TRUTH

**Objective:** Make underwriting scenario tabs change assumptions and metrics, or clearly mark the control as display-only mock.

**Likely files:**

- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/lib/runtime/underwriting.ts`
- `prototype/src/components/underwriting/*`
- `prototype/src/test/underwriting*.test.ts`

**Implementation notes:**

- If scenarios are mock-only, add explicit copy and aria labels stating assumptions do not change.
- Preferred: wire tab selection to assumption presets already modeled in underwriting fixtures.
- Sensitivity matrix and headline metrics should update with the selected scenario.

**Acceptance criteria:**

- Tests cover at least two scenario presets with distinct NOI or cap-rate outputs.
- UI never implies live recalculation when values are static fixtures.
- Reduced-motion and keyboard users can operate scenario controls.

**Out of scope:** Excel/Python engines, Monte Carlo, or external model APIs.

## Ticket SOPHEX-FE-A11Y-NAV

**Objective:** Complete public navigation accessibility: active route state, document titles, and skip-link coverage.

**Likely files:**

- `prototype/src/components/layout/PublicShell.tsx`
- `prototype/src/hooks/useRouteAnnouncement.ts`
- `prototype/src/pages/*`
- `prototype/e2e/a11y.spec.ts`

**Implementation notes:**

- Public nav links should expose `aria-current="page"` on the active route.
- Each public route should set a unique `document.title` via existing title helpers or route meta.
- Reuse Studio route announcement pattern where not already present.

**Acceptance criteria:**

- axe checks pass on landing, property, upload, comps, report, and export routes.
- Playwright or unit tests assert active nav state for at least two routes.
- Screen reader route announcements fire on public shell navigation.

**Out of scope:** SEO indexing, sitemap generation, or server-rendered titles.

## Ticket SOPHEX-FE-A11Y-PROGRESS

**Objective:** Fix progress semantics on upload and route-loading surfaces.

**Likely files:**

- `prototype/src/components/upload/UploadDropzone.tsx`
- `prototype/src/components/layout/RouteProgress.tsx`
- `prototype/src/pages/UploadPage.tsx`
- `prototype/src/pages/studio/*Routes.tsx` (upload/intake surfaces)
- `prototype/src/test/a11y*.test.ts`

**Implementation notes:**

- Replace decorative progress icons with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- `RouteProgress` should either reflect real navigation progress or use `role="status"` without progressbar semantics.
- Upload stage panels should not show conflicting consent and progress states simultaneously.

**Acceptance criteria:**

- jest-axe/vitest-axe tests cover upload and route progress components.
- Progress values match visible stage labels in mock upload flow.
- No progressbar roles without numeric values.

**Out of scope:** Real multipart upload tracking or network progress events.

## Ticket SOPHEX-FE-A11Y-CHARTS

**Objective:** Add accessible alternatives for bar charts and visual-only underwriting indicators.

**Likely files:**

- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/components/underwriting/*`
- `prototype/src/test/a11y*.test.ts`

**Implementation notes:**

- Provide sr-only or visible data tables mirroring chart values.
- Charts should expose short summaries via `aria-label` or adjacent text.
- Respect reduced-motion by avoiding essential information in animation-only states.

**Acceptance criteria:**

- Each chart-like widget has a non-visual data path tested in DOM queries.
- axe does not flag unlabeled SVG/canvas chart regions on underwriting route.
- Reduced-motion mode still exposes full metric values.

**Out of scope:** Live charting libraries, D3, or map canvas rendering.

## Ticket SOPHEX-FE-AUTHORITY-WIRE

**Objective:** Wire shared authority vocabulary into public and Studio badge components.

**Likely files:**

- `prototype/src/lib/authority/authority-vocabulary.ts`
- `prototype/src/components/ui/AuthorityBadge.tsx`
- `prototype/src/components/studio/StudioPrimitives.tsx`
- `prototype/src/test/authority-vocabulary.test.ts`

**Implementation notes:**

- Centralize public display labels and Studio trust posture mapping in `authority-vocabulary.ts`.
- `AuthorityBadge` should import labels from the shared module, not duplicate maps.
- `TrustBadge` should normalize known public labels through `toStudioTrustPosture` when applicable.
- Keep spatial labels (`sample-map-data`, `approximate-centroid`, `not-legal-boundary`) in the shared vocabulary.

**Acceptance criteria:**

- Single source of truth for label display strings and export-blocking posture checks.
- Tests cover mapping for every public label used in routes.
- Badge aria labels remain human-readable and consistent across surfaces.

**Out of scope:** New trust tiers, legal approval workflows, or provider-specific badges.

## Ticket SOPHEX-FE-STORYBOOK-GAPS

**Objective:** Add Storybook coverage for remaining primitives and governance widgets called out in the audit.

**Likely files:**

- `prototype/src/stories/*.stories.tsx`
- `prototype/.storybook/*`
- `prototype/src/components/governance/*`
- `prototype/src/components/provenance/*`
- `prototype/src/components/review/StagedImportReviewPanel.tsx`

**Implementation notes:**

- Prioritize: `ReportGovernanceCards`, `StagedImportReviewPanel`, `UploadDropzone`, `TrustExplainerDrawer`, `MapPlaceholderPreview`.
- Each story should include a basic `play` interaction or visibility assertion.
- Tag stories with `surface: public | studio` parameters already used in the catalog.

**Acceptance criteria:**

- Storybook build passes in CI.
- At least one story exists per prioritized widget with controls for primary states.
- a11y addon reports no critical violations on default story renders.

**Out of scope:** Visual review app outside Storybook or design-token Figma sync.

## Ticket SOPHEX-FE-VISUAL-REGRESSION

**Objective:** Maintain and extend Playwright visual baselines for critical shells and governance gates.

**Likely files:**

- `prototype/e2e/visual.spec.ts`
- `prototype/e2e/visual.spec.ts-snapshots/*`
- `.github/workflows/prototype-ci.yml`

**Implementation notes:**

- Baselines exist for landing, dashboard, underwriting, export gate, pricing, report builder, tablet/mobile viewports, and property map placeholder.
- Rebaseline intentionally via `npm run test:e2e:update-snapshots` only when UI changes are expected.
- Keep `maxDiffPixelRatio` conservative; document intentional drift in PR notes.

**Acceptance criteria:**

- Visual project passes in CI on clean checkout.
- New routes with distinct layout shells add snapshots before merge.
- Snapshot updates are reviewed in PR diffs, not silently regenerated in CI.

**Out of scope:** Percy/Chromatic hosted diff services or cross-browser matrix beyond Chromium visual project.

## Ticket SOPHEX-FE-LIGHTHOUSE-EXPAND

**Objective:** Expand Lighthouse CI coverage to additional critical routes and document score floors.

**Likely files:**

- `prototype/lighthouserc.json` or CI lighthouse step
- `.github/workflows/prototype-ci.yml`
- `docs/WORLD_CLASS_PROTOTYPE_SPEC.md`

**Implementation notes:**

- Add `/property/demo-001`, `/studio/deals/riverside-flats/underwriting`, and `/export/demo-001` if not already measured.
- Document minimum scores or warn-only posture for mock prototype (performance may fluctuate).
- Fail CI only on accessibility or best-practices regressions beyond agreed thresholds.

**Acceptance criteria:**

- Lighthouse CI runs on at least five representative routes.
- Regressions produce actionable URLs/logs in CI output.
- Docs state which categories are blocking vs informational.

**Out of scope:** Production CDN tuning, image optimization pipelines, or SSR.

## Ticket SOPHEX-FE-PUBLIC-ROUTE-TESTS

**Objective:** Add Vitest/RTL coverage for public routes called out as untested in the audit.

**Likely files:**

- `prototype/src/test/public-routes.test.tsx`
- `prototype/src/pages/LandingPage.tsx`
- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/UploadPage.tsx`
- `prototype/src/pages/CompsPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/ExportPage.tsx`

**Implementation notes:**

- Cover search entry, property drawer open, upload stage transitions, comps table render, report preview sections, and export gate blockers.
- Use existing mock adapters; do not introduce fetch mocks for external APIs.
- Pair with axe assertions on rendered output where cheap.

**Acceptance criteria:**

- Dedicated public route test file with at least six focused cases.
- Coverage thresholds for `src/lib/**` remain satisfied.
- Tests run in CI without Playwright dependency.

**Out of scope:** Full E2E duplication of every public flow unless a gap remains after RTL coverage.

## Ticket SOPHEX-FE-CTA-FEEDBACK

**Objective:** Give inert prototype CTAs explicit disabled explanations or mock feedback toasts.

**Likely files:**

- `prototype/src/components/overlays/PrototypeActionButton.tsx`
- `prototype/src/pages/studio/*Routes.tsx`
- `prototype/src/pages/*`

**Implementation notes:**

- Topbar/footer actions that do nothing should use `PrototypeActionButton` or equivalent with reason text.
- Avoid silent no-op buttons without `aria-disabled` or explanatory tooltips.

**Acceptance criteria:**

- Audit list of inert CTAs from Studio dashboard, deal workflow, and report builder each has feedback or disabled state copy.
- Tests assert at least three formerly inert actions now expose explanation text.

**Out of scope:** Real integrations (email, CRM, billing checkout).

## Gated Lanes (Not In This Pack)

Sandbox runtime and sister-schema harvest tickets live in [SOPHEX_GATED_LANES_APPROVAL_PACKET.md](SOPHEX_GATED_LANES_APPROVAL_PACKET.md).
Do not implement those lanes from this packet without operator signoff.

## Suggested Composer Prompt

```text
Implement Wave N from docs/COMPOSER_2_5_RAPID_IMPLEMENTATION_TICKET_PACK_FRONTEND_PHASE_2.md.
Stay mock-only in prototype/. Run typecheck, lint, test, build, and budget:check before finishing.
Do not touch schema, deploy, providers, queues, sandbox servers, or sister-project runtime.
```
