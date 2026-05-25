# Composer 2.5 Rapid Implementation Ticket Pack - CRE Cockpit

This pack converts the CRE Platform cockpit utilization work into durable rapid-build tickets.

Wave 8 closeout tickets document work already implemented on the `sophex-wave8-cre-cockpit` branch. Wave 9 backlog tickets capture the next install/polish pass needed to harden the cockpit model without opening schema, provider, queue, upload/OCR, deploy, or persisted HITL lanes.

## Global Rules

- Keep work inside `prototype/`, `docs/`, tests, and Storybook.
- Treat CRE Platform as a UI pattern source only; do not import `@acme/*`, CRE runtime hooks, CRM routes, React Query fetchers, or operator shell chrome.
- Preserve Sophex language: Deal Cockpit, Evidence Workbench, Underwriting, Analyst Review, Valuation Snapshots, Export Posture.
- Keep all actions mock-only or workflow-advisory unless a separate operator-gated runtime lane opens.
- UI confidence, stage progress, task pulse, and HITL state never authorize evidence promotion, IC delivery, or export.
- Validate with `IMPLEMENTATION_QUALITY_DISCIPLINE.md`.

## Wave 8 Closeout Tickets

### SOPHEX-FE-WAVE-8-CRE-COCKPIT-HARVEST-MATRIX

Objective: Record which CRE Platform cockpit primitives Sophex copied, adapted, or left as reference-only.

Likely files:

- `docs/CRE_PLATFORM_COCKPIT_HARVEST_2026-05-25.md`
- `docs/FRONTEND_UX_INHERITANCE.md`
- `docs/INDEX.md`

Acceptance criteria:

- Source paths and key primitives are recorded.
- Copy/adapt/reference decisions are explicit.
- CRE runtime, CRM, operator shell, package imports, and provider/API couplings are listed as non-imports.

### SOPHEX-FE-COCKPIT-BENTO-STATE-CONTRACT

Objective: Add a reusable Sophex-native bento tile system with honest loading, error, empty, and ok states.

Likely files:

- `prototype/src/components/studio/BentoTile.tsx`
- `prototype/src/index.css`
- `prototype/src/stories/Wave8Cockpit.stories.tsx`
- `prototype/src/test/wave8-cockpit.test.tsx`

Acceptance criteria:

- `BentoTile`, `BentoGrid`, `BentoSection`, and `BentoCardSkeleton` render without CRE package dependencies.
- Empty-state copy avoids implying zero business activity.
- Storybook and unit coverage exercise state variants.

### SOPHEX-FE-COCKPIT-DEAL-PANEL-COMPOSITION

Objective: Compose the deal overview and underwriting cockpit around one reusable cockpit model.

Likely files:

- `prototype/src/components/workflow/DealCockpitPanel.tsx`
- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/lib/workflow/next-action.ts`
- `prototype/src/lib/workflow/confidence.ts`

Acceptance criteria:

- Deal overview shows bento stage posture, next action, blocker count, KPIs, and task rail.
- Underwriting cockpit uses the same panel with underwriting-specific KPIs.
- Runtime mode remains fixture/api compatible through existing sandbox workflow ports.

### SOPHEX-FE-UW-CONFIDENCE-HITL-ACTIONS

Objective: Convert static HITL assignments into confidence-aware advisory actions.

Likely files:

- `prototype/src/lib/workflow/confidence.ts`
- `prototype/src/lib/workflow/review-assignments.ts`
- `prototype/src/components/workflow/HitlReviewDrawer.tsx`
- `prototype/src/components/workstation/ReviewerAssignmentDrawer.tsx`
- `prototype/src/pages/studio/DesignReferenceRoutes.tsx`

Acceptance criteria:

- Shared review assignment source feeds both the drawer and full analyst review route.
- Confidence maps to auto/confirm/review/blocked and trust-tier labels.
- Approve/export actions remain disabled or mock-only where gates are unresolved.

### SOPHEX-FE-EVIDENCE-DATA-WORKBENCH-SHELL

Objective: Add a shared Evidence Workbench shell with table/list/grid views.

Likely files:

- `prototype/src/components/workflow/DataWorkbenchShell.tsx`
- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/index.css`

Acceptance criteria:

- Source trace and data review use the workbench shell.
- View changes are local UI state only and do not alter evidence authority.
- Workbench header supports actions, secondary controls, and AI/task slots.

### SOPHEX-FE-COCKPIT-AI-TASK-PULSE

Objective: Add prop-driven mock AI/reviewer task pulse widgets to cockpit surfaces.

Likely files:

- `prototype/src/components/workflow/AiTaskPulse.tsx`
- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/stories/Wave8Cockpit.stories.tsx`

Acceptance criteria:

- Tasks support queued, running, completed, and error states.
- Copy is bounded to evidence gaps, lender quote, source rights, snapshot lock, and export readiness.
- No fetch URLs, queue workers, or provider calls are introduced.

### SOPHEX-FE-COCKPIT-STORYBOOK-AND-TESTS

Objective: Cover Wave 8 primitives with targeted tests and Storybook composition.

Likely files:

- `prototype/src/stories/Wave8Cockpit.stories.tsx`
- `prototype/src/test/wave8-cockpit.test.tsx`
- `prototype/src/test/stories.test.tsx`

Acceptance criteria:

- Tests cover confidence escalation, readiness-gate next-action precedence, and bento empty-state copy.
- Storybook renders bento states, cockpit panel, and workbench shell.
- `test:stories` remains green.

### SOPHEX-DOCS-CRE-COCKPIT-HARVEST-SYNC

Objective: Sync docs and registries for Wave 8 cockpit utilization.

Likely files:

- `docs/RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md`
- `docs/MOCK_RESOLUTION_REGISTRY.md`
- `docs/UNDERWRITING_WORKFLOW_UX_REVIEW_2026-05-25.md`
- `docs/WORLD_CLASS_PROTOTYPE_SPEC.md`
- `docs/PROTOTYPE_MVP0.md`

Acceptance criteria:

- Wave 8 appears in the rapid-build inventory.
- Mock registry records new advisory widgets, workbench modes, and HITL confidence surfaces.
- Stale prototype/spec docs acknowledge the cockpit primitives.

## Wave 9 Install / Polish Backlog

### SOPHEX-FE-COCKPIT-VISUAL-POLISH

Objective: Refine spacing, responsive behavior, and visual hierarchy of bento cockpit surfaces after Wave 8 is reviewed.

Likely files:

- `prototype/src/index.css`
- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/stories/Wave8Cockpit.stories.tsx`
- `prototype/e2e/visual.spec.ts`

Acceptance criteria:

- Overview and underwriting cockpit feel visually intentional at desktop and mobile sizes.
- Bento tiles do not crowd existing workflow tabs or stage stepper.
- Visual baselines are added or updated for cockpit surfaces.

### SOPHEX-FE-EVIDENCE-WORKBENCH-SPATIAL-INTEGRATION

Objective: Fold the spatial workbench into the Evidence Workbench mental model without hiding GIS source-rights posture.

Likely files:

- `prototype/src/pages/studio/GisRoutes.tsx`
- `prototype/src/components/workflow/DataWorkbenchShell.tsx`
- `prototype/src/lib/gis/*`

Acceptance criteria:

- Spatial route uses the workbench shell or a compatible header/toolbar.
- Source-rights, verification, and layer-budget states remain visible.
- No live map/provider work is introduced.

### SOPHEX-FE-COCKPIT-RUNTIME-PORT-ENRICHMENT

Objective: Enrich sandbox workflow ports so cockpit bento tiles can consume one advisory projection rather than page-local fixtures.

Likely files:

- `prototype/src/lib/runtime/service-ports.ts`
- `prototype/src/lib/runtime/sandbox-api.ts`
- `prototype/src/lib/runtime/sandbox-api-client.ts`
- `prototype/src/lib/workflow/next-action.ts`
- `prototype/src/test/sandbox-api.test.ts`

Acceptance criteria:

- Cockpit projection is available through sandbox API mode.
- Public/private/HITL-sensitive fields remain filtered.
- Existing `api-mode` e2e tests stay green.

### SOPHEX-FE-HITL-CONFIDENCE-E2E-FLOWS

Objective: Add browser coverage for confidence-aware HITL paths.

Likely files:

- `prototype/e2e/api-mode.spec.ts`
- `prototype/e2e/flows.spec.ts`
- `prototype/src/components/workflow/HitlReviewDrawer.tsx`

Acceptance criteria:

- E2E covers opening the analyst review drawer from underwriting.
- Reviewer detail shows confidence/escalation copy.
- Disabled approval/export authority remains verifiable.

### SOPHEX-FE-WAVE-8-LIGHTHOUSE-VISUAL-REGRESSION

Objective: Run and update the broader quality gates after Wave 8 lands.

Likely files:

- `prototype/lighthouserc.cjs`
- `prototype/e2e/visual.spec.ts`
- `prototype/src/test/stories.test.tsx`

Acceptance criteria:

- Lighthouse remains within configured thresholds.
- Visual baselines reflect accepted cockpit changes.
- Storybook accessibility remains green.

## Closeout Validation For Wave 8

Known green validation before ticket pack creation:

- `npm run typecheck`
- `npm run lint`
- `npm run test:api` — 8 passed
- `npm run test` — 263 passed
- `npm run test:stories` — 62 passed
- `npm run build`
- `npm run budget:check`
- `VITE_SOPHEX_RUNTIME_MODE=api npm run test:e2e:api` — 3 passed

Repo-wide `npm run format:check` is still noisy from pre-existing formatting drift; Wave 8 touched files were formatted directly.
