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

## Product Workflow Tickets (Wave 2)

| Ticket | Status | Notes |
| --- | --- | --- |
| `SOPHEX-FE-WORKFLOW-UNDERWRITING-SPINE-POLISH` | Implemented in prototype | Workflow spine nav, expanded handoffs, assumptions source trace link |
| `SOPHEX-FE-WORKFLOW-INTAKE-TO-ASSUMPTIONS` | Implemented in prototype | Intake workflow nav, data-review conflict resolver, staged import copy |
| `SOPHEX-FE-WORKFLOW-SCENARIO-GOVERNANCE` | Implemented in prototype | Scenario page title fix, gate implications column, lock blocker copy |
| `SOPHEX-FE-WORKFLOW-REPORT-EXPORT-SPINE` | Implemented in prototype | Export manifest card, evidence appendix, redaction copy |
| `SOPHEX-FE-WORKFLOW-PUBLIC-TO-STUDIO-CONTINUITY` | Implemented in prototype | PublicStudioContinuityBanner on landing/property/report/export |
| `SOPHEX-FE-DESIGN-REFERENCE-BACKLOG` | Documented | Capital Stack/Waterfall, IC Packet, HITL drawer remain design reference |

## Design Reference Backlog (Do Not Promote Without New Ticket)

These Stitch surfaces remain **design reference only** until explicitly promoted with mock-only boundaries:

- ~~Capital Stack / Waterfall View~~ → **Promoted Wave 3** (`/studio/deals/:dealId/capital-stack`)
- ~~Investment Committee / Approval Packet~~ → **Promoted Wave 3** (`/studio/deals/:dealId/ic-packet`)
- ~~Reviewer Assignment / HITL Drawer~~ → **Promoted Wave 3** (`/studio/deals/:dealId/hitl-review`)

See `STITCH_UNDERWRITING_WORKSTATION_TRIAGE.md` and `docs/design/stitch-underwriting-workstation/QUALITY_REVIEW.md`.

## Wave 3 Complete (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Design reference promotion | Implemented | Capital stack, IC packet, HITL review routes with mock-only gates |
| GIS contract spine | Implemented | `lib/gis`, spatial workbench route, manifest/source-rights/verification |
| Phase 2 quality expansion | Implemented | Route titles, Lighthouse URLs, e2e + unit tests for Wave 3 |

## Wave 4 Complete (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Unified valuation readiness rail | Implemented | `ValuationReadinessRail` on public report/export, comps, studio report builder, version timeline |
| Version ↔ export linkage | Implemented | Version timeline export eligibility, IC/report handoffs, evidence snapshot copy |
| GIS performance budgets | Implemented | `lib/gis/performance`, spatial workbench layer budget table |
| Quality coverage | Implemented | Storybook, unit tests, e2e extensions for Wave 4 |

## Wave 5 Complete (2026-05-25)

| Track | Status | Notes |
| --- | --- | --- |
| Visual regression | Implemented | Playwright snapshots for capital stack, IC packet, HITL review, spatial, version readiness |
| Storybook polish | Implemented | `Wave3Polish.stories.tsx` for AdvancedWorkflowNav, ReviewerAssignmentDrawer, trust tiers |
| HITL / trust-tier copy | Implemented | `HitlTrustTierBadge`, HITL queue + Broker OS projection, assignment drawer tiers |
| Cross-entity e2e | Implemented | `demo-001`↔`riverside-flats`, `demo-002`↔`1200-tech` public→Studio continuity |
| CTA accessibility audit | Implemented | Disabled Export Waterfall, Send to IC, Approve for export use `aria-describedby` |
| Quality coverage | Implemented | `hitl-trust-tier.test.ts`, extended `cta-feedback.test.tsx`, Storybook a11y |
