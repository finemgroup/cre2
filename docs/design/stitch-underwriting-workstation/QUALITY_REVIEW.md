# Stitch Underwriting Workstation Quality Review

Reviewed: 2026-05-25

This review covers the saved Stitch screenshots and raw generated HTML under `docs/design/stitch-underwriting-workstation/`.

## Overall Assessment

The Stitch output is strong product-direction material. It captures the right institutional tone: dense but legible, evidence-forward, gate-aware, and clearly shaped around analyst/reviewer underwriting work rather than a generic dashboard.

The best near-term prototype candidates are the modal and drawer states because they add missing depth without requiring runtime systems:

- `Calculation Breakdown Drawer`
- `Evidence Conflict Resolver`
- `Export Manifest Preview`
- `Version Lock Confirmation`
- `Sensitivity Cell Drilldown`

The strongest page-level candidates are:

- `Scenario Diff`
- `Valuation Version Timeline`
- `Assumption Source Trace`
- `Rent Roll / T12 Normalization Review`
- `Debt / Lender Quote Panel`

`Investment Committee Packet` and `Capital Stack & Waterfall` are useful design references, but they should stay constrained unless implemented as mock-only, advisory, non-exportable views.

## Quality Notes

The screens generally pass the product-quality bar:

- Source posture is visible near critical metrics and decisions.
- Gated actions are usually explained instead of merely disabled.
- The prototype boundary is repeatedly visible through the bottom warning banner.
- The modal/drawer set fills the exact missing interactions: source conflict, version lock, export manifest, calculation trace, and sensitivity cell drilldown.
- The scenarios/version/report surfaces form a coherent workflow from assumption review to scenario lock to IC/report/export readiness.

## Corrections Before Adaptation

Do not copy the raw Stitch HTML directly into `prototype/`. During adaptation:

- Replace Tailwind CDN and generated utility markup with existing React/CSS primitives.
- Remove duplicated Material Symbols font links.
- Replace external image URLs with existing mock avatar/logo placeholders.
- Preserve current deferred font loading instead of reintroducing global font stylesheet links.
- Keep all export/report/lock actions disabled or routed through prototype feedback unless gates are explicitly mock-cleared.
- Add accessible labels for icon-only readiness rail buttons and close buttons.
- Avoid footer overlap on shorter viewports by preserving existing prototype shell spacing.
- Normalize copy to existing vocabulary: `candidate evidence`, `reviewed`, `source pending`, `blocked`, `advisory`, `reviewer required`, `export gated`.
- Treat checksums, receipts, immutable snapshots, and export manifests as placeholders only.

## Recommended Implementation Order

1. Calculation Breakdown Drawer
2. Evidence Conflict Resolver Modal
3. Export Manifest Preview Modal
4. Version Lock Confirmation Modal
5. Sensitivity Cell Drilldown Drawer
6. Scenario Diff View
7. Valuation Version Timeline
8. Assumption Source Trace View
9. Rent Roll / T12 Normalization Review
10. Debt / Lender Quote Panel

Keep `Capital Stack & Waterfall` and `Investment Committee Packet` as design reference until the core evidence-to-export workflow is fully represented.

## Saved Artifact Inventory

- `wave-1/screenshots/`: 4 first-pass screenshots.
- `wave-1/raw-html/`: 4 raw Stitch HTML files.
- `wave-2/screenshots/`: 9 second-pass screenshots.
- `wave-2/raw-html/`: 9 raw Stitch HTML files.

These files are intentionally docs/design artifacts. They preserve the generated code and screenshots for review while keeping production/runtime boundaries closed.
