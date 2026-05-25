# Frontend Component Audit - 2026-05-25

This audit supports the Component Library Standardization and Stitch Rollout plan. It is scoped to the authorized mock-only prototype lane.

No schema, runtime service, provider, deploy, queue, real upload, OCR, persisted review decision, or production data work is authorized by this document.

## Component Inventory

| Family              | Primary files                                                                                                                                                    | Current state                                                                         | Recommendation                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Public shell        | `prototype/src/components/layout/PublicShell.tsx`, `prototype/src/components/ui/StageRail.tsx`                                                                   | Stable public navigation, footer, non-production banner, route transitions.           | Keep. Continue isolating public tokens from Studio tokens.                                                    |
| Studio shell        | `prototype/src/components/layout/StudioAppShell.tsx`, `prototype/src/components/layout/StudioStandaloneShell.tsx`, `prototype/src/pages/studio/StudioShared.tsx` | Strong app frame with sidebar/topbar and deal workflow tabs.                          | Keep and extend for new deal routes: source trace, debt, data review, versions.                               |
| Studio primitives   | `prototype/src/components/studio/StudioPrimitives.tsx`                                                                                                           | Useful shared card/table/badge/action primitives, but becoming a broad module.        | Standardize first; split later if growth continues.                                                           |
| Tokens/CSS          | `prototype/src/index.css`                                                                                                                                        | CSS-first platform tokens with public and Studio surface scopes.                      | Standardize aliases, badge colors, readiness rail, trace cards, and modal/drawer anatomy.                     |
| Authority badges    | `prototype/src/lib/authority/authority-vocabulary.ts`, `AuthorityBadge`, `TrustBadge`, `StatusBadge`                                                             | Central vocabulary exists, but display components still diverge.                      | Standardize posture mapping and use proof-honest copy everywhere.                                             |
| Overlays            | `SophexModal`, `SophexSheet`, domain modals                                                                                                                      | Good focus-trapped base primitives.                                                   | Add consistent header/body/footer/action anatomy and reuse for Stitch drawers/modals.                         |
| Evidence/provenance | `EvidenceMetadataList`, `ProvenanceWidgets`, `UnderwritingPanels`                                                                                                | Strong source posture foundation, but Stitch needs richer value cards and trace rows. | Add reusable evidence trace primitives for source refs, as-of dates, confidence, and candidate/review states. |
| Workflow/governance | `WorkflowPrimitives`, `ReportGovernanceCards`, underwriting gates                                                                                                | Strong trust and gate vocabulary.                                                     | Add reusable readiness rail and version/export manifest states.                                               |
| Visualization       | `AccessibleBarChart`, `SensitivityHeatmap`                                                                                                                       | Accessibility-aware chart patterns exist.                                             | Add clickable/keyboard heatmap drilldown while preserving table fallback.                                     |
| Review/import       | `StagedImportReviewPanel`, `UploadDropzone`                                                                                                                      | Candidate evidence workflow exists.                                                   | Expand into rent roll/T12 normalization and conflict resolver.                                                |
| Storybook/tests     | `prototype/src/stories`, `prototype/src/test`, `prototype/e2e`                                                                                                   | Good baseline for Storybook axe, unit tests, public route coverage, visual tests.     | Add stories and visual baselines for new Stitch primitives and Studio surfaces.                               |

## Standardization Gaps

- Badge copy and styling should converge around one posture vocabulary: `candidate evidence`, `reviewed`, `blocked`, `advisory`, `source pending`, `reviewer required`, `model-inferred`.
- Stage/readiness UI should support horizontal public stage rails, Studio stepper states, and Stitch-style vertical readiness rails with keyboard labels.
- Modals and drawers should share predictable anatomy: title, subtitle, body, advisory callout, action footer, disabled gate explanation.
- Evidence patterns should make source ref, as-of date, confidence, authority, and explanation visible near each important value.
- Metric cards should support explainability actions without implying live recalculation or appraisal authority.
- New Stitch pages should reuse the existing shell, `DealWorkflowTabs`, mock fixtures, and prototype feedback actions.

## Stitch Fit

The existing prototype already has the underwriting spine: deal context, assumptions, metrics, gates, scenarios, pro forma, source posture, staged import, report builder, and export blockers.

The Stitch surfaces add missing product depth:

- Calculation and sensitivity explainability.
- Side-by-side evidence conflict resolution.
- Export manifest preview.
- Governed version lock confirmation.
- Executive cockpit composition.
- Scenario diff and driver posture.
- Source trace, data normalization, debt quote, and valuation version routes.

## Implementation Rules

- Adapt saved Stitch artifacts from `docs/design/stitch-underwriting-workstation`; do not copy raw generated HTML.
- Keep all code work under `prototype/`.
- Keep all new source data deterministic and local.
- Use `PrototypeActionButton`, `PrototypeActionLink`, or disabled buttons with blocker copy for inert actions.
- Add tests proportionate to each change: unit/state tests for logic, Storybook for reusable components, Playwright visual coverage for route-level layouts.

## World-Class Bar

The platform should feel cohesive because the same patterns recur:

- One shell language.
- One badge language.
- One gate language.
- One evidence trace language.
- One modal/drawer interaction model.
- One non-production/prototype boundary.

This is the standard to use when turning each Stitch screen into implementation tickets.
