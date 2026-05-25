# Composer 2.5 Rapid Implementation Ticket Pack - Product Workflows

This pack defines the next rapid mock-only implementation wave after the component standardization and Stitch rollout.

It is scoped to cohesive user workflows, not isolated screens. All work stays in `prototype/` and `docs/`.

## Global Rules

- Keep all data deterministic and local.
- Use existing primitives before adding new ones.
- Use `PrototypeActionButton`, `PrototypeActionLink`, disabled buttons, or blocker copy for non-functional actions.
- Preserve proof-honest vocabulary: `candidate evidence`, `reviewed`, `blocked`, `advisory`, `source pending`, `reviewer required`, `export gated`.
- Do not use `.env`, schema, migrations, generated clients, DBs, provider SDKs, queues, deploys, real upload/OCR, signed checksums, or persisted decisions.
- Validate with `IMPLEMENTATION_QUALITY_DISCIPLINE.md`.

## SOPHEX-FE-WORKFLOW-UNDERWRITING-SPINE-POLISH

Objective: Tighten the assumptions -> evidence -> review -> gates -> version -> report/export flow into one intuitive workstation spine.

Likely files:

- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/components/workstation/UnderwritingWorkstationPrimitives.tsx`
- `prototype/src/components/underwriting/UnderwritingPanels.tsx`
- `prototype/src/index.css`
- `prototype/e2e/flows.spec.ts`

Acceptance criteria:

- Underwriting cockpit clearly shows the current stage, advisory valuation range, source coverage, blockers, and next gated action.
- Assumption trace, calculation breakdown, version lock, and report/export links feel like one continuous workflow.
- Every important value has nearby source posture or a clear route to evidence detail.
- Version lock remains disabled until warning/blocker copy is intentionally cleared in mock state.
- Flow tests cover the main path from underwriting cockpit to source trace and version lock review.

## SOPHEX-FE-WORKFLOW-REPORT-EXPORT-SPINE

Objective: Enrich the report builder and export manifest workflow around included/excluded sections, redactions, evidence appendix, and reviewer posture.

Likely files:

- `prototype/src/pages/studio/ReportRoutes.tsx`
- `prototype/src/components/overlays/ExportGovernanceModal.tsx`
- `prototype/src/components/report-governance/ReportGovernanceCards.tsx`
- `prototype/src/lib/report-governance/index.ts`
- `prototype/src/test/report-governance.test.ts`
- `prototype/e2e/flows.spec.ts`

Acceptance criteria:

- Report builder explains which sections are ready, blocked, draft, or reviewer-required.
- Export manifest shows included sections, excluded reasons, redaction copy, receipt/checksum placeholders, and reviewer request action.
- Public and Studio export gates use consistent authority language.
- Export remains simulated or disabled with clear copy.
- Tests verify blocked/ready manifest states and no false export authority.

## SOPHEX-FE-WORKFLOW-INTAKE-TO-ASSUMPTIONS

Objective: Connect upload/intake, rent roll/T12 normalization, conflict resolution, and assumption trace more clearly.

Likely files:

- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/components/review/StagedImportReviewPanel.tsx`
- `prototype/src/lib/staged-import/index.ts`
- `prototype/src/components/workstation/UnderwritingWorkstationPrimitives.tsx`
- `prototype/src/test/review-state.test.ts`
- `prototype/e2e/flows.spec.ts`

Acceptance criteria:

- Intake/data-review surfaces show source files, extracted values, normalized candidates, issue rows, and source posture.
- Conflict resolver opens from the data-review or source-trace workflow with required rationale.
- Promotion actions are disabled or simulated and do not imply persisted truth.
- Assumption trace reflects the same candidate/review/blocked language seen in intake.
- Flow tests cover data-review -> source-trace -> conflict resolver.

## SOPHEX-FE-WORKFLOW-SCENARIO-GOVERNANCE

Objective: Clarify scenario diff, sensitivity drilldown, scenario lock gates, and advisory/legal copy.

Likely files:

- `prototype/src/pages/studio/DealRoutes.tsx`
- `prototype/src/components/visualization/SensitivityHeatmap.tsx`
- `prototype/src/lib/underwriting/scenarios.ts`
- `prototype/src/test/scenario-presets.test.ts`
- `prototype/src/test/a11y-charts.test.tsx`
- `prototype/e2e/flows.spec.ts`

Acceptance criteria:

- Scenario comparison reads as a governed review surface, not just a dashboard.
- Driver diff table shows source posture, max delta, and gate implications.
- Sensitivity drilldown clearly labels outputs as advisory and mock-only.
- Scenario lock action stays disabled or simulated with blocker explanation.
- Keyboard and screen-reader paths remain intact for heatmap drilldown.

## SOPHEX-FE-WORKFLOW-PUBLIC-TO-STUDIO-CONTINUITY

Objective: Make public search/property/report/export surfaces feel visibly connected to Studio evidence and authority language.

Likely files:

- `prototype/src/pages/LandingPage.tsx`
- `prototype/src/pages/PropertyPage.tsx`
- `prototype/src/pages/ReportPage.tsx`
- `prototype/src/pages/ExportPage.tsx`
- `prototype/src/components/layout/PublicShell.tsx`
- `prototype/src/components/evidence/EvidenceMetadataList.tsx`
- `prototype/src/test/public-routes.test.tsx`
- `prototype/e2e/flows.spec.ts`

Acceptance criteria:

- Public property and report surfaces use the same authority/source vocabulary as Studio.
- Evidence drawer and export gate explain what is public baseline, candidate evidence, reviewed, blocked, or redacted.
- Public route actions continue to show prototype feedback rather than real export/upload behavior.
- Public-to-Studio conceptual continuity is visible without exposing private/internal data.
- Tests cover public evidence and export gate copy.

## SOPHEX-FE-DESIGN-REFERENCE-BACKLOG

Objective: Preserve remaining Stitch design references as future prototype candidates without promoting them prematurely.

Likely files:

- `docs/STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md`
- `docs/design/stitch-underwriting-workstation/QUALITY_REVIEW.md`
- `docs/RAPID_BUILD_TICKET_INVENTORY_2026-05-25.md`

Acceptance criteria:

- Capital Stack / Waterfall remains design reference unless explicitly promoted.
- Investment Committee Packet remains design reference until report/export and review authority are stronger.
- Reviewer Assignment / HITL drawer remains design reference unless only mock internal users are used.
- Any promoted design receives a new mock-only ticket with runtime boundaries.

## Suggested Execution Order

1. `SOPHEX-FE-WORKFLOW-UNDERWRITING-SPINE-POLISH`
2. `SOPHEX-FE-WORKFLOW-INTAKE-TO-ASSUMPTIONS`
3. `SOPHEX-FE-WORKFLOW-SCENARIO-GOVERNANCE`
4. `SOPHEX-FE-WORKFLOW-REPORT-EXPORT-SPINE`
5. `SOPHEX-FE-WORKFLOW-PUBLIC-TO-STUDIO-CONTINUITY`
6. `SOPHEX-FE-DESIGN-REFERENCE-BACKLOG`

## Validation

Use `IMPLEMENTATION_QUALITY_DISCIPLINE.md` as the gate checklist for every ticket.
