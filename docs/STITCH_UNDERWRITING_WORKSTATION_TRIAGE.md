# Stitch Underwriting Workstation Triage

This packet is the landing zone for Google Stitch outputs for the Finem CRE Studio / Sophex underwriting workstation.

It is a docs-only triage guide. It does not authorize schema, runtime services, production data, deploys, provider calls, queues, or real document handling.

## Purpose

The current mock prototype has the underwriting spine: deal context, assumptions, formula-backed metrics, gates, scenario comparison, source posture, report builder, and export blockers.

The Stitch pass should explore the premium product shape around that spine:

- How analysts trust each assumption and metric.
- How candidate evidence becomes reviewer-backed underwriting input.
- How scenario output stays advisory until reviewed.
- How valuation versions connect to evidence snapshots.
- How report/export actions remain gated and explainable.

## Intake Workflow

Use this process when Stitch outputs arrive:

1. Save or reference the Stitch artifact set in the design handoff location chosen by the operator.
2. Review each screen against the acceptance criteria below.
3. Classify each item as `Prototype now`, `Design reference`, or `Runtime gated`.
4. Convert only `Prototype now` items into mock-only `prototype/` tickets.
5. Move runtime, schema, upload, provider, or export implementation ideas into gated-lane docs instead of implementing them.

## Received Stitch Outputs

Saved artifact packet:

- `docs/design/stitch-underwriting-workstation/README.md`
- `docs/design/stitch-underwriting-workstation/QUALITY_REVIEW.md`
- `docs/design/stitch-underwriting-workstation/wave-1/screenshots/`
- `docs/design/stitch-underwriting-workstation/wave-1/raw-html/`
- `docs/design/stitch-underwriting-workstation/wave-2/screenshots/`
- `docs/design/stitch-underwriting-workstation/wave-2/raw-html/`

### 2026-05-25 Wave 1

The first Stitch batch includes four high-value underwriting workstation surfaces:

| Received surface | Triage result | Notes |
| --- | --- | --- |
| Underwriting Executive Cockpit | `Prototype now` | Strong fit for a new executive cockpit view or upgraded underwriting landing section. Keep advisory valuation range, blocker card, source coverage, readiness rail, and metric trust chips. |
| Assumption Source Trace | `Prototype now` | Strongest immediate candidate. It directly extends current assumptions with source refs, confidence, status, conflict row, and observation detail panel. |
| Rent Roll / T12 Normalization Review | `Prototype now` | Strong candidate for mock staged-import review expansion. Keep candidate-evidence banner, source cards, extracted/normalized table, issue rows, and batch action bar. |
| Debt / Lender Quote Panel | `Prototype now` | Strong candidate for a debt assumptions card/page. Keep lender quote missing blocker, debt scenarios, quote pending state, and source-pending posture. |

### 2026-05-25 Wave 2

The second Stitch batch completes the scenario, versioning, report/export, and review-interaction states:

| Received surface | Triage result | Notes |
| --- | --- | --- |
| Sensitivity Cell Drilldown Drawer | `Prototype now` | High-value missing interaction. Keep selected cell target, resulting metrics, source posture, advisory copy, and mock add-to-scenario/review actions. |
| Export Manifest Preview Modal | `Prototype now` | Strong export-gate reference. Preserve included/excluded sections, blocker reasons, redaction copy, receipt/checksum placeholders, and disabled export. |
| Version Lock Confirmation Modal | `Prototype now` | Strong governance reference. Preserve included assumptions/scenarios/source refs, blockers, excluded candidates, evidence snapshot, and disabled lock until gates clear. |
| Evidence Conflict Resolver Modal | `Prototype now` | Strongest reviewer-state modal. Preserve side-by-side evidence values, confidence/source refs, required rationale, and mock confirm behavior. |
| Calculation Breakdown Drawer | `Prototype now` | Strongest formula-trust drawer. Preserve formula display, input traceability, source-pending row, suspended calculation warning, and assumption-trace action. |
| Investment Committee Packet | `Design reference` | Useful for report-review composition and approval-chain language. Do not rush into prototype until core evidence/export gates are represented. |
| Scenario Diff View | `Prototype now` | Strong page-level candidate. Preserve Base/Upside/Downside cards, changed-driver table, source posture by driver, and disabled scenario lock gate. |
| Valuation Version Timeline | `Prototype now` | Strong governed-version reference. Preserve evidence snapshot refs, deltas, included/excluded candidates, and disabled lock/export gate. |
| Capital Stack / Waterfall View | `Design reference` | Good visual/economic direction, but keep as advisory and mock-only if implemented. Avoid real waterfall math, legal conclusions, or LP reporting behavior. |

### Adaptation Guidance

Do not copy Stitch HTML directly into the prototype. The generated HTML uses Tailwind CDN, duplicated font links, external image URLs, and static utility markup. Adapt the design into existing React/CSS primitives instead:

- `StudioCard`, `MetricCard`, `DataTable`, `StatusBadge`, `TrustBadge`, `WorkflowContextHeader`, `DealWorkflowTabs`
- Existing authority vocabulary and prototype feedback hooks
- Existing mock underwriting/scenario/source-bundle fixtures
- Existing no-live-valuation footer and non-production banners

### Design Issues To Correct During Adaptation

- Sidebar active state should consistently highlight `Underwriting`, not `Dashboard`, on underwriting cockpit screens.
- External image URLs should be replaced with existing avatar/logo placeholders.
- Duplicate Material Symbols font links should not be carried over.
- Export/download buttons should be prototype feedback or explicitly disabled with blocker copy.
- Right-side readiness rail needs accessible labels, not hover-only tooltips.
- Fixed footer should not obscure table content on shorter viewports.
- "Final" and "Reviewed" labels should map to the established authority vocabulary where possible.

## Classification Labels

| Label | Meaning | Allowed next action |
| --- | --- | --- |
| `Prototype now` | Can be represented with deterministic mock data and existing UI contracts. | Add mock-only UI, tests, Storybook, docs. |
| `Design reference` | Useful product direction, but not needed in the clickable prototype yet. | Preserve as design guidance. |
| `Runtime gated` | Requires real API, file handling, permission enforcement, schema, providers, or export artifacts. | Move to gated lane or contract docs only. |

## Global Acceptance Criteria

Every accepted design should:

- Preserve the external Sophex trust boundary.
- Label mock/prototype state explicitly.
- Use proof-honest language: `candidate evidence`, `reviewed`, `blocked`, `advisory`, `source pending`, `reviewer required`, `export gated`.
- Keep disabled buttons explainable.
- Show source refs and as-of dates near important values.
- Avoid appraisal-superiority claims.
- Avoid treating UI gates as authorization.
- Avoid real provider, CRM, queue, deploy, or document-storage assumptions.

## Page Triage Matrix

| Stitch screen | Primary purpose | Likely classification | Prototype acceptance criteria | Runtime-gated boundary |
| --- | --- | --- | --- | --- |
| Underwriting Executive Cockpit | Give analyst/senior broker a decision-ready view of valuation posture. | `Prototype now` | Shows valuation range as advisory, readiness rail, top blockers, source coverage, next action, and gated report/export CTA. | Real scoring, reviewer identity, live model outputs. |
| Assumption Source Trace View | Connect every assumption to evidence, reviewer state, and competing observations. | `Prototype now` | Table includes current value, source family, source ref, as-of date, confidence, review state, action. Detail panel shows why a value was chosen. | Server-side source resolution, persisted reviewer decisions. |
| Rent Roll / T12 Normalization Review | Show candidate extraction and normalization before promotion to assumptions. | `Prototype now` | Candidate rows, normalized values, issues, batch review actions, explicit candidate-only warning. | Real file parsing, OCR, extraction confidence pipeline. |
| Debt / Lender Quote Panel | Represent financing assumptions and debt blockers. | `Prototype now` | DSCR/LTV/debt yield cards, quote missing gate, add-quote drawer trigger, source-pending labels. | Real lender quotes, storage, terms, provider integrations. |
| Capital Stack / Waterfall View | Explore sponsor/LP economics and waterfall structure. | `Design reference` | If prototyped, keep math advisory and simple; show structure, not a full model. | Legal/economic review, waterfall runtime math, LP reporting. |
| Scenario Diff View | Compare Base/Upside/Downside assumption changes and deltas. | `Prototype now` | Highlights changed assumptions, metric deltas, source posture per driver, save/send/lock gates. | Persisted scenario sets, collaboration, approval routing. |
| Valuation Version Timeline | Show governed valuation snapshots and evidence snapshot refs. | `Prototype now` | Version cards include ID, created date, scenario set, evidence snapshot ref, gate summary, export eligibility. | Real immutable snapshots, receipts, audit log. |
| Investment Committee / Approval Packet | Internal pre-report review and signoff surface. | `Design reference` | Good design input for report-review UX; prototype only if it stays mock/HITL-only. | Real reviewer assignment, legal/compliance workflow, audit events. |

## Modal And Drawer Triage Matrix

| Stitch state | Primary purpose | Likely classification | Prototype acceptance criteria | Runtime-gated boundary |
| --- | --- | --- | --- | --- |
| Calculation Breakdown Drawer | Explain formula, inputs, and evidence behind DSCR/IRR/cap rate/value. | `Prototype now` | Formula, inputs, source refs, review state, advisory copy, link to assumption trace. | Proprietary model internals, live calculations beyond mock fixtures. |
| Assumption Evidence Drawer | Drill into one assumption's lineage and competing observations. | `Prototype now` | Current value, source lineage, competing observations, reviewer notes, promote/hold/exclude mock actions. | Persisted observation resolution and permission enforcement. |
| Evidence Conflict Resolver Modal | Let reviewer resolve conflicting candidate facts with reason. | `Prototype now` | Side-by-side sources, confidence/as-of dates, required reason before confirm, mock toast. | Real HITL decision persistence, audit log. |
| Version Lock Confirmation Modal | Confirm what becomes part of a governed valuation version. | `Prototype now` | Included assumptions/scenarios, excluded candidates, blockers/warnings, evidence snapshot ref. | Immutable version storage, receipt generation. |
| Export Manifest Preview Modal | Preview included/excluded report sections and redacted evidence refs. | `Prototype now` | Included sections, excluded reasons, redacted refs, checksum placeholder, disabled export if gates fail. | Real artifact generation, signed checksums, delivery. |
| Lender Quote Missing / Add Quote Drawer | Capture mock quote inputs and source-use posture. | `Prototype now` | Missing quote blocker, lender/rate/term fields, candidate evidence state, no live upload. | Real upload/storage, lender/provider integration. |
| Sensitivity Cell Drilldown Drawer | Explain one heatmap cell's assumptions and result. | `Prototype now` | Selected exit cap/purchase price, resulting metrics, assumptions, advisory posture, add-to-scenario mock action. | Persisted scenario generation and optimization engine. |
| Reviewer Assignment / HITL Drawer | Show who needs to review what and why. | `Design reference` | Good UI reference; prototype only with mock users and internal-only labels. | Real identity, queue, notifications, SLAs. |

## Priority Order After Stitch Returns

Recommended implementation order for mock-only prototype work:

1. Calculation Breakdown Drawer
2. Assumption Evidence Drawer
3. Evidence Conflict Resolver Modal
4. Export Manifest Preview Modal
5. Version Lock Confirmation Modal
6. Underwriting Executive Cockpit
7. Scenario Diff View
8. Rent Roll / T12 Normalization Review
9. Debt / Lender Quote Panel
10. Valuation Version Timeline

Design-reference items promoted in Wave 3 (mock-only, export gated):

- Capital Stack / Waterfall View → `/studio/deals/:dealId/capital-stack`
- Investment Committee / Approval Packet → `/studio/deals/:dealId/ic-packet`
- Reviewer Assignment / HITL Drawer → `/studio/deals/:dealId/hitl-review`

Additional Wave 3 surface:

- Spatial manifest workbench → `/studio/deals/:dealId/spatial`

## Stitch Review Checklist

For each Stitch output, answer:

- Does it show source posture near every important value?
- Does it separate candidate evidence from reviewed facts?
- Does it explain disabled or gated actions?
- Does it avoid live/export/production claims?
- Does it connect assumptions -> evidence -> review -> gates -> valuation version -> report/export?
- Does it work as a broker/analyst workstation rather than a generic dashboard?
- Is the screen useful with mock data only?
- Would implementation require real files, APIs, DB, queue, provider calls, or deploys?

## Handoff Notes For Implementation

When converting accepted Stitch designs into prototype tickets:

- Keep files under `prototype/` and docs under `docs/`.
- Reuse existing authority vocabulary and trust labels.
- Reuse mock contracts and pure TypeScript fixtures where possible.
- Add focused Vitest coverage for state and policy behavior.
- Add Storybook coverage for reusable drawers/modals.
- Add Playwright coverage only for high-value end-to-end paths.
- Do not add runtime servers, schema files, provider SDKs, queue workers, real upload handlers, or `.env` usage.

## Gated Follow-Ups

Move these to gated lane docs instead of prototype implementation:

- Real document upload or OCR normalization.
- Persisted reviewer decisions.
- API-backed permission filtering.
- Immutable evidence snapshots.
- Valuation version storage.
- Real export manifests or artifact checksums.
- Lender/provider integrations.
- Runtime job queues or notifications.
