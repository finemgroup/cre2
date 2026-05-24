# Sophex Frontend Component Audit

Date: 2026-05-23

Scope: `prototype/src`, `prototype/package.json`, `prototype/vite.config.ts`, `prototype/vitest.config.ts`, and `prototype/index.html`.

This audit assesses the mock-only Sophex prototype against a world-class frontend bar. It does not recommend schema, deploy, provider, queue, CRM, production data, or sister-project runtime coupling.

## Executive Summary

The prototype has a strong product foundation: it consistently communicates evidence-first CRE intelligence, keeps mock/non-production posture visible, and already includes meaningful motion, route focus, drawer focus management, provenance widgets, report governance cards, and underwriting logic.

The biggest gap is not a single visual polish issue. It is system maturity. The frontend has grown into two product surfaces, public Sophex and Finem CRE Studio, but the design tokens, route modules, authority vocabularies, report-governance models, and quality gates are not yet unified enough for a world-class standard.

Highest-impact opportunities:

- Separate public and Studio theme behavior so global CSS does not leak between product surfaces.
- Split `prototype/src/pages/StudioPages.tsx` into real route modules, not thin re-export barrels.
- Make workflow state truthful: property IDs, deal IDs, intake, scenarios, report IDs, and export blockers should stay coherent across navigation.
- Promote accessibility from local good patterns to a full-system contract: active nav, route titles, route announcements, upload progress semantics, badge semantics, and chart alternatives.
- Add automated gates: lint, format, coverage, axe, Playwright, Lighthouse, bundle analysis, and CI.

## Inventory Completed

The frontend catalog covers 49 source files:

- Public routes: `LandingPage`, `PropertyPage`, `UploadPage`, `CompsPage`, `ReportPage`, and `ExportPage`.
- Studio routes: 12 page exports currently implemented in `prototype/src/pages/StudioPages.tsx`.
- Layout shells: `PublicShell`, `StudioAppShell`, `StudioStandaloneShell`, and `RouteProgress`.
- Shared primitives: `StudioPrimitives`, public `ui` components, motion components, and route shared helpers.
- Domain widgets: underwriting, provenance, report governance, upload, staged import review, and workflow continuity.
- Logic/data adapters: public mock data, Studio mock data, underwriting, source bundle, report governance, staged import, a11y, and motion tokens.
- Tests/tooling: 3 test suites plus package/config files.

## Rubric

Each route/component/system was scored qualitatively across:

- Product clarity: trust narrative, user intent, next action, and domain honesty.
- UX completeness: states, feedback, progressive disclosure, dead ends, and task continuity.
- Accessibility: keyboard flow, focus, ARIA, forms, live regions, dialogs, charts, tables, and reduced motion.
- Responsiveness: mobile/tablet/desktop behavior, dense layouts, touch targets, and overflow.
- Performance: bundle shape, eager imports, font/icon loading, rerender cost, and route remount cost.
- Maintainability: file boundaries, duplicated concepts, prop contracts, types, CSS coupling, and testability.
- Visual polish: hierarchy, spacing, motion restraint, brand consistency, and design-token discipline.
- Trust/governance: provenance, export readiness, non-production signals, synthetic data disclosure, and blocked-action explanations.

## Component Area Assessment

### Public Sophex Flow

Overall: promising MVP0 narrative, but less tested and less systematized than Studio.

Strengths:

- Clear evidence-first copy from search through report/export.
- Public `AuthorityBadge` vocabulary is explicit and typed.
- `SophexSheet` gives property and comp evidence drawers a strong a11y baseline.
- Upload/report/export pages communicate candidate evidence and gated export.

Important gaps:

- `PropertyPage` drops subject context by linking to `/comps`; `CompsPage` hardcodes `1200 Commerce St`.
- Public nav hardcodes demo IDs and lacks active route state.
- `ExportPage` hardcodes `exportBlocked = true` instead of using shared governance logic.
- `UploadPage` shows consent and progress panels at the same time during stage 2.
- No public route test suite exists.

### Studio Route Family

Overall: strong trust/governance prototype, but route and workflow truth need tightening.

Strengths:

- Deal workflow, provenance, underwriting, report readiness, and white-label flows communicate a credible CRE Studio product.
- Drawer focus management, route focus, skip links, table captions, and onboarding announcements are above baseline.
- Mock underwriting calculations, gates, sensitivity matrices, source evidence, and report governance give the prototype real product depth.

Important gaps:

- `StudioPages.tsx` remains a large monolith even though `pages/studio/*Routes.tsx` files exist.
- Deal workflow `Inputs` tab points to global `/studio/deal-intake`, not active deal context.
- Intake “Continue to Comps” resolves to the default deal, regardless of entered property.
- Underwriting scenario tabs change labels but do not change assumptions or metrics.
- Report builder receives `reportId` but resolves it as a deal ID.
- Inert topbar/footer actions and stubbed primary CTAs need either mock feedback or disabled explanations.

### Shared Primitives And Domain Widgets

Overall: useful patterns exist, but duplicate public/Studio concepts should be converged or intentionally bounded.

Strengths:

- `SophexSheet` is a strong overlay primitive.
- `DataTable` uses captions and column scopes.
- `StudioPrimitives` gives a coherent card/table/badge/action layer for Studio.
- Domain widgets make CRE-derived concepts visible without runtime imports.

Important gaps:

- Public `AuthorityBadge` and Studio `TrustBadge`/`StatusBadge` use different vocabularies and semantics.
- `UploadDropzone` uses a styled `<i>` as progress without progressbar semantics.
- `StagedImportReviewPanel` accepts `files` but only uses them for issue count, not display.
- `ReportProvenanceCard` can produce `NaN%` coverage for empty sections.
- Badge states are visually styled spans without stronger semantic labeling.

### Motion, Accessibility, Styling, And Tooling

Overall: good local foundations, missing system gates.

Strengths:

- Motion tokens are centralized and reduced-motion flattening is tested.
- Route transitions focus `#page-content`.
- CSS includes global `:focus-visible` and reduced-motion handling.

Important gaps:

- `RouteProgress` uses `role="progressbar"` without real progress semantics.
- `listStagger` does not actually stagger children.
- `sheetPanel` motion spec is now unused.
- `index.css` contains duplicate `.btn` rules and mixed public/Studio token systems.
- The project lacks ESLint, jsx-a11y, formatter scripts, coverage thresholds, axe, E2E, visual regression, Lighthouse, bundle budgets, and CI.

## Critical Journey Findings

Public journey: search to property to report/export works as a concept, but subject identity and governance logic drift. The next refactor should preserve property context across `/property/:id`, comps, report, and export, then derive export blockers from shared readiness logic.

Studio onboarding to dashboard: onboarding is polished and accessible, but selected tier/assets are not reflected later. The plan vocabulary also differs between onboarding, pricing, and sidebar.

Deal workflow: the route family is strong visually, but not all tabs are deal-scoped. Inputs, scenarios, report builder, and intake continuation need to preserve the same deal identity.

Underwriting and scenarios: formula-backed metrics are a major strength. Scenario tabs and bar charts need to become truthful and accessible, not cosmetic.

Report builder to export readiness: governance widgets are compelling, but readiness depends on global mock source blocks and global report sections. It should be parameterized by deal/report context.

## Prioritized Backlog

### Critical

1. Fix global CSS token leakage and duplicate `.btn` rules in `prototype/src/index.css`.
   - Acceptance: public buttons use public tokens, Studio buttons use Studio tokens, and there is one intentional button system.
   - Tests: visual regression or computed-style check across `/` and `/studio/dashboard`.

2. Split `prototype/src/pages/StudioPages.tsx` into real route modules.
   - Acceptance: route-group files contain actual page implementations or import from small domain modules; no page file exceeds a reasonable maintainability threshold.
   - Tests: existing Studio route smoke tests still pass.

3. Make workflow identity consistent across public property and Studio deal flows.
   - Acceptance: property/deal/report IDs stay coherent from entry point through comps, underwriting, report, and export.
   - Tests: route tests for alternate property/deal IDs.

4. Replace hardcoded export blockers with shared, parameterized governance evaluation.
   - Acceptance: public and Studio export blocker copy comes from the same readiness model or explicit adapters.
   - Tests: blocked/ready/warning fixtures produce correct UI.

5. Add baseline frontend quality gates.
   - Acceptance: scripts exist for typecheck, lint, format check, test coverage, and a11y checks.
   - Tests: CI can run those scripts without manual setup.

### High

1. Add public route tests for search, property drawer, upload stages, comps table, report preview, and export gate.
2. Add route titles, active public nav state, and optional route-change live announcements.
3. Correct upload progress semantics in both public and Studio upload surfaces.
4. Wire underwriting scenario selection to real assumption presets or mark it clearly as display-only.
5. Add accessible alternatives for charts and visual-only indicators.
6. Parameterize source bundle/readiness logic instead of using global mock data inside `evaluateExportReadiness`.
7. Introduce a shared authority/status domain model or a typed adapter boundary.

### Medium

1. Add 404/not-found states for public routes and report builder context.
2. Add tablet-specific layout tuning for dense Studio grids.
3. Add CTA feedback for inert prototype actions.
4. Improve map placeholders with static mock visual structure and provenance captions.
5. Normalize or rename motion specs so names match behavior.
6. Add Storybook or a lightweight component review surface for primitives and governance widgets.

### Polish

1. Add footer/legal/trust links for public routes.
2. Add onboarding summary and dashboard personalization from selected tier/assets.
3. Add scroll affordances for horizontal Studio nav on small screens.
4. Move inline visual styles for progress/usage indicators into tokens/classes.
5. Add richer evidence drawer source metadata such as source IDs and as-of dates.

## Recommended Tooling Gates

Tier 1:

- ESLint with TypeScript, React Hooks, and jsx-a11y.
- Prettier or Biome for format consistency.
- `typecheck`, `lint`, `format:check`, and `test:coverage` scripts.
- Vitest coverage thresholds for `src/lib/**` and critical domain logic.
- `jest-axe` or `vitest-axe` on key rendered routes/components.

Tier 2:

- Playwright E2E for public and Studio critical flows.
- Playwright viewport checks for 320px, 768px, 1000px, and desktop.
- Bundle analyzer for Framer Motion, fonts, route chunks, and CSS weight.
- Lighthouse CI on `/`, `/studio/dashboard`, and a deal workflow route.

Tier 3:

- Visual regression for route shells, pricing, report builder, underwriting, and export gates.
- Storybook with a11y addon for primitives and domain widgets.
- CI pipeline: `npm ci`, lint, typecheck, test, coverage, build, optional Playwright/Lighthouse.

## Suggested Implementation Sequence

1. Stabilize quality gates and public route tests.
2. Fix CSS token leakage and button scoping.
3. Split `StudioPages.tsx` into domain page modules.
4. Repair workflow identity and governance readiness contracts.
5. Complete accessibility pass for nav, route titles, progress, badges, charts, uploads, and disabled actions.
6. Add responsive and visual regression checks.
7. Optimize bundle/CSS/font loading after architecture is stable.

## Success Definition

The frontend reaches a world-class prototype bar when every route has a truthful workflow model, every primary action has feedback or an explanation, every trust/governance claim is backed by a visible state, every accessibility-critical interaction is tested, and every major surface can be changed without global CSS or duplicated domain vocabulary creating hidden regressions.
